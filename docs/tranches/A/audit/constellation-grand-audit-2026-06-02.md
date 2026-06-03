# A — Constellation grand-audit fold (2026-06-02)

keyframes.js' rows from the constellation grand-audit (`value.js/docs/tranches/K/audit/visual-evidence-2026-06-02/grand-audit/MASTER-FINDINGS.md` §A keyframes.js · §B owner-matrix · §D scorecards · §E themes). This is an **additive** spec layer over `A.md`: it folds the audit's keyframes findings into the existing A.W2-W4 waves (no new waves), gives every chronic A.W0 item a terminal disposition, and adds the constellation-positioning the value.js-gate framing never gave the engine — **keyframes.js is THE constellation animation engine** (glass-ui /motion fans it out; speedtest, slides, bbnf-buddy, value.js consume it directly).

All findings ground at `src/animation/*.ts:line` (confirmed against the live tree at fold-time). Disposition vocabulary per `A.md`: **SHIP**→named wave · **KILL**→recorded · **BOOK**→trigger+owner · land-or-refute.

---

## §1 — The audit's keyframes mandate vs the A.md plan (no surprises)

The grand-audit's keyframes §A row set is a **strict subset** of what A.md already specs into A.W4 — the audit surfaced the same 5 engine-pass items A.W0 found, plus a README-posture and two demo-typo/layout asides. **Nothing in the audit re-opens the boundary work (W1-W3); it all lands in A.W4** (the modern-web pass) or is a demo-local aside. This fold's job is to (a) bind each audit row to its wave with file:line freshly re-confirmed, (b) sharpen the WAAPI item to land-or-refute, (c) add the LoAF item the audit raised that A.md folded only as "dev-only", and (d) record the constellation-positioning + VAL-9 token-regen story that A.md's keyframes-internal posture omitted.

| Audit §A row (MASTER-FINDINGS) | Sev | A.md home | This fold |
|---|---|---|---|
| AnimationGroup.tick() — no main-thread yield | P2→**P1** | A.W4 (perf/INP) | **§2.1** — confirmed `group.ts:330-337`; scheduler.yield between child batches |
| Reduced-motion only on light engines | **P1** | A.W4 (motion) | **§2.2** — confirmed 3 dup decls + 6 ungated heavy drivers; ONE engine-base gate |
| WAAPI spring loses the curve | P2 | A.W4 (land-or-refute) | **§2.3** — confirmed `waapi.ts:171` hardcodes `easing:"linear"`; LAND verdict pre-argued |
| No LoAF observation | P2 | A.W4 (dev-only) | **§2.4** — dev-only LoAF observer; justifies the yield work |
| README modern-web posture | P2 | A.W4 close | **§2.5** — confirmed 0 posture lines; ship after the work |
| EasingResolvable / 3 `.ready()` copies | (boundary) | A.W2 | **§2.6** — already A.W2; re-confirmed the 3 sites + the audit's "EasingResolvable contract" naming |
| Hero headline off φ-ladder · dual display-serif | T·P2 | A (demo) | **§3** — demo-local typo; NOT engine; disposition recorded |
| Cube parked dead-center · demo scene-swap cross-fade · ScrollTimeline JS-poll | L·M·P2 | A (demo) | **§3** — demo-local; scene-swap → glass-ui startViewTransition (adoption) |

---

## §2 — Engine-pass items (all A.W4 unless noted) — file:line re-confirmed

### 2.1 — `scheduler.yield()` in `AnimationGroup.tick()` (P1, A.W4) — INP

**Ground:** `group.ts:330-337` builds `promises[]` over every child and `await Promise.all(promises)` in one shot per rAF; `draw()` (`group.ts:351-352`) then composites. `grep scheduler|yieldToMain|postTask` in `src/animation/` → **0 hits** (re-confirmed). The /easing-grid, /spring, /cube demos drive one large group → one long task per frame, no INP relief.

