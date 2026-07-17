# Lane R2-04 — Adversarial Verification of Round-1 P0/P1s

**Prefix:** AV- · **Date:** 2026-07-17 · **Method:** refute-or-confirm. Each Round-1
target was attacked to break it; survivors are **CONFIRMED** with the strongest
evidence, casualties are **REFUTED** with the disproof, partial survivors are
**AMENDED** with the correction. All eight targets were exercised with live runs
(audit copy dev server + Chrome, vitest, npm, git); no claim rests on re-reading a
Round-1 row.

## Verdict

**Eight targets attacked; eight survive as stated (0 refuted).** Six are CONFIRMED
outright; two carry material AMENDMENTS that *strengthen* the underlying finding:

- **DP-02 is causally proven** by a clean A→B→C toggle (render → blank → render),
  but it is **not the sole error** — behind the single render-blanking crash hide
  **five non-fatal `timingFunction` pageerrors** on cube/easing/spring/square/amiga
  (both viewports), a previously-masked 6.0.0/value.js-4 demo-integration defect
  that R1-14's "one edit restores everything" narrative did not see. New row:
  **AV-DP02-DELTA (P1)**.
- **GS-01/TC-1 is CONFIRMED as vacuous-by-skip**, and the adversarial add is a
  *negative*: the five oracles, when actually run under a real browser, **all pass
  (14/14)** — the skip masks a *green* suite, not a latent red. The defect is purely
  "no CI signal," exactly as charged.

The remaining six (TC-2, GS-02, LC-04, CH-01, CH-02, WT-01, and the npm-prune
CT-01 mechanism) reproduced exactly.

---

## AV-1 — DP-02 causality (TooltipProvider) — **CONFIRMED + AMENDED (AV-DP02-DELTA, P1)**

**Family:** provider-context-missing (render-crash) · **target:** DP-02 (R1-14), FAM-02

I ran the exact toggle the brief specifies in the audit copy against `glass@e7da7b5c`
(Glass 7.0.0), probing all **7 routes × 2 viewports (14 combos)** with a `pageerror`
+ `console.error` + render-shape stream at each.

**STATE A — patch applied (TooltipProvider present):** all 7 routes render.
`appKids=2`, `mains=1`, `canvas≥1`, `textLen 118–725` on every route (home:
`canvas=1 text=118`; cube: `canvas=3 cards=6`; spring: `canvas=5`).

**STATE B — wrapper commented out (imports kept), dev restarted on 5196:** **all 14
combos blank** — `canvas=0, cards=0, textLen=0, mains=0`, `appKids` collapses to 1
on home / 2 on scenes, and the **sole** pageerror on every single combo is
``Injection `Symbol(TooltipProviderContext)` not found. Component must be used
within `TooltipProvider` ``.

**STATE C — patch restored byte-identical, dev restarted:** render returns,
matching STATE A exactly (home `canvas=1 text=118`; cube `canvas=3 cards=6`). App.vue
verified restored (`grep` shows the original `<TooltipProvider>` at lines 2/102 and
the import at 106).

→ **Causality proven.** The missing root `TooltipProvider` is the **sole
render-blanking crash**: exactly one error string, identical across all 7 routes and
both viewports, and toggling it flips blank↔rendered deterministically (reproduced
across two restarts). No *second* blanking crash hides behind it — DP-02 is the whole
blank.

**AV-DP02-DELTA (new, P1) — but it is NOT the sole *error*.** With the crash fixed,
the pageerror stream is **not clean**: five of seven scenes throw a non-fatal
`timingFunction` pageerror on *both* viewports (10 of 14 combos), invisible in STATE
B because the page dies before scene-animation setup runs. Two distinct classes:

- **easing, spring:** ``Invalid value for animation option "timingFunction":
  "bounceInEase" — unknown timing function``. Source: `demo/components/CopyButton.vue:42`
  passes `timingFunction: "bounceInEase"`; under value.js 4.0.0 / kf 6.0.0 the registry
  no longer resolves that name (src only *mentions* `bounceInEase` as a non-CSS example,
  `easing.ts:44`, `waapi/eligibility.ts:169` — it is not a live registry key).
- **cube, square, amiga:** ``Invalid value … [function anonymous] — a custom
  TimingFunction has no CSS animation-timing-function representation``: a callable
  easing handed to a CSS/WAAPI emit path.

The scenes still mount (canvas + cards present), so this is **not** a second P0 blank —
but it is a real, currently-shipping runtime error on 5/7 scenes of the 6.0.0 demo
transaction, masked entirely by DP-02. R1-14's DP-02 disposition ("restores every
scene's render in one edit") is true for *render* but overstated for *correctness*:
the V consume wave must also fix the demo→library easing-registry edge, or the fixed
demo throws on nearly every scene. Only **home and sequence** are error-clean.

