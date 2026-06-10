# Lane: parsing/units layer + the value.js seam — deep audit (Tranche J prep)

Date 2026-06-09 · branch master @ `4072af9` (HEAD == master; clean tree but for untracked `docs/tranches/J/`).
Installed `@mkbabb/value.js@0.11.2`, `@mkbabb/parse-that@0.9.0` (`npm ls`).

> **READ THIS FIRST — the lane premise is obsolete.** The assigned scope (`src/parsing/**`,
> `src/units/**`, `src/easing.ts`, `src/math.ts`, `src/utils.ts`, `src/units/normalize.ts`) **does
> not exist in the tree.** Every one of those files was DELETED in `58e7576` (`refactor(lib): delete
> keyframes.js shim files; relocate format.ts`, 2026-04-17) — **161 commits before master tip**
> (`git rev-list --count 58e7576..master` = 161). `src/` today is `src/animation/**` + `src/env.d.ts`
> ONLY (`find src -type f`). The barrel re-export architecture the brief asks me to evaluate "gestalt
> vs legacy indirection" was already resolved — the gestalt answer ("consumers import value.js
> directly, no barrel surface") was ADOPTED. The live lane concerns relocated to
> `src/animation/format.ts`, `src/animation/frame-compiler.ts`, `src/animation/utils.ts`,
> `src/animation/internal/leaves.ts`. I audit those.

---

## SEAM-0 (P0) — root `CLAUDE.md` describes a DELETED architecture (stale-docs precept violation)

The repo-root `CLAUDE.md` (presented to every agent as authoritative project instructions) documents
the barrel architecture deleted in `58e7576`. This is a direct "NO legacy code / NO stale docs"
precept breach, and it actively mis-directs (it sent THIS lane to audit non-existent files).

| `CLAUDE.md` line | Claim | Tree reality |
|---|---|---|
| 30–35 | `src/parsing/` (keyframes.ts, format.ts, units.ts, utils.ts, index.ts) | DELETED `58e7576`. `format.ts` relocated → `src/animation/format.ts`. |
| 36–46 | `src/units/` incl. `color/` re-export barrels + `normalize.ts` (LOCAL) | DELETED `58e7576`. All now value.js-owned; no kf-local normalize exists. |
| 47–49 | `src/easing.ts`, `src/math.ts`, `src/utils.ts` re-export barrels | DELETED `58e7576`. |
| 28 | `src/animation/index.ts` = "Animation, CSSKeyframesAnimation classes" | FALSE — those live in `engine.ts`; `index.ts` is the light barrel + `loadAnimationEngine()` dynamic boundary (see `src/animation/CLAUDE.md`). |
| 63 | "test/ — 15 files, 261 tests" | `ls test/*.test.ts | wc -l` = **69 files**. |
| 80–83 | "bench/ — 3 files" | `ls bench/` = **8 files** (compile, computed-real-dom, interp-buffer, interpolation, parser, playwright, spring-tick, sync-step). |
| 99 | "Most of `src/` is thin re-export barrels over value.js" | FALSE — barrels deleted; `src/` is ONLY `src/animation/`. |
| 101–102 | "Local logic … `src/parsing/keyframes.ts`, `src/units/normalize.ts`" | Both DELETED. |
| 110 | "Memoization via … local `memoizeDecorator`" | DELETED `58e7576` ("memoizeDecorator: confirmed unused, deleted along with src/utils.ts"). |
| 97 | "parse-that — Parser combinators for @keyframes grammar" | The @keyframes grammar was delegated to value.js (`a8ea154`); parse-that is reached ONLY via a cross-realm `any` cast in `utils.ts:247-260`. |

`demo/CLAUDE.md:126` is also stale: lists `balls/` as using `parseCSSKeyframes()` — that export was
deleted; the live call (`demo/.../timeline/utils/timelineEngine.ts:13`) is a local inline adapter
`resolveKeyframes(input).keyframes`.

**Disposition FOLD (P0).** J must rewrite root `CLAUDE.md` (+ the demo doc line) to the current
tree. The accurate per-module doc already exists (`src/animation/CLAUDE.md` — current, detailed,
documents the light/heavy boundary); root `CLAUDE.md` must be reconciled to it. Note: `src/parsing/CLAUDE.md`
and `src/units/CLAUDE.md` (referenced at root lines 30/36) are themselves gone (`58e7576` stat).

