# a02-w1-zone-partition — Audit of R.W1 (the 7-zone partition)

**Lane:** a02-w1-zone-partition (Tranche-R deep audit, pass 1 of 32)
**Scope:** R.W1 — directory-ize the flat `src/animation/` tree into cohesive zones + per-zone `index.ts` barrels.
**Method:** SPEC (`docs/tranches/R/waves/R.W1.md`) vs SHIPPED (working tree on `tranche-s-dev`; master range `a15cd48..18e8617`) vs GESTALT (`src/animation/CLAUDE.md` map + root `CLAUDE.md` charter). Read-only.

---

## Executive summary

R.W1 is the **most honest wave in Tranche R**. The mechanical partition landed in full and landed *well*: every flat-hyphenated sibling is gone, all twelve directories carry a barrel, the LIGHT/HEAVY value.js boundary survived the move intact (physics/orchestration/internal are type-only on value.js — verified, `proof:boundary` gates it), and a per-file cohesion scan (§Finding-0) shows **zero mis-zoned files** — each file's stated purpose matches its zone charter. The zone *assignment* is correct. This is real structure, not cosmetic.

The residue Tranche S inherits is **not in the partition — it is in the partition's DOCUMENTATION and its GATE, which never caught up to the code it describes.** Three drifts, in descending severity:

1. **The library's canonical map lies.** `src/animation/CLAUDE.md` — the detailed per-file architecture map, and the exact artifact R.W1 §1 tells auditors to "compare against" — was **never regenerated post-partition** (last touched `ac40f72`, the Q/J era; empty in the R range). Its `## Files` block still documents `engine.ts`, `group.ts`, `waapi.ts`, `frame-compiler.ts`, `numeric.ts`, `spring.ts`, `animations.ts`, `utils.ts` as flat root files — **none of which exist.** For a wave whose entire deliverable was the partition, the primary map describing the pre-partition tree is the single largest honesty gap. (HIGH)

2. **One zone (`waapi/`) is invisible to both the charter and the born-RED gate**, and the "seven-zone" label is a mis-count (the tree is 12 directories). `proof:no-flat-siblings`' barrel-presence check omits `waapi/` AND `internal/` — deleting either barrel is not caught. (MEDIUM)

3. **The barrel policy is not principled** — it is a mix of `export *` and explicit-named across the twelve barrels with no stated rule, and **`resolve/index.ts` is not a barrel at all** — it is 289 lines of core recursion wearing a barrel's filename, the sole violator of the "barrel = single re-export surface" convention every other zone follows. (MEDIUM)

The root loose-file question the lane brief raises is, on inspection, **mostly a non-issue mis-framed as a spec gap** (§Finding-5): four of the five are legitimately cross-zone or boundary files. Only `adapter.ts` has a weak root justification and is a genuine S sub-zoning candidate.

---

## Finding 0 — Zone ASSIGNMENT is correct (no mis-zoned file). [INFO — positive]

A one-line-purpose scan of all 78 zoned files (evidence: cohesion scan, this session) shows every file sitting in the right zone:
- `physics/` — numeric/smooth/oscillator/decay/morph/playback + `spring/*`: all clock-driven steppers, all value.js-type-only. ✓
- `orchestration/` — stagger/flip + `drag/` `timeline/` `sequence/`: all temporal/multi-target helpers over the physics tier. ✓
- `engine/` `group/` `compile/` `resolve/` `ingest/` `scroll/` `svg/` `presets/` `waapi/`: each HEAVY file's purpose matches its charter (verified per-file).
- `internal/` — leaves/binarySearch/errors/reduced-motion/scheduler/scroll-phases/animation-id/group-factory: all value.js-free leaves. ✓ (`leaves.ts:28` re-exports from the grammar-free `@mkbabb/value.js/math` subpath — the boundary-clean seam, not a byte-duplicate.)

The LIGHT boundary held: `grep` for runtime `@mkbabb/value.js` edges in `physics/`, `orchestration/`, `internal/` returns **none**; the seven files that touch value.js at all do so `import type`-only. The partition did not leak value.js into the light bundle. **Credit where due: the mechanical move was executed cleanly.**

---

## Finding 1 — `src/animation/CLAUDE.md` is stale: the canonical map documents the deleted flat tree. [HIGH]

