# K-SEED — the frontier divination (the Tranche-K charter seed)

**Provenance:** the frontier-research fleet (2026-06-10) — 10 research lanes (each fusing
WebSearch-verified platform/competitor evidence with the J corpus + source grounding) + 2
adversarial judges (`JUDGE-1-kill-respect-onbrand.md` — zero overrides issued on the merits;
`judge-ranking.md` — the ranking + the K shape). This document is the orchestrator synthesis:
the divined improvements that push kf past the 2026 frontier, dispositioned. **K is a SEED,
not a tranche: it develops only after the J implementation closes, on its own authorization
— exactly the dev/impl boundary.** Nothing here is implemented or authored-as-waves yet.

---

## §0 The thesis (one spine, three faces, two engine headlines)

The fleet's six K-HEADLINE candidates collapse into ONE charter sentence:

> **Tranche K makes kf's CSS-@keyframes round-trip TOTAL — the engine reads the live web's
> CSS, drives it with physics and perceptual color the platform lacks, and emits it back as
> zero-runtime CSS — closing the scroll-orchestration gap in the only shape no imperative
> library can occupy, and honoring every operator the source declares; all proven by
> replay-pixel-equality and an honest refusal surface.**

The round-trip axis (kf's axis-1, the moat no competitor can structurally enter — their
authoring object is not CSS) expands in every direction at once: **forward** (ingest the
live page's CSSOM), **backward** (compile JS-authored orchestration to zero-runtime CSS),
**to the scroll grammar** (animation-timeline/range/trigger as parseable source of truth),
**to the collection offset** (stagger → sibling-index/nth-child delays), and **to agents**
(the proof corpus as a consumable surface). Plus the two orthogonal engine headlines: the
**fidelity floor** (honor the author-declared `animation-composition` the engine currently
drops) and the **physics×blend fusion** (spring-driven layer weights — only possible on
kf's weighted-blend substrate).

## §1 The TOP-3 (ranked: impact × uniqueness × feasibility)

| # | Candidate | The case | Effort |
|---|---|---|---|
| **1** | **CC-1 — the CSS COMPILER** (`css-compiler.md`) | Compile `AnimationGroup`/`Sequence`/`stagger` → a ZERO-RUNTIME pure-CSS artifact (@keyframes + animation-* longhands + linear() springs + animation-composition layering), with an honest ineligibility report (the four refusals: weighted blend / custom renderers / perceptual oklab / computed-unit drift — `waapiIneligibleReason` generalized to the CSS domain, CC-3). Structurally impossible for GSAP/Motion/anime — their tween model is not CSS, so "export to CSS" is a lossy re-derivation nobody ships; kf's `format.ts` is the parser run backward over the same data model. The platform crossed the faithfulness threshold (linear() Baseline-wide 2026-06-11; animation-composition; @property). Out-expresses hand-authored CSS on oklab densify (CC-2) and eased origin-aware stagger (CC-S → the canonical `staggerCSS()` emitter, K-T2). The demo's "Export CSS" button (CC-4) makes the editor a CSS animation IDE — a product category the field lacks. Gate: the compiled CSS replayed side-by-side vs JS playback, pixel-compared. | XL (the K anchor) |
| **2** | **K1 — LIVE-STYLESHEET INGESTION** (`live-stylesheet-ingestion.md`) | `fromStyleSheets()`/`fromLiveAnimations()` — walk the CSSOM, adopt every @keyframes + animation-* declaration into kf objects: scrub, retime, spring-ify, perceptually re-color the live web's OWN animations. M-effort precisely because there is NO parser work — `CSSKeyframesRule.cssText` emits exactly what `resolveKeyframes` (adapter.ts:97) already eats. K2 `adopt()` extends the round-trip into the TEMPORAL dimension (seamless mid-flight takeover of a running CSS animation via `getAnimations()` currentTime handoff — the canonical owner of the adopt/takeover seam, absorbing WL2-C's overlap). K1∘CC-1 = the full ingest→recompile loop. | M (+L for adopt) |
| **3** | **SO-1 — SCROLL ORCHESTRATION AS CSS** (`scroll-orchestration.md`) | The field's #1 named gap, closed the only-kf way: parse + round-trip the scroll grammar (animation-timeline: scroll()/view(), animation-range, timeline-scope, the animation-trigger layer the CSS WG is absorbing FROM ScrollTrigger) and DISPATCH per the conservative-correct delegation philosophy — native compositor ScrollTimeline where eligible, the kf ScrollScene JS driver (SO-2: SmoothProgress scrub + snapDecay physics, composing shipped primitives) where the platform falls short (Firefox-today, pin smoothing, snap). Pin = position:sticky SYNTHESIS (SO-3 — kf authors the platform's pin; transform-pinning SO-4 is KILLED: cross-thread jitter). NOT the ScrollTimeline-native-replace ARCH kill: this ADDS a parse+dispatch tier above the JS driver and never deletes it. kf becomes the cross-browser interpreter of the syntax the WG itself is shipping. | L |

