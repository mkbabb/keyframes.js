// GLASSUI-GAP: dockStrandKeepalive — usePlayActuation re-implements native button
// click semantics from disjoint pointerup/keydown sources ONLY because glass-ui's
// dock has no collapse-crossfade keepalive (GU-4); the consumed dist drops the
// trailing click. It collapses to a plain click handler on the re-pin;
// proof:glass-ui-gap-tripwire flips RED the instant glassCaps.dockStrandKeepalive
// is satisfied while this file survives. See demo/glass-ui-gaps.ts (the TransportDock
// SFC carries the load-bearing glassUiGap import).

/**
 * S.B7 · S6 (fold row 71 · a12 F2/F3) — the play-toggle actuation core for
 * `TransportDock`, extracted from the SFC so the keyboard/pointer contract is
 * unit-testable (vitest carries no Vue-SFC plugin; the behavior is DRIVEN, not
 * markup-inspected — the useToolbarKeyboard precedent).
 *
 * TWO DEFECTS THE DM-1 CONTINGENCY KILL reintroduced when it excised the native
 * `click` path (25b3a13):
 *
 *  · F2 (auto-repeat): actuating on RAW `keydown` for Space/Enter means holding
 *    the key rapid-TOGGLES play at the OS key-repeat rate (each auto-repeat
 *    `keydown` re-fires). Native buttons fire Space on *keyup* (once per press)
 *    precisely to avoid this. FIX: mirror native semantics — Space actuates on
 *    keyup (keydown only preventDefaults the page-scroll + arms), Enter actuates
 *    on keydown but guards `e.repeat`. Never both on raw keydown.
 *
 *  · F3 (press-origin): actuating on ANY `pointerup` over the button — even when
 *    the press began elsewhere and the pointer was dragged onto it (a timeline-
 *    diamond drag released over the play pill, a stray body drag) — is not click
 *    semantics (`click` = down+up on the SAME target). FIX: gate `pointerup` on a
 *    `pointerdown`-on-this-control flag (the de-dupe the KILL threw out) + require
 *    `e.isPrimary` (no secondary-touch toggle in a multi-touch gesture).
 *
 * The composable owns NO DOM/emit — the SFC passes the crossfade-independent
 * `actuate` (expand dock + emit togglePlay); the two modality-pure sources stay
 * mutually exclusive per activation, so no cross-source de-dupe is needed.
 */
interface PlayActuationHandlers {
    onPlayPointerDown(e: PointerEvent): void;
    onPlayPointerUp(e: PointerEvent): void;
    onPlayPointerCancel(e: PointerEvent): void;
    onPlayKeydown(e: KeyboardEvent): void;
    onPlayKeyup(e: KeyboardEvent): void;
}

const isSpace = (key: string): boolean =>
    key === " " || key === "Spacebar" || key === "Space";

export function usePlayActuation(actuate: () => void): PlayActuationHandlers {
    // Press-origin: the pointer ids whose `pointerdown` landed on a play control.
    // A `pointerup` actuates ONLY if its id is here (down+up on the same control).
    const pressedPointers = new Set<number>();
    // Keyboard press-origin for Space: keydown arms, keyup actuates once.
    let spaceArmed = false;

    return {
        onPlayPointerDown(e) {
            if (!e.isPrimary) return;
            // Ignore right/middle mouse; touch/pen have button 0.
            if (e.button !== 0 && e.pointerType === "mouse") return;
            pressedPointers.add(e.pointerId);
        },
        onPlayPointerUp(e) {
            if (!e.isPrimary) return;
            if (e.button !== 0 && e.pointerType === "mouse") return;
            // Press-origin guard: only a press that STARTED on this control
            // toggles — a drag-release from elsewhere does not.
            if (!pressedPointers.delete(e.pointerId)) return;
            actuate();
        },
        onPlayPointerCancel(e) {
            pressedPointers.delete(e.pointerId);
        },
        onPlayKeydown(e) {
            if (e.key === "Enter") {
                // Native Enter actuates on keydown — but the auto-repeat stream
                // must NOT re-toggle.
                if (e.repeat) return;
                e.preventDefault();
                actuate();
            } else if (isSpace(e.key)) {
                // Space actuates on keyup (native): here only stop the page scroll
                // and arm the press; auto-repeat keydowns are swallowed.
                e.preventDefault();
                if (!e.repeat) spaceArmed = true;
            }
        },
        onPlayKeyup(e) {
            if (isSpace(e.key) && spaceArmed) {
                spaceArmed = false;
                actuate();
            }
        },
    };
}
