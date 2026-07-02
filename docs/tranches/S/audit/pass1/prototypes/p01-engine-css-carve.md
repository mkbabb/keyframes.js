# Prototype p01 — engine/css/ carve (Tranche S · Q1)

**Probe:** Does `engine/css/` produce **cohesion** or **ceremony**? Actually create
`src/animation/engine/css/`, move the CSS-twin entry pair into it with a barrel, fix
imports, and run the gate set.

**Worktree:** `.claude/worktrees/wf_f9faf42c-6b8-1` (branch `worktree-wf_f9faf42c-6b8-1`;
node_modules symlinked; no commits, no git add).

---

## 1. The question + the spec's assumption

**Q1 (SPEC-v1 §6):** *"Does engine/css/ produce cohesion or ceremony? Perform the B2 move
in a worktree: css-animation + css-metadata → engine/css/, recursive proof-engine fix,
barrel edit. SUCCESS: ≤1 barrel touched, zero new re-export-only bridges, proof:engine +
decomposition + test suite green, group/\* untouched. FAILURE (falls back to a03's flat
pair): >1 bridge module needed or external import churn >10 sites."*

**Binding ruling under test — C-1 (§2.2):** RULING **YES — create `engine/css/`.** The
spec adopts a17 F2's evidence: `css-metadata.ts` is INTERNAL with exactly one importer
(`css-animation.ts`), the pair is the entire CSS-entry surface (446L), nothing outside
`engine/` deep-imports either, and the sub-zone is *forced anyway* by the 499/498L ceiling
collision (a17 F1).

**The spec's cost assumption (a17 F2/F4):** migration cost is **LOW** — "move 2 files, add
1 barrel, update `engine/index.ts`, and co-edit `proof-engine.mjs`" (F2), with F4 naming
`proof-engine.mjs` as *the* gate co-edit (its flat `readdirSync` must go recursive). The
implicit claim is that the gate blast radius is **one** script.

---

## 2. What I actually did (commands + exit codes)

Design followed verbatim from `a17-zone-engine.md` §"ideal layout" (css-metadata.ts renamed
to `metadata.ts` — the `css-` prefix is redundant under `css/`).

| Step | Action | Result |
|------|--------|--------|
| baseline | `node scripts/proof-engine.mjs` / `proof-decomposition.mjs` | exit **0** / **0** |
| move | `mkdir engine/css`; `mv css-animation.ts css/`; `mv css-metadata.ts css/metadata.ts` | — |
| rewrite | `css/css-animation.ts`: `../`→`../../` (8 edges), `./css-metadata`→`./metadata`, `./animation`→`../animation`; `css/metadata.ts`: `../`→`../../` (2 edges) | — |
| barrel | wrote `css/index.ts` = `export { CSSKeyframesAnimation } from "./css-animation";` (1 export) | — |
| re-point | `engine/index.ts`: `from "./css-animation"` → `from "./css"` (1 line) | — |
| gate: recursive | `proof-engine.mjs` flat `readdirSync` → `{ recursive: true }` + `sep`-normalize (a17 F4) | — |
| **check:lib** | `tsc --noEmit -p tsconfig.lib.json` | exit **0** |
| **proof:engine** | `node scripts/proof-engine.mjs` | exit **0** |
| **proof:decomposition** | `node scripts/proof-decomposition.mjs` | exit **0** |
| **build** | `npm run build` | exit **0** (`✓ built in 1.83s`) |
| **vitest slice** | `animation` + `engine-correctness` + `engine-modern-web` + `scroll-scene` + `default-easing-css-twin` + `emerging-css-resolve-p2` | exit **0** — **85 passed** |

**But** the move first RED-ed **8 additional proof scripts** (each exit 1) that hardcode the
two file paths as strings — *not* flagged by a17. After co-editing all 8, they return to
exit **0**:

```
proof-processframe-soa   proof-replay-equality   proof-soa-composite
proof-diagnostics-channel  proof-nan-frame        proof-composition-honored
proof-platform-adopt     proof-no-silent-fallback         → all exit 0 after fix
```

**`git diff --stat` (source + gates):**

```
 scripts/proof-composition-honored.mjs |  6 +-
 scripts/proof-diagnostics-channel.mjs |  4 +-
 scripts/proof-engine.mjs              | 11 +-   ← recursive fix (a17 F4)
 scripts/proof-nan-frame.mjs           |  4 +-
 scripts/proof-no-silent-fallback.mjs  |  4 +-
 scripts/proof-platform-adopt.mjs      | 10 +-
 scripts/proof-processframe-soa.mjs    |  4 +-
 scripts/proof-replay-equality.mjs     |  4 +-
 scripts/proof-soa-composite.mjs       |  4 +-
 src/animation/engine/css-animation.ts | 277 ----  (moved → css/css-animation.ts)
 src/animation/engine/css-metadata.ts  | 169 ----  (moved → css/metadata.ts)
 src/animation/engine/index.ts         |  2 +-
 12 files changed, 28 insertions(+), 471 deletions(-)
 + untracked: src/animation/engine/css/{index.ts,css-animation.ts,metadata.ts}
```

