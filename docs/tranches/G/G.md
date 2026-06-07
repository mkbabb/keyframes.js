# Tranche G — keyframes.js: the published F sibling-wins CONSUMED on the re-pin spine · the post-F W10/W12 idiom-drift swept · the two gated decisions taken · a large, honest ALREADY-SOTA refusal

G is keyframes.js' seventh tranche, and the **narrowest yet**. D refined the demo to
the engine's own encapsulation + KISS standard, transposed the engine to its gestalt
(the `AnimationGroup` zero-alloc tail, the `tick`→`advanceTo` driver canon, the
`FrameCompiler` split), localized the design language, and was the terminal home for
*every* keyframes-owned deferral (P-invariant-28 — zero perpetual punts). E made the
demo fast + modern-web-aligned, completed the vueuse listener/observer gestalt, fixed
five engine correctness bugs test-locked, shipped the orchestration tier as additive
public API, and opened the platform-adoption seam. **F was the narrow finisher** — it
landed 16 gated waves (the dict-mode buffer fold, the computed-endpoint memo, the
parsing consumption-seam correctness cluster, the orchestration finish + dogfood, the
CI `proof:all` wiring, MotionPath), DROVE the value.js + parse-that + glass-ui
hand-offs to **publication**, and RELEASED the `4.0.0` stack (value.js `0.11.0`,
parse-that `0.9.0`, glass-ui `3.3.0` all on the registry; keyframes.babb.dev on
Cloudflare Pages).

**G is narrower still.** The 16-agent post-F deep assay (16 phase-1 lanes + the
Playwright demo lane + 5 synthesis lanes) is unanimous: **~90–95% of the post-F surface
is ALREADY-SOTA, and G manufactures almost nothing.** Every phase-1 lane carries an
explicit ALREADY-SOTA section that is the bulk of its content. G has **ONE spine** — the
dep RE-PIN that consumes the published F sibling-wins kf itself DROVE but never
consumed — and around it: a thin re-audit set that confirms the kernel, the boundary,
the grammar, the state tier, the CI spine, and the modern-web surface are exemplary; a
finishing sweep of the post-F W10/W12 scenes that re-forked retired idioms; the
Playwright demo SHIPs; two gated decisions that must not be re-deferred; two narrow
net-new engine SHIPs; and the cross-repo HAND-OFFs the user can drive under relaxed
inv-16. **G proves itself net-new by what it leaves untouched as much as by what it
ships.**

## § Phase — TRANCHE DEVELOPMENT (the audit + these docs; implementation awaits authorization)

G is in DEVELOPMENT now, on branch `tranche-g-dev` (D+E+F IMPLEMENTED + RELEASED — kf
`4.0.0`; value.js `0.11.0`, parse-that `0.9.0`, glass-ui `3.3.0` all PUBLISHED).
The deep audit is RUN — the evidence is on disk under `docs/tranches/G/audit/` (16
phase-1 lanes + `a-demo-playwright` + 5 `_SYNTHESIS-` synthesis lanes, each
`file:line`-grounded with a SHIP/MEASURE-FIRST/BOOK/RECORD/HANDOFF/KILL disposition and
a re-runnable instrument). This charter (`G.md`), the gap-scorecard, the prompt-recap,
and the deferred-ledger are the DEVELOPMENT artifacts. **G.W1–G.WZ are
authored-now-run-later wave specs; the implementation phase opens only on explicit user
authorization, gated on keyframes' own green CI — exactly D.W0's, E.W0's, and F.W0's
dev/impl boundary.** No engine, demo, library, parser, test, or bench source is written
in development. **This is TRANCHE DEVELOPMENT — docs ONLY, ZERO source/test/CI/demo
edits.**

## § Mandate (binding — every wave, every fold, every hand-off · the spine)

The standing precepts, carried verbatim-in-substance from `F/F.md:35-63`
(themselves from `E/E.md:26-53`), re-confirmed HONORED across A→F
(`audit/_SYNTHESIS-prompt-recap.md §Precepts`), and BINDING on every G wave
(G.W1–G.WZ), every gate, and every cross-repo hand-off this tranche emits:

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only. A wave
  may not pin a bug as a "documented contract", patch a symptom at the wrong seam, or
  offer a weaker-alternative escape hatch beside the real fix. The hard gates are
  written to pass ONLY the transposition. (Specifically forbidden for G: the re-pin is
  the genuine consume-leg, **NOT** a vendored patch; the held sync-step half stays held
  until its event-ordering lock exists, **NOT** assertion-shipped; G.W12 **REMOVES** the
  `:always-expanded` occlusion-dodge mask, it does not re-mask in the demo.)
- **Architectural transpositions for elegance · simplicity · performance are NECESSARY
  AND DESIRABLE** — this is a development product. G's transpositions: the re-pin lights
  the F.W6 computed-endpoint memo + the color-channel plan + the dispatch LUT kf already
  designed for through the single seam (perf + correctness); DrawSVG mirrors the
  `motion-path.ts` CSS-native transposition; `serializeEasing` becomes round-trip-honest
  (correctness).
- **NO legacy code** — no compat alias, no deprecated path beside its replacement, no
  polyfill (feature-detect with the JS path as the genuine fallback). A replaced surface
  is replaced in one motion; a removed name is removed. (G-specific: the
  `parseLinearStops` shim at `src/animation/utils.ts:106-130` RETIRES when value.js E1
  lands — the no-legacy collapse; the `glass-ui file:../glass-ui` filesystem link is
  REPLACED by the `^3.3.0` semver pin, not kept beside it; the `dock/index.ts`
  pass-through barrel is DELETED, not re-exported.)
- **NO god modules** — decompose >500L ONLY where genuinely cohesive + befitting. The
  `Animation` class is at its gestalt per `F.md NEW-3` (re-verified post-+99L growth);
  the line-ceiling is a GATED DECISION, **NOT** a reflexive split. KISS · DRY · no nested
  imports · no test-in-src. Styling ISOMORPHIC unless highly befitting (named deltas).
- **MEASURE-FIRST** — every perf claim lands behind a shaped biting bench or is
  recorded-withheld WITH the measurement (the `d3-changed-keys.measure.test.ts`
  gold-standard bar). **inv-16 RELAXED for G impl** — the user drives value.js /
  parse-that / glass-ui too — but each sibling is its own surface, AUDITED as such, and
  cross-repo items are HAND-OFF-tagged (propose + sequence, never silently merge).

**ENFORCEMENT (inv ε):** every code claim in this charter cites a `file:line` or a named
phase-1 lane; every disposition is tagged; the §ALREADY-SOTA record (§ below) is binding
— no wave may manufacture a deficit where the post-F state is exemplary. An adversarial
precept sweep over the authored tranche (alias/shim/back-compat/polyfill/punt-language/
escape-hatch classes) found NO violation: the re-pin is the consume-leg (not a vendored
patch), the `parseLinearStops` shim retirement is gated on value.js E1 (not patched
in-place), the held `Animation`/group sync-step half is locked OUT by an event-ordering
parity test (no half-measure ships), the glass-ui occlusion fix REMOVES the mask (the
workaround) rather than tuning it.

## § The invariant set carried into G

| inv | Statement | G posture |
|---|---|---|
| **inv-16** | kf writes only keyframes.js; value.js + parse-that items are HAND-OFFs | **RELAXED-for-G-impl** — the user drives value.js/parse-that/glass-ui too, but each sibling is AUDITED as its own surface and every cross-repo item is HAND-OFF-tagged + sequenced (Band V). kf still consumes through the single `lerpValue → iv._lerp` seam (`engine.ts:731`), ZERO kf edits for the re-pin (`_SYNTHESIS-deferred-ledger §0`) |
| **inv-27** | consume PUBLISHED value.js/parse-that/glass-ui (not branches/links); gate on own green CI | **THE SPINE** — kf ships stale `value.js ^0.10.0` / `parse-that ^0.8.2` / `glass-ui file:../glass-ui` LINK while `0.11.0`/`0.9.0`/`3.3.0` are PUBLISHED; G.W2 IS inv-27 owed at the post-F-publish moment, gated by a new `proof:deps-current` (`_SYNTHESIS-gap-scorecard §1 dep-currency`; `package.json:84-88` verified live) |
| **inv ζ** | the shop-window runs on its own engine (no hand-rolled rAF/listeners) | HOLD — F.W10 swapped `useOrbitalInertia` to `decay()`; G adds no hand-rolled loop. G.W9 CORRECTS the inverse defect: four scene loop-owners wire rAF cleanup to a dead `<KeepAlive>`-only hook → the dogfooded preview loop LEAKS (`a-frontend-brittleness §1`) |
| **inv ε** | verify, do not assert — cite for every claim, ground every SOTA claim | HONORED — every row traces to a phase-1 lane or a re-verified live `file:line` on `tranche-g-dev` |
| **inv δ** (drift-2) | "zero dock-over-content overlap" is a HARD gate, not advisory | HOLD — G.W12 must close D.W5 by REMOVING the `:always-expanded` mask and re-running `occlusion-gate.mjs` mask-free (must stay green WITHOUT the crutch); G.W11 must not reintroduce an occlusion (`_SYNTHESIS-prompt-recap §Drift 2`) |
| **P-invariant-28** | every keyframes-owned deferral has a terminal home (no perpetual punt) | **VACUOUS for G — the ledger is CLEAN.** D was the terminal home; F folded ZERO chronic debt; G inherits zero KFE and gives every carry a terminal disposition (`_SYNTHESIS-deferred-ledger §7/§9`). The one true chronic (C-1, the value.js charter) is CHRONIC-by-design and *correct* — the inv-16 process, not a punt |

## § Thesis — G is a NARROW finishing tranche with ONE spine and a long ALREADY-SOTA refusal

(THE SPINE, copied from `_SYNTHESIS-gap-scorecard §THESIS`.)

**G is a NARROW finishing tranche with ONE spine and a long ALREADY-SOTA refusal.** F
was the narrow finisher; it landed 16 gated waves and RELEASED the 4.0.0 stack. G is
narrower still. **The spine is the dep RE-PIN** (`GS-0` / `RP-1` / `F-BL-1` /
`G-CONST-1/2` / `GG-1` / `F-VJ-1` / `G-1` / `G-PT-1` — **eight lanes converge on the
same single SHIP**): kf 4.0.0 ships consuming **stale siblings** (value.js `^0.10.0`,
parse-that `^0.8.2`, glass-ui a dirty `file:../glass-ui` LINK) while the published
`0.11.0` / `0.9.0` / `3.3.0` carry the F hand-off wins kf DROVE — the F.W6 −94%
computed-endpoint memo, the 3.96× color-channel plan, the 2.41× parse dispatch, the C5
*correctness* fix (24 no-op length units), and the parse-that soundness hardening. **The
whole F.W6 architecture was load-bearing on "kf consumes it on re-pin"; the re-pin never
happened.** This is not a chore — it is a *shipped-product-correctness* fix and the
unlock for most of the value.js charter, achievable with ZERO kf source edit through the
single `lerpValue → iv._lerp` seam (`engine.ts:731`).

