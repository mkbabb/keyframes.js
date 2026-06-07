# a-ci-streamline — CI assay (Tranche G post-F deep audit)

Lane id: `a-ci-streamline`. Branch `tranche-g-dev` (kf 4.0.0; value.js 0.11.0,
parse-that 0.9.0 published; keyframes.babb.dev on Cloudflare Pages).

Scope: `.github/workflows/{ci.yml, deploy-pages.yml, release.yml}` + the
`scripts/` instruments they invoke (`proof-ci-coverage.mjs`, `pages-deploy.sh`),
against the constellation CI standard (`~/Programming/deploy/templates/ci.yml`
+ `~/Programming/fourier-analysis/.github/workflows/{ci,deploy-pages}.yml`).

GROUNDING / non-repeat: F.W2 (`F/F.md:190-200`) shipped `proof:ci-coverage` +
wired the inv-tagged demo gates into CI; F.W17 (`F/FINAL.md:108-124`) retired
the legacy GitHub-Pages `deploy.yml`, adopted the CF-Pages spine + `inv-28`
green-CI-gating. This lane VERIFIES those landed and EXTENDS into the residual
drift/redundancy F did not chase. I cite F where I build on it; I do not re-litigate.

---

## VERDICT IN ONE LINE

The CI constellation is **largely ALREADY-SOTA** — F.W2 + F.W17 left it
exemplary (legacy fully excised, inv-28 gating correct, provenance signed,
gate-coverage self-policing). The residual is **drift + DRY**, not architecture:
one hardcoded-stale version string, one verbatim-duplicated glass-ui-sibling
block across two workflows, a stale glass-ui pin (v3.2.0 while v3.3.0 is HEAD),
a missing `concurrency` guard on `ci.yml`/`release.yml`, a node-version
divergence from the constellation standard (24 vs 22), and a thin
release/gates overlap. No KILLs of substance; no legacy found.

---

## §0 — LEGACY EXCISION: VERIFIED CLEAN (the F-deploy retirement held)

The prompt's first charge: confirm the retired GitHub-Pages `deploy.yml` is
gone with no dangling refs to gh-pages / peaceiris / CNAME.

**VERIFIED GONE.** `find .github -type f` returns exactly three files:
`ci.yml`, `deploy-pages.yml`, `release.yml` — no `deploy.yml`. Git history
confirms the excision was a real delete, not a rename:
`8fea80c ci(deploy): move keyframes.babb.dev onto Cloudflare Pages (off GitHub Pages)`
and `c901cfb chore(tranche-F W17): … deploy.yml …`.

