# K audit — J.W5 plan-vs-delivery (published surface)

**Lane:** wave-J.W5.md · **Auditor:** Tranche K fleet, DOCS-only lane
**Date:** 2026-06-11 · **Branch:** tranche-j-dev @ 4f1fc4c
**Scope:** J.W5 spec (`docs/tranches/J/waves/J.W5.md`) vs impl record
(`docs/tranches/J/waves/J.W5-impl.md`) vs the published 4.2.0 tarball
(`npm view @mkbabb/keyframes.js@4.2.0`; tarball downloaded to `/tmp/kf-tarball-test/`).
No engine/demo/test source touched — audit is read-only.

---

## §0 Executive summary

J.W5 ("THE PUBLISHED SURFACE") delivered substantially against its nine-item spec
(S1–S9): the `proof:published-surface` gate (clauses a–f) and the `proof:readme-runs`
gate are both GREEN on the current tree; the published 4.2.0 tarball is clean (no
`_redirects`, no vue peer, d.ts present, 12 files); the README §Beyond CSS grew from
4 to 13 taught subsections with 17 runnable snippets executing against the built dist;
the three CLAUDE.md files are rewritten to the tree; and the honest minor was consumed
into the CHANGELOG. Five findings are recorded below — two of which represent
**real post-delivery re-rot** that K must address.

---

## §1 Verification matrix (first-hand, 2026-06-11)

All commands run from `/Users/mkbabb/Programming/keyframes.js/`.

| Check | Observed result |
| --- | --- |
| `npm view @mkbabb/keyframes.js@4.2.0 dist-tags` | `{ latest: '4.2.0' }` — 4.2.0 is current |
| `npm pack @mkbabb/keyframes.js` (from `/tmp/kf-tarball-test/`) | 12 files: 9 dist + LICENSE + README.md + package.json |
| `dist/_redirects` absent from tarball | confirmed: `tar -tzf … | grep redirect` → no match |
| `dist/keyframes.d.ts` in tarball | 130,759 B — present, non-empty |
| `peerDependencies` in published `package.json` | `undefined` — vue peer correctly absent |
| `files` field in published `package.json` | `["dist","!dist/gh-pages","!dist/_*"]` |
| `npm run proof:published-surface` | **PASS** — clauses (a)(b)(d)(e)(f)(g); 40/40 exports taught-or-manifested; interface 16 ≡ 16; peers (none); EP-3 6/6 dispositioned |
| `npm run proof:readme-runs` | **PASS** — 17 snippets executed against dist, 20 `// =>` verified, roster floor 17/17 |
| `npm run proof:ci-coverage` | **PASS** — 114 proof:* gates in CI (5 recorded exclusions) |
| Spot-run 1: `NumericAnimation` array-syntax snippet (README `:436`) against `dist/keyframes.js` | PASS: `anim.at(0.5)` → `{x:50,y:100,opacity:0.5}` |
| Spot-run 2: `SpringProgress` snippet (README `:535`) | PASS: `settled === false`; `fromDuration().settled === true` |
| Spot-run 3: `loadAnimationEngine()` | PASS: 16 HEAVY keys returned (`Animation,AnimationGroup,…`) |
| Phantom paths in `CLAUDE.md` | `grep "src/parsing\|src/units\|simple/\|balls/"` → 0 hits |
| `peerDependencies` in local `package.json` | `undefined` — vue peer absent |
| `vite.config.ts:295` `publicDir: false` | present with full causal comment (`vite.config.ts:284-295`) |
| `.gitignore` `/*.png` guard | line 23: `/*.png` present |
| Stray `b2-gen-crash-easing-visibility.png` at repo root | absent — relocated to `docs/tranches/I/audit/investigate/shots/` |
| `robots.txt` dead Sitemap line | removed — `demo/app/public/robots.txt` now 3 lines, no `Sitemap:` directive |
| `package.json "author"` | `"Mike Babb <mike@babb.dev>"` (was `""`) |
| `.changeset/tranche-j.md` authored | consumed at WZ (`f0822a1`); `CHANGELOG.md §4.2.0` names the E→I tier export-by-export |
| `src/animation/CLAUDE.md` 9 previously unlisted modules | `stagger.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`, `draw-svg.ts`, `motion-path.ts`, `animate.ts`, `frame-compiler.ts` — all enumerated with roles |
| Supersession pointers on I's FINAL §8 and PROGRESS §0 | `docs/tranches/I/FINAL.md:229-233` + `docs/tranches/I/PROGRESS.md:28-32` both carry pointer to `I-WZ-verify.md` + Tranche J |

