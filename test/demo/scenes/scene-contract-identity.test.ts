// proof:scene-contract-identity — H.W1 S2 · WV-W1-HIGH-3 (the raw-rAF round-trip
// the group gate MISSES).
//
// The dual `ScenePlayback` contract `{snapshot, restore, suspend, resume,
// isPlaying}` has TWO implementations — one per playback architecture. The
// machine calls the CONTRACT, never the group, so suspend/restore is
// deterministic across BOTH families. proof:group-snapshot-identity covers the
// AnimationGroup family ONLY (cube/amiga/square) and passes VACUOUSLY on the
// literal D12 repro (easing — which has NO AnimationGroup position). THIS gate
// bites the actual raw-rAF loss: it round-trips the raw-rAF scene's
// progress/isPlaying/startTime through the contract AND drives the named
// easing↔cube / cube↔easing cross-pairs so neither architecture's state is
// dropped at a scene boundary.
//
// BITE: reds the instant the raw-rAF adapter stops round-tripping progress/
// isPlaying (e.g. re-introducing the deleted private `isPlaying` shadow, or
// dropping `progress` from PlaybackSnapshot) — the saved scrub position / play
// intent is lost across a suspend/restore and the cross-pair desyncs. Greens on
// S2's ScenePlayback contract.

import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/utils/kfEngine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";

// L.W8 S1 ED-3 — the demo composables read the HEAVY engine surface synchronously
// via the warmed `kfEngine()`; the unit harness has no app boot, so warm it once.
beforeAll(async () => {
    await warmKfEngine();
});
import {
    createGroupAdapter,
    createRafAdapter,
    type RafSceneHandle,
} from "../../../demo/state/scenePlaybackAdapters";
import type { ScenePlayback } from "../../../demo/state/sceneMachine";

// ── A controllable rAF queue (mirrors scene-raf-leak's harness) ──────────────
// A raw-rAF scene's loop is real; we drive it deterministically so isPlaying()
// (which gates on `playback.running`) is observable without a wall clock.
function installControllableRaf() {
    let nextId = 1;
    let queue = new Map<number, FrameRequestCallback>();
    const prevRaf = (window as any).requestAnimationFrame;
    const prevCancel = (window as any).cancelAnimationFrame;

    (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
        const id = nextId++;
        queue.set(id, cb);
        return id;
    };
    (window as any).cancelAnimationFrame = (id: number) => {
        queue.delete(id);
    };

    let clock = 0;
    return {
        flush(): number {
            clock += 16;
            const current = queue;
            queue = new Map();
            for (const cb of current.values()) cb(clock);
            return current.size;
        },
        pending(): number {
            return queue.size;
        },
        restore() {
            (window as any).requestAnimationFrame = prevRaf;
            (window as any).cancelAnimationFrame = prevCancel;
        },
    };
}

/** Seed the machine to a scene + status, mirroring the App lifecycle. */
function seed(scene: string, play: boolean) {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: scene });
    machine.dispatch({ type: "SCENE_READY" });
    if (play) machine.dispatch({ type: "PLAY" });
    else machine.dispatch({ type: "PAUSE" });
}

