SERVED MODEL: claude-opus-5[1m]

# SIDECAR ADDENDUM — KF-HA-4 (doc arm), beside `home.json` `:9` and the rider's `:2` / `:13` / `:16`

**Dated 2026-09-19 · X.KF.W10 `.d` (G-5, addendum 3 of 4) · E-3 ADDENDUM-NOT-PATCH.**
`docs/tranches/T/stage-manifests/home.json` is a **JSON manifest**: it admits no inline comment
and must stay parseable and dated exactly as owner-sanctioned, so its addendum takes this
**sidecar** beside it. Not one byte of the manifest is changed:
`git diff -- docs/tranches/T/stage-manifests/home.json` is **empty** at this close. The
`sanctioned` and `forbidden` sets are **not re-graded** here.

**Substrate of measurement.** keyframes.js `master` @ `27ec9c37` (the §B-12-settled sacred
checkout; `origin/master` `69095552` plus this wave's two landed unit commits), read at the
**worktree bytes**, every figure double-run.

---

## 1. The four anchors, re-resolved at the landing substrate before writing

| anchor | what the manifest says there | named oracle |
|---|---|---|
| **`:9`** | `"aurora-cursor-light (HeroAurora … OD-2 more-subtle — ceiling …, strictly under the P-HERO …; proof:cursor-light-subtle)"` — the `sanctioned` entry | `proof:cursor-light-subtle` |
| **`:2`** | `_doc` — *"their ABSENCE is browser-asserted NOW by proof:hero-two-focal clause (c)"* | `proof:hero-two-focal` cl. (c) |
| **`:13`** | `forbidden[1]` — *"kf-source-egg-card (#2 … absence asserted by proof:hero-two-focal clause (c))"* | `proof:hero-two-focal` cl. (c) |
| **`:16`** | `status` — *"the forbidden set is browser-asserted by proof:hero-two-focal clause (c)"* | `proof:hero-two-focal` cl. (c) |

All four resolve. The rider's anchor set is **`:2` / `:13` / `:16`** — the declared correction of
the draft's `:11`, carried here as the single spelling.

## 2. The doc-truth fact: both named oracles were dissolved, and the manifest still names them

Both instruments died at **`70b32501`** — *"refactor(tranche-u): dissolve the proof apparatus
around direct product checks"*. At these bytes, over the executable surface
(`demo/ src/ test/ scripts/`):

⟨cmd⟩ `grep -rn 'proof:hero-two-focal' demo/ src/ test/ scripts/ | wc -l` → **0** (run 1) · **0** (run 2)
⟨cmd⟩ `grep -rn 'proof:cursor-light-subtle' demo/ src/ test/ scripts/ | wc -l` → **1** (run 1) · **1** (run 2)
⟨cmd⟩ `ls -1 scripts/ | grep -c 'proof'` → **0** (run 1) · **0** (run 2)

**The one hit is found and disqualified, never counted as an oracle**: it is *prose* at
`test/demo/instrument/aurora-opacity-ceiling.test.ts:8`, a line that names the dissolved citation
in order to record that it named nothing. There is no script, no test and no gate behind either
name. The manifest's three assertion promises (`:2`, `:13`, `:16` — *"browser-asserted NOW"*,
*"absence asserted by"*, *"browser-asserted by"*) and the `:9` cite therefore name **instruments
that do not exist**, and have since `70b32501`.

## 3. The oracle's fate — BY REFERENCE to KF.W4, re-derived nowhere

**This addendum re-derives no bound.** The ceiling limb's gate rebuild was ruled KF.W4's, KF.W4
executed it, and KF.W4's record is the authority:

- **Artefact:** `test/demo/instrument/aurora-opacity-ceiling.test.ts`, created at **`c5c0b889`**
  (*"the three-clause census + the rendered register census … and the gate-authoring cures
  (X.KF.W4 .d)"*); **3,992 B** at these bytes.
- **Mechanism:** it reads an **`export const HERO_AURORA_OPACITY_CEILING`** authored in
  HeroAurora's own **module-scope `<script lang="ts">`** block (`HeroAurora.vue:35` opens it;
  the const at `:58`) — §Bounds L84's **named alternative**, with the reason written at the site.
- **Receipt:** `value.js docs/tranches/X/execution/B/KF-W4.md` Act 4 states the clause set and
  the run. **The blessed number, the strict inequality and the clause verdicts are KF.W4's and
  are not restated here** — restating them would assert an unguarded bound the owning wave has
  already re-armed, which is exactly what this split-lock forbids.
- **The prose limb** (the in-file cites of the dissolved oracles) rode **KF.W6**'s file-touch at
  `22e001da`; `stage-manifests/home.json:9` was always X.KF.W10's row, and this sidecar is it.
- **The `proof:hero-two-focal` clause (c) limb has NO rebuilt instrument** — KF.W4 re-armed the
  ceiling bound, not the forbidden-set assertion. None is minted here (X.KF.W10 spends no cure):
  the rider's three sites are recorded as **naming a dissolved instrument**, and a later seat
  that wants the forbidden set browser-asserted authors the instrument in the wave that owns it.

## 4. Carried correction on the replacement's shape (both readers' convergent find)

The corpus's prescribed replacement — *import* `HERO_AURORA_OPACITY_CEILING` — was **unwritable
as specified** while the const lived in `<script setup>`: a `<script setup>` compile-local has
nothing to import, so a gate over one could only ever be a source-text pin. The assertable
surfaces are the rendered **`--aurora-opacity-ceiling` on `.aurora-root`** or an **`export
const`**. KF.W4 took the `export const` arm (§3). The correction is carried so the un-writable
import form cannot re-enter a spec by citation.

## 5. What this sidecar explicitly does NOT do

- It changes **no byte** of `home.json` (E-3; `git diff` empty at close) and adds no inline
  comment to it — a JSON manifest takes its addendum beside it or not at all.
- It **re-derives no bound** and mints **no oracle**; KF.W4's fate is stated by reference only.
- It does not re-grade the `sanctioned` / `forbidden` sets, nor the owner's T.M4/T.D9/T.D13
  derivations, nor the `T_BORNRED_BACKLOG` carry named at `:16`.