Disposition — **build**: DP-02 fix (root `TooltipProvider`) stays P0/transaction-
blocking; add AV-DP02-DELTA to the FAM-02 render wave — repoint `CopyButton.vue`'s
`bounceInEase` and the cube/square/amiga custom easings to value.js-4-resolvable
timing functions (or attach the Easing.css twin the error names), and make the
render-assert track `pageerror` count == 0 per scene, not just non-blank.

---

## AV-2 — GS-01/TC-1: five skipped browser oracles under a real browser — **CONFIRMED (add negative)**

**Family:** vacuous-green-by-skip · **target:** GS-01 (R1-02), FAM-03

`resolveChromium()` (`test/compile/entry-roundtrip.test.ts:34-46` and the four
siblings) resolves `playwright-core`/`@playwright/test` from `KF_PLAYWRIGHT_DIR ??
REPO`; when unresolved, `chromium` is null and `describe.skipIf(!chromium)` skips. In
the **real** repo `playwright-core` is absent → all five skip, exactly as GS-01 states,
and no CI job that runs vitest installs a browser. **CONFIRMED: zero CI signal.**

Adversarial run under a real browser (audit copy has `playwright-core@1.53.1`): the
pinned bundled revision (`chromium_headless_shell-1179`) is absent from the ms-playwright
cache (has 1208/1223/1228), so `chromium.launch()` fails on the *environment*, not the
oracle — a false-red trap. I routed launch to system Chrome (`{ channel: "chrome" }`,
verified working) via a temp edit to the five files, ran, then **reverted the edit
(verified: no `channel:"chrome"` residue)**:

```
KF_PLAYWRIGHT_DIR=$PWD npx vitest run --project library <5 files>
 Test Files  5 passed (5)
      Tests  14 passed (14)   Duration 4.08s
```

→ **The skip masks a GREEN suite, not a hidden defect.** Entry/VT round-trip
equality, SplitText a11y-tree, EN browser-parse, and scroll-trigger all pass under a
browser. GS-01's defect is exactly and only "these run in no CI job"; there is no
latent red behind the skip. Disposition unchanged (build: run them under chromium in
the nightly job).

## AV-3 — TC-2: demo vitest project runs in no CI job — **CONFIRMED**

**Family:** ungated-suite · **target:** TC-2 (R1-06), FAM-03

```
$ time npx vitest run --project demo
 Test Files  27 passed (27)
      Tests  155 passed (155)
   Duration  1.72s   (wall 2.35s)
```

Exactly the 27/155 green R1-06 claims, and fast (1.72s). `vitest.config.ts` splits
`library` (excludes `test/demo/**`) from `demo` (`test/demo/**`); CI runs only
`test:lib` → `--project library` (`ci.yml:46`, `release.yml:47`); no `test:demo`
script exists, and the nightly job runs the playwright roster + `proof:publish`, not
this project. **CONFIRMED: 155 real, currently-green demo assertions with zero CI
coverage** — any can rot red on merge unseen.

## AV-4 — GS-02: deploy ancestry gate bypassed by workflow_dispatch — **CONFIRMED**

**Family:** enforcement-defeated-by-operating-procedure · **target:** GS-02 (R1-02), FAM-04

Adversarial re-read of `deploy-pages.yml`. Both real assertions —
"assert library CI conclusion" (`:37-39`) and "assert last-demo-green is an ancestor"
(`:40-50`) — are individually guarded `if: github.event_name != 'workflow_dispatch'`
(`:38`, `:41`). Under `workflow_dispatch` **both steps are skipped; there is no other
check, no `KF_FORCE_DEPLOY` break-glass input, no fallback assertion** — the
preflight job becomes a no-op that always succeeds, and the `deploy` job (`:52-76`)
proceeds to `npm ci` + build + `pages-deploy.sh`. The header comment even calls
dispatch "an explicit break-glass path" — the bypass is acknowledged, not accidental.
**No dispatch-time protection exists.**

Refutation attempt ("could a *non*-dispatch deploy also skip it?"): **no.** Under the
`workflow_run` trigger `github.event_name == 'workflow_run'`, so the `!=
workflow_dispatch` guards evaluate true and both asserts **run**; the job-level `if`
(`:25-29`, `:55-59`) additionally requires `conclusion==success && head_branch==master
&& event==push`. So the ancestry gate is enforced on exactly the path nobody uses
(auto workflow_run) and bypassed on the path MEMORY records as standard practice
(manual dispatch "to avoid the flaky Linux demo-gate"). **CONFIRMED** — and DP-02
sharpens the risk: the demo *builds* fine but *renders blank*, so a dispatch deploy
would ship the blank demo with a green run.

