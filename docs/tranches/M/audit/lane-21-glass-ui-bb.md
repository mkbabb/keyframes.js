# Lane 21 — glass-ui BB (the in-flight tranche; the five asks; the F-2 deploy blocker)

**Lane:** 21 · **Tranche:** M (seed audit) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `529fcfd` → close commit `4686aa4`)
**Subject:** glass-ui BB tranche status from the kf consume side — the five cross-repo asks
filed in `docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md`, the F-2 peer-cycle (the live deploy
blocker), the workaround inventory, the precept posture, and M's ownership obligations.

**Gates re-run this session (all node-static, re-runnable):**
- `node scripts/proof-peer-satisfied.mjs` → exit 1, FAIL (ELSPROBLEMS: value.js 0.13.0 fails glass-ui `^0.10.0 || ^0.11.0`) — confirmed
- `node scripts/proof-workaround-deletion.mjs` → exit 0, 0 GREEN / 5 PENDING / 0 RED — confirmed
- `node scripts/proof-control-point-live.mjs` → exit 1, RED by design (GlassControlPoint absent) — confirmed
- `node scripts/proof-boundary.mjs` → exit 0, PASS (Oscillator LIGHT confirmed) — confirmed
- `npm show @mkbabb/glass-ui version` → `4.0.0` (latest) — confirmed
- `npm show @mkbabb/glass-ui@4.1.0 version` → E404 — confirmed unpublished

**Relationship to lane-09:** lane-09 audits the Band-B dispatch mechanics (gate correctness,
three-state model, Oscillator ship, framing accuracy of all five dispatch docs). Lane-21 is
orthogonal: it audits glass-ui BB as the EXTERNAL ACTOR — what BB must publish, what kf
owns on consume, the DEPLOY BLOCKER status, and the M-wave proposals.

---

## §0 — Verdict (read first)

**The F-2 peer-cycle is the live deploy blocker for the full tranche-L merge to master.**
`proof:peer-satisfied` runs exit 1 RED today (verified: glass-ui 4.0.0 declares
`"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` but installed is `0.13.0`; ELSPROBLEMS). This
gate rides `continue-on-error`, so it does not block the `proof:all` roster, but its RED
state means `proof:all` cannot go fully green until glass-ui BB widens the peer range and
kf re-pins. The deploy round-trip (`CI green → auto-deploy → keyframes.babb.dev`) is gated
on this one glass-ui publish.

Three of the five asks are blocked on a single glass-ui release (§1 aria fix + §2 RF-17 +
§3 F-2 peer widen — all target glass-ui 4.1.0). One ask (§4 GlassControlPoint) is at the
P-invariant-28 terminus — M cannot BOOK it for a seventh tranche; BB must disposition it or
kf must KILL it. One ask (§5 KF-OSCILLATOR) is kf-delivered and waiting on a BB consume
signal that arrived AFTER the primitive shipped.

No precept violations are introduced by the PENDING state — every workaround is held
correctly per inv-L-acyclic-purity (the three-state gate model is sound). Two existing
precept violations are live: S1 and S2 are workarounds (the `:aria-orientation` suppress
and the `pointerHandled` interim) whose existence violates inv-16 / no-workaround, but they
are correctly STAGED (PENDING, not RED) because the sibling is unpublished.

---

## §1 — Registry probe and peer cycle (the deploy blocker, VERIFIED)

### §1.1 Published state

`npm show @mkbabb/glass-ui` (re-run 2026-06-17):

| Field | Value |
|---|---|
| latest version | `4.0.0` |
| `@mkbabb/value.js` peer range | `"^0.10.0 || ^0.11.0"` |
| `@mkbabb/keyframes.js` peer range | `"^2.2.0 || ^3.0.0 || ^4.0.0"` |
| BB (4.1.0) | E404 — not published |

The kf peer range (`^2.2.0 || ^3.0.0 || ^4.0.0`) DOES admit kf 4.3.0 — this half of the
peer cycle is satisfied. The value.js half is not.

### §1.2 The F-2 peer-cycle breach (LIVE, VERIFIED)

`proof:peer-satisfied` re-run output (the authoritative gate):

