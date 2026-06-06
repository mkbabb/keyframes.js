# value.js SOTA hand-off **v2** — the Tranche-F cross-repo augmentation charter (AUTHORITATIVE)

**What this is.** The **authoritative v2 cross-repo charter the value.js owner formalizes** —
the Tranche-F deep-SOTA audit's value.js findings, de-duplicated into one prioritized proposal
that carries the keyframes.js mandate with it. It **supersedes** the 405-line E v1
(`docs/tranches/E/valuejs-sota-handoff.md`) — it does not replace its science, it **diffs** it:
every wave below is marked **[E v1]** (carried forward, the E shape held), **[F-SHARPEN]** (E v1's
item, re-grounded with a live number / a corrected mechanism / a count fix), or **[F-NEW]** (an
item the F audit originates that E v1 did not have). This v2 is the synthesis of phase-1 lanes
`vj-parser-aug` · `vj-color-interp-aug` · `vj-units-compute-aug` · `a-vj-consumption-F`,
the three parsing-modality lanes `parsing/px-vj-css-parser` · `px-parse-that-arch` ·
`px-kf-grammar`, and the forward-SOTA research `r-color-l4-l5` · `r-interpolation-carrier`
· `r-css-parsers-wasm` · `r-waapi-platform-2026` · `r-spec-frontier-2026`, plus the
perf re-measures `p-parse-perf-F` · `p-runtime-perf-F`. Every claim traces to a named
phase-1 lane or a `file:line`; this charter re-derives nothing.

**Its companion.** The two **parse-that-HANDOFF** items this charter names (the dead unsound
packrat, the module-global error-state) belong to a *third* `@mkbabb` repo and are owned by the
dedicated **`docs/tranches/F/parse-that-sota-handoff.md`** — the parse-that-engine charter
(PT-WAVE-1 the state-threading, PT-WAVE-2 the packrat isolation, PT-WAVE-3 the span dist,
§1.5 the `parseSingleValue` expose). Where a value.js win **gates on a parse-that fix first**
(the `cssParser`-adoption option, the `console.error` leak's architectural root, the structured
error sink), the parse-that root is named inline here and cross-linked to that charter. The two
together are Tranche F's complete cross-repo emission.

**What v1 covered vs what F ADDS (the diff, stated up front).** v1 carried Waves A–F + the one
chronic rename seam, on the E shape. **F adds:** the empirically-sized C1 (−99.3%/leaf/frame),
the RE-POINTED Wave D (D1 demoted to a measured non-win, D2 SoA promoted), the three NET-NEW color
findings (B1b `/1`-alpha, B3's exact alloc inventory, the `Color.clone()` constraint), the
CORRECTED B2 emit-space rule + the 4-clause WAAPI gate, the re-scoped `linear()` (severed
value.js-end ONLY), the two CLOSED items (§2 rename + F4 `@property`, struck from the open ledger),
the four NET-NEW VJ-F1/F2/F3/F4 items, and the two parse-that-side findings now homed in the
dedicated parse-that charter. The WASM DECLINE is re-confirmed + strengthened (§1 Wave A's
strategic-option block; the parse-that charter §3 carries the full engine-angle ledger).

**Synthesis id:** `_SYNTHESIS-valuejs-handoff-v2`. **Deliverable:** this file only.

**inv-16 (hard — the whole point of this file).** This is a **HAND-OFF, not a directive,
not a write.** value.js is **dirty + active** — branch
`docs/constellation-grand-audit-2026-06-03`, **tranche M open** (web-app/CI work:
sessions, palettes, deploy — orthogonal to this seam; HEAD `62f7e00`, version
`0.10.0` = the pin kf already ships, **no pin lag** — `a-vj-consumption-F §0.1`,
`vj-color-interp-aug §0`). keyframes.js does **not** edit value.js. Every item is a
*proposal* the value.js owner sequences, scopes, accepts, defers, or re-scopes against
value.js's own tranche discipline. **Two items below are `parse-that`-HANDOFF** (a
*third* `@mkbabb` repo, `/Users/mkbabb/Programming/parse-that`): the value.js parser is
built on parse-that, and two of the SOTA wins require parse-that to expose or fix a
surface first — flagged inline. keyframes.js's paired FOLD-F work (the right-hand column
of §6) is owned by Tranche F and lands independently; most of it consumes the published
value.js surface **unchanged** because the entire interp path is reached through **one
dispatch site** — `lerpValue(eased, iv)` (`engine.ts:629`), `iv._lerp`-internal
(`a-vj-consumption-F §1`, the strongest structural confirmation of "kf consumes it
unchanged" — it is *forced*, not hopeful: the kf re-export barrels are now **gone**, so
there is no kf normalize/parse surface to migrate). **This file is the only thing this
synthesis lane writes.**

> Every cross-repo `file:line` was re-grounded against the live trees at audit time
> (2026-06-06) by the phase-1 lanes and re-confirmed by spot-check here:
> `value.js src/units/{normalize,interpolate,color/index,utils}.ts`, `src/parsing/*`,
> `src/easing.ts`; `parse-that .../parse/{leaf,parser,parsers/css/value,scan}.ts`.

**The mandate (travels WITH this charter — the same precepts the keyframes tranches run
under).** NO quick solutions, NO workarounds — idiomatic, gestalt approaches only. This
is a development product: **architectural transpositions for the sake of elegance,
simplicity, and performance above all are both necessary and desirable** (Wave A's
`any()`→`dispatch()` / `cssParser`-adoption and Wave D's SoA carrier ARE
transpositions, not patches — sequence them as such). **NO legacy code**: a replaced
surface is replaced in the same motion (the kf `parseLinearStops` shim retires *onto*
the value.js `linear()` parser — F-PARSE-1; no compat alias is kept beside it); a
removed name is removed; the dead unsound packrat is **deleted**, not wired. Every wave
is **measure-first** (a perf claim lands behind a bench or is recorded-withheld),
**isomorphic** (output deep-equal/value-equal unless a befitting delta is NAMED — the
per-row isomorphism notes are binding), and **falsifiably gated** (the per-row gates
must bite, not narrate). KISS — §7's ALREADY-SOTA record is binding: manufacture **no
work** where value.js already leads, and the F audit found value.js's color *science*,
parse *breadth*, and interp *dispatch* to be at or ahead of SOTA. The gaps are
**churn + memo-key cost + a handful of spec parsers**, not science.

---

## 0. The headline — what F adds to the v1 charter

**The v1 shape held.** The F audit re-ran every E-withheld measurement and re-grounded
every cross-repo cite against the live M-tranche value.js tree. **Nothing on this seam
moved in value.js** (M is orthogonal web-app/CI work — `vj-units-compute-aug §0.1`,
`a-vj-consumption-F §0.1`): every v1 wave is still **OPEN and correctly withheld**. F
does **not** overturn the science; it **sharpens the numbers, corrects three mechanisms,
closes two items by verification, and originates seven net-new findings.**

**The seven things v2 adds over v1:**

1. **The real D-3 win is now EMPIRICALLY SIZED, not speculative.** [F-SHARPEN] The E
   withhold named the per-frame computed-resolution overhead but left it unmeasured.
   `vj-units-compute-aug §2` re-measured it on the live shape (node `process.hrtime`,
   5M iters warm): the `getComputedValue` memo **HIT** costs **~95 ns/call**, called
   **2× per leaf per frame** = **~190 ns/leaf/frame** of pure re-derive-the-invariant
   overhead. **C1 (endpoint cache) collapses it to ~1.2 ns — a measured −99.3%.** The
   cheaper C2/C4 fallback alone gets to ~8.5 ns (−95%). This is no longer a withhold —
   it is a measured, isomorphic, single-file cut ready to formalize.

2. **Wave D is RE-POINTED by a real measurement — D1 is a measured non-win; D2 SoA is
   the lever.** [F-SHARPEN] `r-interpolation-carrier` (corroborated by `r-v8-cost-model`,
   the magnitude disputed-but-direction-agreed by `p-runtime-perf-F P-4`) **ran the bench
   E withheld**: the monomorphic-cell / frozen-shape-`ValueUnit` hypothesis is *within
   noise of, and at K=1 slower than,* the megamorphic carrier. **The lever is SoA
   `Float64Array` layout: ~2.0× at K≥8, ~2.3× at K=64.** Promote D2, demote D1 to a
   recorded measured non-win, KILL Typed OM as a carrier downgrade.

3. **Three NET-NEW color findings from direct source reading.** [F-NEW]
   `vj-color-interp-aug §2.4` found `formatColor` **unconditionally emits `/ ${alpha}`,
   even at alpha=1** (re-confirmed live: `color/index.ts:18-19`) — a clean, isomorphic
   ~4-char/keyframe byte-shrink. §2.2 names the **exact** per-frame allocations B3 must
   eliminate (the `keys()` array + arrow closure + per-channel `unwrapDeep`). §2.5
   verifies `Color.clone()`'s static depth-counter is **off** the per-frame path — a
   binding constraint on B3 (no per-frame clone).

