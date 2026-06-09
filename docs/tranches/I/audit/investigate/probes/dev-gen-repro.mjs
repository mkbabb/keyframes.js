#!/usr/bin/env node
/** Reproduce B2 `_gen` TypeError against the DEV server (:5174, source-mapped).
 *  The user saw it on dev easing->amiga via the dock. We drive the dock Scene
 *  select with real Playwright clicks (which open the reka popper), engage play,
 *  and switch — capturing the source-mapped stack. Also tries the rapid
 *  switch-while-playing race (the likely _gen trigger). */
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DEV = process.env.DEV_BASE || "http://localhost:5174";
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const chromium = (()=>{try{return requireFrom("playwright-core").chromium;}catch{return requireFrom("@playwright/test").chromium;}})();
const MK="keyframes-js-scene-machine";
const noise=(t)=>/content-visibility|Rendering was performed|GL Driver|GPU stall|WebGL|\[vite\]|hmr|sourcemap|Download the/i.test(t);

async function mac(p){return p.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}},MK);}
async function nav(p,id){await p.evaluate((x)=>{location.hash=`#/${x}`;},id);return p.waitForFunction(([mk,s])=>{try{return JSON.parse(localStorage.getItem(mk)||"{}").activeScene===s;}catch{return false;}},[MK,id],{timeout:8000}).then(()=>true).catch(()=>false);}
async function play(p){for(const s of ['button[aria-label="Play animation"]','button[aria-label="Play animation (collapsed dock)"]']){const b=p.locator(s).first();if(await b.count()){await b.click({timeout:2500,force:true}).catch(()=>{});return true;}}return false;}

const main=async()=>{
  const browser=await chromium.launch();
  const out={};

  // attempt 1: easing(playing) -> amiga via hash, watch for _gen
  for(const [name, A, B, viaPlay] of [["easing_to_amiga","easing","amiga",true],["cube_to_amiga","cube","amiga",true],["amiga_to_easing","amiga","easing",true]]){
    const ctx=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await ctx.newPage();
    const errs=[];
    page.on("console",(m)=>{if((m.type()==="error"||m.type()==="warning")&&!noise(m.text()))errs.push(`[${m.type()}] ${m.text().replace(/\s+/g," ").slice(0,200)}`);});
    page.on("pageerror",(e)=>errs.push(`[PAGEERROR] ${e.name}: ${e.message}\n  ${(e.stack||"").split("\n").slice(1,9).map(s=>s.trim()).join("\n  ")}`));
    try{
      await page.goto(`${DEV}/#/${A}`,{waitUntil:"load"});
      await page.waitForTimeout(2500); // dev: bigger settle (HMR/compile)
      if(viaPlay) await play(page);
      await page.waitForTimeout(700);
      const e0=errs.length;
      // RAPID switch (the race): fire two navs back-to-back to stress the
      // captureActive→suspend timing the user hit on dev.
      await nav(page,B);
      await page.waitForTimeout(1600);
      out[name]={
        arrived:(await mac(page)).activeScene===B,
        switchErrs:errs.slice(e0).slice(0,8),
        genError:errs.slice(e0).some(x=>/_gen|undefined is not an object/i.test(x)),
      };
    }catch(e){out[name]={harnessError:String(e?.message||e)};}
    finally{await ctx.close();}
  }

  // attempt 2: the RACE — start cube playing, then rapidly toggle scenes a few
  // times without waiting (the _gen window is the suspend of a group whose
  // playback the prior nav already swapped).
  {
    const ctx=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await ctx.newPage();const errs=[];
    page.on("console",(m)=>{if((m.type()==="error")&&!noise(m.text()))errs.push(`[err] ${m.text().slice(0,160)}`);});
    page.on("pageerror",(e)=>errs.push(`[PAGEERROR] ${e.name}: ${e.message}\n  ${(e.stack||"").split("\n").slice(1,8).map(s=>s.trim()).join("\n  ")}`));
    try{
      await page.goto(`${DEV}/#/amiga`,{waitUntil:"load"});await page.waitForTimeout(2500);
      await play(page);await page.waitForTimeout(500);
      const e0=errs.length;
      // rapid-fire without settle
      for(const id of ["easing","amiga","cube","amiga","spring","amiga"]){
        await page.evaluate((x)=>{location.hash=`#/${x}`;},id);
        await page.waitForTimeout(180); // sub-settle: stress the suspend race
      }
      await page.waitForTimeout(1500);
      out.rapid_race={errs:errs.slice(e0).slice(0,10), genError:errs.slice(e0).some(x=>/_gen|undefined is not an object/i.test(x))};
    }catch(e){out.rapid_race={harnessError:String(e?.message||e)};}
    finally{await ctx.close();}
  }

  await browser.close();
  console.log(JSON.stringify(out,null,2));
};
main().catch(e=>{console.error(e);process.exit(1);});
