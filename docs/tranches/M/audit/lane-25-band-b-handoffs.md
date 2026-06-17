# Lane 25 — Band-B Handoffs: Tranche M Audit

**Lane:** 25 · **Tranche:** M (seed audit) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `529fcfd` / `4b3d2eb`)
**Subject:** Band-B HANDOFF edges DL-L6 RF-17/GlassDock, DL-L7 GlassControlPoint (chronicity 6),
DL-L8 MorphSVG/FB-3 (chronicity 6), DL-L9 packrat/PT-2 (chronicity 5), DL-L11 css-parity.

P-invariant-28 audit: every ≥4-tranche item (DL-L7/DL-L8/DL-L9) MUST exit in M via consume
or named KILL. This lane determines whether each is genuinely sibling-gated or whether kf could
build-in.

**Registry probed at audit time:** glass-ui 4.0.0 · value.js 0.13.0 · parse-that 0.9.0
(E404 on 4.1.0 / 0.14.0 / PT-WAVE-6+).

---

## §0 — Summary verdict

| Item | Chronicity | Gate state (live) | Genuinely sibling-gated? | kf build-in possible? | M disposition |
|------|------------|-------------------|--------------------------|-----------------------|---------------|
| **DL-L6 RF-17** | 3 (I,J,K→L) | `proof:workaround-deletion` S2 PENDING | YES — glass-ui component behaviour | NO (inv-16 + acyclic-spine) | M re-pin on glass-ui 4.1.0 |
| **DL-L7 GlassControlPoint** | 6 (E…K→L) | `proof:control-point-live` RED by design | YES — glass-ui primitive; no kf substitute | IF glass-ui C: kf owns the control-point component (KILL route only) | M exit: consume OR named KILL (re-BOOK CLOSED) |
| **DL-L8 MorphSVG** | 6 (C…K→L) | `proof:morphsvg-consume` born-RED | PARTIALLY — value.js PathGeometry PARTIAL in 0.13.0; `fromMorphSVG` kf-side is missing | YES — kf CAN build `fromMorphSVG` over the EXISTING PathGeometry in 0.13.0 | M-Wave M.W-MORPHSVG: build-in kf OVER the PUBLISHED PathGeometry; P-inv-28 DEMANDS this |
| **DL-L9 packrat/PT-2** | 5 (E…K→L) | no `proof:packrat-sound` in scripts/ | NUANCED — the published 0.9.0 dist ALREADY uses composite (id,offset) key; SOURCE id-only unsoundness is in the LR grow path only | MOOT — the unsoundness is off the default path; the value.js grammar uses no packrat opt-in | M: VERIFY + possible KILL (reframe as BOOK on explicit opt-in only) |
| **DL-L11 css-parity** | 1 (K→L) | `proof:css-parity` ABSENT (script missing) | YES — the two hard-crashes are value.js bugs; the grammar totality requires coordinated publish | The gate authoring is kf-side Band-A work; the cures are sibling-gated Band-B | M.W10-IMPL: gate-first + coordinate on value.js O publish |

---

## §1 — DL-L6: RF-17 / GlassDock click-strand interim

### Ground-truth verification (verified at `529fcfd`)

The kf interim (`onPlayPointerDown` + `pointerHandled`) is present in
`demo/@/components/custom/animation-controls/TransportDock.vue` at lines 15, 151, 196, 342,
348, 358, 361, 366, 373 — confirmed by `proof:workaround-deletion.mjs` S2 output:

```
… S2 PENDING — PRESENT + sibling UNPUBLISHED. pointerHandled / onPlayPointerDown interim
    (TransportDock.vue) → glass-ui RF-17 dock-layer cure
    workaround at demo/.../TransportDock.vue:15,151,196,342,348,358,361,366,373;
    @mkbabb/glass-ui@4.1.0 is NOT YET published (E404).
```

glass-ui published version is 4.0.0 (registry-probed). 4.1.0 returns E404. The S2 arm is
correctly PENDING (not RED — the three-state model: PENDING because the sibling fix is
unpublished, not yet safe to delete).

### Is it genuinely sibling-gated?

