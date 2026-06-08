#!/usr/bin/env node
/**
 * b11-dom-inspect — enumerate the actual interactive controls per scene so the
 * playback probe targets the RIGHT control (rainbow group-play, transport
 * play/pause, scrub slider) rather than the dark-mode toggle.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
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
function loadChromium() {
    const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; }
}
async function openSceneFresh(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(`${e.name}: ${e.message}\n${e.stack ?? ""}`));
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page, errs };
}

async function main() {
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const scene = process.argv[2] || "cube";
    const { ctx, page, errs } = await openSceneFresh(browser, base, scene);
    const controls = await page.evaluate(() => {
        const out = [];
        const all = [...document.querySelectorAll("button, [role=button], input, [role=slider]")];
        for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            const cls = (el.className && el.className.toString ? el.className.toString() : "");
            out.push({
                tag: el.tagName.toLowerCase(),
                type: el.getAttribute("type") || "",
                aria: el.getAttribute("aria-label") || "",
                title: el.getAttribute("title") || "",
                text: (el.textContent || "").trim().slice(0, 30),
                rainbow: /rainbow/i.test(cls),
                cls: cls.slice(0, 60),
                x: Math.round(r.x + r.width / 2),
                y: Math.round(r.y + r.height / 2),
                w: Math.round(r.width),
                h: Math.round(r.height),
            });
        }
        return out;
    });
    console.log(`# ${scene} — ${controls.length} visible controls`);
    for (const c of controls) {
        console.log(`  ${c.tag}${c.type ? "["+c.type+"]" : ""} @(${c.x},${c.y}) ${c.w}x${c.h}${c.rainbow ? " RAINBOW" : ""} aria="${c.aria}" title="${c.title}" text="${c.text}" cls="${c.cls}"`);
    }
    if (errs.length) console.log(`# load errors:\n${errs.map(e => "  " + e.split("\n").slice(0,3).join("\n  ")).join("\n")}`);
    await ctx.close();
    await browser.close();
    server.close();
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
