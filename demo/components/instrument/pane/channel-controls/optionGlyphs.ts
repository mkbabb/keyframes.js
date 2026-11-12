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

/**
 * owner-1112 (item 2, "these and other icons should animate on hover") — each
 * glyph's hover motion, keyed beside its glyph: the arrow leans the way it
 * points (`lean-end` / `lean-start`), the two rows of a two-way arrow slide
 * apart in their own directions (`swap`), an arrow-to-line steps up to its
 * line (`to-line-end` / `to-line-start`), the double-headed arrow opens
 * (`spread`), and the dashed ring turns a notch (`turn`). The motion itself is
 * one CSS idiom (`svg[data-glyph-motion]`, design-idioms.css): a
 * transition while the control is hovered or highlighted, returning on leave.
 */
export const OPTION_GLYPH_MOTION: Record<EnumOption, string> = {
    normal: "lean-end",
    reverse: "lean-start",
    alternate: "swap",
    "alternate-reverse": "swap-reverse",
    none: "turn",
    forwards: "to-line-end",
    backwards: "to-line-start",
    both: "spread",
};
