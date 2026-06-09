#!/usr/bin/env node
/** Click the "Scene" dock-select-trigger and dump EVERYTHING that appears
 *  (portal listbox). Then drive the switch through the discovered mechanism. */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".ttf":"font/ttf",".woff2":"font/woff2",".svg":"image/svg+xml" };
function serveDist(){return http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,"http://x").pathname);const p=path.join(DIST,u==="/"?"index.html":u);if(!p.startsWith(DIST)||!fs.existsSync(p)||fs.statSync(p).isDirectory())return void res.writeHead(404).end();res.writeHead(200,{"content-type":MIME[path.extname(p)]??"application/octet-stream"});fs.createReadStream(p).pipe(res);});}
const requireFrom=createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR??REPO,"package.json"));
const chromium=(()=>{try{return requireFrom("playwright-core").chromium;}catch{return requireFrom("@playwright/test").chromium;}})();
const main=async()=>{
  const server=serveDist();await new Promise(r=>server.listen(0,r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  await page.goto(`${base}/#/cube`,{waitUntil:"load"});
  await page.waitForTimeout(1500);
  // snapshot body child count before
  const before=await page.evaluate(()=>document.body.querySelectorAll("*").length);
  // click Scene via real locator
  await page.locator('button[aria-label="Scene"]').first().click({timeout:3000}).catch(e=>console.log("click err",e.message));
  await page.waitForTimeout(600);
  const after=await page.evaluate(()=>document.body.querySelectorAll("*").length);
  // Dump any newly-visible listbox/option/menu, anywhere in the doc.
  const dump=await page.evaluate(()=>{
    const vis=(el)=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
    const sel='[role=listbox] *,[role=option],[role=menu] *,[role=menuitem],[data-reka-popper-content-wrapper] *,[data-radix-popper-content-wrapper] *,[cmdk-item]';
    const seen=new Set();const out=[];
    for(const el of document.querySelectorAll('[role=option],[role=menuitem],[cmdk-item],[data-radix-collection-item]')){
      if(!vis(el))continue;const t=(el.textContent||"").trim();if(seen.has(t))continue;seen.add(t);
      out.push({tag:el.tagName,role:el.getAttribute("role"),text:t.slice(0,30),cls:(el.className||"").toString().slice(0,40)});
    }
    // Also: is there an open select content container?
    const containers=[...document.querySelectorAll('[role=listbox],[data-state=open],[data-reka-select-content],[data-radix-select-content]')].filter(vis).map(c=>({tag:c.tagName,role:c.getAttribute("role"),state:c.getAttribute("data-state"),cls:(c.className||"").toString().slice(0,50)}));
    return {options:out, containers};
  });
  console.log("body els before/after click:",before,"->",after);
  console.log("OPTIONS:",JSON.stringify(dump.options,null,1));
  console.log("CONTAINERS:",JSON.stringify(dump.containers,null,1));
  // Try keyboard: ArrowDown then Enter to confirm it IS a select.
  await page.keyboard.press("ArrowDown").catch(()=>{});
  await page.waitForTimeout(200);
  const focusText=await page.evaluate(()=>document.activeElement?.textContent?.trim()?.slice(0,40)||document.activeElement?.tagName);
  console.log("activeElement after ArrowDown:",focusText);
  await browser.close();server.close();
};
main().catch(e=>{console.error(e);process.exit(1);});
