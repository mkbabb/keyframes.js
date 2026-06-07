# Tranche H DEEP harden — lane `hd-w2`

**Charge:** substantive adversarial attack on **H.W2** (design language: `surface="cartoon"`
+ refined specular). Is the fix CORRECT + FEASIBLE? Does each gate BITE? Does it over-reach
into ALREADY-SOTA? Does any clause depend on a non-existent API? Is the architecture sound?

**Method:** read `waves/H.W2.md`, `H.md §H.W2`, `a-cartoon-shadow.md`, `a-glow-artifact.md`.
Cross-repo reality check against the INSTALLED `node_modules/@mkbabb/glass-ui` **3.4.0**
(verified `package.json:version 3.4.0`) — the Card dist (`CardFooter-C390imy7.js`), the
surface map, `cards.css` (`@utility cartoon-surface`), `glass-specular-track.css`,
`tokens.css`, `glass.css`, `utilities.css`, `dock.js`. Live demo driven via Playwright at
`http://localhost:5173/#/easing` (port 5173 confirmed live; 5174 dead).

---

## VERDICT

**The core gestalt move is FEASIBLE and CORRECT.** `<Card surface="cartoon">` EXISTS in the
installed glass-ui 3.4.0 and does EXACTLY what the wave claims: the surface map emits
`cartoon-surface` and OMITS `glass-specular-track` (no override, no `!important`,
no `display:none`). Every token the gate asserts resolves live. S1/S3/S4 are buildable.

But the wave carries **two FEASIBILITY defects** (one HIGH that breaks a gate's bite, one
MED that mis-scopes the work) and **three correctness/precision gaps** rooted in stale or
unverified audit claims. None is a BLOCKER — the API exists — but `proof:no-orphan-specular`
as written can GREEN while orphan radials still bloom on the easing/spring/bezier scenes,
and the wave's `plain`-Card hand-wave is factually wrong against the live DOM. Fix the gate
scope and the `plain` assumption and the wave is sound.

---

## FEASIBILITY CONFIRMATIONS (the API exists — the spine holds)

These are AFFIRMATIONS, not findings — the load-bearing cross-repo checks the prompt
demanded, all PASS:

