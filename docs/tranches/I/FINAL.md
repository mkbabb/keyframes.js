# Tranche I — FINAL

The authoritative close for keyframes.js' ninth tranche — the **runtime-integrity /
gate-blindspot-closure** tranche. The charter is `I.md`; the executive summary is
`PATH-FORWARD.md`; the live board + chronic ledger is `PROGRESS.md`; the audit evidence
(eight per-surface root-cause docs + the Playwright reproductions that reds B1–B9 first-hand
against the built `dist/`) is under `audit/`. This document reconciles the eight-wave ledger
(I.W0–I.W7) to a terminated state: every breakage RECOVERED behind an ACTUATING runtime gate,
every chronic CLOSED via a gate that BIT on the `b934a08` defect tree, every deferral
dispositioned to a terminal verdict, the gate regime re-founded and counted.

Tranche I is unlike every tranche before it. It exists because the close that preceded it
**lied** — and the lie was structural, not negligent. The single discipline I installs is:
**a gate's oracle must be the product property a human would check, exercised through the same
surface the human uses, with an error budget of zero across PLAY + SWITCH + DRAG.** Everything
else in this tranche is downstream of that one correction.

---

## 1. The catastrophe I ended

Tranche H shipped with **ALL ~97 `proof:*` gates GREEN** — `tsc` 0, `proof:all`,
`proof:browser` 35/35, `proof:visual-lock`, `proof:chronic-closure` — and its `FINAL.md`
declared every request resolved and the four chronics CLOSED. **The certification is false of
the product.** On 2026-06-08 the user drove the live demo and found **nine user-visible
breakages**; the I-investigation harness reproduced all nine first-hand. The very first gesture
a human performs — press the rainbow group-play — threw an uncaught error
(`Parse error at offset 0: "......"` + `this.transform is not a function`).

**The root cause was the gate regime itself, not a single careless wave.** Every H gate's
ORACLE was a PROXY one or more steps removed from the running product — source text, a jsdom
unit, a localStorage snapshot, a subject-masked self-baseline, a design-token number, or a
markdown table. The born-RED→green discipline laundered each proxy into a correctness claim.
~54 of ~98 nominal correctness gates could not, *by construction*, see a runtime defect; the
~34 that opened a browser rested on load, round-tripped a proxy store, or asserted the wrong
DOM projection — **and not one drove PLAY-then-SWITCH and asserted a clean console.** The
durability keystone, `proof:chronic-closure`, was itself a source-shape gate that parsed a
markdown table: a paperwork auditor auditing other gates' paperwork. The deepest expression of
the blindspot it was built to close. **97 green gates certified a broken demo because every
oracle was a proxy.** (See `PROGRESS.md §0`, `audit/rootcause-rc-gate-blindspot.md §1`.)

The same mechanism that certified the breakage green also auto-shipped it: `keyframes.babb.dev`
is a Cloudflare Pages project that deploys on every green-CI master push, so H's
`b934a08` close put the broken product live.

---

## 2. What landed — I.W0 through I.W7

Nine live breakages **B1–B9 + K** recovered across eight waves, each behind an ACTUATING
runtime gate that was witnessed born-RED on the `b934a08` defect tree. The engine was un-fenced
for I (inv-16 for I: `src/animation` is the kf PRODUCT — runtime correctness MAY require engine
transposition); the surgical corrections live at the serialize / playback / binding / geometry
seams, not in a re-litigation of the SOTA engine kernels.

