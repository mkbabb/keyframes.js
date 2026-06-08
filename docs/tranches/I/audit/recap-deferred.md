# Tranche I — the DEFERRED-ITEM recap (the non-chronic ledger, A → H, for Tranche I)

**Lane id:** `recap-deferred`. **Branch:** `tranche-i-dev` (forked off the broken master
`b934a08`). **Job:** delineate every OTHER deferred / booked / HANDOFF item across A→H —
**the non-chronic carry** (the glass-ui consume-edges, the value.js / parse-that handoffs,
the BOOK items, the ARCH-kills, the "follow-on" notes) — its current LIVE state, and
whether it should FOLD into Tranche I. The four user-visible **design chronics**
(cartoon-shadow, φ-typography, mobile, dock) are owned by the chronic lane / the H FINAL;
this ledger covers everything else. **DOCS ONLY — this lane wrote ONLY this file; ZERO
source/test/CI edits.**

**Method (inv ε).** This ledger CHAINS the binding A→H synthesis ledgers
(`H/audit/_SYNTHESIS-deferred-ledger.md`, `H/audit/a-deferred-ledger.md`,
`G/audit/_SYNTHESIS-deferred-ledger.md`, `F/audit/_SYNTHESIS-deferred-ledger.md`,
`E/audit/deferred-ledger.md`, `C/audit/lanes/deferred-ledger.md`) and the H cross-repo
HANDOFF charters (`H/valuejs-parsethat-glassui-handoff.md`, `H/glass-ui-AX-handoff.md`),
re-dispositioned against the LIVE Tranche-I investigation evidence
(`I/audit/investigate/b{1,5,7,15}*`) and the live tree
(`package.json`, `node_modules`, `npm view`). Every row cites a prior ledger row or a live
anchor. Disposition vocabulary: **KFI** (fold into Tranche I) · **value.js-HANDOFF** ·
**parse-that-HANDOFF** · **glass-ui-HANDOFF** · **deploy-HANDOFF** · **MEASURE-FIRST** ·
**BOOK** · **RECORD/KILL** (do not re-litigate) · **done** (shipped, struck) ·
**USER-DOMAIN**.

---

## §0. THE HEADLINE — H discharged the historical carry, BUT the gate regime that
certified it was blind, so two HANDOFFs that "rode born-RED" are now LIVE I-folds

The historical *engine / parse / re-pin* ledger entered H **genuinely clean**: the G re-pin
spine (value.js `^0.11.1` / parse-that `^0.9.0` / glass-ui `^3.4.0`, NO `file:`) collapsed
the whole pre-G open ledger, and the 0.11.1 charter slice is live kf behaviour through the
single `lerpValue` seam (`engine.ts:779`), ZERO kf edit
(`H/audit/a-deferred-ledger §0/§1`). H then *claimed* to discharge the four design chronics
AND the W0 crash family, shipping 13 waves all-green (`proof:all` 97 gates, `H/FINAL.md §1`).

**The catastrophe Tranche I exists for:** those gates checked SOURCE-SHAPE + LOAD-TIME, not
RUNTIME / INTERACTION / STATE — so two items that the H deferred-ledger booked as
*HANDOFF-paired-with-a-born-RED-kf-gate* are, in the running demo, **live broken defects**,
because the born-RED gate was authored to pass on a fiction:

1. **The value.js empty-input parse contract (B1/B5).** H.W0 booked the `"......"` crash as
   *fixed* (typed `AnimationOptionError` on the FrameCompiler blank-selector path,
   `H/FINAL.md §1 W0`). The I investigation proves the crash is BACK via a path W0 never
   covered — `CSSKeyframesToString → at() → processFrame → lerpValue → parseCSSValueUnit("")`
   throws `Parse error at offset 0: "......"` (`I/audit/investigate/b5-keyframes-editor.md`).
   This is a **value.js empty-input parse contract** that was never a booked handoff — a NEW
   I-fold candidate (§3.A).
2. **The glass-ui specular consume-edge (B7).** H booked the orphan specular as
   `proof:no-orphan-specular` GREEN by *recording the stage bloom as "accepted residue"*
   riding a born-RED `proof:specular-handoff` that "resolves at glass-ui 3.8.0's
   `specular='off'`." The I investigation proves that target is **vaporware** — npm tops at
   3.7.0, the opt-out is unreleased (in NO tag), and 3.7.0 makes the sheen MORE pervasive
   (`I/audit/investigate/b7-specular-glassui.md`, `b15-glassui-cards-surfaces.md`). The
   glass-ui consume-edge is a NON-DISCHARGEABLE handoff and a live I-fold (§3.B).

**These two are the "prime candidates" the I mandate names, and the ledger confirms both:**
they are not chronics in the design sense — they are *deferred / handed-off* items whose
handoff was either fictional (B7) or never authored at all (B1). **Both FOLD into Tranche I.**

