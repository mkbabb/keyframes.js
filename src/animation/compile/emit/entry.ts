/**
 * compile/emit/entry.ts — S.F3 EN-c THE ENTRY/EXIT EMITTER (C-22 revised; P2-2).
 *
 * `compileToEntry` compiles a selector-keyed entry/exit spec to zero-runtime
 * `@starting-style` + `transition-behavior: allow-discrete` CSS — the modern
 * two-endpoint entrance/exit grammar the platform shipped (Chromium 117+/Safari
 * 26). It is `compileToCSS`'s SIBLING, but a DECLARED-ENDPOINT PROJECTION over the
 * `format.ts` substrate (first/last stop bodies via `declaredKeyframeBodyFor`'s
 * source; easing via the EN-a twin-fixed `serializeEasing`) — NOT a post-transform
 * over the `compileToCSS` artifact (refuted live by P2-2 attempt A: the compiled
 * `@keyframes` came out color-only + 16-stop; a transition is a TWO-endpoint
 * grammar, so it shares the substrate, not the artifact).
 *
 * ── THE THREE-RULE GRAMMAR (P2-2 F2 — the whole output shape) ─────────────────
 *   1. base/closed rule  `S { <exit last frame> display:none  transition:<EXIT>  }`
 *   2. open rule         `S O { <enter last frame> display:<d> transition:<ENTRY> }`
 *   3. `@starting-style { S O { <enter FIRST frame> } }`
 *   Transitions read the AFTER-change style's `transition-*`, so asymmetric
 *   entry/exit duration+easing ride the two lists (350ms spring in / 250ms bezier
 *   out). `display <dur> allow-discrete` + `overlay <dur> allow-discrete` ride BOTH
 *   lists (they are EXIT-load-bearing; `overlay` emits unconditionally — it
 *   materializes only for top-layer elements, inert-but-harmless elsewhere).
 *   `linear()` springs ride verbatim; color endpoints canonicalize to `oklab()`
 *   (the `perceptual-oklab` refusal INVERTS — native Oklab, NO densify, ZERO stops).
 *
 * ── THE REFUSAL TAXONOMY (P2-2.3) — 3 inherited + 6 entry-specific ────────────
 *   inherited:  custom-renderer · weight-blend · computed-unit-drift
 *   entry:      entry-multi-keyframe · entry-iteration · entry-composition ·
 *               entry-scroll-grammar · entry-color-space · entry-easing-twin
 *   (`reverse` is an endpoint-SWAP branch, NOT a refusal; `fillMode` is ABSORBED —
 *   the base + open rules ARE the two rest states; native Oklab is a FEATURE, only
 *   NON-default color spaces (`oklch`/`hueMethod`) refuse.)
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). ──────────────────────────────────────
 * Reached ONLY via `loadAnimationEngine()` + the `./engine` static mirror.
 */
import { reverseCSSTime, serializeCssValue } from "./css-text";
import { convertColor } from "@mkbabb/value.js/color";
import type { CssValue } from "@mkbabb/value.js/value";
import { camelCaseToHyphen } from "../../internal/helpers";
import type { KeyframesAnimation } from "../../engine";
import type { Vars } from "../../constants";
// The emit-substrate helpers, imported from the real sibling FILES inside emit/
// (never the emit/ barrel — the barrel re-exports THIS file, so a barrel import
// would cycle; the same file-not-barrel idiom the easing carve proved).
import { serializeEasing } from "./easing-serialize";

// ── The spec + options (P2-2 API contract) ───────────────────────────────────

/** The per-selector entry/exit role. Each animation is 2-stop (a transition endpoint pair). */
export interface EntryRoleSpec<V extends Vars = Vars> {
    /** The ENTER animation: first frame → `@starting-style`, last frame → the open rule. */
    enter?: KeyframesAnimation<V>;
    /** The EXIT animation: last frame → the closed rule. Defaults to `enter` REVERSED. */
    exit?: KeyframesAnimation<V>;
}

/** Options for {@link compileToEntry}. */
export interface EntryCompileOptions {
    /** The open-state selector suffix, concatenated onto the base selector. Default `".open"`. */
    openSelector?:
        | ".open"
        | "[data-open]"
        | ":popover-open"
        | "[open]"
        | (string & {});
    /** The open `display` value (the base rule is always `display: none`). Default `"block"`. */
    display?: string;
    /**
     * Emit `overlay <dur> allow-discrete` on both lists (default `true`). Emitted
     * UNCONDITIONALLY — it materializes only for top-layer elements (popover/
     * dialog), inert-but-harmless elsewhere, so a caller rarely turns it off.
     */
    overlay?: boolean;
}

