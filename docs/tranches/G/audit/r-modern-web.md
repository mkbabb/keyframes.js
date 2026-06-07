# Tranche G — SOTA audit — modern-web frontier (post-F re-disposition)

**Lane id:** `r-modern-web` · **Branch at audit:** `tranche-g-dev` (D+E+F IMPLEMENTED
+ RELEASED — kf `4.0.0`, value.js `0.11.0`, parse-that `0.9.0`; keyframes.babb.dev on
Cloudflare Pages). **Scope:** the `modern-web-guidance` corpus (137 guides on disk,
`.agents/skills/modern-web-guidance/guides/`; `npx modern-web-guidance@latest
list/search/retrieve` run live this audit) diffed against the LIVE post-F demo + the
`proof:modern-web` §S6 checklist — the central artifact F landed and tagged
`proof:modern-web`. **Mandate:** idiomatic-gestalt only, no legacy/polyfill/workaround,
measure-first, isomorphic-unless-named, inv ε (verify cite, never assert), inv-16 RELAXED
for G impl but each repo audited as its own surface + cross-repo items tagged HAND-OFF.
This lane writes ONLY this doc; ZERO source edits.

This is a **re-disposition, not a re-derivation.** F's three modern-web lanes
(`F/audit/r-modern-web-2026.md`, `r-scroll-vt-2026.md`, `r-cwv-inp-2026.md`) digested
the corpus and F.W4/W11/W13 *shipped* the high-value adoptions: View Transitions, the
`proof:modern-web` checklist (20 rows, `scripts/proof-modern-web.mjs:401-551`),
`text-wrap: pretty` (F.W13), the `scheduler.yield` ladder, `content-visibility:hidden`,
the `@property` registry adopt (F.W9 / S1 platform-adopt), the F.W16 hero a11y substrate.
My job is narrow and honest: **re-score every §S6 checklist row on the LIVE tranche-g-dev
tree, name what F BOOKed and whether it has since become shippable, and surface any NEW
catalog lever the F lanes could not have seen.** The headline answer is **the post-F demo
remains exemplary on the modern-web axis — there is almost no not-SOTA left.** The one
forward motion (VT directional types) is STILL upstream-blocked (glass-ui 3.3.0's
`startViewTransition` is verified bare-callback-only); the genuinely-new catalog items
(`sibling-index()`, Custom Highlight API, `<dialog closedby>`) are each correctly
not-adopted (not Baseline, no clean fit, or a glass-ui seam).

---

## 0. What F LANDED (the baseline this lane re-scores) — verified live on tranche-g-dev

