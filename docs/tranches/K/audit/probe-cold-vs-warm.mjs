// K audit — cold rainbow-play vs the choreographed (warm) path, side by side.
import { withPage, navToScene, openControlsPanel } from "../../../../scripts/lib/demo-driver.mjs";

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
const SHOTS = new URL("./screenshots-k/", import.meta.url).pathname;

// sample the REAL animated cube face transform (the .cube__face / inner) + slider + play
function sampler(page){
  return page.evaluate(()=>{
    const cube = document.querySelector(".cube");
    const faces = [...document.querySelectorAll('[class*="cube"]')];
    // find the element whose transform is non-none (the spinning inner)
    let spinT = null, spinSel = null;
    for(const el of faces){ const t=getComputedStyle(el).transform; if(t && t!=="none"){ spinT=t; spinSel=el.className; break; } }
    const slider = document.querySelector('input[type="range"], [role="slider"]');
    return {
      hash: location.hash,
      cubeT: cube?getComputedStyle(cube).transform:null,
      spinT, spinSel,
      slider: slider ? (slider.getAttribute("aria-valuenow") ?? slider.value ?? null) : null,
      vivid: !!document.querySelector(".rainbow-vivid"),
      // is the group reporting started? read the dock label / pause icon presence
      pauseIcons: document.querySelectorAll('svg.lucide-pause, [class*="pause" i]').length,
    };
  });
}

async function series(page, label, n=12, dt=120){
  const out=[];
  for(let i=0;i<n;i++){ await sleep(dt); out.push({t:(i+1)*dt, ...(await sampler(page))}); }
  const dCube=new Set(out.map(s=>s.cubeT)).size;
  const dSpin=new Set(out.map(s=>s.spinT)).size;
  const dSlider=new Set(out.map(s=>s.slider)).size;
  return {label, dCube, dSpin, dSlider, vividEver: out.some(s=>s.vivid), sample: out[out.length-1]};
}

await withPage({ context:{viewport:{width:1440,height:900}}, label:"cold-vs-warm" }, async (page,{url})=>{
  const log=[];

  // ── COLD: fresh, hero rainbow play ──
  await page.goto(url+"#/", {waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.clear());
  await page.goto(url+"#/", {waitUntil:"networkidle"});
  await sleep(700);
  // click the bottom rainbow play
  const click = await page.evaluate(()=>{
    const r=[...document.querySelectorAll("button")].filter(b=>b.className.includes("rainbow"));
    let best=-1,t=null; for(const b of r){const k=b.getBoundingClientRect(); if(k.width>best){best=k.width;t=b;}}
    const k=t.getBoundingClientRect(); return {x:k.x+k.width/2,y:k.y+k.height/2};
  });
  await page.mouse.move(click.x,click.y); await page.mouse.down(); await sleep(40); await page.mouse.up();
  const cold = await series(page, "COLD-rainbow");
  log.push("COLD: "+JSON.stringify(cold));
  await page.screenshot({path:SHOTS+"cold-cube-2s.png"});

  // ── WARM: reload fresh, choreograph via openControlsPanel (the gate's path) ──
  await page.goto(url+"#/", {waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.clear());
  await page.goto(url+"#/", {waitUntil:"networkidle"});
  await sleep(500);
  await navToScene(page, "cube", undefined, {timeout:8000}).catch(e=>log.push("navToScene err "+e.message));
  await openControlsPanel(page).catch(e=>log.push("openControls err "+e.message));
  await sleep(400);
  // now press the rainbow play
  const click2 = await page.evaluate(()=>{
    const r=[...document.querySelectorAll("button")].filter(b=>b.className.includes("rainbow"));
    let best=-1,t=null; for(const b of r){const k=b.getBoundingClientRect(); if(k.width>best){best=k.width;t=b;}}
    if(!t) return null; const k=t.getBoundingClientRect(); return {x:k.x+k.width/2,y:k.y+k.height/2};
  });
  if(click2){ await page.mouse.move(click2.x,click2.y); await page.mouse.down(); await sleep(40); await page.mouse.up(); }
  const warm = await series(page, "WARM-choreographed");
  log.push("WARM: "+JSON.stringify(warm));
  await page.screenshot({path:SHOTS+"warm-cube-2s.png"});

  console.log(log.join("\n"));
});
