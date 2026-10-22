# FootyLab ⚽

Ein kostenloses Fußball-Minigame-Portal auf Basis von React, TypeScript, Vite und Cloudflare Workers.

## Seiten

- `/` – Startseite mit Spieleauswahl
- `/games/higher-lower` – Marktwert-, Trophäen- und Statistikvergleiche; Endlosmodus und 10-Fragen-Runde
- `/games/career-path` – Errate den Profi anhand seiner Vereinsstationen (8 Fragen)
- `/games/football-grid` – 3×3-Rätsel: Vereine × Nationalitäten

## Lokal starten

```bash
npm install
npm run dev
```

Für den Produktions-Build:

```bash
npm run build
```

## Deployment

GitHub-Repository: https://github.com/drc2thn86g-beep/Footylab

Cloudflare Workers ist an GitHub gekoppelt und baut bei Änderungen an `main` automatisch.

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Static assets directory:** `./dist` (in `wrangler.jsonc`)
- **SPA fallback:** `single-page-application` (damit die Spiel-Unterseiten auch per Direktlink funktionieren)

Öffentliche Testadresse: https://footylab.zmpfp75f5k.workers.dev/

## Inhalte ergänzen

- `src/data.ts`: Higher-or-Lower-Kategorien mit Werten, Datenstand und Quellen
- `src/gameData.ts`: Career-Path-Fragen sowie Antworten für Football Grid
- `src/main.tsx`: Seiten und Spiellogik
- `src/style.css`: Gemeinsames Layout und responsive Gestaltung

### Bilder und Vereinswappen

Die Vergleichskarten unterstützen ein optionales Feld `image` pro Datensatz-Eintrag:

```ts
{name: 'Beispielspieler', value: 100, image: '/images/beispielspieler.jpg'}
```

Fehlt das Bild oder ist die URL ungültig, erscheint automatisch eine gestaltete Karte mit Spieler- beziehungsweise Wappen-Symbol und Initialen.

**Wichtig:** Vor der Veröffentlichung echter Spielerfotos oder geschützter Vereinslogos bitte die Nutzungsrechte prüfen. Keine fremden Bilder ungeprüft übernehmen.

## Datenpflege

Die vorhandenen Marktwerte und Statistiken sind Momentaufnahmen, keine Live-Daten. Quellen und Stand sind bei Higher or Lower hinterlegt; vor Updates die Angaben mit den Originalquellen vergleichen. Karriere- und Grid-Daten sind zunächst redaktionell kuratierte Quizfragen.