A repo-wide grep for `peaceiris|gh-pages@|JamesIves|actions-gh-pages|CNAME|deploy\.yml`
across `.github/`, `scripts/`, `package.json` returns **one** hit:
`deploy-pages.yml:6` — a *descriptive* comment ("the old gh-pages/deploy.yml
path served a parallel site the DNS never pointed at; it is RETIRED"). That is a
provenance note, not a dangling reference: no action invocation, no branch, no
file path that resolves. The `gh-pages` token elsewhere is the *npm script name*
`npm run gh-pages` (the vite demo-build mode → `dist/gh-pages`), which is the
demo's build output dir, NOT the retired GitHub-Pages branch.

**Disposition: ALREADY-SOTA.** The retirement is total + honest. The lone
comment is the Mandate-correct way to record an excision (a future reader knows
*why* there is no GitHub-Pages path). No action. **Leave alone.**

One micro-nit recorded, not shipped: the comment lives only in
`deploy-pages.yml`; the *demo build artefact dir is still literally named
`dist/gh-pages`* (`pages-deploy.sh:49`, `package.json` `gh-pages` script). That
name is now a vestige — the artefact ships to CF Pages, not gh-pages. Renaming
it to `dist/demo` would be the gestalt move, but it threads through
`vite.config.ts`, `pages-deploy.sh`, the demo-gate scripts, and multiple ci.yml
comments. **Disposition: RECORD** (cosmetic vestige; a rename is a real diff
across ~5 files for zero behaviour change — out of this lane's "streamline CI"
remit and better folded into a demo-build-naming pass if ever). Not SHIP.

---

## §1 — VERSION DRIFT in the ci.yml dependency-order note  ·  SHIP-in-G

`ci.yml:33` (header comment) hardcodes the value.js range:

```
# via the npm registry (^0.10.0). A breaking value.js publish surfaces here
```

But `F/FINAL.md:117` records `@mkbabb/value.js@0.11.0` + `@mkbabb/parse-that@0.9.0`
as **published**, and the npm registry confirms it: `npm view @mkbabb/value.js
version` → `0.11.0`, `npm view @mkbabb/parse-that version` → `0.9.0`.

This is a **stale doc string** — the comment narrates a `^0.10.0` reality that
the published stack has moved past. It is benign (comments don't gate), but the
Mandate's inv-epsilon ("VERIFY, do not assert") makes a CI comment that lies
about the dependency contract a real seam: the next reader trusts `^0.10.0`.

**Cross-repo note (NOT my fix, flagged for the deferred-ledger / backend lane):**
the drift is deeper than the comment — `package.json` *still ranges*
`@mkbabb/value.js: ^0.10.0` + `@mkbabb/parse-that: ^0.8.2`, and the lockfile
resolves `value.js-0.10.0.tgz` / `parse-that-0.8.2.tgz`
(`package-lock.json:1001,1006`). So kf 4.0.0 was published consuming 0.10.0/0.8.2
while value.js 0.11.0 / parse-that 0.9.0 sit unconsumed on the registry. Whether
that is intentional (caret floor, no breaking need) or a missed bump is a
**dependency-currency** question that belongs to a-deferred-ledger / a backend
lane — NOT CI streamlining. I tag it `value.js-HANDOFF` / `parse-that-HANDOFF`
for awareness and stop. My lane owns only the CI *comment*.

**Disposition: SHIP-in-G.** The comment is in CI's file; fixing the string is a
zero-risk doc correction. But — per the Mandate — the *gestalt* fix is to stop
hardcoding the floor in prose at all. The range already lives, single-sourced,
in `package.json`. The comment should say "via the npm registry (range in
`package.json`)" rather than restate a number that drifts. Same DRY principle
the file already preaches elsewhere (it tells you to read the lockfile, not a
copy).

**Falsifiable instrument:** extend `proof-ci-coverage.mjs` (it already reads
both `package.json` and `ci.yml`) with one clause: assert `ci.yml` contains NO
hardcoded `@mkbabb/value.js@`-style version literal that disagrees with
`package.json`'s declared range — i.e. forbid a bare `^0.NN.0` in the dep-order
comment, OR assert any version literal present matches the package.json range
exactly. Bite control: re-insert `^0.10.0` → gate reds. This converts "comments
drift silently" into a gated invariant, which is the Mandate's posture (no
silent drift; fail explicitly).

---

## §2 — DRY: the glass-ui-sibling block is duplicated verbatim across two workflows  ·  SHIP-in-G

The "check out + build the glass-ui sibling (file:../glass-ui, pinned)" step is
**byte-identical** in two places:

- `ci.yml:154-159` (the `demo-smoke` job)
- `deploy-pages.yml:87-92` (the `deploy` job)

Both run the exact same five lines:

```
git clone --depth 1 --branch v3.2.0 https://github.com/mkbabb/glass-ui.git "$GITHUB_WORKSPACE/../glass-ui"
cd "$GITHUB_WORKSPACE/../glass-ui"
npm ci
npm run build
```

`grep -c 'git clone --depth 1 --branch v3.2.0'` = 1 in each file. This is a
DRY violation the Mandate names explicitly ("DRY — no duplicated effort"). The
pin (`v3.2.0`) is repeated; a bump must be made in two places or they diverge —
exactly the "moving HEAD is a reproducibility hole" failure the step's OWN
comment (`ci.yml:148-153`) warns against, reintroduced as a *cross-file* drift
risk.