| Wave · commit | Breakage | Fix at `file:line` | The runtime gate that BIT |
|---|---|---|---|
| **I.W0 · `107236d`** | **B1/B5** rainbow play throws `"......"` + `this.transform is not a function`; keyframes editor emits the lying `/* …no CSS twin */` placeholder | serialize from the DECLARED template, never a DOM-resolving `at(progress)` (`src/animation/format.ts:145-165`); a real no-op `transform` default at the FIELD `transform = NOOP_TRANSFORM` (`src/animation/group.ts:55`, inherited from first child `:142-143`); empty-group `play()` short-circuit (`useAnimationGroupPlayback.ts`) | `proof:engine-no-throw-on-play` (CLICKS rainbow group-play on home + cube, reads the LIVE console for the bare-`"......"` fingerprint + the cube draw-loop transform delta) |
| **I.W1 · `8a40cf4`** | **B2** DFA suspend throws `this._gen`; controls blank on switch | bind-proof `RAFPlayback` control surface by construction (closes the whole unbound-method class); consolidate the duplicated raw-rAF boilerplate into one `useRafScene` with bound callbacks; PRESERVE the correct pure suspend/resume-iff-was-playing reducer | `proof:fsm-suspend-resume-live` (PLAYS a raw-rAF scene, fires synthetic `visibilitychange→hidden`, switches → asserts ZERO `_gen` throw against the LIVE adapter) |
| **I.W2 · `e2085c8`** | **B4** `/easing` lost the curve/timing editor (folds mobile M2) | single-source the SELECTED control surface from the DFA so `<Tabs>` is born-correct on entry (kills the reka `passive`-latch desync); unify the two bezier hosts onto one `EasingEditor`; fold back read-only value + copy | `proof:easing-editor-live` (SWITCHES into easing → `.easing-curve-canvas` mounts active + `display!==none` + a handle-DRAG mutates the path `d`) |
| **I.W3 · `b8659fe`** | **B3** `/amiga` "floats around" | unify subject = orbit pivot = framing (centre the sphere, `controls.target` tracks it); shed `content-visibility:auto` from the live WebGL root | `proof:amiga-subject-is-pivot` (a CENTRE-DRAG moves the subject not the room, measured by canvas-region MAD) |
| **I.W4 · `3afd49f`** | **B6/B8** `/square` drag highlights chrome + does not persist; dock "broken, slow"; B3 RC-2 | one drag seam owns gesture-in-flight (lift global select-suppression + `releasePolicy:persist` into the shared `useDragScrub`); ONE composed `RAFPlayback` driver per scene; non-reactive `style.transform` writes for the sweep dot; dock perf | `proof:drag-gesture` (a real `page.mouse` DRAG selects no text + the transform persists) + `proof:perf-frame-budget` (CDP CPU-throttled dropped-frames ≤ the `b16`-bound budget) |
| **I.W5 · `bea5f27`** | **B9/K** dev `ENOENT easing-icon-sm.svg`; tab title wrong (DC-8 dead-CSS) | icon single-source; one canonical build `outDir` (kill the Mar-25 `demo/app/dist/` orphan); honest SPA-fallback 404 on asset-extension misses; `<title>keyframes.js</title>`; DC-8 dead-CSS grep = 0 | `proof:icon-paint-live` (every `SceneDescriptor.icon` PAINTS a non-zero inline `<svg>` + zero asset-404 during interaction + `document.title === "keyframes.js"`) |
| **I.W6 · `4103c22`** | **B7** specular sheen STILL present on every glass stage + 9–11 dock tracks | consume the PUBLISHED glass-ui `~3.9.0` flat default (`specular="off"` default-off; ZERO kf CSS, no fork); reclaim the Plus-Jakarta font default by overriding `--font-stack-text` at `:root` | `proof:specular-absent-at-rest` (rendered `::before` alpha at rest ≤0.05 by the pixels, born-RED on the 3.5.1 bloom) + `proof:demo-fonts` |
| **I.W7 · `1a708cf`** | **THE GATE-REGIME OVERHAUL** (headline; CLOSES) | install `proof:live-session` + `proof:gate-is-runtime`; rewire `proof:chronic-closure`; restructure into the two-tier `proof:correctness` / `proof:hygiene` taxonomy; RETIRE the 5 H proxy gates | `proof:live-session` — ONE interaction-driven session over the BUILT `dist`: PLAY + SWITCH + DRAG, accumulated error budget = 0 + the product-facing DOM B1–B9 + font |

Companion re-pin commit **`e473447`** re-pins `@mkbabb/value.js ^0.11.1 → ^0.11.2`
(§4-A below) — the load-bearing dependency half of B1.

