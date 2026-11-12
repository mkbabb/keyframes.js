// SERVED MODEL: claude-opus-5-5
/**
 * kf-swap-frames — owner-1112 item 6: the frame-time trace across every scene
 * swap the scene picker offers (every ordered pair of Home, Cube, Amiga,
 * Square, Easing, Spring, Sequence), at 1440x900.
 *
 * A browser run through the guard, never --light, timing-sensitive:
 *   ~/.claude/guard/guarded --cpu-cores 0 --timeout 30 -- node scripts/probe/kf-swap-frames.mjs \
 *       (--dist dist/gh-pages | --base https://keyframes.babb.dev/) --out FILE.json \
 *       [--rate 1|4] [--gpu] [--passes 2] [--trace cube>amiga,home>easing --trace-dir DIR]
 *
 * The tour is an Eulerian circuit of the complete directed graph on the seven
 * scenes, so each ordered pair is one hop. Pass 1 is the cold tour (each
 * scene's first entry of the load); pass 2 repeats it warm. Each hop records
 * the rAF frame intervals from the hash change to +1500 ms (max, p95, count
 * over 33.4 ms) and the long animation frames in that window with their script
 * attribution, and the Amiga hop also records when the room's first frame was
 * armed against the transition's end (`aria-busy` on the canvas).
 *
 * One browser, one context, both closed in `finally`; the loopback server is
 * stopped on exit.
 */
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const arg = (n, d) => {
    const i = process.argv.indexOf(`--${n}`);
    return i > 0 ? process.argv[i + 1] : d;
};
const flag = (n) => process.argv.includes(`--${n}`);
const OUT = arg("out", null);
const RATE = Number(arg("rate", "1"));
const PASSES = Number(arg("passes", "2"));
const TRACE = new Set((arg("trace", "") || "").split(",").filter(Boolean));
const TRACE_DIR = arg("trace-dir", null);
const GPU = flag("gpu");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff2": "font/woff2",
};
function serve(dir) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
            const p = path.join(dir, u.endsWith("/") ? u + "index.html" : u);
            if (!p.startsWith(dir) || !existsSync(p) || statSync(p).isDirectory()) return res.writeHead(404).end();
            res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
            createReadStream(p).pipe(res);
        });
        server.listen(0, "127.0.0.1", () =>
            resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise((r) => server.close(r)) }),
        );
    });
}

const SCENES = ["home", "cube", "amiga", "square", "easing", "spring", "sequence"];
const hashOf = (s) => (s === "home" ? "#/" : `#/${s}`);

/** An Eulerian circuit of the complete digraph on SCENES (Hierholzer). */
function circuit() {
    const out = new Map(SCENES.map((s) => [s, SCENES.filter((t) => t !== s)]));
    const stack = ["home"];
    const tour = [];
    while (stack.length) {
        const v = stack.at(-1);
        const next = out.get(v);
        if (next.length) stack.push(next.shift());
        else tour.push(stack.pop());
    }
    return tour.reverse();
}

const INIT = () => {
    const raf = window.requestAnimationFrame.bind(window);
    const frames = (window.__swapFrames = []);
    const tick = (ts) => {
        frames.push(performance.now());
        if (frames.length > 40000) frames.splice(0, 20000);
        raf(tick);
    };
    raf(tick);
    window.__swapLoaf = [];
    try {
        new PerformanceObserver((l) => {
            for (const e of l.getEntries())
                window.__swapLoaf.push({
                    s: +e.startTime.toFixed(1),
                    d: +e.duration.toFixed(1),
                    block: +e.blockingDuration.toFixed(1),
                    render: +(e.renderStart ? e.startTime + e.duration - e.renderStart : 0).toFixed(1),
                    style: +(e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0).toFixed(1),
                    scripts: e.scripts.map((s) => ({
                        d: +s.duration.toFixed(1),
                        inv: s.invoker,
                        type: s.invokerType,
                        src: (s.sourceURL || "").split("/").pop() + (s.sourceFunctionName ? `:${s.sourceFunctionName}` : ""),
                        layout: +(s.forcedStyleAndLayoutDuration ?? 0).toFixed(1),
                    })),
                });
        }).observe({ type: "long-animation-frame", buffered: true });
    } catch {}
    // The Amiga room's arrival against the swap's end.
    window.__swapMarks = [];
    const mo = new MutationObserver(() => {
        const c = document.querySelector("canvas.amiga-canvas");
        const busy = c ? c.getAttribute("aria-busy") === "true" : null;
        const vt = document.documentElement.matches(":active-view-transition");
        const last = window.__swapMarks.at(-1);
        if (!last || last.busy !== busy) window.__swapMarks.push({ t: performance.now(), busy, vt });
    });
    addEventListener("DOMContentLoaded", () =>
        mo.observe(document.body, { subtree: true, attributes: true, childList: true, attributeFilter: ["aria-busy"] }),
    );
    // When each view transition ends.
    window.__vtEnds = [];
    const start = document.startViewTransition?.bind(document);
    if (start)
        document.startViewTransition = (...a) => {
            const t = start(...a);
            const at = performance.now();
            // the Amiga's room at the cross-fade's first frame: its render
            // surface is in the document and the stage is not booting
            const room = () => {
                const surface = document.querySelector("canvas.amiga-surface");
                const subject = document.querySelector("canvas.amiga-canvas");
                return subject ? { surface: !!surface?.isConnected, busy: subject.getAttribute("aria-busy") === "true", skeleton: !!document.querySelector(".amiga-skeleton") } : null;
            };
            let ready = null;
            t.ready.then(() => (ready = { t: performance.now(), room: room() })).catch(() => {});
            t.finished.finally(() => window.__vtEnds.push({ start: at, end: performance.now(), ready, endRoom: room() }));
            return t;
        };
};

