import React,{useState} from 'react';
import{createRoot}from'react-dom/client';
import{ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Check,Flame,Grid3X3,Play,RotateCcw,Route,Shield, Trophy,UserRound,X}from'lucide-react';
import{datasets,type Category,type Dataset,type Entry}from'./data';
import{careers,gridCells,gridClubs,gridCountries}from'./gameData';
import './style.css';

type Mode='ten'|'endless';
type Pair={a:Entry;b:Entry};
const shuffle=<T,>(list:T[]):T[]=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function nextPair(d:Dataset,previous?:Pair):Pair{
 const a=previous?.b??d.entries[Math.floor(Math.random()*d.entries.length)];
 const valid=d.entries.filter(b=>b.name!==a.name&&b.value!==a.value);
 const fresh=previous?valid.filter(b=>b.name!==previous.a.name):valid;
 const pool=fresh.length?fresh:valid;
 if(!pool.length)throw new Error('Zu wenige unterschiedliche Werte');
 return{a,b:pool[Math.floor(Math.random()*pool.length)]};
}
function initials(name:string){return name.split(/\s+/).slice(0,2).map(s=>s[0]??'').join('').toUpperCase();}
function IdentityArt({name,club=false,image}: {name:string;club?:boolean;image?:string}){
 const[failed,setFailed]=useState(false);
 return <div className={'identity '+(club?'identity-club':'identity-player')}>{image&&!failed?<img src={image} alt={club?'Wappen von '+name:'Porträt von '+name} loading="lazy" onError={()=>setFailed(true)}/>:<span className="identity-fallback">{club?<Shield size={32} strokeWidth={1.4}/>:<UserRound size={32} strokeWidth={1.4}/>}<small>{initials(name)}</small></span>}</div>;
}
function Nav(){return <header className="topbar"><a href="/" className="brand"><span className="brand-mark"><Trophy size={19}/></span>FOOTY<span>LAB</span></a><nav><a href="/#spiele">Spiele</a><a href="/#ueber">Über FootyLab</a></nav><span className="top-pill">BETA · KOSTENLOS</span></header>}
function Footer(){return <footer className="site-footer"><span>© FootyLab · Ein Fußballquiz-Projekt</span><span>Spielerdaten als Momentaufnahme · Bilder folgen nach Lizenzprüfung</span></footer>}
const games=[{href:'/games/higher-lower',num:'01',name:'Higher or Lower',subtitle:'Höher oder niedriger?',info:'Marktwerte, Titel und Statistiken direkt vergleichen. In der Endlos-Streak oder in zehn Runden.',tag:'5 Kategorien',className:'card-hl',icon:<ArrowUp size={26}/>},{href:'/games/career-path',num:'02',name:'Career Path',subtitle:'Errate die Karriere',info:'Erkennst du den Spieler nur anhand seiner bisherigen Vereine? Zehn Legenden und Stars warten.',tag:'8 Fragen',className:'card-career',icon:<Route size={28}/>},{href:'/games/football-grid',num:'03',name:'Football Grid',subtitle:'Die 3×3-Fußballmatrix',info:'Kombiniere Vereinsgeschichte und Nationalität. Fülle alle neun Felder mit passenden Spielern.',tag:'9 Felder',className:'card-grid',icon:<Grid3X3 size={27}/>}];
function Home(){return <><section className="home-hero"><div className="eyebrow"><span className="live-dot"/> DEIN FUSSBALL. DEIN SPIELPLATZ.</div><h1>Fußballwissen,<br/><em>das Spaß macht.</em></h1><p>Kurze Quizspiele, spannende Duelle und jede Menge Fußball. Such dir ein Spiel aus und leg direkt los.</p><a className="primary-cta" href="#spiele">Spiele entdecken <ArrowRight size={20}/></a><div className="hero-stats"><span><strong>03</strong> SPIELBARE MODI</span><span><strong>00 €</strong> KOSTENLOS</span><span><strong>∞</strong> VERSUCHE</span></div></section><section id="spiele" className="games-section"><div className="section-label">DIE SPIELAUSWAHL</div><div className="heading-line"><h2>Was spielst du heute?</h2><p>Ein Klick und du bist mitten im Spiel.</p></div><div className="game-cards">{games.map(g=><a className={'game-card '+g.className} href={g.href} key={g.href}><div className="card-top"><span>SPIEL {g.num}</span><span className="game-tag">{g.tag}</span></div><div className="card-graphic">{g.icon}</div><h3>{g.name}</h3><strong className="card-subtitle">{g.subtitle}</strong><p>{g.info}</p><div className="card-cta">Jetzt spielen <ArrowRight size={18}/></div></a>)}</div></section><section id="ueber" className="about-strip"><span className="about-icon">⚽</span><div><strong>Gemacht für Fußballfans.</strong><p>FootyLab wächst weiter – mit neuen Spielern, Statistiken, Spielmodi und Herausforderungen. Ohne Anmeldung, direkt im Browser.</p></div></section></>}
function GameHeading({number,title,description}:{number:string;title:string;description:string}){return <div className="game-heading"><a href="/#spiele" className="back-link"><ArrowLeft size={17}/> Alle Spiele</a><div className="eyebrow">SPIEL {number} / FOOTYLAB</div><h1>{title}</h1><p>{description}</p></div>}
function ResultButton({onClick,children}:{onClick:()=>void;children:React.ReactNode}){return <button className="primary-btn" onClick={onClick}><RotateCcw size={18}/>{children}</button>}
function HigherLower(){
 const[category,setCategory]=useState<Category>('market');
 const[datasetId,setDatasetId]=useState(datasets[0].id);
 const[mode,setMode]=useState<Mode>('ten');
 const[round,setRound]=useState(1);
 const[score,setScore]=useState(0);
 const[answer,setAnswer]=useState<'higher'|'lower'|null>(null);
 const[ended,setEnded]=useState(false);
 const[history,setHistory]=useState<boolean[]>([]);
 const dataset=datasets.find(d=>d.id===datasetId)??datasets[0];
 const[pair,setPair]=useState<Pair>(()=>nextPair(datasets[0]));
 const recordKey='footylab-best-'+datasetId+'-'+mode;
 const[best,setBest]=useState(()=>{try{return Number(localStorage.getItem('footylab-best-market-ten')||0)}catch{return 0}});
 const rightAnswer=pair.b.value>pair.a.value?'higher':'lower';
 function reset(d:Dataset=dataset,m:Mode=mode){
  setPair(nextPair(d));setRound(1);setScore(0);setAnswer(null);setEnded(false);setHistory([]);
  try{setBest(Number(localStorage.getItem('footylab-best-'+d.id+'-'+m)||0))}catch{setBest(0)}
 }
 function changeCategory(c:Category){const d=datasets.find(v=>v.category===c)!;setCategory(c);setDatasetId(d.id);reset(d)}
 function guess(value:'higher'|'lower'){
  if(answer||ended)return;
  const correct=value===rightAnswer;
  setAnswer(value);setHistory(v=>[...v,correct]);
  const nextScore=score+(correct?1:0);setScore(nextScore);
  if(nextScore>best){setBest(nextScore);try{localStorage.setItem(recordKey,String(nextScore))}catch{/* optional */}}
  if((mode==='endless'&&!correct)||(mode==='ten'&&round===10))setEnded(true);
 }
 function advance(){if(ended)return;setPair(p=>nextPair(dataset,p));setRound(v=>v+1);setAnswer(null)}
 const isClub=category==='trophies';
 return <><GameHeading number="01" title="Higher or Lower" description="Schätze den nächsten Spieler oder Verein. Nach jeder Antwort rückt die rechte Karte nach links – wie beim Original."/><section className="settings-panel"><div className="category-tabs">{([['market','Marktwert'],['trophies','Trophäen'],['stats','Statistiken']] as const).map(([id,name])=><button key={id} className={category===id?'selected':''} onClick={()=>changeCategory(id)}>{name}</button>)}</div><div className="settings-grid"><label>Vergleich<select value={datasetId} onChange={e=>{const d=datasets.find(v=>v.id===e.target.value)!;setDatasetId(d.id);reset(d)}}>{datasets.filter(v=>v.category===category).map(v=><option key={v.id} value={v.id}>{v.title}</option>)}</select></label><label>Spielmodus<select value={mode} onChange={e=>{const v=e.target.value as Mode;setMode(v);reset(dataset,v)}}><option value="ten">10-Fragen-Runde</option><option value="endless">Endlosmodus</option></select></label></div></section><section className="play-panel"><div className="panel-top"><div><span className="eyebrow">{dataset.title.toUpperCase()}</span><h2>Wer hat mehr?</h2></div><div className="score-display"><b>{score} Punkte</b><span><Flame size={15}/> Bestwert: {best}</span></div></div><div className="progress-line"><span>{mode==='ten'?'Frage '+round+' / 10':'Runde '+round}</span><div className="history">{history.slice(-10).map((h,i)=><span key={i} className={h?'good-dot':'bad-dot'}/>)}</div></div><div className="comparison"><div className="compare-card"><IdentityArt key={pair.a.name} name={pair.a.name} image={pair.a.image} club={isClub}/><h3>{pair.a.name}</h3><strong>{pair.a.value}</strong><small>{dataset.unit}</small></div><div className="vs-label">VS</div><div className="compare-card"><IdentityArt key={pair.b.name} name={pair.b.name} image={pair.b.image} club={isClub}/><h3>{pair.b.name}</h3><strong>{answer?pair.b.value:'?'}</strong><small>{dataset.unit}</small></div></div>{!answer?<div className="decision-buttons"><button onClick={()=>guess('higher')}><ArrowUp size={20}/> Höher</button><button onClick={()=>guess('lower')}><ArrowDown size={20}/> Niedriger</button></div>:<div className={'feedback-card '+(answer===rightAnswer?'correct':'incorrect')}><div className="feedback-head">{answer===rightAnswer?<Check size={21}/>:<X size={21}/>} {answer===rightAnswer?'Richtig geraten!':'Leider falsch!'}</div><p>{pair.b.name}: <strong>{pair.b.value} {dataset.unit}</strong></p>{ended?<><h3>{mode==='ten'?'Runde abgeschlossen!':'Deine Streak ist vorbei!'}</h3><p>{score} {mode==='ten'?'von 10 Punkten':'richtige Antworten in Folge'}</p><ResultButton onClick={()=>reset()}>Erneut spielen</ResultButton></>:<button className="primary-btn" onClick={advance}>Weiter mit {pair.b.name}<ArrowRight size={17}/></button>}</div>}<div className="source-note">Datenstand: {dataset.stand} · <a href={dataset.source} target="_blank" rel="noopener noreferrer">Quelle ansehen ↗</a><br/>Bilder und Logos werden später ergänzt, sobald passende Nutzungsrechte geklärt sind.</div></section></>
}
function CareerPath(){
 const[deck,setDeck]=useState(()=>shuffle(careers).slice(0,8));
 const[index,setIndex]=useState(0);
 const[selected,setSelected]=useState<string|null>(null);
 const[score,setScore]=useState(0);
 const question=deck[index];
 const finished=index===deck.length-1&&selected!==null;
 function restart(){setDeck(shuffle(careers).slice(0,8));setIndex(0);setSelected(null);setScore(0)}
 function pick(name:string){if(selected!==null)return;setSelected(name);if(name===question.answer)setScore(s=>s+1)}
 return <><GameHeading number="02" title="Career Path" description="Du siehst die Vereinsstationen eines Fußballprofis. Kannst du herausfinden, welcher Spieler dahintersteckt?"/><section className="play-panel"><div className="panel-top"><div><div className="eyebrow">ERRATE DEN SPIELER</div><h2>Wem gehört diese Karriere?</h2></div><div className="score-display"><b>{score} Punkte</b><span>Frage {index+1} / {deck.length}</span></div></div><div className="career-route">{question.clubs.map((club,i)=><React.Fragment key={club+'-'+i}>{i>0&&<ArrowRight size={15} className="club-arrow"/>}<span className="club-chip"><Shield size={16}/>{club}</span></React.Fragment>)}</div><div className="choice-grid">{question.choices.map(name=><button key={name} disabled={selected!==null} className={selected===null?'choice':name===question.answer?'choice success':selected===name?'choice mistake':'choice dimmed'} onClick={()=>pick(name)}>{name}{selected!==null&&name===question.answer?<Check size={18}/>:selected===name?<X size={18}/>:null}</button>)}</div>{selected!==null&&<div className={'feedback-card '+(selected===question.answer?'correct':'incorrect')}><div className="feedback-head">{selected===question.answer?'✅ Treffer!':'❌ Das war leider nicht richtig.'}</div><p>Gesucht war <strong>{question.answer}</strong>. {question.fact}</p>{finished?<><h3>Geschafft! {score} von {deck.length} richtig.</h3><ResultButton onClick={restart}>Neue Runde</ResultButton></>:<button className="primary-btn" onClick={()=>{setIndex(n=>n+1);setSelected(null)}}>Nächste Karriere <ArrowRight size={17}/></button>}</div>}</section></>
}
function FootballGrid(){
 const[answers,setAnswers]=useState<Record<number,string>>({});
 const[active,setActive]=useState<number|null>(null);
 const count=Object.keys(answers).length;
 const score=Object.entries(answers).filter(([id,value])=>gridCells[Number(id)].answer===value).length;
 const finished=count===9;
 const current=active===null?null:gridCells[active];
 return <><GameHeading number="03" title="Football Grid" description="3 Vereine × 3 Nationalitäten. Finde für jedes Feld einen Spieler, der beides verbindet."/><section className="play-panel"><div className="panel-top"><div><div className="eyebrow">3 × 3 FUSSBALLMATRIX</div><h2>Fülle das Grid</h2></div><div className="score-display"><b>{score} / 9 richtig</b><span>{count} / 9 Felder beantwortet</span></div></div><div className="grid-hint">Tippe auf ein Feld und wähle den passenden Spieler. Pro Feld hast du einen Versuch.</div><div className="football-grid"><div className="grid-corner"><Grid3X3 size={21}/></div>{gridCountries.map(c=><div key={c} className="grid-heading">{c}</div>)}{gridClubs.map((club,row)=><React.Fragment key={club}><div className="grid-row-label">{club}</div>{gridCountries.map((country,col)=>{const id=row*3+col;const choice=answers[id];const done=choice!==undefined;return <button key={country} className={'grid-square '+(active===id?'focused ':'')+(done?(choice===gridCells[id].answer?'solved':'missed'):'')} onClick={()=>setActive(id)} aria-label={club+', '+country+(done?', beantwortet':'')}><span>{done?(choice===gridCells[id].answer?<Check size={20}/>:<X size={20}/>):<span className="question-mark">?</span>}</span>{done&&<small>{choice}</small>}</button>})}</React.Fragment>)}</div>{active===null?<div className="grid-prompt">Wähle ein Feld aus, um deine erste Antwort abzugeben.</div>:<div className="grid-answer-panel"><span className="eyebrow">{gridClubs[Math.floor(active/3)]} + {gridCountries[active%3]}</span><h3>Welcher Spieler passt?</h3>{answers[active]===undefined?<div className="choice-grid">{shuffle(current!.choices).map(name=><button key={name} className="choice" onClick={()=>setAnswers(old=>({...old,[active]:name}))}>{name}</button>)}</div>:<div className="grid-answered"><p>{answers[active]===current!.answer?'✅ Richtig!':'❌ Leider falsch.'} Die richtige Antwort ist <strong>{current!.answer}</strong>.</p><span>Wähle ein weiteres Feld im Grid.</span></div>}</div>}{finished&&<div className="feedback-card correct"><div className="feedback-head">🏁 Grid abgeschlossen!</div><p>Du hast <strong>{score} von 9</strong> Feldern richtig gelöst.</p><ResultButton onClick={()=>{setAnswers({});setActive(null)}}>Neues Grid spielen</ResultButton></div>}<p className="source-note">Spieler/Vereine basieren auf bekannten Karriere-Stationen. Bei diesem ersten Grid gibt es fest vorgegebene Antwortmöglichkeiten.</p></section></>
}
function App(){const path=window.location.pathname.replace(/\/+$/,'')||'/';return <div className="app-shell"><Nav/><main>{path==='/'?<Home/>:path==='/games/higher-lower'?<HigherLower/>:path==='/games/career-path'?<CareerPath/>:path==='/games/football-grid'?<FootballGrid/>:<section className="not-found"><h1>Hier rollt noch kein Ball.</h1><p>Die Seite wurde nicht gefunden.</p><a className="primary-cta" href="/">Zur Startseite <ArrowRight size={18}/></a></section>}</main><Footer/></div>}
createRoot(document.getElementById('root')!).render(<App/>);
