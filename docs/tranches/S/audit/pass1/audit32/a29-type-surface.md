# Lane a29 — Type Surface Audit (Tranche R)

**Scope.** The shipped `.d.ts` surface after Tranche R (master `a15cd48..18e8617`,
v5.1.0): `dist/keyframes.d.ts` (4149 L) + `dist/engine/index.d.ts` (2873 L),
the API-Extractor / vite-plugin-dts generation path, `exactOptionalPropertyTypes`
/ `noUncheckedIndexedAccess` honesty, the 5.0.0 rename consistency
(`KeyframesAnimation`), `import type` discipline, generic quality of the core
APIs (`Vars` / `AnimationOptions`), and the `./engine` subpath `.d.ts`.

Method: read-only inspection of the built `.d.ts`, `vite.config.ts`
(`engineDtsRollupPlugin`), `package.json` exports, `tsconfig{,.lib}.json`, and a
census over `src/animation/**` for `as`-casts, non-null assertions, and `any`.
`npx tsc -p tsconfig.lib.json --noEmit` was run (read-only, `--noEmit`) and
**exits 0**.

---

## Executive summary

The R type surface is **structurally sound and honest, but under-trimmed and
generically loose**. What R actually touched here — the `./engine` subpath
`.d.ts` roll-up (R.W4b) and the `animate()` excision (R.W4 §2.5) — landed
correctly: both roll-ups are self-contained (value.js is the ONLY external
import; **zero** relative-import leaks), the `./engine` subpath is a real 39-key
**static value** mirror (`dist/engine/index.js`), and the shared classes are
**byte-identical** across the two independently-generated roll-ups (verified by
diffing `KeyframesAnimation` — 163 L, no delta). `check:lib` is green;
`verbatimModuleSyntax: true` + a green lib type-check means `import type`
discipline is **machine-guaranteed**, not aspirational. The 5.0.0
`Animation → KeyframesAnimation` rename is consistent (no bare `Animation` /
`Animation_2` leftover), and the `iterationComposite?: never` tripwire is
exemplary type-driven design.

The debt is on three axes, none of which R created but all of which R **left in
place** and S inherits:

1. **Generic collapse to `any`.** Every core generic defaults to `any`
   (`Vars<T = any>`, `<V extends Vars = any>` at 11 sites) — a default
   instantiation of the whole public class family is `…<any>`, so methods that
   return `V` return `any`. The SVG classes further diverge to
   `extends Record<string, any>` — a *different, looser* constraint than the
   engine's `extends Vars`.
2. **Under-trimmed surface.** 126 `private` members and **0** `@internal`
   markers reach the published `.d.ts`; nothing is trimmed. The 4149-line
   surface advertises internals, and the value.js-origin `PropertyDescriptor_2`
   collision alias leaks into two public interfaces' IDE hover.
3. **A zombie module + two un-reconciled roll-up pipelines.** `animate.ts` is
   excised from the published surface yet still present and tested (a NO-LEGACY
   target for S), and the two `.d.ts` roll-ups are produced by two *different*
   generators with no gate asserting they agree — currently consistent by luck
   of shared source, a silent-drift hazard.

No CRITICAL or HIGH type-safety defect found. Severity peaks at MEDIUM.

---

## Findings

### 1. [MEDIUM] Core generics default to `any`, collapsing the public class family to unchecked
**Evidence.** `src/animation/constants.ts:49` — `export type Vars<T = any>`.
`dist/keyframes.d.ts` — `<V extends Vars = any>` at 11 sites: `KeyframesAnimation`
(1653), `Sequence` (2899), `AdoptResult` (27), `CompileInput` (586),
`FrameCompiler` (1363), `IngestedAnimation` (1577), `IngestResult` (1610),
`adoptRunning` (63), `fromLiveAnimations` (1483), `fromStyleSheets` (1559),
`resolveLiveKeyframes` (2712).

A default type parameter of `= any` (not `= Vars`) means every unparameterised
use collapses to `any`: `new CSSKeyframesAnimation()` is
`CSSKeyframesAnimation<any>`, and any method returning `V` (`transform(vars: V)`,
frame accessors) returns `any` — TS stops checking. The domain is genuinely
string-keyed and dynamic, so *some* looseness is inherent, but `= Vars` (the
index-signature bound) is strictly more honest than `= any`: it preserves the
`number | string` value union at the boundary while `= any` discards it. `any`
also *propagates* — an `any`-typed frame var silently infects callers.

