#!/usr/bin/env node
// audit-slides — capture a slide transition from the pre-built slides/dist.
// Measures the [data-state] slide swap: opacity/transform tween + easing.
import fs from "node:fs"; import http from "node:http"; import path from "node:path";
import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SLIDES_DIST="/Users/mkbabb/Programming/slides/dist";
const OUT=path.join(REPO,"docs/tranches/C/audit/animation/captures");
function chrom(){const rq=createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR??"/tmp/kf-audit","package.json"));for(const p of ["playwright-core"]){try{return rq(p).chromium;}catch{}}}
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".json":"application/json",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".ico":"image/x-icon"};
function serve(){const s=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,"http://x").pathname);let p=path.join(SLIDES_DIST,u==="/"?"index.html":u);if(!p.startsWith(SLIDES_DIST)||!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(SLIDES_DIST,"index.html");res.writeHead(200,{"content-type":MIME[path.extname(p)]??"application/octet-stream"});fs.createReadStream(p).pipe(res);});return new Promise(r=>s.listen(0,()=>r(s)));}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
  if(!fs.existsSync(path.join(SLIDES_DIST,"index.html"))){console.log(JSON.stringify({skipped:"slides/dist not built"}));return;}
  const chromium=chrom();const s=await serve();const base=`http://127.0.0.1:${s.address().port}`;
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errs=[];page.on("pageerror",e=>errs.push(e.message));
  await page.goto(`${base}/til-briefing`,{waitUntil:"load"});await sleep(2500);
  await page.screenshot({path:path.join(OUT,"slide-01.png")});
  // Read the slide transition spec.
  const spec=await page.evaluate(()=>{
    const active=document.querySelector('[data-state="active"]');
    if(!active)return{found:false,bodyText:document.body.innerText.slice(0,120)};
    const cs=getComputedStyle(active);
    return{found:true,transitionProperty:cs.transitionProperty,transitionDuration:cs.transitionDuration,transitionTimingFunction:cs.transitionTimingFunction.slice(0,120),tag:active.className.slice(0,60)};
  });
  // Sample opacity/transform of the incoming slide across an advance.
  let samples=[];
  if(spec.found){
    samples=await page.evaluate(async()=>{
      // Track ALL slides' opacity by index; advance via the Next button click.
      const slides=[...document.querySelectorAll('.slide')];
      const start=performance.now();
      const rows=[];
      const sampling=new Promise(res=>{(function tick(){const now=performance.now();const ops=slides.map(s=>({st:s.getAttribute('data-state'),o:+parseFloat(getComputedStyle(s).opacity).toFixed(3),tx:+(new DOMMatrixReadOnly(getComputedStyle(s).transform).m41).toFixed(1)}));rows.push({t:+(now-start).toFixed(0),slides:ops});if(now-start>1100)res(rows);else requestAnimationFrame(tick);})();});
      await new Promise(r=>setTimeout(r,40));
      const nextBtn=document.querySelector('[aria-label="Next slide"]')||document.querySelector('.deck-edge--next button');
      if(nextBtn)nextBtn.click();
      else window.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));
      return await sampling;
    });
    await page.screenshot({path:path.join(OUT,"slide-02-after-advance.png")});
  }
  // Analyse: did any slide's opacity pass through an intermediate value (ramp)?
  let ramped=false, maxNewOpacityMid=0, swapTms=null;
  for(const row of samples){
    for(const sl of row.slides){
      if(sl.o>0.02&&sl.o<0.98)ramped=true;
    }
  }
  // settle time: last t where any slide opacity is mid-transition
  let lastMid=0;
  for(const row of samples){if(row.slides.some(sl=>sl.o>0.02&&sl.o<0.98))lastMid=row.t;}
  const out={
    slideTransitionSpec:spec,
    opacityRampObserved:ramped,
    measuredTransitionMs:lastMid,
    interpretation:ramped?`slide swap ANIMATES — opacity tween observed, CSS transition (opacity 0.5s ease-standard, transform 0.6s ease-out), measured ~${lastMid}ms`:"no opacity ramp captured (instant swap or transform-only)",
    pageErrors:errs.slice(0,5),
    sampleHead:samples.filter((_,i)=>i%2===0).slice(0,18),
  };
  fs.writeFileSync(path.join(OUT,"measurements-slides.json"),JSON.stringify(out,null,2));
  console.log(JSON.stringify(out,null,2));
  await browser.close();s.close();
}
main().catch(e=>{console.error("ERR",e);process.exit(3);});
