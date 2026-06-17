# Lane 26 — Workaround-Deletion (the consume-and-delete band)

**Tranche M — development audit lane.**
**Branch:** `tranche-l-dev` (tip `529fcfd`) · **Gate run date:** 2026-06-17 ·
**Auditor:** Lane-26 subagent (claude-sonnet-4-6) · **inv ε:** every claim below
cites a verified ground-truth anchor — file:line, gate output, registry probe, or
source read — nothing is re-asserted from a prior audit without independent
verification.

---

## §0 — The five arms in one table (verified state as of 2026-06-17)

Gate run: `node scripts/proof-workaround-deletion.mjs` → **exit 0 / 0 GREEN / 5
PENDING / 0 RED** (verified output reproduced in §A).

| Arm | Workaround (kf-side, file:line) | Root defect (sibling) | Tripwire | State |
|-----|--------------------------------|-----------------------|----------|-------|
| S1 | `:aria-orientation="undefined"` on TWO pill `SegmentedTabs` strips | glass-ui emits `aria-orientation` unconditionally even on `role=group` (pill variant) | `@mkbabb/glass-ui@4.1.0` SegmentedTabs pill-branch aria guard | PENDING |
| S2 | `pointerHandled` + `onPlayPointerDown` interim (9 hits, TransportDock.vue) | glass-ui dock collapse-crossfade strands a pointer gesture, causing double-toggle | `@mkbabb/glass-ui@4.1.0` `W-DOCK-MORPH-FAMILY` RF-17 strand fix | PENDING |
| S7 | `LINEAR_PAREN_PREFIX` regex + `, 25%` → ` 25%` normalize (`utils.ts:185–196`) | `FunctionValue.toString()` emits comma-joined args → `linear()` stops become `linear(0, 0.5, 25%, 1)` not `linear(0, 0.5 25%, 1)`; `parseLinearStops` rejects the comma form | `@mkbabb/value.js@0.14.0` VJ-L2 `FunctionValue.toString()` space-join fix | PENDING |
| S8 | `FN_NAME` Symbol stamped onto external `ValueUnit` (7 hits, `utils.ts:45–57,218,294,347`) | `flattenObject`/`FunctionValue` dissolves the function-token name; no first-class API to preserve + retrieve it | `@mkbabb/value.js@0.14.0` VJ-L1 first-class `flatLeaf` / provenance API | PENDING |
| S9 | `import { any as parseAny } from "@mkbabb/parse-that"` (`utils.ts:1`) as a production dep | kf reaches through value.js's parser abstraction, tapping `parseAny` directly to compose `CSSFunction.FunctionArgs` with `CSSValues.Value` | `@mkbabb/value.js@0.14.0` VJ-L3 `parseCSSSubValue` helper | PENDING |

**Registry-verified (npm show, 2026-06-17):**

- `@mkbabb/glass-ui` latest: `4.0.0` (`4.1.0` → E404) — S1 + S2 PENDING
- `@mkbabb/value.js` latest: `0.13.0` (`0.14.0` → E404) — S7 + S8 + S9 PENDING
- `@mkbabb/parse-that` latest: `0.9.0` — no direct tripwire (S9 indirect via value.js)

**Zero arms are deletable now.** Every sibling fix is unpublished; deleting any
workaround on today's tree would break a consumer. The gate correctly exits 0
(PENDING, not RED).

---

## §1 — S1 — `:aria-orientation="undefined"` suppress (aria, glass-ui)

### Evidence

**File locations (verified by grep + gate output):**

- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`
  `:aria-orientation="undefined"` — the control-surface pill strip rendered on
  every scene that mounts AnimationControls.
- `demo/spring/SpringSidebar.vue:43`
  `:aria-orientation="undefined"` — the spring view-switcher pill strip.

**Root defect (verified):** `@mkbabb/glass-ui@4.0.0` `SegmentedTabs`
unconditionally emits `aria-orientation` on the component root. When
`variant="pill"` the rendered role is `role="group"`. ARIA 1.2 forbids
`aria-orientation` on `role=group` — the attribute is valid only on `scrollbar`,
`separator`, `slider`, `tablist`, `toolbar`, `treeitem`. Every scene that mounts
either pill strip currently ships an invalid ARIA attribute.

**Interim completeness (L.W9 decision):** Both strips now carry the suppress,
making the interim WHOLE while it lasts. The second strip
(`AnimationControls.vue:72`) was the un-suppressed leak (⚠3) the L.W9 finalize
added. Completing the interim does NOT close the workaround — it prevents
partial application while the root fix is awaited.

**The inv-16 violation:** the correct cure lives in glass-ui's `SegmentedTabs`
source (one conditional guard: emit `aria-orientation` only when the rendered
ARIA role permits it). kf writing a per-call-site suppress is the definition of
a consume-seam band-aid. The cure is trivial at the source; the blast radius at
the source is zero (all constellation consumers are correct at once). kf cannot
write that guard (inv-16: kf writes only its own repo).

**Delete trigger:** on glass-ui 4.1.0 consume + re-pin, BOTH suppress-lines
(`AnimationControls.vue:72` + `SpringSidebar.vue:43`) are deleted in ONE commit.
`proof:workaround-deletion` S1 then asserts zero `:aria-orientation="undefined"`
pattern in `demo/**/*.vue` → GREEN.

**M-wave ownership:** a single `git grep` and `sed -i` in the glass-ui 4.1.0
re-pin commit. No architecture change; no kf source change.

---

## §2 — S2 — `pointerHandled` / `onPlayPointerDown` interim (dock, glass-ui)

### Evidence

**File location (verified by grep + gate output):**

- `demo/@/components/custom/animation-controls/TransportDock.vue` — 9 hits:
  line 15 (comment), 151 (`@pointerdown="onPlayPointerDown($event)"`),
  196 (`@pointerdown.stop="onPlayPointerDown($event)"`), 342 (comment block),
  348 (`let pointerHandled = false`), 358 (`function onPlayPointerDown`),
  361 (`pointerHandled = true`), 366 (`pointerHandled = false`),
  373 (`if (pointerHandled) return`).

**Root defect (verified):** glass-ui's dock collapse-crossfade can strand the
`click` event after a `pointerdown` on the play button in certain
expand/collapse transition states, causing a double-toggle. The kf interim
routes the toggle through `pointerdown` (which always fires before the
crossfade can interfere) and marks `pointerHandled` to suppress the subsequent
`click`. Keyboard activation (`Enter`/`Space` synthesize bare `click` with no
preceding `pointerdown`) is preserved via the `if (pointerHandled) return` guard.

**Chronicity (verified from `PROGRESS.md`):** DL-K9 → DL-L6, chronicity 3 (I, J,
K → L). P-invariant-28 forbids a 4th carry — the interim must retire on the
glass-ui 4.1.0 consume or become an active precept violation.

**The no-workaround precept violation:** `KF-TO-GLASSUI-BB-ASKS.md §2` ⚠5:
*"the kf `onPlayPointerDown`/`pointerHandled` interim (retained at K.W1 after
the REVERT of the 3.13.0 `useDockClickIntegrity` attempt) is a workaround of a
glass-ui primitive defect. Inv-16 and the no-workaround precept both indict it."*
The correct path is the compositor-isolated expand/collapse morph in glass-ui's
`W-DOCK-MORPH-FAMILY`; kf cannot implement that (inv-16).

**Gate naming note (from lane-09 audit):** `KF-TO-GLASSUI-BB-ASKS.md §2` calls
the gate `proof:rf17-net-deletion`, but no such script exists. The gate is
correctly implemented as `proof:workaround-deletion` S2 in
`scripts/proof-workaround-deletion.mjs:191-198`. The dispatch doc name is a
documentation inconsistency; the implementation is the ground truth.

**Delete trigger:** on glass-ui 4.1.0 consume + re-pin, all 9 hits in
`TransportDock.vue` are deleted in ONE commit alongside S1. `proof:workaround-
deletion` S2 → GREEN.

**M-wave ownership:** same re-pin commit as S1. No architecture change.

---

## §3 — S7 — `linear()` flat-comma normalize regex (utils.ts, value.js)

### Evidence

**File locations (verified by grep + gate output):**

- `src/animation/utils.ts:119` — `const LINEAR_PAREN_PREFIX = /^\s*linear\s*\(/i;`
- `src/animation/utils.ts:185–196` — the normalize block: if `LINEAR_PAREN_PREFIX`
  matches, apply `.replace(/,\s*(-?[\d.]+%)/g, " $1")` before calling
  `parseLinearStops`.

**Root defect (verified at source):**
`/Users/mkbabb/Programming/value.js/src/units/index.ts:184`:

```typescript
return `${this.name}(${this.values.map((v) => v.toString()).join(", ")})`;
```

`FunctionValue.toString()` always joins values with `", "`. For `linear()` stops,
the canonical CSS syntax requires a SPACE-separated positional input: `linear(0,
0.5 25%, 1)` — the `25%` is the INPUT position and must be space-joined to its
preceding output value (same stop). The `, ` join emits `linear(0, 0.5, 25%, 1)`
— three stops where there were two — which `parseLinearStops` correctly rejects
as malformed (the `%` is not a valid standalone output value at level 2). This is
a value.js serialize/parse asymmetry introduced at value.js 0.12.0.

**Why the regex is unambiguous (verified):** A `%` token can ONLY appear as a
stop's INPUT position in `linear()` — never as a standalone output value (CSS
Easing Level 2 §3). So folding `, 25%` → ` 25%` is lossless for valid CSS. The
normalize does not touch canonical author `linear()` strings (ones that were
never through `FunctionValue.toString()`).

**Impact if deleted early:** the spring `linear()` twin emitted by
`springLinearStops` would fail to re-ingest through `getTimingFunction`
(a spring that serializes to CSS and is re-read back would silently default to
`easeInOutCubic` instead of the authored spring curve). The round-trip would
break silently.

**VJ-L2 ask (from `KF-TO-VALUEJS-O-ASKS.md §5`):** fix `FunctionValue.toString()`
to emit space-separated positional arguments for `linear()` (and the same fix
for `scroll()` / other positional-arg functions). After VJ-L2, `parseLinearStops`
accepts the output of `toString()` directly, and the normalize regex is a dead
path that can be deleted.

**Delete trigger:** on value.js 0.14.0 consume + re-pin, delete:
1. `src/animation/utils.ts:185–196` (the normalize block including the `try/catch`
   that wraps `parseLinearStops`).
2. `src/animation/utils.ts:119` (`LINEAR_PAREN_PREFIX` constant — dead after deletion).
3. Re-add `parseLinearStops(timingFunction)` call directly (no normalize wrapper).

`proof:workaround-deletion` S7 asserts zero `LINEAR_PAREN_PREFIX` pattern in
`src/animation/utils.ts` → GREEN.

**Note on S7 + S8 + S9 coupling:** all three are gated on value.js 0.14.0. They
are NOT internally coupled (S7 is a standalone regex delete; S8 is the FN_NAME
Symbol delete; S9 is the import delete). They CAN land in a single re-pin commit
or be staged independently if value.js ships VJ-L1/L2/L3 across sub-patches —
but in practice all three will ship together with the 0.14.0 cut.

---

## §4 — S8 — `FN_NAME` Symbol sidechannel (utils.ts, value.js)

### Evidence

**File locations (verified by grep + gate output):**

- `src/animation/utils.ts:45` — `const FN_NAME = Symbol("kf.fnName")`
- `src/animation/utils.ts:47` — `type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }`
- `src/animation/utils.ts:51` — `fnNameOf` reader
- `src/animation/utils.ts:55` — `stampFnName` writer
- `src/animation/utils.ts:218` — `stampFnName` used in `tryParseLeaves` cache return
- `src/animation/utils.ts:294` — `stampFnName(m.clone(), fnNameOf(m))` in
  `parseAndFlattenObject` cache re-stamp
- `src/animation/utils.ts:347` — `fnNameOf(counterLeaf)` in `createInterpVarValue`

**Root problem (verified from source):** `flattenObject` (value.js) and
`FunctionValue.flatMap` dissolve the `FunctionValue` wrapper into bare leaf
`ValueUnit`s, dropping the function-token name (`scale`, `translateX`,
`brightness`, …). The identity-aware arity pad in `createInterpVarValue`
(which must resolve `scale → 1`, `translateX → 0px`, `brightness → 1` rather
than bare `0` when the other side has a function kf's side lacks) cannot know
the origin function from a bare `ValueUnit`.

**Why a Symbol sidechannel is the workaround shape:**
`ValueUnit.clone()` does NOT preserve `[FN_NAME]`
(`utils.ts:43–44` comment). kf must re-stamp the Symbol onto every
clone — the cache returns masters and the `parseAndFlattenObject` call-site
re-applies `stampFnName` on every copy (lines 294–298). This is a
maintenance burden: every new `ValueUnit` construction path must be audited
for the re-stamp. The Symbol key is kf-owned but stamped onto a published
external class — a precept violation (inv-16 in spirit: kf is extending a
value.js object by side-channel rather than through a published API).

**The precept violation:** ⚠18 in `audit-32-skeleton.txt`. The `FN_NAME`
Symbol is the canonical "owned type on external class" anti-pattern the
no-workaround precept names. It works, but it is fragile (drops on clone,
must be re-stamped), invisible to TypeScript's public interface for
`ValueUnit`, and accumulates a typed augmentation that belongs in
value.js's own flatten API.

**VJ-L1 ask (from `KF-TO-VALUEJS-O-ASKS.md §8`):** expose a first-class
`flatLeaf(valueUnit, provenance?: { fnName: string })` constructor or a
typed `FlatLeaf` sub-class that preserves the flatten-origin function name
through `clone()`. After VJ-L1, kf calls `flatLeaf(v, { fnName })` at
flatten time and reads `v.fnName` (or equivalent) — no Symbol, no re-stamp,
no `NamedValueUnit` augmentation type. The `createInterpVarValue` arity-pad
reads the first-class field.

**Delete trigger:** on value.js 0.14.0 + VJ-L1:
1. Delete `FN_NAME` constant (line 45), `NamedValueUnit` type (line 47),
   `fnNameOf` (lines 50–51), `stampFnName` (lines 54–57).
2. Replace `stampFnName(v.clone(), fnName)` call-sites with `flatLeaf(v, {fnName})`
   or the published construction API.
3. Replace `fnNameOf(counterLeaf)` (line 347) with `.fnName` field read.

`proof:workaround-deletion` S8 asserts zero `FN_NAME|Symbol\("kf\.` pattern →
GREEN. The broader bite: any new Symbol stamped onto a published value.js class
with prefix `"kf."` also REDs the gate (the recurrence-resistant pattern).

---

## §5 — S9 — Direct `@mkbabb/parse-that` production dep (utils.ts:1, value.js)

### Evidence

**File location (verified):**

- `src/animation/utils.ts:1` — `import { any as parseAny } from "@mkbabb/parse-that"`
- `package.json` `dependencies` — `"@mkbabb/parse-that": "^0.9.0"` (verified)
- `src/animation/utils.ts:234,241` — usage: `(parseAny as any)(fnArgs, CSSValues.Value)`
  inside `tryParseLeaves` to compose `CSSFunction.FunctionArgs` with `CSSValues.Value`.

**Root problem (verified from source and comments):**
`tryParseLeaves` (`utils.ts:227–255`) parses a raw CSS sub-value string into a
`ValueUnit | ValueArray | FunctionValue`. It needs to run value.js's OWNED
CSS parser (`CSSValues.Value`) over the input, but value.js 0.13.0 does NOT
expose a public `parseCSSSubValue(property, str)` entrypoint that kf can call.
The only way to invoke the parser with the right grammar is to reach INTO
value.js's parser combinator layer by importing `any` from parse-that directly.

**The cross-realm type seam (verified):** npm deduplicates parse-that (only ONE
copy at `node_modules/@mkbabb/parse-that/` — no nested copy under
`node_modules/@mkbabb/value.js/`). At runtime, both kf and value.js share the
same parse-that `0.9.0` module, so the nominal type mismatch at the TypeScript
boundary is worked around with `(parseAny as any)` casts. The comment at
`utils.ts:229–233` documents this: *"value.js and keyframes.js each ship their
own copy of @mkbabb/parse-that under different node_modules realms, so the
Parser<T> classes are nominally distinct from TypeScript's perspective. The
runtime is the same."* With deduplication confirmed, the runtime-is-same claim
is verified true for today's npm resolution. The `as any` cast is a TypeScript-
level workaround regardless.

**Constellation spine violation (verified):** the acyclic-spine law
(`inv-L-acyclic-purity`, `L.md §invariant set`) places parse-that → value.js
→ kf → glass-ui. kf has a DIRECT production edge to parse-that, bypassing
the value.js intermediary. This is the ⚠24 violation: `viol24` in
`audit-32-skeleton.txt`. The correct topology is: kf calls a value.js helper;
value.js internally uses its own parse-that edge. kf should have zero direct
parse-that production imports.

**VJ-L3 ask (from `KF-TO-VALUEJS-O-ASKS.md §8`):** expose
`parseCSSSubValue(property: string, value: string): ValueUnit | null` (or
`parseCSSValueOrArgs(property, str)`) at the value.js root export. After VJ-L3,
`tryParseLeaves` calls `parseCSSSubValue(childKey, strValue)` directly — no
parse-that import needed.

**Delete trigger:** on value.js 0.14.0 + VJ-L3:
1. Delete `src/animation/utils.ts:1` (`import { any as parseAny } from "@mkbabb/parse-that"`).
2. Replace `(parseAny as any)(fnArgs, CSSValues.Value)` in `tryParseLeaves`
   with `parseCSSSubValue(childKey, strValue)` (or the published API shape).
3. Remove `"@mkbabb/parse-that"` from `package.json` `dependencies`.

`proof:workaround-deletion` S9 asserts zero `from "@mkbabb/parse-that"` pattern
in `src/animation/utils.ts` → GREEN. The existing `proof:boundary` W96 extension
(`L.W9.md §S9 — proof:boundary extension`) asserts zero direct parse-that imports
in the kf source tree; that gate also GREENs.

**After S9 lands:** kf carries zero direct parse-that imports. All coordination
flows through value.js's published API surface. The constellation spine becomes
truly acyclic at the published-API level (parse-that → value.js → kf; no kf
→ parse-that edge).

---

## §6 — Sequencing (dependency order for M-wave planning)

The five arms divide naturally into two independent tracks — one per sibling:

**Track A — glass-ui 4.1.0** (S1 + S2):

Both arms require the SAME sibling cut (`@mkbabb/glass-ui@4.1.0`) and should
land in a SINGLE re-pin commit:
1. glass-ui 4.1.0 publishes (SegmentedTabs aria guard + `W-DOCK-MORPH-FAMILY`).
2. kf re-pins `~4.1.0` in `package.json`.
3. Delete `AnimationControls.vue:72` `:aria-orientation="undefined"` (S1a).
4. Delete `SpringSidebar.vue:43` `:aria-orientation="undefined"` (S1b).
5. Delete the 9 `pointerHandled`/`onPlayPointerDown` hits in `TransportDock.vue` (S2).
6. `proof:workaround-deletion` S1 + S2 → GREEN; `proof:peer-satisfied` → GREEN
   (if the peer range widen lands in the same 4.1.0 cut).

S1 and S2 are independent of S7/S8/S9 and vice versa — they can ship in any
order relative to each other.

**Track B — value.js 0.14.0** (S7 + S8 + S9):

All three require the SAME sibling cut (`@mkbabb/value.js@0.14.0`). They CAN
land independently if VJ-L1/L2/L3 ship across sub-patches, but in practice
all three will ship together in the 0.14.0 cut and should land in ONE re-pin
commit:
1. value.js 0.14.0 publishes (VJ-L1 flatLeaf + VJ-L2 FunctionValue.toString +
   VJ-L3 parseCSSSubValue).
2. kf re-pins `^0.14.0` in `package.json`.
3. Delete the `LINEAR_PAREN_PREFIX` regex block in `utils.ts:119,185–196` (S7).
4. Delete the `FN_NAME` Symbol machinery in `utils.ts:45–57,218,294,347` (S8).
5. Delete `import { any as parseAny } from "@mkbabb/parse-that"` in `utils.ts:1`
   and replace `tryParseLeaves` internals (S9).
6. Remove `"@mkbabb/parse-that"` from `package.json` `dependencies` (S9).
7. `proof:workaround-deletion` S7 + S8 + S9 → GREEN; `proof:boundary` W96
   arm → GREEN.

**No arms are deletable now (2026-06-17):** glass-ui latest = 4.0.0 (need 4.1.0);
value.js latest = 0.13.0 (need 0.14.0). All five arms are correctly PENDING.

---

## §7 — Precept findings

### No-workaround / NO-quick-solution

All five arms are confirmed active violations of the no-workaround precept and
`inv-L-acyclic-purity` (`L.md §invariant set`):

- **S1** (⚠1/⚠2/⚠3): a consume-seam attribute suppress for a glass-ui ARIA
  defect; the fix belongs in the glass-ui source. inv-16 forbids kf from writing
  the one-line guard that would cure all consumers at once.
- **S2** (⚠5): a pointer-event sequencing workaround for a glass-ui dock
  crossfade defect. The `pointerHandled` guard papers over a state the glass-ui
  compositor-isolated morph must own. DL-K9 chronicity 3; P-invariant-28 forbids
  a 4th carry.
- **S7** (⚠19/⚠20/⚠23): a regex normalize for a value.js serializer
  asymmetry. The fix belongs in `FunctionValue.toString()` in value.js; kf
  patching the output of value.js's own serializer is the exact shape the
  no-workaround precept names.
- **S8** (⚠18): a Symbol sidechannel stamped onto a published external class
  (`ValueUnit`), re-stamped on every `clone()` call because value.js does not
  expose a first-class provenance API. The Symbol-on-external-class pattern is
  explicitly cited in the no-workaround precept.
- **S9** (⚠24): a direct production dependency on `@mkbabb/parse-that` to reach
  through value.js's parser abstraction. Breaks the acyclic-spine law at the
  package.json level; the `(parseAny as any)` cast is the TypeScript signature
  of the cross-realm band-aid.

### No-legacy

All five workarounds exist solely because the sibling has not yet shipped the
fix. None carries algorithmic legacy (they are recent additions, all born as
named violations in the L.W9 Band-B dispatch). No legacy code in the
traditional sense is implicated.

### GESTALT / architectural simplicity (post-deletion)

After all five arms are deleted:

- `utils.ts` loses the `FN_NAME` Symbol infrastructure (7 lines → gone), the
  `NamedValueUnit` type augmentation, and the regex normalize block (12 lines →
  gone) plus the direct parse-that import + cast infrastructure. Net reduction
  ~30 LOC in `utils.ts`.
- `TransportDock.vue` loses the `pointerHandled` flag + its handler (9 LOC +
  documentation comments).
- Two `SegmentedTabs` component instances lose their `:aria-orientation` overrides.
- `package.json` loses `@mkbabb/parse-that` as a production dependency (S9).

The gestalt improvement is significant: `utils.ts` becomes a pure consumer of
value.js's published API; the constellation spine becomes correctly acyclic at
the package.json level; the demo's ARIA surface becomes clean without per-site
patches.

---

## §8 — Cross-repo asks (what M must dispatch)

The arms are already dispatched (L.W9 Band-B; `KF-TO-GLASSUI-BB-ASKS.md` §1/§2/§3;
`KF-TO-VALUEJS-O-ASKS.md` §5/§8). M's obligation is consume-and-delete, NOT
re-dispatch. The cross-repo asks are:

**glass-ui BB (pending):**
- §1: SegmentedTabs pill-branch conditional — emit `aria-orientation` only when
  the rendered role permits it (`tablist`, `toolbar`, etc.), never on `role=group`.
- §2: `W-DOCK-MORPH-FAMILY` + RF-17 — compositor-isolated expand/collapse +
  collapse-crossfade strand fix so the `click` event is never stranded.
- §3 (F-2 peer-cycle, not a workaround arm but coupled to S1/S2 re-pin):
  widen `@mkbabb/value.js` peer range to admit `^0.13.0` (or broader). This
  resolves `proof:peer-satisfied` RED-by-design in the same re-pin.

**value.js O (0.14.0) (pending):**
- VJ-L2: Fix `FunctionValue.toString()` to emit space-separated positional
  arguments for functions where the CSS spec requires space-join (linear() stops,
  scroll() positional args). Targets `value.js/src/units/index.ts:184`.
- VJ-L1: Expose a first-class `flatLeaf` / `FlatLeaf` construction path that
  preserves the flatten-origin function name through `clone()`.
- VJ-L3: Expose `parseCSSSubValue(property: string, value: string): ValueUnit | null`
  at the value.js root export.

M does NOT re-dispatch these asks; it CONSUMES the published fix and DELETES
the workaround in one commit per track.

---

## §9 — Deferred folds (items for the M ledger)

From the L ledger (DL-L10 + DL-L19 + DL-L23 + DL-L24 + DL-L25):

| Ledger row | Status at M-open | M disposition |
|------------|-----------------|---------------|
| DL-L10 (the 5-arm workaround sweep) | PENDING × 5 | FOLD arm-by-arm on each sibling publish; the entire row FOLDs GREEN when the last arm clears |
| DL-L19 / DL-L6 (RF-17 dock click-strand, chronicity 3) | HANDOFF, UN-FIRED | FOLD on glass-ui 4.1.0 re-pin (same commit as S2 delete). P-invariant-28: no 4th carry |
| DL-L23 (constellation workarounds) | HANDOFF, all 5 PENDING | FOLD arm-by-arm with DL-L10 |
| DL-L24 (F-2 peer-cycle) | HANDOFF, `proof:peer-satisfied` RED-by-design | FOLD on glass-ui 4.1.0 peer-widen re-pin (if peer fix ships in same cut as S1/S2) |
| DL-L25 (SegmentedTabs aria root defect) | HANDOFF, UN-FIRED | FOLD on glass-ui 4.1.0 S1-delete (the root half of DL-L23(d)) |

---

## §A — Gate output (reproduced verbatim, 2026-06-17)

```
proof:workaround-deletion — L.W9 Band-B (the three-state consume-edge deletion ledger)

  … S1 PENDING — PRESENT + sibling UNPUBLISHED. aria-orientation suppress-on-consume
      (SpringSidebar.vue pill strip) → glass-ui SegmentedTabs root fix
      workaround at demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72,
      demo/spring/SpringSidebar.vue:43;
      @mkbabb/glass-ui@4.1.0 is NOT YET published (E404).

  … S2 PENDING — PRESENT + sibling UNPUBLISHED. pointerHandled / onPlayPointerDown interim
      (TransportDock.vue) → glass-ui RF-17 dock-layer cure
      workaround at TransportDock.vue:15,151,196,342,348,358,361,366,373;
      @mkbabb/glass-ui@4.1.0 is NOT YET published (E404).

  … S7 PENDING — PRESENT + sibling UNPUBLISHED. linear() flat-comma normalize regex
      (utils.ts LINEAR_PAREN_PREFIX) → value.js VJ-L2 FunctionValue.toString() fix
      workaround at src/animation/utils.ts:119, src/animation/utils.ts:185;
      @mkbabb/value.js@0.14.0 is NOT YET published (E404).

  … S8 PENDING — PRESENT + sibling UNPUBLISHED. FN_NAME Symbol sidechannel stamped onto
      value.js ValueUnit (utils.ts) → value.js VJ-L1 first-class flatLeaf
      workaround at src/animation/utils.ts:45,47,51,55,218,294,347;
      @mkbabb/value.js@0.14.0 is NOT YET published (E404).

  … S9 PENDING — PRESENT + sibling UNPUBLISHED. direct @mkbabb/parse-that import (utils.ts:1)
      reaching through value.js's parser abstraction → value.js VJ-L3 parseCSSSubValue
      workaround at src/animation/utils.ts:1;
      @mkbabb/value.js@0.14.0 is NOT YET published (E404).

proof:workaround-deletion — 0 GREEN / 5 PENDING / 0 RED over 5 arms.
  state map: S1=PENDING  S2=PENDING  S7=PENDING  S8=PENDING  S9=PENDING

proof:workaround-deletion — PENDING (5): every remaining workaround is PRESENT with its
paired sibling-fix UNPUBLISHED. This is the STAGED Band-B state (not a failure) — each arm
GREENs when the sibling publishes AND kf consumes. Exit 0.
```

---

## §B — Verdict and M-wave proposal

**Verdict:** ZERO arms are deletable today. All five are correctly PENDING. The
`proof:workaround-deletion` gate is operating correctly in three-state mode:
PRESENT + UNPUBLISHED = exit 0 (not a failure). No gate weakening has occurred.
No additional workarounds were introduced since the gate was authored.

**M-wave proposal — MW-CONSUME-DELETE (two atomic commits):**

This is not an architectural wave — it is a consume-and-delete band. The wave
structure follows the two sibling publish events:

**Commit 1 (glass-ui track, fires on glass-ui 4.1.0):**
- Re-pin `~4.1.0` in `package.json` / update `package-lock.json`.
- Delete S1: remove `:aria-orientation="undefined"` from `AnimationControls.vue:72`
  and `SpringSidebar.vue:43`.
- Delete S2: remove all `pointerHandled`/`onPlayPointerDown` machinery from
  `TransportDock.vue` (9 sites + comment block).
- Verify `proof:workaround-deletion` S1 + S2 → GREEN;
  `proof:peer-satisfied` → GREEN (if peer fix is in 4.1.0).

**Commit 2 (value.js track, fires on value.js 0.14.0):**
- Re-pin `^0.14.0` in `package.json` / update `package-lock.json`.
- Delete S7: remove `LINEAR_PAREN_PREFIX` constant + normalize block
  (`utils.ts:119, 185–196`); restore direct `cssLinear(parseLinearStops(…))` call.
- Delete S8: remove `FN_NAME` Symbol + `NamedValueUnit` + `fnNameOf` + `stampFnName`
  + all re-stamp call-sites (`utils.ts:45–57, 218, 294, 347`); replace with
  `flatLeaf(v, {fnName})` or published API.
- Delete S9: remove `import { any as parseAny } from "@mkbabb/parse-that"`
  (`utils.ts:1`); replace `tryParseLeaves` internals with
  `parseCSSSubValue(childKey, strValue)`; remove `"@mkbabb/parse-that"` from
  `package.json` `dependencies`.
- Verify `proof:workaround-deletion` S7 + S8 + S9 → GREEN;
  `proof:boundary` W96 arm → GREEN.

**Order:** Track A (glass-ui) and Track B (value.js) are INDEPENDENT — they fire
on separate sibling publishes and can land in either order. Neither track depends
on the other. The MW-CONSUME-DELETE wave is complete when both commits land and
`proof:workaround-deletion` reports 5 GREEN / 0 PENDING / 0 RED.

**Precept compliance:** MW-CONSUME-DELETE is NOT a "quick solution" — it is the
ONLY correct M path. Each delete is gated on the published sibling cure; deleting
before the sibling ships would break the consumer. The P-invariant-28 exit
mechanism (named tripwire + born-RED gate) ensures M carries the workarounds
precisely until — and not a moment after — the cure is safe to consume.
