import { type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

/**
 * useDoubleTap — the ONE reliable-primitive double-tap recognizer the demo shares
 * for its "double-click delight" affordances (spring derby, cube roll, amiga
 * boing, square tumble, …) (S.G3 S2).
 *
 * WHY NOT native `dblclick`. The scenes' signature eggs were wired to the native
 * `@dblclick` event, which is a DESKTOP-mouse construct: mobile browsers do not
 * synthesize a reliable `dblclick` from two taps (Safari/iOS in particular gates
 * it behind the 350ms tap-delay + suppresses it after a `touchstart` that scrolls
 * or double-taps-to-zoom), so on touch the delight was simply UNREACHABLE. This
 * recognizer is POINTER-based: it counts two genuine `pointerup`s on the same
 * surface within a 300ms window (spring.md:193's pinned figure) and fires the
 * gesture — so the SAME code path serves mouse, pen, and touch, and the gate can
 * browser-actuate it via two real down+up pairs (never native `dblclick`
 * synthesis, which is what the manifest gate refuses — SG-8).
 *
 * DRAG-DISJOINT. Every double-tap surface here ALSO carries a drag (the spring
 * rail scrubs, the square box moves). A pointer sequence that MOVES past
 * `moveTolerance` is a drag, not a tap — it never counts toward the double, and it
 * RESETS the pending single (so a drag between two taps cannot be laundered into a
 * double-tap). The two seams coexist on one element without fighting.
 */
export interface UseDoubleTapOptions {
    /** The surface the double-tap is recognized on (the rail / box / canvas). */
    el: Ref<HTMLElement | null>;
    /** Fired when two taps land on `el` within `windowMs` with no drag between. */
    onDoubleTap: (e: PointerEvent) => void;
    /**
     * The double-tap window (ms). Defaults to 300 (spring.md:193 — the pinned
     * human double-tap figure; also the value the manifest gate actuates within).
     */
    windowMs?: number;
    /**
     * Movement (px) beyond which a pointer down→up is a DRAG, not a tap. Defaults
     * to 12 (a comfortable touch slop — a real tap wobbles a few px, a scrub moves
     * far more).
     */
    moveTolerance?: number;
}

export function useDoubleTap(opts: UseDoubleTapOptions): void {
    const windowMs = opts.windowMs ?? 300;
    const tol = opts.moveTolerance ?? 12;
    const { el } = opts;

    // The pending single-tap timestamp (0 = no pending tap). Per-pointer tracking
    // is unnecessary — a double-tap is one finger tapping twice; a second finger
    // mid-window is not a double-tap and simply re-seats the pending single.
    let lastTapAt = 0;
    let downX = 0;
    let downY = 0;
    let moved = false;

    const now = (e: PointerEvent) => e.timeStamp || performance.now();

    useEventListener(el, "pointerdown", (e: PointerEvent) => {
        downX = e.clientX;
        downY = e.clientY;
        moved = false;
    });

    useEventListener(el, "pointermove", (e: PointerEvent) => {
        if (moved) return;
        if (Math.hypot(e.clientX - downX, e.clientY - downY) > tol) moved = true;
    });

    useEventListener(el, "pointerup", (e: PointerEvent) => {
        // A drag ends the tap chain — it is a scrub, never (half of) a double-tap.
        if (moved) {
            lastTapAt = 0;
            return;
        }
        const t = now(e);
        if (lastTapAt !== 0 && t - lastTapAt <= windowMs) {
            lastTapAt = 0;
            opts.onDoubleTap(e);
        } else {
            lastTapAt = t;
        }
    });
}
