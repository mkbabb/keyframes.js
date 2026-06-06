# Tranche F deep-SOTA audit — lane `vj-color-interp-aug`

**Lane scope.** The value.js **COLOR + INTERPOLATION** augmentation proposal, as a
hand-off charter (inv-16: propose, never write value.js). Builds on the E
`valuejs-sota-handoff.md` **Wave B** (the `Color.toString` ~190 ns/frame serializer,
the channel-plan precompute, output-space targeting, egress gamut), **Wave C** (the
computed-unit endpoint cache + memo-key cost — the cross-repo D-3 win), **Wave D**
(the monomorphic / SoA interpolation carrier), and the **Color L4/L5** seam (relative
color, color-mix, the non-legacy L4 serializer for W9 S4, the
`currentColor`/`light-dark()` sentinels for W9 S6).

**Disposition vocabulary.** SHIP-in-F (kf doc, no value.js write) / value.js-HANDOFF /
MEASURE-FIRST / BOOK / KILL / RECORD / ALREADY-SOTA. This lane writes **only this
doc**; every value.js item is a *proposal* the value.js owner sequences. inv ε: every
value.js / kf claim is `file:line`-cited against the live trees; every SOTA claim is
dated-grounded.

**Trees at audit time (2026-06-06).** kf `tranche-e-impl` (E CLOSED). value.js
`/Users/mkbabb/Programming/value.js` branch `docs/constellation-grand-audit-2026-06-03`,
**tranche M open**, HEAD `62f7e00`, `package.json` version `0.10.0` (= the version kf
pins + ships; no pin lag). Installed dist `node_modules/@mkbabb/value.js@0.10.0`.

---

## 0. What this lane is, and is NOT — the F corpus is binding; I integrate + re-point, not re-derive

Four sibling lanes already cover adjacent ground; this lane **consolidates the
color+interp half into one sharpened value.js-F charter** and cites them rather than
re-deriving:

- `docs/tranches/F/audit/r-color-l4-l5.md` — the **SOTA research**: the
  `color-interpolation-method`-is-not-a-property mechanism correction (the 4-clause
  WAAPI color gate), the B2 "emit legacy as `rgb()`" contradiction, the `light-dark()`
  target's-own-scheme caveat, `contrast-color()` Baseline-Apr-2026 + black/white-only.
- `docs/tranches/F/audit/r-interpolation-carrier.md` — the **re-measured Wave D**:
  D1's monomorphic-carrier hypothesis is a *measured non-win*; the lever is SoA
  typed-array layout (D2), ~2.0–2.3× at K≥16; Typed OM is a carrier downgrade (KILL).
- `docs/tranches/F/audit/vj-parser-aug.md` — the parser half (Wave A + E1 `linear()`);
  the `console.error` custom-color-name leak is parse-side, owned there.
- `docs/tranches/F/audit/a-vj-consumption-F.md` — the consumer-side disposition:
  every Wave B/C/D change rides the single `lerpValue(eased, iv)` seam
  (`engine.ts:629`) so kf consumes it unchanged; §2 rename DISCHARGED; F4 `@property`
  CLOSED-by-verification.

**My job (the net-new):** (a) **re-ground the value.js color+interp source directly**
(the sibling lanes cited it transitively; I read `interpolate.ts`, `color/index.ts`,
`color/dispatch.ts`, `normalize.ts` line-by-line and report what the per-frame loop
*actually* allocates); (b) surface **three findings the F corpus did not name** —
the `formatColor` always-emits-`/alpha` defect (§2.4), the `lerpColorValue` closure +
`forEach` + `keys()` per-frame allocation the channel-plan B3 must target precisely
(§2.2), and the `Color.clone()` depth-guard's per-frame static-counter touch (§2.5);
(c) **fold the two F research lanes' corrections into the charter's Wave B/C/D rows**
so the value.js owner reads one coherent, corrected proposal; and (d) state plainly
where value.js's color science is ALREADY-SOTA so F manufactures no work (§5).

The honest headline up front: **value.js's color science and interpolation *dispatch*
are at or ahead of SOTA — the gaps are entirely in the per-frame serialization +
channel-walk *churn* and the computed-unit memo-key cost, plus the two genuinely-open
W9 S4/S6 seams.** This charter is the corrected, re-grounded Wave-B/C/D color+interp
proposal; it overturns nothing in the science and re-points exactly one wave (D, per
`r-interpolation-carrier`).

---

## 1. RE-MEASURE — the live color+interp hot path, grounded line-by-line

I re-walked the exact per-frame path the engine runs for a color leaf and a computed
leaf, against the **live** value.js tree (the E `d-color-interp` lane measured the
*cost*; I re-ground the *mechanism* so each Wave-B item targets a named allocation).

**The color path (per frame, per color leaf):** `engine.ts:629`
`lerpValue(eased, iv)` → `iv._lerp` (pre-resolved at `prepareInterpVar`,
`interpolate.ts:143-148`) → `lerpColorValue` (`interpolate.ts:57-94`) → at DOM-write
boundary, `ValueUnit.toString()` (`index.ts:64-82`, the `unit === "color"` branch
`:73-74` delegates to) → `Color.toString()` (`color/index.ts:191-200`) →
`style.setProperty`.

