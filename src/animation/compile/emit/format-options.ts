/**
 * compile/emit/format-options.ts — the OPTION/SHORTHAND serialization half
 * of the backward `format` surface (T.F22 — the per-zone cohesion carve off
 * `format.ts`).
 *
 * `format.ts` owns the KEYFRAME-BODY projection (the declared-template `{ … }`
 * bodies + the `@keyframes` block builders). THIS file owns the sibling concern:
 * serializing an animation's OPTIONS back to CSS — the `.class { animation-* }`
 * longhand block ({@link animationOptionsToString}), the per-child `animation`
 * SHORTHAND via value.js's `reverseAnimationShorthand` ({@link animationShorthand}),
 * the standalone `animation-composition` longhand ({@link animationComposition}),
 * and the `@property` typing-block re-serialize ({@link propertyRegistryToString}).
 *
 * Pure extraction — zero behaviour change; `format.ts` re-consumes these for the
 * aggregate `CSSKeyframesToString`, and `backward.ts` imports the shorthand +
 * composition emitters from HERE. HEAVY (value.js-bearing) — reached only via
 * `loadAnimationEngine()`.
 */
import { reverseAnimationShorthand, reverseCSSTime, serializeStylesheetItem } from "@mkbabb/value.js/parsing";
import type { CSSAnimationOptions, PropertyDescriptor } from "@mkbabb/value.js/parsing";
import type { KeyframesAnimation } from "../../engine";
import type {
    AnimationOptions,
    CompositeOperator,
    Vars,
} from "../../constants";
import { serializeEasing } from "./easing-serialize";

export function animationOptionsToString(
    options: AnimationOptions,
    name: string = "animation",
) {
    let css = "";

    css += `  animation-name: ${name};\n`;

    const duration = reverseCSSTime(options.duration);
    css += `  animation-duration: ${duration};\n`;

    css += `  animation-timing-function: ${serializeEasing(options.timingFunction)};\n`;

    css += `  animation-iteration-count: ${
        isFinite(options.iterationCount) ? options.iterationCount : "infinite"
    };\n`;
    css += `  animation-direction: ${options.direction};\n`;
    css += `  animation-fill-mode: ${options.fillMode};\n`;

    if (options.delay > 0) {
        css += `  animation-delay: ${reverseCSSTime(options.delay)};\n`;
    }

    // L.W1 S5 (Band A) — the LAYER-level `animation-composition` longhand. An
    // authored `animation-composition: add` that arrived through a sibling
    // `.class { animation: … }` ingest rides `options.composite`; emit it back
    // (via the ONE `animationComposition` longhand authority) for a non-default
    // operator so the layer-level compositing replays on re-parse. `replace` (or
    // omission) emits nothing — the byte-minimal round-trip.
    const compositeDecl =
        options.composite != null
            ? animationComposition(options.composite)
            : undefined;
    if (compositeDecl != null) {
        css += `  ${compositeDecl}\n`;
    }

    css = `.${name} {\n${css}}\n`;

    return css;
}

/**
 * K.W10 CC-1 — the per-child `animation` SHORTHAND emit via value.js's
 * `reverseAnimationShorthand` (the published 0.12.0 inverse of the
 * `animation`-shorthand parser). This is the round-trip producer for each
 * child's `animation` longhand: kf's {@link AnimationOptions} → the
 * value.js-spec {@link CSSAnimationOptions} → the canonical shorthand string —
 * the parser run BACKWARD over value.js's OWN shorthand grammar, NOT a bespoke
 * re-derivation.
 *
 * `animation-composition` is DELIBERATELY NOT folded into the shorthand here:
 * per the CSS Animations L2 grammar it is NOT a sub-property of the `animation`
 * shorthand (a browser would not parse `animation: … add name` as composition),
 * so the compiler ({@link compileToCSS} via `animationComposition`) emits it as
 * a SEPARATE `animation-composition:` longhand. Keeping it off the shorthand is
 * the faithfulness — the emitted CSS must re-parse to the same layered result.
 *
 * The easing MUST have a faithful CSS twin (`serializeEasing` THROWS otherwise —
 * the CC-3 custom-renderer/closure refusal generalized to the easing channel);
 * a spring's `linear()` flows through verbatim.
 */
export function animationShorthand(options: AnimationOptions, name: string): string {
    const cssOptions: CSSAnimationOptions = {
        name,
        duration: options.duration,
        timingFunction: serializeEasing(options.timingFunction),
        iterationCount: isFinite(options.iterationCount)
            ? options.iterationCount
            : Infinity,
        direction: options.direction,
        fillMode: options.fillMode,
    };
    if (options.delay > 0) cssOptions.delay = options.delay;
    return reverseAnimationShorthand(cssOptions);
}

/**
 * K.W10 CC-1 — the `animation-composition` SEPARATE longhand (CC-1's W7
 * inversion). CSS `animation-composition` is `replace | add | accumulate`; kf's
 * `add` LAYER blend (`BlendMode`) and per-stop `add`/`accumulate` honor (W7)
 * ride here as the standalone longhand, so the emitted CSS replays the SAME
 * layered result the JS playback did. Returns `undefined` for the default
 * `replace` (omitted — the byte-minimal round-trip; `replace` is the CSS
 * default).
 */
export function animationComposition(
    composition: CompositeOperator,
): string | undefined {
    return composition === "replace"
        ? undefined
        : `animation-composition: ${composition};`;
}

/**
 * L.W1 S2 — serialize the `@property` registry BACK to its `@property` blocks.
 * `CSSKeyframesAnimation.fromString` parses `@property --foo { … }` rules into
 * `animation.propertyRegistry` (`Map<string, PropertyDescriptor>`) and registers
 * them with the UA, but the backward serialize path dropped them — a compiled
 * artifact lost its custom-property TYPING block on re-ship (`--foo` falls back
 * to the `<universal>` type, breaking `@property`-typed transitions). Emit each
 * registry entry via value.js's `serializeStylesheetItem` (the published inverse
 * of the `@property` parser) — NOT a bespoke re-derivation. Returns the joined
 * blocks (one per entry) or `""` when the registry is empty. A plain `Animation`
 * (no registry) yields `""` — the field lives on `CSSKeyframesAnimation` only.
 */
export function propertyRegistryToString<V extends Vars>(
    animation: KeyframesAnimation<V>,
): string {
    const registry = (
        animation as KeyframesAnimation<V> & {
            propertyRegistry?: ReadonlyMap<string, PropertyDescriptor>;
        }
    ).propertyRegistry;
    if (registry == null || registry.size === 0) return "";
    const blocks: string[] = [];
    for (const [name, descriptor] of registry) {
        blocks.push(
            serializeStylesheetItem({ kind: "property", name, descriptor }),
        );
    }
    return blocks.join("\n");
}
