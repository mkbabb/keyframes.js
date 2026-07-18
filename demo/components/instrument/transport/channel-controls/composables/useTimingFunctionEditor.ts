import { cubicBezierToString } from "@mkbabb/value.js/math";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

import type { TimingFunction, TimingFunctionNames } from "@mkbabb/keyframes.js";
import type { StoredAnimationOptions } from "@state";

import {
    getCurvePath,
    cubicBezierEasing,
    generateCurveSVGPath,
    generateStepSVGPath,
    namedEasing,
    steppedEasing,
} from "@utils/reference-data/timingCurveUtils";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import {
    NAMED_EASING_BEZIER,
    isDetailTimingFunction,
    timingFunctionKind,
} from "@utils/reference-data/animationDescriptions";

import { computed, ref, watch } from "vue";

const easingItems = EASING_GROUPS.flatMap(({ items }) =>
    items.map(({ name }) => ({ value: name })),
);

// ── Composable ───────────────────────────────────────────────────────

export function useTimingFunctionEditor(
    getAnimation: () => KeyframesAnimation<any>,
    storedAnimationOptions: StoredAnimationOptions,
) {
    /** The name of the easing we auto-converted FROM (for subtitle display) */
    const convertedFromName = ref<string | null>(null);

    /** Whether the detail panel (cubic-bezier / steps) is open */
    const advancedOpen = ref(false);

    /** User dismissed the detail panel without changing the timing function */
    const detailPanelDismissed = ref(true);

    /** Only auto-open the editor when the edit icon was used, not from dropdown */
    const openEditorOnChange = ref(false);

    // I.W2.S3 — the store persists a re-parseable LITERAL; the UI keys off the
    // KIND. `isDetailTimingFunction` / `timingFunctionKind` are literal-aware, so
    // `cubic-bezier(0.2, …)` still reads as a detail/bezier curve for these gates.

    /** True when the current timing function has a dedicated editor (cubic-bezier, steps) */
    const isDetailEasing = computed(() =>
        isDetailTimingFunction(
            storedAnimationOptions.animationOptions.timingFunction,
        ),
    );

    /** Whether the detail panel should be visible */
    const showDetailPanel = computed(
        () =>
            isDetailTimingFunction(
                storedAnimationOptions.animationOptions.timingFunction,
            ) && !detailPanelDismissed.value,
    );

    /** Reactive SVG path for the current timing function */
    const activeCurvePath = computed(() => {
        const kind = timingFunctionKind(
            storedAnimationOptions.animationOptions.timingFunction,
        );
        if (kind === undefined) return "";
        if (kind === "cubic-bezier") {
            const [x1, y1, x2, y2] =
                storedAnimationOptions.cubicBezierOptions.controlPoints;
            return generateCurveSVGPath(cubicBezierEasing(x1, y1, x2, y2));
        }
        if (kind === "steps") {
            const { steps } = storedAnimationOptions.stepOptions;
            return generateStepSVGPath(steps);
        }
        return getCurvePath(kind);
    });

    // Re-open the detail panel only when triggered via edit icon
    watch(
        () => storedAnimationOptions.animationOptions.timingFunction as string,
        () => {
            if (openEditorOnChange.value) {
                detailPanelDismissed.value = false;
                openEditorOnChange.value = false;
            }
        },
    );

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
     * literal for a timing-function key. `cubic-bezier` → `cubic-bezier(x1, y1,
     * x2, y2)` (the live control points), `steps` → `steps(n, term)`, a named
     * curve/keyword → itself (a valid registry name). NEVER the bare
     * `cubic-bezier`/`steps` keyword — that token is what `resolveEasingOption`
     * (← `setTimingFunction` ← `new CSSKeyframesAnimation`) REJECTS with an
     * `AnimationOptionError` on the next controls re-mount. This literal is what
     * the editor PERSISTS, so the value the construction path reads back is
     * re-mountable (couples to — but is not inferred from — I.W0's
     * construction-path tolerance).
     */
    const timingFunctionLiteralFor = (
        key: TimingFunctionNames | "cubic-bezier",
    ): string => {
        if (key === "cubic-bezier") {
            return cubicBezierToString(
                ...storedAnimationOptions.cubicBezierOptions.controlPoints,
            );
        }
        if (key === "steps") {
            const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
            return `steps(${steps}, ${jumpTerm})`;
        }
        return key;
    };

    const updateTimingFunctionFromName = (
        keyOrLiteral: TimingFunctionNames | "cubic-bezier" | string,
    ) => {
        // Accept either a bare key OR a persisted LITERAL (the onMounted re-apply
        // reads the stored value, which is now a literal) — normalize to the kind.
        const kind = timingFunctionKind(keyOrLiteral);
        if (kind === undefined) {
            throw new TypeError(
                `Invalid timing function ${JSON.stringify(keyOrLiteral)}.`,
            );
        }
        const key = kind as TimingFunctionNames | "cubic-bezier";

        let timingFunction: TimingFunction;
        if (key === "steps") {
            const { steps, jumpTerm } = storedAnimationOptions.stepOptions;
            timingFunction = steppedEasing(steps, jumpTerm);
        } else if (key === "cubic-bezier") {
            timingFunction = cubicBezierEasing(
                ...storedAnimationOptions.cubicBezierOptions.controlPoints,
            );
        } else {
            timingFunction = namedEasing(key);
        }
        // Pass the complete re-parseable literal as the CSS twin (EE-02): the
        // fresh `cubic-bezier(...)`/`steps(...)` closures are not the registry
        // singleton, so the readout would otherwise throw serializing them.
        setAnimationTimingFunction(timingFunction, timingFunctionLiteralFor(key));

        // I.W2.S3 — PERSIST the complete re-parseable literal (not the bare
        // token), so a controls re-mount that reads `animationOptions.
        // timingFunction` round-trips through `new CSSKeyframesAnimation`
        // without throwing. ONE persist seam — every caller (the dropdown, the
        // in-panel selector, the bezier-drag) gets the literal.
        storedAnimationOptions.animationOptions.timingFunction =
            timingFunctionLiteralFor(key);
    };

    /** Called from the edit icon — opens the curve editor */
    const onEditIconClick = (currentEasing: string) => {
        openEditorOnChange.value = true;
        onEasingLabelClick(currentEasing);
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

        // Named easing → auto-convert to cubic-bezier
        const bezierPoints = NAMED_EASING_BEZIER[currentEasing];
        if (bezierPoints) {
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                ...bezierPoints,
            ];
            convertedFromName.value = currentEasing;
        } else {
            storedAnimationOptions.cubicBezierOptions.controlPoints = [
                0, 0, 1, 1,
            ];
            convertedFromName.value = currentEasing;
        }
        // `updateTimingFunctionFromName("cubic-bezier")` persists the
        // `cubic-bezier(x1, y1, x2, y2)` LITERAL (the live points) — re-mountable.
        updateTimingFunctionFromName("cubic-bezier");
        detailPanelDismissed.value = false;
    };

    const exitDetailPanel = () => {
        detailPanelDismissed.value = true;
        convertedFromName.value = null;
    };

    return {
        // Static data
        easingItems,

        // Reactive state
        convertedFromName,
        advancedOpen,
        isDetailEasing,
        showDetailPanel,
        activeCurvePath,

        // Actions
        onEditIconClick,
        onEasingLabelClick,
        exitDetailPanel,
        setAnimationTimingFunction,
        updateTimingFunctionFromName,
    };
}
