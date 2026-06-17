# Lane 22 — Constellation DAG audit · Tranche M

**Lane:** 22 — constellation-DAG
**Branch audited:** `tranche-l-dev` (tip `529fcfd` / close commit; `proof:all` GREEN per L.WZ)
**Date:** 2026-06-17
**Auditor:** read-only; no source modified. inv ε: every claim below cites a re-runnable ground-truth probe.

---

## §0 — HEADLINE

The acyclic spine (`parse-that → value.js → kf → glass-ui`) is **structurally clean** at
L-close: no `file:` links, no vendored copies, no import cycles, registry consumption
enforced by two independent CI gates (`proof:deps-current`, `proof:ci-coverage`). The
LIGHT/HEAVY boundary is intact (`proof:boundary` GREEN, 24 light modules, 0 dormant static
value.js specifiers). The parse-that realm converged at `^0.9.0` on both kf and value.js
(`proof:deps-current` clause 3 GREEN, no nested split).

Three classes of defect persist as **PENDING Band-B consume-edges**: (1) five kf-owned
workarounds that cannot delete without a sibling publish (`proof:workaround-deletion` 5 arms
PENDING, exit 0 — not a failure, the STAGED state); (2) the live **F-2 peer-cycle**
(`proof:peer-satisfied` RED-by-design, glass-ui 4.0.0 peer range rejects value.js 0.13.0);
(3) the **inline `lerpArray` copy** in `src/animation/internal/leaves.ts:68` (a
DRY/LIGHT-boundary-forced duplicate of value.js's `math.ts:60` kernel — not a defect-cure
workaround but a spine-cleanliness gap that persists because value.js ships no `./math`
subpath in its `exports` map).

**M owns the constellation as orchestrator**: the NAMED tripwires are its consume-phase
work. Each sibling publish triggers a kf consume commit that DELETES the paired workaround.
M has no new kf-internal architecture to design for the spine — the design is correct; the
M work is consuming the published siblings.

---

## §1 — GROUND-TRUTH SPINE VERIFICATION

### §1.1 Published versions (registry-probed 2026-06-17)

| Package | Published | kf pin | Lockfile resolved | No `file:` |
|---|---|---|---|---|
| `@mkbabb/value.js` | `0.13.0` | `^0.13.0` | `0.13.0` | CLEAN |
| `@mkbabb/parse-that` | `0.9.0` | `^0.9.0` | `0.9.0` | CLEAN |
| `@mkbabb/glass-ui` | `4.0.0` | `~4.0.0` (optional) | `4.0.0` | CLEAN |

`proof:deps-current` — **PASS** (clause 1 FLOOR ✓, clause 2 PROTOCOL ✓, clause 3 REALM
CONVERGED ✓). No `file:/link:/git:` anywhere in `package.json` or lockfile.
`proof:ci-coverage` registry-glass-ui clause — **PASS**: "ZERO workflow clones the glass-ui
sibling or carries a `file:` glass-ui reference."

Evidence: `package.json` lines `"@mkbabb/parse-that": "^0.9.0"`, `"@mkbabb/value.js":
"^0.13.0"`, `"@mkbabb/glass-ui": "~4.0.0"` (optionalDependencies).

### §1.2 Parse-that realm — CONVERGED (not split)

The J.constellation-edges audit (`docs/tranches/J/audit/constellation-edges.md §2d`)
recorded a realm SPLIT: kf had `parse-that ^0.9.0` while value.js@0.11.2 had `parse-that
^0.8.2` (nested `node_modules`). At L-close this is **CURED**: value.js 0.13.0 declares
`"@mkbabb/parse-that": "^0.9.0"` (verified: `node_modules/@mkbabb/value.js/package.json
dependencies`), so both kf and value.js pin the same `^0.9.0` minor. No nested
`node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that` exists. The `proof:deps-current`
clause 3 message reads "REALM: parse-that realm CONVERGED".

The old J-era note about the `(parseAny as any)` cross-realm cast at `utils.ts:248` is now
moot for the realm split, but the CAST ITSELF (`utils.ts:1` `import { any as parseAny } from
"@mkbabb/parse-that"`) remains as the S9 workaround — not a realm split, but an
architectural violation (§2.2 below).

### §1.3 LIGHT/HEAVY boundary — GREEN

`proof:boundary` (re-run 2026-06-17) — **PASS**. 24 light source modules, 0 dormant static
`@mkbabb/value.js` specifiers. All 5 dynamic boundary accessors (`loadAnimationEngine`,
`warmEngine`, `loadEngine`, `loadCompiler`, `loadIngest`) emit the heavy engine as a
NON-ENTRY dynamic chunk with 0 static value.js edges on the accessor entry. The boundary
is the full self-enforcing entry-set parse from `src/animation/index.ts`.

