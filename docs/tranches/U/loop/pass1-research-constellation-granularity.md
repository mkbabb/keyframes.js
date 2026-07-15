# Pass 1 Research — constellation-granularity

**Lane:** constellation-granularity (owner 5-step loop, step 1, pass 1)
**Charter:** OWNER-ASKS row 6 (the convergence-loop mandate) + OD-U15/U16/U17.
Cross-check how the siblings (glass-ui, value.js) handle **small-module inlining**,
**module granularity**, **CLAUDE.md deletion** (glass-ui B4f as the OD-U15 precedent),
and **README shape** — deliver the homogeneity constraints U's granularity rules must respect.

READ-ONLY. Evidence is `repo:path:line` for code, doc-anchors for tranche prose.

---

## 1. The three constellation granularity idioms (observed)

### glass-ui — per-component DIRECTORY + a small curated set of flat top-level barrels
- `src/components/ui/` = **43 kebab-case component dirs** + `_shared/` + `index.ts`
  (`glass-ui:src/components/ui/` — `ls -d */ | wc -l` = 43). `src/components/custom/`
  = ~50 more custom-composite dirs.
- Each component dir = **PascalCase SFC(s) + `index.ts` barrel** (+ `constants.ts`,
  + a nested `composables/` when the renderer earns it). Evidence:
  - `button/` = `Button.vue` + `index.ts` (two files).
  - `dialog/` = **10 files** — `Dialog.vue`, `DialogContent.vue` (14KB), and **seven
    tiny sub-SFCs** (`DialogClose.vue` **228 bytes**, `DialogFooter.vue` 365B,
    `DialogHeader.vue` 319B, `DialogTitle.vue`, `DialogTrigger.vue`, …) + `index.ts`.
  - `dock/` = 14 SFCs + `composables/` + `constants.ts` + `README.md` + `index.ts`.
  - nested per-component `composables/` exist on the heavy renderers only:
    `data-table/`, `drawer/`, `carousel/`, `dock/`, `deck/`, `liquid-grid/`,
    `typewriter/`, `dot-matrix/`, `infinite-scroll/`, `tabs/`
    (`glass-ui: find src/components -type d -name composables`).
- **Flat top-level barrels** (the "curated ~12"): `src/` carries **10 flat `.ts`
  package barrels** — `axes.ts carousel.ts dark.ts forms.ts infinite-scroll.ts
  keyboard.ts motion.ts motion-core.ts sidebar.ts tokens.ts` — plus `index.ts` and
  the `api/` dir. These are the value-add cross-cutting entries; the bulk of the
  surface is per-component.
- **Subpath shims** (`src/subpaths/*.ts`, **78 files**) are **one-liners**:
  `button.ts` = `export * from "../components/ui/button";`
  (`glass-ui:src/subpaths/button.ts:1`). One per published subpath; each maps to a
  `./<name>` export in `package.json` (~90 subpath exports).

### value.js — functional module DIRECTORIES + a fixed 7-subpath fan-out
- `src/` = functional dirs `parsing/ quantize/ transform/ units/` + `subpaths/` +
  flat `easing.ts index.ts math.ts utils.ts` (`value.js:src/`).
- `units/` further nests `units/color/`. `parsing/` holds 15 cohesive `.ts` files.
- `subpaths/*.ts` = **7 thin re-export modules** (color, parsing, math, easing,
  transform, units, quantize), each a `./` export in `package.json`. The smallest
  (`subpaths/quantize.ts`) is **8 lines** and is KEPT — it is a build-entry contract,
  not dead weight.
- `quantize/` = `index.ts + cluster.ts + types.ts` — a **3-file dir** kept as a dir
  because the three are a semantic family behind ONE barrel, even though small.

### keyframes.js — 11 zone DIRECTORIES + barrels (already sibling-shaped)
- `src/animation/` = 11 zone dirs each with an `index.ts` barrel + the `internal/`
  leaf tier (no barrel, by design). **21 `index.ts` barrels** total
  (`find src -name index.ts | wc -l`).
- Two package "in"s: `index.ts` (LIGHT) + `public.ts` (`./engine` HEAVY subpath) —
  the value.js `.` + subpath shape, not the glass-ui 90-subpath fan-out.

