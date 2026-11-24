import { nextTick, ref, type Ref } from "vue";
import { viewTransition, type ViewTransitionHandle } from "@mkbabb/keyframes.js";
import { allScenes, loadScene, prepareScene, warmScenesAtIdle } from "../scene/scenes";
import { clearDockSwap, dockWidths, markDockSwap } from "../dock/dockSwap";

/**
 * Routes the scene-id mutation through the platform's native View Transitions.
 *
 * S.F1 VT-d DOGFOOD — the scene-swap (the demo's most-seen motion) now rides kf's
 * OWN LIGHT `viewTransition` dispatch (`@mkbabb/keyframes.js`), not glass-ui's
 * helper: the library eats its own View-Transitions cooking. The
 * compositor cross-fades the old scene paint into the new one, with the
 * shared-element morph riding the `view-transition-name` on the scene host
 * (`App.vue`, ≤ 1 element per state so names never collide) and the PRM degrade
 * routed through kf's ONE `withReducedMotion` gate (a `reduce` query snaps the
 * mutate directly — `backend: "immediate"`). The glass-ui `view-transition.css`
 * (loaded via `@import "@mkbabb/glass-ui/styles"`) owns the LOOK of the swap (the
 * untyped cross-fade + the `scene-subject` shared-element morph); kf owns the
 * DISPATCH. The demo carries NO `::view-transition-*` CSS of its own (S.G2 S11 /
 * proof:icon-paint-live — those animation glyphs are glass-ui-owned).
 *
 * o1105 kf-load L7 — the swap is TYPED `lateral`, glass's route grammar for
 * moving between siblings, with `--route-direction` on the root: the sign of
 * the destination's dock index minus the source's (Home = 0). The scene host
 * carries `gl-route-window` while a transition runs (App.vue), so the window
 * slides in from the side the dock names. The look is glass's
 * (view-transition.css); the docks keep their own groups, outside the route
 * names. A pick of the scene already showing has direction 0.
 *
 * KFA-25 / KFA-76 / KFA-26 / KFA-201 (X.KF.W13X.scene) — the swap is ONE
 * cross-dissolve from the source scene to the destination scene, whole:
 *   1. BEFORE the transition starts, the destination chunk is resolved
 *      (`loadScene`; every chunk is also warmed at idle after first paint) and
 *      any overlay mid-exit (the Scene Select the pick just closed) finishes
 *      its own exit fade (LAST-TEN KF-16) — so the old-state capture carries
 *      no popover, and no ghost rows linger over the new scene.
 *   2. The update callback mutates the scene id and then AWAITS the scene's
 *      commit point (`whenSceneReady`: the new scene bound, the chrome flipped
 *      with it) — so the new-state capture is the resolved scene, never the
 *      `<Suspense>` skeleton, and the chunk's evaluation never lands inside the
 *      visible cross-fade (the platform holds the old paint while it runs).
 * A newer switch supersedes one still preparing (a generation count), so a
 * fast double pick lands on the last pick only.
 *
 * KFA-24 — this is the ONE scene-nav entry: the dock pick, the SharePopover
 * restore AND every URL change (a direct hash, back/forward — the route
 * reader in `useSceneMachineRouterBinding`) run through `runSceneSwitch`.
 *
 * Feature-detect is built into the dispatch: where `document.startViewTransition`
 * is absent it calls `mutate()` synchronously and settles `finished` immediately
 * (`backend: "immediate"`), so the no-VT path falls through to the engine-
 * dogfooding `SpringProgress` cross-dissolve (`useSceneSwap`) UNCHANGED — the
 * dogfood fallback is preserved, not removed.
 *
 * FORTY-SIXTH A (the motion law: reduced motion is a fade, never a cut) —
 * under `prefers-reduced-motion: reduce` the swap is still a View Transition,
 * untyped and with nothing named but the page (App.vue unnames every element
 * for it): the new page fades in over the old, opacity only, over
 * REDUCED_FADE_MS (`fadeInPage`). kf's dispatch used to snap there
 * (`respectReducedMotion`, its default), so the docks, the transport and the
 * die changed between two frames. The fade is an animation of the new page's
 * image (WAAPI): glass's reduced-motion sheet sets every View-Transition
 * pseudo-element's CSS animation to `none`.
 *
 * a11y MANDATORY: View Transitions morph layout but do not manage focus. On
 * `finished` we route focus to the new scene's host container (`tabindex="-1"`),
 * announcing the context change to keyboard/AT users — an upgrade the spring fade
 * lacked. The helper's `finished` never rejects (a skipped/aborted transition
 * settles cleanly), so the focus route always runs.
 */
