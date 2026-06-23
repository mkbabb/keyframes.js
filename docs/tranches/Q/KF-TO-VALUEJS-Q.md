# keyframes.js → value.js Tranche Q (1.1.1 + 1.2.0) — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-23 at the keyframes **Tranche Q** development phase (the
> no-deferral terminal tranche — `docs/tranches/Q/Q.md`). value.js is the UPSTREAM
> library on the constellation spine (**parse-that → value.js → keyframes.js → glass-ui**).
> This **supersedes and extends** the P dispatch (`docs/tranches/P/KF-TO-VALUEJS-P.md`,
> which shipped at **1.1.0**: VJ-L3 `parseCSSSubValue` consumed [kf S9 closed], VJ-P1
> `color2Into` shipped only the OKLCH→XYZ hub leg [84→37 allocs — the egress-wrapper
> SECOND HALF was DROPPED], VJ-L1 demoted-to-spike, VJ-P2 dropped). Tranche Q
> RE-OPENS the dropped halves under the owner's **library-LEADS-the-platform** +
> **NO-deferral** directives. This is the formal handoff to value.js's **Tranche Q** session.
>
> **inv-16 holds: no value.js source is written from keyframes.js.** value.js's Q
> session schedules these ASKs into its own waves; kf re-pins and consumes on each
> publish. Publish-then-consume, DAG-ordered, never cross-write.

This dispatch is the binding cross-repo contract behind kf wave **Q.WG2** (the value.js
publish ask) + **Q.WG4** (the kf GATED consume). value.js Q sequences **AFTER parse-that
Q** (`KF-TO-PARSETHAT-Q.md` — it re-pins parse-that `^0.13.0`) and **BEFORE keyframes Q**
(the consumer). The version SPLIT: **1.1.1 PATCH** (the `contrast-color()` library-LEADS
catch-up — the ONE platform-parity gap) **then 1.2.0 MINOR** (the perf color-arch
out-param family + `if()` multibranch + VJ-L1 `flatLeaf .fnName` + the `/math` subpath +
the dashed-call parse arm). The 1.1.1 catch-up is consumed transparently by kf's existing
`^1.1.0` caret; the 1.2.0 minor requires an explicit kf `^1.2.0` re-pin (Q.WG4) so the
consume edges are observable (B6-crossrepo-versions: the caret would land 1.2.0 silently).

---

## The ASK roster (1.1.1 platform-parity + 1.2.0 perf/grammar/provenance)

> **Sibling-anchor verification (2026-06-23).** Every `file:line` anchor in this dispatch
> was re-confirmed against the LIVE value.js source tree
> (`/Users/mkbabb/Programming/value.js/src/`). The AUDIT-31 anchors held EXCEPT two
> corrections re-verified line-exact this pass: **(1)** the `contrast-color()` L6-stub
> anchor — the dead `colorContrast` rule PROPER is `css-color.bbnf:98-101` (`colorContrast =`
> at `:98`, body through `:101`), with its leading comment at `:95-97`; the full no-legacy
> delete-block is `:95-101` (comment + rule). The rule is REFERENCED at `css-color.bbnf:134`
> (`color = colorMix | colorContrast | … `, VERIFIED) — so VJ-Q1 S3's delete must remove BOTH
> the `:95-101` block AND the line-134 alternative or it leaves a dangling grammar reference
> (the `.bbnf` is a doc-grammar, not parser-compiled, so the delete is parse-path-inert either
> way — but a half-delete is a no-legacy residual). **(2)** the `ValueUnit` ctor anchor —
> the 6-positional ctor is `units/index.ts:26` (NOT `:36`, an AUDIT-31 typo); `clone()` at
> `:120` copies 5 fields (`fnName` would be the 7th positional). All other anchors are tagged
> VERIFIED inline.