**Around the spine, G is:** (a) a set of THIN re-audit lanes that confirm D+E+F left the
engine, the boundary, the parse grammar, the frontend-state tier, the CI spine, and the
modern-web surface ~90–95% SOTA (the audits manufacture almost nothing); (b) a finishing
sweep of the post-F W10/W12 scenes (`sequence/`, `motion-path/`) authored AFTER the
D.W2 idiom sweep + the F §1 rail/ball consolidation that re-fork what those passes
retired — the *exact same drift class*, in the *exact same surfaces*, across styling AND
lifecycle AND brittleness; (c) the Playwright demo SHIPs (the unreachable Discrete
route, the hero word-spacing regression on the LCP, the duplicate Play aria-label, the
dock-affordance glass-ui-handoff); (d) two GATED DECISIONS that must not be re-deferred
(the engine line-ceiling C-6/GS-4; the backend back-compat-flag framing GS-2); (e) two
narrow net-new engine SHIPs from the animation-SOTA frontier (DrawSVG; `.finished`); and
(f) the cross-repo HAND-OFFs (glass-ui VT-types + dock occlusion; value.js
VJ-F1/F4/E1/F3; parse-that diagnostics + packrat re-key) the user CAN drive under
relaxed inv-16.

**The §ALREADY-SOTA binding record (the refusal):** the engine kernel + steppers +
WAAPI eligibility + the value.js boundary + the FrameCompiler split + the color science
+ the single-grammar parse + the parse-that leaf tier are ALREADY-SOTA and G touches
NONE of them. The two largest source files are at their cohesive gestalt (`engine.ts`
1313L, `group.ts` 752L — F.md NEW-3 ruling re-verified post-+99L-growth). The
frontend-state Mandate-hardest rules (never-destructure-`defineProps`,
getter-fn-for-composables, typed provide/inject, disciplined `markRaw`) are HONORED, not
violated. **G manufactures NO work where D+E+F lead — this is binding.**

**The SUPPLEMENTAL assay (the 8 lanes the user requested ON TOP of the 16-lane phase-1
assay — `r-perf-hotpath-v8`, `r-perf-crossengine`, `a-perf-compile-flatten-bitpack`,
`a-testing-robustness`, `a-modern-css-interp`, `a-group-layering`,
`a-scroll-orbital-quaternions`, `a-modularity-deep`) WIDENS G MODESTLY — ~4–5 new waves
on top of 14 — but the SPINE STILL LEADS and the DOMINANT yield is a DEEPER REFUSAL**
(`_SYNTHESIS-perf-testing-engine §THESIS / §3`, binding). The supplemental contribution
is three-shaped: **(1)** it DEEPENS the §ALREADY-SOTA refusal with mechanism the phase-1
lanes could not carry — the kernel is now shown ALREADY-SOTA at the *V8-object-model*
level (HP-3/HP-4/HP-5), the carrier is ALREADY-SOTA *cross-engine* (X-1/X-2), the
deep-modularity lane CONFIRMS the godmodules verdict by an orthogonal route
(MD-2/MD-3/MD-4), and the kernel interpolates nearly the WHOLE modern surface (MCI-6).
**(2)** It SHARPENS the spine (G.W2 is now also a V8-perf-correctness fix — HP-1; the
compile latency is mapped — CF-1) and the one booked SoA MEASURE-FIRST (HP-2 mechanism +
X-1 cross-engine portability + the bit-packing KILL HP-4/X-3/CF-3) — but opens NO new
SHIP there. **(3)** It adds a BOUNDED net-new set: ONE real correctness bug (G.W17 — the
dead `add`/`weighted` blend leaf, un-assayed by the phase-1 lens), a testing-robustness
band the suite owes (G.W15/G.W16), an orbital simplicity SHIP (G.W18, net-negative
lines), and the adopt-seam (G.W19). **Does the spine still lead? YES — every perf SHIP
IS the re-pin or RIDES it. Does G widen from narrow-finisher? MODESTLY, and honestly — G
stays a narrow re-pin-spined finisher; the supplemental lanes HARDEN it and close the ONE
correctness gap the phase-1 lens could not see (the dead blend leaf — the gap-scorecard
has no group/blend row).**

## § The band → wave map (the canonical structure)

(The phase-1 spine from `_SYNTHESIS-gap-scorecard §2`, EXTENDED with the supplemental
Bands T/G/O/M from `_SYNTHESIS-perf-testing-engine §2` — all 13 bands G.W1..G.WZ; the
supplemental Band P FOLDS-INTO-EXISTING, carrying no table row of its own.) Each band groups
by dependency + concern; each wave (`G.Wn`) carries a disposition headline + the lane(s)
it folds + a falsifiable `proof:*` gate that BITES (the F advisory→hard discipline).
**Bands are ordered by the re-pin dependency:** the spine (Band 1) UNLOCKS the
value.js/parse-that consumption, so it lands FIRST after verification.

| Band | Theme | Waves | Net-new vs folded |
|---|---|---|---|
| **Band 0 — Verification** | the re-pin SAFETY lock (the measure-first lock) | G.W1 | net-new (the lock that makes the spine shippable) |
| **Band 1 — The dep re-pin spine** | consume the published F hand-off + the C1 resize fold | G.W2 · G.W3 | net-new (the headline SHIP; 8 lanes converge) |
| **Band 2 — Backend legacy + the god-module DECISION** | the one silent-degrade + the gated line-ceiling call | G.W4 · G.W5 | net-new (1 fail-explicit SHIP + 1 GATED DECISION) |
| **Band 3 — Constellation re-pin completion** | the CI workflow-hygiene drift-closure | G.W6 | net-new (drift-closure on a SOTA CI spine) |
| **Band 4 — Frontend encapsulation / state / brittleness** | Vue idiom convergence + store singleton + the rAF leak | G.W7 · G.W8 · G.W9 | net-new (thin folds + 1 HIGH real leak) |
| **Band 5 — Styling/design-idioms + demo usability/affordance** | the W10/W12 idiom sweep + the Playwright SHIPs + the dock | G.W10 · G.W11 · G.W12 | net-new (idiom-drift finish + 4 demo SHIPs) |
| **Band 6 — Animation SOTA + modern-web adopts** | the two narrow engine SHIPs + the checklist completeness | G.W13 · G.W14 | net-new (DrawSVG + `.finished`; byte-cheap rows) |
| **Band T — Testing-robustness** | the corpora + the gates the suite owes (the re-pin changes the boundary the tests protect) | G.W15 · G.W16 | net-new (test-only; the suite is depth-SOTA, breadth-narrow) |
| **Band G — Group / compositor correctness** | the ONE real net-new bug — the dead `add`/`weighted` blend leaf | G.W17 | net-new (HIGH correctness; un-assayed by the phase-1 lens) |
| **Band O — Scroll / orbital** | the orbital quaternion-output simplicity SHIP (net-negative lines) | G.W18 | net-new (1 simplicity SHIP; the arch is ALREADY-SOTA) |
| **Band M — Deep-modularity** | the `adoptCompiled()` engine seam (the one cross-boundary reach-in) | G.W19 | net-new (1 MED boundary SHIP; DI/pipeline/dynamism ALREADY-SOTA) |
| **Band V — Cross-repo HAND-OFFs** | the inv-16-relaxed sibling surfaces (the user drives) | G.WV | CHRONIC-by-design (value.js charter) + sequenced HAND-OFFs |
| **Band Z — Close** | the D FINAL (DP-2) + the G FINAL + the re-publish leg | G.WZ | — |

The SUPPLEMENTAL band → wave map (the 8 supplemental lanes folded ON TOP — proposed
`G.W15..G.W19`, the existing `G.W1..G.W14` map is NOT renumbered; from
`_SYNTHESIS-perf-testing-engine §2`). Two FOLD-INTO-EXISTING (sharpen a gate already
present — Band P below); four NEW WAVES (Bands T/G/O/M):

| Band | Theme | Waves | Disposition headline + gate |
|---|---|---|---|
| **Band T — Testing-robustness** | the corpora + gates the suite owes | **G.W15** · **G.W16** | **G.W15** the interpolate-anything + color-fidelity corpus (TR-1/TR-2 + MCI-1/MCI-5; test-only) — gate `proof:interpolate-anything` + `proof:color-fidelity` + `proof:fn-arity-pad` + `proof:cqw-resolution`. **G.W16** the computed-resolution + parse/round-trip corpora (TR-3/TR-4; jsdom+real-DOM split; **SUPERSEDES the un-runnable G.W2 S4 `50dvh`-on-rAF clause**) — gate `proof:computed-real-dom` (Playwright — the ONLY place the C5 fix is provable on the genuine path) + the S1 injection unit test + `proof:roundtrip-fidelity`. |
| **Band G — Group / compositor correctness** | the ONE real net-new bug | **G.W17** | the dead `add`/`weighted` blend leaf correction (GL-1/GL-2; **HIGH** — two of three UI-exposed blend modes are DEAD CODE, silently collapse to `replace`). Gate `proof:blend` — `add` of two `opacity 0→1` mid-frame → exactly `1.0`; `weighted` weight=0.5 → exactly `0.25`; the multi-component leaf row; the GL-6 add-clamp contract. **BITE:** reds TODAY (the dead leaf), greens on the element-wise fix. |
| **Band O — Scroll / orbital** | the quaternion-output simplicity SHIP | **G.W18** | the orbital `rotate3d` output collapse (O-1; simplicity + correctness, net-negative lines — the OUTPUT round-trips quaternion→Euler→re-apply gratuitously). Gate `proof:orbital-rotate3d` — `containerStyle.transform` contains `rotate3d(` NOT `rotateX/Y/Z`; a gimbal-pole parity test. RECORD S-1 (stale "Chromium-only" rationale); BOOK S-2 (`view()` named ranges). |
| **Band M — Deep-modularity** | the adopt-seam | **G.W19** | the `adoptCompiled()` engine seam (MD-1; **MED** — the demo transplants three public-but-internal `Animation` fields because the engine exposes no first-class adopt-compiled verb). Gate `proof:adopt-compiled` — `a.adoptCompiled(b)` ⇒ `a.compiler === b.compiler` AND `a.options === a.compiler.options` (the `6e29236` live-options invariant re-bound) AND `a.flatKeys` reflects `b`'s key-set. |

**Band P — Perf-deepening (FOLD-INTO-EXISTING, no new wave; from `_SYNTHESIS-perf-testing-engine §2 Band P`).**
The cross-engine carrier / compile map / SoA consumption lanes are EXEMPLARY at refusing
to manufacture work — the kernel is ALREADY-SOTA at the V8 + cross-engine + compile levels,
the one true lever (SoA) is already booked, and the re-pin is the leverage everywhere.
Their yield is *grounding*, folded into the existing spine + SoA gates (see the FOLD-INTO-
EXISTING notes on G.W2 and the booked SoA MEASURE-FIRST below).