---

## §2 Spec scope completeness (S1–S9 disposition)

| Scope item | Spec promise | Delivered? | Evidence |
| --- | --- | --- | --- |
| S1a — tarball == `files` declaration | no `_redirects`; `dist/keyframes.d.ts` present | YES | `npm pack @mkbabb/keyframes.js` → 12 files; no `_redirects`; d.ts 130,759 B |
| S1b — every public export taught or manifested | 40/40 (24 LIGHT + 16 HEAVY) | YES | `proof:published-surface` clause (b) PASS; `docs/published-surface.md` 94-line manifest |
| S1c / clause (d) — AnimationEngine interface drift gate | interface keys ≡ runtime keys | YES | 16 ≡ 16 today; drift planted + caught in born-RED record |
| S2 — README §Beyond CSS completion + executable runner | 4 → 13 subsections; 17 runnable snippets | YES | README lines confirmed `:432-747`; `proof:readme-runs` PASS 17/17 |
| S3 — doc-rot purge (CLAUDE.md ×3) | phantom paths, demo dirs, counts, boundary all corrected | YES | verified first-hand (see §1) |
| S4 — `publicDir: false` + BP-9/BP-10 hygiene | `_redirects` structurally excluded; author/robots fixed | YES | `vite.config.ts:295`; `package.json "author"`; `robots.txt` cleaned |
| S5 — honest minor changeset | `.changeset/tranche-j.md` "minor"; both patches consumed | YES | consumed at WZ; `CHANGELOG.md §4.2.0` names full surface |
| S6 — supersession pointers + stray PNG | pointer on I FINAL/PROGRESS; PNG relocated; `/*.png` guard | YES | both pointers present; PNG at `shots/`; `.gitignore:23` |
| S7 — vue peerDep removal + clause (f) | `peerDependencies` block deleted | YES | local + published `package.json` both show `undefined` |
| S8 — WAAPI-Level-2 positioning paragraph | `AnimationGroup`/`Sequence` = production GroupEffect/SequenceEffect | YES | `README.md:741-747`; correspondence table; KILL rider honored |
| S9 — structural stagger recipe (zero new code) | `sibling-index()` PE path + a11y framing | YES | `README.md:624-660`; snippet is runnable-tagged and EXECUTES |

All nine scope items delivered. One **spec-plus addition** beyond the letter:
ci.yml wiring (`ci.yml:101-112`) — forced by the existing `proof:ci-coverage` gate, which would red on a `proof:*` declared in `package.json` but not invoked in CI. The impl record correctly names this at `J.W5-impl.md §127-138` as "forced by an existing gate." The J.W3 open handoff (`proof:all`/`proof:correctness` tier membership) was NOT re-routed by this addition.

---

## §3 Findings

### F-W5-1 (P2) — `proof:published-surface` lands in HYGIENE tier, not CORRECTNESS as specced

**Spec:** `J.W5.md §Hard gate` final paragraph — "proof:published-surface enters the
CORRECTNESS tier and the proof:all roster … its membership is owned by the J.W3
proof:ci-coverage two-way equivalence."

**Delivered:** the gate lands in `proof:hygiene`, not `proof:correctness`.

