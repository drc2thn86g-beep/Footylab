// Redaktioneller, historischer Rätselkatalog. Ein Referenzverein ist ein Verein aus
// der Karriere des Spielers und NICHT zwingend sein aktueller Verein (Stand 2026).
// Geburtsjahre sind stabile Merkmale. Neue Spieler zentral hier ergänzen.
export type League="Premier League"|"La Liga"|"Bundesliga"|"Serie A"|"Ligue 1";
export type Position="Tor"|"Abwehr"|"Mittelfeld"|"Angriff";
export type Player={name:string;nation:string;position:Position;birthYear:number;club:string;league:League};
export type Club={name:string;league:League;country:string};
export const leagueCountries:Record<League,string>={
 "Premier League":"England","La Liga":"Spanien","Bundesliga":"Deutschland","Serie A":"Italien","Ligue 1":"Frankreich"
};
const players:Player[]=[];
const positions:Record<string,Position>={T:"Tor",A:"Abwehr",M:"Mittelfeld",S:"Angriff"};
function add(league:League,club:string,raw:string){
 for(const row of raw.split(";")){
  const line=row.trim();if(!line)continue;
  const [name,nation,position,year]=line.split("|");
  const birthYear=Number(year);
  if(!name||!nation||!positions[position]||!Number.isInteger(birthYear))throw Error("Ungültiger Spieler: "+line);
  players.push({name,nation,position:positions[position],birthYear,club,league});
 }
}
// ENGLAND – Spieler waren für den genannten Klub aktiv, darunter ehemalige Profis.
add("Premier League","Manchester City", "Erling Haaland|Norwegen|S|2000;Phil Foden|England|M|2000;Kevin De Bruyne|Belgien|M|1991;Rodri|Spanien|M|1996;Bernardo Silva|Portugal|M|1994;Rúben Dias|Portugal|A|1997;John Stones|England|A|1994;Ederson|Brasilien|T|1993;Jack Grealish|England|S|1995;Julián Álvarez|Argentinien|S|2000;Jérémy Doku|Belgien|S|2002;İlkay Gündoğan|Deutschland|M|1990");
add("Premier League","Arsenal", "Bukayo Saka|England|S|2001;Martin Ødegaard|Norwegen|M|1998;Declan Rice|England|M|1999;William Saliba|Frankreich|A|2001;Gabriel Magalhães|Brasilien|A|1997;Gabriel Martinelli|Brasilien|S|2001;Ben White|England|A|1997;David Raya|Spanien|T|1995;Kai Havertz|Deutschland|S|1999;Leandro Trossard|Belgien|S|1994;Jurriën Timber|Niederlande|A|2001");
add("Premier League","FC Liverpool","Mohamed Salah|Ägypten|S|1992;Virgil van Dijk|Niederlande|A|1991;Alisson Becker|Brasilien|T|1992;Trent Alexander-Arnold|England|A|1998;Alexis Mac Allister|Argentinien|M|1998;Dominik Szoboszlai|Ungarn|M|2000;Cody Gakpo|Niederlande|S|1999;Luis Díaz|Kolumbien|S|1997;Darwin Núñez|Uruguay|S|1999;Florian Wirtz|Deutschland|M|2003;Andrew Robertson|Schottland|A|1994");
add("Premier League","Manchester United","Bruno Fernandes|Portugal|M|1994;Marcus Rashford|England|S|1997;Alejandro Garnacho|Argentinien|S|2004;Amad Diallo|Elfenbeinküste|S|2002;Kobbie Mainoo|England|M|2005;Casemiro|Brasilien|M|1992;Harry Maguire|England|A|1993;Lisandro Martínez|Argentinien|A|1998;André Onana|Kamerun|T|1996;Manuel Ugarte|Uruguay|M|2001;Rasmus Højlund|Dänemark|S|2003;Mason Mount|England|M|1999");
add("Premier League","Chelsea","Cole Palmer|England|M|2002;Reece James|England|A|1999;Enzo Fernández|Argentinien|M|2001;Moisés Caicedo|Ecuador|M|2001;Nicolas Jackson|Senegal|S|2001;Noni Madueke|England|S|2002;Pedro Neto|Portugal|S|2000;Marc Cucurella|Spanien|A|1998;Levi Colwill|England|A|2003;Robert Sánchez|Spanien|T|1997;Christopher Nkunku|Frankreich|S|1997;João Félix|Portugal|S|1999");
add("Premier League","Tottenham Hotspur","Son Heung-min|Südkorea|S|1992;James Maddison|England|M|1996;Dejan Kulusevski|Schweden|S|2000;Cristian Romero|Argentinien|A|1998;Micky van de Ven|Niederlande|A|2001;Richarlison|Brasilien|S|1997;Harry Kane|England|S|1993");
add("Premier League","Newcastle United","Alexander Isak|Schweden|S|1999;Bruno Guimarães|Brasilien|M|1997;Anthony Gordon|England|S|2001;Sandro Tonali|Italien|M|2000;Kieran Trippier|England|A|1990;Joelinton|Brasilien|M|1996");
add("Premier League","Aston Villa","Ollie Watkins|England|S|1995;Morgan Rogers|England|M|2002;Emiliano Martínez|Argentinien|T|1992;Youri Tielemans|Belgien|M|1997;John McGinn|Schottland|M|1994");
add("Premier League","Everton","Jordan Pickford|England|T|1994;Dominic Calvert-Lewin|England|S|1997;Jarrad Branthwaite|England|A|2002");
add("Premier League","Brighton & Hove Albion","Kaoru Mitoma|Japan|S|1997;João Pedro|Brasilien|S|2001;Pervis Estupiñán|Ecuador|A|1998");
// SPANIEN
add("La Liga","Real Madrid","Kylian Mbappé|Frankreich|S|1998;Vinicius Junior|Brasilien|S|2000;Jude Bellingham|England|M|2003;Rodrygo|Brasilien|S|2001;Federico Valverde|Uruguay|M|1998;Eduardo Camavinga|Frankreich|M|2002;Aurélien Tchouaméni|Frankreich|M|2000;Antonio Rüdiger|Deutschland|A|1993;Thibaut Courtois|Belgien|T|1992;Dani Carvajal|Spanien|A|1992;Arda Güler|Türkei|M|2005;Toni Kroos|Deutschland|M|1990;Karim Benzema|Frankreich|S|1987;Luka Modrić|Kroatien|M|1985;Sergio Ramos|Spanien|A|1986");
add("La Liga","FC Barcelona","Lamine Yamal|Spanien|S|2007;Pedri|Spanien|M|2002;Gavi|Spanien|M|2004;Raphinha|Brasilien|S|1996;Robert Lewandowski|Polen|S|1988;Frenkie de Jong|Niederlande|M|1997;Ronald Araújo|Uruguay|A|1999;Jules Koundé|Frankreich|A|1998;Pau Cubarsí|Spanien|A|2007;Alejandro Balde|Spanien|A|2003;Dani Olmo|Spanien|M|1998;Marc-André ter Stegen|Deutschland|T|1992;Lionel Messi|Argentinien|S|1987;Neymar|Brasilien|S|1992;Luis Suárez|Uruguay|S|1987");
add("La Liga","Atlético Madrid","Antoine Griezmann|Frankreich|S|1991;Julián Simeone|Argentinien|S|2002;Jan Oblak|Slowenien|T|1993;Marcos Llorente|Spanien|M|1995;Koke|Spanien|M|1992;José María Giménez|Uruguay|A|1995;Rodrigo De Paul|Argentinien|M|1994;Álvaro Morata|Spanien|S|1992;Nahuel Molina|Argentinien|A|1998");
add("La Liga","Athletic Bilbao","Nico Williams|Spanien|S|2002;Iñaki Williams|Ghana|S|1994;Unai Simón|Spanien|T|1997;Oihan Sancet|Spanien|M|2000;Dani Vivian|Spanien|A|1999");
add("La Liga","Real Sociedad","Mikel Oyarzabal|Spanien|S|1997;Martín Zubimendi|Spanien|M|1999;Takefusa Kubo|Japan|S|2001;Brais Méndez|Spanien|M|1997;Álex Remiro|Spanien|T|1995");
add("La Liga","FC Sevilla","Jesús Navas|Spanien|A|1985;Youssef En-Nesyri|Marokko|S|1997;Ivan Rakitić|Kroatien|M|1988;Sergio Reguilón|Spanien|A|1996");
add("La Liga","Villarreal","Gerard Moreno|Spanien|S|1992;Álex Baena|Spanien|M|2001;Dani Parejo|Spanien|M|1989;Pau Torres|Spanien|A|1997");
add("La Liga","Real Betis","Isco|Spanien|M|1992;Nabil Fekir|Frankreich|M|1993;Giovani Lo Celso|Argentinien|M|1996;Ayoze Pérez|Spanien|S|1993");
// DEUTSCHLAND
add("Bundesliga","Bayern München","Jamal Musiala|Deutschland|M|2003;Michael Olise|Frankreich|S|2001;Harry Kane|England|S|1993;Joshua Kimmich|Deutschland|M|1995;Alphonso Davies|Kanada|A|2000;Dayot Upamecano|Frankreich|A|1998;Min-jae Kim|Südkorea|A|1996;Manuel Neuer|Deutschland|T|1986;Thomas Müller|Deutschland|S|1989;Leroy Sané|Deutschland|S|1996;Leon Goretzka|Deutschland|M|1995;Serge Gnabry|Deutschland|S|1995;Kingsley Coman|Frankreich|S|1996");
add("Bundesliga","Borussia Dortmund","Julian Brandt|Deutschland|M|1996;Karim Adeyemi|Deutschland|S|2002;Serhou Guirassy|Guinea|S|1996;Nico Schlotterbeck|Deutschland|A|1999;Gregor Kobel|Schweiz|T|1997;Emre Can|Deutschland|M|1994;Jamie Gittens|England|S|2004;Mats Hummels|Deutschland|A|1988;Marco Reus|Deutschland|M|1989;Jadon Sancho|England|S|2000");
add("Bundesliga","Bayer Leverkusen","Florian Wirtz|Deutschland|M|2003;Granit Xhaka|Schweiz|M|1992;Victor Boniface|Nigeria|S|2000;Patrik Schick|Tschechien|S|1996;Jeremie Frimpong|Niederlande|A|2000;Alejandro Grimaldo|Spanien|A|1995;Jonathan Tah|Deutschland|A|1996;Lukáš Hrádecký|Finnland|T|1989;Exequiel Palacios|Argentinien|M|1998");
add("Bundesliga","RB Leipzig","Xavi Simons|Niederlande|M|2003;Benjamin Šeško|Slowenien|S|2003;Loïs Openda|Belgien|S|2000;David Raum|Deutschland|A|1998;Willi Orbán|Ungarn|A|1992;Péter Gulácsi|Ungarn|T|1990;Dani Olmo|Spanien|M|1998");
add("Bundesliga","VfB Stuttgart","Deniz Undav|Deutschland|S|1996;Angelo Stiller|Deutschland|M|2001;Chris Führich|Deutschland|S|1998;Alexander Nübel|Deutschland|T|1996;Maximilian Mittelstädt|Deutschland|A|1997;Ermedin Demirović|Bosnien und Herzegowina|S|1998;Nick Woltemade|Deutschland|S|2002");
add("Bundesliga","Eintracht Frankfurt","Omar Marmoush|Ägypten|S|1999;Hugo Ekitiké|Frankreich|S|2002;Mario Götze|Deutschland|M|1992;Robin Koch|Deutschland|A|1996;Kevin Trapp|Deutschland|T|1990;Ansgar Knauff|Deutschland|S|2002");
add("Bundesliga","SC Freiburg","Vincenzo Grifo|Italien|M|1993;Matthias Ginter|Deutschland|A|1994;Ritsu Dōan|Japan|S|1998;Noah Atubolu|Deutschland|T|2002");
add("Bundesliga","Borussia Mönchengladbach","Tim Kleindienst|Deutschland|S|1995;Franck Honorat|Frankreich|S|1996;Alassane Pléa|Frankreich|S|1993;Florian Neuhaus|Deutschland|M|1997");
add("Bundesliga","Werder Bremen","Marvin Ducksch|Deutschland|S|1994;Jens Stage|Dänemark|M|1996;Mitchell Weiser|Deutschland|A|1994;Michael Zetterer|Deutschland|T|1995");
// ITALIEN
add("Serie A","Inter Mailand","Lautaro Martínez|Argentinien|S|1997;Marcus Thuram|Frankreich|S|1997;Nicolò Barella|Italien|M|1997;Hakan Çalhanoğlu|Türkei|M|1994;Alessandro Bastoni|Italien|A|1999;Federico Dimarco|Italien|A|1997;Yann Sommer|Schweiz|T|1988;Henrikh Mkhitaryan|Armenien|M|1989;Denzel Dumfries|Niederlande|A|1996;Davide Frattesi|Italien|M|1999");
add("Serie A","AC Mailand","Rafael Leão|Portugal|S|1999;Christian Pulisic|USA|S|1998;Theo Hernández|Frankreich|A|1997;Mike Maignan|Frankreich|T|1995;Tijjani Reijnders|Niederlande|M|1998;Fikayo Tomori|England|A|1997;Samuel Chukwueze|Nigeria|S|1999;Santiago Giménez|Mexiko|S|2001");
add("Serie A","Juventus Turin","Dušan Vlahović|Serbien|S|2000;Kenan Yıldız|Türkei|S|2005;Manuel Locatelli|Italien|M|1998;Federico Gatti|Italien|A|1998;Bremer|Brasilien|A|1997;Andrea Cambiaso|Italien|A|2000;Timothy Weah|USA|S|2000;Wojciech Szczęsny|Polen|T|1990;Federico Chiesa|Italien|S|1997");
add("Serie A","SSC Neapel","Khvicha Kvaratskhelia|Georgien|S|2001;Victor Osimhen|Nigeria|S|1998;Scott McTominay|Schottland|M|1996;Stanislav Lobotka|Slowakei|M|1994;Giovanni Di Lorenzo|Italien|A|1993;Alex Meret|Italien|T|1997;Romelu Lukaku|Belgien|S|1993;Matteo Politano|Italien|S|1993");
add("Serie A","AS Rom","Paulo Dybala|Argentinien|S|1993;Lorenzo Pellegrini|Italien|M|1996;Gianluca Mancini|Italien|A|1996;Mile Svilar|Serbien|T|1999;Artem Dovbyk|Ukraine|S|1997;Leandro Paredes|Argentinien|M|1994");
add("Serie A","Atalanta Bergamo","Ademola Lookman|Nigeria|S|1997;Charles De Ketelaere|Belgien|M|2001;Giorgio Scalvini|Italien|A|2003;Éderson|Brasilien|M|1999;Mateo Retegui|Italien|S|1999");
add("Serie A","Lazio Rom","Mattia Zaccagni|Italien|S|1995;Boulaye Dia|Senegal|S|1996;Alessio Romagnoli|Italien|A|1995;Ivan Provedel|Italien|T|1994");
add("Serie A","AC Florenz","Moise Kean|Italien|S|2000;David de Gea|Spanien|T|1990;Rolando Mandragora|Italien|M|1997;Dodô|Brasilien|A|1998");
add("Serie A","Bologna FC","Riccardo Orsolini|Italien|S|1997;Lewis Ferguson|Schottland|M|1999;Dan Ndoye|Schweiz|S|2000;Santiago Castro|Argentinien|S|2004");
// FRANKREICH
add("Ligue 1","Paris Saint-Germain","Ousmane Dembélé|Frankreich|S|1997;Désiré Doué|Frankreich|S|2005;Bradley Barcola|Frankreich|S|2002;Vitinha|Portugal|M|2000;João Neves|Portugal|M|2004;Achraf Hakimi|Marokko|A|1998;Marquinhos|Brasilien|A|1994;Nuno Mendes|Portugal|A|2002;Gianluigi Donnarumma|Italien|T|1999;Khvicha Kvaratskhelia|Georgien|S|2001;Presnel Kimpembe|Frankreich|A|1995;Warren Zaïre-Emery|Frankreich|M|2006");
add("Ligue 1","Olympique Marseille","Mason Greenwood|England|S|2001;Pierre-Emerick Aubameyang|Gabun|S|1989;Adrien Rabiot|Frankreich|M|1995;Leonardo Balerdi|Argentinien|A|1999;Amine Harit|Marokko|M|1997;Gerónimo Rulli|Argentinien|T|1992");
add("Ligue 1","AS Monaco","Maghnes Akliouche|Frankreich|M|2002;Breel Embolo|Schweiz|S|1997;Aleksandr Golovin|Russland|M|1996;Takumi Minamino|Japan|S|1995;Denis Zakaria|Schweiz|M|1996;Vanderson|Brasilien|A|2001");
add("Ligue 1","OSC Lille","Jonathan David|Kanada|S|2000;Edon Zhegrova|Kosovo|S|1999;Benjamin André|Frankreich|M|1990;Lucas Chevalier|Frankreich|T|2001;Angel Gomes|England|M|2000");
add("Ligue 1","Olympique Lyon","Alexandre Lacazette|Frankreich|S|1991;Rayan Cherki|Frankreich|M|2003;Corentin Tolisso|Frankreich|M|1994;Nemanja Matić|Serbien|M|1988;Clinton Mata|Angola|A|1992");
add("Ligue 1","OGC Nizza","Evann Guessand|Elfenbeinküste|S|2001;Gaëtan Laborde|Frankreich|S|1994;Jonathan Clauss|Frankreich|A|1992;Terem Moffi|Nigeria|S|1999");
add("Ligue 1","Stade Rennes","Arnaud Kalimuendo|Frankreich|S|2002;Ludovic Blas|Frankreich|M|1997;Steve Mandanda|Frankreich|T|1985;Amine Gouiri|Algerien|S|2000");
add("Ligue 1","RC Lens","Florian Sotoca|Frankreich|S|1990;Przemysław Frankowski|Polen|A|1995;Brice Samba|Frankreich|T|1994;Kevin Danso|Österreich|A|1998");
add("Ligue 1","RC Strasbourg","Emanuel Emegha|Niederlande|S|2003;Habib Diarra|Senegal|M|2004;Dilane Bakwa|Frankreich|S|2002");

