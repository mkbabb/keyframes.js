# Tranche H DEEP harden — lane `hd-overreach`

**Charge.** The inverse failure: does ANY H wave reach into the 9 ALREADY-SOTA areas
(`_SYNTHESIS-gap-scorecard §5`, `H.md §ALREADY-SOTA`) that H must NOT touch — the engine
kernel, the φ-ladder mechanism, the design-idioms consolidations, the scene-SUBJECT
dogfood, glass-ui consumption hygiene, the rAF orchestration, the affixed-dock scaffold,
the deferred-ledger spine, the gate lattice at what it covers? Flag every over-reach
(growing `engine.ts`, re-authoring φ rungs, re-doing a consolidated token/SOTA consumer).

**Method.** Read `H.md` (all 9 waves) + `_SYNTHESIS-gap-scorecard` §1.2/§5 + the source
lanes that DEFINE each SOTA boundary (`a-engine-regressions`, `a-scene-state-machine`,
`a-precept-sweep` P-05, `a-deferred-ledger` C-6, `a-design-language` §7, `a-styling-idioms`,
`a-scene-cube-amiga`, `a-scene-spring-sequence`, `a-gate-blindspots` §3, `a-deferred-chronic`).
Verified against the live tree (`engine.ts` 1375L; `proof:engine`/`proof:decomposition`
ceilings; `springLinearStops` call sites; `--controls-pane-width` consumers; glass-ui
3.4.0 `surface="cartoon"` API) and the running demo at `:5173` (the H-A2 `"......"` throw,
the `_lerp`-in-value.js origin).

**Verdict in one line.** H's spine is genuinely disciplined about the SOTA refusal —
8 of 9 areas are correctly left alone and the charter even *demotes* the source lane's
"in one motion" engine edit to a RECORD (a good catch). But **two waves carry a real
over-reach risk into the gated engine kernel (H.W0 S2 / H.W1 S4)** and **one wave
manufactures a DRY refactor of an already-single-sourced SOTA spring consumer (H.W5 S3)**.
Plus a load-bearing anchor-fidelity defect: the engine edit is anchored to dev-bundle
line numbers, not the source seam. No wave re-authors the φ rungs, re-does a consolidated
token, or re-touches the rAF/dock/ledger SOTA — those refusals hold.

---

## BLOCKER / HIGH findings

### F1 [HIGH] — H.W0 S2 risks tripping the GATED engine-class ceiling AND duplicating a value.js-owned classification (engine-kernel over-reach)

- **Doc location:** `H.md §H.W0 S2` (`:313`) + `_SYNTHESIS-gap-scorecard §3 H.W0` (`:125-126`),
  `§1.1 live console crashes`.
