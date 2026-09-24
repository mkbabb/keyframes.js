/**
 * X.KF.W13V Repair 1 · C1-5 (KFA-17 / C6-3, the `[real-cube]` intermittent) — the
 * readout settles WITH the transport face at a play-state edge, not a frame later.
 *
 * `useAnimationSync` polls the engine once per demo-ticker frame, so while playing
 * `currentT` trails the engine by up to one frame. The transport face flips on the
 * play-state change in the same render flush as the pause, so for one frame the
 * face read "Play" (paused) while the ribbon still showed the previous frame's
 * time; the next ticker frame then moved the ribbon ~8 ms. Measured on the served
 * cube 6 of 6 (`evidence/W13V/k/repair1-real-cube/oracletrace.mjs`): the face
 * flipped at ~2.4 ms with the readout one frame stale, and the oracle's rest read,
 * landing inside that window, saw a paused playhead move (`rest=false`).
 *
 * The cure reads the engine at the edge itself (a `pre`-flush watcher on the play
 * state), so the face and the readout land in one render. No rAF runs in these
 * cases: every assertion follows only `nextTick()`.
 */
import { describe, expect, it } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import { useAnimationSync } from "@components/instrument/transport/channel-controls/composables/useAnimationSync";

describe("useAnimationSync — the play-state edge settles the readout in the same flush", () => {
    it("a pause publishes the engine's paused time before any ticker frame", async () => {
        const anim = { effectiveT: 100, started: true, reversed: false };
        const isPlaying = ref(true);
        const scope = effectScope();
        const sync = scope.run(() => useAnimationSync(() => anim as never, isPlaying))!;
        expect(sync.currentT.value).toBe(100);

        // The engine advanced one more frame, then the transport paused it.
        anim.effectiveT = 108.3;
        isPlaying.value = false;
        await nextTick();

        expect(sync.currentT.value).toBe(108.3);
        scope.stop();
    });

    it("a resume, reverse or stop edge reads the engine's state at the edge too", async () => {
        const anim = { effectiveT: 40, started: false, reversed: false };
        const isPlaying = ref(false);
        const scope = effectScope();
        const sync = scope.run(() => useAnimationSync(() => anim as never, isPlaying))!;

        anim.started = true;
        anim.reversed = true;
        anim.effectiveT = 4960;
        isPlaying.value = true;
        await nextTick();

        expect(sync.currentT.value).toBe(4960);
        expect(sync.isStarted.value).toBe(true);
        expect(sync.isReversed.value).toBe(true);
        scope.stop();
    });
});
