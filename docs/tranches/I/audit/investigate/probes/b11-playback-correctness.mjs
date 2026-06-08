#!/usr/bin/env node
/**
 * b11-playback-correctness — Tranche I INVESTIGATION probe (v2, precise-target).
 *
 * Drives PLAYWRIGHT against the BUILT dist/gh-pages and exercises PLAYBACK on
 * every scene by clicking the RAINBOW GROUP-PLAY button (aria-label "Play/Pause
 * animation", NOT the dark-mode toggle), the Reset control, and a scrub slider.
 * Captures whether the target ACTUALLY animates (transform/opacity/pos deltas)
 * and every page.on("console")/page.on("pageerror") VERBATIM.
 *
 * Also opens the Keyframes editor tab (the B1 CSSKeyframesToString crash path)
 * to reproduce the "Parse error at offset 0" engine crash.
 *
 * Models scripts/proof-no-orphan-specular.mjs (serveDist port 0 + chromium via
 * createRequire(KF_PLAYWRIGHT_DIR) + openSceneFresh `${base}/#/${scene}`).
 *
 * RUN: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b11-playback-correctness.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });

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
    const consoleLines = [];
    const pageErrors = [];
    page.on("console", (msg) => {
        const t = msg.type();
        if (t === "error" || t === "warning") consoleLines.push(`[${t}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => pageErrors.push(`${err.name}: ${err.message}\n${err.stack ?? ""}`));
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page, consoleLines, pageErrors };
}

async function captureFingerprint(page) {
    return page.evaluate(() => {
        const sel = [".stage-cell *", "[class*=target i]", "[class*=ball i]", "[class*=cube i]", "[class*=square i]", "[class*=row i]", "canvas", "[class*=marker i]"].join(",");
        const nodes = [...document.querySelectorAll(sel)].slice(0, 50);
        return nodes.map((el, i) => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return { i, tag: el.tagName.toLowerCase(), cls: (el.className && el.className.toString ? el.className.toString() : "").slice(0, 36), transform: cs.transform, opacity: cs.opacity, left: Math.round(r.left), top: Math.round(r.top) };
        });
    });
}
function diffFingerprint(a, b) {
    let changed = 0; const max = Math.min(a.length, b.length); const details = [];
    for (let i = 0; i < max; i++) {
        const x = a[i], y = b[i]; if (!x || !y) continue;
        const mt = x.transform !== y.transform, mo = x.opacity !== y.opacity, mp = x.left !== y.left || x.top !== y.top;
        if (mt || mo || mp) {
            changed++;
            if (details.length < 6) details.push(`${x.tag}.${x.cls || "(none)"}: ` + (mt ? `T[${x.transform.slice(0,20)}→${y.transform.slice(0,20)}] ` : "") + (mo ? `O[${x.opacity}→${y.opacity}] ` : "") + (mp ? `P[${x.left},${x.top}→${y.left},${y.top}]` : ""));
        }
    }
    return { changed, sampled: max, details };
}

/** Click a control found by an aria-label regex. Returns {clicked, label}. */
async function clickByAria(page, re) {
    const hit = await page.evaluate((reSrc) => {
        const rx = new RegExp(reSrc, "i");
        const cands = [...document.querySelectorAll("button, [role=button]")];
        for (const b of cands) {
            const aria = b.getAttribute("aria-label") || "";
            if (!rx.test(aria)) continue;
            const r = b.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            // skip the collapsed-dock duplicate (smaller, off to the side)
            return { x: r.x + r.width / 2, y: r.y + r.height / 2, aria, w: r.width };
        }
        return null;
    }, re.source ?? re);
    if (!hit) return { clicked: false };
    await page.mouse.click(hit.x, hit.y);
    return { clicked: true, label: hit.aria };
}

/** Click the Keyframes editor tab (the B1 path). Tries the tablist labels. */
async function openKeyframesTab(page) {
    return page.evaluate(() => {
        const cands = [...document.querySelectorAll("button, [role=tab], [role=button], a")];
        for (const b of cands) {
            const txt = (b.textContent || "").trim().toLowerCase();
            const aria = (b.getAttribute("aria-label") || "").toLowerCase();
            if (txt === "keyframes" || aria.includes("keyframes")) {
                const r = b.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) { b.click(); return { found: true, txt: txt || aria }; }
            }
        }
        return { found: false };
    });
}

