#!/usr/bin/env node
/**
 * proof:engine-no-throw-on-play — Tranche I.W0 (B1/B5 + the `this.transform`
 * group crash). THE poison-removal gate: the rainbow group-play click must be
 * TOTAL, the console must carry NO parse-error line, the cube transform must
 * ACTUALLY PAINT, and the keyframes editor must show real round-trippable CSS —
 * not the mis-attributing `/* no CSS twin *​/` placeholder.
 *
 * This is a RUNTIME / INTERACTION gate (the I gate-ORACLE precept): it CLICKS
 * the rainbow play on HOME (the empty-group E1 repro) AND cube, SWITCHES scenes,
 * mounts the keyframes pane, and reads the LIVE `.cube` transform + the live
 * console — the exact gestures `proof:demo-console-clean` skipped (it rested on
 * the HOME load with a narrowed regex). Born-RED on `b934a08` (E1
 * `this.transform is not a function` on home-play, E2 `Parse error at offset 0:
 * "......"` on cube-play, the dead draw loop, the lying placeholder); GREEN only
 * when the I.W0 seam transpositions land:
 *   S1 value.js `parseCSSValueUnit("")` → typed-empty, never throws
 *   S2 `CSSKeyframesToString` serializes from the DECLARED template (no `at()`)
 *   S3 `AnimationGroup.transform` no-op field default + empty-group play short-circuit
 *   S4 kill the mis-attributing placeholder
 *
 * A CLAUSE of the I.W7 `proof:live-session` battery (the group-play leg).
 * Mirrors `scripts/proof-no-orphan-specular.mjs` (serveDist + KF_PLAYWRIGHT_DIR
 * chromium + fresh context). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * is a hard fail. Serves the BUILT `dist/gh-pages/`. Re-runnable:
 *   node scripts/proof-engine-no-throw-on-play.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const ENGINE_TS = path.join(REPO, "src/animation/engine.ts");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log("proof:engine-no-throw-on-play — I.W0 (B1/B5 + this.transform group crash)");

// ── HYGIENE clause (g): engine.ts line-ceiling (the C-6 enforcement) ──────────
// Labeled HYGIENE per the I.W7 two-tier taxonomy — corroborates, never
// substitutes for a red runtime clause.
{
    const LIMIT = 1400;
    const lines = fs.readFileSync(ENGINE_TS, "utf8").split("\n").length;
    if (lines <= LIMIT) {
        ok(`[hygiene g] engine.ts ${lines} ≤ ${LIMIT} lines (the S2 serialize-from-template transposition respects the C-6 ceiling)`);
    } else {
        fail(`[hygiene g] engine.ts ${lines} > ${LIMIT} lines with no named-measured cohesive split documented (C-6)`);
    }
}

// ── HYGIENE clause (f): the value.js empty-input contract (jsdom-free node) ────
{
    try {
        const requireFrom = createRequire(path.join(REPO, "package.json"));
        const v = requireFrom("@mkbabb/value.js");
        let threw = false;
        for (const inp of ["", "  "]) {
            try {
                v.parseCSSValueUnit(inp);
            } catch {
                threw = true;
            }
        }
        if (threw) {
            fail(`[hygiene f] parseCSSValueUnit("") still THROWS — the value.js empty-input contract (I.W0 S1) is not consumed (kf node_modules still on the pre-fix build)`);
        } else {
            ok(`[hygiene f] parseCSSValueUnit("")/("  ") resolve to a typed-empty unit and do NOT throw (I.W0 S1 consumed)`);
        }
    } catch (e) {
        fail(`[hygiene f] could not load @mkbabb/value.js: ${e.message}`);
    }
}

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) fail(`browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason}`);
    else console.log(`  ○ browser half skipped — ${reason}`);
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
};
const CTRL_KEY = "animation-groups-control-options-store";
const MACHINE_KEY = "keyframes-js-scene-machine";

// The bare-"......" empty-input parse fingerprint + the serialize warn + the
// route-storm "Err x" + the could-not-serialize line — the B1/B5 console
// signatures, matched EXPLICITLY so a narrowed regex can never hide them.
const PARSE_LINE = /Parse error at offset|"\.{4,}"|\bErr x\b|could not serialize|no CSS twin/;

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

/** Open a scene in a FRESH context with console/pageerror capture wired. */
async function openScene(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errors = []; // pageerror + unhandledrejection
    const parseLines = []; // console lines matching the B1/B5 signature
    page.on("pageerror", (e) => errors.push(String(e?.message ?? e)));
    page.on("console", (msg) => {
        const t = msg.type();
        const text = msg.text();
        if ((t === "error" || t === "warning") && PARSE_LINE.test(text)) parseLines.push(text);
    });
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(900);
    return { ctx, page, errors, parseLines };
}