**Evidence:**
```
node -e "const p=require('./package.json'); console.log(p.scripts['proof:correctness'].includes('proof:published-surface'))"
# → false
node -e "const p=require('./package.json'); console.log(p.scripts['proof:hygiene'].includes('proof:published-surface'))"
# → true
```
`package.json` scripts: `proof:correctness` does not include `proof:published-surface` or
`proof:readme-runs`; both appear in `proof:hygiene`.

**Severity:** P2 — the gate bites in CI (both gates are wired at `ci.yml:106-112`, confirmed by
`proof:ci-coverage` PASS); a consumer running `npm run proof:correctness` locally does not
execute the publish-boundary oracle. Per the spec, clauses (a)/(b)/(c)/(d)/(f) are
"RUNTIME/load-bearing CORRECTNESS" (J.W5.md §Two-tier taxonomy); they belong in the
CORRECTNESS tier beside `proof:engine-correctness` and `proof:standalone-zero-alloc`, not
in HYGIENE beside structural-claim prose checks.

**Seam:** `package.json` `proof:correctness` script.
**Suggested wave class:** K.W3 (estate) or K.W5 (parallel docs/packaging) — single-line
script edit, no gate logic change.

---

### F-W5-2 (P2) — `demo/CLAUDE.md:78` glass-ui version stale post-repin (re-rot introduced after W5)

**Spec:** S3 — `demo/CLAUDE.md` rewritten to the tree, including adding `@mkbabb/glass-ui`
to Key Dependencies (`J.W5.md §S3`). The rewrite correctly wrote `~3.9.0` at impl time
(2026-06-10), and `proof:published-surface` clause (e) does NOT check the version pin in
demo/CLAUDE.md (it checks only src/ and demo/ structural paths, not dependency pin values).

**Delivered:** the W5 rewrite wrote `~3.9.0`. The `~3.9.0 → ~3.11.2` repin (`56aa00f`,
"chore(tranche-J): glass-ui ~3.9.0 → ~3.11.2") happened AFTER the W5 merge (`e3c029a`) but
did NOT update `demo/CLAUDE.md`.

**Evidence:**
```
git show 4f1fc4c:demo/CLAUDE.md | grep "glass-ui"
# → "@mkbabb/glass-ui" `~3.9.0` (in `optionalDependencies`)
grep '"@mkbabb/glass-ui"' package.json
# → "~3.11.2"
npm view @mkbabb/glass-ui dist-tags.latest
# → 3.13.0
```
`demo/CLAUDE.md:78` at close commit says `~3.9.0`; `package.json:182` says `~3.11.2`;
latest on npm is `3.13.0` (the orchestrator triage item U-K14 — upgrade to latest).

**Severity:** P2 — `demo/CLAUDE.md` is a live instruction doc read by the model on every
session. A stale pin version does not cause a test failure but actively misleads.

**Seam:** `demo/CLAUDE.md:78`.
**Suggested wave class:** K.W5 (docs/packaging wave); trivial one-line fix, but should be
done as part of the glass-ui upgrade to 3.13.0 (U-K14) so the pin and the doc agree.

---

### F-W5-3 (P2) — `package.json "description"` typo "standards-complaint" shipped in 4.2.0

**Evidence:**
```
npm view @mkbabb/keyframes.js@4.2.0 description
# → "Create keyframe animations for anything in JavaScript; specify your keyframes
#    in standards-complaint CSS."
node -e "const p=require('./package.json'); console.log(p.description);"
# → same
```
"complaint" should be "compliant." The typo predates J.W5 (not introduced by it), but J.W5's
S3/S4 hygiene sweep and the honest minor publication were the natural moment to catch it,
and the published 4.2.0 carries it.

**Severity:** P2 — visible to every `npm show @mkbabb/keyframes.js` user; cosmetic only,
no functionality affected. W5's scope (S3 covers `package.json` BP-10 `author` fix) could
have caught this with a broader pass.