---

## SEAM-1 (P1) — the B1/H-A2 empty-selector guard is NOT total

`frame-compiler.ts:163` guards ONLY `start.trim() === ""`. A **non-empty but invalid** keyframe
selector sails past the guard into `parseCSSValueUnit(start)` (`frame-compiler.ts:171`) and throws
the cryptic, un-typed value.js error — the exact crash class B1/CH-5 claims killed.

Probe (`CSSKeyframesAnimation.fromKeyframes` through the public API, tsx over `src/animation/engine.ts`):

```
"abc"     -> Error : Parse error at offset 0: "...abc..."          (cryptic value.js throw — NOT typed)
"xyz"     -> Error : Parse error at offset 0: "...xyz..."          (cryptic)
"garbage" -> Error : Parse error at offset 0: "...garbage..."      (cryptic)
"5px"     -> compiled OK                                            (a length silently accepted as a selector)
""        -> AnimationOptionError : "a keyframe selector must be …" (typed — the only caught case)
```

The guard's own comment (`frame-compiler.ts:160`) says it turns the cryptic throw "into a clear,
typed AnimationOptionError so a malformed selector is named, not cryptic" — but it only does so for
the blank case. `test/w0-crashes.test.ts` asserts `""` and `"   "` only; it never tests a non-empty
garbage selector, so the gap is uncovered.

**Disposition FOLD (P1).** Widen the guard at `frame-compiler.ts` to validate the selector against
the percentage/keyword grammar BEFORE `parseCSSValueUnit`, throwing the typed `AnimationOptionError`
for any non-conforming selector (incl. lengths like `5px`). Add the non-empty-garbage rows to
`w0-crashes.test.ts`. This is the totality the B1 close claimed but did not deliver.

---

## SEAM-2 (P1) — the value.js empty-input contract has NO kf-side pin → a value.js regression will NOT red here

The I close (FINAL.md §4-A) declares `parseCSSValueUnit("") → ValueUnit(0)` **LOAD-BEARING**:
rebuilding `dist` on value.js 0.11.1 (no empty-input fix) reds `proof:engine-no-throw-on-play`. I
re-verified the contract holds in the installed 0.11.2:

```
node -e (import parseCSSValueUnit from @mkbabb/value.js):
  ""    -> OK value=0 unit=undefined     (typed-empty — the fix)
  "   " -> OK value=0 unit=undefined     (typed-empty)
  "50%" -> OK value=50 unit="%"
  "abc" -> THREW: Parse error at offset 0: "...abc..."   (non-empty garbage still throws — see SEAM-1)
```

But **no kf-side test exercises `parseCSSValueUnit("")` directly** (`grep -rn parseCSSValueUnit test/`
returns ONLY a comment in `w0-crashes.test.ts:14`). The kf guard (SEAM-1) short-circuits empty input
BEFORE value.js sees it, so `w0-crashes.test.ts` proves the GUARD, not the value.js contract. If a
future value.js publishes a regression on empty input, the failure would surface only on the live
`proof:engine-no-throw-on-play` runtime gate (which depends on a built dist + a var() animation
mounting empty) — fragile and indirect, not a focused unit pin.

**Disposition FOLD (P1).** Add a 3-line kf-side contract test asserting
`parseCSSValueUnit("")` and `parseCSSValueUnit("   ")` return a typed-empty `ValueUnit` (value 0, no
throw) — the `leaves-parity.test.ts` precedent (a kf test that locks kf's CONSUMPTION of a value.js
property). This makes a value.js empty-input regression red HERE, fast, named.

---

## SEAM-3 (P2/BOOK) — serialize-from-template (I.W0) round-trips var/calc/matrix3d, but the corpus does NOT cover them

`format.ts:145-194` (I.W0 S2) serializes from `animation.parsedVars[i]` (declared, unresolved)
rather than a DOM-resolving `at(progress)` sample — so `var()`/`matrix3d` round-trip verbatim and
never reach the empty-read-back parse throw. **I verified the claim holds** (tsx probe through
`format.ts`):