The rest of this ledger is the honest accounting of every OTHER deferred / booked / HANDOFF
item A→H, with its current state and an I-disposition. The bulk is correctly-OPEN
sibling-HANDOFF (value.js next-slice, parse-that re-key), correctly-RECORDED KILLs, and a
small set of BOOKs — most of which stay deferred. The exceptions that FOLD into I are
flagged **KFI**.

---

## §1. THE LIVE PIN STATE (the substrate every HANDOFF row is re-verified against)

`package.json` (live, `tranche-i-dev`, forked off `b934a08`):

| dep | pin | resolves | npm latest | note |
|---|---|---|---|---|
| `@mkbabb/value.js` | `^0.11.1` | 0.11.1 | — | the next-slice charter is OPEN in 0.11.1 (§2) |
| `@mkbabb/parse-that` | `^0.9.0` | 0.9.0 | — | the `(id,offset)` re-key WITHHELD (§4) |
| `@mkbabb/glass-ui` | **`~3.5.1`** | **3.5.1** | **3.7.0** | kf is 2 minors behind; the specular opt-out is in NEITHER (§3.B) |
| `version` | **4.1.0** | — | — | H planned a `4.1.1` PATCH; the running demo is the 4.1.0 base |

**The glass-ui pin is the headline of this ledger.** kf moved `^3.4.0 → ~3.5.1` since H
(the G-0 dock-spring retune consume-leg). `~3.5.1` was a DELIBERATE pin: the
`glass-ui-AX-handoff.md` G-1 names 3.5.1 the "sweet spot" — the dock-spring retune is
present AND the *visible* bloom is dead at rest, while 3.6/3.7 **re-regress** the bloom. So
"are we using the latest glass-ui?" (B7) has a precise answer: **NO, deliberately — and
even the latest (3.7.0) would not fix the specular; it makes it worse.** This re-frames B7
from "bump the pin" to "the consume-edge needs a kf-side decision" (§3.B).

---

## §2. value.js — the next-slice charter (CHRONIC-by-design C-1; every row OPEN in 0.11.1)

C-1 (the value.js cross-repo charter) is **CHRONIC-by-design and correct** — value.js is
dirty+active, a slice ships every tranche, the re-pin lit the F wins this cycle. These rows
are NOT the design chronics; they are the OPEN next-wave HANDOFF slice, each re-verified
OPEN in 0.11.1, each riding the next re-pin through the `lerpValue` seam with ZERO kf edit.
**None FOLDS into I as a kf wave** — they stay value.js-HANDOFF — **except where the I
investigation's B1 finding promotes the empty-input contract to a NEW value.js ask (§3.A).**

| id (origin) | item | live `0.11.1` status | I disposition |
|---|---|---|---|
| **VJ-1 / E1·E2 (=C-4)** | `linear()`/`steps()` PARSER → `LinearStop[]` | OPEN (`parseLinearStops === undefined`); kf shim `utils.ts` present | value.js-HANDOFF (OPEN) + kf-RETIRE-on-land. `linear()` Baseline-WA 2026-06-11 (PAST). Not a user defect; rides the next re-pin. |
| **VJ-2 / VJ-F1 (=C-5/FB-3)** | path-geometry sampler (`getPointAtLength`) | OPEN (`getPointAtLength === undefined`) | value.js-HANDOFF (OPEN) + kf BOOK (`fromMorphSVG`). The one real persisting competitor-feature gap. Sequence value.js FIRST. **BOOK — not an I fold.** |
| **VJ-3 / F2·F2b** | `currentColor`/`light-dark()`/`contrast-color()` sentinels | OPEN (`parseCSSColor('light-dark(...)')` THROWS) | value.js-HANDOFF (OPEN, HIGH for currentColor/light-dark). `contrast-color` must NOT alias `safeAccentColor`. |
| **VJ-4 / MCI-5** | identity-aware fn-arity pad (`brightness` holds `1` at t=0) | OPEN — the `it.fails` witness is GREEN today (`test/interpolate-anything.test.ts:226`) | value.js-HANDOFF. **The `it.fails` witness IS the consume signal** — flips RED on land. Born-RED gate already in tree; no I gate owed. |
| **VJ-5 / VJ-F2** | structured parse-error SINK + `tryParse` `furthest` swap | OPEN (producer half landed parse-that PT-1) | value.js-HANDOFF (OPEN, HIGH) + kf BOOK (`ResolvedKeyframes.diagnostics`). **CROSS-REF B1:** a real diagnostics channel would surface the empty-parse instead of a silent throw — see §3.A. |
| **VJ-6 / VJ-F4 (=G-3)** | buffer-reusing `unflattenObjectToString(flat, out?)` | OPEN (allocating form only) | value.js-HANDOFF (OPEN), ZERO kf edit on consume. The per-frame DOM-write garbage. |
| **VJ-7 / F3 (=C-3)** | bounded LRU on the value.js result cache | OPEN (no `maxCacheSize` cap) | value.js-HANDOFF (OPEN). Bound lives ONCE in value.js (DRY — no second kf policy). Re-open trigger: a measured editor footprint (none). |
| **VJ-8 / F6** | parser-free easing + leaf-math sub-path | OPEN | value.js-HANDOFF + paired kf FOLD (delete `internal/leaves.ts` shadow on land). |
| **VJ-9 / LD-PT-2 (=G-HANDOFF-1)** | value.js re-pins its OWN parse-that `^0.8.2→^0.9.0` (realm convergence) | OPEN (value.js still pins `^0.8.2`) | value.js-HANDOFF (OPEN). The hard PREDECESSOR of a clean future parse-that bump; NOT a kf shim. |

