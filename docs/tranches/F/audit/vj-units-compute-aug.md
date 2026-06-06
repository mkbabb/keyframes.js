# vj-units-compute-aug — the value.js UNITS + COMPUTED augmentation charter (Tranche F)

**Lane.** `vj-units-compute-aug`. **Scope.** The value.js-side **units + computed**
augmentation hand-off: the computed-unit endpoint cache + batched `getComputedValue`
(the real D-3 win — *no kf edit*), the no-op declared length units (`dvh`/`vi`/`lh`/
`cap` — **HIGH correctness**), the bounded parse/normalize caches (LRU — the
`tryParseCache` + the `memoize` caches), and container-query units. This is **research
+ audit ONLY** — ZERO source edits to keyframes *or* value.js. The only artifact is this
doc.

**inv-16 (hard).** This is a **HAND-OFF, a proposal** the value.js owner sequences,
scopes, accepts, defers, or re-scopes against value.js's own tranche discipline.
keyframes.js **never** writes value.js. value.js is **dirty + active** — branch
`docs/constellation-grand-audit-2026-06-03`, **tranche M open** (post-L). The paired
keyframes-side FOLD work is structurally *free* (the consumption seam is a single
dispatch — §6).

**inv ε.** Every keyframes claim is `file:line` against the live `tranche-e-impl` tree.
Every value.js claim is `file:line` against the live source at
`/Users/mkbabb/Programming/value.js` (branch above, **0.10.0**) — the version kf already
pins (`@mkbabb/value.js ^0.10.0`, installed === HEAD-declared). Every SOTA claim is
grounded (modern-web-guidance baseline-dated, cited inline). The perf re-measures below
are **empirical** (node `process.hrtime`, 5M iters warm) — not asserted.

**Method (what this lane adds over E).** I do NOT re-derive the E hand-off (`docs/
tranches/E/valuejs-sota-handoff.md`, Wave C + C5 + F3) or the E SOTA lane (`audit/sota/
a-kf-computed.md`). I **re-ground them against the live value.js M-tranche tree** (to
confirm nothing moved), **RE-MEASURE the withheld D-3 win empirically** (the number the
E withhold lacked), **correct the unit-count drift** (the hand-off's "24 of 43" — the
live declared-length count is **45**, no-op is still exactly **24**), and **sharpen the
container-query SOTA position** with the fresh Baseline dates. Where the post-E state is
exemplary I say so plainly (§7).

---

## 0. The headline

1. **Nothing on this lane moved in value.js's M-tranche.** M is web-app/CI work
   (sessions, palettes, deploy — `git log` HEAD `62f7e00`); grep over value.js `src/`
   for `dvh`/`svh`/`lvh` in `convertToPixels`, for a resolved-endpoint cache
   (`cachedStart`/`resolvedStart`), and for a `ttl === Infinity` memo fast-path all
   return **0**. **Every item in this charter is still OPEN and correctly withheld.**

