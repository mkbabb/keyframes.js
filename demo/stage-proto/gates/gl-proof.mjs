import { launch, openPage, openStage, sleep } from "./lib.mjs";
// amiga is slot 1 (tier webgl). cube=0.
const b = await launch();
const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
await openStage(page);
await page.evaluate(() => { window.__stageGLLog = []; window.__stageGLContexts = 0; });
const trace = [];
async function snap(label) {
    const s = await page.evaluate(() => ({
        log: (window.__stageGLLog || []).map((e) => e.event + "@ctx" + e.contexts),
        contexts: window.__stageGLContexts,
        amigaGlLive: document.querySelector('[data-stage-card="amiga"] [data-gl-live]')?.getAttribute("data-gl-live") ?? null,
        amigaFront: document.querySelector('[data-stage-card="amiga"]')?.getAttribute("data-front"),
    }));
    trace.push({ label, ...s });
    console.log(label, JSON.stringify(s));
}

await snap("1. cube front, amiga flank (no context yet)");

// bring amiga to front
await page.evaluate(() => window.__stageDebug.spinTo(1));
// sample DURING the transit (must NOT create mid-transit)
await sleep(60);
await snap("2. amiga mid-transit (spinning — must be NO create)");
await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
await sleep(120);
await snap("3. amiga front+settled (create → 1 context, glLive)");

// leave front briefly (a fast one-step overshoot, well < 2s) then return →
// dispose is CANCELLED, context reused (no 2nd create).
await page.evaluate(() => window.__stageDebug.spinTo(0));
await sleep(250); // amiga now a flank, poster shown, dispose debounced
await snap("4. amiga left front (poster immediately, dispose debounced)");
await page.evaluate(() => window.__stageDebug.spinTo(1));
await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
await sleep(150);
await snap("5. re-front within 2s (dispose CANCELLED, no 2nd create)");

// now leave front and WAIT > 2s → dispose fires
await page.evaluate(() => window.__stageDebug.spinTo(0));
await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
await sleep(2300);
await snap("6. left front > 2s (debounced dispose fires → 0 contexts)");

const final = await page.evaluate(() => ({
    log: window.__stageGLLog,
    maxContexts: Math.max(0, ...(window.__stageGLLog || []).map((e) => e.contexts)),
}));
const creates = final.log.filter((e) => e.event === "create");
const disposes = final.log.filter((e) => e.event === "dispose");
// assertions
const noMidTransitCreate = trace[1].log.length === 0; // step 2: no create while spinning
const createdAtSettled = trace[2].log.some((l) => l.startsWith("create")); // step 3
const oneCreateOnly = creates.length === 1; // reused across the <2s overshoot
const disposedAfter2s = disposes.length === 1;
const neverExceededOne = final.maxContexts <= 1;
const pass = noMidTransitCreate && createdAtSettled && oneCreateOnly && disposedAfter2s && neverExceededOne;
console.log("\ncreates:", creates.length, "disposes:", disposes.length, "maxContexts:", final.maxContexts);
console.log("no-create-mid-transit:", noMidTransitCreate, "| created@settled:", createdAtSettled,
    "| single-create(reuse):", oneCreateOnly, "| dispose@2s:", disposedAfter2s, "| <=1 ctx:", neverExceededOne);
console.log(pass ? "\nWEBGL TIER MACHINERY: PASS" : "\nWEBGL TIER MACHINERY: FAIL");
await b.close();
process.exit(pass ? 0 : 1);
