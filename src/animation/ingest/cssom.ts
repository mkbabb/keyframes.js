/**
 * ingest-cssom.ts — the CSSOM-walk half of the K.W8 ingest (the parser pointed
 * FORWARD at the live web's declared `@keyframes`).
 *
 * Split out of `ingest.ts` at the natural concern seam (the K close
 * decomposition): this module owns the STYLESHEET walk — reading
 * `document.styleSheets`, filtering to `CSSKeyframesRule`, linking the sibling
 * `.class { animation: name … }` style rule, and reconstructing each rule via
 * the EXISTING `resolveKeyframes` pipeline. The sibling `ingest.ts` owns the
 * mid-flight TEMPORAL takeover (`adoptRunning` / the continuity seed), which
 * CONSUMES this module's `resolveLiveKeyframes`. Pure extraction — zero
 * behaviour change; `ingest.ts` re-exports this surface so the barrel +
 * `proof:ingest-replay` import set is unchanged.
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). It statically imports `./engine`
 * (`CSSKeyframesAnimation`) and `./adapter` (`resolveKeyframes`), both of which
 * carry the value.js CSS grammar. It therefore lives on the EXISTING
 * heavy/dynamic surface, reached ONLY via `loadAnimationEngine()` (the barrel
 * places `ingest.ts`'s re-exports behind that accessor). It adds NO new static
 * value.js edge beyond the engine it already needs (inv α; `proof:boundary`).
 *
 * Two moves live here:
 *   • K1 — `fromStyleSheets()` / `fromLiveAnimations()` / `resolveLiveKeyframes()`:
 *           the CSSOM walk. Per-sheet `try/catch`; a cross-origin sheet is a
 *           `CORS_SKIP` diagnostic, never a silent drop.
 *   • S3 — the honesty surface: every refusal is a typed `Diagnostic` row.
 *
 * VJ-9 TRIPWIRE (recorded, NOT a gate). The ingest ships on the SHIPPED value.js
 * `cssText → resolveKeyframes` contract. value.js's VJ-9 FULL partial-input
 * totality (every malformed third-party rule parses totally, never throws) is
 * OPEN. Until it publishes, a rule whose `cssText` derails value.js's parser
 * surfaces as a `PARSE_ERROR` row (the per-rule `try/catch` below), never an
 * uncaught throw — the ingest's robustness WIDENS on VJ-9's publish.
 */

import { CSSKeyframesAnimation } from "../engine";
import type { Diagnostic } from "../compile/adapter";
import type { InputAnimationOptions, Vars } from "../constants";

/**
 * One ingested animation + the diagnostics its reconstruction produced. The
 * `name` is the `@keyframes` identifier (the CSSOM `CSSKeyframesRule.name`); the
 * `animation` is the reconstructed `CSSKeyframesAnimation`, already carrying any
 * sibling-style-rule `animation-*` options. `diagnostics` carries the honesty
 * rows for THIS rule (a malformed body → `PARSE_ERROR`, etc.); the walk-level
 * rows (`CORS_SKIP`) ride {@link IngestResult.diagnostics}.
 */
export interface IngestedAnimation<V extends Vars = Vars> {
    /** The `@keyframes` identifier (CSSOM `CSSKeyframesRule.name`). */
    name: string;
    /** The reconstructed kf animation — replay-equal to the source CSS. */
    animation: CSSKeyframesAnimation<V>;
    /** Per-rule reconstruction diagnostics (empty on a clean ingest). */
    diagnostics: Diagnostic[];
}

/**
 * The result of a CSSOM walk: every `@keyframes` rule reconstructed into a kf
 * animation, plus the WALK-LEVEL diagnostics (the `CORS_SKIP` rows a
 * cross-origin sheet produces — the honesty surface S3). A consumer reads
 * `animations` for the recovered objects and `diagnostics` for the citable
 * reasons the walk could not complete a step faithfully — NEVER a silent drop.
 */
export interface IngestResult<V extends Vars = Vars> {
    /** Every `@keyframes` rule reconstructed, keyed by its CSS name. */
    animations: Map<string, IngestedAnimation<V>>;
    /**
     * Walk-level diagnostics — the `CORS_SKIP` rows (a cross-origin sheet whose
     * `cssRules` throws `SecurityError`) and any other reason the walk could not
     * read a sheet. A typed {@link Diagnostic}[] on the same stable-`code` idiom
     * as `resolveKeyframes`; empty when every sheet was same-origin + parsed.
     */
    diagnostics: Diagnostic[];
}

