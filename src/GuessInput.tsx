import React,{useMemo,useRef,useState}from"react";
import{ArrowRight,Search}from"lucide-react";
import{allPlayers}from"./catalog";
import{careers,mysteries}from"./gameData";

/** Bezeichnungen werden für die Suche vereinheitlicht; die angezeigten Namen bleiben unverändert. */
export function normalizeName(value:string):string{
 return value.toLocaleLowerCase("de").replace(/ø/g,"o").replace(/ł/g,"l").replace(/æ/g,"ae").replace(/ß/g,"ss")
 .normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
}
export const knownPlayerNames=Array.from(new Set([
 ...allPlayers.map(p=>p.name),
 ...careers.flatMap(c=>[c.answer,...c.choices]),
 ...mysteries.flatMap(q=>[q.answer,...q.choices])
])).sort((a,b)=>a.localeCompare(b,"de"));

export type GuessInputProps={
 id:string;
 onGuess:(name:string)=>void;
 disabled?:boolean;
 names?:readonly string[];
 label?:string;
 placeholder?:string;
 buttonText?:string;
};
/** Das Eingabefeld beginnt leer; Vorschläge erscheinen erst während der Eingabe. */
export function GuessInput({id,onGuess,disabled=false,names=knownPlayerNames,label="SPIELER EINTIPPEN",placeholder="Spielernamen eingeben …",buttonText="PRÜFEN"}:GuessInputProps){
 const[text,setText]=useState("");
 const[open,setOpen]=useState(false);
 const[focused,setFocused]=useState(0);
 const[error,setError]=useState("");
 const input=useRef<HTMLInputElement>(null);
 const matches=useMemo(()=>{
  const term=normalizeName(text.trim());
  if(term.length<2)return[];
  return [...new Set(names)].filter(n=>normalizeName(n).includes(term)).sort((a,b)=>{
   const aStart=normalizeName(a).startsWith(term)?0:1,bStart=normalizeName(b).startsWith(term)?0:1;
   return aStart-bStart||a.localeCompare(b,"de");
  }).slice(0,7);
 },[names,text]);
 function submit(name?:string){
  if(disabled)return;
  const match=name??names.find(n=>normalizeName(n)===normalizeName(text));
  if(!match){setError("Wähle einen Spieler aus den Suchtreffern oder gib den vollständigen Namen ein.");setOpen(true);input.current?.focus();return}
  onGuess(match);setText("");setOpen(false);setFocused(0);setError("");
 }
 return <div className="typed-guess">
  <label htmlFor={id}>{label}</label>
  <div className="typed-guess-row">
   <div className="typed-guess-control"><Search size={20}/><input ref={input} id={id} type="text" autoComplete="off" autoCapitalize="words" spellCheck={false} disabled={disabled} value={text} placeholder={placeholder} onFocus={()=>text.trim().length>=2&&setOpen(true)} onChange={e=>{setText(e.target.value);setOpen(true);setFocused(0);setError("")}} onKeyDown={e=>{
    if(e.key==="Escape"){setOpen(false);return}
    if(e.key==="ArrowDown"&&matches.length){e.preventDefault();setFocused(f=>Math.min(f+1,matches.length-1));setOpen(true)}
    if(e.key==="ArrowUp"&&matches.length){e.preventDefault();setFocused(f=>Math.max(f-1,0))}
    if(e.key==="Enter"){e.preventDefault();const exact=names.find(n=>normalizeName(n)===normalizeName(text));submit(exact??(open?matches[focused]:undefined))}
   }}/></div>
   <button type="button" disabled={disabled} onClick={()=>submit()}>{buttonText}<ArrowRight size={18}/></button>
  </div>
  {error&&<p className="typed-guess-error" role="alert">{error}</p>}
  {open&&matches.length>0&&!disabled&&<div className="typed-guess-results" role="listbox" aria-label="Gefundene Fußballspieler">
   {matches.map((n,i)=><button key={n} type="button" role="option" aria-selected={focused===i} className={focused===i?"highlighted":""} onMouseDown={e=>e.preventDefault()} onClick={()=>submit(n)}><span>{n}</span><ArrowRight size={16}/></button>)}
  </div>}
  {!disabled&&<p className="typed-guess-tip">Tippe mindestens zwei Buchstaben. Du kannst mit <kbd>Enter</kbd> bestätigen oder einen Treffer antippen.</p>}
 </div>
}
