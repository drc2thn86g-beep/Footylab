import React,{useEffect,useMemo,useState}from"react";
import{ArrowRight,Check,ChevronLeft,Globe2,RotateCcw,Shield,X}from"lucide-react";
import{leaguesFor,worldClubs,type Region,type WorldClub}from"./worldClubs";

type Hardness=4|6;
const shuffle=<T,>(items:readonly T[]):T[]=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function deckFor(region:Region):WorldClub[]{
 const leagues=shuffle(leaguesFor(region)).slice(0,12);
 return shuffle(leagues.map(league=>shuffle(worldClubs.filter(club=>club.league===league))[0]));
}
export function ClubCompassImproved(){
 const[region,setRegion]=useState<Region>("Europa");
 const[hardness,setHardness]=useState<Hardness>(4);
 const[deck,setDeck]=useState(()=>deckFor("Europa"));
 const[index,setIndex]=useState(0);
 const[choice,setChoice]=useState<string|null>(null);
 const[score,setScore]=useState(0);
 const done=index>=deck.length;
 const current=deck[index];
 const options=useMemo(()=>{
  if(!current)return[];
  const others=shuffle(leaguesFor(region).filter(l=>l!==current.league)).slice(0,hardness-1);
  return shuffle([current.league,...others]);
 },[current,region,hardness]);
 function restart(nextRegion=region,nextHardness=hardness){setRegion(nextRegion);setHardness(nextHardness);setDeck(deckFor(nextRegion));setIndex(0);setChoice(null);setScore(0)}
 function submit(answer:string){
  if(choice!==null||!current)return;
  setChoice(answer);
  if(answer===current.league)setScore(s=>s+1);
 }
 useEffect(()=>{
  if(choice===null)return;
  const timeout=window.setTimeout(()=>{setChoice(null);setIndex(i=>i+1)},1750);
  return()=>window.clearTimeout(timeout);
 },[choice]);
 return <><div className="game-intro"><a href="/#spiele" className="return-link"><ChevronLeft size={17}/> ZUR SPIELAUSWAHL</a><div className="game-kicker"><span>SPIEL 06 / 06</span><span>INTERNATIONALE KLUBS</span></div><h1>KLUBKOMPASS</h1><p>Vergiss die offensichtlichen Top-5-Ligen: Vereine aus Portugal, Skandinavien, Osteuropa und sogar Südamerika oder Asien. Kennst du ihre Heimatligen?</p></div>
  <section className="config-panel">
   <div className="mode-settings"><span className="control-label">SPIELREGION</span><div className="mode-options"><button className={region==="Europa"?"is-active":""} aria-pressed={region==="Europa"} onClick={()=>restart("Europa")}><strong>EUROPA</strong><small>15 kleinere Ligen</small></button><button className={region==="Weltweit"?"is-active":""} aria-pressed={region==="Weltweit"} onClick={()=>restart("Weltweit")}><strong>WELTWEIT</strong><small>21 internationale Ligen</small></button></div></div>
   <div className="mode-settings"><span className="control-label">SCHWIERIGKEIT</span><div className="mode-options"><button className={hardness===4?"is-active":""} aria-pressed={hardness===4} onClick={()=>restart(region,4)}><strong>NORMAL</strong><small>4 mögliche Ligen</small></button><button className={hardness===6?"is-active":""} aria-pressed={hardness===6} onClick={()=>restart(region,6)}><strong>EXPERTE</strong><small>6 mögliche Ligen</small></button></div></div>
  </section>
  <section className="play-shell club-quiz">{done?<div className="end-screen"><span className="eyebrow">ABPFIFF / KLUBKOMPASS</span><strong className="end-score">{score}/12</strong><h2>DEINE WELTREISE IST VORBEI.</h2><p>Du hast {score} von 12 Vereinen richtig einer Liga zugeordnet.</p><div className="end-actions"><button className="btn-solid" onClick={()=>restart()}><RotateCcw size={18}/> ERNEUT SPIELEN</button><a className="btn-outline" href="/#spiele">SPIEL WECHSELN <ArrowRight size={18}/></a></div></div>:<>
   <div className="play-top"><div><span className="eyebrow">{region==="Europa"?"EUROPA EDITION":"WORLD EDITION"} / FRAGE {index+1} VON {deck.length}</span><h2>WO SPIELT DIESER KLUB?</h2></div><div className="score-box"><div><small>RICHTIG</small><strong>{score}</strong></div><div><small>RUNDE</small><strong>{index+1}/12</strong></div></div></div>
   <div className="round-track"><div className="round-fill" style={{width:(index+1)/deck.length*100+"%"}}/></div>
   <div className="club-question"><div className="club-logo-placeholder"><Shield size={53}/></div><strong>{current.name}</strong><span>IN WELCHER HEIMATLIGA IST DIESER VEREIN BEKANNT?</span></div>
   <div className="club-choices">{options.map((league,i)=><button key={league} disabled={choice!==null} className={choice===null?"":league===current.league?"picked-correct":league===choice?"picked-wrong":""} onClick={()=>submit(league)}><span>{String(i+1).padStart(2,"0")}</span>{league}{choice!==null&&league===current.league?<Check size={20}/>:choice===league?<X size={20}/>:<ArrowRight size={18}/>}</button>)}</div>
   {choice!==null&&<div role="status" className={"short-feedback "+(choice===current.league?"success":"failure")}><strong>{choice===current.league?"RICHTIG!":"KNAPP DANEBEN!"} {current.league.toUpperCase()}</strong><span>Land: {current.country}. Nächster Verein erscheint automatisch …</span></div>}
  </>}
  <p className="source-note">Die {worldClubs.length} Vereine sind historisch bekannten Heimatligen zugeordnet. Wir zeigen keine Live-Tabellen, keine Kader und keine garantiert aktuellen Ligamitgliedschaften der Saison 2026/27.</p>
  </section></>;
}