> **value.js verdict for I.** The whole next-slice stays value.js-HANDOFF (OPEN), correct,
> working — these are not I waves. The ONE place the I investigation moves the value.js
> ledger is the **empty-input parse contract (B1)** — a NEW ask that is partly a value.js
> defense-in-depth and partly a kf-engine transposition (§3.A). **inv-16 fence note:** the
> I mandate states `src/animation` is NOT fenced this tranche — runtime correctness may
> require an engine transposition. So §3.A's kf-side half (serialize-from-template) is a
> legitimate **KFI** even though its value.js half is a HANDOFF.

---

## §3. THE TWO PRIME I-FOLDS (the deferred/handed-off items the I mandate names)

### §3.A — the value.js empty-input parse contract (B1 / B5) — **KFI (engine transposition) + value.js-HANDOFF (defense-in-depth)**

- **Origin / how it was deferred.** This was NEVER a booked handoff. H.W0 booked the
  `"......"` crash as discharged — but only the FrameCompiler blank-selector path
  (`H/FINAL.md §1 W0`, `25a6434`). The serialization/playback path that resolves a `var()`
  endpoint off a fresh DOM was never touched. `proof:demo-console-clean` certified the HOME
  load (no keyframes pane), so the regression sailed through GREEN. This is the gate-blindspot:
  a booked "fix" whose gate measured the wrong surface.
- **Live state (re-verified this tranche).** `parseCSSValueUnit("")` throws
  `Parse error at offset 0: "......"` — the unambiguous empty-string fingerprint
  (`b5-keyframes-editor.md §4`, proven by `node -e`). It fires on FIRST LOAD of any
  cube/amiga/square scene (the keyframes-pane scenes) via
  `CSSKeyframesToString → at() → interpFrames → processFrame → lerpValue → parseCSSValueUnit("")`
  when `var(--rotationX)` reads back empty off a fresh/detached target. B1 (the rainbow
  group-play toast) and B5 (the editor placeholder) are **one bug, two symptoms**.
- **I disposition: KFI (CRITICAL) + value.js-HANDOFF (paired).** TWO legs, both gestalt:
  - **kf engine transposition (KFI, the primary fix):** the serializer must emit from the
    DECLARED template values, not from a DOM-resolving `at()` interpolation sample. A
    `var()`/`matrix3d` is already valid CSS text — it round-trips verbatim via
    `unflattenObjectToString`; it should never be DOM-resolved to a number to be
    re-serialized (`b5 §5`). This is a `src/animation/format.ts` + `engine.ts` transposition
    — explicitly in-scope per the I "engine NOT fenced" note.
  - **value.js-HANDOFF (defense-in-depth):** an empty computed read-back during interpolation
    must not throw a raw parser error up through the rAF hot path — a `var()` animation that
    mounts before its custom property is set crashes *playback* too, not just serialization.
    This is the **value.js empty-input parse contract** (define `parseCSSValueUnit("")`
    behaviour — return an identity/empty unit, or a typed sentinel, not a throw). It also
    connects to **VJ-5** (the structured diagnostics sink would surface it cleanly).
- **The I gate (REAL runtime).** A playwright probe that opens a `var()`-carrying scene
  (cube/Rotations), force-mounts the keyframes pane, and asserts (a) 0 console errors/warns,
  (b) the pane shows real round-trippable `@keyframes` CSS — NOT the `/* timing-function:
  custom — no CSS twin */` placeholder (which is itself a third defect: a mis-attributing
  catch-block that conflates every throw with the `serializeEasing` custom-closure case,
  `b5 §5`). **Kill the lying placeholder in the same motion.**

### §3.B — the glass-ui specular consume-edge (B7 / B15 / D14) — **KFI (kf consume-edge decision) + glass-ui-HANDOFF (the upstream default)**

