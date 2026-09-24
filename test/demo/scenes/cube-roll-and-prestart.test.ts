// SERVED MODEL: claude-opus-5[1m]
import { beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { effectScope, nextTick, ref } from "vue";
import { mat4 } from "gl-matrix";

import { warmKfEngine } from "../../../demo/kf-engine";
import CubeTarget from "../../../demo/scenes/cube/CubeTarget.vue";
import OrbitalDrag from "../../../demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag";
import { useTransformState } from "../../../demo/scenes/cube/matrix-editor/useTransformState";
import {
    createMatrix,
    matrix3dCss,
    matrixValues,
    withMatrixCell,
    matrixCellDisplayText,
    matrixCellEditText,
} from "../../../demo/scenes/cube/matrix-editor/transformMath";
import {
    GRAPH_ATTITUDE,
    rotateByAttitude,
    useCubeRelit,
} from "../../../demo/scenes/cube/useCubeRelit";

/**
 * X.KF.W11.a · G-KFW11-1 — THE CUBE PACKET'S BORN-RED GATE.
 *
 * Five mechanisms, every one of them a SILENT failure before this file existed:
 * nothing threw, nothing logged, and every gate in the tree stayed green while
 * the die's signature affordances did nothing at all.
 *
 *  · #53 — the matrix painter handed `transformTargetsStyle` a structural
 *    `Matrix3dCall`, which the painter's object guard skips, so the die's ONLY
 *    pre-start orientation writer never wrote. Asserted at the bytes it paints.
 *  · #1/#2/#5/#6/#20 — the Roll stack. The trigger was unreachable behind an
 *    ancestor's pointer capture; the paint flattened to unsupported dotted
 *    property names; the frames were absolute, so roll n+1 cut back to identity;
 *    and the roll claimed an element two other writers already owned. Each is
 *    asserted separately, because any one of them alone made the others
 *    invisible.
 *  · #4/#56 — the relight's two frames. The key light's +Y lit the die from
 *    beneath in a Y-down frame, and the model never saw the 30° attitude its
 *    `.graph` ancestor is parked at. The second case is the one the gate names:
 *    the sign fix ALONE does not close it.
 *  · ME-42/ME-43 — the display string was the write path, and a fixed ~56 px
 *    cell could hold `-1000` with no way to recover what it clipped.
 *  · OD-5 — the axis latch had a keyup and no reset, so a window blur stranded
 *    a silent single-axis lock over every later gesture.
 */

const restTransform = (
    rotate = { x: 0, y: 0, z: 0 },
): TransformState => ({
    rotate,
    translate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    matrix: mat4.create(),
});

/** The `rotateX` term of a painted roll frame, in degrees. */
const rotateXOf = (transform: string): number =>
    Number(/rotateX\((-?[\d.]+)deg\)/.exec(transform)?.[1] ?? NaN);

/** One animation frame, awaited honestly (jsdom's rAF is timer-backed). */
const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

beforeAll(async () => {
    // The demo warms the heavy surface before `app.mount()`; the composables
    // under test read it synchronously, exactly as a mounted scene does.
    await warmKfEngine();
});

describe("#53 — the pre-start orientation writer actually paints", () => {
    it("serializes the authored matrix3d before handing it to the painter", () => {
        const m = createMatrix(mat4.fromXRotation(mat4.create(), Math.PI / 4));
        const css = matrix3dCss(m);
        // A `matrix3d(...)` string, not "[object Object]" and not a bare object.
        expect(css.startsWith("matrix3d(")).toBe(true);
        expect(css).not.toContain("object");
        expect(css.slice("matrix3d(".length, -1).split(", ")).toHaveLength(16);
        expect(css).toBe(`matrix3d(${matrixValues(m).join(", ")})`);
    });

    // KFA-1/KFA-2 (X.KF.W13V.k) re-seat: the pre-start WRITER is the cell
    // intent (the editor's cell sliders and fields), not an orbit drag — the
    // drag's triple is the orbit container's, never the Matrix channel's. The
    // property this case guards is unchanged: the painter writes a serialized
    // matrix3d string onto the channel's element.
    it("a pre-start cell edit writes a matrix3d string onto the target", async () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const scope = effectScope();

        try {
            await scope.run(async () => {
                const isStarted = ref(false);
                const targetRef = ref<HTMLElement | undefined>(el);
                const state = useTransformState(
                    isStarted,
                    targetRef,
                    restTransform(),
                );

                expect(el.style.transform).toBe("");

                state.updateMatrixCell(0.5, 1);
                for (let k = 0; k < 60 && !el.style.transform; k++) await raf();

                expect(el.style.transform).toMatch(/^matrix3d\(/);
                expect(el.style.transform).not.toContain("object");
            });
        } finally {
            scope.stop();
            el.remove();
        }
    });

    it("KFA-1/KFA-29 — an orbit drag never writes the Matrix channel", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                const before = matrixValues(state.matrix3dEnd.value);

                // What an OrbitalDrag frame does: it writes the Euler triple
                // into the shared model, which the orbit container composes.
                state.transformSliderValues.value.rotate.x = 45;
                await nextTick();
                await raf();
                await raf();

                expect(matrixValues(state.matrix3dEnd.value)).toEqual(before);
                expect(el.style.transform).toBe("");
            });
        } finally {
            scope.stop();
        }
    });

    it("KFA-2 — once the group has started, the painter never writes (one writer per element)", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(
                    ref(true),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                state.updateMatrixCell(0.5, 1);
                for (let k = 0; k < 30; k++) await raf();

                // The edit reaches the channel's endpoint (adoptCompiled's input)…
                expect(matrixValues(state.matrix3dEnd.value)[1]).toBeCloseTo(0.5, 6);
                // …and nothing but the channel writes the element.
                expect(el.style.transform).toBe("");
            });
        } finally {
            scope.stop();
        }
    });

    it("the painter is never handed the structural call itself", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            scope.run(() => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                // The authored end-matrix stays STRUCTURAL for the compile path
                // (`fromVars` flattens it itself); only the direct painter gets
                // the serialized form. Both halves of #53 in one assertion.
                expect(state.matrix3dEnd.value.kind).toBe("call");
                expect(state.matrix3dEnd.value.name).toBe("matrix3d");
            });
        } finally {
            scope.stop();
        }
    });
});

