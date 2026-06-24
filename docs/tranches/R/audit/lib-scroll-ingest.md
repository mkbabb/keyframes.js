# Tranche R Audit — Lane: lib-scroll-ingest

**Files audited:**
- `src/animation/scroll-scene.ts` (539 L)
- `src/animation/scroll-grammar.ts` (137 L)
- `src/animation/ingest.ts` (348 L)
- `src/animation/ingest-cssom.ts` (466 L)
- `src/animation/adapter.ts` (316 L)

---

## Finding 1 — Dead `onParseError` closure in `adapter.ts` (workaround / dead-code)

**Severity: high**

`adapter.ts` lines 235–238:

```ts
const onParseError: OnParseError = (d: ParseDiagnostic) => {
    diagnostics.push({ ...d, code: "PARSE_ERROR" });
};
void onParseError;
```

`OnParseError` is imported from `@mkbabb/value.js` and the callback is constructed, but immediately suppressed with `void onParseError`. It is **never passed to any function**. `parseCSSStylesheet` has the signature `(input: string) => Stylesheet` — it does not accept an `OnParseError` argument (confirmed from the `.d.ts`). The closure was authored as a preparatory stub for a future value.js API (`VJ-9` partial-input totality) that has not landed.

The comment at lines 223–234 explicitly says "Authored here; populated when that producer lands" — this is a half-wired workaround stub. The stub allocates a closure per `resolveKeyframes()` call for zero effect.

**Proposal:** Delete the `onParseError` variable, its construction, and the `void` suppression. Remove the dead `type OnParseError` import from the import list. When value.js actually ships an error-callback API on `parseCSSStylesheet`, wire it at that time. The existing per-rule `try/catch` in `reconstructFromRule` (`ingest-cssom.ts`) already provides robustness for the CSSOM walk path.

---

## Finding 2 — Dead `scrubSeconds` private field in `ScrollScene` (dead-code)

**Severity: medium**

`scroll-scene.ts` lines 353, 370, 376, 380:

```ts
private readonly scrubSeconds: number;
// ...
this.scrubSeconds = options.scrub ?? 0;
if (this.scrubSeconds > 0) {
    const damping = clamp(1 / (this.scrubSeconds * 60 + 1), 0.01, 1);
```

`scrubSeconds` is assigned in the constructor and used only within the constructor body to compute `damping`. After construction it is never read (no getter, no method references it). It occupies a private slot on every `ScrollScene` instance for no post-construction purpose.

**Proposal:** Replace with a local `const scrubSeconds = options.scrub ?? 0;` inside the constructor block. Remove the `private readonly scrubSeconds` field declaration.

---

## Finding 3 — N+1 CSSOM walk in `fromLiveAnimations` (brittleness / performance)

**Severity: high**

`ingest-cssom.ts` lines 456–463:

```ts
for (const name of liveNames) {
    const result = resolveLiveKeyframes<V>(sheetSource, {
        ...options,
        animationName: name,
    });
    for (const [k, v] of result.animations) animations.set(k, v);
    for (const d of result.diagnostics) diagnostics.push(d);
}
```

`fromLiveAnimations` calls `resolveLiveKeyframes` once **per live animation name**. Each call walks the entire CSSOM — all sheets, all rules, recursive descent into grouping rules — and throws away all entries not matching the filter. For a page with N live CSS animations, this is O(N × sheets × rules), where a single O(sheets × rules) pass is sufficient. `resolveLiveKeyframes(sheetSource, { ...options })` (no `animationName` filter) already returns all `@keyframes` rules; the caller can then filter by `liveNames` in O(N).

The inefficiency compounds because `liveNames` is a `Set` collected from `scope.getAnimations()`, and any sheet-read `SecurityError` produces duplicate `CORS_SKIP` diagnostic rows — one per live name that triggers a walk of the offending sheet.

**Proposal:** Replace the per-name loop with a single `resolveLiveKeyframes<V>(sheetSource, { ...options })` call (no `animationName` filter), then filter the result map by `liveNames`:

```ts
const result = resolveLiveKeyframes<V>(sheetSource, { ...options });
for (const d of result.diagnostics) diagnostics.push(d);
for (const [k, v] of result.animations) {
    if (liveNames.has(k)) animations.set(k, v);
}
```

---

## Finding 4 — `CORS_SKIP` code misused for non-CORS API-absent failures (api-surface / brittleness)

**Severity: medium**

`ingest-cssom.ts` line 323 and line 430:

```ts
// line 323 — SSR / no document
pushDiagnostic(diagnostics, "CORS_SKIP",
    "no document in scope — resolveLiveKeyframes() needs a Document, ...");

// line 430 — no getAnimations()
pushDiagnostic(diagnostics, "CORS_SKIP",
    "no getAnimations() in scope — fromLiveAnimations() needs a ...");
```

`CORS_SKIP` has a specific semantic: a cross-origin sheet whose `cssRules` getter throws `SecurityError`. Reusing it for "no document in SSR" and "no Web Animations API" breaks the stable-`code` contract the `DiagnosticCode` type exists to provide. A consumer branching on `d.code === "CORS_SKIP"` cannot distinguish "cross-origin sheet skipped" from "ran in SSR with no CSSOM" or "element has no WAAPI". The latter two conditions require different handling.

**Proposal:** Add two new `DiagnosticCode` values to `adapter.ts`:
- `"SSR_NO_CSSOM"` — used when `document` is absent (SSR / test environment with no live CSSOM).
- `"API_ABSENT"` — used when a required Web API (`getAnimations`, etc.) is missing.

Emit them in the two locations above. The `CORS_SKIP` code reverts to its sole correct meaning: cross-origin `SecurityError` on `sheet.cssRules`.

---

## Finding 5 — `fromStyleSheets` is a pure alias for `resolveLiveKeyframes` (dry / api-surface)

**Severity: low**

`ingest-cssom.ts` lines 400–403:

```ts
export const fromStyleSheets = <V extends Vars = any>(
    source?: Document | ShadowRoot | CSSStyleSheet[] | CSSStyleSheet,
    options: IngestOptions = {},
): IngestResult<V> => resolveLiveKeyframes<V>(source, options);
```

`fromStyleSheets` is a zero-logic wrapper that exists solely to give the user-facing name. It duplicates the full generics, parameter list, and return type of `resolveLiveKeyframes` — one change to the underlying signature requires two edits. The only distinction between the two names is semantic (consumer vs. lower-level API), but both are exported publicly.

**Proposal:** Either (a) eliminate `fromStyleSheets` and export `resolveLiveKeyframes` under the consumer-facing name directly, or (b) if the aliasing is a deliberate API-stability decision (external consumers depend on the `fromStyleSheets` name), document it explicitly and add a comment confirming it is an intentional stable alias, not an oversight.

---

## Finding 6 — `pickKeyframes` silently drops all but the first `@keyframes` rule (legacy / fallback)

**Severity: medium**

`adapter.ts` lines 183–194:

```ts
/**
 * Pick the first @keyframes block from the stylesheet — the AST
 * supports multiple, but the legacy `fromString` interface assumed one.
 */
const pickKeyframes = (ast: Stylesheet): KeyframeRule[] => {
    const all = extractKeyframes(ast);
    for (const rules of all.values()) {
        if (rules.length > 0) return rules;
    }
    return [];
};
```

The function silently discards every `@keyframes` rule after the first one in a multi-rule input. The comment acknowledges this as a **legacy** limitation inherited from the old `fromString` interface. `engine.ts` line 1317 says "No regex pre-detection or fallback parser path" — the grammar already handles multi-keyframes — yet the adapter drops them. This is a silent data-loss fallback that violates the "no silent handling" precept.

**Proposal:** The fix depends on how multi-keyframes inputs are intended to work in the public API:

- If `fromString` should only ever accept a single named `@keyframes` block, `pickKeyframes` should throw an explicit `AnimationOptionError` (the existing typed-throw idiom from `internal/errors.ts`) when `extractKeyframes(ast).size > 1`, rather than silently discarding the rest.
- If multi-keyframes inputs will be supported in the future, document it as a `BOOK` item with a specific `MULTI_KEYFRAMES_UNSUPPORTED` diagnostic row emitted to the caller, not a silent drop.

Either way, the silent fallback must be excised.

---

## Finding 7 — Duplicate `PHASE_FRACTIONS` / `NAMED_SELECTOR_PHASES` data (dry)

**Severity: low**

`scroll-scene.ts` lines 99–107 define `PHASE_FRACTIONS` (the full 7-entry set). `frame-compiler.ts` lines 148–153 define `NAMED_SELECTOR_PHASES` (a 4-entry subset of the same data), with the comment "intentional BOOK duplication — the DATA is duplicated; the LOGIC lives once."

The BOOK-duplication rationale is that `frame-compiler.ts` cannot import the HEAVY `scroll-scene.ts` (which carries the value.js edge via re-export of `scroll-grammar.ts`). However, `PHASE_FRACTIONS` is entirely value.js-free — it is a plain `Record<string, {start, end}>` of numeric literals. It could live in `internal/leaves.ts` or a new `internal/scroll-phases.ts` without ANY value.js edge. Both `scroll-scene.ts` and `frame-compiler.ts` would import it from there, eliminating the duplication without creating a heavy coupling.

**Proposal:** Extract `PHASE_FRACTIONS` (the 4 selector-valid entries) to `src/animation/internal/scroll-phases.ts` as a value.js-free constant. Import it in both `scroll-scene.ts` (replacing `PHASE_FRACTIONS`) and `frame-compiler.ts` (replacing `NAMED_SELECTOR_PHASES`). Remove the BOOK-duplication note.

---

## Finding 8 — `scroll-scene.ts` and `scroll-grammar.ts` / `ingest.ts` and `ingest-cssom.ts` are hub files masquerading as flat siblings (decomposition)

**Severity: high**

The Tranche Q close explicitly split `scroll-scene.ts + scroll-grammar.ts` (SO-1 grammar vs TIME driver) and `ingest.ts + ingest-cssom.ts` (temporal takeover vs CSSOM walk) at "natural concern seams." Each hub file (`scroll-scene.ts`, `ingest.ts`) re-exports its sibling wholesale to preserve the import surface. This is the exact pattern the Tranche R precepts flag: **flat hyphenated siblings instead of genuine directory sub-modules**.

The current layout:
```
src/animation/
  scroll-grammar.ts   ← grammar/parse (value.js-bearing)
  scroll-scene.ts     ← time driver + re-exports scroll-grammar
  ingest-cssom.ts     ← CSSOM walk
  ingest.ts           ← temporal takeover + re-exports ingest-cssom
  adapter.ts          ← CSS parse adapter (feeds engine)
```

The natural directory layout:
```
src/animation/scroll/
  index.ts            ← barrel (re-exports grammar + scene; zero new logic)
  grammar.ts          ← = scroll-grammar.ts (value.js parse/serialize)
  scene.ts            ← = scroll-scene.ts body MINUS grammar re-export

src/animation/ingest/
  index.ts            ← barrel (re-exports cssom + adopt; zero new logic)
  cssom.ts            ← = ingest-cssom.ts (CSSOM walk, reconstructFromRule)
  adopt.ts            ← = ingest.ts body MINUS cssom re-export (adoptRunning, seedAtTime)
```

`adapter.ts` belongs to neither scroll nor ingest — it is the parse/normalize layer that feeds `engine.ts` and is consumed by `ingest/cssom.ts`. It should stay at the `src/animation/` level (or move into a `src/animation/parse/` dir if the parse cluster grows), but is not in scope for scroll or ingest decomposition.

**External import surfaces are unchanged:** `load-engine.ts` imports from `"./ingest"` and `"./scroll-scene"` — these become imports from `"./ingest/index"` and `"./scroll/index"`, which TypeScript resolves identically with directory imports. `index.ts` (the barrel) already imports from these two paths and keeps the same re-export spellings.

