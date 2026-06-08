#!/usr/bin/env node
/** Capture the FULL load-time error verbatim + discover the scene-switch
 *  dropdown mechanism (the "Scene"/"Cube" dock-select-trigger). */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.join(HERE, "..", "shots");
fs.mkdirSync(SHOTS, { recursive: true });
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
const MACHINE_KEY = "keyframes-js-scene-machine";

const main = async () => {
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const log = [];
    page.on("console", (m) => log.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => log.push(`[PAGEERROR] ${e.name}: ${e.message}\n  STACK:\n    ${(e.stack||"").split("\n").slice(0,12).join("\n    ")}`));

    // 1) Load cube; capture the load-time error in full.
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    console.log("===== LOAD-TIME LOG (/cube) =====");
    for (const l of log) console.log(l + "\n---");

    // 2) Engage the bottom-bar PLAY (expanded dock) so cube is genuinely playing.
    log.length = 0;
    const played = await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((e) => /^Play animation$/.test(e.getAttribute("aria-label")||""));
        if (b) { b.click(); return true; } return false;
    });
    await page.waitForTimeout(700);
    const statusAfterPlay = await page.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}}, MACHINE_KEY);
    console.log("\n===== PLAY clicked:", played, "machine.status implied — perScene keys:", Object.keys(statusAfterPlay.perScene||{}), "=====");
    for (const l of log) console.log(l + "\n---");

    // 3) Open the "Scene" dropdown (aria=Scene) and dump its menu items.
    log.length = 0;
    await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((e)=> (e.getAttribute("aria-label")||"")==="Scene");
        b?.click();
    });
    await page.waitForTimeout(500);
    const menu = await page.evaluate(() => {
        const items = [...document.querySelectorAll('[role=menuitem],[role=option],[data-radix-collection-item],[cmdk-item],li,a')]
            .filter((el)=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;})
            .map((el)=>({tag:el.tagName, role:el.getAttribute("role"), text:(el.textContent||"").trim().slice(0,30), cls:(el.getAttribute("class")||"").slice(0,50)}));
        return items.slice(0,40);
    });
    console.log("\n===== SCENE DROPDOWN ITEMS (after clicking aria=Scene) =====");
    for (const m of menu) console.log("  " + JSON.stringify(m));
    await page.screenshot({ path: path.join(SHOTS, "scene-dropdown-open.png") }).catch(()=>{});

    // 4) Click the "Amiga" menu item → the real scene switch gesture. Capture errors.
    log.length = 0;
    const clickedAmiga = await page.evaluate(() => {
        const el = [...document.querySelectorAll('[role=menuitem],[role=option],[data-radix-collection-item],li,a,button')]
            .find((e)=>/^amiga$/i.test((e.textContent||"").trim()));
        if (el) { el.click(); return true; } return false;
    });
    await page.waitForTimeout(1800);
    const afterSwitch = await page.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}}, MACHINE_KEY);
    console.log("\n===== SWITCH cube->amiga (clicked menu item:", clickedAmiga, ") activeScene=", afterSwitch.activeScene, "=====");
    for (const l of log) console.log(l + "\n---");
    await page.screenshot({ path: path.join(SHOTS, "after-cube-to-amiga.png") }).catch(()=>{});

    await browser.close();
    server.close();
};
main().catch((e) => { console.error(e); process.exit(1); });