```
var():     0%{transform:translateX(var(--x))} 100%{…(var(--y))}      -> reparse OK
calc():    0%{width:calc(100% - 20px)} 100%{width:calc(50% + 10px)}  -> reparse OK
matrix3d:  matrix3d(1,0,0,0,…,1) -> matrix3d(1, 0, 0, 0, …, 1)        -> reparse OK
```

But `test/fixtures/keyframes/manifest.json` (the `proof:roundtrip-fidelity` corpus) has **NO
fixture for `var()`, `calc()`, or `matrix3d()`** — the 13 fixtures cover transforms (multiarg),
filters, colors, box/drop-shadow, per-kf easing, property-block. The format.ts comment
(`format.ts:152`) explicitly claims var()/matrix3d round-trip verbatim — but that claim is
test-unprotected; a future serializer or value.js regression on these classes would not red.

**Disposition BOOK→FOLD (P2).** Add `var-calc.css` + `matrix3d.css` byte-round-trip fixtures to the
corpus. Cheap, closes the gap between the format.ts claim and its test.

---

## SEAM-4 (P1) — `rotate()` shorthand does NOT round-trip (value.js transform-normalization bleed)

`transform: rotate(45deg)` (a 2D, Z-only rotation) is serialized as
`transform: rotateX(45deg) rotateY(45deg) rotateZ(45deg)` — three independent axis rotations, a
**different transform**. Origin is value.js's flatten/parse: `a.parsedVars[1]` for `rotate(45deg)`
has keys `['transform.rotateX','transform.rotateY','transform.rotateZ']` (tsx probe over
`engine.ts`). kf's serializer faithfully re-emits the (wrong) expanded keys.

The `proof:roundtrip-fidelity` test would NOT catch this even with a fixture, because the
**divergence is self-consistent**: re-parsing the expanded form re-expands identically, so
`midpointSig(before) === midpointSig(after)` passes VACUOUSLY (tsx probe: "midpoint stable: YES").
The user's AUTHORED `rotate(45deg)` silently becomes a wrong transform in the editor pane, but the
byte-same midpoint check is blind to it. This is the gate-ORACLE failure mode (a test that passes
without the product property holding) reproduced for the serializer surface.

**Disposition value.js-HANDOFF (P1) + kf-test FOLD.** The expansion is a value.js
`rotate`/`rotateX|Y|Z` shorthand-normalization decision; fixing it is value.js-side (the
next-slice). kf-side: add an AUTHORED-vs-SERIALIZED byte-identity assertion (not just
midpoint-stable) for at least `rotate()` so the divergence is falsifiable HERE and the HANDOFF has a
witness. Cross-ref the round-trip-fidelity RECORD style (the chromatic-color epsilon row already
documents one value.js round-trip artifact in the same corpus).

---

## SEAM-5 (P2) — `proof:roundtrip-fidelity` is HYGIENE-tier, but the serializer is a human-checked surface

`proof:roundtrip-fidelity` and `proof:roundtrip-easing` are in `proof:hygiene`, NOT
`proof:correctness` (`node -e` over package.json: `in correctness: false / in hygiene: true`). The
serializer's output is exactly what a human reads in the live keyframes editor pane (the bottom-bar
CSS readout, `useKeyframesParsing.ts` → `CSSKeyframesToString`). Per the I-born gate-ORACLE precept,
a correctness gate's oracle must be the product property a human checks through the human's surface.
The round-trip corpus is a unit-level proxy (`fromString → format → reparse`), never the live editor
pane on a built dist. Combined with SEAM-4 (the vacuous-pass blind spot), the serializer has no
correctness-tier oracle. This is precisely the gate-blindspot class Tranche I existed to close,
persisting for the serializer.

**Disposition BOOK (measure-first).** J should decide whether the serializer warrants a
`proof:correctness`-tier live-editor gate (open keyframes pane on the built dist, assert the readout
is the round-trippable authored CSS). Measure first: does `proof:live-session` already exercise the
keyframes pane readout? If not, this is a real correctness-tier gap.

---

## SEAM-6 (P2/BOOK) — the trailing regex fixup in `CSSKeyframesToString` is unexplained defensive code

