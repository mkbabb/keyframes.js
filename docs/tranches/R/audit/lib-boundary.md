# Tranche R — lib-boundary lane audit

**Files:** `src/animation/load-engine.ts` (559L), `src/animation/index.ts` (254L)
**Focus:** The dynamic-import boundary; LIGHT/HEAVY split; granular accessors; rename ergonomics.

---

## 1. load-engine.ts line-count breakdown

The file is 559 lines. It contains:

| Content | Lines | % |
|---|---|---|
| Comment/JSDoc | 290 | 51.9% |
| Blank | 13 | 2.3% |
| Actual code | 257 | 45.9% |

Within the code, the `AnimationEngine` interface alone spans **lines 118–240 = 122 lines (21.8% of the file)**. It has 41 members, each typed `typeof someImpl`, carrying a per-member JSDoc paragraph that is largely a tranche-provenance annotation (K.W8, K.W9, K.W10, L.W6, L.W8, O.W6 — 30+ occurrences).

The *functional* core of the file — the 5 exported functions + 4 module-var declarations — amounts to roughly 50 lines of code. Everything else is the interface taxonomy and its archaeology.

---

## 2. Is the LIGHT/HEAVY split architecture justified?

**Yes, unambiguously.** Value.js is ~516 KB across multiple chunks (serialize, color, easing, units, path). A spring-only consumer that never calls `loadAnimationEngine()` pays zero bytes of that. The boundary is real and gated by `proof:boundary`. This is not over-engineering; it is the core product proposition.

---

## 3. Findings

### 3.1 — EFFUSIVE DYNAMICISM: granular accessors (loadEngine / loadCompiler / loadIngest) have zero real-world usage

`loadEngine`, `loadCompiler`, and `loadIngest` are published on the surface (L.W7 S3) and documented in `docs/published-surface.md`. Across the entire repository, their combined real usage is:

- `loadEngine`: one occurrence in `demo/@/components/custom/editor-shell/useHeroSourceEgg.ts:36` — but it is a **local parameter** typed `typeof LoadAnimationEngine` (i.e., `typeof loadAnimationEngine`); the symbol is DI-passed-in `loadAnimationEngine`, not the granular `loadEngine` export.
- `loadCompiler`: zero usages.
- `loadIngest`: zero usages.

No test file exercises `loadEngine`, `loadCompiler`, or `loadIngest`. They do not appear in the demo. They are specified-but-never-called surface.

The three accessors add ~150 lines to load-engine.ts (the interfaces `EngineCore`, `CompilerSurface`, `IngestSurface` plus the three functions). Their memoization vars (`_compileMod`, `_ingestMod`, `_scrollMod`) exist solely to allow cross-accessor chunk sharing — a need that evaporates when the accessors are removed. Removing them collapses load-engine.ts to ~400 lines and removes 3 dead exported symbols from the API surface.

**Proposal:** Excise `loadEngine`, `loadCompiler`, `loadIngest`, `EngineCore`, `CompilerSurface`, `IngestSurface` from `load-engine.ts` and from `index.ts`'s re-exports. Collapse `_compileMod`, `_ingestMod`, `_scrollMod` module vars and their `??=` references in `loadIngest` (dead after excision). Consumers who need the engine core only use `loadAnimationEngine()` and destructure. The `warmEngine()` + `loadAnimationEngine()` pair already serves every real use case.

---

### 3.2 — EFFUSIVE DYNAMICISM: AnimationEngine interface is a 122-line hand-maintained shadow of the runtime surface

The `AnimationEngine` interface at `load-engine.ts:118–240` manually re-types all 41 members of the merged engine object. The comment at line 113–116 justifies this:

```ts
/**
 * Spelled as an explicit interface (rather than `typeof import("./engine")`)
 * because the dts roll-up — API Extractor — cannot resolve a `typeof import()`
 * type node that points at an internal module.
 */
```

API Extractor IS in use (devDependency `@microsoft/api-extractor@^7.58.7`, referenced in `vite.config.ts:346`). This constraint is genuine. HOWEVER:

