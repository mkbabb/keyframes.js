// SERVED MODEL: claude-opus-5-5
/**
 * value.js X realization K-D4 (KF-M-O2) — THE SHEET GLIDE, TRACED.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 20 -- node scripts/probe/kf-sheet-glide.mjs \
 *       --base https://keyframes.babb.dev/ --out ~/.dev-logs/x-realize/kf/kd4/r1.json --shots DIR
 *
 * One browser, one context per cell (390x844 and 844x390 × cube and spring),
 * closed in `finally`. Motion allowed (the glide is the subject). The gesture:
 * a touch drag of the sheet's grab handle from PEEK to OPEN, settle, then
 * back. Throughout it records:
 *   - layout shifts (PerformanceObserver `layout-shift`, buffered) → CLS;
 *   - the rAF dt series → p95 and max;
 *   - the stage CELL's layout rect every frame (the glide is a compositor
 *     translate + scale on `.stage-glide`, so the cell's own box must not move).
 * GREEN: CLS 0, stage-cell Δ 0 px on every frame, dt p95 <= 20 ms, no frame > 33 ms;
 * and the trace has its subject: the drag rests on the OPEN rung (the one rung
 * with a lift), the subject glides there, and the return rests on PEEK.
 * Frames per cell: PEEK, mid-glide, OPEN.
 *
 * K-D4.r1 — THE FRAME CLOCK IS READ ON THE GPU. The browser is the default
 * headless shell with ANGLE-Metal (the named GPU witness of
 * scripts/observe/demo/swap-3d.mjs); a software renderer exits 2 and never
 * passes vacuously. Under the shell's software default the display
 * compositor draws every frame on the CPU (viz SoftwareRenderer, 15–18
 * render passes, 60–72 quads): at 390x844 the opening bottom sheet's
 * backdrop grows those draws to 11–16.5 ms against the 8.3 ms vsync, so
 * the dt series dropped 2–3 vsyncs at host load and read RED in portrait
 * only (the side sheet's draws peak at 7.2 ms). The main thread stayed
 * 4–8 ms in those frames. On ANGLE-Metal the same draws read p50 0.6 ms.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (n, d) => {
    const i = process.argv.indexOf(`--${n}`);
    return i > 0 ? process.argv[i + 1] : d;
};
const BASE = arg("base", "https://keyframes.babb.dev/").replace(/\/?$/, "/");
const OUT = arg("out", null);
const SHOTS = arg("shots", null);
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const fails = [];
const cells = [];

async function cell(browser, scene, w, h) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, reducedMotion: "no-preference", colorScheme: "dark" });
    try {
        const page = await ctx.newPage();
        await page.addInitScript(() => {
            window.__cls = 0;
            new PerformanceObserver((l) => {
                for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
            }).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto(`${BASE}#/${scene}`, { waitUntil: "load", timeout: 30000 });
        await page.waitForSelector(".stage-cell", { timeout: 15000 });
        await page.waitForTimeout(3000);
        const handle = page.locator('[data-slot="sheet-detent-handle"]').first();
        const hb = await handle.boundingBox();
        if (!hb) throw new Error("no sheet handle");
        const id = `${scene}@${w}x${h}`;
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-peek.png`) });
        await page.evaluate(() => {
            window.__cls = 0; // the trace measures the gesture, not the boot
            const cellEl = document.querySelector(".stage-cell");
            const S = (window.__glide = { t: [], rects: [], on: true });
            const f = (t) => {
                if (!S.on) return;
                S.t.push(t);
                const r = cellEl.getBoundingClientRect();
                S.rects.push([r.left, r.top, r.width, r.height]);
                requestAnimationFrame(f);
            };
            requestAnimationFrame(f);
        });
        const cdp = await ctx.newCDPSession(page);
        const land = w > h;
        // A finger's pace: 16 moves a frame apart, then a hold before the
        // lift, so the sheet lands on the NEAREST rung (glass projects a
        // fling's velocity; back-to-back CDP moves flung it past OPEN to FULL,
        // where the lift is 0 and the glide never ran).
        const drag = async (p0, d) => {
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [p0] });
            for (let i = 1; i <= 16; i++) {
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [land ? { x: p0.x + (d * i) / 16, y: p0.y } : { x: p0.x, y: p0.y + (d * i) / 16 }] });
                await page.waitForTimeout(16);
            }
            await page.waitForTimeout(160);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        };
        const centre = (b) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
        const rungOf = () => page.evaluate(() => document.querySelector(".controls-drawer-content")?.dataset.rung ?? null);
        const subject = () => page.evaluate(() => { const r = document.querySelector(".stage-glide").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
        const s0 = await subject();
        // Portrait: up by the OPEN lift; the landscape side sheet: left by it
        // (OPEN − PEEK of the rung ladder, 0.36 → 0.46 of the width, and the
        // portrait row-boundary PEEK → 0.36 of the height).
        const reach = land ? w * 0.1 : h * 0.14;
        await drag(centre(hb), -reach);
        await page.waitForTimeout(140);
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-mid.png`) });
        await page.waitForTimeout(1200);
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-open.png`) });
        const rungOpen = await rungOf();
        const s1 = await subject();
        const glide = +Math.max(...s1.map((v, i) => Math.abs(v - s0[i]))).toFixed(1);
        const ob = await handle.boundingBox();
        await drag(centre(ob), reach);
        await page.waitForTimeout(1200);
        const rungBack = await rungOf();
        const r = await page.evaluate(() => {
            window.__glide.on = false;
            const { t, rects } = window.__glide;
            const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b);
            const q = (p) => +d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
            const r0 = rects[0];
            const delta = Math.max(...rects.map((r) => Math.max(...r.map((v, i) => Math.abs(v - r0[i])))));
            return { frames: d.length, p50: q(0.5), p95: q(0.95), max: q(1), cls: +window.__cls.toFixed(4), rectDelta: +delta.toFixed(2) };
        });
        cells.push({ id, rungOpen, rungBack, glide, ...r });
        // The subject of the trace is the glide: the sheet must rest on OPEN
        // (the one rung with a lift), the subject must have moved on the
        // compositor, and the sheet must come back to PEEK.
        if (rungOpen !== "open") fails.push(`${id}: the drag rested on ${rungOpen}, not open`);
        if (!(glide > 1)) fails.push(`${id}: the subject did not glide (${glide} px)`);
        if (rungBack !== "peek") fails.push(`${id}: the return rested on ${rungBack}, not peek`);
        if (r.cls > 0) fails.push(`${id}: CLS ${r.cls}`);
        if (r.rectDelta > 0) fails.push(`${id}: stage-cell rect moved ${r.rectDelta} px`);
        if (r.p95 > 20) fails.push(`${id}: dt p95 ${r.p95} ms`);
        if (r.max > 33) fails.push(`${id}: a frame of ${r.max} ms`);
        await page.close();
    } finally {
        await ctx.close();
    }
}

const browser = await chromium.launch({ args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
let renderer = null;
class NoGpu extends Error {}
try {
    if (SHOTS) mkdirSync(SHOTS, { recursive: true });
    const probe = await browser.newPage();
    renderer = await probe.evaluate(() => {
        const gl = document.createElement("canvas").getContext("webgl2");
        const x = gl?.getExtension("WEBGL_debug_renderer_info");
        return x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : null;
    });
    await probe.close();
    if (!renderer || /SwiftShader|software/i.test(renderer)) throw new NoGpu();
    for (const [w, h] of [[390, 844], [844, 390]])
        for (const scene of ["cube", "spring"])
            try {
                await cell(browser, scene, w, h);
            } catch (e) {
                fails.push(`${scene}@${w}x${h}: probe error ${String(e).split("\n")[0].slice(0, 160)}`);
            }
} catch (e) {
    if (!(e instanceof NoGpu)) throw e;
    console.error(`kf-sheet-glide — no GPU renderer (${renderer}); the frame clock is not read on software`);
    process.exitCode = 2;
} finally {
    await browser.close();
}
if (process.exitCode === 2) process.exit();
const json = JSON.stringify({ base: BASE, renderer, at: new Date().toISOString(), fails, cells }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(fails.length ? `RED ${fails.length}\n${fails.join("\n")}` : `GREEN (${cells.length} cells)`);
process.exitCode = fails.length ? 1 : 0;
