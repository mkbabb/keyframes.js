# Tranche T — Band T.M — THE MECHANISM (first in the DAG; gates every wave-close)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Why this band is first.** The headline meta-fact (VERDICT header; lane 29): the S impl
> demo passed **85/85** deploy-gating roster gates + the **184**-member node roster +
> 11×100% critic convergence + every born-RED oracle — **and the owner rejected it on
> sight.** For **≥9 of the 22** verdict items the fleet did not merely *miss* the defect,
> it **enforces the rejected state**: `square-honest` asserts the panel is ABSENT,
> `gesture-manifest` MANDATES the legends the owner ordered removed, the hero-rung gates
> crystallize the rejected word-split. K's TASTE-VERDICT protocol existed and was silently
> skipped for all of S (`docs/tranches/S/*VERDICT*` → **no matches**; verified). T.M cures
> this **structurally, before any other band closes a wave** — every band's appearance/
> design waves consume the born-OWNER gate class this band builds.
>
> **The doctrine in one line (lane 29 Part III).** T gates must be **owner-anchored**
> (golden and verdict come from the owner, not from the tree-as-shipped) and
> **quality-shaped** (legibility, fullness, sanctioned-inventory — not existence and
> non-drift). *A gate whose green can coexist with "reject on sight" is a hygiene gate
> mislabelled as a bar.*
>
> **Lanes:** 29 (ALL), 24 (recs 1,2,6,7), 26 (recs 1,8), 27 (rec 4), 28 (gate-teeth
> mechanics; the PROMPT-RECAP.md ledger artifact is a co-authored corpus file — cross-ref).

## The born-OWNER gate class (what T.M defines, and every other band consumes)

The S.A4 re-taxonomy fixed the **tier** question (hygiene vs correctness, source vs
runtime — `proof:gate-is-runtime` enforces it well). It never touched the **authority**
question: *who blesses appearance and taste, and is that blessing a blocking gate?* T.M
adds three oracle species the 203-gate fleet has never had, plus the process teeth that
make them binding:

- **BORN-OWNER** = a gate whose GREEN cannot be reached without a committed owner token
  (a filled verdict / a blessed golden frame). Required for *any* taste/appearance/
  interaction disposition. This band builds the mechanism (M1/M2/M3/M6); bands T.A/T.C/
  T.D/T.E author their per-wave born-OWNER oracles *on top of it*, each citing its
  charter §3 OD row (charter rule: **no design wave's born-RED oracle is authored until
  its OD row carries an owner token** — M2 is the enforcement surface for that rule).
- **OWNER-GOLDEN** reference oracles (M3) — not self-baselines.
- **QUALITY-SHAPED** oracles — legibility/fullness (M5) and negative-space/sanctioned-
  inventory (M4) — assert *quality*, not *existence*.

T.M's own waves are **BORN-RED** (they red on today's S tree because the mechanism does
not yet exist), except M3, which is additionally **BORN-OWNER** (its green needs a
blessed golden). None of T.M's waves is itself a taste disposition — they are the
machine that makes taste dispositions enforceable.

---

## T.M1 — `proof:owner-verdict-recorded` (revive K's TASTE-VERDICT as a blocking per-wave gate)

- **scope.** A blocking hygiene gate that REDs unless **every appearance/taste wave in
  the tranche carries a committed taste-packet artifact with the verdict slot FILLED**.
  Revive `docs/tranches/K/TASTE-VERDICT.md` (verified present — the precedent) as the
  per-tranche/per-wave artifact form; `docs/frontend-design/taste-packets/` today holds
  only `l-w11` (verified). `proof:taste-packet`'s own header states it proves only that
  the *generator* works and "produces **no committed artifact**" — so nothing in the
  204-gate fleet asserts a verdict was ever RECORDED. This gate closes that hole. Wire
  its key into `scripts/proof-ci-coverage.mjs` so an appearance wave cannot reach close
  without it.
- **gate.** **BORN-RED.** Reds on today's tree: no `docs/tranches/S/*VERDICT*` exists
  (verified: no matches), the S impl closed all-green with zero recorded owner verdict,
  and no `proof:owner-verdict-recorded` key exists in `package.json`. Greens only when a
  committed, non-empty owner verdict covers each appearance wave. (Green requires an owner
  token → this gate is the ENABLER of the born-OWNER class; the artifact-presence check
  itself is a process fact, not a taste judgment.)