The `FN_NAME` Symbol stamp (`src/animation/utils.ts:45`) and the `parseAny` import
(`utils.ts:1`) are **HEAVY-tier code** — `utils.ts` is not on the LIGHT boundary (it is
statically imported by `engine.ts`, `adapter.ts`, `format.ts` — all HEAVY). `proof:boundary`
correctly does not flag them; they live behind `loadAnimationEngine()`. The spine violation is
architectural (kf owns state on a value.js class; kf reaches through value.js to parse-that),
not a boundary violation.

---

## §2 — THE FIVE PENDING WORKAROUNDS (the STAGED Band-B state)

`proof:workaround-deletion` (re-run 2026-06-17) — **exit 0, 5 PENDING / 0 GREEN / 0 RED**.
The gate's three-state model: GREEN = sibling published + workaround deleted; PENDING =
workaround PRESENT + sibling UNPUBLISHED; RED = sibling published + workaround still present.
All five are PENDING — the correct pre-consume state.

### §2.1 S7 — `linear()` flat-comma normalize regex (inv-L-acyclic-purity violation)

**Location:** `src/animation/utils.ts:119` (`LINEAR_PAREN_PREFIX`) and `:185-193` (the
normalizing `replace`).

**The defect it works around:** value.js's `FunctionValue.toString()` emits `linear()` stops
as a FLAT comma list (`linear(0, 0.5, 25%, 1)`) but its OWN `parseLinearStops` requires the
canonical space-joined form (`linear(0, 0.5 25%, 1)`) and THROWS on the flat form.
Serializer-run-forward is not parser-run-backward. **Explicitly documented** in the source
comment at `utils.ts:187-189`.

**M consume action:** on value.js VJ-L2 publish (the `linear()`/`FunctionValue.toString()`
fix), kf deletes `utils.ts:185-193` (the regex) and calls value.js's serializer directly.
`proof:workaround-deletion` S7 goes GREEN.

**Tripwire:** `@mkbabb/value.js@0.14.0` (NOT yet published — `npm show @mkbabb/value.js@0.14.0`
→ E404, confirmed 2026-06-17).

### §2.2 S8 — `FN_NAME` Symbol sidechannel (inv-L-acyclic-purity violation)

**Location:** `src/animation/utils.ts:45-57` (Symbol declaration + stamp/read helpers),
`:218` (cache comment), `:294` (restamp after clone), `:347` (identity-pad use).

**The defect it works around:** value.js's `flattenObject` dissolves the `FunctionValue`
wrapper into bare `ValueUnit` leaves, dropping the function name. kf needs the name to
resolve CSS identity elements (e.g. `scale → 1`, `translateX → 0px`) for absent-function
interpolation. The kf fix: stamp a Symbol onto each leaf at flatten time. The problem: 
`ValueUnit.clone()` drops the Symbol (it is invisible to value.js, untyped, undocumented),
so kf must RE-STAMP it after every clone. kf is writing mutable state onto a class it does
not own.

**M consume action:** on value.js VJ-L1 publish (first-class `flatLeaf` / preserved
function-name field on `FunctionValue`/`ValueUnit`), kf deletes `utils.ts:45-57` (Symbol
declaration) and `:294-298` (restamp after clone) and reads the name from value.js's
preserved field. `proof:workaround-deletion` S8 goes GREEN.

**Tripwire:** `@mkbabb/value.js@0.14.0` (NOT yet published).

### §2.3 S9 — direct `@mkbabb/parse-that` production dependency (spine architecture violation)

**Location:** `src/animation/utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"`
and `:241` `(parseAny as any)(fnArgs, CSSValues.Value)`. **`package.json`** carries
`"@mkbabb/parse-that": "^0.9.0"` as a first-class production dependency.

**The violation:** kf reaches THROUGH value.js's parser abstraction to compose value.js's
own parsers using parse-that's `any` combinator. The composition belongs in value.js (it
already owns both the parsers and the combinators). This makes kf carry a direct production
dependency on parse-that that it should not have. CLAUDE.md §Dependencies explicitly notes
this: "consumed directly only in `src/animation/utils.ts` (the `any` combinator over
value.js's parsers — a cross-realm nominal-type seam)."

After the VJ-L3 `parseCSSSubValue` publish, kf's single usage replaces `(parseAny as any)(fnArgs, CSSValues.Value)` with a value.js API call, and the ENTIRE `@mkbabb/parse-that` production
dep is deleted from `package.json`. `proof:boundary` (extended per W96) will assert ZERO
`@mkbabb/parse-that` imports in `src/`.

