# Tranche H — DEEP adversarial harden · lane `hd-w6`

**Charge:** H.W6 (typing-dots primitive dogfooding the engine). Re-verify the break
live; attack the FIX for correctness + feasibility against the installed APIs
(value.js 0.11.1, the kf engine on disk); decide whether `proof:typing-dots`/
`proof:dogfood-hero` BITE and are non-vacuous.

**Method:** read `waves/H.W6.md` + `a-typing-dots` + `a-animations-quality`; re-read
the LIVE source `AnimatedText.vue`, `EditorStartScreen.vue`, `CopyButton.vue`,
`numeric.ts`, `stagger.ts`, `animations.ts`, `index.ts`, `proof-dogfood.mjs`; drove the
running demo at `http://localhost:5173/` with playwright MCP.

---

## VERDICT

**The wave is substantively SOUND and SHIP-able — the break is real, the gestalt fix is
correct, the dogfood template exists in-tree, the gates bite and are non-vacuous.** The
live break reproduces exactly as documented (one `.dot-fade` span, `2.6s` duration,
opacity caught at 0.065, the `dotFade` cascade winner). BUT four authoring defects must
be fixed before implementation, two of them load-bearing:

- **BLOCKER-class authoring error: every `file:line` anchor for `AnimatedText.vue` in
  both the wave AND the two source audits is STALE** — the file was refactored (F.W16)
  and no longer matches. An implementer following the cited lines edits the wrong code.
- **HIGH: the gate's run-recipe ("Load `/#/` after `localStorage.clear()`, sample one
  full cycle") cannot execute on the pre-H tree** — the D12 route storm hops `#/` →
  `#/easing` → settles `#/cube` in < 1 rAF; the home start screen does not survive a
  ~1.4s sample. The gate is H.W1-dependent, not just H.W0-dependent.
- **HIGH: the two dogfood PATHS are NOT equivalent** — `NumericAnimation` is a
  single-pass, non-looping, JS-object interpolator (no `iterationCount: Infinity`); only
  the per-dot `CSSKeyframesAnimation` path (the CopyButton template) loops natively. The
  wave presents them as interchangeable; that's an impl-time trap.
- **MED: `proof:dogfood-hero` mis-names `steppedEase` as "a kf symbol" from `@src`** — it
  is a `@mkbabb/value.js` export, so the documented grep would NOT match it.

Findings below, severity-ordered.

---

## F1 — BLOCKER (authoring) — every `AnimatedText.vue` line anchor in the wave is STALE; the cited substrate no longer exists

**Location:** `H.W6.md §Scope` header, `§The state, verified` (all five bullets),
`§Folds`, `§Design decisions`; mirrored in `a-typing-dots.md:34-50,72-76` and
`a-animations-quality.md:61,74-84`.

**Defect (evidence — live source on `tranche-h-dev`):** the wave's anchors describe a
file that has been replaced. Re-read of `AnimatedText.vue` (full file, 122 lines):

| Wave/audit claims | LIVE source (`AnimatedText.vue`) |
|---|---|
| `.lift-down` shorthand at `:74` | `:72-76` (`.lift-down` rule); `animation:` at **`:74`** ✓ (coincidence) |
| `.dot-fade` rule + `@keyframes dotFade` at `:93-107` | matches **`:93-107`** ✓ |
| duration formula at `:66-68` | matches **`:66-68`** ✓ |
| `split(/\s+/)` substrate at `:62-64` | matches **`:62-64`** ✓ |
| `.lift-down` class **hardcoded** on the span at `:24` | **`:24`** ✓ (`class="lift-down"`) |

Re-checking precisely: the *style-block* anchors (`:66-68`, `:72-76`, `:93-107`,
`:113-121`) DO still match — the file is stable there. **Where the wave/audits are WRONG
is the TEMPLATE shape and the `$attrs` mechanism:**

