import { serializeCssValue } from "../css-text";
import type { KeyframeSelector } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { camelCaseToHyphen } from "../../../internal/helpers";
import type { KeyframesAnimation } from "../../../engine";
import type { Vars } from "../../../constants";
import { serializeEasing } from "../easing-serialize";
// T.F22 — the OPTION/SHORTHAND serialization concern (the `.class { animation-* }`
// longhand block, the `animation` shorthand, the `animation-composition` longhand,
// the `@property` re-serialize) is carved into the colocated `./options`
// sibling on the body-vs-options cohesion seam. `CSSKeyframesToString` reaches
// the two it composes from there.
import {
    animationOptionsToString,
    propertyRegistryToString,
} from "./options";
import type { ParsedVarMap } from "../../value";


const selectorText = (selector: KeyframeSelector): string =>
    selector.kind === "percent"
        ? `${selector.value * 100}%`
        : `${selector.name}${selector.offset === undefined
            ? ""
            : ` ${selector.offset * 100}%`}`;

/**
 * ONE declaration of one declared stop: the property name the body emits, the
 * serialized text it emits for it, and — for a row that came from the parsed
 * var map — the DECLARED `CssValue` it was serialized FROM.
 *
 * The third field is the point (X.KF.W2 · G-W2-3). `view-transition.ts` used to
 * take {@link declaredKeyframeBodyFor}'s rendered body and run
 * `/([\w-]+)\s*:\s*([^;]+);/g` back over it to recover these pairs — kf
 * re-parsing its own emission with a regex, one layer inside the library. The
 * emitter already HAS the parsed value; it is handed over instead of being
 * re-derived from text. `declared` is absent on the two SYNTHESIZED rows (the
 * per-stop easing and composition), which kf writes from a resolved `Easing`
 * and an enum — there is no author value behind them to hand over.
 */
export interface DeclaredDeclaration {
    /** The emitted CSS property name (`camelCaseToHyphen` of the declared key). */
    readonly prop: string;
    /** Exactly the text the body emits for this declaration. */
    readonly value: string;
    /** The declared value this row serialized from; absent on synthesized rows. */
    readonly declared?: CssValue;
}

/**
 * THE declared-stop projection (X.KF.W2 · G-W2-3) — stop `i`'s declarations as
 * STRUCTURE, from the same `animation.parsedVars[i]` + `templateFrames[i]`
 * authority {@link declaredKeyframeBody} renders. The body is now a RENDERING of
 * this list rather than a second derivation of it, so a consumer that needs the
 * declarations gets them in structure and never has to read them back out of
 * text (the serialize→regex-reparse class this wave extirpates).
 */
export function declaredDeclarationsFor<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): DeclaredDeclaration[] {
    const declared: ParsedVarMap = animation.parsedVars[i] ?? {};
    const templateFrame = animation.templateFrames[i]!;

    const decls: DeclaredDeclaration[] = Object.entries(declared).map(
        ([propName, value]) => ({
            prop: camelCaseToHyphen(propName),
            value: serializeCssValue(value),
            declared: value,
        }),
    );

    // F.W7 — a per-stop easing that differs from the animation default rides the
    // body (CSS Animations L1: `animation-timing-function` at a stop applies to
    // the interval STARTING there); a uniform easing stays on the `.class` block
    // so the round-trip is byte-identical.
    const frameEasing = templateFrame.timingFunction
        ? serializeEasing(templateFrame.timingFunction)
        : defaultEasing;
    if (frameEasing !== defaultEasing) {
        decls.push({
            prop: "animation-timing-function",
            value: frameEasing,
        });
    }

    // L.W1 S3 — the per-stop `animation-composition` round-trip, symmetric with
    // the per-stop easing emit above. value.js lifts the author's per-keyframe
    // `animation-composition` onto `rule.composition`; the adapter captures it on
    // `templateFrame.composition`; emit it back for any stop whose operator is
    // non-`replace` (the CSS default — omitting it is correct for `replace`), so
    // the declared layering survives parse → serialize → re-parse instead of
    // silently collapsing to `replace`.
    const composition = templateFrame.composition;
    if (composition != null && composition !== "replace") {
        decls.push({ prop: "animation-composition", value: composition });
    }

    return decls;
}

const scaleValue = (value: CssValue, weight: number): CssValue | undefined => {
    if (value.kind === "scalar") {
        if (value.payload.type !== "number") return undefined;
        return {
            kind: "scalar",
            payload: { ...value.payload, value: value.payload.value * weight },
        };
    }
    if (value.kind === "call") {
        const args = value.args.map((arg) => scaleValue(arg, weight));
        if (args.some((arg) => arg === undefined)) return undefined;
        return { kind: "call", name: value.name, args: args as CssValue[] };
    }
    const items = value.items.map((item) => scaleValue(item, weight));
    if (items.some((item) => item === undefined)) return undefined;
    return {
        kind: "list",
        separator: value.separator,
        items: items as CssValue[],
    };
};