What `lerpColorValue` (`interpolate.ts:57-94`) does **per frame**:
1. `start.value.keys().forEach((key) => …)` (`:67`) — allocates a fresh **`keys()`
   array** + a fresh **arrow closure** every frame (the closure captures `t`, `hueKey`,
   `hueMethod`, `value`, `stop` → a new heap closure per call).
2. per channel: `channelOf(start.value, key)` + `channelOf(stop.value, key)` (`:68-69`)
   — two dynamic `color[key]` index reads (the `[key: string]: any` signature,
   `color/index.ts:124`); then `ValueUnit.unwrapDeep(sv)` + `unwrapDeep(ev)`
   (`:70-71`) — each an `instanceof ValueUnit` `while`-loop (`index.ts:38-42`).
3. for the hue channel: `sn / 360` … `interpolateHue(…)` … `interp * 360`
   (`:78-81`) — the `÷360 / ×360` round-trip the handoff B5 names, **per hue channel
   per frame**.
4. `channelOf(value.value, key)` + `current instanceof ValueUnit` branch +
   `setChannel`/`ch(result)` write-back (`:86-91`).

What `Color.toString()` (`color/index.ts:191-200`) does **per DOM write**:
- `this.values().slice(0,-1)` — `values()` allocates an array, `.slice` allocates a
  second; `.map(…)` allocates a third (`:192-194`).
- `formatColor(this.colorSpace, values, alpha)` (`:18-20`) — `values.join(" ")` +
  a template literal → the **73-char full-f64 string** the browser re-parses
  (`d-color-interp` measured `Color.toString` alone = **191 ns**, ~65% of the
  ~290 ns/frame color cost; a color prop is **~40× a numeric prop**).

**The computed path (per frame, per `var`/`calc` leaf):** `lerpComputedValue`
(`interpolate.ts:17-40`) calls `getComputedValue(start, target)` **and**
`getComputedValue(stop, target)` (`:28-29`) **every frame**. `getComputedValue`
(`normalize.ts:136-206`) is `memoize`d, but the **keyFn rebuilds**
`` `${value.toString()}-${getElementId(target)}` `` (`:195-196`) on **every hit** —
two full `ValueUnit.toString()` serializations + a `WeakMap.get` + a `Map` hash, to
retrieve an O(1)-invariant pair. The cold path (`:148-187`) writes inline style →
`getComputedStyle().getPropertyValue` (a **forced synchronous layout flush**) →
restores — one reflow per distinct expression, **never invalidated on resize**.

**Disposition: RECORD (re-grounded mechanism).** Every E-era cost claim is intact on
the live tree; the mechanism is now pinned to the exact allocating lines so Wave B/C
items target them precisely below.

---

## 2. The color hot-path proposal (Wave B) — re-grounded + THREE net-new findings

### 2.1 B1 — the fixed-precision, single-pass color serializer — value.js-HANDOFF (HIGH) · the `toFormattedString` seam is PARTLY there

`Color.toString()` (`color/index.ts:191-200`) emits full-f64, ~73 chars, via 3 array
allocations. The E handoff B1 proposed a zero-alloc fixed-precision *apply-path*
serializer. **Net-new from direct reading:** value.js **already has**
`Color.toFormattedString(digits)` (`color/index.ts:202-208`) — a fixed-precision
serializer the E-era D-1 cites did not call out (`r-color-l4-l5` §6 RECORD first
noted it). But it is **not** B1: it still does `this.values().slice(0,-1).map(…)`
(3 arrays, `:203-205`) and emits in storage space only. So the *precision* half
exists; the *zero-alloc* half does not.

**The sharpened proposal:** extend the existing `toFormattedString` seam (not
greenfield) into a `toAnimationString(digits, outputSpace?)` that (a) writes channels
into a **reused** scratch buffer instead of `values().slice().map()` (kill the 3
arrays), and (b) takes the precision arg already present. The B1 win is the
**allocation** removal on the apply path, *on top of* the precision shortening
`toFormattedString` already gives.

- **Falsifiable gate:** apply-path serialize ns + per-call allocation drop to 0; output
  ≤ ~28 chars (`oklab(54% 0.0962 -0.0928)`) vs 73; a color-interp bench (absent today —
  §2.6) defends the wall-time.
- **Iso:** sub-JND (`DELTA_E_OK_JND=0.02`; 4–5 sig-figs is ~10⁴× under it); the
  rounded form is the *apply* serializer — `toString` stays full-precision for
  round-trip/`format.ts`.

### 2.2 B3 — the channel-plan precompute — value.js-HANDOFF (HIGH, pure refactor) · the EXACT per-frame allocations named

