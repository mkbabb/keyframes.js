# a13-w7-readme-llms — Audit of R.W7 (README slim + llms reclassify)

## Executive summary

R.W7 shipped exactly what its spec (`docs/tranches/R/waves/R.W7.md`) promised for the six
listed edits (§2.1–§2.6), the CHANGELOG convention comment (§2.8), the `.gitignore` +
generate-before-assert reclassification of `llms.txt`/`llms-full.txt` (§2.7), and the new
`proof:readme-paths-live` gate (§3). I independently re-ran all three docs gates
(`proof:readme-paths-live`, `proof:agent-surface`, `proof:readme-runs`) against a **freshly
built** `dist/` (the checked-in `dist/` on disk predated HEAD by the entire R.W1–R.W4 refactor,
so the first run was silently testing stale bytecode) — all three are genuinely green post-rebuild,
and `proof:readme-runs` really does execute all 16 runnable snippets against the current public
surface. This is honest, load-bearing infrastructure, not a cosmetic gate.

However, the wave's actual `git diff` (`1d4e3d9..22de623`) went beyond its own spec: it silently
cut a Table of Contents, a `#### Reification` subsection, a `#### Variable resolution` subsection,
and a full `#### Recipe — structural stagger, the CSS way` teaching example (an a11y-conscious,
`ts run`-tagged, gate-verified snippet) to hit the 749-line count — none of these four cuts are
named anywhere in R.W7's §2.1–§2.9 scope. The variable-resolution backward-fill semantic and the
stagger a11y recipe are real, non-obvious product knowledge that is now nowhere in the repo (not
even relocated to `src/animation/CLAUDE.md`).

The more serious finding is outside the file R.W7 edited: R.W7 §2.3 rewrote the README's Project
Structure section to say *"For the authoritative per-file inventory, see
[`src/animation/CLAUDE.md`](src/animation/CLAUDE.md)"* — but that file is a byte-for-byte survivor
of the pre-R Q-era tree (`git show ac40f72:src/animation/CLAUDE.md` diffs empty against HEAD). It
still describes a flat, un-zoned `animation/` directory (no `physics/`, `engine/`, `group/`,
`compile/`, `resolve/`, `ingest/`, `scroll/` zones — the entire R.W1 partition is invisible to it),
still calls the engine class `Animation` (renamed `KeyframesAnimation` in 5.0.0, Q-era), and still
lists `animate` as a live HEAVY front door reachable through `loadAnimationEngine()` — R.W4 excised
`animate` from the published `AnimationEngine` surface. The root `CLAUDE.md` (which R.W7 did not
touch either, and which is out of scope for R.W7 but in scope for this drift question) carries the
identical two errors at line 71 (`Animation`, `animate`) even though its own Project Structure tree
three lines above correctly names `KeyframesAnimation` and the zoned directories — an internal
self-contradiction inside one file. R.W0 "restored" both CLAUDE.md files from deletion but never
verified their *content* against the tree R actually built; R.W7 then pointed the newly-slimmed
README at the stale one as the authoritative source. The result: the README is now accurate, but
its own explicitly-named hand-off document is not, and no gate in the roster checks CLAUDE.md
prose against the source tree.

## Findings

### 1. `src/animation/CLAUDE.md` is stale pre-R.W1 content, and R.W7 newly designates it "authoritative" — SEVERITY: HIGH

**Evidence:**
- `docs/tranches/R/waves/R.W7.md` §2.3 (EDIT `README.md:88–132`) replaces the old file-by-file
  README section with: *"For the authoritative per-file inventory, see
  [`src/animation/CLAUDE.md`](src/animation/CLAUDE.md)."* This text is live at `README.md:51-52`
  today.
- `git show ac40f72:src/animation/CLAUDE.md | diff - src/animation/CLAUDE.md` → **empty diff**.
  The file has not changed since commit `ac40f72` (`impl(Q.WA1-WA4 Band A)`), i.e. it predates
  R.W1's 7-zone partition (`40834d2`), R.W2's god-class carves, and R.W4's `animate()` excision
  (`1d4e3d9`) entirely.
- `src/animation/CLAUDE.md:47` lists `animate.ts` in a flat `animation/` files table as one of ~15
  siblings directly under `animation/` — no `physics/`, `orchestration/`, `engine/`, `group/`,
  `compile/`, `resolve/`, `ingest/`, `scroll/` zones appear anywhere in the file, even though
  `ls src/animation/` today shows those exact 7+ zone directories plus `svg/`, `presets/`,
  `internal/`.
