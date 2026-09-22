/**
 * X.KF.W13T.e · OA-9 (§0ao.1) — "the animations do not run": the witness.
 *
 * MEASURED ROOT (live, chromium + webkit, light + dark): the easing clock DID
 * advance; the SUBJECT did not. `EasingTarget` observed the producer
 * ToggleGroup's component `$el` — the fragment's leading TEXT anchor — and
 * `ResizeObserver.observe(Text)` threw inside the mount flush. The throw
 * aborted the rest of that post-flush queue, so the specimen painter never
 * registered (29 balls pinned at 0) and the sidebar Sliders' thumbs never
 * registered with their roots (the scrub was dead to the pointer, OA-8).
 *
 * The witness mounts the REAL `EasingTarget` over the REAL `useEasingDemo`
 * behind a ResizeObserver that refuses a non-Element exactly as the browsers
 * do, plays for 500 ms of rAF time, and asserts (1) no error escaped the mount,
 * (2) every observed target is an Element, (3) progress > 0, and (4) the
 * specimen balls moved. Born RED at the pre-cure bytes (the throw).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../../demo/scenes/easing/easingKeys";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

beforeAll(async () => {
    await warmKfEngine();
});

/** The browsers' contract: `observe` takes an Element or throws a TypeError. */
class StrictResizeObserver {
    static targets: unknown[] = [];
    constructor(_cb: ResizeObserverCallback) {}
    observe(target: unknown) {
        StrictResizeObserver.targets.push(target);
        if (!(target instanceof Element)) {
            throw new TypeError(
                "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element'.",
            );
        }
    }
    unobserve() {}
    disconnect() {}
}

/** Every tile is on screen (the drawer is unscrolled): report each observed
 *  stage as intersecting, so the paint walk's visibility gate admits it. */
class OnScreenIntersectionObserver {
    constructor(
        private readonly cb: (
            entries: Pick<IntersectionObserverEntry, "target" | "isIntersecting">[],
        ) => void,
    ) {}
    observe(target: Element) {
        this.cb([{ target, isIntersecting: true }]);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

const RAIL_PX = 160;

describe("OA-9 — the easing specimens run when the scene plays", () => {
    let host: HTMLElement;
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");

    beforeEach(() => {
        StrictResizeObserver.targets = [];
        vi.stubGlobal("ResizeObserver", StrictResizeObserver);
        vi.stubGlobal("IntersectionObserver", OnScreenIntersectionObserver);
        // jsdom lays nothing out: give the specimen rails a width so a moving
        // phase is a moving ball.
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            configurable: true,
            get(this: HTMLElement) {
                return this.classList.contains("tile-stage") ? RAIL_PX : 0;
            },
        });
        vi.useFakeTimers({
            toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"],
        });
        host = document.createElement("div");
        document.body.appendChild(host);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        if (clientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidth);
        host.remove();
    });

    it("plays for 500 ms: no mount error, an Element observed, progress > 0, the balls moved", async () => {
        const { default: EasingTarget } = await import(
            "../../../demo/scenes/easing/EasingTarget.vue"
        );
        let demo!: ReturnType<typeof useEasingDemo>;
        const errors: unknown[] = [];
        const app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    provide(EASING_DEMO_KEY, demo);
                    // The App's own provider (App.vue) — CopyButton's Tooltip needs it.
                    return () => h(TooltipProvider, null, { default: () => h(EasingTarget) });
                },
            }),
        );
        app.config.errorHandler = (err) => {
            errors.push(err);
        };
        app.mount(host);
        // `wirePainter` awaits one tick before it snapshots the tiles.
        await nextTick();
        await nextTick();

        expect(errors).toEqual([]);
        expect(StrictResizeObserver.targets.length).toBeGreaterThan(0);
        for (const t of StrictResizeObserver.targets) expect(t).toBeInstanceOf(Element);

        const machine = useSceneMachine();
        machine.dispatch({ type: "NAVIGATE", to: "easing" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        demo.play();
        vi.advanceTimersByTime(500);

        expect(demo.liveProgress()).toBeGreaterThan(0);
        const moved = [...host.querySelectorAll<HTMLElement>(".tile-ball")].filter((el) => {
            const x = /translateX\(([-\d.]+)px\)/.exec(el.style.transform)?.[1];
            return x !== undefined && Number(x) > 0;
        });
        expect(moved.length).toBeGreaterThan(0);

        app.unmount();
        // The first import of the real SFC graph (EasingTarget → glass-ui →
        // value.js) is transform-bound; under a loaded runner it outlasts the 5 s
        // default, so the case declares its budget (the D59 precedent).
    }, 30_000);
});
