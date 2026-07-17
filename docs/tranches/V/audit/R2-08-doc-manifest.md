# R2-08 — THE DOC-CORRECTION MANIFEST (FAM-08 + FAM-13)

**Lane:** R2-08 · **Prefix:** DM- · **Date:** 2026-07-17 · **Tree:** `/Users/mkbabb/Programming/keyframes.js` @ working-tree `a59d3a22` (uncommitted K6/Glass-7 transaction live) · **Regen run in AUDIT COPY** `…/scratchpad/kf-audit-copy`

## Verdict

This lane folds FAM-08 (doc-drift) + FAM-13 (close-prose) into ONE executable
correction manifest. Every row below is `file:line → current text (verified
quote) → EXACT replacement → rationale`, executable by a mechanical agent
**without judgment**. I re-verified each precision row against source, not the
handoff's blanket list. The handoff's §3 "weighted blending residue" list is
**confirmed wrong per CH-03**: `grep -rniE "blendmode|\"weighted\"|'weighted'"
src/` → **zero hits** (no `BlendMode` type, no `"weighted"` op anywhere in
source), while `WeightStepper`/`weight`/`weightSpring`/`weight-blend` are all
LIVE (`src/animation/constants/types.ts:221-247`, refusal union
`src/animation/compile/emit/refusal-probes.ts:5`). Therefore of the four
handoff-flagged "weighted blending" doc sites, **exactly one** is a real
code-value drift (`README.md:428` `weighted-blend`→`weight-blend`, DR-3); the
other three README sites + `published-surface.md:151` are **live-feature prose
and MUST NOT be touched** — they are recorded here as explicit DO-NOT-EDIT rows
so a mechanical agent following the handoff's blanket list does not delete
accurate copy.

The llms.txt/llms-full.txt regeneration was run in the AUDIT COPY and its diff
summary is captured (DM-01). It is a **regen-at-wave-time** row — the generated
output is deliberately NOT written into the real repo by this lane.

Row count: 17 executable rows across 8 files + 1 regen row + 3 DO-NOT-EDIT
guard rows + 1 MEMORY re-pin (out-of-repo, noted).

---

## Section A — GENERATED SURFACE (regen at wave time)

### DM-01 — Regenerate `llms.txt` + `llms-full.txt`; wire a real `proof:agent-surface` gate

**Source finding:** DR-1 (P1). **Family:** generated-artifact-drift.

**This is a REGEN row, not a line-edit.** Do NOT hand-edit the generated files
and do NOT write generated output into the real repo from the audit copy.

**Executable step (at wave time, in the real repo):**
```
node scripts/gen-agent-surface.mjs        # writes llms.txt + llms-full.txt
```
then commit the regenerated pair.

**Verified diff summary (regenerated in the AUDIT COPY, then reverted):**
- `llms.txt`: **34 changed line-markers** (committed vs regenerated).
- `llms-full.txt`: **45 changed line-markers**.
- Dominant change: gate-name format `proof:<name> (CI-verified — npm run proof:<name>)`
  → file-reference `check: test/<path>.test.ts` (e.g. `proof:roundtrip-fidelity`
  → `check: test/compile/roundtrip-fidelity.test.ts`), plus header prose
  `proof:* gate` → `focused test or package check` and removal of the
  `proof:agent-surface` self-reference.
- **`getTimingFunction` removal:** committed `llms-full.txt` contains 1 hit
  (`:157`, the 6.0.0-removed export); regenerated output contains **0** — regen
  cures the flagship stale export. Verified: `grep -c getTimingFunction` →
  committed `1`, regenerated `0`.

**Second executable step — make "cannot drift" true (build):** add an npm
script `"proof:agent-surface"` that runs the generator against temp files and
diffs vs committed, failing on any delta, and add it to a CI job:
```json
"proof:agent-surface": "node scripts/gen-agent-surface.mjs --check > /tmp/gen.txt && node -e \"…diff committed vs generated, exit 1 on mismatch\""
```
(exact glue is wave-authored; the contract is: committed-vs-generated diff must
gate.) Today no such script exists (`grep agent-surface package.json` → only
`gen:agent-surface`, the writer) and no CI step runs `--check`.

