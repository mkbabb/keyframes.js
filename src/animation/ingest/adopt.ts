/**
 * ingest.ts — the round-trip pointed FORWARD at the live web (K.W8).
 *
 * The parser run FORWARD over the SAME data model: the engine's input is a
 * string of CSS, and the CSSOM emits strings of CSS, so kf is one thin adapter
 * away from animating any page's OWN animations. This module is the K.W8
 * ingest's public face. It splits at the natural concern seam (the K close
 * decomposition) into two colocated halves:
 *
 *   • `./ingest-cssom` — the STYLESHEET walk: `resolveLiveKeyframes` /
 *     `fromStyleSheets` / `fromLiveAnimations` read `document.styleSheets`,
 *     filter to `CSSKeyframesRule`, and reconstruct each via the EXISTING
 *     `resolveKeyframes` pipeline (re-exported below, so the barrel + the
 *     `proof:ingest-replay` import set are unchanged).
 *   • THIS file — the mid-flight TEMPORAL takeover: `adoptRunning()` hands a
 *     RUNNING CSS animation to the kf engine at its exact playhead (the
 *     continuity seed), CONSUMING the CSSOM walk to reconstruct the authored
 *     `@keyframes` rule.
 *
 * What it reads is exactly what the engine already eats; what cannot ingest
 * faithfully is REFUSED with a named `Diagnostic` row, never silently
 * approximated (the replay-equality invariant, forward direction).
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). The CSSOM half statically imports
 * `./engine` + `./adapter`; this file imports `./engine` for the takeover's
 * commit/seed. Both carry the value.js CSS grammar, so the ingest lives on the
 * EXISTING heavy/dynamic surface, reached ONLY via `loadAnimationEngine()` (the
 * barrel places these exports behind that accessor). It adds NO new static
 * value.js edge beyond the engine it already needs (inv α; `proof:boundary`).
 *
 *   • K2 — `adoptRunning()`: mid-flight takeover of a running CSS animation via
 *           `getAnimations()` currentTime handoff. NAMED `adoptRunning` to
 *           disambiguate from the shipped `engine.ts adoptCompiled` (HARDENING-5
 *           HAZARD-1). Reconstructs from the CSSOM `@keyframes` RULE (via the
 *           CSSOM walk — the authored form, preserving `var()`/`cqw`/oklab),
 *           NEVER from `getAnimations().getKeyframes()` (the computed form has
 *           already lost the axes kf preserves). Seeds at the captured
 *           `currentTime` (the continuity seed — NOT seed-at-zero, which flashes).
 *   • S3 — the honesty surface: every refusal is a typed `Diagnostic` row.
 */

import { CSSKeyframesAnimation } from "../engine";
import type { Diagnostic } from "../adapter";
import type { Vars } from "../constants";
import {
    resolveLiveKeyframes,
    type IngestOptions,
} from "./cssom";

// Re-export the CSSOM-walk half so the barrel + tests + `proof:ingest-replay`
// import the full ingest surface from the ingest barrel exactly as before the
// split (zero import-set churn — pure colocated extraction).
export {
    resolveLiveKeyframes,
    fromStyleSheets,
    fromLiveAnimations,
} from "./cssom";
export type {
    IngestedAnimation,
    IngestResult,
    IngestOptions,
} from "./cssom";

/** Options for {@link adoptRunning}. */
export interface AdoptRunningOptions extends IngestOptions {
    /**
     * The running CSS animation's name to adopt. REQUIRED — an element may host
     * several CSS animations, and the takeover must name exactly one (the
     * `@keyframes` rule to reconstruct + the `getAnimations()` entry to read the
     * playhead from).
     */
    animationName: string;
    /**
     * Commit the native animation's current computed frame inline before
     * cancelling it (the commit-on-ADOPT, the inverse of `playWAAPI`'s
     * commit-on-finish), so there is no flash between the native paint and the
     * kf paint. Default true; set false only when the caller commits itself.
     */
    commit?: boolean;
}

/**
 * The outcome of an {@link adoptRunning} takeover. `animation` is the kf object
 * now driving the element (seeded at the captured playhead, already playing);
 * `currentTime` is the playhead (ms) the takeover seeded from; `diagnostics`
 * carries any honest refusal (no running animation by that name → a row, never
 * a silent no-op).
 */