The handoff B3 ("freeze a closure-free numeric channel plan; flatten `lerpColorValue`
to a flat `for` over a numeric array") is the right shape. **Net-new: I name the exact
per-frame garbage it must eliminate** (the E lane described the cost; I pin it to the
lines). Per `interpolate.ts:57-94`, every frame `lerpColorValue` allocates:
1. a fresh **`keys()` array** (`:67` `start.value.keys()`),
2. a fresh **arrow closure** (`:67` the `forEach` callback),
3. per-channel `unwrapDeep` `instanceof`-loop walks (`:70-71`) that re-derive an
   invariant (the channel is the same shape every frame — number vs `ValueUnit` is
   fixed at prepare),
4. per-channel dynamic `color[key]` index reads (`:68-69,86`).

**The B3 plan** freezes at `prepareInterpVar` time (mirroring the `_lerp` predispatch
already there, `:143-148`): a frozen array of `{ getStart, setDst, isHue }` numeric
accessors (or, denser, three parallel `Float64Array` channel lanes + a hue-mask), so
the per-frame loop is a flat `for (let i=0;i<n;i++)` with **zero** `keys()`/closure/
`unwrapDeep`/dynamic-index allocation. This is the *color* analogue of the SoA
transposition `r-interpolation-carrier` measured 2× for numeric (§3 here).

- **Falsifiable gate:** byte-identical lerp output over the parsing corpus; per-frame
  closures / `keys()` / `unwrapDeep` realloc → 0 (a `proof:color-frame` zero-alloc
  call-counter, mirroring `proof:standalone-zero-alloc`); bench the ~85 ns lerp floor.
- **Iso:** pure refactor — byte-identical; the channel order + hue handling are
  invariant, so the frozen plan reproduces the `forEach` exactly.

### 2.3 B5 — `interpolateHue` degree-domain overload — value.js-HANDOFF (LOW, bundle with B3)

Re-confirmed live: `lerpColorValue` does `sn / 360 … interpolateHue(…) … * 360`
(`interpolate.ts:78-81`) per hue channel per frame, because `interpolateHue`
(`color/dispatch.ts:234-268`) operates on the normalized `[0,1]` domain while the
denormalized channels are degrees. Fold the `÷360/×360` into B3's frozen plan (mark
the hue lane, do the modular arithmetic in-domain) or add a degree-domain
`interpolateHue` overload. **Bundle with B3** — it is the same per-frame loop.

- **Iso:** isomorphic within FP epsilon (the modular `((x%1)+1)%1` at `:266` becomes
  `((x%360)+360)%360`).

### 2.4 ★ NET-NEW — `formatColor` unconditionally emits `/ alpha`, even at alpha=1 — value.js-HANDOFF (LOW, cheap iso + a byte-shrink) · NOT in the F corpus

Reading `formatColor` directly (`color/index.ts:18-20`):

```
const formatColor = (colorSpace, values, alpha) =>
    `${colorSpace}(${values.join(" ")} / ${alpha})`;
```

It **always** appends ` / ${alpha}`. So an opaque `oklab(…)` serializes as
`oklab(0.54 0.096 -0.093 / 1)` — the `/ 1` is **never** elided. CSS Color 4 §4.x makes
the alpha clause optional and UAs canonicalize an opaque color *without* it; emitting
`/ 1` on every opaque keyframe is (a) ~4 wasted chars/keyframe the browser re-parses,
and (b) a needless divergence from the canonical opaque form. The E `d-color-interp`
D-1 counted the 73-char length but did **not** isolate the always-`/alpha` cause; the
B1/B2 lanes did not name it. This is a clean, isomorphic byte-shrink that should ride
B1: emit the alpha clause **only when `alpha !== 1`** (and `none` when NaN, which the
`toString` already special-cases at `:195-198`).

- **Falsifiable gate:** `oklab(…)` opaque serializes without ` / 1`; alpha<1 unchanged;
  round-trip parity (the parser already accepts both forms).
- **Iso:** isomorphic-to-canonical (the browser treats `oklab(a b c)` and
  `oklab(a b c / 1)` as the same color); a befitting byte-shrink, not a behavior change.
- **Scope note:** `toString` is *also* used by `format.ts`/round-trip; the always-`/1`
  there is cosmetic but the same fix is safe (canonical CSS omits it). Apply at
  `formatColor`, the single choke point both `toString` + `toFormattedString` call.

### 2.5 ★ NET-NEW — `Color.clone()` touches a static depth-counter; confirm it is OFF the per-frame path — RECORD (verify, likely a non-issue)

`Color.clone()` (`color/index.ts:223-…`) increments/decrements a **static**
`Color._cloneDepth` counter (`:188-189,224`) as an iOS-Safari stack-overflow guard.
A static mutable counter touched on a hot path would serialize across instances and
defeat monomorphism. **Grounded check:** the per-frame `lerpColorValue` path
(`interpolate.ts:57-94`) does **not** call `clone()` — it mutates `value.value`'s
channels in place (`:86-91`). The one-time space collapse at frame-prep
(`normalizeColorUnits`, `color/normalize.ts:112`) is where cloning happens, amortized.
**So the depth-guard is correctly off the per-frame path.** I record it only so a
future B3 SoA refactor does **not** introduce a per-frame `clone()` (the frozen plan
must mutate in place, as the current loop does).

- **Disposition: RECORD** — verified non-issue today; a binding constraint on B3 (no
  per-frame `clone()`).

### 2.6 B2 / B4 — output-space targeting + egress gamut — value.js-HANDOFF (HIGH for B2, MED for B4) · the B2 emit-space rule CORRECTED