/** Options shared by the ingest entry points. */
export interface IngestOptions {
    /**
     * Restrict the ingest to a single `@keyframes` name. When set, only the
     * matching rule is reconstructed (the rest are skipped without a
     * diagnostic — a name filter is an intentional narrowing, not a failure).
     */
    animationName?: string;
    /**
     * Animation options applied as the BASE for each reconstructed animation,
     * BELOW any sibling-style-rule `animation-*` declarations the source CSS
     * carries (the source's declared options win — the round-trip preserves the
     * AUTHORED timing). Empty by default.
     */
    options?: Partial<InputAnimationOptions>;
}

/**
 * A row sink mirroring `adapter.ts`'s — a stable `code` + a `message`, the
 * consumed `ParseDiagnostic` field shape widened. Kept module-local (the walk
 * produces walk-level rows; `resolveKeyframes` produces the parse-level rows on
 * its own channel) so there is ONE row shape across the ingest surface.
 */
const pushDiagnostic = (
    sink: Diagnostic[],
    code: Diagnostic["code"],
    message: string,
    extra: Partial<Diagnostic> = {},
): void => {
    sink.push({ code, message, ...extra });
};

/**
 * Is this rule a `@keyframes` rule? `instanceof CSSKeyframesRule` is the
 * first-class test, but a non-DOM / polyfilled CSSOM (jsdom historically lacked
 * the global) needs the structural fallback: a `type === 7` (CSSRule.KEYFRAMES_RULE)
 * rule that carries a `name` + a `cssText`. Both forms are accepted so the walk
 * is not coupled to a single CSSOM implementation (the VJ-9-adjacent robustness
 * edge: the walk tolerates a partial CSSOM the same way the parse tolerates a
 * partial grammar — by structural recognition, never an `instanceof` assertion).
 */
const isKeyframesRule = (rule: CSSRule): rule is CSSKeyframesRule => {
    const KEYFRAMES_RULE = 7; // CSSRule.KEYFRAMES_RULE
    if (
        typeof CSSKeyframesRule !== "undefined" &&
        rule instanceof CSSKeyframesRule
    ) {
        return true;
    }
    const r = rule as Partial<CSSKeyframesRule> & { type?: number };
    return (
        r.type === KEYFRAMES_RULE &&
        typeof r.name === "string" &&
        typeof r.cssText === "string"
    );
};

/**
 * The recursion depth cap for {@link walkSheet}'s descent into nested
 * `CSSGroupingRule` bodies (L.W3 S2). Real-world stylesheet nesting is shallow
 * (`@media` → `@supports` → `@layer` → `@container` ≤ 4 in practice); 32 is a
 * generous adversarial-recursion guard so a pathological/cyclic CSSOM can never
 * blow the stack — the walk stops descending past 32, the rules already read at
 * shallower depths are kept.
 */
const MAX_WALK_DEPTH = 32;

/**
 * Is this rule a `CSSGroupingRule` whose `.cssRules` body must be entered
 * recursively (L.W3 S2)? `@media`/`@supports`/`@layer`/`@container` bodies all
 * expose their own `CSSRuleList`. The test is the SAME structural duck-type
 * idiom as {@link isKeyframesRule} — a rule that carries a `.cssRules` list and
 * is NOT itself a `@keyframes` rule (whose `cssRules` holds keyframe SELECTORS,
 * not nested rules) — so the walk is not coupled to a specific CSSOM
 * implementation via `instanceof CSSGroupingRule`.
 */
const isGroupingRule = (
    rule: CSSRule,
): rule is CSSRule & { cssRules: CSSRuleList } => {
    const r = rule as Partial<{ cssRules: CSSRuleList }>;
    return typeof r.cssRules !== "undefined" && !isKeyframesRule(rule);
};

/**
 * Walk one sheet's `cssRules`, reconstructing each `@keyframes` rule (filtered
 * by `animationName` when set), and linking the FIRST sibling style rule that
 * references it via `animation`/`animation-name` so the reconstructed object
 * carries the `.foo { animation: pulse 2s }` options. The cross-origin
 * `SecurityError` (a `sheet.cssRules` read on a sheet without
 * `Access-Control-Allow-Origin`) is caught by the CALLER's per-sheet `try/catch`
 * (which emits the `CORS_SKIP` row) — this body assumes `cssRules` is readable.
 *
 * RECURSIVE over `CSSGroupingRule` bodies (L.W3 S2): a `@keyframes` declared
 * inside `@media`/`@supports`/`@layer`/`@container` is NOT a top-level entry of
 * the sheet's flat `CSSRuleList` — it lives in the grouping rule's OWN
 * `.cssRules`. After the flat loop, every grouping rule is descended into (the
 * `out` Map accumulates across depths), so a nested `@keyframes` is reconstructed
 * rather than silently absent (the forbidden silent-drop class). The
 * `sibling`-style-rule linkage is per-level: a `.class` and the `@keyframes` it
 * names that share a `@media` block are matched within that block's own list.
 */