The git log on `tranche-g-dev` shows the released F stack (`d264053` "keyframes.js 4.0.0 —
the B+C+D+E+F stack"; `8fea80c` Cloudflare Pages). Each modern-web lever is verified
present:

- **View Transitions scene-nav** (E.W11, re-confirmed F): `demo/app/useSceneTransition.ts:32`
  — `const { finished } = startViewTransition(() => mutate(id));`, focus-routed on
  `finished` (`:33-35`), `view-transition-name: scene-subject` anchor in `App.vue`,
  PRM-degrade in glass-ui's `view-transition.css`. `proof:demo-elevate.mjs:63` locks the
  focus-route; `proof:modern-web` checklist row UX1 ALIGNED (`proof-modern-web.mjs:516-524`).
- **`text-wrap: pretty`** (F.W13.S1): `demo/@/components/custom/editor-shell/EditorStartScreen.vue:68`
  on the start-screen running prose, with the explicit Firefox-fallback comment (`:64`).
  `proof:demo-elevate.mjs:202` BITES if it leaks onto the LCP `<h1>` hero (it is F.W16's
  `balance`-class substrate, not this prose SHIP).
- **`text-wrap: balance`** (F.W16, via glass-ui `.text-display-*`): the hero now wraps at
  real word boundaries — `AnimatedText.vue:47-54` splits by WORD (not per-character), so
  `balance` has something to balance.
- **`@property` registry → `CSS.registerProperty`** (F.W9 / S1): `engine.ts:1262-1281`,
  feature-detected (`typeof CSS.registerProperty !== "function"` guard, `:1262`),
  duplicate-name throw swallowed. `proof:platform-adopt.mjs:84-121` locks it.
- **`content-visibility: hidden`** Monaco cache + `inert` (E.W11/F): `AnimationControls.vue:286`
  with `@supports not (content-visibility: hidden) { display:none }` fallback (`:292`).
- **`scheduler.yield` ladder** (E.W4): `src/animation/internal/scheduler.ts`; the demo edit
  path reuses it (`useKeyframeOps.ts`, `proof-modern-web.mjs:270-310` clause 4, one ladder).
- **The F.W16 hero a11y substrate** (`AnimatedText.vue:12-25`): an `.sr-only` mirror of the
  whole word + an `aria-hidden="true"` decorative per-word layer + a PRM guard (`:103-111`).
  Exemplary; locked by `proof:demo-elevate.mjs:347-365`.
- **The F.W15 visible shortcuts trigger**: `EditorShell.vue:28-30` (`@click="shortcutsOpen
  = true"`, `aria-label="Show keyboard shortcuts"`) with the `?` shortcut preserved
  additively (`:140`). Locked by `proof:demo-elevate.mjs:319-321`.

**The ARCH-kills that HOLD** (re-affirmed, do not re-litigate): the engine ships ZERO VT
surface (boundary — `r-scroll-vt-2026` A-2); native scroll-driven CSS is the additive
fast-lane over the general JS `Timeline` sampler (`r-scroll-vt-2026` K-1, `proof:platform-adopt`
clause S5); Speculation Rules is MPA-only and the hash-routed SPA correctly uses Vite
hover-warmup (`r-cwv-inp-2026` E-1, `proof-modern-web.mjs:343-388` clause 6).

---

## 1. The §S6 checklist re-disposition (the central artifact) — every row re-scored

`scripts/proof-modern-web.mjs:401-551` carries 20 rows. I re-confirmed each anchor live on
`tranche-g-dev`. **The verdict: every row's disposition HOLDS post-F — none flipped, none
regressed.** The table below re-grounds each (the F lanes scored these on `tranche-e-impl`
PRE-impl; this re-score is POST-impl + released, with the live anchor):

| Row | Axis | F disposition | G re-score | Live anchor (verified) |
|---|---|---|---|---|
| C1 | INP / `scheduler.yield` edit path | ALIGNED | **ALIGNED (HOLDS)** | `useKeyframeOps.ts` `yieldToMain` (clause 4 green) |
| C2 | LCP font preload + metric fallback | ALIGNED | **ALIGNED (HOLDS)** | `index.html` `as="font"`; Capsize `@font-face` `style.css:80-87` |
| C3 | `content-visibility` off-screen scenes | N-A-with-reason | **N-A (HOLDS — re-confirmed)** | one keyed `<Suspense>` scene above-the-fold; guide forbids `cv:auto` above-fold |
| C4 | fonts preload + non-blocking | ALIGNED | **ALIGNED (HOLDS)** | `index.html` `rel="preload"` |
| C5 | next-nav SPA route-chunk warmup | ALIGNED | **ALIGNED (HOLDS)** | `scenes.ts` `warmScene` (clause 6 green) |
| C6 | Interest Invokers hover-preview | N-A-with-reason | **N-A (HOLDS)** | `interestfor` Chrome-142-only, no FF/Safari (re-verified §3) |
| H1/H2 | native `<dialog>`/Popover/Invoker | OUT | **OUT (HOLDS — glass-ui seam)** | `KeyboardShortcutsModal.vue:2` reka-ui `<Dialog>` (role-div, not native) |
| H3 | HTML semantics | ALIGNED | **ALIGNED (HOLDS)** | `index.html` `lang="en"` |
| CSS1 | `:has()` parent-state | N-A-with-reason | **N-A (HOLDS)** | no live `:has()` site, none required |
| CSS2 | container queries | ALIGNED | **ALIGNED (HOLDS)** | `style.css` `container-type` |
| CSS3 | `dvh` over `vh` | N-A-with-reason | **N-A (HOLDS)** | E.W3-owned reconcile |
| CSS4 | `color-mix`/`oklab` | ALIGNED | **ALIGNED (HOLDS)** | `EasingTarget.vue` `color-mix` + engine oklab default |
| CSS6 | `linear()` physics easing | ALIGNED | **ALIGNED (HOLDS)** | `springLinearStops()` (Baseline 2023-12-11 re-verified) |
| CSS7 | `prefers-reduced-motion` per-case | ALIGNED | **ALIGNED (HOLDS)** | `internal/reduced-motion.ts` + hero PRM guard |
| UX1 | View Transitions scene-swap | ALIGNED | **ALIGNED (HOLDS)** | `App.vue` `view-transition-name`; focus-routed |
| C5b | Speculation Rules | N-A-with-reason | **N-A (HOLDS)** | SPA-excluded; Vite warmup is the SPA primitive |
| SEC1 | CSP / security headers | N-A-with-reason | **N-A (HOLDS)** | static CF-Pages SPA; OPTIONAL `<meta>`-CSP only |
| SEC2 | dangerous DOM sinks | ALIGNED | **ALIGNED (HOLDS)** | Vue auto-escape; CSS-paste → engine parser, no DOM sink |

> **G-finding MW-CHK-1 · the checklist is missing the post-F NEW rows — ADD them so the
> gate's "fully dispositioned" claim stays HONEST. — RECORD (gate-completeness) →
> MEASURE-FIRST-SHIP-candidate**
> The §S6 checklist (`proof-modern-web.mjs:401`) is authored as "EVERY checklist row's
> disposition" with the gate asserting "no row is left un-dispositioned"
> (`:390-392`). But the corpus has GROWN since F authored it: three Baseline-or-near
> levers that touch an animation/CSS demo have **no row** —
> `dynamic-sibling-animations` (`sibling-index()`/`sibling-count()`), the Custom Highlight
> API (`highlight-text-ranges`), and `<dialog closedby>` (`platform-controls-dismiss-dialog`).
> The gate's contract is "a reviewer sees the score in CI log" (`:594`); a contract that
> claims completeness while three new levers are unrecorded is the silent-incompleteness
> the Mandate forbids (`inv ε` — the checklist asserts a coverage it no longer has). Each
> NEW row re-scores **N-A/OUT** below (none is a SHIP), so adding them is **byte-cheap and
> changes no demo pixel** — it is the honest move, not gold-plating.
> - **Disposition:** **MEASURE-FIRST-SHIP-candidate** (add the three rows to the §S6
>   `CHECKLIST` array with their N-A/OUT reasons + the live Baseline string). **Instrument:**
>   the existing `proof:modern-web` gate — extend `CHECKLIST`; the gate already prints the
>   re-scored table to CI log (`:604-613`). A mutation control: delete any new row →
>   the recorded-coverage claim in the close message (`:626-631`) is again false. Trigger
>   to SHIP: any G demo-elevation wave touches `proof-modern-web.mjs`; otherwise RECORD.

---

## 2. The F BOOK / HAND-OFF ledger — re-checked for graduation (none graduated)

F left a small set of BOOKs + the one glass-ui-HANDOFF. I re-checked each against the LIVE
glass-ui 3.3.0 (now installed — F's D.W5 gated on 3.3.0; verified
`node_modules/@mkbabb/glass-ui/package.json` version `3.3.0`) and the LIVE catalog. **None
has graduated to shippable; each disposition HOLDS, re-grounded.**

### MW-VT-1 · View-Transition directional **types** — STILL glass-ui-blocked — **glass-ui-HANDOFF (HOLDS, re-grounded)**

- **The F call:** H-1 (`r-scroll-vt-2026`) — glass-ui's `startViewTransition` must grow a
  `{ types }` param so the demo's most-seen motion (scene swap) can become directional
  (`:active-view-transition-type(forward|backward)`); B-1 the demo consume, BOOKed behind it.
  VT types are Baseline **2026-01-13** (re-verified this audit:
  `directional-navigation-transitions` → "Active view transition … Baseline since 2026-01-13").
- **G re-grounding (the decisive new fact):** glass-ui advanced to **3.3.0**, but its
  `startViewTransition` is **STILL bare-callback-only** — verified against the SHIPPED dist
  twice over:
  1. The TypeScript declaration is unambiguous —
     `node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts:31`:
     `export declare function startViewTransition(mutate: () => void): ViewTransitionResult;`
     — a single `mutate: () => void`, NO options object, NO `types`.
  2. The minified impl (`useViewTransition-D4ssvnXZ.js`) is
     `let n = t.startViewTransition(() => e());` — it never forwards an options object to
     `document.startViewTransition`.
  The demo correspondingly still ships the bare callback
  (`useSceneTransition.ts:32`), and a grep for any direction derivation
  (`forward`/`backward`/`active-view-transition`/`view-transition-class`) over `demo/`
  finds ZERO VT-types usage (only unrelated `forward` in `useSceneUrl.ts` /
  menubar). So H-1 did NOT land in 3.3.0 and B-1 remains hard-blocked.
- **Disposition:** **glass-ui-HANDOFF (HOLDS)** — the enabler is glass-ui-owned; the demo
  must CONSUME the `types` param, not hand-roll `document.startViewTransition({...})` (that
  would bypass glass-ui's feature-detect + instant fallback — the exact duplication
  `r-scroll-vt-2026` §0.2 forbids). inv-16 is RELAXED for G impl (the user drives glass-ui
  too), so this is now an **actionable cross-repo HAND-OFF** the user CAN sequence in G:
  the additive glass-ui overload `startViewTransition(mutate, options?: { types?: string[] })`
  (the exact shape in `r-scroll-vt-2026` H-1 §"the exact hand-off shape") → then the demo
  B-1 is a ≤5-line consume (derive direction from the ordered `scenes.ts` index, pass
  `{ types: [dir] }`).
- **MEASURE-FIRST clause (carried, sharpened):** a directional SLIDE of a *paused
  snapshot* of a mid-rotate cube/sphere may read WORSE than the current calm cross-fade
  (the snapshot-vs-active-animation objection, `r-scroll-vt-2026` B-1 reason 3). The types
  ride the `::view-transition-group(root)` cross-fade, so verify it composes with the
  `useSceneSwap` spring stand-down (the spring stands down only when
  `supportsViewTransitions()`) BEFORE shipping. PRM-gate is already free
  (glass-ui `view-transition.css`).
- **If SHIPPED in G:** instrument = a `proof:demo-elevate` clause asserting
  `useSceneTransition.ts` passes a `types`-bearing options object AND a derived direction;
  mutation = revert to the bare callback → reds.

### MW-INV-1 · Invoker Commands (`command`/`commandfor`) — the BOOKed `Mod+K`/show-modal idiom — **BOOK (HOLDS)**

- **The F call:** F-MW-1 — KILL the wholesale `@click`→Invoker rewrite (Vue-idiom
  collision + glass-ui seam + no measured win); BOOK the one teaching surface (a
  declarative-controls showcase / the `Mod+K` palette via `command="show-modal"`). Invoker
  Commands are Baseline **2025-12-12** (re-verified: `declarative-button-actions` →
  "Invoker commands: … Baseline since 2025-12-12").
- **G re-grounding:** the LIVE demo carries the F BOOK exactly — `EditorShell.vue:20`
  documents the forward idiom *as a comment* ("the Invoker `command="show-modal"`"), the
  visible shortcuts trigger landed as the pragmatic `@click="shortcutsOpen = true"`
  (`:30`), and a grep for actual `commandfor`/`command=` over `demo/` finds ZERO usage
  (the only hit is that comment). The F reasoning still holds: a hydrated Vue SPA gains
  *declarativeness*, not perf or correctness, from rewriting bound `@click` handlers; the
  guide's value-prop ("interactivity as soon as HTML is parsed") does not bite a hydrated
  app. The dialog primitive itself is reka-ui (glass-ui seam, the H1/H2 OUT row).
- **Disposition:** **BOOK (HOLDS)** — the wholesale rewrite stays KILLED. The one honest
  SHIP-candidate is a single self-contained `<button command="--play" commandfor="…">`
  *teaching scene* that dogfoods the platform's declarative-action primitive against an
  `Animation` (the inv-ζ "demo eats the platform" posture), Baseline-safe with the
  documented `invokers-polyfill` dynamic-import fallback. **Trigger to SHIP:** a G
  demo-content wave with appetite for a new scene; **do NOT** touch the existing `@click`
  controls. **Instrument if SHIPPED:** a `proof:demo-elevate` clause that the showcase
  scene's button carries `command` + a `command`-event listener drives the engine.

### MW-IS-1 · `interpolate-size`/`calc-size()` (`height: 0 → auto`) — **RECORD (HOLDS — still not Baseline)**

- **G re-grounding:** re-verified live — `animate-to-intrinsic-sizes` →
  "interpolate-size has limited availability. Unsupported in: Firefox and Safari";
  "calc-size() has limited availability. Unsupported in: Firefox and Safari." Unchanged
  since F (Chrome-only). The F gap-scorecard I1 named this the single most-requested
  animation a keyframes library structurally cannot do, GAP-NAMED as a value.js-gated
  engine wave (the `calc-size()` parser hand-off) + a NOT-Baseline `don't-delegate-natively`
  RECORD. Nothing moved.
- **Disposition:** **RECORD (HOLDS)** — the engine `IntrinsicSizeValue` branch is a
  value.js-HANDOFF (the `calc-size()` parser); native delegation stays withheld until
  Baseline. The demo's collapsible panels work via Vue `<Transition>` / engine springs;
  do not gold-plate a Chrome-only nicety. **Trigger:** Firefox+Safari ship `interpolate-size`.

---

## 3. NEW catalog levers (genuinely newer than the F lanes) — each correctly NOT adopted

The F r-modern-web lane (`tranche-e-impl`) enumerated the catalog as of 2026-06-05. The
LIVE corpus (137 guides, this audit) adds levers the F lanes could not score. I searched
the corpus for animation/CSS/demo-relevant new items; three survive as genuinely-new, each
re-disposed honestly (none a SHIP):

### MW-NEW-1 · `dynamic-sibling-animations` (`sibling-index()`/`sibling-count()`) — the staggered-CSS lever — **RECORD (not Baseline)**

- **NEW since F:** the guide `dynamic-sibling-animations` documents
  `animation-delay: calc(sibling-index() * 0.1s)` — a PURE-CSS stagger keyed off the
  element's position in its sibling list, NO JS delay-loop. This is **directly adjacent to
  keyframes.js's domain**: it is the platform-native form of the engine's `stagger`
  primitive (E.W10) AND of the demo hero's hand-computed per-word delay
  (`AnimatedText.vue:19` — `animationDelay: \`${index * offset}s\``, a JS-computed delay
  the lever would let CSS own).
- **Baseline (verified live):** "sibling-count() and sibling-index() has limited
  availability. **Unsupported in: Firefox.**" → NOT Baseline.
- **Disposition:** **RECORD (do not adopt — not Baseline).** The honest call: the demo's
  per-word `animationDelay` is a Vue-template binding over a `v-for` index — idiomatic Vue,
  not a hand-rolled scheduler, and it works on all engines. Swapping it to `sibling-index()`
  would *break the stagger on Firefox* (instant fallback = all-words-at-once) for a
  declarativeness gain only — the Mandate forbids a not-Baseline regression of a working
  surface. The ENGINE's `stagger` is a JS primitive over arbitrary targets (the strictly
  more general form, like the ScrollTimeline ARCH-kill) — `sibling-index()` is DOM-CSS-only
  and cannot stagger non-DOM objects, so it is no engine threat either. **Trigger to
  revisit:** Firefox ships `sibling-index()` → it becomes a candidate for the demo hero's
  delay (a ≤2-line CSS swap) AND a teaching note that the CSS platform caught up to the
  engine's stagger. Add as a §S6 row N-A-with-reason now (MW-CHK-1).