2. **The real D-3 win is now empirically sized.** The E withhold named the per-frame
   computed-resolution overhead but left it unmeasured ("the small flatVars dict +
   monomorphic access are unmeasured costs"). Re-measured on the live shape: the
   `getComputedValue` memo **HIT** costs **~95 ns/call** (a `toString()` key-build +
   `Date.now()` + 2× `Map` ops, to retrieve an O(1)-invariant pair). `lerpComputedValue`
   calls it **twice per leaf per frame** = **~190 ns/leaf/frame** of pure
   re-derive-the-invariant overhead. The C1 endpoint-cache collapses this to a bare
   `lerp` = **~1.2 ns** (**>99%** reduction); the cheaper C2/C4 memo-key + Infinity
   fast-path alone gets to **~8.5 ns** (**95%**). **This is no longer a speculative
   withhold — it is a measured 99% per-leaf hot-path cut.** (§2.)

3. **The 24-no-op length units are a *silent wrong-pixel* correctness bug, and the test
   suite cannot catch it.** Of the **45** declared length units (`constants.ts:1-45`:
   7 absolute + 38 relative), `convertToPixels` resolves only `em rem vh vw vmin vmax %
   ch ex` + the six `cq*` (14 relative). The remaining **24** relative units
   (`cap ic lh rlh vb vi` + the 18-member `sv*`/`lv*`/`dv*` family) fall to
   `convertAbsoluteUnitToPixels`, which **returns the raw number unchanged**. `50dvh →
   50px` — worse than a parse failure. value.js's `unit-utils.test.ts` tests
   `convertToPixels` for the **6 absolute units + `px` only** (`:34-67`) — it tests **no
   relative unit at all** (jsdom has no layout), so the no-op is wholly unguarded.
   **HIGH correctness; the cleanest falsifiable gate in the set.** (§3.)

4. **The seam is exemplary — manufacture NO kf work for any of this.** kf's barrel layer
   is *gone* (the live `src/` is `animation/**` + `env.d.ts`); kf reaches the entire
   computed path transitively through **one** call site, `lerpValue(eased, iv)`
   (`engine.ts:629`), where `iv._lerp` dispatches internally. value.js can land C1–C7,
   the LRU, and the unit-coverage fix with **zero** kf edits. (§6, §7.)

---

## 1. The path, re-grounded live (the units + computed inner loop)

**Compile (once, `FrameCompiler.parse(targets)`):**

- `frame-compiler.ts:320` — `values.setTargets(targets)` binds the live DOM to every
  parsed `ValueUnit`. The one DOM input.
- `utils.ts:339` — `prepareInterpVar(normalizeValueUnits(l, r, opts))` per interp leaf.
  `normalizeValueUnits` (value.js `normalize.ts:361-415`) classifies the unit:
  - **mixed length** (`10px ↔ 1em`) → `normalizeNumericUnits` (`normalize.ts:217-318`)
    → `convertToPixels(value, unit, targets?.[0])` **once, at compile** → a fixed `px`
    `ValueUnit`; `out.computed = false` → `lerpNumericValue`.
  - **`var`/`calc`** → `out.computed = isComputedUnit(left.unit) || …`
    (`normalize.ts:412`; `isComputedUnit` ranges over `COMPUTED_UNITS = ["var","calc"]`,
    `constants.ts:54`) → `lerpComputedValue`.

**Runtime (every frame), `engine.ts:629`:** `lerpValue(eased, iv)` → `iv._lerp`
(`interpolate.ts:113-119`). Three dispatch targets:

| `iv._lerp` | units served | per-frame work |
|---|---|---|
| `lerpNumericValue` (`interpolate.ts:97-103`) | px, %, deg, **+ baked `vh`/`cqw`/`em`** | one `lerp` — zero DOM, zero alloc |
| `lerpColorValue` | `unit === "color"` | per-channel (out of this lane) |
| `lerpComputedValue` (`interpolate.ts:17-40`) | **`var`/`calc` only** | **2× `getComputedValue` per leaf per frame** |

**The lane's whole cost reduces to two facts: (a) the `lerpComputedValue` memo HIT
overhead (§2); (b) the `convertToPixels` coverage hole that silently mis-resolves
24 units at compile (§3).** Everything else is correctness/robustness tail (§4, §5).

---

## 2. FINDING C1/C2/C4 — the per-frame computed-resolution overhead (the REAL D-3 win, NOW MEASURED)

**Disposition: value.js-HANDOFF (C1 endpoint cache — the headline) + value.js-HANDOFF
(C2 stable-key / C4 Infinity-ttl — the cheap consolation if C1 is deferred).**

### The hot path, re-grounded live

`lerpComputedValue` runs **every frame** for every `var`/`calc` leaf and calls,
unconditionally (`interpolate.ts:28-29`):

```
const newStart = getComputedValue(start, target);
const newStop  = getComputedValue(stop,  target);
```

`getComputedValue` is `memoize`d (`normalize.ts:136-206`) with
`keyFn = `​`${value.toString()}-${target ? getElementId(target):"null"}`​` (`:195-196`).
On a **HIT** (the steady state — `start`/`stop` are the *same two `ValueUnit`s* for the
`InterpolatedVar`'s whole life; only `t` moves), the `memoize` wrapper
(`utils.ts:120-148`) still executes, per call:

1. `keyFn` → `value.toString()` (`index.ts:64-82`: builds `` `calc(${value})` `` /
   `` `var(${value})` `` — a string concat) **plus** `getElementId` (`normalize.ts:100-107`:
   a `WeakMap.get`);
2. `Date.now()` (`utils.ts:125`) — **paid on every call, hit or miss**, even though
   `getComputedValue`'s memo sets **no `ttl`** so `ttl === Infinity` (`utils.ts:114`
   default) and the clock read is **dead** (`now - ts <= Infinity` is always true);
3. `cache.has(key)` (`utils.ts:127`) — a `Map` hash + probe;
4. `cache.get(key)` (`utils.ts:128`) — a **second** `Map` hash + probe.

None of it yields information the previous frame didn't have.

### The empirical re-measure (the number the E withhold lacked)

Modelling the live steady-state shape (a `calc(100cqw - 100%)` leaf, the AnimationVisualizer
pattern from MEMORY.md), node `process.hrtime`, 5M iters warm:

| variant | ns/memo-HIT | ns/leaf/frame (2× start+stop) |
|---|---|---|
| **current** (`toString` key + `Date.now()` + 2× `Map`) | **95.1** | **190.3** |
| **C2+C4** (precomputed stable-id key, no `Date.now()`) | 4.2 | 8.5 (**−95%**) |
| **C1** (endpoint cached on `InterpolatedVar`, NO memo call) | — | 1.2 (**−99.3%**) |

The DOM write→read→restore (`normalize.ts:154-168`) is correctly absorbed by the memo
after frame 0 — the residual ~190 ns/leaf/frame is **pure key-construction + lookup
overhead, paid O(frames), to retrieve an O(1)-invariant pair.** For the cube's
matrix3d-decomposed path (many computed leaves) × group child count, at 60fps, this is
the one place this otherwise-surgical engine re-derives an invariant in the inner loop.

### The transposition

- **C1 (the win):** cache the resolved `(newStart, newStop, newUnit)` ON the
  `InterpolatedVar` at `prepareInterpVar` time (`interpolate.ts:143-150` already
  pre-resolves the dispatch there; the `InterpolatedVar` shape `index.ts:238-267`
  already carries `_lerp`/`colorSpace`/`hueMethod` precomputed fields — the natural
  home). Per-frame `lerpComputedValue` collapses to the same body as `lerpNumericValue`:
  `value.value = lerp(cachedStart, cachedStop, t); value.unit = cachedUnit`. Invalidate
  on `setTargets` (the one event that changes resolution) and — if live resize is adopted
  (§4) — on a resize signal.
- **C2 (the fallback for the unprepared/external path):** key the memo on a per-`ValueUnit`
  monotonic id (or a `WeakMap`-keyed cache) so a HIT pays **0** `toString()`. This serves
  the external caller that constructs an `InterpolatedVar` without `prepareInterpVar`.
- **C4 (free, bundle with C2):** a `ttl === Infinity` fast-path in `memoize`
  (`utils.ts:125`) elides the `Date.now()` read on every hit when no TTL is set — the
  `getComputedValue` case. One branch; identical behavior.

**Isomorphism:** pixel-identical — same resolved values, cached/cheaper-keyed instead of
re-looked-up. The only behavior change is the invalidation contract on `setTargets`,
which must mirror today's element-id-keyed memo exactly. Strictly a perf transposition.

**Falsifiable gate (`proof:computed-frame`):** a `toString`/`getComputedStyle`
**call-counter** bench asserting **O(1)-per-frame** (the resolve is paid once at prepare,
not per tick) + a wall-time delta; a `setTargets` re-resolve test for the invalidation.
This gate is **named but unlanded in BOTH repos** — value.js has **zero** tests touching
`getComputedValue`/`lerpComputedValue` (grep `test/` → the only computed-adjacent test,
`units-interpolate.test.ts:253-308`, asserts the `computed` *flag* but never drives
`lerpComputedValue`). The bench ships WITH the C1 cache (it is its isomorphism guard).

**Diff vs E:** the E `a-kf-computed.md` Finding 2 named C1 and withheld it as "the real
D-3 win, value.js-owned" but gave no number. **F sizes it: ~190 ns/leaf/frame → ~1.2 ns
(−99.3%), measured.** No longer a speculative withhold — a measured, isomorphic, single-
file (`interpolate.ts` + the `InterpolatedVar` field) cut, ready to formalize.

---

## 3. FINDING C5 — the 24 no-op length units (`dvh`/`svh`/`lvh`/`vi`/`vb`/`lh`/`cap`…) — HIGH correctness

**Disposition: value.js-HANDOFF (standalone correctness fix — can LEAD Wave C).**

### The bug, re-grounded live (and the count corrected)

`convertToPixels` (`utils.ts:274-355`) resolves exactly: `em` (`:283`), `rem` (`:285`),
`vh` (`:287`), `vw` (`:289`), `vmin` (`:291`), `vmax` (`:293`), `%` (`:295`), `ch`
(`:300`), `ex` (`:319`), and the six `cq*` (`:323-348`) — **14 relative units**.
**Everything else falls to the `else` at `:350-351`** → `convertAbsoluteUnitToPixels`
(`:255-272`), which converts the **6 absolute** relative-to-px units (`cm mm Q in pt pc`)
and `return pixels` = **the raw value unchanged** for any other unit (`:271`).

Live unit declarations (`constants.ts:1-45`): **7 absolute + 38 relative = 45 declared
length units** (the hand-off's "43" is stale — the live `RELATIVE_LENGTH_UNITS` has 38
entries, verified by parse). Of the 38 relative, 14 are handled, so **exactly 24 are
no-op:**

| family | units | spec resolution | Baseline |
|---|---|---|---|
| writing-mode viewport | `vi`, `vb` | inline/block of `vw`/`vh` (the code *already* computes `isVerticalWritingMode` for `cqi`/`cqb`, `:331`) | with `vh`/`vw` |
| small viewport | `svw svh svi svb svmin svmax` | `vw`/`vh` math against the **small** viewport (`visualViewport`) | **2022-12-05** ✓ |
| large viewport | `lvw lvh lvi lvb lvmin lvmax` | against the **large** viewport (`innerWidth`/`innerHeight`) | **2022-12-05** ✓ |
| dynamic viewport | `dvw dvh dvi dvb dvmin dvmax` | against the **dynamic** viewport (live `innerWidth`/`innerHeight`) | **2022-12-05** ✓ |
| font metrics | `cap`, `ic`, `lh`, `rlh` | cap-height / ideographic-advance / line-height / root-line-height metric reads | — |

(Baseline: modern-web-guidance `css-layout` §7 — *"Small, large, and dynamic viewport
units: Widely available, Baseline since 2022-12-05."* All 18 `sv*`/`lv*`/`dv*` are 3+
years past Baseline.)

`50dvh` → falls through → `return 50` → emitted as `50px`. **Silent wrong pixels** — the
animation runs, paints the wrong size, throws nothing.

### The fix — the *fill-the-`cq*`-pattern* path

`dv*`/`lv*` are `vw`/`vh` math against `innerWidth`/`innerHeight` (the `lv*`/`dv*` split
matters only when the browser-chrome insets differ; the conservative resolution maps both
to the same `innerWidth`/`innerHeight` value the engine already reads at `:287-289`).
`sv*` uses `visualViewport.width`/`.height`. `vi`/`vb` are a writing-mode selection over
`vw`/`vh` — the exact pattern `:331-342` already runs for `cqi`/`cqb`. `lh`/`rlh`/`cap`/
`ic` are metric reads (`lh` = `parseFloat(getComputedStyle(el).lineHeight)`; `rlh` against
`documentElement`; `cap`/`ic` are font-metric approximations like the existing `ex`/`ch`
canvas reads at `:300-321`). **Add a fail-loud branch** for any unrecognized *relative*
unit so the next added unit cannot silently no-op (today the `else` swallows it).

**Falsifiable gate (the cleanest in the set):** a **full 38-relative-unit
endpoint-resolution test** — any relative unit that `convertToPixels` returns *unchanged*
(value-equal to input for a non-1 viewport) is a bug. Must run in a layout-bearing env
(Playwright / a stubbed `window`/`visualViewport`/`getComputedStyle`), since jsdom's
`innerHeight` is 768 but `visualViewport`/`lineHeight` need stubbing — which is *why*
the current jsdom suite tests only the 6 absolute units and the hole survives.

**Isomorphism:** fixes *wrong pixels* (`50dvh` is `50px` today). A befitting correctness
change toward the spec. The kf rAF resolver is the only consumer — WAAPI **excludes** the
whole viewport family (kf `waapi.ts:33-38` enumerates `dvh`/`svh`/`lvh`/`vi`/`vb`/… into
`WAAPI_INELIGIBLE_UNITS`), so a `50dvh` `@keyframes` *always* takes the rAF path and
*always* mis-resolves today. **kf has no workaround — it depends entirely on this fix.**

**Diff vs E:** the E hand-off C5 said "24 of 43"; F corrects the live count to **24 of
45** and re-confirms the no-op *and the test blindness* against live source.

---

## 4. FINDING C6 — bare viewport/container units bake-to-px at compile, stale on resize (the classification decision)

**Disposition: value.js-HANDOFF (the `COMPUTED_UNITS` classification — owner decides) +
the paired kf resize contract is FOLD-E (structurally a doc/test, not code today).**

`COMPUTED_UNITS = ["var","calc"]` (`constants.ts:54`). Everything else length-shaped —
`vh`/`vw`/`vmin`/`vmax`/`cqw`/`cqh`/`cqi`/`cqb`/`em`/`rem`/`ch`/`ex` and (post-C5)
`dvh`/`svh`/etc. — is a *length* unit, so `normalizeValueUnits` routes it through
`normalizeNumericUnits` → `convertToPixels` **once at compile** (`normalize.ts:241-245`);
`out.computed` is `false`; `prepareInterpVar` wires `lerpNumericValue`. From then on it is
a frozen-px number lerp.

**The gap:** kf's `setTargets` re-binds + re-`parse()`s (`engine.ts:974-982,1028`) but
there is **no `ResizeObserver` anywhere in `src/animation/`** (grep confirms). So
`window.innerHeight` (read at `utils.ts:288`) and `container.clientWidth` (read at
`:329`) are frozen at the value they had when `parse()` last ran — a viewport/container
resize mid-animation paints stale pixels. This *also* diverges from the WAAPI path: the
compositor resolves these live, so the same animation is non-isomorphic across its own
two playback modes the moment the box resizes (kf `waapi.ts:11-17` documents this
divergence honestly but does not resolve it).

**The owner decision (value.js-side):** should bare `vh`/`cqw`/`dvh` be classified
`computed` (re-resolve per frame like `calc`) or remain compile-frozen? Today it is
**undocumented and untested** — neither contract is named. The SOTA answer (§5) makes
this moot for DOM targets (`@property`-register and let the browser interpolate
length/percentage natively, live-resolved on the compositor) — so the conservative move
is: **value.js names the bare-viewport-unit contract (frozen-at-compile, tested) and the
`@property` path supersedes it for registerable DOM targets**, rather than wiring a
per-frame re-resolve that the platform does better.

**Isomorphism:** classifying bare viewport units `computed` would change pixels on resize
(toward spec + WAAPI parity) — a behavior change; **flag for the owner, do not assume.**
The conservative "name it frozen + test it" path is zero-pixel.

**Diff vs E:** unchanged from `a-kf-computed.md` Finding 1 — F re-confirms no
`ResizeObserver` exists post-E and re-states the owner decision is still open.

---

## 5. FINDING C3/C7 + the platform supersession (cold-path reflow, eviction, `@property`)

### C3 — batched resolve (cold-path reflow)

The cold path (`normalize.ts:162-168`) writes inline style, then
`getComputedStyle().getPropertyValue` — a **forced synchronous layout flush** — then
restores. The memo (C1/C2) absorbs this after frame 0, so steady-state cost is ~0; but
(a) the **first** frame of every distinct `calc()` string pays a forced reflow; (b)
multiple animations resolving distinct `calc()`s on the same target in the same frame
each force their own flush (**layout thrash**). **C3:** a `getComputedValue` entry that
resolves a *set* of leaves against a target in one write→read pass, cutting cold-path
reflows from N-per-target to 1. **Isomorphism:** pixel-identical (same used-value math,
batched). **Disposition: value.js-HANDOFF** (pairs with C1 in the same tranche).

### C7 — memo eviction + resize-invalidation

`getComputedValue`'s memo is **unbounded** (`memoize` default `maxCacheSize = Infinity`,
`utils.ts:114`) and **never busted on resize** — a `100vh`/`calc(100cqw…)` animation
caches its frame-0 px and serves it for the page's life, so a resized page paints
pre-resize pixels forever (the same staleness as C6, now *cached*). **C7:** bound the
memo + scope it to a **layout epoch** (a generation counter bumped on `ResizeObserver`/
`resize`); a resize busts the relevant entries. **Isomorphism:** more correct on resize,
stable otherwise. **Disposition: value.js-HANDOFF.** (Note the existing `shouldCache` on
`isConnected`, `:200-205`, is correct and stays — §7.)

### The platform supersession (the SOTA frame for C1/C3/C6 on DOM targets)

The SOTA mechanism for interpolating `calc()`/`var()`/length is a **registered custom
property** (`@property` / `CSS.registerProperty`), animated natively — the browser's own
interpolator runs on the compositor, live-resolved, zero JS per frame, correct on resize.
kf E.W9 **already landed** the `@property` registration (`engine.ts:1132-1147`,
feature-detected, Baseline 2024-07-09) and value.js **already preserves the lossless
`syntax` string** (`stylesheet.ts:386`, raw-with-quotes-stripped — verified by the
`a-vj-consumption-F` sibling lane). So the platform path that *obviates* the JS
computed-resolution round-trip for registerable DOM targets is **mostly built**; the
residual is the eligibility wiring (kf-owned) + the `ValueUnit superType → @property
syntax` inference (value.js could expose, but kf already feeds `descriptor.syntax`
verbatim). **Disposition: BOOK** (the platform supersession is larger than this lane and
overlaps the WAAPI/scroll lanes) — but it reframes C1/C3/C6: **they are the JS-path
correctness floor for non-DOM targets and unsupported engines; the DOM-target fast lane
is the `@property` path, already feature-detected.** C1 is still worth landing (it serves
plain-object / canvas / Three.js targets that have no `@property` path at all).

---

## 6. FINDING F3 — bounded LRU on the parse/normalize memo caches (the unbounded-memory hazard)

**Disposition: value.js-HANDOFF (the single most-named item across the E lanes; cheap +
isomorphic).**

`memoize` (`utils.ts:108-153`) defaults `maxCacheSize = Infinity` (`:114`), and when a
cap *is* set, eviction is **FIFO not LRU**: `cache.keys().next().value` (`:142`) is the
oldest-*inserted* key, evicted regardless of recency. Two consequences:

1. **Unbounded growth** for the editor per-keystroke path — every distinct generated CSS
   string is a new parse cache key that is never evicted (a real memory hazard for a
   long-lived editor session; the kf demo's live editor is exactly this consumer).
2. **The `tryParseCache` withhold (E.W5) re-grounded:** the E close recorded
   `tryParseCache` eviction as "recorded-withheld — a small working set; an LRU would be
   speculative complexity." That withhold is **honest for the demo's bounded preset set**,
   but the *general* `memoize` consumer (per-keystroke editor CSS, programmatically
   generated animations) has an **unbounded** working set. **F's re-measure: the withhold
   holds for the demo, but the value.js `memoize` primitive itself should carry a bounded
   LRU** so the unbounded consumer is safe by construction — this is a value.js-primitive
   fix, not a kf-demo one, so it does not contradict E's demo-scoped withhold.

**The fix:** a generous default cap (e.g. 1024) + FIFO→true-LRU on hit (`delete`+`set` so
a touched key moves to the tail). Bundle the C4 `ttl === Infinity` fast-path here (same
`memoize` function). **Isomorphism:** HITs byte-identical; only cold-eviction timing
changes. **Falsifiable gate:** a long-running parse-many-distinct-strings test asserts
`cache.size <= cap` and that a recently-touched key survives a flood (the LRU property
FIFO fails). **Diff vs E:** F re-scopes the `tryParseCache` withhold from "speculative"
to "the *primitive* needs the bound; the *demo working set* does not" — the bound lives
in value.js `memoize`, so it is a hand-off, and E's demo withhold stays correct.

---

## 7. ALREADY-SOTA on this lane — manufacture NO work

Stated plainly, per the §Mandate's KISS clause:

- **The consumption seam is exemplary and barrel-free.** kf reaches the entire computed
  path through **one** dispatch site (`lerpValue(eased, iv)`, `engine.ts:629`; `iv._lerp`
  internal). value.js can land C1–C7 + the LRU + the unit fix with **zero** kf edits.
  This is the structural reason "kf consumes it unchanged" is *forced*, not hopeful
  (re-confirmed by `a-vj-consumption-F` — the `src/` barrels are *gone*; kf wraps no
  normalize surface). **No kf-side work to propose.**
- **The dispatch pre-resolution** (`prepareInterpVar`, `interpolate.ts:143-150`) is the
  correct "resolve dispatch once, not per frame" discipline — C1 *extends* exactly this
  pattern to the *endpoints*. The dispatch half is SOTA; only the endpoint half remains.
- **`getComputedValue`'s `shouldCache` on `isConnected`** (`normalize.ts:200-205`):
  suppressing the cache for disconnected targets (layout units resolve to 0 outside the
  live tree) is a subtle correctness guard most hand-rolled resolvers miss. LEAVE.
- **`getElementId` via `WeakMap`** (`normalize.ts:98-107`): stable element ids without
  retaining GC-blocking references — the correct way to key a memo by element identity.
  LEAVE (the only critique is that it is *invoked* in the per-frame key-build, which C1
  removes by caching one level up).
- **DOM-correct, writing-mode-aware container-unit resolution** (`utils.ts:323-349`):
  `cqi`/`cqb` correctly select inline/block via `isVerticalWritingMode` on the
  `findQueryContainer` ancestor (`:238-253`). Container queries are **Baseline 2023-02-14**
  (modern-web-guidance `css-layout` §4) and value.js's `cq*` resolution is spec-faithful.
  **Only the `sv*`/`lv*`/`dv*` *sibling* units (C5) and `vi`/`vb` are missing** — the
  `cq*` path is the template C5 fills. LEAVE the `cq*` path; fill its siblings.
- **The `_lerp` monomorphic dispatch + the absolute-unit conversions** (`convertToPixels`
  `cm`/`mm`/`Q`/`in`/`pt`/`pc`, the angle/time/resolution converters) are correct and
  tested (`unit-utils.test.ts`). LEAVE.

---

## 8. The proposed value.js units+computed sub-tranche (sequencing)

Ordered by leverage × isomorphism-safety. Each is an owner-discretionary unit.

```
C5 (24-of-45 no-op length units) ──── standalone correctness, HIGH, can LEAD ── FIRST
   └─ the cleanest falsifiable gate: any relative unit returning value unchanged is a bug
   └─ kf has NO workaround — its rAF resolver mis-resolves 50dvh today

C1 (endpoint cache on InterpolatedVar) ── the measured D-3 win, −99.3%/leaf/frame ── HIGH
   └─ ships WITH proof:computed-frame (call-counter + setTargets-reresolve)
   └─ C2 (stable-id key) + C4 (ttl===Infinity fast-path) are the cheaper fallback (−95%)

C3 (batched resolve) ─── cold-path reflow N→1 ── MED (bundle with C1)
C7 (memo eviction + layout-epoch invalidation) ── resize correctness ── MED (bundle C1)

F3 (bounded LRU on memoize) ── unbounded-memory hazard, single most-named ── MED, cheap+iso
   └─ the value.js primitive carries the bound; E's demo tryParseCache withhold stays correct

C6 (bare-viewport classification) ── OWNER DECISION (frozen vs re-resolve) ── flag, name+test
   └─ superseded for DOM targets by the @property path (kf E.W9, already built) — BOOK
```

**Every item is measure-first.** C1's win (§2) is **invisible to allocation-dominated
microbenchmarks** — it surfaces only under long-running, buffer-reusing playback, which
is why `proof:computed-frame` is a *call-counter*, not a wall-clock-only, bench. C5's gate
is structural (returns-unchanged = bug). F3's gate is a flood test. The honest residue:
the win is real and measured, but unguarded in both repos today — the gates ship with the
fixes.

---

## inv-16 compliance

This lane wrote ONLY `docs/tranches/F/audit/vj-units-compute-aug.md`. It made **ZERO**
source edits to keyframes or value.js. Every value.js item above is a *proposal* the
value.js owner sequences against value.js's own tranche discipline; value.js is dirty +
active (tranche M open) and this lane does not touch it. The paired keyframes-side FOLD
work is structurally free (the single `lerpValue` dispatch seam) or already landed (the
`@property` registration, the WAAPI viewport-unit block). Every keyframes claim is
`file:line` against `tranche-e-impl`; every value.js claim against the live 0.10.0 source;
every perf number is an empirical `process.hrtime` re-measure; every SOTA/Baseline claim
is modern-web-guidance-grounded and dated.
