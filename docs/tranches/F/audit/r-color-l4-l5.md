# Tranche F deep-SOTA audit — Lane `r-color-l4-l5`

**CSS Color 4/5 SOTA · the color machinery (value.js-owned) · the L4 non-legacy
serializer + the WAAPI color un-reject seam (W9 S4) · the context-keyword
sentinels (W9 S6).**

Research + audit ONLY. ZERO source changes. inv-16: I may PROPOSE value.js
changes (a hand-off) but write only this keyframes.js doc. inv ε: every
keyframes/value.js claim cites file:line against the live trees; every SOTA
claim is grounded to a dated source.

**Trees at audit time (2026-06-06):** keyframes.js `tranche-e-impl` (E CLOSED,
HEAD `fe9b120`); value.js `/Users/mkbabb/Programming/value.js` branch
`docs/constellation-grand-audit-2026-06-03` (**tranche M open**, HEAD `62f7e00`
— advanced past the E-audit's L-era cites; re-grounded below).

---

## 0. What this lane is NOT — the E corpus is binding, I diff it

Two E-lane docs already mapped the color surface exhaustively and I do **not**
re-litigate them — I cite + diff:

- `docs/tranches/E/audit/sota/r-css-color.md` (F1–F6): the L4/L5 **keyword-edge**
  gaps — `currentColor`/`light-dark()`/system-colors don't parse, the `.bbnf`
  documents the abandoned `color-contrast()`, the WAAPI color rejection.
- `docs/tranches/E/audit/sota/d-color-interp.md` (D-1–D-10): the per-frame
  **hot-path** — `Color.toString()` cost, channel plan, gamut egress, WAAPI
  compositor *correction*, demo/bench gaps.

Both rolled up into `docs/tranches/E/valuejs-sota-handoff.md` (Wave B color
hot-path B1–B5; Wave F context-keywords F2/F2b/F2c). **E IMPLEMENTED none of the
color findings** — they were the value.js-needs-handoff + recorded-WITHHELD set
(FINAL.md §"Cross-repo needs-value.js-handoff": "W9 S4 … and S6 … are RECORDED
in valuejs-sota-handoff.md; the kf-side eligibility/emit criterion is noted, not
coded. E does not block on them.").

**My job:** (a) **re-verify** that the post-E live state is unchanged (it is —
the WITHHELDs held), (b) find what the E corpus did **not** examine, and (c)
**sharpen** two E findings with a mechanism correction that materially changes
the W9 S4 design. The headline net-new contribution is **§2: the
`color-interpolation-method`-is-not-a-property mechanism**, which the E audit's
F5/D-6 got *almost* right and which changes the shape of the W9 S4 hand-off.

---

## 1. RE-MEASURE of the E withholds — the live state is UNCHANGED (the WITHHELDs held honestly)

E recorded W9 S4 (WAAPI color un-reject + L4 serializer) and W9 S6
(`currentColor`/`light-dark()`) as needs-value.js-handoff, not coded. Re-grounded
against the live trees, **every cited surface is byte-for-byte where the E audit
left it** — no silent drift, no half-landed work. This is the honest outcome; I
record it so F does not re-discover it as new.

| E claim | E cite | Live state (2026-06-06) | Verdict |
|---|---|---|---|
| WAAPI rejects ALL color | `waapi.ts:116-121` | `waapi.ts:153-156` (lines shifted; logic identical: `iv.start?.unit === "color" \|\| iv.stop?.unit === "color"` → ineligible, reason `"color interpolation requires perceptual lerp"`) | **UNCHANGED** |
| `currentColor` doesn't parse | vj `color.ts:556-571` | vj `color.ts:556-571` — `Value = any(colorMix, colorFunction, hex, kelvin, rgbParser…nameParser)`, 14 branches, **no** `currentColor` | **UNCHANGED** |
| `light-dark()` grammar-only | vj `color.ts` (absent) / `.bbnf:93` | vj `color.ts` still has no `light-dark` branch; `.bbnf:93` still documents it | **UNCHANGED** |
| system colors grammar-only | vj `.bbnf:110-124` | unchanged — `.bbnf:110` `systemColor = "Canvas" \| …`, no live parser branch | **UNCHANGED** |
| `.bbnf` documents dead `color-contrast()` | vj `.bbnf:98` | `.bbnf:98` `colorContrast = "color-contrast" <<…`; top-level `color` (`:134-136`) still lists `colorContrast \| lightDark \| … \| systemColor` | **UNCHANGED** |
| `safeAccentColor` science exists, unwired | vj `contrast.ts` | vj `contrast.ts:90` `safeAccentColor` still exported, still wired to **no** parser | **UNCHANGED** |
| `Color.toString()` 3-array + full-f64 | vj `index.ts:191-200` | vj `index.ts:191-199` — same `values().slice(0,-1).map(...)` → `formatColor` join; `formatColor` (`:18-20`) still `${space}(${values.join(" ")} / ${alpha})` | **UNCHANGED (+ one new partial — §6 RECORD)** |

**Disposition:** RECORD. The E WITHHELDs are intact; F may proceed to fold them
without fear of conflicting half-work. The kf-side seams (`waapi.ts`,
`engine.ts` color setters, `format.ts`) are clean.

---

## 2. ★ THE NET-NEW FINDING — `color-interpolation-method` is **not a property**; the W9 S4 eligibility gate the E audit drafted is *under-constrained* · GAP-NAMED · FOLD-F (kf) + value.js-HANDOFF

This is the lane's headline. The E audit's `r-css-color` F5 and `d-color-interp`
D-6 both proposed un-rejecting WAAPI color, gated on *"the requested
`(colorSpace, hueMethod)` match the UA default … **or** can be pinned via
emitting `color-interpolation-method` where supported"* (`r-css-color.md:319`,
F5 disposition). **That "or-pin" escape hatch does not exist for animations**,
and the consequence reshapes the W9 S4 design.

**Grounded mechanism (MDN, authoritative):** `<color-interpolation-method>` is a
CSS **data type**, *not* a standalone property. It is accepted **only** inside
the functional notations `color-mix()`, `linear-gradient()` and the other
gradient functions — there is **no** `color-interpolation-method: oklch` property
you can set on an element to steer how its `color`/`background-color`
*animation/transition* interpolates. (MDN `<color-interpolation-method>`,
verified 2026-06-06: "is NOT a standalone CSS property … used within
`color-mix()`, gradients".) For animations/transitions, the interpolation space
is chosen **implicitly** by the keyframe color *syntax family*, per CSS Color 4
§12: **OKLab for non-legacy** (`oklab()`/`oklch()`/`lab()`/`lch()`/`color()`),
and UAs **may** use gamma sRGB for **legacy** (`#hex`/`rgb()`/`hsl()`/`hwb()`/
named) "for Web compatibility" (W3C css-color-4 §12; web search 2026-06-06
confirms this applies to "animation and transition rules").

**Why this matters for W9 S4.** keyframes carries an *explicit*, user-settable
`colorSpace` (default `oklab`, `constants.ts:181`) **and** `hueMethod`
(`constants.ts:142`, optional). A WAAPI color animation has **no channel** to
communicate either to the UA — the UA will interpolate in whatever space the
emitted keyframe *syntax* implies, with `shorter` hue. So the eligibility
predicate the E audit drafted must be **tightened** to a hard equality, not a
"pin where supported":

A color `InterpolatedVar` is WAAPI-admissible **iff ALL**:
1. both endpoints serialize to a single valid CSS color string (needs the
   value.js serializer — §3); **AND**
2. `options.colorSpace` is one the UA can be made to interpolate in **by
   emitting the endpoints in the matching syntax family**:
   - `oklab` (the default) → emit endpoints as `oklab(...)`/`oklch(...)`/
     non-legacy → UA interpolates in OKLab (the §12 default). **Admissible.**
   - a *legacy-sRGB* animation whose `colorSpace` is left default `oklab`:
     **NOT** byte-faithful — the UA *may* interpolate legacy pairs in **sRGB**,
     diverging from value.js's OKLab. Either force non-legacy emission (emit the
     sRGB endpoints as `oklab(...)` so the UA's non-legacy default kicks in — the
     win path), or stay on JS. The E audit's D-2/B2 "emit legacy as `rgb()`"
     advice is the *opposite* of what byte-faithfulness to the default
     `colorSpace: oklab` requires — it is correct only if kf *also* changes the
     animation's intended space to sRGB. **This is a real contradiction in the E
     hand-off that F must resolve** (see §3 note);
   - `srgb`/`lab`/`lch`/`display-p3`/`rec2020`/… (a non-default explicit space)
     → admissible **only** if the endpoints can be emitted in that exact family
     (`color(display-p3 …)`, `lab(…)`) so the implied interp space equals the
     request; **AND**
3. `hueMethod` is unset or `shorter` for cylindrical spaces — because `shorter`
   is the spec/UA default (vj `dispatch.ts:238` `interpolateHue(…, method =
   "shorter")` — value.js's own default matches CSS Color 4 §12.4) and there is
   **no way to request `longer`/`increasing`/`decreasing` from WAAPI**. A
   non-shorter hue method → **stay on JS**; **AND**
4. `colorSpace` is **not `hsv`** — `hsv` is a value.js space key
   (`COLOR_SPACE_RANGES`, vj `constants.ts:40`) with **no** CSS
   `<color-interpolation-method>` counterpart; a `colorSpace: "hsv"` animation
   has no faithful CSS interp family and must stay on JS.

**Net effect:** the admissible set is **narrower** than the E draft implied — it
is essentially *{ default `oklab` (or explicit non-legacy space) } × { unset /
`shorter` hue } × { CSS-string-serializable endpoints }*. That is still the
common case (the default config), so the win is real, but the gate is a hard
equality with four clauses, not the looser "match-or-pin" the E audit sketched.

- **disposition:** **GAP-NAMED · FOLD-F** for the `waapi.ts` predicate +
  `toWAAPIKeyframes` color emission; **value.js-HANDOFF** for the serializer that
  makes clause-1 possible (§3). The kf side is a clean refinement of the existing
  `isWAAPIEligible` loop (`waapi.ts:141-161`) — add the four-clause color gate in
  place of the blanket reject at `:153-156`, and emit color endpoint strings in
  `toWAAPIKeyframes` (currently it never reaches color because the animation is
  rejected upstream).
- **isomorphism:** the four clauses are exactly the conditions under which the
  UA's native interp is the *same* math value.js runs — so pixels match where
  admitted, and every non-matching case stays on the byte-faithful JS path. The
  CLAUDE.md eligibility note ("no color interpolation") and the `waapi.ts:66`
  docstring become *"color admitted only when the UA's implicit interp space +
  hue match the requested `(colorSpace, hueMethod)`"* — a doc-truth fix paired
  with the code.
- **measure-first:** the win is the removal of the per-frame JS color cost
  (d-color-interp measured ~290 ns/frame/color-prop, ~40× a numeric prop) +
  the `setProperty` reflow churn — **not** compositor offload (the D-6
  correction in `r-css-color` F5 stands: `color`/`background-color` are
  main-thread, only `transform`/`opacity`/`filter`/`backdrop-filter` composite).
  Needs the color bench (d-color-interp D-9, still absent — confirmed no color
  case in `bench/interpolation.bench.ts`) to defend.

---

## 3. The L4 non-legacy serializer (W9 S4's value.js half) — STILL ABSENT on BOTH sides; the hand-off shape, sharpened · value.js-HANDOFF

W9 S4 needs value.js to emit two things the live tree has **neither** of:

**(a) A `cssColorInterpKeyword(space, hueMethod)` helper.** Re-grounded: **no
such helper exists in value.js** (grep `color-interpolation|cssColorInterp|
interpKeyword|in oklab|in oklch` over vj `src/` → empty) **nor in keyframes**
(same grep over kf `src/` → empty). For the *gradient/`color-mix()`* emission
path (and any future `color-mix(in <space> …)` endpoint trick), a
`(space, hueMethod) → "in <space>[ <hue> hue]"` serializer is needed, with the
value.js→CSS space-name caveat: most `COLOR_SPACE_RANGES` keys (vj
`constants.ts:27`) are already CSS-valid (`oklab`, `oklch`, `display-p3`,
`xyz-d65`), but **`hsv` has no CSS keyword** (§2 clause 4) and `rgb` maps to the
CSS keyword `srgb`. So it is a small *map*, not an identity pass-through.

**(b) A non-legacy, space-preserving fast serializer.** vj `Color.toString()`
(`index.ts:191-199`) always emits `${colorSpace}(${values.join(" ")} / ${alpha})`
at full f64 precision — e.g. `oklab(53.998… 0.0962… -0.0928… / 100%)`, 73 chars.
For W9 S4's keyframe strings this is both (i) too long (the browser re-parses
each keyframe once at `animate()`, not per frame, so this is a one-time cost —
*less* acute than the per-frame `toString` D-1 names, but still a fixed-precision
win) and (ii) **never legacy `rgb()`** — so B2 output-space targeting is genuinely
absent.

**★ A contradiction in the E hand-off that F must resolve.** The E
`d-color-interp` D-2 + handoff B2 recommend *"emit legacy sRGB pairs as compact
`rgb()` so the UA's legacy-sRGB default matches"*. But §2 above shows that for a
WAAPI animation whose `colorSpace` is the **default `oklab`**, emitting `rgb()`
endpoints makes the UA interpolate in **sRGB** — which **diverges** from the
value.js OKLab the user asked for. The two pieces of advice are only mutually
consistent if kf *also* sets the animation's interp intent to sRGB. **The correct
W9 S4 rule:** the emit space must be chosen to make the UA's *implicit* interp
space equal the *requested* `colorSpace` — so a default-`oklab` animation emits
**non-legacy** (`oklab()`/`oklch()`) endpoints regardless of input family, and an
explicit `colorSpace: srgb` animation emits `rgb()`. B2 is right for the *gradient*
use case and for explicit-sRGB animations; it is **wrong** as a blanket WAAPI
keyframe rule. F's W9 S4 wave should carry this corrected rule into the kf-side
emission and the value.js-handoff B2 note should be annotated with it.

- **disposition:** **value.js-HANDOFF** (the serializer + the
  `cssColorInterpKeyword` map live in vj `color/index.ts`) — augments the
  existing handoff §3 row "WAAPI color faithfulness" with the **sharpened**
  emit-space rule and the `hsv`/`rgb`→`srgb` name caveat. **FOLD-F** for the kf
  consumption in `toWAAPIKeyframes`.
- **partial-progress note:** vj `Color.toFormattedString(digits)` (`index.ts:202`)
  now exists — a fixed-precision serializer the E-era cites did not call out. It
  is **not** the B1 zero-alloc fast path (it still does `values().slice().map()`,
  three arrays), and it still emits in storage space only (no B2). But it means
  the *precision* half of W9 S4's serializer is partly there; the hand-off should
  reference it as the seam to extend, not a greenfield (§6 RECORD).
- **isomorphism:** precision rounding is sub-JND (D-1's `DELTA_E_OK_JND=0.02`
  argument holds); the emit-space rule is byte-faithful by construction (it
  *defines* faithfulness as "UA implicit space == requested space").

---

## 4. The context-keyword sentinels (W9 S6) — STILL ABSENT; + a NEW resolution-timing caveat the E audit missed · value.js-HANDOFF + FOLD-F

`currentColor`/`light-dark()`/system-colors still don't parse (§1 table). The E
`r-css-color` F1/F2/F3 + handoff F2/F2c fully specify the **sentinel** shape
(parser emits a `ValueUnit("currentColor", "color-keyword")` /
`FunctionValue("light-dark", [c1,c2])` that does *not* bake to a fixed RGB; kf
resolves per-target at frame-prep via the existing computed-value seam). I do not
re-derive that — it stands. **One net-new SOTA caveat** the E audit did not have,
from the modern-web-guidance `css` guide (retrieved 2026-06-06):

> *"When using `light-dark()` on an inherited `<color>` property, it resolves to
> a specific color based on **that element's** `color-scheme` and inherits as the
> resolved color, not as a `light-dark()` value. It will NOT adapt to
> descendant-specific `color-scheme` overrides."*

**Implication for the W9 S6 resolution policy:** kf must resolve `light-dark()`
against the **animation target's own** computed `color-scheme` (not `:root`'s, not
a global `matchMedia` probe). The E F2 disposition offered
`matchMedia('(prefers-color-scheme: dark)')` as a *fallback* — that is correct
only when the target inherits the page scheme; the **primary** resolution must be
`getComputedStyle(target).colorScheme` so a `color-scheme`-overriding subtree (the
`component-specific-light-dark-theme` guide's whole point) animates to the right
branch. This is a per-target frame-prep read — structurally identical to the
`currentColor` → `getComputedStyle(target).color` read, and to the computed-unit
`getComputedValue` round-trip the engine already owns. F's W9 S6 wave should pin
**"resolve against the target's own computed `color-scheme`/`color`, per-target,
at frame-prep"** as the contract.

- **disposition:** **value.js-HANDOFF** (the sentinel parser tokens, unchanged
  from E F1/F2/F3) **+ FOLD-F** (the kf resolution policy, with the
  target's-own-scheme caveat as a binding clause). Priority: `currentColor` HIGH
  (most-used dynamic keyword, hard parse-fail today), `light-dark()` HIGH
  (Baseline May 2024, the idiomatic dark-mode primitive), system colors MED.
- **isomorphism:** resolving from the **target's** computed value is *exactly*
  what the platform does — strictly more isomorphic than today's hard parse-fail,
  and more correct than a `:root`-scoped resolution.

---

## 5. `contrast-color()` — Baseline CONFIRMED **April 2026** (now shipped tri-engine); the spec function is **black/white only**, value.js's science is RICHER · BOOK + value.js-HANDOFF (opportunity)

The E `r-css-color` F4 named this; I **confirm + sharpen** with fresh grounding
(web.dev April-2026 Baseline digest + MDN, 2026-06-06):

- `contrast-color(<color>)` reached **Baseline Newly Available April 2026**
  (Chrome 147 / Firefox 146 / Safari 26.0; all pass WPT) → **Baseline Widely
  Available projected 2028-10**. So as of this audit it is **shipped in all three
  engines** — past the E audit's "2026-04-10" framing, now genuinely usable.
- **The critical spec fact the E audit under-stated:** the shipped
  `contrast-color()` returns **only black or white** (whichever has greater WCAG
  contrast; ties → white). value.js's `safeAccentColor` (vj `contrast.ts:90`) is
  a **different, richer function** — it preserves hue and shifts OKLCH lightness/
  chroma. So a *spec-faithful* `contrast-color()` parser must **not** route to
  `safeAccentColor` (that would silently diverge from every browser). The
  hand-off must offer **two** surfaces: a spec-faithful `contrast-color()` →
  black/white resolver, and `safeAccentColor` kept as the richer *programmatic*
  API (the E F4 isomorphism note got this right; I elevate it to a hard
  requirement because the function shipped and divergence is now testable).
- The `.bbnf` still encodes the **abandoned** `color-contrast()` `vs`/list form
  (`.bbnf:98`) and the top-level `color` production (`.bbnf:134`) still advertises
  it — doubly stale (wrong syntax AND unimplemented).

- **disposition:** **BOOK** the `.bbnf` drift (delete/rewrite `colorContrast` →
  `contrastColor = "contrast-color" << "(" color << ")"`); **value.js-HANDOFF**
  for the spec-faithful resolver as a *competitive surfacing* (low cost — the
  contrast science is written; the parser branch is the only missing piece). Not
  required for animation-input parsing (you rarely animate *to* a
  `contrast-color()`), so MED priority — but a real differentiator.
- **isomorphism:** the spec function and `safeAccentColor` are **distinct
  functions** — expose both, do not alias.

---

## 6. ALREADY-SOTA — manufacture NO work (re-confirmed live, post-E)

The E corpus's ALREADY-SOTA roll is **intact** on the live value.js tree; I
re-confirm the load-bearing ones so F invents nothing here:

- **The full L4/L5 functional surface parses** (`Value` dispatch vj
  `color.ts:556-571`): `oklab`/`oklch`/`lab`/`lch`/`color()` (all 9 predefined
  spaces + Bradford D50↔D65), `color-mix()` (all 4 hue methods, premultiplied
  alpha, `none`-adopt), **relative color `from`** (`relativeColorParser`
  `color.ts:293`, math-AST evaluated, no `eval`), `none` channel keyword,
  `transparent`, Kelvin, the runtime custom-name registry. **This is genuine
  CSS Color 5 coverage and it is exemplary — do not touch.**
- **`hueMethod` default = `shorter`** (vj `dispatch.ts:238`) **exactly matches**
  CSS Color 4 §12.4's spec default — so kf's "unset hueMethod → value.js picks
  the default" path (`engine.ts:459-462`) is spec-faithful AND UA-default-faithful
  with zero kf code. **ALREADY-SOTA** (and load-bearing for §2 clause 3).
- **One-time space collapse at frame-prep** (vj `normalize.ts`, `inverse=true`) —
  no per-frame color-space conversion; the matrix multiplies are amortized.
  **ALREADY-SOTA.**
- **Analytical Ottosson OKLab gamut map** (vj `color/gamut.ts`) — closed-form,
  hue-preserving, **ahead of shipping browsers**: the modern-web-guidance `css`
  guide (retrieved 2026-06-06) explicitly warns *"browsers do not yet implement
  gamut mapping [for relative color syntax], so the resulting color is
  unpredictable … DO NOT just adjust lightness in `oklch`/`oklab`"* — value.js's
  analytical map is the *better* path for exactly the case browsers punt.
  **ALREADY-SOTA — a competitive advantage, not catch-up.**
- **`prepareInterpVar` `_lerp` pre-dispatch** (vj `interpolate.ts:143-150`) — the
  monomorphic dispatch is resolved once; the *carrier* it mutates is the open
  question (handoff Wave D, out of this lane's color scope).

**Partial-progress delta (RECORD, not work):** vj `Color.toFormattedString(digits)`
(`index.ts:202`) is a fixed-precision serializer that the E-era D-1 cites did not
note — it does **not** close B1 (still 3-array, still storage-space-only) but it
is the seam the W9 S4 serializer extends (§3).

---

## 7. The L5/L6 frontier — BOOK (named, not folded; not yet Baseline)

Probed for surface the E audit did not name; all correctly **absent** from
value.js and **not** yet Baseline, so BOOK (record, do not build):

- **`device-cmyk()` / `cmyk`** — grep over vj `src/parsing/` + `src/units/color/`
  → empty. CSS Color 5 print-targeted; not Baseline for the web animation domain.
  **BOOK.**
- **HDR / `dynamic-range-limit` / wide-gamut HDR signalling** — no surface in vj
  (grep `dynamic-range|hdr` → empty). `display-p3`/`rec2020` **parse + interp**
  already (ALREADY-SOTA, SS6), but the HDR *headroom* controls
  (`dynamic-range-limit`, Chrome-only, limited availability) are frontier. The
  D-8 egress-gamut question (wide-gamut output silently sRGB-clipped, vj
  `xyz-extended.ts`/`direct.ts`) remains the **one real wide-gamut correctness
  gap** and stays in the handoff Wave B4 — not re-raised, still valid. **BOOK**
  (the HDR controls) **+ the B4 verify stands.**
- **`color-layers()`** (the proposed L5 layered-color function) — not in any
  spec stable enough; **BOOK.**
- **Gradient/`color-mix()` interpolation-hint stops** (the `<color> <length>`
  midpoint-hint syntax) — orthogonal to keyframe interp (kf does not emit
  gradients); **KILL** for the animation engine's scope.

---

## Disposition summary

| # | Finding | Disposition | Repo | Priority |
|---|---------|-------------|------|----------|
| §1 | E withholds (W9 S4/S6) live-state UNCHANGED — the WITHHELDs held | **RECORD** | both | — |
| §2 | `color-interpolation-method` is not a property → W9 S4 eligibility gate is a **4-clause hard equality**, narrower than the E draft (corrects F5/D-6 "or-pin") | **GAP-NAMED · FOLD-F** + value.js-HANDOFF | kf + vj | **HIGH** |
| §3 | L4 non-legacy serializer + `cssColorInterpKeyword` map STILL ABSENT both sides; **the B2 "emit legacy as rgb()" advice contradicts default-`oklab` faithfulness** — corrected emit-space rule | **value.js-HANDOFF** + FOLD-F | vj + kf | **HIGH** |
| §4 | `currentColor`/`light-dark()`/system sentinels still absent; **NEW: resolve `light-dark()` against the target's OWN computed `color-scheme`** (not `:root`/global) | **value.js-HANDOFF** + FOLD-F | vj + kf | **HIGH** (currentColor, light-dark) / MED (system) |
| §5 | `contrast-color()` Baseline CONFIRMED Apr-2026 (tri-engine); spec fn is **black/white only** — must NOT alias to value.js's richer `safeAccentColor`; `.bbnf` doubly-stale | **BOOK** + value.js-HANDOFF (opportunity) | vj | MED |
| §6 | Full L4/L5 functional surface, `shorter`-default, one-time collapse, analytical gamut map — exemplary | **RECORD (ALREADY-SOTA)** | vj | — |
| §7 | `device-cmyk`/HDR `dynamic-range-limit`/`color-layers()` frontier; gradient hints out-of-scope | **BOOK** (frontier) / KILL (gradient hints) | vj | LOW |

**The honest bottom line:** value.js's color *science and parse breadth* are at
or ahead of SOTA (§6) — F manufactures no work there. The gaps are exactly the
two E-WITHHELD seams, intact and ready to fold: the **WAAPI color un-reject**
(W9 S4) and the **context-keyword sentinels** (W9 S6). This lane's net-new
contribution is the **mechanism correction** that `color-interpolation-method`
cannot be pinned for animations — which tightens the W9 S4 eligibility gate to a
4-clause hard equality and exposes a contradiction in the E hand-off's
emit-space advice (B2's "legacy → `rgb()`" is wrong for a default-`oklab`
animation). Plus the `light-dark()` **target's-own-scheme** resolution caveat for
W9 S6, and the `contrast-color()` **black/white-only** divergence guard.

---

**Sources (grounded 2026-06-06):**
- [MDN — `<color-interpolation-method>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-interpolation-method) — NOT a standalone property; only in `color-mix()`/gradients; OKLab default.
- [W3C CSS Color Module Level 4 §12](https://www.w3.org/TR/css-color-4/) — interpolation default OKLab non-legacy; UAs MAY use gamma sRGB for legacy; applies to animation/transition rules.
- [MDN — `contrast-color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color) + [web.dev April 2026 Baseline digest](https://web.dev/blog/baseline-digest-apr-2026) — Baseline Apr 2026, Chrome 147/Firefox 146/Safari 26; returns black/white.
- [Chrome for Developers — Access more colors and new spaces](https://developer.chrome.com/docs/css-ui/access-colors-spaces) — wide-gamut/oklab adoption.
- modern-web-guidance `css` guide (Baseline-dated: relative-color gamut-mapping NOT yet shipped; `light-dark()` inherited-resolution caveat) + `dark-mode` / `component-specific-light-dark-theme` guides.
- E corpus: `docs/tranches/E/audit/sota/r-css-color.md` (F1–F6), `…/d-color-interp.md` (D-1–D-10), `docs/tranches/E/valuejs-sota-handoff.md` (Waves B, F), `docs/tranches/E/FINAL.md` (W9 S4/S6 needs-handoff record).
- Live trees: kf `src/animation/{waapi.ts:153-156, constants.ts:140-181, engine.ts:439-475}`; vj `src/parsing/color.ts:556-571`, `src/parsing/grammars/css-color.bbnf:93-136`, `src/units/color/{index.ts:18-208, contrast.ts:90, dispatch.ts:234-268, constants.ts:27-211}`, `src/units/interpolate.ts:57-150`.
