# Lane 27 — the chronic + deferred ledger sweep

**Method (T5 discipline — nothing here is trusted from prose).** Every claim below was checked
against the running tree on `tranche-s-impl`, not against `docs/tranches/S/PROGRESS.md`'s own
narrative: `node scripts/proof-chronic-closure.mjs` was executed fresh (not cited from memory);
`proof:drag-gesture` and `proof:ci-coverage` were re-run live with the gh-pages dist rebuilt and
`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui` set (per the lane brief) so the browser leg
actually drives; `node_modules/@mkbabb/value.js/package.json` and `dist/keyframes.d.ts` were read
directly; `git log`/`git show` supplied the ground truth for what actually landed and when, since
`docs/tranches/S/PROGRESS.md`'s own session-log prose turns out to be incomplete (F4 below).

**Calibration note.** The brief cites "76 rows" for the `## Open deferrals` table. The table is
**74 rows** (`docs/tranches/S/PROGRESS.md:157-230`, numbered 1–74; confirmed by direct grep — no
row 75/76 exists anywhere in the repo). §8 "Recorded-future" (`S.md:1033-1101`) adds 21 further
pruned/parked items outside that table. This sweep covers all 95 combined.

## The one-sentence verdict

**The ledger's own closing mechanism never ran.** S.A1 authored a real, structural closure gate
(`proof:chronic-closure`) and deliberately left it non-blocking "until S.Z2's RE-EXECUTION re-wire"
(`PROGRESS.md:559-560`) — but S.Z1/S.Z2/S.Z3 (the only waves that were ever going to flip that
switch, re-run the ledger from clean, and produce the honest FINAL) **never executed** (zero
commits; `S.A3` is in the same state) because the T-pivot fired first. Run today, that gate REDs on
**52 of 74 rows** (81 individual findings) — partly because the rows are genuinely never-verified,
partly because the gate itself has a real bug (F2) that inflates the count. Underneath that
systemic gap sit several **concrete, reproduced, currently-live** defects the ledger's prose
currently hides: a reopened-then-silently-stale backlog row (F3), a cross-repo dispatch nobody
re-checked (F5), a brand-new phantom dependency this sweep found while chasing an old one-line
aside (F6), and a stale CI literal actively failing the gate that's supposed to catch stale
literals (F7).

---

## F1 — The S.Z band (S.Z1/S.Z2/S.Z3) never executed; every "FOLD — C-20 terminal-ization" claim in the ledger is, by the ledger's own rule, currently unverified

**Defect.** `git log --oneline --all | grep -i "S\.Z"` returns zero wave-closure commits. The board
(`PROGRESS.md:77-79`) still shows S.Z1/S.Z2/S.Z3 as `PENDING-IMPL`. S.A1's own gate comment says it
plainly: *"this meta-gate GREENs only re-run on the merged tree at S.Z2"* (live in
`scripts/proof-chronic-closure.mjs` output, reproduced below). `proof:prompt-recap-s` (S.Z1),
`proof:tranche-template` (S.Z2), and the FINAL closeable-roster run (S.Z3, C-21) are in the exact
same state — none of them has ever executed once against a real tree.

**Root cause.** T3/C-20's own design put the ledger's *verification* in a LATER wave than the ledger
*authorship* — correct sequencing for an impl drive, but it means a drive that stops early (as this
one did, pivoted by the owner's live-review verdict) leaves the entire ledger in a designed-red,
never-re-run limbo. Nothing distinguishes "red because Z hasn't run yet" from "red because the row
is actually broken" — both look identical from `PROGRESS.md` alone.

**Evidence.**
```
$ node scripts/proof-chronic-closure.mjs
  ✗ [52 of 74 rows flagged — 81 individual findings; full list in F2's breakdown below]
✗ proof:chronic-closure — the S chronic ledger is not closed to RUNTIME + SUBSTANCE discipline
```

**T-wave-shaped recommendation.** Do not re-open S. Fold the Z band's substance into a T wave:
re-run `proof:chronic-closure` from a clean checkout as the FIRST T action on the ledger, fix the
gate's own bug (F2) in the same commit, and then hand-triage the *residual* reds (the genuine ones,
likely under 10 once F2 is fixed — see the fold table) into either a re-shaped gate or a ratified
KILL, never a re-affirm. This is the single highest-leverage T action in this lane: it converts 52
rows of "unknown" into a small, named, real backlog.

---

## F2 — `proof-chronic-closure.mjs`'s tier check only looks at `proof:demo-correctness`, silently ignoring `proof:library-correctness` and `proof:hygiene` — inflating the apparent backlog

