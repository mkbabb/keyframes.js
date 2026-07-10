# U.F — CONSTELLATION COVENANTS

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Charter sentence (U.md §2).** Convert every external dependency edge from a
> vacuously-green tripwire into a deadlined covenant: transpose the whole HEAVY
> value.js consume edge onto value.js 3.1.0's granular subpath taxonomy (all 42
> HEAVY files, `internal/leaves.ts:28`'s `/math` re-export as the reference idiom);
> DRAFT `KF-TO-VALUEJS-U.md` (subpath+boxing+`@function`+`PathGeometry` contract
> freeze, the unified `parseTimingFunction` ask, the KF-7 rename renewal, the
> plain-vars binary decision, the pin posture) — consume-edge ONLY, the sibling
> tranche is active; re-target the glass-ui consume edge to glass-ui **5.0.0** (OD-U4
> — the pin moves on its publish, the planned joint BG+BH cut), re-probe the five caps
> against the 5.0.0 dist, re-architect the tripwire to probe `dist-tags.latest` (the
> vacuous-green cure), and issue ONE consolidated BG/BH letter reconciled against what
> 5.0.0 actually ships with absorb-or-expire deadlines; certify parse-that clean in one
> line and excise the dead REALM-CONVERGENCE machinery.
>
> **Provenance lanes:** 27 (constellation-valuejs-edge — F1 megabarrel→subpath,
> F2 the `getTimingFunction` grammar shard, F3 the plain-vars boxing adapter, F4
> the vacuous deps floor, F5 stale 1.2.0-bug provenance, F6 the demo edge, F7 the
> caret-vs-active-sibling pin), 28 (constellation-parsethat-glassui — A1–A4
> parse-that clean + the dead realm machinery, B1–B7 the glass-ui tilde blind spot +
> the letter set + the stale narration).
>
> **Ring-fences that bind this band (charter §4).** (1) **value.js internals are
> OFF-LIMITS — the HARD fence.** value.js's own tranche is active in its own session;
> every upstream fix this band names (`parseTimingFunction`, authored-plain
> unflatten, the `PARSE_ERROR` producer, the KF-7 rename, the WAAPI unit grouping) is
> an ASK routed through `KF-TO-VALUEJS-U.md` — **never a parallel kf-side arm of an
> upstream fix.** Same for glass-ui: kf re-pins and re-probes; kf does not patch
> glass-ui in the demo (MEMORY: all glass-ui changes go in the glass-ui repo). (5)
> The two package "in"s (`.` + `./engine`) are unchanged — the subpath transposition
> is an INTERNAL import-granularity move; not one published symbol shifts. (2) The
> LIGHT/HEAVY boundary is preserved — the subpath edge stays entirely on the HEAVY
> surface (physics/orchestration remain value.js-free; `internal/leaves.ts`'s `/math`
> leaf is the sole LIGHT-tier value.js re-export and it stays).

---

## The load-bearing conclusion (why this band exists)

Four external edges, each verified on the live tree (`tranche-u-dev`, 5.2.0), each a
covenant the current apparatus green-lights while it drifts:

1. **The value.js edge is stuck at the pre-2.x megabarrel** (lane 27 F1, verified).
   **42** HEAVY files import the bare `@mkbabb/value.js` `.` root barrel; exactly
   **1** file (`internal/leaves.ts:28`) uses a subpath (`/math`). value.js 3.1.0
   publishes **8** code-split subpaths — `. ./color ./easing ./parsing ./transform
   ./units ./math ./quantize` (verified: `node_modules/@mkbabb/value.js/package.json`
   `exports`) — a taxonomy that maps almost one-to-one onto kf's zone symbol
   clusters, and kf consumes NONE of it but the one `/math` leaf. Every lazy HEAVY
   chunk that touches value.js pulls the whole root graph (which re-exports the
   grammar/parse-that tier) even when it needs only `COMPUTED_UNITS`
   (`waapi/eligibility.ts`) or `PathGeometry` (`svg/morph-*`). Root-barrel
   tree-shaking is a *hope*; a subpath import is a *guarantee* — this is the
   colocation edict applied to the dependency graph, and it is the performance edict
   on the chunk boundary.

2. **kf holds a shard of value.js's own timing-function grammar** (lane 27 F2).
   `compile/easing-registry.ts:12-19` bare-imports six easing leaf-parsers from the
   root barrel and then `getTimingFunction` hand-rolls the *combinator* that decides
   which parser a string needs (a `cubic-bezier(...)` regex + `steps(`/`linear(`
   prefix guards + four try/catch dispatch arms) — the exact cross-realm grammar
   duplication CLAUDE.md records value.js already internalized once (`parseCSSSubValue`).
   It drifts the moment value.js's `linear()`/step vocabulary grows.