The existing approach produces a **drift hazard**: when a new export is added to any of the 13 dynamic chunks in `loadAnimationEngine()`'s `Promise.all`, the `AnimationEngine` interface must be manually updated or it silently becomes stale. The FLAGGED ADDITIVE pattern (30+ tranche annotations) shows this has happened 6+ times already and will continue.

`proof:published-surface` (`scripts/proof-published-surface.mjs`) partially addresses this by diffing `Object.keys(engine)` against the interface at runtime — but it only catches omissions, not type drift.

**Proposal:** Retain the hand-maintained interface (the API Extractor constraint is real), but strip the per-member tranche provenance JSDoc down to a single-line description. The current content reads as internal change-log prose embedded in public-surface types. Each member's `// K.W8 FLAGGED ADDITIVE` paragraph belongs in `CHANGELOG.md`, not in the interface JSDoc that ships in `.d.ts` output. This alone would reduce the interface from 122 lines to ~55 lines, halving its contribution to the file size.

---

### 3.3 — EFFUSIVE DYNAMICISM: warmEngine is a 1-line function wrapping loadAnimationEngine with a 30-line JSDoc

`warmEngine()` at `load-engine.ts:557–559`:

```ts
export const warmEngine = (): void => {
    void loadAnimationEngine();
};
```

The JSDoc above it is 30 lines including a deferred `scheduler.postTask` adoption note (L.W7 S4 — a MEASURE-FIRST deferral). The function body is `void loadAnimationEngine()`.

The 30-line JSDoc carries a legitimate design note about why `scheduler.postTask("background")` was NOT adopted — but that's implementation archaeology, not consumer documentation. Callers only need to know: "call this during idle to pre-flight the engine chunk."

**Proposal:** Reduce the JSDoc to 5 lines (what it does, when to call it, idempotency). Move the postTask deferral rationale to a comment inside the function body or to CHANGELOG.

---

### 3.4 — LEGACY / STALE: README still uses deprecated `Animation` name post-5.0.0

After the 5.0.0 alias drop, three README lines still use the old name `Animation` in backtick context:

- `README.md:232`: "The classes above — \`Animation\`, \`CSSKeyframesAnimation\`, \`AnimationGroup\` — are the heavy tier"
- `README.md:541`: "the heavy engine (\`Animation\`, \`CSSKeyframesAnimation\`, \`AnimationGroup\`)"
- `README.md:546`: "\*\*Heavy engine\*\* (\`Animation\` / \`CSSKeyframesAnimation\`)"

These three references use the dropped alias name as if it were still current, contradicting `docs/MIGRATION-5.0.0.md` which explains it was dropped. A consumer searching for `Animation` in README would find it as the canonical current name.

**Proposal:** Replace each occurrence with `KeyframesAnimation`. These are documentation-level excisions, not code changes, but they are stale legacy text on the published face of the library.

---

### 3.5 — BRITTLENESS: loadAnimationEngine memoizes some chunks but not others (asymmetry)

Inside `loadAnimationEngine()`'s `Promise.all`, 4 of the 13 dynamic imports use module-level memoization vars (`_engineMod`, `_compileMod`, `_ingestMod`, `_scrollMod`) while 9 use inline `import()` calls (`./animate`, `./motion-path`, `./draw-svg`, `./morph-svg`, `./validate`, `./animations`, `./format`, `./utils`, `./internal/scheduler`).

The outer `_enginePromise ??=` ensures `Promise.all` is only ever constructed once, so the unmemoized inner imports only fire once in practice. The per-module vars are needed only for the granular accessors (`loadCompiler`, `loadIngest`) to share chunks with `loadAnimationEngine`. If the granular accessors are removed (Finding 3.1), all 4 per-module vars become dead.

**Current state:** The asymmetry is technically correct (not a bug) but looks wrong to a reader who expects a consistent pattern. Once the granular accessors are excised, `loadAnimationEngine` can be simplified to a single `_enginePromise ??= Promise.all([...all imports inline...])` with no module vars except `_enginePromise`.

**Proposal:** After excision of granular accessors, remove `_engineMod`, `_compileMod`, `_ingestMod`, `_scrollMod` and inline `importEngine()` as `import("./engine")`. The memoization contract is fully preserved by `_enginePromise ??=`.

---

