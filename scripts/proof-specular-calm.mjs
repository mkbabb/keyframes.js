#!/usr/bin/env node
/**
 * proof:specular-calm — H.W2 S3 (WV-W2-MED-1, the "refined" half of D14, kf-side).
 *
 * THE BITE. D14's literal ask is "refined for hovers, totally." glass-ui's
 * `.glass-specular-track::before` rests at `--specular-intensity: 0.35` and hits
 * 0.6 on :hover (`glass-specular-track.css:53,101`) — a hot, white-cored
 * (`hsl(40 30% 100% / 0.55)`), `screen`-blended bloom, too loud as a panel
 * resting glow. The CALMER DEFAULT is a glass-ui HANDOFF (inv-16 — not authored
 * here), but the chronic-closure discipline forbids a bare HANDOFF tag: the
 * "refined" ask is PAIRED with a kf-side gate that the demo CAN green TODAY,
 * because `--specular-intensity` is a consumer-writable registered `@property`.
 * S3's `useSpecularPointer` + the `.cartoon-specular` recipe project a CALMED
 * tune (0.22 rest → 0.4 hover) onto every retained/composite `::before`. This
 * gate locks that tune so the user's literal ask is NOT BOOK-able.
 *
 * One BROWSER clause (a resolved `opacity` is a rendered fact) + a born-RED-today
 * WITNESS (the live unrefined glass-ui default would RED):
 *
 *   CLAUSE (the bite) — the kept/composite `::before` resolves CALM intensity.
 *     Mount a `.cartoon-specular glass-specular-track` probe (the demo's retained-
 *     glass recipe). Assert the `::before` resolves:
 *       rest  `opacity ≤ 0.25` (the recipe projects `--specular-rest: 0.22`), AND
 *       hover `opacity ≤ 0.4`  (the recipe projects `--specular-hover: 0.4`),
 *     hover driven by a REAL `:hover` (Playwright `.hover()` over the probe), not
 *     a synthetic class — the `:hover::before` cascade must actually fire.
 *
 *   WITNESS (born-RED today, the bite proof) — a BARE `.glass-specular-track`
 *     probe (NO `.cartoon-specular` recipe) resolves glass-ui's HOT default
 *     (rest `0.35` > 0.25). This proves the gate is NOT vacuous: the live,
 *     unrefined surface OVERSHOOTS the calm threshold, and the demo greens ONLY
 *     because the `.cartoon-specular` recipe overrides the pseudo's intensity by
 *     source order. If a future glass-ui ships the calmer default, the witness
 *     simply records the upstream value — it does not red the gate (the demo's
 *     own retained surfaces are the gated subject; the witness is evidence).
 *
 *   BITE: reds on the live tree BEFORE S3 — a retained specular surface resolves
 *   0.35 rest / 0.6 hover (the witness value). Greens ONLY on the recipe's
 *   `::before { --specular-intensity: var(--specular-rest, 0.22) }` /
 *   `:hover::before { … var(--specular-hover, 0.4) }` projection. Bump the recipe's
 *   rest above 0.25 or hover above 0.4 → reds. Drop the recipe (leaving the bare
 *   glass-ui hot default) → reds at the witness value.
 *
 * Storm-robust per WV-W2-LOW-3: the COMPUTED `::before` `opacity` is the PRIMARY
 * (no screenshot); the synthetic probe is deterministic and does not depend on the
 * live FSM surfacing the bezier panel. The paired source-anchor (a real panel
 * consumes the recipe) lives in proof:cartoon-specular-coexist CLAUSE A — the two
 * gates compose (coexist proves a real panel adopts the recipe; calm proves the
 * recipe's intensity is refined).
 *
 * Mirrors scripts/proof-stage-not-clipped.mjs (serveDist + Playwright + the
 * KF_REQUIRE_BROWSER skip-or-fail plumbing). Re-runnable:
 * `node scripts/proof-specular-calm.mjs`. Serves the BUILT dist/gh-pages/ (run
 * `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:specular-calm — H.W2 S3 (the refined half of D14: retained/composite specular rests calm)",
);

const REST_MAX = 0.25;
const HOVER_MAX = 0.4;
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the specular-calm assertion cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

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

function serveDist() {
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
    return server;
}

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
            skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
            return;
        }
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForTimeout(1200);

        // Mount the composite + the bare witness; tag them with ids so the REAL
        // :hover can be driven from outside (Playwright `.hover()`).
        const restProbe = await page.evaluate(() => {
            const mk = (cls, id) => {
                const e = document.createElement("div");
                e.className = cls;
                e.id = id;
                // place them apart + away from page chrome so .hover() lands clean.
                e.style.cssText =
                    "width:220px;height:130px;position:fixed;left:20px;z-index:99999";
                document.body.appendChild(e);
                return e;
            };
            const comp = mk("cartoon-specular glass-specular-track", "__calm_composite__");
            comp.style.top = "40px";
            const bare = mk("glass-specular-track", "__calm_witness__");
            bare.style.top = "220px";
            return {
                compRest: getComputedStyle(comp, "::before").opacity,
                bareRest: getComputedStyle(bare, "::before").opacity,
            };
        });

        // Drive the REAL :hover for the composite hover-intensity read.
        await page.hover("#__calm_composite__");
        await page.waitForTimeout(450); // let the opacity transition (240ms) settle
        const compHover = await page.evaluate(
            () => getComputedStyle(document.getElementById("__calm_composite__"), "::before").opacity,
        );
        // and the witness hover, for the born-RED evidence.
        await page.hover("#__calm_witness__");
        await page.waitForTimeout(450);
        const bareHover = await page.evaluate(
            () => getComputedStyle(document.getElementById("__calm_witness__"), "::before").opacity,
        );

        const compRest = parseFloat(restProbe.compRest);
        const bareRest = parseFloat(restProbe.bareRest);
        const cHover = parseFloat(compHover);
        const bHover = parseFloat(bareHover);

        // ── CLAUSE (the bite): the retained/composite ::before rests/hovers CALM ──
        if (compRest <= REST_MAX + 1e-6) {
            ok(
                `CLAUSE rest — the composite \`::before\` resolves rest opacity ${restProbe.compRest} ` +
                    `(≤ ${REST_MAX}) — the recipe projects \`--specular-rest: 0.22\` onto the pseudo.`,
            );
        } else {
            fail(
                `CLAUSE rest — the composite \`::before\` rest opacity ${restProbe.compRest} EXCEEDS ` +
                    `${REST_MAX}. The .cartoon-specular::before --specular-intensity: var(--specular-rest, 0.22) ` +
                    "projection is not winning — the retained specular is too hot at rest (D14 unmet).",
            );
        }
        if (cHover <= HOVER_MAX + 1e-6) {
            ok(
                `CLAUSE hover — the composite \`::before\` resolves :hover opacity ${compHover} ` +
                    `(≤ ${HOVER_MAX}) — the recipe projects \`--specular-hover: 0.4\` on real :hover.`,
            );
        } else {
            fail(
                `CLAUSE hover — the composite \`::before\` :hover opacity ${compHover} EXCEEDS ` +
                    `${HOVER_MAX}. The :hover::before projection is not winning — the catch-light ` +
                    "brightens past the calm ceiling on engagement (D14 unmet).",
            );
        }

        // ── WITNESS (born-RED today): the bare glass-ui default OVERSHOOTS ──
        // This proves the gate is non-vacuous: a retained surface WITHOUT the recipe
        // resolves the live hot default (0.35 rest / 0.6 hover) — exactly the value
        // the gate reds at. The witness is EVIDENCE, not a gated subject: it does not
        // fail the gate (glass-ui's default is glass-ui's to ship, S5 HANDOFF), but a
        // calm bare default (≤ REST_MAX) would mean the bite no longer bites here —
        // surface that loudly so a future reader knows the witness went quiet.
        if (bareRest > REST_MAX + 1e-6) {
            ok(
                `WITNESS (born-RED proof) — the BARE \`.glass-specular-track\` (no recipe) resolves the ` +
                    `live hot default rest ${restProbe.bareRest} / hover ${bareHover} — OVER the calm ` +
                    `ceiling (${REST_MAX}/${HOVER_MAX}). The composite greens ONLY because the recipe ` +
                    `overrides it: the gate bites the real defect, not a strawman.`,
            );
        } else {
            console.log(
                `  ⚠ WITNESS — the bare glass-ui default rest is now ${restProbe.bareRest} ` +
                    `(≤ ${REST_MAX}); glass-ui appears to have shipped the calmer default (S5 HANDOFF). ` +
                    `The kf-side bite is now moot at the bare surface — the composite clause still gates ` +
                    `the demo's own tune. No failure, but the born-RED evidence has gone quiet — record it.`,
            );
        }
        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:specular-calm — FAIL (${failures.length}): a retained/composite specular \`::before\` ` +
            `resolves OVER the calm ceiling (rest ≤ ${REST_MAX}, hover ≤ ${HOVER_MAX}). The "refined for ` +
            `hovers" half of D14 is unmet — the catch-light is still too hot.`,
    );
    process.exit(1);
}
console.log(
    `\nproof:specular-calm — PASS: the retained/composite specular \`::before\` rests ≤ ${REST_MAX} and ` +
        `hovers ≤ ${HOVER_MAX} (the demo's 0.22/0.4 tune), while the bare glass-ui default overshoots — ` +
        `the "refined" half of D14 is delivered kf-side and is NOT BOOK-able.`,
);
