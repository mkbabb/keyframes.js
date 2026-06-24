# R.W7 — Docs surface (README slim · CHANGELOG convention · llms reclassify)

**Band:** E — docs + close  
**Phase:** IMPL (opens on authorization; file-disjoint from R.W1–R.W6, parallelizable)  
**DAG position:** Parallel with the library and demo waves; no source-file overlap. The Quick Start
edit here PAIRS with R.W4 (R.W4 re-writes the Quick Start with a correct import + tags it `ts run`
— this wave's gate asserts the paths; both must land before `proof:readme-paths-live` is green).
If R.W4 ships first, the Quick Start fix is already done; this wave skips §2.1 for that block.

---

## 1. Scope

README.md is 928 lines (`wc -l README.md` at HEAD). It contains stale source paths (`src/easing.ts`,
`src/parsing/keyframes.ts`, `src/units/`, `src/math.ts` — none exist post-value.js-externalization,
`audit/retro-readme-docs.md §2a` lines 152–165), a stale class name (`Animation` at `README.md:232`
— renamed `KeyframesAnimation` in 5.0.0, `audit §2b:177–187`), a `(formerly Animation)` parenthetical
at `README.md:136` that belongs in the migration guide alone (`audit §2c:192–203`), a Project
Structure enumeration showing a pre-K snapshot of 22 files when the directory now holds 45+
(`audit §2d:208–236`), a `CSSCubicBezier` snippet that teaches a value.js internal not exported from
this package (`audit §2e:241–255`), and dead links to the deleted `CONTRIBUTING.md` and the deleted
`llms.txt`/`llms-full.txt` (`audit §2f–§2g:259–280`).

The CHANGELOG 5.0.0 entry is the correct shape — crisp, consumer-facing, no tranche codes. Historical
entries (4.x) carry internal tranche-journal prose that cannot be decoded by a consumer, but
retroactively rewriting history has the wrong effort/value ratio (`audit §3b:349–361`).

`llms.txt`/`llms-full.txt` are generated artifacts (`scripts/gen-agent-surface.mjs`). They are
currently deleted from the working tree and absent from `.gitignore`. `proof:agent-surface` clause
(a.1) asserts `ls llms.txt` succeeds and reds without the files (`audit §1c:51–76`). The correct fix
is to classify them as build outputs: add to `.gitignore` + generate-then-assert in CI before the
gate runs.

This wave: slim the README from 928 → ~720 lines by cutting the six stale/dead sections (§2.1–§2.6);
enforce the 5.0.0-format CHANGELOG convention GOING FORWARD (one annotated comment, no retroactive
rewrite); reclassify `llms*.txt` as build artifacts (§2.7); confirm the `docs/*` keep list.

---

## 2. Concrete work

### 2.1 — Fix stale class name at README:232

**Evidence:** `audit/retro-readme-docs.md §2b:177–187` — `README.md:232` reads:

```
The classes above — `Animation`, `CSSKeyframesAnimation`, `AnimationGroup` — are
the **heavy** tier…
```

`Animation` was renamed `KeyframesAnimation` in 5.0.0.

**EDIT** `README.md:232`: `Animation` → `KeyframesAnimation`.

Before:
```
The classes above — `Animation`, `CSSKeyframesAnimation`, `AnimationGroup` — are
the **heavy** tier…
```

After:
```
The classes above — `KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup` — are
the **heavy** tier…
```

---

### 2.2 — Remove the `(formerly Animation)` parenthetical at README:136

**Evidence:** `audit/retro-readme-docs.md §2c:192–203` — `README.md:136`:

```
The `KeyframesAnimation` object (formerly `Animation`, renamed in 5.0.0 —
see `docs/MIGRATION-5.0.0.md`) drives `CSSKeyframesAnimation` and `AnimationGroup`.
```

The parenthetical is a migration remnant; the migration guide (`docs/MIGRATION-5.0.0.md`) is the
authoritative source. Post-5.0.0, the README body should name the canonical form without a legacy
footnote.

**EDIT** `README.md:136`: strip the parenthetical.

Before:
```
The `KeyframesAnimation` object (formerly `Animation`, renamed in 5.0.0 — see `docs/MIGRATION-5.0.0.md`) drives `CSSKeyframesAnimation` and `AnimationGroup`.
```

After:
```
The `KeyframesAnimation` object drives `CSSKeyframesAnimation` and `AnimationGroup`.
```

---

### 2.3 — Replace the Project Structure section with a top-level tree (README:88–132)

**Evidence:** `audit/retro-readme-docs.md §2d:208–236` — the section (lines 88–132, ~45 lines)
lists 22 source files against a directory that now holds 45+. The Q-era additions
(`compile-color.ts`, `engine-playback.ts`, `waapi-densify.ts`, `ingest.ts`, etc.) are entirely
absent. The section also references `src/animation/CLAUDE.md` — deleted and now restored as a
root-file-dispositions action (R.W0). A file-by-file enumeration in the README is a maintenance
liability; that is `CLAUDE.md`'s job (`audit §2d:229–236`).

**EDIT** `README.md:88–132`: replace the full ```` ```\nsrc/\n├── animation/… ``` ```` block with a
10-line top-level tree and a pointer:

```
## Project Structure

```
src/animation/   # THE library — engine + every primitive (see src/animation/CLAUDE.md)
demo/            # Vue 3 demo apps (see demo/CLAUDE.md)
test/            # Vitest suites (jsdom)
bench/           # Vitest benchmarks
scripts/         # CI gates (proof:* scripts) + code generators
docs/            # Migration guide, published surface manifest, architecture notes
```

For the authoritative per-file inventory, see [`src/animation/CLAUDE.md`](src/animation/CLAUDE.md).
```

This cuts ~35 lines and eliminates the maintenance liability entirely.

---

### 2.4 — Remove the stale `src/easing.ts` / `src/math.ts` links and the CSSCubicBezier example (README:173–194)

**Evidence:** `audit/retro-readme-docs.md §2a:152–165` — `README.md:173` links `easing.ts` to
`src/easing.ts` (does not exist; actual path is `src/animation/easing.ts`); `README.md:188` links
`math.ts` to `src/math.ts` (does not exist; math is in `@mkbabb/value.js`); `README.md:188` mentions
the non-existent `timing-functions` demo.

**Evidence:** `audit/retro-readme-docs.md §2e:241–255` — `README.md:190–194` shows:

```ts
const easeInBounce = (t: number) => CSSCubicBezier(0.09, 0.91, 0.5, 1.5)(t);
```

`CSSCubicBezier` is NOT exported from `@mkbabb/keyframes.js`; it is a `@mkbabb/value.js` internal
accessed via `src/animation/utils.ts`. This example teaches using an unexported symbol.

**EDIT** `README.md:173`: change the inline link text `[`easing.ts`](src/easing.ts)` to plain text
`` `easing.ts` `` (no path link — it is `src/animation/easing.ts` but linking internal paths is the
pattern this wave is excising).

**EDIT** `README.md:188`: remove the `[`math.ts`](src/math.ts)` link and the `timing-functions`
demo reference. Keep the sentence about `cubicBezier` but drop the dead link.

**EXCISE** `README.md:190–194`: remove the `CSSCubicBezier` code snippet and its preceding sentence
entirely. If a Bezier easing example is needed in a future pass, replace it with `resolveEasing()`
or `springTimingFunction` — both are actual published APIs.

Net: ~6 lines removed.

---

### 2.5 — Remove stale `src/parsing/` and `src/units/` links (README:341–373)

**Evidence:** `audit/retro-readme-docs.md §2a:152–165` — `README.md:341` links to
`src/parsing/keyframes.ts` (does not exist); `README.md:361` links to `src/units/` (directory does
not exist) and `src/parsing/units.ts` (does not exist). Both are pre-value.js-externalization paths.

**EDIT** `README.md:341–341`: change the `[`keyframes.ts`](src/parsing/keyframes.ts)` inline link
to plain text `` `keyframes.ts` `` (the parser is in `@mkbabb/value.js` and the local caller is
`src/animation/ingest.ts`, not a path worth advertising here).

**EDIT** `README.md:355–373` (the `### Units` subsection): replace with a one-sentence summary:

```
Unit parsing and resolution (length, angle, time, percentage, color, and container-query units)
are handled by [`@mkbabb/value.js`](https://github.com/mkbabb/value.js). `ValueUnit`,
`FunctionValue`, and `ValueArray` are the three token shapes; all define `toString()`,
`valueOf()`, and `lerp()`.
```

The old subsection described the in-repo units system that no longer exists. The `ValueUnit`
paragraph is still correct (those types ARE used at the boundary) — kept, trimmed, re-pointed.

Net: ~12 lines removed.

---

### 2.6 — Fix the dead links in `## Ecosystem & agents` and `## Contributing` (README:879–913)

**Evidence:** `audit/retro-readme-docs.md §2f:259–265` — `README.md:881` links to `./llms.txt`
which is deleted from the working tree (deleted by the owner; confirmed absent at HEAD).

**Evidence:** `audit/retro-readme-docs.md §2g:267–280` — `README.md:910–913`:

```
See [CONTRIBUTING.md](./CONTRIBUTING.md). The README shape follows the perimeter-level
[canonical README shape](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/canonical-readme-shape.md).
```

`CONTRIBUTING.md` is deleted (deletion endorsed, `audit §1b:31–47`). The glass-ui external link
is an out-of-repo dependency that may drift.

**EDIT** `README.md:881`: rewrite the `## Ecosystem & agents` llms.txt bullet to:

```
- **`llms.txt`** — the agent surface: a machine-readable index of every capability, generated
  from the CI-verified published surface (`docs/published-surface.md`) by running
  `node scripts/gen-agent-surface.mjs`. The artifact is not tracked in git (generated at CI time);
  `llms-full.txt` carries the expanded form.
```

**EDIT** `README.md:910–913`: replace the `## Contributing` section with:

```
## Contributing

Open a PR against `master`. Run `npm run proof:all` before pushing — the gate roster is the
acceptance bar.
```

This drops the dead `CONTRIBUTING.md` link and the external glass-ui perimeter link.

---

### 2.7 — Reclassify `llms.txt` / `llms-full.txt` as build artifacts

**Evidence:** `audit/retro-readme-docs.md §1c:51–76` — both files are generated by
`scripts/gen-agent-surface.mjs` from `docs/published-surface.md` + the `proof:*` roster.
They are correctly deleted from the working tree (owner instinct: they are not "real" docs).
`proof:agent-surface` clause (a.1) hard-asserts `ls llms.txt` — this reds without the files.
The current `.gitignore` has no entry for them (`grep -n "llms" .gitignore` → no output at HEAD).

**Three-step change:**

1. **Add to `.gitignore`** (two lines appended):
   ```
   # generated agent surface — regenerated by scripts/gen-agent-surface.mjs before proof:agent-surface
   llms.txt
   llms-full.txt
   ```

2. **Edit `scripts/proof-agent-surface.mjs`**: add a generate-before-assert step at the top of the
   gate (before clause (a.1) asserts file existence). Replace the bare `ls llms.txt` assertion with
   a generate-then-assert pattern:
   - Call `gen-agent-surface.mjs` as a sub-process (or import and invoke its `build()` function
     directly) before any assertion.
   - Remove the "artifact MUST be pre-committed" assumption from clause (a.1); keep all other
     clauses ((a.2)–(a.4)) unchanged — they still assert against the freshly generated content.

3. **Confirm `llms.txt` and `llms-full.txt` are absent from the git tree** at the time of IMPL
   (`git ls-files llms.txt` exits non-zero). They already are (owner deleted them; they are NOT
   in the tracked tree at HEAD on `tranche-r-dev`).

The effect: `proof:agent-surface` becomes self-contained — it generates the artifacts, then asserts
their correctness against the published surface. No committed artifact, no drift vector. CI greens
by construction even on a fresh checkout.

---

### 2.8 — CHANGELOG convention: enforce 5.0.0-format GOING FORWARD

**Evidence:** `audit/retro-readme-docs.md §3a:322–348` — the 5.0.0 entry (15 lines, consumer-facing,
no tranche codes) is the correct model. Historical 4.x entries carry internal tranche-journal prose.

**Action:** add a two-line comment at the top of `CHANGELOG.md`:

```md
<!-- CONVENTION: entries follow the 5.0.0 format — consumer-facing Breaking/Minor/Patch sections,
     no internal wave codes (Wn, Band X, Tranche Y). Keep planning language in docs/tranches/. -->
```

**No retroactive rewrite of historical entries** — effort/value is wrong (`R.md §7`, `audit §3b:349–361`).

---

### 2.9 — Confirm `docs/*` keep list (no file moves)

Per `audit/retro-readme-docs.md §4`:
- `docs/MIGRATION-5.0.0.md` — KEEP (versioned migration doc, `§4a`)
- `docs/published-surface.md` — KEEP (CI-load-bearing, `§4b`)
- `docs/scroll-morph.md` — KEEP (architecture guide, `§4c`)
- `docs/color-fidelity.md` — KEEP (companion to `proof:color-fidelity`, `§4d`)
- `docs/dogfood-inversion.md` — KEEP (architectural reference, `§4e`)
- `docs/tranches/` — KEEP as internal archive (not linked from README)

No file moves in this wave.

---

## 3. The born-RED gate — `proof:readme-paths-live`

**Gate name:** `proof:readme-paths-live`

**Script:** `scripts/proof-readme-paths-live.mjs`

**What it asserts (three clauses, each independently falsifiable):**

**Clause (a) — every `src/` path the README cites resolves to a real file.**
Extract all Markdown inline link targets of the form `](src/…)` or `](./src/…)` from `README.md`.
For each, assert `fs.existsSync(path.join(REPO, target))`. A dead link → exit 1.

**Clause (b) — the bare string `Animation` does not appear as a standalone class-name reference.**
Scan `README.md` for the pattern `` `Animation` `` (backtick-quoted, standing alone — not as part
of `CSSKeyframesAnimation`, `KeyframesAnimation`, `AnimationGroup`, `AnimationOptions`, etc.).
Assert zero matches. A surviving stale name → exit 1.
Implementation: `grep -P '(?<!\w)Animation(?!\w|Group|Options|Engine|Frame|Error|Id|Composer)' README.md`
with backtick context.

**Clause (c) — the Quick Start fence is tagged `ts run` and contains at least one `import` line.**
Locate the ` ```ts run ` fence nearest the `## Quick Start` heading. Assert (1) the tag is `ts run`
(not bare `ts`), AND (2) the fence body contains a line matching `/^import /`. No import line → the
snippet cannot compile → exit 1.

**Born-RED plant test (what RED-state proves the gate bites):**

- For (a): temporarily insert `](src/easing.ts)` into `README.md` (the exact stale path excised in
  §2.4). Gate exits 1. Remove → gate exits 0. Confirms the file-resolution sweep bites.
- For (b): temporarily insert the line `` The `Animation` class is… `` into `README.md`. Gate exits 1.
  Remove → gate exits 0. Confirms the class-name scan bites.
- For (c): temporarily change the Quick Start fence tag from `ts run` to bare `ts`. Gate exits 1.
  Restore → gate exits 0. Confirms the import-presence check bites.

The gate is paired with R.W4 (`proof:readme-runs`): R.W4 ensures the Quick Start executes correctly;
R.W7 ensures the paths it cites exist and the class name is correct.

**Wire into CI:** add `proof:readme-paths-live` to `proof:hygiene-chain` in `package.json` (append
after `proof:readme-runs` to respect the logical grouping of docs-surface gates).

---

## 4. Challenge-tempered cautions

**Do NOT retroactively rewrite CHANGELOG history.** `R.md §7` is explicit: "the CHANGELOG history
is not retroactively rewritten." The 4.x tranche-journal entries are accepted as-is. Only the
forward convention (§2.8) is enforced.

**Quick Start edit ownership.** `R.W4 §2.4` already re-writes the Quick Start with the correct
`import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` line and tags it `ts run`.
If R.W4 ships before R.W7, the Quick Start edit here is already done; R.W7 IMPL MUST NOT overwrite
R.W4's edit. The gate (clause (c)) asserts the result, not the authorship.

**`docs/*` preservation.** All five `docs/` files are explicitly KEPT (§2.9). No merge into
CLAUDE.md, no deletion, no rename — the `docs/dogfood-inversion.md` "may be merged" note in the
audit (`§4e`) is a FUTURE option, not an R mandate.

**`src/animation/CLAUDE.md` is restored, not linked into the public README.** The CLAUDE.md files
are AI-agent context documents (`audit §1f:131–143`). They should be linked in the README's Project
Structure pointer (§2.3) as a navigation aid, but their content is internal. The README does not
need to reproduce their inventory.

**No path links to `src/animation/` internals.** The audit's finding is that linking to
`src/easing.ts`, `src/math.ts`, `src/parsing/` was the failure mode. The replacement text (§2.4,
§2.5) uses plain text or points to the external `@mkbabb/value.js` repo — no new `](src/animation/…)`
links are added.

**`useSceneSwap`, subgrid same-cascade, render-fn slot protocol** — not touched by this wave
(docs-only; no demo or library source edits).

---

## 5. Verification + DEV/IMPL boundary

**This spec is authored now (DEV phase).** IMPL opens on authorization.

**Verification steps at IMPL:**

1. `wc -l README.md` → ≤ 750 lines after all edits.
2. `npm run proof:readme-paths-live` → exits 0 (the new gate; born-RED plant test run first).
3. `npm run proof:readme-runs` → exits 0 (the Quick Start `ts run` fence executes; shared with R.W4).
4. `npm run proof:agent-surface` → exits 0 (generate-before-assert pattern; `llms.txt` generated
   fresh, not pre-committed).
5. `git ls-files llms.txt llms-full.txt` → empty output (not tracked).
6. `grep '](src/easing.ts)\|](src/math.ts)\|](src/parsing/\|](src/units/' README.md` → zero matches.
7. `grep -P '(?<!\w)\`Animation\`(?!\w)' README.md | grep -v 'CSSKeyframes\|Keyframes\|Group\|Option\|Engine\|Frame\|Error\|Id'` → zero matches.
8. `head -3 CHANGELOG.md` → the convention comment is the first non-blank content.
9. `npm run proof:hygiene-chain` → exits 0 (the new gate is wired in and green).

**File-disjointness confirmed:** all edits are in `README.md`, `CHANGELOG.md`, `.gitignore`,
`scripts/proof-agent-surface.mjs`, and the new `scripts/proof-readme-paths-live.mjs`. No overlap
with R.W1–R.W6.
