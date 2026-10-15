import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { SpringProgress, type ViewTransitionHandle } from "@mkbabb/keyframes.js";

/**
 * The engine-dogfooded scene-swap cross-dissolve — the NO-VT FALLBACK. Where
 * the platform ships native View Transitions (`useSceneTransition`), the
 * compositor owns the scene cross-fade and this spring ramp stays at rest (one
 * motion, never two stacked). For every swap no View Transition carried (the
 * engine lacks it, or the dispatch fell back) this is the swap motion — the
 * engine still dogfoods its own SpringProgress.
 *
 * The keyed `<Suspense>` host (App.vue) hard-cuts the scene; this `SpringProgress`
 * fades the new scene in over the previous paint via a sibling reactive style
 * binding — NOT a `<Transition>` wrapper.
 *
 * Why a sibling style binding, not a `<Transition>`: a `<Transition mode="out-in">`
 * / `<KeepAlive>` around a keyed `<Suspense>` whose child is a
 * `defineAsyncComponent` never triggered the async loader, so amiga / square /
 * easing / spring shipped a BLANK viewport on every load (the chunk was never
 * even requested — B.W3's headline blocker). Driving the fade from the SIBLING
 * wrapper `<div>` keeps the async loader on the bare `<Suspense>`, untouched, so
 * the async-load re-break cannot recur. On `activeSceneKey` change the spring
 * re-seats 0→1, fading the new scene in over the previous paint (a
 * cross-dissolve, never a blank gap).
 *
 * The default options ARE the iOS "smooth" preset (response 0.5, dampingFraction
 * 0.86 — no overshoot, a calm enter); `respectReducedMotion: true` makes the
 * spring snap to terminal in one emit under prefers-reduced-motion — an instant
 * clean swap, the engine's own reduced-motion authority.
 */
export function useSceneSwap(
    activeSceneKey: ComputedRef<string>,
    lastSwapBackend: Ref<ViewTransitionHandle["backend"] | null>,
) {
    const sceneOpacity = ref(1);
    const sceneSwapStyle = computed(() => ({
        opacity: sceneOpacity.value,
        // lerp(0.97, 1, v): subtle scale-up as the scene settles in.
        transform: `scale(${0.97 + 0.03 * sceneOpacity.value})`,
    }));

    // KFA-12 (X.KF.W13V.k) — the spring stands down ONLY for a swap a native
    // View Transition actually carried (the dispatch handle's own `backend`),
    // never on a one-shot feature probe: the probe read "supported" while every
    // call threw and hard-cut, so neither motion ran. The reading is consumed
    // per swap. Every scene-nav entry (the dock, a restore, a direct hash,
    // back/forward) runs through the dispatch (KFA-24, X.KF.W13X.scene), and
    // the dispatch resolves the destination chunk first (KFA-25), so the key
    // flip mounts the resolved scene and this spring fades IT in, never the
    // <Suspense> fallback (UIA-KF-125).
    const sceneSwapSpring = new SpringProgress({ respectReducedMotion: true });
    // The host opacity reads the spring's whole value stream (`subscribe`:
    // every reset, re-target, snap and tick), so each leg's first value lands
    // synchronously with the mutation that asked for it: no frame paints the
    // incoming scene at the stale 1 before the first tick.
    sceneSwapSpring.subscribe((v) => { sceneOpacity.value = v; });
    /**
     * The house swap fade: the one motion every swap no VT carried takes.
     * The leg (0 → 1) is seated BEFORE `play()`, because the engine reads the
     * reduced-motion query at the re-target and at `play()`: under it the
     * spring snaps to 1 and emits it (an instant clean swap). The old order
     * (`play()` with a frame callback, THEN the target) snapped onto the reset
     * value 0, and the re-target's snap never reached that callback, so every
     * reduced-motion swap left the scene host at opacity 0, a blank stage
     * (X.KF.W13X.r4fade).
     */
    function fadeSceneIn() {
        sceneSwapSpring.reset(0);
        sceneSwapSpring.target = 1;
        sceneSwapSpring.play();
    }
    watch(activeSceneKey, () => {
        const carriedByVT = lastSwapBackend.value === "view-transition";
        lastSwapBackend.value = null;
        if (carriedByVT) return;
        fadeSceneIn();
    });

    // UIA-KF-125 motion half (X.KF.W13X.r4fade) — a HARD load has no source
    // scene and no dispatch: the keyed <Suspense> shows its fallback while the
    // cold chunk loads, then resolves the scene in place. No View Transition
    // can carry that resolve (the platform captures the old state before a
    // mutation it is handed, and Suspense's patch is not one), so it is a swap
    // no VT carried and takes the same fade, through the same spring (same
    // response/damping, the same reduced-motion snap). Only a resolve that
    // followed a shown fallback fades: a warm mount (an in-app switch preloads
    // its chunk, KFA-25) never pends, so it never fades twice.
    let fallbackShown = false;
    /** <Suspense @fallback> — the placeholder stands in the stage slot. */
    function onSceneFallback() {
        fallbackShown = true;
    }
    /** <Suspense @resolve> — the scene replaced a shown fallback: fade it in. */
    function onSceneResolve() {
        if (!fallbackShown) return;
        fallbackShown = false;
        fadeSceneIn();
    }

    return { sceneSwapStyle, onSceneFallback, onSceneResolve };
}