YES. The defect is in glass-ui's dock-layer crossfade semantics: the collapse-crossfade shows
a ghost intermediate state where icon + label coexist at partial opacity. The `onPlayPointerDown`
guard suppresses the double-click that triggers this ghost by marking pointer events handled.
A kf-side fix would require kf to inspect glass-ui's internal animation state — a direct
inv-16 violation (kf writes NO glass-ui source). The no-workaround precept forbids the
current band-aid exactly: kf is patching a glass-ui rendering defect at the consume seam.

Chronicity 3 (I, J, K → L). P-invariant-28 requires a named tripwire. The tripwire is named
(glass-ui 4.1.0 `W-DOCK-MORPH-FAMILY`) and the born-RED gate is authored. **No 4th-tranche
carry is permissible under the no-workaround precept.**

### Precept findings

- **inv-16 violation** (`demo/@/.../TransportDock.vue:15,348-373`): kf patching a glass-ui
  dock-layer transition defect at the consume seam — exactly the class the no-workaround
  precept and inv-L-acyclic-purity indict.
- The workaround has chronicity 3 — one tranche below the P-inv-28 4-tranche exit-mandate.
  However, no-workaround applies independently: carrying to a 4th tranche would be a named
  precept violation regardless of P-inv-28.

### M wave proposal

**M-Wave: re-pin to glass-ui 4.1.0 + delete the S2 interim in ONE commit.**
- When glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY`: kf re-pins `~4.1.0`, deletes both
  `pointerHandled` and `onPlayPointerDown` in the same commit, `proof:workaround-deletion`
  S2 turns GREEN.
- This is the same commit that fires S1 (aria-orientation suppress deletion) and S3
  (peer-satisfied GREEN if the peer-range widen is in 4.1.0). One re-pin closes three S arms.
- **Tripwire:** glass-ui 4.1.0 npm registry E404 → E200. No kf code change until then.

---

## §2 — DL-L7: GlassControlPoint (6-tranche, P-inv-28 exit-mandate)

### Ground-truth verification (verified at `529fcfd`)

`proof:control-point-live.mjs` output:

```
  ✗ GlassControlPoint is ABSENT from the published @mkbabb/glass-ui@4.0.0 dist tree
    (grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/ → ZERO)
