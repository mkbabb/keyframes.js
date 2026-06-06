# F.W16 — The rail/ball idiom honest-correction + the hero typography/a11y substrate

**Phase:** IMPL · **Class:** PATCH+demo (the demo — one idiom consolidation [a small named
motion-cohesion delta] + the LCP hero's typographic + a11y substrate; the library is UNTOUCHED) ·
**Scope:** `demo/@/styles/design-idioms.css` (promote `progress-rail`/`progress-ball`) +
`demo/spring/SpringTarget.vue:143-193` + `demo/easing/EasingTarget.vue:294-327` +
`demo/spring/SpringSidebar.vue:162-184` + the timeline track (the 4× rail consumers) +
`demo/@/components/custom/AnimatedText.vue` (the per-char hero) + `demo/@/components/custom/
editor-shell/EditorStartScreen.vue:5-21` (the hero `<h1>`) — Band 5, the demo-design finishing
pass · **DAG: F.W16 is INDEPENDENT of the engine bands; F.W10's dogfood scene + F.W12's MotionPath
scene respect F.W16's promoted idiom** (`F.md §The DAG` — the cross-band coupling) · **Gated on:**
keyframes' own green CI (inv-27).

**Title.** *Two honest corrections of the E record on the demo's most-seen surfaces: the rail/ball
idiom is STILL 4× with drift — W11's commit claimed "progress-dot promoted" but promoted the WRONG
primitive (the conic-gradient playing-ring, a different thing); and the per-character hero defeats
`text-wrap: balance`, has no accessible name, and drives a pre-CQ JS line-break. Promote a real
rail/ball pair; give the LCP element a typographic + AT substrate worthy of it.*

The post-E demo is **~90% SOTA** (`r-demo-design-2026` headline — the W11 elevation's headline
items all landed). F's design residual is two surfaces W11 reached only partway, and BOTH carry a
named correction of the E record (inv ε): the rail/ball consolidation the prior lanes prescribed was
NOT delivered (W11 promoted a different primitive under the same name), and the hero's typographic +
reading substrate was never examined (W11 guarded the hero's MOTION, not its WRAPPING or its AT
reading). These are not a rebuild; they are the disciplined idiom-ownership system (D.W2/W3,
`design-idioms.css`) extended to the corner it skipped, plus the one structural typography correction
on the LCP element.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO workaround: promote a REAL
`progress-rail`/`progress-ball` idiom pair to `design-idioms.css` (parameterized by `--rail-tint`/
`--ball-glow`/`--ball-size`) and route all four consumers through it — NOT a fifth scoped block; for
the hero, resolve the per-char-stagger-vs-`text-wrap:balance` tension AT THE ROOT (stagger at
word/line granularity OR let `balance` own wrapping + delete the JS break), NOT a band-aid. NO legacy:
the four scoped rail blocks are REMOVED (replaced in one motion), not left beside the idiom; the JS
`width<768` line-break (a pre-container-query anti-pattern) is DELETED in favor of CSS wrapping. NO
gold-plating: the consolidation picks EasingTarget's AA-contrast-lineage values as canonical (a tiny
deliberate delta on the three other sites). Measure-first does NOT bind a perf claim; the gate is
`proof:idioms` (de-dup) + a hero accessible-name assertion. Isomorphic: the consolidation is a
named befitting motion-cohesion delta (same class as the W11 `--spring-snappy` reconcile); the AT name
is pixel-iso; restoring `balance` changes narrow-viewport wrap points (a befitting legibility delta)
+ removes a JS listener (a perf + idiom win). inv δ: no dock occlusion. inv ε: every claim cites
`file:line` + names the E-record correction honestly.

