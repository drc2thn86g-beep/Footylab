import{apiFootballGet,ApiProviderError,LEAGUES,parseSquad,parseTeams}from"./apiFootball.ts";
import{leastRecentlySyncedTeams,stateGet,stateSet,type D1}from"./store.ts";

/** The free API-Football tier advertises 100 req/day.
 * 5 league discovery calls on the first/weekly run + max 32 squad calls = 37.
 * It intentionally takes several days to refresh every team and never
 * spends a quota request for a page view.
 */
const SEASON="2026";
const DISCOVERY_INTERVAL_DAYS=7;
const MAX_SQUADS_PER_RUN=32;
export type SyncResult={discovered:number;updatedTeams:number;updatedPlayers:number;failed:number;note:string};
function nowUtc(){return new Date().toISOString()}
function isRecent(date:string|null,days:number){
 if(!date)return false;
 const ms=Date.parse(date);
 return Number.isFinite(ms)&&Date.now()-ms<days*86400000&&Date.now()>=ms;
}
function errText(err:unknown){return err instanceof Error?err.message.slice(0,280):"Unbekannter Importfehler";}
function isAccessProblem(err:unknown){
 return err instanceof ApiProviderError &&
 (err.httpStatus===401||err.httpStatus===403||err.httpStatus===429||/Plan|Saison|Kontingent|eingeschränkt/.test(err.message));
}
export async function syncFootyData(db:D1,apiKey:string):Promise<SyncResult>{
 if(!apiKey.trim())throw new Error("API_FOOTBALL_KEY fehlt; kein API-Abruf ausgeführt");
 const started=nowUtc(),last=await stateGet(db,"last_start");
 // A manual restart cannot accidentally use the entire free daily request quota.
 if(isRecent(last,0.65))return{discovered:0,updatedTeams:0,updatedPlayers:0,failed:0,note:"Synchronisierung bereits in den letzten 16 Stunden gestartet"};
 await stateSet(db,"last_start",started);
 let discovered=0,updatedTeams=0,updatedPlayers=0,failed=0,lastProblem="";
 try{
  for(const league of LEAGUES){
   const key="league:"+league.id+":discovered";
   if(isRecent(await stateGet(db,key),DISCOVERY_INTERVAL_DAYS))continue;
   try{
    const data=await apiFootballGet("teams",{league:String(league.id),season:SEASON},apiKey);
    const teams=parseTeams(data,league);
    // Empty/restricted seasons must never overwrite successfully cached rosters.
    if(teams.length<10)throw new ApiProviderError("Keine vollständige aktuelle Teamliste für "+league.name+" verfügbar");
    await db.batch(teams.map(team=>db.prepare(
     "INSERT INTO api_teams (id,name,league_id,league,country,logo_url,last_synced_at) VALUES (?,?,?,?,?,?,NULL) ON CONFLICT(id) DO UPDATE SET name=excluded.name,league_id=excluded.league_id,league=excluded.league,country=excluded.country,logo_url=excluded.logo_url"
    ).bind(team.id,team.name,team.leagueId,team.league,team.country,team.logo)));
    discovered+=teams.length;
    await stateSet(db,key,nowUtc());
   }catch(err){
    failed++;lastProblem=errText(err);
    if(isAccessProblem(err))break; // Do not burn the free daily quota on repeated plan errors.
   }
  }
  const list=await leastRecentlySyncedTeams(db,MAX_SQUADS_PER_RUN);
  for(const team of list){
   try{
    const response=await apiFootballGet("players/squads",{team:String(team.id)},apiKey);
    const squad=parseSquad(response,team.id);
    const checkedAt=nowUtc();
    const statements=[
     ...squad.map(player=>db.prepare(
      "INSERT INTO api_players (id,name,age,position,shirt_number,photo_url,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,age=excluded.age,position=excluded.position,shirt_number=excluded.shirt_number,photo_url=excluded.photo_url,updated_at=excluded.updated_at"
     ).bind(player.id,player.name,player.age,player.position,player.number,player.photo,checkedAt)),
     db.prepare("DELETE FROM api_roster WHERE team_id=?").bind(team.id),
     ...squad.map(player=>db.prepare("INSERT INTO api_roster (team_id,player_id,checked_at) VALUES (?,?,?)").bind(team.id,player.id,checkedAt)),
     db.prepare("UPDATE api_teams SET last_synced_at=? WHERE id=?").bind(checkedAt,team.id)
    ];
    // Atomic per club: prior squad stays intact if a refresh is invalid or interrupted.
    await db.batch(statements);
    updatedTeams++;updatedPlayers+=squad.length;
   }catch(err){
    failed++;lastProblem=errText(err);
    if(isAccessProblem(err)||failed>=6)break;
   }
  }
  if(updatedTeams>0)await stateSet(db,"last_success",nowUtc());
  if(lastProblem)await stateSet(db,"last_error",lastProblem);
  else await stateSet(db,"last_error","");
  const result={discovered,updatedTeams,updatedPlayers,failed,
   note:updatedTeams?"Neue offizielle API-Kader gespeichert":lastProblem||"Keine Änderungen fällig"};
  await stateSet(db,"last_summary",JSON.stringify(result));
  return result;
 }catch(err){
  try{await stateSet(db,"last_error",errText(err))}catch{/* D1 uninitialized */}
  throw err;
 }
}