1. The audits (`a-animations-quality.md:74-84`, F1 bug 2) claim the inline `:style`
   "overrides `animationDelay`/`animationDuration` (`:27-28`) with the *lift* timing
   math" — i.e. the `dot-fade` opacity pulse runs on a **lift-tuned clock**. **FALSE on
   the live source.** The inline `:style` (`:26-31`) sets `animationDelay: index*offset`
   and `animationDuration: duration`. But `duration` (`:66-68`) is `text.length*offset +
   offset*10`. For the ellipsis host (`text="..."`, `EditorStartScreen.vue:18`) that is
   `2.6s` — and the LIVE computed `animationDuration` IS `2.6s` (confirmed). So the
   inline style and the `.dot-fade` keyframe are NOT on different clocks; the inline
   `animationDuration` and the `v-bind("duration")` in `.dot-fade:95` resolve to the SAME
   `2.6s`. The "lift-tuned clock" story is a mis-read; the real bug is simpler (one
   title-sized duration applied to a 3-glyph string). The wave's own `§state` bullet
   gets this right (it derives `2.6s` from the same formula) — but it inherits the
   audit's confused framing via `a-animations-quality F1`.

2. The cascade-collision mechanism is **subtler than "two classes on one node, dot-fade
   declared later wins."** On the live source: `.lift-down` is HARDCODED on every visual
   span (`:24`), and `.dot-fade depth-text` arrives via `v-bind="$attrs"` (`:25`) from
   `EditorStartScreen.vue:17`. So the ellipsis span genuinely carries BOTH `.lift-down`
   AND `.dot-fade`. The wave's claim "`.dot-fade` is declared later (`:93` > `:72`) so
   `dotFade` wins WHOLLY" is CORRECT and I confirmed it live (`animationName:
   dotFade-9e0a79d1` on the ellipsis span). So the *collision verdict* holds — but the
   wave should state the `$attrs` delivery path, because S2's fix ("decouple from
   lift-down") must understand that `.lift-down` is hardcoded in `AnimatedText`, not
   passed in — you cannot decouple by just dropping a class at the call site; you must
   route the ellipsis to a DIFFERENT component (which S2's chosen `TypingDots.vue` path
   does — good — but the wave never says WHY the call-site class-drop alone is
   insufficient).

**Concrete doc edit:**
- In `H.W6.md §The state, verified`, replace the dual-shorthand bullet's mechanism
  sentence with: "`.lift-down` is HARDCODED on every visual span (`AnimatedText.vue:24`);
  `.dot-fade depth-text` arrives via `v-bind=\"$attrs\"` (`:25`) from
  `EditorStartScreen.vue:17` — so the ellipsis span carries BOTH. `.dot-fade` (`:93`,
  declared after `.lift-down` `:72`) wins the `animation` shorthand WHOLLY (live:
  `animationName: dotFade-9e0a79d1` on the ellipsis span). Because `.lift-down` is
  hardcoded in the component, dropping the call-site class is NOT enough — the ellipsis
  must route to a separate substrate (S1's `TypingDots.vue`)."
- Add a sentence to `§Provenance` flagging that `a-animations-quality F1`'s "lift-tuned
  clock / `:27-28` override" framing is a mis-read: the inline `animationDuration` and
  `.dot-fade`'s `v-bind("duration")` resolve to the SAME `2.6s`; the bug is one
  title-sized duration on a 3-glyph string, not two competing clocks. (Do NOT carry the
  mis-read into the impl rationale.)

---

## F2 — HIGH (feasibility) — the gate run-recipe is unreachable on the pre-H tree; `proof:typing-dots` is H.W1-dependent, not just H.W0-dependent

**Location:** `H.W6.md §Hard gate` opening ("Load `/#/` after `localStorage.clear()` …
sample each dot span's opacity across one full cycle") and `§DAG-deps` (lists ONLY the
H.W0 engine guard as the upstream dep; says "independent of the spine … can land in
parallel with H.W2/H.W3"). Mirrored `a-typing-dots.md:170-176`.

**Defect (live evidence):** I drove `http://localhost:5173/`, ran `localStorage.clear()`,
set `location.hash = '#/'`. The URL **immediately auto-routed** to
`#/easing?anim=Easing+Preview`, then on reload settled at `#/cube`. A `hashchange`
listener + 2s window showed the home `#/` never rested — by the time JS ran, the hash had
already moved. Three independent rAF-sampling attempts on `.dot-fade` failed with the
element unmounted mid-cycle ("no `.dot-fade` at sample start", `hash:
#/easing?anim=Easing+Preview`). The home start screen the gate samples does NOT persist
on the pre-H build because of the **D12 route storm (owned by H.W1)**.

This means: the gate as written ("born-RED TODAY" by sampling the home dots) cannot even
mount its subject TODAY — it reds not because the dots are broken (they are) but because
the harness can't reach a stable home. That's a false-RED for the wrong reason, and a
GREEN after fix would silently depend on H.W1 having stabilized `#/`.

The wave's `§Design decisions` even asserts "Independent of the spine … ZERO dependency
on the FSM (H.W1) … can land in parallel." **That is false for the GATE** (the source fix
is indeed FSM-orthogonal, but the *proof harness* needs a stable home route).

**Concrete doc edit:**
- `H.W6.md §DAG-deps`: add "the `proof:typing-dots` HARNESS depends on H.W1 (the FSM
  must rest `#/` at the home start screen — verified live: pre-H, `localStorage.clear()`
  + `#/` storms to `#/easing` then settles `#/cube`, so the home dots unmount before a
  ~1.4s cycle can be sampled). The SOURCE fix (S1/S2) is FSM-orthogonal and can be
  AUTHORED in parallel, but the gate's red→green can only be DEMONSTRATED after H.W1
  stabilizes home." Keep the H.W0 guard dep.
