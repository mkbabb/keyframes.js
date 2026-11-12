// SERVED MODEL: claude-opus-5-5
/**
 * The cube slice's bounds and gestures, framed as a host frames it (owner
 * 2026-11-11 on daraksha.babb.dev/motion: "multitouch scroll and rotation
 * doesn't work, it just pans. you should not be able to pan off screen so far.
 * ANd we should have logic to if you throw the cube out of bounds, it springs
 * back smoothly"; and "these controls buttons should be like keyframes").
 * A sibling of kf-stage-and-orbit.mjs (that file is the app's stage; this one
 * is the embed slice under a host), so neither grows into the other.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser);
 * WebKit under `guarded --exclusive webkit`:
 *   ~/.claude/guard/guarded --timeout 20 -- node scripts/probe/kf-embed-bounds.mjs \
 *       --out run.json [--kf-dist dist/gh-pages/embed] [--dk-dist DIR] \
 *       [--engine chromium|webkit] [--widths 1440,390] [--schemes dark,light] \
 *       [--only REGEX] [--prm]
 *
 * The host is https://daraksha.babb.dev/motion, as served (or --dk-dist
 * fulfilled on that origin); the slice is https://keyframes.babb.dev/embed/ as
 * served (or --kf-dist fulfilled on that origin), so the allow-list, the CSP
 * and the frame's src run as shipped. One browser per run, one context per
 * cell, every context and the browser closed in `finally`.
 *
 * Legs (each reads the die inside the frame: the pan from the orbit
 * container's translate3d carried back by G, the scale, the attitude):
 *   pan-bound    wheel the die hard toward each side and corner; at rest each
 *                axis keeps the die's whole painted silhouette (its faces' union)
 *                inside the stage (≥ 99.5 %, for subpixel rounding).
 *   throw-back   release a pan moving toward the right edge; per frame after the
 *                release: the centre passes the bound, peaks, returns
 *                monotonically, rests on the bound; largest step ≤ 12 % of the
 *                post-release travel. Reduced motion: no overshoot.
 *   pinch-chrome a real ctrl-wheel Δy −20 off centre: s ×e^0.2, the point under
 *                the cursor fixed within 1 px, attitude unchanged.
 *   gesture-frame / gesture-host  a synthetic Safari gesture (scale 1.5,
 *                rotation 30) dispatched inside the frame, then on the host's
 *                stage (the relay): s ×1.5 anchored at the cursor within 1 px,
 *                a 30 ± 0.5° roll about the view axis.
 *   rim-roll     a 90° arc dragged around the die, off it: a 90 ± 2° roll, no
 *                other axis past 1°.
 *   reset-home   Again after a pan and zoom: the die eases home over ≥ 6
 *                frames, first step ≤ 4 %, largest ≤ 12 % of the travel.
 *   ready-transport  the slice's `ready` carries its Play seat's look.
 */
import { mkdirSync, readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";

const arg = (name, dflt) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : dflt;
};
const flag = (name) => process.argv.includes(`--${name}`);
const OUT = arg("out", null);
const KF_DIST = arg("kf-dist", null);
const DK_DIST = arg("dk-dist", null);
const ENGINE = arg("engine", "chromium");
const WIDTHS = arg("widths", "1440,390").split(",").map(Number);
const SCHEMES = arg("schemes", "dark").split(",");
const ONLY = arg("only", null) ? new RegExp(arg("only")) : null;
const PRM = flag("prm");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const engines = await import(PW);
const engine = engines[ENGINE];
const isCr = ENGINE === "chromium";

const KF = "https://keyframes.babb.dev/embed/";
const HOST = "https://daraksha.babb.dev";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".webp": "image/webp", ".txt": "text/plain", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".webm": "video/webm", ".mp4": "video/mp4" };
const isFile = (f) => existsSync(f) && statSync(f).isFile();
const serve = (root, rel, spa) => {
    const cands = [rel, rel + ".html", join(rel, "index.html")];
    if (spa) cands.push("index.html");
    for (const c of cands) {
        const f = join(root, c);
        if (f.startsWith(root) && isFile(f)) return { status: 200, body: readFileSync(f), contentType: MIME[extname(f)] ?? "application/octet-stream" };
    }
    return { status: 404, body: "nf" };
};

