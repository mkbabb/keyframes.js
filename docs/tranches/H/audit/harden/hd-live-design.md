# Tranche H DEEP harden — lane `hd-live-design`

**Charge:** LIVE re-verify the design-language defects (D2/D14). Hover panels/header/
timeline across routes; capture the radial-blur specular (read the computed `::before`,
confirm 0 pointer-wired → static centered bloom); screenshot the hover; confirm the
cartoon-surface is on exactly 1 site; confirm the D2/D14 anchors.

**Method:** drove the running demo (`localhost:5173`, kf 4.1.0 + Tranche G — the pre-H
state) via Playwright MCP at a 1440×900 viewport, dpr=1. Probed the `glass-specular-track`
host set + every `::before` computed style on `#/easing`; performed a REAL `:hover`
(Playwright `page.hover`) on the controls panel Card and re-read the `::before` mid-hover;
screenshotted rest + hover; read the live `<h1>` hero + `.dot-fade` typing dots on the
home/cube screen; grepped `demo/` source (excluding `dist/` bundles) for `cartoon-surface`
/ `surface=` / `glass-card` / `glass-specular` / `--mouse-*`; cross-checked the glass-ui
3.4.0 source (`glass-specular-track.css`, `cards.css`) for every load-bearing rule.

**Verdict:** The D2/D14 root cause is **CONFIRMED LIVE, exactly as the audit root-causes it**
— `surface="glass"` is the live Card default (`data-surface="glass"` on every panel Card),
`glass-specular-track` is bolted on with **zero pointer wiring**, the `::before` paints a
**dead-centered, screen-blended white radial that blooms 0.35→0.6 on hover** with
`--specular-x` pinned at **50% even while genuinely hovered**, and `cartoon-surface` lives
on **exactly 1 demo source site** (`CSSCodeEditor.vue:6`). The `surface="cartoon"` thesis
is sound. The substantive findings below are NOT a refutation of the thesis — they are
(1) a **scope gap the wave's own gate would red against** (a 5th panel `<Card>` carrying the
manual `.glass-card` plate that H.W2 never enumerates), (2) the gate's **fixed live counts
are unreproducible** (I measured 5 tracks where the lanes claim 7/13), (3) the **route storm
actively poisons the visual-lock gate** the wave depends on, and a couple of LOW/NIT items.
Where `hd-design-redteam` already covered the cartoon-vs-specular composite (HD-1/HD-2) and
the div-stage fork (HD-4), I do not re-litigate — I add the LIVE corroboration and the
new source-scope gap they missed.

---

## LIVE EVIDENCE LEDGER (every D2/D14 anchor, re-verified)

All on `localhost:5173`, `#/easing`, 1440×900, dpr=1, light mode.

### E1 — the specular host set + 0 pointer-wired (the D2 root, LIVE)
`document.querySelectorAll('.glass-specular-track')` → **5 hosts**: 2 panel Cards
(`glass-resting glass-specular-track`) + 3 `dock-icon-button`s. Every host:
`anyPointerWrite: false` (NO `--mouse-x`/`--mouse-y` set, inline or computed),
`::before` `--specular-x: 50%`, `opacity: 0.35`, `mix-blend-mode: screen`, and
`background-image` computes `radial-gradient(circle, rgba(255,255,255,.55) 0%,
rgba(255,255,255,.22) 22%, rgba(…,0) …)` — note the **collapsed `circle` with NO
`at <x> <y>`**, the live signature of the centered floor (50%/50% = the default center,
so the engine drops the `at` clause). PASS — D2 confirmed.

### E2 — glass IS preserved on the panel (the D14 "glass is good", LIVE)
First panel Card resting state: `backdrop-filter: blur(12px) saturate(1.05)` (glass present),
`border-width: 1px`, `box-shadow` = four transparent zeros (NO cartoon offset). `--shadow-
cartoon-md` resolves (`-4px 3px 1px color-mix(…12%…)`) but the card uses `--shadow-card`
(`0 4px 16px …8%…`) — the static plate, not the cartoon stamp. `hasCartoonSurfaceClass:
false`. PASS — confirms both "glass is good" (it is real, present) AND "cartoon dropped on
panels" (the panel carries `shadow-card`, not `cartoon-surface`).

