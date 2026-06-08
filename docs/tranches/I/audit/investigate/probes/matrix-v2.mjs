#!/usr/bin/env node
/**
 * b12 matrix v2 — the DEFINITIVE NxN scene-switch matrix.
 *
 * Per ordered pair (A,B): open A fresh → ENGAGE PLAY (confirmed aria="Play
 * animation" button) so A is genuinely playing → NAVIGATE to B via the router
 * hash (the app routes hash→machine NAVIGATE, the SAME single authority the dock
 * select-trigger drives; the dock trigger itself has a visibility-friction bug,
 * recorded separately) → capture transition pageerrors+console errors verbatim,
 * whether B renders controls, whether A suspended (snapshot captured + loop
 * stopped), and whether B resumed-iff-it-was-playing.
 *
 * The play-engagement + the post-nav machine read are the parts the v1 matrix
 * got wrong (it never truly played and mis-read aSnap).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.join(HERE, "..", "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".ttf":"font/ttf",".woff2":"font/woff2",".svg":"image/svg+xml" };
function serveDist(){return http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,"http://x").pathname);const p=path.join(DIST,u==="/"?"index.html":u);if(!p.startsWith(DIST)||!fs.existsSync(p)||fs.statSync(p).isDirectory())return void res.writeHead(404).end();res.writeHead(200,{"content-type":MIME[path.extname(p)]??"application/octet-stream"});fs.createReadStream(p).pipe(res);});}
const requireFrom=createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR??REPO,"package.json"));
const chromium=(()=>{try{return requireFrom("playwright-core").chromium;}catch{return requireFrom("@playwright/test").chromium;}})();
const MACHINE_KEY="keyframes-js-scene-machine";
const CTRL_KEY="animation-groups-control-options-store";
const noise=(t)=>/content-visibility|Rendering was performed|GL Driver Message|GPU stall|WebGL/i.test(t);

const SCENES=["home","cube","amiga","square","easing","spring","sequence","motion-path"];
// scenes whose DFA control set is non-empty (a panel SHOULD render):
const HAS_PANEL=new Set(["cube","amiga","square","easing","spring"]);
// scenes that expose a raw-rAF scenePlayback adapter (vs group adapter):
const RAF_ADAPTER=new Set(["easing","spring","sequence"]);

async function machine(page){return page.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}},MACHINE_KEY);}

async function controls(page){
  return page.evaluate(()=>{
    const txt=(document.body.innerText||"").trim();
    return {
      textLen:txt.length,
      noTwin:/no CSS twin|see console/i.test(txt),
      buttons:document.querySelectorAll("button").length,
      sliders:document.querySelectorAll('input[type=range],[role=slider]').length,
      surfaces:document.querySelectorAll("[data-surface]").length,
      // a "Controls"/"Easing"/"Spring" panel content presence heuristic
      panelText:/duration|delay|iteration|easing|stiffness|damping|curve/i.test(txt),
      sample:txt.replace(/\s+/g," ").slice(0,120),
    };
  });
}

async function clickPlay(page){
  // expanded-dock play button (confirmed aria), then the collapsed variant.
  for(const sel of ['button[aria-label="Play animation"]','button[aria-label="Play animation (collapsed dock)"]']){
    const b=page.locator(sel).first();
    if(await b.count()){ await b.click({timeout:2000,force:true}).catch(()=>{}); return sel; }
  }
  return null;
}

async function openFresh(browser,base,scene){
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  const errs=[];
  page.on("console",(m)=>{ if((m.type()==="error"||m.type()==="warning")&&!noise(m.text())) errs.push(`[${m.type()}] ${m.text().replace(/\s+/g," ").slice(0,160)}`); });
  page.on("pageerror",(e)=>errs.push(`[PAGEERROR] ${e.name}: ${e.message} @ ${(e.stack||"").split("\n")[1]?.trim()||""}`));
  await page.addInitScript((ck)=>{try{localStorage.setItem(ck,JSON.stringify({isControlsPanelOpen:true}));}catch{}},CTRL_KEY);
  await page.goto(`${base}/#/${scene}`,{waitUntil:"load"});
  await page.waitForFunction(([mk,s])=>{try{return JSON.parse(localStorage.getItem(mk)||"{}").activeScene===s;}catch{return false;}},[MACHINE_KEY,scene],{timeout:7000}).catch(()=>{});
  await page.waitForTimeout(800);
  return {ctx,page,errs};
}

const main=async()=>{
  const server=serveDist();await new Promise(r=>server.listen(0,r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch();
  const rows=[];let idx=0;
  for(const A of SCENES){
    for(const B of SCENES){
      if(A===B)continue;idx++;
      const {ctx,page,errs}=await openFresh(browser,base,A);
      const row={from:A,to:B};
      try{
        row.openErrs=errs.filter(e=>/PAGEERROR|error/.test(e)).slice(0,3);
        // engage play on A (home has no scene to play)
        const played=A==="home"?null:await clickPlay(page);
        row.playBtn=played;
        await page.waitForTimeout(500);
        const mA=await machine(page);
        row.aPlayingBefore=mA.status==="playing"||(mA.perScene?.[A]?.playing??null);

        const base0=errs.length;
        // NAVIGATE to B via router hash (routes through the machine — single authority)
        await page.evaluate((id)=>{location.hash=`#/${id}`;},B);
        const arrived=await page.waitForFunction(([mk,s])=>{try{return JSON.parse(localStorage.getItem(mk)||"{}").activeScene===s;}catch{return false;}},[MACHINE_KEY,B],{timeout:6000}).then(()=>true).catch(()=>false);
        row.arrived=arrived;
        await page.waitForTimeout(1100);

        row.switchErrs=errs.slice(base0).filter(e=>/PAGEERROR|error/.test(e)).slice(0,6);
        const c=await controls(page);
        row.ctrl=c;
        // BLANK verdict: only meaningful where the DFA says a panel SHOULD show.
        row.shouldHavePanel=HAS_PANEL.has(B);
        row.controlsBlank=row.shouldHavePanel && !c.panelText && c.surfaces<2;

        const mAfter=await machine(page);
        // A SUSPENDED? its snapshot must be captured into perScene AND its loop
        // stopped. We read the snapshot presence + the playing flag it saved.
        const aSnap=mAfter.perScene?.[A];
        row.aSnapshotCaptured=!!aSnap;
        row.aSnapPlaying=aSnap?.playing??null;
        row.bAdapter=RAF_ADAPTER.has(B)?"raf":(B==="home"?"none":"group");
        row.bStatus=mAfter.status??null;

        const interesting=row.switchErrs.length||row.controlsBlank||!arrived||idx%9===0;
        if(interesting){const s=path.join(SHOTS,`m2_${A}_to_${B}.png`);await page.screenshot({path:s}).catch(()=>{});row.shot=path.relative(REPO,s);}
      }catch(e){row.harnessError=String(e?.message||e);}
      finally{rows.push(row);await ctx.close();}
    }
  }
  await browser.close();server.close();
  const out=path.join(HERE,"..","b12-matrix-v2.json");
  fs.writeFileSync(out,JSON.stringify(rows,null,2));
  console.log("WROTE "+path.relative(REPO,out)+" — "+rows.length+" transitions\n");
  for(const r of rows){
    const e=r.switchErrs?.length?"ERR ":"ok  ";
    const bl=r.controlsBlank?"BLANK":(r.shouldHavePanel?"panel":"  -  ");
    const ar=r.arrived?"->":"X>";
    console.log(`  ${e} ${bl} ${r.from} ${ar} ${r.to}  aSnap=${r.aSnapshotCaptured} aSnapPlay=${r.aSnapPlaying} bAdapter=${r.bAdapter} ${r.switchErrs?.[0]?("| "+r.switchErrs[0].slice(0,70)):""}`);
  }
  // signature rollup
  const sig=new Map();
  for(const r of rows)for(const x of (r.switchErrs||[]).concat(r.openErrs||[])){const k=x.replace(/:\d+:\d+/g,":N").replace(/offset \d+/g,"offset N").slice(0,110);sig.set(k,(sig.get(k)||0)+1);}
  console.log("\nDISTINCT ERROR SIGNATURES:");
  for(const [k,n] of [...sig.entries()].sort((a,b)=>b[1]-a[1]))console.log(`  ${n}x ${k}`);
  // blank rollup
  const blanks=rows.filter(r=>r.controlsBlank).map(r=>`${r.from}->${r.to}`);
  console.log("\nBLANK-CONTROLS transitions ("+blanks.length+"):",blanks.join(", ")||"none");
  const miss=rows.filter(r=>!r.arrived).map(r=>`${r.from}->${r.to}`);
  console.log("DID-NOT-ARRIVE ("+miss.length+"):",miss.join(", ")||"none");
};
main().catch(e=>{console.error(e);process.exit(1);});