### MW-NEW-2 · Custom Highlight API (`highlight-text-ranges`, `::highlight()`) — **RECORD (no clean fit)**

- **NEW since F:** `highlight-text-ranges` crossed **Baseline 2026-03-24** (verified:
  "Custom highlights: Newly available. … Baseline since 2026-03-24") — the
  `CSS.highlights` + `Highlight(Range…)` + `::highlight(name)` surface for painting
  arbitrary text ranges without DOM mutation.
- **Disposition:** **RECORD (no clean keyframes-demo fit).** The one plausible surface —
  highlighting matched ranges in the CSS-paste / Monaco editor — is **owned by Monaco's
  own decorations API** (Monaco is the editor; it does not delegate range-highlighting to
  the platform). Painting the keyframe-percent labels or the timeline scrub is not a
  text-range problem. There is no honest demo seam where the Custom Highlight API removes
  hand-rolled work; manufacturing one would be gold-plating. Add as a §S6 row
  N-A-with-reason (MW-CHK-1). **Trigger:** a future non-Monaco text surface needing
  search-result highlighting.

### MW-NEW-3 · `<dialog closedby>` (`platform-controls-dismiss-dialog` / `light-dismiss-a-dialog`) — **OUT (glass-ui/reka-ui seam)**

- **NEW since F:** the `closedby` attribute (`<dialog closedby="any|closerequest|none">`)
  declaratively configures light-dismiss for native `<dialog>`.