**Seam:** `package.json "description"`, line 4.
**Suggested wave class:** K.W5 (packaging hygiene); one-character fix.

---

### F-W5-4 (P2) — `CLAUDE.md:61` frozen snapshot hint diverged from the tree (post-W5 re-rot)

**Delivered:** `CLAUDE.md:61` reads:
```
# (77 files / 754 tests at the J.W1/W5/W6 merge — derive, don't trust a frozen number)
```
The derivation instruction is correct per spec. The snapshot hint "(77 files / 754 tests at
the J.W1/W5/W6 merge)" is also currently accurate (verified: `ls test/*.test.ts | wc -l`
→ 77; `npx vitest list | wc -l` → 754). However, CLAUDE.md itself was written at a 69-file
/ 683-test state (J.W5 impl date, pre-W1/W6 additions) and the hint was updated during the
WZ close pass to "77 files / 754 tests" — the snapshot will re-rot as K adds tests. The
spec-compliant path is to keep ONLY the derivation command and drop the frozen hint, since
the spec says "where feasible the rewritten section states the count as `ls … | wc -l`
rather than a frozen integer, so the doc cannot drift again" (J.W5.md §S3).

**Evidence:**
```
# Current tree:
ls /Users/mkbabb/Programming/keyframes.js/test/*.test.ts | wc -l  # → 77 (matches hint)
npx vitest list | wc -l                                            # → 754 (matches hint)
# But K test additions will re-rot the "(77 files / 754 tests)" snapshot hint.
```

**Severity:** P2 — technically correct today; will drift as K adds tests. The "derive,
don't trust a frozen number" instruction is undermined by the snapshot immediately
following it.

**Seam:** `CLAUDE.md:61` — delete the snapshot hint `(77 files / 754 tests at the J.W1/W5/W6
merge — derive, don't trust a frozen number)` and leave only the derivation commands.
**Suggested wave class:** K.W5 (docs hygiene, trivial) or K.W1 (initial setup).

---

### F-W5-5 (P2) — impl-record file-count discrepancy: says "13 files (10 dist)" but published tarball has 12 (9 dist)

**Spec:** J.W5.md §S1a — the gate asserts the tarball contents; the gate passes, so this
is an impl-record precision finding, not a gate failure.

**Evidence:**
```
# Impl record (J.W5-impl.md §S1a):
# "Packed surface today: 13 files (10 dist + 3 npm metadata)"

# Published tarball (downloaded 2026-06-11):
tar -tzf /tmp/kf-tarball-test/mkbabb-keyframes.js-4.2.0.tgz | wc -l  # → 12
# dist: animate-*.js, animations-*.js, draw-svg-*.js, engine-*.js,
#       keyframes.d.ts, keyframes.js, motion-path-*.js,
#       springTimingFunction-*.js, timeline-*.js = 9 dist files

# Local npm pack --dry-run (current tree):
# total files: 12

# FINAL.md line 162:
# "agree — packed surface today 13 files, no _redirects"
```
The impl record (2026-06-10, pre-WZ) and FINAL.md (2026-06-11 post-WZ) both say "13 files"
but the published tarball and current local `npm pack` yield 12. The most likely explanation:
the W5 impl tree had one additional dist chunk (possibly a `group-*.js` split that was
subsequently folded into `engine-*.js`), or the dist was rebuilt before publication with a
slightly different Vite output. The `!dist/_*` negation added in the WZ close-tree fix
(`31f61f6`) correctly excludes proof-harness dirs; the gate's clause (a) is the authoritative
check and passes. The frozen count in the impl record and FINAL are a minor precision error.

**Severity:** P2 — historical record imprecision; the gate (clause a) is the machine-checkable
truth and it passes. No consumer impact.