**Convergent shape across all three:** the granularity UNIT is the **cohesive
directory behind ONE barrel**, published (where applicable) via a **one-line subpath
shim**. Tiny FILES survive freely INSIDE such a dir; tiny standalone ORPHAN modules do
not exist in any of the three trees.

---

## 2. Small-module inlining — what the siblings actually inline (and never do)

The census of sub-25-line non-`index` modules across all three trees:

| repo | tiny non-index modules | what they are |
|---|---|---|
| keyframes.js | `internal/scroll-phases.ts` (16L), `env.d.ts` (20L, build shim) | one real leaf + one build shim |
| value.js | `subpaths/{quantize(8),math(18),transform(22)}.ts`, `vite-env.d.ts`(7) | **all subpath shims + build shim** |
| glass-ui | `subpaths/*.ts` (~78 × **1 line**), plus tiny sub-SFCs like `DialogClose.vue` (228B) | **all subpath shims + family sub-members** |

**The homogeneity rule this yields:** the siblings NEVER inline (a) a subpath/barrel
shim — it is a load-bearing build-entry contract, or (b) a tiny FILE that is a distinct
semantic member of a barrel'd family (glass-ui keeps a 228-byte `DialogClose.vue`
beside its siblings). What does NOT exist in any tree is an **orphan micro-module**:
a standalone file, imported by exactly one consumer, that carries no subpath role and
no sibling family — a pure indirection hop. THAT is the only class OD-U16's "absurdly
small modules → inline" legitimately targets.

**Consequence for keyframes.js:** the library is **already lean** on this axis — the
only sub-25L non-barrel module is `internal/scroll-phases.ts` (16L), and it is a named
member of the `internal/` leaf family (sibling to `scheduler.ts`, `reduced-motion.ts`),
so it is a KEEP under the sibling rule, not an inline. **The inlining edict has near-zero
library targets; the granularity work is overwhelmingly the OTHER direction** — carving
the **20 files >300L** (`physics/spring/progress.ts` 492L, `engine/play-lifecycle.ts`
489L, `engine/animation.ts` 483L, `compile/backward/backward.ts` 475L,
`orchestration/drag/draggable.ts` 471L, …). The demo (per U.B) is where real inline
candidates and the long-file carves both concentrate; the library is close to converged.

---

## 3. glass-ui B4f delete-CLAUDE.md — the OD-U15 precedent, in full mechanics

Source: `glass-ui:docs/tranches/BH/PLAN.md` + the already-scaffolded
`glass-ui:docs/canon/`.

**The disposition (PLAN.md:30, row 1):** *"CLAUDE.md disposition — Hard-delete, no
replacement. B4f deletes the file outright; nothing replaces the auto-injection boot
seam. The live CONTRACTS still redistribute first (silent-loss fence). Future sessions
boot from `docs/precepts` (submodule) + the memory system + a discoverable
`docs/canon/README.md` index — but no auto-loaded project manual."*

**The three-step ordered protocol (the "silent-loss fence") — PLAN.md:48-50, :119-133:**
1. **REDISTRIBUTE first (B4b).** CLAUDE.md's load-bearing contract prose is inventoried
   and copied to its new home BEFORE deletion. glass-ui's homes already exist as
   skeletons: `docs/canon/{structure,dependencies,conventions,build-and-gates,
   design-axes,glass-system,motion-system,consumer-wiring,exports-and-subpaths,
   deps-currency}.md` + per-component `src/components/custom/<dir>/README.md`
   (`glass-ui:docs/canon/README.md`, the topic→home table).
2. **RE-HOME the readers (B5c).** glass-ui has **~16 gate scripts that `readFileSync`
   CLAUDE.md** (PLAN.md:16). Of these, **2 bare-`readFileSync` CRASH on deletion** (one
   is RELEASE-tagged — `doc-consistency:197` THROWS ENOENT mid-`--run full`, aborting
   `git tag`); 14 guarded readers silently false-pass. All re-point through a resolver
   (`scripts/lib/canon-doc.mjs`, `CANON_HOMES` map) BEFORE the delete.
3. **DELETE last (B4f).** *"B4f (CLAUDE.md delete) is the absolute last act"*
   (PLAN.md:48). Gated by born-RED `proof:claude-deletable` — GREEN only when
   `file gone + zero live readers over all 6 alias forms + auditCanonHomes content-
   complete` (PLAN.md:77, :126). Hard DAG edge `B5c → B4f` (PLAN.md:50).