- **Baseline (verified live):** "`<dialog closedby>` has limited availability. **Unsupported
  in: Safari.**" → NOT Baseline.
- **Disposition:** **OUT (glass-ui seam, HOLDS the H1/H2 row logic).** The demo's only
  modal — `KeyboardShortcutsModal.vue:2` — is a reka-ui `<Dialog>` (a role-div +
  JS FocusScope, NOT a native `<dialog>`; verified). `closedby` is a *native*-`<dialog>`
  attribute; it has no surface on a reka-ui role-div, and migrating reka-ui→native is
  glass-ui/reka-ui's seam (the H1/H2 OUT reason at `proof-modern-web.mjs:453-459`), not a
  demo patch — AND it is Safari-unsupported anyway. Double-disqualified. Add as a §S6 row
  OUT (MW-CHK-1). **Trigger:** glass-ui/reka-ui migrates its Dialog to native `<dialog>`
  AND Safari ships `closedby` (a two-condition gate).

> **Also surfaced, re-confirming F's existing dispositions (no change):**
> `scroll-progress-indicator` / `scrollytelling` / `parallax-scroll-effects` /
> `scroll-entry-exit-effects` — all `Scroll-driven animations` (limited, Firefox-gated)
> on a demo with NO document-scroll axis (`r-scroll-vt-2026` A-4, fixed `h-dvh` editor) —
> **N-A (HOLDS).** `physics-based-easing` (`linear()`, Baseline 2023-12-11) — the engine
> is the REFERENCE IMPL (`springLinearStops()`, CSS6 ALIGNED) — **ALREADY-SOTA.**
> `break-up-long-tasks` / `schedule-tasks-by-priority` (Scheduler API, no-Safari) — the
> engine's `scheduler.yield` ladder already covers the demo's one heavy path
> (`r-cwv-inp-2026` B-3, `postTask('background')` BOOK) — **BOOK (HOLDS).**
> `soft-edge-content-fade` (Masks, Baseline 2023) — the cross-engine alternative to the
> not-Baseline scroll-state CQ for panel edge-fades (`r-modern-web-2026` F-MW-6); a
> LOW-value polish, **BOOK (HOLDS)** if a polish wave wants panel edge-fades.