**Proposal (S).** Change the default from `= any` to `= Vars` at all 11 sites
(mechanical). Keep the `<T = any>` escape *inside* `Vars` for the free-form
value slot only. Add a gate (`proof:no-any-default` or fold into the boundary
gate) that greps the built `.d.ts` for `= any>` on exported generics and fails.

### 2. [LOW] SVG classes use `extends Record<string, any>` — a looser, divergent constraint from the engine's `extends Vars`
**Evidence.** `dist/keyframes.d.ts`: `DrawSVG<V extends Record<string, any> = any>`
(1158), `fromDrawSVG` (1468), `MorphSVG` (1907), `fromMorphSVG` (1520),
`MotionPath` (1995), `fromMotionPath` (1544). Everything else uses
`extends Vars`. `Vars` *is* a `Record<string, number|string|T>`, so the SVG
constraint is strictly weaker (admits `Record<string, object>` etc.) and
inconsistent with the rest of the surface for no stated reason.

**Proposal (S).** Unify the SVG factories/classes on `<V extends Vars = Vars>`.
One-line-per-site; removes a "why is this one different?" cliff for consumers
and IDEs.

### 3. [LOW-MEDIUM] `PropertyDescriptor_2` collision alias leaks into two public interfaces
**Evidence.** `dist/keyframes.d.ts:10` —
`import { PropertyDescriptor as PropertyDescriptor_2 } from '@mkbabb/value.js'`;
used publicly at `:740` (`propertyRegistry: Map<string, PropertyDescriptor_2>`)
and `:2629` (`properties: Map<string, PropertyDescriptor_2>`). value.js exports a
`PropertyDescriptor` type that collides with the DOM lib's global
`PropertyDescriptor`, so API Extractor renames the re-export to
`PropertyDescriptor_2`, which surfaces in every IDE hover over those maps. This
is the *same* class of defect the team already fixed for `globalThis.Animation`
(→ `KeyframesAnimation`, L.W8), `ScrollTimeline`, and `OscillatorOptions`
(→ `OscillatorConfig`; see `dist/keyframes.d.ts:2219-2231`, where
`OscillatorOptions_2` now appears ONLY in a comment) — but this one was missed
because it originates *upstream* in value.js, not in kf's own source.

**Proposal (S).** Two options: (a) dispatch value.js to rename its
`PropertyDescriptor` (e.g. `CSSPropertyDescriptor`) — the durable fix; or
(b) if the `@property` registry maps don't need to be public, drop them from the
exported class surface. Extend `proof:published-surface` clause (h) (the
existing collision-alias gate) to also scan for `_2` aliases sourced from
value.js, not just kf-local collisions.

### 4. [LOW-MEDIUM] The published `.d.ts` is under-trimmed: 126 `private` members, 0 `@internal`, no API-Extractor trimming
**Evidence.** `dist/keyframes.d.ts` — `grep -c "private "` = **126**;
`grep -c "@internal"` = **0**. The 4149-line surface emits every `private`
field/method. API Extractor's `dtsRollup` trimming (`betaTrimmedFilePath` /
`publicTrimmedFilePath`) is not used (`vite.config.ts:130` sets only
`untrimmedFilePath`), and nothing is `@internal`-tagged, so nothing is stripped.
Private members don't break consumers but they bloat hover, `.d.ts` download
size, and the "what is public?" signal — and they encode the *internal shape* of
`KeyframesAnimation`/`Sequence`/`AnimationGroup` into the published contract,
raising the change-detection noise floor.

**Proposal (S).** Tag genuinely-internal helpers `@internal` and emit a
`publicTrimmedFilePath` roll-up as the shipped `types`. This is also a
prerequisite for a clean "public surface diff" gate — right now a private-field
rename reads as a public-surface change.

### 5. [MEDIUM] Two independently-generated `.d.ts` roll-ups with no consistency gate — silent drift hazard
**Evidence.** `dist/keyframes.d.ts` is produced by `vite-plugin-dts` (its own
API-Extractor pass; `vite.config.ts:538`), while `dist/engine/index.d.ts` is
produced by a *separate* hand-rolled plugin `engineDtsRollupPlugin`
(`vite.config.ts:38-163`) that tsc-emits `engine/public.ts` to a temp dir and
runs API Extractor a second time with a *different* `overrideTsconfig`
(`lib: ["ES2022","ES2023","DOM"]`, `moduleResolution: "bundler"`; :110-124). The
two share NO code path. Today they agree — `diff` of the `KeyframesAnimation`
block across both is empty (163 L each) — but that agreement is unenforced. A
`compilerOptions` change in one pipeline (e.g. a `lib` bump, a resolution mode)
can silently change how a symbol renders in one roll-up and not the other, and
CI's dts byte-check (`vite.config.ts:536`) validates *presence*, not
cross-roll-up *consistency*.

