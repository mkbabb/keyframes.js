// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4panes — the spring discrete Entry's artifact, presented (found
 * reading UIA-KF-097's highlighter limb).
 *
 *   (1) At the scene's DEFAULT spring (Smooth: response 0.5 s, ζ 0.86 → a
 *       500 ms entry), the panel PRESENTS the real `compileToEntry` artifact.
 *       The emitter writes 500 ms as `0.5s` (`reverseCSSTime`, `ca8c0433`); the
 *       panel's own check spelled `500ms` by hand and refused a faithful
 *       artifact as "does not describe the card above".
 *   (UIA-KF-097's ink limb is `r4panes-artifact-ink.test.ts`.)
 *
 * The producer realm wall is answered as `starting-style-artifact.test.ts`
 * answers it: glass primitives are slot-rendering stubs; the Target, its
 * check, the composable, the engine and the emitter are all real.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ref, shallowRef } from "vue";
import { mount } from "@vue/test-utils";

const stub = vi.hoisted(() => ({
    module: async (entries: Record<string, string>) => {
        const { defineComponent, h } = await import("vue");
        return Object.fromEntries(
            Object.entries(entries).map(([name, tag]) => [
                name,
                defineComponent({
                    name,
                    inheritAttrs: false,
                    setup: (_props, { slots, attrs }) =>
                        () =>
                            h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
                }),
            ]),
        );
    },
}));

vi.mock("@mkbabb/glass-ui/button", () => stub.module({ Button: "button" }));
vi.mock("@mkbabb/glass-ui/card", () =>
    stub.module({ Card: "div", CardHeader: "header", CardTitle: "h2" }),
);
vi.mock("@mkbabb/glass-ui/chip", () => stub.module({ Chip: "span" }));
vi.mock("@mkbabb/glass-ui/collapsible", () =>
    stub.module({
        Collapsible: "div",
        CollapsibleContent: "div",
        CollapsibleTrigger: "div",
    }),
);
vi.mock("@mkbabb/glass-ui", () =>
    stub.module({
        Alert: "div",
        AlertDescription: "div",
        AlertTitle: "h3",
        Skeleton: "div",
    }),
);
vi.mock("@mkbabb/glass-ui/tooltip", () =>
    stub.module({ Tooltip: "div", TooltipContent: "div", TooltipTrigger: "div" }),
);

import StartingStyleTarget from "../../../demo/scenes/spring/StartingStyleTarget.vue";
import { entryTiming, useCompiledEntry } from "../../../demo/scenes/spring/useCompiledEntry";
import { SPRING_DEMO_KEY } from "../../../demo/scenes/spring/springKeys";
import { SPRING_PRESETS } from "../../../demo/scenes/spring/springPresets";
import { warmKfEngine } from "../../../demo/kf-engine";
import { withSetup } from "../../support/withSetup";

const SMOOTH = SPRING_PRESETS.find((p) => p.name === "smooth")!;

function demoAt(response: number, damping: number, css: string) {
    const visible = ref(true);
    return {
        visible,
        toggleDiscrete: () => {
            visible.value = !visible.value;
        },
        response: ref(response),
        dampingFraction: ref(damping),
        compiledEntry: shallowRef({
            timing: entryTiming(response, damping),
            result: { css, eligible: true, refusals: [] },
        }),
    };
}

const mountTarget = (demo: ReturnType<typeof demoAt>) =>
    mount(StartingStyleTarget, {
        global: { provide: { [SPRING_DEMO_KEY as symbol]: demo } },
    });

describe("X.KF.W13X.r4panes — the Entry artifact is presented at the default spring", () => {
    /** The REAL artifact at the default spring, from the REAL composable. */
    let smoothCss = "";

    beforeAll(async () => {
        await warmKfEngine();
        const [entry, app] = withSetup(() =>
            useCompiledEntry(
                () => SMOOTH.response,
                () => SMOOTH.dampingFraction,
            ),
        );
        try {
            for (let i = 0; i < 400 && entry.entry.value.result === null; i++) {
                await new Promise((r) => setTimeout(r, 5));
            }
            smoothCss = entry.entry.value.result?.css ?? "";
        } finally {
            app.unmount();
        }
        expect(smoothCss, "the shipped emitter produced no artifact").not.toBe("");
    }, 30_000);

    it("(1) at the default spring (a 500 ms entry the emitter spells 0.5s) the artifact is presented, not refused", () => {
        expect(entryTiming(SMOOTH.response, SMOOTH.dampingFraction).enter.durationMs).toBe(500);
        expect(smoothCss).toContain(" 0.5s ");
        const wrapper = mountTarget(demoAt(SMOOTH.response, SMOOTH.dampingFraction, smoothCss));
        try {
            expect(wrapper.find("code.artifact").exists()).toBe(true);
            expect(wrapper.text()).not.toMatch(/does not describe the card/i);
            expect(wrapper.findComponent({ name: "CopyButton" }).props("text")).toBe(smoothCss);
        } finally {
            wrapper.unmount();
        }
    });
});
