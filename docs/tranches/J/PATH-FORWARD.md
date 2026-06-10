# Tranche J — PATH-FORWARD (the executive summary)

**Branch:** `tranche-j-dev` (forked off `master` @ `4072af9` = the I-close tip + the adopted
post-close tail; clean tree; kf `4.1.0`-base).
**Type:** TRANCHE DEVELOPMENT — this document, the `J.md` charter, `PROGRESS.md`, the per-wave
specs, and the glass-ui handoff doc are the deliverable, atop the 47-doc audit corpus already on
disk. **No source/test/CI/demo is edited here. No commit is made. The IMPL phase awaits explicit
authorization, gated on green CI — the D→I dev/impl boundary.**
**Date:** 2026-06-10.

This is the one-page reckoning a reader needs before the impl phase opens: **what the audit found
at the five boundaries I never crossed, why I's regime — which it certified honestly at its own
surface — could not see them, the wave order that closes them, and the immediate deploy-integrity
P0 that must land first because it gates every later wave's verification.** I ended the
gate-blindspot at the product *surface*; J finds the SAME blindspot shape survives at every
boundary BEYOND that surface, and extends the one move — the gate-ORACLE precept — outward to each.

---

## §1 — WHAT THE AUDIT FOUND (the five boundaries + the latent seam classes)

The J audit ran **32 systemic lanes + 14 design lanes — 47 evidence docs (incl. the post-fleet sota-landscape addendum) under `audit/`, every
claim tree-verified — surfacing 17 P0 · 120 P1 (82 systemic + 38 design) · 95 must-fold candidates
· 64 glass-ui ledger items** (`J.md §finding-cluster`; doc count confirmed `ls audit/*.md`=32,
`ls audit/design/*.md`=14). I's close HOLDS at the surface it certified — the engine fixes verify
`file:line`, the two-tier taxonomy is real and machine-enforcing at desktop-1440, the fictional H
handoffs genuinely landed (`final-vs-tree-inv-epsilon.md §A`; `deferred-ledger.md §0`). The defect
is that the same proxy-vs-product gap recurs at every boundary the product crosses to reach a human:

- **The deploy boundary.** The build a human gets is the build that was certified — but only
  because the I close deployed it BY HAND. CI itself had been YAML-invalid since H.W12, so it
  *never ran* and `deploy-pages.yml` never fired on any master push for days; the live site was
  frozen pre-H, and the FINAL's "merge → green CI → CF auto-deploys" was structurally impossible
  when written (`wave-I.WZ-postclose.md §B`; `final-vs-tree-inv-epsilon.md` INVE-1/P0-1). The
  auto-deploy chain is now re-armed but blocked on `proof:scene-control-dfa` — a fixed-`settleMs=1600`
  gate the I close itself recorded "STILL OPEN," over a REAL product lag (the dock control-tab
  trigger TEXT renders `null/stale` after a hash-nav until the FSM settles — empirically witnessed,
  CI run `27228309606`, `panel:true / trigger='null'`), with ~60 demo-smoke gates after it that
  have NEVER executed on Linux (`ci-linux-open-item.md` CI-1/CI-5; `wave-I.WZ-postclose.md §C/§E/§F`).