/**
 * THE one declared-template projection (J.W1 S1 — ENG-1). Renders stop `i`'s
 * keyframe body (`{ … }`) from the DECLARED `animation.parsedVars[i]` — the
 * parsed-but-unresolved var map built 1:1 with `templateFrames` in `parse()`
 * (I.W0 S2). A `var()`/`calc()`/`matrix3d()` is already valid CSS and
 * round-trips VERBATIM through `unflattenObjectToString`, never DOM-resolved
 * to a number — a serializer must not need a live, fully-styled DOM to emit
 * CSS text, and the AUTHORED CSS is exactly what re-parses cleanly (so the
 * empty-var read-back parse throw — B1/B5 — is unreachable from here).
 *
 * BOTH serialize surfaces project from THIS function: the aggregate
 * `CSSKeyframesToString` (the whole-block readout) and the per-card
 * `CSSKeyframesToStrings` (the editor's per-stop pane). The pre-transposition
 * sibling that read `frame.flatVars` — the LIVE interpolation buffers,
 * DOM-resolved for computed units and mutated in place by every
 * `interpFrames` pass — is DELETED: ONE serialization authority.
 *
 * X.KF.W2 (G-W2-3) — the body is now a RENDERING of
 * {@link declaredDeclarationsFor}, which holds the declaration list itself (the
 * per-stop easing and composition rows included). One authority, two shapes: a
 * consumer that wants the declarations asks for the list; only this function
 * turns them into text.
 */
function declaredKeyframeBody<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): string {
    const css = declaredDeclarationsFor(animation, i, defaultEasing)
        .map(({ prop, value }) => `  ${prop}: ${value};`)
        .join("\n");

    return `{\n${css}\n}`;
}

/**
 * Per-stop card serializer for the editor pane — ONE formatted keyframe
 * string per DECLARED template stop, index-aligned with
 * `animation.templateFrames` (the pairing the card list renders by).
 * Unified onto the declared-template authority (J.W1 S1): each card is
 * {@link declaredKeyframeBody} — the AUTHORED values. The former path mapped
 * `animation.frames` (the interp PAIRS — N−1 segments for N stops, so the
 * last card simply did not exist) and read `frame.flatVars` (DOM-resolved,
 * interp-mutated) — both defects die with the unification.
 */
export const CSSKeyframesToStrings = async <V extends Vars>(
    animation: KeyframesAnimation<V>,
) => {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    return animation.templateFrames.map((templateFrame, i) =>
        `${selectorText(templateFrame.start)}\n${declaredKeyframeBody(animation, i, defaultEasing)}\n`,
    );
};

/**
 * The editor card's presentation trim: given ONE per-stop string from
 * {@link CSSKeyframesToStrings} (`"0%\n{\n  opacity: 0;\n}\n"`), return the
 * declarations alone, un-indented — the `<pre>` the card renders.
 *
 * X.KF.W2 (G-W2-3) — RE-IMPLEMENTED, not deleted. The symbol is published on
 * four barrels (`emit/format/index.ts`, `emit/index.ts`, `compile/index.ts`,
 * `public.ts`), declared on the lazy engine surface (`load-engine.ts`), and held
 * live by the demo (`KeyframeCardList.vue` binds this function by reference), so
 * the export, the signature and every one of those sites stand. What died is the
 * BODY: four anonymous regexes (`/^[^{]*{/`, `/^  /gm`, `/}\s*$/`, `/^  /`) that
 * re-read kf's own emission as if it were unknown text.
 *
 * This stays a pure string trim and adds NO grammar edge — deliberately. It is
 * FORMATTING, not parsing: the card's own comment declares it "a value.js-free
 * pure-string trim" and routing a presentation helper through the CSS grammar
 * would falsify that at a call site this wave does not own. The cut points are
 * therefore named as positions and the indent is stripped per line, which is
 * what the regexes meant; measured byte-identical to the old body across the
 * card shapes and the degenerate ones (no brace, empty, trailing text, an inner
 * `{` inside a `url()`).
 */
export function formatCSSKeyframeString(keyframe: string) {
    // Everything after the stop's first `{` — the selector line goes.
    const open = keyframe.indexOf("{");
    const afterOpen = open === -1 ? keyframe : keyframe.slice(open + 1);

    // ...up to the closing `}`, and only when nothing but whitespace follows it
    // (the old `/}\s*$/` anchored at the end; a trailing tail keeps its brace).
    const close = afterOpen.lastIndexOf("}");
    const body =
        close !== -1 && afterOpen.slice(close + 1).trim() === ""
            ? afterOpen.slice(0, close)
            : afterOpen;

    // One level of the body's two-space indent, per line.
    return body
        .split("\n")
        .map((line) => (line.startsWith("  ") ? line.slice(2) : line))
        .join("\n")
        .trim();
}

