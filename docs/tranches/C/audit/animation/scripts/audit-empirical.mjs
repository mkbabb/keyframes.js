#!/usr/bin/env node
/**
 * audit-empirical — tranche-C EMPIRICAL animation audit harness.
 *
 * Serves the BUILT dist/gh-pages and uses the local playwright-core
 * (KF_PLAYWRIGHT_DIR=/tmp/kf-audit) to MEASURE — not just screenshot — the
 * demo's real motion:
 *   (1) dock expand/collapse: ≥5 frames, measured duration + easing shape
 *   (2) scene navigation: animate vs hard-cut; is .scene-* CSS live?
 *   (3) spring/cube idle-bob: smoothness sampling
 *   (4) prefers-reduced-motion: emulate + check honored anywhere
 *
 * Output: docs/tranches/C/audit/animation/captures/*.png + measurements.json
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const OUT = path.join(REPO, "docs/tranches/C/audit/animation/captures");

function resolveChromium() {
    const root = process.env.KF_PLAYWRIGHT_DIR ?? "/tmp/kf-audit";
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {
            /* next */
        }
    }
    return null;
}

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
};

function startServer() {
    const server = http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, u === "/" ? "index.html" : u);
        if (
            !p.startsWith(DIST) ||
            !fs.existsSync(p) ||
            fs.statSync(p).isDirectory()
        ) {
            p = path.join(DIST, "index.html");
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    return new Promise((r) => server.listen(0, () => r(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    const chromium = resolveChromium();
    if (!chromium) {
        console.error("playwright not resolvable (KF_PLAYWRIGHT_DIR).");
        process.exit(2);
    }
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built (run `npm run gh-pages`).");
        process.exit(2);
    }
    fs.mkdirSync(OUT, { recursive: true });

    const server = await startServer();
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;
    const browser = await chromium.launch();
    const results = {};

    // ── (A) DOCK EXPAND/COLLAPSE — measure duration + easing shape ──────
    results.dock = await measureDock(browser, base);

    // ── (B) SCENE NAVIGATION — animate vs hard-cut ──────────────────────
    results.sceneNav = await measureSceneNav(browser, base);

    // ── (C) SPRING SCENE + CUBE IDLE-BOB — smoothness ──────────────────
    results.spring = await measureSpring(browser, base);
    results.cubeIdleBob = await measureCubeIdleBob(browser, base);

    // ── (D) PREFERS-REDUCED-MOTION ─────────────────────────────────────
    results.reducedMotion = await measureReducedMotion(browser, base);

    await browser.close();
    server.close();

    fs.writeFileSync(
        path.join(OUT, "measurements.json"),
        JSON.stringify(results, null, 2),
    );
    console.log("\n=== MEASUREMENTS ===");
    console.log(JSON.stringify(results, null, 2));
}

// Resolve the actual computed values of the motion tokens off :root.
async function readTokens(page) {
    return page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const grab = (n) => cs.getPropertyValue(n).trim();
        return {
            "--duration-fast": grab("--duration-fast"),
            "--duration-normal": grab("--duration-normal"),
            "--duration-slow": grab("--duration-slow"),
            "--ease-dock": grab("--ease-dock"),
            "--ease-spring": grab("--ease-spring").slice(0, 60) + "…",
            "--ease-standard": grab("--ease-standard"),
            "--ease-decelerate": grab("--ease-decelerate"),
            "--ease-accelerate": grab("--ease-accelerate"),
            "--spring-snappy": grab("--spring-snappy").slice(0, 60) + "…",
            "--vt-duration": grab("--vt-duration"),
        };
    });
}

