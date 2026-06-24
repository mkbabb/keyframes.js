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
 *   1. LIBRARY CEILING — every `src/animation/**` module is ≤ its ceiling
 *      (350L `.vue`, 550L `.ts`), modulo a rationale-bearing per-file
 *      `LIBRARY_CEILING_OVERRIDE` (G.W5, with a stale-entry guard). A NEW
 *      un-exempted 600L library file reds it; the four genuinely-cohesive
 *      god-modules (engine/animations/group/sequence) carry recorded exceptions.
 *
 *      H.W8 RECONCILIATION (drift-red a): the DEMO file-size half of this clause
 *      is RETIRED here — it duplicated, and CONTRADICTED, the H.W12-authored
 *      `proof:demo-no-oversize`, which is the SINGLE demo file-size authority
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
 *      proof:demo-no-oversize, and this gate KEEPS only the library ceiling
 *      (the unique G.W5 value proof:demo-no-oversize does NOT cover — its sweep
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
const CONTROLS = path.join(
    REPO,
    "demo/@/components/custom/animation-controls",
);

// H.W8 RECONCILIATION (drift-red a) — the DEMO ceiling sweep is RETIRED. The
// D.W1/E.W1 demo line-count ceiling (350L `.vue` across `animation-controls/**`
// + `demo/app/**` + `orbital-drag/**` + the named EasingCurveCanvas.vue) was a
// duplicate, contradictory authority: H.W12's proof:demo-no-oversize is the
// SINGLE demo file-size gate (≤500L, the H.W12-MEASURED reality), and the H
// tranche legitimately grew the controls SFCs past the stale 350 (see the
// header docstring clause 1 for the 5 files + their growth drivers). Two demo
// gates at two ceilings (350 vs 500) on the SAME files is the DRY contradiction;
// demo file-size now lives ONLY in proof:demo-no-oversize. The demo STRUCTURAL
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
// the demo ceiling sweep — demo file-size is now solely proof:demo-no-oversize.)

// G.W5 — the LIBRARY `.ts` ceiling (path A, Design decision 2). Set ABOVE the
// demo's 250L because the interpolation/compile engines are intrinsically larger
// cohesive units (an isomorphism break the §Mandate permits when befitting +
// named): at 550L every ALREADY-SOTA leaf module (spring 491, waapi 473,
// frame-compiler 414, utils 377, drag 323, …) passes silently, while a NEW
// un-exempted 600L file reds (the G.md BITE). The four genuinely-cohesive modules
// over 550 carry RECORDED gated exceptions below.
const LIBRARY_CEILING = { ".vue": 350, ".ts": 550 };

// The RECORDED gated exceptions — the §Mandate-correct shape for "cohesive (or a
// god-LIST) but over the line": a NAMED per-file cap + the cohesion rationale,
// self-pruned by the stale-entry guard (an entry whose file drops back under the
// base cap reds as dead). This is the DECISION the F.md ceiling chronic asked G
// to make (a-deferred-ledger C-6, P-invariant: decide, do not re-defer) — the
// reflexive split is the legacy-shape the Mandate forbids (a-backend-godmodules
// G-GM-1). Each file below is verified at gestalt; NONE is carved.
const LIBRARY_CEILING_OVERRIDE = new Map([
    [
        "src/animation/engine.ts",
        {
            cap: 1450,
            why:
                "the Animation + CSSKeyframesAnimation core at its post-transposition " +
                "cohesive gestalt. Q.WF1 DISCHARGED DF-11-A (P-invariant-28) — the FULL " +
                "engine-seam transposition the D.W4 audit named ('the 1100-line " +
                "god-object at the right seam' — the lifecycle/playback machine " +
                "lifted off the frame-compile facade), deferred D→E→F→G→H→I→J→K→L→M→O→P, " +
                "is now DONE: the standalone-play machine (the rAF/WAAPI/reduced-motion " +
                "play DRIVERS + the transport verbs play/pause/resume/toggle/stop/" +
                "settle/reset/playing/effectiveT + the per-tick advance onStart/onEnd/" +
                "advanceTo bodies) was lifted into the colocated INTERNAL " +
                "`engine-playback.ts` (the fourth `engine-*.ts`, after composition/" +
                "options/css-metadata), host-passing over a `PlaybackHost` protocol the " +
                "class satisfies — each class method a thin `this`-delegate. The " +
                "`this`-bound re-derive contract is byte-preserved (`this.options === " +
                "this.compiler.options` identity untouched, the `_interpOut` zero-alloc " +
                "buffer reuse + `_boundFrame`-bound-once + event ordering all hold; " +
                "proof:standalone-zero-alloc / proof:engine / proof:event-ordering / " +
                "proof:finished are the discriminating-bite oracles). The KeyframesAnimation " +
                "CLASS BODY dropped 1297→1058L (under proof:engine's 1100 ceiling). " +
                "What REMAINS in engine.ts (1421L) is the cohesive non-playback gestalt: " +
                "the compile-delegation facade (parse/_compiler/get frames/adoptCompiled/ " +
                "interpFrames — the PUBLIC sampling API the group/ingest/morph/sequence " +
                "consume, which MUST stay), the live-options-reference setters, the " +
                "fill/rest contract (restPosition/paintRest/fillForwards/fillBackwards " +
                "wired to interpFrames), the Q.WB1 emerging-CSS Phase-2 element-aware " +
                "resolution pass, and the CSSKeyframesAnimation subclass (fromString/ " +
                "fromKeyframes/fromVars/bindTimeline). These share ONE `this`-bound " +
                "re-derive seam the FrameCompiler depends on; splitting them further " +
                "for line-count severs that seam (the legacy-shape the Mandate forbids). " +
                "The cap sits just above the measured 1421L post-split floor (the " +
                "self-pruning stale guard reds any further unjustified growth, and " +
                "reds outright if engine.ts ever drops back under the 550L base — " +
                "forcing this entry's removal). The two engine gates " +
                "(proof:engine-no-throw-on-play [hygiene g] + proof:engine) carry the " +
                "SAME post-transposition decision.",
        },
    ],
    [
        "src/animation/animations.ts",
        {
            cap: 900,
            why:
                "a god-LIST, NOT a god-module (a-backend-godmodules G-GM-2) — ONE " +
                "responsibility (the preset library) as a flat data table of " +
                "value-equivalent leaves. The `presetTaxonomy` index already banks " +
                "the discoverability a 4-way split would chase, IN-FILE, with no " +
                "new files; splitting a data table by a tag column is organization, " +
                "not decomposition (RECORD/contrivance — do NOT carve).",
        },
    ],
    [
        "src/animation/group.ts",
        {
            cap: 925,
            why:
                "the AnimationGroup compositor 4-concern gestalt (a-backend-" +
                "godmodules G-GM-3) — the zero-alloc `_grouped` buffer machinery, " +
                "the element-wise blend leaf (G.W17), the managed-child lifecycle, " +
                "and the scheduler-yield batching share one per-frame composite " +
                "seam; the buffer discipline (null-fill clear, whitelist key-skip, " +
                "post-blend compaction) is GL-7/GL-8 ALREADY-SOTA. Do NOT carve. " +
                "K.W11's spring-weight helpers were externalized to " +
                "`group-layer-springs.ts` (the cohesive block + grouped-key fold + " +
                "batched advance + PRM child-snap + child-paused broadcast); the " +
                "gate-anchored composite STATEMENTS the `weighted` leaf + spring " +
                "seam need (the `?? layer.weight` read, `layer.weightSpring = " +
                "spring`, `existing.target`, the per-frame `spring.tickDt(dt)`, the " +
                "settle commit/clear) stay inline — proof:spring-blend-weight " +
                "(+ proof:blend's 2-arm element-loop) lock them ON this seam. Q.WF2 " +
                "(F.W2 decomposition) EXTRACTED the P.W2 SoA fold machinery (the " +
                "`SoALayerPlan` type + `buildSoAPlans` plan builder + the " +
                "`groupSoABlendLayer` per-frame fold + the shared `isNumericUnit` " +
                "guard) to the INTERNAL `src/animation/group-soa.ts` (statically " +
                "imported, never re-exported); the `_soaPlans`/`_compositeBuf` " +
                "FIELDS stay instance state and `soaBlendLayer` stays a thin " +
                "delegating wrapper (so proof:soa-composite's `soa-path-taken` " +
                "monkey-patch on the INSTANCE method still bites). Zero behaviour " +
                "change — proof:{spring-blend-weight,blend,soa-composite,zero-" +
                "alloc,engine,group-snapshot-identity} green. The cap drops " +
                "1083→925L (the MEASURED post-SoA-extraction floor — the SoA " +
                "machinery is ~158L, leaving the file at 925L); the cap sits at " +
                "that floor so further unjustified growth reds. BORN-RED HANDOFF " +
                "(P-invariant-28): the FULL compositor-seam split (buffer/blend/" +
                "lifecycle/batch fully separated, the pre-P.W2 820L target) remains " +
                "the named future work — it separates only once Q.WF1 re-threads " +
                "the engine's composite contract; the SoA fold is the portion " +
                "extractable at THIS seam, the deep split awaits the engine " +
                "re-threading. Named here so the deferral is citable.",
        },
    ],
    [
        "src/animation/spring.ts",
        {
            cap: 700,
            why:
                "ONE cohesive physics unit (the SpringProgress closed-form spring " +
                "tracker) — the SwiftUI-canonical `(response, dampingFraction)` " +
                "surface, the second-order-ODE integrator, the settle contract, the " +
                "managed `.play()`/`tickDt` drive, and the K.W11 PHYS-B2 " +
                "velocity-continuous interruption seam (`VelocityProbe` / " +
                "`probeVelocity` / `reseatToSpring`: the finite-differenced reseat " +
                "that makes a keyframe-stream interruption velocity-continuous). " +
                "K.W11 grew it +170L; the reseat is NOT a separable module — it " +
                "seeds a `SpringProgress` from a measured `(x,v)` and IS the spring " +
                "tracker's interruption entry-point (it composes only the class " +
                "beside it + a leaf finite difference, LIGHT/value.js-free). A " +
                "split-for-line-count would orphan the reseat from the integrator " +
                "it seeds. 550→700 records the K.W11 growth; the cap sits just above " +
                "the current 644L (further unjustified growth reds).",
        },
    ],
    [
        "src/animation/waapi.ts",
        {
            cap: 650,
            why:
                "the WAAPI eligibility + delegation gestalt — `isWAAPIEligible` " +
                "(the conservative-correct DOM/uniform-timing/no-computed-unit/" +
                "no-color/WebKit-linear() predicate with a queryable reason), " +
                "`toWAAPIKeyframes`/`toWAAPIOptions` (the `Element.animate()` " +
                "keyframe + option emission, spring-`linear()`-aware), `playWAAPI` " +
                "(the shadow-tick delegation), and `attachNativeScrollTimeline` (the " +
                "K.W9 native ScrollTimeline bridge the scroll dispatch consumes) " +
                "share ONE eligibility seam: the scroll attach RE-USES the same " +
                "eligibility predicate the play-path delegation does (the dispatch " +
                "is the predicate pointed at the scroll clock). Q.WF1 (Band-F " +
                "decomposition) EXTRACTED the WB4 curvature-adaptive densify (the " +
                "`densifyInteriorTimes` best-first refinement + its " +
                "`WAAPI_MAX_SUBSEGMENT_STOPS` budget + the chord tolerance + the " +
                "channel sampler/range scanner + `segmentFlatnessError`) to the " +
                "colocated INTERNAL `waapi-densify.ts` (statically imported + " +
                "re-exported so proof:waapi-adaptive-densify / proof:platform-adopt " +
                "S3 find the anchored tokens at this host); the densify reaches the " +
                "animation ONLY through `interpFrames`, so it is fully separable " +
                "from the eligibility/emission/delegation surface that stays. The " +
                "cap drops the file 816→579L; 550→650 records the cohesive " +
                "remainder (the predicate + its consumers — play delegation + scroll " +
                "attach — are one decision surface, not separable concerns), the " +
                "cap sitting just above 579L so further unjustified growth reds.",
        },
    ],
    [
        "src/animation/frame-compiler.ts",
        {
            cap: 640,
            why:
                "the FrameCompiler template→compiled pipeline at its cohesive " +
                "gestalt PLUS the two keyframe-selector grammar surfaces gates PIN " +
                "to this file. The pipeline (addFrame → parse → reconcileVars → " +
                "createFrame → finalizeFrameVars → renormalizeColors) is ONE " +
                "value-in → frames-out unit sharing the live-options reference + the " +
                "per-frame interp-carrier build; splitting it for line-count severs " +
                "that seam. Q.WF1 (Band-F decomposition) EXTRACTED the genuinely-" +
                "separable WB3 numeric SoA fold-plan machinery (`buildNumericPlan` + " +
                "`isNumericInterpVar`) to the colocated INTERNAL " +
                "`frame-compiler-numeric.ts` (the third SoA-style extraction this " +
                "wave makes, beside group-soa.ts + waapi-densify.ts); the plan " +
                "builder is a PURE value-in → plan-out unit with no dependency on " +
                "the grammar/pipeline that stays. What REMAINS over the 550 base is " +
                "the cohesive compile pipeline + the two GATE-PINNED grammar " +
                "surfaces: the percent/keyword/named-range selector validation (the " +
                "J.W1 SEAM-1 total guard) and the WD1 named-selector deferred-" +
                "resolution (`export const namedSelectorToFraction` + " +
                "`NAMED_SELECTOR_SUPERTYPE`) — proof:replay-equality (named-selector) " +
                "+ proof:nan-frame REQUIRE these exports to LIVE in frame-compiler.ts " +
                "(a dynamic import + an `export const` source-grep), so they cannot " +
                "move. The cap drops the file 663→616L; 550→640 records the cohesive " +
                "remainder, the cap sitting just above 616L so further unjustified " +
                "growth reds.",
        },
    ],
    [
        "src/animation/resolve-values.ts",
        {
            cap: 600,
            why:
                "ONE recursive emerging-CSS lowering rewriter (P.W13) at its " +
                "cohesive gestalt — the gestalt the module's own header names: 'ONE " +
                "pass, ONE rewriter, two lifecycle points, not two divergent context " +
                "types'. The Phase-1 (element-INDEPENDENT: if(supports/media) + " +
                "spring()) and Phase-2 (element-AWARE: if(style(--p)) + sibling-" +
                "index()/sibling-count()) arms are WOVEN INTO the SAME shared " +
                "recursion (`resolveNode`/`resolveIf`/`evalCondition`/" +
                "`splitCondition`) — they are NOT a separable arm: a Phase-1-resolved " +
                "leaf is returned as-is by the SAME `resolveNode` the Phase-2 pass " +
                "re-runs (the idempotence the two-lifecycle-point design needs). " +
                "proof:emerging-css-resolve-p2 PINS the Phase-2 anchors " +
                "(`hasPhase2Node`, `isStyleConditionIf`, `evalStyleCondition`, the " +
                "sibling-* branches in `resolveNode`, the style(--p) branch in " +
                "`evalCondition`) to THIS file by source-grep, so extracting the " +
                "Phase-2 arm would both sever the shared recursion AND red the gate. " +
                "Q.WB1 grew it +28 over the 550 base for the Phase-2 element-aware " +
                "arms; 550→600 records that growth on a genuinely-cohesive ONE-" +
                "rewriter module (a split-for-line-count is the legacy-shape the " +
                "Mandate forbids), the cap sitting just above 578L so further " +
                "unjustified growth reds.",
        },
    ],
    [
        "src/animation/load-engine.ts",
        {
            cap: 580,
            why:
                "the value.js static/dynamic boundary's DYNAMIC half at its " +
                "cohesive gestalt — the ONE `loadAnimationEngine()` boundary the " +
                "library is architected around. It owns the memoized `await " +
                "import(...)` edges (engine/animate/motion/draw/morph/ingest/scroll/" +
                "compile/validate/animations/format/utils/scheduler) + the granular " +
                "`loadEngine`/`loadCompiler`/`loadIngest` accessors that SHARE the " +
                "per-chunk memoized Promises, + the `AnimationEngine`/`EngineCore`/" +
                "`CompilerSurface`/`IngestSurface` surface interfaces the dts " +
                "roll-up spells explicitly (API Extractor cannot resolve a `typeof " +
                "import()` at an internal module). Every member is ONE concern (the " +
                "boundary contract `proof:boundary` gates per-accessor); splitting " +
                "it fragments the boundary — the surface interfaces and the " +
                "accessors that satisfy them are two halves of one contract that " +
                "must stay co-located + in lock-step. 9L over the 550 base, " +
                "essentially pre-existing (the L.W7 granular-surface split); " +
                "550→580 records the cohesive boundary file, the cap sitting just " +
                "above 559L so further unjustified growth reds.",
        },
    ],
    [
        "src/animation/sequence.ts",
        {
            cap: 700,
            why:
                "the transport/scheduling `_fold` gestalt (a-backend-godmodules " +
                "G-GM-4) — the master-playhead → child-clock map, the position " +
                "resolver (labels/relative tokens), and the play/pause/resume/seek " +
                "transport share one clock seam; the apparent transport-vs-resolve " +
                "seam is a FALSE one (the resolver reads the same cursor the " +
                "transport advances). Do NOT carve.",
        },
    ],
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

    // Clause 1 (ceilings) sweeps the LIBRARY surface ONLY (`src/animation/**`,
    // G.W5), swept at LIBRARY_CEILING / LIBRARY_CEILING_OVERRIDE. H.W8 RETIRED
    // the demo half of this clause (the controls + app + orbital + named
    // EasingCurveCanvas sweep): demo file-size is now solely proof:demo-no-oversize
    // (H.W12, ≤500L MEASURED) — two demo gates at 350 vs 500 was the DRY
    // contradiction. The demo STRUCTURAL clauses (2–10) still sweep `sources`.
    const librarySources = collectSources(LIBRARY);
    const ceilingSources = librarySources.slice().sort();

    console.log("proof:decomposition — D.W1 + E.W1 + G.W5 (library ceiling + demo structure)");
    console.log(
        `  source files scanned: ${ceilingSources.length} library file(s) for ` +
            `the ceiling (src/animation/**); the demo structural clauses sweep ` +
            `animation-controls/** + demo/** (demo file-size → proof:demo-no-oversize)`,
    );

    // ── 1. LIBRARY CEILING ─────────────────────────────────────────────
    // A per-file LIBRARY_CEILING_OVERRIDE raises the cap for a NAMED cohesive
    // unit (a god-module); the stale guard below reds any override whose file is
    // now under the base ceiling (a dead exception). Track which overrides bit.
    const overCeiling = [];
    const usedOverrides = new Set();
    for (const abs of ceilingSources) {
        const ext = path.extname(abs);
        const rel = relPosix(abs);
        const base = LIBRARY_CEILING[ext];
        if (base == null) continue;
        const override = LIBRARY_CEILING_OVERRIDE.get(rel);
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
                    `library ceiling for ${path.extname(o.rel)} — split at its ` +
                    `natural concern seam, or (only for a genuinely cohesive ` +
                    `god-module) add a rationale-bearing LIBRARY_CEILING_OVERRIDE ` +
                    `(G.W5) entry.`,
            );
        }
    } else {
        const totalOverrides = LIBRARY_CEILING_OVERRIDE.size;
        console.log(
            `  ✓ [ceiling] all library files ≤ ceiling (350L .vue / 550L .ts)` +
                (totalOverrides > 0
                    ? `; ${totalOverrides} named override(s)`
                    : ""),
        );
    }

    // Stale override guard — an override whose file is now under its base
    // ceiling is dead and must be pruned (mirrors the ASYNC_ALLOWLIST stale
    // guard). Keeps the exception map from silently accruing slack — so an
    // engine.ts ever refactored back under the base cap reds the guard,
    // forcing the entry's removal (the self-pruning §Mandate discipline).
    for (const [rel, meta] of LIBRARY_CEILING_OVERRIDE) {
        if (!usedOverrides.has(rel)) {
            failures.push(
                `[ceiling] LIBRARY_CEILING_OVERRIDE entry "${rel}" (cap ${meta.cap}, ` +
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
                "demo/@/components/custom/editor-shell/useShareState.ts";
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

        // ── 9. proof:dock-barrel-absent — G.W12 (the D.W5 dock close) ────────
        // The dock pass-through barrel (dock/index.ts re-exporting glass-ui's
        // GlassDock/DockLayerGroup + ./TopDock.vue) is DELETED (the §Mandate
        // forbids a re-export barrel that exists only to re-route names already
        // available at their source). The dock SFC is RENAMED TopDock→ChromeDock
        // (the name reads true), and the dock primitives are imported DIRECTLY
        // from @mkbabb/glass-ui/dock (no nested-import barrel).
        //   BITE: today — the barrel exists, TopDock.vue imports from ".", no
        //         ChromeDock; green after S1.
        {
            const dockBarrel = "demo/@/components/custom/dock/index.ts";
            const dockBarrelAbs = path.join(REPO, dockBarrel);
            const chromeDockRel = "demo/@/components/custom/dock/ChromeDock.vue";
            const chromeDockAbs = path.join(REPO, chromeDockRel);
            const topDockAbs = path.join(
                REPO,
                "demo/@/components/custom/dock/TopDock.vue",
            );

            const dockFails = [];

            // 9a — the pass-through barrel is GONE (or carries no re-export).
            if (fs.existsSync(dockBarrelAbs)) {
                const barrelSrc = blankComments(read(dockBarrelAbs));
                if (/\bexport\b/.test(barrelSrc)) {
                    dockFails.push(
                        `${dockBarrel} still exists with re-export(s) — the pure ` +
                            `pass-through dock barrel is DELETED (import glass-ui ` +
                            `dock primitives directly; G.W12.S1).`,
                    );
                }
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
                    `demo/@/components/custom/dock/TopDock.vue still exists — the ` +
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
                    `  ✓ [dock-barrel-absent] no dock/index.ts pass-through ` +
                        `barrel; ChromeDock.vue present (no TopDock); dock ` +
                        `primitives imported directly from @mkbabb/glass-ui/dock`,
                );
            } else {
                for (const f of dockFails)
                    failures.push(`[dock-barrel-absent] ${f}`);
            }
        }

        // ── 10. proof:no-reka-reach — G.W12.S4 (the one headless reach KILLED) ─
        // Exactly ZERO direct `from "reka-ui"` import in the DEMO-AUTHORED surface
        // (excluding the vendored shadcn-vue `demo/@/components/ui/` basis, which
        // legitimately wraps reka). The one demo reach — AnimationMenuBar's raw
        // SelectIcon — is replaced by the glass-ui surface (DockSelectTrigger owns
        // the trigger/chevron).
        //   BITE: today on AnimationMenuBar.vue's `import { SelectIcon } from
        //         "reka-ui"`; green after S4. A new reka reach reds.
        {
            const rekaReaches = [];
            for (const abs of demoSources) {
                const rel = relPosix(abs);
                if (rel.includes("demo/@/components/ui/")) continue; // vendored basis
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
            "async blob survives. D.W1 holds (demo file-size → proof:demo-no-oversize).",
    );
}

main();