**Provenance.** `r-demo-design-2026 §1` (the rail/ball idiom STILL 4× with drift — W11 promoted the
WRONG primitive; SHIP-in-F, the honest E-record correction), `§2` (the per-character hero defeats
`text-wrap: balance` + has no AT name + the JS `width<768` break; SHIP-in-F, the LCP element's
typographic + a11y substrate); `a-demo-post-e §6` (the icon-button touch-target generalization — BOOK).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **W11 promoted the WRONG primitive — the rail/ball idiom is STILL 4× with drift.**
   `r-demo-design-2026 §1` (re-grounded): W11's commit message (`d400591`) says "progress-dot
   promoted to design-idioms.css" — but the thing promoted is the **conic-gradient PLAYING-INDICATOR
   ring** (`design-idioms.css:244-256`, driven by `--dot-p`, `radius-pill`; the docstring at
   `:235-243` is explicit — "the active-playing progress ring … the active-playing companion to
   glass-ui's `<StatusDot>`"). That is a DIFFERENT primitive from the **rail-line + scrubber-ball**
   the prior lanes meant. The rail/ball family is STILL authored four times with drift (verified):
   - `SpringTarget.vue:143-193` — `.spring-rail-line` (`color-mix … 12%`, `:151`), `.spring-ball`
     (glow `… 40%` `:177`, **1.75rem** `:171`), `.sampler-ball` (`… 65%` `:190`), the dashed marker.
   - `EasingTarget.vue:294-327` — `.track-line` (`color-mix … 8%`), `.track-ball--active` (glow
     `… 35%`, **36px** via `--track-ball-size-active: 36px` `:272`), `.track-ball--muted` (`24px`).
   - `SpringSidebar.vue:162-184` — `.preset-line` (`color-mix … 10%` `:170`, 2px), `.preset-ball`
     (**1.1rem** `:176`, no glow).
   - the timeline track rail/playhead (the fourth instance of the same geometry).
   The drift is visible: a user moving Spring → Easing → the spring sidebar sees the SAME conceptual
   primitive (a green dot on a tinted rail) at **three rail tints (12/8/10%), two glow strengths
   (40/35%), four ball sizes (1.75rem/36px/1.1rem/…)** (`r-demo-design-2026 §1`). The
   `--track-ball-size-*` props EasingTarget exposes (`EasingTarget.vue:272-273`) are the right
   parameterization seam. This is the cross-scene incoherence the D.W2 idiom-ownership pass set out to
   eliminate, surviving in the newest scenes — the prior lanes' fix (Theme 3.2) was NOT applied (only
   the unrelated `.progress-dot` ring was).

2. **The per-character hero defeats `text-wrap: balance` (NEW finding).** `r-demo-design-2026 §2`
   (verified): the LCP hero `<h1 class="text-display-4">` (`EditorStartScreen.vue:5-21`) renders its
   title through `AnimatedText`, which splits the string into **one `<span>` per character** for the
   lift-down stagger (`AnimatedText.vue:2-12` — `v-for="(char, index) in currentText"`, each char in a
   `.lift-down` span). glass-ui's `.text-display-4` ALREADY sets `text-wrap: balance`
   (`node_modules/@mkbabb/glass-ui/dist/styles/typography.css`, the `.text-display-*` family, verified).
   But `balance` operates on the browser's line-breaking of a TEXT RUN; when the run is shredded into
   per-character inline-block `<span>`s, the balancer has NOTHING to balance — so the demo's largest
   text gets NONE of the balanced-rag treatment glass-ui pays for, relying instead on a hard JS
   `width < 768` line-break (`AnimatedText.vue:45-55` — a `useWindowSize` watch swapping a pre-broken
   string, `:24` `const { width } = useWindowSize()`), itself a pre-container-query anti-pattern (a JS
   media query driving layout). `text-wrap: balance` is Baseline 2024-05-13 and the SOTA path for short
   headings; the demo opted its hero OUT by construction.

3. **The hero has NO accessible name (NEW finding).** `r-demo-design-2026 §2` (verified): the
   per-character `<span>`s carry no `aria-label`/`role`/`sr-only` mirror (grep-confirmed:
   `AnimatedText.vue` + `EditorStartScreen.vue` have zero `aria`/`role`/`sr-only`). A screen reader
   reads the hero `<h1>` as a stream of single characters ("S … e … l … e … c … t") or — with the
   ` ` (`HTML_SPACE`) substitution (`AnimatedText.vue:23` `const HTML_SPACE = " "`) — as
   nothing meaningful. The demo's FIRST and largest heading is the one piece of text least legible to
   AT; W11's a11y uniformity pass guarded the MOTION (PRM), not the READING.

The wave's job: promote a real `progress-rail`/`progress-ball` idiom pair + route the 4× consumers
through it; give `AnimatedText` an accessible name + resolve the stagger-vs-balance tension at the
root + delete the JS break — closed by `proof:idioms` (de-dup) + a hero accessible-name gate that
BITES.

---

## § Goal

**What lands** (one idiom consolidation + the hero substrate — `proof:idioms` + the hero a11y clause green):

- **A real `progress-rail`/`progress-ball` idiom pair in `design-idioms.css`** — parameterized by
  `--rail-tint`/`--ball-glow`/`--ball-size`, defaulting to EasingTarget's AA-contrast-lineage values;
  consumed by `SpringTarget`/`EasingTarget`/`SpringSidebar`/the timeline track. ONE green, ONE glow,
  ONE rail recipe, ONE source — the literal completion of the prior lanes' Theme 3.2 that W11's commit
  message CLAIMED but did not deliver. The four scoped rail blocks are removed.
