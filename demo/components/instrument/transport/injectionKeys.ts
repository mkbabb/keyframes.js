import { shallowRef } from "vue";
import type { ComputedRef, InjectionKey, Ref, ShallowRef } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

export const CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>> = Symbol("controlsPaneHover");

/** J.W2 S2 / T.B9 — the ACTIVE scene's registry id (the App's `currentSuperKey`,
 *  atomic with `machine.activeScene`; the ONE keyspace — the `animation.superKey`
 *  field now carries the SceneId). The `AnimationControls` derivation-sync gates
 *  its store write on `animation.superKey === ACTIVE_SCENE_KEY` so a stale-mounted
 *  host (the NAVIGATE → SCENE_READY window, when the controls still host the
 *  LEAVING scene's animations) can never write the DESTINATION scene's projection
 *  into the LEAVING scene's store — the suspend-on-leave half of the single-writer
 *  contract (the perf-battery §2 corruption cure). */
export const ACTIVE_SCENE_KEY: InjectionKey<ComputedRef<string | undefined>> =
    Symbol("activeSceneKey");

/** X.KF.W13X.r4pane · A2-KE-L1-23 — the Keyframes pane's verbs (the ribbon's
 *  Apply / Copy / Format / Compiled, and the Mod+S shortcut). */
export interface KeyframesPaneCommands {
    /** Whether the pane's CSS identity is applied (the Apply toggle's state). */
    readonly cssApplied: boolean;
    applyCSS(): void;
    clearAppliedCSS(): void;
    copyKeyframes(): void;
    format(): void;
    copyCompiledCSS(): void;
}

/** The keyframe timeline's verbs (Delete / Mod+Z / Mod+Shift+Z). */
export interface TimelineCommands {
    removeSelectedKeyframe(): void;
    undo(): void;
    redo(): void;
}

/** The SELECTED channel's commands — one typed object, published by the
 *  channel host (`ChannelControls`) while it is the selected channel's. */
export interface ChannelCommands {
    /** Switch the channel's control surface (the projection is the host's). */
    selectSurface(surface: string): void;
    readonly keyframes: KeyframesPaneCommands;
    readonly timeline: TimelineCommands;
}

/** The one seat the commands live in: its owner (`AnimationControlsGroup`)
 *  provides it, the channel host publishes into it, and the ribbon and the
 *  keyboard shortcuts read it — no `any` component ref relayed up and down. */
export interface ChannelCommandSeat {
    readonly current: Readonly<ShallowRef<ChannelCommands | null>>;
    /** Publish `commands` as the selected channel's; returns the release. */
    publish(commands: ChannelCommands): () => void;
}

export const CHANNEL_COMMANDS_KEY: InjectionKey<ChannelCommandSeat> = Symbol("channelCommands");

/** One published value and its release: the shape every seat below shares. */
function createSeat<T>() {
    const current = shallowRef<T | null>(null);
    return {
        current,
        publish(value: T) {
            current.value = value;
            return () => {
                if (current.value === value) current.value = null;
            };
        },
    };
}

export function createChannelCommandSeat(): ChannelCommandSeat {
    return createSeat<ChannelCommands>();
}

/** X.KF.W13X.r4ribbon · A2-KE-L1-24 — what the ONE `PlaybackRibbon` mount
 *  (RibbonBar) is bound to: the ribbon's props and its listeners, as one
 *  `v-bind` object. A publisher builds it; nobody else mounts a ribbon. */
export interface PlaybackRibbonBinding {
    animation: KeyframesAnimation<any>;
    /** The rail's scale in ms, where the publisher re-scales it reactively. */
    duration?: number;
    /** Effective ms (the ribbon's own time-space contract). */
    currentT: number;
    isAnimPlaying: boolean;
    userReversed: boolean;
    /** The ball preview's eye: the scene bucket's `ballPreview`. */
    preview: "shown" | "hidden";
    "onUpdate:preview": (next: "shown" | "hidden") => void;
    onToggleReverse: () => void;
    onSliderUpdate: (value: { t: number; animation: KeyframesAnimation<any> }) => void;
    onScrubStart: () => void;
    onScrubEnd: () => void;
    onScrubbed?: () => void;
}

/** A transport for the surface on show, or `null` when it carries none. Read
 *  inside RibbonBar's render, so the reactive reads it makes are tracked there. */
export type RibbonSource = (surface: { selectedControl: string }) => PlaybackRibbonBinding | null;

/** The one seat the ribbon is mounted off. The App provides it with the bound
 *  scene's source (a scene facet's transport: easing's Curve, spring's Physics);
 *  the selected channel's host publishes the Controls surface's transport. */
export interface RibbonSeat {
    /** The binding for `selectedControl`: the channel's on Controls, the
     *  scene's on any other surface. */
    bindingFor(selectedControl: string): PlaybackRibbonBinding | null;
    /** Publish the selected channel's transport; returns the release. */
    publishChannel(source: () => PlaybackRibbonBinding): () => void;
}

export const RIBBON_SEAT_KEY: InjectionKey<RibbonSeat> = Symbol("ribbonSeat");

export function createRibbonSeat(sceneSource: () => RibbonSource | null | undefined): RibbonSeat {
    const channel = createSeat<() => PlaybackRibbonBinding>();
    return {
        bindingFor(selectedControl) {
            if (selectedControl === "controls") return channel.current.value?.() ?? null;
            return sceneSource()?.({ selectedControl }) ?? null;
        },
        publishChannel: channel.publish,
    };
}

/**
 * KF-SKEL-1 — the scene announcer's provide key. The shell (`EditorShell`)
 * supplies the persistent live region and the transient `<Suspense>` fallback
 * (`SceneSkeleton`) writes one line into it. `inject`ing it is OPTIONAL by
 * contract — a standalone host that mounts `SceneSkeleton` without the shell
 * simply announces nothing rather than throwing.
 */
export const SCENE_ANNOUNCER_KEY: InjectionKey<(message: string) => void> =
    Symbol("scene-announcer");
