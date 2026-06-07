# G audit — a-constellation-gaps

**Lane**: the constellation perfection — keyframes.js ⟷ value.js (0.11.0) ⟷
parse-that (0.9.0) ⟷ glass-ui (3.3.0) ⟷ the deploy spine (`~/Programming/deploy`).
**Mode**: research + audit ONLY. Zero source/CI/demo edits. Every finding is a
proposal with a disposition + a falsifiable instrument (for SHIP) or a named
cross-repo owner (for HANDOFF).
**Branch**: tranche-g-dev. kf published 4.0.0; value.js 0.11.0; parse-that 0.9.0;
glass-ui 3.3.0; keyframes.babb.dev on Cloudflare Pages.

Grounding read: `docs/tranches/F/FINAL.md`, `docs/tranches/F/F.md`,
`~/Programming/deploy/README.md`, `~/Programming/deploy/templates/ci.yml`,
`~/Programming/deploy/cf/{pages-deploy.sh,dns-cf-sync.sh}`,
`~/Programming/deploy/docs/grand-audit-ci-deploy-2026-06-02.md`,
`~/Programming/fourier-analysis/docs/constellation/{CONSTELLATION.md,
ADOPTION-ASKS.md,PRECEPTS-SYNC.md}`, and the live sibling trees. The dispositions
EXTEND those docs; they do not repeat them.

---

## §0 — The headline (re-pin debt: the F sibling wins are dormant in kf)

F.md's central cross-repo claim — *"kf consumes them unchanged through the
`lerpValue → iv._lerp` seam on re-pin (ZERO kf edit needed)"* (`F/FINAL.md`, the
Band-1 F.W6 row + the Cross-repo hand-offs section) — is **architecturally
correct and currently UNREALIZED**. value.js 0.11.0 and parse-that 0.9.0 are
PUBLISHED (registry-verified: `npm view @mkbabb/value.js version` = `0.11.0`,
`npm view @mkbabb/parse-that version` = `0.9.0`), but kf still pins the prior
majors and the lockfile resolves them:

- `package.json:86` — `"@mkbabb/value.js": "^0.10.0"`
- `package.json:85` — `"@mkbabb/parse-that": "^0.8.2"`
- `package-lock.json` — `node_modules/@mkbabb/value.js` resolves `0.10.0`
  (tgz + integrity sha pinned); `node_modules/@mkbabb/parse-that` resolves
  `0.8.2`.
- `node_modules/@mkbabb/value.js/package.json` installed = `0.10.0`;
  `node_modules/@mkbabb/parse-that/package.json` installed = `0.8.2`.

Because the caret `^0.10.0` does NOT admit `0.11.0` (semver: a 0.x minor bump is
a breaking-range boundary), `npm ci` will NEVER pull 0.11.0 without a
`package.json` edit + lockfile regen. **The whole F value.js hand-off (the
1607-green-tests drive) is invisible to the shipped 4.0.0 and to the live
keyframes.babb.dev build.** This is the single largest constellation gap in this
lane and the one unambiguous SHIP-in-G.

It is a NEWER debt than the H-era `cascade-kf` booking
(`ADOPTION-ASKS.md:119`, `H/waves/W6-W7-epsilon-booking.md §2B`): that booking is
about glass-ui's CI install consuming kf at `file:`→`^3.0.0`, authored against
kf 2.x and now stale (glass-ui shipped 3.3.0). The kf→value.js/parse-that re-pin
surfaced only *after* the F publish, so no existing ledger row covers it. (The
CONSTELLATION.md roster itself is stale here — `§1` shows kf at 3.0.0 and
value.js at L; both have since shipped 4.0.0 / 0.11.0. The constellation docs lag
the published reality by one full tranche.)

---

## §1 — SHIP-in-G

### G-CONST-1 — `chore(deps)`: re-pin value.js `^0.10.0`→`^0.11.0` (the dormant F color + computed wins)  [SHIP-in-G]

