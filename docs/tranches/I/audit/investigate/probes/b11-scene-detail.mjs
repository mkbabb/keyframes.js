#!/usr/bin/env node
/**
 * b11-scene-detail — per-scene deep playback check:
 *  (1) does the target animate ON ITS OWN over 2s (auto-play / idle)?
 *  (2) does clicking the rainbow group-play TOGGLE it (start↔stop)?
 *  (3) does Reset (aria "Reset animation") work without error?
 *  (4) does opening the Keyframes controls-tab throw (B5)?
 * Targets the controls-panel tab by clicking the "Controls tab" dock-select then
 * choosing Keyframes; falls back to text match.
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
async function openScene(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(`${e.name}: ${e.message.slice(0,80)}`));
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1000);
    return { ctx, page, errs };
}
async function fp(page) {
    return page.evaluate(() => {
        const sel = [".stage-cell *", "[class*=target i]", "[class*=ball i]", "[class*=cube i]", "[class*=traveller i]", "canvas"].join(",");
        return [...document.querySelectorAll(sel)].slice(0, 40).map((el) => {
            const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
            return { t: cs.transform, o: cs.opacity, l: Math.round(r.left), tp: Math.round(r.top) };
        });
    });
}
function diff(a, b) { let c = 0; const m = Math.min(a.length, b.length); for (let i=0;i<m;i++){const x=a[i],y=b[i]; if(!x||!y)continue; if(x.t!==y.t||x.o!==y.o||x.l!==y.l||x.tp!==y.tp)c++;} return { changed: c, sampled: m }; }
async function clickAria(page, reSrc) {
    return page.evaluate((src) => {
        const rx = new RegExp(src, "i");
        const b = [...document.querySelectorAll("button,[role=button]")].find(x => { const a=x.getAttribute("aria-label")||""; const r=x.getBoundingClientRect(); return rx.test(a) && r.width>0; });
        if (!b) return false; b.click(); return true;
    }, reSrc);
}

async function main() {
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];
    console.log(`# b11-scene-detail — base ${base}`);
    for (const scene of SCENES) {
        const { ctx, page, errs } = await openScene(browser, base, scene);
        try {
            errs.length = 0;
            // (1) idle/auto animation over 1.6s, NO interaction
            const a = await fp(page); await page.waitForTimeout(1600); const b = await fp(page);
            const idle = diff(a, b);
            const playLabel = await page.evaluate(() => { const x=[...document.querySelectorAll("button")].find(z=>/(play|pause) animation$/i.test(z.getAttribute("aria-label")||"")); return x?x.getAttribute("aria-label"):null; });
            // (2) toggle group-play
            const c0 = await fp(page);
            await clickAria(page, "(play|pause) animation$");
            await page.waitForTimeout(1400);
            const c1 = await fp(page);
            const toggled = diff(c0, c1);
            const toggleErrs = errs.length;
            // (3) reset
            errs.length = 0;
            const resetClicked = await clickAria(page, "reset animation");
            await page.waitForTimeout(500);
            const resetErrs = errs.length;
            // (4) keyframes tab — open the Controls-tab dock-select, choose Keyframes
            errs.length = 0;
            const kfOpened = await page.evaluate(() => {
                const trig = [...document.querySelectorAll("button")].find(b => /controls tab/i.test(b.getAttribute("aria-label")||""));
                if (trig) trig.click();
                return !!trig;
            });
            await page.waitForTimeout(400);
            const kfPicked = await page.evaluate(() => {
                const opt = [...document.querySelectorAll("[role=option],[role=menuitem],button,li")].find(o => /^keyframes$/i.test((o.textContent||"").trim()));
                if (opt) { opt.click(); return true; } return false;
            });
            await page.waitForTimeout(900);
            const kfState = await page.evaluate(() => {
                const ed = document.querySelector(".monaco-editor, [class*=editor i], textarea");
                const txt = ed ? (ed.textContent||"").slice(0,80) : "(no editor)";
                const placeholder = document.body.innerText.includes("no CSS twin");
                return { hasEditor: !!ed, txt, placeholder };
            });
            const kfErrs = errs.length;

            console.log(`\n## ${scene}`);
            console.log(`  idle-animate: ${idle.changed}/${idle.sampled} changed over 1.6s (auto-play=${playLabel === "Pause animation"})`);
            console.log(`  group-toggle: clicked "${playLabel}" → ${toggled.changed}/${toggled.sampled} changed | pageerrors=${toggleErrs}`);
            console.log(`  reset: clicked=${resetClicked} | pageerrors=${resetErrs}`);
            console.log(`  keyframes-tab: ctrlTrig=${kfOpened} picked=${kfPicked} hasEditor=${kfState.hasEditor} noCSStwinPlaceholder=${kfState.placeholder} | pageerrors=${kfErrs}`);
            if (kfState.placeholder) console.log(`    → B5: editor shows "no CSS twin" placeholder`);
            console.log(`    editor head: ${JSON.stringify(kfState.txt)}`);
        } catch (e) { console.log(`\n## ${scene}: PROBE ERROR ${e.message}`); }
        finally { await ctx.close(); }
    }
    await browser.close();
    server.close();
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
