import{apiFootballGet,ApiProviderError,LEAGUES,parseSquad,parseNamedTeam}from"./apiFootball.ts";
import{SEED_CLUBS}from"./seedClubs.ts";
import{leastRecentlySyncedTeams,stateGet,stateSet,type D1}from"./store.ts";

/** The free plan allows 100 requests/day AND only 10 requests/minute.
 * The seed directory comes from 2026/27 league participant lists, but every
 * club ID is looked up without a season. Squads are always the current ones.
 * Rediscovery is capped, failures are retried after seven days, and API
 * requests are paced to avoid 429 rate limits.
 */
const MAX_DISCOVERY_PER_RUN=8;
const RETRY_UNMATCHED_DAYS=7;
const MAX_SQUADS_PER_RUN=16;
const API_REQUEST_SPACING_MS=7000;
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
  let discoveryRequests=0;
  let lastApiRequestAt=0;
  async function paceApiRequest(){
   const wait=Math.max(0,lastApiRequestAt+API_REQUEST_SPACING_MS-Date.now());
   if(wait>0)await new Promise<void>(resolve=>setTimeout(resolve,wait));
   lastApiRequestAt=Date.now();
  }
  const storeClub=async(team:{id:number;name:string;leagueId:number;league:string;country:string;logo:string|null})=>{
   await db.prepare(
    "INSERT INTO api_teams (id,name,league_id,league,country,logo_url,last_synced_at) VALUES (?,?,?,?,?,?,NULL) ON CONFLICT(id) DO UPDATE SET name=excluded.name,league_id=excluded.league_id,league=excluded.league,country=excluded.country,logo_url=COALESCE(excluded.logo_url,api_teams.logo_url)"
   ).bind(team.id,team.name,team.leagueId,team.league,team.country,team.logo).run();
  };
  for(const seed of SEED_CLUBS){
   const league=LEAGUES.find(item=>item.id===seed.leagueId);
   if(!league)continue;
   const key="seed:2026:"+seed.leagueId+":"+seed.name;
   const previous=await stateGet(db,key);
   if(previous==="complete"||isRecent(previous,RETRY_UNMATCHED_DAYS))continue;
   // A confirmed official ID needs no lookup: Manchester United (33).
   if(seed.knownId){
    await storeClub({id:seed.knownId,name:seed.name,leagueId:league.id,
     league:league.name,country:league.country,logo:null});
    await stateSet(db,key,"complete");
    discovered++;
    continue;
   }
   if(discoveryRequests>=MAX_DISCOVERY_PER_RUN)break;
   discoveryRequests++;
   // On a failed name lookup, don't spend requests retrying it each day.
   await stateSet(db,key,nowUtc());
   try{
    await paceApiRequest();
    const data=await apiFootballGet("teams",{name:seed.name},apiKey);
    const team=parseNamedTeam(data,league,seed.name);
    if(!team)throw new ApiProviderError("Kein eindeutiger Verein gefunden: "+seed.name);
    await storeClub(team);
    await stateSet(db,key,"complete");
    discovered++;
   }catch(err){
    failed++;lastProblem=errText(err);
    if(isAccessProblem(err))break;
   }
  }
  const list=await leastRecentlySyncedTeams(db,MAX_SQUADS_PER_RUN);
  for(const team of list){
   try{
    await paceApiRequest();
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