4. **The B2 emit-space rule is CORRECTED, and the WAAPI color gate is a 4-CLAUSE HARD
   EQUALITY.** [F-SHARPEN] `r-color-l4-l5 §2-3`: `<color-interpolation-method>` is a CSS
   *data type*, **not a settable property** — for animations the interp space is chosen
   *implicitly* by the keyframe color syntax family. So v1's "emit legacy pairs as
   `rgb()`" is **wrong** as a blanket WAAPI rule (it forces sRGB interp, diverging from a
   default-`oklab` request). The corrected gate (§5) is narrower than v1's "match-or-pin."

5. **`linear()` is now severed on the value.js end ONLY, and crosses Baseline
   Widely-Available 2026-06-11.** [F-SHARPEN] `vj-parser-aug §3` / `px-kf-grammar PX-3,4`:
   v1 (and the E lanes) said "severed on BOTH ends." **Stale** — kf's E.W7 S5 landed the
   `getTimingFunction` reader, but with a **kf-local hand-rolled regex+`split`**
   (`parseLinearStops`, `utils.ts:106-130`). The kf end is whole; the value.js parser is
   the only gap, and `linear()` is table-stakes CSS this month — raising E1 to MED-HIGH.

6. **Two v1 items are CLOSED — strike them from the open ledger.** [F-SHARPEN]
   `a-vj-consumption-F §0.2, §2`: the §2 **rename** (`AnimationOptions →
   CSSAnimationOptions`) is **DISCHARGED at 0.10.0** — the dist exports
   `CSSAnimationOptions`, no bare `AnimationOptions`, and kf imports the type name
   **nowhere** (it defines its own local superset and consumes the extractor
   structurally). The **F4 `@property` lossless round-trip** is **CLOSED by
   verification** — value.js stores the raw quote-stripped `syntax` string
   (`stylesheet.ts:386`); kf's registration is NOT lossy. Both vacate v1 hedges.

7. **Two NET-NEW `parse-that`-side findings (a third repo) — now homed in the dedicated
   parse-that charter.** [F-NEW] `px-vj-css-parser PX-1` / `px-parse-that-arch §3-4`:
   parse-that's `.memoize()` packrat is keyed by parser `id` **alone, not `(id, offset)`** — it
   is **latently unsound** (and the reason it is dead) → **ISOLATE + re-key** (the synthesis
   adjudication, not blunt-KILL — the tested capability is real). And the furthest-offset /
   diagnostics error-state lives in **module globals**, not on `ParserState` — a
   re-entrancy/interleave soundness hazard the Rust port already solves with state fields →
   **HIGH, architectural**. Both are upstream of value.js's parser and gate the deepest parse
   transposition (`cssParser` adoption). **These are owned by
   `docs/tranches/F/parse-that-sota-handoff.md` (PT-WAVE-2 + PT-WAVE-1)** — summarized here, the
   canonical waves/gates live there.

**The cross-repo edge that defines this hand-off (unchanged from v1, re-confirmed).** The
keyframes computed-unit perf (D-3) cannot land its full win without the value.js
`normalize`/`interpolate` change — *the real D-3 win lives in
`value.js/src/units/{normalize,interpolate}.ts`, and kf consumes it without a single
edit because `lerpValue` already dispatches through `iv._lerp`.*

---

## 1. The proposed waves

Ordered by leverage × isomorphism-safety. Each row carries a **diff tag**
([E v1] / [F-SHARPEN] / [F-NEW]), a **falsifiable gate**, an **isomorphism** note, and
the cross-repo edge where one exists.

### Wave A — Parse-time fast tier (dispatch · spans · single-pass · diagnostics)

The biggest *structural* parse win, fully isomorphic, leveraging primitives parse-that
already ships. **The forward-SOTA frame** (`px-vj-css-parser`, `r-css-parsers-wasm`):
every fast CSS parser converges on *tokenize-once · first-token dispatch ·
typed-value-per-property · zero-copy spans · forgiving · no-re-scan*. parse-that's own
`parsers/css/` **already hand-writes that exact reader** (`parseSingleValue`,
`value.ts:11-87`; `scan.ts` charCode scanners; the `Int8Array(128)` `dispatch`,
`leaf.ts:60-104`) — **and value.js imports none of it.** The move is "adopt the shape
parse-that already proved," not "invent a tokenizer."

