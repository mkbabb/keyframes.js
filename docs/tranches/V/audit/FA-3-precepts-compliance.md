# FA-3 — Precepts Compliance + Write-Bound Disjointness + DAG Coherence

**Lane:** FA-3 · **Prefix:** `FA3-` · **Date:** 2026-07-17 · **Model:** opus
**Scope:** the formed V corpus (`V.md`, `waves/V.{A..G,Z}.md` = W1–W13,
`PROGRESS.md`, `DISPOSITIONS.md`, `PROMPT-RECAP-V.md`, coordination + audit) vs
the formation contract of record: `docs/precepts/instructions/tranche/SPEC.md`,
`WAVE_SPEC.md`, and `docs/precepts/instructions/TRANCHE-AND-WAVE-SPEC.md`.
**Evidence law:** every claim is `file:line` or `command + output`.
READ-ONLY everywhere except this report.

## Verdict

The formation is **structurally strong but not yet ratifiable**. The tranche
plan carries all 10 SPEC.md plan-shape items; all 13 waves are named
`W<N> - Title`; every XB-01..08 amendment landed; hard gates are artefact-backed
with red-witness discipline (no grep-only runtime gates); the DAG is acyclic.

Two **P1 formation defects** block ratification, both write-conflicts the plan's
own global-ownership lines assert away but the wave file-bounds contradict:
`package.json` is written by W2/W4/W9 and `.github/workflows/*` by W2/W9/W10,
with **no ordering edges** sequencing the parallel writers. Beyond those, a
cluster of P2 required-section omissions (Triumvirate absent in 3 waves;
Worktree Plan absent in all 5 parallel-writer waves; sub-wave goal criteria
missing across 6 units; a W8→W11 DAG asymmetry) must be closed before dispatch.

---

## P1 — must fix before ratification

### FA3-01 · P1 · write-conflict — `package.json` written by W2/W4/W9 with no ordering edge; V.md declares it "W2-only"

`V.md:106`: *"Global: `package.json` / `package-lock.json` are W2-only"*. This is
falsified by two other waves' own file bounds:

- W2 (`V.A.md:170`): `package.json`, `package-lock.json | modify (glass devDep + lock regen only)`.
- W4 (`V.B.md:69`): `scripts/gates/structure/index.mjs`, `package.json` (one key) `| create/modify`.
- W9 (`V.D.md:76`): `package.json` (test:demo, review:owner-golden keys) `| modify`.

W4 (`Depends on: none`, `V.B.md:114`) and W9 (`Depends on: none`, `V.D.md:114`)
carry **no ordering edge between them** and both open at tranche-open independent
of the rail; W2 is external-blocked and may land last. Three waves in three
different bands write the same path with no sequencing. This violates
`WAVE_SPEC.md:85` *"No two parallel waves may write the same path"* and the
`SPEC.md:83` *"No overlapping write bounds"* rule. Even though the keys differ
(scripts vs devDependencies), path-level disjointness is the precept and V.md's
"W2-only" ownership statement is simply untrue.

**Fix:** either (a) sequence W4's and W9's `package.json` key-adds ahead of W2's
lock-regen with explicit DAG edges and a "commit-before-parallelize" note, or
(b) correct `V.md:106` to enumerate the real owners (W2 devDep+lock, W4
proof:structure key, W9 test:demo/review keys) AND add the missing ordering
edges to the §"Ordering DAG" so no two run concurrently on the file.

### FA3-02 · P1 · write-conflict — `.github/workflows/*` written by W2/W9/W10 with no ordering edge; V.md declares it "W9-only"

`V.md:107`: *"`.github/workflows/*` W9-only (plus W3's recorded runs)"*. Contradicted:

- W2's 65-path slice **applies** `deploy-pages.yml` (`V.A.md:169`: *"the 65-path slice (… `deploy-pages.yml` …) | apply"*).
- W9 MR3 **modifies** `deploy-pages.yml` and MR2/MR4 modify `ci.yml` (`V.D.md:76`: *".github/workflows/ci.yml, deploy-pages.yml | modify"*).
- W10 DM-16/17 **modifies** `ci.yml` (`V.E.md:46` Scope 5: *"ci.yml weekly relabel (4 comment lines)"*), and Scope 1 wires the agent-surface `--check` "inside … the CI gates job" (`V.E.md:32`).