**Evidence:**
- `git log a15cd48..18e8617 -- src/animation/CLAUDE.md` → **empty** (never touched in the R range).
- Last commit touching it: `ac40f72` (Q.WA1-WA4 — pre-R).
- `src/animation/CLAUDE.md:37-66` `## Files` block lists flat files that no longer exist: `engine.ts` (:42), `frame-compiler.ts` (:43), `group.ts` (:44), `waapi.ts` (:45), `numeric.ts` (:50), `spring.ts` (:52), `animations.ts` (:64), `utils.ts` (:66).
- Class docs still anchor to deleted files: `### Animation … (engine.ts)` (:78), `(group.ts)` (:94), `## WAAPI Eligibility (waapi.ts)` (:206), the dependency ledger (:265) cites `engine.ts, frame-compiler.ts, group.ts, animations.ts, format.ts, utils.ts, waapi.ts` as static-import homes.

**Why it matters:** R.W1 §1 explicitly instructs "compare against the `src/animation/CLAUDE.md` map." That map is the *pre-partition* map. The one document a reader (human or agent) opens to understand the library's shape describes a tree that the wave's own deliverable deleted. R.W8 refreshed `demo/CLAUDE.md` (commit `5a5f7db`) and the root `CLAUDE.md` was rewritten for zones — but the *library's own* detailed map was left behind. For a refactor whose whole thesis is "the partition is real structure," an un-regenerated structure map is the strongest counter-evidence a skeptic could cite.

**Proposal (S):** Regenerate `src/animation/CLAUDE.md` from the shipped tree in a dedicated wave — `## Files` becomes the zone layout; the per-class sections re-anchor to `engine/animation.ts`, `engine/css-animation.ts`, `group/group.ts`, `waapi/*`. Consider a born-RED gate `proof:library-map-current` that greps `src/animation/CLAUDE.md` for backtick-quoted `*.ts` filenames and asserts each resolves to an existing path (the same shape as the existing doc-path gates).

---

## Finding 2 — `waapi/` is a first-class zone absent from BOTH the charter and the barrel gate; "seven-zone" is a mis-count. [MEDIUM]

**Evidence:**
- Root `CLAUDE.md:20-23`: "partitioned into **seven** cohesive zone directories … the LIGHT zones (`physics/`, `orchestration/`) and the HEAVY zones (`engine/`, `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/`) + `presets/` + `svg/`." — `waapi/` is **not enumerated**; `internal/` appears only later in the tree (`:48`). The parenthetical alone lists 8, plus presets+svg = 10; the actual tree is **12** top-level dirs.
- `scripts/proof-no-flat-siblings.mjs:62-71` `ZONE_DIRS` (the barrel-presence assertion) = `physics, orchestration, engine, group, compile, resolve, ingest, scroll, presets, svg` — **omits `waapi/` and `internal/`.** Both directories *have* an `index.ts` (verified) but their barrel presence is **ungated**: deleting `waapi/index.ts` or `internal/index.ts` passes CI.
- Root `CLAUDE.md:104` still references `waapi.ts` (the deleted flat filename) in the WAAPI-eligibility note.

**Why it matters:** `waapi/` is a 6-file HEAVY zone (`eligibility/emission/options/delegation/densify/index`) — as much a zone as `ingest/` or `scroll/`. Its omission from the charter means the taxonomy a reader learns is incomplete, and its omission from the gate means the born-RED protection R.W1 §3.2 promised ("every introduced zone directory contains an `index.ts` barrel") is not actually enforced for two of the twelve.

**Proposal (S):** (a) Fix the charter count and add `waapi/` to the enumeration. (b) Add `waapi` and `internal` to `ZONE_DIRS` in `proof-no-flat-siblings.mjs`. (c) Retire the "7-zone" name — it never matched the count; call it what it is (the zone partition, ~12 directories).

---

## Finding 3 — `resolve/index.ts` is not a barrel: 289 lines of core recursion in a re-export slot. [MEDIUM]

**Evidence:** `src/animation/resolve/index.ts` is **289 lines** (vs physics 25L, orchestration 15L, ingest 20L, svg 12L barrels). It holds live implementation: `springCssToOptions`, `resolveSpringTiming`, `resolveNode` (the recursive rewriter), `resolveValues`, `hasResolvableValue`, `hasPhase2Node`, `MAX_RESOLVE_DEPTH`, `SPRING_DEFAULTS` — the Phase-1 core recursion — *plus* re-exports of `./env`, `./resolve-if`, `./resolve-function`. Its own header admits it: "resolve/ — the emerging-CSS lowering pass … **barrel = the core recursion**."

