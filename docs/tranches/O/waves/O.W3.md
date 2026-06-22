# O.W3 — Named-selector NaN-frame cure (DM-22)

**Band:** B — Engine correctness
**Phase:** NOW (kf-internal; zero sibling dependency; executable on authorization)
**Sequence:** O.W2 (ledger hygiene) → **O.W3** → O.W4 (multi-color refusal + ingest)
**Owning chronic/DM:** DM-22 (`NAMED_SELECTOR_NO_TIMELINE` typed but never thrown; NaN-always-active frames)

---

## Context

M.W5 developed this cure at the spec level but was never implemented. The 32-lane re-audit
(C15-kf-engine, C12-kf-M-waves) confirmed the defect is live on master.

> **Ownership (2026-06-22, `FULL-LOOP-LEDGER.md` O.W3 line 513):** O.W3 is **authoritative for
> DM-22** — it is the specification (DEVELOPED, never IMPLEMENTED). **P.W9 inherits as the
> implementation tranche** (impl + the grammar-fuzz + differential-oracle extensions) with **zero
> spec conflict and no double-author** (the P deferred ledger carries the same Path-A throw). The
> NaN defect is CONFIRMED LIVE by direct probe (RAN: `npx tsx /tmp/test-nan-frame.mts` →
> 'No throw — frame count: 1, frame 0 start: NaN stop: NaN'). O.W3's standalone-gate design
> (`proof:named-selector-nan-frame` SEPARATE from `proof:replay-equality`) is independently
> confirmed correct.

### The exact defect chain (all refs verified on master, 2026-06-19)

| Step | Location | Fact |
|------|----------|------|
| 1 | `frame-compiler.ts:128` | `const NAMED_SELECTOR_SUPERTYPE = "named-selector"` is WRITTEN at `addFrame` time to tag the stored `ValueUnit` — but never READ in `parse()`, `engine.ts`, or `timeline.ts` (dead write) |
| 2 | `frame-compiler.ts:228–231` | `addFrame` stores `new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` with `value = "entry"` (the raw STRING) |
| 3 | `frame-compiler.ts:449` | `parse()` sorts `templateFrames` by `a.start.value - b.start.value` → `"entry" - "exit"` = `NaN` |
| 4 | `utils.ts:398` | `calcFrameTime`: `(start.value * duration) / 100` → `"entry" * 1000 / 100` = `NaN` |
| 5 | `internal/binarySearch.ts:28–35` | a NaN frame range: `value < NaN === false` AND `value > NaN === false` → the frame is treated as ALWAYS-ACTIVE; every `interpFrames(t)` applies the named-selector frame's vars at every progress position |
| 6 | `internal/errors.ts:46` | `NAMED_SELECTOR_NO_TIMELINE` is a typed `AnimationOptionErrorCode` — but zero throw sites exist anywhere in the engine (grep → 0) |
| 7 | `scripts/proof-replay-equality.mjs:173–178` | the existing S4 clause is a SOURCE-SHAPE REGEX (`/entry|exit|cover|contain/`) over `frame-compiler.ts` — a proxy, not a runtime observable (C12 BLOCKER finding) |
| 8 | `test/replay-equality.test.ts:75–87` | asserts no-throw + `toContain("entry")` string round-trip only — never frame-time soundness, never `interpFrames`, never the throw |

The M.W5 spec named this "Path A" — the minimal structured throw: detect `NAMED_SELECTOR_SUPERTYPE`
frames at `parse()` time and throw `AnimationOptionError(code: "NAMED_SELECTOR_NO_TIMELINE")`
instead of producing NaN frames. Path B (full `ScrollTimeline` named-range → numeric `%` bind) is
a separate later wave and is EXCLUDED here. This wave implements Path A exactly as M.W5 developed
it and gates it with a new independent `proof:named-selector-nan-frame` script rather than
extending `proof:replay-equality` (the M.W5 plan) — both because the S4 clause re-targeting is a
distinct surgical move and because a standalone gate is cleaner for the O roster.

### The M.W5 delta

