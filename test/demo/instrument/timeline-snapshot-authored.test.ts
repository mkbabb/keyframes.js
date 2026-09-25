/**
 * test/demo/instrument/timeline-snapshot-authored.test.ts — X.KF.W13X.timeline,
 * KFA-224: Snapshot serialised the COMPUTED transform (`matrix3d(…)`), which
 * cannot represent a multi-turn rotation, so a snapshot of the cube recorded a
 * matrix instead of the rotation it was authored with. The authored (inline)
 * value is captured as written; the computed value is the fallback.
 *
 * Served witness (1440, /cube): the target's inline transform reads
 * `rotateX(355.366deg) rotateY(0.987126turn) rotateZ(355.366deg)` while its
 * computed transform is `matrix3d(0.993472, -0.0740275, …)`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { captureSnapshot } from "../../../demo/components/instrument/timeline/utils/snapshotCapture";

afterEach(() => vi.restoreAllMocks());

/** The browser's computed style for the element: a matrix, as Chromium serialises it. */
const computedAsBrowser = (values: Record<string, string>) =>
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
        getPropertyValue: (prop: string) => values[prop] ?? "",
    } as unknown as CSSStyleDeclaration);

describe("KFA-224 — Snapshot captures the authored value", () => {
    it("keeps a multi-turn rotation as written, not as a matrix", () => {
        const el = document.createElement("div");
        el.style.transform = "rotateX(720deg) rotateY(0.5turn)";
        computedAsBrowser({ transform: "matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)", opacity: "1" });
        const kf = captureSnapshot(el, 25, ["transform", "opacity"]);
        expect(kf.vars.transform).toBe("rotateX(720deg) rotateY(0.5turn)");
        expect(kf.vars.opacity).toBe("1"); // no inline declaration: the computed value
    });

    it("falls back to the computed value where nothing is authored inline", () => {
        const el = document.createElement("div");
        computedAsBrowser({ transform: "none", "background-color": "rgb(255, 0, 0)" });
        const kf = captureSnapshot(el, 0, ["transform", "background-color"]);
        expect(kf.vars).toEqual({ transform: "none", "background-color": "rgb(255, 0, 0)" });
    });
});
