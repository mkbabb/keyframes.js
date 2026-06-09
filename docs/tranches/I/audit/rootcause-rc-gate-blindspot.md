# Tranche I — rootcause-rc-gate-blindspot.md · THE GATE-BLINDSPOT META-ANALYSIS (the headline root cause)

**Agent:** ROOT-CAUSE AGENT `[rc-gate-blindspot]`.
**Charge:** WHY did EVERY one of Tranche H's ~97 `proof:*` gates pass GREEN while the live demo is
DEEPLY broken (B1–B9)? Categorize the gate regime; name the precept-level cure; hand the waves the
SEAM (the architectural transposition), not a patch.
**Date:** 2026-06-08 · **Branch:** `tranche-i-dev` (forked off the broken master `b934a08` = H's tip).
**Method (inv ε — verify, do not assert).** Every claim below cites a `file:line` in the live gate
scripts (`scripts/proof-*.mjs`), `package.json`, `.github/workflows/ci.yml`, the engine source, or
the first-hand investigate findings under `docs/tranches/I/audit/investigate/`. I read the actual
gate code and re-derived the census myself — I did not inherit the recap's verdicts on faith
(though they corroborate). The investigate set was read FIRST: `b1-group-play.md`, `b2-dfa-gen-crash.md`,
`b4-easing-lost-editor.md`, `b10-console-census.md`, `b14-controls-dfa-render.md`, plus the
recap-precepts §1–§5.

---

## §0 — THE ONE-SENTENCE ROOT CAUSE

**Every H gate passed because every H gate's ORACLE is a PROXY one or more steps removed from the
running product — source text, a jsdom unit, a localStorage JSON snapshot, a self-captured pixel
baseline (with the live subject masked OUT), a design-token number, or a markdown table — and the
born-RED→green discipline laundered each proxy assertion into a correctness claim, so the MORE gates
H built, the MORE false confidence it manufactured.** The fix is not more gates; it is a single
precept correction (§5) that re-points the oracle at the product, exercised through the human's
surface, with an error budget of zero across PLAY + SWITCH + DRAG.

This is the user's standing warning made mechanical — *"green source-shape gates miss
appearance/interaction/state; audit the RUNNING demo"* (`MEMORY feedback_gate_blindspot_appearance_axis.md`).
H read the warning, named it the headline (`docs/tranches/H/H.md:106`), built a `proof:visual-lock`
baseline + 35 "interaction-axis" browser gates to close it — and re-committed it in substance.

---

## §1 — THE GATE CENSUS (counted first-hand, not asserted)

`package.json` declares **102** distinct `proof:*` script keys
(`grep -oE '"proof:[^"]*"' package.json | sort -u | wc -l`). Subtract the meta/aggregator targets
that are not themselves correctness oracles — `proof:all` (the suite chain), `proof:browser` (a local
convenience runner that just re-invokes other gates, `proof-browser.mjs:30-93`), `proof:ci-coverage`
(audits CI wiring), `proof:bench-runs` (perf harness) — and ~98 are nominal correctness gates. Of the
script-backed ones (88 `.mjs` files on disk; the other 14 names are vitest unit suites,
`grep "vitest run" package.json`), I classified each by its ORACLE — the thing it actually reads to
decide pass/fail:

| Oracle class | What it reads | Count | Can it EVER see B1–B9? | Representative gates |
|---|---|---|---|---|
| **SOURCE-SHAPE (static)** | the source TEXT (grep / regex / a re-derived table) — no DOM, no browser | **40 scripts** | **NO — structurally blind** | `idioms`, `decomposition`, `single-writer`, `no-brittle-selector`, `dragscrub-single`, `composable-encapsulation`, `demo-no-oversize`, `phi-leaf-zero`, `icon-idiom`, `styling-idioms`, `pp-logo-svg`, `dock-morph-settled` (B8!), `specular-handoff` (B7!), **`chronic-closure`** (the keystone!) |
| **JSDOM UNIT** | the engine API under jsdom (no real layout, no `getComputedStyle` matrix, no GPU) | **14 suites** | **mostly NO** | `engine`, `engine-correctness`, `zero-alloc`, `roundtrip-easing`, `adapter-capture`, `group-snapshot-identity`, `scene-contract-identity`, `compile-deterministic` |
| **PROXY STORE** | a localStorage JSON snapshot round-trip (live adapter STUBBED) | ~3 | **NO** | `scene-machine-irrefragable` (B2!), `group-snapshot-identity`, `scene-contract-identity` |
| **SELF-BASELINE** | a pixel diff vs a baseline captured from the SAME build, with the live subject MASKED OUT | 1 (broad) | **NO — locks brokenness** | `visual-lock` (B3/B4/B6!) |
| **LOAD-REST BROWSER** | `goto` a route, `waitForTimeout`, then read the console / DOM AT REST — no click, no switch, no drag | ~20 | **rarely** | `demo-console-clean` (B1!), `demo-usability`, the layout/region gates (`single-column-pack`, `timeline-rail-width`, `stage-glass-card`, …) |
| **WRONG-PROJECTION BROWSER** | DOES drive an interaction, but asserts the wrong DOM projection (a chrome LABEL, not the mounted PANEL / the thrown error) | ~10 | **NO — the subtle killer** | `scene-control-dfa` (B4!), `easing-sidebar-minimal/normalized` (B4!) |
| **GENUINELY BEHAVIORAL** | drives a real interaction AND asserts a product property with a zero error budget | **≈0** | — | *none found that drives PLAY-then-SWITCH and asserts a clean console* |

**The terminal count.** ~54 of ~98 gates (40 static + 14 jsdom) **cannot by construction** observe a
runtime/interaction/state defect — they never open a browser. Of the ~34 that DO open a browser, every
one is load-rest, proxy-store, self-baseline, or wrong-projection. **Not one gate in the entire regime
loads a scene, CLICKS PLAY, SWITCHES scenes, and asserts a clean console.** The single interaction the
user performs first — press the rainbow play — is gated by nobody.

> The gates are not absent and they are not skipped. CI's `demo-smoke` job genuinely installs
> playwright + chromium, builds `dist/gh-pages/`, and runs the browser gates under
> `KF_REQUIRE_BROWSER=1` (a playwright-absent skip becomes a hard fail — `ci.yml:202-225,234-345`).
> **The gates RAN, were GREEN, and certified a broken product.** That is strictly worse than a gap:
> it is a false positive with a ceremony of rigor around it.

---

## §2 — THE FIVE PROXY ORACLES, EACH NAILED TO A LIVE BREAKAGE (file:line)

Each subsection: the gate, the EXACT oracle it reads (verbatim from the script), the breakage it was
charged to catch, and the precise reason the oracle is BLIND to it.

### 2.1 — LOAD-REST · `proof:demo-console-clean` vs B1 (the "......" group-play crash)

- **The oracle (verbatim).** `proof-demo-console-clean.mjs:170-194`: `for (const route of
  ["/#/amiga", "/#/easing"])` → `page.goto(...)` → `page.waitForTimeout(2500)` → assert ZERO console
  errors **matching `HA1_SIGNATURE = /no CSS animation-timing-function representation/`**
  (`:117`). It rests on two routes and filters on ONE narrow regex. It never clicks anything.
- **The breakage.** B1 fires on the **rainbow group-play CLICK**, on home (`#/`) and cube (`#/cube`),
  not amiga/easing — TWO distinct faults (`investigate/b1-group-play.md`, `b10-console-census.md §1`):
  (a) `TypeError: this.transform is not a function` (`group.ts:373` calls `this.transform(...)` on an
  empty home group whose `transform!` field — `group.ts:38` — is never assigned; the constructor
  comment at `group.ts:118-122` PROMISES a lazy fallback that **does not exist**, verified: line 373 is
  unguarded), and (b) `Parse error at offset 0: "......"` (`format.ts:148` `animation.at()` →
  `interpFrames → processFrame → lerpValue` → value.js `parseCSSValueUnit("")` on the empty computed
  value of `var(--rotationX)` when the custom property is unset on the target).
- **Why the oracle is blind.** Three compounding misses: (1) the oracle RESTS, the bug needs a CLICK;
  (2) the oracle visits amiga/easing, the bug lives on home/cube; (3) the regex is narrowed to the
  H-A1 `serializeEasing` signature, so even if the `"......"` had appeared on those routes the gate
  would have FILTERED IT OUT by design. The docstring (`:5-8`) confesses the gap and defers the broad
  console to `proof:no-route-storm` — **which does not exist** (`grep no-route-storm package.json` →
  nothing; the script file is absent; it is referenced in SIX gate docstrings and counted toward H's
  green tally in `FINAL.md:34`). The broad-console oracle was deferred to a gate that was never
  authored.

### 2.2 — PROXY-STORE · `proof:scene-machine-irrefragable` vs B2 (`this._gen` undefined on suspend)

- **The oracle (verbatim).** `proof-scene-machine-irrefragable.mjs:137-139,236-244`: the identity
  oracle is **localStorage** — `keyframes-js-scene-machine` (the playback snapshot) +
  `animation-groups-control-options-store` (the control projection). The gate DOES click the
  transport (`clickTransport`, `:279-299`) and DOES switch scenes (`navByHash`, `:250-269` — a hash
  assignment), then asserts the JSON snapshot round-trips byte-identically (`:357-366`
  `captureCanonical`).
- **The breakage.** B2 is `TypeError: Cannot read properties of undefined (reading '_gen')` at
  `RAFPlayback.stop()` (`playback.ts:215-216`, `this._gen++`), because `useEasingDemo.ts:227` and
  `useSpringDemo.ts:365` pass the **UNBOUND** method reference `playback.stop` (receiver dropped) as
  the `pause` callback to `useSceneVisibilityPause`. The watcher invokes it free-standing on a
  visibility/suspend tick → `this` is `undefined` → throw inside Vue's `flushJobs` → the render flush
  aborts → BLANK controls (`investigate/b2-dfa-gen-crash.md`, reproduced live + source-mapped on
  `:5174`; `b14-controls-dfa-render.md §4` corroborates with the same stack).
- **Why the oracle is blind.** TWO independent reasons, either alone fatal: (1) the gate switches via
  **hash assignment**, which funnels through the adapter's BOUND `stopLoop` arrow (`() =>
  playback.stop()`, `useEasingDemo.ts:171`) — NOT the unbound `useSceneVisibilityPause` path; the
  crash rides a DIFFERENT seam than the one the gate drives. (2) The gate never dispatches a
  `visibilitychange` event — the actual trigger. (3) Even if it threw, the gate's ORACLE is a JSON
  serialization round-trip; a thrown TypeError in a Vue watcher does not corrupt a localStorage
  snapshot — the snapshot serializes fine while the live adapter dies. The 1074-line gate validates
  the PURE REDUCER's serialization; B2 lives in the EFFECTS layer (the adapter's `_gen` lifecycle) the
  gate stubs out behind the storage oracle.

### 2.3 — SELF-BASELINE · `proof:visual-lock` vs B3 / B4 / B6 (amiga floats · easing blank · square drag)

- **The oracle (verbatim).** `proof-visual-lock.mjs:630-648` `runUpdate()` captures the golden
  baseline via `--update-baseline` from the **SAME built `dist/gh-pages/`** ("the re-pinned demo",
  `:632`) — it is SELF-CAPTURED. Worse, before every capture it MASKS OUT nearly every live subject:
  `MASK_SUBJECTS` (`:130-168`) paints a flat pink rect over `canvas`, `.amiga-canvas`, `.cube`,
  `.hero-track`, `.hero-ball`, `.progress-rail`, `.progress-ball`, `.mp-traveller`, `.seq-playhead`,
  `.spring-rail`, `.easing-curve-canvas`, `.tabular-nums`, the typing dots — AND emulates
  `prefers-reduced-motion: reduce` at the context level (`:440-446`) to still the rest.
- **The breakage.** B3 (`/amiga` "floats around"), B4 (easing sidebar renders BLANK after a
  switch-in — `investigate/b4-easing-lost-editor.md`), B6 (`/square` drag selects dock text + does not
  persist). These are MOTION, INTERACTION, and STATE defects.
- **Why the oracle is blind.** It locks the wrong quantity, twice over. (1) **Self-baseline locks
  brokenness as golden.** The baseline was captured AFTER the J1–J6 strip and the broken states
  landed (`FINAL.md:28-29` — the golden was captured post-defect). A diff against a defect-baseline
  certifies the defect as correct; the recap names this directly (recap-precepts §1.3). (2)
  **Masking excises the product.** The gate's own docstring (`:9-24`) admits it does NOT lock in-flight
  frames — and the masked set IS the product: the amiga sphere (B3), the easing curve (B4 stage), the
  ball sweeps. A frozen, masked screenshot of LAYOUT/COLOR/TYPE chrome cannot see a sphere that floats,
  a panel that fails to mount on switch, or text that highlights on drag. The gate paints pink over
  exactly the pixels that move when a human uses the product, then certifies the still frame matches a
  still frame of itself.

### 2.4 — WRONG-PROJECTION · `proof:scene-control-dfa` vs B4 (easing editor blank after switch)

- **The oracle (verbatim).** `proof-scene-control-dfa.mjs` D4 LIVE NAVIGATION-MATRIX (`:213,236-244`)
  DOES drive `location.hash` scene→scene switches and asserts the rendered control-tab set is the
  destination's DFA entry — it reads `document.querySelector("[aria-label='Controls tab']")` and the
  visible **tab-trigger labels** (`:236-242`).
- **The breakage.** On an in-app switch INTO easing, the `EasingSidebar` (bezier canvas + selector +
  duration) renders **BLANK** — `editorPresent:false, canvasPresent:false, selectorPresent:false`
  (`investigate/b4-easing-lost-editor.md §Scenario 2`) — while the dock tab pill STILL reads "Easing".
  The `TabsContent value="easing"` PANEL never mounts (a reka controlled-`model-value` desync across
  the Suspense re-mount); the chrome label is a separate, correct projection.
- **Why the oracle is blind — the subtle, important one.** This gate IS a runtime interaction gate
  (it switches scenes). It still misses B4 because its ORACLE is the **chrome tab-trigger label**, not
  the **mounted panel content**. The label projection is correct (`selectedControl === "easing"`); the
  panel is silently absent. **Driving the interaction is necessary but NOT sufficient — the gate must
  also assert the PRODUCT-FACING DOM the human sees (the curve canvas, the draggable handles), not a
  status label one projection removed.** Twin offenders: `proof:easing-sidebar-minimal` /
  `proof:easing-sidebar-normalized` check the FRESH-load source shape and codify the J1–J6 strip as
  the contract — so the gate green-lit the over-removal AND missed the runtime blank-out
  (recap-precepts §1.3).

### 2.5 — SOURCE-SHAPE · `proof:dock-morph-settled` vs B8 (dock animations "supremely broken, slow")

- **The oracle (verbatim).** `proof-dock-morph-settled.mjs:1-30`: it parses the
  `--spring-dock: linear(...)` token from glass-ui's `tokens.css` and asserts the ramp's **peak
  overshoot ≤ +6%** (`:21-28`). Its own docstring CONFESSES: *"the morph is not reliably driveable
  live (181 samples, no morph captured), so the gate measures the SPRING TOKEN directly."*
- **The breakage.** B8 — ALL dock animations "supremely broken, slow, errored"; the dock Select
  trigger is intermittently `visibility:hidden` mid-transition, blocking the switch click outright
  (`investigate/b14-controls-dfa-render.md §6`, `b10-dock-geom`).
- **Why the oracle is blind.** It substitutes a DESIGN-TOKEN NUMBER for the rendered MOTION because
  the author could not drive the morph live — and then certified the substitute green. A token's peak
  value says nothing about whether the dock layers oscillate visible/hidden, whether the trigger is
  hit-testable at click time, or what the live INP is. This is the purest specimen in the regime: a
  gate that EXPLICITLY traded the product property it could not measure for a proxy it could, and
  called the proxy a pass. (`proof:specular-handoff`, B7, is the same shape — a static check that
  resolves at an unpublished glass-ui version the user never sees.)

---

## §3 — THE KEYSTONE FAILURE: the chronic-closure meta-gate is ITSELF a source-shape gate

H's central durability thesis was that the four chronics (cartoon-shadow D2, φ-hero D7, mobile D10,
dock D5) "exited" the deferred ledger only by RE-CLASSIFICATION, and that `proof:chronic-closure`
would make a bare tag non-terminal — so H would be *"the LAST re-paper"* (`FINAL.md:78-79`). I read
the gate first-hand:

- **The oracle (verbatim).** `proof-chronic-closure.mjs:46-100` reads `docs/tranches/H/PROGRESS.md`
  with `fs.readFileSync`, parses the `## Open deferrals` MARKDOWN TABLE (`parseChronicTable`,
  `:75-100`), and for each row asserts every cited `` `proof:*` `` gate NAME **resolves** to a
  `package.json` key (`resolves`, `:63`) AND is a member of `proof:all` (`inProofAll`, `:65-66`). It
  opens no browser. It runs no cited gate. Its own docstring (`:41-44`): *"the SAME static
  resolve-or-red mechanism as `proof:idioms` clause-1 … a static parse of a committed table, not a new
  runtime probe."*
