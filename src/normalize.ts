/** Vereinheitlicht Eingaben für faire Namensvergleiche unabhängig von Akzenten. */
export function normalizeName(value:string):string{
 return value.toLocaleLowerCase("de").replace(/ø/g,"o").replace(/ł/g,"l").replace(/æ/g,"ae").replace(/ß/g,"ss")
 .normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
}