---

## 3. The gate-regime overhaul — the proxy lattice replaced by an actuating regime

This is the tranche's headline, bound at I-open (t=0) as a charter invariant — the gate-ORACLE
precept, mechanically prior — and CLOSED by I.W7 (`1a708cf`).

**The new regime is two-tier.** `package.json` now defines exactly two aggregators:

- **`proof:correctness`** — **10 ACTUATING runtime gates**, every one of which opens a browser,
  ACTUATES the product (click / switch / drag / fire visibility), and asserts a product
  property a human would check:
  `proof:engine-no-throw-on-play`, `proof:fsm-suspend-resume-live`, `proof:easing-editor-live`,
  `proof:amiga-subject-is-pivot`, `proof:drag-gesture`, `proof:perf-frame-budget`,
  `proof:icon-paint-live`, `proof:specular-absent-at-rest`, `proof:demo-fonts`, and the
  gate-of-gates **`proof:live-session`**.
- **`proof:hygiene`** — every config / lint / class-shape / source-text / jsdom-unit check.
  These are strictly CORROBORATING. They may NEVER substitute for a red runtime clause, and may
  never count toward a correctness or chronic-closure tally. The two-tier taxonomy is a charter
  invariant and applies to the NEW I gates too — the overhaul holds itself to its own taxonomy.

**The headline `proof:live-session` is the gate-of-gates.** It is ONE interaction-driven session
over the BUILT `dist` (not source, not jsdom): load → CLICK play → hover-expand the dock +
SWITCH every scene → fire `visibilitychange` on a playing raw-rAF scene → DRAG the square +
bezier handles → switch back → replay. Its oracle is a **single accumulated S2a error budget = 0**
(HARD-zero on `pageerror` / `unhandledrejection` / `console.error` / the value.js `"......"` line;
PROMOTED-zero on the GPU-stall lines; MINUS the named-benign dev source-map noise — the allowlist
is ONE structured definition, inherited, no per-wave drift) **plus** the product-facing DOM
assertions for B1–B9 + the font. **`proof:live-session` GREEN means a human using the product
sees it work.** It assembles from each wave's interaction leg, so it is fully green only once
I.W0–I.W6 land.

**The meta-gate `proof:gate-is-runtime`** machine-enforces the precept from t=0: it reds any wave
that registers a source-shape-only oracle as its correctness gate, and verifies every wave Hard
gate opens a browser + actuates + is wired to the correctness tier. The precept is enforced by
machine, not asserted backward by the last wave.

**`proof:chronic-closure` was REWIRED**: each chronic must now cite a RUNTIME gate that BIT
(opened a browser, actuated, was witnessed born-RED on `b934a08`) — never a source-shape /
load-rest / proxy-store gate.

**Five H proxy gates were RETIRED** (their proxy oracles could not see the defects they
nominally guarded): `proof-demo-console-clean`, `proof-dock-morph-settled`,
`proof-no-orphan-specular`, `proof-scene-icons`, `proof-dragscrub-single`. The vaporware IOU
`proof:specular-handoff` was DELETED.

---

## 4. Two session resolutions (load-bearing for the close)

### A — The value.js dependency: B1 is two-sided, and value.js 0.11.2 is load-bearing

kf's I.W0 (`107236d`) is **not self-sufficient**. Rebuilding the `dist` on pristine PUBLISHED
value.js `0.11.1` (which has NO empty-input fix) reds `proof:engine-no-throw-on-play` clauses
**[a]** and **[hygiene f]** — the rainbow group-play on cube STILL throws
`Parse error at offset 0: "......"`. The contract `parseCSSValueUnit("") → ValueUnit(0)` (the
empty-input typed-empty contract) is therefore **LOAD-BEARING**: B1's empty-`var()` read-back
must die at the value seam, not only at kf's serialize seam.

