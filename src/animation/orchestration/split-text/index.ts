/**
 * orchestration/split-text/ — the a11y-first `splitText` primitive (S.F2).
 *
 * `splitText(el, { by, a11y })` shreds a text element into an animatable
 * fragment cohort + a ready stagger, consolidating the accessible name onto the
 * container (`aria-label` + `aria-hidden` fragments). LIGHT (parser-free): it
 * composes `stagger`'s `/math` leaf and `Intl.Segmenter`; `by: "line"` is
 * measure-or-refuse (a typed `SplitTextRefusalError`). The barrel is the zone's
 * single public surface (what `proof:no-flat-siblings` asserts).
 */
export { splitText } from "./split-text";
export type {
    SplitBy,
    SplitTextOptions,
    SplitTextResult,
} from "./split-text";
export { SplitTextRefusalError } from "./refuse";
export type { SplitTextRefusalReason } from "./refuse";
export type { TextSegment } from "./segment";
