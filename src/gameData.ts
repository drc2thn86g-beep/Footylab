export type CareerQuestion = {answer:string;clubs:string[];choices:string[];fact:string};
export const careers:CareerQuestion[]=[
{answer:"Cristiano Ronaldo",clubs:["Sporting CP","Manchester United","Real Madrid","Juventus","Manchester United","Al-Nassr"],choices:["Cristiano Ronaldo","Gareth Bale","Ángel Di María","Karim Benzema"],fact:"Ronaldo gewann unter anderem mit Manchester United und Real Madrid die Champions League."},
{answer:"Erling Haaland",clubs:["Bryne FK","Molde FK","RB Salzburg","Borussia Dortmund","Manchester City"],choices:["Erling Haaland","Alexander Sørloth","Martin Ødegaard","Jude Bellingham"],fact:"Der Norweger kam über Österreich und die Bundesliga in die Premier League."},
{answer:"Jude Bellingham",clubs:["Birmingham City","Borussia Dortmund","Real Madrid"],choices:["Jude Bellingham","Jadon Sancho","Toni Kroos","Kai Havertz"],fact:"Bellingham wechselte 2023 aus Dortmund nach Madrid."},
{answer:"Mohamed Salah",clubs:["FC Basel","Chelsea","AC Florenz (Leihe)","AS Rom","Liverpool"],choices:["Mohamed Salah","Sadio Mané","Riyad Mahrez","Eden Hazard"],fact:"Salah spielte vor Liverpool in der Schweiz, England und Italien."},
{answer:"Zlatan Ibrahimović",clubs:["Malmö FF","Ajax","Juventus","Inter Mailand","FC Barcelona","AC Mailand","Paris Saint-Germain","Manchester United","LA Galaxy","AC Mailand"],choices:["Zlatan Ibrahimović","Edinson Cavani","Romelu Lukaku","Mario Balotelli"],fact:"Ibrahimović spielte für zahlreiche europäische Spitzenklubs und später in Los Angeles."},
{answer:"Mesut Özil",clubs:["Schalke 04","Werder Bremen","Real Madrid","Arsenal","Fenerbahçe","Başakşehir"],choices:["Mesut Özil","İlkay Gündoğan","Sami Khedira","Leroy Sané"],fact:"Özil wurde 2014 mit Deutschland Weltmeister."},
{answer:"Eden Hazard",clubs:["OSC Lille","Chelsea","Real Madrid"],choices:["Eden Hazard","Thibaut Courtois","Kevin De Bruyne","Olivier Giroud"],fact:"Hazard gewann mit Chelsea zweimal die Premier League."},
{answer:"Kai Havertz",clubs:["Bayer Leverkusen","Chelsea","Arsenal"],choices:["Kai Havertz","Timo Werner","Julian Brandt","Florian Wirtz"],fact:"Havertz erzielte im Champions-League-Finale 2021 das Siegtor für Chelsea."},
{answer:"Kevin De Bruyne",clubs:["KRC Genk","Chelsea","Werder Bremen (Leihe)","VfL Wolfsburg","Manchester City","SSC Neapel"],choices:["Kevin De Bruyne","Thorgan Hazard","Jérémy Doku","Axel Witsel"],fact:"De Bruyne wurde bei Wolfsburg zum Bundesliga-Spieler der Saison 2014/15."},
{answer:"Toni Kroos",clubs:["Bayern München","Bayer Leverkusen (Leihe)","Bayern München","Real Madrid"],choices:["Toni Kroos","Joshua Kimmich","Sami Khedira","İlkay Gündoğan"],fact:"Kroos gewann 2014 mit Deutschland die Weltmeisterschaft."}
];
export type GridCell={answer:string;choices:string[]};
export const gridClubs=["Real Madrid","Chelsea","Bayern München"];
export const gridCountries=["Deutschland","Frankreich","Spanien"];
export const gridCells:GridCell[]=[
{answer:"Toni Kroos",choices:["Toni Kroos","Kai Havertz","İlkay Gündoğan","Thomas Müller"]},
{answer:"Karim Benzema",choices:["Karim Benzema","N'Golo Kanté","Olivier Giroud","Franck Ribéry"]},
{answer:"Sergio Ramos",choices:["Sergio Ramos","César Azpilicueta","Pedri","Rodri"]},
{answer:"Kai Havertz",choices:["Kai Havertz","Toni Kroos","Thomas Müller","İlkay Gündoğan"]},
{answer:"N'Golo Kanté",choices:["N'Golo Kanté","Antoine Griezmann","Kylian Mbappé","Karim Benzema"]},
{answer:"César Azpilicueta",choices:["César Azpilicueta","Sergio Ramos","Pedri","Rodri"]},
{answer:"Thomas Müller",choices:["Thomas Müller","Kai Havertz","İlkay Gündoğan","Mesut Özil"]},
{answer:"Franck Ribéry",choices:["Franck Ribéry","Karim Benzema","N'Golo Kanté","Kylian Mbappé"]},
{answer:"Thiago Alcântara",choices:["Thiago Alcântara","Sergio Ramos","Pedri","Rodri"]}
];