export interface AdoptResult<V extends Vars = any> {
    /** The kf animation now driving the element (null on a refused adopt). */
    animation: CSSKeyframesAnimation<V> | null;
    /** The captured native `currentTime` (ms) the kf playhead seeded from. */
    currentTime: number;
    /** Honest refusal rows (e.g. no running animation by that name). */
    diagnostics: Diagnostic[];
}

/**
 * Is `v` a `CSSUnitValue` (a `{ value: number, unit: string }`)? A scroll-driven
 * `CSSAnimation.currentTime` is one — `{ value: 42, unit: "percent" }` — not a
 * numeric ms (L.W3 S5). The structural duck-type (NOT `instanceof CSSUnitValue`,
 * which is absent in jsdom and unstable across realms) recognises the shape so
 * the scroll-time branch is not coupled to a specific Typed-OM implementation.
 */
const isCSSUnitValue = (
    v: unknown,
): v is { value: number; unit: string } => {
    if (typeof v !== "object" || v === null) return false;
    const u = v as { value?: unknown; unit?: unknown };
    return typeof u.value === "number" && typeof u.unit === "string";
};

/**
 * K2 — `adoptRunning`: the mid-flight TEMPORAL takeover. Given a live element
 * with a running CSS animation, seamlessly hand control to the kf engine:
 *
 *   1. `el.getAnimations()` → find the running `CSSAnimation` matching
 *      `{ animationName }`; read its `currentTime` + `playState`.
 *   2. Reconstruct the kf `CSSKeyframesAnimation` from the CSSOM `@keyframes`
 *      RULE (via {@link resolveLiveKeyframes} — the AUTHORED form, preserving
 *      `var()`/`cqw`/oklab), NOT from `getAnimations().getKeyframes()` (which has
 *      px-resolved `var()`/`cqw` and RGB-baked oklab — the very axes kf preserves).
 *   3. Seed the kf animation at the captured `currentTime` (the continuity seed
 *      — NOT seed-at-zero, which flashes the element to its 0% state).
 *   4. Commit the current frame inline (the commit-on-ADOPT), then `cancel()`
 *      the native animation, so there is no leaked-precedence flash (the inverse
 *      of `playWAAPI`'s commit-on-finish discipline — `waapi.ts`).
 *   5. Hand control to the kf engine (the kf animation plays from `currentTime`).
 *
 * NAMED `adoptRunning` to disambiguate from `engine.ts`'s `adoptCompiled`
 * (compiled-state internal adopt — untouched; HARDENING-5 HAZARD-1).
 *
 * @example
 * const { adoptRunning } = await loadAnimationEngine();
 * // el is mid-flight on `.spin { animation: spin 2s linear infinite }`
 * const { animation } = await adoptRunning(el, { animationName: "spin" });
 * // the kf object now drives `el` from the exact playhead — no visible seam.
 * animation?.pause();   // ...now scrub / spring-ify / re-color it.
 */