- **Origin / how it was deferred.** Cartoon-shadow (CH-1, the design chronic) is owned by
  the chronic lane. The *specular consume-edge* is the NON-chronic residual: glass-ui's
  `<Card surface="glass">` emits `.glass-specular-track` unconditionally with no pointer
  writer, so every glass surface paints a static dead-centred warm-white bloom. H booked
  this as `proof:no-orphan-specular` GREEN by **recording the stage/dock bloom as "sanctioned
  HANDOFF residue"** that "rides `proof:specular-handoff` born-RED, resolves at glass-ui
  3.8.0's `specular='off'`" (`H/glass-ui-AX-handoff.md G-1`,
  `b15-glassui-cards-surfaces.md §B7 source-trace`). The gate passed by *accepting* the
  exact pixels the user calls a defect — the blindspot incarnate.
- **Live state (re-verified this tranche).** The bloom reproduces live and exactly: rest
  opacity 0.35 → hover ~0.59, the `rgba(255,255,255,0.55)` warm-white radial, `--mouse-x`
  **never written** (static centred wash) — on every glass stage Card AND every glass
  `<Button>`/dock icon (cube alone paints 9). **The handoff target is vaporware:**
  - kf pins `~3.5.1`; npm latest is `3.7.0`; the `specular="off"` opt-out exists in NO
    published version (3.5.1…3.7.0). It is in glass-ui's working tree only (commit
    `6fac61a`, in NO tag, `git describe = v3.6.0-116`).
  - 3.5.1 was the DELIBERATE pin — the dock-spring retune is present AND the visible bloom is
    dead at rest there; **3.6/3.7 RE-REGRESS** the bloom (3.7.0 folds the specular into a
    `.glass-material` mixin applied to all five glass rungs + `.glass-card` + dock icons —
    a naive bump makes it MORE pervasive, still unwired, still no opt-out).
  - SECONDARY (B15 finding-4): even where `surface="glass"` resolves correctly, the stage
    glass reads VISUALLY INERT — a `blur(12px)` plate over a uniform flat `#FBFAF9` page has
    nothing to refract, so `proof:stage-glass-card` is a source-shape truth that is not a
    visual truth.
- **I disposition: KFI (the consume-edge decision) + glass-ui-HANDOFF (the upstream default
  softening, unchanged).** The H posture ("keep the bloom, ride born-RED to 3.8.0") is **no
  longer defensible** — the user flagged it twice and glass-ui has shipped the OPPOSITE
  default to its trunk. The I-tranche must DECIDE the kf consume-edge (a root-cause/authoring
  call, not decided here), among the no-fork no-legacy options the investigation enumerates:
  - **(A) drive glass-ui to cut a release containing `6fac61a`**, then bump kf's pin and set
    stage cards `specular="off"` (a bump alone flips them flat). The gestalt fix — blocked
    only on a glass-ui release. **This is the clean glass-ui-HANDOFF half, but it has NO
    automatic landing date (the fix is unreleased), so it CANNOT ride a passive bump.**
  - **(B) the idiomatic consumer escape that exists TODAY:** kf controls the `surface` choice
    and its own demo stylesheet; a scoped kf-edge neutraliser
    (`.glass-specular-track::before { content: none }` / the published
    `prefers-reduced-transparency` bracket glass-ui already ships) suppresses the unwired
    cosmetic at kf's own edge WITHOUT forking glass-ui internals (inv-16: kf consumes
    published siblings, but kf CSS may legitimately neutralise an unwired cosmetic at its own
    edge, `b15 handoff-note 2`).
  - **(C) wire a real pointer listener** in the kf dock/card wrapper if the sheen is to be
    KEPT (the iOS travelling-lens intent).
- **The I gate (REAL runtime).** Invert `proof:no-orphan-specular`: assert the bloom is
  **ABSENT** at rest on the stages (and dock) — `paintsRadial === false` on every stage glass
  `::before` at rest — OR `--mouse-x` actually moves on hover (wired). NOT a source-shape
  check, NOT a born-RED deferral against a non-existent version. The probe template exists
  (`b7-specular.mjs`).
- **The glass-ui-AX-handoff stays valid for the UPSTREAM default** (G-1 wire-or-omit +
  calmer default; G-2 dock-icon tune) — but it must be DECOUPLED from kf's critical path:
  kf cannot wait on a vaporware release. The handoff is for *every other glass-ui consumer*;
  kf resolves its own edge in I.

> **The two prime folds, named once.** B1 = the value.js empty-input parse contract (a
> never-booked engine/value.js seam). B7 = the glass-ui specular consume-edge (a booked
> handoff against a vaporware target). **Both FOLD into Tranche I.** Both expose the same
> meta-failure: a HANDOFF/deferral whose gate was authored to pass on a fiction (the
> empty-parse never gated on the keyframes pane; the specular gated on "accepted residue").

