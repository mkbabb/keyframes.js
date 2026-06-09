#!/usr/bin/env node
/**
 * B2 focused probe — the DFA suspend/resume contract + the `_gen` TypeError.
 *
 * Tests, per the user's spec:
 *   (1) easing(playing) → amiga : the leaving scene must SUSPEND+SAVE; capture
 *       the `_gen` TypeError if it fires. Check amiga controls render (not blank).
 *   (2) cube(playing) → easing → BACK to cube : cube must RESUME iff it was
 *       playing before (it was) — re-entry resume semantics.
 *   (3) cube(paused) → easing → BACK to cube : cube must stay PAUSED.
 *   (4) sweep a focused set of (playing-A → B) pairs reading the saved snapshot
 *       playing flag + the new scene's live status to derive resume-iff-playing.
 *
 * Drives play/pause through the confirmed aria buttons; navigates via hash (the
 * router's machine NAVIGATE — same authority as the dock select).
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
const MK="keyframes-js-scene-machine";const CK="animation-groups-control-options-store";
const noise=(t)=>/content-visibility|Rendering was performed|GL Driver Message|GPU stall|WebGL/i.test(t);
async function mac(p){return p.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}},MK);}
async function play(p){for(const s of ['button[aria-label="Play animation"]','button[aria-label="Play animation (collapsed dock)"]']){const b=p.locator(s).first();if(await b.count()){await b.click({timeout:2000,force:true}).catch(()=>{});return true;}}return false;}
async function pause(p){for(const s of ['button[aria-label="Pause animation"]','button[aria-label="Pause animation (collapsed dock)"]']){const b=p.locator(s).first();if(await b.count()){await b.click({timeout:2000,force:true}).catch(()=>{});return true;}}return false;}
async function nav(p,id){await p.evaluate((x)=>{location.hash=`#/${x}`;},id);return p.waitForFunction(([mk,s])=>{try{return JSON.parse(localStorage.getItem(mk)||"{}").activeScene===s;}catch{return false;}},[MK,id],{timeout:6000}).then(()=>true).catch(()=>false);}
async function ctrl(p){return p.evaluate(()=>{const t=(document.body.innerText||"").trim();return{len:t.length,panel:/duration|delay|iteration|easing|stiffness|damping|curve/i.test(t),surfaces:document.querySelectorAll("[data-surface]").length,sample:t.replace(/\s+/g," ").slice(0,110)};});}

async function freshPage(browser,base){
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();const errs=[];
  page.on("console",(m)=>{if((m.type()==="error"||m.type()==="warning")&&!noise(m.text()))errs.push(`[${m.type()}] ${m.text().replace(/\s+/g," ").slice(0,150)}`);});
  page.on("pageerror",(e)=>errs.push(`[PAGEERROR] ${e.name}: ${e.message} @ ${(e.stack||"").split("\n").slice(1,4).map(s=>s.trim()).join(" ")}`));
  await page.addInitScript((ck)=>{try{localStorage.setItem(ck,JSON.stringify({isControlsPanelOpen:true}));}catch{}},CK);
  return {ctx,page,errs};
}

const main=async()=>{
  const server=serveDist();await new Promise(r=>server.listen(0,r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch();
  const report={};

  // (1) easing(playing) -> amiga
  {
    const {ctx,page,errs}=await freshPage(browser,base);
    await page.goto(`${base}/#/easing`,{waitUntil:"load"});await page.waitForTimeout(1200);
    await play(page);await page.waitForTimeout(500);
    const mBefore=await mac(page);
    const e0=errs.length;
    const arrived=await nav(page,"amiga");await page.waitForTimeout(1300);
    const c=await ctrl(page);const mAfter=await mac(page);
    await page.screenshot({path:path.join(SHOTS,"dfa_easing_to_amiga.png")}).catch(()=>{});
    report.case1_easing_to_amiga={
      arrived, switchErrs:errs.slice(e0).filter(x=>/PAGEERROR|error/.test(x)),
      easingSnapAfter:mAfter.perScene?.easing??null,
      amigaControls:c, amigaBlank:!c.panel&&c.surfaces<2,
      genError:errs.slice(e0).some(x=>/_gen/.test(x)),
    };
    await ctx.close();
  }

  // (2) cube(playing) -> easing -> cube : resume-iff-playing (was playing => resume)
  {
    const {ctx,page,errs}=await freshPage(browser,base);
    await page.goto(`${base}/#/cube`,{waitUntil:"load"});await page.waitForTimeout(1200);
    await play(page);await page.waitForTimeout(600);
    const cubePlayingBefore=(await mac(page)).status;
    await nav(page,"easing");await page.waitForTimeout(900);
    const cubeSnap=(await mac(page)).perScene?.cube??null;
    const e0=errs.length;
    await nav(page,"cube");await page.waitForTimeout(1200);
    const mBack=await mac(page);
    report.case2_cube_play_roundtrip={
      cubePlayingBefore, cubeSnapPlaying:cubeSnap?.playing??null,
      statusOnReturn:mBack.status,
      resumedAsExpected:cubeSnap?.playing===true, // it was playing => snapshot.playing should be true
      backErrs:errs.slice(e0).filter(x=>/PAGEERROR|error/.test(x)).slice(0,4),
    };
    await ctx.close();
  }

  // (3) cube(paused) -> easing -> cube : should stay paused
  {
    const {ctx,page,errs}=await freshPage(browser,base);
    await page.goto(`${base}/#/cube`,{waitUntil:"load"});await page.waitForTimeout(1200);
    await play(page);await page.waitForTimeout(500);await pause(page);await page.waitForTimeout(400);
    const pausedStatus=(await mac(page)).status;
    await nav(page,"easing");await page.waitForTimeout(900);
    const cubeSnap=(await mac(page)).perScene?.cube??null;
    await nav(page,"cube");await page.waitForTimeout(1100);
    const mBack=await mac(page);
    report.case3_cube_paused_roundtrip={
      pausedStatusBeforeLeave:pausedStatus,
      cubeSnapPlaying:cubeSnap?.playing??null,
      statusOnReturn:mBack.status,
      stayedPausedAsExpected:(cubeSnap?.playing??true)===false,
    };
    await ctx.close();
  }

  // (4) sweep: for each playing-A, leave to a neutral scene, read A's saved
  //     snapshot.playing — the "suspended+saved correctly" signal across all A.
  {
    report.case4_suspend_save_per_scene={};
    for(const A of ["cube","amiga","square","easing","spring","sequence","motion-path"]){
      const {ctx,page,errs}=await freshPage(browser,base);
      await page.goto(`${base}/#/${A}`,{waitUntil:"load"});await page.waitForTimeout(1100);
      const played=await play(page);await page.waitForTimeout(500);
      const e0=errs.length;
      await nav(page,"home");await page.waitForTimeout(900);
      const snap=(await mac(page)).perScene?.[A]??null;
      report.case4_suspend_save_per_scene[A]={
        played, snapshotCaptured:!!snap, snapPlaying:snap?.playing??null,
        leaveErrs:errs.slice(e0).filter(x=>/PAGEERROR|error/.test(x)).slice(0,3),
        genError:errs.slice(e0).some(x=>/_gen/.test(x)),
      };
      await ctx.close();
    }
  }

  await browser.close();server.close();
  const out=path.join(HERE,"..","b12-dfa-cases.json");
  fs.writeFileSync(out,JSON.stringify(report,null,2));
  console.log("WROTE "+path.relative(REPO,out));
  console.log(JSON.stringify(report,null,2));
};
main().catch(e=>{console.error(e);process.exit(1);});