The constellation standard's posture is to factor the demo-build prerequisite as
a reusable unit. GitHub Actions' idiomatic mechanism is a **composite action**
(`.github/actions/setup-glass-ui/action.yml`) or a **reusable workflow**
(`workflow_call`). A composite action is the gestalt fit here: it is a sequence
of run-steps with one parameter (the pin), invoked by both jobs as
`uses: ./.github/actions/setup-glass-ui` — single-sourcing both the clone recipe
AND the version pin.

**Disposition: SHIP-in-G.** This is idiomatic, not a workaround — it is the
canonical GitHub-Actions DRY primitive, and it makes §3 (the pin bump) a
one-line change instead of two.

**Falsifiable instrument:** a `proof-ci-coverage.mjs` clause (or a small
`proof-ci-dry.mjs`) asserting the `git clone … glass-ui` literal appears in
**zero** workflow `.yml` files (the recipe must live only in the composite
action) AND that both demo-build jobs reference `uses: ./.github/actions/setup-glass-ui`.
Bite control: inline the clone back into `ci.yml` → gate reds.

---

## §3 — the glass-ui pin is STALE: v3.2.0 while v3.3.0 is HEAD  ·  MEASURE-FIRST → SHIP-in-G (after §2)

Both workflows pin glass-ui to `v3.2.0` (`ci.yml:156`, `deploy-pages.yml:89`).
But the sibling repo has advanced: `git -C ~/Programming/glass-ui tag` lists
`v3.0.0 v3.1.0 v3.1.1 v3.2.0 v3.3.0`, and `glass-ui/package.json` reads
`3.3.0`. The pin is one minor behind the published glass-ui.

The pin's comment (`ci.yml:148-153`) is *correct in principle* — a foreign
repo's moving HEAD IS a reproducibility hole, and "the pin advances via an
explicit chore(ci) bump" is the right discipline. The finding is not that
pinning is wrong; it is that the pin **has fallen behind** and the demo CI +
deploy are building against a glass-ui the dev machines have moved off. If the
demo source has adopted any glass-ui 3.3.0 surface (token, component, dock fix —
the MEMORY.md feedback notes glass-ui dock/root changes land in the glass-ui
repo), CI builds the OLD glass-ui and the demo-smoke/occlusion/lighthouse gates
assay a stale dependency.

**MEASURE-FIRST:** before bumping, confirm the demo actually needs 3.3.0 —
diff glass-ui v3.2.0..v3.3.0 for any surface the kf demo imports, and confirm
the demo builds green against 3.3.0. If 3.2.0 is byte-sufficient for the demo,
the pin is *defensible* and the finding downgrades to RECORD (a deliberate
lag). If the demo references 3.3.0 surface, the pin is a latent CI/deploy
break-or-stale and the bump is SHIP.

**Disposition: MEASURE-FIRST → SHIP-in-G** the chore(ci) bump to `v3.3.0`
(landing in §2's composite action so it's a one-line change), **gated** by the
MEASURE that the demo builds green against it. This is a **glass-ui-HANDOFF** in
the sense that the pin's *target* is owned by the glass-ui repo — but the pin
itself lives in kf CI, so the bump is a kf-side SHIP.

**Falsifiable instrument:** the existing `demo-smoke` job IS the gate — a
v3.3.0 that breaks the demo build reds `proof:dogfood`/occlusion/lighthouse. To
catch *staleness* (pin-behind-HEAD) proactively rather than at break-time, a
`dependabot.yml`-style or scheduled "glass-ui pin currency" check is over-
engineering for a single sibling; the disciplined chore(ci) bump the comment
already prescribes is sufficient. No new permanent gate; the bump is the action.

---

## §4 — `concurrency` is MISSING on ci.yml and release.yml  ·  SHIP-in-G

The constellation standard puts a `concurrency` guard on CI to cancel
superseded runs:

