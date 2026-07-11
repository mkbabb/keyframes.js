# U.Z — THE CLOSE

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
> This is the U.Z close template — the T FINAL.md pattern (`T/FINAL.md`), pre-authored
> WITH the drive so the close is a RECONCILIATION, not a re-derivation. The terminal
> actions it gates (the certifying sweep, the OD-U8 version cut, the deploy-of-record
> firing on the REDESIGNED gating) land at U.Z under the owner-anchored close; the
> deliverable authored here is `docs/tranches/U/FINAL-U.md` (born as a DRAFT, reconciled
> at close — the same born-draft pattern the S and T closes used).
>
> **Charter sentence (U.md §2).** The certifying sweep on the terminal tree; the version
> cut **5.3.0** (OD-U8 RULED — U is additive-only; anything truly breaking is deferred to
> a later major, NOT U); the deploy-of-record on the REDESIGNED gating (U.A8); the
> S/T-pattern close ledger; **zero open deferrals as the HARD exit criterion.**
>
> **Provenance lanes:** 01 (prompt-recap-total — the standing-mandate clearance bar, the
> "no chronic exits U" mandate, parse-that certified clean), 06 (chronic-census — the
> RED-on-defect→GREEN-on-current-SHA acceptance bar [F7], the two-register collapse, the
> "do NOT re-point the stale substrate — DELETE the ledger" ruling [F1], the born-RED-exit-0
> laundering device [F5]), 09 (gate-apparatus-meta — the three-mechanism target the sweep
> runs on; the meta-gate layer deletion that removes every ledger the exit oracle could
> resurrect).
>
> **Ring-fences honored (U.md §4):** the owner-golden mechanism SURVIVES and is one of the
> three sweep legs (fence 3 — the certifying run is `npm test` + `proof:publish` +
> owner-golden, never a 227-gate `proof:all`); the two package "in"s are unchanged, so the
> OD-U8 surface-delta is derived against them (fence 5); DEVELOPMENT ONLY — this is the
> close template, not the close (fence 4). **Net gate count only goes DOWN — U.Z authors
> ZERO new standing gates** (§6 anti-sprawl): every close oracle is a SURVIVING mechanism
> (`npm test` / `proof:publish` / `proof:prompt-recap-u` / owner-golden) or a ONE-SHOT
> close witness, never a new `proof-*.mjs` — most emphatically NOT a standing exit-check
> meta-gate (that would BE the resurrected ledger the exit criterion forbids).

---

## §Z.0 — The measured ground truth (read @ 5.2.0, `tranche-u-dev`)

| Fact | Value | Source (verified) |
|---|---|---|
| current published version | **5.2.0** | `package.json.version`; the T close cut (`T/FINAL.md:113`) |
| deploy workflows | `ci.yml`, `deploy-pages.yml`, `release.yml` | `ls .github/workflows/` |
| deploy-of-record target | keyframes.babb.dev (Cloudflare Pages, branch `master`) | MEMORY `project_deploy_cloudflare_pages` |
| npm publish trigger | tag-triggered `release.yml` — **CI-independent** | MEMORY `project_tranche_r_impl_drive_shipped` |
| the deploy ancestry oracle TODAY | `proof:published-on-master` (`v${version}` derived, `merge-base --is-ancestor`) | `scripts/proof-published-on-master.mjs:1-20` — **a self-policing gate DELETED at U.A5** |
| the ledgers the exit oracle must NOT resurrect | `T_BORNRED_BACKLOG` (8), `FROZEN_SET` (36), `proof:chronic-closure` (S-substrate), `ROSTER_CEILING` (120) | `gate-bands.mjs`; `proof-chronic-closure.mjs:145` — **all deleted at U.A5/U.E** |
| the three surviving mechanisms | `npm test` (correctness) + `proof:publish` (boundary/surface/deps) + owner-golden | U.A §A.0 target; `proof:publish` AUTHORED at U.A1 |
| the standing recap mechanism | `proof:prompt-recap-u` (renamed from `-t`, refreshed teeth) | U.R2; survives U.A5 (ring-fence 3 — a mandate mechanism, not a meta-gate) |
| OD-U8 status | **RULED (2026-07-10): 5.3.0** — BINDS U to a compatible (additive-only) published surface | `OWNER-DECISIONS.md` OD-U8 |
| OWNER-ASKS rows | 6 (row 1 the dissolution edict OPEN; row 2 ANSWERED; rows 3–6 the 2026-07-10 ruling batches + the convergence-loop mandate, EXECUTED into the register) | `OWNER-ASKS.md` |

