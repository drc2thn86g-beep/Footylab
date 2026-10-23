# FootyLab: API-Football Integration (Stand 23.10.2026)

**Ziel:** Kader und Transfers aus einer API übernehmen, nicht mehr manuell im Quellcode aktualisieren. Die aktuellen Quizdaten bleiben bis zur erfolgreichen Aktivierung als Fallback verfügbar.

## Anbieter und Grenzen

- Dienst: https://dashboard.api-football.com/ (API-Football / API-Sports)
- Kostenloses Paket laut Anbieter: **100 API-Anfragen täglich**; verfügbare Saison-Daten können eingeschränkt sein.
- Schnittstellen:
  - \`GET /teams?league=39&season=2026\` für aktuelle Vereine (Analog 140,78,135,61 für andere Top-5-Ligen)
  - \`GET /players/squads?team=TEAM_ID\` für vollständigen aktuell registrierten Vereins-Kader mit Spieler-ID, Name, Alter, Position und Bild-Verweis.
- 2026 entspricht dem Anfangsjahr der Saison 2026/27. **Wichtig:** Erst nach realem Test mit dem eigenen Zugang ist klar, ob 2026 in dessen Gratisplan abrufbar ist.
- Täglich werden höchstens **32 Mannschaftskader** abgerufen. Die fünf Ligavereinslisten werden höchstens einmal in sieben Tagen abgefragt. So bleibt der Ablauf deutlich unter den 100 Anfragen/Tag.
- Komplett aktualisiert ist eine Liga erst nach mehreren täglichen Durchläufen; der genaue Stand steht in der Oberfläche.

## Einmalig aktivieren (lokal im Projekt)

**API-Schlüssel niemals per Chat, Screenshot oder GitHub veröffentlichen.**

1. Kostenlosen API-Football-Account im Dashboard registrieren und Zugriff auf \`players/squads\`, \`teams\` sowie Saison \`2026\` kontrollieren.
2. Cloudflare Wrangler authentifizieren: \`npx wrangler login\`.
3. D1-Datenbank erzeugen:

   \`\`\`bash
   npx wrangler d1 create footylab-data
   \`\`\`

   Die ausgegebene D1-Konfiguration in \`wrangler.jsonc\` ergänzen. **Binding muss \`DB\` heißen.** Der einzigartige \`database_id\` stammt von Cloudflare und darf nicht erraten werden. Entweder die Konfiguration über den CLI-Befehl übernehmen oder die ausgegebene ID eintragen.

   Beispiel (die UUID wird von Cloudflare vergeben):

   \`\`\`json
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "footylab-data",
         "database_id": "VON_CLOUDFLARE_ERSTELLTE_UUID"
       }
     ]
   }
   \`\`\`

   **Dieser Beispielblock darf nicht mit dem Platzhalter deployt werden.**
4. SQL-Schema anlegen (erst nach D1-Konfiguration):

   \`\`\`bash
   npx wrangler d1 migrations apply footylab-data --remote
   \`\`\`

5. Den API-Key als *Cloudflare Worker Secret* setzen (interaktive, nicht sichtbare Eingabe):

   \`\`\`bash
   npx wrangler secret put API_FOOTBALL_KEY
   \`\`\`

   Das Secret gehört zum Cloudflare-Worker \`footylab\`; **nicht** als \`VITE_...\`, GitHub Variable oder im Frontend-Code hinterlegen.
6. Konfiguration committen und veröffentlichen:

   \`\`\`bash
   npx wrangler deploy
   \`\`\`

   Bei bestehenden automatischen GitHub/Cloudflare-Deployments auch die aktualisierte \`wrangler.jsonc\` mit realer D1-ID ins Repository übernehmen, damit die Bindung bei weiteren Deployments erhalten bleibt.
7. Die Schnittstelle testen:
   - \`https://footylab.zmpfp75f5k.workers.dev/api/footy/status\`
   - \`https://footylab.zmpfp75f5k.workers.dev/datenbank\`
   - Die automatische Aktualisierung läuft **jeden Tag um 03:23 Uhr UTC**. Im Cloudflare-Dashboard kann ein geplanter Aufruf getestet werden; der Worker importiert automatisch die nächsten Teams.

**Alternative Dashboard-Konfiguration:** D1 und das API-Secret können im Cloudflare-Dashboard angelegt werden, aber die D1-Bindung mit ihrer echten ID muss anschließend zur Version von \`wrangler.jsonc\` im Repository passen.

## Architektur

- \`worker/index.ts\`: sicheres Backend, öffentliche *nur-lesende* Routen und Cron-Trigger; kein API-Key im Browser.
- \`worker/apiFootball.ts\`: API-Football-Adapter, Formatprüfung, Fehlererkennung (z. B. eingeschränkter Gratiszugang).
- \`worker/sync.ts\`: täglicher Rotations-Abgleich mit Budget (32 Kader und ggf. fünf Ligalisten), D1-Transaktionen pro Verein.
- \`worker/store.ts\`: D1-Abfragen und Cache.
- \`migrations/0001_api_football.sql\`: Tabellen für API-Teams, API-Spieler, Kaderzuordnung und Syncstatus.
- \`src/LiveSquads.tsx\`: Status und API-Kader auf der Datenbankseite.
- \`src/newGames.tsx\`: freies Wordle verwendet den synchronisierten Verein/Liga, sobald mindestens 20 ausreichend gut zuordenbare API-Spieler verfügbar sind. Ohne API bleibt das kuratierte Spiel funktionstüchtig.
- Tages-Wordle bleibt derzeit auf einem festen Pool, damit die Lösung während des Tages nicht durch einen automatischen Import wechselt.

### Warum keine API-Abfrage pro Nutzer?

Der Cron-Trigger ruft den Provider auf, danach lesen die Nutzer nur die lokal in D1 gespeicherten Daten. Dadurch ist der API-Key geschützt, und 100 Besucher verursachen **nicht** 100 Anfragen beim Anbieter.

### Schutz vor Fehlern

- Ungültige oder weniger als 11 Spieler umfassende Antworten überschreiben den alten Kader **nicht**.
- Ein kompletter gültiger Kader wird pro Verein in einer D1-Transaktion ersetzt.
- Jeder Verein bekommt den Zeitpunkt \`checkedAt\`.
- Doppelte, unterschiedlich alte Vereinseinträge desselben API-Spielers werden für Quizansichten zugunsten des zuletzt synchronisierten Eintrags gefiltert.
- Fehlerhafte/gesperrte Anbieterantworten werden angezeigt, ohne die gesamte Website lahmzulegen.
- Der Provider kann trotzdem selbst falsche Daten liefern. Sorgfalt und Datenkontrollen bleiben nötig.

## Bilder und Rechte

API-Football liefert Spielerfotos und Vereinslogos, besitzt nach seinen Nutzungsbedingungen jedoch **nicht automatisch alle nötigen Veröffentlichungsrechte**. Deswegen speichern wir zwar die URL als Metadatum, geben API-Fotos/Logos aber standardmäßig **nicht** öffentlich aus.

Erst nach Klärung der konkreten Nutzungsrechte kann beim Cloudflare Worker \`PUBLIC_API_IMAGES=1\` (normale Konfigurationsvariable) gesetzt werden. Diese Freischaltung ist absichtlich **nicht** Teil des Standard-Deployments. Frei lizenzierte und bereits belegte Commons-Fotos funktionieren weiterhin.

Quelle: https://www.api-football.com/terms

## Grenzen

Ohne vom Eigentümer bereitgestellte Cloudflare-D1-Bindung und API-Secret läuft **noch kein Live-Import**. Alle API-Endpunkte geben transparent \`configured:false\` oder einen passenden Fehler aus. Die bestehende statische Website und die Spiele bleiben verfügbar.

Wenn API-Football die Saison \`2026\` im kostenlosen Plan nicht freigibt, meldet der Import den Fehler und leert **keine** Kader. Dann muss zunächst die Freigabe durch den Anbieter geprüft oder eine andere zulässige Datenquelle ausgewählt werden. Ein kostenpflichtiges Upgrade wird nicht stillschweigend aktiviert.

## Entwicklung und Tests

\`\`\`bash
npm run check:api          # Mocks: keine echten Schlüssel oder Quota-Verbrauch
npm run check:db
npm run build
npx wrangler deploy --dry-run
\`\`\`