**M consume action:** on value.js VJ-L3 publish (`parseCSSSubValue`/`parseCSSValueOrArgs`
at the value.js root), kf deletes `utils.ts:1` (import), `utils.ts:241` (call site), and
the `@mkbabb/parse-that` dep from `package.json`. `proof:workaround-deletion` S9 goes GREEN;
`proof:boundary` W96 extension goes GREEN permanently.

**Tripwire:** `@mkbabb/value.js@0.14.0` (NOT yet published). Note: the `parseSingleValue`/
`parseFunctionArgs` surface is already in parse-that 0.9.0 (`KF-TO-PARSE-THAT-ASKS.md §5`);
value.js must adopt it as the backend for `parseCSSSubValue` (the §5 cascadeconfirm ask).

**Cascade:** after this deletion, kf has ZERO direct parse-that imports. All parse-that
coordination flows through value.js. The spine becomes `parse-that (combinators) → value.js
(typed grammar) → kf (animation engine)` — acyclic, one-consumer-per-layer.

### §2.4 S1 — `:aria-orientation="undefined"` suppress (glass-ui SegmentedTabs a11y workaround)

**Location:** `demo/spring/SpringSidebar.vue:43` and
`demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`.

**The defect it works around:** glass-ui `SegmentedTabs variant="pill"` emits
`aria-orientation` unconditionally even on `role="group"`. The ARIA spec forbids
`aria-orientation` on `role=group` (valid only on `scrollbar/separator/slider/tablist/
toolbar/treeitem`). The interim is COMPLETE (both pill strips suppressed at L.W9 finalize).

**M consume action:** on glass-ui BB publish (SegmentedTabs pill-branch `aria-orientation`
guard), kf re-pins and deletes BOTH suppress lines in one commit. `proof:workaround-deletion`
S1 goes GREEN.

**Tripwire:** `@mkbabb/glass-ui@4.1.0` (NOT yet published — `npm show @mkbabb/glass-ui@4.1.0`
→ E404, confirmed 2026-06-17).

### §2.5 S2 — `pointerHandled`/`onPlayPointerDown` dock-click interim (glass-ui RF-17)

**Location:** `demo/@/components/custom/animation-controls/TransportDock.vue` (9 occurrences
at lines 15, 151, 196, 342, 348, 358, 361, 366, 373 per `proof:workaround-deletion` S2 scan).

**The defect it works around:** glass-ui 4.0.0 dock-click strand incomplete — the morph
fires on hover-enter (flash) and the collapse-crossfade has an intermediate ghost state. The
kf interim `pointerHandled` guard was reverted and rebooked at K.W1, held through K and L as
a HANDOFF. Chronicity 3 (I, J, K → L). Cannot carry to tranche 4 under P-invariant-28.

**M consume action:** on glass-ui `4.1.0` `W-DOCK-MORPH-FAMILY` + RF-17 publish, kf re-pins
`~4.1.0` and deletes ALL `pointerHandled`/`onPlayPointerDown` lines in TransportDock.vue.
`proof:rf17-net-deletion` goes GREEN.

**Tripwire:** `@mkbabb/glass-ui@4.1.0` (NOT yet published).

**P-invariant-28 terminal:** DL-K9 chronicity is 3. M is the last HANDOFF permitted.
If glass-ui 4.1.0 does not ship `W-DOCK-MORPH-FAMILY` by M's close, this becomes a
KILL or escalates to a glass-ui-owned fix on a named future minor. No 4th-tranche carry.

---

## §3 — THE F-2 PEER-CYCLE (the highest-urgency consume-edge)

`proof:peer-satisfied` (re-run 2026-06-17) — **RED-by-design** (exit 1):

```
glass-ui@4.0.0 declares peer @mkbabb/value.js@"^0.10.0 || ^0.11.0"
installed: 0.13.0 (ELSPROBLEMS)
```

**Impact:** any consumer who installs `@mkbabb/keyframes.js` + `@mkbabb/glass-ui` today gets
a live `ELSPROBLEMS` peer-conflict error from npm. This is not theoretical — it is the live
published state. kf 4.3.0 pins `^0.13.0`; glass-ui 4.0.0's peer range rejects `0.13.0`
(and `0.12.0`).