---

## 4. ALREADY-SOTA — manufacture NO work (the bulk; stated plainly)

Re-confirmed live on `tranche-g-dev` — every lane independently agrees and the Mandate
forbids manufacturing a deficit:

- **View Transitions** — landed, feature-detected, focus-routed, PRM-gated, with the
  `SpringProgress` engine-dogfood preserved as the no-VT fallback. The ONLY forward motion
  is directional types (MW-VT-1), still glass-ui-blocked. (`useSceneTransition.ts`,
  `useSceneSwap.ts`)
- **`@starting-style` + `transition-behavior: allow-discrete`** — a first-class dedicated
  scene (`StartingStyleScene.vue` / `StartingStyleTarget.vue`) with the MANDATORY
  separate-`transition-behavior` declaration. Textbook. (`r-modern-web-2026` §3)
- **`content-visibility: hidden`** Monaco cache + `inert` + `@supports not` fallback +
  focus-on-reveal + Monaco re-measure (`AnimationControls.vue:286-296,200-222`).
  (`r-cwv-inp-2026` A-2)
- **Individual transform properties / `color-mix(oklab)`** in author CSS, and the engine's
  default renderer passes individual `translate`/`rotate`/`scale` through natively
  (`utils.ts` `setProperty` per flattened key). (`r-modern-web-2026` F-MW-3 + CSS4)