- **size.** M.
- **lanes.** 29 rec 1 (T-GATE-OWNER); 24 rec 1 / F1 (taste-inclusive wave-close contract).
- **edges.** Gates the close of **every** appearance wave in T.A / T.C / T.D / T.E. Pairs
  with **T.M2** (M1 = the RECORDED artifact at close; M2 = the PRE-authoring sign-off +
  the convergence≠sufficient contract — both required). Its verdict tokens feed **T.M3**
  (owner-golden) and **T.M10** (the recap spirit column). Enforces charter §3 (the OD
  rows) jointly with M2.
- **lockstep.** `proof:taste-packet` STAYS (proves the generator) but is explicitly
  re-declared NON-authoritative for the verdict; the roster aggregators
  (`scripts/run-all.mjs`, `demo-roster.mjs`, `proof:ci-coverage`) gain the new key in the
  same motion — never leave `taste-packet` standing as the de-facto taste bar.

## T.M2 — `proof:owner-review-gate` (taste sign-off BEFORE the born-RED oracle; convergence ≠ sufficient)

- **scope.** The design-wave close contract, encoding lane 26's core mechanism: **a
  born-RED gate is the crystallisation point of a disposition — for a *design* wave it is
  a taste-manufacturing machine.** Authoring `proof:gesture-manifest` (tell-or-RED)
  *fixed* the disposition "every affordance must have an on-stage legend"; the entire
  fan-out then drove to green with 100% convergence — i.e. drove to the owner-rejected
  state, at scale, provably. Two teeth: **(a)** an owner (or owner-proxy live-review, the
  pass-3 chrome-devtools-mcp + live-shot pattern) captured-render review of the *intended*
  surface must exist BEFORE the wave's born-RED oracle is authored; **(b)** a design/
  appearance/interaction wave marked CLOSED without a paired owner-review token REDs —
  critic-convergence + green born-RED oracle is declared **necessary but NOT sufficient**
  to close a design wave. This is the S.E shelf lesson ("critic consensus ≠ owner verdict;
  put the owner review inside the design loop") made **structural**, and moved UPSTREAM to
  gate-authoring time (lane 26: the divergence is baked the moment the gate exists).
- **gate.** **BORN-RED.** Reds on today's tree: the S.G1/G2/G3 design waves closed on
  per-item born-RED oracles + critic-convergence with **zero** running-demo owner
  checkpoints (lane 28 F3) and no pre-authoring taste artifact; `PROGRESS.md:70` shows
  S.G2 closing on named oracles alone. Plant a token-less CLOSED design wave → RED; plant
  a born-RED design oracle authored with no paired pre-authoring taste artifact → RED.
- **size.** S.
- **lanes.** 26 rec 1 / F4 / F5 (owner-taste sign-off as a PRECONDITION of authoring a
  design-wave born-RED gate); 28 rec 2 / F3 (owner-review as wave-closure precondition).
- **edges.** The **enforcement surface for charter §3**: the OD-1..OD-6 rows cannot have
  their design waves' born-RED oracles authored until the OD row carries an owner token
  (the prototypes on :5180 are the vehicle). Binds T.A / T.C / T.D / T.E design waves.
  Complements M1 (recorded-at-close) and is asserted a second time by M10 (the recap
  gate's non-vacuity clause (c)).
- **lockstep.** Extends/supersedes the `proof:tranche-template` close template so a design
  wave's CLOSED status reconciles against its owner-review token; the "disjunctive-spec
  trap" (lane 26 F4: the square oracle offered *fix-OR-remove* and the impl took *remove*,
  which the oracle then certified) is forbidden — a "fix-OR-remove" oracle may not close on
  the remove branch without an owner token that removal is the intended disposition.

## T.M3 — `proof:owner-golden` (owner-anchored perceptual reference oracle; retire the visual-lock self-baseline)

- **scope.** Replace `proof:visual-lock`'s **self-captured baseline + full-subject mask**
  with an **owner-blessed reference render** and a perceptual (SSIM / pHash under PRM)
  diff that keeps the subject IN the comparison. `proof-visual-lock.mjs:10-17` (verified)
  declares itself a HYGIENE-tier drift TRIPWIRE, "correctness authority STRIPPED
  (ci.yml:287)," baseline SELF-CAPTURED — and it MASKS "the amiga sphere, the CSS-3D cube,
  the engine balls, the typing dots," i.e. the exact subjects of verdict items #1/#4/#9/
  #21 are painted flat before the diff. The one appearance tripwire is blind to every
  rendering defect the owner cited and locks the rejected layout as its golden. The new
  gate captures baselines from an owner-blessed frame and would FIRE on the one-face cube,
  the bare-grid morph, the blur-blob icon.
- **gate.** **BORN-RED + BORN-OWNER.** Born-RED: reds on the one-face cube / bare-grid
  morph / blur-blob icon on today's tree. Born-OWNER: its GREEN cannot be reached until an
  **owner-blessed golden frame** is captured for each scene (consumes M1/M2's token
  mechanism) — "no drift from the golden" is meaningful only when the golden is
  owner-approved, not self-captured.
- **size.** L.
- **lanes.** 29 rec 2 (T-GATE-GOLDEN).
- **edges.** Lands AFTER the T.A/T.D scene rebuilds produce owner-approved renders (the
  golden frames come from those approved scenes); consumes owner tokens via M1. Parallel
  to **T.G**'s perf oracle re-home (both replace a self/OBSERVE baseline with an
  owner-acceptable target). Cross-ref **T.A** (cube full render), **T.E** (morph visible
  or pruned per OD-1).
