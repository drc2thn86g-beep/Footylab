import{allPlayers,playerClubHistory}from"./catalog";
import{careers,gridBoards,type GridBoard}from"./gameData";
import{normalizeName}from"./GuessInput";

/** Zusätzliche nachprüfbare Karrierestationen als mögliche Lösungen. */
const extras:Record<string,string[][]>={
europe:[
["Sami Khedira","Antonio Rüdiger","Mesut Özil"],
["Kylian Mbappé","Eduardo Camavinga","Aurélien Tchouaméni","Raphaël Varane"],
["Dani Carvajal","Iker Casillas","Nacho Fernández","Marco Asensio"],
["Timo Werner","Antonio Rüdiger","Michael Ballack","André Schürrle"],
["Olivier Giroud","Nicolas Anelka","Christopher Nkunku"],
["Marc Cucurella","Robert Sánchez","Cesc Fàbregas","Fernando Torres"],
["Manuel Neuer","Joshua Kimmich","Bastian Schweinsteiger","Jamal Musiala","Mario Gómez"],
["Michael Olise","Dayot Upamecano","Kingsley Coman","Corentin Tolisso"],
["Javi Martínez","Juan Bernat","Marc Roca"]],
england:[
["John Stones","Jack Grealish","Kyle Walker","Raheem Sterling"],
["Jérémy Doku","Vincent Kompany"],
["Nigel de Jong"],
["Declan Rice","Ben White","Aaron Ramsdale","Theo Walcott"],
["Thomas Vermaelen","Albert Sambi Lokonga"],
["Jurriën Timber","Dennis Bergkamp"],
["Cole Palmer","Reece James","John Terry","Mason Mount"],
["Romelu Lukaku","Thibaut Courtois","Michy Batshuayi"],
["Ruud Gullit","Nathan Aké"]],
world:[
["Neymar","Raphinha","Dani Alves","Rivaldo"],
["Javier Mascherano","Sergio Agüero"],
["João Félix","João Cancelo","Deco"],
["Rodrygo","Marcelo","Kaká","Casemiro"],
["Gonzalo Higuaín","Walter Samuel"],
["Pepe","Fábio Coentrão"],
["Bremer","Dani Alves","Douglas Costa"],
["Gonzalo Higuaín","Ángel Di María","Carlos Tévez"],
["Cristiano Ronaldo"]]};
function canonClub(value:string){
 const key=normalizeName(value.replace(/\(.*?\)/g,""));
 if(key==="juventus"||key==="juventusturin")return"juventus";
 if(key==="fcbarcelona"||key==="barcelona")return"barcelona";
 if(key==="mancity")return"manchestercity";
 return key;
}
function autoMatches(board:GridBoard,index:number){
 const club=canonClub(board.rows[Math.floor(index/3)]);
 const nation=board.columns[index%3];
 return allPlayers.filter(p=>{
  if(p.nation!==nation)return false;
  const history=[...(playerClubHistory.get(p.name)??[]),...(careers.find(c=>c.answer===p.name)?.clubs??[])];
  return history.some(c=>canonClub(c)===club);
 }).map(p=>p.name);
}
export function acceptedGridNames(board:GridBoard,index:number):string[]{
 const cell=board.cells[index];if(!cell)return[];
 return [...new Set([cell.answer,...(extras[board.id]?.[index]??[]),...autoMatches(board,index)])];
}
export function isGridAnswerCorrect(board:GridBoard,index:number,name:string){
 return acceptedGridNames(board,index).some(n=>normalizeName(n)===normalizeName(name));
}
export function gridAnswerCount(){return gridBoards.reduce((sum,b)=>sum+b.cells.reduce((n,_,i)=>n+acceptedGridNames(b,i).length,0),0)}