**Two content-shape acceptance rules worth importing:**
- Redistributed content must be **content-complete, not skeleton-present** — a >200-char
  body floor, the skeleton marker stripped (`auditCanonHomes("content")`, PLAN.md:119).
- Structured contracts land as **markdown TABLES, not prose** where a gate parses them
  (dependencies as `| pkg ^x | role |` rows — PLAN.md:119; a prose list greens the
  presence check while the dep-rot arm parses zero — PLAN.md:125).

**Status:** glass-ui B4f is **PLANNED, not yet executed** — the live tree still carries
a **323KB CLAUDE.md** (`glass-ui:CLAUDE.md`), and `docs/canon/*` are explicitly
SKELETONS (`glass-ui:docs/canon/conventions.md:1` — *"SKELETON (BH.B4b-skeleton)…
until then, CLAUDE.md is the live source"*). value.js has **NOT** started — it still
carries a root `CLAUDE.md` (14KB) + **per-module `CLAUDE.md` files** in `parsing/`,
`transform/`, `units/`, `subpaths/` (`value.js:src/*/CLAUDE.md`).

---

## 4. The OD-U15 homogeneity tension (must be reconciled in the spec)

OD-U15 (OWNER-DECISIONS.md:24) says the deleted content re-homes **"inline (docstrings
at the code it describes) or briefly/deftly in the README"** and claims *"glass-ui's own
5.0.0 plans the identical B4f 'delete CLAUDE.md' act, so the constellation converges."*

**These are not the same mechanism.** glass-ui B4f re-homes into a **`docs/canon/`
tree (11 topic files + generated `structure.md` + per-component READMEs + a resolver
`canon-doc.mjs`)** — NOT "inline-or-README." The convergence is in the ACT (hard-delete,
no boot manual, silent-loss fence, gate re-home before delete), NOT in the destination.

The spec must pick keyframes.js's destination deliberately and state WHY it is
homogeneous-in-spirit:
- keyframes.js's CLAUDE corpus is **639 lines across 3 files** (root 118 + demo 126 +
  `src/animation/` 395) vs glass-ui's 323KB single file. The heavy `docs/canon/`
  resolver machinery is **proportionate to glass-ui's scale, not keyframes.js's**.
- keyframes.js has **almost no gates that read CLAUDE.md as a live contract** the way
  glass-ui's 16 do (the OD register names `proof:claude-paths-live`,
  `proof:claude-structure-sync` — a small set). So the "re-home 16 readers" burden is a
  handful, and the "inline-or-README" destination is viable WITHOUT a canon resolver.
- **Verdict for the spec:** adopt glass-ui's B4f *protocol* (redistribute → re-home
  readers → delete-last, born-RED deletable gate, content-complete not skeleton) but
  keyframes.js's *destination* is the lean owner-stated one — **inline docstrings for
  per-file/per-zone intent + README for the cross-cutting narrative** (the value.js
  README already embeds a `## Structure` tree; keyframes.js's README does not yet — that
  is the natural home for the `src/animation/CLAUDE.md` file-inventory prose). This is
  homogeneous with glass-ui at the protocol layer and with value.js at the README-embeds-
  structure layer, WITHOUT importing a 11-file canon tree keyframes.js's scale does not
  earn. Flag the OD-U15 "constellation converges" clause as protocol-convergence.

---

## 5. README shape — the sibling template

- **value.js** (`value.js:README.md`): `# title` → one-line pitch → demo link →
  `## Features` (bulleted capability list) → `## Install` → `## Usage` (import snippet)
  → `## Build` (script table) → **`## Structure` (embedded `src/` tree with per-dir
  comments)**. This is the closest precedent for OD-U15's "structure lives in README."
- **glass-ui** (`glass-ui:README.md`): `# title` → pitch → `## Features` → `## Install`
  → `## Usage` (import snippets grouped by root barrel / flat subpath / per-package
  subpath / api) → CSS `@import` block. No embedded structure tree (that lives in
  `docs/canon/structure.md`, GENERATED).
- **keyframes.js** (`keyframes.js:README.md`): `# title` → pitch → `## Quick Start`
  (runnable `./engine` snippet) → `## Installation`. It does **not** carry a `## Structure`
  section — the file inventory lives in `src/animation/CLAUDE.md` today. When that file
  deletes, the README is the natural home for the zone-map narrative (value.js precedent).