**Proposal (S).** Add `proof:dts-rollups-agree`: for every symbol exported from
BOTH the barrel and the `./engine` subpath, assert the emitted declaration text
is identical (normalise import-alias suffixes). Longer term, S should consider
collapsing to ONE roll-up generator (the custom plugin already owns the harder
second-entry case robustly; the vite-plugin-dts path carries the racy-multi-entry
scar tissue documented at `vite.config.ts:22-31`).

### 6. [MEDIUM] `animate.ts` is a zombie: excised from the published surface, absent from `exports`, still present + tested
**Evidence.** R.W4 §2.5 excised `animate()` (`src/animation/index.ts:154-158`):
it is NOT re-exported and NOT in `dist/keyframes.d.ts` (`grep "declare function
animate"` = empty). `package.json` `exports` has no `./animate` subpath, so it is
unreachable even by deep import. Yet `src/animation/animate.ts` still exists
(with a public-shaped `TransformFunction<any>` option field at :90) and is still
exercised by `test/animate.test.ts` + `test/animate-orchestration.test.ts`. No
`src/` module imports it (`grep -rln "\./animate"` = empty). It is a
tested-but-unreachable module — the exact "legacy/dead-by-disuse but not deleted"
shape S's NO-LEGACY mandate targets.

**Proposal (S).** Decide explicitly: either (a) **restore** `animate()` as a
first-class heavy export (it is the genre-standard DX front door — `motion.animate`,
`gsap.to`, anime v4 `animate` — and its excision rationale was "0 demo call
sites", a weak signal for a *library* entry point), wiring it through
`loadAnimationEngine` + adding a `./animate` or barrel export and a scene that
uses it; or (b) **delete** `animate.ts` and its two tests outright. The current
middle state — kept, tested, unreachable — is the worst of both.

### 7. [LOW] `undefined as unknown as V` type-honesty holes in the frame pipeline (exactOptionalPropertyTypes papered over)
**Evidence.** `src/animation/compile/frame-compiler.ts:299-300` —
`vars: undefined as unknown as V, flatVars: undefined as unknown as V,` (a frame
constructed with its `V`-typed fields set to `undefined`, filled later at :460
`frame.flatVars = flatVars as unknown as V`). Similar in
`engine/interpolate.ts:223` (`buf[keys[i]!] = undefined as unknown as ValueUnit[]`).
The types claim `V` is always present; the runtime relies on a two-phase
construct-then-fill. Under `exactOptionalPropertyTypes` the honest shape would be
`vars?: V` or a distinct `PartialFrame` construction type, not a cast that lies.

**Proposal (S).** When S sub-zones `compile/` (the planned `compile/frame/`
carve), introduce a `FrameUnderConstruction<V>` shape with optional `vars`/
`flatVars` and narrow at the fill site, deleting the four `undefined as unknown
as V` casts. Low urgency (internal, documented), but it's a real hole in an
otherwise-`exactOptional`-honest codebase.

### 8. [LOW/INFO] Type-hole census: 25 `as unknown as` double-casts, 1 `as any`; the raw "85 as-casts" figure is inflated by import aliases
**Evidence.** `src/animation/**`: `as unknown as` = **25**, `as any` = **1**
(`compile/parse-flatten.ts:127`, and it's in a *comment* describing removed
casts), explicit `: any` in non-comment positions = **7** (all justified:
`NOOP_TRANSFORM: TransformFunction<any>` constants.ts:65, the `validate.ts:121-122`
authoring probe, `sequence/events.ts:65`, `group/index.ts:31`). The naïve
`as [A-Z]` regex returns 85, but the top "hotspot" `load-engine.ts` (8) is
entirely `import … as …` renames, not casts — so the *real* unchecked-cast
surface is the 25 `as unknown as`, concentrated at legitimate cross-realm seams:
value.js `Color` (`compile/backward-color.ts:62,66,106`), DOM
(`svg/morph-svg.ts:387` `ElementWithStyle`, `engine/composition.ts:171`
`target.style`), and `globalThis` (`resolve/env.ts:89,97`). Each is a defensible
boundary cast, but each is also an unchecked hole; none is wrong today.

**Proposal (S).** No action required beyond awareness. If S wants a ratchet, add
a census gate that fails if `as unknown as` count *grows*, forcing new casts to
justify themselves.

### 9. [LOW] `src/animation/CLAUDE.md` "Key Types" doc still describes the pre-R flat layout — authority drift adjacent to the type surface
**Evidence.** `src/animation/CLAUDE.md` "Files" tree and per-class sections
document `engine.ts`, `group.ts`, `numeric.ts`, `spring.ts`, … at the animation/
root — the flat layout R.W1 partitioned into `engine/`, `group/`, `physics/`,
etc. The *type descriptions* (`Vars<T>`, `Easing`, `AnimationOptions`) remain
accurate, but the file that a reader treats as the authority for "where does this
type live" points at moved files. (Primarily lane a16-a20's concern; flagged here
because it's the canonical Key-Types reference.)

**Proposal (S).** Fold into the S doc-refresh wave alongside the zone-partition
doc sync.

---

## Positives worth preserving (honest ledger)

- **`check:lib` green + `verbatimModuleSyntax`** ⇒ `import type` discipline is
  compiler-enforced, not convention. No finding possible here — it's guaranteed.
- **Both roll-ups self-contained**: value.js is the only external import in each;
  **0** relative-import leaks in either (`dist/keyframes.d.ts`,
  `dist/engine/index.d.ts`). The R.W4b custom plugin's value.js-external handling
  is correct.
- **`./engine` subpath is a real static value mirror** — 39 named exports in
  `dist/engine/index.js`, classes emitted as `declare class` (not type-only), so
  `new KeyframesAnimation()` type-checks from the subpath. R.W4b's design goal met.
- **5.0.0 rename consistent** — no bare `Animation` / `Animation_2` collision
  leftover; `CSSKeyframesAnimation extends KeyframesAnimation` uniformly across
  both roll-ups.
- **`iterationComposite?: never`** (`dist/keyframes.d.ts` AnimationOptions) — a
  typed tripwire that reddens the type-check if a future impl assigns to it
  without landing the gate. Exemplary; keep the pattern.
- **`AnimationOptionError.value: unknown`** — the only `unknown` in a public
  position, and it's *correct* (an error carrying an untyped offending value).
- **`noUncheckedIndexedAccess` honored**: only ~32 non-null assertions across the
  whole library, clustered in justified hot-path spots (`waapi/densify`,
  `svg/morph-svg`, `physics/spring/vector`).

---

## Tranche-S implications (wave-shaped)

**S.Wtype-1 — Generic tightening (mechanical, high-value, low-risk).**
Flip the 11 `= any` defaults to `= Vars` (Finding 1); unify the 6 SVG generics
from `extends Record<string, any>` to `extends Vars = Vars` (Finding 2). Land a
`proof:no-any-default` gate that greps the built `.d.ts`. One PR; `check:lib`
must stay green.

**S.Wtype-2 — Surface trimming.** Introduce `@internal` tagging + an
API-Extractor `publicTrimmedFilePath` as the shipped `types` (Finding 4). This is
the enabling step for a public-surface-diff gate (a private rename should not read
as an API change). Pairs naturally with the planned `compile/`, `engine/css/`
sub-zoning.

**S.Wtype-3 — One roll-up, one gate.** Add `proof:dts-rollups-agree` NOW
(Finding 5) to freeze the current byte-identity; then evaluate collapsing the two
generators to one during the `engine/` sub-zoning. Do NOT let S's deeper zoning
proceed without this gate — sub-zoning is exactly the kind of resolution/`lib`
churn that would silently drift the two pipelines.

**S.Wtype-4 — Kill the zombie (NO-LEGACY).** Resolve `animate.ts` (Finding 6):
restore-as-real-export or delete-with-tests. Given S's SOTA-DX ambitions and the
genre precedent, **restore** is the stronger call — but it must come with a
scene, a barrel/subpath export, and its option types re-typed off `<any>`.
Either way, the tested-but-unreachable middle state must not survive S.

**S.Wtype-5 — value.js dispatch.** File the `PropertyDescriptor` rename against
value.js (Finding 3) so kf's `@property` registry surface stops leaking
`PropertyDescriptor_2`. Coordinate on the constellation cadence; extend the
existing collision-alias gate to catch upstream-sourced `_2` aliases.

**S.Wtype-6 — exactOptional honesty in compile.** Fold the four
`undefined as unknown as V` casts (Finding 7) into the `compile/frame/` carve via
a `FrameUnderConstruction<V>` type. Low urgency; bundle with the sub-zoning wave,
not standalone.

**Chronic/deferral note.** None of these are *new* R regressions — they are
inherited debt R declined to touch (R was a *structural* refactor, not a type
pass). S is the first tranche positioned to own the type surface end-to-end; the
six waves above are the honest fold list.
