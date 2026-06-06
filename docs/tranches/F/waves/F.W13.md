# F.W13 — Baseline-platform adopts (the `text-wrap: pretty` SHIP sliver · the VT-types glass-ui-HANDOFF · the booked platform layers)

**Phase:** IMPL · **Class:** PATCH (demo — one ≤1-line scoped `text-wrap: pretty` on
demo-owned prose; the library is UNTOUCHED; everything else is a glass-ui hand-off or a BOOK)
· **Scope:** `demo/@/components/custom/editor-shell/EditorStartScreen.vue:22-31` (the
start-screen subtitle/hint prose) — Band 4, the Baseline-platform adopts · **DAG: F.W13
depends on a Baseline date + a glass-ui hand-off** (`F.md §The DAG` — the VT-types upgrade is
hard-blocked on glass-ui's `startViewTransition` growing a `types` param) · **Gated on:**
keyframes' own green CI (inv-27).

**Title.** *The modern-web frontier moved twice since E.W11 — View-Transition types crossed
Baseline (2026-01-13) and Invoker Commands crossed Baseline (2025-12-12) — but the post-E demo
is already exemplary on this axis. F's honest residual is ONE ≤1-line SHIP (`text-wrap: pretty`
on the start-screen prose), ONE glass-ui-HANDOFF (the VT-types helper, the enabler the demo
cannot write), and BOOKs for the layers gated on it.*

The post-E demo is **~90% SOTA** on the modern-web axis (`r-modern-web-2026 §3`, `r-scroll-vt-
2026 §0`): View Transitions are landed, feature-detected, focus-routed, PRM-gated with the
engine-dogfood fallback preserved; `@starting-style`+`allow-discrete` is a dedicated teaching
scene; `content-visibility: hidden` carries the exact `@supports` fallback; individual transform
properties + `color-mix` are adopted; the engine is the reference impl of `scheduler.yield`/
WAAPI-delegation/`linear()`-spring/PRM. The honest headline of BOTH the modern-web and scroll-VT
lanes is *manufacture NO modern-web wave* (`r-modern-web-2026 §5` Net; `r-scroll-vt-2026 §5`
Net). What is genuinely net-NEW: (1) the **VT-types API** became Baseline 2026-01-13 (post-W11,
which shipped the bare callback) — but the enabler is **glass-ui-owned** (its
`startViewTransition` is bare-callback-only), so it is a **glass-ui-HANDOFF**, not a keyframes
SHIP; (2) **Invoker Commands** crossed Baseline — a teaching-scene candidate, NOT a `@click`
rewrite (KILL the wholesale rewrite as gold-plating); (3) `text-wrap: pretty` on the demo's own
prose is the one ≤1-line demo-owned SHIP. Everything else is correctly-deferred-not-Baseline
(`interpolate-size`, interest invokers, scroll-state CQ), structurally N-A (cross-doc VT on a
hash SPA), or already-landed.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO workaround: the VT-types
upgrade is hard-blocked on glass-ui's helper — F does NOT hand-roll `document.startViewTransition
({update, types})` in the demo (that bypasses the substrate's feature-detect + instant fallback,
re-introducing the duplication inv-16 forbids, `r-scroll-vt-2026 H-1`/B-1); it routes OUT as a
glass-ui-HANDOFF and BOOKs the consume. NO legacy / NO gold-plating: the `@click`→Invoker rewrite
is KILLED (a Vue SPA's `@click="play()"` is the idiomatic binding; moving it to a global command
registry is LESS legible, `r-modern-web-2026 F-MW-1`). NO Chromium-only path forced onto a working
surface: `interpolate-size` stays RECORD (no FF/Safari), the `0fr→1fr` grid trick stays
ALREADY-SOTA. Measure-first BINDS the VT-types BOOK (a directional slide of a paused snapshot of a
spinning cube may read WORSE than the calm cross-fade — verify it composes before shipping,
`r-scroll-vt-2026 B-1`/`r-modern-web-2026 F-MW-2`). inv-16: the VT-types helper is a glass-ui item,
recorded distinctly from the value.js ledger. inv ε: every claim cites `file:line` + the live
Baseline string.

**Provenance.** `r-scroll-vt-2026 H-1` (the VT-types glass-ui-HANDOFF) + `B-1` (the demo
directional/typed scene-VT BOOK, gated on H-1) + `B-2` (`view()` reveal BOOK); `r-modern-web-2026
F-MW-1` (Invoker Commands — BOOK the showcase, KILL the rewrite), `F-MW-2` (VT-types — small SHIP
IF glass-ui takes `types`, else glass-ui OUT), `F-MW-4` (`interpolate-size` RECORD); `r-demo-design
-2026 §5b` (`text-wrap: pretty` on the start-screen subtitle — SHIP-in-F or BOOK), `§4` (directional
VT now Baseline — BOOK), `§5a` (fluid display type — glass-ui ASK).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`, with the LIVE Baseline strings:

