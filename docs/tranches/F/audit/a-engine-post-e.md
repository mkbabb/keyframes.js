# Tranche F audit — `a-engine-post-e`

**Lane.** The IMPLEMENTED engine after D+E (`src/animation/**`). Residual gaps,
quality, and SOTA-conformance of the *post-E* tree — NOT a re-run of the E
findings. Where E already closed an item I cite + diff it and move on; where E
recorded a measure-first WITHHOLD I re-measure it for F with a bench plan; where
the post-E state is exemplary I say so plainly and manufacture no work.

**Method.** Live code `file:line` on `tranche-e-impl` (the working branch — the
brief's `tranche-d-impl`/`914L` figures are stale; the engine grew through E.W7–W11
and the orchestration tier). SOTA grounded against `modern-web-guidance@latest`
(WAAPI/scroll/INP guides) + 2026 web research (Motion/GSAP frontier, WAAPI
`commitStyles` caveats, the rAF↔microtask cost model). value.js items are
HANDOFF-only (inv-16) — proposed, never written.

**Disposition legend.** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## 0. Headline

The engine is **further along than the brief assumes**. Of the E "Strand-B /
W8 WITHHOLDS" the brief names, the structural ones LANDED and only one true
micro-perf item remains genuinely open:

| Brief item (as withheld at E-close) | Post-E live status | F disposition |
|---|---|---|
| per-frame DOM write-skip (E-RT-3) | **WITHHELD — measured ~0 keyframes-side win** (`d3-changed-keys.measure.test.ts`) | RECORD + value.js-HANDOFF (the real cost is value.js-owned) |
| async fast path in `playback.ts` (E-RT-2) | **STILL OPEN** — `_run` wraps every frame in `Promise.resolve().then`; `advanceTo`/`_frame` still `async` | **MEASURE-FIRST** (the one live engine micro-perf fold) |
| delete-loop → stable-key (`interpFrames` dict-mode) | **OPEN** (paired with E-RT-2's buffer) | MEASURE-FIRST (same bench) |
| preset memo | n/a to engine hot path | RECORD |
| standalone zero-alloc (E-RT-1) | **LANDED** — `_interpOut` buffer + `processFrame` method (`engine.ts:161,539,747`) | ALREADY-SOTA (diff only) |
| WAAPI commit-on-finish (r-waapi W1) | **LANDED** (`waapi.ts:331-354`) | ALREADY-SOTA + one BOOK caveat |
| native-scroll bridge | **LANDED** (`waapi.ts:396`, `timeline.ts:228`) | ALREADY-SOTA + one BOOK |
| `@property` registration | **LANDED** (`engine.ts:1108,1125`) | ALREADY-SOTA |
| FC-1 colorSpace compile-staleness | **LANDED** — `renormalizeColors()` (`frame-compiler.ts:387`) | ALREADY-SOTA |

So F's engine band is **thin and honest**: one live MEASURE-FIRST micro-perf
fold (E-RT-2, re-confirmed open), two production-readiness BOOK caveats on the
newly-landed WAAPI/native surfaces, one DX gap (`.finished`), the still-excluded
WAAPI-color lift (value.js-gated), and B1 (`tryParseCache`) re-confirmed
recorded-withheld. **The hot path, the steppers, the compositor, and the
orchestration tier are SOTA — leave them alone.**

---

## F-ENG-1 — E-RT-2 re-confirmed OPEN: per-frame promise + microtask churn — MEASURE-FIRST

**Cite.** `playback.ts:96-111` (`_run`), `engine.ts:692` (`advanceTo`, `async`),
`engine.ts:721` (`_frame`, `async`), `group.ts:360,392-404` (`advanceTo` /
`_advanceSlice` `Promise.all`).

The E `a-kf-runtime` lane named this E-RT-2 (FOLD-E, measure-first, "highest-care
finding in the lane"); E landed E-RT-1 (the standalone buffer) and E-RT-3's
measurement but **did NOT land E-RT-2**. The live `_run` is unchanged:

```ts
// playback.ts:99-108
const frame = (now: number): void => {
    void Promise.resolve(step(now)).then((cont) => {
        if (gen !== this._gen) return;
        if (cont) this._rafId = requestAnimationFrame(frame);
        else this._cleanup();
    });
};
```

Every frame, for **every** loop shape — `play` / `drive` / `loop` — allocates a
promise + schedules a microtask hop, even when `step` is synchronous. `drive`
(playback.ts:168) steps `SmoothProgress`/`SpringProgress` `tickDt` which is a
**plain synchronous boolean-returning stepper** — it pays a promise + microtask
turn it never needs. On the `Animation` path it compounds: `_frame` is `async`,
`await`s `advanceTo` which is `async`, and on the steady-state interior frame
(not first, not last) nothing is actually awaited (`onStart`/`onEnd`/`sleep` are
boundary-only) — yet two `async` functions allocate a promise each + the `await`
inserts a microtask turn. In a group of N children this is ~2N promises/frame on
top of `_advanceSlice`'s per-slice `Promise.all` array (`group.ts:403`).

**SOTA grounding (2026).** The browser drains all microtasks before running the
next rAF callback, and microtask work can block paint; rAF-aligned synchronous
work is the smoother path ([DebugBear], [whatwg/html#2637 — Gecko/Blink diverge
on the rAF↔microtask flush ordering]). At 120 Hz (now common — [GSAP ticker
docs note 120 Hz devices]) the per-frame budget halves to ~8.3 ms, so a
fixed-count per-frame microtask tax is felt 2× harder. GSAP/Motion both run a
**synchronous** per-frame stepper for exactly this reason; the async chain here
is an artifact of the lifecycle awaits leaking into the steady-state frame, not
a deliberate design.

**The transposition (two isomorphic seams, unchanged from E-RT-2).**
(a) `_run` fast path: when `step(now)` returns a boolean (not a thenable),
reschedule synchronously — `typeof result?.then === "function"` picks the path,
so `drive` (synchronous steppers) stops paying for asynchrony it doesn't use,
and the `Animation`/group draw frame keeps the async branch only while it
genuinely awaits. (b) Split the steady-state advance from the boundary frames:
hoist the one-time `onStart` (delay/dispatch) out of the per-frame path (as
`RAFPlayback.play` already does for its duration loop) so the interior `_frame`
is a synchronous function returning a boolean; `onEnd` mutates flags + dispatches
an event — neither needs an `await`.

**Why MEASURE-FIRST, not SHIP.** This is the §Mandate-correct posture E itself
took: the win is real but the boundary awaits carry genuine semantics
(delay gating, the awaited `onEnd`-before-`_resolvePlay`, the WAAPI shadow tick's
awaited `playWAAPI`) that the transposition must preserve exactly. **It does NOT
ship on assertion.** A re-runnable bench gates it:
- a per-frame promise-allocation counter (monkeypatch `Promise.resolve` or a
  `--expose-gc` heap-delta probe) over a 600-frame steady window, asserting the
  count drops from O(frames) → O(1) on the `drive` path and from ~2/frame → 0 on
  the `Animation` interior frame;
- a wall-time delta over a 50-child group (where 2N promises/frame is largest);
- an event-ordering lock (`animationstart`/`animationiteration`/`animationend`
  + the play-promise resolve point are byte-unchanged) as the isomorphism guard.

Land ONLY on a demonstrated win; else record-withhold with the measurement, the
honest D-3/E.W5 close. **`proof:standalone-zero-alloc` already proves the buffer
half; this bench (`proof:sync-step`) is its loop-core sibling.**

**Disposition: MEASURE-FIRST (the one live engine micro-perf fold F owns).**
Pure `playback.ts` + `engine.ts`/`group.ts`. Pixel/event-identical.

---

## F-ENG-2 — E-RT-3 re-measured: the keyframes-side write-skip is genuinely ~0; the cost is value.js — RECORD + value.js-HANDOFF

**Cite.** `utils.ts:363-377` (`transformTargetsStyle` — unchanged from E:
`unflattenObjectToString(vars)` then unconditional `setProperty` per key per
target per frame), the measure artifact `test/d3-changed-keys.measure.test.ts`.

E's measure-first instrument (which LANDED) settles this: on a representative
mixed animation the unchanged-key fraction during interpolation is **< 50%** and
in practice ~0 — every *interpolating* key changes every interior frame, so a
diff-and-skip `setProperty` cache saves nothing on the hot path (only a
genuinely-held constant is skippable). **F must NOT re-open the diff-and-skip
cache** — it is correctly killed by measurement.

But the test measures *cache-skippable writes only*. The actual per-frame garbage
is the **`unflattenObjectToString` allocation** (a fresh result object + per-key
`+=` string builds + `Object.entries` array, every frame, every target) — and
that is **value.js-owned**, out of inv-16 scope. So the residual is real but
hands off:

> **value.js-HANDOFF VJS-2 (re-confirmed from E).** A buffer-reusing
> `unflattenObjectToString` variant (write into a caller-supplied map, cleared
> in place) so the per-frame paint serialization is allocation-free — the same
> hoist-and-clear idiom the group compositor uses. keyframes cannot fix this
> from its side without reaching into value.js. **Augment the existing
> `valuejs-sota-handoff.md` VJS-2 row; do not write it.**

**Disposition: RECORD (keyframes-side write-skip KILLED by measurement) +
value.js-HANDOFF (VJS-2, the serialization garbage).**

---

## F-ENG-3 — WAAPI commit-on-finish landed; one production-readiness caveat — BOOK

**Cite.** `waapi.ts:329-363` (`playWAAPI` finish path), `engine.ts:786-807`
(`_playWAAPI` / `_cancelWAAPI`).

The r-waapi W1 leak the E scorecard flagged as "the rare gap that is a *bug*" is
**FIXED and well-built**: on genuine `wa.finished`, the code commits inline only
when `restPosition === "final"` (the forwards/both fill — the right gate),
feature-detects `commitStyles`, then `cancel()`s — converging to the rAF path's
terminal state (rest frame inline, zero residual compositor animations). The
`stop()`/`reset()` cancel path correctly routes through the `catch` (AbortError =
deliberate halt). This is **ALREADY-SOTA** and matches MDN's recommended
"commit on `finished`, then the styles can be modified as normal" guidance.

**The residual production-readiness caveat (BOOK, not a fold).** 2026 research
surfaces a subtle `commitStyles()`→`cancel()` interaction the live code does not
guard: per [csswg-drafts#11084], **a `cancel()` immediately after `commitStyles()`
can fire a CSS `transition` on the target** if (a) the committed inline value
differs from the element's pre-animation *computed* style and (b) the consumer
has a `transition` declared on the animated property. The cancel re-resolves the
before-change style and the UA can observe a change → trigger a transition — a
visible flash on completion the rAF path never produces. This is browser- and
consumer-CSS-dependent (it only bites elements the consumer also styles with
`transition`), so it is **not always wrong** and not worth speculative machinery.

- **BOOK** the caveat in `waapi.ts` (a comment at the commit site naming the
  csswg#11084 interaction + the condition), so a future maintainer / consumer
  knows the one residual non-isomorphism. If a real consumer reports the flash,
  the fix is bounded (a `transition: none` shim across the commit→cancel pair, or
  prefer `removeProperty`-after-rAF over commit when the target carries a
  transition) — **but only on a reproduction; not pre-emptively** (KISS).

**Disposition: ALREADY-SOTA (the leak fix) + BOOK (the commit→cancel transition
caveat — document, fix only on a reproduction).**

---

## F-ENG-4 — native-scroll bridge landed; the smoothing-divergence caveat is documented but un-gated — BOOK

**Cite.** `waapi.ts:366-429` (`attachNativeScrollTimeline`), `timeline.ts:199-259`
(`NativeTimelineSpec` / `createNativeTimeline`).

The additive native `ScrollTimeline`/`ViewTimeline` WAAPI bridge LANDED and is
**production-clean**: it reuses the one eligibility gate, feature-detects
(`globalThis.ScrollTimeline`/`ViewTimeline`, returns `null` → caller keeps the JS
sampler), correctly qualifies `globalThis.` to dodge the local-class foot-gun,
and the ARCH-kill ("native NEVER replaces the JS sampler") holds. **ALREADY-SOTA.**

**The residual (BOOK).** The doc-comment (`waapi.ts:386-394`) honestly names the
S5/W3 progress-reconciliation divergence — the JS `ScrollTimeline` applies
`SmoothProgress` smoothing + a boundary snap; the native `animation-range` lane
has NEITHER, so the bridge attaches **raw** scroll progress. The comment tells
the consumer to run the JS lane with `smoothing: false` for behaviour-equivalence
— but **nothing enforces it**. A consumer who attaches the native bridge AND runs
a JS `ScrollTimeline({ smoothing: true })` fallback on a non-supporting browser
gets two visibly different scroll feels across browsers, silently.

- **BOOK** a feature-detect-asymmetry test (or a dev-mode `console.warn` /
  typed-narrowing) that the native-bridge attach path and the JS fallback agree
  on smoothing — the same "isomorphic across the feature-detect" discipline E.W9
  applied to `@property` (JS path = verbatim fallback). This is a *contract
  surface* gap, not a bug; the engine is correct, the consumer can foot-gun it.

**Disposition: ALREADY-SOTA (the bridge) + BOOK (enforce/lint the
smoothing-parity contract across the feature-detect — small, additive).**

---

## F-ENG-5 — the Animation 914L "further split" question — RECORD (split NOT warranted)

**Cite.** `engine.ts:80-993` (`Animation`, ~913L), `:995-1161`
(`CSSKeyframesAnimation`, ~166L); method inventory verified.

The brief asks whether a further split is warranted now the ceiling rose to 950.
**Verified answer: no — the class is at its cohesive gestalt and a further split
would fragment a load-bearing contract.** D.W4 already extracted the heavy half
(`FrameCompiler`, 402L); what remains in `Animation` is FOUR coherent, mutually
load-bearing groups, none independently extractable without dependency churn:

1. **the compile-delegation facade** (~6 thin accessors → `this.compiler`,
   `engine.ts:145-189`) — a deliberate seam, not bulk;
2. **the ~13 fail-explicit option setters** (`setDuration`…`setOptions`,
   `engine.ts:191-411`) — the bulk, but they share the live-options-reference
   contract (each mutates `this.options` in place so the compiler reads current
   values; `setDuration`/`setColorSpace` trigger targeted re-derives). Extracting
   them to a mixin/helper would sever the `this`-bound re-derive seam the
   FrameCompiler depends on (`6e29236` test-locked exactly this reference);
3. **the lifecycle/playback dispatch** (`onStart`/`advanceTo`/`_frame`/`play`/
   `pause`/`resume`/`stop`/`settle` + the WAAPI/reduced-motion privates) — the
   state machine; splitting it from the flags it mutates is the classic
   anaemic-object anti-pattern;
4. **the fill/rest contract** (`restPosition`/`paintRest`/`fillForwards`) — small,
   already one-place.

A split here would be **legacy-shaped** (extract-for-line-count), exactly what
the §Mandate forbids. The honest disposition: the 950 ceiling holds the line
against *growth*, and the class is correctly under it; the next real reduction
comes from F-ENG-1's sync-step transposition (removes the `async`/`_frame`
plumbing), not from a structural carve. **RECORD: no split; the ceiling is a
growth-guard, not a refactor trigger.**

---

## F-ENG-6 — `.finished` getter / DX front-door — BOOK (the one un-landed E DX item)

**Cite.** absent from `engine.ts` + `group.ts` (grep `get finished` → nil);
named in the E scorecard axis 12 ("`.finished` getter") as a MINOR-GAP that did
not make E's waves.

Motion/GSAP/WAAPI all expose a `.finished` promise as the idiomatic "await
completion" surface. keyframes exposes completion only via the awaited `play()`
return — so a consumer who `play()`s fire-and-forget then later wants to await
the end has no handle (the `_playingPromise` is private, `engine.ts:144`). This
is a small, additive, isomorphism-free DX seam (`get finished(): Promise<void>`
returning the live `_playingPromise ?? Promise.resolve()`).

- **BOOK** (not SHIP) — it is net-new public API surface; F is research/audit
  and the additive-API decision belongs to an implementation wave, not an
  audit's pen. Recorded so the band can fold it with the other DX sugar.

**Disposition: BOOK (additive `.finished` getter — small, idiomatic, defer the
API call to a wave).**

---

## F-ENG-7 — `tryParseCache` unbounded — RECORD (B1 re-confirmed recorded-withheld)

**Cite.** `utils.ts:203` (`new Map<string, ValueArray>()`), populated `:267`,
read `:241` — still no eviction (grep `.delete`/`.clear`/`MAX_CACHE` → nil).

E's `engine-findings.md` B1 booked this as "verified-unbounded-but-not-hot,
eviction withheld pending a workload that warrants it." **Re-confirmed for F,
unchanged:** the cache is on the COLD compile path (`parseAndFlattenObject`, not
the rAF loop), keyed by `${childKey}:${strValue}`, bounded in practice by the
consumer's distinct-CSS-value count (a few hundred for a whole animation
library). `.clone()` on set+get keeps entries immutable — no correctness hazard,
only a theoretical memory ceiling a CSS fuzzer could hit.

- **RECORD — recorded-withheld** (do not add an LRU). The §Mandate's measure-first
  forbids bolting speculative eviction onto a cold path that has shown no real
  footprint problem. This is **also a value.js-HANDOFF adjacency** (the value.js
  side has the same unbounded-memo shape — the E handoff already merges them into
  one "bounded LRU memo caches" row; F augments, does not write).

**Disposition: RECORD (recorded-withheld; the honest non-fold) + value.js-HANDOFF
(the merged bounded-memo row).**

---

## F-ENG-8 — WAAPI-color lift still excluded — value.js-HANDOFF (gated, unchanged)

**Cite.** `waapi.ts:153-158` (color → `eligible: false`, "color interpolation
requires perceptual lerp").

The 4-lane E finding (admit native CSS Color L4 color now the UA interp default
is oklab for non-legacy syntax) is **still gated on the value.js non-legacy L4
serializer** (W9 S4 in `valuejs-sota-handoff.md`) — keyframes cannot emit a
WAAPI-color keyframe the UA interpolates in oklab until value.js can serialize a
non-legacy `oklch(...)`/`color-mix(in oklab,...)` form; a legacy `rgb()` emit
would silently fall to sRGB interp and break isomorphism. **Nothing landed here
in E; nothing changes for F on the keyframes side.** The kf-side acceptance
criterion (emit must parse as non-legacy → UA oklab default engages; fix the
eligibility predicate) is already noted in the handoff.

- **value.js-HANDOFF** — re-confirm the existing W9 S4 row in
  `valuejs-sota-handoff.md`; the kf-side eligibility fold is BOOK-gated on it.
  **F does not block on it.**

**Disposition: value.js-HANDOFF (re-confirm; the kf-side fold is gated, BOOK).**

---

## ALREADY-SOTA — verified, manufacture no work

Each grounded, so F does not re-litigate:

- **Standalone zero-alloc (E-RT-1)** — `_interpOut` instance buffer
  (`engine.ts:161`), `processFrame` is a METHOD not a per-call closure
  (`engine.ts:539`), `_frame` passes the buffer (`engine.ts:747`).
  `proof:standalone-zero-alloc` bites it. The E withhold's structural half landed.
- **The light steppers are stall-robust BY CONSTRUCTION** — `SmoothProgress.tickDt`
  is `1 - exp(-damping·dt/16.667)` (`smooth.ts:120`, frame-rate-independent
  exponential smoothing) and `SpringProgress` is a **closed-form analytic** solver
  (`spring.ts:340-385`, evaluated at absolute elapsed time, not Euler-integrated).
  The `drive` loop computes `dt` with **no upper clamp** (`playback.ts:173`) — and
  this is CORRECT, not a gap: a huge `dt` after a background-tab stall saturates
  the smoothing factor (→ snap, benign) or lands the analytic spring at its
  mathematically-correct position for that elapsed time (a visual skip, not a
  blow-up). A naive Euler integrator would explode here; these don't. **Note this
  as a LEAD, not a bug** — the brief's "production readiness" lens passes.
- **SpringProgress** — analytic 2nd-order ODE with live `(x,v)` re-seat
  (`spring.ts:249-267`) + the modern Motion `{visualDuration, bounce}` surface
  (`fromDuration`, `spring.ts:211`). The E.W10 adapter landed. LEAD.
- **`Draggable`** — pointer-capture follow + rolling velocity window with eviction
  (`drag.ts:275-306`) + C¹-continuous fling via the spring re-seat
  (`drag.ts:256`). Raw `addEventListener` is DELIBERATE library-code (documented
  `drag.ts:16`), with explicit per-gesture teardown. Exemplary.
- **WAAPI eligibility rigor** — bind-proof `usesDefaultRenderer`
  (`waapi.ts:91`), the CSS-twin-faithfulness gate (`waapi.ts:134` — refuses to
  run a bespoke curve bare-linear on the compositor), the multi-segment
  `linear()` restart guard (`waapi.ts:117`), dense sub-segment sampling
  (`WAAPI_SUBSEGMENT_STOPS=8`, `waapi.ts:177`). More disciplined than Motion's
  hybrid switch.
- **`@property` registration** (D-LIB-1) — `registerProperties()`
  (`engine.ts:1125`), feature-detected, per-descriptor try/catch on the
  process-wide registry, JS path the verbatim fallback. LANDED.
- **FC-1 colorSpace compile-staleness** — `renormalizeColors()`
  (`frame-compiler.ts:387`) re-derives the color carriers in place on
  `setColorSpace`/`setHueMethod` (no re-flatten/re-sort); the E audit's "the
  comment lies" gap is closed and the doc-comment (`frame-compiler.ts:99-109`)
  now states it truthfully. LANDED.
- **The hot path kernel** — binary-search seed + contiguous-neighbor scan
  (`engine.ts:579-606`), pre-resolved monomorphic `lerpValue` dispatch over
  pre-flattened `allInterpVars`, zero-width-frame snap (E-RT-5 fixed,
  `engine.ts:625`). The `scheduler.yield` INP-batched group advance
  (`group.ts:368-382`). All SOTA.
- **The value.js static/dynamic boundary** — the light orchestration tier
  (`stagger`/`flip`/`drag`/`decay`/`Sequence`) carries zero static value.js edge;
  the barrel (`index.ts`) gates the heavy engine behind `loadAnimationEngine()`.
  `proof:boundary` bites it.

---

## Disposition ledger

| ID | Finding | Cite | Disposition |
|---|---|---|---|
| F-ENG-1 | per-frame promise+microtask churn (E-RT-2 re-confirmed OPEN) | `playback.ts:96-111`; `engine.ts:692,721`; `group.ts:392-404` | **MEASURE-FIRST** (`proof:sync-step`) |
| F-ENG-2 | DOM write-skip ~0 keyframes-side; cost is value.js serialization | `utils.ts:363-377`; `d3-changed-keys.measure.test.ts` | **RECORD** + **value.js-HANDOFF** (VJS-2) |
| F-ENG-3 | WAAPI commit-on-finish landed; commit→cancel transition caveat | `waapi.ts:329-363` | **ALREADY-SOTA** + **BOOK** |
| F-ENG-4 | native-scroll bridge landed; smoothing-parity contract un-gated | `waapi.ts:366-429`; `timeline.ts:228` | **ALREADY-SOTA** + **BOOK** |
| F-ENG-5 | Animation 913L further-split question | `engine.ts:80-993` | **RECORD** (no split — cohesive) |
| F-ENG-6 | `.finished` getter / DX front-door | absent | **BOOK** (additive API, defer to a wave) |
| F-ENG-7 | `tryParseCache` unbounded (B1) | `utils.ts:203,241,267` | **RECORD** (recorded-withheld) + value.js-HANDOFF |
| F-ENG-8 | WAAPI-color lift still excluded | `waapi.ts:153-158` | **value.js-HANDOFF** (gated; kf fold BOOK) |
| — | E-RT-1 / steppers / WAAPI gate / `@property` / FC-1 / hot kernel / boundary | (see §ALREADY-SOTA) | **ALREADY-SOTA** |

**What F's engine band folds:** at most **one** live engine change —
F-ENG-1 (the sync-step / non-async-frame transposition), and ONLY on a
demonstrated `proof:sync-step` bench win; else recorded-withheld. Everything
else is BOOK (two WAAPI/native production caveats + the `.finished` DX seam),
RECORD (no split, B1 withheld, write-skip killed by measurement), or
value.js-HANDOFF (VJS-2 serialization, the WAAPI-color serializer, the merged
bounded-memo row). **The post-E engine is exemplary; F's honest engine surface
is one measured micro-perf fold and a handful of documentation/contract
hardenings — no re-architecture, no manufactured work.**

---

### Verification (re-runnable)

```sh
cd /Users/mkbabb/Programming/keyframes.js
# F-ENG-1 — the async chain is still live (expect matches):
grep -n "Promise.resolve(step(now)).then" src/animation/playback.ts
grep -n "async advanceTo\|private async _frame" src/animation/engine.ts
# F-ENG-2 — write path unchanged; the measure artifact exists:
grep -n "unflattenObjectToString(vars)\|setProperty" src/animation/utils.ts
ls test/d3-changed-keys.measure.test.ts
# F-ENG-3/4 — the landed seams:
grep -n "commitStyles\|restPosition === \"final\"" src/animation/waapi.ts
grep -n "attachNativeScrollTimeline\|smoothing" src/animation/waapi.ts
# F-ENG-5 — class span; F-ENG-6 — no .finished; F-ENG-7 — unbounded cache:
grep -n "^export class" src/animation/engine.ts
grep -n "get finished" src/animation/engine.ts src/animation/group.ts   # expect: nil
grep -n "tryParseCache.delete\|tryParseCache.clear" src/animation/utils.ts # expect: nil
# the post-E gate suite is green (the exemplary verdict is test-backed):
npm test
```

[DebugBear]: https://www.debugbear.com/blog/requestanimationframe
[whatwg/html#2637]: https://github.com/whatwg/html/issues/2637
[GSAP ticker docs]: https://gsap.com/docs/v3/GSAP/gsap.ticker/
[csswg-drafts#11084]: https://github.com/w3c/csswg-drafts/issues/11084
