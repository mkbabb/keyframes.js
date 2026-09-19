/**
 * useEasingPickerSeat — the ONE seat for glass-ui's `EasingPicker`, consumed by
 * both of the demo's hosts (TimingFunctionPanel.vue; EasingSidebar.vue).
 *
 * KF-ES-12 (≡ KF-TFP-1): two hand-maintained seats shared seven bindings, two
 * divergent `quadEq`s, two divergent `:key` recipes and two divergent seed-echo
 * filters — and neither donor was clean. The panel's `:key` was computed from
 * the live stored quad, so the FIRST drag off a preset-matched quad remounted
 * the picker mid-gesture (KF-TFP-1); the sidebar's echo filter was measured
 * against a SEED that was never refreshed after a custom drag, so a real edit
 * returning to the seed value was swallowed forever (KF-ES-1); both carried a
 * hard-coded `"ease-out-back"` standing filter (KF-TFP-3 / KF-TFP-15). This
 * composable was SPECIFIED in the KF.W12 record before it was written, and it
 * is not a lift of either donor.
 *
 * The split-seam cure-lock (KF-CO-17 ≡ KF-ES-4), at the installed 7.0.0 bytes:
 *   • the vendor's `modelValue` watch is `{deep, immediate}` write-through —
 *     mode, points (via `setHandle`, which stamps the preset label `"custom"`),
 *     steps (projected into the picker's own 1–12 domain) and term all reach a
 *     MOUNTED picker through the model; the vendor swallows its own emitted
 *     value on re-entry (its by-value suppressor);
 *   • `EasingPickerValue` carries NO preset field, so a NAMED preset can only be
 *     DISPLAYED by (re)mounting on the `preset` initial prop. That is the one
 *     remaining remount, and it is keyed by an EXTERNAL named re-seat — never by
 *     the picker's own emissions.
 *
 * KF-ES-3's cure-lock: `presetName` is the CONSUMER's, resolved against the
 * demo's `NAMED_EASING_BEZIER` only — never value.js `bezierPresets` (the two
 * catalogues are never merged; `smooth-step-3` stays engine-native).
 */
import type { ComputedRef, ShallowRef, StyleValue } from "vue";
import { computed, shallowRef } from "vue";
import type { EasingPickerValue, JumpTerm } from "@mkbabb/glass-ui/easing";
import { cubicBezierToString } from "@mkbabb/value.js/math";

import {
    cubicBezierEasing,
    steppedEasing,
} from "@utils/reference-data/timingCurveUtils";

export type Quad = readonly [number, number, number, number];

/** Where the truth lives — the consumer's live curve state, read on demand. */
export interface SeatTruth {
    mode: "bezier" | "steps";
    points: Quad;
    steps: number;
    term: JumpTerm;
    /** The demo-named preset the truth IS (NAMED_EASING_BEZIER only), when it
     *  is one — the only thing that ever remounts the picker. */
    presetName?: string | undefined;
}

/** The picker's initial props — `preset` is present ONLY when there is one
 *  (no `undefined` keys: `exactOptionalPropertyTypes` is the type-check, and a
 *  seed built this way needs no cast at either seat). */
export type SeatSeed =
    | { mode: "bezier" | "steps"; steps: number; term: JumpTerm }
    | {
          mode: "bezier" | "steps";
          steps: number;
          term: JumpTerm;
          preset: string;
      };

/**
 * The picker's authoring domain for the step count, quoted from the installed
 * producer's `dist/components/easing/constants.d.ts` (`STEP_COUNT_MIN = 1`,
 * `STEP_COUNT_MAX = 12`). The `./easing` subpath exports the components and
 * the composable but not these constants (my read of `dist/easing.js`'s export
 * list) — the SS-6 ask is to export them; until then this is a quoted domain
 * bound, booked as a KF-TFP-15-class coupling in the record.
 */
const STEP_COUNT_MIN = 1;
const STEP_COUNT_MAX = 12;
const projectSteps = (steps: number): number =>
    Math.max(STEP_COUNT_MIN, Math.min(STEP_COUNT_MAX, Math.round(steps)));

/** The vendor quantises emitted handle coordinates to 3 decimals; 5e-4 is the
 *  half-step of that quantum — two quads within it are the same curve. */
export const quadEq = (a: Quad, b: Quad): boolean =>
    a.every((v, i) => Math.abs(v - b[i]!) < 0.0005);

export interface EasingPickerSeat {
    /** Bumps ONLY on an external named re-seat — bind `:key`. */
    key: Readonly<ShallowRef<number>>;
    /** The initial props — bind `v-bind="seat.seed"`. */
    seed: ComputedRef<SeatSeed>;
    /** The write-through model — bind `:model-value`. Never `undefined`: the
     *  seat is born on the truth, so the prop is always a value (and the
     *  `exactOptionalPropertyTypes` check needs no cast). */
    model: Readonly<ShallowRef<EasingPickerValue>>;
    /** The `@update:model-value` handler. */
    onPickerChange: (v: EasingPickerValue | undefined) => void;
    /** Call from the consumer's `watch` over its truth. */
    reseat: () => void;
    /** The LIVE-state echo predicate — exported for tests. */
    isEcho: (v: EasingPickerValue) => boolean;
    /** Bind `:style` on the picker's host element (KF-ES-18: `container-type`
     *  alone; no `container-name` — the name was inert and leaked into the flat
     *  global container namespace from two scoped blocks). */
    containerStyle: StyleValue;
}

