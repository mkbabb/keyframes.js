# M.W9 — The value.js Tranche-O consume

- **Band:** C · **Class:** DEV (docs); IMPL opens on authorization AND on the
  HANDOFF firing. **Dep:** **value.js Tranche O 0.14.0 publish** (VJ-L1 flatLeaf
  + VJ-L2 `FunctionValue.toString()` space-join + VJ-L3 `parseCSSSubValue` + §14
  `./math` subpath + the two P0 crash fixes §9 nesting / §13 gradient). This is a
  HANDOFF-gated consume wave: the cure is ONE atomic kf-side commit that executes
  the instant value.js 0.14.0 lands, NOT before. Born-RED kf-side TODAY on
  value.js 0.13.0 — the five value.js-track tripwires red/pending live (verified
  2026-06-17).
- **Gate (born-RED, two gates):**
  - `proof:workaround-deletion` S7 + S8 + S9 — PENDING TODAY (verified live: `0
    GREEN / 5 PENDING / 0 RED`; `S7=PENDING S8=PENDING S9=PENDING`). S7 is the
    `linear()` flat-comma normalize regex (`utils.ts:119,185–203`); S8 is the
    `FN_NAME` Symbol sidechannel (7 hits, `utils.ts:45,47,51,55,218,294,347`); S9
    is the direct `@mkbabb/parse-that` import (`utils.ts:1`). GREEN arm-by-arm on
    the value.js 0.14.0 consume + delete.
  - `proof:boundary` **W96 parse-that-scan** — **AUTHORED HERE, born-RED.** The
    audit (lane-19 §2.8, lane-24 §2.3, viol-M8 in M.md §precept-reckoning) confirms
    the W96 extension was NAMED at `L.W9.md:381` (*"extend `holdsValueJsSpecifier`
    to also catch direct `@mkbabb/parse-that` imports"*) but NEVER implemented:
    `scripts/proof-boundary.mjs`'s `holdsValueJsSpecifier` (`:93–107`) regex
    matches ONLY `@mkbabb/value.js`; the two `parse-that` mentions (`:54`, `:192`)
    are prose-only ("deliberately NOT externalized") — no assertion ever scans
    any source module for a direct parse-that import. The gate-completeness hole
    is the viol-M8 cure: this wave AUTHORS the W96 source-scan assertion, born-RED
    against the live `utils.ts:1` import.
- **Folds (lane #):** lane-19 §2.5/§2.8/§2.14/§4 (the three active value.js-track
  workarounds, the `./math` subpath gap, the M.W-VJO-CONSUME commit shape, the two
  P0 hard-crashes) · lane-24 §1/§2.3/§3.3 (the live-probed §9 nesting + §13 gradient
  crashes, the Option-B parse-that-dep retirement, the two-phase consume) · lane-26
  §3/§4/§5/§6 (the S7/S8/S9 deletion arms, the value.js-track sequencing, the
  per-arm root-defect + delete-trigger).
- **Precept cure:** the three STAGED `inv-L-acyclic-purity` / no-workaround
  violations on the value.js seam (lane-19 §5, lane-26 §7) — S7 (⚠19/⚠20/⚠23 the
  `linear()` regex, a consumer-side correction of value.js's own serializer
  output), S8 (⚠18 the `FN_NAME` Symbol stamped onto a published `ValueUnit` kf
  does not own, re-stamped on every `.clone()`), S9 (⚠24 the direct parse-that
  production dep that breaks the acyclic spine at the `package.json` level). Plus
  the MEDIUM DRY violation §14/viol34 (the inline `lerpArray` copy in `leaves.ts`)
  and the viol-M8 gate-completeness hole. All correctly STAGED (PENDING, not bare
  RED) by the three-state gate model; this wave is the FOLD that discharges them on
  the sibling publish.

---

## Context

M.W8 (the glass-ui track) unblocks the deploy on glass-ui 4.1.0. M.W9 is its
SIBLING on the **value.js track** — the same MW-CONSUME-DELETE shape (lane-26 §6,
§B), the same three-state Band-C lifecycle, but gated on a DIFFERENT sibling cut
(value.js 0.14.0, NOT glass-ui 4.1.0). The two tracks are independent and fire on
separate sibling publishes (lane-26 §6); this wave touches ONLY the value.js-seam
files (`src/animation/utils.ts`, `src/animation/internal/leaves.ts`, `package.json`,
`scripts/proof-boundary.mjs`) and is orthogonal to M.W8's `package.json` pin + `.vue`
demo files.

The L close STAGED three value.js-track workarounds at the consume seam — each a
named `inv-L-acyclic-purity` precept violation that kf cannot cure without writing
value.js's tree (inv-16; lane-19 §5, lane-26 §7). Deleting any of them on today's
0.13.0 tree would break the round-trip (lane-26 §3 impact: a spring's `linear()`
twin would silently re-ingest as `easeInOutCubic`). The three-state gate holds them
PENDING until value.js publishes the root fix; this wave is the consume-edge re-pin
+ delete that flips them GREEN.

**The three workarounds this wave deletes (S7, S8, S9 — verified live this
session).**

- **S7 — the `linear()` flat-comma normalize regex (lane-19 §2.5, lane-26 §3).**
  value.js's `FunctionValue.toString()` (`value.js/src/units/index.ts:184`) joins
  ALL function arguments with `", "`, so a `linear()` whose stops were serialized
  through value.js's OWN stylesheet serializer come back as `linear(0, 0.5, 25%,
  1)` (three stops) instead of the canonical space-joined `linear(0, 0.5 25%, 1)`
  (two stops) — a form its OWN `parseLinearStops` rejects (CSS Easing Level 2 §3: a
  `%` token is only ever a stop's INPUT position, never a standalone output value).
  kf carries the workaround at `src/animation/utils.ts:119` (`LINEAR_PAREN_PREFIX =
  /^\s*linear\s*\(/i`) + `:185–203` (the `.replace(/,\s*(-?[\d.]+%)/g, " $1")`
  normalize block wrapping `parseLinearStops`). The comment at `:186–193` explicitly
  names it *"a value.js 0.12.0 serialize/parse asymmetry"*. This is ⚠19/⚠20/⚠23 —
  a consumer-side correction of a published sibling serializer bug, the most flagrant
  of the three (lane-19 §3 row §5: HIGH).
- **S8 — the `FN_NAME` Symbol sidechannel (lane-19 §2.8, lane-26 §4).**
  `flattenObject`/value.js's `FunctionValue.flatMap` dissolve the `FunctionValue`
  wrapper into bare leaf `ValueUnit`s, dropping the function-token name (`scale`,
  `translateX`, `brightness`, …). The identity-aware arity pad in
  `createInterpVarValue` (`utils.ts:347–366`) must resolve `scale → 1`, `translateX
  → 0px`, `brightness → 1` (not a bare `0`) when the other side carries a function
  kf's side lacks — and it CANNOT know the origin function from a bare `ValueUnit`.
  kf stamps a private Symbol to carry the provenance: `const FN_NAME =
  Symbol("kf.fnName")` (`utils.ts:45`), `type NamedValueUnit = ValueUnit & {
  [FN_NAME]?: string }` (`:47`), `fnNameOf` reader (`:50–51`), `stampFnName` writer
  (`:54–55`). `ValueUnit.clone()` does NOT preserve the stamp, so kf RE-STAMPS on
  every clone (`:64`, `:218`, `:294,298`) and reads it in the arity pad (`:366`).
  This is ⚠18 — writing state onto a published class kf does not own; fragile (drops
  on clone), invisible to value.js's TypeScript surface, the canonical
  "owned-Symbol-on-external-class" anti-pattern (lane-26 §4: HIGH).
- **S9 — the direct `@mkbabb/parse-that` production dep (lane-19 §2.8, lane-24
  §2.3, lane-26 §5).** `src/animation/utils.ts:1`: `import { any as parseAny } from
  "@mkbabb/parse-that"`. This is kf's ONLY production use of parse-that — used at
  `utils.ts:234–245` inside `tryParseLeaves` to compose value.js's OWN parsers
  (`CSSFunction.FunctionArgs` + `CSSValues.Value`) via parse-that's `any` combinator,
  because value.js 0.13.0 exposes NO public `parseCSSSubValue(property, str)`
  entrypoint (verified: `grep "parseCSSSubValue" value.js/src/index.ts` → zero hits,
  lane-19 §2.8). `package.json:211` carries `"@mkbabb/parse-that": "^0.9.0"` as a
  live production dependency. This is ⚠24 — kf reaching through value.js's parser
  abstraction, breaking the acyclic spine (parse-that → value.js → kf → glass-ui) at
  the `package.json` level. The cross-realm nominal-type mismatch is papered with
  `(parseAny as any)` casts (`utils.ts:234,241`); npm dedup makes the runtime
  one-copy, so the cast is a TypeScript-only band-aid (lane-26 §5: HIGH).

**The DRY violation this wave also cures (the `./math` subpath consume — §14,
viol34).** `src/animation/internal/leaves.ts:68–80` inlines a byte-equivalent copy
of value.js's `lerpArray` (`value.js/src/math.ts:60`). The comment at `:56–63`
records the gap explicitly: value.js exposes ONLY its barrel export, so a static
`import { lerpArray } from "@mkbabb/value.js"` here would pull value.js's CSS-grammar
static init into the LIGHT bundle and red `proof:boundary` (the source-grep ban on
ANY static value.js specifier in a light module). value.js O's §14 `./math` subpath
(a tree-shakeable value-free export) severs that constraint: kf swaps the inline copy
for `import { lerpArray } from "@mkbabb/value.js/math"` and stays `proof:boundary`-green
(MEDIUM; lane-19 §2.14, lane-26 §A). The §14 subpath is a HARD precondition — if value.js
0.14.0 ships VJ-L1/L2/L3 but NOT the `./math` subpath, the `lerpArray` swap STAYS held
and only S7/S8/S9 delete (the timing-split, see S4).

**The two P0 crash fixes this wave consumes (§9 nesting + §13 gradient — lane-19
§2.9/§2.13, lane-24 rows 1/5).** value.js 0.13.0 HARD-CRASHES on two Baseline-stable
CSS inputs, both live-probed 2026-06-17:

- **§9 — CSS Nesting THROWS.** `parseCSSStylesheet(".a{color:red; & .b{color:blue}}")`
  → `Parse error at offset 17` (the `&`). Source: `value.js/src/parsing/stylesheet.ts:501`
  — `any(atRule, styleRule)` has NO `nestedRule` arm, and the full-consume check
  (`:503–510`) aborts the WHOLE parse at the `&`. Any kf consumer feeding a stylesheet
  with CSS Nesting (Baseline-2023) to `fromStyleSheets`/`adoptRunning`/`fromString` gets
  a hard parse error.
- **§13 — bare `linear-gradient` THROWS.** `parseCSSValue("linear-gradient(red, blue)")`
  → `TypeError: t is not iterable`. Source: `value.js/src/parsing/index.ts:188–205` — the
  `linearGradient` `.opt()` arm crashes when no direction is present (`linear-gradient(90deg,
  red, blue)` works). Any kf consumer feeding `background: linear-gradient(red, blue)` (the
  most common gradient, Baseline CSS since forever) to the adapter gets a hard TypeError.

Neither P0 is workaroundable at the consume seam without re-implementing value.js's grammar
(inv-L-acyclic-purity forbids it; lane-19 §2.9/§2.13). They are consumed transparently on the
re-pin (value.js O's `nestedRule` production + `.opt()` fix cure the throws); kf's role is the
re-pin + the css-parity gate that ASSERTS the throw is gone. The full `proof:css-parity` gate
authoring + the §9 ingest-walker extension are M.W11's surface (the Band-A gate-first row +
the coordinated grammar close); M.W9 consumes the two crash fixes and re-points the css-parity
nesting + bare-linear-gradient rows from RED to GREEN (lane-24 §3.3 Phase 2).

### The value.js Tranche O substrate this wave rides

value.js is at **0.13.0** (published 2026-06-16). `docs/tranches/O/` does NOT exist
in the value.js tree (lane-19 §1) — value.js's Tranche N closed at 0.13.0; the
post-N successor is unnamed/unopened as of 2026-06-17. The twelve open kf asks are
recorded in `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md` (the L-Band-B dispatch doc).
kf does NOT write value.js's tree (inv-16): the wave numbering + 0.14.0 cut are
value.js's to ship; kf's M role is the consume side ONLY (`^0.13.0 → ^0.14.0`),
never a `file:` pin, `overrides`, or vendored grammar (lane-19 §7.4, lane-24 §4
"No `file:` pin, no `overrides`, no vendored grammar — the constellation spine law
is absolute").

L.W9 authored the born-RED deletion gates (`proof:workaround-deletion` S7/S8/S9);
M.W9 VERIFIES each is still born-RED at M's open (not accidentally GREENed by an L
implementation or a tree-state change — lane-19 §4 M.W-VJO-GATE-LIVE) and AUTHORS
the one gate L.W9 named but did not implement (the W96 parse-that-scan — viol-M8).

### Audit evidence

| Ref | Source location | Fact (verified this session unless noted) |
|-----|-----------------|-------------------------------------------|
| lane-26 §A / lane-19 §4 | `node scripts/proof-workaround-deletion.mjs` | **exit 0**, `0 GREEN / 5 PENDING / 0 RED`; `S7=PENDING S8=PENDING S9=PENDING` — STAGED, not failing (value.js 0.14.0 E404) |
| lane-19 §1 / lane-26 §0 | `npm show @mkbabb/value.js version` / `@0.14.0` | latest `0.13.0`; `0.14.0` → **E404** (the HANDOFF tripwire — unfired) |
| lane-26 §3 (S7) | `grep -n 'LINEAR_PAREN_PREFIX' src/animation/utils.ts` | `:119` (the const) + `:185` (the `.test()` guard) — the normalize block runs `:185–203` |
| lane-19 §2.5 | `src/animation/utils.ts:194–196` | the `.replace(/,\s*(-?[\d.]+%)/g, " $1")` regex; comment `:186–193` names "a value.js 0.12.0 serialize/parse asymmetry" |
| lane-26 §4 (S8) | `grep -n 'FN_NAME\|stampFnName\|fnNameOf\|NamedValueUnit' src/animation/utils.ts` | 7 sites: `:45` (Symbol), `:47` (type), `:50–51` (reader), `:54–55` (writer), `:64`/`:218`/`:294,298` (re-stamps), `:347,366` (arity-pad read) |
| lane-19 §2.8 / lane-26 §5 (S9) | `grep -n '@mkbabb/parse-that' src/animation/utils.ts` | `:1` (`import { any as parseAny }`); usage `:234,241` (`(parseAny as any)(fnArgs, CSSValues.Value)`) |
| lane-26 §5 | `package.json:211` | `"@mkbabb/parse-that": "^0.9.0"` — the live production dep to remove |
| lane-19 §1 | `package.json:212` | `"@mkbabb/value.js": "^0.13.0"` — the pin to bump |
| lane-19 §2.14 / lane-26 §A (§14) | `src/animation/internal/leaves.ts:68–80` | inline `lerpArray` copy; comment `:56–63` records the missing `./math` subpath that forces the duplication |
| viol-M8 / lane-19 §4 | `scripts/proof-boundary.mjs:93–107` (`holdsValueJsSpecifier`) | the regex matches ONLY `@mkbabb\/value\.js(?:\/…)?`; NO parse-that scan exists; `:54`,`:192` mention parse-that in PROSE only — the W96 hole, named `L.W9.md:381`, never implemented |
| L.W9.md:368–381 | `docs/tranches/L/waves/L.W9.md §S9 — proof:boundary extension` | *"`scripts/proof-boundary.mjs` must also scan … for direct `@mkbabb/parse-that` imports and assert zero"* — the NAMED-but-UN-built obligation |
| lane-19 §2.9 / lane-24 row 1 (§9 P0) | live probe 2026-06-17; `value.js/src/parsing/stylesheet.ts:501,503–510` | `parseCSSStylesheet('.a{color:red; & .b{…}}')` → `Parse error at offset 17` (no `nestedRule` arm) |
| lane-19 §2.13 / lane-24 row 5 (§13 P0) | live probe 2026-06-17; `value.js/src/parsing/index.ts:188–205` | `parseCSSValue('linear-gradient(red, blue)')` → `TypeError: t is not iterable` (the `.opt()` direction-optional bug) |
| lane-19 §2.8 | `grep "parseCSSSubValue" value.js/src/index.ts` | ZERO hits — no public sub-value entrypoint at 0.13.0 (the VJ-L3 ask) |
| lane-26 §6 | `node scripts/proof-workaround-deletion.mjs` (Track B) | S7/S8/S9 all gate on the SAME cut (value.js 0.14.0); land in ONE re-pin commit |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they discharge the
three value.js-track STAGED workarounds + the `./math` DRY violation, consume the
two P0 crash fixes, and CLOSE the viol-M8 gate-completeness hole — every move a
consume-edge re-pin or a gate authoring, NONE a kf-local cure (the cures live in
value.js; kf cannot write that tree — inv-16; lane-19 §5).

---

### S1 — Re-pin `@mkbabb/value.js` `^0.13.0` → `^0.14.0` (the Tranche-O consume)

**Breach.** kf pins `"@mkbabb/value.js": "^0.13.0"` (`package.json:212`). The three
active value.js-track workarounds (S7/S8/S9) exist solely because 0.13.0 lacks the
VJ-L1 `flatLeaf` provenance API, the VJ-L2 `FunctionValue.toString()` space-join
fix, and the VJ-L3 `parseCSSSubValue` helper; the two P0 crashes (§9 nesting, §13
gradient) live unfixed; and the `./math` subpath is absent (§14).

**Cure.** On value.js Tranche O publishing 0.14.0 carrying VJ-L1 + VJ-L2 + VJ-L3 +
§14 `./math` + the §9/§13 crash fixes (`KF-TO-VALUEJS-O-ASKS.md §5/§8/§9/§13/§14`),
bump the pin to `^0.14.0` (`package.json:212`) and re-install so the lockfile
resolves the 0.14.0 cut. NO `file:` pin, NO `overrides`, NO vendored grammar
(forbidden — lane-19 §7.4, lane-24 §4).

**Gate bite.** `node scripts/proof-workaround-deletion.mjs` reads the installed
value.js version via the registry probe; on the 0.14.0 re-pin the S7/S8/S9
tripwires flip from PENDING-because-unpublished to RED-because-present (the gate's
three-state model: PRESENT + PUBLISHED = TRULY RED — the sibling fixed the root, kf
has not yet consumed). S2/S3/S4 then flip each arm to GREEN by deleting the
workaround. Today: S7/S8/S9 PENDING (verified; 0.14.0 E404).

---

### S2 — Delete the `linear()` flat-comma normalize regex (S7 arm — VJ-L2 consumed)

**Breach.** `FunctionValue.toString()` emits `linear()` stops as a flat comma list
(`linear(0, 0.5, 25%, 1)`) that value.js's own `parseLinearStops` rejects; kf folds
`, <number>%` → ` <number>%` with a regex before calling `parseLinearStops`
(`utils.ts:119,185–203`) — a consume-seam correction of value.js's OWN serializer
output (⚠19/⚠20/⚠23; the cure is in `value.js/src/units/index.ts:184`; kf cannot
write it — inv-16; lane-26 §3).

**Cure.** On the 0.14.0 consume (VJ-L2 — `FunctionValue.toString()` emits
space-separated positional arguments for `linear()` stops + `scroll()` positional
args), delete:
1. `src/animation/utils.ts:119` (`LINEAR_PAREN_PREFIX` const — dead after the block goes).
2. `src/animation/utils.ts:185–203` (the `LINEAR_PAREN_PREFIX.test(...)` guard + the
   `.replace(/,\s*(-?[\d.]+%)/g, " $1")` normalize + the `try/catch` wrapping
   `parseLinearStops`).
3. Restore the direct `cssLinear(parseLinearStops(timingFunction))` call — value.js's
   space-joined output now feeds `parseLinearStops` unmodified.

**Constraint (the round-trip is the real observable — lane-26 §3).** The deletion is
correct ONLY after VJ-L2 lands: deleting on 0.13.0 makes the spring `linear()` twin
emitted by `springLinearStops` fail to re-ingest through `getTimingFunction` (it
silently defaults to `easeInOutCubic` instead of the authored spring curve — a SILENT
round-trip breach, NOT a throw). `proof:roundtrip-easing` (`test/roundtrip-easing.test.ts`)
must add a `linear()` stops round-trip arm exercising the EXACT serializer → parser path
WITHOUT the regex normalization (RED today on 0.13.0 — the un-normalized form is rejected;
GREEN after VJ-L2). This is the inv-M-observable-truth bite: the gate asserts the actual
re-ingest curve equality, not merely the absence of the regex constant.

**Gate bite.** `proof:workaround-deletion` S7 arm asserts zero `LINEAR_PAREN_PREFIX`
pattern in `src/animation/utils.ts` (`proof-workaround-deletion.mjs` S7). Today:
PENDING (PRESENT + value.js 0.14.0 E404). After VJ-L2 publish + delete: GREEN.

---

### S3 — Delete the `FN_NAME` Symbol sidechannel (S8 arm — VJ-L1 flatLeaf consumed)

**Breach.** kf stamps a private `FN_NAME` Symbol onto published `ValueUnit`
instances to carry the flatten-origin function name (`utils.ts:45–57`), re-stamped
on every `.clone()` (`:64,218,294,298`) because `ValueUnit.clone()` drops it; the
arity pad reads it (`:347,366`). This is writing state onto a class kf does not own
(⚠18; the provenance belongs in value.js's flatten API; kf cannot write it — inv-16;
lane-26 §4).

**Cure.** On the 0.14.0 consume (VJ-L1 — a first-class `flatLeaf(valueUnit,
provenance?: { fnName })` constructor or a typed `FlatLeaf` sub-class that preserves
the flatten-origin function name through `.clone()`), delete:
1. `const FN_NAME = Symbol("kf.fnName")` (`:45`), `type NamedValueUnit` (`:47`),
   `fnNameOf` (`:50–51`), `stampFnName` (`:54–55`).
2. Replace the `stampFnName(v.clone(), fnName ?? fnNameOf(v))` call-sites
   (`:64,218,294,298`) with the value.js first-class construction API
   (`flatLeaf(v, { fnName })` or equivalent).
3. Replace `fnNameOf(counterLeaf)` (`:366`) with the first-class `.fnName` field read.

**Constraint (the arity pad is the real observable — lane-26 §4).** The deletion is
correct ONLY after VJ-L1 lands: the `FN_NAME` stamp is the ONLY channel by which
`createInterpVarValue`'s arity pad knows `scale → 1` / `translateX → 0px` /
`brightness → 1` when the opposing side carries a function kf's side lacks. Deleting
the Symbol WITHOUT the first-class provenance replacement makes the pad resolve a bare
`0` (a WRONG identity → a wrong interpolated matrix → a wrong frame). The
`proof:interpolate-anything` / `proof:replay-equality` arity-pad fixture (a
`transform: scale(2)` vs an absent-scale opposing keyframe) must stay GREEN through the
deletion — the gate asserts the PADDED identity value, the genuine observable, not the
Symbol's presence.

**Gate bite.** `proof:workaround-deletion` S8 arm asserts zero
`FN_NAME|Symbol\("kf\.` pattern in `src/animation/utils.ts` (the recurrence-resistant
form: any NEW Symbol stamped onto a published value.js class with the `kf.` prefix also
REDs the arm — `proof-workaround-deletion.mjs` S8). Today: PENDING (PRESENT + value.js
0.14.0 E404). After VJ-L1 publish + delete: GREEN.

---

### S4 — Delete the direct `@mkbabb/parse-that` dep (S9 arm — VJ-L3 parseCSSSubValue consumed) + swap the inline `lerpArray` for `@mkbabb/value.js/math` (§14)

**Breach (S9).** `src/animation/utils.ts:1` imports `{ any as parseAny }` from
`@mkbabb/parse-that`; `package.json:211` carries it as a production dep. `tryParseLeaves`
(`utils.ts:227–246`) uses `(parseAny as any)(fnArgs, CSSValues.Value)` to compose
value.js's OWN parsers because 0.13.0 exposes no public sub-value entrypoint. This breaks
the acyclic spine at the `package.json` level (⚠24; the composition belongs in value.js;
kf cannot write it — inv-16; lane-24 §2.3, lane-26 §5).

**Breach (§14).** `src/animation/internal/leaves.ts:68–80` inlines a byte-equivalent
`lerpArray` copy because value.js 0.13.0 has no tree-shakeable `./math` subpath — a static
`import { lerpArray } from "@mkbabb/value.js"` would pull value.js's CSS-grammar static init
into the LIGHT bundle and red `proof:boundary` (viol34 / DRY; lane-19 §2.14).

**Cure.** On the 0.14.0 consume:
1. **S9.** Delete `src/animation/utils.ts:1` (`import { any as parseAny } from
   "@mkbabb/parse-that"`); replace `(parseAny as any)(fnArgs, CSSValues.Value)` in
   `tryParseLeaves` (`:234,241`) with `parseCSSSubValue(childKey, strValue)` (VJ-L3,
   the value.js root-export helper); remove `"@mkbabb/parse-that"` from
   `package.json:211` `dependencies` (it remains a `devDependency` ONLY if the test
   suite still needs it directly; else removed entirely).
2. **§14.** Delete the inline `lerpArray` body (`leaves.ts:68–80`) + the gap comment
   (`:56–63`); replace with `import { lerpArray } from "@mkbabb/value.js/math"` — the
   value-free `./math` subpath value.js O §14 ships. Re-run the parity test that
   asserts the imported `lerpArray` is byte-identical to the former inline copy.

**Constraint (the §14 swap is BOUNDARY-gated — lane-19 §2.14, the CLAUDE.md boundary
law).** The `lerpArray` import lands in `leaves.ts`, a LIGHT module. The swap is correct
ONLY if `@mkbabb/value.js/math` is a value.js-FREE subpath (no CSS-grammar static init
edge) — else it reds `proof:boundary`. If value.js O ships VJ-L1/L2/L3 but NOT the §14
`./math` subpath, this §14 swap STAYS held (the inline copy survives, only S9 deletes);
the §14 consume re-arms on a later value.js cut that ships the subpath (the timing-split).
`proof:boundary` (extended per S5) is the regression-lock: it must stay GREEN — a
non-value-free `./math` import reds the source-grep assertion.

**Constraint (parse-that becomes transitive-only — lane-26 §5).** After S9, kf carries
ZERO direct parse-that imports; parse-that remains a dependency ONLY transitively through
value.js. The constellation spine is then truly acyclic at the published-API level
(parse-that → value.js → kf; no kf → parse-that edge). S5's W96 source-scan is the gate
that LOCKS this — any future re-introduction of a direct parse-that import reds it.

**Gate bite.** `proof:workaround-deletion` S9 arm asserts zero `from "@mkbabb/parse-that"`
pattern in `src/animation/utils.ts`. Today: PENDING (PRESENT + value.js 0.14.0 E404). After
VJ-L3 publish + delete: GREEN. (The §14 `lerpArray` swap is gated by `proof:boundary`, not
a workaround-deletion arm — there is no S-arm for the DRY copy; the bite is the boundary
gate staying green AND the parity test asserting byte-equality.)

---

### S5 — AUTHOR the `proof:boundary` W96 parse-that source-scan (the viol-M8 cure — born-RED on today's tree)

**Breach (viol-M8 / gate-completeness — verified live this session).** L.W9.md:368–381
NAMED the `proof:boundary` extension: *"`scripts/proof-boundary.mjs` must also scan …
for direct `@mkbabb/parse-that` imports and assert zero (`holdsValueJsSpecifier` already
covers `@mkbabb/value.js`; extend the same pattern to `@mkbabb/parse-that`)."* It was
NEVER implemented: `holdsValueJsSpecifier` (`scripts/proof-boundary.mjs:93–107`) regex
matches ONLY `@mkbabb\/value\.js(?:\/[^"']*)?`; the two `parse-that` mentions (`:54`,
`:192`) are PROSE-only ("value.js + parse-that are deliberately NOT externalized") — no
assertion ever scans any kf source module for a direct parse-that import. The named gate
is a placeholder masquerading as wiring — the exact viol-M8 / inv-M-observable-truth shape
the M charter (M.md §precept-reckoning ⚠M8) names as the M.W9 cure.

**Cure (AUTHOR the gate, born-RED FIRST — the gate-first law, before any S4 deletion).**
Extend `scripts/proof-boundary.mjs` with a NEW assertion that scans every kf source module
for a direct `@mkbabb/parse-that` import-specifier and asserts zero hits. The scan must be
the IMPORT TRUTH, not a basename allowlist (mirroring `holdsValueJsSpecifier`'s discipline):
add a `holdsParseThatSpecifier(src)` companion (the same `(?:import|export)\b…from
["']@mkbabb\/parse-that(?:\/…)?["']` + bare side-effect-import regex, with `import type`
stripped first), and run it over the SAME real module sets the existing assertions derive
(never a hand-maintained name list). `package.json` already wires `proof:boundary` into
`proof:hygiene` (`:43,190`); no new script entry is needed — the assertion is added to the
EXISTING gate.

**The REAL observable (inv-M-observable-truth) — the gate is born-RED against the LIVE
import, not a proxy.** The viol that the L.W1 S4 gate committed (testing a proxy — no-throw
+ string round-trip — while the real breach was NaN frame-times) MUST NOT recur here. The
born-RED witness is the GENUINE defect: with the assertion added and `utils.ts:1`'s
`import { any as parseAny } from "@mkbabb/parse-that"` STILL present, `node
scripts/proof-boundary.mjs` exits 1 naming `src/animation/utils.ts` as holding a direct
parse-that specifier. This is NOT a stand-in: the gate reads the real `utils.ts` source and
the real reachable-module set; the RED is the actual `inv-L-acyclic-purity` violation, live
on today's tree. The gate GREENs ONLY when S4 deletes the import (the same publish + consume
that flips the S9 workaround-deletion arm).

**Two-witness sequencing (the gate must bite BEFORE the cure — gate-first).**
1. **Born-RED witness (today, 0.13.0):** add the `holdsParseThatSpecifier` assertion;
   run `node scripts/proof-boundary.mjs` → **exit 1**, naming `utils.ts` (the live import).
   Record the RED as the named oracle.
2. **GREEN witness (after value.js 0.14.0 + S4):** with `utils.ts:1` deleted, the same
   gate run → exit 0; the assertion holds zero direct parse-that specifiers across the
   reachable kf source set.

The gate also catches the recurrence (Bite): any future kf module re-importing parse-that
directly reds the assertion before the publish includes the transitive dep in the tarball.

**Gate bite.** `node scripts/proof-boundary.mjs` (extended) → exit 1 on today's tree
(the `utils.ts:1` import is held); exit 0 after S4 deletes it. The arm is the W96
source-scan — authored HERE (viol-M8 closed), not in L.

---

### S6 — Verify the value.js-track gates are still born-RED at M-open + consume the §9/§13 P0 crashes; trace the full consume chain (the round-trip RE-observed)

**Deliverable (gate-liveness — lane-19 §4 M.W-VJO-GATE-LIVE).** Before the consume,
VERIFY each value.js-track gate is still born-RED/PENDING at M's open (not accidentally
GREENed by an L implementation, a tree-state change, or a try-catch that suppresses the
adapter parse):
- `proof:workaround-deletion` S7/S8/S9 — confirm STILL PENDING (PRESENT + value.js
  0.14.0 E404), `node scripts/proof-workaround-deletion.mjs` → `S7=PENDING S8=PENDING
  S9=PENDING` (verified this session).
