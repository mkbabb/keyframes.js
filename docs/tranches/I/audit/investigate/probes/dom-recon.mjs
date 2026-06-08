#!/usr/bin/env node
/**
 * DOM recon — dump the dock + play-button + controls DOM shape on a couple of
 * scenes so the matrix probe can target the REAL gesture surfaces (the first
 * matrix run fell back to hash-nav because the dock locator missed).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const chromium = (() => { try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; } })();

const main = async () => {
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(`${e.name}: ${e.message}\n${(e.stack||"").split("\n").slice(0,8).join("\n")}`));
    page.on("console", (m) => { if (m.type() === "error") errs.push(`[console.error] ${m.text()}`); });

    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1500);

    // Dump every clickable that could be a dock/nav target.
    const dock = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("a,button,[role=button],[data-scene],[data-scene-id]")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            out.push({
                tag: el.tagName,
                href: el.getAttribute("href") || null,
                aria: el.getAttribute("aria-label") || null,
                title: el.getAttribute("title") || null,
                dataScene: el.getAttribute("data-scene") || el.getAttribute("data-scene-id") || null,
                cls: (el.getAttribute("class") || "").slice(0, 80),
                text: (el.textContent || "").trim().slice(0, 40),
                hasSvg: !!el.querySelector("svg"),
                x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
            });
        }
        return out;
    });
    console.log("=== CLICKABLES on /cube (n=" + dock.length + ") ===");
    for (const d of dock) console.log("  " + JSON.stringify(d));

    // Find the play control.
    const play = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("button,[role=button]")) {
            const cls = el.getAttribute("class") || "";
            const svgcls = [...el.querySelectorAll("svg")].map((s) => s.getAttribute("class") || "").join(" ");
            const aria = el.getAttribute("aria-label") || "";
            if (/play|pause/i.test(cls + " " + svgcls + " " + aria)) {
                const r = el.getBoundingClientRect();
                out.push({ aria, cls: cls.slice(0,60), svgcls: svgcls.slice(0,80), x: Math.round(r.x), y: Math.round(r.y) });
            }
        }
        return out;
    });
    console.log("\n=== PLAY/PAUSE candidates on /cube ===");
    for (const p of play) console.log("  " + JSON.stringify(p));

    console.log("\n=== ERRORS so far ===");
    for (const e of errs) console.log("  " + e.replace(/\n/g, "\n    "));

    await browser.close();
    server.close();
};
main().catch((e) => { console.error(e); process.exit(1); });