## AV-5 — LC-04: phantom structural-gate references are the complete set — **CONFIRMED (minor amend)**

**Family:** vacuous-gate / phantom-reference · **target:** LC-04 (R1-04), FAM-03

Repo-wide grep for `proof:no-flat-siblings|proof:zone-cohesion|proof:scripts-colocated`,
excluding `node_modules` and `docs/tranches/**` (historical planning docs, not
claims-of-liveness), across **all** file types:

- `src/animation/physics/index.ts:9`, `src/animation/orchestration/index.ts:7`,
  `src/animation/orchestration/split-text/index.ts:9`,
  `src/animation/orchestration/view-transition/index.ts:12` — **4 source comments**,
  all citing `proof:no-flat-siblings` as what the barrel "asserts."
- `demo/DESIGN.md:238` and `:253` — **2 lines**, both citing `proof:zone-cohesion`.

No other live references anywhere (workflows, package.json, scripts all clean). No gate
file exists: `find scripts` for `*flat-sibling*`/`*zone-cohesion*`/`*scripts-colocated*`
→ none; `package.json` proof keys are only `proof:publish` + `proof:owner-golden`
(`:50-51`); no workflow mentions them. **CONFIRMED: the "4 source comments + demo/
DESIGN.md" set is complete and the gates are genuinely absent** (not weak, as U lane-16
assumed — absent).

Amendments (small, sharpen the row): the 4 src comments cite `no-flat-siblings`; the
DESIGN.md refs cite `zone-cohesion` (a *second* phantom name) and are **2 lines**, not
one; `proof:scripts-colocated` appears in **no** live source/demo at all (it was
DROPPED at OD-U10 — `docs/tranches/U/OWNER-DECISIONS.md:19`), so it is a phantom only
in the tranche corpus, not in shipping code.

## AV-6 — CH-01: FINAL-U "terminal 5.3.4 / no V backlog" superseded — **CONFIRMED**

**Family:** green-over-superseded · **target:** CH-01 (R1-10), FAM-01

`npm view @mkbabb/keyframes.js versions` → `[… "5.3.3","5.3.4","5.3.5","6.0.0"]`;
`dist-tags` → `{ latest: "6.0.0" }`. FINAL-U.md:160-165 records 5.3.4 as the immutable
**terminal** U release ("preceding immutable baseline was 5.3.3"); FINAL-U.md:124-125
states "V inherits no U backlog, tripwire, or silently carried Keyframes row." Both
**5.3.5 and 6.0.0 shipped after U's close** (FINAL-U names neither; 5.3.5 is absent
from the entire U corpus), and `package.json:3` = `"6.0.0"`. The
`AGENTIC-HANDOFF-2026-07-16` §5 13-step restart + 65-path consumer slice **is** the
carried Keyframes row FINAL-U says does not exist.

Refutation attempt — is there a reading where "no backlog" holds? No. "No V backlog"
is a factual state assertion, and the handoff enumerates a concrete V work-list;
"terminal 5.3.4" is contradicted by two later published versions. **CONFIRMED** — the
handoff, not FINAL-U, is V's operative inherited ledger.

## AV-7 — CH-02: FINAL-U constellation boundary reworded, not re-decided — **CONFIRMED**

**Family:** re-worded-chronic / stale-forward-coordinate · **target:** CH-02 (R1-10), FAM-01

FINAL-U.md:114-120 (working tree) still reads "after **Glass 6.0.0** is immutable,
Keyframes publishes the smallest compatible successor whose **optional Glass edge is
exactly 6.0.0** … before **Atlas 2.0** consumes the tuple." Every coordinate is dead
against the shipping transaction: `package.json` carries **no** glass-ui edge at all
(not an optional 6.0.0); the demo consumes Glass **7.0.0** (`node_modules/@mkbabb/
glass-ui/package.json` → 7.0.0); Atlas is at **4.0.0** (handoff §6), two majors past
"2.0." The only edit the transaction made to this clause is the cosmetic MbabbMenu
reword ("arbitrary-value-shaped prose literal," FINAL-U.md:119) — the author's hands
were on the boundary sentence while leaving Glass-6/6.0.0/Atlas-2.0 verbatim.

Refutation attempt — could "named future artifact boundary" excuse the stale
coordinates? No: a forward boundary whose every coordinate is falsified is a
re-word-not-re-decide, precisely the pattern the owner edict forbids. **CONFIRMED** —
rewrite to the real Glass-7 / K6 / Atlas-4 rail or annotate SUPERSEDED.