- **`AnimatedText` gains an accessible name** — render the per-character visual layer
  `aria-hidden="true"` + a single visually-hidden `<span class="sr-only">{{ text }}</span>` (or set
  `aria-label` on the host + `aria-hidden` on the span stream), so AT reads the whole word.
- **The stagger-vs-`balance` tension resolved at the ROOT** — stagger via `animation-delay` on a
  WORD/LINE wrapper that preserves the text run (CSS can stagger `nth-child` spans at word granularity
  while letting the run wrap + balance), OR let `text-wrap: balance` + a container-query/fluid width
  own the wrapping; AND **delete the JS `width < 768` line-break** (`AnimatedText.vue:45-55`) in favor
  of CSS wrapping (removing the `useWindowSize` listener driving a layout decision CSS now owns).
- **`proof:idioms`** (the rail/ball pair de-duplicated) + the hero accessible-name assertion wired into CI.

**Recorded-BOOK** (named, dispositioned, NOT this wave):
- **The VT shared-element directional morph** (`NEW-32`/`r-demo-design-2026 §3`) — gated on the
  glass-ui `types` helper H-1 (F.W13's hand-off); **BOOK**.
- **Icon-button touch-target generalization** (`a-demo-post-e §6`/`NEW-30`) — **BOOK** (the `h-6 w-6`
  buttons toward ≥44px; the primary diamonds are already fixed).

**Why:** the rail/ball drift is the exact cross-scene incoherence D.W2 set out to eliminate, surviving
in the newest scenes because W11 promoted the wrong primitive (`r-demo-design-2026 §1`); and the LCP
hero — the demo's most identity-bearing surface — is its least-legible-to-AT text and is opted out of
the `text-wrap: balance` glass-ui pays for, by construction (`r-demo-design-2026 §2`). Both are honest
corrections of the E record (inv ε), and both are the disciplined idiom/typography system extended to
the corner W11 reached only partway — not a rebuild.

---

## § Scope

One idiom consolidation (S1) + the hero substrate (S2) land; two items are BOOK. Every claim is
`file:line`-grounded.

### S1 — Promote a real `progress-rail`/`progress-ball` idiom pair + route the 4× consumers (`r-demo-design-2026 §1`) — SHIP-in-F

**WHAT:** add a `progress-rail` + `progress-ball` idiom pair to `design-idioms.css` (beside the
existing `.progress-dot`/`.progress-bar` idioms), parameterized by `--rail-tint` / `--ball-glow` /
`--ball-size` custom properties (the `--track-ball-size-*` seam EasingTarget already exposes,
`EasingTarget.vue:272-273`), defaulting to EasingTarget's AA-contrast-lineage values (the canonical
tint/glow). Route `SpringTarget.vue:143-193` (`.spring-rail-line`/`.spring-ball`/`.sampler-ball`),
`EasingTarget.vue:294-327` (`.track-line`/`.track-ball--active/--muted`), `SpringSidebar.vue:162-184`
(`.preset-line`/`.preset-ball`), and the timeline track through the pair (setting the per-site
`--rail-tint`/`--ball-glow`/`--ball-size` where a befitting variation is wanted). REMOVE the four
scoped rail blocks (no-legacy — replaced in one motion).

**WHY:** the rail/ball is the SAME conceptual primitive rendered four ways with drift (State 1) — the
cross-scene incoherence D.W2's idiom-ownership pass eliminated everywhere else, surviving here because
W11 promoted the conic-gradient PLAYING-RING (`.progress-dot`, `design-idioms.css:244-256`), a
DIFFERENT primitive, under the rail/ball name. This is the literal completion of the prior lanes'
Theme 3.2 (`r-demo-design-2026 §1`) and an honest correction of the E `FINAL.md` record (which reads as
if the rail idiom landed — it did not). One green, one glow, one rail, one source.

### S2 — The hero typographic + accessible substrate (`r-demo-design-2026 §2`) — SHIP-in-F