```
✗ glass-ui@4.0.0 declares peer @mkbabb/value.js@"^0.10.0 || ^0.11.0" but installed
  is 0.13.0 (ELSPROBLEMS) — the peer range REJECTS the installed sibling; any
  consumer installing both gets a peer-conflict error.
EXIT: 1
```

This is not a CI artifact: a real consumer running
`npm install @mkbabb/keyframes.js @mkbabb/glass-ui` today gets `ELSPROBLEMS`. The
no-workaround precept explicitly forbids papering with `npm overrides` or
`peerDependenciesMeta optional`
(`docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md §3`, `docs/tranches/L/audit/completion-lanes-32-36.txt §Lane 36`).

**Deploy chain:** `proof:peer-satisfied` rides `continue-on-error` in ci.yml so it does
not abort the blocking `proof:hygiene` chain. But the L close FINAL states the deploy
round-trip is "gated solely on glass-ui BB (the `proof:peer-satisfied` tripwire → green CI
→ auto-deploy)" (`FINAL.md §S6`). The causal chain: glass-ui BB widens peer → kf re-pins →
`proof:peer-satisfied` GREEN → full `proof:all` green → master merge → CI green →
`deploy-pages.yml` fires → live `keyframes.babb.dev`.

**The ask to glass-ui BB** (from `KF-TO-GLASSUI-BB-ASKS.md §3`):

```json
"peerDependencies": {
  "@mkbabb/value.js": "^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0"
}
```

or a wider range covering the O-tranche cadence once `^0.14.0` is confirmed.

---

## §2 — The five asks: ground-truth status

### §2.1 Ask §1 — SegmentedTabs pill-variant: omit `aria-orientation` on `role=group`

**Defect verified in the published dist:**

`node_modules/@mkbabb/glass-ui/dist/tabs.js` lines 203–204:
```js
role: V.value ? "tablist" : "group",
"aria-orientation": H.value ? "vertical" : "horizontal",
```

The `role` is conditional on `V.value` (so pill renders `"group"`, tab renders `"tablist"`),
but `aria-orientation` is emitted unconditionally in the same object literal. The ARIA spec
forbids `aria-orientation` on `role=group`; it is valid only on `role=scrollbar`,
`separator`, `slider`, `tablist`, `toolbar`, `treeitem`. This is a structural one-line
defect in the compiled glass-ui source — a conditional guard is needed.

**kf-side workarounds (BOTH present, BOTH suppressing the defect):**

```
demo/spring/SpringSidebar.vue:43         :aria-orientation="undefined"
demo/@/.../AnimationControls.vue:72      :aria-orientation="undefined"
```

Both strips verified via `proof:workaround-deletion` S1 arm (PENDING). The fleet-wide blast
radius is exactly these two render sites (`grep -r 'variant="pill"' demo/` returns 2 render
sites + 3 comment/composable non-render hits — verified).

**Gate state:** `proof:workaround-deletion` S1: PENDING (workaround PRESENT + glass-ui
4.1.0 E404). The gate will turn RED (overdue) the moment glass-ui BB ships the fix and kf
has not consumed; it will turn GREEN when kf deletes both lines in the re-pin commit.

**M ownership:** on glass-ui BB shipping the conditional bind (emit `aria-orientation` only
when `role ≠ group`): re-pin to the published cut, delete BOTH lines in ONE commit,
`proof:workaround-deletion` S1 → GREEN.

### §2.2 Ask §2 — W-DOCK-MORPH-FAMILY / RF-17 dock click-strand

**kf-side workaround (PRESENT, verified):**

`demo/@/components/custom/animation-controls/TransportDock.vue` lines 342–373 contain
the `onPlayPointerDown`/`pointerHandled` interim. The guard intercepts `pointerdown`
events on the play button to prevent the dock's collapse-crossfade from swallowing the
`click`. The inline comment explicitly names it as a demo-side cure of a glass-ui
primitive defect (`TransportDock.vue:340-346`).

**Gate state:** `proof:workaround-deletion` S2: PENDING (workaround PRESENT + glass-ui
4.1.0 E404). Chronicity: 3 (I, J, K → L). P-invariant-28 bars a fourth tranche carry —
if glass-ui 4.1.0 is not published by M.WZ, the no-workaround precept and P-inv-28 jointly
demand a terminal disposition (the interim cannot ride to a 4th carry).

