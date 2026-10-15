// Disjoint pointer/keyboard actuation preserves native button semantics while
// the current published dock collapse can strand its trailing click.

/**
 * S.B7 · S6 (fold row 71 · a12 F2/F3) — the play-toggle actuation core for
 * `TransportDock`, extracted from the SFC so the keyboard/pointer contract is
 * unit-testable (the behavior is DRIVEN, not markup-inspected).
 *
 * NATIVE BUTTON SEMANTICS, mirrored:
 *  · F2 (auto-repeat): Space actuates on keyup (keydown preventDefaults the page
 *    scroll and arms; auto-repeat keydowns are swallowed); Enter actuates on
 *    keydown with `e.repeat` guarded. Never both on raw keydown.
 *  · F3 (press-origin): a `pointerup` actuates only when its `pointerdown`
 *    landed on the SAME control (`click` = down+up on one target), and only for
 *    the primary pointer with button 0.
 *
 * X.KF.W13.b · TD-21 (+r2) + TD-41 — ONE CANCELLATION LAW ACROSS BOTH ARMS.
 * One handler set serves both play mirrors, so the origin must be PER CONTROL,
 * not per closure: a press that began on the expanded Play and released over
 * the collapsed mirror (the faces swap under the pointer) is not a click on
 * either. Every arm records the control it began on (`e.currentTarget`) and
 * actuates only when the completing event arrives on that same control.
 *  · Pointer: the origin is `pointerId → control`. A release over NEITHER
 *    control never reaches these handlers, so a one-shot window `pointerup`/
 *    `pointercancel` listener (registered at press, bubble phase so the control's
 *    own handler runs first) clears the entry — the stale id a persistent mouse
 *    pointerId would otherwise resurrect on a later drag-release is gone.
 *    X.KF.W13X.r4press (ESC-W13X-r4cube-1): that listener also completes the
 *    press whose control MOVED: a release inside the box the origin control had
 *    at `pointerdown` is its click even though another node is under the
 *    pointer now (the idle-collapsed dock expands on the press and slides Play
 *    away). The press is identified by its control, never by the release node.
 *  · Keyboard: `spaceArmed` is the control that armed, not a boolean; a keyup on
 *    another control (focus moved mid-press — an inert swap, the 3600 ms
 *    collapse) does not actuate, and a keyup with no arm (an orphan) never does.
 *  · Blur disarms BOTH arms for the control that lost focus: the pointer entries
 *    that began on it and the Space arm if it holds it — the producer's own
 *    `useLiquidPress` releases on blur/pointerleave for the same reason.
 *
 * The composable owns NO DOM/emit — the SFC passes the crossfade-independent
 * `actuate` (expand dock + emit togglePlay).
 */
interface PlayActuationHandlers {
    onPlayPointerDown(e: PointerEvent): void;
    onPlayPointerUp(e: PointerEvent): void;
    onPlayPointerCancel(e: PointerEvent): void;
    onPlayKeydown(e: KeyboardEvent): void;
    onPlayKeyup(e: KeyboardEvent): void;
    onPlayBlur(e: FocusEvent): void;
}

const isSpace = (key: string): boolean =>
    key === " " || key === "Spacebar" || key === "Space";

/** The control an event arrived on — the per-control identity of an origin. */
const controlOf = (e: Event): EventTarget | null => e.currentTarget ?? null;

const isPrimaryPress = (e: PointerEvent): boolean =>
    e.isPrimary && !(e.button !== 0 && e.pointerType === "mouse");

/** A press's origin: the control it began on, and where that control was. */
interface PressOrigin {
    control: EventTarget | null;
    /** The control's box at `pointerdown` — `null` for a target with no layout. */
    rect: DOMRectReadOnly | null;
}

const contains = (rect: DOMRectReadOnly, e: PointerEvent): boolean =>
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

export function usePlayActuation(actuate: () => void): PlayActuationHandlers {
    // Press-origin: pointerId → the control its `pointerdown` landed on.
    const pressOrigins = new Map<number, PressOrigin>();
    // Keyboard press-origin for Space: the control whose keydown armed it.
    let spaceArmed: { control: EventTarget | null } | null = null;

    /**
     * The gesture's end, seen on the window (bubble phase, so the control's own
     * `pointerup` has already consumed its entry when the release landed on it).
     * An entry still standing means the release reached no Play control:
     *  · `pointerup` inside the box the origin control had at `pointerdown` is
     *    that control's click — the control moved out from under a still pointer
     *    (ESC-W13X-r4cube-1: the press expands the idle-collapsed dock and the
     *    persistent Play slides away, so the release lands on its neighbour).
     *    The press is identified by its control, not by the node under the
     *    pointer at release.
     *  · `pointerup` outside that box is a drag-off, and `pointercancel` is a
     *    cancel: neither actuates; both clear the id (no stale-id resurrection).
     */
    const watchRelease = (pointerId: number) => {
        if (typeof window === "undefined") return;
        const end = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            window.removeEventListener("pointerup", end);
            window.removeEventListener("pointercancel", end);
            const origin = pressOrigins.get(pointerId);
            pressOrigins.delete(pointerId);
            if (e.type === "pointerup" && origin?.rect && contains(origin.rect, e)) actuate();
        };
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
    };

    return {
        onPlayPointerDown(e) {
            if (!isPrimaryPress(e)) return;
            const control = controlOf(e);
            const rect = control instanceof Element ? control.getBoundingClientRect() : null;
            pressOrigins.set(e.pointerId, { control, rect });
            watchRelease(e.pointerId);
        },
        onPlayPointerUp(e) {
            if (!isPrimaryPress(e)) return;
            const origin = pressOrigins.get(e.pointerId);
            if (origin === undefined) return;
            pressOrigins.delete(e.pointerId);
            // Same-control guard: down on one mirror, up on the other, is no click.
            if (origin.control !== controlOf(e)) return;
            actuate();
        },
        onPlayPointerCancel(e) {
            pressOrigins.delete(e.pointerId);
        },
        onPlayKeydown(e) {
            if (e.key === "Enter") {
                if (e.repeat) return;
                e.preventDefault();
                actuate();
            } else if (isSpace(e.key)) {
                e.preventDefault();
                if (!e.repeat) spaceArmed = { control: controlOf(e) };
            }
        },
        onPlayKeyup(e) {
            if (!isSpace(e.key) || spaceArmed === null) return;
            const { control } = spaceArmed;
            spaceArmed = null;
            if (control !== controlOf(e)) return;
            actuate();
        },
        onPlayBlur(e) {
            const control = controlOf(e);
            if (spaceArmed !== null && spaceArmed.control === control) spaceArmed = null;
            for (const [id, origin] of pressOrigins) {
                if (origin.control === control) pressOrigins.delete(id);
            }
        },
    };
}