- **`text-wrap: pretty`** (prose) + **`text-wrap: balance`** (hero) — F.W13/W16,
  Firefox-fallback-noted, leak-gated. (`EditorStartScreen.vue:68`, `AnimatedText.vue`)
- **The `@property` registry adopt** — `engine.ts:1262-1281`, feature-detected, throw-swallowed.
  (`proof:platform-adopt` S1)
- **The CWV/INP surface** — Capsize font-CLS fallback, the all-four-scenes background
  pause (`useSceneVisibilityPause`), `yieldToMain`/LoAF/bf-cache, the SPA Vite hover-warmup,
  the lighthouse honest-withhold. **No FOLD-in-G CWV wave to manufacture.** (`r-cwv-inp-2026`
  headline)
- **The engine reference-impl posture** — `scheduler.yield` ladder, the one PRM gate
  (`internal/reduced-motion.ts`, live-observed), WAAPI compositor delegation, `linear()`
  physics, the additive native ScrollTimeline bridge with the JS-sampler ARCH-kill.
- **The F.W16 hero a11y substrate** — sr-only mirror + aria-hidden decorative layer +
  PRM guard + word-granular stagger; the LCP element done right. (`AnimatedText.vue:12-25`)
- **The `proof:modern-web` gate itself** — 7 falsifiable clauses (corpus-on-disk,
  Monaco-deferred bundle probe, font-preload, demo-yield, loop-yield, hover-warmup, the
  §S6 checklist) each with a named mutation control. The ONE honest gap is the
  three-missing-rows completeness drift (MW-CHK-1), itself byte-cheap.