**Why it matters:** Every other zone barrel is a thin re-export surface (the stated convention: "the barrel is the zone's single surface"). `resolve/` is the lone exception — the sub-concerns (`env`, `resolve-if`, `resolve-function`) were carved out (R.W2b) but the *core* was left in `index.ts` rather than a peer file. This means the zone's largest logic module has no name of its own, cannot be imported without importing the whole barrel, and breaks the uniformity a reader relies on ("open `index.ts` to see the surface, not the guts").

**Proposal (S):** Extract the core recursion to `resolve/resolve-values.ts` (or `resolve/core.ts`) and reduce `index.ts` to a thin re-export like its siblings. This is a clean, self-contained S sub-zoning win and aligns `resolve/` with the barrel convention.

---

## Finding 4 — Barrel re-export policy is unstated and mixed (`export *` vs explicit-named). [MEDIUM]

**Evidence:**
- `export *` (whole-module, silent-forwarding): `orchestration/index.ts` (`* from ./drag`, `./timeline`, `./sequence`), `presets/index.ts` (`* from ./classic`, `./spring`, `./taxonomy`), `physics/index.ts:` (`* from ./spring`), `internal/index.ts` (all 8).
- Explicit-named + `export type`: `engine/`, `group/`, `compile/`, `ingest/`, `scroll/`, `svg/`, `waapi/`, and most of `physics/`.

There is **no stated rule** for which barrel uses which form. `export *` on a *public* surface (`orchestration`, `presets`) is the riskier choice: any future or accidental `export const` in a member file silently joins the public namespace with no barrel-level review. The explicit-named barrels (engine, compile, …) are the safer, reviewable form. The wave shipped both idioms side-by-side.

**Why it matters:** A partition's barrels *are* the API contract of each zone. A mixed, unstated policy means "what does this zone export?" has two different answers depending on which barrel style it happened to get. It also interacts with Finding 3 (resolve's non-barrel) — three different barrel shapes across twelve zones.

**Proposal (S):** Pick one policy and gate it. Recommended: **explicit-named + `export type` for every public zone barrel** (the reviewable form); reserve `export *` for `internal/` only (genuinely internal, churn-tolerant). A lint/gate can assert no public zone barrel uses `export *`.

---

## Finding 5 — Root loose-file membership is under-specified, but only `adapter.ts` is a real gap. [LOW]

The lane brief asks why `adapter.ts`, `animate.ts`, `easing.ts`, `validate.ts`, `constants.ts` are unzoned and whether that is a spec gap. On inspection:

- **Not a scope violation.** R.W1 §1 scoped the wave to "flat-**hyphenated-sibling** files." These five are single-concern, non-hyphenated files, correctly out of R.W1's mechanical scope.
- **Four have legitimate root justification:**
  - `constants.ts` (351L) — shared types + defaults imported cross-zone; no single-zone home. Root is correct.
  - `easing.ts` (97L) — the LIGHT/HEAVY boundary ergonomics (the ONE dynamic `import("./engine")` edge from the light side). Sits *at* the boundary alongside `index.ts`/`load-engine.ts`. Root defensible.
  - `animate.ts` (213L) + `validate.ts` (242L) — HEAVY cross-zone *facade verbs* (each joins engine + compile + waapi). No single zone owns them.
- **`adapter.ts` (329L) is the weak one.** It is a single cohesive concern (`resolveKeyframes`: input → `ResolvedKeyframes`) that imports `./resolve` and feeds `compile/`. It is root only because `engine/index.ts:` re-exports it (`from "../adapter"`). It could as naturally be `compile/adapter.ts` or a new `api/` facade zone.

**The actual spec gap:** the charter names *only* `index.ts` + `load-engine.ts` as "the two boundary files" (root `CLAUDE.md:24`) but **five more files sit at root with no stated membership rule.** The partition has no articulated "what stays root" policy.

