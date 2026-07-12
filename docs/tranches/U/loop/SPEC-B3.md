# SPEC-B3 — Track B convergence loop, pass 3: THE CLOSE-PASS + NEW-ITEM SPECIFICATION

> **SUPERSESSION: SPEC-B3 REPLACES SPEC-B2.** Two parts, two different clocks:
>
> **Part I (the existing seven items) is ERRATA-THIN — PASS-2 ruling 14, binding.**
> At 97% overall convergence, this revision is EXACTLY the five PASS-2 §4 errata +
> the §8.4.2 falsified-premise correction + rulings 9–15 folded as standing law.
> NO re-synthesis, no new rules for the settled surface, no charter rewrites.
> **Where this document is silent, SPEC-B2's text governs unchanged** (and through
> it SPEC-B1 — the canonical chain is stated at E5). Spec churn at high convergence
> is itself a divergence risk; Part I deliberately changes as little as possible.
>
> **Part II (§N1–§N3) is NEW CHARTER SUBSTANCE, not re-synthesis** — the three
> new loop items from the owner's 2026-07-10 structure escalation (OWNER-ASKS
> row 7 verbatim, two IDE screenshots; OD-U19/U20/U21), synthesized from the three
> pass-3 research reports (`pass3-research-one-component-home.md`,
> `pass3-research-meta-legacy-census.md`, `pass3-research-demo-lib-duplication.md`),
> each with a concrete prototype charter (P7/P8/P9). New items entering at pass 3
> is the loop working as designed (OD-U18): the owner review sits INSIDE the loop.
>
> Step 2 (synthesis) of the owner 5-step loop — OWNER-ASKS rows 6–7;
> OD-U15..U21. Plain language throughout; every term of art is glossed at first
> use (ruling 6, binding). Every count below marked *(measured)* was re-measured
> against the `tranche-u-dev` tree at authoring time — never inherited (the
> PASS-2 standing lesson: verify, never inherit, every number).

Sections: **Part I** — §E errata (E1–E6) · §R rulings 9–15 folded · §C the
pass-3 close charters (P1/P4/P6; P2/P3/P5 frozen). **Part II** — §N1 the ONE
component home (+ P7) · §N2 the meta/legacy file deletion table (+ P8) · §N3 the
demo↔library duplication excision table (+ P9) · §Q questions for the pass-3
critique fleet.

---

# PART I — THE ERRATA (ruling 14: nothing else changes)

## §E — The six errata over SPEC-B2

Each erratum states the defective SPEC-B2 text, the verified tree fact, and the
corrected reading. These are the ONLY amendments to SPEC-B2 §§0–9.