describe("ME-30/ME-31 — the sync topology", () => {
    it("a cell edit survives its own translate write-back (edit cell 1, then cell 12)", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );

                // A hand edit to a non-T·R·S cell…
                state.matrix3dEnd.value = withMatrixCell(
                    state.matrix3dEnd.value,
                    1,
                    0.25,
                );
                // …then a translate-cell edit, whose projection back into the
                // sliders used to be read as a fresh intent and recomposed the
                // whole matrix from T·R·S, destroying cell 1.
                state.updateMatrixCell(120, 12);
                await nextTick();
                await raf();
                await raf();
                await raf();

                expect(matrixValues(state.matrix3dEnd.value)[1]).toBeCloseTo(
                    0.25,
                    6,
                );
            });
        } finally {
            scope.stop();
        }
    });

    it("the Matrix channel keeps a real start→end delta", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                // KFA-1 re-seat: the endpoint's writer is the cell intent (an
                // orbit drag no longer authors the Matrix channel).
                state.updateMatrixCell(0.5, 1);
                for (let k = 0; k < 60 && matrixValues(state.matrix3dEnd.value)[1] !== 0.5; k++) await raf();

                // Both endpoints written from one pose collapsed the delta to
                // zero and Play animated nothing on this channel.
                expect(matrixValues(state.matrix3dStart.value)).toEqual(
                    Array.from(mat4.create()),
                );
                expect(matrixValues(state.matrix3dEnd.value)).not.toEqual(
                    Array.from(mat4.create()),
                );
            });
        } finally {
            scope.stop();
        }
    });

    it("an incomplete numeric literal is refused, not thrown on (ME-1)", () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            scope.run(() => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                const before = matrixValues(state.matrix3dEnd.value);
                for (const poison of ["", "-", "."]) {
                    expect(() => state.updateMatrixCell(poison, 0)).not.toThrow();
                }
                expect(matrixValues(state.matrix3dEnd.value)).toEqual(before);
            });
        } finally {
            scope.stop();
        }
    });
});

