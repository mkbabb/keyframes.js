// SERVED MODEL: claude-opus-5[1m]
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { useDragScrub } from "@composables/useDragScrub";
import { useDragCapture } from "@components/instrument/transport/composables/useDragCapture";
import { releaseSelectSuppression } from "@utils/gestureSelectSuppression";

/**
 * X.KF.W11.i — THE DRAG-SEAM PACKET's born-RED witness (G-KFW11-9).
 *
 * The demo has TWO pointer-drag seams and ONE document-wide select-suppression
 * token (`demo/utils/gestureSelectSuppression.ts`, ref-counted). Both seams
 * acquired the token unconditionally per `pointerdown` and released it behind a
 * single `dragging`/`isDragging` boolean, so a SECOND pointer acquired it twice
 * against one release and pinned `activeGestureCount ≥ 1` — `user-select: none`
 * on the whole document for the rest of the session, non-self-healing. Neither
 * seam latched the `pointerId` that opened the gesture, so a second pointer's
 * samples were projected onto the first pointer's subject and its `pointerup`
 * ended a gesture it never started. Neither seam released the token on scope
 * disposal, so a mid-drag unmount stranded it too.
 *
 *   • KF-SCR-1 + L·D-1  (kf-SequenceScrubber :40 · :41) — `useDragScrub`
 *   • KF-AV-15          (kf-AnimationVisualizer :55)    — `useDragCapture`
 *
 * They are ONE cure family: a re-entrancy guard, a `pointerId` latch, and a
 * scope-disposal release, landed identically in both composables.
 *
 * The fourth case is the machine-write policy — **C·C-1 ≡ KF-AV-16**: the scrub
 * drove a `localStorage`-persisting scene machine at raw pointer-sample
 * frequency (one synchronous `JSON.stringify` + `setItem` per admitted
 * `pointermove`). The decision is DECOUPLE: the machine-bound delivery is
 * coalesced into the animation frame that will paint it, and the gesture's
 * terminal sample is flushed exactly on release. `AnimationVisualizer`'s coast
 * rides the same rule at its own emit; the sequence scene's dispatch site
 * (`useSequenceDemo.ts`, X.KF.W11.d's §Bounds row) is returned as escalation
 * KF11-E(i2), not written here.
 *
 * The token's count is module-private BY DESIGN; its public witness is the body
 * class it drives. "Exactly one acquire was live" is therefore asserted the only
 * honest way — one release must clear it.
 */

/** The token's public witness: the ONE global select-suppression class. */
const tokenHeld = () => document.body.classList.contains("is-dragging");

/**
 * A pointer sample, dispatched ON the capture element so it reaches a
 * target-bound listener AND (by bubbling) a window-bound one: these cases assert
 * the seam's CONTRACT, never where it happens to register.
 */
const pointer = (type: string, pointerId: number, clientX: number) =>
    new PointerEvent(type, { pointerId, clientX, bubbles: true, button: 0 });