`group/` status: **UNTOUCHED** (`git status --porcelain | grep group/` = empty).

---

## 3. Findings (file:line evidence)

### F-a — Source-level cohesion is REAL. The pair moves as a closed unit. (confirms a17 F2)

After the move, `metadata.ts`'s **only** source importer is its co-located sibling:

```
$ grep -rn 'from "[^"]*metadata"' src/
src/animation/engine/css/css-animation.ts:28:} from "./metadata";
```

Nothing imports `css/css-animation` directly — every consumer routes through the barrel
(`engine/index.ts:21 → "./css"`). Coupling **into** the pair from outside `engine/` = **0**;
coupling **out** is normal fan-out (`../../adapter`, `../../constants`, `../../compile/*`,
`../../easing`, `../animation`). This is a textbook cohesive extraction — the two files are a
genuinely self-contained CSS-entry cluster, exactly as a17 F2 claimed. **Not** ceremony.

### F-b — The barrel is the ONE idiomatic zone barrel, not a bridge. (SUCCESS criterion met)

`css/index.ts` is 1 export line (`export { CSSKeyframesAnimation } from "./css-animation"`).
It matches every other zone/sub-zone `index.ts` and lets `engine/index.ts` depend on the
sub-zone name (`"./css"`), not the file layout. **Zero** new re-export-only *bridge* modules
were needed (a "bridge" = a module that re-exports across a seam that shouldn't need one;
this is the standard barrel). ✓ "≤1 barrel touched", ✓ "zero new bridges", ✓ "0 bridges
needed" (well under the >1 FAILURE line).

### F-c — SOURCE import churn = **1 site**. Far under the 10-site FAILURE line.

The only external *source* importer of the pair was `engine/index.ts` (1 line re-pointed).
Tests deep-import zero engine internals (`grep -rln "engine/" test/` = 0). `vite.config.ts`'s
`./engine` subpath entry is path-stable (`engine/index.ts` didn't move — build green). So on
the spec's literal "external import churn" (source imports), churn = **1**. ✓

### F-d — **The true seam a17 undercounted: NINE gates hardcode these paths, not one.** (adjusts a17 F4 / B2 cost)

a17 F4 named `proof-engine.mjs` as *the* gate co-edit. The probe found **8 more** proof
scripts that string-reference `engine/css-animation.ts` / `engine/css-metadata.ts` as
behavioral-gate anchor paths — in two forms:

**Runtime dynamic-import probes** (build a temp `.mts`, `import()` the file):
- `proof-nan-frame.mjs:46` — `join(root,"src","animation","engine","css-animation.ts")`
- `proof-processframe-soa.mjs:237` — same shape
- `proof-soa-composite.mjs:416` — same shape
  → these fail hard: `ERR_MODULE_NOT_FOUND … engine/css-animation.ts`

**Static source-text reads** (read the file, assert on its contents):
- `proof-replay-equality.mjs:103` — `const CSS_ANIMATION = "src/animation/engine/css-animation.ts"`
- `proof-diagnostics-channel.mjs:82` — same const
- `proof-composition-honored.mjs:90` — same const
- `proof-platform-adopt.mjs:108,132` — `readOpt(path.join("engine","css-animation.ts"))` **and** `…"css-metadata.ts"`
- `proof-no-silent-fallback.mjs:127` — `join(src,"animation","engine","css-metadata.ts")`
  → these fail with explicit messages, e.g. `proof-no-silent-fallback`: *"excise-set lib file
  missing: src/animation/engine/css-metadata.ts — the excision target is absent (file
  renamed?)"*

**Total gate co-edit surface: 10 sites across 9 scripts** (9 path-string sites + the
`proof-engine.mjs` recursive fix). Seven scripts anchor on `css-animation.ts`, two on
`css-metadata.ts`. This is the load-bearing residue a17's "co-edit proof-engine" line hid:
the engine's CSS files are **anchor paths for a whole gate fleet**, and any rename (esp. the
`css-metadata.ts → metadata.ts` rename the design mandates) touches every one.

### F-e — a17's "ONLY importer is css-animation.ts" holds (the events.ts hit is a comment).

`grep -rln css-metadata src/` also surfaced `orchestration/sequence/events.ts` — but that is
a doc-comment reference (`events.ts:6` "…`engine-css-metadata.ts`…"), not an import. a17 F2's
single-importer claim is accurate for real edges.