export function useSceneTransition(opts: {
    mutate: (id: string) => void;
    sceneHost: Ref<HTMLElement | null>;
    /** Resolves at the scene's commit point with `land`, which starts the
     *  auto-play the entry owes; it is called once the swap has landed. */
    whenSceneReady: (id: string) => Promise<() => void>;
    /** The scene showing now (the swap's source). */
    currentId: () => string;
}) {
    const { mutate, sceneHost, whenSceneReady, currentId } = opts;

    // KFA-12 (X.KF.W13V.k) — the backend that carried the LAST switch, read
    // off the dispatch's own handle. `useSceneSwap` stands its spring down only
    // when this reads "view-transition": a feature probe said "VT owns the
    // motion" even when the call threw and hard-cut.
    const lastSwapBackend = ref<ViewTransitionHandle["backend"] | null>(null);

    // KF-RES-1 (OD19 residue-2, COHESION §0gq.3) — the idle warm of every
    // scene chunk starts once the FIRST scene's content has painted, never at
    // the shell's mount. An idle callback has no deadline: on a deep link the
    // main thread idles while the route's own chunk is in flight, so a warm
    // armed at mount fetched every other scene (and Home's Aurora) before the
    // route's content (cold #/amiga: 1707 KB against 1427). `onSceneContent`
    // is the scene host's <Suspense> resolve; the warm is armed in the next
    // frame, so its idle period comes after that frame's paint.
    let warmArmed = false;
    function onSceneContent() {
        if (warmArmed) return;
        warmArmed = true;
        requestAnimationFrame(warmScenesAtIdle);
    }

    let generation = 0;

    async function runSceneSwitch(id: string) {
        const gen = ++generation;
        const start = performance.mark("scene-swap:start").startTime;
        // A rejected chunk is not handled here: the mount below surfaces it
        // through <Suspense>, exactly as an un-preloaded switch would.
        // owner-1112 (item 6) — and the scene's own pre-swap work (the Amiga's
        // room) runs here too, while the leaving scene still shows: the
        // cross-fade starts only once the incoming scene can present whole.
        await Promise.allSettled([
            loadScene(id).then(() => prepareScene(id)),
            settleClosingOverlays(),
        ]);
        if (gen !== generation) return;
        performance.measure("scene-swap:prepare", { start });
        const root = document.documentElement;
        root.style.setProperty("--route-direction", String(routeDirection(currentId(), id)));
        // FORTY-SIXTH A (K-1) — each dock's width before the swap; after its
        // DOM update the root is marked with the docks that grow or shrink,
        // and the dock-swap look draws the wider plate (@app/dock/dockSwap).
        const docks = dockWidths();
        const reduced = prefersReducedMotion();
        let land: (() => void) | null = null;
        const { ready, finished, backend } = viewTransition(async () => {
            const commit = performance.now();
            const ready = whenSceneReady(id);
            mutate(id);
            land = await ready;
            await nextTick();
            markDockSwap(docks);
            performance.measure("scene-swap:commit", { start: commit });
        }, { types: reduced ? [] : ["lateral"], respectReducedMotion: false });
        lastSwapBackend.value = backend;
        if (reduced && backend === "view-transition") void ready.then(fadeInPage);
        finished.finally(() => {
            if (gen === generation) {
                root.style.removeProperty("--route-direction");
                clearDockSwap();
            }
            performance.measure("scene-swap:total", { start });
            sceneHost.value?.focus();
            if (gen === generation) land?.();
        });
    }

    return { runSceneSwitch, lastSwapBackend, onSceneContent };
}

/** The reduced-motion swap's one fade: within the canon's band for a surface
 *  that appears (100 to 200 ms), on glass's entrance curve. */
const REDUCED_FADE_MS = 160;

function prefersReducedMotion(): boolean {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Under reduced motion: the new page's image fades in over the old one,
 *  which stands at full strength beneath it, so what both pages share holds
 *  still and only what changes crosses. */
function fadeInPage(): void {
    const root = document.documentElement;
    const ease = getComputedStyle(root).getPropertyValue("--ease-out").trim() || "ease-out";
    try {
        root.animate([{ opacity: 0 }, { opacity: 1 }], {
            pseudoElement: "::view-transition-new(root)",
            duration: REDUCED_FADE_MS,
            easing: ease,
            fill: "both",
        });
    } catch {
        // An engine without pseudo-element animations: the swap ends at once.
    }
}

/** The sign of the move along the dock's scene order (Home first, at 0). */
export function routeDirection(from: string, to: string): -1 | 0 | 1 {
    const order = allScenes.map((s) => s.id);
    return Math.sign(order.indexOf(to) - order.indexOf(from)) as -1 | 0 | 1;
}

/**
 * KFA-26 / KFA-201 — no overlay that is mid-exit rides into the old-state
 * capture. A pick closes its Select in the same event that asks for the
 * switch; one frame later the closing content carries reka's
 * `data-state="closed"` and starts its exit animation.
 *
 * LAST-TEN KF-16 — that exit now PLAYS OUT, and the swap waits for it. It
 * used to be `finish()`ed (KFA-201: awaiting it held the swap ~300 ms, OD19
 * KF-P4), which removed the list at full opacity in the frame the swap began:
 * the one pick on the site whose list did not fade. The exit is glass's short
 * close (its `--duration-control`-class reveal-out), and the destination
 * chunk resolves beside it (`Promise.allSettled` in `runSceneSwitch`), so the
 * wait is the list's own fade and no more. An infinite animation is not an
 * exit and is left alone; a paused one cannot hold the swap (it is finished).
 *
 * FORTY-SIXTH A ("the press waits") — only a closing overlay's exit holds the
 * swap: a list, a menu or a dialog (`OVERLAY`). The test was any animation
 * under `[data-state="closed"]`, and every dock seat is a tooltip's trigger,
 * which reka marks `data-state="closed"` while its tooltip is shut, so the
 * pressed seat's own press and hover transitions held every press 150 to
 * 340 ms before the swap began (served, 1440 and 390, 1x). A tooltip closing
 * on the press is not waited for either: the lateral swap does not draw the
 * old page, so its fade runs on in the live page.
 */
const OVERLAY = '[role="listbox"], [role="menu"], [role="dialog"]';

async function settleClosingOverlays(): Promise<void> {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const exits: Promise<unknown>[] = [];
    for (const a of document.getAnimations()) {
        const target = (a.effect as KeyframeEffect | null)?.target;
        const closing = target instanceof Element ? target.closest('[data-state="closed"]') : null;
        if (closing?.matches(OVERLAY) && a.effect?.getComputedTiming().endTime !== Infinity) {
            if (a.playState === "paused") a.finish();
            else exits.push(a.finished.catch(() => undefined));
        }
    }
    await Promise.all(exits);
    await nextTick();
}