const pct = (xs, q) => (xs.length ? xs[Math.min(xs.length - 1, Math.floor(q * xs.length))] : null);

const server = arg("dist", null) ? await serve(path.resolve(arg("dist"))) : null;
const base = server ? server.url : arg("base");
const browser = await chromium.launch({
    headless: true,
    args: GPU ? ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] : [],
});
const report = { base, rate: RATE, gpu: GPU, load1: +os.loadavg()[0].toFixed(1), at: new Date().toISOString(), passes: [] };
try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "dark", reducedMotion: "no-preference" });
    await context.addInitScript(INIT);
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await page.goto(`${base}${hashOf("home")}`, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    report.renderer = await page.evaluate(() => {
        const gl = document.createElement("canvas").getContext("webgl2");
        const ext = gl?.getExtension("WEBGL_debug_renderer_info");
        return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null;
    });
    if (RATE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: RATE });
    const tour = circuit();
    for (let pass = 1; pass <= PASSES; pass++) {
        const hops = [];
        for (let i = 1; i < tour.length; i++) {
            const from = tour[i - 1], to = tour[i];
            const tracing = TRACE.has(`${from}>${to}`) && pass === PASSES && TRACE_DIR;
            if (tracing) {
                await cdp.send("Tracing.start", {
                    transferMode: "ReturnAsStream",
                    traceConfig: {
                        includedCategories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "v8.execute", "blink", "gpu", "viz", "disabled-by-default-v8.cpu_profiler"],
                    },
                });
                // the profiler's start lands on the main thread as one long
                // interrupt: let it pass before the swap under test
                await page.waitForTimeout(500);
            }
            const t0 = await page.evaluate((h) => {
                const now = performance.now();
                location.hash = h;
                return now;
            }, hashOf(to));
            await page.waitForTimeout(1900);
            if (tracing) {
                const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
                await cdp.send("Tracing.end");
                const { stream } = await done;
                let data = "";
                for (;;) {
                    const { data: chunk, eof } = await cdp.send("IO.read", { handle: stream });
                    data += chunk;
                    if (eof) break;
                }
                await cdp.send("IO.close", { handle: stream });
                mkdirSync(TRACE_DIR, { recursive: true });
                writeFileSync(path.join(TRACE_DIR, `trace-${from}-${to}-${RATE}x.json`), data);
            }
            const w = await page.evaluate((t0) => {
                const f = window.__swapFrames.filter((t) => t >= t0 - 20 && t <= t0 + 1500);
                const iv = f.slice(1).map((t, i) => +(t - f[i]).toFixed(1));
                const loaf = window.__swapLoaf.filter((e) => e.s >= t0 - 20 && e.s <= t0 + 1500);
                const vt = window.__vtEnds.filter((v) => v.start >= t0 - 20).at(0) ?? null;
                const marks = window.__swapMarks.filter((m) => m.t >= t0 - 20).map((m) => ({ t: +(m.t - t0).toFixed(0), busy: m.busy, vt: m.vt }));
                // the longest interval and where it sits relative to t0
                let at = 0;
                iv.forEach((x, i) => { if (x > iv[at]) at = i; });
                return { iv, loaf, vt: vt ? { start: +(vt.start - t0).toFixed(0), end: +(vt.end - t0).toFixed(0), ready: vt.ready ? +(vt.ready.t - t0).toFixed(0) : null, roomAtReady: vt.ready?.room ?? null } : null, marks, maxAt: f.length > 1 ? +(f[at] - t0).toFixed(0) : null };
            }, t0);
            const sorted = [...w.iv].sort((a, b) => a - b);
            hops.push({
                pair: `${from}>${to}`,
                frames: w.iv.length,
                max: sorted.at(-1) ?? null,
                maxAt: w.maxAt,
                p95: pct(sorted, 0.95),
                over33: w.iv.filter((x) => x > 33.4).length,
                long: w.iv.filter((x) => x > 33.4),
                vt: w.vt,
                amigaMarks: to === "amiga" ? w.marks : undefined,
                loaf: w.loaf,
            });
            console.log(`pass ${pass} ${from}>${to}: max ${sorted.at(-1)} @${w.maxAt} p95 ${pct(sorted, 0.95)} >33: ${JSON.stringify(w.iv.filter((x) => x > 33.4))} vt ${JSON.stringify(w.vt)}${to === "amiga" ? " marks " + JSON.stringify(w.marks) : ""}`);
        }
        report.passes.push({ pass, worst: Math.max(...hops.map((h) => h.max ?? 0)), hops });
    }
} finally {
    await browser.close().catch(() => {});
    await server?.close();
}
if (OUT) {
    mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
    writeFileSync(OUT, JSON.stringify(report, null, 1));
}
for (const p of report.passes) console.log(`pass ${p.pass} worst ${p.worst} ms`);
