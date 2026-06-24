/**
 * scroll-scene.ts — K.W9 SCROLL-AS-CSS (the field's #1 named gap, closed the
 * only-kf way: PARSE + ROUND-TRIP + DISPATCH the scroll grammar the platform is
 * still shipping). This file is the TIME-DRIVER half.
 *
 * kf treats scroll-driven CSS as a parseable, round-trippable source of truth.
 * The K close decomposition splits this module at the natural concern seam into
 * two colocated halves:
 *
 *   • `./scroll-grammar` — the SO-1 grammar ROUND-TRIP (the value.js consume
 *     edge): `parseScrollTimeline` / `parseScrollRange` / `parseScrollCSS`
 *     (PARSE) and `serializeScrollOptions` / `roundTripScrollCSS` (SERIALIZE),
 *     each a pass-through to value.js 0.13.0's `CSSTimelineOptions` extractor +
 *     inverse serializer. Re-exported below, so the barrel + tests +
 *     `proof:scroll-roundtrip` import set are unchanged.
 *   • THIS file — the TIME driver: the range→[0,1] mapping, the `ScrollScene` JS
 *     driver, the conservative-correct backend dispatch, and the
 *     `position:sticky` pin synthesis. It DRIVES the parsed grammar on the
 *     compositor where the platform allows AND on its shipped physics primitives
 *     where the platform falls short (Firefox-default, non-DOM targets,
 *     scrub-smoothing, physics-snap).
 *
 * ── The static/dynamic boundary (BINDING — proof:boundary) ─────────────────
 * The HEAVY (static `@mkbabb/value.js`) edge lives in `./scroll-grammar`; this
 * file references value.js only via ERASED `import type`. The whole scroll
 * surface is reached ONLY via `loadAnimationEngine()` — NEVER a LIGHT static
 * barrel export. The value.js-free LIGHT surface stays value.js-free.
 *
 * ── The VALUE / TIME division-of-labour (RESOLVED — not re-litigated) ──────
 * value.js owns VALUES (the grammar half: `scroll()`/`view()`/range-phase tokens
 * VERBATIM — `"40%"` NOT resolved to px; no live-DOM scroller offset). kf owns
 * TIME (this file): the `ScrollScene` driver resolves the live scroller/offset
 * against the DOM, maps it to the [0,1] range, smooths the scrub, settles the
 * snap, fires the enter/leave thresholds. The driver-side dispatch + pin records
 * (the conservative-correct backend choice; the SO-3 `position:sticky` pin
 * synthesis + the SO-4 transform-pin KILL) are stated at {@link
 * dispatchScrollBackend} / {@link pinCSS}, not re-litigated here.
 */

import { clamp } from "../internal/leaves";
import { PHASE_FRACTIONS as SELECTOR_PHASE_FRACTIONS } from "../internal/scroll-phases";
import { decayRest } from "../physics/decay";
import { SmoothProgress } from "../physics/smooth";
import type { SmoothProgressOptions } from "../physics/smooth";
import { SpringProgress } from "../physics/spring";
import type { SpringProgressOptions } from "../physics/spring";
import {
    attachNativeScrollTimeline,
    isWAAPIEligible,
    type NativeScrollAttachment,
} from "../waapi";
import {
    createNativeTimeline,
    type NativeTimelineSpec,
} from "../orchestration/timeline/native";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";
// The driver consumes the value.js scroll-grammar TYPES only (erased under
// verbatimModuleSyntax — no runtime value.js edge; the static edge lives in
// `./grammar`, the SO-1 round-trip half re-exported by the scroll barrel).
import type {
    AnimationRangeValue,
    AnimationTimelineValue,
    CSSTimelineOptions,
    RangeBoundary,
    RangePhase,
} from "@mkbabb/value.js";