**Rationale:** DR-1(a)/(b)/(c); the generator's own header (lines 5–20) claims
"cannot drift … Verified by `proof:agent-surface`" — both false today.

---

## Section B — WEIGHTED-BLENDING PRECISION ROWS (the CH-03 correction)

> **Adjudication performed this lane.** `grep -rniE "blendmode|\"weighted\"|'weighted'" src/`
> → **0 hits**. Live union member is `weight-blend`
> (`src/animation/compile/emit/refusal-probes.ts:5,24`; also
> `backward.ts:236`, `entry.ts:81,306`, `format.ts:243`). Live feature symbols:
> `WeightStepper` (types.ts:221), `weight` (types.ts:234), `weightSpring`
> (types.ts:247). Therefore only the `weighted-blend` code-VALUE typo drifts;
> all "weighted blending" PROSE describes a live feature.

### DM-02 — `README.md:428` refusal-reason code value `weighted-blend` → `weight-blend`

**Source finding:** DR-3 (P2). **Family:** stale-api-string.

**Current text (`README.md:428`, byte-verified via `od -c`):**
```
| `weighted-blend`      | no `animation-composition` twin exists          | JS `AnimationGroup`                |
```
**EXACT replacement:**
```
| `weight-blend`        | no `animation-composition` twin exists          | JS `AnimationGroup`                |
```
(Token `weighted-blend`→`weight-blend`; two trailing spaces added after the
closing backtick — 6→8 — to preserve the 14-char column width. If column
alignment is not enforced, the minimal mechanical edit is: on line 428 replace
the literal `` `weighted-blend` `` with `` `weight-blend` ``.)

**Rationale:** The real `CompileRefusalReason` union member is `weight-blend`
(`refusal-probes.ts:5`); `grep "weighted-blend" src/` → 0 hits. A consumer
branching on `refusal.reason === "weighted-blend"` copied from this table would
never match. This is the ONLY genuine weighted-blend code drift.

### DM-03 — GUARD (DO NOT EDIT): `README.md:322` "weighted blending"

**Source finding:** CH-03 negative / DR-1 negative. **Family:** live-feature-prose.

**Current text (`README.md:322`):**
> `…perceptual `oklab` color, scroll-driven progress, weighted blending.`

**Replacement:** **NONE — leave verbatim.**

**Rationale:** Prose naming the live `weight-blend` / `weightSpring` crossfade
feature (types.ts:236-247, `springs.ts:7`). The handoff §3 flag on this line is
REFUTED (CH-03). Booked as a guard row so the handoff's blanket list does not
cause a blind deletion.

### DM-04 — GUARD (DO NOT EDIT): `README.md:433` "(weighted blending, perceptual color)"

**Source finding:** CH-03 negative. **Family:** live-feature-prose.

**Current text (`README.md:433`):**
> `…it names exactly the kf axis (weighted blending, perceptual color) that exceeds pure CSS.`

**Replacement:** **NONE — leave verbatim.** Same rationale as DM-03.

### DM-05 — GUARD (DO NOT EDIT): `README.md:764` "with weighted blending and a transport"

**Source finding:** CH-03 negative. **Family:** live-feature-prose.

**Current text (`README.md:764`):**
> `…running over real WAAPI children where eligible, with weighted blending and a transport the spec lacks.`

**Replacement:** **NONE — leave verbatim.** Same rationale as DM-03.

### DM-06 — GUARD (DO NOT EDIT): `docs/published-surface.md:151` "(`weighted` blend …)"

**Source finding:** CH-03 (explicitly mischaracterized by handoff). **Family:** live-feature-prose.

**Current text (`docs/published-surface.md:150-152`):**
> `…the four CC-3 refusals (`weighted` blend / custom renderers / perceptual oklab beyond densify / computed-unit drift)…`

**Replacement:** **NONE — leave verbatim.**

