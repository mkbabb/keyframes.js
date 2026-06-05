# Tranche E · SOTA Audit — keyframes.js computed-unit DOM round-trip (the value.js boundary)

**Lane:** the `vh` / `calc` / `cqw` / `var` resolution path — keyframes
`frame-compiler.ts` / `engine.ts` → value.js `lerpComputedValue` /
`getComputedValue` / `normalizeNumericUnits` (DOM write + read + restore).
**Mandate:** re-audit ACROSS the boundary. D-3 measured the keyframes-local
changed-keys write as ~0 (the real cost is in value.js re-serialization). Is the
value.js side (`getComputedValue` memo key = `toString()+elementId`,
`normalizeNumericUnits` compile-time bake) the real win? Quantify.
**inv-16:** keyframes findings → FOLD-E; value.js findings →
FOLD-VALUEJS-HANDOFF (value.js is dirty + active; propose a value.js tranche,
do NOT write it).

---

## 0. The path, end to end (ground truth, file:line)

Compile (once, in `FrameCompiler.parse(targets)`):

1. `frame-compiler.ts:283-293` — `parseAndFlattenObject(frame.vars)` per template
   frame, then `values.setTargets(targets)` binds the live DOM to every parsed
   `ValueUnit`. **This is the one DOM input.**
2. `frame-compiler.ts:258-265` → `utils.ts:225-283` `createInterpVarValue` →
   value.js `normalizeValueUnits(l, r, opts)` (`normalize.ts:361-415`) →
   `prepareInterpVar` (`interpolate.ts:143-150`). For each interp leaf this
   classifies the unit and pre-resolves the per-frame dispatch `iv._lerp`.

Runtime (every frame, every tick), `engine.ts:578-580`:

```
for (const iv of frame.allInterpVars) lerpValue(eased, iv);
```

`lerpValue` (`interpolate.ts:113-133`) takes the `iv._lerp` fast path. The
dispatch resolves to one of three:

| `iv._lerp` | units it serves | per-frame work |
|---|---|---|
| `lerpNumericValue` | px, %, deg, **and baked vh/cqw/em** | one `lerp` — zero DOM, zero alloc |
| `lerpColorValue` | `unit === "color"` | per-channel lerp (out of lane) |
| `lerpComputedValue` | **`var` / `calc` only** (`COMPUTED_UNITS`) | **2× `getComputedValue` per leaf per frame** |

The lane's whole cost question reduces to **two facts** below.

---

## FINDING 1 — `vh` / `vw` / `cqw` / `em` / `rem` are baked to px at compile, never re-resolved (the silent non-isomorphism)

- **Where:** value.js `units/constants.ts:54` — `COMPUTED_UNITS = ["var",
  "calc"]`. Everything else length-shaped (`vh`/`vw`/`vmin`/`vmax`/`cqw`/`cqh`/
  `cqi`/`cqb`/`cqmin`/`cqmax`/`em`/`rem`/`ch`/`ex`, `constants.ts:1-46`) is a
  **length unit**, not a computed unit.
- **Consequence in the path:** `normalizeValueUnits` (`normalize.ts:400-410`)
  routes mixed-unit endpoints through `normalizeNumericUnits`
  (`normalize.ts:217-318`), which calls `convertToPixels(value, unit,
  targets?.[0])` (`normalize.ts:241-245` → value.js `utils.ts:274-355`)
  **once, at compile time**, inside `createInterpVarValue`. The result is a
  fixed `px` `ValueUnit`. `out.computed` is then `false`
  (`normalize.ts:412`), so `prepareInterpVar` wires `iv._lerp =
  lerpNumericValue`. From then on the leaf is a plain number lerp.
- **The isomorphism gap:** `engine.ts:906-920` `setTargets` re-binds targets but
  does **NOT** re-run `parse()`; no `ResizeObserver` exists anywhere in
  `src/animation/`. So `window.innerHeight` (read at `utils.ts:288` for `vh`)
  and `container.clientWidth` (read at `utils.ts:329` for `cqw`, after a
  `findQueryContainer` ancestor walk `utils.ts:238-248`) are **frozen at the
  pixel value they had when `parse()` last ran.** A viewport/container resize
  mid-animation paints stale pixels. Worse, this **diverges from the WAAPI
  path** (see Finding 3): on the compositor the browser resolves `vh`/`cqw`
  live, so the same animation is non-isomorphic across its own two playback
  modes the moment the box changes size.
