import { onScopeDispose, type Ref } from "vue";
import { decayRest } from "@mkbabb/keyframes.js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useStageGestures — the gesture grammar (Tranche S, design §9). NEW.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * All inputs converge on FOUR verbs the caller wires to the orbit + the commit
 * funnel: `step(dir)`, `centerIndex(i)`, `requestCommit(id)`, and a live
 * drag-follow via `centerIndex`. Nothing else mutates the ring.
 *
 *   • Pointer drag (anywhere on the disk): setPointerCapture; below-slop front
 *     pointerup is a TAP → requestCommit(frontId); past slop, dx maps to a live
 *     slot-follow (round(downIndex − dx/cardWidth)). On release, the flick is
 *     projected with `decayRest(velocity·k)` (LIGHT barrel) → snap to nearest
 *     slot → a flick travels multiple cards and settles like a real turntable.
 *   • Wheel/trackpad: normalize deltaMode; accumulate; every ±120 → step(±1); a
 *     160ms idle timer clears the accumulator; preventDefault (modal overlay).
 *   • Tap flank/rear card: centerIndex(i) (browse). Tap front card: commit.
 *
 * inv ζ: `decayRest` is the LIGHT-barrel projection; the orbit's SpringProgress
 * owns the actual motion. value.js-free (proof:boundary).
 */

const SLOP_PX = 8;
const WHEEL_STEP = 120;
const WHEEL_IDLE_MS = 160;
/** decay friction — a flick coasts a few slots then rests. */
const FLICK_FRICTION = 6;

export interface StageGestureDeps {
    /** The disk element the gestures bind to. */
    diskEl: Ref<HTMLElement | null>;
    /** Live card width in px (for the dx→slot mapping). */
    cardWidthPx: () => number;
    /** The live front index (rounded) the drag anchors from. */
    frontIndex: () => number;
    /** The scene id of a card index (for front-tap commit). */
    idOf: (index: number) => string;
    /** Verbs. */
    step: (dir: number) => void;
    centerIndex: (index: number) => void;
    requestCommit: (id: string) => void;
    /** Called on pointerdown — halts a coast so a tap commits the halted front. */
    grab?: () => void;
    /** Called when the user actually spins (drag/wheel) — dismisses the hint. */
    onSpin?: () => void;
    /** Toggle the document-wide select-suppression seam during a drag. */
    setDragging?: (dragging: boolean) => void;
}

export interface StageGestures {
    attach(): void;
    detach(): void;
    /** True while a pointer drag is in flight (past slop). */
    dragging(): boolean;
}

export function useStageGestures(deps: StageGestureDeps): StageGestures {
    let node: HTMLElement | null = null;

    // pointer drag state
    let pointerId: number | null = null;
    let downX = 0;
    let downIndex = 0;
    let lastX = 0;
    let lastT = 0;
    let velPxPerS = 0;
    let past = false;
    let downOnFront = false;
    let downCardIndex: number | null = null;

    // wheel state
    let wheelAccum = 0;
    let wheelIdle: ReturnType<typeof setTimeout> | null = null;

    function onPointerDown(e: PointerEvent): void {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        pointerId = e.pointerId;
        downX = lastX = e.clientX;
        lastT = e.timeStamp;
        downIndex = deps.frontIndex();
        past = false;
        velPxPerS = 0;
        // capture the tapped card BEFORE setPointerCapture (which redirects all
        // later pointer targets to the disk node — so pointerup can't read it).
        const card = (e.target as HTMLElement | null)?.closest?.(
            "[data-stage-card]",
        ) as HTMLElement | null;
        downOnFront = card?.dataset.front === "true";
        downCardIndex = card?.dataset.index != null ? Number(card.dataset.index) : null;
        // D1.1: halt any coast at grab, then re-anchor downIndex to the halted
        // front so the dx→slot mapping starts from the rested slot.
        deps.grab?.();
        downIndex = deps.frontIndex();
        node?.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: PointerEvent): void {
        if (pointerId !== e.pointerId) return;
        const dx = e.clientX - downX;
        // instantaneous velocity (px/s), smoothed
        const dt = Math.max(1, e.timeStamp - lastT);
        const v = ((e.clientX - lastX) / dt) * 1000;
        velPxPerS = velPxPerS * 0.6 + v * 0.4;
        lastX = e.clientX;
        lastT = e.timeStamp;

        if (!past && Math.abs(dx) < SLOP_PX) return;
        if (!past) {
            past = true;
            deps.setDragging?.(true);
            deps.onSpin?.();
        }
        // live slot-follow: dragging LEFT (dx<0) advances to higher index
        const cw = Math.max(80, deps.cardWidthPx());
        const target = Math.round(downIndex - dx / cw);
        deps.centerIndex(target);
    }

    function onPointerUp(e: PointerEvent): void {
        if (pointerId !== e.pointerId) return;
        node?.releasePointerCapture?.(e.pointerId);
        pointerId = null;
        const wasPast = past;
        past = false;
        deps.setDragging?.(false);

        if (!wasPast) {
            // a tap (below slop). Use the card captured at pointerdown — under
            // setPointerCapture the pointerup target is the disk, not the card.
            if (downCardIndex != null) {
                if (downOnFront) {
                    deps.requestCommit(deps.idOf(downCardIndex));
                } else {
                    deps.centerIndex(downCardIndex);
                }
            }
            downCardIndex = null;
            return;
        }
        downCardIndex = null;

        // flick projection: the drag already slot-followed via centerIndex; on
        // release, project EXTRA coasting slots from the release velocity with
        // decayRest (LIGHT barrel) so a flick travels past the finger and settles
        // like a real turntable. drag-left (velPx<0) → advance to higher index.
        const cw = Math.max(80, deps.cardWidthPx());
        const v0 = -velPxPerS / cw; // slots/s
        const extra = Math.round(
            decayRest({ initial: 0, velocity: v0, friction: FLICK_FRICTION }),
        );
        if (extra !== 0 && isFinite(extra)) {
            deps.centerIndex(deps.frontIndex() + extra);
        }
    }

    function onWheel(e: WheelEvent): void {
        e.preventDefault();
        // normalize deltaMode (0=px, 1=line, 2=page)
        const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1;
        const primary =
            Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        wheelAccum += primary * scale;
        while (Math.abs(wheelAccum) >= WHEEL_STEP) {
            deps.step(Math.sign(wheelAccum));
            deps.onSpin?.();
            wheelAccum -= Math.sign(wheelAccum) * WHEEL_STEP;
        }
        if (wheelIdle) clearTimeout(wheelIdle);
        wheelIdle = setTimeout(() => (wheelAccum = 0), WHEEL_IDLE_MS);
    }

    function attach(): void {
        node = deps.diskEl.value;
        if (!node) return;
        node.addEventListener("pointerdown", onPointerDown);
        node.addEventListener("pointermove", onPointerMove);
        node.addEventListener("pointerup", onPointerUp);
        node.addEventListener("pointercancel", onPointerUp);
        node.addEventListener("wheel", onWheel, { passive: false });
    }
    function detach(): void {
        if (!node) return;
        node.removeEventListener("pointerdown", onPointerDown);
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerup", onPointerUp);
        node.removeEventListener("pointercancel", onPointerUp);
        node.removeEventListener("wheel", onWheel);
        if (wheelIdle) clearTimeout(wheelIdle);
        node = null;
    }

    onScopeDispose(detach);

    return { attach, detach, dragging: () => past };
}
