# Tranche I — keyframes.js: the gate-regime OVERHAUL · close the gate-blindspot for good · the live brokenness (B1–B9) fixed idiomatically at the engine + demo seams · gates that exercise RUNTIME / INTERACTION / STATE, error-budget 0

I is keyframes.js' ninth tranche, and the FIRST whose actionable band is **the gate REGIME
itself**. H was the eighth — the demo-quality / design-language / mobile / scene-state
tranche — and it shipped with **ALL 97 `proof:*` gates GREEN** (`tsc` 0, `proof:all`,
`proof:browser` 35/35, `proof:chronic-closure`, `proof:visual-lock`) and a FINAL declaring
the four chronics CLOSED "for the LAST time." **The live demo is DEEPLY broken.** The user
drove it on 2026-06-08 (dev `:5174` + the built `dist/gh-pages/` reproduces the engine/FSM
crashes) and found NINE user-visible breakages (B1–B9), four of which are the EXACT chronics
H certified closed. **97 green gates certified a broken product.**

This is not a discipline failure. H applied the born-RED→green falsifiable-gate discipline
with apparent rigor — every wave's gate documented born-RED-then-green. **H failed by pointing
a rigorous discipline at the WRONG ORACLE.** Every H gate reads a PROXY one or more steps
removed from the running product — source text, a jsdom unit, a localStorage JSON snapshot, a
self-captured pixel baseline (with the live subject MASKED OUT), a design-token number, a
markdown table — and the born-RED ceremony laundered each proxy assertion into a correctness
claim, so the MORE gates H built, the MORE false confidence it manufactured. **Of ~98 nominal
correctness gates (102 `proof:*` proof keys − 4 meta/aggregators; see `rootcause-rc-gate-blindspot
§1` for the first-hand census), ~54 cannot by construction open a browser; the ~34 that do all
rest on load, round-trip a proxy store, diff a masked self-baseline, or assert the wrong DOM
projection — and NOT ONE drives the single gesture the user performs first: press play.**

This is the user's standing warning made mechanical — *"green source-shape gates miss
appearance/interaction/state; audit the RUNNING demo"* (project memory
`feedback_gate_blindspot_appearance_axis.md`). H READ the warning, named it the headline
(`H/H.md:106`), built a `proof:visual-lock` baseline + 35 "interaction-axis" browser gates to
close it — **and re-committed it in substance.** Tranche I's correction is singular and
architectural: **bind the gate ORACLE to the running product, exercised through the human's
surface, with an error budget of ZERO across PLAY + SWITCH + DRAG** — collapse the proxy
lattice into ONE interaction-driven session probe (the very harness the investigation used to
reproduce B1–B9, extended from passive to ACTUATING), and downgrade every source-shape gate to
a labeled HYGIENE tier that may never carry correctness authority. **The gate-regime overhaul
is the headline; it is the ONLY way "green" comes to mean "a human using the product would see
it work," and the ONLY way the gate-blindspot closes for good.**

The nine breakages are fixed underneath that overhaul — idiomatically, at the true seam, NO
workaround, NO legacy, gestalt, KISS, measure-first — with the engine (`src/animation`) IN
SCOPE for transposition (inv-16: the engine is the kf PRODUCT, not a sibling; runtime
correctness may require engine transposition). The four false-closed chronics (cartoon/specular
D2/D14, mobile D10, dock D5) are RE-OPENED with their live receipts and folded; the two prime
deferred items (the value.js empty-input parse contract, the glass-ui specular consume-edge)
are converted from fictional handoffs to real I-folds; the twice-deferred DC-8 dead-CSS exits.

---

## § Phase — TRANCHE DEVELOPMENT (the audit + these docs; implementation awaits authorization)

