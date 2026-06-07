# G.W11 — The demo usability SHIPs (the live-Playwright SHIP set)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the demo surface — three live-verified usability
defects, two on the most-important elements; behaviour-corrective, not isomorphic —
each fix CHANGES the broken behaviour to the intended one: a dead route becomes
reachable, the hero renders with inter-word gaps, two play buttons become
distinguishable) · **Scope:** `demo/**` only — `demo/app/router.ts` (the missing
`starting-style` route), `demo/@/components/custom/AnimatedText.vue` (the hero
inter-word separator), `demo/@/components/custom/animation-controls/AnimationMenuBar.vue`
(the duplicate Play aria-label) + the gate script (a `demo-smoke`/a11y instrument —
the route-reachability assertion + the inter-word-gap assertion + the unique-aria-label
assertion) — ZERO library (`src/**`), test-outside-demo, or CI edit · **DAG:
independent of Bands 0/1** (the re-pin `G.W2` touches none of these demo files; runs
in parallel) — Band-5 sibling of `G.W10` (idiom sweep) + `G.W12` (dock), file-disjoint
from both · **Gated on:** keyframes' own green CI (inv-27). The X-5 hero fix
SHOULD land EARLY in the band — it is on the LCP, the single most-visible defect.

**Title.** *Three live-verified demo defects from the G Playwright pass, two on the
most-important elements: (X-6) a whole registered scene ("Discrete") is DEAD — the
switcher offers it but `router.ts` declares no route, so it hits the catch-all and
redirects home; (X-5) the hero LCP renders "Selectananimation" — the inter-word
separator is a collapsed whitespace text node between two `inline-block` boxes, so
the measured gap is 0px; (X-3) two simultaneously-rendered buttons share
`aria-label="Play animation"` (the transport ribbon + the bottom menubar) on every
editor scene. Each is a one-surface SHIP with a falsifiable browser/a11y gate.*

