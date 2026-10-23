# FootyLab — Fußball ist Kopfsache ⚽

Kostenloses Fußball-Minigame-Portal im Browser mit eigenständigem Print-/Sportmagazin-Design.

**Testseite:** https://footylab.zmpfp75f5k.workers.dev/  
**Repository:** https://github.com/drc2thn86g-beep/Footylab

## Spiele und Wege

| URL-Pfad | Spiel | Spielmechanik |
| --- | --- | --- |
| `/` | Spielauswahl | Eigenständige, mobile Startseite |
| `/games/higher-lower` | Higher or Lower | 9 Vergleichsdisziplinen als direkt sichtbare Auswahlfelder (ohne Disziplin-Dropdown), 10-Fragen- oder Endlosmodus, 3 Schwierigkeitsgrade, automatische Vergleichskette und lokale Rekorde |
| `/games/career-path` | Career Path | 43 Spielerkarrieren, 10 Fragen pro Runde; Klassisch (vier Antworten) oder Experte (freien Spielernamen eintippen); automatische Fragenfolge; Experte ohne unklare Ein-Verein-Rätsel |
| `/games/football-grid` | Football Grid | 3 Matrizen, Klassisch mit vier Antworten oder Experte mit freier Namenseingabe; 118 dokumentierte mögliche richtige Spieler-Feld-Kombinationen statt nur einer Musterlösung |
| `/games/wer-bin-ich` | Wer bin ich? | 31 Spieler mit vier Hinweisen, acht Fragen; Entspannt mit zwei Hinweisen, Klassisch mit vier Antworten, Profi mit freier Eingabe und doppelten Punkten; Hinweis- und Auflösen-Tasten |
| `/games/football-wordle` | Football Wordle | Spieler in acht Versuchen erraten; Freies Spiel und lokales Tagesrätsel; Hinweise zu Nation, Karriereverein, Liga, Position, Geburtsjahr (↑ jünger / ↓ älter), Autocomplete und gespeicherte Tages-Tipps |
| `/games/klubkompass` | Klubkompass | 251 internationale Klubs aus 21 historischen Heimatligen abseits der Top-5, Europa- oder Weltweit-Modus, 4 oder 6 Ligaoptionen, 12 Fragen ohne Liga-Wiederholung pro Runde, automatischer Wechsel |
| `/datenbank` | Datenbank | Suchbare Spieler- und Vereinsübersicht mit Liga- und Positionsfiltern |
| `/bildnachweise` | Bildnachweise | Lizenz, Urheber und Commons-Dateilink vorhandener Spielerbilder |

## Redaktioneller Spielerkatalog

Unter `src/catalog.ts` liegen **398 unterschiedliche Spieler** aus historischen Karrieren der Premier League, La Liga, Bundesliga, Serie A und Ligue 1 und **113 Vereinsnamen** als historische Referenzen für Wordle und die Datenbank. Die Jahrgänge sind ein statisches Merkmal.

**Wichtig:** Der beim Spieler angegebene Verein ist ein **Referenzverein aus seiner Karriere, nicht zwingend der gegenwärtige Klub**. Die Liga beschreibt dieselbe Referenzstation. Kein Kader-Live-Feed, keine automatischen Transferaktualisierungen und keine Behauptung einer lückenlosen Spielerliste für die Saison 2026/27. Der **neue Klubkompass** nutzt separat 251 Vereinsnamen aus 21 kleineren bzw. außereuropäischen Ligen (`src/worldClubs.ts`). Es handelt sich um historische/typische Ligazugehörigkeiten, nicht um eine Aussage zum aktuellen Aufstiegs-/Abstiegsstatus.

Marktwerte und Torstatistiken für Higher or Lower stehen separat in `src/data.ts` mit Quellen und Stand; sie dürfen nur mit belegter Quellenprüfung geändert werden. Die Daten sind Momentaufnahmen.

Karriere-Fragen, die drei Matrizen und Wer-bin-ich-Hinweise stehen in `src/gameData.ts`. Weitere gültige Grid-Lösungen werden anhand redaktioneller Karriere- und Clubdaten in `src/gridRules.ts` geprüft; noch nicht jeder denkbare Fußballprofi ist dort enthalten. Freie Namenseingaben und Akzenttoleranz sind in `src/GuessInput.tsx` und `src/normalize.ts` umgesetzt. Die überarbeiteten Spielkomponenten stehen in `src/ChallengeModes.tsx` und `src/ClubCompassImproved.tsx`.

## Datenbank 2.0 – Normalisierte Struktur (Oktober 2026)

Die Website nutzt eine zentrale, quellbewusste Datenbankschicht. Bei der Migration aus den bisherigen Listen gehen keine Spieler verloren:

- **398 Spieler** mit stabilen IDs, Geburtsjahr, Land, Position und eindeutiger Referenz.
- **379 Vereine** aus den Top-5-Ligen, internationalen Ligen und historischen Karrieren.
- **556 Karriereverknüpfungen**. Echte Reihenfolgen aus Career Path werden als chronologisch markiert; weitere bekannte Vereinsstationen werden **ohne erfundene Reihenfolge** gespeichert.
- **13 dokumentierte Spielerfotos** und **2 ausgewählte Vereinswappen**. Wo ein Bild fehlt, bleibt der eigene Fallback.
- **Keine erfundenen Live-Daten:** `currentClubId` und `currentLeague` stehen auf `null`, bis eine zuverlässige Quelle diese Felder bestätigt.