- **lockstep.** `proof:visual-lock` is either retired or demoted to a pure no-drift
  corroborator once `owner-golden` lands — never cited as appearance authority (its own
  header already forbids that, `ci.yml:287`); the subject-mask list is removed in the same
  motion (never keep masking the subjects the golden must now judge).

## T.M4 — `proof:stage-inventory` (owner-sanctioned on-stage element manifest; the negative-space gate)

- **scope.** Per scene, the rendered on-stage element set == an **owner-sanctioned
  manifest**; superfluous chrome NOT in the manifest REDs. This is the **inverse of the
  DFA**: instead of "the control set equals the table," assert "the on-stage element set
  equals the owner-sanctioned inventory," so extra chrome — the cube `rx/ry/rz` readout
  (#5), the ghost tooltip / home divider / play-not-first ordering (#6), the controls
  surrounding pane (#7), the square caption block (#11), the cursor light (#22) — that is
  not in the manifest REDs. This is the gate that catches the **entire "never gated" class
  (Class D)** that no S oracle could touch ("no gate can assert this element should not
  exist"), and it **structurally replaces** `proof:gesture-manifest`'s inverted
  tell-mandate (which does the opposite — `proof-gesture-manifest.mjs:10-13`: "an entry
  WITHOUT a tell is a **hard RED** … surfacing the affordance is **mandatory**").
- **gate.** **BORN-RED.** Reds on the current tree: the #5/#6/#7/#11/#22 elements are
  un-manifested and still render (verified: the retire-target scenes/legends are all
  present). Greens only after the prune + a committed, owner-sanctioned per-scene manifest.
- **size.** M.
- **lanes.** 29 rec 3 (T-GATE-INVENTORY).
- **edges.** The per-scene manifests are authored WITH the furniture-strip / prune waves:
  **T.A** (cube readout, square/amiga captions), **T.B** (controls pane removal — the two
  floating GlassPanels), **T.D** (cursor-light disposition, OD-2), **T.C** (home divider,
  play-first, tooltip dedup), **T.E** (gesture legends, gallery door). Each manifest
  requires owner sign-off → consumes M1/M2. This gate is the REPLACEMENT that M7 installs
  as `gesture-manifest` is retired.
- **lockstep** (lane 18 rule). `proof:gesture-manifest` + `scripts/gesture-manifest.mjs` +
  the `GestureLegend.vue` layer + the 11 `data-gesture-tell` sites are retired in the SAME
  motion `stage-inventory` lands — never leave the inventory gate pointing at a tell the
  owner removed, never green the inventory by resurrecting the rejected legend.

## T.M5 — `proof:subject-legible` + `proof:subject-full` (legibility & fullness over existence)

- **scope.** Two quality oracles replacing existence proxies. **(a) `subject-legible`** —
  no blur filter over a glyph + an edge-energy floor, retiring the bbox-only
  `proof:icon-paint-live` (a) ("a PAINTING inline `<svg>` with a non-zero bounding box" —
  a blur-filtered/janky icon still has a non-zero box; existence ≠ legibility, #4).
  **(b) `subject-full`** — a **rendered-region** assertion, not an attribute read: the
  cube renders **all six faces** (`subject-animates`/`orbital-rotate3d`/`live-session` B1
  today certify "≥3 distinct interpolated transforms" — a single die-face that *tilts*
  passes, #1); the morph renders a **visible filled shape over the grid in-viewport**
  (`proof:morph-scene` reads the `d`-attr mutation on a possibly-invisible/grid-occluded
  path, #21). Both replace the ≥3-distinct-value / non-zero-bbox certificates that greened
  the rejected renders.
- **gate.** **BORN-RED.** Reds on today's tree: the blurred dock icon (#4), the one-face
  cube (#1), the bare-grid morph (#21). Greens only on the whole, crisp render.
- **size.** M.
- **lanes.** 29 rec 4 (T-GATE-LEGIBLE).
- **edges.** **T.A** owns the cube `--spin-energy` bloom-channel delete + amiga
  NaN/rotation cure that make `subject-full` green; **T.C** owns the dock icon de-blur
  (the resting `blur(3px)` — a glass-ui born-RED handoff) that makes `subject-legible`
  green; **T.E** decides morph (OD-1: visible-render oracle if kept, else pruned + this
  clause retired). The legibility oracle lands NOW and reds until those cures land.
- **lockstep.** `proof:icon-paint-live` (a)'s bbox clause is superseded/retired;
  `proof:morph-scene`'s attribute-read is reshaped to a visible-render oracle OR retired in
  lockstep if morph is pruned (M7 + T.E).

## T.M6 — `proof:gate-authority` (the authority axis in the meta-gate; the "blocking-not-OBSERVE" teeth)

- **scope.** Extend `proof:gate-is-runtime`'s tier taxonomy with an explicit **AUTHORITY
  axis**: every appearance-touching gate must declare whether its verdict is **INSTRUMENT**
  (correctness) or **OWNER** (taste), and **no instrument gate may stand as the appearance
  bar.** `proof-gate-is-runtime.mjs` (verified) already enforces the *tier* axis
  (hygiene/correctness, source/runtime) but has "no 'a human would LIKE' in its universe"
  — it is taste-blind by construction. This wave encodes the MEMORY lesson "critic
  consensus ≠ owner verdict" as a machine fact, and — critically — carries the
  **blocking-not-OBSERVE** requirement: an owner-authority perf/appearance gate may NOT be
  demoted to the OBSERVE-only bucket the way `perf-frame-budget` was (so a sitewide "god
  awful" cannot ride non-blocking, #19). This is where lane 29 rec 5 / lane 26 rec 3's
  "blocking, not OBSERVE" requirement is ENFORCED even though the perf GATE itself lives in
  **T.G**.
- **gate.** **BORN-RED.** Reds if any appearance-region gate lacks an authority
  declaration or claims taste authority while being an instrument gate. Reds today: zero
  gates carry an authority declaration, and the de-facto appearance gates (`visual-lock`,
  `icon-paint-live`, `gesture-manifest`) implicitly claim the bar they cannot hold.
- **size.** S.
- **lanes.** 29 rec 7 (T-GATE-META).
- **edges.** The **substrate** every T.M and cross-band appearance gate must carry: M1/M3/
  M4/M5 each declare OWNER authority; the retained instrument gates declare INSTRUMENT.
  **T.G**'s whole-roster perf gate must declare OWNER authority + blocking per this axis
  (the coordination point — the doctrine is T.M's, the gate is T.G's; see Disposition
  29-rec-5).
- **lockstep.** `proof-gate-is-runtime.mjs` extended; every retained appearance gate gains
  an authority header field in the same pass (a gate that touches appearance without the
  field REDs the meta-gate).

## T.M7 — Feature-coupled gate retirement pass (the lockstep-coordination wave)

- **scope.** Delete the **Class-A inverted / feature-dead** S gates AS their features are
  removed or redesigned, and widen the one KEEP-but-WIDEN gate. All verified present on the
  tree today. Retire: `proof:square-honest` + the `scene-control-dfa` `square: []` row
  (#12/#25 — restore the triad; re-table square into the triad scenes, the DFA gate
  survives, the row is rewritten); `proof:gesture-manifest` + `gesture-manifest.mjs` + the
  `GestureLegend` layer (#8/#15 — replaced by M4's inventory gate); `proof:easter-egg` (the
  Gallery + seven eggs) + `proof:design-refinement` (all nine instrument-eggs incl. S1
  typing card, S5 easing smear — #2/#13/#15); `proof:easing-sidebar-minimal` /
  `-normalized` / `easing-stage-is-ball` / `easing-canvas-bounded` (#16 — the ball-preview
  *intent* survives, #14, the surface-locks die); `proof:hero-rung` / `hero-balance` /
  `hero-cls` + `proof:appearance-suffusion` clause (c) (hero∩cube==0) +
  `proof:demo-usability` clause 2 (per-word) — re-spec for per-CHAR uplift, hero lower/
  centred, overlap-OK (#3); `proof:typing-dots` / `proof:dogfood-hero` (re-spec with the
  new hero); `proof:crayon-preserved` (audit against the redesign — the crayon idiom likely
  dies with the "latent red theme," #16); `proof:compose-scene` (retire if compose pruned,
  #23); `proof:morph-scene` / `proof:motion-path-editable` / `-copy` / `-scale` (retire if
  pruned, #20/#21/#23, else reshape to a visible-render oracle per M5). **KEEP-but-WIDEN:**
  `proof:no-single-option-select` — the owner still sees the "∿ Spring │ ∿ Spring" dup (#17)
  because the gate guards only the `<Select>` count, not the **redundant dock label**;
  widen the oracle to the dock-label elision.
- **gate.** **BORN-RED.** These 15+ keys are present and each **enforces an owner-rejected
  state** today (lane 29 Part IV, all verified present). The wave's falsifiable completion
  criterion: the retired keys are **absent** from `package.json` AND every roster
  aggregator (`run-all.mjs`, `demo-roster.mjs`, `proof:ci-coverage`, `proof:hygiene-chain`,
  `gate-bands.mjs`), AND `proof:ci-coverage` stays green with them removed (no dangling CI
  reference).
- **size.** M.
- **lanes.** 29 rec 6 (T-GATE-RETIRE).
- **edges** (heavy cross-band). Each retirement is EXECUTED by the band that removes the
  feature — square-honest → **T.A/T.B**; gesture-manifest → **T.E/T.B**; easter-egg +
  design-refinement + easing-locks → **T.E/T.D**; hero-trio + suffusion(c) + usability(2) +
  typing-dots + dogfood-hero → **T.D**; compose/morph/motion-path gates → **T.E** (OD-1).
  T.M owns the **retirement ledger + the no-orphan-key completion gate**; the bands execute
  in lockstep.
- **lockstep** (this IS the lockstep wave — lane 18's rule codified). A wave removing a
  surface REWIRES its gates in the same motion: never leave a manifest entry / roster
  reference pointing at a deleted tell, never "fix" a gate by resurrecting rejected UI. Grep
  `scripts/` + `package.json` + `demo-roster.mjs` + `run-all.mjs` for every retired basename
  before the commit lands (the drive lesson: gates anchor literal paths).

## T.M8 — `proof:roster-ceiling` (execute the FROZEN→discharge fold; re-shrink 203 → ~120)

- **scope.** Actually execute the fold S.A4 **declared-but-deferred**. S.A4's headline was
  "190 → ~138 immediate → ~120 once the FROZEN fold discharges"; the tree today carries
  **203** `proof:` gates (verified) — the diet *inverted* (each altitude band then authored
  MORE structural born-RED oracles). `gate-bands.mjs`'s `FROZEN_SET` is **51 keys** with
  exactly **1 `DISCHARGE`** entry (verified) — the fold was mechanism-built and never run.
  Discharge the 50 undischarged FROZEN keys into successor system gates OR ledgered KILLs;
  combined with M7's ~15 feature-coupled retirements, drive the total `proof:` count from
  203 toward the promised ~120 and declare a roster ceiling.
- **gate.** **BORN-RED.** `proof:ci-coverage` REDs while `FROZEN_SET.size − DISCHARGE.size
  > 0` (today 51 − 1 = 50) AND the total `proof:` count exceeds a declared ceiling (today
  203 > ~120). Reds on today's tree on both clauses.
- **size.** M.
- **lanes.** 24 rec 2 / F1 (execute the FROZEN→successor fold and re-shrink the roster); 27
  F10 (cross-ref — lane 27 defers the roster-count depth to lane 24; this wave owns it).
- **edges.** Pairs with **M7** (retirement removes ~15 keys); the discharge target depends
  on which scenes survive (**T.E** prune) and which appearance gates are re-authored
  owner-anchored (M1–M5). Cross-ref **T.S** (lane 27's ledger re-run discharges the chronic
  *rows*; the roster *count* is here). Also folds lane 27 F9 (the 3 orphaned S.B6
  type-surface gates — `engine-subpath-mirror`/`no-any-default`/`dts-rollups-agree` —
  wired into `proof:library-correctness` in the same pass).
- **lockstep.** `gate-bands.mjs` `FROZEN_SET`/`DISCHARGE` updated as each frozen gate is
  folded; the ci-coverage ceiling literal declared; the S.B6 EXCLUDED set
  (`proof-ci-coverage.mjs:249-252`) drained.

## T.M9 — `proof:board-live` (board↔tree reconciliation + session-log freshness)

- **scope.** Two coupled instruments over the tranche's own audit record. **(a) board-live:**
  a `PROGRESS.md` row citing a green gate that REDs at HEAD REDs the board — reconcile each
  CLOSED/FOLD row's cited exit against a live re-run (same shape as `proof:claude-paths-live`
  gates CLAUDE.md). Cures the S board drift (lane 24 F6 / lane 26 F6: S.A1 board says
  "born-RED by design" while `proof:chronic-closure` exits 0; S.B8 PENDING while
  `claude-paths-live` exits 0; **S.G3 marked PENDING while its owner-rejected `GestureLegend`
  surface is git-committed on the reviewed branch** — the reviewed tree is a hybrid no board
  state describes). **(b) session-log freshness:** a born-RED doc-drift check asserting the
  session log's last-mentioned commit hash is within N commits of HEAD on the tranche branch
  at any audit checkpoint (the S session log stopped ~40% early — 20 commits, incl. S.C4/S2
  and ⑩, landed after the last entry, lane 27 F4). T's board is **born WITH** this
  discipline + an amendment log (charter §6).
- **gate.** **BORN-RED.** Reds on the S records today: the three board↔tree divergences
  above resolve against live re-runs, and the S session-log's last-mentioned commit is far
  more than N behind HEAD. T's own board is authored under the green form of this gate.
- **size.** S.
- **lanes.** 24 rec 6 / F6 (treat the S board as untrusted; gate the T board); 26 rec 8 /
  F6 (board-live half); 27 rec 4 / F4 (session-log backfill + amendment discipline + the
  doc-drift check).
- **edges.** Gates the T `PROGRESS.md` board (charter §6: "born with `proof:board-live`
  discipline + amendment log"). The **S session-log backfill CONTENT** (append the missing
  S.G3-reopen / S.F6 / S.B8 / S.C4-S2 / S⑩ entries) is an **S-residue execution** that
  rides **T.S** (lane 27's T-4) — this wave supplies the DISCIPLINE + gate that makes it
  enforceable and re-usable for T (see Charter-conflict note 3).
- **lockstep.** The gate is authored WITH the board; every T board row must reconcile
  against a re-run before the wave that wrote it can close.

## T.M10 — `proof:prompt-recap-t` (the recap-gate TEETH; the ledger artifact is cross-referenced)

- **scope.** Author the **falsifiable teeth** for the recap (lane 28 §3). The
  `docs/tranches/T/PROMPT-RECAP.md` ledger **artifact** — the standing-mandate rows, the
  S-kickoff elements carried to landed reality, the NEW T-verdict asks (lane 28 §1c), and
  the S-residue carries — is a **co-authored corpus file** (charter §6; lane 28 is shared
  T.M/T.S; the S-residue rows materialize under T.S) → **cross-ref, not authored here**.
  T.M owns the gate that binds it. `proof:prompt-recap-t` REDs if: **(i)** the ledger is
  absent at drive ENTRY (F1 plant — verified absent today); **(ii)** any `ADDRESSED` row
  cites a **BAND** (not an owner-observed token) as its spirit oracle (F2 plant — the S
  substrate graded every hard ask ADDRESSED by citing → S.G/→S.D/→S.E, the three bands the
  owner rejected); **(iii)** any design/appearance ask cites a **GREEN GATE** as its spirit
  oracle (lane 26's "green was the defect" cure); **(iv)** a **verbatim-re-issued precept**
  is marked `ADDRESSED` with no post-re-issuance owner token (the re-issuance census, F5 —
  the 7-clause mandate is now in its ~9th verbatim re-issue); **(v)** `OWNER-ASKS.md` is not
  fully-dispositioned (inherited S6 clause). Plus the **recurring-correction-shape** row
  class (F4: a rejection pattern recurring ≥2× — the N-Stage 4× signature, now the
  whole-demo — is promoted to a standing precept with its own gate).
- **gate.** **BORN-RED.** Reds on today's tree: `docs/tranches/T/PROMPT-RECAP.md` is absent
  (verified), no `proof:prompt-recap` script exists (verified: 0 refs), and each of the five
  non-vacuity shapes plants a row that REDs independently.
- **size.** M.
- **lanes.** 28 (gate-teeth mechanics: §2 F1/F2/F4/F5/F6, §3, T-recs 1/2/3).
- **edges.** The ledger CONTENT is another author's file (cross-ref: **T.S** / the corpus
  §6 deliverable). The owner-token binding consumes **M1/M2**'s verdict mechanism; clause
  (iii)'s "no green gate as a design spirit-oracle" is the recap-side of M2's
  convergence≠sufficient rule. `OWNER-ASKS.md` **row 4** is dispositioned as "→ Tranche T
  (this ledger)" to break the F6 **circular deadlock** (the S recap gate can never green
  because its last undispositioned ask *is the tranche that supersedes it*).
- **lockstep.** `proof:prompt-recap-t` replaces the never-materialized `proof:prompt-recap-s`
  (verified absent); wire the new key into `proof:ci-coverage`; the ledger is born-at-entry
  and updated per-wave so the F1 failure mode (recap scheduled LAST, never reached) is
  structurally impossible.

---

## Cross-band coordination summary (T.M is the mechanism; the bands are the consumers)

| T.M wave | Builds | Consumed by |
|---|---|---|
| M1 owner-verdict-recorded | the recorded-at-close verdict artifact gate | every T.A/T.C/T.D/T.E appearance wave |
| M2 owner-review-gate | pre-authoring sign-off + convergence≠sufficient | charter §3 OD-1..OD-6; every design wave |
| M3 owner-golden | owner-anchored perceptual oracle (retires visual-lock self-baseline) | T.A cube · T.E morph · parallels T.G perf re-home |
| M4 stage-inventory | negative-space / sanctioned-inventory (replaces gesture-manifest) | T.A · T.B · T.C · T.D · T.E furniture removals |
| M5 subject-legible/full | legibility + fullness over existence | T.A cube/amiga · T.C dock icon · T.E morph |
| M6 gate-authority | the INSTRUMENT/OWNER axis + blocking-not-OBSERVE teeth | every appearance gate; T.G perf gate must declare OWNER+blocking |
| M7 retirement pass | the no-orphan-key lockstep ledger | T.A/T.B/T.C/T.D/T.E execute each retirement |
| M8 roster-ceiling | FROZEN discharge + 203→~120 ceiling | T.E prune · M1–M5 re-authored gates · T.S chronic rows |
| M9 board-live | board↔tree + session-log freshness | the T PROGRESS board (§6); T.S S session-log backfill |
| M10 prompt-recap-t | the born-OWNER recap gate teeth | the co-authored PROMPT-RECAP.md ledger (§6 / T.S) |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.M#** = owned by a wave above · **↳ cross-ref** = owned by another band per
the charter (my assignment scopes me to specific recs; non-assigned recs of a partially-
owned lane are listed for completeness with their owning band).

### Lane 29 — gate-oracle-gap (ALL recs assigned)

| Rec | Disposition |
|---|---|
| 1 · T-GATE-OWNER (owner-verdict-recorded) | **→ T.M1** |
| 2 · T-GATE-GOLDEN (perceptual reference oracle) | **→ T.M3** |
| 3 · T-GATE-INVENTORY (on-stage element manifest) | **→ T.M4** |
| 4 · T-GATE-LEGIBLE (legibility + fullness) | **→ T.M5** |
| 5 · T-GATE-PERF (whole-roster low-end blocking perf) | ↳ cross-ref **T.G** (owns the perf gate per charter §1); **T.M6** enforces its OWNER-authority + blocking-not-OBSERVE status. The gate DOCTRINE is T.M (lane 29 Part III); the GATE is T.G. |
| 6 · T-GATE-RETIRE (feature-coupled retirement) | **→ T.M7** |
| 7 · T-GATE-META (taste-authority axis) | **→ T.M6** |

### Lane 24 — plan-vs-landed A/B (recs 1, 2, 6, 7 assigned)

| Rec | Disposition |
|---|---|
| 1 · taste-inclusive wave-close contract | **→ T.M1** (recorded artifact) + **T.M2** (pre-authoring sign-off) — the two halves of the contract |
| 2 · execute FROZEN→fold, re-shrink roster | **→ T.M8** |
| 6 · treat S board untrusted; gate the T board | **→ T.M9** |
| 7 · ring-fence band B's library carve as stable | ↳ cross-ref **charter §4 non-goals** (Band B's library carve already declared un-implicated + out-of-scope; F8 evidence). No wave needed — doc-level ring-fence stands. |
| *(3 · cold-load-visible harness / prune — not assigned)* | ↳ **T.A** (autoplay/cold-enter contract) / **T.E** (prune) |
| *(4 · delete KfPillTabs; adopt glass-ui — not assigned)* | ↳ **T.B / T.C / T.H** (glass-ui consumption) |
| *(5 · excise contract-group synthetic-started hack — not assigned)* | ↳ **T.B** (SceneFacility replaces `useContractAnimGroup`; the arming-audit cure) |

### Lane 26 — plan-vs-landed F/G/H (recs 1, 8 assigned)

| Rec | Disposition |
|---|---|
| 1 · owner-taste sign-off as PRECONDITION of authoring a design gate | **→ T.M2** (the core mechanism; generalises the S.E shelf lesson upstream) |
| 8 · ring-fence band H + F primitives; re-derive F/G/H state from git (board-live) | split: board-live half **→ T.M9**; ring-fence H + F-library ↳ cross-ref **charter §4 non-goals** (below the owner sight-line, sound, out-of-scope) |
| *(2 · hero per-char uplift — not assigned)* | ↳ **T.D** (hero; OD-4) |
| *(3 · demo-scoped absolute perceived-perf oracle — not assigned)* | ↳ **T.G** (perf); **T.M6** enforces its blocking/OWNER status |
| *(4 · delete GestureLegend layer — not assigned)* | ↳ **T.E / T.B** (removal); **T.M4** (inventory gate) + **T.M7** (retire `gesture-manifest`) are the gate side |
| *(5 · restore the square panel; make Play honest — not assigned)* | ↳ **T.B** (SceneFacility triad) / **T.A** |
| *(6 · strip telemetry/readout/caption furniture — not assigned)* | ↳ **T.A / T.E**; **T.M4** (inventory) enforces at rest |
| *(7 · prune morph/motion-path/compose — not assigned)* | ↳ **T.E** (OD-1); **T.M7** retires the coupled gates |

### Lane 27 — ledger sweep (rec 4 assigned)

| Rec | Disposition |
|---|---|
| 4 · backfill S session log + amendment discipline + T doc-drift gate | **→ T.M9** (the discipline + `proof:board-live` session-log-freshness clause; the S backfill CONTENT executes under this discipline via **T.S**) |
| *(1 · re-verify ledger from clean; fix tier-check bug — not assigned)* | ↳ **T.S** (ledger re-run; the F2 `inCorrectnessTier` bug, F7 ci.yml literal, F9 orphaned gates). Note: F9's gate-wiring + F10's roster count fold into **T.M8**. |
| *(2 · root-cause & close drag-gesture — not assigned)* | ↳ **T.S** (the ONE named roster carry) |
| *(3 · cross-repo dispatch loop: KF-7 + self-dep phantom + color2Into — not assigned)* | ↳ **T.S** (the value.js letter + kf tripwire gates) |

### Lane 28 — prompt-recap (gate-teeth mechanics assigned; ledger artifact cross-ref)

| Rec | Disposition |
|---|---|
| 1 · born-at-entry, owner-token-bound recap ledger + gate | teeth **→ T.M10** (`proof:prompt-recap-t`); the ledger ARTIFACT ↳ cross-ref **charter §6 / T.S** (co-authored S-residue rows) |
| 2 · owner-review as wave-closure precondition | **→ T.M2** (the design-wave contract); asserted a second time by **T.M10** clause (iii) |
| 3 · re-issuance census + recurring-correction-shape class | **→ T.M10** (clauses (iv) + the correction-shape row class) |

---

## Charter conflicts / coordination notes spotted

1. **Perf gate ownership (lane 29 rec 5 vs charter).** Lane 29 rec 5 (whole-roster
   blocking perf) sits in my ALL-assigned lane, but the charter routes the perf GATE to
   **T.G** and does not list one under T.M. **Not a conflict** — clean hand-off: T.M owns
   the DOCTRINE (owner-anchored + blocking-not-OBSERVE, lane 29 Part III) and enforces it
   via M6's authority axis; T.G authors the concrete gate. Flagged so the impl drive wires
   the T.G perf gate through M6's authority declaration.

2. **The three-way "close contract" recs (29-1, 26-1, 24-1) describe one doctrine from
   three angles** — recorded-at-close (29-1 → M1), pre-authoring sign-off (26-1 → M2),
   and the general contract (24-1 → M1+M2). Split cleanly into M1 (artifact) + M2
   (sequencing); no conflict, but the impl drive must land M1 and M2 as a PAIR — either
   alone re-opens the leak.

3. **S session-log backfill double-home (lane 27 rec 4 assigned to me vs charter T.S row
   "S session-log backfill").** Both T.M (my rec-4 assignment) and T.S (charter §1) touch
   the S session-log backfill. Resolution encoded in M9: **T.M owns the amendment
   DISCIPLINE + `proof:board-live` freshness gate; T.S executes the S-residue backfill
   CONTENT under that discipline.** Flagged so the impl drive does not author the backfill
   twice or leave the discipline gate orphaned from the content.

4. **PROMPT-RECAP.md authorship split (charter §1 T.M "PROMPT-RECAP.md born-at-entry" vs
   my brief "the ledger artifact is another author's file").** Resolution encoded in M10:
   **T.M owns the GATE + the ledger SCHEMA/design (lane 28 §3); a co-author (T.S / the §6
   corpus deliverable) materializes the ROW CONTENT** (standing mandate, S-kickoff
   elements, NEW §1c asks, S-residue carries). Flagged so the born-at-entry file is
   created once, against T.M's schema, not duplicated.

## Addendum (2026-07-05, post-harden synthesizer ruling) — lane 25 fold

- **Lane 25 rec 7** (ring-fence Band C's legacy purge as stable) → **charter §4 non-goals**,
  explicitly (the same disposition shape as lane 24 rec 7 → Band B and lane 26 rec 8 → Band
  H/F): no re-litigation of S.C1/C2/C3a/C4; only the menubar successor is re-touched via
  T.H's consumption gate.