## §2 The other three headlines (re-ranked by the judge into the K shape)

- **WL2-B — animation-composition HONORING** (`waapi-level-2.md`) — the RIPEST item in the
  fleet and the designated K.W0 LEAD: `adapter.ts:24-29,120-126` already captures the
  author-declared `animation-composition` (add/accumulate); `engine.ts` never reads it
  (grep-verified zero hits) — the engine silently DROPS a declared CSS operator. Honoring it
  on rAF (the additive accumulate path) and WAAPI (composite support) is M-effort,
  born-RED-witnessable, and a CORRECTNESS floor the compiler (CC-1) then inverts. The
  round-trip must be honest before it is widened.
- **PHYS-C — SPRING-DRIVEN BLEND WEIGHT** (`physics-frontier.md`) — the only axis-3 headline:
  physical layer crossfades on the weighted-blend compositor (a spring drives the blend
  weight between animation layers). Only POSSIBLE on kf's substrate — no competitor has a
  weighted blend tier to drive. The flagship demo moment. Riders: PHYS-B2 `reseatToSpring`
  (velocity-continuous interruption of a PARSED-CSS animation — needs round-trip + spring
  algebra + linear() twin simultaneously, i.e. needs kf) and PHYS-E intensity-scaled
  reduced-motion (the ONE PRM gate takes a scale, not a boolean — net-new in the field,
  WCAG 2.3.3-aligned).
