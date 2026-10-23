export type CareerQuestion={answer:string;clubs:string[];choices:string[];fact:string};
export const careers:CareerQuestion[]=[
{answer:"Cristiano Ronaldo",clubs:["Sporting CP","Manchester United","Real Madrid","Juventus","Manchester United","Al-Nassr"],choices:["Cristiano Ronaldo","Gareth Bale","Ángel Di María","Karim Benzema"],fact:"Ronaldo gewann unter anderem mit Manchester United und Real Madrid die Champions League."},
{answer:"Erling Haaland",clubs:["Bryne FK","Molde FK","RB Salzburg","Borussia Dortmund","Manchester City"],choices:["Erling Haaland","Alexander Sørloth","Martin Ødegaard","Jude Bellingham"],fact:"Haaland kam über Österreich und Deutschland in die Premier League."},
{answer:"Jude Bellingham",clubs:["Birmingham City","Borussia Dortmund","Real Madrid"],choices:["Jude Bellingham","Jadon Sancho","Toni Kroos","Kai Havertz"],fact:"Bellingham wechselte 2023 aus Dortmund nach Madrid."},
{answer:"Mohamed Salah",clubs:["FC Basel","Chelsea","AC Florenz (Leihe)","AS Rom","Liverpool"],choices:["Mohamed Salah","Sadio Mané","Riyad Mahrez","Eden Hazard"],fact:"Salah spielte vor Liverpool in der Schweiz, England und Italien."},
{answer:"Zlatan Ibrahimović",clubs:["Malmö FF","Ajax","Juventus","Inter Mailand","FC Barcelona","AC Mailand","Paris Saint-Germain","Manchester United","LA Galaxy","AC Mailand"],choices:["Zlatan Ibrahimović","Edinson Cavani","Romelu Lukaku","Mario Balotelli"],fact:"Ibrahimović spielte für zahlreiche europäische Spitzenklubs und in Los Angeles."},
{answer:"Mesut Özil",clubs:["Schalke 04","Werder Bremen","Real Madrid","Arsenal","Fenerbahçe","Başakşehir"],choices:["Mesut Özil","İlkay Gündoğan","Sami Khedira","Leroy Sané"],fact:"Özil wurde 2014 mit Deutschland Weltmeister."},
{answer:"Eden Hazard",clubs:["OSC Lille","Chelsea","Real Madrid"],choices:["Eden Hazard","Thibaut Courtois","Kevin De Bruyne","Olivier Giroud"],fact:"Hazard gewann mit Chelsea zweimal die Premier League."},
{answer:"Kai Havertz",clubs:["Bayer Leverkusen","Chelsea","Arsenal"],choices:["Kai Havertz","Timo Werner","Julian Brandt","Florian Wirtz"],fact:"Havertz erzielte im Champions-League-Finale 2021 den Siegtreffer für Chelsea."},
{answer:"Kevin De Bruyne",clubs:["KRC Genk","Chelsea","Werder Bremen (Leihe)","VfL Wolfsburg","Manchester City","SSC Neapel"],choices:["Kevin De Bruyne","Thorgan Hazard","Jérémy Doku","Axel Witsel"],fact:"De Bruyne spielte 2014/15 für Wolfsburg und wurde dort Bundesliga-Spieler der Saison."},
{answer:"Toni Kroos",clubs:["Bayern München","Bayer Leverkusen (Leihe)","Bayern München","Real Madrid"],choices:["Toni Kroos","Joshua Kimmich","Sami Khedira","İlkay Gündoğan"],fact:"Kroos gewann 2014 mit Deutschland die Weltmeisterschaft."},
{answer:"Gareth Bale",clubs:["Southampton","Tottenham Hotspur","Real Madrid","Tottenham (Leihe)","Real Madrid","Los Angeles FC"],choices:["Gareth Bale","Harry Kane","Aaron Ramsey","Joe Allen"],fact:"Bale erzielte 2018 im Champions-League-Finale ein berühmtes Fallrückziehertor."},
{answer:"Lionel Messi",clubs:["FC Barcelona","Paris Saint-Germain","Inter Miami"],choices:["Lionel Messi","Luis Suárez","Neymar","Ángel Di María"],fact:"Messi gewann 2022 mit Argentinien die Weltmeisterschaft."},
{answer:"Neymar",clubs:["FC Santos","FC Barcelona","Paris Saint-Germain","Al-Hilal","FC Santos"],choices:["Neymar","Rodrygo","Vinicius Junior","Raphinha"],fact:"Neymar gewann 2015 mit Barcelona die Champions League."},
{answer:"Robert Lewandowski",clubs:["Znicz Pruszków","Lech Posen","Borussia Dortmund","Bayern München","FC Barcelona"],choices:["Robert Lewandowski","Arkadiusz Milik","Krzysztof Piątek","Jakub Błaszczykowski"],fact:"Lewandowski erzielte 41 Bundesliga-Tore in der Saison 2020/21."},
{answer:"Luis Suárez",clubs:["Nacional Montevideo","FC Groningen","Ajax","Liverpool","FC Barcelona","Atlético Madrid","Nacional Montevideo","Grêmio","Inter Miami"],choices:["Luis Suárez","Edinson Cavani","Darwin Núñez","Fernando Torres"],fact:"Suárez gewann den Goldenen Schuh in der Premier League und der Primera División."},
{answer:"Antoine Griezmann",clubs:["Real Sociedad","Atlético Madrid","FC Barcelona","Atlético Madrid"],choices:["Antoine Griezmann","Olivier Giroud","Karim Benzema","Thomas Lemar"],fact:"Griezmann gewann mit Frankreich 2018 den WM-Titel."},
{answer:"Arjen Robben",clubs:["FC Groningen","PSV Eindhoven","Chelsea","Real Madrid","Bayern München","FC Groningen"],choices:["Arjen Robben","Wesley Sneijder","Robin van Persie","Rafael van der Vaart"],fact:"Robben erzielte das Siegtor im Champions-League-Finale 2013."},
{answer:"Sadio Mané",clubs:["FC Metz","RB Salzburg","Southampton","Liverpool","Bayern München","Al-Nassr"],choices:["Sadio Mané","Mohamed Salah","Roberto Firmino","Naby Keïta"],fact:"Mané gewann 2019 mit Liverpool die Champions League."}
];
export type GridCell={answer:string;choices:[string,string,string,string]};
export type GridBoard={id:string;label:string;rows:[string,string,string];columns:[string,string,string];cells:GridCell[]};
export const gridBoards:GridBoard[]=[
{id:"europe",label:"Europäische Klassiker",rows:["Real Madrid","Chelsea","Bayern München"],columns:["Deutschland","Frankreich","Spanien"],cells:[
{answer:"Toni Kroos",choices:["Toni Kroos","Kai Havertz","İlkay Gündoğan","Thomas Müller"]},
{answer:"Karim Benzema",choices:["Karim Benzema","N'Golo Kanté","Olivier Giroud","Franck Ribéry"]},
{answer:"Sergio Ramos",choices:["Sergio Ramos","César Azpilicueta","Pedri","Rodri"]},
{answer:"Kai Havertz",choices:["Kai Havertz","Toni Kroos","Thomas Müller","İlkay Gündoğan"]},
{answer:"N'Golo Kanté",choices:["N'Golo Kanté","Antoine Griezmann","Kylian Mbappé","Karim Benzema"]},
{answer:"César Azpilicueta",choices:["César Azpilicueta","Sergio Ramos","Pedri","Rodri"]},
{answer:"Thomas Müller",choices:["Thomas Müller","Kai Havertz","İlkay Gündoğan","Mesut Özil"]},
{answer:"Franck Ribéry",choices:["Franck Ribéry","Karim Benzema","N'Golo Kanté","Kylian Mbappé"]},
{answer:"Thiago Alcântara",choices:["Thiago Alcântara","Sergio Ramos","Pedri","Rodri"]}
]},
{id:"england",label:"England & seine Stars",rows:["Manchester City","Arsenal","Chelsea"],columns:["England","Belgien","Niederlande"],cells:[
{answer:"Phil Foden",choices:["Phil Foden","Bukayo Saka","Harry Kane","Jude Bellingham"]},
{answer:"Kevin De Bruyne",choices:["Kevin De Bruyne","Leandro Trossard","Eden Hazard","Romelu Lukaku"]},
{answer:"Nathan Aké",choices:["Nathan Aké","Robin van Persie","Arjen Robben","Virgil van Dijk"]},
{answer:"Bukayo Saka",choices:["Bukayo Saka","Phil Foden","Frank Lampard","Jadon Sancho"]},
{answer:"Leandro Trossard",choices:["Leandro Trossard","Kevin De Bruyne","Eden Hazard","Thibaut Courtois"]},
{answer:"Robin van Persie",choices:["Robin van Persie","Nathan Aké","Arjen Robben","Wesley Sneijder"]},
{answer:"Frank Lampard",choices:["Frank Lampard","Phil Foden","Harry Kane","Declan Rice"]},
{answer:"Eden Hazard",choices:["Eden Hazard","Youri Tielemans","Marouane Fellaini","Leandro Trossard"]},
{answer:"Arjen Robben",choices:["Arjen Robben","Robin van Persie","Rafael van der Vaart","Memphis Depay"]}
]},
{id:"world",label:"Südamerika & Portugal",rows:["FC Barcelona","Real Madrid","Juventus Turin"],columns:["Brasilien","Argentinien","Portugal"],cells:[
{answer:"Ronaldinho",choices:["Ronaldinho","Vinicius Junior","Alex Sandro","Rodrygo"]},
{answer:"Lionel Messi",choices:["Lionel Messi","Ángel Di María","Paulo Dybala","Lautaro Martínez"]},
{answer:"André Gomes",choices:["André Gomes","Cristiano Ronaldo","Rúben Dias","Bruno Fernandes"]},
{answer:"Vinicius Junior",choices:["Vinicius Junior","Ronaldinho","Alex Sandro","Neymar"]},
{answer:"Ángel Di María",choices:["Ángel Di María","Lionel Messi","Paulo Dybala","Julián Álvarez"]},
{answer:"Cristiano Ronaldo",choices:["Cristiano Ronaldo","André Gomes","João Cancelo","Bernardo Silva"]},
{answer:"Alex Sandro",choices:["Alex Sandro","Vinicius Junior","Ronaldinho","Raphinha"]},
{answer:"Paulo Dybala",choices:["Paulo Dybala","Lionel Messi","Julián Álvarez","Sergio Agüero"]},
{answer:"João Cancelo",choices:["João Cancelo","Bruno Fernandes","André Gomes","Bernardo Silva"]}
]}
];
export type IdentityQuestion={answer:string;choices:[string,string,string,string];clues:[string,string,string,string]};
export const mysteries:IdentityQuestion[]=[
{answer:"Cristiano Ronaldo",choices:["Cristiano Ronaldo","Bruno Fernandes","Gareth Bale","Karim Benzema"],clues:["Ich wurde auf Madeira geboren.","Mein erster Profiklub war Sporting CP.","Ich gewann die EM 2016.","Mein Jubelruf lautet für viele Fans ‚Siuuu‘."]},
{answer:"Lionel Messi",choices:["Lionel Messi","Sergio Agüero","Ángel Di María","Paulo Dybala"],clues:["Ich wurde in Rosario geboren.","Ich spielte als Jugendlicher für La Masia.","Ich gewann die WM 2022.","Meine berühmteste Rückennummer ist die 10 bei Barcelona."]},
{answer:"Miroslav Klose",choices:["Miroslav Klose","Thomas Müller","Lukas Podolski","Mario Gómez"],clues:["Ich wurde in Polen geboren.","Ich spielte unter anderem für Kaiserslautern und Werder Bremen.","Ich gewann 2014 mit Deutschland die WM.","Ich erzielte insgesamt 16 WM-Tore."]},
{answer:"Zlatan Ibrahimović",choices:["Zlatan Ibrahimović","Edinson Cavani","Olivier Giroud","Mario Mandžukić"],clues:["Ich bin Schwede mit bosnisch-kroatischen Wurzeln.","Ich spielte unter anderem bei Ajax, Juventus und Inter.","Ich war auch bei Paris Saint-Germain und LA Galaxy.","Ich bin für spektakuläre Fallrückzieher und Selbstbewusstsein bekannt."]},
{answer:"Arjen Robben",choices:["Arjen Robben","Wesley Sneijder","Robin van Persie","Memphis Depay"],clues:["Ich bin Niederländer.","Ich spielte bei Chelsea und Real Madrid.","Ich zog gerne von rechts auf meinen linken Fuß.","Ich erzielte das Siegtor im Champions-League-Finale 2013."]},
{answer:"Toni Kroos",choices:["Toni Kroos","Sami Khedira","Joshua Kimmich","İlkay Gündoğan"],clues:["Ich komme aus Greifswald.","Ich spielte als Profi nur in Deutschland und Spanien.","Ich gewann mehrfach die Champions League mit Real Madrid.","Ich wurde 2014 mit Deutschland Weltmeister."]},
{answer:"Erling Haaland",choices:["Erling Haaland","Alexander Sørloth","Martin Ødegaard","Jude Bellingham"],clues:["Mein Vater spielte ebenfalls Profifußball.","Ich spielte zuerst in Norwegen.","Ich wechselte über Salzburg und Dortmund nach England.","Mein Vorname ist Erling."]},
{answer:"Karim Benzema",choices:["Karim Benzema","Olivier Giroud","Antoine Griezmann","Kylian Mbappé"],clues:["Ich wurde in Lyon geboren.","Ich spielte lange an der Seite von Cristiano Ronaldo.","Ich gewann 2022 den Ballon d'Or.","Meine Trikotnummer bei Real Madrid war die 9."]},
{answer:"Thierry Henry",choices:["Thierry Henry","Patrick Vieira","Olivier Giroud","Nicolas Anelka"],clues:["Ich wurde in Les Ulis geboren.","Ich spielte unter anderem für Monaco und Juventus.","Meine Glanzzeit war bei Arsenal.","Ich gewann 1998 mit Frankreich die WM."]},
{answer:"Robert Lewandowski",choices:["Robert Lewandowski","Arkadiusz Milik","Krzysztof Piątek","Piotr Zieliński"],clues:["Ich wurde in Warschau geboren.","Ich spielte in Polen für Lech Posen.","Ich wurde bei Borussia Dortmund und Bayern München zum Weltstar.","Ich erzielte 41 Tore in einer Bundesliga-Saison."]},
{answer:"Neymar",choices:["Neymar","Ronaldinho","Vinicius Junior","Rodrygo"],clues:["Ich wurde in Mogi das Cruzes geboren.","Meine erste große Profistation war Santos.","Ich spielte mit Messi und Suárez bei Barcelona.","Ich gewann 2016 mit Brasilien Olympia-Gold."]},
{answer:"Mohamed Salah",choices:["Mohamed Salah","Sadio Mané","Riyad Mahrez","Achraf Hakimi"],clues:["Ich wurde in Ägypten geboren.","Ich wechselte früh zum FC Basel.","Ich spielte für die AS Rom.","Ich wurde bei Liverpool zu einem der erfolgreichsten Premier-League-Torschützen."]}
];


