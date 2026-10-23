import{allPlayers,allClubs,playerClubHistory,leagueCountries}from"../catalog.ts";
import{careers}from"../gameData.ts";
import{worldClubs}from"../worldClubs.ts";
import{clubId,playerId}from"./ids.ts";
import{mediaAssets}from"./media.ts";
import type{ClubRecord,PlayerRecord,CareerRecord,SourceRef}from"./types.ts";

/** Erste Migration: vorhandene Quiz-Karrieren werden in Beziehungen überführt.
 * Wichtig: Dieser Katalog ist ausdrücklich historisch, kein verifizierter Live-Kader. */
const editorial:SourceRef={system:"editorial"};
const byClubId=new Map<string,ClubRecord>();
const aliases:Record<string,string>={
 "Barcelona":"FC Barcelona","Liverpool":"FC Liverpool","Tottenham":"Tottenham Hotspur",
 "Juventus":"Juventus Turin","Inter":"Inter Mailand","AC Milan":"AC Mailand",
 "PSG":"Paris Saint-Germain","Bayern":"Bayern München",
 "Roma":"AS Rom","Atletico Madrid":"Atlético Madrid",
 "Sporting Lissabon":"Sporting CP","Manchester Utd":"Manchester United"
};
function standardName(name:string):string{
 const plain=name.replace(/\s*\((?:Leihe|loan)\)\s*/gi,"").trim();
 return aliases[plain]??plain;
}
function registerClub(name:string,league:string|null=null,country:string|null=null):ClubRecord{
 const clean=standardName(name),id=clubId(clean);
 const existing=byClubId.get(id);
 if(existing){
  if(league&&!existing.historicalLeague)existing.historicalLeague=league;
  if(country&&!existing.country)existing.country=country;
  if(clean!==name&&!existing.aliases.includes(name))existing.aliases.push(name);
  return existing;
 }
 const club:ClubRecord={
  id,name:clean,aliases:clean===name?[]:[name],
  country,historicalLeague:league,currentLeague:null,
  crestAssetId:null,source:editorial,status:"historical-only"
 };
 byClubId.set(id,club);
 return club;
}
for(const club of allClubs)registerClub(club.name,club.league,club.country);
for(const club of worldClubs)registerClub(club.name,club.league,club.country);
for(const person of allPlayers)registerClub(person.club,person.league,leagueCountries[person.league]);
for(const clubs of playerClubHistory.values())for(const club of clubs)registerClub(club);
for(const question of careers)for(const club of question.clubs)registerClub(club);
export const clubs:ClubRecord[]=[...byClubId.values()].sort((a,b)=>a.name.localeCompare(b.name,"de"));
export const clubById:ReadonlyMap<string,ClubRecord>=new Map(clubs.map(club=>[club.id,club]));

const portraitIds=new Map(mediaAssets.filter(a=>a.kind==="portrait").map(a=>[a.entityId,a.id]));
export const players:PlayerRecord[]=allPlayers.map(p=>({
 id:playerId(p.name),name:p.name,country:p.nation,position:p.position,birthYear:p.birthYear,
 currentClubId:null,
 referenceClubId:registerClub(p.club,p.league,leagueCountries[p.league]).id,
 portraitAssetId:portraitIds.get(playerId(p.name))??null,
 source:editorial,status:"historical-only" as const
})).sort((a,b)=>a.name.localeCompare(b.name,"de"));
export const playerById:ReadonlyMap<string,PlayerRecord>=new Map(players.map(p=>[p.id,p]));

const histories:CareerRecord[]=[];
const seen=new Set<string>();
/** q.clubs besitzt eine dokumentierte Reihenfolge, während p.club nur die
 * Zugehörigkeit ohne Zeitangabe nachweist. Beide Arten sauber unterscheiden. */
for(const question of careers){
 const pid=playerId(question.answer);
 if(!playerById.has(pid))continue;
 question.clubs.forEach((original,i)=>{
  const club=registerClub(original);
  const loan=/\(\s*(Leihe|loan)\s*\)/i.test(original);
  const id=pid+":career:"+i+":"+club.id;
  histories.push({id,playerId:pid,clubId:club.id,order:i+1,isLoan:loan,kind:"ordered-career",source:editorial});
  seen.add(pid+"|"+club.id);
 });
}
for(const [name,history]of playerClubHistory){
 const pid=playerId(name);
 if(!playerById.has(pid))continue;
 for(const clubName of history){
  const club=registerClub(clubName);
  const key=pid+"|"+club.id;
  if(seen.has(key))continue;
  histories.push({id:pid+":associated:"+club.id,playerId:pid,clubId:club.id,order:null,isLoan:false,kind:"known-affiliation",source:editorial});
  seen.add(key);
 }
}
export const careerHistory:CareerRecord[]=histories;
export const careersByPlayerId:ReadonlyMap<string,CareerRecord[]>=( ()=>{
 const indexed=new Map<string,CareerRecord[]>();
 for(const career of careerHistory)indexed.set(career.playerId,[...(indexed.get(career.playerId)??[]),career]);
 return indexed;
})();
export const playersByClubId:ReadonlyMap<string,PlayerRecord[]>=( ()=>{
 const index=new Map<string,PlayerRecord[]>();
 for(const career of careerHistory){
  const player=playerById.get(career.playerId);
  if(!player)continue;
  const players=index.get(career.clubId)??[];
  if(!players.some(p=>p.id===player.id))players.push(player);
  index.set(career.clubId,players);
 }
 return index;
})();
