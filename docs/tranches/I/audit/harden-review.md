# Tranche I — HARDEN REVIEW (adversarial) · the scorecard + the born-RED gaps

**Agent:** HARDEN-REVIEW (adversarial). **Branch:** `tranche-i-dev` (forked off the broken
master `b934a08` = H's tip). **Type:** TRANCHE DEVELOPMENT — this file is the deliverable;
ZERO source/test/CI edits, NO git commit.
**Date:** 2026-06-08.

**Charge.** Read the WHOLE authored Tranche I — the charter (`I.md`), the eight wave specs
(`waves/I.W0..I.W7.md` + `waves/README.md`), `PROGRESS.md`, `PATH-FORWARD.md`, and the audit
corpus (`audit/rootcause-*.md`, `audit/recap-*.md`, `audit/investigate/**`). Check the six
mandated criteria; list every GAP/WEAKNESS as a born-RED finding the author lanes MUST fix,
with the fix. This review is itself bound by inv ε: every finding cites a `file:line` in the
authored docs or the live source, verified first-hand.

**Verification done first-hand (the audit IS grounded — this matters for the verdict).** I
re-ran the load-bearing anchors against the live tree, not the docs:
- `src/animation/group.ts:38` `transform!: TransformFunction<V>` (the definite-assignment
  LIE), `:123-124` conditional assign, `:373` `this.transform(...)` unguarded — **CONFIRMED
  exact.** The constructor comment `:118-122` promises lazy resolution "on the first
  `transformFramesGrouped` call" that does NOT exist at `:373` — the wave's claim is TRUE.
- `src/animation/playback.ts:78` `private _gen`, `:215-216` `stop() { this._gen++ }` —
  CONFIRMED. `demo/easing/useEasingDemo.ts:227` + `demo/spring/useSpringDemo.ts:365` pass
  the UNBOUND `playback.stop`; the BOUND sibling `stopLoop = () => playback.stop()` exists at
  `:171`/`:213` — **CONFIRMED, and it decisively proves the object is alive, only the binding
  is lost** (rc-dfa-gen's adjudication holds).
- `demo/app/scenes/SquareScene.vue:2` `select-none` scoped to `.square-stage`, `:94` `window`
  pointermove, `:104` `reseat(0,0)` — CONFIRMED (B6).
- `demo/app/scenes/AmigaScene.vue:64` `SPHERE_HOME = -BOX_SIZE/2+1`, `:137-140` sphere at the
  corner, `:133` box at origin `(0,0,0)` — CONFIRMED (B3, subject ≠ pivot).
- `node_modules/reka-ui/dist/Tabs/TabsRoot.js:57-59` `passive: props.modelValue === void 0` —
  CONFIRMED (B4 latch).
- `dist/gh-pages/` exists; **67 re-runnable probe scripts** on disk; the console JSONs contain
  the verbatim `this.transform is not a function` and `Parse error at offset 0: "......"`
  strings. **The investigation is real, first-hand, and re-runnable — not theorized.**

The authoring is, on the whole, **exceptionally strong**: the root causes are confirmed at the
seam, the fix directions ARE architectural transpositions (not patches), the prompt-recap is
honest and complete A→H, and the gate-regime overhaul is a genuine oracle re-point. **But it
ships with one CATASTROPHIC structural contradiction and a cluster of HIGH gaps that, left
unfixed, would let the next tranche repeat exactly the blindspot this tranche exists to close.**

---

## §0 — THE SCORECARD (the six mandated checks)

| # | Criterion | Verdict | Why |
|---|---|---|---|
| **1** | Does EVERY live breakage B1–B9 + the console-census errors map to a wave? (no orphan bug) | **PASS, with one HIGH gap** | B1–B9 + K + DC-8 + the net-new `this.transform` crash all map. **GAP: the B5 "cubic-bezier" option-seam error (E-B5, b10 §B5) and E4 `Err x 0` are folded but under-specified; the engine line-ceiling (C-6) collision with S2 is RECORDED but not gated** (H-3, H-7). |
| **2** | Is EVERY new wave-gate a REAL runtime/interaction gate (playwright-driven, budget 0) — not a source-shape gate? | **PASS in design, FAIL in two seams** | Every §Hard gate CLICKS/SWITCHES/DRAGS. **BUT the B2 gate cannot bite born-RED via the user gesture it specifies (the dock trigger is un-hittable on the broken tree — B8 — and `_gen` is dev-only on dist), and several "behavioral" clauses smuggle source-shape proxies (`getComputedStyle(::before).opacity≈0` "OR the track class not emitted"; the `proof:single-build-root` config check).** (RED-1, H-1, H-5) |
| **3** | NO workaround / NO legacy / gestalt — are the fix directions architectural transpositions? | **PASS** | The empty-input value seam, the bind-proof `RAFPlayback`, the machine-projected control mount, the subject=pivot geometry, the shared drag seam, the published-default specular consume-edge, the single `outDir` — all are root transpositions. The workarounds are explicitly named + REJECTED in each wave's §Design decisions. **Minor: I.W6-S3 "give the substrate depth" risks decorative scope-creep that is not a B7 fix** (M-2). |
| **4** | Is the prompt-recap COMPLETE (every A→H request, honestly statused)? | **PASS** | `recap-prompts.md` walks A→B→C→D→E→F→G→H per-tranche with claimed-vs-actual; the standing-mandate recap; every B1–B9 traced to its falsified claim. Honest BROKEN/REGRESSED/ADDRESSED legend. **Minor: the I-ask table (§4) does not status the IMMEDIATE deploy-revert as a discrete prompt-derived action** (M-4). |
| **5** | Are the chronic + deferred items folded? | **PASS** | `recap-chronic` (4 H chronics re-examined live + the crash chronics) + `recap-deferred` (the non-chronic carry, the two prime folds, DC-8) — every carry exits with an I disposition; the two fictional handoffs converted to real folds. **GAP: a root-cause CONTRADICTION between recap-chronic §2 (B2 = "unarmed scene", "null-guard playback in suspend") and the adjudicated wave fix (B2 = unbound method, bind-proof) was left un-reconciled in the chronic ledger** (RED-2). |
| **6** | Does the gate-regime-overhaul wave actually close the blindspot? (would it have CAUGHT B1/B2 if it had existed?) | **PARTIAL — the headline is undercut by a sequencing inversion + the B2 bite gap** | It WOULD have caught B1 (the play-click console budget bites cleanly on dist). It would have caught B2 **only via the synthetic `visibilitychange` on the dev server** — NOT via the built-dist dock-select user gesture `proof:live-session` is built around, because that gesture is itself blocked by B8 on the broken tree. **And the overhaul is authored to CLOSE the DAG (I.W7, last), directly contradicting the charter's "I.W0 LEADS … lands the harness FIRST so every later wave gates on it."** (RED-1, RED-3) |

**Net.** Four clean PASSes, two PARTIAL/qualified. **Three born-RED RED findings (must-fix
blockers) + seven HIGH + four MED.** The tranche is fundamentally sound and the audit is
honest; the gaps are real and would, unfixed, re-open the blindspot at the gate-regime seam
itself — the deepest irony available.

---

## §1 — THE BORN-RED FINDINGS (must-fix blockers; the author lanes own these)

### RED-1 — THE GATE-OVERHAUL IS SEQUENCED LAST, CONTRADICTING ITS OWN "LEADS FIRST" CHARTER · the headline cannot govern a wave that lands before it

**The contradiction, verbatim, in two documents that must agree.**
- `I.md` (charter) §The WAVE MAP: *"**I.W0 (the gate-regime overhaul) is the keystone AND the
  prerequisite** — it lands the gate-ORACLE precept, the two-tier taxonomy, and the one
  interaction-driven session harness FIRST, so every subsequent wave proves itself born-RED
  against the live broken tree."* The charter's wave table lists **I.W0 = THE GATE-REGIME
  OVERHAUL (the headline; LEADS the DAG)**, then I.W1 engine, I.W2 FSM, … I.W9 build, I.WZ close.
- The actual wave FILES (`waves/I.W0.md … I.W7.md` + `waves/README.md §3 DAG`): **I.W0 = engine
  empty-input (B1/B5), … I.W7 = THE GATE-REGIME OVERHAUL, which CLOSES.** `README.md:135`:
  *"I.W7 CLOSES … authored LAST … it can only be fully green once W0–W6 land."* `I.W7.md:14`:
  *"CLOSES the tranche … Authored LAST."*

**These are two different, mutually exclusive tranche plans.** The charter says the harness
lands FIRST and every wave gates on it; the wave files say the harness is assembled LAST out of
the per-wave clauses. The PROGRESS board (`PROGRESS.md §1`) follows the charter numbering
(I.W0 = overhaul, I.W9, I.WZ); the README + wave files follow the other (I.W0 = engine, I.W7 =
overhaul). **A reader cannot know which I.W0 is real, nor whether the overhaul leads or closes.**

**Why this is born-RED, not cosmetic.** The user's headline mandate is *"the gate-regime
OVERHAUL is the headline; close the blindspot for good."* The precept the overhaul binds
("every gate's oracle is the running product") is supposed to GOVERN every prior wave's §Hard
gate. The wave files paper over this by asserting *"its PRECEPT governs every prior wave's
§Hard gate (each already obeys it)"* (`I.W7.md:281`) — i.e. the precept is stated last but
inherited backward by authorial fiat. That is exactly the kind of paperwork-over-mechanism the
tranche condemns: the precept's authority is asserted, not enforced by sequencing. If a wave is
authored and run BEFORE the precept is bound, nothing MECHANICALLY forces its gate to be a
runtime gate — the discipline relies on each wave author having read I.W7 first, which is the
same "read the warning, re-commit the substance" failure H made.

**The fix (the author lanes MUST do ONE of these, and reconcile ALL FOUR top-level docs to it).**
- **(preferred) Adopt the charter's plan: the gate-PRECEPT + the `proof:live-session` SKELETON
  lead (I.W0).** Land the oracle precept, the two-tier taxonomy, and the session-harness
  scaffold FIRST as a born-RED gate-of-record on `b934a08` (every breakage trips its budget);
  each fix wave then fills in its clause and turns its leg green. The chronic-closure rewire +
  the final census cleanup CLOSE (I.WZ). This makes the precept MECHANICALLY prior. Renumber the
  wave files to match the charter (overhaul = I.W0; engine = I.W1; FSM = I.W2; … ; close = I.WZ).
- **(alternative) Adopt the wave-files' plan and FIX THE CHARTER.** If the overhaul genuinely
  must assemble last (because the battery is the union of per-wave clauses), then the charter +
  PROGRESS are WRONG and must be rewritten to say so — drop "I.W0 LEADS … harness FIRST," state
  "the PRECEPT is bound at I-open as a charter invariant (non-wave), the per-wave clauses are
  authored born-RED against the broken tree, and `proof:live-session` ASSEMBLES them last."
  Crucially, even here the PRECEPT must be a charter-bound invariant from t=0, not deferred to
  the last wave — otherwise nothing forces I.W1–I.W6 gates to be runtime gates.

**The blocker:** the four spine docs (`I.md`, `PROGRESS.md`, `PATH-FORWARD.md` follow charter
numbering; `waves/*.md` + `waves/README.md` follow the other) MUST be reconciled to ONE plan
with ONE numbering before IMPL. Until then the tranche has two contradictory DAGs and the
headline wave's authority is asserted, not sequenced.

---

### RED-2 — THE B2 ROOT CAUSE IS CONTRADICTED ACROSS THE AUDIT · recap-chronic still carries the RULED-OUT hypothesis as the cure

**The contradiction.** The wave + the dedicated root-cause doc adjudicate B2 to ONE cause; the
chronic ledger carries a DIFFERENT, explicitly-RULED-OUT cause as the fix direction.
- `rootcause-rc-dfa-gen.md §1b` (the adjudication, decisive): *"b2/b14 is correct, b12's
  stale-group race is RULED OUT … the throw is an unbound free call, NOT a stale-group deref."*
  Cure: bind-proof `RAFPlayback` (`I.W1.md` S1). **I verified this first-hand:** the BOUND
  `stopLoop = () => playback.stop()` works on the same instance; the UNBOUND `playback.stop`
  at `:227`/`:365` is the defect. The adjudication is CORRECT.
- `recap-chronic.md §2 B2` (the stale hypothesis, un-reconciled): *"the crash = the FSM
  captures-active a scene whose `group.playback` (or raw-rAF handle) was NEVER ARMED (the loop
  never constructed) … **Null-guard playback in suspend; the FSM must not capture-active an
  unarmed scene.**"* This is b12's stale-group/unarmed hypothesis — **the one rc-dfa-gen §1b
  RULED OUT** — presented as the I cure.

**Why this is born-RED.** A null-guard-in-suspend "fix" (recap-chronic's prescription) is a
DIFFERENT, WEAKER fix than bind-proof-`RAFPlayback` (the wave's prescription) — and it is a
WORKAROUND by the tranche's own definition: it defends the suspend call site against an
undefined receiver instead of making the binding correct by construction. If an IMPL agent
reads the chronic ledger (a canonical fold document the I mandate elevates) and implements its
prescription, they ship the foot-gun the wave explicitly forbids (`I.W1.md §Design decisions`:
*"Bind-proof the engine, NOT wrap the two call sites … wrapping … leaves the foot-gun live"*).
The audit must speak with ONE voice on the load-bearing CRITICAL fix.

**The fix.** Correct `recap-chronic.md §2 B2` (and §8's fold line) to cite the ADJUDICATED root
cause: unbound `playback.stop` (not "unarmed scene"); the cure is bind-proof `RAFPlayback` +
`useRafScene` consolidation (not "null-guard playback in suspend"). Add a one-line note that
b12's unarmed-scene/stale-group hypothesis was RULED OUT by rc-dfa-gen §1b, so the ledger and
the wave agree. (The PROGRESS board §4b already cites the correct "unbound `RAFPlayback.stop`"
— so the contradiction is internal to the audit, recap-chronic being the stale lane.)

---

### RED-3 — `proof:live-session` CANNOT BITE B2 BORN-RED THE WAY IT IS SPECIFIED · the headline gate's keystone clause is un-runnable on the tree it must red on

**The problem, from the audit's own evidence.** The headline gate (`I.W7.md` S2,
`proof:live-session`) and its B2 leg (`I.W1.md` `proof:fsm-suspend-resume-live` clause b)
require, over the BUILT `dist/gh-pages/`: *"drive a REAL dock-Select scene-switch (hover-expand
the morphing dock → open the reka combobox → pick the destination — the user gesture, which
co-fires the VT visibility tick)."* But `rootcause-rc-dfa-gen.md §2` records, first-hand, that
the author's OWN harness **could not do this on the broken tree**:
- *"My harness could NOT click the dock trigger to reproduce the exact frame interleave — the
  trigger is `visibility:hidden` mid-animation (`rc-dock-dom.mjs`: `button[aria-label="Scene"]`
  reports `vis:false`; that is **B8 directly obstructing the gesture**), so `force`-click never
  opens the reka popper."*
- *"The deterministic tab-hide reproduction (b2/b14, source-mapped) IS the same defect; hash-
  NAVIGATE alone does NOT co-fire the visibility tick … `genError:false` on every hash path."*
- The b10 census confirms: on the BUILT dist the dock-switch tour throws the `"......"` storm,
  **NOT** `this._gen` (which is *"from the :5174 dev server (un-minified generator internal)"*,
  `b10 §B2`).

**So the B2 oracle, as specified, has three un-met preconditions on the born-RED tree:** (1)
the user gesture it drives (dock-select) is BLOCKED by B8 — you cannot witness the gate go
born-RED via the path it asserts; (2) the `_gen` throw is DEV-ONLY (source-mapped `:5174`), not
reproducible on the BUILT dist the harness targets; (3) only a SYNTHETIC `visibilitychange→hidden`
dispatch reproduces it deterministically, which I.W1 clause (a) does include — but that is the
synthetic-event path, not the "real dock-Select user gesture" of clause (b) and of
`proof:live-session`. **The headline gate's most load-bearing clause — the one that closes the
B2 keystone — rests on a gesture the broken tree forbids and an error the built artifact does
not emit.** I.W1 clause (b) even half-admits the circularity: *"If the trigger is un-hittable,
the clause reds → couples to I.W4/I.W6's dock fix."* That coupling means the B2 gate cannot turn
GREEN-on-fix until the B8 dock fix ALSO lands — so a clause whose JOB is to prove the B2 bind
fix landed is entangled with an unrelated wave's fix, and its born-RED witness on `b934a08` is
"the gesture didn't even fire," not "the suspend threw."

**Why this is born-RED for the gate-regime overhaul specifically.** The WHOLE thesis is "the
oracle must be the running product, exercised through the SAME surface the human uses, born-RED
on the broken tree." A gate that cannot be exercised through the human's surface on the broken
tree (because the surface itself is broken) and whose target error is dev-only is — by the
tranche's own standard — NOT yet a sound runtime gate for B2. It is the gate-regime's own
blindspot turned inward.

**The fix (the author lanes MUST specify the B2 born-RED witness honestly).**
1. **Name TWO B2 triggers explicitly and make the SYNTHETIC one the born-RED-of-record.** The
   deterministic, dist-reproducible witness is the synthetic `visibilitychange→hidden` dispatch
   while a raw-rAF scene PLAYS (I.W1 clause a) — make THAT the born-RED oracle (it bites on the
   built dist? VERIFY: the audit only proves it on `:5174`; if `_gen` is genuinely dev-only the
   gate must run against the source-mapped dev server for the suspend leg, and the wave must SAY
   SO — `proof:live-session` cannot be dist-only for B2). The real-dock-gesture (clause b) is the
   ASPIRATIONAL post-B8-fix witness, gated AFTER the dock is hit-testable.
2. **Resolve the dist-vs-dev oracle for `_gen` before IMPL.** Either (a) prove `_gen` reproduces
   on the built dist (re-run `b2-dfa-gen-crash.mjs` against `dist/gh-pages/`, capture the JSON —
   the audit has NOT done this; b10 says it does NOT) and keep the dist harness; or (b) accept
   that the B2 suspend leg of `proof:live-session` runs against the SOURCE-MAPPED dev server
   `:5174` and make that a NAMED, justified exception to the "built dist" harness rule. The
   charter currently says the harness is the built dist for ALL legs — that is FALSE for B2 per
   the audit's own finding.
3. **De-couple the B2 born-RED witness from B8.** The bind-proof fix (I.W1 S1) is independently
   provable: a synthetic visibility tick on a playing easing scene throws on `b934a08` and does
   not throw on the fixed tree — NO dock gesture required. Make that the B2 correctness oracle;
   leave the "dock-select co-fires the VT tick" as an ADDITIONAL integration assertion that
   greens only once B8/B4's dock is hit-testable.

Without this, the headline gate has a hole exactly where the keystone (B2, the H.W1 false-close)
lives — and "would it have caught B2?" answers "only on the dev server, only synthetically,
never via the user's actual gesture on the actual artifact."

---

## §2 — THE HIGH FINDINGS (must address; not full blockers)

### H-1 — "Behavioral" clauses that smuggle a SOURCE-SHAPE escape hatch into the correctness oracle

Several §Hard gate clauses pair a real runtime assertion with an `OR <source-shape proxy>`
disjunction — which means the gate can pass on the PROXY without ever proving the product
property. This is the exact LOAD-REST/WRONG-PROJECTION pattern the overhaul condemns, re-entering
through the back door of the new gates.
- **I.W6 clause (a):** *"assert the catch-light is ABSENT — `getComputedStyle(::before).opacity ≈
  0` **OR the track class is not emitted at all**."* The second disjunct is a SOURCE-SHAPE check
  (class-presence), not a perceptual one. A future glass-ui that emits the track but paints it
  transparent-yet-nonzero (or emits it with a different class name) passes the OR-branch
  vacuously. **Fix:** assert the PERCEPTUAL outcome (no catch-light bloom in the rendered pixels,
  via a sampled luminance delta over the plate at rest) as the PRIMARY; the class-absence is a
  HYGIENE-tier corroborator, not an OR-escape on the correctness oracle.
- **I.W0 clause (e) / I.W1 clause (d) / I.W4 clause (e) / I.W5 clause (d):** each is correctly
  LABELED hygiene — GOOD. But the gate's PASS condition for the wave must be the runtime clauses
  ALONE; the spec must state the hygiene clause may not substitute for a red runtime clause. Make
  this explicit in each §spine bar (most do; I.W4 clause (e) "on-device flag" is the weakest —
  it flags rather than asserts, which is fine for hygiene but must be named non-load-bearing).

### H-2 — `proof:live-session` ERROR-BUDGET vs the amiga WebGL warns + the dev source-map noise · the budget definition is internally inconsistent across waves

The headline budget is *"zero `console.error`"* (I.W7 S2). But:
- I.W3 clause (c) **promotes the amiga console gate to fail on `warning`/`verbose`**
  (ReadPixels/content-visibility) — a STRICTER budget than `proof:live-session`'s `error`-only.
- I.W6 / B7 and the amiga route legitimately emit WebGL `warning`s today (b10 E5, 4×/load) that
  are NOT product defects per se, and B9-c's dev source-map noise is explicitly ACCEPTED
  (I.W5 S6).
**The gap:** `proof:live-session` does not say whether its accumulated budget is `error`-only or
includes the `warning`/`verbose` ReadPixels lines that I.W3 promotes. If the session battery
includes the amiga centre-drag leg (it does — I.W7 S2), and amiga still emits GPU-stall warns
until I.W3's S2 lands, the session gate's budget definition determines whether it reds on those
warns. **Fix:** I.W7 must define the budget as a STRUCTURED allowlist: `pageerror` = 0,
`unhandledrejection` = 0, `console.error` = 0, value.js `"......"` = 0 (hard); PLUS the I.W3
ReadPixels/content-visibility `warning`/`verbose` lines = 0 (promoted, because they index a real
GPU stall); MINUS the named-benign dev source-map noise (which the dist harness never emits
anyway). State the allowlist ONCE in I.W7 and have every wave's console clause inherit it, so the
budget is one definition, not per-wave drift.

### H-3 — The engine line-ceiling (C-6) collides with the I.W0 serialize-from-template transposition · RECORDED but NOT gated

`recap-deferred §9` + the C-6 watch-note: `engine.ts` is **1375/1400 at H-open — 25L headroom**
(I verified: `engine.ts` is **1375 lines** exactly). I.W0 S2 (serialize-from-template) is an
`engine.ts`/`format.ts` transposition; I.W2's `EasingEditor` and I.W1's `useRafScene` add
demo-side mass but the engine work is real. The waves RECORD "respect the ceiling or re-baseline
with a measured cohesive split" but **no wave carries a GATE that reds if the transposition blows
1400 without a cohesive split.** **Fix:** I.W0 (or I.WZ) must add a HYGIENE-tier `proof:engine-
line-ceiling` clause: `engine.ts` ≤ 1400 OR a named measured split landed (the split documented,
not silent). This is the one place "respect the ceiling" must be a gate, not a hope — the exact
"asserted not enforced" failure the φ-leaf-zero gate was praised for avoiding.

### H-4 — `proof:single-build-root` (I.W5 clause d) and the I.W2 static-lint clause are SOURCE-SHAPE gates wearing a "runtime wave" badge · correctly hygiene-labeled, but the wave's CLOSURE must not lean on them

I.W5 clause (d) (single `outDir` config invariant) and I.W1 clause (d) (`@typescript-eslint/
unbound-method` lint) are SOURCE-SHAPE/CONFIG gates — correctly LABELED hygiene. The risk is
subtle: I.W5's STRUCTURAL fix (the outDir collapse) is its actual deliverable, and clause (d) is
how you'd prove it — but a config-shape check is exactly the oracle class that can't see a
runtime defect. The runtime icon-paint gate (clause a/b) is the real correctness oracle and DOES
exist — GOOD. **Fix:** confirm in I.W5/I.W1 §spine bars that the WAVE'S green depends on the
runtime clause (icon-paint / suspend-no-throw), and the hygiene config/lint clause is strictly
corroborating. Most waves do this; make it uniform and explicit so no wave closes on a hygiene
clause alone. (This is the §S5 two-tier taxonomy applied to the NEW gates, not just the retired
ones — the overhaul must hold itself to its own taxonomy.)

### H-5 — B8 perf gate thresholds ("dropped frames ≤ N") are UNBOUND · "measure-first" is asserted but the budget number is a placeholder

I.W4 clauses (c)/(d) and the charter both say *"dropped frames ≤ N"* with `N` left symbolic.
The audit HAS the measured baselines (dock expand 12/114 dropped, p95 25ms, max 49ms; easing
playing 36 dropped / ~46fps, 62 under 4× throttle — `b16`). **The gap:** a gate with an unbound
threshold cannot be born-RED (you can't prove it fails at HEAD without a number) and invites the
exact "tune N until green" anti-pattern measure-first forbids. **Fix:** I.W4 must BIND `N` from
the measured baselines — e.g. born-RED requires the CURRENT 12/114 + 36-dropped to FAIL the
threshold, and green requires the post-fix budget (target ≈0 dropped at 60fps under the named
CPU throttle factor) to PASS. State the throttle factor (4× vs 6× — the waves say "4–6×", pick
one or gate both) and the dropped-frame ceiling as concrete numbers derived from `b16`, so the
gate is falsifiable. Without bound thresholds the perf clauses are aspirational, not gates.

### H-6 — The `proof:live-session` "fresh context per scene" vs CROSS-SCENE STATE · the B2 suspend/resume spec needs WITHIN-session continuity the harness pattern destroys

The harness pattern (modeled on `proof-no-orphan-specular.mjs`) uses *"fresh context per
scene"* (I.W7 S2, README §4). But B2's correctness property — *"the first scene SUSPEND+SAVE,
the next RESUMES iff it was playing before"* — is a CROSS-SCENE, WITHIN-SESSION continuity
property: you must PLAY scene A, switch to B *in the same session*, and assert B resumed-iff-A-
was-playing. A fresh context per scene RESETS the machine and localStorage between scenes,
destroying exactly the suspend→resume continuity the gate must observe. I.W1 clause (c) requires
this continuity; the harness as specified (fresh-per-scene) cannot provide it. **Fix:** I.W7 +
I.W1 must specify that the SWITCH legs run in ONE persistent context (the session battery is a
single browsing context that loads → plays → switches → switches back → replays, accumulating the
budget AND carrying the FSM/localStorage state), and "fresh context per scene" applies only to
the INDEPENDENT per-scene legs (load/play/icon-paint/specular-at-rest), not the suspend/resume
matrix. State the two harness modes explicitly so the resume-iff-was-playing assertion is
observable.

### H-7 — The net-new `this.transform` crash and the B5 "cubic-bezier" option-seam fault are FOLDED but their GATES are thin

- The net-new `this.transform is not a function` (E1, home›play) IS folded into I.W0 (S3) and
  gated by clause (a). GOOD — verified the anchor. **But the gate drives `#/cube` and `#/`
  (home); E1 fires specifically on the EMPTY HOME group (`useSceneMachineApp.ts:60-63`).** The
  clause must explicitly drive the rainbow play on HOME with NO animation selected (the exact E1
  repro, b10 §E1), not just cube — confirm clause (a) names the home-empty-group case, else the
  net-new crash's born-RED witness is ambiguous.
- B5's bare-`"cubic-bezier"` option-seam fault (E-B5, `AnimationOptionError`, b10 §B5) is folded
  as I.W0 S5 + I.W2 S3 (the readout must emit a re-parseable literal). **But no §Hard gate clause
  explicitly drives the construction path that throws it** (`resolveEasingOption ← setTimingFunction
  ← new CSSKeyframesAnimation`). I.W0 clause (d) asserts the editor shows re-parseable `@keyframes`
  — adjacent but not the same as the option-seam round-trip. **Fix:** add a clause (to I.W0 or
  I.W2) that constructs/round-trips a custom-bezier easing and asserts NO `AnimationOptionError`
  on the controls re-mount path — so E-B5 has its own born-RED witness, not an inferred one.

---

## §3 — THE MED FINDINGS (tighten; low risk)

### M-1 — The "97 gates" vs "98 gates" vs "102 proof keys" count drifts across docs
The charter says "~97/~98", `rc-gate-blindspot §1` counts "102 distinct `proof:*` script keys …
~98 nominal correctness gates", `recap-precepts` says "88 `proof:*` scripts". These are
RECONCILABLE (102 keys − meta/aggregators = ~98 nominal; 88 `.mjs` files + 14 vitest = ~98 with
some keys aliasing) and rc-gate-blindspot §1 DOES reconcile them — but the charter and recaps
quote bare numbers without the reconciliation, inviting a "which is it" challenge. **Fix:** the
charter should cite "~98 nominal correctness gates (102 proof keys − 4 meta; see rc-gate-blindspot
§1 for the census)" once, and use it consistently. Cosmetic but it is a numeric claim in a
tranche whose whole thesis is "verify the count first-hand."

### M-2 — I.W6 S3 "give the substrate depth" risks scope-creep beyond a B7 fix
B7 is "the specular bloom must be ABSENT." S3 (a page-substrate with "real depth to refract") is
a legitimate kf-owned styling change, but it is an ADDITIVE aesthetic enhancement, not a removal
of the defect — and clause (b) ("the glass plate reads as perceptual depth, not a flat near-white
rectangle") is a fuzzy perceptual assertion that could become a tuning rabbit-hole. **Fix:** scope
S3 tightly: the B7 CORRECTNESS gate is clause (a) (bloom absent) ONLY; clause (b) (legibility) is
a HYGIENE/aesthetic corroborator that must not BLOCK the wave's green (or be deferred to a follow-
up). Don't let "make the glass legible" hold the bloom-removal hostage. The user's complaint is
the bloom; the substrate is the gestalt-completion, not the deliverable.

### M-3 — DC-8 is folded as a "DECIDE" but the decision criterion is not stated
I.W5 S5 (DC-8 dead-CSS) says "KILL or RESTORE via `startViewTransition` — no fourth defer," but
does not state the DECISION RULE (when to kill vs restore). The P-invariant forbids a fourth
defer, but "DECIDE" without a criterion is a soft re-defer in disguise. **Fix:** state the rule —
e.g. "if the scene-swap VT CSS has a live `startViewTransition` consumer, RESTORE + gate it;
ELSE KILL (grep=0)." The default should be KILL unless I elects D11/FB-4 directional VT, which
the deferred ledger already flags as conditional. Make the default explicit so it cannot re-defer.

### M-4 — The IMMEDIATE deploy-revert is the most urgent item but is not a wave or a gated action
`PATH-FORWARD.md §4` + `PROGRESS.md §0` recommend REVERTING master to `d469e69` to take the
broken live demo off the air — correctly flagged as the most urgent item, independent of the
waves. But it is a recommendation, not a tracked deliverable with an owner and a verification
(did the revert ship the known-good tree to keyframes.babb.dev?). It also sits in USER-DOMAIN
(deploy + master mutation, confirm-first). **Fix:** elevate the revert to a named, owner-tagged
IMMEDIATE action in I.WZ's pre-amble (or a dedicated I.W-IMMEDIATE note) with its own verification
(post-revert, drive `proof:live-session` against the LIVE keyframes.babb.dev and assert the known-
good budget). As written it is sound advice that could fall between the wave cracks. (Also: confirm
`d469e69` is genuinely the right ancestor — PATH-FORWARD asserts "20 commits back, pre-H, clean"
but does not show the `git log` evidence; the IMPL must verify the revert target before acting,
since a wrong revert target re-ships a different broken state.)

---

## §4 — WHAT IS GENUINELY STRONG (the honest credit — do NOT re-litigate these)

So the author lanes know what NOT to touch:
- **The root causes are confirmed at the seam, first-hand.** Every load-bearing anchor I
  re-checked (group.ts transform lie, playback `_gen`, the two unbound call sites, square's
  scoped select-none + reseat(0,0), amiga's corner-vs-origin, the reka passive latch) is EXACTLY
  as cited. This is not theorized-from-source; it is reproduced.
- **The fix directions ARE transpositions, not patches.** Each wave names the workaround and
  REJECTS it (the `try/catch` floor, the per-call-site arrow wrap, the `::before{content:none}`
  neutralizer, the demo-side `--rotationX` band-aid, the `nextTick` re-assert, the periodic `rm`
  of the orphan). The no-legacy "delete in one motion" is specified per wave.
- **The gate-ORACLE precept is the correct, singular cure** — re-point the oracle, collapse the
  proxy lattice to ONE driven session, two-tier the source-shape gates as HYGIENE, rewire
  chronic-closure to require runtime gates that bit + forbid vaporware handoffs. This IS the
  blindspot's antidote.
- **The prompt-recap is honest and complete** A→H with claimed-vs-actual, BROKEN/REGRESSED legend,
  and the inv-ε-irony self-indictment (C invented inv ε; H violated it at scale).
- **The chronic/deferred fold is thorough** — the four H chronics re-examined LIVE one by one, the
  two fictional handoffs converted to real folds, DC-8 de-punted, the honest "already-done" ledger
  (φ-hero, dock spring, mobile bones, cartoon panels) that manufactures NO false I work.
- **The engine un-fencing (inv-16 relaxation) is correctly scoped** — `src/animation` in for
  B1/B2/B3 transpositions, glass-ui/value.js/parse-that still consumed-published.

---

## §5 — THE FIX-LIST (the born-RED tasks the author lanes own, in priority order)

| ID | Severity | Owner wave(s) | The fix (one line) |
|---|---|---|---|
| **RED-1** | BLOCKER | charter + ALL waves + PROGRESS + PATH-FORWARD | Reconcile the TWO contradictory wave-numbering plans (overhaul LEADS vs CLOSES) to ONE; bind the gate-PRECEPT as a charter invariant from t=0 so it is mechanically prior, not asserted backward. |
| **RED-2** | BLOCKER | recap-chronic | Correct §2 B2 + §8 to the ADJUDICATED root cause (unbound method → bind-proof), not the RULED-OUT "unarmed scene → null-guard suspend"; note b12's hypothesis was ruled out by rc-dfa-gen §1b. |
| **RED-3** | BLOCKER | I.W7 + I.W1 | Make the SYNTHETIC `visibilitychange` the B2 born-RED-of-record; resolve `_gen` dist-vs-dev (run it on dist or name the dev-server exception); de-couple the B2 witness from the B8-blocked dock gesture. |
| **H-1** | HIGH | I.W6 (+ all) | Remove the SOURCE-SHAPE `OR`-escape from correctness clauses (specular class-absence → perceptual luminance primary). |
| **H-2** | HIGH | I.W7 | Define the `proof:live-session` error budget ONCE as a structured allowlist (errors/`"......"` hard; ReadPixels/content-visibility warns promoted; dev source-map noise excluded); every wave inherits it. |
| **H-3** | HIGH | I.W0 / I.WZ | Add a HYGIENE-tier `engine.ts ≤ 1400 OR named-measured-split` gate (C-6 ceiling enforced, not hoped). |
| **H-4** | HIGH | I.W1 / I.W5 (+ all) | Hold the NEW gates to the two-tier taxonomy: wave green depends on the RUNTIME clause; config/lint clauses strictly corroborate. |
| **H-5** | HIGH | I.W4 | BIND the dropped-frame thresholds `N` + the CPU-throttle factor from the `b16` baselines (born-RED requires HEAD to fail the number). |
| **H-6** | HIGH | I.W7 + I.W1 | Specify ONE persistent browsing context for the suspend/resume/switch legs (fresh-per-scene only for the independent legs) so resume-iff-was-playing is observable. |
| **H-7** | HIGH | I.W0 / I.W2 | Name the HOME-empty-group case in the `this.transform` clause; add a born-RED clause for the bare-`"cubic-bezier"` `AnimationOptionError` round-trip. |
| **M-1** | MED | charter + recaps | Quote the gate count with its reconciliation once (~98 = 102 keys − 4 meta). |
| **M-2** | MED | I.W6 | Scope S3 substrate-depth as a non-blocking hygiene corroborator; bloom-absent (clause a) is the B7 deliverable. |
| **M-3** | MED | I.W5 | State the DC-8 KILL-vs-RESTORE decision rule (default KILL unless a live VT consumer exists). |
| **M-4** | MED | I.WZ / IMMEDIATE | Elevate the `d469e69` deploy-revert to an owner-tagged tracked action with post-revert live verification; verify the revert target's `git log` before acting. |

---

## §6 — THE TERMINAL READING (one paragraph)

Tranche I's audit is honest, first-hand, and re-runnable, and its fix directions are genuine
architectural transpositions — this is NOT another paperwork tranche. The gate-ORACLE precept is
the correct, singular cure for the catastrophe, and B1–B9 + the chronics + the deferrals all map
to a wave with a born-RED runtime gate. **But three structural defects must be fixed before IMPL,
and all three live at the gate-regime seam the tranche exists to repair:** (RED-1) the headline
overhaul is sequenced LAST in the wave files while the charter says it LEADS — two contradictory
DAGs, the precept's authority asserted rather than mechanically prior; (RED-2) the audit
contradicts itself on the B2 CRITICAL root cause, the chronic ledger still prescribing the
ruled-out "null-guard suspend" workaround the wave forbids; and (RED-3) the headline
`proof:live-session`'s keystone B2 clause cannot bite born-RED through the user gesture it
specifies — the dock is B8-blocked on the broken tree and `_gen` is dev-only on the dist — so
"would it have caught B2?" honestly answers "only synthetically, only on the dev server, never via
the human's actual switch on the actual artifact." Fix those three and bind the seven HIGH gaps
(the source-shape `OR`-escapes, the unbound perf thresholds, the budget definition, the
fresh-context-vs-continuity conflict, the line-ceiling gate, the two-tier discipline on the new
gates, the thin net-new/option-seam witnesses) and Tranche I closes the blindspot for good. Leave
them and the next tranche inherits a gate regime whose own headline gate has the blindspot built
into its keystone clause — the deepest irony the project could ship.
