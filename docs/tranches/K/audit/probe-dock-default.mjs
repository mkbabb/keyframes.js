// K audit — U-K1: is the bottom TransportDock SHRUNKEN by default (no hover)?
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
const SHOTS=new URL("./screenshots-k/",import.meta.url).pathname;

await withPage({context:{viewport:{width:1440,height:900}},label:"dock-default"}, async (page,{url})=>{
  const log=[];
  await page.goto(url+"#/",{waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.clear());
  await page.goto(url+"#/cube",{waitUntil:"networkidle"});
  await sleep(1000);
  // move mouse far from the dock so no hover-expand
  await page.mouse.move(20,20);
  await sleep(600);
  const state=await page.evaluate(()=>{
    // the bottom dock: find GlassDock host near the bottom
    const docks=[...document.querySelectorAll('[class*="dock" i]')].map(d=>{
      const r=d.getBoundingClientRect();
      return {cls:(""+d.className).slice(0,60), x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height), bottom: r.y>window.innerHeight*0.6};
    }).filter(d=>d.w>0&&d.h>0);
    // collapsed pill vs expanded: count visible transport buttons in the bottom region
    const btns=[...document.querySelectorAll("button")].filter(b=>{const r=b.getBoundingClientRect(); return r.y>window.innerHeight*0.8 && r.width>0;});
    const collapsed=document.querySelector('[class*="collapsed" i],[data-state="collapsed"]');
    const expandedLayer=[...document.querySelectorAll('[class*="dock-layer" i],[class*="layer" i]')].map(e=>({c:(""+e.className).slice(0,40),vis:getComputedStyle(e).visibility,op:getComputedStyle(e).opacity}));
    return {docks, bottomBtnCount:btns.length, hasCollapsedNode:!!collapsed, expandedLayer};
  });
  log.push("DOCK STATE (no hover): "+JSON.stringify(state,null,0));
  await page.screenshot({path:SHOTS+"dock-default-nohover.png", clip:{x:400,y:740,width:640,height:160}});
  console.log(log.join("\n"));
});