- **Defect.** H.W0 S2 proposes a kf-side engine edit — "the engine classifies a bare
  non-numeric/non-color text leaf as a discrete hold-snap" at `processFrame`. The real
  source seam is `engine.ts:778-779` (`for (const iv of frame.allInterpVars) lerpValue(eased, iv)`),
  which is INSIDE `export class Animation` (`engine.ts:82`→`CSSKeyframesAnimation` at `:1157`,
  so the Animation class body is ~1075L). Two HARD-gated ceilings bite here, BOTH with ~25L headroom:
  - `proof:engine` D-4 (`scripts/proof-engine.mjs:66` `ANIMATION_CLASS_CEILING = 1100`) —
    "the god-object is regrowing" reds if the Animation class exceeds 1100; it is ~1075 today.
  - `proof:decomposition` (`scripts/proof-engine.mjs:64` `LIBRARY_CEILING_OVERRIDE engine.ts: 1400`)
    — file ≤ 1400; live `engine.ts` = **1375L** (verified `wc -l`), 25L headroom (`a-deferred-ledger` C-6 `:170`).
  A discrete-leaf classifier with its branch + comment can plausibly consume that headroom,
  reddening a gated ALREADY-SOTA guard the SOTA refusal (`§5.1`: "H must not grow it without
  a measured cohesive split") forbids tripping.
  **AND** the H-A2 source lane itself flags the classification as possibly a **value.js-HANDOFF**:
  "the discrete-classification may be a value.js-HANDOFF if the parse happens entirely inside
  value.js's `_lerp`/`flattenObject`; the engine-side guard ... is the kf-side belt-and-suspenders"
  (`a-engine-regressions:139-147,357`). **Live-confirmed:** on `#/easing`→`#/spring` the throw
  fires (`Parse error at offset 0: "......"`, 5× this session) and the frame ORIGINATES in
  value.js — `at Object.Wo [as _lerp] (node_modules/.vite/deps/@mkbabb_value__js.js:4678)`,
  THEN `CSSKeyframesAnimation.processFrame (engine.ts)`. The parse-and-throw lives in value.js's
  `_lerp`; the kf-side engine guard would *intercept before* value.js, which is a defensible
  belt — but the charter commits it as the PRIMARY fix with no acknowledgement that the deeper,
  DRY fix is a value.js discrete-leaf classification (the headline "interpolate ANYTHING" is a
  value.js property), nor that the kf edit lands against a 25L-headroom gated ceiling.
- **Concrete doc edit.** In `H.md §H.W0 S2` and `§Design decisions RESOLVED`, (a) re-anchor
  the seam to **`engine.ts:778-779` (`processFrame` → `lerpValue`), inside `class Animation`**
  (not `:516,576` — see F4); (b) add a sentence acknowledging the gated ceiling: "the guard is
  a minimal early-return branch in `processFrame`; if it cannot land within the `proof:engine`
  Animation-class ceiling (1100, ~25L headroom) it is a `value.js-HANDOFF` (the discrete-leaf
  classification belongs in value.js's `flattenObject`/`_lerp` — the headline 'interpolate
  anything' is value.js's property) PAIRED with a born-RED `proof:interpolate-anything` text-leaf
  row, per the chronic-closure discipline"; (c) state the gate clause explicitly does NOT require
  the engine edit — the `{label:"a"}→{label:"b"}` discrete-snap row can green via either the kf
  guard OR the value.js handoff.

### F2 [HIGH] — H.W1 S4 scope says "add the engine `serialize()/hydrate()` seam"; the §decision demotes it to a RECORD — the scope text still reads as a SOTA engine edit

- **Doc location:** `H.md §H.W1 S4` (`:326`) + `§Design decisions RESOLVED (2)` (`:329`);
  source `a-scene-state-machine §6b` (`:222-227`, `:239`).
- **Defect.** The source lane is explicit: "Add `AnimationGroup.serialize()/hydrate()` to the
  engine ... ship the SM + engine seam **in one motion**" (`a-scene-state-machine:224,239`).
  That is a genuine ALREADY-SOTA engine-kernel edit (verified: no `serialize`/`hydrate`/
  `PlaybackSnapshot` exists on `group.ts`/`engine.ts` today). The charter §H.W1 §decision (2)
  CORRECTLY softens this — "the engine `serialize()/hydrate()` seam is a value.js/engine-RECORD —
  the store lands first against the **existing imperative restore**, then swaps (no engine edit
  gated to the store)" — and that is feasible: the existing imperative restore at
  `usePlaybackSnapshot.ts:52-82` (hand-mutates `started`/`lastTickTime`/`startTime`/`pausedTime`/
  `transformFramesGrouped`) is exactly the surface the store can land against. **But S4's SCOPE
  bullet still reads "add the engine `AnimationGroup.serialize()/hydrate()` seam"** as a wave
  deliverable, and the `proof:scene-machine-irrefragable` gate's "byte-identical playback" clause
  could be read as REQUIRING the seam. The tension: the §decision says RECORD/deferred-swap, the
  §scope says "add the seam." An implementer reading the scope first will grow the gated engine
  kernel (a SOTA over-reach) believing the wave demands it.
- **Concrete doc edit.** In `H.md §H.W1 S4`, change the WHAT to: "the store lands first against
  the EXISTING imperative restore (`usePlaybackSnapshot.ts:52-82`); the engine
  `AnimationGroup.serialize()/hydrate()` seam is a **RECORD** (a value.js/engine deferral, NOT a
  H.W0-W8 deliverable) — H does not grow `engine.ts` to land the FSM." Add to the gate that
  `proof:scene-machine-irrefragable`'s suspend-identity clause is satisfiable against the imperative
  restore (no engine seam required to green it).

### F3 [HIGH] — H.W5 S3 "the triple-forked `springLinearStops` collapses to one composable" manufactures a DRY violation; the engine export is ALREADY single-sourced (SOTA spring consumer)

- **Doc location:** `H.md §H.W5 S3` (`:378`) + `§Mandate "NO legacy beside its replacement"`
  (`:66`, "the `springLinearStops` triple-fork collapses to ONE composable") +
  `_SYNTHESIS-gap-scorecard §1.1 modes-pertinence` (`:66`, "`springLinearStops` surfaced 3×").
- **Defect.** "Triple-fork" / "surfaced 3×" conflates CALL-SITE COUNT with FORKED IMPLEMENTATION.
  Verified live: there is ONE source — `@src/animation/springLinearStops` (the engine export,
  `§5.4` SOTA spring rail) — consumed at exactly two sites, **both importing the single engine
  function**, with LEGITIMATELY DIFFERENT inputs:
  - `SpringSidebar.vue:104,130`: `springLinearStops({ response: demo.response.value, dampingFraction: demo.dampingFraction.value })` (LIVE slider values).
  - `StartingStyleTarget.vue:76,95`: `springLinearStops({ response: preset.value.response, dampingFraction: preset.value.dampingFraction })` (a FIXED preset).
  The "third" site (the Spring scene proper, `useSpringDemo.ts`) uses `springTimingFunction`, a
  DIFFERENT function — not `springLinearStops` at all. The source lane confirms there is no fork:
  the two sites "share `springLinearStops` via the engine import both already use
  (`@src/animation/springLinearStops`), NOT via dir" (`a-scene-spring-sequence:252-253`). This is
  textbook-correct DRY — one engine source, called with different args. Forcing it into "ONE
  composable" is either a no-op (the engine IS the single source) or wraps two
  genuinely-different-input call sites in needless indirection — a manufactured refactor touching
  a `§5.4`-SOTA spring consumer (the inverse failure the lane is charged to prevent).
- **Concrete doc edit.** In `H.md §H.W5 S3` and `§Mandate`, replace "de-dup the triple-forked
  `springLinearStops` to ONE composable" with the accurate statement: "the `springLinearStops`
  ENGINE export is already single-sourced (`@src/animation/springLinearStops`, `§5.4` SOTA); both
  consumers (`SpringSidebar.vue`, `StartingStyleTarget.vue`) import it with different args — no
  fork to collapse. The Discrete→Spring MERGE (the real S3 work) co-locates the
  `@starting-style` view under the spring directory; it does NOT re-author the engine call."
  Drop the "triple-fork" claim from the mandate's no-legacy list.

---

## MED findings

### F4 [MED] — the engine-edit anchor `engine.ts:516,576` is a DEV-BUNDLE line number, not the source seam (anchor-fidelity; load-bearing for F1)

- **Doc location:** `H.md §H.W0 Scope/State/S2` (`:309,311,313`), `§inv-16/inv ε compliance`
  (`:605`); `_SYNTHESIS-gap-scorecard §1.1 live console crashes` (`:71`), `§3 H.W0` (`:125`).
- **Defect.** The docs repeatedly anchor the H-A2 engine fix to `engine.ts:516,576`. In SOURCE
  those lines are `setRespectReducedMotion` (516) and `setOptions` (576) — option setters with
  ZERO relation to interpolation/lerp (verified by Read). The actual interpolation seam is
  `processFrame` at `engine.ts:769-784` (the `lerpValue(eased, iv)` call at `:778-779`). The
  `:516,576` numbers are the DEV-SERVED bundle line numbers: the live throw trace reads
  `CSSKeyframesAnimation.processFrame (engine.ts:576:4)` AND `interpFrames (engine.ts:516)` —
  but that is the Vite-served module, not `src`. The engine-regressions lane got it right
  (`a-engine-regressions:103-105,116` cites `engine.ts:778-780` for `processFrame`); the
  scorecard transcribed the runtime trace's line numbers verbatim. This mis-anchors the very
  edit F1 warns about — an implementer following `:516,576` edits the wrong methods or, worse,
  trusts a bogus anchor.
- **Concrete doc edit.** Replace every `engine.ts:516,576` in `H.md` and `_SYNTHESIS-gap-scorecard`
  with **`engine.ts:778-779` (`processFrame` → `lerpValue`; `class Animation`)**, optionally noting
  "(the `:516,576` in the live console trace are dev-bundle lines)".

### F5 [MED] — `--controls-pane-width` called "decorative"; it is a CONSUMED grid-track token — and a source lane prescribes USING it, not deleting it (un-adjudicated divergence)

- **Doc location:** `H.md §H.W3 State` (`:350`, "the token is decorative"),
  `_SYNTHESIS-gap-scorecard §1.1 timeline-width` (`:60`, "token decorative").
- **Defect.** The token is NOT decorative: it is DEFINED (`design-idioms.css:106`) and CONSUMED
  as the controls grid's left track (`AnimationControlsGroup.vue:5`
  `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]`) and as `ControlsPaneWrapper.vue:206`
  `min-width`. The accurate claim (from `a-timeline-width:25,67-72`) is subtler: the token is
  "nominal only — NOT HONORED as an effective width authority" because the `1fr 1fr` siblings let
  the `400px` track grow (live computed `1353.59px 0px 0px`). "Decorative" overstates this into
  "unused," which mischaracterizes the live state. Compounding: an UN-ADJUDICATED cross-lane
  divergence — `a-design-language §5/A7` (`:89,152`) prescribes the OPPOSITE direction for D4:
  "constrain the ribbon to `max-width: var(--controls-pane-width)` — DRY through the EXISTING
  token, no new literal," whereas H.W3 DELETES `--controls-pane-width` for `--rail-width`. Both
  are single-motion/spine-compliant (so not a blocker), but the synthesis adjudicated the D12
  store and the cartoon mechanism while leaving this token-direction split silent.