**The ask to glass-ui BB** (`KF-TO-GLASSUI-BB-ASKS.md §2`):
- `W-DOCK-MORPH-FAMILY` closes the hover-expand edge case (compositor `transform` track,
  not `inline-size`, so no relayout flash).
- RF-17 strand: the collapse-crossfade completes at SETTLED geometry before icon visibility
  changes — no intermediate state where icon + label coexist at partial opacity.
- PRM snap completes synchronously at target geometry.

**M ownership:** on glass-ui 4.1.0 shipping `W-DOCK-MORPH-FAMILY` + RF-17 fix: re-pin
`~4.1.0`, delete `onPlayPointerDown`, `pointerHandled`, and `onCollapsedPlayClick`'s guard
in ONE commit. `proof:workaround-deletion` S2 → GREEN.

### §2.3 Ask §3 — F-2 peer-cycle widen (THE DEPLOY BLOCKER)

Covered in full at §1. The kf-side gate is `proof:peer-satisfied` (born-RED-by-design).
The gate is the kf-side proof that the defect is live — its RED is the signal, not the
failure mode. The gate turns GREEN when glass-ui BB widens the peer range + kf re-pins.

**M wave obligation:** the re-pin commit that addresses §1 (S1 deletion) + §2 (S2
deletion) ALSO satisfies §3 (the peer range widens in the same glass-ui cut). These are
three distinct gate conditions but ONE re-pin commit if BB ships them all in 4.1.0:
delete both `:aria-orientation="undefined"` lines, delete the RF-17 interim, bump the pin
from `~4.0.0` to `~4.1.0`. `proof:workaround-deletion` S1 + S2 → GREEN,
`proof:peer-satisfied` → GREEN, all in the same atomic commit.

### §2.4 Ask §4 — GlassControlPoint (the P-invariant-28 terminus)

**Current state (VERIFIED):**

```
grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/ → 0 hits
proof:control-point-live → exit 1 (RED by design)
```

GlassControlPoint is absent from the published glass-ui 4.0.0 dist tree. Chronicity: 6
(E, F, G, H, I, J, K → L). `deferred-ledger-L.md §DLL-20`:

> **P-inv-28 (6-tranche ≥4): the gate-first BOOK exits the belt on the FIRST consume —
> the re-BOOK option is CLOSED; if still absent at the next close it exits as EXITED
> (shipped) or a named build-in-kf KILL with a concrete spec.**

**M owns the terminal disposition.** M cannot BOOK GlassControlPoint for a 7th tranche.
The exit forms are:

- **Option A (BB-in-scope, ships in 4.1.0 or named BB sub-wave):** kf re-pins and builds
  the keyframes-editor view over the published primitive. `proof:control-point-live` →
  GREEN.
- **Option C (KILL):** BB records GlassControlPoint as out of scope. kf closes DL-L7 as
  KILL permanently. `proof:control-point-live` is tombstoned (or repurposed) with the
  KILL record. The keyframes curve editor is off the roadmap.

**No Option B (post-BB named version) is available** — that would be a 7th BOOK, which
P-inv-28 bars.

**M precept obligation:** if GlassControlPoint remains absent at M.WZ and no KILL record
exists, the FINAL must record a P-invariant-28 breach (the 7-tranche carry without a
terminal disposition). The precept bars this form; M cannot close honestly without a
verdict on this row.

### §2.5 Ask §5 — KF-OSCILLATOR co-schedule

**kf-side delivery (LANDED, VERIFIED):**

`src/animation/oscillator.ts` exists. `src/animation/index.ts:74-75`:
```ts
export { Oscillator, waveformValue } from "./oscillator";
export type { OscillatorConfig, OscillatorWaveform } from "./oscillator";
```

`proof:boundary` → exit 0 (the Oscillator module has zero static value.js edge — LIGHT,
verified). `OscillatorConfig` naming avoids the Web Audio API `OscillatorOptions` global
collision (the PKG-3 defect pattern — the `KeyframesAnimation`/`ScrollTimeline` rename
precedent).

**The consume signal from glass-ui BB** (`KF-TO-GLASSUI-BB-ASKS.md §5`):
- The ask is to confirm the BB wave (`W-EASING-PRIMITIVE` or `W-SPEEDTEST-IDLE`) that
  consumes `Oscillator` and the required API shape.
