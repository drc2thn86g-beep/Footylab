/** Exportiert die normalisierten redaktionellen Datenbankobjekte als JSON.
 * Nur manuell ausführen. Lädt weder Netzwerkdaten noch API-Schlüssel.
 * Die Dateien sind als Importvorbereitung für Cloudflare D1 gedacht. */
import{mkdir,writeFile}from"node:fs/promises";
import{resolve,join}from"node:path";
import{players,clubs,careerHistory,mediaAssets,databaseStats}from"../src/db/queries.ts";
const destination=resolve(process.cwd(),"data/exports");
await mkdir(destination,{recursive:true});
const header={
 schemaVersion:1,
 generatedAt:new Date().toISOString(),
 provenance:"FootyLab – redaktionelle historische Datenbank",
 verifiedCurrentData:false,
 note:"Aktueller Verein und aktuelle Liga sind null, bis eine verifizierte Quelle eingebunden wird."
};
for(const [file,records]of[
 ["players.json",players],
 ["clubs.json",clubs],
 ["career-history.json",careerHistory],
 ["media.json",mediaAssets]
]){
 const path=join(destination,file);
 await writeFile(path,JSON.stringify({...header,records},null,2)+"\n",{encoding:"utf8"});
 console.log("Exportiert:",path,"("+records.length+" Datensätze)");
}
await writeFile(join(destination,"manifest.json"),JSON.stringify({...header,stats:databaseStats,files:["players.json","clubs.json","career-history.json","media.json"]},null,2)+"\n");
console.log("Export abgeschlossen. Keine Live-Kaderdaten hinzugefügt.");