**Proposal (S):** State the root policy explicitly (e.g. "root holds: the two boundary files + shared `constants.ts` + the HEAVY facade verbs `animate`/`validate` + the boundary-ergonomics `easing`"). Separately, evaluate folding `adapter.ts` into `compile/` or grouping `animate.ts`+`validate.ts` (+ future ingest/compile verbs) into an `api/`/`facade/` zone — the one place the partition could go one level deeper on the root files.

---

## Finding 6 — `group/index.ts` barrel has an import-time side effect (the only barrel that mutates global state on load). [LOW]

**Evidence:** `src/animation/group/index.ts` calls `registerGroupFactory(...)` at module top-level — arming the DI seam that lets `KeyframesAnimation.group()` build a group without a static engine→group edge (the R.W2c no-cycle break). It is the only barrel with executable side effects; the other eleven are pure re-exports (modulo `resolve`'s logic).

**Assessment:** Deliberate and correct — the barrel is the zone's composition point, and loading it (which `loadAnimationEngine()` does) arms the seam before any `.group()` call. But it means the mental model "a zone barrel is a pure re-export index" is not universally true. Worth a one-line note in the charter so a future reader doesn't "clean up" the side effect.

**Proposal (S):** Document `group/index.ts` as the one intentional side-effecting barrel (DI registration) in whatever root-policy note Finding 5 produces.

---

## Finding 7 — `proof:no-flat-siblings` regression coverage is narrower than R.W1 §3.1 specified. [LOW]

**Evidence:** `scripts/proof-no-flat-siblings.mjs:48-55` FAMILY list = `engine, group, spring, compile, waapi, frame-compiler, ingest, scroll, sequence`. R.W1 §3.1 explicitly required the assertion to cover `drag-2d.ts` and `animations.ts` as well ("none of … `drag-2d.ts`, `animations.ts` survive"). Neither `drag`/`animations` — nor `resolve`, `presets`, `timeline`, `morph` — is in the shipped FAMILY list.

**Why it matters:** A regression that re-introduced `animations.ts` or `drag-2d.ts` at the root (exactly the flat-sibling pattern the wave exists to prevent) would **pass** the gate. The born-RED gate under-covers the very files R.W1 named.

**Proposal (S):** Extend FAMILY to include `drag`, `animations`, `resolve`, `presets`, `timeline`, `morph` (or better: assert *no* `src/animation/<base>-<suffix>.ts` exists for any base that is now a directory, deriving the base set from the directory listing rather than a hand-maintained array).

---

## Tranche-S implications (wave-shaped)

1. **S.Wx — Regenerate `src/animation/CLAUDE.md` (Finding 1).** Rewrite the `## Files` block + per-class anchors from the shipped tree; add `proof:library-map-current` (grep backtick-quoted `*.ts` names → assert path exists). *Highest-value, lowest-risk.* Pair with fixing root `CLAUDE.md:20-23` count + the `:104` stale `waapi.ts` reference.

2. **S.Wx — Close the gate/charter zone-coverage gaps (Findings 2, 7).** Add `waapi` + `internal` to `ZONE_DIRS`; derive the flat-sibling FAMILY set from the directory listing so it can never drift; retire the "7-zone" label for the honest count.

3. **S.Wx — Thin the `resolve/` barrel + unify barrel policy (Findings 3, 4).** Extract `resolve/resolve-values.ts`; reduce `resolve/index.ts` to a thin re-export; adopt "explicit-named public barrels, `export *` internal-only" and gate it. This is the concrete "deeper sub-zoning of library zones" S already targets — `resolve/` is the ripest.

4. **S.Wx — Articulate + optionally act on the root-file policy (Findings 5, 6).** State the "what stays root" rule; document `group/index.ts`'s intentional side effect; evaluate `adapter.ts → compile/` and an `api/`/`facade/` home for `animate`+`validate`. Low urgency — the current root set is defensible; this is polish, not debt.

**Method note for the owner:** R.W1 is the counter-example to the "cosmetic close" pattern the memory flags for Q — the *code* partition was honest and correct. What rotted is the **documentation and gate coupling**: the wave changed the tree but left the map and under-built the born-RED gate. The generalizable lesson for the tranche method: **a structural wave must treat its own architecture map and its born-RED gate's coverage set as first-class deliverables, gated, not prose** — otherwise the structure is real but un-navigable and under-protected, which reads as cosmetic even when it is not.