---

## 5. Disposition roll-up

| # | Finding | NEW-since-F? | Baseline (live) | Disposition |
|---|---|---|---|---|
| MW-CHK-1 | §S6 checklist missing 3 post-F catalog rows — completeness drift | — | — | **MEASURE-FIRST-SHIP-candidate** (add 3 N-A/OUT rows; instrument = `proof:modern-web`) |
| MW-VT-1 | VT directional **types** — glass-ui 3.3.0 STILL bare-callback-only | re-grounded | VT types Baseline 2026-01-13 | **glass-ui-HANDOFF (HOLDS)** + demo BOOK (B-1), MEASURE-FIRST |
| MW-INV-1 | Invoker `command`/`commandfor` teaching scene | re-grounded | Baseline 2025-12-12 | **BOOK (HOLDS)** — wholesale rewrite KILLED; one showcase SHIP-candidate |
| MW-IS-1 | `interpolate-size`/`calc-size()` (`height:0→auto`) | re-grounded | limited (no FF/Safari) | **RECORD (HOLDS)** + value.js-HANDOFF (the parser, GAP-NAMED) |
| MW-NEW-1 | `sibling-index()` CSS stagger | **YES** | limited (no Firefox) | **RECORD** (not Baseline; demo `v-for` delay is correct; engine stagger is more general) |
| MW-NEW-2 | Custom Highlight API `::highlight()` | **YES** | Baseline 2026-03-24 | **RECORD** (no clean fit — Monaco owns editor highlighting) |
| MW-NEW-3 | `<dialog closedby>` light-dismiss | **YES** | limited (no Safari) | **OUT** (reka-ui role-div seam + Safari-unsupported) |
| §S6×18 | all 18 existing checklist rows | re-scored | — | **ALL HOLD** (none flipped, none regressed) |
| §4 | VT · `@starting-style` · `content-visibility` · individual-transform · `color-mix` · text-wrap · `@property` · CWV · engine reference-impl · hero a11y | — | — | **ALREADY-SOTA — KEEP** |

