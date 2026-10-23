import type{League,Position}from"../catalog.ts";

/**
 * Öffentlich bestätigte Kader-Momentaufnahmen. KEINE API, keine Live-Updates.
 * Die Namen wurden aus den offiziellen Vereinsseiten / veröffentlichten
 * Kaderlisten der Saison 2026/27 übertragen und am 23.10.2026 geprüft.
 *
 * Niemals neue Spieler-Demografien aus Teamzugehörigkeit raten.
 * Einzelne Listen können auch Nachwuchsspieler des erweiterten Profikaders
 * umfassen. Bei Transferwechsel eine neue datierte Momentaufnahme erstellen.
 */
export type OfficialSquadMember={name:string;position:Position|null};
export type OfficialSquad={
 club:string;league:League;season:"2026/27";checkedAt:string;
 sourceUrl:string;sourceType:"official-squad"|"official-season-list";
 members:OfficialSquadMember[];
};
const checkedAt="2026-10-23";
const squads:OfficialSquad[]=[];
function add(
 club:string,league:League,sourceUrl:string,
 groups:{T?:string;A?:string;M?:string;S?:string;U?:string},
 sourceType:OfficialSquad["sourceType"]="official-squad"
){
 const codes:Record<string,Position|null>={T:"Tor",A:"Abwehr",M:"Mittelfeld",S:"Angriff",U:null};
 const members:OfficialSquadMember[]=Object.entries(groups).flatMap(([code,names])=>
  (names??"").split(";").map(name=>name.trim()).filter(Boolean).map(name=>({name,position:codes[code]}))
 );
 squads.push({club,league,sourceUrl,season:"2026/27",checkedAt,sourceType,members});
}
// BUNDESLIGA
add("Bayern München","Bundesliga","https://fcbayern.com/de/teams/profis",{
 T:"Manuel Neuer;Sven Ulreich;Jonas Urbig",
 A:"Dayot Upamecano;Min-jae Kim;Jonathan Tah;Nathaniel Brown;Alphonso Davies;Hiroki Ito;Sacha Boey;Josip Stanišić",
 M:"Joshua Kimmich;Tom Bischof;Jamal Musiala;Konrad Laimer;Bara Sapoko Ndiaye;Lennart Karl;Aleksandar Pavlović;David Santos Daiber",
 S:"Serge Gnabry;Harry Kane;Luis Díaz;Michael Olise;Ismael Saibari"
});
add("Borussia Dortmund","Bundesliga","https://www.bvb.de/de/de/aktuelles/news/news.html/2026/9/4/Das-ist-der-Kader-fuer-die-Champions-League-Saison-2026-27.html",{
 U:"Miguel Adje;Mathis Albert;Waldemar Anton;Maximilian Beier;Jobe Bellingham;Ramy Bensebaini;Carney Chukwuemeka;Enzo dos Santos;Patrick Drewes;Joane Gadou;Serhou Guirassy;Samuele Inacio;Mussa Kaba;Konstantinos Karetsas;Gregor Kobel;Filippo Mane;Alexander Meyer;Felix Nmecha;Ethan Nwaneri;Silas Ostrzinski;Kaua Prates;Luca Reggiani;Jan-Luca Riedl;Julian Ryerson;Marcel Sabitzer;Nico Schlotterbeck;Fabio Silva;Daniel Svensson;Joey Veerman"
},"official-season-list");
// LA LIGA
add("FC Barcelona","La Liga","https://www.fcbarcelona.com/en/football/first-team/players",{
 T:"Joan García;Wojciech Szczęsny;Dominik Livaković",
 A:"João Cancelo;Alejandro Balde;Pau Cubarsí;Xavi Espart;Andreas Christensen;Gerard Martín;Jules Koundé;Eric García",
 M:"Brian Fariñas;Gavi;Fermín López;Pedri;Rodri;Dani Olmo;Frenkie de Jong;Marc Bernal",
 S:"Gabriel Jesus;Lamine Yamal;Raphinha;Karim Adeyemi;Anthony Gordon;Roony Bardghji;Jesse Bisiwu;Hamza Abdelkarim"
});
add("Real Madrid","La Liga","https://www.realmadrid.com/en-US/news/football/first-team/latest-news/dorsales-del-real-madrid-para-la-temporada-2026-27-10-08-2026",{
 T:"Thibaut Courtois;Andriy Lunin",
 A:"Raúl Asencio;Éder Militão;Dean Huijsen;Trent Alexander-Arnold;Ibrahima Konaté;Marc Cucurella;Álvaro Carreras;Antonio Rüdiger;Ferland Mendy;Denzel Dumfries",
 M:"Jude Bellingham;Eduardo Camavinga;Federico Valverde;Aurélien Tchouaméni;Arda Güler;Bernardo Silva;Thiago",
 S:"Vinicius Junior;Endrick;Kylian Mbappé;Rodrygo;C. Espí;Brahim Díaz;Yan Diomande"
},"official-season-list");
// PREMIER LEAGUE
add("Manchester City","Premier League","https://www.mancity.com/players",{
 T:"Marcus Bettinelli;Gianluigi Donnarumma;Gerónimo Rulli",
 A:"Rayan Aït-Nouri;Kaden Braithwaite;Rúben Dias;Marc Guéhi;Joško Gvardiol;Abdukodir Khusanov;Rico Lewis;Matheus Nunes;Vitor Reis",
 M:"Elliot Anderson;Ayyoub Bouaddi;Rayan Cherki;Enzo Fernández;Phil Foden;Mateo Kovačić;Nico O'Reilly;Floyd Samba",
 S:"Allan;Jérémy Doku;Erling Haaland;Ryan McAidoo;Iliman Ndiaye;Antoine Semenyo"
});
// SERIE A
add("Inter Mailand","Serie A","https://www.inter.it/en/teams/first-team",{
 T:"Josep Martínez;Raffaele Di Gennaro;Ivan Provedel",
 A:"John Stones;Manuel Akanji;Benjamin Pavard;Carlos Augusto;Yann Bisseck;Federico Dimarco;Alessandro Bastoni;Djed Spence",
 M:"Aleksandar Stanković;Piotr Zieliński;Petar Sučić;Luis Henrique;Andy Diouf;Hakan Çalhanoğlu;Curtis Jones;Henrikh Mkhitaryan;Nicolò Barella",
 S:"Marcus Thuram;Lautaro Martínez;Ange-Yoan Bonny;Pio Esposito"
});
add("AC Mailand","Serie A","https://www.acmilan.com/en/teams/men-first-team",{
 T:"Lorenzo Torriani;Mike Maignan;Pietro Terracciano",
 A:"Davide Bartesaghi;Fikayo Tomori;Filippo Terracciano;Koni De Winter;Mario Gila;Matteo Gabbia;Pervis Estupiñán;Sankhoun Diawara;Strahinja Pavlović;Valeri Ivanov Vladimirov",
 M:"Adrien Rabiot;Alphadjo Cissé;Ardon Jashari;Christian Comotto;Christian Pulisic;Diego Moreira;Luka Modrić;Omari Hutchinson;Ruben Loftus-Cheek;Alexis Saelemaekers;Yunus Musah",
 S:"Francesco Camarda;Gonçalo Ramos;Samuel Chukwueze"
});
add("Juventus Turin","Serie A","https://www.juventus.com/en/teams/first-team-men/squad/",{
 T:"Kamil Grabara;Carlo Pinsoglio;Guglielmo Vicario;Norberto Murara Neto",
 A:"Mehmet Zeki Çelik;Bremer;Federico Gatti;Lloyd Kelly;Pierre Kalulu;Andrea Cambiaso;Daniele Rugani;Jhon Lucumí;Juan David Cabal",
 M:"Manuel Locatelli;Teun Koopmeiners;Douglas Luiz;Kerim Alajbegović;Khéphren Thuram;Weston McKennie;Pape Matar Sarr;Nicolás González",
 S:"Francisco Conceição;Randal Kolo Muani;Kenan Yıldız;Edon Zhegrova;Jeremie Boga;Arkadiusz Milik;Jeff Ekhator;Nick Woltemade"
});
// LIGUE 1
add("Paris Saint-Germain","Ligue 1","https://www.psg.fr/en/mens-football/squad",{
 T:"Alessandro Longoni;Lucas Chevalier;Matvey Safonov",
 A:"Achraf Hakimi;Lucas Beraldo;Marquinhos;Illia Zabarnyi;Lucas Digne;Lucas Hernández;Nuno Mendes;Willian Pacho",
 M:"Fabián Ruiz;Maghnes Akliouche;Vitinha;Senny Mayulu;Dro Fernández;Warren Zaïre-Emery;João Neves",
 S:"Khvicha Kvaratskhelia;Ferran Torres;Ousmane Dembélé;Désiré Doué;Mika Godts;Quentin Ndjantou"
});
add("AS Monaco","Ligue 1","https://www.asmonaco.com/en/pros/players",{
 T:"Lukáš Hrádecký;Philipp Köhn;Jules Stawiecki",
 A:"Vanderson;Jordan Teze;Christian Mawissa;Eric Dier;Flávio Nazinho;Mohammed Salisu;Samuel Nibombe;Sadibou Sané",
 M:"Denis Zakaria;Lamine Camara;Aleksandr Golovin;Stanis Idumbo;Takumi Minamino;Pape Cabral;Mamadou Coulibaly;Edan Diop",
 S:"Mathys Detourbet;Folarin Balogun;Matthis Abline;Mika Biereth;Paris Brunner;Ansu Fati"
});
export const officialSquads:readonly OfficialSquad[]=squads;
export const officialSquadsByClub=new Map(squads.map(s=>[s.club,s]));
export const totalOfficialSquadEntries=squads.reduce((n,s)=>n+s.members.length,0);
