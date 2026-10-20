/**
 * X.KF.W13X.keyframes — UIA-KF-275: the Keyframes pane names what it edits.
 *
 * The pane opened straight onto line 1 of the code: no heading, no animation
 * name, no parse or apply state beside the source, and the tabpanel had no
 * accessible name. The pane is now a region named by a heading that carries the
 * animation's name, with one polite status (OD19-K7: a labelled dot) — Parsed · Parse error ·
 * Applied — beside the buffer it describes. Since X-DS r8 pass 9 (KF-C9x-02)
 * the header is glass's ConfiguratorLayer (title, status, chevron).
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
        props: { state: String, label: String, size: String },
        setup: (p) => () =>
            h("span", { "data-stub": "StatusDot", "data-state": p.state, "data-size": p.size, "aria-label": p.label }),
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

        // X-DS r8 pass 9 (KF-C9x-02) — the header is glass's ConfiguratorLayer,
        // the anatomy every sibling pane header wears: the region is named by
        // the animation, the layer's title carries the same name, and the title
        // is the disclosure trigger (aria-expanded, open at rest).
        const region = wrapper.find('section[aria-label="Rotations"]');
        expect(region.exists()).toBe(true);
        const trigger = region.find('[data-slot="configurator-layer-trigger"]');
        expect(trigger.attributes("aria-expanded")).toBe("true");
        expect(trigger.find(".configurator-section-label").text()).toBe("Rotations");

        // OD19-K7 — the status is the dot alone (md): no visible word; the
        // word is the dot's accessible name inside the polite live region.
        const status = () => region.find('[role="status"]');
        const said = () => status().find('[data-stub="StatusDot"]').attributes("aria-label");
        expect(status().attributes("aria-live")).toBe("polite");
        expect(status().text()).toBe("");
        expect(status().find('[data-stub="StatusDot"]').attributes("data-size")).toBe("md");
        expect(said()).toBe("Parsed");
        expect(status().find('[data-stub="StatusDot"]').attributes("data-state")).toBe("success");

        // A refused edit says so beside the buffer.
        editor.vm.$emit("update:modelValue", "@");
        await vi.waitFor(() => expect(said()).toBe("Parse error"), { timeout: 20_000 });
        expect(status().find('[data-stub="StatusDot"]').attributes("data-state")).toBe("error");

        // Applied outranks the parse state.
        const seat = wrapper.vm as unknown as PaneSeat;
        seat.applyCSSStyles();
        await nextTick();
        expect(said()).toBe("Applied");
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

        const region = wrapper.find('section[aria-label="Spring Keyframes"]');
        expect(region.exists()).toBe(true);
        expect(region.find(".configurator-section-label").text()).toBe("Spring Keyframes");
        expect(buffer()).toContain("@keyframes Spring-Keyframes");
        // The header folds the well, as the sibling panes' headers do; the
        // status stays in the folded header (`actions-when="always"`).
        const trigger = region.find('[data-slot="configurator-layer-trigger"]');
        await trigger.trigger("click");
        expect(trigger.attributes("aria-expanded")).toBe("false");
        expect(region.find('[role="status"] [data-stub="StatusDot"]').attributes("aria-label")).toBe("Parsed");
        wrapper.unmount();
    });
});
