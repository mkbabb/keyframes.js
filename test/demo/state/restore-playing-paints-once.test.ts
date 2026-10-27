/**
 * OD19 residue-2 (COHESION §0gq.3) — a resumed restore paints once, in the loop.
 *
 * MEASURED (OD19 residue profile, real-GPU cell): SCENE_READY's restore runs in
 * the swap's View Transition update callback. It sampled and painted the saved
 * clocks there, and the resumed loop sampled and painted them again in the same
 * rendering step. On the cube that sample is a computed endpoint
 * (`var(--rotationX)`), so `probeBrowserScalar` forced a style recalc of the
 * half-mounted scene inside the commit (5-8 ms of sequence -> cube).
 *
 * The witness restores a playing snapshot of a cube-shaped channel (an
 * endpoint through `var()`, the custom property inline on the target) onto a
 * fresh group: the restore reads no style; the loop's first frame resolves the
 * endpoint and paints the restored clock. A paused restore still paints at
 * once. Born RED at `fc1a3383` (the playing restore read style).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { restoreGroupPlaybackState } from "../../../demo/state/scenePlaybackAdapters";

beforeAll(async () => {
    await warmKfEngine();
});

const makeGroup = () => {
    const target = document.createElement("div");
    target.style.setProperty("--turn", "360deg");
    document.body.append(target);
    const a = new CSSKeyframesAnimation({
        duration: 1000,
        iterationCount: "infinite",
        useWAAPI: false,
    } as never).fromString(`from { transform: rotateX(0deg); } to { transform: rotateX(var(--turn)); }`);
    a.name = "spin";
    a.setTargets(target);
    return { group: new AnimationGroup<any>(a), target };
};

const snap = (playing: boolean) => ({
    playing,
    started: true,
    animations: { spin: { t: 250, reversed: false, iteration: 0 } },
});

describe("a resumed restore paints once, in the loop", () => {
    let frames: FrameRequestCallback[];

    beforeEach(() => {
        frames = [];
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        document.body.replaceChildren();
    });

    it("a playing restore reads no style; the loop's first frame resolves the endpoint and paints", () => {
        const { group, target } = makeGroup();
        const styleReads = vi.spyOn(window, "getComputedStyle");
        restoreGroupPlaybackState(group, snap(true));
        expect(styleReads).not.toHaveBeenCalled();
        expect(target.style.transform).toBe("");
        expect(group.animations["spin"]!.animation.t).toBe(250);

        const due = frames.splice(0);
        expect(due.length).toBeGreaterThan(0);
        for (const cb of due) cb(performance.now());
        expect(target.style.transform).toMatch(/rotateX\(/);
        group.stop();
    });

    it("a paused restore still paints the restored clock at once", () => {
        const { group, target } = makeGroup();
        restoreGroupPlaybackState(group, snap(false));
        expect(target.style.transform).toMatch(/rotateX\(/);
        expect(frames).toHaveLength(0);
    });
});
