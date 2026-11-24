import type { ComputedRef } from "vue";
import { controlsOpenAtRest, takeSheetPress } from "@state/controlOptionsStore";
import { defaultControlSurfaceFor, surfacesFor } from "@state/controlSurfaces";
import {
    HOME_SCENE_ID,
    useSceneMachine,
    type StoredAnimationGroupControlOptions,
} from "@state";
import type { SceneExposedApi } from "./sceneExposedApi";
import { flag, oneOf, useUrlState, type UrlKey } from "./urlState";
import { channelOptionsKey } from "./channelOptionsKey";

/**
 * KF-URL — the view state every scene shares, in the URL (urlState.ts):
 *
 *   anim   the selected channel (default: the scene's first)       push
 *   pane   the controls surface (default: the scene's own)          push
 *   sheet  the controls pane / phone sheet; absent = the layout's
 *          rest (open on a desk, closed on a phone)       replace; a press
 *          on the phone's Controls seat pushes, and closing goes Back
 *   ball   0 = the ball preview hidden                              replace
 *   tl     1 = the timeline expanded                                replace
 *   play   1 / 0 = playing / paused, where it differs from the
 *          scene's entry state (the cube plays, the rest wait)      replace
 *   o.<Channel>  a channel's options where they differ from what its
 *          author wrote (channelOptionsKey.ts)                     replace
 *
 * A pick of what is shown (a channel, a surface) is a push; the chrome's own
 * posture (the pane open or lowered, the ball, the timeline) is a replace, so a
 * tap on the die that lowers the phone sheet adds no entry and Back leaves the
 * view instead of raising the sheet again.
 *
 * Bound to the RESOLVED scene (the one the chrome shows), and only while it
 * is the route's scene and has reported ready, so a swap never writes one
 * scene's view into the next scene's link. Home carries none (no controls).
 */
export function useSceneUrlState(opts: {
    resolvedScene: ComputedRef<{ id: string; api: SceneExposedApi | null }>;
    storedControls: ComputedRef<StoredAnimationGroupControlOptions>;
    bound: ComputedRef<boolean>;
}) {
    const machine = useSceneMachine();
    const scene = () => opts.resolvedScene.value.id;
    const controls = () => opts.storedControls.value;
    const channelNames = () =>
        opts.resolvedScene.value.api?.facility?.channels.map((c) => c.name) ?? [];

    const keys: UrlKey<any>[] = [
        {
            key: "anim",
            get: () => controls().selectedAnimation || channelNames()[0] || "",
            set: (v: string) => {
                controls().selectedAnimation = v;
            },
            fallback: () => channelNames()[0] ?? "",
            ...oneOf(channelNames),
            history: "push",
        } satisfies UrlKey<string>,
        {
            key: "pane",
            // The scene's stored pick (the projection can name another surface
            // while the scene's surface set is still settling).
            get: () => controls().selectedControl,
            set: (v: string) => {
                controls().selectedControl = v;
            },
            fallback: () => defaultControlSurfaceFor(scene()),
            // Read against the channel as it now stands (`anim` is applied
            // first), not the machine's set, which follows a tick behind: a
            // link naming Matrix and its own surface binds both.
            ...oneOf(() =>
                surfacesFor(
                    opts.resolvedScene.value.api?.facility,
                    controls().selectedAnimation ?? undefined,
                ) as readonly string[],
            ),
            history: "push",
        } satisfies UrlKey<string>,
        {
            key: "sheet",
            get: () => controls().isControlsPanelOpen !== false,
            set: (v: boolean) => {
                controls().isControlsPanelOpen = v;
            },
            fallback: controlsOpenAtRest,
            ...flag,
            // Opened by a press on the Controls seat: a push (and closing it
            // again goes Back); any other change of the sheet replaces.
            history: () => (takeSheetPress() ? "push" : "replace"),
            backOnUndo: true,
        } satisfies UrlKey<boolean>,
        {
            key: "ball",
            get: () => controls().ballPreview !== "hidden",
            set: (v: boolean) => {
                controls().ballPreview = v ? "shown" : "hidden";
            },
            fallback: () => true,
            ...flag,
            history: "replace",
        } satisfies UrlKey<boolean>,
        {
            key: "tl",
            get: () => controls().isTimelineExpanded === true,
            set: (v: boolean) => {
                controls().isTimelineExpanded = v;
            },
            fallback: () => false,
            ...flag,
            history: "replace",
        } satisfies UrlKey<boolean>,
        {
            key: "play",
            // The play INTENT (the scene's snapshot), not the status: a hidden
            // tab suspends the loop without the user pausing anything.
            get: () => machine.perScene.value[scene()]?.playing === true,
            set: (v: boolean) => machine.dispatch({ type: v ? "PLAY" : "PAUSE" }),
            fallback: () => opts.resolvedScene.value.api?.autoPlays === true,
            ...flag,
            history: "replace",
        } satisfies UrlKey<boolean>,
    ];

    // FORTY-SIXTH E2 — one options key per painting channel of the scene.
    const channelKeys = () =>
        (opts.resolvedScene.value.api?.facility?.channels ?? []).flatMap((c) =>
            c.animation ? [channelOptionsKey(c.name, c.animation)] : [],
        );

    useUrlState(() => [...keys, ...channelKeys()], {
        scene: () => (scene() === HOME_SCENE_ID ? null : scene()),
        ready: () =>
            opts.bound.value &&
            (machine.status.value === "playing" || machine.status.value === "paused"),
    });
}
