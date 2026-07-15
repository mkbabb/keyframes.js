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
 *   1. LIBRARY CEILING — every `src/animation/**` module is ≤ the HARD base
 *      ceiling (350L `.vue`, 500L `.ts`). S.B5 RETIRED the per-file cap-raising
 *      `LIBRARY_CEILING_OVERRIDE` mechanism (the R.W0 keystone, completed): the
 *      last data-volume holdout (`presets/classic.ts`) was split into
 *      factories + `classic-data.ts`, emptying the Map. The Map survives ONLY as
 *      an empty-by-construction tripwire — any entry re-added is a self-raising
 *      cap (a hard RED, T2). A NEW oversized library file reds it; the cure is a
 *      cohesion carve, never a raised ceiling (the reds ARE the backlog).
 *
 *      H.W8 RECONCILIATION (drift-red a): the DEMO file-size half of this clause
 *      is RETIRED here — it duplicated, and CONTRADICTED, the H.W12-authored
 *      `proof:style-file-ceiling`, which owns the surviving demo style-size limits
 *      (≤500L, the H.W12-MEASURED reality). The D-era 350L `.vue` ceiling this
 *      clause once swept across the demo was a stale lower number: the H tranche
 *      legitimately grew the controls SFCs via real enrichment —
 *      ControlsPaneWrapper.vue 249→491L (H.W7 mobile bottom-sheet drawer + F9
 *      idle-fade), AnimationControlsGroup.vue 335→488L (H.W7 mobile overlay +
 *      H.W9/W10 scene normalization + icons), EasingCurveCanvas.vue 351→373L
 *      (H.W4 canvas-ceiling clamp + container context), AnimationControls.vue
 *      254→367L and AnimationControlsControls.vue 330→364L (H.W11 control-surface
 *      DFA + stage glass-card + uniform labels). Each is ONE cohesive SFC (a
 *      single template/script/style triple; the two largest are dominated by
 *      scoped-CSS that cannot be externalized without breaking the `scoped`
 *      contract) — splitting to shed lines fragments the concern (the legacy
 *      shape the §Mandate forbids). Two demo gates asserting two different
 *      ceilings (350 vs 500) on the SAME files is the DRY contradiction; the
 *      reconciliation collapses demo file-size onto the H.W12 measured 500L in
 *      proof:style-file-ceiling, and this gate KEEPS only the library ceiling
 *      (the style-focused proof:style-file-ceiling does NOT cover — its sweep
 *      root is `demo/`, never `src/`). The demo STRUCTURAL concerns below
 *      (clauses 2–10) still sweep the demo and BITE — only the raw line-count
 *      ceiling moved authority.
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
// S.D2 (T7 walker-root arming-audit, P2-1 F5): `animation-controls/` was carved
// into three sibling `@/` peers — `instrument/transport/` (the shells + controls/
// + composables/), `instrument/keyframes/` (the Monaco editor), `instrument/timeline/`
// (the draggable timeline). The structural sweep now roots at ALL THREE so the
// peer-moved files are NOT silently dropped from the walk (the false-green
// blindspot a peer move risks). The former `keyframes/` and `timeline/` subtrees
// are now the KEYFRAMES_EDITOR / KEYFRAME_TIMELINE peers (clauses 2/3 below).
const TRANSPORT = path.join(REPO, "demo/components/instrument/transport");
const KEYFRAMES_EDITOR = path.join(REPO, "demo/components/instrument/keyframes");
const KEYFRAME_TIMELINE = path.join(REPO, "demo/components/instrument/timeline");
const CONTROLS_ROOTS = [TRANSPORT, KEYFRAMES_EDITOR, KEYFRAME_TIMELINE];

// H.W8 RECONCILIATION (drift-red a) — the DEMO ceiling sweep is RETIRED. The
// D.W1/E.W1 demo line-count ceiling (350L `.vue` across `animation-controls/**`
// + `demo/app/**` + `orbital-drag/**` + the named EasingCurveCanvas.vue) was a
// duplicate, contradictory authority: proof:style-file-ceiling is the
// SINGLE demo file-size gate (≤500L, the H.W12-MEASURED reality), and the H
// tranche legitimately grew the controls SFCs past the stale 350 (see the
// header docstring clause 1 for the 5 files + their growth drivers). Two demo
// gates at two ceilings (350 vs 500) on the SAME files is the DRY contradiction;
// surviving demo style-size limits now live in proof:style-file-ceiling. The demo STRUCTURAL
// clauses below (2–10) still sweep the demo — only the raw line ceiling moved.

