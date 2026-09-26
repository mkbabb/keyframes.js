/**
 * X.KF.W13X.keyframes — UIA-KF-275: the Keyframes pane names what it edits.
 *
 * The pane opened straight onto line 1 of the code: no heading, no animation
 * name, no parse or apply state beside the source, and the tabpanel had no
 * accessible name. The pane is now a region named by a heading that carries the
 * animation's name, with one polite status line — Parsed · Parse error ·
 * Applied — beside the buffer it describes.
 *
 * RED at the parent bytes (no region, no heading, no status), GREEN after.
 */
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, markRaw, nextTick } from "vue";
import { mount } from "@vue/test-utils";

const slotStub = (tag: string, name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup: (_p, { slots, attrs }) =>
            () =>
                h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
    });

vi.mock("@mkbabb/glass-ui", () => ({
    Button: slotStub("button", "ButtonStub"),
    Skeleton: slotStub("div", "SkeletonStub"),
    Card: slotStub("div", "CardStub"),
    CardContent: slotStub("div", "CardContentStub"),
}));
vi.mock("@mkbabb/glass-ui/status-dot", () => ({
    StatusDot: defineComponent({
        name: "StatusDotStub",
        props: { state: String },
        setup: (p) => () => h("span", { "data-stub": "StatusDot", "data-state": p.state }),
    }),
}));
vi.mock("@mkbabb/glass-ui/card", () => ({
    Card: slotStub("div", "CardStub"),
    CardContent: slotStub("div", "CardContentStub"),
}));
vi.mock("@mkbabb/glass-ui/dark", async () => {
    const { ref: vueRef } = await import("vue");
    const isDark = vueRef(false);
    return { useGlobalDark: () => ({ isDark, onFlipSettled: () => () => {} }) };
});
vi.mock("@mkbabb/glass-ui/toast", () => ({
    toast: () => ({ id: "0", dismiss: () => {}, update: () => {} }),
    ToastAction: {},
}));
const copied: string[] = [];
vi.mock("@composables/copyWithToast", () => ({
    copyWithToast: async (text: string) => {
        copied.push(text);
        return { ok: true };
    },
}));

const { warmKfEngine } = await import("@kf-engine");
await warmKfEngine();

const { importCSSToTimeline, buildAnimationFromTimeline } = await import(
    "@components/instrument/timeline/utils/timelineEngine"
);
const KeyframesStringControls = (
    await import("@components/instrument/keyframes/KeyframesStringControls.vue")
).default;
const CSSCodeEditor = (
    await import("@components/instrument/keyframes/CSSCodeEditor.vue")
).default;

const HEAVY = { timeout: 30_000 };

const buildFixture = async (name = "Rotations") => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    const keyframes = await importCSSToTimeline(
        "@keyframes Rotations { from { opacity: 0; } to { opacity: 1; } }",
    );
    const animation = await buildAnimationFromTimeline(
        { keyframes, captureProperties: [], animationName: "Rotations" },
        { duration: 1_000 },
        [target],
    );
    animation.name = name;
    animation.superKey = "cube";
    return markRaw(animation);
};

interface PaneSeat {
    applyCSSStyles: () => void;
    clearAppliedCSS: () => void;
}

describe("UIA-KF-275 — the pane's heading and status", () => {
    it("(1) the pane is a region named by the animation's heading, with a status beside the source", HEAVY, async () => {
        const wrapper = mount(KeyframesStringControls, {
            props: { animation: await buildFixture() },
            attachTo: document.body,
        });
        const editor = wrapper.findComponent(CSSCodeEditor);
        const buffer = () => String(editor.props("modelValue"));
        await nextTick();
        await vi.waitFor(() => expect(buffer()).toContain("@keyframes"), { timeout: 20_000 });

        const region = wrapper.find("section[aria-labelledby]");
        expect(region.exists()).toBe(true);
        const heading = document.getElementById(region.attributes("aria-labelledby")!);
        expect(heading?.tagName).toBe("H3");
        expect(heading?.textContent?.trim()).toBe("Rotations");

        const status = () => region.find('[role="status"]');
        expect(status().text()).toBe("Parsed");
        expect(status().find('[data-stub="StatusDot"]').attributes("data-state")).toBe("success");

        // A refused edit says so beside the buffer.
        editor.vm.$emit("update:modelValue", "@");
        await vi.waitFor(() => expect(status().text()).toBe("Parse error"), { timeout: 20_000 });
        expect(status().find('[data-stub="StatusDot"]').attributes("data-state")).toBe("error");

        // Applied outranks the parse state.
        const seat = wrapper.vm as unknown as PaneSeat;
        seat.applyCSSStyles();
        await nextTick();
        expect(status().text()).toBe("Applied");
        seat.clearAppliedCSS();
        wrapper.unmount();
    });

    it("(2) the heading carries the name as authored, not the buffer's CSS ident", HEAVY, async () => {
        const wrapper = mount(KeyframesStringControls, {
            props: { animation: await buildFixture("Spring Keyframes") },
            attachTo: document.body,
        });
        const buffer = () => String(wrapper.findComponent(CSSCodeEditor).props("modelValue"));
        await nextTick();
        await vi.waitFor(() => expect(buffer()).toContain("@keyframes"), { timeout: 20_000 });

        const region = wrapper.find("section[aria-labelledby]");
        const heading = document.getElementById(region.attributes("aria-labelledby")!);
        expect(heading?.textContent?.trim()).toBe("Spring Keyframes");
        expect(buffer()).toContain("@keyframes Spring-Keyframes");
        wrapper.unmount();
    });
});