/** The refusal taxonomy — 3 inherited + 6 entry-specific (P2-2.3). */
export type EntryRefusalReason =
    // 3 inherited from the CC-3 trust surface (perceptual-oklab INVERTS → a feature).
    | "custom-renderer"
    | "weight-blend"
    | "computed-unit-drift"
    // 6 entry-specific.
    | "entry-multi-keyframe"
    | "entry-iteration"
    | "entry-composition"
    | "entry-scroll-grammar"
    | "entry-color-space"
    | "entry-easing-twin";

/** A single entry refusal — the selector + a typed reason + a human message. */
export interface EntryRefusal {
    /** The refused selector (spec key). */
    name: string;
    reason: EntryRefusalReason;
    message: string;
}

/** The entry compile result — the artifact + the refusal report. */
export interface CompiledEntryCSS {
    /** The zero-runtime CSS: base rule + open rule + `@starting-style` per selector. */
    css: string;
    /** True iff EVERY selector compiled faithfully. */
    eligible: boolean;
    /** One refusal per selector that could not compile as a two-endpoint transition. */
    refusals: EntryRefusal[];
}

// ── Endpoint projection (declared frames, color-canonicalized) ────────────────

interface Decl {
    prop: string;
    value: string;
}

const hasColor = (value: CssValue): boolean => {
    if (value.kind === "scalar") return value.payload.type === "color";
    const children = value.kind === "call" ? value.args : value.items;
    return children.some(hasColor);
};

const canonicalizeColors = (value: CssValue): CssValue => {
    if (value.kind === "scalar") {
        if (value.payload.type !== "color") return value;
        const converted = convertColor(value.payload.value, "oklab");
        if (!converted.ok) {
            throw new TypeError(
                `Value 4 color conversion failed: ${converted.error.code}.`,
            );
        }
        return {
            kind: "scalar",
            payload: { type: "color", value: converted.value },
        };
    }
    if (value.kind === "call") {
        return {
            kind: "call",
            name: value.name,
            args: value.args.map(canonicalizeColors),
        };
    }
    return {
        kind: "list",
        separator: value.separator,
        items: value.items.map(canonicalizeColors),
    };
};

/**
 * The declared CSS declarations for template stop `i` — the DECLARED-ENDPOINT
 * projection (the same `parsedVars[i]` source `declaredKeyframeBodyFor` reads),
 * with color leaves canonicalized to `oklab()` (the perceptual-oklab INVERSION).
 * `var()`/`calc()`/`vh` ride VERBATIM (transitions resolve them natively).
 */
function frameDecls<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
): Decl[] {
    const declared = animation.parsedVars[i] ?? {};
    const decls: Decl[] = [];
    for (const [propCamel, value] of Object.entries(declared)) {
        const prop = camelCaseToHyphen(propCamel);
        decls.push({
            prop,
            value: serializeCssValue(canonicalizeColors(value)),
        });
    }
    return decls;
}

/** The [firstIndex, lastIndex] endpoint pair, honoring a `reverse` direction (endpoint swap). */
function endpointIndices<V extends Vars>(
    animation: KeyframesAnimation<V>,
): [number, number] {
    const n = animation.templateFrames.length;
    return animation.options.direction === "reverse" ? [n - 1, 0] : [0, n - 1];
}

// ── Refusal detection (per role animation) ────────────────────────────────────

/** True iff any declared stop carries a color leaf (the entry-color-space scope). */
function hasColorTrack<V extends Vars>(
    animation: KeyframesAnimation<V>,
): boolean {
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const value of Object.values(declared))
            if (hasColor(value)) return true;
    }
    return false;
}

/** The first flat prop key whose declared `CssValue` list is empty. */
function emptyDeclared<V extends Vars>(
    animation: KeyframesAnimation<V>,
): string | undefined {
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const [key, value] of Object.entries(declared)) {
            if (value.kind === "list" && value.items.length === 0) return key;
        }
    }
    return undefined;
}

