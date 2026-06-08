// H.W1 — the PURE reducer unit test.
//
// `transition(state, event) → state` is a pure function (no Vue, no DOM, no
// adapter calls). This file proves the two-orthogonal-axes contract directly:
// the PLAYBACK axis is `state.status`; the SCENE axis is `context.activeScene`;
// `context.perScene` keys playback BY scene. A scene switch (NAVIGATE) and a
// play/pause (PLAY/PAUSE) are DISTINCT events. Given the same (state, event) it
// always returns the same next state — the reducer never touches the live
// adapter (that is the store's effect layer).

import { describe, it, expect } from "vitest";
import {
    transition,
    type MachineState,
    type PlaybackSnapshot,
} from "../demo/@/components/custom/animation-controls/stores/sceneMachine";

const snap = (over: Partial<PlaybackSnapshot> = {}): PlaybackSnapshot => ({
    playing: false,
    started: false,
    animations: {},
    ...over,
});

const idleHome = (): MachineState => ({
    status: "idle",
    context: { activeScene: "home", perScene: {} },
});

describe("H.W1 reducer — the two orthogonal axes", () => {
    it("NAVIGATE moves the SCENE axis to `loading` and seeds a fresh snapshot", () => {
        const next = transition(idleHome(), { type: "NAVIGATE", to: "cube" });
        expect(next.status).toBe("loading"); // playback axis
        expect(next.context.activeScene).toBe("cube"); // scene axis
        expect(next.context.perScene["cube"]).toBeDefined();
    });

    it("SCENE_READY restores to `playing` when the snapshot was playing", () => {
        const state: MachineState = {
            status: "loading",
            context: {
                activeScene: "cube",
                perScene: { cube: snap({ playing: true, started: true }) },
            },
        };
        expect(transition(state, { type: "SCENE_READY" }).status).toBe("playing");
    });

    it("SCENE_READY restores to `paused` when the snapshot was paused", () => {
        const state: MachineState = {
            status: "loading",
            context: {
                activeScene: "cube",
                perScene: { cube: snap({ playing: false, started: true }) },
            },
        };
        expect(transition(state, { type: "SCENE_READY" }).status).toBe("paused");
    });

    it("PLAY and PAUSE are DISTINCT from NAVIGATE (the playback axis only)", () => {
        const playing: MachineState = {
            status: "playing",
            context: { activeScene: "cube", perScene: { cube: snap() } },
        };
        const paused = transition(playing, { type: "PAUSE" });
        expect(paused.status).toBe("paused");
        expect(paused.context.activeScene).toBe("cube"); // scene unchanged
        expect(paused.context.perScene["cube"]!.playing).toBe(false);

        const back = transition(paused, { type: "PLAY" });
        expect(back.status).toBe("playing");
        expect(back.context.perScene["cube"]!.playing).toBe(true);
        expect(back.context.perScene["cube"]!.started).toBe(true);
    });

    it("PLAY/PAUSE are inert in idle/loading (nothing to play yet)", () => {
        expect(transition(idleHome(), { type: "PLAY" }).status).toBe("idle");
        const loading: MachineState = {
            status: "loading",
            context: { activeScene: "cube", perScene: {} },
        };
        expect(transition(loading, { type: "PAUSE" })).toBe(loading);
    });

    it("NAVIGATE to the SAME scene is a no-op (the echo-guard reducer twin)", () => {
        const cube: MachineState = {
            status: "playing",
            context: { activeScene: "cube", perScene: { cube: snap() } },
        };
        expect(transition(cube, { type: "NAVIGATE", to: "cube" })).toBe(cube);
    });

    it("NAVIGATE to the same scene from idle still proceeds (the deep-link seed)", () => {
        const idleCube: MachineState = {
            status: "idle",
            context: { activeScene: "cube", perScene: {} },
        };
        const next = transition(idleCube, { type: "NAVIGATE", to: "cube" });
        expect(next.status).toBe("loading");
    });

    it("SCRUB records t onto the active snapshot without changing the status axis", () => {
        const state: MachineState = {
            status: "playing",
            context: {
                activeScene: "cube",
                perScene: { cube: snap({ animations: { a: { t: 0, reversed: false, iteration: 0 } } }) },
            },
        };
        const next = transition(state, { type: "SCRUB", t: 500 });
        expect(next.status).toBe("playing"); // unchanged
        expect(next.context.perScene["cube"]!.animations["a"]!.t).toBe(500);
        expect(next.context.perScene["cube"]!.progress).toBe(500);
    });

    it("SUSPEND parks at `suspended`; RESUME re-derives from the snapshot", () => {
        const playing: MachineState = {
            status: "playing",
            context: { activeScene: "cube", perScene: { cube: snap({ playing: true }) } },
        };
        const suspended = transition(playing, { type: "SUSPEND" });
        expect(suspended.status).toBe("suspended");
        expect(transition(suspended, { type: "RESUME" }).status).toBe("playing");
    });

    it("TAB_HIDDEN only suspends a playing scene; TAB_SHOWN re-derives", () => {
        const paused: MachineState = {
            status: "paused",
            context: { activeScene: "cube", perScene: { cube: snap() } },
        };
        // A paused scene is untouched by TAB_HIDDEN (only resume what IT paused).
        expect(transition(paused, { type: "TAB_HIDDEN" })).toBe(paused);

        const playing: MachineState = {
            status: "playing",
            context: { activeScene: "cube", perScene: { cube: snap({ playing: true }) } },
        };
        const hidden = transition(playing, { type: "TAB_HIDDEN" });
        expect(hidden.status).toBe("suspended");
        expect(transition(hidden, { type: "TAB_SHOWN" }).status).toBe("playing");
    });

    it("RESET clears the active snapshot and pauses", () => {
        const state: MachineState = {
            status: "playing",
            context: {
                activeScene: "cube",
                perScene: { cube: snap({ playing: true, started: true, progress: 0.7 }) },
            },
        };
        const next = transition(state, { type: "RESET" });
        expect(next.status).toBe("paused");
        expect(next.context.perScene["cube"]!.playing).toBe(false);
        expect(next.context.perScene["cube"]!.started).toBe(false);
        expect(next.context.perScene["cube"]!.progress).toBe(0);
    });

    it("the reducer is PURE — it never mutates its input state", () => {
        const state = idleHome();
        const frozen = JSON.stringify(state);
        transition(state, { type: "NAVIGATE", to: "easing" });
        expect(JSON.stringify(state)).toBe(frozen);
    });

    it("perScene keys playback BY scene — a cube switch does not touch easing's snapshot", () => {
        const state: MachineState = {
            status: "playing",
            context: {
                activeScene: "cube",
                perScene: {
                    cube: snap({ playing: true }),
                    easing: snap({ playing: false, progress: 0.42 }),
                },
            },
        };
        const next = transition(state, { type: "NAVIGATE", to: "easing" });
        expect(next.context.perScene["easing"]!.progress).toBe(0.42); // untouched
        expect(next.context.perScene["cube"]!.playing).toBe(true); // untouched
    });
});
