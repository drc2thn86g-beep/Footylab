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