**The one sentence.** The T close fired against a 227-gate roster and a `proof:all`
mega-run; the U close fires against **three mechanisms and no ledger** — so the
certifying sweep is smaller, the version cut is the RULED 5.3.0 verified by a surface-diff, the deploy
gating is the redesigned U.A8 trigger, and the zero-deferral exit is machine-checked by
the SURVIVING recap gate plus a one-shot absence witness — **never by resurrecting a
backlog register, which is the exact device U dissolved.**

---

## §Z.1 — The wave table

| # | Title | Substance | Size | Gate / oracle | Edges |
|---|---|---|---|---|---|
| **U.Z1** | THE CERTIFYING SWEEP (the three-mechanism close-run) | Define + run the terminal certifying sweep on the merged tree: `npm test` (both vitest projects — all correctness, the folded value-proofs + characterization net) + `proof:publish` (`boundary && published-surface && deps-current`) + `proof:prompt-recap-u` (mandate + residue cleared) + the U.A7 nightly demo roster GREEN (writes `last-demo-green`) + owner-golden BLESSED. The orchestrator INDEPENDENTLY re-runs every claimed gate on the merged tree (the T4/T5 re-run discipline) — no agent self-report is trusted | M | the sweep passes: `npm test` green, `proof:publish` green, `proof:prompt-recap-u` green, nightly roster green, owner-golden BLESSED — no new gate | LAST; after every U band lands; needs U.A1 (`proof:publish` exists) + U.A7 (nightly) + U.G (owner-golden authority) + U.R (recap gate) |
| **U.Z2** | THE ZERO-OPEN-DEFERRALS HARD EXIT (machine-checked without resurrecting a ledger) | The exit oracle = `proof:prompt-recap-u` §2/§4 (every open-residue + chronic/external row cleared to an owner/tree token OR converted to a U.F deadlined covenant with a NAMED producer + absorb-or-expire deadline) + a ONE-SHOT close witness that the roster contains NO gate exiting 0 while asserting a failure (the born-RED-exit-0 device is structurally gone with `gate-bands.mjs`). State the falsifiable "V inherits NOTHING" check | M | `proof:prompt-recap-u` clause (v) (no `PENDING-OWNER` stuck at close) + a one-shot roster absence-scan (`gate-bands.mjs`/`T_BORNRED_BACKLOG`/`proof:chronic-closure` ABSENT; no exit-0 mask) — no new standing gate | U.Z1; co-own U.E1/U.E3 (the adjudications this certifies) + U.F (the covenants) + U.A5 (the deleted ledgers) |
| **U.Z3** | OD-U8 — THE VERSION CUT: 5.3.0 (RULED) + the additive-only CONSTRAINT CHECK | The cut is **5.3.0 (MINOR), fixed by owner ruling (OD-U8)**. Run `proof:published-surface` in diff mode vs 5.2.0 to CONFIRM the removed/renamed published-symbol set is EMPTY (the additive-only bind); enumerate the additive delta (new transport verbs, `driveScrollCSS`, the widened `BlendMode`) for FINAL-U. A non-empty removed/renamed set is a WAVE BUG to fix before close, never a trigger to bump to 6.0.0 (anything truly breaking is OUT of U's scope). Cut the git tag → `release.yml` publishes | M | `proof:published-surface` diff (surviving mechanism) — asserts the removed/renamed set is EMPTY; a one-shot at close, no new gate | U.Z1 (surface stable); OD-U8 RULED (5.3.0, additive-only); after U.C/U.E4 (the surface-shaping waves) |
| **U.Z4** | THE DEPLOY-OF-RECORD FIRING (on the redesigned U.A8 gating) | Fire the close deploy sequence on the REDESIGNED trigger: `deploy-pages.yml` gates on library-`ci`-green on master AND `last-demo-green` an ANCESTOR of the deploy SHA (`merge-base --is-ancestor`, U.A8) — the `DEMO_CORRECTNESS_JOB` literal + `proof:published-on-master`/`proof:deploy-roundtrip` standing gates are GONE (U.A5/U.A8); the ancestry assertion lives IN the workflow, not a `proof:*` key. Verify keyframes.babb.dev serves the new hash | S | a deploy-of-record FIRE witness on the redesigned trigger + the live hash served (one-shot, not a standing gate) | U.Z1 (sweep green) + U.Z3 (tag cut) + U.A8 (the redesigned trigger) + U.A7 (`last-demo-green` written) |
| **U.Z5** | THE CLOSE LEDGER + MEMORY/BOARD ROWS (the S/T FINAL pattern) | Author `FINAL-U.md` (born DRAFT now, reconciled at close): the mandate/verdict → cure map, the OD register final state, the covenant residue with named producers, the version + deploy record. Flip `PROGRESS.md` band states → LANDED/CLOSED (owner-observable docs — `proof:board-live` deleted at U.A5); write the `project_tranche_u` MEMORY note + the T→U ledger handoff. Restate what V inherits (NOTHING) + its falsifiable check | S | the docs deliverables complete + owner-observable; `proof:prompt-recap-u` green on the fully-updated ledger (the recap gate is the board's surviving witness) | U.Z1–Z4 (records their outcomes); ↔ U.R (the recap ledger is FINAL-U's §-source) |

---

## §Z.2 — Wave detail

### U.Z1 — THE CERTIFYING SWEEP (the three-mechanism close-run)

**Substance.** The T close ran `proof:all` over a 227-key roster + a 131-step CI +
`proof:ci-coverage` cross-check (`T/FINAL.md:164`). U dissolved all three (U.A5/U.A6), so
the U certifying sweep is DEFINED on the three-mechanism world (lane 09 gestalt cure) — it
is exactly and only:

1. **`npm test`** — both vitest projects (`--project=library` + `--project=demo`, U.H2).
   This is the SINGLE correctness harness: the ~1052-test suite + the 37 folded
   `library-correctness` value-proofs (U.A2/lane 07 F7) + the U.H1 characterization net
   (behavior through the two "ins", green across every U.B/U.C move). One command, all
   correctness.
2. **`proof:publish`** — `boundary && published-surface && deps-current` (authored at
   U.A1; the ONLY structural oracle a source grep proves that a test cannot — the
   LIGHT/HEAVY split, tarball==exports==d.ts, the `@mkbabb/*` floor + the U.F1 subpath
   clause + the U.F7 glass-ui drift clause).
3. **owner-golden BLESSED** — `proof:owner-golden` GREEN over the committed BLESSED.json
   (the T.M3 delegated-judgment shape; the appearance genre dissolved INTO it at
   U.A4/U.E2; U.G completes its authority + idle-state capture protocol). Taste is a human
   oracle in the design loop, per the edict.

Plus the two standing-mandate witnesses that survive U.A5 (ring-fence 3): **the U.A7
nightly demo roster GREEN** (the ~5-gate behavioral roster re-homed off the merge path,
writing `last-demo-green=<sha>` — consumed by U.Z4) and **`proof:prompt-recap-u` GREEN**
(the mandate cleared against the tree, U.R).

**The convergence-loop sweep witnesses (U.Z re-runs EVERY measured sweep the loop minted —
the closing witness of the terminal wave order, `loop/PASS-5.md` §7 item 10).** The
certifying sweep also re-runs, on the merged tree, each sweep the Track B loop measured and
froze, verifying the wave order's measured residue is actually gone:

- **the §①.6 72-file `demo/@` grep** (`git grep -l 'demo/@' -- . ':(exclude)docs/tranches/**'`)
  — expect on the terminal tree **the 9 provenance files ONLY** (the keystone dissolution
  U.B1 swept the rest; a stray `demo/@` in active source is a keystone MISS);
- **the §4 N2-residue grep**
  (`git grep -nE 'proof:soa-composite|proof:spring-vector|proof-(spring-vector|soa-composite)\.mjs'`)
  — expect **tombstones ONLY** (past-tense / retired form; any present-tense hit is an
  uncured §4 residue). **N2's chartered clause (U.E9, ruling 23) is DONE only when this
  witness is GREEN** — this is where N2's missing 12 points are earned;
- **P3's fold-map witnesses** — `find . -name CLAUDE.md` → ZERO, and every load-bearing
  claim resolvable at its new inline/README home (the `loop/P3-FOLD-MAP.md` completeness
  check, U.E7);
- **P4's stricter-lint red-on-plant** — the suppression baseline deleted, a planted
  violation REDs against the strictly-stricter lint (U.E8's born-RED-on-plant witness).

**The independent re-run discipline (the T4/T5 lesson, MEMORY `project_tranche_r_impl_drive_shipped`).**
The orchestrator re-runs EVERY claimed gate on the MERGED tree — agent self-reports are
not trusted (R caught 3 "pre-existing" regressions, a bench excision, and integration
fallout that agents mis-reported). The sweep is a fact re-derived at close on the merge
SHA, never a transcript claim.

**Why gestalt.** Coverage is now TRUE BY CONSTRUCTION (lane 09 F3): `npm test` runs all of
vitest, `proof:publish` runs the one structural oracle, CI runs exactly those two — there
is nothing to cross-check, so there is no `proof:ci-coverage` mega-gate and no `proof:all`
union to reconcile. The sweep is smaller than T's by two orders of magnitude and asserts
strictly MORE (behavior, not source shape).

**Gate/oracle.** The three mechanisms + the two mandate witnesses + the four
convergence-loop sweep witnesses (§①.6 `demo/@` grep → 9 provenance files only; §4 residue
grep → tombstones only; `find CLAUDE.md` → zero; suppression red-on-plant), each green on
the merge SHA. NO new gate — the sweep IS the surviving apparatus exercised once, now also
closing the loop's measured sweeps.

**Edges.** LAST in the tranche. Needs U.A1 (`proof:publish` exists), U.A7 (the nightly
roster + `last-demo-green`), U.G (owner-golden authority — else the third leg has no
oracle), U.R (the recap gate). Feeds U.Z2 (the exit criterion reads the same run) + U.Z4
(the deploy consumes `last-demo-green`).

**Evidence.** lane 09 F3/F7 (coverage true-by-construction; the three-mechanism cure);
`T/FINAL.md:158-167` (the T close checklist — the pattern this supersedes); U.A §A.0 (the
three-mechanism target); U.H2 (the two projects); MEMORY `project_tranche_r_impl_drive_shipped`
(independent re-run).

---

### U.Z2 — THE ZERO-OPEN-DEFERRALS HARD EXIT (machine-checked without resurrecting a ledger)

**Substance — the exit oracle.** "Zero open deferrals" is the HARD exit criterion (U.md §0:
*"with zero deferrals surviving into V"*). The subtle constraint the T close never faced:
**the ledgers that USED to answer "any open deferrals?" are DELETED** — `T_BORNRED_BACKLOG`
(the born-RED-exit-0 register), `FROZEN_SET`, `ROSTER_CEILING`, and `proof:chronic-closure`
with its S-substrate all go at U.A5/U.E3. So the exit oracle CANNOT be "scan the backlog for
exit-0 rows" (no backlog) nor "run chronic-closure over the ledger" (no gate, no substrate).
Re-introducing either to answer the exit question would RESURRECT the exact honest-defer
device the tranche dissolved (lane 06 F5 — the born-RED-exit-0 laundering; lane 06 F1 — the
stale-substrate re-point). The exit oracle is instead the composition of TWO surviving
mechanisms:

1. **`proof:prompt-recap-u` §2/§4 clearance** (the standing recap gate, U.R2 — survives
   U.A5 as a mandate mechanism, NOT a meta-gate: it clears the owner's "recap ALL prompts"
   ask, it does not police other gates). Its clause (v) REDs on any `PENDING-OWNER`
   spirit-status stuck at close; every §2 open-residue row and every §4 chronic/external
   row must carry EITHER an owner/tree clearance token OR a conversion to a U.F **deadlined
   covenant with a named upstream producer** (never a standing kf tripwire). A covenant is
   the honest fold for a USER-DOMAIN chronic (lane 06 F4) — it is a dated ask in a letter,
   not a gate that reds forever.
2. **A ONE-SHOT close witness** that the roster contains NO gate exiting 0 while asserting
   a failure. In the three-mechanism world this is TRUE BY CONSTRUCTION — the born-RED-exit-0
   device required `gate-bands.mjs` + the `ci-coverage` EXCLUDED set to hold a RED gate out
   of every blocking chain (lane 06 F5); both are deleted (U.A5), so ANY red `proof:*` now
   genuinely fails CI. The witness is a grep at close (`gate-bands.mjs` ABSENT,
   `T_BORNRED_BACKLOG` ABSENT, `proof:chronic-closure` ABSENT, no `exit(0)`-despite-fail
   masker survives), NOT a standing meta-gate — a STANDING exit-check gate would itself BE
   the resurrected `ci-coverage` layer.

**The acceptance bar (lane 06 F7).** Every chronic that closes in-U closes to
**RED-on-defect → GREEN-on-current-SHA with a re-derived witness** (the row-1 / DM-20 deploy
pattern that closed HONESTLY — not paperwork). The DM-9..DM-15 defect chronics (U.E3) each
carry a live-green browser-gate witness on the merge SHA, recorded in `docs/`; a chronic that
cannot show a GREEN witness is re-opened as a U cure, never re-booked into a defer device
(there is none to re-book into).

**The falsifiable "V inherits NOTHING" check (state it, so it can be broken).** V inherits
nothing IFF ALL FOUR hold, and is FALSIFIED the moment any one fails:
- **(a)** NO born-RED gate exists — no `proof:*` exits 0 while asserting a RED (the roster
  absence-scan is clean). *Falsified by:* any gate re-introducing an exit-0 mask.
- **(b)** every U.F external covenant is EITHER absorbed (the sibling shipped, kf re-pinned,
  the tripwire retired) OR explicitly owner-re-deadlined with a token in the letter — NONE
  silently re-carried. *Falsified by:* a covenant row with no dated producer or no owner
  token at close (a silent fifth re-carry — the device U terminates).
- **(c)** `proof:prompt-recap-u` greens with ZERO `PENDING-OWNER` rows in §2/§4. *Falsified
  by:* the recap gate reding on a stuck row.
- **(d)** every convergence-loop ruling (OD-U15 CLAUDE.md removal, OD-U16 granularity both
  directions, OD-U17 suppression removal, OD-U18 the loop itself) is EITHER a landed wave
  set OR carries an explicit owner deferral token at close. *Falsified by:* an OD-U15..U18
  ruling silently absent from the close ledger (the exact self-certification gap the loop
  mandate forbids).

This check is the whole point: the exit is decided by an owner-observable ledger clearance +
a construction fact, never by an apparatus scanning itself.

**Gate/oracle.** `proof:prompt-recap-u` clause (v) + the one-shot roster absence-scan. NO
new standing gate (a standing exit-check is the forbidden resurrection).

**Edges.** U.Z1 (reads the same merge run). Co-owns the adjudications it certifies: U.E1
(the 8-row `T_BORNRED_BACKLOG` terminal table), U.E3 (the chronic ledger + DM witnesses),
U.F (the deadlined covenants), U.A5 (the deleted ledgers). Feeds U.Z5 (FINAL-U records the
cleared state).

**Evidence.** lane 06 F1 (do-not-re-point-DELETE the ledger), F4 (external → published-consume
covenant), F5 (the born-RED-exit-0 laundering device), F7 (the RED→GREEN-with-witness bar);
U.E §E.2 Table 1 (the 8-row disposition, every forward-owner named); U.F Risks (the five
deadlined covenants, "NONE rides silently into V"); U.R2 clause (v) (the `PENDING-OWNER`
teeth); lane 09 F2 (deletion becomes `git rm`, no ledger).

---

### U.Z3 — OD-U8: THE VERSION CUT — 5.3.0 (RULED) + the additive-only constraint check

**Substance.** OD-U8 is **RULED (2026-07-10): the close version is 5.3.0 (MINOR)**, fixed
by the owner — and the ruling BINDS U to a compatible published surface (additive-only;
anything truly breaking is OUT of U's scope, deferred to a later major, NOT bumped to
6.0.0 inside U). The close procedure is therefore a CONSTRAINT CHECK, not a version
derivation:

1. Run **`proof:published-surface`** (a surviving `proof:publish` leg) in DIFF mode against
   the 5.2.0 published artifact (`dist/keyframes.d.ts` + `dist/engine/index.d.ts` + the
   `exports` map + the tarball file list).
2. **ASSERT the removed/renamed published-symbol set and the dropped entry-point set are
   EMPTY** (the OD-U8 additive-only bind). The U changes near this line: the CJS-era `main`
   drop is a NON-EMITTED dead artifact (not a published entry — OD-U8-compatible); the U.E4
   src dead-export sweep un-exports symbols with ZERO external consumers (a d.ts shrink of
   never-reachable API, the T `MotionPath`/`MorphSVG` survival reasoning at
   `T/FINAL.md:120-121`); the U.C surface collapse is INTERNAL iff the exported KEY SET is
   byte-identical — each is designed to keep the set empty.
3. **If the diff shows ANY removed/renamed published symbol, that is a WAVE BUG to fix
   before close** — never a trigger to bump to 6.0.0. The offending wave re-lands
   additively or its breaking slice is deferred out of U.
4. Enumerate the ADDITIVE delta (the new `seek`/`adoptClock`/`seekAndPlay` verbs,
   `driveScrollCSS`, the `BlendMode` widen) — tabled in FINAL-U as the 5.3.0 record.

**The cut mechanism.** The version bump is a git TAG at close; `release.yml` publishes on the
tag (tag-triggered, CI-INDEPENDENT — the cut does not wait on CI, MEMORY
`project_tranche_r_impl_drive_shipped`).

**Gate/oracle.** `proof:published-surface` diff (the surviving mechanism) asserting the
removed/renamed set is EMPTY + supplying the additive delta. A one-shot at close — no new gate.

**Edges.** U.Z1 (the surface is stable on the merge SHA). OD-U8 RULED (5.3.0, additive-only).
After U.C (surface collapse) + U.E4 (dead-export shrink) — the two surface-shaping waves.
Feeds U.Z4 (the tag fires the deploy) + U.Z5 (FINAL-U §version).

**Evidence.** `OWNER-DECISIONS.md` OD-U8 (RULED 5.3.0, the additive-only bind);
`T/FINAL.md:111-134` (the T version-owner reasoning — the pattern); U.C brief + Risks R4 (the
additive-only constraint carried per wave); U.E §E.2 Table 3 (the 26 src dead exports — d.ts
shrink); U.F ring-fence 5 (subpath is internal); `package.json` version 5.2.0.

---

### U.Z4 — THE DEPLOY-OF-RECORD FIRING (on the redesigned U.A8 gating)

**Substance.** The T deploy welded the deploy to the browser job by a single-sourced
`DEMO_CORRECTNESS_JOB` literal + the `proof:published-on-master`/`proof:deploy-roundtrip`
standing gates (`T/FINAL.md:138-155`). U.A8 REDESIGNED this and U.A5 DELETED those
self-policing gates — so the U deploy-of-record fires on the new trigger:

- `deploy-pages.yml` gates on **(a) library-`ci`-green on master** + **(b) `last-demo-green`
  an ANCESTOR of the deploy SHA** (`git merge-base --is-ancestor`, the ref U.A7's nightly
  writes). The `DEMO_CORRECTNESS_JOB` literal + preflight coupling are RETIRED; the ancestry
  assertion lives IN the workflow (a workflow step), NOT a standing `proof:*` key — provenance
  collapses to workflow/`release.yml` steps, not gates (lane 09 F5 / U.A5 principle).

**The close sequence (the last acts, in order).**
1. Merge U → the single `gates` job green on master (`npm test` + `proof:publish` + the fast
   structural gates — U.A6, no browser on the merge path).
2. The U.A7 nightly roster runs green → writes `last-demo-green=<merge-sha>`.
3. Owner-golden BLESSED (BLESSED.json committed → `proof:owner-golden` GREEN, U.G).
4. Version tag cut (U.Z3) → `release.yml` publishes to npm.
5. `deploy-pages.yml` fires on the redesigned trigger: library-`ci`-green + `last-demo-green`
   ancestor-of-deploy-SHA → deploy.
6. Verify **keyframes.babb.dev serves the new hash** (the live-hash witness — the S.R1 /
   `project_ci_was_dead_and_deploy_creds` lesson: confirm the served bundle, not just the
   workflow success).

A red nightly FREEZES the deploy ref (opens an issue) — it never blocks every push on a
40-min browser job (U.A8). Break-glass `workflow_dispatch` stays.

**Gate/oracle.** A deploy-of-record FIRE witness on the redesigned trigger + the live hash
served at keyframes.babb.dev. A one-shot close act, NOT a standing gate (the two deploy gates
that used to stand are deleted).

**Edges.** U.Z1 (the sweep green) + U.Z3 (the tag cut) + U.A8 (the redesigned trigger) + U.A7
(`last-demo-green` written). This is the terminal close act, not a mid-drive fire.

**Evidence.** U.A8 (the redesigned gating — library-green + `last-demo-green` ancestor); U.A7
(the nightly writes the ref); U.A5 (`proof:published-on-master`/`proof:deploy-roundtrip`
deleted); `T/FINAL.md:138-167` (the T deploy pattern this supersedes); MEMORY
`project_deploy_cloudflare_pages` + `project_ci_was_dead_and_deploy_creds` (CF Pages; verify
the served hash).

---

### U.Z5 — THE CLOSE LEDGER + MEMORY/BOARD ROWS (the S/T FINAL pattern)

**Substance.** Author `docs/tranches/U/FINAL-U.md` — the S/T FINAL.md close record, BORN AS A
DRAFT with this drive (the T.Z discipline: authored WITH the drive so the close reconciles,
not re-derives), reconciled at close. Its sections mirror `T/FINAL.md`:
1. **The mandate + escalation → cure map** — the standing 7-clause mandate cleared per U.R4's
   §1 binding column (each clause → its owner-observable U oracle), the CI-trim + grand-restructure
   escalations LANDED, every §2 open-residue row terminal (row 1 = the T #26 overstatement,
   cleared by U.B's F1/F2 DELETIONS + `proof:colocation` REQUIRING + an owner review).
2. **The OD register final state** — OD-U1..U18 final tokens (the T.M2 machine-bound shape),
   including the four convergence-loop rulings (OD-U15..U18): each is either a LANDED wave
   set or carries an explicit owner deferral token — never silently absent.
3. **The covenant residue** — the five U.F deadlined covenants with named producers + deadlines
   (value.js KF-7 / `parseTimingFunction` / authored-plain; glass-ui BG-5/GU-1/GU-2/BG-11), each
   absorb-or-expire, NONE to V.
4. **The version + deploy record** — the OD-U8 enumerated delta + the cut; the deploy-of-record
   firing + the served hash.
5. **The zero-deferral exit** — U.Z2's four-part falsifiable check, evaluated true.

**The MEMORY/board close rows.**
- Flip `PROGRESS.md` band states U.A..U.Z → **LANDED/CLOSED** (owner-observable docs — note
  `proof:board-live` is a self-policing gate DELETED at U.A5, so the board close is a docs
  deliverable witnessed by `proof:prompt-recap-u`'s freshness clause, not a board gate).
- Write the `project_tranche_u_impl_drive_shipped` MEMORY note (the S/T/R pattern: version cut,
  PR→master, band verdicts, the apparatus-dissolution headline — 227→~36 gates, the three
  mechanisms, the Linux runner retired, the ledgers deleted).
- Record the **T→U ledger handoff**: `T/PROMPT-RECAP.md` becomes frozen provenance; the live
  ledger is `PROMPT-RECAP-U.md` under `proof:prompt-recap-u` (the U.R2 supersede).

**What V inherits — NOTHING, by charter (U.md §0), and the falsifiable check that proves it.**
V inherits no born-RED gate, no chronic ledger row, no `T_BORNRED_BACKLOG`, no FROZEN lock, no
open deferral device — because U.A dissolved the apparatus that HELD deferrals and U.E adjudicated
every row terminal. The check is U.Z2's four-part test evaluated at close (no exit-0 gate; every
covenant absorbed-or-owner-re-deadlined; recap greens with zero PENDING). If V opens and finds a
kf-owned born-RED gate or a silently-carried covenant, THIS check was falsified — that is the
owner-observable contract, not a promise.

**Gate/oracle.** The docs deliverables complete + owner-observable; `proof:prompt-recap-u` green
on the fully-updated ledger (the recap gate is the surviving board witness after `proof:board-live`
is deleted). NO new gate.

**Edges.** U.Z1–Z4 (records their outcomes). ↔ U.R (the recap ledger is FINAL-U's §-source; the
board close is the last per-wave update event under U.R3's discipline).

**Evidence.** `T/FINAL.md` (the whole close-record pattern); MEMORY `project_tranche_u` slot
(to author); U.R2 (the recap supersede — T frozen, U live); U.md §0 (zero deferrals into V);
`OWNER-DECISIONS.md` (OD register); U.F Risks (the covenant residue).

---

## Risks + the re-arm map

The stale-era re-arm class is EXPECTED (U.md §5): every U.Z close act reads gates the U bands
re-shaped. Disposition is USE-THE-SURVIVOR (the certifying mechanisms) or ONE-SHOT-WITNESS
(the close acts) — never a new standing gate. U.Z authors **ZERO** new standing gates.

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **Z1** | the T `proof:all` mega-run + `proof:ci-coverage` cross-check as the certifying shape | USE the three surviving mechanisms (`npm test` + `proof:publish` + owner-golden) + the two mandate witnesses (`proof:prompt-recap-u`, nightly roster); independent re-run on the merge SHA. No new gate |
| **Z2** | the deleted ledgers (`T_BORNRED_BACKLOG`, `proof:chronic-closure`, `FROZEN_SET`) as the "any open deferrals?" answerers — a naive re-scan would RESURRECT them | The exit oracle is `proof:prompt-recap-u` §2/§4 clearance + a ONE-SHOT roster absence-scan; the standing-exit-check-gate temptation is REFUSED (it would be the resurrected `ci-coverage`). The V-inheritance check is falsifiable, owner-observable |
| **Z3** | any hardcoded version constant (the T `v4.4.0`-rot class, `proof-published-on-master.mjs:16`); any wave whose surface delta violates the additive-only bind | The cut is the RULED 5.3.0 (OD-U8); `proof:published-surface` diff CONFIRMS the removed/renamed set is EMPTY — a non-empty diff is a wave defect fixed before close, never a 6.0.0 bump. The tag is the cut, `release.yml` publishes |
| **Z4** | `deploy-pages.yml`'s `DEMO_CORRECTNESS_JOB` literal + preflight; `proof:published-on-master` + `proof:deploy-roundtrip` (the T standing deploy gates, DELETED at U.A5) | FIRE on the redesigned U.A8 trigger (library-green + `last-demo-green` ancestor); the ancestry assertion lives IN the workflow; verify the served hash (one-shot). No standing deploy gate survives |
| **Z5** | `proof:board-live` (self-policing, DELETED at U.A5) as the board witness; `T/PROMPT-RECAP.md` as the live ledger | The board close is a docs deliverable witnessed by `proof:prompt-recap-u` freshness; `T/PROMPT-RECAP.md` → frozen provenance, `PROMPT-RECAP-U.md` the live ledger; the MEMORY note authored |

**Standing invalidation the band CREATES, not clears (forwarded — the load-bearing edges).**
U.Z1's owner-golden leg depends on U.G completing the golden authority + idle-state capture
(U.A4/U.E2 HARD-GATED on U.G); if U.G slips, the third sweep leg has no oracle and the close
cannot certify. U.Z2's exit oracle depends on U.E1/U.E3 having adjudicated EVERY row terminal
and U.F having authored the deadlined covenants with owner tokens — if any row stays
`PENDING-OWNER`, the exit criterion is (correctly) UNMET and the close does not fire. These are
not U.Z defects — they are the close REFUSING to certify an incomplete tranche, which is the
zero-deferral criterion working as designed.

**Net gate delta (the band's headline):** U.Z authors ZERO new standing gates. The certifying
sweep, the exit oracle, the version derivation, the deploy fire, and the board close are each a
SURVIVING mechanism exercised once or a ONE-SHOT close witness. The close is the proof that the
three-mechanism world is sufficient: a tranche certified by `npm test` + `proof:publish` +
owner-golden + one recap gate, with zero open deferrals machine-checked WITHOUT a ledger — the
apparatus is no longer the legacy, and nothing carries to V.