- The shipped shape: `tick(dt: number): number`, `sample(t: number): number`,
  `.phase` (current ∈ [0,1)), `.value` (waveform of current phase ∈ [-1,1]),
  `reset(phase?)`, constructor takes `OscillatorConfig { frequency, waveform? }`.
  Waveforms: `"sine" | "triangle" | "square" | "sawtooth"`.
- `waveformValue(phase, waveform): number` exported as a standalone pure function.

**The ship-before-signal gap** (lane-09 §4): the Oscillator was shipped at L.W9
unconditionally rather than waiting for the BB consume signal. This is an inv ε framing
tension (the dispatch says "ship once BB confirms"; the implementation shipped
immediately). The gate (`proof:boundary` LIGHT check) is satisfied. If glass-ui BB's
`W-EASING-PRIMITIVE` requires a different API shape (e.g., output range `[0, 1]` instead
of `[-1, 1]`, or a different waveform set), M has a breaking change obligation on the
LIGHT surface. The `OscillatorConfig` type is exported in `dist/keyframes.d.ts` — any
shape change is a MINOR (or MAJOR if the surface is consumer-facing).

**M ownership:** (a) when BB confirms the consuming wave + API shape, record the
confirmation in M's dispatch docs; (b) if the shipped shape matches, no code change needed;
(c) if BB requires a different shape, evolve the Oscillator in M and bump the version
accordingly.

---

## §3 — Workaround inventory (all five arms — current state)

The `proof:workaround-deletion` gate is the authoritative state machine. Re-run 2026-06-17:

| Arm | Workaround | Gate state | Tripwire |
|---|---|---|---|
| S1 | `:aria-orientation="undefined"` × 2 (`SpringSidebar.vue:43`, `AnimationControls.vue:72`) | PENDING (PRESENT + glass-ui 4.1.0 E404) | glass-ui BB SegmentedTabs pill-branch fix → glass-ui 4.1.0 |
| S2 | `pointerHandled`/`onPlayPointerDown` in `TransportDock.vue` (7 hits: lines 15, 151, 196, 342, 348, 358, 361, 366, 373) | PENDING (PRESENT + glass-ui 4.1.0 E404) | glass-ui BB W-DOCK-MORPH-FAMILY + RF-17 → glass-ui 4.1.0 |
| S7 | `LINEAR_PAREN_PREFIX` regex (`src/animation/utils.ts:119, 185`) | PENDING (PRESENT + value.js 0.14.0 E404) | value.js VJ-L2 `FunctionValue.toString()` fix |
| S8 | `FN_NAME` Symbol stamp on value.js `ValueUnit` (`utils.ts:45, 47, 51, 55, 218, 294, 347`) | PENDING (PRESENT + value.js 0.14.0 E404) | value.js VJ-L1 first-class `flatLeaf` |
| S9 | direct `@mkbabb/parse-that` import at `utils.ts:1` | PENDING (PRESENT + value.js 0.14.0 E404) | value.js VJ-L3 `parseCSSSubValue` |

Arms S7/S8/S9 are value.js-owned, not glass-ui-owned. This lane focuses on S1/S2 (glass-ui
BB). S7/S8/S9 are covered in the value.js-O lane.

---

## §4 — Precept reckoning

### §4.1 No-workaround / inv-16 violations (STAGED, PENDING — not bare violations)

S1 and S2 are workarounds for sibling defects — they violate the no-workaround precept and
inv-16 (kf writes only its repo) by definition. They are correctly STAGED per the
three-state model: PENDING means the sibling is unpublished and the workaround is the
minimum hold. Deleting them before the sibling publishes would break the consumer. The
gate's three-state model is the correct instrument — a two-state (PRESENT=RED / ABSENT=GREEN)
model would force kf into an impossible position.

**The PENDING state is not a workaround loop.** The precept (`no-workaround`) names the
EXISTING state (the workarounds are violations TODAY), and the gate names the EXIT condition
(the sibling publish). The L close records them as violations AND names the cure — this is
the correct precept-reckoning form.

