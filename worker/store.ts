/** Narrow D1 interface – no @cloudflare/workers-types needed for local TS checking. */
export interface Prepared{
 bind(...values:(string|number|null)[]):Prepared;
 first<T=Record<string,unknown>>():Promise<T|null>;
 all<T=Record<string,unknown>>():Promise<{results:T[]}>;
 run():Promise<unknown>;
}
export interface D1{
 prepare(sql:string):Prepared;
 batch(statements:Prepared[]):Promise<unknown>;
}
export type DbTeam={id:number;name:string;league_id:number;league:string;country:string;logo_url:string|null;last_synced_at:string|null};
export type DbPlayer={id:number;name:string;age:number|null;position:string|null;shirt_number:number|null;photo_url:string|null};
export async function stateGet(db:D1,key:string):Promise<string|null>{
 const row=await db.prepare("SELECT value FROM api_sync_state WHERE key = ?").bind(key).first<{value:string}>();
 return row?.value??null;
}
export async function stateSet(db:D1,key:string,value:string):Promise<void>{
 await db.prepare("INSERT INTO api_sync_state (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(key,value).run();
}
export async function listTeams(db:D1):Promise<DbTeam[]>{
 const result=await db.prepare("SELECT id,name,league_id,league,country,logo_url,last_synced_at FROM api_teams ORDER BY league, name").all<DbTeam>();
 return result.results??[];
}
export async function listSquad(db:D1,teamId:number):Promise<(DbPlayer&{checked_at:string})[]>{
 const result=await db.prepare("SELECT p.id,p.name,p.age,p.position,p.shirt_number,p.photo_url,r.checked_at FROM api_roster r JOIN api_players p ON p.id=r.player_id WHERE r.team_id=? ORDER BY p.position,p.name").bind(teamId).all<DbPlayer&{checked_at:string}>();
 return result.results??[];
}
export async function leastRecentlySyncedTeams(db:D1,max:number):Promise<DbTeam[]>{
 const result=await db.prepare("SELECT id,name,league_id,league,country,logo_url,last_synced_at FROM api_teams ORDER BY (last_synced_at IS NOT NULL),last_synced_at,id LIMIT ?").bind(max).all<DbTeam>();
 return result.results??[];
}