**M consume action:** on glass-ui publishing any cut that widens the peer range (e.g.
`"^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0"` or `">=0.10.0 <0.15.0"`), kf re-pins to that
cut and `proof:peer-satisfied` turns GREEN. This unblocks the CI deploy signal
(`proof:all`) and the auto-deploy round-trip. The glass-ui ask is filed at
`KF-TO-GLASSUI-BB-ASKS.md §3`.

**No kf workaround permitted.** The no-workaround precept + `inv-L-acyclic-purity` both
forbid papering over this with `npm overrides` or `peerDependenciesMeta.optional`.

**Tripwire:** glass-ui `4.0.x` patch or `4.1.0`.

---

## §4 — THE INLINE `lerpArray` COPY (DRY / spine-cleanliness gap)

**Location:** `src/animation/internal/leaves.ts:68-80`.

**The gap:** value.js exports `lerpArray` at its root barrel (`node_modules/@mkbabb/value.js/dist/value.js:5002` — confirmed present). But value.js ships NO `@mkbabb/value.js/math` subpath
in its `exports` map (`package.json exports: {".": {types, import, default}}` — confirmed).
A kf LIGHT module that imports `lerpArray` from `@mkbabb/value.js` would pull value.js's
full CSS-grammar static init into the LIGHT bundle and red `proof:boundary` (the source-grep
assertion bans ANY static value.js specifier in a light module). So kf's LIGHT tier
(`internal/leaves.ts`) inlines an identical copy — `src/animation/internal/leaves.ts:50-80`
documents this explicitly.

**This is NOT a defect-cure workaround (unlike S7/S8/S9).** It is a DRY/spine-cleanliness
forced duplicate: the inline is byte-equivalent to value.js's copy by construction; it
produces no behavioural gap; it violates no invariant. The issue is purely that the spine has
two copies of the same math kernel.

**M consume action:** on value.js shipping an `@mkbabb/value.js/math` subpath export
(the `KF-TO-VALUEJS-O-ASKS.md §14` ask — a `./math` exports entry with zero static edge to
ValueUnit/Color/grammar), kf's LIGHT tier DELETES `leaves.ts:68-80` and imports
`{ lerpArray } from "@mkbabb/value.js/math"`. `proof:boundary` must stay GREEN across the
swap (the subpath is value.js-free by construction). `proof:workaround-deletion` would gain
a new arm for this once the subpath lands (it is not yet in the PENDING set because it is
DRY-severity, not a defect-cure).

**Tripwire:** `@mkbabb/value.js@0.14.0` with the `./math` subpath in the `exports` map
(the `KF-TO-VALUEJS-O-ASKS.md §14` ask).

---

## §5 — THE LONGER-HORIZON CONSUME-EDGES (the chronic HANDOFF band)

These edges pre-exist L and carry into M with named tripwires and born-RED kf gates.
P-invariant-28 applies to all: a BOOK without a named tripwire + gate is not valid.

### §5.1 GlassControlPoint / DL-L7 (6 tranches: E,F,G,H,I,J,K,L → M)

**Gate:** `proof:control-point-live` RED-by-design (re-run 2026-06-17 → exit 1; confirmed
`grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/` → ZERO).

The kf curve-editor (AX-1) depends on a `GlassControlPoint` draggable-SVG-handle component
from glass-ui. It has not shipped in any glass-ui cut through 4.0.0. The L dispatch
(`KF-TO-GLASSUI-BB-ASKS.md §4`) asks glass-ui BB for a named disposition (Option A: BB-in-scope;
Option B: named post-BB minor; Option C: KILL). **M must close this chronic** — chronicity 6
is the outer bound of P-invariant-28 honesty.

**M action:** receive the BB named disposition. If Option A or B: hold; gate stays born-RED
until the publish. If Option C: close `DL-L7` as KILL in M's ledger; the keyframes-editor
is out-of-scope permanently; no M wave.

### §5.2 MorphSVG / DL-K21 / FB-3 (6 tranches: C,F,G,H,I,J,K,L → M)

