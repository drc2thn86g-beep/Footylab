# FootyLab — Fußball ist Kopfsache ⚽

Kostenloses Fußball-Minigame-Portal im Browser mit eigenständigem Print-/Sportmagazin-Design.

**Testseite:** https://footylab.zmpfp75f5k.workers.dev/  
**Repository:** https://github.com/drc2thn86g-beep/Footylab

## Spiele und Wege

| URL-Pfad | Spiel | Spielmechanik |
| --- | --- | --- |
| `/` | Spielauswahl | Eigenständige, mobile Startseite |
| `/games/higher-lower` | Higher or Lower | Marktwerte, Champions-League-Titel, Premier-League- und Bundesliga-Statistiken sowie Geburtsjahre. Automatische Vergleichskette ohne Weiter-Button, 10 Fragen oder Endlosmodus, drei Schwierigkeitsgrade, lokale Bestwerte |
| `/games/career-path` | Career Path | 43 redaktionelle Spielerkarrieren; 10 zufällige Fragen pro Runde; automatische Fragenfolge |
| `/games/football-grid` | Football Grid | Drei 3×3-Matrizen: Verein und Nationalität; vier Antwortmöglichkeiten je Feld |
| `/games/wer-bin-ich` | Wer bin ich? | 31 Spieler mit je vier Hinweisen; acht Fragen pro Runde; weniger Punkte je zusätzlichem Hinweis |
| `/games/football-wordle` | Football Wordle | Spieler in acht Versuchen erraten; Freies Spiel und lokales Tagesrätsel; Hinweise zu Nation, Karriereverein, Liga, Position, Geburtsjahr (↑ jünger / ↓ älter), Autocomplete und gespeicherte Tages-Tipps |
| `/games/klubkompass` | Klubkompass | 12 Fußballklubs einer historischen Heimatliga zuordnen; fünf Ligen; automatischer Fragenwechsel |
| `/bildnachweise` | Bildnachweise | Lizenz, Urheber und Commons-Dateilink vorhandener Spielerbilder |

## Redaktioneller Spielerkatalog

Unter `src/catalog.ts` liegen über **370 unterschiedliche Spieler** aus historischen Karrieren der Premier League, La Liga, Bundesliga, Serie A und Ligue 1 und über **100 Vereinsnamen** für das Ligaquiz. Die Jahrgänge sind ein statisches Merkmal.

**Wichtig:** Der beim Spieler angegebene Verein ist ein **Referenzverein aus seiner Karriere, nicht zwingend der gegenwärtige Klub**. Die Liga beschreibt dieselbe Referenzstation. Kein Kader-Live-Feed, keine automatischen Transferaktualisierungen und keine Behauptung einer lückenlosen Spielerliste für die Saison 2026/27. Der Klubkompass verwendet eine historische/typische Ligazugehörigkeit, nicht automatisch den aktuellen Aufstiegs-/Abstiegsstatus.

Marktwerte und Torstatistiken für Higher or Lower stehen separat in `src/data.ts` mit Quellen und Stand; sie dürfen nur mit belegter Quellenprüfung geändert werden. Die Daten sind Momentaufnahmen.

Karriere-Fragen, Football-Grid-Antworten und Wer-bin-ich-Hinweise stehen in `src/gameData.ts`.

## Bilder und Lizenzen

`src/media.ts` enthält eine kleine Liste Wikimedia-Commons-Dateien samt Urhebern und Lizenzen. Die Bilder werden nur eingeblendet, wenn ein URL-Eintrag vorhanden ist; andernfalls erscheint ein gestalteter Platzhalter. Es gibt bewusst **keinen ungeprüften Massenimport von Spielerfotos oder Vereinswappen**. Original- und Lizenzverweise: `/bildnachweise`.

## Entwicklung

Voraussetzung: Node.js 22+.

```bash
npm install
npm run dev
npm run check:data
npm run build
```

`npm run check:data` prüft u. a. die Kataloggröße, verschiedene Feldwerte, Geburtsjahre, eindeutige Spielernamen, Karrierefragen, Grid-Lösungen und Wer-bin-ich-Hinweise. GitHub Actions (`.github/workflows/build.yml`) führt diese Prüfung zusammen mit dem TypeScript/Vite-Produktions-Build nach jedem Push auf `main` aus.

## Deployment

Cloudflare Workers baut direkt vom GitHub-Branch `main`:
- Build: `npm run build`
- Deploy: `npx wrangler deploy`
- Statische Dateien: `./dist` aus `wrangler.jsonc`
- SPA-Fallback: `single-page-application`, damit alle Unterseiten direkt aufrufbar sind

Die automatische GitHub-Validierung und die Cloudflare-Veröffentlichung sind zwei getrennte Prozesse. Ein grüner GitHub-Build allein bestätigt noch nicht, dass Cloudflare die neueste Version veröffentlicht hat.

## Künftige Ideen

Größere vollständig geprüfte Datenfeeds und lizenzierte Spielerfotos, mehr Grids, mobile PWA-Unterstützung und später ein serverseitiger Freundes-Mehrspielermodus mit Raumcodes. Multiplayer erst nach Stabilisierung der Einzelspieler-Spiele. Keine API-Schlüssel in die Browser-Anwendung einbauen.
