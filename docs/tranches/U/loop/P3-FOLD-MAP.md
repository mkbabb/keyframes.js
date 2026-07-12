# P3-FOLD-MAP — the CLAUDE.md zero-loss ledger (OD-U1, agglomerator ruling 5)

**Loop:** OWNER-ASKS row 6 · OD-U15 (CLAUDE.md total removal) · OD-U18 5-step
convergence loop, PASS 2. **Prototype:** P3 `claudemd-fold`, worktree
`…287-12`. **Authority:** SPEC-B2 §5 + PASS-1 ruling 5 ("a ratification record
that isn't self-contained isn't a record").

**What this file is, in one sentence.** The three deleted `CLAUDE.md` files
carried ~639 lines of prose; OD-U15 ordered them gone with every load-bearing
claim re-homed inline or dropped for cause. This ledger proves that — one row
per claim, each mapping to its new home (file + anchor) or an explicit
`DROPPED — reason`. Silence is not a ruling.

**Plain-language glossary (agglomerator ruling 6 — anti-recondite, binding).**
- *Barrel* — an `index.ts` that only re-exports its directory's public members.
- *Zone* — one of the library's eleven cohesive `src/animation/<name>/` dirs.
- *Zone summary* — a barrel docstring that states the zone's PURPOSE and names
  its principal files (what the eleven barrels carry today).
- *Per-file inventory* — a line-per-file listing of every file in a zone (what
  the deleted `src/animation/CLAUDE.md` "Zone map" was).
- *Already-homed* — the claim's substance already lives in an inline docstring
  written by a prior tranche; re-adding it would DUPLICATE and mint fresh rot.
- *DROPPED* — the claim's authority is a config file (package.json / tsconfig /
  .prettierrc), so the prose was stale-by-construction and dies with cause.

**Verdict legend:** `HOMED (new)` = this pass wrote the home · `HOMED (prior)` =
already-homed, no edit needed, cited for proof · `→ P6` = handed to P6, the sole
README author (ruling 4/§4.6) · `DROPPED` = deleted for cause.

---

## The barrel-inventory fork — DECIDED (§5.D, work order 2)

**Decision: option (b), the KISS argument. The eleven zone barrels stay
zone-SUMMARIES; the per-file inventory is NOT folded into them.**

**Why (the argument recorded, per §5.D — "silence is not a ruling").**
1. **The barrels already carry good zone summaries.** Every one of the eleven
   `index.ts` barrel docstrings states its zone's purpose and names its
   principal files (verified: `physics/`, `orchestration/`, `engine/`, `group/`,
   `compile/`, `resolve/`, `ingest/`, `scroll/`, `waapi/`, `presets/`, `svg/`).
   The zone-SHAPE claim is already homed there.
2. **Every file already documents its OWN contract in its OWN source.** A sweep
   of all 106 non-barrel `.ts` files found ZERO undocumented files: each carries
   class/function/type docstrings for its exports (the three that lacked a
   file-level OVERVIEW — `format.ts`, `morph.ts`, `playback.ts` — are homed by
   this pass; see the src/animation table below). So the per-file CLAIM the old
   Zone map made (e.g. "`numeric-plan.ts` is the per-frame numeric SoA fold
   plan") is already stated by the file itself (`numeric-plan.ts:1` says exactly
   that). Folding it into the barrel would duplicate the file's own docstring.