**The RF-17 interim chronicity (3 = I, J, K → L) triggers the P-invariant-28 terminal
mandate.** The `deferred-ledger-L.md §DLL-19` records: "no interim carries to a 4th tranche
under no-workaround; P-inv-28 exit-shaped." M cannot carry the S2 workaround to M.WZ
without a terminal disposition from glass-ui BB. If glass-ui 4.1.0 is not published by
M.WZ, M must either (a) record a forced KILL (demo ships without the correct dock behavior,
explicitly documented) or (b) publish a minimal glass-ui patch from the kf owner that fixes
the dock and publishes it — but the latter requires writing glass-ui source, which inv-16
forbids unless the kf owner IS the glass-ui owner.

### §4.2 No overclaim on PENDING state

The FINAL (`FINAL.md §S5`) correctly states: "EVERY Band-B consume-edge is un-consumed at
this close." No gate is weakened. No workaround is self-certified as "fixed." This is the
inv ε form. The M charter inherits this honest posture.

### §4.3 The Oscillator ship-before-signal gap

The wave spec (`L.W9.md §S5`) says: "kf ships [Oscillator] in L.W9 once the BB consume
signal confirms the wave + API shape." The implementation shipped unconditionally (FINAL.md
§S5: "The Oscillator LIGHT primitive shipped at L.W9"). This is an inv ε discrepancy — the
claim "ship once BB confirms" was not honored in execution. It is not a precept violation
(the primitive is value.js-free, LIGHT, correctly gated by `proof:boundary`) but it is a
discipline gap: the consume signal was the gating condition for ship, and that gate was not
enforced.

The practical risk: if glass-ui BB's `W-EASING-PRIMITIVE` requires a different API shape
than what shipped, the published surface has a breaking change in M. Track via the consume
signal confirmation.

---

## §5 — M-wave proposals

### M-Wave A — the glass-ui BB re-pin commit (the UNLOCK commit)

When glass-ui 4.1.0 publishes (with the peer widen + SegmentedTabs fix + RF-17 dock cure):

1. Bump `optionalDependencies["@mkbabb/glass-ui"]` from `~4.0.0` to `~4.1.0` in
   `package.json`.
2. Delete BOTH `:aria-orientation="undefined"` lines (`demo/spring/SpringSidebar.vue:43`
   and `demo/@/.../AnimationControls.vue:72`).
3. Delete the `onPlayPointerDown`/`pointerHandled` interim in `TransportDock.vue` (the
   comment block + function declarations + event handler calls — 9 current hits).
4. Run `proof:workaround-deletion` → S1 + S2 GREEN.
5. Run `proof:peer-satisfied` → exit 0 GREEN (the deploy blocker clears).
6. Full `proof:all` green → close-merge to master → CI → auto-deploy.

This is ONE atomic commit. It is the M gating event — the wave that unlocks the L
close-merge deploy round-trip.

**Precept check:** the commit deletes workarounds (no-workaround precept satisfied), writes
only kf's repo (inv-16 satisfied), consumes the published sibling (inv-13 / acyclic-spine
satisfied). No gate is weakened; two born-RED gates turn GREEN by design.

**Timing note:** if glass-ui 4.0.x ships a PATCH for the peer-widen only (but not the
SegmentedTabs fix or RF-17 cure), the re-pin should be to that patch — `proof:peer-satisfied`
turns GREEN while S1 and S2 remain PENDING. The commit is then split: peer-widen-only
re-pin first, followed by S1+S2 deletion on the 4.1.0 cut. The FINAL states these as one
commit for the 4.1.0 case but a split is correct if BB ships them separately.

### M-Wave B — GlassControlPoint terminal disposition

**This wave has NO deferral path.** The options are:

- **Option A (ship):** glass-ui BB publishes `GlassControlPoint`. kf re-pins (likely part
  of Wave A above), builds the keyframes-editor view over the published primitive
  (`proof:control-point-live` → GREEN), ships the editor in a kf wave.
- **Option C (KILL):** GlassControlPoint is not in BB scope (or BB is discontinued). kf
  closes DL-L7 as permanent KILL, removes or tombstones `proof:control-point-live`, records
  the terminal decision in M's deferred ledger. The keyframes curve editor is off the kf
  roadmap permanently (or until a build-in-kf decision with a concrete spec is recorded,
  which would require scoping its own LIGHT/HEAVY placement and published surface impact).

**M precept:** P-invariant-28 requires the terminal disposition by M.WZ. If absent at
M.WZ, the FINAL must record a P-invariant-28 breach.

### M-Wave C — Oscillator consume-signal reconciliation

