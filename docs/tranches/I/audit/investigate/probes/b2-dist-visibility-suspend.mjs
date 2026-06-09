#!/usr/bin/env node
/**
 * RED-3 RE-VERIFY PROBE — does the B2 `_gen` suspend throw reproduce on the BUILT
 * `dist/gh-pages/` via a SYNTHETIC `visibilitychange → hidden` while a raw-rAF
 * (easing) scene PLAYS? (The earlier `b2-dfa-gen-crash.mjs` only hash-NAVIGATED,
 * which does NOT co-fire the visibility tick — so it never exercised this path on
 * dist; it saw the "......" storm instead. This probe dispatches the deterministic
 * synthetic tick that clause (a) of proof:fsm-suspend-resume-live specifies.)
 *
 * Models proof-no-orphan-specular.mjs (serveDist on port 0 + chromium-core).
 * Captures page.on("console") + page.on("pageerror") verbatim.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".map": "application/json",
};
const MACHINE_KEY = "keyframes-js-scene-machine";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built");
        process.exit(2);
    }
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    let chromium;
    try {
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        ({ chromium } = requireFrom("@playwright/test"));
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const sink = { console: [], pageerrors: [] };
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("console", (m) => sink.console.push({ type: m.type(), text: m.text() }));
    page.on("pageerror", (e) =>
        sink.pageerrors.push({ message: e.message, stack: e.stack }),
    );

    await page.goto(`${base}/#/easing`, { waitUntil: "load" });
    // Wait only until the scene is ACTIVE (not a long settle). The throw fires only
    // while the raw-rAF loop is LIVE (early in the auto-play window); a long settle
    // lets the demo loop go idle and the throw window closes.
    await page
        .waitForFunction(
            (mk) => {
                try {
                    const m = JSON.parse(localStorage.getItem(mk) || "{}");
                    return m.activeScene === "easing";
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(700);

    const machineAfterPlay = await page.evaluate((mk) => {
        try {
            return JSON.parse(localStorage.getItem(mk) || "null");
        } catch {
            return null;
        }
    }, MACHINE_KEY);

    // SYNTHETIC visibilitychange → hidden (the deterministic trigger). @vueuse
    // useDocumentVisibility reads document.visibilityState fresh inside its own
    // `visibilitychange` listener, so we override the PROTOTYPE getter (not the
    // instance) BEFORE dispatching, so the listener observes "hidden". The throw
    // only fires when v.running (the rAF loop) is true at the tick — so we keep a
    // background rAF alive and retry the dispatch a few times. (On the BUILT dist
    // this is INTERMITTENT — the loop must be live at the tick; on the :5174 dev
    // server it is DETERMINISTIC. See b2-dist-visibility-suspend.result.json.)
    await page.evaluate(() => {
        const proto = Object.getPrototypeOf(document) || Document.prototype;
        try {
            Object.defineProperty(proto, "visibilityState", {
                configurable: true,
                get: () => "hidden",
            });
            Object.defineProperty(proto, "hidden", {
                configurable: true,
                get: () => true,
            });
        } catch {
            Object.defineProperty(document, "visibilityState", {
                configurable: true,
                get: () => "hidden",
            });
            Object.defineProperty(document, "hidden", {
                configurable: true,
                get: () => true,
            });
        }
    });
    // The throw fires only on a tick where `playback.running` (the rAF `_rafId`) is
    // true. The demo's auto-play loop is live for a window right after mount; we keep
    // it warm with our own rAF spinner AND fire the visibility tick on each frame for
    // ~1.5s, so at least one tick lands while the scene loop is live and the unbound
    // pause() throws. (This is the same shape as the run that captured the verbatim
    // dist stack `at stop (engine-Do5bTwuK.js:1:2437)`.)
    await page.evaluate(
        () =>
            new Promise((resolve) => {
                const deadline = performance.now() + 1500;
                const tick = () => {
                    document.dispatchEvent(new Event("visibilitychange"));
                    window.dispatchEvent(new Event("blur"));
                    window.dispatchEvent(new Event("pagehide"));
                    if (performance.now() < deadline) requestAnimationFrame(tick);
                    else resolve();
                };
                requestAnimationFrame(tick);
            }),
    );
    await page.waitForTimeout(300);

    const genThrows = sink.pageerrors.filter((e) => /_gen/.test(e.message || ""));
    const dotsStorm = sink.console.filter((c) => /\.\.\.\.\.\./.test(c.text || ""));

    console.log(
        JSON.stringify(
            {
                target: "BUILT dist/gh-pages (engine-Do5bTwuK.js + lazy EasingScene chunk)",
                trigger:
                    "synthetic visibilitychange→hidden while easing raw-rAF scene plays (NO dock gesture, NO hash-nav)",
                unboundSite:
                    "EasingScene-DpL60cpI.js: ie(()=>v.running, v.stop, w) — bare unbound playback.stop survives minification",
                easingPlayingFlag:
                    machineAfterPlay?.perScene?.easing?.playing ??
                    machineAfterPlay?.status ??
                    null,
                pageerrors: sink.pageerrors,
                genThrowCount: genThrows.length,
                dotsStormCount: dotsStorm.length,
                verdict: genThrows.length
                    ? "_gen THROWS on built dist — RED-3 (a) holds: _gen is NOT dev-only (field name survives minification). INTERMITTENT on dist (loop must be live at the tick); DETERMINISTIC on the :5174 dev server."
                    : "no _gen throw THIS run — INTERMITTENT on dist (re-run, or use the :5174 dev server for the deterministic witness)",
            },
            null,
            2,
        ),
    );

    await browser.close();
    server.close();
}

main().catch((e) => {
    console.error("PROBE ERROR:", e);
    process.exit(1);
});
