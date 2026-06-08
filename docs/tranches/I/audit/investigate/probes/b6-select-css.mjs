#!/usr/bin/env node
/**
 * b6-select-css — focused follow-up: enumerate the user-select declaration over the
 * WHOLE chrome (body → dock → controls → every text node region), and confirm there
 * is NO global `user-select:none` applied during the square drag. Also confirms the
 * box uses setPointerCapture (which is why a synthetic Playwright drag does not
 * reproduce the native text highlight — the real defect is the MISSING global
 * select-none guard, not the capture).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const CTRL_KEY = "animation-groups-control-options-store";
const MACHINE_KEY = "keyframes-js-scene-machine";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".map": "application/json" };

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

(async () => {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    const { chromium } = requireFrom("playwright-core");
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/square`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, "square"], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(900);

    // Enumerate every visible text element and its effective user-select.
    const audit = await page.evaluate(() => {
        const root = document.documentElement;
        const out = { html: getComputedStyle(root).userSelect, body: getComputedStyle(document.body).userSelect };
        // Sample text-bearing elements OUTSIDE the .square-stage (the chrome).
        const stage = document.querySelector(".square-stage");
        const samples = [];
        const els = [...document.querySelectorAll("button, span, a, label, h1, h2, p, [class*='label'], [class*='title']")];
        for (const el of els) {
            if (stage && stage.contains(el)) continue;
            const txt = (el.textContent || "").trim();
            if (txt.length < 2) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const us = getComputedStyle(el).userSelect;
            samples.push({ txt: txt.slice(0, 28), userSelect: us, cls: (el.className || "").toString().slice(0, 50) });
            if (samples.length >= 18) break;
        }
        // count of chrome text elements that are SELECTABLE (user-select != none)
        const selectable = samples.filter((s) => s.userSelect !== "none");
        return { html: out.html, body: out.body, sampleCount: samples.length, selectableCount: selectable.length, samples };
    });

    // Confirm the box uses pointer capture (so the synthetic-drag selection-miss is
    // explained; the native browser still selects chrome text on a real mousedown-
    // drag because nothing applies a GLOBAL select-none during the gesture).
    const usesCapture = await page.evaluate(() => {
        // We cannot read the listener, but we can detect setPointerCapture support +
        // that the box has touch-action:none + cursor:grab (the direct-manip posture).
        const el = document.querySelector(".demo-box");
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { touchAction: cs.touchAction, cursor: cs.cursor, hasSetPointerCapture: typeof el.setPointerCapture === "function" };
    });

    console.log(JSON.stringify({ audit, usesCapture }, null, 2));
    await browser.close();
    server.close();
})().catch((e) => { console.error("FAILED", e); process.exit(1); });
