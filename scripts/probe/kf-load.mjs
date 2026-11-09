// SERVED MODEL: claude-opus-5-5
/**
 * kf-load — the first-load and scene-swap witness (value.js X o1105 kf-load).
 *
 * Run ONLY through the machine guard, never --light (it launches a browser),
 * with --cpu-cores 0 (the cells time frames):
 *   ~/.claude/guard/guarded --cpu-cores 0 --timeout 30 -- node scripts/probe/kf-load.mjs \
 *       [--dist dist/gh-pages | --base https://keyframes.babb.dev/] --out FILE.json \
 *       [--cells load,bytes,swap,vt,inp,lh] [--runs 3] [--gpu]
 *
 * One browser per run, a fresh context per cell, both closed in `finally`.
 * A `--dist` build is served gzip-encoded from loopback (the edge compresses,
 * so the decode the page pays is the real one); `--base` measures a deployed
 * origin as it is.
 *
 * Cells (median of --runs where timed):
 *   load   Home / #/spring / #/easing at 390x844 (mobile, CPU 4x) and Home at
 *          1440x900 (CPU 1x): FCP, LCP, CLS (to FCP + 10 s), TBT (long tasks
 *          starting in [FCP, FCP + 10 s]), the request list (each request's
 *          start time and origin), the third-party origins.
 *   bytes  JS coverage over the first 8 s (Home 390) and 10 s (#/spring,
 *          #/easing 390): which scripts EVALUATED (their top-level function
 *          ran), their bytes, and the vendor-monaco / vendor-three requests.
 *   swap   1440x900, CPU 4x: boot #/cube, idle, then each scene and back into
 *          the cube by hash (the router → runSceneSwitch path): the
 *          `scene-swap:prepare|commit|total` measures per hop.
 *   vt     The same swaps, sampled mid-transition: every running animation's
 *          target (pseudo-element), its keyframe properties and duration, and
 *          the transition's types.
 *   inp    #/spring 390, CPU 4x: after idle, open the dock's surface menu and
 *          pick Keyframes; the Event Timing duration of that pick (INP) and
 *          the code well's box height once the editor stands.
 *   frames Mid-swap frames (cube → spring) at 390/1440 × light/dark (--shots
 *          DIR), and the animation count of a reduced-motion swap.
 *   assay  The into-cube swap (from square, spring, easing), 1440 CPU 4x: the
 *          commit window's long animation frames attributed to scripts.
 *   lh     Lighthouse (mobile preset, simulated throttling) on Home and
 *          #/spring, ×2. Lighthouse resolves from KF_LIGHTHOUSE_DIR.
 *
 * Every cell records the machine's 1-minute load and `memory_pressure` free %.
 */
import { execSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const arg = (n, d) => {
    const i = process.argv.indexOf(`--${n}`);
    return i > 0 ? process.argv[i + 1] : d;
};
const flag = (n) => process.argv.includes(`--${n}`);
const OUT = arg("out", null);
const RUNS = Number(arg("runs", "3"));
const CELLS = new Set(arg("cells", "load,bytes,swap,vt,inp").split(","));
// --gpu: the real-GPU witness. Playwright's default headless shell composites
// in software (viz SoftwareRenderer) unless asked otherwise, and a software
// compositor draws every view-transition render pass at 2880x1800 on the CPU:
// a trace of square -> cube showed 997 ms of SoftwareRenderer::DoDrawQuad on
// the viz thread against 452 ms of renderer main-thread work, so frame
// intervals there time the compositor, not the page. The witness stays the
// headless shell and turns on ANGLE Metal; the result records the renderer
// string so a run that fell back to SwiftShader is visible.
const GPU = flag("gpu");
const GPU_ARGS = GPU ? ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] : [];
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

// ── the machine state, per cell ─────────────────────────────────────────────
function machine() {
    let free = null;
    try {
        const m = /free percentage:\s*(\d+)%/.exec(execSync("memory_pressure -Q", { encoding: "utf8" }));
        free = m ? Number(m[1]) : null;
    } catch {
        /* not darwin */
    }
    return { load1: Number(os.loadavg()[0].toFixed(2)), memFreePct: free };
}