These are the LIVE-render defects the STATIC lanes could not see — the Playwright
pass drove a real Chromium against `npm run dev` and measured them
(`a-demo-playwright`). The demo chrome is otherwise EXEMPLARY — accessible names
everywhere, visible focus rings, the `?` shortcuts modal (26 `<kbd>`), explainer
prose, mobile dock-expanded-by-default, ZERO console errors on every route
(`a-demo-playwright` cross-scene SOTA). The honest residual is these three SHIPs (the
dock affordance is its OWN wave, `G.W12`; the BOOKs are recorded below). NOT a
restructure.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: X-6 adds the GENUINE route (a registered scene
gets its declared destination), NOT a switcher-side filter hiding the dead entry
(hiding "Discrete" would mask the defect, not fix it — the §Mandate's no-escape-hatch);
X-5 fixes the SEPARATOR MECHANISM (a gap that survives `inline-block`) while
PRESERVING the SOTA word-split + the `sr-only` a11y mirror + `text-wrap: balance`
substrate `r-modern-web` correctly praised (the live lane overrides the static lane's
"SOTA" only where they COLLIDE, and the fix keeps the static lane's correct half);
X-3 DISAMBIGUATES the two labels (a real second accessible name), NOT a duplicate
left "good enough." NO legacy: no broken route left "redirecting for now," no 0px-gap
separator left beside its fix, no two-identical-label control suite. KISS: each fix is
the minimal correct change at exactly one surface. Styling ISOMORPHIC where it can be
— X-3 changes only the accessible NAME (no pixel moves); X-5's gap restoration is the
INTENDED visual correction (the words gain their spaces — a behaviour delta, the point
of the SHIP); X-6 adds a route (no pixel change to existing scenes). Measure-first
does NOT bind (correctness/usability fixes, not perf claims) — the gates are
falsifiable browser/a11y assertions that BITE, not benches. inv ε: every claim below
cites `file:line` (or the live Playwright measurement), source-verified on
`tranche-g-dev`, not asserted. Cross-repo hand-offs: NONE — all three are demo-local
(the dock occlusion, the one cross-repo demo defect, is `G.W12`'s glass-ui-HANDOFF).

**Provenance.** `a-demo-playwright X-6` (Discrete scene unreachable — `router.ts:25`
catch-all redirects home; SHIP, ranked #1 — "a whole registered scene is dead"),
`X-5` (hero LCP renders "Selectananimation", 0px inter-word gap; SHIP, ranked #2 —
"the single most visible defect, on the LCP"), `X-3` (duplicate "Play animation"
aria-label, transport + menubar, every editor scene; SHIP, ranked #4). Synthesised at
`_SYNTHESIS-frontend §2 TIER 2` (F-U1/F-U2/F-U3) + `§1` (the cross-lane resolution
of the hero bug — the live lane overrides the static lane, the fix preserves the
correct half) + `_SYNTHESIS-gap-scorecard §1` (demo-usability row: "SOTA chrome + 4
real SHIPs … Discrete scene unreachable; hero LCP renders 'Selectananimation';
duplicate 'Play animation' aria-label") + `§2 Band 5 G.W11`. (The 4th SHIP in the
scorecard's "4 real SHIPs" is the dock, routed to `G.W12`.)

---

## § State, verified (not asserted)

The live facts, `grep`-, read-, and Playwright-confirmed (the live measurements are
`a-demo-playwright`, re-grounded against the live source here):

1. **X-6 — the "Discrete" scene is registered but has NO route → unreachable.**
   Verified live: `scenes.ts:115-116` registers `{ id: "starting-style", label:
   "Discrete", … }` and `useSceneRouter` passes the full `scenes` list to the dock, so
   the scene-switcher OFFERS "Discrete" and `switchScene("starting-style")` calls
   `router.push({ name: "starting-style" })`. But `router.ts:17-24` declares routes
   only through `motion-path` (`home`/`cube`/`amiga`/`square`/`easing`/`spring`/
   `sequence`/`motion-path`) — there is **no** `starting-style` route. `router.ts:25`
   is the catch-all `{ path: "/:pathMatch(.*)*", redirect: "/" }`, so navigating
   `#/starting-style` redirects to home (`#/`). The Playwright pass verified the live
   redirect (`a-demo-playwright` Discrete). A whole registered scene is DEAD; its own
   affordances couldn't even be audited because it can't be reached.

2. **X-5 — the hero LCP renders "Selectananimation" (0px inter-word gap).** Verified
   live at source: `AnimatedText.vue:14` splits the title into per-word spans
   (`v-for="(word, index) in words"`), each a `display: inline-block` box
   (`AnimatedText.vue:63`), and inserts the inter-word separator as a whitespace-only
   text node — `:23` `><template v-if="index < words.length - 1"> </template>`. A
   whitespace-only text node BETWEEN two `inline-block` boxes is collapsed by HTML
   whitespace-collapsing → the gap renders 0px. The Playwright pass measured it:
   "Select" right-edge = 178px, "an" left-edge = 178px → **0px gap** (both word
   boundaries; `a-demo-playwright` X-5). The decorative `aria-hidden` layer reads
   "Selectananimation"; only the `sr-only` mirror is correct. The word-split itself is
   SOTA (it lets `text-wrap: balance` + the a11y mirror work — `r-modern-web:46-54`,
   confirmed at `AnimatedText.vue:8-10`); the SEPARATOR MECHANISM is the bug
   (`_SYNTHESIS-frontend §1` cross-lane resolution).

3. **X-3 — two simultaneously-rendered controls share `aria-label="Play animation"`.**
   Verified live: `AnimationMenuBar.vue:95` and `:129` BOTH carry
   `:aria-label="isPlaying ? 'Pause animation' : 'Play animation'"` — the
   PlaybackRibbon transport play (the larger control) and the bottom-menubar play (the
   rainbow control). A screen-reader user hears two identical "Play animation" buttons
   with no way to tell them apart. This is structural to the shared control suite, so
   it recurs on every editor scene (`a-demo-playwright` X-3, Square). (The Pause label
   is duplicated by the same ternary — disambiguation must cover both states.)

4. **The demo chrome is otherwise EXEMPLARY (manufacture NO work).** Verified live
   (`a-demo-playwright` cross-scene SOTA): accessible names on every probed control;
   toggles flip their labels ("Open/Close controls", "Switch to light/dark mode");
   visible blue `outline:auto` focus-visible ring on keyboard Tab; the `?` shortcuts
   modal is a proper `role="dialog"` with GENERAL/PLAYBACK/NAVIGATION sections + 26
   `<kbd>` keys; explainer prose on the conceptual scenes; mobile (390px) expands the
   dock by default + stacks controls cleanly; ZERO console errors on every route. The
   three SHIPs are the honest residual.

The wave's job: add the missing `starting-style` route; change the hero separator to
one that survives `inline-block` while preserving the word-split + the `sr-only`
mirror + `balance`; disambiguate the two Play/Pause labels; and add the three
falsifiable browser/a11y assertions that BITE today on each defect.

---

## § Goal

**What lands:**

- **X-6 — the `starting-style` route added (the Discrete scene reachable).** Add
  `{ path: "/starting-style", name: "starting-style", component: <the scene host the
  other routes use> }` to `router.ts` (the same `component` the registered routes use —
  `router.ts:17-24` all share one `Stub`/host that the keyed `<Suspense>` resolves to
  the lazy scene chunk by `name`). The switcher's "Discrete" entry now lands its scene
  instead of redirecting home; the catch-all (`router.ts:25`) stays as the genuine
  unknown-path fallback.
- **X-5 — the hero inter-word gap restored (the LCP reads "Select an animation").**
  Change the separator at `AnimatedText.vue:23` to one that survives `inline-block` —
  a per-word `margin-inline`/`padding-inline` on the word spans (the canonical fix for
  inter-`inline-block` spacing), OR a non-collapsing separator. PRESERVE the per-word
  split (`AnimatedText.vue:14,52`), the `sr-only` a11y mirror, and the `text-wrap:
  balance`/`pretty` substrate (the SOTA half `r-modern-web` praised). The decorative
  layer now reads "Select an animation" with genuine spaces.
- **X-3 — the two Play/Pause labels disambiguated.** Give the two controls distinct
  accessible names (e.g. transport: "Play (transport)" / "Pause (transport)";
  menubar: "Play" / "Pause" — or the names the demo's voice prefers), so no two
  simultaneously-rendered controls carry the same `aria-label`
  (`AnimationMenuBar.vue:95,129`). Pixel-isomorphic (accessible name only; no visual
  change).
- **The three falsifiable gates** — (a) a `demo-smoke` route-reachability assertion:
  every `scenes.ts` id resolves a NON-redirecting route (so a registered-but-unrouted
  scene reds); (b) an `AnimatedText` inter-word-gap assertion: the measured gap
  between adjacent word boxes is `> 0px` (so a collapsed separator reds), with the
  `sr-only` mirror + `balance` substrate asserted intact; (c) a unique-aria-label
  assertion: no two SIMULTANEOUSLY-RENDERED controls share an `aria-label` on an
  editor scene (so a re-duplicated Play label reds).

**Why:** these are three live, user-reachable defects, two on the demo's most
important elements — a dead navigation destination, a malformed LCP, and a
screen-reader ambiguity that recurs on every editor scene. Each is a focused
one-surface fix with a gate that bites today; together they close the live-Playwright
SHIP set (the dock is `G.W12`). The fixes are the GENUINE corrections (route, gap,
distinct name), never a mask (hide the entry, paper the gap, tolerate the dup).

**What does NOT land (recorded so no future lane re-raises):**
- **X-4 — open-controls panel occludes the subject** (`a-demo-playwright` X-4) —
  **BOOK (demo-UX)**: a panel-occlusion redesign (docked/side panel or auto-shrink
  subject), net-new scope, not a one-surface SHIP.
- **X-2 — the caught value.js parse error** (`Parse error at offset 0: "......"`,
  the ellipsis fed to the engine from the hero string; `a-demo-playwright` X-2) —
  **BOOK-to-trace**: caught (no crash) but a real broken-data signal; trace the source
  before any change. Not a blind fix.
- **X-7 — the theme-toggle `aria-pressed` semantic conflict** (`a-demo-playwright`
  X-7) — **BOOK** (a11y nit, low urgency).
- **F-U5 — the Sequence clock under synthetic playback** (`a-demo-playwright`
  Sequence) — **FLAG, verify-first**: Playwright could not exclude a CDP focus nuance
  (cube/square DID advance); needs a manual human-driven Play before it is even named
  a bug. Do NOT assert it as a defect.
- **The start-screen overlay not dismissing after select+play on home**
  (`a-demo-playwright` Home) — **BOOK**: likely intentional for the showcase landing;
  reads as a stuck state but is not clearly a defect.
- **The dock affordance** (X-1) — routed to `G.W12` (glass-ui-HANDOFF + the kf-demo
  D.W5 close). NOT double-owned here.

---

## § Scope

### S1 — X-6: add the missing `starting-style` route (`a-demo-playwright X-6`) — SHIP-in-G (the #1-ranked SHIP — a dead scene)

**WHAT:** add `{ path: "/starting-style", name: "starting-style", component: <the
shared scene host> }` to `router.ts` (between the `motion-path` route and the
catch-all — `router.ts:24-25`), using the same `component` the other registered routes
use (the keyed `<Suspense>` resolves the lazy `starting-style` chunk by `name`, as it
does for every other scene). Verify `switchScene("starting-style")` now lands the
scene instead of redirecting home.

**WHY:** §State 1 — `scenes.ts:115` registers the scene and the switcher offers it,
but `router.ts:17-24` declares no `starting-style` route, so `router.ts:25`'s
catch-all redirects "Discrete" to home — a whole registered scene is dead. Adding the
route is the GENUINE fix (a registered scene gets its declared destination); the
catch-all stays as the real unknown-path fallback. One added route entry.

### S2 — X-5: restore the hero inter-word gap, preserving the SOTA substrate (`a-demo-playwright X-5`, `_SYNTHESIS-frontend §1`) — SHIP-in-G (the #2-ranked SHIP — the LCP; land EARLY)

**WHAT:** in `AnimatedText.vue`, replace the collapsed whitespace-only separator
(`:23` `<template v-if="index < words.length - 1"> </template>`) with a gap that
survives `inline-block` — a per-word `margin-inline`/`padding-inline` on the word
spans (`:63`), OR a non-collapsing separator (e.g. a `white-space`-preserving
wrapper). PRESERVE the per-word split (`:14,:52`), the decorative `aria-hidden` layer's
animation timing (`:18-22` `animationDelay`/`animationDuration`), the `sr-only` a11y
mirror, and the `text-wrap: balance`/`pretty` substrate. Verify the measured gap
between adjacent word boxes is `> 0px` and the decorative layer reads "Select an
animation".

**WHY:** §State 2 — a whitespace-only text node between two `inline-block` boxes is
collapsed by HTML, so the LCP renders "Selectananimation" (0px gap). The word-split
itself is SOTA (it lets `balance` + the a11y mirror work, `r-modern-web:46-54`); only
the separator mechanism is the bug. The fix changes ONLY the separator to one that
survives `inline-block`, keeping the static lane's correct half — the canonical
synthesis act (`_SYNTHESIS-frontend §1`). The most-visible defect, on the most
important element — land it early.

### S3 — X-3: disambiguate the duplicate Play/Pause aria-label (`a-demo-playwright X-3`) — SHIP-in-G (recurs on every editor scene)

**WHAT:** give the two controls in `AnimationMenuBar.vue` distinct accessible names —
disambiguate the transport-ribbon play (`:95`) from the bottom-menubar play (`:129`)
across BOTH states (Play AND Pause, since the same ternary drives both), e.g.
transport "Play (transport)"/"Pause (transport)" vs menubar "Play"/"Pause" (or the
demo-voice's preferred phrasing). No visual change.

**WHY:** §State 3 — two simultaneously-rendered buttons carry the identical
`aria-label="Play animation"` (and "Pause animation"), so a screen-reader user can't
tell them apart; structural to the shared control suite, recurs on every editor scene.
A second distinct accessible name is the genuine fix. Pixel-isomorphic (accessible
name only).

> **RECORDED / BOOKED / FLAGGED in this band — so no future lane re-litigates:**
> - **X-4** (open-controls panel occludes the subject) — **BOOK (demo-UX redesign)**,
>   net-new scope.
> - **X-2** (caught value.js parse error from the ellipsis hero string) —
>   **BOOK-to-trace**, a broken-data signal; trace before changing.
> - **X-7** (theme-toggle `aria-pressed` semantic conflict) — **BOOK** (a11y nit).
> - **F-U5** (Sequence clock under synthetic playback) — **FLAG, verify-first** with a
>   manual human-driven Play; do NOT assert as a bug.
> - **The start-screen overlay persistence** — **BOOK**, likely intentional.
> - **The demo chrome ALREADY-SOTA bulk** (`a-demo-playwright` cross-scene SOTA) —
>   UNTOUCHED. Manufacture NO work.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable
instrument, not an assertion). The three clauses are the `demo-smoke`/a11y instruments
named in `_SYNTHESIS-frontend §2 TIER 2` + `_SYNTHESIS-gap-scorecard §2 G.W11`:

1. **ROUTE-REACHABILITY — every `scenes.ts` id resolves a non-redirecting route.**
   A `demo-smoke` assertion enumerates the `scenes.ts` ids and asserts each resolves a
   declared `router.ts` route whose `name`/`path` matches and that does NOT fall to the
   catch-all redirect. **BITE:** reds TODAY on `starting-style` (`scenes.ts:115`
   registered, `router.ts` un-routed, `:25` catch-all redirects home — §State 1); green
   after S1. A future registered-but-unrouted scene reds.

2. **HERO INTER-WORD GAP — the measured gap between adjacent word boxes is `> 0px`.**
   An `AnimatedText` assertion (browser-driven, jsdom can't lay out) renders the hero
   and measures the gap between adjacent word boxes (the X-5 measurement: today
   "Select" right-edge === "an" left-edge === 178px → 0px). Assert `> 0px`, AND assert
   the `sr-only` a11y mirror still spells the title with spaces + the decorative layer
   carries the `balance`/`pretty` substrate. **BITE:** reds TODAY (0px gap — §State 2);
   green after S2. Reverting to the collapsed whitespace separator reds; removing the
   `sr-only` mirror or the `balance` substrate ALSO reds (the fix must not regress the
   SOTA half).

3. **UNIQUE ARIA-LABEL — no two simultaneously-rendered controls share an
   `aria-label`.** A `demo-smoke`/a11y assertion renders an editor scene and asserts
   no two concurrently-rendered interactive controls carry the same `aria-label`.
   **BITE:** reds TODAY on the two "Play animation" buttons
   (`AnimationMenuBar.vue:95,129` — §State 3, both Play and Pause states); green after
   S3. Re-duplicating a control label reds.

4. **No regression — the SHIPs are inert beyond their intended deltas.** `npm test`
   stays green; every OTHER scene route still resolves byte-stable; the demo chrome's
   ALREADY-SOTA surface (focus rings, the `?` modal, the other accessible names, ZERO
   console errors) is UNTOUCHED; the demo builds. **BITE:** any unrelated route/a11y
   regression, any pixel diff outside the intended hero-gap restoration, or any
   `src/**`/CI edit attributed to this wave reds (the wave is `demo/**`-only; the
   gate scripts are the lock).

---

## § Folds

Retires (by finding id):
- **`a-demo-playwright X-6`** (Discrete scene unreachable — `router.ts:25` catch-all
  redirects home; SHIP) — S1 + gate clause 1.
- **`a-demo-playwright X-5`** (hero LCP "Selectananimation", 0px gap; SHIP) — S2 +
  gate clause 2.
- **`a-demo-playwright X-3`** (duplicate "Play animation" aria-label; SHIP) — S3 +
  gate clause 3.

**BOOKED / FLAGGED / RECORDED in this band (see §Scope callout):**
- **`a-demo-playwright X-4`** (panel-occlusion redesign) — BOOK (demo-UX).
- **`a-demo-playwright X-2`** (caught ellipsis parse error) — BOOK-to-trace.
- **`a-demo-playwright X-7`** (theme-toggle `aria-pressed`) — BOOK (a11y nit).
- **`a-demo-playwright` Sequence F-U5** (clock under synthetic playback) — FLAG,
  verify-first; not asserted as a bug.
- **`a-demo-playwright` Home overlay persistence** — BOOK, likely intentional.
- **`a-demo-playwright` X-1 dock** — routed to `G.W12`, not double-owned.
- **The demo-chrome ALREADY-SOTA bulk** — UNTOUCHED; manufacture NO work.

---

## § Design decisions (the trade-offs RESOLVED)

1. **Add the route, do NOT hide the switcher entry.** RESOLVED: there are two ways to
   stop "Discrete" redirecting home — add its route, or filter it out of the switcher.
   The §Mandate forbids the escape-hatch: hiding the entry masks the defect (the scene
   is still dead, just invisible) and discards a real registered scene. Adding the
   route is the genuine fix — the scene gets its declared destination, the catch-all
   stays as the legitimate unknown-path fallback (`a-demo-playwright X-6` "1-line fix").

2. **Fix the SEPARATOR, preserve the SOTA word-split — the live lane overrides the
   static lane only where they collide.** RESOLVED: `r-modern-web` scored the word-split
   ALREADY-SOTA (it enables `text-wrap: balance` + the a11y mirror); `a-demo-playwright`
   X-5 measured the live 0px gap. Both are right at their altitude
   (`_SYNTHESIS-frontend §1`). The synthesis act is to fix ONLY the separator mechanism
   (a gap that survives `inline-block`) while keeping the static lane's correct half
   (the split, the `sr-only` mirror, the `balance` substrate). Re-flowing the hero to a
   single text run (which would also "fix" the gap) is REJECTED — it would discard the
   per-character/word lift-down motion and the a11y substrate the SOTA half is built
   on. The gate (clause 2) defends both halves: gap `> 0px` AND mirror/substrate
   intact.

3. **Disambiguate BOTH states, by the genuine accessible-name pair.** RESOLVED: the
   duplicate is driven by ONE ternary at each site (`isPlaying ? 'Pause animation' :
   'Play animation'`), so disambiguating must cover Play AND Pause — naming only the
   Play state would leave the Pause state duplicated. The transport-vs-menubar
   distinction is the genuine semantic difference (one is the primary transport, one
   the menubar mirror), so the names carry that. Accessible-name-only — pixel-isomorphic
   (`a-demo-playwright X-3`).

4. **These are LIVE defects the static lanes could not see — the Playwright pass is
   the instrument.** RESOLVED: X-6 (the dead route) and X-5 (the 0px gap) are
   render/runtime facts (the catch-all redirect, the whitespace collapse between
   `inline-block` boxes) invisible to a static read of the substrate — `r-modern-web`
   even scored the hero SOTA from the correct static substrate. The gates are
   accordingly browser/`demo-smoke`-driven (route resolution, layout measurement,
   rendered-a11y-tree) — the same live altitude that found the defects, so the gate
   bites where the lane saw (`a-demo-playwright` method).

5. **This wave is `demo/**`-only — ZERO library surface; ZERO cross-repo hand-off.**
   RESOLVED: all three SHIPs are demo-local (router config, a demo SFC separator, a
   demo SFC accessible name) — no `src/**`, no value.js/parse-that/glass-ui touchpoint.
   The one cross-repo demo defect (the dock occlusion, X-1) is `G.W12`'s
   glass-ui-HANDOFF, not this wave's. The gate edits only the `demo-smoke`/a11y
   instrument (the lock), not behaviour.
