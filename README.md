# FootyLab ⚽ — Fußball ist Kopfsache.

Kostenlose Fußball-Quiz-Arcade. Eigenständiges Magazin-/Sport-Design, vier Spiele, vollständig responsiv.

**Live-Adresse:** https://footylab.zmpfp75f5k.workers.dev/

## Spiele

| Pfad | Spiel | Funktionen |
| --- | --- | --- |
| `/` | Portal | Redaktionelle Startseite und Spielauswahl |
| `/games/higher-lower` | Higher or Lower | Marktwerte, Europapokal-Trophäen und Statistiken. 10 Fragen oder Endlosmodus; drei Schwierigkeitsgrade; automatischer Wechsel nach 1,65 s, rechte Karte wird zur nächsten linken Karte; lokale Bestwerte |
| `/games/career-path` | Career Path | 18 kuratierte Spielerkarrieren, 10 zufällige Fragen pro Runde, zufällige Antwortreihenfolge und automatischer Fragenwechsel |
| `/games/football-grid` | Football Grid | Drei unterschiedliche 3×3-Grids; Verein × Nationalität; je vier Antwortmöglichkeiten; Ergebnisse und neuer Durchlauf |
| `/games/wer-bin-ich` | Wer bin ich? | 12 bekannte Profis, bis zu vier Hinweise, Punkte abhängig von Hinweisanzahl, acht zufällige Fragen |
| `/bildnachweise` | Bildnachweise | Fotografen, Commons-Originale und CC-Lizenzen |

## Entwicklung lokal

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
npm run build
```

`npm run build` prüft TypeScript und erstellt die Website in `dist/`.

## Deployment

Das GitHub-Repository `drc2thn86g-beep/Footylab` ist mit Cloudflare Workers verbunden.

- Branch: `main`
- Build: `npm run build`
- Deploy: `npx wrangler deploy`
- Wrangler-Konfiguration: `wrangler.jsonc`, Assets aus `./dist`
- SPA-Fallback: `single-page-application` (direkte Links zu Spielseiten)
- GitHub Actions validiert nach jedem Push den Produktions-Build unter **Actions → FootyLab Build**.

## Struktur

- `src/main.tsx`: Portal, Navigation, Spielrouten und Bildnachweise
- `src/games.tsx`: die vier interaktiven Spiele, automatischer Wechsel, Punktelogik
- `src/data.ts`: Higher-or-Lower-Vergleichsdatensätze samt Quellen und Datenstand
- `src/gameData.ts`: Career Path, Football Grid und Wer bin ich?
- `src/media.ts`: kleine Liste lizenzierter Wikimedia-Commons-Spielerfotos inkl. Urheber und Lizenz
- `src/style.css`: individuelles, responsives Print-/Sport-Magazin-Design
- `public/favicon.svg`: selbst gestaltetes FootyLab-Favicon

## Daten & Bilder

Die Statistik- und Marktwertdaten sind **redaktionelle Momentaufnahmen**, kein Live-Feed. Quellen sind in Higher or Lower direkt verlinkt. Bei Änderungen stets Wettbewerbsbezug, Messdatum und Werte nachprüfen.

Einige Fotos sind frei lizenziert und werden über Wikimedia Commons eingebunden. Auf der Seite `/bildnachweise` sind zu jedem Foto Urheber, Lizenz und Quelldatei verlinkt. Spielerkarten ohne Bild erhalten einen eigens gestalteten Platzhalter; es werden keine ungeprüften offiziellen Vereinswappen eingebettet.

## Planung

Als nächste mögliche Verbesserungen eignen sich zusätzliche Quellen für Vereinswappen mit geklärten Nutzungsrechten, größere Spielerdatensätze, weitere Grid-Varianten und eine freiwillige Anmeldung für globale Bestenlisten. Bis dahin bleiben Bestwerte lokal im Browser gespeichert.

`README` ist Teil des offenen Fanprojekts.