const walkSheet = <V extends Vars>(
    rules: CSSRuleList,
    out: Map<string, IngestedAnimation<V>>,
    options: IngestOptions,
    depth: number = 0,
): void => {
    // First pass: collect every style rule's `cssText` so an `@keyframes` rule
    // can find the sibling `.class { animation: name … }` that names it. We feed
    // the matching style-rule text INTO `resolveKeyframes` beside the keyframes
    // text so its `extractAnimationOptions` recovers the shorthand — the SAME
    // pipeline `fromString` uses, never a bespoke options parser (K.W8 §S1 b).
    const styleRuleTexts: string[] = [];
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule == null) continue;
        // A bare style rule (CSSStyleRule, type 1) — capture its text so the
        // `@keyframes` linkage can find an `animation-name` reference.
        const asStyle = rule as Partial<CSSStyleRule> & { type?: number };
        if (asStyle.type === 1 && typeof asStyle.cssText === "string") {
            styleRuleTexts.push(asStyle.cssText);
        }
    }

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule == null || !isKeyframesRule(rule)) continue;

        const name = rule.name;
        if (options.animationName != null && name !== options.animationName) {
            continue;
        }

        // The sibling style rule that names THIS @keyframes via `animation`/
        // `animation-name`, so the reconstructed object carries its options.
        // Matched on a word-boundary `animation*: … name …` reference; the
        // first match wins (CSS cascade — a later override is out of scope for
        // the ingest's per-rule reconstruction, BOOKed not half-wired).
        const nameRe = new RegExp(
            `\\banimation(?:-name)?\\s*:[^;}]*\\b${name}\\b`,
        );
        const sibling = styleRuleTexts.find((t) => nameRe.test(t));

        const perRule: Diagnostic[] = [];
        const animation = reconstructFromRule<V>(
            rule.cssText,
            sibling,
            options.options,
            perRule,
        );
        if (animation != null) {
            out.set(name, { name, animation, diagnostics: perRule });
        }
    }

    // Recursive descent into CSSGroupingRule bodies (L.W3 S2): `@media`,
    // `@supports`, `@layer`, `@container` expose their nested rules on their own
    // `.cssRules` list, which the flat loop above never enters. A `@keyframes`
    // declared inside one of these groups is reconstructed by re-running the SAME
    // walk over the group's inner `.cssRules` (the `out` Map accumulates across
    // depths). Bounded by `MAX_WALK_DEPTH` so a pathological CSSOM cannot recurse
    // without limit.
    if (depth < MAX_WALK_DEPTH) {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule == null || !isGroupingRule(rule)) continue;
            walkSheet<V>(rule.cssRules, out, options, depth + 1);
        }
    }
};

/**
 * Reconstruct ONE kf animation from a `@keyframes` rule's `cssText` (+ the
 * optional sibling style-rule text). The text bridge: `cssText` is exactly what
 * `resolveKeyframes` eats, so `fromString` reconstructs the object WHOLE — no
 * re-derivation. The per-rule `try/catch` is the VJ-9 robustness edge: a rule
 * whose body derails value.js's parser surfaces as a `PARSE_ERROR` row, never
 * an uncaught throw (the ingest stays total over a partial live web until VJ-9
 * lands FULL totality). The sibling text is concatenated BEFORE the keyframes so
 * `resolveKeyframes`'s `extractAnimationOptions` recovers the shorthand.
 */