// G.W5 — the LIBRARY surface (`src/animation/**`). The chronic the F.md ceiling
// DECISION named (re-deferred to G as the one purely-kf gated call,
// a-deferred-ledger C-6): the library grew UN-ceilinged because the gate swept
// the demo only. G extends the SWEEP here (path A) at a library `.ts` cap
// (LIBRARY_CEILING) distinct from the demo's 250L — the interpolation engines
// are legitimately larger cohesive units (a-backend-godmodules G-GM-1..7). The
// over-cap modules carry RECORDED gated exceptions (LIBRARY_CEILING_OVERRIDE),
// each with its cohesion / god-LIST rationale + the self-pruning stale guard, so
// the §Mandate-correct "cohesive but over the line → a recorded exception, NOT a
// split" holds and a future un-cohesive sprawl reds.
const LIBRARY = path.join(REPO, "src/animation");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

// (H.W8: the D.W1 demo CEILING / CEILING_OVERRIDE constants were removed with
// the demo style ceiling sweep — style size is owned by proof:style-file-ceiling.)

// R.W0 KEYSTONE (the gate-truth reset). The `LIBRARY_CEILING_OVERRIDE` allowlist
// was DELETED: every per-file cap had been set +1..+71 above the file it measured
// (engine.ts cap=1450 for a 1420L file, group.ts cap=925 for 924L) — a
// self-certifying gate that cannot bite, with a prose essay arguing each
// god-module was a "cohesive gestalt." The R retros converge on ONE hard library
// ceiling (500L `.ts`, 350L `.vue`): the resulting reds on every oversized file
// ARE the decomposition backlog R.W1/R.W2 discharge — measured by the gate, not by
// prose. (500L is the measured already-SOTA leaf floor: spring-duration 83L,
// group-soa 254L, waapi-densify 287L all pass; the four genuine god-classes
// — engine/group/waapi/resolve — RED until carved.) The override map AND its
// stale-entry guard loop are gone (R.W0 §2c; R.md §5; challenge-library §7).
//
// presets/classic.ts data-volume note (S.B5 — RESOLVED): the last holdout was
// ~728L of raw preset CSS strings (54% string data). Rather than a taxonomy
// 3-way split of the strings (a forced data-partition with no cohesion benefit —
// the contrivance R.md §7 / challenge-library §4b forbid), S.B5 split the DATA
// off the FACTORIES: `classic.ts` now holds the 34 factory functions and
// `classic-data.ts` the 34 keyframe strings — BOTH clear the base ceiling with
// NO override. That is the honest disposition, and it makes the override map
// EMPTY (the terminal removal below).
const LIBRARY_CEILING = { ".vue": 350, ".ts": 500 };

// S.B5 — the R.W0 keystone COMPLETED (a20 F5; fold rows 32/33). The per-file
// cap-raising `LIBRARY_CEILING_OVERRIDE` mechanism is RETIRED: no documented
// data-volume exception remains (the last one, `presets/classic.ts`, was split —
// see the note above). The Map is kept ONLY as an empty-by-construction tripwire:
// the ceiling loop below NO LONGER reads a per-file cap from it (every library
// file is measured against the hard base ceiling), and the guard clause REDs on
// ANY entry — re-adding a self-raising cap (the exact anti-pattern R.W0 deleted)
// is a hard RED (T2), not a silent mask. There is no mechanism to raise a file's
// ceiling; the reds ARE the carve backlog.
const LIBRARY_CEILING_OVERRIDE = new Map();

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
    "demo/components/instrument/timeline/composables/useTimeline.ts",
    "demo/components/instrument/keyframes/KeyframesStringControls.vue",
    "demo/components/instrument/transport/composables/usePaneHover.ts",
];

