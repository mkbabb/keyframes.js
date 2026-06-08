import { computed, markRaw, ref, watch } from "vue";

import { AnimationGroup } from "@src/animation/group";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { springTimingFunction } from "@src/animation/springTimingFunction";

import {
    useSceneMachine,
    createRafAdapter,
    type ScenePlayback,
} from "@components/custom/animation-controls/stores";

/**
 * Drives the @starting-style + spring-linear() copy-paste artifact scene.
 *
 * This scene's MOTION is a declarative CSS `@starting-style` / `allow-discrete`
 * transition (in StartingStyleTarget.vue) eased by a keyframes.js spring
 * `linear()` — NOT a JS-driven rAF loop. So there is no per-frame sweep to gate;
 * the one piece of round-trippable scene state is the `visible` toggle (the
 * discrete entry/exit the user drives).
 *
 * PLAYBACK AUTHORITY (H.W1 / WV-W1-HIGH-3): the scene still implements the dual
 * raw-rAF ScenePlayback contract so suspend/restore route through the CONTRACT
 * (not the dummy transport group, which has no position to snapshot). `progress`
 * encodes the `visible` flag as a 0/1 scalar so the cross-scene round-trip is
 * non-vacuous; there is no loop, so the loop methods are inert. `isPlaying` is a
 * read-only projection of `machine.status === 'playing'` (no private shadow).
 */
export function useStartingStyleDemo() {
    const SUPER_KEY = "StartingStyle";

    // The one round-trippable scene fact: the discrete-transition visibility the
    // user toggles. Owned HERE (not in the Target) so the ScenePlayback contract
    // can snapshot/restore it across a scene switch.
    const visible = ref(true);
    const toggle = () => {
        visible.value = !visible.value;
    };

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ──
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");

    // ── The raw-rAF ScenePlayback adapter ──
    // No loop exists for this scene, so the loop methods are inert; the contract
    // round-trips the `visible` flag as progress (1 = shown, 0 = dismissed) and
    // the play intent. The App registers this on SCENE_READY.
    const scenePlayback: ScenePlayback = createRafAdapter({
        getProgress: () => (visible.value ? 1 : 0),
        setProgress: (t) => {
            visible.value = t >= 0.5;
        },
        getPlaying: () => machine.status.value === "playing",
        setPlaying: () => {},
        // No rAF loop: this scene's motion is declarative CSS, so there is no
        // loop to schedule/stop. The contract is honored with inert methods —
        // suspend/restore round-trips the `visible` state, not a sweep clock.
        isLoopRunning: () => false,
        stopLoop: () => {},
        startLoop: () => {},
    });

    // ── Scene-contract group (the bottom-bar transport host) ──────────
    // AnimationControlsGroup binds an `AnimationGroup` for its transport readout.
    // This scene's motion is the declarative CSS transition above; the group
    // drives NO motion. Its `paused` is a ONE-WAY projection of machine status —
    // it is NOT a playback authority.
    const contractAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: 600,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: springTimingFunction({
                response: 0.5,
                dampingFraction: 0.45,
            }),
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    contractAnim.name = "Discrete Preview";
    contractAnim.superKey = SUPER_KEY;

    const animationGroup = markRaw(new AnimationGroup(contractAnim));
    animationGroup.started = true;
    animationGroup.paused = true;

    // ONE-WAY projection: the transport host's `paused` mirrors the machine
    // status (the machine is the authority).
    watch(
        isPlaying,
        (playing) => {
            animationGroup.paused = !playing;
        },
        { immediate: true },
    );

    return {
        // State
        visible,
        toggle,
        isPlaying,

        // Scene contract
        animationGroup,
        scenePlayback,
    };
}
