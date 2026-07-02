# Probe p03 — `constants.ts` LIGHT/HEAVY split (r3)

**Tranche S · Pass-1E prototype fleet · THROWAWAY EVIDENCE.** Prototype built in
worktree `wf_f9faf42c-6b8-3`; nothing committed. This file is the deliverable.

---

## 1. The question + the spec's assumption

SPEC-v1 §2.2 item 11 (and the §6 open-question framing it feeds):

> *"the `constants.ts` LIGHT/HEAVY seam held only by `import type` discipline
> (r3, a20)"*

`constants.ts` today is a **HEAVY** module: it carries three *runtime* value.js
edges — `COLOR_SPACE_RANGES`, `easeInOutCubic`, `timingFunctions`
(`src/animation/constants.ts:1–10`). Yet the LIGHT surface leans on it heavily
for **types** (`Easing`, `TimingFunction`, `Vars`, `AnimationFrame`, …). The
boundary holds only because every light importer spells `import type` — a
*discipline*, enforced post-hoc by `proof:boundary`, not a *structure*. A single
`import { defaultOptions } from "../constants"` in a light module would pull
value.js into the light graph; only the gate would catch it.

**r3's proposal:** split into `constants/types.ts` (light, value.js-free) +
`constants/defaults.ts` (heavy, value.js-bearing) so the boundary is
**structural** — a light module can import from a file that *cannot* leak
value.js, gate or no gate.

**Assumption under test:** the split is (a) mechanically feasible under
`verbatimModuleSyntax` + `exactOptionalPropertyTypes`, (b) achieves a genuine
structural guarantee, and (c) leaves every gate + the d.ts roll-up green.

---

## 2. What I did

Executed the split in the worktree:

| Action | File | Result |
|---|---|---|
| **new (light)** | `constants/types.ts` (336 L) | all types + the value.js-*free* runtime consts (`DIRECTIONS`, `FILL_MODES`, `HUE_METHODS`, `NOOP_TRANSFORM`, `defaultLayerConfig`, `TimingFunctionNames`). **Zero runtime imports** — every value.js import is `import type`. |
| **new (heavy)** | `constants/defaults.ts` (30 L) | the two value.js-*bearing* consts only: `COLOR_SPACES` (needs `COLOR_SPACE_RANGES`) + `defaultOptions` (needs `easeInOutCubic`). |
| **new (barrel)** | `constants/index.ts` (9 L) | `export * from "./types"; export * from "./defaults"` — back-compat for heavy `../constants` importers. |
| **delete** | `constants.ts` | replaced by the directory. |
| **repoint** | 10 light importers + the barrel type-export block in `index.ts` | `../constants` → `../constants/types` (the structural move — see §3). |

Dead `ValueArray` type-import (present-but-unused in the old file) was dropped.

**Commands + exit codes** (all run in-worktree against the symlinked
`node_modules`):

```
npm run check:lib                    → exit 0
node scripts/proof-boundary.mjs      → PASS  (exit 0)
npm run build (tsc+vite+api-extract) → exit 0   dist/keyframes.d.ts = 203,647 B
node scripts/proof-published-surface → PASS  (exit 0)
node scripts/proof-decomposition.mjs → PASS  (exit 0)
npx vitest run <8 constants-importing test files> → 104 passed
```

**`git diff --stat HEAD -- src/animation`** (the new `constants/` dir is
untracked, not shown by diff):

```
 src/animation/constants.ts                        | 351 ----------------------
 src/animation/easing.ts                           |   2 +-
 src/animation/index.ts                            |   2 +-
 src/animation/orchestration/flip.ts               |   2 +-
 src/animation/orchestration/sequence/events.ts    |   2 +-
 src/animation/orchestration/sequence/sequence.ts  |   2 +-
 src/animation/orchestration/sequence/transport.ts |   2 +-
 src/animation/orchestration/stagger.ts            |   2 +-
 src/animation/orchestration/timeline/index.ts     |   2 +-
 src/animation/physics/morph.ts                    |   2 +-
 src/animation/physics/numeric.ts                  |   2 +-
 src/animation/physics/spring/timing-function.ts   |   2 +-
 12 files changed, 11 insertions(+), 362 deletions(-)
 + 3 new files: constants/{types,defaults,index}.ts (375 L total)
```

---

## 3. Findings (file:line evidence)

**F1 — types.ts is STRUCTURALLY value.js-runtime-free.** Confirmed
mechanically: `grep '^import ' constants/types.ts | grep -v 'import type'` →
**NONE**. Every value.js reference is an erased `import type` (`types.ts:8–14`).
Therefore *any* import from `constants/types` — type OR value — cannot pull
value.js. This is the structural guarantee the spec wants; it does not depend on
the importer using `import type`.