| # | ASK | value.js surface (file:line, grounded in AUDIT-31 + VERIFIED 2026-06-23) | proposed API / mechanism | kf consume-seam it serves | born-RED gate | ver |
|---|-----|---------------------------------------------------|--------------------------|---------------------------|---------------|-----|
| **VJ-Q.W0** | **reconcile the P record + commit any untracked docs** to CLOSED-as-built | the value.js P record likely still reads DEVELOPMENT on a shipped 1.1.0 tranche (the stale-header class, B7-honesty-record); `tranche-p` published `v1.1.0` (NOT master) | reconcile the P PROGRESS header to CLOSED with per-wave SHIPPED status; merge `tranche-p → master` (the Q.WA3 partner) | n/a (value.js record hygiene; the durable-anchor precondition) | `proof:progress-honesty` (value.js-side): the P PROGRESS header is not `DEVELOPMENT` while `v1.1.0` is tagged | — |
| **VJ-Q1** *(library-LEADS — the ONE platform gap)* | **`contrast-color(<color>)` L7 eager-evaluation** (Baseline April 2026) + retire the dead legacy `color-contrast()` L6 stub | `parsing/color.ts` has ZERO contrast handling (grep `contrast` → ZERO — VERIFIED; it parses only as an opaque `FunctionValue`); the dead stub `grammars/css-color.bbnf:98-101` (rule) + `:95-97` (comment) (VERIFIED — `colorContrast = "color-contrast" << "(", color , "vs" , color …` at `:98`, never-shipped CSS Color L6, NOT wired into `color.ts` dispatch [`colorContrast` grep in `color.ts` → ZERO, VERIFIED] — BUT referenced at `css-color.bbnf:134` `color = colorMix | colorContrast | …`, VERIFIED) | (S1) a NET-NEW WCAG leaf (`wcagRelativeLuminance` + `wcagContrastRatio` — sRGB relative-luminance, NOT the OKLab-lightness `computeSafeAccent`); (S2) a `contrast-color()` `FunctionValue` arm eagerly evaluated to ONE `Color` (the `color-mix()` combinator template, `color.ts:449-499` — VERIFIED `colorMix` lives at `:449`); (S3) DELETE the dead `color-contrast()` L6 stub — the `:95-101` block (comment + rule) AND the `:134` alternative | kf inherits the resolved `Color` transparently; the Phase-2 resolve pass (Q.WB1) can lower `if(...)` over a `contrast-color()` value | value.js `proof:contrast-color` (born-RED): `parseCSSValue('contrast-color(red)')` is a concrete `Color` (today: an opaque `FunctionValue`); the dead L6 stub is gone | **1.1.1** |
| **VJ-Q2** *(the color-arch out-param family — the DROPPED VJ-P1 second half)* | **the egress-converter out-param family** — `xyz2rgbFamilyInto` / `xyz2displayP3Into` / `xyz2rec2020Into` / `getXyzFromIntoFn`, driving gamut 37 → <12 allocs/call | `color/dispatch.ts:272-277` (VERIFIED — inside `color2Into` at `:230`, the OKLCH fast path's `const fromXYZFn = getXyzFromFn<C>(to)` at `:272` + `const egress = fromXYZFn(xyz) …` at `:276` `return new DisplayP3Color(...)` per-step egress-wrapper boxing; ~28 of the residual 37 allocs); `matrix.ts:34` `transformMat3Into` (VERIFIED — `export function transformMat3Into(v, m, out)`, the aliasing-safe scratch precedent) | add `xyz2rgbFamilyInto(xyz, fromXyzMatrix, transferEncode, out: Color)` using `transformMat3Into` into a module `Vec3` + `setChannel` writes (zero new); route `gamutMapToRgbSpace`'s 24-step loop + the 9 hub-intermediates through a caller-owned (NEVER source-aliased) egress scratch | kf's rAF wide-gamut color interpolation rides value.js's egress path; the GC win is inherited transparently (no kf API change) | value.js `proof:gamut-alloc` with `N_TARGET` lowered 40→<12 (born-RED at 37; C3-epsilon bit-stable golden via `color-into.test.ts`) | **1.2.0** |
| **VJ-Q3** *(the secondary color out-params — B5-valuejs-arch)* | **`mixColorsInto` + `sampleColorRampAt` + the structural-clone transposition** — the per-call array+spread allocs + the O(stops) ramp rebuild + the reflective `clone()` | `dispatch.ts:577-605` (VERIFIED — `mixColors` allocs `resultComponents:number[]` at `:577` + `keys.filter()` at `:569` + variadic-spread `new ResultClass(...resultComponents, resultAlpha)` at `:605` — a monomorphic-ctor megamorphic-spread deopt); kf `compile-color.ts:196-199` (`sampleColorRamp(...,1024,...)` INSIDE the inner ΔE loop); `src/utils.ts:7-22` (VERIFIED — value.js TOP-LEVEL `src/utils.ts`, NOT `units/utils.ts`; `clone()` via `Object.entries().map().reduce()` — three array allocs/level, the engine of `ValueUnit`/`FunctionValue.clone`) | `mixColorsInto(c1,c2,p1,p2,space,hue,out)` (kill the arrays + the spread); `sampleColorRampAt(from,to,t,opts)` (a single-`t` perceptual sampler, array-free) so kf hoists the 1024-ramp OUT of the inner loop; a DIRECT structural `clone()` short-circuit | kf's `compile-color.ts` densify hoists the ramp; `lerpColorValue` rides the faster mix; every kf `ValueUnit.clone()` (the flatten/restamp hot path) gets cheaper | value.js `proof:mix-alloc` (NEW, the `CountingColor` shim) + `proof:ramp-at-equiv` (`sampleColorRampAt(a,b,i/(n-1)) === sampleColorRamp(a,b,n)[i]` bit-exact) + `proof:clone-alloc` (NEW) | **1.2.0** |
| **VJ-Q4** *(VJ-L1 `flatLeaf .fnName` — the S8 TERMINAL)* | **`fnName?: string` on `ValueUnit`**, `clone()`-preserved, populated by `flattenObject` from the enclosing `FunctionValue.name` | `units/index.ts:120-130` (VERIFIED — `clone()` at `:120` copies `value`/`unit`/`superType`/`subProperty`/`property` [the 5-field copy, `:121-127` — `targets` is NOT copied either] — and NOT `fnName`; the ctor at `:26` is 6-positional `value,unit?,superType?,subProperty?,property?,targets?`, so `fnName` is the 7th); `src/units/utils.ts:85,92` (VERIFIED — `flattenObject` declared at `:85`, the `FunctionValue` branch at `:92`; the non-calc path at `:106` recurses `obj.values` without propagating `obj.name` onto the leaf at `:132`) | an optional 7th ctor field `fnName?: string` (the O-anchored minimal form) OR a `meta` record; `clone()` preserves it; `flattenObject` sets it from `obj.name` on each leaf | kf's S8 WeakMap `FN_NAME_MAP` + the clone-restamp ceremony (`utils.ts:52,55,59,287,341`) is RETIRED — `fnNameOf(u)` reads `u.fnName` directly; the identity-pad reads `counterLeaf.fnName` | value.js: a vitest asserting `new ValueUnit(2,'',…,'scale').fnName==='scale'` survives `clone()`; kf-side `proof:workaround-deletion` S8 flips PENDING→GREEN | **1.2.0** |
| **VJ-Q5** *(the `/math` tree-shakeable subpath — the leaves-externalize enabler)* | **confirm + hold the `@mkbabb/value.js/math` subpath's `parse-that`-FREE contract** across the 1.2.0 publish | `dist/subpaths/math.d.ts` (VERIFIED — SHIPS today: re-exports `clamp, scale, lerp, lerpArray, logerp, deCasteljau, cubicBezier, interpBezier, cubicBezierToSVG, cubicBezierToString` from `../math`; the `parse-that-FREE` docstring is present [`math.d.ts:2`]; the built `math.js` is a 292-byte entry importing ONE `../math-*.js` chunk — 2 modules, 0 grammar, 0 parse-that; the exact graph-byte figure is a value.js-side measurement) | KEEP the `/math` subpath grammar-free across 1.2.0; document the contract (the boundary-clearance kf's W97 clause VERIFIES) | kf's Q.WE2 leaves-externalize Arm A DELETES the `internal/leaves.ts` math duplicates + re-exports from `@mkbabb/value.js/math` | value.js `proof:subpath-graph` (or confirm via the published `math.d.ts`): the `/math` static graph contains ZERO grammar/parse-that modules | **1.2.0** (contract) |
| **VJ-Q6** *(the dashed-call parse arm — the @function enabler)* | **`--ident(args)` parses to `FunctionValue('--ident', [arg0, …])`** + expose the `<syntax>` validator on the resolve path | the dashed-function CALL site drops a verbatim string today (the call is NOT a `FunctionValue`); `extractFunctions` (the @function DEFINITION registry) ALREADY ships (1.1.0); the `<syntax>` validator drives `@property` but is not confirmed exposed for resolve-path consumption | a `--ident(args)` parse arm emitting `FunctionValue('--ident', [args])`; CONFIRM the `@property` `<syntax>` validator is a public/resolve-consumable export | kf's Q.WB2 @function call-inlining binds the descriptor params to the call args + coerces each through the `<syntax>` validator (NO re-authored checker) | value.js round-trip: `parseCSSValue('--double(2, 3px)')` is a `FunctionValue('--double', [2, 3px])` (today: drops/verbatim); `'<syntax>' validator exported` | **1.2.0** |
| **VJ-Q7** *(`if()` multibranch — the lossy-collapse fix)* | **emit the FULL ordered clause list** instead of first-consequent + first-else | `parsing/index.ts:336-348` (VERIFIED — the `.map((body) => {…})` collapse callback: `splitIfClauses(body)` at `:337` → `.find(c => c.condition !== null)` first-consequent + `.find(c => c.condition === null)` first-else at `:338-339`, emitting the lossy 2-branch `FunctionValue("if", [cond, value, else])` at `:343-347`; `handleIf` itself declared at `:310`); `splitIfClauses` at `:255-295` (VERIFIED — already computes the FULL ordered `clauses` array) | use the already-computed `clauses` array in `handleIf` (the producer change is ~3 lines — the array exists) | kf's Q.WB2/Q.WD2 `resolveIf` (`resolve-values.ts:334-367`, today hard-coding the 2-branch `[cond, consequent, else]` triple with the self-documenting deferral comment at `:330-332`) generalizes to N-branch | value.js round-trip: `parseCSSValue('if(media(...): 1px; supports(...): 2px; else: 3px)')` emits a 3-branch ordered clause list (today: collapses to 2) | **1.2.0** |
| **VJ-Q8** *(the `ColorChannelPlan` — the SoA color-tail enabler, GATED partner)* | **a Float64 oklab-channel layout** the kf compositor folds the permanently-boxed color tail through | kf `group.ts` `buildSoAPlans` classifies any color/computed leaf BOXED (a `Color` cannot live in a `Float64Array`) — the residual SoA tail (`B1-kf-soa`) | a `ColorChannelPlan` (a `(Color → channel offsets)` plan) + `lerpColorChannels(t, startBuf, stopBuf, outBuf)` fold the compositor + `processFrame` route the color tail through | kf's Q.WB3-color SoA folds the color leaves through the published plan instead of per-element `Color` boxing | value.js: a plan-build + `lerpColorChannels` bit-exact vs per-element `Color` lerp; kf-side `proof:color-soa` greens on the consume | **1.2.0** |
| **VJ-Q9** *(CSS serialization fidelity — the Q.WD2 grammar-fuzz tripwire's GATED exit)* | **none-channel + `color()`-wrapper round-trip fidelity** — serialize a powerless `none` channel verbatim (NOT `NaN`) + preserve the `color(<space> …)` wrapper | LIVE breaches on 1.1.0 (probe-confirmed 2026-06-23, `Q.WD2`): `parseCSSValue('oklch(0.6 none 200)')` → `"oklch(0.6 NaN 200)"` (none→NaN); `parseCSSValue('color(display-p3 1 0 0)')` → `"display-p3(1 0 0)"` (wrapper-loss) | (S1) serialize a `<percentage>`/`<number>`-or-`none` powerless channel as `none`, never `NaN`; (S2) preserve the `color(<space> …)` function wrapper on round-trip | kf's Q.WD2 `proof:grammar-fuzz` none-channel + wrapper-loss expected-failure tripwires auto-flip PENDING→GREEN on the `^1.2.0` re-pin (Q.WG4) | value.js `proof:serialize-fidelity` (born-RED): `parseCSSValue('oklch(0.6 none 200)').toString() === 'oklch(0.6 none 200)'` AND `parseCSSValue('color(display-p3 1 0 0)').toString() === 'color(display-p3 1 0 0)'` | **1.2.0** |

All asks are **BC-additive** to value.js's published 1.x surface: VJ-Q1 (1.1.1) is a new
`contrast-color()` arm + a dead-stub delete (no consumer of the never-shipped L6 stub);
the 1.2.0 family is additive out-params, an additive `fnName` field, an additive grammar
arm, a producer-shape fix (the `if()` collapse was lossy, not contractual), and a new
plan surface. No breaking change.

---

## VJ-Q1 — `contrast-color()` L7 (the library-LEADS catch-up — the ONE platform gap)

> **AUDIT verdict (`B1-valuejs-cssgaps` + `B5-valuejs-arch`): the higher-value gap.**
> `contrast-color()` parses ONLY as an opaque verbatim `FunctionValue` today (`color.ts`
> has ZERO contrast handling), leaving the library BEHIND a Baseline-April-2026 feature
> for the FIRST time — inverting the owner's "library leads, browsers catch up" precept.
> It also drags a NO-LEGACY violation (the dead, unwired `color-contrast()` L6 stub).

**The NAMING ground truth (the anchor correction, VERIFIED 2026-06-23).**
`grammars/css-color.bbnf` defines `colorContrast = "color-contrast" << "(", color ,
"vs" , color , ("," , color)* , ("to" , …)? << ")"` — the rule PROPER is `:98-101`
(`colorContrast =` at `:98`, the body through `:101`), preceded by its leading comment
`:95-97`; the dead-stub delete-block is the full `:95-101` span (comment + rule). It is
the never-shipped **CSS Color L6**
legacy `color-contrast()` (the `vs <color>+` list form). It is NOT the new
`contrast-color()` (**CSS Color L7**, Baseline April 2026, the `contrast-color(<color>)`
single-arg form). The L7 function is genuinely ABSENT (`grep contrast-color` → ZERO,
VERIFIED). VJ-Q1 adds the L7 arm AND retires the dead L6 stub atomically.

**The dangling-reference correction (NEW, the no-legacy completeness fix).** The dead
`colorContrast` rule is REFERENCED by the grammar's top-level `color` rule
(`css-color.bbnf:134`: `color = colorMix | colorContrast | lightDark | colorFn | …` —
VERIFIED). So S3's delete must remove the `:95-101` block (comment `:95-97` + rule `:98-101`)
AND the `:134` alternative, else the grammar carries a dangling non-terminal. The `.bbnf` is a STRUCTURAL reference grammar,
NOT parser-compiled (the live parser is hand-rolled combinators in `color.ts`; the ONLY
in-`src/` reference to `css-color.bbnf` is `parsing/CLAUDE.md:38` documentation — VERIFIED),
so the delete is parse-path-inert; but the dangling reference is a real no-legacy residual
the no-deferral mandate requires closing in the SAME edit.

**The cure (three S-clauses, the no-legacy cleanup atomic with the new arm).**
- **S1 — author a clean WCAG leaf FIRST.** `wcagRelativeLuminance(color)` +
  `wcagContrastRatio(a, b)` — sRGB relative-luminance per WCAG 2.x (the `0.2126 R +
  0.7152 G + 0.0722 B` linearized form). This must NOT reuse the existing
  `units/color/contrast.ts` `computeSafeAccent`/`safeAccentColor` (OKLab-LIGHTNESS-distance,
  `DEFAULT_MIN_CONTRAST=0.35` in OKLab L) — that is a DIFFERENT metric and would pick the
  wrong black/white near the contrast boundary (the FRICTION the lane named).
- **S2 — the `contrast-color()` arm.** A `FunctionValue('contrast-color', [color])` arm
  eagerly evaluated to ONE concrete `Color` (the maximally-contrasting of black/white per
  the WCAG ratio), mirroring the `color-mix()` combinator (`color.ts:449-499`, a complete
  gated eager-FunctionValue→Color template).
- **S3 — DELETE the dead L6 stub.** Remove `grammars/css-color.bbnf:95-101` (the `:95-97`
  comment + the `:98-101` rule) AND the `colorContrast` alternative in the `color` rule at
  `:134` (the dangling-reference correction above). It is not wired into `color.ts`'s combinator dispatch (grep
  `colorContrast` in `color.ts` → ZERO, VERIFIED) and never shipped — a stale-grammar
  no-legacy violation.