---

## 4. VERDICT: **confirms-spec** (on the C-1 ruling) — with a bounded **cost adjustment** to a17 F4 / B2

The C-1 RULING (create `engine/css/`) is **confirmed cohesion, not ceremony.** Every Q1
SUCCESS gate is met and no FAILURE gate is tripped:

| Q1 criterion | Result |
|---|---|
| ≤1 barrel touched | ✓ 1 new (`css/index.ts`); `engine/index.ts` is a 1-line re-point, not a new barrel |
| zero new re-export-only bridges | ✓ 0 |
| proof:engine + decomposition + test suite green | ✓ 0 / 0 / 85-passed |
| group/\* untouched | ✓ |
| FAIL: >1 bridge module | ✓ not tripped (0) |
| FAIL: external import churn >10 sites | ✓ not tripped (**source** churn = 1) |

The pair is a whole cohesive unit (F-a): `metadata.ts` has exactly one importer, nothing
outside `engine/` reaches in, the barrel is idiomatic. The carve **adds cohesion and reduces
the flat-sibling count**; it does **not** just add path depth.

**The adjustment (does NOT change the ruling, DOES change the cost line):** a17 F4 / the B2
plan must be amended from *"co-edit proof-engine.mjs"* (1 gate) to *"co-edit 9 proof scripts
+ make proof-engine recursive — 10 gate sites, 7 anchored on `css-animation.ts`, 2 on
`css-metadata.ts`"*. **Spec text to add to B2:**

> B2's `engine/css/` move is a **10-site gate co-edit**, not a 1-site one. Beyond
> `proof-engine.mjs`'s recursive fix, repoint the hardcoded CSS file paths in:
> `proof-{nan-frame,processframe-soa,soa-composite}` (dynamic-import probes),
> `proof-{replay-equality,diagnostics-channel,composition-honored}` (CSS_ANIMATION const),
> `proof-platform-adopt` (both css-animation **and** css-metadata), `proof-no-silent-fallback`
> (css-metadata excise-set). The `css-metadata.ts → metadata.ts` rename is what makes this a
> co-edit rather than a dir-prefix insert — if the rename is dropped, only the dir segment
> changes but all 9 sites still edit.

This is the SAME class of hazard a17 F4 identified (gates that hardcode a flat path go
fragile under sub-zoning) — the probe simply shows it is **10× wider** than F4 counted. It is
a real, mechanical, low-risk cost, not a reason to fall back to a03's flat pair.

---

## 5. Implementation-cost estimate for the real wave (S.B2)

**Files touched: 15.**
- **Source: 4** — `css/index.ts` (new, 1 export), `css/css-animation.ts` (moved, 10 import
  re-bases), `css/metadata.ts` (moved+renamed, 2 import re-bases), `engine/index.ts` (1 line).
- **Gates: 9** — `proof-engine.mjs` (recursive walk, ~11L) + 8 path-string co-edits (9 sites).
- **Docs (out of probe scope, but B2/S.W-docs owes): 2** — `src/animation/CLAUDE.md` (still
  says `engine.ts` flat + `Animation<V>`; a17 F3) and the `engine/` line in project
  `CLAUDE.md` should name `engine/css/`.

**Gates affected:** `proof:engine` (recursive co-edit — the a17 F4 blind-spot fix ships
here), `proof:decomposition` (auto-sweeps `src/animation/**` recursively — **no** co-edit,
new sub-zone files auto-covered), and the 8 behavioral gates above (mechanical path repoint).
`proof:boundary` / `proof:published-surface` unaffected (barrel surface unchanged — build +
check:lib green). `vite.config.ts` `./engine` entry path-stable.

**Risk: LOW.**
- Zero blast radius on tests (0 deep-imports) and on `group/` (it imports `../engine/animation`,
  not css — untouched here; F10 is a separate concern).
- The only non-mechanical edit is `proof-engine.mjs`'s recursive walk — and shipping it is a
  *net gate-integrity gain* (it closes the F4 blind-spot the moment `engine/` sub-zones).
- The one thing that will bite an unprepared implementer: the 8 hidden gate anchors. They
  fail LATE (only when that specific gate runs, not at check:lib/build), so a wave that runs
  only `check:lib + build + proof:engine + proof:decomposition` (exactly the SUCCESS set)
  goes **green while 8 other gates are red** — `proof:all` is the only thing that catches
  them. **B2 must run `proof:all`, not the Q1 SUCCESS subset, before declaring done.**

**Bottom line:** ship `engine/css/` (with the `metadata.ts` rename). It is real cohesion. Budget
the gate co-edit as **10 sites / 9 scripts**, not 1, and gate the wave on `proof:all`.