// Frühere Weltstars ergänzen die aktuelle Auswahl um Fußballgeschichte.
add("Premier League","Manchester United","Wayne Rooney|England|S|1985;David Beckham|England|M|1975;Ryan Giggs|Wales|M|1973;Paul Scholes|England|M|1974;Andy Cole|England|S|1971;Robin van Persie|Niederlande|S|1983;Cristiano Ronaldo|Portugal|S|1985;Rio Ferdinand|England|A|1978;Nemanja Vidić|Serbien|A|1981");
add("Premier League","FC Liverpool","Steven Gerrard|England|M|1980;Fernando Torres|Spanien|S|1984;Roberto Firmino|Brasilien|S|1991;Sadio Mané|Senegal|S|1992;James Milner|England|M|1986;Michael Owen|England|S|1979;Dirk Kuyt|Niederlande|S|1980");
add("Premier League","Chelsea","Frank Lampard|England|M|1978;John Terry|England|A|1980;Didier Drogba|Elfenbeinküste|S|1978;Petr Čech|Tschechien|T|1982;Eden Hazard|Belgien|S|1991;N'Golo Kanté|Frankreich|M|1991;Gianfranco Zola|Italien|S|1966");
add("Premier League","Arsenal","Thierry Henry|Frankreich|S|1977;Patrick Vieira|Frankreich|M|1976;Mesut Özil|Deutschland|M|1988;Cesc Fàbregas|Spanien|M|1987;Robin van Persie|Niederlande|S|1983;Alexis Sánchez|Chile|S|1988");
add("Premier League","Manchester City","Sergio Agüero|Argentinien|S|1988;David Silva|Spanien|M|1986;Yaya Touré|Elfenbeinküste|M|1983;Vincent Kompany|Belgien|A|1986;Raheem Sterling|England|S|1994");
add("Premier League","Leicester City","Jamie Vardy|England|S|1987;Riyad Mahrez|Algerien|S|1991");
add("La Liga","Real Madrid","Cristiano Ronaldo|Portugal|S|1985;Gareth Bale|Wales|S|1989;Ángel Di María|Argentinien|S|1988;Marcelo|Brasilien|A|1988;Iker Casillas|Spanien|T|1981;Pepe|Portugal|A|1983;Sami Khedira|Deutschland|M|1987");
add("La Liga","FC Barcelona","Andrés Iniesta|Spanien|M|1984;Xavi|Spanien|M|1980;Sergio Busquets|Spanien|M|1988;Gerard Piqué|Spanien|A|1987;Jordi Alba|Spanien|A|1989;Ivan Rakitić|Kroatien|M|1988;David Villa|Spanien|S|1981");
add("La Liga","Atlético Madrid","Diego Forlán|Uruguay|S|1979;Diego Costa|Spanien|S|1988;Fernando Torres|Spanien|S|1984");
add("Bundesliga","Bayern München","Miroslav Klose|Deutschland|S|1978;Arjen Robben|Niederlande|S|1984;Franck Ribéry|Frankreich|S|1983;Philipp Lahm|Deutschland|A|1983;Bastian Schweinsteiger|Deutschland|M|1984;Mario Gómez|Deutschland|S|1985;Robert Lewandowski|Polen|S|1988;Mario Mandžukić|Kroatien|S|1986");
add("Bundesliga","Borussia Dortmund","Pierre-Emerick Aubameyang|Gabun|S|1989;Shinji Kagawa|Japan|M|1989;Nuri Şahin|Türkei|M|1988;İlkay Gündoğan|Deutschland|M|1990");
add("Bundesliga","1. FC Köln","Lukas Podolski|Deutschland|S|1985");
add("Bundesliga","Werder Bremen","Mesut Özil|Deutschland|M|1988");
add("Bundesliga","Schalke 04","Julian Draxler|Deutschland|M|1993;Benedikt Höwedes|Deutschland|A|1988");
add("Serie A","AC Mailand","Zlatan Ibrahimović|Schweden|S|1981;Kaká|Brasilien|M|1982;Olivier Giroud|Frankreich|S|1986;Andrij Schewtschenko|Ukraine|S|1976;Andrea Pirlo|Italien|M|1979;Paolo Maldini|Italien|A|1968");
add("Serie A","Juventus Turin","Gianluigi Buffon|Italien|T|1978;Giorgio Chiellini|Italien|A|1984;Claudio Marchisio|Italien|M|1986;Paul Pogba|Frankreich|M|1993");
add("Serie A","AS Rom","Francesco Totti|Italien|S|1976;Daniele De Rossi|Italien|M|1983;Edin Džeko|Bosnien und Herzegowina|S|1986");
add("Serie A","SSC Neapel","Diego Maradona|Argentinien|M|1960;Marek Hamšík|Slowakei|M|1987;Dries Mertens|Belgien|S|1987;Gonzalo Higuaín|Argentinien|S|1987;Lorenzo Insigne|Italien|S|1991");
add("Serie A","Inter Mailand","Wesley Sneijder|Niederlande|M|1984;Samuel Eto'o|Kamerun|S|1981;Ronaldo Nazário|Brasilien|S|1976;Javier Zanetti|Argentinien|A|1973");
add("Ligue 1","Paris Saint-Germain","Edinson Cavani|Uruguay|S|1987;Thiago Silva|Brasilien|A|1984;Blaise Matuidi|Frankreich|M|1987");
add("Ligue 1","Olympique Lyon","Hugo Lloris|Frankreich|T|1986;Nabil Fekir|Frankreich|M|1993;Alexandre Lacazette|Frankreich|S|1991");
add("Ligue 1","AS Monaco","Wissam Ben Yedder|Frankreich|S|1990");

