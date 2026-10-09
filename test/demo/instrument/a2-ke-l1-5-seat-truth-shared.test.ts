// KF.W13X.r4pane · A2-KE-L1-5 — the picker seats share ONE truth mapping.
//
// The Easing scene's Curve facet (`EasingSidebar.vue`) and the controls card's
// detail editor (`TimingFunctionPanel.vue`) each mapped their curve state to the
// picker's `SeatTruth` — the step-start/step-end branch word for word, and a
// second spelling of the quad → named-curve lookup. The cure moves
// truth-from-{name, points, steps} beside `useEasingPickerSeat` (where
// `nameForQuad` already lives), and both seats read it.

import { describe, expect, it } from "vitest";
import * as seat from "../../../demo/components/instrument/transport/channel-controls/composables/useEasingPickerSeat";
import { NAMED_EASING_BEZIER_ENTRIES } from "@utils/reference-data/animationDescriptions";

const [namedName, namedQuad] = NAMED_EASING_BEZIER_ENTRIES[0]!;
const custom = [0.11, 0.22, 0.33, 0.44] as const;

describe("A2-KE-L1-5 — one truth-from-curve mapping for both picker seats", () => {
    it("the seat module exports the shared mapping", () => {
        expect(typeof seat.seatTruthFor).toBe("function");
    });

    it("step-start and step-end are their own one-step curves", () => {
        expect(
            seat.seatTruthFor({ name: "step-start", isSteps: true, points: custom, steps: 5, term: "jump-none" }),
        ).toEqual({ mode: "steps", points: custom, steps: 1, term: "jump-start" });
        expect(
            seat.seatTruthFor({ name: "step-end", isSteps: true, points: custom, steps: 5, term: "jump-none" }),
        ).toEqual({ mode: "steps", points: custom, steps: 1, term: "jump-end" });
    });

    it("a steps curve keeps its authored count and term", () => {
        expect(
            seat.seatTruthFor({ name: "steps", isSteps: true, points: custom, steps: 4, term: "jump-both" }),
        ).toEqual({ mode: "steps", points: custom, steps: 4, term: "jump-both" });
    });

    it("a bezier seat names its preset by the quad, and a peeked quad wins", () => {
        expect(
            seat.seatTruthFor({ name: namedName, isSteps: false, points: namedQuad, steps: 4, term: "jump-end" }),
        ).toEqual({ mode: "bezier", points: namedQuad, steps: 4, term: "jump-end", presetName: namedName });
        const peeked = seat.seatTruthFor({
            name: "cubic-bezier",
            isSteps: false,
            points: custom,
            peek: namedQuad,
            steps: 4,
            term: "jump-end",
        });
        expect(peeked.points).toEqual(namedQuad);
        expect(peeked.presetName).toBe(namedName);
        expect(
            seat.seatTruthFor({ name: "cubic-bezier", isSteps: false, points: custom, steps: 4, term: "jump-end" })
                .presetName,
        ).toBeUndefined();
    });
});
