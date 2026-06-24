# Tranche P — aggressively optimize the engine · transpose at the true seam · build the demo-frontend-design fleet · cut 5.1.x

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-20 from the 32-lane TRIUMVIRATE
> optimization re-audit (`P/audit/AUDIT-DIGEST.md`, ~3.8M tokens; 297 findings · **172 novel
> ideas**, 29 radical). This charter + its waves + the deferred-fold ledger + the prompt-recap +
> the two sibling dispatch packets are the deliverable. **No engine, demo, or library source is
> written here.** The implementation (P.W1…P.WZ) opens only on the owner's explicit
> authorization — exactly O's dev→impl boundary. **inv-16 holds throughout** (Tranche P writes
> only keyframes.js; every cross-repo need is a *dispatch* — `KF-TO-VALUEJS-P.md` /
> `KF-TO-PARSETHAT-B.md` — never a foreign-tree edit).

> **PARTIALLY IMPLEMENTED (2026-06-23).** The owner authorized the impl drive; the kf **4.4.0** MINOR cut
> shipped a *subset* of P's developed waves (the additive/internal arm — SoA, _styleOut, fromMorphSVG,
> emerging-CSS NOW, the demo-fleet polish, the spring heatmap). The breaking + deferred remainder is the
> **Tranche Q** terminal roster (`docs/tranches/Q/` — the no-deferral terminal tranche). This charter is
> the source-of-record for *what was developed*; Q is the source-of-record for *what shipped + what remains*.

> **The constitution is `P/CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`** — the shared spine the three
> sibling sessions cite. It locks the topology (ONE kf-hosted tranche + TWO dispatch packets), the
> DAG (parse-that B → value.js P → keyframes P), and the version split. P.md is the kf-P tranche
> charter *under* that constitution; it does not re-litigate the locked decisions, it sequences the
> kf work that rides them.

> **The validated-verdict evidence base is `P/FULL-LOOP-LEDGER.md`** (2026-06-22 — the harden ·
> validate · brainstorm · reformulate loop applied to all 67 constellation items; 34 KEEP · 12
> AUGMENT · 11 RE-SCOPE · 7 ADOPT · 2 SIMPLIFY · 1 KILL). Every band-table verdict below cites it.
> The headline MEASURED verdicts the boards now reflect: **P.W6 spring-heatmap ADOPT** (closed-form
> **272×** settle-time / **507×** overshoot faster than 400 live `SpringProgress` instances —
> `/tmp/spring-heatmap-probe.mts`); **P.W11 WeakMap ADOPT** (realm-clean, the S8 terminal — ZERO kf
> own-symbols post-swap, byte-equivalent over 20 arity-pad interp vars); **O.W6 `fromMorphSVG` ADOPT**
> (mid-t distinct from both endpoints: 11.27/11.27/22.54 on the triangle→square morph); **VJ-P1
> `color2Into` ADOPT** (the **84-alloc** display-p3 egress tail, `proof-gamut-alloc.mjs` 5/5);
> **PT-B1 ADOPT** (the packrat cross-input pollution BLOCKER — stale-result reproduced live); **PT-B2
> RE-SCOPE / PT-B4 KILL** (the `*Span` tier has ZERO production consumers across value.js/kf/parse-that —
> measured grep).