// Clubquiz: historische/typische Zuordnung zur Liga, ausdrücklich kein Ligastatus 2026/27.
const clubEntries:Record<League,string[]>={
 "Premier League":["Manchester City","Manchester United","Arsenal","FC Liverpool","Chelsea","Tottenham Hotspur","Newcastle United","Aston Villa","Everton","West Ham United","Wolverhampton Wanderers","Brighton & Hove Albion","Crystal Palace","Fulham","Brentford","Nottingham Forest","AFC Bournemouth","Leicester City","Southampton","Leeds United","Burnley","Sheffield United","Ipswich Town","Sunderland"],
 "La Liga":["Real Madrid","FC Barcelona","Atlético Madrid","Athletic Bilbao","Real Sociedad","FC Sevilla","Villarreal","Real Betis","Valencia","Celta Vigo","Girona","Getafe","Osasuna","Mallorca","Espanyol Barcelona","Rayo Vallecano","Deportivo Alavés","Granada CF","Cádiz CF","Real Valladolid","Las Palmas","Leganés","Elche CF"],
 "Bundesliga":["Bayern München","Borussia Dortmund","Bayer Leverkusen","RB Leipzig","VfB Stuttgart","Eintracht Frankfurt","SC Freiburg","Borussia Mönchengladbach","Werder Bremen","VfL Wolfsburg","TSG Hoffenheim","Mainz 05","1. FC Union Berlin","FC Augsburg","1. FC Köln","Hamburger SV","FC St. Pauli","Hertha BSC","Schalke 04","VfL Bochum","1. FC Heidenheim","1. FC Nürnberg"],
 "Serie A":["Inter Mailand","AC Mailand","Juventus Turin","SSC Neapel","AS Rom","Lazio Rom","Atalanta Bergamo","AC Florenz","Bologna FC","FC Turin","Genua CFC","Cagliari Calcio","Udinese Calcio","Parma Calcio","Hellas Verona","US Lecce","Empoli FC","Como 1907","Venezia FC","US Sassuolo","AC Monza","Sampdoria Genua","FC Palermo"],
 "Ligue 1":["Paris Saint-Germain","Olympique Marseille","AS Monaco","OSC Lille","Olympique Lyon","OGC Nizza","Stade Rennes","RC Lens","RC Strasbourg","FC Toulouse","FC Nantes","Stade Brest","Stade Reims","Montpellier HSC","AJ Auxerre","Angers SCO","FC Lorient","Le Havre AC","FC Metz","AS Saint-Étienne","Girondins Bordeaux"]
};
export const allClubs:Club[]=(Object.keys(clubEntries) as League[]).flatMap(league=>clubEntries[league].map(name=>({name,league,country:leagueCountries[league]})));
/** Historische Stationen aus den redaktionellen Spieler-Einträgen (nicht nur der zuletzt hinterlegte Verein). */
export const playerClubHistory:Map<string,string[]>=new Map();
for(const person of players){
 const clubs=playerClubHistory.get(person.name)??[];
 if(!clubs.includes(person.club))clubs.push(person.club);
 playerClubHistory.set(person.name,clubs);
}
export const allPlayers:Player[]=Array.from(new Map(players.map(p=>[p.name,p])).values());
export const playablePlayers:Player[]=allPlayers.filter(p=>p.birthYear>=1975);
export const playerByName=new Map(allPlayers.map(p=>[p.name,p]));
export const leagueNames=Object.keys(leagueCountries) as League[];
