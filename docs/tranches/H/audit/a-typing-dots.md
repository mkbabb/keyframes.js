# Tranche H — Deep Audit · Lane `a-typing-dots`

**Charge (D6):** the typing-dots ("...", `dot-fade`) animation is broken. Find it,
reproduce live, root-cause, gestalt fix; ideally it dogfoods kf (inv ζ).

**Branch:** `tranche-h-dev` · **Demo:** `http://localhost:5174/#/` (true home — the
hero "Select an animation ..." start screen). Persisted state re-routes `/` to the
last scene; `localStorage.clear()` is required to reach the home start screen.

---

## TL;DR

`dot-fade` is NOT broken in the "throws/no-op" sense — it animates. It is **broken
perceptually**: the entire `...` is treated as ONE word, given ONE slow 2.6 s
opacity pulse 0→1→0, and spends **43 % of every cycle near-invisible (opacity <
0.3)** and only **40 % visible**. There is NO sequential dot cadence (the
`. ·· ···` typing rhythm a reader expects). It reads as a single ghost-blob that
mostly isn't there — i.e. "totally broken" as the user reports. Root cause is a
**duration formula meant for the whole title mis-applied to the 3-char ellipsis**,
compounded by a **single-span ellipsis** (no per-dot split) and a **cascade
collision** between `.lift-down` and `.dot-fade` (both set the `animation`
shorthand on the same span). It does **not** dogfood kf at all — pure hand-rolled
CSS `@keyframes` (inv ζ violation), while the engine already ships the exact
idiomatic primitives (`steppedEase`, `spinner`, `typingCursor`, `SpringProgress`).

**Disposition: SHIP-in-H.** Self-contained, demo-only, two files. Falsifiable
visual + unit lock proposed below.

---

## Anchors (file:line)

- `demo/@/components/custom/AnimatedText.vue:93-107` — `.dot-fade` rule +
  `@keyframes dotFade` (0%/100% opacity:0, 50% opacity:1).
- `demo/@/components/custom/AnimatedText.vue:95` — `animation: dotFade v-bind("duration") var(--ease-standard) infinite;`
- `demo/@/components/custom/AnimatedText.vue:66-68` — the duration formula:
  `` `${props.text.length * props.offset + props.offset * 10}s` ``.
- `demo/@/components/custom/AnimatedText.vue:62-64` — `words = text.split(/\s+/)`:
  `"..."` has no whitespace → **one** word `"..."`, one span, one animation.
- `demo/@/components/custom/AnimatedText.vue:72-76` — `.lift-down` ALSO sets the
  `animation` shorthand; the `...` span carries both classes.
- `demo/@/components/custom/editor-shell/EditorStartScreen.vue:15-20` — the only
  call site: `<AnimatedText class="dot-fade depth-text" :text="ellipsis" />`,
  `ellipsis` default `"..."` (line 49).
- `src/animation/animations.ts:484-490` — `typingCursor` preset (engine,
  `steppedEase(2,"jump-start")`) — the dogfood seam that exists but is unused.
- `src/animation/animations.ts:553-559` / `:218` — `spinner` /
  `steppedEase(40,"jump-end")`: the engine's stepped-cadence idiom, also unused
  by the demo hero.

## Live reproduction (measured — not asserted)

Playwright MCP on `http://localhost:5174/#/` after `localStorage.clear()` (home
start screen mounted; `body` contains "Select an animation"):

```
.dot-fade span:
  text                "..."           ← ONE word, ONE span (not 3 dots)
  animationName       dotFade-…       ← .lift-down LOST the cascade (see below)
  animationDuration   2.6s
  animationIterationCount  infinite
  opacity (one frame) 0.012           ← caught near-invisible
```

Opacity sampled over one full 2.6 s cycle (325 rAF samples):

```
  min 0.000   max 1.000
  fraction of cycle opacity < 0.3 (near-invisible) : 0.43
  fraction of cycle opacity > 0.7 (clearly visible): 0.40
```