**E1 — G12 application 1's line reference (SPEC-B2 §1, G12 item 1).**
SPEC-B2 cites the surviving types-purity sibling clause — the FILE-level check
that `constants/types.ts` carries only `import type`/`export type` edges — at
`proof-boundary.mjs:232`. *(measured)* The clause lives at
**`proof-boundary.mjs:498`** (assertion 5, "S.B1: constants/types.ts
LIGHT-purity"), with its doc block at **`:220-224`**. Corrected wherever cited.
The substance of G12 application 1 is unchanged: when `constants/index.ts`
deletes, `proof:boundary` assertion 6 retires in the same commit because the
live concern is already held by assertion 5 at `:498`.

**E2 — the dead-directive count (SPEC-B2 §6.2).** "2 [dead `eslint-disable`
directives] at last count" was an undercount. *(measured)* The tree carries
exactly **3**, all in `scripts/`: `proof-accent-census.mjs:300` (`no-eval`),
`proof-font-census.mjs:215` (`no-eval`), `proof-kf-differential.mjs:560`
(`no-new-func`). P4's pass-2 commit found them and made a reasoned documentary
KEEP; **PASS-2 §4 rules the converged form** (binding on P4's close, §C below):
a directive addressed to a linter removed at Q.WA1 is dead tooling cruft — each
converts to a plain intent comment (e.g. "intentional: serialized fn into
page.evaluate"), directive deleted.

**E3 — the §5.B arithmetic.** SPEC-B2 §5.B says PASS-1's twelve-file "no inline
home" list "was wrong for nine of them" — loose arithmetic. Corrected prose:
*PASS-1's twelve-file list did not survive measurement; the genuinely home-less
files are exactly THREE (`format.ts` at its live path, `physics/morph.ts`,
`physics/playback.ts`); the remainder already carried file-level docstrings from
prior tranches.* The operative three-file conclusion was correct, was acted on
(P3, ratified at 100%), and does not reopen.

**E4 — the §0 glossary gains the project's most central terms.** Added to
SPEC-B2 §0 (which otherwise carries forward whole):

| term | meaning |
|---|---|
| **LIGHT** | value.js-free — code a consumer can import without pulling `@mkbabb/value.js` into its module graph (the `.` package entry's static surface; the `physics/`/`orchestration/` zones) |
| **HEAVY** | value.js-bearing — code that statically imports `@mkbabb/value.js`, reached only via `await loadAnimationEngine()` or the `./engine` subpath |
| **stutter-trio** | the transport trio whose pre-recut names stuttered (`AnimationControlsControls.vue`) — recut and renamed at P5 to **ChannelGroup / ChannelControls / ChannelOptions** (SPEC-B2 §4.5, ratified; no re-litigation) |

**E5 — the canonical-table note (stated where a scorer reads).** The canonical
full library ruling table is **SPEC-B1 §2 as amended by SPEC-B2 §2** — the
backward→emit row split, the `constants/` G12 rider, everything else confirmed.
**SPEC-B3 amends that table NOWHERE.** Likewise the demo table is SPEC-B1 §3 as
amended by SPEC-B2 §3 (the measured fold-time table), untouched here; §N1 below
governs demo component *placement* (homes), not the §3 granularity verdicts —
the two compose.

**E6 — the §8.4.2 falsified-premise correction (the content fold from P4's
verification).** SPEC-B2 §8.4 deliverable 2 carried two research premises the
tree refutes; corrected so no future pass re-hunts either phantom:

- **(a) the `_diff/` premise.** SPEC-B2 ordered deletion of "the
  `scripts/baselines/visual-lock/_diff/` vestige (44 PNGs)". *(measured)* The
  REPOSITORY carries no such tree: T.M3 (commit `71e0fb41`) deleted
  `visual-lock/` whole when `proof:visual-lock` retired into the owner-golden
  mechanism. The 44 `*.diff.png` files visible on the working machine are
  **untracked, git-ignored local disk debris** (caught by `.gitignore:9`'s `_*`
  pattern) — they exist in no commit, on no branch, and no prototype can delete
  them "from the tree". P4's report ("already gone, nothing to delete") is
  CORRECT. Disposition: a one-line local-hygiene note (`rm -rf` on the dev
  machine), NOT chartered work. The pass-3 meta-legacy census inherited the
  phantom (its §3 first row); §N2 below records the correction so the two
  documents agree.
- **(b) the directive-count premise.** "2 at last count" → FIVE existed at
  pass-2 research time: 2 `no-console` directives in the measure tests (deleted
  by P4 pass 2) + the 3 `no-eval`/`no-new-func` in `scripts/` (E2's rows, now
  slated for comment-conversion). The research never looked in `scripts/`; the
  loop's step-3 agents checking step-1 research against the tree caught it —
  demonstrated practice, kept.

---

## §R — PASS-2 rulings 9–15, folded as standing spec law

Numbering continues from PASS-1's rulings 1–8 (folded into SPEC-B2). Each is
restated here in its binding form; the full argument lives in `PASS-2.md` §5.

- **R9 — the `progress` supersession is RATIFIED; G11 extends to prop/edge
  tightens.** Where a charter orders a signature tighten and fix-time
  measurement proves the edge DEAD end-to-end, deleting the edge whole beats the
  tighten. The supersession must be declared and evidenced in-tree (P5 did
  both). No lane re-litigates the deleted `progress` chain.
- **R10 — critique validity.** A step-4 critique that is not self-contained —
  placeholder analysis, unverifiable gaps, or absent entirely — is VOID; its
  score is discarded, never inherited or averaged. Step 5 verifies from the tree
  before scoring and records the substitute basis in the pass record. Every
  step-4 fleet's output is checked for self-containment before step 5 consumes
  it. (Binding on the §Q fleet below.)
- **R11 — the reanchor template's 8th site class.** `P1-REANCHOR-TEMPLATE.md`
  adds a **doc/prose cross-reference class**: doc files, sibling-barrel
  comments, consumer docstrings, AND the moved file's own header/self-references
  (a renamed file must not cite its own old path — nor its old siblings'). The
  class is exercised by fixing P1's three live stale refs under it (§C). §N1's
  move script sweeps this class too — the template is now the general law for
  EVERY move in the tranche.
- **R12 — moot-by-merge-order stale refs are RECORDED, not fixed.** A stale
  mention inside a file another prototype's ratified charter DELETES is a
  merge-order note and blocks nothing; a stale mention in SURVIVING source is a
  defect and blocks 100. The distinction is the file's ratified fate, not the
  mention's size.
- **R13 — one version provenance per external claim.** When citing an external
  package's landed fix, state the installed version ONCE — `package.json` is the
  authority — and point every other surface at that statement. Applied to P4's
  VJ-L2 citations (**installed: value.js 3.1.0**). Carried as verified fact:
  value.js 3.1.0's `parseLinearStops` still THROWS on the flat-comma form —
  parser tolerance was never VJ-L2's contract; no lane re-litigates the
  un-skipped probe.
- **R14 — SPEC-B3 is errata-thin** for the existing surface. Honored by Part I's
  construction: §E + §R + §C, nothing else. (§N1–§N3 are new items under new
  owner rulings, outside R14's "settled sections" scope by definition.)
- **R15 — exited items FREEZE.** P2, P3, P5 worktrees are read-only evidence; no
  pass-3 lane commits to them. Their residual cross-prototype notes (the
  orbital-drag single-`constants.ts` shape, the fold-map's pre-P5 demo paths,
  the `demo/CLAUDE.md:34` stale line) are reconciliation inputs to the WAVE SET,
  which executes on one tree where merge-order questions dissolve. **The P7/P8/P9
  prototypes below run on FRESH worktrees off `tranche-u-dev` HEAD** — they never
  touch the frozen trees, and read them only as evidence.

---

## §C — The pass-3 close charters (from PASS-2 §7, restated for self-containment)

All close work is mechanical and line-located; step 1 (research) was a no-op for
these three. Each iterates on its EXISTING worktree; branches remain evidence,
never merged.

| item | mode | exhaustive pass-3 work |
|---|---|---|
| **P1** (`…287-10`) | **close** | Fix the three stale `compile/view-transition.ts` prose refs in surviving source: `src/animation/compile/emit/index.ts:40` → `./view-transition`; `src/animation/orchestration/view-transition/view-transition.ts:16` and `…/index.ts:11` → the `emit/` path. Add the 8th site class to `P1-REANCHOR-TEMPLATE.md` per R11 — with the self-reference caveat — exercised by these very fixes. |
| **P4** (`…287-16`) | **close** | Convert the 3 dead `eslint-disable` directives (E2's rows) to plain intent comments, directive deleted. Unify the VJ-L2 provenance to ONE statement per R13 (installed value.js 3.1.0; other surfaces point at it). |
| **P6** (`…287-18`) | **close** | One-word fix: `internal/` "shared across **zones**" (the import graph: 6 HEAVY + 2 LIGHT zones consume it — not "the light zones"). Tighten the §Structure intro's blanket "each behind an `index.ts` barrel" clause over the barrel-less `internal/`. Re-run both README gates. **Still LANDS AFTER P3 at ratification** (SPEC-B2 §5.F, unchanged). The §dynamic-engine vs §tree-shaking dual prose is PRE-EXISTING dual-audience material, ruled not a defect — do not reopen. |
| **P2 · P3 · P5** | **FROZEN** | Read-only evidence (R15). |

**Exit condition (OD-U18, unchanged):** pass 3 re-runs step 4 on the touched
items (self-contained critiques per R10), then step 5 agglomerates. The three
NEW items below enter the same convergence table at their pass-1. At 100%
across ALL items the loop TERMINATES and the exact U wave-set development begins.

---

# PART II — THE THREE NEW ITEMS (OD-U19 / OD-U20 / OD-U21)

New-item common law (carried from §8's common law, restated): fresh worktree per
prototype, branch = EVIDENCE, never merged; ring-fences hold (LIGHT/HEAVY hard;
11-zone map fixed; two package entries fixed; test mirror per OD-U7); additive
only under OD-U8's 5.3.0 bind — **zero published-surface change** (all three
items are demo/scripts-internal); ZERO new standalone gates (clauses on existing
gates, born-RED first); every path-literal gate re-anchors in the same commit as
its move (G10) and every mooted clause retires in the same commit (G12); every
chartered verdict lands IN-TREE at the path its charter names (ruling 5);
convergence % is scored against THIS spec's charter surface; the hard half
executes first; every count re-measures at execution time (G11's ethos —
counts below are authoring-time measurements, not gospel).

---

## §N1 — THE ONE COMPONENT HOME (OD-U19)

**The defect (the owner's screenshots, verbatim ruling):** demo components live
in FOUR unrelated homes — `demo/@/components/custom/` (the instrument facility +
`CopyButton.vue`), `demo/@/components/skeletons/` (one file), `demo/app/`
(the shell, illegitimately also holding components), and `demo/app/dock/`
("needs to be straight up extirpated"). The worst path is 6 wrapper directories
before content, of which `@` (a shadcn scaffold vestige — an alias materialized
as a real directory; OD-U2) and `custom/` (the "not-`ui/`" bucket whose reason
died when `ui/` was deleted at S.C3b) carry ZERO meaning.

### N1.1 — The one placement rule (ratified as law)

*A component lives at the lowest directory that contains all of its consumers.*
Cross-scene shared ⇒ **`demo/components/`** (THE one shared component home);
single-scene ⇒ **that scene's dir** (`demo/scenes/<name>/`, the R.W5-blessed
fused homes); shell-private ⇒ **`demo/app/`** (the shell). One rule, two
principled component homes, no third bucket — that is the honest reading of the
owner's "one home": one *rule*, because a per-scene Target genuinely belongs
with its scene and the owner blessed exactly that shape (`keyframes/`, the fused
scenes).

### N1.2 — The complete target tree (normative)

```
demo/
├── app/                          # THE SHELL — orchestration only, NO component library
│   ├── App.vue                   #   the root SPA component (the ONE component the shell owns)
│   ├── App.skeleton.vue          #   ← SceneSkeleton re-homed: the scene-host <Suspense> plate,
│   │                             #     shell-private (App.vue is its sole consumer)
│   ├── main.ts · index.html · public/
│   ├── lifecycle/                #   loaf-observer.ts · useMonacoCancellationGuard.ts
│   ├── scene/                    #   router.ts · scenes.ts · sceneExposedApi.ts · the two machine bindings
│   │                             #     (sceneFacility.ts HOISTED OUT → demo/scene-facility/)
│   └── transition/               #   useSceneSwap.ts · useSceneTransition.ts
│
├── scenes/                       # per-scene homes (BLESSED, R.W5 — the SECOND principled home)
│   └── <amiga|cube|easing|sequence|spring|square>/   # already the recursive unit, unchanged here
│
├── components/                   # ★ THE ONE SHARED COMPONENT HOME
│   ├── instrument/               #   the control facility (was @/components/custom/instrument/)
│   │   ├── transport/            #     (P5-ratified interior names: channel-group/ etc. — the wave set lands both)
│   │   ├── keyframes/            #     the owner-named EXEMPLAR ("seems reasonable")
│   │   ├── timeline/
│   │   ├── shell/
│   │   ├── utils/                #     iosTextEntry.ts · toastGuard.ts colocated (instrument-only)
│   │   └── index.ts              #     the lazy facility barrel
│   ├── dock/                     #   ← RE-HOMED from app/dock/ (OD-U19 "extirpated")
│   │   └── ChromeDock.vue · MbabbMenu.vue · index.ts
│   └── CopyButton.vue            #   the one cross-tier leaf — FLAT (no ceremony dir; OD-U16)
│
├── scene-facility/               # the scene-authoring contract hoisted out of app/scene/
├── composables/                  # cross-scene composables (was @/composables/)
│   └── scene-runtime/            #   useRafScene · useSceneVisibilityPause · useSceneTransport · rafConstants
├── state/                        # (was @/state/)
├── styles/                       # (was @/styles/; font-roles.json stays a live gate input — §N2.4)
└── utils/                        # kfEngine.ts · clipboard.ts only
```

`demo/@/` DISSOLVES to the `demo/` root (OD-U2's REVISED RECO — the glass-ui
`src/` root shape, NO `shared/` wrapper; this supersedes the earlier
`demo/shared/` proposals). The existing alias SPELLINGS (`@components`,
`@state`, `@composables`, `@styles`, `@utils`) KEEP, re-pointed at the new
homes in all three planes (tsconfig + vite + vitest — the glass-ui discipline).
Worst path before → after:
`demo/@/components/custom/instrument/transport/controls/AnimationControls.vue`
(6 wrappers) → `demo/components/instrument/transport/[controls/]…` (3–4).

**Ratified verdicts riding the tree** (full arguments in
`pass3-research-one-component-home.md`, adopted as spec):

1. **The recursive unit = the `keyframes/`-style dir** (owner-blessed): kebab
   dir · PascalCase entry SFC · `.css` sibling once >~40L · `.skeleton.vue` iff
   lazily delivered · sub-component dirs recursively · single-owner composables
   FLAT beside their owner · `composables/` bin only for ≥2-consumer hooks ·
   `constants.ts`/`types.ts` (declared contracts) · re-export-only `index.ts`.
   Kind-bins (dirs grouped by what a file IS rather than what owns it) survive
   only at facility/shared level with ≥2 real consumers.
2. **`app/` reduces to the shell.** "Zero components" reads honestly as: no
   shared/cross-cutting component LIBRARY under `app/` — the root `App.vue` +
   its private `App.skeleton.vue` are shell infrastructure. `sceneFacility.ts`
   hoists to `demo/scene-facility/`; `app/runtime/` SPLITS (recipes →
   `composables/scene-runtime/`; lifecycle guards → `app/lifecycle/`).
3. **Skeletons colocate per module:** `SceneSkeleton.vue` → `app/App.skeleton.vue`
   (the `skeletons/` kind-bin deletes); `instrument/keyframes/` and
   `instrument/timeline/` each gain a barrel-wired `<Name>.skeleton.vue`
   (today the pane renders blank during the lazy fetch); per-scene skeletons are
   the U.B target.
4. **`CopyButton.vue` stays a FLAT shared leaf** — a satellite-less one-SFC
   component gets no ceremony dir (OD-U16, the same logic that INLINEd
   `matrix-editor/index.ts`). Its runtime-object `defineProps` converts to the
   house reactive-destructure grammar in the move.
5. **`transport/controls/` is a CANDIDATE flatten**, decided at interior-recut
   time by the placement rule — depth alone is not a defect when each layer is a
   real module.
6. **The dock's T.F3 rationale is OVERRULED.** `proof-app-is-shell.mjs:61-66`
   narrates the dock's T.F3 eviction INTO `app/dock/` ("part of the app's own
   chrome") and allowlists `dock` in `ALLOWED_ROOT_DIRS`. OD-U19 verbatim
   reverses that call: the dock is a COMPONENT module, not shell wiring. It
   re-homes to `components/dock/`; the gate flips (N1.4).

### N1.3 — The re-anchor manifest *(all counts measured at authoring; re-measure in-commit)*

- **Config, 2 files, alias TOKENS unchanged (only the right-hand side moves):**
  `vite.config.ts` — 5 alias RHS `demo/@/{styles,state,components,utils,composables}`
  → `demo/{…}` (`@app` unchanged); `tsconfig.json` — 7 path RHS `./demo/@/{…}` →
  `./demo/{…}`; vitest inherits per its config plane.
- **Source imports:** 26 sites across 17 files spell `components/custom/…` →
  drop `custom/`; 1 site (`app/App.vue:140`) imports the skeleton → becomes
  `./App.skeleton.vue`; App.vue's two dock imports (`:141-142`) → the dock's new
  home; ~10 sites re-point for the sceneFacility hoist / runtime split /
  ios-toast colocation.
- **Gate scripts (G10 — same commit as each move):** **37** scripts carry a
  `demo/@` literal; **34** carry `components/custom`; **14** carry `app/dock`
  (the research's 6-gate dock list was an undercount — the measured 14:
  control-surface-single-writer, decomposition, darkmode-row-toggle,
  dock-popover-opens, dock-elision, dfa-derived, dock-grammar, modern-web,
  dock-single-tooltip, no-single-option-select, pp-logo-svg, scene-control-dfa,
  single-toggle, workaround-deletion — the last dies anyway at §N2).
- **Gate clauses (born-RED, on EXISTING gates — zero new gates):**
  `proof:app-is-shell` drops `dock` from `ALLOWED_ROOT_DIRS` and gains the
  clause *no component `.vue` other than `App.vue` + `App.skeleton.vue` lives
  under `demo/app/`* — authored to RED on the pre-move tree (the dock), green
  when it re-homes. `proof:colocation` gains the recursive-unit clauses
  (single-owner-member-in-a-bin → RED; barrel purity; lazy-barrel-without-
  skeleton → RED) so the home is a STANDING gate, not a one-time move.
- **Doc/prose cross-references (R11's 8th class):** e.g. `App.vue:340`'s
  "lives in @app/dock/MbabbMenu.vue" comment; the template's class sweeps every
  such site with each move.

**Sequencing (move-once):** ① dissolve `@/` + `custom/` (the keystone,
highest-fanout — config RHS + the 37/34 gate literals ride the same commit) →
② re-home the dock (the born-RED clause flips green) → ③ re-home the singletons
(skeleton / sceneFacility / runtime split) → ④ interior recut (kind-bins,
skeletons, the `controls/` decision — all intra-facility) → ⑤ `demo/CLAUDE.md`
deletes last (P3's ratified charter; no map survives to drift against this
tree). **The keystone step ① of the RATIFIED wave set lands only on the owner's
one-word `@`-dissolution confirm (OD-U2 REVISED-RECO — still riding);** the P7
prototype below needs no confirm — it is evidence, never merged.

### N1.4 — P7 prototype charter: `one-home-dock-move` (NEW, pass-3)

**Worktree:** fresh, off `tranche-u-dev` HEAD. **The representative family: the
dock** — the owner's verbatim "extirpated", small enough to execute whole, and it
exercises every move mechanic (home creation, import re-point, 14 gate-literal
re-anchors, a born-RED clause flip, the R11 prose class).

1. Create `demo/components/` (THE home); `git mv demo/app/dock demo/components/dock`;
   add the module's re-export-only `index.ts` (the recursive unit; today the dir
   has no barrel). The MbabbMenu↔ChromeDock intra-module import is unchanged.
2. Re-point `App.vue:141-142` to the new home. In the prototype, spell it
   RELATIVE (`../components/dock/…`) with a one-line note that the ratified
   spelling `@components/dock` lands with keystone step ① (the alias RHS swap) —
   the prototype must not half-execute the keystone.
3. Re-anchor ALL `app/dock` gate literals in the SAME commit (G10) — measured 14
   scripts at authoring; **re-measure in-commit** and record the count.
4. Flip `proof:app-is-shell`: remove `dock` from `ALLOWED_ROOT_DIRS`, add the
   no-component-under-app clause **born-RED** — run it on the pre-move tree
   FIRST and record the red, then green it with the move (the enforcement arm of
   "extirpated"). Distill the gate's now-false T.F3 eviction narration (`:61-66`)
   to the present-tense rule (the same cogency law as ruling 6).
5. Sweep the move under `P1-REANCHOR-TEMPLATE.md`'s full 8 site classes —
   including the new doc/prose class (`App.vue:340` et al.). Zero stale refs in
   surviving source (R12's distinction applies).
6. Commit the FULL move script as the in-tree spec artifact
   **`docs/tranches/U/loop/N1-MOVE-SCRIPT.md`** (ruling 5): the ordered,
   complete manifest for the WHOLE §N1 restructure — steps ①–⑤, every `git mv`,
   both config files' RHS edits line-by-line, every import class with its
   measured count, every gate literal by script name, the born-RED clauses, and
   the two owner-gated points (the `@`-confirm on step ①; the P5-ratified
   interior names at step ④). Written against the CURRENT tree's spellings —
   it must not presume the frozen prototypes' renames landed.
7. Verify: `npm run check` clean · vitest green · `npm run gh-pages` builds ·
   the demo structural gates green (`proof:colocation`,
   `proof:scene-control-dfa`, `proof:demo-no-oversize`, the re-anchored dock
   gates) · the flipped `proof:app-is-shell` green · zero published-surface
   change (`proof:boundary`, `proof:published-surface`).

**Convergence bar:** 100% = the dock family live in `demo/components/dock/`
with all gates green including the born-RED flip (red proven first) + the
complete measured move script in-tree + the 8-class sweep clean. Scored against
this charter surface; the hard half (the gate re-anchors + the born-RED proof)
first.

---

## §N2 — THE META/LEGACY FILE DELETION TABLE (OD-U20)

**The class, defined** (so the sweep is principled, not a name-match): a
**meta/legacy file** is one whose content is *about the codebase's own history
or process* rather than an input the shipped product or a genuine correctness
check needs — four shapes: the **meta-ledger** (a record of decisions/workarounds/
retirements), the **decision JSON** (a machine-readable one-time verdict; the
`recordedAt:` timestamp is the tell — a live build input has no birthday), the
**workaround registry** (a catalogue of band-aids awaiting an upstream fix), and
**tombstone/provenance debris** (leavings of a retired mechanism). **Scope
boundary (binding):** `docs/tranches/**` is the archive and OUT of delete scope;
`docs/precepts/**` and `.agents/skills/**` are methodology, OUT; the census
targets the active tree (`src/`, `demo/`, `scripts/`, `test/`, `bench/`, root).

### N2.1 — The DELETE table

| # | file(s) | what it is | disposition (nothing dies silently) |
|---|---|---|---|
| 1 | **`demo/glass-ui-gaps.ts`** (209L *(measured)*) | the owner-named specimen: the `GLASS_UI_GAPS` workaround registry + its citation API | **DELETE** (OD-U20 verbatim). The 5 tripwire-arm caps become a plain one-line comment at each of the 8 workaround sites — "workaround: glass-ui `<defect>`; remove when glass-ui ships `<fix>` (KF-TO-GLASSUI letter §0)" — each then FIXES for real at OD-U4's glass-ui 5.0.0 re-pin. The 6 no-band-aid recorded gaps (`workaroundSites: []`) already live in `KF-TO-GLASSUI-BG.md §0`; that letter is their single durable home — verify, don't duplicate. All `glassUiGap(...)` citation imports drop *(measured citers: `App.vue`, `ChromeDock.vue`, `MbabbMenu.vue`, `TransportDock.vue`, `KfPillTabs.vue`, `useKfPillTabs.ts`, `usePlayActuation.ts`, `ControlsPaneWrapper.vue` + the script set below)*. |
| 2 | the specimen's **satellite apparatus**: `scripts/proof-glass-ui-gap-tripwire.mjs` · `scripts/proof-workaround-deletion.mjs` · `scripts/lib/glass-caps.mjs` · the `GLASS_UI`/tripwire arrays in `scripts/gate-bands.mjs` | tripwire machinery with no referent once the ledger dies (already U.A-condemned) | **DELETE in the same motion**; retire their `package.json` gate keys per G12. |
| 3 | **`scripts/proof-blur-not-resampled.mjs` clause (C)** *(measured — a census MISS, added here)* | the gate's `LEDGER = demo/glass-ui-gaps.ts` read (`:72`, `:112-120`) requiring a `staticBackdrop` row | **RETIRE clause (C) only** (G12 — mooted by row 1); the gate's LIVE render clauses (A/B — the actual frozen-backdrop probes) SURVIVE. |
| 4 | **3 `proof:no-dead-export` DEFERRED rows** keyed to `demo/glass-ui-gaps.ts` (`GlassCapKey`/`GlassUiGap`/`GlassUiGapId`, `proof-no-dead-export.mjs:108-110`) *(measured)* | ratchet rows whose exporting file dies | **DELETE in the same commit** (the ratchet's stale-entry rule reds on an absent path): backlog 16 → 13. |
| 5 | **all 8 `scripts/*-decision.json`** *(measured: color-soa, leaves-externalization, processframe-soa, reseat-vs-decay, soa-composite, spring-vector, typed-om, waapi-densify)* | P/Q-campaign one-time verdicts, every one `recordedAt:`-stamped — the exact tombstone shape | **DELETE all 8.** The frozen design verdict of each ALREADY lives as a code comment at its seam (verified: `soa.ts:8,108`, `draggable.ts:361`, the spring/densify seam prose) — leave it there. For the JSONs a compare-gate `JSON.parse`s, dissolve the gate: a genuine **correctness invariant** (e.g. the SoA fold's bit-identity to the boxed reference) re-homes as a direct `test/group/` assertion; a genuine **perf floor** re-homes to `bench/taxonomy.json`'s `budgeted` category (the ONE live bench-budget authority). NAME each re-home in the commit; retire the emptied `proof:color-soa` / `proof:soa-composite` / `proof:processframe-soa` / `proof:spring-vector` / `proof:waapi-densify` keys per G12; drop `proof:record-truth`'s decision-JSON dirty-check clause and the `proof-wave-charter`/`lib/portable-perf` reads. |
| 6 | `scripts/baselines/visual-lock/_diff/` | — | **STRUCK from the table** per E6(a): not in the repository (T.M3 `71e0fb41` deleted it); the on-disk PNGs are untracked `_*`-ignored local debris. A local-hygiene note, no chartered work. This corrects the pass-3 census §3's inherited phantom. |
| 7 | `.dependency-cruiser-known-violations.json` | the suppression baseline | **cross-reference only** — already killed by P4 deliverable 1 (ratified); listed for class-completeness, not a second action. |

### N2.2 — The KEEP table (live inputs wearing the shape — recorded so no pass re-hunts)

`test/fixtures/keyframes/manifest.json` (the round-trip parse corpus) ·
`demo/@/styles/font-roles.json` (the live selector→role contract
`proof:font-census`/`proof:colocation` enforce — **trim its `_doc`
tranche-provenance narration** to the bare contract) · `bench/taxonomy.json`
(the live per-bench budget manifest — **the single perf-floor home**, absorbing
any real floor rescued from row 5; trim its provenance narration) · the live
`scripts/baselines/*.json` perf floors (`amiga-checkerboard`, `crayon-preserved`,
`lighthouse-mobile-after`; `lighthouse-mobile-t-open` KEEP-borderline — follows
its gate if the T.G9 integrity clause retires) · `scripts/epf1-baseline.json`
(KEEP-with-flag, load-bearing only while `proof:epf1-measure` survives the
apparatus review) · Monaco theme JSONs · root build/format/publish config.

**RELOCATE:** `docs/color-fidelity-data.json` — a generated gate/test
measurement artifact mis-homed under `docs/` — moves beside its consumers
(`proof-color-fidelity.mjs:59`, `test/engine/color-fidelity.test.ts:56`), both
readers re-pointed in the same commit (G10).

**FLAG (handed to the U.A gate-apparatus lane — NOT this item's delete
authority):** the archive-reading ledger gates (`proof:pin-ledger-current`,
`proof:stage-inventory`, the T-era verdict/golden readers) and the in-code
T-era ledgers in `gate-bands.mjs` (`RETIREMENT_LEDGER:441`,
`T_BORNRED_BACKLOG:609`) — their coupled features have shipped; re-examine for
retirement. The ledger JSONs themselves stay in `docs/tranches/**` (archive).

**FALSE POSITIVES, recorded:** `gestureSelectSuppression.ts` (a live runtime
composable, not a suppression file) and `compile/easing-registry.ts` (the
library's live easing lookup) — KEEP; the name matched the class, the content
did not.

### N2.3 — P8 prototype charter: `meta-legacy-delete` (NEW, pass-3)

**Worktree:** fresh, off `tranche-u-dev` HEAD.

1. **The specimen + cascade (the hard half, first):** delete
   `demo/glass-ui-gaps.ts`; plant the 5 one-line workaround comments at the 8
   sites (each naming defect + exit condition + the letter); drop every
   `glassUiGap(...)` citation import (re-measure the citer set in-commit);
   delete the 4 satellite apparatus files (N2.1 row 2) and their gate keys
   (G12); retire `proof-blur-not-resampled` clause (C) keeping A/B live; delete
   the 3 no-dead-export DEFERRED rows (ratchet 16→13, gate PASS).
2. **The decision-JSON class:** delete all 8; for each compare-gate, execute the
   named re-home — the SoA bit-identity invariant as a direct `test/group/`
   assertion, any real perf floor as a `bench/taxonomy.json` `budgeted` row —
   and retire the emptied gate keys per G12, with the `proof:record-truth`
   clause drop. Each re-home is NAMED in the commit message; nothing dies
   silently (the OD-U1 zero-loss burden, discharged by ledger not assertion).
3. Trim the `font-roles.json` `_doc` and `taxonomy.json` provenance narration to
   the bare contract; relocate `color-fidelity-data.json` with both readers
   re-pointed.
4. Record the KEEPs, flags, and false positives IN-TREE:
   **`docs/tranches/U/loop/N2-DELETION-LEDGER.md`** (ruling 5) — one row per
   class member, verdict + disposition + re-home anchor, including the E6(a)
   `_diff/` correction so this ledger and the census agree.
5. Verify: full gate roster green (minus the retired keys) · vitest green
   (including the NEW re-homed assertions) · `npm run gh-pages` builds ·
   `npm run check` clean · zero published-surface change.

**Convergence bar:** 100% = specimen + cascade + decision-JSON class executed
with every re-home named and green + the ledger in-tree + all G12 retirements
in the same commits as their moots.

---

## §N3 — THE DEMO↔LIBRARY DUPLICATION EXCISION TABLE (OD-U21)

**The defect (owner, verbatim):** "likely a great deal of duplication in
functionality between the demo and the library." The demo must DOGFOOD the
constellation (consume the very APIs it showcases) — never hand-roll a primitive
kf or value.js already ships. The lane-19 `num()`/`toRGB()` findings were the
first instances; the census generalized. **The entry ruling, made ONCE
(Option A):** demo excisions import **value.js subpaths directly**
(`@mkbabb/value.js/math|color|units|parsing|easing` — *(measured)* installed
value.js **3.1.0** ships exactly these subpath exports; R13's one-provenance rule).
value.js is a first-class constellation dependency the demo already declares;
the subpaths are tree-shakeable and LIGHT. kf's LIGHT barrel gains NO
pass-through math re-exports (Option B rejected absent an owner call for a
unified kf math surface).

### N3.1 — The excision table (HARD = a re-implemented primitive; PARTIAL = consume-and-adapt)

| # | class | demo site(s) | library equivalent (value.js unless noted) | **verdict** |
|---|---|---|---|---|
| D1 | HARD | `NAMED_EASING_BEZIER` — `…instrument/transport/animationDescriptions.ts:54-84`, a 30-row bezier table | `bezierPresets` (`/easing`) — whose OWN docstring says "source of truth, rather than hand-rolling parallel tables" | **EXCISE**, with the canonicality ruling: the two tables carry DIFFERENT control points for the sine/quad/cubic/expo families (demo = easings.net approximations; value.js = CSS-spec/MDN). **value.js's values are canonical** (the constellation authority); the visual curve delta IS the correction, recorded not regressed. The quart/quint rows value.js lacks stay as an explicit documented demo delta pending D-GAP-1. |
| D2 | HARD | `TIMING_DESCRIPTIONS` — `animationDescriptions.ts:15-51` | `timingFunctionDescriptions` (`/easing`) | **EXCISE**; reconcile the key space first (demo keys kebab `"ease-in"`; value.js may key camelCase) via the shipped `hyphenToCamelCase` — a consume, not a re-table. Demo-only blurbs stay a small delta (D-GAP-2). |
| D3 | HARD | `useSquareDemo.num()` (`:75-87`) — hand-rolled unit normalizer | `ValueUnit` / `parseCSSValueUnit` (`/units`, `/parsing`) — the very grammar kf exists over | **EXCISE** (the lane-19 mandate verbatim). |
| D4 | HARD | `useSquareDemo.toRGB()` (`:187-202`) — regex `rgb()` + hex expander | `Color` / `parseCSSColor` (`/color`) | **EXCISE** (subsumed by D5). |
| D5 | HARD | `useSquareDemo.sweepHue()` (`:206-214` + inline `mix`) — a naive **sRGB** channel lerp | `sampleColorRampAt` / `mixColorsN` (`/color`) in **oklab** | **EXCISE.** The demo hand-rolling a naive sRGB lerp actively CONTRADICTS kf's headline (perceptual oklab interpolation) — and the demo is internally inconsistent (`SpringHeatmap.vue:169` already does it right via `color-mix(in oklab,…)`). D3+D4+D5 excise as ONE motion — the whole square palette-sweep egg. |
| D6 | HARD (by count) | the `clamp` class: FOUR named `clamp01` re-definitions *(measured: `SequenceTarget.vue:153`, `SequencePlayhead.vue:16`, `SequenceScrubber.vue:48`, `SpringPhysicsFacet.vue:142`)* + ~30 inline `Math.max(min, Math.min(max, x))` sites | `clamp` (`/math`) | **SWEEP**: one direct import per file; delete the four copies; NO demo wrapper (a wrapper is a fifth copy). The class OD-U21's census names by word. |
| D7 | HARD | `lerp` — `AmigaScene.vue:92` + the D5 inline `mix` | `lerp` (`/math`) | **EXCISE** with D6's sweep. |
| D8 | PARTIAL | `timeline/utils/flattenVars.ts` — hand-rolled recursion + leaf detection + key transform | `flattenObject` (`/units`) composed with `camelCaseToHyphen` | **RE-BASE the body** on `flattenObject`; the thin key-transform wrapper stays as legitimate glue. Inherits value.js's correct `calc()`-atomic handling, which the demo copy does not guarantee. **Composes with SPEC-B2 §3's KEEP** — that was the MODULE verdict (2 consumers); this rules the module's BODY. No conflict. |
| D9 | PARTIAL | `timingCurveUtils.ts` `getCurvePath`'s `cubic-bezier` branch re-derives by sampling | `cubicBezierToSVG` (`/math`) | **ROUTE the branch** through `cubicBezierToSVG`; the GENERIC fn→SVG sampler stays (D-GAP-3, accepted UI glue). Lowest priority; co-locates with D1/D2. |
| D10 | GAP-adjacent | `timeline/utils/snapshotCapture.ts` — "snapshot THESE props at THIS percent" | none clean (kf ingest overlaps, no drop-in) | **KEEP as demo glue**; overlap recorded (D-GAP-4). Not a duplication. |
| D11 | — | `scenes/amiga/utils.ts:14-27` `resolveColor` — `var()` token → Canvas2D color | none (genuine DOM/Canvas glue) | **KEEP**; recorded so the sweep never mis-flags it. |

**The clean consumers are the TARGET shape, untouched:** `parseAnimationCSS.ts`,
`timelineEngine.ts`, `matrix-editor/transformMath.ts`,
`useTimingFunctionEditor.ts`/`useEasingDemo.ts`, `@/utils/kfEngine.ts` (the
sanctioned HEAVY accessor) — cited so the sweep leaves them alone.

**The true gaps book as CONSTELLATION ASKS, not demo debt:** D-GAP-1 (value.js
`bezierPresets` lacks the quart/quint families) + D-GAP-2 (missing description
rows / key-space) → ONE value.js U-letter row via U.F; D-GAP-3 (generic
easing-fn→SVG sampler) + D-GAP-4 (prop snapshotter) → accepted demo-owned glue,
closed with a note. A gap is a library ask; only a re-implementation of shipped
functionality is a demo defect.

### N3.2 — P9 prototype charter: `duplication-excise` (NEW, pass-3)

**Worktree:** fresh, off `tranche-u-dev` HEAD. Executes the census's top
excisions CONCRETELY, consuming the library:

1. **The square trio (D3+D4+D5) as ONE motion** — `num()` → `ValueUnit`/
   `parseCSSValueUnit`; `toRGB` + `sweepHue` + the inline `mix` →
   `sampleColorRampAt`/`mixColorsN` in **oklab**; delete all three plus the
   channel plumbing. The hard half — it changes rendered color behavior from
   naive-sRGB to perceptual, which is the CORRECTION (record a one-line
   before/after note).
2. **D1+D2** — `animationDescriptions.ts` re-bases on `bezierPresets` +
   `timingFunctionDescriptions`: value.js control points adopted as canonical
   (curve delta recorded as a correction); key space reconciled via
   `hyphenToCamelCase` against value.js 3.1.0's ACTUAL keys (verify, don't
   assume); quart/quint rows isolated as the documented demo delta with the
   D-GAP-1 letter pointer.
3. **The D6+D7 sweep** — delete the four `clamp01` definitions + the amiga
   `lerp`; re-point every inline clamp site to value.js `clamp` (re-measure the
   ~30-site list at sweep time; no wrapper).
4. **D8 re-base + D9 route** — `flattenVars` body → `flattenObject` compose
   (module and its 2-consumer KEEP untouched); the `cubic-bezier` branch →
   `cubicBezierToSVG`.
5. Record the table's KEEPs (D10/D11 + the clean consumers) and book the
   letter rows IN-TREE: **`docs/tranches/U/loop/N3-EXCISION-LEDGER.md`**
   (ruling 5) — per-item: the deleted symbol, the consuming replacement, the
   entry (subpath), the behavior delta if any.
6. Verify: `npm run check` clean · vitest green · `npm run gh-pages` builds ·
   the demo drives correctly where touched (square palette sweep, easing tiles,
   sequence scrubber, amiga) — the D1/D5 visual deltas eyeballed and recorded ·
   zero published-surface change (Option A adds nothing to kf's barrels).

**Convergence bar:** 100% = D1–D9 executed per the table (D10/D11 recorded, not
touched) + the ledger in-tree + the entry ruling honored (zero kf pass-through
re-exports) + all green with the behavior deltas declared.

**Merge-order note (R15's logic):** several N3 sites live in files N1 relocates
(`animationDescriptions.ts`, `timingCurveUtils.ts` under the instrument) and P5's
frozen worktree renames (the transport interior). Prototypes are independent
evidence; the WAVE SET executes on one tree where the path questions dissolve —
each prototype writes against the CURRENT tree's paths and says so.

---

## §Q — Questions the pass-3 critique fleet must score (step 4; R10 binds — self-contained critiques only)

1. **P1/P4/P6 closes** — score each against §C's exhaustive work list (which is
   PASS-2 §7's, verbatim); the residues are line-located, so anything short of
   100 needs a named, tree-verified defect.
2. **This spec's own errata honesty** — E1–E6 each claim a *(measured)* tree
   fact; spot-check them (the PASS-2 §4 SPEC-B2 critique caught exactly this
   class — the spec must not mint fresh imprecision while curing it).
3. **N1 (P7)** — is the move script COMPLETE against the 8-class template
   (measured counts, not inherited — the research's dock-gate list was an
   undercount; 14 measured here)? Was the born-RED clause's RED actually
   observed pre-move? Does the prototype leak keystone work (the `@` swap) it
   has no owner confirm for?
4. **N2 (P8)** — does any live invariant die silently in the decision-JSON
   dissolve (every re-home named and GREEN as a test/bench row)? Is the
   blur-not-resampled A/B survival verified (clause C retired, gate still
   bites)? Does the ledger record the E6(a) `_diff/` correction?
5. **N3 (P9)** — are the D1/D5 behavior deltas honestly declared corrections
   (owner-taste flag if the easing tiles or the square sweep read materially
   different)? Is the key-space reconciliation verified against value.js 3.1.0's
   actual `timingFunctionDescriptions` keys? Zero new kf barrel exports?
6. **Carried owner rides (SPEC-B2 §9 Q6, updated):** `demo/DESIGN.md` KEEP + the
   `@`-dissolution one-word confirm still ride to the owner — the latter now
   gates §N1's ratified keystone step ①. ChannelGroup does NOT join them
   (converged, landed, ratified).
7. **G11 discipline on the new items** — every count in §N1.3, N2.1, and N3.1
   re-measured at execution time; a stale count voids the verdict it produced.

**Exit condition (OD-U18, unchanged):** step 4 on the four touched Part-I items
+ the three new items, then step 5 agglomerates. At 100% across ALL items the
loop TERMINATES and the exact U wave-set development begins — the six pass-1/2
prototype branches + P7/P8/P9 + the `loop/` records as its ratified evidence
base, with the standing lessons intact: score against the charter, execute the
hard half first, leave the record in-tree, and verify — never inherit — every
number.