// ═══════════════════════════════════════════════════════════════════════════
// The range → [0,1] progress mapping (kf owns TIME — value.js emits offsets
// VERBATIM; the driver resolves them against the scroll position).
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The named phases of a view-progress timeline, in scroll order, each mapping to
 * a fraction of the subject's view-progress range [0,1]. `entry` spans the
 * subject entering the scrollport (0 → ~0.25), `cover` the fully-in-view band,
 * `exit` the subject leaving — the CSS `<timeline-range-name>` semantics, the
 * conventional default placements a driver fills when the author omits an offset
 * (the division-of-labour law: value.js leaves the offset to the driver). These
 * are the DEFAULT fractions for an omitted offset; an explicit `offset` overrides.
 */
// The four selector-valid phase spans (`entry`/`cover`/`contain`/`exit`) are the
// shared `internal/scroll-phases.ts` table (R.W1 — the BOOK duplication with
// `compile/frame-compiler.ts` dissolved); this driver layers the non-selector
// `normal`/`*-crossing` phases on top.
const PHASE_FRACTIONS: Record<RangePhase, { start: number; end: number }> = {
    entry: SELECTOR_PHASE_FRACTIONS.entry!,
    cover: SELECTOR_PHASE_FRACTIONS.cover!,
    contain: SELECTOR_PHASE_FRACTIONS.contain!,
    exit: SELECTOR_PHASE_FRACTIONS.exit!,
    normal: { start: 0, end: 1 },
    "entry-crossing": { start: 0, end: 0.25 },
    "exit-crossing": { start: 0.75, end: 1 },
};

/**
 * Parse a `<length-percentage>` offset token VALUE.js emitted VERBATIM into a
 * [0,1] fraction. A `%` is its own fraction (`"40%"` → 0.4); a bare/`px` length
 * cannot be resolved without the live scroll extent and is left to the caller's
 * `sceneExtent` (returned as `null` so the phase default is used). The driver
 * owns this resolution (TIME) — value.js never pre-resolves it (VALUE).
 */
function offsetToFraction(offset: string | undefined): number | null {
    if (offset == null) return null;
    const trimmed = offset.trim();
    if (trimmed.endsWith("%")) {
        const n = Number.parseFloat(trimmed.slice(0, -1));
        return Number.isFinite(n) ? n / 100 : null;
    }
    // A bare/px length needs the live scroll extent — the driver resolves it
    // from `sceneExtent` at sample time; here it is "not a self-contained
    // fraction", so fall back to the phase default.
    return null;
}

/**
 * Resolve ONE `animation-range` boundary to a [0,1] fraction of the scene's
 * scroll extent. `offset` (if a self-contained `%`) wins; else the phase's
 * default placement; else the supplied fallback (0 for start, 1 for end).
 */
function boundaryFraction(
    boundary: RangeBoundary | undefined,
    fallback: number,
): number {
    if (boundary == null) return fallback;
    const explicit = offsetToFraction(boundary.offset);
    if (explicit != null) {
        // The phase shifts the offset's origin: `entry 50%` is 50% THROUGH the
        // entry band, not 50% of the whole timeline. When a phase is named, the
        // offset is interpreted within the phase's span.
        if (boundary.phase != null && boundary.phase !== "normal") {
            const span = PHASE_FRACTIONS[boundary.phase];
            return span.start + explicit * (span.end - span.start);
        }
        return explicit;
    }
    if (boundary.phase != null) {
        return PHASE_FRACTIONS[boundary.phase].start;
    }
    return fallback;
}

/**
 * The resolved [start,end] scroll-extent fractions for a parsed
 * `animation-range`. The driver maps a raw scroll position `p ∈ [0,1]` over the
 * scene's extent into local progress `(p − start)/(end − start)`, clamped.
 */
export interface ResolvedRange {
    start: number;
    end: number;
}

/**
 * Resolve a parsed `AnimationRangeValue` (or `undefined` → the whole [0,1]
 * timeline) into [start,end] extent fractions. The driver-side fill of the
 * division-of-labour law: value.js emits the phases/offsets verbatim, kf turns
 * them into the TIME mapping.
 */
