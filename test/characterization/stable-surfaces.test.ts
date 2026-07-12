import { describe, expect, it } from "vitest";
import {
    KeyframesScrollTimeline,
    ManualTimeline,
    SpringProgress,
    loadAnimationEngine,
} from "@mkbabb/keyframes.js";

const FRAME_MS = 1000 / 60;

describe("characterization: stable package surfaces", () => {
    it("emits stable CSS bytes for a fixed public keyframe corpus", async () => {
        const { CSSKeyframesAnimation, compileToCSS } =
            await loadAnimationEngine();
        const target = document.createElement("div");
        const animation = new CSSKeyframesAnimation(
            { duration: 750, timingFunction: "linear", fillMode: "both" },
            target,
        );
        animation.name = "characterization-fade-slide";
        animation.fromString(`@keyframes input {
            0% { opacity: 0; transform: translateX(0px) }
            50% { opacity: 0.4; transform: translateX(12px) }
            100% { opacity: 1; transform: translateX(40px) }
        }`);

        const result = await compileToCSS([animation]);

        expect(result.eligible).toBe(true);
        expect(result.refusals).toEqual([]);
        expect(result.css).toMatchInlineSnapshot(`
          "@keyframes characterization-fade-slide {
            0% {
              opacity: 0;
              transform: translateX(0px);
            }
            50% {
              opacity: 0.4;
              transform: translateX(12px);
            }
            100% {
              opacity: 1;
              transform: translateX(40px);
            }
          }

          .characterization-fade-slide {
            animation: 750ms linear 1 normal both characterization-fade-slide;
          }
          "
        `);
    }, 15_000);

    it("samples deterministic progress from caller-owned clocks", () => {
        const manual = new ManualTimeline({
            easing: (t) => t * t,
            smoothing: false,
        });
        const samples = [0, 0.125, 0.5, 0.875, 1].map((progress) => {
            manual.set(progress);
            return manual.tickDt(FRAME_MS);
        });
        expect(samples).toEqual([0, 0.015625, 0.25, 0.765625, 1]);

        let scrollY = 0;
        const scroll = new KeyframesScrollTimeline({
            threshold: 0.5,
            smoothing: false,
            getScrollY: () => scrollY,
            getViewportHeight: () => 800,
        });
        const scrollSamples = [0, 100, 200, 300, 400].map((next) => {
            scrollY = next;
            return scroll.tickDt(FRAME_MS);
        });
        expect(scrollSamples).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });

    it.each([
        ["underdamped", 0.45],
        ["critical", 1],
        ["overdamped", 1.6],
    ] as const)(
        "keeps scalar and vector spring trajectories equal in the %s regime",
        (_regime, dampingFraction) => {
            const options = {
                response: 0.55,
                dampingFraction,
                settleThreshold: 1e-12,
                velocitySettleThreshold: 1e-12,
            };
            const scalar = new SpringProgress(options);
            const vector = new SpringProgress(options);
            scalar.target = 73;
            vector.setTargets(new Float64Array([73]));

            for (let frame = 0; frame < 120; frame++) {
                scalar.tickDt(FRAME_MS);
                vector.tickVector(FRAME_MS);
                expect(vector.values[0]).toBeCloseTo(scalar.value, 10);
                expect(vector.velocities[0]).toBeCloseTo(scalar.velocity, 10);
            }

            scalar.dispose();
            vector.dispose();
        },
    );
});