export const adoptRunning = async <V extends Vars = any>(
    el: Element,
    options: AdoptRunningOptions,
): Promise<AdoptResult<V>> => {
    const diagnostics: Diagnostic[] = [];
    const { animationName, commit = true } = options;

    if (typeof el.getAnimations !== "function") {
        diagnostics.push({
            code: "WAAPI_INELIGIBLE",
            message:
                "the element has no getAnimations() — adoptRunning() needs the Web " +
                "Animations API to read the running animation's playhead",
        });
        return { animation: null, currentTime: 0, diagnostics };
    }

    // (1) find the running CSSAnimation by name; read its playhead.
    const live = el
        .getAnimations()
        .find(
            (a) =>
                (a as { animationName?: string }).animationName ===
                animationName,
        );
    if (live == null) {
        // An INGEST-domain refusal (L.W3 S3): the Web Animations API IS present
        // (getAnimations() resolved above) but reports no running animation by
        // that name. This is NOT a WAAPI-API absence — it is a refused takeover.
        // `ADOPT_REFUSE` is the stable code that lets a consumer branch on
        // "adopt refused" vs "WAAPI absent" without scraping the message.
        diagnostics.push({
            code: "ADOPT_REFUSE",
            message:
                `no running CSS animation named "${animationName}" on the element — ` +
                "adoptRunning() refuses (the takeover names exactly one running " +
                "animation; nothing was silently adopted)",
        });
        return { animation: null, currentTime: 0, diagnostics };
    }

    // The captured playhead — the continuity seed. `currentTime` is a
    // `CSSNumberish` (ms | null | a CSSUnitValue `{value, unit}` for a scroll
    // timeline). Three shapes resolve here (L.W3 S5):
    //   • a finite `number` → the ms playhead (the rAF-timeline case).
    //   • a CSSUnitValue with `unit === "percent"` → a SCROLL-DRIVEN playhead:
    //     `value` is the scroll progress in [0,100]; `scrollProgress = value/100`
    //     is the [0,1] domain. The ms playhead is `scrollProgress * duration`,
    //     computed AFTER reconstruction (the duration is the reconstructed
    //     object's). Defaulting it to 0 would jump the scroll target to the top
    //     of the range — the same flash the continuity seed exists to prevent.
    //   • a CSSUnitValue with any OTHER unit → an unexpected form (a future spec
    //     extension); `adoptRunning` REFUSES with an `ADOPT_REFUSE` row citing the
    //     unit, rather than silently mis-seeding.
    const rawTime = (live as { currentTime?: unknown }).currentTime;
    let scrollProgress: number | null = null;
    let msTime = 0;
    if (typeof rawTime === "number" && Number.isFinite(rawTime)) {
        msTime = rawTime;
    } else if (isCSSUnitValue(rawTime)) {
        if (rawTime.unit === "percent" && Number.isFinite(rawTime.value)) {
            scrollProgress = rawTime.value / 100;
        } else {
            diagnostics.push({
                code: "ADOPT_REFUSE",
                message:
                    `the running animation "${animationName}" reports a currentTime ` +
                    `in an unsupported unit "${String(rawTime.unit)}" — adoptRunning() ` +
                    "refuses (only a numeric ms playhead or a scroll-driven " +
                    '"percent" CSSUnitValue can seed the takeover faithfully)',
            });
            return { animation: null, currentTime: 0, diagnostics };
        }
    }

    // (2) reconstruct from the CSSOM @keyframes RULE — the authored form, NOT
    // the computed getKeyframes() (which has lost var()/cqw/oklab). The walk
    // over the element's owner document, filtered to THIS name.
    const ownerDoc =
        el.ownerDocument ??
        (typeof document !== "undefined" ? document : undefined);
    const ingest = resolveLiveKeyframes<V>(ownerDoc ?? undefined, {
        ...options,
        animationName,
    });
    for (const d of ingest.diagnostics) diagnostics.push(d);

    const ingested = ingest.animations.get(animationName);
    if (ingested == null) {
        // The reconstruction-failure refusal (L.W3 S3): the `@keyframes` rule
        // could not be FOUND or reconstructed in an adopt context. `PARSE_ERROR`
        // (the prior code) conflates a value.js grammar failure — which the
        // per-rule walk already emits on its own channel — with the adopt-context
        // refusal to take over. `ADOPT_REFUSE` is the correct domain code for a
        // refused takeover (the native animation keeps running; nothing adopted).
        diagnostics.push({
            code: "ADOPT_REFUSE",
            message:
                `the @keyframes rule for "${animationName}" could not be found or ` +
                "reconstructed from the CSSOM — adoptRunning() refuses rather than " +
                "reconstruct from the lossy computed keyframe list",
        });
        // The native animation keeps running; we adopted nothing (honest refusal).
        return { animation: null, currentTime: msTime, diagnostics };
    }

    const animation = ingested.animation;
    for (const d of ingested.diagnostics) diagnostics.push(d);
    animation.setTargets(el as HTMLElement);

    // Resolve the ms playhead the takeover seeds from (L.W3 S5). For a numeric
    // currentTime it is `msTime` verbatim; for a scroll-driven CSSUnitValue it is
    // the scroll progress mapped into the reconstructed object's ms timeline
    // (`scrollProgress * duration` — the manual-timeline seeding path: the kf
    // playhead resumes at the scroll position, never the silent default-to-0).
    const currentTime =
        scrollProgress != null
            ? scrollProgress * animation.options.duration
            : msTime;

    // (4) commit-on-ADOPT: paint the kf object's frame AT the captured playhead
    // inline BEFORE cancelling the native animation, so the element never flashes
    // to the 0% state between the native cancel and the kf paint. This is the
    // inverse of `playWAAPI`'s commit-on-finish (`waapi.ts`): there, kf bakes the
    // final frame before yielding to static styles; here, kf bakes the CURRENT
    // frame before taking over. `interpFrames(t, apply=true)` writes the resolved
    // frame onto the target.
    if (commit) {
        animation.interpFrames(currentTime, true);
    }

    // Cancel the native animation — its precedence (a CSS animation overrides
    // static styles while running) would otherwise fight the kf paint. We cancel
    // AFTER the commit so there is no window where neither paints.
    try {
        live.cancel();
    } catch {
        /* a finished/detached animation throws on cancel — already yielded */
    }

    // (3)+(5) seed the kf engine at the captured playhead and hand it control.
    // `seekAndPlay` starts the loop with `startTime` shifted so `effectiveT`
    // begins at `currentTime` — the continuity seed, NOT seed-at-zero. We do not
    // await the play promise (the handle IS the control surface, the same
    // control-handle contract every `from*` factory returns).
    seedAtTime(animation, currentTime);

    return { animation, currentTime, diagnostics };
};

