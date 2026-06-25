import { markRaw, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
import { kfEngine } from "@utils/kfEngine";
import type {
    AnimationGroup,
    CSSKeyframesAnimation,
    InputAnimationOptions,
} from "@mkbabb/keyframes.js";

/** The opacity-only Vars shape the placeholder transport animation rides. */
type ContractVars = { opacity: number };

/**
 * The scene-contract transport host (R.W5 B.1 — kills the three-way contractAnim
 * triplication across useEasingDemo / useSpringDemo / useSequenceDemo).
 *
 * WV-W1 LANE ESCAPE HATCH (documented once, here): the bottom-bar transport
 * (`AnimationControlsGroup` → `ControlsPaneWrapper`/`TransportDock`/readout)
 * requires an `AnimationGroup` handle. The light-tracker scenes (SpringProgress /
 * NumericAnimation / the easing sweep) drive their motion off the engine LIGHT
 * surface, so the group is a minimal opacity-only placeholder retained ONLY as
 * the transport host — it drives no scene motion and is NOT a playback authority.
 * The playback authority is the scene machine + the raw-rAF ScenePlayback
 * adapter; the group's `paused` is a ONE-WAY projection of the machine status
 * (the `watch(isPlaying)` below). Deleting the group outright would strand the
 * entire bottom-bar contract.
 *
 * The per-scene time-twin (mirroring the live sweep onto `contractAnim.t` so the
 * standard PlaybackRibbon tracks progress) stays in each scene — it differs in
 * cadence and seam between scenes, so it is NOT folded here.
 */
export function useContractAnimGroup(opts: {
    duration: MaybeRefOrGetter<number>;
    /** A CSS string twin OR a typed `Easing` — the construction-time value. */
    timingFunction: MaybeRefOrGetter<InputAnimationOptions["timingFunction"]>;
    direction?: InputAnimationOptions["direction"];
    name: string;
    superKey: string;
    isPlaying: Ref<boolean>;
    /** Group `paused` at construction. Default false (born playing). */
    startPaused?: boolean;
}): {
    contractAnim: CSSKeyframesAnimation<ContractVars>;
    animationGroup: AnimationGroup<ContractVars>;
} {
    const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();

    const contractAnim = markRaw(
        new CSSKeyframesAnimation<ContractVars>({
            duration: toValue(opts.duration),
            iterationCount: "infinite",
            ...(opts.direction ? { direction: opts.direction } : {}),
            timingFunction: toValue(opts.timingFunction),
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    contractAnim.name = opts.name;
    contractAnim.superKey = opts.superKey;

    const animationGroup = markRaw(new AnimationGroup(contractAnim));
    // Pre-start the group so the bottom bar sees it as started and the transport
    // toggles pause instead of first-start.
    animationGroup.started = true;
    animationGroup.paused = opts.startPaused ?? false;

    // ONE-WAY projection: the transport host's `paused` mirrors the machine
    // status so the bottom-bar play button reflects the true playback state.
    // Read-only (the machine is the authority) — NOT the former bidirectional
    // hand-sync that made the group a shadow authority.
    watch(
        opts.isPlaying,
        (playing) => {
            animationGroup.paused = !playing;
        },
        { immediate: true },
    );

    return { contractAnim, animationGroup };
}