### E3 — the hover bloom is centered, NOT tracked (the D14 "broken radial", LIVE)
Performed a REAL Playwright `:hover` on the controls panel Card (route held at
`#/easing?anim=Easing+Preview`), then re-read `::before`:
```
matchesHover:          true
data-surface:          "glass"
hoverBeforeOpacity:    0.6           ← bloomed from 0.35 (the hover lift fires)
hoverSpecularIntensity:0.6
hoverSpecularX:        50%           ← STILL CENTERED while genuinely hovered
hoverBg:               radial-gradient(circle, …)   ← no `at <x> <y>`
mouseXOnHost:          (none)        ← the host never receives a pointer write
```
This is the smoking gun: a true hover blooms the radial 0.35→0.6 but it does NOT move to
the cursor — it stays dead-centered because the Card never wires `--mouse-x`. Exactly the
audit's "static, dead-centered, screen-blended white radial that blooms on hover."
Screenshots saved: `hd-live-design-easing-rest.png`, `hd-live-design-easing-hover.png`
(the route drifted to `#/cube` for the rest shot — see F-LIVE-2; the hover shot caught the
home popover open, D9, a sibling lane).

### E4 — cartoon-surface = exactly 1 demo site (the C.W2 proof, confirmed)
`grep -rn cartoon-surface demo/ --include=*.{vue,ts,css}` (excluding `dist/`) →
**1 hit**: `CSSCodeEditor.vue:6` (`border ? 'cartoon-surface' : ''`). Confirms the
"survives only on the C.W2 site" claim. `surface=` prop in demo source = **0 hits**
(all Cards default to `glass`). `glass-specular`/`--mouse-*`/`useSpecular` authored in
demo = **0** (the demo never wires the seam). All three PASS.

### E5 — D7 φ-hero anchor (LIVE)
Home `<h1 class="text-display-4">` computes `font-size: 86.112px`, `line-height: 94.72px`,
Instrument Serif. `--type-display-4 = clamp(3.33rem, 2.5rem + 4vw, 5.382rem)`;
`--type-display-mega = clamp(5.382rem, 4rem + 9vw, 11.089rem)` EXISTS (the DL-4/H.W4
target). Confirms the hero is exactly one φ-rung below mega. PASS.

### E6 — D6 typing-dots anchor (LIVE)
Exactly **1** `.dot-fade` element, `textContent === "..."`, `animation-delay: 0s`,
`animation-name: dotFade-…`, `opacity: 0.974` (sampled mid-cycle) — the whole ellipsis
blinks as ONE unit, the word-split collapse. PASS — DL-6 confirmed.

---

## FINDING HD-LIVE-1 (HIGH) — H.W2 S1 misses a 5th panel `<Card class="…glass-card">`; the wave's own `proof:no-dup-utility` gate reds even after a faithful S1

