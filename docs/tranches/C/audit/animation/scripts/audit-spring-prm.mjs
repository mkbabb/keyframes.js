#!/usr/bin/env node
// Does the JS SpringProgress still animate under reduced motion? (It should,
// since the demo omits respectReducedMotion and glass-ui's CSS reset can't
// touch a JS rAF loop.)
import fs from "node:fs"; import http from "node:http"; import path from "node:path";
import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DIST=path.join(REPO,"dist/gh-pages");
const OUT=path.join(REPO,"docs/tranches/C/audit/animation/captures");
function chrom(){const rq=createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR??"/tmp/kf-audit","package.json"));for(const p of ["playwright-core"]){try{return rq(p).chromium;}catch{}}}
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".ttf":"font/ttf",".json":"application/json",".jpg":"image/jpeg",".webp":"image/webp"};
function serve(){const s=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,"http://x").pathname);let p=path.join(DIST,u==="/"?"index.html":u);if(!p.startsWith(DIST)||!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(DIST,"index.html");res.writeHead(200,{"content-type":MIME[path.extname(p)]??"application/octet-stream"});fs.createReadStream(p).pipe(res);});return new Promise(r=>s.listen(0,()=>r(s)));}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
  const chromium=chrom();const s=await serve();const base=`http://127.0.0.1:${s.address().port}`;
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  const page=await ctx.newPage();
  await page.goto(`${base}/#/spring`,{waitUntil:"load"});await sleep(3000);
  const railBox=await page.evaluate(()=>{const r=document.querySelector(".spring-rail");if(!r)return null;const b=r.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};});
  const sx=railBox.x+railBox.w*0.9, sy=railBox.y+railBox.h/2;
  const samples=await page.evaluate(async({sx,sy})=>{
    const rail=document.querySelector(".spring-rail");
    const fire=t=>rail.dispatchEvent(new PointerEvent(t,{clientX:sx,clientY:sy,bubbles:true,cancelable:true,pointerId:1,pointerType:"mouse",isPrimary:true}));
    fire("pointerdown");fire("pointerup");
    const ball=document.querySelector(".spring-ball");const railR=rail.getBoundingClientRect();
    const rows=[];const start=performance.now();
    return await new Promise(res=>{(function tick(){const bx=ball.getBoundingClientRect().x-railR.x;rows.push({t:+(performance.now()-start).toFixed(0),bx:+bx.toFixed(2)});if(performance.now()-start>1200)res(rows);else requestAnimationFrame(tick);})();});
  },{sx,sy});
  const col=samples.map(s=>s.bx);
  const range=Math.max(...col)-Math.min(...col);
  // Count distinct intermediate positions = proof it tweened (vs snapped).
  const distinct=new Set(col.map(v=>Math.round(v))).size;
  const out={
    prmEmulated:true,
    spanPx:+range.toFixed(2),
    distinctIntermediatePositions:distinct,
    firstFew:samples.slice(0,8),
    verdict: distinct>5 ? "JS SpringProgress STILL ANIMATES under reduce (tweened through "+distinct+" positions) — demo omits respectReducedMotion; glass-ui CSS reset cannot touch the JS rAF loop" : "spring snapped (few intermediate positions)",
  };
  fs.writeFileSync(path.join(OUT,"measurements-spring-prm.json"),JSON.stringify(out,null,2));
  console.log(JSON.stringify(out,null,2));
  await ctx.close();await browser.close();s.close();
}
main().catch(e=>{console.error(e);process.exit(3);});