- **What it proves.** That the markdown ledger is internally consistent — every gate NAME it cites
  exists. **It proves nothing about whether any cited gate measures a real product property.** It is
  a source-shape gate auditing the WELL-FORMEDNESS OF OTHER GATES' PAPERWORK.
- **The recursion.** H built a meta-gate to police the chronics so they could never paper-close
  again — and made the meta-gate the SAME class of gate that caused the original sin. The born-RED
  ceremony was applied to a markdown table: born-RED if a row cites a dangling name, green when the
  name resolves. A green `proof:chronic-closure` certifies the bureaucracy is tidy. That is exactly
  what it certified while B1–B9 ran live. **The headline durability mechanism is the deepest
  expression of the very blindspot it was built to close.**

This also means H's chronic-closure proof would have GREENED even though it cites
`proof:no-route-storm` indirectly through the gates that reference it — because the meta-gate only
checks names in the chronic ROWS, and the dangling `no-route-storm` lives in docstrings, not rows. The
paperwork audit had its own blind spot.

---

## §4 — WHY THE born-RED DISCIPLINE FAILED (the mechanism, generalized)

The born-RED→green discipline is SOUND in principle: a gate must FAIL on the pre-fix tree and PASS on
the post-fix tree, so green proves the fix landed. H applied it with apparent rigor — every wave's
gate is documented born-RED-then-green. **It failed because of a hidden premise: that the gate's
oracle IS the product property the human cares about.** When the oracle is a proxy, born-RED→green is
sound about the PROXY and silent about the PRODUCT:

1. **LOAD-REST vs INTERACTION.** Born-RED→green against "console clean on load" says nothing about
   "console clean when the user plays." (B1)
2. **PROXY-STORE vs LIVE OBJECT.** Born-RED→green against "the JSON snapshot serializes" says nothing
   about "the adapter suspends without throwing." (B2)
3. **SELF-BASELINE vs KNOWN-GOOD.** Born-RED→green against "matches the golden" locks the defect as
   golden when the golden was captured post-defect — and masks the moving subject out entirely. (B3/B4/B6)
4. **WRONG-PROJECTION vs PRODUCT-FACING DOM.** Born-RED→green against "the tab LABEL reads easing"
   says nothing about "the easing PANEL mounted." (B4)
5. **PAPERWORK vs PRODUCT.** Born-RED→green against "every cited gate name resolves" certifies the
   ledger is consistent, not that the product works. (the chronic keystone)

**The common thread: a born-RED gate is only as honest as its oracle, and the MORE rigorous the
born-RED ceremony around a proxy oracle, the MORE false confidence it manufactures.** That is the
mechanical reason H — the tranche with the most gates and the most explicit gate discipline — shipped
the most broken product. Complexity was spent on an elaborate lattice of proxy assertions while the
product oracle was never wired.

---

## §5 — THE PRECEPT-LEVEL FIX (the SEAM, the architectural transposition — NOT a patch)

