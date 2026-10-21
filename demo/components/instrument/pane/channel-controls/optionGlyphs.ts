import type { Component } from "vue";
import type { AnimationEngine } from "@mkbabb/keyframes.js";
import {
    ArrowLeft,
    ArrowLeftRight,
    ArrowLeftToLine,
    ArrowRight,
    ArrowRightLeft,
    ArrowRightToLine,
    CircleDashed,
    MoveHorizontal,
} from "@lucide/vue";

type EnumOption = AnimationEngine["DIRECTIONS"][number] | AnimationEngine["FILL_MODES"][number];

/** OD19-K3 — THE ONE value->glyph table for the two enumerated options. The
 *  glyph draws what the value does to the run: direction is the arrow of
 *  travel (one way, the other, there-and-back, back-and-there); fill mode is
 *  which end the run holds (none, the end it reaches, the start it waits
 *  at, both). The two key sets are disjoint, so one table serves both.
 *
 *  C2-KF-02 — the table is the pane's glyph VOCABULARY, so it lives in its own
 *  module: the ribbon's Reverse disc draws `OPTION_GLYPHS.reverse` (one
 *  meaning per glyph — the two-way arrow means "alternate" only). */
export const OPTION_GLYPHS: Record<EnumOption, Component> = {
    normal: ArrowRight,
    reverse: ArrowLeft,
    alternate: ArrowRightLeft,
    "alternate-reverse": ArrowLeftRight,
    none: CircleDashed,
    forwards: ArrowRightToLine,
    backwards: ArrowLeftToLine,
    both: MoveHorizontal,
};
