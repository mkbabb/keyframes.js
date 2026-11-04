// SERVED MODEL: claude-opus-5-5
import { useEventListener } from "@vueuse/core";
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import type { Ref } from "vue";
// The reserve's shape is transport-owned (the controls group binds it); the
// pane reaches transport/ for its channel types only (r4shared-structure).
import { NO_STAGE_RESERVE } from "../../transport/transportSource";
import type { StageReserve } from "../../transport/transportSource";

/**
 * KF-M1 (value.js COHESION §0hm D-2 · D-3 · D-28) — the phone sheet's
 * reserve on the stage, published.
 *
 * The phone stage is a fixed full-bleed layer and the controls sheet rests
 * over it. Every scene used to centre in the full host, so the resting sheet
 * covered the lower 27% of the stage in portrait (the cube sat 81 px below the
 * centre of what could be seen) and 268 px of it in landscape. The stage box
 * is now the VISIBLE region V: the stage cell reserves the sheet's SETTLED
 * PEEK size on the axis the sheet rests on (AnimationControlsGroup.css).
 *
 *  · `block` / `inline` — the PEEK size, on the sheet's axis. It is the same
 *    at every rung, so the stage's layout rect holds still through
 *    peek → open → peek (the J.WZ stable-stage invariant).
 *  · `liftBlock` / `liftInline` — how much further the sheet reaches at OPEN
 *    (open − peek; 0 at PEEK and at FULL, the editing posture). The stage
 *    answers it on the compositor (a translate and a scale on its glide
 *    wrapper), never in layout.
 *
 * The rung sizes are the sheet's own geometry — the detent fraction of the
 * viewport, floored by glass's computed min-block-size and capped by the
 * consumer's max-block-size — read off the sheet element once per rung commit
 * (never per frame, never mid-drag).
 */
export type SheetRung = "peek" | "open" | "full";

interface StageReserveParams {
    /** A sheet rests on the stage (phone layout, a surface is selected). */
    active: Ref<boolean>;
    side: Ref<"bottom" | "right">;
    rung: Ref<SheetRung>;
    /** The detent fractions. */
    peek: Ref<number>;
    open: Ref<number>;
    sheetEl: () => HTMLElement | null;
    publish: (reserve: StageReserve) => void;
}

const px = (v: string) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
};

/** The sheet's size at detent `t` on its own axis (px). */
export const sheetRungSize = (el: HTMLElement | null, side: "bottom" | "right", t: number): number => {
    const axis = side === "bottom" ? innerHeight : innerWidth;
    if (!el) return t * axis;
    const cs = getComputedStyle(el);
    const floor = px(side === "bottom" ? cs.minBlockSize : cs.minInlineSize);
    const capRaw = side === "bottom" ? cs.maxBlockSize : cs.maxInlineSize;
    const cap = capRaw === "none" || !capRaw ? Infinity : px(capRaw) || Infinity;
    return Math.min(cap, Math.max(floor, t * axis));
};

export function useStageReserve(params: StageReserveParams) {
    const { active, side, rung, peek, open, sheetEl, publish } = params;
    let last = "";

    const write = (r: StageReserve) => {
        const key = `${r.block}|${r.inline}|${r.liftBlock}|${r.liftInline}`;
        if (key === last) return;
        last = key;
        publish(r);
    };

    const measure = () => {
        if (!active.value) return write(NO_STAGE_RESERVE);
        const el = sheetEl();
        // Never mid-drag: the drag's live size is not a rung.
        if (el?.hasAttribute("data-dragging")) return;
        const s = side.value;
        const peekSize = sheetRungSize(el, s, peek.value);
        const lift = rung.value === "open" ? Math.max(0, sheetRungSize(el, s, open.value) - peekSize) : 0;
        write(
            s === "bottom"
                ? { block: peekSize, inline: 0, liftBlock: lift, liftInline: 0 }
                : { block: 0, inline: peekSize, liftBlock: 0, liftInline: lift },
        );
    };

    // Once per rung commit (and when the rung ladder itself changes).
    watch([active, side, rung, peek, open], () => void nextTick(measure), { flush: "post" });
    onMounted(() => void nextTick(() => requestAnimationFrame(measure)));
    useEventListener(window, "resize", measure, { passive: true });
    onBeforeUnmount(() => write(NO_STAGE_RESERVE));

    return { measure };
}

/**
 * D-28 — the PEEK detent lands on a ROW BOUNDARY. The resting sheet used to
 * slice the first control row in half (171 px at 390: glass's floor, not a
 * row). Measured once per scene mount: the smallest peek that shows the handle,
 * the first layer header and every row down to a whole row's foot, never below
 * glass's own floor. Returns the detent fraction, or null when the sheet has
 * not laid out yet.
 */
export const rowBoundaryPeek = (el: HTMLElement | null, rowSelector: string): number | null => {
    if (!el) return null;
    const box = el.getBoundingClientRect();
    if (box.height === 0) return null;
    const cs = getComputedStyle(el);
    const floor = px(cs.minBlockSize);
    const padEnd = px(cs.paddingBlockEnd);
    // Rows sit at fixed offsets from the sheet's top edge whatever its size
    // (the header and the body port stack from the top).
    const feet = [...el.querySelectorAll<HTMLElement>(rowSelector)]
        .map((r) => r.getBoundingClientRect())
        .filter((r) => r.height > 0)
        .map((r) => r.bottom - box.top + padEnd)
        .sort((a, b) => a - b);
    const foot = feet.find((f) => f >= floor - 0.5);
    if (foot === undefined) return null;
    return foot / innerHeight;
};