## AV-8 — WT-01: 65-path manifest digest not reproducible — **CONFIRMED (final)**

**Family:** unpinned-serialization · **target:** WT-01 (R1-03), FAM-01

I rebuilt the exact 65-path consumer set independently from git (`git diff
--name-status 5a9183a7` → 60 M + 21 D; the 20 present-on-disk D's are `hash-object`-
identical to the K6 blob → producer false-D, dropped; the 1 genuine D
(`controlSurfaceDFA.ts`) + 4 untracked additions kept): **60 M + 1 D + 4 ?? = 65**,
matching R1-03 exactly. I then swept **1,536** encodings in a fresh family beyond
R1-03's 108 — 2 SHA kinds (git blob sha1 / content sha256) × 4 status-token forms
(incl. **porcelain-v2** `1 .M`/`1 .D`/`? `) × 3 delete-SHA policies × 4 separators × 4
field orders × 2 newline joins × 2 trailing-newline options, each sorted then
`sha256`. **NONE reproduced `a26e6a06bf89a07841d9f099ea205f29f6f5d11257a27a31999eab87
c320c8a9`.** Combined ~1,644 combos across two lanes. **CONFIRMED final**: the *set*
is verified byte-for-byte against K6 (a stronger guarantee than a digest), but the
*published digest* is unreproducible from the handoff recipe — its §5-step-4 recompare
is a check that cannot fail for the right reason. Disposition (build): replace the bare
digest with a committed, pinned manifest script.

## AV-9 — npm-prune incident (CT-01 mechanism) — **CONFIRMED**

**Family:** lockfile-extraneous-prune · **target:** GLASS-AUDIT-LINKAGE §"npm-prune
incident" / CT-01 (R1-09), FAM-01

Reproduced in a **throwaway** dir (not the audit copy): a `package-lock.json` with no
`@mkbabb/glass-ui` entry + an on-disk `node_modules/@mkbabb/glass-ui` (extraneous,
mirroring the swap). `npm install --no-save --offline` →

```
removed 1 package in 96ms
RESULT: PRUNED (extraneous removed on install)
```

Plain `npm install` prunes identically. This is exactly npm ≥7 ideal-tree
reconciliation: a package present on disk but absent from the lock is *extraneous* and
pruned on **any** install; `--no-save` governs only whether `package.json` is
rewritten, not pruning. **CONFIRMED**: the linkage doc's mechanism statement is
correct — the swapped Glass edge survives only until the next npm operation, which is
why the copy is frozen. The underlying defect (CT-01: glass-ui dropped from
manifest+lock while 43 demo files import it) stands independently.

---

## Negatives (checked, found sound)

- **No second render-blanking crash.** STATE B shows one and only one error string
  across all 14 combos; DP-02 is the entire blank, not a first-of-several.
- **The 5 browser oracles are green under a browser** (14/14) — the skip hides no red.
- **Non-dispatch deploys cannot skip the ancestry gate** — the `!= workflow_dispatch`
  guards disable the asserts *only* under dispatch; workflow_run runs them.
- **The phantom-gate set is closed** — no live reference outside the 4 src comments +
  demo/DESIGN.md; no gate file; `proof:scripts-colocated` is dropped, not phantom-live.
- **The 65-path *set* is reproducible even though the digest is not** — independent
  git derivation matched R1-03's 60 M / 1 D / 4 ?? exactly.
- **Audit copy left clean**: App.vue restored byte-identical (TooltipProvider at 2/102,
  import at 106); oracle launch edits reverted (no `channel:"chrome"` residue); probe
  script + throwaway dirs removed; port 5196 freed. No npm install/ci ran in the copy.

## Coverage gaps

- **AV-DP02-DELTA root-cause depth**: I characterized the two masked `timingFunction`
  error classes (unknown `bounceInEase` name; anonymous-fn no-CSS-repr) and their demo
  call-sites but did not fully trace whether the fix belongs in the demo consumer slice
  or a value.js-4 registry gap — flagged for the R2-09 value.js-V cross-check / the
  FAM-02 render wave.
- **Oracle parity chromium-vs-Chrome**: the 5 oracles were run under system Chrome
  stable (channel), not the pinned playwright chromium; all passed, but a revision-exact
  chromium run is the CI target the disposition names.
- **WT-01 exhaustiveness**: 1,644 combined combos is a large but not infinite space;
  an exotic serialization could still exist. The verdict rests on "the *set* is
  verified directly; the digest recipe is unpinned" — which holds regardless.
