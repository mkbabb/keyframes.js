import { type MaybeRefOrGetter, toValue, watchEffect } from "vue";
import { useEventListener, usePreferredReducedMotion } from "@vueuse/core";

/**
 * useSpecularPointer — wire glass-ui's pointer-anchored specular catch-light
 * (the `.glass-specular-track` `::before`) to the actual cursor, and refine its
 * intensity to a calm resting glow.
 *
 * THE SEAM (inv-16, pure consumption — zero new backdrop CSS). glass-ui's
 * `glass-specular-track.css` paints a masked radial catch-light on a `::before`
 * pseudo and reads the pointer position off the HOST as `--mouse-x` / `--mouse-y`
 * (percentages) — "the pointer-position WRITE is the consumer's seam"
 * (`glass-specular-track.css:19`). The Card component opts a `surface="glass"`
 * tier INTO that track but never wires the seam, so the catch-light degrades to a
 * static, dead-centred bloom (it falls to the `var(--mouse-x, 50%)` floor). This
 * composable IS the missing seam: it makes the light travel with the cursor, as
 * the dock already does. (S3 / F3.)
 *
 * THE REFINEMENT (D14, "refined for hovers"). glass-ui's `::before` rests at
 * `--specular-intensity: 0.35` and hits 0.6 on hover — too hot for a panel
 * resting surface. `--specular-intensity` is a consumer-writable registered
 * `@property` (`tokens.css §11b`). This composable writes a demo TUNING onto the
 * host — `--specular-rest` (0.22) / `--specular-hover` (0.4) — which the demo
 * `.cartoon-specular` recipe projects onto the pseudo's `--specular-intensity`
 * (the registered prop is `inherits: false`, so the pseudo must own its value;
 * the recipe is the one structural projection — see design-idioms.css). The
 * magnitude lives HERE, single-sourced; the recipe only forwards it.
 *
 * REDUCED MOTION (mandatory). Under `prefers-reduced-motion: reduce` the pointer
 * write is a no-op — glass-ui's own PRM bracket pins the catch-light static at
 * centre, so feeding it pointer coordinates would be dead work AND, were the
 * bracket ever relaxed, motion the user opted out of. The intensity tune still
 * applies (a static calmer glow is not motion).
 *
 * @param elRef the host element carrying `.glass-specular-track` (e.g. a
 *   `surface="glass"` Card, or the `.cartoon-specular` composite).
 */
export function useSpecularPointer(
    elRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
    options: { rest?: number; hover?: number } = {},
): void {
    const { rest = 0.22, hover = 0.4 } = options;
    const reducedMotion = usePreferredReducedMotion();

    // The intensity tune is a static surface property — apply it regardless of
    // motion preference. The `.cartoon-specular` recipe reads these off the host
    // and projects them onto the `::before` `--specular-intensity` (the one
    // structural seam the registered, non-inheriting prop forces). ONE source of
    // magnitude — the recipe's `var()` fallbacks (0.22 / 0.4) only matter when a
    // surface carries the recipe without this composable wired.
    watchEffect(() => {
        const el = toValue(elRef);
        if (!el) return;
        el.style.setProperty("--specular-rest", String(rest));
        el.style.setProperty("--specular-hover", String(hover));
    });

    // The pointer seam — write the cursor position as percentages of the host
    // rect, exactly the `--mouse-x` / `--mouse-y` contract glass-ui consumes.
    // useEventListener auto-cleans on scope dispose (no leak); a getter target
    // re-binds when the ref resolves. No-op under reduced motion.
    useEventListener(elRef, "pointermove", (event: PointerEvent) => {
        if (reducedMotion.value === "reduce") return;
        const el = toValue(elRef);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mouse-x", `${x}%`);
        el.style.setProperty("--mouse-y", `${y}%`);
    });
}