**Remediation (idiomatic, no workaround):** interleave a feature-detected `scheduler.yield()` between child-tick batches in `tick()` — keep `await Promise.all` as the **no-yield fallback** (Baseline-Newly: `≤20 LOC` `postTask`/`MessageChannel` shim per the A.md Baseline gate). This is the engine-internal sibling of glass-ui's shipped `useYieldToMain` (`glass-ui/src/composables/motion/useYieldToMain.ts`) — keyframes owns the engine-loop instance, glass-ui owns the Vue-composable instance; same scheduler authority, no shared module needed (keyframes is upstream of glass-ui).

> **Why P1 not P2:** this is the one hot loop the whole constellation drives through (glass-ui /motion → fourier/muster/words; speedtest canvas; slides). The audit lifted it P2→P1 for that reach. A.md already homes it in A.W4; this fold ratifies the bump. **SHIP A.W4.**

### 2.2 — Heavy-engine reduced-motion gate (P1, A.W4) — the constellation-wide hole

**Ground (re-confirmed at fold-time):**
- 3 **duplicated** `prefersReducedMotion()` decls: `smooth.ts:46`, `numeric.ts:50`, `spring.ts:67` (the audit said numeric/smooth/spring — exact match).
- **Zero** PRM gate in the HEAVY drivers: `grep prefersReducedMotion|respectReducedMotion|reduced-motion` in `engine.ts` / `morph.ts` / `timeline.ts` / `group.ts` / `waapi.ts` / `playback.ts` → **0 hits**. The heavy `Animation.play()` (`engine.ts:750`) branches `_playWAAPI`/`_playRAF` with no media-query check; `morph`/`timeline`/`group`/`waapi`/`playback` never consult PRM.
- Effect: `/cube`, `/amiga`, `/square` (and every glass-ui /motion surface that wraps `Animation`/`AnimationGroup`/`ElementMorph`/`Timeline`/WAAPI) animate fully under `prefers-reduced-motion: reduce`. **This is the constellation's heavy-surface PRM hole** (sibling to bbnf-buddy's P0 ZERO-PRM mascot loops and fourier's ungated epicycle — §E theme 5).

**Remediation (idiomatic, net-deletion):** hoist ONE shared reduced-motion gate to the engine/playback base (e.g. `internal/reduced-motion.ts` exporting `prefersReducedMotion()` SSR-safe + a `snapToFinal()` helper), **deleting the 3 hand-rolled copies** (numeric/smooth/spring re-import it — net −2 copies, no aliases per the no-legacy precept). Gate the heavy `play()` path so that under PRM it snaps to the final frame (t=1, single paint) instead of running the rAF/WAAPI loop. **Expose the gate** so glass-ui /motion can flip the whole constellation's heavy-surface PRM posture from one authority.

> A.md §Folded-ledger already homes this in A.W4 and the §Inherited-invariants "no backwards-compat" precept already mandates RELOCATE-not-alias. This fold adds: the gate must be **exported/consumable** (glass-ui /motion is the fan-out consumer — see §4), and the snap target is the heavy `Animation.play()` at `engine.ts:750` + `morph.ts`/`timeline.ts` play paths + the `group.ts` `draw()` reschedule. **SHIP A.W4.**

### 2.3 — WAAPI spring-curve `linear()` widening (P2, A.W4) — **LAND** (verdict pre-argued)