1. **`text-wrap: pretty` is NOT on the demo's running prose; the start-screen subtitle/hint are
   multi-line prose under `text-wrap: balance`.** `r-demo-design-2026 §5b` (re-grounded): the
   start-screen `<h2 class="text-title">` (subtitle) + `<h2 class="text-subheading">` (hint) at
   `EditorStartScreen.vue:22-31` are multi-line prose; glass-ui sets `text-wrap: balance` on
   `.text-title`/`.text-subheading` (`node_modules/@mkbabb/glass-ui/dist/styles/typography.css`,
   the `.text-*` family carries `text-wrap: balance`, verified `:162,:198,:209,:220,:231,:242,
   :253,:264`). For *running prose* (the subtitle's "from the list below, then press Play." copy)
   the orphan-avoidance `pretty` is the better fit than `balance` (the short-heading algorithm).
   `text-wrap: pretty` is **Chrome/Safari only, no Firefox** (`improve-text-layout-and-legibility`)
   → a pure progressive enhancement. It is demo-owned (a scoped rule on the demo's own
   `EditorStartScreen` prose), ≤1 line.

2. **The demo's VT call is the BARE callback — the VT-types Baseline (2026-01-13) is post-W11.**
   `r-scroll-vt-2026 H-1` (verified live): `demo/app/useSceneTransition.ts:32` —
   `startViewTransition(() => mutate(id))`, the bare-callback form (the demo's most-seen motion,
   `useSceneTransition.ts:7`). The **VT-types API** (`{ update, types }` + `:active-view-transition
   -type()`) is Baseline Newly available **2026-01-13** (Chrome/Edge 125, FF 147 Jan-2026, Safari
   18.2) — AFTER W11 was authored, so W11 could only use the bare form (`r-scroll-vt-2026 §0.1`).

3. **The glass-ui `startViewTransition` helper is bare-callback-only — the BLOCKER.**
   `r-scroll-vt-2026 H-1` (verified): glass-ui 3.2.0
   `node_modules/@mkbabb/glass-ui/dist/useViewTransition-CUJM7fXT.js` body is
   `let n = t.startViewTransition(() => e());` — it takes a single `mutate` callback and NEVER
   forwards an options object. There is NO path through this helper to pass `{ update, types }`,
   so the demo CANNOT set a transition type, so it cannot drive `:active-view-transition-type()`.
   The VT/scroll-CSS substrate is glass-ui-owned (`r-scroll-vt-2026 §0.2`): the engine ships ZERO
   VT surface (`grep -rn "startViewTransition" src/` → 0), correctly. So the types upgrade is a
   glass-ui concern, NOT a keyframes-engine concern.

4. **The demo has ZERO declarative Invoker commands today; the `@click` controls are idiomatic
   Vue.** `r-modern-web-2026 F-MW-1` (verified): `grep -rn "commandfor|command=|interestfor" demo
   --include=*.vue | grep -v dist` → **0**. The demo's controls are imperative `@click` handlers
   (`AnimationMenuBar.vue`, `PlaybackRibbon.vue`, etc.); Invoker Commands crossed Baseline
   **2025-12-12** (all four engines). A wholesale `@click`→`command="--play"` rewrite would move
   the wiring out of the SFC template into a global registry — LESS legible for a hydrated Vue SPA,
   with NO measured win (the controls have no INP/correctness problem) → KILL the rewrite; the
   single self-contained "declarative controls" showcase scene is the only narrow opportunity → BOOK.

5. **`interpolate-size`/`calc-size()` is unchanged-limited; the `0fr→1fr` grid trick is
   ALREADY-SOTA.** `r-modern-web-2026 F-MW-4` (verified): `interpolate-size: allow-keywords` is
   **Chrome/Edge 129 only (Sep-24), no FF/Safari** ("limited", live guide). The demo's working
   cross-browser `0fr→1fr` grid-row height trick is preferable on today's Baseline (E.W9 §Folds,
   re-confirmed) → RECORD don't-adopt-until-Baseline. (The engine `IntrinsicSizeValue` wave is
   GAP-NAMED, gated on value.js `calc-size()` E7 — `F.md §GAP-NAMED`, NOT this wave's scope.)

