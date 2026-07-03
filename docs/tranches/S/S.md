# Tranche S — honesty-then-altitude (truth · structure · resurrection · frontier)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document +
> `PROGRESS.md` (the board + the chronic/deferral fold ledger) + `waves/S.*.md` (the
> per-band wave specs — one file per band) are what the impl drive executes from. The converged source of truth
> behind them is `audit/pass1/SPEC-v3.md` (1,833 lines, standalone) — it stays as audit
> evidence; **an implementer must not need to read it**. Branch: `tranche-s-dev`.
> **Docs only — no source, test, config, or git state is touched in development.**
> Every wave ships a falsifiable born-RED gate (or, for the publish-coupled external
> edges — S.E8's consume gate + the S.H4 gates — born-SPECIFIED); nothing runs until
> the owner explicitly authorizes the impl
> drive (the inv-16 boundary, held honestly: a wave is CLOSED only when its gate is
> GREEN re-run on the merged tree, and S.Z2 re-executes that oracle at close).

## 0. Provenance — the two-pass convergence loop + the pass-3 probe-and-design loops

S was developed through a convergence loop that finished at **100%: 11/11 critics,
empty blocking lists** (SPEC §preamble, §6.4 — zero disputed edits, zero dropped
adjustments at either pass):

1. **50 audit/design/research lanes** → `audit/pass1/DIGEST.json` (+ `audit32/`,
   `design/`, `research/`).
2. **SPEC-v1** — first synthesis (`audit/pass1/SPEC-v1.md`).
3. **12 Pass-1 prototype probes** (`audit/pass1/prototypes/p01–p12`) — every v1 open
   question Q1–Q12 executed against the live tree or a worktree (SPEC §6.1: all
   twelve CLOSED, confirms- or adjusts-spec).
4. **11 adversarial critics, avg ~50% initial acceptance** — 95 blocking edits
   (`audit/pass1/CRITIQUE.json`, `audit/pass1/critique/*.md`: sa-truth-gates,
   sb-library, sc-legacy, sd-demo, se-scene-stage, sf-sota-animation, sg-design,
   sh-parse-that, sz-close, x1-completeness, x2-antipattern).
5. **SPEC-v2** — 95/95 blocking edits ABSORBED, 0 DISPUTED (row-by-row in SPEC §9).
6. **2 Pass-2 residual probes** (`audit/pass2/p2-1-demo-shared-carve.md`,
   `audit/pass2/p2-2-starting-style-compile.md`) — P2-1 confirms-spec (the S.D2
   carve), P2-2 adjusts-spec (the entry emitter is REAL; two pre-existing compile
   bugs EN-a/EN-b discovered; S.F3 PROMOTED).
7. **SPEC-v3** — Pass-2 synthesis, all probe adjustments absorbed (SPEC §9 addendum).
8. **Re-critique: 11×100%** (`audit/pass2/recritique/`) — every critic returned an
   empty blocking list. The only remaining open items are the §2 owner rulings below.

**Pass-3 — three targeted probe-and-design loops** (`audit/pass3/`), executed AFTER
the SPEC converged, to de-risk the plan's three highest-uncertainty surfaces with
live prototypes rather than paper. Each is a standalone audit record; an implementer
consumes the folded wave text, not the loop:

9. **The SceneStage design loop (band S.E) — converged 100/100 over a 3-round Fable
   design loop.** A **first-principles DK-64 stage** was designed
   (`audit/pass3/stage-design-v1.md`) and prototyped LIVE
   (`audit/pass3/stage-proto-v1.md`) in a kept worktree, then run through paired
   design + technical critics (`audit/pass3/stage-critique-design.md` /
   `stage-critique-tech.md` — **70 / ~60**) → **v2**
   (`audit/pass3/stage-design-v2.md` / `stage-proto-v2.md`) → re-critique
   (`audit/pass3/stage-recritique-design.md` / `stage-recritique-tech.md` —
   **88 / 90**) → **v3** (`audit/pass3/stage-proto-v3.md`) → **final 100 / 100,
   FROZEN** (`audit/pass3/stage-final-design.md` / `stage-final-tech.md`). The **H1
   stale-arm class is cured** (browse verbs LOCKED during `committing`) and
   **adversarially proven** (the A–G driver; clause G = a real
   pointer-drag-during-committing that the ring locks out). The frozen v3 build IS
   the binding S.E wave spec — first-principles, superseding the p05 salvage-only
   framing (p05 remains the mechanical rebase substrate, not the design). Kept
   prototype worktree: `.claude/worktrees/wf_2fbb9dbc-c40-1` (drivers under
   `demo/stage-proto/gates/`; run instructions in `stage-proto-v3.md`).
10. **ci-fix-proto** (`audit/pass3/ci-fix-proto.md`) — the p12 CI cause-fixes
    implemented as wave-ready diff shapes: **4 cures PROVEN GREEN** — `styling-idioms`
    (one CSS rule), `pin-ledger-current` (JSON refresh to 5.1.0/1.2.0/0.13.0),
    `demo-usability` X-6 (static parser re-point), and the DM-13
    `engine-no-throw-on-play` shared value.js-subpath importmap harness fix (which
    also discharges DM-11b's importmap ROOT — 3 synthetic arms RED→GREEN) — plus **2
    genuine behavioral residuals precisely LOCATED** (DM-14 spring pause/resume,
    seam pinned to `useAnimationGroupPlayback.toggleAnimationGroup` × the
    `useContractAnimGroup` synthetic `started=true`; and the DM-11b `[real-cube]`
    cold-path), both correctly OUT of static-diff scope → the S.A0(6)/cold-entry
    wave. p12's fix-by-cause / zero-device-dependence model holds; the S.A0(4)
    importmap prescription is refined (serve BOTH deps' full dist subtrees + an
    extensionless-`.js` subpath fallback).
11. **en-fix-proto** (`audit/pass3/en-fix-proto.md`) — the two P2-2 compile bugs
    PROVEN as wave-ready diffs: **EN-a** (`serializeEasing` registry-name → the
    universal `linear()`-densify CSS twin, a re-parse fixpoint) and **EN-b**
    (`compileChild` mixed-track densify body-drop → the percentage-keyed
    `densifiedKeyframesBlock` merge). A browser-parse oracle (`test/en-fix-oracle.test.ts`,
    Chromium) REDs pre-fix on BOTH signatures and GREENs post-fix; `check:lib` + all
    six compile gates + 71 targeted tests pass. Confirms C-25's S.B3 home and the
    browser-harness tier for the EN-a clause (jsdom cannot see the bug).

Every critic prune survives in §8 Recorded-future — nothing silently vanishes.

## 1. Charter (SPEC §1)

Tranche S is the **honesty-then-altitude tranche**: it makes the repo's own
instruments tell the truth again (master CI has been red on every push since Tranche
K; the deploy-of-record is dead; the authoritative library map documents a tree that
no longer exists), and then — on top of a truthful substrate — performs the deep
structural work R only top-partitioned, resurrects the one first-class owner ask that
has died three times (the theatrical scene-switcher), and lifts the library to the
mid-2026 platform frontier (View Transitions, SplitText, `@starting-style`,
`animation-trigger`) in the one way no peer can match: every uplift compiles back to
zero-runtime, current-spec CSS through the round-trip engine (r5).

S folds **every** open deferral and chronic into a terminal home — a wave, a ratified
KILL, or an explicit owner HANDOFF (the fold ledger in `PROGRESS.md` has no
un-dispositioned rows; "terminal" is defined structurally by ruling C-20 — a
deterministic re-shaped gate or a ratified KILL, never "observe-in-CI"). S ends the
VERIFY-ONLY perpetual carry (DM-11 has ridden ten tranches on serial re-affirmation —
r2 Part IV). S applies "NO legacy anywhere" with teeth: the zombie `animate.ts`
cluster, the shadcn islands, the dead devDependencies, the stale era-narration —
deleted or enforced by born-RED gates, not rubrics. S rewrites the demo's altitude
(the `app/` grab-bag, the buried state layer, the misfiled `@/` modules, the
playground's identity) and cures the two systemics every design lane independently
found: the mobile bottom-sheet occluding each scene's own thesis (probe-cured: 12.1%
→ 72% stage visible, p10), and the hidden-affordance layer sealing the demo's best
interactions behind undiscoverable gestures.

**The keystone's causal model, corrected (p12).** SPEC-v1 framed the master-CI red as
"two genuine source defects + a device-dependence plane." p12 refuted that model by
reproducing **every sampled red on fast macOS** (11 gates verified; true
device-dependence render-races = **0**). The red plane is a **fix-by-cause surface**:
genuine source (2) + genuine demo/born-RED (5) + one shared harness importmap bug
(2 gates, one fix) + one gate-staleness false-positive + the LoAF exit-code decouple.
S.A0 is accordingly a **cause-shaped fix-by-cause sweep** whose gate is
green-modulo-an-enumerated-born-RED-backlog (`waves/S.A.md`, the S.A0 section). The r8-F1 lesson ("a
runner-red mislabeled as ENV") is live, not historical — DM-11b and DM-14 were two
fresh instances inside SPEC-v1 itself.

**Why S is broad and not split (the T11 burden, stated).** r2 Part V's law is that
only narrow, measure-first tranches went uncorrected; S sits dead-center in the risk
signature (breadth + chronic-folding + a headline close). S is nonetheless not split
into an honesty cut (A/B/C) and an altitude cut (D/E/F/G) because: (a) the altitude
bands' born-RED gates are only *declarable* against the reformed tier taxonomy and
FROZEN-set authorization S.A4 creates — splitting would leave them undeclarable and
re-create a two-tranche carry of exactly the demo debt S terminates; (b) the
compensators are now **structural, not cited**: the keystone gate is cause-shaped with
masking forbidden, S.Z2 re-executes every closure oracle, S.Z3 re-gates
master-CI-green on the FINAL SHA, and the FROZEN discharge is machine-distinguishable;
(c) breadth was actively de-risked in this pass — S.G4 (ten easter eggs) and S.H3
(Pratt) are de-scoped to §8. The owner may still order the split; the option is
recorded in §2 below.

**What S is NOT:**

- **Not implementation.** S is DEVELOPMENT ONLY (see the header block).
- **No bbnf-lang.** The parse-that dispatch (band S.H) is combinator-tier only;
  grammar-DSL work is a separate session's job (owner directive; r6).
- **No glass-ui writes.** All glass-ui change flows through the glass-ui repo as
  owner-domain handoffs. kf consumes **published artifacts only** — and glass-ui
  5.0.0 does not exist yet (BG ≈110 waves + BH ≈30 waves are dev-complete, unbuilt —
  r7 B-1). The consume-edge wave (S.E8) is specified now and FIRES only when the
  joint 5.0.0 publishes; tilde-pin discipline preserved (never caret).
- **Exactly TWO external consume-edges, named (T12, revised).** (1) **S.E8** —
  third-party (glass-ui 5.0.0); may close S as a structured HANDOFF, in which case
  fold rows 51/52/53 are recorded as an **explicit non-terminal RESIDUAL CARRY**,
  never presented as terminals. (2) **S.H4** — the owner-controlled parse-that 1.0.0
  publish-then-re-pin; its gates are **born-SPECIFIED** and fire at the impl drive's
  publish step. SPEC-v1's "the glass-ui edge is the only externally-gated wave" was false and is
  corrected throughout (sh-parse-that D4). No other wave may acquire an external
  dependency without an owner ruling; S.C3b (menubar) is explicitly forbidden from
  external gating.
- **No quick solutions.** Where a lane offered a patch and a transposition, the plan
  takes the transposition (service-locator → ownership inversion, a06;
  sheet-occlusion → the probe-proven stage-visibility contract, p10 — not ten
  per-scene CSS nudges).

## 2. OWNER RULINGS — the tranche's open decision points (SPEC §6.3)

> **These four pre-booked rulings are the ONLY open items in the plan** (both Pass-2
> probes returned; no probe work remains before impl authorization). Each is
> surfaced, not glossed; defaults are stated. They land where noted — none blocks
> the start of the drive except the breadth ruling.

1. **The version ruling's two inputs (lands at S.Z3; sz-B8).** (i) S.B6's
   `= any → = Vars` d.ts narrowing is source-breaking for consumers who passed
   arbitrary property bags — minor or major? (ii) Does the 126-leaked-private
   API-Extractor strip count as "published-surface removal" for the C-18 changelog
   gate? **Default: additive-minor**; any surface removal rides a MIGRATION doc per
   C-18.
2. **The S.B6 loader-collapse option (p07; the owner-facing chunk-graph question).**
   Collapsing `loadAnimationEngine` onto `import("./engine/public")` is behaviorally
   neutral (−100 LOC, −6% JS bytes, 23→5 dist files, ONE 97.32 kB engine chunk,
   drift-proof by construction) at the cost of foreclosed partial-engine
   code-splitting for a consumer that does not exist today. The TYPE-diff drift gate
   ships regardless; **the collapse ships only on owner approval.**
3. **The "SOTA both repos" reading (x1-#6).** The plan serves kf (S.F) + parse-that
   (S.H), matching the r5/r6 lane structure — **the supported default**. If the owner
   meant the full constellation, a value.js SOTA lane is a missing band (not added
   speculatively — x1 prune).
4. **The breadth ruling (x2 §5).** §1 states why S is not split
   A/B/C-then-D/E/F/G; **the owner may still order the split** — recorded as an
   explicit pre-impl decision point.

## 3. The evidence synthesis (SPEC §2.1)

The fifteen load-bearing, post-probe convergences the plan is built on:

1. **R is substantively honest, with named residue.** The 32-lane audit re-verified
   R's headline claims: the 12-directory partition is real and correctly zoned (a02),
   the god-class carves are genuine (a03, a04), the cycle ring is broken (a06),
   scene-fusion is honest (a10), the keystone override-deletion is total (a01), perf
   is preserved (a32). The residue is *named and bounded*: the zombie `animate.ts`
   (a09, a20, a29, r2 F6), the toothless demo arm of `proof:no-silent-fallback`
   (r2 W-weak-1), the never-authored `proof:engine-seam-split` (r2 W-weak-3), the
   post-close "R-fallout" commits (a15), and six files parked 1–12 lines under the
   500L ceiling (a05, a16, a17, a19).

2. **Master CI has been RED on every push since Tranche K (2026-06-16); the
   deploy-of-record is dead — and the red plane is DETERMINISTIC, not
   device-dependent (p12).** Neither Q (5.0.0) nor R (5.1.0) ever produced a green
   master CI; every `workflow_run` deploy since K is skipped; both tranches shipped
   via manual `workflow_dispatch` (r8 §4, a28). p12 reproduced every sampled red
   locally on fast macOS. The verified taxonomy of the 14-blocking-red plane
   (11-gate sample):
   - **Genuine source (2):** `proof:styling-idioms` (orphan `.morph-ghost--from`,
     `MorphTarget.vue:71` — one line) and `proof:pin-ledger-current` (PIN-LEDGER
     frozen at 4.4.0/1.1.0/0.12.0 vs installed 5.1.0/1.2.0/0.13.0 — a31, CRITICAL).
   - **Shared harness importmap bug (2 gates, ONE fix):** DM-13
     `engine-no-throw-on-play` AND DM-11b `subject-animates` both ship a probe HTML
     mapping only bare `@mkbabb/value.js`; the lazy engine chunk imports
     `@mkbabb/value.js/math` (the value.js-O subpath split) → hard in-browser resolve
     failure. DM-11b's 30 s-timeout signature is a *swallowed* deterministic
     module-load throw, not a render race (p12 §3.1).
   - **Genuine demo/source born-REDs (5):** DM-14 `fsm-suspend-resume-live` (the
     spring scene does not pause — `springPausedAfterClick=false`; a real
     pause/resume-continuity defect, NOT a timing calibrate), `cold-entry` (resume
     no-op on a never-started group, `scenePlaybackAdapters.ts:76-79`),
     `drag-gesture` (`userSelect:auto` mid-gesture), `easing-sidebar-minimal`,
     `scene-perf-budget` A2 (AmigaScene missing `setPixelRatio(min(dpr,2))` — a
     static source assertion), plus `icon-paint-live` (`::view-transition-*`
     residue; glass-ui-touching — confirm the KILL target's home).
   - **Gate-staleness false-positive (1):** `demo-usability` scans `router.ts` for
     literal `name:"…"` strings while R.W5 generates routes as `name: s.id` — a
     green demo red on the gate's own obsolescence (p12 §3.3).
   - **Exit-code plumbing (1):** the LoAF bench step exits 1 with a GREEN metric.
   True device-dependence render-races in the verified sample: **zero.** The
   device-dependence *apparatus* concern (~50 chromium launches under a 50-minute
   ceiling) is real and is cured structurally by S.A2's harness net-deletion — but
   it is not why the gates are red.

3. **The zombie `animate.ts` cluster is R's own instance of the failure mode R
   condemned in Q.** 213 LOC, zero importers, excluded from every published surface,
   kept alive by two self-referential test files and still documented as "the
   single-call front door" in both CLAUDE.md files (a09, a13, a14, a20, a29, r2
   finding 9). Five lanes converge on DELETE (→ S.C1).

4. **The doc-authority inversion.** R.W7 formally delegated "authoritative per-file
   inventory" status to `src/animation/CLAUDE.md` — a file untouched since before
   R.W1, describing the deleted flat tree, the renamed `Animation` class, the excised
   `animate()`, a dead `ScrollTimeline` export, and a `parse-that` dependency that no
   longer exists (nine lanes independently hit this file). Root CLAUDE.md compounds
   it ("seven-zone" vs 12 shipped dirs; `waapi/` invisible; a wrong HEAVY export
   list). Nothing gates any CLAUDE.md against the tree (→ S.A5 gate-first, S.B8
   regen-last).

5. **Carve-to-ceiling vs carve-to-cohesion.** R's decomposition is real but the
   *stopping rule* was the 500L gate, not module boundaries: seven files landed at
   488–499L, commit subjects literally naming the arithmetic ("628→500") (r1, a05,
   a16, a17, a19). One carve (compile/easing-option) shipped as pure re-export
   ceremony (a18). S's rule: **cohesion-first; 500L is a tripwire, not a target**;
   the decomposition gate gains a no-re-export-bridge clause; and no born-RED gate
   may carry a numeric line-count as its GREEN criterion (line counts are observed
   tripwires — see S.D1's de-numericized shell gate).

6. **~54 gates ossify the exact demo layout S intends to rewrite — but the two
   halves are now probe-separated (p04, p08).** The proof roster (190 keys,
   verified) is coverage-airtight, but ~51 keys are pixel/layout-level locks over
   the current demo; the "correctness" tier is defined by harness (opens-a-browser)
   not severity; and the roster simultaneously *forbids* a scene switcher
   (`proof:scene-colocated` ASSERTION 3) and *requires* one
   (`proof:scene-switcher-mobile`, a zombie masked by continue-on-error) (a27, a23,
   r8). p08 confirms the three-tier re-taxonomy lands without breaking
   `proof:ci-coverage`'s 15-clause airtightness (no staging needed), given a
   **5-artifact lockstep co-edit** (S.A4). p04 proves the FROZEN appearance set is
   **structurally immune to source moves** — the demo *file partition* reds only ~7
   source-path gates + one shared driver, all mechanical; the FROZEN set reds only
   on *visual/DOM* changes (S.E/S.G).

7. **The mobile-sheet occlusion is systemic, and the cure is probe-PROVEN (p10).**
   All ten design lanes found the bottom sheet occluding the scene's thesis. p10
   landed the one-contract cure in a worktree (78+/18− over 6 files): peek-at-rest +
   a mode-declared reserved stage band (`--stage-strip`/`--stage-reserve` tokens),
   measured 12.1% → 72% stage visible at rest, all five sheet-coupled gates green
   after one gate re-arm. Three binding lessons: the re-opener chain is
   **three-headed** (store default + `useControlsLayout.ts:64` auto-open projection
   watch + two scene pokes); the open intent must stay **ONE writable axis** (a
   per-layout fork reds `proof:live-session-mobile`'s touch battery — observed, 3
   clauses); and stage **MODES**, not scenes, declare the band (both worst scenes
   passed on mode defaults; per-scene declaration is the unused escape hatch).

8. **The hidden-affordance systemic.** The demo's best interactions are sealed:
   cube's entire gesture grammar is invisible; spring's derby and easing's gallery
   are dblclick-only (nonexistent on touch); sequence's headline drag-to-retime has
   no tell; amiga's boing threshold is unknowable (design:*). The cure is a
   **machine-readable per-scene gesture manifest** (the census source-of-truth) with
   an on-stage tell + a browser-actuated touch path per entry, pinned to reliable
   primitives (never native dblclick synthesis) — S.G3. The per-scene easter-egg
   layer is de-scoped to §8 as pure altitude atop a red substrate (x2).

9. **The scene-switcher shelf is a treasure, and the salvage is probe-EXECUTED
   (p05).** `n-stage-impl` (+4188 LOC) solved the two named failures structurally —
   one `SpringProgress` over ring angle and one shared-`RAFPlayback` LOD clock — and
   got the DOM position right (Teleport-to-body sibling, OUTSIDE the `scene-subject`
   VT). p05 lifted the 18-file shelf, re-pathed it onto the fused tree (**5 files /
   23 import lines — pure path substitution**), and drove `tsc` 16×TS2307 → 0 and
   `proof:boundary` → PASS. Zero API-signature drift; Q5's FAILURE branch (fusion
   severed standalone Targets) does NOT fire — the shelf already carries the
   PROP/INJECT adapter layer and its dependencies survived fusion. Two honest
   caveats: the registry froze at 7 scenes (`morph` absent — one row + one
   `previews/morph.ts` adapter are **authored-new**, not re-pathed), and the
   project's `check` is bare `tsc` (no `vue-tsc`) — the `.vue` render path is
   exercised only by the browser-actuating gate.

10. **The demo's shared library was never partitioned — and the D2 carve is now
    probe-VALIDATED (P2-1, confirms-spec).** R fused scenes but declared the
    74-file / 10,093-line `animation-controls/` monolith "do not touch" by fiat (no
    importer census); the demo's global state layer is buried four levels deep; four
    "shared" modules are single-area-private (~3,076L misfiled); `demo/app/` is a
    mixed-concern drawer (a23, a24, r4). p04 validated the **D1 app/ partition**
    (mechanical; ~38 files / ~60 lines; the one non-alias edit is `scenes.ts`'s
    16-line depth bump). **P2-1 executed the D2 core** (stores hoist + the transport
    peer move + the ControlsPaneWrapper seam analysis): `check`/`gh-pages`/58 tests
    green; **every move-caused red is path-anchored — no gate encoded a structural
    assumption the move invalidates by meaning; no re-inventory of `@/` is
    triggered.** The binding cost model: the two operations have **opposite fallout
    profiles** — the stores hoist is HIGH source (~46 edit sites) / ~ZERO structural
    gate reds (all consumers are `demo/`-rooted walkers or comment refs), while the
    transport peer move is LOW source (**1 real external import edge — the a24
    census over-counted comment/JSDoc mentions as imports**, a method residue beyond
    p04's missing-tiers) / **HIGH gate: ~7–10 gates hardcode the shell paths as
    curated scope-file SETS invisible to the census** — D2's real cost is
    gate-repoint-dominated (**~3–4 days total, LOW risk**). Two more binding facts:
    `tsc` does not type-check `.vue` SFCs (two broken `./stores` imports passed
    `check` and were caught only by `gh-pages`), and the peer move is blindspot-safe
    only while structural walkers root at `demo/` — `proof:decomposition` roots at
    `animation-controls/` (`:79`) and must be arming-audited (T7).

11. **The library's remaining debt is boundary + layout, not correctness — and the
    B-band is the best-probed in the plan (p01, p02, p03, p07: three confirms, one
    adjusts).** Zero laziness casts, one dead export in 268, LIGHT invariant intact,
    hot paths byte-preserved. What remains: the `constants.ts` seam (p03: the split
    is clean; the win is realized only by repointing the **10 LIGHT importers** to
    `constants/types` — "~55 consumers" was ceremony overcount); PlaybackState
    owning plumbing but not the FSM (p02: the FSM is a **public, externally-written
    surface** — 4 zones + 107 test sites + the demo's `contractAnim.t =` writes — so
    the honest goal is **single-STORAGE with accessor delegates**, and the class
    *grows* 442→455L); a service locator mislabelled DI serving ONE demo caller; the
    `./engine` mirror with no drift gate (p07: the loader collapse makes a
    runtime-vs-runtime key diff **vacuous** — the honest oracle is runtime keys ⊆
    the `AnimationEngine` d.ts TYPE keys); and the un-sub-zoned `engine/`/`compile/`
    interiors (p01: `engine/css/` is real cohesion; the hidden cost is a **10-site /
    9-script gate co-edit**, and only `proof:all` catches a partial edit).

12. **The VT emitter is REAL and thin (p09, live Chromium 149).** The existing
    `compileToCSS` per-child pipeline is byte-reusable; the only hardcoded piece is
    the rule selector at `backward.ts:339`. Three binding design facts: the input is
    a **name-keyed role spec** (a group has no old/new axis); the **group pseudo is
    a third, timing-only, mandatory-by-default emission surface** (omitting it ships
    an observed 250ms/ease temporal incoherence); and four VT-specific refusals
    extend the inherited taxonomy. Q9's FAILURE branch (demote to dispatch-only) is
    dead.

13. **The packrat arming registers (p11).** 14–18% throughput on the realistic
    short-value corpus, ~34% less retained heap, mechanism-proven,
    soundness-preserving (left recursion still works armed). The retained-heap gate
    is the correct, stable oracle; a throughput-% gate is a probe-confirmed flake
    trap (workload-dependent: <2% on long strings). The chain() falsy-seed bug is
    confirmed and cured; the fix's *semantics* required a ruling (C-16).

14. **The close band had re-committed the r2 catalogue on itself (sz-close, 33%).**
    SPEC-v1's recap gate checked row-*shape* not cited-oracle-*truth*; the template
    gate's scope was prose over non-uniformly-parseable mandates; and T10
    (full-roster green) collided with T12 (an external HANDOFF gate lives inside
    `proof:all`), making the close literally unrunnable. All repaired structurally
    in band S.Z: oracle-resolving recap clauses, a partitioned template gate with a
    per-mandate plant table, the **closeable roster** definition (C-21),
    closure-oracle RE-EXECUTION, the master-green-on-FINAL-SHA precondition, and a
    post-close fallout guard.

15. **The entry emitter is REAL (P2-2, live Chromium 149) — and the probe surfaced
    TWO pre-existing library-correctness bugs on the SHIPPED `@keyframes` surface.**
    A hand-compiled `@starting-style` + `transition-behavior: allow-discrete`
    artifact drove a native `display:none → block` entry (the `@starting-style`
    values ARE the observed t=0 style; the kf spring `linear()` matched the
    stop-lerp to 6 decimals) AND a display-held exit (mid-exit computed
    `display: block`, flip at transition end; `overlay` held in the top layer for
    popovers). The FAILURE branch is dead for the two-endpoint class. **Binding
    design fact:** the emitter is a **declared-endpoint projection over the
    `format.ts` substrate** (`declaredKeyframeBodyFor` + a twin-fixed
    `serializeEasing`) — NOT a post-transform over `compileToCSS` output (that
    reading is REFUTED: the compiled artifact came out color-only and 16-stop). The
    two discovered bugs, live-proven and independent of F3: **(EN-a)**
    `serializeEasing` (`format.ts:43-58`) emits registry names (`ease-out-cubic`)
    that are not CSS `<easing-function>`s — the browser drops the whole declaration
    (`animation-name: none`), so the shipped `@keyframes` artifact is
    **browser-dead for most registry easings TODAY**; kf's own parser happily
    re-reads its registry name, which is why the round-trip gates structurally
    cannot catch it — the gate needs a **browser-parse clause**. **(EN-b)**
    `compileChild` swaps the WHOLE block for the densified one
    (`backward.ts:289-293`) while `densifyColorBlock` builds from color declarations
    only — a mixed `opacity + transform + color` track compiles (eligible, zero
    refusals) to a `@keyframes` that animates ONLY the color; the `bodyByStop`
    override `format.ts:212-222` was designed for exactly this and `compileChild`
    doesn't use it (this also overturns a18 F3's "declaredKeyframeBodyFor is dead" —
    the export is the EN-b/EN-c substrate). Also inverted: `perceptual-oklab` is NOT
    a refusal on the transition surface — CSS Color 4 interpolates non-legacy colors
    in **Oklab by default** (proven byte-exact), so `oklab()` endpoint
    canonicalization gets kf's default space natively, zero stops.

## 4. The rulings registry — C-1..C-25 (SPEC §2.2; binding)

Every conflict the lanes, probes, and critics surfaced was arbitrated. These 25
rulings are binding on the impl drive; wave specs cite them by number.

**C-1. `engine/css/` — a03 (NO) vs a17 (YES) + owner seed. RULING: YES — create
`engine/css/`** (with the `css-metadata.ts → metadata.ts` rename). Probe-confirmed
(p01: real cohesion — one importer, zero bridges, source churn 1 site; every Q1
SUCCESS criterion met). The measured cost adjustment is binding: the move is a
**10-site / 9-script gate co-edit** (7 scripts anchor on `css-animation.ts`, 2 on
`css-metadata.ts`), and the wave gates on **`proof:all`**, not the Q1 subset (a wave
running only `check:lib + build + proof:engine + proof:decomposition` goes green
while 8 gates are red). Compile-side CSS-twin/serialization concerns stay in
`compile/`.

**C-2. `compile/easing/` — REJECT the directory; KILL the re-export ceremony.**
a18's dependency-graph analysis (the real seam is FORWARD vs BACKWARD, zero
forward↔backward edges) is the cohesion argument. `compile/backward/` IS created
(4 files, 1,300+L); the two easing files stay flat; the bridge through
frame-compiler dies.

**C-3. `animate.ts` — DELETE** — file + both test files + the
`proof:animate-orchestration` gate + every doc mention. Owner-ratified at R on 0/32
call-site evidence. Semver debt paid separately: backfill `docs/MIGRATION-5.1.0.md`;
generalize the changelog gate with the specified diff mechanism (C-18).

**C-4. Playground — FOLD as `demo/scenes/compose/`, probe-confirmed (p06).** The
fold builds, code-splits to a lazy chunk, mounts at `#/compose`, renders with 0
console errors; neither Q6 FAILURE branch fires (the machine is `SceneId = string`;
asset-manager drags no playground-only deps; `resetAllStores` already covers it).
The binding cost adjustment: the gate blast radius is a **six-item touch set**, led
by `SCENE_GATE_META.compose` in `scripts/lib/demo-driver.mjs` (without it all **82**
demo-driving gates throw at module load), and `proof:compose-scene` **closes after
S.G**, not at D3 (compose auto-enrolls in the occlusion/font/stage-visible runtime
fleet).

**C-5. `internal/` is the leaf tier, not a zone.** Delete the ceremony barrel
(0 consumers), exclude `internal/` from ZONE_DIRS *by documented design*, add
`waapi/` to ZONE_DIRS, derive the flat-sibling FAMILY set from the directory
listing. The `leaf/` rename is REJECTED.

**C-6. The scene-switcher gate contradiction.** Both stale halves die in S.A:
ASSERTION 3's carousel-absence clause is deleted (keep location/no-climb);
`proof:scene-switcher-mobile` is retired and reborn as the stage band's born-RED
acceptance gate (`proof:scene-stage-commits`), targeting `frontIndex`/`spinning` +
commit-on-settle.

**C-7. Scene-switcher substrate — DM-24 REVIVED; salvage probe-EXECUTED (p05).**
The `n-stage-impl` shelf rebases mechanically (5 files / 23 lines); guardrails
absolute: one nav authority, chrome outside the `scene-subject` VT,
commit-on-settle wired. The bespoke dock-arrow swap is NOT resurrected.
**(Superseded at pass-3 — `waves/S.E.md`/§0-9:** the converged design has **no interim
dock spin controls** at all; the ring's spin arrows are **stage-internal**, the single
nav authority is the dock **pill** opening the stage (the S.E7 rewire + scene-Select
retirement), and BG's dock morph at **S.E8** is an OPTIONAL pill-open refinement, NOT a
retirement target — nothing is retired onto it.)

**C-8. Doc-regen timing — gate-first, regen-last.** S.A5 lands born-RED
`proof:claude-paths-live` + hot-fixes the actively dangerous lines; the full
`src/animation/CLAUDE.md` rewrite lands at S.B8 against the final tree.

**C-9. `adapter.ts` home — `compile/adapter.ts`.** Its output feeds
`FrameCompiler.parse`. `validate.ts` STAYS at root as a HEAVY cross-zone facade
verb.

**C-10. colorTail benches — budgeted device-independent ratios in S.F5a.**
Observe-only was correct at Q's measure-first moment; insufficient for S's
SOTA-perf claims. This ruling also governs S.E: **no raw absolute fps threshold may
be a CI closure anywhere in the plan** (S.E6's ≥55fps is demoted to a declared
local chrome-devtools-mcp acceptance or converted to a budgeted ratio).

**C-11. `proof:engine-seam-split` — formally KILLED.** Superseded by proof:engine's
body-span clause + the S.B2 recursive-scan fix + the no-re-export-bridge clause.
Recorded in the S ledger.

**C-12. glass-ui pin — hold ~4.0.x through S development; consume-edge fires only
on the joint 5.0.0 publish.** Interim 4.2.0 catch-up REJECTED. Never caret. The
stale MEMORY "specular=off" expectation is retired at S close. **Amended by C-20:**
if 5.0.0 does not publish before S close, rows 51/52/53 are an explicit
non-terminal RESIDUAL CARRY, and dock double-click carries a kf-internal
contingency fallback.

**C-13. Speculative LIGHT exports — forced to a decision inside S, no carry.**
Pinned (se-B7): the Oscillator decision lands in **S.G2** (ONE wave: build the
promised demo home or strip the fictional header and ledger it as an intentional
public leaf); the `reseatToSpring`-vs-`decayRest` bench lands in **S.F5a**. Fold
row 56 aligned.

**C-14. "Refined, not abrogated" vs "totally re-write" — per-wave mode
declaration.** Every S wave header states REWRITE or REFINE. Structure/layout waves
default to REWRITE; behavior-preserving zones verified honest by the audit default
to REFINE with explicit do-not-touch lists.

**C-15. The PlaybackState goal is single-STORAGE, not single-writer (p02).** The 8
FSM fields are a public, externally-written surface (`group/`×4, `sequence/`×2,
`ingest/`, `waapi/`, 107 test sites, the demo's `contractAnim.t =`). The
non-breaking fold is accessor delegates over a `_playback` backing store; the
honest born-RED clause is *"no FSM field is DECLARED on the class body (accessors
only)"*. The literal single-writer hard fold is **booked as a FUTURE BREAKING
wave** (34 files; requires a public `seek(ms)` verb + MIGRATION; collides with
S.Z3's additive-minor default) — explicitly out of S scope (§8).

**C-16. chain() semantics — Option A, truly additive (sh-D1).** The live code
short-circuits on error BEFORE `chainError` is read, so `chainError` is
dead-on-error today and **no caller passes `chainError=true`** (verified: 0 hits in
value.js and parse-that's own src). r6's proposed `!state.isError || chainError`
would silently resurrect a live continue-on-error path that nothing uses and the
named regression test never exercises. **RULING:** fix only the falsy-seed bug —
`if (state.isError) return state; return fn(state.value).parser(state);` — and
**retire the now-moot `chainError` param in the same 1.0.0 breaking cut**
(documented removal). Gate: the `0`/`''`/`false`-seed regression test
(red-then-green) + a genuine-error short-circuit test + the recorded 0-hit caller
scan.

**C-17. The demo composable naming convention is `use<Name>Demo` — ruled NOW,
before D3.** The stage registry's INJECT-adapter contract already consumes
`use<Scene>Demo` (p05 F4); p06 recommends `useComposeDemo.ts`. S.D3 registers
compose as `useComposeDemo.ts` from birth; S.D4 executes the fleet-wide renames for
the `use<Name>Animations` stragglers. (sd-#8.)

**C-18. The generalized changelog gate's diff mechanism (sc-§4).**
`docs/published-surface.md` is a single current file with no per-release history.
**RULING:** the gate checks out the previous published tag's copy
(`git show v<prev>:docs/published-surface.md`), diffs against HEAD, and REDs on any
removed row lacking a matching `docs/MIGRATION-<new>.md` entry. The previous tag is
resolved from npm `dist-tags.latest` (falling back to the highest `v*` tag). No
archived snapshots needed.

**C-19. The menubar migration target (sc-§3.1).** glass-ui 4.0.1 exposes
`./dropdown-menu` / `./context-menu` — there is **no menubar surface**, so
SPEC-v1's "born-RED HANDOFF if the surface is missing" would have fired and
silently created a second external gate (T12 violation). **RULING:** S.C3b migrates
KeyframesEditor's menubar to glass-ui **dropdown-menu** (present in 4.0.x; the
menubar→dropdown UX remap acknowledged), with the a24-F6 relocate-in-place fallback
if the remap proves unacceptable at impl — both paths internally closable; gating
menubar removal on a missing external surface is forbidden.

**C-20. "Terminal" is defined structurally (x2-#5, sa-D2).** A chronic/deferral
disposition is terminal ONLY if it is (a) a **deterministic re-shaped gate** —
device-dependence folded OUT so the gate REDs honestly on any runner — or (b) an
owner-**ratified KILL** with a re-run witness. "Observe-in-CI", "hard-on-device",
WATCH, and re-verify verbs are NOT terminals (they are the DM-11 ten-tranche
mechanism relabeled). Every terminal disposition is re-derived from a **reproduced
signature**, never inherited from this plan's pre-written guess (DM-14 is the
standing proof of why). T3's deferral-verb meta-gate extends to the S ledger's
disposition column.

**C-21. The closeable roster (sz-B4; T10 ⊥ T12 reconciled).** S.Z3's from-clean
full-roster run and T10's "no FINAL table smaller than the full roster" are
satisfied against the **closeable roster**: the full roster MINUS owner-ratified
external HANDOFF gates (each named by its ledger row), with those gates rendered in
the FINAL table as an explicit third state — `HANDOFF — external — row N` — never
omitted. The table still lists every gate; T10's airtightness and T12's escape
coexist in one definition.

**C-22 (REVISED at Pass-2). The F3 emitter — home CONFIRMED, substrate ADJUSTED,
wave PROMOTED (P2-2).** `@starting-style` + `transition-behavior: allow-discrete`
is a **transition-grammar output**, distinct from `compileToCSS`'s `@keyframes`
substrate. P2-2 executed the hand-compile live: **`compile/entry.ts` is CONFIRMED
as the home**, but as a **`format.ts`-substrate SIBLING projecting from the
DECLARED ENDPOINTS** (`declaredKeyframeBodyFor` for the first/last stop bodies;
easing via the EN-a twin-fixed `serializeEasing`) — NOT a post-transform over the
`compileToCSS` artifact (refuted by the EN-b mixed-track bug; unlike p09's VT
emitter, which re-targets the SAME blocks, the entry emitter shares the substrate,
not the artifact). **F3 is PROMOTED from DEVELOP-only to the authored EN-a..EN-d
wave-set** (the two pre-req bug fixes homed per C-25). Refusals live on
`compile/entry.ts`'s own `CompiledEntryCSS.refusals` channel with
`EntryRefusalReason` = 3 inherited + 6 entry-specific (`waves/S.F.md`) —
`perceptual-oklab` explicitly INVERTS to the narrower `entry-color-space` (native
oklab is a feature of this surface).

**C-23. "Consuming area" granularity for `proof:shared-has-n-consumers` (sd-#6).**
**Per-scene counting:** each `demo/scenes/<name>/` is its own area; `app/` is one
area; each `@/` top-level module is one area. A helper consumed by ≥2 scenes is
legitimately shared (so `useRafScene` — easing+spring — stays in `app/runtime/`); a
module consumed by exactly one non-@ area is misfiled and REDs. Collective counting
(all scenes = one area) is rejected — it would mis-RED legitimately cross-scene
helpers (a24's own census column notwithstanding).

**C-24. G1 ↔ D2 sequencing (sg-§3).** Both waves mutate the same
`animation-controls/` files (`ControlsPaneWrapper.vue` 497L, `useSheetState.ts`,
`useControlsLayout.ts`). **RULING:** S.G1 lands FIRST on the current tree (its diff
is probe-proven, 78+/18− over 6 files); S.D2's carve follows and must re-run
`proof:stage-visible` green on the post-carve tree (T7). DAG: A4 + D1 → G1 → D2.
P2-1 F8 marks this edge **CONFIRMED load-bearing, not relaxable**
(`proof:stage-visible` does not exist pre-G1).

**C-25 (Pass-2). EN-a and EN-b are homed in S.B3 — the compile-zone wave — not in
S.F.** The two P2-2-discovered defects are **library-correctness bugs on the
shipped `@keyframes` surface, independent of F3** (EN-a: registry-name easings
render the compiled artifact browser-dead TODAY; EN-b: mixed tracks silently drop
every non-color property TODAY). **RULING: hoist both into S.B3** rather than
parking them as S.F pre-reqs, because (i) **same-file cohesion** — S.B3 already
rewrites the exact seams (`backward.ts`'s compileChild/densify region via the a18
F4 color-ramp hoist; `format.ts` moves into `compile/backward/`) and landing the
fixes anywhere else would edit the same lines twice across bands (the G1↔D2
collision class C-24 exists to prevent); (ii) **honesty-first sequencing** — a
shipped-artifact correctness defect belongs in the lib track's early wave (B3 is
second in the B chain), not gated behind a SOTA feature band; (iii) the T7 fixture
co-edits (`proof:compile-replay`/`compile-deterministic` change because the emit
changes) are already in B3's blast radius. **DAG edge, stated: S.B3 (carrying EN-a
+ EN-b) ──► S.F3/EN-c ──► EN-d.** Consequence: S.B3's former "delete dead
`declaredKeyframeBodyFor`" item is **REVERSED** — a18 F3's "likely-dead" call is
overturned by P2-2 (F1/F5): the export is the load-bearing substrate EN-b threads
and EN-c projects from (fold row 58 updated).

## 5. Bands + waves — the overview + the DAG (SPEC §3)

The full wave specs — scope items, born-RED gates with witness plans, co-edit sets,
per-wave DAG, verification — live in the per-band `waves/S.<band>.md` files (one
file per band; each wave is a `## S.<id>` section within it). The board and the
chronic/deferral fold ledger (rows 1–74) live in `PROGRESS.md`. Notation carried
from the spec: every wave = scope · rationale · born-RED gate · deps · track · mode
(REWRITE/REFINE); gates are authored in development, planted RED where the defect is
live today, and become the impl drive's board. No gate carries a raw absolute
frame/ms threshold as a CI closure (C-10) or a numeric line count as its GREEN
criterion (§3-5 above).

| Band | Waves | Track | Charter (one line) |
|---|---|---|---|
| **S.A — Truth & Gates (keystone)** | S.A0 · S.A1 · S.A2 · S.A3 · S.A4 · S.A5 | gates | CI green by cause; chronic ledger terminal-ized; demo-gate split + harness net-deletion; deploy-of-record revived; three-tier gate re-taxonomy + the 51-gate FROZEN migration; doc-authority gate. |
| **S.B — Library sub-zoning + boundary** | S.B1 · S.B2 · S.B3 · S.B4 · S.B5 · S.B6 · S.B7 · S.B8 | lib | constants seam; engine/css/ + PlaybackState single-STORAGE + ceiling carves; compile/backward/ + EN-a/EN-b; barrel purity + ownership inversion; the last override deleted; type surface + `./engine` drift gate; test/bench perimeter; the library map regenerated. |
| **S.C — Legacy purge (teeth)** | S.C1 · S.C2 · S.C3a · S.C3b · S.C4 | lib+demo+gates | animate.ts cluster DELETED + hardened orphan walker; no-silent-fallback enforced; dead deps + stale narration gated; menubar → dropdown-menu; dependency posture. |
| **S.D — Demo gestalt** | S.D1 · S.D2 · S.D3 · S.D4 | demo | app/ partition; the @/ state hoist + monolith carve; playground → scenes/compose/; demo taxonomy + docs truth. |
| **S.E — Scene-stage resurrection** | S.E1 (+E1c) · S.E2 · S.E3 · S.E4 · S.E5 · S.E6 · S.E7 · S.E8 | demo/design | DM-24 REVIVED (first-principles DK-64 stage, pass-3 100/100): salvage lift + registry, overlay/lighting/geometry, choreography, the A–G commit funnel, mobile @375, LOD + real WebGL, integration (the gates go real), glass-ui consume-edge (externally gated). |
| **S.F — SOTA uplift: animation library** | S.F1 (VT-a..d) · S.F2 · S.F3 (EN-c, EN-d) · S.F4 · S.F5a · S.F5b · S.F5c · S.F6 | lib | View Transitions; SplitText; entry/exit compilation; animation-trigger; zero-alloc + budgeted floors; bench coverage; Typed-OM verdict + WAAPI densify; honest narrative. |
| **S.G — Demo design refinement fleet** | S.G1 · S.G2 · S.G3 (S.G4 → §8) | design | The stage-visibility contract (probe-proven); per-scene W1 batch with per-item oracles; the affordance layer + touch parity, manifest-gated. |
| **S.H — parse-that dispatch** | S.H1 · S.H2 · S.H4 (S.H3 → §8) | dispatch | Packrat-epoch arming; the 1.0.0 legacy cut + chain() fix; ledger closure + the single publish-then-re-pin (born-SPECIFIED). |
| **S.Z — Close** | S.Z1 · S.Z2 · S.Z3 | close | The total prompt-recap with oracle-resolving teeth; the tranche-development TEMPLATE + re-execution meta-gate; FINAL + version ruling + the keystone re-armed. |

### Band charters

**S.A — Truth & Gates (the keystone band; track: gates).** S.A0 is THE keystone: the
cause-shaped fix-by-cause sweep over the master-CI red plane (p12's taxonomy — §3-2)
that owns the seven enumerated fixes (the one-line `.morph-ghost--from` rule, the
PIN-LEDGER re-author, the LoAF exit-code decouple, the shared value.js-subpath
importmap harness fix greening both DM-13 and DM-11b, the `demo-usability`
staleness re-point, `cold-entry` resume-totality + the DM-14 genuine spring
pause/resume source fix, and the full 159-member non-fail-fast verdict pass) and
declares the **enumerated born-RED backlog** (`drag-gesture` → S.G3;
`easing-sidebar-minimal`, `scene-perf-budget` A2, `icon-paint-live` → S.G2, the
latter with a glass-ui-home check). Its gate is falsifiable both ways: every red
discharged by a named cause verified against a locally-reproduced signature; CI
failing steps ⊆ the backlog; discharge via threshold-loosen / timeout-widen /
`continue-on-error` / observe-reclassification is FORBIDDEN. S.A1 terminal-izes the
chronic ledger under C-20 with the substance clause (the re-shaped
`proof:chronic-closure` REDs renamed-verb dispositions). S.A2 splits demo-smoke into
demo-correctness (blocking, gates deploy) + demo-device-observe, lands the
browser-harness **net-deletion** (ONE shared chromium + one served dist across the
~50-launch surface), and dispositions per-gate through FOUR buckets (genuine /
absolute-threshold / binary-absent / stale-gate) with the hard clause: the split may
NOT green a red that reproduces off-runner. S.A3 revives the auto-deploy-of-record
(timing rides the keystone backlog — expected and recorded, not a slip). S.A4 lands
the three-tier taxonomy via the **5-artifact atomic lockstep co-edit** (package.json
direct `&&` chains; proof-ci-coverage EXCLUDED + the clause-0b three-tier union;
proof-gate-is-runtime retarget + membership-count floor; run-all.mjs:42;
gate-taxonomy.md stale rows), the symmetric mis-tier clause, the
machine-distinguishable FROZEN discharge (migration-to-named-successor or ledgered
KILL — free prose banned), C-6's gate-contradiction kill, and the roster arithmetic
190 → ~138 → ~120; it BLOCKS the FROZEN reds of S.D3/S.E/S.G being declarable. S.A5
lands born-RED `proof:claude-paths-live` + hot-fixes the actively wrong doc lines
(full regen at S.B8 per C-8).

**S.B — Library sub-zoning + boundary hardening (track: lib).** S.B1 splits
`constants.ts` → `constants/types.ts` (LIGHT-pure) + `constants/defaults.ts` + a
back-compat barrel, with the **10 mandatory light repoints** and a FILE-level gate
clause (p03). S.B2 creates `engine/css/` (C-1; the 10-site/9-script co-edit, gated
on **`proof:all`**), executes the C-15 PlaybackState single-STORAGE fold (the class
GROWS 442→455L — so the `engine/animation.ts` 499L and `engine/playback.ts` 498L
ceiling carves are pulled FORWARD from B5 into B2), rules `element-resolve.ts` →
`resolve/`, hoists `public.ts` beside load-engine.ts, and formally records the C-11
KILL. S.B3 creates `compile/backward/`, kills the re-export ceremony (C-2),
re-homes `adapter.ts` (C-9), hoists the loop-invariant 1024-sample color ramp
(~15× fewer samples, replay-equality-verified), and carries the two P2-2
correctness fixes **EN-a** (serializeEasing CSS-twin; born-RED **browser-parse**
clause) and **EN-b** (mixed-track densify body-drop; born-RED mixed-artifact
clause) per C-25, with the T7 `compile-replay`/`compile-deterministic` fixture
co-edits in the same commit. S.B4 does barrel purity + zone normalization + the
**ownership inversion** (excise `KeyframesAnimation.group()`, delete the
group-factory locator, add `AnimationGroup.of()`, migrate the one caller). S.B5
carves the remaining four near-ceiling files at cohesion seams, splits
`presets/classic.ts` (728L), and **DELETEs the last LIBRARY_CEILING_OVERRIDE entry
and, emptied, the Map itself** — completing R.W0's keystone. S.B6 lands the type
surface work (`= any → = Vars`; `@internal` + trimmed roll-up — both version-ruling
inputs, §2) and the redefined **TYPE-diff `proof:engine-subpath-mirror`** drift
gate (p07); the loader collapse stays an owner option (§2). S.B7 brings test/ +
bench/ under typecheck, regroups test/<zone>/, adds the 5 missing scene composable
tests, and owns **KfPillTabs.test.ts + the interaction-axis fixes** (fold row 71;
NOT S.E5). S.B8 regenerates the library map once, against the final tree.

**S.C — Legacy purge, with teeth (track: lib+demo+gates).** S.C1 DELETEs the
animate.ts zombie cluster (C-3) and authors the hardened born-RED
**proof:no-orphan-module** (dynamic-`import()`-aware graph edges; pinned entry-root
set {`index.ts`, `load-engine.ts`, `engine/index.ts`, `engine/public.ts`}; the
`animate(` grep scoped to the front-door symbol with the Element.animate/CHANGELOG
allowlist; re-runs green on the post-B tree per T7) + the C-18 generalized
changelog gate + the MIGRATION-5.1.0.md backfill. S.C2 gives no-silent-fallback
teeth (demo clauses enforced; src-wide deny-pattern with machine-checked `KEEP:`
allowlist; the six demo `as any` sites censused, the §2K row-4 survivor fixed).
S.C3a deletes SPRING_SMOOTH and the 8 zero-importer shadcn devDeps behind the
falsifiability-hardened **proof:no-dead-dependency** (allowlist form primary;
specifier-only matching + config/scripts scanning if generalized), the
dead-identifier narration clause (specific identifiers, never the phrase
"scene-switcher"), and the x1-#4 shadcn census clause
(`cn(`/`class-variance-authority`/`@radix-*` grep empty post-purge); the
discretionary best-effort items are stated, ungated. S.C3b migrates the menubar per
C-19 (dropdown-menu OR relocate-in-place — both internally closable; NO external
gate). S.C4 lands the deliberate dependency bumps (dependency-cruiser 17→18,
fast-check 3→4, @types/node) + the VJS_PARAM_BUG_MAX lifecycle check + the C-12 pin
posture.

**S.D — Demo gestalt (track: demo).** S.D1 partitions `demo/app/` into
`scene/` · `transition/` · `runtime/` (p04: mechanical, ~38 files / ~60 lines; the
five cross-scene files STAY in `app/runtime/`; only `cubeTransformStore.ts` is
evicted → `scenes/cube/`; the one non-alias edit is `scenes.ts`'s 16-line depth
bump; gate/lib path-swaps land in the SAME commit), authors the directional
born-RED **proof:app-is-shell**, and runs **parallel to A4** (p04 F4: D1 reds no
FROZEN appearance gate). S.D2 executes the P2-1-validated @/ partition: the stores
hoist → `demo/@/state/` (HIGH source ~46 sites / ~zero gate), the transport peer
move (LOW source, 1 real import edge / HIGH gate — ~7–10 shell-path scope-set
gates repointed in the SAME commit as authoring
**proof:shared-has-n-consumers**), the ControlsPaneWrapper scoped-CSS/template
split (import-neutral, ~0.5 day), the T7 walker-root arming-audit
(`proof:decomposition` roots at `animation-controls/:79` — named), the bare +
wildcard `@state` tsconfig pair, and the gate run that MUST include `gh-pages`
(bare `tsc` does not check `.vue`); total **~3–4 days, LOW risk,
gate-repoint-dominated**; lands AFTER G1 and re-runs `proof:stage-visible` green
(C-24). S.D3 folds the playground as the ninth scene `scenes/compose/` (C-4;
`useComposeDemo.ts` from birth per C-17) through the six-item touch set
(SCENE_GATE_META.compose FIRST), with born-RED **proof:compose-scene** authored at
D3 but **closing after S.G**. S.D4 executes the fleet-wide `use<Name>Demo` renames,
regenerates demo/CLAUDE.md, and rules terminally: keep `@/`.

**S.E — Scene-stage resurrection (multi-wave; DM-24 REVIVED; track: demo/design).**
**Superseding the salvage-only framing (pass-3, §0-9):** the stage is now a
**first-principles DK-64 stage** — a theatrical barrel-select whose grammar is
"light = life": a **drop-lighting** stack (the tungsten beam + warm pool +
per-scene footlights), **live LOD previews** (one shared `RAFPlayback` clock, the
1-full + 2-flank hysteresis tier), and a **full-3-D ring** (real z-order,
Teleport-sibling overlay outside the `scene-subject` VT). It was **designed,
prototyped LIVE, and converged to 100/100 across a 3-round Fable design loop**
(`audit/pass3/stage-*`; frozen v3 = the binding wave spec); the **H1 stale-arm class
is cured** (browse verbs LOCKED during `committing`) and **adversarially proven** (the
A–G driver, clause G a real pointer-drag-during-committing). The p05 salvage remains
only the mechanical rebase substrate. **One named integration-wave item (pass-3
tech-1, no longer a floating open issue):** wiring the standalone `demo/stage-proto/gates/`
drivers as repo `proof:*` roster entries against served **dist** — and the
`DockSelectTrigger`/dock-pill rewire (a Select trigger that opens the stage; if
glass-ui needs a change it is an owner-domain HANDOFF, never a demo patch) — is the
wave's born-RED **integration-wave** debt, carried into S.E7's integration step, NOT
discharged in the prototype. Charter guardrails, absolute (r7 A-9/A-10): one nav
authority; chrome outside the
`scene-subject` VT (Teleport-to-body sibling); commit-on-settle wired; every
load-bearing motion dogfoods a LIGHT-barrel primitive on RAFPlayback; every atomic
stage verified LIVE against the running demo, never source-shape; PRM snaps every
beat; the shelf's scratch `*.mjs` probes are NOT resurrected — real gates replace
them. **CI-budget accounting (se-B9):** the band adds exactly TWO CI browser gates
(`proof:scene-stage-commits` at E4; the mobile commit gate at E5), both riding
S.A2's shared chromium + served dist (amortized); `proof:stage-geometry` (E2) rides
the same harness; the fps checks are LOCAL chrome-devtools-mcp acceptances costing
zero CI launches — S.E does not re-red the plane S.A0 greens. **The pass-3 rewrite
re-decomposes the band into E1–E8 (`waves/S.E.md` is authoritative).** S.E1 lifts the
cured v3 `scene-stage/` tree from the prototype worktree; the registry enumerates
from `scenes.ts` (all 8 miniatures ship — E1c the compose row is D3-gated); gate:
born-RED `proof:scene-registry-mounts` (each row mounts a live-ticking miniature).
S.E2 lands the lighting/occlusion stack + the live-pinned
rotateX(-15deg)/perspective geometry (NOT re-derived); gate: born-RED
`proof:stage-geometry` (body-level sibling, no `view-transition-name`, matrix within
tolerance, + the during-commit `overlayInDomAtUpdate===false` clause). S.E3 lifts the
choreography whole (the open/fan-in phase machine, `useStageGestures`, the payoff,
the affordance layer); its closure is a LOCAL motion-evidence acceptance (no new CI
launch). S.E4 lands the D1/D2-cured commit funnel + the `stage` VT type; gate:
born-RED **proof:scene-stage-commits** — the A–G adversarial roster (clauses B/G
falsify the stale-arm class). S.E5 is the phone path — the SAME stage, no max-width
fork, no second authority (KfPillTabs removed per se-B6); gate: the mobile commit
gate green at 375px (open→flick→tap→commit on touch). S.E6 hardens the LOD tier and
mounts the REAL Three renderer behind the proven create/dispose/contextlost seams;
gate: the GL-lifecycle clauses (≤1 context ever, `__stageGLLog`) + the LOCAL fps
acceptance (C-10). S.E7 is the INTEGRATION wave — App.vue mount, the dock-pill
rewire + scene-Select retirement, real `useSceneTransition` + warm-then-gate, and
**the gate roster wired for real** against the served dist of the real app (the
born-RED integration debt both critics ruled the wave must own). S.E8 is the
**externally gated** glass-ui consume-edge: fires only on the joint 5.0.0 publish
(pin ~4.0.x→~5.0.0, tilde never caret; the visual re-baseline its own multi-gate
effort; the BG dock morph is an OPTIONAL pill-open refinement — the new design has
no interim dock controls, nothing is retired onto it; dock double-click re-tested
with the kf-internal contingency authored at E7-S10); if 5.0.0 has not published at
S close, E8 closes as a structured HANDOFF and fold rows 51/52/53 are an explicit
non-terminal RESIDUAL CARRY.

**S.F — SOTA uplift: animation library (track: lib).** Selection rule (r5): only
primitives whose kf version is structurally better because the round-trip engine
compiles them back to zero-runtime, current-spec CSS. **Tier note (p08 coherence):**
the band's browser-actuating library-value gates (`proof:vt-roundtrip`,
`proof:entry-roundtrip`, the EN-a browser-parse clause) enroll in the
browser-harness (demo-correctness) chain — placing them in
`proof:library-correctness` would correctly RED under S.A4's symmetric mis-tier
clause. S.F1 is the flagship View Transitions wave, decomposed per p09 into
**VT-a** (LIGHT `orchestration/view-transition/` dispatch with normalized
`ViewTransitionHandle` + flipShared/immediate fallbacks), **VT-b** (the
`backward.ts:339` selector-factory carve, behavior-neutral), **VT-c** (the anchor:
`compile/view-transition.ts`, ~250–300L — name-keyed `VTRoleSpec` input, THREE
emission surfaces with the group pseudo timing-only and mandatory-by-default, the
four VT refusals, surface wiring onto `loadAnimationEngine()` + the `./engine`
mirror + the LIGHT barrel), and **VT-d** (demo dogfood + readme-runs); gate:
born-RED **proof:vt-roundtrip** — structural `getAnimations()` assertions + ONE
settled-rect clause, no per-frame pixel/ms thresholds; cost ~12–14 files
(measured). S.F2 is SplitText (`orchestration/split-text/`; `by:"line"` is
measure-or-refuse; the a11y gate is a browser-actuated computed-accessible-name
equality assertion). S.F3 is the PROMOTED entry/exit compiler (C-22): **EN-c** the
anchor `compile/entry.ts` (~250–300L; the three-rule grammar — base/closed + open +
`@starting-style`; asymmetric entry/exit lists; `display`/`overlay`
allow-discrete on BOTH lists, `overlay` unconditional; `linear()` springs verbatim;
oklab endpoint canonicalization; the `compileToEntry` API with the 3-inherited +
6-entry-specific refusal taxonomy; born-RED **proof:entry-roundtrip** with P2-2's
`live.mjs` as the oracle skeleton — scrub-based, zero frame/ms races; born-open and
exit-hold gate/doc semantics per P2-2 F7) and **EN-d** (the demo dialog/popover
pane + readme claims); deps: **B3 (which carries EN-a + EN-b)**; total ≈20–22 files
across the four EN waves; risk low-medium. S.F4 drives `animation-trigger` through
scroll/scene.ts (native where Chrome 145+ ships, kf ScrollScene everywhere else);
deps: **B4** (the wave that freezes scroll/scene.ts's takeover surface). S.F5a
completes zero-alloc (precompute boxedKeys on SoALayerPlan; the mixed-leaf
proof:zero-alloc clause born-RED today) + converts the 6 colorTail arms to budgeted
device-independent ratios (C-10) + runs the C-13 `reseatToSpring` bench. S.F5b adds
bench/resolve.bench.ts + the cold-import bench, gated via born-RED
proof:bench-taxonomy coverage rows. S.F5c records the **Typed-OM verdict** (default
KILL-with-recorded-bench-measurement; ADOPT only above a pre-stated threshold, as a
separate wave) and ships the WAAPI multi-segment densify as a born-RED extension of
`proof:waapi-adaptive-densify`. S.F6 is the near-zero-code honest narrative wave
(the byte-count claim rides `proof:consume-bundle`, not readme-runs).

**S.G — Demo design refinement fleet (track: design).** S.G1 lands the p10
probe-proven mobile stage-visibility contract fleet-wide: the three-writer peek
cure, the one-open-axis mandate as a gate guard clause, mode-declared
`--stage-strip`/`--stage-reserve` tokens (subject 52dvh, editor/storyboard 26dvh),
the `.controls-pane--open` gate-arming audit, and the layout-invariant born-RED
**proof:stage-visible** system gate (three clauses at 375×667 across all 9 scenes)
that feeds A4's FROZEN migration; deps A4 + D1; **precedes D2 (C-24)**. S.G2 lands
each design lane's highest-leverage refinement as one wave with **per-item born-RED
oracles** (the two correctness items named: motion-path traveller rect ⊂ stage
rect at 375px; square honest controls), plus the A0-backlog discharges
(`easing-sidebar-minimal`, `scene-perf-budget` A2, `icon-paint-live` with the
glass-ui-home check), the C-13 Oscillator decision, the easing
telemetry-anchor-into-`--stage-reserve` item, and the per-scene sheet-pane
scroll-reach sanity check. S.G3 ships the affordance layer + touch parity behind
the **machine-readable per-scene gesture manifest** gate (every entry carries an
on-stage tell + a browser-actuated touch path; reliable primitives, never native
dblclick synthesis) and discharges the `drag-gesture` backlog row. **S.G4 is
DE-SCOPED to §8** (the ten easter eggs — the strongest de-risk of S's breadth
signature; the D3 S9 egg re-point still ships as a gate re-point).

**S.H — parse-that dispatch (own repo; ONE 1.0.0 publish then re-pinned; NO `file:`
links; track: dispatch).** Intra-band DAG (sh-#6): **H1, H2 parallel; H1 + H2 → H4
→ (1.0.0 publish → kf re-pin) → before S.Z.** H3 is de-scoped to §8. H1's patch +
H2's breaking cut land in **one 1.0.0 publish** (kf re-pins exactly once). H4's
gates are **born-SPECIFIED** (T4) and this band is T12's second, owner-controlled
external consume-edge. S.H1 arms the packrat epoch behind a PACKRAT_ARMED latch
(p11: 14–18% short-value throughput, ~34% retained heap; the probe-mandated type
ripple; the retained-heap born-RED clause MUST run in a memoize-free process; NO
throughput-% gate). S.H2 is the 1.0.0 legacy cut: delete span.ts + all 15 `*Span`
exports (**proof:no-span-surface** — born-RED today), the C-16 chain() fix +
`chainError` retirement with the full regression suite, and the parse-that
CLAUDE.md refresh. S.H4 closes the ledger (verify DQ-1/DQ-2 landed in 0.13.0;
verify fold row 46 color2Into at the re-pin — in the wave text, not just the
table), records the deliberate non-goals + the two r6 decisions (no
zone-partition; zero-copy delegated to value.js) + the PROVISIONAL WDM/LR keep
(pending the bbnf-lang LR-consumer question), cuts 1.0.0, and re-pins kf; gates
born-SPECIFIED: proof:pin-ledger-current reflects the new pin; the kf-side consume
gate green; the value.js suite green against the re-pinned build.

**S.Z — Close (track: close).** S.Z1 materializes the total prompt-recap at
`docs/tranches/S/PROMPT-RECAP.md` with the rewritten born-RED
**proof:prompt-recap-s** (oracle-resolving: an ADDRESSED row must cite an oracle
that resolves to a real gate/artifact AND matches a green exit in the S.Z3
from-clean run; the cited precept set is r1 §5's twelve kickoff asks + the 7-clause
standing mandate; the three re-verifications bound to concrete oracles; the recap
re-measures r1's own ADDRESSED-map; mid-S asks captured in
`docs/tranches/S/OWNER-ASKS.md`, asserted fully-dispositioned) — see §6 below.
S.Z2 codifies r2's rules as `docs/tranches/TEMPLATE.md` + **proof:tranche-template**
with the honest partitioned scope (directly-checked {T2, T3, T4, T5, T10};
sibling-asserted {T1, T6, T7, T8, T9}; the per-mandate non-vacuity plant table) and
the **RE-EXECUTION clause**: the meta-gate re-executes the closure oracle of every
wave marked CLOSED and REDs on any exit-code mismatch (the Q-mode cure). S.Z3
produces the FINAL over a from-clean **closeable-roster** run (C-21) with the exact
SHA, the **born-RED precondition** that master shows a green push run on the FINAL
SHA (the A0 keystone re-gated at close — the Q/R mode structurally forbidden), the
**post-close fallout guard** (any src/bench/scripts commit between the FINAL SHA
and the tag REDs — the 6f2493d anti-pattern, mechanized), and the version decision
as an OWNER RULING with its two inputs surfaced (§2). MEMORY updates: stale
specular note retired, dock-doubleclick sharpened (+ the E6 contingency), DM-24
REVIVED recorded.

### The DAG (SPEC §3, verbatim)

```
S.A0 ──► S.A1, S.A2, S.A4, S.A5, S.C1, S.C2, S.C3a, S.C3b, S.C4, S.B1, S.D1
S.A2 ──► S.A3  (auto-deploy fires when demo-correctness is green — post-backlog)
S.A4 + S.D1 ──► S.G1 ──► S.D2 ──► S.D3 ──► S.E1c, S.G2(compose items)
S.B1 ──► S.B2 ──► S.B4, S.B6 ;  S.B1 ──► S.B3 ──► S.B4 ──► S.B5 ──► S.B7 ──► S.B8
        (B2 owns the animation.ts/playback.ts ceiling carves — B2 precedes B5 by construction)
S.B2/B3 ──► S.F1 ;  S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d ;  S.B4 ──► S.F4 ;  S.B2/B4 ──► S.F5a/b/c ;  S.B1 ──► S.F2
S.D1/S.D2 ──► S.E1 (8-scene core) ;  S.D3 ──► S.E1c (compose row) ;  S.E1 ──► S.E2 ──► S.E3 ──► S.E4 ──► S.E5 ──► S.E6 ──► S.E7
S.E7 + [glass-ui 5.0.0 published] ──► S.E8   (else: structured HANDOFF + rows 51/52/53 RESIDUAL CARRY)
S.G1 ──► S.G2 ──► S.G3        (S.G4 → §8)
S.H1, S.H2 parallel ;  S.H1 + S.H2 ──► S.H4 ──► (1.0.0 publish → kf re-pin) ──► before S.Z
ALL ──► S.Z1 ──► S.Z2 ──► S.Z3   (Z3 pre-gated on master-green at the FINAL SHA)
```

Tracks: lib = S.B, S.F; demo = S.D, S.E, S.G; gates = S.A; dispatch = S.H; design =
S.G (+E3/E5); close = S.Z.

**Cross-band constraints (named, binding):**

- **S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d** (C-25): EN-c is
  unshippable on today's `serializeEasing`; the two correctness fixes land in the
  lib track's early wave, not behind the feature band.
- **D2 ⟵ G1** (C-24, P2-1 F8 — CONFIRMED load-bearing, not relaxable): G1 lands
  first on the current tree; D2's carve re-runs `proof:stage-visible` green on the
  post-carve tree.
- **proof:compose-scene closes after S.G** (sd-#4): authored at D3, closing on the
  DAG edge S.G1/G2 → compose-fleet-green → close — else the wave
  born-GREENs-then-reds mid-band, a T4 violation.
- **S.E8 is glass-ui-gated**: fires only on the joint 5.0.0 publish; else a
  structured HANDOFF with rows 51/52/53 as explicit non-terminal RESIDUAL CARRY.
- a19's engine↔group constraint: KeyframesAnimation stays at `engine/animation.ts`
  through B2 (group's cycle-break import survives).
- A4's FROZEN-set declaration precedes any demo wave that reds a
  *layout/appearance* gate (D3, E, G — NOT D1, which reds only source-path gates,
  p04 F4).
- `proof:scene-colocated` canonical edit order: **A4 → D2 → D3** (T7).
- The two external edges are E6 (third-party) and H4 (owner-controlled,
  born-SPECIFIED) — **no others** (T12).

## 6. The prompt-recap plan (SPEC §5)

S's close must prove every owner ask hitherto is ADDRESSED or explicitly
dispositioned — against **r1's corpus** (the 100+ session-message mining), not
against S's own charter alone. The full mechanics and the rewritten gate live in
`waves/S.Z.md` (the S.Z1 section); the plan's five principles:

1. **The ask ledger** materializes at `docs/tranches/S/PROMPT-RECAP.md`: ask →
   origin → letter-status → spirit-status (r1's leak analysis) → S disposition
   (wave / KILL / HANDOFF / RESIDUAL CARRY). r1 already grades the hard cases:
   decomposition honored in letter, spirit open (→ S.B's cohesion-first rule + the
   reformed gates); the gate-routed-around triad (override rewrite, manual deploy,
   re-tiering → S.A0/A2/A3 make the routes unnecessary); the 3-hour apparatus
   complaint (→ S.A2's harness net-deletion + S.A4's tier legend); the
   scene-switcher as the oldest unfulfilled first-class ask (→ band S.E, built to
   not repeat N's failure loop).
2. **Re-verify, never chain-trust — symmetrically.** The recap re-measures the two
   R reversals (keyframes-vue KILL; the lint-tier retraction) and the
   decomposition-spirit gap against the concrete oracles bound in S.Z1 — AND
   re-measures **r1's own ADDRESSED-map** (whose device-dependence framing p12
   refuted) rather than inheriting it. Every ADDRESSED row cites an oracle that
   resolves and is green in the S.Z3 closeable-roster run (r2 S4).
3. **The gate** is S.Z1's rewritten `proof:prompt-recap-s` — row-shape alone cannot
   green it; a cited-but-red oracle REDs the row; the precept set is the cited r1
   enumeration (twelve kickoff asks + the 7-clause standing mandate).
4. **Owner asks arriving mid-S** are appended to `docs/tranches/S/OWNER-ASKS.md`
   with a wave assignment or an owner-ratified deferral — the gate asserts that
   file is fully dispositioned (the F3 laundering guard, now with a mechanism).
5. **The spirit column is the point.** A recap that lists letter-compliance while
   the same mechanism leaks (r1's headline) fails S's own bar; the recap states,
   per ask, what would falsify "addressed" — and S.Z2's template gate makes that
   structural for T and beyond.

## 7. Risks + anti-patterns — the T1..T12 binding template mandates (SPEC §7)

r2's failure/success taxonomy, restated as **mandates** — enforced by S.Z2's
partitioned template gate (direct checks + sibling-gate presence), not by prose.
These bind every S wave.

- **T1 (no gate-shaped closures).** Every chronic/charter closure oracle is a
  runtime-tier gate that opens the dist and actuates; the reformed
  proof:gate-is-runtime (with the symmetric mis-tier clause) REDs any source-shape
  gate cited as a runtime closure — in BOTH tier directions (r2 F1, p08).
- **T2 (no self-certifying gates).** Ceiling overrides may only shrink or be
  data-volume-justified with a machine-checkable ratio; a cap RAISED vs the prior
  tranche is a hard RED (r2 F2). S.B5 targets an EMPTY override map. Corollary
  (§3-5): no numeric line count is a born-RED gate's GREEN criterion.
- **T3 (no deferral laundering).** Override/close prose containing deferral verbs
  is cross-checked against the ledger by a meta-gate; a booked deferral without a
  ledger row REDs (r2 F3). **Extended (x2-#8): the same grep runs over the S
  ledger's disposition column** — a row whose disposition contains
  observe/watch/re-affirm/verify without a paired deterministic-re-shape or KILL
  row REDs (C-20).
- **T4 (DEVELOPED ≠ SHIPPED).** A wave is CLOSED only when its born-RED gate is
  GREEN *re-run on the merged tree*, exit code recorded in PROGRESS.md (r2 F4) —
  and S.Z2 **re-executes** that oracle at close (a re-run, not a re-read). S is
  development-only: every wave doc states this and its gate ships born-RED or, for
  the publish-coupled external edges (S.E8's consume gate + the S.H4 gates),
  born-SPECIFIED.
- **T5 (no transcript trust).** Parallel drives re-run every touched gate from a
  clean independent checkout; "pre-existing" claims are verified by triage, never
  accepted (r2 F5, a15). Worktree hygiene: node_modules symlinks never git-added.
- **T6 (no cosmetic excision).** An excision deletes the body, its tests, its
  gates, and its doc mentions; the whole-tree symbol grep is a discharge-checklist
  step (r2 F6, a09). The hardened proof:no-orphan-module (dynamic-import-aware,
  pinned roots — S.C1) makes the class structural.
- **T7 (gate follows code — including docs and its own coverage set).** A
  structural wave co-edits every gate whose scan geometry it changes (the p01
  lesson: 10 sites, not 1), regenerates its before/after box from the shipped
  tree, and treats the architecture MAP as a gated deliverable. When a wave deletes
  a UI surface or a behavior, it must reconcile EVERY gate naming it — including
  gates that ARM on the deleted behavior (the p10 arming-audit class). Cross-band
  edits to one gate follow a named canonical order (scene-colocated: A4→D2→D3).
- **T8 (interaction-axis tests for hand-rolled primitives).** Any replacement for a
  vendor primitive ships with a keyboard/focus/repeat test, not only a source-shape
  gate (a12; fold row 71) — the documented gate-blindspot cure; live verification
  via chrome-devtools-mcp for every stage of S.E/S.G.
- **T9 (census before fiat).** No "keep verbatim / do not touch" verdict on a
  shared directory without an importer census shipped as evidence (a24 F8).
  Totality claims (NO-legacy) are proven by census-shaped gates (the S.C3a shadcn
  census clause), not by naming one island.
- **T10 (clean close).** Full proof:all + bench-compile from clean, citing the
  exact SHA, BEFORE the version/FINAL commit; a post-close fallout patch falsifies
  the close — enforced mechanically by S.Z3's post-close guard (any
  src/bench/scripts commit between the FINAL SHA and the tag REDs). No FINAL
  gate-state table smaller than the full roster (r8 F5). **Reconciled with T12 in
  one sentence (C-21):** T10 is satisfied against the *closeable roster* — the full
  roster with owner-ratified external HANDOFF gates rendered as the explicit third
  state `HANDOFF — external — row N`, never omitted and never counted green.
- **T11 (the risk signature).** Breadth + chronic-folding + a headline close claim
  is the recorded danger pattern (r2 Part V). S is deliberately broad and
  compensates **structurally**, not by citation: the cause-shaped keystone with
  masking forbidden (S.A0), the observe-split no-reclassification clause (S.A2),
  the machine-distinguishable FROZEN discharge (S.A4), closure re-execution + the
  master-green-on-FINAL-SHA precondition (S.Z2/Z3), the contingency-KILL belt with
  the rows-51/52/53 residual-carry honesty (C-20), the §1 breadth justification +
  the §2 owner decision point, and the de-scoping of S.G4/S.H3 (§8). The
  adversarial critique fleet's corrections OVERRIDE raw findings while crediting
  real wins (r2 S6) — the provenance loop (§0) is the proof it operated.
- **T12 (external gates are named, not assumed).** **Exactly two** external
  consume-edges exist (corrected from v1's false "exactly one"): **S.E8**
  (third-party glass-ui 5.0.0 — specified now, fires later; may close S as a
  structured HANDOFF, in which case fold rows 51/52/53 are an explicit
  non-terminal RESIDUAL CARRY, never presented as terminals) and **S.H4** (the
  owner-controlled parse-that 1.0.0 publish-then-re-pin; gates born-SPECIFIED,
  firing at the impl drive's publish step). No other wave may acquire an external
  dependency without an owner ruling; S.C3b is explicitly constructed to be
  internally closable.

## 8. Recorded-future (the prune ledger — nothing silently vanishes; SPEC §8)

Every critic-pruned item, with its source and the shape it carries forward:

1. **S.G4 — the ten per-scene easter eggs** (x2 prune; sg-#9 absorbed into the
   carried shape). De-scoped from S as observe-tier altitude atop a red substrate.
   Carried forward with the REPAIRED gate for the successor tranche: each egg FIRES
   on its browser-actuated trigger, is PRM-snapped (PRM-off collapses it), and
   dogfoods a named engine primitive; the "or-documented" reachability escape is
   DELETED; sequenced after the affordance/touch-parity wave so touch eggs have a
   touch path. The ten authored egg designs (design/*.md) remain the content.
2. **S.H3 — the Pratt binding-power combinator** (sh prune). Kept as a design
   appendix/seed over the Parser core with the value.js math.ts consume-edge
   sketch; no wave, no gate (its design-doc + external-sign-off "gate" violated T1
   and would have been a third external edge); not implemented without value.js
   ratification; explicitly not a grammar-DSL move.
3. **The literal single-writer hard fold** (p02 §3.3 / sb-#9). A FUTURE BREAKING
   wave: 107 test sites + the demo contract-anim writes + a public `seek(ms)` verb
   + a MIGRATION doc; do only behind the `seek()` surface; collides with
   additive-minor — never smuggled as engine-internal.
4. **S.B4's stretch** (sb prune): collapsing the 26 type-only rings + deleting the
   viaOnly exemption — optional cleanup; B4 is not gated on it.
5. **The B6 loader collapse** (sb prune / p07): owner-recordable option — see §2.
6. **docs/precepts/audits/ ownership** (sz prune; fold row 65): an owner
   record-future item, not a close deliverable — "fold or freeze" names two options
   and chooses neither.
7. **docs/tranches/TEMPLATE.md amendment discipline** (sz prune): give the template
   a version/amendment mechanism so it does not become the next stale-doc-authority
   (the R.W7 inversion applied to itself); a future T13 mandate must be able to
   land without ossification.
8. **E6's visual-lock re-baseline** (se prune): booked inside E6 as a HANDOFF line
   item but flagged as its own multi-gate effort (r7 B-2/B-3) — it will not flip
   atomically with the pin.
9. **The 26dvh per-mode tuning** (sg prune / p10 risk b): a one-line token change
   once all 9 scenes are gated — not scope.
10. **The mobile mount-reset preference note** (sg prune / p10): the reset discards
    a returning user's expanded preference per scene entry — accepted as the "peek
    by default" reading; recorded in G1's wave doc, not a gate.
11. **Typed-OM ADOPT** (sf): fires only above the pre-stated write-throughput
    threshold, and then as a separate authored wave — never folded into F5 (the
    default is KILL-with-recorded-bench).
12. **Anchor-positioned motion · Lottie/Theatre→compileToCSS importer · Rive** (r5
    finding 6; sf prune confirms): correctly parked — thin demand / separate
    charter / different product.
13. **NO throughput-% gate on S.H1** (sh prune / p11): recorded so a future pass
    does not "strengthen" the heap gate into a workload-dependent flake trap.
14. **The Q4 dichotomy correction** (sd prune): reds outside the FROZEN set but
    inside the known source-path/driver set are mechanical, NOT a re-inventory
    trigger; only reds outside BOTH signal unknown coupling. (Encoded in P2-1's
    criteria — and confirmed by P2-1's execution: the transport move's scope-set
    reds were exactly this mechanical class.)
15. **The already-terminal R KILLs** (x1 prune): DM-7 / DM-1 / DM-5 S1 / DQ-3 /
    VJ-Q9 are NOT re-added as fold rows — the ledger header's scope note is the
    fix, not re-litigation.
16. **§6 prompt-recap is not expanded** (x1 prune): the precept-mapping clause +
    the OWNER-ASKS mechanism close both leak paths; padding it would be ceremony.
17. **No speculative value.js SOTA band** (x1 prune): pending the §2 owner reading.
18. **The "device-dependence plane" narrative + the "calibrate" verbs** (sa prune):
    pruned wholesale (replaced by the p12 fix-by-cause taxonomy).
19. **The Linux-container/act reproduction apparatus** (sa prune): dropped from
    S.A1/Q12 — local macOS reproduction is the discriminator.
20. **The ~54→single-digit FROZEN-fold citation** (sa prune): S.A4 cites the
    Q4/p04 + D/G migration dependency instead of re-asserting the ~120 headline.
21. **KEEP rulings recorded** (sz prune): the spirit-column doctrine (§6.5) and
    T10's full-roster clause are load-bearing wins — explicitly NOT pruned.

## 9. Where everything lives

- **This doc** — charter, owner rulings, evidence, the C-1..C-25 registry, bands +
  DAG, the recap plan, T1..T12, recorded-future.
- **`PROGRESS.md`** — the board (per-wave status + gate exit codes, the T4 record)
  and the chronic/deferral **fold ledger** (rows 1–74 — every open-at-R-close item
  with its terminal disposition per C-20; rows 51–53 the only RESIDUAL-CARRY
  candidates).
- **`waves/S.<band>.md`** (one file per band — S.A.md … S.Z.md) — the executable wave specs (charter, scope items S1..Sn,
  the hard born-RED gate with witness plan, co-edit sets, deps, verification).
  Wave IDs are the SPEC-v3 names verbatim: S.A0–A5, S.B1–B8, S.C1/C2/C3a/C3b/C4,
  S.D1–D4, S.E1(+E1c)–E8, S.F1(VT-a..d)/F2/F3(EN-c,EN-d)/F4/F5a/F5b/F5c/F6,
  S.G1–G3, S.H1/H2/H4, S.Z1–Z3 (EN-a/EN-b live inside `waves/S.B.md`'s S.B3 section per C-25).
- **`audit/pass1/SPEC-v3.md`** — the converged specification (audit evidence; §4
  fold table, §9 absorption ledger). `audit/pass1/` — DIGEST.json (50 lanes),
  SPEC-v1/v2, prototypes/p01–p12, critique/ (11 reports + CRITIQUE.json), audit32/,
  design/, research/. `audit/pass2/` — the two residual probes + recritique/
  (11×100%).

---

*S is DEVELOPMENT ONLY. The branch reds ARE the charter; they go green wave-by-wave
under the impl drive, discharged at S.Z3 over a from-clean closeable-roster run on a
green master — not papered, not re-tiered, not observed.*