**Gap:** `fromMorphSVG`/`getPointAtLength` arc-length sampler — the value.js O dispatch
`KF-TO-VALUEJS-O-ASKS.md` (W4 item). value.js 0.13.0 does export `getPointAtLength`
(`node_modules/@mkbabb/value.js/dist/value.js:5002` — confirmed present in the exports list),
but kf's `fromMorphSVG` gate (`proof:morphsvg-consume`) does not exist in the tree (`scripts/
proof-morphsvg-consume.mjs` → MODULE_NOT_FOUND). The gate was never authored.

**M action:** author `proof:morphsvg-consume` GATE-FIRST before any `fromMorphSVG` implementation
begins (the gate-first / born-RED law). Then confirm whether value.js 0.13.0's `getPointAtLength`
is the correct contract for the arc-length sampler or if additional value.js O items (the
`KF-TO-VALUEJS-O-ASKS.md` VJ.W4 remainder) are still needed.

### §5.3 Packrat soundness / PT-2 (5 tranches: E,F,G,H,I,K,L → M)

**Gap:** parse-that's packrat memoization keys on `parser.id` alone (not `(id, offset)` —
Warth-Douglass-Millstein). Source-confirmed: `parse-that/typescript/src/parse/packrat.ts`
ships the id-only key with a self-documented unsoundness note. No parse-that PT-WAVE-6 has
shipped. kf has no direct gate on this; it is value.js's concern when enabling recursive
grammar (L.W10 Option B / CSS Nesting parse).

**M action:** the value.js O demand for recursive nesting (`KF-TO-VALUEJS-O-ASKS.md §9`,
the CSS Nesting THROW fix) should precede any packrat opt-in. If value.js authors Option B
(parse-that as tokenizer), the packrat fix becomes load-bearing; if value.js authors Option B
without the packrat re-key, a `proof:packrat-sound` gate should be authored for the specific
recursive-grammar consumer path.

### §5.4 The W10 CSS-parity frontier (`proof:css-parity`) — RED-today, IMPL gated on sibling publish

**Gate:** `proof:css-parity` — does NOT exist (`scripts/proof-css-parity.mjs` → not found).

The W10 RESEARCH SPIKE concluded (Option B per `W10-css-parity-spike.md §3.2`): delete
parse-that's `parsers/css/` STRUCTURAL grammar; keep the value readers; consolidate the ONE
CSS grammar in value.js. Implementation is gated on the coordinated value.js-O (§9 nesting,
§13 gradient, §1 comma-list) + parse-that (§4 typesVersions, §5 API-stability confirm) publish.

**M action:** author `proof:css-parity` GATE-FIRST (the capability matrix — the gate
cannot be authored correctly until Option B's predicate is confirmed). Then coordinate with
value.js O on the nesting THROW + bare-linear-gradient THROW (the two HIGH-severity Baseline
crashes). The gate's `nesting` row asserts the THROW is gone; the `structured-gradient` row
asserts the bare-linear-gradient no longer throws.

---

## §6 — THE CONSTELLATION AS M'S ORCHESTRATION SUBSTRATE

### §6.1 What M owns

M is the constellation orchestrator for the first CONSUME CYCLE: the L-dispatched asks are
all in flight; M's role is to consume each sibling publish in the correct order and close
the PENDING workarounds. M does NOT write value.js's tree, parse-that's tree, or glass-ui's
tree. The acyclic-spine law (inv-16 + inv-L-acyclic-purity) forbids it.

The M-wave map for constellation work is entirely CONSUME-driven:

| Sibling publish | kf M wave | Workarounds deleted | Gates go GREEN |
|---|---|---|---|
| `@mkbabb/glass-ui` peer-range widen (4.0.x or 4.1.0) | M consume | (none deleted yet; peer range fix only) | `proof:peer-satisfied` |
| `@mkbabb/glass-ui@4.1.0` BB full (SegmentedTabs aria + RF-17 + peer) | M consume | S1 (both aria suppress) + S2 (TransportDock interim) | `proof:workaround-deletion` S1+S2, `proof:rf17-net-deletion` |
| `@mkbabb/value.js@0.14.0` (VJ-L1: flatLeaf/fn-name) | M consume | S8 (FN_NAME Symbol) | `proof:workaround-deletion` S8 |
| `@mkbabb/value.js@0.14.0` (VJ-L2: linear()/FunctionValue.toString) | M consume | S7 (LINEAR_PAREN_PREFIX regex) | `proof:workaround-deletion` S7 |
| `@mkbabb/value.js@0.14.0` (VJ-L3: parseCSSSubValue) | M consume | S9 (parse-that dep + utils.ts:1 import) | `proof:workaround-deletion` S9, `proof:boundary` W96 |
| `@mkbabb/value.js@0.14.0` (./math subpath) | M consume | lerpArray inline copy in leaves.ts | `proof:boundary` stays GREEN; budgeted bench |
| `@mkbabb/value.js@0.14.0` (§9 CSS Nesting cure) | M consume | — (no kf workaround; was THROW at seam) | `proof:css-parity` nesting row |
| `@mkbabb/value.js@0.14.0` (§13 gradient crash cure) | M consume | — (no kf workaround; was THROW at seam) | `proof:css-parity` structured-gradient row |

**Re-pin discipline:** all re-pins in ONE atomic commit per sibling cut: `package.json` dep
bump + `npm install` + lockfile update + workaround deletion + gate verification (no
split-commit partial-consume allowed).

### §6.2 The kf-to-glass-ui edge is also a consume edge on the PUBLISHED surface

`vite.config.ts` carries a legitimate self-dedup alias: `@mkbabb/keyframes.js →
src/animation/index.ts` (documented at `vite.config.ts:139-162`). This is NOT a `file:` link
— it is an `alias` inside the vite dev config only, resolving the SELF import to source for
the demo's HMR. The library build does NOT carry this alias; `proof:deps-current` clause 2
verifies only `package.json` + lockfile declarations.

### §6.3 The `keyframes-vue` publish (USER-DOMAIN)

`proof:keyframes-vue-published` is **RED-by-design** (clause b: `npm show @mkbabb/keyframes-vue@0.1.0`
→ E404). The package is built and prepped; the publish is USER-DOMAIN (Mike Babb). M
inherits this gated item if L closes without publishing.

### §6.4 The version cut (5.0.0 recommendation)

L.FINAL.md §S6 recommends MAJOR `5.0.0` for three orthogonal reasons: replay-equality TOTAL
as a breaking behavioural change on the compile surface; the `Animation`/`ScrollTimeline`
type renames; and the package graph change (`keyframes-vue` + demo on published barrel). The
cut is USER-DOMAIN. M's constellation work does not require the version decision but the
constellation consume-phase (re-pins + workaround deletions) is the natural complement to a
major cut.

---

## §7 — PRECEPT FINDINGS (L-as-built)

### §7.1 Violations still PRESENT (the PENDING workarounds are open violations)

| ⚠# | Violation | File:line | Precept | Status |
|---|---|---|---|---|
| ⚠20 | S7 `linear()` regex workaround in consumer | `utils.ts:185-193` | no-workaround / inv-L-acyclic-purity | PENDING (sibling unpublished) |
| ⚠18 | S8 `FN_NAME` Symbol stamps external class | `utils.ts:45-57,294-298` | no-workaround / inv-L-acyclic-purity | PENDING (sibling unpublished) |
| ⚠24 | S9 direct `@mkbabb/parse-that` production dep | `utils.ts:1`, `package.json` | no-workaround / inv-L-acyclic-purity / CLAUDE.md §Dependencies | PENDING (sibling unpublished) |
| ⚠1/⚠3 | S1 `:aria-orientation="undefined"` suppress | `SpringSidebar.vue:43`, `AnimationControls.vue:72` | no-workaround / inv-L-acyclic-purity | PENDING (sibling unpublished) |
| ⚠5 | S2 `pointerHandled`/`onPlayPointerDown` dock-click interim | `TransportDock.vue` (9 occurrences) | no-workaround / inv-16 | PENDING (sibling unpublished; P-inv-28 TERMINAL at M) |

All five are correctly STAGED (not re-implemented, not suppressed differently) and each has a
named tripwire. This is the inv ε / P-invariant-28 exit shape for pre-consume items. They are
NOT quick-solution/workaround-that-kf-owns violations in the M sense; they are
born-RED-PENDING items awaiting the sibling publish.

### §7.2 The lerpArray inline — DRY violation (LOW severity)

`src/animation/internal/leaves.ts:68-80` is a byte-equivalent duplicate of
`value.js/src/math.ts:60-80`. Not a precept violation in the strong sense (no workaround, no
cycle), but a KISS/DRY gap that persists because value.js ships no `./math` subpath. M
inherits it as a medium-priority consume-edge.

### §7.3 No new kf-owned precept violations found

The L-as-built tree carries no NEW kf-owned workarounds (items introduced in L beyond the
PENDING five). `proof:no-deprecated-guard` (P1 no-legacy), `proof:boundary` (P6 inv α),
`proof:demo-on-published-surface` (P11 dogfood at PUBLISHED level), and `proof:ci-coverage`
(P13 registry-consumption) all GREEN.

---

## §8 — CROSS-REPO ASK STATUS (what M inherits from the L dispatches)

### §8.1 value.js O asks — status at M-open

| Ask | kf impact | Status |
|---|---|---|
| VJ-L1 flatLeaf (FN_NAME) | S8 deletion | UNPUBLISHED (0.14.0 not yet) |
| VJ-L2 linear()/FunctionValue.toString | S7 deletion | UNPUBLISHED |
| VJ-L3 parseCSSSubValue | S9 deletion (parse-that dep) | UNPUBLISHED |
| §14 ./math subpath | lerpArray inline deletion | UNPUBLISHED |
| §9 CSS Nesting cure | proof:css-parity nesting row | UNPUBLISHED |
| §13 gradient crash fix | proof:css-parity gradient row | UNPUBLISHED |
| §8 @property typed grammar (existing L.W1 uses serializeStylesheetItem) | proof:replay-equality @property arm | L.W1 consumes 0.13.0 serializeStylesheetItem (GREEN); typed widening is O ask |
| §7 VJ.L1–L8 perf alloc | budgeted bench turns GREEN | UNPUBLISHED |

### §8.2 parse-that asks — status at M-open

| Ask | Status |
|---|---|
| §4 typesVersions surgery (PT-WAVE-4) | NEEDED: `parse-that/typescript/package.json` `typesVersions: {"*":{"*":["dist/src/parse/index.d.ts"]}}` is the stale field — confirmed present in the LOCAL source; the PUBLISHED 0.9.0 also carries it (the J.constellation-edges audit noted this: "exports: {types, import, require}"). kf `proof:deps-current` does not yet assert `typesVersions` absent. |
| §5 parseSingleValue/parseFunctionArgs stability confirm | NEEDED before value.js §8 consume |
| §2 packrat soundness | NEEDED if value.js goes Option B recursive |
| §3 permutation combinator | NEEDED for value.js shorthand grammar collapse |
| §1 architectural unification (Option A/B decision) | NEEDED for `proof:css-parity` predicate |

**Note on parse-that `typesVersions` (ground-truth verification):**
`npm show @mkbabb/parse-that --json` was not probed directly (no `npm show` output for this
run). The INSTALLED `node_modules/@mkbabb/parse-that/package.json` was NOT separately
inspected in this audit session. The J.constellation-edges audit (`§3a`) recorded the
installed 0.9.0 `exports: {types, import, require}` — which would be the CORRECT form if
`typesVersions` is absent. The LOCAL SOURCE tree (`parse-that/typescript/package.json`)
confirmed `typesVersions` IS present. Whether the PUBLISHED 0.9.0 npm tarball carries the
stale field requires a separate `npm pack`/install probe — kf's `proof:deps-current` does
not currently assert this (the extension to assert `typesVersions-absent` is a forthcoming
M gate, per `KF-TO-PARSE-THAT-ASKS.md §4.3`).

### §8.3 glass-ui BB asks — status at M-open

| Ask | Status |
|---|---|
| §3 F-2 peer-range widen | LIVE DEFECT (`proof:peer-satisfied` RED — exit 1 confirmed) |
| §1 SegmentedTabs aria fix | UNPUBLISHED (4.1.0) |
| §2 W-DOCK-MORPH-FAMILY / RF-17 | UNPUBLISHED (4.1.0); P-inv-28 TERMINAL at M |
| §4 GlassControlPoint disposition | AWAITING BB response |
| §5 KF-OSCILLATOR wave confirm | AWAITING BB wave + API confirmation |

---

## §9 — PERFORMANCE NUMBERS

The SOTA perf findings are owned by Lane 07 (W7). The constellation lane reports only what
is constellation-relevant:

- **lerpArray duplication**: the inline copy in `leaves.ts:68-80` is byte-equivalent to
  value.js's `math.ts:60-80`. Zero correctness gap; zero runtime gap (the function body is
  identical). The ONLY cost is DRY-cleanliness and the added surface for divergence on future
  kf upgrades.
- **VJ.L1–L8 alloc budget**: the value.js color-math alloc rewrite (`transformMat3`,
  `oklab2xyz`, `mixColors`, `gamutMapToRgbSpace`) is budgeted in `proof:bench-taxonomy`
  (observe-only category: wall-clock). The kf-side consume gate is the budgeted bench arm;
  the alloc-count drop is a value.js-side measurement obligation (MEASURE-FIRST discipline).

No new perf numbers to report for the constellation DAG itself. The spine topology adds zero
runtime overhead on the kf hot paths.

---

## §10 — DEFERRED FOLDS for M

| DL-ID | Item | Chronicity | M disposition |
|---|---|---|---|
| DL-L6 | RF-17 dock-click / W-DOCK-MORPH-FAMILY | 3 tranches → M TERMINAL | FOLD on 4.1.0 consume; KILL or escalate if 4.1.0 misses |
| DL-L7 | GlassControlPoint / AX-1 curve-editor | 6 tranches → M TERMINAL | FOLD on Option A/B/C named disposition from BB |
| DL-L8 | MorphSVG / FB-3 / fromMorphSVG | 6 tranches → M action | GATE-FIRST: author `proof:morphsvg-consume`; then consume on value.js O |
| DL-L9 | parse-that packrat soundness | 5 tranches → M action | Coordinate with value.js O §9 (recursive-grammar adoption) |
| DL-L10 | S1+S2+S7+S8+S9 workaround-deletion band | L-STAGED → M CONSUME | Each arm GREEN on sibling publish + kf re-pin + deletion |
| DL-L11 | CSS-parity frontier (W10 Option B) | L-RESEARCH → M IMPL | Author `proof:css-parity` GATE-FIRST; IMPL gated on sibling publish |

---

## §11 — M-WAVE PROPOSALS (constellation-orchestration tier)

### MW-C1 — Consume glass-ui 4.x peer-range + BB full consume (URGENT)

**Trigger:** glass-ui publishes a peer-range widen for `@mkbabb/value.js`.
**kf wave:** atomic re-pin + S1/S2 deletions if full 4.1.0; peer-range-only if point-release.
**Gate outcome:** `proof:peer-satisfied` GREEN; `proof:workaround-deletion` S1+S2 GREEN if 4.1.0.
**Priority:** URGENT — the F-2 peer-cycle is a live ELSPROBLEMS on every kf consumer today.

### MW-C2 — Consume value.js 0.14.0 (the full workaround-deletion commit)

**Trigger:** `@mkbabb/value.js@0.14.0` published with VJ-L1 + VJ-L2 + VJ-L3 + ./math subpath.
**kf wave:** one atomic commit: `^0.13.0 → ^0.14.0` re-pin + S7/S8/S9 deletions + lerpArray
inline deletion + `@mkbabb/parse-that` dep removal.
**Gate outcome:** `proof:workaround-deletion` S7+S8+S9 GREEN; `proof:boundary` W96 extension
GREEN; `proof:deps-current` parse-that dep absent.
**Priority:** HIGH — removes three named inv-L-acyclic-purity violations and cleans the spine.

### MW-C3 — Author `proof:css-parity` GATE-FIRST + coordinate W10 IMPL

**Trigger:** value.js O §9 (nesting cure) + §13 (gradient crash) publish.
**kf wave:** author the `proof:css-parity` capability matrix gate predicate (the rows for
nesting THROW-gone, bare-linear-gradient THROW-gone); implement L.W3 recursive group-rule
walk (the ingest deepening) on the typed recursive `StylesheetItem`.
**Gate outcome:** `proof:css-parity` nesting + structured-gradient rows GREEN.
**Priority:** HIGH — two genuine hard crashes on Baseline CSS currently block full ingest totality.

### MW-C4 — GlassControlPoint disposition (Option A/B/C named close)

**Trigger:** glass-ui BB records the GlassControlPoint disposition.
**kf wave:** if Option A/B: hold; author `proof:control-point-live` consumption arm when
the primitive publishes. If Option C: close DL-L7 as KILL in M's ledger; no kf action.
**Priority:** MEDIUM — P-invariant-28 terminal; must close or formally KILL in M.

### MW-C5 — `proof:morphsvg-consume` GATE-FIRST (the MorphSVG chronic gate)

**Trigger:** M planning phase (before any fromMorphSVG impl attempt).
**kf wave:** author `proof:morphsvg-consume` born-RED gate. Probe whether value.js 0.13.0's
`getPointAtLength` (confirmed present in 0.13.0 dist) is the full required contract. If
value.js O has arc-length sampler improvements, gate on the 0.14.0 consume.
**Priority:** MEDIUM — 6-tranche chronic without a gate is P-invariant-28-violating.

---

## Terminal reading

The L-close constellation spine is **acyclic, registry-clean, and boundary-enforced**.
Three gates confirm this at re-run: `proof:deps-current` PASS, `proof:ci-coverage` PASS,
`proof:boundary` PASS. The five PENDING workarounds are correctly STAGED — each a named
tripwire + born-RED gate that converts to GREEN on the sibling publish. The F-2 peer-cycle
is the highest-urgency M item (live ELSPROBLEMS today). The S9 direct parse-that dep
is the deepest architectural violation and the one whose deletion most improves the
spine's clarity. M's role is to BE the consume-phase orchestrator — not to design new
architecture for the spine, but to CLOSE the PENDING band by consuming the siblings as they
publish.

What M does NOT yet have: value.js 0.14.0 (the full workaround-deletion trigger); glass-ui
4.1.0 (the peer-fix + aria-fix + dock-fix trigger); the `proof:css-parity` gate (un-authored,
gated on the W10 Option B publish); the `proof:morphsvg-consume` gate (un-authored, a
P-invariant-28 obligation). These are named; none is overclaimed closed.
