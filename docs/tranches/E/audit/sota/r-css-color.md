# SOTA Audit — Lane: CSS Color L4/L5 syntax surface + WAAPI color un-reject

**Tranche E · research + findings only (no implementation).**

**Lane scope (forward-SOTA research — the re-exec lane).** The *language /
syntax* surface of CSS Color Level 4 & 5 (and the L4→L5 drift in
`contrast-color()`/`light-dark()`), measured against value.js's live parser, and
the keyframes.js-side WAAPI color rejection that forfeits native color
interpolation. This lane is deliberately **orthogonal** to the two sibling color
lanes:

- `a-vj-color-units.md` (F1–F6) — units/normalize/interp *correctness + perf*.
- `d-color-interp.md` (D-1–D-10) — the per-frame interp *hot path* (serializer
  cost, channel plan, gamut egress, demo/bench).

Those two already cover: OKLab default (A1), the relative-color / `color()` /
`color-mix()` *parse surface* at a glance (A2), 15-space interp targets (A3),
hue methods (A4), `color-mix` semantics (A5), analytical gamut map (D-7),
serialization cost (D-1), output-space targeting for *interp space* (D-2),
WAAPI compositor claim (D-6). **I do not re-litigate those.** My lane finds what
they did not look at: the **L4/L5 keyword/function token coverage** (the doc-vs-
impl drift in value.js's own grammar), the **L4→L5 spec churn** that has moved
under the codebase since the `.bbnf` was written, and a **correction** to the
D-6 WAAPI-color mechanism.

**inv-16 disposition rule.** keyframes.js findings → **FOLD-E**; value.js
findings → **FOLD-VALUEJS-HANDOFF** (value.js is dirty + active — never propose
writing it directly; name the tranche the owner formalizes).

All `file:line` cites are against the live trees at audit time
(`/Users/mkbabb/Programming/value.js`, `/Users/mkbabb/Programming/keyframes.js`,
state of 2026-06-05).

---

## Verdict (headline)

**The L4/L5 *functional* surface — `oklab/oklch/lab/lch/color()/color-mix()` +
relative-color `from` + 15 spaces + `none` keyword — is genuinely SOTA and
present in the live parser (ALREADY-SOTA).** The gaps are at the **keyword
edge**, and they are real:

1. **`currentColor` does not parse** — the single most-used dynamic color
   keyword on the platform fails value.js's parser outright (GAP).
2. **`light-dark()` does not parse** — Baseline Newly Available (May 2024), the
   modern-web-guidance `dark-mode` guide's MANDATORY dark-mode primitive, and
   value.js's *own grammar file documents it* (`css-color.bbnf:93`) — but the
   live hand-written parser never implements it. Pure doc/impl drift (GAP).
3. **System colors (`Canvas`, `ButtonText`, `AccentColor`, …) do not parse** —
   documented in the grammar (`css-color.bbnf:108-124`), CSS Color 4 §6.2
   Baseline, absent from the live parser (GAP).
4. **`color-contrast()` in the grammar is the *abandoned* spelling** — the
   CSSWG **dropped `color-contrast()` and replaced it with `contrast-color()`**,
   which reached **Baseline Newly Available 2026-04-10** (Chrome 147 / Firefox
   146 / Safari 26). value.js even *has the contrast science*
   (`contrast.ts safeAccentColor`) but wires neither spelling to a parser; the
   `.bbnf` documents the dead one (BOOK + GAP-NAMED).
5. **WAAPI color is unconditionally rejected** (`waapi.ts:116-121`) — forfeiting
   the browser's native `color-interpolation-method`-driven OKLab interpolation
   for *every* color animation. D-6 named this but with a **wrong mechanism**
   (compositor offload); the correct framing is native main-thread interp + spec
   parity (GAP-NAMED / FOLD-E, **corrects D-6**).

The `.bbnf` grammar (`value.js/src/parsing/grammars/css-color.bbnf`) is a
**specification artifact, not a runtime parser** — it is declared only as a
`*.bbnf?raw` module (`value.js/src/vite-env.d.ts:3`) and **never imported as a
parser**. Its header even concedes this: *"Hand-written combinators in color.ts
remain the production parsers"* (`css-color.bbnf:7`). So everything the grammar
lists but `color.ts` omits is **documented-but-unimplemented** — the most
dangerous kind of gap, because the spec doc reads as coverage.

---

## §0 — Ground truth: what the live parser actually accepts

The production color parser is `CSSColor.Value` (`value.js/src/parsing/color.ts:556-571`),
an `any(...)` over exactly these branches:

```
colorMix · colorFunction · hex · kelvin · rgb(a) · hsl(a) · hsv(a) · hwb(a)
· lab · lch · oklab · oklch · xyz · nameParser
```

`nameParser` (`color.ts:540-552`) matches a broad ident regex
(`/[a-zA-Z][a-zA-Z0-9-]*/`) then requires the lowercased key to be in
`KNOWN_COLOR_NAMES = new Set(Object.keys(COLOR_NAMES))` (`color.ts:536`).
`COLOR_NAMES` (`value.js/src/units/color/constants.ts`) contains the 148 CSS
named colors + `rebeccapurple` (`constants.ts:513`) + `transparent`
(`constants.ts:534`). It does **not** contain `currentColor` or any system
color. So:

| Input | L4/L5? | value.js live parser | Note |
|-------|--------|----------------------|------|
| `transparent` | L4 §6.1 | **parses** | in `COLOR_NAMES` (`constants.ts:534`) — ALREADY-SOTA |
| `none` (channel keyword) | L4 §4.4 | **parses** | `colorValue` → `NaN` (`color.ts:250`) — ALREADY-SOTA |
| `oklch(0.7 0.2 30)` etc. | L4 | **parses** | A2/A3 — ALREADY-SOTA |
| `rgb(from red r g b)` | L5 rel. | **parses** | `relativeColorParser` (`color.ts:293`) — ALREADY-SOTA |
| `color-mix(in oklch, …)` | L5 | **parses** | `colorMix` (`color.ts:424`) — ALREADY-SOTA |
| **`currentColor`** | L3/L4 | **FAILS** | not in `COLOR_NAMES`; F1 |
| **`light-dark(a, b)`** | L5 | **FAILS** | grammar-only; F2 |
| **`Canvas` / `ButtonText` / `AccentColor`** | L4 §6.2 | **FAILS** | grammar-only; F3 |
| **`contrast-color(red)`** | L5/L6 | **FAILS** | renamed; F4 |
| **`color-contrast(red vs a, b)`** | abandoned | **FAILS** | dead spelling in `.bbnf`; F4 |

---

## FINDINGS

### F1 — `currentColor` does not parse · GAP · FOLD-VALUEJS-HANDOFF (+ FOLD-E policy)

- **file:** `value.js/src/parsing/color.ts:540-552` (`nameParser`) +
  `value.js/src/units/color/constants.ts` (`COLOR_NAMES`, no `currentcolor`
  entry — confirmed by grep). Top-level dispatch
  `value.js/src/parsing/color.ts:556-571` has no `currentColor` branch.
- **gap:** `currentColor` is the most-used *dynamic* color keyword on the web —
  it is the L4/L3 mechanism for "inherit `color`," the basis of icon theming,
  and pairs directly with `light-dark()`/`color-scheme`. A keyframe value of
  `currentColor` (or `color: currentColor → red`) fails value.js's parser: the
  ident regex matches `currentColor`, `KNOWN_COLOR_NAMES.has("currentcolor")` is
  false, `nameParser` `fail`s, and the whole `Value` parse fails.
- **spec/guide:** CSS Color 4 §6 (the keyword colors include `currentColor`);
  modern-web-guidance `dark-mode` guide treats `currentColor`/`color-scheme` as
  the idiomatic theming substrate. It is **Baseline since forever**.
- **why it's not a trivial `COLOR_NAMES` add:** `currentColor` is *not a fixed
  color* — it resolves to the element's computed `color` at use time. It is
  **DOM-context-dependent**, exactly like `var()`/computed units already are in
  this engine (`waapi.ts:27`, `getComputedValue`). The honest resolution is the
  computed-value path (read `getComputedStyle(target).color`), not a constant.
  As an *animation endpoint* it must resolve per-target at frame-prep, then
  interpolate as a normal color — structurally the same problem the computed-
  unit pipeline already solves (`a-vj-color-units` F2 / `d-color-interp` D-4
  memo).
- **rationale (correctness):** silent total parse-failure on the platform's
  most common dynamic color is a sharp gap for a "fully up-to-spec" color
  engine. Even a *static* fallback (treat `currentColor` as a sentinel
  ValueUnit that the consumer resolves) beats outright rejection.
- **disposition:** **FOLD-VALUEJS-HANDOFF** for the parser token (value.js owns
  `color.ts`): add a `currentColor` (case-insensitive) branch producing a
  sentinel `ValueUnit("currentColor", "color-keyword")` that does **not** get
  baked to a fixed RGB. **FOLD-E** for the *resolution policy*: keyframes.js
  resolves the sentinel via the existing computed-value seam at frame-prep
  (read target's computed `color`), then interps as a normal color — and marks
  the animation WAAPI-ineligible *only if* it must (browsers resolve
  `currentColor` natively, see F5).
- **isomorphism:** resolving `currentColor` from the target's computed `color`
  is exactly what the platform does — *more* isomorphic than today's hard
  failure. No pixels change for inputs that already parsed.

---

### F2 — `light-dark()` documented in the grammar but not in the live parser · GAP · FOLD-VALUEJS-HANDOFF

- **file:** grammar **claims** it —
  `value.js/src/parsing/grammars/css-color.bbnf:90-93`
  (`lightDark = "light-dark" << "(" , color , "," , color << ")"`) and lists it
  first in the top-level `color` production (`css-color.bbnf:134`). The **live**
  parser `value.js/src/parsing/color.ts:556-571` has **no** `light-dark` branch.
- **gap:** `light-dark(a, b)` is **Baseline Newly Available (May 2024)** and the
  modern-web-guidance `dark-mode` guide's recommended primitive for adaptive
  color tokens (it shows `--color-brand: light-dark(var(--light), var(--dark))`
  as the idiomatic pattern — superseding `prefers-color-scheme` media queries).
  A modern stylesheet's color values are increasingly `light-dark(...)`; feeding
  one to value.js fails the whole parse.
- **spec/guide:** CSS Color 5 §"light-dark()"; modern-web-guidance
  `dark-mode` + `component-specific-light-dark-theme` guides (both Baseline-
  dated, cite ids `dark-mode` / `component-specific-light-dark-theme`). MDN:
  Baseline 2024, widely-available ~Nov 2026.
- **why it's context-dependent:** `light-dark()` resolves against the *used*
  `color-scheme` of the element — like `currentColor` (F1), it is **not a pure
  function**. Resolution = pick arg 1 under light scheme, arg 2 under dark,
  determined by the computed `color-scheme` of the resolution context. As an
  animation endpoint the right move is: at frame-prep, read the target's
  resolved scheme (`getComputedStyle(target).colorScheme` or a
  `matchMedia('(prefers-color-scheme: dark)')` fallback), select the branch,
  then interp the chosen color normally.
- **rationale:** this is the cleanest "doc says yes, code says no" drift in the
  whole color subsystem — the grammar advertises the feature, the parser
  silently lacks it. Closing it is mechanical (the inner `color` recursion
  already exists via `CSSColor.Value`).
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Propose a value.js token: a
  `light-dark(<color>, <color>)` parser that returns a sentinel
  `FunctionValue("light-dark", [c1, c2])` (deferring scheme resolution to the
  consumer, mirroring how `currentColor` defers `color` resolution). Optionally
  value.js resolves it eagerly against a passed-in scheme hint. **FOLD-E** for
  the keyframes-side scheme-context resolution at frame-prep.
- **isomorphism:** resolving by used `color-scheme` is byte-identical to the
  platform; for inputs that don't use `light-dark()`, nothing changes.

---

### F3 — System colors (`Canvas`/`ButtonText`/`AccentColor`/…) documented, not parsed · GAP · FOLD-VALUEJS-HANDOFF

- **file:** grammar **claims** the full L4 §6.2 set + the L3 deprecated set —
  `value.js/src/parsing/grammars/css-color.bbnf:108-124` (`systemColor`,
  `deprecatedSystemColor`). The **live** parser has no `systemColor` branch;
  `nameParser` (`color.ts:540`) matches the ident `Canvas` but
  `KNOWN_COLOR_NAMES.has("canvas")` is false (not in `COLOR_NAMES`), so it
  `fail`s.
- **gap:** CSS Color 4 §6.2 system colors (`Canvas`, `CanvasText`, `LinkText`,
  `ButtonFace`, `ButtonText`, `Field`, `Highlight`, `Mark`, `GrayText`,
  `AccentColor`, `AccentColorText`, …) are **Baseline** and the
  forced-colors / OS-theme integration substrate. The `dark-mode` guide flags
  them as OPTIONAL-but-real ("`canvas`, `canvastext`, `accentcolor`,
  `buttonborder` … adapt to the used color scheme"). They are **OS-and-scheme-
  dependent** (like F1/F2) — not constants.
- **spec/guide:** CSS Color 4 §6.2; modern-web-guidance `dark-mode` guide.
- **rationale:** lower-frequency than F1/F2 for animation (you rarely *animate*
  to `ButtonText`), but the grammar advertises them, so the drift is the same
  shape. The honest fix: resolve via the computed-value seam (set the system
  color on a probe element, read it back) — the engine already does exactly this
  round-trip for computed units (`getComputedValue`).
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Propose: a `systemColor` token that
  emits a sentinel keyword ValueUnit, resolved per-target via the computed-value
  seam (or rejected explicitly with a typed error rather than the current
  generic parse-fail). Lower priority than F1/F2. Optionally **just delete the
  system-color + deprecated-system-color blocks from the `.bbnf`** if value.js
  decides not to support them — the grammar should not advertise what the parser
  can't do (this alone closes the *drift*, see F6).
- **isomorphism:** resolving via the UA's own computed value is isomorphic by
  construction; today's behavior (parse-fail) is the departure.

---

### F4 — `.bbnf` documents the *abandoned* `color-contrast()`; the live spec is `contrast-color()` (Baseline 2026-04) — value.js has the science, wires neither · BOOK + GAP-NAMED · FOLD-VALUEJS-HANDOFF

- **file:** grammar documents the dead spelling —
  `value.js/src/parsing/grammars/css-color.bbnf:95-101`
  (`colorContrast = "color-contrast" << "(", color, "vs", color, …`) and lists
  it in the top-level `color` production (`css-color.bbnf:134`). Neither
  `color-contrast()` nor `contrast-color()` is in the live parser
  (`color.ts:556-571`). The **contrast science already exists** in value.js:
  `value.js/src/units/color/contrast.ts` — `safeAccentColor`,
  `computeSafeAccent`, `getOklchLightness`, `needsContrastAdjustment` — exported
  through `units/color/index.ts:719` and the package barrel
  (`src/index.ts:131`).
- **gap / spec churn:** the CSSWG **removed `color-contrast()`** (the
  `vs`/`to AA` list-picker form the `.bbnf` encodes) and replaced it with
  **`contrast-color(<color>)`** — a single-arg function that returns a
  contrasting color (typically a WCAG-AA-passing black or white) for a given
  base. `contrast-color()` reached **Baseline Newly Available 2026-04-10**
  (Chrome 147, Firefox 146, Safari 26.0); the old WebKit `color-contrast()`
  experiment never shipped cross-engine. So the grammar documents a syntax that
  **no longer exists in the spec**, and the *current* function is unimplemented
  despite value.js owning a `safeAccentColor` that is exactly the right engine
  for it.
- **spec/guide:** MDN `contrast-color()` (Baseline 2026-04); WebKit blog
  "How to have the browser pick a contrasting color in CSS"; the CSSWG drop of
  `color-contrast()`. (modern-web-guidance has no dedicated id yet — it post-
  dates the guide corpus; cite MDN + caniuse.)
- **rationale:** two-part. (a) **BOOK** the spec churn: the `.bbnf` is wrong/
  stale and should not advertise `color-contrast()`. (b) **GAP-NAMED**: value.js
  is one thin parser away from shipping `contrast-color()` — it already has the
  perceptual contrast machinery (`safeAccentColor` is *more* sophisticated than
  the spec's binary black/white pick: it preserves hue, shifts L, reduces chroma
  at extremes). This is a genuine *competitive* opportunity, not catch-up.
- **disposition:** **BOOK** (record: `.bbnf` documents abandoned syntax — either
  delete the `colorContrast` block or rewrite it as `contrastColor =
  "contrast-color" << "(" , color << ")"`). **FOLD-VALUEJS-HANDOFF** for the
  opportunity: wire `contrast-color(<color>)` to a `safeAccentColor`-backed
  resolver (it needs a background-lightness context, so it is context-dependent
  like F1–F3). Not required for "up-to-spec" parsing of *animation inputs* (you
  rarely animate *to* a `contrast-color()`), but it is a high-value, low-cost
  surfacing of science value.js already wrote.
- **isomorphism:** N/A for the BOOK part (doc fix). For the opportunity: the
  spec's `contrast-color()` returns black/white; value.js's `safeAccentColor`
  returns a hue-preserving safe color — so an exact-spec `contrast-color()`
  resolver and value.js's richer `safeAccentColor` are *different functions*.
  Recommend exposing both: spec-faithful `contrast-color()` parse →
  black/white pick, and keep `safeAccentColor` as the richer programmatic API.

---

### F5 — WAAPI rejects ALL color interpolation; browsers natively interpolate it per `color-interpolation-method` · GAP-NAMED · FOLD-E · (corrects d-color-interp D-6)

- **file:** `keyframes.js/src/animation/waapi.ts:116-121` — *any*
  `iv.start?.unit === "color" || iv.stop?.unit === "color"` makes the whole
  animation WAAPI-ineligible, reason `"color interpolation requires perceptual
  lerp"`. The CLAUDE.md eligibility note ("no color interpolation") restates it.
- **gap:** the rationale is stale. Browsers now natively interpolate color
  animations/transitions, and the **interpolation color space is selectable +
  spec-defined**: the `<color-interpolation-method>` type (MDN, Baseline) lets
  you pick `oklab`/`oklch`/`srgb`/`lab`/`lch`/`hsl`/`hwb`/`xyz`/…; and the
  **default** is **OKLab for non-legacy color syntax** (`oklab()`/`oklch()`/
  `color()`), **sRGB for legacy** (`#hex`/`rgb()`/`hsl()`/named) per CSS Color 4
  §12. So `background: oklch(0.7 0.2 30) → oklch(0.6 0.15 260)` *can* run as a
  WAAPI keyframe — the browser does the OKLab perceptual lerp itself, matching
  what value.js does in JS, but without the per-frame `lerpColorValue` +
  `Color.toString` + `setProperty` main-thread cost (d-color-interp measured
  ~290 ns/frame/color-property; ~40× a numeric property). The engine forfeits
  that for *every* color animation today.
- **CORRECTION to D-6:** d-color-interp D-6 framed the win as **"runs on the
  compositor thread, off-main-thread."** That is **wrong for color.**
  `background-color`/`color` are **not** compositor-accelerated properties — the
  Blink/WebKit compositor only accelerates `transform`/`opacity`/`filter`/
  `backdrop-filter` (Blink `core/animation` README; Motion's performance tier
  list). A WAAPI color animation runs on the **main thread**, same as the rAF
  loop. **The real win is different and still substantial:** the browser's
  native color interp (a) eliminates value.js's per-frame JS interp + 73-char
  serialize + reparse churn (d-color-interp D-1/D-3) — the browser interpolates
  internally with no string round-trip — and (b) lets the UA batch the style
  update inside its own animation tick rather than a JS `setProperty` per frame.
  So: not free compositor offload, but a real removal of the JS color hot path
  and the string round-trip. The eligibility refinement is the same; only the
  *rationale* changes.
- **spec/guide:** `<color-interpolation-method>` (MDN, Baseline); CSS Color 4
  §12 (default interp space: OKLab non-legacy / sRGB legacy); Blink
  `core/animation` README (compositor property set excludes color). The WebKit
  "extended color animation interpolation" commit (cited in D-6) is real — it
  enables native *non-legacy* color interp — but it is **main-thread**, not
  compositor.
- **rationale (perf + correctness):** the refined predicate: a color
  InterpolatedVar is WAAPI-eligible iff (a) both endpoints serialize to a single
  valid CSS color string, AND (b) the requested `colorSpace` (`constants.ts:181`
  default `oklab`) + `hueMethod` (`constants.ts`) **match the browser's
  interpolation default for that endpoint family** — OKLab for non-legacy, sRGB
  for legacy — *or* can be pinned via emitting `color-interpolation-method`
  where supported. A non-default `colorSpace` (e.g. `lch`) or a non-default
  `hueMethod` the UA can't honor → stay on the rAF/JS path (which runs the exact
  requested space). This keeps behavior byte-faithful while admitting the common
  case (the default `oklab`) to native interp.
- **disposition:** **FOLD-E.** keyframes owns `waapi.ts` eligibility +
  `toWAAPIKeyframes` (it would emit the color endpoints as CSS strings instead
  of excluding). Depends on the value.js compact serializer (d-color-interp D-1)
  to emit short keyframe strings, and on output-space targeting (D-2) to emit
  legacy colors as `rgb()` so the UA's legacy-sRGB default matches. This lane's
  contribution over D-6: the **corrected mechanism** (main-thread native interp,
  not compositor) and the **`color-interpolation-method` eligibility gate** tied
  to the OKLab-non-legacy / sRGB-legacy default split.
- **isomorphism:** the native interp is the *same* OKLab math value.js runs — so
  pixels match **only when** the requested space equals the UA default for that
  endpoint family. The guard MUST keep custom-space / custom-hue / legacy-but-
  oklab-requested animations on the JS path, so behavior never silently
  diverges. Conservative, opt-in, surfaced via the existing
  `waapiIneligibleReason`.

---

### F6 — `.bbnf` grammar drifts from the live parser on 4 features · BOOK · FOLD-VALUEJS-HANDOFF (doc hygiene)

- **file:** `value.js/src/parsing/grammars/css-color.bbnf`. The grammar's top-
  level `color` production (`css-color.bbnf:134-136`) lists `colorMix |
  colorContrast | lightDark | colorFn | relativeColor | colorFunction | hex |
  kelvin | systemColor | namedColor`. The live parser
  (`color.ts:556-571`) omits **`colorContrast`** (F4 — and it's the dead
  spelling anyway), **`lightDark`** (F2), **`systemColor`** (F3), and has no
  `currentColor` (F1, which the grammar *also* omits — so here the grammar is
  actually correct-by-omission, but the parser-vs-spec gap remains).
- **gap:** the grammar's own header says *"Hand-written combinators in color.ts
  remain the production parsers"* (`css-color.bbnf:7`) — so it's explicitly a
  spec doc, but it advertises four features the production parser lacks, with no
  marker distinguishing "implemented" from "aspirational." Anyone reading the
  grammar as the source of truth (it's the most legible artifact) over-reads the
  coverage. Confirmed not-wired: only `value.js/src/vite-env.d.ts:3` references
  `.bbnf` (as a `?raw` module type), never as a parser import.
- **spec/guide:** N/A — this is doc hygiene / single-source-of-truth.
- **rationale (elegance / KISS):** a grammar that lies about coverage is worse
  than no grammar. Either (a) annotate each production with an
  `IMPLEMENTED` / `SPEC-ONLY` marker, or (b) prune the four unimplemented
  productions, or (c) — best — close F1–F4 so the grammar becomes *true*. The
  `contrast-color()` rename (F4) means the `colorContrast` block is doubly stale
  (wrong syntax AND unimplemented).
- **disposition:** **BOOK** + **FOLD-VALUEJS-HANDOFF** (value.js owns the
  grammar file). Bundle the doc fix with whichever of F1–F4 land; at minimum,
  correct `colorContrast` → `contrastColor` and mark the unimplemented
  productions.
- **isomorphism:** N/A — documentation.

---

## ALREADY-SOTA — explicitly flagged (do not manufacture work)

Per the precept — honesty, no invented work. These are state-of-the-art on the
*L4/L5 syntax surface* and must not be touched:

- **SS1 · `none` channel keyword** (CSS Color 4 §4.4) — `colorValue` maps
  `none` → `NaN` (`color.ts:250`), and the interp path adopts-the-other-channel
  for `NaN` (per `a-vj` A4/A5). **ALREADY-SOTA.**
- **SS2 · `transparent`** — in `COLOR_NAMES` as `rgba(0,0,0,0)`
  (`constants.ts:534`); parses correctly. **ALREADY-SOTA.**
- **SS3 · Relative color syntax `from`** — full `rgb/hsl/hwb/lab/lch/oklab/
  oklch/xyz(from <color> <expr> <expr> <expr> / <expr>)` with `calc()` /
  component-ref / `none` / literal component expressions
  (`relativeColorParser` `color.ts:293-312`, `componentExpr` `color.ts:254-267`,
  `resolveRelativeColor` `color.ts:155-194`), evaluated via the library math AST
  (no `eval`, `color.ts:120-133`). This is CSS Color **5** and it's live.
  **ALREADY-SOTA.**
- **SS4 · `color()` for all predefined spaces** — `srgb`/`srgb-linear`/
  `display-p3`/`a98-rgb`/`prophoto-rgb`/`rec2020`/`xyz`/`xyz-d65`/`xyz-d50`
  with Bradford D50→D65 adaptation (`colorFunction` `color.ts:490-525`).
  **ALREADY-SOTA.**
- **SS5 · `color-mix()`** — full space map incl. `xyz-d50`/`xyz-d65`, all four
  hue methods, percentage-complement + alpha-multiplier semantics
  (`colorMix` `color.ts:424-474`, `COLOR_MIX_SPACE_MAP` `color.ts:197-213`).
  CSS Color 5. **ALREADY-SOTA.** (D-5 already named the *compile-time
  pass-through* opportunity for constant mixes — not re-raised here.)
- **SS6 · Wide-gamut `display-p3`/`rec2020`/`a98-rgb`/`prophoto-rgb`/
  `srgb-linear`** parse + are valid interp targets (`COLOR_FUNCTION_SPACES`
  `color.ts:216-226`; keyframes `COLOR_SPACES` `constants.ts:32`).
  **ALREADY-SOTA** (the *egress* gamut-target question is d-color-interp D-8 —
  not re-raised).
- **SS7 · OKLab/OKLCH first-class** — both parse, both are the default/idiomatic
  interp spaces (`oklabParser`/`oklchParser` `color.ts:367-379`; default
  `colorSpace: "oklab"` keyframes `constants.ts:181`). **ALREADY-SOTA.**
- **SS8 · Runtime custom color-name registry** — `registerColorNames` /
  `clearCustomColorNames` with memo invalidation (`color.ts:584-602`). Beyond
  spec; a nice DX extension. **ALREADY-SOTA-adjacent.**

---

## Disposition summary

| # | Title | Disposition | Repo | Priority |
|---|-------|-------------|------|----------|
| F1 | `currentColor` does not parse | FOLD-VALUEJS-HANDOFF (+ FOLD-E policy) | value.js + kf | **HIGH** |
| F2 | `light-dark()` grammar-only, unimplemented | FOLD-VALUEJS-HANDOFF (+ FOLD-E policy) | value.js + kf | **HIGH** |
| F3 | System colors grammar-only, unimplemented | FOLD-VALUEJS-HANDOFF | value.js | MED |
| F4 | `.bbnf` documents abandoned `color-contrast()`; live spec is `contrast-color()` (Baseline 2026-04); value.js has the science | BOOK + GAP-NAMED + FOLD-VALUEJS-HANDOFF | value.js | MED |
| F5 | WAAPI rejects all color interp; browsers natively interp per `color-interpolation-method` (corrects D-6 mechanism) | GAP-NAMED / FOLD-E | keyframes.js | **HIGH** |
| F6 | `.bbnf` grammar drifts from live parser on 4 features | BOOK + FOLD-VALUEJS-HANDOFF (doc) | value.js | LOW |

## value.js hand-off tranche shape (consolidated — "L4/L5 keyword surface")

A single value.js tranche would carry F1–F4 + F6, all of one shape —
**context-dependent color keywords/functions that resolve at use time, not
parse time:**

1. **`currentColor` token** → sentinel ValueUnit, consumer resolves from the
   target's computed `color` (F1).
2. **`light-dark(<color>, <color>)` token** → `FunctionValue("light-dark", …)`
   sentinel, consumer resolves by the target's used `color-scheme` (F2).
3. **System-color tokens** → sentinel, consumer resolves via the computed-value
   probe seam (or explicit typed reject) (F3).
4. **`contrast-color(<color>)` token** → wire to the existing `safeAccentColor`
   science (`contrast.ts`); BOOK the `color-contrast()`→`contrast-color()`
   rename and fix the `.bbnf` (F4 + F6).

All four share the engine's **existing** context-resolution machinery (the
`getComputedValue` / computed-unit seam) — they are the *color* analogue of the
`vh`/`var()`/`calc()` computed-unit story already solved (`a-vj` F2 /
d-color-interp D-4). The parser change is small (add branches to
`color.ts:556`); the resolution is the consumer's (keyframes) job at frame-prep.

## keyframes.js (FOLD-E)

- **F5** — refine `waapi.ts:116-121` to admit color animations whose endpoints
  are CSS-string-expressible AND whose requested `colorSpace`/`hueMethod` match
  the UA's `color-interpolation-method` default (OKLab non-legacy / sRGB
  legacy); emit color keyframe strings from `toWAAPIKeyframes`. **Corrects D-6's
  compositor framing to main-thread native interp.** Depends on the value.js
  compact serializer (D-1) + output-space targeting (D-2).
- **F1/F2/F3 resolution policy** — once value.js emits the sentinels, resolve
  `currentColor` / `light-dark()` / system colors per-target at frame-prep via
  the existing computed-value seam, then interp as a normal color.

---

**Sources:**
- modern-web-guidance `dark-mode` guide (Baseline-dated: `light-dark()` 2024,
  `color-scheme`, `accent-color`, system colors) — cite id `dark-mode`.
- modern-web-guidance `component-specific-light-dark-theme` (cite id
  `component-specific-light-dark-theme`); `css` guide.
- [MDN — light-dark() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) (Baseline Newly Available May 2024).
- [MDN — contrast-color() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color) (Baseline Newly Available 2026-04-10; Chrome 147 / Firefox 146 / Safari 26).
- [WebKit — How to have the browser pick a contrasting color in CSS (`contrast-color()`)](https://webkit.org/blog/16929/contrast-color/).
- [MDN — `<color-interpolation-method>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color-interpolation-method) (interp-space keywords; OKLab default non-legacy / sRGB legacy per CSS Color 4 §12).
- [Blink core/animation README — compositor property set excludes color](https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/core/animation/README.md).
- [Motion — Web Animation Performance Tier List (color not compositor-accelerated)](https://motion.dev/magazine/web-animation-performance-tier-list).
- CSS Color 4 §6 (keyword + system colors), §4.4 (`none`), §12 (interpolation defaults); CSS Color 5 (relative color, `color-mix()`, `light-dark()`).
- value.js live tree: `src/parsing/color.ts`, `src/parsing/grammars/css-color.bbnf`, `src/units/color/constants.ts`, `src/units/color/contrast.ts`, `src/vite-env.d.ts`.
- keyframes.js live tree: `src/animation/waapi.ts`, `src/animation/constants.ts`, `src/animation/engine.ts`.