/** Detect a role's refusal reason (or `undefined` when it compiles as a transition). */
function detectRefusal<V extends Vars>(
    animation: KeyframesAnimation<V>,
): { reason: EntryRefusalReason; detail: string } | undefined {
    const opts = animation.options;

    // entry-multi-keyframe — >2 declared stops (a transition is a two-endpoint grammar).
    if (animation.templateFrames.length > 2) {
        return {
            reason: "entry-multi-keyframe",
            detail: `${animation.templateFrames.length} declared stops — a transition is a two-endpoint grammar; intermediate stops have no CSS twin`,
        };
    }

    // entry-iteration — iterationCount ≠ 1 or an alternate direction (reverse is a swap, absorbed).
    if (
        opts.iterationCount !== 1 ||
        opts.direction === "alternate" ||
        opts.direction === "alternate-reverse"
    ) {
        return {
            reason: "entry-iteration",
            detail: `iterationCount=${opts.iterationCount}, direction=${opts.direction} — transitions run once, forward (reverse is an endpoint swap, not a refusal)`,
        };
    }

    // entry-composition — add/accumulate (no transition-composition twin; never flatten).
    const composite = opts.composite;
    const perStop = animation.templateFrames.some(
        (f) => f.composition != null && f.composition !== "replace",
    );
    if ((composite != null && composite !== "replace") || perStop) {
        return {
            reason: "entry-composition",
            detail: "add/accumulate composition has no transition twin (transitions always replace) — never silently flattened",
        };
    }

    // entry-scroll-grammar — a state-change transition has no animation-timeline twin.
    const scrollOptions = (
        animation as KeyframesAnimation<V> & { scrollOptions?: unknown }
    ).scrollOptions;
    if (scrollOptions != null) {
        return {
            reason: "entry-scroll-grammar",
            detail: "scroll grammar has no transition twin — the JS ScrollScene driver is the only faithful path",
        };
    }

    // entry-color-space — oklch or a non-default hueMethod ON A COLOR TRACK (native
    // oklab is the FEATURE; a space setting with no color leaf is inert, not a refusal).
    if (
        (opts.colorSpace === "oklch" || opts.hueMethod != null) &&
        hasColorTrack(animation)
    ) {
        return {
            reason: "entry-color-space",
            detail: `colorSpace=${opts.colorSpace}${opts.hueMethod ? `, hueMethod=${opts.hueMethod}` : ""} — transitions expose no interpolation-space control; native Oklab is the default feature (only non-default spaces refuse)`,
        };
    }

    // computed-unit-drift — an EMPTY declared value (var()/calc()/vh otherwise ride verbatim).
    const drift = emptyDeclared(animation);
    if (drift != null) {
        return {
            reason: "computed-unit-drift",
            detail: `"${drift}" has an empty declared value — it cannot be re-emitted as a faithful transition endpoint`,
        };
    }

    // custom-renderer — a transform closure that is not the default DOM-style renderer.
    for (const frame of animation.frames) {
        if (!animation.usesDefaultRenderer(frame.transform)) {
            return {
                reason: "custom-renderer",
                detail: "a custom transform closure cannot be a CSS transition endpoint",
            };
        }
    }

    // entry-easing-twin — no faithful CSS twin (serializeEasing throws for a twinless closure;
    // the EN-a linear() densify is the universal PRE-refusal remedy applied first).
    try {
        serializeEasing(opts.timingFunction);
    } catch {
        return {
            reason: "entry-easing-twin",
            detail: "the easing has no faithful CSS timing-function twin (attach an Easing.css twin or use a registry name / cubic-bezier() / linear())",
        };
    }

    return undefined;
}

// ── Transition-list + rule assembly ───────────────────────────────────────────

const REFUSAL_MESSAGE: Record<EntryRefusalReason, string> = {
    "custom-renderer":
        "custom renderer — the JS playback is the only faithful path",
    "weight-blend": "layer weight has no transition twin",
    "computed-unit-drift":
        "computed-unit drift — the endpoint cannot be re-emitted faithfully",
    "entry-multi-keyframe":
        "more than two declared stops — a transition is a two-endpoint grammar",
    "entry-iteration":
        "iteration/alternate-direction — transitions run once, forward",
    "entry-composition": "add/accumulate composition has no transition twin",
    "entry-scroll-grammar": "scroll grammar has no transition twin",
    "entry-color-space":
        "a non-default color space (oklch/hueMethod) — transitions expose no space control",
    "entry-easing-twin": "the easing has no faithful CSS timing-function twin",
};

/** The declared props (hyphenated, top-level) that a role transitions. */
function transitionProps(first: Decl[], last: Decl[]): string[] {
    const props = new Set<string>();
    for (const d of first) props.add(d.prop);
    for (const d of last) props.add(d.prop);
    return [...props];
}

/**
 * Build the transition LIST for one direction: each changing prop `<prop> <dur>
 * <easing>`, then `display <dur> allow-discrete` + (when `overlay`) `overlay <dur>
 * allow-discrete` — both allow-discrete entries ride BOTH lists (EXIT-load-bearing).
 */
function transitionList(
    props: string[],
    dur: string,
    easing: string,
    overlay: boolean,
): string {
    const entries = props
        .filter((p) => p !== "display" && p !== "overlay")
        .map((p) => `${p} ${dur} ${easing}`);
    entries.push(`display ${dur} allow-discrete`);
    if (overlay) entries.push(`overlay ${dur} allow-discrete`);
    return entries.join(", ");
}