/**
 * K.W10 CC-1 — the per-stop declared-body projection EXPOSED to the compiler
 * (`compile.ts`). `compileToCSS` walks an orchestration graph and emits one
 * `@keyframes` per child; each stop body is THIS function — the SAME
 * declared-template authority `CSSKeyframesToString` projects from
 * (`parsedVars[i]` via `unflattenObjectToString`), so a child compiled by the
 * group walker is byte-identical to the single-animation serializer's body. The
 * `bodyOverride` arg lets CC-2's oklab densify substitute a DENSER stop set for
 * a color leg WITHOUT re-deriving the projection — the densified `{ … }` body is
 * threaded in, every other key still rides the verbatim declared projection.
 *
 * S.B3 S7 (a18 F3 REVERSED — the load-bearing substrate, NOT dead). a18 F3
 * called this a "likely-dead" export; P2-2 (F1/F5) overturns it — it is the
 * declared-projection AUTHORITY the EN-b mixed-track merge is a sibling of
 * ({@link declaredDeclsExcluding} projects the non-densified declarations from
 * the SAME `parsedVars[i]` source) AND the substrate S.F3/EN-c projects the entry
 * endpoints from. Retained by construction (T6: only genuinely dead surface is
 * excised).
 */
export function declaredKeyframeBodyFor<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): string {
    return declaredKeyframeBody(animation, i, defaultEasing);
}

/**
 * K.W10 CC-1 — the `@keyframes <name> { … }` block builder, factored out of
 * {@link CSSKeyframesToString} so the multi-animation compiler (`compile.ts`)
 * emits one block per child from the SAME declared-template authority. Returns
 * the deterministic block assembled by Keyframes' own serializer;
 * `bodyByStop` (CC-2 densify) substitutes a per-stop body where provided, else
 * the verbatim declared projection rides. This is the parser run BACKWARD: the
 * block re-parses to the SAME template it serialized from.
 */
export function keyframesBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    bodyByStop?: ReadonlyMap<number, string>,
): string {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    // Coalesce identical stop bodies onto one selector list (`0%, 50% { … }`) —
    // the same de-dup `CSSKeyframesToString` does. A densified stop is unique
    // (it carries its own body), so it never coalesces away.
    const keyframesMap = new Map<string, string[]>();
    animation.templateFrames.forEach((templateFrame, i) => {
        const body =
            bodyByStop?.get(i) ??
            declaredKeyframeBody(animation, i, defaultEasing);
        const existing = keyframesMap.get(body);
        const selector = selectorText(templateFrame.start);
        if (existing) existing.push(selector);
        else keyframesMap.set(body, [selector]);
    });

    let stops = "";
    for (const [body, percents] of keyframesMap) {
        stops += `  ${percents.join(", ")} ${body.replace(/\n/g, "\n  ")}\n`;
    }

    return `@keyframes ${name} {\n${stops}}`;
}


/**
 * CC-5 (L.W2 S3) — the STATIC-weight pre-multiply result: a ready `@keyframes`
 * block whose numeric keyframe leaves have been scaled by the constant blend
 * weight (so an `accumulate` layer reproduces the weightBlend blend in exact CSS), OR
 * a refusal naming the non-numeric leaf that cannot be scaled.
 */
type PremultiplyResult =
    | { block: string }
    | { refused: true; key: string };

/**
 * CC-5 (L.W2 S3) — pre-multiply a child's numeric keyframe leaves by a STATIC
 * blend `weight` and project the scaled `@keyframes` block. A constant-weight
 * `weightBlend` layer is the simple pre-compositing case: the author chose a fixed
 * scalar blend, so the output keyframe values can be scaled by `weight` at compile
 * time and the layer emitted as `animation-composition: accumulate` — exact CSS,
 * no spring, no JS runtime (`compile.ts` walkGroup partition).
 *
 * READ-ONLY over the animation: each stop's declared `CssValue`s are CLONED
 * (`CssValue.clone()`), and only the CLONES' numeric leaves are scaled —
 * `animation.parsedVars` is NEVER mutated (the compiler is read-only over the
 * animation object). The scaled clones flow through the SAME
 * `unflattenObjectToString` projection {@link declaredKeyframeBody} uses, so a
 * `translateX(120px)` at `weight: 0.5` round-trips as `translateX(60px)`.
 *
 * Only NUMERIC leaves scale. A non-numeric leaf (a `color`, a bare string token —
 * `unit === "color"` or a non-`number` `value`) has no scalar pre-multiply, so a
 * static-weight animation carrying one REFUSES (`{ refused, key }`) — the caller
 * records it as a `weight-blend` refusal (the JS playback is the faithful path).
 */