export function resolveRange(range: AnimationRangeValue | undefined): ResolvedRange {
    if (range == null) return { start: 0, end: 1 };
    const start = boundaryFraction(range.start, 0);
    const end = boundaryFraction(range.end, 1);
    // Guard a degenerate/inverted range — the driver needs a positive span.
    return end > start ? { start, end } : { start: 0, end: 1 };
}

// ═══════════════════════════════════════════════════════════════════════════
// SO-2 — the ScrollScene JS DRIVER (value.js-INDEPENDENT; composes the SHIPPED
// SmoothProgress / decay / SpringProgress / Timeline primitives — invents no
// physics) + the dispatch.
// ═══════════════════════════════════════════════════════════════════════════

/** Which backend a `ScrollScene` dispatched to, and why the JS path was chosen. */
export type ScrollBackend = "native" | "js";

/** The set of enter/leave threshold events the range-derived detector fires. */
export type ScrollSceneEvent = "enter" | "leave";

/** A `.on(event, cb)` subscriber. Receives the local progress at the crossing. */
export type ScrollSceneSubscriber = (progress: number) => void;

/** A `.snap()` snap point — a local progress in [0,1] the scene settles to. */
export type SnapPoints = readonly number[];

export interface ScrollSceneOptions {
    /**
     * The parsed `CSSTimelineOptions` (from {@link parseScrollCSS}) OR a direct
     * spec. The `range` drives the [0,1] mapping; the `timeline` informs the
     * native-vs-JS dispatch (a named/`auto` timeline that the platform can run
     * natively).
     */
    range?: AnimationRangeValue | undefined;
    timeline?: AnimationTimelineValue | undefined;
    /**
     * Scrub smoothing seconds (the damping the native `animation-range` lane
     * LACKS — a STRICT capability of the JS driver). `0`/omitted ⇒ no smoothing
     * (the scrub tracks scroll 1:1). A positive value enables `SmoothProgress`
     * damping. Requesting scrub forces the JS backend (native has no smoother).
     */
    scrub?: number | undefined;
    /**
     * Snap points (local progress in [0,1]) the scene settles to on scroll-idle
     * via `decayRest` + `SpringProgress`. Requesting snap forces the JS backend.
     */
    snap?: SnapPoints | undefined;
    /** Spring config for the snap settle (the PHYS-D snapDecay primitive). */
    snapSpring?: Partial<SpringProgressOptions> | undefined;
    /** Extra SmoothProgress config for the scrub smoother. */
    smoothing?: Partial<SmoothProgressOptions> | undefined;
}

/**
 * The dispatch request — what the caller wants over the parsed scene. The matrix
 * reads these + the target shape to choose native vs JS (the conservative-correct
 * backend choice with a queryable reason).
 */
export interface ScrollDispatchRequest<V extends Vars> {
    /** The animation to drive over the scroll clock. */
    animation?: KeyframesAnimation<V> | undefined;
    /** The native timeline spec (`scroll`/`view`) for the eligible fast lane. */
    nativeSpec?: NativeTimelineSpec | undefined;
    /** True if scrub smoothing was requested (forces JS — native has no smoother). */
    scrub?: boolean | undefined;
    /** True if snap was requested (forces JS — native has no physics snap). */
    snap?: boolean | undefined;
    /** True if scroll velocity / non-DOM driving was requested (forces JS). */
    velocity?: boolean | undefined;
}

/** The dispatch verdict — which backend, and (for JS) the human-readable reason. */
export type ScrollDispatch =
    | { backend: "native"; attachment: NativeScrollAttachment }
    | { backend: "js"; reason: string };

