/**
 * test/demo/instrument/timeline-snapshot-two-build.test.ts — X-DS kf pass 3,
 * KF-C3-01: two Snapshots on a fresh cube timeline failed to build — "Invalid
 * CSS value for "backgroundColor" at 0–16: expected scalar". The cube's ground
 * is transparent, the CSSOM serialises it in the legacy comma form
 * `rgba(0, 0, 0, 0)`, and value.js 4.0.0's grammar refuses that form (PB-01).
 * The capture writes the modern space form, so two snapshots build.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@mkbabb/glass-ui/toast", () => ({ toast: vi.fn(), ToastAction: {} }));

const { warmKfEngine } = await import("@kf-engine");
await warmKfEngine();
const { captureSnapshot, modernColourSyntax } = await import(
    "@components/instrument/timeline/utils/snapshotCapture"
);
const { buildAnimationFromTimeline } = await import(
    "@components/instrument/timeline/utils/timelineEngine"
);

afterEach(() => vi.restoreAllMocks());

/** The cube's computed style, as Chromium serialises it. */
const CUBE_COMPUTED: Record<string, string> = {
    opacity: "1",
    "background-color": "rgba(0, 0, 0, 0)",
    color: "rgb(28, 25, 23)",
    "border-color": "rgba(28, 25, 23, 0.5)",
    "box-shadow": "none",
    filter: "none",
};

describe("KF-C3-01 — two Snapshots build", () => {
    it("rewrites only the legacy four-argument rgba() form", () => {
        expect(modernColourSyntax("rgba(0, 0, 0, 0)")).toBe("rgb(0 0 0 / 0)");
        expect(modernColourSyntax("rgba(0, 0, 0, 0.2) 0px 1px 2px 0px")).toBe(
            "rgb(0 0 0 / 0.2) 0px 1px 2px 0px",
        );
        expect(modernColourSyntax("rgb(255, 0, 0)")).toBe("rgb(255, 0, 0)");
        expect(modernColourSyntax("none")).toBe("none");
    });

    it(
        "a transparent ground captured twice builds an animation",
        async () => {
            vi.spyOn(window, "getComputedStyle").mockReturnValue({
                getPropertyValue: (prop: string) => CUBE_COMPUTED[prop] ?? "",
            } as unknown as CSSStyleDeclaration);
            const el = document.createElement("div");
            document.body.appendChild(el);
            const props = Object.keys(CUBE_COMPUTED);
            el.style.transform = "rotateX(0deg) rotateY(0turn)";
            const a = captureSnapshot(el, 0, ["transform", ...props]);
            el.style.transform = "rotateX(90deg) rotateY(0.5turn)";
            const b = captureSnapshot(el, 50, ["transform", ...props]);
            expect(a.vars["background-color"]).toBe("rgb(0 0 0 / 0)");
            vi.restoreAllMocks();

            await expect(
                buildAnimationFromTimeline(
                    { keyframes: [a, b], captureProperties: props, animationName: "Rotations" },
                    { duration: 1_000 },
                    [el],
                ),
            ).resolves.toBeDefined();
        },
        30_000,
    );
});