The E handoff B2 ("serialize a stored-oklab color *as* a requested output space;
emit legacy-sRGB pairs as compact `rgb()`") and B4 (gamut-map to the egress space's
own gamut, not unconditionally sRGB) stand on the science. **But `r-color-l4-l5` §3
found a contradiction F must resolve, and it bears directly on this lane's WAAPI
proposal (§4):** B2's "emit legacy as `rgb()`" advice is **wrong** for a WAAPI
keyframe whose `colorSpace` is the **default `oklab`** — emitting `rgb()` makes the UA
interpolate in **sRGB**, diverging from the OKLab the user asked for. The corrected
rule: **the emit space must be chosen so the UA's *implicit* interp space equals the
*requested* `colorSpace`** — a default-`oklab` animation emits **non-legacy**
(`oklab()`/`oklch()`) endpoints regardless of input family; an explicit
`colorSpace: srgb` animation emits `rgb()`. B2 is right for the *gradient/`color-mix`*
use case and for explicit-sRGB animations; it is wrong as a blanket WAAPI keyframe
rule. **This charter carries the corrected rule into the WAAPI serializer (§4) and
annotates the B2 handoff row with it.**

B4 (egress gamut) is the **one real wide-gamut correctness gap** — a
`color(display-p3 …)` animation is currently sRGB-clipped on output
(`conversions/xyz-extended.ts`/`direct.ts`, per the E handoff B4); `display-p3` is
Baseline 2023. Carry forward unchanged.

- **Falsifiable gate (B2):** round-trip parity per space; a default-`oklab` animation
  emits non-legacy endpoints; an explicit-`srgb` animation emits `rgb()`. (B4):
  a `display-p3` animation stays in P3, identical on sRGB displays.

### 2.7 The missing color-interp bench — value.js-HANDOFF / kf-FOLD (MEASURE-FIRST) · re-confirmed absent on BOTH sides