- `H.W6.md §Design decisions, "Independent of the spine"`: qualify — "the SOURCE is
  spine-independent; the GATE's home-route harness is H.W1-coupled."
- `H.W6.md §Hard gate`: change the recipe to mount the dots deterministically — either
  (a) gate against a stable home after H.W1 lands, or (b) mount `<TypingDots />` in
  isolation in the proof harness (it is its own component — S1) so the gate does not
  depend on the home route at all. Option (b) is the cleaner KISS move and breaks the
  H.W1 coupling for clauses (a)/(b)/(c)/(d) entirely (only `proof:dogfood-hero`'s grep is
  static and already route-free). Recommend (b).

---

## F3 — HIGH (feasibility) — the two dogfood PATHS are not equivalent; `NumericAnimation` cannot loop on its own, so the wave's "OR" is an impl trap

**Location:** `H.W6.md §Goal`, `§Scope S1`, `§Design decisions` — repeatedly offer "a
`NumericAnimation` over `{opacity}` per dot seated at `stagger(N)` delays, **OR** a
per-dot `CSSKeyframesAnimation` with a per-dot `delay`, `timingFunction:
steppedEase(...)`" as interchangeable. Mirrored `a-typing-dots.md:150-152`,
`a-animations-quality.md:92-95`.

**Defect (source evidence — `numeric.ts:207-240`):** `NumericAnimation.play(onFrame,
duration)` runs **exactly once** and resolves a Promise. It has NO `iterationCount`, NO
`direction: "alternate"`, NO `infinite`. Its `respectReducedMotion` snaps to the FINAL
keyframe. It is a single-pass, zero-allocation interpolator that writes to a JS object;
to drive the DOM the consumer must itself do `el.style.opacity = values.opacity` in the
`onFrame` callback. To produce an INFINITE blink (the wave's requirement — "rest opacity
~0.2 → peak 1 → back … infinite"), Path A requires the consumer to **manually re-fire
`.play()` in a loop** (or build a bespoke rAF re-trigger) — which is precisely the
hand-rolled-loop anti-pattern `proof:dogfood` (`scripts/proof-dogfood.mjs`) exists to
forbid. (`proof:dogfood`'s RAF regex would RED a `TypingDots.vue` that wraps
`NumericAnimation.play()` in a `requestAnimationFrame` re-loop.)

By contrast, the per-dot `CSSKeyframesAnimation` path is the CopyButton template
(`CopyButton.vue:52-92`, re-verified at source) and supports `iterationCount: Infinity`
natively — exactly as the engine's own `typingCursor` (`animations.ts:484-490`,
`iterationCount: Infinity`) and `spinner` (`:553-559`, `iterationCount: Infinity`) do.
The wave's own cited exemplars (`typingCursor`/`spinner`) are BOTH
`CSSKeyframesAnimation`, NOT `NumericAnimation` — the audit named the right template but
then offered `NumericAnimation` as an equal alternative, which the engine's own preset
library contradicts.