- **ED-1 — the AGENT-CONSUMABLE SURFACE** (`ecosystem-distribution.md`) — llms.txt + the
  proof corpus as a public artifact + a `proof:agent-surface` gate: only a proof-gated
  library HAS a proof corpus to expose; the 2026 B2A convention is the distribution face.
  Riders: ED-2 `@mkbabb/keyframes-vue` (a thin NEW adapter — the "extract the demo
  composables" framing was researched-FALSE, they are demo-coupled), ED-3 the dogfood
  inversion (the demo consumes the PUBLISHED barrel — the boundary-ORACLE at the package
  boundary), ED-4 the public color-FIDELITY conformance harness (the one benchmark only kf
  can publish honestly: midpoint deltaE vs CSS Color 4, not a throughput pissing match).

## §3 The implied K shape (from `judge-ranking.md` — a seed, not a spec)

**K.W0 FIDELITY FLOOR** (WL2-B composition honoring + the full diagnostics channel K3) LEADS
— the round-trip made honest. → **K.W1 INGEST** (K1 + K2 adopt) ∥ **K.W2 SCROLL-AS-CSS**
(SO-1/SO-2/SO-3, consuming PHYS-D snapDecay + SO-5 entry batching). → **K.W3 COMPILE**
(CC-1/CC-2/CC-3 + the canonical staggerCSS K-T2 + the editor Export button CC-4) — the
anchor, inverting W0's honoring, composing with W1's ingest. ∥ **K.W4 PHYSICS-ON-THE-AXES**
(PHYS-C + PHYS-B2 + PHYS-E). → **K.W5 EXTERNALIZE** (ED-1/ED-2/ED-3/ED-4) closes, gated on
J.W5's publish having landed.

## §4 The J-amendments (folds applied NOW, dev-phase — each is S-effort and in an existing wave's scope)

| Item | From | Into | What |
|---|---|---|---|
| ED-5 | ecosystem lane | **J.W5** | remove the spurious `vue ^3.5.0` peerDependency from the Vue-free library (package.json:161-162; verified: src/ references vue only in the dev-only env.d.ts shim) + a proof:published-surface peer-dep clause |
| WL2-A | waapi-level-2 lane | **J.W5** | the WAAPI-Level-2 positioning paragraph + correspondence table in README/docs (capability is SHIPPED; API-mimicry of the unshipped L2 spec is KILLED — SequenceEffect is proposed for deletion upstream) |
| K-T4 | text lane | **J.W5** | the "structural stagger, the CSS way" docs recipe (zero new code; sibling-index() + kf stagger; honest a11y framing) |
| CE-1.0 | compositor lane | **J.W6** | the Safari linear()-HW-accel hazard guard on the CURRENT spring-WAAPI path (waapi.ts:316-318 emits linear(); Safari refuses HW-accel for linear()-eased animations — verify + guard or document) |
| K3-internal | ingestion lane | **J.W1** | the two engine-internal diagnostics rows (EMPTY_PARSE / UNKNOWN_TIMING_FN) ride the same totality motion as the typed selector throw; the FULL diagnostics channel stays K.W0 |

(The judge OVERRODE two fleet J-FOLD tags as not-in-J-scope: SO-5 scroll-entry batching and
PHYS-D snapDecay both presuppose the K.W2 ScrollScene driver — they are K.W2 sub-items.)

## §5 The anti-charter — the 12 researched KILLs (negative results, non-re-litigable)

| KILL | Why (the one-line verdict) |
|---|---|
| VT-A flipShared→VT dispatcher | inv-16 breach (glass-ui owns the VT helper) AND the rAF FLIP keeps content live/sharp where VT animates rasterized snapshots |
| VT-B parse ::view-transition @keyframes | kf parses @keyframes BODIES, not stylesheet RULES/selectors — a NEW grammar (value.js's job if anyone's), zero workload |
| CE-2 @property registration for compositing | registered customs substitute as computed values and rasterize per-frame on the MAIN thread (Chromium #1411864 unshipped) |
| CE-3 compositor-offloaded oklab ramp | color does not composite — paint-triggering, period; the "only engine with compositor perceptual color" framing is platform-false |
| EPF-2 interpolation JIT | the premise is false: dispatch is already monomorphic-per-iv via value.js `_lerp` kernels installed at compile() (utils.ts:339); a closure emitter is eval-class bloat for a sub-25% residue |
| EPF-5 adaptive quality (general) | silently sheds AUTHOR-DECLARED intent; the blend axis IS the product — never degrade it behind the author's back (the narrow adaptive-readout is BOOKed) |
| K-T1 kf-owned splitText | off all three axes; DOM-mutation kf doesn't own; measured 2026 a11y hazard; GSAP-me-too |
| K-T3 Custom-Highlight-API animation | a four-property paint mask, not a motion substrate — no box, no transform, no geometry |
| SO-4 transform-pinning | scroll repaints on a different thread — transform-tracked pins jitter/desync; position:sticky synthesis (SO-3) is the only correct pin |
| CC-7 blanket @starting-style | platform-incorrect: @starting-style governs TRANSITIONS from display:none/insertion; an @keyframes 0% stop already declares its start |
| ED-6 JSR publish | provenance already owned (npm --provenance in release.yml); JSR transpile-on-publish would LOSE the hand-tuned static/dynamic boundary |
| PHYS-A coupled vector springs | a vector spring IS N independent per-component springs (Orange Duck/Juckett/SmoothDamp unanimous); the coupled form is physics-sim neighborhood, not animation — trivial VectorSpring sugar may ride a K wave |

## §6 BOOKs (recorded, with named tripwires)

CC-5 static-weight pre-multiply (inside K.W3, after CC-1) · CC-6 @supports PE variants
(tripwire: sibling-index()/scroll() Baseline) · VT-D cross-document VT (tripwire: Baseline +
a JS insertion seam existing) · K4 LoAF self-instrumentation (tripwire: LoAF Baseline; only
the hard-attribution layer is on-brand) · K5 the embeddable inspector (a distribution
narrative — revisit after K1∘CC-1 exists) · EPF-1 engine-level read/write phase separation
(uniquely on-brand via the cq-unit forced-layout reads, but MEASURE-FIRST against a real
multi-animation computed-unit workload) · EPF-3 cross-element matrix batch (the SoA core is
J.W6's PF-8; the increment is generic numerics, off-axis) · ED-2-React (after the Vue
adapter proves the shape) · EPF-4 warmEngine() rides any K wave (S).
