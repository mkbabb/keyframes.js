/**
 * ingest.ts — the round-trip pointed FORWARD at the live web (K.W8).
 *
 * The parser run FORWARD over the SAME data model: the engine's input is a
 * string of CSS, and the CSSOM emits strings of CSS, so kf is one thin adapter
 * away from animating any page's OWN animations. This module walks
 * `document.styleSheets`, filters to `CSSKeyframesRule`, serialises each via
 * `rule.cssText`, and feeds that text into the EXISTING `resolveKeyframes`
 * pipeline (`adapter.ts`) — NO new grammar, NO re-derivation. What it reads is
 * exactly what the engine already eats; what cannot ingest faithfully is
 * REFUSED with a named `ParseDiagnostic` row, never silently approximated (the
 * replay-equality invariant, forward direction).
 *
 * ── BOUNDARY: HEAVY (value.js-bearing). It statically imports `./engine`
 * (`CSSKeyframesAnimation`) and `./adapter` (`resolveKeyframes`), both of which
 * carry the value.js CSS grammar. It therefore lives on the EXISTING
 * heavy/dynamic surface, reached ONLY via `loadAnimationEngine()` — the barrel
 * places its exports behind that accessor (the lead wires it), so a light-only
 * consumer never pulls value.js in. It adds NO new static value.js edge beyond
 * the engine it already needs (inv α; `proof:boundary`).
 *
 * Three moves:
 *   • K1 — `fromStyleSheets()` / `fromLiveAnimations()` / `resolveLiveKeyframes()`:
 *           the CSSOM walk. Per-sheet `try/catch`; a cross-origin sheet is a
 *           `CORS_SKIP` diagnostic, never a silent drop.
 *   • K2 — `adoptRunning()`: mid-flight takeover of a running CSS animation via
 *           `getAnimations()` currentTime handoff. NAMED `adoptRunning` to
 *           disambiguate from the shipped `engine.ts adoptCompiled` (HARDENING-5
 *           HAZARD-1). Reconstructs from the CSSOM `@keyframes` RULE (via K1 —
 *           the authored form, preserving `var()`/`cqw`/oklab), NEVER from
 *           `getAnimations().getKeyframes()` (the computed form has already lost
 *           the axes kf preserves). Seeds at the captured `currentTime` (the
 *           continuity seed — NOT seed-at-zero, which flashes).
 *   • S3 — the honesty surface: every refusal is a typed `Diagnostic` row.
 *
 * VJ-9 TRIPWIRE (recorded, NOT a gate). The ingest ships on the SHIPPED value.js
 * `cssText → resolveKeyframes` contract. value.js's VJ-9 FULL partial-input
 * totality (every malformed third-party rule parses totally, never throws) is
 * OPEN (it lands in value.js's VJ.W3 SUBSTRATE TOTALITY). Until it publishes, a
 * rule whose `cssText` derails value.js's parser surfaces as a `PARSE_ERROR`
 * row (the per-rule `try/catch` below), never an uncaught throw — the ingest's
 * robustness WIDENS on VJ-9's publish, it does not block on it.
 */

import { CSSKeyframesAnimation } from "./engine";
import { resolveKeyframes } from "./adapter";
import type { Diagnostic } from "./adapter";
import type { InputAnimationOptions, Vars } from "./constants";

/**
 * One ingested animation + the diagnostics its reconstruction produced. The
 * `name` is the `@keyframes` identifier (the CSSOM `CSSKeyframesRule.name`); the
 * `animation` is the reconstructed `CSSKeyframesAnimation`, already carrying any
 * sibling-style-rule `animation-*` options. `diagnostics` carries the honesty
 * rows for THIS rule (a malformed body → `PARSE_ERROR`, etc.); the walk-level
 * rows (`CORS_SKIP`) ride {@link IngestResult.diagnostics}.
 */
