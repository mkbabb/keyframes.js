import { createRequire } from "module";
import { openPage, openStage, sleep } from "./lib.mjs";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
const { chromium } = req("playwright-core");
// Real GPU (Apple M5 Max via ANGLE/Metal) — headless SwiftShader software raster
// is NOT representative for a backdrop-filter/blur/mix-blend compositing stack.
const b = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const { page, errors } = await openPage(b, { theme: "dark", hash: "#cube", width: 1440, height: 900 });
await openStage(page);
await sleep(250);

async function measure(label) {
    return page.evaluate(async () => {
        const F = { deltas: [], loafScript: [], loafTotal: [], running: true };
        let last = performance.now();
        const loop = (t) => { F.deltas.push(t - last); last = t; if (F.running) requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
        let po;
        try {
            po = new PerformanceObserver((l) => {
                for (const e of l.getEntries()) {
                    F.loafTotal.push(Math.round(e.duration));
                    const s = (e.scripts || []).reduce((a, x) => a + x.duration, 0);
                    F.loafScript.push(Math.round(s));
                }
            });
            po.observe({ type: "long-animation-frame", buffered: false });
        } catch {}
        const seq = [4, 0, 6, 2, 7, 1, 5];
        for (const s of seq) { window.__stageDebug.spinTo(s); await new Promise((r) => setTimeout(r, 300)); }
        F.running = false;
        await new Promise((r) => setTimeout(r, 40));
        if (po) po.disconnect();
        const d = F.deltas.slice(3);
        const avg = d.reduce((a, x) => a + x, 0) / d.length, max = Math.max(...d);
        const sorted = [...d].sort((a, b) => a - b);
        return {
            frames: d.length,
            avgFps: +(1000 / avg).toFixed(1),
            minFps: +(1000 / max).toFixed(1),
            medianFrameMs: +sorted[Math.floor(sorted.length * 0.5)].toFixed(2),
            maxFrameMs: +max.toFixed(2),
            framesOver50ms: d.filter((x) => x > 50).length,
            // LoAF scripting attribution (the <8ms scripting budget lives here):
            maxLoafScriptMs: F.loafScript.length ? Math.max(...F.loafScript) : 0,
            loafFrames: F.loafTotal.length,
        };
    });
}

const normal = await measure("normal");
console.log("A) NORMAL (full compositing stack, Apple M5 Max GPU via ANGLE-Metal, headless):");
console.log(JSON.stringify(normal, null, 1));

// Neutralise the GPU-cheap-but-CPU-expensive compositing (backdrop-filter, blur,
// mix-blend) — on real hardware these composite on the GPU; in SwiftShader they
// are software-rasterised. If fps jumps, the deficit is compositing, not JS.
await page.addStyleTag({
    content: `.scene-stage, .scene-stage * { backdrop-filter: none !important; }
      .stage-beam, .stage-pool, .stage-card__keywash, .stage-card__specular { mix-blend-mode: normal !important; filter: none !important; }
      .stage-card { filter: none !important; }`,
});
await sleep(120);
const lite = await measure("lite");
console.log("\nB) COMPOSITING-NEUTRALISED (backdrop-filter/blur/mix-blend off — the JS + layout cost alone):");
console.log(JSON.stringify(lite, null, 1));

console.log("\nInterpretation: LoAF max scripting/frame =", normal.maxLoafScriptMs, "ms (budget <8ms).");
console.log("fps normal", normal.avgFps, "→ lite", lite.avgFps, "(delta =", (lite.avgFps - normal.avgFps).toFixed(1), "fps from compositing alone).");
console.log("errors:", errors);
await b.close();