M.W5 specified ALSO extending `proof:replay-equality` with an `@property`-compile clause (S1) and
re-targeting the S4 named-selector clause (S3). This wave owns ONLY the named-selector NaN cure
and its standalone gate. The `@property`-compile clause belongs to a separate O wave (not in Band
B's O.W3/O.W4 scope per the charter). The S4 source-shape proxy in `proof:replay-equality` is
re-targeted here: the existing regex clause is replaced by a behavioral anchor that holds the test
to the throw-OR-finite contract.

---

## Scope

### S1 — `parse()` throws `NAMED_SELECTOR_NO_TIMELINE` instead of producing NaN frames (Path A)

**Breach.** A bare named-selector `@keyframes` (no `ScrollTimeline` attached) ingests without
throwing and produces `frame.time = { start: NaN, stop: NaN }` (`frame-compiler.ts:449` sort →
`utils.ts:398` `calcFrameTime`); `binarySearchRange` treats the NaN range as ALWAYS-ACTIVE — every
`interpFrames(t)` applies its values at every progress position.

**Cure (Path A — the structured throw).** In `parse()` (`frame-compiler.ts:446`), BEFORE the
`templateFrames.sort` that produces the NaN ordering, scan the template frames for any
`start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)`. If none → no-op (the common path —
zero behavior change for every non-named animation). If any such frame exists AND no timeline has
resolved it to a numeric `%`, throw `new AnimationOptionError(…, code: "NAMED_SELECTOR_NO_TIMELINE")`
— the honest structured error that replaces the silent NaN. The `NAMED_SELECTOR_SUPERTYPE` tag
stored at `addFrame` (dead write today) becomes LIVE — read at the parse seam, discharging the
written-never-read / typed-never-thrown placeholder. The error message names the offending
selector(s) and states that a named scroll-range selector requires a `ScrollTimeline` to resolve
to a numeric position.

**Constraint (Path A only; Path B is excluded).** This wave does NOT map named selectors to
numeric `%` via the K.W9 `ScrollTimeline` phase mapper — that is Path B, requiring `parse()` to
accept an optional timeline or a post-parse `bindTimeline(timeline)` re-resolve, and is explicitly
EXCLUDED here. Path A's contract: a named-selector animation that CANNOT be resolved fails-explicit
rather than silently NaN-poisoning. When Path B lands, the throw becomes conditional on "no
timeline bound" — the `superType` read site this wave creates is the seam Path B extends, not
re-architects.

**Constraint (fail-explicit, consistent with the engine's option seam).** The throw is the SAME
`AnimationOptionError` class the engine already raises for malformed present input. A named selector
WITHOUT a timeline is malformed-present (an unresolvable position was authored), so the throw is
idiomatic — not a new error taxonomy. No silent drop, no invented number.

### S2 — `proof:replay-equality` S4 clause re-targeted off the source-shape proxy

**Breach.** The S4 clause (`proof-replay-equality.mjs:173–178`) tests a SOURCE-SHAPE regex —
`re: /entry\s*\|\s*exit\s*\|\s*cover\s*\|\s*contain/` over `frame-compiler.ts` — which GREENs on
"the token set appears in the guard" and is BLIND to whether frame times are NaN. This is the
inv-M-observable-truth proxy failure the tranche is named to cure (C12 BLOCKER finding).

**Cure.** Replace the regex clause with an anchor that verifies the behavioral throw-OR-finite
contract is exercised by the behavior test (the gate's role is to hold the test to the real surface).
For the bare named-selector fixture (`@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }`),
the anchor asserts ONE of:

1. **the throw fires** — `parse([])` throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"`, OR
2. **every `frame.time.start`/`.stop` is a finite number** (`Number.isFinite` for all)

The assertion FAILS when frame times are NaN AND no throw fired — the present always-active state.
The old source-shape regex is REPLACED (not kept alongside) by this behavioral anchor.

---

## Born-RED gate

**Gate:** `proof:named-selector-nan-frame` (NEW — `scripts/proof-named-selector-nan-frame.mjs`).
This is a standalone gate, NOT an extension of `proof:replay-equality`. The M.W5 plan extended
`proof:replay-equality`; O.W3 authors a standalone gate to keep the Band-B gate roster atomic and
independently authored (the O.W3 keystone; M.W5 is superseded on this sub-scope).

Wire into `package.json` alongside `proof:engine-correctness` (`proof:correctness` roster).

**Born-RED state on today's tree (the GENUINE defect, not a proxy):**

```
new CSSKeyframesAnimation().fromString(`@keyframes x {
  entry { opacity: 0 }
  exit  { opacity: 1 }
}`).parse([])
```

Expected: throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"`.
Actual today: does NOT throw; produces `frame.time = { start: NaN, stop: NaN }`;
`binarySearchRange` treats the frame as ALWAYS-ACTIVE — every `t` matches.

The gate is born-RED on this defect: neither the throw disjunct nor the finite disjunct holds
(NaN is not finite, and no throw fires). A gate that merely greps `colorToOklabCSS` or checks
that the error code literal exists in source would repeat the L.W1-S4 mistake (proxy) — forbidden.

**Planted-failure contract (the born-RED requirement).**
The gate script is authored BEFORE the S1 cure and is witnessed RED on today's tree. The RED state
is the live NaN produced by `parse([])` over a bare named-selector animation. Only after S1 lands
does the throw disjunct hold and the gate turn GREEN.

**Falsifiable clause:**

| Clause | RED state today | GREEN condition after cure |
|--------|-----------------|----------------------------|
| `named-selector-throw-or-finite` | `parse([])` on a bare named-selector animation neither throws `NAMED_SELECTOR_NO_TIMELINE` NOR produces all-finite `frame.time` values — NaN frames present | `parse([])` throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"` (Path A); OR every `frame.time.start`/`.stop` is `Number.isFinite` (Path B, a later wave) |
| `source-shape: NAMED_SELECTOR_SUPERTYPE read in parse()` | `NAMED_SELECTOR_SUPERTYPE` written at `addFrame`, never read in `parse()` (dead write — grep `parse` body for `NAMED_SELECTOR_SUPERTYPE` → 0 today) | the `parse()` body reads `NAMED_SELECTOR_SUPERTYPE` in the scan that triggers the throw (the dead write becomes live) |
| `proof:replay-equality S4 re-target` | the S4 clause is a source-shape regex — GREEN over NaN frames | the S4 clause is a behavioral anchor; it REDs on today's NaN state and GREENs after S1 |

**Green condition.** `parse([])` on a bare named-selector animation throws `AnimationOptionError`
with `code === "NAMED_SELECTOR_NO_TIMELINE"` (S1); the `NAMED_SELECTOR_SUPERTYPE` constant is read
(not just written) in `parse()` (S1 side effect); the S4 clause in `proof:replay-equality` holds
the throw-OR-finite contract (S2); every pre-existing `proof:replay-equality` and `proof:engine-correctness`
assertion stays GREEN (no regression on non-named animations — the common path is byte-identical).

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling gate.** `ValueUnit.superType?: string[]` is a
  published top-level field (`dist/units/index.d.ts`); `parse()` can read
  `frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)` directly. No O ask blocks this wave.
- **No sibling dep.** Pure kf-internal `frame-compiler.ts` (one guard inserted in `parse()`) +
  `scripts/proof-named-selector-nan-frame.mjs` (NEW) + `test/replay-equality.test.ts` (S4
  behavioral assertion) + `scripts/proof-replay-equality.mjs` (S4 clause re-target). No
  cross-wave file collision: O.W4 touches `compile-color.ts`/`ingest.ts`; O.W3 touches only
  `frame-compiler.ts` and the gate scripts.
- **Sequence.** O.W3 is NOW-executable after O.W2 (ledger hygiene). O.W4 (multi-color refusal +
  ingest) is parallel — no shared file surface.

---

## dev→impl boundary

This wave is DEVELOPED (docs). The implementation opens on the owner's explicit authorization per
the O charter dev→impl boundary. When authorized:

1. Author `scripts/proof-named-selector-nan-frame.mjs` (the born-RED standalone gate) — witness RED.
2. Edit `frame-compiler.ts:parse()`: insert the `NAMED_SELECTOR_SUPERTYPE` scan BEFORE the sort,
   throw `AnimationOptionError(…, code: "NAMED_SELECTOR_NO_TIMELINE")` on any unresolved frame.
3. Re-target `proof:replay-equality` S4 clause off the source-shape regex onto the behavioral anchor.
4. Wire `proof:named-selector-nan-frame` into the `proof:correctness` roster (`package.json`).
5. Run `proof:named-selector-nan-frame` — confirm GREEN. Run `proof:replay-equality` — confirm GREEN.
   Run `proof:engine-correctness` — confirm no regression.

Path B (the full `ScrollTimeline` named-range bind over the K.W9 phase mapper) is EXCLUDED from
this wave and lives in a later O wave (not yet chartered — the seam this wave creates is the
extension point).

---

## Bite — what regression the gate catches

| Clause | Regression it prevents |
|--------|------------------------|
| `named-selector-throw-or-finite` | A bare named-selector animation silently produces NaN frame times → `binarySearchRange` treats the frame as ALWAYS-ACTIVE → `interpFrames` applies its values at EVERY progress position; the `NAMED_SELECTOR_SUPERTYPE` tag relapses to written-never-read dead code (DM-22 re-opens) |
| `S4 re-target` | The S4 clause in `proof:replay-equality` relapses to a SOURCE-SHAPE regex (greps that the token set "appears in the guard") and goes BLIND to NaN frame times — the L.W1-S4 inv-M-observable-truth failure re-committed |

---

## Excluded from this wave

- **Path B — the full `ScrollTimeline` named-range → numeric `%` bind.** Mapping named selectors
  to numeric positions via the K.W9 phase-range mapper requires `parse()` to accept an optional
  timeline or a post-parse `bindTimeline(timeline)` re-resolve, and is EXCLUDED here. Path A is
  the born-RED floor; the `superType` read site this wave creates is the seam Path B extends.
- **The `@property`-compile artifact gap** (M.W5 S1 — `compileToCSS` omits `@property` blocks).
  That fix touches `compile.ts`/`format.ts` and belongs to a separate O wave not in the Band-B
  O.W3/O.W4 scope.
- **Multi-color refusal + ingest gates** — O.W4 scope. O.W3 is the frame-compiler parse seam only.

---

**Full-loop disposition (`docs/tranches/P/FULL-LOOP-LEDGER.md` O.W1-4-apparatus / [AUGMENT] O.W3,
line 505-513):** O.W3 is grounded and the NaN defect is **CONFIRMED LIVE** by direct probe (RAN:
`npx tsx /tmp/test-nan-frame.mts` → `parse([])` does not throw; `frame.time = { start: NaN, stop: NaN }`;
binarySearch over the NaN range returns idx 0 for every `t` → always-active). The dead-write claim is
confirmed (`grep NAMED_SELECTOR_SUPERTYPE frame-compiler.ts` → hits only in `addFrame` context, zero
in the `parse()` body) and the S4 proxy claim is confirmed (`proof-replay-equality.mjs:173-178` is a
pure source-shape regex). **O.W3 is authoritative for DM-22; P.W9 correctly inherits as the
implementation tranche with zero spec conflict (no double-author).** O.W3's standalone-gate design
(`proof:named-selector-nan-frame` separate from `proof:replay-equality`) is the correct call —
independently confirmed. ONE dispatch finding for the P tree (recorded here, not authored in P.W9 —
inv-16): **P.W9's S4 carries a stale cross-reference to "the DM-23 vitest-browser runner (O.W2)"** —
O.W2's wave spec does NOT own vitest-browser (it covers ledger re-point + stale-gate retarget). The
WAAPI-eligible Playwright subset is implementable TODAY with `demo-driver.mjs` and requires no
vitest-browser; the full CDP path defers to a P.WZ+ item. P.W9 S4 should drop the O.W2/DM-23
dependency for the subset gate. AUGMENT verdict: O.W3 KEPT as-specced (Path-A throw, pre-sort
superType scan); the lone augmentation is the P.W9 ownership/cross-ref reconciliation above.