- **The publish boundary.** npm publishes `4.1.0` — which is also the tree version — while
  `src/animation/index.ts` ships a GSAP/Motion-One-class **orchestration tier of 16 public exports**
  (`SpringProgress`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`, `decay`,
  `Sequence`, `animate`, motion-path, draw-svg) accreted E→I and never published; two pending
  changesets both say `patch`, papering a tranche-spanning new public surface; the README teaches
  4 of ~13 primitives; `decay.ts` is the one public module with no test
  (`scope-adversary.md §0-§1`).
- **The docs boundary.** The repo's own front door lies: root `CLAUDE.md` documents a 10-module
  `src/animation` tree (28 exist), a "15 files / 261 tests" `test/` (the tree has 69 top-level
  `*.test.ts` / 685 tests — stale by ~4.6× on file count, ~2.6× on test count), and ghost demo
  directories. Stale docs are legacy code; the no-legacy precept applies (`deferred-ledger.md §1H`;
  `scope-adversary.md §1`).
- **The axes boundary.** `proof:live-session` — the I gate-of-gates — is **desktop-1440-only**:
  mobile viewport, touch, `prefers-reduced-motion`, dark mode, keyboard/focus, and the
  playground/uncovered scene legs are all un-exercised (every `newContext` is `{width:1440}`;
  `grep isMobile|reducedMotion|colorScheme`=0); `proof:lighthouse-mobile` is in NEITHER tier (an
  orphan); the CH-3 "mobile" chronic is certified by desktop-mouse gates (`final-vs-tree-inv-epsilon.md`
  INVE-2/P0-2).
- **The design boundary (the user's J directive).** The 14-lane design audit over 48 screenshots
  finds the design language PRESENT but CONCENTRATED: the audacious Instrument Serif display voice
  appears at exactly ONE moment (the home hero) and no scene echoes it; the subject palette has
  collapsed to a single green while the icons sing a six-colour rainbow; the protagonist subject is
  undersized/unplated on most stages; the storyboard register forks into three control-placement
  grammars with a hollow 400px ghost rail; the amiga stage is a hard-edged gray slab among rounded
  glass plates; on mobile the hero TYPE and the SUBJECT collide (`design/cross-hierarchy.md`
  TOP-10 #1/#2/#3/#5/#7).

**Underneath the boundaries — the latent defect classes at the seams I repaired.** The I.W0
serialize-from-template transposition was applied at ONE seam while the sibling per-card serializer
(`CSSKeyframesToStrings`/`CSSKeyframeToString`) still rides the old DOM-resolving path,
live-consumed by the editor (ENG-1); a latent `templateFrames[undefined]!.transform` deref survives
in `createFrame` (ENG-2); the empty-only selector guard still cryptic-throws on non-empty garbage
(SEAM-1); the LOAD-BEARING value.js empty-input contract has NO kf-side pin test (SEAM-2); two drag
surfaces still bypass the shared seam (W4-3/W4-4); and the estate debt of the regime itself — 43
gates re-declare `serveDist` byte-identically, `proof:all` is NOT the CI gate set, the meta-gate
hardcodes 9/10 correctness gates, and the I "collapse the lattice" thesis was never executed (the
count GREW 103→109) (`J.md §finding-cluster`; `wave-I.WZ-postclose.md §D/§E`).

---

## §2 — WHY I'S REGIME MISSED IT (the boundary displacement — the un-exercised axis re-seeded)

I did not regress. Its FINAL is, on its own terms, **largely honest and unusually well-grounded** —
every fix `file:line`, every gate script, every chronic citation, the version facts, the ARCH kills
verify against the tree (`final-vs-tree-inv-epsilon.md §A`). I's regime missed the five boundaries
for the same structural reason it was founded to fix at the surface: **the oracle was pointed at a
place one step short of where a human meets the product** — and the I-doctrine names exactly this
shape: *the un-exercised axis is where the next lie lives.* It re-seeded one boundary over.

Two findings make the displacement mechanical, and they are precisely the two inv-ε gaps the audit
caught in I's own FINAL:

- **INVE-1 — the deploy causal model was FALSE.** FINAL §1/§8 assert a green-CI ⇒ auto-deploy
  round-trip that *physically could not happen*: CI had been YAML-invalid since H, a fact the
  repo's own later commit `4072af9` admits, and the actual deploy was a MANUAL
  `wrangler pages deploy` bypass (`final-vs-tree-inv-epsilon.md` INVE-1/P0-1, citing
  `I-WZ-verify.md:316-325,308-314`). This is the one claim that would have been caught by *actually
  trying the deploy* — which is what happened only AFTER the FINAL was written. The deploy boundary
  was certified by paperwork, never actuated.
- **INVE-2 — the headline correctness claim had named, structural blind axes.** §9's
  "live-session GREEN means a human sees it work" is true only of *a desktop human at 1440px with a
  mouse, no reduced-motion, light theme, switching to one scene*. The precept ("error budget 0
  across PLAY+SWITCH+DRAG") is honored — but the precept itself is silent on viewport/input/media
  axes, so the gate inherits the blind spot (`final-vs-tree-inv-epsilon.md` INVE-2/P0-2). The
  gate-of-gates is desktop-light-mouse-only — the I-lesson recurring one viewport-width over.

And the post-close tail makes the displacement a *governance* failure, not just an oracle one: the
gates that actually hard-gate deploy (`scene-control-dfa`, `scene-transition-perf`, `occlusion-gate`,
`demo-smoke`) are ORPHANED from the I.W7 two-tier taxonomy — none are in
`proof:correctness`/`proof:hygiene`/`proof:all` — which is exactly why local convergence missed
them and the 8 latent issues surfaced only when CI finally ran (`wave-I.WZ-postclose.md §D` Finding
(d); `final-vs-tree-inv-epsilon.md` P1-1). **A boundary certified by hand, by paperwork, or at one
viewport is NOT certified.** J's correction is one move applied everywhere: extend the gate-ORACLE
precept to every boundary — the **boundary-ORACLE extension** (`J.md §invariants`).

---

## §3 — THE REMEDIATION SEQUENCE (the wave order + DAG)

The deploy boundary is the P0 hazard and its primitives are consumed by every later wave's
verification, so **J.W0 LEADS**. J.W1 ∥ J.W2 ∥ J.W6 run parallel (file-disjoint: engine /
demo-behavior / measurements). J.W3 follows J.W0 (consumes the `navToScene` primitive; owns the
estate). **The design suffusion SPLITS along its natural fault line — W7a ∥ W7b**: **J.W7a**
(the APPEARANCE-GRAMMAR half) follows J.W2 (shared demo files — behavior first, then appearance)
and re-captures the visual-lock baseline in its close motion, on J.W4's critical path; **J.W7b**
(the CONSUME-EDGE + glass-ui HANDOFF half) is file-disjoint from W7a, owns NO kf appearance delta,
is gated ONLY on AX PUBLISH (inv-16 sibling-coordination), and runs PARALLEL to the W2→W7a chain
— it is NOT on J.W4's path. **J.W4's legs are PARTITIONED by their actual upstream dep, not
serialized whole:** the APPEARANCE-CERTIFICATION legs gate on J.W7a + J.W3 (they assert
post-suffusion appearance facts); the APPEARANCE-INDEPENDENT input-modality legs gate ONLY on
J.W0 + J.W3 and land as soon as the harness does, parallel to the W2→W7a chain. The longest
serial path is therefore **W0 → W2 → W7a → W4(appearance-certification legs)**, with W4's
input-modality legs running parallel to it. J.W5 is parallel to all (docs/packaging) with its
changeset cut LAST among waves. J.WZ closes (`J.md §WAVE MAP`).

- **J.W0 — THE DEPLOY BOUNDARY (leads, P0).** Formally adopts the I post-close tail (the 8 commits
  get their tranche home), lands the `navToScene(page, sceneId, expected)` per-expected-state
  primitive in `scripts/lib/demo-driver.mjs`, and makes the dock trigger projection born-correct
  from the DFA so the control surface never renders the SOURCE scene's stale label during a
  transition — both the gate fix AND the product fix, no workaround (`ci-linux-open-item.md §4`;
  `wave-I.WZ-postclose.md §C`).
- **J.W1 — THE ENGINE TOTALITY PASS.** Closes the latent seam classes I left half-repaired: the
  per-card serializer unified onto serialize-from-template (ONE serialization authority); `createFrame`
  made total; the selector guard rejects ALL non-conforming input with the typed error; the kf-side
  pin for the value.js empty-input contract; the inverted unit pyramid restored (the I engine fixes
  earn unit tests, not browser-gate-only coverage).
- **J.W2 — THE DEMO SEAM COMPLETION.** Drives the B6 latent drag class to ZERO (every
  pointer-capture surface routes through the shared seam), completes the `selectedControl`
  single-writer, drives the mobile sheet off the spring settle signal, and executes the
  `AnimationMenuBar → TransportDock` rename the D FINAL falsely claimed closed.
- **J.W3 — THE ESTATE INDUSTRIALIZED (net-deletion).** Migrates the 43/51/54 `serveDist`/MIME/chromium
  copies onto the shared `scripts/lib/` harness (≈2 kLoC deleted), installs the ONE `IN_CI` helper
  with per-gate declared P6 on-device posture, makes `proof:all == the CI roster` (so the orphaned
  deploy-gates can never hide again), and KILLs `proof:repin-safe`. Gate COUNT and estate LoC measured
  strictly DOWN — completing the collapse I claimed (`wave-I.WZ-postclose.md §D/§E`).
- **J.W4 — THE AXES BATTERY.** Teaches `proof:live-session` the human axes I never exercised:
  mobile (390×844, touch), reduced-motion, dark, keyboard/focus, and the widened scene sweep;
  re-certifies CH-3 on a MOBILE oracle; gives `proof:lighthouse-mobile` a tier under its P6 posture
  (`final-vs-tree-inv-epsilon.md` INVE-2).
- **J.W5 — THE PUBLISHED SURFACE.** Installs `proof:published-surface` (the publish oracle: tarball
  surface == source exports == README API), authors the HONEST minor consuming both pending
  changesets, completes the README to all ~13 primitives, and REWRITES the rotted docs to the tree
  (`scope-adversary.md §0-§1`; `deferred-ledger.md §1H`).
- **J.W6 — TERMINATIONS (P-invariant-28).** The four ≥4-tranche riders exit via probe-or-KILL with a
  measurement artifact — FB-2 sync-step, SoA `lerpArray`, FB-5 intrinsic-size, FB-6 `Mod+K`; plus the
  Three.js named-import tree-shake and the EF-3 shim retirement (`deferred-ledger.md §3`).
- **J.W7a — THE APPEARANCE-GRAMMAR SUFFUSION (on J.W4's critical path).** Makes every stage subject
  the unambiguous protagonist, suffuses the Instrument Serif display voice from the doorway through
  every pane, parameterizes `.progress-ball` via the `--ball-tone` seam so each subject keeps its
  icon's hue, kills the ghost rail and unifies the storyboard grammar. Every visual delta NAMED +
  enumerated (the isomorphic exception); the visual-lock baseline re-captured IN this wave's close
  motion — the half J.W4's appearance-certification legs certify (`design/cross-hierarchy.md`).
- **J.W7b — THE CONSUME-EDGE + glass-ui HANDOFF (inv-16 sibling-coordination; file-disjoint from W7a;
  NOT on J.W4's path; parallel, AX-gated).** Consume-to-delete — each kf-hand-rolled surface deleted
  in the same motion the published glass-ui primitive is consumed (no legacy beside its replacement) —
  and routes the 25 REFINE + 21 ABSTRACT glass-ui items to `glassui-AX-handoff.md`; kf consumes only
  what AX PUBLISHES, never a kf-side patch. Owns NO kf appearance delta and re-captures NO baseline
  (`design/glassui-adopt.md`, `design/glassui-abstract.md`).
- **J.WZ — CLOSE.** FINAL held to inv-ε, the prompt-recap, the changeset version cut + npm publish
  (USER-DOMAIN, Mike Babb, confirm-first), and the auto-deploy round-trip RE-observed on the close
  merge.

---

## §4 — THE IMMEDIATE ITEM: the deploy-integrity P0 (J.W0 leads)

**The auto-deploy chain is armed again and rests on a gate the I close itself declared not robust —
this is the single biggest blocker between green CI and a trustworthy live site, and it gates every
later wave's verification.** `deploy-pages.yml:42-46` auto-fires iff the `ci` workflow concludes
`success` on a master push; `ci.yml:321-322` runs `proof:scene-control-dfa` as a HARD gate with no
`continue-on-error`; that gate's `navByHash` waits on the EARLY `activeScene` localStorage fact then
a fixed `settleMs=1600`, while the destination control-tab trigger TEXT lags via the mounted scene
component's `extraControlTabs` — so on a loaded Linux runner the trigger reads `null` and the gate
reds (`ci-linux-open-item.md §1-§2`, CI run `27228309606`). A flake either reds CI (blocks the
fix-ship) or its intermittent green masks instability (`scope-adversary.md §1`). And because the job
has zero `continue-on-error`, the ~60 demo-smoke gates after line 321 have **never executed on Linux**
— a second wavefront of env-coupling J must budget for (`ci-linux-open-item.md` CI-5/§5).

This is NOT a workaround target. The cure is the `navToScene(page, sceneId, expected)` primitive in
`scripts/lib/demo-driver.mjs`: a per-EXPECTED-destination-state settle keyed on the destination's
trigger label (trigger-ABSENT for panel-less scenes), with a generous timeout as a CEILING — not a
fixed wait, not a `continue-on-error`, not an `IN_CI` escape on a correctness gate
(`ci-linux-open-item.md §4`; the reverted `66855c2` escape-hatch was a structural no-op because
`trigger-present` is satisfied immediately by the SOURCE scene's stale trigger). The PRODUCT half is
co-equal: the dock trigger projection is made born-correct from the DFA so it never renders the
stale label during a transition (the I.W2 single-authority principle extended to the dock projection).

**"One observed round-trip"** is the J.W0 oracle, and it is the deploy boundary's correctness oracle
that actuates the running product — per the boundary-ORACLE precept (`J.md §invariants`): a REAL
master push → green CI (demo-smoke end-to-end GREEN on the Linux runner, `scene-control-dfa`
included, zero escapes) → `deploy-pages.yml` auto-fires → the live site serves the pushed bytes.
Born-RED witness: the gate red on the recorded CI run `27228309606` failure shape (`trigger='null'`
under load) before the cure. Until this round-trip is observed end-to-end, the deploy boundary is
certified by hand — exactly the INVE-1 lie J.W0 exists to make true (`J.md §ENFORCEMENT`;
`final-vs-tree-inv-epsilon.md` INVE-1).

---

## §5 — THE TERMINAL READING (one paragraph for the charter)

I bound the gate oracle to the running product and proved the product true at one desktop viewport —
then shipped it by hand, on a version npm has never seen, under docs describing a tree that no longer
exists, certified on no axis a phone or a motion-sensitive or a keyboard user touches, wearing its
design language at one doorway only. The regime did not fail for lack of discipline; it pointed a
rigorous oracle one step short of where a human meets the product, and the I-lesson — *the
un-exercised axis is where the next lie lives* — re-seeded at every boundary BEYOND the surface I
certified. **J's correction is singular: the same oracle discipline, extended to every boundary the
product crosses.** The deploy chain earns an OBSERVED green-CI → auto-deploy round-trip on a cured,
per-expected-state gate; the npm surface earns the honest minor with a `proof:published-surface`
oracle and a README that teaches what actually ships; the docs are rewritten to the tree because
stale docs are legacy code; the live-session battery learns the human axes — touch, reduced motion,
dark, keyboard, every scene; and the design language — glass, grid, math, the audacious serif, the
rainbow the icons already promised — suffuses from the doorway through every pane via the tone seam,
the display rungs, and the consume-to-delete glass-ui edges, with every general primitive kf invented
handed off to glass-ui where it belongs. Underneath, the seams I repaired are made TOTAL, the estate
collapses onto the lib it already half-owns under a net-deletion rule, and every rider that has
outlived four tranches exits — probe or KILL. When J closes, "green" means: **a human anywhere — on
the live site, from `npm i`, in the README, on a phone, in the dark, with motion stilled — meets the
same true, whole, beautiful product.**
