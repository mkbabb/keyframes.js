// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4panes — UIA-KF-097's highlighter limb: the spring discrete
 * Entry's artifact in the editor's code ink.
 *
 *   (The presented-at-the-default-spring case is `r4panes-entry-artifact.test.ts`.)
 *   (1) The artifact is inked with the editor's code tokens (`CODE_INK`): the
 *       property names in the structure ink, the numbers in the number ink,
 *       and the rendered text is still byte-identical to what is copied.
 *   (2) `tokenizeCSS` — the tokens concatenate to the input exactly, and the
 *       rungs fold the editor's Monarch classes (selector / at-rule / property
 *       → structure, value identifiers and punctuation → value, numbers with
 *       their units → number).
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
import {
    CODE_INK,
    tokenizeCSS,
} from "../../../demo/components/instrument/keyframes/utils/codeTokens";
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

describe("X.KF.W13X.r4panes — UIA-KF-097: the Entry artifact in the editor's code ink", () => {
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

    it("(1) the artifact wears the editor's code tokens, and still reads byte-for-byte what it copies", () => {
        const wrapper = mountTarget(demoAt(SMOOTH.response, SMOOTH.dampingFraction, smoothCss));
        try {
            const code = wrapper.get("code.artifact");
            expect(code.element.textContent).toBe(smoothCss);
            const spans = [...code.element.querySelectorAll("span")];
            const inkOf = (re: RegExp) =>
                spans.find((s) => re.test(s.textContent ?? ""))?.style.color ?? null;
            // jsdom keeps a `var()` colour verbatim, so the ink is read as written.
            expect(inkOf(/^transition$/)).toBe(CODE_INK.structure);
            expect(inkOf(/^opacity$/)).toBe(CODE_INK.structure);
            expect(inkOf(/^0\.5s$/)).toBe(CODE_INK.number);
            expect(inkOf(/^20px$/)).toBe(CODE_INK.number);
            expect(new Set(spans.map((s) => s.style.color).filter(Boolean)).size).toBe(3);
            // the flat muted register is gone: the ink is per token
            expect(code.classes()).not.toContain("text-muted-foreground");
        } finally {
            wrapper.unmount();
        }
    });

    it("(2) tokenizeCSS: tokens concatenate to the input; rungs fold the Monarch classes", () => {
        const css = `@starting-style {\n  .card.is-open { opacity: 0; transform: translateY(20px) scale(0.9); transition: opacity 0.5s linear(0 0%, 1 100%); }\n}`;
        const tokens = tokenizeCSS(css);
        expect(tokens.map((t) => t.text).join("")).toBe(css);
        // the ink of the token covering the first occurrence of `text`
        // (adjacent same-ink lexemes share one token: `translateY(`)
        const inkOf = (text: string) => {
            const at = css.indexOf(text);
            let pos = 0;
            for (const t of tokens) {
                if (at < pos + t.text.length) return t.ink;
                pos += t.text.length;
            }
            return undefined;
        };
        expect(inkOf("@starting-style")).toBe("structure");
        expect(inkOf(".card.is-open")).toBe("structure");
        expect(inkOf("opacity:")).toBe("structure");
        expect(inkOf("opacity 0.5s")).toBe("value");
        expect(inkOf("translateY")).toBe("value");
        expect(inkOf("linear")).toBe("value");
        expect(inkOf("20px")).toBe("number");
        expect(inkOf("0.5s")).toBe("number");
        expect(tokens.filter((t) => t.ink === null).every((t) => /^\s+$/.test(t.text))).toBe(true);
    });
});