**Rationale:** This is a PROSE list of the four refusal AXES, not a code-value
list — the sibling entries are also prose (`custom renderers`, not the union
value `custom-renderer`; `perceptual oklab`, not `perceptual-oklab`). The
`weight-blend` refusal is a LIVE first-class surface (refusal-probes.ts:21-28).
The handoff flagged this as "still describes removed weighted blending"; CH-03
refutes it. If a future wave insists on code-value spelling for the WHOLE list,
that is a separate cosmetic decision touching all four axes uniformly — not a
weighted-blend-removal correction, and out of this manifest's scope.

---

## Section C — SMALL DOC-API DRIFTS

### DM-07 — `demo/DESIGN.md:67` `Card surface="cartoon"` → `Card cartoon`

**Source finding:** DR-2 / CH-03. **Family:** stale-component-api.

**Current text (`demo/DESIGN.md:67`):**
```
* **Controls:** `Card surface="cartoon" tier="quiet"`; the surface is the
```
**EXACT replacement:**
```
* **Controls:** `Card cartoon tier="quiet"`; the surface is the
```
**Rationale:** glass-ui `Card.vue:18` declares `cartoon?: boolean` (an
independent boolean prop); `surface` defaults to `"glass"` (`Card.vue:30`) and
has no `"cartoon"` value. Every live demo consumer uses the boolean form
(`EasingSidebar.vue:14`, `MatrixEditor.vue:2`, `SpringPhysicsFacet.vue:21`:
`<Card cartoon tier="quiet">`). The current DESIGN.md example would render a
`glass` card with an inert unknown attribute.

### DM-08 — `CHANGELOG.md` 6.0.0 "Major Changes (BREAKING)": add two omitted removals

**Source finding:** DR-4 (P2). **Family:** changelog-incompleteness.

**Insertion anchor:** immediately AFTER the "One authored interpolation model"
bullet (which ends `…without aliases or compatibility` / `paths.` at
`CHANGELOG.md:22`) and BEFORE the blank line preceding `### Dependency Changes`
(`CHANGELOG.md:23`).

**EXACT text to insert (two new bullets, verbatim-ready, matching the existing
`- **Bold lede.** …` style):**
```
- **`printWidth` removed from compile options.** `printWidth` is no longer
  accepted on `CompileOptions`, `ViewTransitionCompileOptions`, or
  `EntryCompileOptions`. Keyframes emits deterministic library CSS; presentation
  formatting belongs to the consuming application. See `docs/MIGRATION-6.0.0.md`.
- **`BlendMode` type and the `"weighted"` operation removed.** The public
  `BlendMode` type keyword, `AnimationLayerConfig.blendMode`, and the `"weighted"`
  composite operation are removed. The weight-scalar blend surface
  (`AnimationLayerConfig.weight`, `weightSpring`, and the `weight-blend` refusal)
  is unchanged and remains a live feature. See `docs/MIGRATION-6.0.0.md`.
```
**Rationale:** `MIGRATION-6.0.0.md:24` (BlendMode/blendMode/"weighted" op) and
`:55-57` (printWidth) document these breaking removals; the CHANGELOG 6.0.0
BREAKING list (`CHANGELOG.md:8-22`) omits both. The migration guide is the
authority and the CHANGELOG breaking list should be its superset. The second
bullet's live-feature clause is load-bearing — it prevents a future reader
mistaking the whole weight-blend surface for removed (the exact CH-03 trap).

### DM-09 — `README.md` (whole-file): NO `getTimingFunction` prose drift — GUARD/NEGATIVE

**Source finding:** DR-1 negative. **Family:** stale-export.

`grep -n getTimingFunction README.md` → **0 hits**; README:141's engine roster
correctly omits it. **No edit.** Booked so a mechanical agent does not "also fix
the README" while curing the llms drift (DM-01) — the drift is llms-only.

---

## Section D — FINAL-U SUPERSEDED ANNOTATIONS (annotate, do NOT rewrite)