**The friction the wave pre-empts (the momentary parse-shape gap).** Retiring the dead
L6 stub in the SAME wave as adding the L7 arm risks a momentary state where a
`color-contrast(a vs b)` input that previously parsed (as an opaque `FunctionValue`)
stops parsing. PRE-EMPT: the L6 stub was never WIRED (it does not change today's parse —
the live parser is hand-rolled combinators in `color.ts`, the `.bbnf` is a doc-only
reference grammar [VERIFIED — the only `src/` reference is `parsing/CLAUDE.md:38`], and the
generic function fall-through already produces the opaque `FunctionValue`), so deleting the
grammar stub `:95-101` + its `:134` alternative is a pure no-op on the parse path; only the
new L7 arm changes behavior (opaque → concrete `Color`). The wave records this so the atomic
delete-and-add is verified non-regressive.

**The dispatch-doc hygiene fold (S0, B1-valuejs-cssgaps).** The prior
`KF-TO-VALUEJS-P.md` version-split table assigned NO version to the VJ-CSS rows. This
dispatch CLOSES that: VJ-Q1 → **1.1.1**; VJ-Q7 (`if()` multibranch) → **1.2.0**.

**Born-RED gate (`proof:contrast-color`, value.js-side).** RED today:
`parseCSSValue('contrast-color(red)')` is an opaque `FunctionValue`, NOT a concrete
`Color`. GREEN when the L7 arm evaluates it eagerly AND the dead L6 stub is gone.
Plant-a-failure: revert the L7 arm → the value re-opaques → the gate reds; the
WCAG-leaf clause reds if the OKLab accent helper is reused (the wrong black/white near
the boundary).

