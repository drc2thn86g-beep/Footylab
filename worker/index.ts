import{listSquad,listTeams,stateGet,type D1}from"./store.ts";
import{syncFootyData}from"./sync.ts";

type Env={
 ASSETS:{fetch(request:Request):Promise<Response>};
 DB?:D1;
 API_FOOTBALL_KEY?:string;
 /** Opt-in only after confirming image/club-logo rights for this public website. */
 PUBLIC_API_IMAGES?:"1"|"0";
};
function json(data:unknown,status=200,maxAge=120){
 return new Response(JSON.stringify(data),{
  status,headers:{
   "content-type":"application/json; charset=utf-8",
   "cache-control":maxAge>0?"public, max-age="+maxAge:"no-store",
   "x-content-type-options":"nosniff",
  }
 });
}
function failure(status:number,message:string){return json({ok:false,error:message},status,0)}
async function handler(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);
 if(request.method!=="GET")return failure(405,"Nur GET-Anfragen sind erlaubt.");
 if(url.pathname==="/api/footy/status"){
  if(!env.DB)return json({ok:true,configured:false,provider:"API-Football",message:"Cloudflare D1 ist noch nicht verbunden. Die bestehenden Spiele laufen weiterhin."},200,0);
  try{
   const [lastSuccess,lastStart,lastError,lastSummary]=await Promise.all([
    stateGet(env.DB,"last_success"),stateGet(env.DB,"last_start"),stateGet(env.DB,"last_error"),stateGet(env.DB,"last_summary")
   ]);
   const [clubCount,playerCount]=await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS n FROM api_teams WHERE last_synced_at IS NOT NULL").first<{n:number}>(),
    env.DB.prepare("SELECT COUNT(DISTINCT player_id) AS n FROM api_roster").first<{n:number}>()
   ]);
   return json({ok:true,configured:!!env.API_FOOTBALL_KEY,provider:"API-Football",clubCount:clubCount?.n??0,playerCount:playerCount?.n??0,
    lastSuccess,lastStart,lastError:lastError||null,lastSummary:lastSummary?JSON.parse(lastSummary):null,
    imagesEnabled:env.PUBLIC_API_IMAGES==="1",message:env.API_FOOTBALL_KEY?"Täglicher Kaderimport vorbereitet":"API-Schlüssel noch nicht als Cloudflare-Secret hinterlegt"},200,0);
  }catch{return json({ok:true,configured:false,provider:"API-Football",message:"D1 vorhanden, aber Datenbankschema noch nicht angelegt."},200,0)}
 }
 if(!env.DB)return failure(503,"Automatische API-Kader sind noch nicht aktiviert (Cloudflare D1 fehlt).");
 if(url.pathname==="/api/footy/teams"){
  try{
   const items=await listTeams(env.DB);
   const complete=items.filter(item=>!!item.last_synced_at);
   return json({ok:true,provider:"API-Football",count:complete.length,teams:complete.map(team=>({
    id:team.id,name:team.name,league:team.league,country:team.country,
    checkedAt:team.last_synced_at,logo:env.PUBLIC_API_IMAGES==="1"?team.logo_url:null
   }))},200,120);
  }catch{return failure(503,"Cloudflare-Datenbank noch nicht eingerichtet.")}
 }
 if(url.pathname==="/api/footy/squad"){
  const id=Number(url.searchParams.get("team"));
  if(!Number.isSafeInteger(id)||id<=0)return failure(400,"Gültige numerische Team-ID erforderlich.");
  try{
   const allTeams=await listTeams(env.DB);
   const team=allTeams.find(t=>t.id===id&&!!t.last_synced_at);
   if(!team)return failure(404,"Dieser Verein wurde noch nicht synchronisiert.");
   const squad=await listSquad(env.DB,id);
   return json({ok:true,provider:"API-Football",team:{id:team.id,name:team.name,league:team.league,country:team.country,
    checkedAt:team.last_synced_at,logo:env.PUBLIC_API_IMAGES==="1"?team.logo_url:null},
    count:squad.length,
    players:squad.map(p=>({id:p.id,name:p.name,age:p.age,position:p.position,number:p.shirt_number,
      photo:env.PUBLIC_API_IMAGES==="1"?p.photo_url:null,checkedAt:p.checked_at}))
   },200,120);
  }catch{return failure(503,"Kaderdaten können momentan nicht gelesen werden.")}
 }
 return failure(404,"API-Endpunkt unbekannt");
}
export default{
 async fetch(request:Request,env:Env):Promise<Response>{
  if(new URL(request.url).pathname.startsWith("/api/"))return handler(request,env);
  return env.ASSETS.fetch(request);
 },
 async scheduled(_event:unknown,env:Env):Promise<void>{
  if(!env.DB||!env.API_FOOTBALL_KEY){
   console.log("FootyLab API-Football Sync deaktiviert: D1 oder API-Secret fehlt.");
   return;
  }
  try{
   const result=await syncFootyData(env.DB,env.API_FOOTBALL_KEY);
   console.log("FootyLab API-Football Sync",JSON.stringify(result));
  }catch(err){
   console.error("FootyLab API-Football Sync-Fehler:",err instanceof Error?err.message:"Unbekannter Fehler");
   throw err;
  }
 }
};