**Homogeneity constraint:** all three READMEs open `# name` → pitch → Features/Quick-Start
→ Install → Usage. keyframes.js should ADD a value.js-style `## Structure` section (the
11-zone map, deftly) as the README home for the deleted `src/animation/CLAUDE.md` tree
prose — matching value.js, and matching glass-ui's *generated* structure doc in intent.

---

## 6. Suppression-file homogeneity (OD-U17 cross-check)

OD-U17 removes `.dependency-cruiser-known-violations.json`. Sibling posture:
- glass-ui's BH plan treats suppression as debt to DISSOLVE, not carry — the whole
  "delete the ledger, fix or honestly re-scope the rule" ethos runs through B5e's
  gate-prune (`glass-ui:docs/tranches/BH/PLAN.md:133` — *"ZERO behavioral assertion
  lost"*, retire self-test-bite-only gates, protect the true-positive set).
- **Homogeneity rule:** a suppression file may die only when its rule is FIXED or
  honestly re-scoped so the gate stays a true-positive — never by simply deleting the
  assertion. The keyframes.js depcruise known-violations excision must land the
  no-cycle/boundary rules as green-by-fix, mirroring glass-ui's "no assertion lost."

---

## Rules/verdicts for the spec

1. **The granularity unit is the cohesive DIRECTORY behind ONE barrel, not the file.**
   All three siblings converge on this. A U granularity rule that scores individual
   files against a line-floor in isolation is non-homogeneous — score the *dir family*.

2. **"Inline absurdly small modules" (OD-U16) targets ONLY orphan micro-modules** —
   a standalone file, single consumer, no subpath role, no sibling family, pure
   indirection. NEVER inline (a) a subpath/barrel shim (glass-ui keeps 78 one-liners;
   value.js keeps an 8-line one), or (b) a tiny distinct member of a barrel'd family
   (glass-ui keeps a 228-byte `DialogClose.vue`). The keyframes.js library has
   effectively ZERO legitimate inline targets (`internal/scroll-phases.ts` is a family
   member = KEEP); the small-module edict's real surface is the demo.

3. **The long-file carve is the dominant granularity action, not inlining.** 20 library
   files exceed 300L; the named `easing-option.ts → easing/` carve (OWNER-ASKS row 6)
   is representative. Carve to a `<name>/` dir + `index.ts` barrel (the value.js
   `quantize/`, glass-ui `dock/composables/` idiom), keeping the public import spelling
   stable via the barrel.

4. **CLAUDE.md deletion adopts glass-ui B4f's PROTOCOL, not its destination.**
   Ordered, gate-enforced: (a) inventory + redistribute load-bearing contracts FIRST
   (silent-loss fence); (b) re-home every gate that reads a CLAUDE.md BEFORE deleting;
   (c) delete as the ABSOLUTE-LAST act, gated by a born-RED `deletable` proof
   (`file gone + zero live readers + content-complete-not-skeleton`). Content that a
   gate parses re-homes as a markdown TABLE, not prose.

5. **keyframes.js's redistribution destination is lean: inline docstrings + a README
   `## Structure` section** — homogeneous with glass-ui at the protocol layer and
   value.js at the README-embeds-structure layer, WITHOUT a `docs/canon/` resolver tree
   (that machinery is proportionate to glass-ui's 323KB scale, not keyframes.js's
   639-line corpus). **Flag OD-U15's "constellation converges" as PROTOCOL convergence**,
   and reconcile the "inline-or-README" wording against glass-ui's `docs/canon/` in the
   spec so the two are not read as identical.

6. **All three CLAUDE.md files delete, but note value.js has NOT started and glass-ui's
   B4f is PLANNED-not-executed** — keyframes.js would be the FIRST constellation repo to
   actually execute the delete. The spec should record this (keyframes.js leads; the
   protocol it proves becomes the sibling template) rather than claim it merely follows.

7. **Suppression-file removal (OD-U17) lands as fix-or-honest-rescope, ZERO assertion
   lost** — the glass-ui B5e ethos. Delete `.dependency-cruiser-known-violations.json`
   only once the no-cycle/boundary rules pass green by real fix.

8. **README shape homogeneity:** keep `# name → pitch → Quick-Start/Features → Install
   → Usage`; ADD a value.js-style `## Structure` zone-map as the README home for the
   deleted `src/animation/CLAUDE.md` inventory.