The cure is NOT "add more gates." It is a single precept correction with one structural seam. The
waves inherit it; it is the design input for the whole tranche.

### 5.1 — THE PRECEPT (I-born — propose binding into the I charter)

> **A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME
> surface the human uses, with an ERROR BUDGET OF ZERO across the human's interaction battery (PLAY +
> SWITCH + DRAG). A gate whose oracle is source text, a jsdom unit, a serialized snapshot, a
> self-captured baseline, a design-token number, or a paperwork ledger is a HYGIENE gate, not a
> CORRECTNESS gate, and MUST be LABELED as such — it may never count toward a correctness or
> chronic-closure tally.**

The two-tier taxonomy is the whole move: keep the 54 source-shape/jsdom gates — they are CHEAP and
they correctly police what their oracle CAN see (no-legacy held precisely because source text IS the
right oracle for it, recap-precepts §2). But STRIP them of correctness authority. Correctness and
chronic-closure tallies may only be satisfied by a gate whose oracle is the running product.

### 5.2 — THE SEAM: ONE driven-session probe (`proof:live-session`), not N rest-probes

The architectural transposition the waves should build — idiomatic, KISS, no legacy, no workaround:

**Replace the lattice of ~34 load-rest / wrong-projection browser gates with ONE re-runnable
INTERACTION-DRIVEN session harness** that models on the proven `scripts/proof-no-orphan-specular.mjs`
pattern (serveDist on port 0 + chromium via `KF_PLAYWRIGHT_DIR`'s playwright-core + fresh context per
scene) — the SAME harness every investigate probe used to reproduce B1–B9 — and extends it from
PASSIVE to ACTUATING. The session is the human battery:

