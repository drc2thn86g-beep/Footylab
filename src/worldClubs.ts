/** Internationale Klubnamen mit historisch bekannter Heimatliga.
 * Dies ist KEINE verifizierte aktuelle Tabelle und kein Saison-2026/27-Kaderfeed. */
export type Region="Europa"|"Weltweit";
export type WorldClub={name:string;league:string;country:string;region:"Europa"|"Welt"};
const clubs:WorldClub[]=[];
const leagueMap:Record<string,string>={
 "Primeira Liga":"Portugal",
 "Eredivisie":"Niederlande",
 "Belgian Pro League":"Belgien",
 "Süper Lig":"Türkei",
 "Scottish Premiership":"Schottland",
 "Österreichische Bundesliga":"Österreich",
 "Swiss Super League":"Schweiz",
 "Greek Super League":"Griechenland",
 "HNL":"Kroatien",
 "Serbian SuperLiga":"Serbien",
 "Czech First League":"Tschechien",
 "Ekstraklasa":"Polen",
 "Eliteserien":"Norwegen",
 "Danish Superliga":"Dänemark",
 "Allsvenskan":"Schweden",
 "J1 League":"Japan",
 "Major League Soccer":"USA/Kanada",
 "Campeonato Brasileiro Série A":"Brasilien",
 "Liga Profesional":"Argentinien",
 "Saudi Pro League":"Saudi-Arabien",
 "Liga MX":"Mexiko"
};
function add(league:string,region:"Europa"|"Welt",names:string){
 if(!leagueMap[league])throw Error("Unbekannte Liga: "+league);
 for(const name of names.split(";")){
  if(name.trim())clubs.push({name:name.trim(),league,country:leagueMap[league],region});
 }
}
// Historische Vereine der jeweiligen Liga; nicht zwingend alle dort in der aktuellen Saison.
add("Primeira Liga","Europa","Benfica Lissabon;Sporting CP;FC Porto;SC Braga;Vitória Guimarães;Boavista Porto;Rio Ave;Famalicão;Gil Vicente;Estoril Praia;Moreirense;Casa Pia;CD Santa Clara;FC Arouca");
add("Eredivisie","Europa","Ajax Amsterdam;PSV Eindhoven;Feyenoord Rotterdam;AZ Alkmaar;FC Twente;FC Utrecht;NEC Nijmegen;Sparta Rotterdam;SC Heerenveen;Go Ahead Eagles;FC Groningen;Heracles Almelo;Fortuna Sittard;RKC Waalwijk");
add("Belgian Pro League","Europa","Club Brügge;RSC Anderlecht;Union Saint-Gilloise;KRC Genk;KAA Gent;Royal Antwerp;KV Mechelen;Standard Lüttich;Cercle Brügge;OH Leuven;Sint-Truiden;Sporting Charleroi");
add("Süper Lig","Europa","Galatasaray;Fenerbahçe;Beşiktaş;Trabzonspor;Başakşehir;Kasımpaşa;Antalyaspor;Sivasspor;Göztepe;Samsunspor;Çaykur Rizespor;Alanyaspor;Kayserispor;Konyaspor");
add("Scottish Premiership","Europa","Celtic Glasgow;Rangers Glasgow;Aberdeen FC;Heart of Midlothian;Hibernian;Motherwell;Dundee United;St. Mirren;Kilmarnock;St. Johnstone;Ross County;Dundee FC");
add("Österreichische Bundesliga","Europa","RB Salzburg;Sturm Graz;Rapid Wien;Austria Wien;LASK Linz;Wolfsberger AC;TSV Hartberg;WSG Tirol;Austria Klagenfurt;SCR Altach;Grazer AK;Blau-Weiß Linz");
add("Swiss Super League","Europa","Young Boys Bern;FC Basel;FC Zürich;FC Lugano;Servette Genf;FC St. Gallen;FC Luzern;Grasshopper Club Zürich;Lausanne-Sport;FC Winterthur;Yverdon-Sport;FC Sion");
add("Greek Super League","Europa","Olympiakos Piräus;PAOK Thessaloniki;AEK Athen;Panathinaikos;Aris Thessaloniki;OFI Kreta;Asteras Tripolis;Atromitos Athen;Panetolikos;Volos NFC;PAS Lamia");
add("HNL","Europa","Dinamo Zagreb;Hajduk Split;HNK Rijeka;NK Osijek;Lokomotiva Zagreb;Slaven Belupo;Istra 1961;NK Varaždin;HNK Gorica;HNK Šibenik");
add("Serbian SuperLiga","Europa","Roter Stern Belgrad;Partizan Belgrad;Vojvodina Novi Sad;TSC Bačka Topola;Čukarički;Radnički Niš;Novi Pazar;Mladost Lučani;Napredak Kruševac;Železničar Pančevo");
add("Czech First League","Europa","Sparta Prag;Slavia Prag;Viktoria Pilsen;Baník Ostrava;Sigma Olmütz;Slovan Liberec;FK Mladá Boleslav;Bohemians Prag;FK Teplice;FK Jablonec;MFK Karviná");
add("Ekstraklasa","Europa","Legia Warschau;Lech Posen;Raków Częstochowa;Jagiellonia Białystok;Pogoń Stettin;Górnik Zabrze;Widzew Łódź;Śląsk Breslau;Piast Gliwice;Cracovia Krakau;Motor Lublin");
add("Eliteserien","Europa","Bodø/Glimt;Molde FK;Rosenborg BK;Viking FK;Brann Bergen;Tromsø IL;Strømsgodset;Lillestrøm SK;Sarpsborg 08;Fredrikstad FK;FK Haugesund;KFUM Oslo");
add("Danish Superliga","Europa","FC Kopenhagen;FC Midtjylland;Brøndby IF;FC Nordsjælland;AGF Aarhus;Randers FC;Silkeborg IF;Viborg FF;Odense BK;Aalborg BK;Vejle Boldklub;Lyngby BK");
add("Allsvenskan","Europa","Malmö FF;AIK Stockholm;Hammarby IF;Djurgårdens IF;IFK Göteborg;BK Häcken;IF Elfsborg;Mjällby AIF;IFK Norrköping;IK Sirius;GAIS Göteborg;Västerås SK");
add("J1 League","Welt","Kawasaki Frontale;Yokohama F. Marinos;Urawa Red Diamonds;Kashima Antlers;Vissel Kobe;FC Tokyo;Gamba Osaka;Cerezo Osaka;Sanfrecce Hiroshima;Nagoya Grampus;Kashiwa Reysol;Shonan Bellmare");
add("Major League Soccer","Welt","Inter Miami;LA Galaxy;Los Angeles FC;Seattle Sounders;Portland Timbers;Atlanta United;New York City FC;Columbus Crew;FC Cincinnati;Chicago Fire;Toronto FC;Vancouver Whitecaps");
add("Campeonato Brasileiro Série A","Welt","Flamengo;Palmeiras;Corinthians;São Paulo FC;Santos FC;Botafogo;Fluminense;Grêmio Porto Alegre;Internacional Porto Alegre;Atlético Mineiro;Cruzeiro;RB Bragantino;EC Bahia");
add("Liga Profesional","Welt","River Plate;Boca Juniors;Racing Club;Independiente;San Lorenzo;Vélez Sarsfield;Estudiantes La Plata;Newell's Old Boys;Rosario Central;Argentinos Juniors;Lanús;Talleres Córdoba");
add("Saudi Pro League","Welt","Al-Hilal;Al-Nassr;Al-Ittihad;Al-Ahli;Al-Shabab;Al-Ettifaq;Al-Taawoun;Al-Fateh;Al-Fayha;Damac FC;Al-Raed");
add("Liga MX","Welt","Club América;Chivas Guadalajara;CF Monterrey;Tigres UANL;Cruz Azul;Pumas UNAM;Toluca;Pachuca;Club León;Santos Laguna;Atlas FC;Puebla");
export const worldClubs:WorldClub[]=clubs;
export const worldLeagues=Object.keys(leagueMap);
export function leaguesFor(region:Region){return region==="Europa"?worldLeagues.filter(l=>clubs.some(c=>c.league===l&&c.region==="Europa")):worldLeagues}
