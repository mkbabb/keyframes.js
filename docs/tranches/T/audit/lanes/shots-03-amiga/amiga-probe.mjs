// Lane 03-amiga live probe — dev server @5180, current tree.
// Measures: overlay stacking census, glide/boing two-writer race, boing-start
// rotation snap, 4200ms timer-chop teleport, frame cadence. Screenshots.
import { resolveChromium } from "/Users/mkbabb/Programming/keyframes.js/scripts/lib/demo-driver.mjs";
import fs from "node:fs";

const OUT =
    "/Users/mkbabb/Programming/keyframes.js/docs/tranches/T/audit/lanes/shots-03-amiga";
fs.mkdirSync(OUT, { recursive: true });

const chromium = resolveChromium();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://localhost:5180/#/amiga", { waitUntil: "networkidle" });
await page.waitForSelector("canvas.amiga-canvas", { timeout: 15000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}/rest-1440.png` });

// ── A. overlay stacking census ────────────────────────────────────────────
const stacking = await page.evaluate(() => {
    const sels = [".gesture-legend", ".crt-overlay", ".amiga-telemetry"];
    const root = document.querySelector(".scene-root");
    const kids = [...root.children].map((el) => el.className.split(" ")[0] || el.tagName);
    return {
        domOrder: kids,
        layers: sels.map((sel) => {
            const el = document.querySelector(sel);
            if (!el) return { sel, missing: true };
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                sel,
                zIndex: cs.zIndex,
                mixBlend: cs.mixBlendMode,
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            };
        }),
    };
});

// ── B. locate the AmigaScene instance (dev build → __vueParentComponent) ──
const found = await page.evaluate(() => {
    const root = document.querySelector(".scene-root");
    let inst = root && root.__vueParentComponent;
    while (inst && !(inst.setupState && inst.setupState.onBoing)) inst = inst.parent;
    if (!inst) return { ok: false };
    window.__amiga = inst.setupState;
    const s = inst.setupState.three.getSphere();
    return { ok: true, rot: { x: s.rotation.x, y: s.rotation.y }, pos: { x: s.position.x, y: s.position.y, z: s.position.z } };
});

// ── C. drag-flick the sphere (gentle — below FLICK_BOING 8 rad/s) ─────────
const box = await page.locator("canvas.amiga-canvas").boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2 + 40; // sphere sits slightly below vertical center (camera lifted)
await page.mouse.move(cx, cy);
await page.mouse.down();
for (let i = 1; i <= 10; i++) {
    await page.mouse.move(cx + i * 9, cy, { steps: 1 });
    await page.waitForTimeout(30);
}
await page.mouse.up();
const glideCheck = await page.evaluate(() => ({
    gliding: window.__amiga.sphereSpin.isGliding(),
    w: window.__amiga.sphereSpin.angularVelocity(),
}));

// ── D. start the rAF sampler, then boing MID-GLIDE via background double-tap ──
await page.evaluate(() => {
    const ss = window.__amiga;
    const s = ss.three.getSphere();
    window.__samples = [];
    const t0 = performance.now();
    function tick(t) {
        window.__samples.push({
            t: t - t0,
            rx: s.rotation.x,
            ry: s.rotation.y,
            px: s.position.x,
            py: s.position.y,
            pz: s.position.z,
            gliding: ss.sphereSpin.isGliding(),
            boinging: !!ss.boinging,
        });
        if (t - t0 < 7000) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
});
// background double-tap, far from the sphere (fires useDoubleTap → onBoing)
const bx = box.x + 120;
const by = box.y + box.height - 120;
await page.mouse.move(bx, by);
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(90);
await page.mouse.down(); await page.mouse.up();

await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/mid-boing-1440.png` });
await page.waitForTimeout(5200);
await page.screenshot({ path: `${OUT}/post-chop-1440.png` });

const samples = await page.evaluate(() => window.__samples);

// ── E. mobile viewport ────────────────────────────────────────────────────
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/rest-390.png` });

fs.writeFileSync(
    `${OUT}/probe-data.json`,
    JSON.stringify({ stacking, found, glideCheck, errors, samples }, null, 1),
);

// ── analysis ──────────────────────────────────────────────────────────────
const boingStart = samples.findIndex((s) => s.boinging);
const boingEnd = samples.findIndex((s, i) => i > boingStart && !s.boinging);
const pre = samples[boingStart - 1];
const first = samples[boingStart];
const overlap = samples.filter((s) => s.boinging && s.gliding);
// per-frame ry delta sign flips during overlap (two writers fighting)
let flips = 0;
let lastSign = 0;
const overlapDeltas = [];
for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    if (b.boinging && b.gliding) {
        const d = b.ry - a.ry;
        overlapDeltas.push(+d.toFixed(4));
        const sign = Math.sign(d);
        if (sign !== 0 && lastSign !== 0 && sign !== lastSign) flips++;
        if (sign !== 0) lastSign = sign;
    }
}
const lastBoing = samples[boingEnd - 1];
const afterChop = samples[boingEnd];
const frameDts = samples.slice(1).map((s, i) => s.t - samples[i].t);
const meanDt = frameDts.reduce((a, b) => a + b, 0) / frameDts.length;
const worstDt = Math.max(...frameDts);

console.log(JSON.stringify({
    stacking,
    found,
    glideCheck,
    errors: errors.slice(0, 5),
    boing: {
        boingStartIdx: boingStart,
        preBoingRot: pre && { rx: +pre.rx.toFixed(3), ry: +pre.ry.toFixed(3) },
        firstBoingRot: first && { rx: +first.rx.toFixed(3), ry: +first.ry.toFixed(3) },
        rotationSnapMagnitude: pre && first && +Math.hypot(first.rx - pre.rx, first.ry - pre.ry).toFixed(3),
        overlapFrames: overlap.length,
        overlapDeltaSignFlips: flips,
        overlapDeltasSample: overlapDeltas.slice(0, 30),
        lastBoingPos: lastBoing && { x: +lastBoing.px.toFixed(2), y: +lastBoing.py.toFixed(2), z: +lastBoing.pz.toFixed(2) },
        afterChopPos: afterChop && { x: afterChop.px, y: afterChop.py, z: afterChop.pz },
        teleportDelta: lastBoing && afterChop && +Math.hypot(afterChop.px - lastBoing.px, afterChop.py - lastBoing.py, afterChop.pz - lastBoing.pz).toFixed(2),
    },
    cadence: { meanDtMs: +meanDt.toFixed(2), worstDtMs: +worstDt.toFixed(1), frames: samples.length },
}, null, 1));

await browser.close();