/** In the frame: the die's pose. The pan is translate3d(G⁻¹·t) carried back by G. */
function readPose() {
    const c = document.querySelector(".graph > div");
    const tf = c?.style.transform ?? "";
    const m = /translate3d\(([-\d.e]+)px, ([-\d.e]+)px, ([-\d.e]+)px\)/.exec(tf);
    let t = [0, 0, 0];
    if (m) {
        const v = [+m[1], +m[2], +m[3]];
        const k2 = [-Math.SQRT1_2, Math.SQRT1_2, 0];
        const a = Math.PI / 6, co = Math.cos(a), si = Math.sin(a);
        const d = k2[0] * v[0] + k2[1] * v[1] + k2[2] * v[2];
        const cr = [k2[1] * v[2] - k2[2] * v[1], k2[2] * v[0] - k2[0] * v[2], k2[0] * v[1] - k2[1] * v[0]];
        t = [0, 1, 2].map((i) => v[i] * co + cr[i] * si + k2[i] * d * (1 - co));
    }
    const s = +(/scale3d\(([-\d.e]+),/.exec(tf)?.[1] ?? 1);
    const g = document.querySelector(".graph").getBoundingClientRect();
    const st = document.querySelector("[data-orbit-stage], .embed-cube-stage").getBoundingClientRect();
    const side = document.querySelector(".cube")?.offsetWidth ?? 0;
    // The die's painted silhouette: the union of its faces' boxes (3D transforms and perspective included).
    const faces = [...(document.querySelector(".cube")?.children ?? [])].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
    const sil = faces.length ? { l: Math.min(...faces.map((r) => r.left)), t: Math.min(...faces.map((r) => r.top)), r: Math.max(...faces.map((r) => r.right)), b: Math.max(...faces.map((r) => r.bottom)) } : null;
    return {
        tf, s, side, sil,
        c: { x: g.left + g.width / 2 + t[0], y: g.top + g.height / 2 + t[1] },
        rest: { x: g.left + g.width / 2, y: g.top + g.height / 2 },
        stage: { l: st.left, t: st.top, r: st.right, b: st.bottom },
    };
}

// The screen-frame rotation between two orbit transforms (G·d·G⁻¹).
const G_AXIS = [-Math.SQRT1_2, Math.SQRT1_2, 0];
const G_Q = (() => { const h = Math.PI / 12; return [G_AXIS[0] * Math.sin(h), G_AXIS[1] * Math.sin(h), 0, Math.cos(h)]; })();
const qMul = (a, b) => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] + a[1] * b[3] + a[2] * b[0] - a[0] * b[2],
    a[3] * b[2] + a[2] * b[3] + a[0] * b[1] - a[1] * b[0],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const qInv = (q) => [-q[0], -q[1], -q[2], q[3]];
