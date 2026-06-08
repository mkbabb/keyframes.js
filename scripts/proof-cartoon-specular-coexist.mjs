#!/usr/bin/env node
/**
 * proof:cartoon-specular-coexist — H.W2 S2-COMPOSITE (WV-W2-HIGH-3, the D14 ask).
 *
 * THE BITE. D14 ("the specular radial item needs to be refined for hovers,
 * totally") is NOT "delete the radial" — it is "the glassy panel I LIKE should
 * have cartoon DEPTH and a refined, tracked catch-light TOGETHER." The H.W2 prop
 * API emits cartoon XOR specular (`<Card surface=>` maps to `cartoon-surface` or
 * `glass-specular-track`, never both — `CardFooter:37`), so the surface prop ALONE
 * cannot deliver the composite. S2-COMPOSITE is the ONE legitimate demo
 * class-composition: a `.cartoon-specular` recipe co-applies BOTH glass-ui classes
 * on the deliberately-glassy interactive panel (the cubic-bézier curve editor) +
 * `useSpecularPointer` wires the cursor and calms the intensity. Without this gate
 * the chronic re-papers: a green `proof:cartoon-is-panel-depth` standing over an
 * UNMET ask (cartoon depth landed, but the user's liked-glass panel lost its
 * catch-light, or kept a broken centered bloom).
 *
 * Two clauses — a STATIC source anchor (non-vacuity: a REAL kept-glass panel
 * consumes the composite, not just a synthetic div) + a BROWSER bite (the recipe
 * resolves BOTH invariants under a synthesized pointermove, storm-robust):
 *
 *   CLAUSE A (static, non-vacuity) — the composite is WIRED on a real panel.
 *     `TimingFunctionPanel.vue`'s cubic-bézier Card carries `surface="cartoon"`
 *     AND `cartoon-specular` AND `glass-specular-track` AND a `useSpecularPointer`
 *     wire; and `design-idioms.css` DEFINES the `.cartoon-specular` recipe (an
 *     `@apply cartoon-surface` self-standing depth + the `::before`
 *     `--specular-intensity` projection rules). A green browser clause over a
 *     synthetic probe that NO real panel consumes would be vacuous — this clause
 *     forbids it.
 *
 *   CLAUSE B (browser, the bite) — the recipe resolves the composite live.
 *     Mount a `.cartoon-specular glass-specular-track` probe; synthesize a
 *     pointermove by writing `--mouse-x: 30%` / `--mouse-y: 70%` (the exact
 *     `useSpecularPointer` seam — the composable writes those percentages on
 *     `pointermove`); after the typed-`@property` position transition SETTLES,
 *     assert the `::before` resolves BOTH:
 *       (1) box-shadow from `--shadow-cartoon-md` (the cartoon DEPTH — its `-4px
 *           3px 1px` offset signature, distinct from `--shadow-cartoon-lg`'s
 *           `-6px 4px`), AND
 *       (2) a TRACKED catch-light, not a centered floor: `--specular-x: 30%`
 *           (≠50%) on the pseudo AND the `background` `circle at 30% 70%` (the
 *           storm-robust dual read — the numeric `--specular-x` is
 *           transition-immune PRIMARY; the `circle at <x≠50%>` regex is the
 *           contract's stated form, read after settle).
 *     A NON-VACUITY guard mounts a CENTERED probe (no mouse write) and asserts it
 *     resolves `--specular-x: 50%` + a BARE `circle` (no `at`) — proving the
 *     tracked/centered discrimination is real, so a "tracked" pass cannot be a
 *     serialization artifact.
 *
 *   BITE: reds on the live tree BEFORE S2-COMPOSITE — no panel composes cartoon
 *   depth + a tracked specular (the prop API cannot express it, and the bezier
 *   Card was plain glass). Greens ONLY on the `.cartoon-specular` recipe +
 *   `glass-specular-track` co-applied + `useSpecularPointer`. Drop the recipe →
 *   the box-shadow falls to the glass tier's `shadow-card` (not `--shadow-cartoon-
 *   md`) → CLAUSE B (1) reds. Drop the pointer wire / the seam → `--specular-x`
 *   stays 50% → CLAUSE B (2) reds. Unwire the real Card → CLAUSE A reds.
 *
 * Storm-robust per WV-W2-LOW-3: the COMPUTED `::before` check is PRIMARY (no
 * screenshot); the synthetic probe is deterministic — it does not depend on the
 * live FSM driving the bezier panel into the DOM (which needs multi-step UI
 * choreography flaky under the route/dock state storm). CLAUSE A's static anchor
 * is what binds the probe to a REAL consuming panel.
 *
 * Mirrors scripts/proof-stage-not-clipped.mjs (serveDist + Playwright + the
 * KF_REQUIRE_BROWSER skip-or-fail plumbing). Browser-only for CLAUSE B (a resolved
 * gradient is a rendered fact). Re-runnable:
 * `node scripts/proof-cartoon-specular-coexist.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const DEMO = path.join(REPO, "demo");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:cartoon-specular-coexist — H.W2 S2-COMPOSITE (the D14 ask: cartoon depth AND a tracked catch-light TOGETHER)",
);

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the composite-coexist assertion cannot pass vacuously",
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

// ── CLAUSE A: the composite is WIRED on a real panel (static, non-vacuity) ────
function clauseA_staticAnchor() {
    const bezierPanel = path.join(
        DEMO,
        "@/components/custom/animation-controls/controls/TimingFunctionPanel.vue",
    );
    const idioms = path.join(DEMO, "@/styles/design-idioms.css");

    if (!fs.existsSync(bezierPanel)) {
        fail(`CLAUSE A — the bezier panel source is missing: ${bezierPanel}`);
        return;
    }
    if (!fs.existsSync(idioms)) {
        fail(`CLAUSE A — design-idioms.css is missing: ${idioms}`);
        return;
    }

    const panelSrc = fs.readFileSync(bezierPanel, "utf8");
    const idiomsSrc = fs.readFileSync(idioms, "utf8");

    // The cubic-bézier composite Card MUST carry all three class/prop seams AND
    // wire useSpecularPointer. The Card tag spans multiple attrs — match the tag
    // that carries `cartoon-specular` (the composite host).
    const cardTagMatch = panelSrc.match(/<Card\b[^>]*cartoon-specular[^>]*>/s);
    if (!cardTagMatch) {
        fail(
            "CLAUSE A — no `<Card … cartoon-specular …>` in TimingFunctionPanel.vue: the " +
                "kept-glass composite host is not the recipe host. S2-COMPOSITE requires the " +
                "bezier Card to carry `.cartoon-specular`.",
        );
    } else {
        const tag = cardTagMatch[0];
        const hasSurfaceCartoon = /surface=["']cartoon["']/.test(tag);
        const hasSpecularTrack = /\bglass-specular-track\b/.test(tag);
        if (hasSurfaceCartoon && hasSpecularTrack) {
            ok(
                "CLAUSE A — the bezier Card composes the recipe: `surface=\"cartoon\"` " +
                    "(cartoon depth, drops `glass-specular-track`+`shadow-card`) + the manual " +
                    "`cartoon-specular` + `glass-specular-track` (re-adds the `::before` catch-light) — " +
                    "the prop API XOR is bridged by the demo class-composition.",
            );
        } else {
            fail(
                "CLAUSE A — the bezier composite Card is missing a seam (" +
                    `surface="cartoon": ${hasSurfaceCartoon}, glass-specular-track: ${hasSpecularTrack}` +
                    "). All of surface=\"cartoon\" + cartoon-specular + glass-specular-track must co-apply.",
            );
        }
    }

    // useSpecularPointer MUST be wired (the cursor seam + the intensity tune source).
    const wiresPointer =
        /useSpecularPointer\s*\(/.test(panelSrc) &&
        /from\s+["']@composables\/useSpecularPointer["']/.test(panelSrc);
    if (wiresPointer) {
        ok(
            "CLAUSE A — the bezier panel wires `useSpecularPointer` (the cursor seam + the " +
                "single-sourced 0.22/0.4 intensity tune), so the catch-light travels, not blooms centered.",
        );
    } else {
        fail(
            "CLAUSE A — TimingFunctionPanel.vue does not wire `useSpecularPointer` from " +
                "`@composables/useSpecularPointer`; without it the `::before` falls to the centered " +
                "var(--mouse-x,50%) floor — the broken bloom D14 is about.",
        );
    }

    // The recipe MUST be defined in design-idioms.css (the @apply cartoon-surface
    // self-standing depth + the ::before --specular-intensity projection).
    const hasRecipe = /\.cartoon-specular\s*\{[^}]*@apply\s+cartoon-surface/s.test(idiomsSrc);
    const hasBeforeRest = /\.cartoon-specular::before\s*\{[^}]*--specular-intensity/s.test(idiomsSrc);
    const hasBeforeHover = /\.cartoon-specular:hover::before\s*\{[^}]*--specular-intensity/s.test(idiomsSrc);
    if (hasRecipe && hasBeforeRest && hasBeforeHover) {
        ok(
            "CLAUSE A — design-idioms.css DEFINES the `.cartoon-specular` recipe " +
                "(`@apply cartoon-surface` + the `::before` rest/hover `--specular-intensity` " +
                "projection of the consumer-writable tune).",
        );
    } else {
        fail(
            "CLAUSE A — the `.cartoon-specular` recipe is incomplete in design-idioms.css (" +
                `@apply cartoon-surface: ${hasRecipe}, ::before rest: ${hasBeforeRest}, ` +
                `:hover::before: ${hasBeforeHover}). The recipe is the one structural projection of the ` +
                "non-inheriting registered `--specular-intensity` onto the pseudo.",
        );
    }
}

// ── CLAUSE B: the recipe resolves the composite live (browser, the bite) ──────
async function clauseB_browserBite() {
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
        // The demo CSS (the `.cartoon-specular` recipe + the glass-ui import) must
        // be live in the document for the probe to resolve — load a real scene.
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForTimeout(1200);

        const probe = await page.evaluate(async () => {
            const mk = (cls) => {
                const e = document.createElement("div");
                e.className = cls;
                e.style.cssText = "width:220px;height:130px;position:relative";
                document.body.appendChild(e);
                return e;
            };
            // ── the composite probe (the S2-COMPOSITE recipe, the user's bezier panel)
            const comp = mk("cartoon-specular glass-specular-track");
            const compBox = getComputedStyle(comp).boxShadow;
            // synthesize the pointermove seam: useSpecularPointer writes these % on
            // pointermove; the gate writes them directly (the same inline-style seam).
            comp.style.setProperty("--mouse-x", "30%");
            comp.style.setProperty("--mouse-y", "70%");
            // let the typed `@property` --specular-x/y transition (150ms) settle so the
            // `background` re-serializes to `circle at 30% 70%` (mid-transition it folds
            // to a bare `circle` — the numeric --specular-x read is transition-immune).
            await new Promise((r) => setTimeout(r, 450));
            const compBefore = getComputedStyle(comp, "::before");
            const compSpecularX = compBefore.getPropertyValue("--specular-x").trim();
            const compSpecularY = compBefore.getPropertyValue("--specular-y").trim();
            const compBg = compBefore.backgroundImage;

            // ── the NON-VACUITY centered probe: no mouse write → the floor
            const centered = mk("cartoon-specular glass-specular-track");
            const centeredBefore = getComputedStyle(centered, "::before");
            const centeredSpecularX = centeredBefore.getPropertyValue("--specular-x").trim();
            const centeredBg = centeredBefore.backgroundImage;

            const out = {
                compBox,
                compSpecularX,
                compSpecularY,
                compBg,
                centeredSpecularX,
                centeredBg,
            };
            comp.remove();
            centered.remove();
            return out;
        });

        // (1) cartoon DEPTH — box-shadow resolves from --shadow-cartoon-md.
        //     The md token's offset signature is `-4px 3px 1px`; lg is `-6px 4px`.
        //     The glass tier's shadow-card (the fallback if the recipe drops) carries
        //     NEITHER offset, so this discriminates the cartoon depth from the glass plate.
        const hasMdOffset = /-4px\s+3px\s+1px/.test(probe.compBox);
        const hasLgOffset = /-6px\s+4px/.test(probe.compBox);
        if (hasMdOffset && !hasLgOffset) {
            ok(
                "CLAUSE B (1) cartoon DEPTH — the composite resolves box-shadow from " +
                    `\`--shadow-cartoon-md\` (the -4px 3px 1px offset stamp), not shadow-card / -lg.`,
            );
        } else {
            fail(
                "CLAUSE B (1) cartoon DEPTH — the composite box-shadow does NOT resolve from " +
                    `\`--shadow-cartoon-md\` (-4px 3px 1px). Got: "${probe.compBox.slice(0, 90)}". ` +
                    "Without the recipe's `@apply cartoon-surface`, the box falls to the glass tier's " +
                    "shadow-card — the cartoon depth half of the composite is unmet.",
            );
        }

        // (2) tracked catch-light — --specular-x is 30% (≠50%), NOT the centered floor.
        const compX = parseFloat(probe.compSpecularX);
        const tracked = probe.compSpecularX !== "" && Math.abs(compX - 50) > 1;
        const circleAt = /radial-gradient\(\s*circle\s+at\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/.exec(
            probe.compBg,
        );
        const circleAtTracked = circleAt && Math.abs(parseFloat(circleAt[1]) - 50) > 1;
        if (tracked && circleAtTracked) {
            ok(
                "CLAUSE B (2) tracked catch-light — after the synthesized pointermove the `::before` " +
                    `resolves \`--specular-x: ${probe.compSpecularX}\` (≠50%, the cursor seam) AND ` +
                    `\`background: radial-gradient(circle at ${circleAt[1]}% ${circleAt[2]}% …)\` — the ` +
                    "travelling light, not a centered bloom.",
            );
        } else {
            fail(
                "CLAUSE B (2) tracked catch-light — the `::before` did NOT track the synthesized " +
                    `pointermove (--specular-x: "${probe.compSpecularX}", background: ` +
                    `"${probe.compBg.slice(0, 80)}"). The pointer seam (--mouse-x → --specular-x) is ` +
                    "not resolving — the catch-light stays the centered floor D14 rejects.",
            );
        }

        // NON-VACUITY — the centered probe (no mouse write) resolves the FLOOR:
        // --specular-x: 50% + a BARE `circle` (no `at`). This proves the
        // tracked/centered discrimination is a real signal, not serialization noise.
        const centeredX = parseFloat(probe.centeredSpecularX);
        const centeredIsFloor = Math.abs(centeredX - 50) < 1;
        const centeredBareCircle =
            /radial-gradient\(\s*circle\s*,/.test(probe.centeredBg) &&
            !/circle\s+at\s/.test(probe.centeredBg);
        if (centeredIsFloor && centeredBareCircle) {
            ok(
                "CLAUSE B (non-vacuity) — the centered probe (no pointer write) resolves the FLOOR " +
                    `(--specular-x: ${probe.centeredSpecularX}, a BARE \`circle\` with no \`at\`) — the ` +
                    "tracked-vs-centered discrimination is real, not a serialization artifact.",
            );
        } else {
            fail(
                "CLAUSE B (non-vacuity) — the centered floor probe did not resolve as expected " +
                    `(--specular-x: "${probe.centeredSpecularX}", background: ` +
                    `"${probe.centeredBg.slice(0, 80)}"). The gate cannot distinguish tracked from ` +
                    "centered, so a 'tracked' pass would be unverifiable.",
            );
        }
        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

clauseA_staticAnchor();
await clauseB_browserBite();

if (failures.length > 0) {
    console.error(
        `\nproof:cartoon-specular-coexist — FAIL (${failures.length}): the D14 composite ` +
            "(cartoon depth AND a tracked, refined catch-light on the kept-glass bezier panel) is " +
            "not delivered. The chronic re-papers without it (a green cartoon-depth gate over an " +
            "unmet ask).",
    );
    process.exit(1);
}
console.log(
    "\nproof:cartoon-specular-coexist — PASS: the kept-glass bezier panel composes cartoon DEPTH " +
        "(`--shadow-cartoon-md`) AND a TRACKED catch-light (`--specular-x ≠ 50%`, `circle at <x≠50%>`) " +
        "after a synthesized pointermove — the S2-COMPOSITE recipe delivers the D14 ask.",
);