---

## §4. parse-that — sibling-HANDOFF (one WITHHELD re-key; not an I fold)

| id (origin) | item | live status | I disposition |
|---|---|---|---|
| **PT-1 (LD-PT-1/PT-4)** | the `(id,offset)` packrat re-key — WITHHELD | `packrat.ts:61,82` id-only `MEMO.get(p.id)` latently wrong; isolated, opt-in BBNF left-recursion, ZERO production consumers | parse-that-HANDOFF (internal soundness). Author `proof:packrat-position` FIRST, THEN re-key. NOT a re-pin predecessor, blocks nothing. **Not an I fold.** |
| **PT-2 (PT-3b)** | span-first core unification | BOOK | parse-that-HANDOFF (BOOK, dedicated parse-that tranche). **Not an I fold.** |
| **PT-5** | per-combinator closure alloc (build-time) | RECORD — ALREADY-SOTA | RECORD. Do NOT chase the un-portable Rust `SmallBox`. |

The parse-that leaf tier + PT-1/PT-2/PT-3 landed clean in 0.9.0, consumed via the G re-pin
(done). parse-that has **no I-relevant carry** beyond the one internal re-key.

---

## §5. glass-ui — the AW/AX-tranche consume-edges (BOOK/HANDOFF; one ties to D11)

Beyond the specular (§3.B, the prime fold), the glass-ui HANDOFF carry:

| id (origin) | item | live status | I disposition |
|---|---|---|---|
| **GH-1 / D5 dock-spring** | the dock LAG / `--spring-dock` retune | RESOLVED — `53c1b07` retune published in 3.5.0+; kf consumed via the `~3.5.1` bump | **done (consume-leg landed).** `proof:dock-morph-settled` was the paired gate. *(B8 "dock animations slow" is a SEPARATE motion-pipeline issue — owned by the perf/dock I lane, see `b8-dock-glassui-perf.md` / `b16-perf-profile.md`; not this design handoff.)* |
| **GH-3 / D13 drawer `spring` prop** | glass-ui `DrawerContent spring` prop | BOOK (the demo ships its OWN bespoke `SpringProgress` sheet — H.W7) | glass-ui-HANDOFF (BOOK, LOW). Not on kf's critical path; the bespoke sheet is the kf path. |
| **GH-4 / GG-3 / H-1 / FB-4** | `startViewTransition({types})` directional VT helper + CSS | glass-ui-owned (AW tranche); the demo VT consumer (`useSceneTransition.ts`) waits | glass-ui-HANDOFF (OPEN, MED). Ties to **D11** (scene interactivity) + the FB-4 directional-VT BOOK. Paired born-RED demo-smoke VT-types assertion. **BOOK — not an I fold unless D11/FB-4 is elected.** |
| **GH-5 / GG-6** | the one direct `reka-ui` `SelectIcon` reach | ALREADY RETIRED (0 `from "reka-ui"` in demo src) | RECORD. Reframe to a no-NEW-reach invariant; green today. |
| **G-3 / LabeledField `orientation`** | the durable label-left/value-right controls-row home | glass-ui-owned (`utilities.css`); kf greens demo-side `grid-cols-[auto_1fr]` today | glass-ui-HANDOFF (HIGH for the durable home) + kf demo-side path exists. The macOS/iOS settings-row idiom. |
| **OUT-1..6** | glass-ui-owned (`LabeledField` a11y; `--spring-*` codegen LANDED; reka-Tabs; display-type fluid-step; VT types helper) | glass-ui domain | OUT (glass-ui AW/AX). Re-verify enablers stay stable across the `~3.5.1` consume; no kf patch. |

> **glass-ui verdict for I.** Apart from the specular consume-edge (§3.B, KFI), the glass-ui
> carry is correctly BOOK/HANDOFF and OUT. The `{types}` VT helper (GH-4) is the one that
> would fold IF I elects D11/FB-4 scene-transition interactivity. The dock-spring (GH-1) is
> done via the `~3.5.1` bump.

---

## §6. The engine / perf BOOKs (net-new scope; mostly stay deferred)

These are genuine net-new engine scope with carried gates — NOT papered design chronics.
Most stay BOOK / MEASURE-FIRST. The I "engine NOT fenced" note means an engine transposition
is *permitted* where runtime correctness demands it (§3.A) — but these specific BOOKs are
feature-adds, not correctness fixes, so they remain deferred unless explicitly elected.