/**
 * Seed a freshly-reconstructed animation at `t` ms and start its loop so the
 * playhead CONTINUES from `t` instead of rewinding to 0 (the continuity seed —
 * the cure for the seed-at-zero flash, clause c).
 *
 * The mechanism: the play loop drives `advanceTo(now)` with `now` a rAF
 * timestamp in the `performance.now()` / `document.timeline` domain (the SAME
 * domain a `CSSAnimation.currentTime` delta lives in). On the FIRST tick
 * `advanceTo` re-seeds `startTime` ONLY when it is `undefined`; we instead
 * PRE-SET `startTime` in that clock domain so the first tick lands at
 * `this.t = now - startTime ≈ t`. The seed-at-zero default (the flash) is the
 * `startTime = now + delay` re-seed; the continuity seed bypasses it by setting
 * a defined `startTime` baselined to `t`.
 *
 * `onStart`'s direction/fill setup is run explicitly first (the takeover is a
 * mid-flight continuation, so `animationstart` is NOT re-dispatched — the
 * native animation already fired it), then `started` is marked and the loop
 * kicked. The commit-on-adopt (above) already painted `t`'s frame, so the first
 * rAF tick continues smoothly from there.
 */
const seedAtTime = <V extends Vars>(
    animation: CSSKeyframesAnimation<V>,
    t: number,
): void => {
    // Force the rAF path: the continuity seed positions the rAF playhead, but a
    // WAAPI delegation would hand the compositor a fresh `Element.animate()`
    // starting at 0 (the compositor cannot be seeded mid-curve the way the rAF
    // `startTime` baseline can), re-introducing the flash. The takeover is
    // explicitly an rAF-seeded continuation.
    animation.setUseWAAPI(false);
    // Strip the source delay BEFORE onStart() (L.W3 S1). A mid-flight takeover is
    // a CONTINUATION — the native animation already consumed its `animation-delay`
    // on the page; re-imposing it re-freezes an animation the user was watching
    // play. `onStart()` enters the `options.delay > 0` branch (engine.ts), sets
    // `paused = true`, and returns a pending sleep promise; seedAtTime does NOT
    // await it, so `paused` would stay true and the first `advanceTo` hits the
    // `paused && pausedTime === 0` early-out — the engine frozen at the seed
    // forever. Resetting the delay to 0 here makes `onStart()` take the immediate
    // (non-delay) path. The reconstructed object's DECLARED delay is preserved on
    // the sibling-rule serialization path (the strip is takeover-local, not a
    // reconstruction-time option) so round-trip symmetry is intact.
    animation.setDelay(0);
    // Run the direction/fill setup (NOT a re-`animationstart` — `onStart` only
    // dispatches when it falls through to the delay path; the takeover skips
    // delay, so no event re-fires). This positions `reversed`/fill exactly as a
    // fresh play would, minus the seed-at-zero.
    animation.onStart();
    animation.started = true;
    // The continuity seed: baseline `startTime` in the rAF clock domain so the
    // first `advanceTo(now)` computes `this.t = now - startTime ≈ t`, NOT 0. The
    // sub-frame drift between this `now()` read and the first rAF `now` is one
    // frame (~16ms) — visually continuous, the whole point of the seed.
    const now =
        typeof performance !== "undefined" && performance.now
            ? performance.now()
            : Date.now();
    animation.startTime = now - t;
    animation.t = t;
    void animation.play();
};
