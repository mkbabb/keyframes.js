# Tranche M — Reconciliation (the targeted edit-spec + post-charter ledger)

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-18 during the CONSTELLATION-CAMPAIGN
> re-audit. This doc records the **targeted edits to existing M wave docs** (the edit-spec for
> the impl phase, since the existing wave docs are NOT mutated), the **post-charter event
> ledger** (the N excursion, the reorient pivot, "stop stopping", this re-audit, the M.W1
> implementation fact), the **DM-W1-bridge ledger row**, the **N Stage HANDOFF row**, and the
> **two new wave stubs** (→ `waves/M.W-DESIGN-PAINT.md` + `waves/M.W15.md`). No engine, demo,
> or library source is written here. inv-16 holds throughout.

---

## §1 — The glass-ui consume-target re-targeting (BB → BC everywhere)

**The event (D10 — owner-locked decision).**
glass-ui 4.0.1 was published **2026-06-18** (13 hours before this session). It widened
the `@mkbabb/value.js` peer range from `"^0.10.0 || ^0.11.0"` to `"^0.13.0 || ^1.0.0"`.

Verified live this session:
- `npm show @mkbabb/glass-ui versions --json` → `['…', '4.0.0', '4.0.1']`; latest `4.0.1`.
- `npm show @mkbabb/glass-ui@4.0.1 peerDependencies['@mkbabb/value.js']` → `"^0.13.0 || ^1.0.0"`.
- `node scripts/proof-peer-satisfied.mjs` → exit 1 on the **installed** glass-ui `4.0.0`
  (the `~4.0.0` pin resolves to 4.0.0 — the lockfile has NOT been updated to 4.0.1 yet).

This means **M.W8's Phase-1 (the peer-widen arm) is unblocked NOW** — it requires only a
lockfile update to resolve `~4.0.0` → `4.0.1`. The aria/RF-17 workaround deletions (S1/S2
in M.W8) remain **BC-gated** (glass-ui BC is the active tranche; BB closed at 4.0.1).

**The active tranche** is **BC** (not BB). BB closed at 4.0.1. Every reference to "BB 4.1.0"
in the existing M wave docs is an edit-spec target as follows:

| Existing doc | Edit-spec |
|---|---|
| `M.W8.md` header + context block | "glass-ui BB 4.1.0" → note that: Phase-1 (the peer-widen) FIRED at 4.0.1 (lockfile-update-now, no manifest change needed since `~4.0.0` admits `4.0.1`); the aria/RF-17 deletion arms move to the **BC cut** |
| `M.W8.md §Born-RED gate` table row S1 | re-word the "Green condition" to acknowledge Phase-1 GREENs on a lockfile update to 4.0.1; Phase-2 GREENs on BC publish + delete |
| `M.W8.md §Dependencies` | split into Phase-1 (4.0.1 lockfile) + Phase-2 (BC — aria/RF-17 arms) |
| `M.md §wave map M.W8 row` | update "fires on glass-ui BB 4.1.0" → "Phase-1 fired on glass-ui 4.0.1 (lockfile update); Phase-2 fires on BC" |
| `PROGRESS.md §1 M.W8 row` | same Phase-1/Phase-2 split note |
| `M.WZ.md` deploy gate | re-target to BC; split into the 4.0.1-FIRED arm + the BC-gated arm (aria/RF-17 + design/demo-perf close criteria) |

**Note on the "sole blocker" overclaim (inv-ε correction).**
M.W8 states `proof:peer-satisfied` is the "SOLE deploy blocker." The campaign audit identified
a second live blocker: `keyframes-vue-published` (USER-DOMAIN — the `@mkbabb/keyframes-vue`
adapter has not been published). This is a separate `continue-on-error` tripwire in
`ci.yml:1582`. M.W8's "sole blocker" is an **inv-ε overclaim**; the correction is:
`proof:peer-satisfied` is the LARGEST structural deploy blocker; `keyframes-vue-published` is
a second, independent USER-DOMAIN blocker (DM-7).

### The M.W8 Phase-1 edit-spec (the lockfile-update-now action)

```
IMPL action (Phase-1, fires NOW — no glass-ui source change required):
  1. npm update @mkbabb/glass-ui   # resolves ~4.0.0 → 4.0.1 (the lockfile update)
  2. node scripts/proof-peer-satisfied.mjs  → exit 0  (Phase-1 DONE)
  3. Commit: "fix(M.W8 Phase-1): lockfile → glass-ui 4.0.1 (peer-widen FIRED)"

IMPL Phase-2 is BC-gated (fires when glass-ui BC publishes with aria/RF-17 cures):
  - delete both :aria-orientation="undefined" lines  (S1 arm → GREEN)
  - delete pointerHandled / onPlayPointerDown interim (S2 arm → GREEN)
  - bump pin: ~4.0.0 → ~<BC>.x
```