const REPORT = [];
const log = (s) => { REPORT.push(s); console.log(s); };

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist/gh-pages not built"); process.exit(2); }
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    log(`# b11-playback-correctness v2 — base ${base}`);

    const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];
    const browser = await chromium.launch();
    const summary = {};

    try {
        for (const scene of SCENES) {
            log(`\n## scene: ${scene}`);
            const { ctx, page, consoleLines, pageErrors } = await openSceneFresh(browser, base, scene);
            const rec = { loadConsole: [], loadErrors: [], group: {}, reset: {}, scrub: {}, keyframesTab: {} };
            try {
                rec.loadConsole = [...consoleLines]; rec.loadErrors = [...pageErrors];
                log(`  LOAD: console=${rec.loadConsole.length} pageerrors=${rec.loadErrors.length}`);
                for (const e of rec.loadErrors.slice(0, 2)) log(`    LOAD ERR: ${e.split("\n").slice(0,3).join("\n    ")}`);
                for (const c of rec.loadConsole.slice(0, 3)) log(`    LOAD: ${c.slice(0, 140)}`);

                // ── GROUP PLAY (the rainbow button) ──────────────────────────
                consoleLines.length = 0; pageErrors.length = 0;
                const before = await captureFingerprint(page);
                const play = await clickByAria(page, /^(play|pause) animation$/i);
                await page.waitForTimeout(1600);
                const after = await captureFingerprint(page);
                const d = diffFingerprint(before, after);
                rec.group = { clicked: play.clicked, label: play.label ?? null, changed: d.changed, sampled: d.sampled, details: d.details, console: [...consoleLines], errors: [...pageErrors] };
                log(`  GROUP-PLAY clicked=${play.clicked} ("${play.label ?? ""}") → animated ${d.changed}/${d.sampled} | console=${consoleLines.length} pageerrors=${pageErrors.length}`);
                for (const det of d.details) log(`      Δ ${det}`);
                for (const e of pageErrors.slice(0, 2)) log(`    GROUP ERR: ${e.split("\n").slice(0,7).join("\n    ")}`);
                for (const c of consoleLines.slice(0, 5)) log(`    GROUP: ${c.slice(0, 160)}`);
                await page.screenshot({ path: path.join(SHOTS, `b11-${scene}-grouplay.png`) });

                // ── SCRUB (slider thumb / range) ─────────────────────────────
                consoleLines.length = 0; pageErrors.length = 0;
                const scrub = await page.evaluate(() => {
                    const s = document.querySelector("input[type=range], [role=slider], .slider-thumb, [class*=scrub i]");
                    if (!s) return { found: false };
                    // walk to the track if we grabbed a thumb
                    const track = s.closest("[class*=slider i], [class*=track i]") || s.parentElement || s;
                    const r = track.getBoundingClientRect();
                    return { found: true, x0: r.x + r.width * 0.12, y: r.y + r.height / 2, x1: r.x + r.width * 0.85, tag: s.tagName.toLowerCase() };
                });
                if (scrub.found) {
                    const bs = await captureFingerprint(page);
                    await page.mouse.move(scrub.x0, scrub.y); await page.mouse.down();
                    await page.mouse.move((scrub.x0 + scrub.x1) / 2, scrub.y, { steps: 10 });
                    await page.mouse.move(scrub.x1, scrub.y, { steps: 10 });
                    await page.mouse.up(); await page.waitForTimeout(400);
                    const as = await captureFingerprint(page);
                    const ds = diffFingerprint(bs, as);
                    rec.scrub = { found: true, changed: ds.changed, sampled: ds.sampled, details: ds.details, errors: [...pageErrors] };
                    log(`  SCRUB → animated ${ds.changed}/${ds.sampled} | pageerrors=${pageErrors.length}`);
                    for (const det of ds.details.slice(0, 3)) log(`      Δ ${det}`);
                    for (const e of pageErrors.slice(0, 1)) log(`    SCRUB ERR: ${e.split("\n").slice(0,4).join("\n    ")}`);
                } else { rec.scrub = { found: false }; log(`  SCRUB no slider found`); }

                // ── RESET ────────────────────────────────────────────────────
                consoleLines.length = 0; pageErrors.length = 0;
                const reset = await clickByAria(page, /reset animation/i);
                await page.waitForTimeout(500);
                rec.reset = { clicked: reset.clicked, errors: [...pageErrors], console: [...consoleLines] };
                log(`  RESET clicked=${reset.clicked} | pageerrors=${pageErrors.length} console=${consoleLines.length}`);
                for (const e of pageErrors.slice(0, 1)) log(`    RESET ERR: ${e.split("\n").slice(0,4).join("\n    ")}`);

                // ── KEYFRAMES TAB (B1 CSSKeyframesToString crash path) ───────
                consoleLines.length = 0; pageErrors.length = 0;
                const kf = await openKeyframesTab(page);
                await page.waitForTimeout(1000);
                rec.keyframesTab = { ...kf, errors: [...pageErrors], console: [...consoleLines] };
                log(`  KEYFRAMES-TAB found=${kf.found} ("${kf.txt ?? ""}") | pageerrors=${pageErrors.length} console=${consoleLines.length}`);
                for (const e of pageErrors.slice(0, 2)) log(`    KF ERR: ${e.split("\n").slice(0,7).join("\n    ")}`);
                for (const c of consoleLines.slice(0, 4)) log(`    KF: ${c.slice(0, 200)}`);
            } catch (e) {
                log(`  PROBE ERROR ${scene}: ${e.message}`);
                rec.probeError = e.message;
            } finally {
                summary[scene] = rec;
                await ctx.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    fs.writeFileSync(path.join(SHOTS, "..", "b11-playback-summary.json"), JSON.stringify(summary, null, 2));
    log(`\n# wrote docs/tranches/I/audit/investigate/b11-playback-summary.json`);
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
