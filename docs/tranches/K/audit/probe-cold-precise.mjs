// K audit — precise cold-play probe: read the ANIMATED container transform + the
// transport slider. Cube cold, then square cold, then easing/spring/sequence cold.
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
const SHOTS = new URL("./screenshots-k/", import.meta.url).pathname;

function sample(page){
  return page.evaluate(()=>{
    // the animated container: the element with apply-transform-to-container, i.e.
    // the orbital-drag wrapper holding the live matrix3d. Find the deepest non-none
    // transform that is NOT a static cube face/side.
    const all=[...document.querySelectorAll("*")];
    let liveT=null, liveSel=null;
    for(const el of all){
      const cl=(el.className&&el.className.baseVal!==undefined)?el.className.baseVal:(""+(el.className||""));
      if(/cube-side|rainbow|icon|lucide/.test(cl)) continue;
      const t=getComputedStyle(el).transform;
      if(t&&t!=="none"&&t.startsWith("matrix")){
        // skip identity-ish
        liveT=t; liveSel=cl.slice(0,40); // keep last (deepest) match? take container with 'cube'/'orbital'/'graph'
      }
    }
    const slider=document.querySelector('input[type="range"], [role="slider"]');
    return {
      hash:location.hash,
      slider: slider?(slider.getAttribute("aria-valuenow")??slider.value??null):null,
      vivid:!!document.querySelector(".rainbow-vivid"),
      // collect ALL non-none transforms briefly to see motion
      box: (()=>{ const b=document.querySelector(".demo-box"); return b?getComputedStyle(b).transform:null; })(),
      ball: (()=>{ const b=document.querySelector(".progress-ball,.hero-ball,.seq-ball"); return b?getComputedStyle(b).transform:null; })(),
    };
  });
}

async function coldPlay(page,url,route,sampleSel){
  await page.goto(url+"#/", {waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.clear());
  await page.goto(url+"#"+route, {waitUntil:"networkidle"});
  await sleep(900);
  // press the bottom rainbow play (the user's cold gesture)
  const click=await page.evaluate(()=>{
    const r=[...document.querySelectorAll("button")].filter(b=>(""+b.className).includes("rainbow"));
    let best=-1,t=null; for(const b of r){const k=b.getBoundingClientRect(); if(k.width>0&&k.width>=best){best=k.width;t=b;}}
    if(!t) return null; const k=t.getBoundingClientRect(); return {x:k.x+k.width/2,y:k.y+k.height/2,w:k.width,n:r.length};
  });
  let out=[];
  if(click){ await page.mouse.move(click.x,click.y); await page.mouse.down(); await sleep(40); await page.mouse.up(); }
  for(let i=0;i<14;i++){ await sleep(130); out.push({t:(i+1)*130,...(await sample(page))}); }
  const dSlider=new Set(out.map(s=>s.slider)).size;
  const dBox=new Set(out.map(s=>s.box)).size;
  const dBall=new Set(out.map(s=>s.ball)).size;
  return {route, click, vividEver:out.some(s=>s.vivid), dSlider, dBox, dBall, sliders:out.map(s=>s.slider).filter((v,i,a)=>i===0||a[i-1]!==v).slice(0,6), last:out[out.length-1]};
}

await withPage({context:{viewport:{width:1440,height:900}},label:"cold-precise"}, async (page,{url})=>{
  const log=[];
  for(const route of ["/","/square","/easing","/spring","/sequence"]){
    const r=await coldPlay(page,url,route);
    log.push(route+": "+JSON.stringify(r));
    await page.screenshot({path:SHOTS+"coldp"+route.replace(/\//g,"_")+".png"});
  }
  console.log(log.join("\n"));
});
