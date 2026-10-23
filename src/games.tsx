import React,{useEffect,useState}from"react";
import{ArrowDown,ArrowRight,ArrowUp,Check,ChevronLeft,Flame,Info,RotateCcw,Shield,UserRound,X}from"lucide-react";
import{datasets,type Category,type Dataset,type Entry}from"./data";
import{photoUrl}from"./media";

type Mode="ten"|"endless";
type Difficulty="mixed"|"easy"|"hard";
type Pair={a:Entry;b:Entry};
const random=<T,>(arr:T[]):T=>arr[Math.floor(Math.random()*arr.length)];
function nextPair(data:Dataset,difficulty:Difficulty,previous?:Pair):Pair{
 const a=previous?.b??random(data.entries);
 let valid=data.entries.filter(b=>b.name!==a.name&&b.value!==a.value);
 if(previous&&valid.some(b=>b.name!==previous.a.name))valid=valid.filter(b=>b.name!==previous.a.name);
 if(!valid.length)throw new Error("Für diese Kategorie fehlen unterschiedliche Vergleichswerte.");
 const ordered=[...valid].sort((x,y)=>Math.abs(x.value-a.value)-Math.abs(y.value-a.value));
 let pool=ordered;
 if(difficulty==="hard")pool=ordered.slice(0,Math.max(2,Math.ceil(ordered.length*.45)));
 if(difficulty==="easy")pool=ordered.slice(Math.max(0,Math.floor(ordered.length*.55)));
 return{a,b:random(pool.length?pool:ordered)};
}
function getBest(key:string){try{return Number(window.localStorage.getItem(key)||0)}catch{return 0}}
function setBestValue(key:string,value:number){try{window.localStorage.setItem(key,String(value))}catch{/* local storage optional */}}
function Picture({name,club=false}:{name:string;club?:boolean}){
 const image=club?undefined:photoUrl(name);
 const[failed,setFailed]=useState(false);
 const letters=name.replace(/^FC\s+/,"").split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase();
 return <div className={"portrait "+(club?"portrait-club":"portrait-player")}>
  {image&&!failed?<img src={image} alt={"Foto von "+name} loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<div className="portrait-fallback" aria-hidden="true">{club?<Shield size={45} strokeWidth={1.3}/>:<UserRound size={47} strokeWidth={1.3}/>}<strong>{letters}</strong></div>}
 </div>;
}
function Intro({id,type,title,description}:{id:string;type:string;title:string;description:string}){return <div className="game-intro"><a href="/#spiele" className="return-link"><ChevronLeft size={17}/> ZUR SPIELAUSWAHL</a><div className="game-kicker"><span>SPIEL {id} / 06</span><span>{type}</span></div><h1>{title}</h1><p>{description}</p></div>}
function ScoreBox({score,round,total,best}:{score:number;round:number;total?:number;best?:number}){return <div className="score-box"><div><small>PUNKTE</small><strong>{score.toString().padStart(2,"0")}</strong></div><div><small>{total?"RUNDE":"STREAK"}</small><strong>{total?round.toString().padStart(2,"0")+"/"+total:round.toString().padStart(2,"0")}</strong></div>{best!==undefined&&<div className="score-best"><small>BESTWERT</small><strong><Flame size={16}/>{best}</strong></div>}</div>}
function Summary({title,points,total,onAgain}:{title:string;points:number;total?:number;onAgain:()=>void}){return <div className="end-screen" role="status"><span className="eyebrow">ABPFIFF // ERGEBNIS</span><strong className="end-score">{points}{total?"/"+total:""}</strong><h2>{title}</h2><p>{total?"Du hast "+points+" von "+total+" Punkten geholt.":"Du hast "+points+" Antworten in Folge richtig gehabt."} Dein nächster Rekord wartet schon.</p><div className="end-actions"><button className="btn-solid" onClick={onAgain}><RotateCcw size={18}/> NEUE RUNDE</button><a href="/#spiele" className="btn-outline">SPIEL WECHSELN <ArrowRight size={17}/></a></div></div>}

export function HigherLower(){
 const[category,setCategory]=useState<Category>("market");
 const[datasetId,setDatasetId]=useState(datasets[0].id);
 const[mode,setMode]=useState<Mode>("ten");
 const[difficulty,setDifficulty]=useState<Difficulty>("mixed");
 const[round,setRound]=useState(1);
 const[score,setScore]=useState(0);
 const[choice,setChoice]=useState<"higher"|"lower"|null>(null);
 const[gameOver,setGameOver]=useState(false);
 const[best,setBest]=useState(()=>getBest("footylab-v3-market-ten-mixed"));
 const[history,setHistory]=useState<boolean[]>([]);
 const dataset=datasets.find(d=>d.id===datasetId)??datasets[0];
 const[pair,setPair]=useState<Pair>(()=>nextPair(datasets[0],"mixed"));
 const correct=pair.b.value>pair.a.value?"higher":"lower";
 const isCorrect=choice!==null&&choice===correct;
 function key(d:Dataset,m:Mode,z:Difficulty){return"footylab-v3-"+d.id+"-"+m+"-"+z}
 function reset(d:Dataset=dataset,m:Mode=mode,z:Difficulty=difficulty){
  setPair(nextPair(d,z));setRound(1);setScore(0);setChoice(null);setHistory([]);setGameOver(false);setBest(getBest(key(d,m,z)));
 }
 function guess(value:"higher"|"lower"){
  if(choice!==null||gameOver)return;
  const right=value===correct;const newScore=score+(right?1:0);
  setChoice(value);setHistory(prev=>[...prev,right]);setScore(newScore);
  if(newScore>best){setBest(newScore);setBestValue(key(dataset,mode,difficulty),newScore)}
 }
 useEffect(()=>{
  if(choice===null||gameOver)return;
  const t=window.setTimeout(()=>{
   if((mode==="endless"&&!isCorrect)||(mode==="ten"&&round>=10)){setGameOver(true);return}
   setPair(current=>nextPair(dataset,difficulty,current));
   setRound(r=>r+1);setChoice(null);
  },1650);
  return()=>window.clearTimeout(t);
 },[choice,gameOver,mode,isCorrect,round,dataset,difficulty]);
 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{const tag=(event.target as HTMLElement)?.tagName;if(tag==="INPUT"||tag==="SELECT"||tag==="BUTTON"||event.repeat)return;if(event.key==="ArrowUp"){event.preventDefault();guess("higher")}if(event.key==="ArrowDown"){event.preventDefault();guess("lower")}};
  document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey);
 },[choice,gameOver,correct,score,best,dataset,mode,difficulty]);
 const isClub=category==="trophies";
 return <><Intro id="01" type="VERGLEICH" title="HIGHER OR LOWER" description="Zwei Namen, eine Entscheidung. Der rechte Spieler oder Verein rückt nach jeder Antwort automatisch nach links. Kein Weiter-Klicken mehr."/><section className="config-panel"><div className="control-label">01 — WAS WIRD VERGLICHEN?</div><div className="category-tabs">{([["market","MARKTWERT"],["trophies","TROPHÄEN"],["stats","STATISTIKEN"]] as const).map(([c,title])=><button type="button" key={c} className={category===c?"active":""} onClick={()=>{const d=datasets.find(v=>v.category===c)!;setCategory(c);setDatasetId(d.id);reset(d)}}>{title}</button>)}</div><div className="discipline-switch"><span className="control-label">02 — DISZIPLIN AUSWÄHLEN</span><div className="discipline-options">{datasets.filter(d=>d.category===category).map((d,i)=><button type="button" key={d.id} aria-pressed={datasetId===d.id} className={datasetId===d.id?"selected":""} onClick={()=>{setDatasetId(d.id);reset(d)}}><span className="discipline-number">{String(i+1).padStart(2,"0")}</span><strong>{d.title}</strong><small>{d.entries.length} Teilnehmer · {d.unit}</small></button>)}</div></div>
