import assert from "node:assert/strict";
import{players,clubs,careerHistory,mediaAssets,databaseStats,getPlayer,getClub,getCareer,getPlayerPhoto,getClubCrest,wordlePlayers}from"../src/db/queries.ts";
import{allPlayers}from"../src/catalog.ts";
const unique=(list,label)=>assert.equal(new Set(list).size,list.length,"Doppelte IDs: "+label);
assert.equal(players.length,allPlayers.length,"Keine Legacy-Spieler bei Migration verlieren");
assert.ok(clubs.length>=350,"Migration der Vereine und Karrierestationen unvollständig");
assert.ok(careerHistory.length>400,"Zu wenige Karriereverknüpfungen");
unique(players.map(p=>p.id),"Spieler");
unique(clubs.map(c=>c.id),"Clubs");
unique(careerHistory.map(c=>c.id),"Karrieren");
unique(mediaAssets.map(m=>m.id),"Fotos und Logos");
const playerIds=new Set(players.map(p=>p.id)),clubIds=new Set(clubs.map(c=>c.id));
const assetIds=new Set(mediaAssets.map(m=>m.id));
for(const player of players){
 assert.ok(player.name&&player.country&&Number.isInteger(player.birthYear),"Unvollständiger Spieler "+player.id);
 assert.equal(player.status,"historical-only","Unbelegte Live-Information für "+player.name);
 assert.equal(player.currentClubId,null,"Nicht verifizierter aktueller Verein bei "+player.name);
 assert.ok(player.referenceClubId&&clubIds.has(player.referenceClubId),"Referenzverein fehlt für "+player.name);
 if(player.portraitAssetId)assert.ok(assetIds.has(player.portraitAssetId),"Porträt fehlt bei "+player.name);
}
for(const club of clubs){
 assert.equal(club.currentLeague,null,"Aktueller Ligenstatus wurde aus alten Daten geraten "+club.name);
 assert.equal(club.status,"historical-only","Nicht bestätigte aktuelle Liga bei "+club.name);
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
assert.equal(wordlePlayers.length,players.length,"Wordle sollte alle Spieler aus der zentralen Datenbank nutzen");
console.log("FootyLab DB-Migration OK:",players.length,"Spieler,",clubs.length,"Clubs,",careerHistory.length,"Karrierestationen,",databaseStats.photoCount,"Fotos,",databaseStats.crestCount,"Wappen");
