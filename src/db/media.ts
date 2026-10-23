import{imageId,playerId}from"./ids.ts";
import type{MediaAsset}from"./types";

/** Nur Fotos mit dokumentierter Commons-Datei, Urheber und Lizenz aufnehmen.
 * Logos/Wappen sind zunächst leer: Markenrechte nicht mit freier Fotolizenz verwechseln. */
export type Photo={file:string;author:string;license:string;licenseUrl:string;changed?:boolean};
export const photos:Record<string,Photo>={
 "Lamine Yamal":{file:"Lamine Yamal Argentina v Spain 19 July 2026-214.jpg",author:"Bryan Berlin",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Erling Haaland":{file:"Erling Haaland 2023.jpg",author:"Jacek Stanislawek",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Kylian Mbappé":{file:"Kylian Mbappé (46369981091).jpg",author:"Balkan Photos",license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"},
 "Pedri":{file:"Pedri France v Spain 7.24.26-226.jpg",author:"Bryan Berlin",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Harry Kane":{file:"Harry Kane 2023.jpg",author:"Number 10 / Simon Walker",license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"},
 "Mohamed Salah":{file:"Mohamed Salah.JPG",author:"Ultraslansi",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Jude Bellingham":{file:"Jude Bellingham England v Ghana 23 June 2026-061.jpg",author:"Bryan Berlin / WikiPortraits",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Vinicius Junior":{file:"Vinícius Júnior Brazil V Morocco 13 June 2026-207.jpg",author:"Bryan Berlin / WikiPortraits",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Lionel Messi":{file:"Leo Messi Argentina v Egypt 7 July 2026-1.jpg",author:"Bryan Berlin / WikiPortraits",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
 "Cristiano Ronaldo":{file:"Cristiano Ronaldo Croatia v Portugal 2 July 2026-075 (cropped).jpg",author:"Bryan Berlin / WikiPortraits",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/",changed:true},
 "Kevin De Bruyne":{file:"Kevin De Bruyne USMNT v Belgium Mar 28 2026-64 (cropped).jpg",author:"Bryan Berlin / WikiPortraits",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/",changed:true}
};
function commonsUrl(file:string){return"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=480"}
function commonsPage(file:string){return"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file.replace(/ /g,"_"))}
export const photoUrl=(name:string):string|undefined=>photos[name]?commonsUrl(photos[name].file):undefined;
export const photoPage=(name:string):string|undefined=>photos[name]?commonsPage(photos[name].file):undefined;
export const mediaAssets:MediaAsset[]=Object.entries(photos).map(([name,p])=>({
 id:imageId("player",name),
 entityType:"player",entityId:playerId(name),kind:"portrait",
 url:commonsUrl(p.file),sourcePage:commonsPage(p.file),
 author:p.author,license:p.license,licenseUrl:p.licenseUrl,
 changed:p.changed??false,
 source:{system:"wikimedia-commons",url:commonsPage(p.file)}
}));
