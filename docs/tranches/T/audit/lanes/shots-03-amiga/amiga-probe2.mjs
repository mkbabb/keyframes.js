// Control: pure double-tap boing from REST (no glide) — leaf types + visibility.
import { resolveChromium } from "/Users/mkbabb/Programming/keyframes.js/scripts/lib/demo-driver.mjs";
import fs from "node:fs";
const OUT =
    "/Users/mkbabb/Programming/keyframes.js/docs/tranches/T/audit/lanes/shots-03-amiga";
const chromium = resolveChromium();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:5180/#/amiga", { waitUntil: "networkidle" });
await page.waitForSelector("canvas.amiga-canvas", { timeout: 15000 });
await page.waitForTimeout(2500);
await page.evaluate(() => {
    const root = document.querySelector(".scene-root");
    let inst = root.__vueParentComponent;
    while (inst && !(inst.setupState && inst.setupState.onBoing)) inst = inst.parent;
    window.__amiga = inst.setupState;
    const s = inst.setupState.three.getSphere();
    window.__samples = [];
    const t0 = performance.now();
    (function tick(t) {
        window.__samples.push({
            t: t - t0,
            rxT: typeof s.rotation.x,
            ryT: typeof s.rotation.y,
            rxStr: String(s.rotation.x).slice(0, 24),
            qw: s.quaternion.w,
            boinging: !!inst.setupState.boinging,
        });
        if (t - t0 < 3500) requestAnimationFrame(tick);
    })(performance.now());
});
const box = await page.locator("canvas.amiga-canvas").boundingBox();
const bx = box.x + 120, by = box.y + box.height - 140;
await page.mouse.move(bx, by);
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(90);
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/pure-boing-1440.png` });
await page.waitForTimeout(1800);
const samples = await page.evaluate(() => window.__samples);
const b = samples.filter((s) => s.boinging);
const nanQ = b.filter((s) => !Number.isFinite(s.qw)).length;
console.log(JSON.stringify({
    boingFrames: b.length,
    types: [...new Set(b.map((s) => s.rxT + "/" + s.ryT))],
    rxExamples: [...new Set(b.slice(0, 40).map((s) => s.rxStr))].slice(0, 6),
    nanQuaternionFrames: nanQ,
}, null, 1));
await browser.close();
