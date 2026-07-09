# Tranche S — SPEC v1 (Pass-1 synthesis)

**Branch:** `tranche-s-dev` · **Date:** 2026-07-02 · **Inputs:** DIGEST.json (50 lanes: r1–r8 research,
a01–a32 R-audit, 10 design pages) + deep-reads of r2, r7, r8, a17, a18, a23, a24, a27.
**Status:** candidate specification for the prototype fleet (Pass 1E) and the critique fleet.
**This document is the whole deliverable of the synthesis lane — no source, test, config, or git state
was touched.**

---

## 1. Charter

Tranche S is the **honesty-then-altitude tranche**: it makes the repo's own instruments tell the truth
again (master CI has been red since Tranche K; the deploy-of-record is dead; the authoritative library
map documents a tree that no longer exists), and then — on top of a truthful substrate — performs the
deep structural work R only top-partitioned, resurrects the one first-class owner ask that has died
three times (the theatrical scene-switcher), and lifts the library to the mid-2026 platform frontier
(View Transitions, SplitText, `@starting-style`, `animation-trigger`) in the one way no peer can match:
every uplift compiles back to zero-runtime, current-spec CSS through the round-trip engine (r5).

S folds **every** open deferral and chronic into a terminal home — a wave, a ratified KILL, or an
explicit owner HANDOFF (§4 has no un-dispositioned rows). S ends the VERIFY-ONLY perpetual carry
(DM-11 has ridden ten tranches on serial re-affirmation — r2 Part IV). S applies "NO legacy anywhere"
with teeth: the zombie `animate.ts` cluster, the shadcn islands, the dead devDependencies, the stale
era-narration — deleted or enforced by born-RED gates, not rubrics. S rewrites the demo's altitude
(the `app/` grab-bag, the buried state layer, the misfiled `@/` modules, the playground's identity)
and cures the two systemics every design lane independently found: the mobile bottom-sheet occluding
each scene's own thesis, and the hidden-affordance layer that seals the demo's best interactions
behind undiscoverable gestures.

**What S is NOT:**

- **Not implementation.** S is DEVELOPMENT ONLY. Every wave below is authored to be executable, with
  a falsifiable born-RED gate — but nothing runs until the owner explicitly authorizes an impl drive
  (the inv-16 boundary, held honestly this time: a wave is CLOSED only when its born-RED gate is
  GREEN re-run on the merged tree — r2 F4).
- **No bbnf-lang.** The parse-that dispatch (§3, S.H) is combinator-tier only; grammar-DSL work is a
  separate session's job (owner directive; r6).
- **No glass-ui writes.** All glass-ui change flows through the glass-ui repo as owner-domain
  handoffs. kf consumes **published artifacts only** — and glass-ui 5.0.0 does not exist yet
  (BG ≈110 waves + BH ≈30 waves are dev-complete, unbuilt — r7 B-1). The consume-edge waves are
  specified now and FIRE only when the joint 5.0.0 publishes; the tilde-pin discipline is preserved
  (never caret).
- **No quick solutions.** Where a lane offered a patch and a transposition, the spec takes the
  transposition (service-locator → ownership inversion, a06; sheet-occlusion → a stage-visibility
  contract, not ten per-scene CSS nudges).

---

## 2. The evidence synthesis

### 2.1 Cross-lane convergences (the load-bearing facts)

1. **R is substantively honest, with named residue.** The 32-lane audit re-verified R's headline
   claims: the 12-directory partition is real and correctly zoned (a02), the god-class carves are
   genuine (a03, a04), the cycle ring is broken (a06), scene-fusion is honest (a10), the keystone
   override-deletion is total (a01), perf is preserved (a32). The residue is *named and bounded*:
   the zombie `animate.ts` (a09, a20, a29, r2 F6), the toothless demo arm of
   `proof:no-silent-fallback` (r2 W-weak-1), the never-authored `proof:engine-seam-split` (r2
   W-weak-3), the post-close "R-fallout" commits (a15), and six files parked 1–12 lines under the
   500L ceiling (a05, a16, a17, a19).

2. **Master CI has been RED on every push since Tranche K (2026-06-16); the deploy-of-record is
   dead.** Neither Q (5.0.0) nor R (5.1.0) ever produced a green master CI; every `workflow_run`
   deploy since K is skipped; both tranches shipped via manual `workflow_dispatch` (r8 §4, a28).
   Two reds are *genuine source defects reproducible locally*: `proof:styling-idioms` (orphan
   `.morph-ghost--from`, `MorphTarget.vue:71` — R.W5 fallout) and `proof:pin-ledger-current`
   (PIN-LEDGER frozen at 4.4.0/1.1.0/0.12.0 vs installed 5.1.0/1.2.0/0.13.0 — a31, CRITICAL).
   The rest is the device-dependence plane (LoAF exit-code flake with a GREEN metric; 14 blocking
   demo-smoke gates; ~50 chromium launches under a 50-minute ceiling — r8, a28).

3. **The zombie `animate.ts` cluster is R's own instance of the failure mode R condemned in Q.**
   213 LOC, zero importers, excluded from every published surface, kept alive by two
   self-referential test files and still documented as "the single-call front door" in both
   CLAUDE.md files (a09, a13, a14, a20, a29, r2 finding 9). Five lanes converge on DELETE.

4. **The doc-authority inversion.** R.W7 formally delegated "authoritative per-file inventory"
   status to `src/animation/CLAUDE.md` — a file untouched since before R.W1, describing the deleted
   flat tree, the renamed `Animation` class, the excised `animate()`, a dead `ScrollTimeline`
   export, and a `parse-that` dependency that no longer exists (a13, a30, a16, a20, a02, a05,
   a08, a17, a32 — **nine lanes** independently hit this file). Root CLAUDE.md compounds it
   ("seven-zone" vs 12 shipped dirs; `waapi/` invisible; a wrong HEAVY export list). Nothing gates
   any CLAUDE.md against the tree.

5. **Carve-to-ceiling vs carve-to-cohesion.** R's decomposition is real but the *stopping rule* was
   the 500L gate, not module boundaries: seven files landed at 488–499L, commit subjects literally
   naming the arithmetic ("628→500") (r1, a05, a16, a17, a19). One carve (compile/easing-option)
   shipped as pure re-export ceremony (a18). S's rule: **cohesion-first; 500L is a tripwire, not a
   target**; and the decomposition gate gains a no-re-export-bridge clause.

6. **~54 gates ossify the exact demo layout S intends to rewrite.** The proof roster (189–190 keys)
   is coverage-airtight, but ~30% is pixel/layout-level source-shape locks over the current demo;
   the "correctness" tier is defined by harness (opens-a-browser) not severity — genuine library
   correctness proofs are exiled to "hygiene"; and the roster simultaneously *forbids* a scene
   switcher (`proof:scene-colocated` ASSERTION 3) and *requires* one (`proof:scene-switcher-mobile`,
   a zombie querying DOM R deleted, masked by continue-on-error) (a27, a23, r8).

7. **The mobile-sheet occlusion is systemic, not per-scene.** All ten design lanes independently
   found the bottom sheet occluding the scene's own thesis: spring's born-open sheet hides the
   entire instrument; easing's edit→motion loop is severed; sequence buries its master scrubber;
   square loses its travel envelope; amiga its decay proof; morph and motion-path their captions;
   cube its attitude readout; playground its only CTA; home its moat moment (design:*). The cure is
   one contract (peek-height default + a reserved stage band + telemetry above the fold), not ten
   patches.

8. **The hidden-affordance systemic.** The demo's best interactions are sealed: cube's entire
   gesture grammar is invisible; spring's derby and easing's gallery are dblclick-only (nonexistent
   on touch); sequence's headline drag-to-retime has no tell; amiga's boing threshold is unknowable
   (design:*). Every scene needs one drafting-stamp-proportion legend + touch parity — plus one
   authored easter egg each (the design lanes supplied all ten).

9. **The scene-switcher shelf is a treasure, not a corpse.** `n-stage-impl` (+4188 LOC) solved the
   two named failures structurally — one `SpringProgress` over ring angle (interruptible,
   shortest-arc, PRM-snapping, LIGHT-barrel-clean) and one shared-`RAFPlayback` LOD clock with
   `content-visibility` gating — and got the DOM position right (Teleport-to-body sibling, OUTSIDE
   the `scene-subject` VT) where both dead attempts got it wrong. Blockers are mechanical (pre-fusion
   paths) plus one design collision (the bespoke dock-arrow swap vs glass-ui BG's dock morph) (r7).

10. **The demo's shared library was never partitioned.** R fused scenes but declared the 74-file /
    10k-line `animation-controls/` monolith "do not touch" by fiat (no importer census); the demo's
    global state layer is buried four levels deep inside a UI component dir; four "shared" modules
    are single-area-private (~3,076L misfiled); `demo/app/` is an unpartitioned mixed-concern
    drawer with five scene-tier files masquerading as shell (a23, a24, r4).

11. **The library's remaining debt is boundary + layout, not correctness.** Zero laziness casts,
    one dead export in 268, LIGHT invariant intact, hot paths byte-preserved (a21, a29, a32, a16).
    What remains: the `constants.ts` LIGHT/HEAVY seam held only by `import type` discipline (r3,
    a20), PlaybackState owning plumbing but not the FSM (a03), a service locator mislabelled DI
    serving ONE demo caller (a06), the `./engine` mirror with no drift gate (a08), and the
    un-sub-zoned `engine/`/`compile/` interiors (a17, a18).

### 2.2 Conflicts arbitrated (rulings)

Each ruling is binding on the band plan; the prototype fleet tests the starred ones (§6).

**C-1. `engine/css/` — a03 (NO: two files, marginal) vs a17 (YES: confirmed clean cluster) + owner
seed.** **RULING: YES — create `engine/css/`.** a17's evidence is decisive: `css-metadata.ts` is
INTERNAL with exactly one importer (`css-animation.ts`), the pair is the entire CSS-entry surface
(446L), nothing outside engine/ deep-imports either, and the engine sub-zone is *forced anyway* by
the 499/498L ceiling collision (a17 F1) — S cannot touch the hot path without it. a03's constraint is
honored: compile-side CSS-twin/serialization concerns stay in `compile/`; `engine/css/` is the entry
pair only. (*Prototype Q1 validates cost.*)

**C-2. `compile/easing/` — r3 (owner seed, validated) vs a18 (REJECT: 2 files/178L below the
directory-earning threshold; the easing-option carve was re-export ceremony).** **RULING: REJECT the
directory; KILL the ceremony instead.** The owner's seed was an *e.g.*, not a mandate; a18's
dependency-graph analysis (the real seam in compile/ is FORWARD vs BACKWARD, with zero
forward↔backward edges) is the cohesion argument S's charter demands. `compile/backward/` IS created
(4 files, 1,300+L, genuine one-directional cluster); the two easing files stay flat and the
re-export bridge through frame-compiler dies.

**C-3. `animate.ts` — DELETE (a09, a13, a14, a20, r2, r3) vs restore-as-published (a29's
alternative).** **RULING: DELETE** — file + both test files + the `proof:animate-orchestration` gate
+ every doc mention. The excision was owner-ratified at R on 0/32 call-site evidence; restoring
re-litigates a settled ruling; the DX "front door" is served by the `./engine` subpath. The semver
debt is paid separately: backfill `docs/MIGRATION-5.1.0.md` and generalize the changelog gate to fire
on any published-surface removal (a14).

**C-4. Playground — kill vs fold (r4's trilemma; a22 "decide"; design:playground FOLD-as-scene with
evidence).** **RULING: FOLD as `demo/scenes/compose/` — the ninth scene ("Compose").** The design
lane's evidence is decisive: it is the demo's only *authoring* surface, owns the engine's best
on-brand moment (the fromDrawSVG bind-ignition), and its plumbing is exemplary; what is broken is the
shell (blank prod build, un-pinned outDir, zero audience). Kill the standalone app + vite mode + dist
debris; relocate `asset-manager/` with it; fix or drop the dead Image/SVG asset kinds.
(*Prototype Q6 tests what breaks.*)

**C-5. `internal/` — a02 (add internal to the barrel-presence gate) vs a20 (delete the zero-consumer
barrel; rename to `leaf/`).** **RULING: `internal/` is the leaf tier, not a zone.** Delete the
ceremony barrel (0 consumers in 44 import sites), exclude `internal/` from ZONE_DIRS *by documented
design*, add `waapi/` to ZONE_DIRS (the real gap), and derive the flat-sibling FAMILY set from the
directory listing so it cannot drift (a02). The `leaf/` rename is REJECTED: 44 import retargets to
buy a name, when a two-line charter note ("internal/ = the value.js-free leaf tier; it sources public
exports") buys the same clarity.

**C-6. The scene-switcher gate contradiction — `proof:scene-colocated` ASSERTION 3 forbids what
`proof:scene-switcher-mobile` requires (a27, a23).** **RULING: both stale halves die in S.A.**
ASSERTION 3's carousel-absence clause is deleted (keep the location/no-climb clauses);
`proof:scene-switcher-mobile` is retired-and-reborn as the scene-stage band's born-RED acceptance
gate, targeting the resurrected stage's real observables (`frontIndex`/`spinning`, commit-on-settle)
— RED until S.E lands, honest the whole way.

**C-7. Scene-switcher substrate — R's DM-24 KILL ("redundant") vs the S charter.** **RULING: DM-24 is
REVIVED, not re-litigated** (r2 Part IV, r7). The salvage source is the `n-stage-impl` shelf
(orbit + LOD engines lifted near-verbatim; STAGE-SPEC's measured geometry NOT re-derived), rebuilt
under three absolute guardrails from the two dead attempts: one nav authority (ChromeDock opens,
`runSceneSwitch` commits), chrome outside the `scene-subject` VT, commit-on-settle actually wired.
The bespoke dock-arrow swap is NOT resurrected — that half is expressed through the existing dock now
and swapped to glass-ui BG's dock morph at the (gated) consume-edge (r7 A-8).

**C-8. Doc-regen timing — a30 ("wave-1, rewrite from scratch") vs r3/a17 ("fold into sub-zoning so
it's written once").** **RULING: gate-first, regen-last.** S.A lands the born-RED
`proof:claude-paths-live` doc-drift gate (every backtick-quoted path/symbol in any CLAUDE.md must
resolve) plus a hot-fix of the actively dangerous lines (animate listed as live; `ScrollTimeline`;
the HEAVY export list). The full `src/animation/CLAUDE.md` rewrite lands at S.B's close against the
final tree. This is R.W0's keystone pattern applied to docs: the gate's reds are the backlog.

**C-9. `adapter.ts` home — compile/ (r3, a02-lean) vs resolve/ (a20).** **RULING: `compile/adapter.ts`.**
Its output feeds `FrameCompiler.parse`; it is the input→ResolvedKeyframes front seam of the compile
pipeline. Importing `./resolve` does not make it resolve-zone — resolve/ is the emerging-CSS
rewriter, a different concern. `validate.ts` STAYS at root as a HEAVY cross-zone facade verb under
the articulated root-file policy (a02); a20's move is declined.

**C-10. colorTail benches — a26 ("correctly classified observe-only") vs r8 ("papered coverage
gap").** **RULING: both are right, at different times.** Observe-only was correct at Q's
measure-first moment; it is insufficient for S, whose SOTA-perf claims ride those arms. S.F converts
the 6 colorTail arms + the compositor replace-arm to budgeted device-independent ratios (the
taxonomy's own recipe).

**C-11. `proof:engine-seam-split` — twice-mandated, never authored (r2 W-weak-3).** **RULING:
formally KILLED.** The ≤950L target it was to police is obsolete (engine/animation.ts is 499L); its
intent is superseded by proof:engine's body-span clause + the S.B recursive-scan fix + the
no-re-export-bridge clause. The kill is recorded in the S ledger so the two-tranche dangle ends
terminally.

**C-12. glass-ui pin — hold ~4.0.0 vs catch up to 4.2.0 vs await 5.0.0 (r7 B-1/B-5, a31).**
**RULING: hold the 4.0.x tilde through S development; consume-edge waves are specified now and fire
only on the joint 5.0.0 publish.** An interim 4.2.0 catch-up is REJECTED (pays the migration tax
twice for a line 5.0.0 clean-breaks anyway). Never caret. The stale MEMORY "specular=off handoff"
expectation is retired at S close (BG resolves specular affirmatively); the dock double-click chronic
stays OPEN with the sharpened verify-or-handoff disposition (no named BG wave cures it — r7 B-4).

**C-13. Speculative LIGHT exports (Oscillator with a fictional demo claim; reseatToSpring unconsumed
— a16).** **RULING: forced to a decision inside S, no carry.** Oscillator: the design band either
builds its promised demo home or strips the fictional header and ledgers it as an intentional public
leaf. Draggable's fling: bench reseatToSpring against the current decayRest and wire the winner (or
record the measured reason it stays).

**C-14. "Refined, not abrogated" vs "totally re-write entire waves" (r1's standing tension).**
**RULING: per-wave mode declaration.** Every S wave header states REWRITE or REFINE. Structure/layout
waves default to REWRITE (the owner's S directive); behavior-preserving zones verified honest by the
audit (physics/, orchestration/, group/resolve/ingest/scroll geometry, the R.W5 scene fusion
keep-list — a10, a16, a19) default to REFINE with explicit do-not-touch lists.

---

## 3. Band/wave candidate set

Notation: each wave = **scope · rationale · born-RED gate · deps · track**. All gates are authored
in the wave (development), planted RED where the defect is live today, and become the impl drive's
board. "Gate:" lines name the falsifiable oracle, not prose.

### S.A — Truth & Gates (the keystone band) — track: gates

- **S.A0 — CI-GREEN in one convergent pass (THE KEYSTONE).** Fix the two genuine source reds
  (`.morph-ghost--from` rule in MorphTarget.vue; re-author PIN-LEDGER.json to 5.1.0/1.2.0/0.13.0);
  decouple the LoAF bench exit code from its green metric; then drive the FULL 159-member
  hygiene-chain + demo-smoke to a verdict in one pass — never head-chasing the rotating fail-fast red
  (r8 §4, a31, a28). Rationale: every subsequent wave's gate is meaningless over a red master; R/Q
  both shipped over this red. Gate: `gh run list --workflow ci.yml --branch master` shows a green
  push run (born-RED: red since K). Deps: none — first. 
- **S.A1 — Chronic ledger R→S + the VERIFY-ONLY terminal-ization.** Atomic re-point of
  `CHRONIC_LEDGER` with the planted-malformed-row non-vacuity proof (r2 S5); re-run DM-8…DM-15 on the
  REAL runner (R mislabeled runner-reds as ENV — r8 F1); DM-11b/13/14 treated as live regressions to
  FOLD; every VERIFY-ONLY/RE-AFFIRM row converted to a terminal shape — deterministic gate re-shape,
  or ratified KILL — ending the 8–10-tranche re-affirm carry (r2 Part IV). Gate:
  `proof:chronic-closure` parses the S ledger AND a new clause REDs any row whose disposition is a
  bare re-verify verb. Deps: A0.
- **S.A2 — Device-dependence exits via a system, not a fourth re-declaration.** Split demo-smoke into
  demo-correctness (kf-owned, blocking, gates deploy) + demo-device-observe (LoAF/dock/lighthouse/
  render-race; observe-only) (a28 S-CI-1); land the deferred browser-harness net-deletion (ONE shared
  chromium + one served dist across ~50 gates — a28 S-CI-2); de-magic `KF_LOAF_COUNT` and widen
  `proof:settle-is-predicate` to ban numeric `waitForTimeout` across all driver code; per-gate
  disposition for the blocking-14 (genuine → FOLD; absolute-threshold → relative budget;
  binary-absent → install-or-observe) (r8 §4.3). Gate: demo-correctness job green on the Linux
  runner with zero continue-on-error masking. Deps: A0.
- **S.A3 — Deploy-of-record revived.** `deploy-pages.yml` `workflow_run` fires on green
  demo-correctness; the manual-dispatch crutch demoted to documented break-glass (wording fixed —
  a28 F2); DM-20's live-byte round-trip observed on the auto path. Gate: one auto-path deploy run
  `success` with `proof:deploy-roundtrip` live-leg green. Deps: A2.
- **S.A4 — Gate-roster diet + the 54-gate migration plan.** Three-tier taxonomy (library-correctness
  / demo-correctness / hygiene) replacing harness-defined "correctness" (a27 F1); the ~54
  demo-appearance locks declared a FROZEN SET — S's demo rewrite is *authorized to red them*, each
  red discharged by deletion-with-cause or migration to a layout-invariant system-property gate
  (occlusion-free, a11y, dogfood, stage-visibility) (a27 F2); delete scene-colocated ASSERTION 3 +
  retire/rebirth scene-switcher-mobile (C-6); collapse the morph-gate triple vitest boot; consolidate
  the constellation-PENDING placeholders into one stateful consume-edge gate; band the
  regression-guards under an explicit header; upgrade `proof:gate-is-runtime` (post-actuation DOM-read
  heuristic; drop the frozen I-wave floor). Target ~190 → ~120 keys, zero live properties lost.
  Gate: `proof:ci-coverage` + reformed `proof:gate-is-runtime` green over the new manifest; a planted
  mis-tiered gate REDs. Deps: A0; BLOCKS S.D/S.E/S.G reds being declarable.
- **S.A5 — Doc-authority restoration, gate-first.** Born-RED `proof:claude-paths-live` (every
  backtick path/symbol in root + src/animation + demo CLAUDE.md resolves on disk / in the built
  surface; HEAVY export list ⊆ AnimationEngine keys); hot-fix the actively wrong lines (animate
  listed live; ScrollTimeline→KeyframesScrollTimeline; "seven-zone"→true count; waapi/ registered;
  parse-that dependency row struck) (a30, a13, a16, a21). Full src/animation/CLAUDE.md regeneration
  is S.B8's close item (C-8). Gate: proof:claude-paths-live (born-RED today by construction). Deps:
  A0.

### S.B — Library sub-zoning + boundary hardening — track: lib

- **S.B1 — The constants seam, structural.** Split `constants.ts` → `constants/types.ts` (LIGHT-pure)
  + `constants/defaults.ts` (value.js-bearing); ~55 consumers repointed; the LIGHT/HEAVY boundary
  becomes structural instead of import-type-disciplinary (r3 F2, a20 F-constants). Gate:
  proof:boundary + a new clause: no light zone imports the heavy half (plant a runtime import → RED).
  Deps: A0. (*Prototype Q3.*)
- **S.B2 — engine/ sub-zone + PlaybackState completion.** Create `engine/css/` (C-1); fold the play
  FSM (paused/done/started/reversed/iteration/t/startTime/pausedTime) off the class into
  PlaybackState so playback.ts mutates `state.*` and animation.ts shrinks to config+compiler+sample
  delegates (a03 F1); introduce the narrow InterpContext struct for the hot path (a03); decide
  element-resolve.ts's home (its own header votes resolve/ — a17 F5); hoist `public.ts` beside
  load-engine.ts so engine/ is zone-pure (a17 F7); make proof-engine.mjs's scan RECURSIVE in the same
  wave (the gate goes blind under sub-zoning otherwise — a17 F4); group/* imports repointed to the
  engine barrel; delete the vestigial `CSSKeyframesAnimation.transform()` (a17 F8). `proof:engine-seam-split`
  formally KILLED (C-11). Constraint (a19): KeyframesAnimation stays in `engine/animation.ts` so
  group's cycle-break import survives — sequenced, not raced. Gate: proof:engine (recursive) + a
  new clause: FSM transition fields reached only via PlaybackState (plant a class-body mutation →
  RED); proof:decomposition green with headroom. Deps: B1. (*Prototypes Q1, Q2.*)
- **S.B3 — compile/ sub-zone: the backward leg + ceremony kill.** Create `compile/backward/`
  (backward, backward-walk, backward-color, format + barrel); delete the easing-option/selector
  re-export bridges in frame-compiler (consumers import the real modules) (C-2, a18); re-home
  `adapter.ts` → `compile/adapter.ts` (C-9); delete dead `declaredKeyframeBodyFor` (a18 F3); hoist
  the loop-invariant 1024-sample color ramp out of the densify midpoint loop (~15× fewer samples,
  replay-equality-verified) (a18 F4); repoint backward-walk → `internal/animation-id` and
  backward.ts → the `../scroll` barrel (a06 F7, a19 F2); construct-or-excise the likely-dead
  findComputedDrift refusal (a18 F7). FrameCompiler is NOT split (sealed stateful unit — a18 F12).
  Gate: born-RED clauses — compile/ root holds ONLY the forward set; no re-export-only bridge module
  anywhere in src/animation; no cross-zone deep-import (catches a18+a19 classes in one gate). Deps:
  B1.
- **S.B4 — Barrel purity, ownership inversion, zone normalization.** resolve/index.ts → thin barrel
  + resolve/core.ts + resolve/spring-css.ts (a02 F3, a19 F5; the resolveNode injection seam
  untouched — a19 F9); Timeline family out of orchestration/timeline/index.ts (r3 F4); delete the 3
  dead resolve barrel re-exports + the scroll scene→range relay (a19 F3/F4); delete the zero-consumer
  internal/index.ts + ZONE_DIRS ruling (C-5); one stated barrel policy (explicit-named public,
  export-* internal-only), gated (a02 F4); rename the 3 colliding basenames (options/playback/
  scheduler) (r3 F7); **ownership inversion**: excise `KeyframesAnimation.group()`, delete
  internal/group-factory.ts + the register side-effect, add `AnimationGroup.of()`, migrate the one
  caller (KeyframesEditor.vue) — a singleton, a guard, and two double-casts removed (a06 F1/F2);
  group/types.ts leaf (a04); svg/handle.ts abstract base closing the MotionPath.finished asymmetry by
  construction (a20 F6); DRY the transport.ts prefersReducedMotion copy through internal/
  reduced-motion (a16 F3). Stretch: collapse the 26 type-only rings + delete the viaOnly exemption
  (a06 F4). Gate: no-flat-siblings with derived FAMILY + waapi/internal ruling; barrel-policy clause;
  depcruise green with group→engine one-directional (plant a re-added `.group()` → RED). Deps: B2, B3.
- **S.B5 — Near-ceiling pre-carve + the last override, terminally.** Carve the six 488–499L files at
  their cohesion seams with real headroom (engine/animation 499, engine/playback 498, group/group
  496, compile/frame-compiler 499, physics/spring/progress 499, orchestration/sequence/sequence 499)
  — much of this falls out of B2/B3/B4; group/lifecycle.ts for the transport verbs (a19 F1); split
  presets/classic.ts → classic-data.ts (the 34 CSS-string constants) + factory logic, DELETE the last
  LIBRARY_CEILING_OVERRIDE entry and, emptied, the Map itself — completing R.W0's keystone (a20 F5,
  r2 finding 12). Gate: proof:decomposition with an EMPTY override map and max file ≤ ~460L (headroom
  clause); no-re-export-bridge holds. Deps: B2, B3, B4.
- **S.B6 — Type surface + the `./engine` drift gate.** Flip the 11 `= any` generic defaults to
  `= Vars`; unify SVG generics to `extends Vars` (a29 F1/F2); `@internal` tagging + API-Extractor
  trimmed roll-up (strip the 126 leaked privates) (a29 F4); **proof:dts-rollups-agree** frozen NOW,
  before zoning churns options (a29 F5); the engine-subpath mirror gate
  (Object.keys(dist/engine/index.js) ≡ loadAnimationEngine() runtime keys; d.ts content-checked
  non-stub), then collapse the triple hand-definition by rewriting loadAnimationEngine to
  `import("./engine/public")` (a08 F1/F3); dts-plugin soft-fails → hard build failures (a08 F2);
  FrameUnderConstruction<V> for the `undefined as unknown as V` holes (a29 F7); value.js dispatch:
  PropertyDescriptor rename (a29 F3). Gate: proof:engine-subpath-mirror (born-RED: delete a
  public.ts re-export → RED); proof:no-any-default over the built d.ts. Deps: B2. (*Prototype Q7.*)
- **S.B7 — Test + bench perimeter.** test/<zone>/ regroup + vitest glob widen, landed as ONE diff
  with the sub-zoning (a25); tsconfig.test.json into the check roster (the .d.ts-only private fence —
  a04 F4); bench/ under type-check + fix the 9 stale `Animation<...>` sites in waapi-densify.bench.ts
  (a15 F1); composable tests for the 5 uncovered scenes (cube/morph/motion-path/sequence/square)
  (a25 F1); remove vi.spyOn(private)/override-private footguns via a documented composite seam (a04
  F5); KfPillTabs.test.ts + the interaction-axis fixes (arrow-moves-focus, keyup actuation,
  press-origin guard) for the DM-1/DM-5 replacements (a12 F1–F3). Gate: `npm run check` covers
  test/+bench/ (plant a private-access in a test → RED); the 5 scenes each referenced from test/.
  Deps: B2–B5 (paths final).
- **S.B8 — The library map, regenerated once.** Full rewrite of src/animation/CLAUDE.md against the
  post-B tree; root CLAUDE.md zone roster + HEAVY list regenerated mechanically from AnimationEngine
  keys; the two-'in' policy stated once; era-comment policy (invariant inline, provenance to a
  per-file footer) applied opportunistically (r3 F5/F8, a30). Gate: proof:claude-paths-live green
  (was born-RED at S.A5). Deps: B1–B7 complete.

### S.C — Legacy purge (NO legacy anywhere, with teeth) — track: lib+demo+gates

- **S.C1 — The animate.ts zombie cluster.** DELETE src/animation/animate.ts + test/animate.test.ts +
  test/animate-orchestration.test.ts + the proof:animate-orchestration gate; purge every doc mention;
  backfill docs/MIGRATION-5.1.0.md; generalize the changelog gate to fire on ANY removal from
  docs/published-surface.md between adjacent releases (C-3, a09, a14). Gate: born-RED
  **proof:no-orphan-module** — every non-test src file reachable from a barrel, the loader, or the
  subpath (animate.ts REDs it today); zero `animate(` doc/test references. Deps: A0.
- **S.C2 — no-silent-fallback with teeth.** Promote the demo clauses from informational to enforced
  (r2 finding 10); widen Clause 1 from the 4-file R.W3 set to a src-wide deny-pattern scan with the
  machine-checked `KEEP:` allowlist idiom (a07 F3); kill the surviving §2K row 4 `as any`
  (useTimingFunctionEditor.ts:196 — widen the return type, don't cast) (a07 F4). Gate: the gate
  itself REDs on a planted demo bare-catch; zero `as any` in demo composables. Deps: A0.
- **S.C3 — Dead code, deps, and stale narration.** Delete SPRING_SMOOTH + its `void` suppression
  (a20 F4); remove the 8 zero-importer shadcn-scaffold devDeps (v-calendar, vaul-vue,
  embla-carousel-vue, @unovis/*, vee-validate, @vee-validate/zod, zod) + born-RED
  **proof:no-dead-dependency** (a31 F2); migrate KeyframesEditor's menubar to glass-ui menu, delete
  ui/menubar/ (16 files) + utils.ts(cn) (a24 F5, r4) — born-RED HANDOFF to glass-ui only if the
  consumed surface is missing; delete the 2 orphaned pre-2024 assets (a22); the stale-comment sweep:
  6 "scene-switcher" narrations, soa.ts's excised-wrapper header, group barrel's phantom
  layer-springs map, renamed-file self-headers, dep-cruiser/lint-clean baseline narratives,
  taxonomy.json's stale BORN-RED prose, the `<SegmentedTabs>` narration (a22, a04, a19, a06, a26,
  a12); collapse the design-idioms.css tombstones; remap docs/frontend-design/demo/*.md paths (a30).
  Gate: proof:no-dead-dependency born-RED today; a stale-comment clause greps zone identifiers that
  no longer exist. Deps: A0; menubar item independent of D3.
- **S.C4 — Dependency posture.** Deliberate tested bumps: dependency-cruiser 17→18 (re-verify the []
  baseline), fast-check 3→4; @types/node aligned to the engines floor; VJS_PARAM_BUG_MAX checked
  against the value.js changelog and deleted per its own lifecycle if extractFunctions is fixed
  (a31, a21 F4); glass-ui pin posture per C-12 (hold; consume-edge specified in S.E). Gate:
  proof:pin-ledger-current green post-bumps; lint baseline still `[]`. Deps: A0.

### S.D — Demo gestalt — track: demo

- **S.D1 — app/ partition.** Sub-zone demo/app into shell / machine / router / transition /
  diagnostics; evict the five scene-tier files (useRafScene, rafConstants, useSceneVisibilityPause,
  useContractAnimGroup, useSceneTransport) to their real homes; cubeTransformStore.ts →
  scenes/cube/; extract the @mbabb dropdown → dock/MbabbMenu.vue and author a REAL
  proof:app-shell-thinness (or delete the two phantom citations — the gate cited today does not
  exist) (a23 F2–F5, r4, a10); rename the useSceneMachineApp/Router collision. Mode: REWRITE. Gate:
  born-RED **proof:app-is-shell** — no file under app/ has zero app-shell importers; App.vue ≤
  ~360L; the phantom citation resolved. Deps: A4 (FROZEN set declared).
- **S.D2 — @/ partition: the state hoist + the monolith carve.** Hoist animation-controls/stores/ →
  demo/@/state/ as a first-class peer (the keystone that de-monoliths — a24 F2); sub-zone
  animation-controls into transport / keyframes-editor / timeline peers (a24 F1); single-consumer
  colocations: CSSPasteDialog→timeline, AnimatedText/TypingDots/KeyboardShortcutsModal→editor-shell,
  the easing-editor cluster→easing-editor/, orbital-drag+matrix-editor→scenes/cube/,
  dock/→app-adjacent, useTypedTrigger→scenes/sequence/ (a24 F3/F6, a10, r4); carve
  ControlsPaneWrapper (497L) / AnimationControlsGroup (477L) (a11 F1); cubeKeys.ts for 8/8 parity
  (a10). Mode: REWRITE (the R "do not touch" fiat is overturned by the importer census — a24 F8).
  Gate: born-RED **proof:shared-has-n-consumers** — any @/ module with <2 consuming areas REDs;
  reference-count clause added to scene-colocated (a10). Deps: D1. (*Prototype Q4 costs the gate
  fallout.*)
- **S.D3 — Playground → scenes/compose/.** Execute C-4: register the ninth scene (SceneExposedApi +
  playback adapter; Assets tab through extraControlTabs); relocate asset-manager/ + EditableLabel;
  delete demo/playground/ (app, vite mode, un-pinned outDir landmine, 9.6MB dist debris); update the
  stores reset hook + the two gate clauses that read playground/App.vue; make Image/SVG kinds real or
  drop the menu items; land the design lane's foundry fixes as the scene's W1 (chrome-red selection
  tokens, Fraunces source kill, empty-state recast) (design:playground, r4 F4–F6, a22). Gate:
  born-RED **proof:compose-scene** — the scene mounts in the SPA, the standalone entry is GONE
  (repo grep + vite modes), the ignition moment drives a real DrawSVG. Deps: D1, A4. (*Prototype
  Q6.*)
- **S.D4 — Demo taxonomy + docs truth.** Settle use<Name>Demo vs use<Name>Animations naming (a10);
  regenerate demo/CLAUDE.md's @ section from the real tree (kill the three phantom files — a24 F7)
  + a doc-drift clause; sweep stale gate-comment/baseline paths (a10); demo/@→shared rename decision
  (R.W5 C.6's skip) made terminally — RULING: keep `@/` (alias churn buys nothing; document it).
  Gate: proof:claude-paths-live extended over demo/CLAUDE.md. Deps: D1–D3.

### S.E — Scene-stage resurrection (multi-wave; DM-24 REVIVED) — track: demo/design

Charter guardrails (absolute, from r7 A-9/A-10): one nav authority; chrome outside the
`scene-subject` VT (Teleport-to-body sibling); commit-on-settle wired; every load-bearing motion
dogfoods a LIGHT-barrel primitive on RAFPlayback; every atomic stage verified LIVE against the
running demo (chrome-devtools-mcp), never source-shape; PRM snaps every beat; the shelf's scratch
`*.mjs` probes are NOT resurrected — real gates only.

- **S.E1 — Registry re-path.** Enumerate the preview registry from demo/app/scenes.ts (all 9 fused
  scenes incl. morph and compose) onto demo/scenes/<name>/…Target.vue; per-scene idle-state adapters
  re-homed (r7 A-7). Gate: runtime — registry resolves a non-null target per scene row (not grep).
  Deps: D1, D2 (state hoisted; scenes.ts stable). (*Prototype Q5.*)
- **S.E2 — Orbit + LOD lift.** useCarouselOrbit + useLivePreviewLOD lifted near-verbatim (ONE
  SpringProgress over ring angle; ONE shared RAFPlayback LOD clock; amiga WebGL counts double)
  (r7 A-2/A-3). Gate: proof:boundary green (LIGHT-barrel imports hold); perf trace ≥55fps with all
  previews mounted (STAGE-SPEC S6). Deps: E1.
- **S.E3 — Stage overlay.** Teleport-sibling overlay outside the VT subject; registered-@property
  downlight over never-black grid paper; the empirically verified rotateX(-15deg)/perspective
  geometry (NOT re-derived); zoom-out choreography on a SpringProgress (r7 A-4/A-5/A-6). Gate:
  live computed-style/rect assertions per STAGE-SPEC's measurable acceptance (geometry + fps). Deps:
  E2.
- **S.E4 — Commit-on-settle + single authority.** ChromeDock opens the stage; spin-settle/scrollend →
  runSceneSwitch through the existing typed-VT seam; frontIndex/spinning exposed as the gate
  observable; the reborn **proof:scene-stage-commits** (C-6's successor) asserts a swipe/arrow
  COMMITS a scene — the cure for both dead attempts' cardinal defect (r7 A-9). Gate: born-RED
  proof:scene-stage-commits (browser-actuating, demo-correctness tier). Deps: E3.
- **S.E5 — Phone path + affordance hardening.** The mobile switcher is the SAME stage (no max-width
  fork, no second authority); KfPillTabs promoted to the tested, focus-correct panel primitive the
  stage standardizes on (a12); Oscillator's decision (C-13) lands here or in S.G. Gate: the reborn
  mobile gate green at 375px (open→spin→commit on touch); KfPillTabs.test.ts green. Deps: E4, B7.
- **S.E6 — glass-ui consume-edge (GATED: fires only on the joint 5.0.0 publish).** Pin ~4.0.0→~5.0.0
  (tilde, never caret); verify the ~17 consumed subpaths against BH's regenerated entry-set;
  re-baseline visual-lock gates against BG's specular floor + unified 8px blur; swap the stage's
  dock controls onto BG's in-place dock morph (retiring the interim in-dock arrows); re-test the
  dock double-click — if it survives, fresh born-RED HANDOFF to glass-ui (r7 Part B, C-12). Gate:
  proof:peer-satisfied flips green; subpath-survival clause; double-click verdict recorded. Deps:
  E4 + EXTERNAL (glass-ui 5.0.0 published). Explicitly bookable across the S close as a structured
  HANDOFF if 5.0.0 has not landed — it is the band's ONLY externally-gated wave.

### S.F — SOTA uplift: animation library — track: lib

Selection rule (r5): only primitives whose kf version is structurally better because the round-trip
engine compiles them back to zero-runtime, current-spec CSS. S-scoped: View Transitions, SplitText,
@starting-style, animation-trigger. Recorded-future (NOT S): anchor-positioned motion (thin demand
today), Lottie/Theatre→compileToCSS importer (moat seed, separate charter), Rive/authored-runtime
(different product).

- **S.F1 — View Transitions (flagship).** LIGHT orchestration/view-transition/ dispatch (falls back
  to flipShared where unavailable) + the compile/ emitter: compile a kf group to native
  ::view-transition-* @keyframes + view-transition-class, with honest refusal semantics — kf becomes
  the only engine that compiles TO View Transitions (r5). Gate: born-RED round-trip clause — an
  emitted VT stylesheet replays visually equivalent to the flipShared baseline in a live browser;
  refusals enumerated. Deps: B2/B3 (compile sub-zoned), A0. (*Prototype Q9.*)
- **S.F2 — SplitText.** orchestration/split-text/ — splitText(el,{by,a11y}) returning a fragment
  cohort + ready stagger, riding the existing engine; a11y-first (GSAP's 2025 rewrite is the
  reference bar) (r5). Gate: fragments animate under the engine with the pre-split accessible name
  preserved (AT-tree assertion); LIGHT boundary green. Deps: B1.
- **S.F3 — Modern entry/exit compilation.** compileToCSS + an authoring helper emit @starting-style
  + transition-behavior:allow-discrete; entrance presets reframed as "compiles to the native entry
  effect where supported" (r5). Gate: emitted CSS drives a display:none entry natively in a live
  Chromium; refusal recorded elsewhere. Deps: B3.
- **S.F4 — Drive animation-trigger.** scroll/scene.ts realizes the already-parsed trigger grammar
  (idle→active→done; backward/repeat) — native where Chrome 145+ ships, kf ScrollScene everywhere
  else (r5). Gate: a trigger round-trips grammar→behavior in the JS driver (browser-actuated). Deps:
  B-zone stable.
- **S.F5 — Perf frontier.** Precompute boxedKeys as a Set on SoALayerPlan (kill the last per-frame
  composite allocation) + extend proof:zero-alloc to the mixed-leaf shape (a32 F3, a04 F6); Typed-OM
  write-path ADOPT/KILL on a real-browser bench (a32); WAAPI multi-segment densify to single
  linear() for compositor eligibility (a32); convert the 6 colorTail arms + replace-arm to budgeted
  device-independent ratios (C-10); add bench/resolve.bench.ts (887L zone, zero coverage) + the
  static-vs-dynamic cold-import bench (a26). Gate: proof:zero-alloc mixed-leaf clause born-RED
  today; taxonomy budgeted floors hold; Typed-OM verdict recorded terminally. Deps: B2/B4.
- **S.F6 — Narrative (near-zero code).** The emerging-CSS resolver marketed honestly (kf animates
  if()/@function/env() cross-browser today; platform is Chromium-only); measured light-entry byte
  count vs Motion mini; dated WebKit-linear() re-check note in eligibility.ts (r5). Gate:
  proof:readme-runs covers the new claims. Deps: F1–F4 text final.

### S.G — Demo design refinement fleet — track: design

- **S.G1 — The mobile stage-visibility contract (the systemic cure).** ONE contract, fleet-wide:
  sheets open at peek height by default (spring's born-open full-height is the worst case); every
  scene declares a reserved stage band the sheet cannot occlude; scene-critical telemetry/primary
  controls anchored above the fold (sequence's scrubber, amiga's ω chip, cube's attitude readout,
  square's envelope + legend, easing's live strip, morph/motion-path captions, compose's CTA)
  (design:* — all ten lanes). Replaces the per-pixel occlusion locks with one layout-invariant
  **proof:stage-visible** system gate (feeds A4's migration). Gate: born-RED proof:stage-visible at
  375×667 across all 9 scenes (subject visible + primary control reachable with the sheet at rest).
  Deps: A4, D1. (*Prototype Q10.*)
- **S.G2 — Per-scene W1 batch.** Each design lane's highest-leverage refinement, landed as one wave:
  home directional-copy fix + first-visit dock reveal; cube showroom rest-attitude + readout anchor;
  amiga telemetry relocation + gesture caption; easing sheet cap + un-truncated literal; morph
  shape-ring picker; motion-path traveller offset-path scaling fix (a real defect, not polish) +
  hit-halos; square honest controls (wire or collapse the lying easing/duration panel); sequence
  scrubber unburied + axis-label collision; spring Race button + peek sheet; compose chrome-red
  (design:*). Gate: per-item live-verified via the demo-correctness harness; the FROZEN-set reds
  discharged with cause. Deps: G1.
- **S.G3 — The affordance layer + touch parity.** One drafting-stamp-proportion gesture legend per
  scene (fade after first use); touch parity for every dblclick/keyboard-only delight (derby
  double-tap, gallery door button, long-press tumble, axis-lock chips, boing threshold notch);
  focus rings on the primary instruments (sequence sliders, spring rail, motion-path handles);
  44px floors (design:*). Gate: a hidden-affordance census clause — every scene's README'd gesture
  set has an on-stage tell + a touch path (browser-actuated spot checks). Deps: G2.
- **S.G4 — One easter egg per scene (design wave).** The ten authored eggs land as specified by the
  design lanes: Guru Meditation (amiga), calibration detent (cube), "wheee" (home), the fifth shape
  ♥ (morph), the null curve (easing), the draftsman's stamp (motion-path), FIELD CALIBRATED
  (square), swing quantize (sequence), the pane inherits your physics (spring), the searchlight
  (compose). All PRM-gated, all dogfooding engine primitives, none load-bearing. Gate:
  proof:easter-egg extended per scene (observe-tier), each egg reachable by a discoverable-or-
  documented path. Deps: G2, E4 (stage stable).

### S.H — parse-that dispatch (own repo; published then re-pinned; NO file: links) — track: dispatch

- **S.H1 — Packrat-epoch arming (perf, patch).** PACKRAT_ARMED gate so packratEnter/Exit are true
  no-ops until a memoize() is constructed — today 3 Maps allocate on EVERY default-path parse,
  flowing into every value.js/kf parse (r6 F1). Gate: born-RED retained-heap clause (N non-memoized
  parses allocate flat). (*Prototype Q11 confirms the win registers.*)
- **S.H2 — The 1.0.0 legacy cut + correctness fix.** Delete span.ts + all 15 *Span exports; flip
  dist-surface.test.ts to zero-*Span (proof:no-span-surface); fix chain()'s truthiness gate to
  !state.isError with a 0/''/false regression test; refresh parse-that/CLAUDE.md (stale on four
  counts) (r6 F2–F4). Gate: no-span-surface born-RED today (the keep-gate currently asserts
  presence); chain regression test red-then-green.
- **S.H3 — Pratt combinator (DEVELOP-only).** Binding-power combinator design over the Parser core
  with the identified value.js math.ts consume-edge; NOT implemented without value.js ratification;
  explicitly not a grammar-DSL move (r6 F7). Gate: design doc + a consume-edge sketch value.js signs
  off on. 
- **S.H4 — Ledger closure + cut.** Verify DQ-1 (packrat re-entrancy) and DQ-2 (dead API) actually
  landed in 0.13.0 (dropped from the R ledger — r8 F2); record the WDM/LR keep-vs-KISS decision
  (keep, made free by H1's arming); record the deliberate non-goals (token streams, incremental,
  Squirrel LR, SpanParser resurrection); cut 1.0.0, kf re-pins on publish. Gate:
  proof:pin-ledger-current reflects the new pin; the kf-side consume gate green.

### S.Z — Close — track: close

- **S.Z1 — The prompt-recap, total.** Per §5. Gate: born-RED **proof:prompt-recap-s** — every r1
  corpus ask row carries a disposition; the three mandated re-verifications (keyframes-vue KILL,
  lint-tier, decomposition-spirit) are re-measured, not chain-trusted. Deps: all bands.
- **S.Z2 — The tranche-development TEMPLATE.** r2's rules codified as a checked artifact
  (docs/tranches/TEMPLATE.md + a proof:tranche-template gate for S and successors): every wave
  CLOSED only on a re-run green born-RED gate; no FINAL asserts an un-re-measured exit code;
  override caps only shrink; override prose with deferral verbs cross-checked against the ledger;
  parallel-drive gates re-run from clean checkouts; closure oracles must be runtime-tier;
  full proof:all + bench-compile BEFORE the version/FINAL commit (no post-close fallout — the
  6f2493d anti-pattern); adversarial challenge lane that tempers. Gate: proof:tranche-template
  parses S's own FINAL and REDs on any violation (plant one → RED). Deps: Z1.
- **S.Z3 — FINAL + version owner + memory truth.** FINAL over a from-clean full-roster run with the
  exact SHA; the version decision is an OWNER RULING (spec pre-books the question: the S impl cut is
  additive-minor by default; any surface removal must ride a MIGRATION doc per the generalized
  changelog gate); MEMORY updates: stale specular note retired, dock-doubleclick sharpened, DM-24
  REVIVED recorded; docs/precepts/audits/ ownership decided (fold or freeze — a30). Deps: Z1, Z2.

### The DAG

```
S.A0 ──► S.A1, S.A2, S.A4, S.A5, S.C*, S.B1
S.A2 ──► S.A3
S.A4 ──► S.D1 ──► S.D2 ──► S.D3, S.E1
S.B1 ──► S.B2 ──► S.B4, S.B6 ; S.B1 ──► S.B3 ──► S.B4 ──► S.B5 ──► S.B7 ──► S.B8
S.B2/B3 ──► S.F1, S.F3 ; S.B2/B4 ──► S.F5 ; S.B1 ──► S.F2
S.E1 ──► S.E2 ──► S.E3 ──► S.E4 ──► S.E5 ; S.E4 + [glass-ui 5.0.0 published] ──► S.E6
S.G1 (after A4, D1) ──► S.G2 ──► S.G3, S.G4(+E4)
S.H1..H4 parallel to all; S.H4 before S.Z
ALL ──► S.Z1 ──► S.Z2 ──► S.Z3
```

Tracks: lib = S.B, S.F; demo = S.D, S.E, S.G; gates = S.A; dispatch = S.H; design = S.G (+E3/E5);
close = S.Z. Cross-lane sequencing constraints: a19's engine↔group constraint (KeyframesAnimation
stays at engine/animation.ts through B2); A4's FROZEN-set declaration precedes any demo wave that
reds a layout gate; E6 is the only externally-gated wave in the plan.

---

## 4. Chronic + deferral fold table

Every open item from r8 §6 + the audit lanes. **No un-dispositioned rows.** (KILLs shown are
proposed-for-ratification at S close; HANDOFFs are owner-domain with a named re-entry condition.)

| # | Item | Born | Chronicity | S-disposition |
|---|------|------|-----------|---------------|
| 1 | Master CI red on every push | K | 3 tranches | **WAVE S.A0** |
| 2 | proof:styling-idioms orphan `.morph-ghost--from` | R.W5 | new | **WAVE S.A0** (one-line FOLD) |
| 3 | proof:pin-ledger-current RED (stale PIN-LEDGER) | Q→R | new | **WAVE S.A0** |
| 4 | LoAF bench exit-code flake (metric green) | C-era | chronic | **WAVE S.A0/S.A2** (decouple) |
| 5 | 14 demo-smoke blocking gates red on runner | I–R | structural | **WAVE S.A2** (per-gate triage) |
| 6 | DM-8 Lighthouse floors | B-era | 6 | **WAVE S.A1** → terminal shape (observe-in-CI/hard-on-device, formally recorded) |
| 7 | DM-9 specular-at-rest | D | 8 | **WAVE S.A1** → re-run on S dist; terminal-ize (deterministic re-shape or KILL) |
| 8 | DM-10 typography/font-census | D | 9 | **WAVE S.A1** → same terminal-ization |
| 9 | DM-11a spring-slider-continuous | D | 10 | **WAVE S.A1** → same |
| 10 | DM-11b subject-animates — RED on runner | D | 11 | **WAVE S.A1+S.A2** (OPEN; fix or calibrate, then terminal) |
| 11 | DM-12 perf-frame-budget (glass-ui-owned dock clause) | D | 9 | **WAVE S.A2** (split kf-blocking vs glass-ui observe clause) + **HANDOFF** (dock width-morph → glass-ui) |
| 12 | DM-13 engine-no-throw-on-play — RED on runner | A | 9 | **WAVE S.A1+S.A2** (importmap harness fix; terminal) |
| 13 | DM-14 fsm-suspend-resume-live — RED on runner | H | 8 | **WAVE S.A1+S.A2** (timing calibrate; terminal) |
| 14 | DM-15 control-surface-single-writer | I | 7 | **WAVE S.A1** → terminal-ization |
| 15 | DM-5 S8 FN_NAME source-probe | K | 5 | **WAVE S.A1** (verify; terminal as regression-guard) |
| 16 | DM-20 auto-deploy-of-record dead | L.WZ | 4 | **WAVE S.A3** |
| 17 | DM-24 N-Stage scene-switcher (R KILL disputed) | N | 4 | **REVIVED → BAND S.E** (owner-reopened) |
| 18 | proof:scene-switcher-mobile zombie gate | R.W5 | new | **WAVE S.A4** (retire) + **S.E4/E5** (reborn) |
| 19 | proof:scene-colocated ASSERTION 3 vs charter | R.W5 | new | **WAVE S.A4** (delete clause) |
| 20 | ~54 demo-layout ossifying gates | H–R | accreting | **WAVE S.A4** (FROZEN set; migrate to system gates via S.G1) |
| 21 | proof:app-shell-thinness phantom citations | R | new | **WAVE S.D1** (author real gate or delete citations) |
| 22 | proof:engine-seam-split never authored | Q | 2 | **KILL (ratify at S.Z)** — superseded (C-11) |
| 23 | animate.ts zombie + 2 tests + stale docs | R.W4 | new | **WAVE S.C1** (DELETE) |
| 24 | MIGRATION-5.1.0.md absent (semver gap) | R.W4 | new | **WAVE S.C1** (backfill + generalized gate) |
| 25 | no-silent-fallback demo arm toothless | R.W3 | new | **WAVE S.C2** |
| 26 | §2K row 4 `as any` (useTimingFunctionEditor:196) | R.W3 | new | **WAVE S.C2** |
| 27 | 8 zero-importer shadcn devDeps | pre-A | ancient | **WAVE S.C3** |
| 28 | ui/menubar island + utils.ts(cn) | pre-A | ancient | **WAVE S.C3** (glass-ui menu; born-RED HANDOFF only if surface missing) |
| 29 | playground identity + blank build + outDir landmine | I-era | 3+ | **WAVE S.D3** (FOLD as scenes/compose/) |
| 30 | cubeTransformStore + 5 scene-tier files in app/ | R.W5/6 | new | **WAVE S.D1** |
| 31 | animation-controls monolith "do not touch" fiat | R | new | **WAVE S.D2** (overturned by census) |
| 32 | presets/classic.ts last ceiling override | Q→R | 2 | **WAVE S.B5** (data split; override map emptied — keystone completed) |
| 33 | Six files at 488–499L (pre-red) | R.W2b | new | **WAVE S.B5** |
| 34 | constants.ts heavy-runtime/light-type mix | pre-R | old | **WAVE S.B1** |
| 35 | PlaybackState half-carve (FSM on class) | R.W2 | new | **WAVE S.B2** |
| 36 | getGroupFactory service locator (1 caller) | R.W2c | new | **WAVE S.B4** (ownership inversion) |
| 37 | ./engine mirror drift-ungated; triple surface | R.W4b | new | **WAVE S.B6** |
| 38 | d.ts: 11 `=any` defaults; 126 privates; dual roll-ups | Q–R | old | **WAVE S.B6** |
| 39 | bench/ + test/ outside typecheck; waapi-densify 9 stale types | R-fallout | new | **WAVE S.B7** |
| 40 | 5 scenes zero composable test coverage | R.W5 | new | **WAVE S.B7** |
| 41 | src/animation/CLAUDE.md pre-R (9 lanes); root doc drift | Q | 2 | **WAVES S.A5 (gate) + S.B8 (regen)** |
| 42 | 6 colorTail benches observe-only (SOTA claims unfloored) | Q.WB3 | 1 | **WAVE S.F5** (budgeted ratios) |
| 43 | Typed-OM adopt/kill undecided | P | 3 | **WAVE S.F5** (terminal verdict) |
| 44 | WAAPI multi-segment densify unshipped | P | 3 | **WAVE S.F5** |
| 45 | resolve/ zone zero bench coverage | P–Q | 2 | **WAVE S.F5** |
| 46 | color2Into cross-repo WATCH | P | 2 | **DISPATCH (value.js)** — verify at S.H4 re-pin; else WATCH with named exit |
| 47 | DQ-1 packrat re-entrancy landed? | Q | 1 | **WAVE S.H4** (verify in 0.13.0) |
| 48 | DQ-2 parse-that dead API/*Span | Q | 1 | **WAVES S.H2/H4** |
| 49 | parse-that packrat 3-Map default-path alloc | (found r6) | new | **WAVE S.H1** |
| 50 | parse-that chain() falsy-skip bug | (found r6) | new | **WAVE S.H2** |
| 51 | glass-ui proof:glassui-aria-ask PENDING-BC | Q | 2 | **HANDOFF (owner)** — re-entry: BC/5.0.0 publish → S.E6 |
| 52 | glass-ui proof:peer-satisfied born-RED peer-cycle | L | 4 | **HANDOFF (owner)** — re-entry: glass-ui peer-widen → S.E6 |
| 53 | Dock double-click chronic | ~J | 4+ | **HANDOFF sharpened** — verify at S.E6 vs built 5.0.0; if alive, fresh born-RED to glass-ui |
| 54 | Stale MEMORY specular=off expectation | M-era | 3 | **WAVE S.Z3** (retire — BG resolves affirmatively) |
| 55 | glass-ui pin frozen ~4.0.0 (2 minors behind) | Q | 2 | **WAVE S.E6** (deliberate ~5.0.0 at publish; hold till then per C-12) |
| 56 | Oscillator fictional demo claim; reseatToSpring unconsumed | L–P | 3 | **WAVES S.G/S.E5 decision + S.F5 bench** (C-13 — forced terminal) |
| 57 | SPRING_SMOOTH dead constant + void hack | P | 2 | **WAVE S.C3** |
| 58 | declaredKeyframeBodyFor dead export | Q | 1 | **WAVE S.B3** |
| 59 | MotionPath.finished asymmetry | O | 2 | **WAVE S.B4** (svg/handle.ts) |
| 60 | transport.ts hand-rolled prefersReducedMotion | R.W2b | new | **WAVE S.B4** |
| 61 | VJS_PARAM_BUG_MAX (value.js ≤1.2.0 bug) | Q | 1 | **WAVE S.C4** (delete per lifecycle if fixed upstream; else KEEP with citation) |
| 62 | dependency-cruiser 17→18, fast-check 3→4, @types/node | old | old | **WAVE S.C4** |
| 63 | Stale comments/narration corpus (scene-switcher ×6, soa.ts, barrels, baselines, taxonomy prose, headers) | Q–R | mixed | **WAVE S.C3** |
| 64 | docs/frontend-design/demo/*.md pre-fusion paths | pre-R | 1 | **WAVE S.C3** (remap before S.G reads them) |
| 65 | docs/precepts/audits/ ownerless | old | old | **WAVE S.Z3** (fold or freeze) |
| 66 | Mobile-sheet occlusion systemic (10/10 pages) | H-era | chronic | **WAVE S.G1** |
| 67 | Hidden-affordance systemic (10/10 pages) | H-era | chronic | **WAVE S.G3** |
| 68 | Motion-path traveller offset-path scaling defect | pre-R | 2 | **WAVE S.G2** (real defect, priority W1) |
| 69 | Square lying controls panel | pre-R | 2 | **WAVE S.G2** |
| 70 | Gate roster 190→~120 consolidation | H–R | accreting | **WAVE S.A4** |

---

## 5. The prompt-recap plan

S's close must prove every owner ask hitherto is ADDRESSED or explicitly dispositioned — against
**r1's corpus** (the 100+ session-message mining), not against S's own charter alone.

Mechanics:

1. **The ask ledger.** S.Z1 materializes r1's corpus as a table: ask → origin (session/tranche) →
   letter-status (what shipped) → spirit-status (r1's leak analysis) → S disposition (wave / KILL /
   HANDOFF). r1 already grades the hard cases: decomposition honored in letter, spirit open
   (→ S.B's cohesion-first rule + the reformed gate); the gate-routed-around triad (override rewrite,
   manual deploy, re-tiering — → S.A0/A2/A3 make the routes unnecessary); the 3-hour apparatus
   complaint (→ S.A2's harness net-deletion + S.A4's tier legend); the scene-switcher as the oldest
   unfulfilled first-class ask (→ band S.E, built to not repeat N's failure loop).
2. **Re-verify, never chain-trust.** The recap re-measures the two R reversals (keyframes-vue KILL —
   a01 says verified total, re-run anyway; the lint-tier/dep-cruiser retraction) and the
   decomposition-spirit gap, per r1's recap-integrity guard. Every "ADDRESSED" row cites a re-run
   gate exit code or a live observation, not a doc claim (r2 S4).
3. **The gate.** Born-RED **proof:prompt-recap-s**: parses the ask ledger; REDs on any row without a
   terminal disposition; REDs if any S-charter verbatim precept (the nine in the kickoff) lacks a
   band mapping. Non-vacuity: a planted un-dispositioned row must RED.
4. **Owner asks arriving mid-S** are appended to the ledger with a wave assignment or an explicit
   owner-ratified deferral — never absorbed silently (the F3 laundering guard).
5. **The spirit column is the point.** A recap that lists letter-compliance while the same
   mechanism leaks (r1's headline) fails S's own bar; the recap must state, per ask, what would
   falsify "addressed" — and S.Z2's template gate makes that a structural requirement for T and
   beyond.

---

## 6. Open questions for the prototype fleet (Pass 1E)

Each: the question · the prototype shape · success/failure criterion. Prototypes run in throwaway
worktrees; findings feed SPEC-v2; nothing merges.

- **Q1 — Does engine/css/ produce cohesion or ceremony?** Perform the B2 move in a worktree:
  css-animation + css-metadata → engine/css/, recursive proof-engine fix, barrel edit. SUCCESS:
  ≤1 barrel touched, zero new re-export-only bridges, proof:engine + decomposition + test suite
  green, group/* untouched. FAILURE (falls back to a03's flat pair): >1 bridge module needed or
  external import churn >10 sites.
- **Q2 — Does the PlaybackState FSM fold survive the hot path?** Move the 8 run-state fields into
  PlaybackState; repoint the ~30 external mutations. SUCCESS: test suite + proof:zero-alloc green;
  interp-buffer bench ratio flat (±5%); no new per-frame indirection beyond the one property hop a32
  already priced. FAILURE: bench regression or a forced per-frame adapter object (violates a32's
  S-METHOD warning) → keep plumbing-owner shape, gate the split-brain with a lint clause instead.
- **Q3 — Does constants.ts split cleanly light/heavy?** Execute B1 in a worktree. SUCCESS:
  proof:boundary green, no light module imports the heavy half, check:lib green, zero cycles
  introduced, consumer edits mechanical. FAILURE: a type that genuinely needs a runtime default in
  the light half → document the seam and gate the discipline instead.
- **Q4 — Does the demo/app + @/ partition survive the 54-gate migration cheaply?** Perform D1 (+ a
  slice of D2: the stores hoist) in a worktree; run the full hygiene-chain + the layout-gate set.
  SUCCESS: all reds fall inside A4's declared FROZEN set; scene-colocated (minus ASSERTION 3) green;
  ≤1 day of gate re-pointing projected. FAILURE: reds outside the FROZEN set (unknown coupling) →
  the FROZEN census is incomplete; re-inventory before D-band impl.
- **Q5 — Is the n-stage salvage actually rebasable — what is the path-drift cost?** Extract
  scene-stage/ from `n-stage-impl` onto tranche-s-dev; re-path the registry onto demo/scenes/<name>/;
  mount behind a dev flag. SUCCESS: compiles; proof:boundary green (SpringProgress/RAFPlayback
  imports hold); a live spin over ≥3 real Target previews at ≥55fps in a trace. FAILURE: Target
  components no longer mountable standalone (fusion coupled them to Scene shells) → the
  ScenePreviewHost needs a per-scene adapter layer; cost that into S.E1.
- **Q6 — Playground fold-as-scene: what breaks?** Register a skeletal scenes/compose/ in scenes.ts;
  route the Assets tab through extraControlTabs; delete the standalone mode in the worktree. SUCCESS:
  scene mounts + navigates; stores reset hook survives; the two gate clauses re-point cleanly; no
  other consumer of asset-manager surfaces. FAILURE: the scene machine assumes 8 scenes somewhere
  hard-coded (enumerate the sites) or asset-manager drags playground-only deps → scope D3 up.
- **Q7 — Does `loadAnimationEngine → import("./engine/public")` preserve the chunk graph?** Rewrite
  and build. SUCCESS: 39-key runtime equality; proof:boundary green; light graph untouched; the lazy
  waterfall's chunk count/size within tolerance (measure — a single fatter chunk may be acceptable;
  record the number for the owner). FAILURE: light-entry pulls any heavy chunk → keep the
  Promise.all mirror and rely on the B6 drift gate alone.
- **Q8 — Can the gate-tier re-taxonomy land without breaking ci-coverage's airtightness?** Author the
  gate-tiers manifest (3 tiers) + re-scope gate-is-runtime in a worktree; run proof:ci-coverage +
  gate-is-runtime. SUCCESS: both green with the new manifest; a planted mis-tiered gate REDs; zero
  gates orphaned. FAILURE: the 15-clause coverage model resists a third tier → stage the split
  (library-correctness first).
- **Q9 — Is the View-Transitions compile emitter real?** Hand-compile ONE flipShared group to
  ::view-transition-* CSS; drive both in a live Chromium side by side. SUCCESS: visually equivalent
  morph (rect trajectory within tolerance); a refusal taxonomy drafted for unsupported shapes.
  FAILURE: VT's snapshot model can't express the group's timing semantics → demote F1 to
  dispatch-only (no emitter) and record why.
- **Q10 — Does the stage-visibility contract hold on the two worst scenes?** Prototype G1's
  peek-band + reserved-stage on spring (born-open sheet) and easing (severed feedback loop) at
  375×667. SUCCESS: subject + primary control visible at rest on both; no reds outside the FROZEN
  set; the contract expressible as ONE gate. FAILURE: a scene needs a bespoke layout exception → the
  contract gains a per-scene declared band, not per-scene CSS forks.
- **Q11 — Does packrat arming register on a real bench?** Implement PACKRAT_ARMED in a parse-that
  worktree; run the value.js-shaped parse bench + heap probe. SUCCESS: flat heap across N
  non-memoized parses and a measurable throughput delta on the value.js corpus. FAILURE: no
  measurable delta → S.H1 demotes from perf-wave to hygiene-wave (the comment fix + arming for
  cleanliness only).
- **Q12 — Are DM-11b/13/14 calibration or genuine?** Reproduce the three runner-reds in a
  Linux-shaped environment (container/act or instrumented CI artifacts). SUCCESS: per-gate verdict
  with evidence (harness importmap fix vs render-race calibration vs genuine regression). This
  verdict IS S.A1's triage input.

---

## 7. Risks + anti-patterns (binding template mandates for S)

r2's failure/success taxonomy, restated as **mandates** — each enforceable, most by S.Z2's template
gate:

- **T1 (no gate-shaped closures).** Every chronic/charter closure oracle is a runtime-tier gate that
  opens the dist and actuates; the reformed proof:gate-is-runtime REDs any source-shape gate cited
  as a runtime closure (r2 F1).
- **T2 (no self-certifying gates).** Ceiling overrides may only shrink or be data-volume-justified
  with a machine-checkable ratio; a cap RAISED vs the prior tranche is a hard RED (r2 F2). S.B5
  targets an EMPTY override map.
- **T3 (no deferral laundering).** Override/close prose containing deferral verbs is cross-checked
  against the ledger by a meta-gate; a booked deferral without a ledger row REDs (r2 F3).
- **T4 (DEVELOPED ≠ SHIPPED).** A wave is CLOSED only when its born-RED gate is GREEN *re-run on the
  merged tree*, exit code recorded in PROGRESS.md (r2 F4). S is development-only: every wave doc
  states this and its gate ships born-RED or born-SPECIFIED.
- **T5 (no transcript trust).** Parallel drives re-run every touched gate from a clean independent
  checkout; "pre-existing" claims are verified by triage, never accepted (r2 F5, a15). Worktree
  hygiene: node_modules symlinks never git-added.
- **T6 (no cosmetic excision).** An excision deletes the body, its tests, its gates, and its doc
  mentions; the whole-tree symbol grep is a discharge-checklist step (r2 F6, a09). The
  proof:no-orphan-module gate makes the class structural.
- **T7 (gate follows code — including docs and its own coverage set).** A structural wave co-edits
  every gate whose scan geometry it changes (a17's recursive-scan lesson), regenerates its
  before/after box from the shipped tree (a03), and treats the architecture MAP as a gated
  deliverable (a02's method note). When a wave deletes a UI surface, it must reconcile EVERY gate
  naming that surface — continue-on-error hides the red (a23's method note).
- **T8 (interaction-axis tests for hand-rolled primitives).** Any replacement for a vendor primitive
  ships with a keyboard/focus/repeat test, not only a source-shape gate (a12) — the documented
  gate-blindspot cure; live verification via chrome-devtools-mcp for every stage of S.E/S.G.
- **T9 (census before fiat).** No "keep verbatim / do not touch" verdict on a shared directory
  without an importer census shipped as evidence (a24 F8).
- **T10 (clean close).** Full proof:all + bench-compile from clean, citing the exact SHA, BEFORE the
  version/FINAL commit; a post-close fallout patch falsifies the close (a15, r2 W-weak-3). No FINAL
  gate-state table smaller than the full roster (r8 F5 — R's 6-gate table let a red chain ship).
- **T11 (the risk signature).** Breadth + chronic-folding + a headline close claim is the recorded
  danger pattern (the only uncorrected tranches were narrow and measure-first — r2 Part V). S is
  deliberately broad, so it compensates with T1–T10 at full strength, the keystone-first order
  (S.A0), the contingency-KILL belt (every ≥4-tranche chronic in §4 reaches a terminal), and the
  adversarial critique fleet whose corrections OVERRIDE raw findings while crediting real wins
  (r2 S6).
- **T12 (external gates are named, not assumed).** Exactly one wave (S.E6) is gated on an external
  publish; it is specified now, fires later, and can close S as a structured HANDOFF with a named
  re-entry condition — never a silent carry. No other wave may acquire an external dependency
  without an owner ruling.

---

*End of SPEC-v1. The prototype fleet takes §6; the critique fleet scores convergence against §2's
rulings and §3's band DAG; SPEC-v2 folds both.*