/** Await the next animation frame — the unit the machine-write policy is in. */
const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function mountScrubHost() {
    const scrubs: number[] = [];
    const Host = defineComponent({
        setup() {
            const el = ref<HTMLElement | null>(null);
            const { onPointerDown } = useDragScrub<number>({
                el,
                project: (e) => e.clientX,
                onScrub: (v) => scrubs.push(v),
            });
            return () => h("div", { ref: el, onPointerdown: onPointerDown });
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    return { wrapper, el: wrapper.element as HTMLElement, scrubs };
}

function mountCaptureHost() {
    const moves: number[] = [];
    const ends: number[] = [];
    const Host = defineComponent({
        setup() {
            const { onPointerDown } = useDragCapture({
                onMove: (e) => moves.push(e.clientX),
                onEnd: (e) => ends.push(e.clientX),
            });
            return () => h("div", { onPointerdown: onPointerDown });
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    return { wrapper, el: wrapper.element as HTMLElement, moves, ends };
}

afterEach(() => {
    // Between-case isolation ONLY: the token is module-global, so a case that
    // ends RED must not poison the next one. Every assertion runs before this.
    for (let i = 0; i < 64 && tokenHeld(); i += 1) releaseSelectSuppression();
});

describe("useDragScrub — the guard family (KF-SCR-1 + L·D-1)", () => {
    it("a second pointer never acquires the token twice; the opening pointer's release clears it", () => {
        const { el } = mountScrubHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        expect(tokenHeld()).toBe(true);

        // The intruder: a second finger on a live gesture (pinch is PERMITTED
        // on these rails, so this is a shipped interaction, not a contrivance).
        el.dispatchEvent(pointer("pointerdown", 2, 20));
        expect(tokenHeld()).toBe(true);

        // The intruder leaves first — it never opened a gesture, so it ends none.
        el.dispatchEvent(pointer("pointerup", 2, 20));
        expect(tokenHeld()).toBe(true);

        // The LAST pointerup is the opening pointer's, and it returns the token
        // to zero: exactly one acquire was ever live.
        el.dispatchEvent(pointer("pointerup", 1, 10));
        expect(tokenHeld()).toBe(false);
    });

    it("a second pointer's samples are never projected onto the first pointer's gesture", () => {
        const { el, scrubs } = mountScrubHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        expect(scrubs).toEqual([10]);

        el.dispatchEvent(pointer("pointermove", 2, 999));
        expect(scrubs).toEqual([10]);

        el.dispatchEvent(pointer("pointermove", 1, 30));
        expect(scrubs).toEqual([10, 30]);

        el.dispatchEvent(pointer("pointerup", 1, 30));
        expect(tokenHeld()).toBe(false);
    });

    it("an unmount mid-drag returns the token (the scope-disposal release)", () => {
        const { wrapper, el } = mountScrubHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        expect(tokenHeld()).toBe(true);

        wrapper.unmount();
        expect(tokenHeld()).toBe(false);
    });

    it("a pointercancel from the opening pointer ends the gesture; an intruder's does not", () => {
        const { el } = mountScrubHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        el.dispatchEvent(pointer("pointercancel", 2, 20));
        expect(tokenHeld()).toBe(true);

        el.dispatchEvent(pointer("pointercancel", 1, 10));
        expect(tokenHeld()).toBe(false);
    });
});

describe("useDragCapture — the SAME guard family (KF-AV-15)", () => {
    it("a second pointer never acquires the token twice; the opening pointer's release clears it", () => {
        const { el } = mountCaptureHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        expect(tokenHeld()).toBe(true);

        el.dispatchEvent(pointer("pointerdown", 2, 20));
        expect(tokenHeld()).toBe(true);

        el.dispatchEvent(pointer("pointerup", 2, 20));
        expect(tokenHeld()).toBe(true);

        el.dispatchEvent(pointer("pointerup", 1, 10));
        expect(tokenHeld()).toBe(false);
    });

    it("a second pointer's samples never reach the first pointer's handlers", async () => {
        const { el, moves, ends } = mountCaptureHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        el.dispatchEvent(pointer("pointermove", 2, 999));
        await nextFrame();
        expect(moves).toEqual([]);

        el.dispatchEvent(pointer("pointermove", 1, 30));
        await nextFrame();
        expect(moves).toEqual([30]);

        el.dispatchEvent(pointer("pointerup", 2, 999));
        expect(ends).toEqual([]);

        el.dispatchEvent(pointer("pointerup", 1, 30));
        expect(ends).toEqual([30]);
        expect(tokenHeld()).toBe(false);
    });

    it("an unmount mid-drag returns the token (the scope-disposal release)", () => {
        const { wrapper, el } = mountCaptureHost();

        el.dispatchEvent(pointer("pointerdown", 1, 10));
        expect(tokenHeld()).toBe(true);

        wrapper.unmount();
        expect(tokenHeld()).toBe(false);
    });
});

describe("C·C-1 ≡ KF-AV-16 — the machine-write policy at the drag seam", () => {
    it("coalesces a 240 Hz stream to ONE machine-bound delivery per frame, with the terminal sample exact", async () => {
        const { el, moves } = mountCaptureHost();

        el.dispatchEvent(pointer("pointerdown", 1, 0));

        // Four samples inside one 16.7 ms frame — a 240 Hz pointer stream.
        for (const x of [10, 20, 30, 40]) {
            el.dispatchEvent(pointer("pointermove", 1, x));
        }
        expect(moves).toEqual([]);

        await nextFrame();
        expect(moves).toEqual([40]); // exactly one, and it is the LATEST sample

        for (const x of [50, 60, 70, 80]) {
            el.dispatchEvent(pointer("pointermove", 1, x));
        }
        // The release flushes the pending sample SYNCHRONOUSLY: a decoupled
        // machine write must still record the exact value the user let go at
        // (the terminal-sample loss a bare throttle is characterised by).
        el.dispatchEvent(pointer("pointerup", 1, 80));
        expect(moves).toEqual([40, 80]);

        // …and no stale frame fires behind the gesture's back.
        await nextFrame();
        expect(moves).toEqual([40, 80]);
        expect(tokenHeld()).toBe(false);
    });

    it("an unmount mid-drag cancels the pending frame", async () => {
        const { wrapper, el, moves } = mountCaptureHost();

        el.dispatchEvent(pointer("pointerdown", 1, 0));
        el.dispatchEvent(pointer("pointermove", 1, 10));
        wrapper.unmount();

        await nextFrame();
        expect(moves).toEqual([]);
        expect(tokenHeld()).toBe(false);
    });
});
