#!/usr/bin/env node
/**
 * proof:demo-usability — the G.W11 live-Playwright SHIP gate (the three
 * usability defects the STATIC lanes could not see).
 *
 * Three falsifiable clauses, each BITING on the exact defect it forbids:
 *
 *   1. ROUTE-REACHABILITY (STATIC — always runs). Every `scenes.ts` scene id
 *      resolves a DECLARED, non-redirecting `router.ts` route. BITE: reds when a
 *      registered scene has no route (X-6 — "starting-style"/Discrete fell to the
 *      catch-all `redirect: "/"` and was DEAD). A future registered-but-unrouted
 *      scene reds.
 *
 *   2. HERO INTER-WORD GAP > 0 (BROWSER — runs when playwright resolves + the
 *      built demo is served). The hero LCP (AnimatedText) splits its title into
 *      per-word inline-block spans inside an `aria-hidden="true"` visual layer;
 *      Vue's whitespace:'condense' STRIPS the whitespace text node between the
 *      per-word spans at compile time, so the gap rendered 0px and the LCP read
 *      "Selectananimation" (X-5; the fix is a per-word `margin-inline-end`).
 *      Assert the measured gap between adjacent title word boxes ON THE SAME LINE
 *      is > 0 (text-wrap:balance legitimately wraps the run to multiple lines —
 *      an across-the-break pair has no meaningful horizontal gap and is excluded),
 *      AND the `.sr-only` a11y mirror still spells the title with spaces AND the
 *      `text-display-*`/text-wrap:balance substrate survives. BITE: collapse the
 *      per-word margin → same-line gap 0 → reds; remove the sr-only mirror or the
 *      balance substrate → reds (the SOTA half must not regress).
 *
 *   3. UNIQUE ARIA-LABEL (BROWSER). On an editor scene, no two
 *      SIMULTANEOUSLY-RENDERED interactive controls carry the same `aria-label`.
 *      BITE: reds on two "Play animation" buttons sharing one name (X-3); a
 *      re-duplicated control label reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1): a STATIC half that always runs
 * + a BROWSER half gated on playwright resolution (CI installs it; override the
 * resolution root with KF_PLAYWRIGHT_DIR). Re-runnable:
 * `node scripts/proof-demo-usability.mjs`. The browser half serves the BUILT
 * `dist/gh-pages/` (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:demo-usability — G.W11 (the live-Playwright SHIP set)");

// ── 1. ROUTE-REACHABILITY (static, always runs) ──────────────────────────────
{
    const scenesSrc = read(path.join(DEMO, "app/scene/scenes.ts"));
    const routerSrc = read(path.join(DEMO, "app/scene/router.ts"));

    // The scene ids: every `id: "<name>"` in the `scenes` descriptor list +
    // HOME_SCENE_ID. Pull from the explicit `id:` keys (the descriptors).
    const sceneIds = new Set();
    for (const m of scenesSrc.matchAll(/\bid:\s*"([^"]+)"/g)) sceneIds.add(m[1]);
    // HOME_SCENE_ID = "home" — the landing scene, routed as `/` (name "home").
    sceneIds.add("home");

    // The declared route names (a route is reachable iff it has a `name:` that is
    // NOT the catch-all redirect). The catch-all has a `redirect:`, no `name:`.
    const routeNames = new Set();
    for (const m of routerSrc.matchAll(/\bname:\s*"([^"]+)"/g)) routeNames.add(m[1]);
    // R.W5 C.5 GENERATES the routes: `allScenes.map((s) => ({ path, name: s.id, … }))`
    // — the route name is the COMPUTED expression `s.id`, not a string literal, so the
    // literal scan above returns empty on the shipped router. Recognise the generated
    // form and route EVERY scene id by construction: `allScenes = [homeScene, ...scenes]`
    // (scenes.ts) is the exact descriptor set `sceneIds` is parsed from, so the
    // `name: s.id` map routes every id. The literal scan still runs first (hand-declared
    // `name:"<literal>"` routes are still honoured); the catch-all still carries
    // `redirect:` with no `name:`. Re-points the gate off its own R.W5 obsolescence
    // (the S.A2 "stale-gate" bucket) — a green demo must not red on the gate's staleness.
    const routesAreGenerated =
        /\ballScenes\s*\.\s*map\b/.test(routerSrc) &&
        /\bname:\s*[A-Za-z_$][\w$]*\.id\b/.test(routerSrc);
    if (routesAreGenerated) for (const id of sceneIds) routeNames.add(id);

    const unreachable = [...sceneIds].filter((id) => !routeNames.has(id));
    if (unreachable.length > 0) {
        fail(
            `every scenes.ts id resolves a non-redirecting router.ts route — ` +
                `UNROUTED (falls to the catch-all redirect): ${unreachable.join(", ")}. ` +
                `Add a { path, name, component } route for each (X-6).`,
        );
    } else {
        ok(
            `route-reachability: all ${sceneIds.size} scene id(s) resolve a ` +
                `declared non-redirecting route (${[...sceneIds].sort().join(", ")})`,
        );
    }
}

// ── BROWSER half (clauses 2 + 3) ─────────────────────────────────────────────
// In CI the demo-smoke job sets KF_REQUIRE_BROWSER=1 (it installs playwright +
// chromium + builds the demo first) — there the browser half MUST run, or X-5/X-3
// would pass vacuously. The lib lifecycle carries the rule AT THE SEAM: a skip
// becomes a hard fail under KF_REQUIRE_BROWSER, so the gate cannot green-report
// SHIPs it never exercised.
async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "clauses 2+3 (hero word-gap · unique Play aria)",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url: base }) => {
        // ── 2. HERO INTER-WORD GAP ──────────────────────────────────────────
        await page.goto(`${base}/`, { waitUntil: "load" });
        // Wait for the hero <h1> word spans to lay out.
        let heroReady = false;
        for (let i = 0; i < 30 && !heroReady; i++) {
            try {
                heroReady = await page.evaluate(
                    () => document.querySelectorAll("h1 .lift-down").length >= 2,
                );
            } catch {
                /* context destroyed mid hash-redirect — retry */
            }
            if (!heroReady) await page.waitForTimeout(300);
        }
        if (!heroReady) {
            fail("hero inter-word gap — the hero <h1> .lift-down word spans did not render");
        } else {
            // S.A0-fallout measurement-truth fix (reproduced: 10/60 snapshots on a
            // fast machine): the hero's decorative liftDown is INFINITE and
            // STAGGERED (adjacent words vertically offset ≤10px in recurring
            // windows), so a ±2px same-line filter can match ZERO pairs in a
            // single snapshot → the degenerate `minGap: 0` branch false-REDs the
            // clause ("measured 0px") with no real X-5 collapse. Two-part cure,
            // neither of which weakens the real oracle: (a) same-line iff the
            // vertical centers are within HALF the smaller box height — a true
            // line break differs by a full line box (~1em+), the lift by ≤10px,
            // so the discriminator still excludes across-the-break pairs while
            // tolerating the decorative transform (translateY never changes the
            // HORIZONTAL gap the clause measures); (b) if a snapshot still
            // witnesses zero pairs, RESAMPLE across the stagger phase (bounded)
            // instead of judging the degenerate frame.
            let probe = null;
            for (let attempt = 0; attempt < 8; attempt++) {
                probe = await page.evaluate(() => {
                // The title word boxes live inside AnimatedText's aria-hidden
                // visual layer (a `<span aria-hidden="true">`, NOT a `<div>` — the
                // F.W16 word-granular substrate renders sr-only mirror + aria-hidden
                // word run, no wrapping div). The TypingDots ellipsis is a SEPARATE
                // `.depth-text` host, so scoping to the aria-hidden layer excludes it.
                const h1 = document.querySelector("h1");
                const visualLayer = h1.querySelector('span[aria-hidden="true"]');
                const spans = [
                    ...(visualLayer
                        ? visualLayer.querySelectorAll(".lift-down")
                        : []),
                ];
                // The inter-word gap is between adjacent words ON THE SAME LINE
                // (text-wrap: balance legitimately wraps the run to multiple lines —
                // an across-the-line-break pair has no meaningful horizontal gap and
                // must NOT be measured). X-5 was the SAME-LINE collapse to
                // "Selectananimation"; the margin-inline-end fix opens that gap.
                let minGap = Infinity;
                let sameLinePairs = 0;
                for (let i = 0; i + 1 < spans.length; i++) {
                    const a = spans[i].getBoundingClientRect();
                    const b = spans[i + 1].getBoundingClientRect();
                    // Same visual line iff the vertical centers are within half
                    // the smaller box height — tolerant of the ≤10px decorative
                    // lift, still excludes a true line break (a full line box).
                    const sameLineTol = Math.min(a.height, b.height) / 2;
                    const sameLine =
                        Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) <=
                        Math.max(2, sameLineTol);
                    if (!sameLine) continue;
                    sameLinePairs++;
                    // The gap is the next box's left edge minus this box's right
                    // edge (the inter-word separation that rendered 0 with the
                    // collapsed whitespace node).
                    minGap = Math.min(minGap, b.left - a.right);
                }
                // The sr-only a11y mirror spells the full title (with spaces).
                const mirror = document.querySelector("h1 .sr-only");
                const mirrorText = mirror ? mirror.textContent.trim() : "";
                // The balance substrate: the LCP <h1> carries a text-display-*
                // class (glass-ui's text-wrap: balance host).
                const balanceHost =
                    /\btext-display-\d\b/.test(h1.className) ||
                    getComputedStyle(h1).textWrap === "balance" ||
                    getComputedStyle(h1).textWrapStyle === "balance";
                return {
                    wordCount: spans.length,
                    sameLinePairs,
                    // Measured only across SAME-LINE adjacent pairs; if a multi-word
                    // title has none (a degenerate one-word-per-line balance), the
                    // gap clause cannot witness the collapse and reds for inspection.
                    minGap: sameLinePairs > 0 ? minGap : 0,
                    mirrorText,
                    mirrorHasSpaces: /\s/.test(mirrorText),
                    balanceHost,
                };
                });
                // A witnessed pair (in either verdict direction) is a REAL frame —
                // judge it. Only the degenerate zero-pair snapshot re-samples.
                if (probe.sameLinePairs > 0) break;
                await page.waitForTimeout(150);
            }

            if (probe.minGap > 0) {
                ok(
                    `hero inter-word gap > 0 (min ${probe.minGap.toFixed(1)}px across ` +
                        `${probe.sameLinePairs} same-line adjacent word pair(s) of ` +
                        `${probe.wordCount} title word boxes — the LCP reads with spaces)`,
                );
            } else {
                fail(
                    `hero inter-word gap > 0 — measured ${probe.minGap}px between ` +
                        `adjacent title word boxes (the collapsed whitespace separator ` +
                        `renders "Selectananimation", X-5)`,
                );
            }
            if (probe.mirrorHasSpaces) {
                ok(`hero sr-only a11y mirror spells the title with spaces ("${probe.mirrorText}")`);
            } else {
                fail(
                    `hero sr-only a11y mirror present + spaced — found ` +
                        `${JSON.stringify(probe.mirrorText)} (the SOTA a11y half must not regress)`,
                );
            }
            if (probe.balanceHost) {
                ok("hero text-wrap: balance substrate intact (the SOTA typographic half)");
            } else {
                fail("hero text-wrap: balance substrate intact (text-display-* / balance host missing)");
            }
        }

        // ── 3. UNIQUE ARIA-LABEL (editor scene) ─────────────────────────────
        await navToScene(page, "cube", "Controls", { timeout: 8000 });
        // Let the editor scene mount its control suite.
        await page.waitForTimeout(1500);
        const dupes = await page.evaluate(() => {
            const isVisible = (el) => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return false;
                const cs = getComputedStyle(el);
                return (
                    cs.display !== "none" &&
                    cs.visibility !== "hidden" &&
                    cs.opacity !== "0"
                );
            };
            const controls = [
                ...document.querySelectorAll(
                    "[aria-label][role], button[aria-label], a[aria-label], [aria-label][tabindex]",
                ),
            ].filter(isVisible);
            const byLabel = new Map();
            for (const el of controls) {
                const label = el.getAttribute("aria-label").trim();
                if (!label) continue;
                byLabel.set(label, (byLabel.get(label) ?? 0) + 1);
            }
            return [...byLabel.entries()].filter(([, n]) => n > 1);
        });
        if (dupes.length === 0) {
            ok("unique aria-label: no two simultaneously-rendered controls share an aria-label (editor scene)");
        } else {
            fail(
                `unique aria-label — duplicate accessible name(s) on the editor scene: ` +
                    dupes.map(([l, n]) => `"${l}" ×${n}`).join(", ") +
                    ` (a screen reader cannot tell them apart, X-3)`,
            );
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:demo-usability — FAIL (${failures.length}): the demo carries a ` +
            `live usability defect (X-6 dead route / X-5 collapsed hero gap / X-3 ` +
            `duplicate aria-label).`,
    );
    process.exit(1);
}
console.log("\nproof:demo-usability — PASS: the three live-Playwright SHIPs hold (G.W11).");