Through the wave this contract was consumed locally (a `dist` cp). **This session PUBLISHED
value.js `0.11.2`** (registry-confirmed; value.js commit **`0cb5dd2`** `chore(release)` pushed,
preceded by `fbea3e2` `fix(parsing): parseCSSValueUnit empty-input contract — typed-empty, never
'......' throw`) and **re-pinned kf** `^0.11.1 → ^0.11.2` (commit **`e473447`**). The lockfile
now resolves `0.11.2` from `registry.npmjs.org`. Both `proof:engine-no-throw-on-play` AND
`proof:live-session` are GREEN on the PUBLISHED dependency — **no local cp**. `npm ci` in CI now
pulls the fix.

### B — The B3 amiga live-session leg: cold-GPU vs. real RC-2, honestly scoped

The integrated battery's B3 leg charged **4 PROMOTED "GPU stall due to ReadPixels" warnings**.
Root-caused: **NOT the product render loop.** The amiga code does zero `readPixels` (`cvAnc=null`
confirms the RC-2 content-visibility-over-WebGL source is gone). The 4 stalls are a **one-time
cold-GPU-process init burst** at t≈400ms (shader compile + the first backdrop-filter composite
reading the transparent `alpha:0` WebGL canvas back under the `.glass-dock` blur), flagged a
"stall" ONLY under headless SwiftShader; a WARMED second load emits ZERO.

The honest fix split B3 into (1) a STEADY-STATE present-loop GPU oracle (warm-then-observe — a
per-frame-readback regression still stalls every frame regardless of warmup, so it STILL bites
the real RC-2 defect) and (2) a declared-READBACK MAD leg (the harness `page.screenshot` is the
measurement INSTRUMENT, not the product, so it does not charge). This mirrors the canonical
`proof:amiga-subject-is-pivot` clause (a)/(c) split. A B1 verdict bug was also fixed (the leg set
`live` but not the `pass` field the verdict reads). The gate now bites the defect, not the
instrument.

---

## 5. The chronic ledger — TERMINATED

Per the I-born precept, NO chronic may close via a source-shape / load-rest / proxy gate;
closure requires a runtime/interaction gate witnessed born-RED on the `b934a08` defect tree.
This is the canonical substrate `proof:chronic-closure` parses (`PROGRESS.md §4`).

| Chronic | I closure — the RUNTIME gate that BIT |
|---|---|
| **CH-1** cartoon-shadow / specular (D2/D14) | `proof:specular-absent-at-rest` (rendered `::before` alpha ≤0.05 by the pixels; consume-edge = PUBLISHED + consumed glass-ui `~3.9.0`, a kf-owned edge, not a future version). The vaporware `proof:specular-handoff` DELETED. |
| **CH-2** φ-hero typography (D7) | RE-AFFIRM — genuinely closed; now corroborated by `proof:live-session`'s body-typography leg (born-RED on `b934a08`). |
| **CH-3** mobile architecture (D10) | `proof:perf-frame-budget` + `proof:drag-gesture` — the felt frame budget + shared drag seam (born-RED HEAD 12/114). M1/M2/M3 fold into the felt-interaction gates, not the layout-box proxy. |
| **CH-4** dock (D5 lag + D9 popover) | `proof:perf-frame-budget` — drives the dock hover-expand + measures dropped frames under a CPU throttle (the felt budget the token-peak proxy could not see). The felt "broken dock" decomposes to B1 + dock perf. |
| **CH-5** the `"......"` empty-value crash (B1/B5) | `proof:engine-no-throw-on-play` (CLICKS rainbow group-play on home + cube; born-RED on `b934a08`). |
| **CH-6** the `_gen` DFA suspend/resume crash (B2) | `proof:fsm-suspend-resume-live` (PLAYS + fires synthetic visibilitychange + switches; born-RED on the source-mapped `:5174` repro). |
| **CH-7** lost easing editor (B4) | `proof:easing-editor-live` (SWITCHES into easing + asserts the canvas mounts active + a handle-DRAG mutates the path; born-RED on the reka passive-latch blank). |
| **CH-8** amiga floats (B3) | `proof:amiga-subject-is-pivot` (a CENTRE-DRAG moves the subject not the room by canvas-region MAD; born-RED on the HEAD whole-room re-projection). |
| **CH-9** square drag selects text / no persist (B6) | `proof:drag-gesture` (a real `page.mouse` DRAG selects no text + the box transform persists; born-RED on the missing select-suppression seam). |
| **CH-10** dev ENOENT icon + the demo title (B9/K) | `proof:icon-paint-live` (every icon PAINTS a non-zero inline `<svg>` + zero asset-404 + the exact title; born-RED on the orphaned-rename). |