// ── the origin under test ───────────────────────────────────────────────────
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".txt": "text/plain",
};
function serve(dir) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
            let p = path.join(dir, u.endsWith("/") ? u + "index.html" : u);
            if (!p.startsWith(dir) || !existsSync(p) || statSync(p).isDirectory()) {
                res.writeHead(404).end();
                return;
            }
            const type = MIME[path.extname(p)] ?? "application/octet-stream";
            const gz = /text|javascript|json|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "");
            res.writeHead(200, { "content-type": type, ...(gz ? { "content-encoding": "gzip" } : {}) });
            const s = createReadStream(p);
            (gz ? s.pipe(zlib.createGzip()) : s).pipe(res);
        });
        server.listen(0, "127.0.0.1", () =>
            resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise((r) => server.close(r)) }),
        );
    });
}

const median = (xs) => {
    const s = xs.filter((x) => typeof x === "number").sort((a, b) => a - b);
    return s.length ? s[Math.floor((s.length - 1) / 2)] : null;
};
const pct = (xs, q) => {
    const s = [...xs].sort((a, b) => a - b);
    return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : null;
};

const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };

async function newCell(browser, device, rate) {
    const context = await browser.newContext({ ...device, colorScheme: "light", reducedMotion: "no-preference" });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    if (rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    return { context, page, cdp };
}

// Observers installed before any page script: paint, LCP, layout shift, long
// tasks, event timing. Buffered, so nothing before install is lost.
const OBSERVE = () => {
    const W = (window.__kfLoad = { fcp: null, lcp: 0, shifts: [], long: [], events: [] });
    const on = (type, fn, extra = {}) => {
        try {
            new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra });
        } catch {
            /* unsupported */
        }
    };
    on("paint", (e) => {
        if (e.name === "first-contentful-paint") W.fcp = e.startTime;
    });
    on("largest-contentful-paint", (e) => (W.lcp = e.startTime));
    on("layout-shift", (e) => {
        if (!e.hadRecentInput) W.shifts.push([e.startTime, e.value]);
    });
    on("longtask", (e) => W.long.push([e.startTime, e.duration]));
    on("event", (e) => W.events.push({ id: e.interactionId, name: e.name, t: e.startTime, d: e.duration }), { durationThreshold: 16 });
};

const READY = () => {
    const host = document.querySelector(".scene-host");
    if (!host?.firstElementChild || host.querySelector(".scene-skeleton")) return false;
    if (document.documentElement.matches(":active-view-transition")) return false;
    return host.getBoundingClientRect().height > 0;
};

async function loadCell(browser, base, { id, hash, device, rate }) {
    const { context, page } = await newCell(browser, device, rate);
    try {
        const requests = [];
        const t0 = Date.now();
        page.on("request", (r) => requests.push({ url: r.url(), at: Date.now() - t0 }));
        await page.addInitScript(OBSERVE);
        const env = machine();
        await page.goto(base + hash, { waitUntil: "commit" });
        await page.waitForFunction(() => window.__kfLoad?.fcp != null, undefined, { timeout: 30_000 });
        const fcp = await page.evaluate(() => window.__kfLoad.fcp);
        // the TBT / CLS window: FCP + 10 s
        await page.waitForFunction((end) => performance.now() >= end, fcp + 10_000, { timeout: 40_000, polling: 250 });
        const m = await page.evaluate((fcp) => {
            const W = window.__kfLoad;
            const end = fcp + 10_000;
            const tbt = W.long.filter(([s]) => s >= fcp && s <= end).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
            const cls = W.shifts.filter(([s]) => s <= end).reduce((a, [, v]) => a + v, 0);
            const res = performance.getEntriesByType("resource");
            const js = res.filter((e) => /\.js(\?|$)/.test(e.name));
            return {
                fcp: Math.round(fcp),
                lcp: Math.round(W.lcp),
                cls: Number(cls.toFixed(4)),
                tbt: Math.round(tbt),
                jsKB: Math.round(js.reduce((a, e) => a + (e.decodedBodySize || 0), 0) / 1024),
                jsWireKB: Math.round(js.reduce((a, e) => a + (e.encodedBodySize || 0), 0) / 1024),
            };
        }, fcp);
        const origin = new URL(base).origin;
        const thirdParty = [...new Set(requests.map((r) => new URL(r.url).origin).filter((o) => o !== origin && !o.startsWith("data:")))];
        const within = (re, ms) => requests.filter((r) => re.test(r.url) && r.at <= ms).length;
        return {
            id,
            env,
            ...m,
            thirdParty,
            monaco10s: within(/vendor-monaco/, 10_000),
            three10s: within(/vendor-three/, 10_000),
            requests: requests.map((r) => ({ at: r.at, url: r.url.replace(origin, "") })),
        };
    } finally {
        await context.close();
    }
}

