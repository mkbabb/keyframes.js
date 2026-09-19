import { convertPixelsToCh } from "@utils/helpers";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { ref } from "vue";
import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "@state";

/**
 * The editor's UI-state half: the reactive string refs, the stored-control
 * scaffold, the stable identifiers, and the pure format-width / animation-name
 * helpers. No parsing, no animation mutation — that is `useKeyframesParsing`.
 */
export function useKeyframesState(animation: KeyframesAnimation<any>) {
    // N-8 (X.KF.W12.e) — ONE DERIVATION, AND IT IS THE LIBRARY'S.
    //
    // `cssIdent` is the emitter's own ident normalizer — the single function the
    // Export path has always applied (`compile/emit/backward/walk.ts`) — and
    // KF.W5 published it on the engine surface for exactly this consumer. It is
    // read at SETUP scope, never at module scope (KF-KE-51): the warm resolves
    // before the app mounts, and a module-scope read turns a swallowed warm
    // failure into a chunk-evaluation throw for the whole scene.
    const { cssIdent } = kfEngine();

    const animationUUID = createAnimationUUId(animation, animation.superKey);

    // The id is normalized ONCE, here, and every consumer downstream reads THIS
    // token: the class the Apply control adds, the `@keyframes`/`animation-name`
    // the sheet is emitted under, and the `<style>` element's own id. Routing a
    // second derivation beside `cssIdent` is forbidden by name (N-8), so there
    // is nothing to keep in agreement — the three names are one string by
    // construction.
    //
    // It is also the safety: `createAnimationUUId` composes a user-facing
    // `superKey` and animation name, and a name carrying a space (or a `.`, or
    // a `/`) made `classList.add` throw `InvalidCharacterError` and made
    // `document.head.querySelector('#' + styleId)` parse as a descendant
    // selector so the sheet-reuse branch never matched (L-I-1). `cssIdent`
    // folds every non-`[A-Za-z0-9_-]` byte to `-`, and the literal
    // `keyframes-style-` prefix guarantees the leading-letter rule, so the
    // normalizer's own `a`-prefix arm is unreachable from here.
    //
    // KF-KE-4 (X.KF.W12.c), re-stated at the bytes that survived it: this token
    // IS the name the injected stylesheet is emitted under — its `.selector`,
    // its `animation-name` and its `@keyframes` name (the emitter's only rule is
    // `` `.${name}` ``) — AND the class the Apply control adds to every target
    // (`useKeyframeBrushApply` → `useApplyCSS`: `getClassName() === styleId`).
    // A `getTmpAnimationName()` accessor used to sit beside it stripping the
    // `keyframes-style-` prefix and case-folding, so the sheet named `.x` while
    // the target wore `keyframes-style-X` and Apply had never once applied
    // anything. `.c` made that accessor return this token verbatim; `.e`
    // (D-23 + the emitted-selector carve) deletes the accessor outright, because
    // a second NAME for the one name is the shape N-8 forbids and the alias was
    // already dead at both of its consumers. Every reader now reads THIS const.
    const keyframesStyleId = cssIdent(`keyframes-style-${animationUUID}`);

    const storedControls = getStoredAnimationGroupControlOptions(animation);
    const kfControls = storedControls.keyframeControls;

    // --- Refs ---

    const cssKeyframesString = ref("");
    const addKeyframesString = ref(kfControls.addKeyframes);
    const templateFrameStrings = ref<string[]>([]);

    // --- Pure helpers ---

    /**
     * KF-KE-48 (X.KF.W12.c) — the format width is HONEST about its input. It
     * read a `tabsListEl` ref that nothing ever bound, through a `!` asserting
     * a value that was always null, so every caller got `undefined` and the
     * responsive print-width path was dead while looking alive. The ref is
     * gone; the function takes the measuring element or returns `undefined`
     * (prettier's own default width), and says so.
     */
    const getFormatWidth = (el?: HTMLElement) => {
        if (el === undefined || el.offsetWidth == null) {
            return undefined;
        }

        return convertPixelsToCh(el.offsetWidth, el);
    };

    return {
        animationUUID,
        keyframesStyleId,
        storedControls,
        kfControls,

        cssKeyframesString,
        addKeyframesString,
        templateFrameStrings,

        getFormatWidth,
    };
}

export type KeyframesState = ReturnType<typeof useKeyframesState>;
