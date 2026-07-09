/**
 * scroll/trigger.ts — S.F4: realize the already-parsed `animation-trigger`
 * grammar as the DISCRETE idle→active→done lifecycle in the JS scroll-scene
 * driver.
 *
 * Split out of `scene.ts` at the natural concern seam (the same R.W2b/S.B4
 * decomposition precedent that carved `grammar.ts` (the VALUE round-trip) and
 * `range.ts` (the [0,1] mapping) off the driver): `scene.ts` owns the CONTINUOUS
 * scrub/snap driver (the `animation-range` → progress lane); THIS module owns the
 * DISCRETE trigger layer (`<trigger-type>` → the play/reverse/reset lifecycle).
 * The barrel reaches it DIRECTLY (mirroring `./range` / `./grammar`) — no
 * scene→trigger relay. `scene.ts` carries the cross-reference comment.
 *
 * ── The VALUE / TIME division-of-labour (held, not re-litigated) ────────────
 * value.js owns VALUES: `parseAnimationTrigger` / `extractTimelineOptions` emit
 * the `AnimationTriggerValue` (`{ type, timeline?, range? }`) VERBATIM — the
 * `<trigger-type>` keyword and the trigger range phases/offsets as-written, no
 * live-DOM resolution. kf owns TIME: this module maps the trigger range to a
 * [0,1] extent (via `./range`) and steps the idle→active→done STATE machine as a
 * raw scroll position crosses it. The grammar is already parsed; F4 wires it to
 * behavior.
 *
 * ── native where the platform ships it, the kf driver everywhere else (r5) ──
 * `animation-trigger` is a Chrome-145 discrete-trigger feature (NOT Baseline).
 * {@link supportsNativeTrigger} FEATURE-DETECTS it via `CSS.supports` — never a
 * UA sniff (the CE-1.0 precedent: the WebKit `linear()` HW-accel hold is a
 * feature-probe, not a browser-name check). Where the browser ships native
 * `animation-trigger` the platform runs the discrete trigger on the compositor;
 * everywhere else (every current browser, jsdom, SSR) this `TriggerScene` IS the
 * realized behavior — the universal cross-browser zero-peer fallback.
 *
 * ── value.js-free at runtime ────────────────────────────────────────────────
 * Like `./range`, this module references the value.js grammar TYPES only (erased
 * under `verbatimModuleSyntax` — `AnimationTriggerValue` / `TriggerType` /
 * `CSSTimelineOptions`); the static value.js edge lives in `./grammar`. That is
 * what lets the browser-actuated `proof:trigger-roundtrip` oracle bundle this
 * driver on its own (value.js-free) and run it in a real page.
 */

import { clamp } from "../internal/leaves";
import { resolveRange } from "./range";
import type { ResolvedRange } from "./range";
import type {
    AnimationTriggerValue,
    CSSTimelineOptions,
    TriggerType,
} from "@mkbabb/value.js";

// ═══════════════════════════════════════════════════════════════════════════
// The discrete trigger lifecycle (SF-4 S1) — the idle→active→done state machine
// the parsed `<trigger-type>` grammar drives.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The three lifecycle states a `<single-animation-trigger>` traverses:
 *   • `idle`   — the timeline has not (yet) triggered the animation.
 *   • `active` — the trigger fired; the animation is playing.
 *   • `done`   — the trigger cycle completed (latched for `once`; transient for
 *                the re-firing types).
 * The canonical `once` lifecycle is `idle → active → done`; the other three
 * types are variations over the SAME vocabulary (§`triggerProgress`).
 */
export type TriggerState = "idle" | "active" | "done";

/** The play direction a trigger cycle runs — `alternate` flips it each entry. */
export type TriggerDirection = "forward" | "backward";

/**
 * Feature-detect native `animation-trigger` — Chrome 145+ ships it; nothing else
 * (yet) does. `CSS.supports` is the FEATURE probe (never a UA sniff — r5 / the
 * CE-1.0 precedent). Returns `false` where `CSS`/`CSS.supports` is absent (SSR,
 * jsdom) OR the property/keyword is unknown, so the caller keeps the kf driver.
 */