| id (origin) | item | live status | I disposition |
|---|---|---|---|
| **LD-FB1 / FB-1 / NEW-13** | `animation-composition` HONORING (WAAPI `composite` + rAF accumulate) | CAPTURE landed (`adapter.ts:29`); HONORING BOOKed; the G.W17 blend prereq is FIXED (`group.ts:309-341`) | BOOK (engine, now UN-blocked). SHIP-if-elected, gate `proof:composition` (presupposes `proof:blend`, green). Not a user defect. |
| **LD-FB2 / FB-2 / MF-3** | the HELD `Animation`/group async sync-step half | `engine.ts` still async `advanceTo`/`_frame` (carries `yieldToMain` INP relief + event ordering) | MEASURE-FIRST — build `proof:event-ordering` FIRST, then convert behind a byte-identical-event-sequence assertion. ~43 ns interior + ~2.1 µs/frame upside. |
| **SoA `lerpArray` (G-2 / SUP-2)** | the bimodal-K numeric-segment SoA consumption | MEASURE-FIRST gated (real-K corpus + byte-lock + K=1-alias counter + X-1 cross-engine witness) | MEASURE-FIRST. Requires `proof:interpolate-anything` green on the same corpus. |
| **LD-FB3 / FB-3 / C-5** | MorphSVG consumer | `fromDrawSVG` sliver landed G.W13; the arc-length sampler needs VJ-F1 | BOOK + value.js-HANDOFF (gated on VJ-F1). The one real persisting competitor gap. |
| **LD-FB5 / FB-5** | intrinsic-size `0→auto` | NO `interpolate-size`/`calc-size` path; not cross-engine-Baseline as of 2026-06 | BOOK (engine, guarded-enhancement) + value.js-HANDOFF (E7). VERIFY Baseline FIRST; the genuine JS fallback = measure-to-px (NO polyfill). Highest user-demand engine BOOK. |
| **LD-FB6 / FB-6** | `Mod+K` command palette | discovery trigger landed; no palette component | BOOK (demo, LOW). Invoker Commands Baseline 2025-12-12. DECIDE owner (demo-local vs glass-ui shell). Not a user defect. |
| **LD-DIAG / VJ-F2 kf half** | `ResolvedKeyframes.diagnostics` channel | producer half landed (parse-that PT-1) | BOOK (kf seam) + value.js-HANDOFF (the structured sink). **CROSS-REF B1/§3.A** — the cleanest surface for the empty-parse signal. |
| **FB-4 typed/directional scene-VT** | directional VT | glass-ui H-1 gated (= GH-4) | BOOK → glass-ui-HANDOFF (paired). Directional VT Baseline 2026-01-13. Ties to D11. |
| **A7 cube `idle-bob` CSS dogfood** | drive the resting bob from a `CSSKeyframesAnimation`/`hover()` preset | `CubeTarget.vue:140-155` raw `@keyframes idle-bob`, PRM-gated | BOOK (demo, inv-ζ cohesion). Not a user defect; a cohesion nit. |
| **A9 matrix-editor `acos` Euler recovery** | `useTransformState.ts:61-67` recovers Euler via `Math.acos` — latently wrong under non-unit scale | the born-RED witness `proof:matrix-decompose-correct` already fails | BOOK / MEASURE-FIRST (demo editor correctness). Latent (cube never scales via this path). DECOMPOSE via `mat4.getScaling`/`getRotation`. |
| **K-5 write-substrate** | CSS Typed-OM per-frame write | KILL-the-carrier; the write substrate stays gated | MEASURE-FIRST (only-if-a-bench-bites + zero-alloc-preserved). |

---

## §7. The DC-8 dead-CSS twice-deferred item (a genuine A→C carry — DECIDE in I)

| id (origin) | item | live status | I disposition |
|---|---|---|---|
| **DC-8** | scene-swap View-Transition **dead CSS** — booked-forward in A, lost in W3, twice-deferred (`C/audit/lanes/deferred-ledger.md` #6, `:124`) | the H ledger carried it as KFH-DECIDE (KILL the dead CSS or RESTORE via `startViewTransition`, fold into FB-4) | **KFI-DECIDE (no third defer).** Either delete the dead scene-swap CSS or restore via a live `startViewTransition` (ties to FB-4 / GH-4). The P-invariant forbids a fourth defer. `grep` dead scene-swap CSS = 0 after the decision. **A small but genuine fold — it has run out of forward-references.** |

---

## §8. deploy — the constellation/deploy HANDOFFs (NOT a kf write)

| id (origin) | item | I disposition |
|---|---|---|
| **G-HANDOFF-3 / DEP-1 (P0)** | `dns-cf-sync.sh` `keyframes.pages.dev → keyframes-8uq.pages.dev` (DNS drift) | deploy-HANDOFF (P0). Authoritative target = kf's `deploy-pages.yml:4-5`; a blind sync REGRESSES the live CNAME. kf AUTHORS the target, deploy WRITES. |
| **G-HANDOFF-2 / DEP-2** | distil kf's `deploy-pages.yml` → `deploy/templates/deploy-pages.yml` | deploy-HANDOFF (kf AUTHORS, deploy WRITES). |
| **G-HANDOFF-4 / DEP-3** | constellation roster docs-lag (kf now `4.1.0`; spine should bump to match); G-CONST-4 phantom submodule = KILL | RECORD (fourier-hub / kf-ahead; not a kf write). |

These are deploy-owned; recorded for sequencing completeness. **NOT I folds** (kf authors,
deploy writes). Note B9's `ENOENT: assets/icons/easing-icon-sm.svg` (a dev-vs-build
icon-resolution discrepancy) + the x47 source-map errors are a **kf-demo build/asset issue**
(owned by the B9 icon-pipeline I lane, `b9-icons-assets.md`), NOT a deploy handoff — flagged
here only so it is not conflated with the deploy band.