/**
 * SO-1/SO-2 the DISPATCH (conservative-correct, with a queryable reason). The
 * WAAPI-eligibility seam pointed at the scroll clock:
 *
 *   DOM target + WAAPI-eligible + native ScrollTimeline present + NO scrub/snap/
 *   velocity                                                → NATIVE (zero main-thread)
 *   scrub OR snap OR velocity requested                     → JS (native has no smoother/snap)
 *   non-DOM target / no animation                           → JS (the universal driver)
 *   WAAPI-ineligible (computed unit / color / custom curve) → JS (the ineligible set)
 *   native ScrollTimeline ABSENT (Firefox, jsdom, SSR)      → JS (createNativeTimeline → null)
 *
 * The JS path NEVER deletes the native lane and the native path NEVER swallows
 * an ineligible animation — the reason string is the honesty surface (the
 * `waapiIneligibleReason` idiom). This ADDS a tier; it deletes no driver.
 */
export function dispatchScrollBackend<V extends Vars>(
    request: ScrollDispatchRequest<V>,
): ScrollDispatch {
    const { animation, nativeSpec, scrub, snap, velocity } = request;

    // A kf-only capability was requested — the native `animation-range` lane has
    // no smoother (`timeline.ts` pipeline note) and no physics snap, so the JS
    // ScrollScene is the ONLY correct backend.
    if (scrub) {
        return { backend: "js", reason: "scrub smoothing requested (native scroll has no SmoothProgress smoother)" };
    }
    if (snap) {
        return { backend: "js", reason: "physics snap requested (native scroll has no decay/spring settle)" };
    }
    if (velocity) {
        return { backend: "js", reason: "scroll velocity / non-DOM driving requested (JS-only capability)" };
    }

    // No animation or no native spec → the JS driver is the universal fallback
    // (non-DOM targets, plain-object/canvas/WebGL-uniform driving).
    if (animation == null || nativeSpec == null) {
        return { backend: "js", reason: "non-DOM target or no native timeline spec (the universal JS driver)" };
    }

    // The WAAPI-eligibility gate (DOM + default renderer + uniform timing + no
    // computed units + no color interp) — the conservative-correct condition for
    // the compositor fast lane.
    const elig = isWAAPIEligible(animation);
    if (!elig.eligible) {
        return { backend: "js", reason: elig.reason };
    }

    // Feature-detect the native global. createNativeTimeline → null on Firefox-
    // default / jsdom / SSR; the caller keeps the JS sampler.
    if (createNativeTimeline(nativeSpec) == null) {
        return { backend: "js", reason: "native scroll/view timeline unavailable (feature absent)" };
    }

    // Eligible + native present + no kf-only capability → attach NATIVE (zero
    // main-thread sampling), via the SHIPPED bridge.
    const attachment = attachNativeScrollTimeline(animation, nativeSpec);
    if (!attachment.attached) {
        // The bridge re-checked and refused — surface its reason on the JS path.
        return { backend: "js", reason: attachment.reason };
    }
    return { backend: "native", attachment };
}

/**
 * SO-3 the `position:sticky` pin SYNTHESIS — EMIT the pin CSS (kf authors the
 * platform's pin; the browser pins on the compositor). The pin uses
 * `position:sticky`, NEVER `transform:translateY` (SO-4 KILLED — cross-thread
 * jitter). Returns a declaration block string the consumer applies to the
 * pinned element. `top` defaults to `0` (pin to the scrollport top).
 *
 * @example
 * pinCSS()            // → "position: sticky; top: 0px;"
 * pinCSS({ top: 24 }) // → "position: sticky; top: 24px;"
 */
export function pinCSS(opts?: { top?: number; bottom?: number }): string {
    const decls = ["position: sticky;"];
    if (opts?.bottom != null) {
        decls.push(`bottom: ${opts.bottom}px;`);
    } else {
        decls.push(`top: ${opts?.top ?? 0}px;`);
    }
    return decls.join(" ");
}