export function supportsNativeTrigger(): boolean {
    const css = (
        globalThis as {
            CSS?: { supports?: (property: string, value?: string) => boolean };
        }
    ).CSS;
    if (css == null || typeof css.supports !== "function") return false;
    try {
        // The discrete-trigger longhand OR the shorthand — either lit means the
        // platform runs `animation-trigger` on the compositor.
        return (
            css.supports("animation-trigger-behavior", "once") ||
            css.supports("animation-trigger", "once")
        );
    } catch {
        return false;
    }
}

/**
 * The kf `TriggerScene` — realizes a parsed `AnimationTriggerValue` as the
 * idle→active→done lifecycle over a raw scroll position. The caller drives the
 * loop (`triggerProgress(p)` per scroll event); the scene owns no rAF and no
 * DOM. The four `<trigger-type>`s differ ONLY in their crossing semantics:
 *
 *   • `once`      — fires once. `idle →enter→ active →exit→ done`; `done` LATCHES
 *                   (a re-entry never re-fires). The one-shot reveal.
 *   • `repeat`    — re-fires. `idle →enter→ active →exit→ idle` (RESET — the exit
 *                   returns to the pre-animation state); each re-entry re-plays
 *                   forward, `cycles` incrementing. Never permanently `done`.
 *   • `alternate` — re-fires with a FLIPPED direction. `idle →enter→
 *                   active(forward) →exit→ done →enter→ active(backward) → …`;
 *                   `direction` alternates each entry (the backward semantics).
 *   • `state`     — the play state FOLLOWS presence. `inside ⇒ active`,
 *                   `outside ⇒ done` (after the first entry) — the playhead is
 *                   HELD across the boundary (pause/resume, NOT reset).
 *
 * The `playhead` (0..1) is the animation's own progress the consumer writes to
 * an engine; it advances with the within-range fraction while `active`. The gate
 * asserts the STATE sequence (scrub-based, C-10 — never a frame/ms threshold).
 */
export class TriggerScene {
    /** The parsed `<trigger-type>` (CSS initial value is `once`). */
    readonly type: TriggerType;

    private readonly triggerRange: ResolvedRange;

    private _state: TriggerState = "idle";
    private _direction: TriggerDirection = "forward";
    private _playhead = 0;
    private _cycles = 0;
    private wasInside = false;
    private everEntered = false;

    constructor(trigger: AnimationTriggerValue = {}) {
        this.type = trigger.type ?? "once";
        // The trigger range → [0,1] extent (the whole timeline when omitted) —
        // the SAME `./range` mapping the scrub lane uses (kf owns TIME).
        this.triggerRange = resolveRange(trigger.range);
    }

    /** The current lifecycle state. */
    get state(): TriggerState {
        return this._state;
    }

    /** The current play direction (`alternate` flips it each entry). */
    get direction(): TriggerDirection {
        return this._direction;
    }

    /** The animation's own progress (0..1) — the engine-write the driver tracks. */
    get playhead(): number {
        return this._playhead;
    }

    /** How many times the trigger has fired (entered `active` from idle/done). */
    get cycles(): number {
        return this._cycles;
    }

    /** The resolved [start,end] scroll-extent fractions of the trigger range. */
    get range(): ResolvedRange {
        return this.triggerRange;
    }

    /**
     * True when the platform will run this trigger NATIVELY (Chrome 145+). The
     * dispatch is the caller's: `usesNative` ⇒ author a native `animation-trigger`
     * declaration; else drive THIS scene. Feature-detected, never UA-sniffed.
     */
    get usesNative(): boolean {
        return supportsNativeTrigger();
    }

    /**
     * Drive the trigger from a raw scroll position `p ∈ [0,1]` (the caller
     * resolves the live scroller; kf maps it over the trigger range). Advances
     * the idle→active→done state machine per the `<trigger-type>` semantics and
     * returns the new state.
     */
    triggerProgress(p: number): TriggerState {
        const clamped = clamp(p, 0, 1);
        const { start, end } = this.triggerRange;
        const span = end - start;
        const local = span > 0 ? clamp((clamped - start) / span, 0, 1) : 0;

        const inside = clamped >= start && clamped <= end;
        const entering = inside && !this.wasInside;
        const exiting = !inside && this.wasInside;
        const exitForward = exiting && clamped > end;

        switch (this.type) {
            case "repeat":
                this.stepRepeat(inside, entering, exiting, local);
                break;
            case "alternate":
                this.stepAlternate(inside, entering, exiting, local);
                break;
            case "state":
                this.stepState(inside, local);
                break;
            case "once":
            default:
                this.stepOnce(entering, exitForward, local);
                break;
        }

        this.wasInside = inside;
        return this._state;
    }