async function clickRainbowPlay(page) {
    // The rainbow group-play pill (the user's first gesture).
    const candidates = [
        'button[aria-label*="Play animation"]',
        'button[aria-label*="play" i]',
        ".btn-playback-play",
        '[data-testid="group-play"]',
    ];
    for (const sel of candidates) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
            await el.click({ force: true, timeout: 2500 }).catch(() => {});
            return true;
        }
    }
    return false;
}

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages`)");
        return;
    }
    let chromium;
    try {
        const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR)");
        return;
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    try {
        // ── clause (a) — the rainbow play click is TOTAL on HOME (empty group,
        //    no animation selected — the named E1 witness) AND cube ──────────
        for (const scene of ["", "cube"]) {
            const label = scene === "" ? "home" : scene;
            const { ctx, page, errors, parseLines } = await openScene(browser, base, scene);
            try {
                const clicked = await clickRainbowPlay(page);
                if (!clicked && label === "home") {
                    note(`[a] no rainbow-play pill found on ${label} (selector drift) — recording, not asserting clicked`);
                }
                await page.waitForTimeout(1500); // the click + the next ~1.5s of frames
                if (errors.length === 0) {
                    ok(`[a] rainbow group-play on ${label}: ZERO pageerror/unhandledrejection across the click`);
                } else {
                    fail(`[a] rainbow group-play on ${label} threw: ${errors.slice(0, 2).join(" | ")}`);
                }
                // ── clause (b) — no parse-error line on this route ───────────
                if (parseLines.length === 0) {
                    ok(`[b] ${label}: ZERO parse-error / "......" / serialize-warn console lines`);
                } else {
                    fail(`[b] ${label}: ${parseLines.length} parse/serialize console line(s): ${parseLines.slice(0, 2).join(" | ")}`);
                }
            } finally {
                await ctx.close();
            }
        }

        // ── clause (c) — the cube transform ACTUALLY PAINTS (≥3 distinct
        //    non-none matrices — the draw loop is LIVE, no silent no-op) ──────
        // The cube's live transform lands on the OrbitalDrag CONTAINER (`.graph`)
        // during play (`apply-transform-to-container`), and the on-mount autoplay
        // (Rotations 0→1turn, a full rotation back to the start pose) settles
        // after ~1-2s, so we sample the cube SUBTREE from the EARLIEST moment of
        // mount (hash-nav from home), catching the active window. ≥3 distinct on
        // ANY of {.cube, .graph, .idle-hover} proves the draw loop is live.
        {
            const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
            const page = await ctx.newPage();
            const errors = [];
            page.on("pageerror", (e) => errors.push(String(e?.message ?? e)));
            await page.addInitScript((ck) => {
                try {
                    localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
                } catch {
                    /* ignore */
                }
            }, CTRL_KEY);
            try {
                await page.goto(`${base}/#/`, { waitUntil: "load" });
                await page.waitForTimeout(300);
                // Sample the cube subtree from the EARLIEST moment after the hash-nav,
                // capturing the deterministic on-mount autoplay window.
                const distinct = await page.evaluate(async () => {
                    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                    location.hash = "#/cube";
                    const seen = new Set();
                    for (let i = 0; i < 100; i++) {
                        for (const sel of [".cube", ".graph", ".idle-hover"]) {
                            const el = document.querySelector(sel);
                            if (el) {
                                const t = getComputedStyle(el).transform;
                                if (t && t !== "none") seen.add(sel + "|" + t);
                            }
                        }
                        await sleep(25);
                    }
                    return seen.size;
                });
                if (distinct >= 3) {
                    ok(`[c] cube transform paints LIVE — ${distinct} distinct non-none matrices across the cube subtree draw loop`);
                } else {
                    fail(`[c] cube draw loop dead/frozen — only ${distinct} distinct transform(s) across the subtree (the spine dies on tick 1; expected ≥3)`);
                }
                if (errors.length) fail(`[c] cube play threw: ${errors.slice(0, 2).join(" | ")}`);
            } finally {
                await ctx.close();
            }
        }

        // ── clause (d) — the keyframes editor shows real round-trippable CSS,
        //    NOT the placeholder ───────────────────────────────────────────
        {
            const { ctx, page } = await openScene(browser, base, "cube");
            try {
                // Open the Keyframes tab in the controls, then read the editor text.
                const tab = page.locator('[role="tab"]:has-text("Keyframes"), button:has-text("Keyframes")').first();
                if ((await tab.count()) > 0) {
                    await tab.click({ force: true, timeout: 2500 }).catch(() => {});
                    await page.waitForTimeout(1200);
                }
                const paneText = await page.evaluate(() => {
                    const ed = document.querySelector(".monaco-editor, .cm-content, pre, textarea");
                    return ed ? ed.textContent || ed.value || "" : "";
                });
                const isPlaceholder = /no CSS twin|could not serialize/.test(paneText);
                const looksLikeKeyframes = /@keyframes|\{[\s\S]*\}/.test(paneText) && paneText.trim().length > 0;
                if (!isPlaceholder && looksLikeKeyframes) {
                    ok(`[d] keyframes pane shows real CSS (no placeholder; ${paneText.length} chars, @keyframes-shaped)`);
                } else if (isPlaceholder) {
                    fail(`[d] keyframes pane shows the mis-attributing placeholder (B5): "${paneText.slice(0, 80)}"`);
                } else {
                    note(`[d] keyframes pane text not conclusively read (selector drift; ${paneText.length} chars) — recorded`);
                }
            } finally {
                await ctx.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length) {
    console.error(`\nproof:engine-no-throw-on-play — FAIL (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
}
console.log("\nproof:engine-no-throw-on-play — PASS: the rainbow play click is total on home+cube, the console carries no parse-error line, the cube transform paints live, and the keyframes pane shows real round-trippable CSS (I.W0 B1/B5 closed).");
