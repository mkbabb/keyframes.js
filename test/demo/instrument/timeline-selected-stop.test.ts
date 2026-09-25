/**
 * test/demo/instrument/timeline-selected-stop.test.ts — X.KF.W13X.timeline,
 * the Timeline card's editing surface:
 *
 *   UIA-KF-045 no second, per-stop Monaco CSS editor inside the timeline (the
 *              owner's one-idiom order, OA-37): the selected stop shows its
 *              label, a read-only summary of its declarations, and Remove.
 *   UIA-KF-278 Remove is the destructive trash glyph at the toolbar's size,
 *              named in a tooltip (a red × read as "close").
 *   UIA-KF-054 a failed build is a glass Alert in sentence case; the engine's
 *              raw message stays in the console.
 *   UIA-KF-182 Clear all says what it did and offers Undo in the house toast;
 *              Undo restores exactly the cleared stops.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, effectScope, h, nextTick, ref } from "vue";
import type { VNode } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

const toasts: Array<{ title: string; action?: VNode }> = [];
vi.mock("@mkbabb/glass-ui/toast", async (importOriginal) => {
    const real = await importOriginal<typeof import("@mkbabb/glass-ui/toast")>();
    return {
        ...real,
        toast: (options: { title: string; action?: VNode }) => {
            toasts.push(options);
        },
    };
});

const { useTimeline } = await import("../../../demo/components/instrument/timeline/composables/useTimeline");
const KeyframeTimeline = (await import("../../../demo/components/instrument/timeline/KeyframeTimeline.vue")).default;
const { percentSelector } = await import("../../../demo/utils/keyframeSelector");

const kf = (percent: number, vars: Record<string, string>) => ({
    id: `kf-stop-${percent}`,
    selector: percentSelector(percent),
    percent,
    vars,
});

const mounts: Array<{ unmount: () => void }> = [];
afterEach(() => {
    while (mounts.length) mounts.pop()!.unmount();
    toasts.length = 0;
    document.body.innerHTML = "";
});

async function setup() {
    const targets: HTMLElement[] = [document.createElement("div")];
    const w = mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () => h(KeyframeTimeline, { targets })),
        ),
        { attachTo: document.body, global: { stubs: { CSSCodeEditor: true, CSSPasteDialog: true } } },
    );
    mounts.push(w);
    const scope = effectScope();
    const session = scope.run(() => useTimeline(ref(targets), undefined, targets))!;
    session.state.value.keyframes.push(
        kf(0, { opacity: "1", transform: "rotate(0deg)" }),
        kf(100, { opacity: "0.2" }),
    );
    await nextTick();
    return { w, session };
}

async function selectFirst(w: Awaited<ReturnType<typeof setup>>["w"]) {
    await w.get(".timeline-caret-readout").trigger("click");
    await nextTick();
    await nextTick();
}

describe("the Timeline card's selected stop", () => {
    it("UIA-KF-045 — shows a read-only summary, never an inline CSS editor", async () => {
        const { w } = await setup();
        await selectFirst(w);
        expect(w.findComponent({ name: "CSSCodeEditor" }).exists()).toBe(false);
        const summary = w.get(".timeline-stop-summary");
        expect(summary.findAll("dt").map((d) => d.text())).toEqual(["opacity", "transform"]);
        expect(summary.findAll("dd").map((d) => d.text())).toEqual(["1", "rotate(0deg)"]);
        expect(w.find('[aria-label="Keyframe label"]').exists()).toBe(true);
    });

    it("UIA-KF-278 — Remove is the trash glyph at the toolbar's size", async () => {
        const { w } = await setup();
        await selectFirst(w);
        const remove = w.get('[aria-label="Remove keyframe"]');
        const glyph = remove.get("svg").classes().join(" ");
        expect(glyph).toMatch(/trash/);
        expect(glyph).toContain("icon-sm");
        expect(glyph).not.toMatch(/lucide-x\b/);
    });
});

describe("UIA-KF-054 — a failed build", () => {
    it("is a sentence-case glass Alert, and the raw engine message is not printed", async () => {
        const { w, session } = await setup();
        session.buildError.value = "BrowserScalarResolution: cannot resolve 'foo' at offset 12";
        await nextTick();
        const text = w.text();
        expect(text).toContain("The animation could not be built");
        expect(text).not.toContain("BrowserScalarResolution");
        expect(w.findAll(".uppercase").filter((e) => /built/i.test(e.text()))).toHaveLength(0);
    });
});

describe("UIA-KF-182 — Clear all", () => {
    it("says what it cleared and its Undo restores exactly those stops", async () => {
        const { w, session } = await setup();
        await w.get('[aria-label="Clear all keyframes"]').trigger("click");
        await nextTick();
        expect(session.state.value.keyframes).toHaveLength(0);
        expect(toasts).toHaveLength(1);
        expect(toasts[0]!.title).toBe("Cleared 2 keyframes");
        const undo = toasts[0]!.action!;
        (undo.props as { onClick: () => void }).onClick();
        await nextTick();
        expect(session.state.value.keyframes.map((k) => k.percent)).toEqual([0, 100]);
    });
});
