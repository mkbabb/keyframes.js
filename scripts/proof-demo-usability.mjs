#!/usr/bin/env node
/**
 * proof:demo-usability — the G.W11 live-Playwright SHIP gate (the three
 * usability defects the STATIC lanes could not see), clause 2 RE-ARMED at
 * T.D10 for the per-CHAR hero rebirth (the arming-audit lesson: the actuation
 * substrate changed — word spans → two-tier word/char — so every clause that
 * anchored `.lift-down` re-anchors the NEW substrate in the same motion).
 *
 * Three falsifiable clauses, each BITING on the exact defect it forbids:
 *
 *   1. ROUTE-REACHABILITY (STATIC — always runs). Every `scenes.ts` scene id
 *      resolves a DECLARED, non-redirecting `router.ts` route. BITE: reds when a
 *      registered scene has no route (X-6 — "starting-style"/Discrete fell to the
 *      catch-all `redirect: "/"` and was DEAD). A future registered-but-unrouted
 *      scene reds.
 *
 *   2. THE PER-CHAR HERO CONTRACT (BROWSER — T.D10, VERDICT #3 "should uplift
 *      each individual char"; the word-granular split is the REJECTED state).
 *      The hero is a TWO-TIER split (AnimatedText): per-WORD wrappers
 *      (`.wave-word`, inline-block + margin-inline-end — words own wrapping +
 *      the gap) over per-CHAR spans (`.wave-char` — chars own the motion).
 *      Asserted, each half biting:
 *        (2a) X-5 GAP KEPT — the measured gap between adjacent same-line
 *             `.wave-word` boxes is > 0 (Vue's whitespace:'condense' strips the
 *             whitespace text node; the margin is the cure — collapse it and
 *             the LCP reads "Selectananimation" again).
 *        (2b) SR-MIRROR KEPT — the `.sr-only` mirror spells the title WITH
 *             spaces (AT hears the phrase, never the "S…e…l…e…c…t" stream) and
 *             the aria-hidden visual layer + balance substrate survive.
 *        (2c) PER-CHAR SPLIT — the char-span count equals the title's
 *             non-whitespace glyph count (derived from the mirror, never a
 *             frozen literal; 17 for the default title), every char span
 *             resolves a live `animation-name`, and the per-char
 *             `animation-delay`s are STRICTLY MONOTONE in global char order
 *             (one wave crossing the whole line — the 3-lump word heave reds).
 *        (2d) HONEST INK (both themes) — the h1 resolves weight 400 and the
 *             char spans resolve `--foreground` ink in light AND dark (the
 *             depth-text lilac costume is dead; T.D10 RULED). Plus a STATIC
 *             half: `depth-text` grep-zero in editor-shell/.
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

console.log(
    "proof:demo-usability — G.W11 (the live-Playwright SHIP set) + T.D10 (the per-char hero contract)",
);

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

// ── 2d (static half) — depth-text grep-zero in editor-shell/ (T.D10 ink) ─────
{
    const shellDir = path.join(DEMO, "@/components/instrument/shell");
    const hits = [];
    for (const f of fs.readdirSync(shellDir)) {
        const p = path.join(shellDir, f);
        if (!fs.statSync(p).isFile()) continue;
        const live = read(p)
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
        if (/\bdepth-text\b/.test(live)) hits.push(f);
    }
    if (hits.length === 0) {
        ok("(2d static) zero live `depth-text` references in editor-shell/ — the hero ink costume is dead (T.D10)");
    } else {
        fail(
            `(2d static) depth-text survives in editor-shell/: ${hits.join(", ")} — the hero ink is ` +
                "--foreground 400, never the lilac recolor + 4-step offset stamp (T.D10 RULED)",
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
            label: "clauses 2+3 (per-char hero contract · unique Play aria)",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url: base }) => {
        // ── 2. THE PER-CHAR HERO CONTRACT ───────────────────────────────────
        await page.goto(`${base}/`, { waitUntil: "load" });
        // Wait for the hero's two-tier substrate to lay out.
        let heroReady = false;
        for (let i = 0; i < 30 && !heroReady; i++) {
            try {
                heroReady = await page.evaluate(
                    () => document.querySelectorAll("h1 .wave-char").length >= 2,
                );
            } catch {
                /* context destroyed mid hash-redirect — retry */
            }
            if (!heroReady) await page.waitForTimeout(300);
        }
        if (!heroReady) {
            fail("per-char hero — the hero <h1> .wave-char spans did not render (the two-tier T.D10 substrate is missing)");
        } else {
            // The X-5 same-line word-gap measurement, re-anchored to the WORD
            // tier (`.wave-word`). The decorative per-char lift is em-relative
            // (≤ ~16px at the mega rung) and staggered, so a snapshot can catch
            // adjacent words vertically offset — same-line iff the vertical
            // centers are within half the smaller box height (a true line break
            // differs by a full line box); a zero-pair degenerate frame
            // RESAMPLES across the wave phase (bounded) instead of being judged.
            let probe = null;
            for (let attempt = 0; attempt < 8; attempt++) {
                probe = await page.evaluate(() => {
                    const h1 = document.querySelector("h1");
                    const visualLayer = h1.querySelector('span[aria-hidden="true"]');
                    const words = [
                        ...(visualLayer
                            ? visualLayer.querySelectorAll(".wave-word")
                            : []),
                    ];
                    let minGap = Infinity;
                    let sameLinePairs = 0;
                    for (let i = 0; i + 1 < words.length; i++) {
                        const a = words[i].getBoundingClientRect();
                        const b = words[i + 1].getBoundingClientRect();
                        const sameLineTol = Math.min(a.height, b.height) / 2;
                        const sameLine =
                            Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) <=
                            Math.max(2, sameLineTol);
                        if (!sameLine) continue;
                        sameLinePairs++;
                        minGap = Math.min(minGap, b.left - a.right);
                    }
                    // The sr-only a11y mirror spells the full title (with spaces).
                    const mirror = document.querySelector("h1 .sr-only");
                    const mirrorText = mirror ? mirror.textContent.trim() : "";
                    // The balance substrate: the LCP <h1> carries a text-display-*
                    // class (glass-ui's text-wrap: balance host).
                    const balanceHost =
                        /\btext-display-/.test(h1.className) ||
                        getComputedStyle(h1).textWrap === "balance" ||
                        getComputedStyle(h1).textWrapStyle === "balance";
                    // The CHAR tier: count + delays + live animation, in DOM
                    // (== global char) order, scoped to the aria-hidden layer
                    // (the TypingDots tail is a separate .hero-dots host).
                    const chars = [
                        ...(visualLayer
                            ? visualLayer.querySelectorAll(".wave-char")
                            : []),
                    ];
                    const delays = chars.map((c) =>
                        parseFloat(getComputedStyle(c).animationDelay) || 0,
                    );
                    let monotone = chars.length > 1;
                    for (let i = 0; i + 1 < delays.length; i++) {
                        if (!(delays[i + 1] > delays[i])) monotone = false;
                    }
                    const animated = chars.filter(
                        (c) => getComputedStyle(c).animationName !== "none",
                    ).length;
                    return {
                        wordCount: words.length,
                        sameLinePairs,
                        minGap: sameLinePairs > 0 ? minGap : 0,
                        mirrorText,
                        mirrorHasSpaces: /\s/.test(mirrorText),
                        balanceHost,
                        charCount: chars.length,
                        glyphCount: mirrorText.replace(/\s+/g, "").length,
                        monotone,
                        animated,
                        firstDelays: delays.slice(0, 5).map((d) => +d.toFixed(3)),
                    };
                });
                if (probe.sameLinePairs > 0) break;
                await page.waitForTimeout(150);
            }

            // (2a) the X-5 gap, word tier
            if (probe.minGap > 0) {
                ok(
                    `(2a) hero inter-word gap > 0 (min ${probe.minGap.toFixed(1)}px across ` +
                        `${probe.sameLinePairs} same-line adjacent word pair(s) of ` +
                        `${probe.wordCount} word wrappers — the LCP reads with spaces)`,
                );
            } else {
                fail(
                    `(2a) hero inter-word gap > 0 — measured ${probe.minGap}px between adjacent ` +
                        `.wave-word boxes (the collapsed whitespace separator renders ` +
                        `"Selectananimation", X-5)`,
                );
            }
            // (2b) sr-mirror + balance substrate
            if (probe.mirrorHasSpaces) {
                ok(`(2b) hero sr-only a11y mirror spells the title with spaces ("${probe.mirrorText}")`);
            } else {
                fail(
                    `(2b) hero sr-only a11y mirror present + spaced — found ` +
                        `${JSON.stringify(probe.mirrorText)} (the a11y half must not regress)`,
                );
            }
            if (probe.balanceHost) {
                ok("(2b) hero text-wrap: balance substrate intact (words own wrapping)");
            } else {
                fail("(2b) hero text-wrap: balance substrate intact (text-display-* / balance host missing)");
            }
            // (2c) the per-char split
            if (probe.charCount >= 2 && probe.charCount === probe.glyphCount) {
                ok(
                    `(2c) per-char split — ${probe.charCount} .wave-char spans == the title's ` +
                        `${probe.glyphCount} non-whitespace glyphs (VERDICT #3: each individual char uplifts)`,
                );
            } else {
                fail(
                    `(2c) per-char split — ${probe.charCount} char span(s) vs ${probe.glyphCount} ` +
                        `title glyphs (the word-lump split is the REJECTED state)`,
                );
            }
            if (probe.monotone) {
                ok(
                    `(2c) per-char delays strictly monotone in global char order ` +
                        `(first: ${probe.firstDelays.join(", ")}s — one wave crossing the whole line)`,
                );
            } else {
                fail(
                    `(2c) per-char animation-delays are NOT strictly monotone across the line ` +
                        `(first: ${probe.firstDelays.join(", ")}s) — the wave must sweep global char order, ` +
                        "never restart per word (the 3-lump heave)",
                );
            }
            if (probe.animated === probe.charCount) {
                ok(`(2c) every char span resolves a live animation-name (${probe.animated}/${probe.charCount})`);
            } else {
                fail(
                    `(2c) only ${probe.animated}/${probe.charCount} char spans carry a live ` +
                        "animation-name — the uplift must ride every glyph",
                );
            }

            // (2d) honest ink, BOTH themes — weight 400 + --foreground color.
            const ink = await page.evaluate(() => {
                const readInk = () => {
                    const h1 = document.querySelector("h1.hero-display");
                    const ch = document.querySelector("h1 .wave-char");
                    const cs = getComputedStyle(h1);
                    const fg = getComputedStyle(document.documentElement)
                        .getPropertyValue("--foreground")
                        .trim();
                    // Resolve the token through a probe node so we compare
                    // like-for-like computed rgb() strings.
                    const probeEl = document.createElement("span");
                    probeEl.style.color = `var(--foreground)`;
                    document.body.appendChild(probeEl);
                    const fgResolved = getComputedStyle(probeEl).color;
                    probeEl.remove();
                    return {
                        weight: cs.fontWeight,
                        charColor: ch ? getComputedStyle(ch).color : null,
                        fgResolved,
                        fgToken: fg.slice(0, 32),
                    };
                };
                const light = readInk();
                document.documentElement.classList.add("dark");
                const dark = readInk();
                document.documentElement.classList.remove("dark");
                return { light, dark };
            });
            for (const [theme, t] of Object.entries(ink)) {
                const w = parseInt(t.weight, 10);
                if (w === 400 && t.charColor === t.fgResolved) {
                    ok(`(2d ${theme}) hero ink honest — weight 400, char color == resolved --foreground`);
                } else {
                    fail(
                        `(2d ${theme}) hero ink off contract — weight ${t.weight} (expect 400), char ` +
                            `color ${t.charColor} vs --foreground ${t.fgResolved} (the depth-text ` +
                            "lilac/faux-bold costume is the rejected state, T.D10)",
                    );
                }
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
            `live usability defect (X-6 dead route / the T.D10 per-char hero contract / X-3 ` +
            `duplicate aria-label).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:demo-usability — PASS: the live-Playwright SHIPs hold (G.W11) and the hero rides the " +
        "T.D10 per-char two-tier contract (X-5 gap + sr-mirror kept, monotone global-index wave, honest ink).",
);
