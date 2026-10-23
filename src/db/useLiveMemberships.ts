import{useEffect,useState}from"react";
import{players}from"./queries";
import{normalizeName}from"../normalize";

export type LiveMembership={providerId:number;name:string;club:string;league:string;checkedAt:string};
type ApiResponse={ok:boolean;players?:{id:number;name:string;club:string;league:string;checkedAt:string}[]};
/** Map API identities to existing UI profiles conservatively: don't guess when
 * two footballers share the same normalized name (e.g. Ederson / Éderson). */
export function useLiveMemberships(){
 const[memberships,setMemberships]=useState<ReadonlyMap<string,LiveMembership>>(()=>new Map());
 useEffect(()=>{
  const controller=new AbortController();
  fetch("/api/footy/game-roster",{signal:controller.signal})
   .then(async response=>{
    if(!response.ok)return null;
    return response.json() as Promise<ApiResponse>;
   }).then(data=>{
    if(controller.signal.aborted||!data?.ok||!Array.isArray(data.players))return;
    const existingCounts=new Map<string,number>();
    for(const player of players){
     const name=normalizeName(player.name);
     existingCounts.set(name,(existingCounts.get(name)??0)+1);
    }
    const providerCounts=new Map<string,number>();
    for(const p of data.players){
     const name=normalizeName(p.name);
     providerCounts.set(name,(providerCounts.get(name)??0)+1);
    }
    const mapped=new Map<string,LiveMembership>();
    for(const p of data.players){
     const name=normalizeName(p.name);
     if(existingCounts.get(name)!==1||providerCounts.get(name)!==1)continue;
     if(!p.club||!p.league||!Number.isFinite(Date.parse(p.checkedAt)))continue;
     mapped.set(name,{providerId:p.id,name:p.name,club:p.club,league:p.league,checkedAt:p.checkedAt});
    }
    setMemberships(mapped);
   }).catch(()=>{/* Provider not yet configured: local curated records remain available */});
  return()=>controller.abort();
 },[]);
 return memberships;
}