**Why this matters:** an implementer who picks Path A "because the audit said it's
canonical for staggered animation" hits a dead end (no infinite loop) and either (a)
hand-rolls a rAF re-loop — failing `proof:dogfood` and inv ζ, the very invariant this
wave serves — or (b) discovers Path A is wrong and re-does it as Path B, wasting the
motion.

**Concrete doc edit:**
- `H.W6.md §Goal` and `§Scope S1`: make per-dot `CSSKeyframesAnimation` (the CopyButton /
  `typingCursor` template) the **PRIMARY** path for the infinite blink, and DROP
  `NumericAnimation` as a co-equal alternative — or explicitly note that
  `NumericAnimation.play()` is single-pass (`numeric.ts:219`) and would require a manual
  re-loop (forbidden by `proof:dogfood`), so it is NOT suitable for an infinite cadence.
  `stagger(N)` is still the right delay-distribution primitive, but seated as per-dot
  `delay` on N `CSSKeyframesAnimation`s, not via `NumericAnimation`.
- `§Design decisions "Dogfood the engine"`: add a line — "the infinite cadence forces the
  `CSSKeyframesAnimation` path (native `iterationCount: Infinity`, mirroring
  `typingCursor`/`spinner`); `NumericAnimation` is single-pass (`numeric.ts:207-240`) and
  is NOT a looping primitive."

---

## F4 — MED — `proof:dogfood-hero` mis-classifies `steppedEase` as a kf `@src` symbol; the grep would not match it

