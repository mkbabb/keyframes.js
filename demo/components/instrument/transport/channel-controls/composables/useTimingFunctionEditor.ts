import { cubicBezierToString } from "@mkbabb/value.js/math";
import { parseTimingFunction } from "@mkbabb/value.js/css";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import type { TimingFunction, TimingFunctionNames } from "@mkbabb/keyframes.js";
import type { StoredAnimationOptions } from "@state";

/** The editor's two draft kinds — the tokens the dropdown and the panel emit
 *  for a curve that is being AUTHORED (its parameters live in the store). */
export type DraftKind = "cubic-bezier" | "steps";

/**
 * What the store persists for `animationOptions.timingFunction`: a registry
 * name, one of the two singular step keywords, or a complete parametric
 * literal — every member is assignable to the engine's option surface
 * (`InputAnimationOptions["timingFunction"]`, whose `CssEasingLiteral` arm
 * spells exactly these functional forms), and none is the bare draft token.
 */
export type TimingFunctionLiteral =
    | TimingFunctionNames
    | "step-start"
    | "step-end"
    | `cubic-bezier(${string})`
    | `steps(${string})`;

// The shape guards Value's parser has already proven, restated as predicates
// so the literal type is NARROWED, never asserted: a `cubic-bezier(` / `steps(`
// spelling is the functional form, and a name the classifier accepts is a
// registry name or one of the two singular step keywords.
const isCubicBezierLiteral = (s: string): s is `cubic-bezier(${string})` =>
    s.startsWith("cubic-bezier(");
const isStepsLiteral = (s: string): s is `steps(${string})` =>
    s.startsWith("steps(");
const isStepKeyword = (s: string): s is "step-start" | "step-end" =>
    s === "step-start" || s === "step-end";
const isTimingFunctionName = (s: string): s is TimingFunctionNames =>
    timingFunctionKind(s) !== undefined;

import {
    cubicBezierEasing,
    generateCurveSVGPath,
    namedEasing,
    steppedEasing,
} from "@utils/reference-data/timingCurveUtils";
import {
    NAMED_EASING_BEZIER,
    isDetailTimingFunction,
    timingFunctionKind,
} from "@utils/reference-data/animationDescriptions";

import { computed, ref } from "vue";

// KF-CO-34 — the consumerless `easingItems` (the only reason this composable
// imported the whole EASING_GROUPS module) and `activeCurvePath` (L·N-7; the
// hand-plotted trigger sparkline died with the instrument/easing cluster) are
// deleted with their imports: one module-graph edge fewer.

// ── Composable ───────────────────────────────────────────────────────