The finding → wave id map (each row → its disposition headline):

| Finding(s) | Wave | Title | Disposition headline |
|---|---|---|---|
| G-PT-1 · `a-valuejs §0` | **G.W1** | re-pin SAFETY verification | the measure-first lock (non-breaking pre-stage) |
| GS-0/RP-1/2/3 · F-BL-1 · G-CONST-1/2 · GG-1 · F-VJ-1 · G-1 · G-PT-1 | **G.W2** | THE RE-PIN (8 lanes converge) | SHIP-in-G (the headline; ZERO kf edit; inv-27) |
| F-VJ-2 | **G.W3** | the C1 container-resize staleness fold | SHIP-in-G (the one kf-side fold the bare re-pin misses) |
| F-BL-2 (+ F-BL-6/F-BL-3 RECORD) | **G.W4** | backend fail-explicit close | SHIP-in-G (the one silent-degrade left) |
| C-6 · G-GM-1 | **G.W5** | the library line-ceiling GATED DECISION | DECIDE, do NOT reflexively split (P-invariant) |
| `a-ci-streamline §1/§2/§3/§4` | **G.W6** | CI workflow-hygiene gate (ONE gate, four findings) | SHIP-in-G (drift-closure on a SOTA spine) |
| `a-frontend-encapsulation §1/§2/§3` | **G.W7** | Vue idiom convergence | SHIP-in-G ("no replaced surface beside its replacement") |
| `a-frontend-state §1/§2` | **G.W8** | frontend-state store-idiom close | SHIP-in-G (the one store outside the singleton idiom) |
| `a-frontend-brittleness §1/§2` | **G.W9** | the rAF-leak lifecycle correction (HIGH) | SHIP-in-G (the one real NEW brittleness defect) |
| `a-styling §1–§6` | **G.W10** | the W10/W12-scene idiom finishing sweep | SHIP-in-G (the SAME drift class, SAME surfaces) |
| `a-demo-playwright X-5/X-6/X-3` | **G.W11** | the demo usability SHIPs (Playwright) | SHIP-in-G (four live-verified defects, two on the LCP/transport) |
| `a-demo-playwright X-1` · GG-5/GG-2 | **G.W12** | the dock affordance (glass-ui-HANDOFF + D.W5 close) | SHIP-in-G (kf half) + glass-ui-HANDOFF (the root fix) |
| G26-2/G26-5 | **G.W13** | the two narrow net-new engine SHIPs | SHIP-in-G (DrawSVG + `.finished`) |
| MW-CHK-1 | **G.W14** | the modern-web checklist completeness fix | SHIP-in-G (byte-cheap; zero demo pixels move) |
| TR-1/TR-2 · MCI-1/MCI-5 | **G.W15** | the interpolate-anything + color-fidelity corpus | SHIP-in-G (test-only; the suite is depth-SOTA, breadth-narrow) |
| TR-3/TR-4 (· TR-5 RECORD) | **G.W16** | the computed-resolution + parse/round-trip corpora | SHIP-in-G (test-only; jsdom+real-DOM split; supersedes G.W2 S4) |
| GL-1/GL-2 (· GL-4/GL-6 BOOK/RECORD) | **G.W17** | the dead `add`/`weighted` blend leaf fix | SHIP-in-G (HIGH correctness — the ONE real net-new bug) |
| O-1 (· S-1 RECORD · S-2 BOOK) | **G.W18** | the orbital `rotate3d` output collapse | SHIP-in-G (simplicity, net-negative lines) |
| MD-1 (· MD-6 RECORD) | **G.W19** | the `adoptCompiled()` engine seam | SHIP-in-G (MED boundary close) |
| (hand-offs) | **G.WV** | the sibling-repo hand-offs | value.js / parse-that / glass-ui / deploy HAND-OFF |
| DP-2/PUB-1 | **G.WZ** | the tranche close (D FINAL + G FINAL + re-publish) | — |

---

## BAND 0 — VERIFICATION (the lock that makes the spine shippable; LEADS the DAG)

**Why first:** the re-pin (Band 1) is the spine of G, but a 0.x minor can carry breaking
deltas. Band 0 is the measure-first LOCK that pre-stages the re-pin as non-breaking
before it lands — it does NOT ship source.

### G.W1 — re-pin SAFETY verification (the measure-first lock)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** MEASURE-FIRST (the lock) · **Scope:** `package.json`, `proof:boundary`, a symbol-survival check · **DAG-deps:** none (LEADS).
- **Provenance:** `a-parsethat-leverage G-PT-1`, `a-valuejs-leverage §0`.
- **§The state, verified:** parse-that `0.9.0`'s only break — the `.memoize()` method→free-fn removal — has ZERO kf/value.js call-sites; kf's one direct import `any as parseAny` (`utils.ts:1`) is still root-exported (`a-parsethat-leverage G-PT-1`). All 29 kf-consumed value.js names survive `0.11.0` (29/29 OK, `a-valuejs-leverage §0`).
- **§Goal:** prove the re-pin is non-breaking BEFORE it lands.
- **§Scope:** **S1** — run `proof:boundary` green on the current tree (WHAT: confirm the seam is intact; WHY: the seam is the zero-kf-edit mechanism). **S2** — a symbol-survival check (WHAT: assert all 29 kf-consumed value.js names + the one direct parse-that import resolve against the published `0.11.0`/`0.9.0` typings; WHY: a missing symbol is the only way the consume-unchanged claim fails).
- **§Hard gate:** `proof:repin-safe` — a green `proof:boundary` + a symbol-survival assertion (a NEW pre-stage gate, NOT chained into `proof:all`; it reads the PUBLISHED `0.11.0`/`0.9.0` typings as a Band-1 precondition). **BITE:** flip one consumed-name to a non-exported name → the survival check reds; this pre-stages the Band-1 re-pin and bites if any consumed symbol vanished at `0.11.0`/`0.9.0`.
- **§Folds:** `G-PT-1`, `a-valuejs §0`.
- **§Design decisions:** this is the measure-first lock, NOT a wave that ships source. It exists so the re-pin lands behind a proof, not a hope.

---

## BAND 1 — THE DEP RE-PIN SPINE (the headline; 8 lanes converge; UNLOCKS the value.js/parse-that consumption)

**Provenance:** `_SYNTHESIS-deferred-ledger §0` (RP-1..RP-5), `a-backend-legacy F-BL-1`,
`a-constellation-gaps G-CONST-1/2`, `a-glass-ui GG-1`, `a-valuejs-leverage F-VJ-1`,
`a-engine-perf G-1`, `a-parsethat-leverage G-PT-1`. **DAG: depends on G.W1** (the lock
pre-stages the re-pin). **Lands FIRST in G** — it gates the honest re-measure of every
value.js row.

