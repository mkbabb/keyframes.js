/**
 * The typed REFUSAL for `splitText`'s `by: "line"` measure-or-refuse posture
 * (SF-10 / S.F2 §S2). A line-split is layout-DEPENDENT: it groups fragments by
 * their measured `getClientRects` line box. When the container is not laid out
 * (detached, `display:none`, zero-width), or when a container-query/resize
 * feedback loop makes the measurement unable to converge, the ONLY honest
 * outcome is to REFUSE — never to emit a stale line map that silently goes wrong
 * on the next reflow (the exact failure mode this posture forbids).
 *
 * It is a distinct named error (mirroring `AnimationOptionError`) so a caller can
 * `instanceof`-narrow the refusal and fall back to `by: "word"` (layout-
 * independent) rather than swallow a generic throw.
 */

/**
 * Why a `by: "line"` split refused to produce a line map:
 *
 * - `"unmeasurable"` — the container yielded no usable client rects at split
 *   time (detached / `display:none` / zero-area). Lines cannot be grouped
 *   without a laid-out box, and emitting an ungrouped (or all-collapsed) map
 *   would be the silent-stale failure the posture forbids.
 * - `"unstable"`     — a re-measure (driven by the resize observer) could not
 *   hold: the container's own size depends on its content flow (a
 *   container-query / intrinsic-size feedback loop), so the line grouping
 *   oscillates and never converges. Refused rather than latched to a stale map.
 * - `"empty"`        — there is no text to split into lines.
 */
export type SplitTextRefusalReason = "unmeasurable" | "unstable" | "empty";

/** Human-readable cause per {@link SplitTextRefusalReason}. */
const REASON_DETAIL: Record<SplitTextRefusalReason, string> = {
    unmeasurable:
        "the container yielded no laid-out client rects (detached, " +
        "display:none, or zero-area) — a line-split cannot group fragments " +
        "without a measured line box. Use by:\"word\" (layout-independent), or " +
        "split after the element is laid out.",
    unstable:
        "the line measurement could not converge — the container's size " +
        "depends on its own content flow (a container-query / intrinsic-size " +
        "feedback loop), so the line grouping oscillates on every reflow. " +
        "Refused rather than latch a stale line map.",
    empty: "there is no text content to split into lines.",
};

/**
 * Thrown by `splitText(el, { by: "line" })` when the line measurement cannot be
 * taken (or held) — the typed half of the measure-or-refuse posture. Never
 * thrown for `by: "word"`/`"grapheme"` (those are layout-independent).
 */
export class SplitTextRefusalError extends Error {
    override readonly name = "SplitTextRefusalError";
    /** The machine-readable refusal cause. */
    readonly reason: SplitTextRefusalReason;

    constructor(reason: SplitTextRefusalReason, detail?: string) {
        super(
            `splitText refused a by:"line" split (${reason}): ` +
                (detail ?? REASON_DETAIL[reason]),
        );
        this.reason = reason;
        // Restore the prototype chain under ES2022 down-level `extends Error`.
        Object.setPrototypeOf(this, SplitTextRefusalError.prototype);
    }
}
