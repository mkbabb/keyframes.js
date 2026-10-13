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

export function usePlayActuation(actuate: () => void): PlayActuationHandlers {
    // Press-origin: pointerId → the control its `pointerdown` landed on.
    const pressOrigins = new Map<number, EventTarget | null>();
    // Keyboard press-origin for Space: the control whose keydown armed it.
    let spaceArmed: { control: EventTarget | null } | null = null;

    /** Release-elsewhere cleanup: clear `pointerId` when the gesture ends anywhere. */
    const watchRelease = (pointerId: number) => {
        if (typeof window === "undefined") return;
        const clear = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            pressOrigins.delete(pointerId);
            window.removeEventListener("pointerup", clear);
            window.removeEventListener("pointercancel", clear);
        };
        window.addEventListener("pointerup", clear);
        window.addEventListener("pointercancel", clear);
    };

    return {
        onPlayPointerDown(e) {
            if (!isPrimaryPress(e)) return;
            pressOrigins.set(e.pointerId, controlOf(e));
            watchRelease(e.pointerId);
        },
        onPlayPointerUp(e) {
            if (!isPrimaryPress(e)) return;
            if (!pressOrigins.has(e.pointerId)) return;
            const origin = pressOrigins.get(e.pointerId);
            pressOrigins.delete(e.pointerId);
            // Same-control guard: down on one mirror, up on the other, is no click.
            if (origin !== controlOf(e)) return;
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
                if (origin === control) pressOrigins.delete(id);
            }
        },
    };
}