**WHAT:** (a) give `AnimatedText` an accessible name — render the per-character visual span layer
`aria-hidden="true"` and add a single visually-hidden `<span class="sr-only">{{ text }}</span>` (or
set `aria-label` on the host + `aria-hidden` on the span stream), so AT reads the whole word, not the
"S…e…l…e…c…t" stream (State 3). (b) Resolve the stagger-vs-`balance` tension at the ROOT — stagger via
`animation-delay` on a WORD/LINE wrapper that preserves the text run (CSS staggers `nth-child` spans at
word granularity while the run wraps + balances), OR let `text-wrap: balance` + a container-query/fluid
width own the wrapping. (c) DELETE the JS `width < 768` line-break (`AnimatedText.vue:45-55`) + its
`useWindowSize` listener (`:24`) in favor of CSS wrapping.

**WHY:** the per-char split shreds the text run so glass-ui's `.text-display-4` `text-wrap: balance`
has nothing to balance — the demo's LARGEST text gets none of the balanced-rag treatment glass-ui pays
for (State 2); the per-char `<span>`s have no AT name, making the FIRST + largest heading the least
legible to AT (State 3); and the JS `width<768` break is a pre-container-query anti-pattern (a JS media
query driving a layout decision CSS now owns). Resolving the tension at the root (word/line-granular
stagger, or `balance`-owns-wrapping) restores the SOTA short-heading path while keeping the lift-down
motion, gives the LCP element an accessible name, and removes the JS listener (a perf + idiom win).

> **BOOK in this band (named, NOT this wave):**
> - **The VT shared-element directional morph** (`NEW-32`/`r-demo-design-2026 §3`) — `App.vue:332` sets
>   ONE `view-transition-name: scene-subject` on the scene host → a cross-fade of the whole plane, NOT
>   a morph (which needs the same name on a distinct outgoing + incoming element; the dock icons carry
>   none). The cross-fade is legitimately SOTA + the safe baseline; the morph is a stretch the prior
>   lanes themselves tagged "(stretch)", gated on the glass-ui `types` helper H-1 (F.W13). **BOOK** (a
>   naming-vs-reality nuance recorded so the E record is precise — `useSceneTransition.ts:10`/`App.vue
>   :325` describe a morph that, with one host name, can only cross-fade).
> - **Icon-button touch-target generalization** (`a-demo-post-e §6`/`NEW-30`) — **BOOK** (the `h-6 w-6`
>   buttons toward ≥44px via transparent `::before` padding; the primary diamonds are already fixed).

---

## § Hard gate (`proof:idioms` + the hero a11y clause — falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real grep/a11y test, not an assertion):

1. **The rail/ball pair is de-duplicated through `design-idioms.css` (S1).** `proof:idioms` asserts a
   `progress-rail`/`progress-ball` idiom pair exists in `design-idioms.css` AND that
   `SpringTarget`/`EasingTarget`/`SpringSidebar`/the timeline track consume it — with ZERO remaining
   scoped rail/ball blocks (no `.spring-rail-line`/`.track-line`/`.preset-line` scoped re-definitions).
   **BITE:** re-author a scoped `.spring-rail-line` block in `SpringTarget.vue` → the de-dup grep reds
   (reds today — the four scoped blocks live, verified State 1); promote the wrong primitive (the
   conic-ring) again → the "is it the rail/ball, not the playing-ring" assertion reds.

2. **The hero `<h1>` has an accessible name (S2).** A hero accessible-name assertion: the `<h1>`
   rendered through `AnimatedText` exposes its full title to AT (an `aria-label` on the host or an
   `sr-only` mirror), and the per-char span stream is `aria-hidden`. **BITE:** strip the `sr-only`
   mirror / `aria-label` → the accessible-name assertion reds (reds today — verified State 3, the hero
   reads as a char stream).

3. **`text-wrap: balance` is no longer defeated + the JS break is gone (S2).** A test/grep asserts the
   hero text run is NOT shredded into per-character spans for the balancer (the stagger is word/line
   granular OR `balance` owns wrapping) AND the JS `width < 768` line-break + its `useWindowSize`
   listener are DELETED (`AnimatedText.vue:45-55`, `:24`). **BITE:** restore the per-char-only split
   defeating `balance`, or restore the JS `width<768` watch → the respective clause reds.

4. **No dock occlusion (inv δ).** `proof:demo-elevate`'s occlusion clause stays green — the consolidated
   rail/ball + the hero changes do not introduce a dock-over-content overlap. **BITE:** a layout that
   occludes the dock band → the inv-δ clause reds.

5. **No regression / named befitting deltas only.** `npm test` stays green; the rail/ball consolidation
   is a named motion-cohesion delta (EasingTarget's canonical values, a tiny pixel delta on the three
   other sites — same class as the W11 `--spring-snappy` reconcile); the AT name is pixel-iso; the
   `balance` restoration changes narrow-viewport wrap points (a befitting legibility delta) + removes a
   JS listener. **BITE:** an UNexpected pixel/behaviour change outside the named deltas reds (the deltas
   are befitting + named, not free-for-all).