**Location:** `H.md` §H.W2 S1 + the `proof:no-dup-utility` gate clause
(`grep -rn "glass-card" demo/ | grep "<Card"` = 0); `_SYNTHESIS-design-language §2 W1`
("Apply at … `AnimationControlsControls.vue:3`, `RibbonBar.vue:3`, plus the
`KeyframesEditor`/`KeyframeTimeline` Cards").

**The defect (LIVE-grepped, deterministic).** H.W2 S1 and the synthesis both enumerate
**exactly four** panel `<Card>`s carrying the manual `.glass-card` plate to flip to
`surface="cartoon"`. But `grep -rn "glass-card" demo/ --include="*.vue" | grep "<Card"`
(excluding `dist/`) returns **FIVE**:

```
AnimationControlsControls.vue:3   <Card class="… transition-shadow duration-normal glass-card">
RibbonBar.vue:3                   <Card class="overflow-visible glass-card">
KeyframesEditor.vue:3             <Card class="glass-card p-0 m-0">
KeyframeTimeline.vue:3            <Card :class="['… glass-card transition-shadow …', …]">
AssetViewport.vue:12              <Card class="pointer-events-auto glass-card max-w-sm mx-6">   ← NEVER mentioned
```

`AssetViewport.vue:12` (the playground empty-state "Compose a scene" card) is a panel
`<Card>` with the manual `.glass-card` plate, identical in kind to the four S1 names. The
string `AssetViewport` appears **nowhere** in `docs/tranches/H/` (grep empty). This is not
HD-4's div-stage fork — it is a genuine `<Card>` the wave's enumeration drops.

**Why this is HIGH, not a nit.** The H.W2 gate `proof:no-dup-utility` asserts
`grep "<Card" | grep glass-card = 0` *after the swap*. With S1 flipping only 4 of the 5
`<Card glass-card>` sites, the gate **reds against a faithful S1 implementation** — forcing
the implementer to EITHER silently extend scope (undocumented, violates the spec's "the
fix is exactly these 4 sites" framing) OR ship a red gate (chronic re-paper). Either way
the wave is not implementable as written: its source set and its gate set disagree. And
because `AssetViewport` is only mounted on the playground route (not `#/easing`), a
live-count gate would also miss it — exactly the route-dependence HD-3 flags, here biting a
real surface.

**The CONCRETE doc edit.** (a) Add `AssetViewport.vue:12` to the H.W2 S1 enumeration as a
5th panel Card to flip to `surface="cartoon"` (it is the same kind of edit — drop the manual
`.glass-card`, let the Card tier own the plate). If the playground empty-state deliberately
wants the quiet static plate rather than cartoon depth, state that as a NAMED delta and
EXCLUDE it from the `proof:no-dup-utility` grep explicitly (an enumerated exception), so the
gate's `= 0` target is honest. (b) Re-phrase the gate target from "= 0" to "= (the
enumerated intentional-static set)", matching HD-3's de-magic recommendation. Without one of
these, S1 and its gate cannot both be satisfied.

---

## FINDING HD-LIVE-2 (HIGH) — the route storm poisons H.W2's visual-lock gate; the DAG-dep on H.W1 is correctly stated but the gate itself is not storm-hardened

**Location:** `H.md` §H.W2 DAG-deps ("sequenced AFTER H.W0+H.W1 … the hover-screenshot lock
needs a stable scene") + the `proof:no-orphan-specular` "hover-bloom screenshot diff on the
controls panel" clause.

**The defect (observed LIVE, repeatedly).** The route storm (D12) fired **autonomously
during my measurement** at least three times: a `getComputedStyle` read on `#/easing` threw
"Execution context was destroyed … navigation" as the route walked to `#/cube`; a screenshot
taken AT `#/easing` rendered the **cube scene** because the hash drifted to
`#/cube?anim=Rotations` mid-capture; and a `goto('#/')` landed on `#/cube` (the home↔cube
alias). The console accrued **18 `next() is deprecated` warnings** + a content-visibility
verbose flood in a ~90-second session. The `data-hd-probe` attribute I set on a card was
**wiped by a Suspense remount** between two tool calls (the orphaned-rAF unmount/remount
churn, H.W1 §state).

H.W2 correctly DAG-deps on H.W1 ("the route storm poisons the visual measurement"). The gap
is that the **visual-lock gate itself is not storm-hardened**: `proof:no-orphan-specular`'s
"hover-screenshot diff on the controls panel" will be **flaky on the live tree** (the
screenshot can capture the wrong scene) and **non-falsifiable as a born-RED baseline** (you
cannot reliably reproduce "the controls panel" because the route walks off it). A reviewer
re-running the born-RED check today gets a different scene each time.

**The CONCRETE doc edit.** Add to H.W2 §gate an explicit ordering + stabilization clause:
"the `proof:no-orphan-specular` hover-screenshot lock runs ONLY after `proof:no-route-storm`
(H.W1) is GREEN — assert the resting hash is unchanged across the screenshot pair, and
abort/retry the visual diff if a navigation fires mid-capture." This makes the H.W1→H.W2
dependency a HARD gate ordering, not just prose, and stops the storm from producing a
false-green or flaky visual lock. (The computed-`::before` assertions in E1/E3 are
storm-robust — they read a per-surface property regardless of route — so the gate should
lean on the COMPUTED `--specular-x`/`opacity` assertion as primary and the screenshot as a
secondary human-confirm, not the reverse.)

---

## FINDING HD-LIVE-3 (MED) — the gate's fixed live counts ("13 orphan tracks today") do not reproduce; I measured 5

**Location:** `H.md` §H.W2 gate ("RED: 13 orphan tracks today"), §state ("LIVE: 13 specular
tracks"); `_SYNTHESIS-design-language §4` ("reds today on all ~12 live hosts" /
"~12 live hosts"); `a-cartoon-shadow §state` ("specularTrackCount: 13"); `a-glow-artifact`
("7 live elements").

**The defect (LIVE).** The lanes' own numbers already disagree: glow-artifact = **7**,
cartoon-shadow = **13**, the synthesis = **~12 / "13 hosts"**, the H.W2 gate text = **13**.
I measured **5** on `#/easing` at 1440px just now (`specularTrackCount: 5` = 2 panel Cards +
3 dock buttons). The count is route- and state-dependent: how many scene panels are mounted,
whether the dock is expanded (each dock icon button carries the track), and which scene is
active all move it. This duplicates HD-3's finding (`hd-design-redteam.md`), and I confirm it
independently with a third distinct number — which is itself the point: a gate baselined on a
live count is not re-runnable.

**The CONCRETE doc edit.** As HD-3 recommends: replace the fixed count with a SOURCE/PROP
invariant. `proof:no-orphan-specular` = "every `<Card>` in `demo/` source resolves
`surface='cartoon'` (or an enumerated S2 composite/intentional-glass exception); no
`<Card>` carries the manual `.glass-card` utility (grep = the enumerated exception set)."
`proof:cartoon-is-panel-depth` = "every enumerated panel Card resolves `box-shadow` from
`--shadow-cartoon-md` at rest" — count = the source panel-Card count, not a magic ≥4 or
=13. Move the "5/7/13" live numbers to an illustrative footnote.

---

## FINDING HD-LIVE-4 (MED) — `proof:cartoon-is-panel-depth` asserts the resting `--shadow-cartoon-md` but NOT the hover-lift composite-axis claim; the G2 perf win is unproven by the gate as written

**Location:** `H.md` §H.W2 gate (`proof:cartoon-is-panel-depth` — "resolves
`box-shadow: var(--shadow-cartoon-md)` at rest, growing to `--shadow-cartoon-lg` on
`:hover`"); §design-decision (5) (the G2 claim: "cartoon animates the cheap `translate`
axis, not `box-shadow` over a backdrop"); `_SYNTHESIS-design-language §4 lock 3`
(`proof:hover-composite` — "the hover delta is a shadow/translate change, not a
`box-shadow`-blur or `backdrop-filter` repaint").

**The defect.** The wave's stated PERF justification for the cartoon swap (G2:
"`transition-shadow` over a blurred card → per-frame paint; cartoon animates the cheap
`translate` axis") is load-bearing for the "fixes the per-frame-paint anti-pattern" claim.
But the gate `proof:cartoon-is-panel-depth` only asserts the resting AND hover `box-shadow`
TOKENS resolve — it does NOT assert the hover transition is composite-cheap. In fact the
glass-ui `cartoon-surface` `:hover` (`cards.css:44-47`) transitions BOTH `translate`
(compositor) AND `box-shadow` (paint) — so the cartoon hover STILL animates `box-shadow`
(over the same blurred backdrop), just with a smaller delta + a spring curve. The "cheap
axis only" framing is imprecise: cartoon adds a cheap `translate` lift but does not remove
the `box-shadow` paint. The synthesis names `proof:hover-composite` as the gate for this but
H.W2 folds it into `proof:no-orphan-specular`'s screenshot (HD-LIVE-2: flaky) and never
asserts the actual paint cost.

**The CONCRETE doc edit.** Either (a) demote the G2 "fixes the per-frame paint" claim to "the
cartoon swap REDUCES the per-frame paint (smaller `box-shadow` delta + a compositor-cheap
`translate`), measured @dpr=2 before claiming a win" (MEASURE-FIRST, inv ε) — since
`cards.css:44-47` proves `box-shadow` is still in the cartoon hover transition; or (b) add a
real `proof:hover-composite` clause that records a paint/composite trace (or asserts the
hover delta's `box-shadow` magnitude is bounded) at dpr=2, not just that the tokens resolve.
As written, the gate cannot catch a regression where the cartoon hover still paints a large
shadow over the backdrop.

---

## FINDING HD-LIVE-5 (MED) — the `useSpecularPointer` composable (S3) is never applied to ANY surface in the spec; D14's "refined specular WHERE kept" has no concrete kf host

**Location:** `H.md` §H.W2 S3 ("Applied ONLY to surfaces that legitimately keep
`surface='glass'` … interactive scene targets, D11/H.W5"); §design-decision (2) ("the
radial is … KEPT where the demo deliberately wants the iOS catch-light").

**The defect (LIVE-grounded).** S3 authors `useSpecularPointer` but defers WHICH surface
keeps `surface="glass"` to "interactive scene targets, D11/H.W5" — and the live grep shows
the scene targets are bare `<div class="glass-card">` (E4 / HD-4), NOT `<Card surface=>`
hosts, so they carry NO specular track to wire. After S1 flips all 4 (5, per HD-LIVE-1)
panel Cards to cartoon, and the scene targets are divs with no track, the live result is:
**zero `<Card>` retains `surface="glass"`**, so `useSpecularPointer` has **no host to attach
to**. The "refined specular where kept" deliverable (D14's explicit ask: "a refined specular
hover, not deleted") then ships applied to nothing — the BOOK escape hatch HD-6 flags,
reached by construction rather than by an explicit descope decision.

This converges with `hd-design-redteam` HD-1 (the composite surface) and HD-6 (the BOOK
escape) from the LIVE side: I confirm there is no `<Card>` left to host a kept-and-wired
specular once S1 lands, so unless H.W2 names a concrete composite host (HD-1's
`.cartoon-specular` co-application), the "refined" half of D14 has no anchor.

**The CONCRETE doc edit.** H.W2 S3 must NAME the concrete host(s) that keep a (wired,
calmed) specular — and per `hd-design-redteam` HD-1, because `<Card surface>` emits cartoon
XOR specular, that host needs the co-applied `cartoon-surface glass-specular-track` classes
+ the `useSpecularPointer` wire, not a `surface=` prop. Add the named host to the spec (e.g.
the stage-adjacent panel the user "likes"), or explicitly state D14's specular-refinement
ships on a demo `.cartoon-specular` recipe — so the composable has a live attachment point
and D14 cannot close with the refined specular applied to zero surfaces.

---

## FINDING HD-LIVE-6 (LOW) — the `RibbonBar`/playback panel ALSO double-stacks specular + manual `.glass-card`; the live `data-` attributes confirm a 3-layer stack the spec under-describes

**Location:** `H.md` §H.W2 §state ("The double-plate redundancy … `RibbonBar.vue:3`").

**The defect (LIVE).** A Playwright strict-mode error surfaced the exact live DOM of the
playback ribbon panel:
`<div data-slot="card" data-tier="resting" data-surface="glass" class="rounded-card …
glass-resting glass-specular-track shadow-card overflow-visible glass-card">`. This panel
stacks **FOUR** decorations live: (1) the Card's `glass-resting` tier (blur), (2)
`glass-specular-track` (the radial), (3) `shadow-card` (the Card's own static plate, emitted
by `CardFooter:37` on `surface="glass"`), AND (4) the manual `.glass-card` utility
(`glass.css:175` — its OWN `--glass-bg-quiet` bg + `--shadow-card` plate). So the double-plate
is really a **shadow-card-from-the-Card-tier + glass-card-from-the-manual-utility** double,
plus the radial. H.W2 §state describes the double-plate but does not note that the Card's
own `shadow-card` (auto-emitted on `surface="glass"`) is the THIRD plate that also vanishes
on the cartoon flip (`CardFooter:37` only emits `shadow-card` when `surface==="glass"`).

**The CONCRETE doc edit.** Add one sentence to H.W2 §state: "the `surface='glass'` default
ALSO auto-emits `shadow-card` (`CardFooter:37`), so the cartoon flip drops BOTH the manual
`.glass-card` plate AND the Card's auto `shadow-card` — the cartoon offset-stamp replaces
two static plates, not one." This sharpens the net-deletion claim (correct in spirit) and
prevents an implementer from being surprised that `shadow-card` disappears too.

---

## FINDING HD-LIVE-7 (NIT) — the audit's "55% radius / 75% mask feather reads as a blur" is the perceptual root, but the LIVE computed `::before` shows the gradient collapses `at 50% 50%` → `circle`; cite the collapsed form so the gate's regex is correct

**Location:** `a-design-language §1` (the cited `::before` background string with
`circle at var(--specular-x,50%) …`); `H.md` §H.W2 §state (same).

**The defect (cosmetic, but gate-relevant).** The audit cites the SOURCE form
`radial-gradient(circle at var(--specular-x,50%) var(--specular-y,50%), …)`. The LIVE
COMPUTED form (E1/E3) is `radial-gradient(circle, rgba(255,255,255,.55) 0%, …)` — the
browser collapses `at 50% 50%` (the default center) to a bare `circle`, AND substitutes the
`hsl(40 30% 100% / .55)` to `rgba(255,255,255,.55)`. A `proof:no-orphan-specular` assertion
that greps the computed `background-image` for the literal `circle at` string (to detect a
tracked vs centered radial) would FALSE-PASS today (the `at` is absent because centered) and
FALSE-FAIL on a correctly-tracked surface (where `at 70% 30%` IS present). The correct
falsifiable test is: centered/broken ⇒ computed bg matches `/radial-gradient\(circle,/`
(no `at`); tracked/fixed ⇒ matches `/circle at (?!50% 50%)/`.

**The CONCRETE doc edit.** In the `proof:no-orphan-specular` "computes `circle at <x> <y>`
(not the centered 50% floor)" clause, note that the centered floor renders as a BARE
`circle` (no `at` clause) in the computed value, and the tracked state renders `circle at
<x≠50%> <y≠50%>` — so the assertion is "computed `::before` background is bare `circle`
(centered/broken) RED vs `circle at <non-50%>` (tracked) GREEN," not a search for a literal
`circle at` substring. One sentence; makes the gate's pixel/computed assertion actually
falsifiable against the live computed form.

---

## Soundness summary (the adversarial bottom line for the live design lane)

- **D2 root cause:** CONFIRMED LIVE. `data-surface="glass"` default + `glass-specular-track`
  + `anyPointerWrite:false` + `--specular-x:50%` even mid-hover + `opacity 0.35→0.6` bloom.
  The audit root-causes it exactly right.
- **D14 "glass is good":** CONFIRMED LIVE — `backdrop-filter: blur(12px) saturate(1.05)` is
  real and present on the panel; the defect is the centered, untracked, hot radial, not the
  glass. The `surface="cartoon"` thesis (glass preserved under cartoon) is sound.
- **cartoon = 1 site:** CONFIRMED (`CSSCodeEditor.vue:6` only). `surface=`/specular-author =
  0. The C.W2 close is the genuine single proof.
- **The real defects this lane adds:** (HD-LIVE-1, HIGH) S1's 4-site enumeration misses the
  5th `<Card glass-card>` (`AssetViewport.vue:12`), so the wave's own `proof:no-dup-utility`
  reds against a faithful S1; (HD-LIVE-2, HIGH) the route storm actively poisons the
  visual-lock gate — the H1→H2 dependency must be a hard gate-ordering, and the gate should
  lean on the storm-robust computed-`::before` assertion, not the flaky screenshot;
  (HD-LIVE-3/4/5, MED) the live counts don't reproduce (5 vs 7/13), the G2 perf win is
  unproven (cartoon STILL transitions `box-shadow`), and `useSpecularPointer` has no concrete
  `<Card>` host left after S1; (HD-LIVE-6/7, LOW/NIT) the live 3-plate stack + the collapsed
  computed gradient form sharpen the gate.
- **Not contested:** the `surface="cartoon"` move, the cartoon token resolution, the
  net-deletion framing, the D6/D7 anchors — all verified true. Overlaps with
  `hd-design-redteam` (HD-1 composite, HD-3 counts, HD-4 div-stages, HD-6 BOOK) are
  corroborated from the LIVE side, not duplicated.

**Fix priority:** HD-LIVE-1 (HIGH, the 5th-Card scope/gate mismatch) → HD-LIVE-2 (HIGH,
storm-harden the visual gate) → HD-LIVE-5 (MED, name the kept-specular host) → HD-LIVE-3
(MED, de-magic the counts) → HD-LIVE-4 (MED, prove or soften the G2 claim) → HD-LIVE-6/7
(LOW/NIT).
