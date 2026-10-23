import assert from "node:assert/strict";
import {allPlayers,allClubs,leagueNames,playerByName,playablePlayers} from "../src/catalog.ts";
import {careers,gridBoards,mysteries} from "../src/gameData.ts";
function unique(items,label){assert.equal(new Set(items).size,items.length,"Doppelte Einträge: "+label)}
assert.ok(allPlayers.length>=280,"Spielerkatalog ist kleiner als geplant");
assert.ok(playablePlayers.length>=250,"Zu wenige mögliche Wordle-Lösungen");
assert.ok(allClubs.length>=100,"Vereinsdatenbank ist kleiner als geplant");
unique(allPlayers.map(p=>p.name),"Spielernamen");
unique(allClubs.map(c=>c.name),"Vereinsnamen");
assert.equal(playerByName.size,allPlayers.length);
for(const p of allPlayers){
 assert.ok(p.name.trim()&&p.club.trim()&&p.nation.trim(),"Unvollständiger Spieler: "+p.name);
 assert.ok(["Tor","Abwehr","Mittelfeld","Angriff"].includes(p.position),"Ungültige Position: "+p.name);
 assert.ok(p.birthYear>=1900&&p.birthYear<=2010,"Unplausibles Geburtsjahr: "+p.name);
 assert.ok(leagueNames.includes(p.league),"Unbekannte Liga: "+p.name);
}
for(const club of allClubs)assert.ok(leagueNames.includes(club.league)&&club.country,"Unvollständiger Verein");
for(const league of leagueNames)assert.ok(allPlayers.filter(p=>p.league===league).length>=25,"Zu wenige Spieler: "+league);
assert.ok(careers.length>=40,"Zu wenige Karrierefragen");
for(const q of careers){
 assert.ok(q.clubs.length>=1,"Karriere ohne Clubs: "+q.answer);
 assert.ok(q.choices.includes(q.answer),"Richtige Antwort fehlt: "+q.answer);
 unique(q.choices,"Karriereoptionen "+q.answer);
}
unique(careers.map(q=>q.answer),"Karrierefragen");
assert.ok(mysteries.length>=30,"Zu wenige Wer-bin-ich-Fragen");
for(const q of mysteries){
 assert.ok(q.choices.includes(q.answer),"Rätselantwort fehlt: "+q.answer);
 assert.equal(q.clues.length,4,"Nicht vier Hinweise: "+q.answer);
 assert.equal(q.choices.length,4,"Nicht vier Optionen: "+q.answer);
 unique(q.choices,"Wer-bin-ich-Optionen "+q.answer);
}
unique(mysteries.map(q=>q.answer),"Wer-bin-ich-Fragen");
assert.equal(gridBoards.length,3,"Nicht drei Grid-Rätsel");
for(const board of gridBoards){
 assert.equal(board.cells.length,9,"Ungültiges Grid: "+board.id);
 for(const cell of board.cells){
  assert.equal(cell.choices.length,4,"Keine vier Grid-Optionen: "+cell.answer);
  assert.ok(cell.choices.includes(cell.answer),"Richtige Gridantwort fehlt: "+cell.answer);
  unique(cell.choices,"Grid: "+board.id+" / "+cell.answer);
 }
}
console.log("FootyLab Datenprüfung erfolgreich:",allPlayers.length,"Spieler,",allClubs.length,"Vereine,",careers.length,"Karrierefragen,",mysteries.length,"Wer-bin-ich-Fragen,",gridBoards.length,"Grids");