const qOf = (tf) => {
    const m = /rotate3d\(([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)deg\)/.exec(tf ?? "");
    if (!m) return [0, 0, 0, 1];
    const n = Math.hypot(+m[1], +m[2], +m[3]) || 1;
    const h = (+m[4] * Math.PI) / 360;
    return [(+m[1] / n) * Math.sin(h), (+m[2] / n) * Math.sin(h), (+m[3] / n) * Math.sin(h), Math.cos(h)];
};
const turn = (tf0, tf1) => {
    const d = qMul(qOf(tf1), qInv(qOf(tf0)));
    const s = qMul(qMul(G_Q, d), qInv(G_Q));
    const w = Math.min(1, Math.abs(s[3]));
    const sg = s[3] < 0 ? -1 : 1;
    const v = Math.hypot(s[0], s[1], s[2]);
    const ang = 2 * Math.atan2(v, w);
    const deg = (ang * 180) / Math.PI;
    return v > 0
        ? { deg, rollDeg: sg * (s[2] / v) * deg, tiltDeg: (Math.hypot(s[0], s[1]) / v) * deg }
        : { deg: 0, rollDeg: 0, tiltDeg: 0 };
};
const r2 = (v) => Math.round(v * 100) / 100;

/** Each axis's share of the die's painted silhouette inside the stage, and the area share. */
const inside = (p) => {
    const b = p.sil ?? { l: p.c.x - (p.side * p.s) / 2, r: p.c.x + (p.side * p.s) / 2, t: p.c.y - (p.side * p.s) / 2, b: p.c.y + (p.side * p.s) / 2 };
    const fx = Math.max(0, Math.min(b.r, p.stage.r) - Math.max(b.l, p.stage.l)) / (b.r - b.l);
    const fy = Math.max(0, Math.min(b.b, p.stage.b) - Math.max(b.t, p.stage.t)) / (b.b - b.t);
    return { fx: r2(fx), fy: r2(fy), area: r2(fx * fy) };
};
/** The centre's bound on x (the design's: the whole silhouette, ½·side·s·2, inside; bounds.ts). */
const boundX = (p) => p.stage.r - 0.5 * 2 * p.side * p.s;

const out = [];
// WebKit: glass's harness pin (build 2287) when present — the bundled build
// crashes every page that mounts a GlassDock (glass webkit-2287.config.ts).
const WK_PIN = `${process.env.HOME}/Library/Caches/ms-playwright/webkit-2287/pw_run.sh`;
const browser = await engine.launch(ENGINE === "webkit" && existsSync(WK_PIN) && !flag("wk-bundled") ? { executablePath: WK_PIN } : {});
try {
    for (const w of WIDTHS) for (const scheme of SCHEMES) for (const prm of PRM ? [false, true] : [false]) {
        const phone = w < 800;
        const vp = { width: w, height: phone ? 844 : 900 };
        const cellName = `${w}-${scheme}${prm ? "-prm" : ""}`;
        const leg = async (name, fn) => {
            if (ONLY && !ONLY.test(name)) return;
            const ctx = await browser.newContext({
                viewport: vp, colorScheme: scheme, deviceScaleFactor: phone ? 2 : 1,
                ...(isCr ? { isMobile: phone } : {}), hasTouch: phone,
                reducedMotion: prm ? "reduce" : "no-preference",
            });
            const cell = { cell: `${name}-${cellName}`, engine: ENGINE };
            try {
                if (KF_DIST) await ctx.route(`${KF}**`, (r) => r.fulfill(serve(KF_DIST, new URL(r.request().url()).pathname.replace(/^\/embed\/?/, "") || "index.html", false)));
                if (DK_DIST) await ctx.route(`${HOST}/**`, (r) => {
                    const u = new URL(r.request().url());
                    return r.fulfill(serve(DK_DIST, decodeURIComponent(u.pathname).replace(/^\//, "") || "index.html", true));
                });
                await ctx.addInitScript(() => {
                    if (location.origin !== "https://daraksha.babb.dev") return;
                    window.__readies = [];
                    addEventListener("message", (e) => { if (e.data?.type === "ready") window.__readies.push(e.data); });
                });
                const page = await ctx.newPage();
                const errs = [];
                page.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
                await page.goto(`${HOST}/motion`, { waitUntil: "load", timeout: 45000 });
                await page.waitForSelector('.slice[data-ready="true"], iframe[src*="keyframes.babb.dev/embed"]', { timeout: 30000 });
                const frame = await (async () => {
                    for (let i = 0; i < 100; i++) {
                        const f = page.frames().find((x) => x.url().startsWith(KF));
                        if (f) { try { await f.waitForSelector(".graph > div", { timeout: 20000 }); return f; } catch { /* retry */ } }
                        await page.waitForTimeout(200);
                    }
                    throw new Error("no slice frame");
                })();
                await page.waitForTimeout(1500);
                const off = await page.evaluate(() => {
                    const r = document.querySelector('iframe[src*="keyframes.babb.dev/embed"]').getBoundingClientRect();
                    return { x: r.left, y: r.top };
                });
                const read = () => frame.evaluate(readPose);
                const reset = async (ms = 1400) => {
                    await page.evaluate(() => {
                        const f = document.querySelector('iframe[src*="keyframes.babb.dev/embed"]');
                        f.contentWindow.postMessage({ ns: "babb-embed", v: 1, type: "reset" }, new URL(f.src).origin);
                    });
                    await page.waitForTimeout(ms);
                };
                /** Record the die per frame for `ms` (frame clock). */
                // The recorder reads the pose with readPose, installed by a
                // devtools evaluate (the slice's CSP forbids eval in-page).
                await frame.evaluate(`window.__readPose = ${readPose.toString()}`);
                const record = (ms) => frame.evaluate((ms) => new Promise((done) => {
                    const outv = [];
                    const t0 = performance.now();
                    const f = (t) => { const p = window.__readPose(); outv.push({ t: t - t0, x: p.c.x, y: p.c.y, s: p.s }); if (t - t0 < ms) requestAnimationFrame(f); else done(outv); };
                    requestAnimationFrame(f);
                }), ms);
                const cdp = isCr ? await ctx.newCDPSession(page) : null;
                const touch = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts.map((p, i) => ({ x: p.x + off.x, y: p.y + off.y, id: i, radiusX: 4, radiusY: 4, force: 1 })) });
                cell.errors = errs;
                Object.assign(cell, await fn({ page, frame, read, reset, record, off, touch, phone, prm }));
            } catch (e) {
                cell.err = String(e).slice(0, 300);
            } finally {
                await ctx.close();
            }
            out.push(cell);
            console.error(JSON.stringify(cell).slice(0, 400));
        };

        await leg("pan-bound", async ({ page, read, reset, off, touch, phone }) => {
            const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
            const res = [];
            for (const [dx, dy] of dirs) {
                await reset();
                const a = await read();
                if (phone) {
                    if (!touch) continue;
                    // Two fingers dragged hard toward the side, in four strokes.
                    for (let k = 0; k < 4; k++) {
                        const p = (await read()).c;
                        const pts = (j) => [{ x: p.x - 30 + dx * j, y: p.y + dy * j }, { x: p.x + 30 + dx * j, y: p.y + dy * j }];
                        await touch("touchStart", pts(0));
                        for (let j = 1; j <= 12; j++) { await touch("touchMove", pts(j * 25)); await page.waitForTimeout(16); }
                        await page.waitForTimeout(200);
                        await touch("touchEnd", []);
                        await page.waitForTimeout(100);
                    }
                } else {
                    await page.mouse.move(a.c.x + off.x, a.c.y + off.y);
                    for (let i = 0; i < 16; i++) { await page.mouse.wheel(-dx * 150, -dy * 150); await page.waitForTimeout(16); }
                }
                await page.waitForTimeout(1600);
                const b = await read();
                res.push({ dir: [dx, dy], ...inside(b), c: { x: r2(b.c.x), y: r2(b.c.y) } });
            }
            const minAxis = Math.min(...res.map((r) => Math.min(r.fx, r.fy)));
            return { panBound: res, minAxis, minArea: Math.min(...res.map((r) => r.area)), pass: res.length > 0 && minAxis >= 0.995 };
        });

        await leg("throw-back", async ({ page, read, reset, off, touch, phone, prm, record }) => {
            await reset();
            const a = await read();
            const hi = boundX(a);
            const steps = Math.ceil((hi - a.c.x + 30) / 10);
            const y = a.c.y;
            if (phone) {
                if (!touch) return { skipped: "no touch" };
                const pts = (x) => [{ x: x, y: y - 30 }, { x: x, y: y + 30 }];
                await touch("touchStart", pts(a.c.x));
                for (let j = 1; j <= steps; j++) { await touch("touchMove", pts(a.c.x + 10 * j)); await page.waitForTimeout(16); }
            } else {
                await page.mouse.move(a.c.x + off.x, y + off.y);
                await page.keyboard.down("Shift");
                await page.mouse.down();
                for (let j = 1; j <= steps; j++) { await page.mouse.move(a.c.x + off.x + 10 * j, y + off.y); await page.waitForTimeout(16); }
            }
            // Record from the release (the recorder starts on the frame's next frame).
            const recP = record(1300);
            if (phone) await touch("touchEnd", []);
            else { await page.mouse.up(); await page.keyboard.up("Shift"); }
            const tr = await recP;
            // At rest after the throw, the die's whole painted silhouette is on the stage.
            const restIn = inside(await read());
            const xs = tr.map((p) => p.x - hi);
            let peakI = 0;
            for (let i = 1; i < xs.length; i++) if (xs[i] > xs[peakI]) peakI = i;
            const peak = xs[peakI];
            let monotone = true;
            for (let i = peakI + 1; i < xs.length; i++) if (xs[i] > xs[i - 1] + 0.05) monotone = false;
            const steps2 = xs.slice(1).map((v, i) => Math.abs(v - xs[i]));
            const travel = steps2.reduce((s, v) => s + v, 0);
            const maxStep = Math.max(0, ...steps2);
            let restMs = null;
            for (let i = 0; i < xs.length; i++) if (xs.slice(i).every((v) => Math.abs(v) <= 1)) { restMs = tr[i].t; break; }
            const end = xs.at(-1);
            const passMotion = restIn.fx >= 0.995 && restIn.fy >= 0.995 && (prm ? peak <= 0.5 && Math.abs(end) <= 0.5 : peak > 0 && monotone && Math.abs(end) <= 0.5 && restMs !== null && restMs <= 800 && travel > 0 && maxStep / travel <= 0.12);
            return { throwBack: { restInside: restIn, bound: r2(hi), peak: r2(peak), monotone, end: r2(end), restMs: restMs && Math.round(restMs), travel: r2(travel), maxStepShare: travel ? r2(maxStep / travel) : null, frames: xs.length, first: xs.slice(0, 6).map(r2) }, pass: passMotion };
        });

        if (!phone) await leg("pinch-chrome", async ({ page, read, reset, off }) => {
            await reset();
            const a = await read();
            const at = { x: a.c.x + 120, y: a.c.y - 80 };
            await page.mouse.move(at.x + off.x, at.y + off.y);
            await page.keyboard.down("Control");
            await page.mouse.wheel(0, -20);
            await page.keyboard.up("Control");
            await page.waitForTimeout(500);
            const b = await read();
            const k = b.s / a.s;
            const want = { x: at.x + k * (a.c.x - at.x), y: at.y + k * (a.c.y - at.y) };
            const anchorErr = Math.hypot(b.c.x - want.x, b.c.y - want.y);
            const t = turn(a.tf, b.tf);
            return { pinchChrome: { k: +k.toFixed(5), want: +Math.exp(0.2).toFixed(5), anchorErr: r2(anchorErr), turnDeg: +t.deg.toFixed(3) }, pass: Math.abs(k - Math.exp(0.2)) <= 1e-3 && anchorErr <= 1 && t.deg < 0.05 };
        });

        for (const where of ["frame", "host"]) await leg(`gesture-${where}`, async ({ page, frame, read, reset, off }) => {
            await reset();
            const a = await read();
            // Near the centre, so the ×1.5 die still rests inside its bound (the whole die on the stage) and
            // the anchor is read without the spring back acting.
            const at = { x: a.c.x - 12, y: a.c.y + 8 };
            const dispatch = ({ x, y, host }) => {
                const target = host ? document.querySelector(".motion .scene, .scene") : document.elementFromPoint(x, y);
                const g = (type, scale, rotation, el) => {
                    const e = new Event(type, { bubbles: true, cancelable: true });
                    Object.defineProperties(e, { scale: { value: scale }, rotation: { value: rotation }, clientX: { value: x }, clientY: { value: y } });
                    el.dispatchEvent(e);
                    return e.defaultPrevented;
                };
                const prevented = [g("gesturestart", 1, 0, target)];
                for (let i = 1; i <= 10; i++) prevented.push(g("gesturechange", 1 + 0.05 * i, 3 * i, target));
                prevented.push(g("gestureend", 1.5, 30, target));
                return prevented;
            };
            const prevented = where === "frame"
                ? await frame.evaluate(dispatch, { x: at.x, y: at.y, host: false })
                : await page.evaluate(dispatch, { x: at.x + off.x, y: at.y + off.y, host: true });
            await page.waitForTimeout(600);
            const b = await read();
            const k = b.s / a.s;
            const want = { x: at.x + k * (a.c.x - at.x), y: at.y + k * (a.c.y - at.y) };
            const anchorErr = Math.hypot(b.c.x - want.x, b.c.y - want.y);
            const t = turn(a.tf, b.tf);
            return { gesture: { k: +k.toFixed(4), anchorErr: r2(anchorErr), rollDeg: r2(t.rollDeg), tiltDeg: r2(t.tiltDeg), prevented: prevented.every(Boolean) }, pass: Math.abs(k - 1.5) <= 0.005 && anchorErr <= 1 && Math.abs(Math.abs(t.rollDeg) - 30) <= 0.5 && t.tiltDeg <= 1 };
        });

        if (!phone) await leg("rim-roll", async ({ page, read, reset, off }) => {
            await reset();
            const a = await read();
            const R = Math.min(a.side * a.s, Math.max(96, 0.5 * Math.min(a.stage.r - a.stage.l, a.stage.b - a.stage.t)));
            const r = R + 40;
            const pt = (deg) => ({ x: a.c.x + r * Math.cos((deg * Math.PI) / 180) + off.x, y: a.c.y + r * Math.sin((deg * Math.PI) / 180) + off.y });
            const p0 = pt(-45);
            await page.mouse.move(p0.x, p0.y);
            await page.mouse.down();
            for (let i = 1; i <= 45; i++) { const p = pt(-45 + 2 * i); await page.mouse.move(p.x, p.y); await page.waitForTimeout(16); }
            await page.waitForTimeout(250);
            await page.mouse.up();
            await page.waitForTimeout(700);
            const b = await read();
            const t = turn(a.tf, b.tf);
            return { rimRoll: { R: r2(R), arcRadius: r2(r), rollDeg: r2(t.rollDeg), tiltDeg: r2(t.tiltDeg) }, pass: Math.abs(Math.abs(t.rollDeg) - 90) <= 2 && t.tiltDeg <= 1 };
        });

        await leg("reset-home", async ({ page, read, reset, off, record, prm }) => {
            await reset();
            const a = await read();
            // Perturb: a wheel pan and a ctrl-wheel zoom, inside the bound.
            await page.mouse.move(a.c.x + off.x, a.c.y + off.y);
            for (let i = 0; i < 6; i++) { await page.mouse.wheel(-20, 15); await page.waitForTimeout(16); }
            await page.keyboard.down("Control");
            await page.mouse.wheel(0, -25);
            await page.keyboard.up("Control");
            await page.waitForTimeout(900);
            const b = await read();
            const recP = record(1400);
            await reset(0);
            const tr = await recP;
            const s0 = b.s, s1 = 1;
            const travel = Math.abs(s0 - s1);
            const ss = tr.map((p) => p.s);
            const steps = ss.map((v, i) => Math.abs(v - (i ? ss[i - 1] : s0)));
            const moving = steps.filter((v) => v > 1e-6);
            const firstMove = moving[0] ?? 0;
            const end = await read();
            const homeOk = Math.abs(end.s - 1) < 1e-6 && Math.hypot(end.c.x - end.rest.x, end.c.y - end.rest.y) < 0.5;
            return {
                resetHome: { s0: +s0.toFixed(4), frames: moving.length, firstShare: travel ? r2(firstMove / travel) : null, maxShare: travel ? r2(Math.max(...steps) / travel) : null, end: { s: +end.s.toFixed(5), dx: r2(end.c.x - end.rest.x), dy: r2(end.c.y - end.rest.y) } },
                pass: prm ? homeOk : homeOk && travel > 0.05 && moving.length >= 6 && firstMove / travel <= 0.04 && Math.max(...steps) / travel <= 0.12,
            };
        });

        await leg("ready-transport", async ({ page }) => {
            const readies = await page.evaluate(() => window.__readies ?? []);
            const t = readies.find((r) => r.slice === "cube")?.transport ?? null;
            const grad = (v) => typeof v === "string" && /gradient/.test(v);
            return { readyTransport: t, readies: readies.length, pass: !!t && grad(t.rest) && grad(t.playing) && t.rest !== t.playing && typeof t.ink === "string" && t.ink.length > 0 };
        });
    }
} finally {
    await browser.close();
}
const summary = { engine: ENGINE, kfDist: KF_DIST, dkDist: DK_DIST, at: new Date().toISOString(), pass: out.filter((c) => c.pass).length, fail: out.filter((c) => !c.pass).map((c) => c.cell) };
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({ ...summary, out }, null, 1));
}
console.log(JSON.stringify(summary, null, 1));