**Browser-support note (the un-verifiable-in-session claim, B5-valuejs-arch).** The
"Baseline April 2026 / highest-value" claim should be CONFIRMED via a real browser-support
oracle before VJ-Q1 outranks other 1.2.0 asks. It is sequenced as a PATCH (1.1.1) because
it is small, additive, and a precept-correction — the ranking does not gate the 1.2.0 work.

---

## VJ-Q2 — the egress-converter out-param family (the DROPPED VJ-P1 second half, the 1.2.0 perf headline)

> **AUDIT verdict (`B1-valuejs-color`): YES — a deeper transposition reaches <12
> allocs/call, and it is the SECOND HALF OF VJ-P1 THE IMPL DROPPED, not a new idea.**
> Instrumented ground-truth (one call, N_TARGET=40): `gamutMap(display-p3 OOG)` = 37
> Color allocs/call (DisplayP3Color=28, XYZColor=4, OKLABColor=4, OKLCHColor=1). The
> dominant residual (28) is the per-step EGRESS-wrapper boxing.

**The defect, grounded (anchors VERIFIED 2026-06-23 against `value.js/src/units/color/`).**
value.js 1.1.0 cured only the OKLCH→XYZ hub leg (84→37). `color2Into`'s OKLCH fast path
(`dispatch.ts:272-277`, VERIFIED — inside `color2Into` declared at `:230`) calls
`fromXYZFn(xyz)=xyz2displayP3` which does `return new DisplayP3Color(...)` — a fresh egress
wrapper PER STEP that `copyChannelsInto` immediately discards (VERIFIED at `:276-277`:
`const egress = fromXYZFn(xyz) …; return copyChannelsInto(egress, out …)`). The cure the
gate ITSELF names (and the `dispatch.ts` deferral comment) is the converter-layer out-param
family.

**The cure (the named-but-unshipped transposition).**
- **S1 — the egress out-param family.** Add `xyz2rgbFamilyInto(xyz, fromXyzMatrix,
  transferEncode, out: Color)` using `transformMat3Into` (`matrix.ts:34`, VERIFIED —
  `export function transformMat3Into(v, m, out)`, aliasing-safe) into a module `Vec3` +
  `setChannel` writes (zero new allocs). Route `gamutMapToRgbSpace`'s 24-step bisection loop
  through a caller-owned egress scratch (NOT source-aliased).