const reconstructFromRule = <V extends Vars>(
    keyframesText: string,
    siblingText: string | undefined,
    baseOptions: Partial<InputAnimationOptions> | undefined,
    perRule: Diagnostic[],
): CSSKeyframesAnimation<V> | undefined => {
    try {
        const animation = new CSSKeyframesAnimation<V>(baseOptions ?? {});
        // The sibling style rule (if any) rides BEFORE the @keyframes block so
        // value.js's `extractAnimationOptions` recovers the `animation` shorthand
        // — the SAME single-grammar feed `fromString` already supports (a `.class`
        // + `@keyframes` mixed input).
        const source = siblingText
            ? `${siblingText}\n${keyframesText}`
            : keyframesText;
        animation.fromString(source);
        // The reconstruction's own parse diagnostics (EMPTY_PARSE, PARSE_ERROR
        // from value.js, COMPOSITION_FALLBACK at apply) ride the animation's
        // `diagnostics` field — carry them onto the per-rule channel so a
        // consumer reading the ingest result sees them without re-walking.
        for (const d of animation.diagnostics) perRule.push(d);
        return animation;
    } catch (e) {
        // The VJ-9 robustness edge: a rule value.js cannot parse totally (the
        // partial-input contract has a hole until VJ-9 lands FULL totality)
        // surfaces as a citable PARSE_ERROR row, NEVER an uncaught throw that
        // aborts the whole walk — one bad rule never poisons the page's others.
        pushDiagnostic(
            perRule,
            "PARSE_ERROR",
            `@keyframes rule could not be reconstructed: ${
                e instanceof Error ? e.message : String(e)
            } — the source CSS could not be parsed faithfully (refused, not approximated)`,
            { input: keyframesText },
        );
        return undefined;
    }
};

/**
 * K1 — `resolveLiveKeyframes`: the lowest-level CSSOM walk. Accepts a
 * `Document`, an explicit `CSSStyleSheet[]`, or a single `CSSStyleSheet`, and
 * reconstructs every `@keyframes` rule it can read. The per-sheet `try/catch` is
 * the honesty surface (S3): a cross-origin sheet whose `cssRules` getter throws
 * `SecurityError` becomes a `CORS_SKIP` diagnostic row — never an uncaught throw
 * and never a silent drop ("ingestion's honest failure mode IS a diagnostic").
 *
 * The named sibling of `resolveKeyframes` (`adapter.ts`): where `resolveKeyframes`
 * normalises a STRING of CSS, `resolveLiveKeyframes` normalises the LIVE CSSOM —
 * the parser pointed forward at the web the page already ships.
 */
export const resolveLiveKeyframes = <V extends Vars = Vars>(
    source?: Document | ShadowRoot | CSSStyleSheet[] | CSSStyleSheet,
    options: IngestOptions = {},
): IngestResult<V> => {
    const animations = new Map<string, IngestedAnimation<V>>();
    const diagnostics: Diagnostic[] = [];

    // Resolve the sheet list. A bare call defaults to the ambient document's
    // sheets (the "ingest the live page" front door); an explicit list/sheet is
    // taken verbatim (the testable, DOM-free injection seam).
    let sheets: CSSStyleSheet[];
    if (source == null) {
        if (typeof document === "undefined") {
            pushDiagnostic(
                diagnostics,
                "CORS_SKIP",
                "no document in scope — resolveLiveKeyframes() needs a Document, " +
                    "a ShadowRoot, a CSSStyleSheet[], or a CSSStyleSheet (SSR has " +
                    "no live CSSOM)",
            );
            return { animations, diagnostics };
        }
        sheets = Array.from(document.styleSheets);
    } else if (Array.isArray(source)) {
        sheets = source;
    } else if (typeof Document !== "undefined" && source instanceof Document) {
        sheets = Array.from(source.styleSheets);
    } else if (
        typeof ShadowRoot !== "undefined" &&
        source instanceof ShadowRoot
    ) {
        // Shadow-DOM walk (L.W3 S4): a custom element's `@keyframes` may live in
        // its shadow root's `styleSheets` (declarative `<template shadowrootmode>`
        // / `<style>` inside the tree) OR its `adoptedStyleSheets` (constructable
        // stylesheets, Baseline 2023). Both are walked; neither is a top-level
        // `document.styleSheets` entry, so without this branch a shadow `@keyframes`
        // is invisible to `fromStyleSheets()` (the silent-absent class). The
        // per-sheet `try/catch` → `CORS_SKIP` below still applies (a constructable
        // sheet from another realm may throw on `.cssRules`).
        sheets = [
            ...(source.styleSheets != null
                ? Array.from(source.styleSheets)
                : []),
            ...(source.adoptedStyleSheets ?? []),
        ];
    } else {
        sheets = [source as CSSStyleSheet];
    }

    for (const sheet of sheets) {
        // The per-sheet honesty boundary (S3, the prerequisite W7 left for W8):
        // a cross-origin sheet without `Access-Control-Allow-Origin` throws a
        // `SecurityError` the moment `sheet.cssRules` is read. We CATCH it per
        // sheet and emit a `CORS_SKIP` row — the silent drop is the exact class
        // the proof culture forbids.
        let rules: CSSRuleList | null = null;
        try {
            rules = sheet.cssRules;
        } catch (e) {
            const href = sheet.href ?? "(inline)";
            pushDiagnostic(
                diagnostics,
                "CORS_SKIP",
                `cross-origin stylesheet skipped: ${href} — its cssRules threw ` +
                    `${
                        e instanceof Error ? e.name : "an error"
                    } (no Access-Control-Allow-Origin + crossorigin). The sheet is ` +
                    `REPORTED, not silently dropped.`,
                { input: href },
            );
            continue;
        }
        if (rules == null) continue;
        walkSheet<V>(rules, animations, options);
    }

    return { animations, diagnostics };
};

