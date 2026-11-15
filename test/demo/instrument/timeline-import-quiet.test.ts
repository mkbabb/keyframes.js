/**
 * test/demo/instrument/timeline-import-quiet.test.ts — LAST-TEN KF-27.
 *
 * Opening the Timeline surface fills an empty timeline with the scene's own
 * @keyframes (K8). That fill is not an import the visitor made, so it raises no
 * "Imported N keyframes" toast; the Import dialog's import still does.
 */
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

const { toast } = vi.hoisted(() => ({ toast: vi.fn() }));
vi.mock("@mkbabb/glass-ui/toast", () => ({ toast, ToastAction: {} }));

const { warmKfEngine } = await import("@kf-engine");
await warmKfEngine();
const { useTimelineBuild } = await import(
    "@components/instrument/timeline/composables/useTimelineBuild"
);

const CSS = `@keyframes spin { 0% { opacity: 0; } 100% { opacity: 1; } }`;

function build() {
    const state = ref({ keyframes: [] } as never);
    return useTimelineBuild(state, ref(0), ref({ duration: 1000 } as never), ref([]));
}

describe("KF-27 — an automatic fill imports quietly", () => {
    it("the quiet import fills the timeline and raises no toast", async () => {
        toast.mockClear();
        const { importCSS } = build();
        await importCSS(CSS, { quiet: true });
        expect(toast).not.toHaveBeenCalled();
    });

    it("the visitor's import still reports its count", async () => {
        toast.mockClear();
        const { importCSS } = build();
        await importCSS(CSS);
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Imported 2 keyframes" }));
    });
});