`deploy-pages.yml` is thus a two-writer path (W2 apply-slice + W9 MR3) and `ci.yml`
is a two-writer path (W9 real changes + W10 comment relabel). W9 (`Depends on:
none`) and W10 (`Depends on: none`, `V.E.md:99`) have **no edge**; W2's slice is
captured from an isolated K6 clone at `5a9183a7` (`V.A.md:139`) that predates any
W9 MR3 edit, so if W9 lands first, W2's slice-apply reverts MR3. No ordering edge
in `V.md:90-102` sequences W2's slice-capture relative to W9's workflow edits, or
W9 relative to W10 on `ci.yml`.

**Fix:** add explicit edges — W9 (workflow make-reals) and W10 (ci.yml comment
relabel) must be sequenced (single-writer or ordered), and W2's slice-capture
must be pinned before-or-after W9's MR3 on `deploy-pages.yml`; correct
`V.md:107` to name W2 and W10 as workflow writers.

---

## P2 — should fix before dispatch

### FA3-03 · P2 · ownership-contradiction — `src/**` declared "V.B-only" but W10 (V.E) edits a src comment

`V.md:107`: *"`src/**` V.B-only"*. W10 File Bounds (`V.E.md:73`) includes
`src/animation/engine/interpolate.ts:257-259` (comment only, XB-05 fold).
Verified the path is real (`src/animation/engine/interpolate.ts:257` carries the
`bench/taxonomy.json` provenance comment) and is **not** in any LT carve batch
(the blueprint lists `engine/interpolate.ts` only as an importer, not a move
row — `R2-05:126,130`), so execution risk is low, but the stated
"src/** V.B-only" ownership is violated by V.E. (Note: R3-04/XB-05 miscites this
as `compile/interpolate.ts`; the wave spec's `engine/` path is the correct one.)
**Fix:** amend `V.md:107` to note the single W10 src comment-edit exception, or
route the fold into a V.B batch.

### FA3-04 · P2 · missing-required-section — Triumvirate Dispatch absent in W6, W12, W13

`WAVE_SPEC.md:57-69` §3a makes the Triumvirate Dispatch section mandatory
(*"Triumvirate is mandatory, not optional"*). Three waves omit it entirely:
W6 (`V.B.md:196-237` — no §3a between Scope and Hard Gate), W12
(`V.G.md:11-62`), W13 (`V.Z.md:5-61`). Each must name the three minimum trigger
classes (bounds-expansion, non-local-recoverable gate failure, third-iteration
diagnostic halt).

### FA3-05 · P2 · missing-goal-criterion — sub-waves lack the paired goal criterion

`WAVE_SPEC.md:178` prohibits *"any wave or sub-wave without a declared goal
criterion AND completion criterion"*. Violations:

- W5.a/W5.b (`V.B.md:164-169`): each carries only a `Sub-gate` bullet — no `Goal`.
- W7.a/W7.b (`V.C.md:71-72`) and W8.a/W8.b (`V.C.md:153-154`): single-line units with an embedded sub-gate but no `Goal` bullet.
- W9 (`V.D.md`): the two named units ("make-real unit", "prune unit") have **no `### V.W9.a/.b` agent-unit subsections at all** — no per-unit Goal or Sub-gate; only the Disjointness line names them.
- W11 (`V.F.md`): units ("design-fix unit", "π/DELTA unit") named in the `Agents` line but with **no agent-unit subsections** — no per-unit goal/sub-gate.

(Secondary: W2.a/b and W4.a/b omit the template's `Mechanism`/`Files` bullets —
`WAVE_SPEC.md:113-118` — lower priority than the missing goals above.)

### FA3-06 · P2 · missing-required-section — Worktree Plan (§4b) absent in every parallel-writer wave

`WAVE_SPEC.md:88-101` §4b: *"If more than one agent writes in this wave, name
the sibling-worktree absolute paths and per-agent CARGO_TARGET_DIR here, or
commit before parallelizing so all agents share clean main."* Five waves run ≥2
writing agents in parallel and none declares §4b: W1 (fix unit + gate unit),
W4 (gate + movers), W7 (chrome + transport), W9 (make-real + prune), W11
(design-fix + π/DELTA). (W2 handles it in a combined §4a — verify unit does not
write, `V.A.md:176-181`; W5/W8 are serial.) Given the recorded worktree
node_modules footgun in prior tranches, this section is load-bearing, not
ceremonial. **Fix:** add a Worktree Plan or an explicit "commit-before-
parallelize" line to W1/W4/W7/W9/W11.

### FA3-07 · P2 · missing-required-section — W11 has no Disjointness statement

W11 runs two writing units but omits §4a Disjointness (`V.F.md:11-98` has no
Disjointness heading). The design-fix unit writes demo source; the π/DELTA unit
writes the screenshots/DELTA tree — likely disjoint, but the required confirmation
is absent. **Fix:** add the §4a statement (and pair it with the FA3-06 worktree line).

### FA3-08 · P2 · DAG-asymmetry — W8 blocks W11 but W11 does not depend on W8

W8 Dependencies (`V.C.md:179`): *"Blocks: W11 (stable anchors), W13"*. W11
Dependencies (`V.F.md:98`): *"Depends on: W1 (W2 for full fidelity)"* — omits W8.
W11 edits `demo/components/instrument/transport/channel-controls/**`
(`V.F.md:68`, DP2-04 `ChannelOptions.vue:219-222`), the exact files W7/W8
relocate and carve into `channel-options/` (`V.C.md:127-134` DT-06/07). If W11
runs after only W1, it operates on pre-move paths. The edge is stated on the W8
side but missing on the W11 side and absent from the `V.md:90-102` DAG. **Fix:**
add `Depends on: W8` to W11 and an explicit W8→W11 edge to the ordering DAG.

### FA3-09 · P2 · soft-ordering + understated-ownership — W10 shares demo/src/workflow writes but V.md lists it as "docs/** only"

`V.md:108`: *"`docs/**` W10+ledgers"* and `V.md:108`: *"`demo/**` V.A(W1)+V.C+V.F"*
(V.E omitted). W10's true footprint far exceeds docs: `demo/DESIGN.md:67`
(verified present) and DM-18 provenance-comment rewords in demo `.vue` files
(`ChromeDock.vue`, `channel-controls/*`, `ControlsPaneWrapper.vue` — `V.E.md:47`),
plus README/CHANGELOG, `bench/*.bench.ts` comments, the src comment (FA3-03),
`ci.yml`, and `llms.txt`. The DM-18 subset shares demo `.vue` writes with W7/W8
under only a **soft** `V.md:98` edge (*"run before or inside W7/W8"* — a
disjunction, not a hard sequencing edge). Token-grep at execution (`V.E.md:47`)
makes W10 robust to stale anchors but does **not** prevent two waves writing the
same `.vue` concurrently. **Fix:** enumerate W10's real write surface in the
ownership block and convert "before or inside" into a hard edge (or fold the
DM-18 demo subset into the W7/W8 waves that own those files).

### FA3-10 · P2 · dual-ownership — `smoke.mjs` owned by both W1 gate-unit and W9 MR1

W1 File Bounds (`V.A.md:58`) lists `scripts/observe/demo/smoke.mjs | modify (gate
unit; pageerror hook lands with W9 MR1 — coordinate, do not duplicate)`, yet
agent unit V.W1.b says the harness lands under `docs/tranches/V/audit/harness/`
(`V.A.md:84`) — an internal contradiction about where W1 writes. W9 MR1
(`V.D.md:77`) also modifies `scripts/observe/demo/{smoke,usability,occlusion}.mjs`.
The "coordinate, do not duplicate" note is a soft coordination, not a hard
single-owner edge. **Fix:** assign `smoke.mjs` to exactly one wave (natural home:
W9 MR1, which owns the pageerror hook) and strike it from W1's bounds; W1's
harness stays under `audit/harness/`.

---

## P3 — polish

### FA3-11 · P3 · format — File Bounds rendered as prose (not the `| File | Access |` table) in 9/13 waves
`WAVE_SPEC.md:72-79` §4 specifies a table. W1/W2/W4/W9 comply; W3 (`V.A.md:272`),
W5 (`V.C`→`V.B.md:155`), W6 (`V.B.md:227`), W7 (`V.C.md:61`), W8 (`V.C.md:143`),
W10 (`V.E.md:71`), W11 (`V.F.md:67`), W12 (`V.G.md:44`), W13 (no §4 at all) render
bounds as prose. Prose bounds are harder to mechanically diff for the write-conflict
scan above; tabulate them.

### FA3-12 · P3 · incomplete-triumvirate-triggers — the "third diagnostic loop" class omitted in most waves
`WAVE_SPEC.md:66` requires §3a to name *"the diagnostic loops whose third
iteration must halt"* at minimum. Only W1 (*"a third diagnostic loop on one
route"*, `V.A.md:46`) and W4 (*"a third red loop on depcruise"*, `V.B.md:62`)
name it. W2/W3/W5/W7/W8/W9/W11 list bounds- and gate-triggers but omit the
third-iteration halt class.

### FA3-13 · P3 · π-viewport-floor — W1 and W3 visual probes run below the ≥3-viewport π floor
`SPEC.md:229` sets the π floor at ≥3 viewports. W1 probes 2 (`1280×800`,
`390×844` — `V.A.md:14`) and W3's native matrix is 2 (`1280`/`390` — `V.A.md:277`).
Both ship visual changes. The full ≥3-viewport before/after DELTA is consolidated
only in W11 (`V.F.md:53`, `390/1280/1440`). Acceptable if W11's DELTA provably
covers W1/W3's deltas — but the plan should state that coverage or lift W1/W3 to
3 viewports so no visual change escapes the ≥3 floor. (π/DELTA is otherwise
correctly and fully carried by W11 — see Negatives.)

### FA3-14 · P3 · reads-circular — W1 "Depends on: W2 (landing)" while "Blocks: W2 close"
`V.A.md:112-114`: W1 depends on W2 for landing yet blocks W2's close. Defensible
as the rehearse-then-land-inside-W2 pattern (`V.md:100-101`), but the edge pair
reads circular; a one-line note distinguishing "rehearsal (no dep)" from
"landing (inside W2)" would remove the ambiguity for a mechanical DAG reader.

---

## Negatives (checked, sound)

- **10-item plan shape complete** — `V.md` carries all `SPEC.md:44-60` items:
  opening (`:8`), thesis (`:22`), goal criterion (`:36`), invariants (`:42`),
  wave table with a Goal column + wave-spec cross-refs (`:70-88`), phase links
  (`:86`), critical-files (`:104`), completion criterion (`:110`), cross-tranche
  debt (`:126`), brittleness window (`:132`).
- **All 8 XB amendments encoded** — XB-01 (`V.B.md:6`/`V.C.md:6`), XB-02
  (`V.C.md:7`/`V.B.md:216`/`V.C.md:134`), XB-03 (`V.C.md:8`/`V.E.md:6`/`V.md:98`),
  XB-04 (`V.B.md:6`/`V.D.md:6`/`V.md:97`), XB-05 (`V.D.md:6`/`V.E.md:8,51`),
  XB-06 (`V.C.md:8`/`V.D.md:12`), XB-07 (`V.B.md:6,16`), XB-08 (`V.E.md:7`).
- **All 13 waves named** `W<N> - Title` in headers, State lines, and the parent
  table; no bare positional wave refs found.
- **Hard gates artefact-backed** — no grep-only *runtime* gate; the `find`/`git
  ls-files`/`wc -l` gates (W4/W7/W8) test structural topology, not runtime
  behaviour, which `SPEC.md:96-104` permits. W9's four make-reals each carry a
  recorded red-case witness (`V.D.md:89-97`) — the anti-vacuous-gate discipline
  is present and exemplary; W8 guards against stubs (`V.C.md:160` "real template
  content (no stub)").
- **Zero-deferral honored** — invariant 8 (`V.md:65`); no cross-tranche debt
  booked; the only BANKED rows are external-producer-gated with named
  re-triggers (`V.md:126-129`).
- **DAG acyclic** — no cycle across the W1–W13 edges (modulo the FA3-14 rehearse
  pattern); DEGRADED runtime outcomes absent (born-RED and external-blocked
  states are legitimate, each with a named green-flip trigger).
- **π/DELTA fully carried by W11** — ≥3 viewports, ≥5 timing samples per modified
  transition, AA contrast, paired before/after `DELTA.md` every page
  (`V.F.md:19-21,53-57,76-81`); the BEFORE baseline is banked (`V.F.md:7`).

## Coverage gaps (this lane)

- No build actuation: `check`/`build:lib`/`test:demo` not run (static formation
  audit only); wave hard-gate commands verified as *named*, not executed.
- The four terminal blueprints (`R2-05/06/07/08`) were not re-audited row-for-row;
  the write-conflict scan used the wave-spec file-bounds + `V.md` ownership +
  R3-04's DAG, not the full blueprint move tables. A latent same-path collision
  inside an un-tabulated prose bound (FA3-11) may remain.
- The 65-path W2 slice inventory was not enumerated; a collision between a slice
  member and a W4/W7/W8/W9/W10 write beyond `deploy-pages.yml`/`package.json`
  was not exhaustively checked.
- `PROMPT-RECAP-V.md` (66 rows) and `DISPOSITIONS.md` (52 rows) row-terminality
  was not walked (W13's own close obligation, not a formation-shape check).