I is in DEVELOPMENT now, on branch `tranche-i-dev` (forked off the broken master `b934a08` =
H's tip; kf `4.1.0`-base — H planned a `4.1.1` PATCH that the running demo is the base of;
value.js `^0.11.1`, parse-that `^0.9.0`, glass-ui `~3.5.1` all consumed PUBLISHED; demo live
at `:5174` — Vite-assigned, gates use `serveDist`'s reported port). The deep audit is RUN —
the evidence is on disk under `docs/tranches/I/audit/`:

- **`investigate/`** — 16 first-hand surface probes (`b1`…`b16`) + their probe scripts under
  `investigate/probes/` + captured `*.console.json` + screenshots under `investigate/shots/`.
  Every B1–B9 was REPRODUCED against the BUILT `dist/gh-pages/` and the source-mapped dev
  server `:5174` — not theorized from source.
- **`rootcause-*.md`** — eight root-cause syntheses, each confirming the seam `file:line`, WHY
  the gates missed it, and the idiomatic gestalt fix DIRECTION (the transposition, not a patch):
  `rc-gate-blindspot` (the headline meta-analysis), `rc-parse-crash` (B1/B5), `rc-dfa-gen`
  (B2), `rc-easing-editor` (B4), `rc-amiga` (B3), `rc-drag-perf` (B6/B8), `rc-icons-build`
  (B9), `rc-specular-glassui` (B7).
- **`recap-*.md`** — four recaps: `recap-prompts` (the honest A→H→I claimed-vs-actual ledger,
  no drops), `recap-precepts` (was each precept HONORED or VIOLATED), `recap-chronic` (the
  A→H chronically-deferred ledger re-examined live), `recap-deferred` (the non-chronic carry).
- **`feedback/k-demo-name.md`** — a trivial live ask folded into the shell-chrome wave.

This charter (`I.md`), the per-wave specs (`docs/tranches/I/waves/I.W*.md`), and the
path-forward / ledger artifacts are the DEVELOPMENT deliverables. **I.W0–I.WZ are
authored-now-run-later wave specs; the implementation phase opens only on explicit user
authorization, gated on keyframes' own green CI — exactly D.W0's, E.W0's, F.W0's, G.W1's, and
H's dev/impl boundary.** No engine, demo, library, parser, test, bench, or CI source is written
in development. **This is TRANCHE DEVELOPMENT — docs ONLY, ZERO source/test/CI/demo edits, NO
git commit.** The deliverable is files under `docs/tranches/I/**`.

---

## § The MANDATE (binding — every wave, every gate, every fold · the spine)

The user's verbatim-intent for Tranche I (2026-06-08), carried into every wave:

> A FULL audit + Playwright investigation with dev tools; DEEPLY audit the original plan +
> waves + ALL changes made; devise a path forward; recapitulate ALL original prompts /
> plans / precepts; NO quick solutions, NO workarounds — IDIOMATIC, GESTALT approaches;
> architectural transpositions for ELEGANCE, SIMPLICITY, PERFORMANCE above all are necessary +
> desirable; NO LEGACY CODE; delineate chronic + deferred items and FOLD them into this
> tranche; recap ALL prompts + ensure addressed. TRANCHE DEVELOPMENT ONLY.

This is the same standing development mandate carried verbatim-in-substance A→H. The decisive
addition for I — the user's headline:

> The gate-blindspot the user has repeatedly warned about ("green source-shape gates miss
> appearance/interaction/state; audit the RUNNING demo") struck again, at the largest scale in
> the project. **Close it for good.** Every wave gate must be a REAL runtime/interaction gate —
> playwright clicking play, switching scenes, dragging — NOT a source-shape check.

The precept spine, BINDING on every I wave (I.W0–I.WZ), every gate, and every cross-repo
hand-off this tranche emits:

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only. A wave may not
  neutralize a symptom at the wrong seam, mask an occlusion, or offer a weaker escape hatch
  beside the real fix. The hard gates are written to pass ONLY the transposition. (Specifically
  forbidden for I: the `"......"` crash dies because the EMPTY-INPUT VALUE seam is made total
  — **NOT** another `try/catch` floor rendering a placeholder (that floor IS B5); the `_gen`
  crash dies because `RAFPlayback`'s control surface is BOUND-BY-CONSTRUCTION — **NOT** an
  arrow wrapped around the two call sites that leaves the foot-gun live; the specular dies
  because kf consumes the published default-off — **NOT** a `.glass-specular-track::before {
  content: none }` kf-side neutralizer; the gate overhaul is the ORACLE re-point — **NOT** N
  more proxy gates beside the old ones.)
- **NO legacy beside its replacement** — a replaced surface is replaced in ONE motion. The
  mis-attributing "no CSS twin" placeholder dies WITH the serialize-from-template fix; the two
  unbound `playback.stop` call sites die WITH the bound engine method (and the duplicated
  raw-rAF boilerplate folds into ONE `useRafScene`); the per-scene reka-Tabs `selectedControl`
  pokes die WITH the machine-projected control surface; the square hand-rolled `window`-drag
  dies WITH its migration onto `useDragScrub`; every retired source-shape correctness gate is
  DELETED or RE-LABELED hygiene in the same motion the runtime gate that supersedes it lands.
- **NO god modules** — MEASURE-FIRST before any split. KISS · DRY · no nested imports · no
  test-in-src. Styling ISOMORPHIC unless a NAMED, befitting delta. The `engine.ts` line
  ceiling (1375/1400 at H-open) is RESPECTED or re-baselined with a measured cohesive split
  (`recap-deferred §9`, the C-6 watch-note) — the serialize-from-template transposition must
  not blow it.
- **MEASURE-FIRST** — every perf claim lands behind a shaped biting bench / a CPU-throttled,
  drop-counting RUNNING-scene gate, or is recorded-withheld WITH the measurement. The dock
  expand (12/114 dropped, p95 25 ms, max 49 ms — `rc-drag-perf §2a`, `b16 §3`), the `/easing`
  per-rAF render storm (46 fps playing vs 60 paused — `b16 §1`), the specular paint posture
  (removing the resting bloom can only REDUCE paint — `rc-specular-glassui §3`) are MEASURED,
  not asserted.
- **inv-16 HOLDS, with the engine UN-fenced.** kf consumes glass-ui / value.js / parse-that
  PUBLISHED; the glass-ui specular/dock items are AUDITED + HANDOFF-tagged, never authored or
  patched in kf (all glass-ui changes go in the glass-ui repo — `feedback_glass_ui_root_changes`).
  **The exception: `src/animation` is the kf PRODUCT, not a sibling — it is IN SCOPE for the
  B1/B2/B3 runtime transpositions** (the empty-input value seam, the bind-proof `RAFPlayback`
  control surface, the group-play `transform` default). This is the singular inv-16 relaxation
  for I, named here and in every wave that touches the engine.

**ENFORCEMENT (inv ε — the discipline the catastrophe broke).** Every code claim in this
charter cites a `file:line` / live anchor or a named root-cause / recap lane; every disposition
is tagged. inv ε ("the close cannot overclaim") was INVENTED in Tranche C and VIOLATED at scale
by H's FINAL (the largest overclaim in the project — 97 green gates, broken product). I's
correction makes inv ε mechanical: **a checked-in re-runnable instrument that measures IDLE
SOURCE-SHAPE is not the same as one that proves the PRODUCT works** (`recap-prompts §2 C`,
"the inv ε irony"). No wave may manufacture a deficit where the post-H state genuinely holds —
the φ-hero chronic, the dock SPRING retune, the mobile spring + full-bleed bones, the cartoon
PANELS, the engine/parse/color/re-pin kernels are ALREADY-CORRECT and re-affirmed below.

---

## § The invariant set carried into I

| inv | Statement | I posture |
|---|---|---|
| **inv ε** | verify, do not assert — cite for every claim; an instrument must measure the PRODUCT property, not a proxy | **THE I SHARPENING.** Every B1–B9 root cause is grounded in a re-runnable probe + captured console/pageerror + a screenshot, not source-alone (`recap-prompts §0 Method`). The I correction: a born-RED gate is only as honest as its oracle; the oracle must be the running product (`rootcause-rc-gate-blindspot §4`). |
| **inv ζ** | the shop-window (chrome) runs on its own engine (no hand-rolled rAF/loops) | **EXTENDED to PERF.** The `/easing` per-rAF Vue-`ref` write (`useEasingDemo.ts:153-161`) and the 4–6 stacked rAF loops per scene VIOLATE inv ζ's spirit — the engine ships ONE managed `RAFPlayback` driver the demo under-uses. I.W4 collapses to one composed driver per scene + a non-reactive `style.transform` write for the hot positional update (`rc-drag-perf §D4`). |
| **inv δ** (drift-2) | "zero dock-over-content overlap" is a HARD gate, not advisory | **RE-OPENED for INTERACTION-occlusion.** The G.W12 overflow-occlusion contract held, but B6 (square drag selects chrome text) and the mobile M1 (menubar occludes sheet 12px) are INTERACTION/GEOMETRY occlusion the gate never modeled (`b13 DEFECT-1`, `rc-drag-perf §1a`). I gates measure `sheet.bottom ≤ menubar.top` and `getSelection()` empty over a swept chrome label. |
| **inv-16** | kf consumes glass-ui/value.js/parse-that PUBLISHED; sibling items are HAND-OFFs — **EXCEPT the engine `src/animation`, which is the kf PRODUCT and IS in scope for transposition this tranche** | **THE SINGULAR I RELAXATION.** B1/B2/B3 may touch `src/animation` (empty-input value seam; bind-proof `RAFPlayback`; group `transform` default). The glass-ui specular/dock items re-examine the PIN + perf + the consume-edge — NEVER patch glass-ui in kf (`rc-specular-glassui §3`, the rejected `::before { content: none }` workaround). |
| **the gate-ORACLE precept** (NEW, I-born — §below) | a gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME surface the human uses, with an ERROR BUDGET of 0 across PLAY + SWITCH + DRAG; a gate whose oracle is source text / a jsdom unit / a serialized snapshot / a self-captured baseline / a design-token number / a paperwork ledger is a HYGIENE gate, not a CORRECTNESS gate, and MUST be labeled as such — it may never count toward a correctness or chronic-closure tally | **THE I HEADLINE, BOUND AT I-OPEN (t=0).** This is a CHARTER INVARIANT, not a wave deliverable: it is bound the moment I opens so it is MECHANICALLY PRIOR to every wave's §Hard gate, not asserted backward by the last wave. It is enforced by machine — the `proof:gate-is-runtime` meta-gate (§below) REDS any wave that registers a source-shape-only oracle as its correctness gate. Every wave gate (I.W0–I.W7) inherits it from t=0 (`rootcause-rc-gate-blindspot §5.1`, `recap-precepts §4`). |
| **the error-budget ALLOWLIST** (NEW, I-born — H-2; §below) | the `proof:live-session` accumulated error budget is ONE structured allowlist, defined ONCE and inherited by every wave's console clause: HARD-zero on `pageerror`, `unhandledrejection`, `console.error`, and the value.js `"......"` parse line; PROMOTED-zero on the ReadPixels / content-visibility `warning`/`verbose` GPU-stall lines (they index a real defect); MINUS the named-benign dev source-map noise (the dist harness never emits it) | **CHARTER INVARIANT.** One budget definition, not per-wave drift. The amiga/WebGL warns and the dev source-map noise are reconciled here so no wave re-defines the budget (`rootcause-rc-gate-blindspot §5.2`, the I.W7 S2 allowlist). |
| **the two-tier oracle taxonomy** (NEW, I-born — H-4; §below) | every wave's GREEN depends on its RUNTIME clause (the gate's correctness oracle is the running product); the config / lint / class-shape clauses are HYGIENE-tier — strictly CORROBORATING, and they may NEVER substitute for a red runtime clause. A wave may not close on a hygiene clause alone | **CHARTER INVARIANT.** The two-tier taxonomy applies to the NEW gates, not just the retired ones — the overhaul holds itself to its own taxonomy (`rootcause-rc-gate-blindspot §5.3`, `recap-precepts §4`). |
| **the chronic-closure meta-invariant** (H-born, I-REPAIRED) | a chronic exits ONLY with (a) a passing SYSTEM-property gate that is a RUNTIME/INTERACTION gate which BIT born-RED on a defect tree, OR (b) a HANDOFF tag paired with a born-RED kf gate **targeting a PUBLISHED version or a kf-owned consume-edge fix — never an unreleased working-tree commit or a future version number** | **THE I REPAIR OF H's REPAIR.** H's meta-gate was ITSELF a source-shape gate parsing a markdown table (`proof-chronic-closure.mjs:46-100`) — the deepest expression of the blindspot it was built to close. I makes the meta-gate verify each cited gate is a runtime gate that bit, and forbids born-RED handoffs against vaporware (the `specular="off"` at glass-ui 3.8.0 that does not exist; `recap-chronic §7`). |

---

## § Thesis — I is the tranche that makes the gate ORACLE the running product

**H repaired the gate-blindspot in NAME — it added a `proof:visual-lock` baseline and 35
"interaction-axis" browser gates — while re-committing it in SUBSTANCE: those gates rest
passively on load, round-trip a proxy store, diff a masked self-baseline, or assert the wrong
DOM projection; none clicks the rainbow group-play, none drives the suspend codepath, none
drags `/square`.** The actionable band for I is the GATE REGIME: a single precept correction
(the gate-ORACLE precept) and one architectural transposition (the proxy lattice collapsed into
ONE interaction-driven session probe), underneath which the nine live breakages are fixed at
their true seams.

**The five proxy oracles, each nailed to a live breakage** (`rootcause-rc-gate-blindspot §2`):

1. **LOAD-REST.** `proof:demo-console-clean` rests on `/#/amiga` + `/#/easing`, waits 2500 ms,
   filters on ONE narrow regex — never clicks. B1 fires on the rainbow play CLICK, on home/cube,
   through a path the regex would have FILTERED OUT by design. The broad console it defers to
   (`proof:no-route-storm`) **was never authored** — referenced in six docstrings, counted in
   H's tally, absent from disk.
2. **PROXY-STORE.** `proof:scene-machine-irrefragable` (1074 lines) asserts a localStorage JSON
   snapshot round-trips byte-identically. B2 throws in the live adapter's `_gen` lifecycle — a
   thrown TypeError in a Vue watcher does not corrupt a serialized snapshot; the gate validates
   the PURE REDUCER while the EFFECTS layer dies.
3. **SELF-BASELINE.** `proof:visual-lock` captures its golden from the SAME build (post-defect)
   and MASKS OUT nearly every live subject (the amiga sphere, the easing curve, the ball
   sweeps) before diffing. It paints pink over exactly the pixels that move when a human uses
   the product, then certifies a still frame matches a still frame of itself. B3/B4/B6.
4. **WRONG-PROJECTION.** `proof:scene-control-dfa` DOES switch scenes — but asserts the chrome
   tab-trigger LABEL (`selectedControl === "easing"`, correct) while the easing PANEL is
   silently `data-state="inactive"`. Driving the interaction is necessary but NOT sufficient;
   the gate must assert the PRODUCT-FACING DOM the human sees. B4.
5. **PAPERWORK.** `proof:chronic-closure` parses a markdown table and asserts every cited gate
   NAME resolves — it proves the bureaucracy is tidy, nothing about whether any cited gate
   measures a real product property. The keystone durability mechanism is the deepest expression
   of the blindspot it was built to close.

**The architectural transposition (KISS, no legacy, no workaround):** replace the lattice of
~34 load-rest / wrong-projection browser gates with ONE re-runnable INTERACTION-DRIVEN session
harness — modeled on the proven `scripts/proof-no-orphan-specular.mjs` pattern (serveDist on
port 0 + chromium via `KF_PLAYWRIGHT_DIR` + fresh context per scene), the SAME harness every
investigate probe used to reproduce B1–B9, extended from PASSIVE to ACTUATING. For every scene:
load → CLICK the rainbow group-play → hover-expand the morphing dock + SWITCH to every other
scene (the real combobox path, not just hash) → fire a `visibilitychange` while a raw-rAF scene
plays (the B2 trigger) → DRAG on `/square` and the bezier handles → switch back → replay. THE
ORACLE is a single accumulated ERROR BUDGET = 0: zero `pageerror`, zero `unhandledrejection`,
zero `console.error`, zero value.js `"......"` parse lines, captured across the WHOLE battery
— PLUS product-facing DOM assertions read from the same surface the human sees. **One probe,
one budget, every interaction — the KISS inversion of 34 proxy gates** (`rootcause-rc-gate-blindspot
§5.2`).

---

## § The gate-ORACLE precept made falsifiable — the four structural consequences

Every I wave gate inherits the precept; these four rules make it bite (`rootcause-rc-gate-blindspot
§5.3`, `recap-precepts §4`):

1. **Every runtime gate DRIVES the interaction, never rests on load.** The console oracle must
   CLICK play, SWITCH via the dock, fire visibility, and DRAG — then assert the zero budget.
   (closes B1, B2)
2. **Every state gate exercises the LIVE OBJECT, never the snapshot.** The FSM suspend gate
   mounts a real scene, PLAYS it, fires a tab-hide AND switches away, and asserts no throw AND
   the leaving scene suspended AND the incoming resumes-iff-was-playing — against the live
   adapter and its `_gen`, not localStorage. (closes B2)
3. **The visual baseline is captured from a KNOWN-GOOD reference, never from self, and never
   masks the subject.** A human-approved reference render (or a prior-good tranche's render) is
   the baseline; the live subject is asserted ALIVE (a frame-delta probe proving motion), not
   painted pink. A self-captured, subject-masked baseline is downgraded to a hygiene gate.
   (closes B3, B4, B6)
4. **The chronic-closure meta-gate verifies the cited gates are RUNTIME gates that BIT.** A
   chronic row whose closure cites only source-shape / load-rest gates REDS. Born-RED handoffs
   may target ONLY a published version or a kf-owned consume-edge — never vaporware. (closes the
   keystone)

**The two-tier taxonomy is the whole move:** keep the ~54 source-shape / jsdom gates — they are
CHEAP and correctly police what their oracle CAN see (no-legacy held precisely because source
text IS the right oracle for it). But STRIP them of correctness authority and LABEL them
HYGIENE. Correctness and chronic-closure tallies may only be satisfied by a gate whose oracle is
the running product. The headline is NOT "more gates" — it is the oracle re-point + the lattice
collapse.

---

## § The precept is MECHANICALLY PRIOR — `proof:gate-is-runtime`, the charter meta-gate bound at t=0

The gate-ORACLE precept (and the error-budget allowlist + the two-tier taxonomy) are **CHARTER
INVARIANTS bound at I-open**, NOT deliverables of the last wave. This is the RED-1 correction: H's
failure was not lack of discipline but a precept asserted-after-the-fact; I makes the precept
mechanically prior so nothing forces I.W0–I.W7's gates to be runtime gates by authorial fiat —
the machine forces it. The enforcer is **`proof:gate-is-runtime`**, a meta-gate that runs from
t=0 over the broken tree and every wave's gate registration:

> **`proof:gate-is-runtime` (the charter meta-gate).** For every wave's §Hard gate registered as
> that wave's CORRECTNESS oracle, assert the gate DRIVES A REAL INTERACTION over the running
> product — it CLICKS / SWITCHES / DRAGS / fires a real visibility tick, and its pass/fail oracle
> reads a product-facing property (a thrown error, a painted pixel, the mounted DOM the human
> sees), with the structured error-budget allowlist applied. A wave that registers a
> SOURCE-SHAPE-only gate (grep / regex / a re-derived table / a localStorage round-trip / a
> design-token number / a self-masked baseline) AS ITS CORRECTNESS ORACLE **REDS** — the wave
> cannot close on a hygiene clause. (Hygiene clauses are permitted and encouraged as
> CORROBORATORS; they simply may not be the registered correctness oracle.) This is the structural
> answer to "the precept must be mechanically prior": the precept is enforced by a machine that
> runs at t=0, not by each wave author having read I.W7 first.

`proof:gate-is-runtime` is itself a meta-gate (it inspects gate registrations, not the product) —
a NEW I-born meta-gate, like a meta/aggregator it carries no correctness authority of its own and
does not count toward the ~98 nominal correctness gates; it polices the ORACLE class of the other
gates, the way `proof:chronic-closure` (rewired in I.W7) polices that each cited closure gate is a
runtime gate that BIT. The two together make the gate-ORACLE precept self-enforcing:
`proof:gate-is-runtime` forbids a source-shape correctness oracle at AUTHOR time; the rewired
`proof:chronic-closure` forbids a source-shape closure citation at CLOSE time.

**This is why the overhaul CLOSES (I.W7) rather than LEADS.** The precept does not need the
overhaul wave to exist before it can govern — it is a t=0 charter invariant enforced by
`proof:gate-is-runtime`. What the overhaul wave (I.W7) actually does is ASSEMBLE the
`proof:live-session` battery from the per-wave interaction legs (I.W0's play-click, I.W1's
visibility-tick + switch, I.W2's handle-drag, I.W3's centre-drag, I.W4's drag + perf, I.W5's
icon-paint, I.W6's bloom-at-rest) into ONE driven session probe, retire the superseded proxy
lattice, and rewire the chronic-closure keystone. The battery can only be fully green once
I.W0–I.W6 land — so it ASSEMBLES last. The PRECEPT leads (t=0); the BATTERY closes (I.W7). These
are not in tension: the precept is the rule, bound first; the battery is the union of the legs,
assembled last.

---

## § The blindspot-to-breakage ledger (the design input for the waves)

Every B1–B9 traces to a CLAIMED-ADDRESSED request, its confirmed root cause, and the seam fix.
(Sources: the eight `rootcause-*.md`; `recap-prompts §0`; `recap-chronic §8`; `recap-deferred §11`.)

| B | Live breakage | Confirmed root cause (file:line) | The gate that should have caught it · its proxy oracle | I seam fix (the transposition) |
|---|---|---|---|---|
| **B1** | rainbow group-play `Parse error at offset 0: "......"` + `this.transform is not a function` | (a) value.js `normalize.ts:213-217` hands `parseCSSValueUnit("")` the empty read-back of an UNSET `var(--rotationX)` — the bare-`"......"` fingerprint (`rc-parse-crash §1`); (b) `group.ts:373` unguarded `this.transform()` on an empty home group whose `transform!` field (`:38`) is never assigned, the lazy fallback the comment promises (`:118-122`) absent (`rc-parse-crash §6`) | `proof:demo-console-clean` · LOAD-REST + narrowed regex; defers to non-existent `proof:no-route-storm` | **ENGINE (inv-16 un-fenced):** typed empty-input handoff at the value.js parser boundary (empty in → typed-empty/fallback out, never a throw); serialize from the TEMPLATE not from `at()` (a `var()`/`matrix3d` round-trips verbatim, never DOM-resolved); default `AnimationGroup.transform` to a real no-op at the FIELD + short-circuit empty-group `play()`. Folds B5. |
| **B2** | DFA suspend/resume `undefined is not an object (evaluating 'this._gen')`; easing→amiga BLANK controls | `useEasingDemo.ts:227` + `useSpringDemo.ts:365` pass the UNBOUND `playback.stop` to `useSceneVisibilityPause`; `playback.ts:216` `this._gen++` throws with `this===undefined`; the throw aborts the Vue render flush → blank controls (`rc-dfa-gen §1`). The pure reducer is CORRECT — do NOT rewrite. | `proof:scene-machine-irrefragable` · PROXY-STORE (localStorage; stubs the live adapter; never fires visibilitychange) | **ENGINE + STRUCTURAL:** make `RAFPlayback`'s control surface BOUND-BY-CONSTRUCTION (arrow class-fields) — closes the whole unbound-method class; consolidate the duplicated raw-rAF boilerplate into ONE `useRafScene`. Preserve the suspend/save/resume-iff-was-playing reducer untouched. Folds B3's stale-controls-on-switch. |
| **B3** | `/amiga` "totally broken and floats around" | (RC-1) subject sphere parked at corner `(-5,-5,-5)` while `OrbitControls.target` stays origin `(0,0,0)` — center drags are raycast MISSES → the whole room tumbles (`rc-amiga §RC-1`); (RC-2) `content-visibility:auto` over a live WebGL rAF present loop → ReadPixels GPU stall (`rc-amiga §RC-2`). No crash, no pageerror — pure appearance/interaction. | `proof:visual-lock` · SELF-BASELINE + canvas MASKED OUT | **GEOMETRY transposition:** unify SUBJECT = ORBIT PIVOT = FRAMING (centre the sphere; `controls.target` tracks it) — the W5 drag-to-spin→`decay()` glide becomes reachable, the same idiom the cube ships. Drop `content-visibility:auto` from the WebGL root (folds into B8 perf). |
| **B4** | `/easing` LOST the curve/timing editor | reka `<Tabs :model-value>` `useVModel` latches `passive` from `modelValue===undefined` at the switch-tick; `TabsContent value="easing"` computes `isSelected:false` → `display:none` → the bezier canvas + selector unmount (`rc-easing-editor §root-cause`). NOT a J over-removal (the components still render on fresh load); NOT B1/B2. | `proof:scene-control-dfa`, `proof:easing-sidebar-*` · WRONG-PROJECTION (the tab LABEL) + FRESH-load source shape | **SINGLE-AUTHORITY:** mount the control surface DETERMINISTICALLY from the machine's control-surface projection (the `<Tabs>` born-correct on every entry); single-surface scenes (easing/spring) render their editor flat, bypassing the Tabs/v-show double-gate. Fold the read-only value+copy back; unify the two bezier hosts onto ONE `EasingEditor`. J-minimal stays; the editor un-hides. |
| **B5** | keyframes editor shows `/* timing-function: custom — no CSS twin */` | the W0 `try/catch` floor RENDERS the defect string (`KeyframesStringControls.vue:100-110`) — same empty-`var()` root as B1; the catch mis-attributes EVERY throw to the narrow `serializeEasing` custom-closure case | `proof:demo-console-clean` · the gate asserts the placeholder EXISTS (the floor IS its success criterion) | the floor is NOT the fix — land the value-seam + serialize-from-template fix so the twin serializes; KILL the mis-attributing placeholder in the same motion. Folds with B1. |
| **B6** | `/square` drag selects chrome text + does not persist | no GLOBAL select-suppression seam — `select-none` scoped to `.square-stage` (`SquareScene.vue:2`) over a `window`-scope drag (`:94`); `pointerup → reseat(0,0)` (`:104`) hard-codes spring-home, discarding the drag (`rc-drag-perf §1`) | (none) | **SINGLE-SEAM:** lift a global `is-dragging` body token into the shared `useDragScrub` (closes the LATENT class across every drag surface); migrate square's hand-roll onto it; a `releasePolicy: persist` so the box stays where released (matches the rail scenes). |
| **B7** | specular sheen STILL present; "latest glass-ui?" | glass-ui `~3.5.1` `<Card surface="glass">` emits `.glass-specular-track` UNCONDITIONALLY, `--mouse-x` never written → a static dead-centred warm-white bloom on stages + 9–11 dock tracks/scene (`rc-specular-glassui §1a`). 3.7.0 still blooms (no opt-out, more pervasive); the `specular="off"` default-off fix is tagged glass-ui `v3.8.0` LOCAL-only, UNPUBLISHED. | `proof:no-orphan-specular` · SOURCE-SHAPE — records the bloom as "accepted residue"; `proof:specular-handoff` born-RED against a phantom release | **TWO-SIDED CONSUME-EDGE (no kf fork):** (1) glass-ui SIDE — coordination ask to publish v3.8.0 (root-owned; `feedback_glass_ui_root_changes`); (2) kf SIDE — bump the pin, ride the new `specular="off"` default (zero kf CSS). Plus a kf-owned page-substrate with real depth so the flat glass plate has something to refract. KILL `proof:specular-handoff`. |
| **B8** | ALL dock animations "supremely broken, slow, errored"; glass-ui slow | the dock SPRING is GENUINELY settled (120fps clean). The felt "broken" is THREE adjacent paths: (a) B1 `"......"` floods the console while the dock is on screen; (b) `dock.css:512` `transition: width` under `backdrop-filter` (`:90`) → layout + backdrop re-blur every frame (12/114 dropped on expand); (c) `/easing` per-rAF `progress.value` write → 243-node SVG re-render (46 fps) (`rc-drag-perf §2`) | `proof:dock-morph-settled` · SOURCE-SHAPE (token peak; "no morph captured live") | **(a) folds into B1; (b) glass-ui consume-edge** — transform/clip-driven morph not `width` (glass-ui-owned; re-evaluate the pin); **(c) inv ζ** — non-reactive `style.transform` write + ONE composed `RAFPlayback` driver per scene. A CPU-throttled, drop-counting RUNNING-scene perf gate supersedes the token-peak gate. |
| **B9** | dev `ENOENT: easing-icon-sm.svg` + source-map ×47 | a dev-environment integrity failure, NOT a defect in the built product (the built `dist/` is clean — 0 icon 404s, 0 sourcemap non-200s). Root: no single source of asset truth across dev/build/gate + a default-outDir landmine (`vite.config.ts:274` `root` no `outDir` → a bare `vite build` re-spawns the Mar-25 `demo/app/dist/` orphan) + the SPA fallback masks the orphan as 200-HTML (`rc-icons-build §1`) | `proof:scene-icons` · SOURCE-SHAPE + LOAD-TIME (no runtime paint assertion; the SPA fallback hides the 404) | collapse the demo build to ONE canonical `outDir`; the dev SPA fallback must 404 asset-extension misses; ONE runtime icon-PAINT gate (every glyph a painting `<svg>` with non-zero box + zero asset-404 during interaction) replaces the source-shape gate. Source-map noise (B9-c): accept + document, assert clean only on the build. |
| **keystone** | chronics green while broken | `proof-chronic-closure.mjs:46-100` parses a markdown table; opens no browser; runs no cited gate (`rc-gate-blindspot §3`) | `proof:chronic-closure` ITSELF · PAPERWORK | OVERHAUL — the gate-ORACLE precept + consequence 4 (cited gates must be runtime gates that bit; no vaporware handoffs). |

---

## § The WAVE MAP

The DAG: **the gate-ORACLE precept LEADS as a charter invariant (bound at t=0, §above), enforced
by `proof:gate-is-runtime`; the gate-regime OVERHAUL (I.W7) CLOSES** — its `proof:live-session`
battery ASSEMBLES from each prior wave's interaction leg and so is fully green only once I.W0–I.W6
land. The crash fixes lead the FIX waves: **I.W0** (the engine empty-input `"......"` + `this.transform`
crash) leads because its console flood and the `_gen` flush-abort (**I.W1**) "poison every other
measurement" — until they die, no other wave's console oracle is readable. The
appearance/interaction waves (I.W2 easing, I.W3 amiga) and the perf/drag wave (I.W4) follow; the
specular consume-edge (I.W6) rides the glass-ui pin; the build-hygiene + shell-chrome (I.W5) and
the OVERHAUL-that-CLOSES (I.W7) trail. **The mobile composition seams (M1/M2/M3) are FOLDED into
existing waves, not a separate wave** (M2 controls-reachability → I.W2's control-mount single
authority; M1 menubar-occludes-sheet → I.W4/I.W5 layout; M3 dock `transition:all` → I.W4 perf +
the I.W6 pin) — `recap-chronic §8`.

**Precept-vs-battery (the RED-1 reconciliation, stated once and binding):** the gate-ORACLE
precept does NOT lead as a wave — it leads as a CHARTER INVARIANT bound at I-open, mechanically
prior, machine-enforced by `proof:gate-is-runtime` (§above). I.W7 is sequenced LAST not because
its precept is asserted last, but because its `proof:live-session` BATTERY is the union of the
per-wave legs and can only be fully green once the legs land. The precept leads (t=0); the battery
closes (I.W7). The four spine docs (this charter, `PROGRESS.md`, `PATH-FORWARD.md`,
`waves/README.md`) share this ONE numbering and this ONE DAG.

| Wave | Title | Owns (B-IDs · folds) | The REAL runtime gate it proves itself with |
|---|---|---|---|
| **I.W0** | **KILL THE `"......"` CRASH AT THE VALUE SEAM** (engine; LEADS the fix waves — poison removal) | **B1** (the parse half) · **B5** (folds) · the net-new `this.transform` group-play crash | the driven console gate: load a `var(--rotationX)` scene, CLICK rainbow play on HOME (the empty-home-group repro) AND cube, mount the keyframes pane → ZERO `pageerror`/`"......"`/`console.warn`; the pane shows real round-trippable `@keyframes` (NOT the placeholder); a `.cube` transform DELTA proves the draw loop is LIVE (no silent no-op). |
| **I.W1** | **THE BIND-PROOF PLAYBACK + THE `useRafScene` CONSOLIDATION** (engine + structural) | **B2** · folds B3's stale-controls-on-switch | load a raw-rAF scene, AUTO-PLAY, fire `visibilitychange→hidden` (the SYNTHETIC born-RED-of-record) AND drive a dock-Select switch WHILE PLAYING (the integration assertion, gated after the B8 dock is hit-testable) → ZERO `pageerror`; the destination's DFA controls render NON-BLANK; the source suspends + the incoming resumes-iff-was-playing — against the live adapter's `_gen`, run in ONE persistent context across the (scene→scene) matrix where the source is PLAYING. Plus the `@typescript-eslint/unbound-method` static lint (HYGIENE-tier corroborator). |
| **I.W2** | **THE CONTROL-SURFACE SINGLE AUTHORITY + THE UNIFIED EASING EDITOR** (folds mobile M2 controls-reachability) | **B4** · M2 (body-clips-controls) | dock-switch INTO Easing → `.easing-curve-canvas` PRESENT + `display!==none` + host `[role=tabpanel]` `data-state=active`; ≥2 `.control-point.handle` + a handle-drag MUTATES the bezier `d`; the read-only value+copy present; the same for the return path + spring's single-surface panel; ZERO `pageerror`/`_gen`/`"......"`. |
| **I.W3** | **THE AMIGA INTERACTION-MODEL TRANSPOSITION** | **B3** (RC-1 geometry) · RC-2 folds into I.W4 perf | a centre-canvas pointer drag on `/amiga` → the SPHERE rotation/centroid changed (subject moved) WHILE the room/camera did NOT tumble (pivot IS the subject) — the inverse of the whole-room re-projection the probe measured. |
| **I.W4** | **THE DRAG + PERF TRANSPOSITION** (shared drag seam · one composed frame driver · dock motion) | **B6** (the shared select-suppression + persist seam) · **B8** (b: glass-ui dock consume-edge · c: inv ζ) · B3 RC-2 (drop `content-visibility:auto` from the WebGL root) · M3 (dock `transition:all`, ties the I.W6 pin) | DRIVE a real pointer drag over a dock/control label → `getSelection()` empty (suppression live) AND the dragged element's transform ≠ identity after settle (persists) — EVERY drag surface, not just square. PLUS under a CDP CPU throttle (the named factor, threshold BOUND from `b16`): expand the dock + sample rAF → dropped frames ≤ the bound budget; switch to `/easing`, PLAY the preview, sample rAF → ≤ the bound budget. SUPERSEDES the token-peak gate; a promoted `warning`/`verbose` console clause fails on ReadPixels / GPU-stall / content-visibility logs. |
| **I.W5** | **BUILD-HYGIENE + ASSET SINGLE-SOURCE + SHELL CHROME** (folds mobile M1 layout) | **B9** (one canonical outDir; SPA 404s asset misses; runtime icon-paint gate; accept+document the dev source-map noise) · **K** (`document.title === "keyframes.js"`) · **DC-8** (grep scene-swap dead-CSS = 0; KILL — default — or restore via `startViewTransition`; no fourth defer) · M1 (`sheet.bottom ≤ menubar.top`, anchor from MEASURED menubar height) | the runtime icon-paint gate: every `SceneDescriptor` glyph a painting `<svg>` with non-zero box across all scenes + the editor; server-404 set empty during interaction; the deployed `document.title` equals exactly `keyframes.js`. Plus a HYGIENE-tier `engine.ts ≤ 1400 OR a named-measured cohesive split` ceiling clause (C-6). |
| **I.W6** | **THE SPECULAR + GLASS-LEGIBILITY CONSUME-EDGE** (B7; two-sided, root-owned) | **B7 / CH-1** · the mobile M3 dock-`transition:all` retune (rides the same v3.8.0 pin) | at REST (no hover), every stage glass `::before` AND every dock/play glass `<Button>` track: catch-light ABSENT — the PRIMARY correctness oracle is a PERCEPTUAL luminance delta (no catch-light bloom in the rendered pixels over the plate at rest); the class-absence check is a HYGIENE-tier corroborator, NOT an OR-escape. Blocked on the glass-ui v3.8.0 publish coordination ask (a PUBLISHED target, not vaporware). The substrate-depth styling (S3) is a non-blocking hygiene corroborator; bloom-absent is the B7 deliverable. |
| **I.W7** | **THE GATE-REGIME OVERHAUL** (the headline; CLOSES the DAG) | the keystone blindspot · the gate-ORACLE precept's MACHINE installation (`proof:gate-is-runtime`, registered here, the precept itself bound at t=0 as a charter invariant) · the two-tier HYGIENE-vs-CORRECTNESS taxonomy · the ONE interaction-driven `proof:live-session` harness (ASSEMBLED from the per-wave legs) · the structured error-budget allowlist (defined once, inherited) · retire/relabel the proxy lattice · rewire `proof:chronic-closure` to verify cited gates are runtime gates that bit + forbid vaporware handoffs · DELETE `proof:specular-handoff`, the never-authored `proof:no-route-storm` reference, the masked self-baseline's correctness authority | `proof:live-session` born-RED on `b934a08` (every B1–B9 trips the budget), GREEN only once I.W0–I.W6 land (the battery is the union of their legs); `proof:gate-is-runtime` REDS any wave whose registered correctness oracle is source-shape-only; the rewired `proof:chronic-closure` REDS a chronic row that cites only source-shape gates. The overhaul IS the gate. |
| **I.WZ** | **CLOSE** (FINAL.md · recap · ledger · changeset · deploy) | the honest close — `proof:live-session` GREEN, every retired proxy gate DELETED/relabeled, the chronic ledger re-verified live, the IMMEDIATE `d469e69` deploy-revert tracked + post-revert verified, the changeset cut (version owner Mike Babb, `mike@babb.dev`, USER-DOMAIN, confirm-first), the CF-Pages deploy | `proof:all` GREEN where "green" now means a human using the product would see it work; `proof:chronic-closure` cites only runtime gates that bit; the deployed demo at keyframes.babb.dev re-driven through PLAY + SWITCH + DRAG with a zero budget. |

---

## § The DEV / IMPL boundary

This DEV phase AUTHORS. The IMPL phase AWAITS authorization. The boundary is exactly D.W0 /
E.W0 / F.W0 / G.W1 / H's:

- **Authored now (DEV):** this charter, the per-wave specs (`docs/tranches/I/waves/I.W*.md`),
  the path-forward, the I ledger (the KFI / sibling-HANDOFF / BOOK / RECORD-KILL dispositions),
  the recaps and root-causes (already on disk under `audit/`). The investigation harness +
  probes + shots are DEV artifacts (they reproduce, they do not fix).
- **Run later (IMPL), only on explicit user authorization, gated on keyframes' own green CI:**
  every source / demo / engine / test / CI / bench edit; the gate-regime overhaul implementation;
  the B1–B9 seam fixes; the glass-ui v3.8.0 coordination ask + consume; the changeset + publish
  + deploy (USER-DOMAIN, confirm-first).
- **The engine exception is a DEV decision recorded here, an IMPL action later:** `src/animation`
  is named IN SCOPE for the B1/B2/B3 transpositions (inv-16 un-fenced for the engine) — but NO
  engine source is written in DEV.

**Honest already-done — manufacture NO I work here** (`recap-chronic §9`, inv ε): the φ-hero
chronic (CH-2) is GENUINELY closed (the one design chronic the system gate discharged — do NOT
re-litigate the φ-ladder); the dock SPRING retune (D5) is settled (120fps clean, the model
glass-ui HANDOFF); the mobile spring + full-bleed BONES are real (only the edge seams leaked);
the cartoon PANELS read correctly (the defect is the glass STAGE sheen, not the panels); the
engine / parse / color / re-pin kernels stay ALREADY-SOTA; the chronic-closure ARCHITECTURE is
the right repair (I fixes its two failure modes — vaporware targets + wrong-axis gates — it does
NOT replace it).

---

## § The CHRONIC + DEFERRED fold (from the recaps)

**Born-RED / still-broken → FOLD into I, each behind a RUNTIME/INTERACTION gate**
(`recap-chronic §8`, `recap-deferred §11`):

- **B1** the `"......"` serialize crash (H.W0 incomplete — the headline; the value seam, engine
  un-fenced). Folds B5. → I.W0
- **B2** the `_gen` DFA suspend/resume crash (H.W1 keystone un-sound — unbound `playback.stop`).
  Folds B3's stale-controls-on-switch. → I.W1
- **CH-1 / B7** the specular sheen on stages + docks (papered; the HANDOFF target VAPORWARE) —
  RE-OWN the disposition (publish-then-bump-and-consume-default; reject the kf-side neutralizer).
  → I.W6
- **CH-3 / mobile** the composition seams — NOT a separate wave; FOLDED into existing waves:
  M2 body-clips-controls → I.W2 (control-mount single authority); M1 menubar-occludes-sheet →
  I.W5 layout (and I.W4 where the drag surface overlaps); M3 dock `transition:all` → I.W4 perf +
  the I.W6 pin. The bones are real; the seams leaked.
- **B3** amiga geometry (corner subject vs origin orbit) → I.W3; RC-2 (`content-visibility` over
  a live WebGL loop) → I.W4 perf.
- **B4** the easing-curve/timing editor (the reka controlled-Tabs latch on switch, NOT a J
  over-removal) — restore by single-authority. → I.W2
- **B6** `/square` drag (no global select-suppression; non-persistence) — the shared drag seam.
  → I.W4
- **B8** the "broken dock" bundle = B1 + the `transition:width`-under-backdrop + the `/easing`
  render storm (the dock SPRING itself is closed-for-real). → I.W0 (the B1 console half) + I.W4
  (the perf half + the glass-ui dock consume-edge, riding the I.W6 pin).
- **B9** (low/hygiene) the dev-vs-build asset divergence + the runtime icon-paint gate. → I.W5
- **DC-8** (verify) the twice-deferred scene-swap dead-CSS — KILL (default) or restore via
  `startViewTransition`; no fourth defer. → I.W5
- **§3.A** the value.js empty-input parse contract — KFI engine transposition (serialize-from-
  template) + value.js-HANDOFF defense-in-depth (`parseCSSValueUnit("")` returns typed-empty,
  never a throw). → I.W0
- **§3.B** the glass-ui specular consume-edge — KFI consume-edge decision + glass-ui-HANDOFF
  (the upstream default-off, decoupled from kf's critical path; the H born-RED-to-3.8.0 target
  is VAPORWARE). → I.W6

**Closed-for-real → re-affirm, do NOT re-litigate:** CH-2 φ-hero typography (the model close);
CH-4 / D5 the dock SPRING retune (120fps clean, gated, honest); C-1 the value.js charter
(CHRONIC-by-design, the process working).

**Carry (correct OUT / sibling-HANDOFF / BOOK):** the value.js next-slice (VJ-1…VJ-9 — ride
the next re-pin, ZERO kf edit, except the empty-input contract promoted to §3.A); the parse-that
`(id,offset)` packrat re-key (PT-1, internal soundness); the engine BOOKs (FB-1 composition,
FB-2 sync-step, SoA `lerpArray`, FB-3 MorphSVG→VJ-F1, FB-5 intrinsic-size, FB-6 `Mod+K`,
LD-DIAG diagnostics, A7 idle-bob, A9 matrix Euler); the glass-ui `{types}` VT helper / Drawer
`spring` / LabeledField `orientation` (GH-3/GH-4/G-3 — GH-4 folds IF I elects D11 scene-VT
interactivity, else BOOK); the deploy HANDOFFs (DEP-1 P0 CNAME, DEP-2 template, DEP-3 roster —
kf authors, deploy writes).

**Permanent KILL (RECORD, do NOT re-litigate):** ScrollTimeline-native-replace,
Worker/OffscreenCanvas/Houdini, WASM-parser-replace, Typed-OM interp carrier, per-property
keyframe easing, bit-packing, dev.sh/deploy.sh (K-1…K-9 + D1 + SUP-7).

**USER-DOMAIN:** the I re-publish (a version bump, owner Mike Babb — stacks atop 4.1.0;
confirm-first).

---

## § The terminal reading (the one paragraph for the impl phase)

H did not fail for lack of discipline. It failed by pointing a rigorous born-RED discipline at
the WRONG ORACLE — source shape, a jsdom unit, a localStorage snapshot, a subject-masked
self-baseline, a design-token number, a markdown table — and then enshrining that mis-aim as
the durability mechanism in `proof:chronic-closure`, a source-shape gate policing other gates'
paperwork. ~54 of ~98 gates cannot by construction see a runtime defect; the ~34 that open a
browser rest on load, round-trip a proxy store, diff a masked self-baseline, or assert the
wrong DOM projection — and NOT ONE drives the single gesture the user performs first. **Tranche
I's correction is singular and architectural: bind the gate ORACLE to the running product,
exercised through the human's surface, with a zero error budget across PLAY + SWITCH + DRAG** —
collapse the proxy lattice into ONE interaction-driven session probe, downgrade every
source-shape gate to a labeled hygiene tier, and fix the nine live breakages at their true seams
(the engine value-input seam, the bind-proof playback surface, the single-authority control
mount, the unified easing editor, the amiga geometry, the shared drag seam, the composed frame
driver, the published-default specular consume-edge, the single-source asset build). The
gate-regime overhaul is the headline; it is the ONLY way "green" comes to mean "a human using
the product would see it work," and the ONLY way the gate-blindspot closes — for good.
</content>
</invoke>