// The engine-loop allowlist: raw-rAF sites that are NOT animation/timer blobs a
// vueuse primitive replaces. `AmigaScene.vue` (the Three.js present loop) lives
// OUTSIDE the animation-controls tree, so no allowlisted path falls under the
// tree this gate sweeps — the tree must be raw-async-FREE. Kept as an explicit
// set so a future justified exception is a deliberate diff to THIS array.
const ASYNC_ALLOWLIST = new Set([
    // (none under the three carved peers today — AmigaScene is in demo/scenes/amiga/)
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
    for (const root of CONTROLS_ROOTS) {
        if (!fs.existsSync(root)) {
            console.error(
                "proof:decomposition — ERROR: control-suite peer not found at " +
                    relPosix(root) +
                    " (the S.D2 animation-transport/instrument/keyframes/keyframe-timeline carve)",
            );
            process.exit(3);
        }
    }

    // Clauses 2–4 are control-suite-specific (the parse adapter, the timeline
    // utils, the async blobs) — they sweep the three carved peers only.
    const sources = [];
    for (const root of CONTROLS_ROOTS) collectSources(root, sources);
    sources.sort();

    // Clause 1 (ceilings) sweeps the LIBRARY surface ONLY (`src/animation/**`,
    // G.W5), swept at LIBRARY_CEILING / LIBRARY_CEILING_OVERRIDE. H.W8 RETIRED
    // the demo half of this clause (the controls + app + orbital + named
    // EasingCurveCanvas sweep): demo style size is owned by proof:style-file-ceiling
    // (H.W12, ≤500L MEASURED) — two demo gates at 350 vs 500 was the DRY
    // contradiction. The demo STRUCTURAL clauses (2–10) still sweep `sources`.
    const librarySources = collectSources(LIBRARY);
    const ceilingSources = librarySources.slice().sort();

    console.log("proof:decomposition — D.W1 + E.W1 + G.W5 (library ceiling + demo structure)");
    console.log(
        `  source files scanned: ${ceilingSources.length} library file(s) for ` +
            `the ceiling (src/animation/**); the demo structural clauses sweep ` +
            `the animation-transport/instrument/keyframes/keyframe-timeline peers + demo/** (demo style-size → proof:style-file-ceiling)`,
    );

    // ── 1. LIBRARY CEILING ─────────────────────────────────────────────
    // The single hard ceiling (R.W0 keystone): 500L `.ts` / 350L `.vue`. The
    // per-file self-raising override allowlist + its stale-entry guard were
    // DELETED — only the ONE documented data-volume exception
    // (`presets/classic.ts`) remains. The reds on every oversized library file
    // ARE the R.W1/R.W2 decomposition backlog (measured by the gate, not prose).
    // S.B5 — the empty-by-construction override guard (the R.W0 keystone's
    // terminal falsifiability). The cap-raising mechanism is retired: the loop
    // below measures EVERY library file against the hard base ceiling. Any entry
    // re-added to `LIBRARY_CEILING_OVERRIDE` is a self-raising cap (the anti-
    // pattern the keystone deleted) and REDs here — a cap raised vs the prior
    // tranche is a hard RED (T2), never a silent mask.
    if (LIBRARY_CEILING_OVERRIDE.size > 0) {
        failures.push(
            `[ceiling] LIBRARY_CEILING_OVERRIDE carries ` +
                `${LIBRARY_CEILING_OVERRIDE.size} entry(ies) — the per-file ` +
                `cap-raising override is RETIRED (the R.W0 keystone, completed at ` +
                `S.B5). Every library file is measured against the hard base ceiling ` +
                `(350L .vue / 500L .ts); carve at the cohesion seam, do NOT raise the ` +
                `cap. Entries: ${[...LIBRARY_CEILING_OVERRIDE.keys()].join(", ")}.`,
        );
    }

    const overCeiling = [];
    for (const abs of ceilingSources) {
        const ext = path.extname(abs);
        const rel = relPosix(abs);
        const base = LIBRARY_CEILING[ext];
        if (base == null) continue;
        const lines = fs.readFileSync(abs, "utf8").split("\n").length;
        if (lines > base) {
            overCeiling.push({ rel, lines, ceiling: base });
        }
    }
    if (overCeiling.length > 0) {
        for (const o of overCeiling) {
            failures.push(
                `[ceiling] ${o.rel}: ${o.lines}L exceeds the ${o.ceiling}L ` +
                    `library ceiling for ${path.extname(o.rel)} — split at its ` +
                    `natural concern seam (the R.W1/R.W2/S.B5 carve backlog). The ` +
                    `per-file cap-raising override was RETIRED at S.B5 (the R.W0 ` +
                    `keystone): there is no exception to raise, only the carve.`,
            );
        }
    } else {
        console.log(
            `  ✓ [ceiling] all library files ≤ ceiling (350L .vue / 500L .ts); ` +
                `no LIBRARY_CEILING_OVERRIDE (the R.W0 keystone completed at S.B5)`,
        );
    }

    // ── 2. PARSE ADAPTER — exactly ONE definition ──────────────────────
    {
        const utilsDir = path.join(KEYFRAMES_EDITOR, "utils");
        // The ONE canonical definition: an `export … parseAnimationCSS` body in
        // keyframes-editor/utils/. Count the export DECLARATIONS (not call-site imports).
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
            "KeyframesStringControls.vue",
            "composables/useKeyframesEditor.ts",
        ]) {
            const abs = path.join(KEYFRAMES_EDITOR, relFile);
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
                rel.endsWith("instrument/keyframes/KeyframesStringControls.vue") ||
                rel.endsWith("instrument/keyframes/composables/useKeyframesEditor.ts") ||
                toPosix(abs).includes("instrument/keyframes/utils/")
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
        const utilsTimeline = path.join(KEYFRAME_TIMELINE, "utils");
        // Every `instrument/timeline/composables/*.ts` must import vue (be a real
        // composable). A pure module there is a mis-file.
        const composablesTimeline = path.join(KEYFRAME_TIMELINE, "composables");
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
                    `requestAnimationFrame under the carved control-suite peers`,
            );
        }
    }

    // ── 5–7. G.W7 — Vue-idiom convergence (proof:demo-template-refs family) ──
    // Three presence-grep SHAPE-locks folded into this family (KISS/DRY —
    // G.W7 §DD3): the demo migrated broadly to `useTemplateRef` (Vue 3.5) and
    // colocates pure modules by file kind; these clauses lock the convergence so
    // the legacy shapes red on re-introduction. The whole `demo/**` tree is the
    // sweep (the encapsulation concern is demo-wide, not controls-local).
    {
        const DEMO = path.join(REPO, "demo");
        const demoSources = collectSources(DEMO).sort();

        // The lexical comment-blanker: strip block + line + HTML comments while
        // preserving newlines (so a `ref="x"` inside a comment, or a docstring
        // naming a legacy pattern, never reds the gate — only real code does).
        const blankComments = (s) => {
            let out = "";
            let i = 0;
            const n = s.length;
            while (i < n) {
                if (s[i] === "/" && s[i + 1] === "*") {
                    const end = s.indexOf("*/", i + 2);
                    const stop = end === -1 ? n : end + 2;
                    for (let j = i; j < stop; j++)
                        out += s[j] === "\n" ? "\n" : " ";
                    i = stop;
                    continue;
                }
                if (s[i] === "/" && s[i + 1] === "/") {
                    let j = i;
                    while (j < n && s[j] !== "\n") {
                        out += " ";
                        j++;
                    }
                    i = j;
                    continue;
                }
                if (s.startsWith("<!--", i)) {
                    const end = s.indexOf("-->", i + 4);
                    const stop = end === -1 ? n : end + 3;
                    for (let j = i; j < stop; j++)
                        out += s[j] === "\n" ? "\n" : " ";
                    i = stop;
                    continue;
                }
                out += s[i];
                i++;
            }
            return out;
        };

        // ── 5. proof:demo-template-refs — zero LEGACY template-ref shape ────
        // The legacy shape is a `ref<(HTML|SVG|InstanceType)…>(null|undefined|)`
        // declaration WHOSE NAME is bound via a `ref="name"` attribute in the
        // SAME SFC's template. The clause keys on the BINDING (G.W7 §DD2): a
        // data ref manually populated (`Animated.vue:16` `ref<HTMLElement[]>([])`,
        // `cubeElRef` assigned via `.value =`, `tabsListElRef` populated in a
        // callback) is NOT a `ref="…"` target and PASSES — only a template-bound
        // legacy ref reds. Only `.vue` SFCs carry a template, so the sweep is
        // SFC-only.
        {
            const LEGACY_REF =
                /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*ref\s*<\s*(?:HTML|SVG|InstanceType)/;
            const offenders = [];
            for (const abs of demoSources) {
                if (path.extname(abs) !== ".vue") continue;
                const src = blankComments(read(abs));
                const lines = src.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    const m = lines[i].match(LEGACY_REF);
                    if (!m) continue;
                    const name = m[1];
                    // Template-bound iff `ref="name"` appears somewhere in the
                    // SAME file (the template attribute keys the binding).
                    const boundRe = new RegExp(`\\bref="${name}"`);
                    if (boundRe.test(src)) {
                        offenders.push({
                            rel: relPosix(abs),
                            line: i + 1,
                            name,
                            text: lines[i].trim(),
                        });
                    }
                }
            }
            if (offenders.length > 0) {
                failures.push(
                    `[template-refs] ${offenders.length} legacy ` +
                        `\`ref<(HTML|SVG|InstanceType)…>()\` declaration(s) bound ` +
                        `via a \`ref="…"\` attribute — converge to the demo's ` +
                        `\`useTemplateRef<…>("name")\` idiom (Vue 3.5; G.W7 §S1). ` +
                        `Data refs (not a ref="…" target) pass. Sites:\n      ` +
                        offenders
                            .map((o) => `${o.rel}:${o.line}  ${o.name}`)
                            .join("\n      "),
                );
            } else {
                console.log(
                    `  ✓ [template-refs] zero legacy ref<…>() template refs; ` +
                        `every template ref rides useTemplateRef`,
                );
            }
        }

        // ── 6. pure-use* detector — no composable-named pure module ─────────
        // A `use*` name is the Vue convention for a COMPOSABLE (a function
        // consuming the reactivity/lifecycle API). A `use*.ts` filed under a
        // `utils/` directory is the precise name/location contradiction G.W7
        // §State 5 names: the LOCATION (utils/ — for plain-noun pure modules) is
        // right, the NAME (use*) lies. Genuine composables live under
        // `composables/` (or as named scene composables at a scene root); only a
        // pure predicate mis-wears the use* prefix in utils/. BITE: today on
        // `@/utils/useToastGuard.ts` (a pure predicate); green after the
        // `toastGuard.ts` rename.
        {
            const offenders = [];
            for (const abs of demoSources) {
                if (path.extname(abs) !== ".ts") continue;
                const rel = relPosix(abs);
                const base = path.basename(abs);
                if (!/^use[A-Z]/.test(base)) continue;
                // A use*-named module filed under a utils/ dir is the lie.
                if (/(?:^|\/)utils\//.test(rel)) {
                    offenders.push({ rel });
                }
            }
            if (offenders.length > 0) {
                failures.push(
                    `[pure-use*] ${offenders.length} \`use*\`-named module(s) ` +
                        `filed under a utils/ dir — the use* prefix signals a ` +
                        `composable (reactivity/lifecycle); a pure module in ` +
                        `utils/ takes a plain-noun name (G.W7 §S2). Rename:\n      ` +
                        offenders.map((o) => o.rel).join("\n      "),
                );
            } else {
                console.log(
                    `  ✓ [pure-use*] no use*-named pure module under utils/`,
                );
            }
        }

        // ── 7. types/util module under composables/ ────────────────────────
        // A `composables/` dir is for genuine composables. A `*Types.ts`
        // (types-only convention) or a `*Utils.ts` (pure-function convention)
        // filed there breaks the demo's OWN file-kind rule (types → `*Types.ts`
        // at the surface root, pure fns → `utils/`; G.W7 §State 6). Keyed on the
        // demo's naming idiom so it bites exactly the two mis-filed modules
        // (`timelineTypes.ts` + `timingCurveUtils.ts`) without firing on legit
        // colocated `use*` helpers. BITE: today on both; green after the re-home.
        {
            const offenders = [];
            for (const abs of demoSources) {
                if (path.extname(abs) !== ".ts") continue;
                const rel = relPosix(abs);
                if (!/(?:^|\/)composables\//.test(rel)) continue;
                const base = path.basename(abs);
                if (/Types\.ts$/.test(base) || /Utils\.ts$/.test(base)) {
                    offenders.push({ rel, base });
                }
            }
            if (offenders.length > 0) {
                failures.push(
                    `[composables-kind] ${offenders.length} pure module(s) ` +
                        `(\`*Types.ts\` / \`*Utils.ts\`) filed under composables/ ` +
                        `— composables/ is for genuine composables; re-home types ` +
                        `to a \`*Types.ts\` at the surface root and pure utils to ` +
                        `utils/ (G.W7 §S3). Re-home:\n      ` +
                        offenders.map((o) => o.rel).join("\n      "),
                );
            } else {
                console.log(
                    `  ✓ [composables-kind] no *Types.ts / *Utils.ts under ` +
                        `composables/`,
                );
            }
        }

        // ── 8. proof:no-dead-export — useShareState has no dead return member ─
        // G.W8 §S2: `useShareState`'s public return must carry no unconsumed
        // member. The clause extracts the names in the composable's `return { … }`
        // shape and asserts each is referenced by a CONSUMER (a `.vue`/`.ts` that
        // is not the producer). BITE: today on `stateVersion` (returned but
        // consumed nowhere); green after the deletion. Re-adding a dead returned
        // member reds.
        {
            const producerRel =
                "demo/components/instrument/shell/useShareState.ts";
            const producerAbs = path.join(REPO, producerRel);
            if (fs.existsSync(producerAbs)) {
                const src = blankComments(read(producerAbs));
                // Grab the LAST `return { … }` body in the file (the composable's
                // public shape) and split its shorthand member names.
                const returns = [
                    ...src.matchAll(/return\s*\{([^}]*)\}/g),
                ];
                const lastReturn = returns[returns.length - 1];
                const members = lastReturn
                    ? lastReturn[1]
                          .split(",")
                          .map((s) => s.trim().split(":")[0].trim())
                          .filter((s) => /^[A-Za-z_$][\w$]*$/.test(s))
                    : [];

                // Consumer corpus: all demo source EXCEPT the producer itself.
                const consumerText = demoSources
                    .filter((abs) => relPosix(abs) !== producerRel)
                    .map((abs) => blankComments(read(abs)))
                    .join("\n");

                const dead = members.filter(
                    (m) => !new RegExp(`\\b${m}\\b`).test(consumerText),
                );
                if (dead.length > 0) {
                    failures.push(
                        `[no-dead-export] useShareState returns ` +
                            `${dead.length} member(s) with zero consumer across ` +
                            `demo/** — a dead exported member is a maintenance ` +
                            `lie; delete it (G.W8 §S2). Dead: ${dead.join(", ")}`,
                    );
                } else {
                    console.log(
                        `  ✓ [no-dead-export] every useShareState return member ` +
                            `(${members.length}) is consumed`,
                    );
                }
            }
        }

        // ── 9. proof:dock-module-honest — G.W12 narrowed for OD-U19 ──────────
        // The old pass-through barrel re-exporting glass-ui primitives stays
        // forbidden. The component module's own-member barrel is required.
        // The dock SFC is RENAMED TopDock→ChromeDock
        // (the name reads true), and the dock primitives are imported DIRECTLY
        // from @mkbabb/glass-ui/dock (no nested-import barrel).
        //   BITE: today — the barrel exists, TopDock.vue imports from ".", no
        //         ChromeDock; green after S1.
        {
            // S.D2 — the dock is APP-private (a24 F3): evicted from
            // app/dock/ → demo/app/dock/ (an app concern sub-zone).
            const dockBarrel = "demo/app/dock/index.ts";
            const dockBarrelAbs = path.join(REPO, dockBarrel);
            const chromeDockRel = "demo/app/dock/ChromeDock.vue";
            const chromeDockAbs = path.join(REPO, chromeDockRel);
            const topDockAbs = path.join(
                REPO,
                "demo/app/dock/TopDock.vue",
            );

            const dockFails = [];

            // 9a — an own-member barrel exists and never re-exports glass-ui.
            if (!fs.existsSync(dockBarrelAbs)) {
                dockFails.push(`${dockBarrel} is absent — the dock module requires its own surface.`);
            } else {
                const barrelSrc = blankComments(read(dockBarrelAbs));
                if (!/ChromeDock/.test(barrelSrc) || !/MbabbMenu/.test(barrelSrc)) {
                    dockFails.push(
                        `${dockBarrel} must export its ChromeDock and MbabbMenu members.`,
                    );
                }
                if (/@mkbabb\/glass-ui/.test(barrelSrc))
                    dockFails.push(`${dockBarrel} re-exports glass-ui — pass-through exports stay forbidden.`);
            }

            // 9b — ChromeDock.vue exists; TopDock.vue does not.
            if (!fs.existsSync(chromeDockAbs)) {
                dockFails.push(
                    `${chromeDockRel} does not exist — the dock SFC is RENAMED ` +
                        `TopDock→ChromeDock (G.W12.S1).`,
                );
            }
            if (fs.existsSync(topDockAbs)) {
                dockFails.push(
                    `demo/app/dock/TopDock.vue still exists — the ` +
                        `rename to ChromeDock.vue leaves no TopDock.vue beside it.`,
                );
            }

            // 9c — NO TopDock identifier survives in demo source (comment-blanked).
            const topDockRefs = [];
            for (const abs of demoSources) {
                const src = blankComments(read(abs));
                if (/\bTopDock\b/.test(src))
                    topDockRefs.push(relPosix(abs));
            }
            if (topDockRefs.length > 0) {
                dockFails.push(
                    `${topDockRefs.length} TopDock identifier(s) survive in demo ` +
                        `source (comment-blanked) — the removed name is removed ` +
                        `everywhere:\n      ` + topDockRefs.join("\n      "),
                );
            }

            // 9d — ChromeDock imports the dock primitives DIRECTLY from
            //      @mkbabb/glass-ui/dock, not a local barrel (no `from "."`).
            if (fs.existsSync(chromeDockAbs)) {
                const src = blankComments(read(chromeDockAbs));
                const importsFromGlassDock =
                    /import\s*\{[^}]*\bGlassDock\b[^}]*\}\s*from\s*["']@mkbabb\/glass-ui\/dock["']/.test(
                        src,
                    );
                const importsFromLocalBarrel =
                    /import\s*\{[^}]*\}\s*from\s*["']\.["']/.test(src);
                if (!importsFromGlassDock) {
                    dockFails.push(
                        `${chromeDockRel}: GlassDock must be imported DIRECTLY ` +
                            `from "@mkbabb/glass-ui/dock" (joining the other dock ` +
                            `primitives), not via a local barrel (G.W12.S1).`,
                    );
                }
                if (importsFromLocalBarrel) {
                    dockFails.push(
                        `${chromeDockRel}: a \`from "."\` local-barrel import ` +
                            `survives — the nested-import barrel is removed.`,
                    );
                }
            }

            if (dockFails.length === 0) {
                console.log(
                    `  ✓ [dock-module-honest] own-member dock barrel present ` +
                        `(no glass-ui pass-through); ChromeDock.vue present (no TopDock); dock ` +
                        `primitives imported directly from @mkbabb/glass-ui/dock`,
                );
            } else {
                for (const f of dockFails)
                    failures.push(`[dock-module-honest] ${f}`);
            }
        }

        // ── 10. proof:no-reka-reach — G.W12.S4 (the one headless reach KILLED) ─
        // Exactly ZERO direct `from "reka-ui"` import in the DEMO-AUTHORED surface
        // (excluding the vendored shadcn-vue `demo/components/ui/` basis, which
        // legitimately wraps reka). The one demo reach — AnimationMenuBar's raw
        // SelectIcon — is replaced by the glass-ui surface (DockSelectTrigger owns
        // the trigger/chevron).
        //   BITE: today on AnimationMenuBar.vue's `import { SelectIcon } from
        //         "reka-ui"`; green after S4. A new reka reach reds.
        {
            const rekaReaches = [];
            for (const abs of demoSources) {
                const rel = relPosix(abs);
                if (rel.includes("demo/components/ui/")) continue; // vendored basis
                const src = blankComments(read(abs));
                if (/\bfrom\s+["']reka-ui["']/.test(src))
                    rekaReaches.push(rel);
            }
            if (rekaReaches.length === 0) {
                console.log(
                    `  ✓ [no-reka-reach] zero direct reka-ui import in the ` +
                        `demo-authored surface (ui/ vendored basis excluded)`,
                );
            } else {
                failures.push(
                    `[no-reka-reach] ${rekaReaches.length} direct \`from ` +
                        `"reka-ui"\` import(s) in the demo-authored surface — every ` +
                        `dialog/popover/select must consume the glass-ui surface, ` +
                        `not the headless basis (G.W12.S4):\n      ` +
                        rekaReaches.join("\n      "),
                );
            }
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
        "\nproof:decomposition — PASS: every library module is under its ceiling, the\n" +
            "parse adapter has ONE definition, the pure utils are re-homed, and no raw\n" +
            "async blob survives. D.W1 holds (demo style-size → proof:style-file-ceiling).",
    );
}

main();
