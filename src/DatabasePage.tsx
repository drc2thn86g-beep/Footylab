import React,{useMemo,useState}from"react";
import{ArrowRight,Check,ChevronDown,ChevronLeft,Database,ExternalLink,Image as ImageIcon,Search,Shield,UserRound}from"lucide-react";
import{players,clubs,databaseStats,getPlayerPhoto,getClubCrest,getCareer,getHistoricalPlayers,getCurrentClub,getReferenceClub,type PlayerRecord,type ClubRecord,type MediaAsset}from"./db/queries";
import{normalizeName}from"./normalize";

const BATCH=30;
const leagues=Array.from(new Set(clubs.map(c=>c.historicalLeague).filter((v):v is string=>!!v))).sort((a,b)=>a.localeCompare(b,"de"));
function fallbackLetters(name:string){return name.split(/\s+/).slice(0,2).map(p=>p[0]).join("").toUpperCase()}
function Avatar({name,media,club=false}:{name:string;media?:MediaAsset;club?:boolean}){
 const[failed,setFailed]=useState(false);
 return <span className={"db-avatar "+(club?"db-avatar-club":"")}>
 {media&&!failed?<img src={media.url} alt={club?"Wappen: "+name:"Porträt: "+name} loading="lazy" onError={()=>setFailed(true)}/>:<span className="db-avatar-fallback">{club?<Shield size={27}/>:<UserRound size={27}/>}<small>{fallbackLetters(name)}</small></span>}
 </span>;
}
function PlayerDetails({player}:{player:PlayerRecord}){
 const known=getCareer(player),photo=getPlayerPhoto(player),current=getCurrentClub(player);
 const ordered=known.filter(item=>item.record.order!==null),unranked=known.filter(item=>item.record.order===null);
 return <div className="db-details">
  <div className="db-details-header"><Avatar name={player.name} media={photo}/><div><span className="db-tag">SPIELERPROFIL / REDAKTIONELL</span><h3>{player.name}</h3><p>{player.country} · {player.position} · Jahrgang {player.birthYear}</p></div></div>
  <div className="db-current"><strong>AKTUELLER VEREIN</strong><span>{current?current.name:"Nicht verifiziert – kein bestätigter Live-Kader"}</span></div>
  <div className="db-history-title">KARRIERESTATIONEN <span>{known.length} EINTRÄGE</span></div>
  {ordered.length>0&&<div className="db-history-list">{ordered.map(({record,club})=><div key={record.id} className="db-history-item"><span>{String(record.order).padStart(2,"0")}</span><strong>{club.name}</strong>{record.isLoan&&<small>LEIHE</small>}</div>)}</div>}
  {unranked.length>0&&<><div className="db-subhead">WEITERE BEKANNTE VEREINSZUGEHÖRIGKEITEN (OHNE CHRONOLOGIE)</div><div className="db-club-chips">{unranked.map(({record,club})=><span key={record.id}>{club.name}</span>)}</div></>}
  {known.length===0&&<p>Für diesen Spieler liegt noch kein vollständiger Karriereverlauf vor.</p>}
  {photo&&<div className="db-photo-source"><ImageIcon size={15}/> Foto: {photo.author} · <a href={photo.sourcePage} target="_blank" rel="noreferrer">Quelle <ExternalLink size={13}/></a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · {photo.changed?"Vorheriger Bildzuschnitt übernommen; Darstellung zugeschnitten":"Darstellung für Karten zugeschnitten"}</div>}
  <p className="db-caution">Der aufgeführte Verein ist nicht als aktueller Klub bestätigt. Uns fehlen noch verifizierte aktuelle Kader- und Transferdaten. Frühere Vereine sind redaktionelle Karrieredaten.</p>
 </div>;
}
function ClubDetails({club}:{club:ClubRecord}){
 const historical=getHistoricalPlayers(club),crest=getClubCrest(club);
 return <div className="db-details"><div className="db-details-header"><Avatar name={club.name} media={crest} club/><div><span className="db-tag">VEREINSPROFIL / HISTORISCH</span><h3>{club.name}</h3><p>{club.country??"Land noch unbekannt"} · {club.historicalLeague??"Liga noch nicht zugeordnet"}</p></div></div>
  <div className="db-current"><strong>AKTUELLE LIGA / KADER</strong><span>Nicht verifiziert – bisher keine Live-Daten angebunden</span></div>
  <div className="db-history-title">BEKANNTE SPIELER <span>{historical.length} HISTORISCHE ZUORDNUNGEN</span></div>
  {historical.length?<div className="db-club-players">{historical.slice(0,24).map(player=><div key={player.id}><Avatar name={player.name} media={getPlayerPhoto(player)}/><span>{player.name}</span></div>)}{historical.length>24&&<span className="db-more-players">+ {historical.length-24} weitere</span>}</div>:<p>Zu diesem Verein sind bislang keine Spieler-Karrierezuordnungen in der Datenbank vorhanden.</p>}
  <p className="db-caution">Historische Vereinszugehörigkeiten, ausdrücklich kein aktueller Kader oder eine bestätigte Ligatabelle.</p>
 </div>;
}
export default function DatabasePage(){
 const[tab,setTab]=useState<"players"|"clubs">("players");
 const[query,setQuery]=useState("");
 const[league,setLeague]=useState("all");
 const[position,setPosition]=useState("all");
 const[limit,setLimit]=useState(BATCH);
 const[selected,setSelected]=useState<string|null>(null);
 const filteredPlayers=useMemo(()=>players.filter(player=>{
  if(position!=="all"&&player.position!==position)return false;
  const ref=getReferenceClub(player);
  if(league!=="all"&&ref?.historicalLeague!==league)return false;
  return normalizeName([player.name,player.country,ref?.name??""].join(" ")).includes(normalizeName(query));
 }),[position,league,query]);
 const filteredClubs=useMemo(()=>clubs.filter(club=>(league==="all"||club.historicalLeague===league)&&normalizeName([club.name,club.country??"",club.historicalLeague??""].join(" ")).includes(normalizeName(query))),[league,query]);
 const count=tab==="players"?filteredPlayers.length:filteredClubs.length;
 function changeTab(t:"players"|"clubs"){setTab(t);setQuery("");setLeague("all");setPosition("all");setSelected(null);setLimit(BATCH)}
 const resetPage=()=>{setLimit(BATCH);setSelected(null)};
 return <><div className="game-intro"><a href="/" className="return-link"><ChevronLeft size={17}/> ZURÜCK ZUM PORTAL</a><div className="game-kicker"><span>FOOTYLAB / DATENBANK</span><span>FAKTEN STATT FANTASIE</span></div><h1>DIE DATENBANK.</h1><p>Spieler, Vereine, Karrierestationen und Bildnachweise an einem Ort. Die redaktionellen Angaben sind historisch – aktuelle Vereinswechsel werden erst nach überprüftem Datenimport angezeigt.</p></div>
 <section className="catalog-panel db-catalog">
  <div className="db-stats">{[{value:databaseStats.playerCount,label:"SPIELER"},{value:databaseStats.clubCount,label:"VEREINE"},{value:databaseStats.careerCount,label:"KARRIEREEINTRÄGE"},{value:databaseStats.photoCount,label:"SPIELERFOTOS"}].map(item=><div key={item.label}><strong>{item.value}</strong><small>{item.label}</small></div>)}</div>
  <div className="catalog-tabs db-tabs"><button onClick={()=>changeTab("players")} className={tab==="players"?"active":""} aria-pressed={tab==="players"}><UserRound size={19}/> SPIELER</button><button onClick={()=>changeTab("clubs")} className={tab==="clubs"?"active":""} aria-pressed={tab==="clubs"}><Shield size={19}/> VEREINE</button></div>
  <div className="catalog-filters"><label className="catalog-search"><Search size={21}/><input value={query} onChange={e=>{setQuery(e.target.value);resetPage()}} placeholder={tab==="players"?"Spieler, Nation oder Karriereverein suchen …":"Verein, Liga oder Land suchen …"} aria-label="Datenbank durchsuchen"/></label><select aria-label="Historische Liga auswählen" value={league} onChange={e=>{setLeague(e.target.value);resetPage()}}><option value="all">ALLE LIGEN</option>{leagues.map(l=><option key={l} value={l}>{l}</option>)}</select>{tab==="players"&&<select aria-label="Position auswählen" value={position} onChange={e=>{setPosition(e.target.value);resetPage()}}><option value="all">ALLE POSITIONEN</option>{["Tor","Abwehr","Mittelfeld","Angriff"].map(p=><option key={p}>{p}</option>)}</select>}</div>
  <div className="catalog-count"><Database size={15}/> {count} EINTRÄGE <span>DETAILS ANKLICKEN / HISTORISCHE DATEN</span></div>
  <div className="db-entries">
   {tab==="players"?filteredPlayers.slice(0,limit).map(player=>{const ref=getReferenceClub(player),isOpen=selected===player.id;return <div className="db-entry" key={player.id}><button className="db-entry-button" onClick={()=>setSelected(isOpen?null:player.id)} aria-expanded={isOpen}><Avatar name={player.name} media={getPlayerPhoto(player)}/><div className="db-entry-name"><strong>{player.name}</strong><small>{player.country} · {player.position} · {player.birthYear}</small></div><span className="db-entry-club">{ref?.name??"Keine Zuordnung"}<small>HISTORISCHE REFERENZ</small></span><ChevronDown className={isOpen?"db-rotate":""} size={20}/></button>{isOpen&&<PlayerDetails player={player}/>}</div>}):
   filteredClubs.slice(0,limit).map(club=>{const isOpen=selected===club.id;return <div className="db-entry" key={club.id}><button className="db-entry-button" onClick={()=>setSelected(isOpen?null:club.id)} aria-expanded={isOpen}><Avatar name={club.name} media={getClubCrest(club)} club/><div className="db-entry-name"><strong>{club.name}</strong><small>{club.country??"Land unbekannt"}</small></div><span className="db-entry-club">{club.historicalLeague??"Noch ohne Ligazuordnung"}<small>HISTORISCH</small></span><ChevronDown className={isOpen?"db-rotate":""} size={20}/></button>{isOpen&&<ClubDetails club={club}/>}</div>})}
   {count===0&&<div className="catalog-empty">Kein Treffer. Versuche einen anderen Namen oder entferne einen Filter.</div>}
  </div>
  {limit<count&&<button className="catalog-more" onClick={()=>setLimit(v=>v+BATCH)}>WEITERE {Math.min(BATCH,count-limit)} EINTRÄGE ANZEIGEN <ArrowRight size={18}/></button>}
  <div className="db-explainer"><Check size={19}/><p><strong>Warum steht bei „aktueller Verein“ oft keine Angabe?</strong> Die Datenbank trennt bewusste historische Zuordnungen von überprüften Live-Daten. Erst ein verlässlicher API-Import darf den aktuellen Verein, die aktuelle Liga oder einen bestätigten Kader setzen. Für Bilder werden Quellen und Lizenzen einzeln gepflegt; unbekannte Vereinslogos ersetzen wir nicht durch ungeprüfte Kopien.</p></div>
 </section></>;
}
