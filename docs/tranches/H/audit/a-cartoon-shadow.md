# Tranche H Deep Audit — Lane `a-cartoon-shadow`

**Charge:** D2 history. The CARTOON-SHADOW depth/hover system was CLOSED in Tranche C
(memory). Git-archaeology what it was, why/when it regressed, and the gestalt path to
restore it as the depth/hover treatment across the demo. Define the tokens + where they
apply.

**Spine (binding):** no quick fixes / no legacy beside replacement / one-motion replace
/ idiomatic glass-ui CONSUMPTION (inv-16 — the demo consumes glass-ui recipes, it does
not re-author them) / cite a `file:line` or live observation for every claim.

**Ground truth this lane stands on:** glass-ui consumed PUBLISHED at `@mkbabb/glass-ui
^3.4.0` (`package.json:103`); live demo on `:5174`; 13 `.glass-specular-track` elements
measured live on the easing scene, ZERO with a pointer write.

---

## TL;DR (the gestalt)

The "circular/radial blur on hover EVERYWHERE" (D2/D14) is **NOT** `design-idioms.css:263-269**
(the user's candidate is the `.progress-dot` glow — a different, correct primitive). It
is **glass-ui's `.glass-specular-track::before`** — a pointer-anchored radial catch-light
(`glass-specular-track.css:63-68`) that glass-ui's `<Card surface="glass">` (the DEFAULT,
`CardFooter-C390imy7.js:9,37`) bolts onto EVERY card. The demo never wires the pointer
position (`--mouse-x/--mouse-y` = unset on all 13 live tracks), so the iOS "light-follows-
finger" effect degrades to a **centred radial that blooms `0.35 → 0.6` opacity on hover**
— a radial blur, not a specular.

Meanwhile the **cartoon-shadow** depth system the demo closed in Tranche C
(`179019f`) survives on exactly **ONE** site (`CSSCodeEditor.vue:6`); it never became the
demo-wide depth/hover register it was meant to be. glass-ui 3.4.0 ships the FULL cartoon
system idiomatically — `@utility cartoon-surface` (`cards.css:33-48`) + the tiered
`--shadow-cartoon-{sm,md,lg}` tokens (`tokens.css:543-554`) + the spring hover-lift — and
glass-ui's own token doc states the cartoon offset **is the signature** depth language
(`tokens.css:474`).

**The one-motion fix (SHIP-in-H):** flip the demo's panel Cards from the implicit
`surface="glass"` to **`surface="cartoon"`**. That single prop change (a) DROPS
`glass-specular-track` (kills the radial blur, no CSS override, no `!important`), and (b)
APPLIES `.cartoon-surface` — the offset-stamp depth + spring hover-lift — as the demo's
coherent depth/hover treatment. Pure glass-ui consumption, net-deletion, zero new tokens.
The specular stays **opt-in** for the surfaces that genuinely want the iOS catch-light
(and there it must be wired with a pointer listener — that is lane D14's reconcile).

---

## 1 · Git archaeology — what cartoon-shadow WAS, and the C close

### 1.1 Origin: a hand-rolled offset stamp

cartoon-shadow began as an **inline Tailwind arbitrary value** on the Monaco editor wrapper:

```
border ? 'border-2 border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] dark:shadow-gray-700' : ''
```

(`CSSCodeEditor.vue:6`, pre-C). A `4px/4px/0-blur` black-opacity box-shadow IS the cartoon
offset stamp (a "Memphis sticker" register). It was named off-token in the Tranche A
design-findings, DEFERRED by Tranche B (FINAL: "the CSSCodeEditor cartoon-shadow token"),
and re-deferred — `docs/tranches/C/audit/lanes/color-token.md:11` documents the three
defects of the hand-roll: a fixed black stamp vs a theme-aware token, raw `border-gray-700`
vs `--border`, and a `dark:shadow-gray-700` band-aid the token solves via `--shadow-color`.

### 1.2 The C.W2 close (commit `179019f`, "the design system made true")

C.W2 migrated the literal to glass-ui's first-class primitive (commit body §"Off-token
migrations (S3)": *"CSSCodeEditor cartoon-shadow → `.cartoon-surface`"*). The diff
(`git show 179019f`):

```
- border ? 'border-2 border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] dark:shadow-gray-700' : '',
+ border ? 'cartoon-surface' : '',
```

This is exactly the gestalt move the spine wants: a literal replaced by a token-backed
utility in ONE motion, net-deletion, dark-mode handled by the token. It remains in place
today (`CSSCodeEditor.vue:6`, live).

### 1.3 What "CLOSED in Tranche C" actually meant — and the latent gap

C.W2 closed the **specific A/B-named off-token site**. It did **not** make cartoon-shadow
the demo's depth language — it migrated one editor border. So "cartoon-shadow was closed"
is true at the issue level and INCOMPLETE at the system level: the demo's *panels* never
adopted the cartoon register; they kept the soft-drop glass-card plate. cartoon-shadow has
been a one-site token since C, which is why a later glass-ui surface default (the specular
track) could silently take over every panel with no contradiction to the C ledger.

---

## 2 · The regression — root-caused live

### 2.1 The radial blur IS glass-ui's specular track (not design-idioms.css)

The D2 prompt offers `design-idioms.css:263-269` as a candidate. Read in context, that is
the **`.progress-dot`** conic-ring glow — `box-shadow: 0 0 var(--glow-spread)
var(--glow-blur) color-mix(... --color-progress 40% ...)` (`design-idioms.css:269`) — a
deliberate, correct active-playing progress-ring affordance bound to `--dot-p`, NOT a
hover treatment and NOT applied to panels/header/timeline. It is a red herring; do not
touch it.

The actual radial is glass-ui's **`.glass-specular-track::before`**
(`node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css:31-89`):

```css
.glass-specular-track::before {
    background: radial-gradient(circle at var(--specular-x,50%) var(--specular-y,50%),
        hsl(40 30% 100% / 0.55) 0%, hsl(40 30% 100% / 0.22) 22%, transparent 55%);
    opacity: var(--specular-intensity, 0.35);   /* rest */
    mask-image: radial-gradient(circle at …);
    mix-blend-mode: screen;
}
.glass-specular-track:hover::before  { --specular-intensity: 0.6; }   /* the bloom */
.glass-specular-track:active::before { --specular-intensity: 0.85; }
```

It is meant to be the iOS-26 Liquid Glass "illuminate-under-your-fingertip" — a catch-light
that RIDES the pointer (`glass-specular-track.css:1-11`). The consumer must write
`--mouse-x/--mouse-y` (the documented seam, `glass-specular-track.css:19`).

### 2.2 How it reached every panel — the transitive default

`<Card surface="glass">` is the DEFAULT (`CardFooter-C390imy7.js:9` `surface:{default:"glass"}`)
and the surface→class map bolts the track on:

```js
t.surface === "glass" && "glass-specular-track"   // CardFooter-C390imy7.js:37
```

The same string is baked into `<Button variant="glass"|"glass-wash">` (`button-Ckn3eDfB.js:57-58`)
and `dock-icon-button` (`dock.js:568`). The demo has **9 `<Card>`-bearing components**
(`grep -rl "<Card" demo/`), all on the default glass surface — so every panel, every glass
button, every dock icon carries the track.

### 2.3 The demo never wires the pointer — the iOS effect degrades to a blur

Live measurement (playwright, `:5174` easing scene):

```
specularTrackCount: 13
anyPointerWrite:     false           // NO element has --mouse-x / --mouse-y
sample[*].mouseX:    "(unset)"  →  catch-light pins centred (the var() 50% floor)
::before background: radial-gradient(circle, rgba(255,255,255,0.55) 0% …)  (measured)
::before opacity:    0.35 (rest)   →  hover lifts to 0.6 (CSS source)
mix-blend-mode:      screen
```

Because the demo authored **zero** specular writes (`git log -S specular -- demo/` = empty;
no `mouse-x` grep hit in source), the radial sits dead-centre and merely **brightens** on
hover. That is precisely D2's "strange circular/radial blur on hover everywhere
(panels, header, timeline)" — a half-implemented iOS feature, not a designed effect.

### 2.4 The double-plate redundancy (a second, compounding defect)

The demo's panels stack TWO surfaces: the `<Card>` (glass tier + specular track) AND a
manually-added `.glass-card` utility:

```
AnimationControlsControls.vue:3  <Card class="… glass-card">
RibbonBar.vue:3                  <Card class="overflow-visible glass-card">
KeyframesEditor.vue:3            <Card class="glass-card p-0 m-0">
KeyframeTimeline.vue:3           <Card :class="['… glass-card …']">
```

`.glass-card` is a SEPARATE static-surface utility (`glass.css:175-191`) with its own
`--glass-bg-quiet` background + `--shadow-card` plate — explicitly "no hover lift, no
transition" (`glass.css:172-174`). So each panel paints a glass tier + a redundant
glass-card plate + a centred radial. Three depth layers, none of them the cartoon stamp,
and the manual `.glass-card` fights the Card's own tier composition.

### 2.5 Why this is a regression, not a choice

`git log -S "specular" -- demo/` is **empty** — the demo never opted into the specular; it
arrived with a glass-ui version bump that made `surface="glass"` the Card default and made
that surface auto-bolt the track. cartoon-shadow (the C close) and the specular thus
coexist by accident: cartoon on one editor, specular on every panel. glass-ui's OWN token
doc says which one is the brand depth: *"§7 SHADOWS — cartoon offset is the signature"*
(`tokens.css:474`) and *"the cartoon offset is a brand-flavoured decoration … not the
canonical card shape. Consumers wanting the cartoon look pass `<Card surface="cartoon">`"*
(`tokens.css:510-515`). The demo is on the wrong default.

---

## 3 · What glass-ui 3.4.0 ships (the system to restore onto)

All present and idiomatic in the PUBLISHED dependency — **no new tokens, no glass-ui ask**:

| Surface | Source | What it gives |
|---|---|---|
| `@utility cartoon-surface` | `cards.css:33-48` | `border-width:2px; box-shadow:var(--shadow-cartoon-md); translate:0;` + `:hover` → `translate: var(--lift-sm) var(--lift-sm); box-shadow:var(--shadow-cartoon-lg)`; transition on `--spring-bouncy` / `--ease-apple` |
| `<Card surface="cartoon">` | `CardFooter-C390imy7.js:37` | composes `.cartoon-surface` onto the resolved `glass-${tier}` AND omits `glass-specular-track` |

Tokens it consumes (theme-aware, `light-dark()`-driven, dark-parity built in):

```
--shadow-cartoon-sm  -3px 2px 1px … (tokens.css:543)   → small offset stamp
--shadow-cartoon-md  -4px 3px 1px … (tokens.css:546)   → rest depth (cartoon-surface)
--shadow-cartoon-lg  -6px 4px 1px … (tokens.css:549)   → hover-lift depth
--lift-sm            -1px            (tokens.css:830)   → the hover translate amount
--spring-bouncy      linear(…) overshoot (tokens.css:161) → the springy lift curve
--ease-apple                          (tokens.css:180)  → the shadow ease
--shadow-cartoon-color[-soft]        (tokens.css:539-540, dark @ 1432-1433)
```

Note the lift is dogfood-adjacent: `cartoon-surface`'s hover translate rides
`--spring-bouncy`, a `linear()` spring stop-set — the same family the demo's own engine
generates (`springLinearStops`). The cartoon hover-lift is already a spring; that is the
right register and reinforces D13's "dogfood SpringProgress" thrust.

There is **no** `<CartoonCard>` recipe component to restore — it was removed at C.W5 / DEMOTEd
in glass-ui's Q tranche (`cards.css:2`, `LESSONS-LEARNED.md:612`); the surviving idiom is the
**decoration-only `cartoon-surface` utility + the `surface="cartoon"` prop**. Restoring via a
recipe component would be legacy-shaped; the utility/prop IS the modern surface.

---

## 4 · The gestalt restoration (tokens + where they apply)

### 4.1 The single decision

> **Cartoon-shadow is the demo's depth/hover register. Glass panels use
> `surface="cartoon"`; the specular catch-light is opt-in and, where opted in, MUST be
> pointer-wired.**

### 4.2 The mechanical move — `surface="cartoon"`, drop the manual `.glass-card`

For each panel Card, the one-motion change is:

```diff
- <Card class="w-full overflow-visible transition-shadow duration-normal glass-card">
+ <Card surface="cartoon" class="w-full overflow-visible">
```

This simultaneously: (a) removes `glass-specular-track` from the panel (the radial blur is
gone with no override — the surface map simply stops emitting it, `CardFooter:37`);
(b) applies `.cartoon-surface` (offset stamp + spring hover-lift); (c) lets the Card's own
tier own background/blur/border, so the redundant manual `.glass-card` plate (§2.4) is
**deleted** — no double-plate, one source. `transition-shadow duration-normal` is also
dropped: `cartoon-surface` owns its own shadow+translate transition (`cards.css:40-42`).

**Apply at (the 4 panel + 2 editor Cards that carry the manual `.glass-card` today):**
`AnimationControlsControls.vue:3`, `RibbonBar.vue:3`, `KeyframesEditor.vue:3`,
`KeyframeTimeline.vue:3` (note its `expanded` branch already strips border/shadow — keep that
conditional, just swap the base surface). Audit `MatrixEditor.vue:2` (`<Card>` plain) and the
`TimingFunctionPanel.vue:17,74` (`<Card plain>`) — `plain` cards may want the cartoon register
too for D3's bezier-editor framing, but `plain` likely already suppresses surface; verify per-Card.

**Leave alone:** `CSSCodeEditor.vue:6` already carries `.cartoon-surface` directly (the C
close) — it is the proof that the register works; it needs no change.

### 4.3 The specular is not deleted — it is demoted to opt-in + wired

Per the spine (no workaround) and D14 ("the glass is good; reconcile with the cartoon-shadow
depth"), the specular is NOT globally killed — it is removed from the *default panel surface*
and kept where the demo deliberately wants the iOS catch-light. Wherever `surface="glass"` is
deliberately retained, the demo MUST wire the pointer seam (a thin `pointermove` →
`el.style.setProperty('--mouse-x', …%)` listener — glass-ui's documented consumer seam,
`glass-specular-track.css:19`), or the effect stays the broken centred bloom. That pointer-
wiring is the D14 lane's deliverable; this lane's mandate is to take the radial OFF the
panels by making cartoon the panel surface.

### 4.4 Dock items (glass-ui-HANDOFF)

`dock-icon-button` hard-codes `glass-specular-track` (`dock.js:568`) and the dock is actively
worked on (glass-ui AW tranche). The dock's centred-bloom-without-pointer-write is the same
defect on a surface the demo does NOT own. **Do not patch in kf.** SUGGEST to glass-ui: either
DockIconButton wires its own `--mouse-x/--mouse-y` (it is the natural owner — the file note at
`glass-specular-track.css:19` already says "DockIconButton wires it", so this is a *missing
wire*, not a missing design), or the dock icons drop the track in favour of the cartoon /
uniform-cast shadow (`--shadow-uniform`, `tokens.css:509`). **TAG: glass-ui-HANDOFF.**

---

## 5 · Findings ledger

| # | Finding (anchor) | Disposition | Instrument (falsifiable gate) |
|---|---|---|---|
| **CS-1** | The "radial blur on hover" is glass-ui `.glass-specular-track::before` (`glass-specular-track.css:63-68`), bolted onto every panel via `<Card surface="glass">` default (`CardFooter:9,37`); 13 live tracks, **0** pointer-wired (`anyPointerWrite:false`) → centred bloom 0.35→0.6. | **SHIP-in-H** | `proof:no-orphan-specular` — assert built demo CSS/DOM has **zero** `.glass-specular-track` on panel Cards (`AnimationControlsControls`, `RibbonBar`, `KeyframesEditor`, `KeyframeTimeline`); OR if any survives, assert a `--mouse-x` write exists on it. Visual lock: hover-screenshot of the controls panel shows an offset cartoon stamp, no centred radial. |
| **CS-2** | cartoon-shadow (C.W2 close, `179019f`) survives on ONE site only (`CSSCodeEditor.vue:6`); never became the panel depth register. glass-ui calls it the signature (`tokens.css:474,510-515`). | **SHIP-in-H** | `proof:cartoon-is-panel-depth` — assert ≥ the 4 panel Cards resolve `box-shadow: var(--shadow-cartoon-md)` (i.e. carry `.cartoon-surface`) at rest. |
| **CS-3** | Double-plate: panels stack `<Card>` glass tier + manual `.glass-card` (`AnimationControlsControls.vue:3`, `RibbonBar.vue:3`, `KeyframesEditor.vue:3`, `KeyframeTimeline.vue:3`). `.glass-card` is a separate static utility (`glass.css:175`). | **SHIP-in-H** (folds into CS-1/CS-2) | `grep -rn "glass-card" demo/ \| grep "<Card"` = 0 after the swap (the Card surface owns the plate; no manual class). |
| **CS-4** | D2 candidate `design-idioms.css:263-269` is the `.progress-dot` glow — a correct progress-ring affordance, not the hover defect. | **RECORD** (do-not-touch) | Note in the H plan: the radial root cause is glass-ui specular-track, NOT the demo's idioms file. Prevents a wrong-target edit. |
| **CS-5** | Dock icons carry `glass-specular-track` un-wired (`dock.js:568`) — same centred-bloom defect on a glass-ui-owned surface; ties to D5 dock lag. | **glass-ui-HANDOFF** | Suggest: DockIconButton wires `--mouse-x/--mouse-y`, OR drops the track for `--shadow-uniform`/cartoon. kf gate only asserts kf-owned surfaces (CS-1); dock is out of kf scope. |
| **CS-6** | The specular itself is good design (D14) — keep it opt-in; wherever `surface="glass"` is deliberately kept, wire the pointer. | **BOOK → D14 lane** | This lane removes it from panels; D14 reconciles the refined specular hover. Gate: any retained `.glass-specular-track` in demo source has an accompanying pointer listener. |

---

## 6 · Why this honours the spine

- **No quick fix / no override:** the radial dies because the surface map stops emitting the
  class (`surface="cartoon"`), not via a CSS `display:none` or `!important` on `::before`.
- **No legacy beside replacement / one motion:** the manual `.glass-card` plate is *deleted*
  in the same edit that adopts `surface="cartoon"` — the replaced surface is replaced once.
- **inv-16 (consume, don't re-author):** every token (`--shadow-cartoon-*`, `--lift-sm`,
  `--spring-bouncy`) and the `cartoon-surface` utility are glass-ui-OWNED and already shipped
  in `^3.4.0`; the demo adds **zero** new CSS. Net-deletion (manual class + redundant
  transition removed).
- **No glass-ui patch in kf:** the dock + the specular-wiring asks are TAGGED glass-ui-HANDOFF.
- **MEASURE-FIRST:** every claim is anchored to a `file:line` in the published dependency or a
  live playwright measurement (13 tracks, 0 pointer writes, 0.35→0.6 bloom).

---

## 7 · Already-SOTA (honest credit)

- The C.W2 `CSSCodeEditor` migration (`179019f`) is exemplary — literal → token-backed utility
  in one motion, dark-mode delegated to the token. It is the *model* for §4.2; this lane
  generalizes it, it does not correct it.
- glass-ui's cartoon system is complete and well-documented (tiered `sm/md/lg`, `light-dark()`
  dark parity, spring hover-lift). The demo needs only to *select the right surface* — the
  hardest design work is already shipped upstream.
- `design-idioms.css`'s `.progress-dot` / `.progress-rail` / `.progress-ball` / `.status-badge`
  promotions are genuinely good single-sourcing of demo-owned idioms; this lane explicitly
  fences them off from the radial-blur fix.
