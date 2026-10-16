/**
 * X.KF.W13X.r3res2a · COHESION §0fj item 1 — the easing scene's RESET order.
 *
 * MEASURED at kf `fa09924b` (`useEasingDemo.ts:268` · `:306-313`): the easing
 * scene handed `useSweepScene` no `reset` member, and its own `reset()` rewound
 * the sweep in its body and dispatched RESET last. The dock's Reset, `R` and
 * `Escape` do not call that verb: all three end at the machine's one RESET
 * (`useAnimationGroupActions.reset`), whose effect drives the active scene
 * through the contract's `adapter?.reset?.()` (KFA-39). With no body behind
 * that member the machine rested `paused` while the sweep kept its phase: the
 * loop's stop-reconcile then wrote the live value back into `progress`.
 *
 * The witness drives the REAL `useEasingDemo` on a faked rAF clock, registered
 * with the machine exactly as the shell binding registers it, and actuates
 * Reset on each of the three paths the owner presses. Each must rest at 0.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, shallowRef } from "vue";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { useAnimationGroupActions } from "@components/instrument/transport/composables/useAnimationGroupActions";
import { useControlsKeyboardShortcuts } from "@components/instrument/transport/composables/useControlsKeyboardShortcuts";
import type { StoredAnimationGroupControlOptions } from "@state";

beforeAll(async () => {
    await warmKfEngine();
});

type Demo = ReturnType<typeof useEasingDemo>;

function makeGroup(): AnimationGroup<any> {
    const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
        "from { opacity: 0; } to { opacity: 1; }",
    );
    anim.name = "fade";
    anim.targets = [document.createElement("div")];
    return new AnimationGroup(anim as any);
}

const storedOptions = (): StoredAnimationGroupControlOptions => ({
    selectedControl: "controls",
    selectedAnimation: "fade",
    keyframeControls: {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    },
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
});

describe("easing · the dock Reset / R / Escape rest the sweep at phase 0 (§0fj 1)", () => {
    let host: HTMLElement;
    let app: ReturnType<typeof createApp> | null = null;
    let release: (() => void) | null = null;

    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"],
        });
        host = document.createElement("div");
        document.body.appendChild(host);
    });

    afterEach(() => {
        release?.();
        release = null;
        app?.unmount();
        app = null;
        vi.useRealTimers();
        host.remove();
    });

    /** The easing scene + the transport's Reset (dock verb and its R / Escape
     *  shortcuts), registered with the machine as the shell binding does. */
    const mountScene = () => {
        let demo!: Demo;
        let dockReset!: () => void;
        app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    const group = makeGroup();
                    const actions = useAnimationGroupActions({
                        getGroup: () => group,
                        storedControls: storedOptions(),
                        findAnimationGroupObject: () => undefined,
                        syncPlayState: () => {},
                    });
                    dockReset = actions.reset;
                    useControlsKeyboardShortcuts({
                        toggleAnimationGroup: () => {},
                        reset: actions.reset,
                        resetIconSpin: () => {},
                        getActiveT: () => 0,
                        scrubActive: () => {},
                        cycleAnimation: () => {},
                        switchTab: () => {},
                        commands: shallowRef(null),
                    });
                    return () => h("div");
                },
            }),
        );
        app.mount(host);
        const machine = useSceneMachine();
        release = machine.register("easing", demo.scenePlayback);
        machine.dispatch({ type: "NAVIGATE", to: "easing" });
        machine.dispatch({ type: "SCENE_READY" });
        return { demo, machine, dockReset };
    };

    const FRAME = 16;
    const press = (key: string) =>
        document.body.dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
        );

    const paths: Array<[string, (s: ReturnType<typeof mountScene>) => void]> = [
        ["the dock Reset", (s) => s.dockReset()],
        ["R", () => press("r")],
        ["Escape", () => press("Escape")],
    ];

    for (const [name, actuate] of paths) {
        it(`${name} rests the sweep at phase 0, paused`, () => {
            const s = mountScene();
            s.machine.dispatch({ type: "PLAY" });
            vi.advanceTimersByTime(600); // phase 0.2 → p ≈ 0.4, mid-sweep
            expect(s.demo.liveProgress()).toBeGreaterThan(0.2);

            actuate(s);
            vi.advanceTimersByTime(FRAME * 4);

            expect(s.machine.status.value).toBe("paused");
            expect(s.demo.liveProgress()).toBe(0);
            expect(s.demo.progress.value).toBe(0);

            // The rested sweep stays at rest, and a fresh Play rises from 0.
            vi.advanceTimersByTime(FRAME * 10);
            expect(s.demo.liveProgress()).toBe(0);
            s.machine.dispatch({ type: "PLAY" });
            vi.advanceTimersByTime(FRAME);
            expect(s.demo.liveProgress()).toBeLessThan(0.03);
        });
    }

    it("the scene's own reset verb is the machine's RESET (one rewind, at 0)", () => {
        const s = mountScene();
        s.machine.dispatch({ type: "PLAY" });
        vi.advanceTimersByTime(600);
        s.demo.reset();
        vi.advanceTimersByTime(FRAME * 4);
        expect(s.machine.status.value).toBe("paused");
        expect(s.demo.liveProgress()).toBe(0);
        expect(s.demo.progress.value).toBe(0);
    });
});