/** A fixture cube-style AnimationGroup (two named animations). */
function makeCubeGroup(): AnimationGroup<any> {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    a.name = "rotate";
    const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { transform: translateX(0px); }
        to { transform: translateX(100px); }
    `);
    b.name = "matrix";
    return new AnimationGroup(a, b);
}

describe("proof:scene-contract-identity — raw-rAF round-trip (the group gate misses this)", () => {
    let raf: ReturnType<typeof installControllableRaf>;
    beforeEach(() => {
        raf = installControllableRaf();
    });
    afterEach(() => {
        raf.restore();
    });

    it("createRafAdapter round-trips progress + isPlaying through snapshot()/restore()", () => {
        // A pure-handle round-trip — the contract surface in isolation, no Vue.
        // This is the irreducible raw-rAF identity the dummy `contractAnim`
        // group could never witness (it has no position).
        let progress = 0;
        let playing = false;
        let loopRunning = false;
        const handle: RafSceneHandle = {
            getProgress: () => progress,
            setProgress: (t) => {
                progress = t;
            },
            getPlaying: () => playing,
            setPlaying: (p) => {
                playing = p;
            },
            isLoopRunning: () => loopRunning,
            stopLoop: () => {
                loopRunning = false;
            },
            startLoop: () => {
                loopRunning = true;
            },
        };
        const adapter = createRafAdapter(handle);

        // Live state: scrubbed to 0.62, playing.
        progress = 0.62;
        playing = true;
        loopRunning = true;
        const snap = adapter.snapshot();

        // The snapshot carries the raw-rAF position the group snapshot lacks.
        expect(snap.progress).toBe(0.62);
        expect(snap.playing).toBe(true);
        expect(snap.animations).toEqual({}); // no AnimationGroup position

        // Tear the live state down (the unmount), then restore from the snap.
        progress = 0;
        playing = false;
        loopRunning = false;
        adapter.restore(snap);

        expect(progress).toBe(0.62); // scrub position re-seated
        expect(playing).toBe(true); // play intent re-seated
        expect(adapter.isPlaying()).toBe(true); // loop re-armed by restore()
    });

    it("a paused raw-rAF scene round-trips its position WITHOUT re-arming the loop", () => {
        // ST-5 parity for the raw-rAF family: a paused scene saves + restores its
        // scrub position, and restore() must NOT start the loop (no orphan rAF).
        let progress = 0;
        let playing = false;
        let loopRunning = true; // loop happens to be live at snapshot time
        const handle: RafSceneHandle = {
            getProgress: () => progress,
            setProgress: (t) => {
                progress = t;
            },
            getPlaying: () => playing,
            setPlaying: (p) => {
                playing = p;
            },
            isLoopRunning: () => loopRunning,
            stopLoop: () => {
                loopRunning = false;
            },
            startLoop: () => {
                loopRunning = true;
            },
        };
        const adapter = createRafAdapter(handle);

        progress = 0.33;
        playing = false; // paused intent
        const snap = adapter.snapshot();
        expect(snap.progress).toBe(0.33);
        expect(snap.playing).toBe(false);

        progress = 0;
        loopRunning = true;
        adapter.restore(snap);
        expect(progress).toBe(0.33); // position re-seated
        expect(playing).toBe(false); // still paused
        expect(loopRunning).toBe(false); // restore STOPPED the loop — no orphan
    });

    it("easing (the live D12 repro) exposes a raw-rAF adapter that round-trips progress/isPlaying", () => {
        // Bind to the ACTUAL easing scene's `scenePlayback` adapter — the literal
        // D12 reproduction. The easing loop gates on `machine.status === 'playing'`
        // (the private `isPlaying` shadow is DELETED, H.W1).
        const scope = effectScope();
        const easing = scope.run(() => useEasingDemo())!;
        try {
            seed("easing", true);
            easing.play();
            raf.flush();
            expect(raf.pending()).toBeGreaterThan(0); // the real loop is live

            const adapter = easing.scenePlayback as ScenePlayback;

            // Scrub to a known position, then capture.
            easing.progress.value = 0.5;
            const snap = adapter.snapshot();
            expect(snap.progress).toBe(0.5);
            expect(snap.playing).toBe(true); // machine.status === 'playing'

            // Suspend (the scene-leave path) — the loop stops, no orphan rAF.
            adapter.suspend();
            raf.flush();
            expect(easing.scenePlayback.isPlaying()).toBe(false);

            // Move the live state away (the remount equivalent), then restore.
            easing.progress.value = 0;
            adapter.restore(snap);
            expect(easing.progress.value).toBe(0.5); // scrub re-seated
            expect(adapter.isPlaying()).toBe(true); // loop re-armed
        } finally {
            scope.stop();
            raf.restore();
            raf = installControllableRaf();
        }
    });

    // ── The named easing↔cube cross-pairs (WV-W1-HIGH-3 — the required rows) ──
    // BOTH architectures' state must survive a scene boundary: the raw-rAF
    // easing snapshot does NOT corrupt the group's clock, and the group snapshot
    // does NOT clobber easing's progress. The machine keys playback BY scene
    // (perScene), so the two snapshots are disjoint — this asserts the contract
    // halves are independent and lossless across the pair.

    it("easing→cube: the raw-rAF snapshot and the group snapshot are disjoint + lossless", () => {
        // Easing leg (raw-rAF): scrubbed + playing.
        let easingProgress = 0.71;
        let easingPlaying = true;
        let easingLoop = true;
        const easingAdapter: ScenePlayback = createRafAdapter({
            getProgress: () => easingProgress,
            setProgress: (t) => {
                easingProgress = t;
            },
            getPlaying: () => easingPlaying,
            setPlaying: (p) => {
                easingPlaying = p;
            },
            isLoopRunning: () => easingLoop,
            stopLoop: () => {
                easingLoop = false;
            },
            startLoop: () => {
                easingLoop = true;
            },
        });

        // Cube leg (AnimationGroup): two animations at known clocks, started.
        const cube = makeCubeGroup();
        cube.started = true;
        cube.animations["rotate"]!.animation.t = 250;
        cube.animations["rotate"]!.animation.reversed = true;
        cube.animations["rotate"]!.animation.iteration = 1;
        cube.animations["matrix"]!.animation.t = 410;
        const cubeAdapter: ScenePlayback = createGroupAdapter(() => cube);

        const easingSnap = easingAdapter.snapshot();
        const cubeSnap = cubeAdapter.snapshot();

        // The raw-rAF snapshot carries `progress`, NO `animations`.
        expect(easingSnap.progress).toBe(0.71);
        expect(easingSnap.animations).toEqual({});
        // The group snapshot carries `animations`, NO `progress`.
        expect(cubeSnap.progress).toBeUndefined();
        expect(cubeSnap.animations["rotate"]).toEqual({
            t: 250,
            reversed: true,
            iteration: 1,
        });

        // Suspend easing on the way out (genuine SUSPEND), arrive at cube.
        easingAdapter.suspend();
        expect(easingAdapter.isPlaying()).toBe(false);

        // Restore cube from ITS snapshot — easing's progress is untouched.
        const fresh = makeCubeGroup();
        const freshAdapter = createGroupAdapter(() => fresh);
        freshAdapter.restore(cubeSnap);
        expect(fresh.animations["rotate"]!.animation.t).toBe(250);
        expect(fresh.animations["rotate"]!.animation.reversed).toBe(true);
        expect(easingProgress).toBe(0.71); // easing's position NOT clobbered
    });

    it("cube→easing: the group suspend does not strand the loop; easing restores its progress", () => {
        // Cube leg: playing group.
        const cube = makeCubeGroup();
        cube.started = true;
        cube.animations["rotate"]!.animation.t = 100;
        const cubeAdapter = createGroupAdapter(() => cube);
        const cubeSnap = cubeAdapter.snapshot();
        expect(cubeSnap.started).toBe(true);

        // Suspend the cube group on leave (no orphan loop), then arrive at easing.
        cubeAdapter.suspend();
        expect(cube.playing()).toBe(false);

        // Easing leg: restore a saved raw-rAF position + paused intent.
        let easingProgress = 0;
        let easingPlaying = true;
        let easingLoop = true;
        const easingAdapter = createRafAdapter({
            getProgress: () => easingProgress,
            setProgress: (t) => {
                easingProgress = t;
            },
            getPlaying: () => easingPlaying,
            setPlaying: (p) => {
                easingPlaying = p;
            },
            isLoopRunning: () => easingLoop,
            stopLoop: () => {
                easingLoop = false;
            },
            startLoop: () => {
                easingLoop = true;
            },
        });
        easingAdapter.restore({
            playing: false,
            started: true,
            animations: {},
            progress: 0.28,
        });
        expect(easingProgress).toBe(0.28); // raw-rAF position re-seated
        expect(easingLoop).toBe(false); // paused → loop stopped, no orphan rAF
        // The group's clock is untouched by easing's restore (disjoint stores).
        expect(cube.animations["rotate"]!.animation.t).toBe(100);
    });
});