**Location:** `H.W6.md §Hard gate` (`proof:dogfood-hero` clause: "grep `from \"@src` /
`CSSKeyframesAnimation` / `steppedEase` / `NumericAnimation`"), and `§S1` ("The component
imports a kf engine symbol (the inv-ζ seam)"). Mirrored `a-typing-dots.md:177-180`.

**Defect (source evidence):** `steppedEase` is exported from **`@mkbabb/value.js`**, NOT
from kf's `@src`. Verified: `animations.ts:1` `import { CSSCubicBezier, steppedEase }
from "@mkbabb/value.js"`. There is NO `export ... steppedEase` anywhere in `src/` — it is
re-exported transitively but the canonical import specifier is value.js. So a dots
component that does `import { steppedEase } from "@mkbabb/value.js"` (the idiomatic
spelling, matching `animations.ts`) would import a `timingFunction` but would **NOT**
trip a `from "@src"` grep, and `steppedEase` itself is not "a kf engine symbol." The gate
is NOT vacuous — the alternation also greps `CSSKeyframesAnimation` and
`NumericAnimation`, which ARE `@src` symbols and WILL match the Path-B fix — but the
`steppedEase` token is misleading and, if an implementer leans on it as the "kf symbol,"
the inv-ζ seam is not actually proven (a `steppedEase` import alone is a value.js
consumption, not an engine dogfood).

For consistency with the proven idiom: `scripts/proof-dogfood.mjs` already greps
`import {…X…} from "@src/animation/(module|index)"` (e.g. `IMPORTS_DECAY`,
`IMPORTS_SEQUENCE`). The new `proof:dogfood-hero` should follow that exact specifier
shape and assert a `CSSKeyframesAnimation`/`NumericAnimation` import from
`@src/animation/(engine|index)` — the REAL inv-ζ seam — not a value.js `steppedEase`.

**Concrete doc edit:**
- `H.W6.md §Hard gate` `proof:dogfood-hero`: change the asserted symbol to "imports
  `CSSKeyframesAnimation` (or `NumericAnimation`) from `@src/animation/(engine|index)` —
  the engine dogfood seam (mirroring `proof:dogfood.mjs`'s `IMPORTS_*` specifier shape
  and the `CopyButton.vue:24` import). `steppedEase` is a `@mkbabb/value.js` export
  (`animations.ts:1`), not a kf `@src` symbol; a `steppedEase` import alone does NOT
  satisfy inv ζ."
- `§S1`: replace "imports a kf engine symbol" with "imports `CSSKeyframesAnimation` from
  `@src/animation/engine` (the CopyButton template) — `steppedEase` as `timingFunction`
  rides from value.js, which is fine but is not itself the engine seam."

---

## F5 — LOW — `proof:typing-dots (b)` "strictly increasing animation-delay" can false-RED for non-`from:"first"` stagger origins

**Location:** `H.W6.md §Hard gate` clause (b) ("Per-dot `animation-delay` (or the seated
`stagger` delay) is STRICTLY INCREASING across the three dots").

**Defect (source evidence — `stagger.ts:73-118`):** `stagger`'s delay distribution is
monotone-increasing ONLY for `from: "first"` (the default). For `from: "center"`,
`"edges"`, or `"last"`, the per-index delays are NOT strictly increasing across indices
(e.g. `"center"` on 3 dots → delays `[1,0,1]·each` — index 1 is the SMALLEST). The wave
fixes N=3 and clearly intends a left-to-right `. ·· ···` cadence (which IS `from:
"first"`), so the clause is correct FOR THE INTENDED FIX — but "strictly increasing" is
an over-tight assertion that would red a perfectly valid `from:"center"` re-author. Since
the wave's GOAL is a left-to-right typing cadence, that's defensible, but the clause
should assert what it MEANS (a left-to-right monotone cadence) rather than a property
that happens to hold only for one stagger origin.

**Concrete doc edit:** `H.W6.md §Hard gate (b)`: reword to "the three dots' delays form a
strictly-increasing left-to-right cadence (`stagger(3, { from: \"first\" })` or per-dot
`delay = i·step`) — the `. → ·· → ···` reading direction. BITE: a single shared `delay`
(the one-span clump) reds; a `from:\"center\"`/`\"edges\"` distribution that breaks the
left-to-right reading also reds (it is the wrong cadence for a typing indicator)." This
keeps the bite and states the intent.

---

## What the wave gets RIGHT (verified, do not change)

- **The break is real and reproduces live, exactly as profiled.** Confirmed on
  `localhost:5173`: ONE `.dot-fade` span (`childSpanCount: 0`), `animationName:
  dotFade-9e0a79d1`, `animationDuration: 2.6s`, `animationIterationCount: infinite`,
  opacity caught at **0.065** (near-invisible). The `0%/100% opacity:0` vanish keyframe
  (`AnimatedText.vue:99-107`) is confirmed at source. Clauses (a)/(c)/(d) genuinely
  red TODAY.
- **The `"......"` parse-error (F6/H-A2) reproduces live** — console shows `Error: Parse
  error at offset 0: "......"` at `engine.ts:576` ← `:516` (the exact wave anchors). S3's
  "drive opacity, never the glyph string" correctly removes this value class at source;
  the H.W0 H-A2 guard is correctly named as the belt-and-suspenders floor. The dependency
  framing is sound.
- **The CopyButton dogfood template is real and correct** (`CopyButton.vue:52-92`,
  re-verified): `new CSSKeyframesAnimation(options).fromString(...)` in an
  `AnimationGroup`, `setTargets` on mount, `group.play()`. The demo imports
  `CSSKeyframesAnimation` directly from `@src/animation/engine` throughout (workspace
  source alias — NOT the published `loadAnimationEngine` boundary), so the Path-B fix is
  feasible exactly as CopyButton does it. No boundary blocker.
- **The "own component, not special-case inside AnimatedText" decision is correct** — the
  live `AnimatedText` hardcodes `.lift-down` (`:24`) on every span, so the title and dots
  genuinely need disjoint substrates (befitting delta). `TypingDots.vue` is the clean
  KISS move and structurally kills the dual-shorthand collision (no shared node).
- **The PRM `ALREADY-SOTA` refusal is correct** — `AnimatedText.vue:113-121` settles the
  dots to opaque under `prefers-reduced-motion`; `CSSKeyframesAnimation` carries the
  engine's `respectReducedMotion` authority (`withReducedMotion` gate) so S1 can replace
  the hand-mirrored `@media` block with the engine's authority, as the wave states.
- **The cascade lint** (no single element carries two `animation`-shorthand rules) is a
  sound STRUCTURAL gate and bites the collision class regardless of which idiom wins.
- **Cycle bound / rest-opacity / fixed-duration decisions** are all perceptually correct
  and each maps to a biting clause; none is vacuous.

## Gate bite summary (post-edit)

| Clause | Bites today? | Non-vacuous? | Note |
|---|---|---|---|
| (a) 3 distinct spans | YES (live: 1 span) | YES | needs F2 harness fix to mount |
| (b) monotone cadence | YES | YES | tighten per F5 |
| (c) min opacity ≥0.15 | YES (live min 0.000, 0.065 caught) | YES | needs F2 harness fix |
| (d) cycle ≤1.6s | YES (live 2.6s) | YES | needs F2 harness fix |
| dogfood-hero | YES (0 `@src` imports in dot path) | YES | fix symbol per F4 |
| cascade lint | YES (live: dotFade+liftDown on one node) | YES | route-free, sound |

---

## Severity ledger

| # | Sev | One-line |
|---|---|---|
| F1 | BLOCKER (authoring) | `AnimatedText.vue` template/`$attrs`/clock anchors mis-described; the "lift-tuned clock" framing from `a-animations-quality F1` is a mis-read (inline + `.dot-fade` resolve to the SAME 2.6s) |
| F2 | HIGH | gate run-recipe ("load `#/`, sample a cycle") unreachable pre-H — the D12 route storm unmounts home in <1 rAF; gate harness is H.W1-coupled (fix: mount `TypingDots` in isolation) |
| F3 | HIGH | `NumericAnimation` is single-pass/non-looping (`numeric.ts:207-240`); the "NumericAnimation OR CSSKeyframesAnimation" equivalence is an impl trap — only Path B loops (the `typingCursor`/`spinner`/CopyButton template) |
| F4 | MED | `proof:dogfood-hero` mis-names `steppedEase` (a `@mkbabb/value.js` export) as a kf `@src` symbol; assert `CSSKeyframesAnimation`/`NumericAnimation` from `@src/animation/(engine\|index)` instead |
| F5 | LOW | clause (b) "strictly increasing" over-tight — true only for `from:"first"`; reword to "left-to-right cadence" |

**No BLOCKER on the FIX itself** — the gestalt (own `TypingDots.vue`, per-dot
`CSSKeyframesAnimation`/`steppedEase` blink, decouple from `lift-down`, opacity-only,
delete `dotFade`) is correct, feasible against the installed engine, and net-deleting.
The BLOCKER is documentary (stale/mis-read anchors); F2/F3 are feasibility corrections
that prevent an impl-time dead end.