- `src/animation/CLAUDE.md:20-21` names `Animation` (not `KeyframesAnimation`) and `animate` as
  live members of the "HEAVY (dynamic)" front-door set reachable via `loadAnimationEngine()`.
  Both are wrong post-R: the class is `KeyframesAnimation` (Q-era rename, `engine/animation.ts`),
  and `animate` was excised from the published `AnimationEngine` interface by R.W4
  (`src/animation/index.ts:154-158`, comment: *"`animate()` was EXCISED from the published
  surface... `animate.ts` stays a HEAVY chunk reachable via deep import, but its option types are
  no longer a published advertisement"*). Confirmed at runtime: `src/animation/load-engine.ts:118-196`
  (the `AnimationEngine` interface) has no `animate` key.
- R.W0's own disposition table (`docs/tranches/R/waves/R.W0.md:63`) calls
  `src/animation/CLAUDE.md` "load-bearing — README §Project-Structure links to it ('the
  inventory')" and marks it **RESTORE** — i.e. R.W0 anticipated R.W7 would point to it, but
  "RESTORE" meant `git checkout`-style un-delete, not a content refresh. No wave in R
  (`git log --oneline -- src/animation/CLAUDE.md` since `ac40f72`) ever re-touched its content.

**Failure scenario:** An agent or contributor reads the README's Quick Start (correct: `engine`
subpath, `KeyframesAnimation`), then follows the "authoritative per-file inventory" link expecting
a trustworthy map of the 7-zone library and instead reads a description of a directory structure
that no longer exists, a class name that was renamed a full major version ago, and a front-door
function (`animate`) presented as importable through `loadAnimationEngine()` when it is not. This
is exactly the doc-rot class `proof:readme-paths-live` (this same wave!) was built to kill in
README.md — but the gate doesn't reach the file R.W7 newly anointed as the fallback authority.

