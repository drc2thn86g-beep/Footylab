# FootyLab – aktuelle Kader mit API-Football

Stand: 28.10.2026. **Die API wurde mit einem echten kostenlosen Konto erfolgreich getestet**:
`GET /players/squads?team=33` lieferte 34 aktuelle Spieler von Manchester United.

## Warum keine Saison 2026 bei der API-Abfrage?

`GET /teams?league=39&season=2026` wurde beim kostenlosen Zugang
abgelehnt. Die API-Dokumentation erlaubt stattdessen:

- `GET /teams?name=Manchester City` – Vereins-ID ohne Saisonangabe suchen.
- `GET /players/squads?team=33` – aktuelle Kader ohne Saisonangabe laden.

Die Datei `worker/seedClubs.ts` enthält ein **verifiziertes Verzeichnis der 96
Teilnehmer der fünf großen europäischen Ligen 2026/27**, nicht die Spielerlisten.
Daraus sucht der Worker die Vereins-IDs schrittweise und ruft die Kader
anschließend direkt beim Anbieter ab. Im ersten Lauf ist Manchester United
mit der nachgewiesenen ID 33 schon ohne Suchabfrage nutzbar.

**Saisonneustart:** Das Teilnehmerverzeichnis muss nach Auf- und Abstiegen für
2027/28 neu geprüft werden. Transfers innerhalb der Saison werden automatisch
über neue Kaderantworten übernommen; eine erneute manuelle Spielerpflege
im Frontend ist nicht nötig.

Quellen für Teilnehmer 2026/27:
- England: https://www.premierleague.com/en/news/4365156/new-to-the-premier-league-heres-all-you-need-to-know
- Deutschland: https://www.bundesliga.com/en/bundesliga/clubs
- Spanien: https://www.laliga.com/en-US/laliga-easports/clubs
- Italien: https://www.eurosport.it/calcio/serie-a/2025-2026/quali-saranno-le-squadre-della-serie-a-2026-27-dallinter-campione-ditalia-al-monza-vincitore-dei-playoff-di-b_sto23304640/story.shtml
- Frankreich: https://www.lequipe.fr/collection/guide-ligue-1-2026-2027/

## Kosten- und Geschwindigkeitsbegrenzung

Der kostenlose API-Football-Tarif hat **100 Aufrufe/Tag** und **10
Aufrufe/Minute**. Der Import begrenzt deshalb pro Durchlauf die
Vereinssuche auf 8 Requests, die Kaderaktualisierung auf 16 Requests
und wartet mindestens 7 Sekunden zwischen zwei API-Abfragen.

Die ersten 96 Vereine werden über mehrere Tage hinweg entdeckt.
Erfolglose Vereinssuchen werden frühestens nach sieben Tagen wiederholt;
erfolgreiche IDs werden in Cloudflare D1 gespeichert und nicht ständig
neu abgefragt. Spielerlisten werden fortlaufend aus den aktuellen
API-Kadern aktualisiert. Eine 16-Stunden-Sperre verhindert versehentliche
Doppelimporte. Der tägliche Zeitplan ist 03:23 UTC (04:23 MEZ).

Quellen:
- https://www.api-football.com/documentation_v3
- https://www.api-football.com/news/post/how-ratelimit-works

## Cloudflare-Einrichtung

Production Worker: `footylab`
URL: https://footylab.zmpfp75f5k.workers.dev
D1-Datenbank: `footylab-data`, Binding: `DB`.
Die echte D1-ID steht in `wrangler.jsonc`.

Der API-Schlüssel wird **ausschließlich** als Production-Worker-Secret
`API_FOOTBALL_KEY` gespeichert. Nicht in GitHub einchecken oder in
Chatnachrichten bzw. Screenshots teilen!

Schema, falls eine neue Datenbank erstellt werden muss:

```bash
npx wrangler@latest d1 migrations apply footylab-data --remote
```

Build und Deployment:

```bash
git pull --ff-only
npm run check:api
npm run build
npx wrangler@latest deploy
```

Status prüfen: https://footylab.zmpfp75f5k.workers.dev/api/footy/status

## Einmaliger manueller Import (nur für Administration)

Der öffentliche POST-Endpunkt `/api/footy/import` ist **deaktiviert**,
solange das zusätzliche Worker-Secret `FOOTY_IMPORT_TOKEN` fehlt.
Ein Administrator kann für genau einen manuellen Test einen zufälligen
Token erzeugen, als Worker-Secret bereitstellen und im
`Authorization: Bearer ...`-Header senden. Den Token **nie** im
Frontend oder in URLs verwenden; nach dem Test wieder löschen.

Wenn zuvor bereits ein fehlgeschlagener Test lief, blockiert
`last_start` für 16 Stunden weitere Versuche. In diesem speziellen Fall
kann ein Administrator **einmalig** nur den Datensatz
`key='last_start'` aus `api_sync_state` entfernen, ohne
andere Tabellen oder Vereinsdaten zu ändern. Danach kann der einmalige
Import ausgeführt werden.

## Daten und Bildrechte

- `worker/index.ts`: HTTP API, geschützter Admin-Import, Cron.
- `worker/sync.ts`: D1-Synchronisation und Anfragenbudget.
- `worker/apiFootball.ts`: API-Football-Adapter mit Validierung.
- `worker/seedClubs.ts`: aktuelle Ligateilnehmer 2026/27.
- `worker/store.ts`: Datenbankzugriff.
- `src/LiveSquads.tsx`: Anzeige im Frontend.
- `src/DatabasePage.tsx`: Datenbankansicht.
- `migrations/0001_api_football.sql`: Tabellen.

Provider-Fotos und Logos sind mangels gesicherter Veröffentlichungsrechte
standardmäßig nicht öffentlich freigegeben (`PUBLIC_API_IMAGES=0`).
Das betrifft nicht die öffentlichen Spieler- und Vereinsnamen.
Ohne erfolgreiche API-Daten arbeiten die bestehenden statischen Spiele weiter.
