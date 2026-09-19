import { onScopeDispose, ref, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "@utils/gestureSelectSuppression";

/**
 * useDragScrub — the ONE pointer-drag scrub seam the stage scenes share
 * (H.W12.S1 / I8; the W5-BOOKed extraction, RE-OPENed now over its 3-consumer
 * MEASURE-FIRST threshold — `H.W5.md:66`).
 *
 * Spring's `positionFromEvent` and Sequence's master-scrub `progressFromEvent`
 * were hand-rolled copies of the SAME dance: pointer-capture on `pointerdown` +
 * window `pointermove`/`pointerup` + a `project(e) → ratio` read. They collapse
 * to THIS composable; each scene supplies ONLY its `project` (a rect-ratio for
 * the rails, a two-axis normalisation for the square). Its live consumers,
 * measured: `SquareScene`, `SpringTarget`, `SequenceScrubber`, and the ONE
 * shared instance behind `SequenceTarget`'s five row handles.
 *
 * The capture target is `el` (the rail / traveller / handle). vueuse owns the
 * window-listener lifecycle: the move/up/cancel handlers are registered ONCE, in
 * THIS composable's own effect scope (so the scope disposes them), and
 * early-return unless the sample belongs to the gesture in flight — one honest
 * registration, no add/remove bookkeeping that can leak on a mid-drag unmount.
 * `project` is pure (the scene's geometry); `onScrub` applies the projected
 * value. `onStart`/`onEnd` are the optional pause-for-gesture /
 * resume-on-release hooks: the sequence scrubber sets BOTH (they light and cool
 * the instrument's scrubbing well), the square sets `onStart`, the spring rail
 * sets neither.
 *
 * I.W4 D1 — THE GESTURE-IN-FLIGHT AUTHORITY (the gestalt single-seam). This
 * composable is one of the two things in the demo that know "a drag is live"
 * (`useDragCapture` is the other), so it owns the global select-suppression
 * token: on `onPointerDown` it sets `body.is-dragging` (whose rule
 * `body.is-dragging * { user-select: none }` lives in design-idioms.css) and
 * clears it on `pointerup`/`pointercancel`. Every drag surface that routes
 * through this seam (square, spring rail, sequence scrub, sequence rows)
 * INHERITS select-suppression for free — the pointer sweeps the chrome (dock +
 * control labels) without highlighting it (closes B6-a for ALL drags, not just
 * square).
 *
 * X.KF.W11.i — THE GUARD FAMILY (KF-SCR-1 + L·D-1, spec'd with KF-AV-15 across
 * BOTH demo drag seams; `useDragCapture` carries the identical family). Three
 * parts, one cure:
 *
 *   (1) THE RE-ENTRANCY GUARD. A second pointer arriving on a live gesture is
 *       not a second gesture. Admitting it acquired the shared token a second
 *       time against a SINGLE release, pinning `activeGestureCount ≥ 1` and
 *       stranding `user-select: none` on the document for the rest of the
 *       session — non-self-healing, and reachable by an ordinary two-finger
 *       touch or pinch on a rail that permits pinch.
 *   (2) THE POINTER LATCH. The seam remembers the `pointerId` that opened the
 *       gesture and admits samples from that pointer alone: a second pointer's
 *       `pointermove` is no longer projected onto the first pointer's subject,
 *       and its `pointerup` no longer ends a gesture it never started.
 *   (3) THE SCOPE-DISPOSAL RELEASE. A mid-drag unmount takes the window
 *       listeners with the scope, so the gesture's own `pointerup` never
 *       arrives and the ONLY release path dies with it. The token is
 *       document-wide and outlives this scope, so the scope returns it.
 *
 * The prose this replaces asserted the opposite — "Nesting-safe: a small
 * reference count guards against two concurrent gestures clearing the token
 * early." The reference count is real and correct; what was absent was any
 * guard on its CALLERS, so two gestures acquired twice against one release.
 *
 * I.W4 D2 — `releasePolicy` makes "persist vs recenter on release" a DECLARED
 * choice on the seam (closes B6-b). `"persist"` (the default) leaves the dragged
 * value in place on release; `"recenter"` fires `onRelease` so the scene can
 * re-seat home. Square declares `"persist"` rather than burying a `reseat(0,0)`
 * in its `pointerup`.
 */
/**
 * The release policy (I.W4 D2). `"persist"` (default) leaves the dragged value
 * where released — the spring chases-to-rest at the dragged target and the box
 * stays put. `"recenter"` fires `onRelease` so the scene can re-seat home on
 * release.
 */
type ReleasePolicy = "persist" | "recenter";

interface UseDragScrubOptions<T = number> {
    /** The element that captures the pointer for the gesture (the rail / handle). */
    el: Ref<HTMLElement | null>;
    /**
     * Project a pointer event onto the scene's scrub value. PURE — the scene's
     * own geometry: a rect-ratio for a rail (`(clientX - left) / width`), the
     * nearest-point-on-path length ratio for MotionPath. Returns the value
     * `onScrub` will receive (typically a `[0,1]` ratio; the projector owns any
     * clamp the geometry needs).
     */
    project: (e: PointerEvent) => T;
    /** Apply a projected value (re-seat the spring target / scrub the playhead). */
    onScrub: (value: T) => void;
    /** Fired once on pointer-down, AFTER capture, BEFORE the first `onScrub`. */
    onStart?: (e: PointerEvent) => void;
    /** Fired once on pointer-up, when a live drag ends. */
    onEnd?: (e: PointerEvent) => void;
    /**
     * I.W4 D2 — the release policy. Defaults to `"persist"` (leave the dragged
     * value in place — the spring/MotionPath posture). `"recenter"` fires
     * `onRelease` on pointer-up so the scene returns home.
     */
    releasePolicy?: ReleasePolicy;
    /**
     * Fired on pointer-up ONLY when `releasePolicy === "recenter"` — the scene's
     * "return home" verb (e.g. `reseat(0,0)`). Under `"persist"` it is never
     * called (the dragged value stays). Runs after `onEnd`.
     */
    onRelease?: () => void;
}

interface UseDragScrub {
    /** True while a drag gesture is in flight (drives the `--dragging` affordance). */
    dragging: Ref<boolean>;
    /** Attach to the capture element's `@pointerdown`. */
    onPointerDown: (e: PointerEvent) => void;
}

export function useDragScrub<T = number>(
    options: UseDragScrubOptions<T>,
): UseDragScrub {
    const { el, project, onScrub, onStart, onEnd, onRelease } = options;
    const releasePolicy: ReleasePolicy = options.releasePolicy ?? "persist";

    const dragging = ref(false);
    /**
     * THE POINTER LATCH (part 2). The id of the pointer that opened the gesture,
     * or `null` when the seam is idle. It is the seam's single admission test —
     * for a second `pointerdown`, for every sample, and for every release.
     */
    let activePointerId: number | null = null;

    /** Is this event the gesture's own pointer? The seam's one admission test. */
    const isActivePointer = (e: PointerEvent) => e.pointerId === activePointerId;

    const endGesture = (e: PointerEvent) => {
        activePointerId = null;
        dragging.value = false;
        // Clear the global select-suppression token (D1) before the scene's own
        // release hooks, so the chrome is selectable again the instant the drag
        // ends regardless of what the hooks do.
        releaseSelectSuppression();
        onEnd?.(e);
        // D2 — only a "recenter" policy fires the scene's return-home verb; under
        // "persist" the dragged value stays exactly where released.
        if (releasePolicy === "recenter") onRelease?.();
    };

    const onPointerDown = (e: PointerEvent) => {
        // THE RE-ENTRANCY GUARD (part 1). One gesture at a time: a second
        // pointer on a live drag acquires nothing, latches nothing and projects
        // nothing. Admitting it is what strands the document-wide token.
        if (activePointerId !== null) return;
        activePointerId = e.pointerId;
        dragging.value = true;
        // D1 — set the global select-suppression token FIRST, so the very first
        // pointermove that sweeps the chrome cannot start a text selection.
        acquireSelectSuppression();
        // setPointerCapture can throw on iOS / synthetic pointers — the drag
        // still works via the window listeners, so swallow it.
        try {
            el.value?.setPointerCapture(e.pointerId);
        } catch {
            /* KEEP: capture unavailable — window listeners still drive the drag */
        }
        onStart?.(e);
        onScrub(project(e));
    };

    // vueuse owns the listener lifecycle: registered HERE, in the composable's
    // own effect scope, so the scope disposes them. The handlers early-return
    // unless the sample belongs to the gesture in flight — one honest
    // registration, no add/remove bookkeeping that can leak on a mid-drag
    // unmount.
    useEventListener(window, "pointermove", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        onScrub(project(e));
    });

    useEventListener(window, "pointerup", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        endGesture(e);
    });

    // pointercancel (OS gesture takeover, contextmenu, etc.) must ALSO clear the
    // token — otherwise a cancelled gesture would strand `body.is-dragging` and
    // freeze selection globally. The same end path runs.
    useEventListener(window, "pointercancel", (e: PointerEvent) => {
        if (!isActivePointer(e)) return;
        endGesture(e);
    });

    // THE SCOPE-DISPOSAL RELEASE (part 3). The listeners above die with this
    // scope, so a gesture still in flight at unmount would never see its own
    // `pointerup` and the token would stay held for the session. The scene's
    // hooks are NOT run — the scene is going away; the token is not, so the
    // token is what the scope returns.
    onScopeDispose(() => {
        if (activePointerId === null) return;
        activePointerId = null;
        dragging.value = false;
        releaseSelectSuppression();
    });

    return { dragging, onPointerDown };
}
