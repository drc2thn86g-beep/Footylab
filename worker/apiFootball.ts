/** API-Football adapter. No credentials or provider calls in browser code. */
export const LEAGUES=[
 {id:39,name:"Premier League",country:"England"},
 {id:140,name:"La Liga",country:"Spanien"},
 {id:78,name:"Bundesliga",country:"Deutschland"},
 {id:135,name:"Serie A",country:"Italien"},
 {id:61,name:"Ligue 1",country:"Frankreich"}
] as const;
export const PROVIDER_BASE="https://v3.football.api-sports.io";
export type ApiTeam={id:number;name:string;logo:string|null;leagueId:number;league:string;country:string};
export type ApiPlayer={id:number;name:string;age:number|null;position:string|null;number:number|null;photo:string|null};
type ApiResponse={response?:unknown[];results?:number;errors?:unknown};
export class ApiProviderError extends Error{
 constructor(message:string,readonly httpStatus?:number){super(message);this.name="ApiProviderError"}
}
function meaningfulErrors(value:unknown):boolean{
 if(Array.isArray(value))return value.length>0;
 if(value&&typeof value==="object")return Object.keys(value).length>0;
 return typeof value==="string"&&value.trim()!=="";
}
const positiveInt=(n:unknown)=>typeof n==="number"&&Number.isInteger(n)&&n>0;
const str=(value:unknown)=>typeof value==="string"?value.trim():"";
const httpUrl=(value:unknown):string|null=>{
 const s=str(value);
 try{const u=new URL(s);return u.protocol==="https:"?u.toString():null}catch{return null}
};
export async function apiFootballGet(path:"teams"|"players/squads",params:Record<string,string>,key:string,fetcher:typeof fetch=fetch):Promise<unknown[]>{
 if(!key.trim())throw new ApiProviderError("API-Schlüssel fehlt");
 const url=new URL(PROVIDER_BASE+"/"+path);
 for(const [k,v]of Object.entries(params))url.searchParams.set(k,v);
 let response:Response;
 try{response=await fetcher(url.toString(),{headers:{"x-apisports-key":key,"accept":"application/json"},signal:AbortSignal.timeout(12000)})}
 catch{throw new ApiProviderError("Keine Verbindung zur Fußball-API")}
 if(!response.ok)throw new ApiProviderError("Fußball-API lieferte HTTP "+response.status,response.status);
 let json:ApiResponse;
 try{json=await response.json() as ApiResponse}catch{throw new ApiProviderError("Ungültige API-Antwort")}
 if(meaningfulErrors(json.errors))throw new ApiProviderError("Provider meldet eingeschränkten oder fehlerhaften Zugriff (Plan/Saison/Kontingent überprüfen)");
 if(!Array.isArray(json.response))throw new ApiProviderError("API-Datenformat unerwartet");
 return json.response;
}
export function parseTeams(input:unknown[],league:(typeof LEAGUES)[number]):ApiTeam[]{
 const out:ApiTeam[]=[];
 for(const entry of input){
  if(!entry||typeof entry!=="object")continue;
  const group=entry as Record<string,unknown>,team=group.team;
  if(!team||typeof team!=="object")continue;
  const t=team as Record<string,unknown>;
  if(!positiveInt(t.id)||!str(t.name))continue;
  out.push({id:t.id as number,name:str(t.name),logo:httpUrl(t.logo),leagueId:league.id,league:league.name,country:league.country});
 }
 return [...new Map(out.map(team=>[team.id,team])).values()];
}
export function parseSquad(input:unknown[],teamId:number):ApiPlayer[]{
 const found=input.find(entry=>entry&&typeof entry==="object"&&
   ((entry as Record<string,unknown>).team as Record<string,unknown>|undefined)?.id===teamId) as Record<string,unknown>|undefined;
 if(!found||!Array.isArray(found.players))throw new ApiProviderError("Kein gültiger Kader für Team-ID "+teamId);
 const parsed:ApiPlayer[]=[];
 for(const entry of found.players){
  if(!entry||typeof entry!=="object")continue;
  const p=entry as Record<string,unknown>;
  if(!positiveInt(p.id)||!str(p.name))continue;
  parsed.push({
   id:p.id as number,name:str(p.name),age:typeof p.age==="number"&&p.age>=14&&p.age<=60?p.age:null,
   position:str(p.position)||null,number:typeof p.number==="number"&&Number.isInteger(p.number)?p.number:null,
   photo:httpUrl(p.photo)
  });
 }
 const unique=[...new Map(parsed.map(player=>[player.id,player])).values()];
 // Never publish a suspiciously short/empty response: provider access may be restricted.
 if(unique.length<11)throw new ApiProviderError("Unvollständiger Kader für Team-ID "+teamId+" ("+unique.length+" Spieler)");
 return unique;
}
