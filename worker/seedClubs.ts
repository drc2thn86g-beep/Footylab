/** 
 * Verified 2026/27 participants, used only for season-independent API-Football
 * team ID discovery. Player squads are fetched live via /players/squads?team=...
 * This club directory needs reviewing when promotion/relegation changes in 2027.
 *
 * League source directories:
 * https://www.premierleague.com/en/news/4365156/new-to-the-premier-league-heres-all-you-need-to-know
 * https://www.bundesliga.com/en/bundesliga/clubs
 * https://www.laliga.com/en-US/laliga-easports/clubs
 * https://www.eurosport.it/calcio/serie-a/2025-2026/quali-saranno-le-squadre-della-serie-a-2026-27-dallinter-campione-ditalia-al-monza-vincitore-dei-playoff-di-b_sto23304640/story.shtml
 * https://www.lequipe.fr/collection/guide-ligue-1-2026-2027/
 */
export type SeedClub = {leagueId:number; name:string; knownId?:number};
const DIRECT: SeedClub[] = [
 // The user verified the current 34-player squad of this API-Football ID.
 {leagueId:39,name:"Manchester United",knownId:33}
];
const GROUPS: ReadonlyArray<{leagueId:number;names:readonly string[]}> = [
 {leagueId:39,names:[
  "Manchester City","Arsenal","Liverpool","Chelsea","Tottenham","Newcastle United",
  "Aston Villa","Brighton","Brentford","Bournemouth","Crystal Palace","Everton",
  "Fulham","Nottingham Forest","Leeds United","Sunderland","Ipswich Town",
  "Hull City","Coventry City"
 ]},
 {leagueId:78,names:[
  "Bayern Munich","Borussia Dortmund","Bayer Leverkusen","RB Leipzig",
  "Eintracht Frankfurt","VfB Stuttgart","SC Freiburg","TSG Hoffenheim",
  "Borussia Monchengladbach","Werder Bremen","FC Augsburg","FSV Mainz 05",
  "Union Berlin","FC Koln","Hamburger SV","FC Schalke 04",
  "SV Elversberg","SC Paderborn 07"
 ]},
 {leagueId:140,names:[
  "Real Madrid","Barcelona","Atletico Madrid","Athletic Club","Real Sociedad",
  "Real Betis","Villarreal","Valencia","Sevilla","Celta Vigo","Osasuna",
  "Rayo Vallecano","Getafe","Espanyol","Alaves","Elche","Levante",
  "Malaga","Racing Santander","Deportivo La Coruna"
 ]},
 {leagueId:135,names:[
  "Inter","AC Milan","Juventus","Napoli","AS Roma","Lazio",
  "Atalanta","Fiorentina","Bologna","Como","Udinese","Sassuolo",
  "Genoa","Torino","Cagliari","Parma","Lecce","Monza","Venezia","Frosinone"
 ]},
 {leagueId:61,names:[
  "Paris Saint Germain","Marseille","Monaco","Lyon","Lille","Lens",
  "Rennes","Strasbourg","Nice","Toulouse","Brest","Lorient",
  "Auxerre","Angers","Le Havre","Paris FC","Troyes","Le Mans"
 ]}
];
export const SEED_CLUBS:readonly SeedClub[] = [
 ...DIRECT,
 ...GROUPS.flatMap(group=>group.names.map(name=>({leagueId:group.leagueId,name})))
];