**Proposal:** Tranche S should either (a) regenerate `src/animation/CLAUDE.md`'s Files section and
HEAVY/LIGHT export lists from the live zone tree + `AnimationEngine` interface (a script, mirroring
`gen-agent-surface.mjs`'s "generate from source of truth" pattern), or (b) fold a `proof:claude-md-live`
gate analogous to `proof:readme-paths-live` clause (b)/(a) that asserts zoned-directory names appear
and `animate`/bare-`Animation` do not, run against both `CLAUDE.md` and `src/animation/CLAUDE.md`.

### 2. Root `CLAUDE.md:71` self-contradicts its own tree three lines above — SEVERITY: MEDIUM

**Evidence:** `CLAUDE.md:27-34` (the Project Tree fenced block, accurate, R.W1-era) names
`engine/` as *"HEAVY core: KeyframesAnimation + CSSKeyframesAnimation (animation.ts)..."* — correct.
`CLAUDE.md:71`, three lines later in the same "Library Entry Point" section, says: *"HEAVY
(dynamic — reached ONLY via `await loadAnimationEngine()`): `Animation`, `CSSKeyframesAnimation`,
`AnimationGroup`, ..., `animate`, ..."* — both `Animation` (should be `KeyframesAnimation`) and
`animate` (excised, see Finding 1) are wrong, in direct tension with the correct tree eight lines
prior in the identical document. Confirmed present at `master` HEAD `18e8617`
(`git show 18e8617:CLAUDE.md`), not a branch artifact.

**Failure scenario:** Same as Finding 1, one level up — an agent reading the root CLAUDE.md's
"published surface" bullet list to decide what to statically import from `/engine` will try
`import { Animation } from "@mkbabb/keyframes.js/engine"` and get `undefined`, or attempt to use
`animate` and find it absent from the dynamic loader's returned object.

**Proposal:** One-line fix — `s/\`Animation\`,/\`KeyframesAnimation\`,/` and drop `` `animate`, ``
from `CLAUDE.md:71`. Trivial to fold into a Tranche S doc-hygiene wave; should ideally be covered
by the same gate proposed in Finding 1.

### 3. R.W7 silently cut four sections outside its own declared scope — SEVERITY: MEDIUM

**Evidence:** `git diff 1d4e3d9 22de623 -- README.md | grep '^-.*## '` shows four headings removed
that are **not** named anywhere in R.W7.md §2.1–§2.9's concrete-work list: `## Table of Contents`,
`#### Reification`, `#### Variable resolution`, `#### Recipe — structural stagger, the CSS way`.
The commit message (`22de623`) does self-disclose this: *"R.W7: README slim §2.2–2.6 + ToC/
Reification/stagger-recipe cuts → 749L"* — but the wave spec document itself never authorizes these
cuts, and the R.W7.md file on disk was not amended afterward to record them (checked: no `git log`
touch to `docs/tranches/R/waves/R.W7.md` after the spec's initial authoring).
  - `#### Variable resolution` (`git show 1d4e3d9:README.md:213-224`) documented the backward-fill
    semantic — "the resolver walks backward from each keyframe, seeking the most recent definition
    of each variable" — a real, non-obvious behavior of `fromVars`/keyframe reification that is not
    explained anywhere else in the current README, CLAUDE.md, or `docs/*`.
  - `#### Recipe — structural stagger, the CSS way` (`git show 1d4e3d9:README.md:727-760`) was a
    complete, `ts run`-tagged, gate-executed a11y teaching example (letter-splitting hazard +
    `aria-hidden`/`aria-label` structural-reveal pattern). It is gone with no replacement pointer;
    `grep -n "structural stagger\|SplitText\|aria-hidden" README.md` on HEAD returns nothing.

**Failure scenario:** Not a runtime bug, but a documentation regression: two genuinely useful,
previously-gated pieces of product knowledge (a semantic explanation + an accessibility recipe)
disappeared from the corpus in a wave whose spec explicitly enumerated a smaller, different cut
list, and whose own "Verification steps" section (R.W7.md §5) checks line count (`≤ 750`) and gate
exit codes but never checks "no unplanned section deletions." The 749-line target was hit partly by
cuts nobody reviewed against the spec.

**Proposal:** Tranche S should decide a permanent home for the variable-resolution backward-fill
semantic (a strong candidate: fold into `src/animation/CLAUDE.md`'s frame-compiler description,
once that file is regenerated per Finding 1) and the structural-stagger a11y recipe (candidate:
`docs/` as a standalone guide alongside `docs/scroll-morph.md`, in the R.W7 "KEEP list" pattern —
or restore to README under `## Beyond CSS` § `stagger` since it is still a published, gate-tested
primitive). Going forward, any wave that trims docs beyond its own itemized list should say so in
the spec, not just the commit message.

### 4. `proof:readme-runs` and `proof:agent-surface` are real, but their first observed run in this
audit was silently against a stale `dist/` — SEVERITY: LOW (process note, not a product defect)

**Evidence:** `dist/keyframes.js` on disk (`ls -la`) carried mtime `Jun 24 22:29`, predating HEAD
`18e8617` (`Jun 25 14:44`) and the entire R.W1→R.W4 src/ refactor merged into `tranche-r-dev`
between those timestamps (`git log --oneline b721a0c..18e8617 -- src/`, 20+ commits: the 7-zone
partition, the god-class carves, the `./engine` subpath, the `animate()` excision). Running
`node scripts/proof-readme-runs.mjs` against that stale `dist/` still exits 0 — it is not validating
what it appears to validate until `npm run build:lib` is re-run. After a fresh `build:lib` in this
audit, `proof:readme-runs` re-ran clean (16/16 snippets, 20/20 assertions) — the gate itself is
sound, this is a caveat about relying on a checked-out `dist/` without rebuilding first.

**Failure scenario:** none observed in this audit (the rebuilt gate is genuinely green), but any
CI or local verification step that trusts a pre-existing `dist/` without a `build:lib` precondition
check risks a false-green on this gate specifically because it has no live source hash comparison
— it is a snapshot-vs-snapshot check, and the snapshot ages the moment `dist/` goes stale between a
build and a later `git pull`.

**Proposal:** No action needed on the gate logic itself (documented precondition already says
"library is built... exit 3 otherwise" for a *missing* dist, but not a *stale* one). Consider a
lightweight source-hash check (or CI-only concern — the built-artifact-freshness problem is
generic across all dist-consuming proof gates, not specific to R.W7) — likely out of this lane's
scope, flagging for completeness.

### 5. Everything R.W7 explicitly promised is delivered correctly and gate-verified — SEVERITY: INFO (positive finding)

**Evidence, all independently re-verified in this audit, read-only:**
- `wc -l README.md` → 749 (spec target ≤750). ✓
- `Animation` (renamed `KeyframesAnimation`) fixed at README:232-ish (now `README.md:57`,
  confirmed via `proof:readme-paths-live` clause (b) passing).
- Quick Start (`README.md:11-27`) imports `CSSKeyframesAnimation` from
  `"@mkbabb/keyframes.js/engine"`, tagged ` ```ts run `, contains `import` — matches R.W4's
  correct pattern, and executes against the built dist (verified).
- No dead `src/easing.ts`/`src/math.ts`/`src/parsing/`/`src/units/` links remain
  (`grep` zero matches, clause (a) of the new gate passes).
- `.gitignore:29-31` adds the exact two-line generated-artifact block the spec specifies;
  `llms.txt`/`llms-full.txt` are untracked (`git ls-files llms.txt llms-full.txt` empty) and
  regenerate byte-identical to a fresh build (`proof:agent-surface` clause a.4 passes).
- `scripts/proof-agent-surface.mjs` implements the generate-before-assert pattern exactly as
  specified (§2.7 step 2) — confirmed by direct read and a clean re-run.
- `CHANGELOG.md:1-4` carries the exact convention comment specified in §2.8, first non-blank
  content, no retroactive history rewrite (4.x entries untouched — `git log` shows no post-R
  touches to historical CHANGELOG sections).
- `docs/*` keep list (§2.9) matches exactly: `MIGRATION-5.0.0.md`, `published-surface.md`,
  `scroll-morph.md`, `color-fidelity.md`, `dogfood-inversion.md` all present, none moved.
- `proof:readme-paths-live` is wired into `proof:hygiene-chain` immediately after
  `proof:readme-runs` (`package.json:236`), matching the spec's wiring instruction, and is a
  genuine born-RED-capable gate (independently re-run, passes for the right reasons — clause (a)
  file-existence sweep, clause (b) regex-scoped `Animation` scan, clause (c) fence-tag + import
  check).

This wave is one of the more honestly-scoped waves in R: the spec named six specific edits plus
three infra changes, and the shipped diff delivers all nine with working, load-bearing gates. The
severity-3 finding (undisclosed extra cuts) and the severity-1/2 findings (the CLAUDE.md hand-off
target being stale) are real gaps, but they are gaps in a "did the wave check its downstream
dependency" sense, not in a "did the wave lie about its own scope" sense.

## Tranche-S implications

1. **Regenerate or gate `src/animation/CLAUDE.md`.** This is the highest-priority item from this
   lane. The README now formally delegates "the authoritative per-file inventory" to a file that
   has not been touched since before the R.W1 zone partition. Either (a) hand-rewrite it to match
   the current 7-zone tree + published `AnimationEngine` surface as a Tranche S wave (small,
   mechanical, high value — it is exactly the kind of file an agent reads first), or (b) treat it
   like `llms.txt`: derive its Files/HEAVY-LIGHT-export sections from source (zone directory listing
   + `AnimationEngine` interface keys) so it cannot drift again, with a gate mirroring
   `proof:readme-paths-live`'s clause (b) applied to both CLAUDE.md files.
2. **Fix the two-line root `CLAUDE.md:71` drift** (`Animation`→`KeyframesAnimation`, drop `animate`)
   in the same pass — trivial, but currently a self-contradiction inside the project's primary
   AI-context file.
3. **Decide a home for the two orphaned content sections** (variable-resolution backward-fill
   semantics; the structural-stagger a11y recipe) rather than leaving them purged with no
   successor. Small wave, but real product-explaining prose was lost outside any wave's declared
   scope — a pattern worth naming explicitly in Tranche S's wave-authoring convention ("a spec's
   concrete-work list is the cut list; anything beyond it needs its own line item, even a
   one-sentence one, not just a commit-message footnote").
4. **Consider whether `animate.ts` itself is residue.** It is not dead code (still deep-imported by
   `test/animate-orchestration.test.ts`, still shipped as a reachable HEAVY chunk per
   `src/animation/index.ts:154-158`'s comment) but it is also not on any published surface, not in
   `llms.txt`'s curated/full export sets, and its own module doc-comment markets it as "the DX
   baseline of the genre" — a positioning that contradicts its unpublished status. Tranche S's
   "NO legacy/deprecated code anywhere" charter should explicitly rule on `animate.ts`: either
   re-publish it as a supported deep-import convenience (and document that in both CLAUDE.md files
   and the README) or delete it outright (and delete its test) — the current "orphaned but tested"
   middle state is exactly the residue class the charter is meant to fold.
5. **Add a doc-hygiene gate that reaches CLAUDE.md**, not just README.md. `proof:readme-paths-live`
   is a good, cheap, born-RED-capable pattern (dead-path sweep + banned-token regex + fence-tag
   check); Tranche S should clone it (or generalize it to take a file-list parameter) to cover both
   `CLAUDE.md` and `src/animation/CLAUDE.md`, since this audit shows the exact same drift class
   (`Animation` name, excised `animate`) independently accreted in both files without any gate
   noticing.