- `proof:css-parity` nesting + bare-linear-gradient rows (M.W11-owned gate) — confirm
  STILL RED on 0.13.0 (the §9/§13 throws bite live), NOT suppressed by an adapter
  try-catch wrapper. (M.W9 does NOT author `proof:css-parity` — that is M.W11 Band-A;
  M.W9 CONSUMES the §9/§13 fixes and re-points those rows RED → GREEN.)

**Deliverable (the atomic consume — lane-19 §4 M.W-VJO-CONSUME, lane-26 §B Track B).**
S1+S2+S3+S4 land in ONE atomic commit (the timing-split exceptions in S2/S4 apply only if
value.js ships VJ-L1/L2/L3 across sub-patches or omits the §14 subpath). The commit then
drives the FULL consume chain, each link OBSERVED, not assumed:

1. `node scripts/proof-workaround-deletion.mjs` → S7 + S8 + S9 arms GREEN (`5 GREEN / 0
   PENDING / 0 RED` if the glass-ui-track arms S1/S2 have also landed via M.W8; otherwise
   `3 GREEN (S7,S8,S9) / 2 PENDING (S1,S2) / 0 RED`).
2. `node scripts/proof-boundary.mjs` (extended per S5) → exit 0 — zero direct
   `@mkbabb/parse-that` specifier across the reachable kf source set; the §14 `lerpArray`
   import from `@mkbabb/value.js/math` carries no value.js value-edge into the LIGHT bundle.