// Ergänzungen für mehr Abwechslung: feste Karrierewege, nicht Live-Kader.
careers.push(...[
{answer:"Sergio Ramos",clubs:["FC Sevilla","Real Madrid","Paris Saint-Germain","FC Sevilla"],choices:["Sergio Ramos","Gerard Piqué","Pepe","Dani Carvajal"],fact:"Der spanische Innenverteidiger gewann vier Champions-League-Titel mit Real Madrid."},
{answer:"Kylian Mbappé",clubs:["AS Monaco","Paris Saint-Germain","Real Madrid"],choices:["Kylian Mbappé","Ousmane Dembélé","Kingsley Coman","Marcus Thuram"],fact:"Mbappé wurde 2018 mit Frankreich Weltmeister."},
{answer:"Vinicius Junior",clubs:["Flamengo","Real Madrid"],choices:["Vinicius Junior","Rodrygo","Raphinha","Gabriel Martinelli"],fact:"Vinicius erzielte im Champions-League-Finale 2022 das Siegtor."},
{answer:"Virgil van Dijk",clubs:["FC Groningen","Celtic Glasgow","Southampton","FC Liverpool"],choices:["Virgil van Dijk","Nathan Aké","Matthijs de Ligt","Stefan de Vrij"],fact:"Van Dijk gewann 2019 mit Liverpool die Champions League."},
{answer:"Harry Kane",clubs:["Tottenham Hotspur","Norwich City (Leihe)","Leicester City (Leihe)","Tottenham Hotspur","Bayern München"],choices:["Harry Kane","Jamie Vardy","Ollie Watkins","Dominic Solanke"],fact:"Kane wechselte im Sommer 2023 von Tottenham zum FC Bayern."},
{answer:"Thibaut Courtois",clubs:["KRC Genk","Chelsea","Atlético Madrid (Leihe)","Chelsea","Real Madrid"],choices:["Thibaut Courtois","Eden Hazard","Kevin De Bruyne","Simon Mignolet"],fact:"Courtois gewann 2022 mit Real Madrid die Champions League."},
{answer:"Luka Modrić",clubs:["Dinamo Zagreb","Zrinjski Mostar (Leihe)","Inter Zaprešić (Leihe)","Tottenham Hotspur","Real Madrid"],choices:["Luka Modrić","Ivan Rakitić","Mateo Kovačić","Marcelo Brozović"],fact:"Modrić gewann 2018 den Ballon d’Or."},
{answer:"Bruno Fernandes",clubs:["Novara Calcio","Udinese Calcio","Sampdoria Genua","Sporting CP","Manchester United"],choices:["Bruno Fernandes","Bernardo Silva","João Moutinho","Rúben Neves"],fact:"Fernandes wechselte 2020 von Sporting zu Manchester United."},
{answer:"Son Heung-min",clubs:["Hamburger SV","Bayer Leverkusen","Tottenham Hotspur","Los Angeles FC"],choices:["Son Heung-min","Hwang Hee-chan","Lee Kang-in","Takefusa Kubo"],fact:"Son spielte in der Bundesliga, bevor er bei Tottenham zur Legende wurde."},
{answer:"Ousmane Dembélé",clubs:["Stade Rennes","Borussia Dortmund","FC Barcelona","Paris Saint-Germain"],choices:["Ousmane Dembélé","Kingsley Coman","Kylian Mbappé","Jadon Sancho"],fact:"Dembélé spielte 2016/17 für Borussia Dortmund."},
{answer:"Ángel Di María",clubs:["Rosario Central","Benfica Lissabon","Real Madrid","Manchester United","Paris Saint-Germain","Juventus Turin","Benfica Lissabon"],choices:["Ángel Di María","Lionel Messi","Paulo Dybala","Javier Pastore"],fact:"Di María erzielte im WM-Finale 2022 einen Treffer für Argentinien."},
{answer:"Enzo Fernández",clubs:["River Plate","Benfica Lissabon","Chelsea"],choices:["Enzo Fernández","Alexis Mac Allister","Leandro Paredes","Rodrigo De Paul"],fact:"Fernández gewann 2022 mit Argentinien den Weltmeistertitel."},
{answer:"Raphinha",clubs:["Vitória Guimarães","Sporting CP","Stade Rennes","Leeds United","FC Barcelona"],choices:["Raphinha","Rodrygo","Antony","Gabriel Jesus"],fact:"Raphinha kam über Portugal, Frankreich und England nach Barcelona."},
{answer:"Alexis Mac Allister",clubs:["Argentinos Juniors","Brighton & Hove Albion","Boca Juniors (Leihe)","Brighton & Hove Albion","FC Liverpool"],choices:["Alexis Mac Allister","Enzo Fernández","Emiliano Buendía","Leandro Paredes"],fact:"Mac Allister gewann 2022 mit Argentinien die Weltmeisterschaft."},
{answer:"João Neves",clubs:["Benfica Lissabon","Paris Saint-Germain"],choices:["João Neves","Vitinha","João Palhinha","Rúben Neves"],fact:"Der portugiesische Mittelfeldspieler wechselte 2024 nach Paris."},
{answer:"Granit Xhaka",clubs:["FC Basel","Borussia Mönchengladbach","Arsenal","Bayer Leverkusen"],choices:["Granit Xhaka","Xherdan Shaqiri","Remo Freuler","Denis Zakaria"],fact:"Xhaka gewann 2024 mit Leverkusen ungeschlagen die Bundesliga."},
{answer:"Cesc Fàbregas",clubs:["Arsenal","FC Barcelona","Chelsea","AS Monaco","Como 1907"],choices:["Cesc Fàbregas","Juan Mata","Thiago Alcântara","Santi Cazorla"],fact:"Fàbregas wurde 2010 mit Spanien Weltmeister."},
{answer:"Thierry Henry",clubs:["AS Monaco","Juventus Turin","Arsenal","FC Barcelona","New York Red Bulls"],choices:["Thierry Henry","Nicolas Anelka","Olivier Giroud","David Trezeguet"],fact:"Henry war Teil des legendären Arsenal-Teams der Invincibles."},
{answer:"Sergio Agüero",clubs:["Independiente","Atlético Madrid","Manchester City","FC Barcelona"],choices:["Sergio Agüero","Carlos Tévez","Diego Forlán","Lautaro Martínez"],fact:"Agüero schoss Manchester City 2012 zum Premier-League-Titel."},
{answer:"Alisson Becker",clubs:["Internacional Porto Alegre","AS Rom","FC Liverpool"],choices:["Alisson Becker","Ederson","Emiliano Martínez","Gianluigi Donnarumma"],fact:"Alisson gewann 2019 die Champions League mit Liverpool."},
{answer:"Bernardo Silva",clubs:["Benfica Lissabon","AS Monaco","Manchester City"],choices:["Bernardo Silva","Bruno Fernandes","João Félix","Rúben Neves"],fact:"Silva gewann 2017 mit Monaco die französische Meisterschaft."},
{answer:"Lamine Yamal",clubs:["FC Barcelona"],choices:["Lamine Yamal","Pedri","Gavi","Fermín López"],fact:"Yamal wurde 2007 geboren und gewann mit Spanien die EM 2024."},
{answer:"Ollie Watkins",clubs:["Exeter City","Weston-super-Mare (Leihe)","Brentford","Aston Villa"],choices:["Ollie Watkins","Ivan Toney","Jamie Vardy","Callum Wilson"],fact:"Watkins schoss England bei der EM 2024 mit seinem Tor gegen die Niederlande ins Finale."},
{answer:"Achraf Hakimi",clubs:["Real Madrid","Borussia Dortmund (Leihe)","Inter Mailand","Paris Saint-Germain"],choices:["Achraf Hakimi","Noussair Mazraoui","Theo Hernández","João Cancelo"],fact:"Hakimi erreichte mit Marokko das WM-Halbfinale 2022."},
{answer:"Ronaldinho",clubs:["Grêmio Porto Alegre","Paris Saint-Germain","FC Barcelona","AC Mailand","Flamengo","Atlético Mineiro","Querétaro","Fluminense"],choices:["Ronaldinho","Rivaldo","Kaká","Robinho"],fact:"Ronaldinho gewann 2005 den Ballon d’Or."}
]);