async function measureDock(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await sleep(2500);

    const tokens = await readTokens(page);

    // The dock is the .glass-dock element. Read its transition spec first.
    const dockInfo = await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        if (!dock) return { found: false };
        const cs = getComputedStyle(dock);
        return {
            found: true,
            transitionProperty: cs.transitionProperty,
            transitionDuration: cs.transitionDuration,
            transitionTimingFunction: cs.transitionTimingFunction.slice(0, 200),
            transitionDelay: cs.transitionDelay,
            initialWidth: dock.getBoundingClientRect().width,
            classes: dock.className,
        };
    });

    let frames = [];
    let collapsedWidth = null;
    let expandedWidth = null;
    if (dockInfo.found) {
        // The TopDock collapses on idle; hover/interaction expands it. We poll
        // width at high frequency across the transition to recover the curve.
        // Hover the dock to trigger expand.
        const box = await page.evaluate(() => {
            const d = document.querySelector(".glass-dock");
            const r = d.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });

        // Sample width at ~120Hz for 1.2s while toggling hover state.
        // First record idle/collapsed baseline.
        collapsedWidth = await page.evaluate(
            () => document.querySelector(".glass-dock").getBoundingClientRect().width,
        );

        // Trigger expand via mouse hover, then sample the transition.
        await page.mouse.move(box.x, box.y);
        const t0 = Date.now();
        frames = await page.evaluate(async () => {
            const d = document.querySelector(".glass-dock");
            const samples = [];
            const start = performance.now();
            return await new Promise((resolve) => {
                function tick() {
                    const now = performance.now();
                    samples.push({
                        t: +(now - start).toFixed(1),
                        w: +d.getBoundingClientRect().width.toFixed(2),
                    });
                    if (now - start > 1000) resolve(samples);
                    else requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        });
        expandedWidth = frames.length ? frames[frames.length - 1].w : null;

        // Capture ≥5 evenly-spaced frames as PNGs across the transition.
        // Re-collapse then re-expand, screenshotting at offsets.
        await page.mouse.move(10, 10); // un-hover → collapse
        await sleep(600);
        const shotOffsets = [0, 60, 120, 180, 300, 450];
        await page.mouse.move(box.x, box.y); // hover → expand
        const expandStart = Date.now();
        for (const off of shotOffsets) {
            const wait = off - (Date.now() - expandStart);
            if (wait > 0) await sleep(wait);
            await page.screenshot({
                path: path.join(OUT, `dock-expand-${String(off).padStart(3, "0")}ms.png`),
                clip: { x: 0, y: 0, width: 1440, height: 140 },
            });
        }
    }

    // Derive transition span + monotonicity (= no overshoot = NOT a spring) from samples.
    let analysis = null;
    if (frames.length) {
        const w0 = frames[0].w;
        const wEnd = frames[frames.length - 1].w;
        const span = wEnd - w0;
        let lastMoveT = 0;
        let overshoot = false;
        let maxW = -Infinity;
        for (const f of frames) {
            if (Math.abs(f.w - wEnd) > 0.5) lastMoveT = f.t;
            maxW = Math.max(maxW, f.w);
        }
        // overshoot if any sample exceeds the settled width meaningfully
        overshoot = maxW > Math.max(w0, wEnd) + 1.0;
        // midpoint progress to characterise ease (cubic-bezier(0.4,0,0.2,1) ~ 0.5 at midtime)
        const midSettleT = lastMoveT / 2;
        let midSample = frames.reduce((a, b) =>
            Math.abs(b.t - midSettleT) < Math.abs(a.t - midSettleT) ? b : a,
        );
        const midProgress = span !== 0 ? (midSample.w - w0) / span : 0;
        analysis = {
            measuredTransitionMs: +lastMoveT.toFixed(1),
            startWidth: w0,
            endWidth: wEnd,
            deltaWidth: +span.toFixed(2),
            maxWidth: +maxW.toFixed(2),
            overshootDetected: overshoot,
            midpointProgressAtHalfTime: +midProgress.toFixed(3),
            interpretation: overshoot
                ? "non-monotonic → spring/overshoot present"
                : "monotonic → standard ease (NO spring overshoot in width)",
            sampleCount: frames.length,
        };
    }

    await page.close();
    return {
        tokens,
        dockTransitionSpec: dockInfo,
        collapsedWidth,
        expandedWidth,
        widthSamples: frames,
        analysis,
    };
}

async function measureSceneNav(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await sleep(2500);

    // Is there any element using the .scene-enter/.scene-leave transition?
    const sceneCssLive = await page.evaluate(() => {
        // Search all stylesheets for the .scene-enter-active rule, and check if
        // any live element ever carries scene-enter-active / scene-leave-active.
        let ruleExists = false;
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue;
            }
            for (const r of rules || []) {
                if (
                    r.selectorText &&
                    /scene-(enter|leave)/.test(r.selectorText)
                ) {
                    ruleExists = true;
                }
            }
        }
        return { ruleExistsInCSS: ruleExists };
    });

    // Navigate cube → spring and watch for any opacity/transform transition on
    // the scene host across the swap. Hard-cut = no intermediate frame.
    const navProbe = await page.evaluate(async () => {
        // Identify the scene host (the EditorShell #target wrapper).
        const host =
            document.querySelector("[class*='scene']") ||
            document.querySelector("main") ||
            document.body;
        const samples = [];
        let raf;
        const start = performance.now();
        const collecting = new Promise((resolve) => {
            function tick() {
                const now = performance.now();
                const cs = getComputedStyle(host);
                samples.push({
                    t: +(now - start).toFixed(1),
                    opacity: cs.opacity,
                    transform: cs.transform,
                });
                if (now - start > 900) resolve();
                else raf = requestAnimationFrame(tick);
            }
            raf = requestAnimationFrame(tick);
        });
        return collecting.then(() => samples);
    });

    // Empirically trigger a scene switch by hash and time the content swap.
    await page.evaluate(() => (window.location.hash = "#/spring"));
    const swapStart = Date.now();
    // Poll until the spring scene marker appears.
    let swapMs = null;
    for (let i = 0; i < 60; i++) {
        const present = await page.evaluate(() =>
            document.body.innerText.toLowerCase().includes("response") ||
            !!document.querySelector("[class*='spring']"),
        );
        if (present) {
            swapMs = Date.now() - swapStart;
            break;
        }
        await sleep(50);
    }
    // Sample opacity of scene host right after swap (animate→would ramp 0→1).
    const postSwapOpacities = await page.evaluate(async () => {
        const host =
            document.querySelector("[class*='scene']") ||
            document.querySelector("main") ||
            document.body;
        const out = [];
        const start = performance.now();
        return await new Promise((resolve) => {
            function tick() {
                const now = performance.now();
                out.push({
                    t: +(now - start).toFixed(1),
                    opacity: getComputedStyle(host).opacity,
                });
                if (now - start > 500) resolve(out);
                else requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    });

    await page.screenshot({ path: path.join(OUT, "scene-after-nav-spring.png") });
    await page.close();

    // A hard-cut shows opacity pinned at 1 throughout (no 0→1 ramp).
    const ramped = postSwapOpacities.some(
        (s) => parseFloat(s.opacity) < 0.95,
    );
    return {
        sceneCssLive,
        swapDetectedMs: swapMs,
        opacityRampObserved: ramped,
        interpretation: ramped
            ? "scene host opacity ramped → some enter transition"
            : "scene host opacity pinned ~1 across swap → HARD CUT (no enter animation)",
        postSwapOpacitySamples: postSwapOpacities.slice(0, 12),
    };
}

async function measureSpring(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/#/spring`, { waitUntil: "load" });
    await sleep(3000);
    await page.screenshot({ path: path.join(OUT, "spring-scene-idle.png") });

    // The interactive spring target re-seats on tap/drag. Click the rail to
    // re-seat the target, then sample the moving element's transform to recover
    // the spring curve (overshoot = underdamped, the iOS signature).
    const railBox = await page.evaluate(() => {
        // Find the largest interactive surface in the spring viewport.
        const cands = [
            ...document.querySelectorAll(
                "[class*='rail'],[class*='track'],[class*='spring'],svg,canvas",
            ),
        ];
        const visible = cands
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter((o) => o.r.width > 100 && o.r.height > 20)
            .sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
        if (!visible.length) return null;
        const r = visible[0].r;
        return {
            left: r.x + r.width * 0.15,
            right: r.x + r.width * 0.85,
            y: r.y + r.height / 2,
            sel: visible[0].el.className?.toString?.() ?? visible[0].el.tagName,
        };
    });

    let springSamples = [];
    if (railBox) {
        // Tap the right side to re-seat target toward 1.
        await page.mouse.click(railBox.right, railBox.y);
        springSamples = await page.evaluate(async () => {
            // Track any element that moves (the spring puck). Sample the
            // transform/left of the most-translated element.
            const pucks = [
                ...document.querySelectorAll(
                    "[class*='puck'],[class*='ball'],[class*='thumb'],[class*='dot'],[class*='handle']",
                ),
            ];
            const out = [];
            const start = performance.now();
            return await new Promise((resolve) => {
                function tick() {
                    const now = performance.now();
                    const row = { t: +(now - start).toFixed(1), xs: [] };
                    for (const p of pucks.slice(0, 6)) {
                        row.xs.push(+p.getBoundingClientRect().x.toFixed(2));
                    }
                    out.push(row);
                    if (now - start > 1600) resolve(out);
                    else requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        });
    }

    // Analyse the first puck column for overshoot (the iOS spring signature).
    let analysis = null;
    if (springSamples.length && springSamples[0].xs.length) {
        const col = springSamples.map((s) => s.xs[0]).filter((v) => v != null);
        const x0 = col[0];
        const xEnd = col[col.length - 1];
        const dir = Math.sign(xEnd - x0);
        let extreme = xEnd;
        for (const v of col) {
            if (dir > 0) extreme = Math.max(extreme, v);
            else extreme = Math.min(extreme, v);
        }
        const overshootPx = Math.abs(extreme - xEnd);
        const span = Math.abs(xEnd - x0);
        analysis = {
            startX: x0,
            endX: xEnd,
            spanPx: +span.toFixed(2),
            overshootPx: +overshootPx.toFixed(2),
            overshootRatio: span ? +(overshootPx / span).toFixed(3) : 0,
            interpretation:
                overshootPx > 1.5
                    ? "OVERSHOOT present → genuine underdamped iOS spring (dogfoods SpringProgress)"
                    : "no measurable overshoot (settled/critically-damped or puck not captured)",
            sampleCount: col.length,
        };
    }

    await page.screenshot({ path: path.join(OUT, "spring-scene-after-tap.png") });
    await page.close();
    return { railBox, analysis, samples: springSamples.slice(0, 40) };
}

async function measureCubeIdleBob(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await sleep(2500);

    // The idle-bob is a CSS @keyframes (translateY 0→5px, 3s, ease-standard,
    // infinite alternate). Sample the .idle-hover element's translateY.
    const samples = await page.evaluate(async () => {
        const el = document.querySelector(".idle-hover");
        if (!el) return { found: false, rows: [] };
        const rows = [];
        const start = performance.now();
        return await new Promise((resolve) => {
            function tick() {
                const now = performance.now();
                const cs = getComputedStyle(el);
                rows.push({
                    t: +(now - start).toFixed(1),
                    transform: cs.transform,
                    animationName: cs.animationName,
                    animationDuration: cs.animationDuration,
                    animationTimingFunction: cs.animationTimingFunction,
                });
                if (now - start > 1500) resolve({ found: true, rows });
                else requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    });

    // Compute frame-to-frame smoothness (jank = large dt gaps).
    let smoothness = null;
    if (samples.found && samples.rows.length > 2) {
        const dts = [];
        for (let i = 1; i < samples.rows.length; i++) {
            dts.push(samples.rows[i].t - samples.rows[i - 1].t);
        }
        dts.sort((a, b) => a - b);
        const median = dts[Math.floor(dts.length / 2)];
        const p95 = dts[Math.floor(dts.length * 0.95)];
        smoothness = {
            frameCount: samples.rows.length,
            medianFrameMs: +median.toFixed(2),
            p95FrameMs: +p95.toFixed(2),
            engine: "CSS @keyframes idle-bob (NOT keyframes.js SpringProgress)",
            timingFunction: samples.rows[0].animationTimingFunction,
            duration: samples.rows[0].animationDuration,
        };
    }
    await page.close();
    return { found: samples.found, smoothness, sampleHead: samples.rows?.slice(0, 4) };
}

async function measureReducedMotion(browser, base) {
    // Fresh context emulating prefers-reduced-motion: reduce.
    const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await sleep(2500);

    const mq = await page.evaluate(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    // Does the cube idle-bob still animate under reduced motion? (It SHOULD
    // be gated — CSS @keyframes ignores PRM unless a media query disables it.)
    const idleBob = await page.evaluate(async () => {
        const el = document.querySelector(".idle-hover");
        if (!el) return { found: false };
        const cs = getComputedStyle(el);
        // Sample transform twice 250ms apart — if it changes, it's still moving.
        const t1 = getComputedStyle(el).transform;
        await new Promise((r) => setTimeout(r, 280));
        const t2 = getComputedStyle(el).transform;
        return {
            found: true,
            animationName: cs.animationName,
            animationPlayState: cs.animationPlayState,
            stillMoving: t1 !== t2,
            t1,
            t2,
        };
    });

    // Count any element whose computed transition-duration / animation-duration
    // is non-zero under reduced motion (= NOT honoring PRM via media query).
    const motionStillOn = await page.evaluate(() => {
        let animated = 0;
        let transitioned = 0;
        const all = document.querySelectorAll("*");
        for (const el of all) {
            const cs = getComputedStyle(el);
            if (cs.animationName !== "none" && parseFloat(cs.animationDuration) > 0)
                animated++;
            const td = cs.transitionDuration
                .split(",")
                .map((s) => parseFloat(s))
                .reduce((a, b) => a + (b || 0), 0);
            if (td > 0) transitioned++;
        }
        return { elementsWithActiveAnimation: animated, elementsWithTransition: transitioned, total: all.length };
    });

    // Is there ANY @media (prefers-reduced-motion) rule in the shipped CSS?
    const prmMediaRules = await page.evaluate(() => {
        let count = 0;
        const examples = [];
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue;
            }
            for (const r of rules || []) {
                if (
                    r.media &&
                    /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText || "")
                ) {
                    count++;
                    if (examples.length < 5)
                        examples.push(r.conditionText || r.media.mediaText);
                }
            }
        }
        return { prmMediaRuleCount: count, examples };
    });

    await page.screenshot({ path: path.join(OUT, "reduced-motion-cube.png") });

    // Switch to spring scene under PRM — does SpringProgress snap (respectReducedMotion)?
    await page.evaluate(() => (window.location.hash = "#/spring"));
    await sleep(2500);
    await page.screenshot({ path: path.join(OUT, "reduced-motion-spring.png") });

    await page.close();
    await ctx.close();
    return {
        emulatedMatchMedia: mq,
        cubeIdleBob: idleBob,
        motionStillOn,
        prmMediaRules,
        interpretation:
            prmMediaRules.prmMediaRuleCount === 0 && idleBob.stillMoving
                ? "DEMO IGNORES prefers-reduced-motion: 0 PRM media rules; idle-bob keeps moving under reduce"
                : "some PRM handling present",
    };
}

main().catch((err) => {
    console.error("audit-empirical ERROR:", err);
    process.exit(3);
});