> Per lane charge: FINAL-U gets **SUPERSEDED annotations** pointing to the
> handoff §5 rail (`docs/tranches/U/AGENTIC-HANDOFF-2026-07-16.md` §5 "Exact
> Keyframes restart after immutable Glass 7", line 372) with the true
> Glass-7 / K6 / atlas-7.0.0 coordinates. The original prose stays verbatim; a
> bracketed SUPERSEDED line is inserted directly above the stale block.

### DM-10 — `FINAL-U.md:114-122` constellation boundary — SUPERSEDED annotation

**Source finding:** CH-02 (P1) / XR-1 / XR-5. **Family:** stale-forward-coordinate.

**Current text (`FINAL-U.md:114-117`, opening of the stale block):**
> `SCI/Atlas subsequently queued the next safe consumer motion: after Glass 6.0.0`
> `is immutable, Keyframes publishes the smallest compatible successor whose`
> `optional Glass edge is exactly 6.0.0, … before Atlas 2.0 consumes the tuple.`

**EXACT text to insert as a NEW line immediately BEFORE line 114:**
```
> **[SUPERSEDED 2026-07-17 — see `docs/tranches/U/AGENTIC-HANDOFF-2026-07-16.md` §5.]**
> The coordinates below are dead: the shipped Keyframes 6 has NO Glass edge (not
> "optional 6.0.0"); the demo consumes Glass **7.0.0** as a dev-only edge; the
> atlas successor is **atlas 7.0.0** (atlas is at 4.0.0), not "Atlas 2.0". The
> operative forward rail is Value 4.0.0 → Keyframes 6.0.0 → immutable Glass 7 →
> atlas 7.0.0.
```
**Rationale:** CH-02 — every coordinate in the block is dead; the shipping
transaction reworded the block cosmetically (`:119` MbabbMenu literal) without
re-deciding it. Annotation (not rewrite) preserves the historical record while
killing the false forward read.

### DM-11 — `FINAL-U.md:124-125` "V inherits no U backlog" — SUPERSEDED annotation

**Source finding:** CH-01 (P1). **Family:** green-over-superseded / silent-backlog.

**Current text (`FINAL-U.md:124-125`):**
> `These are owner-re-deadlined producer boundaries. V inherits no U backlog,`
> `tripwire, or silently carried Keyframes row.`

**EXACT text to insert as a NEW line immediately BEFORE line 124:**
```
> **[SUPERSEDED 2026-07-17.]** Falsified within a day of close: npm shipped
> 5.3.5 and 6.0.0 after this sentence, and `AGENTIC-HANDOFF-2026-07-16.md` §3/§5
> carries a 65-path K6 consumer slice + a documentation-correction list forward
> — the de-facto V inheritance. Read the handoff, not this line, as the operative
> forward ledger.
```
**Rationale:** CH-01 — `npm view` dist-tags `latest: 6.0.0`; `package.json:3`
`6.0.0`; the untracked handoff carries the real V backlog.

### DM-12 — `FINAL-U.md:161-165` "terminal 5.3.4" — SUPERSEDED annotation

**Source finding:** CH-01 (P1). **Family:** stale-release-coordinate.

**Current text (`FINAL-U.md:164-165`):**
> `Version 5.3.4 is required because the terminal command/config/source bytes differ;`
> `no published version is overwritten.`

**EXACT text to insert as a NEW line immediately BEFORE line 161:**
```
> **[SUPERSEDED 2026-07-17.]** 5.3.4 is NOT the terminal release: 5.3.5 and
> 6.0.0 published after this section (`npm view @mkbabb/keyframes.js dist-tags`
> → `latest: 6.0.0`). This baseline text is retained as U-close history only.
```
**Rationale:** CH-01 — the "immutable terminal 5.3.4" framing is falsified by the
6.0.0 producer transaction and npm dist-tags.

### DM-13 — `FINAL-U.md:114-122` MbabbMenu-reword row — formal RETIRE with `:6` evidence

**Source finding:** CH-04 (P2) / XR (MbabbMenu). **Family:** re-booked-phantom.

**Current text (`FINAL-U.md:118-120`):**
> `…consumes the tuple. That successor also rewords the Tailwind-scanned`
> `arbitrary-value-shaped prose literal in `MbabbMenu.vue`; Glass commit `73b852cd` owns`
> `the actual empty-animate/highlight/class cleanup.`

**EXACT text to insert as a NEW line immediately BEFORE line 118** (part of the
DM-10 SUPERSEDED block; may be merged into it):
```
> **[RETIRED — resolved-by-migration, no defect present.]** The "Tailwind-scanned
> prose literal in MbabbMenu.vue" row is retired: the only bracket literal is
> `MbabbMenu.vue:6` `min-w-[var(--dock-panel-width)]` — a legitimate Tailwind
> arbitrary-value class on a real `<DropdownMenuContent>` element, NOT a prose
> string. The ~24-line D9 comment block was removed by the Glass-7 migration.
> Do not re-book this row.
```
**Rationale:** CH-04 — `grep -nE '\[' demo/app/dock/MbabbMenu.vue` returns only
`:6` (verified: the class attr `min-w-[var(--dock-panel-width)]`); there is no
harvestable prose literal. The handoff §3 correction list omits this row
entirely; retiring it prevents a third ride. (Also note: `CHANGELOG.md:35`
already records "Reworded an inline-style comment so Tailwind does not mistake
its prose for an arbitrary-value utility" under 5.3.5 — the reword is DONE.)

### DM-14 — `FINAL-U.md:43` scripts count "10,776 across 77 files" → corrected measurement

**Source finding:** PL-1 (P3) / FAM-13. **Family:** misleading-measurement.

**Current text (`FINAL-U.md:43`):**
```
| `scripts/` text lines | 66,706 before the terminal cut | **10,776 across 77 files** |
```
**EXACT replacement:**
```
| `scripts/` text lines | 66,706 before the terminal cut | **10,846 across 32 tracked files** |
```
**Rationale:** PL-1 — `git ls-tree -r --name-only c80ad0bf -- scripts | wc -l`
→ 32 tracked files (25 `.mjs` + 6 `.ts` + 1 `.sh`, zero binary); text-line total
10,846. The "77 files" figure counted 44 gitignored `_diff/` PNGs + 1 `.DS_Store`
(`git check-ignore` → IGNORED). The corrected number is a BETTER dissolution
number. (Note: this is a historical close-metric edit; if the formation prefers
FINAL-U stays frozen-history, book instead as a SUPERSEDED annotation. Default
per PL-1 disposition: correct in place.)

### DM-15 — `FINAL-U.md:53-55` "six nightly … observations" → "weekly"

**Source finding:** CH-05 (P3) / PR-6-adjacent. **Family:** doc-drift (cadence mislabel).

**Current text (`FINAL-U.md:53`):**
> `The six nightly/on-demand observations are smoke, occlusion, usability, subject`

**EXACT replacement:**
> `The six weekly/on-demand observations are smoke, occlusion, usability, subject`

**Rationale:** CH-05 — the cron is `.github/workflows/ci.yml:16`
`cron: "17 3 * * 1"` = **weekly, Monday 03:17 UTC** (dow=1), not nightly. The
deploy-ancestry freshness window is therefore a week (`deploy-pages.yml:4`).
Paired ci.yml comment fixes below (DM-16).

---

## Section E — CI COMMENT + K-ERA RESIDUE

### DM-16 — `.github/workflows/ci.yml` "nightly" comments → "weekly" (4 sites)

**Source finding:** CH-05 (P3). **Family:** doc-drift.

**Current text (verified sites):**
- `ci.yml:50` — `# U.A7 — the device-dependent demo roster is nightly/on-demand only. A`
- `ci.yml:54` — `name: demo correctness (nightly roster)`
- `ci.yml:81` — `# A successful nightly publishes the SHA consumed by deploy-pages.`
- `ci.yml:92` — `# Device-dependent observers are co-scheduled with the nightly roster`

**EXACT replacement:** replace the token `nightly` with `weekly` on each of the
four lines (`nightly/on-demand`→`weekly/on-demand`; `(nightly roster)`→`(weekly
roster)`; `A successful nightly`→`A successful weekly`; `the nightly roster`→`the
weekly roster`).

**Rationale:** Same as DM-15 — cron dow=1 is weekly. (Alternative per CH-05: change
the cron to daily `17 3 * * *` if a nightly cadence is actually intended. Default
= relabel, since a weekly deploy-freshness window is the shipped behavior.)

### DM-17 — `docs/dogfood-inversion.md:48` false present-tense republish clause

**Source finding:** CH-06 (P3). **Family:** historical-residue.

**Current text (`docs/dogfood-inversion.md:48`):**
> `   npm does NOT yet carry those exports. K.WZ does the K-tranche republish; the`

**EXACT replacement:**
> `   npm now carries those exports (published from K.WZ onward through 6.0.0); the`

**Rationale:** CH-06 — the doc header reads "Status: LANDED (K.W12 ED-3)" yet :48
carries a false present-tense "does NOT yet carry / K.WZ does the republish"
clause from the tranche-K epoch. 6.0.0 is published (`npm view … latest: 6.0.0`).
A "LANDED/COMPLETE" doc must not carry a live-tense un-done clause.

---

## Section F — GLASS-ERA PROVENANCE COMMENTS (DD-5 comment rewording only)

### DM-18 — Reword stale `glass-ui 3.4.0/4.0.0/4.0.1` provenance comments → Glass-7 baseline

**Source finding:** DD-5 (P3, comment-rewording part only). **Family:** stale-era-comment.

**Scope guard:** this row covers ONLY the pure provenance-era version comments.
It **excludes** the two `modelValue`-emit-only *rationale* comments
(`demo/scenes/easing/EasingSidebar.vue:16-26` and
`demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue:26`),
whose correctness is gated on a Glass-side `EasingPicker` `modelValue` contract
re-verification (glass-ui is read-only this cycle; DD-5 part (b) / paired
glass-side check). Do NOT reword or delete those two until the Glass-7 contract
is confirmed.

**Mechanical rule:** at each site below, replace the version token
`glass-ui 3.4.0` / `glass-ui 4.0.0` / `glass-ui 4.0.1` with `glass-ui 7.0.0`
(the installed baseline: `node_modules/@mkbabb/glass-ui/package.json` →
`"version": "7.0.0"`), preserving the surrounding comment text.

**Verified sites (from DD-5):**
- `demo/scenes/cube/CubeScene.vue:39,146` — "glass-ui 4.0.0 (K.W1′ BA.W-TABS)"
- `demo/components/instrument/transport/channel-controls/ChannelControls.vue:42,86,209,220,263,305` — "glass-ui 4.0.0 (BA.W-TABS)" (6 sites)
- `demo/app/dock/ChromeDock.vue:348` — "on glass-ui 4.0.0 the collapsed…"
- `demo/components/instrument/transport/channel-controls/ChannelOptions.vue:142` — "glass-ui 3.4.0"
- `demo/components/instrument/transport/KfPillTabs.vue:5`
- `demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue` (version-provenance comments only, NOT the `:26` modelValue rationale)
- `demo/scenes/easing/EasingSidebar.vue:18` (the `:18` provenance line, NOT the `:16-26` remount rationale)
- `demo/components/instrument/transport/AnimationControlsGroup.vue:169`
- `demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue:7,197`
- `demo/components/instrument/shell/EditorShell.vue:162`
- `demo/components/instrument/transport/channel-controls/useTabStripScroll.ts:23,47`
- `demo/components/instrument/keyframes/KeyframesEditor.vue:8`

**Rationale:** DD-5 — installed Glass is 7.0.0; ~15 consumers carry 3.4.0/4.0.0/4.0.1
provenance as if current, which will mislead the next migration audit. (Re-verify
line numbers at wave time; the demo transaction may shift them. The mechanical
find is the version-token string, which is stable.)

---

## Section G — OUT-OF-REPO / MEMORY (noted, not a repo file:line)

### DM-19 — MEMORY constellation note "Atlas 2" re-pin

**Source finding:** XR-5 (P3). **Family:** doc-drift.

`~/.claude/projects/-Users-mkbabb-Programming-keyframes-js/memory/MEMORY.md`
constellation note queues "Atlas 2". Atlas is at 4.0.0; the next coherent tuple
is **atlas 7.0.0** (glass 7 + keyframes 6 + value 4). Re-pin the MEMORY note to
"atlas 7.0.0 (next coherent tuple)". **Not a repo edit** — this is an auto-memory
update, recorded here for completeness of the XR-5 disposition.

Also `docs/tranches/U/KF-TO-GLASSUI-U.md:58` ("Atlas 2.0 consumes the pair…") is
a **frozen outbound-letter artifact**; per XR-5 disposition the correction goes
in the *V outbound packet* (refer to the successor as atlas 7.0.0), NOT by
editing the sealed U letter. No line-edit row for `:58`.

---

## Wave-shaped disposition

| Wave | Rows | Nature |
|---|---|---|
| V.docs-precision | DM-02, DM-07, DM-08 | Live-verified single-line/insert edits |
| V.docs-guard | DM-03, DM-04, DM-05, DM-06, DM-09 | DO-NOT-EDIT guards (prevent handoff-blanket damage) |
| V.docs-supersede | DM-10..DM-15 | FINAL-U annotations + close-metric corrections |
| V.docs-hygiene | DM-16, DM-17, DM-18 | CI comments, K-era residue, Glass-era comments |
| V.agent-surface | DM-01 | Regen-at-wave-time + real gate (build) |
| out-of-repo | DM-19 | MEMORY re-pin; V outbound packet wording |

---

## Negatives (checked, found sound — no correction owed)

- **No `BlendMode` / `"weighted"`-op residue in source.** `grep -rniE
  "blendmode|\"weighted\"|'weighted'" src/` → 0 hits. The handoff's blanket
  "delete weighted-blending prose" instruction would delete accurate live copy;
  refuted (DM-03..06).
- **`README.md` has no `getTimingFunction` prose** (`grep` → 0); the drift is
  llms-only (DM-01). README:141 roster correctly omits it.
- **README code-sample imports resolve** against the 6.0.0 surface (DR-1
  negative, re-inherited — not re-verified this lane; cited).
- **`CHANGELOG.md:15`** correctly documents the `getTimingFunction` removal; the
  DR-4 gap is only the `printWidth` + `BlendMode` bullets (DM-08), not
  `getTimingFunction`.
- **`CHANGELOG.md:34-35`** (5.3.5) already documents the Glass-6 edge + the
  Tailwind-comment rework — the MbabbMenu reword is DONE, reinforcing the DM-13
  RETIRE.
- **`KF-TO-GLASSUI-U.md` + FINAL-U** are close-artifacts; DM-10..13 annotate (not
  rewrite) FINAL-U, and the KF-TO-GLASSUI "Atlas 2.0" correction is routed to the
  V outbound packet, keeping sealed U letters immutable.

## Coverage gaps

- **DM-18 line numbers** were inherited from DD-5 (working tree pre-transaction);
  the live demo transaction may shift them. The mechanical find is the
  version-token STRING (stable); an executing agent must re-grep
  `glass-ui 4.0.0|glass-ui 4.0.1|glass-ui 3.4.0` at wave time.
- **The two `modelValue` rationale comments** (EasingSidebar:16-26,
  TimingFunctionPanel:26) are deliberately EXCLUDED from DM-18 — their fate
  depends on the Glass-7 `EasingPicker` `modelValue` contract, unverifiable this
  cycle (glass-ui read-only). Paired glass-side check owed (DD-5 part b).
- **llms full line-by-line reconciliation** not done — DM-01 relies on the
  generator being the source of truth (regen replaces all 34+45 drifted lines);
  the `getTimingFunction` removal + format change were spot-verified.
- **DM-01 `proof:agent-surface` gate glue** is described as a contract, not
  authored verbatim — the exact diff-and-exit-1 shell is left to the wave (KISS:
  `gen --check | diff committed` with nonzero exit on mismatch).
- **DM-14 / FINAL-U close-metric edits**: whether FINAL-U may be edited in place
  vs must stay frozen-history is a formation policy call; default follows the
  R1 dispositions (PL-1 says correct in place; CH-01/02 say annotate). If the
  formation freezes FINAL-U entirely, convert DM-14 to a SUPERSEDED annotation.