Dateien:
- `src/db/types.ts` – zentrale Typen für Spieler, Vereine, Karriereeinträge, Medien und Datenherkunft
- `src/db/ids.ts` – stabile IDs; bekannte Namenskollision Ederson/Éderson explizit berücksichtigt
- `src/db/seed.ts` – Migration der existierenden historischen Daten mit gesonderter Chronologie und Vereinsbeziehungen
- `src/db/media.ts` – Commons-Fotodateien und textbasierte Vereinswappen mit Autoren, Links und Lizenzen
- `src/db/queries.ts` – gemeinsame Datenbankabfragen für Spiele, Spielerprofile und Vereinsprofile
- `scripts/check-db.mjs` – referenzielle Integrität, Datenstatus und Bildquellen prüfen
- `scripts/export-db.mjs` – lokale Export-Dateien `players.json`, `clubs.json`, `career-history.json` und `media.json` als Vorbereitung für einen späteren Datenbankimport

```bash
npm run check:db
npm run db:export
```

Exporte liegen lokal unter `data/exports/` (nicht versioniert). Die Seite `/datenbank` zeigt jetzt aufklappbare Spielerprofile und historische Vereinsstationen bzw. bekannte Spieler eines Vereins. **Football Wordle und Football Grid** nutzen die zentrale Datenbankschicht statt eigener unverbundener Listen; Higher or Lower verwendet die gleiche Bildverwaltung.

**Grenzen:** Die Daten stammen weiterhin größtenteils aus dem redaktionellen bisherigen FootyLab-Katalog. Ein API-Abgleich der aktuellen Saison 2026/27 wurde noch nicht aktiviert. Vor produktivem Echtzeitbetrieb sind Anbieterzugriff, Lizenzbedingungen, Server-Caching und Quellenabgleich erforderlich.

## Bilder und Lizenzen

`src/db/media.ts` enthält die kuratierte Liste Wikimedia-Commons-Dateien samt Urhebern und Lizenzen. `src/media.ts` ist nur noch ein Kompatibilitäts-Export. Die Bilder werden nur eingeblendet, wenn ein URL-Eintrag vorhanden ist; andernfalls erscheint ein gestalteter Platzhalter. Es gibt bewusst **keinen ungeprüften Massenimport von Spielerfotos oder Vereinswappen**. Original- und Lizenzverweise: `/bildnachweise`.

## Entwicklung

Voraussetzung: Node.js 22+.

```bash
npm install
npm run dev
npm run check:data
npm run check:db
npm run db:export # optional
npm run build
```

`npm run check:data` prüft u. a. die Kataloggröße, Geburtsjahre, eindeutige Namen, Karrierefragen, 251 internationale Clubs, historische Grid-Lösungen und 31 Wer-bin-ich-Rätsel. GitHub Actions (`.github/workflows/build.yml`) führt die Datenprüfung, die neue Integritätsprüfung und den TypeScript/Vite-Produktions-Build nach jedem Push auf `main` aus.

## Deployment

Cloudflare Workers baut direkt vom GitHub-Branch `main`:
- Build: `npm run build`
- Deploy: `npx wrangler deploy`
- Statische Dateien: `./dist` aus `wrangler.jsonc`
- SPA-Fallback: `single-page-application`, damit alle Unterseiten direkt aufrufbar sind

Die automatische GitHub-Validierung und die Cloudflare-Veröffentlichung sind zwei getrennte Prozesse. Ein grüner GitHub-Build allein bestätigt noch nicht, dass Cloudflare die neueste Version veröffentlicht hat.

## Künftige Ideen

Größere vollständig geprüfte Datenfeeds und lizenzierte Spielerfotos, mehr Grids, mobile PWA-Unterstützung und später ein serverseitiger Freundes-Mehrspielermodus mit Raumcodes. Multiplayer erst nach Stabilisierung der Einzelspieler-Spiele. Keine API-Schlüssel in die Browser-Anwendung einbauen.

## Performance

Die sechs Spiele und die Datenbank werden über React.lazy und dynamische Imports erst beim Aufruf der jeweiligen Unterseite geladen. Die Startseite bleibt damit leichtgewichtig, und ein kurzer Ladehinweis deckt langsamere Verbindungen ab.

## Spielgefühl-Update (Oktober 2026)

- Direkte Disziplin-Karten und Modus-Schalter anstelle des bisherigen Disziplin-Dropdowns in Higher or Lower.
- Eingabe-Modi für Career Path, Football Grid und Wer bin ich? mit Akzent-unempfindlicher Namenssuche und Vorschlagsliste **erst während der Eingabe**.
- Im Experten-Grid werden mehrere historische Antworten akzeptiert. Gleiche Spieler dürfen nicht mehrfach im selben Grid verwendet werden. Die nächste freie Zelle öffnet automatisch nach dem Feedback.
- Wer bin ich? hat drei Schwierigkeitsgrade, einen sichtbaren Hinweise-Schalter, Punktkosten pro Hinweis sowie eine Auflösen-Funktion.
- Klubkompass enthält keine Top-5-Ligen mehr und bietet eine Europa-/Weltweit-Edition mit jeweils 4 bzw. 6 Antwortmöglichkeiten.

**Noch nicht umgesetzt:** Ein zuverlässiger automatischer API-Sync für die aktuellen Kader 2026/27 und eine lizenzierte Vollabdeckung der Spielerbilder. Historische Quizdaten bleiben ausdrücklich getrennt von zukünftigen aktuellen Spielerprofilen. Keine API-Credentials im Browser oder Repository speichern.