| # | Item | Where | Gate | Iso | Diff |
|---|------|-------|------|-----|------|
| **A1** | Replace speculative `any()` fronts with O(1) first-char `dispatch(table)` at the color/value/function/math forks. **58 live `any(` sites** (`vj-parser-aug §2.1`: index 15, color 20, units 11, math 7, stylesheet 5 — not v1's "65"). Hottest forks: the **14-way** `color.ts:556`, the **11-way** `units.ts:78`. The dispatch table *is* `parseSingleValue`'s switch; the in-repo PROOF is `nameParser` (`color.ts:527-552`), which already replaced 155 `istring` branches with one regex + `Set` (`px-vj-css-parser PX-7`) | `color.ts:556`, `units.ts:78`, `index.ts`, `math.ts:200` | parse-output **deep-equal** over the full value.js + kf `parsing`/`units`/`editor-parsing` corpus; bench the color/value hot loop (`p-parse-perf-F F-P1`: **3.65× tail, 6× branch-position spread, measured**) | **Isomorphic** — dispatch reaches the *same* parser `any` would; priority preserved inside each bucket | [F-SHARPEN] |
| **A2** | One **maximal-munch** unit regex + `Set` classification (or adopt parse-that's `parseUnit` LUT, `scan.ts:91`), replacing the per-dimension `any(...UNITS.map(istring))` — **the worst single dispatch arm: a 45-way alternation** (`px-vj-css-parser PX-4`) where the *modern* units kf animates (`dvh`, `cqw`/`cqmin`/`cqmax`) sit at the **tail**. **SHARPENED to LATENT CORRECTNESS** (`vj-parser-aug §2.2`): `istring` (`utils.ts:5-8`) compiles a **non-anchored** RegExp; `regex` re-flags it sticky `y` which anchors the *start* but not the *end*, so a unit matches as a **prefix** of the continuation — safe today only by accident of declaration order | `units.ts:20-26`; order `constants.ts:2-41`; `scan.ts:91` | a **longest-match** test (`vmin` vs `vmax` vs `vb`, `svw` vs `s`, `100vmin` boundary vs `100vming` reject) + round-trip equivalence | **Perf + a latent-correctness hardening** — maximal-munch removes the order-dependence; changed outputs (if any) are cases mis-tokenized today | [F-SHARPEN] **lead Wave A** (`r-css-parsers-wasm F-2`: cost scales monotonically with array position) |
| **A3** | Span/charCode leaves where substrings are materialized then immediately consumed. **The full unused-surface inventory** (`px-vj-css-parser PX-5`): `span.ts` ships **17 span combinators** incl. the `Uint8Array(128)` `takeUntilAnySpan` — **value.js's CSS parser uses ZERO** (`grep = 0`). Every value leaf does `state.src.substring(...)` (`leaf.ts:213`) thrown away after the cast | `leaf.ts:213`; `utils.ts:14,16` | output value-equal; allocation-rate drop on the editor sheet + the **per-frame computed re-parse** (A6 path) | **Isomorphic** — only intermediate string garbage removed | [F-SHARPEN] |
| **A4** | Inline comment-skip during whitespace consumption (parse-that ships `skipWsAndComments`, `scan.ts:34`), replacing the `stripCSSComments` whole-input regex **pre-pass** — which `px-kf-grammar PX-1` shows is the **value.js half of the broken "no pre-detection" contract** and **destroys error-offset fidelity** | `stylesheet.ts:87,516` | identical AST; **error offsets stay true** | **Isomorphic AST, *better* diagnostics** | [E v1] |
| **A5** | One shared `splitBalanced`/`containsDelimiter` replacing 4 bespoke balanced-scan loops + the recursive-regex paren-balancer in `handleVar` | `stylesheet.ts:99,411`, `animation-shorthand.ts`, `index.ts:26` | identical splits on nested `var(--a, var(--b, calc(1px+2px)))`; comma-free fast-path | **Isomorphic** | [E v1] |
| **A6** | **Numeric charCode fast-path in `parseCSSValueUnit`** for the dominant `<number><unit>` shape `getComputedStyle` returns — A1/A3 **on the per-frame hot path**: the computed resolver re-parses a fresh string per tick for an animating `calc(100cqw - 100%)` (`normalize.ts:145,170`), so dispatch/span wins cut per-frame allocation. Pairs with Wave C | `normalize.ts`; `units.ts` value grammar | **mandatory round-trip equivalence** — fast-path output **deep-equal** to grammar output (the one finding where a regression shows *in pixels*); per-frame parse-alloc drops | **Byte-identical** for the shapes it claims; else falls through | [E v1] |

**The big strategic option — `cssParser` adoption (GAP-NAMED, owner-scoped; WASM
DECLINED).** parse-that ships a complete scannerless, charCode-driven CSS parser
(`cssParser`, **exported and typed** incl. `CssAtKeyframes`, in published `dist` —
`px-vj-css-parser PX-2`) and value.js imports **none** of it, maintaining a parallel
slower combinator reimplementation. Adopting `parseSingleValue` as the value layer is
the single biggest elegance+perf lever, **and F names the producer half**: it is *not*
"invent a tokenizer," it is **(a) parse-that-HANDOFF: export `parseSingleValue` /
`parseFunctionArgs` at the package root** (today only `cssParser` is; `scan.ts:2`
comments "internal — not exported"), **and (b) value.js-HANDOFF: write a thin
`CssValue → ValueUnit` adapter** (the shape map is mechanical:
`dimension`→`ValueUnit(value, unit, superType)`, `color`→existing constructors,
`function`→`FunctionValue`) then route `parseCSSValueUnit`/`parseCSSValue` through it.
This is the multi-week, parity-gated transposition — sequence it **after** Wave A's
cheap isomorphic wins. **The Rust→WASM tier stays DECLINED** (re-confirmed +
strengthened, `vj-parser-aug §4`, `px-vj-css-parser PX-8`, `r-css-parsers-wasm F-4`):
the `rust/parse_that/` parser is a real benchmarked typed-AST parser but **unbuilt for
WASM** (no `cdylib`, no `#[wasm_bindgen]`), and lightningcss's own WASM build documents
`TextEncoder`/`TextDecoder` marshalling as "the main overhead" — fatal to the
**per-token** keyframes workload (one boundary crossing *per value* dwarfs the
~600 ns–2.4 µs cold parse). The SOTA win is architectural, pure-TS, in-tree.

**parse-that-HANDOFF (two upstream fixes that gate the above — OWNED by the dedicated
`docs/tranches/F/parse-that-sota-handoff.md`).** [F-NEW] These belong to a *third* `@mkbabb`
repo; they are summarized here only because they gate value.js's deepest parse transposition.
The canonical waves, gates, and sequencing live in the parse-that charter:
- **PT-WAVE-2 — the `.memoize()` packrat MEMO is id-keyed, not `(id, offset)`-keyed → latently
  unsound** (`px-vj-css-parser §1`, `px-parse-that-arch §3`). `MEMO.get(this.id)`
  (`parser.ts:88,104,123,136`) ignores `state.offset` while the sibling
  `LEFT_RECURSION_COUNTS` correctly uses `getCijKey = (id<<20)|offset` (`:75`). It has
  never bitten only because `.memoize()`/`.mergeMemos()` are **called nowhere** (zero `src/`
  call-sites; the only consumer is `test/memoize.test.ts`). **Disposition: parse-that-HANDOFF
  (MED) — ISOLATE into an opt-in module + re-key to `getCijKey` in the same motion**, and strip
  the per-parse `MEMO.clear()` reset tax from the LL(1) default path (the synthesis adjudicated
  ISOLATE-not-KILL: the tested capability is real; amputating it is the wrong cut — CSS value
  grammars are LL(1)-ish under first-char dispatch and do not need packrat, but the BBNF feature
  could). See parse-that charter **PT-WAVE-2**.
- **PT-WAVE-1 — the furthest-offset / expected-set / diagnostics error-state lives in MODULE
  GLOBALS, not on `ParserState`** (`px-parse-that-arch §4`). `mergeErrorState` writes
  `lastFurthestOffset`/`lastExpected`/`collectedDiagnostics` (file-scoped, `utils.ts:31-35,146`)
  on every failed branch; `ParserState` *already has* `furthest`/`expected` instance
  fields (`state.ts:23,30`) but they are vestigial. This is a re-entrancy + (future) interleave
  soundness hazard the Rust port already solves with `state.furthest_offset` fields.
  **Disposition: parse-that-HANDOFF (HIGH — architectural soundness).** Thread the error
  state onto the instance; `reset()` shrinks to (then loses) the packrat clear. The
  `console.error` leak (F7 below) is downstream of this same subsystem — its architectural root.
  See parse-that charter **PT-WAVE-1**.

**Do NOT add packrat. ALREADY-SOTA (do not touch):** the parse-that leaf engine —
mutable single-state with offset-rewind, zero-alloc `regex`/`string`/whitespace leaves,
the `dispatch` primitive, the identity-keyed result cache, the `chain`-based at-rule
dispatcher (`stylesheet.ts:490`, the *one* place value.js already dispatches).

### Wave B — Color-interpolation hot path (the serializer + channel plan + output-space)

A color property is **~40× a numeric property per frame**, and ~2/3 of that is
serialization, not science (E `d-color-interp`: hex sRGB lerp = 98 ns; +`toString` =
294 ns; `Color.toString` alone = **191 ns** emitting a **73-char** string the browser
re-parses every frame). `vj-color-interp-aug §1` re-walked the live per-frame path
line-by-line and pinned every allocating line.

| # | Item | Where | Gate | Iso | Diff |
|---|------|-------|------|-----|------|
| **B1** | **Zero-alloc, fixed-precision color serializer** for the apply path. **NET-NEW seam fact** (`vj-color-interp-aug §2.1`): value.js **already has** `Color.toFormattedString(digits)` (`color/index.ts:202-208`) — the *precision* half exists; the *zero-alloc* half does not (it still does `values().slice(0,-1).map()` = 3 arrays). Extend it into `toAnimationString(digits, outputSpace?)` writing channels into a **reused** scratch buffer | `color/index.ts:191-208` | apply-path serialize ns + per-call allocation → 0; output ≤ ~28 chars vs 73; defended by the §2.7 color bench | **Sub-JND** (4–5 sig-figs ≫ `DELTA_E_OK_JND=0.02`); `toString` stays full-precision for round-trip/`format.ts` | [F-SHARPEN] |
| **B1b** | ★ **`formatColor` unconditionally emits `/ ${alpha}`, even at alpha=1** (re-confirmed live, `color/index.ts:18-19`): an opaque `oklab(…)` serializes as `oklab(… / 1)` — ~4 wasted chars/keyframe the browser re-parses + a divergence from the canonical opaque form. Emit the alpha clause **only when `alpha !== 1`** (the single choke point both `toString` + `toFormattedString` call) | `color/index.ts:18-20` | opaque serializes without `/ 1`; alpha<1 unchanged; round-trip parity | **Isomorphic-to-canonical** (the UA treats `oklab(a b c)` ≡ `oklab(a b c / 1)`); a befitting byte-shrink | [F-NEW] |
| **B3** | **Channel-plan precompute** — freeze a closure-free numeric channel plan at `prepareInterpVar`; flatten `lerpColorValue` to a flat `for` over a numeric array. **NET-NEW: the EXACT per-frame garbage named** (`vj-color-interp-aug §2.2`): every frame `lerpColorValue` (`interpolate.ts:57-94`) allocates a fresh `keys()` array (`:67`), a fresh arrow closure (`:67`), per-channel `unwrapDeep` `instanceof`-loops (`:70-71`) re-deriving an invariant, and dynamic `color[key]` reads (`:68-69,86`). **Constraint: must mutate in place — no per-frame `Color.clone()`** (§2.5) | `interpolate.ts:57-104,143-148` | byte-identical lerp output; per-frame closures/`keys()`/`unwrapDeep` realloc → 0 (a `proof:color-frame` zero-alloc counter); bench the ~85 ns lerp floor | **Pure refactor — byte-identical** (mirrors the `_lerp` predispatch already there) | [F-SHARPEN] |
| **B5** | **`interpolateHue` degree-domain overload** — drop the per-hue-channel `÷360 … ×360` round-trip (`interpolate.ts:78-81`); fold into B3's frozen plan (the modular `((x%1)+1)%1` becomes `((x%360)+360)%360`) | `interpolate.ts:73-81`, `dispatch.ts:234-268` | algebraically identical; per-hue div/mul/double-mod removed | **Isomorphic within FP epsilon**; bundle with B3 | [E v1] |
| **B2** | **Output-space targeting** — serialize a stored-oklab color *as* a requested output space. **CORRECTED rule** (`r-color-l4-l5 §3`, `vj-color-interp-aug §2.6`): v1's "emit legacy pairs as `rgb()`" is **wrong** as a blanket WAAPI rule (forces sRGB interp, diverging from a default-`oklab` request). The corrected rule: **the emit space must be chosen so the UA's *implicit* interp space equals the *requested* `colorSpace`** — default `oklab` → emit non-legacy regardless of input family; explicit `srgb` → `rgb()`. B2-as-`rgb()` is still right for *gradient/`color-mix`* and explicit-sRGB | `color/index.ts` `toString` + `outputSpace` option | round-trip parity per space; a default-`oklab` animation emits non-legacy endpoints; an explicit-`srgb` animation emits `rgb()` | **More isomorphic to platform** — carries the corrected rule into the §5 WAAPI serializer | [F-SHARPEN] |
| **B4** | **Egress gamut target** — gamut-map to the egress RGB space's *own* gamut, not unconditionally sRGB. **The one real wide-gamut correctness gap** — a `color(display-p3 …)` animation is sRGB-clipped on output today (`conversions/xyz-extended.ts:74`, `direct.ts:79,157`); `display-p3` Baseline 2023 | `conversions/xyz-extended.ts`, `direct.ts` | a `display-p3` animation stays in P3; identical on sRGB displays | **More isomorphic** — current sRGB-clip silently desaturates P3-only colors | [E v1] |

**The unifying gestalt** (`vj-color-interp-aug §3`): **B3 (color channel plan) and D2
(numeric SoA) are the same architectural move — freeze the per-frame walk into a flat
numeric loop — applied to the two carriers.** Sequence them together.

**Cross-repo edge (W9 S4 — see §5):** B1/B2 unlock kf's WAAPI native-color lift. The
mechanism is **corrected** (§5): `color`/`background-color` are **main-thread**, not
compositor — the win is NOT thread-offload; it is eliminating value.js's per-frame
`lerpColorValue` + 73-char serialize + reparse churn.

**MEASURE-FIRST precondition (`vj-color-interp-aug §2.7`):** the color-interp bench is
**ABSENT on both repos** — `bench/interpolation.bench.ts` has 3 cases, **zero color**.
The single most expensive lane (~40×/frame) is unmeasured. **Author a color-interp bench
case (hex/rgb/oklch/hsl) — kf-authorable — as the gate substrate before any B1/B3 win is
asserted.** This is the §Mandate's measure-first floor for this wave.

**ALREADY-SOTA (do not touch):** one-time space collapse at frame-prep
(`color/normalize.ts:112`, no per-frame conversion); analytical Ottosson gamut map
(**ahead of shipping browsers** — `r-color-l4-l5`, modern-web-guidance `css`);
premultiplied-alpha + `none`/NaN + four hue methods; `hueMethod` default `shorter`
**exactly matches CSS Color 4 §12.4** (`dispatch.ts:238`); XYZ-D65 hub + `DIRECT_PATHS`;
`deltaEOK`+JND; **the full L4/L5 functional color surface** (15 spaces, RCS `from`,
`color()`/`color-mix()`, runtime color-name registry — `color.ts:556-571`).

### Wave C — The computed-unit boundary (the REAL D-3 win — cross-repo edge)

The headline cross-repo finding. kf traced D-3 *into value.js* and correctly withheld it.
**F sized it empirically** (`vj-units-compute-aug §2`). The hot path, re-grounded live:
`lerpComputedValue` calls `getComputedValue(start)` + `getComputedValue(stop)` **every
frame** (`interpolate.ts:28-29`); `getComputedValue` is `memoize`d but the **key is
rebuilt every call** — `` `${value.toString()}-${getElementId(target)}` `` (`normalize.ts:195-196`)
— a full `ValueUnit` serialization + `Date.now()` + 2× `Map` ops, per HIT, to retrieve an
O(1)-invariant pair.

| # | Item | Where | Gate | Iso | Diff |
|---|------|-------|------|-----|------|
| **C1** | **Cache resolved `(newStart, newStop, newUnit)` on the `InterpolatedVar`** at `prepareInterpVar` time (the shape already carries `_lerp`/`colorSpace`/`hueMethod` precomputed — the natural home); per-frame `lerpComputedValue` collapses to a bare `lerp`. Invalidate on `setTargets`. **MEASURED: ~190 ns/leaf/frame → ~1.2 ns (−99.3%)** | `interpolate.ts:17-40,143-150` | **`proof:computed-frame`** — a `toString`/`getComputedStyle` **call-counter** asserting O(1)-per-frame + a wall-time delta; a `setTargets` re-resolve test. **Named but unlanded in BOTH repos** (vj has 0 tests touching `getComputedValue`); the bench ships WITH the cache | **Pixel-identical** — same resolved values, cached | [F-SHARPEN] |
| **C2** | **Stable-identity memo key** — key on a per-`ValueUnit` monotonic id (or `WeakMap`) so a HIT pays **0** `toString()`. The fallback for the external/unprepared path. **MEASURED fallback: ~8.5 ns (−95%)** | `normalize.ts:195` | a HIT pays 0 `toString()`; byte-identical px | **Pixel-identical** — cheaper key | [F-SHARPEN] |
| **C3** | **Batched resolve** — resolve a *set* of leaves against a target in one write→read pass, cutting cold-path forced reflows from N-per-target to 1 (the cold path forces a synchronous layout flush, `normalize.ts:162-168`) | `normalize.ts:136-205` | forced-reflow count → ~0 steady, 1-per-target cold | **Pixel-identical** — same used-value math, batched | [E v1] |
| **C4** | **`ttl===Infinity` fast path in `memoize`** — skip the `Date.now()` read on every hit when no TTL set (`getComputedValue`'s case — the clock read is currently *dead* since `now - ts <= Infinity` is always true). Bundle with C2 | `utils.ts:125` | clock read elided on the `ttl===Infinity` path | **Identical** | [E v1] |
| **C5** | **`convertToPixels` length-unit coverage — fix the 24 no-op units.** **COUNT CORRECTED: 24 of 45 declared** (`vj-units-compute-aug §3`: 7 absolute + 38 relative; only 14 relative resolved). The `sv*`/`lv*`/`dv*` 18-member family + `vi vb cap ic lh rlh` fall to `convertAbsoluteUnitToPixels` which **returns the raw number unchanged** (`utils.ts:271,351`, re-confirmed live) — `50dvh`→`50px`, silent wrong pixels. Fill the `cq*`-pattern path; add a **fail-loud** branch for unrecognized relative units | `units/utils.ts:255-355`; decls `constants.ts:1-45` | a **full 38-relative-unit endpoint test** asserting non-identity — any relative unit returning `value` unchanged is a bug. **The test suite cannot catch it today** (jsdom has no layout; vj tests only the 6 absolute units) | **Fixes *wrong pixels*** — Baseline 2022–2023. WAAPI excludes computed units → the rAF resolver is the only consumer; **kf has NO workaround** | [F-SHARPEN] **HIGH correctness — can LEAD Wave C** |
| **C6** | **`COMPUTED_UNITS` classification decision** — bare `vh`/`cqw` bake to px at compile and go **stale on resize** (no `ResizeObserver` anywhere in kf `src/animation/` — re-confirmed), diverging from the WAAPI path. **Owner decides** freeze-vs-re-resolve; the **`@property` path supersedes it for registerable DOM targets** (already built, kf E.W9) | `units/constants.ts:54`; `normalize.ts` | named + tested contract | **Behavior change on resize** if re-resolve (flag for owner); "name it frozen + test it" is zero-pixel | [F-SHARPEN] owner-scoped |
| **C7** | **`getComputedValue` memo eviction/invalidation** — unbounded + never busted on resize (a `100vh` animation paints pre-resize pixels for the page's life). Bound + scope to a **layout epoch** (a generation counter bumped on `ResizeObserver`/`resize`) | `normalize.ts:136-205`; `utils.ts:97` | resize busts the relevant entries; bounded under long-lived cycling | **More correct on resize**, stable otherwise | [E v1] |

**The platform supersession (the SOTA frame for C1/C3/C6 on DOM targets,
`vj-units-compute-aug §5`).** The SOTA mechanism for interpolating `calc()`/`var()`/length
is a registered custom property (`@property`/`CSS.registerProperty`), animated natively on
the compositor, live-resolved, correct on resize. **kf E.W9 already landed the
registration** (`engine.ts:1132-1147`, feature-detected, Baseline 2024-07-09) and value.js
already preserves the lossless `syntax` string (F4, closed). So the platform fast-lane is
mostly built. **This reframes C1/C3/C6 as the JS-path correctness floor for non-DOM
targets** (plain-object / canvas / Three.js) **and unsupported engines** — C1 is still
worth landing (it serves targets with no `@property` path at all). **Disposition: BOOK**
the supersession itself (larger than this lane; overlaps the WAAPI/scroll lanes).

**Cross-repo edge (FOLD-F).** kf consumes the **entire** Wave C fix unchanged — the
barrels are gone, there is no kf normalize surface to migrate (`a-vj-consumption-F §0.3`,
`vj-units-compute-aug §6`). C5 in particular **bites kf today** and is the cleanest
falsifiable gate in the whole charter.

**ALREADY-SOTA (do not touch):** `shouldCache` on `isConnected` (suppresses the cache for
disconnected targets — a subtle correctness guard); `getElementId` via `WeakMap`; the
dispatch pre-resolution; **DOM-correct, writing-mode-aware container-unit resolution**
(`cqi`/`cqb` select inline/block — only the `sv*` *sibling* units C5 covers are missing).

### Wave D — The interpolation carrier (RE-POINTED by measurement · named tranche, gated)

The largest *structural* per-var win, and the riskiest — it touches the `InterpolatedVar`
contract. **F ran the bench E withheld and re-pointed the wave** (`r-interpolation-carrier`,
the interpolation half integrated by `vj-color-interp-aug §3`).

| # | Item | Where | Gate | Iso | Diff |
|---|------|-------|------|-----|------|
| **D1** | **DEMOTED — a measured non-win.** A monomorphic `{value}` cell / frozen-shape `ValueUnit` is *within noise of, and at K=1 slower than,* the megamorphic carrier (node v26/V8; corroborated `r-v8-cost-model F-3`). The store IC for `value.value = lerp(...)` on a megamorphic receiver with a stable-offset `value` field is **not** the "dictionary-style lookup" v1 feared. **Keep only the constraint that the serialize-boundary reconstitution round-trips exactly** | `units/index.ts:7-20`; `interpolate.ts:97,143` | — (recorded measured non-win) | — | [F-SHARPEN] |
| **D2** | **PROMOTED — the real lever: SoA `Float64Array` interp primitive** `lerpArray(Float64Array, Float64Array, t, out)`. Measured **~2.0× at K≥8, ~2.3× at K=64** (the win is AoS pointer-chase + per-`iv` closure-call elimination, not monomorphization). **Feasibility proven** (`r-interpolation-carrier F-2`): the numeric inner loop reads **only** `{value}` of the 6-field carrier — `unit`/`superType`/`property`/`subProperty`/`targets` are prepare/serialize-time only → SoA is pixel-identical (reconstitute `ValueUnit` at the serialize boundary) | new value.js primitive | a **representative-K** bench over the demo's actual frame distribution (NOT synthetic K=64 — the win is absent at K=1); typed-array win decisive at K≥16, no regression at K≤4. **Inter-lane magnitude dispute recorded** (`p-runtime-perf-F P-4` measured 6.2× mega/mono but AGREES SoA is the lever — gate MUST use real-K) | **Pixel-identical** | [F-SHARPEN] |

**KILL (recorded, `r-interpolation-carrier F-4`):** CSS Typed OM (`CSSUnitValue`/
`CSSNumericValue`) as a carrier — it *allocates* per `.add`/`.mul`, its perf story is vs
the string-CSSOM baseline kf does not use, and it is DOM-coupled (breaches the light/heavy
boundary). Recorded so a future "modernize the carrier to Typed OM" pass does not regress
the zero-alloc in-place core.

**Cross-repo edge (FOLD-F).** D2's typed-array primitive is what kf's `NumericAnimation`
`Float64Array` substrate would adopt — and `r-interpolation-carrier F-3` shows the kf-side
SoA-segment compile is a **kf-local wave that does not need value.js** (the layout lives on
the kf side). D2 (numeric SoA) and B3 (color channel plan) are the same architectural move.

**ALREADY-SOTA (`r-interpolation-carrier F-5`):** Motion (stateless fn over numbers) +
GSAP (AoS PropTween) both confirm kf's `NumericAnimation` SoA core leads the field; the
single carrier gap is the value.js keyframe carrier. The pre-resolved monomorphic `_lerp`
dispatch is correct — the *carrier* it mutates (D2) is the issue, not the dispatch.

### Wave E — Easing & math spec-coverage (parsers for existing evaluators)

The highest-leverage-per-line wins in the lane: the *math is already written*, only the
parse/wire bridge is missing.

| # | Item | Where | Gate | Iso | Diff |
|---|------|-------|------|-----|------|
| **E1** | **`linear()` parser** → `LinearStop[]` feeding the existing `cssLinear` evaluator (`easing.ts:33`; the `LinearStop` shape exists at `:28`; **no parser produces stops** — re-confirmed live). **RE-SCOPED: severed on the value.js end ONLY** — kf's E.W7 S5 landed the reader but with a **kf-local regex+`split` shim** (`parseLinearStops`, `utils.ts:106-130`). Structural fit: a `sepBy(comma)` of `all(utils.number, percentage.opt(), percentage.opt())` per CSS Easing L2 | `easing.ts:33,28`; `index.ts:230` | `parseCSSValue("linear(0, 0.5 25% 75%, 1)")` → structured stops → `cssLinear`; **round-trips kf's own emitted spring** `linear(0, 0.234 4.17%, …, 1)` (the `springLinearStops` corpus — `px-kf-grammar PX-3` is the byte-match lock) | **Additive** — degenerate `linear()` becomes structured. **Baseline Widely-Available 2026-06-11** | [F-SHARPEN] **MED-HIGH** + **RECORDED kf F-PARSE-1** (retire the `parseLinearStops` shim when E1 lands — the no-legacy collapse) |
| **E2** | **`steps()` argument parser** → `{count, jumpTerm}` feeding `steppedEase`. Same shape as E1; kf re-implements locally (`STEPS_LITERAL`) | `easing.ts:293` | parsed args round-trip to `steppedEase` | **Additive** | [F-SHARPEN] LOW-MED, bundle E1 |
| **E3** | **`cssLinear` flat-segment tie-break** — at a shared input the spec returns the **last** matching point's output; current code returns the **left** (`easing.ts:92-95`) | `easing.ts:80-99` | shared-input sample yields the later stop | **Non-iso only at a measure-zero shared-input sample** — befitting (spec) | [E v1] bundle E1 |
| **E4** | **Precomputed sample-spline + slope-gated cubic-bezier solver** (WebKit `UnitBezier`): 11-sample `X(t)` table once, O(1) bracket, Newton(4) gated on slope, replacing Newton(8) + a 64-iter bisection fallback | `easing.ts:136-170` | same root within 1e-7, fewer iterations; bisection essentially never fires. (NB `a-framecompiler-remeasure §5`: this is a value.js-easing concern, NOT a FrameCompiler one) | **Isomorphic within tolerance** — more accurate + faster | [E v1] |
| **E5** | **calc dimensional-type fold (perf + correctness)** — `evaluateMathFunction` re-walks the AST **twice** (`:288` + `inferResultUnit` `:488`) and mis-types `calc(100px / 2px)` → `px` (should be **unitless** 50). One annotated `{value, unit, superType}` fold implementing the L4 §10.10 type algebra removes the second traversal **and** fixes the heuristic. **DOES matter to kf** (`a-vj-consumption-F §3`): kf pairs frames by `(property, subProperty)` and the resolved unit drives `getComputedValue` dispatch — a mis-typed calc routes to the wrong branch | `math.ts:473,488,503-506` | an L4 type-algebra table test (`calc(100px/2px)===50` unitless, `calc(100%/2)===50%`); one traversal | **Befitting** — the *changed* outputs are currently **wrong** | [E v1] |
| **E6** | **`env()` parser** + **structured `var()` capture** (`{name, fallback}`, feeds Wave C) + **realign the BBNF `attrFn` to the L4 `type()` grammar** | `index.ts:224,26-48`; `css-values.bbnf:82,85` | `env(--x, fallback)` parses; `var()` exposes name+fallback | **Additive** | [E v1] |
| **E7** | **`calc-size()` parser** → math-function set: a basis arg + a `<calc-sum>` over the `size` keyword. A bounded extension of `createCalcParser` (`math.ts:48`) — parsing ≠ requiring browser support. The *engine* side (height→auto) stays GAP-NAMED (its own wave) | `math.ts:48,200` | `calc-size(auto, size + 20px)` parses to a structured node; round-trips | **Additive** — the native primitive for the most-requested animation the library can't do | [E v1] |

**Cross-repo edge.** E1 pairs with kf's landed E.W7 S5 reader (now whole); F-PARSE-1
retires the kf shim onto it. E7 pairs with kf's GAP-NAMED intrinsic-size engine path
(`interpolate-size`/`calc-size()` is **limited availability** Chrome/Edge 129 — a guarded
enhancement, not a Baseline drop-in; `r-waapi-platform-2026 §3`).

**ALREADY-SOTA (do not touch):** the full L4 math-function set + constants with boundary
guards; `steppedEase`/`jump-*`; `cssLinear` core (modulo E3); `bezierPresets` single
source of truth.

### Wave F — Surface, robustness & spec-completeness (lower priority, bundle)

| # | Item | Where | Gate / disposition | Iso | Diff |
|---|------|-------|--------------------|-----|------|
| **F1** | **Unify the two matrix decompositions** — wire the rigorous `interpolateDecomposed`/`decomposeMatrix3D` (Gram-Schmidt, quaternion slerp, det-flip) into the live path and **delete** the naive Euler `unpackMatrixValues` 3D branch (gimbal-locks, double-counts skew) | `transform/decompose.ts:227` (orphan) vs `units/utils.ts:197-232` | `matrix3d` rotation/skew matches the browser; re-baseline snapshots. **Net LOC drops.** Add the `slerp` `acos` domain clamp | **Non-iso — changes pixels** (toward browser behavior) | [E v1] |
| **F2** | **Context-dependent color keywords** — `currentColor` (Baseline, hard parse-fails today), `light-dark(a,b)` (**Baseline 2024-05-13**, in the `.bbnf` but absent from the live parser, `color.ts:556-571`), system colors. Each → a **sentinel** kf resolves via the computed seam. **NET-NEW caveat** (`r-color-l4-l5 §4`): resolve `light-dark()` against the **animation target's own** computed `color-scheme`, **not** `:root`'s, not a global `matchMedia` probe — binding on the W9 S6 policy | `color.ts:556`; BBNF `css-color.bbnf:90-124` | parser deep-equal + each sentinel resolves per-target | **Befitting / additive** — resolving from the target's computed value is *more* isomorphic than today's hard parse-fail | [F-SHARPEN] HIGH (currentColor/light-dark) |
| **F2b** | **`contrast-color()`** — **Baseline CONFIRMED 2026-04-10** (Chrome 147 / Firefox 146 / Safari 26, tri-engine). **Binding guard** (`r-color-l4-l5 §5`): the shipped spec function returns **only black or white**; value.js's `safeAccentColor` (`contrast.ts:90`) is a **richer, different** function (hue-preserving OKLCH shift). A spec-faithful parser must **NOT** alias to `safeAccentColor` — expose **two** surfaces. The `.bbnf` still encodes the **abandoned** `color-contrast()` `vs`/list form (doubly-stale) | `color.ts:556`; `contrast.ts:90`; `css-color.bbnf:95-101` | `contrast-color(red)` parses + resolves to black/white | **Additive** | [F-SHARPEN] MED, BOOK-opportunity |
| **F3** | **Bounded LRU memo — the single most-named item** (merges `tryParseCache` eviction + the value.js result/normalize caches; `a-parsing-post-e F-5`, `p-parse-perf-F F-P2`, `a-engine-post-e F-ENG-7`, `r-v8-cost-model F-4` all converge here). `memoize` defaults `maxCacheSize = Infinity` (`utils.ts:114`) and when capped evicts **FIFO not LRU** (`cache.keys().next().value`, `:142`). Unbounded growth for the editor per-keystroke path. **The value.js *primitive* carries the bound** — so E's demo-scoped `tryParseCache` withhold stays correct (the demo working set is bounded; the primitive must be safe by construction) | `utils.ts:108-153` | a flood test: `cache.size <= cap` + a recently-touched key survives a flood (the LRU property FIFO fails) | **Iso** — HITs byte-identical, only cold-eviction timing changes | [E v1] **the chronic terminal home for the unbounded-memo hazard** |
| **F5** | **Quantizer determinism + off-thread** — seedable PRNG (mulberry32) for k-means++ (`cluster.ts:199` `Math.random()`) + an async/yielding `quantizePixelsAsync` (3.2M distance-evals synchronously blows the INP budget) | `quantize/cluster.ts:199`; `quantize/index.ts:97` | reproducible palette for a fixed seed; quantize yields off the interaction critical path | **Iso** (seed makes nondeterminism deterministic; async is same-output-different-scheduling) | [E v1] (no direct kf consumer) |
| **F6** | **Surface hygiene / sub-path exports — WIDENED** (`a-boundary-arch-F`): from "parser-free easing sub-path" to **"easing + leaf-math" sub-path** (`@mkbabb/value.js/math`) so kf can **DELETE `internal/leaves.ts`** and static-re-export the canonical `clamp`/`scale`/`lerp`, dissolving the un-gated byte-parity burden. Plus `quantize`/`transform/decompose` sub-path exports (tree-shake liability — no kf consumer imports them statically) | `index.ts:294-310`; `easing.ts` | export-graph reshaping only | **Iso** — enables kf's playground image→palette demo + named-easing re-export | [F-SHARPEN] |
| **F7** | **The `console.error` custom-color-name leak.** `parseCSSColor` (`color.ts:613-628`) runs the rich parser **first**, then falls back to the custom-name map — so the first attempt **must** fail, and the top-level `parseState` (`parser.ts:59,63`) fires `console.error(state.toString())` on **every** parse of a registered custom color name. **Fix (b): reorder to try the name map first** (bounded, iso). **Severity RE-SCOPED for the kf consumer** (`p-parse-perf-F F-P5`): LOW-on-malformed-input, not hot-path-catastrophic — kf's grammar succeeds via the `CSSString` catch-all so the top-level `parseState` rarely errors. The architectural root is the parse-that error-state move (parse-that charter **PT-WAVE-1**); the value.js reorder is the cheap surface fix | `color.ts:613-628`; `parser.ts:59,63` | no console I/O on the custom-color-name path; diagnostics behind `isDiagnosticsEnabled()` | **Pure observability change** — strictly faster + quieter | [F-SHARPEN] HIGH, cheap, iso |

**NET-NEW Wave-F items the F audit ORIGINATES** [F-NEW]:

| # | Item | Lane | Disposition |
|---|------|------|-------------|
| **F8 (VJS-2)** | **Buffer-reusing `unflattenObjectToString`** — write into a caller-supplied map, pre-compile the static skeleton. This is the **real per-frame garbage** the W7 Strand-B "diff-skip" chased (MF-4 — settled: E's own measurement showed the diff-skip saves ~0; the alloc is the serialize, **value.js-owned**) | `a-engine-post-e F-ENG-2`, `a-runtime-remeasure RM-3` | **value.js-HANDOFF** — the serialization alloc; kf must NOT re-open the diff-skip |
| **F9 (VJ-F1)** | **Path-geometry sampler** for MorphSVG/DrawSVG + the MotionPath heavier half (`getPointAtLength`/`getTotalLength` curve sampling) — value-domain geometry | `r-anim-libs-2026 F26-1b/1c` | **value.js-HANDOFF (BOOK)** |
| **F10 (VJ-F2)** | **Structured parse-error sink** (csstree `onParseError` shape) so kf can surface a `diagnostics` channel instead of value.js's silent-swallow / `console.error`. Pairs with the §4 parse-that error-state move and `px-kf-grammar PX-5` (kf is diagnostics-blind on a malformed parse) | `px-kf-grammar PX-5`, `px-parse-that-arch §4` | **value.js-HANDOFF + kf BOOK** |

---

## 2. The two CLOSED items — strike from the open ledger

These v1 items are **resolved** by the F consumer-side verification — do NOT re-carry or
re-defer them (`a-vj-consumption-F §0.2, §2`, deferred-ledger XR-1):

- **§2 rename (`AnimationOptions → CSSAnimationOptions`, `Color.L`/`Color.components`)** —
  **DISCHARGED at 0.10.0**, the pin kf already ships. The dist exports
  `CSSAnimationOptions`, no bare `AnimationOptions`; kf imports the type name **nowhere**
  (it defines its own local superset, `constants.ts:117`, and consumes the extractor
  structurally via `ReturnType<typeof extractAnimationOptions>`). The `Color.*` half is
  **vacuous** (kf imports `Color` nowhere — 0 grep hits). **No pin-bump, no migration,
  nothing waits on v1.0.0.** v1's "the one chronic unowned cross-history item" is closed.
- **F4 `@property` `syntax`/`inherits` lossless round-trip** — **CLOSED by verification.**
  value.js stores `syntax` as the raw quote-stripped author string
  (`stylesheet.ts:386` — it does NOT re-serialize from an AST, so `<color>+` multipliers
  and `|` unions survive byte-exact); kf feeds it verbatim to `CSS.registerProperty`
  (`engine.ts:1132-1147`). kf's registration is **NOT lossy**. Strike v1's "small surface
  add if not" branch.

**Two recorded drifts (substance unchanged):** the `any()` site count is **58 live**, not
v1's "65"; the C5 no-op count is **24 of 45 declared**, not v1's "24 of 43" (the no-op set
is still exactly 24).

---

## 3. The chronic seam — RESOLVED (was v1 §2)

v1 §2 carried `AnimationOptions → CSSAnimationOptions` as the one chronic unowned
cross-repo seam, dispositioned "a kf-side pin-bump when value.js publishes v1.0.0." **F
strikes it** — it is discharged at the current 0.10.0 pin (§2 above). The two ledgers
(kf→vj here; vj→kf in value.js's own coordination docs) need no v1.0.0 reconciliation for
this item; it is already transparent.

---

## 4. Proposed sequencing (owner-discretionary)

```
parse-that-HANDOFF (upstream — owned by parse-that-sota-handoff.md) ──────────────────────
   ├─ PT-WAVE-1: thread the error-state onto ParserState (HIGH, soundness) ── unblocks F7 + F10 ── FIRST
   └─ PT-WAVE-2: ISOLATE + re-key the unsound id-keyed packrat; strip the reset tax (MED) ── AFTER PT-1

Wave A (parse fast tier) ─── isomorphic, leverages existing primitives ────────────────── FIRST
   └─ A2 (maximal-munch unit classifier) LEADS — latent-correctness + worst arm
   └─ A6 + F7 are cheap standalone wins; the cssParser adoption (PX-2) is the gated multi-week tranche AFTER

Wave C (computed-unit boundary) ── the cross-repo D-3 win, MEASURED −99.3% ─────────────── HIGH
   └─ C5 (24-of-45 no-op units) LEADS — standalone correctness, cleanest gate, bites kf today
   └─ C1 endpoint cache ships WITH proof:computed-frame; C2/C4 are the −95% fallback

Wave B (color hot path) ──── ~40×-per-frame lane; B3 is pure refactor ──────────────────── HIGH
   └─ author the color-interp bench FIRST (absent on both repos — the gate substrate)
   └─ B1/B1b/B2 unblock the §5 WAAPI color lift (B2 emit-space rule corrected)

Wave E (easing/math parsers) ── additive, math already written ─────────────────────────── MED-HIGH
   └─ E1 linear() — Baseline-WA this month; round-trip whole when it lands + kf retires its shim (F-PARSE-1)

Wave D (interp carrier) ── RE-POINTED: promote D2 SoA, demote D1; named tranche, gate on real-K ── MED (gated)

Wave F (surface/robustness) ── F3 (the chronic LRU home) + F7 cheap+iso; bundle the rest ── LOW-MED
```

**Every wave is measure-first.** The deepest findings (D2 SoA, C1/C2 memo-key cost, B1
serialization) are **invisible to allocation-dominated microbenchmarks** and surface only
under long-running, buffer-reusing, INP-under-load playback. The gates that must bite:
`proof:computed-frame` (call-counter + forced-reflow), a **color-interp bench (absent in
both repos — author it)**, a real-K SoA bench (NOT synthetic K=64), and the C5 38-unit
non-identity test.

---

## 5. The two genuinely-open W9 color seams (the corrected cross-repo mechanism)

These are the kf-blocked-on-value.js items where the kf half is either landed or
structurally free — carried forward with F's mechanism corrections.

**W9 S4 — native WAAPI color (the 4-CLAUSE HARD-EQUALITY gate).** [F-SHARPEN]
`r-color-l4-l5 §2-3`, `vj-color-interp-aug §5`, `a-vj-consumption-F §2`. Live: kf
hard-blocks ALL color from WAAPI (`waapi.ts:153-157`); value.js has no
`cssColorInterpKeyword` (grep = 0) and no non-legacy space-preserving serializer.
**Mechanism correction (binding):** `<color-interpolation-method>` is a CSS *data type*,
**NOT a settable property** — for animations the interp space is chosen *implicitly* by
the keyframe color syntax family (CSS Color 4 §12: OKLab for non-legacy, sRGB for legacy).
So the gate is a **4-clause hard equality**, narrower than v1's "match-or-pin":

> A color `InterpolatedVar` is WAAPI-admissible **iff ALL**: (1) both endpoints serialize
> to a valid CSS color string; **AND** (2) `options.colorSpace` is matched by emitting
> endpoints in a syntax family whose *implicit* interp space equals the request — default
> `oklab` → emit **non-legacy** regardless of input family (the corrected B2 rule);
> explicit `srgb` → `rgb()`; **AND** (3) `hueMethod` is unset or `shorter` (the only one
> WAAPI expresses; vj default `shorter` *matches* CSS Color 4 §12.4); **AND** (4)
> `colorSpace` is **not `hsv`** (no CSS `<color-interpolation-method>` counterpart).

**value.js half (HANDOFF):** `cssColorInterpKeyword(space, hueMethod)` + the non-legacy
space-preserving serializer (B1 `toAnimationString` extended with `outputSpace`).
**kf half (FOLD-F):** replace the blanket reject with the 4-clause gate; emit color
endpoints in `toWAAPIKeyframes`. **Measure-first:** the win is removing per-frame JS color
cost (~290 ns/frame), **NOT compositor offload** (`color`/`background-color` are
main-thread — the D-6 correction stands). Needs the color bench.

**W9 S6 — `currentColor` / `light-dark()` sentinels.** [F-SHARPEN] Live: these still don't
parse (`color.ts:556-571`); kf has 0 policy because the inputs hard parse-fail. **value.js
half (HANDOFF):** emit a **sentinel** (`ValueUnit("currentColor", "color-keyword")` /
`FunctionValue("light-dark", [c1,c2])`) that does NOT bake to a fixed RGB. **kf half
(FOLD-F):** resolve per-target at frame-prep via the computed seam — and (the NET-NEW
caveat, §F2) `light-dark()` against the **target's own** computed `color-scheme`, not
`:root`'s. **Priority:** `currentColor` HIGH, `light-dark()` HIGH (Baseline 2024-05-13,
feature-detect for sub-Baseline), system colors MED.

---

## 6. The cross-repo edge — what kf needs, what kf owns

The boundary is **architecturally sound and STRUCTURALLY CLEANER since v1** — the kf
re-export barrels are **gone**; kf imports value.js directly at 9 heavy sites, reached
only via `loadAnimationEngine()`, and the light orchestration tier carries **zero** static
value.js edge (`a-vj-consumption-F §0.3, §1`; CI `proof:boundary` guards it).

| Win | value.js owns (this hand-off) | keyframes.js owns (FOLD-F) |
|-----|-------------------------------|----------------------------|
| **Computed-unit perf (D-3)** | C1 endpoint cache; C2/C4 memo-key; C3 batched; C5 unit coverage; C7 eviction | consumes **unchanged** via `iv._lerp` (no kf normalize surface); `proof:computed-frame`; the resize contract |
| **Color hot path** | B1/B1b serializer; B2 (corrected emit-space); B3 channel plan; B4 egress gamut | the color-interp **bench** (kf-authorable, gate substrate); WAAPI color eligibility lift (S4) |
| **WAAPI color (S4)** | `cssColorInterpKeyword` + non-legacy serializer | the **4-clause gate** replacing the blanket reject; emit L4 endpoints in `toWAAPIKeyframes`; keep custom-space on JS |
| **Context color keywords (S6)** | F2 `currentColor`/`light-dark()`/system sentinels; F2b `contrast-color()` | per-target resolution via the computed seam — `light-dark()` against the **target's own** `color-scheme` |
| **`linear()`/spring** | E1 parser; E3 tie-break | reader **LANDED** (E.W7 S5); **F-PARSE-1**: retire the `parseLinearStops` shim onto E1 when it lands (no-legacy collapse) |
| **`@property` native interp** | F4 lossless `syntax` — **CLOSED by verification** | `CSS.registerProperty()` + WAAPI wiring — **LANDED** (E.W9) |
| **Carrier (D2)** | the SoA `lerpArray` primitive | `NumericAnimation` `Float64Array` substrate — a **kf-local** wave (the layout lives on the kf side; does NOT need value.js) |
| **`unflattenObjectToString` alloc (F8)** | buffer-reusing serialize | kf must NOT re-open the W7 diff-skip (settled saves ~0) |

---

## 7. ALREADY-SOTA — manufacture NO work here

Consolidated so the hand-off invents no value.js work where it already leads (the F audit
re-confirmed all of this live, post-E):

- **The parse-that engine** — mutable single-state with offset-rewind, zero-alloc
  `regex`/`string`/whitespace leaves, the `Int8Array(128)` `dispatch`, the identity-keyed
  result cache, the `chain`-based at-rule dispatcher — **and `parsers/css/` already
  hand-writes the single-pass first-char-dispatched reader the field converged on** (the
  gap is *adoption*). **Do NOT add packrat** (dispatch obviates it; the existing one is
  unsound — KILL).
- **value.js grammar BREADTH** — 15 color spaces, RCS `from`, `color()`/`color-mix()`, the
  full L4 math set, `@property`, scroll ranges; the **`nameParser` transposition**
  (`color.ts:527-552`) is the in-repo proof of the dispatch+`Set` pattern.
- **The full L4/L5 functional color surface** in the live parser; **OKLab perceptual
  default + one-time space collapse**; **analytical Ottosson gamut map (ahead of shipping
  browsers)**; premultiplied-alpha + four hue methods; `hueMethod` default `shorter`
  (matches CSS Color 4 §12.4); XYZ-D65 hub + `DIRECT_PATHS`; `deltaEOK`+JND;
  `Color.toFormattedString` (the seam B1 extends, not greenfield).
- **The pre-resolved monomorphic `_lerp` dispatch** (the *carrier* it mutates is the
  issue, not the dispatch); the 6-field `ValueUnit` *as a value-domain type* (correct for
  parsing/serialization — the finding is narrowly that it should not be the per-frame
  numeric substrate, D2 SoA beside it).
- **DOM-correct writing-mode-aware container-unit resolution** (only the `sv*`/`lv*`/`dv*`
  siblings + `vi`/`vb` C5 covers are missing); `shouldCache` on `isConnected`; `WeakMap`
  element ids; the absolute-unit conversions + angle/time/resolution converters.
- **The spring→`linear()` emission** (faithful, leads GSAP/Motion — the only defect is the
  engine couldn't read its own emission back, now whole on the kf end; E1 completes it).
- **The single-dispatch consumption seam** (`lerpValue → iv._lerp`) — lets value.js land
  all of Wave B/C/D with **zero** kf edits. ALREADY-SOTA seam design.

**BOOK (named, not folded):** `progress()`/`media-progress()`/`container-progress()` (the
canonical scroll/anim-driven interpolation primitive, most domain-aligned, but early-WD);
`sibling-index()`/`sibling-count()` (native CSS stagger, limited availability); `random()`
(WD); the *engine-side* intrinsic-size animation path (paired with E7); the path-geometry
sampler (F9, on kf MotionPath graduation); the platform `@property` supersession
(`vj-units-compute-aug §5`); `device-cmyk()`/HDR `dynamic-range-limit` (not Baseline for
the web-animation domain).

---

## 8. inv-16 compliance statement

This is a **HAND-OFF charter**, not a write. value.js is **dirty + active** (branch
`docs/constellation-grand-audit-2026-06-03`, tranche M open). Nothing here edits value.js
**or** parse-that; every item is a *proposal* the respective `@mkbabb` owner sequences,
scopes, and writes against its own tranche discipline (the two **parse-that-HANDOFF** items
— the unsound packrat ISOLATE+re-key and the error-state move — are owned by the dedicated
companion charter `docs/tranches/F/parse-that-sota-handoff.md`, summarized here and
cross-linked, not re-specified).
keyframes.js's paired FOLD-F work (column 2 of §6) is owned by Tranche F and lands
independently; most of it consumes the published value.js surface **unchanged** because
the entire interp path is reached through one dispatch site (`lerpValue → iv._lerp`,
`engine.ts:629`). **Only this file was written by this synthesis lane**
(`_SYNTHESIS-valuejs-handoff-v2`: write ONLY
`docs/tranches/F/valuejs-sota-handoff-v2.md`). Every claim traces to a named phase-1 lane
(cited inline) or a `file:line` re-grounded against the live trees at 2026-06-06; every
SOTA/Baseline claim is dated and modern-web-guidance- or spec-grounded via the cited
research lanes.

---

## 9. glass-ui-HANDOFF — the VT-types enabler (F.W13.S2, inv-16)

**A DISTINCT ledger from the value.js/parse-that columns above.** This section records the
cross-repo item owned by **`@mkbabb/glass-ui`** (the demo's VT/scroll-CSS substrate), not
value.js — kept separate so inv-16's "every enabler recorded against its rightful owner"
holds. The demo writes **nothing** here; it consumes glass-ui's helper and BOOKs the
typed-transition follow-up until glass-ui ships the param.

### H-1 — `startViewTransition` must accept `{ types }` (the 2026 VT-types API) — glass-ui-HANDOFF

**State (verified live, `r-scroll-vt-2026 H-1`).** The demo's most-seen motion is the
scene swap: `demo/app/useSceneTransition.ts:32` calls `startViewTransition(() => mutate(id))`
— the **bare-callback** form. glass-ui 3.2.0's helper
(`node_modules/@mkbabb/glass-ui/dist/useViewTransition-*.js`) is
`let n = t.startViewTransition(() => e());` — it takes a single `mutate` callback and **never**
forwards an options object. The **VT-types API** (`{ update, types }` +
`:active-view-transition-type()`) became **Baseline Newly available 2026-01-13** (Chrome/Edge
125, Firefox 147, Safari 18.2) — AFTER E.W11 was authored, so W11 could only use the bare form.
The engine ships **zero** VT surface (`grep -rn startViewTransition src/` = 0), correctly — the
substrate is glass-ui-owned.

**The hand-off (owner = glass-ui).** The helper grows an overload:

```
startViewTransition(mutate, options?: { types?: string[] })
  → document.startViewTransition({ update: () => mutate(), types })   // object form supported
  → document.startViewTransition(() => mutate())                       // bare-callback fallback
  → { instant-mutate fallback }                                        // no VT at all
```

The `{ finished, transitioned }` return contract is **unchanged**; the PRM degrade already in
glass-ui's `view-transition.css` applies to typed transitions. The demo CANNOT hand-roll
`document.startViewTransition({ update, types })` — that bypasses the substrate's feature-detect
+ instant fallback, re-introducing the exact duplication the boundary forbids (inv-16). So it
routes OUT as a **glass-ui-HANDOFF**, and the consume is BOOKED (B-1).

### Recorded dispositions in this band (named, NOT this wave — each carries its gate)

| Item | Disposition | Gate / reason |
|------|-------------|---------------|
| **B-1 — typed/directional scene-VT** | **BOOK** (gated on H-1 + MEASURE-FIRST) | the one-line demo consume the moment glass-ui ships `types`: derive a direction from the ordered scene list, pass `{ types: [direction] }`, key slide rules off `:active-view-transition-type()`. MEASURE-FIRST: a directional slide of a paused spinning-cube snapshot may read WORSE than the calm cross-fade — verify it composes + the spring stands down (`useSceneSwap.ts`) before shipping. |
| **The `Mod+K` command palette via Invoker** | **BOOK** (the `@click` rewrite **KILLED**) | the single declarative-controls showcase scene behind `'commandForElement' in HTMLButtonElement.prototype` + the `invokers-polyfill` dynamic-import ladder. A wholesale `@click`→`command="--play"` rewrite of a hydrated Vue SPA is LESS legible with NO measured win → gold-plating, KILLED. The minimal VISIBLE shortcuts-discovery trigger SHIPped in F.W15.S3. |
| **`view()` entry-reveal on the easing track** | **BOOK** | PE-only decorative; glass-ui owns the recipe — consume, never hand-roll; scroll-driven did NOT advance to Baseline. |
| **`interpolate-size` / `calc-size()` intrinsic-size** | **RECORD** (don't-adopt-until-Baseline) | `interpolate-size: allow-keywords` is Chrome/Edge 129 only (no FF/Safari). The demo's `0fr→1fr` grid-row trick is a working cross-browser solution and is ALREADY-SOTA — adopting the Chromium-only feature would regress FF/Safari to an instant jump. The engine `IntrinsicSizeValue` wave is GAP-NAMED, gated on value.js `calc-size()` (E7 above). |
| **Fluid display type** (`.text-display-*` rungs) | **glass-ui ASK** | author the fluid rungs once in the dependency (benefits every glass-ui consumer), not a demo override. |
| **SplitText analogue** | **BOOK** (value.js-free) | `splitText({by})` over `Intl.Segmenter`; the demo grapheme/AT-name fix folds into F.W16.S2. |
| **MorphSVG / DrawSVG / numeric MotionPath** | **value.js-HANDOFF VJ-F1** (§Wave F, F9) | the path-geometry sampler; the CSS-native MotionPath sliver ships in F.W12. |

**inv-16 compliance.** This section proposes; it does not write glass-ui. The demo's F.W13
SHIP is the ≤1-line `text-wrap: pretty` on its own prose (`EditorStartScreen.vue`); everything
else here is a hand-off to glass-ui or a BOOK/RECORD, so the record is accurate and no future
lane re-litigates what is upstream-owned or already-dispositioned.