**Net.** The post-F demo is **exemplary** on the modern-web axis — F.W4/W11/W13/W15/W16
landed View Transitions, `text-wrap: pretty`/`balance`, `content-visibility`, the
`@property` adopt, the hero a11y substrate, and the `proof:modern-web` checklist gate, and
**every one of the 18 existing §S6 rows re-scores HOLD on the live `tranche-g-dev` tree**.
The single forward motion the F lanes named — VT directional **types** — is STILL
upstream-blocked: glass-ui advanced to 3.3.0 but its `startViewTransition` is verified
**bare-callback-only** (`useViewTransition.d.ts:31`), so the H-1 hand-off did NOT land and
B-1 stays BOOKed — now an actionable cross-repo HAND-OFF the user CAN sequence in G under
the relaxed inv-16. The genuinely-NEW catalog levers (`sibling-index()`, Custom Highlight
API, `<dialog closedby>`) are each **correctly NOT adopted** — not Baseline, no clean fit,
or a glass-ui/reka-ui seam. **The one byte-cheap honest SHIP is MW-CHK-1** — add the three
new catalog rows to the §S6 checklist (each N-A/OUT) so the gate's completeness claim stays
truthful, changing ZERO demo pixels. **G should NOT manufacture a modern-web wave; it
should drive the glass-ui VT-types hand-off (if a motion-polish wave wants it,
measure-first), record the three new levers in the gate, and leave the exemplary surface
alone.**

---

## 6. inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/G/audit/r-modern-web.md` — ZERO source edits. Every
keyframes/demo claim is `file:line`-grounded on `tranche-g-dev`, verified not asserted (the
bare-callback glass-ui helper at `useViewTransition.d.ts:31` + the minified impl chunk; the
demo bare-callback at `useSceneTransition.ts:32`; the `@property` adopt at `engine.ts:1262-1281`;
the §S6 checklist at `proof-modern-web.mjs:401-551`; the hero substrate at `AnimatedText.vue:12-25`;
the text-wrap SHIP at `EditorStartScreen.vue:68`; the Invoker comment-only at
`EditorShell.vue:20`). Every Baseline string is the live `modern-web-guidance@latest
retrieve` output at this audit (VT types 2026-01-13; Invoker 2025-12-12; `sibling-index()`
no-Firefox; Custom Highlight 2026-03-24; `closedby` no-Safari; `interpolate-size`/`calc-size()`
no-FF/Safari; `linear()` 2023-12-11). The MW-VT-1 cross-repo item is a **glass-ui-HANDOFF**
(propose the additive `{ types }` overload; the user drives glass-ui under relaxed inv-16);
MW-IS-1 carries a **value.js-HANDOFF** (the `calc-size()` parser, already in the F charter).
No NEW value.js surface is opened by this lane.

### Re-runnable evidence

```sh
# glass-ui 3.3.0 startViewTransition is STILL bare-callback (MW-VT-1 blocker):
grep -n "export declare function startViewTransition" \
  node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts
#   → :31 startViewTransition(mutate: () => void): ViewTransitionResult   (no { types })
grep '"version"' node_modules/@mkbabb/glass-ui/package.json                 # → 3.3.0

# Demo still ships the bare callback; ZERO VT-types/direction derivation:
grep -n "startViewTransition" demo/app/useSceneTransition.ts                # → :32 (() => mutate(id))
grep -rn "active-view-transition\|view-transition-class\|types:" demo | grep -v dist  # → 0 VT-types

# Invoker is comment-only (BOOKed forward idiom); no real usage:
grep -rn "commandfor\|command=" demo | grep -v dist                        # → only EditorShell.vue:20 comment

# The §S6 checklist (the central re-disposed artifact) + the gate's completeness claim:
sed -n '401,410p' scripts/proof-modern-web.mjs                             # → const CHECKLIST = [ ... ]

# NEW catalog Baselines (this audit):
npx -y modern-web-guidance@latest retrieve dynamic-sibling-animations | grep -i "limited\|unsupported"
#   → sibling-count()/sibling-index() limited; Unsupported in: Firefox.
npx -y modern-web-guidance@latest retrieve highlight-text-ranges | grep -i "baseline since"
#   → Custom highlights: Baseline since 2026-03-24.
npx -y modern-web-guidance@latest retrieve platform-controls-dismiss-dialog | grep -i "unsupported"
#   → <dialog closedby> Unsupported in: Safari.

# Already-SOTA anchors (live):
grep -n "registerProperty" src/animation/engine.ts                         # → :1262-1281 (@property adopt)
grep -n "text-wrap: pretty" demo/@/components/custom/editor-shell/EditorStartScreen.vue  # → :68
grep -n "sr-only\|aria-hidden" demo/@/components/custom/AnimatedText.vue    # → :12-13 (hero substrate)
```
