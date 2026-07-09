# a09-w4-animate-excision — audit of R.W4's `animate()` excision

## Executive summary

The excision of `animate()` from the *published* surface is real and total: it is gone from
`load-engine.ts`'s runtime `Promise.all`/return object, gone from the `AnimationEngine` interface,
gone from `./engine`'s barrels (`engine/index.ts`, `engine/public.ts` — the latter has an explicit
"minus `animate`" comment), gone from `docs/published-surface.md`, gone from README, and gone from
the regenerated `llms.txt`/`llms-full.txt`. `CHANGELOG.md` under 5.1.0 → Removals states the change
honestly and gives a one-line migration path. `proof:published-surface`, `proof:in-is-importable`,
and `proof:agent-surface` all encode the correct floor. **This half of the wave was shipped as
specified.**

But the wave's own text oversold what "the file stays" would mean. §2.5 of `R.W4.md` justified
keeping `src/animation/animate.ts` on the grounds that "the file stays (it is a HEAVY chunk loaded
by `loadAnimationEngine`)" — implying `animate` would remain reachable through the dynamic boundary,
just off the static/typed surface. That is **false as shipped**: the commit that did the excision
(`1d4e3d9`) removed the runtime `import("./animate")` + assignment from `loadAnimationEngine()`
entirely. `animate.ts` today has **zero import edges from anywhere in `src/`** — not `.`, not
`./engine`, not `loadAnimationEngine()`. It is not bundled into any `dist/` chunk (verified: no
`animate-*.js` chunk exists in a local build, vs. `motion-path-*`, `draw-svg-*`, `morph-svg-*`,
`engine-*`, etc. which are all present). It is orphaned dead code, kept alive by exactly two test
files (`test/animate.test.ts`, `test/animate-orchestration.test.ts`, 373 combined lines) that
`import { animate } from "../src/animation/animate"` — a path that does not exist for any npm
consumer (`package.json` `"files": ["dist"]`). One of those two test files is wired into
`proof:hygiene-chain` (`proof:animate-orchestration`), so CI spends cycles asserting the dispatch
behavior of a function that is unreachable from the shipped package.

Separately, `CLAUDE.md:32` (the project's own architecture map — the file the CLAUDE.md preamble
says "OVERRIDES any default behavior") still describes `animate.ts` as *"animate() — single-call
front door … (HEAVY)"* with no note that it was excised from the public surface. `CLAUDE.md:71`
goes further and factually misstates the current HEAVY export list by including `animate` among
the names "reached ONLY via `await loadAnimationEngine()`" — which is now untrue; `animate` is
reached via nothing. Both lines were left untouched by a commit (`39b9e25`, same day, 45 minutes
*after* the excision commit `1d4e3d9`) that edited this exact file for an unrelated reason (the
demo-tree fusion), so the staleness is not an oversight of omission — CLAUDE.md was touched and the
animate lines were simply not caught.