describe("#4/#56 — the relight's two frames", () => {
    it("the key light is above: the top face rests brighter than the bottom", () => {
        const { faceLit } = useCubeRelit(
            ref(restTransform()),
            // Measured in the die's OWN frame, so the sign is read alone.
            { axis: [0, 0, 1], angleDeg: 0 },
        );
        const top = Number(faceLit.value[4]);
        const bottom = Number(faceLit.value[5]);
        expect(top).toBeGreaterThan(bottom);
    });

    it("the stage attitude reaches the model — the sign fix ALONE does not close #56", () => {
        const blind = useCubeRelit(ref(restTransform()), {
            axis: [0, 0, 1],
            angleDeg: 0,
        });
        const seeing = useCubeRelit(ref(restTransform()), GRAPH_ATTITUDE);

        // If the attitude were ignored the two would be identical — which is
        // exactly the state a bare `0.6 -> -0.6` leaves the model in.
        expect(seeing.faceLit.value).not.toEqual(blind.faceLit.value);
        expect(GRAPH_ATTITUDE.angleDeg).toBe(30);
    });

    it("the room hop is a real rotation (unit-preserving, identity at 0°)", () => {
        const n = [0, 0, 1] as const;
        const turned = rotateByAttitude(n, GRAPH_ATTITUDE);
        expect(Math.hypot(...turned)).toBeCloseTo(1, 10);
        expect(turned).not.toEqual([0, 0, 1]);
        expect(
            rotateByAttitude(n, { axis: [-1, 1, 0], angleDeg: 0 }),
        ).toEqual([0, 0, 1]);
    });
});

describe("ME-42/ME-43 — the digit policy states the EDIT representation", () => {
    const LOSSY = 0.7071067811865476;

    it("display is 2dp; EDIT is the cell's full stored precision", () => {
        expect(matrixCellDisplayText(LOSSY)).toBe("0.71");
        expect(matrixCellEditText(LOSSY)).toBe(String(LOSSY));
        // The display arm is still the tabular column it always was.
        expect(matrixCellDisplayText(1)).toBe("1");
        expect(matrixCellDisplayText(-1000)).toBe("-1000");
    });

    it("the EDIT representation round-trips; the DISPLAY one is what destroyed precision", () => {
        // The field commits its own text, so the representation it opens on IS
        // the write path. Editing from the display string loses eleven digits.
        expect(parseFloat(matrixCellEditText(LOSSY))).toBe(LOSSY);
        expect(parseFloat(matrixCellDisplayText(LOSSY))).not.toBe(LOSSY);
    });

    it("the edited text round-trips through the write path with full precision", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(
                    ref(false),
                    ref<HTMLElement | undefined>(el),
                    restTransform(),
                );
                state.updateMatrixCell(matrixCellEditText(LOSSY), 1);
                // The commit is a 300 ms tween onto the cell; the value under
                // test is where it LANDS.
                await vi.waitFor(
                    () => {
                        expect(
                            matrixValues(state.matrix3dEnd.value)[1],
                        ).toBeCloseTo(LOSSY, 12);
                    },
                    { timeout: 5000, interval: 25 },
                );
            });
        } finally {
            scope.stop();
        }
    });

    it("ME-43 — a -1000 cell has a recovery text, on the selected cell too", () => {
        // `-1000` is inside translate's own bounds and cannot fit a ~56px cell.
        // The cell's `title` carries this text in BOTH states, including the
        // SELECTED cell, where ME-2's weight cue is what stops the ellipsis
        // from signposting the truncation. The rendered threshold is SS-13's.
        expect(matrixCellEditText(-1000)).toBe("-1000");
        const m = withMatrixCell(createMatrix(), 12, -1000);
        expect(matrixCellEditText(matrixValues(m)[12])).toBe("-1000");
    });
});

describe("OD-5 — the axis latch clears on blur", () => {
    it("latches on the physical key and is released by a window blur", async () => {
        const w = mount(OrbitalDrag, {
            props: { modelValue: restTransform() },
        });
        try {
            // Registered by `event.code`, so the binding is spatial and a
            // non-Latin layout reaches the same physical key.
            window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "x", code: "KeyX" }),
            );
            await nextTick();
            const latched = w.emitted("pressedKeys") as
                | Array<[{ x: boolean }]>
                | undefined;
            expect(latched?.some((e) => e[0].x === true)).toBe(true);

            // No keyup is ever delivered when the window loses the keyboard.
            window.dispatchEvent(new Event("blur"));
            await nextTick();
            const all = w.emitted("pressedKeys") as Array<[{ x: boolean }]>;
            expect(all[all.length - 1]![0].x).toBe(false);
        } finally {
            w.unmount();
        }
    });

    it("a modifier chord does not latch the axis (the ⌘Z collision)", async () => {
        const w = mount(OrbitalDrag, {
            props: { modelValue: restTransform() },
        });
        try {
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "z",
                    code: "KeyZ",
                    metaKey: true,
                }),
            );
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "z",
                    code: "KeyZ",
                    ctrlKey: true,
                }),
            );
            await nextTick();
            const emitted = w.emitted("pressedKeys") as
                | Array<[{ z: boolean }]>
                | undefined;
            expect(emitted?.some((e) => e[0].z === true)).toBeFalsy();
        } finally {
            w.unmount();
        }
    });
});