When glass-ui BB confirms the `W-EASING-PRIMITIVE` wave + API shape:

1. Record the confirmation in `docs/tranches/M/KF-TO-GLASSUI-BB-ASKS-RESPONSE.md` (or
   equivalent cross-repo signal doc).
2. If the shipped shape matches: no code change; record as consumed.
3. If BB requires a shape change (e.g., `reset()` signature, waveform set, output range):
   update `src/animation/oscillator.ts` and `src/animation/index.ts`, bump the version
   accordingly (MINOR if additive, MAJOR if breaking), re-run `proof:boundary` to confirm
   LIGHT invariant holds.

---

## §6 — Cross-repo coordination picture (the single picture at M entry)

```
kf 4.3.0 (published; glass-ui ~4.0.0 consumed; value.js ^0.13.0; parse-that ^0.9.0)
│
├─ F-2 peer-cycle (LIVE DEPLOY BLOCKER) ────────────────► glass-ui BB: widen peer
│    proof:peer-satisfied EXIT 1 (RED-by-design)                  @mkbabb/value.js range
│    kf-side gate: the deploy tripwire                             to admit ^0.13.0+
│    → re-pin ~4.1.0 → proof:peer-satisfied EXIT 0 → DEPLOY GREEN
│
├─ §1 SegmentedTabs aria (:aria-orientation on role=group) ──► glass-ui 4.1.0
│    proof:workaround-deletion S1: PENDING                         (or 4.0.x patch)
│    demo/spring/SpringSidebar.vue:43 + AnimationControls.vue:72  — both present
│    → re-pin + delete both lines → GREEN
│
├─ §2 RF-17 dock click-strand (pointerHandled interim) ─────► glass-ui 4.1.0
│    proof:workaround-deletion S2: PENDING                         W-DOCK-MORPH-FAMILY
│    TransportDock.vue (7 hits) — present                          + RF-17 strand fix
│    chronicity 3 (I,J,K→L): P-inv-28 TERMINAL at M
│    → re-pin + delete interim → GREEN
│
├─ §4 GlassControlPoint ────────────────────────────────────► BB disposition (A or C)
│    proof:control-point-live EXIT 1 (RED-by-design)              chronicity 6: P-inv-28
│    → Option A: consume shipped primitive → GREEN                 REQUIRES M.WZ verdict
│    → Option C: KILL permanently → tombstone gate
│
└─ §5 KF-OSCILLATOR ────────────────────────────────────────► BB W-EASING-PRIMITIVE
     Oscillator shipped LIGHT (proof:boundary GREEN)              consume signal
     → BB confirms wave + API shape → record in M dispatch docs
     → if shape mismatch: evolve in M + version bump
```

**Cascade note:** Wave A (the re-pin commit) satisfies F-2 + §1 + §2 simultaneously if
glass-ui 4.1.0 bundles all three fixes. Wave B (GlassControlPoint) is independent. Wave C
(Oscillator reconciliation) depends on BB's signal, not on Wave A.

---

## §7 — Deferred folds for M

| Item | Chronicity | Exit form in M | Born-RED gate | Owner |
|---|---|---|---|---|
| RF-17 / DL-L6 (S2 dock interim) | 3 (I,J,K→L) → M is 4th | P-inv-28 TERMINAL: delete on 4.1.0 consume OR record terminal KILL | `proof:workaround-deletion` S2 | glass-ui BB |
| GlassControlPoint / DL-L7 | 6 (E…K→L) → M is 7th | P-inv-28 TERMINAL: consume on BB publish OR KILL | `proof:control-point-live` | glass-ui BB or kf KILL |
| F-2 peer-cycle / DL-L3 | 2 (K,L) → M | re-pin on BB peer-widen → FOLD | `proof:peer-satisfied` | glass-ui BB |
| §1 aria suppress / DL-L10 S1 | 1 (L) → M | delete on BB root fix → FOLD | `proof:workaround-deletion` S1 | glass-ui BB |

No item above may BOOK again in M without a named tripwire. The RF-17 and GlassControlPoint
rows require explicit terminal dispositions at M.WZ.

---

## §8 — Performance note

