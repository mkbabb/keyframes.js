#!/usr/bin/env node
/** Switch scenes via the reka-ui "Scene" select-trigger (open → pick item from
 *  the portal listbox). Capture errors on each transition. Uses real Playwright
 *  locators (click + keyboard) rather than el.click() so the reka popper opens. */
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
const noise = (t) => /content-visibility|Rendering was performed/i.test(t);

const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];
const LABEL = { cube: "Cube", amiga: "Amiga", square: "Square", easing: "Easing", spring: "Spring", sequence: "Sequence", "motion-path": "Motion Path" };

async function readMachine(page) { return page.evaluate((mk)=>{try{return JSON.parse(localStorage.getItem(mk)||"{}");}catch{return{};}}, MACHINE_KEY); }

/** Open the "Scene" select and pick the target label. Returns true if arrived. */
async function switchVia(page, toLabel) {
    const trigger = page.locator('button[aria-label="Scene"]').first();
    if (await trigger.count() === 0) return { ok: false, why: "no Scene trigger" };
    await trigger.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(350);
    // The reka listbox renders items in a portal. Try role=option then text.
    const item = page.locator(`[role=option], [role=menuitem], [data-radix-collection-item]`).filter({ hasText: new RegExp(`^${toLabel}$`, "i") }).first();
    let used = "option-locator";
    if (await item.count() === 0) {
        // Fallback: any clickable in an open popper with the exact label.
        const alt = page.getByText(new RegExp(`^${toLabel}$`), { exact: false }).last();
        if (await alt.count() === 0) return { ok: false, why: "no item " + toLabel };
        await alt.click({ timeout: 3000 }).catch(() => {});
        used = "getByText";
    } else {
        await item.click({ timeout: 3000 }).catch(() => {});
    }
    return { ok: true, used };
}

async function clickPlay(page) {
    const b = page.locator('button[aria-label="Play animation"]').first();
    if (await b.count() === 0) return false;
    await b.click({ timeout: 2500 }).catch(() => {});
    return true;
}

const main = async () => {
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const results = [];

    // From each of a few representative PLAYING scenes, switch to every other.
    const FROM = ["cube", "amiga", "square", "easing", "spring"];
    for (const A of FROM) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        const errs = [];
        page.on("console", (m) => { if ((m.type()==="error"||m.type()==="warning") && !noise(m.text())) errs.push(`[${m.type()}] ${m.text()}`); });
        page.on("pageerror", (e) => errs.push(`[PAGEERROR] ${e.name}: ${e.message} :: ${(e.stack||"").split("\n")[1]?.trim()||""}`));
        try {
            await page.goto(`${base}/#/${A}`, { waitUntil: "load" });
            await page.waitForTimeout(1500);
            const loadErrs = [...errs]; errs.length = 0;

            // engage play
            const played = await clickPlay(page);
            await page.waitForTimeout(700);
            const playErrs = [...errs]; errs.length = 0;

            for (const B of SCENES) {
                if (B === A) continue;
                errs.length = 0;
                const before = await readMachine(page);
                const sw = await switchVia(page, LABEL[B]);
                await page.waitForTimeout(1400);
                const after = await readMachine(page);
                const arrived = after.activeScene === B;
                const aSnap = after?.perScene?.[A];
                results.push({
                    from: A, to: B, playedA: played, switchOk: sw.ok, switchWhy: sw.why || sw.used,
                    arrived, activeNow: after.activeScene,
                    aSnapPlaying: aSnap?.playing ?? null,
                    switchErrs: errs.slice(0, 6),
                });
                if (errs.length || !arrived) {
                    await page.screenshot({ path: path.join(SHOTS, `sw2_${A}_to_${B}.png`) }).catch(()=>{});
                }
                // Return to A for the next pairing (fresh-ish; same context to keep snapshots).
                if (arrived) { await switchVia(page, LABEL[A]); await page.waitForTimeout(900); }
            }
            // record load/play errors against the A-row
            results.push({ from: A, phase: "load+play", playedA: played, loadErrs, playErrs });
        } catch (e) {
            results.push({ from: A, harnessError: String(e?.message||e) });
        } finally {
            await ctx.close();
        }
    }

    await browser.close();
    server.close();
    const out = path.join(HERE, "..", "b12-switch-via-select.json");
    fs.writeFileSync(out, JSON.stringify(results, null, 2));
    console.log("WROTE " + path.relative(REPO, out));
    for (const r of results) {
        if (r.phase === "load+play") { console.log(`  [${r.from}] LOAD errs=${r.loadErrs.length} PLAY errs=${r.playErrs.length}`); for(const e of r.loadErrs.concat(r.playErrs)) console.log("      "+e); continue; }
        if (r.harnessError) { console.log(`  [${r.from}] HARNESS ${r.harnessError}`); continue; }
        const tag = r.switchErrs.length ? "ERR " : (r.arrived ? "ok  " : "MISS");
        console.log(`  ${tag} ${r.from} -> ${r.to}  arrived=${r.arrived} active=${r.activeNow} aSnapPlaying=${r.aSnapPlaying} switch=${r.switchWhy}`);
        for (const e of r.switchErrs) console.log("      " + e);
    }
};
main().catch((e) => { console.error(e); process.exit(1); });