3. **The transform-seam boxing adapter is naturalized as a permanent "contract"**
   (lane 27 F3). `compile/plain-vars.ts` (verified head: *"Under value.js ≥ 2.0.1 a
   frame's `vars` delivers array-boxed internal leaves… `typeof vars.rotation.x ===
   'object'`… arithmetic yields NaN"*) runs a whole per-frame nested-plain projection
   on BOTH hottest loops (`engine/interpolate.ts`, `group/compositor.ts`) solely to
   undo a value.js representation choice — yet, unlike the linear()-normalize fold
   (tracked as `proof:workaround-deletion` arm S7), it carries NO deletion-lifecycle
   arm, so it can accrete as permanent hot-path dead weight — a NO-LEGACY violation
   waiting to happen. U must force the binary: ratify numbers-out as kf-owned API OR
   charter its deletion against a value.js authored-plain unflatten.

4. **The constellation edges drift vacuously green** (lane 28 B2, verified).
   glass-ui shipped **4.1.0 + 4.2.0** (registry latest = 4.2.0) while kf's `~4.0.0`
   tilde freezes the installed tree at **4.0.1** — and the ENTIRE self-justifying-carry
   killer (`scripts/lib/glass-caps.mjs:24-56`, `proof:glass-ui-gap-tripwire`,
   `proof:workaround-deletion`) content-probes ONLY the *installed* 4.0.1 dist
   (verified: `distFile` reads `node_modules/@mkbabb/glass-ui/dist`, no
   `dist-tags.latest` read anywhere). A BG/BH cure landing in a minor the tilde cannot
   reach stays invisible forever; no gate blocks the drift (`proof:deps-current` is a
   floor check that skips optional siblings; `pin-ledger` registry cross-check is
   observe-only). And `proof:deps-current.mjs` still carries a 90-line dead
   REALM-CONVERGENCE apparatus (`:237-329`) reasoning about a two-parse-that-realm
   world kf left at Q — its floor still lists `value.js 0.13.0` / `parse-that 0.9.0`
   (verified `:72-73`), a version 12 majors stale that would green-light a resolver
   that breaks kf outright.

   **OD-U4 (2026-07-10) resolves the pin question entirely — the edge re-targets to
   glass-ui 5.0.0.** Not tilde-vs-caret within 4.x: the consume edge moves to
   glass-ui **5.0.0**, the planned joint BG+BH cut (audit §3 — no 5.0.0 tag/branch
   yet; 5.0.0 is where BG + BH land together). The break is exactly: **`./api`
   dropped + 203 symbols re-homed to per-component subpaths (200 pure path-swaps + 3
   orphans gaining an export) + one rename `goo-blob → blob`**; glass-ui 5.0.0 bumps
   its own kf peer to **`^5.1.0`** (compatible with kf 5.3, OD-U8). The pin moves on
   the 5.0.0 publish; the five caps + the consolidated letter re-probe / reconcile
   against the 5.0.0 dist; the tilde→caret-within-4.x machinery is SUPERSEDED.

parse-that is the clean edge: transitive-only via value.js 3.1.0 → parse-that
`^1.0.0` (registry latest 1.0.0), zero `src/` specifiers, the cross-realm cast
structurally impossible — nothing owed but a one-line certified-clean record and the
excision of the machinery that narrates the closed question (lane 28 A1–A4).

---

## Wave index

| id | title | size | oracle (existing mechanism — no new standalone gate) | lanes |
|---|---|---|---|---|
| **U.F1** | **THE value.js SUBPATH TRANSPOSITION — 42 HEAVY files onto the taxonomy** · KEYSTONE | L | `proof:boundary` (re-armed with a subpath-granularity clause) + `bench`/chunk-graph (parse-that severed from non-parsing chunks) + vitest (HEAVY behavior unchanged) | 27 F1/F5 |
| **U.F2** | The demo subpath transposition — 23 `demo/**` files onto the same contract | M | `proof:boundary` subpath clause extended to `demo/` + the demo builds green | 27 F6 |
| **U.F3** | **DRAFT `KF-TO-VALUEJS-U.md`** — the coordination letter (the deliverable) | M | the letter file exists + is complete (contract freeze / `parseTimingFunction` / authored-plain / KF-7 / pin) — a docs deliverable, owner-observable | 27 F2/F3/F5/F7; 28 B7 |
| **U.F4** | The kf-side dispositions: plain-vars binary decision + `getTimingFunction` dispatcher BOOK'd as deadlined covenants | S | `proof:workaround-deletion` arms (keyed on the value.js API's presence) — net-neutral vs. the retired S7 arm | 27 F2/F3 |
| **U.F5** | **THE glass-ui 5.0.0 RE-TARGET (OD-U4) + fetched-dist re-probe + tripwire re-architecture** · KEYSTONE (glass-ui) | M | `proof:glass-ui-gap-tripwire` re-architected to `dist-tags.latest` (same gate, coupled probe) + `proof:workaround-deletion` arms retired for any 5.0.0-shipped cure; the pin moves to 5.0.0 on its publish | 28 B2/B3/B5 |
| **U.F6** | **DRAFT the ONE consolidated BG/BH letter** (`KF-TO-GLASSUI-U.md`) reconciled against what 5.0.0 ships + stale-narration refresh + MEMORY re-pin | M | the letter file exists + carries absorb-or-expire deadlines reconciled against 5.0.0; the pin snapshots DERIVE from `package.json` | 28 B4/B6 |
| **U.F7** | `proof:deps-current` currency truth — value.js floor 0.13→3.1, excise REALM-CONVERGENCE, glass-ui drift assertion, parse-that certified-clean one-liner | S | `proof:deps-current` (re-armed — the floor now bites; drift is caught; realm reduced to one line) | 27 F4; 28 A3/A4 |

**Sequencing (band-internal DAG, charter §3 "letters early — upstream latency").**

```
U.F3 (value.js letter)  ── DAY 1 (upstream latency; the asks freeze the contract F1 consumes)
U.F6 (glass-ui letter)  ── DAY 1 (parallel; the absorb-or-expire clock starts at issue)
        │
U.F1 (value.js subpath transposition) ──┬── consumes F3's frozen subpath contract (A.1)
                                        └──> U.F2 (demo edge — SAME contract, co-sched U.B)
U.F4 (plain-vars + dispatcher dispositions) ── rides F3's asks B/C; the tripwire arms
U.F5 (glass-ui 5.0.0 re-target + re-probe + tripwire) ── independent; feeds F6's negative/positive record
U.F7 (deps-current currency) ── ONE pass with U.A's CI trim (same path-pinned gate file)
```

Keystones: **the two letters go out DAY 1** (charter §3 — upstream latency is the
gating cost; the asks must be in value.js's/glass-ui's hands before their sibling
tranches close). **U.F3 before U.F1** — the subpath contract A.1 is what F1 transposes
onto; freeze it in the letter, then move the 42 files against a stated contract, never
against a guess. **U.F5 before U.F6** — the fetched-dist re-probe produces the
positive-or-negative record the consolidated letter cites. **U.F7 rides U.A** — the
value.js floor advance, the parse-that FLOOR/realm excision, and the glass-ui drift
assertion all edit the ONE gate file `proof-deps-current.mjs`; per charter §3 the CI
trim and the constellation currency touch it in ONE coordinated pass, never two.

---

## The waves

### U.F1 — THE value.js SUBPATH TRANSPOSITION: 42 HEAVY files onto the taxonomy · **KEYSTONE**

- **Substance (lane 27 F1).** Ratify value.js 3.1.0's subpath taxonomy as *the*
  kf↔value.js consume contract and transpose the entire HEAVY edge onto it in one
  systematic pass, extending the blessed `internal/leaves.ts:28` `/math` precedent
  (the ONE existing subpath user — a thin gate-verified re-export, the reference
  idiom, lane 15 F8) to all 42 HEAVY files. The transposition is mechanical once the
  contract is frozen (U.F3 §A.1), mapping each consumer to the narrowest subpath that
  exports its symbols (the full inventory is lane 27 §"Full HEAVY import inventory"):
  - `compile/easing-registry.ts:12-19`, `presets/classic.ts:9` → **`./easing`**
    (`CSSCubicBezier, cssLinear, parseLinearStops, parseSteps, steppedEase,
    timingFunctions`).
  - `compile/backward/backward-color.ts:25`, the `defaults.ts:13` colour arm →
    **`./color`** (`Color, COLOR_SPACE_RANGES, deltaEOK, normalizeColorUnit,
    sampleColorRamp, isColorUnit`) + **`./math`** for `scale`.
  - `waapi/eligibility.ts:1` → **`./units`** (`COMPUTED_UNITS`).
  - `svg/morph-geometry.ts:18`, `svg/morph-svg.ts:45` → **`./transform`** (`PathGeometry`).
  - the value-model/grammar tier — `compile/{parse-flatten,adapter,selector,
    frame-compiler}.ts`, `compile/backward/*`, `resolve/*.ts`, `scroll/*.ts`,
    `group/{soa,compositor}.ts`, `engine/**`, `waapi/emission.ts` → **`./parsing`**
    (`ValueUnit, flattenObject, parseCSSSubValue, …`) + **`./math`** (`clamp, lerp,
    lerpArray, lerpValue, scale`) + the two root helpers (`sleep`, `parseCSSTime`) that
    stay on `.` (verify their subpath home at transposition time — if 3.1.0 leaves them
    root-only, that residual `.` import is legitimate and the gate allowlists it).
- **The gate (lane 27 F1, anti-sprawl-respecting home).** The brief names a
  `proof:valuejs-subpath` gate "sibling to `proof:boundary`." Per U.A's anti-sprawl
  covenant (a new standalone `proof-*.mjs` requires owner sign-off; new enforcement
  folds into a surviving mechanism), its idiomatic home is a **CLAUSE of
  `proof:boundary`** — the surviving gate that already walks the value.js edge
  file-by-file inside `proof:publish`. The clause REDs any bare-`.`-barrel import of a
  symbol that a narrower subpath exports (a static grep of the import specifiers
  against the 3.1.0 `exports` map). This keeps net gate count FLAT (a clause, not a
  new key) and makes the megabarrel un-regressable. If the owner prefers a standalone
  sibling, it is an owner-signed exception — but the folded clause is the covenant-honest
  cure.
- **Folds in the stale 1.2.0-bug comment purge (lane 27 F5).** Three files whose
  imports this wave rewrites — `resolve/env.ts:55`, `compile/adapter.ts:58`,
  `resolve/core.ts:82` — still narrate a *"value.js 1.2.0 bug"* as if live, while
  `resolve-function.ts:22-28` records it fixed at 2.0.x with the recovery apparatus
  DELETED. Purge the historic-bug provenance in the SAME motion the import line is
  edited (retain the version-agnostic `CUSTOM_FN_ARG_DROP` fail-explicit rationale).
  The wholesale tranche-tag archaeology is U.E's charter; this cures only the comments
  in the files F1 already opens.
- **Size.** L. **HEAVY — HARD constraint** (ring-fence 2): the transposition stays
  entirely on the HEAVY surface; `internal/leaves.ts`'s `/math` LIGHT leaf is
  unchanged; `proof:boundary` proves no LIGHT file gains a value.js specifier.
- **Oracle.** `proof:boundary` re-armed with the subpath clause (the megabarrel import
  of a subpath-exported symbol REDs); the reachability witness (U.D's `proof:publish`
  post-build clause / `bench`, OD-U11 — no standalone `proof:chunk-graph`) proves
  parse-that is SEVERED from the chunks that never parse (the
  `easing`/`units`/`transform` splits carry 0 packrat markers after the move — lane 27
  measured the subpath dists at 0 markers today); vitest proves the HEAVY behavior is
  byte-identical (a pure import-source move — the runtime symbols are the same).
- **Edges.** → **U.F3** (consumes the frozen §A.1 subpath contract — freeze BEFORE
  moving 42 files), → **U.F2** (the demo edge applies the SAME contract), ↔ **U.D**
  (the chunk-graph gate that measures the parse-that severance is U.D's; this wave is
  its subject), → **U.A** (the `proof:boundary` clause re-arm is co-scheduled with the
  CI trim — ONE path-pinned pass). ↔ **U.C** (C's carves and F1's import rewrites both
  touch the compile/engine files — sequence so the two edits do not collide; F1 rides
  AFTER C's directory carves settle where they overlap, since a subpath import
  re-points trivially but a moved file re-points twice).

### U.F2 — The demo subpath transposition: 23 `demo/**` files onto the same contract

- **Substance (lane 27 F6).** The demo consume edge bare-imports the same megabarrel:
  **23** `demo/**` files (verified `grep -rl 'from "@mkbabb/value.js"' demo`), e.g.
  `TimingFunctionPanel.vue:51` (`CSSCubicBezier, bezierPresets` → `./easing`),
  `animationOptionsStore.ts:1` (`jumpTerms` → `./easing`),
  `matrix-editor/transformMath.ts:1` (`FunctionValue, ValueUnit` → `./parsing`),
  `orbital-drag/quaternionEuler.ts:1` (`clamp` → `./math`), `EasingTarget.vue:119`
  (`cubicBezierToString, stepEnd, stepStart, steppedEase` → `./easing`). Vite
  tree-shakes the app bundle so the per-chunk perf stake is lower than the library's,
  but the grand recursive-colocation edict names ALL directories and the
  consume-granularity principle is uniform — one contract, both surfaces.
- **Substance.** Apply F1's subpath mapping to the demo edge in the SAME contract;
  extend the `proof:boundary` subpath clause's file set to `demo/` so the app edge
  matches the library edge and cannot regress.
- **Size.** M. **Co-scheduled with U.B** — the demo scenes/`@`/`app` files are already
  in U.B's restructuring scope (the `demo/@/`→`demo/shared/` move + per-area
  colocation); the subpath re-point rides WITH U.B's file moves so each import
  re-points ONCE, never twice (charter §3 keystone: `custom/` dissolution + `@→shared`
  FIRST so every subsequent import/gate re-points once).
- **Oracle.** the `proof:boundary` subpath clause extended to `demo/`; the demo builds
  green (`npm run gh-pages`) with the app bundle's value.js reach narrowed.
- **Edges.** → **U.F1** (same contract, library-first), ↔ **U.B** (rides the demo file
  moves — never a second re-point pass).

### U.F3 — DRAFT `KF-TO-VALUEJS-U.md`: the coordination letter (the deliverable)

- **Substance.** The letter IS this wave's deliverable — the full drafted text below,
  written to `docs/tranches/U/KF-TO-VALUEJS-U.md` at impl. It supersedes the T-era
  `docs/tranches/T/KF-TO-VALUEJS-T.md` (whose pin snapshot is stale — lane 28 B6). It
  freezes the consume-edge contract kf now depends on, files the two new asks
  (`parseTimingFunction`, authored-plain unflatten), renews KF-7, and states the pin
  posture. **Consume-edge ONLY** (ring-fence 1): every ask is a request to value.js's
  active tranche, never a kf-side parallel arm.
- **Size.** M. **Deliverable = the letter** (docs; owner-observable). **DAY 1** —
  upstream latency gates the whole band.
- **Oracle.** the file exists and is complete against the five sections below; the
  `proof:deps-current` floor (U.F7) and the F1 subpath clause reference the contract
  §A.1 freezes. No gate authors the letter; its completeness is owner-observed.
- **Edges.** → **U.F1** (§A.1 is F1's contract), → **U.F4** (§B/§C are F4's BOOK'd
  covenants), → **U.F7** (§D's floor discipline drives the deps-current advance),
  ↔ **U.C10** (the `PARSE_ERROR` diagnostics producer + the WAAPI unit grouping asks
  are C10's BOOK'd rows — they join §B of this letter; ONE letter, not two).

**THE DRAFTED LETTER TEXT** (`KF-TO-VALUEJS-U.md`):

> **From:** keyframes.js Tranche U (the consume-edge charter). **To:** value.js
> (tranche IN ACTIVE DEVELOPMENT, its own session). **Pin:** kf pins
> `@mkbabb/value.js ^3.1.0`; installed 3.1.0. **Scope:** kf charters ONLY its consume
> edge — no value.js-internal work is requested, authorized, or performed from kf's
> side. Every "ask" below is a request to value.js's tranche; kf builds NO parallel
> arm.
>
> **§A — The consume-edge contract kf now depends on (FREEZE these; a break breaks
> kf's HEAVY surface):**
> 1. **The subpath taxonomy** `. ./color ./easing ./parsing ./transform ./units
>    ./math ./quantize` is now a load-bearing kf API. kf transposes its whole HEAVY
>    edge onto it (42 files, U.F1). ASKS: (a) keep these subpaths stable and their
>    symbol membership ADDITIVE (a removed/renamed export is a kf HEAVY-surface break);
>    (b) keep `./easing ./color ./units ./transform ./math` **parse-that-free** — they
>    are today (0 packrat markers in each subpath dist, measured) and that is precisely
>    what lets kf sever the grammar tier from its non-parsing lazy chunks. Publish a
>    subpath-taxonomy stability guarantee so kf can advance its `proof:deps-current`
>    floor to the true correctness minimum.
> 2. **`ValueUnit` leaf boxing at the unflatten seam** (≥2.0.1): a unitless number
>    authored `rotation.x: 1.5` arrives as a one-element `ValueUnit[]`. kf's
>    `compile/plain-vars.ts` projection adapts to it on both hot paths. kf needs a
>    DECISION here — see §C.
> 3. The 2.0.x **`@function` param grammar fix** (`CustomFunctionParameter.name/syntax/
>    default`) is CONSUMED and kf's recovery apparatus DELETED
>    (`resolve-function.ts:22-28`) — do not regress it.
> 4. **`ValueUnit.fnName` clone-preserved provenance** (VJ-Q4, `parse-flatten.ts:30-35`)
>    — keep.
> 5. **`PathGeometry`** (`./transform`) is the ONE geometry edge morph needs — keep its
>    `sampleAtLength`/polyline surface stable (`svg/morph-geometry.ts`).
>
> **§B — NEW ask: a unified timing-function parser (retires kf-side grammar
> duplication, U.F2-of-lane-27 F2).** Provide `parseTimingFunction(input: string):
> TimingFunction | Easing | undefined` on `./easing` that internalizes the full
> dispatch (bezier / `steps(` / `step-start`|`step-end` keywords / `linear()` /
> registry name), throwing-free (returns `undefined` on unrecognized) — mirroring the
> `parseCSSSubValue` internalization CLAUDE.md already records. On landing, kf deletes
> its `CUBIC_BEZIER_LITERAL` regex, the `STEPS_PREFIX`/`LINEAR_PAREN_PREFIX` guards,
> and the four try/catch dispatch arms in `easing-registry.ts`; `getTimingFunction`
> collapses to a thin normalize over value.js's result. NO kf-side re-implementation
> survives.
>
> **§C — NEW ask (decision-gated): authored-plain unflatten (retires
> `plain-vars.ts`).** Offer an `unflattenObject` variant (or option) that yields
> **authored-plain values** — a bare `number` where the author wrote a unitless
> number, a string where a unit/colour demands one — instead of array-boxed
> `ValueUnit[]` leaves. This lets kf delete its entire per-frame plain projection on
> both hottest loops (`interpolate.ts`, `compositor.ts`). If value.js DECLINES (boxing
> is intentional for value.js's own reasons), say so explicitly — kf will then RATIFY
> numbers-out as a permanent kf-owned public contract and stop tracking it as
> consume-edge debt (U.F4's binary decision).
>
> **§D — Diagnostics + unit-taxonomy asks (from U.C10, folded into this ONE letter):**
> (a) a diagnostics-returning parse — an `onParseError`-accepting `parseCSSStylesheet`
> or a `{ ast, diagnostics }` return — so kf's `validate.parseable` contract can
> reflect real parse failure (kf has EXCISED the un-fireable `PARSE_ERROR` scaffold
> now; the honest channel awaits this producer). (b) a semantic
> viewport/container-length-unit grouping on `./units` (`VIEWPORT_LENGTH_UNITS` +
> `CONTAINER_LENGTH_UNITS`, or `isLayoutTrackingUnit(unit)`) so kf's WAAPI eligibility
> guard derives from the model instead of the hand-enumerated
> `WAAPI_INELIGIBLE_UNITS` literal.
>
> **§E — KF-7 rename RENEWAL (born-RED tripwire, still live).** value.js exports a type
> `PropertyDescriptor` that collides with the DOM lib global; kf imports it as
> `PropertyDescriptor as PropertyDescriptor_2` (surfacing in `dist/keyframes.d.ts`).
> `proof:no-collision-rename` is a born-RED tripwire discharged only by a value.js
> rename to a collision-free name (`CSSPropertyDescriptor`). RENEW the ask; kf
> re-points on the publish.
>
> **§F — Version discipline (the pin posture).** kf moves its value.js pin as a
> WITNESSED consume at value.js's deliberate U-tranche cut — not a silent caret float.
> value.js's tranche is ACTIVE and value.js has shipped breaking majors before (2.0.0
> — the boxing/`@function` seam kf adapts to), so during the active sibling tranche kf
> holds a **TILDE** pin (matching the glass-ui discipline: witness each minor as a
> consume) and advances it deliberately at each value.js cut. value.js: please TAG the
> U-tranche cut so kf can pin to it and advance its floor to the true minimum.
>
> **§G — Non-asks (explicitly out of scope).** kf charters NO value.js-internal
> refactor, NO grammar change beyond §B/§C/§D, NO parse-that work (parse-that is
> value.js's transitive concern; kf has no direct edge — confirmed clean).
>
> **§H — A courtesy FLAG (not an ask, not kf work).** value.js's own demo carries the
> SAME vestigial `demo/@/` shadcn-scaffold directory kf is dissolving in U (OD-U2 — the
> `@/` is a shadcn ALIAS materialized as a real dir; glass-ui has none, only a 3-plane
> `@glass` alias). Flagged for value.js's ACTIVE tranche to consider dissolving its twin
> (hoist `demo/@/`'s children to `demo/{components,composables,…}/`, alias spellings
> unchanged, 3-plane declaration) for constellation homogeneity — a NOTE, NOT a kf
> deliverable and NOT a consume-edge ask.

### U.F4 — The kf-side dispositions: plain-vars binary decision + `getTimingFunction` BOOK'd as deadlined covenants

- **Substance — the plain-vars binary decision (lane 27 F3).** U was chartered to FORCE
  the binary the "contract" framing dodges. Two paths, ONE chosen at this wave:
  - **(a) RATIFY numbers-out** as the permanent, desirable public transform contract —
    document `plain-vars.ts`'s projection as kf-OWNED API (the "animate any object"
    seam hands consumers authored-plain shapes, by design), DELETE the "≥2.0.1 boxing"
    value.js-provenance framing from the file head, and STOP tracking it as
    consume-edge debt; OR
  - **(b) charter its DELETION** against the §C authored-plain unflatten ask — enter a
    `proof:workaround-deletion` arm keyed on the new value.js API's presence; on
    landing, kf deletes `plain-vars.ts` and both hot-path branches
    (`interpolate.ts:293-307`, `compositor.ts:24,169-180`).
  - **Recommendation (lane 27):** (b) — the projection is value.js-representation debt
    and the deletion ledger is the exact mechanism U inherited to retire it. But this
    is an owner-decision-worthy call (a hot-path shape on the headline seam); route the
    ratify-vs-delete choice to the owner if (b)'s upstream latency is unacceptable, in
    which case (a) is the honest fallback (a tracked "contract" that stops LYING it is a
    workaround).
- **Substance — the `getTimingFunction` dispatcher (lane 27 F2).** BOOK the dispatcher
  deletion as a deadlined covenant keyed on §B's `parseTimingFunction`: a
  `proof:workaround-deletion` arm that flips the moment value.js's `./easing` exports
  `parseTimingFunction`, at which point kf deletes the regex + guards + four try/catch
  arms. Until then the dispatcher is a BOOK'd tripwire (a deadlined external covenant,
  NOT a manufactured copy), NOT permanent legacy.
- **The covenant discipline.** BOTH dispositions enter the `proof:workaround-deletion`
  ledger as arms keyed on the value.js API's presence — matching the retired S7
  linear()-normalize arm's lifecycle exactly. Neither is a vacuous tripwire: each has a
  named upstream producer (§B/§C) and a deadline (value.js's U-tranche cut). Net gate
  count is FLAT (arms on an existing gate; the S7 arm already retired, so the arm count
  does not rise beyond the retired slot).
- **Size.** S. **HEAVY** (compile). **Depends U.F3** (the §B/§C asks the arms are keyed
  on).
- **Oracle.** `proof:workaround-deletion` — the two arms are PENDING (correctly, until
  value.js ships) with named producers; if path (a) is chosen for plain-vars, its arm
  is instead RETIRED-by-ratification (the framing purged, no arm) and only the
  dispatcher arm remains.
- **Edges.** → **U.F3** (the asks), ↔ **U.C10** (both touch the value.js consume-edge
  workaround ledger — coordinate the arm set), → **U.F5** (the glass-ui
  workaround-deletion arms are re-probed in the same gate — one coherent ledger pass).

### U.F5 — THE glass-ui 5.0.0 RE-TARGET (OD-U4) + fetched-dist re-probe + tripwire re-architecture · **KEYSTONE (glass-ui)**

- **Substance — the glass-ui 5.0.0 re-target (OD-U4 RULED, audit §3).** The owner
  ruled the consume edge onto glass-ui **5.0.0** ("Glass-ui has a forthcoming 5.0.0
  release. We use this") — this SUPERSEDES the tilde-vs-caret-within-4.x question
  entirely. 5.0.0 is the planned joint **BG + BH** cut (audit §3 — no 5.0.0 tag/branch
  yet; `docs/tranches/BH/PLAN.md` plans it). The consumer break is EXACTLY: **`./api`
  dropped + 203 symbols re-homed to per-component subpaths** (200 pure path-swaps + 3
  orphans gaining an export — `Surface→/card`, `MenuItemVariants→/command`,
  `ControlSize→/forms`) **+ one rename `goo-blob → blob`**. glass-ui 5.0.0 bumps its
  OWN kf peer to **`^5.1.0`** (compatible with kf 5.3, OD-U8) — the two majors line up.
  kf moves its glass-ui pin to `^5.0.0` (or the exact cut) ON the 5.0.0 publish, a
  WITNESSED consume; the re-pin is staged behind the publish + owner confirm.
- **Substance — the fetched-dist re-probe against 5.0.0 (lane 28 B2, ask 1).** On the
  5.0.0 publish, FETCH the 5.0.0 dist (a `pack`/registry-tarball read) and re-probe the
  five `glassCaps` caps (`ariaGuard`, `dockStrandKeepalive`, `dockDropdownPointerdown`,
  `dockDismissHold`, `drawerDetentInset`) against IT — NOT the frozen installed 4.0.1,
  and NOT the interim 4.1/4.2 minors (which 5.0.0 subsumes). Determine which BG/BH cures
  5.0.0 actually SHIPPED. For each cure found: adopt the 5.0.0 surface the consume edge
  now imports through and DELETE the stranded `proof:workaround-deletion` arm + the demo
  band-aid it guards (net gate DOWN). For each still absent in 5.0.0: record the NEGATIVE
  with fetched-dist evidence (a distinguishable state from "unpublished") in the letter
  (U.F6).
- **Substance — adopt the 5.0.0 per-component subpath idiom (audit §3/§4).** Where
  glass-ui 5.0.0's per-component subpath exports (`./button`, `./drawer`, `./easing`,
  …) let the demo import a leaf directly instead of the root barrel, ADOPT them WHERE it
  slims the demo graph (the same subpath-consume discipline U.F1/U.F2 apply to value.js
  — one contract, both siblings). Consume-edge ONLY (the demo's import granularity),
  never a glass-ui patch.
- **Substance — the tripwire re-architecture (lane 28 B2, ask 2 — the vacuous-green
  cure).** Re-architect `scripts/lib/glass-caps.mjs` so the cap probe runs against a
  **fetched `dist-tags.latest` glass-ui dist** (a registry-tarball read), not the
  installed `node_modules` dist (`glass-caps.mjs:24-56` `distFile`/
  `installedGlassUiVersion` today read `node_modules/@mkbabb/glass-ui/dist`). A cure
  landing in ANY reachable published minor then ARMS the tripwire. Give each
  `demo/glass-ui-gaps.ts` entry a **concrete `fixVersion`** (today all abstract
  "@mkbabb/glass-ui BG/BH …" — verified `glass-ui-gaps.ts:64,77,90`; now pinned to the
  5.0.0 cut) the probe compares against both `installedGlassUiVersion()` AND
  `dist-tags.latest`, so "cure expected in 5.0.0 but latest is still 4.2.0
  (unpublished)" vs "shipped in 5.0.0" is DISTINGUISHABLE from "unpublished." Also
  retarget `proof-workaround-deletion.mjs`'s hard-coded `"4.1.0"` sentinels
  (`:263,:282,:303,:324`) to the fetched-latest content probe so the sentinel (registry
  existence) and the content probe (dist grep) STOP being decoupled.
- **Size.** M. **Ring-fence 1** — kf re-pins and re-probes ONLY; no glass-ui patch in
  the demo (MEMORY: all glass-ui changes go in the glass-ui repo). This wave changes
  kf's pin and kf's probe mechanism, nothing upstream.
- **Oracle.** `proof:glass-ui-gap-tripwire` re-architected — same gate, now probing
  `dist-tags.latest` (the mechanism change is net-neutral on gate count; the vacuous
  green is CURED); `proof:workaround-deletion` arms RETIRED for any 5.0.0-shipped cure
  (net DOWN). A one-shot witness: a cap cure present in the fetched 5.0.0 dist but absent
  in installed 4.0.1 now ARMS the tripwire (proving the blind spot is closed).
- **Edges.** → **U.F6** (the positive/negative re-probe record is the letter's cited
  evidence), → **U.F7** (the glass-ui drift assertion in `deps-current` complements the
  re-architected tripwire), ↔ **U.F4** (shared `proof:workaround-deletion` ledger — one
  coherent pass over both siblings' arms), ↔ **OD-U4** (RULED — the 5.0.0 re-target; the
  re-pin is staged behind the 5.0.0 publish + owner confirm).

### U.F6 — DRAFT the ONE consolidated BG/BH letter + stale-narration refresh + MEMORY re-pin

- **Substance — the consolidated letter (lane 28 B4, ask 8).** DRAFT ONE consolidated
  BG/BH letter (`docs/tranches/U/KF-TO-GLASSUI-U.md`) superseding the T-era
  `KF-TO-GLASSUI-BG.md` (482 lines, §0 roster + §FORWARDING). It carries the full
  expectation set with **hard kf-side postures — absorb-or-expire deadlines** on each
  ask (a cure absorbed by a re-pin, or the ask expires and kf ratifies its own posture).
  **Each ask is RECONCILED against what glass-ui 5.0.0 actually ships (OD-U4, U.F5's
  re-probe):** a cure 5.0.0 absorbs is recorded ABSORBED (its arm retired on the re-pin);
  only the still-absent asks carry a deadline forward.
  - **BG-5** (static-backdrop blur mode — the dominant systemic perf killer, morph
    33→116fps; kf acceptance gate `proof:blur-not-resampled`; owner-visible VERDICT #19).
  - **BG-11** (detented Drawer bottom-reserve token `--drawer-inset-block-end` + max-detent
    cap — now URGENT: the T.H3 owner override ADOPTED `<Drawer mode="live-behind">` so the
    live sheet rides OVER the bottom menubar at any detent; the `drawerDetentInset` arm is
    the ADOPT-posture tripwire).
  - **GU-1** (dock rest-crisp) + **GU-2** (width-morph continuity) — render defects, gates
    `proof:dock-rest-crisp`/`proof:dock-morph-continuity` born-RED consumer-side.
  - **The dock z-inversion** — a T.H3 Drawer-adoption finding, measured and FORWARDED
    (`proof:dock-zorder` live browser gate, stage<sheet<dock); keep it in the re-issued
    letter (a forward, not kf-side residue).
  - **§FORWARDING 6a–6e** (BG-11 URGENT; forceMount/peek; the dock-mutex orphan;
    live-behind focus/scroll doc; fling-velocity tunability) + **BG-6..8/BG-10/BG-12** (docs /
    additive / catalogue asks) — ride the letter (BG-9 pulled out — discharged kf-side, below).
  - **BG-9** (the EasingPicker write-through gap) — DISCHARGED KF-SIDE, NOT a glass-ui ask: the
    demo-side controlled-`modelValue` fix (chartered at **U.B6**, dischargeable WITHOUT a
    glass-ui change — lane 30 ask 7) retires the `:key`-remount re-seat; the letter RECORDS it
    discharged-kf-side (no born-RED tripwire armed against glass-ui for it).
  - Each ask gets an **absorb-or-expire deadline** tied to the 5.0.0 re-target (U.F5): the
    cure is either absorbed by the 5.0.0 re-pin or the ask EXPIRES and kf's posture
    (band-aid or acceptance) becomes permanent kf-owned — no vacuous perpetual tripwire.
- **Substance — stale-narration refresh (lane 28 B6, ask 6).** Refresh the stale version
  narration and DERIVE it from `package.json` at gate time instead of hand-copied prose
  that drifts every re-pin: `KF-TO-GLASSUI-BG.md:372` §5 pin table says value.js `^2.0.1`
  (stale; actual `^3.1.0`); `PIN-LEDGER.json` `shipped.$comment` narrates "value.js
  2.0.1's own dependencies declare parse-that ^1.0.0" (stale; installed value.js 3.1.0 —
  the $comment contradicts the data it annotates). The refreshed pin snapshots read from
  `package.json`, never hand-typed.
- **Substance — MEMORY re-pin (lane 28 ask 7).** Re-pin the constellation MEMORY note
  `project_glassui_specular_consume_edge` (and MEMORY.md's stale "kf pins ~3.5.1") to the
  current `~4.0.x`-installs-4.0.1 reality with the 4.2.0 registry frontier — and, once
  U.F5's 5.0.0 re-target lands, to the glass-ui 5.0.0 posture (`^5.0.0`, peer kf `^5.1.0`).
- **Size.** M. **Deliverable = the letter** (docs; owner-observable). **DAY 1** (parallel
  with U.F3 — upstream latency). **Ring-fence 1** — a letter + a MEMORY note, no glass-ui
  patch.
- **Oracle.** the letter file exists with concrete absorb-or-expire deadlines per ask; the
  refreshed pin snapshots derive from `package.json` (a one-shot: the letter §5 pin value
  equals `package.json`'s at draft time and is marked DERIVED).
- **Edges.** → **U.F5** (cites its re-probe record), ↔ **U.E** (the stale-narration refresh
  is the glass-ui slice of U.E's NO-LEGACY doc-currency sweep), ↔ **U.A5** (the 5
  external-blocked `T_BORNRED_BACKLOG` rows — `no-collision-rename` → value.js;
  `dock-rest-crisp`/`dock-morph-continuity`/`dock-zorder`/`blur-not-resampled` → glass-ui —
  become the covenant rows of THIS letter + U.F3's §E; the register carries to V never).

### U.F7 — `proof:deps-current` currency truth: floor advance + REALM-CONVERGENCE excision + drift assertion

- **Substance — the value.js floor advance (lane 27 F4).** `proof-deps-current.mjs:72-73`
  pins the FLOOR at `value.js 0.13.0` / `parse-that 0.9.0` — vacuous: kf's SOURCE hard-assumes
  value.js ≥2.0.1 boxing (`plain-vars.ts`), the 2.0.x `@function` fix (recovery apparatus
  DELETED), the `/math` subpath (`leaves.ts:28`), and the 3.x subpath taxonomy (U.F1's
  target). A resolver landing 0.13.0 — PERMITTED by this floor — breaks kf outright; only
  the manifest `^3.1.0` protects it. Advance the value.js FLOOR to the true correctness
  minimum (`3.1.0`, or the value.js U-tranche cut once §F tags it) so the gate BITES.
- **Substance — the REALM-CONVERGENCE excision (lane 28 A3, ask 5 — NO-LEGACY).**
  `proof-deps-current.mjs:237-329` carries a ~90-line REALM-CONVERGENCE apparatus reasoning
  about a two-parse-that-realm world kf left at Q: clause 3 computes `kfRange =
  declared["@mkbabb/parse-that"]`, keeps a whole split-realm error path (`:262-294`) + a
  `G-HANDOFF-1` warning (`:329`) that can NEVER fire (kf structurally declares no parse-that),
  and the header (`:32-48`) + `FLOORS` still enumerate a `parse-that ≥0.9.0` floor and the
  "cross-realm cast `utils.ts:248`" narration (`utils.ts` does not exist — it became
  `compile/parse-flatten.ts`). COLLAPSE clause 3 to a single positive invariant — *"kf declares
  NO `@mkbabb/parse-that`; the constellation is single-realm by construction"* — a one-assertion
  gate; DELETE the split-realm branch, the `parse-that` FLOOR entry, and the `G-HANDOFF-1`
  warning wholesale. The realm question is CLOSED; the gate says so in one line, not the
  machinery of the open question. **This is the parse-that certified-clean record** (lane 28
  A1/A2): transitive-only via value.js 3.1.0 → parse-that 1.0.0 (registry latest), zero `src/`
  specifiers — one line, no band.
- **Substance — the glass-ui drift assertion (lane 28 B2, ask 4).** Add a BLOCKING glass-ui
  currency clause (into `proof:deps-current`, or the folded `proof:publish` structural check)
  so glass-ui drifting a minor AHEAD of the pin is CAUGHT — today `deps-current` is a floor-only
  check that SKIPS optional siblings (`:145-146`) and `pin-ledger`'s registry cross-check is
  observe-only, so nothing fails on drift. The clause compares the pin's admissible range against
  `dist-tags.latest` and REDs when a cured minor is reachable-but-unpinned (complementing U.F5's
  re-architected tripwire — the tripwire detects the CURE, this clause detects the DRIFT).
- **Substance — derive narration from `package.json`.** The header floor prose and the
  cross-checked ranges DERIVE from `package.json`/`dist-tags` at gate time, not hand-copied
  constants that rot every re-pin (lane 28 B6).
- **Size.** S. **ONE coordinated pass with U.A** (charter §3): the CI trim and the constellation
  currency BOTH edit `proof-deps-current.mjs` — never two passes over the same path-pinned gate.
- **Oracle.** `proof:deps-current` re-armed — the value.js floor now bites (a below-3.1.0 resolve
  REDs); the realm clause is one positive line; the glass-ui drift clause REDs on a
  reachable-but-unpinned cured minor; the narration is derived. Net gate count FLAT (same gate,
  less machinery, sharper clauses; the `parse-that` FLOOR entry removed).
- **Edges.** ↔ **U.A** (co-scheduled — the CI trim touches this file too), → **U.F1** (the floor
  advance ratifies the subpath-taxonomy dependency the transposition creates), ↔ **U.F5** (the
  drift clause + the re-architected tripwire are the coupled currency cure).

---

## Risks + the re-arm map

The stale-era re-arm class is **EXPECTED** (charter §5): every U edit invalidates some gate's
expectation — re-arm or delete WITH the wave, citing the ruling. Net gate count **only goes DOWN**
(charter §6); this band authors **ZERO** new standalone `proof-*.mjs` — the one gate the brief
names (`proof:valuejs-subpath`) is folded as a CLAUSE of the surviving `proof:boundary`
(anti-sprawl-honest), and every other change re-arms or trims an existing gate.

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **F1** | `proof:boundary`'s file-by-file value.js-edge walk (it does not yet know the subpath taxonomy); the 42 megabarrel imports; the three stale 1.2.0-bug comments | RE-ARM `proof:boundary` with the subpath-granularity clause (folded, not a new gate); the megabarrel becomes un-regressable; the stale comments purged in-motion (U.E slice) |
| **F2** | the `proof:boundary` subpath clause's file set (library-only); the 23 demo megabarrel imports | RE-ARM the clause to `demo/`; rides U.B's file moves (one re-point, not two) |
| **F3** | `KF-TO-VALUEJS-T.md` (T-era, stale pin snapshot) | SUPERSEDE with `KF-TO-VALUEJS-U.md` (the drafted deliverable); the T letter is archived provenance |
| **F4** | `proof:workaround-deletion` (the S7 linear()-normalize arm retired; plain-vars UN-tracked; the dispatcher untracked) | RE-ARM: the `getTimingFunction` dispatcher arm added (keyed on §B); the plain-vars arm added (path b) OR the value.js-provenance framing PURGED (path a — no arm, ratified kf-owned). Net arm count flat (fills the retired S7 slot) |
| **F5** | `proof:glass-ui-gap-tripwire` + `glass-caps.mjs` (installed-dist probe); `proof:workaround-deletion`'s hard-coded 4.1.0 sentinels; the `~4.0.0` pin + the `PIN-LEDGER.json` "tilde never caret" note; the abstract `fixVersion` fields | RE-ARCHITECT the tripwire to `dist-tags.latest` (same gate, mechanism cured); RETIRE any arm whose cure shipped in **5.0.0** (net DOWN); **RE-TARGET the pin to glass-ui 5.0.0 on its publish** (OD-U4 RULED — the tilde→caret-within-4.x machinery is SUPERSEDED); concrete 5.0.0 `fixVersion` per entry; SUPERSEDE the tilde-posture note |
| **F6** | `KF-TO-GLASSUI-BG.md` (T-era); the stale §5 value.js `^2.0.1` narration; `PIN-LEDGER.json` `$comment`; MEMORY `project_glassui_specular_consume_edge` + "~3.5.1" | SUPERSEDE with `KF-TO-GLASSUI-U.md` (absorb-or-expire deadlines, reconciled against what **5.0.0** ships); REFRESH the narration DERIVED from `package.json`; RE-PIN the MEMORY notes to the 4.0.1/4.2.0-frontier reality → the 5.0.0 posture once U.F5's re-target lands |
| **F7** | `proof:deps-current` — the `value.js 0.13.0`/`parse-that 0.9.0` FLOOR; the 90-line REALM-CONVERGENCE clause 3 + `G-HANDOFF-1` + the `utils.ts:248` narration; the optional-sibling skip | ADVANCE the value.js floor to 3.1.0 (bites); COLLAPSE realm clause 3 to a one-line single-realm invariant + DELETE the parse-that FLOOR/`G-HANDOFF-1`/`utils.ts` narration; ADD the glass-ui drift clause; DERIVE narration from `package.json`. Same gate, sharper |

**Standing covenants the band CREATES, not clears (the deadlined-external class — carries to V
NEVER, per charter §0/§6).** Five external asks are BOOK'd as deadlined covenants, each with a
named upstream producer and a value.js/glass-ui-tranche-cut deadline, none a vacuous perpetual
tripwire: (1) `parseTimingFunction` → `getTimingFunction` deletion (U.F4, `proof:workaround-deletion`
arm); (2) authored-plain unflatten → `plain-vars.ts` deletion, IF path (b) is chosen (U.F4); (3)
the `PARSE_ERROR` diagnostics producer → `validate.parseable` honesty (U.C10, §D of the letter);
(4) the WAAPI layout-tracking-unit grouping → `WAAPI_INELIGIBLE_UNITS` derivation (U.C10, §D);
(5) the KF-7 `PropertyDescriptor` rename → `proof:no-collision-rename` discharge (§E). The five
external-blocked `T_BORNRED_BACKLOG` rows (U.A5) fold into these letter covenants. Each is
discharged by ONE kf-side wire-in the moment the named producer publishes — ring-fence 1: NO
parallel kf arm. At U.Z, every covenant is either absorbed (the producer shipped, kf consumed,
the tripwire retired) or explicitly re-deadlined by the owner — NONE rides silently into V.

**The anti-sprawl accounting (the band headline).** value.js edge: the subpath clause is FOLDED
into `proof:boundary` (net 0). glass-ui edge: the tripwire is RE-ARCHITECTED not added (net 0),
and cure-carrying re-pins RETIRE stranded arms (net DOWN). parse-that edge: the REALM machinery
is EXCISED (net DOWN — the `parse-that` FLOOR entry removed, clause 3 collapsed). Two docs
deliverables (the two letters) and one MEMORY re-pin add ZERO gates. **U.F's net gate delta ≤ 0**
— consume-edge covenants replace vacuous tripwires; the megabarrel edge becomes a granular,
un-regressable, parse-that-severed contract.
