#!/usr/bin/env node
/**
 * B2 ROOT-CAUSE MINIMAL REPRO — the `_gen` TypeError from the UNBOUND
 * `playback.stop` passed to useSceneVisibilityPause (useEasingDemo.ts:227,
 * useSpringDemo.ts:365).
 *
 * The watch fires on a document-visibility change. We open #/easing (autoPlay
 * runs the raw-rAF loop, so `wasRunning()` is TRUE), then flip the page to
 * HIDDEN via Playwright's emulateMedia/CDP visibility — the watch invokes the
 * bare `playback.stop` with this=undefined → `this._gen++` throws. This is the
 * SAME unbound-method crash the easing→amiga dock switch triggers (the swap
 * teardown perturbs visibility / flushes the watch). Deterministic, no flaky
 * dock UI. Serves the BUILT dist/gh-pages.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../shots");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".ttf":"font/ttf",".woff2":"font/woff2",".svg":"image/svg+xml",".webp":"image/webp" };
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const { chromium } = requireFrom("playwright-core");
const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

async function repro(scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push({ message: e.message, stack: (e.stack||"").split("\n").slice(0,6).join("\n") }));
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk,s]) => { try { return JSON.parse(localStorage.getItem(mk)||"{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(()=>{});
    await page.waitForTimeout(1500);

    const client = await ctx.newCDPSession(page);
    const errBefore = pageErrors.length;
    // Drive the document into the HIDDEN visibility state — fires the
    // useSceneVisibilityPause watch → the UNBOUND `playback.stop`.
    await client.send("Emulation.setVisibilityChange", { hidden: true }).catch(async () => {
        // Fallback: dispatch the event manually (older CDP).
        await page.evaluate(() => {
            Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
            Object.defineProperty(document, "hidden", { value: true, configurable: true });
            document.dispatchEvent(new Event("visibilitychange"));
        });
    });
    await page.waitForTimeout(600);
    const errAfter = pageErrors.slice(errBefore);
    await page.screenshot({ path: path.join(SHOTS, `b14-gen-crash-${scene}.png`) });
    await ctx.close();
    return { scene, crashed: errAfter.length > 0, errors: errAfter };
}

const results = [];
for (const s of ["easing", "spring"]) results.push(await repro(s));
console.log("===GEN-CRASH-JSON-START===");
console.log(JSON.stringify(results, null, 2));
console.log("===GEN-CRASH-JSON-END===");

await browser.close();
server.close();