> **PRECONDITION-STATE banner (the two-tier O→P gate).** P opens after O is **AUTHORIZED** and O's NOW
> correctness/chronic-terminal bands (DM-2/DM-3 build-ins O.W5/O.W6, the DM-22 cure) are available as
> P's substrate — NOT after O is fully *implemented*. **O is DEVELOPED-not-IMPLEMENTED** (verified:
> `engine.ts` is still 1397L). Per the CONTRIVANCE-AUDIT (`P/CONTRIVANCE-AUDIT.md`), **O.W7 is NOT
> VJ-L1-gated** — the engine-seam split (1397L→~900L, lifting the playback machine into
> `engine-playback.ts`) is **executable NOW** on the current tree, the same phase as O.W8/W9. kf's
> P.W11 realm-clean WeakMap (or simply the file-split itself) makes the flatten/parse seam in-realm;
> VJ-L1 is NOT a precondition for it. The `Playhead` value-object that P.W3 S4 would deepen it into is
> **DROPPED** (no perf claim, pure delegating-accessor indirection over the unlanded O.W7 — the
> engine.ts shrink IS O.W7's file-split, not a value-object). The canonical chain is therefore: O.W7's
> split lands NOW (no value.js wait) — full stop; §1/§5 below state it identically.

---

## 1 — Why Tranche P exists (the optimization+demo-design mandate atop O)

Tranche O is the **close-out tranche**: it implements what M developed, terminates the two absolute
chronics M.W14 named-but-never-built (DM-2 `DemoControlPoint` / DM-3 `fromMorphSVG`), executes the
engine-seam split, dispatches the value.js-P + glass-ui-BC asks, and cuts 5.0.0. O is the
*correctness-and-honesty* tranche — it makes the tree *true*. It is RATIFIED but **IMPLEMENTATION
remains UNauthorized** (O.md:11-19).

Tranche P is the **optimization+frontend-design tranche** that sequences ATOP O. The owner's
standing 7-clause mandate (verbatim, immutable since J.md:111-119) was **intensified** this pass into
an active *challenge* (F3 lane, CONSTITUTION §1): **aggressively optimize the triumvirate**
(value.js · parse-that · keyframes), **brainstorm novel architectural approaches that challenge each
library** (perf + arch above all), and **improve the demos' usability/clarity/correctness via a
frontend-design fleet.** Falsify-first, not passive.

Where O makes the tree *correct*, **P makes it *fast and beautiful*** — and does so over the
foundation O lays. The dependency is concrete and named:

| O substrate P sequences atop | O home | P consumes / extends |
|---|---|---|
| **O.W5/O.W6 chronic terminals** (`DemoControlPoint` over LIGHT `drag2D`; `fromMorphSVG` over value.js `PathGeometry` — **O.W6 ADOPT**, FULL-LOOP-LEDGER `O.W5-6-chronics`: the triangle→square keystone is PROVEN, mid-t distinct from both endpoints 11.27/11.27/22.54) — the forbidden-8th-carry BUILD-INs | O Band C (NOW) | **P Band C** dogfoods them as the demo-fleet showcase (the curve-editor handle is `DemoControlPoint`; the morph scene is `fromMorphSVG`) |
| **O.W7 engine-seam split** (`engine.ts` 1397→~900, the lifecycle/playback machine lifted off the compile facade) — **NOT VJ-L1-gated** (CONTRIVANCE-AUDIT: executable NOW, same phase as O.W8/W9) | O Band D (NOW) | **P Band B** consumes the *shrunk* file; the `Playhead` value-object deepening is **DROPPED** (no perf claim — the shrink IS O.W7's file-split); **P Band F** P.W11 WeakMap is the realm-clean S8 terminal that also keeps the seam in-realm |
| **O.WZ 5.0.0 cut** (the no-legacy renames; the Oscillator + additive tail published) | O Band Z (USER-DOMAIN) | **P Band Z** cuts **5.1.x** — perf is non-breaking, it rides AFTER O's major |
| **value.js 1.0.2 `PathGeometry` / `./math` / `flatLeaf`(P) / `parseCSSSubValue`(P)** | constellation | **P Band B/E/F/G** consume the published surfaces; the API/correctness/perf-floor coupling (packrat fix, perf gate) flows parse-that B → value.js P → kf-P |

P does **not** orphan O. P opens after O is **AUTHORIZED** and O's NOW correctness/chronic-terminal
bands are available as P's substrate (NOT after O is fully *implemented* — O is
DEVELOPED-not-IMPLEMENTED, `engine.ts` still 1397L; O.W7's split is NOT VJ-L1-gated and is RE-HOMED
into P's execution window as a NOW wave per the PRECONDITION-STATE banner above). The two compose by
phase (O = NOW correctness; P = the perf/design layer over the corrected tree). The carried-forward
chronics are tracked in `P/audit/deferred-ledger-P.md` (every O terminal a P inheritance, not a
re-defer).

The audit corrected **three stale premises** up front (record-as-built honesty, F5/V1/V2/P1 lanes):
both siblings **already have bench infrastructure** (the "no-bench" premise was FALSE — value.js has
9 bench files + a portable JSON.parse-ratio gate; parse-that has `test/benchmarks/`); and
**glass-ui 4.1.0 published BUT `SegmentedTabs.vue:406` still emits `aria-orientation`
unconditionally** — so the kf S1 deletion is NOT yet safe (the O aria-guard dispatch stands), while
S2/dock (`useDockClickIntegrity`, shipped 4.0.1) **IS** deletable NOW.

## 2 — The precept reckoning (the transposition targets, applied to today's tree)

> *NO quick solutions, NO workarounds; idiomatic + gestalt; architectural transpositions for
> elegance/simplicity/PERFORMANCE above all are necessary + desirable; NO legacy code; KISS;
> observable-truth; born-RED; P-invariant-28.*

The re-audit enumerated the concrete transposition targets the tree carries **right now** — each owed
a terminal transposition in P (not a band-aid, not a file-rename masquerading as a transposition):

- **The `leaves.ts`→value.js/math TRAP (the precept-correction BLOCKER — F4/X4 lanes).**
  `internal/leaves.ts` duplicates `clamp`/`scale`/`lerp`/`lerpArray`/`deCasteljau`/`cubicBezier`
  that value.js 1.0.2's `./math` subpath now exports. O.W9 framed this as "import the canonical
  `./math`" — but `proof:boundary` **bans even the subpath specifier** from LIGHT source (the
  static/dynamic boundary is value.js-free in LIGHT). A plain delete-and-import would **RED
  `proof:boundary`**. The no-legacy cut is therefore a **bundle-externalization transposition**, NOT
  a delete: teach the LIGHT build to treat `@mkbabb/value.js/math` as a bundle-external (the subpath
  is provably parse-that-free + grammar-free — F4 verified), gated by a `math-subpath-clean` clause
  asserting the externalized entry's static graph never touches the grammar. **P Band E owns this**;
  it is the genuine transposition O.W9 named but could not execute as written.

- **The SoA-compositor transposition (DEMOTE-TO-SPIKE per the CONTRIVANCE-AUDIT — K1/X2 lanes).** The
  HEAVY interp path (`CSSKeyframesAnimation.processFrame` → `lerpValue` per channel;
  `AnimationGroup.transformFramesGrouped` → `for..in` over `Record<string, ValueUnit[]>`) is
  boxed-ValueUnit AoS — **but the default blend mode `replace` (`group.ts:289-294`) is a bare
  reference-assign with ZERO per-element dispatch**. The megamorphic boxed-AoS blend the SoA fold
  attacks lives **ONLY in the non-default add/weighted arms**. The 3.86x headline in
  `spring-vector-decision.json` is **TRANSPLANTED** — it measures `SpringProgress.setTargets`, a
  DIFFERENT path than `transformFramesGrouped` — and is RETIRED as the justification. **The wave's
  FIRST step is `bench/group-composite.bench.ts`** measuring `transformFramesGrouped` SPECIFICALLY
  (default `replace` + the add/weighted arms separately, same-report ratio); **charter the SoA engine
  edit ONLY if the add/weighted arms clear the bar** — the engine code is a DEMOTE-TO-SPIKE gated on
  that decision-JSON. The default `replace` path is **already dispatch-free + untouched**. The
  computed-unit composite-numeric-key (P.W2 S4) is a **MEASURE-FIRST kf-side observe-only bench** (two
  cheap compares per frame are not a plausible bottleneck — NOT dispatched to value.js). **P Band B
  owns this** (P.W2), gated by `proof:soa-composite` born-RED + a PORTABLE same-report ratio bench
  whose baseline is `transformFramesGrouped` (NOT a sibling path).

- **The `Playhead` value-object transposition (DROPPED per the CONTRIVANCE-AUDIT — K2 lane).** The
  earlier framing proposed deepening O.W7's `engine-playback.ts` lift into a `Playhead` value-object
  (clock + t + iteration + flags + `advanceTo`) the engine composes and the four drivers
  (`Sequence`/`AnimationGroup`/`ingest`) drive through a typed handle, BC-preserving via delegating
  accessors. **This is DROPPED.** It carries **no perf claim and no perf gate** (its gates were
  structural: zero-import-of-`KeyframesAnimation` + manual-clock-drive); it is **pure delegating-accessor
  indirection — BC-preserving by construction = zero observable delta** (smell-test Q7 fails); and it
  **depends on the unlanded O.W7**. The grounded goal (shrink `engine.ts`, decouple the playback
  machine) **is O.W7's file-split** — let O.W7 do the lift; do not deepen it into a value-object. P.W3
  S4 is retired.

- **The DOM-write path — split at the seam (CONTRIVANCE-AUDIT — K1/K3 lanes).** Today
  `transformTargetsStyle` (utils.ts:417) allocates a fresh `Record<string,string>` every rAF frame
  (the proven alloc-cure target) and writes K individual `style.setProperty` calls. The wave splits
  at the seam the spec already draws:
  - **S2 — the `_styleOut` out-buffer alloc-cure (the GROUNDED CORE — the wave's payload).** Hoist a
    module-scope reuse `Record` and pass it as the `out` arg to value.js's `unflattenObjectToString`
    (the sink already accepts it). A proven-pattern alloc-cure, **single-path, no dual maintenance** —
    it lands UNCONDITIONALLY (smell-test all-green). This is P.W3's grounded payload.
  - **S1/S5 — the Typed-OM (`StylePropertyMap.set`) write path — DEMOTE-TO-SPIKE.** It is a **PERMANENT
    dual-path** (Typed-OM is **LIMITED AVAILABILITY**: Chrome/Edge 66+, Safari 16.4+, NO Firefox for the
    aggregate API) for a Chromium-mostly win on the least-common multi-property shape. **Run the
    write-cost Playwright gate (S5) FIRST as a measurement** over the multi-property case; ship the
    Typed-OM path ONLY on a measured win, and **on KILL ship the S2 out-buffer ALONE**. **P Band B owns
    this** (P.W3), the spike gated `proof:typed-om-eligible` (real-browser pixel-readback) only if it
    graduates.

- ~~**The codegen-consume (the campaign's missing perf payload — CONSTITUTION §4).** P.W4 / the
  BBNF→TS emitter / the generated CSS-value parser.~~ **RETIRED (2026-06-22, owner directive).** The
  codegen spine is BBNF-lang's job in a completely separate session — out of this campaign's scope.
  P.W4 is a RETIRED tombstone (§3 Band B below). The campaign's perf payload is the GROUNDED IN-REALM
  core (per the CONTRIVANCE-AUDIT): value.js color zero-alloc (VJ-P1) + VJ-L3 `parseCSSSubValue`, the kf
  `_styleOut` out-buffer alloc-cure + O.W7 seam split, parse-that correctness + perf-frontier. The
  aggressive shell (kf SoA compositor / Typed-OM = MEASURE-FIRST spikes; kf Playhead = dropped; value.js
  VJ-L1 = spike, VJ-P2 = dropped) is demoted/dropped. No generated parser is shipped or consumed by kf-P.

- **The remaining live workarounds.** S8 `FN_NAME` Symbol sidechannel (utils.ts:45 — stamped onto
  foreign value.js `ValueUnit` instances, re-stamped on every `.clone()`); S9 direct `@mkbabb/parse-that`
  production import + two cross-realm `as any` casts (utils.ts:1,229,236); S1 aria-suppress; S2
  dock-pointer interim. Each retires on a *root fix* — **P does not band-aid these**: S2 deletes NOW
  (the BC `useDockClickIntegrity` root fix shipped 4.0.1); S1 stays GATED on the BC aria guard
  (`KF-TO-GLASSUI` correction stands); **S8 (born E) exits at P.W11 IN-REALM** — the realm-clean
  `WeakMap<ValueUnit, string>` swap is the **TERMINAL S8 cure** (`proof:no-foreign-symbol-stamp`), the
  **P-inv-28 chronicity-4 belt exit** with zero value.js dependency; **S9 (born C) exits at O.W16** (the
  value.js VJ-L3 `parseCSSSubValue` consume, inherited at P). Both are at **chronicity 4** (K,L,M,O→P).
  Per the CONTRIVANCE-AUDIT, **VJ-L1 is DEMOTE-TO-SPIKE** — it is NOT the O.W7 unblocker (O.W7 is not
  VJ-L1-gated) and NOT the S8 terminal (P.W11 is); its only residual is retiring the clone-restamp
  ceremony, re-opened on a measured need. (P.W12 is S1/S2 ONLY — the glass-ui aria/dock consume, NOT
  S8/S9.)

## 3 — The eight bands (the wave structure)

The O.md eight-band DAG is the template; P carries the same explicit **phase axis** — every wave is
tagged **NOW** (kf-internal, zero sibling dependency, executable on authorization), **DISPATCH** (a
cross-repo ask, authored in-tree, scheduled by the sibling), or **GATED** (fires atomically on a named
sibling publish).

| Band | Wave(s) | Phase | Headline |
|---|---|---|---|
| **A — Apparatus** | P.W1 (lint+bench-coverage+portable-perf-gate infra) | NOW | the optimization measurement floor — close the un-CI'd bench gaps, ratify the portable ratio discipline, author the perf-gate apparatus every aggressive idea below requires |
| **B — Engine-perf (VALIDATED) + emerging-CSS** | P.W2 (SoA-compositor — **SPIKE RAN → ADOPT**, measured **3.7×** bit-identical on the real path, scoped add/weighted; the computed-unit composite-key MEASURE-FIRST), P.W3 (the `_styleOut` out-buffer alloc-cure **GROUNDED CORE** + the Typed-OM write-path **SPIKE RAN → KILL**, measured **0.69×** multi-property; the `Playhead` value-object **DROPPED**), **P.W13 (emerging-CSS resolution — `resolve-values.ts`: if()/spring() NOW, @function/sibling-index value.js-P-gated)**, ~~P.W4~~ (RETIRED tombstone — codegen, BBNF-lang separate session) | NOW W2,W3,W13 | the spikes were RUN (owner: "validate, don't abrogate"): SoA ADOPT (`group-soa-decision.json`), Typed-OM KILL (`typed-om-decision.json`) — the same method, OPPOSITE verdicts, neither decidable on paper. P.W13 makes if()/@function/spring()/sibling-index() animate in EVERY browser (the `springTimingFunction` precedent; `EMERGING-CSS-RESEARCH.md`) |
| **C — Demo-fleet (frontend-design)** | P.W5 (cube + amiga), P.W6 (square + spring), P.W7 (easing-curve-editor + DemoControlPoint showcase), P.W8 (N-Stage switcher + mobile) | NOW | the 29-idea design fleet over the O-built chronic terminals: per-scene refinement, the spring parameter-space heatmap (**P.W6 S3 ADOPT** — closed-form **272×/507×** over 400 live `SpringProgress`, tint by the EXACT analytic overshoot; FULL-LOOP-LEDGER `P.W6 S3`), amiga flick-to-boing, the curve-editor dogfooding `DemoControlPoint`, the N-Stage shelf-driver + the entirely-unbuilt mobile |
| **D — Correctness** | P.W9 (NaN-frame cure + grammar-fuzz + differential-oracle) | NOW | the property-based / differential-vs-browser oracle frontier the corpus tests miss — fast-check fuzz, the CDP computed-style differential, the named-selector roundtrip post-O.W3 |
| **E — No-legacy** | P.W10 (leaves.ts-externalization-TRAP + deprecated-aliases + cross-realm-seam-gate) | NOW | the genuine `leaves.ts`→`/math` bundle-externalization transposition (NOT a delete), the `proof:no-cross-realm-cast` structural gate, the deprecated-alias purge atop O's 5.0.0 renames |
| **F — S8 terminal** | P.W11 (realm-clean WeakMap — the terminal S8 cure) | NOW | the kf-internal `WeakMap<ValueUnit,string>` FN_NAME carrier — the P-inv-28 **chronicity-4 belt exit** for S8 (the belt fires THIS tranche), the TERMINAL in-realm S8 cure (no value.js dependency). **ADOPT (FULL-LOOP-LEDGER `P.W11-weakmap`):** validated realm-clean — ZERO kf own-symbols on the `ValueUnit` post-swap, byte-equivalent over 20 arity-pad interp vars; the clone-restamp ceremony stays (honest inferiority — VJ-L1 strictly preferred for ceremony-retirement, demoted-to-spike). It ALSO keeps the O.W7 seam in-realm, but O.W7 is NOT VJ-L1-gated so this is not an "unblock" |
| **G — Consume** | P.W12 (glass-ui 4.1.0 S2-delete-NOW + S1-GATED-on-guard) | **NOW S2** (re-pin only — the glass-ui `useDockClickIntegrity` root fix is ALREADY published+installed; no sibling WAIT) · **GATED S1** (waits on the UNshipped BC SFC aria guard) | the glass-ui consume: delete S2/dock atomically on 4.1.0 (root fix shipped); hold S1/aria GATED on the BC SFC guard (the O correction premise unmet) |
| **Z — Close + 5.1.x cut** | P.WZ (close + 5.1.x cut) | NOW-author · USER-DOMAIN publish | the non-breaking perf cut riding AFTER O's 5.0.0 major — the `_styleOut` out-buffer alloc-cure + O.W7 seam split + demo-fleet wins published (the SoA fold / Typed-OM write path ship ONLY if their MEASURE-FIRST spikes ADOPT), the ledger re-pointed O→P, the deploy round-trip re-observed |

**Phase-axis note.** P carries far more **NOW** weight than O did: the engine work (Band B W2/W3 — the
grounded `_styleOut` alloc-cure + the MEASURE-FIRST spikes), the demo fleet (Band C), correctness
(Band D), no-legacy (Band E), the P.W11 WeakMap S8 terminal (Band F), and the S2 delete (Band G) are
all kf-internal — executable on authorization with zero sibling wait. The one remaining GATED edge is
**P.W12 S1 delete** (glass-ui BC aria guard). O.W7 is **NOT** a gated edge — per the CONTRIVANCE-AUDIT
it is NOT VJ-L1-gated and lands NOW (the file-split, and the P.W11 WeakMap, make the seam in-realm).
(P.W4 codegen-consume is RETIRED — codegen is BBNF-lang's separate session.)

## 4 — The DAG (the band ordering + the gated couplings)

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0 packrat-fix       (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
   + Span-dedup             VJ-L3 parseCSSSubValue ·
   + perf-frontier)         color zero-alloc (VJ-P1) ·
                            :any→string (VJ-P3)
                            [VJ-L1 spike · VJ-P2 dropped])
  [API + correctness + perf-floor coupling — NOT a codegen spine; codegen = BBNF-lang separate session]
```

```
P.W1 apparatus (NOW) ─► B{W2 SoA-compositor SPIKE (NOW), W3 _styleOut alloc-cure (NOW) + Typed-OM SPIKE}
        │                                                              │
        ├──────────► C{W5 cube+amiga, W6 square+spring,                │
        │              W7 curve-editor+DemoControlPoint, W8 N-Stage+mobile} (NOW, atop O.W5/W6)
        ├──────────► D.W9 correctness (NOW)                            │
        ├──────────► E.W10 no-legacy TRAP (NOW)                        │
        │                                                             ▼
   F.W11 WeakMap S8-terminal (NOW) ──────► O.W7 engine-seam (NOW, NOT VJ-L1-gated) ──┐
                                                                            │
   G.W12 S2-delete (NOW) · S1-delete (GATED: glass-ui BC aria guard)        │
                                                                            ▼
   parse-that B publish ─► value.js P publish ─► O.W16 S9 exit (VJ-L3) ──► P.WZ close (5.1.x)
```

**The band ordering.** Band A (the apparatus) lands FIRST — the portable-perf-gate infra is the
measurement substrate every MEASURE-FIRST spike in Bands B/C is gated against; without it a 2×
regression stays green (the device-dependence lesson) and a transplanted-ratio charter (the 3.86x
trap) escapes. Bands B (engine-perf — the grounded `_styleOut` cure + the demoted spikes), C
(demo-fleet), D (correctness), E (no-legacy), F (the S8 terminal), and G/S2 (consume) are then
**immediately executable** (the bulk of the value — all NOW). The one gated edge (P.W12 S1) closes last:

- **The engine-seam split is NOT VJ-L1-gated (Band F · O.W7).** Per the CONTRIVANCE-AUDIT, O.W7 (the
  `engine.ts` 1397→~900 split, lifting concern-3 into `engine-playback.ts`) is **executable NOW** on
  the current tree — the same phase as O.W8/W9. **P Band F (P.W11)** authors the kf-internal
  `WeakMap<ValueUnit,string>` FN_NAME carrier NOW — the **TERMINAL realm-clean S8 cure** (the P-inv-28
  **chronicity-4 belt exit** for S8, the belt fires THIS tranche, P), which also keeps the flatten/parse
  seam in-realm. But the seam is in-realm by the file-split itself; **VJ-L1 is NOT a precondition** —
  it is demoted-to-spike (its only residual is retiring the clone-restamp ceremony, re-opened on a
  measured need). The `Playhead` deepening of O.W7 is **DROPPED** (no perf claim); O.W7's file-split is
  the grounded shrink, full stop.

~~**P.W4 codegen-consume (RETIRED).** The codegen spine (BBNF→TS emitter, generated CSS-value parser)
is BBNF-lang's job in a completely separate session — out of this campaign's scope. P.W4 is a RETIRED
tombstone; it is not renumbered (P.W5..P.WZ numbering stays stable). The perf payload kf-P delivers is
the GROUNDED IN-REALM core: the `_styleOut` out-buffer alloc-cure + O.W7's seam split in Band B (the
SoA compositor + Typed-OM write path are MEASURE-FIRST spikes, demoted per the CONTRIVANCE-AUDIT);
parse-that correctness (packrat fix) + perf-frontier + Span-dedup in the dispatch; value.js color
zero-alloc (VJ-P1) + VJ-L3 `parseCSSSubValue` in the dispatch.~~

The close (P.WZ) fires when all NOW bands are GREEN + the S1 gated edge resolves (or is
contingency-disposed per the ledger). The **5.1.x cut** is non-breaking — perf rides AFTER O's 5.0.0
major.

## 5 — The relationship to O (P sequences atop O — the dependency, stated precisely)

P is **not** a re-do of O and **not** a parallel tranche — it is the **next** tranche, opening after O
is **AUTHORIZED** and O's NOW correctness/chronic-terminal bands (DM-2/DM-3 build-ins O.W5/O.W6, the
DM-22 cure) are available as P's substrate — NOT after O is fully *implemented* (O is
DEVELOPED-not-IMPLEMENTED; `engine.ts` is still 1397L). Per the CONTRIVANCE-AUDIT, **O.W7 (the engine
split) is NOT VJ-L1-gated** — it is RE-HOMED into P's execution window as a NOW wave: O.W7-under-P
lands the split (the file-split + P.W11's WeakMap make the seam in-realm, no value.js wait). The
`Playhead` deepening (P.W3 S4) is DROPPED. The coupling is three concrete inheritances:

1. **O.W5/O.W6 chronic terminals are P Band C's substrate.** O builds `DemoControlPoint` (over LIGHT
   `drag2D`) and `fromMorphSVG` (over value.js `PathGeometry`). **P Band C dogfoods them** — the
   easing-curve-editor's draggable handle BECOMES `DemoControlPoint` (P.W7 retires the bespoke
   `useEasingCurveDrag` CTM transform onto the published primitive — KISS, no-legacy); a morph scene
   showcases `fromMorphSVG` (P.W5/W6). If O.W5/W6 are not yet built, P Band C has no substrate — the
   sequencing is hard.

2. **O.W7 engine-seam is P Band B's foundation (executable NOW, NOT VJ-L1-gated).** O.W7 lifts the
   playback machine into `engine-playback.ts` (1397→~900). **P Band F (P.W11)** authors the realm-clean
   WeakMap S8 terminal, which also keeps the seam in-realm — but the seam is in-realm by the file-split
   itself, so the split proceeds NOW with **no value.js wait**. Per the CONTRIVANCE-AUDIT the `Playhead`
   value-object deepening is **DROPPED** (no perf claim, pure delegating-accessor indirection over the
   unlanded O.W7); O.W7's file-split is the grounded shrink P consumes. The chain: O.W7 split (NOW-able)
   → P Band B's grounded `_styleOut` alloc-cure rides the shrunk file. No `Playhead` step.

3. **O.WZ 5.0.0 cut precedes P.WZ 5.1.x cut.** O cuts the major (the breaking no-legacy renames +
   Oscillator publish). **P cuts 5.1.x** — perf is non-breaking, it RIDES AFTER. P.WZ does not
   re-do the major; it ships the `_styleOut` out-buffer alloc-cure + O.W7 seam split + demo-fleet wins
   as a minor over O's 5.0.0 baseline (the SoA fold / Typed-OM write path ship ONLY if their
   MEASURE-FIRST spikes ADOPT), re-points the chronic ledger O→P, and re-observes the deploy round-trip.

The carried-forward chronics (O's DM-2/DM-3 BUILD-INs, the DM-22 NaN cure, the BC-gated S1, the
S8/S9 chronics — S8 closed in-realm at P.W11, S9 on the VJ-L3 consume) are P's inherited foundation —
tracked in `deferred-ledger-P.md` with a real terminal per item, never re-orphaned. O.W5/O.W6 (the
chronic terminals) and O.W7.md (the engine-seam dependency, now NOT VJ-L1-gated) are the load-bearing
O waves P reads as substrate.

## 6 — The 5.1.x cut (P.WZ)

O.WZ cuts **5.0.0** (major — the no-legacy renames are breaking: `Animation`→`KeyframesAnimation`,
`ScrollTimeline`→`KeyframesScrollTimeline`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions`,
`presets.flip`→`presets.flipPreset`; + the multi-color refusal semantic). It also ensures the
Oscillator + the eight-export additive tail reach the **published** dist (frozen at 4.3.0 today).

P.WZ cuts **5.1.x** — a **non-breaking** minor (BC-additive) riding AFTER O's major. The P perf+design
work is additive by construction: the grounded `_styleOut` out-buffer alloc-cure is an internal
strategy change (no API delta); the SoA compositor and Typed-OM write-path — IF their MEASURE-FIRST
spikes ADOPT — are likewise internal strategy changes (no API delta). Per the CONTRIVANCE-AUDIT the
`Playhead` value-object (P.W3 S4) is **DROPPED** (no perf claim, pure delegating-accessor indirection
over the unlanded O.W7), so it carries no 5.1.x surface; the engine.ts shrink ships as O.W7's
file-split. The demo-fleet is demo-only. P.WZ authors the changelog 5.1.x entry (the perf wins + the
demo fleet), re-points the chronic ledger O→P (the M→O→P substrate chain), and observes the deploy
round-trip as live-byte equality (the CI→deploy→live serves-the-exact-hash oracle). The publish + the
keyframes-vue peer-bump stay **USER-DOMAIN** (Mike Babb fires the tag).

## 7 — inv-16 (kf asks, never writes)

P writes **only keyframes.js**. The two cross-repo needs are **dispatch packets**, authored in-tree,
scheduled by the sibling sessions into their own trees — the proven inv-16 fence pattern (the same as
O's `KF-TO-VALUEJS-P-ASKS.md` + the BC aria correction):

- **`KF-TO-VALUEJS-P.md` → value.js Tranche P** — **VJ-L3 `parseCSSSubValue`** (the surviving binding API
  ask, the S9 root fix — KEEP, FULL-LOOP-LEDGER `valuejs-P-asks`: `parseCSSValue` truncates
  `'scale(2) rotate(45deg)'`, so kf's FunctionArgs-first composition is non-substitutable), the **VJ-P1
  `color2Into` out-param ADOPT** (the 1.2.0 perf headline — `proof-gamut-alloc.mjs` 5/5 confirms the
  **84-alloc/call** display-p3 egress tail [witness `N_BASELINE=104`]; mirror the shipped
  `transformMat3Into` caller-owned-scratch precedent; re-baseline `N_TARGET` to the MEASURED post-cure
  residual) + the VJ-P3 `:any`→string seam narrowing (the grounded perf tail), the **VJ-P.W0**
  doc-honesty reconciliation. Per the CONTRIVANCE-AUDIT + FULL-LOOP-LEDGER: **VJ-L1 `flatLeaf` is
  DEMOTE-TO-SPIKE** (P.W11's WeakMap is the terminal S8 cure — VJ-L1's residual is retiring the
  clone-restamp ceremony, NOT the S8 root fix and NOT the O.W7 unblocker; if ever spiked, prefer the
  meta-record Option B shape) and **VJ-P2 the typed Float64 channel view is DROPPED** (premises falsified
  by shipped value.js). Version split: 1.1.0 (API — VJ-L3) then 1.2.0 (perf — VJ-P1 color zero-alloc +
  VJ-P3 `:any` seam narrowing; codegen-generate is NOT in 1.2.0 scope).
- **`KF-TO-PARSETHAT-B.md` → parse-that Tranche B** — **PT-B1 ADOPT (the campaign correctness BLOCKER —
  lands FIRST)**: the packrat cross-input pollution FIX (memoize() returns stale across inputs — REPRODUCED
  LIVE: `memoize(regex(/[a-z]+/)).parse('hello')` then `.parse('world')` returns `'hello'`; MEMO key lacks
  `src`, packrat.ts:55) + the 4096-ID float64-safe multiply-key (`id*1048576+offset`); reset at the
  `parseState` ENTRY boundary (zero per-node cost), born-RED gate `proof:packrat-cross-input`. **PT-B2
  RE-SCOPE**: the Span-combinator DEDUP is REFRAMED — the `*Span` builders have **ZERO production consumers**
  (value.js/kf/json/csv all use `dispatch`+`regex`, measured grep), so do NOT spend a parametric-factory +
  5% perf gate now; defer the factory as opportunistic OR raise a P-inv-28 disposition on the `*Span` public
  surface. **PT-B3 ADOPT** (one scope correction): the perf frontier (combinator fusion + 2-char dispatch
  widening — gated on the 2nd-byte-DISAMBIGUATED tokens ca/cl/cu only; `co`=cos+conic is honestly a 2-deep
  residual — + bench/proof:perf regression gate). **PT-B4 KILL (P-inv-28 → KILL)**: the dormant SpanParser
  introspection tier (span.ts:540-902) has ZERO consumers; delete it + `span-dispatch.bench.ts`, preserve
  ONLY the A.W3 falsification (~10-14% V8 slowdown) as a `future-research.md §7` paragraph; recommend
  folding into PT-B2's housekeeping (one atomic span.ts diff). Version: 0.12.0.

The DAG enforces the inv-16 ordering: parse-that B → value.js P → kf-P (the API + correctness +
perf-floor coupling). kf P's one GATED value.js-edge (the **S9 delete** that feeds O.W16, on the VJ-L3
`parseCSSSubValue` publish) fires atomically on the named sibling publish; kf never reaches into a
sibling tree to make it land. **S8 is NOT value.js-gated** — it closes in-realm at P.W11 (the WeakMap
terminal); and **O.W7 is NOT VJ-L1-gated** — it lands NOW.

## 8 — The dev→impl boundary + verification

This phase's deliverable is the Tranche P development docs, verified by: the 32-lane audit on disk
(`P/audit/`) + re-runnable; the deferred-fold ledger (`deferred-ledger-P.md`) with a real terminal per
item (every O chronic a P inheritance, zero un-dispositioned punts; the SpanParser P-inv-28 resolution
dispatched to parse-that B as a KILL recommendation); the prompt-recap (`prompt-recap-P.md`) capturing
the optimization+triumvirate+frontend-design intake (the one uncaptured prompt F3 found); the two
sibling dispatches authored; and **each wave's falsifiable born-RED gate** — for perf ideas a
**PORTABLE ratio bench** (numerator and denominator from the same report; device-independent by
construction), for the demo-fleet a real-browser observable (CDP/Playwright pixel-readback or a
content-aware probe). The IMPLEMENTATION (P.W1…P.WZ) opens only on the owner's explicit go, per-repo,
DAG-ordered — gate-first, born-RED, observable-truth, no-legacy, gestalt, KISS throughout. inv-16
holds: P writes only keyframes.js.
