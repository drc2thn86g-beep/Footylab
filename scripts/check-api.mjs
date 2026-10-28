import assert from "node:assert/strict";
import{apiFootballGet,parseSquad,parseTeams,parseNamedTeam,LEAGUES}from"../worker/apiFootball.ts";
import{SEED_CLUBS}from"../worker/seedClubs.ts";
import worker from"../worker/index.ts";
const payload=(response,errors=[])=>new Response(JSON.stringify({response,errors,results:response.length}),{status:200,headers:{"content-type":"application/json"}});
const sampleTeams=[{team:{id:50,name:"Manchester City",logo:"https://media.example/team.png"}},{team:{id:1,name:"",logo:null}},{junk:true}];
const teams=parseTeams(sampleTeams,LEAGUES[0]);
assert.equal(teams.length,1);
assert.equal(teams[0].leagueId,39);
assert.equal(teams[0].id,50);
assert.equal(SEED_CLUBS.length,96);
assert.equal(SEED_CLUBS[0].knownId,33);
const namedClub=parseNamedTeam([
 {team:{id:33,name:"Manchester United",country:"England",logo:"https://media.example/united.png"}},
 {team:{id:3300,name:"Manchester United U21",country:"England"}}
],LEAGUES[0],"Manchester United");
assert.equal(namedClub?.id,33);
assert.equal(parseNamedTeam([
 {team:{id:40,name:"Manchester City",country:"England"}},
 {team:{id:42,name:"Manchester United",country:"England"}}
],LEAGUES[0],"Manchester United")?.id,42);
assert.equal(parseNamedTeam([
 {team:{id:1,name:"Unrelated Club",country:"Spain"}}
],LEAGUES[0],"Manchester United"),null);

const playerRows=Array.from({length:15},(_,i)=>({id:i+10,name:"Player "+i,age:21,position:"Midfielder",number:i+1,photo:"https://media.example/"+i+".png"}));
const roster=parseSquad([{team:{id:50},players:playerRows}],50);
assert.equal(roster.length,15);
assert.equal(roster[0].id,10);
assert.equal(roster[0].age,21);
assert.equal(roster[0].photo,"https://media.example/0.png");
assert.throws(()=>parseSquad([{team:{id:50},players:[]}],50),/Unvollständiger Kader/);
assert.throws(()=>parseSquad([{team:{id:51},players:playerRows}],50),/Kein gültiger Kader/);
let called=false;
const responses=[];
const fetcher=async(url,options)=>{
 called=true;
 assert.equal(new URL(url).hostname,"v3.football.api-sports.io");
 assert.equal(new URL(url).searchParams.get("league"),"39");
 assert.equal(options.headers["x-apisports-key"],"key-only-in-server");
 responses.push(url);
 return payload(sampleTeams);
};
const apiResult=await apiFootballGet("teams",{league:"39",season:"2026"},"key-only-in-server",fetcher);
assert.equal(apiResult.length,3);
assert.equal(called,true);
await assert.rejects(()=>apiFootballGet("teams",{},""),/Schlüssel fehlt/);
await assert.rejects(()=>apiFootballGet("teams",{league:"39"},"secret",async()=>payload([],{plan:"restricted"})),/eingeschränkten/);
const offline=await worker.fetch(new Request("https://footylab.example/api/footy/status"),{
 ASSETS:{fetch:async()=>new Response("site works")}
});
const status=await offline.json();
assert.equal(status.configured,false);
assert.equal(offline.status,200);
const denied=await worker.fetch(new Request("https://footylab.example/api/footy/squad?team=50"),{
 ASSETS:{fetch:async()=>new Response("site works")}
});
assert.equal(denied.status,503);
const importUnavailable=await worker.fetch(new Request("https://footylab.example/api/footy/import",{method:"POST"}),{
 ASSETS:{fetch:async()=>new Response("site works")}
});
assert.equal(importUnavailable.status,503);
const importUnauthorized=await worker.fetch(new Request("https://footylab.example/api/footy/import",{method:"POST"}),{
 ASSETS:{fetch:async()=>new Response("site works")},DB:{},API_FOOTBALL_KEY:"key",FOOTY_IMPORT_TOKEN:"private-admin-token"
});
assert.equal(importUnauthorized.status,401);
const assets=await worker.fetch(new Request("https://footylab.example/assets/app.js"),{
 ASSETS:{fetch:async()=>new Response("static assets remain available")}
});
assert.equal(await assets.text(),"static assets remain available");
console.log("FootyLab API-Football tests successful: adapter, free-tier errors, safe offline fallback and static assets.");