---

## §2 — M.W1 bridge note + DM-W1-bridge ledger row

### M.W1 status: IMPLEMENTED (on `tranche-l-dev`)

M.W1 (the parallel report-all runner) was **implemented** on `tranche-l-dev` at commit
`5d047ac` ("feat(M.W1): the parallel report-all runner — the O(N²) iterate-to-green wound
CURED"). `scripts/run-all.mjs` EXISTS on `tranche-l-dev` (verified: `git log --oneline
tranche-l-dev -- scripts/run-all.mjs` → the commit). The implementation IS on the M
branch; it does NOT need to be cherry-picked.

**The current branch (`n-stage-impl`) does NOT have M.W1** — it diverged from
`tranche-l-dev` BEFORE the M.W1 implementation commit. `git log HEAD -- scripts/run-
all.mjs` → empty on `n-stage-impl`. This is the bridge gap.

**Implication for M.md / PROGRESS.md.** The M.md wave map row for M.W1 and the PROGRESS.md
§1 M.W1 status row must note:
- Status: **IMPLEMENTED** on `tranche-l-dev` (commit `5d047ac`).
- The born-RED gate (`proof:report-all`) must still be authored (the gate script
  `scripts/proof-report-all.mjs` does not exist on either branch — the impl committed the
  RUNNER but the gate script itself is a separate impl obligation per M.W1.md §Born-RED).
- The `dev→impl` boundary: `tranche-l-dev` has engine/demo changes from M.W1 but the
  M.W0 `proof:audit-artifacts-M` clause (d) asserts `git diff --stat -- src/ demo/` is
  EMPTY on the M.W0 DEV phase — that remains true for M.W0 specifically (runner scripts
  are not `src/` or `demo/`). No narrowing is needed for M.W0's witness.

**The DM-W1-bridge ledger row** (the new open-deferrals row recording the cross-tranche
implementation state):

```
| DM-W1-bridge | Born | Chronicity | Disposition | Owning wave | Evidence |
|---|---|---|---|---|---|
| M.W1 runner IMPLEMENTED on tranche-l-dev (5d047ac) but born-RED gate proof:report-all | N-excursion | 0 (net-new, not a carry) | VERIFY (confirm scripts/proof-report-all.mjs is authored + the C1–C6 clauses documented in M.W1.md §Born-RED are GREEN; the runner implementation is complete but the gate is the closure oracle) | M.W1 | git log --oneline tranche-l-dev -- scripts/run-all.mjs → 5d047ac CONFIRMED; ls scripts/proof-report-all.mjs → ABSENT on both branches (the gate script still needs authoring) |
```

---

## §3 — M.W8 deploy-unblock Phase-1 — the 4.0.1 lockfile-update-now

This is the primary concrete action item from this reconciliation.

**Observable born-RED (TODAY, verified):**
`node scripts/proof-peer-satisfied.mjs` exits 1 — glass-ui installed is 4.0.0, peer
declares `"^0.10.0 || ^0.11.0"`, installed value.js is 0.13.0.

**The unblock action (Phase-1, NOW):**
`npm update @mkbabb/glass-ui` resolves the `~4.0.0` range to 4.0.1 (the tilde admits
patch updates). No `package.json` manifest change is needed — `~4.0.0` already admits
`4.0.1`. The lockfile update alone clears `proof:peer-satisfied` (the installed
glass-ui then carries `peerDependencies["@mkbabb/value.js"] = "^0.13.0 || ^1.0.0"`).

**The ledger entry for this action in PROGRESS.md / deferred-ledger-M.md:**
Update DM-5 (the workaround sweep row) to note that S1/S2 move to the **BC track**
(glass-ui BC is the active tranche; 4.0.1 delivered the peer-widen but NOT the aria or
RF-17 fixes). The `proof:peer-satisfied` arm of M.W8 splits into:
- **Phase-1** (lockfile-update-now, DONE after `npm update`): `proof:peer-satisfied` → GREEN.
- **Phase-2** (BC-gated): S1 (`:aria-orientation` delete) + S2 (`pointerHandled` delete) →
  PENDING until BC ships the aria guard + RF-17 dock cure.

---

## §4 — M.W10 packrat: KILL → FIX (the D4 decision flip) + the ledger correction

**D4 — owner-locked decision:** "FIX, not KILL — MEMO keyed on `getCijKey(p,state)` not
`p.id`; flip `memoize.test.ts` to the SOUND assertion."

This **flips the M.W10 S2 framing** (the existing M.W10.md presents the decision as
"re-key OR KILL, defaulting to KILL absent a value.js opt-in"). The owner's D4 decision
resolves the fork: **FIX is the answer** (we own parse-that now; no-legacy = make it sound).

**M.W10.md edit-spec (the S2 section):**
- Replace "**If the unsound tier is KILLED**" fork with: "**FIX (D4 — the owner-locked
  decision):** `getCijKey(p, state)` is already written; the fix is two lookup sites
  (`MEMO.get(getCijKey(p,state))` + `MEMO.set(getCijKey(p,state),…)`) + `mergeMemos`
  re-key. `memoize.test.ts` FLIPS to the SOUND assertion (born-RED on 0.9.0 as-built)."
- The KILL branch is removed as a viable path (D4 closes it; the no-legacy precept:
  don't leave dead-unsound code when the fix is two lines).
- The `proof:packrat-sound` gate remains IDENTICAL in structure: it INVOKES the installed
  `memoize()` over the same-parser-at-two-offsets fixture and asserts the SOUND result.
  Born-RED on 0.9.0; GREEN on the re-keyed PT.M3 publish.

**M.W14 edit-spec (the DL-L9 packrat KILL terminal-belt row):**
- Remove the DL-L9 KILL terminal-belt disposition.
- Replace with: "DL-L9 packrat re-key (FIX per D4) — FOLD → parse-that A.W2;
  `proof:packrat-sound` born-RED on 0.9.0, GREEN on PT.M3 (the (id,offset) re-key)."
- The M.W14 gate list: remove `proof:packrat-sound` from M.W14's scope; it is M.W10 S2's gate.

**deferred-ledger-M.md DM-4 edit-spec:**
- Disposition: was KILL; now **FOLD → parse-that A.W2 (FIX, D4)**.
- Evidence: `getCijKey(p,state)` already exists at `dist/parse.js:1223`; the fix is
  two-line; `memoize.test.ts` carries a BORN-RED proof-of-unsoundness; no zero-consumer
  argument survives D4 (we own parse-that — no-legacy means we fix it).

**deferred-ledger-M.md DM-17 edit-spec (the consequential update — the D4 KILL→FIX flip
makes DM-17's "RESOLVED-BY-KILL" stale):**
- In `deferred-ledger-M.md §2e` DM-17 row, the `Proposed disposition` field reads
  "**RESOLVED-BY-KILL (DM-4)**" with the rationale "moot once DM-4 KILL is chosen (no
  gate ever authored)."
- D4 changes the disposition to FIX (not KILL). DM-17 must be updated to:
  **"RESOLVED-BY-FIX (DM-4 → parse-that A.W2)"**
- The updated rationale: `proof:packrat-sound` IS now authored — born-RED on 0.9.0,
  GREEN on PT.M3 (the (id,offset) re-key). The gate is the M.W10 S2 gate (not M.W14).
  DM-17's "moot once DM-4 KILL" note is replaced with: "gate is authored at A.W2 as
  part of the FIX obligation; DM-17 resolves when `memoize.test.ts` FLIPS to the SOUND
  assertion (proof:packrat-sound GREEN)."

---

## §5 — M.W11 band: C → A+C (the gate-first Phase-1 re-classification)

**The edit-spec for M.W11.md and PROGRESS.md §1 M.W11 row:**

M.W11 was classed as Band C (sibling-gated consume). The CONSTELLATION-CAMPAIGN re-audit
re-classifies it as **Band A+C**:

- **Band A (Phase-1 gate, authored NOW):** `scripts/proof-css-parity.mjs` (ABSENT today —
  `ls scripts/proof-css-parity.mjs` → not found, verified). Author the 8 runtime-invocation
  rows over value.js's REAL 0.13.0 failure modes as born-RED gates right now. This is
  gate-first law: the gate is authored against today's tree (which crashes on nesting and
  bare-gradient), before the cure lands.
- **Band C (Phase-2 close):** the gate GREENs on value.js-O + parse-that coordinated grammar
  publish. The impl is still sibling-gated; only the gate is Band-A.

**The M.W11.md header edit:**
- `Band: C` → `Band: A+C`
- Add: "Phase-1 (Band A): author `proof:css-parity` NOW, born-RED on 0.13.0 failure modes
  (nesting THROWS, bare-gradient THROWS, each row asserts the CURED shape NOT the current
  throw). Phase-2 (Band C): the gate GREENs on the coordinated value.js-O + parse-that
  grammar publish."

---

## §6 — The prompt-recap + deferred-ledger fold (the post-charter events)

The following post-charter events occurred between the M.W0 authoring and this
reconciliation. Each must be folded into `audit/prompt-recap-M.md` and
`docs/tranches/M/audit/deferred-ledger-M.md`:

### Event 1 — The N-tranche excursion (2026-06-17/18)

The owner initiated Tranche N (the Stage scene-switcher) during the same session as M.
N.W0 (design synthesis + research) was authored; N.W1–N.W7 wave specs authored; a
prototype was implemented and iterated through several cycles in `n-stage-impl`; the
STAGE-SPEC first-principles atomic spec was authored.

**Prompt-recap-M entry:**
```
| N-excursion | The owner initiated Tranche N (the Stage scene-switcher) mid-M-session |
| ADDRESSED | N is a net-new tranche; M.md §constellation/inv-16 note records the coordination. |
|           | The N implementation on n-stage-impl is NOT an M violation (inv-16: demo writes |
|           | only kf-internal; N writes only the demo layer). The SHELVED status (per the     |
|           | STAGE-SPEC close commit "SHELVED per owner") means N is parked; M carries the   |
|           | N Stage HANDOFF row (DM-24) for the BC dock sequencing window.                 |
|           | (DM-21/22 are already used for @property/named-selector correctness items;       |
|           | DM-24 is the next free number — see §7.)                                         |
```

### Event 2 — The reorient pivot (the "stop stopping" directive)

The owner directed: "stop stopping" — the pattern of waiting for sibling publishes before
proceeding with kf-internal work. This is the **campaign reorientation**: M proceeds
kf-internally in parallel, authoring born-RED gates NOW (especially `proof:css-parity`
Phase-1) rather than waiting for the sibling-publish condition to be satisfied.

**Prompt-recap-M entry:**
```
| Stop-stopping / reorient | Owner directive: proceed kf-internally; don't wait for  |
|                          | sibling publishes to author gates.                       |
| ADDRESSED | M.W11 Band reclassification A+C (the gate authored NOW, born-RED on 0.13.0). |
|           | M.W8 Phase-1 (the 4.0.1 lockfile update) unblocked and actioned.               |
|           | M.W9/W10 born-RED gates authored against the installed 0.13.0 / 0.9.0 today.  |
```

### Event 3 — The 32-lane re-audit (this session)

The campaign CONSTELLATION-CAMPAIGN.md was authored and the re-audit conducted. This
produced the 10 D-decisions (D1–D11), the BB→BC re-target, the packrat FIX (not KILL),
the M.W8 Phase-1 unblock, the M.W11 Band-A+C reclassification, and the new wave stubs
(M.W-DESIGN-PAINT + M.W15).

**Prompt-recap-M entry:**
```
| 32-lane constellation re-audit | This session (2026-06-18)                             |
| FOLD-INTO-M | The outcomes are this M-RECONCILIATION.md doc + two new wave stubs.       |
|             | The D1–D11 decisions are locked in CONSTELLATION-CAMPAIGN.md.              |
|             | No source was written; inv-16 holds.                                        |
```

### Event 4 — M.W1 implemented on tranche-l-dev

M.W1 (the parallel report-all runner, `scripts/run-all.mjs`) was implemented on
`tranche-l-dev` at commit `5d047ac`. **It is NOT on `n-stage-impl`** — confirmed by
`git branch --contains 5d047ac` → `tranche-l-dev` only; `n-stage-impl` diverged from
`tranche-l-dev` BEFORE this commit. The §2 note above ("The current branch (`n-stage-impl`)
does NOT have M.W1") records the bridge gap correctly. The implementation is on
`tranche-l-dev`; it has NOT yet been transferred to a clean M impl branch.

**Prompt-recap-M entry:**
```
| M.W1 implemented on tranche-l-dev | The runner landed on tranche-l-dev (5d047ac);        |
| ADDRESSED (pending branch transfer) | DM-W1-bridge ledger row added (§2 above).          |
| NOT on n-stage-impl                | The born-RED gate proof:report-all still needs         |
|                                   | authoring; the C1–C6 clauses are the closure oracle.   |
```

---

## §7 — The N Stage HANDOFF row (DM-24)

**DM-21 is already in use** (`deferred-ledger-M.md §2e` DM-21 = `@property drops from
compileToCSS`; DM-22 = named-selector frames → NaN-always-active). The N Stage HANDOFF
row is **DM-24** (the next free number after DM-23).

The N Stage scene-switcher was **shelved** (owner directive, 2026-06-18 STAGE-SPEC commit
message: "the stage selector SHELVED per owner; impl preserved on this branch, spec kept").
The implementation exists on `n-stage-impl`; it is not on `master` or `tranche-l-dev`.

The BC dock sequencing is the trigger: once glass-ui BC ships the dock redesign
(`W-DOCK-MORPH-FAMILY`), the Stage invocation from the dock's scene-select affordance
becomes viable. The Stage is shelved pending that dock design.

**New ledger row (add to `docs/tranches/M/audit/deferred-ledger-M.md` §D net-new rows +
`M/PROGRESS.md §"Open deferrals" §D`):**

```
| DM-24 N Stage scene-switcher HANDOFF | Born N (2026-06-18) | Chronicity 0 (net-new) |
| HANDOFF (BC dock sequencing) | N.WZ or a subsequent tranche | The stage implementation |
| exists on n-stage-impl (SceneStage.vue + CarouselDisk.vue + StageArrows.vue +         |
| composables/ + previews/). Shelved pending glass-ui BC W-DOCK-MORPH-FAMILY dock       |
| redesign. TRIPWIRE: glass-ui BC publishes the dock redesign → N impl unshelf →        |
| N.WZ integration. The born-RED gate is proof:n-stage-boundary (N.W2 spec authored) — |
| a live bundled demo import-graph walk rooted at SceneStage.vue asserts zero heavy     |
| engine imports (the REAL import-graph, not a grep proxy). Already written in          |
| docs/tranches/N/waves/N.W2.md.                                                        |
```

---

## §8 — Gitignore `.wf-fix.js`

`docs/tranches/N/.wf-fix.js` is a workflow-orchestration artifact (not source). It appears
in the git status as an untracked file. It should be added to `.gitignore`.

**Edit-spec for `.gitignore`:**
```
# workflow-orchestration artifacts (not source)
.wf-fix.js
**/.wf-fix.js
```

This is a one-line add to `.gitignore`. The pattern `**/.wf-fix.js` catches the file
wherever a workflow-orchestration run drops it. The existing `.proof-spring-entry.*`
precedent (a proof script artifact from a crashed run) is the idiomatic model.

---

## §9 — The consume-side bundle gate (the "atlas" finding)

The CONSTELLATION-CAMPAIGN.md §4 names a **consume-side bundle gate**: "a consumer eagerly
importing the LIGHT surface must not drag the HEAVY engine — the generalized 'atlas' finding."

This is a SEPARATE gate from the library-only `proof:boundary` (which gates that the
published `dist/keyframes.js` barrel exposes only LIGHT static edges). The consume-side gate
is a CONSUMER perspective: a downstream project that does `import { SpringProgress } from
"@mkbabb/keyframes.js"` in its own bundler build must not end up with engine.ts / value.js
in its output bundle.

**The gap (the atlas finding):** `proof:boundary` gates the LIBRARY barrel. It does NOT gate
a downstream consumer bundle. A consumer can install `@mkbabb/keyframes.js`, eagerly import
the LIGHT surface, and still pull in heavy chunks if the `exports` map, `sideEffects: false`
field, or `treeshake` metadata is wrong. The atlas finding: the subpath split (value.js O.W2)
creates subpaths that need to be verified consumer-side too.

**DM-22 is already in use** (`deferred-ledger-M.md §2e` DM-22 = named-selector frames →
NaN-always-active). The consume-side bundle gate row is **DM-25** (the next free number
after DM-24).

**The gate spec (to be authored in M.W9 alongside `proof:boundary` W96):**
```
proof:consume-bundle (NEW, M.W9 or M.W12)
  Structure: a tmp consumer project (package.json + a single entry import of each LIGHT
  export) bundled with rolldown (no vite/webpack — rolldown is already the proof:boundary
  bundler). Assert: the consumer bundle contains zero value.js modules and zero engine.ts.
  Born-RED: plant a static value.js import in any LIGHT module → the consumer bundle
  includes value.js → exit 1.
  Green condition: the published dist's exports map + sideEffects:false are correct.
  Distinguishes from proof:boundary: proof:boundary bundles from SOURCE (src/animation/
  index.ts); proof:consume-bundle bundles from the DIST (dist/keyframes.js) as a
  consumer would.
```

**Ledger entry (add to DM-25 or fold into M.W9 scope):**
```
| DM-25 consume-side bundle gate absent | Born M-reaudit | Chronicity 0 (net-new) |
| FOLD → M.W9 (author proof:consume-bundle alongside W96 parse-that-scan) | M.W9 |
| The gate is kf-internal (no sibling publish required); born-RED by planting a heavy |
| import in the dist's light surface and observing a consumer bundle pulling it in.   |
```

---

## §10 — The two new wave stubs (M.W-DESIGN-PAINT + M.W15)

See the companion files:
- `docs/tranches/M/waves/M.W-DESIGN-PAINT.md` — born-RED pixel-readback gate over the demo
  scenes (inv-M-observable-truth made visual; BC-gated).
- `docs/tranches/M/waves/M.W15.md` — demo-perf: lighthouse per scene, critical CSS,
  content-visibility, BC.W-LIGHTHOUSE coord + the consume-side bundle gate spec.

These are new Band additions. They are NOT part of any existing wave doc. Their DAG
position is **BC-gated** (they require the BC glass-ui consume — the aria/RF-17 fix +
the dock redesign — before the demo is final enough to gate on visual/perf truth).

---

## §11 — The full edit-spec summary (what changes in which existing doc)

| Existing doc | Edit | Priority |
|---|---|---|
| `M.md §wave map M.W8` | Phase-1/Phase-2 split; BB→BC re-target; "sole blocker" → "largest structural blocker" | IMPL-OPEN |
| `M.md §wave map M.W11` | Band C → Band A+C | IMPL-OPEN |
| `PROGRESS.md §1 M.W1` | Status: DEVELOPED → IMPLEMENTED (on tranche-l-dev, NOT n-stage-impl; transfer to M branch) | PRE-IMPL |
| `PROGRESS.md §1 M.W8` | Phase-1 FIRED (4.0.1); Phase-2 BC-gated | IMPL-OPEN |
| `PROGRESS.md §1 M.W10` | S2: KILL fork removed (D4 — FIX is the answer) | IMPL-OPEN |
| `PROGRESS.md §1 M.W11` | Band C → A+C | IMPL-OPEN |
| `PROGRESS.md §"Open deferrals" §D` | Add DM-24 (N Stage HANDOFF) + DM-25 (consume-bundle gate) + DM-W1-bridge | PRE-IMPL |
| `audit/deferred-ledger-M.md` | DM-4: KILL → FIX/FOLD per D4; DM-17: RESOLVED-BY-KILL → RESOLVED-BY-FIX (D4 → A.W2); DM-24/25/DM-W1-bridge new rows | IMPL-OPEN |
| `audit/prompt-recap-M.md` | Add events 1–4 (N excursion, reorient, re-audit, M.W1-impl) | IMPL-OPEN |
| `M.W8.md` | Phase split; BB→BC; "sole blocker" inv-ε correction | IMPL-OPEN |
| `M.W10.md §S2` | KILL fork → FIX (D4); `proof:packrat-sound` gate structure unchanged | IMPL-OPEN |
| `M.W11.md` header + born-RED | Band C → A+C; Phase-1 born-RED description added | IMPL-OPEN |
| `M.W14.md` | Remove DL-L9 packrat KILL from M.W14 scope; it is parse-that A.W2 (FIX, D4) | IMPL-OPEN |
| `.gitignore` | Add `**/.wf-fix.js` pattern | NOW |

---

## §12 — DAG position of the new waves

The existing M band DAG extends as follows:

```
… Band D (M.W12 perf; M.W13 seam) · Band E (M.W14 terminal-belt exits)
  │
  ▼ BC consume (M.W8 Phase-2 + glass-ui BC publish)
  │
  ├─► M.W-DESIGN-PAINT (pixel-readback visual truth, BC-gated)
  └─► M.W15 (demo-perf lighthouse + critical CSS + content-visibility, BC-gated)
  │
  ▼ M.WZ (close — gated on A+B green, Band C consumed-or-circled, BC design/perf green)
```

M.WZ's close criteria gain two new preconditions:
1. M.W-DESIGN-PAINT born-RED gate passes on the BC-consumed demo.
2. M.W15 lighthouse floors hold on the BC-consumed demo.