- **Concrete doc edit.** In `H.md §H.W3 State` change "the token is decorative" → "the token is
  CONSUMED as the grid's left track (`AnimationControlsGroup.vue:5`) + the pane `min-width`
  (`ControlsPaneWrapper.vue:206`) but is NOT an effective width authority — the `1fr 1fr`
  siblings let the 400px track grow (`a-timeline-width:67-72`)." Add a one-line adjudication:
  "`a-design-language` A7 proposed honoring `--controls-pane-width` on the ribbon; H supersedes it
  — the token is RENAMED→`--rail-width` (a single-motion replacement, not legacy-beside) so the
  ribbon and sidebar share ONE authority, satisfying A7's DRY intent without the grow-prone grid."

---

## LOW / NIT

### F6 [LOW] — specular host count diverges 12 vs 13 across the spine (consistency, not over-reach)

- **Doc location:** `_SYNTHESIS-gap-scorecard §1.1 glow/cartoon-shadow` (`:58`, "13 hosts") +
  `H.W2 State/gate` (`:337,340`, "13 hosts"/"13 orphan tracks") vs `a-styling-idioms:33,105,141`
  ("12 hosts") + `_SYNTHESIS-design-language:205` ("~12 live hosts").
- **Defect.** Two host counts (12 / 13) across the spine, likely route-dependent. The H.W2 gate
  is "ZERO orphan specular," so the exact count does not change the bite — purely a consistency
  blemish (the first 4-lane consistency pass's genus, not over-reach). Note here only for
  completeness; flagging it is honest but it does not endanger implementation.
- **Concrete doc edit.** Normalize to "~12-13 specular hosts (route-dependent)" or pin to one
  route's measured count; immaterial to the gate.

---

## §ALREADY-SOTA areas correctly left alone (the honest non-finding — inv ε)

Audited each of the 9 `§5` areas for an H over-reach; these 6+ are clean — H references them
only as RECORD/credit, never re-authors:

- **φ-ladder MECHANISM (§5.2).** H.W4 changes ONLY the hero RUNG SELECTION (`text-display-4`
  →`text-display-mega`, a NAMED delta) + sweeps 2 leaf rungs; it does NOT re-derive the √φ rungs
  or touch the Capsize fallback. `a-design-language §2` (`:61,69`) and `a-hero-typography`
  corroborate "ALREADY-SOTA on the mechanism." No over-reach.
- **design-idioms consolidations (§5.3).** `a-design-language §7.4-7.6` records
  rainbow/gold/rail/ball/badge/code-token + z-contract + work-area token algebra as
  ALREADY-SOTA "no change." H.W4's NEW `@utility icon-*` is a CONTRACT EXTENSION of the same
  `design-idioms.css` ownership layer (`a-styling-idioms` prescribes extending `proof:idioms`
  clause-1 membership), not a re-do of a consolidated token. H.W3's `--rail-width` is a fresh
  layout token, distinct from the SOTA-recorded `--dock-band-reserve`/work-area pair. No over-reach.
- **scene-SUBJECT dogfood (§5.4).** The SOTA set is cube `AnimationGroup` / spring
  `SpringProgress` rail / Sequence transport / `useSceneSwap` / `CopyButton`. H.W5 S6 touches
  amiga (A3 tessellate BUG, A2 dpr — amiga is the WEAKEST-pertinence scene, explicitly NOT in
  the SOTA set; `a-scene-cube-amiga` flags A5 KILL-candidate) and BOOKs the cube `idle-bob`
  (A7, a cohesion BOOK, not SHIP) — Sequence is "kept as-is, SOTA." No SOTA subject is
  re-authored. (The `springLinearStops` mischaracterization is F3, a wording defect — the merge
  work itself is sound.)
- **rAF orchestration (§5.6) + affixed-dock scaffold (§5.7).** H.W7 re-COMPOSES the mobile
  layout (stack→overlay) and dogfoods `SpringProgress` for the sheet; it preserves the affixed
  `position:fixed`+`--work-area-*-offset` skeleton (`a-mobile-architecture` F3 SOTA) and the
  `useRafLoop({guard})` orchestration. inv δ (no dock occlusion) is held as a standing
  constraint. No over-reach.
- **deferred-ledger spine (§5.8) + gate lattice at what it covers (§5.9).** H.W8 EXTENDS the
  lattice (appearance axis, interaction axis, re-sourced manifest, chronic meta-gate) and
  explicitly preserves the existing source-shape/not-blank gates as exemplary
  (`a-gate-blindspots §3`: "exemplary at what it covers"; `a-deferred-chronic`: the C.W2 closures
  are "exemplary"). It adds, never re-papers. No over-reach.
- **engine kernel correctness waves (§5.1, H-A4..A10).** The blend leaf, orbital rotate3d,
  `.finished`/DrawSVG, `adoptCompiled`, the store singleton, the rAF-leak fix are all RECORD —
  no wave touches them. The only engine RISK is the H.W0/H.W1 ceiling/seam pressure (F1/F2).

The 1400 engine-file ceiling + 1100 Animation-class ceiling are REAL gated invariants
(`proof:decomposition LIBRARY_CEILING_OVERRIDE`, `proof:engine ANIMATION_CLASS_CEILING`,
the G.W5 C-6 decision) — the scorecard's "1375/1400, 25L headroom" is FAITHFUL, not invented.
That accuracy is exactly why F1/F2 bite: a kf engine edit has almost no headroom.

---

## inv ε ledger (every claim grounded)

- `engine.ts` = 1375L (`wc -l`); `processFrame` at `:769-784`, `lerpValue` call `:778-779`;
  `class Animation` `:82`→`CSSKeyframesAnimation` `:1157` (Read).
- `proof:engine ANIMATION_CLASS_CEILING = 1100` (`scripts/proof-engine.mjs:66`);
  `proof:decomposition LIBRARY_CEILING_OVERRIDE engine.ts: 1400` (`:64`); G.W5 C-6 decision
  (`a-deferred-ledger:170`).
- No `serialize`/`hydrate`/`PlaybackSnapshot` on `group.ts`/`engine.ts` (grep); existing
  imperative restore at `usePlaybackSnapshot.ts:52-82` (grep).
- `springLinearStops` consumed only at `SpringSidebar.vue:104,130` + `StartingStyleTarget.vue:76,95`,
  both importing the engine export with different args; the "third" Spring site uses
  `springTimingFunction` (grep + sed).
- `--controls-pane-width` defined `design-idioms.css:106`, consumed `AnimationControlsGroup.vue:5`
  + `ControlsPaneWrapper.vue:206` (grep).
- glass-ui 3.4.0 `surface="cartoon"` API confirmed real (`Card.vue.d.ts:22 CardSurface`,
  `CardFooter-C390imy7.js:37` gate `surface==="glass" && "glass-specular-track"` /
  `surface==="cartoon" && "cartoon-surface"`, `tokens.css:543-549 --shadow-cartoon-{sm,md,lg}`,
  `cards.css:33 @utility cartoon-surface`) — H.W2 is FEASIBLE, not an over-reach.
- LIVE `:5173` (proxying `:5174` source): `Parse error at offset 0: "......"` ×5;
  `at Object.Wo [as _lerp] (node_modules/.vite/deps/@mkbabb_value__js.js:4678)` →
  `CSSKeyframesAnimation.processFrame (engine.ts:576)` [dev-bundle line];
  `serializeEasing (src/animation/format.ts:24)` for H-A1.