So for ~43 % of every cycle the ellipsis is a ghost, and the visible window is a
single slow swell — no `. → ·· → ···` rhythm. Screenshot artifact:
`hero-dotfade.png` (note: the run captured the spring scene mid-transition because
the start-screen `<Transition>` re-keys the `.dot-fade` node frequently; the
opacity numbers above are the authoritative evidence).

## Root cause (four compounding faults, one gestalt)

1. **Wrong duration target (the headline bug).**
   `AnimatedText.vue:66-68` derives `duration` from `text.length` —
   `3 * 0.2 + 0.2*10 = 2.6 s`. That formula was authored for the WHOLE TITLE
   ("Select an animation", 19 chars → ~5.8 s, confirmed live on the `.lift-down`
   words). It was never meant to size a 3-glyph ellipsis. A typing-dots blink
   should be ~1.2–1.5 s for the whole `...` cycle, with the dots STAGGERED, not a
   2.6 s monolithic swell.

2. **Single-span ellipsis → no cadence.** `words = text.split(/\s+/)` leaves
   `"..."` as one token (no spaces). One span ⇒ one `dotFade` ⇒ all three dots
   share one opacity. The hallmark typing rhythm (dot 1, then 2, then 3) requires
   per-dot staggered delays, which the word-split substrate structurally cannot
   produce for a space-free string.

3. **`@keyframes dotFade` is a full FADE-OUT, not a typing BLINK.** `0%,100%
   opacity:0` ⇒ the dots fully vanish each cycle (hence the 43 % near-invisible
   floor). The classic typing idiom keeps a low REST opacity (~0.2) and pulses to
   1 — it never disappears; the user perceives "broken" precisely because it
   blanks out.

4. **Cascade collision `.lift-down` vs `.dot-fade`.** The `...` span carries BOTH
   classes (`EditorStartScreen.vue:17` plus `AnimatedText`'s built-in
   `.lift-down`). Both rules set the **`animation` shorthand**; `.dot-fade` is
   declared later (`:93` > `:72`) so it wins WHOLLY and silently drops `liftDown`
   — confirmed live (`animationName: dotFade-…` on that span, `liftDown-…` on the
   title words). Two idioms fighting over one shorthand on one element is a latent
   trap regardless of which is "right." (Not a glass-ui issue — `depth-text` is a
   glass-ui utility, `node_modules/@mkbabb/glass-ui/dist/styles/utilities.css:231`,
   and it is purely a text-shadow, orthogonal to the animation.)

## inv ζ — does it dogfood kf? NO.

`AnimatedText.vue` is hand-rolled CSS `@keyframes` (`liftDown`, `dotFade`). It
imports nothing from the library. Meanwhile the engine already ships the exact
primitives this hero wants:

- `steppedEase(n, jump)` for a discrete dot cadence (`animations.ts:218,487`),
- `typingCursor` (`animations.ts:484`) as a typing-idiom exemplar,
- `SpringProgress` / `springLinearStops` for a springy lift,
- preset `spinner` showing the stepped-keyframe pattern.

A demo whose entire reason for existing is to showcase the library should NOT
hand-author the one animation literally named after the library's domain. This is
the single highest-leverage fix in the lane.

## Gestalt fix (idiomatic, no workaround)

Make the typing-dots a **first-class, kf-driven, staggered three-dot blink** —
one motion, replacing the broken surface (no compat alias kept beside it):

