/**
 * X.KF.W13X.keyframes — UIA-KF-174 (the buffer opens on a machine identifier)
 * and UIA-KF-173's name half (Copy and Export CSS name one animation two ways).
 *
 * The Keyframes pane's buffer is its primary content. It used to be emitted
 * under the internal style id — `keyframes-style-<superKey>-<name>`, three times
 * before the first stop — while Export CSS wrote the same animation as
 * `@keyframes <name>`. The buffer now shows the name Export CSS writes, and the
 * style id stays the applied sheet's one name (N-8, `apply-css-identity`).
 *
 *   (1) the buffer names the animation as the user named it, with no
 *       `keyframes-style-` token anywhere in it;
 *   (2) Copy and Export CSS carry the same `@keyframes` name.
 *
 * RED at the parent bytes (the buffer's name is the style id), GREEN after.
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

const buildFixture = async () => {
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
    animation.name = "Rotations";
    animation.superKey = "cube";
    return markRaw(animation);
};

interface PaneSeat {
    copyCSS: () => Promise<void>;
    exportCompiledCSS: () => Promise<void>;
}

const keyframesName = (css: string) => /@keyframes\s+([\w-]+)/.exec(css)?.[1];

describe("UIA-KF-174 / UIA-KF-173 — the buffer shows the user's name", () => {
    it("(1) the buffer names the animation as authored, with no internal style id", HEAVY, async () => {
        const wrapper = mount(KeyframesStringControls, {
            props: { animation: await buildFixture() },
            attachTo: document.body,
        });
        const buffer = () => String(wrapper.findComponent(CSSCodeEditor).props("modelValue"));
        await nextTick();
        await vi.waitFor(() => expect(buffer()).toContain("@keyframes"), { timeout: 20_000 });

        expect(keyframesName(buffer())).toBe("Rotations");
        expect(buffer()).not.toContain("keyframes-style-");
        wrapper.unmount();
    });

    it("(2) Copy and Export CSS carry the same @keyframes name", HEAVY, async () => {
        const wrapper = mount(KeyframesStringControls, {
            props: { animation: await buildFixture() },
            attachTo: document.body,
        });
        const buffer = () => String(wrapper.findComponent(CSSCodeEditor).props("modelValue"));
        await nextTick();
        await vi.waitFor(() => expect(buffer()).toContain("@keyframes"), { timeout: 20_000 });

        const seat = wrapper.vm as unknown as PaneSeat;
        copied.length = 0;
        await seat.copyCSS();
        await seat.exportCompiledCSS();
        expect(copied.length).toBe(2);
        const [copy, exported] = copied.map(keyframesName);
        expect(exported).toBeDefined();
        expect(copy).toBe(exported);
        wrapper.unmount();
    });
});