<div className="quick-settings"><div><span className="control-label">03 — SPIELMODUS</span><div className="settings-buttons"><button aria-pressed={mode==="ten"} className={mode==="ten"?"selected":""} onClick={()=>{setMode("ten");reset(dataset,"ten")}}>10 FRAGEN</button><button aria-pressed={mode==="endless"} className={mode==="endless"?"selected":""} onClick={()=>{setMode("endless");reset(dataset,"endless")}}>ENDLOSMODUS</button></div></div><div><span className="control-label">04 — SCHWIERIGKEIT</span><div className="settings-buttons">{([["easy","EINFACH"],["mixed","NORMAL"],["hard","SCHWER"]] as const).map(([z,label])=><button key={z} aria-pressed={difficulty===z} className={difficulty===z?"selected":""} onClick={()=>{setDifficulty(z);reset(dataset,mode,z)}}>{label}</button>)}</div></div></div></section><section className="play-shell">
 {gameOver?<Summary title={mode==="endless"?"STREAK BEENDET":"RUNDE BEENDET"} points={score} total={mode==="ten"?10:undefined} onAgain={()=>reset()}/>:<>
 <div className="play-top"><div><span className="eyebrow">MATCHUP / {dataset.title.toUpperCase()}</span><h2>{dataset.id==="birth-year"?"WER WURDE SPÄTER GEBOREN?":"WER HAT MEHR?"}</h2></div><ScoreBox score={score} round={round} total={mode==="ten"?10:undefined} best={best}/></div>
 <div className="round-track"><div className="round-fill" style={{width:mode==="ten"?(round/10*100)+"%":"100%"}}/></div>
 <div className="comparison" aria-live="polite"><div className="compare-card known" key={"left-"+pair.a.name}><div className="card-number">01 / REFERENZ</div><Picture key={pair.a.name} name={pair.a.name} club={isClub}/><h3>{pair.a.name}</h3><strong>{pair.a.value}</strong><span>{dataset.unit}</span></div><div className="versus">VS</div><div className={"compare-card unknown "+(choice!==null?(isCorrect?"answered-right":"answered-wrong"):"")} key={"right-"+pair.b.name}><div className="card-number">02 / DEINE WAHL</div><Picture key={pair.b.name} name={pair.b.name} club={isClub}/><h3>{pair.b.name}</h3><strong className={choice===null?"unknown-value":""}>{choice===null?"?":pair.b.value}</strong><span>{dataset.unit}</span></div></div>
 <div className="answer-area">{choice===null?<><div className="answer-prompt">{dataset.id==="birth-year"?"WURDE "+pair.b.name.toUpperCase()+" SPÄTER ODER FRÜHER GEBOREN?":<>HAT <strong>{pair.b.name.toUpperCase()}</strong> MEHR ODER WENIGER?</>}</div><div className="vote-row"><button onClick={()=>guess("higher")} className="vote-higher"><ArrowUp size={24}/> {dataset.id==="birth-year"?"SPÄTER":"HÖHER"} <kbd>↑</kbd></button><button onClick={()=>guess("lower")} className="vote-lower"><ArrowDown size={24}/> {dataset.id==="birth-year"?"FRÜHER":"NIEDRIGER"} <kbd>↓</kbd></button></div></>:<div className={"answer-feedback "+(isCorrect?"right":"wrong")} role="status"><div>{isCorrect?<Check size={26}/>:<X size={26}/>}<strong>{isCorrect?"RICHTIG!":"DANEBEN!"}</strong></div><span>{mode==="endless"&&!isCorrect||mode==="ten"&&round===10?"GLEICH KOMMT DEIN ERGEBNIS":"NÄCHSTER VERGLEICH STARTET AUTOMATISCH ..."}</span><div className="auto-meter" key={round}/></div>}</div>
 <div className="play-foot"><span><Info size={14}/> Datenstand: {dataset.stand}</span><a href={dataset.source} target="_blank" rel="noreferrer">QUELLE <ArrowRight size={14}/></a></div>
 </>}</section></>;
}
