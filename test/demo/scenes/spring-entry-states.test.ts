/**
 * X.KF.W13X.springd — the Entry view's states and surfaces, as behaviour:
 * UIA-KF-207 (compiling / refused / mismatched are three surfaces), UIA-KF-208
 * (the dismissed stage names the card's slot), UIA-KF-209 (canon radius roles;
 * the preset label is the glass Chip) and UIA-KF-097 (an intrinsic-width verb,
 * a folded artifact, one meta caption, no disclaimer).
 *
 * Born RED at `034c8a44`. The stub demo publishes BOTH generations of the
 * composable's surface — `compiledEntryCss` (before the cure) and
 * `compiledEntry` (after) — so the pre-cure card mounts and the RED is each
 * assertion, not a missing member. The timing is built from the library's own
 * `springTimingFunction`, not the demo's helper, for the same reason.
 *
 * The producer realm wall is answered as `starting-style-artifact.test.ts`
 * answers it: glass primitives become slot-rendering stubs, so the subject's
 * own template, bindings and classes execute for real.
 */
import { describe, expect, it, vi } from "vitest";
import { ref, shallowRef } from "vue";
import { mount } from "@vue/test-utils";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { springTimingFunction } from "@mkbabb/keyframes.js";

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
import { SPRING_DEMO_KEY } from "../../../demo/scenes/spring/springKeys";

const SFC_SRC = readFileSync(
    resolve(process.cwd(), "demo/scenes/spring/StartingStyleTarget.vue"),
    "utf8",
);
const SFC_STYLE = SFC_SRC.slice(SFC_SRC.indexOf("<style scoped>"));

const leg = (durationMs: number, dampingFraction: number) => ({
    durationMs,
    easing: springTimingFunction({
        response: 0.5,
        dampingFraction,
        maxDuration: durationMs / 1000,
    }),
});
const TIMING = { enter: leg(500, 0.86), exit: leg(590, 1) };

type Result = { css: string; eligible: boolean; refusals: { name: string; reason: string; message: string }[] } | null;

function mountWith(result: Result, visible = true) {
    const demo = {
        visible: ref(visible),
        toggleDiscrete: () => {},
        response: ref(0.5),
        dampingFraction: ref(0.86),
        compiledEntryCss: ref(result?.css ?? ""),
        compiledEntry: shallowRef({ timing: TIMING, result }),
    };
    return mount(StartingStyleTarget, {
        global: { provide: { [SPRING_DEMO_KEY as symbol]: demo } },
    });
}

/** The declarations of the first rule whose selector is EXACTLY `selector`. */
function rule(css: string, selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(css);
    return m?.[1] ?? "";
}

describe("X.KF.W13X.springd — the Entry view's states and surfaces", () => {
    it("UIA-KF-207 — compiling, refused and mismatched are three distinct surfaces", () => {
        const compiling = mountWith(null);
        const refused = mountWith({
            css: "",
            eligible: false,
            refusals: [{ name: ".discrete-card", reason: "entry-iteration", message: "an entry runs once" }],
        });
        const mismatched = mountWith({ css: ".elsewhere { opacity: 0 }", eligible: true, refusals: [] });
        try {
            expect(compiling.find('[data-stub="Skeleton"]').exists()).toBe(true);
            const warn = refused.find('[data-stub="Alert"]');
            expect(warn.exists() && warn.attributes("tone")).toBe("warning");
            expect(refused.text()).toContain("an entry runs once");
            const danger = mismatched.find('[data-stub="Alert"]');
            expect(danger.exists() && danger.attributes("tone")).toBe("destructive");
        } finally {
            compiling.unmount();
            refused.unmount();
            mismatched.unmount();
        }
    });

    it("UIA-KF-208 — the dismissed stage marks the card's slot", () => {
        const w = mountWith(null, false);
        try {
            const slot = w.find(".stage-viewport [data-empty]");
            expect(slot.exists()).toBe(true);
            expect(rule(SFC_STYLE, ".entry-slot[data-empty]")).toMatch(/outline:[^;]*dashed/);
        } finally {
            w.unmount();
        }
    });

    it("UIA-KF-209 — canon radius roles, and the preset label is the glass Chip", () => {
        expect(rule(SFC_STYLE, ".artifact")).toMatch(/border-radius:\s*var\(--radius-field\)/);
        expect(rule(SFC_STYLE, ".discrete-card")).toMatch(/border-radius:\s*var\(--radius-card\)/);
        const w = mountWith(null);
        try {
            expect(w.find('[data-stub="Chip"]').text()).toMatch(/smooth/i);
            expect(w.find(".active-preset-chip").exists()).toBe(false);
        } finally {
            w.unmount();
        }
    });

    it("UIA-KF-097 — an intrinsic verb, a folded artifact, one caption, no disclaimer", () => {
        const w = mountWith(null);
        try {
            const verb = w.get("button[aria-controls]");
            expect(verb.classes()).not.toContain("btn-playback");
            expect(w.text()).not.toMatch(/response is not expressed/);
            expect(w.text()).not.toMatch(/emitted by/);
            expect(SFC_SRC).toMatch(/<Collapsible\b/);
        } finally {
            w.unmount();
        }
    });
});