### G.W2 — THE RE-PIN (the headline SHIP; 8 lanes converge here)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (the headline) · **Scope:** `package.json:84-88`, the lockfile, a new `proof:deps-current` · **DAG-deps:** G.W1.
- **Provenance:** `GS-0/RP-1/2/3` (`a-deferred-ledger`), `F-BL-1` (`a-backend-legacy`), `G-CONST-1/2` (`a-constellation-gaps`), `GG-1` (`a-glass-ui` — off the `file:` link), `F-VJ-1` (`a-valuejs-leverage`), `G-1` (`a-engine-perf`), `G-PT-1` (`a-parsethat-leverage`).
- **§The state, verified:** `package.json` declares `@mkbabb/value.js: "^0.10.0"` (line 85), `@mkbabb/parse-that: "^0.8.2"` (line 84), `@mkbabb/glass-ui: "file:../glass-ui"` (a symlink to a dirty `at-dock-convergence` tree, line 88 — verified live). The registry carries `0.11.0`/`0.9.0`/`3.3.0`. The seam is ONE site: `engine.ts:731 lerpValue(eased, iv) → iv._lerp` (verified live). Every F sibling win — the −94% computed-endpoint memo, the ~40×/frame color hot-path, the 2.41× dispatch LUT, the C5 length-unit correctness, the parse-that soundness — is PUBLISHED-BUT-UNCONSUMED.
- **§Goal:** consume the published F hand-off with ZERO kf source edit; light the −94% memo + 3.96× color + 2.41× dispatch + C5 correctness with one motion.
- **§Scope:** **S1** — re-pin `value.js ^0.11.0`, `parse-that ^0.9.0`, `glass-ui ^3.3.0`; re-lock (WHAT: the consume-leg; WHY: inv-27 owed at the post-F-publish moment). **S2** — run the FULL 261-test suite + every `proof:*` GREEN with NO kf edit (WHAT: the consume-unchanged lock; WHY: any required kf edit is a finding against the charter). **S3** — author `proof:deps-current` / `proof:vj-pin-current` (WHAT: installed ≥ published floor; no `file:`/`link:`/`git:` protocol in `@mkbabb/*`; kf's parse-that minor === value.js's parse-that minor; WHY: convert the silent pin-lag + the silent cross-realm cast into explicit gated invariants — fail-explicit). **S4** — the C1 computed-frame resolve-count witness (`interp-buffer.bench` computed-unit variant; WHAT: prove the win is on kf's path; WHY: if the resolve count does not drop O(frames)→O(1), the memo isn't on kf's path = a finding). **The C5 `50dvh` non-identity CORRECTNESS test is NOT in S4** — it cannot run on the jsdom rAF path (it would pass vacuously), so it is SUPERSEDED + MOVED to `G.W16` S1+S2 (the value.js injection-seam unit test + the Playwright `proof:computed-real-dom` real-DOM corpus); S4 retains only the C1 witness, which bites on the rAF path correctly.
- **§Hard gate:** `proof:deps-current` (no link-protocol; installed ≥ floor; parse-that-minor realm-convergence) + the full suite + `proof:all` GREEN with ZERO kf edit + a C1 resolve-count witness. **The C5 `50dvh` non-identity CORRECTNESS assertion is NOT a G.W2-gate clause** — it is structurally un-runnable on the jsdom rAF path (Probe-1: `50vh`→`"50vh"`, no `matrix()`/layout — `a-testing-robustness` TR-3), so per the §Mandate (no gate that passes vacuously) it is SUPERSEDED + OWNED by `G.W16` (S1 the value.js injection-seam unit test + S2 the Playwright `proof:computed-real-dom` real-DOM corpus, the ONLY genuine path). **BITE:** introduce a `file:` protocol or a stale floor → `proof:deps-current` reds; a red `proof:*` gate or any required kf source edit on the bumped pins → the consume-unchanged claim reds; the C1 resolve count staying O(frames) → the memo-on-kf's-path witness reds. The C5 correctness BITE lives in `G.W16` (revert the `0.11.0` resolver / stub `convertToPixels` for `dvh` → the real-DOM page freezes at the un-resolved value and `proof:computed-real-dom` reds). **MUST bite:** green CI with NO kf edit PROVES the consume-unchanged claim.
- **§Folds:** `GS-0/RP-1/RP-2/RP-3/RP-4/RP-5` · `F-BL-1` · `G-CONST-1/G-CONST-2` · `GG-1` · `F-VJ-1` · `G-1` · `G-PT-1`. Retires the dep-currency GAP; lands the §1 charter slice (A1/A2 · B1b/B3+B5 · C1 · C5 · D2 · F7) + the §2 PT-1/PT-2 relief transitively.
- **§Design decisions RESOLVED:** **(1)** ORDER — value.js re-pins its OWN parse-that `^0.9.0` first (G-HANDOFF-1) to converge the dual-realm BEFORE RP-4, IF the cross-realm round-trip bites; NOT a kf-side shim. **(2)** The 0.x-minor caveat — `0.11.0` folds A2 (maximal-munch unit classifier) + C5 (24 no-op units) which CHANGE parse/normalize at the boundary kf consumes; the re-pin ROUTES that delta through kf's gates (not mechanical). **(3)** Sequence RP-1+RP-4+RP-5 as ONE `chore(deps)` PR sharing the single proof-gate.
- **§SUPPLEMENTAL FOLD (from `_SYNTHESIS-perf-testing-engine §2 Band P` + §3(a) + §4):** the re-pin is also a *V8-perf-correctness* fix and its compile latency is now mapped — **no new SHIP here, deepened rationale + a sharpened gate.**
  - **HP-1 (the V8 read, `r-perf-hotpath-v8`):** the published TypedArray dense-numeric carrier — the C1 memo + the B3 `Float64Array` color plan + D2 `lerpArray` — is *published-but-dark* ONLY because kf still pins `^0.10.0`. The re-pin lights the fast-properties buffer / PACKED_ELEMENTS substrate. The re-pin is a perf-correctness fix, not a chore.
  - **CF-1 (the compile-latency map, `a-perf-compile-flatten-bitpack`):** the FrameCompiler `parse()` is **87–91% of `fromString`** — value.js-bound (`frame-compiler.ts:234-302,360-371`). A RECORD-grade map, not a SHIP — it confirms the compile cost lives behind the re-pin, not in kf's own frame-compiler.
  - **Sharpen the gate (the compile-% clause):** pair `proof:vj-pin-current` with the existing C1-resolve-count witness AND a compile-% clause on `compile.bench` — `.parse()` ≥ 85% of `fromString` at N≥50 (CF-1). **BITE:** if kf's own frame-compiler regresses below the value.js-bound floor (i.e. kf grew a hand-rolled parse cost), the clause reds.
  - **NOTE — G.W16 SUPERSEDES the un-runnable G.W2 S4 `50dvh`-on-rAF clause.** S4's C5 `50dvh` non-identity test is structurally untestable on the jsdom rAF path (Probe-1: `50vh`→`"50vh"`, no `matrix()` form — `a-testing-robustness` TR-3). Per the §Mandate (no gate that passes vacuously), the `50dvh` correctness proof MOVES to G.W16 — split into the S1 value.js injection-seam unit test + the S2 Playwright real-DOM corpus (`proof:computed-real-dom`, the ONLY place the C5 fix is provable on the genuine path). S4's C1 resolve-count witness (the `interp-buffer.bench` computed-unit variant) STAYS at G.W2 — it bites on the rAF path correctly.
- **§SUPPLEMENTAL FOLD → the booked SoA-segment consumption (the roll-up's `G-2` MEASURE-FIRST; from `_SYNTHESIS-perf-testing-engine §2 Band P` + §3(c)):** the booked SoA item rides this re-pin (it needs `lerpArray` importable). **No new wave — the SoA stays a gated MEASURE-FIRST→SHIP riding the re-pin; the supplemental yield is mechanism + cross-engine portability + the bit-packing KILL.**
  - **HP-2 (the V8 dispatch mechanism, `r-perf-hotpath-v8`):** AoS pointer-chase + K indirect `_lerp` calls vs one inlined `Float64Array` scan — **3.06–3.47× at the real K=6–10**, independently reproduced.
  - **X-1 (the cross-engine carrier argument, `r-perf-crossengine`):** the SoA `Float64Array` carrier is the one interp shape that bypasses the shapes/IC/dict-mode machinery that DIFFERS across V8/SM/JSC — a STRONGER reason to pay the carrier risk than "4× on V8" (the shape that doesn't depend on which engine despeculates when). value.js-HANDOFF + SHIP.
  - **CF-4 (the compile-vs-runtime split, `a-perf-compile-flatten-bitpack`):** SoA is a *runtime* lever, NOT a *compile* lever — do NOT re-shape the COMPILED frame for compile speed.
  - **Sharpen `proof:interp-soa`:** the real-K corpus + the byte-lock (already named) + a `%HasFastProperties` clause on the scatter-target + a K=1-alias counter (HP-2) + the X-1 cross-engine witness (run the §A probe under `node`+`js`+`jsc`; SHIP-bar = V8, SM/JSC = portability witness).
  - **RECORD/KILL the bit-packing (HP-4 / X-3 / CF-3 — three ways, no headroom):** the frame id is an un-decoded SMI identity token (FC-2 lock); the time is an un-SMI-packable FP read at N=2; the dispatch is value.js's `_lerp` predispatch (the bit-packing done right). RECORD so nobody packs the id/time/dispatch (`frame-compiler.ts:84,213`).
  - **TR-5 (RECORD, the SoA correctness twin):** `proof:interp-soa` (a perf bench proves SPEED, not a correct pixel) REQUIRES `proof:interpolate-anything` GREEN on the same corpus — booked into G.W15 as the SoA fold's correctness twin.

### G.W3 — the C1 container-resize staleness fold (the ONE kf-side fold the bare re-pin does NOT cover)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (MEASURE-FIRST on the library-generic auto-observer) · **Scope:** `demo/` `AnimationVisualizer` `ResizeObserver` wiring + a library container-unit contract doc · **DAG-deps:** G.W2.
- **Provenance:** `a-valuejs-leverage F-VJ-2`.
- **§The state, verified:** the RP-1 re-pin INTRODUCES C1 staleness for `cqw` animations under a non-window resize — value.js `0.11.0`'s computed-endpoint memo caches the resolved endpoint, and `bumpLayoutEpoch()` clears it only on window resize; a panel/dock resize bites `AnimationVisualizer`'s `calc(100cqw - 100%)` (`a-valuejs-leverage F-VJ-2`).
- **§Goal:** wire the genuine signal value.js exposes so `cqw` animations track a container resize.
- **§Scope:** **S1** — the demo wires `bumpLayoutEpoch()` on the `AnimationVisualizer` container `ResizeObserver` (WHAT: the demo-side fold; WHY: the re-pin introduced the staleness on the demo's exact callsite). **S2** — the library documents the container-unit contract (WHAT: no library-generic auto-observer without a biting bench; WHY: a generic auto-observer breaches the boundary — the concern that kept F.W6's wrapper out of kf).
- **§Hard gate:** `proof:resize-tracks` — a resize-WITHOUT-window-resize test asserting the ball tracks the new `100cqw`. **BITE:** stub the resolver to skip `bumpLayoutEpoch()` on the container edge → the ball freezes at the stale value and the test reds.
- **§Folds:** `F-VJ-2`.
- **§Design decisions RESOLVED:** the library-generic auto-observer is BOOK pending a bench (the boundary-breach concern); the demo-wire + the documented contract is the befitting fold now.

---

## BAND 2 — BACKEND LEGACY EXCISION + THE GOD-MODULE DECISION

**Provenance:** `a-backend-legacy F-BL-2/F-BL-6/F-BL-3`, `a-deferred-ledger C-6`,
`a-backend-godmodules G-GM-1`. **DAG: independent of the spine** (no shared surface) —
can run in parallel after G.W2.

### G.W4 — backend fail-explicit close (the one silent-degrade left)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (MED) · **Scope:** `src/parsing/format.ts:22-29` · **DAG-deps:** none.
- **Provenance:** `a-backend-legacy F-BL-2` (SHIP), `F-BL-6`/`F-BL-3` (RECORD).
- **§The state, verified:** `serializeEasing` silently emits `"linear"` for a custom-closure easing (the curve is LOST on round-trip — `format.ts:22-29`). The backend is otherwise a reference fail-explicit surface (`internal/errors.ts`, the option setters, `setLayerConfig` all throw typed — `a-backend-legacy §ALREADY-SOTA`).
- **§Goal:** convert the ONE silent-degrade to a typed throw — fail-EXPLICIT per the Mandate.
- **§Scope:** **S1** — `serializeEasing` THROWS on a custom-closure easing with no CSS twin (WHAT: a typed throw; WHY: no CSS twin = fail-explicit, not silent `"linear"`). **S2** — RE-WORD the `back-compat` flag framing in a major (`F-BL-6`; the `back-compat` comments at `numeric.ts:40`/`smooth.ts:24` — re-word only, the `4.0.0` major absorbed the breaking deletions; behaviour is the correct conservative default).
- **§Hard gate:** `proof:roundtrip-easing` negative control — a custom closure THROWS; a genuine-`linear` registry entry still serializes `linear`. **BITE:** revert to the silent `"linear"` emit → the negative control (closure must throw) reds.
- **§Folds:** `F-BL-2` (SHIP); `F-BL-6` (RECORD re-word); `F-BL-3` (RECORD — the dead `composition` capture honoring routes to G.WV/FB-1).
- **§Design decisions RESOLVED:** the `back-compat` flag *behaviour* is the correct default (re-word only, no behaviour change) — the silent `serializeEasing` degrade is the one genuine no-legacy/fail-explicit violation.

### G.W5 — the library line-ceiling GATED DECISION (do NOT reflexively split)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** MEASURE-FIRST → DECIDE (the gate IS the lock) · **Scope:** `proof:decomposition`, `src/animation/**` · **DAG-deps:** none.
- **Provenance:** `a-deferred-ledger C-6`, `a-backend-godmodules G-GM-1`.
- **§The state, verified:** `engine.ts` is **1313L** (verified live `wc -l`; grew +130L since F-open, F.W5/W7/W8/W9/W12 unconstrained); `group.ts` is 752L (verified live). `proof:decomposition` sweeps ONLY the demo, NOT `src/animation/**`. The `Animation` class is at its cohesive gestalt (F.md NEW-3, re-verified post-growth; `a-engine-perf §4` + F-ENG-5 independently concur). All 7 >500L god-module candidates are at gestalt or are leaf-catalogues (`a-backend-godmodules G-GM-1..7`).
- **§Goal:** DECIDE, do NOT re-defer (P-invariant) — the chronic is the ABSENCE of a gated decision, and the file grew unconstrained.
- **§Scope:** **S1** — extend `proof:decomposition` to `src/animation/**` with a per-file ceiling + a RECORDED gated EXCEPTION for `engine.ts` carrying the F.md NEW-3 cohesion rationale (WHAT: the gate + the recorded exception; WHY: a split-for-line-count is the legacy-shape the Mandate forbids) — **OR** **S1'** — IF 1313L now spans genuinely-separable concerns (playback loop · frame-state · WAAPI-delegation · event-dispatch), a MEASURE-FIRST cohesive split (NOT reflexive).
- **§Hard gate:** the EXTENDED `proof:decomposition` (sweeps `src/animation/**` with the recorded exception). **BITE:** add a new 600L un-exempted file under `src/animation/` → the extended gate reds; the recorded exception must name `engine.ts` explicitly or the gate has no teeth.
- **§Folds:** `C-6` (the DECISION, finally) + `G-GM-1` (the engine class 62L over its own guard). `G-GM-2` (animations.ts taxonomy split) = RECORD/contrivance, do NOT carve; `G-GM-1b` (the `CSSKeyframesAnimation` carve) = RECORD (fails cohesion-benefit).
- **§Design decisions RESOLVED:** the `Animation` class is at gestalt (the split is the legacy-shape forbidden); the gap is purely the absent gated decision; the extended gate IS the lock. This is the one chronic purely kf-owned and purely a G call.

---

## BAND 3 — CONSTELLATION RE-PIN COMPLETION (CI workflow-hygiene drift-closure)

**Provenance:** `a-ci-streamline §1/§2/§3/§4` (SHIP), `§5` (RECORD); `§8` spine
ALREADY-SOTA. **DAG: rides the G.W2 re-pin** (the glass-ui pin bump gates on demo-smoke
green). The F.W2+F.W17 CI is SOTA; G closes the residual drift.

### G.W6 — CI workflow-hygiene gate (ONE gate, four findings)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (drift-closure) · **Scope:** `.github/workflows/`, `scripts/proof-ci-coverage.mjs` · **DAG-deps:** G.W2.
- **Provenance:** `a-ci-streamline §1/§2/§3/§4`.
- **§The state, verified:** the CI spine is ALREADY-SOTA (legacy excised, inv-28 gating, provenance signed — `a-ci-streamline §8`). The residual is four drift findings: a stale `^0.10.0` version-literal comment (§1), the byte-duplicated glass-ui clone block (§2), the stale `v3.2.0`→`v3.3.0` pin (§3), the missing `concurrency:` on ci/release (§4).
- **§Goal:** close the residual drift on a SOTA CI spine — ONE workflow-hygiene gate.
- **§Scope:** **S1** — kill the hardcoded-stale `^0.10.0` version-literal comment (§1; WHAT: version-literal-consistency; WHY: the comment lies post-re-pin). **S2** — DRY the duplicated glass-ui clone block into a `setup-glass-ui` composite action (§2; WHAT: clone-DRY; WHY: no duplicated effort). **S3** — bump the stale `v3.2.0`→`v3.3.0` pin gated by demo-smoke green (§3; WHAT: the pin bump; WHY: measure-first, demo-smoke must pass). **S4** — add the missing `concurrency:` on ci/release (§4; WHAT: concurrency-present; WHY: prevent overlapping runs).
- **§Hard gate:** one extended `proof-ci-coverage.mjs` clause — version-literal-consistency + clone-DRY + concurrency-present. **BITE:** re-introduce the stale literal or the duplicated clone block → the clause reds.
- **§Folds:** `a-ci-streamline §1/§2/§3/§4`. (`§5` Node-24-vs-22 delta = RECORD — name the delta with a comment; kf is AHEAD.)
- **§Design decisions RESOLVED:** the composite action is the DRY idiom; the Node-24 skew is kf-ahead (the spine should bump to match — RECORD, not a kf change).

---

## BAND 4 — FRONTEND ENCAPSULATION / STATE / BRITTLENESS

**Provenance:** `a-frontend-encapsulation §1/§2/§3`, `a-frontend-state §1/§2`,
`a-frontend-brittleness §1/§2`. **DAG: independent of the engine bands** — can run in
parallel. The bulk is ALREADY-SOTA (colocation, `defineModel`, `toRef`-getter,
injectionKeys, the Mandate-hardest state rules HONORED).

### G.W7 — Vue idiom convergence ("no replaced surface beside its replacement")
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (thin) · **Scope:** the 3 mixed-idiom SFCs, `useToastGuard`, the `*Types.ts`/curve-util modules · **DAG-deps:** none.
- **Provenance:** `a-frontend-encapsulation §1` (MED SHIP), `§2/§3` (LOW SHIP).
- **§The state, verified:** two template-ref idioms ship side-by-side (`useTemplateRef` ×28 vs legacy `ref<…>(null)` ×7, 3 files mix BOTH — `a-frontend-encapsulation §1`). Two LOW file-kind mislocations: `useToastGuard` is a pure predicate with a `use*` name; `*Types.ts`/`timingCurveUtils` live under `composables/` (§2/§3).
- **§Goal:** the §Mandate's "no replaced surface beside its replacement," in Vue idiom.
- **§Scope:** **S1** — collapse the 7 legacy template-refs to `useTemplateRef` (WHAT: the idiom convergence; WHY: one idiom, not two side-by-side). **S2** — rename the `use*`-named pure predicate (`useToastGuard`→`toastGuard`; WHY: file-kind honesty). **S3** — re-home the `*Types.ts`/curve-utils out of `composables/` (WHY: a type/util module is not a composable).
- **§Hard gate:** `proof:demo-template-refs` (zero bound `ref<…>(null)`; only `useTemplateRef`) + a pure-module-named-`use*` detector. **BITE:** add a new bound `ref<HTMLElement>(null)` → the template-ref clause reds.
- **§Folds:** `a-frontend-encapsulation §1/§2/§3`. (`§4` MEASURE-FIRST, `§5/§6` RECORD — the correct `h()` slot-projection is explicitly DECLINED.)
- **§Design decisions RESOLVED:** the bulk is ALREADY-SOTA; `§5`'s `h()` slot-projection is correct and NOT touched.

### G.W8 — frontend-state store-idiom close (the one store outside the singleton idiom)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (MED correctness) · **Scope:** `useAssetManager`, `resetAllStores`, the dead `stateVersion` counter · **DAG-deps:** none.
- **Provenance:** `a-frontend-state §1` (MED SHIP), `§2` (LOW SHIP).
- **§The state, verified:** `useAssetManager` is the lone stateful store outside `createGlobalState`, double-instantiated → 2 refs over 1 key (a correctness defect on a vueuse internal — `a-frontend-state §1`). A dead `stateVersion` counter (§2).
- **§Goal:** bring the one outlier store into the singleton idiom; delete the dead counter.
- **§Scope:** **S1** — wrap `useAssetManager` in `createGlobalState`, symmetrize `resetAllStores` (WHAT: the singleton; WHY: ref identity — one ref per key). **S2** — delete the dead `stateVersion` counter (WHY: dead export).
- **§Hard gate:** `proof:asset-store-singleton` (`useAssetManager()===useAssetManager()` ref identity) + a `proof:no-dead-export`. **BITE:** revert to the bare factory → the ref-identity assertion reds (two distinct refs).
- **§Folds:** `a-frontend-state §1/§2`. (`§3/§4` RECORD, `§5` ALREADY-SOTA.)
- **§Design decisions RESOLVED:** the Mandate-hardest state rules are HONORED, not violated; only the one outlier store needs the singleton.

### G.W9 — the rAF-leak lifecycle correction (HIGH — the one real NEW brittleness defect)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (HIGH) · **Scope:** the 4 scene loop-owners, `App.vue:197` fossil comment, `coastPlayback` · **DAG-deps:** none.
- **Provenance:** `a-frontend-brittleness §1` (HIGH SHIP), `§2` (LOW SHIP).
- **§The state, verified:** four scene loop-owners wire rAF cleanup to a dead `onDeactivated` (a `<KeepAlive>`-only hook) under a bare keyed `<Suspense>` with NO `<KeepAlive>` host → dead code; two of four LEAK the rAF preview loop on every play-then-swap (Easing/Spring leak the preview loop perpetually — `a-frontend-brittleness §1`). inv-κ §3 HOLDS (`proof:brittleness` PASS) — this is a class the E.W2 gate does not catch (it greps listeners, not lifecycle-hook misuse).
- **§Goal:** re-home the cleanup on the live lifecycle seam so the dogfooded preview loop stops.
- **§Scope:** **S1** — re-home cleanup on `onScopeDispose`/`onBeforeUnmount`, mirroring `useRafLoop.ts:56`; delete the dead `onActivated`/`onDeactivated` hooks + the `App.vue:197` fossil comment (WHAT: the lifecycle correction; WHY: the hooks never fire without a `<KeepAlive>` host). **S2** — `coastPlayback` unmount stop (§2).
- **§Hard gate:** `proof:brittleness` clause-4 lifecycle sub-clause — zero `onActivated`/`onDeactivated` while no `<KeepAlive>` in the tree (KeepAlive-grep stale-guarded). **BITE:** re-add an `onDeactivated`-bound cleanup with no `<KeepAlive>` host → the lifecycle sub-clause reds.
- **§Folds:** `a-frontend-brittleness §1/§2`.
- **§Design decisions RESOLVED:** this is an inv-κ-class regression the E.W2 gate does not catch (greps listeners, not lifecycle-hook misuse) — extend `proof:brittleness`, do not just patch.

---

## BAND 5 — STYLING / DESIGN-IDIOMS + DEMO USABILITY / AFFORDANCE

**Provenance:** `a-styling §1–§6`, `a-demo-playwright` X-5/X-6/X-3/X-1, `a-glass-ui`
GG-5/GG-2. **DAG: independent of the engine bands** (the demo waves must not reintroduce
a dock occlusion, inv δ). The post-F demo is ~90% SOTA; the residual is finishing.

### G.W10 — the W10/W12-scene idiom finishing sweep (the SAME drift class, SAME surfaces)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (thin) · **Scope:** `design-idioms.css`, the `sequence/`/`motion-path/` scene SFCs · **DAG-deps:** none.
- **Provenance:** `a-styling §1–§6`.
- **§The state, verified:** the post-F W10/W12 scenes re-fork idioms D.W2 + F§1 already retired: `.settled-badge`/`.tracking-badge` byte-identical across SpringTarget + SequenceTarget; `.code-token` dup; `.mp-traveller` hand-rolls `.progress-ball`; a `400px` coupled magic number; a mask-fade token shadow; an `h-fit` nit (`a-styling §1–§6`). The SAME drift class as F §1's rail/ball, in the SAME-shaped post-sweep scenes.
- **§Goal:** each idiom defined ONCE; zero scene re-fork.
- **§Scope:** **S1** — promote `.status-badge` (settled/tracking/reverse) + `.code-token` to `design-idioms.css` (the layer that already owns the rest). **S2** — `.mp-traveller` consumes `.progress-ball`. **S3** — token `--controls-pane-width` + `--mask-fade` (kill the coupled magic numbers + the token shadow). **S4** — `h-[fit-content]`→`h-fit`.
- **§Hard gate:** the `proof:idioms` clause-shape D.W2 uses — each idiom defined ONCE, zero scene re-fork. **BITE:** re-fork `.settled-badge` into a scene SFC → `proof:idioms` reds.
- **§Folds:** `a-styling §1–§6`. (`§7` RECORD — the `--filter-brand-color` SVG recolor is latent/brand-hue-gated; `§8` ALREADY-SOTA.)
- **§Design decisions RESOLVED:** same class as F §1's rail/ball drift; the fix is promotion to the idiom layer, isomorphic (named: the W10/W12 scenes converge to the existing tokens).

### G.W11 — the demo usability SHIPs (the Playwright SHIP set)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G · **Scope:** `demo/app/router.ts`, `AnimatedText.vue`, the editor transport/menubar aria · **DAG-deps:** none.
- **Provenance:** `a-demo-playwright` X-6/X-5/X-3.
- **§The state, verified:** **(X-6)** the Discrete scene is unreachable — `scenes.ts` registers `starting-style` but `router.ts` has NO route → the catch-all `{ path: "/:pathMatch(.*)*", redirect: "/" }` redirects it home; a whole registered scene is dead (verified live: `router.ts` route list has no `starting-style`/Discrete entry; the catch-all redirects home). **(X-5)** the hero LCP renders "Selectananimation" — inter-word spaces collapse between `inline-block` word spans (`AnimatedText.vue`; inter-word gap = 0px), the most-visible defect on the LCP. **(X-3)** a duplicate "Play animation" a11y name — transport + menubar, every editor scene.
- **§Goal:** four live-verified demo defects fixed, two on the most-important elements.
- **§Scope:** **S1** — add the missing `starting-style`/Discrete route to `router.ts` (WHAT: the 1-line route; WHY: a registered scene is dead). **S2** — fix the hero inter-word word-spacing in `AnimatedText.vue` (WHAT: restore the inter-word gap; WHY: the LCP renders an unreadable string). **S3** — disambiguate the duplicate "Play animation" aria-label (transport vs menubar; WHY: duplicate accessible names).
- **§Hard gate:** a `demo-smoke` route-reachability assertion + an `AnimatedText` inter-word-gap > 0 assertion + a unique-aria-label assertion. **BITE:** revert the route → the reachability assertion reds; revert the spacing → the inter-word-gap assertion reds.
- **§Folds:** `a-demo-playwright X-6/X-5/X-3`. (X-2 ellipsis-as-keyframe parse trace, X-4 panel-occlusion redesign, X-7 theme-toggle aria-pressed = BOOK; the LoAF + occlusion gates STAND, never regress — the C.W1 drifts preserved.)
- **§Design decisions RESOLVED:** the hero/route corrections fix WRONG pixels → right (the named-befitting delta, not an isomorphic change); the FLAG (Sequence clock did not advance under synthetic playback) is a manual-confirm note, not a SHIP.

### G.W12 — the dock affordance (glass-ui-HANDOFF + kf-demo D.W5 close)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (kf half) + glass-ui-HANDOFF (the root fix) · **Scope:** `dock/TopDock.vue`, `dock/index.ts`, `test/stubs/glass-ui-motion-core.ts`, `occlusion-gate.mjs` · **DAG-deps:** G.W2 (rides the glass-ui re-pin).
- **Provenance:** `a-demo-playwright X-1`, `a-glass-ui GG-5/GG-2`.
- **§The state, verified:** the gate is OPEN (3.3.0 published). `dock/` has `TopDock.vue` + `index.ts` only (live); `index.ts` is a 3-line nested re-export barrel; `TopDock.vue:118 :always-expanded="isMobile"` is the occlusion-dodge mask; `:107-109 activeLayer=computed(()=>"main")` is a dead single-layer-group costume. The `--z-dock` token is not applied to glass-ui internal dock layers → the scene viewport wins the hit-test (the 15px collapsed sliver — `a-demo-playwright X-1`). The vitest VT stub has drifted (phantom `_options?:{types}` param; native return shape ≠ glass-ui's `ViewTransitionResult` — `a-glass-ui GG-2`).
- **§Goal:** close D.W5 the kf-demo half; the root occlusion fix is glass-ui-HANDOFF (per MEMORY, dock changes live in glass-ui, never re-masked in the demo).
- **§Scope:** **S1** — rename `TopDock→ChromeDock` (WHY: the D.W5 naming plan). **S2** — delete the `dock/index.ts` pass-through barrel; import glass-ui dock primitives directly (WHY: no nested-import barrel). **S3** — REMOVE the `:always-expanded` occlusion mask; let glass-ui's rebuilt dock own the no-occlusion contract (WHY: REMOVE the workaround, do not tune it). **S4** — collapse the dead single-layer `DockLayerGroup` (WHY: dead-code excision). **S5** — realign the drifted vitest VT stub to `satisfies typeof import("@mkbabb/glass-ui/motion-core")` (WHY: drift reds the type-check). **S6** — the one `reka-ui` `SelectIcon` reach (GG-6) → demo-local `DockSelectTrigger` OR glass-ui re-export.
- **§Hard gate:** the EXISTING `occlusion-gate.mjs` HARD re-run mask-free (must stay green WITHOUT the crutch) + a `proof:decomposition` barrel-absent clause + the `satisfies` compile-time stub bite. **BITE:** re-add the `:always-expanded` mask → `occlusion-gate.mjs` must still pass WITHOUT it (if it can't, that residual is glass-ui-HANDOFF); re-add the `dock/index.ts` barrel → the barrel-absent clause reds.
- **§Folds:** `a-demo-playwright X-1` (the kf-demo half) + `GG-5` + `GG-2`. The mobile-occlusion residual = glass-ui-HANDOFF (fix in the dock root, never re-mask in the demo).
- **§Design decisions RESOLVED:** D.W5 was the ONE legitimately-blocked carry A→F; the blocker is GONE; the fix REMOVES the mask (inv δ stays HARD).

---

## BAND 6 — ANIMATION SOTA + MODERN-WEB ADOPTS

**Provenance:** `r-animation-sota G26-2/G26-5`, `r-modern-web MW-CHK-1`. **DAG: G.W13 is
engine-side, independent; G.W14 is a checklist row.** F closed 3 of 6 frontier items;
two cheap additive gaps remain.

### G.W13 — the two narrow net-new engine SHIPs (DrawSVG + `.finished`)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (additive public API) · **Scope:** a new `src/animation/draw-svg.ts` mirroring `motion-path.ts`; a `get finished()` on the engine · **DAG-deps:** none.
- **Provenance:** `r-animation-sota G26-2` (DrawSVG), `G26-5` (`.finished`).
- **§The state, verified:** kf ships zero SVG-stroke primitive; `getTotalLength()` is a CSS-native sliver, WAAPI-eligible, with no value.js dep (`r-animation-sota G26-2`). There is no `.finished` getter over the held play promise (`G26-5`).
- **§Goal:** close the two cheap additive gaps F left at the frontier.
- **§Scope:** **S1** — `fromDrawSVG` mirroring `motion-path.ts`: ONE `getTotalLength()` read, `stroke-dasharray===getTotalLength`, `stroke-dashoffset` sweep, WAAPI-eligible, zero value.js dep (WHY: the CSS-native sliver of the SVG triad — F bundled it with MorphSVG; G re-splits it). **S2** — `get finished()` over the held play promise (WHY: the additive `.finished` API surface).
- **§Hard gate:** `proof:drawsvg` (dasharray===getTotalLength, dashoffset sweep, WAAPI-eligibility lock) + `proof:finished` (resolves once at end; pre-resolved when settled). **BITE:** make `fromDrawSVG` write a computed unit → the WAAPI-eligibility lock reds; resolve `.finished` twice → the once-only assertion reds.
- **§Folds:** `r-animation-sota G26-2/G26-5`. (MorphSVG/numeric-MotionPath G26-1 = BOOK after value.js VJ-F1; splitText G26-3/intrinsic-size G26-4 = BOOK.)
- **§Design decisions RESOLVED:** DrawSVG mirrors the `motion-path.ts` transposition (zero value.js dep, WAAPI-eligible); the heavier SVG geometry (MorphSVG) stays BOOK behind the value.js path-geometry sampler.

### G.W14 — the modern-web checklist completeness fix (byte-cheap; zero demo pixels move)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** SHIP-in-G (byte-cheap) · **Scope:** the `proof:modern-web §S6` CHECKLIST · **DAG-deps:** none.
- **Provenance:** `r-modern-web MW-CHK-1`.
- **§The state, verified:** 3 post-F catalog levers (`sibling-index()`, Custom Highlight API, `<dialog closedby>`) have no row in the `proof:modern-web §S6` CHECKLIST; all 18 existing rows HOLD (`r-modern-web §4`). Each lever is correctly NOT-adopted (not Baseline / no clean fit / glass-ui seam).
- **§Goal:** keep the gate's completeness claim honest.
- **§Scope:** **S1** — add the 3 rows (each N-A/OUT with the live Baseline string) to the CHECKLIST (WHY: the completeness claim must enumerate every lever, even the not-adopted ones).
- **§Hard gate:** the existing `proof:modern-web` — extend `CHECKLIST`; deletion of a row re-falsifies the coverage claim. **BITE:** delete a row → the coverage claim reds.
- **§Folds:** `r-modern-web MW-CHK-1`. (MW-VT-1 VT-types = glass-ui-HANDOFF, Band V.)
- **§Design decisions RESOLVED:** the 3 levers are each correctly NOT-adopted (`sibling-index()` not Baseline, Custom Highlight no clean fit, `<dialog closedby>` a seam); the row documents the refusal.

---

## BAND V — CROSS-REPO HAND-OFFs (the user drives under relaxed inv-16)

This is the inv-16-RELAXED band: the user drives value.js / parse-that / glass-ui /
deploy, but each sibling is AUDITED as its own surface and HAND-OFF-tagged + sequenced.
kf consumes everything through the single `lerpValue → iv._lerp` seam (`engine.ts:731`)
with ZERO kf edits. The one genuinely-chronic item (the value.js charter, C-1) is
CHRONIC-by-design and *correct* — the process ships a slice every tranche.

### G.WV — the sibling-repo hand-offs (each AUDITED as its own surface, tagged + sequenced)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** HAND-OFF (sequenced behind their producers) · **Scope:** value.js / parse-that / glass-ui / deploy · **DAG-deps:** G.W2 (the re-pin consumes the landed halves).
- **Provenance:** `a-valuejs-leverage F-VJ-4..8`, `a-parsethat-leverage G-PT-2/3/4/5`, `a-glass-ui GG-3/GG-4/GG-6`, `a-constellation-gaps G-CONST-3/G-HANDOFF-1..4`, `a-deferred-ledger §3/§4/§5/§6`.
- **§The state, verified:** the §1 charter slice (A/B/D2/F7) + §2 PT-1/PT-2 are LANDED in `0.11.0`/`0.9.0` and consumed via G.W2; the residual (VJ-F1/F4, E1/E2, F3, the diagnostics sink, PT-4, H-1, the deploy template) is verified OPEN.
- **§Goal:** sequence the sibling-owned residual; the user drives.
- **§Scope (the tagged hand-offs):**
  - **value.js-HANDOFF:** VJ-F1 path-geometry sampler (unblocks MorphSVG/numeric-MotionPath G26-1; `r-animation-sota`/`a-valuejs F-VJ-7`); VJ-F4 buffer-reusing `unflattenObjectToString` (the real per-frame garbage; `a-engine-perf G-3` — kf consumes the out-buffer overload on the SAME re-pin); the structured-diagnostics sink + `tryParse` `furthest` swap (`a-parsethat G-PT-3`/`a-valuejs F-VJ-5`); F3 LRU bound (ONCE in value.js — no 2nd kf policy, DRY); E1/E2 `linear()`/`steps()` parser (kf's `parseLinearStops` shim at `utils.ts:106-130` RETIRES on land — no-legacy); the S4 native-WAAPI color path (`cssColorInterpKeyword` + the L4 serializer) with the paired kf eligibility-lift on publish (`a-valuejs F-VJ-4` / `G-HO-10`); the F2/F2b `currentColor`/`light-dark()`/`contrast-color()` color sentinels with the paired kf policy (`a-valuejs F-VJ-5` / `_SYNTHESIS-deferred-ledger §1 F2/F2b` — HIGH for `currentColor`/`light-dark`, `contrast-color` BOOK; must NOT alias to value.js's black/white-only `safeAccentColor`); the `dispatch`-LUT inner forks (`G-PT-4`, A-tier in flight); parse-that peer-declare to collapse the realm cast (`G-PT-2`/`F-BL-5`).
  - **value.js-HANDOFF (SUPPLEMENTAL, from `_SYNTHESIS-perf-testing-engine §2/§4`):** **CF-6** the F3 LRU bound, RE-GROUNDED — the compile-side `tryParseCache` is unbounded (`a-perf-compile-flatten-bitpack` CF-6); this is the SAME MF-9/F3 item the existing set carries, re-grounded as ALSO touching the compile (not only runtime) — bound it ONCE in value.js (no 2nd kf policy, DRY). **MCI-2** the color-interpolation sentinels (`a-modern-css-interp` MCI-2; value.js owns the color leaf) — kf consumes through the unchanged seam. (MCI-5 the identity-aware fn-arity pad is ALSO a value.js-HANDOFF; its witness rides G.W15's `proof:fn-arity-pad`.)
  - **parse-that-HANDOFF:** the WITHHELD `(id,offset)` packrat re-key (build `proof:packrat-position` THEN re-key — the one parse-that item F left undone; `a-deferred-ledger PT-4`; blast radius contained to the BBNF left-recursion path, now isolated + opt-in).
  - **glass-ui-HANDOFF:** `startViewTransition({types})` + `:active-view-transition-type()` CSS (= H-1, unblocks the demo scene-VT FB-4/GG-4; `a-glass-ui GG-3`/`r-modern-web MW-VT-1`); the mobile dock occlusion in the rebuilt dock (`GG-5` half); the reka `SelectIcon` re-export (`GG-6`).
  - **deploy-HANDOFF:** distil kf's `deploy-pages.yml` into the spine CF-Pages template (kf authors, deploy writes); fix `dns-cf-sync.sh:105` `keyframes.pages.dev`→`keyframes-8uq.pages.dev` (P0 — a blind sync REGRESSES the live CNAME); refresh the stale CONSTELLATION roster (`a-constellation G-CONST-3`/`G-HANDOFF-2/3/4`).
- **§Hard gate:** each hand-off carries its producer's gate (`proof:packrat-position`, the value.js path-length parametrization test, the browser-driven VT-types `demo-smoke` assertion); the kf consumer halves ride the G.W2 re-pin's `proof:deps-current`. **BITE:** a kf consumer half that requires a kf source edit beyond the re-pin = a finding against the consume-unchanged charter.
- **§Folds:** the whole §1/§2/§4/§5/§6 HAND-OFF tail.
- **§Design decisions RESOLVED:** ORDER — G-HANDOFF-1 (value.js re-pins its own parse-that) precedes a clean RP-4; the F3 LRU bound lives ONCE in value.js (no second kf eviction policy); the `parseLinearStops` shim RETIRES on E1 (no compat alias); the glass-ui occlusion residual is fixed in the dock root, never re-masked in the demo.

---

## BAND Z — THE CLOSE

### G.WZ — the tranche close (the D FINAL + the G FINAL + the re-publish leg)
- **Phase:** IMPL, spec authored in DEV — awaits auth · **Class:** BOOK (the close docs) + USER-DOMAIN (the publish leg) · **Scope:** `docs/tranches/D/FINAL.md`, `docs/tranches/G/FINAL.md`, the stacked changeset · **DAG-deps:** all G waves.
- **Provenance:** `a-deferred-ledger DP-2/PUB-1`.
- **§The state, verified:** `docs/tranches/D/FINAL.md` is ABSENT (verified live) — the one missing tranche record (DP-2). The `4.0.0` stack is DISCHARGED + published (version owner Mike Babb named for B+C+D+E+F). The re-pin is itself a publishable kf change stacking atop the clean `4.0.0` base.
- **§Goal:** write the close docs + the re-publish leg.
- **§Scope:** **S1** — write `docs/tranches/D/FINAL.md` (the one missing tranche record; describes the LANDED D content + notes D.W5 now closed via G.W12; DP-2 — no external blocker on the doc itself). **S2** — write `G/FINAL.md` (the lead authors it at close). **S3** — cut the stacked changeset (the re-pin re-publish `4.0.1`/`4.1.0` is a USER-DOMAIN confirm-first leg atop the clean 4.0.0 base; version owner Mike Babb).
- **§Hard gate:** `docs/tranches/D/FINAL.md` + `docs/tranches/G/FINAL.md` present; the changeset cut. **BITE:** the close is incomplete if either FINAL is absent.
- **§Folds:** `DP-2` (the D FINAL) + `PUB-1` (the re-publish leg, USER-DOMAIN).
- **§Design decisions RESOLVED:** the publish leg stays USER-DOMAIN, confirm-first; the D FINAL is trivially dischargeable (no external blocker on the doc).

---

## § The DAG (inter-wave dependencies)

```
                         ┌──────────────────────────────────────────────┐
                         │  Band 0 — VERIFICATION (LEADS)               │
                         │  G.W1 re-pin SAFETY lock (proof:boundary +    │
                         │       symbol-survival) — the measure-first    │
                         │       lock; ships NO source                   │
                         └──────────────────────┬───────────────────────┘
                                                │ (the lock pre-stages)
                         ┌──────────────────────▼───────────────────────┐
                         │  Band 1 — THE RE-PIN SPINE (lands FIRST)      │
                         │  G.W2 THE RE-PIN (8 lanes; ZERO kf edit) ─┐   │
                         │  G.W3 C1 container-resize fold            │   │
                         └──────────────────────────────────────────┘   │
                                  │ UNLOCKS value.js/parse-that consumption
       ┌──────────────────┬──────┴──────┬──────────────────┬────────────┐
       │ (parallel)       │             │                  │            │
┌──────▼──────┐  ┌────────▼───────┐ ┌───▼──────────┐ ┌─────▼────────┐ ┌─▼──────────┐
│ Band 2      │  │ Band 3         │ │ Band 4       │ │ Band 5       │ │ Band 6     │
│ G.W4 fail-  │  │ G.W6 CI hygiene│ │ G.W7 idiom   │ │ G.W10 styling│ │ G.W13 Draw │
│   explicit  │  │   (rides re-pin│ │ G.W8 store   │ │ G.W11 demo   │ │   SVG +    │
│ G.W5 line-  │  │   glass-ui pin)│ │ G.W9 rAF-leak│ │ G.W12 dock   │ │   .finished│
│   ceiling   │  │                │ │   (HIGH)     │ │  (rides re-  │ │ G.W14 chk  │
│   DECISION  │  │                │ │              │ │   pin GG-1)  │ │   list     │
└─────────────┘  └────────────────┘ └──────────────┘ └──────────────┘ └────────────┘
       │                │                  │                │              │
       └────────────────┴──────────┬───────┴────────────────┴──────────────┘
                                    │
       ┌────────────────────────────▼───────────────────────────────────────┐
       │ Band V — CROSS-REPO HAND-OFFs (G.WV; the user drives under relaxed   │
       │   inv-16; sequenced behind producers; G.W2 consumes the landed halves│
       │   via the unchanged seam; G-HANDOFF-1 precedes a clean RP-4)         │
       └────────────────────────────┬───────────────────────────────────────┘
                                     │
                            ┌────────▼────────┐
                            │ Band Z — CLOSE  │
                            │ G.WZ (D FINAL + │
                            │  G FINAL + leg) │
                            └─────────────────┘
```

**Critical path:** `G.W1 → G.W2` (the lock pre-stages the spine; the spine UNLOCKS the
value.js/parse-that consumption that lights every other value.js row). **Parallelizable:**
Bands 2, 4, 6 share no surface with the spine and run concurrently once G.W2 lands; Bands
3 and 5 ride the re-pin (the CI glass-ui pin bump in G.W6; the glass-ui dock in G.W12).
**Cross-band coupling:** G.W3 is the one kf-side fold the bare re-pin introduces; G.W12's
dock close rides the glass-ui re-pin (GG-1) and consumes the glass-ui-HANDOFF root fix.
**Band V is orthogonal** — kf consumes through the unchanged `lerpValue` seam; the value.js
/ parse-that / glass-ui halves each require ZERO kf edits to land the kf consumer half.

---

## § Honest provenance — net-new vs folded vs already-SOTA

**Net-new (the G content):** every SHIP/MEASURE-FIRST/BOOK above is a post-F assay
finding — the spine re-pin (8 lanes converge), the two gated decisions, the W10/W12
idiom-drift finishing sweep, the 4 Playwright demo SHIPs, the 2 narrow engine SHIPs, the
CI drift-closure, and the cross-repo HAND-OFFs. The GAP column is exactly: ONE spine,
TWO gated decisions, the idiom-drift sweep (styling + lifecycle + brittleness — same
scenes), the 4 demo SHIPs, DrawSVG + `.finished`, the CI hygiene gate, and the HAND-OFFs.

**Folded chronic debt: NONE.** P-invariant-28 is VACUOUS for G — D was the terminal
home; F folded ZERO chronic debt; G inherits a CLEAN ledger (zero KFE,
`_SYNTHESIS-deferred-ledger §7/§9`). The one true chronic (C-1, the value.js charter) is
CHRONIC-by-design and *correct* — the inv-16 process ships a slice every tranche; G
consumes the landed `0.11.0` slice via the re-pin. **No perpetual keyframes-owned punt
survives** — every carry exits with a terminal G disposition.

**Already-SOTA — G refuses to touch (§ below).** Stated plainly so no wave manufactures a
deficit.

---

## § ALREADY-SOTA — the binding refusal; manufacture NO work (binding per the §Mandate)

(Copied from `_SYNTHESIS-gap-scorecard §3 ALREADY-SOTA`, corroborated by
`_SYNTHESIS-deferred-ledger §8` and the per-lane §ALREADY-SOTA records.) Every lane
independently confirms these are exemplary and must NOT be re-touched:

- **The engine kernel + steppers + WAAPI eligibility + FrameCompiler split + color
  science + single-grammar parse + parse-that leaf tier** — ALREADY-SOTA, untouched
  (`a-engine-perf G-4/§ALREADY-SOTA`, `a-backend-godmodules` all-7-candidates,
  `r-animation-sota §ALREADY-SOTA`, `r-modern-web §4`, `a-valuejs-leverage §3.1/§4`,
  `a-parsethat-leverage §6`).
- **Both largest source files at their cohesive gestalt** — `engine.ts` 1313L,
  `group.ts` 752L (F.md NEW-3 ruling re-verified post-+99L growth; the line-ceiling is
  a GATED DECISION, not a split — G.W5).
- **The single-dispatch `lerpValue → iv._lerp` seam** (`engine.ts:731`) — the IDEAL
  cross-repo contract, the structural reason the re-pin is zero-kf-edit. The boundary
  did its job; the only thing missing is the PIN (`_SYNTHESIS-deferred-ledger §8`).
- **The value.js boundary** — light modules (`NumericAnimation`/`SmoothProgress`/
  `SpringProgress`/`Timeline`/`ElementMorph`) carry ZERO static value.js edge;
  `proof:boundary` self-enforces. value.js can land all of Wave B/C/D with ZERO kf edits
  — **the re-pin IS the leverage** (`a-valuejs-leverage §3.1/§4`).
- **The frontend-state Mandate-hardest rules** — never-destructure-`defineProps`,
  getter-fn-for-composables, typed provide/inject, disciplined `markRaw` — HONORED, not
  violated (`a-frontend-state` headline).
- **The inv-κ brittleness surface** — `proof:brittleness` PASS (the rAF-leak G.W9 is a
  lifecycle-hook class the listener-grep gate does not catch, NOT a regression of the
  honored surface).
- **The modern-web §4 surface** — all 18 §S6 rows HOLD; View Transitions (PE+a11y+PRM),
  `@starting-style`, `content-visibility:hidden` Monaco cache, the background pause, the
  Capsize font-CLS fallback, `yieldToMain`/LoAF/bf-cache (`r-modern-web §4`).
- **The CI deploy spine** — release.yml tag-gated + `--provenance` (SLSA via OIDC), the
  green-CI-gated `workflow_run` with the `head_branch=='master'` anti-drift guard,
  `pages-deploy.sh` (inv-28; kf IS the constellation reference — `a-ci-streamline §8`).
- **The demo's accessible-names / focus-rings / shortcut-discovery / explainer-prose /
  mobile dock** — exemplary; the Playwright SHIPs (G.W11) fix four discrete defects on
  an otherwise-SOTA chrome, not a rebuild (`a-demo-playwright` §ALREADY-SOTA).
- **The MF re-measures** (MF-4 diff-skip KILL, MF-5 preset-memo non-finding, MF-6 typed
  time index, MF-10 lighthouse-off-CI; W8 S1/S3) — all RECORD, settled, do NOT re-open
  (`a-engine-perf G-5`). **The ARCH-kills K-1..K-9 + D1** — re-affirmed terminal, no
  consumer pull (`_SYNTHESIS-deferred-ledger §7`).

**The SUPPLEMENTAL §ALREADY-SOTA additions (binding; from `_SYNTHESIS-perf-testing-engine
§3(d)` — the LARGEST part of the supplemental yield is MORE refusal, more grounded; the 8
supplemental lanes deepen the refusal with mechanism the phase-1 lanes could not carry):**

- **The runtime interp kernel at the V8 object-model level** — fast-properties buffers,
  PACKED_ELEMENTS arrays, a monomorphic `_lerp` inline cache, escape-elided binary-search
  accessors (`r-perf-hotpath-v8` HP-3/HP-4/HP-5; `engine.ts:606-737,730-732`). G touches
  NONE of it; the only lever is the re-pin (HP-1) + the booked SoA (HP-2).
- **The SoA carrier's cross-engine portability + the universal dict-mode avoidance** —
  the `Float64Array` carrier is the one interp shape that bypasses the shapes/IC/dict-mode
  machinery that DIFFERS across V8/SM/JSC; the F.W4 dict-mode-avoidance fold is correct on
  all three engines (`r-perf-crossengine` X-1/X-2). `%HasFastProperties` is the one V8-ism
  (the probe, not the invariant — X-2b RECORD).
- **The O(N) compiler + the four-form pre-flatten** — the F.W3 `buildVarIndex` killed the
  O(N²) reconcile (CF-2); the four derived forms are a correct F.W4 pre-flatten tradeoff
  (CF-5) (`a-perf-compile-flatten-bitpack`). The compile is value.js-bound, not kf-bound.
- **The DI / pipeline / dynamism / hygiene posture** — DI is constructor-injected (MD-2),
  the pipeline is a clean staged facade (MD-3), there is zero non-idiomatic dynamism
  (MD-4), zero nested-imports / test-in-src (MD-5) (`a-modularity-deep`). **This CONFIRMS
  the godmodules verdict by an orthogonal route** — the deep-modularity lens reaches the
  same gestalt ruling as the line-count lane (G.W5).
- **The modern-CSS interpolation kernel matrix (MCI-6)** — calc / var / @property /
  color-mix / relative-color / 9 `color()` spaces / gradients / transforms / matrix3d /
  filters all interpolate TODAY (`a-modern-css-interp` MCI-6, the binding matrix §5). The
  kernel interpolates nearly the WHOLE modern surface; G adds only 2 thin edge SHIPs
  (MCI-1/MCI-5, folded into G.W15) — manufacture no kernel work.
- **The scroll two-tier arch + the gimbal-free orbital ACCUMULATION + the inertia
  `decay()` dogfood** — the two-tier scroll arch + the ARCH-kill are ALREADY-SOTA (S-3..);
  the orbital rotation is quaternion-native and gimbal-free INTERNALLY; inertia rides the
  engine's own `decay()` (`a-scroll-orbital-quaternions` S-3../O-2). The defect is ONLY
  the OUTPUT round-trip (G.W18), not the accumulation.
- **The group BUFFER machinery** — null-fill clear, whitelist key-skip, zero-alloc
  (`a-group-layering` GL-7/GL-8). **The defect in the group is purely the blend LEAF
  (G.W17), NOT the compositor architecture** — the important distinction the gap-
  scorecard's missing group row obscured.

**The §ALREADY-SOTA record is BINDING: manufacture NO work where D+E+F lead.**

---

## § The honest bottom line

G is **the narrow re-pin-spined finisher with a large, honest ALREADY-SOTA refusal**.
The **spine (G.W2)** is the single highest-leverage, lowest-source-cost motion in the
whole ledger: kf 4.0.0 ships consuming stale siblings while the published `0.11.0` /
`0.9.0` / `3.3.0` carry the F hand-off wins kf DROVE — the −94% computed-endpoint memo,
the 3.96× color hot-path, the 2.41× dispatch, the C5 length-unit *correctness* fix, the
parse-that soundness — all PUBLISHED-BUT-UNCONSUMED. The whole F.W6 architecture was
load-bearing on "kf consumes it on re-pin"; the re-pin never happened. It lands with ZERO
kf source edit through the single `lerpValue → iv._lerp` seam, gated by a new
`proof:deps-current` + the C1 resolve-count witness (the C5 non-identity *correctness*
proof is OWNED by G.W16's `proof:computed-real-dom`, the only genuine path — it is
un-runnable on the jsdom rAF path the re-pin's gate runs on). Around it: the **gated
decisions** (the line-ceiling G.W5, the back-compat framing G.W4) taken not re-deferred;
the **W10/W12 idiom-drift sweep** (G.W10/G.W9/styling — the same drift class, same
surfaces, across styling AND lifecycle AND brittleness); the **Playwright SHIPs** (G.W11
— the dead Discrete route, the hero LCP word-spacing, the dup a11y name); the **two
narrow engine SHIPs** (G.W13 — DrawSVG + `.finished`); the **CI drift-closure** (G.W6);
and the **cross-repo HAND-OFFs** (G.WV) the user drives under relaxed inv-16.

Everything else — the kernel, the steppers, the WAAPI harness, the FrameCompiler, the
boundary, the color science, the parse grammar, the parse-that leaf tier, the
frontend-state tier, the CI spine, the modern-web surface, both largest source files at
gestalt — is **ALREADY-SOTA and left alone**. The deferred ledger is CLEAN (zero KFE —
P-invariant-28 held through F). **G proves itself net-new by what it leaves untouched as
much as by what it ships.**

---

## inv-16 / inv ε compliance

This charter wrote ONLY docs under `docs/tranches/G/` — ZERO source edits to
keyframes.js, value.js, parse-that, or glass-ui. Every claim traces to a named
phase-1/synthesis lane (cited inline) or a `file:line` against the live `tranche-g-dev`
tree, verified not asserted: the three-dep pin-lag (`package.json:84-88` →
`@mkbabb/value.js ^0.10.0`, `@mkbabb/parse-that ^0.8.2`, `@mkbabb/glass-ui
file:../glass-ui`, version `4.0.0` — verified live), the single seam at `engine.ts:731
lerpValue(eased, iv)` (verified live), `engine.ts` 1313L + `group.ts` 752L (`wc -l`), the
absent `docs/tranches/D/FINAL.md` (verified), the unreachable Discrete route (`router.ts`
route list has no `starting-style` entry; the catch-all `{ path: "/:pathMatch(.*)*",
redirect: "/" }` redirects home — verified live). The band→wave map proposes 21 waves
(`G.W1..G.W19` + `G.WV` + `G.WZ`) across 13 bands (the phase-1 Bands 0–6 + V/Z plus the
supplemental Bands T/G/O/M); each carries a falsifiable `proof:*` gate that BITES (the F
advisory→hard discipline). inv-16 is RELAXED for G impl (the user drives value.js /
parse-that / glass-ui too) but each sibling is AUDITED as its own surface and tagged
HAND-OFF (Band V). **The deferred ledger is CLEAN — no perpetual keyframes-owned punt
survives (P-invariant-28 held through F). G.W1..G.WZ IMPLEMENTATION awaits explicit
authorization — this is the canonical charter, authored in TRANCHE DEVELOPMENT.**
