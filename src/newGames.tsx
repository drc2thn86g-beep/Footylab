import React,{useEffect,useMemo,useRef,useState}from"react";
import{ArrowRight,ChevronLeft,RotateCcw,Search,Target}from"lucide-react";
import{allPlayers as catalogPlayers,leagueNames,type Player,type League}from"./catalog";
import{wordlePlayers as baselinePlayers,playableWordlePlayers as baselinePlayable}from"./db/queries";
import{photoUrl}from"./media";

function Intro({index,kind,title,description}:{index:string;kind:string;title:string;description:string}){
 return <div className="game-intro"><a href="/#spiele" className="return-link"><ChevronLeft size={17}/> ZUR SPIELAUSWAHL</a><div className="game-kicker"><span>SPIEL {index} / 06</span><span>{kind}</span></div><h1>{title}</h1><p>{description}</p></div>
}
function normalize(s:string){return s.toLocaleLowerCase("de").replace(/ø/g,"o").replace(/ł/g,"l").replace(/æ/g,"ae").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"")}
function dateKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
type ApiPlayer={id:number;name:string;club:string;league:string;position:string|null;checkedAt:string};
const knownMap=new Map<string,Player[]>();
for(const player of catalogPlayers){
 const id=normalize(player.name);
 knownMap.set(id,[...(knownMap.get(id)??[]),player]);
}
function apiPool(items:readonly ApiPlayer[]):Player[]{
 const selected=new Map<string,Player>();
 for(const item of items){
  const known=knownMap.get(normalize(item.name));
  // Ambiguous names must never be matched to a different footballer.
  if(known?.length!==1)continue;
  if(!(leagueNames as string[]).includes(item.league))continue;
  if(Date.now()-Date.parse(item.checkedAt)>14*86400000)continue;
  const p=known[0];
  selected.set(normalize(p.name),{...p,club:item.club,league:item.league as League});
 }
 return [...selected.values()].sort((a,b)=>a.name.localeCompare(b.name,"de"));
}
function dayPlayer(pool:readonly Player[]):Player{
 const key=dateKey();let hash=0x811c9dc5;
 for(let i=0;i<key.length;i++)hash=Math.imul(hash^key.charCodeAt(i),16777619);
 return pool[(hash>>>0)%pool.length];
}
function randomPlayer(pool:readonly Player[],exclude?:string,league:League|"all"="all"):Player{
 const available=pool.filter(p=>p.name!==exclude&&(league==="all"||p.league===league));
 if(!available.length)throw new Error("Für diese Liga sind noch keine geeigneten Spieler hinterlegt.");
 return available[Math.floor(Math.random()*available.length)];
}
function savedDaily(pool:readonly Player[]):Player[]{
 try{
  const data=JSON.parse(localStorage.getItem("footylab-wordle-current-v1-"+dateKey())||"[]");
  if(!Array.isArray(data))return[];
  const map=new Map(pool.map(p=>[p.name,p]));
  return data.filter((x):x is string=>typeof x==="string").slice(0,8)
   .map(name=>map.get(name)).filter((p):p is Player=>!!p);
 }catch{return[]}
}
type Tone="exact"|"close"|"miss";
function clue(guess:Player,target:Player){
 return{
  nation:{text:guess.nation,tone:guess.nation===target.nation?"exact":"miss"},
  club:{text:guess.club,tone:guess.club===target.club?"exact":guess.league===target.league?"close":"miss"},
  league:{text:guess.league,tone:guess.league===target.league?"exact":"miss"},
  position:{text:guess.position,tone:guess.position===target.position?"exact":"miss"},
  year:{text:String(guess.birthYear)+(guess.birthYear===target.birthYear?"":guess.birthYear<target.birthYear?" ↑":" ↓"),tone:guess.birthYear===target.birthYear?"exact":"close"}
 } as Record<"nation"|"club"|"league"|"position"|"year",{text:string;tone:Tone}>;
}
const cols=[["nation","NATION"],["club","AKTUELLER VEREIN"],["league","LIGA"],["position","POSITION"],["year","JAHRGANG"]] as const;
const MAX=8;
function WordleRound({mode,leagueFilter,pool,source}:{mode:"daily"|"free";leagueFilter:League|"all";pool:readonly Player[];source:"api"|"editorial"}){
 const[secret,setSecret]=useState<Player>(()=>mode==="daily"?dayPlayer(pool):randomPlayer(pool,undefined,leagueFilter));
 const[guesses,setGuesses]=useState<Player[]>(()=>mode==="daily"?savedDaily(pool):[]);
 const[query,setQuery]=useState("");
 const[open,setOpen]=useState(false);
 const[focused,setFocused]=useState(0);
 const[inputError,setInputError]=useState("");
 const input=useRef<HTMLInputElement>(null);
 const guessed=guesses.some(g=>g.name===secret.name);
 const finished=guessed||guesses.length>=MAX;
 const hints=useMemo(()=>pool.filter(p=>(mode==="daily"||leagueFilter==="all"||p.league===leagueFilter)&&!guesses.some(g=>g.name===p.name)&&normalize(p.name).includes(normalize(query))).sort((a,b)=>a.name.localeCompare(b.name,"de")).slice(0,7),[query,guesses,mode,leagueFilter,pool]);
 function submit(player:Player){
  if(finished||guesses.some(g=>g.name===player.name))return;
  const next=[...guesses,player];setGuesses(next);setQuery("");setOpen(false);setFocused(0);setInputError("");
  if(mode==="daily"){try{localStorage.setItem("footylab-wordle-current-v1-"+dateKey(),JSON.stringify(next.map(p=>p.name)))}catch{/* Safari private mode */}}
 }
 function submitText(){const match=pool.find(p=>normalize(p.name)===normalize(query));if(match){submit(match);return}if(hints.length===1){submit(hints[0]);return}setInputError("Wähle einen Spieler aus der Liste.");setOpen(true)}
 function fresh(){setSecret(current=>randomPlayer(pool,current.name,leagueFilter));setGuesses([]);setQuery("");setInputError("");setOpen(false)}
 return <div className="play-shell wordle-shell">
  <div className="wordle-score"><div><span className="eyebrow">{mode==="daily"?"DAS TAGESRÄTSEL · "+dateKey():"TRAINING / ZUFALLSSPIELER"}</span><h2>FINDE DEN SPIELER</h2></div><div className="wordle-tries"><strong>{String(guesses.length).padStart(2,"0")}<small> / {MAX}</small></strong><span>VERSUCHE</span></div></div>
  <div className="wordle-legend"><span><i className="legend-exact"/> ÜBEREINSTIMMUNG</span><span><i className="legend-close"/> GLEICHE LIGA / JAHRGANG-RICHTUNG</span><span><i className="legend-miss"/> KEIN TREFFER</span></div>
  {!finished?<div className="wordle-search-box">
   <label htmlFor="wordle-search">WELCHEN SPIELER VERMUTEST DU?</label>
   <div className="wordle-search-line"><div className="wordle-search-input"><Search size={20}/><input ref={input} id="wordle-search" autoComplete="off" spellCheck={false} value={query} placeholder="Spielernamen suchen …" onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setFocused(0);setInputError("");setOpen(true)}} onKeyDown={e=>{if(e.key==="Escape"){setOpen(false);return}if(e.key==="ArrowDown"){e.preventDefault();setFocused(f=>Math.min(f+1,Math.max(0,hints.length-1)));setOpen(true)}if(e.key==="ArrowUp"){e.preventDefault();setFocused(f=>Math.max(0,f-1))}if(e.key==="Enter"){e.preventDefault();const exact=pool.find(p=>normalize(p.name)===normalize(query));if(exact)submit(exact);else if(open&&hints[focused])submit(hints[focused]);else submitText()}}}/></div><button onClick={submitText}>TIPPEN <ArrowRight size={18}/></button></div>
   {inputError&&<div className="wordle-error" role="alert">{inputError}</div>}
   {open&&query.trim().length>0&&<div className="wordle-options" role="listbox" aria-label="Spielerauswahl">{hints.length?hints.map((p,i)=><button type="button" role="option" aria-selected={focused===i} className={focused===i?"focused":""} key={p.name} onClick={()=>submit(p)}><span>{p.name}</span><small>{p.nation} · {p.position}</small><ArrowRight size={15}/></button>):<p>Keinen Spieler gefunden. Versuche einen anderen Namen.</p>}</div>}
  </div>:<div className={"wordle-finish "+(guessed?"success":"failure")} role="status"><span className="eyebrow">{guessed?"TOOOOR! / GELÖST":"ABPFIFF / NICHT GELÖST"}</span><div className="wordle-reveal">{photoUrl(secret.name)?<img src={photoUrl(secret.name)} alt="" onError={e=>e.currentTarget.style.display="none"}/>:<span className="wordle-monogram">{secret.name.split(" ").slice(0,2).map(x=>x[0]).join("")}</span>}<div><h3>{secret.name}</h3><p>{secret.nation} · {secret.position} · Jahrgang {secret.birthYear}</p><small>AKTUELLER VEREIN (KADER 2026/27): {secret.club} ({secret.league})</small></div></div><p>{guessed?"Richtig nach "+guesses.length+" Versuchen!":"Auch mit acht Versuchen kann nicht jeder Treffer sitzen."} {mode==="daily"?"Morgen gibt es einen neuen Tages-Spieler.":"Starte direkt eine weitere Runde."}</p>{mode==="free"&&<button className="btn-solid" onClick={fresh}><RotateCcw size={18}/> NÄCHSTER SPIELER</button>}</div>}
  <div className="wordle-history" aria-live="polite"><div className="wordle-history-head"><strong>DEINE TIPPS</strong><span>{guesses.length} / {MAX} ABGEGEBEN</span></div>{guesses.length===0?<div className="wordle-empty"><Target size={26}/><strong>NOCH KEIN SCHUSS AUFS TOR</strong><p>Gib einen Spielernamen ein. Die farbigen Felder helfen dir, den gesuchten Profi einzugrenzen.</p></div>:guesses.map((guess,index)=>{const c=clue(guess,secret);return <div className="wordle-guess" key={guess.name}><div className="wordle-guess-index">#{index+1}</div><div className="wordle-guess-content"><strong>{guess.name}</strong><div className="wordle-clues">{cols.map(([field,label])=><div key={field} className={"wordle-clue wordle-"+c[field].tone} title={label}><small>{label}</small><span>{c[field].text}</span></div>)}</div></div></div>})}</div>
  <p className="source-note">Rätselbasis: {pool.length} Spieler. {source==="api"?"Aktuelle Vereins- und Ligazuordnung aus zwischengespeicherten API-Football-Kadern.":"Vereins- und Ligazugehörigkeit aus der redaktionellen Momentaufnahme vom Oktober 2026."} Nationalität und Jahrgang stammen aus unserem redaktionellen Katalog. ↑ = gesuchter Spieler ist jünger, ↓ = älter.</p>
 </div>
}
export function FootballWordle(){
 const[mode,setMode]=useState<"daily"|"free">("free");
 const[leagueFilter,setLeagueFilter]=useState<League|"all">("all");
 const[live,setLive]=useState<Player[]|null>(null);
 useEffect(()=>{
  const ctrl=new AbortController();
  fetch("/api/footy/game-roster",{signal:ctrl.signal}).then(async response=>{
   if(!response.ok)return;
   const data=await response.json() as {ok:boolean;players?:ApiPlayer[]};
   if(ctrl.signal.aborted||!Array.isArray(data.players))return;
   const parsed=apiPool(data.players);
   if(parsed.length>=20)setLive(parsed);
  }).catch(()=>{/* API not configured yet: curated Wordle stays playable */});
  return()=>ctrl.abort();
 },[]);
 const liveAvailable=mode==="free"&&live!==null&&(leagueFilter==="all"||live.filter(p=>p.league===leagueFilter).length>=5);
 const pool=liveAvailable?live!:baselinePlayable;
 const source=liveAvailable?"api" as const:"editorial" as const;
 return <><Intro index="05" kind="SPIELER-RÄTSEL" title="FOOTBALL WORDLE" description="Errate einen Fußballprofi in höchstens acht Versuchen. Die Vereins- und Ligahinweise beruhen jetzt auf offiziellen Kaderlisten der Saison 2026/27."/><section className="config-panel wordle-switch"><span className="control-label">SPIELVARIANTE WÄHLEN</span><div className="category-tabs"><button className={mode==="free"?"active":""} onClick={()=>setMode("free")}>FREIES SPIEL</button><button className={mode==="daily"?"active":""} onClick={()=>setMode("daily")}>TAGESRÄTSEL</button></div>{mode==="free"&&<label className="wordle-league-filter">LIGA IM TRAINING <select value={leagueFilter} onChange={e=>setLeagueFilter(e.target.value as League|"all")}><option value="all">ALLE 5 LIGEN</option>{leagueNames.map(name=><option key={name} value={name}>{name}</option>)}</select></label>}<p>Im Tagesrätsel bekommen alle am selben lokalen Kalendertag denselben Spieler. Dein Tippverlauf wird auf diesem Gerät gespeichert.</p></section><WordleRound key={mode+"-"+leagueFilter+"-"+source} mode={mode} leagueFilter={mode==="daily"?"all":leagueFilter} pool={pool} source={source}/></>
}
