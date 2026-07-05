# Tranche T — Band T.S — THE S-RESIDUE (fold + close-out; parallel throughout → T.Z last)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Why this band exists.** The S impl drive was pre-empted mid-close by the owner's
> live-review verdict (OWNER-ASKS row 4). The entire **S.Z close band (S.Z1/S.Z2/S.Z3)
> never executed** — zero wave-closure commits (`git log --oneline --all | grep 'S\.Z'` →
> empty; board still `PENDING-IMPL`, `docs/tranches/S/PROGRESS.md:77-79`). Every mechanism
> S built to *close honestly* — the from-clean roster re-run (S.Z2's RE-EXECUTION clause),
> the total prompt recap (`proof:prompt-recap-s` + `docs/tranches/S/PROMPT-RECAP.md`), the
> FINAL over a closeable roster (S.Z3) — is designed-RED, never-run limbo. **A drive that
> stops early leaves its ledger indistinguishable from a broken one**: nothing in
> `PROGRESS.md` separates "red because Z hasn't run" from "red because the row is actually
> false" (lanes 27 F1 / 28 F1 — the verification lives structurally *downstream* of the
> failure it verifies).
>
> **The doctrine (lanes 27 + 28).** T does NOT re-open S. It **folds the Z-band substance
> into T waves and closes S by named transfer** (lane 27 F1: "do not re-open S"; lane 28 F6:
> "close S's recap by transfer, not by an in-S re-run that can never happen"). Every S-residue
> disposition here is **C-20-compliant**: a deterministic re-shaped gate or a ratified KILL —
> **never** an observe/re-affirm verb. The one honest carry the S board actually named
> (`drag-gesture`) is root-caused and closed, not re-affirmed.
>
> **Lanes:** 27 (recs 1,2,3 + rec 4's backfill half), 28 (ALL — recs 1,2,3; the
> `PROMPT-RECAP.md` ledger artifact is authored under this band per charter §6 / T.M10's
> coordination note 4), 21 (rec 7 only — DM-22; recs 1–6 owned by T.B/T.H), 32 (perf-instr,
> shared with T.G).
>
> **Sequencing.** T.S runs **parallel throughout** the tranche (charter §2 DAG) and feeds
> **T.Z last**: T.S7's S-residue transfer + OWNER-ASKS row 4 disposition are the precondition
> that unblocks the T-equivalent close; T.S6's revived deploy path is how T.Z ships. T.S1's
> from-clean re-run is the S.Z2 RE-EXECUTION substitute; the roster *count* half (F9/F10)
> folds into **T.M8**, the board/session-log *discipline* into **T.M9**, the recap *gate teeth*
> into **T.M10** — this band owns the S-side CONTENT + the three concrete cross-repo defects.

---

## T.S1 — The ledger re-verification from clean (the S.Z1/S.Z2 RE-EXECUTION substitute)

- **scope.** Run S's own closing mechanism that never ran, from a clean checkout, and convert
  52 rows of "unknown" into a small named backlog. Three concrete fixes land in the SAME commit
  as the re-run so it isn't re-inflated by its own bugs:
  - **(a) The tier-check bug (lane 27 F2).** `scripts/proof-chronic-closure.mjs:171` binds
    `PROOF_CORRECTNESS = SCRIPTS["proof:demo-correctness"]` and `inCorrectnessTier` (`:179-180`)
    consults **only** `proof:demo-correctness` — even though the S.A4 taxonomy is **three** tiers
    (`library-correctness`/`demo-correctness`/`hygiene`), and the gate's own `NOT_A_GATE` set
    (`:361-367`) *names* all three. Consequence: library-side and hygiene-side chronics
    (rows 27/32/34/37/42/44/45/62/70/73/74 — `proof:compile-replay`, `proof:decomposition`,
    `proof:boundary`, `proof:zero-alloc`, `proof:waapi-adaptive-densify`, …) that run and PASS
    live get the paired "NOT in the DEMO-CORRECTNESS tier" + "NOT a RUNTIME gate" false-positive —
    **26 of the 52 failing rows** carry exactly this artifact (a category error: they were never
    meant to be browser-actuated). Fix: extend `inCorrectnessTier` to also check
    `proof:library-correctness` and `SCRIPTS["proof:hygiene-chain"]`.
  - **(b) The stale CI literal (lane 27 F7).** `proof:ci-coverage` **exits 1 today** (verified:
    `node scripts/proof-ci-coverage.mjs` → exit 1, the single `✗ version-literal` clause):
    `.github/workflows/ci.yml:487,490,492` still carry Q-era `value.js 1.2.0` / `^1.2.0` prose,
    stale since the S.C4/S2 re-pin to `^2.0.1` (`74ee9d2`, which touched `package.json` +
    `package-lock.json` + the PIN-LEDGER but never `ci.yml`). Single-source the floor; delete the
    literal. **This is F1's point made concrete** — a from-clean roster run would have caught it
    the moment S.C4/S2 landed had S.Z2 executed.
  - **(c) Ratify the Z-void residue (lane 27 F1/F8, fold table rows 22/16).** Row 22
    (`engine-seam-split` "KILL, ratify at S.Z") — the KILL happened (S.B2 superseded it) but the
    **ratification** never did; ratify it explicitly. Row 16 (S.A3) reads as an executed FOLD but
    **never fired** (F8) — re-disposition it honestly (the deploy revival itself is **T.S6**).
  - **Then** re-run `proof:chronic-closure` from clean and **hand-triage the residual reds** — the
    real single-digit set the fold table predicts (most of the current 52 are tier-bug artifacts
    or missing-witness wording; see the fold table). Each residual is dispositioned C-20:
    re-shaped gate or ratified KILL, never re-affirmed.