const additionalMysteries:IdentityQuestion[]=[
{answer:"Kylian Mbappé",choices:["Kylian Mbappé","Kingsley Coman","Ousmane Dembélé","Marcus Thuram"],clues:["Ich wurde in Paris geboren.","Ich spielte früh für AS Monaco.","Ich gewann die Fußball-WM 2018.","Ich traf im WM-Finale 2022 dreimal."]},
{answer:"Jude Bellingham",choices:["Jude Bellingham","Declan Rice","Mason Mount","Phil Foden"],clues:["Ich wurde 2003 in England geboren.","Ich begann meine Profikarriere bei Birmingham City.","Ich spielte in der Bundesliga für Borussia Dortmund.","2023 wechselte ich zu Real Madrid."]},
{answer:"Lamine Yamal",choices:["Lamine Yamal","Nico Williams","Pedri","Gavi"],clues:["Ich wurde 2007 geboren.","Ich durchlief die Jugend von Barcelona.","Ich gewann mit Spanien die EM 2024.","Bei der EM 2024 wurde ich der jüngste Torschütze der Turniergeschichte."]},
{answer:"Harry Kane",choices:["Harry Kane","Ollie Watkins","Ivan Toney","Jamie Vardy"],clues:["Ich bin englischer Nationalspieler.","Ich spielte viele Jahre in London.","Ich gewann bei der WM 2018 den Goldenen Schuh.","2023 wechselte ich zum FC Bayern."]},
{answer:"Vinicius Junior",choices:["Vinicius Junior","Rodrygo","Raphinha","Gabriel Martinelli"],clues:["Ich bin Brasilianer und wurde 2000 geboren.","Meine ersten Profispiele bestritt ich für Flamengo.","Ich spiele auf dem linken Flügel.","Ich erzielte im Champions-League-Finale 2022 das Siegtor für Real Madrid."]},
{answer:"Pedri",choices:["Pedri","Gavi","Frenkie de Jong","Dani Olmo"],clues:["Ich komme von den Kanarischen Inseln.","Meine Profikarriere begann bei UD Las Palmas.","Ich bin ein spanischer Mittelfeldspieler.","2020 wechselte ich zum FC Barcelona."]},
{answer:"Manuel Neuer",choices:["Manuel Neuer","Marc-André ter Stegen","Oliver Kahn","Kevin Trapp"],clues:["Ich bin ein deutscher Torwart.","Ich habe für Schalke 04 gespielt.","Seit 2011 stand ich bei Bayern München im Tor.","2014 wurde ich mit Deutschland Weltmeister."]},
{answer:"Frank Lampard",choices:["Frank Lampard","Steven Gerrard","Paul Scholes","Michael Carrick"],clues:["Ich war englischer Nationalspieler.","Ich startete bei West Ham United.","Ich war ein torgefährlicher Mittelfeldspieler.","Mit Chelsea gewann ich 2012 die Champions League."]},
{answer:"Kevin De Bruyne",choices:["Kevin De Bruyne","Eden Hazard","Youri Tielemans","Axel Witsel"],clues:["Ich wurde in Belgien geboren.","Ich begann meine Karriere bei KRC Genk.","Ich spielte eine starke Saison beim VfL Wolfsburg.","2015 wechselte ich zu Manchester City."]},
{answer:"Ousmane Dembélé",choices:["Ousmane Dembélé","Kingsley Coman","Neymar","Antoine Griezmann"],clues:["Ich bin französischer Offensivspieler.","Mein Profidebüt gab ich für Stade Rennes.","Danach spielte ich für Borussia Dortmund.","Später spielte ich beim FC Barcelona und Paris Saint-Germain."]},
{answer:"Kai Havertz",choices:["Kai Havertz","Florian Wirtz","Julian Brandt","Timo Werner"],clues:["Ich wurde in Aachen geboren.","Ich wurde bei Bayer Leverkusen Bundesligaprofi.","Ich schoss das entscheidende Tor im Champions-League-Finale 2021.","Später wechselte ich von Chelsea zu Arsenal."]},
{answer:"Cole Palmer",choices:["Cole Palmer","Phil Foden","Jude Bellingham","Bukayo Saka"],clues:["Ich bin 2002 in England geboren.","Ich entstamme der Jugend von Manchester City.","Ich bin offensiver Mittelfeldspieler.","2023 wechselte ich zum FC Chelsea."]},
{answer:"Sadio Mané",choices:["Sadio Mané","Mohamed Salah","Riyad Mahrez","Naby Keïta"],clues:["Ich wurde im Senegal geboren.","Ich spielte für RB Salzburg und Southampton.","Ich gewann mit Liverpool 2019 die Champions League.","2022 wechselte ich zum FC Bayern."]},
{answer:"Gareth Bale",choices:["Gareth Bale","Aaron Ramsey","Harry Kane","Daniel James"],clues:["Ich bin Waliser.","Ich begann bei Southampton.","Ich spielte danach in Tottenham und Madrid.","Ich erzielte 2018 im Champions-League-Finale ein Fallrückziehertor."]},
{answer:"Ronaldinho",choices:["Ronaldinho","Rivaldo","Kaká","Neymar"],clues:["Ich bin brasilianischer Weltmeister von 2002.","Ich spielte bei Paris Saint-Germain.","Ich begeisterte die Fans von Barcelona mit Tricks.","Ich gewann 2005 den Ballon d’Or."]},
{answer:"Andrés Iniesta",choices:["Andrés Iniesta","Xavi","Sergio Busquets","David Silva"],clues:["Ich bin spanischer Mittelfeldspieler.","Ich verbrachte einen Großteil meiner Karriere beim FC Barcelona.","Ich gewann 2010 mit Spanien die Weltmeisterschaft.","Ich erzielte im WM-Finale 2010 das Siegtor."]},
{answer:"Wayne Rooney",choices:["Wayne Rooney","Harry Kane","Michael Owen","Jamie Vardy"],clues:["Ich gab mein Profidebüt als Teenager bei Everton.","Ich bin Engländer.","Ich spielte viele Jahre unter Sir Alex Ferguson.","Ich bin Rekordtorschütze von Manchester United."]},
{answer:"Luis Suárez",choices:["Luis Suárez","Edinson Cavani","Darwin Núñez","Fernando Torres"],clues:["Ich bin uruguayischer Stürmer.","Ich spielte in den Niederlanden für Ajax.","Ich erzielte bei Liverpool viele Tore.","Ich spielte später mit Messi und Neymar im Angriff von Barcelona."]},
{answer:"Xavi",choices:["Xavi","Andrés Iniesta","Sergio Busquets","Cesc Fàbregas"],clues:["Ich gewann mit Spanien 2010 die WM.","Ich war ein zentraler Spielmacher.","Ich spielte als Profi lange beim FC Barcelona.","Später war ich auch Trainer des FC Barcelona."]}
];
mysteries.push(...additionalMysteries);