- **SOTA position:** CSS Values & Units L4 §6 makes `vh`/`vw`/`cqw` *computed-at-
  used-value-time* against the live viewport/container; the spec contract is
  live resolution. The MEMORY note (AnimationVisualizer `calc(100cqw - 100%)`)
  dodges this only because it wraps the unit in `calc()`, which IS treated as
  computed (Finding 2) — i.e. the codebase already half-relies on the live path
  and pays the round-trip for it, while bare `cqw` silently does not.
- **Perf / elegance rationale:** the *current* behaviour is cheap (one number
  lerp, zero per-frame DOM) but wrong-on-resize. Making it correct (re-resolve
  on resize) costs a `ResizeObserver` re-`parse()` — but that is the WRONG
  altitude. The right transposition is Finding 4 (register the property and let
  the browser interpolate length/percentage natively). The honest interim is a
  documented contract: **either** bare viewport/container units are compile-time
  constants (name it, test it) **or** they re-resolve (observe + reparse). Today
  it is undocumented and untested.
- **Disposition:** **FOLD-VALUEJS-HANDOFF** for the unit-classification half
  (whether `vh`/`cqw` should be `computed` so they re-resolve per frame like
  `calc` does — that is a value.js `COMPUTED_UNITS` + `normalizeValueUnits`
  decision) **+ FOLD-E** for the keyframes-side resize contract (document &
  test that bare viewport units are compile-time-frozen unless `setTargets`/
  `parse()` is re-run; or wire a `ResizeObserver` re-parse if live is wanted).
- **Isomorphism note:** changing bare `vh`/`cqw` to live-resolved would change
  pixels on resize (today: frozen). That is a behaviour change — but toward the
  spec and toward WAAPI parity, so "highly befitting." Flag for the owner; do
  not assume.

---

## FINDING 2 — `var` / `calc` pay an unconditional per-frame re-serialization + double Map hash that produces no new information (the REAL D-3 win, withheld correctly, lives in value.js)

This is the lane's headline. D-3 (tranche D, `engine-transposition.md:126-180`)
named this precisely and **withheld it** because the fix is in value.js. It is
still unfixed. Re-confirmed at current HEAD:

- **The hot path:** `lerpComputedValue` (`interpolate.ts:17-40`) runs **every
  frame** for every `var`/`calc` leaf and calls, unconditionally:

  ```
  const newStart = getComputedValue(start, target);   // interpolate.ts:28
  const newStop  = getComputedValue(stop,  target);   // interpolate.ts:29
  ```

- **What each call costs on a CACHE HIT** (the steady state — `start`/`stop` are
  the *same two `ValueUnit`s* for the InterpolatedVar's whole life; only `t`
  moves). `getComputedValue` is `memoize`d (`normalize.ts:136-206`) with
  `keyFn = ` `` `${value.toString()}-${target ? getElementId(target):"null"}` ``
  (`normalize.ts:195-196`). The memoize wrapper (`utils.ts:120-148`) on a hit
  still executes, per call:
  1. `keyFn.apply` → `value.toString()` (`index.ts:64-82`: builds
     `` `calc(${value})` `` / `` `var(${value})` `` — string concat) **plus**
     `getElementId(target)` (`normalize.ts:100-107`: `WeakMap.get` + fallback
     id mint);
  2. `Date.now()` (`utils.ts:125`) — paid on *every* call, hit or miss;
  3. `cache.has(key)` (`utils.ts:127`) — Map hash + probe;
  4. `cache.get(key)` (`utils.ts:128`) — **second** Map hash + probe;
  5. `now - cached.timestamp <= ttl` arithmetic (`utils.ts:129`).
- **Per frame, per computed leaf:** 2 × (one `toString` string-build + one
  `WeakMap.get` + one `Date.now()` + **two** `Map` hash-lookups). None of it
  yields information the previous frame didn't already have. The DOM
  write→read→restore (`normalize.ts:154-168`) is correctly absorbed by the memo
  after frame 0; the residual is **pure key-construction + lookup overhead, paid
  O(frames), to retrieve an O(1)-invariant pair.**
