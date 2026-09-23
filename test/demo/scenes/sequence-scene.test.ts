/**
 * S.B7 · S4 — Sequence scene composable coverage (a25 F1 · fold row 40).
 *
 * Locks `useSequenceInstrument` (the scrub/power-on UI state machine — pure refs)
 * and smoke-constructs `useSequenceDemo` (the master-playhead transport built over
 * `Sequence`; scene-machine + warmed-engine wiring), referencing the scene's
 * transport key so a rename reds here.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { withSetup } from "../../support/withSetup";
import {
    prefersReducedMotion,
    useSequenceInstrument,
} from "../../../demo/scenes/sequence/useSequenceInstrument";
import { STAGGER_MAX, useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { ROW_COUNT } from "../../../demo/scenes/sequence/sequenceMotion";
import { SEQUENCE_SCENE_ID } from "../../../demo/scenes/sequence/sequenceKeys";
import { warmKfEngine } from "../../../demo/kf-engine";

describe("useSequenceInstrument — the scrub/power-on state", () => {
    it("setScrubbing toggles the scrubbing flag", () => {
        const { isScrubbing, setScrubbing } = useSequenceInstrument();
        expect(isScrubbing.value).toBe(false);
        setScrubbing(true);
        expect(isScrubbing.value).toBe(true);
        setScrubbing(false);
        expect(isScrubbing.value).toBe(false);
    });

    it("setScrubDir clamps to ±1 (sign only)", () => {
        const { scrubDir, setScrubDir } = useSequenceInstrument();
        expect(scrubDir.value).toBe(1);
        setScrubDir(-5);
        expect(scrubDir.value).toBe(-1);
        setScrubDir(3);
        expect(scrubDir.value).toBe(1);
        // Zero is not negative → forward.
        setScrubDir(0);
        expect(scrubDir.value).toBe(1);
    });

    it("powerOn is idempotent (the one-shot boot guard holds)", () => {
        const { isPoweringOn, powerOn } = useSequenceInstrument();
        powerOn();
        const afterFirst = isPoweringOn.value;
        powerOn(); // second call is guarded — no state change
        expect(isPoweringOn.value).toBe(afterFirst);
    });
});

describe("useSequenceDemo construction", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("exposes the row-grid constants + constructs without throwing", () => {
        expect(ROW_COUNT).toBe(5);
        expect(STAGGER_MAX).toBe(1600);
        const [demo, app] = withSetup(() => useSequenceDemo());
        try {
            expect(demo).toBeTruthy();
            expect(SEQUENCE_SCENE_ID).toBe("sequence");
        } finally {
            // TC-5: mount teardown runs the composable's real disposal.
            app.unmount();
        }
    });

    // ── X.KF.W11.d — the transport-surface decision and the reel's PRM guard ──

    it("the provide bag carries the two verbs the target owns and none of the dead transport (SC-2)", () => {
        const [demo, app] = withSetup(() => useSequenceDemo());
        try {
            const bag = demo as unknown as Record<string, unknown>;
            // Exposed: the re-time's undo is a visible verb; the master scrub stays.
            expect(typeof demo.reset).toBe("function");
            expect(typeof demo.scrub).toBe("function");
            expect(typeof demo.reseatRow).toBe("function");
            // Deleted: nine names with zero consumers through the injector.
            for (const dead of [
                "reverse",
                "setTimeScale",
                "resume",
                "play",
                "togglePlay",
                "isReversed",
                "timeScale",
                "delays",
                "scenePlayback",
            ]) {
                expect(dead in bag, `${dead} must not be provided`).toBe(false);
            }
        } finally {
            app.unmount();
        }
    });

    describe("the reel under prefers-reduced-motion (D7 — one guard, shared with the boot)", () => {
        const original = window.matchMedia;
        afterEach(() => {
            window.matchMedia = original;
        });

        it("reads the media query the boot reads, and the reel refuses to start when it matches", () => {
            window.matchMedia = ((query: string) =>
                ({ matches: query.includes("reduce"), media: query }) as MediaQueryList) as typeof window.matchMedia;
            expect(prefersReducedMotion()).toBe(true);
            vi.useFakeTimers();
            const [demo, app] = withSetup(() => useSequenceDemo());
            try {
                demo.playReel();
                expect(demo.isReeling.value).toBe(false);
                expect(vi.getTimerCount()).toBe(0);
            } finally {
                app.unmount();
                vi.useRealTimers();
            }
        });
    });
});