- For EVERY scene: load → **CLICK the rainbow group-play** → **hover-expand the morphing dock + SWITCH
  to every other scene** (the real combobox path, not just hash — `b10-console-census.md §0` proves a
  probe that does not hover-expand the dock NEVER exercises the switch) → **fire a `visibilitychange`
  while a raw-rAF scene plays** (the B2 trigger) → **DRAG** on `/square` and the bezier handles → switch
  back → replay.
- THE ORACLE is a single accumulated **ERROR BUDGET = 0**: zero `pageerror`, zero
  `unhandledrejection`, zero `console.error`, zero value.js `"......"` parse lines — captured by
  `page.on("console") + page.on("pageerror") + page.on("requestfailed")` across the WHOLE battery, not
  rested per route. PLUS product-facing DOM assertions read from the SAME surface the human sees: after
  a switch-into-easing, the `.easing-curve-canvas` + draggable `.control-point.handle` are PRESENT and a
  drag MUTATES the path (the B4 assertion); after group-play the cube draw loop is LIVE (not frozen);
  on `/square` the drag does not select text (`user-select` honored) and the transform PERSISTS.

One probe, one budget, every interaction — this is the KISS inversion of 34 proxy gates. It bites
B1 (the play click), B2 (the visibility tick + the switch), B4 (the panel mount + drag), B6 (the
drag), and storms B8's dock-instability (the trigger must be hit-testable at click time). It is
born-RED on `b934a08` (every breakage live) and greens ONLY when the engine + FSM transpositions land.