- **The transposition (D-3's, value.js-side):** cache the resolved `(newStart,
  newStop, newUnit)` ON the `InterpolatedVar` at `prepareInterpVar` time
  (`interpolate.ts:143-150` — the dispatch is already pre-resolved there; the
  `InterpolatedVar` shape `units/index.ts:238-267` is the natural home, already
  carries `_lerp`/`colorSpace`/`hueMethod` precomputed fields). The per-frame
  body collapses to:

  ```
  value.value = lerp(cachedStart, cachedStop, t); value.unit = cachedUnit;
  ```

  — identical to `lerpNumericValue` (`interpolate.ts:97-103`). **Zero**
  `toString`, **zero** `Map` lookup, **zero** `Date.now`, **zero** DOM read
  after the resolve. Invalidate the cache on `setTargets` (`engine.ts:906`, the
  one event that changes resolution) and — if live resize is adopted (Finding 1)
  — on a resize signal. This is the same `(InterpolatedVar, target)` granularity
  `getComputedValue`'s memo already uses, lifted up one level so the key is
  never constructed in the hot loop.
- **Quantification (why it's the real win, and why keyframes-local was ~0):**
  the keyframes-local D-3 half (changed-keys diff in the renderer,
  `D.W4.md:92-120`, now `transformTargetsStyle` `utils.ts:305-319`) measured ~0
  because `target.style.setProperty` with an identical string is cheap and the
  browser already no-ops the recalc; the renderer write was never the cost. The
  cost is **upstream of the write** — it's the per-frame *resolution* of the
  endpoints in value.js. For a single `calc()` leaf at 60fps over a 1s
  animation that is ~120 `toString` builds + ~120 `WeakMap.get` + ~120
  `Date.now` + ~240 `Map` lookups, every second, for a value that resolved once.
  Multiply by leaf-count (the cube's matrix3d path has many) and by group child
  count. It is not catastrophic — but it is the textbook "re-derive an invariant
  in the inner loop" that the rest of this engine has surgically eliminated
  everywhere else (zero-alloc group buffer D-1, pre-flattened `allInterpVars`
  `frame-compiler.ts:329`, binary-search seed `engine.ts:561`). This leaf is the
  one place the discipline stops at the value.js boundary.
- **Disposition:** **FOLD-VALUEJS-HANDOFF.** The entire fix surface is value.js:
  `units/interpolate.ts` (`lerpComputedValue` + `prepareInterpVar`),
  `units/normalize.ts` (resolve helper), and the `InterpolatedVar` type
  (`units/index.ts:238`). keyframes consumes it unchanged — `lerpValue` already
  dispatches through `iv._lerp`. **No keyframes edit required.** Propose a
  value.js tranche: "cache resolved computed-unit endpoints on the
  InterpolatedVar; per-frame computed lerp becomes a bare numeric lerp;
  invalidate on target re-bind."
- **Isomorphism note:** pixel-identical (same `getComputedValue` result, just
  cached instead of re-looked-up). The only behaviour change is the
  invalidation contract on `setTargets`, which must mirror today's
  element-id-keyed memo exactly. Strictly a perf transposition.

---

## FINDING 3 — the WAAPI eligibility gate and the engine docs disagree with the code on what "computed unit" means (`vh`/`cqw` are wrongly declared WAAPI-eligible / wrongly documented as blocking)

- **Where:** `waapi.ts:104-124` rejects WAAPI delegation when
  `isComputedUnit(iv.start?.unit) || isComputedUnit(iv.stop?.unit)`.
  `isComputedUnit` is value.js's predicate over `COMPUTED_UNITS = ["var",
  "calc"]` (`normalize.ts:45-49`). So an animation using **bare `vh`/`cqw`**
  passes the gate as **WAAPI-eligible**.
- **The doc/code contradiction:**
  - `src/animation/CLAUDE.md` ("WAAPI Eligibility"): *"no computed units
    (`vh`/`calc`/`var`/`cqw`)"* — claims `vh`/`cqw` block WAAPI.
  - `waapi.ts:27` comment: *"No computed units (`var`, `calc`, `vh`, `cqw`,
    etc.)"* — same claim.
  - `waapi.ts:113` runtime message: *"computed unit (...) requires DOM
    resolution"* — only ever fires for `var`/`calc`.
  - The root `CLAUDE.md` Architecture Notes repeat *"no computed units (`vh`,
    `calc`, `var`)"*.
  The **code** only blocks `var`/`calc`. The **docs** claim it blocks
  `vh`/`cqw`. They contradict.
- **Why it (accidentally) works out today:** because `vh`/`cqw` are baked to
  fixed `px` at compile (Finding 1), by the time WAAPI keyframes are emitted the
  unit is already `px` — so the compositor animates the baked pixel value. The
  result is **internally consistent with the rAF path's stale bake**, but both
  are wrong-on-resize, and the comments describing the gate are false.
- **SOTA position:** WAAPI *can* animate `vh`/`cqw` correctly (the compositor
  resolves them live), so blocking them would be over-conservative; *baking*
  them to px before handing to WAAPI throws away the compositor's live
  resolution. The correct SOTA move is to NOT bake them and let WAAPI carry the
  unit string — see Finding 4.
- **Perf / elegance rationale:** the gate's *intent* (keep DOM-resolution-
  dependent animations on the JS path) is sound for `var`/`calc`; for
  viewport/container units the SOTA answer is the opposite (those are *exactly*
  what the compositor does best). The lie in the comments is a correctness-of-
  documentation defect that will mislead the next editor.
- **Disposition:** **FOLD-E** — fix the three docstrings/messages
  (`waapi.ts:27`, `CLAUDE.md` ×2) to state the truth: only `var`/`calc` block
  WAAPI; `vh`/`cqw` are baked-to-px and pass. (The deeper "don't bake, let WAAPI
  resolve live" is Finding 4, which is partly value.js.)
- **Isomorphism note:** doc-only fix is zero-pixel. The behaviour change (stop
  baking `vh`/`cqw`) is deferred to Finding 4.

---

## FINDING 4 — the SOTA mechanism for interpolating `calc()`/`var()`/length is a registered custom property (`@property`), animated natively — the entire JS DOM round-trip can be transposed onto the platform for DOM targets

- **SOTA cite:** modern-web-guidance `interactive-content-reveal` — *"To enable
  smooth interpolation of [length/percentage] values, you must register the
  variables using `@property`. This informs the browser's engine about the data
  type, allowing it to transition between values."* **Baseline: Registered
  custom properties — Newly available, Baseline since 2024-07-09** (Chrome 85,
  Edge 85, Firefox 128 Jul 2024, Safari 16.4 Mar 2023). Spec: CSS Properties &
  Values API L1 (`@property` / `CSS.registerProperty`), with `syntax:
  "<length-percentage>"` / `"<number>"` / `"<color>"` enabling the browser's
  own interpolator.
- **What keyframes does instead:** hand-rolls the resolution — write inline
  style, `getComputedStyle().getPropertyValue`, parse the matrix, restore
  (`normalize.ts:141-189`), then lerp the numbers in JS each frame. This is a
  faithful, framework-agnostic, **non-DOM-target-capable** implementation (it
  works on plain objects, canvas, Three.js — see `NumericAnimation`), which is a
  genuine strength and must stay as the universal path.
- **The transposition (DOM-target fast lane):** when targets are real
  `HTMLElement`s AND the property is `@property`-registerable (length /
  percentage / number / color / transform-list), the engine could:
  1. `CSS.registerProperty({ name, syntax, inherits, initialValue })` once;
  2. drive a single registered custom property via `Element.animate()` (WAAPI)
     or a `transition`, letting the **browser** interpolate `calc(100cqw -
     100%)` natively on the compositor — live-resolved against the live box,
     zero JS per frame, correct on resize (closes Finding 1 AND Finding 3).
  This is the same family as the existing spring-`linear()`-twin-for-WAAPI move
  the engine already ships (`r-anim-libs.md:15` calls that genuinely SOTA) —
  extend "round-trip the curve onto the compositor" to "round-trip the
  *value-resolution* onto the compositor."
- **Why it's a leverage, not a rewrite:** the eligibility machinery already
  exists (`waapi.ts` computes uniform-timing / no-color / DOM-target). Adding a
  `@property`-registration step gated behind that same eligibility check makes
  the *computed-unit* WAAPI exclusion (`waapi.ts:108`) obsolete for the
  registerable cases — the very units that block WAAPI today become the units
  WAAPI handles best.
- **Perf rationale:** compositor-thread interpolation of a registered length
  property is zero main-thread cost per frame — strictly dominant over even the
  Finding-2-optimized JS lerp, and it eliminates the resize-staleness entirely.
- **Disposition:** **BOOK** (named opportunity, larger than tranche E's
  computed-unit lane and overlapping the scroll/WAAPI lanes —
  `r-anim-libs.md:85` already books the WAAPI-`ScrollTimeline` attach; this is
  the value-resolution sibling). Partly **FOLD-VALUEJS-HANDOFF**: value.js owns
  the `syntax`-string inference (`ValueUnit` superType → `@property` `syntax`
  descriptor) and the `@property`-registerability predicate; keyframes owns the
  WAAPI wiring. Name it so the owner can split it.
- **Isomorphism note:** for registerable DOM targets the pixels become *more*
  correct (live-resolved, resize-tracking) — a befitting change toward spec +
  WAAPI parity. Non-DOM targets keep the JS path verbatim. The fast lane is
  additive and feature-detected (`"registerProperty" in CSS`), so no regression
  for unsupported engines.

---

## FINDING 5 — `getComputedValue`'s `calc()` round-trip mutates shared inline style and reads back synchronously: a forced-reflow + a re-entrancy hazard

- **Where:** `normalize.ts:154-168` — for a `calc()` leaf:
  ```
  style[prop] = `${subProperty}(${value})`;        // :162 write
  getComputedStyle(target).getPropertyValue(prop);  // :164 read  ← forced sync layout
  style[prop] = originalValue;                       // :168 restore
  ```
- **Cost:** the `getComputedStyle().getPropertyValue` immediately after a style
  write forces a **synchronous style+layout flush** (a reflow) on the cold path.
  The memo (Finding 2) means this is paid **once per distinct `calc()` string
  per element** — so in steady state it's amortized to ~0, which is why D-3
  flagged the *key-construction* overhead (Finding 2) as the residual, not this.
  But: (a) first frame of every distinct expression pays a forced reflow; (b)
  multiple animations resolving distinct `calc()`s on the same target in the
  same frame each force their own flush (layout thrash); (c) the write→read→
  restore on a **shared `target.style`** is a re-entrancy hazard if anything
  else reads that element's style between :162 and :168 (it won't within this
  synchronous block, but it couples resolution to mutation of live author
  style).
- **SOTA alternative:** CSS Typed OM (`element.attributeStyleMap` /
  `CSSNumericValue.parse(...).to('px')`) resolves some unit math without an
  inline-style write+restore; and the registered-property path (Finding 4)
  removes the read-back entirely. The current matrix-decode
  (`normalize.ts:170-186` → `unpackMatrixValues`) is a clever recovery of a
  per-axis value from the round-tripped `matrix()` — genuinely needed *because*
  the resolution goes through `transform`; the `@property`-per-axis approach
  (Finding 4) would make each axis its own registered length and skip the matrix
  decode altogether.
- **Perf / elegance rationale:** the round-trip is the most expensive single
  operation in the lane, saved only by the memo. Batching distinct `calc()`
  resolutions for a target into one write/read pass (resolve all, read once)
  would cut cold-path reflows from N to 1 per target per frame. This is a
  value.js `getComputedValue` shape change (resolve a *set* of leaves against a
  target, not one at a time).
- **Disposition:** **FOLD-VALUEJS-HANDOFF** (the round-trip, the batching, the
  Typed-OM alternative all live in value.js `normalize.ts`). Pairs with Finding
  2 in the same value.js tranche.
- **Isomorphism note:** batching / Typed-OM must produce the identical resolved
  px (same browser used-value math). Pixel-identical; perf-only.

---

## FINDING 6 — no test or bench exercises the computed-unit interpolation path in EITHER repo (the win is unguarded)

- **Where:** value.js has **zero** tests referencing `getComputedValue` or
  `lerpComputedValue` (grep `test/` → none). keyframes' `bench/interpolation.bench.ts`
  has no computed-unit case; `frame-compiler.test.ts`/`group.test.ts` reference
  `calc` only incidentally. The D-3 audit (`engine-transposition.md:174-180`)
  specified a `proof:computed-frame` gate (a `toString`/`getComputedStyle`
  call-counter bench asserting O(1)-per-frame) — that gate was **never landed**
  because the transposition was withheld to value.js.
- **Why it matters for this lane:** the FOLD-VALUEJS-HANDOFF (Finding 2) needs a
  falsifiable gate to land safely. Without a call-counter bench, "the per-frame
  cost is gone" is unprovable and the cache-invalidation contract (on
  `setTargets`) is untested — a stale-cache bug would silently paint wrong
  pixels on target re-bind.
- **Disposition:** **FOLD-VALUEJS-HANDOFF** for the value.js-side bench
  (`getComputedValue`/`lerpComputedValue` call-count + resolved-pixel
  correctness, shipped WITH the Finding-2 cache) **+ FOLD-E** for a keyframes
  integration test (a `calc()`/`cqw` animation drives N frames against a live
  jsdom target; assert pixel-identical output before/after the value.js bump,
  and assert re-`setTargets` re-resolves). The keyframes test is the
  isomorphism guard for the dependency upgrade.
- **Isomorphism note:** tests only; they LOCK isomorphism rather than change it.

---

## ALREADY-SOTA (do not manufacture work)

- **Dispatch pre-resolution (`prepareInterpVar`, `interpolate.ts:143-150`).**
  The per-frame `lerpValue` (`interpolate.ts:113-119`) takes a pre-resolved
  `iv._lerp` and skips three sequential type checks. This is the correct
  "resolve dispatch once, not per frame" discipline — the exact pattern Finding
  2 extends to the *endpoints*. The dispatch half is already SOTA; only the
  endpoint half remains. LEAVE.
- **`getComputedValue` memo `shouldCache` on `isConnected`
  (`normalize.ts:200-205`).** Suppressing the cache for disconnected targets
  (layout units resolve to 0 outside the live tree) is exactly right — caching a
  0 would poison later live reads. A subtle correctness guard most hand-rolled
  resolvers miss. LEAVE.
- **`getElementId` via `WeakMap` (`normalize.ts:98-107`).** Stable element ids
  without retaining references that block GC — the correct way to key a memo by
  element identity. LEAVE (the only critique is that it's *invoked* per frame in
  the hot key-build, which Finding 2 removes by caching one level up).
- **Pre-flattened `allInterpVars` (`frame-compiler.ts:329`) + binary-search seed
  (`engine.ts:561`) + zero-alloc `out` buffer (`engine.ts:550-555`).** The frame
  iteration around the computed lerp is already allocation-free and
  O(log n)-seeked. The computed leaf is the *one* residual non-zero-cost step in
  an otherwise surgically optimized loop — which is precisely why isolating it
  (Finding 2) is the clean win. LEAVE.
- **Hue interpolation per CSS Color 4 §12.4 (`interpolate.ts:65-81`).** Out of
  lane but adjacent: cylindrical-space hue uses `interpolateHue` short-way, oklab
  default. Spec-faithful. LEAVE.

---

## Verdict for the lane

The lane's hypothesis is **confirmed and quantified.** D-3's keyframes-local
changed-keys write measuring ~0 was honest — the write was never the cost. **The
real, unrealized win is in value.js**, in two stacked sites:

1. **`lerpComputedValue` / `getComputedValue` (Finding 2)** — per-frame
   re-serialization (`toString`) + double `Map` hash + `Date.now` + `WeakMap.get`
   to retrieve an invariant resolved pair. Fix = cache the resolved endpoints on
   the `InterpolatedVar` at `prepareInterpVar` time; per-frame body collapses to a
   bare `lerp`. **Pure value.js; keyframes consumes unchanged.** This is THE
   FOLD-VALUEJS-HANDOFF.
2. **`COMPUTED_UNITS` classification (Finding 1)** — `vh`/`cqw` baked to px at
   compile, stale on resize, divergent from WAAPI. A value.js unit-set decision
   (do they re-resolve?) + a keyframes resize contract.

Plus a doc-truth fix (Finding 3, FOLD-E), a named platform-leverage opportunity
(Finding 4, BOOK + partial handoff: `@property`-registered native interpolation,
Baseline 2024-07-09), a cold-path reflow/batching opportunity (Finding 5,
handoff), and the missing guard (Finding 6, handoff + FOLD-E test).

**The single highest-value, lowest-risk, isomorphic action is Finding 2** —
proven by D-3's own analysis, withheld only because the surface is value.js. It
is ready to formalize as a value.js tranche.