async function bytesCell(browser, base, { id, hash, device, rate, ms }) {
    const { context, page } = await newCell(browser, device, rate);
    try {
        const requests = [];
        const t0 = Date.now();
        page.on("request", (r) => requests.push({ url: r.url(), at: Date.now() - t0 }));
        await page.coverage.startJSCoverage({ resetOnNavigation: false, reportAnonymousScripts: false });
        const env = machine();
        await page.goto(base + hash, { waitUntil: "commit" });
        await page.waitForTimeout(ms);
        const cov = await page.coverage.stopJSCoverage();
        const evaluated = cov
            .filter((c) => /\/assets\/.*\.js/.test(c.url))
            .filter((c) => c.functions.some((f) => f.functionName === "" && f.ranges[0]?.startOffset === 0 && f.ranges[0].count > 0))
            .map((c) => ({
                chunk: c.url.split("/").pop(),
                kb: Math.round((c.source?.length ?? 0) / 1024),
                gzKB: Math.round(zlib.gzipSync(c.source ?? "").length / 1024),
            }));
        return {
            id,
            env,
            windowMs: ms,
            evaluatedKB: evaluated.reduce((a, e) => a + e.kb, 0),
            evaluatedGzKB: evaluated.reduce((a, e) => a + e.gzKB, 0),
            evaluated: evaluated.map((e) => `${e.chunk} ${e.kb}`),
            threeEvaluated: evaluated.some((e) => /vendor-three/.test(e.chunk)) ? 1 : 0,
            monacoEvaluated: evaluated.some((e) => /vendor-monaco/.test(e.chunk)) ? 1 : 0,
            monacoRequests: requests.filter((r) => /vendor-monaco/.test(r.url)).length,
            threeRequests: requests.filter((r) => /vendor-three/.test(r.url)).length,
        };
    } finally {
        await context.close();
    }
}

const SWAP_ORDER = ["amiga", "cube", "square", "cube", "easing", "cube", "spring", "cube", "sequence", "cube", "", "cube"];

// One swap by hash. With `sample`, every animation-frame of the transition is
// sampled for its running animations (the vt cell).
const SWAP = async ({ hash, sample }) => {
    performance.clearMeasures();
    const seen = new Map();
    let types = null;
    let rootAnimated = null;
    let on = sample;
    const tick = () => {
        if (!on) return;
        const vt = document.activeViewTransition;
        if (vt && types === null) types = [...(vt.types ?? [])];
        for (const a of document.getAnimations()) {
            const eff = a.effect;
            const pseudo = eff?.pseudoElement ?? null;
            const tgt = eff?.target;
            const key = `${pseudo ?? ""}|${tgt?.className?.baseVal ?? tgt?.className ?? tgt?.tagName}|${a.animationName ?? a.id}`;
            if (seen.has(key)) continue;
            if (!pseudo || !pseudo.startsWith("::view-transition")) continue;
            const props = [...new Set(eff.getKeyframes().flatMap((k) => Object.keys(k)).filter((k) => !["offset", "easing", "composite", "computedOffset"].includes(k)))];
            const timing = eff.getComputedTiming();
            seen.set(key, { pseudo, name: a.animationName ?? null, props, duration: Math.round(Number(timing.duration) || 0), easing: eff.getTiming().easing });
            if (/\(root\)/.test(pseudo)) rootAnimated = (rootAnimated ?? []).concat(props);
        }
        requestAnimationFrame(tick);
    };
    if (sample) requestAnimationFrame(tick);
    const frames = [];
    let last = performance.now();
    let fOn = true;
    const ft = (t) => {
        if (!fOn) return;
        frames.push(t - last);
        last = t;
        requestAnimationFrame(ft);
    };
    requestAnimationFrame(ft);
    location.hash = hash;
    for (let i = 0; i < 500 && !performance.getEntriesByName("scene-swap:total").length; i++) await new Promise((r) => setTimeout(r, 16));
    on = false;
    fOn = false;
    const m = Object.fromEntries(
        performance
            .getEntriesByType("measure")
            .filter((e) => e.name.startsWith("scene-swap:"))
            .map((e) => [e.name.slice(11), Math.round(e.duration)]),
    );
    return { ...m, frames: frames.slice(1).map((f) => Math.round(f * 10) / 10), vt: sample ? { types, rootAnimated, animations: [...seen.values()] } : undefined };
};