**Ground:** `waapi.ts:160-172` `toWAAPIOptions()` hardcodes `easing: "linear"` (line 171) with the comment "we always emit `linear` and let the keyframe stops carry any easing intent." But `springLinearStops()` (`springLinearStops.ts:46`) already emits a CSS `linear()` string from the **same solver** `springTimingFunction()` uses (`springTimingFunction.ts:60-69` — "same solver, same `(response, dampingFraction)` surface, no second integrator"). The WAAPI path never consumes it, so a spring `Animation` delegated to WAAPI runs the compositor at **linear**, not the damped-spring curve — the curve is silently lost on the one path that would put it on the compositor thread (the audit's 8r:easing violation).

**Remediation:** when an `Animation`'s easing resolves to a spring response (`useWAAPI` + a spring-derived `TimingFunction`/`linear()`-eligible curve), emit the `springLinearStops()`-widened `linear()` string into the WAAPI `KeyframeEffectOptions.easing` field instead of `"linear"`. The compositor then runs the true overshoot/settle.

> **Land-or-refute → LAND.** A.md left this as land-or-refute; the fold argues **land**: (1) the producer (`springLinearStops`) and the consumer-field (WAAPI `easing`) both ship — this is wiring, not net-new substrate; (2) it has a real consumer — the demo's spring curves + speedtest's needle (which the audit notes "should speak the same spring vocabulary"); (3) it is the only path that moves a spring onto the compositor. The refute-condition would be "no `Animation`-with-spring-easing is ever WAAPI-eligible" — but `isWAAPIEligible` (`engine.ts:761`) gates on direction/fill/target shape, not easing, so spring-eased WAAPI animations DO occur. **SHIP A.W4** (with the eligibility-edge test that proves a spring `linear()` reaches the WAAPI `easing` field, not bare `"linear"`).

### 2.4 — LoAF jank detection (P2, A.W4) — dev-only observer

**Ground:** `grep PerformanceObserver|long-animation-frame` in `src/animation/` → **0 hits** (re-confirmed). Jank attribution is eyeball-only; the A.md A.W4 gate ("a Playwright `bench/playwright.bench.ts` trace shows the group loop breaking >50ms tasks") has no in-engine attribution to justify the yield work.

**Remediation:** a **dev-only** `PerformanceObserver({type:'long-animation-frame'})` in the demo (Chromium-gated, feature-detected) + an **opt-in** engine hook (a no-op in prod, off by default) that attributes a LoAF to the active group/animation. This is the measurement that justifies §2.1's yield and makes the A.W4 Playwright trace causal, not anecdotal.

> A.md folded LoAF only implicitly ("a dev-only LoAF observer in the demo" — §A audit-row). This fold names it as a distinct A.W4 deliverable paired with the yield. Overfitting-audit clears: the observer has a consumer (the A.W4 bench gate + the yield justification) and is dev-only/opt-in (not shipped substrate). **SHIP A.W4.**

### 2.5 — README modern-web posture (P2, A.W4 close)

**Ground:** `grep -i baseline|reduced-motion|scheduler|tree-shak|sideEffects|prefers-reduced` in `README.md` → **0 hits** (re-confirmed). `package.json` carries `"sideEffects": false` (line 18) and the KF-B1 boundary is real, but the README documents none of the modern-web posture.

**Remediation:** a README section documenting **shipped reality** (authored AFTER §2.1-2.4 land): Baseline tier per facility (PRM=Widely, scheduler.yield=Newly, WAAPI `linear()`=Newly); the reduced-motion contract (heavy + light engines both honor it; how to opt in via `respectReducedMotion`); tree-shaking + `sideEffects:false` + the light/heavy boundary (`keyframes.js` barrel value.js-free, `engine-*` dynamic chunk); WAAPI eligibility. **SHIP A.W4 close** (last, so it documents landed behavior — per A.md "SHIP after the yield/PRM/WAAPI work so it documents shipped reality").

### 2.6 — EasingResolvable contract / 3 `.ready()` copies (boundary, A.W2 — already planned)

**Ground (re-confirmed):** three hand-rolled resolver copies — `numeric.ts:170` (the canonical: `_pendingEasingName` + `_easingReady` memoize + `ready()`), `morph.ts:94-95` (delegates to `animation.ready()`), `timeline.ts:74-92` (its OWN `resolveEasingName` + `_easingReady` + `ready()`). No shared contract; the audit names the target the **`EasingResolvable` contract**.

> This is **already A.W2** in A.md (§Resolved-design-decision: "the three hand-rolled `.ready()` copies collapse into one `EasingResolvable` contract"). The audit row confirms the same target with the same name — no change. Recorded here only so the grand-audit row maps to a wave. **SHIP A.W2** (per existing plan; net deletion of 2 copies, zero static value.js edge preserved).

---

## §3 — Demo-local asides (NOT engine) — terminal dispositions

The audit raised three demo/typo/layout rows that are **not engine surface**. keyframes.js' product is the engine; the demo is its shop-window. These get dispositions but do not expand the A.W4 engine pass.

| Audit row | Ground | Disposition |
|---|---|---|
| Hero headline off φ-ladder (`text-6xl/8xl/5xl/2xl`) | `demo/.../EditorStartScreen.vue:6,22,28` | **BOOK → A demo-polish** (trigger: any demo-typo wave). Re-rung on `.text-display-*` φ-rungs; keep Instrument Serif as `--font-display`. Glass-ui-owned rungs (`typography.css:152-265`) — pure adoption, no net-new. |
| Dual display-serif split (`--font-serif`=Instrument, `--font-display`=Fraunces → AssetViewport renders a 2nd face) | `demo/style.css:7`; `AssetViewport.vue:52` | **BOOK → A demo-polish.** Set BOTH `--font-display`+`--font-serif`=Instrument Serif; drop the per-component class. App-local token fix. |
| Cube parked dead-center (`place-items-center`) | `EditorShell.vue:3,56` | **KILL** (recorded). Aesthetic-only; the dual-dock symmetric stage is intentional for the engine shop-window. No defect, no consumer pull. Not worth a wave. |
| Demo scene-swap bespoke cross-fade (`<Transition name="scene" out-in>`) | `demo/app/App.vue:113,406-423` | **BOOK → A demo-polish.** Drive through glass-ui `startViewTransition` (SHIPPED — pure adoption; muster proves it). The engine's shop-window should model the modern VT idiom. |
| ScrollTimeline JS-polls scrollY | `timeline.ts:196-212` | **BOOK → A.W4-adjacent or A-tail** (trigger: a progress-linked consumer that needs native `animation-timeline:scroll()/view()`). Feature-detect native ScrollTimeline beside the JS fallback (Chromium-gated, per-browser). Currently no consumer pulls it → not A.W4-core; recorded so it is not a perpetual punt. |

> **Why BOOK not SHIP-now:** these are demo-surface, and A.md scopes A.W4 to the **engine** modern-web pass (the demo is the engine's shop-window, not the product). They are real and grounded, so they get a named demo-polish home with triggers rather than a silent drop. The cube-centering is the only KILL (aesthetic preference, no defect).

---

## §4 — Constellation positioning: keyframes.js is THE animation engine

A.md framed A as "keyframes.js-internal" and noted the constellation "only ever treated it as the value.js gate." The grand-audit §B owner-matrix and §E themes correct that: **keyframes.js is the constellation's animation-engine OWNER.** This fold records the consumer graph so the A.W4 engine work is understood as constellation-wide, not local.

### 4.1 — Who consumes the engine (confirmed via `package.json` across the constellation)

| Consumer | Dependency | How it consumes |
|---|---|---|
| **glass-ui** | `@mkbabb/keyframes.js: ^2.2.0` | `/motion` + `/motion-core` fan-out: `useSpring` (`SpringProgress`), `useRAFLoop`, `useAnimatedNumber`, `useYieldToMain` (`src/composables/motion/*`). glass-ui re-exports the engine to **fourier, muster, words** (who never depend on keyframes directly — they get it through glass-ui /motion). |
| **speedtest** | `@mkbabb/keyframes.js: ^2.2.0` | Needle decel SHOULD use `springTimingFunction` (audit AT row: "feed `springTimingFunction({response,dampingFraction})` into the needle solver so canvas + DOM share one spring vocabulary"). |
| **slides** | (description: "backed by glass-ui + keyframes.js") | Deck page-turn motion via glass-ui spring tokens. |
| **bbnf-buddy** | `@mkbabb/keyframes.js: ^2.1.1` | Mascot runtime loops (needs the 3.1.1 glass-ui bump to consume `useRAFLoop`/`useYieldToMain` + the heavy-PRM gate — §A bbnf P0). |
| **value.js** | `@mkbabb/keyframes.js: file:../keyframes.js` | The original gate; goo-blob/spring physics. |

**Implication for A.W4:** the heavy-engine PRM gate (§2.2) and the tick-yield (§2.1) are **must-land-before** any constellation INP/PRM audit banks keyframes-driven surfaces (§B owner-matrix row "Animation engine"). glass-ui /motion's **global** heavy-surface PRM posture depends on keyframes exporting the gate — that is why §2.2's "expose the gate" clause is load-bearing, not cosmetic. The engine work can proceed NOW (it is engine-internal; `useYieldToMain` already ships in glass-ui as the composable-tier sibling).

### 4.2 — VAL-9: the `--spring-*` token regeneration (keyframes is the mint)

**Ground (the key finding):** glass-ui's `--spring-smooth` / `--spring-snappy` / `--spring-bouncy` / `--spring-gentle` tokens (`glass-ui/src/styles/tokens.css:158-161`) are committed-static **49-stop `linear()` strings** — i.e. the exact output shape of keyframes.js `springLinearStops()` (`springLinearStops.ts:46`). They are consumed constellation-wide (e.g. `glass-ui/src/styles/theme.css:293-326` aliases `--ease-spring-*` and `--animate-*` to them; `dock.css:22`, `glyph-face.css:52`, `typography.css:470` consume them; speedtest/muster/slides motion speaks them).

Because the tokens are **hand-committed static strings** while `springLinearStops()`/`springTimingFunction()` share one solver (`springTimingFunction.ts:5-9`: "the same preset produces an identical curve whether emitted as a CSS `linear()` string or a JS easing"), the tokens can **drift** from the canonical math — there is no gate that the committed `--spring-*` strings equal what `springLinearStops()` mints for the named preset.

| | |
|---|---|
| **VAL-9 disposition** | **BOOK → glass-ui (owner) ADOPTION ASK + a keyframes.js-side regen authority.** keyframes.js OWNS the spring-curve math (`springLinearStops` + `springTimingFunction`, one solver). glass-ui OWNS the `--spring-*` tokens. **The ask:** glass-ui regenerates `tokens.css:158-161` from `springLinearStops()` (a build-time codegen consuming keyframes' export) so the tokens are minted, not hand-maintained, and cannot drift from the solver. |
| **Trigger** | the next glass-ui spring-token edit OR a constellation spring-vocabulary audit (speedtest needle + WAAPI §2.3 both want curve-parity with the tokens). |
| **Owner** | glass-ui (token surface) consuming keyframes.js's `springLinearStops()` (the mint). |
| **Why not keyframes-side now** | keyframes.js does not own the token file; authoring a codegen INTO glass-ui from keyframes' side would be a cross-repo write. A names it as an outward ASK (per the GLASS-UI-FIRST + cross-repo-confirm-first rules), not a local hand-roll. The §2.3 WAAPI `linear()` widening is the keyframes-side half (the engine consuming its own `springLinearStops` for WAAPI parity) — landing that makes the constellation's three spring surfaces (CSS tokens, WAAPI compositor, JS easing) provably one solver. |

> This is the keyframes.js role in VAL-9 (value.js's chronic spring-token item): **keyframes is the mint; glass-ui is the token surface; the ask is to regenerate the tokens FROM the mint.** Recorded as a BOOK with trigger + owner per the chronic-discipline rule — not a perpetual punt, but correctly owned outward.

---

## §5 — Chronic-discipline ledger: every A.W0 / audit item has a terminal disposition

Per the binding chronic-discipline rule, every chronically-deferred item from A.W0's evidence + this audit gets SHIP→wave / KILL→recorded / BOOK→trigger+owner. A.md already runs **zero-deferral** (PROGRESS §"Open deferrals: None beyond the named-forward `Worker`/`OffscreenCanvas`"); this fold confirms that and assigns the grand-audit rows.

| Item | Source | Disposition |
|---|---|---|
| AnimationGroup tick-yield (INP) | audit §A · A.W0 | **SHIP A.W4** (§2.1; P2→P1) |
| Heavy-engine PRM gate (3 dup decls → 1, 6 ungated drivers) | audit §A · A.W0 | **SHIP A.W4** (§2.2; export the gate for glass-ui /motion) |
| WAAPI spring `linear()` widening | audit §A · A.W0 | **SHIP A.W4 — LAND** (§2.3; verdict pre-argued) |
| LoAF jank observer (dev-only) | audit §A | **SHIP A.W4** (§2.4; paired with the yield) |
| README modern-web posture | audit §A · A.W0 | **SHIP A.W4 close** (§2.5; documents landed reality) |
| EasingResolvable / 3 `.ready()` copies | audit §A · A.W0 | **SHIP A.W2** (§2.6; already planned; net −2 copies) |
| Demo hero φ-ladder · dual display-serif · scene-swap VT | audit §A | **BOOK → A demo-polish** (§3; glass-ui-owned rungs/VT, pure adoption) |
| Cube dead-center | audit §A | **KILL** (§3; aesthetic, no defect, no consumer pull) |
| ScrollTimeline JS-poll → native | audit §A · `timeline.ts:196` | **BOOK → A.W4-adjacent/A-tail** (§3; trigger: a progress-linked consumer) |
| VAL-9 `--spring-*` token regen from `springLinearStops()` | audit §B/§E · glass-ui `tokens.css:158-161` | **BOOK → glass-ui ADOPTION ASK** (§4.2; keyframes = mint, glass-ui = token surface) |
| `Worker`/`OffscreenCanvas`/`Atomics` engine path | A.md §Folded-ledger | **KILL/named-forward** (substrate-without-consumer; note-only, no ship — unchanged from A.md) |
| CI `file:../glass-ui` seam · string-easing silent-linear footgun | A.md §Folded-ledger | **SHIP A.W1 / A.W2** (already planned; unchanged) |
| `proof:boundary` tree-shaking gate | A.md (inv α) | **SHIP A.W3** (already planned; unchanged — NOTE: the retired grep-`proof:*` idiom is value.js-domain; A's `proof:boundary` is a build-and-count gate, not a grep-codification, so it stands per A.md inv α) |

> **Zero perpetual punts.** Every row above is SHIP→named-wave, KILL→recorded-rationale, or BOOK→trigger+owner. The only KILLs are the cube-centering (aesthetic) and the `Worker` path (no consumer); both recorded with rationale.

---

## §6 — What this fold does NOT change

- **No new waves.** Everything lands in the existing A.W2 (EasingResolvable) and A.W4 (engine modern-web pass); demo asides BOOK to a demo-polish home. The 6-wave A.W0-A.W5 table stands.
- **No boundary re-open.** W1-W3 (CI repair, ergonomics, `proof:boundary`) are untouched by the audit — the audit's keyframes rows are all engine-pass or demo, not boundary.
- **No source edits.** This is a DEV-phase doc fold; the A.W2-W5 IMPL gates still open only on explicit user authorization per A.md §Dev/impl-boundary.
- **No new substrate.** The engine work is net-deletion (3 PRM copies → 1) + wiring (WAAPI consumes the already-shipped `springLinearStops`; the LoAF observer is dev-only/opt-in). The overfitting audit (every artefact ≥2 consumers or a demo) clears for each item — the PRM gate has 5+ consumers (the 6 heavy drivers + glass-ui /motion); the yield has the whole consumer graph; LoAF is dev-only.

**The fold's net effect:** keyframes.js A.W4 is now understood as the constellation's animation-engine modern-web pass (not a local one), with the heavy-PRM gate **exported** for glass-ui /motion fan-out, the WAAPI item resolved to **LAND**, the LoAF observer named, and VAL-9's `--spring-*` regen correctly owned outward as a glass-ui ADOPTION ASK keyed off keyframes' `springLinearStops()` mint.