The chronic-closure ARCHITECTURE was sound; the I overhaul did not replace it — it forbade
born-RED gates against unpublished/vaporware targets and forced every cited gate to measure the
PIXEL/INTERACTION the user reports. The two failure modes H's mechanism exhibited (a born-RED
HANDOFF parked against vaporware never bites; a SYSTEM gate that measures the wrong axis passes
vacuously) are both closed.

---

## 6. The deferred ledger — final disposition (P-invariant close)

Every carry in `PROGRESS.md §4` exits with a TERMINAL I disposition; **no perpetual punt.** The
two fictional handoffs H carried — B1's never-authored gate and B7's vaporware target — are both
converted to real I-folds that landed. The full §4a–§4f tables hold the per-item probe + verdict;
the bands:

- **Crash chronics (B1/B5, B2)** — FOLDED + LANDED (I.W0, I.W1); each behind its runtime gate.
- **Live defects (B3/B4/B6/B9 + K)** — FOLDED + LANDED (I.W2/W3/W4/W5).
- **Sibling HANDOFFs** — `glass-ui specular`: HANDOFF + kf consume-edge LANDED (published `3.9.0`,
  consumed, gated by pixels). `dock transition:all` (M3/B8): rides the `3.9.0` pin + the kf perf
  gate. `dock-spring (D5)`: RE-AFFIRM (done). `value.js empty-input contract`: LANDED + published
  (§4-A). `value.js next-slice`, `parse-that packrat`, `{types} VT helper`, `LabeledField
  orientation`: CHRONIC-by-design or sibling-HANDOFF, gate-first, NOT an I wave (the re-pin
  process working as designed).
- **Engine / perf BOOKs** (`animation-composition`, async sync-step half, SoA `lerpArray`,
  MorphSVG, intrinsic-size, `Mod+K` palette, diagnostics sink) — each carries a terminal verdict
  (BOOK / MEASURE-FIRST + the gate to author first / value.js-HANDOFF). The `engine.ts ≤ 1400 OR
  named-measured split` ceiling (C-6) is RECORDED + GATED at the hygiene tier — the I.W0
  serialize-from-template transposition respects it.
- **Deploy + RECORD/KILL** — terminal; see §8. The ARCH kills (ScrollTimeline-native,
  Worker/OffscreenCanvas, WASM-parser, Typed-OM, per-property easing, bit-packing,
  `dev.sh`/`deploy.sh`, `ValueUnit` monomorphization) stay RECORD-permanent — no consumer pull
  A→H — and are not re-litigated.

The P-invariant policed the COLUMN under H; under I it polices the PRODUCT. Every row is terminal.

---

## 7. The glass-ui 3.9.0 consume-edge + the AX coordination

B7 was resolved two-sided with **zero kf fork**. The AX session PUBLISHED glass-ui **`3.8.0`**
(`Card specular="off"` default) and then **`3.9.0`** (the W54 specular consume edge); kf bumped
its pin **`~3.5.1 → ~3.9.0`** (tilde, skipping 3.6/3.7 per the wave — a naive bump to 3.7.0
WORSENS the bloom). The lockfile resolves `3.9.0`. The bloom is ABSENT at rest by the pixels
(`proof:specular-absent-at-rest`, born-RED on the 3.5.1 0.22–0.35 alpha, GREEN at 3.9.0). The
`::before{content:none}` consumer-suppression workaround was REJECTED. A 3.9.0 side effect — its
`typography.css` force-applying "Plus Jakarta Sans" to the body register — was reclaimed by
overriding `--font-stack-text` at `:root` (gated by `proof:demo-fonts`); the durable opt-out (a
glass-ui typography opt-in flag) is filed as a coordination ASK to the AX session. The dock-spring
memory rule — *dock/glass-ui fixes go in the glass-ui repo, never patched in the demo* — held.

