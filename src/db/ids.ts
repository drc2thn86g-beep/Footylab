import{normalizeName}from"../normalize.ts";

/** Stable IDs derived from names until a data provider supplies canonical IDs.
 * Never use Array indexes as identifiers: API mappings can be added later. */
export function stableSlug(name:string):string{
 return name.toLocaleLowerCase("de")
  .replace(/ß/g,"ss").replace(/ø/g,"o").replace(/ł/g,"l").replace(/æ/g,"ae")
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
export const playerId=(name:string)=>"player:"+stableSlug(name);
export const clubId=(name:string)=>"club:"+stableSlug(name);
export const imageId=(kind:"player"|"club",name:string)=>"image:"+kind+":"+stableSlug(name);
export const sameName=(a:string,b:string)=>normalizeName(a)===normalizeName(b);