Re-confirmed live: `bench/interpolation.bench.ts` has **three** cases — 2-frame
opacity, 2-frame multi-prop, 11-stop complex (`:22,28,34`) — and **zero color cases**
(grep `color` over the file = empty). The single most expensive lane (~40×/frame)
is **unmeasured in CI on both repos**. Every Wave-B gate above ("bench the ~85 ns
floor", "apply-path serialize ns") needs this bench to bite. **Disposition:
MEASURE-FIRST** — author a color-interp bench case (hex/rgb/oklch/hsl) as the gate
substrate before any B1/B3 win is asserted. The bench is kf-authorable (it benches
`interpFrames` over a color animation) and is the precondition for the §Mandate's
measure-first discipline on this wave.

---

## 3. The interpolation carrier (Wave D) — RE-POINTED per the F measurement · value.js-HANDOFF (re-scoped) + MEASURE-FIRST

`r-interpolation-carrier` **ran the bench the E handoff withheld** and the result
re-points Wave D. I integrate its finding into this charter (it is the
interpolation half of my lane) rather than re-measure:

- **D1's monomorphic-carrier hypothesis is a measured NON-win.** A monomorphic
  `{value}` cell is *within noise of, and at K=1 slower than*, the megamorphic
  `ValueUnit` at the mutation site (node v26 / V8). The store IC for
  `value.value = lerp(...)` on a megamorphic receiver with a stable-offset `value`
  field is **not** the "dictionary-style lookup" the E handoff feared. **The
  frozen-shape `ValueUnit` sub-option is killed on evidence.**
- **The real lever is D2 — SoA `Float64Array` layout: ~2.0× at K≥8, ~2.3× at K=64**
  (the real-engine-shape bench: AoS + per-`iv` `_lerp` closure dispatch vs a flat SoA
  `for`). The win is AoS pointer-chase + per-`iv` closure-call elimination, not
  hidden-class monomorphization.
- **Feasibility proven:** the numeric inner loop reads **only** `{value}` of the
  6-field carrier (`lerpNumericValue`, `interpolate.ts:97-103` reads `start.value`/
  `stop.value`, writes `value.value`); `unit`/`superType`/`property`/`subProperty`/
  `targets` are prepare-time (`normalize.ts`) / serialize-time (`index.ts:64-82`) only
  — never in the loop. So SoA is pixel-identical (reconstitute `ValueUnit` at the
  serialize boundary).
- **K-dependent → MEASURE-FIRST:** absent at K=1 (a 2-frame `opacity` animation), the
  win is monotone in K and decisive at K≥16. Must be gated on a *representative-K*
  bench over the demo's actual frame distribution, not synthetic K=64.

**The corrected Wave D for the value.js owner (one line):** *promote D2 (a
`lerpArray(Float64Array, Float64Array, t, out)` SoA primitive) to the primary carrier
win; demote D1's "monomorphic cell / frozen-shape `ValueUnit`" to a recorded measured
non-win, keeping only the constraint that the serialize-boundary reconstitution
round-trips exactly.* The **color** analogue is B3 (§2.2): the same SoA discipline,
on color channels, which `r-interpolation-carrier` explicitly excludes from its
numeric-only scope (`lerpColorValue` is >>40× a numeric lerp and dominated by other
costs — it gets B1/B3, not D2). So **D2 (numeric SoA) and B3 (color channel plan) are
the same architectural move applied to the two carriers** — the unifying gestalt of
this lane.

**KILL (record):** CSS Typed OM (`CSSUnitValue`/`CSSNumericValue`) as a carrier — it
*allocates* per `.add`/`.mul`, its perf story is vs the string-CSSOM baseline kf does
not use, and it is DOM-coupled (would breach the light/heavy boundary). Recorded so a
future "modernize the carrier to Typed OM" pass does not regress the zero-alloc
in-place core (`r-interpolation-carrier` F-4).

---

## 4. The computed-unit boundary (Wave C) — the cross-repo D-3 win, re-grounded · value.js-HANDOFF (HIGH)

Re-grounded against live `normalize.ts` (§1 above pins the lines). The Wave C items
hold unchanged on the live tree; I re-confirm + carry forward:

| # | Item | Live cite | Disposition |
|---|------|-----------|-------------|
| **C1** | Cache resolved `(newStart, newStop, newUnit)` on the `InterpolatedVar` at `prepareInterpVar`; per-frame `lerpComputedValue` collapses to a bare `lerp` | `interpolate.ts:17-40,143-148` | value.js-HANDOFF (HIGH) |
| **C2** | Stable-identity memo key (per-`ValueUnit` id / `WeakMap`) so a cache *hit* doesn't re-serialize `value.toString()` — the keyFn rebuilds it **per hit** today | `normalize.ts:195-196` | value.js-HANDOFF (HIGH) |
| **C3** | Batched resolve — one write→read pass per target instead of N forced reflows | `normalize.ts:148-187` (the calc cold path) | value.js-HANDOFF (MED) |
| **C4** | `ttl===Infinity` fast path in `memoize` — skip the `Date.now()` on the no-TTL hit | `utils.ts` `memoize` | value.js-HANDOFF (LOW, bundle C2) |
| **C5** | `convertToPixels` length-unit coverage — **24 of 43** declared length units silently no-op (`50dvh`→`50px`); the `dv*`/`sv*`/`lv*` family + `vi vb cap ic lh rlh` | `units/utils.ts:255-355`; decls `units/constants.ts` | value.js-HANDOFF (HIGH, **standalone correctness**, can lead) |
| **C6** | `COMPUTED_UNITS` classification — bare `vh`/`cqw` bake to px at compile + go stale on resize (diverge from WAAPI); owner decides freeze-vs-re-resolve | `units/constants.ts`; `normalize.ts` | value.js-HANDOFF (owner-scoped) |
| **C7** | `getComputedValue` memo eviction — unbounded + never busted on resize; bound + scope to a layout epoch | `normalize.ts:136-206` (`shouldCache` only gates `isConnected`, never resize) | value.js-HANDOFF (MED) |

**The consumer-side fact that makes this clean (`a-vj-consumption-F` §0.3):** kf's
re-export barrels are **gone** — `getComputedValue`/`normalize` are 100% value.js-owned
and reached purely transitively via `lerpValue → iv._lerp` (`engine.ts:629`). So kf
consumes the **entire** Wave C fix unchanged — there is no kf normalize surface to
migrate. C5 in particular **bites kf today**: a `@keyframes` animating `50dvh` silently
paints `50px` on the rAF path (the WAAPI path excludes computed units), and the gate
"any unit returning `value` unchanged is a bug" is the cleanest falsifiable test in the
whole charter. **C5 should lead Wave C** as a standalone correctness fix.

- **Iso:** C1–C4/C7 pixel-identical (cheaper key/cache, same resolved values); C5
  **fixes wrong pixels** (befitting); C6 is a named behavior change on resize toward
  spec + WAAPI parity (owner-flagged).

---

## 5. The WAAPI color un-reject (W9 S4) — the 4-clause gate + the L4 serializer · value.js-HANDOFF + FOLD-F (HIGH)

`r-color-l4-l5` §2-§3 corrected the W9 S4 mechanism; this is the **color** heart of my
lane, so I carry the corrected shape forward as the binding proposal:

**Live state (re-confirmed):** kf hard-blocks ALL color from WAAPI
(`waapi.ts:153-157`, `reason: "color interpolation requires perceptual lerp"`);
value.js has **no** `cssColorInterpKeyword` (grep over vj `src/` = 0) and no
non-legacy/precision space-preserving serializer. Both sides UNCHANGED since E.

**The mechanism correction (binding):** `<color-interpolation-method>` is a CSS *data
type*, **not a settable property** — there is no `color-interpolation-method: oklch`
you can put on an element to steer how its `color` *animation* interpolates (MDN,
2026-06-06). For animations, the interp space is chosen **implicitly** by the keyframe
color *syntax family* (CSS Color 4 §12: OKLab for non-legacy; UAs *may* use sRGB for
legacy). So the eligibility gate is a **4-clause hard equality**, narrower than the E
draft's looser "match-or-pin":

A color `InterpolatedVar` is WAAPI-admissible **iff ALL**:
1. both endpoints serialize to a valid CSS color string (needs the value.js
   serializer); **AND**
2. `options.colorSpace` can be matched by emitting endpoints in a syntax family whose
   *implicit* interp space equals the request — default `oklab` → emit **non-legacy**
   (`oklab()`/`oklch()`) regardless of input family (the corrected B2 rule, §2.6);
   explicit `srgb` → `rgb()`; `display-p3`/`lab`/… → that exact family; **AND**
3. `hueMethod` is unset or `shorter` (the only one WAAPI can express — vj
   `dispatch.ts:238` default `shorter` *matches* CSS Color 4 §12.4); **AND**
4. `colorSpace` is **not `hsv`** (a value.js space key with no CSS
   `<color-interpolation-method>` counterpart, `color/constants.ts`).

**The value.js half (HANDOFF):** (a) a `cssColorInterpKeyword(space, hueMethod)` map
(small — most `COLOR_SPACE_RANGES` keys are CSS-valid, but `hsv` has no keyword and
`rgb`→`srgb`), and (b) the **non-legacy, space-preserving** serializer (the B1
`toAnimationString` extended with `outputSpace`). **The kf half (FOLD-F):** replace
the blanket reject at `waapi.ts:153-156` with the 4-clause gate; emit color endpoints
in `toWAAPIKeyframes` (which never reaches color today because the animation is
rejected upstream).

- **Measure-first:** the win is removing the per-frame JS color cost (~290 ns/frame,
  ~40× numeric) + the `setProperty` churn — **not** compositor offload (`color`/
  `background-color` are **main-thread**; only `transform`/`opacity`/`filter`/
  `backdrop-filter` composite — the D-6 correction stands). Needs the §2.6 color bench.
- **Iso:** the 4 clauses are exactly the conditions under which the UA's native interp
  is the *same* math value.js runs — pixels match where admitted, every non-matching
  case stays on the byte-faithful JS path. A paired doc-truth fix to the
  `waapi.ts:66` docstring + the CLAUDE.md "no color interpolation" eligibility note.

---

## 6. The context-keyword sentinels (W9 S6) — `currentColor`/`light-dark()` + the target's-own-scheme caveat · value.js-HANDOFF + FOLD-F (HIGH)

Re-confirmed live: `currentColor`/`light-dark()`/system colors still don't parse
(vj `color.ts:556-571` — 14-branch `any`, no `currentColor`; `.bbnf:93` documents
`light-dark` but the live parser lacks it); kf has **0** resolution policy because the
inputs hard parse-fail before reaching frame-prep (grep `currentColor|light-dark` over
kf `src/` = 0). `light-dark()` is Baseline 2024-05-13; `currentColor` long-Baseline.

**The shape (from E F2, unchanged):** the value.js parser emits a **sentinel** —
`ValueUnit("currentColor", "color-keyword")` / `FunctionValue("light-dark", [c1,c2])`
that does **not** bake to a fixed RGB; kf resolves it per-target at frame-prep via the
existing computed-value seam (structurally identical to the `getComputedValue` round
trip the engine already owns).

**The net-new caveat (`r-color-l4-l5` §4, carried):** kf must resolve `light-dark()`
against the **animation target's own** computed `color-scheme` —
`getComputedStyle(target).colorScheme` — **not** `:root`'s, not a global
`matchMedia('(prefers-color-scheme: dark)')` probe (which is correct only as a
fallback). A `color-scheme`-overriding subtree must animate to the right branch; the
E F2 disposition offered the global probe as *primary*, which is wrong for an
overriding subtree. This caveat is binding on the W9 S6 FOLD-F policy.

- **Priority:** `currentColor` HIGH (most-used dynamic keyword, hard parse-fail today),
  `light-dark()` HIGH (Baseline May-2024, the idiomatic dark-mode primitive), system
  colors MED. **Feature-detect** `light-dark()` (sub-Baseline-2024 fallback).
- **Iso:** resolving from the **target's** computed value is *exactly* what the
  platform does — strictly more isomorphic than today's hard parse-fail.

---

## 7. `contrast-color()` — Baseline CONFIRMED Apr-2026; black/white-only · BOOK + value.js-HANDOFF (opportunity, MED)

Carried from `r-color-l4-l5` §5 (a competitive opportunity, not a core gap):
`contrast-color(<color>)` reached **Baseline Newly-Available April 2026** (Chrome 147 /
Firefox 146 / Safari 26 — shipped tri-engine). **The binding guard:** the shipped spec
function returns **only black or white** (greater WCAG contrast); value.js's
`safeAccentColor` (`contrast.ts:90`) is a **richer, different** function (hue-preserving
OKLCH shift). A spec-faithful `contrast-color()` parser must **NOT** alias to
`safeAccentColor` (that would silently diverge from every browser). Expose **two**
surfaces: the spec-faithful black/white resolver, and `safeAccentColor` as the richer
programmatic API. The `.bbnf` still encodes the **abandoned** `color-contrast()`
`vs`/list form (`.bbnf:98,134`) — doubly stale.

- **Disposition: BOOK** the `.bbnf` drift fix; **value.js-HANDOFF** the spec-faithful
  resolver (the contrast science exists; only the parser branch is missing). MED — you
  rarely animate *to* a `contrast-color()`, so it is a competitive surfacing, not an
  animation-input blocker.

---

## 8. ALREADY-SOTA — manufacture NO work (re-confirmed live, post-E)

Stated plainly per the §Mandate's KISS clause — value.js's color science + interp
dispatch are at or ahead of SOTA; the gaps are *churn + memo-key cost*, not science:

- **The full L4/L5 functional color surface parses** (`color.ts:556-571`): `oklab`/
  `oklch`/`lab`/`lch`/`color()` (9 predefined spaces + Bradford D50↔D65), `color-mix()`
  (4 hue methods, premultiplied alpha, `none`-adopt), **relative color `from`**
  (math-AST evaluated, no `eval`), Kelvin, the runtime custom-name registry. Genuine
  CSS Color 5 coverage — **exemplary, do not touch.**
- **`hueMethod` default = `shorter`** (`dispatch.ts:238`) **exactly matches** CSS Color
  4 §12.4 — so kf's "unset → value.js picks default" path (`engine.ts:459-462`) is
  spec- *and* UA-default-faithful with zero kf code (load-bearing for §5 clause 3).
- **One-time space collapse at frame-prep** (`color/normalize.ts:112`, `inverse=true`)
  — no per-frame color-space conversion; the matrix multiplies are amortized.
- **Analytical Ottosson OKLab gamut map** (`color/gamut.ts`) — closed-form,
  hue-preserving, **ahead of shipping browsers** (the modern-web-guidance `css` guide,
  2026-06-06, warns browsers don't yet gamut-map relative-color syntax — value.js's
  analytical map is the *better* path). A competitive advantage, not catch-up.
- **The pre-resolved `_lerp` dispatch** (`interpolate.ts:143-148`) — the monomorphic
  dispatch is resolved once; the *carrier* it mutates (D2) / the *channel walk* it
  drives (B3) are the open questions, **not the dispatch design**. LEAVE the dispatch.
- **`Color.toFormattedString(digits)`** (`color/index.ts:202-208`) — the fixed-precision
  serializer is the **seam B1 extends**, not greenfield (still 3-array, storage-space
  only — RECORD, §2.1).
- **The 6-field `ValueUnit` *as a value-domain type*** — its richness is *correct* for
  parsing/serialization/unit-math; the finding is narrowly that it should not be the
  *per-frame numeric substrate* (D2 SoA beside it), not that the type is wrong.
- **The single-dispatch consumption seam** (`lerpValue → iv._lerp`, `engine.ts:629`) —
  lets value.js land all of Wave B/C/D with **zero** kf edits. ALREADY-SOTA seam design
  (`a-vj-consumption-F` §1).

**BOOK (named, not folded):** `device-cmyk()`/HDR `dynamic-range-limit`/`color-layers()`
frontier (not Baseline for the web-animation domain, `r-color-l4-l5` §7); gradient
interpolation-hint stops (KILL — kf emits no gradients).

---

## 9. Disposition summary

| # | Finding | Disposition | Repo | Priority |
|---|---------|-------------|------|----------|
| §1 | Color + computed hot path re-grounded line-by-line; E cost claims intact | **RECORD (mechanism)** | both | — |
| §2.1 | B1 fixed-precision zero-alloc serializer; extend the `toFormattedString` seam | **value.js-HANDOFF** | vj | HIGH |
| §2.2 | B3 channel-plan precompute — kill the per-frame `keys()`/closure/`unwrapDeep`/dynamic-index churn (exact lines named) | **value.js-HANDOFF** | vj | HIGH |
| §2.3 | B5 `interpolateHue` degree-domain — drop the `÷360/×360`; bundle B3 | **value.js-HANDOFF** | vj | LOW |
| §2.4 | ★ NET-NEW: `formatColor` always emits `/ alpha` (even `/ 1`) — elide when opaque | **value.js-HANDOFF** | vj | LOW (cheap iso byte-shrink) |
| §2.5 | ★ NET-NEW: `Color.clone()` static depth-counter is OFF the per-frame path — a binding constraint on B3 (no per-frame clone) | **RECORD (verify)** | vj | — |
| §2.6 | B2 output-space (emit-space rule **corrected**) + B4 egress gamut (the one wide-gamut gap) | **value.js-HANDOFF** | vj | HIGH (B2) / MED (B4) |
| §2.7 | The color-interp bench is ABSENT on both repos — the precondition for every Wave-B gate | **MEASURE-FIRST** | kf | HIGH (gate substrate) |
| §3 | Wave D RE-POINTED: D1 monomorphization a measured non-win; D2 SoA the ~2–2.3× lever; B3 is the color twin of D2; Typed OM KILL | **value.js-HANDOFF (re-scope) + MEASURE-FIRST** | vj | MED (gated) |
| §4 | Wave C computed-unit boundary (C1–C7); C5 the 24-of-43 no-op bites kf today (`50dvh→50px`), should lead | **value.js-HANDOFF** | vj | HIGH (C5/C1/C2) |
| §5 | W9 S4 WAAPI color un-reject — 4-clause hard-equality gate + the non-legacy serializer + `cssColorInterpKeyword`; B2 emit-space contradiction resolved | **value.js-HANDOFF + FOLD-F** | vj+kf | HIGH |
| §6 | W9 S6 `currentColor`/`light-dark()` sentinels + the **target's-own-`color-scheme`** resolution caveat | **value.js-HANDOFF + FOLD-F** | vj+kf | HIGH |
| §7 | `contrast-color()` Baseline Apr-2026, black/white-only — must NOT alias `safeAccentColor`; `.bbnf` doubly-stale | **BOOK + value.js-HANDOFF (opportunity)** | vj | MED |
| §8 | Full L4/L5 surface, `shorter`-default, one-time collapse, analytical gamut map, `_lerp` dispatch, single-dispatch seam — exemplary | **RECORD (ALREADY-SOTA)** | vj | — |

**The honest bottom line.** value.js's color *science and parse breadth* + the
interpolation *dispatch* are at or ahead of SOTA (§8) — F manufactures no work there.
The color+interp gaps are exactly four, all carried forward from E and re-grounded
live: (1) the **per-frame serialization + channel-walk churn** (Wave B — B1/B3 are
the same SoA discipline as D2, applied to the color carrier; the `formatColor`
always-`/alpha` defect §2.4 is a clean net-new byte-shrink); (2) the **computed-unit
memo-key cost + the 24-of-43 unit no-op** (Wave C — C5 bites kf today); (3) the
**carrier**, re-pointed from D1→D2 by a real measurement (§3); and (4) the two
genuinely-open **W9 S4 / S6** color seams (the 4-clause WAAPI gate + the
target's-own-scheme sentinels). This lane's distinctive contributions: the **three
net-new findings** my direct source reading surfaced (the always-`/alpha` defect, the
exact per-frame allocation inventory B3 must target, the `clone()`-depth constraint on
B3), the **unifying gestalt** that B3 (color) and D2 (numeric) are one architectural
move on two carriers, and the **corrected, consolidated value.js-F color+interp
charter** that resolves the E hand-off's B2 emit-space contradiction and re-points
Wave D — overturning nothing in the science.

---

## inv-16 compliance

This lane wrote ONLY `docs/tranches/F/audit/vj-color-interp-aug.md`. ZERO source
edits to keyframes or value.js. Every value.js item is a *proposal* (a hand-off) the
value.js owner sequences against its own tranche discipline; value.js is dirty +
active (tranche M open) and this lane does not touch it. Every kf claim is
`file:line`-grounded against the live `tranche-e-impl` tree; every value.js claim
against the live source (`docs/constellation-grand-audit-2026-06-03`, HEAD `62f7e00`)
+ the installed 0.10.0 dist; every SOTA claim dated-grounded.

---

## Sources (grounded 2026-06-06)

- **Live value.js** (`/Users/mkbabb/Programming/value.js`, branch
  `docs/constellation-grand-audit-2026-06-03`, HEAD `62f7e00`):
  `src/units/interpolate.ts:17-150` (the per-frame lerp dispatch + color/computed/
  numeric lerps), `src/units/color/index.ts:18-208` (`formatColor`, `Color.toString`,
  `toFormattedString`, channel accessors, clone-depth guard), `src/units/color/
  dispatch.ts:234-268` (`interpolateHue`), `src/units/color/normalize.ts:112-123`
  (one-time space collapse), `src/units/normalize.ts:136-206` (`getComputedValue` memo
  + keyFn), `src/units/index.ts:38-82` (`ValueUnit.unwrapDeep`/`toString`),
  `src/parsing/color.ts:556-571`, `src/parsing/grammars/css-color.bbnf:93-136`,
  `src/units/color/contrast.ts:90`.
- **Live keyframes.js** (`tranche-e-impl`): `src/animation/engine.ts:439-487,629`,
  `src/animation/waapi.ts:30,66,153-157`, `src/animation/utils.ts:288-339`,
  `src/animation/constants.ts:140-181`, `bench/interpolation.bench.ts:22-36`
  (no color case).
- **F corpus (cited, not re-derived):** `docs/tranches/F/audit/r-color-l4-l5.md`
  (the `color-interpolation-method` mechanism, the B2 contradiction, the `light-dark()`
  scheme caveat, `contrast-color()`), `…/r-interpolation-carrier.md` (the Wave-D
  re-measure, Typed OM KILL), `…/vj-parser-aug.md` (the parse-side `console.error`
  leak), `…/a-vj-consumption-F.md` (the consumer-side wave disposition, the
  barrel-deletion, F4 closed-by-verification).
- **E corpus:** `docs/tranches/E/valuejs-sota-handoff.md` (Waves B/C/D/F),
  `docs/tranches/E/audit/sota/d-color-interp.md` (the measured ~190 ns toString,
  ~290 ns/frame, ~40× numeric), `…/r-css-color.md`, `docs/tranches/E/FINAL.md`
  (W9 S4/S6 needs-handoff record).
- **SOTA:** MDN `<color-interpolation-method>` (NOT a property; only in
  `color-mix()`/gradients) + `contrast-color()` (Baseline Apr-2026, black/white) +
  `light-dark()` (Baseline 2024-05-13); W3C CSS Color 4 §12 / §4 (interp default OKLab
  non-legacy; optional alpha clause); web.dev April-2026 Baseline digest;
  modern-web-guidance `css` / `dark-mode` / `component-specific-light-dark-theme`
  guides (relative-color gamut-mapping not yet shipped; `light-dark()` inherited-
  resolution caveat); the `r-interpolation-carrier` node-v26/V8 bench (carrier shapes).