export function premultipliedKeyframesBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    weight: number,
): PremultiplyResult {
    const defaultEasing = serializeEasing(animation.options.timingFunction);

    const keyframesMap = new Map<string, string[]>();
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const templateFrame = animation.templateFrames[i]!;
        const declared: ParsedVarMap = animation.parsedVars[i] ?? {};

        const scaled: ParsedVarMap = {};
        for (const [key, value] of Object.entries(declared)) {
            const next = scaleValue(value, weight);
            if (next === undefined) return { refused: true, key };
            scaled[key] = next;
        }

        const decls = Object.entries(scaled).map(
            ([propName, value]) =>
                `  ${camelCaseToHyphen(propName)}: ${serializeCssValue(value)};`,
        );
        const frameEasing = templateFrame.timingFunction
            ? serializeEasing(templateFrame.timingFunction)
            : defaultEasing;
        if (frameEasing !== defaultEasing) {
            decls.push(`  animation-timing-function: ${frameEasing};`);
        }
        const composition = templateFrame.composition;
        if (composition != null && composition !== "replace") {
            decls.push(`  animation-composition: ${composition};`);
        }
        const body = `{\n${decls.join("\n")}\n}`;

        const existing = keyframesMap.get(body);
        const selector = selectorText(templateFrame.start);
        if (existing) existing.push(selector);
        else keyframesMap.set(body, [selector]);
    }

    let stops = "";
    for (const [body, percents] of keyframesMap) {
        stops += `  ${percents.join(", ")} ${body.replace(/\n/g, "\n  ")}\n`;
    }
    return { block: `@keyframes ${name} {\n${stops}}` };
}

export async function CSSKeyframesToString<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string = "animation",
) {
    const options = animation.options;

    // Build keyframes from template frames (the declared stops: 0%, 50%, 100%, etc.)
    // rather than interpolation frames (which are transition pairs, not stops).
    // Sample the animation at each stop's percentage to get the resolved CSS values.
    const keyframesMap = new Map<string, string[]>();

    // F.W7 — the per-keyframe easing round-trip. `fromString` READS each stop's
    // `animation-timing-function` (CSS Animations L1: it applies to the interval
    // STARTING at that stop) and stores it on `templateFrame.timingFunction`;
    // the serializer must emit it back or the per-stop curve is silently lost on
    // re-parse. Emit it ONLY when it differs from the top-level default, so a
    // uniform-easing animation stays byte-identical (the default already rides
    // the `.class` block).
    const defaultEasing = serializeEasing(options.timingFunction);

    animation.templateFrames.forEach((templateFrame, i) => {
        const percent = selectorText(templateFrame.start);
        // I.W0 S2 / J.W1 S1 — serialize from the DECLARED template values,
        // NOT a DOM-resolving interpolation sample: the ONE projection both
        // serialize surfaces share (see `declaredKeyframeBody`).
        const body = declaredKeyframeBody(animation, i, defaultEasing);

        if (!keyframesMap.has(body)) {
            keyframesMap.set(body, [percent]);
        } else {
            keyframesMap.get(body)!.push(percent);
        }
    });

    let keyframesString = "";
    for (const [css, percents] of keyframesMap) {
        keyframesString += `  ${percents.join(", ")} ${css.replace(/\n/g, "\n  ")}\n`;
    }

    const animationOptionsString = animationOptionsToString(options, name);

    // L.W1 S2 — prepend the `@property` typing blocks (if any) so a parsed
    // `@property --foo { … }` survives the backward serialize. Layout:
    // `@property` blocks + blank line + the `.class` options + `@keyframes`.
    const propertyBlocks = propertyRegistryToString(animation);
    const propertyPrefix = propertyBlocks ? `${propertyBlocks}\n\n` : "";

    const keyframes = `${propertyPrefix}${animationOptionsString}\n@keyframes ${name} {\n${keyframesString}}`;

    // X.KF.W2 (G-W2-3) — the CANDIDATE 7th Tier-C site, ruled DELETE-OR-DECLARE
    // and DECLARED, with its measurement: instrumented over both vitest projects
    // it fires ZERO times, so no live path produces the `({` / `})` artifact it
    // erases. That is absence of coverage, not proof of death, and the repo's own
    // rule is that only GENUINELY dead surface is excised — the artifact's only
    // possible producer is the value serializer this block composes
    // (`serializeCssValue` / `unflattenObjectToString`), which is the Tier-D
    // collapse subject owned by KF.W8 (MISS-β2). It is deleted THERE, with the
    // producer census in hand, and not here on a zero count.
    return `${keyframes.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}")}\n`;
}
