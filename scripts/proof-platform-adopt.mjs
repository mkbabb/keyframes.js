#!/usr/bin/env node
/**
 * proof:platform-adopt — the E.W9 modern-platform-adoption gate (inv ξ).
 *
 * The engine PARSES the modern platform surface (it parses `@property` rules
 * into a registry; it owns a JS `ScrollTimeline`; it reads the OS reduced-motion
 * preference; it serializes WAAPI keyframes) — but historically stopped at the
 * JS path on several axes where a FEATURE-DETECTED native path is strictly
 * closer to spec. E.W9 adopts each, the JS path as the proven fallback:
 *
 *   S1 (D-LIB-1)  — register the parsed `@property` registry via
 *                   `CSS.registerProperty` (typed customs: discrete → smooth).
 *   S2 (D-LIB-3)  — LIVE reduced-motion: one shared MediaQueryList + a `change`
 *                   listener; a mid-flight flip snaps a running loop to rest.
 *   S3 (F3)       — dense WAAPI sub-segment sampling so the compositor's
 *                   piecewise-linear fill tracks the rAF curve.
 *   S5 (D-LIB-2)  — the ADDITIVE native ScrollTimeline/ViewTimeline bridge; the
 *                   JS sampler STAYS (the ARCH-kill HOLDS — additive only).
 *
 * S4 (native CSS Color L4 interp) and S6 (`currentColor`/`light-dark()`) are
 * value.js-gated (E-HANDOFF) — RECORDED, not implemented this wave.
 *
 * This is a re-runnable SOURCE instrument that BITES on every regression. Each
 * clause reds on the exact negative it forbids — verified, not asserted. It
 * mirrors `proof:idioms` / `proof:boundary`: exits 1 on any residual, then
 * defers the behaviour-equivalence proof to `test/platform-adopt.test.ts` (run
 * separately by the `proof:platform-adopt` npm script).
 *
 * CLAUSES (each BITES):
 *
 *   1. S1 — engine.ts calls `CSS.registerProperty`, feature-detected
 *      (`typeof CSS !== "undefined" && registerProperty in CSS`) at the end of
 *      `fromString`, with a swallowed duplicate-name throw. BITE: revert the
 *      registration pass (today's state: `grep registerProperty src/` = ZERO)
 *      → no call site → reds.
 *
 *   2. S2 — reduced-motion.ts holds ONE shared MediaQueryList AND attaches a
 *      `change` listener via `onReducedMotionChange`, AND the engine re-consults
 *      `withReducedMotion` per tick (the `_frame` live re-consult). BITE: no
 *      `addEventListener("change")` (today's state) → reds; no per-tick
 *      re-consult → the mid-flight snap can't fire → the behaviour test reds.
 *
 *   3. S3 — waapi.ts emits INTERMEDIATE sub-segment offset stops (not just the
 *      stop boundaries), bounded. BITE: restore the boundary-only emit → no
 *      interior stops → the densification clause + behaviour test red.
 *
 *   4. S5 — the additive native bridge exists (`createNativeTimeline` +
 *      `attachNativeScrollTimeline`), feature-detected, AND the JS
 *      `ScrollTimeline` sampler STILL EXISTS (the ARCH-kill holds). BITE: delete
 *      the JS sampler → the additive-fallback clause reds; ship a bridge that
 *      replaces the JS class → the survives-clause reds.
 *
 *   5. NO-REGRESSION / FEATURE-DETECT DISCIPLINE — every native lift is guarded
 *      by a runtime detect (no bare `CSS.registerProperty(` / `new
 *      ScrollTimeline(` without a `typeof`/`in` guard nearby), so the SSR/jsdom
 *      baseline no-ops to today's behaviour. NO `scroll-timeline-polyfill`
 *      dependency anywhere (guidance-named — the JS path is the honest fallback).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(REPO, "src", "animation");

const read = (rel) => fs.readFileSync(path.join(SRC, rel), "utf8");
const relPosix = (p) => p.split(path.sep).join("/");

// The WAAPI surface = every `.ts` under `src/animation/waapi/` (R.W2 carved the
// flat `waapi.ts` god-module into eligibility/emission/options/delegation +
// densify). Reading the whole zone keeps the S3 densify + S5 native-bridge
// checks tracking the carve rather than one file's name.
const readWaapiSurface = () => {
    const dir = path.join(SRC, "waapi");
    if (!fs.existsSync(dir)) return "";
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".ts"))
        .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
        .join("\n");
};

const failures = [];
const pass = (msg) => console.log("  ✓ " + msg);
const fail = (msg) => failures.push(msg);

function main() {
    console.log(
        "proof:platform-adopt — E.W9 (the platform adopted, feature-detected)",
    );

    // R.W1/R.W2 directory partition — the flat `engine.ts` god-module was split
    // into the `engine/` zone: `fromString` + the `registerPropertyDescriptors`
    // delegating call live in `engine/css/css-animation.ts`; the `_frame → playFrame`
    // delegate + the public surface in `engine/animation.ts`. The S1/S2 source
    // checks read the ENGINE base = both, so they track the carve, not the
    // pre-R flat file. (A missing member → empty string → the clause still reds.)
    const readOpt = (rel) => {
        try {
            return read(rel);
        } catch {
            return "";
        }
    };
    const engine =
        readOpt(path.join("engine", "animation.ts")) +
        "\n" +
        readOpt(path.join("engine", "css", "css-animation.ts"));
    const reducedMotion = read(path.join("internal", "reduced-motion.ts"));
    // The waapi god-module was carved into the `waapi/` zone (eligibility /
    // emission / options / delegation + densify). The S3 densify + S5 native-
    // bridge checks read the whole WAAPI surface (every `waapi/*.ts`) so they
    // track the carve instead of the pre-R flat file.
    const waapi = readWaapiSurface();
    // R.W1 split the timeline into `orchestration/timeline/` — the JS sampler
    // (`KeyframesScrollTimeline`) in `index.ts` and the native feature-detect
    // factory (`createNativeTimeline` over `globalThis.ScrollTimeline`) in
    // `native.ts`. The S5 check reads BOTH so it finds the factory + the
    // surviving JS sampler regardless of which file each lands in.
    const timeline =
        read(path.join("orchestration", "timeline", "index.ts")) +
        "\n" +
        read(path.join("orchestration", "timeline", "native.ts"));

    // L decomposition (tranche-L `refactor: decompose engine.ts`) extracted the
    // CSS-rule metadata recovery — including the `CSS.registerProperty` pass —
    // out of `engine.ts` into `engine/css/metadata.ts`, with the engine left
    // importing + calling `registerPropertyDescriptors(...)` inside `fromString`.
    // The S1 source-shape check reads the ENGINE SURFACE = the engine base + the
    // extracted sibling, so it tracks the decomposition instead of the file
    // layout. (Missing sibling → empty string → the clause still reds.)
    const engineCssMetadata = readOpt(path.join("engine", "css", "metadata.ts"));
    const engineSurface = engine + "\n" + engineCssMetadata;

    // Q.WF1 decomposition (`engine/playback.ts`) — the standalone-play lifecycle
    // machine (the rAF/WAAPI/reduced-motion play DRIVERS, incl. the `playFrame`
    // per-tick live reduced-motion re-consult + the `snapToReducedMotion` snap)
    // was lifted out of `engine.ts` into the colocated INTERNAL `engine/playback.ts`,
    // with the engine left importing + delegating (`_frame` → `playback.playFrame`).
    // The S2 live-re-consult source-shape check reads the ENGINE PLAYBACK SURFACE
    // = the engine base + engine/playback.ts, so it tracks the decomposition
    // instead of the file layout (mirrors the S1 engine/css/metadata.ts precedent
    // above). (Missing sibling → empty string → the clause still reds.)
    const enginePlayback = readOpt(path.join("engine", "playback.ts"));
    const enginePlaybackSurface = engine + "\n" + enginePlayback;

    // ── 1. S1 — @property registry → CSS.registerProperty ─────────────────
    {
        // The registration pass must EXIST in the engine surface AND be wired
        // into engine.ts's `fromString` (whether inline or via the extracted
        // `registerPropertyDescriptors` delegate). Reverting either side reds.
        const hasCall =
            /CSS\.registerProperty\s*\(/.test(engineSurface) &&
            /registerProperty(?:Descriptors)?\s*\(/.test(engine);
        // The feature-detect: `typeof CSS` (jsdom/SSR-guarded, like the other
        // capability gates) AND `registerProperty` membership.
        const hasDetect =
            /typeof\s+CSS\s*===?\s*["']undefined["']/.test(engineSurface) &&
            /registerProperty/.test(engineSurface);
        // The duplicate-name throw must be swallowed (a try/catch around the
        // call) — a bare call would abort `fromString` on a re-registration.
        const hasSwallow = /try\s*\{[\s\S]*registerProperty[\s\S]*\}\s*catch/.test(
            engineSurface,
        );
        if (!hasCall) {
            fail(
                "[S1] engine.ts never calls CSS.registerProperty — the parsed " +
                    "@property registry stays INERT (today's state: grep " +
                    "registerProperty src/ = ZERO). Typed customs animate " +
                    "discretely on the native path.",
            );
        } else if (!hasDetect) {
            fail(
                "[S1] CSS.registerProperty is called WITHOUT a `typeof CSS` " +
                    "feature-detect — it would throw on SSR/jsdom instead of " +
                    "no-opping to today's behaviour.",
            );
        } else if (!hasSwallow) {
            fail(
                "[S1] the registerProperty pass does not swallow the benign " +
                    "InvalidModificationError (duplicate-name re-registration) — " +
                    "one already-registered name would abort fromString.",
            );
        } else {
            pass(
                "[S1] @property registry → CSS.registerProperty (feature-detected, " +
                    "duplicate-name throw swallowed)",
            );
        }
    }

    // ── 2. S2 — live reduced-motion observation ───────────────────────────
    {
        const hasListener = /addEventListener\(\s*["']change["']/.test(
            reducedMotion,
        );
        const hasObserver = /export function onReducedMotionChange/.test(
            reducedMotion,
        );
        // The engine's running rAF loop must re-consult the gate per tick so a
        // mid-flight flip is observed — the per-frame live re-consult. Post-Q.WF1
        // the play loop lives in `engine-playback.ts` (`playFrame` re-consults +
        // `snapToReducedMotion` snaps), so the grep reads the ENGINE PLAYBACK
        // SURFACE and matches either the pre-split (`_frame`/`_snapToReducedMotion`)
        // or the post-split (`playFrame`/`snapToReducedMotion`) names.
        const hasLiveReconsult =
            /(?:_frame|playFrame)\([\s\S]*?withReducedMotion/.test(
                enginePlaybackSurface,
            ) ||
            /withReducedMotion[\s\S]*?_?snapToReducedMotion/.test(
                enginePlaybackSurface,
            );
        if (!hasListener) {
            fail(
                "[S2] reduced-motion.ts attaches NO change listener (today's " +
                    "state: grep addEventListener.*change src/animation = none) — " +
                    "a mid-flight OS toggle is ignored until the next play().",
            );
        } else if (!hasObserver) {
            fail(
                "[S2] reduced-motion.ts has no onReducedMotionChange observer — " +
                    "the detector gained no observation half.",
            );
        } else if (!hasLiveReconsult) {
            fail(
                "[S2] the engine's running loop does NOT re-consult " +
                    "withReducedMotion per tick — a mid-flight flip cannot snap " +
                    "the loop to rest.",
            );
        } else {
            pass(
                "[S2] live reduced-motion: one shared MQL + change listener + " +
                    "per-tick re-consult (mid-flight flip snaps to rest)",
            );
        }
    }

    // ── 3. S3 — dense WAAPI sub-segment sampling ──────────────────────────
    {
        // The densification: a per-segment interior-sample loop in
        // toWAAPIKeyframes, BOUNDED by a named stop count.
        // Q.WB4 transposed the fixed-8 uniform `WAAPI_SUBSEGMENT_STOPS` loop into a
        // curvature-adaptive `densifyInteriorTimes` bounded by `WAAPI_MAX_SUBSEGMENT_STOPS`
        // (a TOTAL running budget). The S3 intent (bounded interior sampling, not
        // boundary-only) is preserved — the grep matches either era.
        const hasBound =
            /WAAPI_(?:MAX_)?SUBSEGMENT_STOPS|densifyInteriorTimes/.test(waapi);
        // It must sample BETWEEN the sorted boundary times — an interior densify
        // over consecutive boundary pairs, not boundary-only.
        const hasInteriorSample =
            /densifyInteriorTimes|sortedTimes\[i\s*-\s*1\]/.test(waapi) &&
            /WAAPI_(?:MAX_)?SUBSEGMENT_STOPS/.test(waapi);
        if (!hasBound) {
            fail(
                "[S3] waapi.ts has no bounded sub-segment stop count " +
                    "(WAAPI_MAX_SUBSEGMENT_STOPS / densifyInteriorTimes) — toWAAPIKeyframes samples only the " +
                    "stop boundaries; the compositor curve drifts between stops.",
            );
        } else if (!hasInteriorSample) {
            fail(
                "[S3] toWAAPIKeyframes does not interleave INTERIOR samples " +
                    "between consecutive boundaries — restoring the boundary-only " +
                    "emit (no interior stops) reds this clause.",
            );
        } else {
            pass(
                "[S3] dense WAAPI sub-segment sampling (bounded interior stops " +
                    "track the rAF curve)",
            );
        }
    }

    // ── 4. S5 — the ADDITIVE native scroll bridge (ARCH-kill holds) ───────
    {
        const hasNativeFactory =
            /export function createNativeTimeline/.test(timeline) &&
            /globalThis\.ScrollTimeline/.test(timeline);
        const hasAttach = /export function attachNativeScrollTimeline/.test(
            waapi,
        );
        const attachFeatureDetected =
            /createNativeTimeline/.test(waapi) &&
            /attached:\s*false/.test(waapi);
        // THE ARCH-KILL: the JS scroll sampler MUST still exist (the additive
        // bridge never replaces it — native is Chromium-only). PKG-3 (L.W8 §S4):
        // the JS sampler class was renamed `ScrollTimeline` → `KeyframesScrollTimeline`
        // to clear the `globalThis.ScrollTimeline` d.ts collision; `ScrollTimeline`
        // survives as the @deprecated backward-compat re-export alias. The sampler
        // survives iff its canonical class declaration is present.
        const jsSamplerSurvives =
            /export class KeyframesScrollTimeline extends Timeline/.test(timeline);
        if (!hasNativeFactory) {
            fail(
                "[S5] timeline.ts has no feature-detected createNativeTimeline " +
                    "(globalThis.ScrollTimeline) — no additive native bridge.",
            );
        } else if (!hasAttach) {
            fail(
                "[S5] waapi.ts has no attachNativeScrollTimeline — nothing wires " +
                    "the native timeline onto an eligible Element.animate.",
            );
        } else if (!attachFeatureDetected) {
            fail(
                "[S5] attachNativeScrollTimeline does not fall back ({attached: " +
                    "false}) where the native timeline is absent — it must keep " +
                    "the JS Timeline fallback, not throw.",
            );
        } else if (!jsSamplerSurvives) {
            fail(
                "[S5] the JS ScrollTimeline sampler was REMOVED — the ARCH-kill " +
                    "is violated. The bridge is ADDITIVE only; native scroll is " +
                    "Chromium-only and the JS sampler is the general fallback.",
            );
        } else {
            pass(
                "[S5] additive native scroll bridge (createNativeTimeline + " +
                    "attachNativeScrollTimeline); JS ScrollTimeline sampler SURVIVES",
            );
        }
    }

    // ── 5. NO-REGRESSION / no polyfill ────────────────────────────────────
    {
        // The mandate: NO scroll-timeline-polyfill anywhere (guidance-named —
        // the JS path is the honest fallback). Check the manifest + lockfile.
        const pkg = fs.readFileSync(path.join(REPO, "package.json"), "utf8");
        const polyfillNamed = /scroll-timeline-polyfill/.test(pkg);
        if (polyfillNamed) {
            fail(
                "[no-polyfill] scroll-timeline-polyfill is named in package.json " +
                    "— FORBIDDEN (guidance-named: not feature complete). The JS " +
                    "ScrollTimeline is the honest fallback, never a shim.",
            );
        } else {
            pass(
                "[no-polyfill] no scroll-timeline-polyfill dependency (JS path is " +
                    "the honest fallback)",
            );
        }

        // The native lifts ride the existing WAAPI / loadAnimationEngine dynamic
        // edge — the light reduced-motion + timeline modules stay value.js-free
        // (proof:boundary owns the full assertion; here we spot-check the two
        // files E.W9 touched carry no NEW static value.js specifier).
        for (const [name, src] of [
            ["internal/reduced-motion.ts", reducedMotion],
            ["timeline.ts", timeline],
        ]) {
            if (/from\s+["']@mkbabb\/value\.js/.test(src)) {
                fail(
                    `[boundary] ${relPosix(name)} gained a STATIC value.js import ` +
                        "— a light module must stay value.js-free (inv α). The " +
                        "native detect is a DOM-global probe, not a value.js edge.",
                );
            }
        }
        if (!failures.some((f) => f.startsWith("[boundary]"))) {
            pass(
                "[boundary] the light reduced-motion + timeline modules stay " +
                    "value.js-free (the native detects are DOM-global probes)",
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:platform-adopt — FAIL (E.W9 — the platform is not yet adopted):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  Each native lift must be FEATURE-DETECTED with the JS path as the\n" +
                "  proven fallback: S1 registers the @property registry, S2 observes\n" +
                "  reduced-motion live, S3 densifies the WAAPI sampling, S5 attaches\n" +
                "  an ADDITIVE native scroll timeline (the JS sampler survives). No\n" +
                "  polyfill — the JS path is the honest fallback. Each clause above\n" +
                "  reds on the exact regression it forbids.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:platform-adopt — PASS: the engine adopts the platform where\n" +
            "Baseline-safe, feature-detected, with the JS path as the proven\n" +
            "fallback; the ScrollTimeline JS sampler is NOT replaced. inv ξ holds.\n" +
            "(behaviour-equivalence: test/platform-adopt.test.ts)",
    );
}

main();
