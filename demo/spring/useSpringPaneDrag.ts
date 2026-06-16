import { onScopeDispose, watch, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

import { Draggable } from "@src/animation/drag";
import { RAFPlayback } from "@src/animation/playback";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "@composables/gestureSelectSuppression";

/**
 * K.W4 S7 — the spring control panes made DRAGGABLE, dogfooding kf's OWN
 * `Draggable` primitive (`src/animation/drag.ts`, a LIGHT export — the product
 * animates with its own engine, the gestalt move).
 *
 * The ask (live-spring-sequence-mp-verdict.md §5/§7, U-K17's draggable half) was
 * simply UNIMPLEMENTED. This composable attaches a drag HANDLE to a control card
 * and translates the WHOLE card by the pointer delta — a `transform: translate()`
 * the spring follows, so a release flings to rest with C¹-continuous momentum (the
 * `Draggable`'s closed-form fling). Two `Draggable`s compose the 2-D drag (the
 * engine is one-dimensional by design — KISS; the caller owns the composition).
 *
 * The drag is CONTAINED to the work-area cluster: the translate is CLAMPED so the
 * pane's left edge can never leave the viewport (the un-clip half of S7 / clause
 * f's `left ≥ 0` containment) and the gesture TRANSLATES, never resizes (the
 * U-K19 translate-not-resize guard — the card's width/height are invariant).
 */
export interface SpringPaneDragHandle {
    /** Attach the handle element (the drag affordance) + the pane element (the
     *  card that translates). Returns a detach fn. */
    attach: (handleEl: HTMLElement, paneEl: HTMLElement) => () => void;
    /** Reset the translate to the origin (e.g. on a layout/scene reset). */
    reset: () => void;
}

export function useSpringPaneDrag(active?: Ref<boolean>): SpringPaneDragHandle {
    let dragX: Draggable | null = null;
    let dragY: Draggable | null = null;
    let paneEl: HTMLElement | null = null;
    const playback = new RAFPlayback();

    // The committed translate (where the card sits) + the grab origin so a drag
    // is a DELTA from the resting offset, not an absolute pointer position.
    let offsetX = 0;
    let offsetY = 0;
    let grabX = 0;
    let grabY = 0;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let detachHandlers: (() => void) | null = null;

    const applyTransform = (): void => {
        if (!paneEl) return;
        // Clamp so the pane's LEFT edge stays on-screen (clause f containment):
        // a leftward drag can never push the card's origin negative past its
        // laid-out left, and a rightward/vertical drag stays within a sane band.
        const rect = paneEl.getBoundingClientRect();
        // The card's laid-out left without the current transform.
        const laidOutLeft = rect.left - offsetX;
        const minOffsetX = -laidOutLeft + 8; // keep ≥ 8px from the viewport edge
        const maxOffsetX = window.innerWidth - laidOutLeft - rect.width - 8;
        const clampedX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
        paneEl.style.transform = `translate(${clampedX}px, ${offsetY}px)`;
    };

    const reset = (): void => {
        offsetX = 0;
        offsetY = 0;
        if (paneEl) paneEl.style.transform = "";
    };

    const attach = (handleEl: HTMLElement, pane: HTMLElement): (() => void) => {
        paneEl = pane;

        // Two single-axis Draggables — the pointer coordinate IS the spring
        // target; we read `.value` each frame and translate the card by the
        // delta from the grab point. `springOptions` is a stiff, well-damped
        // follow so the card tracks 1:1 then flings to rest on release.
        const springOptions = {
            response: 0.18,
            dampingFraction: 0.9,
        };
        dragX = new Draggable({ axis: "x", springOptions });
        dragY = new Draggable({ axis: "y", springOptions });

        let lastNow = 0;
        let suppressing = false;
        const endSuppression = (): void => {
            if (suppressing) {
                suppressing = false;
                releaseSelectSuppression();
            }
        };
        const onDown = (e: PointerEvent): void => {
            if (active && !active.value) return;
            grabX = e.clientX;
            grabY = e.clientY;
            grabOffsetX = offsetX;
            grabOffsetY = offsetY;
            lastNow = 0;
            // Route through the ONE global select-suppression token (D1) so a
            // pane drag that sweeps the card's own labels selects no text — the
            // same seam every demo drag surface inherits.
            suppressing = true;
            acquireSelectSuppression();
            // Drive the follow/fling loop while a gesture is live. The loop TICKS
            // both Draggables' springs (the Draggable seats the target on
            // pointermove; an external driver advances the closed-form solution)
            // then translates the card by the delta from the grab point.
            playback.loop((now) => {
                const dt = lastNow ? now - lastNow : 0;
                lastNow = now;
                dragX!.spring.tickDt(dt);
                dragY!.spring.tickDt(dt);
                offsetX = grabOffsetX + (dragX!.value - grabX);
                offsetY = grabOffsetY + (dragY!.value - grabY);
                applyTransform();
                // Keep looping while a gesture is live OR a fling is still moving.
                const moving =
                    dragX!.dragging ||
                    dragY!.dragging ||
                    !dragX!.settled ||
                    !dragY!.settled;
                return moving;
            });
        };

        const onUp = (): void => endSuppression();

        // The handle listeners ride vueuse's useEventListener (the demo's single
        // listener seam — proof:brittleness allows no bare addEventListener); each
        // returns a stop fn the detach contract calls (and the composable's scope
        // auto-disposes as a backstop).
        const stopDown = useEventListener(handleEl, "pointerdown", onDown);
        const stopUp = useEventListener(handleEl, "pointerup", onUp);
        const stopCancel = useEventListener(handleEl, "pointercancel", onUp);
        const detachX = dragX.attach(handleEl);
        const detachY = dragY.attach(handleEl);

        detachHandlers = () => {
            stopDown();
            stopUp();
            stopCancel();
            endSuppression();
            detachX();
            detachY();
            playback.stop();
        };
        return detachHandlers;
    };

    // Reset the translate whenever the pane is (re)activated so a re-mount /
    // view switch starts at the laid-out origin.
    if (active) {
        watch(active, (on) => {
            if (on) reset();
        });
    }

    onScopeDispose(() => {
        detachHandlers?.();
        dragX?.dispose();
        dragY?.dispose();
        playback.stop();
    });

    return { attach, reset };
}