No dedicated `MIGRATION-5.1.0.md` exists (unlike 5.0.0's `docs/MIGRATION-5.0.0.md`); the CHANGELOG
entry is the only migration note. Given the removal is a single symbol with a one-line fix and an
owner-ratified "stay in 5.x" semver call, this is proportionate — but it is worth flagging that a
strict SemVer read would call removing an exported function a MAJOR change; the owner explicitly
overrode this (commit `4359007`, "Version: 5.1.0 — stay in the 5.x line … recorded as removals —
not a major"), which is a legitimate policy call but is not visible to a consumer reading only
`package.json`'s version number.

## Findings

### F1 — `src/animation/animate.ts` is orphaned dead code, contradicting the wave's own stated rationale for keeping it (Medium)

**Evidence:**
- `R.W4.md:138`: *"The file stays (it is a HEAVY chunk loaded by `loadAnimationEngine`)"* — this is
  the sole stated justification for not deleting `animate.ts`.
- `src/animation/load-engine.ts` (current HEAD, all lines grepped for `animate`): zero hits inside
  the function body — no `import("./animate")`, no destructure, no return-object key. Confirmed by
  `git show 1d4e3d9` diff stat: the commit's own message says *"the runtime import(./animate)+
  assignment in loadAnimationEngine() [was removed]"*.
- `src/animation/engine/public.ts:13`: *"(minus `animate`, which R.W4 excised from the published
  surface)"* — the `./engine` subpath barrel explicitly does not carry it either.
- `grep -rn "import.*animate" src/` (excluding `animate.ts` itself and `motion-path.ts`'s prose
  comment) → **zero source-level import edges** into `animate.ts` from anywhere in `src/`.
- Local `npm run build` output `dist/` (gitignored, verified this session) has chunks for every
  other HEAVY leaf (`motion-path-*.js`, `draw-svg-*.js`, `morph-svg-*.js`, `engine-*.js`,
  `presets-*.js`, `sequence-*.js`, …) but **no `animate-*.js` chunk** — the file is not even bundled.
- Only consumers: `test/animate.test.ts:2` and `test/animate-orchestration.test.ts:2`, both
  `import { animate } from "../src/animation/animate"` — a deep-`src` path that is unreachable to
  any `npm i @mkbabb/keyframes.js` consumer (`package.json` `"files": ["dist"]`, confirmed by
  `proof:published-surface` clause (a)).
- `test/animate-orchestration.test.ts` is wired as `"proof:animate-orchestration"` in
  `package.json:83` and folded into `proof:hygiene-chain` (`package.json:236`, long chain
  includes `&& npm run proof:animate-orchestration &&`) — a CI-tier gate asserting the dispatch
  contract of code that ships to nobody.

**Why it matters:** "EXCISE as dead surface" (§2.5's own header) was not actually applied to the
dead surface — only to its advertisement. 213 lines of dispatch logic (`animate.ts`) + 373 lines of
tests survive purely to test themselves; this is the textbook shape of the "cosmetic decomposition"
failure mode the R audit itself was convened to catch (Q's "decomposition close" being cosmetic).
Tranche S should either (a) delete `animate.ts` + its two test files outright (true excision,
matching the header), or (b) keep it deliberately as an internal escape hatch and say so honestly
everywhere (README/CLAUDE.md/test describe strings) — the current state is neither.

**Proposal:** Delete `src/animation/animate.ts`, `test/animate.test.ts`,
`test/animate-orchestration.test.ts`, and `"proof:animate-orchestration"` from `package.json` +
`proof:hygiene-chain`. If any of the orchestration-dispatch behavior it encodes (`AnimationGroup`/
`Sequence` object-shape routing) is still wanted as a design reference, fold the *test intent* into
a comment on `AnimationGroup`/`Sequence` themselves, not a live import graph.

### F2 — `CLAUDE.md` (checked-in, override-tier project doc) is stale and factually wrong post-excision (Medium)

**Evidence:**
- `CLAUDE.md:32`: `│   ├── animate.ts              # animate() — single-call front door: shape
  dispatch + auto-target + auto-play (HEAVY)` — no mention that this was excised from the public
  surface in the very tranche this file's tree diagram otherwise reflects (7-zone partition, R.W1).
- `CLAUDE.md:71`: `**HEAVY (dynamic — reached ONLY via `await loadAnimationEngine()`):**
  `Animation`, `CSSKeyframesAnimation`, ... `animate`, `MotionPath`/`fromMotionPath`, ...` — this
  list is asserted as the current dynamic surface, but `animate` is not part of what
  `loadAnimationEngine()` returns (F1). This is not a stale historical note; it is a false claim in
  present tense in the file whose own preamble says "IMPORTANT: These instructions OVERRIDE any
  default behavior and you MUST follow them exactly as written."
- Timing: `git log --oneline -- CLAUDE.md` shows `39b9e25` ("R integration: CLAUDE.md demo tree →
  demo/scenes/ …") committed 2026-06-24 22:03:22, **45 minutes after** `1d4e3d9` ("R.W4 §2.3/…
  excise animate() …", 2026-06-24 21:18:23) — the file was touched post-excision for an unrelated
  edit and the animate lines were not caught in the same pass.

**Why it matters:** This is the exact kind of drift the R.W4 gate suite (`proof:published-surface`,
`proof:agent-surface`) exists to prevent for the *npm package* surface — but `CLAUDE.md` has no
gate at all, and it is the document Claude Code (and any future agent working this repo) is told to
treat as ground truth "exactly as written." An agent reading `CLAUDE.md:71` today would believe
`animate` is a supported dynamic export and could reintroduce it, or worse, tell a user it exists.

**Proposal:** Fix both lines in the same commit as F1's resolution (or independently if F1 is
deferred): drop `animate` from `CLAUDE.md:71`'s HEAVY list; either delete the `animate.ts` tree row
(if F1's delete path is taken) or annotate it `# EXCISED from published surface R.W4 — internal-only,
untested-by-npm-consumer` (if kept). Tranche S should add a lightweight doc-drift check (even a
grep-based proof) that CLAUDE.md's HEAVY/LIGHT export lists are a subset of `docs/published-surface.md`
— the same drift class bit `proof:agent-surface` for `llms.txt`; CLAUDE.md has no equivalent floor.

### F3 — No dedicated migration doc; SemVer-minor removal is a policy call, not a defect, but undocumented at the version-number level (Low/Info)

**Evidence:**
- `CHANGELOG.md:14` (5.1.0 → Removals) is the only migration note for `animate()`'s removal — no
  `docs/MIGRATION-5.1.0.md` companion, unlike 5.0.0's `docs/MIGRATION-5.0.0.md`.
- Owner ruling recorded at `docs/tranches/R/PROGRESS.md` (commit `4359007`): *"Version: 5.1.0 — stay
  in the 5.x line … the zero-adoption trims (animate(), the granular load* accessors) recorded as
  removals — not a major."* This is an explicit, provenance-tracked decision, not an oversight.
- A consumer pinning `^5.0.0` and running `npm update` would silently lose `animate` (had they ever
  imported it — 0 known real-world sites) with no MAJOR bump signal; the removal is disclosed only
  in prose, not enforced by SemVer tooling.

**Why it matters:** Given genuinely 0/32 adoption this is a defensible call and is honestly
disclosed in the CHANGELOG — flagging as low/info only because Tranche S's "no legacy/deprecated
code anywhere" mandate should be paired with an explicit SemVer discipline note (e.g., "a
zero-adoption unpublished-in-README export may be removed within a MINOR if CHANGELOG discloses it
under Removals") so future waves don't have to re-litigate this fork per-symbol.

**Proposal:** Either backfill a short `docs/MIGRATION-5.1.0.md` (one entry, mirrors the CHANGELOG
line) for parity with the 5.0.0 precedent, or explicitly retire the migration-doc convention and
say CHANGELOG-only is the standing policy going forward — pick one, state it once.

### F4 — Stale "front-door" framing survives in the two orphaned test files' describe strings (Low, subsumed by F1)

**Evidence:** `test/animate.test.ts:5`: `describe("animate() — front-door dispatch", ...)`;
`test/animate-orchestration.test.ts:41`: `describe("proof:animate-orchestration — animate()
dispatches the orchestration tier (W127)", ...)`. Both call `animate()` "the front door," which is
no longer true post-R.W4 — it is an unexported internal function.

**Why it matters:** Minor in isolation; it is evidence corroborating F1 (these files were not
touched at all during the excision — the excision commit's diff stat lists only `README.md`,
`docs/published-surface.md`, `llms*.txt`, `scripts/lib/agent-surface.mjs`,
`scripts/proof-published-surface.mjs`, `scripts/proof-readme-runs.mjs`, `src/animation/index.ts`,
`src/animation/load-engine.ts` — no `test/animate*.test.ts` in that commit or any later R commit).

**Proposal:** Resolved automatically by F1's delete path; otherwise reword both describe strings to
"internal dispatch (unexported)" if kept.

## What was checked and found clean (no residue)

- `README.md`: zero front-door `animate(` references; all 4 `animate(` hits are `Element.animate()`
  (WAAPI) prose/table entries — correctly distinct from the excised symbol.
- `docs/published-surface.md`: zero `animate` rows (the R.W4 commit's diff stat confirms a 1-line
  removal here).
- `CHANGELOG.md`: correct, honest 5.1.0 Removals entry with a one-line migration path; the 3 other
  `animate(`/`animate()` hits are all historical (4.x/F.W12-era) entries, correctly left untouched.
- `scripts/lib/agent-surface.mjs` + regenerated `llms.txt`/`llms-full.txt` (regenerated this session
  via `node scripts/gen-agent-surface.mjs`, output discarded, working tree left clean): zero
  `animate(` front-door hits.
- `scripts/proof-published-surface.mjs`/`proof-readme-runs.mjs`: the `animate` mentions present are
  either historical J.W5 born-RED-state documentation (harmless, describes a past state) or the
  correct current floor language; no assertion still requires `animate` to be published.
- `demo/@`, `demo/app`, `demo/scenes`, `demo/playground/src`: zero `animate(` call sites (0/32,
  matching the wave's own adoption count both before and after — nothing needed converting because
  nothing ever called it).
- `bench/interp-buffer.bench.ts:491-493`: a comment correctly notes the R.W4 excision and uses
  `CSSKeyframesAnimation` as the replacement idiom — this is the one place in the non-doc tree that
  got the framing right.
- Gate wiring: `proof:in-is-importable`, `proof:agent-surface`, `proof:published-surface`,
  `proof:boundary` all correctly encode the post-excision floor; no vacuous or reverted assertions
  found.

## Tranche-S implications

1. **Delete the orphan.** Fold "delete `src/animation/animate.ts` + `test/animate.test.ts` +
   `test/animate-orchestration.test.ts` + the `proof:animate-orchestration` gate" into the S wave
   that does the "NO legacy/deprecated code anywhere" sweep — this is exactly that class of residue,
   just not yet caught by a gate. Estimate: trivial (3 file deletes + 2 package.json line removals),
   no re-RED risk since nothing imports these files outside themselves.

2. **Fix `CLAUDE.md:32,71` in the same commit** — drop `animate` from the HEAVY export list, correct
   or annotate the tree-diagram row. Do this as a small, fast, first-wave hygiene item; it is a
   one-owner, two-line fix with zero design risk, and it is currently giving any agent reading the
   file wrong information about the runtime surface.

3. **Consider a CLAUDE.md-vs-published-surface drift gate.** The same "hand-maintained doc silently
   diverges from the runtime source of truth" failure mode that motivated
   `proof:published-surface` clause (d) (`AnimationEngine` interface ≡ runtime) exists identically
   for `CLAUDE.md`'s own LIGHT/HEAVY lists, and nothing catches it. A cheap `proof:claudemd-surface`
   (grep CLAUDE.md's two export-name lists, assert both are subsets of `docs/published-surface.md`
   rows) would have caught F2 the moment `1d4e3d9` landed. Worth a half-day gate-authoring item in
   Tranche S's hygiene band.

4. **Settle the migration-doc convention once.** Either backfill `docs/MIGRATION-5.1.0.md` for
   symmetry with 5.0.0, or explicitly write down (in `CONTRIBUTING`/`R.md`-successor doc) "CHANGELOG
   Removals section is the sole migration-note vehicle going forward for MINOR-tier symbol
   removals" so this fork isn't re-litigated per future excision.

5. **Methodology note for the audit itself:** this lane is a good illustration that "the gate is
   green" and "the excision is honest" are different claims — every wired proof gate here is
   correctly green, yet the wave still left orphaned code + a stale override-tier doc. Tranche S's
   per-wave discharge checklist should explicitly require a "grep the whole tree for the excised
   symbol name, not just the files the spec named" step before a wave is marked ✅, since the R.W4
   spec itself only named 8 files to touch (`R.W4.md` §2.5) and `CLAUDE.md` was never one of them.
