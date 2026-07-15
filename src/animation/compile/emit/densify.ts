/**
 * compile/emit/densify — the EN-b percentage-keyed densify MERGE tier
 * (S.B3; carved from format.ts at the S.B3 merge — the mixed-track cure:
 * densified changing-color stops merged WITH the declared non-color
 * projection into ONE @keyframes block).
 */
import { unflattenObjectToString, ValueUnit } from "@mkbabb/value.js/units";
import { camelCaseToHyphen } from "@mkbabb/value.js";
import type { KeyframesAnimation } from "../../engine";
import type { Vars } from "../../constants";
import type { ParsedVarMap } from "../parse-flatten";
import { serializeEasing } from "./easing-serialize";

/**
 * EN-b (S.B3) — a template stop's selector `ValueUnit` → its numeric percent
 * (`50%` → 50). The SAME parse `backward-color.ts`'s `percentOf` uses for the
 * densify endpoints, so the merge keys align byte-for-byte with the densified
 * color stops. `from`/`to`/percentage selectors all carry `<n>%` after parse.
 */
const percentOfStart = (start: ValueUnit): number => {
    const m = /([\d.]+)\s*%/.exec(String(start));
    return m ? parseFloat(m[1]!) : 0;
};

/**
 * EN-b (S.B3) — the DECLARED non-color projection for stop `i`, EXCLUDING the
 * `exclude` keys (the densify's CHANGING color keys). Mirrors
 * {@link declaredKeyframeBody}'s declaration + per-stop easing/composition emit,
 * but drops every excluded key so a mixed track's `opacity`/`transform`/STATIC-
 * color declarations ride the merge at their DECLARED percentages while the
 * changing colors ride the densified `oklab()` stops. A property interpolates
 * only across the stops that DECLARE it, so leaving the intermediate color-only
 * stops without `opacity`/`transform` interpolates them linearly between the
 * declared endpoints exactly as the whole-block swap SHOULD have (P2-2 F5).
 */
function declaredDeclsExcluding<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
    exclude: ReadonlySet<string>,
): string[] {
    const declared: ParsedVarMap = animation.parsedVars[i] ?? {};
    const kept = Object.fromEntries(
        Object.entries(declared).filter(([key]) => !exclude.has(key)),
    );
    const decls = Object.entries(unflattenObjectToString(kept)).map(
        ([propName, v]) => `${camelCaseToHyphen(propName)}: ${v};`,
    );

    const templateFrame = animation.templateFrames[i]!;
    const frameEasing = templateFrame.timingFunction
        ? serializeEasing(templateFrame.timingFunction)
        : defaultEasing;
    if (frameEasing !== defaultEasing) {
        decls.push(`animation-timing-function: ${frameEasing};`);
    }
    const composition = templateFrame.composition;
    if (composition != null && composition !== "replace") {
        decls.push(`animation-composition: ${composition};`);
    }
    return decls;
}

/**
 * EN-b (S.B3, P2-2 F5) — the PERCENTAGE-keyed densify MERGE. `densifyColorBlock`
 * (`backward-color.ts`) returns the raw per-percentage CHANGING-color declarations
 * (`byPct`) + the changing color `keys`; this merges them WITH the declared
 * NON-color projection ({@link declaredDeclsExcluding}) into ONE `@keyframes`
 * block — so a mixed `opacity+transform+background-color` track no longer compiles
 * to a color-ONLY artifact (the whole-block swap `compileChild` did dropped every
 * non-color property silently, ⚠ replay-inequality on the SHIPPED surface).
 *
 * REFINEMENT of the spec's "thread through `keyframesBlock`'s `bodyByStop`":
 * `bodyByStop` is keyed by stop INDEX (iterating `templateFrames`) and structurally
 * cannot hold the densify's INTERMEDIATE percentage stops (16–24 `oklab()` stops
 * between each declared pair). So the merge is PERCENTAGE-keyed — the correct
 * realization of the SAME intent (color stops merged WITH the declared non-color
 * decls). The changing colors ride the densified stops (excluded from the declared
 * projection); every other declared key (`opacity`/`transform`/STATIC colors +
 * per-stop easing/composition) rides its verbatim declared projection at the
 * declared template percentages.
 */
export function densifiedKeyframesBlock<V extends Vars>(
    animation: KeyframesAnimation<V>,
    name: string,
    densify: {
        byPct: ReadonlyMap<number, readonly string[]>;
        keys: readonly string[];
    },
): string {
    const defaultEasing = serializeEasing(animation.options.timingFunction);
    const exclude = new Set(densify.keys);

    const byPct = new Map<number, string[]>();
    const order: number[] = [];
    const ensure = (pct: number): string[] => {
        let decls = byPct.get(pct);
        if (!decls) {
            decls = [];
            byPct.set(pct, decls);
            order.push(pct);
        }
        return decls;
    };

    // 1. the densified CHANGING-color stops (endpoints + intermediate oklab stops).
    for (const [pct, decls] of densify.byPct) ensure(pct).push(...decls);

    // 2. the declared NON-color projection at each template stop's percentage.
    animation.templateFrames.forEach((templateFrame, i) => {
        const lines = declaredDeclsExcluding(
            animation,
            i,
            defaultEasing,
            exclude,
        );
        if (lines.length > 0) {
            ensure(percentOfStart(templateFrame.start)).push(...lines);
        }
    });

    order.sort((a, b) => a - b);
    let stops = "";
    for (const pct of order) {
        stops += `${pct}% {\n  ${byPct.get(pct)!.join("\n  ")}\n}\n`;
    }
    return `@keyframes ${name} {\n${stops}}`;
}