The wave's job: SHIP the one ≤1-line demo-owned `text-wrap: pretty`; route the VT-types helper OUT
as a glass-ui-HANDOFF; BOOK the layers gated on it; name the GAP-NAMED engine waves gated on
value.js — each closed by a falsifiable presence/disposition gate.

---

## § Goal

**What lands** (one demo-owned progressive enhancement — `proof:demo-elevate`'s text clause green):

- **`text-wrap: pretty` on the start-screen subtitle/hint prose** — a scoped, demo-owned rule on
  the running-prose `<h2>`s at `EditorStartScreen.vue:22-31` (NOT the LCP `<h1>` hero, which is
  `balance`-class short-heading — that is F.W16's typography substrate). Progressive enhancement:
  Chrome/Safari get orphan-avoidance; Firefox unchanged. ≤1 line.

**Routed OUTWARD as glass-ui-HANDOFF** (the enabler the demo cannot write — inv-16, recorded in
`valuejs-sota-handoff-v2.md` as a glass-ui item, distinct from the value.js ledger):
- **H-1 — `startViewTransition` must accept `{ types }`** (the 2026 VT-types API). The glass-ui
  helper grows an overload: `startViewTransition(mutate, { types? })` → `document.startView
  Transition({ update, types })` where the object form is supported, falling back to the bare-
  callback form and the instant-mutate fallback where not; the `{ finished, transitioned }` return
  contract unchanged; the PRM degrade already in glass-ui's `view-transition.css` applies to typed
  transitions. **glass-ui-HANDOFF** (owner = glass-ui); enables the B-1 demo BOOK.

**Recorded-BOOK** (named, dispositioned, NOT this wave):
- **The typed/directional scene-VT** (`B-1`/`F-MW-2`/`r-demo-design-2026 §4`) — once H-1 lands,
  derive a direction from the ordered scene list and pass `{ types: ['forward'|'backward'] }`,
  keying slide rules off `:active-view-transition-type()`. **BOOK**, gated on H-1 + MEASURE-FIRST
  (a directional slide of a paused spinning-cube snapshot may read worse than the calm cross-fade —
  verify it composes; PRM-gate is free).
- **The `Mod+K` command palette via Invoker** (`F-MW-1`/E-UX-1's booked follow-up) — the single
  declarative-controls showcase scene behind `'commandForElement' in HTMLButtonElement.prototype` +
  the `invokers-polyfill` dynamic-import ladder. **BOOK** (the wholesale `@click` rewrite is KILLED).
  (The minimal visible shortcuts-discovery trigger SHIPs in F.W15; this is the richer palette.)
- **`view()` entry-reveal on the easing-scene track** (`B-2`) — **BOOK** (PE-only decorative;
  glass-ui owns the recipe — consume, never hand-roll; scroll-driven did NOT advance to Baseline).
- **`interpolate-size`/`calc-size()` intrinsic-size** (`F-MW-4`/`I1`/`NEW-37`) — **RECORD**
  don't-adopt-until-Baseline (Chrome-only); the GAP-NAMED engine `IntrinsicSizeValue` wave is gated
  on value.js `calc-size()` E7 (named below).
- **SplitText analogue** (`S3`/`NEW-36`) — **BOOK** (value.js-free `splitText({by})` over
  `Intl.Segmenter`; the demo grapheme-fix is F.W16 §S2).
- **Fluid display type** (`r-demo-design-2026 §5a`) — **glass-ui ASK** (fluid `.text-display-*`
  rungs benefit every glass-ui consumer; author once in the dependency, not a demo override).

**GAP-NAMED engine waves (gated on value.js — NOT in F's keyframes-local scope yet):**
- **`height: 0 → auto` intrinsic-size** (`I1`/`NEW-37`) — a new engine `IntrinsicSizeValue` interp
  branch (native PE fast-lane via `interpolate-size`/`calc-size()` + a JS-measure fallback), gated
  on the **value.js `calc-size()` parser (E7)**. Native is NOT Baseline (Chrome-only) → RECORD
  don't-adopt-the-native-delegation-until-Baseline.
- **MorphSVG / DrawSVG / numeric MotionPath** → **value.js-HANDOFF VJ-F1** (the path-geometry
  sampler; the CSS-native MotionPath sliver SHIPs in F.W12).
- **SplitText** → **BOOK** (value.js-free; the demo grapheme-fix folds into F.W16).

**Why:** the post-E demo is exemplary on the modern-web axis — the lanes' honest headline is *do
NOT manufacture a modern-web wave*. F records the two genuinely-new Baseline deltas, ships the one
≤1-line demo-owned enhancement, routes the VT-types enabler to its rightful owner (glass-ui), and
names the engine waves that genuinely depend on value.js — so the record is accurate and no future
lane re-litigates what is already SOTA or hand-rolls what is upstream-owned.

---

## § Scope

One demo-owned SHIP lands (S1); one item routes OUT (S2 glass-ui-HANDOFF); the rest are BOOK +
GAP-NAMED. Every claim is `file:line`-grounded.

### S1 — `text-wrap: pretty` on the start-screen subtitle/hint prose (`r-demo-design-2026 §5b`) — SHIP-in-F

**WHAT:** add a scoped `text-wrap: pretty` to the demo-owned running-prose `<h2>`s at
`EditorStartScreen.vue:22-31` (the `.text-title` subtitle + `.text-subheading` hint) — either a
scoped style block or a utility on those elements specifically. NOT the LCP `<h1>` hero (which is
`balance`-class short-heading — F.W16 owns its typographic substrate). NOT a glass-ui override (the
`.text-*` utilities are glass-ui's; this is a demo-scoped addition on the demo's own elements).

**WHY:** the subtitle/hint are multi-line *running prose*, for which `text-wrap: pretty`
(orphan-avoidance) is the better fit than the `balance` glass-ui applies (the short-heading
algorithm) (`r-demo-design-2026 §5b`). It is a pure progressive enhancement — Chrome/Safari get
the improvement, Firefox is unchanged (`text-wrap: pretty` Chrome/Safari-only, no FF) — and it is
demo-owned + ≤1 line, so it is a clean SHIP, not a glass-ui ASK.

### S2 — Route the VT-types helper OUT as a glass-ui-HANDOFF (`r-scroll-vt-2026 H-1`) — glass-ui-HANDOFF

**WHAT:** record (in `valuejs-sota-handoff-v2.md`, as a glass-ui item) the exact hand-off: glass-ui's
`startViewTransition` grows `(mutate, options?: { types?: string[] })` → `document.startView
Transition({ update: () => mutate(), types })` where the object form is supported, else the current
bare-callback form, else the instant-mutate fallback; the `{ finished, transitioned }` contract and
the PRM degrade unchanged. The demo writes NOTHING here (inv-16 — the enabler is glass-ui-owned;
hand-rolling `document.startViewTransition({...})` in the demo would bypass the substrate's
feature-detect + instant fallback, re-introducing the duplication §0.2 forbids).

**WHY:** the VT-types API is the canonical Baseline-2026 upgrade to the demo's most-seen motion, but
the blocker is upstream (glass-ui's helper is bare-callback-only, State 3) and the engine correctly
ships zero VT surface (the boundary, `r-scroll-vt-2026 A-2`). So the honest disposition is a clean
hand-off + a sequenced demo BOOK (B-1), NOT a keyframes SHIP — the same line E drew (the VT/scroll-
CSS substrate is glass-ui's).

> **BOOK / GAP-NAMED / RECORD in this band (named, NOT this wave):**
> - **B-1 — typed/directional scene-VT** (`r-scroll-vt-2026 B-1`/`r-modern-web-2026 F-MW-2`/
>   `r-demo-design-2026 §4`) — **BOOK**, gated on H-1 + MEASURE-FIRST. A one-line demo consume the
>   moment glass-ui ships the `types` param: derive a direction from the ordered scene list, pass
>   `{ types: [direction] }`. Verify the spring stands down correctly on the typed VT path
>   (`useSceneSwap.ts:35`) and that a directional slide of a paused spinning-cube snapshot does NOT
>   read worse than the calm cross-fade before shipping.
> - **The `Mod+K` palette via Invoker** (`r-modern-web-2026 F-MW-1`) — **BOOK** (the single
>   declarative-controls showcase scene behind the `'commandForElement' in HTMLButtonElement.
>   prototype` detect + `invokers-polyfill` ladder); **KILL** the wholesale `@click`→Invoker rewrite
>   (gold-plating; a Vue SPA's `@click` is idiomatic). The minimal visible shortcuts trigger SHIPs in
>   F.W15.
> - **`view()` easing-track reveal** (`r-scroll-vt-2026 B-2`) — **BOOK** (PE-only; glass-ui owns the
>   recipe; scroll-driven not Baseline).
> - **GAP-NAMED engine waves gated on value.js:** `height:0→auto` intrinsic-size (`I1`/`NEW-37`) — a
>   new engine `IntrinsicSizeValue` branch (native PE + JS-measure fallback) gated on value.js
>   `calc-size()` (E7); native NOT Baseline → RECORD. **MorphSVG/DrawSVG/numeric MotionPath** →
>   **value.js-HANDOFF VJ-F1**. **SplitText** → **BOOK** (value.js-free; demo grapheme-fix folds into
>   F.W16 §S2).
> - **Fluid display type** (`r-demo-design-2026 §5a`) — **glass-ui ASK** (author the fluid
>   `.text-display-*` rungs in the dependency, not a demo override).
> - **`interpolate-size` adoption** (`F-MW-4`) — **RECORD** (Chrome-only; the `0fr→1fr` grid trick is
>   ALREADY-SOTA, do NOT modernize a working cross-browser solution into a Chromium-only one).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real presence/disposition check, not an
assertion):

1. **`text-wrap: pretty` is present on the start-screen prose (S1).** `proof:demo-elevate`'s text
   clause (or a scoped grep) asserts the demo-owned subtitle/hint `<h2>`s at `EditorStartScreen.vue
   :22-31` carry `text-wrap: pretty`. **BITE:** remove the rule → the presence assertion reds (reds
   today — verified State 1, the prose is `balance` only); apply it to the LCP `<h1>` hero instead →
   the scope assertion reds (the hero is F.W16's `balance`-class substrate, not this prose SHIP).

2. **The demo does NOT hand-roll `document.startViewTransition({ types })` (S2).** A grep gate
   asserts the demo consumes glass-ui's `startViewTransition` (`useSceneTransition.ts:2` import) and
   does NOT directly call `document.startViewTransition({ ... })` with an options object — the inv-16
   boundary holds; the engine ships zero VT surface (`grep -rn startViewTransition src/` = 0). **BITE:**
   add a direct `document.startViewTransition({ update, types })` in the demo (bypassing the substrate)
   → the no-hand-roll grep reds; add a VT helper to `src/` → the engine-boundary grep reds.

3. **The VT-types upgrade is recorded as a glass-ui-HANDOFF, the demo consume BOOKED (S2).** The
   hand-off ledger (`valuejs-sota-handoff-v2.md`) carries H-1 as a glass-ui item with the exact
   helper shape; B-1 is BOOKED gated on H-1. **BITE:** the H-1 hand-off absent from the ledger, or
   recorded as a value.js item (it is glass-ui) → the ledger-coverage clause reds.

4. **The booked/GAP-NAMED layers are recorded with their gates, not silently dropped.** A
   ledger-presence grep (re-runnable, over this wave's §Folds + `valuejs-sota-handoff-v2.md`'s
   glass-ui/value.js ledgers) asserts EACH named item carries an explicit disposition tag: B-1
   (BOOK, gated on H-1), the `Mod+K` palette (BOOK + the KILLED `@click` rewrite), the GAP-NAMED
   `IntrinsicSizeValue` (RECORD, gated on value.js E7) + MorphSVG/DrawSVG (value.js-HANDOFF VJ-F1)
   + SplitText (BOOK), the fluid-type glass-ui ASK, and the `interpolate-size` RECORD. **BITE:** an
   item dropped from the ledger (a disposition silently removed) → the presence grep reds; a future
   lane re-raises a gap already dispositioned here (e.g. "adopt `interpolate-size` now") → the
   recorded RECORD row (with its Baseline reason) is the falsifiable refutation. This is a presence
   check, NOT a behaviour gate — the behavioural VT/scene assertions are BOOKED to the Chromium
   demo-smoke job (clause-parity with F.W2's shape-lock RECORD).

5. **No regression / additive-only.** `npm test` stays green; the `text-wrap: pretty` is a pure
   progressive enhancement (unsupported engines unchanged); `proof:boundary` is untouched (no engine
   change). **BITE:** any demo render/test regression reds (the SHIP is not isomorphic-additive if a
   test moves).

---

## § Folds

Retires (by finding id):
- **`r-demo-design-2026 §5b`** (start-screen prose lacks `text-wrap: pretty`) — S1 + gate clause 1.
- **`r-scroll-vt-2026 H-1`** (the VT-types helper is glass-ui-owned) — S2 + gate clauses 2/3.
- **`r-modern-web-2026 F-MW-1`** (Invoker rewrite KILLED; showcase BOOKED) — recorded + gate clause 4.

**Routed OUTWARD as glass-ui-HANDOFF (inv-16 — proposed, never written):**
- **H-1** — `startViewTransition({ types })` (the VT-types enabler). A glass-ui item, distinct from
  the value.js ledger.
- **Fluid `.text-display-*` rungs** (`r-demo-design-2026 §5a`) — a glass-ui ASK.

**Routed OUTWARD as value.js-HANDOFF (named, NOT this wave):**
- **VJ-F1** — path-geometry sampler (MorphSVG/DrawSVG/numeric-MotionPath enabler; the CSS-native
  MotionPath sliver SHIPs in F.W12).
- **value.js `calc-size()` (E7)** — the parser the GAP-NAMED engine `IntrinsicSizeValue` wave
  depends on.

**Recorded BOOK / RECORD (named, NOT this wave):**
- **B-1** typed/directional scene-VT (gated on H-1, MEASURE-FIRST) · **`Mod+K` palette** via Invoker
  (the `@click` rewrite KILLED) · **B-2** `view()` reveal (PE-only) · **SplitText** (value.js-free,
  demo grapheme-fix in F.W16) — all **BOOK**.
- **`IntrinsicSizeValue` / `interpolate-size`** — **RECORD** (Chrome-only; gated on value.js E7; the
  `0fr→1fr` grid trick is ALREADY-SOTA).

---

## § Design decisions

1. **The VT-types upgrade is a glass-ui-HANDOFF, NOT a keyframes SHIP.** RESOLVED (inv-16,
   `r-scroll-vt-2026 §0.2`/H-1): the VT/scroll-CSS substrate is glass-ui-owned — the demo consumes
   glass-ui's `startViewTransition`, and the engine correctly ships zero VT surface. The enabler (the
   helper growing a `types` param) is glass-ui's call; hand-rolling `document.startViewTransition
   ({...})` in the demo would bypass the substrate's feature-detect + instant fallback, the exact
   duplication the boundary forbids. So the honest disposition is a clean hand-off + a sequenced demo
   BOOK (B-1), and B-1 becomes a one-line consume the moment glass-ui ships `types`. Trade-off: the
   demo's most-seen motion stays an un-typed cross-fade until upstream lands — but that cross-fade is
   itself SOTA and the PE+a11y posture is exemplary (`r-scroll-vt-2026 A-3`); a clean hand-off beats a
   demo-local duplication of the substrate.

2. **KILL the `@click`→Invoker rewrite; BOOK only the single showcase scene.** RESOLVED
   (`r-modern-web-2026 F-MW-1`): Invoker Commands crossed Baseline, but a wholesale `@click`→
   `command="--play"` rewrite of the existing controls would move the wiring out of the SFC template
   into a global registry — LESS legible for a hydrated Vue SPA, with NO measured win (the controls
   have no INP/correctness problem). The §Mandate forbids gold-plating; the rewrite IS gold-plating.
   The one narrow honest opportunity is a single self-contained "declarative controls" showcase scene
   (a teaching surface dogfooding the platform's declarative-action primitive), BOOKED behind the
   `'commandForElement' in HTMLButtonElement.prototype` detect + `invokers-polyfill` ladder. Trade-off:
   the demo's controls stay imperative `@click` — but that is the idiomatic Vue binding, not a debt.

3. **`text-wrap: pretty` ships on the PROSE, not the hero — the scope is deliberate.** RESOLVED: the
   subtitle/hint are multi-line running prose for which `pretty` (orphan-avoidance) is the right
   algorithm; the LCP `<h1>` hero is `balance`-class short-heading whose typographic substrate is
   F.W16's concern (the per-char stagger defeating `text-wrap: balance` + the AT-name fix). Mixing the
   hero into this SHIP would conflate two distinct findings (a ≤1-line prose enhancement vs a structural
   typography correction). Trade-off: two waves touch the start screen — but they touch different
   elements with different findings, and the gate (clause 1) bites if the prose SHIP leaks onto the hero.

4. **No Chromium-only path forced onto a working surface — `interpolate-size` stays RECORD.** RESOLVED
   (KISS, `r-modern-web-2026 F-MW-4`): `interpolate-size`/`calc-size()` is Chrome-only (no FF/Safari);
   the demo's `0fr→1fr` grid trick is a working cross-browser solution and is ALREADY-SOTA. Adopting the
   Chromium-only feature would regress FF/Safari to an instant-jump — the isomorphism + no-legacy
   mandates forbid it. The engine `IntrinsicSizeValue` wave (native PE fast-lane + JS-measure fallback)
   is GAP-NAMED and gated on value.js `calc-size()` (E7) — not this wave's scope. Trade-off: the record
   carries a "not yet" on intrinsic-size animation — but naming a gap honestly beats shipping a
   Chromium-only regression.

5. **Record the deltas; manufacture no modern-web wave.** RESOLVED (the lanes' shared headline,
   `r-modern-web-2026 §5`/`r-scroll-vt-2026 §5`): the post-E demo is exemplary on this axis — View
   Transitions, `@starting-style`, `content-visibility`, individual transforms, `color-mix`, and the
   engine reference-impls all landed. The two genuinely-new Baseline deltas (VT-types, Invoker Commands)
   are a hand-off + a BOOK, and the one demo-owned SHIP is `text-wrap: pretty`. F's job here is to RECORD
   the deltas accurately, not to invent adoption work. Trade-off: this is the smallest of the F bands —
   correctly, because the demo is already SOTA; the wave proves itself net-new by what it leaves
   untouched as much as by the one ≤1-line SHIP.