export function useTimingFunctionEditor(
    getAnimation: () => KeyframesAnimation<any>,
    storedAnimationOptions: StoredAnimationOptions,
) {
    /** The name of the easing we auto-converted FROM (for subtitle display) */
    const convertedFromName = ref<string | null>(null);

    /** Whether the ADVANCED sub-pane (layer settings) is open — not the
     *  detail editor, whose gate is `showDetailPanel` below (N-9). */
    const advancedOpen = ref(false);

    /** User dismissed the detail panel without changing the timing function */
    const detailPanelDismissed = ref(true);

    // KF-CO-23 + KF-CO-44 — the `openEditorOnChange` one-shot flag and the
    // store watch that was its only clearer are DELETED. The flag existed to
    // open the editor after the pencil's persist landed, and leaked on the two
    // branches that persist nothing (an already-bezier curve, a byte-identical
    // steps literal), so a LATER dropdown pick auto-opened the editor — the
    // very thing the flag's docstring said it prevented. Every opener now sets
    // `detailPanelDismissed` itself, synchronously, at the moment of the act;
    // and a dropdown pick of a DRAFT kind (`cubic-bezier` / `steps` — entries
    // whose whole meaning is "open an editor") opens it through the same seam
    // (`onCurvePicked`) instead of persisting silently and showing nothing.

    // I.W2.S3 — the store persists a re-parseable LITERAL; the UI keys off the
    // KIND. `isDetailTimingFunction` / `timingFunctionKind` are literal-aware, so
    // `cubic-bezier(0.2, …)` still reads as a detail/bezier curve for these gates.

    /** True when the current timing function has a dedicated editor (cubic-bezier, steps) */
    const isDetailEasing = computed(() =>
        isDetailTimingFunction(
            storedAnimationOptions.animationOptions.timingFunction,
        ),
    );

    /**
     * KF-CO-13 — a DEPARTURE: the pencil was used on a name no cubic-bezier
     * reproduces (`ease-in-bounce`, `smooth-step-3` — the catalogue gap, KF-SS3's
     * preserved class). The editor opens on the stored quad WITHOUT rewriting
     * the selection: nothing is persisted until the user authors an edit, and
     * the panel says what it departed from. The former path flattened the curve
     * to `[0, 0, 1, 1]` and persisted `cubic-bezier(0, 0, 1, 1)` on open.
     */
    const departure = computed(
        () => convertedFromName.value !== null && !isDetailEasing.value,
    );

    /** Whether the detail panel should be visible */
    const showDetailPanel = computed(
        () =>
            (isDetailEasing.value || departure.value) &&
            !detailPanelDismissed.value,
    );

    /**
     * KF-CO-10 (the selection half) — the catalogue key the easing dropdown
     * shows SELECTED for the stored literal. The two singular step keywords are
     * their own catalogue entries and stay selected AS THEMSELVES (the former
     * binding collapsed them to their kind, so picking `step-start` visibly
     * jumped the highlight onto `steps`); a parametric literal selects its
     * draft kind (`cubic-bezier(…)` → `cubic-bezier`, `steps(…)` → `steps`);
     * every other name selects itself. A value the grammar cannot classify (a
     * poisoned bucket) selects NOTHING — the producer renders its placeholder
     * for a key that matches no item — rather than a guessed entry.
     */
    const selectedCurveKey = computed<string>(() => {
        const stored = storedAnimationOptions.animationOptions.timingFunction;
        if (typeof stored !== "string") return "";
        if (isStepKeyword(stored)) return stored;
        return timingFunctionKind(stored) ?? stored;
    });

    // ── Mutators ─────────────────────────────────────────────────────

    const setAnimationTimingFunction = (
        timingFunction: TimingFunction,
        css?: string,
    ) => {
        const animation = getAnimation();
        // The engine carries easing as a typed `Easing` ({ fn, css? });
        // wrap the bare callable once and share the reference across
        // frames so WAAPI uniform-timing eligibility sees ONE easing. The
        // faithful CSS twin rides along so the Keyframes-string readout can
        // serialize THIS live easing verbatim — a css-less `{ fn }` closure
        // that is not the registry singleton makes `serializeEasing` throw
        // (the gated G.W4 fail-explicit contract; EE-02).
        const easing =
            css !== undefined ? { fn: timingFunction, css } : { fn: timingFunction };
        animation.options.timingFunction = easing;
        animation.frames.forEach((frame) => {
            frame.timingFunction = easing;
        });
    };

    /**
     * I.W2.S3 (the B5 readout seam, I.W2-owned) — the COMPLETE, re-parseable CSS
     * literal for one of the editor's two DRAFT kinds. `cubic-bezier` →
     * `cubic-bezier(x1, y1, x2, y2)` (the live control points), `steps` →
     * `steps(n, term)`. NEVER the bare `cubic-bezier`/`steps` keyword — that
     * token is what `resolveEasingOption` (← `setTimingFunction` ← `new
     * CSSKeyframesAnimation`) REJECTS with an `AnimationOptionError` on the next
     * controls re-mount. This literal is what the editor PERSISTS, so the value
     * the construction path reads back is re-mountable (couples to — but is not
     * inferred from — I.W0's construction-path tolerance).
     */
    const timingFunctionLiteralFor = (
        key: DraftKind,
    ): TimingFunctionLiteral => {
        if (key === "cubic-bezier") {
            const literal = cubicBezierToString(
                ...storedAnimationOptions.cubicBezierOptions.controlPoints,
            );
            if (!isCubicBezierLiteral(literal)) {
                throw new TypeError(
                    `cubicBezierToString produced ${JSON.stringify(literal)}.`,
                );
            }
            return literal;
        }
        const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
        return `steps(${steps}, ${jumpTerm})`;
    };

    /**
     * The ONE resolution of a timing-function key or literal into (a) the
     * engine easing, (b) the literal that is persisted, and (c) the store
     * parameters the literal implies. Three shapes arrive here:
     *
     *   • a DRAFT kind (`"cubic-bezier"` / `"steps"`) — the editor's own token
     *     (the dropdown pick, the panel's emit): the parameters are the STORE's
     *     (the quad / the step options the user is authoring), and the literal
     *     is derived from them;
     *   • a complete LITERAL (`cubic-bezier(…)` / `steps(…)`) — the persisted
     *     value on re-mount, or a value another writer stored (the keyframes
     *     pane persists the parsed CSS's literal and never the quad): the
     *     parameters are READ FROM THE LITERAL and the store is RECONCILED to
     *     them, and the literal is passed through byte-for-byte. KF-CO-4 (R3
     *     §9.7): the former path collapsed a literal to its kind and REBUILT the
     *     curve from the store's stale quad — a curve authored in the Keyframes
     *     pane was silently rewritten to a different curve on the next tab
     *     switch, because the store held two representations of one curve and
     *     a writer for each, a reconciler for neither. This is the reconciler;
     *     the literal is never re-derived;
     *   • a NAME — a CSS keyword (`ease-in-out`, `step-start`, `step-end`) or a
     *     registry name (`ease-in-bounce`, `smooth-step-3`): the easing is the
     *     registry's and the name itself is the literal. `step-start`/`step-end`
     *     resolve through the same parse (KF-CO-10, the engine half): Value's
     *     grammar reads them as `steps(1, jump-start)` / `steps(1, jump-end)`,
     *     so they are built from THOSE parameters and are no longer aliases of
     *     the store's `steps(n, term)`; the keyword is what is persisted (a
     *     keyword is its own re-parseable literal), so the selection stays
     *     named.
     */
    const resolveTimingFunction = (
        keyOrLiteral: string,
    ): { easing: TimingFunction; literal: TimingFunctionLiteral } => {
        if (keyOrLiteral === "cubic-bezier" || keyOrLiteral === "steps") {
            const key: DraftKind = keyOrLiteral;
            const easing =
                key === "steps"
                    ? steppedEasing(
                          storedAnimationOptions.stepOptions.steps,
                          storedAnimationOptions.stepOptions.jumpTerm,
                      )
                    : cubicBezierEasing(
                          ...storedAnimationOptions.cubicBezierOptions
                              .controlPoints,
                      );
            return { easing, literal: timingFunctionLiteralFor(key) };
        }

        const parsed = parseTimingFunction(keyOrLiteral);
        if (
            parsed.ok &&
            parsed.value.kind === "cubic-bezier" &&
            isCubicBezierLiteral(keyOrLiteral)
        ) {
            const { x1, y1, x2, y2 } = parsed.value;
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                x1,
                y1,
                x2,
                y2,
            ];
            return {
                easing: cubicBezierEasing(x1, y1, x2, y2),
                literal: keyOrLiteral,
            };
        }
        if (parsed.ok && parsed.value.kind === "steps") {
            const { count, position } = parsed.value;
            if (isStepKeyword(keyOrLiteral)) {
                // The two singular keywords are their own literal and leave
                // the authored step options alone (they are not `steps`).
                return { easing: steppedEasing(count, position), literal: keyOrLiteral };
            }
            if (isStepsLiteral(keyOrLiteral)) {
                // A `steps(n, term)` literal IS the step-options representation
                // — reconcile the store to it.
                storedAnimationOptions.stepOptions.steps = count;
                storedAnimationOptions.stepOptions.jumpTerm = position;
                return { easing: steppedEasing(count, position), literal: keyOrLiteral };
            }
        }
        if (!isTimingFunctionName(keyOrLiteral)) {
            throw new TypeError(
                `Invalid timing function ${JSON.stringify(keyOrLiteral)}.`,
            );
        }
        return { easing: namedEasing(keyOrLiteral), literal: keyOrLiteral };
    };

    /**
     * OA-7 (§0ao.1) — a picker row's curve glyph: the SVG path sampled from
     * the SAME easing `onCurvePicked(key)` would install on the animation
     * (`resolveTimingFunction` — a name resolves through the registry, a
     * draft kind through the store's live parameters, so the `cubic-bezier`
     * / `steps` rows plot the curve the user is authoring). Never a sprite:
     * the glyph IS the function. A row key is a name or a draft kind, never a
     * literal, so the resolution reconciles nothing into the store. 64
     * samples keep a step's riser sub-pixel at the row's glyph size.
     */
    const curveGlyphPath = (key: string): string =>
        generateCurveSVGPath(resolveTimingFunction(key).easing, 64);

    const updateTimingFunctionFromName = (keyOrLiteral: string) => {
        const { easing, literal } = resolveTimingFunction(keyOrLiteral);
        // Pass the complete re-parseable literal as the CSS twin (EE-02): the
        // fresh `cubic-bezier(...)`/`steps(...)` closures are not the registry
        // singleton, so the readout would otherwise throw serializing them.
        setAnimationTimingFunction(easing, literal);

        // I.W2.S3 — PERSIST the complete re-parseable literal (not the bare
        // token), so a controls re-mount that reads `animationOptions.
        // timingFunction` round-trips through `new CSSKeyframesAnimation`
        // without throwing. ONE persist seam — every caller (the dropdown, the
        // in-panel selector, the bezier-drag) gets the literal.
        storedAnimationOptions.animationOptions.timingFunction = literal;
    };

    /** Called from the edit icon — opens the curve editor */
    const onEditIconClick = (currentEasing: string) => {
        onEasingLabelClick(currentEasing);
    };

    /**
     * The dropdown's pick. A NAME is persisted and applied, and the editor is
     * left as it was; a DRAFT kind is persisted as its complete literal from
     * the store's parameters AND opens the editor on them (KF-CO-23) — the
     * dropdown row for `cubic-bezier` / `steps` is an editor entry, not a
     * silent selection.
     */
    const onCurvePicked = (key: string) => {
        updateTimingFunctionFromName(key);
        if (key === "cubic-bezier" || key === "steps") {
            convertedFromName.value = null;
            detailPanelDismissed.value = false;
        }
    };

    const onEasingLabelClick = (currentEasing: string) => {
        // The stored value may be a LITERAL now (I.W2.S3) — key off the KIND.
        const kind = timingFunctionKind(currentEasing);
        if (kind === undefined) return;

        if (kind === "steps") {
            // Persist the COMPLETE steps literal (not the bare keyword) so a
            // re-mount round-trips; `updateTimingFunctionFromName` writes it.
            updateTimingFunctionFromName("steps");
            detailPanelDismissed.value = false;
            return;
        }

        if (kind === "cubic-bezier") {
            detailPanelDismissed.value = false;
            convertedFromName.value = null;
            return;
        }

        // A named easing the demo's catalogue can express as ONE cubic-bezier
        // (`NAMED_EASING_BEZIER` — never `bezierPresets`, KF-SS3) is
        // auto-converted: the quad is seated and the literal persisted.
        const bezierPoints = NAMED_EASING_BEZIER[currentEasing];
        if (bezierPoints) {
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                ...bezierPoints,
            ];
            convertedFromName.value = currentEasing;
            // `updateTimingFunctionFromName("cubic-bezier")` persists the
            // `cubic-bezier(x1, y1, x2, y2)` LITERAL (the live points).
            updateTimingFunctionFromName("cubic-bezier");
            detailPanelDismissed.value = false;
            return;
        }

        // KF-CO-13 — an engine-native name (no bezier reproduces it): open the
        // editor as a DEPARTURE on the stored quad. The selection is NOT
        // rewritten and nothing is persisted here; the first authored edit
        // (the panel's emit) is what writes `cubic-bezier(…)`.
        convertedFromName.value = currentEasing;
        detailPanelDismissed.value = false;
    };

    const exitDetailPanel = () => {
        detailPanelDismissed.value = true;
        convertedFromName.value = null;
    };

    return {
        // Reactive state
        convertedFromName,
        departure,
        advancedOpen,
        isDetailEasing,
        showDetailPanel,
        selectedCurveKey,

        // Actions
        onEditIconClick,
        onEasingLabelClick,
        onCurvePicked,
        exitDetailPanel,
        setAnimationTimingFunction,
        updateTimingFunctionFromName,
        curveGlyphPath,
    };
}
