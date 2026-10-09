/**
 * X.KF.W13X.cube2 — R-r-2 CUBE-AUTOPLAY-FIRST-FRAME-THROW (value.js KF-W13.md
 * addendum (g), COHESION §0er).
 *
 * The served defect: on a cold load of `#/cube` the autoplay's first group
 * frame raised `BrowserScalarResolutionError: Could not resolve
 * "var(--rotationX)" for "transform"`, `RAFPlayback`'s `failFrame` wound the
 * loop down, and the die held its first tick while the transport read "Pause".
 * The Rotations channel's `100%` frame authors `rotateX(var(--rotationX))`
 * (`cubeMotion.ts`), and the property was declared only in the scoped
 * stylesheet rule `.cube` (`CubeTarget.css`). Whether the first frame could
 * read it was therefore a race between that sheet reaching the element and the
 * autoplay arming. The library is loud by design here (an unresolvable
 * endpoint is an error, never a silent 0), so the cure is ORDERING: the target
 * element carries its declaration from creation, before any frame can run.
 *
 * THE FORCED RACE. The demo project processes no CSS (vitest's `css.include`
 * is empty), so the component's scoped stylesheet never reaches the element:
 * the losing side of the race, every run. The precondition is asserted, not
 * assumed: no stylesheet in the document declares `--rotationX`. The witness
 * mounts the REAL `CubeTarget.vue`, hands its exposed elements to the REAL
 * `useCubeDemo` exactly as `CubeScene`'s `onMounted` does, and renders the
 * group's frames from the first. At the pre-cure bytes the first render
 * throws; with the declaration on the element it paints `rotateX(…)`.
 *
 * The dock miniature (`CubeMini.vue`) plays the same `cubeSpinKeyframes` on
 * its own die element under the same race (its declaration was a scoped rule
 * too), so its die is read by the same predicate.
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { createApp, h, ref } from "vue";
import type { App } from "vue";
import { mat4 } from "gl-matrix";
import { withSetup } from "../../support/withSetup";
import { kfEngine, warmKfEngine } from "../../../demo/kf-engine";
import CubeMini from "../../../demo/scenes/cube/CubeMini.vue";
import CubeTarget from "../../../demo/scenes/cube/CubeTarget.vue";
import { cubeSpinKeyframes } from "../../../demo/scenes/cube/cubeMotion";
import { useCubeDemo } from "../../../demo/scenes/cube/useCubeDemo";
import { createMatrix } from "../../../demo/scenes/cube/matrix-editor/transformMath";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";

type Exposed = {
    cubeEl: HTMLElement | null;
    bobEl: HTMLElement | null;
    poseEl: HTMLElement | null;
    graphEl: HTMLElement | null;
};

const sheetsDeclare = (name: string): boolean =>
    [...document.styleSheets].some((sheet) =>
        [...sheet.cssRules].some((rule) => rule.cssText.includes(name)),
    );

let apps: App[] = [];

afterEach(() => {
    for (const app of apps) app.unmount();
    apps = [];
    document.body.innerHTML = "";
});

describe("R-r-2 — the cube's first autoplay frame resolves var(--rotationX)", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("the mounted target declares --rotationX before the first group frame, with no stylesheet present", () => {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const target = ref<Exposed | null>(null);
        const transform = ref<TransformState>({
            rotate: { x: 0, y: 0, z: 0 },
            translate: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            matrix: mat4.create(),
        });
        const app = createApp({
            render: () =>
                h(CubeTarget, {
                    ref: (r: unknown) => {
                        target.value = r as Exposed | null;
                    },
                    isPlaying: true,
                    ppMode: false,
                    transform: transform.value,
                    "onUpdate:transform": (t: TransformState) => {
                        transform.value = t;
                    },
                }),
        });
        app.mount(host);
        apps.push(app);

        // The forced race: the scoped stylesheet has not reached the element.
        expect(sheetsDeclare("--rotationX")).toBe(false);

        const { cubeEl, bobEl, poseEl, graphEl } = target.value ?? ({} as Exposed);
        expect(cubeEl?.isConnected).toBe(true);
        if (!cubeEl || !bobEl || !poseEl || !graphEl) throw new Error("CubeTarget exposed no elements");

        const [demo, demoApp] = withSetup(() =>
            useCubeDemo(ref(createMatrix()), ref(createMatrix())),
        );
        apps.push(demoApp);
        demo.setTargets({ cubeEl, bobEl, poseEl, graphEl });
        const group = demo.animationGroup.value;
        const spin = demo.rotationAnim.value;

        const spins = new Set<string>();
        for (const t of [0, 1, 400, 800]) {
            for (const anim of [spin, demo.matrixAnim.value, demo.hoverAnim.value]) {
                group.setChildTime(anim, t);
            }
            expect(() => group.render()).not.toThrow();
            spins.add(cubeEl.style.transform);
        }
        group.stop();

        expect([...spins].every((s) => /rotateX\(/.test(s))).toBe(true);
        expect(spins.size).toBeGreaterThanOrEqual(3);
    });

    it("the dock miniature's die declares --rotationX before the spin's first frame, with no stylesheet present", () => {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp({ render: () => h(CubeMini, { live: false }) });
        app.mount(host);
        apps.push(app);

        expect(sheetsDeclare("--rotationX")).toBe(false);
        const die = host.querySelector<HTMLElement>('[data-layer="cube"]');
        expect(die?.isConnected).toBe(true);
        if (!die) throw new Error("CubeMini rendered no die");

        const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();
        const spin = new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes(
            cubeSpinKeyframes(),
        );
        const group = new AnimationGroup(spin);
        group.singleTarget = false;
        spin.setTargets(die);

        const spins = new Set<string>();
        for (const t of [0, 1, 400, 800]) {
            group.setChildTime(spin, t);
            expect(() => group.render()).not.toThrow();
            spins.add(die.style.transform);
        }
        group.stop();

        expect([...spins].every((s) => /rotateX\(/.test(s))).toBe(true);
        expect(spins.size).toBeGreaterThanOrEqual(3);
    });
});
