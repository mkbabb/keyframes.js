import { shallowRef } from "vue";
import type { ComputedRef, InjectionKey, Ref, ShallowRef } from "vue";

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

export function createChannelCommandSeat(): ChannelCommandSeat {
    const current = shallowRef<ChannelCommands | null>(null);
    return {
        current,
        publish(commands) {
            current.value = commands;
            return () => {
                if (current.value === commands) current.value = null;
            };
        },
    };
}
