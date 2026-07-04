/**
 * test/transport-play-actuation.test.ts — the S.B7 (fold row 71, T8) companion to
 * KfPillTabs.test.ts: the TransportDock play-toggle actuation contract.
 *
 * The DM-1 CONTINGENCY KILL excised the native `click` path and reintroduced two
 * platform-native-semantics regressions (a12 F2/F3):
 *   · F2 — actuating on RAW keydown rapid-TOGGLES play while Space/Enter is held
 *     (each OS auto-repeat keydown re-fires); and
 *   · F3 — actuating on ANY pointerup over the button toggles on a drag-release
 *     that began elsewhere (no press-origin, no isPrimary guard).
 *
 * This drives `usePlayActuation` (the extracted, testable core TransportDock.vue
 * wires) and asserts native semantics: Space on keyup (once per press, repeat-
 * swallowed), Enter on keydown (repeat-guarded), and pointerup gated on a
 * pointerdown-on-this-control press-origin + isPrimary.
 */
import { describe, expect, it, vi } from "vitest";
import { usePlayActuation } from "@components/custom/animation-transport/composables/usePlayActuation";

const pointer = (over: Partial<PointerEvent> = {}): PointerEvent =>
    ({
        isPrimary: true,
        button: 0,
        pointerType: "mouse",
        pointerId: 1,
        ...over,
    }) as unknown as PointerEvent;

const keyev = (key: string, repeat = false): KeyboardEvent =>
    ({ key, repeat, preventDefault: vi.fn() }) as unknown as KeyboardEvent;

describe("usePlayActuation — keyboard (a12 F2: auto-repeat)", () => {
    it("Space actuates ONCE on keyup, never on keydown (repeat swallowed)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayKeydown(keyev(" ")); // arms, does NOT actuate
        h.onPlayKeydown(keyev(" ", true)); // OS auto-repeat — swallowed
        h.onPlayKeydown(keyev(" ", true));
        expect(actuate).not.toHaveBeenCalled();
        h.onPlayKeyup(keyev(" "));
        expect(actuate).toHaveBeenCalledOnce();
    });

    it("Space keydown preventDefaults the page scroll", () => {
        const h = usePlayActuation(vi.fn());
        const e = keyev(" ");
        h.onPlayKeydown(e);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it("Enter actuates on keydown but guards auto-repeat", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayKeydown(keyev("Enter"));
        h.onPlayKeydown(keyev("Enter", true)); // repeat — swallowed
        h.onPlayKeydown(keyev("Enter", true));
        expect(actuate).toHaveBeenCalledOnce();
    });

    it("a Space keyup with no prior keydown does not actuate", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayKeyup(keyev(" ")); // arrived mid-press (focus moved onto us)
        expect(actuate).not.toHaveBeenCalled();
    });
});

describe("usePlayActuation — pointer (a12 F3: press-origin)", () => {
    it("actuates on down+up on the SAME control", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointer({ pointerId: 7 }));
        h.onPlayPointerUp(pointer({ pointerId: 7 }));
        expect(actuate).toHaveBeenCalledOnce();
    });

    it("a pointerup whose press began elsewhere does NOT actuate", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        // No matching pointerdown — a drag started on the timeline diamond and
        // released over the play pill.
        h.onPlayPointerUp(pointer({ pointerId: 9 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("ignores a non-primary pointer (multi-touch secondary)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointer({ pointerId: 2, isPrimary: false }));
        h.onPlayPointerUp(pointer({ pointerId: 2, isPrimary: false }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("ignores a right/middle mouse button", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointer({ button: 2 }));
        h.onPlayPointerUp(pointer({ button: 2 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("pointercancel clears the press-origin (a canceled drag never toggles)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointer({ pointerId: 3 }));
        h.onPlayPointerCancel(pointer({ pointerId: 3 }));
        h.onPlayPointerUp(pointer({ pointerId: 3 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("does not double-fire: one press = one actuation", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointer({ pointerId: 5 }));
        h.onPlayPointerUp(pointer({ pointerId: 5 }));
        h.onPlayPointerUp(pointer({ pointerId: 5 })); // stray second up — no id now
        expect(actuate).toHaveBeenCalledOnce();
    });
});