---

## § Folds

Retires (by finding id):
- **`r-demo-design-2026 §1`** (the rail/ball idiom still 4× with drift — W11 promoted the WRONG
  primitive; the honest E-record correction) — S1 + gate clause 1.
- **`r-demo-design-2026 §2`** (the per-character hero defeats `text-wrap: balance` + no AT name + the JS
  `width<768` break) — S2 + gate clauses 2/3.

**Recorded-BOOK (named, NOT this wave):**
- **`r-demo-design-2026 §3`** (`NEW-32` the VT shared-element directional morph — gated on the glass-ui
  `types` helper H-1, F.W13).
- **`a-demo-post-e §6`** (`NEW-30` icon-button touch-target generalization).

**No value.js hand-off (these are demo-CSS/demo-DOM design concerns; the engine + value.js are
untouched — `r-demo-design-2026` value.js-handoffs: NONE; §5a fluid display type is a glass-ui ASK,
F.W13's BOOK).**

---

## § Design decisions

1. **Promote a REAL rail/ball pair — the honest correction of the E record.** RESOLVED (inv ε): W11's
   commit message claims "progress-dot promoted" but the promoted thing is the conic-gradient
   PLAYING-RING (`design-idioms.css:244-256`), a DIFFERENT primitive from the rail-line + scrubber-ball
   the prior lanes meant — the rail/ball family is still 4× with drift (State 1). So F promotes the
   correct primitive (a parameterized `progress-rail`/`progress-ball` pair) and routes the four
   consumers through it, removing the scoped blocks (no-legacy). This is recorded as a HONEST correction
   of the E `FINAL.md` record (which reads as if the rail idiom landed). Trade-off: the consolidation
   picks EasingTarget's canonical values, a tiny pixel delta on the three other sites — a named befitting
   motion-cohesion delta (the same class as the W11 `--spring-snappy` reconcile), not free.

2. **Resolve the stagger-vs-`balance` tension at the ROOT, not with a band-aid.** RESOLVED (no
   workaround): per-character stagger and `text-wrap: balance` are mutually exclusive by construction
   (the balancer needs a text run; per-char spans shred it). The SOTA resolution is word/line-granular
   stagger (CSS staggers `nth-child` spans at word granularity while the run wraps + balances) OR letting
   `balance` + a container-query/fluid width own wrapping — AND deleting the JS `width<768` break (a
   pre-CQ anti-pattern). Keeping the per-char split + bolting a `sr-only` mirror beside it would fix the
   a11y but LEAVE the `balance` defeat + the JS listener — half the finding. Trade-off: the stagger's
   granularity changes (char → word/line) — a befitting motion delta that RESTORES the balanced-rag
   treatment glass-ui pays for; the lift-down motion is preserved at the new granularity.

3. **Delete the JS `width<768` line-break — CSS owns wrapping.** RESOLVED (no-legacy): the
   `useWindowSize` watch swapping a pre-broken string (`AnimatedText.vue:45-55`,`:24`) is a JS media
   query driving a layout decision CSS now owns (`text-wrap: balance` + fluid/CQ width). It is REMOVED,
   not left beside the CSS path. Trade-off: removing the listener changes narrow-viewport wrap points —
   a befitting legibility delta + a perf/idiom win (one fewer reactive listener driving layout).

4. **The cross-band coupling is honored — F.W10/F.W12 scenes consume the promoted idiom.** RESOLVED
   (`F.md §The DAG`): F.W16 lands the canonical `progress-rail`/`progress-ball` idiom; F.W10's dogfood
   scene + F.W12's MotionPath scene (both new demo surfaces) consume it rather than re-authoring a fifth
   rail recipe. So F.W16's consolidation is not undone by the in-tranche new scenes. Trade-off: F.W16
   should land its idiom before/with F.W10/F.W12's scenes adopt it — a sequencing the DAG names; the
   idiom is the shared dependency.

5. **inv δ holds — no dock occlusion.** RESOLVED: the consolidated rail/ball + the hero layout changes
   respect `--dock-band-reserve` (the inv-δ "zero dock-over-content overlap" hard gate, `F.md §invariant
   set`). The hero is the start-screen overlay (`pointer-events-none`, above the dock band, not over it).
   Trade-off: none — the standing occlusion gate (clause 4) enforces it.