- **gate.** **BORN-RED.** Both `proof:chronic-closure` **and** `proof:ci-coverage` exit **1**
  on today's tree (verified live: chronic-closure exit 1 / 52-of-74 rows flagged; ci-coverage
  exit 1 / version-literal). Falsifiable green: both exit **0** on a from-clean `git clone` +
  `npm ci` + `npm run build`, with the tier-check fix committed and the residual reds each
  carrying a C-20-terminal disposition row (a residual red with a bare observe/re-affirm verb
  REDs — inherit S.A1's non-vacuity plant).
- **size.** M.
- **lanes.** 27 rec 1 (the ledger re-run; F1/F2/F7/F8); F9 (the 3 orphaned S.B6 gates —
  *gate-wiring* folds to T.M8, see edges) and F10 (203-gate roster count — folds to T.M8) are
  **noted here but owned by T.M8**.
- **edges.** **T.M8** owns the *roster ceiling* (F9: wire `engine-subpath-mirror` /
  `no-any-default` / `dts-rollups-agree` into `proof:library-correctness`; F10: 203 → ~120) — this
  wave's tier-fix is the precondition that makes those three gates *countable* as library-tier.
  **T.M9** owns the board-live + session-log-freshness *gate*; the from-clean re-run is what its
  board rows reconcile against. **T.S6** is the honest re-disposition of row 16 into an actually-run
  deploy. **T.S7** carries the S-residue transfer that this re-run's exit map feeds.
- **lockstep.** The tier-fix commit MUST re-run `proof:chronic-closure` in the same motion (never
  leave the gate reporting its own bug as a backlog); `ci.yml`'s literal single-sources into
  `package.json` (never leave a second copy). If the residual triage KILLs any row, its gate key is
  removed from `package.json` + `run-all.mjs` + `demo-roster.mjs` in lockstep (M7-class discipline).

## T.S2 — Root-cause and close `drag-gesture` for real (the ONE named roster carry)

- **scope.** The S board's single honest BACKLOG carry. `354bab8` claimed "discharge
  `proof:drag-gesture` (the LAST backlog row)"; `dee5aa6` **reopened** it the same evening
  ("the G3 discharge was incomplete — one surface; reproduced serially → Tranche T"). Row 67's
  table cell (`docs/tranches/S/PROGRESS.md:223`) was never edited and still claims discharge —
  the ledger row and its governing script (`scripts/demo-roster.mjs:258`,
  `"proof:drag-gesture": "T (the owner-verdict fold)"`) **disagree about the same fact** (lane 27
  F3). Reproduced live this sweep: `KF_PLAYWRIGHT_DIR=… node scripts/proof-drag-gesture.mjs` fails
  clause (a) on exactly **one** surface — the easing scene's **playback ribbon slider**
  (`PlaybackRibbon.vue`'s `.timeline-green [data-slider-impl]`): `body.is-dragging` is never set
  mid-gesture; all four other surfaces + the bezier handle pass clean. Root cause located:
  `demo/@/components/custom/animation-transport/controls/PlaybackRibbon.vue:110-140` wraps a
  glass-ui `<Slider>` in a **capture-phase gate** (`gatedSliderDown` via glass-ui `useTouchGate`)
  and only *then* calls `useDragCapture`'s `onPointerDown` — the seam that arms
  `acquireSelectSuppression()` (`gestureSelectSuppression.ts:22-26`). The demo carries **three**
  drag composables where it advertises one shared seam: `useDragScrub.ts:9` and the `useDragCapture`
  module doc *each* call themselves "the ONE shared seam," plus this third bespoke gate-then-capture
  wiring around a vendored widget that owns its own pointer semantics.
  - **The work:** trace why the outer touch-gate swallows the token-arming call under a real drag;
    **converge `useDragScrub` + `useDragCapture` into one seam** if the audit finds no real reason
    for two; **delete the bespoke touch-gate wrapper** around this one `<Slider>` if glass-ui's own
    Slider already disambiguates touch-vs-drag internally (a duplicated gate is a DRY defect
    independent of whether it is the root cause — VERDICT #28); then **correct row 67's table text**
    to match reality.
- **gate.** **BORN-RED.** `proof:drag-gesture`'s browser leg fails clause (a) on the ribbon-slider
  surface today (reproduced live from a fresh `npm run gh-pages` build). Falsifiable green:
  `proof:drag-gesture` exits **0 including the browser leg**, on all **5** named surfaces (square,
  spring, sequence, motion-path, easing) from a clean `npm run gh-pages` build.
- **size.** S.
- **lanes.** 27 rec 2 (F3).
- **edges.** The seam-consolidation touches the same third-party-widget band-aid class **T.H**
  ledgers (lane 21 recs 1–3, the `glass-ui-gaps` tripwire) and **T.B**'s SceneFacility transport
  refactor (the light scenes' transport source). Coordinate: the drag-gesture *close* is T.S's; the
  general *composable/transport* refactor is T.B's — this wave deletes the one bespoke wrapper and
  converges the two seams, and cross-refs the glass-ui-gap ledger entry if the wrapper survives
  pending a glass-ui fix. If the easing surface itself is redesigned to the controls-model
  (VERDICT #16, **T.E/T.D**), this wave rides that redesign rather than hardening a doomed widget.
- **lockstep.** Correcting row 67 is a `PROGRESS.md` edit that must land WITH the fix (never leave
  a discharged-in-prose row over a reopened gate); if a composable is deleted, its imports across the
  four scenes are rewired in the same motion.

## T.S3 — The value.js letter (KF-7 + the 2.0.1 self-dependency phantom) + the two kf tripwire gates

- **scope.** Two upstream-owned, neither-kf-fixable defects that no kf gate would ever notice,
  plus the verification-trail tightening for a third cross-repo dispatch. Author **one consolidated
  value.js letter** (the KF-VALUEJS-2.0.0.md successor form) bundling:
  - **(a) KF-7 is still unfulfilled (lane 27 F5).** `KF-VALUEJS-2.0.0.md:73` filed KF-7 — value.js's
    exported `PropertyDescriptor` collides with the ambient DOM global, so API-Extractor
    collision-renames it to `PropertyDescriptor_2` in kf's published `dist/keyframes.d.ts`. Verified
    live against the installed `^2.0.1`: value.js **still exports it un-renamed**
    (`node_modules/@mkbabb/value.js/dist/index.d.ts:41`), and the exact defect is live in the built
    `dist/keyframes.d.ts:11` (`import { PropertyDescriptor as PropertyDescriptor_2 }`), `:814` and
    `:2732` (`Map<string, PropertyDescriptor_2>`). The dispatch was fired-and-forgotten: it rode the
    big spine's adopt-event watch with no watch of its own. Re-file: rename value.js's export to a
    collision-free name (e.g. `CSSPropertyDescriptor`) — the same NO-legacy total-rename shape as
    KF-1's `CustomFunctionParameter`.
  - **(b) The self-dependency phantom (lane 27 F6, NEW this sweep).** `@mkbabb/value.js@2.0.1`'s
    own `package.json` lists `"@mkbabb/value.js": "^1.0.2"` among **its own dependencies** (verified:
    `node_modules/@mkbabb/value.js/package.json` deps =
    `{"@mkbabb/parse-that":"^1.0.0","@mkbabb/value.js":"^1.0.2"}`). npm cannot dedupe a package against
    itself, so every `npm ci` nests a stale 1.2.0 value.js (1.2 MB) + a stale 0.13.0 parse-that inside
    kf's own `node_modules` (verified in `package-lock.json`:
    `node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js -> 1.2.0`). Upstream publishing bug;
    file it in the same letter.
  - **(c) color2Into's verification trail (lane 27 fold row 46).** The color2Into WATCH was asserted
    verified at S.C4/S2 (`74ee9d2`) per `PROGRESS.md` prose, but **no itemized oracle output** was
    captured in the session log. Tighten: re-run the consume oracle and record its exit in the letter's
    verification section (not "asserted verified").
  - **The two kf-side tripwire gates** (both cheap; both would have caught these the moment they
    shipped, not 4 tranches later):
    - `proof:no-collision-rename` — asserts **zero** `PropertyDescriptor_2`-style collision-renames
      in the published `dist/keyframes.d.ts` (or fold the clause into `proof:dts-rollups-agree`).
      **Planted-true today** (`PropertyDescriptor_2` is live at `:11/:814/:2732`) → REDs now, greens
      the instant value.js renames.
    - `proof:no-nested-self-dependency` — a census over `package-lock.json` for any
      `node_modules/@mkbabb/*/node_modules/@mkbabb/*` self/duplicate install → **REDs today** on the
      nested 1.2.0/0.13.0 pair.
  - **Process:** adopt the SAME "adopt-event watch" discipline the H4 spine used (`npm view
    @mkbabb/value.js`, act only on confirmation) for **all** cross-repo dispatch riders, not just the
    headline ones — the fire-and-forget failure mode is what stranded KF-7.
- **gate.** **BORN-RED.** `proof:no-collision-rename` REDs today (planted-true — the rename is live
  in the built d.ts) and greens only after value.js publishes the rename + kf re-points; and
  `proof:no-nested-self-dependency` REDs today (the nested self-dependency install exists in
  `package-lock.json`). Both are verified RED against the current tree.
- **size.** S.
- **lanes.** 27 rec 3 (F5/F6 + fold row 46).
- **edges.** The letter itself is a new corpus deliverable (a `KF-TO-VALUEJS-*.md`, sibling to
  T.H's `KF-TO-GLASSUI-BG.md`) authored at impl time — **not** created in this docs phase. Both
  gates wire into `proof:library-correctness` (the d.ts/dependency correctness tier) — coordinate
  with **T.M8**'s tier-fold so they count. The self-dependency fix is upstream and independent of
  KF-7; the letter bundles them but the gates fire independently.
- **lockstep.** When value.js ships the rename, kf re-points `import PropertyDescriptor` + the
  `Map<string, …>` types in the SAME motion the tripwire flips (never leave a renamed export with a
  stale local alias); the adopt-event watch gates the re-point so the rename isn't consumed before it
  lands (the KF-2 cadence lesson).

## T.S4 — DM-22 named-selector resolution: de-defer or build (lane 21 rec 7)

- **scope.** The **one live** "DEFERRED to a follow-up wave" marker still in `src` — verified:
  `grep -rn "DEFERRED to a follow-up wave" src/` returns exactly one hit,
  `src/animation/compile/frame-compiler.ts:341`. Booked at tranche **P** (P.W9 / DM-22), it survived
  Q, R, and all of S still marked DEFERRED. It stores a scroll-range named selector
  (`entry`/`exit`/`cover`/`contain`) opaquely as `ValueUnit(rawSelector, undefined, [NAMED_SELECTOR_
  SUPERTYPE])` so it round-trips verbatim (the L.W1 floor: `fromString` must not throw), leaving a
  **latent NaN at sample-time** for any path that samples frames without going through `play()` (a
  raw `interpFrames()` on an unresolved named selector). The play-time guard
  (`play-lifecycle.ts:371 assertNoUnresolvedNamedSelector()`) **does** throw fail-explicit — so a bare
  `play()` refuses rather than running NaN frames (verified; this is honest, hence severity LOW). The
  decision (lane 21 rec 7): **build** the deferred-resolution step (map the named phase → numeric `%`
  at `bindTimeline`, eliminating the sample-time NaN) **or**, if the play-time guard IS the accepted
  terminal contract, **retire the "DEFERRED to a follow-up wave" framing** so no live `src` comment
  advertises an unbuilt cure. Per VERDICT #28 ("either excise entirely, or fail explicitly") the
  de-defer branch is legitimate — the guard already fails explicit; what is NOT legitimate is a comment
  that keeps promising an unbuilt cure across four tranches.
- **gate.** **BORN-RED.** `grep -rn "DEFERRED to a follow-up wave" src/` returns **1** today (the
  frame-compiler comment). Falsifiable green: the grep returns **0**; AND (if the build branch is
  taken) a test that a named-selector frame **sampled after `bindTimeline`** yields a finite value,
  not NaN (a NaN sample REDs).
- **size.** **S** (de-defer: comment retirement + the guard is the ratified contract) / **M** (build:
  the `bindTimeline` phase→`%` resolution step). Owner/impl chooses the branch; the gate is identical
  at the grep, stronger on the build branch.
- **lanes.** 21 rec 7 (cross-cited; lane 21 recs 1–6 — glass-ui-gap ledger, KfPillTabs excision,
  TransportSource, throttle DRY, `any`-ceiling, dead-export — are owned by **T.B/T.H** per charter §1
  and are NOT this band's; see Disposition table).
- **edges.** Touches `src/animation/compile/frame-compiler.ts` — the ONLY library touch in this band
  beyond the two tripwire gates. Charter §4 rings-fences Band B's library carve as sound; this is a
  new-defect-shaped touch (an outstanding P-era deferral), analogous to T.A's plain-vars projection,
  so it is in-scope. No cross-band dependency.
- **lockstep.** If the build branch lands, the `assertNoUnresolvedNamedSelector()` guard's framing is
  reconciled (it becomes a belt-and-braces assertion, not the sole cure); if the de-defer branch lands,
  the guard's comment is promoted to "the accepted terminal contract" so it reads as the cure, not a
  stopgap.

## T.S5 — Backfill the S impl-drive session log to its actual terminus (content; discipline → T.M9)

- **scope.** `docs/tranches/S/PROGRESS.md`'s `## Session log (the S impl drive)` (`:405-739`) ends
  mid-narrative at fan-out ⑨ (`:739`, "the roster BACKLOG is now ONE row: drag-gesture → S.G3") —
  **~40% before the drive's actual end** (lane 27 F4). `git log --oneline -- docs/tranches/S/PROGRESS.md`
  shows the file was touched exactly once more (`68c9a5d`, the T-pivot compaction, which appended only
  the "State of play" anchor, not session entries). **20 further commits** landed real work the log
  never narrates. Backfill the missing entries (docs-only, mechanical — `git log` has everything):
  - S.G3 gesture manifest + affordance layer (`f55a9a9`/`13bf2e8`) **incl. the drag-gesture reopen**
    (`354bab8` discharge → `dee5aa6` reopen — the entry that explains why row 67 is wrong);
  - S.F6 emerging-CSS honest-narrative fix (`32f586d`);
  - S.B8 CLAUDE.md regen + hygiene-chain wiring (`c866d72`/`1c04de9`);
  - **S.C4/S2 — the value.js consume-edge FIRED** (`74ee9d2`, the whole owner-ruling-5/6 payload);
  - **S ⑩ — the full-roster long-tail sweep** (`d5479ad`, 8 reds by cause);
  - T dev opened + drag-gesture reopened (`f2d05c7`, `dee5aa6`).
  A reader who trusts the session log alone (its advertised purpose) currently cannot learn that
  S.C4/S2 fired, that a tenth fan-out happened, or **why** row 67's claim is false.
- **gate.** **BORN-RED** — rides **T.M9**'s session-log-freshness clause: the S session log's
  last-mentioned commit is far more than N commits behind the S drive's terminus HEAD (verified: the
  log stops at ⑨, 20 commits before the last touch). Falsifiable green: after the backfill, the S log's
  last-mentioned commit is within N of the S drive terminus (the anti-drift doc check greens).
- **size.** S.
- **lanes.** 27 rec 4 (the **backfill CONTENT half** — the S session-log entries). The **discipline +
  the `proof:board-live` doc-drift gate** that make it enforceable and re-usable for T are owned by
  **T.M9** (charter coordination note 3 — T.M owns the DISCIPLINE + freshness gate, T.S executes the
  S-side CONTENT under it).
- **edges.** **T.M9** supplies the gate + amendment discipline; this wave supplies the S-side prose.
  The T board (`docs/tranches/T/PROGRESS.md`) is born WITH T.M9's discipline (charter §6) — no
  backfill will be needed for T if the discipline holds from entry (§8 item 7's TEMPLATE.md amendment
  discipline, applied to T's own log).
- **lockstep.** The backfill is append-only to the S session log (never rewrite closed entries); the
  T board carries the amendment log from row 1 so this failure mode is structurally absent for T.

## T.S6 — S.A3 deploy-of-record revival (auto-deploy on green demo-correctness)

- **scope.** Row 16's disposition reads *"FOLD — deploy revived… `deploy-pages.yml` `workflow_run`
  fires on green demo-correctness… Oracle: one auto-path deploy run `success`"* — but **no commit
  named `S.A3` exists anywhere** (`git log --oneline --all` → zero; lane 27 F8), and the drive's own
  "State of play" is honest in prose (`PROGRESS.md:260`, "REMAINING S: S.A3 (auto-deploy — now
  unblocked by the green demo-correctness posture)") four hundred lines from the row that reads as
  executed. **Actually build the revival**: wire `deploy-pages.yml`'s `workflow_run` trigger to fire
  on a green `proof:demo-correctness` run, so the deploy-of-record path (the S.R1 lesson:
  `gh workflow run deploy-pages.yml` workflow_dispatch bypasses the flaky Linux demo-gate — but the
  auto-path is the honest close) becomes the mechanism T.Z ships through. Deploy is authorized under
  OWNER-ASKS row 3 (the publish/deploy grant that "governs… S.A3's deploy revival").
- **gate.** **BORN-RED.** No auto-path deploy run exists on the tree today — row 16's oracle ("one
  auto-path deploy run `success`") has never been satisfied (F8). Falsifiable green: exactly **one**
  `deploy-pages.yml` run with trigger `workflow_run` and conclusion `success` exists, fired by a green
  `demo-correctness` completion (queryable via `gh run list --workflow deploy-pages.yml`), and the
  deployed artifact matches the FINAL SHA.
- **size.** S.
- **lanes.** 27 F8 (row 16 false-as-written; the honest re-disposition is **T.S1**, the actual
  revival is here). Charter §1 T.S row ("S.A3 deploy-of-record revived (workflow_run on green
  demo-correctness)").
- **edges.** **Rides T.Z** (charter T.Z: "deploy via the revived S.A3 path") — the deploy is the last
  motion of the T close, gated on green demo-correctness, which is itself gated on every appearance
  band (T.A/T.B/T.C/T.D/T.E) landing + T.M's owner-anchored gates going green. Depends on **T.M1/M3**
  (an owner-approved render exists to deploy) — a green source-shape demo-correctness is NOT sufficient
  to deploy per the whole-tranche doctrine.
- **lockstep.** The `workflow_run` trigger single-sources off `proof:demo-correctness`'s job name;
  if that job is renamed in the T re-taxonomy, the trigger is rewired in lockstep (the drive lesson:
  gates anchor literal paths — the same applies to workflow job references).

## T.S7 — The `PROMPT-RECAP.md` born-at-entry ledger + the S-residue transfer + OWNER-ASKS row 4 disposition (unblocks the S.Z close)

- **scope.** Author + maintain `docs/tranches/T/PROMPT-RECAP.md` — the ledger **artifact**
  (co-authored corpus file; the born-OWNER *gate teeth* `proof:prompt-recap-t` are **T.M10**). The
  ledger is **materialized at drive ENTRY** with all rows populated (skeleton → filled), and **each
  wave updates its row at close** — so a drive pre-empted at any point still has a real, current recap
  (the direct cure for lane 28 F1: the S recap was scheduled LAST and never reached). Row set derived
  from `docs/tranches/S/OWNER-ASKS.md` + the VERDICT + `ORIGINAL-PROMPT.md` (per band guidance):
  - **The immutable standing mandate** (the 7-clause block, now in its ~9th verbatim re-issue —
    `ORIGINAL-PROMPT.md:100-112` word-for-word off `J/J.md:111-119`);
  - **The S-kickoff twelve elements** carried through their landed reality → the owner verdict;
  - **The NEW T-verdict asks** (lane 28 §1c — single-option elision #17, per-CHAR hero #3, restore the
    square panel #12/#25, cursor-light done-right #22, prune motion-path/morph/compose #23, the
    structural asks #26) — this ledger **originates** them (in no prior recap);
  - **The S-residue carries** — S.A3, S.Z1/Z2/Z3, drag-gesture, lane 27's fold carries, and
    **OWNER-ASKS row 4** — transferred as explicit **CARRY-INTO-T** rows with their own T-wave home.
  - **The spirit column** cites an **owner-observed token** — `OWNER-APPROVED shot:NN` /
    `OWNER-REJECTED shot:NN → T-wave` / `PENDING-OWNER` — **never a band** (the direct cure for lane 28
    F2: the S substrate graded every hard ask ADDRESSED by citing → S.G/→S.D/→S.E, the three bands the
    owner rejected; "the anti-leak column certified the leak"). A **green gate may NOT** stand as the
    spirit oracle for any design/appearance/interaction ask (lane 26's "green was the defect").
  - **Break the F6 deadlock:** `OWNER-ASKS.md` **row 4** (the verdict; `IN EXECUTION`) is dispositioned
    `→ Tranche T (this ledger)` — **terminal by transfer**. The S recap gate can never green in-S
    because its last undispositioned ask *is the tranche that supersedes it*; T closes S's recap by
    naming the successor home, not by an in-S re-run that can never happen (lane 28 F6).
- **gate.** **BORN-RED + BORN-OWNER** — rides **T.M10**'s `proof:prompt-recap-t` (verified absent
  today: `docs/tranches/T/PROMPT-RECAP.md` did not exist at lane time, no `proof:prompt-recap` script
  in `package.json`). The ledger's ADDRESSED rows are **owner-token-bound** (BORN-OWNER: a design-ask
  row cannot reach ADDRESSED without a committed `OWNER-APPROVED shot:NN` token — it consumes M1/M2's
  verdict mechanism). Non-vacuity plants (all from lane 28 §3): an ADDRESSED row citing a band → REDs;
  a design ask citing a green gate → REDs; a verbatim-re-issued precept marked ADDRESSED with no newer
  owner token → REDs; an OWNER-ASKS append with no disposition → REDs; the ledger absent at entry →
  REDs.
- **size.** M.
- **lanes.** 28 rec 1 (the ledger **artifact** half — the gate teeth are **T.M10**); F6 (OWNER-ASKS
  row 4 transfer). The **re-issuance census** (F5) and the **recurring-correction-shape class** (F4 —
  the N-Stage 4× signature now generalized to the whole-demo rejection) are ledger row-CLASSES this
  artifact carries, but their gate CLAUSES are **T.M10** (lane 28 rec 3 → T.M10). The
  **owner-review-as-wave-closure-precondition** (F3, lane 28 rec 2) is **T.M2**.
- **edges.** **T.M10** owns the gate + schema (charter coordination note 4: T.M owns the GATE + ledger
  SCHEMA/design; T.S materializes the ROW CONTENT — the file is created **once**, against T.M10's
  schema, not duplicated). **T.M1/M2** supply the owner-token mechanism the spirit column consumes.
  **T.S1** supplies the S-residue disposition exit map the carry rows cite. This wave's OWNER-ASKS
  row-4 transfer is the **precondition** that unblocks the T-equivalent S.Z close (charter §1 T.S:
  "OWNER-ASKS row 4 dispositioned → T (unblocks the S.Z close)") — **T.Z** executes the close proper.
- **lockstep.** `proof:prompt-recap-t` **replaces** the never-materialized `proof:prompt-recap-s`
  (verified absent) — the S gate is retired, not left dangling (lane 18 rule); `OWNER-ASKS.md` row 4's
  disposition cell is edited to the transfer text in the same motion the T ledger's carry row lands
  (never leave S's row `IN EXECUTION` while T claims the transfer). The ledger is born-at-entry and
  updated per-wave (the F1 failure mode — recap scheduled last — is structurally impossible for T).

---

## The S-residue → T-wave map (the transfer index; zero silent drops)

Every S-residue item the charter §1 T.S row names + every lane-27/28 finding, mapped to its T home.
`⤳ T.M#` = the *gate/discipline/count* half lives in a T.M wave; the CONTENT/close half is T.S's.

| S-residue item | Source | T home |
|---|---|---|
| S.Z1 (prompt recap) never ran | 27 F1 / 28 F1 | **T.S7** (born-at-entry ledger) ⤳ **T.M10** (gate teeth) |
| S.Z2 (template + RE-EXECUTION) never ran | 27 F1 | **T.S1** (from-clean re-run) ⤳ **T.M9** (board-live) |
| S.Z3 (FINAL + version) never ran | 27 F1 | **T.Z** (T-equivalent close; rides T.M instruments) |
| chronic-closure tier-check bug | 27 F2 | **T.S1** |
| `ci.yml` stale `1.2.0` literal | 27 F7 | **T.S1** |
| 3 orphaned S.B6 type-surface gates | 27 F9 | **T.M8** (gate-wiring); noted in T.S1 |
| roster count 203 (diet inverted) | 27 F10 | **T.M8** (lane 24 owns depth) |
| `drag-gesture` reopened, currently RED | 27 F3 | **T.S2** |
| S session-log stops ~40% early | 27 F4 | **T.S5** (content) ⤳ **T.M9** (discipline+gate) |
| KF-7 `PropertyDescriptor_2` unrenamed | 27 F5 | **T.S3** |
| value.js 2.0.1 self-dependency phantom | 27 F6 | **T.S3** |
| color2Into verification trail thin | 27 fold row 46 | **T.S3** |
| S.A3 deploy — never fired | 27 F8 | **T.S6** (revive) + **T.S1** (honest re-disposition) |
| `engine-seam-split` KILL never ratified | 27 fold row 22 | **T.S1** |
| DM-22 named-selector deferral | 21 rec 7 | **T.S4** |
| OWNER-ASKS row 4 circular deadlock | 28 F6 | **T.S7** (transfer) |
| spirit column self-certifies via bands | 28 F2 | **T.S7** (owner-token binding) ⤳ **T.M10** |
| owner-review-in-loop leaked same-tranche | 28 F3 | **T.M2** (wave-closure precondition) |
| N-Stage 4× taste signature ungeneralized | 28 F4 | **T.M10** (correction-shape class); row-class in **T.S7** |
| 7-clause mandate ~9th re-issue unmeasured | 28 F5 | **T.M10** (re-issuance census); row-class in **T.S7** |
| NEW T-verdict asks (§1c) not in any recap | 28 R8 | **T.S7** (ledger originates them) |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.S#** = owned by a wave above · **↳ cross-ref** = owned by another band per the
charter (listed for completeness with its owning band).

### Lane 27 — ledger sweep (recs 1, 2, 3 + rec 4's backfill half assigned)

| Rec | Disposition |
|---|---|
| 1 · re-verify the ledger from clean; fix the tier-check bug first | **→ T.S1** (F2 tier-fix + F7 ci.yml literal + from-clean re-run + residual triage + F8/row-22 ratify). F9 gate-wiring + F10 roster count ↳ **T.M8**. |
| 2 · root-cause & close `drag-gesture` for real | **→ T.S2** |
| 3 · close the cross-repo dispatch loop (KF-7 + self-dep phantom + color2Into + 2 tripwire gates) | **→ T.S3** |
| 4 · backfill S session log + amendment discipline + T doc-drift gate | **split**: the S session-log **backfill CONTENT** **→ T.S5**; the **amendment discipline + `proof:board-live` freshness gate** ↳ **T.M9** (charter coordination note 3) |

### Lane 28 — prompt-recap (ALL recs assigned; ledger artifact authored under this band)

| Rec | Disposition |
|---|---|
| 1 · born-at-entry, owner-token-bound recap ledger + gate that transfers the S residue by name | **split**: the ledger **ARTIFACT** (`docs/tranches/T/PROMPT-RECAP.md`, authored in this docs phase) **→ T.S7**; the **gate teeth** `proof:prompt-recap-t` ↳ **T.M10** (charter coordination note 4) |
| 2 · owner-review as a wave-closure precondition (the S.E lesson, structural) | ↳ cross-ref **T.M2** (`proof:owner-review-gate`; asserted a second time by T.M10 clause (iii)) |
| 3 · re-issuance census + recurring-correction-shape class | ↳ cross-ref **T.M10** (clauses (iv) + the correction-shape row class). The ledger row-CLASSES are carried by the T.S7 artifact; the gate CLAUSES are T.M10. |

### Lane 21 — legacy sweep (rec 7 only assigned; recs 1–6 owned elsewhere)

| Rec | Disposition |
|---|---|
| 7 · de-defer or build the DM-22 named-selector resolution | **→ T.S4** |
| *(1 · consolidate the 3 glass-ui-4.0.1 band-aids into one gap ledger + version tripwire)* | ↳ **T.H** (the `glass-ui-gaps` ledger + tripwire; lane 21/20) |
| *(2 · retire `KfPillTabs` onto glass-ui `Tabs`/`SegmentedTabs`)* | ↳ **T.E / T.C / T.H** (glass-ui consumption; VERDICT #18) |
| *(3 · replace the placeholder `AnimationGroup` with a `TransportSource` interface)* | ↳ **T.B** (SceneFacility replaces `useContractAnimGroup`; VERDICT #25) |
| *(4 · DRY the hot/cold readout throttle into one composable)* | ↳ **T.F23(c)** (state/composable consolidation — OWNED there) |
| *(5 · sweep `demo` `any` to a bounded ceiling under a gate)* | ↳ **T.F23(b)** (demo restructure + hygiene ceiling — OWNED there) |
| *(6 · add `proof:no-dead-export` + excise the confirmed-dead symbols)* | ↳ **T.F23(a)** (OWNED) / **T.M8** (hygiene-chain wiring) |

---

## Charter conflicts / coordination notes spotted

1. **"S.Z1–Z3 close executed" (charter T.Z) vs "do not re-open S" (lane 27 F1 / lane 28 F6).**
   Read as consistent: T does not re-run the *S* waves — it **folds their substance** (S.Z1 recap →
   T.S7; S.Z2 RE-EXECUTION → T.S1's from-clean re-run; S.Z3 FINAL → **T.Z's own T-equivalent close**)
   and closes S **by named transfer**. T.Z executes the close *proper* over T's FINAL, subsuming the
   S.Z3 substance; T.S7's OWNER-ASKS row-4 transfer is the precondition that unblocks it. Flagged so
   the impl drive does not spin up S-branch wave commits.

2. **Session-log backfill double-home (lane 27 rec 4: T.M vs T.S).** Resolved per T.M9's own coordination
   note 3 and this band's T.S5: **T.M owns the amendment DISCIPLINE + `proof:board-live` freshness gate;
   T.S executes the S-side backfill CONTENT under it.** No double-authoring; the discipline gate is not
   orphaned from the content. (Concordant with T.M.md's stated split — no conflict.)

3. **`PROMPT-RECAP.md` authorship split (charter §1 lists it under both T.M and T.S).** Resolved per
   T.M10's coordination note 4: **T.M owns the GATE + the ledger SCHEMA/design (lane 28 §3); T.S
   materializes the ROW CONTENT.** The file is created **once**, in this docs phase, against T.M10's
   schema — this band authors `docs/tranches/T/PROMPT-RECAP.md` now; T.M10 authors the gate that binds
   it. Flagged so the born-at-entry file is not duplicated.

4. **Deploy authorization posture.** T.S6 revives an *auto-deploy* path, but the whole-tranche doctrine
   (T.M1/M3) forbids deploying a green-source-shape-only demo. Coordination: the `workflow_run` trigger
   is *built* now (born-RED gate) but **fires only** once green demo-correctness rides an owner-anchored
   render (T.M gates green). Flagged so the impl drive does not deploy the rejected state through a newly
   auto-wired path — the auto-path is the *mechanism*; the owner-anchored gates are the *permission*.

5. **DM-22 is a library touch inside a demo-facing charter.** Charter §4 rings-fences Band B's library
   carve; T.S4 touches `src/animation/compile/frame-compiler.ts`. Read as in-scope: it is a *new-defect*
   (an unbuilt P-era deferral advertising a cure), the same exception class the charter grants T.A
   (plain-vars projection + MorphSVG attribute contract). Flagged so it is not mistaken for re-litigating
   the ring-fenced carve.