/**
 * The kf `ScrollScene` JS DRIVER (SO-2). Drives an engine's progress from a raw
 * scroll position through the parsed `animation-range`, composing the SHIPPED
 * primitives:
 *
 *   scrub → `SmoothProgress` damping (the smoothing the native lane lacks)
 *   snap  → `decayRest` (project the idle rest point) + `SpringProgress` settle
 *            (the PHYS-D snapDecay primitive — composes shipped physics, invents none)
 *   enter/leave → the threshold detector DERIVED from the parsed range
 *
 * The caller drives the loop (`scrollProgress(p)` per scroll event); the scene
 * owns no rAF. `progress` is the smoother-damped local progress the engine reads.
 *
 * The driver owns TIME (the live offset resolution); value.js owns VALUES (the
 * parsed phases/offsets). The native lane is NOT deleted — this is the universal
 * fallback the dispatch falls back to.
 */
export class ScrollScene {
    private readonly resolvedRange: ResolvedRange;
    private readonly snapPoints: SnapPoints | undefined;
    private readonly snapSpring: SpringProgress | undefined;
    private readonly scrubSeconds: number;
    private readonly smoother: SmoothProgress | undefined;

    private rawScroll = 0;
    private localProgress = 0;
    private wasInside = false;

    private readonly subscribers = new Map<
        ScrollSceneEvent,
        Set<ScrollSceneSubscriber>
    >([
        ["enter", new Set()],
        ["leave", new Set()],
    ]);

    constructor(options: ScrollSceneOptions = {}) {
        this.resolvedRange = resolveRange(options.range);
        this.scrubSeconds = options.scrub ?? 0;
        this.snapPoints =
            options.snap != null && options.snap.length > 0
                ? options.snap
                : undefined;

        if (this.scrubSeconds > 0) {
            // Scrub smoothing: damping derived from the requested seconds (more
            // seconds → softer damping). The native `animation-range` lane has
            // NO smoother — this is the JS driver's strict capability.
            const damping = clamp(1 / (this.scrubSeconds * 60 + 1), 0.01, 1);
            this.smoother = new SmoothProgress({
                damping,
                clamp: true,
                ...options.smoothing,
            });
        }

        if (this.snapPoints != null) {
            this.snapSpring = new SpringProgress({
                ...options.snapSpring,
            });
        }
    }

    /** The resolved [start,end] scroll-extent fractions for this scene. */
    get range(): ResolvedRange {
        return this.resolvedRange;
    }

    /**
     * Drive the scene from a raw scroll position `p ∈ [0,1]` over the scene's
     * scroll extent (the caller resolves the live scroller; kf maps it to the
     * range). Maps `p` to local progress `(p − start)/(end − start)` clamped,
     * routes it through the scrub smoother (if any), and fires enter/leave at
     * the range boundaries. Returns the (possibly un-smoothed) local progress.
     *
     * The smoother converges over subsequent `.tick(dt)` calls; the immediate
     * return is the smoother's current value (so the first call seeds the
     * target). Consumers driving their own rAF call `.tick(dt)` per frame.
     */
    scrollProgress(p: number): number {
        this.rawScroll = clamp(p, 0, 1);
        const { start, end } = this.resolvedRange;
        const span = end - start;
        const local = span > 0 ? clamp((this.rawScroll - start) / span, 0, 1) : 0;

        const inside = this.rawScroll >= start && this.rawScroll <= end;
        if (inside && !this.wasInside) this.fire("enter", local);
        if (!inside && this.wasInside) this.fire("leave", local);
        this.wasInside = inside;

        if (this.smoother) {
            this.smoother.setTarget(local);
            this.localProgress = this.smoother.current;
        } else {
            this.localProgress = local;
        }
        return this.localProgress;
    }

    /**
     * Advance the scrub smoother by `dt` ms (frame-rate independent). A no-op
     * when no scrub was requested (the progress tracks scroll 1:1). Returns the
     * current smoothed local progress — the engine-write input the driver tracks.
     */
    tick(dt: number): number {
        if (this.smoother) {
            this.smoother.tickDt(dt);
            this.localProgress = this.smoother.current;
        }
        return this.localProgress;
    }