/** Render a declaration list as an indented `{ … }` rule body. */
const renderDecls = (decls: Decl[], extra: string[]): string =>
    [...decls.map((d) => `  ${d.prop}: ${d.value};`), ...extra].join("\n");

/**
 * THE ENTRY/EXIT EMITTER (C-22 revised, P2-2) — compile a selector-keyed
 * entry/exit spec to zero-runtime `@starting-style` + `allow-discrete` CSS. Emits
 * per selector: the base/closed rule (exit endpoint + `display:none` + the exit
 * transition list), the open rule (enter endpoint + `display` + the entry list),
 * and the `@starting-style` block (enter's FIRST frame). Asymmetric entry/exit
 * timing rides the two lists; `linear()` springs ride verbatim; color endpoints
 * canonicalize to `oklab()`. REFUSES with a NAMED reason (3 inherited + 6
 * entry-specific) what cannot compile as a two-endpoint transition.
 *
 * @returns `{ css, eligible, refusals }`.
 */
export async function compileToEntry<V extends Vars>(
    spec: Record<string, EntryRoleSpec<V>>,
    opts: EntryCompileOptions = {},
): Promise<CompiledEntryCSS> {
    const openSelector = opts.openSelector ?? ".open";
    const display = opts.display ?? "block";
    const overlay = opts.overlay ?? true;

    const refusals: EntryRefusal[] = [];
    const blocks: string[] = [];

    for (const [selector, role] of Object.entries(spec)) {
        const enter = role.enter;
        if (enter == null) continue;

        // Refuse the whole selector when EITHER role animation cannot compile.
        const roleAnims: KeyframesAnimation<V>[] = role.exit
            ? [enter, role.exit]
            : [enter];
        let refused = false;
        for (const anim of roleAnims) {
            const r = detectRefusal(anim);
            if (r) {
                refusals.push({
                    name: selector,
                    reason: r.reason,
                    message: `${REFUSAL_MESSAGE[r.reason]} — ${r.detail}`,
                });
                refused = true;
                break;
            }
        }
        if (refused) continue;

        const [enterFirst, enterLast] = endpointIndices(enter);
        const enterFirstDecls = frameDecls(enter, enterFirst);
        const enterLastDecls = frameDecls(enter, enterLast);
        const enterProps = transitionProps(enterFirstDecls, enterLastDecls);
        const enterDur = reverseCSSTime(enter.options.duration);
        const enterEasing = serializeEasing(enter.options.timingFunction);

        // The exit defaults to enter-REVERSED (its last frame = enter's first frame).
        let exitLastDecls: Decl[];
        let exitProps: string[];
        let exitDur: string;
        let exitEasing: string;
        if (role.exit) {
            const [, exLast] = endpointIndices(role.exit);
            const exFirstIdx = endpointIndices(role.exit)[0];
            exitLastDecls = frameDecls(role.exit, exLast);
            exitProps = transitionProps(
                frameDecls(role.exit, exFirstIdx),
                exitLastDecls,
            );
            exitDur = reverseCSSTime(role.exit.options.duration);
            exitEasing = serializeEasing(role.exit.options.timingFunction);
        } else {
            exitLastDecls = enterFirstDecls;
            exitProps = enterProps;
            exitDur = enterDur;
            exitEasing = enterEasing;
        }

        const openSel = `${selector}${openSelector}`;

        // 1. base/closed rule — exit endpoint + display:none + the EXIT list.
        const baseRule = `${selector} {\n${renderDecls(exitLastDecls, [
            "  display: none;",
            `  transition: ${transitionList(exitProps, exitDur, exitEasing, overlay)};`,
        ])}\n}`;

        // 2. open rule — enter endpoint + display + the ENTRY list.
        const openRule = `${openSel} {\n${renderDecls(enterLastDecls, [
            `  display: ${display};`,
            `  transition: ${transitionList(enterProps, enterDur, enterEasing, overlay)};`,
        ])}\n}`;

        // 3. @starting-style — enter's FIRST frame (the before-change style).
        const startingStyle = `@starting-style {\n  ${openSel} {\n${renderDecls(
            enterFirstDecls,
            [],
        )
            .split("\n")
            .map((l) => `  ${l}`)
            .join("\n")}\n  }\n}`;

        blocks.push(`${baseRule}\n\n${openRule}\n\n${startingStyle}`);
    }

    const eligible = refusals.length === 0;
    if (blocks.length === 0) {
        return { css: "", eligible, refusals };
    }

    const raw = blocks.join("\n\n");
    return { css: `${raw}\n`, eligible, refusals };
}
