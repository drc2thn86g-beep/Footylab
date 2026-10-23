import type{Position}from"../catalog";

/** Basismodell für einen späteren API-Sync. Unbekanntes bleibt null, niemals geraten. */
export type DataStatus="historical-only"|"verified-current";
export type SourceSystem="editorial"|"wikimedia-commons"|"official-club"|"api-football"|"football-data";
export type SourceRef={system:SourceSystem;externalId?:string;url?:string;checkedAt?:string};
export type ClubRecord={
 id:string;name:string;aliases:string[];country:string|null;
 historicalLeague:string|null;currentLeague:string|null;
 crestAssetId:string|null;source:SourceRef;status:DataStatus;
};
export type PlayerRecord={
 id:string;name:string;country:string|null;position:Position|null;birthYear:number|null;
 currentClubId:string|null;referenceClubId:string|null;
 portraitAssetId:string|null;source:SourceRef;status:DataStatus;
};
export type CareerRecord={
 id:string;playerId:string;clubId:string;order:number|null;
 isLoan:boolean;kind:"ordered-career"|"known-affiliation";
 source:SourceRef;
};
export type MediaAsset={
 id:string;entityType:"player"|"club";entityId:string;
 kind:"portrait"|"crest";url:string;sourcePage:string;
 author:string;license:string;licenseUrl:string;
 changed:boolean;source:SourceRef;
};
