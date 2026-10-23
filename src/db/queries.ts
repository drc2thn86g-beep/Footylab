import{leagueNames,type League,type Player as LegacyPlayer}from"../catalog.ts";
import{playerId,clubId}from"./ids.ts";
import{players,clubs,careerHistory,playerById,clubById,careersByPlayerId,playersByClubId}from"./seed.ts";
import{mediaAssets}from"./media.ts";
import type{MediaAsset,PlayerRecord,ClubRecord,CareerRecord}from"./types.ts";

export{players,clubs,careerHistory,mediaAssets};
export type{PlayerRecord,ClubRecord,CareerRecord,MediaAsset};
const assetsById=new Map(mediaAssets.map(asset=>[asset.id,asset]));
export const getPlayer=(idOrName:string)=>playerById.get(idOrName.startsWith("player:")?idOrName:playerId(idOrName));
export const getClub=(idOrName:string)=>clubById.get(idOrName.startsWith("club:")?idOrName:clubId(idOrName));
export const getPlayerPhoto=(player:PlayerRecord)=>player.portraitAssetId?assetsById.get(player.portraitAssetId):undefined;
export const getClubCrest=(club:ClubRecord)=>club.crestAssetId?assetsById.get(club.crestAssetId):undefined;
export const getCareer=(player:PlayerRecord):{record:CareerRecord;club:ClubRecord}[]=>{
 return (careersByPlayerId.get(player.id)??[]).flatMap(record=>{
  const club=clubById.get(record.clubId);
  return club?[{record,club}]:[];
 }).sort((a,b)=>{
  if(a.record.order===null&&b.record.order===null)return a.club.name.localeCompare(b.club.name,"de");
  if(a.record.order===null)return 1;
  if(b.record.order===null)return -1;
  return a.record.order-b.record.order;
 });
};
export const getHistoricalPlayers=(club:ClubRecord)=>[...(playersByClubId.get(club.id)??[])].sort((a,b)=>a.name.localeCompare(b.name,"de"));
export const getReferenceClub=(player:PlayerRecord)=>player.referenceClubId?clubById.get(player.referenceClubId):undefined;
export const getCurrentClub=(player:PlayerRecord)=>player.currentClubId?clubById.get(player.currentClubId):undefined;
export const databaseStats={
 playerCount:players.length,clubCount:clubs.length,careerCount:careerHistory.length,
 photoCount:mediaAssets.filter(a=>a.kind==="portrait").length,
 crestCount:mediaAssets.filter(a=>a.kind==="crest").length,
 verifiedPlayers:players.filter(p=>p.status==="verified-current").length
};
const isLeague=(name:string|null):name is League=>name!==null&&(leagueNames as readonly string[]).includes(name);
/** Compatibility projection for Wordle: keeps existing hints while using canonical IDs.
 * The league/club fields are clearly marked as historic references, NOT live transfers. */
export const wordlePlayers:LegacyPlayer[]=players.flatMap(player=>{
 const club=getReferenceClub(player);
 if(!club||!isLeague(club.historicalLeague))return[];
 return [{name:player.name,nation:player.country,position:player.position,birthYear:player.birthYear,club:club.name,league:club.historicalLeague}];
});
export const playableWordlePlayers=wordlePlayers.filter(p=>p.birthYear>=1975);
export const wordleByName=new Map(wordlePlayers.map(p=>[p.name,p]));