**Seam:** `docs/tranches/J/waves/J.W5-impl.md §S1a` (FROZEN record — do not edit); `docs/tranches/J/FINAL.md:162` (FROZEN close record — do not edit). Both are historical artifacts. The correct count for the current tree is 12 files; the gate asserts it programmatically.
**Suggested wave class:** N/A — frozen records; no action needed. Recorded for K auditors
reading the history.

---

## §4 Spec-plus additions (beyond the spec letter — verified as appropriate)

1. **ci.yml wiring** (`ci.yml:101-112`) — forced by the `proof:ci-coverage` one-way gate
   (which would red on an un-invoked `proof:*` script); the gate's own FAIL text prescribed
   the fix. Correct and appropriate; J.W3 still owns the two-way equivalence.

2. **clause (g) — EP-3 uncovered-export disposition** (`proof-published-surface.mjs:597-643`) —
   added to gate the `flip`/`drag`/`DrawSVG` path-B BOOK in `docs/published-surface.md §EP-3`
   (J.W4 S7). Not in the W5 spec's clause roster (spec has a–f only). Appropriate fold: the
   manifest is W5's artifact; the disposition table lives there; gating it prevents silent
   un-disposition of a future export. The addition does NOT demote any correctness clause.

3. **`proof-published-surface.mjs` line count 728 vs spec estimate 625** — the clause (g)
   addition and fuller causal comments account for the growth. The runner logic matches the
   spec's clause descriptions.

---

## §5 Three-way agreement spot-audit (the W5 headline promise)

The spec's core promise: packed tarball == declared exports == README taught API.

| Axis | Claim | Verified |
| --- | --- | --- |
| tarball == `files` | `dist/` only, no `_redirects`, no `gh-pages/`, no `_proof-*` dirs | YES — `npm pack @mkbabb/keyframes.js` → 12 files; no non-library asset |
| exports == manifest | 40 public value exports (24 LIGHT + 16 HEAVY) each taught or manifested | YES — `proof:published-surface` clause (b) PASS; `docs/published-surface.md` 94 lines machine-checked |
| README runs == dist | 17 runnable snippets execute against built dist; 20 `// =>` results verified | YES — `proof:readme-runs` PASS; spot-runs 1–3 manually reproduced above |
| AnimationEngine interface == runtime | 16 interface keys ≡ 16 `Object.keys(engine)` | YES — clause (d) PASS; born-RED on planted drift |
| peer deps == dist imports | declared peers ⊆ dist imports | YES — `peerDependencies: undefined`; clause (f) PASS |

The doc-rot the J.W5 spec identified as the PRIMARY DEFECT (LS-1..8, ENG-5, TB-4) is
confirmed resolved: `grep "src/parsing\|src/units\|simple/\|balls/\|boxes/"` CLAUDE.md → 0
hits; demo dirs, test counts, and the LIGHT/HEAVY boundary are all accurate.

---

## §FOLD table

| Finding | Severity | Seam | Suggested wave class |
| --- | --- | --- | --- |
| F-W5-1: `proof:published-surface` in HYGIENE not CORRECTNESS tier | P2 | `package.json` `proof:correctness` script | K.W3 (estate) or K.W5 (packaging) |
| F-W5-2: `demo/CLAUDE.md:78` glass-ui pin stale (`~3.9.0` vs `~3.11.2` installed, `3.13.0` latest) | P2 | `demo/CLAUDE.md:78` | K.W5 (docs/packaging); pair with U-K14 glass-ui upgrade |
| F-W5-3: `package.json "description"` typo "standards-complaint" (should be "compliant") | P2 | `package.json:4` | K.W5 (packaging hygiene) |
| F-W5-4: `CLAUDE.md:61` frozen snapshot hint `(77 files / 754 tests …)` will re-rot in K | P2 | `CLAUDE.md:61` | K.W5 (docs hygiene) or K.W1 |
| F-W5-5: impl record + FINAL say "13 files (10 dist)" but tarball is 12 (9 dist) | P2 | frozen records — no action needed | N/A (historical; gate is authoritative) |