---

## 8. Version + deploy disposition

**Version: kf is NOT byte-stable vs `4.1.0`.** Unlike H (a pure demo tranche whose library
surface was unchanged), Tranche I TOUCHES the library: I.W0 changed `src/animation/format.ts` +
`src/animation/group.ts`, and the value.js floor moved to `^0.11.2`. The library deltas are
**strictly-more-correct BUGFIXES** — the empty-input path no longer crashes; the serializer emits
from the declared template; the group transform defaults to a real no-op. A tranche-h patch
changeset is still PENDING/unconsumed in `.changeset/tranche-h.md`. **The changeset tier + the
npm publish are USER-DOMAIN** — version owner **Mike Babb** (`mike@babb.dev`), confirm-first.

**Deploy: ship the FIX, do not revert to a stale ancestor.** `keyframes.babb.dev` is Cloudflare
Pages (NOT GitHub Pages), deployed via `.github/workflows/deploy-pages.yml` on green-CI
`workflow_run` on master. `master` is **10 commits BEHIND** `tranche-i-dev` — so the LIVE demo
is still the BROKEN H tip (`b934a08`). The honest close is to **merge `tranche-i-dev → master →
green CI → CF auto-deploys the FIX.** This **SUPERSEDES** the `d469e69` damage-control revert: when
the actual fix can ship, there is no need to revert master to the pre-H ancestor that merely
dropped the deploy path-filter. The `d469e69` revert disposition is recorded as
**SUPERSEDED-BY-FIX-SHIP** — recorded, not executed.

`PROGRESS.md` is the frozen **DEV-phase** board (its header: *"No source is fixed in the development
phase. No commit is made."*); it still carries the pre-impl IMMEDIATE recommendation to *execute* the
`d469e69` revert (`PROGRESS.md §0`, lines 47–52; §"deferrals"). That recommendation is the artifact of
record for the moment the broken product was live with no fix in hand. The IMPL drive made it obsolete:
this FINAL is the authoritative supersession — the fix ships, the revert is recorded-not-executed.
`d469e69` itself remains a real, useful commit (it dropped the tip-commit path filter so any green-CI
master push now deploys) — only the *revert-to-it-as-damage-control* action is superseded.

---

## 9. inv ε — this FINAL is held to the running-product oracle

This close is held to the same standard it installs. **inv ε (the close cannot overclaim):**
every B1–B9 claim in this document is grounded in a re-runnable probe + console JSON + screenshot
(`audit/investigate/**`) OR a `file:line` in the tree, and the four H "closed" chronics were
RE-EXAMINED against the running demo one by one — no chain-of-trust over prior FINALs. **The
arbiter is the live demo, not the paperwork.** The terminal authority for this tranche's
correctness is `proof:live-session` GREEN over the BUILT `dist` on the PUBLISHED value.js `0.11.2`
dependency: a human using the product sees it work. This FINAL asserts no gate green that the wave
notes + `PROGRESS.md` do not. It may not — and does not — overclaim.

The catastrophe Tranche I ended was a regime that could certify a broken product green. The regime
that replaces it cannot: its headline oracle *is* the human's hand on the product.

---

### Commit ledger

| Wave | Commit |
|---|---|
| I.W0 (B1/B5) | `107236d` |
| I.W1 (B2) | `8a40cf4` |
| I.W2 (B4) | `e2085c8` |
| I.W3 (B3) | `b8659fe` |
| I.W4 (B6/B8) | `3afd49f` |
| I.W5 (B9/K) | `bea5f27` |
| I.W6 (B7) | `4103c22` |
| I.W7 (gate-regime overhaul) | `1a708cf` |
| value.js re-pin `^0.11.1 → ^0.11.2` | `e473447` |
| value.js publish `0.11.2` (sibling repo) | `0cb5dd2` |
