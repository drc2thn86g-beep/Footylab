import React,{useEffect,useState}from"react";
import{AlertCircle,Check,ChevronRight,Database,RefreshCw,Shield,UserRound}from"lucide-react";
import{photoUrl}from"./media";

type ApiStatus={
 ok:boolean;configured:boolean;provider?:string;message?:string;
 clubCount?:number;playerCount?:number;lastSuccess?:string|null;lastError?:string|null;
};
type Team={id:number;name:string;league:string;country:string;checkedAt:string;logo:string|null};
type ApiPlayer={id:number;name:string;age:number|null;position:string|null;number:number|null;photo:string|null};
type TeamResponse={ok:boolean;teams:Team[]};
type SquadResponse={ok:boolean;team:Team;count:number;players:ApiPlayer[]};
async function getJson<T>(path:string,signal:AbortSignal):Promise<T>{
 const response=await fetch(path,{signal});
 if(!response.ok)throw new Error("Kaderdaten sind aktuell nicht verfügbar");
 return response.json() as Promise<T>;
}
function dateTime(value:string|null|undefined){
 if(!value)return"noch nie";
 const d=new Date(value);
 return Number.isNaN(d.getTime())?"unbekannt":d.toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"});
}
export default function LiveSquads(){
 const[status,setStatus]=useState<ApiStatus|null>(null);
 const[teams,setTeams]=useState<Team[]>([]);
 const[selected,setSelected]=useState<number|null>(null);
 const[squad,setSquad]=useState<SquadResponse|null>(null);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState<string|null>(null);
 useEffect(()=>{
  const controller=new AbortController();
  (async()=>{
   try{
    const result=await getJson<ApiStatus>("/api/footy/status",controller.signal);
    if(controller.signal.aborted)return;
    setStatus(result);
    if(result.configured){
     const data=await getJson<TeamResponse>("/api/footy/teams",controller.signal);
     if(controller.signal.aborted)return;
     const sorted=[...data.teams].sort((a,b)=>a.league.localeCompare(b.league,"de")||a.name.localeCompare(b.name,"de"));
     setTeams(sorted);
     if(sorted.length)setSelected(sorted[0].id);
    }
   }catch(err){if(!controller.signal.aborted)setError(err instanceof Error?err.message:"Abruf derzeit nicht möglich")}
   finally{if(!controller.signal.aborted)setLoading(false)}
  })();
  return()=>controller.abort();
 },[]);
 useEffect(()=>{
  if(selected===null)return;
  const controller=new AbortController();
  setSquad(null);
  getJson<SquadResponse>("/api/footy/squad?team="+selected,controller.signal)
   .then(data=>{if(!controller.signal.aborted)setSquad(data)})
   .catch(()=>{if(!controller.signal.aborted)setError("Kader dieses Vereins momentan nicht abrufbar")});
  return()=>controller.abort();
 },[selected]);
 return <section className="live-squads" aria-labelledby="live-squads-heading">
  <div className="live-squads-title"><div><span className="db-tag">FOOTYLAB / API-VERBINDUNG</span><h2 id="live-squads-heading">KADER-DATENFEED</h2></div><div className="api-status-icon">{status?.configured?<Check size={22}/>:<Database size={22}/>}</div></div>
  {loading?<p className="live-squads-message"><RefreshCw size={16}/> Prüfe die API-Verbindung …</p>:
  !status?.configured?<div className="live-squads-message"><AlertCircle size={18}/><p><strong>API vorbereitet – Aktivierung ausstehend.</strong> {status?.message??error??"Noch keine Live-Datenbank angebunden."} Die vorhandene redaktionelle Fußballdatenbank funktioniert weiterhin.</p></div>:
  <><div className="live-squads-count"><span><b>{status.clubCount??0}</b> Vereine</span><span><b>{status.playerCount??0}</b> Spieler</span><span>Letzter Import: {dateTime(status.lastSuccess)}</span></div>
   {status.lastError&&<p className="live-squads-warning"><AlertCircle size={15}/> Letzter Synchronisationshinweis: {status.lastError}</p>}
   {teams.length===0?<p className="live-squads-message">API-Schlüssel verbunden. Noch kein Mannschaftskader vollständig importiert. Der tägliche Abgleich läuft automatisch, sobald die API aktuelle Mannschaften freigibt.</p>:
   <><label className="live-select-label" htmlFor="live-team-picker">VEREIN ANZEIGEN</label><select id="live-team-picker" className="live-team-select" value={selected??""} onChange={e=>{setSelected(Number(e.target.value));setError(null)}}>{teams.map(team=><option value={team.id} key={team.id}>{team.league} — {team.name}</option>)}</select>
    {squad?<><div className="live-team-head"><Shield size={24}/><div><strong>{squad.team.name}</strong><small>{squad.team.league} · {squad.count} Spieler · Stand {dateTime(squad.team.checkedAt)}</small></div></div><div className="live-player-list">{squad.players.map(player=><div key={player.id} className="live-player-row">{player.photo||photoUrl(player.name)?<img src={player.photo??photoUrl(player.name)} alt="" loading="lazy"/>:<span className="live-player-fallback"><UserRound size={21}/></span>}<div><strong>{player.name}</strong><small>{player.position??"Position offen"}{player.age?" · "+player.age+" Jahre":""}</small></div>{player.number!==null&&<span className="live-shirt-number">#{player.number}</span>}</div>)}</div></>:<p className="live-squads-message">Lade den gewählten Mannschaftskader …</p>}
    {error&&<p className="live-squads-warning">{error}</p>}
   </>}
  </>}
  <p className="live-squads-legal">Quelle: API-Football (API-Sports). Automatisch zwischengespeicherte Kader sind Momentaufnahmen, kein Live-Transfer-Ticker. Bilder aus der API werden erst angezeigt, wenn ihre Nutzungsrechte gesondert freigegeben wurden; andernfalls nutzen wir lizenzierte Fotos oder Platzhalter.</p>
 </section>;
}