`format.ts:193`: `out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}")` strips `({ … })` wrapping
from the formatted output. No comment explains WHICH formatCSS/prettier artifact produces the
`({…})` shape it cleans. My probes (var/calc/matrix3d/transform/filter) never triggered it
(`contains '({' : false` in every case). This is either (a) dead defensive code (a precept "no
workaround / no dead code" smell) or (b) load-bearing for an untested input shape.

**Disposition BOOK (measure-first).** J: instrument or git-blame the regex to find the originating
input class. If unreproducible, delete it (and add the input that justified it as a fixture if one
exists). Do not delete blind — it may guard a real prettier nesting artifact.

---

## SEAM-7 (RECORD) — `serializeEasing` is correctly fail-explicit; no try/catch floor remains

`format.ts:30-45` (`serializeEasing`) THROWS `AnimationOptionError` for a custom closure easing with
no `.css` twin — the prior `?? "linear"` silent contract-mask is GONE (`grep` confirms no
`?? "linear"` and no try/catch in format.ts). The H.W0 "try/catch floor (a custom placeholder)"
described in `w0-crashes.test.ts:9` NO LONGER exists in format.ts — it was replaced by the throw.
The lane question "(c) any remaining try/catch floors that mis-attribute?" — **answer: none in
format.ts.** This is an honest improvement.

Caveat (RECORD, not a finding): the demo caller `useKeyframesParsing.ts` does NOT wrap
`CSSKeyframesToString` in try/catch, so a custom-closure easing reaching the serializer would
propagate the throw to the editor. The W0 fix routed all demo easings through string twins
(cubic-bezier()/steps()/linear()), so this is unreachable in the demo today — but it is an
undefended seam if a future demo path passes a bare closure. Lower priority than SEAM-1/2.

---

## SEAM-8 (RECORD) — the light/heavy value.js boundary is sound and gated

The current architecture (replacing the deleted barrels) is the `index.ts` light/heavy boundary
(`src/animation/CLAUDE.md`): light interpolators carry ZERO static value.js edge; the heavy parsing
engine (`engine.ts`) is reached only via `await loadAnimationEngine()` dynamic import. Gated by
`proof:boundary`. The value.js-free leaf copies (`internal/leaves.ts`, VJ-8's shadow) have a parity
gate (`test/leaves-parity.test.ts`) that catches drift from value.js `clamp`/`scale`/`lerp`. No
dangling imports of the deleted barrels anywhere (`grep -rn '@src/parsing|@src/units|@src/easing|@src/math'`
in src/demo/test = NONE). Configs clean (no stale aliases; `@src/*` → `./src/*` only). **The
architectural transposition is complete and consistent** — lane question (a) is already answered in
the tree (gestalt adopted, indirection gone). No J action on the architecture itself; only the DOCS
lag it (SEAM-0).

---

## SEAM-9 (BOOK) — the value.js next-slice + parse-that packrat HANDOFFs (lane question e — exactly what's booked, where)

Authoritative booking: `docs/tranches/I/audit/recap-deferred.md §2` (the value.js next-slice
charter) + `§4 PT-1` (packrat) + `I/FINAL.md §6` (lines 195-197: "value.js next-slice, parse-that
packrat … CHRONIC-by-design or sibling-HANDOFF, gate-first, NOT an I wave"). All ride the next
re-pin through the `lerpValue` seam with ZERO kf edit. **I RE-VERIFIED each against the installed
0.11.2** (the recap recorded status against 0.11.1; J must re-confirm none silently closed):

| id | item | status in **0.11.2** (re-verified `node -e`) | J disposition |
|---|---|---|---|
| VJ-1 (E1/E2) | `linear()`/`steps()` PARSER → `LinearStop[]` | OPEN — `parseLinearStops === undefined`. kf ships the shim (`utils.ts:99-106` `parseLinearStops` local). | value.js-HANDOFF (OPEN) + kf-RETIRE shim on land. |
| VJ-2 (VJ-F1) | path sampler `getPointAtLength` (`fromMorphSVG`) | OPEN — `getPointAtLength === undefined`. | value.js-HANDOFF + kf BOOK. Sequence value.js first. |
| VJ-3 (F2/F2b) | `currentColor`/`light-dark()`/`contrast-color()` | OPEN — `parseCSSColor('light-dark(#fff,#000))')` THROWS. | value.js-HANDOFF (HIGH for currentColor/light-dark). |
| VJ-4 (MCI-5) | identity-aware fn-arity pad | OPEN — the `it.fails` witness (`test/interpolate-anything.test.ts:226`) IS the consume signal. | value.js-HANDOFF; no kf gate owed (witness flips RED on land). |
| VJ-5 (VJ-F2) | structured parse-error SINK + `tryParse furthest` | OPEN. Cross-ref B1: a real diagnostics channel would surface the empty/garbage parse cleanly (SEAM-1). | value.js-HANDOFF (HIGH) + kf BOOK (`ResolvedKeyframes.diagnostics`). |
| VJ-6 (VJ-F4) | buffer-reusing `unflattenObjectToString(flat, out?)` | OPEN — arity is 1 (allocating form only). | value.js-HANDOFF; ZERO kf edit on consume. |
| VJ-7 (F3) | bounded LRU on value.js result cache | OPEN — no `maxCacheSize`/`setMaxCacheSize` export. | value.js-HANDOFF; bound lives ONCE in value.js (DRY). |
| VJ-8 (F6) | parser-free easing + leaf-math sub-path | OPEN. | value.js-HANDOFF + paired kf FOLD (delete `internal/leaves.ts` shadow on land). |
| VJ-9 (LD-PT-2) | value.js re-pins its OWN parse-that `^0.8.2→^0.9.0` (realm convergence) | OPEN. The cross-realm `any` cast (`utils.ts:247-260`) is the live symptom — dual node_modules realms make `Parser<T>` nominally distinct, forcing `as any`. | value.js-HANDOFF; the hard PREDECESSOR of a clean parse-that bump. |
| PT-1 (LD-PT-1/PT-4) | parse-that `(id,offset)` packrat re-key | WITHHELD. `packrat.ts:61,82` id-only `MEMO.get(p.id)` (recorded `H/…handoff §PT-1`). Isolated opt-in BBNF left-recursion; ZERO production consumers; NEITHER kf NOR value.js default path hits packrat. | parse-that-HANDOFF (internal soundness). Author `proof:packrat-position` FIRST, THEN re-key. **NOT a kf fold, blocks nothing.** |
| PT-2 (PT-3b) | parse-that span-first core unification | BOOK — dedicated parse-that tranche. | parse-that-HANDOFF (BOOK). Not a kf fold. |

**Disposition for J: VERIFY-ONLY + carry.** None of VJ-1…9 / PT-1/2 is a J kf wave (they ride the
re-pin / are sibling-owned). J's only obligation: when the next value.js re-pin lands, run the
consume-edge (the `it.fails` witnesses + `parseLinearStops`/`getPointAtLength`/LRU presence checks
above) and RETIRE the corresponding kf shims (VJ-1 `utils.ts` linear/steps parser, VJ-8
`internal/leaves.ts`). The VJ-9 cross-realm `any` cast and PT-1 packrat re-key are the two with the
clearest "do it now if a parse-that tranche opens" character.

---

## Summary table (J-actionable)

| id | sev | title | disposition |
|---|---|---|---|
| SEAM-0 | P0 | root CLAUDE.md documents the deleted barrel architecture | FOLD |
| SEAM-1 | P1 | B1/H-A2 empty-selector guard not total (non-empty garbage still cryptic-throws) | FOLD |
| SEAM-2 | P1 | value.js empty-input contract has no kf-side pin | FOLD |
| SEAM-4 | P1 | `rotate()` shorthand doesn't round-trip (value.js bleed; vacuous-pass test) | value.js-HANDOFF + kf-test FOLD |
| SEAM-3 | P2 | round-trip corpus lacks var()/calc()/matrix3d() fixtures | FOLD |
| SEAM-5 | P2 | `proof:roundtrip-fidelity` is hygiene-tier; serializer has no correctness oracle | BOOK |
| SEAM-6 | P2 | unexplained trailing regex fixup in CSSKeyframesToString | BOOK |
| SEAM-7 | — | serializeEasing fail-explicit; no try/catch floor (lane q-c answered: none) | RECORD |
| SEAM-8 | — | light/heavy value.js boundary sound + gated (lane q-a answered) | RECORD |
| SEAM-9 | BOOK | value.js next-slice (VJ-1..9) + parse-that packrat (PT-1/2) re-verified OPEN in 0.11.2 | VERIFY-ONLY |