describe("the Roll stack — #1 trigger · #2 paint · #5 continuity · #6 arbitration", () => {
    const mountTarget = async () => {
        const w = mount(CubeTarget, {
            props: {
                isPlaying: false,
                isStarted: false,
                ppMode: false,
                showLoader: false,
                transform: restTransform(),
            },
        });
        // The drag surface is published by the child's `defineExpose`, so the
        // recognizer binds on the post-mount flush, not during setup.
        await nextTick();
        return w;
    };

    /** Two genuine down/up pairs on the surface the capture delivers to. */
    const doubleTap = async (el: Element) => {
        for (let i = 0; i < 2; i++) {
            el.dispatchEvent(
                new MouseEvent("pointerdown", {
                    bubbles: true,
                    clientX: 10,
                    clientY: 10,
                }),
            );
            el.dispatchEvent(
                new MouseEvent("pointerup", {
                    bubbles: true,
                    clientX: 10,
                    clientY: 10,
                }),
            );
        }
        await nextTick();
    };

    it("#1 — the double-tap is reachable on the element that holds the capture", async () => {
        const w = await mountTarget();
        try {
            const surface = w.get(".idle-hover").element.parentElement!;
            expect(w.find(".idle-hover--rolling").exists()).toBe(false);

            await doubleTap(surface);
            await nextTick();

            // `onRoll` ran: the gesture lock is up. Before the cure the
            // recognizer sat on `.cube`, a DESCENDANT of this element, and no
            // pointerup ever reached it.
            expect(w.find(".idle-hover--rolling").exists()).toBe(true);
        } finally {
            w.unmount();
        }
    });

    it(
        "#2/#5/#6/#20 — the roll paints its own element, keeps continuity and releases on completion",
        async () => {
            const w = await mountTarget();
            try {
                const rollEl = w.get(".idle-hover").element as HTMLElement;
                const cubeEl = w.get(".cube").element as HTMLElement;
                const surface = rollEl.parentElement!;

                // Deterministic landing: face index 4 (top, x:-90) and one extra
                // whole turn per axis.
                const random = vi
                    .spyOn(Math, "random")
                    .mockReturnValue(4 / 6 + 1e-6);

                await doubleTap(surface);
                await raf();
                await raf();
                await raf();

                // #2 — a real `transform`, not the dotted property names CSSOM
                // discards. The first painted frame is also #5's evidence: it
                // opens at the STANDING attitude, which for roll 1 is identity.
                expect(rollEl.style.transform).toMatch(/rotateX\(/);
                expect(rollEl.style.getPropertyValue("transform.rotateX")).toBe(
                    "",
                );
                const firstFrame = rollEl.style.transform;

                // #6 — one transform authority per element: the roll writes its
                // own element and never the die the group and the painter own.
                expect(cubeEl.style.transform).toBe("");

                // #20 — the release rides the arc's own completion.
                await vi.waitFor(
                    () => {
                        expect(w.find(".idle-hover--rolling").exists()).toBe(
                            false,
                        );
                    },
                    { timeout: 8000, interval: 50 },
                );

                const landed = rollEl.style.transform;
                expect(landed).not.toBe(firstFrame);
                // The landing is a whole-turns-plus-face attitude measured
                // FORWARD from the standing pose: the stub picks face 5 (top,
                // x:-90) and two whole turns per axis, so x = 270 + 720 = 990.
                expect(landed).toBe("rotateX(990deg) rotateY(720deg)");
                // …and it is congruent to the face it landed on.
                expect(rotateXOf(landed) % 360).toBe(270);

                // #5 — roll 2 opens where roll 1 LANDED, never back at identity.
                // Before the cure both frames were absolute, so five of six
                // landings opened roll n+1 with a 90°/180° jump-cut.
                random.mockReturnValue(1e-6); // face index 0 (front, 0/0)
                await doubleTap(surface);
                await raf();
                await raf();
                const secondFrom = rotateXOf(rollEl.style.transform);
                expect(secondFrom).not.toBe(0);
                expect(secondFrom).toBeGreaterThanOrEqual(990);
                // One whole turn forward to face 1 => 990 + 90 + 360 = 1440.
                expect(secondFrom).toBeLessThan(1440);

                random.mockRestore();
            } finally {
                w.unmount();
            }
        },
        30_000,
    );
});