proof:control-point-live — RED (1)
```

The gate is born-RED-by-design as a report-all tripwire (NOT a blocking hygiene arm). This
correctly represents the honest state: the primitive is absent, the gate is RED, the re-BOOK
option is CLOSED.

### Is it genuinely sibling-gated?

PARTIALLY. The ask is for a glass-ui SVG control-point handle with a pointer drag composable.
The component's visual language (glass specular, token theming) is glass-ui domain. But the
mechanical core — an SVG `<circle>` bound to a pointer drag that exposes a normalized (x,y)
output — is implementable in kf without glass-ui, using the existing `drag`/`Draggable`
LIGHT primitives (`src/animation/drag.ts`) plus a thin Vue component in the demo.

**The P-invariant-28 analysis.** Chronicity 6 (E,F,G,H,I,J,K → L). The ledger records the
re-BOOK option as CLOSED at L.WZ. This means M must either:
- **Option A (consume):** glass-ui BB ships `GlassControlPoint` → kf re-pins → gate GREENs.
- **Option B (kill / build-in):** kf decides the control-point is not glass-ui's charter AND
  owns the component in the demo as a kf-demo primitive, using `Draggable` + `RAFPlayback` to
  implement the drag-and-drop SVG control point. This KILLS the glass-ui dependency for this
  feature. The KILL must carry a concrete spec: the kf-demo control-point is a `<DemoControlPoint>`
  Vue component in `demo/@/` using `drag` + `RAFPlayback` with SVG handles styled via
  glass-ui design tokens (no new glass-ui import required for a circle + line).

The Option B (build-in) is architecturally sound and aligns with KISS: kf ALREADY has `drag`
and `Draggable` (LIGHT, value.js-free). The keyframes curve editor needs a draggable bezier
handle — that is precisely what `Draggable` models. The only glass-ui-specific value a
`GlassControlPoint` would add is the visual polish (glass specular, token shadows) — which
can be achieved with CSS classes from `@mkbabb/glass-ui/styles` (no component import needed).

### Precept findings

- **P-invariant-28 terminal:** 6 tranches. re-BOOK is CLOSED. M must exit this belt.
- `proof:control-point-live` is posited as a report-all tripwire, NOT a blocking hygiene arm.
  If M's KILL decision is taken (Option B build-in), the gate should be RETIRED (the primitive
  will never publish because it's not glass-ui's job), and a `proof:demo-control-point`
  gate-first gate replaces it for the kf-demo component.

### M wave proposals

**M-Wave M.W-GLASSCONTROLPOINT-EXIT (the P-inv-28 exit):**

Two sub-options; M must pick one at W0/dev-phase:

1. **Option A (consume-on-BB-publish):** If glass-ui BB commits to shipping
   `GlassControlPoint` in the BB tranche, `proof:control-point-live` stays as the tripwire;
   kf builds the bezier editor once the gate GREENs. This requires an explicit glass-ui BB
   disposition named to kf. Without that named commitment, Option A carries to a 7th tranche
   (forbidden).

2. **Option B (build-in KILL + kf-demo component):** kf declares `GlassControlPoint` out of
   kf's charter as a glass-ui PRIMITIVE (the glass-ui component was the ENABLER, not the
   product), and instead builds a `<DemoControlPoint>` Vue component in `demo/@/components/`
   using the EXISTING `drag`/`Draggable` LIGHT primitive + SVG + glass-ui CSS tokens. This
   closes the 6-tranche belt permanently. Gate: `proof:demo-control-point` (born-RED: the
   component does not exist today; GREEN once authored + the bezier editor works). The KILL
   record: `GlassControlPoint` as a glass-ui primitive is OUT-OF-SCOPE for kf's demo (kf
   builds its own, glass-ui does not need to deliver it for kf to work).

**Recommendation for M charter:** ADOPT Option B as the default unless glass-ui BB explicitly
commits to shipping `GlassControlPoint` in the BB tranche. The build-in is simpler, kf already
has the substrate (`Draggable`), and after 6 tranches the BOOK has generated zero shipped code.
KISS demands we stop waiting and build the N=20-LOC control-point directly.

---

## §3 — DL-L8: MorphSVG / FB-3 (6-tranche, P-inv-28 exit-mandate)

### Ground-truth verification — CRITICAL NUANCE

The L deferred ledger (DLL-21) states the tripwire is value.js O VJ.W4 remainder —
"the arc-length PARTIAL (VJ.W4) is in 0.13.0, the full sampler is the VJ.W4 remainder".

Live inspection of the published value.js 0.13.0 exports confirms:

```
getPointAtLength  → EXPORTED (Xd alias, PathGeometry class method)
getTotalLength    → EXPORTED (Yd alias)
PathGeometry      → EXPORTED (Jd alias)
```

The `PathGeometry` class at lines 4958-5000 of `value.js/dist/value.js`:
```
getPointAtLength(e) { ... return this.getPointAtLength(e * this.totalLength); }
```
This IS a published, working arc-length sampler class. `getPointAtLength` (the module-level
alias `Xd`) accepts `(d: string, t: number)` and returns a point.

**The `fromMorphSVG` kf-side function does NOT exist** — confirmed:
```sh
grep -rn "fromMorphSVG" src/animation/  → zero hits
```

`motion-path.ts:17` explicitly records the design decision: *"The heavier SVG-geometry half —
parse a path `d` to a length-parametrized sampler (numeric/canvas MotionPath, MorphSVG, DrawSVG)
— is value-domain geometry math, routed OUT to value.js (VJ-F1) and BOOKED, NOT manufactured
here."*

`draw-svg.ts:43-48` uses the BROWSER DOM's `getTotalLength()` on `SVGGeometryElement`, NOT
value.js's `PathGeometry` — the two are separate: DOM is for live SVG elements in the browser;
`PathGeometry` is for offline `d`-string interpolation.

### Is it genuinely sibling-gated?

**NO — the required value.js primitive IS ALREADY PUBLISHED at 0.13.0.**
The `PathGeometry` class with `getPointAtLength(t)` is exported in value.js 0.13.0.
`fromMorphSVG` is a kf-side function that:
1. Takes two SVG `d` strings (source + target).
2. Samples both paths at N uniform-arc-length intervals using value.js's `getPointAtLength`.
3. Returns a `CSSKeyframesAnimation` that interpolates between sampled point-pairs.

None of this requires a new value.js API. The arc-length sampler (`PathGeometry`) is PUBLISHED.
The path-to-point interpolation kernel is kf-domain animation logic (lerp between point arrays).

**P-invariant-28 consequence.** Chronicity 6 (C,F,G,H,I,J,K → L). The L ledger records this
as "the arc-length PARTIAL is in 0.13.0, the full sampler is the VJ.W4 remainder" — but this
claim does not hold: `PathGeometry.getPointAtLength` IS the full arc-length sampler for uniform
sampling. What VJ.W4 "remainder" meant in the K-era was a planned value.js wave; but the
published 0.13.0 exports confirm the sampler IS THERE.

The entire `fromMorphSVG` implementation is buildable TODAY without waiting for value.js 0.14.0.
This is a kf-owned implementation gap, not a sibling-publication block.

### Precept findings

- **P-invariant-28 violation in the L ledger's tripwire framing:** the L ledger states
  "tripwire: value.js O (0.14.0) ships the VJ.W4 remainder" — but the 0.13.0 exports show
  `PathGeometry`/`getPointAtLength`/`getTotalLength` are already published. The L audit relied
  on the K-era "VJ.W4 booked" record without re-verifying the 0.13.0 surface. This is a
  factual error in the L ledger's gate framing: **the tripwire does not need to fire because
  the prerequisite is already met.**
- **inv ε (overclaim):** The L ledger cites `proof:morphsvg-consume` as "born-RED (APIs absent
  in 0.13.0)" — but `getPointAtLength`/`PathGeometry` ARE present in 0.13.0. The gate should
  be born-RED because `fromMorphSVG` is UNIMPLEMENTED in kf, not because the value.js API is
  absent.

### M wave proposal

**M-Wave M.W-MORPHSVG (build-in — the P-inv-28 mandatory exit):**

`fromMorphSVG` is kf-implementable over the PUBLISHED value.js 0.13.0 `PathGeometry` API.
The implementation plan:

1. **`src/animation/morph-svg.ts`** (new HEAVY file, alongside `motion-path.ts`):
   - `fromMorphSVG(from: string, to: string, opts: InputAnimationOptions): CSSKeyframesAnimation`
   - Sample both paths at N uniform-arc-length intervals using value.js's exported
     `getPointAtLength(d, t)` (the `Xd` alias).
   - Build a `@keyframes` block interpolating the per-step point-pair (lerp over the
     sampled coordinate arrays using `NumericAnimation` or plain lerp).
   - Expose via `loadAnimationEngine()` alongside `MotionPath`/`DrawSVG`.

2. **Gate (born-RED today):** `proof:morphsvg-live` — asserts `fromMorphSVG` is importable
   from the barrel AND a live morph (two `d` strings → animated interpolation) produces a
   frame count > 0. Born-RED: the export does not exist today; GREEN once authored.

3. **No new value.js dependency** — `PathGeometry` is already in the HEAVY surface (engine.ts
   already imports `@mkbabb/value.js`; `morph-svg.ts` adds no new edge).

4. **Re-frame `proof:morphsvg-consume`:** retire the old gate (its premise was wrong — the
   "APIs absent" claim is false). Replace with `proof:morphsvg-live` (the kf-side
   implementation gate).

**This is the correct P-inv-28 exit: build-in over the published substrate, not BOOK for a
7th tranche.**

---

## §4 — DL-L9: packrat / PT-2 soundness (5-tranche, P-inv-28 exit-mandate)

### Ground-truth verification — CRITICAL NUANCE

The L ledger states the packrat tier is "id-only key, unsound across offsets" and cites
`packrat.ts` as self-documenting the unsoundness (⚠27).

**Actual published state (0.9.0 dist vs source):**

The PUBLISHED `dist/parse.js` (0.9.0):
```js
const MEMO_OFFSET_BITS = 20;
const MEMO_MAX_OFFSET = (1 << MEMO_OFFSET_BITS) - 1;
// line 1224:
return parser.id << MEMO_OFFSET_BITS | state.offset & MEMO_MAX_OFFSET;
```

This is a composite `(id, offset)` key — NOT id-only. The `getCijKey` function in the
published dist IS sound in its key construction.

**However** — the source (`parse-that/typescript/src/parse/packrat.ts`) reveals the nuance:
- `getCijKey` (used for `LEFT_RECURSION_COUNTS`) IS `(id, offset)`.
- `MEMO.set(p.id, ...)` and `MEMO.get(p.id)` (the actual memo cache, lines 61/76/82/99/112/114)
  use ONLY `p.id` — they ignore the offset. The unsoundness documented in the source comment
  (lines 17-26) is real: the MEMO cache itself is keyed on parser id only; `getCijKey` is
  for the LR-count, not the memo lookup.
- The source comment: *"the MEMO is keyed on the parser id only, not (id, offset). This is
  the seed-sharing mechanism the mutual/indirect left-recursion grow relies on — and it is
  latently unsound for the non-recursive same-parser-at-two-offsets case."*

**The unsoundness is CONFINED to the opt-in LR grow path.** The `memoize()` wrapper is NOT
on the default parse path — *"a left-recursive grammar opts in by wrapping its recursive
parser with memoize() / mergeMemos()"*. The CSS value grammar (value.js's `stylesheet.ts` +
`index.ts`) does NOT call `memoize()` on any production parser — confirmed by grep:
```sh
grep -n "memoize" node_modules/@mkbabb/value.js/dist/value.js  → zero hits (the function
                                                                   is exported but unused)