export interface IngestedAnimation<V extends Vars = any> {
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
export interface IngestResult<V extends Vars = any> {
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
 * Walk one sheet's `cssRules`, reconstructing each `@keyframes` rule (filtered
 * by `animationName` when set), and linking the FIRST sibling style rule that
 * references it via `animation`/`animation-name` so the reconstructed object
 * carries the `.foo { animation: pulse 2s }` options. The cross-origin
 * `SecurityError` (a `sheet.cssRules` read on a sheet without
 * `Access-Control-Allow-Origin`) is caught by the CALLER's per-sheet `try/catch`
 * (which emits the `CORS_SKIP` row) — this body assumes `cssRules` is readable.
 */
const walkSheet = <V extends Vars>(
    rules: CSSRuleList,
    out: Map<string, IngestedAnimation<V>>,
    options: IngestOptions,
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
export const resolveLiveKeyframes = <V extends Vars = any>(
    source?: Document | CSSStyleSheet[] | CSSStyleSheet,
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
                    "a CSSStyleSheet[], or a CSSStyleSheet (SSR has no live CSSOM)",
            );
            return { animations, diagnostics };
        }
        sheets = Array.from(document.styleSheets);
    } else if (Array.isArray(source)) {
        sheets = source;
    } else if (typeof Document !== "undefined" && source instanceof Document) {
        sheets = Array.from(source.styleSheets);
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
export const fromStyleSheets = <V extends Vars = any>(
    source?: Document | CSSStyleSheet[] | CSSStyleSheet,
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
export const fromLiveAnimations = <V extends Vars = any>(
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

/** Options for {@link adoptRunning}. */
export interface AdoptRunningOptions extends IngestOptions {
    /**
     * The running CSS animation's name to adopt. REQUIRED — an element may host
     * several CSS animations, and the takeover must name exactly one (the
     * `@keyframes` rule to reconstruct + the `getAnimations()` entry to read the
     * playhead from).
     */
    animationName: string;
    /**
     * Commit the native animation's current computed frame inline before
     * cancelling it (the commit-on-ADOPT, the inverse of `playWAAPI`'s
     * commit-on-finish), so there is no flash between the native paint and the
     * kf paint. Default true; set false only when the caller commits itself.
     */
    commit?: boolean;
}

/**
 * The outcome of an {@link adoptRunning} takeover. `animation` is the kf object
 * now driving the element (seeded at the captured playhead, already playing);
 * `currentTime` is the playhead (ms) the takeover seeded from; `diagnostics`
 * carries any honest refusal (no running animation by that name → a row, never
 * a silent no-op).
 */
export interface AdoptResult<V extends Vars = any> {
    /** The kf animation now driving the element (null on a refused adopt). */
    animation: CSSKeyframesAnimation<V> | null;
    /** The captured native `currentTime` (ms) the kf playhead seeded from. */
    currentTime: number;
    /** Honest refusal rows (e.g. no running animation by that name). */
    diagnostics: Diagnostic[];
}

/**
 * K2 — `adoptRunning`: the mid-flight TEMPORAL takeover. Given a live element
 * with a running CSS animation, seamlessly hand control to the kf engine:
 *
 *   1. `el.getAnimations()` → find the running `CSSAnimation` matching
 *      `{ animationName }`; read its `currentTime` + `playState`.
 *   2. Reconstruct the kf `CSSKeyframesAnimation` from the CSSOM `@keyframes`
 *      RULE (via {@link resolveLiveKeyframes} — the AUTHORED form, preserving
 *      `var()`/`cqw`/oklab), NOT from `getAnimations().getKeyframes()` (which has
 *      px-resolved `var()`/`cqw` and RGB-baked oklab — the very axes kf preserves).
 *   3. Seed the kf animation at the captured `currentTime` (the continuity seed
 *      — NOT seed-at-zero, which flashes the element to its 0% state).
 *   4. Commit the current frame inline (the commit-on-ADOPT), then `cancel()`
 *      the native animation, so there is no leaked-precedence flash (the inverse
 *      of `playWAAPI`'s commit-on-finish discipline — `waapi.ts`).
 *   5. Hand control to the kf engine (the kf animation plays from `currentTime`).
 *
 * NAMED `adoptRunning` to disambiguate from `engine.ts`'s `adoptCompiled`
 * (compiled-state internal adopt — untouched; HARDENING-5 HAZARD-1).
 *
 * @example
 * const { adoptRunning } = await loadAnimationEngine();
 * // el is mid-flight on `.spin { animation: spin 2s linear infinite }`
 * const { animation } = await adoptRunning(el, { animationName: "spin" });
 * // the kf object now drives `el` from the exact playhead — no visible seam.
 * animation?.pause();   // ...now scrub / spring-ify / re-color it.
 */
export const adoptRunning = async <V extends Vars = any>(
    el: Element,
    options: AdoptRunningOptions,
): Promise<AdoptResult<V>> => {
    const diagnostics: Diagnostic[] = [];
    const { animationName, commit = true } = options;

    if (typeof el.getAnimations !== "function") {
        pushDiagnostic(
            diagnostics,
            "WAAPI_INELIGIBLE",
            "the element has no getAnimations() — adoptRunning() needs the Web " +
                "Animations API to read the running animation's playhead",
        );
        return { animation: null, currentTime: 0, diagnostics };
    }

    // (1) find the running CSSAnimation by name; read its playhead.
    const live = el
        .getAnimations()
        .find(
            (a) =>
                (a as { animationName?: string }).animationName ===
                animationName,
        );
    if (live == null) {
        pushDiagnostic(
            diagnostics,
            "WAAPI_INELIGIBLE",
            `no running CSS animation named "${animationName}" on the element — ` +
                "adoptRunning() refuses (the takeover names exactly one running " +
                "animation; nothing was silently adopted)",
        );
        return { animation: null, currentTime: 0, diagnostics };
    }

    // The captured playhead — the continuity seed. `currentTime` is a
    // `CSSNumberish` (ms | null | a {value, unit} for a scroll timeline); we
    // take the numeric ms form, defaulting to 0 only when truly absent.
    const rawTime = (live as { currentTime?: unknown }).currentTime;
    const currentTime =
        typeof rawTime === "number" && Number.isFinite(rawTime) ? rawTime : 0;

    // (2) reconstruct from the CSSOM @keyframes RULE — the authored form, NOT
    // the computed getKeyframes() (which has lost var()/cqw/oklab). The walk
    // over the element's owner document, filtered to THIS name.
    const ownerDoc =
        el.ownerDocument ??
        (typeof document !== "undefined" ? document : undefined);
    const ingest = resolveLiveKeyframes<V>(ownerDoc ?? undefined, {
        ...options,
        animationName,
    });
    for (const d of ingest.diagnostics) diagnostics.push(d);

    const ingested = ingest.animations.get(animationName);
    if (ingested == null) {
        pushDiagnostic(
            diagnostics,
            "PARSE_ERROR",
            `the @keyframes rule for "${animationName}" could not be found or ` +
                "reconstructed from the CSSOM — adoptRunning() refuses rather than " +
                "reconstruct from the lossy computed keyframe list",
        );
        // The native animation keeps running; we adopted nothing (honest refusal).
        return { animation: null, currentTime, diagnostics };
    }

    const animation = ingested.animation;
    for (const d of ingested.diagnostics) diagnostics.push(d);
    animation.setTargets(el as HTMLElement);

    // (4) commit-on-ADOPT: paint the kf object's frame AT the captured playhead
    // inline BEFORE cancelling the native animation, so the element never flashes
    // to the 0% state between the native cancel and the kf paint. This is the
    // inverse of `playWAAPI`'s commit-on-finish (`waapi.ts`): there, kf bakes the
    // final frame before yielding to static styles; here, kf bakes the CURRENT
    // frame before taking over. `interpFrames(t, apply=true)` writes the resolved
    // frame onto the target.
    if (commit) {
        animation.interpFrames(currentTime, true);
    }

    // Cancel the native animation — its precedence (a CSS animation overrides
    // static styles while running) would otherwise fight the kf paint. We cancel
    // AFTER the commit so there is no window where neither paints.
    try {
        live.cancel();
    } catch {
        /* a finished/detached animation throws on cancel — already yielded */
    }

    // (3)+(5) seed the kf engine at the captured playhead and hand it control.
    // `seekAndPlay` starts the loop with `startTime` shifted so `effectiveT`
    // begins at `currentTime` — the continuity seed, NOT seed-at-zero. We do not
    // await the play promise (the handle IS the control surface, like `animate`).
    seedAtTime(animation, currentTime);

    return { animation, currentTime, diagnostics };
};

/**
 * Seed a freshly-reconstructed animation at `t` ms and start its loop so the
 * playhead CONTINUES from `t` instead of rewinding to 0 (the continuity seed —
 * the cure for the seed-at-zero flash, clause c).
 *
 * The mechanism: the play loop drives `advanceTo(now)` with `now` a rAF
 * timestamp in the `performance.now()` / `document.timeline` domain (the SAME
 * domain a `CSSAnimation.currentTime` delta lives in). On the FIRST tick
 * `advanceTo` re-seeds `startTime` ONLY when it is `undefined`; we instead
 * PRE-SET `startTime` in that clock domain so the first tick lands at
 * `this.t = now - startTime ≈ t`. The seed-at-zero default (the flash) is the
 * `startTime = now + delay` re-seed; the continuity seed bypasses it by setting
 * a defined `startTime` baselined to `t`.
 *
 * `onStart`'s direction/fill setup is run explicitly first (the takeover is a
 * mid-flight continuation, so `animationstart` is NOT re-dispatched — the
 * native animation already fired it), then `started` is marked and the loop
 * kicked. The commit-on-adopt (above) already painted `t`'s frame, so the first
 * rAF tick continues smoothly from there.
 */
const seedAtTime = <V extends Vars>(
    animation: CSSKeyframesAnimation<V>,
    t: number,
): void => {
    // Force the rAF path: the continuity seed positions the rAF playhead, but a
    // WAAPI delegation would hand the compositor a fresh `Element.animate()`
    // starting at 0 (the compositor cannot be seeded mid-curve the way the rAF
    // `startTime` baseline can), re-introducing the flash. The takeover is
    // explicitly an rAF-seeded continuation.
    animation.setUseWAAPI(false);
    // Run the direction/fill setup (NOT a re-`animationstart` — `onStart` only
    // dispatches when it falls through to the delay path; the takeover skips
    // delay, so no event re-fires). This positions `reversed`/fill exactly as a
    // fresh play would, minus the seed-at-zero.
    animation.onStart();
    animation.started = true;
    // The continuity seed: baseline `startTime` in the rAF clock domain so the
    // first `advanceTo(now)` computes `this.t = now - startTime ≈ t`, NOT 0. The
    // sub-frame drift between this `now()` read and the first rAF `now` is one
    // frame (~16ms) — visually continuous, the whole point of the seed.
    const now =
        typeof performance !== "undefined" && performance.now
            ? performance.now()
            : Date.now();
    animation.startTime = now - t;
    animation.t = t;
    void animation.play();
};