```yaml
# ~/Programming/deploy/templates/ci.yml:38-41
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

kf's `deploy-pages.yml:26-28` HAS one (correctly keyed on the workflow_run head
SHA). But `grep -c concurrency` = **0** on both `ci.yml` and `release.yml`.

Consequence: rapid pushes to a PR (or master) spin up overlapping `ci` runs —
the `gates` job alone runs ~17 proof gates + tsc + build + test, and
`demo-smoke` runs a full Playwright + lighthouse + LoAF browser matrix
(`timeout-minutes: 20`). Superseded runs are not cancelled → wasted runner
minutes + a stale-result race (an older run finishing after a newer one can
mislead the `deploy-pages` `workflow_run` trigger about which SHA is current).
The constellation template's own comment names exactly this: "Cancel superseded
runs on the same ref to save minutes" (`deploy/templates/ci.yml:38`).

release.yml is tag-triggered (`v*.*.*`) so overlap is rarer, but a re-tagged or
force-pushed tag CAN double-run a publish — a `concurrency` group keyed on the
tag ref is cheap insurance against a concurrent double-`npm publish`.

**Disposition: SHIP-in-G.** Add the constellation-standard `concurrency` block
to `ci.yml` (keyed `ci-${{ github.workflow }}-${{ github.ref }}`,
`cancel-in-progress: true`) and to `release.yml` (keyed on the tag,
`cancel-in-progress: false` — a publish in flight must NOT be cancelled
mid-flight; only block a second). This is pure isomorphic alignment to the
already-adopted constellation spine — no behaviour change to a *single* run.

**Falsifiable instrument:** a `proof-ci-coverage.mjs` clause asserting every
workflow `.yml` declares a top-level `concurrency:` block. Bite control: delete
the block from `ci.yml` → gate reds. (Low-cost; folds into the same grep-over-
workflows instrument §1/§2 extend.)

---

## §5 — node-version DRIFT from the constellation standard: 24 vs 22  ·  RECORD (defensible) / MEASURE-FIRST

All four kf setup-node steps pin `node-version: 24` (`ci.yml:53,137`,
`deploy-pages.yml:81`, `release.yml:35`). The constellation standard and its
reference impl pin **22**: `deploy/templates/ci.yml:57` and every
`fourier-analysis` setup-node (`ci.yml:87,124`, `deploy-pages.yml:102`) use
`"22"`. kf's `package.json` `engines` declares `>=22` (satisfied by both).

This is a real divergence from the constellation standard the prompt names. Two
honest readings:

1. **Intentional + ahead:** kf is a pure library/demo with no Mongo/uv backend
   half; running on Node 24 (current LTS-line as of 2026) exercises the newest
   runtime the published library will face. Defensible — `engines: >=22` is the
   contract, 24 is a superset.
2. **Drift:** the constellation was standardised on 22 and kf wandered to 24
   without a recorded decision, so a constellation-wide Node bump (or a 24-only
   regression) is untracked.

Neither is wrong on its face. The Mandate's posture is "isomorphic unless HIGHLY
befitting, named deltas only" — a Node-version delta IS a named delta, but it is
currently *unnamed* (no comment explains why kf is 24 while the constellation is
22).

**Disposition: RECORD** (it is defensible and behaviourally green at 24), with a
**MEASURE-FIRST** rider: either (a) align kf to the constellation `"22"` for
isomorphism, OR (b) keep `24` and add a one-line comment at the first setup-node
naming it as a deliberate delta ("kf runs Node 24 — newest runtime for the
published lib; constellation default is 22; engines floor is >=22"). I lean (b)
— a library *should* test on the newest runtime — but it must be a NAMED delta,
not silent drift. Do NOT reflexively downgrade to 22 chasing template-sameness;
that would be the legacy-shape conformance the Mandate forbids when the delta is
befitting. The cheapest correct move is the naming comment.

Not a SHIP gate (a CI matrix testing 22 AND 24 would be the maximal answer, but
for a single-target library demo that is over-engineering — MEASURE-FIRST says
don't add a matrix without a biting reason, and there is none).

---

## §6 — release.yml ↔ gates job: a thin re-run, NOT redundancy  ·  ALREADY-SOTA

`release.yml:38-45` re-runs `check:lib → build:lib → test → proof:boundary`
before `npm publish`. The `ci.yml` `gates` job runs the same four (plus ~13 more
proof gates). On its face this looks like duplicated work.

It is **NOT** redundant, and the design is correct: release.yml fires on a
**tag push** (`v*.*.*`), which `ci.yml` does NOT trigger on (`ci.yml:38-42` is
`pull_request`/`push` to `master` only). A tag can be pushed at a SHA whose CI
ran days earlier, or at a SHA that never went through a PR. Re-running the
library-scoped gate at publish-time is the correct **publish-gate**: it
guarantees the exact bytes being published are green, independent of whatever CI
ran on master. This is the constellation library pattern
(`deploy/templates/ci.yml:147-163` shows `release` as a tag-gated job that
re-runs `npm ci → build` before publish).

The ONE defensible streamline: release.yml re-runs only the *boundary* proof,
not the engine/zero-alloc/correctness cohort. A tag pushed at an un-CI'd SHA
therefore publishes without the full engine gate. But — the constellation
release pattern itself runs only `build` before publish
(`deploy/templates/ci.yml:160`), and kf already runs MORE than the standard
(check + test + boundary). Tightening release.yml to the full `proof:all`
cohort would slow every publish for a SHA that, in practice, has already passed
full CI on master before being tagged.

**Disposition: ALREADY-SOTA.** The re-run is correct publish-gating, not waste;
the boundary-only scope is a defensible cost/safety tradeoff that EXCEEDS the
constellation standard. No SHIP. (If a future lane wants belt-and-braces, the
gestalt move is to gate release.yml on a green ci.yml run for the same SHA via
`workflow_run` — the same inv-28 pattern deploy-pages uses — rather than
re-running gates. That is a real improvement but a non-trivial restructure and
arguably over-engineering for a tag flow the author controls. **BOOK** it as a
candidate, do not SHIP in G.)

---

## §7 — `proof:ci-coverage` instrument: SOTA, with one tightening  ·  ALREADY-SOTA (+ micro SHIP-in-G)

`scripts/proof-ci-coverage.mjs` (F.W2) is exemplary: it reads `package.json` +
`ci.yml`, asserts every `proof:*` gate is invoked in CI, with three RECORDED
exclusions each carrying a written reason (`proof-ci-coverage.mjs:10-18,28-32`).
This is precisely the Mandate's "fail explicitly, no silent exemption" posture —
the exclusions are a manifest, not a hole. **ALREADY-SOTA.** This is the spine
that makes "authored-but-unrun gate" impossible, and it directly closed the
F-retro gap-coverage finding.

Two honest tightening notes (the SHIP candidates §1/§2/§4 above all extend THIS
instrument, which is the right home):

- **Scope blind spot:** the gate only checks `ci.yml`. It does NOT verify gates
  invoked in `release.yml` or that `deploy-pages.yml` is consistent. The four
  release.yml steps are a *subset* by design (§6), so this is fine for now —
  but the instrument's name ("ci-coverage") slightly over-promises. RECORD: if
  §1/§2/§4 land as ci-coverage clauses, rename the conceptual scope to "workflow
  hygiene" in the header so it honestly covers all three files.

- **`proof:lighthouse-mobile` exclusion** (`proof-ci-coverage.mjs:16-18`) is
  recorded as "browser-gated/runner-calibrated … runs local/dedicated." VERIFY:
  `grep 'lighthouse-mobile' ci.yml` = 0 confirms it genuinely is not in CI. The
  exclusion reason is honest (it's the heavy mobile-lighthouse local authority,
  parallel to the LoAF/yield-stress local-vs-CI split the LoAF gate comment
  documents at `ci.yml:236-245`). ALREADY-SOTA — the exclusion is principled,
  not a dodge.

---

## §8 — `pages-deploy.sh` + inv-28 green-CI-gating: SOTA  ·  ALREADY-SOTA

`deploy-pages.yml` is a faithful, correct adoption of the constellation
CF-Pages spine (it mirrors `fourier-analysis/.github/workflows/deploy-pages.yml`
clause-for-clause):

- **inv-28 green-CI gate** (`deploy-pages.yml:36-40`): triggers on `ci`
  *completing*, deploys ONLY when `conclusion == 'success' && head_branch ==
  'master' && event == 'push'`. Correct — a red CI cannot ship the SPA. Matches
  fourier's `:53-57` exactly.
- **`workflow_run` path-filter re-imposition** (`:49-67`): correctly re-imposes
  the demo-relevant path filter that `workflow_run` drops, keyed on the verified
  head SHA with `fetch-depth: 2` for the parent diff. Matches fourier's pattern;
  the kf path-regex is correctly broadened to `demo/|src/|index.html|vite.config
  |package*.json|tailwind|postcss|pages-deploy.sh|deploy-pages.yml` (a superset
  appropriate to a demo built from src + demo).
- **head-SHA pinning** (`:47,78`): every checkout pins
  `github.event.workflow_run.head_sha` — the correctness detail fourier's header
  (`:22-25`) calls out. Present + correct.
- **`pages-deploy.sh`** is the constellation spine verbatim-in-substance:
  project pre-flight (`:55-63`), rollback-target capture (`:65-78`), commit-msg
  ASCII transliteration for wrangler 4.x (`:85-97`). Secret discipline clean —
  `CLOUDFLARE_API_TOKEN`/`ACCOUNT_ID` from env, never inlined (`:45-46`,
  `deploy-pages.yml:98-100`).

**Disposition: ALREADY-SOTA.** This is the strongest part of the constellation
and needs nothing. One micro-gap vs fourier, RECORDED not SHIPped: fourier's
deploy job echoes the deploy-of-record id (`fourier deploy-pages.yml:123-130`,
inv-25 traceability); kf's deploy job does not capture/echo the CF deployment
id. It is a *traceability* nicety (find the deploy in CF dashboard from the
Actions log), not a correctness gap — the rollback id is captured in
`pages-deploy.sh:70-78` already. **RECORD** as a small parity-with-fourier add
if a deploy-traceability lane ever wants it; not worth a G SHIP on its own.

---

## §9 — demo-smoke does NOT upload its Playwright/lighthouse artefacts  ·  RECORD

The constellation reference (`fourier ci.yml:191-197`) uploads the Playwright
report as an artefact (`actions/upload-artifact@v4`, `if: always()`,
7-day retention) so a *failed* e2e run is debuggable post-hoc. kf's `demo-smoke`
job runs Playwright (occlusion-gate, lighthouse-gate, demo-smoke,
playwright.bench) but `grep -c upload-artifact ci.yml` = **0** — on a CI
failure, the screenshots/traces those gates capture are lost with the runner.

**Disposition: RECORD** (not SHIP). The kf demo gates print rich diagnostics to
stdout (the gate scripts are bespoke node, not raw `playwright test --reporter`),
so a failure is *mostly* legible from the log. Artefact upload would help for
the visual gates (occlusion screenshots, lighthouse HTML) but it's a
debuggability convenience, not a correctness or streamline gap. If a CI-DX lane
picks it up, the gestalt is one `upload-artifact@v4 / if: always()` step at the
tail of `demo-smoke` collecting the gate scripts' output dir. Out of the
"streamline / remove redundancy" remit of this lane.

---

## ALREADY-SOTA (honest record — do NOT manufacture a deficit here)

These surfaces are idiomatic and left ALONE:

1. **Legacy excision (§0)** — `deploy.yml` fully gone, zero dangling
   peaceiris/CNAME/gh-pages-action refs; the lone comment is correct provenance.
2. **inv-28 green-CI-gated deploy (§8)** — faithful constellation adoption,
   head-SHA pinned, path-filter re-imposed, secret-clean. The spine's best part.
3. **`pages-deploy.sh` (§8)** — constellation CF-Pages recipe verbatim-in-
   substance (pre-flight + rollback + msg-sanitise + secret discipline).
4. **release provenance (§6)** — `npm publish --provenance`, `id-token: write`,
   OIDC-signed SLSA attestation, NPM_TOKEN as repo secret. Correct + complete;
   exceeds the constellation template (which only `build`s pre-publish).
5. **`proof:ci-coverage` (§7)** — the self-policing gate-coverage instrument
   with a written-reason exclusion manifest. The mechanism that makes "authored-
   but-unrun gate" impossible. Mandate-correct fail-explicit posture.
6. **gates/demo-smoke split (`ci.yml:45,129`)** — the library-vs-demo posture
   (inv β): glass-ui-free library gate + a separate demo gate that legitimately
   needs glass-ui. The split is principled and well-documented; the long header
   comments (`ci.yml:1-35,139-153`) are honest provenance, not cruft.
7. **action pins** — uniform `actions/checkout@v5` + `setup-node@v5` across all
   three workflows (kf is AHEAD of the constellation template's @v4). Consistent;
   no drift WITHIN kf.

---

## DISPOSITION SCORECARD

| # | Finding | File:line | Disposition | Instrument |
|---|---------|-----------|-------------|-----------|
| §0 | Legacy `deploy.yml` excised, no dangling refs | `find .github`; `deploy-pages.yml:6` | **ALREADY-SOTA** | — |
| §0b | `dist/gh-pages` artefact-name vestige | `pages-deploy.sh:49` | **RECORD** | — |
| §1 | ci.yml comment hardcodes stale `^0.10.0` | `ci.yml:33` | **SHIP-in-G** | proof-ci-coverage: no version literal disagreeing w/ package.json |
| §1b | package.json/lockfile pin 0.10.0/0.8.2 while 0.11.0/0.9.0 published | `package.json`, `package-lock.json:1001,1006` | **value.js-HANDOFF / parse-that-HANDOFF** (→ a-deferred-ledger) | — |
| §2 | glass-ui-sibling block duplicated verbatim | `ci.yml:154-159` ≡ `deploy-pages.yml:87-92` | **SHIP-in-G** | composite action; gate: clone literal in 0 workflows |
| §3 | glass-ui pin stale v3.2.0 (HEAD v3.3.0) | `ci.yml:156`, `deploy-pages.yml:89` | **MEASURE-FIRST → SHIP-in-G** | demo-smoke green @ v3.3.0; chore(ci) bump |
| §4 | no `concurrency` on ci.yml / release.yml | `ci.yml` (0), `release.yml` (0) | **SHIP-in-G** | proof: every workflow declares concurrency |
| §5 | node-version 24 vs constellation 22 (unnamed delta) | `ci.yml:53,137`; `deploy/templates/ci.yml:57` | **RECORD / MEASURE-FIRST** | name the delta (comment) or align |
| §6 | release.yml re-runs gates subset | `release.yml:38-45` | **ALREADY-SOTA** (BOOK: workflow_run-gate alt) | — |
| §7 | proof:ci-coverage scope = ci.yml only | `proof-ci-coverage.mjs:26` | **ALREADY-SOTA** (+ micro: extend per §1/§2/§4) | — |
| §8 | inv-28 + pages-deploy.sh constellation adoption | `deploy-pages.yml`, `pages-deploy.sh` | **ALREADY-SOTA** (RECORD: echo CF deploy id) | — |
| §9 | demo-smoke no artefact upload | `ci.yml` (0 upload-artifact) | **RECORD** | — |

**G SHIP set (this lane):** §1, §2, §3 (post-measure), §4 — all four converge on
**one** instrument extension (`proof-ci-coverage.mjs` → a workflow-hygiene gate:
version-literal-consistency + clone-DRY + concurrency-present) plus one composite
action. That is the gestalt: a single self-policing CI-hygiene gate, not four
scattered patches. No legacy, no god-module, no architectural rewrite — the F.W2
+ F.W17 work left the CI constellation SOTA; G's residual is drift-closure.