### 3.6 — API-SURFACE: The Animation → KeyframesAnimation rename was correct; the ergonomics are acceptable but verbose

**Verdict on correctness:** The rename is correct. `Animation` collided with `globalThis.Animation` (WAAPI), causing API Extractor to emit `Animation_2` numeric suffixes in `.d.ts`. `KeyframesAnimation` is unambiguous. Similarly `ScrollTimeline` → `KeyframesScrollTimeline` avoids the Houdini global. The aliases were kept one major and dropped in 5.0.0, which is the right cadence.

**Ergonomics assessment:** `CSSKeyframesAnimation` is the primary consumer-facing class; `KeyframesAnimation` is the base rarely instantiated directly. The demo consistently uses:

```ts
const { CSSKeyframesAnimation } = await loadAnimationEngine();
const anim = new CSSKeyframesAnimation({ duration: 600 }).fromString(css);
```

`CSSKeyframesAnimation` is 20 characters — verbose but unambiguous and self-documenting (it IS a CSS-keyframe animation). The base `KeyframesAnimation` appears in type annotations and group/sequence contexts. Neither name is ergonomically problematic at real usage sites.

The two-step access pattern (`await loadAnimationEngine()` then destructure) is the known cost of the LIGHT/HEAVY split. The demo's `kfEngine()` synchronous accessor (pre-warmed at boot) is the production ergonomic answer. This is a design-by-constraint, not a design smell.

**The one real ergonomic friction:** The published barrel does not re-export the runtime constructors statically. A consumer must always go through the async door even for type-checking runtime values. `import type { KeyframesAnimation }` works (erased), but there is no `import { KeyframesAnimation }` path. This is load-engine's intentional design and the `proof:boundary` contract — it is not wrong, but it is the primary ergonomic cost consumers notice.

---

### 3.7 — DECOMPOSITION: load-engine.ts separation from index.ts is justified at current size

At 559 lines (52% comments), splitting load-engine.ts off from index.ts (254 lines) is the right call. If merged, the barrel would be 813 lines, well over the 500-line threshold. The separation is clean: `index.ts` is the LIGHT static barrel; `load-engine.ts` owns the HEAVY dynamic machinery. These are genuinely distinct concerns.

After the excisions in Findings 3.1, 3.2, 3.3, and 3.5:
- `AnimationEngine` interface: ~55 lines (from 122)
- `EngineCore` / `CompilerSurface` / `IngestSurface`: removed (~55 lines)
- `loadEngine` / `loadCompiler` / `loadIngest`: removed (~80 lines)
- `_compileMod`, `_ingestMod`, `_scrollMod`, `importEngine`: removed (~10 lines)
- JSDoc reduction on `warmEngine`: ~25 lines saved

Projected result: ~559 - 250 = ~310 lines. At that size, load-engine.ts would be a clean, readable 310-line file that does exactly one thing: hold the `AnimationEngine` interface and the two-function loading API (`loadAnimationEngine` + `warmEngine`).

---

## 4. Summary table

| # | Category | Severity | File:lines | Proposal |
|---|---|---|---|---|
| 3.1 | effusive-dynamicism | high | load-engine.ts:325–401 | Excise `loadEngine`, `loadCompiler`, `loadIngest` + 3 surface interfaces — zero real usage |
| 3.2 | effusive-dynamicism | medium | load-engine.ts:118–240 | Strip per-member tranche JSDoc to single-line; keep interface (API Extractor constraint is real) |
| 3.3 | effusive-dynamicism | low | load-engine.ts:527–559 | Reduce warmEngine JSDoc from 30 to 5 lines; inline postTask archaeology as code comment |
| 3.4 | legacy | medium | README.md:232,541,546 | Replace stale `Animation` references with `KeyframesAnimation` |
| 3.5 | brittleness | low | load-engine.ts:316–322 | After 3.1 excision, remove 4 module-level memoization vars — `_enginePromise ??=` is sufficient |
| 3.6 | api-surface | low | index.ts + load-engine.ts | Rename ergonomics are acceptable; no change needed |
| 3.7 | decomposition | — | load-engine.ts (whole) | File split is justified; after excisions projects to ~310 lines |