- **S2 — the 9 hub-intermediates.** Tuple-route the setup/emit conversions OUTSIDE the
  loop: `gamutMapToRgbSpace`'s seed `color2(color,'oklch')` (`dispatch.ts:330`, VERIFIED —
  `const oklch = color2(color, "oklch");` inside `gamutMapToRgbSpace` declared at `:327`) +
  the two JND OKLAB round-trips + the emit, via `*2oklabTuple`/`*2oklchTuple` companions to
  `gamut.ts`'s existing `oklchToXYZTuple` (VERIFIED at `gamut.ts:370`, already zero-tuple).
  This drives the residual 37 → <12 cleanly (the brainstorm's `<12 given C2-jnd already hits
  5` anticipation).

**The aliasing hazard (the FRICTION, C3 bit-faithfulness).** The egress `out` MUST be a
caller-owned scratch that NEVER aliases the XYZ hub scratch nor the source — a
source-aliased `out` corrupts the bisection probe mid-step. AND the egress-Into cure must
be arithmetically IDENTICAL to `xyz2rgbFamily` (same `transformMat3` math, same transfer
encode, same wrap-channel order) or the C3-epsilon golden reds. Both are gate-asserted.

**The kf payoff (inherited, no kf delete).** kf's rAF wide-gamut color interpolation
rides value.js's egress path; the GC win (37 → <12 allocs/call) is inherited transparently
— faster `lerpColorValue`, lower per-frame GC pressure for P3/rec2020 animation, no kf
API change.

**Born-RED gate (`proof:gamut-alloc`, value.js-side).** RED today: `N_TARGET=40`,
residual 37 (>12). GREEN only after the egress *Into + the hub-tuple routing land →
`N_TARGET` re-baselined to the MEASURED post-cure residual (<12) + a small margin (run
the existing `proof-gamut-alloc.mjs` over the built branch — NOT a guessed floor). C1
witnesses `N_BASELINE=104` (proving it sees real allocs); C3-epsilon bit-stable via
`color-into.test.ts`. Plant-a-failure: revert the egress out-param → the loop re-allocates
→ ≥37 → the measured-target gate reds.

---

## VJ-Q3 — `mixColorsInto` + `sampleColorRampAt` + the structural-clone transposition (the secondary color out-params)

**The need, grounded (`B5-valuejs-arch`; anchors VERIFIED 2026-06-23).** Three GROUNDED
transposition seams the gates do not yet measure:
- **`mixColors`** (`dispatch.ts:577-605`, VERIFIED) allocs a `resultComponents:number[]`
  array (`:577`) + a `keys.filter()` array per call (`:569` — `c1.keys().filter(k => k !==
  "alpha")`) AND constructs via the variadic spread
  `new ResultClass(...resultComponents, resultAlpha)` (`:605`) — a monomorphic-ctor
  megamorphic-spread deopt. → `mixColorsInto(c1,c2,p1,p2,space,hue,out)` writing channels
  via `setChannel` (mirror `color2Into`), killing both arrays + the spread.
- **`sampleColorRamp`** is called by kf `compile-color.ts:196-199` INSIDE the inner
  ΔE-proof loop (`sampleColorRamp(from, to, 1024, ...)` once per midpoint `s`), building a
  full 1024-element ramp (each stop a `mixColors` + a `gamutMap`) — O(stops) per `s`. →
  `sampleColorRampAt(from, to, t, opts)`, a single-`t` array-free perceptual sampler, so
  kf hoists the 1024-ramp OUT of the inner loop (the kf half is Q.WB-adjacent).
- **`clone()`** (`src/utils.ts:7-22`, VERIFIED — value.js TOP-LEVEL `src/utils.ts`, NOT
  `units/utils.ts`) deep-clones via `Object.entries().map().reduce()` — three array allocs +
  a reduce-closure PER object level; the engine of `ValueUnit.clone` (`units/index.ts:120`,
  VERIFIED) + `FunctionValue.clone` (`units/index.ts:266`, VERIFIED — calls `this.values.map(v
  => v.clone())` at `:269`), which kf invokes on every flatten + restamp. → a DIRECT
  structural clone (or a `ValueUnit`/`FunctionValue` `clone()`
  short-circuit that copies fields by name, not reflectively).

**The split-across-repos FRICTION (B5-valuejs-arch, pre-empted).** `sampleColorRampAt`'s
win is SPLIT (value.js publishes the sampler + kf hoists the ramp) — risking a "value.js
shipped but kf still recomputes" half-state. PRE-EMPT: BOTH halves are specified NOW (the
value.js sampler here; the kf hoist in Q.WB3/the consume) so the consume is atomic on the
publish.

**The clone-transposition FRICTION (wide silent blast radius, pre-empted).** The
structural `clone()` touches the `ValueUnit`/`FunctionValue` model EVERY consumer's
`instanceof`/`clone` semantics depend on — a regression here is silent and wide.
PRE-EMPT: gate it GREEN-PRESERVING with a bit-identity oracle (the cloned object is
field-for-field equal to the reflective clone across the full corpus) BEFORE the
reflective form is deleted.

**Born-RED gates (value.js-side, all NEW — measure-first per the contrivance-recheck).**
- `proof:mix-alloc` (clone the `CountingColor` shim from `proof-gamut-alloc.mjs`): asserts
  `mixColors` baseline allocs > N, `mixColorsInto` ≤ a small floor. RED today (no gate).
- `proof:ramp-at-equiv`: `sampleColorRampAt(a,b,i/(n-1)) === sampleColorRamp(a,b,n)[i]`
  bit-exact across a grid. RED today (`sampleColorRampAt` absent).
- `proof:clone-alloc`: an allocation-count harness asserts the structural clone allocs
  strictly fewer objects than the reflective `Object.entries` form, bit-identical output.
  RED today (no gate; the reflective form is live).

---

## VJ-Q4 — VJ-L1 `flatLeaf .fnName` (the S8 TERMINAL — the clone()-preserved provenance)

> **AUDIT verdict (`B1-kf-s8-weakmap`): S8 is an HONEST chronic, not a regression.**
> The P.W11/O.W16 WeakMap (`FN_NAME_MAP`) correctly dissolved the foreign-stamp realm
> breach (`proof:no-foreign-symbol-stamp` PASSES — zero kf-owned stamp on any value.js
> instance), but did NOT retire the clone-restamp ceremony, so `proof:workaround-deletion`
> arm S8 sits PENDING at 5 `utils.ts` sites (`:52,55,59,287,341`). Under Q's no-deferral
> precept, the prior "WeakMap is terminal" framing must be OVERTURNED.

**Why the WeakMap leaves a residual (the structural consequence of `clone()`).**
`tryParseLeaves` (`utils.ts:226`) returns shared MASTER leaves from a bounded LRU; each
call `clone()`s them (`utils.ts:291-292`) for per-use-site property context. A clone is a
fresh `ValueUnit` instance ABSENT from the `WeakMap` (a WeakMap key is the instance, which
does not survive `clone()`) — so the provenance must be RE-STAMPED after every clone. The
ceremony is a STRUCTURAL consequence of `clone()`, not incidental.

**The terminal cure (VERIFIED VIABLE + genuinely minimal, the OWNER-favored Option A).**
`ValueUnit.clone()` (`units/index.ts:120-130`, VERIFIED 2026-06-23) already copies
`value`/`unit`/`superType`/`subProperty`/`property` into the new instance (the 5-field copy;
`fnName` would be the 7th positional ctor field after the existing `value,unit?,superType?,
subProperty?,property?,targets?` at `:26`). A 7th optional ctor field `fnName?: string`
copied in `clone()` would survive the clone — so the kf restamp ceremony retires entirely
(`fnNameOf(u)` reads `u.fnName`; the identity-pad reads `counterLeaf.fnName`). `subProperty`
CANNOT double as the carrier (B10: `parseCSSSubValue`/`parseCSSSubValue` overwrites every
leaf's `subProperty` with `opts.subProperty=childKey` like `'transform'`, CLOBBERING any
function-name) — a DEDICATED field is the only clean carrier.

**The two equally-valid additive shapes (kf consumes whichever value.js publishes).**
- **Option A (minimal, O-anchored):** a 7th optional ctor field `fnName?: string`, copied
  by `clone()`, populated by `flattenObject` from `FunctionValue.name`.
- **Option B (a `meta` record):** `new ValueUnit(1,'px',{fnName:'scale'}).meta?.fnName` —
  collapses the positional accretion.

**The FRICTION (double-implement, pre-empted).** Choosing BOTH the value.js field (this
ask) AND a kf-side parallel-array would double-implement the cure + leave a vestigial
field or WeakMap. PRE-EMPT: the audit declares this dispatch the PRIMARY S8 terminal
(the owner-favored in-realm option-B parallel-array is the FALLBACK only if value.js
declines); the two are mutually exclusive, recorded so neither orphans the other.

**Born-RED gate.** value.js-side: a vitest asserting
`new ValueUnit(2,'',undefined,undefined,undefined,undefined,'scale').fnName === 'scale'`
survives `clone()` (today the field does not exist). kf-side:
`proof:workaround-deletion` arm S8 flips PENDING→GREEN — the `/FN_NAME|Symbol\(\s*["']kf\./`
witness goes ABSENT (the WeakMap + the ceremony deleted) ONLY when `vjsCaps.flatLeaf`
sees `'flatLeaf' in vjs` / `'fnName'` on a `ValueUnit` (`proof-workaround-deletion.mjs:151`).
The `apiPresent` guard transitions false→true on the publish — the gate reads the installed
surface, no manual coordination.

---

## VJ-Q5 — the `/math` tree-shakeable subpath (the leaves-externalize enabler)

**The need, grounded (kf Q.WE2, B2-pw1-lint-pw10-leaves).** kf's `internal/leaves.ts`
re-implements value.js's `clamp`/`scale`/`lerp`/`lerpArray` byte-for-byte — a no-legacy
DUPLICATION the impl drive left half-resolved. The cure is kf externalizing onto
`@mkbabb/value.js/math` (which SHIPS today: `dist/subpaths/math.d.ts`, `parse-that-FREE`,
graph = 2 modules / 533 bytes / 0 grammar). This ASK is a CONTRACT-HOLD, not a new build.

**The cure (a contract confirmation, not a new surface).** KEEP the `@mkbabb/value.js/math`
subpath grammar-free + `parse-that`-free across the 1.2.0 publish; document the contract.
The subpath must NOT acquire a static edge to the CSS grammar or parse-that in 1.2.0 (or
kf's W97 boundary-clearance clause reds, and the leaves-externalize falls to the
documented-keep arm).

**Born-RED gate.** value.js-side (or confirmed via the published `math.d.ts`): the
`/math` static module graph contains ZERO grammar/parse-that/`engine`-equivalent modules.
kf-side (Q.WE2): the W97 `math-subpath-clean` clause bundles `@mkbabb/value.js/math` as
its own entry and asserts the clean graph — the consume is GATED on this contract holding.

---

## VJ-Q6 — the dashed-call parse arm (the @function enabler)

> **AUDIT verdict (`B1-kf-emerging` GAP 3): the @function CALL-inlining arm is
> STRUCTURALLY UNREACHABLE — a value.js gap, not in-realm.** value.js 1.1.0 shipped
> `extractFunctions` (the @function DEFINITION registry collector, consumed by kf 4.4.0
> at `adapter.ts`), but the dashed-function CALL site (`--double(2)`) does NOT parse to a
> `FunctionValue` — it drops a verbatim string. kf cannot even born-RED the inlining
> until the call parses (the exact P.W13 mid-tranche trap).

**The grounded gap (the first-char dispatch routing + the double-dash identifier
rejection, VERIFIED 2026-06-23).** The `Function_` first-char `dispatch({...})`
(`parsing/index.ts:425`) routes `"a-z"`/`"A-Z"` → `fnGeneric` (`:408` —
`handleFunc().map(([name, values]) => new FunctionValue(name, values))`) and `"-"` →
`bucketMath` (`:430`, comment "math before generic"; `bucketMath = any(fnMath, fnGeneric)` at
`:420`, VERIFIED). A `--double(2)` starts with `-`, routes to `bucketMath`, fails `fnMath`,
falls to `fnGeneric` → `handleFunc(utils.identifier)` — and `utils.identifier`'s scanner
(`scanIdentFast`, `parsing/utils.ts:48-57`, VERIFIED) accepts at most ONE optional leading
`-` then REQUIRES an ASCII letter (`:51-53`: "the optional '-' alone is not an identifier").
A `--double` has TWO leading dashes, so after consuming one `-` the next char is `-` (not a
letter) → `scanIdentFast` returns `pos` (no match) → the call fails to parse as a
`FunctionValue`. THIS is the precise root cause: the identifier grammar structurally rejects
the double-dash custom-function name.

**The cure (a grammar additive + a validator-exposure confirm).**
- **S1 — the call parse arm.** Add a dashed-function CALL parse arm INSIDE the `"-"`
  dispatch bucket (`bucketMath`'s sibling — try the `--ident(args)` shape BEFORE the
  `fnMath` arm, or add a 2nd-byte discriminator on `-`), with a name-scanner that accepts the
  `--`-prefixed custom-property-function ident (NOT `scanIdentFast`, which rejects the second
  dash), so `--ident(args)` parses to `FunctionValue('--ident', [arg0, arg1, …])` instead of
  dropping. This mirrors the generic `fnGeneric` producer (`handleFunc().map(...)`); the
  leading `--` is the discriminator.
- **S2 — the `<syntax>` validator exposure.** CONFIRM value.js's `@property` `<syntax>`
  validator is a public / resolve-path-consumable export. kf's @function inlining
  (Q.WB2) coerces each bound arg through the param's registered `<syntax>` (the CSS
  Mixins L1 typed-arg coercion) — and per inv-16 kf consumes value.js's validator, NEVER
  hand-rolls a parallel syntax checker (a foreign-realm grammar duplicate). value.js
  already OWNS this validator (it drives `@property`); the ASK is to EXPOSE it on the
  resolve path.

**Born-RED gate.** value.js round-trip: `parseCSSValue('--double(2, 3px)')` is a
`FunctionValue` named `'--double'` with args `[2, 3px]` (today: drops / verbatim). AND
the `<syntax>` validator is reachable from the public/resolve surface. The kf consume
(Q.WB2) is GATED on this publish — its `proof:emerging-css-resolve-fn` born-RED until
the call parses.

**The terminal-or-KILL (the FRICTION).** If value.js declines the call-parse arm, kf's
Q.WB2 KILLs to a recorded inert-seam state (the `--ident` arm stays a no-op, recorded) —
never a perpetual block. If value.js exposes the call-parse but declines the validator
exposure, kf's coercion arm KILLs to "presence-validate only" (the arg substitutes
as-parsed, no `<syntax>` check) — a recorded fork.

---

## VJ-Q7 — `if()` multibranch (the lossy-collapse fix)

> **AUDIT verdict (`B1-valuejs-cssgaps` GAP, with a DOWNSTREAM CONSUMER ALREADY
> BLOCKED; anchors VERIFIED 2026-06-23).** `parsing/index.ts:336-348` `handleIf` COLLAPSES
> `if()` to first-consequent + first-else, dropping the middle — even though `splitIfClauses`
> (`:255-295`, VERIFIED — returns the FULL `clauses` array; `handleIf` itself is declared at
> `:310`, the lossy collapse is the `.map` callback at `:336-348`, emitting the 2-branch
> `FunctionValue` at `:343-347`). kf's `resolveIf` (`resolve-values.ts:334-367`)
> hard-codes the 2-branch `[cond, consequent, else]` triple (`:340-342`) with the explicit
> deferral comment at `:330-332`: "value.js's if() producer is lossy for >2 branches."

**The cure (a ~3-line producer change — the array already exists).** In `handleIf`, STOP
collapsing to first-consequent + first-else; emit the FULL ordered `clauses` array
(`splitIfClauses` already computes it). The child-layout (flat-pairs vs N-tuple) is a
value.js↔kf CONTRACT — value.js must NOT pick unilaterally (the FRICTION the lane named:
a unilateral choice forces a kf re-fit + a second round-trip). The layout is specified in
this dispatch (a flat ordered `[condition, value, condition, value, …, elseValue]` pair
list, matching kf's `resolveIf` walk) so the consume is atomic.

**The kf consume (GATED, Q.WB2/Q.WD2).** kf generalizes `resolveIf` from the hard-coded
triple to walk the N-branch clause list, re-pinning `^1.2.0`. The common 2-branch `if()`
ships NOW (it already parses); the >2-branch consume is GATED on this publish.

**Born-RED gate.** value.js round-trip:
`parseCSSValue('if(media(min-width:100px): 1px; supports(...): 2px; else: 3px)')` emits a
3-branch ordered clause list (today: collapses to 2). kf-side: `resolveKeyframes` over a
keyframe carrying a 3-branch `if()` resolves the correct middle branch (RED until the
producer + the kf walk land).

---

## VJ-Q8 — the `ColorChannelPlan` (the SoA color-tail enabler — the GATED partner)

**The need, grounded (`B1-kf-soa`).** kf's P.W2 SoA compositor fold is genuinely
complete for numeric leaves, but the boxed residual permanently holds the color/computed
tail because a `Color` cannot live in a `Float64Array` — `buildSoAPlans` classifies any
color leaf BOXED. The cure is a value.js Float64 oklab-channel layout the compositor folds
through.

**The cure.** A `ColorChannelPlan` — a `(Color → channel offsets)` plan that lays out a
color's oklab channels in a contiguous `Float64Array` — plus a `lerpColorChannels(t,
startBuf, stopBuf, outBuf)` fold. kf's compositor + `processFrame` route the color tail
through the plan instead of per-element `Color` boxing.

**The MEASURE-FIRST precondition (the anti-contrivance gate — this cross-repo ask is
chartered ONLY after the bottleneck is born-RED on kf's OWN path).** Per the charter §7
discipline ("every Q perf wave carries a measure-first born-RED gate on its OWN target
path"), VJ-Q8 is a cross-repo PERF plan and must NOT be dispatched-then-built on the bare
assertion that "the color tail is boxed." The Q.WB3-color consume wave (Band B) carries the
measure-first PRECONDITION gate: bench the color-leaf blend SoA-vs-boxed over a realistic
K-layer color-animation fixture (mirror the numeric `group-soa-integration` harness) and
witness the color tail is a non-trivial Amdahl slice with a fold-win ≥ a measured floor. If
that born-RED measurement does NOT clear the floor (the color tail is a negligible frame
slice, OR the plan-build overhead eats the fold win), VJ-Q8 is KILLED with a tombstone (the
color tail ships boxed, recorded as measured-not-worth-it) — the cross-repo plan is never
chartered on a speculative bottleneck. The bit-exactness gate (below) is the CORRECTNESS
oracle; this measure-first gate is the GROUNDING oracle that authorizes the ask at all.

**The kf consume (GATED, Q.WB3-color).** kf folds the color leaves through the published
plan, re-pinning `^1.2.0` — ONLY after the measure-first precondition above clears. The
numeric SoA arm is fully in-realm (NOW); the color arm is GATED on this publish, with a
terminal-or-KILL (the color tail ships boxed if value.js declines OR if the measure-first
floor is not cleared — recorded, never a perpetual block).

**Born-RED gate.** value.js-side: the plan-build + `lerpColorChannels` is bit-exact vs a
per-element `Color` lerp across a grid. kf-side: `proof:color-soa` (NEW, born-RED — no
`ColorChannelPlan` consume exists today) greens when the plan consume lands.

---

## VJ-Q9 — CSS serialization fidelity (the Q.WD2 grammar-fuzz tripwire's GATED exit)

> **AUDIT verdict (kf `Q.WD2` / `B2-pw9-nanframe`): a value.js round-trip-fidelity gap
> kf cannot self-cure (inv-16).** kf's Q.WD2 grammar-fuzz harness ships TWO expected-failure
> tripwires (`oklch(L none H)` none-channel and `color(<space> …)` wrapper-loss) that document
> the known-broken state and auto-flip when value.js fixes the serialization. Without an owning
> VJ-Q slot + a value.js born-RED gate, those tripwires would be orphaned (a soft perpetual).
> VJ-Q9 is that owning slot — the cross-doc dependency Q.WD2 §S4 names.

**The two LIVE breaches (probe-confirmed 2026-06-23 against installed value.js 1.1.0,
re-confirmed in kf's Q.WD2 session).**
- **none-channel → NaN:** `parseCSSValue('oklch(0.6 none 200)').toString()` → `"oklch(0.6 NaN 200)"`.
  A powerless `none` channel (CSS Color 4 — a valid `<number>`-or-`none` channel value) must
  round-trip as `none`, never `NaN` (a `NaN` channel re-parses to a different unit type → the
  kf round-trip structural-equality oracle fails).
- **`color()` wrapper-loss:** `parseCSSValue('color(display-p3 1 0 0)').toString()` →
  `"display-p3(1 0 0)"`. The `color(<space> …)` function wrapper is dropped on round-trip → a
  different function name → equality fails.

**The cure (two S-clauses, both round-trip-fidelity fixes, BC-additive).**
- **S1 — the none-channel serializer.** Serialize a powerless `none` channel verbatim as
  `none` (preserve the powerless-channel token through parse→serialize), never collapsing it to
  `NaN`.
- **S2 — the `color()` wrapper preservation.** Preserve the `color(<space> …)` function wrapper
  on round-trip so `color(display-p3 1 0 0)` serializes back to `color(display-p3 1 0 0)`, not the
  bare `display-p3(1 0 0)`.

**The kf consume (GATED, Q.WD2 via Q.WG4).** kf's Q.WD2 `proof:grammar-fuzz` none-channel +
wrapper-loss arms are EXPECTED_FAILURE tripwires (green-now, self-terminating at the gate). On
the `^1.2.0` re-pin (Q.WG4), they auto-flip PENDING→GREEN as standard passing arms — value.js
now round-trips both inputs. NO kf re-fit beyond the re-pin (the tripwires read the round-trip
result directly).

**Born-RED gate (`proof:serialize-fidelity`, value.js-side).** RED today:
`parseCSSValue('oklch(0.6 none 200)').toString() !== 'oklch(0.6 none 200)'` (it is
`'oklch(0.6 NaN 200)'`) AND `parseCSSValue('color(display-p3 1 0 0)').toString() !==
'color(display-p3 1 0 0)'` (it is `'display-p3(1 0 0)'`). GREEN when both round-trip verbatim.
Plant-a-failure: revert the none-channel serializer → the none channel re-NaNs → the gate reds;
revert the wrapper preservation → the `color()` wrapper drops → the gate reds.

---

## INFORM (what value.js Q must know — the DAG, the version split, the consume edges)

1. **The DAG — value.js Q sequences AFTER parse-that Q, BEFORE keyframes Q.**

   ```
   parse-that Q (0.13.0)  ─►  value.js Q (1.1.1 → 1.2.0)  ─►  keyframes Q (5.0.0 / 5.1.x)
   (re-pin ^0.13.0;            (1.1.1 contrast-color;          (^1.1.0 caret auto-consumes
    consume subTable/Span       1.2.0 perf + grammar +          1.1.1; explicit ^1.2.0
    IF parse-that adopts)       provenance + /math + plan)      re-pin at Q.WG4)
   ```

2. **The version split — 1.1.1 PATCH then 1.2.0 MINOR.**

   | value.js publish | contents | kf consume |
   |---|---|---|
   | **1.1.1** | VJ-Q1 `contrast-color()` L7 (+ the dead L6 stub delete) | kf's `^1.1.0` caret auto-consumes it — Q.WB1 Phase-2 lowers `if(contrast-color(...))` |
   | **1.2.0** | VJ-Q2 egress out-param family; VJ-Q3 `mixColorsInto`/`sampleColorRampAt`/structural-clone; VJ-Q4 `flatLeaf .fnName`; VJ-Q5 `/math` contract; VJ-Q6 dashed-call parse + `<syntax>` exposure; VJ-Q7 `if()` multibranch; VJ-Q8 `ColorChannelPlan`; VJ-Q9 serialization fidelity (none-channel + `color()`-wrapper) | kf re-pins `^1.2.0` (Q.WG4) — the EXPLICIT re-pin so the consume edges are observable (the caret would land 1.2.0 silently); fires Q.WB2 (@function), Q.WB3-color (SoA), Q.WD2 (if-N + the grammar-fuzz serialization tripwires), Q.WE2 (leaves), the S8 terminal |

   **The caret-pin observability note (B6-crossrepo-versions).** kf 4.4.0 pins
   `^1.1.0`, which auto-consumes 1.1.x AND 1.2.x. VJ-Q1 (1.1.1) lands transparently
   (correct — it is a pure catch-up). But the 1.2.0 features (the perf out-params, the
   grammar arms, the provenance field) must land behind an EXPLICIT `^1.2.0` re-pin
   (Q.WG4) so each consume edge has a queryable observable — a future audit can tell
   whether the 1.2.0 features are actually wired.

3. **The S8 terminal is THIS dispatch (VJ-Q4) under Q's no-deferral precept.** The P-era
   "WeakMap is terminal, VJ-L1 demote-to-spike" framing is OVERTURNED: a forever-PENDING
   S8 arm is the perpetual-punt P-inv-28 forbids. VJ-Q4 (the `clone()`-preserved `fnName`
   field) is the binding terminal; kf retires the WeakMap + the ceremony on the publish.

4. **The master-merge precondition (Q.WA3).** value.js published `v1.1.0` from
   `tranche-p` (NOT master). VJ-Q.W0 folds the `tranche-p → master` merge so the 1.1.1/1.2.0
   cuts land on a reconciled master (the deploy-of-record).

---

## The pin/version state at this dispatch

| Package | Published | kf pins | kf re-pin on the Q publish |
|---------|-----------|---------|-----------------------------|
| `@mkbabb/parse-that` | 0.12.0 | TRANSITIVE only (S9 retired the direct dep) | value.js re-pins `^0.13.0`; kf inherits |
| `@mkbabb/value.js` | **1.1.0** (VERIFIED — value.js `package.json` version `1.1.0`, branch `tranche-p`) | `^1.1.0` (`package.json:221` VERIFIED) | `^1.1.0` auto-consumes 1.1.1 (VJ-Q1); EXPLICIT `^1.2.0` re-pin at Q.WG4 (the 1.2.0 family) |

---

## Net actions

**value.js Tranche Q (the sibling — to author in value.js's tree, never from kf):**
1. **VJ-Q.W0 (FIRST):** reconcile the P record to CLOSED-as-built; merge `tranche-p → master`.
2. **1.1.1 — the library-LEADS catch-up:**
   - **VJ-Q1** — the WCAG leaf + the `contrast-color()` L7 arm + DELETE the dead L6 stub.
3. **1.2.0 — the perf + grammar + provenance minor:**
   - **VJ-Q2** — the egress out-param family (gamut 37 → <12; `N_TARGET` re-baselined to
     the MEASURED residual).
   - **VJ-Q3** — `mixColorsInto` + `sampleColorRampAt` + the structural-clone transposition
     (three new measure-first gates).
   - **VJ-Q4** — the `flatLeaf .fnName` field (`clone()`-preserved; the S8 terminal).
   - **VJ-Q5** — hold the `/math` subpath `parse-that`-free contract across 1.2.0.
   - **VJ-Q6** — the dashed-call parse arm + expose the `<syntax>` validator on the resolve path.
   - **VJ-Q7** — emit the FULL ordered `if()` clause list (the flat-pair layout specified here).
   - **VJ-Q8** — the `ColorChannelPlan` + `lerpColorChannels`.
   - **VJ-Q9** — the serialization-fidelity fix (none-channel round-trip + `color()`-wrapper
     preservation) + the value.js born-RED gate `proof:serialize-fidelity`.

**keyframes.js (the GATED consumes — Q.WG4 + the band waves):**
1. **On 1.1.1:** the `^1.1.0` caret auto-consumes `contrast-color()`; Q.WB1 lowers it.
2. **On 1.2.0 (Q.WG4 — the explicit `^1.2.0` re-pin):** fire Q.WB2 (@function inline),
   Q.WB3-color (SoA), Q.WD2 (if-N + the grammar-fuzz serialization tripwires auto-flip on VJ-Q9),
   Q.WE2 (leaves externalize); retire the S8 WeakMap +
   ceremony (the VJ-Q4 terminal); inherit the egress/mix/clone perf transparently.

**The contract.** value.js publishes the asks; kf re-pins and consumes (the explicit
`^1.2.0` for observability). Neither writes the other's tree (inv-16). The gate roster —
`proof:contrast-color` (1.1.1); `proof:gamut-alloc N_TARGET<12` + `proof:mix-alloc` +
`proof:ramp-at-equiv` + `proof:clone-alloc` (the perf family); the `flatLeaf` vitest +
kf `proof:workaround-deletion` S8 (the provenance terminal); the `/math` graph (the
subpath contract); the dashed-call round-trip + the `<syntax>` exposure; the `if()`
multibranch round-trip; the `ColorChannelPlan` bit-exactness; `proof:serialize-fidelity`
(the none-channel + `color()`-wrapper round-trip, the Q.WD2 grammar-fuzz tripwires' GATED exit)
— is the binding cross-repo oracle. Each consume fires when the installed value.js surface
carries the API, observed at runtime (the `apiPresent` probe), not asserted by coordination.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT dispatch packet — **DOCS ONLY** (inv-16: kf writes
only keyframes.js; every cross-repo need is a *dispatch*, never a foreign-tree edit).
value.js's Q session implements the ASKs in value.js's own tree; kf re-pins and consumes
on each publish. Every ASK carries a **falsifiable born-RED gate** (the platform-parity
ask: a parse-shape probe RED today, GREEN on the eager-eval; the perf asks: a portable
alloc-count bench RED on today's profile, GREEN on the out-param; the provenance ask: a
`clone()`-survival vitest + the kf `apiPresent` flip; the grammar asks: a round-trip over
the multi-branch/dashed input). Implementation opens only on the owner's explicit go,
per-repo, DAG-ordered (parse-that Q → value.js Q → keyframes Q). The dropped VJ-P1 second
half (VJ-Q2) + the overturned VJ-L1 demote (VJ-Q4) are the Q-redressed P-deferrals. The
1.1.1 catch-up restores library-LEADS; the 1.2.0 minor lands the perf/grammar/provenance
frontier. observable-truth, library-leads, no-legacy, no-deferral (every ask
terminal-or-KILL), gestalt throughout.
