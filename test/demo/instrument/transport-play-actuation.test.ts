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
import { usePlayActuation } from "@components/instrument/transport/TransportDock/usePlayActuation";

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

// ── X.KF.W13.b · TD-21 (+r2 rider) + TD-41 — ONE cancellation law across both
// arms: per-control origin, release-elsewhere cleanup, blur disarm. The two
// mirrors share ONE handler set, so each case names the control an event
// arrived on via `currentTarget` (what Vue binds `$event.currentTarget` to). ──
const control = (name: string): EventTarget => ({ name }) as unknown as EventTarget;

const pointerOn = (
    currentTarget: EventTarget,
    over: Partial<PointerEvent> = {},
): PointerEvent =>
    ({
        isPrimary: true,
        button: 0,
        pointerType: "mouse",
        pointerId: 1,
        currentTarget,
        ...over,
    }) as unknown as PointerEvent;

const keyOn = (currentTarget: EventTarget, key: string, repeat = false): KeyboardEvent =>
    ({ key, repeat, currentTarget, preventDefault: vi.fn() }) as unknown as KeyboardEvent;

const blurOn = (currentTarget: EventTarget): FocusEvent =>
    ({ currentTarget }) as unknown as FocusEvent;

describe("usePlayActuation — cancellation law (TD-21 + TD-41)", () => {
    const expanded = control("expanded-play");
    const mirror = control("collapsed-mirror");

    it("per-control origin: down on one mirror, up on the OTHER is no click (the faces swapped under the pointer)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointerOn(expanded, { pointerId: 4 }));
        h.onPlayPointerUp(pointerOn(mirror, { pointerId: 4 }));
        expect(actuate).not.toHaveBeenCalled();
        // …and the origin is consumed: a later stray up on the origin does not resurrect it.
        h.onPlayPointerUp(pointerOn(expanded, { pointerId: 4 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("stale-id: a release over NEITHER control clears the origin, so a later drag-release onto the control never actuates (no stale-id resurrection)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointerOn(expanded, { pointerId: 1 }));
        // The mouse is released over the stage: no mirror sees a pointerup, the
        // window does. A persistent mouse pointerId (1) would otherwise keep the
        // entry alive for the next gesture.
        window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, bubbles: true }));
        // A drag that began on the timeline diamond and released over Play:
        h.onPlayPointerUp(pointerOn(expanded, { pointerId: 1 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("release-elsewhere cleanup also covers pointercancel raised on the window", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointerOn(mirror, { pointerId: 6 }));
        window.dispatchEvent(new PointerEvent("pointercancel", { pointerId: 6, bubbles: true }));
        h.onPlayPointerUp(pointerOn(mirror, { pointerId: 6 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("blur mid-press disarms the Space arm for the control that lost focus (an inert swap / the collapse timer)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayKeydown(keyOn(expanded, " ")); // arms on the expanded Play
        h.onPlayBlur(blurOn(expanded)); // focus leaves before the keyup
        h.onPlayKeyup(keyOn(expanded, " "));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("blur mid-press disarms the pointer arm too: the origin that began on the blurred control is dropped", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointerOn(expanded, { pointerId: 8 }));
        h.onPlayBlur(blurOn(expanded));
        h.onPlayPointerUp(pointerOn(expanded, { pointerId: 8 }));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("orphan keyup: a Space keyup on the OTHER mirror after a keydown here does not actuate (F3's keyboard twin)", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayKeydown(keyOn(expanded, " "));
        h.onPlayKeyup(keyOn(mirror, " ")); // focus moved to the mirror mid-press
        expect(actuate).not.toHaveBeenCalled();
        // The arm was consumed, not left dangling for a later bare keyup here.
        h.onPlayKeyup(keyOn(expanded, " "));
        expect(actuate).not.toHaveBeenCalled();
    });

    it("the happy path survives the law: down+up on the SAME control, and keydown+keyup on the SAME control, each actuate once", () => {
        const actuate = vi.fn();
        const h = usePlayActuation(actuate);
        h.onPlayPointerDown(pointerOn(mirror, { pointerId: 2 }));
        h.onPlayPointerUp(pointerOn(mirror, { pointerId: 2 }));
        h.onPlayKeydown(keyOn(mirror, " "));
        h.onPlayKeyup(keyOn(mirror, " "));
        expect(actuate).toHaveBeenCalledTimes(2);
    });
});
