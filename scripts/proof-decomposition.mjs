#!/usr/bin/env node
/**
 * proof:decomposition — the D.W1 demo-decomposition gate.
 *
 * The demo is well-built but un-refined: five units crossed the size seam where
 * one concern stopped being one concern, the keyframe-string parse adapter was
 * copied into TWO files instead of shared, three already-pure utils sit in a
 * `composables/` dir that lies about their nature, and four in-component
 * timer/rAF blobs re-implement what vueuse already is. D.W1 decomposes the five
 * units, dedups the parse adapter to ONE pure module, re-homes the mis-filed
 * utils, and transposes the rAF/timeout blobs onto vueuse — net-deletion of
 * duplication, zero behaviour change.
 *
 * This is a re-runnable SOURCE instrument (greps + `wc`-equivalents) that BITES
 * on every regression. Each clause reds on the exact negative case it forbids —
 * verified, not asserted. Mirrors `proof:dogfood` / `proof:boundary`: exits 1
 * on any residual with a clear, per-clause message.
 *
 * CLAUSES (each BITES):
 *
 *   1. CEILINGS — every demo component/composable under the EXTENDED sweep
 *      (`animation-controls/**` + `demo/app/**` + `orbital-drag/**` + the named
 *      `EasingCurveCanvas.vue`) is ≤ its ceiling (350L `.vue`, 250L `.ts`),
 *      modulo a rationale-bearing per-file `CEILING_OVERRIDE` (E.W1 §S4, with a
 *      stale-entry guard). Re-adding a 400L component reddens it. The five
 *      D-flagged units (552/487/441/383/251) AND the two E.W1 seams
 *      (App.vue@452, useOrbitalPointer@376) must each drop under.
 *
 *   2. PARSE ADAPTER — exactly ONE definition of `parseAnimationCSS`: a single
 *      `export` in `keyframes/utils/`, and ZERO inline copies (the two W0
 *      bodies at `KeyframesStringControls.vue:55` `parseCSSAnimationKeyframes`
 *      and `useKeyframesEditor.ts:27` `parseAnimationCSS` are GONE; both call
 *      sites import the single definition). Re-inlining a second copy reds it.
 *
 *   3. PURE UTILS RE-HOMED — `timeline/composables/` holds NO module lacking a
 *      Vue import (`from "vue"`); the three pure utils (`timelineEngine.ts`,
 *      `snapshotCapture.ts`, `flattenVars.ts`) live under `timeline/utils/`,
 *      and every `timeline/utils/*.ts` is reactivity-free (no `ref(` / `watch(`
 *      / `onMounted(`). A `composables/` file with no `from "vue"` is a
 *      mis-file the gate catches.
 *
 *   4. rAF/TIMEOUT BLOBS GONE — zero `setTimeout` / `setInterval` /
 *      `requestAnimationFrame` in the four W0-flagged sites
 *      (`useTimeline.ts`, `KeyframesStringControls.vue`, `usePaneHover.ts`),
 *      AND zero across the whole `animation-controls/**` tree EXCEPT the
 *      explicit engine-loop allowlist (`AmigaScene.vue` is outside this tree;
 *      no allowlisted site lives under it — the tree must be raw-async-free).
 *      The demo's hand-rolled async primitives run on `useRafFn`/`useTimeoutFn`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTROLS = path.join(
    REPO,
    "demo/@/components/custom/animation-controls",
);

// E.W1 extended the ceiling sweep OUTSIDE the controls tree to the two seams the
// post-D assay found: the app entry shell (`demo/app/**`) and the orbital-drag
// input/transform seam (`orbital-drag/**`). Same ceilings, so the gate BITES
// there too — App.vue@452 + useOrbitalPointer@376 were red before E.W1's thin.
const APP = path.join(REPO, "demo/app");
const ORBITAL = path.join(
    REPO,
    "demo/@/components/custom/orbital-drag",
);
// EasingCurveCanvas is the named cohesive curve-editor (E.W1 §S4): swept as a
// single named file so its disposition (trimmed to ≤350, NOT split) BITES.
const EASING_CURVE_CANVAS = path.join(
    REPO,
    "demo/@/components/custom/EasingCurveCanvas.vue",
);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

// Line ceilings, by extension (D.W1's forcing function).
const CEILING = { ".vue": 350, ".ts": 250 };

// Per-file ceiling exceptions (E.W1 §S4 / §DD4). A unit appears here ONLY when
// it is ONE cohesive concern that the natural-seam rule (D.W1 §DD1) forbids
// splitting to shed a handful of lines — never to launder a real conflation.
// Each entry carries its line cap + the cohesion rationale, and the stale-entry
// guard below prunes any override whose file no longer exceeds the base ceiling
// (mirrors the ASYNC_ALLOWLIST stale guard). EMPTY today: EasingCurveCanvas was
// trimmed to ≤350 (the smaller honest move), so no override is owed.
const CEILING_OVERRIDE = new Map([
    // e.g. ["demo/.../Foo.vue", { cap: 360, why: "one cohesive X — splitting fragments the concern (D.W1 §DD1)" }]
]);

// Directories that never hold reviewable SOURCE.
const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);
const SOURCE_EXT = new Set([".vue", ".ts"]);

// The async tokens the gate counts. Word-boundaried so `cancelAnimationFrame`
// / `clearTimeout` and identifiers merely CONTAINING the substring do not
// over-fire — the bare scheduler CALL is what a hand-rolled blob reaches for.
const ASYNC = /\b(?:setTimeout|setInterval|requestAnimationFrame)\b/g;

// The four W0-flagged sites that MUST be transposed onto vueuse (repo-relative
// POSIX). The gate names them so the manifest is visible in its own output.
const W0_ASYNC_SITES = [
    "demo/@/components/custom/animation-controls/timeline/composables/useTimeline.ts",
    "demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue",
    "demo/@/components/custom/animation-controls/composables/usePaneHover.ts",
];

// The engine-loop allowlist: raw-rAF sites that are NOT animation/timer blobs a
// vueuse primitive replaces. `AmigaScene.vue` (the Three.js present loop) lives
// OUTSIDE the animation-controls tree, so no allowlisted path falls under the
// tree this gate sweeps — the tree must be raw-async-FREE. Kept as an explicit
// set so a future justified exception is a deliberate diff to THIS array.
const ASYNC_ALLOWLIST = new Set([
    // (none under animation-controls/** today — AmigaScene is in demo/app/scenes/)
]);

/** Walk a dir, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

const failures = [];

function main() {
    if (!fs.existsSync(CONTROLS)) {
        console.error(
            "proof:decomposition — ERROR: animation-controls/ tree not found at " +
                relPosix(CONTROLS),
        );
        process.exit(3);
    }

    // Clauses 2–4 are controls-specific (the parse adapter, the timeline utils,
    // the async blobs) — they sweep the controls tree only.
    const sources = collectSources(CONTROLS);
    sources.sort();

    // Clause 1 (ceilings) sweeps the EXTENDED set: controls + app + orbital +
    // the one named EasingCurveCanvas file (E.W1 §S5). Deduped + sorted.
    const ceilingSources = [
        ...new Set([
            ...sources,
            ...collectSources(APP),
            ...collectSources(ORBITAL),
            ...(fs.existsSync(EASING_CURVE_CANVAS) ? [EASING_CURVE_CANVAS] : []),
        ]),
    ].sort();

    console.log("proof:decomposition — D.W1 + E.W1 (the demo decomposed)");
    console.log(
        `  source files scanned: ${ceilingSources.length} across ` +
            `animation-controls/** + demo/app/** + orbital-drag/** ` +
            `(dist/ excluded)`,
    );

    // ── 1. CEILINGS ────────────────────────────────────────────────────
    // A per-file CEILING_OVERRIDE raises the cap for a NAMED cohesive unit; the
    // stale guard below reds any override whose file is now under the base
    // ceiling (a dead exception). Track which overrides actually bit.
    const overCeiling = [];
    const usedOverrides = new Set();
    for (const abs of ceilingSources) {
        const ext = path.extname(abs);
        const base = CEILING[ext];
        if (base == null) continue;
        const rel = relPosix(abs);
        const override = CEILING_OVERRIDE.get(rel);
        const ceiling = override ? override.cap : base;
        const lines = fs.readFileSync(abs, "utf8").split("\n").length;
        if (override && lines > base) usedOverrides.add(rel);
        if (lines > ceiling) {
            overCeiling.push({ rel, lines, ceiling, override });
        }
    }
    if (overCeiling.length > 0) {
        for (const o of overCeiling) {
            failures.push(
                `[ceiling] ${o.rel}: ${o.lines}L exceeds the ${o.ceiling}L ` +
                    `ceiling for ${path.extname(o.rel)} — split at its natural ` +
                    `concern seam into colocated sub-units (D.W1 §S1–S3 / E.W1 ` +
                    `§S1–S3), or (only for a genuinely cohesive unit) add a ` +
                    `rationale-bearing CEILING_OVERRIDE entry (E.W1 §S4).`,
            );
        }
    } else {
        console.log(
            `  ✓ [ceiling] all files ≤ ceiling (350L .vue / 250L .ts)` +
                (CEILING_OVERRIDE.size > 0
                    ? `; ${CEILING_OVERRIDE.size} named override(s)`
                    : ""),
        );
    }

    // Stale CEILING_OVERRIDE guard — an override whose file is now under the
    // base ceiling is dead and must be pruned (mirrors the ASYNC_ALLOWLIST
    // stale guard). Keeps the exception map from silently accruing slack.
    for (const [rel, meta] of CEILING_OVERRIDE) {
        if (!usedOverrides.has(rel)) {
            failures.push(
                `[ceiling] CEILING_OVERRIDE entry "${rel}" (cap ${meta.cap}, ` +
                    `"${meta.why}") matches no file over its base ceiling — it ` +
                    `is STALE; remove it.`,
            );
        }
    }

    // ── 2. PARSE ADAPTER — exactly ONE definition ──────────────────────
    {
        const utilsDir = path.join(CONTROLS, "keyframes/utils");
        // The ONE canonical definition: an `export … parseAnimationCSS` body in
        // keyframes/utils/. Count the export DECLARATIONS (not call-site imports).
        const EXPORT_DEF =
            /\bexport\s+(?:const|function|async\s+function)\s+parseAnimationCSS\b/g;
        let canonicalDefs = 0;
        if (fs.existsSync(utilsDir)) {
            for (const abs of collectSources(utilsDir)) {
                const src = fs.readFileSync(abs, "utf8");
                canonicalDefs += (src.match(EXPORT_DEF) || []).length;
            }
        }

        // The two inline copies that MUST be gone. A "definition" here is a
        // local body assignment (`const NAME = (`) — distinct from an imported
        // call. We grep the two W0 files for either inline-adapter name.
        const INLINE_DEF =
            /\b(?:const|let|var|function)\s+(?:parseAnimationCSS|parseCSSAnimationKeyframes)\s*[=(]/g;
        const inlineCopies = [];
        for (const relFile of [
            "keyframes/KeyframesStringControls.vue",
            "keyframes/composables/useKeyframesEditor.ts",
        ]) {
            const abs = path.join(CONTROLS, relFile);
            if (!fs.existsSync(abs)) continue;
            const src = fs.readFileSync(abs, "utf8");
            const m = src.match(INLINE_DEF);
            if (m) {
                inlineCopies.push({
                    rel: relPosix(abs),
                    count: m.length,
                });
            }
        }
        // A sweep-wide guard: ANY OTHER inline-adapter body across the tree (a
        // future re-inline at a third site) also reds the gate.
        for (const abs of sources) {
            const rel = relPosix(abs);
            if (
                rel.endsWith("keyframes/KeyframesStringControls.vue") ||
                rel.endsWith("keyframes/composables/useKeyframesEditor.ts") ||
                toPosix(abs).includes("keyframes/utils/")
            ) {
                continue; // already accounted for above / the canonical home
            }
            const m = fs.readFileSync(abs, "utf8").match(INLINE_DEF);
            if (m) inlineCopies.push({ rel, count: m.length });
        }

        if (canonicalDefs !== 1) {
            failures.push(
                `[parse-adapter] expected EXACTLY ONE \`export … ` +
                    `parseAnimationCSS\` in keyframes/utils/, found ` +
                    `${canonicalDefs}. The deduped adapter is ONE pure module ` +
                    `(keyframes/utils/parseAnimationCSS.ts) both call sites import.`,
            );
        }
        if (inlineCopies.length > 0) {
            for (const c of inlineCopies) {
                failures.push(
                    `[parse-adapter] ${c.rel}: ${c.count} inline parse-adapter ` +
                        `body (parseAnimationCSS / parseCSSAnimationKeyframes) — ` +
                        `the duplicate is GONE; import the ONE keyframes/utils/ ` +
                        `definition instead.`,
                );
            }
        }
        if (canonicalDefs === 1 && inlineCopies.length === 0) {
            console.log(
                `  ✓ [parse-adapter] exactly ONE parseAnimationCSS export ` +
                    `(keyframes/utils/); zero inline copies`,
            );
        }
    }

    // ── 3. PURE UTILS RE-HOMED ─────────────────────────────────────────
    {
        const composablesDirs = [];
        const utilsTimeline = path.join(CONTROLS, "timeline/utils");
        // Every `timeline/composables/*.ts` must import vue (be a real
        // composable). A pure module there is a mis-file.
        const composablesTimeline = path.join(CONTROLS, "timeline/composables");
        const VUE_IMPORT = /\bfrom\s+["']vue["']/;
        const REACTIVITY = /\b(?:ref|reactive|computed|watch|watchEffect|onMounted|onUnmounted|onScopeDispose)\s*\(/;

        // 3a — no pure module mis-filed under timeline/composables/
        if (fs.existsSync(composablesTimeline)) {
            for (const abs of collectSources(composablesTimeline)) {
                if (path.extname(abs) !== ".ts") continue;
                const base = path.basename(abs);
                // types-only modules carry no reactivity AND no vue import by
                // design — they are not composables and not "pure functions"
                // either; exclude the *Types.ts convention.
                if (/Types\.ts$/.test(base)) continue;
                const src = fs.readFileSync(abs, "utf8");
                if (!VUE_IMPORT.test(src)) {
                    failures.push(
                        `[pure-utils] ${relPosix(abs)} sits under ` +
                            `timeline/composables/ but imports no \`from "vue"\` ` +
                            `— a pure function mis-filed as a composable. Move it ` +
                            `to timeline/utils/ (D.W1 §S3).`,
                    );
                }
            }
        }

        // 3b — the three named pure utils must NOT survive under composables/
        for (const name of [
            "timelineEngine.ts",
            "snapshotCapture.ts",
            "flattenVars.ts",
        ]) {
            const stale = path.join(composablesTimeline, name);
            if (fs.existsSync(stale)) {
                failures.push(
                    `[pure-utils] ${relPosix(stale)} still exists under ` +
                        `timeline/composables/ — re-home it to timeline/utils/ ` +
                        `(D.W1 §S3).`,
                );
            }
        }

        // 3c — every timeline/utils/*.ts must be reactivity-free
        if (fs.existsSync(utilsTimeline)) {
            for (const abs of collectSources(utilsTimeline)) {
                if (path.extname(abs) !== ".ts") continue;
                const src = fs.readFileSync(abs, "utf8");
                if (REACTIVITY.test(src)) {
                    const m = src.match(REACTIVITY);
                    failures.push(
                        `[pure-utils] ${relPosix(abs)} lives under ` +
                            `timeline/utils/ but uses reactivity (\`${m[0]}\`) — ` +
                            `utils/ is for PURE functions; a reactive module ` +
                            `belongs in composables/.`,
                    );
                }
            }
            composablesDirs.push(utilsTimeline);
        } else {
            failures.push(
                `[pure-utils] timeline/utils/ does not exist — the three pure ` +
                    `modules (timelineEngine/snapshotCapture/flattenVars) have ` +
                    `not been re-homed there (D.W1 §S3).`,
            );
        }

        if (
            !failures.some((f) => f.startsWith("[pure-utils]")) &&
            composablesDirs.length > 0
        ) {
            console.log(
                `  ✓ [pure-utils] timeline/composables/ holds no pure module; ` +
                    `timeline/utils/ is reactivity-free`,
            );
        }
    }

    // ── 4. rAF/TIMEOUT BLOBS GONE ──────────────────────────────────────
    {
        // Strip comments first — the clause matches CALLS, not a prose mention
        // (e.g. a docstring naming the engine's `scheduler.yield→…→setTimeout`
        // fallback ladder is not a hand-rolled timer).
        const stripComments = (s) =>
            s
                .replace(/\/\*[\s\S]*?\*\//g, " ")
                .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
        const hits = [];
        for (const abs of sources) {
            const rel = relPosix(abs);
            const m = stripComments(fs.readFileSync(abs, "utf8")).match(ASYNC);
            if (m) hits.push({ rel, count: m.length });
        }
        const residual = hits.filter((h) => !ASYNC_ALLOWLIST.has(h.rel));

        // The four named W0 sites get a precise message; the rest are caught
        // by the same tree-wide sweep.
        const named = new Set(W0_ASYNC_SITES);
        for (const h of residual) {
            const isNamed = named.has(h.rel);
            failures.push(
                `[async-blob] ${h.rel}: ${h.count} raw ` +
                    `setTimeout/setInterval/requestAnimationFrame call(s)` +
                    (isNamed ? " (a W0-flagged site)" : "") +
                    ` — transpose onto vueuse (\`useTimeoutFn\` / \`useRafFn\` / ` +
                    `\`nextFrame\`) for auto-cleanup, or add a justified entry to ` +
                    `the proof:decomposition ASYNC_ALLOWLIST with a rationale.`,
            );
        }

        // Stale-allowlist guard: an allowlist entry pointing at a file with no
        // raw async is dead and must be pruned.
        const hitPaths = new Set(hits.map((h) => h.rel));
        for (const a of ASYNC_ALLOWLIST) {
            if (!hitPaths.has(a)) {
                failures.push(
                    `[async-blob] ASYNC_ALLOWLIST entry "${a}" matches no raw ` +
                        `async site — it is STALE; remove it.`,
                );
            }
        }

        if (residual.length === 0 && ASYNC_ALLOWLIST.size === 0) {
            console.log(
                `  ✓ [async-blob] zero raw setTimeout/setInterval/` +
                    `requestAnimationFrame under animation-controls/**`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:decomposition — FAIL (D.W1 — the demo is not yet decomposed):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The demo decomposes at the natural concern seam, dedups the parse\n" +
                "  adapter to ONE pure utils/ module, re-homes the pure timeline utils\n" +
                "  out of composables/, and transposes the rAF/timeout blobs onto vueuse.\n" +
                "  Each clause above reds on the exact regression it forbids.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:decomposition — PASS: every unit is under its ceiling, the parse\n" +
            "adapter has ONE definition, the pure utils are re-homed, and no raw\n" +
            "async blob survives. D.W1 holds.",
    );
}

main();