### 5.3 — THE FOUR STRUCTURAL CONSEQUENCES (each a falsifiable wave-gate rule)

1. **Every runtime gate DRIVES the interaction, never rests on load.** The console oracle must CLICK
   play, SWITCH via the dock, fire visibility, and DRAG — then assert the zero-budget. (closes B1, B2)
2. **Every state gate exercises the LIVE OBJECT, never the snapshot.** The FSM suspend gate mounts a
   real scene, PLAYS it, fires a tab-hide AND switches away, and asserts no throw AND the leaving
   scene suspended AND the incoming resumes-iff-was-playing — against the live adapter and its `_gen`,
   not localStorage. (closes B2)
3. **The visual baseline is captured from a KNOWN-GOOD reference, never from self, and never masks the
   subject.** A human-approved reference render (or a prior-good tranche's render) is the baseline; the
   live subject is asserted ALIVE (a frame-delta probe proving motion), not painted pink. A
   self-captured, subject-masked baseline is downgraded to a hygiene gate. (closes B3, B4, B6)
4. **The chronic-closure meta-gate verifies the cited gates are RUNTIME gates that BIT.**
   `proof:chronic-closure` must not merely resolve gate NAMES — it must assert each cited gate is a
   runtime/interaction gate (its script opens a browser and actuates) AND was witnessed born-RED on a
   defect tree. A chronic row whose closure cites only source-shape / load-rest gates REDS. This makes
   the meta-gate police the PRODUCT, finally — not the column's paperwork. (closes the keystone)

---

## §6 — THE BLINDSPOT-TO-BREAKAGE LEDGER (the design input for the waves)

| Breakage | Confirmed root cause (file:line) | The gate that should have caught it | Its proxy oracle | I disposition (the seam) |
|---|---|---|---|---|
| **B1** "......" + `this.transform` | `group.ts:373` unguarded `this.transform()` on empty group (decl `:38`, dead lazy-comment `:118-122`) + `format.ts:148` `at()` → value.js `parseCSSValueUnit("")` on empty `var(--rotationX)` | `proof:demo-console-clean` | LOAD-REST + narrowed regex; defers to non-existent `proof:no-route-storm` | engine transposition: default `transform` to a no-op at the FIELD; empty computed value fails-explicit/skips (the W0 selector-guard's TWIN at the value seam, `b1 §7`); driven console gate (§5.2) |
| **B2** `this._gen` undefined | `useEasingDemo.ts:227` + `useSpringDemo.ts:365` pass UNBOUND `playback.stop` to `useSceneVisibilityPause`; `playback.ts:216` `this._gen++` throws | `proof:scene-machine-irrefragable` | PROXY-STORE (localStorage JSON; stubs the live adapter; never fires visibilitychange) | make `RAFPlayback` control methods bind-proof (arrow class-fields) — closes the whole unbound-method class; consolidate the raw-rAF scene boilerplate into ONE `useRafScene` composable (`b2 §fix`); live-adapter suspend gate (§5.3.2) |
| **B3** amiga floats | WebGL ReadPixels stall + transform/layout on `/amiga` (`b10 §E5`, `b3-amiga.md`) | `proof:visual-lock` | SELF-BASELINE + canvas MASKED OUT | known-good baseline + a motion-alive assertion (§5.3.3); amiga perf transposition |
| **B4** easing editor blank | reka `<Tabs>` controlled `model-value` desync across the Suspense re-mount → `TabsContent value="easing"` never mounts (`b4 §root-cause`) | `proof:scene-control-dfa`, `proof:easing-sidebar-*` | WRONG-PROJECTION (asserts the tab LABEL) + FRESH-load source shape | mount the controls Tabs DETERMINISTICALLY from the active scene's DFA surface, single-sourced; gate asserts the PANEL DOM + a handle-drag mutation (§5.3.4) |
| **B5** "no CSS twin" placeholder | the W0 `try/catch` floor RENDERS the defect string (`demo-console-clean.mjs:91`) — same `var()` empty-value root as B1 | `proof:demo-console-clean` | the gate asserts the placeholder EXISTS (the floor IS the gate's success criterion) | the floor is not the fix — land the value-seam fix so the twin serializes; the bare `"cubic-bezier"` token must round-trip to a `cubic-bezier()` literal (`b10 §B5`) |
| **B6** square drag selects text / no persist | missing `user-select:none` on dock/controls; drag transform not persisted (`b6-square-drag.md`) | (none) | — | driven drag gate asserts no text-selection + transform persists (§5.2) |
| **B7** specular sheen | glass-ui Card surface sheen; pinned `~3.5.1` (`b7-specular-glassui.md`) | `proof:specular-handoff` | SOURCE-SHAPE; resolves at an unpublished glass-ui version | re-examine the pin + measure perf + confirm user acceptance (inv-16 consume-leg) |
| **B8** dock broken/slow | dock layers oscillate `visibility:hidden`↔visible; trigger not hit-testable mid-transition; INP (`b8 §`, `b14 §6`) | `proof:dock-morph-settled` | SOURCE-SHAPE (parses the `--spring-dock` token's peak; "no morph captured live") | drive the dock, measure live INP, assert the trigger is hit-testable at click time (§5.2) |
| **B9** ENOENT icon + sourcemaps | dev expects `easing-icon-sm.svg`, build emits `easing.svg` (dev↔build icon-resolution discrepancy) (`b9-icons-assets.md`) | (none — no gate compares the two build paths) | — | a dev/build parity gate (FOLD) |
| **keystone** chronics green while broken | `proof-chronic-closure.mjs:46-100` parses a markdown table; no browser | `proof:chronic-closure` ITSELF | PAPERWORK (resolve gate NAMES) | OVERHAUL — the §5.1 precept + §5.3.4 (cited gates must be runtime gates that bit) |

---

## §7 — THE TERMINAL READING (the one paragraph for the charter)

H did not fail for lack of discipline. It failed by pointing a rigorous born-RED discipline at the
WRONG ORACLE — source shape, a jsdom unit, a localStorage snapshot, a subject-masked self-baseline, a
design-token number, a markdown table — and then enshrining that mis-aim as the durability mechanism
in `proof:chronic-closure`, a source-shape gate policing other gates' paperwork. ~54 of ~98 gates
cannot by construction see a runtime defect; the ~34 that open a browser rest on load, round-trip a
proxy store, diff a masked self-baseline, or assert the wrong DOM projection — and NOT ONE drives the
single gesture the user performs first (press play). Tranche I's correction is singular and
architectural: **bind the gate ORACLE to the running product, exercised through the human's surface,
with a zero error budget across PLAY + SWITCH + DRAG** — collapse the proxy lattice into ONE
interaction-driven session probe (the very harness the investigation used to reproduce B1–B9, extended
from passive to actuating), and downgrade every source-shape gate to a labeled hygiene tier that may
never carry correctness authority. The gate-regime overhaul is the headline; it is the ONLY way "green"
comes to mean "a human using the product would see it work," and the ONLY way the gate-blindspot
closes for good.
