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
 * GREEN: CLS 0, stage-cell Δ 0 px on every frame, dt p95 <= 20 ms, no frame > 33 ms.
 * Frames per cell: PEEK, mid-glide, OPEN.
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
        const x = hb.x + hb.width / 2;
        const drag = async (y0, y1) => {
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: y0 }] });
            for (let i = 1; i <= 16; i++)
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: w > h ? x - ((y0 - y1) * i) / 16 : x, y: w > h ? y0 : y0 + ((y1 - y0) * i) / 16 }] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        };
        const start = hb.y + hb.height / 2;
        // Portrait: drag up by a third of the viewport; landscape side sheet: drag left.
        const reach = w > h ? w * 0.15 : h * 0.3;
        await drag(start, start - reach);
        await page.waitForTimeout(140);
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-mid.png`) });
        await page.waitForTimeout(1200);
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-open.png`) });
        const ob = await handle.boundingBox();
        const opened = ob && (w > h ? ob.x < hb.x - 4 : ob.y < hb.y - 4);
        await drag(ob.y + ob.height / 2, ob.y + ob.height / 2 + reach);
        await page.waitForTimeout(1200);
        const r = await page.evaluate(() => {
            window.__glide.on = false;
            const { t, rects } = window.__glide;
            const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b);
            const q = (p) => +d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
            const r0 = rects[0];
            const delta = Math.max(...rects.map((r) => Math.max(...r.map((v, i) => Math.abs(v - r0[i])))));
            return { frames: d.length, p50: q(0.5), p95: q(0.95), max: q(1), cls: +window.__cls.toFixed(4), rectDelta: +delta.toFixed(2) };
        });
        cells.push({ id, opened, ...r });
        if (!opened) fails.push(`${id}: the drag did not open the sheet`);
        if (r.cls > 0) fails.push(`${id}: CLS ${r.cls}`);
        if (r.rectDelta > 0) fails.push(`${id}: stage-cell rect moved ${r.rectDelta} px`);
        if (r.p95 > 20) fails.push(`${id}: dt p95 ${r.p95} ms`);
        if (r.max > 33) fails.push(`${id}: a frame of ${r.max} ms`);
        await page.close();
    } finally {
        await ctx.close();
    }
}

const browser = await chromium.launch();
try {
    if (SHOTS) mkdirSync(SHOTS, { recursive: true });
    for (const [w, h] of [[390, 844], [844, 390]])
        for (const scene of ["cube", "spring"])
            try {
                await cell(browser, scene, w, h);
            } catch (e) {
                fails.push(`${scene}@${w}x${h}: probe error ${String(e).split("\n")[0].slice(0, 160)}`);
            }
} finally {
    await browser.close();
}
const json = JSON.stringify({ base: BASE, at: new Date().toISOString(), fails, cells }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(fails.length ? `RED ${fails.length}\n${fails.join("\n")}` : `GREEN (${cells.length} cells)`);
process.exitCode = fails.length ? 1 : 0;