- **`<Card surface="cartoon">` EXISTS.** `CardFooter-C390imy7.js:9` `surface:{default:"glass"}`;
  the class map at `:37` is literally
  `t.surface === "glass" && "glass-specular-track", t.surface === "cartoon" && "cartoon-surface"`.
  Flipping to `cartoon` DROPS the track AT SOURCE (the map stops emitting the class) and
  ADDS `cartoon-surface`. The §2.2 adjudication ("the radial dies because the surface map
  stops emitting the class, NOT via `!important`/`display:none`") is **literally true in the
  shipped dist.** No neutralizer needed; the radial-ban gate is satisfiable without a
  suppression hack. ✓
- **The demo Cards ARE glass-ui Cards.** All 4 panels import `Card` from `@mkbabb/glass-ui`
  (`AnimationControlsControls.vue:176`, `RibbonBar.vue:119`, `KeyframesEditor.vue:84`,
  `KeyframeTimeline.vue:147`) — the exact dist component verified. The flip is valid. ✓
- **`@utility cartoon-surface` EXISTS** (`cards.css:33-48`): `border-width:2px;
  box-shadow:var(--shadow-cartoon-md); translate:0;` + `:hover:not(:disabled)` →
  `translate:var(--lift-sm) var(--lift-sm); box-shadow:var(--shadow-cartoon-lg)`; transition
  `translate … --spring-bouncy, box-shadow … --ease-apple`. Matches the wave verbatim. ✓
- **Every gate token resolves LIVE.** Playwright probe: `var(--shadow-cartoon-md)` computes
  to `color(srgb 0.11 0.098 0.09 / 0.12) -4px 3px 1px 0px, …` — so
  `proof:cartoon-is-panel-depth` ("resolve `box-shadow: var(--shadow-cartoon-md)` at rest")
  CAN green. `--lift-sm:-1px` (`tokens.css:830`), `--spring-bouncy` (`:161`), `--ease-apple`
  (`:180`), `--shadow-cartoon-{sm,md,lg}` (`:543/546/549`) all present + dark-parity at
  `:1432-1433`. ✓
- **The `shadow-card` plate is ALSO surface-gated** (`CardFooter:37`
  `t.shadow && t.surface === "glass" && "shadow-card"`) — so flipping to cartoon ALSO drops
  the glass `shadow-card`, leaving `cartoon-surface`'s own offset stamp the sole plate. This
  REINFORCES the net-deletion thesis (the wave under-sells it). ✓
- **`@utility scale-on-hover` EXISTS + is byte-isomorphic** (`utilities.css:680-689`):
  `scale:1; transition: scale var(--duration-fast) var(--ease-standard); &:hover{scale:var(--scale-hover)}`.
  glass-ui `--scale-hover:1.08` (`tokens.css:1009`) === the demo's `1.08` fallback
  (`design-idioms.css:182`). S4 is a true zero-delta deletion; call-sites don't churn. ✓
- **The demo's `.scale-on-hover` "defined demo-NOWHERE until now" comment IS false**
  (`design-idioms.css:171`) — verified verbatim; glass-ui ships the identical recipe. The
  S4 framing-correction is warranted. ✓
- **`useSpecularPointer` needs NO non-existent glass-ui API.** The consumer seam is writing
  `--mouse-x`/`--mouse-y` (percentages) onto the host; `glass-specular-track.css:48-49` maps
  `--specular-x: var(--mouse-x,50%)`. That is plain `el.style.setProperty` — no glass-ui
  function dependency. F3 is buildable. ✓

---

## FINDINGS

### F1 — HIGH (FEASIBILITY / gate does NOT bite) — `proof:no-orphan-specular` is scoped to 4 panels, but the LIVE orphan tracks are mostly NOT those 4 panels; the gate can GREEN while the radial still blooms

**Location:** `H.W2.md §Hard gate` (`proof:no-orphan-specular`, `:50`); `H.md §H.W2 §Hard gate`
(`:340`); folds from `a-cartoon-shadow CS-1` / `a-glow-artifact F1`.

**Defect.** The gate asserts "ZERO `.glass-specular-track` **on the panel Cards**
(`AnimationControlsControls`, `RibbonBar`, `KeyframesEditor`, `KeyframeTimeline`)." But the
LIVE specular population is dominated by surfaces OUTSIDE that set. Playwright on `#/easing`:

```
totalSpecularTracks: 13   (fluctuates 5↔13 across route-storm re-renders)
  byTag: { button: 3+ (dock-icon-button ×9 across the app), div: Cards }
  dockButtonCount: 9       — every dock icon carries glass-specular-track
  pointerWired: 0
```

Of the 13, the dock icons (9) are explicitly HANDOFF (out of the gate's kf-owned scope —
fine). But the SCENE `<Card plain>` surfaces (`EasingSidebar.vue:14,35`,
`SpringSidebar.vue:4,60,81`, `TimingFunctionPanel.vue:17,74`) ALSO emit
`glass-specular-track` (see F2) and are NOT in the gate's 4-panel list. So after S1 flips the
4 named panels to cartoon, `proof:no-orphan-specular` GREENS — yet the easing/spring/bezier
scenes STILL render unwired, hover-blooming centered radials on their `plain` Cards. The gate
passes while the headline defect ("radial blur on hover EVERYWHERE") survives on exactly the
scenes (easing/spring) the audit measured it on. **The gate does not bite the full defect.**

The wave's own §Goal says "the panels become paper-and-glass again instead of glass-and-blur"
and the thesis (H.md:218) is "the radial appears EVERYWHERE (panels, header, timeline)" — but
the gate only polices 4 controls panels. The scene sidebars are the unpoliced gap.

**Evidence:** live probe (above); `grep '<Card plain'` over `demo/**.vue` → 7 sites; live
`[data-slot="card"]` on `#/easing` all carry `data-surface="glass"` + `glass-specular-track`
even when authored `<Card plain>` (F2 root-causes WHY).

**Concrete doc edit.** In `H.W2.md §Hard gate · proof:no-orphan-specular` change the scope
from the 4 named panels to **"every kf-owned `<Card>` in the demo that is not a deliberately
pointer-wired glass surface"**, and add the explicit instrument: *"the assertion enumerates
ALL `[data-slot=card]` in the built demo across the controls scene AND the easing/spring/
bezier scenes; each either (a) carries `cartoon-surface` and no `glass-specular-track`, or
(b) carries a `--mouse-x` writer (S3). Dock-icon buttons are excluded (HANDOFF, policed by
`proof:specular-handoff`)."* Also add a clause to **S1** (or a new S1b) naming the scene
`plain` Cards as in-scope for the surface decision, cross-referencing F2.

---

### F2 — HIGH (FEASIBILITY / false premise) — `<Card plain>` is a NO-OP attribute; it does NOT suppress the specular, contradicting S2 and `a-cartoon-shadow §4.2`

**Location:** `H.W2.md §Scope S2` (`:37`, "`plain` cards likely already suppress the surface");
`a-cartoon-shadow.md:243-245` ("`plain` likely already suppresses surface"); `H.md §H.W2 §state`
(implicitly assumes only `surface="glass"` defaults emit the track).

**Defect.** glass-ui's `Card` declares EXACTLY these props (`CardFooter-C390imy7.js:7-26`):
`tier, surface, shadow, grain, class, asChild, as`. **There is NO `plain` prop.** A
`<Card plain>` passes `plain` as an unknown attribute; reka-ui's `Primitive` does not consume
it, `surface` stays at its `"glass"` default, and the surface map at `:37` emits
`glass-specular-track` + `shadow-card` regardless. So `plain` suppresses NOTHING.

**Live confirmation (definitive):** on `#/easing`, every `[data-slot="card"]` — including the
ones authored `<Card plain>` in `EasingSidebar` — reports `data-surface:"glass"`,
`hasSpecular:true`, AND `plainAttr:false` (the attribute isn't even on the DOM — Vue/reka
drops the unknown boolean). The wave's and the audit's "plain likely already suppresses the
surface" is FALSE; these `plain` Cards are the unpoliced orphan tracks of F1.

This also means S2's "RECORD any `plain` Card that still emits the track as a follow-on" is
backwards — they ALL still emit it; it is not an edge-case to record but the rule.

**Concrete doc edit.** Rewrite `H.W2.md §Scope S2`: *"`<Card plain>` is a NO-OP attribute —
glass-ui's Card has no `plain` prop (`CardFooter-C390imy7.js:7-26`), so `plain` Cards default
to `surface=\"glass\"` and DO emit `glass-specular-track` (verified live: every `plain` Card on
`#/easing` reports `data-surface=glass`, `hasSpecular=true`). Therefore the scene `plain` Cards
(`EasingSidebar.vue:14,35`, `SpringSidebar.vue:4,60,81`, `TimingFunctionPanel.vue:17,74`) MUST
get an explicit surface decision: flip to `surface=\"cartoon\"` (the panel register) OR retain
`surface=\"glass\"` WITH `useSpecularPointer` (S3). The `plain` attribute is then deletable as
dead markup."* Strike "plain likely already suppresses the surface" from `a-cartoon-shadow §4.2`
provenance and add a one-line errata note in §Provenance.

---

### F3 — MED (correctness / stale live anchor) — the "13 specular tracks" count is unstable and the easing scene shows 5; cite the count as route-storm-dependent, not a fixed gate target

**Location:** `H.W2.md §state` (`:19`, "LIVE: 13 specular tracks"); `a-cartoon-shadow.md:139`
(`specularTrackCount: 13`); `a-glow-artifact.md:26` ("7 live elements").

**Defect.** The audit lanes disagree with each other (a-glow-artifact says **7**,
a-cartoon-shadow + the wave say **13**) and BOTH disagree with the current live tree, which
oscillates: my first probe on `#/easing` measured **5** total tracks; a second probe seconds
later measured **13**. The fluctuation is the live autonomous route storm (H.W1's D12) re-
mounting scenes underneath the measurement — which is EXACTLY why the wave correctly sequences
H.W2 after H.W0+H.W1 (the §DAG-deps note "the hover-screenshot lock needs a stable scene" is
vindicated). But citing "13" as if it were a stable, reproducible count is an inv-ε hazard: a
reviewer re-running the probe pre-H.W1 will see a different number and may distrust the lane.

**Evidence:** two consecutive Playwright probes on the same URL → `totalTracks: 5` then `13`;
a-glow-artifact independently measured `7`. The count is scene-state-dependent.

**Concrete doc edit.** In `H.W2.md §state` change "LIVE: 13 specular tracks" to *"LIVE:
**5–13** specular tracks (count oscillates with the H.W1 route storm — measured 5 and 13 on
`#/easing` seconds apart, a-glow-artifact measured 7; the COUNT is unstable, the INVARIANT
(`anyPointerWrite:false` on every track) is stable). The gate asserts the invariant (zero
unwired tracks on kf-owned Cards), NOT a fixed count; re-measure after H.W1 stabilizes the
scene."* This also strengthens the gate (an exact-count assertion would be flaky).

---

### F4 — MED (correctness / the dock-wiring premise is source-true but live-misleading) — the dock specular is UNWIRED at rest; "the dock proves it works" holds only DURING pointermove

**Location:** `H.W2.md §state` (`:20`, "The Card NEVER wires the pointer; the dock DOES");
`H.W2.md §S5(ii)` (`:43`, "the dock DOES wire `--mouse-*`, so this is a tuning/intensity ask");
`a-glow-artifact.md:57-58,104-106` ("the dock proves it"); `a-cartoon-shadow.md:130`.

**Defect (nuance, not contradiction).** The source claim is TRUE: `dock.js` has a pointermove
handler `a(e)` that writes `{"--mouse-x":`${r.toFixed(2)}%`,"--mouse-y":…}` from
`e.currentTarget.getBoundingClientRect()` (verified by extracting the minified region). BUT at
REST (no pointer over the dock) the dock icons fall to the same `var(--mouse-x,50%)` centered
floor as the Cards — my static Playwright probe of all 9 `dock-icon-button`s returned
`--mouse-x: (unset)` and `glass-specular-track: true`. So the live dock ALSO shows a centered
bloom at rest; the difference from the Card is only that the dock RECOVERS to a travelling
light on hover, whereas the Card never can. The audit's "the dock proves it works" is true
only of the during-hover state; a skeptic re-probing at rest will see the dock blooming too
and may wrongly conclude the wire is missing there as well.

This does not break the S5 HANDOFF (a tuning/intensity ask is still correct — the wire is
present), but the wave should state the wire is `@pointermove`-bound (compiled as an event
prop, NOT `addEventListener` — a grep for `"pointermove"` in `dock.js` returns nothing, which
could be mis-read as "no wiring"; the handler is the Vue-compiled `a(e)`).

**Evidence:** `dock.js` region around `mouse-x` (the `a(e)` handler reading `currentTarget`
rect); live probe of 9 dock icons → all `--mouse-x` unset at rest; `grep pointermove dock.js`
→ 0 (it's an event-prop binding, not a string-literal listener).

**Concrete doc edit.** In `H.W2.md §state` line 20 append: *"(the dock wires `--mouse-*` via a
`@pointermove`-bound handler — `dock.js` `a(e)` reads `currentTarget.getBoundingClientRect()`;
note a `grep pointermove dock.js` returns 0 because it is a Vue event-prop, not an
`addEventListener`. The wire is active only DURING pointermove; at REST the dock icons fall to
the same centered floor — so the dock's catch-light is correct on engagement, blooming at
rest, which is why S5(ii) is a tuning/intensity ask, not a missing-wire ask)."* Soften
`a-glow-artifact`'s "the dock proves it" to "the dock proves it ON HOVER."

---

### F5 — LOW (correctness / unnamed behavioral delta) — deleting the manual `.glass-card` drops a `:has(:focus-visible)` focus-elevation the `cartoon-surface` register does NOT replicate

**Location:** `H.W2.md §S1/S2` (`:35`, delete `.glass-card`); `a-cartoon-shadow.md:164-168`
(treats `.glass-card` as "a separate static plate, no hover lift, no transition").

**Defect.** The wave and a-cartoon-shadow characterize `.glass-card` as purely a static
background+shadow plate. But the INSTALLED `glass.css:175-200` shows `.glass-card` ALSO carries
a keyboard-focus-elevation rung: `.glass-card:has(:focus-visible) { --card-focus-shadow:
var(--shadow-md); --card-focus-border: var(--glass-border-floating); }` (a `:has()`-driven
elevate-on-descendant-focus, with a `@supports not selector(:has(*))` class fallback). The
`cartoon-surface` utility (`cards.css:33-48`) has NO `:focus-visible`/`:has` rule — only
`:hover` lift. So deleting `.glass-card` in the S1 swap silently DROPS the keyboard-focus
elevation on the 4 panels. This is a real (small) accessibility/affordance delta the wave does
not name, and the spine requires named deltas to be NAMED.

**Evidence:** `glass.css:197-200` (`:has(:focus-visible)` rung + `:428` the
`.glass-card.is-focus-within` fallback); `cards.css:33-48` (cartoon-surface has no focus rule).

**Concrete doc edit.** Add to `H.W2.md §Design decisions`: *"NAMED DELTA — deleting the manual
`.glass-card` drops its `:has(:focus-visible)` focus-elevation rung (`glass.css:197`), which
`cartoon-surface` does not replicate. Accepted: the panels are containers of focusable controls
that carry their OWN focus rings; the card-level focus-elevation was a quiet bonus, not a
contract. If a panel demonstrably needs it, retain `surface=\"cartoon\"` + add `scale-on-hover`-
style focus handling per the glass-ui idiom rather than re-adding `.glass-card` (no legacy beside
its replacement)."* Alternatively, RECORD it as a born-RED follow-on if the focus elevation is
deemed load-bearing.

---

### F6 — LOW (correctness / unnamed delta) — S4 deletes a `prefers-reduced-motion` block that glass-ui's `@utility scale-on-hover` does NOT carry

**Location:** `H.W2.md §S4` (`:41`, "DELETE the `.scale-on-hover` block (and its PRM block)").

**Defect.** The wave says delete the demo's `.scale-on-hover` PRM block (`design-idioms.css:184-188`,
`@media (prefers-reduced-motion: reduce){ .scale-on-hover { transition: none } }`) and consume
glass-ui's `@utility`. But the installed glass-ui `@utility scale-on-hover` (`utilities.css:680-689`)
has NO inline PRM `transition:none` guard. So the deletion removes a reduced-motion guard with
no glass-ui replacement at that utility. The transform itself (`scale`) still applies on hover;
under PRM the demo loses only the "instant, no-transition" behavior — a minor delta, but the
wave asserts "zero call-site churn" and implies behavioral parity, which is not exactly true
for PRM users. (glass-ui MAY have a global PRM bracket elsewhere; I did not find one covering
`.scale-on-hover` specifically.)

**Evidence:** `utilities.css:680-689` (no PRM block); `design-idioms.css:184-188` (the demo PRM
block being deleted).

**Concrete doc edit.** In `H.W2.md §S4` append: *"NOTE: glass-ui's `@utility scale-on-hover`
(`utilities.css:680`) carries no inline `prefers-reduced-motion` guard, so deleting the demo's
PRM block (`design-idioms.css:184`) is a small behavioral delta for PRM users (the hover scale
still applies; only the 'no-transition' shortcut is lost). Verify glass-ui has no global PRM
bracket covering it; if not, either keep ONLY the PRM `@media` block (deleting just the base +
`:hover` rules that duplicate the `@utility`) or HANDOFF a PRM guard to glass-ui."*

---

## OVER-REACH / ALREADY-SOTA CHECK (the inverse failure)

No over-reach found. The wave is disciplined here, and its RECORD fences are CORRECT:

- **G3 (specular is GPU-cheap + SOTA, defect is perceptual not perf) — VERIFIED SOUND.**
  `glass-specular-track.css` confirms the SOTA build the wave credits: drives intensity via
  layer `opacity` not a per-stop `calc()` (`:56-62` documents the Chromium `calc()`-in-gradient-
  alpha drop-to-0 trap and avoids it), typed `@property` smoothing (`:81-88`), a mandatory
  `prefers-reduced-motion` static pin (`:117-123`), and a `prefers-reduced-transparency` drop
  (`:129-133`). The wave correctly does NOT claim a perf win from removing it. ✓
- **CS-4 / A10 (the `.progress-dot` glow is a RED HERRING — do NOT touch) — CORRECT.** The wave
  fences `design-idioms.css:263-269` off as the benign active-playing affordance; not re-checked
  in depth but the wave's instinct to not chase it is right and well-anchored across 7 lanes.
- **`CSSCodeEditor.vue:6` left alone** (`'cartoon-surface'` confirmed live, `cartoonCount:1`) —
  the wave correctly treats it as the proof-of-register, not a site to change. ✓
- **The cartoon system is fully upstream** — the wave authors ZERO new CSS; every token + the
  utility ship in 3.4.0. inv-16 honored. ✓

---

## ARCHITECTURE SOUNDNESS

The gate REGIME is sound in shape (born-RED-today, GREEN-on-fix, no vacuous pass), and the
`proof:specular-handoff` born-RED pairing correctly implements the chronic-closure discipline
(a HANDOFF cannot be re-papered as a bare tag). The ONLY architectural gap is the gate SCOPE
(F1) — the policed surface set is narrower than the defect's actual footprint. Fix F1+F2 and
the regime bites the whole defect. No clause depends on a non-existent API.
</content>
</invoke>
