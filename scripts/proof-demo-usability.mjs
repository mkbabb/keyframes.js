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
 * Mirrors `scripts/demo-smoke.mjs`: a STATIC half that always runs + a BROWSER
 * half gated on playwright resolution (CI installs it; override the resolution
 * root with KF_PLAYWRIGHT_DIR). Re-runnable: `node scripts/proof-demo-usability.mjs`.
 * The browser half serves the BUILT `dist/gh-pages/` (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

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
    const scenesSrc = read(path.join(DEMO, "app/scenes.ts"));
    const routerSrc = read(path.join(DEMO, "app/router.ts"));

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
// would pass vacuously. Mirror proof:computed-real-dom + occlusion-gate: a skip
// becomes a hard fail under KF_REQUIRE_BROWSER, so the gate cannot green-report
// SHIPs it never exercised.
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "clauses 2+3 (hero word-gap · unique Play aria) cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }

    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom("@playwright/test"));
        } catch {
            skipOrFail(
                "playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)",
            );
            return;
        }
    }

    const MIME = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".ttf": "font/ttf",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
    };
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    await new Promise((r) => server.listen(0, r));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

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
            const probe = await page.evaluate(() => {
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
                    // Same visual line iff the vertical centers coincide (±2px).
                    const sameLine =
                        Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) <=
                        2;
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
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
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
    } finally {
        await browser.close();
        server.close();
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
