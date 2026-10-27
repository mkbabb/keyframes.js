import type { TimingFunction } from "@mkbabb/keyframes.js";

import { unitEasingPlot } from "@utils/curvePlot";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import { namedEasing, steppedEasing } from "@utils/reference-data/timingCurveUtils";

/**
 * The Easing scene's specimen tiles: the families, and ONE function object per
 * tile.
 *
 * "Custom" (the bare cubic-bezier editor affordance) is a SIDEBAR concern (the
 * EasingPicker editor), not a specimen, so it carries no tile and no filter
 * entry. Every named curve is a tile. Parameterized entries get honest static
 * defaults ("steps" = the 4-step staircase); the selected curve's live
 * parameters ride the header literal and the sidebar editor, not the tile.
 */
export const SPECIMEN_GROUPS = EASING_GROUPS.filter((g) => g.family !== "Custom");

const SPECIMEN_FNS: ReadonlyMap<string, TimingFunction> = new Map(
    SPECIMEN_GROUPS.flatMap((g) =>
        g.items.map((i) => [
            i.name,
            i.name === "steps" ? steppedEasing(4, "jump-end") : namedEasing(i.name),
        ]),
    ),
);

/** The function a specimen tile plots: the same object on every call. */
export const specimenCurve = (name: string): TimingFunction =>
    SPECIMEN_FNS.get(name) ?? namedEasing(name);

// OD19 residue (value.js COHESION §0gp) — the tiles' plots are static data,
// built here once, when the scene's chunk evaluates (`warmScenesAtIdle`, or
// the deep link's boot), so the swap into Easing mounts its catalogue with no
// curve call. On the real-GPU cell they were ~15 ms of that swap's commit.
for (const fn of SPECIMEN_FNS.values()) unitEasingPlot(fn);