async function swapCell(browser, base, { sample }) {
    const { context, page } = await newCell(browser, { ...DESKTOP }, 4);
    try {
        const env = machine();
        await page.goto(base + "#/cube", { waitUntil: "load" });
        await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
        await page.waitForTimeout(4000);
        const hops = [];
        let from = "cube";
        for (const to of SWAP_ORDER) {
            const r = await page.evaluate(SWAP, { hash: `#/${to}`, sample });
            hops.push({ hop: `${from || "home"}->${to || "home"}`, ...r });
            from = to;
            await page.waitForTimeout(1200);
        }
        return { env, hops };
    } finally {
        await context.close();
    }
}

// The cube-swap assay (L8): 1440x900, CPU 4x, boot a scene, idle, swap into
// the cube, and attribute the commit window's long animation frames (LoAF)
// to their scripts. Read against an unminified build for function names.
async function assayCell(browser, base, from) {
    const { context, page } = await newCell(browser, DESKTOP, 4);
    try {
        await page.addInitScript(() => {
            window.__loaf = [];
            try {
                new PerformanceObserver((l) => window.__loaf.push(...l.getEntries())).observe({ type: "long-animation-frame", buffered: true });
            } catch {
                /* unsupported */
            }
        });
        const env = machine();
        await page.goto(base + `#/${from}`, { waitUntil: "load" });
        await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
        await page.waitForTimeout(4000);
        const cdp = await context.newCDPSession(page);
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
        await cdp.send("Profiler.start");
        const swap = await page.evaluate(SWAP, { hash: "#/cube", sample: false });
        const { profile } = await cdp.send("Profiler.stop");
        // self time per function (name @ file), the top of the commit's cost
        const dt = profile.timeDeltas;
        const self = new Map();
        const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
        profile.samples.forEach((id, i) => {
            const cf = nodes.get(id).callFrame;
            const key = `${cf.functionName || "(anon)"} @ ${(cf.url || cf.functionName).split("/").pop()}:${cf.lineNumber}`;
            self.set(key, (self.get(key) ?? 0) + (dt[i] ?? 0) / 1000);
        });
        // who calls the hot natives: self time by the three-frame caller chain
        const parent = new Map();
        for (const n of profile.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
        const label = (id) => {
            const cf = nodes.get(id)?.callFrame;
            return cf ? `${cf.functionName || "(anon)"}@${(cf.url || "").split("/").pop()}:${cf.lineNumber}` : "";
        };
        const chains = new Map();
        profile.samples.forEach((id, i) => {
            const cf = nodes.get(id).callFrame;
            if (!/^(getPropertyValue|focus|getBoundingClientRect|getComputedStyle|\$|offsetWidth|offsetHeight)$/.test(cf.functionName) && !(cf.functionName === "$")) return;
            const chain = [label(id)];
            for (let p = parent.get(id), k = 0; p && k < 5; p = parent.get(p), k++) chain.push(label(p));
            const key = chain.join(" < ");
            chains.set(key, (chains.get(key) ?? 0) + (dt[i] ?? 0) / 1000);
        });
        const callers = [...chains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${Math.round(v)}ms ${k}`);
        const hot = [...self.entries()].filter(([k]) => !/^\((idle|program|garbage collector)\)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${Math.round(v)}ms ${k}`);
        const gc = Math.round(self.get("(garbage collector) @ (garbage collector):-1") ?? 0);
        const loaf = await page.evaluate(() => {
            const c = performance.getEntriesByName("scene-swap:commit")[0];
            const s = performance.getEntriesByName("scene-swap:start")[0]?.startTime ?? 0;
            const from = c ? c.startTime - 50 : s;
            const to = c ? c.startTime + c.duration + 50 : s + 2000;
            return window.__loaf
                .filter((f) => f.startTime + f.duration >= from && f.startTime <= to)
                .map((f) => ({
                    start: Math.round(f.startTime),
                    duration: Math.round(f.duration),
                    blocking: Math.round(f.blockingDuration),
                    render: Math.round(f.renderStart ? f.startTime + f.duration - f.renderStart : 0),
                    styleLayout: Math.round(f.styleAndLayoutStart ? f.startTime + f.duration - f.styleAndLayoutStart : 0),
                    scripts: f.scripts
                        .map((x) => ({
                            d: Math.round(x.duration),
                            forced: Math.round(x.forcedStyleAndLayoutDuration),
                            invoker: x.invoker,
                            fn: x.sourceFunctionName,
                            src: `${(x.sourceURL || "").split("/").pop()}:${x.sourceCharPosition}`,
                        }))
                        .sort((a, b) => b.d - a.d)
                        .slice(0, 8),
                }));
        });
        return { env, from, swap: { prepare: swap.prepare, commit: swap.commit, total: swap.total }, loaf, hot, gc, callers };
    } finally {
        await context.close();
    }
}

async function inpCell(browser, base) {
    const { context, page } = await newCell(browser, MOBILE, 4);
    try {
        await page.addInitScript(OBSERVE);
        const env = machine();
        await page.goto(base + "#/spring", { waitUntil: "load" });
        await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
        await page.waitForTimeout(6000);
        const monacoBefore = await page.evaluate(() => performance.getEntriesByType("resource").some((e) => /vendor-monaco/.test(e.name)));
        // A touch tap on the collapsed scene dock expands it; a tap on the
        // surfaces trigger opens its menu; the measured interaction is the
        // tap on the Keyframes row.
        const centre = (sel) =>
            page.evaluate((sel) => {
                const el = [...document.querySelectorAll(sel)].find((e) => {
                    const r = e.getBoundingClientRect();
                    return r.width > 0 && r.height > 0 && r.top < innerHeight / 2 + 300;
                });
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            }, sel);
        const trigger = page.locator("[data-dock-surface-trigger]").first();
        for (let i = 0; i < 4 && !(await trigger.isVisible()); i++) {
            const dock = await centre(".glass-dock");
            if (dock) await page.touchscreen.tap(dock.x, dock.y);
            await page.waitForTimeout(900);
        }
        const tc = await centre("[data-dock-surface-trigger]");
        if (!tc) throw new Error("inp: no visible surfaces trigger");
        await page.touchscreen.tap(tc.x, tc.y);
        const item = page.locator('[data-dock-surface-item][data-surface="keyframes"]').first();
        await item.waitFor({ state: "visible", timeout: 10_000 });
        await page.waitForTimeout(600);
        const mark = await page.evaluate(() => performance.now());
        const ic = await centre('[data-dock-surface-item][data-surface="keyframes"]');
        await page.touchscreen.tap(ic.x, ic.y);
        // the editor stands: Monaco's view lines are in the well
        await page.waitForSelector(".monaco-pane .monaco-editor .view-lines", { timeout: 30_000 });
        await page.waitForTimeout(1500);
        const r = await page.evaluate((mark) => {
            const ev = window.__kfLoad.events.filter((e) => e.id > 0 && e.t >= mark - 5);
            const byId = {};
            for (const e of ev) byId[e.id] = Math.max(byId[e.id] ?? 0, e.d);
            const well = document.querySelector(".monaco-pane .code-well") ?? document.querySelector(".monaco-pane .monaco-editor");
            return { inp: Math.max(0, ...Object.values(byId)), interactions: byId, wellHeight: well ? Math.round(well.getBoundingClientRect().height) : null };
        }, mark);
        return { env, monacoBefore, ...r };
    } finally {
        await context.close();
    }
}

async function lighthouseCells(base, runs) {
    const dir = process.env.KF_LIGHTHOUSE_DIR;
    if (!dir) return { skipped: "KF_LIGHTHOUSE_DIR unset" };
    const req = createRequire(path.join(dir, "package.json"));
    const lhPath = req.resolve("lighthouse");
    const { default: lighthouse } = await import(lhPath);
    const out = [];
    for (let run = 1; run <= runs; run++) {
        for (const hash of ["", "#/spring"]) {
            const port = 9300 + Math.floor(Math.random() * 500);
            const browser = await chromium.launch({ headless: true, args: [`--remote-debugging-port=${port}`, ...GPU_ARGS] });
            try {
                const env = machine();
                const r = await lighthouse(base + hash, { port, output: "json", logLevel: "error", onlyCategories: ["performance"] });
                const a = r.lhr.audits;
                out.push({
                    run,
                    page: hash || "home",
                    env,
                    perf: r.lhr.categories.performance.score,
                    fcp: Math.round(a["first-contentful-paint"].numericValue),
                    lcp: Math.round(a["largest-contentful-paint"].numericValue),
                    tbt: Math.round(a["total-blocking-time"].numericValue),
                    cls: Number(a["cumulative-layout-shift"].numericValue.toFixed(4)),
                    si: Math.round(a["speed-index"].numericValue),
                });
            } finally {
                await browser.close();
            }
        }
    }
    return out;
}

// ── main ─────────────────────────────────────────────────────────────────────
const distArg = arg("dist", null);
const baseArg = arg("base", null);
let server = null;
let base;
if (baseArg) base = baseArg.replace(/\/?$/, "/");
else {
    const dist = path.resolve(REPO, distArg ?? "dist/gh-pages");
    if (!existsSync(path.join(dist, "index.html"))) {
        console.error(`kf-load — ${dist}/index.html missing (npm run gh-pages)`);
        process.exit(2);
    }
    server = await serve(dist);
    base = server.url;
}

const result = { base: baseArg ?? path.relative(REPO, path.resolve(REPO, distArg ?? "dist/gh-pages")), at: new Date().toISOString(), runs: RUNS, gpu: GPU, cells: {} };
let browser;
try {
    browser = await chromium.launch({ headless: true, args: GPU_ARGS });
    {
        const c = await browser.newContext();
        const p = await c.newPage();
        result.renderer = await p.evaluate(() => {
            const gl = document.createElement("canvas").getContext("webgl");
            const ext = gl?.getExtension("WEBGL_debug_renderer_info");
            return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null;
        });
        await c.close();
        console.log(`renderer: ${result.renderer}`);
    }
    if (CELLS.has("load")) {
        const defs = [
            { id: "home-390", hash: "", device: MOBILE, rate: 4 },
            { id: "spring-390", hash: "#/spring", device: MOBILE, rate: 4 },
            { id: "easing-390", hash: "#/easing", device: MOBILE, rate: 4 },
            { id: "home-1440", hash: "", device: DESKTOP, rate: 1 },
        ];
        for (const d of defs) {
            const runs = [];
            for (let i = 0; i < RUNS; i++) runs.push(await loadCell(browser, base, d));
            const med = Object.fromEntries(["fcp", "lcp", "cls", "tbt", "jsKB", "jsWireKB", "monaco10s", "three10s"].map((k) => [k, median(runs.map((r) => r[k]))]));
            result.cells[d.id] = { median: med, thirdParty: runs[0].thirdParty, runs };
            console.log(`load ${d.id}`, JSON.stringify(med), "3p:", runs[0].thirdParty.join(" ") || "none");
        }
    }
    if (CELLS.has("bytes")) {
        for (const d of [
            { id: "bytes-home-390", hash: "", device: MOBILE, rate: 4, ms: 8000 },
            { id: "bytes-spring-390", hash: "#/spring", device: MOBILE, rate: 4, ms: 10_000 },
            { id: "bytes-easing-390", hash: "#/easing", device: MOBILE, rate: 4, ms: 10_000 },
        ]) {
            const r = await bytesCell(browser, base, d);
            result.cells[d.id] = r;
            console.log(`bytes ${d.id} evaluated ${r.evaluatedKB} KB (gz ${r.evaluatedGzKB}) · three eval ${r.threeEvaluated} req ${r.threeRequests} · monaco eval ${r.monacoEvaluated} req ${r.monacoRequests}`);
        }
    }
    if (CELLS.has("swap")) {
        const runs = [];
        for (let i = 0; i < RUNS; i++) runs.push(await swapCell(browser, base, { sample: false }));
        const byHop = {};
        for (const r of runs) for (const h of r.hops) (byHop[h.hop] ??= []).push(h);
        const summary = Object.fromEntries(
            Object.entries(byHop).map(([hop, hs]) => [
                hop,
                {
                    prepare: median(hs.map((h) => h.prepare)),
                    commit: median(hs.map((h) => h.commit)),
                    total: median(hs.map((h) => h.total)),
                    frameP95: median(hs.map((h) => pct(h.frames, 0.95))),
                },
            ]),
        );
        result.cells.swap = { summary, runs };
        for (const [hop, s] of Object.entries(summary)) console.log(`swap ${hop}`, JSON.stringify(s));
    }
    if (CELLS.has("vt")) {
        const r = await swapCell(browser, base, { sample: true });
        result.cells.vt = r;
        for (const h of r.hops.slice(0, 4)) console.log(`vt ${h.hop} types=${JSON.stringify(h.vt.types)} root=${JSON.stringify(h.vt.rootAnimated)} anims=${h.vt.animations.map((a) => `${a.pseudo}[${a.props.join("+")}]`).join(" ")}`);
    }
    if (CELLS.has("frames")) {
        // Mid-swap frames (cube → spring) at 390 / 1440 × light / dark, and the
        // reduced-motion swap's animation count.
        const dir = arg("shots", null);
        if (dir) mkdirSync(dir, { recursive: true });
        result.cells.frames = [];
        for (const [device, w] of [[MOBILE, 390], [DESKTOP, 1440]]) {
            for (const scheme of ["light", "dark"]) {
                const context = await browser.newContext({ ...device, colorScheme: scheme, reducedMotion: "no-preference" });
                try {
                    const page = await context.newPage();
                    await page.goto(base + "#/cube", { waitUntil: "load" });
                    await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
                    await page.waitForTimeout(3000);
                    await page.evaluate(() => (location.hash = "#/spring"));
                    await page.waitForFunction(() => document.documentElement.matches(":active-view-transition"), undefined, { timeout: 5000, polling: "raf" });
                    await page.waitForTimeout(140);
                    const file = dir ? path.join(dir, `swap-cube-spring-${w}-${scheme}.png`) : null;
                    if (file) await page.screenshot({ path: file });
                    const groups = await page.evaluate(() =>
                        document.getAnimations().map((a) => a.effect?.pseudoElement).filter((p) => p?.startsWith("::view-transition")),
                    );
                    result.cells.frames.push({ w, scheme, file, groups: [...new Set(groups)] });
                    console.log(`frames ${w} ${scheme} ${file ?? ""} groups=${[...new Set(groups)].join(" ")}`);
                } finally {
                    await context.close();
                }
            }
        }
        const context = await browser.newContext({ ...DESKTOP, reducedMotion: "reduce" });
        try {
            const page = await context.newPage();
            await page.goto(base + "#/cube", { waitUntil: "load" });
            await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
            await page.waitForTimeout(2000);
            const r = await page.evaluate(SWAP, { hash: "#/spring", sample: true });
            result.cells.reducedMotion = { animations: r.vt.animations.length, types: r.vt.types };
            console.log(`reduced-motion swap: ${r.vt.animations.length} VT animations`);
        } finally {
            await context.close();
        }
    }
    if (CELLS.has("assay")) {
        result.cells.assay = [];
        // --assay-from square,spring,easing (default); "home" boots #/ (the hero).
        for (const from of arg("assay-from", "square,spring,easing").split(",")) {
            const r = await assayCell(browser, base, from === "home" ? "" : from);
            result.cells.assay.push(r);
            console.log(`assay ${from}->cube hot:\n    ${r.hot.slice(0, 12).join("\n    ")}\n  callers:\n    ${r.callers.join("\n    ")}`);
            console.log(`assay ${from}->cube ${JSON.stringify(r.swap)} loaf=${r.loaf.map((f) => `${f.duration}ms[${f.scripts.slice(0, 3).map((x) => `${x.fn || x.invoker}:${x.d}${x.forced ? `/f${x.forced}` : ""}`).join(",")}]`).join(" ")}`);
        }
    }
    if (CELLS.has("inp")) {
        const runs = [];
        for (let i = 0; i < RUNS; i++) runs.push(await inpCell(browser, base));
        result.cells.inp = { median: { inp: median(runs.map((r) => r.inp)), wellHeight: median(runs.map((r) => r.wellHeight)) }, runs };
        console.log("inp", JSON.stringify(result.cells.inp.median), "monacoBefore:", runs.map((r) => r.monacoBefore).join(","));
    }
} finally {
    await browser?.close();
}
try {
    if (CELLS.has("lh")) {
        result.cells.lighthouse = await lighthouseCells(base, Math.max(2, Math.min(RUNS, 2)));
        console.log("lighthouse", JSON.stringify(result.cells.lighthouse.map?.((r) => [r.run, r.page, r.perf, r.fcp, r.lcp, r.tbt, r.cls]) ?? result.cells.lighthouse));
    }
} finally {
    await server?.close();
}
if (OUT) {
    mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
    writeFileSync(OUT, JSON.stringify(result, null, 1));
    console.log(`kf-load — wrote ${OUT}`);
}