export function useEasingPickerSeat(
    truth: () => SeatTruth,
    onAuthored: (v: EasingPickerValue) => void,
): EasingPickerSeat {
    const key = shallowRef(0);

    /** The named preset the MOUNTED picker was seeded with (what its preset
     *  label shows), or `undefined` once it shows a custom/steps curve. */
    let shownPreset: string | undefined;

    const seedFor = (t: SeatTruth): SeatSeed => {
        const base = { mode: t.mode, steps: t.steps, term: t.term };
        return t.presetName === undefined
            ? base
            : { ...base, preset: t.presetName };
    };
    // The seed is read at (re)mount only — it tracks truth so the remount the
    // key bump causes lands on the named preset that caused it.
    const seed = computed<SeatSeed>(() => seedFor(truth()));

    /** A full `EasingPickerValue` for the truth — what the model write carries
     *  (the vendor reads mode/points/steps/term; css/fn ride for the value's
     *  own shape, built by the demo's own curve utilities). */
    const valueFor = (t: SeatTruth): EasingPickerValue => {
        const points: [number, number, number, number] = [
            t.points[0],
            t.points[1],
            t.points[2],
            t.points[3],
        ];
        return t.mode === "steps"
            ? {
                  mode: "steps",
                  css: `steps(${t.steps}, ${t.term})`,
                  fn: steppedEasing(t.steps, t.term),
                  points,
                  steps: t.steps,
                  term: t.term,
              }
            : {
                  mode: "bezier",
                  css: cubicBezierToString(...points),
                  fn: cubicBezierEasing(...points),
                  points,
                  steps: t.steps,
                  term: t.term,
              };
    };

    // The first seat: born on the truth (the initial mount is a "remount"
    // onto it — the seed carries the preset, the model the same quad).
    const born = truth();
    shownPreset = born.presetName;
    const model = shallowRef<EasingPickerValue>(valueFor(born));

    /** Does the picker value SHOW the truth? Bezier: the quad. Steps: the term
     *  and the count — or the count's projection into the picker's domain (a
     *  stored count outside 1–12 is displayed clamped; the vendor emits that
     *  projection on write-through, and it is the echo of the truth-as-shown,
     *  never a user edit and never persisted — KF-CO-9's in-bounds half). */
    const showsTruth = (v: EasingPickerValue, t: SeatTruth): boolean => {
        if (v.mode !== t.mode) return false;
        if (t.mode === "steps") {
            return (
                v.term === t.term &&
                (v.steps === t.steps || v.steps === projectSteps(t.steps))
            );
        }
        return quadEq(v.points, t.points);
    };

    const isEcho = (v: EasingPickerValue): boolean => showsTruth(v, truth());

    const onPickerChange = (v: EasingPickerValue | undefined) => {
        if (!v) return;
        if (isEcho(v)) {
            // The (re)mount's immediate emission, the vendor's domain
            // projection, or a re-entry of a value we wrote: adopt, do not
            // author. A picker-side preset pick that lands on the truth's own
            // quad is also here — nothing to write.
            model.value = v;
            return;
        }
        // An authored edit: the consumer writes its truth; the emitted value
        // becomes the model so the vendor's suppressor sees its own object on
        // re-entry. Whatever the label shows now, it is no longer the seeded
        // preset (a drag stamps `"custom"`, a picker-side pick is its own).
        shownPreset = undefined;
        onAuthored(v);
        model.value = v;
    };

    const reseat = () => {
        const t = truth();
        if (showsTruth(model.value, t)) {
            // Already displayed by value (e.g. the consumer selected the name
            // a picker-side preset pick just produced) — no remount, no write
            // (KF-ES-5: the picker is never torn down under the user's hands).
            if (t.presetName !== undefined) shownPreset = t.presetName;
            return;
        }
        if (t.presetName !== undefined && t.presetName !== shownPreset) {
            // A NAMED curve the picker does not show: the only remount. The
            // seed carries `preset`; the model carries the same quad, so the
            // vendor's immediate write-through applies no `setHandle` and the
            // preset label survives.
            shownPreset = t.presetName;
            model.value = valueFor(t);
            key.value += 1;
            return;
        }
        // Steps, a custom quad, or a departure onto the stored quad: the
        // model write-through re-seats the MOUNTED picker.
        shownPreset = undefined;
        model.value = valueFor(t);
    };

    const containerStyle: StyleValue = { containerType: "inline-size" };

    return { key, seed, model, onPickerChange, reseat, isEcho, containerStyle };
}
