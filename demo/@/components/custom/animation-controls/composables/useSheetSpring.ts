import { onScopeDispose, ref, watch, type Ref } from "vue";
import { SpringProgress } from "@src/animation/spring";

/**
 * The engine-dogfooded mobile bottom-SHEET drawer (H.W7.S2 / inv ζ). The demo's
 * flagship structural motion — the controls sheet sliding up over the full-bleed
 * stage — is sprung by the engine's OWN `SpringProgress`, not a hand-rolled CSS
 * `grid-template-rows` ease. This is the dogfood-as-mandate: the product IS a
 * spring engine, so its most-visible chrome motion must be sprung by it.
 *
 * Mirrors `useSceneSwap`'s SHAPE (a colocated composable that owns ONE
 * `SpringProgress`, watches a reactive trigger, and per-frame writes a reactive
 * value a sibling style binding reads) — NOT its location or its VT guard. A
 * drawer is not a View-Transition swap, so the spring is constructed
 * UNCONDITIONALLY (no `if (!vtOwnsMotion)` gate): this is always the sheet's
 * motion, never stood-down for a compositor swap.
 *
 * The params `{ response: 0.3, dampingFraction: 0.8 }` settle in ≈198ms — well
 * inside the `<350ms` budget the `proof:drawer-spring (b)` gate enforces. We do
 * NOT bind the `--spring-snappy` token: that desktop alias resolves to
 * `--spring-smooth` (response 0.5 ≈401ms), which FAILS the budget. The named
 * preset is VOCABULARY; the passing INSTANCE is constructed here.
 *
 * `respectReducedMotion: true` (the spring's built-in `withReducedMotion` snap,
 * spring.ts:46/253) makes open/close a single-frame jump to terminal under
 * `prefers-reduced-motion` — the instant clean PRM drawer, the engine's own
 * reduced-motion authority, no CSS PRM bracket needed.
 *
 * @param open  the sheet's open intent (true → slide up, false → slide down).
 *              The spring's target tracks it: 1 when open, 0 when closed. The
 *              reactive `sheetT` it writes is the 0→1 progress the sheet's
 *              transform/height reads (`translateY(calc((1 - sheetT) * 100%))`).
 */
export function useSheetSpring(open: Ref<boolean>) {
    // 0 = fully closed (sheet parked below the fold), 1 = fully open (at the
    // active detent). The sheet's transform/height interpolates against this.
    const sheetT = ref(open.value ? 1 : 0);

    const spring = new SpringProgress({
        response: 0.3,
        dampingFraction: 0.8,
        initial: sheetT.value,
        respectReducedMotion: true,
    });

    // J.W2 S3 (M2) — the sheet's SETTLED signal: the spring's OWN settled state,
    // mirrored reactively so layout readiness (`isPanelTransitionDone` on the
    // mobile path, useControlsLayout) binds to the ACTUAL motion driver — the
    // spring-driven sheet has NO CSS height transition, so a `transitionend`
    // gate is structurally unreachable here. Written from the same emit path as
    // `sheetT`: the per-frame emits carry `settled:false` while the spring is in
    // flight and `true` on the settle emit; the PRM `_snapSettled` single emit
    // lands `true` immediately — the reduced-motion leg works by construction.
    const settled = ref(spring.settled);

    const write = (v: number) => {
        sheetT.value = v;
        settled.value = spring.settled;
    };

    // The writer is wired on BOTH surfaces, each covering a path the other
    // misses (the two are idempotent — they set the same ref to the same value):
    //   • subscribe() fires on EVERY emit, including the PRM single-emit snap
    //     (`_snapSettled` emits to SUBSCRIBERS but NOT to `play`'s `onFrame`), so
    //     the reduced-motion jump reaches `sheetT` (proof:drawer-spring (c)).
    //   • play(onFrame) binds `_onFrame`, which (a) drives the live rAF loop and
    //     (b) lets a later `target` set AUTO-RESUME the loop (spring.ts: the
    //     resume guard is `if (this._onFrame) …`). Without an `onFrame`, a
    //     re-open after a settled close would never restart the loop.
    spring.subscribe(write);
    spring.play(write);

    watch(open, (isOpen) => {
        const target = isOpen ? 1 : 0;
        // Un-settle FIRST when a real motion is about to run, so a `settled`
        // consumer never reads a stale `true` across the open/close flip. Under
        // PRM the target-set snaps synchronously (one emit) and `write` lands
        // `settled = true` again in the same tick — the consumer's combined
        // (settled × open) watch still observes the open flip.
        if (sheetT.value !== target) settled.value = false;
        spring.target = target;
    });

    onScopeDispose(() => spring.dispose());

    return { sheetT, settled };
}