    /** The current local progress (smoother-damped if scrub was requested). */
    get progress(): number {
        return this.localProgress;
    }

    /** True if no scrub smoother, or the smoother has settled. */
    get settled(): boolean {
        return this.smoother == null || this.smoother.settled;
    }

    /**
     * SO-2 `.snap()` — PHYS-D snapDecay. On scroll-idle, project the rest point
     * the current scroll momentum would coast to (`decayRest`), pick the nearest
     * configured snap point, and settle to it via `SpringProgress`. Returns the
     * chosen snap target (local progress), or `null` when no snap points are
     * configured.
     *
     * Composes the SHIPPED `decayRest` (the closed-form projected rest) +
     * `SpringProgress` (the settle) — it invents no physics (the PHYS-A coupled
     * form is KILLED). `velocity` is the release scroll velocity (units/s); `0`
     * snaps from the rest position directly.
     */
    snapTo(velocity = 0): number | null {
        if (this.snapPoints == null || this.snapSpring == null) return null;

        // Project where the current momentum would coast to (decayRest), in the
        // local-progress space, then pick the nearest configured snap point.
        const projected = clamp(
            decayRest({ initial: this.localProgress, velocity }),
            0,
            1,
        );

        let nearest = this.snapPoints[0]!;
        let bestDist = Math.abs(projected - nearest);
        for (const point of this.snapPoints) {
            const d = Math.abs(projected - point);
            if (d < bestDist) {
                bestDist = d;
                nearest = point;
            }
        }

        // Settle to the chosen point via the spring (the snapDecay settle).
        this.snapSpring.reset(this.localProgress, velocity);
        this.snapSpring.target = nearest;
        return nearest;
    }

    /**
     * Advance the snap settle by `dt` ms. Returns the spring's current local
     * progress (and writes it to `progress`), or the unchanged progress when no
     * snap is active. Drive this per frame after `snapTo()` until `settled`.
     */
    tickSnap(dt: number): number {
        if (this.snapSpring && !this.snapSpring.settled) {
            this.snapSpring.tickDt(dt);
            this.localProgress = this.snapSpring.value;
        }
        return this.localProgress;
    }

    /** Subscribe to an enter/leave threshold crossing. Returns an unsubscribe fn. */
    on(event: ScrollSceneEvent, cb: ScrollSceneSubscriber): () => void {
        const set = this.subscribers.get(event)!;
        set.add(cb);
        return () => set.delete(cb);
    }

    private fire(event: ScrollSceneEvent, progress: number): void {
        for (const cb of this.subscribers.get(event)!) cb(progress);
    }
}

/**
 * Construct a `ScrollScene` from a parsed `CSSTimelineOptions` (the SO-1 parse
 * output) OR a direct `ScrollSceneOptions` spec. The CSS-fed construction is the
 * round-trip's driving half (parse → drive); the spec-fed construction is
 * value.js-INDEPENDENT (it needs no grammar — only the physics primitives).
 *
 * @example
 * // CSS-fed (value.js-gated parse → JS driver):
 * const opts = parseScrollCSS(stylesheet);
 * const scene = createScrollScene({ range: opts.range, scrub: 0.2 });
 * // spec-fed (value.js-independent):
 * const scene = createScrollScene({ range: { start: { offset: "0%" }, end: { offset: "100%" } } });
 */
export function createScrollScene(
    spec: ScrollSceneOptions | CSSTimelineOptions = {},
): ScrollScene {
    // A `CSSTimelineOptions` carries `timeline`/`range`/`timelineScope`/`trigger`;
    // a `ScrollSceneOptions` carries `scrub`/`snap`/… — both share `range`, so
    // the merged spec drives the scene. (A plain `CSSTimelineOptions` constructs
    // an un-scrubbed, un-snapped scene that maps the range 1:1.)
    return new ScrollScene(spec as ScrollSceneOptions);
}