**The gap, file:line-grounded.** kf calls `prepareInterpVar` at
`src/animation/utils.ts:339` (`return prepareInterpVar(normalizeValueUnits(l, r,
opts));`), imported at `src/animation/utils.ts:11`. The hot interp path runs
through `lerpValue(eased, iv)` at `src/animation/engine.ts:731` (import at
`engine.ts:18`). In value.js 0.11.0, `prepareInterpVar`
(`value.js/src/units/interpolate.ts:215`) sets BOTH `iv._lerp` AND — for color
ivs — `iv._colorPlan = buildColorChannelPlan(...)` (the B3+B5 "frozen
color-channel plan — closure-free per-frame lerp", value.js commit `c868f3d`),
and `lerpValue`'s fast path (`interpolate.ts:191`) dispatches straight through
`iv._lerp`.

**Measured-absent in the pinned version.** The installed 0.10.0 dist DOES carry
`prepareInterpVar` (`grep -c prepareInterpVar
node_modules/@mkbabb/value.js/dist/value.js` = 3), but it does NOT carry the F
wins:
`grep -o '_colorPlan\|buildColorChannelPlan\|bumpLayoutEpoch'
node_modules/@mkbabb/value.js/dist/value.js` returns **empty** — all three
symbols are 0.11.0-only (present in `value.js/src/units/interpolate.ts` ×6 and
`value.js/src/units/normalize.ts` ×4, commits `c868f3d` color-plan + `5c947de`
computed-endpoint cache C1/C2/C4/C7). So today kf's color interpolation walks the
per-frame closure path and re-resolves computed endpoints every frame; the
−94%-computed and the closure-free color lerp F PROVED and PUBLISHED are dead in
the shipped engine.

**Why this is the idiomatic fix, not a workaround.** F deliberately landed these
wins in value.js (the §Mandate "no boundary breach" — a kf-side wrapper would
duplicate value.js's resolver). The seam (`prepareInterpVar` /
`lerpValue`/`iv._lerp`) is ALREADY in place and unchanged. The re-pin is the
SINGLE motion F's architecture designed for; not doing it is the legacy-shape
(shipping behind a published better dependency).

**The honest correctness caveat.** A 0.x minor in semver can carry breaking
changes — value.js 0.11.0 folds A2 (the maximal-munch unit classifier, commit
`e684bce`, "latent boundary correctness") and C5 (24 no-op length units,
`8383bd8`). These CHANGE parse/normalize behaviour at the boundary kf consumes
(`normalizeValueUnits`, `flattenObject`, the `tryParse` path in
`utils.ts:257`). So the re-pin is NOT mechanical — it routes a real behaviour
delta through kf's gates. This is correct: F.md's own `ci.yml:32-35` note says
"a breaking value.js publish surfaces here at `npm ci` + build:lib... the
standard chore(deps) bump routes the breakage through a PR." That PR is G.

**Instrument (falsifiable, BITES):** the existing `npm run proof:all` (the 21
green-wired gates, `package.json` scripts) re-run against the re-pinned tree —
specifically `proof:engine-correctness` (the five engine correctness locks) +
the full `vitest run` (the 261-test suite is the pixel-identity lock F.W4 named).
Pass-condition: green AND a NEW assertion that the resolved value.js is
`>=0.11.0` — add a one-line check to `proof:boundary` (`scripts/proof-boundary.mjs`)
or a tiny `proof:deps-current` that reads `node_modules/@mkbabb/value.js/
package.json` version and `package.json` caret, failing if either is below the
F-published floor. Without that assertion the re-pin can silently regress on a
later lockfile drift — exactly the drift class the constellation grand-audit
calls out for siblings (`grand-audit:182`, slides' branch-drift no-op).

### G-CONST-2 — `chore(deps)`: re-pin parse-that `^0.8.2`→`^0.9.0` — but VERIFY the dual-realm seam first  [SHIP-in-G, with a measure-first clause]

**The gap.** kf imports parse-that directly: `src/animation/utils.ts:1`
(`import { any as parseAny } from "@mkbabb/parse-that"`), used at
`utils.ts:258` ((`parseAny as any)(fnArgs, CSSValues.Value)`). The pin is
`^0.8.2` (`package.json:85`); 0.9.0 is published. parse-that 0.9.0's wins
(parse-that commits `508aa6b` ParserState furthest-offset/diagnostics, `c9338e4`
the dead-packrat isolation +~36ns/parse off the hot path, `d02733e` the §1.5
`parseSingleValue`/`parseFunctionArgs` root expose, `6fb9de2` the span-dist
reconcile) are the F parse-that hand-off (`F/FINAL.md`, parse-that row).

**The load-bearing complication (file:line).** kf already documents a
cross-realm hazard at `src/animation/utils.ts:246-250`: *"value.js and
keyframes.js each ship their own copy of @mkbabb/parse-that under different
node_modules realms, so the Parser<T> classes are nominally distinct... Cast to
`any` to bypass the cross-realm type comparison."* The reason there ARE two
realms: **value.js 0.11.0 ITSELF still pins parse-that `^0.8.2`**
(`git show HEAD:package.json | grep parse-that` in value.js = `^0.8.2`;
`npm view @mkbabb/value.js@0.11.0 dependencies` = `{ '@mkbabb/parse-that':
'^0.8.2' }`). So if kf re-pins parse-that to `^0.9.0` while value.js stays on
`^0.8.2`, the two realms DIVERGE BY MINOR (kf's 0.9.0 vs value.js's 0.8.2) — the
`as any` cast at `utils.ts:258` still compiles, but the RUNTIME `Parser<T>`
instances kf hands value.js's `tryParse`/`CSSFunction.FunctionArgs` are now from
a different parse-that version. That is exactly the class of latent breakage the
re-pin must not paper over.

**Disposition.** SHIP the parse-that re-pin in G **only after** verifying — under
the re-pinned tree — that the `utils.ts:251-260` cross-realm parse round-trips
green (the existing `test/parsing.test.ts` + `test/editor-parsing.test.ts` +
`test/units.test.ts` exercise this exact `parseAny`/`CSSFunction.FunctionArgs`
path). If green, ship. If the realm divergence bites, the idiomatic fix is the
HAND-OFF below (G-HANDOFF-1: value.js re-pins parse-that to `^0.9.0` first, so
both realms converge), NOT a kf-side shim.

**Instrument:** `npm run proof:all` green under the re-pinned tree + a NEW
`proof:deps-current` clause asserting the parse-that kf resolves and the
parse-that value.js resolves are the SAME minor (read both
`node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that/package.json` —
if nested — and the top-level one; fail on a minor mismatch). This converts the
silent `as any` cross-realm hazard into an explicit, gated invariant — the
§Mandate's "fail EXPLICITLY, no silent handling."

### G-CONST-3 — kf's `deploy-pages.yml` green-CI-gated pattern → promote UP into the deploy spine as the missing CF-Pages CI template  [SHIP-in-G as a kf→deploy HANDOFF authoring; the WRITE is deploy's]

**The gap (constellation CREATE).** The deploy spine README's target structure
(`deploy/README.md`, "Target structure") lists `cf/pages-deploy.sh` (the
wrangler shell recipe — PRESENT, `deploy/cf/pages-deploy.sh`) and
`templates/ci.yml` (the generic lint→typecheck→build→test CI — PRESENT). It does
**NOT** carry a CF-Pages *deploy* WORKFLOW template. Verified: `ls
deploy/templates/ deploy/cf/` shows only `pages-deploy.sh` + the generic
`ci.yml`; `grep -rln 'workflow_run\|deploy-pages\|green-CI' deploy/` matches ONLY
the grand-audit doc, never a template.

Meanwhile kf authored — at F close — the exact missing piece:
`.github/workflows/deploy-pages.yml`, the **green-CI-gated `workflow_run`
deploy** (`deploy-pages.yml:21-24` triggers on the `ci` workflow completing;
`:36-40` deploys ONLY when that same-SHA run is `success` on `master` push;
`:49-67` re-imposes the demo path filter that `workflow_run` drops). This IS the
constellation inv-28 "verified-deploy-of-record" shape the grand-audit names
(`grand-audit:182` flags a sibling — slides — whose `deploy-pages.yml` silently
no-ops on a `main`-vs-`master` drift; kf's `:39` `head_branch == 'master'` guard
is precisely the fix that sibling lacks).

So kf has independently built the spine's missing template, hardened against the
exact defect that bit a sibling. The idiomatic constellation move is to
**distil kf's `deploy-pages.yml` into `deploy/templates/deploy-pages.yml`** (a
parameterized `<PAGES_PROJECT>`/`<BUILD_CMD>` template, the same way
`deploy/templates/ci.yml` is parameterized), so every CF-Pages app (color,
sudoku, slides, future libraries) adopts ONE green-CI-gated deploy shape instead
of re-deriving it (and re-introducing the branch-drift no-op).

**Disposition:** kf AUTHORS the template content + the rationale in G (this is
read-only kf-side analysis); the WRITE into `deploy/templates/` is a
**deploy-HANDOFF** (deploy is fourier-owned per CONSTELLATION.md §1; inv-16). kf
ships nothing in its own tree for this — it is a constellation CREATE proposal.

**Instrument (for the deploy side, named here):** a `deploy`-repo shellcheck +
`actionlint` of the vended `templates/deploy-pages.yml` (the spine's own
`dev.sh build`=shellcheck+yamllint posture, `grand-audit:123` M6.3) + a one-line
assertion that the template carries the `head_branch == 'master'` guard (the
anti-drift clause). kf's contribution is verified by `kf deploy-pages.yml` BEING
the source of record (cite kf `:36-40` in the template header).

---

## §2 — HAND-OFFs (cross-repo, owner-named)

### G-HANDOFF-1 — value.js: re-pin its OWN parse-that `^0.8.2`→`^0.9.0` (converge the realms)  [value.js-HANDOFF]

value.js 0.11.0 pins parse-that `^0.8.2` (verified above). The kf dual-realm
hazard (`utils.ts:246-250`) only exists because the two repos pin different
parse-that majors. The clean gestalt fix is for value.js to adopt 0.9.0 first;
then kf's G-CONST-2 re-pin lands BOTH realms on 0.9.0 and the `as any`
cross-realm cast at `utils.ts:258` is over a SINGLE version (still nominally two
realms by node_modules layout, but byte-identical Parser classes). Owner:
value.js maintainer. This is the hard predecessor of a clean kf G-CONST-2 close.
Trigger: a value.js `chore(deps)` PR + tag-publish (0.11.x patch or 0.12.0). NB
the §Mandate inv-16 relaxation for G impl lets the user drive value.js — but
this is tagged a HANDOFF so the ordering (value.js first, then kf) is explicit.

### G-HANDOFF-2 — deploy: accept kf's `deploy-pages.yml` as the CF-Pages CI template (the §1 G-CONST-3 authoring)  [deploy-HANDOFF]

See G-CONST-3. kf authors; deploy (fourier-owned) writes
`templates/deploy-pages.yml`. This also discharges the open ADOPTION-ASKS row
113 (*"value.js, keyframes.js | converge GH-Pages→CF-CNAME to CF Pages per
deploy/cf/pages-deploy.sh | OPEN — re-affirmed G.W8"*) by giving the constellation
the *automated* (CI-gated) half the shell recipe alone can't enforce.

### G-HANDOFF-3 — deploy: verify + correct kf's `.pages.dev` subdomain in `dns-cf-sync.sh` (DNS drift)  [deploy-HANDOFF]

`deploy/cf/dns-cf-sync.sh:105` carries
`"CNAME|keyframes.babb.dev|keyframes.pages.dev|true"  # UNVERIFIED —
owner-confirm`. The grand-audit M2.1 (`grand-audit:82`) flags this as **P0** — a
blind sync run REGRESSES the live CNAME, because the real subdomain may be
suffixed. kf's actual CF project is `keyframes` → **`keyframes-8uq.pages.dev`**
(authoritative: `kf .github/workflows/deploy-pages.yml:4-5` header +
`scripts/pages-deploy.sh:47` comment `keyframes-8uq.pages.dev /
keyframes.babb.dev`). So the DNS target in the spine is WRONG (`keyframes.pages.dev`
≠ `keyframes-8uq.pages.dev`). The owner-confirm the grand-audit booked is hereby
SATISFIED from kf's tree: patch `dns-cf-sync.sh:105` to
`keyframes-8uq.pages.dev` and drop the `UNVERIFIED` comment. Owner: deploy
(fourier). This is a live-correctness fix, P0 by the grand-audit's own rating.

### G-HANDOFF-4 — the constellation docs lag the published reality by one tranche  [RECORD / fourier-coordination]

`CONSTELLATION.md §1` shows kf at 3.0.0 and value.js at "L CLOSED"; reality is kf
4.0.0 (D+E+F) and value.js 0.11.0 published. `ADOPTION-ASKS.md` rows 118-120 cite
value.js `^0.10.0` / keyframes `^2.1.1` / glass-ui `^3.0.0` — all superseded. The
`CONSTELLATION.md` self-mandate (*"Reconcile against reality whenever a member's
tranche head moves"*, its §preamble) is owed a refresh. Not a kf write; recorded
for the fourier hub. The kf-relevant correction: kf's roster row should read
"4.0.0 PUBLISHED (D+E+F); CF-Pages deploy-of-record live."

---

## §3 — MEASURE-FIRST / BOOK

### G-CONST-4 — kf CI `submodules:` checkout vs the spine template  [MEASURE-FIRST → likely KILL-as-non-gap]

The spine `templates/ci.yml` checks out `with: submodules: recursive`
(`deploy/templates/ci.yml`, the `node-build` job) because constellation repos
carry the `docs/precepts` submodule. kf's `ci.yml` does NOT pass `submodules:`
(verified: `ci.yml:50,76,134` are bare `actions/checkout@v5`). On its face this
looks like a conformance gap. **Measure-first verdict: it is NOT.** kf's CI gates
build only `src/`→`dist/` + the demo + the proof scripts; the precepts submodule
(`docs/precepts`, gitlink `8ccf9f4`, `.gitmodules` present) is consumed ONLY by
`scripts/capture.mjs:6` (a documentation/screenshot aid), which no CI gate
invokes. So a submodule checkout would add clone cost for zero gate benefit. The
spine template's `submodules: recursive` is correct for repos whose BUILD reads
the submodule (fourier reads precepts content at build); kf does not. Disposition:
**KILL** as a phantom gap — record the asymmetry-is-intent (mirror the
grand-audit M2.2 pattern, `grand-audit:83`, where keyframes-frontend-only is
documented as intent not omission). Optional micro-SHIP: a one-line comment in
`ci.yml` stating "no `submodules:` — precepts is docs-only, no gate reads it" so
the divergence reads as deliberate.

### G-CONST-5 — action/node version skew vs the spine template  [RECORD — kf is AHEAD, not behind]

Spine `templates/ci.yml` uses `actions/checkout@v4` + `setup-node@v4` + node
`22`. kf uses `@v5` + node `24` (`ci.yml:50-53`, `deploy-pages.yml:79-81`,
`release.yml:32-34`). This is kf AHEAD of the template (the template is the
floor, authored 2026-05-29 per its header). Not a kf gap. RECORD: the spine
template should bump its pins to v5/node-24 to match the published-library
reference shape kf+value.js set — a deploy-HANDOFF housekeeping item, low
priority. kf needs no change.

### G-CONST-6 — precepts submodule: kf is ALREADY-SYNCED  [ALREADY-SOTA — no action]

`PRECEPTS-SYNC.md` (2026-06-04) records kf at `8ccf9f4` "already synced
(no-op)". Verified live: `git submodule status` = `8ccf9f4...
docs/precepts (heads/main)`, `.gitmodules` present and pointing at
`mkbabb/precepts`. kf is one of the 5/7 synced repos (value.js + glass-ui were
the two BOOKED). No gap. Recorded so a future session doesn't re-investigate.

---

## §4 — ALREADY-SOTA (honest record — do NOT manufacture a deficit)

The constellation seams D+E+F left exemplary; the following are idiomatic and
left alone:

1. **The light/heavy value.js boundary** (`src/animation/index.ts`,
   `src/animation/CLAUDE.md`) — the light engines carry ZERO static value.js
   edge; only the HEAVY `engine.ts` reaches it, behind `loadAnimationEngine()`.
   Gated by `proof:boundary`. The re-pin (G-CONST-1) flows through this seam
   untouched — the boundary is exactly why the re-pin is a one-motion `chore`.

2. **glass-ui consumption is correctly demo-only + optional.** `package.json:88`
   `"@mkbabb/glass-ui": "file:../glass-ui"` under `optionalDependencies`. Zero
   `src/` imports (`grep @mkbabb/glass-ui src/` = empty); 49 demo files consume
   it. The published library tarball ships `dist/` only (`package.json` `files:
   ["dist"]`) — glass-ui never enters the published graph. The CI handles the
   dangling optional link honestly (`ci.yml:14-25`, disposition (b), stated). The
   glass-ui 3.3.0 vs CI-pin 3.2.0 (`ci.yml:156`, `deploy-pages.yml:89`) is a
   pinned-known-good reproducibility choice the CI documents (`ci.yml:148-153`),
   advanced by an explicit `chore(ci)` bump — NOT a drift. (A G micro-SHIP could
   bump the CI pin to `v3.3.0` to track the published hub, but it is housekeeping,
   not a gap; the pinned-pin discipline is correct.)

3. **The legacy GitHub-Pages deploy path is FULLY EXCISED** (the §Mandate's
   no-legacy). `.github/workflows/` = `{ci, deploy-pages, release}.yml` only — no
   `deploy.yml`, no peaceiris/JamesIves gh-pages-branch action (`grep peaceiris
   .github/` = empty). The surviving `gh-pages` is a vite build MODE name
   (`package.json:40`), consumed by `pages-deploy.sh:50` as `BUILD_CMD` — a build
   target, not a deploy mechanism. The retirement F.md described is real and
   complete.

4. **The CF-Pages deploy adoption is genuine + hardened.** `scripts/pages-deploy.sh`
   is the spine recipe (project pre-flight `:55-63`, rollback-target capture
   `:65-78`, commit-message ASCII sanitisation `:85-97`) — the three properties
   `deploy/cf/pages-deploy.sh` proves matter, adopted faithfully. The
   green-CI-gated `deploy-pages.yml` is the inv-28 verified-deploy-of-record
   shape — and (G-CONST-3) it is AHEAD of the spine, not behind it.

5. **release.yml** is the constellation library-publish standard: tag-gated
   (`release.yml:19-22`), `--provenance` (`:46`, SLSA via OIDC `id-token: write`
   `:26`), library-scoped gate (`check:lib`→`build:lib`→`test`→`proof:boundary`,
   `:38-45`), glass-ui-free. This is the exact discipline the grand-audit
   (`grand-audit:180`) names as the constellation reference ("tag-gated publish +
   `--provenance` + changesets-driven bumps") — kf IS the reference, not a
   laggard.

The ONLY real, actionable constellation gaps in this lane are the re-pin debt
(§1 G-CONST-1/2) and the constellation-CREATE/HANDOFF items (§1 G-CONST-3,
§2 G-HANDOFF-1..4). The CI/deploy/precepts conformance is otherwise complete or
kf-ahead.

---

## §5 — Disposition ledger

| ID | Finding | Disposition | Instrument / Owner |
|---|---|---|---|
| G-CONST-1 | re-pin value.js `^0.10.0`→`^0.11.0` (dormant F color-plan + computed-endpoint −94% wins) | **SHIP-in-G** | `proof:all` green + NEW `proof:deps-current` (resolved value.js ≥ 0.11.0) |
| G-CONST-2 | re-pin parse-that `^0.8.2`→`^0.9.0` | **SHIP-in-G** (after realm-verify) | `proof:all` green + `proof:deps-current` same-minor-as-value.js assertion |
| G-CONST-3 | kf's green-CI-gated `deploy-pages.yml` → spine CF-Pages CI template | **SHIP-in-G** (kf authors) + **deploy-HANDOFF** (writes) | deploy shellcheck/actionlint + `head_branch=='master'` anti-drift clause |
| G-HANDOFF-1 | value.js re-pin its OWN parse-that `^0.8.2`→`^0.9.0` (converge realms) | **value.js-HANDOFF** | value.js maintainer; predecessor of G-CONST-2 |
| G-HANDOFF-2 | deploy accept the CF-Pages CI template | **deploy-HANDOFF** | fourier; discharges ADOPTION-ASKS row 113 |
| G-HANDOFF-3 | deploy fix `dns-cf-sync.sh:105` `keyframes.pages.dev`→`keyframes-8uq.pages.dev` | **deploy-HANDOFF** (P0) | fourier; satisfies grand-audit M2.1 owner-confirm |
| G-HANDOFF-4 | constellation docs lag published reality (kf 3.0.0→4.0.0, value.js L→0.11.0) | **RECORD** | fourier hub refresh |
| G-CONST-4 | CI `submodules:` vs spine template | **KILL** (phantom; no gate reads precepts) | optional one-line intent comment |
| G-CONST-5 | action/node version skew | **RECORD** (kf is AHEAD) | spine bump, low priority |
| G-CONST-6 | precepts submodule sync | **ALREADY-SOTA** | none |

---

## §6 — inv-epsilon attestation

Every claim above cites a verified artifact, read-only:
- kf pins/lock: `package.json:85-86,88`, `package-lock.json` (value.js 0.10.0 /
  parse-that 0.8.2 nodes), `node_modules/@mkbabb/{value.js,parse-that}/package.json`.
- The seam: `src/animation/utils.ts:1,11,246-260,339`, `engine.ts:18,731`.
- value.js 0.11.0 wins: `value.js/src/units/interpolate.ts:182-235`,
  `normalize.ts:151-166`; commits `5c947de`/`c868f3d`/`e684bce`/`8383bd8`/`eeff123`;
  `npm view @mkbabb/value.js version`=0.11.0, `@0.11.0 dependencies` parse-that
  `^0.8.2`.
- parse-that 0.9.0: commits `6fb9de2`/`d02733e`/`c9338e4`/`508aa6b`;
  `npm view @mkbabb/parse-that version`=0.9.0.
- The 0.10.0-absent F symbols: `grep -o '_colorPlan|buildColorChannelPlan|
  bumpLayoutEpoch' node_modules/@mkbabb/value.js/dist/value.js` = empty.
- kf workflows: `.github/workflows/{ci,deploy-pages,release}.yml` (line cites in
  text); `scripts/pages-deploy.sh:47,50,55-97`.
- deploy spine: `deploy/README.md`, `deploy/templates/ci.yml`,
  `deploy/cf/{pages-deploy.sh,dns-cf-sync.sh:99-105}`,
  `deploy/docs/grand-audit-ci-deploy-2026-06-02.md:82-83,123,180-182`.
- constellation: `CONSTELLATION.md §1/§3/§9`, `ADOPTION-ASKS.md:113,118-120`,
  `PRECEPTS-SYNC.md` (the 2026-06-04 table); kf `git submodule status` = `8ccf9f4`.
- F record extended: `F/FINAL.md` (the Cross-repo hand-offs + Band-1 F.W6 rows).

No kf source/test/CI/demo file was written. The deploy/value.js/parse-that
items are HAND-OFFs to their own maintainers; the kf-side SHIPs (G-CONST-1/2) are
`package.json` + lockfile + one proof-gate authoring, routed through a PR per the
`ci.yml:32-35` chore(deps) discipline.
