// K audit — trace the cold home->cube PLAY handoff: does the group ever start()?
// Read the live AnimationGroup state off the cube scene after the cold gesture.
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

await withPage({context:{viewport:{width:1440,height:900}},label:"trace-cold"}, async (page,{url})=>{
  const log=[];
  page.on("console", m=>{ const t=m.text(); if(/PLAY|NAVIGATE|autoplay|started|SCENE_READY|markSceneReady/i.test(t)) log.push("C> "+t); });

  await page.goto(url+"#/", {waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.clear());
  await page.goto(url+"#/", {waitUntil:"networkidle"});
  await sleep(800);

  // Probe: read the machine localStorage + any global group state we can reach.
  const pre = await page.evaluate(()=>{
    const ls={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); ls[k]=localStorage.getItem(k).slice(0,120);}
    return {hash:location.hash, ls};
  });
  log.push("PRE ls keys: "+Object.keys(pre.ls).join(", "));
  log.push("PRE machine: "+(pre.ls["keyframes-js-scene-machine"]||"(none)"));

  // cold click
  const click=await page.evaluate(()=>{
    const r=[...document.querySelectorAll("button")].filter(b=>(""+b.className).includes("rainbow"));
    let best=-1,t=null; for(const b of r){const k=b.getBoundingClientRect(); if(k.width>=best){best=k.width;t=b;}}
    const k=t.getBoundingClientRect(); return {x:k.x+k.width/2,y:k.y+k.height/2};
  });
  await page.mouse.move(click.x,click.y); await page.mouse.down(); await sleep(40); await page.mouse.up();
  await sleep(1500);

  // After: read the machine snapshot + whether the cube container has a live transform
  const post = await page.evaluate(()=>{
    const ls=localStorage.getItem("keyframes-js-scene-machine");
    // find the orbital/cube container with a matrix3d transform
    let containerT=null;
    const cube=document.querySelector(".cube");
    if(cube){ let p=cube.parentElement; for(let i=0;i<4&&p;i++){ const t=getComputedStyle(p).transform; if(t&&t.startsWith("matrix3d")){containerT=t;break;} p=p.parentElement; } }
    const slider=document.querySelector('[role="slider"],input[type=range]');
    return {hash:location.hash, machine:ls?ls.slice(0,300):null, containerT, slider:slider?(slider.getAttribute("aria-valuenow")??slider.value):null, vivid:!!document.querySelector(".rainbow-vivid")};
  });
  log.push("POST hash="+post.hash+" slider="+post.slider+" vivid="+post.vivid);
  log.push("POST containerT="+post.containerT);
  log.push("POST machine="+post.machine);

  // Now: does a SECOND click on the (now-cube) play start it?
  const click2=await page.evaluate(()=>{
    const r=[...document.querySelectorAll("button")].filter(b=>(""+b.className).includes("rainbow"));
    let best=-1,t=null; for(const b of r){const k=b.getBoundingClientRect(); if(k.width>0&&k.width>=best){best=k.width;t=b;}}
    if(!t)return null;const k=t.getBoundingClientRect(); return {x:k.x+k.width/2,y:k.y+k.height/2};
  });
  if(click2){ await page.mouse.move(click2.x,click2.y); await page.mouse.down(); await sleep(40); await page.mouse.up(); }
  await sleep(1200);
  const post2=await page.evaluate(()=>{
    const slider=document.querySelector('[role="slider"],input[type=range]');
    return {slider:slider?(slider.getAttribute("aria-valuenow")??slider.value):null, vivid:!!document.querySelector(".rainbow-vivid")};
  });
  log.push("AFTER 2nd click slider="+post2.slider+" vivid="+post2.vivid+"  <-- if this plays, the COLD first click was lost");

  console.log(log.join("\n"));
});