/**
 * K1 — `fromStyleSheets`: the consumer-facing front door over
 * {@link resolveLiveKeyframes}. Walk the document's (or the given list's)
 * stylesheets and return every reconstructed `@keyframes` animation. The honest
 * `CORS_SKIP`/`PARSE_ERROR` rows ride the returned {@link IngestResult}.
 *
 * @example
 * const { CSSKeyframesAnimation, fromStyleSheets } = await loadAnimationEngine();
 * const { animations, diagnostics } = fromStyleSheets();
 * const pulse = animations.get("pulse")?.animation;
 * pulse?.setTargets(el).play();           // re-drive the page's OWN animation
 * for (const d of diagnostics) console.warn(d.code, d.message); // honest skips
 */
export const fromStyleSheets = <V extends Vars = Vars>(
    source?: Document | ShadowRoot | CSSStyleSheet[] | CSSStyleSheet,
    options: IngestOptions = {},
): IngestResult<V> => resolveLiveKeyframes<V>(source, options);

/**
 * K1 — `fromLiveAnimations`: adopt every RUNNING CSS animation on the document
 * (or a single element) by reconstructing each from its source `@keyframes`
 * RULE (via the CSSOM walk — NOT from `getAnimations().getKeyframes()`, the
 * computed form that has lost `var()`/`cqw`/oklab). The `getAnimations()` read
 * provides the SET of live animation names; the reconstruction provides the
 * authored keyframes. The result maps each live animation name → its
 * reconstructed kf object (the recovered, axis-preserving source).
 *
 * Distinct from {@link fromStyleSheets} (which walks EVERY declared `@keyframes`
 * rule, running or not): `fromLiveAnimations` narrows to the names currently
 * RUNNING on the page — the animations a user actually sees in motion.
 */
export const fromLiveAnimations = <V extends Vars = Vars>(
    target?: Document | Element,
    options: IngestOptions = {},
): IngestResult<V> => {
    const animations = new Map<string, IngestedAnimation<V>>();
    const diagnostics: Diagnostic[] = [];

    const scope: Document | Element | undefined =
        target ?? (typeof document !== "undefined" ? document : undefined);
    if (scope == null || typeof scope.getAnimations !== "function") {
        pushDiagnostic(
            diagnostics,
            "CORS_SKIP",
            "no getAnimations() in scope — fromLiveAnimations() needs a " +
                "Document or Element with the Web Animations API (SSR has none)",
        );
        return { animations, diagnostics };
    }

    // Collect the running CSS-animation names. A CSSAnimation carries an
    // `animationName`; a WAAPI/transition animation does not (we ingest only
    // CSS-originated animations — they have a `@keyframes` source to reconstruct).
    const liveNames = new Set<string>();
    for (const anim of scope.getAnimations()) {
        const name = (anim as { animationName?: string }).animationName;
        if (typeof name === "string" && name.length > 0) liveNames.add(name);
    }

    // Reconstruct each live name from the CSSOM `@keyframes` rule (the authored
    // form). The walk over the ambient document's sheets is the source of truth
    // for the keyframes; `getAnimations()` is the playhead/SET source only.
    const ownerDoc =
        scope instanceof Document
            ? scope
            : ((scope as Element).ownerDocument ??
              (typeof document !== "undefined" ? document : undefined));
    const sheetSource = ownerDoc ?? undefined;

    for (const name of liveNames) {
        const result = resolveLiveKeyframes<V>(sheetSource, {
            ...options,
            animationName: name,
        });
        for (const [k, v] of result.animations) animations.set(k, v);
        for (const d of result.diagnostics) diagnostics.push(d);
    }

    return { animations, diagnostics };
};
