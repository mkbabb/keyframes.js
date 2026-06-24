# Tranche R Audit — Lane: retro-readme-docs

Auditor: Claude Code (Sonnet 4.6)
Date: 2026-06-24
Scope: README.md (928L), CHANGELOG.md (586L), docs/*, root deletion verdicts

---

## 1. Root deletions — verdict per file

### 1a. `CLAUDE.md` — **LOAD-BEARING. Deletion is a regression.**

`CLAUDE.md` (112L) held the project's canonical build cheatsheet AND the project-tree
narrative that the README's own "Project Structure" section copies from it. More
critically, it was the AI-agent context document: Claude Code reads `CLAUDE.md` from
the repo root as working context for every future session. Deleting it means:

- Future agent sessions start with zero repo-specific context (no build commands,
  no tree overview, no boundary explanation, no convention list).
- The README §Project Structure now points to `src/animation/CLAUDE.md` (`README.md:92`)
  and `demo/CLAUDE.md` (`README.md:118`) — those still exist, but the root context
  document is gone.

**Proposal (R):** restore `CLAUDE.md` at root OR merge its build/conventions content
into `CONTRIBUTING.md` and keep the AI-context portion. Given `CONTRIBUTING.md` is
also deleted (see below), the simplest fix is: restore `CLAUDE.md` from git history
(`git show HEAD:CLAUDE.md`). Its content is still authoritative — it names the
`src/animation/CLAUDE.md` and `demo/CLAUDE.md` sub-docs correctly.

---

### 1b. `CONTRIBUTING.md` — **JUNK. Endorses deletion.**

`CONTRIBUTING.md` (55L) was a thin wrapper around:
- the `npm run dev/build/check/test` cheatsheet (already in README §Build, already in
  CLAUDE.md),
- the `changeset` workflow (a one-paragraph prose summary of standard changeset
  tooling — any contributor can read the changeset docs),
- a pointer to glass-ui's `cross-repo-dev-iteration.md` (an external document that
  may drift).

Nothing in it was load-bearing that is not already in the README or CLAUDE.md. The
README's `## Contributing` section (`README.md:910`) already links to it and can be
trimmed to a two-sentence note instead.

**Proposal (R):** the deletion stands. Remove the dead `README.md:910–913` link block
(`See [CONTRIBUTING.md](./CONTRIBUTING.md)…`).

---

### 1c. `llms.txt` / `llms-full.txt` — **SEMI-LOAD-BEARING. Problematic deletion.**

Both files were **generated** artifacts — `gen:agent-surface` produces them from
`docs/published-surface.md` + the proof:* gate roster. Two CI gates depend on them:

- `proof:agent-surface` (`scripts/proof-agent-surface.mjs`) — clause (a.1) asserts
  `ls llms.txt` succeeds. With both files deleted from the working tree,
  `proof:agent-surface` will RED. This is a real CI gate that rides
  `proof:hygiene-chain` (which rides `proof:all`).
- `README.md:881` links to `./llms.txt` — a dead link in the deployed README.

The files themselves are generated artifacts (run `node scripts/gen-agent-surface.mjs`
to regenerate). The content is not a human maintenance burden. The user likely deleted
them because they are machine-generated and not "real" docs. That instinct is
**correct for the working tree** — they should be generated outputs, not committed
artifacts. The deeper issue is that the CI gate hard-asserts file existence in the
working tree rather than generating them as a build step.

**Proposal (R):** do NOT commit the deletion. Either:
  - (preferred) regenerate via `node scripts/gen-agent-surface.mjs` and re-add,
  - or reclassify `proof:agent-surface` to generate-then-assert (remove the file
    from git, generate in CI before the gate runs, add to `.gitignore`).
  
The README `## Ecosystem & agents` section must either keep the link (and the files
must be tracked) or be rewritten to not link to generated files directly.

---

### 1d. `.dependency-cruiser.cjs` — **LOAD-BEARING. The `lint` and `proof:lint-clean` gates are broken.**

This file is the config for the `depcruise src --ignore-known` command wired to
`npm run lint` and (transitively) to `proof:lint-clean`.

`proof:lint-clean` (`scripts/proof-lint-clean.mjs`) clause (a) explicitly asserts:
> `.dependency-cruiser.cjs` exists + `npm run lint` exits 0 on the clean tree

Without the config file, `npm run lint` will fail immediately (depcruise cannot find
its config), and `proof:lint-clean` will RED.

`proof:lint-clean` rides `proof:hygiene-chain` which rides `proof:all`. The entire
hygiene gate chain is broken by this deletion.

The content of `.dependency-cruiser.cjs` defined three source-graph lint rules:
1. `no-cycle` — no circular deps in `src/animation/`
2. `leaf-no-engine-no-valuejs` — `internal/` leaves may not reach engine or value.js
3. `light-barrel-no-engine` — LIGHT named-export modules may not statically reach engine

These rules were the source-graph lint floor (Q.WA1), the counterpart to the
runtime-bundle `proof:boundary` gate. Without them, circular imports and boundary
violations pass `tsc --noEmit` silently until the bundle stage.

**Proposal (R):** restore `.dependency-cruiser.cjs` immediately from
`git show HEAD:.dependency-cruiser.cjs`. This is not optional — it is wired into CI.

---

### 1e. `.dependency-cruiser-known-violations.json` — **LOAD-BEARING. Part of the lint gate.**

This file holds 15 pre-existing `no-cycle` violations (all between Q-era hyphenated
sibling files: `drag-2d.ts↔drag.ts`, `engine.ts↔engine-playback.ts`,
`group.ts↔group-soa.ts`, `group.ts↔group-layer-springs.ts`, etc.). It is the
`--ignore-known` input to `npm run lint`.

Without it, the `depcruise src --ignore-known` command fails (no baseline file to
diff against) OR reports all 15 known violations as new errors. This directly breaks
`proof:lint-clean`.

These 15 violations are the **evidence trail** for the decomposition problem the
other audit lanes (lib-engine.md et al.) are flagging. They expose that Q's "split"
into hyphenated siblings created circular dependencies rather than clean sub-modules.
The violations file was the workaround for not fixing the underlying structure.

**Proposal (R):** restore the file from `git show HEAD:.dependency-cruiser-known-violations.json`.
Then, as part of R's decomposition work (when cycles are fixed by moving to real
sub-module directories), eliminate the known-violations entries one by one. The goal
is a known-violations file with zero entries (or deleted entirely, with `--ignore-known`
flag also removed from the lint script).

---

### 1f. `src/animation/CLAUDE.md` — **LOAD-BEARING. README links to it.**

`README.md:92` says `# THE library — engine + every primitive (see src/animation/CLAUDE.md)`.
The file is deleted from the working tree but still referenced. It held a
comprehensive file-by-file breakdown of `src/animation/` (including the
`## The value.js static/dynamic boundary` section and the `## Classes` inventory).

`demo/CLAUDE.md` (`demo/CLAUDE.md` — still exists) is the counterpart for the demo.

**Proposal (R):** restore `src/animation/CLAUDE.md` from `git show HEAD:src/animation/CLAUDE.md`.
The content is authoritative — it accurately describes the current file layout
(including Q-era additions). Alternatively, absorb it into a `src/animation/README.md`
if the CLAUDE.md convention is being retired.

---

## 2. README.md (928L) — bloat audit

### 2a. Stale source paths — critical

The README teaches paths that do not exist in the current codebase:

| README line | Path referenced | Actual status |
|---|---|---|
| 173 | `src/easing.ts` | Does not exist; file is `src/animation/easing.ts` |
| 188 | `src/math.ts` | Does not exist; math is in `@mkbabb/value.js` |
| 341 | `src/parsing/keyframes.ts` | Does not exist; no `src/parsing/` directory |
| 361 | `src/units/` directory | Does not exist |
| 361 | `src/parsing/units.ts` | Does not exist |
| 422 | `format.ts` is `keyframes.ts` in reverse | Both paths are wrong; actual files are `src/animation/format.ts` |
| 188 | `timing-functions` demo | No `demo/timing-functions/` directory exists |

These are regressions from the pre-value.js-externalization era. The CSS parser
now lives in `@mkbabb/value.js` — there is no `src/parsing/` tree, no `src/units/`.

**Proposal (R):**
- Lines 173–195 (Bezier/easing internals section): remove the `src/easing.ts` and
  `src/math.ts` links. Point to `@mkbabb/value.js` docs or remove the implementation
  detail (consumers don't need to know `cubicBezier` is in `math.ts`).
- Lines 341–373 (`## CSSKeyframesAnimation → ### Parsing CSS keyframes`): the "parser
  uses `@mkbabb/parse-that`" sentence is correct; remove the stale `src/parsing/` path
  links. The `### Units` subsection (lines 356–373) is obsolete — it describes the old
  in-repo units system. The units are now in `@mkbabb/value.js`.

---

### 2b. Stale class name at README:232–233

```
The classes above — `Animation`, `CSSKeyframesAnimation`, `AnimationGroup` — are
the **heavy** tier…
```

`Animation` was renamed to `KeyframesAnimation` in 5.0.0. This sentence is stale.

**Proposal (R):** `Animation` → `KeyframesAnimation` at line 232.

---

### 2c. `formerly Animation` survival note at README:136

```
The `KeyframesAnimation` object (formerly `Animation`, renamed in 5.0.0 —
see `docs/MIGRATION-5.0.0.md`) drives `CSSKeyframesAnimation` and `AnimationGroup`.
```

This is the correct canonical name mention but the `formerly` parenthetical is a
legacy reference that serves no purpose once the migration guide (`docs/MIGRATION-5.0.0.md`)
is the authoritative source. After R's one-major window, the 5.0.0 migration note
can be dropped from the README body.

**Proposal (R):** remove the `(formerly \`Animation\`, renamed in 5.0.0 — see \`docs/MIGRATION-5.0.0.md\`)` 
parenthetical from line 136. Keep `docs/MIGRATION-5.0.0.md` — it is a versioned
migration document that should persist.

---

### 2d. Project Structure section — severely outdated (README:88–132)

The "Project Structure" section lists 22 source files but the actual `src/animation/`
directory has **23 additional files** not listed:

```
compile-color.ts, compile.ts, drag-2d.ts, engine-composition.ts,
engine-css-metadata.ts, engine-options.ts, engine-playback.ts,
frame-compiler-numeric.ts, group-layer-springs.ts, group-soa.ts,
ingest-cssom.ts, ingest.ts, load-engine.ts, morph-svg.ts, oscillator.ts,
resolve-values.ts, scroll-grammar.ts, scroll-scene.ts, sequence-events.ts,
spring-duration.ts, spring-reseat.ts, validate.ts, waapi-densify.ts
```

These are Q-era additions (the ingest, compile, scroll, engine-split, and SoA
files) that represent the most significant post-K surface area. The README structure
section is presenting a pre-K snapshot to the reader.

Additionally, the section references `src/animation/CLAUDE.md` (deleted) and
`demo/CLAUDE.md` (still exists but is an internal AI document, not a public README link).

**Proposal (R):** the Project Structure section is inherently a maintenance liability
— it duplicates `CLAUDE.md` badly. Two options:
  1. Replace it with a single pointer: `See [src/animation/CLAUDE.md](src/animation/CLAUDE.md)
     for the authoritative file inventory.`
  2. Keep a minimal 10-line tree covering only the top-level layout (src/, demo/,
     test/, bench/, scripts/, docs/) without per-file enumeration.

Do NOT attempt to list all 45+ files — that's CLAUDE.md's job.

---

### 2e. CSSCubicBezier reference — internal value.js symbol in public README

README lines 190–194:
```ts
const easeInBounce = (t: number) => CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
```

`CSSCubicBezier` is imported from `@mkbabb/value.js` in `src/animation/utils.ts`
and `src/animation/animations.ts`. It is NOT exported from `@mkbabb/keyframes.js`.
This code snippet teaches using a value.js internal directly — it is not a keyframes.js
API. The `proof:readme-runs` gate does NOT tag this snippet as `ts run` (it's not
in the `ts run`-marked sections), but it remains a misleading example.

**Proposal (R):** remove or replace this snippet. If a Bezier easing example is
needed, use `springTimingFunction` or `resolveEasing("easeInBounce")` — actual
published APIs.

---

### 2f. `## Ecosystem & agents` section — dead links (README:879–882)

This section links to `./llms.txt` and the implied `./llms-full.txt`, both of which
are deleted from the working tree (see §1c). If the files are restored/regenerated,
this section is fine. If they are reclassified as build artifacts, the section should
be rewritten to describe how to generate them.

---

### 2g. `## Contributing` section — links to deleted CONTRIBUTING.md (README:910–913)

```
See [CONTRIBUTING.md](./CONTRIBUTING.md). The README shape follows the perimeter-level
[canonical README shape](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/canonical-readme-shape.md).
```

`CONTRIBUTING.md` is deleted. The glass-ui perimeter link is an external dependency
that may drift.

**Proposal (R):** replace with an inline two-sentence contribution note, or fold the
contributing info into a collapsed `<details>` block. Remove the external glass-ui
link from the published README.

---

### 2h. README is 928 lines — what to cut

The README is a reference document masquerading as an API doc. At 928 lines with a
full Table of Contents, it is longer than most of the source files it describes.
Sections to cut or slim:

| Section | Lines (approx) | Verdict |
|---|---|---|
| §Quick Start | 8–39 | Keep — good |
| §Table of Contents | 40–79 | Keep |
| §Installation | 80–87 | Keep |
| **§Project Structure** | **88–132** | **CUT to 10-line top-level tree** |
| §Animation / §AnimationOptions | 134–168 | Keep — good reference |
| **§The timing function → §Bezier curves** | **169–196** | **Slim: remove stale src/ paths, remove CSSCubicBezier example** |
| §TemplateAnimationFrame / §Reification / §Variable resolution | 197–230 | Keep |
| **§loadAnimationEngine (middle)** | **232** | **Fix stale `Animation` name** |
| §animate / §MotionPath / §DrawSVG / §MorphSVG | 249–320 | Keep |
| **§CSSKeyframesAnimation → §Parsing** | **320–373** | **Remove stale src/parsing paths; slim or delete §Units** |
| §AnimationGroup | 375–396 | Keep |
| §Presets | 397–415 | Keep |
| §The round-trip | 416–523 | Keep — this is the moat |
| §Web Animations API | 524–552 | Keep |
| §Baseline/tree-shaking | 530–552 | Keep |
| §Beyond CSS intro | 553–561 | Keep |
| §NumericAnimation through §Sequence | 563–878 | Keep — these are CI-asserted |
| **§Ecosystem & agents** | **879–882** | **Fix dead llms.txt link** |
| §Build & Development | 883–909 | Keep — add make ci-linux |
| **§Contributing** | **910–913** | **Fix dead CONTRIBUTING.md link** |
| §License + §Sources | 915–929 | Keep |

Net reduction estimate: removing/slimming the stale §Project Structure, §Parsing,
§Units, §Bezier internals, and dead-link sections would bring the README from
928L to approximately 720–750L without losing any consumer-relevant content.

---

## 3. CHANGELOG.md (586L) — audit

### 3a. Tranche-journal language is not a user-facing CHANGELOG

The CHANGELOG entries for 4.0.0 through 4.3.0 are written in the internal tranche
planning vocabulary: "Tranche D — the demo refined, the engine transposed to its
gestalt, the deferrals terminated", "Band I (product-truth + the live-audit F1–F6)",
"W4", "G.W5", "K.W12 ED-1", etc. A consumer scanning for breaking changes or new
APIs cannot decode this.

By contrast, the 5.0.0 entry is crisp (15 lines), clear, and uses only public API
names. That is the correct model.

Section sizes (lines):
- `## 5.0.0`: 15 lines
- `## 4.3.0`: 45 lines
- `## 4.2.0`: 76 lines
- `## 4.1.0`: 56 lines (tranche G internal-speak heavy)
- `## 4.0.0`: 130 lines (two entries, B+C+D tranche stacks)
- `## 3.0.0`: 18 lines
- `## v2.2.0` through `## v2.0.0`: 148 lines

The `## 4.0.0` entry runs 130 lines and is essentially a wave-charter transcript,
not a changelog. It describes per-wave internals ("the `%%HasFastProperties` V8 fast
properties mode"), tranche acronyms ("G.W5 sub-wave A"), and internal release
mechanics ("the publish leg is user-domain, confirm-first at J.WZ") that are
irrelevant to a consumer upgrading from 3.x to 4.x.

### 3b. Proposal for CHANGELOG shape in R

**Keep** the 5.0.0 entry verbatim — it is the right shape.

**Keep** historical entries (pre-5.0.0) for archival context but accept them as
they are — retroactively rewriting them would be a cosmetic churn with no value.

**For future entries (5.x.x and beyond)**, enforce the format 5.0.0 uses:
- Lead with the consumer-visible breaking changes and additions
- No internal wave codes (W\d+, Band X, Tranche Y) in the consumer-facing entry
- Keep internal planning language in `docs/tranches/` where it belongs

**R does not need to rewrite the historical entries.** The effort/value ratio is
wrong. Document this convention going forward.

---

## 4. docs/* — audit

### 4a. `docs/MIGRATION-5.0.0.md` — **Keep. Well-scoped.**

77 lines. Precisely documents the 5.0.0 breaking rename (`Animation` → `KeyframesAnimation`,
`ScrollTimeline` → `KeyframesScrollTimeline`). Includes the disambiguation warning
about `globalThis.ScrollTimeline`. This is the correct shape for a migration doc —
specific, versioned, finite. It should persist in docs/ for at least one major version.

### 4b. `docs/published-surface.md` — **Keep. Machine-checked.**

214 lines. This is the machine-checked manifest for `proof:published-surface`. It is
load-bearing CI infrastructure, not narrative documentation. The `proof:published-surface`
gate's clause (b) asserts against this file. Do not delete or slim.

### 4c. `docs/scroll-morph.md` — **Keep. Architecture guide.**

115 lines. An architecture guide for building scroll-driven morph animations using
the `ScrollTimeline` + `ElementMorph` pipeline. References real public APIs. This is
a legitimate docs artifact.

### 4d. `docs/color-fidelity.md` — **Keep. Companion to proof:color-fidelity.**

53 lines. Explains the ΔE conformance methodology and the `color-fidelity-data.json`
artifact. Load-bearing for understanding the `proof:color-fidelity` gate output.

### 4e. `docs/dogfood-inversion.md` — **Keep (narrowly). Architectural reference.**

107 lines. Documents the dogfood-inversion pattern (the demo as the library's own
first consumer). Relevant to architectural decisions. May be merged into CLAUDE.md
or trimmed in R if it is only referenced by internal planning docs.

### 4f. `docs/tranches/` — **Internal planning. Not part of the user-facing docs surface.**

The `docs/tranches/` tree is the audit/planning archive. It is not linked from the
README. It should not be. It is an internal project governance structure — appropriate
to keep in the repo as a historical record, but not part of the user-facing docs.

---

## 5. Proposed R docs surface

The R-landing docs surface should be:

```
README.md              # 720–750L (slimmed from 928L per §2h)
CHANGELOG.md           # keep; enforce 5.0.0-format going forward
CLAUDE.md              # RESTORE from git — AI agent context document
src/animation/CLAUDE.md  # RESTORE from git — source-tree inventory
demo/CLAUDE.md         # EXISTS — keep
docs/
├── MIGRATION-5.0.0.md    # keep
├── published-surface.md  # keep (CI-load-bearing)
├── scroll-morph.md       # keep
├── color-fidelity.md     # keep
├── dogfood-inversion.md  # keep (review for merge in R)
└── tranches/             # internal; keep as archive
```

Files to NOT restore (correctly deleted):
- `CONTRIBUTING.md` — junk (trim the README §Contributing link instead)
- `llms.txt` / `llms-full.txt` — generated; regenerate or reclassify as build artifacts

Files that MUST be restored before CI is green:
- `.dependency-cruiser.cjs` — wired into `npm run lint` and `proof:lint-clean`
- `.dependency-cruiser-known-violations.json` — `--ignore-known` baseline for lint

---

## 6. Summary table

| Deleted file | Verdict | Action |
|---|---|---|
| `CLAUDE.md` | Load-bearing | Restore from git |
| `CONTRIBUTING.md` | Junk | Deletion stands; remove README link |
| `llms.txt` | Semi-load-bearing | Regenerate OR reclassify as build artifact |
| `llms-full.txt` | Semi-load-bearing | Regenerate OR reclassify as build artifact |
| `.dependency-cruiser.cjs` | Load-bearing (CI broken) | Restore from git immediately |
| `.dependency-cruiser-known-violations.json` | Load-bearing (CI broken) | Restore from git; then eliminate entries as R fixes cycles |
| `src/animation/CLAUDE.md` | Load-bearing | Restore from git |
