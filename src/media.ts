export type Photo={file:string;author:string;license:string;licenseUrl:string};
export const photos:Record<string,Photo>={
"Lamine Yamal":{file:"Lamine Yamal Argentina v Spain 19 July 2026-214.jpg",author:"Bryan Berlin",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
"Erling Haaland":{file:"Erling Haaland 2023.jpg",author:"Jacek Stanislawek",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
"Kylian Mbappé":{file:"Kylian Mbappé (46369981091).jpg",author:"Balkan Photos",license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"},
"Pedri":{file:"Pedri France v Spain 7.24.26-226.jpg",author:"Bryan Berlin",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
"Harry Kane":{file:"Harry Kane 2023.jpg",author:"Number 10 / Simon Walker",license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"},
"Mohamed Salah":{file:"Mohamed Salah.JPG",author:"Ultraslansi",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"}
};
export function photoUrl(name:string){const p=photos[name];return p?"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(p.file)+"?width=480":undefined}
export function photoPage(name:string){const p=photos[name];return p?"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(p.file.replaceAll(" ","_")):undefined}
