// SERVED MODEL: claude-opus-5-5
/**
 * UIA-KF-177, the demo-store half (X.KF.W3 `.u177`, COHESION §0he.2): the
 * `<time>` unit the author wrote survives the keyframes-panel edit path
 * `useKeyframeOps.updateFromString` → `getStoredAnimationOptions(...)` → re-emit.
 *
 * The engine keeps `durationUnit` / `delayUnit` beside the milliseconds since
 * `.c4` (`test/compile/uia-kf-177-authored-unit.test.ts`), but the op wrote the
 * store with the one-argument `reverseCSSTime`, so the store took the
 * shortest-exact spelling (seconds on a tie): an authored `350ms` came back as
 * `0.35s`. Each case authors 350 ms in both spellings, one per field, so a
 * dropped unit on either field reads RED.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { ref } from "vue";
import { withSetup } from "../../support/withSetup";
import { useSquareDemo } from "../../../demo/scenes/square/useSquareDemo";
import { useKeyframeOps } from "../../../demo/components/instrument/keyframes/composables/useKeyframeOps";
import { getStoredAnimationOptions } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";
import { animationOptionsToString } from "../../../src/animation/compile/emit/format";

const syncStub = () => ({ reproject: () => {} });

const buffer = (duration: string, delay: string) =>
    `.subject { animation-duration: ${duration}; animation-delay: ${delay}; animation-timing-function: linear; }\n` +
    "@keyframes spin { 0% { transform: translateX(0px); } 100% { transform: translateX(10px); } }";

describe("UIA-KF-177 — the authored time unit survives the demo store path", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it.each([
        ["0.35s", "350ms"],
        ["350ms", "0.35s"],
    ])(
        "duration %s / delay %s: stored, then re-emitted, in the authored spelling",
        async (duration, delay) => {
            const el = document.createElement("div");
            const [demo, app] = withSetup(() => useSquareDemo(ref(el)));
            try {
                demo.anim.setTargets(el);
                demo.anim.parse();
                const ops = useKeyframeOps(demo.anim, () => {}, syncStub());

                await ops.updateFromString(buffer(duration, delay));

                const stored = getStoredAnimationOptions(demo.anim).animationOptions;
                expect(stored.duration).toBe(duration);
                expect(stored.delay).toBe(delay);

                // Re-emit: the stored spellings fed back through the same op are a
                // fixed point, and the engine's emit writes them unchanged.
                await ops.updateFromString(
                    buffer(String(stored.duration), String(stored.delay)),
                );
                const again = getStoredAnimationOptions(demo.anim).animationOptions;
                expect(again.duration).toBe(duration);
                expect(again.delay).toBe(delay);
                expect(demo.anim.options.duration).toBe(350);
                expect(demo.anim.options.delay).toBe(350);

                const css = animationOptionsToString(demo.anim.options, "spin");
                expect(css).toContain(`animation-duration: ${duration};`);
                expect(css).toContain(`animation-delay: ${delay};`);
            } finally {
                app.unmount();
            }
        },
    );
});
