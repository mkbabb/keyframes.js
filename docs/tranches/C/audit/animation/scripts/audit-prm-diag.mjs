#!/usr/bin/env node
// Diagnose WHY idle-bob translateY is 0 under reduce.
import fs from "node:fs"; import http from "node:http"; import path from "node:path";
import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
function chrom(){ const rq=createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR??"/tmp/kf-audit","package.json")); for(const p of ["playwright-core"]){try{return rq(p).chromium;}catch{}} }
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".ttf":"font/ttf",".json":"application/json",".jpg":"image/jpeg",".webp":"image/webp"};
function serve(){const s=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,"http://x").pathname);let p=path.join(DIST,u==="/"?"index.html":u);if(!p.startsWith(DIST)||!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(DIST,"index.html");res.writeHead(200,{"content-type":MIME[path.extname(p)]??"application/octet-stream"});fs.createReadStream(p).pipe(res);});return new Promise(r=>s.listen(0,()=>r(s)));}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
  const chromium=chrom(); const s=await serve(); const base=`http://127.0.0.1:${s.address().port}`;
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await ctx.newPage();
  await page.goto(`${base}/#/cube`,{waitUntil:"load"}); await sleep(2800);
  const diag=await page.evaluate(async()=>{
    const el=document.querySelector(".idle-hover");
    const cs=getComputedStyle(el);
    // Read the resolved animation longhands + the keyframe rule the UA applies.
    const r=el.getBoundingClientRect();
    // Sample matrix at 3 times across 1.6s
    const samples=[];
    const start=performance.now();
    await new Promise(res=>{(function tick(){const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);samples.push({t:+(performance.now()-start).toFixed(0),m42:+m.m42.toFixed(3),raw:getComputedStyle(el).transform});if(performance.now()-start>1600)res();else requestAnimationFrame(tick);})();});
    return {
      prm: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      animationName: cs.animationName, playState: cs.animationPlayState,
      animationDuration: cs.animationDuration, animationIterationCount: cs.animationIterationCount,
      rectVisible: r.width>0 && r.height>0, rect: {w:+r.width.toFixed(0),h:+r.height.toFixed(0),top:+r.top.toFixed(0)},
      classList: el.className,
      transformOrigin: cs.transformOrigin,
      uniqueM42: [...new Set(samples.map(x=>x.m42))],
      rawTransformHead: samples.slice(0,3).map(x=>x.raw),
    };
  });
  await ctx.close(); await browser.close(); s.close();
  console.log(JSON.stringify(diag,null,2));
}
main().catch(e=>{console.error(e);process.exit(3);});