---

## §9. RECORD / KILL — re-affirmed, do NOT re-litigate

The ARCH-kill wall (A→H, re-verified terminal; no consumer pull; no live evidence reopens
any). These are correctly-deferred-permanently — none folds into I.

- **K-1** ScrollTimeline-native-REPLACE (the bridge is ADDITIVE; E.W9 dual surface).
- **K-2** Worker / OffscreenCanvas / Atomics / Animation Worklet (Houdini Chromium-only).
- **K-3** `dev.sh`/`deploy.sh` (npm scripts are the contract; CF-Pages `pages-deploy.sh`
  superseded gh-pages — note this is distinct from §8's deploy-pages template).
- **K-4** WASM-parser-replace (lightningcss marshalling tax fatal; pure-TS single-pass
  shipped 0.9.0).
- **K-5** CSS Typed-OM as the interp CARRIER (the WRITE substrate stays MEASURE-FIRST, §6).
- **K-6** per-property keyframe easing (ALREADY-CORRECT by spec).
- **K-7** `fromString` multi-animation (one `CSSKeyframesAnimation` IS one animation;
  multi → the AnimationGroup tier).
- **K-8** demo-frontier non-adoptions (`content-visibility:auto` precondition absent;
  Speculation Rules MPA-only; **RE-VERIFY Interest-Invokers Baseline in I** — re-open as a
  measure-first showcase ONLY if now Baseline).
- **K-9** chevrotain-codegen rewrite (TRANSPOSE in pure TS, don't rewrite).
- **D1** frozen-shape `ValueUnit` monomorphization (measured non-win, mono≈mega).
- **SUP-7** bit-packing the frame id / time index / dispatch (no headroom three ways).
- **RECORD (settled):** C-2 (rename closed) · C-3/F3 (eviction → value.js-gated, §2 VJ-7) ·
  MF-4/5/6/10 + W8 S1/S3 (settled re-measures) · PT-5 (build-alloc SOTA) · G-CONST-4 phantom
  submodule (= KILL, asymmetry-is-intent) · G-CONST-5/6 (kf-AHEAD / docs-lag) · **the C-6
  engine line-ceiling watch-note (`engine.ts` was 1375/1400 at H-open; §3.A's
  serialize-from-template transposition must respect the ceiling or re-baseline it with a
  measured cohesive split).**

---

## §10. done — shipped A→H, struck from the OPEN ledger

The RE-PIN spine (RP-1..RP-5 — value.js `^0.11.1` / parse-that `^0.9.0` / glass-ui then
`^3.4.0`, NO `file:`) · the 0.11.1 charter slice (A1/A2·B1b/B3+B5·C1·C5·D2·F7, consumed via
the `lerpValue` seam, ZERO kf edit) · parse-that PT-1/PT-2/PT-3 · G.W17 dead-blend leaf
(`group.ts:309-341`) · G.W13/W18/W19 additive surfaces (DrawSVG / `.finished` /
`adoptCompiled` / orbital rotate3d) · C-6 line-ceiling DECISION (G.W5) · C-2 rename · DP-1
dock kf-half rename/barrel · DP-2 D FINAL · GG-2 stub · FB-1 CAPTURE half · the GH-1
dock-spring consume-leg (the `~3.5.1` bump) · GG-6 reka reach (RETIRED). The rAF-leak HIGH
(G.W9) is done — but D12 is the SAME failure domain one step deeper (the scene-state machine,
owned by the H.W1/I scene-state lane), hence not in this non-chronic ledger.

---

## §11. THE I ROLL-UP — what FOLDS, what stays deferred

**KFI (fold into Tranche I — the deferred/handed-off items that are LIVE I scope):**
- **§3.A — the value.js empty-input parse contract (B1/B5).** KFI engine transposition
  (serialize-from-template) + value.js-HANDOFF defense-in-depth. CRITICAL — a live crash.
- **§3.B — the glass-ui specular consume-edge (B7/B15/D14).** KFI consume-edge decision
  (suppress-at-kf-edge or drive-a-glass-ui-release-then-bump) + glass-ui-HANDOFF (the
  upstream default softening, decoupled from kf's critical path — the H born-RED-to-3.8.0
  target is VAPORWARE). A live appearance defect.
- **§7 — DC-8 scene-swap dead CSS.** KFI-DECIDE (KILL or RESTORE; no fourth defer).
- *(Conditionally)* **GH-4 / FB-4 `{types}` directional VT** — folds IF I elects D11 scene
  interactivity; else BOOK.

**value.js-HANDOFF (OPEN next slice, CHRONIC-by-design C-1, ZERO kf edit on consume):**
VJ-1 (E1/E2) · VJ-2 (VJ-F1) · VJ-3 (F2/F2b) · VJ-4 (MCI-5, witness IS the signal) · VJ-5
(VJ-F2 sink — cross-ref B1) · VJ-6 (VJ-F4) · VJ-7 (F3) · VJ-8 (F6) · VJ-9 (realm
convergence). *(None an I wave; they ride the next re-pin.)*

**parse-that-HANDOFF:** PT-1 (`(id,offset)` re-key, internal soundness) · PT-2 (span-first
core, BOOK).

**glass-ui-HANDOFF / BOOK (NOT folds, save §3.B):** GH-3 drawer prop (BOOK, LOW) · GH-4
`{types}` (OPEN, ties D11) · G-3 LabeledField `orientation` (HIGH for the durable home) ·
OUT-1..6.

**BOOK / MEASURE-FIRST (engine net-new; stay deferred unless elected):** FB-1 composition ·
FB-2 sync-step · SoA `lerpArray` · FB-3 MorphSVG (→ VJ-F1) · FB-5 intrinsic-size · FB-6
palette · LD-DIAG diagnostics · A7 cube idle-bob · A9 matrix Euler · K-5 write-substrate.

**deploy-HANDOFF (kf authors, deploy writes):** DEP-1 (P0 CNAME) · DEP-2 (template) · DEP-3
(roster docs-lag, RECORD).

**RECORD / KILL (do NOT re-litigate):** K-1..K-9 + D1 + SUP-7 · C-2/C-3 · MF-4/5/6/10 + W8 ·
PT-5 · G-CONST-4/5/6 · the C-6 ceiling watch-note (the §3.A transposition must respect it).

**USER-DOMAIN:** the I re-publish (a version bump, owner Mike Babb — stacks atop 4.1.0).

---

## §12. THE ONE-SENTENCE VERDICT

The historical *engine/parse/re-pin* deferred ledger is genuinely clean and the value.js /
parse-that / engine BOOKs are correctly OPEN sibling-HANDOFFs that stay deferred — but **two
items that H booked as DISCHARGED or HANDOFF-paired-with-a-born-RED-gate are, in the running
demo, live broken defects:** the **value.js empty-input parse contract** (B1 — the `"......"`
crash returned via a never-gated serialization path) and the **glass-ui specular
consume-edge** (B7 — a born-RED handoff parked against a vaporware `specular="off"` that the
latest published glass-ui makes WORSE). **Both FOLD into Tranche I** (the empty-parse as a
KFI engine transposition + value.js-HANDOFF; the specular as a KFI consume-edge decision +
decoupled glass-ui-HANDOFF), joined by the twice-deferred DC-8 dead-CSS DECIDE — because the
gate regime that let them "exit" measured source-shape and load-time, never runtime, never
the keyframes pane, never the resting pixel the user calls a defect.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/I/audit/recap-deferred.md`. ZERO source/test/CI edits.
Every row chains a named prior ledger (`H/audit/_SYNTHESIS-deferred-ledger.md`,
`a-deferred-ledger.md`, `G`/`F`/`E`/`C` ledgers, the H HANDOFF charters) and/or a LIVE
Tranche-I anchor: the pins (`package.json` `@mkbabb/value.js ^0.11.1` / `@mkbabb/parse-that
^0.9.0` / `@mkbabb/glass-ui ~3.5.1`, version `4.1.0`); the empty-parse fingerprint
(`b5-keyframes-editor.md`: `parseCSSValueUnit("") → "Parse error at offset 0: ......"`); the
specular vaporware (`b7-specular-glassui.md` / `b15-glassui-cards-surfaces.md`: npm tops at
3.7.0, `6fac61a` in no tag, 3.7.0 makes the bloom MORE pervasive). The four design chronics
(cartoon-shadow, φ-typography, mobile, dock) are OUT-of-this-lane (the chronic ledger owns
them); this is the **non-chronic** deferred recap. **P-invariant at the I level: every carry
exits with an I disposition — KFI, sibling-HANDOFF, BOOK, RECORD/KILL, or done — and the two
fictional handoffs (B1, B7) are converted to real I-folds.**
