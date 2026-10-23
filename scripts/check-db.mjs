import assert from "node:assert/strict";
import{players,clubs,careerHistory,mediaAssets,databaseStats,getPlayer,getClub,getCareer,getPlayerPhoto,getClubCrest,wordlePlayers}from"../src/db/queries.ts";
import{allPlayers}from"../src/catalog.ts";
import{playerId}from"../src/db/ids.ts";
import{officialSquads,totalOfficialSquadEntries}from"../src/db/currentSquads.ts";
const unique=(list,label)=>assert.equal(new Set(list).size,list.length,"Doppelte IDs: "+label);
assert.ok(players.length>=allPlayers.length,"Bei Migration gingen Legacy-Spieler verloren");
for(const p of allPlayers)assert.ok(players.some(item=>item.id===playerId(p.name)),"Legacy-Spieler fehlt: "+p.name);
assert.ok(clubs.length>=350,"Migration der Vereine und Karrierestationen unvollständig");
assert.ok(careerHistory.length>400,"Zu wenige Karriereverknüpfungen");
unique(players.map(p=>p.id),"Spieler");
unique(clubs.map(c=>c.id),"Clubs");
unique(careerHistory.map(c=>c.id),"Karrieren");
unique(mediaAssets.map(m=>m.id),"Fotos und Logos");
const playerIds=new Set(players.map(p=>p.id)),clubIds=new Set(clubs.map(c=>c.id));
const assetIds=new Set(mediaAssets.map(m=>m.id));
for(const player of players){
 assert.ok(player.name,"Spielername fehlt: "+player.id);
 if(player.country!==null)assert.ok(player.country.trim(),"Leere Nation "+player.name);
 if(player.birthYear!==null)assert.ok(Number.isInteger(player.birthYear)&&player.birthYear>=1900&&player.birthYear<=2010,"Ungültiger Jahrgang "+player.name);
 if(player.currentClubId!==null){
  assert.equal(player.status,"verified-current","Aktueller Verein ohne Prüfung "+player.name);
  assert.ok(clubIds.has(player.currentClubId),"Aktueller Verein unbekannt "+player.name);
  assert.equal(player.source.system,"official-club","Aktueller Spieler ohne Vereinsquelle "+player.name);
  assert.equal(player.source.checkedAt,"2026-10-23","Prüfdatum fehlt "+player.name);
  assert.ok(player.source.url?.startsWith("https://"),"Quell-URL fehlt "+player.name);
 }else assert.equal(player.status,"historical-only","Nicht verifizierter Spieler als aktuell gekennzeichnet "+player.name);
 if(player.referenceClubId)assert.ok(clubIds.has(player.referenceClubId),"Referenzverein unbekannt "+player.name);
 if(player.birthYear===null)assert.ok(player.currentClubId,"Spieler ohne Jahrgang und ohne verifizierten Kader "+player.name);
 if(player.portraitAssetId)assert.ok(assetIds.has(player.portraitAssetId),"Porträt fehlt bei "+player.name);
}
for(const club of clubs){
 if(club.currentLeague!==null){
  assert.equal(club.status,"verified-current","Klub-Liga ohne Beleg "+club.name);
  assert.equal(club.source.system,"official-club","Offizielle Vereinsquelle fehlt "+club.name);
  assert.ok(club.source.url?.startsWith("https://"),"Vereinsseite fehlt "+club.name);
 }else assert.equal(club.status,"historical-only","Unbelegte Liga als aktuell gekennzeichnet "+club.name);
 if(club.crestAssetId)assert.ok(assetIds.has(club.crestAssetId),"Wappen-Verweis fehlt: "+club.name);
}
for(const record of careerHistory){
 assert.ok(playerIds.has(record.playerId),"Verwaister Karriere-Spieler: "+record.id);
 assert.ok(clubIds.has(record.clubId),"Verwaister Karriere-Verein: "+record.id);
 if(record.kind==="ordered-career")assert.ok(record.order>0,"Karrierestation ohne Reihenfolge");
 if(record.kind==="known-affiliation")assert.equal(record.order,null,"Reihenfolge ohne Quellen behauptet");
}
for(const asset of mediaAssets){
 assert.ok(asset.sourcePage.startsWith("https://commons.wikimedia.org/wiki/File:"),
  "Media-Quelle fehlt: "+asset.id);
 assert.ok(asset.url.startsWith("https://commons.wikimedia.org/wiki/Special:FilePath/"),"Ungültiger Bildserver");
 assert.ok(asset.author&&asset.license&&asset.licenseUrl.startsWith("https://"),"Fehlende Medien-Lizenz: "+asset.id);
 assert.ok((asset.entityType==="player"?playerIds:clubIds).has(asset.entityId),"Bild hat kein zugehöriges Profil: "+asset.id);
}
assert.ok(databaseStats.photoCount>=11,"Zuwenig lizenzierte Spielerbilder");
assert.ok(databaseStats.crestCount>=2,"Zu wenige belegte Vereinswappen");
assert.ok(getPlayerPhoto(getPlayer("Cristiano Ronaldo"))?.license.includes("CC BY-SA"),"Cristiano-Foto fehlt");
assert.ok(getClubCrest(getClub("Borussia Dortmund")),"BVB-Wappen fehlt");
assert.ok(getCareer(getPlayer("Cristiano Ronaldo")).filter(x=>x.record.order!==null).length>=5,"Karrierechronologie fehlt");
assert.equal(officialSquads.length,10,"Erwartete 10 geprüfte Mannschaften");
assert.ok(totalOfficialSquadEntries>=200,"Zu wenige offizielle Kaderspieler erfasst");
assert.equal(databaseStats.verifiedClubs,officialSquads.length,"Nicht alle Vereinslisten übernommen");
assert.equal(databaseStats.verifiedPlayers,totalOfficialSquadEntries,"Doppeltes / verlorenes Kaderprofil");
for(const squad of officialSquads){
 assert.ok(squad.members.length>=20,"Unvollständige Teamliste: "+squad.club);
 assert.equal(squad.checkedAt,"2026-10-23");
 assert.ok(squad.sourceUrl.startsWith("https://"),"Quellenangabe fehlt: "+squad.club);
 unique(squad.members.map(p=>playerId(p.name)), "Kader "+squad.club);
 for(const member of squad.members){
  const player=getPlayer(member.name),club=getClub(squad.club);
  assert.ok(player&&club,"Kaderzuordnung fehlt: "+member.name);
  assert.equal(player.currentClubId,club.id,"Falscher aktueller Verein: "+member.name);
 }
}
assert.ok(wordlePlayers.length>=25,"Zu wenige verifiziert zugeordnete Spieler für Wordle");
for(const player of wordlePlayers){
 const record=getPlayer(player.name),club=getClub(player.club);
 assert.equal(record.currentClubId,club.id,"Wordle mit altem Vereinsnamen "+player.name);
 assert.ok(record.country&&record.birthYear,"Wordle-Metadaten unvollständig "+player.name);
}
assert.equal(getPlayer("Ederson").id===getPlayer("Éderson").id,false,"Ederson-Namenskollision");
assert.equal(getPlayer("Bernardo Silva")?.currentClubId,getClub("Real Madrid").id,"Bernardo Silva 2026/27 falsch zugeordnet");
assert.equal(getPlayer("João Cancelo")?.currentClubId,getClub("FC Barcelona").id,"João Cancelo 2026/27 falsch zugeordnet");
assert.equal(getPlayer("John Stones")?.currentClubId,getClub("Inter Mailand").id,"John Stones 2026/27 falsch zugeordnet");
console.log("FootyLab DB-Migration OK:",players.length,"Spieler,",clubs.length,"Clubs,",careerHistory.length,"Karrierestationen,",databaseStats.photoCount,"Fotos,",databaseStats.crestCount,"Wappen,",databaseStats.verifiedPlayers,"Spieler mit belegtem Kaderstand und",wordlePlayers.length,"aktuelle Wordle-Spieler");
