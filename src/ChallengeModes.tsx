import React,{useEffect,useMemo,useState}from"react";
import{ArrowRight,Check,ChevronLeft,Eye,Grid3X3,RotateCcw,Shield,X}from"lucide-react";
import{careers,gridBoards,mysteries,type GridBoard}from"./gameData";
import{GuessInput,knownPlayerNames,normalizeName}from"./GuessInput";
import{acceptedGridNames,isGridAnswerCorrect}from"./gridRules";

type Answer={name:string;correct:boolean};
type EntryMode="choice"|"type";
type MysteryMode="easy"|"normal"|"pro";
const shuffle=<T,>(items:readonly T[]):T[]=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function Intro({id,type,title,description}:{id:string;type:string;title:string;description:string}){return <div className="game-intro"><a href="/#spiele" className="return-link"><ChevronLeft size={17}/> ZUR SPIELAUSWAHL</a><div className="game-kicker"><span>SPIEL {id} / 06</span><span>{type}</span></div><h1>{title}</h1><p>{description}</p></div>}
function ModeBar<T extends string>({label,value,options,onChange}:{label:string;value:T;options:{value:T;text:string;hint:string}[];onChange:(next:T)=>void}){
 return <div className="mode-settings"><span className="control-label">{label}</span><div className="mode-options" role="group" aria-label={label}>{options.map(opt=><button type="button" aria-pressed={value===opt.value} className={value===opt.value?"is-active":""} onClick={()=>onChange(opt.value)} key={opt.value}><strong>{opt.text}</strong><small>{opt.hint}</small></button>)}</div></div>
}
function Final({score,max,title,onRestart}:{score:number;max:number;title:string;onRestart:()=>void}){return <div className="end-screen" role="status"><span className="eyebrow">ABPFIFF / ENDSTAND</span><strong className="end-score">{score}/{max}</strong><h2>{title}</h2><p>Du kannst die Runde direkt neu starten oder ein anderes Spiel auswählen.</p><div className="end-actions"><button className="btn-solid" onClick={onRestart}><RotateCcw size={18}/> NEUE RUNDE</button><a className="btn-outline" href="/#spiele">ANDERES SPIEL <ArrowRight size={18}/></a></div></div>}
function Feedback({answer,right,extra}:{answer:Answer;right:string;extra?:string}){
 return <div role="status" className={"short-feedback "+(answer.correct?"success":"failure")}><strong>{answer.correct?"RICHTIG!":"LEIDER FALSCH."} {right}</strong>{extra&&<span>{extra}</span>}<small>Nächste Frage startet automatisch …</small></div>
}
export function CareerPathImproved(){
 const[mode,setMode]=useState<EntryMode>("choice");
 const[deck,setDeck]=useState(()=>shuffle(careers).slice(0,10));
 const[index,setIndex]=useState(0);
 const[answer,setAnswer]=useState<Answer|null>(null);
 const[score,setScore]=useState(0);
 const finished=index>=deck.length;
 const q=deck[index];
 const options=useMemo(()=>q?shuffle(q.choices):[],[q]);
 const factor=mode==="type"?2:1;
 function reset(nextMode:EntryMode=mode){setMode(nextMode);setDeck(shuffle(careers).slice(0,10));setIndex(0);setAnswer(null);setScore(0)}
 function guess(name:string){
  if(answer||!q)return;
  const correct=normalizeName(name)===normalizeName(q.answer);
  setAnswer({name,correct});
  if(correct)setScore(s=>s+factor);
 }
 useEffect(()=>{
  if(answer===null)return;
  const timeout=window.setTimeout(()=>{setIndex(i=>i+1);setAnswer(null)},2200);
  return()=>window.clearTimeout(timeout);
 },[answer]);
 return <><Intro id="02" type="KARRIERE" title="CAREER PATH" description="Erkenne den Profi an seinen Vereinsstationen. Spiele mit vier Antworten oder tippe den Namen selbst ein."/>
 <section className="config-panel"><ModeBar label="SCHWIERIGKEIT" value={mode} options={[{value:"choice",text:"KLASSISCH",hint:"4 Antworten · 1 Punkt"},{value:"type",text:"EXPERTE",hint:"Spieler selbst tippen · 2 Punkte"}]} onChange={reset}/></section>
 <section className="play-shell">
  {finished?<Final title="KARRIEREN DURCHSCH AUT" score={score} max={deck.length*factor} onRestart={()=>reset()}/>:<>
   <div className="play-top"><div><span className="eyebrow">KARRIERE / FRAGE {index+1} VON {deck.length}</span><h2>WEM GEHÖRT DIESE KARRIERE?</h2></div><div className="score-box"><div><small>PUNKTE</small><strong>{score}</strong></div><div><small>FRAGE</small><strong>{index+1}/10</strong></div></div></div>
   <div className="round-track"><div className="round-fill" style={{width:((index+1)/deck.length*100)+"%"}}/></div>
   <div className="career-timeline">{q.clubs.map((club,i)=><React.Fragment key={club+"-"+i}>{i>0&&<ArrowRight className="path-arrow" size={17}/>}<div className="club-stop"><span>{String(i+1).padStart(2,"0")}</span><Shield size={19}/><b>{club}</b></div></React.Fragment>)}</div>
   {mode==="choice"?<><span className="control-label">WELCHER SPIELER WAR DAS?</span><div className="choice-grid">{options.map((name,i)=><button key={name} disabled={!!answer} className={"choice-button "+(answer?(name===q.answer?"correct-option":name===answer.name?"wrong-option":"dim-option"):"")} onClick={()=>guess(name)}><span>{String.fromCharCode(65+i)}</span>{name}{answer&&name===q.answer?<Check size={18}/>:answer&&name===answer.name?<X size={18}/>:<ArrowRight size={17}/>}</button>)}</div></>:<GuessInput key={"career-"+index} id="career-entry" disabled={!!answer} onGuess={guess} label="WELCHEN NAMEN VERMUTEST DU?" placeholder="Namen eingeben (z. B. Kroos) …"/>}
   {answer&&<Feedback answer={answer} right={q.answer} extra={q.fact}/>}
  </>}
 </section></>;
}
const gridNames=Array.from(new Set([...knownPlayerNames,...gridBoards.flatMap(board=>board.cells.flatMap((_,i)=>acceptedGridNames(board,i)))] )).sort((a,b)=>a.localeCompare(b,"de"));
export function FootballGridImproved(){
 const[mode,setMode]=useState<EntryMode>("choice");
 const[boardId,setBoardId]=useState(gridBoards[0].id);
 const[answers,setAnswers]=useState<Record<number,Answer>>({});
 const[active,setActive]=useState<number|null>(0);
 const[error,setError]=useState("");
 const board=gridBoards.find(b=>b.id===boardId)??gridBoards[0];
 const answered=Object.keys(answers).length;
 const score=Object.values(answers).filter(a=>a.correct).length;
 const done=answered===board.cells.length;
 const q=active===null?null:board.cells[active];
 const options=useMemo(()=>q?shuffle(q.choices):[],[q]);
 function restart(id=boardId,nextMode=mode){
  setBoardId(id);setMode(nextMode);setAnswers({});setActive(0);setError("");
 }
 function submit(name:string){
  if(active===null||answers[active]||done)return;
  if(Object.values(answers).some(item=>normalizeName(item.name)===normalizeName(name))){setError("Dieser Spieler steht bereits in deinem Grid. Verwende einen anderen Namen.");return}
  setError("");
  setAnswers(prev=>({...prev,[active]:{name,correct:isGridAnswerCorrect(board,active,name)}}));
 }
 useEffect(()=>{
  if(active===null||!answers[active]||done)return;
  const timeout=window.setTimeout(()=>{
   const next=board.cells.findIndex((_,i)=>answers[i]===undefined);
   if(next>=0)setActive(next);
  },1400);
  return()=>window.clearTimeout(timeout);
 },[answers,active,done,board]);
 const entry=active===null?null:answers[active];
 const nextBoard=()=>{const next=(gridBoards.findIndex(b=>b.id===boardId)+1)%gridBoards.length;restart(gridBoards[next].id)};
 return <><Intro id="03" type="WISSEN" title="FOOTBALL GRID" description="Kombiniere Nationalität und Vereinskarriere. Im Expertenmodus kannst du Spieler frei eintippen – pro Feld sind mehrere richtige Lösungen möglich."/>
 <section className="config-panel">
  <ModeBar label="SPIELMODUS" value={mode} options={[{value:"choice",text:"KLASSISCH",hint:"Vier Namen auswählen"},{value:"type",text:"EXPERTE",hint:"Spieler selbst eingeben"}]} onChange={m=>restart(boardId,m)}/>
  <div className="grid-board-picker"><span className="control-label">SPIELFELD</span><div className="board-options">{gridBoards.map((b,i)=><button key={b.id} className={board.id===b.id?"active":""} aria-pressed={board.id===b.id} onClick={()=>restart(b.id)}>GRID {String(i+1).padStart(2,"0")}</button>)}</div><span className="board-name">{board.label}</span></div>
 </section><section className="play-shell">
  <div className="play-top"><div><span className="eyebrow">3 × 3 / VEREINSWISSEN</span><h2>FÜLLE DIE MATRIX</h2></div><div className="score-box"><div><small>RICHTIG</small><strong>{score}/9</strong></div><div><small>BEANTWORTET</small><strong>{answered}/9</strong></div></div></div>
  <div className="football-grid"><div className="grid-corner"><Grid3X3 size={22}/></div>{board.columns.map(col=><div key={col} className="grid-col-head">{col}</div>)}{board.rows.map((row,i)=><React.Fragment key={row}><div className="grid-row-head">{row}</div>{board.columns.map((country,j)=>{const index=i*3+j;const record=answers[index];return <button key={country} aria-label={row+" und "+country} aria-pressed={active===index} className={"grid-tile "+(active===index?"grid-active ":"")+(record?(record.correct?"grid-done":"grid-fail"):"")} onClick={()=>{setActive(index);setError("")}}>{record?<><span>{record.correct?<Check size={20}/>:<X size={20}/>}</span><small>{record.name}</small></>:<span>+</span>}</button>})}</React.Fragment>)}</div>
  {done?<div className="end-note"><strong>{score} / 9 FELDER RICHTIG</strong><p>Eine andere Matrix ist bereit.</p><button className="btn-solid" onClick={nextBoard}><RotateCcw size={18}/> NÄCHSTES GRID</button></div>:<div className="grid-question-panel">
   {active===null?<p>Wähle ein Feld in der Matrix.</p>:<><span className="eyebrow">{board.rows[Math.floor(active/3)]} + {board.columns[active%3]}</span>
   {entry?<div className="grid-solution"><strong>{entry.correct?"TOOOR!":"LEIDER NICHT."}</strong><p>{entry.correct?entry.name+" ist eine gültige Lösung.":"Eine mögliche richtige Antwort wäre "+q?.answer+"."} {entry.correct?"Nächstes Feld folgt automatisch.":"Weiter zum nächsten freien Feld …"}</p></div>:<>
    {mode==="choice"?<><h3>WER PASST HIER HINEIN?</h3><div className="choice-grid">{options.map((name,i)=><button key={name} onClick={()=>submit(name)} className="choice-button"><span>{String.fromCharCode(65+i)}</span>{name}<ArrowRight size={16}/></button>)}</div></>:<GuessInput key={"grid-"+board.id+"-"+active} id="grid-guess" label="NENNE EINEN SPIELER AUS DIESEM LAND, DER FÜR DIESEN KLUB SPIELTE" names={gridNames} onGuess={submit} placeholder="Spieler frei eingeben …"/>}
    {error&&<p role="alert" className="typed-guess-error">{error}</p>}
   </>}</>}
  </div>}
  <p className="source-note">In der freien Eingabe prüfen wir mehrere bekannte Karriere-Stationen pro Feld. Nicht jeder Fußballspieler weltweit ist schon im redaktionellen Antwortkatalog enthalten. Ein Name darf im selben Grid nur einmal verwendet werden.</p>
 </section></>;
}
export function WhoAmIImproved(){
 const[mode,setMode]=useState<MysteryMode>("normal");
 const[deck,setDeck]=useState(()=>shuffle(mysteries).slice(0,8));
 const[index,setIndex]=useState(0);
 const[hint,setHint]=useState(0);
 const[answer,setAnswer]=useState<Answer|null>(null);
 const[score,setScore]=useState(0);
 const done=index>=deck.length;
 const q=deck[index];
 const choices=useMemo(()=>q?shuffle(q.choices):[],[q]);
 const points=mode==="pro"?2*(4-hint):4-hint;
 const maximum=mode==="easy"?24:mode==="pro"?64:32;
 function reset(nextMode:MysteryMode=mode){setMode(nextMode);setDeck(shuffle(mysteries).slice(0,8));setIndex(0);setHint(nextMode==="easy"?1:0);setAnswer(null);setScore(0)}
 function guess(name:string){if(answer||!q)return;const correct=normalizeName(name)===normalizeName(q.answer);setAnswer({name,correct});if(correct)setScore(v=>v+points)}
 useEffect(()=>{if(!answer)return;const t=window.setTimeout(()=>{setIndex(i=>i+1);setHint(mode==="easy"?1:0);setAnswer(null)},2200);return()=>clearTimeout(t)},[answer,mode]);
 return <><Intro id="04" type="RÄTSEL" title="WER BIN ICH?" description="Schrittweise Hinweise lesen und den Fußballer erraten. Du bestimmst, ob du mit Antwortvorschlägen oder freier Namenseingabe spielst."/>
 <section className="config-panel"><ModeBar label="SCHWIERIGKEIT" value={mode} options={[{value:"easy",text:"ENTSPANNT",hint:"Zwei Hinweise + 4 Antworten"},{value:"normal",text:"KLASSISCH",hint:"Ein Hinweis + 4 Antworten"},{value:"pro",text:"PROFI",hint:"Freie Eingabe · doppelte Punkte"}]} onChange={reset}/></section>
 <section className="play-shell">
  {done?<Final score={score} max={maximum} title="SPIELER ENTLARVT" onRestart={()=>reset()}/>:<>
   <div className="play-top"><div><span className="eyebrow">MYSTERY PLAYER / {index+1} VON {deck.length}</span><h2>WER IST GESUCHT?</h2></div><div className="score-box"><div><small>PUNKTE</small><strong>{score}</strong></div><div><small>FRAGE</small><strong>{index+1}/8</strong></div></div></div>
   <div className="round-track"><div className="round-fill" style={{width:((index+1)/deck.length*100)+"%"}}/></div>
   <div className="mystery-board compact-mystery"><div className="mystery-icon"><Eye size={39}/><span>?</span></div><div className="mystery-clues">{q.clues.slice(0,hint+1).map((text,i)=><div className="clue" key={i}><span>HINWEIS {i+1} / 4</span><p>{text}</p></div>)}</div></div>
   <div className="hint-bar"><span>BEI RICHTIGER ANTWORT: <strong>+{points} PKT</strong></span>{hint<3&&!answer?<button onClick={()=>setHint(h=>h+1)}><Eye size={16}/> NOCH EIN HINWEIS <span>(−{mode==="pro"?2:1} PKT)</span></button>:<span>{hint===3?"ALLE HINWEISE SICHTBAR":""}</span>}</div>
   {mode==="pro"?<GuessInput key={"mystery-"+index} id="mystery-guess" disabled={!!answer} label="DEIN VERMUTETER SPIELER" onGuess={guess} placeholder="Name eintippen …"/>:<><span className="control-label">WER IST ES?</span><div className="choice-grid">{choices.map((name,i)=><button disabled={!!answer} key={name} onClick={()=>guess(name)} className={"choice-button "+(answer?(name===q.answer?"correct-option":name===answer.name?"wrong-option":"dim-option"):"")}><span>{String.fromCharCode(65+i)}</span>{name}{answer&&name===q.answer?<Check size={18}/>:answer&&name===answer.name?<X size={18}/>:<ArrowRight size={17}/>}</button>)}</div></>}
   {!answer&&<button className="skip-button" onClick={()=>setAnswer({name:"",correct:false})}>WEISS ICH NICHT – AUFLÖSEN <ArrowRight size={15}/></button>}
   {answer&&<Feedback answer={answer} right={q.answer} extra={answer.correct?"+"+points+" Punkte!":"Die richtige Antwort wurde eingeblendet."}/>}
  </>}
 </section></>;
}