1. **Split the ellipsis into per-dot spans** so a cadence is even possible. Either
   (a) treat each `.` as its own animated unit inside `AnimatedText` when the text
   is the ellipsis, or — cleaner — (b) give the ellipsis its OWN tiny component /
   render path: three `<span>·</span>` with staggered `animation-delay`
   (`i * step`). The title keeps the WORD-granular `AnimatedText` it needs for
   `text-wrap: balance`; the dots get a substrate that can stagger. This honors
   the F.W16 word-split rationale (don't shred the title) while fixing the dots —
   the two have genuinely different granularity needs (a befitting delta).

2. **Drop the title-sized duration from the dots.** The ellipsis blink is a fixed
   short cycle (~1.4 s total, ~0.16 s per-dot step), NOT `text.length`-derived.
   The `length`-based formula stays ONLY for the title lift.

3. **Re-author the keyframe as a typing BLINK, not a vanish:** rest opacity ~0.2 →
   peak 1 → back, so the dots never fully disappear (kills the 43 % ghost window),
   with `steps()` / `steppedEase` giving the crisp on/off typewriter feel rather
   than the current smooth swell.

4. **Dogfood kf (inv ζ):** drive the dots through the engine — a
   `CSSKeyframesAnimation` (or a `NumericAnimation` over `{opacity}` per dot) with
   `timingFunction: steppedEase(...)`, mirroring `typingCursor`/`spinner`. The
   hero then DEMONSTRATES the library on the very first screen. If a pure-CSS LCP
   constraint is asserted for the hero, MEASURE-FIRST before keeping CSS: the
   `.dot-fade` node already re-keys constantly via the start-screen `<Transition>`,
   so an LCP-purity argument for it is weak.

5. **Resolve the shorthand collision** by NOT stacking `.lift-down` + `.dot-fade`
   on one node. Once the dots are their own substrate (step 1), the title span
   keeps `liftDown` and the dot spans get only the dot animation — no shared
   shorthand, no silent loser. (If both must coexist on one node anywhere, use
   `animation-name`/`-duration` longhands or a single combined keyframe — never
   two `animation` shorthands.)

PRM guard (`AnimatedText.vue:113-121`) is correct and must be preserved: under
`prefers-reduced-motion` the dots settle to a fully-opaque resting frame.

## Falsifiable instruments (so H can gate it)

- **`proof:typing-dots` (visual + numeric lock).** Headless: load `/#/` after
  `localStorage.clear()`, sample each dot span's opacity across one full cycle and
  ASSERT: (a) `n_dots === 3` distinct animated spans; (b) per-dot
  `animation-delay` strictly increasing (cadence exists); (c) min opacity over the
  cycle `>= 0.15` (never fully vanishes — kills the 43 % ghost window); (d) total
  cycle `<= 1.6 s`. The CURRENT build fails (a), (c), and (d) — a clean red→green
  gate. (Reuse the rAF-sampling snippet from this audit as the harness.)
- **`proof:dogfood-hero` (inv ζ).** Static assert `AnimatedText.vue` (or the new
  dots component) imports a kf engine symbol — grep for `from "@src` /
  `CSSKeyframesAnimation` / `steppedEase` / `NumericAnimation`. Fails today (zero
  library imports).
- **Cascade lint.** Grep-gate: no single element class-set may carry two rules
  that both set the `animation` shorthand (catch the `.lift-down`+`.dot-fade`
  class of bug structurally).

## Cross-lane / cross-repo notes

- glass-ui `depth-text` (`utilities.css:231`) is text-shadow only — NOT implicated;
  no handoff.
- The start-screen `<Transition appear>` (`EditorShell.vue:46-52`) re-keys the
  hero often; relevant to lane **a-scene-state (D12)** — the hero animation
  restarting on every scene churn is part of the same unsuspended-state story. Flag
  for that lane; not fixed here.
- `value.js` / `parse-that`: no handoff for this lane.

## Disposition

**SHIP-in-H** — D6 is a contained demo-only fix across
`AnimatedText.vue` + `EditorStartScreen.vue` (and ideally a small new dots
component). Gate with `proof:typing-dots` + `proof:dogfood-hero`. Honesty note:
this is NOT already-SOTA; it is a genuine perceptual break with a measured profile
(43 % invisible, no cadence, zero dogfood).