3. `node scripts/proof-css-parity.mjs` (M.W11's gate) → the nesting row asserts
   `parseCSSStylesheet` of a `&`-containing input SUCCEEDS (no `Parse error at offset 17`);
   the bare-linear-gradient row asserts `parseCSSValue("linear-gradient(red, blue)")` does
   NOT throw `t is not iterable` AND yields a valid `FunctionValue` shape — both rows flip
   RED → GREEN on the §9/§13 consume.
4. `test/roundtrip-easing.test.ts` `linear()` un-normalized arm → GREEN (S2's observable);
   the `proof:interpolate-anything` arity-pad fixture → GREEN (S3's observable).
5. `npm run proof:all` → full local roster GREEN (the value.js-track arms discharged).

**Constraint (the inv-ε / inv-M-observable-truth round-trip oracle — no overclaim).** The
consume is "observed" ONLY when (a) the three workaround-deletion arms read GREEN against
the live re-pinned tree, (b) the W96 source-scan reads exit 0 against the real deleted
import, and (c) the §9/§13 css-parity rows are shown SUCCEEDING against the INSTALLED 0.14.0
parser (a real `parseCSSStylesheet`/`parseCSSValue` invocation, never a source grep or a
mock — lane-24 §3.2). A green `proof:workaround-deletion` alone is NOT the consume claim:
its three-state model exits 0 BOTH when PENDING and when GREEN, so the version-probe must
confirm the 0.14.0 cut is installed (PRESENT + PUBLISHED, then ABSENT-because-deleted). The
wave's DONE condition is the live-parser equality of the §9/§13 rows + the three arms GREEN,
each cited as an oracle (the REAL observable is the installed parser's behaviour + the deleted
source, not a gate exit code that a PENDING state also produces).

**Gate bite.** This clause is the integration of S1–S5 — its "RED today" is the WHOLE
value.js seam being held: `proof:workaround-deletion` S7/S8/S9 PENDING (the three live
workarounds), `proof:boundary` W96 scan exit 1 once authored (the live `utils.ts:1` import),
the §9/§13 css-parity rows RED (the live crashes). After the consume commit on the 0.14.0
publish, every arm flips and the installed parser no longer throws.

---

## Born-RED gate

**Gates:** `proof:workaround-deletion` S7 + S8 + S9 arms (EXISTING —
`scripts/proof-workaround-deletion.mjs`; this wave is the delete that flips all three
GREEN) AND `proof:boundary` **W96 parse-that-scan** (AUTHORED HERE — `scripts/proof-boundary.mjs`
gains the `holdsParseThatSpecifier` assertion; this is the viol-M8 cure, born-RED on
today's tree). The workaround-deletion apparatus already exists and is verified biting
TODAY; the boundary W96 arm is the one NEW assertion this wave authors — gate-first, born-RED,
BEFORE the S4 deletion.

**The REAL observable (inv-M-observable-truth).** Each gate bites the GENUINE defect,
verified live this session — NOT a proxy (the L.W1 S4 lesson):

| Gate / clause | Witness on today's tree (value.js 0.13.0) | Failure mode today (the REAL observable) | Expected after the 0.14.0 consume |
|---------------|-------------------------------------------|------------------------------------------|-----------------------------------|
| S2 `proof:workaround-deletion` S7 arm | `grep -n 'LINEAR_PAREN_PREFIX' src/animation/utils.ts` → `:119,185` | PENDING (PRESENT + value.js 0.14.0 E404); the spring `linear()` twin round-trips ONLY because the regex re-normalizes value.js's flat-comma serializer output — delete it on 0.13.0 and the curve silently degrades to `easeInOutCubic` (a round-trip breach, the genuine observable `proof:roundtrip-easing` asserts) | S7 arm GREEN — zero `LINEAR_PAREN_PREFIX`; VJ-L2's space-joined output feeds `parseLinearStops` unmodified |
| S3 `proof:workaround-deletion` S8 arm | `grep -n 'FN_NAME\|Symbol("kf\.' src/animation/utils.ts` → 7 hits | PENDING (PRESENT + value.js 0.14.0 E404); the arity pad reads `scale → 1`/`translateX → 0px` ONLY via the `FN_NAME` stamp — delete it without VJ-L1 provenance and the pad resolves a bare `0` (a wrong matrix → a wrong frame, the genuine observable `proof:interpolate-anything` asserts) | S8 arm GREEN — zero `FN_NAME`; VJ-L1 `flatLeaf` carries the provenance through `.clone()` |
| S4 `proof:workaround-deletion` S9 arm | `grep -n '@mkbabb/parse-that' src/animation/utils.ts` → `:1` | PENDING (PRESENT + value.js 0.14.0 E404); the direct parse-that dep breaks the acyclic spine at `package.json` — `tryParseLeaves` composes value.js's parsers via parse-that's `any` because 0.13.0 has no `parseCSSSubValue` (the genuine observable: `grep parseCSSSubValue value.js/src/index.ts` → zero) | S9 arm GREEN — zero `from "@mkbabb/parse-that"`; VJ-L3 `parseCSSSubValue` is called instead; the dep removed from `package.json` |
| S5 `proof:boundary` W96 scan | `node scripts/proof-boundary.mjs` (extended) | **exit 1** naming `src/animation/utils.ts` — the gate reads the REAL source + reachable-module set and finds the live `import { any as parseAny } from "@mkbabb/parse-that"`; this is the genuine `inv-L-acyclic-purity` violation, not a proxy (and proves viol-M8: the named-but-unbuilt gate now BITES) | exit 0 — zero direct parse-that specifier across the reachable kf source set (after S4 deletes `utils.ts:1`) |
| S6 the §9/§13 P0 consume | `node -e "import('@mkbabb/value.js').then(v => v.parseCSSStylesheet('.a{color:red; & .b{color:blue}}'))"` → THROWS `Parse error at offset 17`; `parseCSSValue('linear-gradient(red, blue)')` → THROWS `TypeError: t is not iterable` (both live-probed 2026-06-17) | the installed 0.13.0 parser HARD-CRASHES on Baseline CSS; `proof:css-parity` nesting + bare-linear-gradient rows RED (M.W11's gate, biting the real throws) | the installed 0.14.0 parser SUCCEEDS on both inputs (no throw, valid AST shape); the css-parity rows flip RED → GREEN |

**Born-RED kf-side TODAY (the keystone).** This wave's gates are BORN-RED on today's tree
against value.js 0.13.0 — verified this session: `proof:workaround-deletion` S7/S8/S9 are
PENDING (PRESENT, awaiting the 0.14.0 publish; `node scripts/proof-workaround-deletion.mjs`
→ `0 GREEN / 5 PENDING / 0 RED`), and the W96 boundary scan — once AUTHORED per S5 — exits 1
naming the live `utils.ts:1` parse-that import. The RED/PENDING is the GENUINE defect (the
three live workarounds, the live acyclic-spine breach, the two live P0 parser crashes), not
a proxy for it. There is NO source-shape stand-in that misses the real observable: the
deletion gate greps the real `utils.ts` sources, the boundary gate reads the real reachable
module set + real import truth, and the §9/§13 consume is asserted against the INSTALLED
parser's live behaviour (the L.W1 S4 NaN-frame miss is explicitly NOT repeated — every gate
bites the failure mode that ACTUALLY breaks).

**Green condition.** value.js Tranche O publishes 0.14.0 with VJ-L1 `flatLeaf` + VJ-L2
`FunctionValue.toString()` space-join + VJ-L3 `parseCSSSubValue` + §14 `./math` subpath +
the §9 nesting `nestedRule` production + the §13 bare-linear-gradient `.opt()` fix; kf re-pins
`^0.14.0` (S1), deletes the `linear()` regex (S2), deletes the `FN_NAME` Symbol (S3), deletes
the direct parse-that import + swaps the `lerpArray` for `@mkbabb/value.js/math` (S4), all in
one atomic commit; the W96 boundary scan (authored S5) flips exit 1 → exit 0;
`proof:workaround-deletion` S7+S8+S9 → GREEN; the §9/§13 css-parity rows (M.W11) flip RED →
GREEN against the installed 0.14.0 parser (S6 — the live-parser oracle, no overclaim).

---

## Dependencies

- **value.js Tranche O 0.14.0 publish — THE blocking HANDOFF.** This wave is a PURE-WAIT
  HANDOFF on the kf side: kf cannot write value.js source (inv-16), so kf cannot publish
  the cure. The triggering event is EXTERNAL (value.js Tranche O). The 0.14.0 cut must carry:
  VJ-L1 `flatLeaf` (retires S8), VJ-L2 `FunctionValue.toString()` space-join (retires S7),
  VJ-L3 `parseCSSSubValue` (retires S9), §14 `./math` subpath (retires the `lerpArray` DRY
  copy), the §9 nesting `nestedRule` production (cures the THROW), the §13 bare-linear-gradient
  `.opt()` fix (cures the TypeError) — `KF-TO-VALUEJS-O-ASKS.md §5/§8/§9/§13/§14`. Registry
  state verified this session: `npm show @mkbabb/value.js version` → `0.13.0`;
  `@mkbabb/value.js@0.14.0` → **E404** (unfired). The M wave is short (one atomic commit +
  the S5 gate authoring + gate runs) and executes the instant the HANDOFF fires (lane-19 §4
  M.W-VJO-CONSUME).
- **The §14 `./math` subpath is a sub-precondition (timing-split).** If value.js 0.14.0 ships
  VJ-L1/L2/L3 but NOT the §14 subpath, S2/S3/S4-S9 land (the three workarounds delete) but the
  S4-§14 `lerpArray` swap STAYS held (the inline copy survives, `proof:boundary`-green). The
  §14 consume re-arms on a later value.js cut that ships the subpath. The atomic-single-commit
  form is the common case; the split is the honest fallback (lane-19 §2.14).
- **Independent of the glass-ui track (M.W8).** No file collision: M.W9 touches
  `package.json` (the value.js pin + the parse-that dep removal), `src/animation/utils.ts`
  (S7/S8/S9 deletes), `src/animation/internal/leaves.ts` (the §14 swap), and
  `scripts/proof-boundary.mjs` (the S5 W96 arm). M.W8 touches the glass-ui pin + `.vue` demo
  files. The two tracks fire on SEPARATE sibling publishes (value.js 0.14.0 vs glass-ui 4.1.0)
  and can land in either order (lane-26 §6). The `proof:workaround-deletion` ledger reaches
  `5 GREEN / 0 PENDING / 0 RED` only when BOTH tracks have consumed.
- **Coordinates with M.W11 (the css-parity frontier).** M.W11 AUTHORS `proof:css-parity`
  (Band-A, the §9/§13 rows born-RED against 0.13.0) + extends the ingest walker for the §9
  typed recursive bodies; M.W9 CONSUMES the §9/§13 crash fixes on the re-pin and re-points
  the nesting + bare-linear-gradient rows RED → GREEN. M.W9 does NOT author `proof:css-parity`
  (that is M.W11's surface); it consumes the same value.js 0.14.0 cut M.W11's Phase-2 close
  rides (lane-24 §3.3). The two waves SHARE the value.js 0.14.0 HANDOFF; their kf-side surfaces
  are disjoint (M.W9: `utils.ts`/`leaves.ts`/`proof-boundary.mjs`; M.W11: `proof-css-parity.mjs`/
  the adapter ingest walker).
- **Independent of every Band-A/Band-B wave.** Does NOT touch the gate apparatus (M.W1–W4)
  or the kf-internal compile/ingest correctness surfaces (M.W5–W7). It composes with M.W1's
  report-all runner (the S7/S8/S9 PENDING + the W96 RED are reported alongside other arms in
  one pass) but does not require it.
- **Couples to M.WZ (the close).** The value.js-track arms of `proof:chronic-closure`
  (DL-L10 / DL-L23 the constellation-workaround sweep) FOLD GREEN on this consume; M.WZ's
  `proof:chronic-closure` re-pointed L→M reads them discharged. The 5.0.0 version cut +
  npm publish are USER-DOMAIN and INDEPENDENT of this consume.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 value.js re-pin | The value.js seam reverts to 0.13.0 — the three workarounds re-arm, the two P0 crashes re-open; any consumer feeding nested CSS or a bare gradient to the adapter hard-crashes again |
| S2 linear() regex delete | The `LINEAR_PAREN_PREFIX` regex (or a NEW normalize step in a different form) survives past VJ-L2 — the gate's `LINEAR_PAREN_PREFIX`-shaped scan catches a re-introduced consumer-side correction of value.js's serializer; OR an early delete on 0.13.0 silently degrades the spring `linear()` round-trip to `easeInOutCubic` (caught by `proof:roundtrip-easing`'s un-normalized arm) |
| S3 FN_NAME delete | A NEW private Symbol stamped onto a published value.js class (the `Symbol("kf.` recurrence) — the gate's broader pattern scan reds it; OR an early delete makes the arity pad resolve a bare `0` (a wrong interpolated matrix), caught by `proof:interpolate-anything` |
| S4 parse-that delete + lerpArray swap | A future import re-adding `@mkbabb/parse-that` to a production module after the dep is removed — caught by the workaround-deletion S9 arm AND the S5 boundary scan before it reaches npm; OR a `@mkbabb/value.js/math` import that drags a value.js value-edge into the LIGHT bundle — caught by `proof:boundary`'s source-grep |
| S5 W96 boundary scan | A new kf module importing `parse-that` directly (the inv-L-acyclic-purity boundary violation) — the AUTHORED W96 assertion catches it before the publish includes the transitive dep in the tarball; the viol-M8 gate-completeness hole stays CLOSED (the named gate now actually bites) |
| S6 the §9/§13 consume + round-trip oracle | A "green local proof:all" mistaken for a consumed Tranche-O fix — the inv-ε / inv-M-observable-truth overclaim (the workaround-deletion three-state exits 0 BOTH when PENDING and when GREEN, so a version-probe + live-parser assertion is required); OR a value.js 0.14.x regression that re-introduces the §9/§13 throw — caught by `proof:css-parity` re-running against the installed parser |

---

## Excluded from this wave

- **The glass-ui-track workarounds S1/S2** (the `aria-orientation` suppress, the
  `pointerHandled`/`onPlayPointerDown` dock interim) — gated on glass-ui 4.1.0, NOT value.js
  0.14.0; that is M.W8 (lane-26 §6 Track A). M.W9 is the value.js track ONLY (S7/S8/S9 arms +
  the §14 swap + the W96 gate). The two tracks are independent and fire on separate sibling
  publishes (lane-26 §6).
- **The `proof:css-parity` gate authoring + the §9 ingest-walker extension** — M.W11's
  Band-A surface (the §9/§13 rows born-RED against 0.13.0 + the coordinated grammar close +
  the adapter recursion into typed `kind:"container"`/`kind:"layer"` bodies). M.W9 CONSUMES
  the §9/§13 crash fixes and re-points the existing rows; it does NOT write the gate or the
  walker (lane-24 §3.3 / §4 M.W(valuejs-O) vs M.W(css-parity-gate)).
- **The remaining nine value.js asks** (§1 comma-list, §2 transform axis, §3 color()/var(),
  §4 @property typed syntax, §6 partial-input honesty, §7 VJ.L1–L8 perf, §10 transition
  shorthand, §11 playState, §12 invalid-keyframe diagnostic) — correctness/enhancement asks
  with NO active kf workaround to delete (lane-19 §3 summary table: "NONE" in the workaround
  column). They are consumed transparently via the re-pin (correctness) or tracked as separate
  born-RED arms (the §7 perf bench is M.W12; the §1/§2/§3 replay-equality arms ride
  `proof:replay-equality`). M.W9 deletes ONLY the three workarounds + the DRY copy whose root
  fixes land in the 0.14.0 cut.
- **The value.js Tranche O wave numbering / 0.14.0 cut** — value.js's to ship (inv-16; lane-19
  §7.4). `docs/tranches/O/` does not exist in value.js's tree as of 2026-06-17; the
  authoritative kf outbound ask set is `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`. kf's M role
  is the consume side ONLY — never a `file:` pin, `overrides`, or vendored grammar.
- **The 5.0.0 version cut + npm publish** — USER-DOMAIN, INDEPENDENT of this consume. This
  wave discharges the value.js-seam workarounds; the registry publish (release.yml on a
  `v*.*.*` tag) is a separate, owner-driven action.