**Proposal:** Promote the four named files into `src/animation/scroll/` and `src/animation/ingest/` directories as described. Each directory gets a minimal `index.ts` barrel that re-exports all public names from the two sub-modules. No logic moves, no names change, no new abstractions are created — purely a directory promotion.

---

## Finding 9 — `isKeyframesRule` structural fallback is a CSSOM compat workaround (workaround)

**Severity: low**

`ingest-cssom.ts` lines 117–131:

```ts
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
```

The `instanceof` check guards against jsdom's historical absence of `CSSKeyframesRule` as a global. `CSSKeyframesRule` has been available in all browsers since 2014 (Baseline Widely Available) and in jsdom since v14 (2019). The structural fallback exists for "a non-DOM / polyfilled CSSOM" — an environment the comment does not name. If jsdom (the project's test environment) now exposes `CSSKeyframesRule`, the fallback branch is unreachable dead code.

**Proposal:** Check whether jsdom exposes `CSSKeyframesRule` in the project's current jsdom version. If yes, remove the structural fallback and use `instanceof CSSKeyframesRule` directly (with a `typeof CSSKeyframesRule !== "undefined"` SSR guard only). If the project genuinely targets an environment lacking `CSSKeyframesRule`, document it explicitly with the environment name — do not leave an unnamed "non-DOM / polyfilled CSSOM" justification.

---

## Finding 10 — `nameRe` RegExp constructed per `@keyframes` rule inside the hot path (brittleness)

**Severity: low**

`ingest-cssom.ts` lines 214–217 (inside the rule loop in `walkSheet`):

```ts
const nameRe = new RegExp(
    `\\banimation(?:-name)?\\s*:[^;}]*\\b${name}\\b`,
);
const sibling = styleRuleTexts.find((t) => nameRe.test(t));
```

A `new RegExp(...)` is constructed for every `@keyframes` rule in every sheet. For a stylesheet with many `@keyframes` rules, this allocates N regex objects per sheet walk. The regex string incorporates `name` without escaping, so a `@keyframes` name containing regex metacharacters (e.g. `my.animation`) produces a silently incorrect regex. CSS animation names can contain hyphens but also any `<custom-ident>` that could include characters like `.` if the CSS is authored oddly or if the regexp is extended in the future.

**Proposal:** (a) Escape `name` before interpolating into the regex (using a `escapeRegExp` utility). (b) If `styleRuleTexts` contains more than a handful of entries in practice, consider replacing the regex with a structural parse of the sibling rule text (value.js can parse the style rule's `animation-name` declaration directly, since the text is already `cssText`). At minimum, the regex should be fail-explicit on a name that is not a valid CSS `<custom-ident>`.

---

## Structural Summary

### Should these become `src/scroll/` + `src/ingest/` sub-modules?

**Yes**, and the reorganization is purely mechanical — no logic changes, no API changes. The current flat hyphenated siblings (`scroll-grammar.ts` + `scroll-scene.ts`, `ingest-cssom.ts` + `ingest.ts`) are the exact anti-pattern the Tranche R precepts call out. Both pairs were deliberately split at "natural concern seams" during Tranche K but were placed as flat siblings instead of genuine directory sub-modules.

The correct path is:
- `src/animation/scroll/` — grammar sub-module (`grammar.ts`) + scene/driver sub-module (`scene.ts`) + `index.ts` barrel.
- `src/animation/ingest/` — CSSOM walk sub-module (`cssom.ts`) + temporal takeover sub-module (`adopt.ts`) + `index.ts` barrel.
- `adapter.ts` stays at `src/animation/` level (it feeds `engine.ts` directly and is not part of scroll or ingest).

**Constraint:** `load-engine.ts` uses `import("./scroll-scene")` and `import("./ingest")` as dynamic chunk boundaries. The `scroll-scene` chunk must remain a single entry point (Vite chunks by entry specifier). After the directory promotion, `load-engine.ts` changes those to `import("./scroll/index")` and `import("./ingest/index")` — identical chunk behavior, just from the new barrel. No bundler behavior changes.
