'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var i=Object.defineProperty;var s=(t,n)=>{for(var r in n)i(t,r,{get:n[r],enumerable:!0});};var u={};s(u,{get:()=>e,getVersion:()=>d,importer:()=>f,isBun:()=>a,isDeno:()=>c,isJest:()=>l,isNode:()=>p,runtimes:()=>o,switcher:()=>m});var o={bun:globalThis.Bun,deno:globalThis.Deno,node:void 0,jest:globalThis.jest};function e(){return o.bun?"bun":o.deno?"deno":o.jest?"jest":"node"}function a(){return e()==="bun"}function c(){return e()==="deno"}function p(){return e()==="node"}function l(){return e()==="jest"}function d(){let t=e();switch(t){case"bun":return globalThis.Bun.version;case"deno":return globalThis.Deno.version.deno;case"node":return globalThis.process.version.substring(1);default:throw new Error(`No runtime version found for ${t}`)}}function m(t,n){let r=e();return t[n??r]}async function f(t,n){let r=e();return import(t[n??r])}var b=u;

exports.default = b;
exports.get = e;
exports.getVersion = d;
exports.importer = f;
exports.isBun = a;
exports.isDeno = c;
exports.isJest = l;
exports.isNode = p;
exports.runtime = u;
exports.runtimes = o;
exports.switcher = m;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map