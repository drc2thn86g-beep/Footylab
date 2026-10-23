import React,{useEffect,useMemo,useState}from"react";
import{ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Check,ChevronLeft,Eye,Flame,Grid3X3,Info,RotateCcw,Shield,UserRound,X}from"lucide-react";
import{datasets,type Category,type Dataset,type Entry}from"./data";
import{careers,gridBoards,mysteries}from"./gameData";
import{photoUrl}from"./media";

type Mode="ten"|"endless";
type Difficulty="mixed"|"easy"|"hard";
type Pair={a:Entry;b:Entry};
const random=<T,>(arr:T[]):T=>arr[Math.floor(Math.random()*arr.length)];
const shuffle=<T,>(arr:readonly T[]):T[]=>{const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
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
 return <><Intro id="01" type="VERGLEICH" title="HIGHER OR LOWER" description="Zwei Namen, eine Entscheidung. Der rechte Spieler oder Verein rückt nach jeder Antwort automatisch nach links. Kein Weiter-Klicken mehr."/><section className="config-panel"><div className="control-label">01 — WAS WIRD VERGLICHEN?</div><div className="category-tabs">{([["market","MARKTWERT"],["trophies","TROPHÄEN"],["stats","STATISTIKEN"]] as const).map(([c,title])=><button type="button" key={c} className={category===c?"active":""} onClick={()=>{const d=datasets.find(v=>v.category===c)!;setCategory(c);setDatasetId(d.id);reset(d)}}>{title}</button>)}</div><div className="control-row"><label>DISZIPLIN<select value={datasetId} onChange={e=>{const d=datasets.find(v=>v.id===e.target.value)!;setDatasetId(d.id);reset(d)}}>{datasets.filter(d=>d.category===category).map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select></label><label>SPIELMODUS<select value={mode} onChange={e=>{const m=e.target.value as Mode;setMode(m);reset(dataset,m)}}><option value="ten">10-FRAGEN-RUNDE</option><option value="endless">ENDLOSMODUS</option></select></label><label>SCHWIERIGKEIT<select value={difficulty} onChange={e=>{const z=e.target.value as Difficulty;setDifficulty(z);reset(dataset,mode,z)}}><option value="easy">EINFACH</option><option value="mixed">GEMISCHT</option><option value="hard">SCHWER</option></select></label></div></section><section className="play-shell">
 {gameOver?<Summary title={mode==="endless"?"STREAK BEENDET":"RUNDE BEENDET"} points={score} total={mode==="ten"?10:undefined} onAgain={()=>reset()}/>:<>
 <div className="play-top"><div><span className="eyebrow">MATCHUP / {dataset.title.toUpperCase()}</span><h2>{dataset.id==="birth-year"?"WER WURDE SPÄTER GEBOREN?":"WER HAT MEHR?"}</h2></div><ScoreBox score={score} round={round} total={mode==="ten"?10:undefined} best={best}/></div>
 <div className="round-track"><div className="round-fill" style={{width:mode==="ten"?(round/10*100)+"%":"100%"}}/></div>
 <div className="comparison" aria-live="polite"><div className="compare-card known" key={"left-"+pair.a.name}><div className="card-number">01 / REFERENZ</div><Picture key={pair.a.name} name={pair.a.name} club={isClub}/><h3>{pair.a.name}</h3><strong>{pair.a.value}</strong><span>{dataset.unit}</span></div><div className="versus">VS</div><div className={"compare-card unknown "+(choice!==null?(isCorrect?"answered-right":"answered-wrong"):"")} key={"right-"+pair.b.name}><div className="card-number">02 / DEINE WAHL</div><Picture key={pair.b.name} name={pair.b.name} club={isClub}/><h3>{pair.b.name}</h3><strong className={choice===null?"unknown-value":""}>{choice===null?"?":pair.b.value}</strong><span>{dataset.unit}</span></div></div>
 <div className="answer-area">{choice===null?<><div className="answer-prompt">{dataset.id==="birth-year"?"WURDE "+pair.b.name.toUpperCase()+" SPÄTER ODER FRÜHER GEBOREN?":<>HAT <strong>{pair.b.name.toUpperCase()}</strong> MEHR ODER WENIGER?</>}</div><div className="vote-row"><button onClick={()=>guess("higher")} className="vote-higher"><ArrowUp size={24}/> {dataset.id==="birth-year"?"SPÄTER":"HÖHER"} <kbd>↑</kbd></button><button onClick={()=>guess("lower")} className="vote-lower"><ArrowDown size={24}/> {dataset.id==="birth-year"?"FRÜHER":"NIEDRIGER"} <kbd>↓</kbd></button></div></>:<div className={"answer-feedback "+(isCorrect?"right":"wrong")} role="status"><div>{isCorrect?<Check size={26}/>:<X size={26}/>}<strong>{isCorrect?"RICHTIG!":"DANEBEN!"}</strong></div><span>{mode==="endless"&&!isCorrect||mode==="ten"&&round===10?"GLEICH KOMMT DEIN ERGEBNIS":"NÄCHSTER VERGLEICH STARTET AUTOMATISCH ..."}</span><div className="auto-meter" key={round}/></div>}</div>
 <div className="play-foot"><span><Info size={14}/> Datenstand: {dataset.stand}</span><a href={dataset.source} target="_blank" rel="noreferrer">QUELLE <ArrowRight size={14}/></a></div>
 </>}</section></>;
}
export function CareerPath(){
 const[deck,setDeck]=useState(()=>shuffle(careers).slice(0,10));
 const[index,setIndex]=useState(0);const[answer,setAnswer]=useState<string|null>(null);const[score,setScore]=useState(0);
 const done=index>=deck.length;const question=deck[index];const options=useMemo(()=>question?shuffle(question.choices):[],[question]);
 useEffect(()=>{if(answer===null)return;const t=window.setTimeout(()=>{setIndex(v=>v+1);setAnswer(null)},1750);return()=>window.clearTimeout(t)},[answer]);
 function choose(name:string){if(answer!==null)return;setAnswer(name);if(name===question.answer)setScore(s=>s+1)}
 function restart(){setDeck(shuffle(careers).slice(0,10));setIndex(0);setAnswer(null);setScore(0)}
 return <><Intro id="02" type="KARRIERE" title="CAREER PATH" description="Die Vereine erzählen die Geschichte. Errate den Spieler, bevor der Schlusspfiff ertönt – zehn Karrieren pro Runde."/><section className="play-shell">{done?<Summary title="KARRIERE-CHECK BEENDET" points={score} total={deck.length} onAgain={restart}/>:<>
 <div className="play-top"><div><span className="eyebrow">WESSEN LAUFBAHN IST DAS?</span><h2>WER BIN ICH?</h2></div><ScoreBox score={score} round={index+1} total={deck.length}/></div>
 <div className="round-track"><div className="round-fill" style={{width:((index+1)/deck.length*100)+"%"}}/></div>
 <div className="career-timeline">{question.clubs.map((club,i)=><React.Fragment key={i}>{i>0&&<ArrowRight size={17} className="path-arrow"/>}<div className="club-stop"><span>{String(i+1).padStart(2,"0")}</span><Shield size={19}/><b>{club}</b></div></React.Fragment>)}</div>
 <span className="control-label">WELCHER SPIELER HAT DIESE STATIONEN?</span>
 <div className="choice-grid">{options.map((name,i)=><button disabled={answer!==null} className={"choice-button "+(answer!==null?(name===question.answer?"correct-option":answer===name?"wrong-option":"dim-option"):"")} key={name} onClick={()=>choose(name)}><span>{String.fromCharCode(65+i)}</span>{name}{answer!==null&&name===question.answer?<Check size={20}/>:answer===name?<X size={20}/>:<ArrowRight size={17}/>}</button>)}</div>
 {answer!==null&&<div className={"short-feedback "+(answer===question.answer?"success":"failure")} role="status"><strong>{answer===question.answer?"RICHTIG":"LEIDER FALSCH"} – {question.answer}</strong><span>{question.fact} · Nächste Karriere automatisch.</span></div>}
 </>}</section></>;
}
export function FootballGrid(){
 const[boardId,setBoardId]=useState(gridBoards[0].id);const[answers,setAnswers]=useState<Record<number,string>>({});const[active,setActive]=useState<number|null>(null);
 const board=gridBoards.find(b=>b.id===boardId)??gridBoards[0];
 const answered=Object.keys(answers).length;const score=Object.entries(answers).filter(([i,v])=>board.cells[Number(i)].answer===v).length;
 const current=active===null?null:board.cells[active];
 const options=useMemo(()=>current?shuffle(current.choices):[],[current]);
 const done=answered===9;
 function boardChange(id:string){setBoardId(id);setAnswers({});setActive(null)}
 function nextBoard(){const n=(gridBoards.findIndex(b=>b.id===board.id)+1)%gridBoards.length;boardChange(gridBoards[n].id)}
 return <><Intro id="03" type="WISSEN" title="FOOTBALL GRID" description="Drei Vereine treffen auf drei Länder. Finde den Fußballer, der beide Bedingungen erfüllt. Jedes Feld zählt."/><section className="config-panel board-switch"><span className="control-label">SPIELFELD WÄHLEN</span><div className="board-options">{gridBoards.map((b,i)=><button key={b.id} className={boardId===b.id?"active":""} onClick={()=>boardChange(b.id)}>GRID {String(i+1).padStart(2,"0")}</button>)}</div><span className="board-name">{board.label}</span></section><section className="play-shell"><div className="play-top"><div><span className="eyebrow">KREUZWISSEN / 3 × 3</span><h2>ALLE NEUN FELDER</h2></div><ScoreBox score={score} round={answered} total={9}/></div><div className="football-grid"><div className="grid-corner"><Grid3X3 size={22}/></div>{board.columns.map(col=><div key={col} className="grid-col-head">{col}</div>)}{board.rows.map((row,i)=><React.Fragment key={row}><div className="grid-row-head">{row}</div>{board.columns.map((col,j)=>{const idx=i*3+j;const choice=answers[idx];const correct=choice!==undefined&&choice===board.cells[idx].answer;return <button aria-label={row+" und "+col} key={col} className={"grid-tile "+(idx===active?"grid-active ":"")+(choice!==undefined?(correct?"grid-done":"grid-fail"):"")} onClick={()=>setActive(idx)}>{choice===undefined?<span>+</span>:<><span>{correct?<Check size={20}/>:<X size={20}/>}</span><small>{choice}</small></>}</button>})}</React.Fragment>)}</div>
 {done?<div className="end-note"><strong>{score} / 9 FELDER GELÖST</strong><p>Anderes Team, neues Grid? Hier warten weitere Kombinationen.</p><button className="btn-solid" onClick={nextBoard}><RotateCcw size={18}/> NÄCHSTES GRID</button></div>:<div className="grid-question-panel">{active===null?<p>Wähle ein freies Kästchen, um deine Antwortmöglichkeiten zu sehen.</p>:<><span className="eyebrow">{board.rows[Math.floor(active/3)]} + {board.columns[active%3]}</span>{answers[active]===undefined?<><h3>WER PASST IN DIESES FELD?</h3><div className="choice-grid">{options.map((name,i)=><button className="choice-button" key={name} onClick={()=>setAnswers(prev=>({...prev,[active]:name}))}><span>{String.fromCharCode(65+i)}</span>{name}<ArrowRight size={16}/></button>)}</div></>:<div className="grid-solution"><strong>{answers[active]===current?.answer?"RICHTIG!":"LEIDER NICHT."}</strong><p>Gesucht: {current?.answer}. Wähle jetzt ein weiteres Kästchen.</p></div>}</>}</div>}
 <p className="source-note">Redaktionell zusammengestellte Karrieredaten. In dieser Version hat jedes Feld eine Auswahl aus vier Antworten.</p></section></>;
}
export function WhoAmI(){
 const[deck,setDeck]=useState(()=>shuffle(mysteries).slice(0,8));
 const[index,setIndex]=useState(0);const[hint,setHint]=useState(0);const[answer,setAnswer]=useState<string|null>(null);const[score,setScore]=useState(0);
 const done=index>=deck.length;const question=deck[index];const options=useMemo(()=>question?shuffle(question.choices):[],[question]);
 useEffect(()=>{if(answer===null)return;const t=window.setTimeout(()=>{setIndex(i=>i+1);setHint(0);setAnswer(null)},1750);return()=>window.clearTimeout(t)},[answer]);
 function choose(name:string){if(answer!==null)return;setAnswer(name);if(name===question.answer)setScore(v=>v+4-hint)}
 function restart(){setDeck(shuffle(mysteries).slice(0,8));setIndex(0);setHint(0);setAnswer(null);setScore(0)}
 return <><Intro id="04" type="RÄTSEL" title="WER BIN ICH?" description="Erkenne eine Fußballlegende anhand von Hinweisen. Wer früher richtig liegt, kassiert mehr Punkte."/><section className="play-shell">{done?<Summary title="DU HAST ABGELIEFERT" points={score} total={32} onAgain={restart}/>:<>
 <div className="play-top"><div><span className="eyebrow">MYSTERY PLAYER / {index+1} VON {deck.length}</span><h2>WEM GEHÖREN DIESE FAKTEN?</h2></div><ScoreBox score={score} round={index+1} total={8}/></div>
 <div className="round-track"><div className="round-fill" style={{width:((index+1)/deck.length*100)+"%"}}/></div>
 <div className="mystery-board"><div className="mystery-icon"><Eye size={39}/><span>?</span></div><div className="mystery-clues">{question.clues.slice(0,hint+1).map((clue,i)=><div key={i} className="clue"><span>HINWEIS {String(i+1).padStart(2,"0")}</span><p>{clue}</p></div>)}</div></div>
 <div className="hint-bar"><span>WERT DIESER FRAGE: <strong>{4-hint} PUNKTE</strong></span>{hint<3&&answer===null?<button onClick={()=>setHint(v=>v+1)}><Eye size={17}/> NÄCHSTER HINWEIS (−1 PKT)</button>:<span>{hint===3?"ALLE HINWEISE SICHTBAR":""}</span>}</div>
 <span className="control-label">DEIN TIPP</span><div className="choice-grid">{options.map((name,i)=><button key={name} disabled={answer!==null} onClick={()=>choose(name)} className={"choice-button "+(answer!==null?(name===question.answer?"correct-option":answer===name?"wrong-option":"dim-option"):"")}><span>{String.fromCharCode(65+i)}</span>{name}{answer!==null&&name===question.answer?<Check size={20}/>:answer===name?<X size={20}/>:<ArrowRight size={17}/>}</button>)}</div>
 {answer!==null&&<div className={"short-feedback "+(answer===question.answer?"success":"failure")} role="status"><strong>{answer===question.answer?"GEWUSST! +"+(4-hint)+" PUNKTE":"DAS WAR "+question.answer.toUpperCase()}</strong><span>Nächster Spieler erscheint automatisch.</span></div>}
 </>}</section></>;
}