    /** Rewind the lifecycle to `idle` (re-arm a `once`/`state` scene). */
    reset(): void {
        this._state = "idle";
        this._direction = "forward";
        this._playhead = 0;
        this._cycles = 0;
        this.wasInside = false;
        this.everEntered = false;
    }

    // ── the four `<trigger-type>` steppers ──────────────────────────────────

    /** `once` — fire once, then LATCH `done` (a re-entry never re-fires). */
    private stepOnce(entering: boolean, exitForward: boolean, local: number): void {
        if (this._state === "done") return; // one-shot latch
        if (entering && this._state === "idle") {
            this._state = "active";
            this._direction = "forward";
            this._cycles = 1;
        }
        if (this._state === "active") {
            this._playhead = local;
            if (exitForward) {
                this._state = "done";
                this._playhead = 1;
            }
            // A backward exit does NOT reset — `once` keeps its fired latch.
        }
    }

    /** `repeat` — RESET to `idle` on exit; each re-entry re-plays forward. */
    private stepRepeat(
        inside: boolean,
        entering: boolean,
        exiting: boolean,
        local: number,
    ): void {
        if (entering) {
            this._state = "active";
            this._direction = "forward";
            this._cycles += 1;
            this._playhead = local;
        } else if (exiting) {
            this._state = "idle"; // reset — re-triggerable
            this._playhead = 0;
        } else if (inside) {
            this._playhead = local;
        }
    }

    /** `alternate` — exit `done`; each re-entry FLIPS the play direction. */
    private stepAlternate(
        inside: boolean,
        entering: boolean,
        exiting: boolean,
        local: number,
    ): void {
        if (entering) {
            this._direction = this._cycles % 2 === 0 ? "forward" : "backward";
            this._state = "active";
            this._cycles += 1;
            this._playhead = this.directedPlayhead(local);
        } else if (exiting) {
            this._state = "done"; // transient — the next entry flips + re-fires
        } else if (inside) {
            this._playhead = this.directedPlayhead(local);
        }
    }

    /** `state` — play state FOLLOWS presence; the playhead is HELD across exits. */
    private stepState(inside: boolean, local: number): void {
        if (inside) {
            this._state = "active";
            this._direction = "forward";
            this._playhead = local;
            this.everEntered = true;
        } else {
            // Outside: paused. `done` once entered, else still `idle`. The
            // playhead is NOT reset — a re-entry resumes from where it paused.
            this._state = this.everEntered ? "done" : "idle";
        }
    }

    private directedPlayhead(local: number): number {
        return this._direction === "forward" ? local : 1 - local;
    }
}

/**
 * Construct a `TriggerScene` from a parsed `AnimationTriggerValue` OR a full
 * `CSSTimelineOptions` (the {@link parseScrollCSS} output — the `.trigger` field
 * is used). The CSS-fed construction is the round-trip's driving half (parse →
 * behavior); the value-fed construction is value.js-INDEPENDENT.
 *
 * @example
 * // grammar → behavior (the round-trip):
 * const opts = parseScrollCSS(stylesheet);      // { …, trigger: { type: "repeat", range } }
 * const scene = createTriggerScene(opts);
 * scene.triggerProgress(0.5);                    // → "active"
 */
export function createTriggerScene(
    spec: AnimationTriggerValue | CSSTimelineOptions = {},
): TriggerScene {
    // A `CSSTimelineOptions` carries the trigger nested under `.trigger`; an
    // `AnimationTriggerValue` carries `.type` at the top. Prefer the nested
    // parse output when present, else treat the spec AS the trigger value.
    const trigger =
        "trigger" in spec && spec.trigger != null
            ? spec.trigger
            : (spec as AnimationTriggerValue);
    return new TriggerScene(trigger);
}
