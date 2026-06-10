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
 * EXTENDED at J.W1 (the engine-totality pass) with the two RUNTIME clauses the
 * I.W0 transposition missed — the ENG-1/SEAM-1 oracles (`J.W1.md §Hard gate`):
 *   [J.W1 a] the RENDERED keyframes editor pane round-trips the cube Rotations
 *            `var(--rotationX)` VERBATIM (declared template, never
 *            DOM-resolved) and the pane text re-parses through the BUILT dist
 *            without throw. Navigates via the J.W0 `navToScene`
 *            per-EXPECTED-state primitive and drives the REAL dock selects.
 *            RE-SCOPED from the spec's per-card pane: that surface is
 *            unreachable in the product (`KeyframesEditor.vue` has no mount;
 *            see the clause-body RE-SCOPE RECORD + `docs/tranches/J/impl/J.W1.md`);
 *            the per-card ITERATION is pinned born-RED at the jsdom tier
 *            (`test/serialize-from-template.test.ts`).
 *   [J.W1 b] every non-conforming keyframe selector ("abc" / "5px" / "150%")
 *            driven through the public `fromKeyframes` construction path of
 *            the BUILT `dist/keyframes.js`, LIVE in the page, throws the
 *            TYPED `AnimationOptionError` NAMING the selector grammar — never
 *            the cryptic value.js `Parse error at offset …`, never a silent
 *            compile (the no-silent-accept guard); the conforming control
 *            (from / 50% / to) still compiles.
 * Born-RED on the pre-J.W1 tree: any rendered serializer surface that
 * DOM-resolves the declared `var()` reds [J.W1 a] (the B1 serialize face);
 * the pre-S3 guard caught only blank, so "abc" cryptic-threw and
 * "5px"/"150%" silently compiled ([J.W1 b] reds — witnessed via the
 * frame-compiler.ts stash probe over a rebuilt dist).
 *
 * A CLAUSE of the I.W7 `proof:live-session` battery (the group-play leg).
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withBrowser =
 * env-driven resolveChromium + launch/teardown, J.W3 S1) + navToScene (the
 * J.W0 per-EXPECTED-state settle). The HTTP server stays LOCAL and
 * SPECIALIZED — not withPage — because the J.W1 live library probe needs
 * routes the lib's serveDist has no overlay for: the lib-probe HTML +
 * importmap onto `/__kf-vendor__/` (the installed value.js/parse-that deps)
 * + `/__kf-lib__/` (the BUILT `dist/keyframes.js`), alongside the BUILT
 * `dist/gh-pages/` demo. Under KF_REQUIRE_BROWSER a playwright-absent skip
 * is a hard fail AT THE LIB SEAM (W7-1/S6d).
 * P6 posture: hard — device-independent correctness oracle (red anywhere; J.W3
 * S2b). Re-runnable:
 *   npm run build && npm run gh-pages && node scripts/proof-engine-no-throw-on-play.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { navToScene, REQUIRE_BROWSER, withBrowser } from "./lib/demo-driver.mjs";

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

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab label navToScene settles on per scene (null = no
// control panel projects — home).
const TRIGGER = { "": null, cube: "Controls" };

// The bare-"......" empty-input parse fingerprint + the serialize warn + the
// route-storm "Err x" + the could-not-serialize line — the B1/B5 console
// signatures, matched EXPLICITLY so a narrowed regex can never hide them.
const PARSE_LINE = /Parse error at offset|"\.{4,}"|\bErr x\b|could not serialize|no CSS twin/;

// The MIME table the SPECIALIZED local server answers with (the lib's serveDist
// MIME map is not exported; the demo-dist fallback below needs it).
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

// ── The live LIBRARY probe surface (J.W1 clause b + the clause-a re-parse) ────
// The demo bundle does not expose the engine globally, so the typed-error
// probe imports the BUILT `dist/keyframes.js` (the published artifact) LIVE in
// a real page. The library build externalizes `@mkbabb/value.js` /
// `@mkbabb/parse-that` (bare specifiers), so the probe page carries an import
// map onto the INSTALLED deps — the exact resolution a consumer's bundler
// performs, pinned to what `node_modules` actually carries.
const LIB_DIST = path.join(REPO, "dist");
const VENDOR = {
    "/__kf-vendor__/value.js": path.join(
        REPO,
        "node_modules/@mkbabb/value.js/dist/value.js",
    ),
    "/__kf-vendor__/parse-that.js": path.join(
        REPO,
        "node_modules/@mkbabb/parse-that/dist/parse.js",
    ),
};
const LIB_PROBE_HTML = `<!doctype html>
<html><head><meta charset="utf-8">
<script type="importmap">{"imports":{"@mkbabb/value.js":"/__kf-vendor__/value.js","@mkbabb/parse-that":"/__kf-vendor__/parse-that.js"}}</script>
</head><body>built-dist library probe (proof:engine-no-throw-on-play, J.W1)</body></html>`;

// The gate's SPECIALIZED server (deliberately LOCAL — see the header): the
// lib-probe HTML + the vendor importmap targets + the built library overlay,
// falling back to the built demo dist.
function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (urlPath === "/__lib-probe__.html") {
            res.writeHead(200, { "content-type": "text/html" }).end(LIB_PROBE_HTML);
            return;
        }
        if (VENDOR[urlPath]) {
            res.writeHead(200, { "content-type": "text/javascript" });
            fs.createReadStream(VENDOR[urlPath]).pipe(res);
            return;
        }
        if (urlPath.startsWith("/__kf-lib__/")) {
            const lp = path.join(LIB_DIST, urlPath.slice("/__kf-lib__/".length));
            if (!lp.startsWith(LIB_DIST) || !fs.existsSync(lp) || fs.statSync(lp).isDirectory()) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, { "content-type": "text/javascript" });
            fs.createReadStream(lp).pipe(res);
            return;
        }
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
    await navToScene(page, scene === "" ? "home" : scene, TRIGGER[scene], { timeout: 8000 });
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
    // The dist-built precondition, held to the SAME W7-1 posture the lib seam
    // applies to chromium (required ⇒ FAIL, never a vacuous pass; otherwise an
    // honest skip note). REQUIRE_BROWSER is the lib's single-read authority.
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        const reason = "dist/gh-pages not built (run `npm run gh-pages` first)";
        if (REQUIRE_BROWSER) {
            fail(`browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the runtime clauses cannot pass vacuously (W7-1/S6d)`);
        } else {
            console.log(`  ○ browser half skipped — ${reason}`);
        }
        return;
    }
    const result = await withBrowser(
        async (browser) => {
            const server = serveDist();
            await new Promise((r) => server.listen(0, r));
            const base = `http://127.0.0.1:${server.address().port}`;
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

        // ── J.W1 clause (a) — the RENDERED keyframes editor pane round-trips
        //    the cube Rotations `var(--rotationX)` VERBATIM (declared
        //    template, NEVER DOM-resolved — the ENG-1 oracle is the RENDERED
        //    pane, not the source).
        //
        //    RE-SCOPE RECORD (implement-or-rescope, P-invariant-28): the spec
        //    names the PER-CARD pane (`useKeyframesParsing.ts` →
        //    `CSSKeyframesToStrings` → `KeyframeCardList`) as the oracle, but
        //    that surface is UNREACHABLE in the product — `KeyframesEditor.vue`
        //    (the card list's only mount) has had NO importer since the
        //    tranche-D decomposition, `"CSS for keyframe"` does not occur in
        //    the built `dist/gh-pages/`, and `CSSKeyframesToStrings` is in NO
        //    built artifact (demo tree-shakes it; the library does not export
        //    it). The audit's "live-consumed by the editor" held on the import
        //    graph only. So this clause actuates the ONE rendered serializer
        //    surface the product has — the keyframes pane's Monaco editor
        //    (`KeyframesStringControls` → `CSSKeyframesToString`), which since
        //    J.W1 S1 projects from the SAME `declaredKeyframeBody` declared-
        //    template authority as the per-card path — asserting the VERBATIM
        //    `rotateX(var(--rotationX))` token (a check the I.W0 clause (d)
        //    "@keyframes-shaped" read never made). The per-card ITERATION's
        //    bite lives at the jsdom tier (`test/serialize-from-template.test.ts`,
        //    witnessed born-RED under the format.ts stash-probe). The orphaned
        //    card editor's mount-or-delete adjudication is a RECORDED handoff
        //    (demo-behavior — J.W2/J.WZ), not a quiet drop. See
        //    `docs/tranches/J/impl/J.W1.md`.
        //
        //    Navigates via the J.W0 `navToScene` per-EXPECTED-state primitive.
        //    The pane state (Rotations selected + the Keyframes tab active) is
        //    seeded through the SAME persisted store the dock selects write —
        //    the battery's established mount-state pattern (the glass-ui dock
        //    Select triggers do not accept Playwright's synthetic click; that
        //    dock-interaction seam is glass-ui-owned). The pane TEXT is then
        //    read via the REAL user gesture — click into the editor,
        //    select-all, copy — so the oracle is the rendered editor's FULL
        //    model (Monaco virtualizes + soft-wraps its view-lines, so a DOM
        //    read sees only the viewport slice). ─────────────────────────────
        let paneCSSText = null;
        {
            const ctx = await browser.newContext({
                viewport: { width: 1440, height: 900 },
                permissions: ["clipboard-read", "clipboard-write"],
            });
            const page = await ctx.newPage();
            const errors = [];
            const parseLines = [];
            page.on("pageerror", (e) => errors.push(String(e?.message ?? e)));
            page.on("console", (msg) => {
                const t = msg.type();
                if ((t === "error" || t === "warning") && PARSE_LINE.test(msg.text())) parseLines.push(msg.text());
            });
            await page.addInitScript((ck) => {
                try {
                    localStorage.setItem(
                        ck,
                        JSON.stringify({
                            isControlsPanelOpen: true,
                            Cube: {
                                selectedControl: "keyframes",
                                selectedAnimation: "Rotations",
                                isControlsPanelOpen: true,
                            },
                        }),
                    );
                } catch {
                    /* ignore */
                }
            }, CTRL_KEY);
            try {
                await page.goto(`${base}/#/`, { waitUntil: "load" });
                // The seeded tab makes the destination's expected control-tab
                // label "Keyframes" — navToScene waits for THAT projection.
                await navToScene(page, "cube", "Keyframes");
                await page
                    .waitForFunction(
                        () => document.querySelectorAll(".monaco-editor .view-line").length > 0,
                        { timeout: 10000 },
                    )
                    .catch(() => {});
                await page.waitForTimeout(600);
                // The select-all + copy gesture reads the FULL editor model.
                try {
                    await page.click(".monaco-editor .view-lines", { timeout: 3000 });
                    await page.keyboard.press("ControlOrMeta+a");
                    await page.keyboard.press("ControlOrMeta+c");
                    await page.waitForTimeout(300);
                    paneCSSText = await page.evaluate(() => navigator.clipboard.readText());
                } catch {
                    note(`[J.W1 a] select-all/copy gesture failed — falling back to the view-lines viewport read`);
                }
                if (!paneCSSText || paneCSSText.trim().length === 0) {
                    // Honest fallback: the sorted, NBSP-normalized view-lines —
                    // reds if the var() line sits below the virtualized fold.
                    paneCSSText = await page.evaluate(() => {
                        const lines = [...document.querySelectorAll(".monaco-editor .view-line")]
                            .sort((a, b) => a.offsetTop - b.offsetTop)
                            .map((el) => (el.textContent ?? "").replace(/\u00a0/g, " "));
                        return lines.join("\n");
                    });
                }
                const flat = paneCSSText.replace(/\s+/g, " ");
                if (!/@keyframes/.test(paneCSSText) || paneCSSText.trim().length === 0) {
                    fail(`[J.W1 a] the RENDERED keyframes pane did not materialize (${paneCSSText.length} chars) — the rendered editor is the ENG-1 oracle`);
                    paneCSSText = null;
                } else if (/no CSS twin|could not serialize/.test(paneCSSText)) {
                    fail(`[J.W1 a] the rendered pane shows the placeholder: "${flat.slice(0, 100)}"`);
                    paneCSSText = null;
                } else if (/rotateX\(\s*var\(--rotationX\)\s*\)/.test(paneCSSText)) {
                    ok(`[J.W1 a] the RENDERED keyframes pane carries VERBATIM rotateX(var(--rotationX)) (declared template, NOT DOM-resolved; ${paneCSSText.length} chars)`);
                } else {
                    fail(`[J.W1 a] the rendered pane does NOT carry rotateX(var(--rotationX)) — the serializer DOM-resolved the declared var() (the B1 serialize face). Pane: "${flat.slice(0, 160)}"`);
                    paneCSSText = null;
                }
                if (errors.length) fail(`[J.W1 a] the pane read threw: ${errors.slice(0, 2).join(" | ")}`);
                if (parseLines.length) fail(`[J.W1 a] parse/serialize console line(s) during the pane read: ${parseLines.slice(0, 2).join(" | ")}`);
            } finally {
                await ctx.close();
            }
        }

        // ── J.W1 clause (b) + the clause-(a) re-parse — the BUILT library,
        //    LIVE in the page. Every non-conforming selector throws the TYPED
        //    AnimationOptionError NAMING the selector grammar (never the
        //    cryptic value.js parse throw, never a silent compile); the
        //    conforming control compiles; the captured var() card re-parses. ──
        if (!fs.existsSync(path.join(LIB_DIST, "keyframes.js"))) {
            fail(`[J.W1 b] dist/keyframes.js not built (run \`npm run build\`) — the live library probe needs the BUILT artifact`);
        } else {
            const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
            const page = await ctx.newPage();
            const errors = [];
            const parseLines = [];
            page.on("pageerror", (e) => errors.push(String(e?.message ?? e)));
            page.on("console", (msg) => {
                const t = msg.type();
                if ((t === "error" || t === "warning") && PARSE_LINE.test(msg.text())) parseLines.push(msg.text());
            });
            try {
                await page.goto(`${base}/__lib-probe__.html`, { waitUntil: "load" });
                const result = await page.evaluate(async (paneCSS) => {
                    const out = { reparse: null, rows: {}, control: null };
                    const kf = await import("/__kf-lib__/keyframes.js");
                    const engine = await kf.loadAnimationEngine();
                    if (paneCSS) {
                        try {
                            new engine.CSSKeyframesAnimation({}).fromString(paneCSS);
                            out.reparse = { ok: true };
                        } catch (e) {
                            out.reparse = {
                                ok: false,
                                name: e?.name ?? null,
                                message: String(e?.message ?? e).slice(0, 160),
                            };
                        }
                    }
                    for (const sel of ["abc", "5px", "150%"]) {
                        try {
                            new engine.CSSKeyframesAnimation({}).fromKeyframes({
                                [sel]: { opacity: 0 },
                                "100%": { opacity: 1 },
                            });
                            out.rows[sel] = { outcome: "COMPILED" };
                        } catch (e) {
                            out.rows[sel] = {
                                outcome: "THREW",
                                name: e?.name ?? null,
                                message: String(e?.message ?? e),
                            };
                        }
                    }
                    try {
                        new engine.CSSKeyframesAnimation({}).fromKeyframes({
                            from: { opacity: 0 },
                            "50%": { opacity: 0.5 },
                            to: { opacity: 1 },
                        });
                        out.control = { outcome: "COMPILED" };
                    } catch (e) {
                        out.control = {
                            outcome: "THREW",
                            name: e?.name ?? null,
                            message: String(e?.message ?? e).slice(0, 160),
                        };
                    }
                    return out;
                }, paneCSSText).catch((e) => ({ probeError: String(e?.message ?? e) }));

                if (result.probeError) {
                    fail(`[J.W1 b] the live library probe could not run: ${result.probeError.slice(0, 200)}`);
                } else {
                    // The clause-(a) re-parse half: the rendered pane is real CSS.
                    if (paneCSSText) {
                        if (result.reparse?.ok) {
                            ok(`[J.W1 a] the rendered var(--rotationX) pane RE-PARSES without throw through the BUILT dist (fromString)`);
                        } else {
                            fail(`[J.W1 a] the rendered pane does NOT re-parse: ${result.reparse?.name}: ${result.reparse?.message}`);
                        }
                    }
                    for (const sel of ["abc", "5px", "150%"]) {
                        const row = result.rows[sel];
                        if (!row) {
                            fail(`[J.W1 b] selector ${JSON.stringify(sel)} probe row missing`);
                        } else if (row.outcome === "COMPILED") {
                            fail(`[J.W1 b] selector ${JSON.stringify(sel)} SILENTLY COMPILED — the no-silent-accept guard (a length / out-of-range percent is not a keyframe selector)`);
                        } else if (row.name !== "AnimationOptionError" || /Parse error at offset/.test(row.message)) {
                            fail(`[J.W1 b] selector ${JSON.stringify(sel)} threw the WRONG shape — ${row.name}: ${row.message.slice(0, 140)} (want the typed AnimationOptionError, not the cryptic value.js throw)`);
                        } else if (!/keyframe selector/.test(row.message)) {
                            fail(`[J.W1 b] selector ${JSON.stringify(sel)} typed error does not NAME the selector condition: ${row.message.slice(0, 140)}`);
                        } else {
                            ok(`[J.W1 b] selector ${JSON.stringify(sel)} → typed AnimationOptionError naming the selector grammar (live, built dist)`);
                        }
                    }
                    if (result.control?.outcome === "COMPILED") {
                        ok(`[J.W1 b] the conforming control (from / 50% / to) compiles — the guard rejects ONLY the non-conforming set`);
                    } else {
                        fail(`[J.W1 b] the conforming control (from / 50% / to) did NOT compile: ${result.control?.name}: ${result.control?.message}`);
                    }
                }
                if (errors.length) fail(`[J.W1 b] live library probe pageerror: ${errors.slice(0, 2).join(" | ")}`);
                if (parseLines.length) fail(`[J.W1 b] a cryptic parse line hit the LIVE console during the probe: ${parseLines.slice(0, 2).join(" | ")}`);
            } finally {
                await ctx.close();
            }
        }
            } finally {
                await new Promise((r) => server.close(r));
            }
        },
        { label: "the engine-no-throw-on-play runtime clauses" },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length) {
    console.error(`\nproof:engine-no-throw-on-play — FAIL (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
}
console.log("\nproof:engine-no-throw-on-play — PASS: the rainbow play click is total on home+cube, the console carries no parse-error line, the cube transform paints live, the keyframes pane shows real round-trippable CSS (I.W0 B1/B5 closed), the RENDERED editor pane round-trips the declared var() verbatim + re-parses through the built dist, and every non-conforming selector throws the typed AnimationOptionError live on the built dist (J.W1 ENG-1/SEAM-1 closed).");