No kf-side performance numbers are available for the glass-ui BB tranche directly. The
F-2 peer-cycle breach is a manifest version mismatch — purely a static gate, not a
timing measurement. The RF-17 dock flicker involves a visual transition timing issue in
glass-ui's compositor `transform` path; its resolution eliminates the intermediate state
(the flash at the crossfade seam), which is a jank reduction on every dock expand/collapse
interaction. No bench numbers are possible from the kf side for a glass-ui-internal
compositor change.

---

## §9 — Summary of L-audit factual errors relevant to this lane

The task names two audit errors that implementation caught:

1. **The `!important` premise:** the original audit framing (W1 scope, not W9) asserted
   kf should round-trip keyframe `!important`. Implementation found this is spec-incorrectly
   framed (CSS Animations §3: `!important` in a keyframe is invalid and ignored; value.js
   drops it correctly). The KF-TO-GLASSUI-BB-ASKS.md is NOT affected — §1/§2/§3/§4/§5
   do not reference `!important`. No error carried into this lane's domain.

2. **The CSS Nesting silent-drop mis-attribution:** the audit found CSS Nesting
   "silently dropped"; implementation found it is a hard THROW (`Parse error at offset N`).
   This is in the parse-that/value.js domain (lane-09 §4, KF-TO-PARSE-THAT-ASKS.md §1),
   not the glass-ui BB domain. No error in this lane.

Neither factual error affects the glass-ui BB asks. The `tabs.js` aria-orientation defect
(§2.1 above) is VERIFIED directly against the published dist, not inferred from the audit.

---

## §10 — Evidence anchors (file:line)

| Claim | Evidence |
|---|---|
| glass-ui 4.0.0 is latest; 4.1.0 E404 | `npm show @mkbabb/glass-ui` run 2026-06-17; `npm show @mkbabb/glass-ui@4.1.0` → E404 |
| value.js peer range rejects 0.13.0 | `node_modules/@mkbabb/glass-ui/package.json` `peerDependencies["@mkbabb/value.js"]` = `"^0.10.0 \|\| ^0.11.0"`; `proof:peer-satisfied` exit 1 (verified) |
| kf peer range satisfied | `node_modules/@mkbabb/glass-ui/package.json` `peerDependencies["@mkbabb/keyframes.js"]` = `"^2.2.0 \|\| ^3.0.0 \|\| ^4.0.0"` (admits 4.3.0) |
| `aria-orientation` unconditional emission | `node_modules/@mkbabb/glass-ui/dist/tabs.js:203-204` — role conditional, aria-orientation unconditional |
| S1 workarounds both present | `demo/spring/SpringSidebar.vue:43` + `demo/@/.../AnimationControls.vue:72` — `:aria-orientation="undefined"` |
| S2 workaround present | `demo/@/.../TransportDock.vue:342-373` — `pointerHandled`, `onPlayPointerDown` |
| pill render-site blast radius = 2 | `grep -r 'variant="pill"' demo/` → 2 render sites + 3 non-render hits |
| GlassControlPoint absent | `grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/` → 0; `proof:control-point-live` exit 1 (verified) |
| Oscillator LIGHT (no value.js edge) | `src/animation/oscillator.ts`; `src/animation/index.ts:74-75`; `proof:boundary` exit 0 (verified) |
| 5 workarounds all PENDING | `proof:workaround-deletion` exit 0, 0 GREEN / 5 PENDING / 0 RED (verified) |
| RF-17 chronicity = 3 | `docs/tranches/L/audit/deferred-ledger-L.md §DLL-19` "★ 3 (I,J,K→L)" |
| GlassControlPoint chronicity = 6 | `docs/tranches/L/audit/deferred-ledger-L.md §DLL-20` "★‡ 6 (E,F,G,H,I,J,K→L)" |
| F-2 is the deploy blocker | `docs/tranches/L/FINAL.md §S6` "gated solely on glass-ui BB (the proof:peer-satisfied tripwire → green CI → auto-deploy)" |
| No-workaround bars overrides/peerMeta | `docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md §3` + `docs/tranches/L/audit/completion-lanes-32-36.txt §Lane 36 ⚠` |
| P-inv-28 bars 7th BOOK for GlassControlPoint | `docs/tranches/L/audit/deferred-ledger-L.md §2 DLL-20` "the re-BOOK option is CLOSED at L.WZ" |
| Glass-ui in optionalDependencies at `~4.0.0` | `package.json:215` |