```

**Practical consequence for kf:** zero. kf consumes value.js which consumes parse-that's
default (non-packrat) parse path. The unsound tier is opt-in, unused, and off the hot path
in every production consumer in the constellation.

### Is it genuinely sibling-gated?

PARTIALLY — the fix belongs in parse-that (a WDM `(id,offset)` re-key on the MEMO map itself,
not just `getCijKey`). But:

1. The defect has zero practical impact on kf today (no production consumer opts into packrat).
2. The `proof:packrat-sound` gate does not exist in `scripts/` (confirmed: `ls scripts/ |
   grep packrat → zero`). The gate is referenced in the L ledger as "gate-first BOOK" but was
   never authored.

The L ledger's exit mechanism (gate-first BOOK with P-inv-28 tripwire) requires that a born-RED
gate exist kf-side. No such gate exists. The tripwire is parse-that PT-WAVE-6 shipping the fix.

### Precept findings

- **inv ε (partial overclaim):** The L ledger states `proof:packrat-sound` "authored gate-first"
  — but the gate file does NOT exist in `scripts/`. The L FINAL.md records the ledger as
  TERMINAL, but this specific "gate-first" claim is unverified. The gate is a documented
  INTENT, not an authored artifact.
- **KISS:** With zero production consumers of the packrat opt-in tier, the PT-2 item is a
  correctness improvement with no user-visible impact. The 5-tranche P-inv-28 exit-mandate
  applies; the KILL path (declare the unsound tier permanently opt-in-and-unsupported for
  LR grammars) is architecturally honest.

### M wave proposals

**Two viable M exits (P-inv-28 demands one):**

1. **M.W-PACKRAT-KILL (the KISS path):** Declare the LR-grow packrat tier
   PERMANENTLY OPT-IN-UNSOUND for left-recursive grammars. kf and value.js NEVER call
   `memoize()`. The `proof:packrat-sound` gate is reframed: not "packrat is WDM-sound" but
   "no production kf/value.js parser opts into packrat" — a static grep that is forever-green
   (zero `memoize()` calls in the value.js grammar). This closes the P-inv-28 belt permanently
   without requiring parse-that to ship PT-WAVE-6. The KILL record: packrat soundness is
   parse-that's problem, not kf's — kf's obligation is to NEVER opt into the unsound tier.

2. **M.W-PACKRAT-CONSUME (the proper fix path):** Author `proof:packrat-sound` born-RED
   (asserts MEMO.get/set uses `(id,offset)` composite key or asserts no production consumer
   calls `memoize()`), then consume on parse-that PT-WAVE-6. This remains the textbook BOOK
   exit but requires parse-that to act. Given that NEITHER value.js NOR kf uses the packrat
   tier, option 1 is the KISS choice.

**Recommendation:** ADOPT M.W-PACKRAT-KILL unless parse-that commits to PT-WAVE-6 with a
named timeline. A 5-tranche item with zero practical impact on the production path warrants
closure via the "never opt in" invariant, not indefinite waiting for a theoretical fix.

---

## §5 — DL-L11: True-CSS-Parity Frontier

### Ground-truth verification

`proof:css-parity` gate: `ls scripts/proof-css-parity.mjs → NO SUCH FILE`. The gate is
born-RED by design (the spike recorded it as "not yet authored — the HONEST state").

The W10 CSS-parity spike (`docs/tranches/L/audit/W10-css-parity-spike.md`) is the authoritative
ground-truth record; lane-24 of this M audit already covers this in depth. Summary relevant
to the Band-B handoff analysis:

**Two genuine value.js hard-crashes (Baseline-stable CSS):**
1. CSS Nesting `& .child` → `parseCSSStylesheet` THROWS `Parse error at offset N` (not a
   silent drop; the full-consume check at `stylesheet.ts:503-510` aborts on `&`).
2. Bare `linear-gradient(red, blue)` (no direction) → `TypeError: t is not iterable` (the
   `.opt()` direction-optional path at `value.js/src/parsing/index.ts:188-205`).

Both RE-CONFIRMED by live probe at the W10 spike. Both are value.js bugs — kf cannot work
around either at the consume seam without re-implementing value.js's grammar (the
`inv-L-acyclic-purity` forbidden class).

**kf-side gate work (Band-A):** Authoring `proof:css-parity` is kf-owned work that CAN proceed
on today's 0.13.0 tree. The gate's "CSS Nesting THROW" and "bare-linear-gradient THROW" rows
are RED-by-design against 0.13.0; they green when value.js O fixes the crashes.

**The two-grammar question:** parse-that's `cssParser` is a PUBLISHED export (not dead-code
as the 36-lane audit implied). The Option B architectural path (parse-that becomes the
tokenizer layer value.js builds over) remains open but requires coordinated work across both
sibling repos. Option A (delete parse-that's `css/` module) is a breaking change to
parse-that's API surface. Neither option is kf-owned. kf waits for the sibling disposition.

### Precept findings

- **No quick-solution violation (PROGRESS.md):** DL-L11 correctly records the W10 IMPL as
  "gated on coordinated value.js-O + parse-that publish" — the gate authoring is kf-side
  Band-A work; the actual grammar cures are sibling-side.
- **inv ε:** The spike honestly corrects the audit's mis-attributions (nesting was attributed
  to value.js as a silent-drop when it is actually a THROW; url-token shredding was parse-that
  not value.js). No overclaim in the L spike document.
- `proof:css-parity` being absent from `scripts/` is consistent with the HANDOFF framing
  (the gate is a W10-IMPL artifact; W10-IMPL does not open until siblings publish). The honest
  state is that the gate exists as a CONCEPT, not a file.

### M wave proposals

**M.W10-IMPL has two separable parts:**

1. **M.W10-IMPL-GATE (Band A, kf-owned, can start NOW):**
   Author `proof:css-parity` as a born-RED node-probe capability matrix covering the confirmed
   gaps. Each row asserts a specific input either round-trips or is refused with a named
   reason. Born-RED today: CSS Nesting THROW, bare-`linear-gradient` THROW, `@container`
   opaque body, radial-gradient head corruption, `color()` serialize asymmetry. This gate
   authoring requires NO sibling publish — it just needs the right probe harness (live-probe
   value.js + parse-that installed artifacts, same as the W10 spike).

2. **M.W10-IMPL-CONSUME (Band B, sibling-gated):**
   When value.js O ships the grammar cures (VJ-O1 through VJ-O9), kf re-pins `^0.14.0` and
   the `proof:css-parity` rows green incrementally. The `linear-gradient` crash fix and the
   CSS Nesting fix are the FIRST-priority consumes (HIGH severity, Baseline-stable CSS crashes).

**The two consume-edge tripwires remain:** value.js 0.14.0 + parse-that disposition (Option
A or B) named. No kf code changes until those publish. The gate authoring (M.W10-IMPL-GATE)
is independently executable as Band-A kf work.

---

## §6 — Cross-cutting findings

### DL-L8 ledger error: the "absent API" premise is wrong

The L deferred ledger's `proof:morphsvg-consume` gate description claims the APIs are "absent
in 0.13.0." This is factually incorrect — `PathGeometry`, `getPointAtLength`, and
`getTotalLength` are exported in the published 0.13.0 surface (confirmed by grep of
`node_modules/@mkbabb/value.js/dist/value.js`). The L ledger inherited the K-era "VJ.W4
booked" framing without verifying the 0.13.0 surface against ground truth. This is the same
class of error the W10 spike corrected for nesting (silent-drop vs. THROW mis-attribution).

**The consequence:** DL-L8's nominal tripwire (value.js 0.14.0) is unnecessary. The
`fromMorphSVG` implementation can ship in M over the EXISTING 0.13.0 substrate. M must
re-frame the gate and wave accordingly.

### DL-L9 gate-first claim: the gate was not authored

The L ledger states `proof:packrat-sound` "authored gate-first" for DL-L9 (see DLL-22 row:
"Gate-first BOOK: author `proof:packrat-sound` first when the re-keyed packrat publishes").
The gate DOES NOT EXIST in `scripts/` (confirmed at `529fcfd`). The L final TERMINAL claim
rests on a gate that was never written. This is an inv-ε gap: the ledger overclaims the gate
existence. M must either author the gate or record the KILL.

### Consume-edge ordering for M

The five workaround arms (S1/S2/S7/S8/S9) fire in two sibling-publish events:

- **glass-ui 4.1.0** → fires S1 (aria-orientation) + S2 (RF-17 dock) simultaneously.
  One re-pin commit deletes both + clears S3 (peer-satisfied) if the peer range is in 4.1.0.
- **value.js 0.14.0** → fires S7 (linear() regex) + S8 (FN_NAME) + S9 (parse-that dep)
  simultaneously. One re-pin commit deletes all three + removes `@mkbabb/parse-that` from
  `package.json`.

M should plan these as two atomic re-pin events, not five separate commits.

---

## §7 — M-wave register (this lane's contributions)

| M-Wave | Band | Title | Precondition | P-inv-28 exit? |
|--------|------|-------|--------------|----------------|
| **M.W-GLASSDOCK-REPIN** | B | glass-ui 4.1.0 re-pin (S1+S2+S3) | glass-ui 4.1.0 E404→E200 | Closes DL-L6 |
| **M.W-GLASSCONTROLPOINT-EXIT** | A/B | GlassControlPoint KILL (build-in) OR consume | glass-ui BB option A named, OR kf authors `<DemoControlPoint>` | REQUIRED — closes DL-L7 (≥4-tranche) |
| **M.W-MORPHSVG** | A | `fromMorphSVG` build-in over published PathGeometry | value.js 0.13.0 (ALREADY PUBLISHED — no wait) | REQUIRED — closes DL-L8 (≥4-tranche) |
| **M.W-PACKRAT-KILL** | A | Declare packrat off-limits for production use | None (kf-owned + parse-that KILL record) | REQUIRED — closes DL-L9 (≥4-tranche) |
| **M.W10-IMPL-GATE** | A | Author `proof:css-parity` born-RED matrix | None (kf-owned gate work) | Partial (opens DL-L11 consume path) |
| **M.W-VALUEJS-REPIN** | B | value.js 0.14.0 re-pin (S7+S8+S9 + css-parity rows) | value.js 0.14.0 E404→E200 | Closes DL-L10/DL-L11 per-arm |

---

## §8 — Deferred fold candidates for M

| Item | Born | Chronicity at M | Disposition | Named tripwire |
|------|------|-----------------|-------------|----------------|
| **DL-L6 RF-17** | I | 4 (I,J,K,L→M) | HANDOFF → consume on glass-ui 4.1.0; born-RED S2 PENDING | glass-ui 4.1.0 publish |
| **DL-L7 GlassControlPoint** | E | 7 (E,F,G,H,I,J,K,L→M) | **P-inv-28 EXIT REQUIRED in M** — consume OR named KILL; re-BOOK CLOSED | glass-ui BB Option A named OR kf KILL + build-in |
| **DL-L8 MorphSVG** | C | 7 (C,F,G,H,I,J,K,L→M) | **P-inv-28 EXIT REQUIRED in M** — build-in over published PathGeometry; wait for 0.14.0 NOT required | kf ships `fromMorphSVG` over 0.13.0 |
| **DL-L9 packrat** | E | 6 (E,F,G,H,I,J,K,L→M) | **P-inv-28 EXIT REQUIRED in M** — KILL (no production opt-in invariant) OR consume on PT-WAVE-6 | kf KILL invariant OR parse-that PT-WAVE-6 |
| **DL-L11 css-parity** | K→L | 2 (K,L→M) | FOLD (gate authoring kf-side) + HANDOFF (cures sibling-gated) | value.js 0.14.0 + parse-that disposition |

---

## §9 — Evidence anchors

| Claim | File:line |
|-------|-----------|
| RF-17 interim PRESENT in demo | `demo/@/.../TransportDock.vue:15,151,196,342,348,358,361,366,373` |
| proof:workaround-deletion S2 PENDING output | `scripts/proof-workaround-deletion.mjs` (run output, 2026-06-17) |
| GlassControlPoint absent from glass-ui 4.0.0 dist | `node_modules/@mkbabb/glass-ui/dist/` (grep zero hits) |
| proof:control-point-live RED output | `scripts/proof-control-point-live.mjs` (run output, 2026-06-17) |
| PathGeometry + getPointAtLength PRESENT in value.js 0.13.0 | `node_modules/@mkbabb/value.js/dist/value.js:4958-5000` |
| fromMorphSVG ABSENT from kf | `src/animation/` (grep zero hits) |
| motion-path.ts design-decision: MorphSVG routed to value.js | `src/animation/motion-path.ts:17` |
| draw-svg.ts uses DOM getTotalLength, not value.js PathGeometry | `src/animation/draw-svg.ts:43-48,134-148` |
| packrat MEMO uses id-only key (not composite) | `parse-that/typescript/src/parse/packrat.ts:61,76,82,99,112,114` |
| packrat getCijKey uses composite (id,offset) key | `parse-that/typescript/src/parse/packrat.ts:36-38` |
| packrat self-documents unsoundness | `parse-that/typescript/src/parse/packrat.ts:17-26` |
| proof:packrat-sound ABSENT from scripts/ | `ls scripts/ \| grep packrat → zero` |
| proof:css-parity ABSENT from scripts/ | `ls scripts/ \| grep css-parity → zero` |
| CSS Nesting THROW confirmed | `W10-css-parity-spike.md §1 row 1` + live probe |
| bare linear-gradient THROW confirmed | `W10-css-parity-spike.md §1 row 8` + live probe |
| parse-that cssParser published (NOT dead-code) | `W10-css-parity-spike.md §2.1` |
| L ledger DL-L8 absent-API premise | `docs/tranches/L/audit/deferred-ledger-L.md DLL-21` |
| L ledger DL-L9 gate-first claim | `docs/tranches/L/audit/deferred-ledger-L.md DLL-22` |
| glass-ui peer cycle LIVE | `node_modules/@mkbabb/glass-ui/package.json` peerDependencies |
| glass-ui version 4.0.0 | `node_modules/@mkbabb/glass-ui/package.json` |
| value.js version 0.13.0 | `node_modules/@mkbabb/value.js/package.json` |
| parse-that version 0.9.0 | npm show result |
