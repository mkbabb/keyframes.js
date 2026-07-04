import { computed, markRaw, ref, shallowRef } from "vue";

import { kfEngine } from "@utils/kfEngine";
import type { AnimationGroup } from "@mkbabb/keyframes.js";

import { createGroupAdapter, useSceneMachine } from "@state";

import { COMPOSE_SUPER_KEY } from "./composeKeys";

/**
 * useComposeDemo — the compose scene's animation source (C-17: the `use<Name>Demo`
 * convention, authored from birth for the ninth scene). It is the FOLD of the
 * former `usePlaygroundAnimations`: a default `AnimationGroup` of preset
 * animations the user BINDS to composed assets (bounce/fade-in/pulse/rotate-scale/
 * shake), each an infinite alternating loop so a bound asset breathes on its own.
 *
 * Unlike the standalone playground (which let the EditorShell's transport own the
 * group directly), the SCENE routes playback through the W1 scene machine — the
 * SAME machine-native contract cube/amiga/morph ride: `isPlaying` is a read-only
 * projection of the machine status, `play`/`pause` DISPATCH, and `scenePlayback`
 * is the group adapter the App registers on SCENE_READY so the group's `t`
 * snapshots round-trip across suspend/restore (proof:scene-contract-identity).
 */
export function useComposeDemo() {
    // HEAVY engine from the warmed surface (synchronous — main.ts warms before any
    // scene mounts). `AnimationGroup`/`presets` ride the heavy boundary.
    const { AnimationGroup, presets } = kfEngine();

    const bounce = presets.bounce({
        duration: 1500,
        iterationCount: Infinity,
        direction: "alternate",
    });
    bounce.name = "bounce";

    const fadeIn = presets.fadeIn({
        duration: 2000,
        iterationCount: Infinity,
        direction: "alternate",
    });
    fadeIn.name = "fade-in";

    const pulse = presets.pulse({
        duration: 1200,
        iterationCount: Infinity,
        direction: "alternate",
    });
    pulse.name = "pulse";

    const rotateScale = presets.rotateScale({
        duration: 3000,
        iterationCount: Infinity,
        direction: "alternate",
    });
    rotateScale.name = "rotate-scale";

    const shake = presets.shake({
        duration: 800,
        iterationCount: Infinity,
        direction: "alternate",
    });
    shake.name = "shake";

    // Placeholder targets — reassigned by the scene when an asset binds a preset.
    const placeholder = document.createElement("div");
    bounce.setTargets(placeholder);
    fadeIn.setTargets(placeholder);
    pulse.setTargets(placeholder);
    rotateScale.setTargets(placeholder);
    shake.setTargets(placeholder);

    const animationGroup = shallowRef<AnimationGroup<any>>(
        markRaw(
            new AnimationGroup(bounce, fadeIn, pulse, rotateScale, shake).setSuperKey(
                COMPOSE_SUPER_KEY,
            ),
        ),
    );

    const animationNames = Object.keys(animationGroup.value.animations);
    const isStarted = ref(true);

    // ── Machine-native playback (the read-only projection + dispatchers) ──────
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");
    const play = (): void => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };
    const pause = (): void => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };

    // The group ScenePlayback adapter the App registers on SCENE_READY.
    const scenePlayback = createGroupAdapter(() => animationGroup.value);

    return {
        animationGroup,
        animationNames,
        superKey: COMPOSE_SUPER_KEY,
        isStarted,
        isPlaying,
        play,
        pause,
        scenePlayback,
    };
}

export type ComposeDemo = ReturnType<typeof useComposeDemo>;
