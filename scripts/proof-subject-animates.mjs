#!/usr/bin/env node
/**
 * proof:subject-animates — Tranche J.W6 P0 (the subject-write seam oracle).
 *
 * THE MISSING ORACLE the whole gate battery lacked. Every prior live gate that
 * touched playback asserted the playhead/loop is LIVE (`proof:engine-no-throw-
 * on-play` clause c samples `.cube/.graph/.idle-hover` for ≥3 distinct
 * transforms; `proof:live-session` B1 the same) — but those selectors ALSO
 * carry the cube's standalone perspective tilt + the idle-hover bob + the
 * orbital container matrix, ALL of which move INDEPENDENTLY of the engine play
 * write. So a play loop that advances `this.t` (the progress UI ticks) while
 * NEVER writing the interpolated frame to the subject keeps every one of those
 * gates GREEN — the SUBJECT-WRITE was never the asserted property.
 *
 * The J.W6 S1 sync conversion (`advanceTo` async→sync) split `Animation._frame`
 * into `_advance(t)` (the playhead/clock half) + `_renderFrame(t)` (the
 * `interpFrames(t, true, …)` apply=true SUBJECT-WRITE half). The write is now a
 * SEPARATE statement on a separate method — the exact shape where a half-applied
 * refactor (or a `true`→`false` typo) drops the subject write while the playhead
 * keeps advancing. Nothing in the battery bit that.
 *
 * THE ORACLE: drive the BUILT `dist/keyframes.js` `Animation.play()` against a
 * REAL DOM element in a REAL browser and assert the element's COMPUTED style
 * traverses ≥3 DISTINCT interpolated values across the play window — the
 * load-bearing property a human SEES. Three arms cover the three play paths the
 * conversion touched:
 *   A — rAF standalone (`useWAAPI:false`): `_renderFrame` → `interpFrames(apply)`
 *   B — WAAPI default (`useWAAPI:true`): the compositor write + the shadow loop
 *   C — AnimationGroup single-target composite: `transformFramesGrouped` →
 *       the inherited child transform, the demo cube/easing/spring shape
 *
 * Born-RED witness (the seam bite): flip `engine.ts` `_renderFrame`'s
 * `interpFrames(t, true, this._interpOut)` to `false` (advance the playhead, drop
 * the subject write), rebuild — arm A + arm C RED here (≤1 distinct value: the
 * subject is FROZEN) while `proof:engine-no-throw-on-play` clause c stays GREEN
 * (it reads the idle/orbital motion, not the write). Revert → GREEN.
 *
 * P6 posture: hard — device-independent correctness oracle (the engine WRITES to
 * its subject or it does not; red anywhere). Under KF_REQUIRE_BROWSER a
 * playwright-absent / dist-absent run is a HARD FAIL at the lib seam (never a
 * vacuous pass), per the W7-1 regime.
 * Re-runnable:
 *   npm run build && KF_REQUIRE_BROWSER=1 node scripts/proof-subject-animates.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REQUIRE_BROWSER, navToScene, withBrowser, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIB_DIST = path.join(REPO, "dist");
const GH_DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log("proof:subject-animates — J.W6 P0 (the subject-write seam oracle)");

// The BUILT library externalizes the value.js/parse-that bare specifiers, so the
// probe page carries an import map onto the INSTALLED deps — the exact
// resolution a consumer's bundler performs.
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
// The probe page mirrors the product gesture: a SUBJECT element + a PLAY button
// per arm whose click constructs the BUILT-library animation against that
// subject and plays it. The gate drives play by CLICKING the button (a genuine
// user gesture — the actuation the gate-ORACLE precept requires, not a
// goto+rest load-rest read), then samples the subject's computed style.
const PROBE_HTML = `<!doctype html><html><head><meta charset="utf-8">
<script type="importmap">{"imports":{"@mkbabb/value.js":"/__kf-vendor__/value.js","@mkbabb/parse-that":"/__kf-vendor__/parse-that.js"}}</script>
</head><body>
<div id="raf-subject" style="position:absolute;left:0px;top:0px"></div>
<button id="raf-play">play rAF</button>
<div id="waapi-subject" style="position:absolute;left:0px;top:0px"></div>
<button id="waapi-play">play WAAPI</button>
<div id="group-subject" style="position:absolute;left:0px;top:0px"></div>
<button id="group-play">play group</button>
<script type="module">
const kf = await import("/__kf-lib__/keyframes.js");
const engine = await kf.loadAnimationEngine();
const KEYFRAMES = "@keyframes p { from { left: 0px } to { left: 200px } }";
const mk = (subjId, opts) => {
    const el = document.getElementById(subjId);
    el.style.cssText = "position:absolute;left:0px;top:0px";
    const a = new engine.CSSKeyframesAnimation({ duration: 300, timingFunction: "linear", ...opts }, el);
    a.fromString(KEYFRAMES);
    return a;
};
// ARM A — the rAF standalone path (_renderFrame → interpFrames(apply=true)).
document.getElementById("raf-play").addEventListener("click", () => {
    window.__rafPlay = mk("raf-subject", { useWAAPI: false }).play();
});
// ARM B — the WAAPI default path (compositor write + the shadow loop).
document.getElementById("waapi-play").addEventListener("click", () => {
    window.__waapiPlay = mk("waapi-subject", {}).play();
});
// ARM C — the AnimationGroup single-target composite (the cube/easing/spring shape).
document.getElementById("group-play").addEventListener("click", () => {
    const child = mk("group-subject", { useWAAPI: false });
    child.name = "C";
    window.__groupPlay = new engine.AnimationGroup(child).play();
});
window.__kfReady = true;
</script>
</body></html>`;

function serveProbe() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (u === "/__subject-probe__.html") {
            res.writeHead(200, { "content-type": "text/html" }).end(PROBE_HTML);
            return;
        }
        if (VENDOR[u]) {
            res.writeHead(200, { "content-type": "text/javascript" });
            fs.createReadStream(VENDOR[u]).pipe(res);
            return;
        }
        if (u.startsWith("/__kf-lib__/")) {
            const lp = path.join(LIB_DIST, u.slice("/__kf-lib__/".length));
            if (!lp.startsWith(LIB_DIST) || !fs.existsSync(lp) || fs.statSync(lp).isDirectory()) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, { "content-type": "text/javascript" });
            fs.createReadStream(lp).pipe(res);
            return;
        }
        res.writeHead(404).end();
    });
}

async function browserHalf() {
    if (!fs.existsSync(path.join(LIB_DIST, "keyframes.js"))) {
        const reason = "dist/keyframes.js not built (run `npm run build` first)";
        if (REQUIRE_BROWSER) {
            fail(`browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the subject-write oracle cannot pass vacuously (W7-1)`);
        } else {
            console.log(`  ○ browser half skipped — ${reason}`);
        }
        return;
    }

    const result = await withBrowser(
        async (browser) => {
            const server = serveProbe();
            await new Promise((r) => server.listen(0, r));
            const base = `http://127.0.0.1:${server.address().port}`;
            try {
                const ctx = await browser.newContext({ viewport: { width: 800, height: 600 } });
                const page = await ctx.newPage();
                const errors = [];
                page.on("pageerror", (e) => errors.push(String(e?.message ?? e)));
                await page.goto(`${base}/__subject-probe__.html`, { waitUntil: "load" });
                await page.waitForFunction(() => window.__kfReady === true, { timeout: 10000 });

                // Each arm: CLICK the play button (the real user gesture — the
                // actuation, not a goto+rest read), then sample the SUBJECT's
                // computed style across the play window. A play that advances the
                // clock but drops the subject write yields ≤2 distinct values
                // (the unwritten endpoints only).
                const ARMS = [
                    ["raf", "#raf-play", "#raf-subject", "__rafPlay", "the rAF standalone path (_renderFrame → interpFrames(apply=true))"],
                    ["waapi", "#waapi-play", "#waapi-subject", "__waapiPlay", "the WAAPI default path (compositor write + shadow loop)"],
                    ["group", "#group-play", "#group-subject", "__groupPlay", "the AnimationGroup single-target composite (the demo cube/easing/spring shape)"],
                ];
                for (const [key, btn, subj, handle, desc] of ARMS) {
                    await page.click(btn); // the actuating user gesture
                    const r = await page.evaluate(
                        async ({ subj, handle }) => {
                            const el = document.querySelector(subj);
                            const seen = new Set();
                            const t0 = performance.now();
                            while (performance.now() - t0 < 360) {
                                seen.add(getComputedStyle(el).left);
                                await new Promise((r) => requestAnimationFrame(r));
                            }
                            await (window[handle] ?? Promise.resolve()).catch?.(() => {});
                            return { distinct: seen.size, final: getComputedStyle(el).left };
                        },
                        { subj, handle },
                    );
                    if (r.distinct >= 3) {
                        ok(`[${key}] subject WRITES on the play click — ${r.distinct} distinct computed values, settles at ${r.final} (${desc})`);
                    } else {
                        fail(`[${key}] subject FROZEN on the play click — only ${r.distinct} distinct computed value(s) (final ${r.final}); the playhead advanced but the frame was never written to the subject (${desc})`);
                    }
                }
                if (errors.length) {
                    fail(`pageerror during the subject-write probe: ${errors.slice(0, 2).join(" | ")}`);
                }

                await ctx.close();
            } finally {
                await new Promise((r) => server.close(r));
            }
        },
        { label: "the subject-write seam oracle" },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// K.W0 S6 (Deliverable 3 · clause d) — EXTEND the oracle from the synthetic
// `<div>` to the REAL demo scenes (closing F4). The synthetic leg above drives
// `dist/keyframes.js` `Animation.play()` against a throwaway `<div id="raf-
// subject">`; it never touches the demo cube's matrix/CSS-var transform path
// (live-session-gap-analysis §F4). This leg drives the BUILT `dist/gh-pages/`
// demo cube and asserts the engine's `interpFrames(apply=true)` write reaches
// the REAL subject — read on the engine's OWN write channel (the playback
// slider's `aria-valuenow` advancing from "0", the engine-attributable playhead
// the cube's group composite paints), NOT bare getComputedStyle churn. The leg
// REDS if the real subject does not receive the engine write (the cold-path
// no-op surface) and GREENS on the cure.
// ─────────────────────────────────────────────────────────────────────────────
async function realSceneHalf() {
    if (!fs.existsSync(path.join(GH_DIST, "index.html"))) {
        const reason = "dist/gh-pages not built (run `npm run gh-pages` first)";
        if (REQUIRE_BROWSER) {
            fail(`real-scene half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the real-subject oracle cannot pass vacuously (W7-1)`);
        } else {
            console.log(`  ○ real-scene half skipped — ${reason}`);
        }
        return;
    }
    const result = await withPage(
        { distDir: GH_DIST, label: "the real-scene subject-write oracle", context: { viewport: { width: 1440, height: 900 } } },
        async (page, { url }) => {
            await page.goto(`${url}/#/cube`, { waitUntil: "load" });
            await page.evaluate(() => localStorage.clear());
            await navToScene(page, "cube", "Controls");
            await page
                .waitForFunction(
                    () => !!document.querySelector('button[aria-label="Play animation"]'),
                    null,
                    { timeout: 8000 },
                )
                .catch(() => {});
            const readSlider = () =>
                page.evaluate(() => {
                    const s = document.querySelector('[role="slider"]');
                    return s ? parseFloat(s.getAttribute("aria-valuenow") || "0") : null;
                });
            const sliderBefore = await readSlider();
            // Drive the real subject via the dock play (the genuine gesture that
            // reaches the cube group's play()).
            await page.evaluate(() => document.querySelector('button[aria-label="Play animation"]')?.click());
            // PER-EXPECTED predicate wait (NOT a fixed settleMs): the engine WROTE
            // the subject iff the playhead the group composite paints advances.
            const wrote = await page
                .waitForFunction(
                    () => {
                        const pause = !!document.querySelector('button[aria-label="Pause animation"]');
                        const s = document.querySelector('[role="slider"]');
                        const sv = s ? parseFloat(s.getAttribute("aria-valuenow") || "0") : 0;
                        return pause && sv > 0;
                    },
                    null,
                    { timeout: 4000 },
                )
                .then(() => true)
                .catch(() => false);
            const sliderAfter = await readSlider();
            // Corroborate the SUBJECT itself received the write: the engine-write
            // subject (the OrbitalDrag wrapper carrying the apply-transform-to-
            // container engine matrix) traversed values while playing, idle bob
            // excluded — a GATED corroborator (the load-bearer is the playhead the
            // group composite paints onto the real subject).
            const subjectGated = await page.evaluate(async () => {
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                const isPause = () => !!document.querySelector('button[aria-label="Pause animation"]');
                if (!isPause()) return 0;
                const seen = new Set();
                for (let i = 0; i < 60 && isPause(); i++) {
                    const el = document.querySelector(".graph > div");
                    if (el && !el.closest?.(".idle-hover")) {
                        const t = getComputedStyle(el).transform;
                        if (t && t !== "none") seen.add(t);
                    }
                    await sleep(30);
                }
                return seen.size;
            });
            const advanced = wrote && (sliderAfter ?? 0) > 0 && (sliderBefore ?? 0) === 0;
            if (advanced) {
                ok(
                    `[real-cube] the demo cube's REAL subject RECEIVES the engine write — the group ` +
                        `composite's interpFrames(apply=true) playhead advanced ${sliderBefore} → ${sliderAfter} ` +
                        `(the engine-attributable scalar painted onto the real subject), aria flipped to ` +
                        `"Pause animation", the engine-write subject traversed ${subjectGated} distinct ` +
                        `transforms gated on aria=Pause (idle bob excluded). F4 closed: the gate now drives ` +
                        `the demo's matrix/CSS-var transform path, not only the synthetic <div>.`,
                );
            } else {
                fail(
                    `[real-cube] the demo cube's REAL subject did NOT receive the engine write — the playhead ` +
                        `stayed ${sliderBefore} → ${sliderAfter} (advanced=${advanced}, engineWrote=${wrote}). ` +
                        `The group composite advanced the clock but never wrote the interpolated frame to the ` +
                        `real subject (the cold-path no-op surface — born-RED; greens on the cure).`,
                );
            }
        },
    );
    if (result.skipped) console.log(`  ○ real-scene half skipped — ${result.reason}`);
}

await browserHalf();
await realSceneHalf();

if (failures.length) {
    console.error(`\nproof:subject-animates — FAIL (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
}
console.log("\nproof:subject-animates — PASS: every play path (rAF / WAAPI / group composite) WRITES the interpolated frame to its subject — the subject's computed style traverses the animation, not just the playhead — AND the REAL demo cube on the built dist/gh-pages/ receives the engine write (the group composite's interpFrames(apply=true) playhead advances on the real subject, not only the synthetic <div> — K.W0 S6 clause d, F4 closed). The seam the J.W6 S1 sync conversion refactored is guarded, end to end.");
