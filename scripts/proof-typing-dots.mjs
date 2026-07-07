#!/usr/bin/env node
/**
 * proof:typing-dots — the H.W6 hero-blink gate (the perceptual BREAK + the
 * cascade collision, locked born-RED→GREEN).
 *
 * THE DEFECT (live on the pre-H tree). The hero's first-paint "..." was a
 * hand-rolled CSS `@keyframes dotFade` on ONE span (`AnimatedText.split(/\s+/)`
 * left "..." whitespace-free → a single token → a single inline-block), driven
 * by a TITLE-sized 2.6s duration, blanking to `opacity: 0` for 43% of every
 * cycle (measured: 325 rAF samples, min 0.000, 43% < 0.3). No `. → ·· → ···`
 * cadence — one slow ghost-swell. AND the title lift + `.dot-fade` BOTH set the
 * `animation` shorthand on that one span → a silent cascade loser.
 *
 * THE FIX (H.W6). The ellipsis becomes its OWN substrate — `TypingDots.vue`:
 * N explicit dot `<span>`s, each driven by a per-dot `CSSKeyframesAnimation`
 * (`iterationCount: Infinity`, the dogfood seam) with a `stagger()`-distributed
 * per-dot `delay` and a `steppedEase` cadence, interpolating ONLY numeric
 * opacity (rest 0.2 → peak 1 → 0.2, NEVER 0) on a FIXED short 1.2s cycle. The
 * cascade collision dies WITH the split (the dots carry NEITHER the title lift
 * NOR `.dot-fade`; `.dot-fade` + `@keyframes dotFade` are deleted — no legacy).
 *
 * THE GATE — five clauses, each BITING on the exact defect it forbids:
 *
 *   (a) THREE distinct animated dot spans (browser). `n_dots === 3`. BITE: the
 *       `split(/\s+/)` substrate yielded ONE span — reds; the per-dot v-for
 *       greens.
 *   (b) A LEFT-TO-RIGHT cadence (browser · WV-W6-LOW-1). Each dot's opacity
 *       waveform rises STRICTLY LATER than the one to its left (the `stagger(3,
 *       {from:"first"})` ramp [0,160,320]ms → measured rise-onsets strictly
 *       increasing). BITE: a single shared `dotFade` → all dots share one phase
 *       → the cadence reds.
 *   (c) The dots NEVER vanish (browser). `min opacity over the cycle >= 0.15`.
 *       BITE: the `0%/100% opacity:0` vanish floors at 0.000 (43% near-invisible)
 *       → reds; the 0.2-rest blink greens.
 *   (d) A SHORT FIXED cycle (browser). The rise-to-rise period `<= 1.6s`. BITE:
 *       the title-sized 2.6s duration → reds; the fixed 1.2s cycle greens.
 *   (e) The CASCADE LINT (static + browser · a-styling-idioms §4). No single
 *       element class-set carries TWO rules that both set the `animation`
 *       shorthand: STATIC — `AnimatedText.vue` declares exactly one
 *       `animation:`-shorthand rule (the title lift — `.lift-down` in the H-era
 *       word split, `.wave-char` since the T.D10 per-char rebirth) and carries NO `.dot-fade` /
 *       `@keyframes dotFade` residue (no-legacy); the `.typing-dot` substrate
 *       declares NO CSS `animation` shorthand (the engine drives it). BROWSER —
 *       each rendered dot resolves a SINGLE `animation-name` (`none` — the JS
 *       engine paints opacity inline, so no CSS animation collides). BITE:
 *       re-stack the title lift + `.dot-fade` on one node → a dot resolves two
 *       animation-names / a second `animation:`-shorthand rule reappears → reds.
 *
 * ISOLATION (WV-W6-HIGH-1). The home route cannot mount the dots pre-render —
 * the D12 storm unmounts home in <1 rAF — so the SOURCE fix is FSM-orthogonal
 * and the gate mounts `<TypingDots/>` in ISOLATION (its own component, route-
 * free): the gate Vite-builds a tiny harness (scripts/lib/typing-dots-harness/)
 * that mounts ONLY `<TypingDots/>` through the SAME `@components`/`@src` aliases
 * the demo uses, then serves + Playwright rAF-samples each span. No router, no
 * FSM, no design language — the REAL production component, in isolation.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage over the
 * isolation-harness dist, J.W3 S1 — serveDist + resolveChromium +
 * context/teardown; under KF_REQUIRE_BROWSER a playwright-absent skip becomes a
 * hard fail AT THE LIB SEAM). The static clause (e) always runs; the browser
 * clauses (a)–(d) + the runtime half of (e) gate on playwright resolution.
 * Re-runnable: `node scripts/proof-typing-dots.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const HARNESS = path.join(REPO, "scripts/lib/typing-dots-harness");
const HARNESS_DIST = path.join(REPO, "dist/_proof-typing-dots");
const TYPING_DOTS = path.join(DEMO, "@/components/custom/instrument/shell/TypingDots.vue");
const ANIMATED_TEXT = path.join(DEMO, "@/components/custom/instrument/shell/AnimatedText.vue");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

console.log(
    "proof:typing-dots — H.W6 (the per-dot dogfooded blink + the cascade decouple)",
);

// ── (e-static) THE CASCADE LINT — no double-`animation`-shorthand on one node ─
// The structural lock (a-styling-idioms §4): the dots live on a DISJOINT
// substrate (TypingDots), so no node carries two `animation` shorthands. Static
// half (always runs, browser-free): AnimatedText declares exactly one
// `animation:`-shorthand rule (the title lift — `.wave-char` post-T.D10), the `.dot-fade` + `@keyframes
// dotFade` are GONE (no-legacy), and the `.typing-dot` substrate carries NO CSS
// `animation` shorthand (the engine drives opacity via inline style).
{
    if (!fs.existsSync(TYPING_DOTS)) {
        fail(
            `[cascade-lint] ${rel(TYPING_DOTS)} does not exist — the dedicated ` +
                `TypingDots substrate (the cascade decouple) is missing (H.W6 S1).`,
        );
    }
    if (!fs.existsSync(ANIMATED_TEXT)) {
        fail(`[cascade-lint] ${rel(ANIMATED_TEXT)} does not exist.`);
    }

    if (fs.existsSync(ANIMATED_TEXT)) {
        const atRaw = read(ANIMATED_TEXT);
        // Strip comments before the no-legacy scan — AnimatedText's docstrings
        // legitimately NAME the removed `.dot-fade` / `@keyframes dotFade` (the
        // comment explaining what the H.W6 swap deleted); that explanatory
        // mention must NOT red the clause, only its return as LIVE code. Strips
        // HTML comments (the <template> prose), CSS/JS block comments, and JS
        // line comments (the <script setup> note) — mirrors proof-dogfood.mjs.
        const at = atRaw
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
        // The legacy ellipsis mechanism must be GONE (no legacy beside the
        // replacement) — neither the `.dot-fade` class rule nor `@keyframes
        // dotFade` may survive in AnimatedText.
        const hasDotFadeClass = /(^|[\s.{])\.dot-fade\b/m.test(at);
        const hasDotFadeKeyframes = /@keyframes\s+dotFade\b/.test(at);
        if (hasDotFadeClass || hasDotFadeKeyframes) {
            fail(
                `[cascade-lint] ${rel(ANIMATED_TEXT)} still carries the legacy ` +
                    `ellipsis mechanism (${[
                        hasDotFadeClass && ".dot-fade rule",
                        hasDotFadeKeyframes && "@keyframes dotFade",
                    ]
                        .filter(Boolean)
                        .join(" + ")}) — H.W6 deletes it WITH the TypingDots ` +
                    `swap (no legacy beside the replacement).`,
            );
        } else {
            ok(
                `cascade-lint (static) — ${rel(ANIMATED_TEXT)} carries no ` +
                    `.dot-fade rule / @keyframes dotFade (the legacy ellipsis ` +
                    `mechanism is deleted, no legacy beside the replacement)`,
            );
        }

        // Exactly one rule in AnimatedText sets the `animation` shorthand: the
        // title lift (`.wave-char` since T.D10; `.lift-down` in the H era).
        // `animation-fill-mode` / `animation: none`
        // (the PRM longhand + the reset) are NOT the shorthand — count only a
        // bare `animation:` followed by a NON-`none` value list (the shorthand).
        const shorthandRules = [
            ...at.matchAll(/(^|[^-])animation:\s*([^;]+);/gm),
        ].filter((m) => m[2].trim() !== "none");
        if (shorthandRules.length !== 1) {
            fail(
                `[cascade-lint] ${rel(ANIMATED_TEXT)} declares ${shorthandRules.length} ` +
                    `\`animation\`-shorthand rule(s) (expected exactly 1 — the title ` +
                    `title lift): ${shorthandRules
                        .map((m) => m[2].trim())
                        .join(" | ")}. Two shorthand rules on one node is the ` +
                    `cascade collision (a-styling-idioms §4).`,
            );
        } else {
            ok(
                `cascade-lint (static) — ${rel(ANIMATED_TEXT)} declares exactly ` +
                    `ONE \`animation\`-shorthand rule (the title lift); no ` +
                    `second shorthand to collide`,
            );
        }
    }

    if (fs.existsSync(TYPING_DOTS)) {
        // Strip comments — TypingDots' docstrings legitimately name the engine
        // `animation` loop in prose; only a LIVE CSS `animation:` shorthand reds.
        const td = read(TYPING_DOTS)
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
        // The dots substrate must NOT declare a CSS `animation` shorthand — the
        // engine drives opacity via inline style; a CSS `animation:` here would
        // be a second mechanism (and could collide if the host re-adds one).
        const tdShorthand = [
            ...td.matchAll(/(^|[^-])animation:\s*([^;]+);/gm),
        ].filter((m) => m[2].trim() !== "none");
        if (tdShorthand.length !== 0) {
            fail(
                `[cascade-lint] ${rel(TYPING_DOTS)} declares a CSS ` +
                    `\`animation\`-shorthand rule (${tdShorthand
                        .map((m) => m[2].trim())
                        .join(" | ")}) — the dots are ENGINE-driven (inline ` +
                    `opacity); a CSS animation here is a hand-rolled second ` +
                    `mechanism beside the dogfooded loop.`,
            );
        } else {
            ok(
                `cascade-lint (static) — ${rel(TYPING_DOTS)} declares no CSS ` +
                    `\`animation\` shorthand (the dots are engine-driven, not ` +
                    `hand-rolled CSS)`,
            );
        }
    }
}

// ── BROWSER half — clauses (a)/(b)/(c)/(d) + the runtime half of (e) ─────────
// In CI the demo-smoke job sets KF_REQUIRE_BROWSER=1; there a skip becomes a
// hard fail AT THE LIB SEAM (the gate cannot green-report a perceptual fix it
// never sampled — withPage throws under KF_REQUIRE_BROWSER=1, J.W3 S6d/W7-1).

/**
 * buildHarness — Vite-build the isolated TypingDots harness once into
 * dist/_proof-typing-dots/. Mounts the REAL component through the demo's
 * `@components`/`@src` aliases (configFile:false so we do not pull the demo's
 * multi-page gh-pages config). Fast (~100ms — only the SFC + the engine).
 */