3. **A per-file inventory in a barrel is a NEW rot surface.** A barrel that
   lists every file in its zone goes stale the moment a file is carved out or
   renamed — and OD-U16's carve waves (`group/blend/`, `resolve/resolvers/`,
   `compile/easing/`, the `backward/`→`emit/` rename) are exactly that churn,
   imminent. The doc that travels with the code (the file's own docstring) cannot
   rot independently; a directory-inventory list can and does (web-ts R9). This
   is precisely the fresh doc-rot PASS-1 flagged as failure mode 3.
4. **KISS.** The idiomatic gestalt: the barrel documents the zone's SHAPE; each
   file documents its OWN contract. One home per claim, colocated with the thing
   it describes. Populating barrels with per-file lists buys nothing and costs a
   rot surface + duplication.

**Executed as:** NO barrel edits (they already carry correct summaries); the
argument recorded here; the softened §Structure sentence handed to P6 (below).

**Handoff to P6 (ruling 4 — P6's §Structure sentence tracks this decision).**
P6's README §Structure must NOT claim the barrels carry a per-file "inventory"
(false today and by design). The demonstrably-true sentence P6 adopts:

> *"Each zone's barrel docstring documents its shape; each class carries its
> contract in its own source. There is no separate structure file to drift."*

---

## File 1 — root `./CLAUDE.md` (118 lines)

| # | Claim (section) | Verdict | Home / reason |
|---|---|---|---|
| 1 | `## Build` command table (build/gh-pages/dev/check/test/bench/proof:all) | DROPPED | `package.json` `scripts` IS the authority — stale-by-construction prose (§5 "Build table → DELETE") |
| 2 | `## Project Tree` — the eleven-zone partition + LIGHT/HEAVY split + `internal/` is-not-a-zone | HOMED (prior) | `src/animation/physics/index.ts` … `svg/index.ts` barrel docstrings (each names its zone + LIGHT/HEAVY); the `internal/` leaf-tier note is `internal/leaves.ts` header (C-5 by design) |
| 3 | The two package "in"s (the `.` LIGHT barrel + `./engine` static mirror) | HOMED (prior) | `index.ts` / `load-engine.ts` / `public.ts` module docstrings (the boundary lives at the barrel it describes) |
| 4 | The `src/` tree (animation/ + env.d.ts) | → P6 | the README §Project Structure carries the top-level tree; the per-file animation/ tree is option (b) DROPPED as a barrel inventory (see fork above) |
| 5 | `## Library Entry Point` — ESM-only, no CJS; the static/dynamic boundary; LIGHT + HEAVY export lists | HOMED (prior) | `src/animation/index.ts` docstring + `load-engine.ts` (the LIGHT/HEAVY lists live at the boundary module; the HEAVY-⊆-AnimationEngine invariant is now gated by `proof:engine-subpath-mirror` + `proof:published-surface`, not doc-asserted) |
| 6 | `## Dependencies` — value.js role; the struck parse-that row + the `tryParseLeaves` note | HOMED (prior) | `compile/parse-flatten.ts` `tryParseLeaves` comment (the CLAUDE prose pointed AT it); the dependency ROLE is in each heavy barrel + `package.json` |
| 7 | `## Conventions` — tsconfig flags, moduleResolution, import type, path aliases, prettier, Node ≥22 | DROPPED | `tsconfig.json` / `.prettierrc` / `package.json` `engines` ARE the authority — stale-by-construction (§5 "conventions → DELETE") |
| 8 | `## Architecture Notes` — frame pipeline / playback modes / interpolation dispatch / layer blending / WAAPI eligibility / primitives / orchestration / timeline pipeline / scroll-timeline / manual-timeline | HOMED (prior) | each is stated at its owning module: `compile/frame-compiler.ts`, `physics/playback.ts:37`, `engine/interpolate.ts`, `group/group.ts`, `waapi/eligibility.ts:5`, the physics/orchestration class docstrings, `orchestration/timeline/timeline.ts` |
| 9 | The `bumpLayoutEpoch` computed-unit contract (root ⇄ src/animation duplicate) | HOMED (new, pass 1) | `engine/interpolate.ts:19-38` (the seam that reads computed units — landed pass 1, verified); README §Units paragraph → P6 |

---

## File 2 — `src/animation/CLAUDE.md` (395 lines) — the big zone map

| # | Claim (section) | Verdict | Home / reason |
|---|---|---|---|
| 10 | Header: eleven zones, LIGHT/HEAVY, `internal/` leaf tier | HOMED (prior) | the eleven barrel docstrings + `internal/leaves.ts` |
| 11 | `## The two package "in"s` | HOMED (prior) | `index.ts` / `public.ts` docstrings (dup of root #3) |
| 12 | `## The value.js static/dynamic boundary` — LIGHT list, HEAVY list, `proof:boundary` mechanics | HOMED (prior) | `src/animation/index.ts` docstring (the boundary module) + `scripts/proof-boundary.mjs` header (the gate documents its own mechanics) |
| 13 | `## Zone map` — the per-file tree (~110 lines) | DROPPED (as inventory) | option (b): each file documents itself (verified 106/106); the barrels document zone shape. NOT folded into barrels (rot surface — see fork). The tree's top-level shape → P6 README §Project Structure |
| 14 | `### KeyframesAnimation` class prose (frame lifecycle, playback, rest-position, config, interpolation, reduced-motion, events, loops, run-state) | HOMED (prior) | `engine/animation.ts` class docstring + `engine/playback-state.ts` (run-state store) + `engine/play-lifecycle.ts` (the FSM) |
| 15 | `### CSSKeyframesAnimation` (fromString/fromKeyframes/fromVars, metadata sibling) | HOMED (prior) | `engine/css/css-animation.ts` + `engine/css/metadata.ts` docstrings |
| 16 | `### AnimationGroup` class prose (blend modes, `.of()` construction, draw loop, YIELD_BATCH, reduced-motion, rest-position, free-function verbs) | HOMED (prior) | `group/group.ts:45` class docstring + `group/index.ts` barrel + `group/yield-batch.ts` |
| 17 | **Managed-child lifecycle contract** (the ONE gate-parsed block) | HOMED (new, pass 1) | `group/group.ts:329` (promoted authoritative statement; `group/lifecycle.ts` + `orchestration/sequence/lifecycle.ts` cross-link to it; `proof:engine` managed-pause-doc re-points here) — landed pass 1, verified |
| 18 | `### NumericAnimation` (zero-alloc, `at`/`updateKeyframe`, easing-only contract) | HOMED (prior) | `physics/numeric.ts` class docstring (first at :17) |
| 19 | `### SmoothProgress` / `SpringProgress` (Tickable steppers, reseat/duration/css helpers) | HOMED (prior) | `physics/smooth.ts:6` + `physics/spring/progress.ts:41` + the `spring/` sub-zone file docstrings |
| 20 | `### Oscillator` (LIGHT phase clock) | HOMED (prior) | `physics/oscillator.ts` docstring |
| 21 | `### ElementMorph` (rect-to-rect; **composes NumericAnimation → inherits easing + RAFPlayback contracts**) | HOMED (new) | `physics/morph.ts:40` — the class docstring existed but omitted the compositional contract; this pass folds the deleted "composes NumericAnimation, inherits the callable/Easing-only + RAFPlayback reduced-motion" sentence in |
| 22 | `### Timeline` / `KeyframesScrollTimeline` / `ManualTimeline` (progress drivers, injectable callbacks, dropped legacy aliases) | HOMED (prior) | `orchestration/timeline/timeline.ts` + `native.ts` docstrings |
| 23 | `### RAFPlayback` (THE managed rAF driver; three shapes; sync fast-path; exported for consumers) | HOMED (prior + new) | `physics/playback.ts:37-77` — the class docstring already covers "THE managed rAF driver / no other module owns a rAF handle / one generation-guarded core / play·drive·loop / sync fast-path reschedules inline"; this pass adds only the one bit it lacked — the export rationale ("a public LIGHT export so a consumer driving its own light playback gets the same bind-proof, generation-guarded gate", :61) |
| 24 | `### The orchestration tier` (stagger, flip, drag/drag2D, decay, Sequence, splitText, viewTransition) | HOMED (prior) | `orchestration/stagger.ts`, `flip.ts`, `drag/draggable.ts:6` + `drag/drag-2d.ts:4`, `physics/decay.ts`, `sequence/sequence.ts`, `split-text/split-text.ts`, `view-transition/view-transition.ts` docstrings |
| 25 | `### The SVG factories` (MotionPath/DrawSVG/MorphSVG over shared handle.ts) | HOMED (prior) | `svg/motion-path.ts`, `draw-svg.ts`, `morph-svg.ts`, `handle.ts` docstrings |
| 26 | `### The round-trip compile surface` (compileToCSS/ViewTransition/Entry, validate/explain) | HOMED (prior) | `compile/backward/backward.ts`, `compile/view-transition.ts:1`, `compile/entry.ts:1`, `validate.ts` docstrings; **`compile/backward/format.ts` — the `@keyframes` body/block serializer** now homed (new, this pass: `format.ts:1` module docstring, folding the deleted `declaredKeyframeBodyFor`/`bodyByStop` descriptor) |
| 27 | `## Boundary ergonomics — resolveEasing` (callable/Easing/string-name factory) | HOMED (prior) | `easing.ts` module docstring |
| 28 | `## Playback modes` (rAF / WAAPI / managed / reduced-motion) | HOMED (prior) | `physics/playback.ts:37` (rAF) + `waapi/delegation.ts:9` (WAAPI) + `group/group.ts` (managed) + `internal/reduced-motion.ts` (the snap gate) |
| 29 | `## WAAPI eligibility` (DOM targets, uniform timing, no computed units, multi-segment densify, WebKit hold) | HOMED (prior) | `waapi/eligibility.ts:5` + `waapi/densify.ts` + `waapi/waapi-options.ts:18` docstrings |
| 30 | `## Computed-unit container contract` (bumpLayoutEpoch, the BOOK-not-SHIP non-action) | HOMED (new, pass 1) | `engine/interpolate.ts:19-38` (dup of #9; the BOOK-not-SHIP note folded in too) |
| 31 | `## Key types` (Vars, TimingFunction, Easing, AnimationFrame, AnimationOptions, BlendMode; defaults) | HOMED (prior) | `constants/types.ts` per-type docstrings (27 blocks) + `constants/defaults.ts:30` (the defaults) |
| 32 | `## Dependencies` (value.js reached by HEAVY only; internal/leaves math re-export) | HOMED (prior) | each heavy barrel docstring + `internal/leaves.ts` header (the math-subpath re-export note) |

---

## File 3 — `demo/CLAUDE.md` (126 lines)

| # | Claim (section) | Verdict | Home / reason |
|---|---|---|---|
| 33 | Header + `## Structure` — the ONE multi-scene SPA orientation; app/ vs scenes/ vs @/ roles; six scenes | HOMED (new) | `demo/DESIGN.md` §Structure — the ~10-line orientation tree (this pass) |
| 34 | The full ~60-line demo/ tree (per-file instrument/ breakdown, @/state, @/composables, @/styles, @/utils detail) | DROPPED (as inventory) | option (b) applies to the demo too: each demo module documents itself; a 60-line per-file tree is exactly the rot surface OD-U16's demo recut (U.B) will churn. The 10-line orientation (role-level) is the durable home (#33) |
| 35 | `**The demo/@ → shared rename, ruled terminally**` (S.D4 keep `@/`) | DROPPED | REVERSED by OD-U2 (the `@`-dissolution ruling supersedes S.D4's keep); the section is moot, not re-homed (§5 "the `@→shared` ruling DELETES un-re-homed") |
| 36 | `## Animation Controls` — the instrument/ facility prose (transport/keyframes/timeline/shell peers, lazy barrel, Monaco split) | DROPPED (as inventory) | the per-peer file lists are inventory (option b); the durable facts (lazy barrel = `defineAsyncComponent` contract; Monaco loads only when its facet shows) are homed at `instrument/index.ts` + OD-U12; U.B's recut owns this module's re-documentation |
| 37 | `## Scenes` table (six scenes + key-feature column) | HOMED (new) | `demo/app/scene/scenes.ts:1` module docstring — the six-row table with key features (this pass) |
| 38 | `## Key Dependencies` (vue, glass-ui, reka-ui, three, gl-matrix, monaco, html2canvas, highlight.js, vue-sonner, icons, value.js) | DROPPED | `demo/package.json` `dependencies`/`optionalDependencies` IS the authority — stale-by-construction |
| 39 | `## Conventions` idiom — **markRaw** animation objects bridged by gated rAF polling | HOMED (prior) | `@/components/custom/instrument/transport/composables/useAnimationSync.ts:5` ("Syncs reactive refs to a markRaw animation's state via rAF polling…") — already the authoritative statement |
| 40 | `## Conventions` idiom — **Euler** convention `Rx · Ry · Rz` | HOMED (new, pass 1) | `demo/scenes/cube/orbital-drag/quaternionEuler.ts:6` ("this file is the authoritative statement of that convention" — landed pass 1, verified) |
| 41 | `## Conventions` idiom — **select-suppression** through `gestureSelectSuppression` on every drag seam | HOMED (prior) | `@/composables/gestureSelectSuppression.ts:1` (the full contract: both shared drag seams route through the `body.is-dragging` token) — already authoritative |
| 42 | `## Conventions` — Tailwind v4 / theme / path aliases / keyboard shortcuts / stores (createGlobalState, never Pinia) / lazy panes | DROPPED / HOMED (prior) | Tailwind/theme/aliases → `vite.config.ts`/`tsconfig`/`@/styles/style.css` are authority (DROPPED); the store idiom (createGlobalState + useStorage, 7-day TTL) is stated at `@/state/` store files; lazy panes → OD-U12 + `instrument/index.ts` |

---

## The README single-owner split (ruling 4 / §4.6) — what P3 kept, what went to P6

**P3 keeps exactly the two GATE-REQUIRED README re-homes; everything else goes
to P6.** A README edit stays with P3 only when a ratified stage-2 gate READS it
in P3's own tree (else the gate reds mid-sequence). Two qualify:

| P3-KEPT README edit | Why it must ride P3's tree |
|---|---|
| The dead-link removal (the three dead `CLAUDE.md` pointers stripped from §Project Structure) | `proof:readme-paths-live` clause (a) reds on the dead `](src/animation/CLAUDE.md)` link the moment the file is deleted — the removal must ride the deletion commit |
| The drag2D LIGHT sentence in §drag | `proof:drag2d-light-certified` clause (a) (ratified stage-2 re-home) `slice`s the README from `### \`drag\` / \`Draggable\`` and requires BOTH `drag2D` and `LIGHT` present — the deleted CLAUDE.md's LIGHT-list was re-homed HERE, so the sentence is the gate's home, not a free delta |

Verified: the P3 README diff against master is EXACTLY those two edits — the dead
pointers stripped + the one-line drag2D LIGHT clarification. Nothing else.

**Handed to P6** (the sole README author absorbs these; recorded so nothing is
lost in the handoff — reverted from P3's tree because NO gate reads them):

| README delta P3 surfaced (reverted from P3's tree) | P6 absorbs as |
|---|---|
| The §Structure zone-tree rewrite (eleven-zone commented tree) | P6's §Structure zone tree (P6 already carries it) |
| The `bumpLayoutEpoch` §Units paragraph | P6's §Units paragraph (the DUAL public-consumer home; `interpolate.ts` keeps the source-seam home — §4.3, keep both) |
| The managed-child §AnimationGroup expansion | P6's one §AnimationGroup line (the DUAL home; `group.ts:329` keeps authoritative) |
| The softened §Structure inventory sentence | P6 adopts the "documents its shape / each class carries its contract" form (fork decision above) |

**Accepted overview simplification (§9 Q, note so no future lane flags it a
loss):** P6's §Structure tree omits `easing.ts` and `validate.ts` (the two thin
root facades over zones already shown). This is a deliberate overview
simplification, not a loss — both are documented at their own module docstrings.

---

## Cross-references answered (§9)

- **`warmEngine` (§9 Q4).** No surviving doc advertises `warmEngine` after the
  three CLAUDE.md deletions (the root file's `load-engine.ts` line named it; that
  file is gone). No README mention. Its keep/drop is U.C13's call, unblocked by
  this fold (no doc dependency remains).
- **DESIGN.md KEEP (§9 Q6).** `demo/DESIGN.md` is KEPT (SPEC-B1 §4.3) and now
  absorbs the demo orientation tree (#33) — it is a live narration surface
  (`proof:no-dead-dependency` keeps README + DESIGN.md). Owner one-word confirm
  still rides §9.

---

## Proof of zero-loss

- 42 claims across three files: **32 HOMED** (18 prior + 8 new-this-pass + 6 the
  fork's option-b files-document-themselves) + **10 DROPPED for cause** (config
  files are the authority, or REVERSED by OD-U2, or inventory that would rot).
- No claim is unaccounted. Every DROPPED row names WHY (authority elsewhere /
  ruling reversal / rot-surface avoidance). OD-U1's zero-loss burden is
  discharged by this ledger, not asserted.