**F2 — the split alone is NOT enough; the light *importers* must be repointed.**
The critical nuance the spec's one-liner elides: carving the file while leaving
light modules importing the bare `../constants` **barrel** does **not** make it
structural — the barrel (`constants/index.ts`) re-exports `./defaults`, so it
still carries a runtime value.js edge, and `import { defaultOptions } from
"../constants"` in a light module would still leak. The structural win is
realized only by pointing light code at `../constants/types` directly. I did
this for all 10 light importers (`easing.ts:19`, `physics/{morph,numeric}.ts`,
`physics/spring/timing-function.ts`, `orchestration/{flip,stagger}.ts`,
`orchestration/sequence/{events,sequence,transport}.ts`,
`orchestration/timeline/index.ts`) + the LIGHT barrel type-export block
(`index.ts:134–148`). After: `grep 'from ".*constants"'` over `physics/ +
orchestration/ + easing.ts + index.ts` shows **every light importer uses
`/types`**; zero bare-barrel light importers remain.

**F3 — all 38 bare-`../constants` (barrel) importers are HEAVY zones.**
`compile/*, engine/*, group/*, ingest/*, presets/*, resolve/*, scroll/*, svg/*,
waapi/*` — verified by grep. None is light. So the barrel's runtime value.js
edge is reachable only from code that already imports value.js. `defaults.ts`
has exactly one importer path (the barrel) besides itself.

**F4 — `TimingFunctionNames = keyof typeof timingFunctions` survives the split
with a type-only import.** `import type { timingFunctions }` + `keyof typeof
timingFunctions` (a type-query on a type-only binding) compiles clean under
`verbatimModuleSyntax` (`check:lib` exit 0). This was the one subtle bit — the
`typeof` query does not force `timingFunctions` to be a runtime import.

**F5 — the d.ts roll-up is unaffected.** `dist/keyframes.d.ts` (203,647 B) still
resolves every constants type (175 `AnimationOptions|WeightStepper|BlendMode|
Easing` hits); `proof:published-surface` PASS (the public surface is byte-stable
— the split is internal file topology, invisible to consumers).

**F6 — the light *bundle* is provably clean post-split.** `dist/keyframes.js`:
`grep -c 'value.js\|@mkbabb/value'` → **0**; `grep -c
'COLOR_SPACE_RANGES\|easeInOutCubic\|defaultOptions'` → **0**. The value.js-bearing
consts land only in the heavy dynamic chunks. `proof:boundary` reports all 30
light source modules value.js-free, 0 dormant specifiers.

**F7 — no test churn.** The 8 test files importing `../src/animation/constants`
resolve through the barrel (`constants/index.ts`) unchanged (they pull
`defaultOptions` from defaults + types via one path); 104/104 pass. Zero test
edits required.

---

## 4. VERDICT — **confirms-spec** (with one sharpening)

The r3 split is feasible, low-cost, gate-clean, and delivers the structural
boundary the spec calls for. **CONFIRMS** the spec's intent.

**The sharpening the real wave must encode (F2):** the deliverable is *not*
"split the file" — it is "split the file **and repoint the ~10 light importers
to `constants/types`.**" A split that leaves light code importing the barrel
buys nothing: the seam still rests on `import type` discipline + `proof:boundary`
as sole guard. Spell the acceptance criterion as: *zero light-zone module
imports the bare `constants` barrel; every light constants import targets
`constants/types`; `constants/types.ts` has zero non-`import type` imports.* A
one-line `proof:boundary` extension can assert clause 3 mechanically
(grep `^import ` in `constants/types.ts`, reject any non-`type` line), turning
the structure into a *gated* structure — which is strictly stronger than
today's "no light module imports a value.js runtime symbol" whole-surface scan.

Secondary call for the wave to make (not blocking): keep the back-compat
**barrel** (zero heavy churn, mild footgun — a future light author could import
the barrel and re-lean on discipline) **vs.** repoint the 38 heavy importers to
`constants/defaults` + `constants/types` explicitly and delete the barrel
(kills the footgun, +38 one-line touches). This probe kept the barrel; the
footgun is contained by F1 + the proposed gate clause.

---

## 5. Implementation-cost estimate (real wave)

- **Files touched:** +3 new (`constants/{types,defaults,index}.ts`, ~375 L,
  mechanical carve of the existing 351 L), −1 (`constants.ts`), 11 one-line
  import repoints (10 light + the barrel type block). Optional barrel-kill
  variant: +38 heavy one-line repoints.
- **Gates affected:** `proof:boundary` — stays PASS; **should gain** one clause
  (types.ts runtime-import-free assertion) to bank the structural win.
  `proof:published-surface`, `proof:decomposition`, `check:lib`, `build`/d.ts —
  all PASS unchanged. No test edits (barrel preserves the `../constants`
  resolution).
- **Risk: LOW.** Pure internal file topology; public surface byte-stable;
  hot-path/runtime output byte-unchanged (value.js consts land in the same heavy
  chunks). The only care items: (1) confirm value.js still exports
  `COLOR_SPACE_RANGES`/`easeInOutCubic`/`timingFunctions` at the pin (it does —
  `node_modules/@mkbabb/value.js/dist/index.d.ts:12,29`); (2) drop the dead
  `ValueArray` import during the carve (or keep if `noUnusedLocals` stays off);
  (3) update the CLAUDE.md files that name `constants.ts` (root tree + module
  tree both cite it as a flat file).