async function buildHarness() {
    const { build } = await import("vite");
    const { default: Vue } = await import("@vitejs/plugin-vue");
    await build({
        root: HARNESS,
        logLevel: "error",
        configFile: false,
        resolve: {
            alias: {
                "@src": path.resolve(REPO, "src"),
                "@components": path.resolve(REPO, "demo/@/components"),
                "@composables": path.resolve(REPO, "demo/@/composables"),
                "@styles": path.resolve(REPO, "demo/@/styles"),
                "@utils": path.resolve(REPO, "demo/@/utils"),
                "@assets": path.resolve(REPO, "assets"),
            },
            // The demo's dev/serve resolution order (vite.config.ts devConditions).
            conditions: ["module", "browser", "default"],
        },
        plugins: [Vue()],
        build: {
            outDir: HARNESS_DIST,
            emptyOutDir: true,
            minify: false,
            target: "es2022",
        },
    });
}

async function browserHalf() {
    if (!fs.existsSync(TYPING_DOTS)) {
        // The static cascade-lint clause already FAILED on the missing substrate
        // (the gate reds); the browser half cannot build the isolation harness.
        console.log(
            "  ○ browser half skipped — TypingDots.vue missing (the cascade-lint static clause reds)",
        );
        return;
    }

    try {
        await buildHarness();
    } catch (e) {
        fail(
            `[harness] the isolated TypingDots build failed — ${String(e?.message ?? e)
                .split("\n")[0]
                .slice(0, 200)}`,
        );
        return;
    }

    const result = await withPage(
        {
            distDir: HARNESS_DIST,
            label: "clauses (a)–(d) + the cascade runtime check",
            // A wide, large-type viewport so the dots lay out with real boxes.
            context: { viewport: { width: 900, height: 480 } },
        },
        async (page, { url }) => {
        await page.goto(url, { waitUntil: "load" });

        // Wait for the REAL component to render its dot spans (the v-for over
        // `count`, default 3) and for the engine to attach + start.
        let mounted = false;
        for (let i = 0; i < 30 && !mounted; i++) {
            try {
                mounted = await page.evaluate(
                    () => document.querySelectorAll(".typing-dot").length >= 1,
                );
            } catch {
                /* context churn — retry */
            }
            if (!mounted) await page.waitForTimeout(200);
        }
        if (!mounted) {
            fail(
                "the isolated <TypingDots/> rendered no .typing-dot spans — the " +
                    "component did not mount (the harness build/serve path is broken)",
            );
            return;
        }

        // Sample each dot's COMPUTED opacity + the resolved animation-name over
        // ~3.4s (≥2 full 1.2s cycles + the 0.32s stagger spread), in-page via
        // rAF. The engine paints `opacity` inline through transformTargetsStyle
        // (utils.ts), so getComputedStyle reads the live driven value.
        const probe = await page.evaluate(async (SAMPLE_MS) => {
            const dots = [...document.querySelectorAll(".typing-dot")];
            const series = dots.map(() => []);
            const times = [];
            // The CSS animation-name resolved on each dot (the cascade runtime
            // check): a JS-driven dot must resolve `none` (a single, non-CSS
            // mechanism) — never two stacked CSS animation-names.
            const animNames = dots.map(
                (d) => getComputedStyle(d).animationName,
            );
            const t0 = performance.now();
            await new Promise((resolve) => {
                function tick() {
                    const now = performance.now() - t0;
                    times.push(now);
                    dots.forEach((d, i) =>
                        series[i].push(+getComputedStyle(d).opacity),
                    );
                    if (now < SAMPLE_MS) requestAnimationFrame(tick);
                    else resolve();
                }
                requestAnimationFrame(tick);
            });
            return { count: dots.length, series, times, animNames };
        }, 3400);

        const { count, series, times, animNames } = probe;

        // ── (a) THREE distinct animated dot spans ────────────────────────────
        if (count === 3) {
            ok(`(a) three distinct dot spans rendered (count === 3)`);
        } else {
            fail(
                `(a) three distinct dot spans — found ${count} .typing-dot ` +
                    `span(s) (the split(/\\s+/) substrate yields ONE span; the ` +
                    `per-dot v-for yields three)`,
            );
        }

        // Per-dot waveform stats.
        const mins = series.map((s) => Math.min(...s));
        const maxs = series.map((s) => Math.max(...s));

        // ── (c) the dots NEVER vanish (min opacity over the cycle >= 0.15) ────
        const minOpacity = Math.min(...mins);
        if (minOpacity >= 0.15) {
            ok(
                `(c) the dots never vanish — min opacity ${minOpacity.toFixed(
                    3,
                )} >= 0.15 (per-dot mins ${mins
                    .map((m) => m.toFixed(2))
                    .join(", ")})`,
            );
        } else {
            fail(
                `(c) the dots never vanish — min opacity ${minOpacity.toFixed(
                    3,
                )} < 0.15 (the 0%/100% opacity:0 vanish floors at 0.000, the ` +
                    `43% ghost window). The rest opacity must be ~0.2.`,
            );
        }

        // A non-vacuity guard: the dots must actually PULSE (a static 0.2 dot
        // would pass (c) vacuously). Require a real peak well above the floor.
        const maxOpacity = Math.max(...maxs);
        if (maxOpacity >= 0.85 && maxOpacity - minOpacity >= 0.4) {
            ok(
                `(c-amplitude) the dots pulse — peak ${maxOpacity.toFixed(
                    3,
                )}, amplitude ${(maxOpacity - minOpacity).toFixed(
                    3,
                )} (a real blink, not a static floor)`,
            );
        } else {
            fail(
                `(c-amplitude) the dots pulse — peak ${maxOpacity.toFixed(
                    3,
                )}, amplitude ${(maxOpacity - minOpacity).toFixed(
                    3,
                )} (a near-static dot would pass the >=0.15 floor vacuously; ` +
                    `the blink must pulse to ~1.0)`,
            );
        }

        // The upward 0.5-crossings of each dot's waveform — the cadence/period
        // anchor (robust against the steppedEase plateau, which makes naive
        // peak-detection noisy).
        const upCrossings = (s) => {
            const xs = [];
            for (let i = 1; i < s.length; i++) {
                if (s[i - 1] < 0.5 && s[i] >= 0.5) xs.push(times[i]);
            }
            return xs;
        };
        const crossings = series.map(upCrossings);
        const firstOnset = crossings.map((xs) => (xs.length ? xs[0] : null));

        // ── (b) a LEFT-TO-RIGHT cadence (WV-W6-LOW-1) ────────────────────────
        // For `stagger(3, {from:"first"})` the per-dot delays are [0,160,320]ms,
        // so the rise-onsets are STRICTLY INCREASING left→right. (A single
        // shared dotFade → identical onsets → reds.)
        if (count >= 2 && firstOnset.every((o) => o !== null)) {
            const deltas = [];
            for (let i = 1; i < firstOnset.length; i++) {
                deltas.push(firstOnset[i] - firstOnset[i - 1]);
            }
            // Each later dot rises a clear margin AFTER the one to its left —
            // a real stagger step (allow a generous lower bound vs the 160ms
            // nominal to absorb rAF granularity; a shared phase gives ~0).
            const STEP_FLOOR_MS = 60;
            if (deltas.every((d) => d >= STEP_FLOOR_MS)) {
                ok(
                    `(b) left-to-right cadence — rise-onsets ${firstOnset
                        .map((o) => o.toFixed(0))
                        .join(", ")}ms, each later dot +${deltas
                        .map((d) => d.toFixed(0))
                        .join("/+")}ms (strictly increasing, >= ${STEP_FLOOR_MS}ms)`,
                );
            } else {
                fail(
                    `(b) left-to-right cadence — rise-onset deltas ${deltas
                        .map((d) => d.toFixed(0))
                        .join(", ")}ms are not all >= ${STEP_FLOOR_MS}ms (a ` +
                        `single shared dotFade gives ~0 — the dots clump, no ` +
                        `\`. → ·· → ···\` cadence)`,
                );
            }
        } else {
            fail(
                `(b) left-to-right cadence — could not measure a rise-onset for ` +
                    `every dot (onsets: ${firstOnset
                        .map((o) => (o == null ? "?" : o.toFixed(0)))
                        .join(", ")})`,
            );
        }

        // ── (d) a SHORT FIXED cycle (rise-to-rise period <= 1.6s) ────────────
        // Use dot 0's successive upward 0.5-crossings (its full blink period).
        const periods = [];
        for (let i = 1; i < crossings[0].length; i++) {
            periods.push(crossings[0][i] - crossings[0][i - 1]);
        }
        if (periods.length >= 1) {
            const medPeriod = periods.slice().sort((a, b) => a - b)[
                Math.floor(periods.length / 2)
            ];
            if (medPeriod <= 1600) {
                ok(
                    `(d) short fixed cycle — dot-0 period ${medPeriod.toFixed(
                        0,
                    )}ms <= 1600ms (periods: ${periods
                        .map((p) => p.toFixed(0))
                        .join(", ")}ms)`,
                );
            } else {
                fail(
                    `(d) short fixed cycle — dot-0 period ${medPeriod.toFixed(
                        0,
                    )}ms > 1600ms (the title-sized 2.6s duration). The cycle ` +
                        `must be a fixed ~1.2s, not text.length-derived.`,
                );
            }
        } else {
            fail(
                `(d) short fixed cycle — could not measure a full blink period ` +
                    `for dot 0 (the dot did not complete a cycle in the sample ` +
                    `window; a too-long cycle would itself red this)`,
            );
        }

        // ── (e-runtime) the cascade lint, live ───────────────────────────────
        // Each rendered dot resolves a SINGLE animation-name. The JS engine
        // paints opacity inline, so each dot's computed `animation-name` is
        // `none` (no CSS animation collides). A comma in animation-name would
        // mean TWO stacked CSS animations on one node — the collision.
        const collisions = animNames
            .map((n, i) => ({ i, n }))
            .filter(({ n }) => n.includes(","));
        if (collisions.length === 0) {
            ok(
                `(e-runtime) cascade lint — every dot resolves a single ` +
                    `animation-name (${[...new Set(animNames)].join(
                        ", ",
                    )}); no node carries two stacked CSS animations`,
            );
        } else {
            fail(
                `(e-runtime) cascade lint — ${collisions.length} dot(s) resolve ` +
                    `MULTIPLE comma-separated animation-names (the two-shorthand ` +
                    `collision is back): ${collisions
                        .map((c) => `dot[${c.i}]="${c.n}"`)
                        .join(", ")}`,
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
        `\nproof:typing-dots — FAIL (${failures.length}): the hero blink is not ` +
            `the per-dot dogfooded indicator (a perceptual break / cascade ` +
            `collision survives).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:typing-dots — PASS: three staggered dots, left-to-right cadence, " +
        "never vanishing (min >= 0.15), a fixed <=1.6s cycle, no cascade " +
        "collision. H.W6 holds.",
);