**Defect.** The S.A4 taxonomy (row 70) is **three** tiers: `library-correctness` / `demo-correctness`
/ `hygiene` — the gate script even lists all three in its own `NOT_A_GATE` set
(`scripts/proof-chronic-closure.mjs:361-367`, which names `proof:library-correctness` explicitly).
But the actual tier-membership test only checks one of them:

```js
// scripts/proof-chronic-closure.mjs:171, 179-180
const PROOF_CORRECTNESS = SCRIPTS["proof:demo-correctness"] ?? "";
const inCorrectnessTier = (gate) =>
    PROOF_CORRECTNESS ? inChain(PROOF_CORRECTNESS, gate) : inProofAll(gate);
```

`proof:library-correctness` and `proof:hygiene` are never consulted. Verified directly: `proof:compile-replay`,
`proof:compile-deterministic`, `proof:zero-alloc`, and `proof:waapi-adaptive-densify` (rows 42, 44,
73, 74's closure oracles) **are** members of `proof:library-correctness`
(`package.json:246`); `proof:decomposition`, `proof:boundary`, `proof:bench-taxonomy`,
`proof:pin-ledger-current`, `proof:ci-coverage`, `proof:gate-is-runtime` (rows 27, 32, 34, 37, 45,
62, 70) **are** members of `proof:hygiene-chain` (`package.json:249`) — all six run and pass live
today. None of that matters to the checker: every one of these rows gets flagged with the paired
"NOT in the DEMO-CORRECTNESS tier" + "NOT a RUNTIME/INTERACTION gate" findings, which is a
category error for a library-side or static hygiene-side chronic (they were never meant to be
browser-actuated).

**Root cause.** The tier rename happened at S.A4 (`proof:correctness` → the 3-tier split); the
chronic-closure gate's own tier-check was authored once at S.A1 (before the split existed in its
final form) and never updated when S.A4 landed the second and third tiers — a co-edit the S.A4 wave
owed itself (the same "arming-audit" class the session log already names three times for other
gates: fan-out ⑦'s press-origin driver, twice before it).

**Evidence.** 26 of the 52 failing rows carry exactly this paired A/B finding
(`grep -c` on `/tmp/chronic.log`, reproducible via the command above).

**T-wave-shaped recommendation.** One-line-class fix: extend `inCorrectnessTier` to check
`proof:library-correctness` and `proof:hygiene-chain` (via `SCRIPTS["proof:hygiene-chain"]`, since
`proof:hygiene` itself delegates to `run-all.mjs` and is not a literal chain) in addition to
`proof:demo-correctness`. Re-run the gate in the same commit — this alone should collapse a large
fraction of the 52-row backlog to genuinely-closed, with zero source changes elsewhere.

---

## F3 — Row 67 (drag-gesture) is stale in the ledger table AND currently, verifiably, RED — reproduced live to one exact surface

**Defect.** `PROGRESS.md:223` (row 67, "Hidden-affordance systemic") still reads: *"Oracle: the
manifest exists... Discharges the `drag-gesture` backlog row."* That claim was true for about 20
minutes of wall-clock drive time. `git log` shows the sequence precisely:

- `354bab8` "S.G3 S5: discharge proof:drag-gesture (the LAST backlog row)" — claims done.
- `dee5aa6` (later the same evening) — *"drag-gesture RE-OPENED as the named BACKLOG carry → Tranche
  T (the G3 discharge was incomplete — one surface; reproduced serially)."*

Row 67's table cell (line 223) was **never edited** to reflect the reopening — only
`scripts/demo-roster.mjs:258` (`"proof:drag-gesture": "T (the owner-verdict fold)"`) and the
"State of play" prose (`PROGRESS.md:259`) carry the true, current disposition. The ledger's own row
and its governing script disagree about the SAME fact inside the SAME repo.

**Live reproduction (this sweep, not inherited from the commit message).** Built `dist/gh-pages`
fresh and ran `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui node
scripts/proof-drag-gesture.mjs`:

```
✗ clause (a) — 1 drag surface(s) still highlight chrome / leave userSelect:auto mid-gesture (B6-a):
    easing/ribbon-slider: body.is-dragging was NOT set during the gesture — the seam did not arm
    the global token (D1 not live for this surface)
```

All four other surfaces (square, spring, sequence, motion-path) and the easing bezier-handle pass
cleanly. Only the easing scene's **playback ribbon slider** — `PlaybackRibbon.vue`'s
`.timeline-green [data-slider-impl]` (the glass-ui `<Slider variant="timeline">`) — fails.

**Root cause (located, not just reproduced).** `demo/@/components/custom/animation-transport/controls/PlaybackRibbon.vue:110-140`
wraps a third-party glass-ui `<Slider>` in a capture-phase gate (`gatedSliderDown`, wired through
`useTouchGate()` from glass-ui) and then, only if the gate admits the gesture, calls
`useDragCapture`'s `onPointerDown` (`demo/@/components/custom/animation-transport/controls/composables/useDragCapture.ts`),
which is the seam that actually calls `acquireSelectSuppression()`
(`demo/@/composables/gestureSelectSuppression.ts:22-26`) and arms `body.is-dragging`. This is the
**third** drag-related composable in the demo (`useDragScrub`, `useDragCapture`, and now this
gate-then-capture composition inside `PlaybackRibbon` itself) — the demo has TWO composables that
each individually claim to be "the ONE shared seam" (`useDragScrub.ts:9` and the module doc for
`useDragCapture.ts`), plus this third bespoke wiring around a vendored widget that owns its own
internal pointer semantics. The exact interaction that swallows the token-arming call (glass-ui's
Slider internals vs. the demo's outer gate vs. the composable) was not fully traced inside this
docs-only lane — but the architecture itself is the finding: **wrapping a third-party interactive
widget in a hand-rolled capture-phase gate is exactly the kind of per-surface special case the
gesture-seam consolidation was supposed to eliminate**, and it is the ONLY surface that needed one.

**T-wave-shaped recommendation.** See T-2 below — this is the drag-gesture carry's real content,
not a re-affirmation.

---

## F4 — `PROGRESS.md`'s session log stops ~40% before the drive's actual end; the only place the true end-state lives is a terser, later-appended summary

**Defect.** `## Session log (the S impl drive)` (`PROGRESS.md:405-739`) ends mid-narrative at fan-out
⑨ (line 739: *"The roster BACKLOG is now ONE row: drag-gesture → S.G3."*). `git log --oneline --
docs/tranches/S/PROGRESS.md` shows the file was touched exactly **once** more after that entry
(`68c9a5d`, the T-pivot compaction) — and that commit only appended the "State of play" resume-anchor
prose (37 lines), not new session-log entries. Between those two commits, **20 further commits**
landed real work the session log never narrates:

| Commit | What it did |
|---|---|
| `f55a9a9`/`13bf2e8` | S.G3 gesture manifest + affordance layer |
| `354bab8` | S.G3 S5 — discharge `proof:drag-gesture` (the claim row 67 still repeats) |
| `32f586d` | S.F6 — the emerging-CSS honest-narrative fix |
| `c866d72`/`1c04de9` | S.B8 — the CLAUDE.md regen + hygiene-chain wiring |
| `74ee9d2` | **S.C4/S2 — the value.js consume-edge FIRED** (the whole owner-ruling-5/6 payload) |
| `d5479ad` | **S ⑩ — the full-roster long-tail sweep** (8 reds by cause) |
| `f2d05c7`, `dee5aa6` | T dev opened; drag-gesture reopened |

Row-level consequence: a reader who trusts the session log alone (the document's own advertised
purpose) cannot learn that S.C4/S2 fired, that a tenth fan-out happened, or — critically — **why**
row 67's claim is wrong, because the log never reaches the commit that reopens it.

**Root cause.** No amendment discipline on the drive's own primary audit artifact — the exact class
of problem §8 item 7 (`S.md:1060-1063`, "TEMPLATE.md amendment discipline… so it does not become
the next stale-doc-authority") already named as a risk for a *different* document, applied here to
this one instead.

**T-wave-shaped recommendation.** See T-4 below — a mechanical backfill, but load-bearing: T's own
audit trail will accrete the same gap if nothing structurally prevents it.

---

## F5 — KF-7 (the `PropertyDescriptor_2` collision dispatch) was booked to value.js and never verified as fulfilled — it is not

**Defect.** `docs/tranches/S/KF-VALUEJS-2.0.0.md:73` files KF-7: value.js's exported
`PropertyDescriptor` collides with the ambient DOM `PropertyDescriptor` global, so kf's
API-Extractor roll-up collision-renames it to `PropertyDescriptor_2` in the public `dist/keyframes.d.ts`
— cosmetically ugly and consumer-observable (`propertyRegistry: Map<string, PropertyDescriptor_2>`).
The row's own text says: *"DISPATCH: rename value.js's export... on the 2.0.0 grammar-rename
cadence."* Checked directly against what's actually installed (`^2.0.1`, matching the current pin):

```
$ grep -n "PropertyDescriptor" node_modules/@mkbabb/value.js/dist/index.d.ts
export type { ..., PropertyDescriptor, ... } from './parsing/stylesheet';   # NOT renamed

$ grep -n "PropertyDescriptor" dist/keyframes.d.ts
import { PropertyDescriptor as PropertyDescriptor_2 } from '@mkbabb/value.js';
propertyRegistry: Map<string, PropertyDescriptor_2>;   # the exact defect KF-7 describes, TODAY
```

**Root cause.** The dispatch mechanism used for the *big* spine (parse-that → value.js → kf) has a
real "adopt-event watch" — `npm view @mkbabb/value.js` polled until the right version landed, never
acted on until confirmed. KF-7 is a *rider* on the same letter with no equivalent watch: it was
fired and forgotten. No kf-side gate asserts the absence of a collision-rename in the published
`d.ts`, so nothing will ever notice if value.js does or doesn't fix it.

**T-wave-shaped recommendation.** See T-3 below.

---

## F6 — NEW (found chasing an old aside): `@mkbabb/value.js@2.0.1`'s own `package.json` declares a self-dependency on itself, installing a phantom nested duplicate

**Defect.** `PROGRESS.md:540` carries one throwaway clause from the fan-out ④ adjudication: *"semver
+ `proof-packrat-sound`'s transitive parse-that import booked to S.C4 posture."* No wave doc, no
ledger row, and no later session-log entry ever closes that clause explicitly — it just stops being
mentioned. Chasing it down: `proof:packrat-sound` (`scripts/proof-packrat-sound.mjs:14`) imports
`@mkbabb/parse-that` directly, which is legitimate ONLY because value.js carries it transitively (kf
itself declares no direct dependency on parse-that — confirmed: zero hits for `parse-that` in
`package.json`). The gate passes today. But the *reason to look* — the transitive resolution — leads
to something nobody flagged:

```
$ node -e "... print every @mkbabb/value.js / @mkbabb/parse-that node in package-lock.json ..."
node_modules/@mkbabb/value.js -> 2.0.1  deps: {"@mkbabb/parse-that":"^1.0.0", "@mkbabb/value.js":"^1.0.2"}
node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js -> 1.2.0  deps: {"@mkbabb/parse-that":"^0.13.0", ...}
node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that -> 0.13.0
```

`@mkbabb/value.js@2.0.1`'s own published `package.json` lists `"@mkbabb/value.js": "^1.0.2"` as one
of **its own dependencies** — a self-reference. npm cannot dedupe a package against itself, so it
nests a stale 1.2.0 copy of value.js (1.2 MB) plus a stale 0.13.0 copy of parse-that inside kf's own
`node_modules`, unused but installed, on every `npm ci`.

**Root cause.** Upstream (value.js) publishing bug, almost certainly the actual shadow behind the
un-closed "semver... booked to S.C4 posture" aside — that concern was raised, half-investigated, and
then silently dropped when S.C4/S2 landed a different fix (the KF-1 grammar deletion) that happened
to make the transitive `packrat-sound` import keep working, which read as "resolved" without anyone
tracing the self-dependency.

**T-wave-shaped recommendation.** See T-3 below (bundled with KF-7 — both are cross-repo dispatch
hygiene gaps).

---

## F7 — `proof:ci-coverage` is RED today: `ci.yml` still hardcodes the pre-re-pin `value.js 1.2.0` literal

**Defect.**
```
$ node scripts/proof-ci-coverage.mjs
✗ version-literal (G.W6 S1 / J.W3 CICD-5) — workflow file(s) hardcode version literal(s)
  ci.yml: ^1.2.0 that disagree with package.json's declared @mkbabb/* range(s) [^2.0.1, ~4.0.0].
```
`.github/workflows/ci.yml:487-492` still reads:
```yaml
# Q STAGE-5 GATED CONSUMES (value.js 1.2.0) — @function inline · leaves
# externalize · color-SoA measure · glass-ui aria content-probe. node + jsdom.
...
- name: "proof:color-soa (Q.WB3-color — ... the ^1.2.0 re-pin ... )"
```
This is Q-tranche-era comment prose, stale since the S.C4/S2 re-pin to `^2.0.1`
(commit `74ee9d2`) — which touched `package.json`, `package-lock.json`, and the PIN-LEDGER but never
`ci.yml`.

**Root cause.** The re-pin's own verification (`proof:pin-ledger-current`, `check:lib`) does not
scan workflow YAML prose, and `proof:ci-coverage`'s version-literal clause — the ONE gate that would
catch this — was apparently never re-run after S.C4/S2 landed (or was run and the finding was
missed; either way it is red on the tree today and nothing downstream is blocking on it, since it's
a hygiene-tier gate that also silently never got its own S.Z2 re-execution).

**T-wave-shaped recommendation.** Trivial, but proves F1's point concretely: this is a real, live,
currently-red CI-coverage finding that a from-clean roster run would have caught immediately had
S.Z2 executed. Fold into T-1 (the ledger re-verification wave) as its first concrete discharge.

---

## F8 — Row 16 (S.A3 / auto-deploy revival) reads as landed; it never fired

**Defect.** `PROGRESS.md:172` (row 16) disposition: *"FOLD — deploy revived… `deploy-pages.yml`
`workflow_run` fires on green demo-correctness… Oracle: one auto-path deploy run `success`."* No
commit named `S.A3` exists anywhere in `git log --oneline --all`. The drive's own "State of play"
(2026-07-04) is honest about this in prose: *"REMAINING S: S.A3 (auto-deploy — now unblocked by the
green demo-correctness posture)…"* (`PROGRESS.md:260`) — but that honesty lives four hundred lines
away from row 16's own cell, which reads as an executed, oracle-satisfied FOLD.

**Root cause.** Same class as F3: a table cell frozen at DEV-AUTHORED-intent time, never
back-annotated when the wave's actual fate (in this case: simply never run) became known.

**T-wave-shaped recommendation.** Fold into T-1 — this is exactly the kind of row a from-clean
re-verification pass converts from "trust the prose" to "the oracle ran, here is its exit code."

---

## F9 — Three S.B6 type-surface gates are still permanently excluded from every aggregate roster, "dev-only," waiting on the same S.Z2 that never came

**Defect.** `proof:engine-subpath-mirror`, `proof:no-any-default`, and `proof:dts-rollups-agree`
(rows 37, 38's closure oracles) are real, runnable, passing gates
(`npm run proof:dts-rollups-agree` → PASS, verified live) — but they are explicitly listed in
`scripts/proof-ci-coverage.mjs:249-252`'s `EXCLUDED` set with the comment *"individually runnable
NOW (`npm run proof:engine-subpath-mirror` etc.)"*. Commit `2fd91d2`'s message says outright:
*"S.B6: wire the three type-surface gates (dev-only; S.Z2 CI-wires them)."* S.Z2 never ran.

**Root cause.** Same Z-void as F1, at the granularity of three specific, otherwise-healthy gates.

**T-wave-shaped recommendation.** Fold into T-1 — wire these three into `proof:library-correctness`
(they are exactly type-surface/d.ts correctness, not demo interaction) in the same pass that fixes
F2's tier-blind-spot bug.

---

## F10 — Row 70's own headline is inverted on the current tree (cross-referenced, not re-derived)

Lane 24 (`docs/tranches/T/audit/lanes/24-plan-vs-landed-AB.md`, finding F1) independently verified
the actual gate count on this tree: **203** `proof:*` package.json keys today (re-confirmed by this
lane: `grep -oE '"proof:[a-z0-9-]+":' package.json | sort -u | wc -l` → `203`) against row 70's
promised *"190 → ~138 immediate → ~120 once the FROZEN fold discharges."* Recorded here only to keep
the ledger's own row 70 honest in this lane's fold table below — full analysis is lane 24's, not
duplicated here.

---

## The T fold table

Legend: **CC** = this run's live `proof:chronic-closure` verdict (✓ pass / ✗ fail — see F2 for why
many ✗ are tier-bug false-positives, not real gaps). **Truth** = this sweep's verified current
state. **T disposition** = the C-20-compliant shape (deterministic re-shaped gate or ratified KILL
— never an observe/re-affirm verb).

| # | Item (short) | S disposition | CC | Truth (this sweep) | T disposition |
|---|---|---|---|---|---|
| 1 | Master CI red every push | FOLD, keystone | ✗ (no gate cited) | Keystone landed (`1e37d8e`/`ed409d1`); the row itself never named a concrete gate | T-1: cite `proof:ci-coverage`+`proof:published-on-master` explicitly |
| 2 | `.morph-ghost--from` orphan | FOLD | ✗ (tier bug) | Genuinely fixed; gate real, just mis-tiered by the checker | T-1 (F2 fix clears this) |
| 3 | PIN-LEDGER frozen/stale | FOLD | ✗ (tier bug) | Fixed + re-verified 3× since (S.C4, S.H4, ⑩) | T-1 |
| 4 | LoAF exit-code flake | FOLD | ✗ (no gate cited) | Fixed (decouple landed, `1e37d8e`) | T-1: name the mechanism |
| 5 | 14 demo-smoke reds | FOLD | ✗ (no gate cited) | Discharged by cause; 3 of 4 backlog items later closed at ⑨, 1 (drag-gesture) reopened (F3) | T-2 owns the residue |
| 6–9 | DM-8/9/10/11a (Lighthouse/specular/font/spring-slider) | FOLD, C-20 terminal | ✗ (no gate cited) | Landed at S.A1 (`18e2d2a`) per session log; rows don't cite the resulting gates | T-1 |
| 10 | DM-11b subject-animates | FOLD | ✓ | Verified fixed (shared importmap) | none — genuinely terminal |
| 11 | DM-12 perf-frame-budget | FOLD+HANDOFF | ✗ (no gate cited) | kf clause landed at A2; glass-ui dock clause correctly still HANDOFF | T-1 (kf half); no T action on the HANDOFF half |
| 12–13 | DM-13/14 (engine-no-throw / fsm-resume) | FOLD | ✗ (no born-RED witness) | Genuinely proven RED→GREEN (pass-3 + S.A0); wording gap only | T-1: add the witness sentence |
| 14–15 | DM-15 / DM-5 S8 | FOLD | ✗ (no gate cited) | Landed at S.A1 | T-1 |
| 16 | S.A3 auto-deploy | FOLD "deploy revived" | ✗ (tier bug + never ran) | **NEVER FIRED** (F8) — the row is false | T-2: actually run S.A3's deploy, or re-disposition honestly as PENDING |
| 17 | DM-24 N-Stage | RECORD, owner SHELF | (not a FOLD/VERIFY row — exempt) | Correctly terminal (pre-drive owner ruling) | none — closed, leave alone |
| 18 | scene-switcher-mobile zombie | FOLD, retire | ✗ (tier bug) | Genuinely retired (`bffd9b2`, machine-witnessed) | T-1 |
| 19 | scene-colocated ASSERTION 3 | RECORD | ✓ | Correctly resolved | none |
| 20 | ~51 FROZEN demo-layout gates | FOLD | ✓ | Landed (`gate-bands.mjs` FROZEN_SET=51); see F10 for the wider roster-count caveat | none (row-level); F10 owns the roster-count issue |
| 21 | `app-shell-thinness` phantoms | FOLD | ✗ (tier bug) | Fixed (`bffd9b2`) | T-1 |
| 22 | `engine-seam-split` never authored | KILL, ratify at S.Z | ✓ | Superseded per S.B2; the S.Z **ratification** half never happened (Z-void) | T-1: ratify explicitly |
| 23 | animate.ts zombie | FOLD, DELETE | ✗ (dangling ref — self-resolving) | Genuinely deleted (`1e37d8e`); the row cites its own now-nonexistent test gate by design | T-1: reword, no real gap |
| 24 | MIGRATION-5.1.0.md | FOLD | ✓ | Landed | none |
| 25–26 | no-silent-fallback / as-any survivor | FOLD | ✗ (no gate cited) | Landed (`1e37d8e`) | T-1 |
| 27 | 8 dead shadcn devDeps | FOLD, delete | ✗ (tier bug) | Landed (`ffff53d`) | T-1 |
| 28 | ui/menubar + `cn()` | FOLD, migrate | ✓ | Landed (`b4e0f66`, C-19 documented choice) | none |
| 29 | Playground → compose/ | FOLD | ✓ | Landed + formally closed at ⑨ (`63ac644`) | none |
| 30 | cubeTransformStore un-zoned | FOLD | ✗ (tier bug) | Landed (`bffd9b2`) | T-1 |
| 31 | animation-controls "do not touch" fiat | FOLD, carve | ✗ (tier bug) | Landed (`2061a56`) | T-1 |
| 32 | presets/classic.ts 728L | FOLD, split | ✗ (tier bug) | Landed (`b4e0f66`) | T-1 |
| 33 | Six 488–499L files | FOLD | ✗ (no gate cited) | Landed (`0ce55ed`/`b4e0f66`) | T-1 |
| 34 | constants.ts mix | FOLD | ✗ (tier bug) | Landed (`1e37d8e`) | T-1 |
| 35 | PlaybackState half-carve | FOLD | ✗ (no gate cited) | Landed (`0ce55ed`) | T-1 |
| 36 | getGroupFactory locator | FOLD | ✗ (no gate cited) | Landed (`2061a56`) | T-1 |
| 37–38 | `./engine` mirror / d.ts leaks | FOLD | ✗ (tier bug) | Landed but the 3 gates are EXCLUDED from every roster (F9) | T-1 wires them in |
| 39–40 | test/bench typecheck / 5 uncovered scenes | FOLD | ✓ | Landed (`929ef0e`) | none |
| 41 | CLAUDE.md doc-authority | FOLD, gate-first | ✗ (tier bug) | Landed + fully regenerated (`c866d72`) | T-1 |
| 42 | colorTail benches unfloored | FOLD | ✗ (tier bug) | Landed (`cc744ac`) | T-1 |
| 43–44 | Typed-OM / WAAPI densify | FOLD | ✓ | Both landed (`63ac644`) with real correctness finding (WAAPI re-transform order) | none |
| 45 | resolve/ zero bench coverage | FOLD | ✗ (tier bug) | Landed (`63ac644`) | T-1 |
| 46 | color2Into WATCH | DISPATCH, verify at S.H4 | ✓ | Asserted verified at S.C4/S2 (`74ee9d2`) per PROGRESS prose; no itemized oracle output captured in the session log | T-3 (bundle with the other cross-repo dispatches — tighten the verification trail) |
| 47–48 | DQ-1/DQ-2 (packrat re-entrancy / dead API) | FOLD | ✓ | Landed at S.H4 | none |
| 49–50 | packrat 3-Map alloc / chain() falsy-skip | FOLD | ✗ (no gate cited) | Landed at S.H2 | T-1 |
| 51–53 | glass-ui aria-ask / peer-satisfied / dock dblclick | HANDOFF | (exempt) | **Correctly still open** — glass-ui 4.0.1 installed, no drift, BG/BH forthoming per brief | none — no T action, re-verify only when glass-ui ships |
| 54 | Stale MEMORY specular note | FOLD, retire at S.Z3 | ✗ (no gate cited) | S.Z3 never ran — retirement itself never executed | T-1 (trivial — a MEMORY edit) |
| 55 | glass-ui pin ~4.0.0 | FOLD, hold + HANDOFF | ✓ | Correctly held (4.0.1, tilde) | none |
| 56 | Oscillator / reseatToSpring decision | FOLD | ✓ | Landed (`cc744ac`, RETAIN-both recorded) | none |
| 57 | SPRING_SMOOTH dead constant | FOLD, delete | ✓ | Landed | none |
| 58 | `declaredKeyframeBodyFor` | REVERSED, construct | ✓ | Landed w/ EN-b (`0ce55ed`) | none |
| 59–60 | MotionPath.finished / RM copy | FOLD | ✗ (no gate cited) | Landed (`2061a56`) | T-1 |
| 61 | VJS_PARAM_BUG_MAX consume-edge | FOLD, RULED | ✓ | **Fired** (`74ee9d2`) — grep-zero verified | none |
| 62 | dep-cruiser/fast-check/@types bumps | FOLD | ✗ (tier bug) | Landed (`b4e0f66`) | T-1 |
| 63 | Stale comments corpus | FOLD, split | ✓ | Discretionary tier by design | none |
| 64 | docs/frontend-design paths | FOLD, remap | ✓ | Landed | none |
| 65 | docs/precepts/audits ownerless | RECORDED-FUTURE | (exempt) | Correctly still open (owner non-decision, by design) | none — carries as-is |
| 66 | Mobile-sheet occlusion | FOLD | ✗ (tier bug) | Landed (`0ce55ed`, 72% stage-visible) | T-1 |
| 67 | Hidden-affordance / drag-gesture | FOLD, "discharges drag-gesture" | ✗ (no gate cited) | **FALSE as written** (F3) — reopened, currently RED, reproduced to one exact surface | **T-2 — the real work item** |
| 68–69 | Motion-path scaling / square lying panel | FOLD | ✗ (no gate cited) | Both landed (`63ac644`) | T-1 |
| 70 | Gate roster 190→~120 | FOLD, diet | ✗ (tier bug) | **Inverted**: 203 today (F10; lane 24 owns the depth) | T-1 cites lane 24's finding; no new work here |
| 71 | KfPillTabs keyboard-broken | FOLD (T8) | ✗ (no gate cited) | Landed (`929ef0e`) — but see lane-08/lane VERDICT #18: owner wants KfPillTabs GONE, not hardened | none in THIS lane (product disposition owned elsewhere) |
| 72 | DQ-4..7 | FOLD-LANDED (assumed), "S.Z1 recap re-verifies" | ✗ (no gate cited) | **S.Z1 never ran — the re-verification this row promises never happened** | T-1 |
| 73–74 | EN-a/EN-b (browser-dead easing / mixed-track drop) | FOLD | ✗ (tier bug) | Both landed + browser-proven (`0ce55ed`) | T-1 |

**§8 recorded-future (21 items, `S.md:1033-1101`) — spot-checked, not exhaustively re-verified:**
items 1 (ten easter eggs), 8 (glass-ui visual-lock re-baseline), 11 (Typed-OM ADOPT threshold), and
6/7 (docs/precepts ownership + TEMPLATE.md amendment discipline) are all still correctly open,
owner-domain or explicitly future-gated — no drift found. Item 11 is now moot in one direction
(Typed-OM was KILLed-with-measurement at row 43, so its ADOPT threshold is dormant, not stale).

---

## T recommendations

1. **Re-verify the ledger from clean, with the tier-check bug fixed first (the Z-band substitute).**
   Scope: fix `inCorrectnessTier` in `scripts/proof-chronic-closure.mjs` to also check
   `proof:library-correctness` and `SCRIPTS["proof:hygiene-chain"]` (F2); wire the 3 orphaned S.B6
   gates into `proof:library-correctness` (F9); sweep `ci.yml`'s stale `value.js 1.2.0` literal
   (F7); then run `proof:chronic-closure` from a clean checkout and hand-triage whatever residual
   reds survive (expected: a small, real, single-digit set — most of the current 52 are tier-bug
   artifacts or missing-witness wording per the fold table). Falsifiable gate: `proof:chronic-closure`
   AND `proof:ci-coverage` both exit 0 on a from-clean `git clone` + `npm ci` + `npm run build`.
   Size: **M**.

2. **Root-cause and close drag-gesture for real — one surface, one seam.** Scope: trace why
   `PlaybackRibbon.vue`'s ribbon-slider (the glass-ui `<Slider>` wrapped by `gatedSliderDown`/
   `useTouchGate`) never reaches `useDragCapture`'s `acquireSelectSuppression()` call under a real
   drag; converge the demo's two "the ONE shared seam" composables (`useDragScrub`,
   `useDragCapture`) into a single one if the audit finds no real reason for two, and delete the
   bespoke touch-gate wrapper around this one widget if glass-ui's own `<Slider>` already handles
   touch-vs-drag disambiguation internally (duplicated gating is itself a DRY defect independent of
   whether it's the root cause). Then correct row 67's own table text to match reality. Falsifiable
   gate: `proof:drag-gesture` exits 0 including the browser leg, on all 5 named surfaces, from a
   clean `npm run gh-pages` build. Size: **S**.

3. **Close the cross-repo dispatch loop (KF-7 + the value.js self-dependency phantom + color2Into's
   verification trail).** Scope: send one consolidated letter to value.js bundling (a) KF-7 (rename
   `PropertyDescriptor` — still unrenamed in `2.0.1`, F5), (b) the self-dependency bug found this
   sweep (`"@mkbabb/value.js": "^1.0.2"` in value.js's own `package.json`, F6) — both are upstream,
   neither is kf-fixable; add a kf-side gate that asserts (i) zero `PropertyDescriptor_2`-style
   collision-renames in the published `dist/keyframes.d.ts`, and (ii) zero nested
   `node_modules/@mkbabb/*/node_modules/@mkbabb/*` self/duplicate installs — both cheap, both would
   have caught these two defects the moment they shipped, instead of a docs-only sweep 4 tranches
   later. Adopt the SAME "adopt-event watch" discipline the H4 spine used (poll the registry, act
   only on confirmation) for ALL future cross-repo dispatch riders, not just the headline ones.
   Falsifiable gate: a new `proof:no-collision-rename` (or folded into `proof:dts-rollups-agree`)
   REDs today (planted-true, since `PropertyDescriptor_2` is live) and GREENs once value.js renames
   it; a new `proof:no-nested-self-dependency` census over `package-lock.json` REDs today. Size: **S**.

4. **Backfill the S impl-drive session log to its actual terminus, then adopt an amendment
   discipline for T's own log so this doesn't recur.** Scope: append the missing entries for S.G3
   (incl. the reopen), S.F6, S.B8, S.C4/S2, and S ⑩ to `PROGRESS.md`'s session log (docs-only,
   mechanical — the git log already has everything needed); separately, apply §8 item 7's proposed
   TEMPLATE.md amendment discipline to whatever document plays this role for Tranche T, so a future
   ledger sweep does not have to reconstruct 20 commits of history from `git log` by hand.
   Falsifiable gate: a born-RED doc-drift check (same shape as `proof:claude-paths-live`) asserting
   the session log's last-mentioned commit hash is within N commits of `HEAD` on the tranche branch
   at any audit checkpoint. Size: **S**.
