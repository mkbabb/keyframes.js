# K.W8 — THE INGEST (∥ W9 · the round-trip pointed FORWARD at the live web: `fromStyleSheets()`/`fromLiveAnimations()` walk the CSSOM, `adoptRunning()` takes over a running CSS animation — proven by replay-pixel-equality)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · NET-NEW
  capability; born-RED in the FRONTIER sense — NO CSSOM-walk surface exists TODAY:
  `grep -rn "styleSheets|getAnimations|cssRules|adoptedStyleSheets|fromStyleSheets|fromLiveAnimations"
  src/` returns **ZERO hits** (§State-verified), so kf cannot see — let alone adopt — a single
  one of the live page's own CSS animations. The capability is genuinely absent, not regressed:
  the gate reds because the feature does not exist.) · **Scope (a NEW ingest module + the
  `adapter.ts`/`index.ts` export edges; reuses `resolveKeyframes` WHOLE — no parser work):** K1
  `resolveLiveKeyframes(doc | sheet[] | { animationName })` / `fromStyleSheets()` /
  `fromLiveAnimations()` (walk `document.styleSheets`, filter to `CSSKeyframesRule`, serialize via
  `rule.cssText`, feed the EXISTING `parseCSSStylesheet → resolveKeyframes` pipeline) + K2
  `adoptRunning(el, { animationName })` (mid-flight takeover of a running CSS animation via
  `getAnimations()` currentTime handoff — NAMED `adoptRunning` to DISAMBIGUATE from the SHIPPED
  `engine.ts:324 adoptCompiled` — HARDENING-5 HAZARD-1) + the per-sheet CORS `try/catch` reporting
  THROUGH W7's `ResolvedKeyframes.diagnostics` channel + the `proof:ingest-replay-equal` gate
  (born-RED in the frontier sense) + the VJ-9 totality TRIPWIRE recorded. ·
- **DAG-deps:** **FOLLOWS K.W7** (`K.md §WAVE MAP`: "K.W8 (ingest) follows W7 (consumes its
  diagnostics channel)") — the CORS-skip and the unrecognized-rule rows land THROUGH the
  `ResolvedKeyframes.diagnostics` field W7 authors (a silent cross-origin drop is the exact class
  the proof culture forbids; the channel is a PREREQUISITE, not an add-on —
  `../audit/frontier/live-stylesheet-ingestion.md §2.1`). Runs **∥ K.W9 (scroll-as-CSS)** —
  file-disjoint (W8 a new ingest module, W9 a new scroll module); both follow W7. **K.W10 (compile)
  COMPOSES with W8** — K1∘CC-1 is the full ingest→recompile loop (ingest a page's `@keyframes`,
  scrub/spring-ify it in the IDE, recompile to CSS — `../audit/frontier/css-compiler.md §5`); W10
  follows W8. The value.js half is RIPE-with-a-tripwire: `CSSKeyframesRule.cssText` already feeds
  `resolveKeyframes` (no net-new grammar); robustness wants VJ-9 FULL partial-input totality
  (PARTIAL in 0.12.0 — `VALUEJS-N2-ASKS.md §3`), recorded as a TRIPWIRE, NOT a gate (the ingest
  ships on the shipped contract; arbitrary-live-web hardening rides VJ-9 when it lands).

## §Provenance (the frontier lanes this wave consumes + the booked roots)

- **`../L-SEED.md §1 #2` — THE decisive frontier input (the §body→K.W8 map row).** The body-item
  map (`../L-SEED.md` "§body-item → K wave map"): "**K1 / K2** — LIVE-STYLESHEET INGESTION +
  `adopt()` (§1 #2) | `fromStyleSheets()`/`fromLiveAnimations()` (the CSSOM walk) + mid-flight
  takeover | **K.W8** INGEST". The §1 TOP-3 body (`../L-SEED.md §1`): "K1 — LIVE-STYLESHEET
  INGESTION — `fromStyleSheets()`/`fromLiveAnimations()` — walk the CSSOM, adopt every @keyframes
  + animation-* declaration into kf objects: scrub, retime, spring-ify, perceptually re-color the
  live web's OWN animations. M-effort precisely because there is NO parser work —
  `CSSKeyframesRule.cssText` emits exactly what `resolveKeyframes` (adapter.ts:97) already eats.
  K2 `adopt()` extends the round-trip into the TEMPORAL dimension (seamless mid-flight takeover of
  a running CSS animation via `getAnimations()` currentTime handoff — the canonical owner of the
  adopt/takeover seam, absorbing WL2-C's overlap). K1∘CC-1 = the full ingest→recompile loop."
- **`../audit/frontier/live-stylesheet-ingestion.md §1-§3` — the wave-ready engineering detail.**
  §1: "kf is **one thin adapter away** from animating the live web's own CSS, because the engine's
  input is already a string of CSS and the CSSOM emits strings of CSS (`adapter.ts:97` eats
  exactly what `CSSKeyframesRule.cssText` produces)" — the bridge is "NOT a new parser — it is a
  thin CSSOM-walk that reconstructs the text `resolveKeyframes` already eats." "Nothing in `src/`
  touches `styleSheets` / `getAnimations` / `cssRules` / `adoptedStyleSheets` today (grep: zero
  hits). The frontier is genuinely net-new capability, not a re-litigation." §2.1 (the hard edge):
  "`document.styleSheets[i].cssRules` throws a `SecurityError` for any cross-origin sheet without
  `Access-Control-Allow-Origin` + `crossorigin` on the `<link>`. … a 'walk every sheet' ingester
  MUST `try/catch` per-sheet and REPORT the skipped cross-origin sheets — it cannot silently drop
  them. This makes the diagnostics channel a prerequisite, not an add-on: ingestion's honest
  failure mode IS a diagnostic." §2.2 (the takeover edge): "`Element.getAnimations()` /
  `Document.getAnimations()` return live `Animation` objects … each with a writable `currentTime`
  … BUT: a CSS-originated `Animation`'s `replaceState` becomes `removed` if the underlying
  `animation-name` is removed/replaced, and a `fill:forwards` WAAPI animation takes precedence
  over all static styles until `commitStyles()` + `cancel()`. **kf already solved exactly this
  handoff** — `playWAAPI` commits-on-finish then cancels to avoid the leaked-precedence trap
  (`waapi.ts:386-398`)." §3 K1 verdict K-HEADLINE-CANDIDATE (M); K2 verdict K-CANDIDATE (L,
  "strictly downstream of K1 … it needs K1's CSSOM reconstruction to preserve the axes" — K2
  reconstructs from the CSSOM `@keyframes` rule via K1, using `getAnimations()` ONLY for the
  playhead + timing, never as the keyframe source, "because the computed form has already lost
  `var()`/`cqw`/oklab — the very things kf's axes preserve").
- **`../audit/frontier/waapi-level-2.md §5` — the `getAnimations()` interop seam (K2's
  discover/takeover detail).** §5.1: "`document.getAnimations()` is Baseline-widely-available and
  returns every live `Animation` on the document — CSS animations, CSS transitions, and WAAPI
  animations alike." §5.2 (i) DISCOVER + TAKEOVER: "read the CSS source the animation came from
  (the `KeyframeEffect.getKeyframes()` + the `@keyframes` rule via CSSOM), parse it through
  `resolveKeyframes`, and adopt it — cancel the native animation, re-drive it through the kf
  engine to gain oklab color, computed-unit resolution, weighted blend, springs, and the
  round-trippable source." §5.3 (the bounded risk): "the takeover cancel semantics … reuses a
  discipline kf already proved (`waapi.ts:386-398`, `commitStyles` + `cancel`)." §5.4 the honest
  caveat: "reading a foreign CSS animation's SOURCE from CSSOM is fiddly (matching a running
  `Animation` back to its `@keyframes` rule text is not a first-class API — `getKeyframes()` gives
  the computed keyframe list, not the authored CSS)" — which is WHY K2 reconstructs from the CSSOM
  `@keyframes` rule (K1), not from `getAnimations().getKeyframes()`.
- **The N2 robustness tripwire (the value.js half — RIPE-with-tripwire, no gate).**
  `../VALUEJS-N2-ASKS.md §3`: "**VJ-9 FULL partial-input totality** — partial: the
  `parseCSSValueUnit("")` contract shipped at 0.11.2; the every-public-entry totality (the K1
  ingestion precondition) is broader and remains open." And §2 row 4: "**VJ-3 sentinels** —
  `currentColor` / `light-dark()` parse as sentinels, never baked to RGB
  (`parsing/color.ts:568-617`) | the hard parse-fail class disappears … | ingestion robustness for
  K1." So the ingest SHIPS on the shipped contract (`cssText → resolveKeyframes` works today); the
  arbitrary-live-web hardening (every malformed third-party rule parses totally, never throws)
  rides VJ-9 — recorded as a TRIPWIRE ("the ingest's robustness widens when value.js's VJ-9 full
  totality lands"), NOT a born-RED gate that blocks the wave.
- **The booked invariant roots:** `K.md §invariant set` — the **replay-equality invariant** (Band
  II born; "ingested CSS (K.W8) replays equal to its source animation" — the gate is
  pixel-equality of the reconstructed kf object's playback vs the source CSS animation) + the
  **acyclic-spine invariant** (W8's value.js half is RIPE — `cssText → resolveKeyframes` is the
  shipped path; the VJ-9 tripwire is a robustness WIDENING, not a blocking gate). HARDENING-5
  HAZARD-1 (the `adoptCompiled` collision) is resolved in §Scope by NAMING the new method
  `adoptRunning`.

## §The state, verified (file:line / grep / API anchors)

- **NO CSSOM-walk surface exists (CONFIRMED against the tree, 2026-06-15 — the born-RED root):**
  `grep -rn "styleSheets|getAnimations|cssRules|adoptedStyleSheets|fromStyleSheets|fromLiveAnimations"
  src/` → **ZERO hits** (the §State-verified probe printed "(ZERO hits — confirmed absent)"). kf
  has no `fromStyleSheets`, no `fromLiveAnimations`, no `getAnimations` read, no `cssRules` walk.
  The capability is genuinely net-new.
- **The text-bridge the ingest reuses is SHIPPED (CONFIRMED):** `resolveKeyframes(css)`
  (`adapter.ts:96`) → value.js `parseCSSStylesheet` (a STRING parser); `CSSKeyframesAnimation.fromString(css)`
  (`engine.ts`) consumes the full `ResolvedKeyframes`. The CSSOM emits `CSSKeyframesRule.cssText`
  — a serialized author rule, EXACTLY the string `resolveKeyframes` eats. So K1 is the CSSOM walk
  + `cssText` extraction + the EXISTING pipeline — no grammar work.
- **The `adoptCompiled` COLLISION is real and scoped (CONFIRMED — HARDENING-5 HAZARD-1):**
  `engine.ts:324` `adoptCompiled(source: Animation<V>): this` already exists (gated by
  `proof:adopt-compiled`; `engine.ts:99,103` docstring "Adopt a compiled state via
  `adoptCompiled(source)`"). It adopts a COMPILED `Animation` state INTERNALLY — it is NOT the K2
  mid-flight `getAnimations()` takeover (`engine.ts` has ZERO `getAnimations` refs — the
  §State-verified grep). **The K2 method MUST be named distinctly** — this spec NAMES it
  `adoptRunning(el, { animationName })` (the running-CSS-animation takeover), reserving `adopt()`
  for neither (the bare `adopt()` the ingestion lane K2 used would collide — the lane's `adopt()`
  is renamed here per HAZARD-1).
- **The `commitStyles`/`cancel` handoff discipline is SHIPPED (CONFIRMED):** `playWAAPI`
  commits-on-finish then cancels to avoid the leaked-precedence trap (`waapi.ts:386-398`); K2's
  takeover reuses this discipline in the OPPOSITE direction (commit-on-ADOPT — bake the current
  computed frame inline before cancelling the native animation, so there is no flash).
- **value.js robustness status (CONFIRMED):** `@mkbabb/value.js@0.12.0` published; the
  `parseCSSValueUnit("")` partial contract shipped at 0.11.2; VJ-9 FULL partial-input totality
  remains OPEN (`VALUEJS-N2-ASKS.md §3`). The ingest ships on the shipped contract; the tripwire
  records the robustness widening.

## §Goal

Make the round-trip TOTAL in the FORWARD direction: **kf reads the live web's OWN CSS — every
`@keyframes` + `animation-*` declaration the page already ships — into kf objects, and takes over
a RUNNING CSS animation mid-flight without a visible seam; and every step it cannot complete
faithfully (a cross-origin sheet, a malformed rule) becomes a citable diagnostic, never a silent
drop.** The ingest is the parser pointed FORWARD: the engine's input is a string of CSS, the CSSOM
emits strings of CSS, so kf is one thin adapter away from animating any page's own animations —
scrub them, retime them, spring-ify them, perceptually re-color them, and (composing with K.W10)
recompile them back to CSS. Three moves:

1. **K1 — the CSSOM-walk ingester (S1).** `fromStyleSheets()` / `fromLiveAnimations()` /
   `resolveLiveKeyframes(...)` walk `document.styleSheets`, filter to `CSSKeyframesRule` (and the
   sibling style rules that reference them via `animation-name`), serialize each via `rule.cssText`,
   and feed that text into the EXISTING `parseCSSStylesheet → resolveKeyframes` pipeline — yielding
   `CSSKeyframesAnimation` objects for animations kf did NOT author. Per-sheet `try/catch`; the
   cross-origin skip is a DIAGNOSTIC (W7's channel), never a silent drop.
2. **K2 — `adoptRunning()` (S2 — the temporal takeover).** Given a live element with a running CSS
   animation: `getAnimations()` finds the matching `CSSAnimation`, reads its `currentTime` +
   `playState`, reconstructs the kf `CSSKeyframesAnimation` from the `@keyframes` RULE (via K1 —
   NOT from `getAnimations().getKeyframes()`, which has lost `var()`/`cqw`/oklab), seeds the kf
   animation at the captured `currentTime` so the visual is continuous, commits the current frame
   inline, and cancels the native animation (the commit-on-ADOPT inverse of `playWAAPI`'s
   commit-on-finish). NAMED `adoptRunning` to disambiguate from the shipped `adoptCompiled`.
3. **The honesty surface (S3).** The CORS-skip / unrecognized-rule / WAAPI-ineligibility rows flow
   through W7's `ResolvedKeyframes.diagnostics` channel (S3 is the PRODUCER half W7 left for W8);
   the VJ-9 totality tripwire is recorded (the ingest's robustness widens when value.js ships full
   partial-input totality — NOT a blocking gate).

## §Scope

- **S1 — K1 the CSSOM-walk ingester (a NEW ingest module on the HEAVY surface).** Locus: a NEW
  `src/animation/ingest.ts` (or a sibling on the HEAVY tier, reached via `loadAnimationEngine()` —
  it needs the parser; the static/dynamic boundary HOLDS) + the `index.ts` HEAVY-export edge + a
  re-export from `adapter.ts` (`resolveLiveKeyframes` beside `resolveKeyframes`). The new code:
  (a) the CSSOM walk (`document.styleSheets` → per-sheet `try/catch` → `sheet.cssRules` →
  filter `instanceof CSSKeyframesRule`); (b) the `animation-name` → sibling-style-rule linkage
  (so an ingested `@keyframes pulse` also carries the `.foo { animation: pulse 2s }` options);
  (c) the `rule.cssText` serialize → the EXISTING `parseCSSStylesheet → resolveKeyframes` feed.
  **WHY no parser work:** `adapter.ts:96` eats exactly what `CSSKeyframesRule.cssText` produces
  (`../audit/frontier/live-stylesheet-ingestion.md §1`). **WHY HEAVY:** it needs the parser (the
  value.js stylesheet grammar) — it rides `loadAnimationEngine()`, the boundary unchanged.
  **NO-WORKAROUND:** NOT a new grammar/parser (the text bridge reuses `resolveKeyframes` WHOLE —
  the moment K1 re-parses or re-derives the keyframes itself it forfeits the round-trip's
  faithfulness); NOT a silent cross-origin drop (every skipped sheet is a diagnostic row — S3).
- **S2 — K2 `adoptRunning()` (the mid-flight takeover; STRICTLY downstream of S1).** Locus: the
  same NEW ingest module + the engine export edge. The takeover: (1) `el.getAnimations()` → find
  the `CSSAnimation` matching `{ animationName }`; (2) read its `currentTime` + `playState`; (3)
  reconstruct the kf `CSSKeyframesAnimation` from the CSSOM `@keyframes` rule (via K1 — the
  authored form, preserving `var()`/`cqw`/oklab); (4) seed the kf animation at the captured
  `currentTime` (the continuity seed — NOT seed-at-zero, which flashes); (5) `commitStyles()` the
  native animation's current computed frame inline, then `cancel()` it (the commit-on-ADOPT, the
  inverse of `waapi.ts:386-398`); (6) hand control to the kf engine. **WHY reconstruct from the
  CSSOM rule, NOT `getAnimations().getKeyframes()`:** the computed keyframe list has already
  px-resolved `var()`/`cqw` and RGB-baked oklab — "the very things kf's axes preserve"
  (`../audit/frontier/live-stylesheet-ingestion.md §2.2/K2`); `getAnimations()` is used ONLY for
  the playhead + timing scalar. **WHY `adoptRunning`, NOT `adopt()`:** the bare `adopt()` collides
  with the shipped `engine.ts:324 adoptCompiled` semantically (a reader would conflate the
  compiled-state internal adopt with the live-takeover) — `adoptRunning` names the
  running-CSS-animation takeover distinctly (HARDENING-5 HAZARD-1). **NO-WORKAROUND:** NOT a
  seed-at-zero adopt (it flashes — the cure is the `currentTime`-continuous seed, a born-RED
  witness in the gate); NOT reading the keyframe SOURCE from `getAnimations()` (the computed form
  has lost the axes).
- **S3 — the honesty surface (the diagnostics PRODUCER half + the tripwire).** Locus: the ingest
  module's per-sheet `try/catch` emits `CROSS_ORIGIN_SKIP` rows onto the
  `ResolvedKeyframes.diagnostics` field W7 authored; the unrecognized-rule and WAAPI-ineligibility
  reasons flow the same channel. **WHY a prerequisite, not an add-on:** "ingestion's honest
  failure mode IS a diagnostic" (`../audit/frontier/live-stylesheet-ingestion.md §2.1`) — a CORS
  sheet that throws `SecurityError` is REPORTED, never dropped. The VJ-9 TRIPWIRE is recorded: the
  ingest ships on the shipped `parseCSSValueUnit` partial contract; when value.js publishes VJ-9
  FULL partial-input totality (`VALUEJS-N2-ASKS.md §3`), the ingest's robustness widens (every
  malformed third-party rule parses totally) — recorded as a TRIPWIRE on the deferred ledger, NOT
  a gate that blocks the wave. **NO-WORKAROUND:** the tripwire is a RECORDED widening with a named
  condition ("value.js publishes VJ-9 full totality"), NOT a perpetual punt (P-invariant-28) and
  NOT a born-RED gate (the ingest works TODAY on the shipped contract).

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense · the replay-equality oracle, forward direction)

**The oracle (per the replay-equality invariant + the gate-ORACLE precept):**
`proof:ingest-replay-equal` ingests a known same-origin `@keyframes` animation, reconstructs the
kf object, plays it, and asserts it replays PIXEL-EQUAL (or computed-style-equal within ε) to the
SOURCE CSS animation — the round-trip's forward faithfulness. Born-RED in the FRONTIER sense: NO
CSSOM-walk surface exists today (the §State-verified ZERO grep).

- **clause (a) — K1 ingest replays PIXEL-EQUAL to the source (CORRECTNESS · replay-equality).** A
  page declares `@keyframes pulse { 0% { opacity: 0; transform: scale(0.8) } 100% { opacity: 1;
  transform: scale(1) } }` + `.target { animation: pulse 1s linear }`; `fromStyleSheets()`
  reconstructs the kf object; played side-by-side with the native CSS animation, the kf playback
  is pixel-equal at sampled `t` (the chrome-devtools-mcp screenshot-diff idiom — the
  `css-compiler.md §7` proof discipline applied to the FORWARD direction). **BORN-RED WITNESS:**
  there is no `fromStyleSheets` to call today (the surface is absent — the gate cannot even
  construct the kf object) → the gate REDS by construction (the capability is ABSENT). **BITE:**
  reds until S1 ships the CSSOM walk; greens when the reconstructed object replays equal. **NO
  escape:** the assert is PIXEL-equality vs the source, not a structural "did it parse" check —
  a lossy reconstruction (wrong values, dropped stop) reds even though it "parsed."
- **clause (b) — the round-trip is byte-faithful (CORRECTNESS · the serialize symmetry).** The
  reconstructed kf object's serialized output (`CSSKeyframesToString`) re-parses to a
  template-equivalent of the source `@keyframes` (the `format.ts` symmetry already tested for
  AUTHORED input — extend the corpus to CSSOM-sourced input; `../audit/frontier/live-stylesheet-ingestion.md
  §3 K1` measure-first gate). **BITE:** reds if the CSSOM round-trip mutates the template (a
  `var()`/`matrix3d()` that should round-trip VERBATIM is lost). **NO escape:** the serialize is
  from the DECLARED template, not a DOM-resolved sample (`format.ts:155` — the I.W0 S2 discipline).
- **clause (c) — K2 `adoptRunning()` is FLASH-FREE (CORRECTNESS · the continuity oracle).** Adopt
  a running CSS animation at a known `currentTime`; the computed style at the adopt instant is
  within ε of the pre-adopt computed style (no flash), and scrubbing thereafter runs the kf curve
  (`../audit/frontier/live-stylesheet-ingestion.md §3 K2` measure-first gate; the chrome-devtools-mcp
  continuity probe). **BORN-RED WITNESS:** "a naive seed-at-zero adopt flashes; the cure is the
  `currentTime`-continuous seed" — the gate plants the seed-at-zero defect and witnesses the flash
  (the computed style jumps to the 0% state), then the continuity seed cures it. **BITE:** reds on
  a seed-at-zero adopt (the visual jumps); greens on the `currentTime`-continuous seed +
  commit-on-adopt. **NO escape:** the assert is the no-flash computed-style continuity, an
  observable a seed-at-zero adopt provably violates.
- **clause (d) — the CORS skip is a DIAGNOSTIC, never a silent drop (CORRECTNESS · the honesty
  surface).** A cross-origin sheet (no `Access-Control-Allow-Origin`) is SKIPPED with a
  `CROSS_ORIGIN_SKIP` row on the `ResolvedKeyframes.diagnostics` channel — the ingest does NOT
  throw `SecurityError` uncaught and does NOT silently omit the sheet with no signal. **BITE:**
  reds if a CORS sheet either throws uncaught (crash) or is dropped with no diagnostic row (silent
  drop — the forbidden class). **NO escape:** the row is the per-sheet `try/catch` producer onto
  W7's channel — the honest-failure clause of the ingest.
- **clause (e) — `adoptRunning` does NOT collide with `adoptCompiled` (HYGIENE — the HAZARD-1
  guard, labeled).** The new method is `adoptRunning`; `engine.ts:324 adoptCompiled` is untouched;
  `proof:adopt-compiled` still greens unchanged. *(Labeled HYGIENE — it guards the name collision
  HARDENING-5 flagged; the wave's GREEN depends on the replay-equality clauses (a)-(d).)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the forward-direction replay-equality oracle:
the gate ingests a real same-origin animation over the BUILT `dist/keyframes.js`, plays the
reconstructed object, and pixel-compares it to the source (a)/byte-compares the round-trip (b);
adopts a running animation flash-free (c); and reports the CORS skip honestly (d). The born-RED is
in the FRONTIER sense: NO `fromStyleSheets`/`adoptRunning` surface exists (the §State-verified ZERO
grep), so every clause reds by construction until the capability lands — then greens on the
pixel/byte/continuity/diagnostic proof. **Two-tier taxonomy:** the wave's GREEN depends on the
replay-equality correctness clauses (a)-(d); clause (e) is a HYGIENE corroborator (the
name-collision guard). **Replay-equality posture (declared):** this wave IS the forward half of
the round-trip; its hard gate IS the replay-equality invariant (ingested CSS replays equal to its
source — `K.md §invariant set`). **P6 posture (declared):** the structural legs (b: byte-faithful
round-trip; d: the diagnostic row) are device-INDEPENDENT → they hard-gate on the Linux runner
(jsdom can construct a `CSSStyleSheet` and walk `cssRules`); the PIXEL-equality legs (a, c) need a
real renderer → they run on the headed chrome-devtools-mcp tier with a per-EXPECTED predicate (the
sampled-`t` pixel diff), NOT a fixed settle. **Budget 0** (the gate asserts a POSITIVE product
property — the ingest replays equal — not an error count; clause (d) asserts the CORS path emits a
row, not that it throws). **value.js gate status:** RIPE-with-tripwire — the `cssText →
resolveKeyframes` path is SHIPPED (no OPEN gate, no born-RED edge); the VJ-9 FULL partial-input
totality is a recorded TRIPWIRE (the robustness widens on its publish), NOT a blocking gate. So
W8 authors and runs the moment K.W7 lands — it does not wait on value.js's post-N tranche (unlike
K.W9, which born-RED-gates on the OPEN VJ.W1).

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO new grammar/parser (S1).** K1 reuses `resolveKeyframes` WHOLE over `rule.cssText`. The
  moment the ingest re-parses or re-derives the keyframes itself, it forfeits the round-trip's
  faithfulness (the moat is that kf's input AND the CSSOM's output are both author `@keyframes`
  text — `K.md §MANDATE`: "the compiler is the round-trip's parser run BACKWARD over the same data
  model"; the ingest is the parser run FORWARD over the same data model). The ARCH WASM-parser
  kill is not even brushed (`../audit/frontier/live-stylesheet-ingestion.md §3 K1`).
- **NO silent cross-origin drop (S3).** Every skipped sheet is a `CROSS_ORIGIN_SKIP` diagnostic
  row on W7's channel — never an uncaught `SecurityError` and never a silent omission. "A silent
  drop is the exact class the proof culture forbids" (`../audit/frontier/live-stylesheet-ingestion.md
  §2.1`).
- **NO seed-at-zero adopt (S2).** `adoptRunning` seeds at the captured `currentTime`
  (velocity/phase-continuous), NOT at zero (which flashes). The flash is a born-RED witness in
  clause (c).
- **NO reading the keyframe SOURCE from `getAnimations()` (S2).** K2 reconstructs the keyframes
  from the CSSOM `@keyframes` RULE (via K1 — the authored form, preserving `var()`/`cqw`/oklab);
  `getAnimations()` provides ONLY the playhead + timing scalar. The computed `getKeyframes()` form
  has lost the axes (`../audit/frontier/live-stylesheet-ingestion.md §2.2`).
- **NO `adopt()` name collision (S2 — HARDENING-5 HAZARD-1).** The method is `adoptRunning`, NOT
  `adopt()`. The shipped `engine.ts:324 adoptCompiled` (compiled-state internal adopt) is
  untouched; the new live-takeover method is named distinctly so a reader never conflates them.
- **NO promoting the VJ-9 tripwire to a blocking gate (S3).** The ingest ships on the shipped
  partial-input contract; the VJ-9 FULL totality is a RECORDED widening with a named condition
  (value.js publishes VJ-9), NOT a born-RED gate that blocks W8 and NOT a perpetual punt
  (P-invariant-28 — it carries a named tripwire, exits when the condition fires).

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED/N2 citation)

- **K1** (the CSSOM-walk ingester) — S1 (`fromStyleSheets()`/`fromLiveAnimations()`/
  `resolveLiveKeyframes`). `../L-SEED.md §1 #2` + the §body→K.W8 map;
  `../audit/frontier/live-stylesheet-ingestion.md §3 K1` (K-HEADLINE-CANDIDATE, M);
  `adapter.ts:96` (the reused pipeline), `src/` ZERO CSSOM hits (born-RED).
- **K2** (`adoptRunning()` mid-flight takeover) — S2. `../L-SEED.md §1 #2` (the `adopt()` row,
  renamed per HAZARD-1); `../audit/frontier/live-stylesheet-ingestion.md §3 K2` (K-CANDIDATE, L,
  downstream of K1); `../audit/frontier/waapi-level-2.md §5` (the `getAnimations()` interop);
  `waapi.ts:386-398` (the reused commit/cancel discipline); `engine.ts:324 adoptCompiled` (the
  collision the new name avoids).
- **K3-FULL (the CORS-skip / WAAPI-reason diagnostic rows)** — S3 (the PRODUCER half onto W7's
  `ResolvedKeyframes.diagnostics` field). `../audit/frontier/live-stylesheet-ingestion.md §3 K3`
  ("the FULL channel (CORS skip, WAAPI reasons) is K-scoped because it presupposes K1"). W7
  AUTHORS the field; W8 PRODUCES the ingest rows.
- **The VJ-9 robustness TRIPWIRE** — S3 (recorded, named condition). `../VALUEJS-N2-ASKS.md §3`
  (VJ-9 partial; the every-public-entry totality open) + `VALUEJS-N2-ASKS.md §2 row 4` (VJ-3
  sentinels, ingestion robustness for K1). NOT a gate — a recorded widening.

## §Hand-off (the BINDING file-ownership boundary — §4B of the README, restated)

W8 follows W7 and runs ∥ W9. Its loci (`waves/README.md §4B`):

- **W8 owns a NEW ingest module + the `index.ts`/`adapter.ts` export edges.** The ingest module
  (`fromStyleSheets()`/`fromLiveAnimations()`/`adoptRunning()`) is NET-NEW; it re-exports
  `resolveLiveKeyframes` beside `resolveKeyframes`. It does NOT edit `engine.ts`'s interp path
  (W7's) and does NOT edit `group.ts` (W11's).
- **`adapter.ts` is touched by BOTH W7 (the `diagnostics` field on `ResolvedKeyframes`) and W8
  (the `resolveLiveKeyframes` producer that calls `resolveKeyframes`).** DISJOINT concerns — the
  TYPE (W7) vs the new CSSOM-walk producer (W8). **W8 FOLLOWS W7, so these land in SEQUENCE, not
  in parallel** — the seam is TEMPORAL, not just spatial (README §4B: "W8 FOLLOWS W7, so these
  land in sequence … the seam is temporal").
- **W8 ∥ W9 are file-disjoint.** W8 a new ingest module; W9 a new scroll module + `timeline.ts`
  edges. They run in parallel without touching each other's files.
- **The `adoptRunning` method lives on the engine surface; it does NOT touch `adoptCompiled`.**
  The HAZARD-1 disambiguation is a NAMING contract, not a co-edit — `adoptCompiled`
  (`engine.ts:324`) is untouched; `proof:adopt-compiled` greens unchanged.
- **The value.js consume is the SHIPPED `cssText → resolveKeyframes` path + the VJ-9 tripwire —
  NEVER a `file:` link or a vendored copy** (the acyclic-spine invariant). W8 needs no net-new
  value.js grammar (the ingest is RIPE); the VJ-9 widening rides value.js's post-N publish when it
  lands.

## §Design-decisions (the named calls this spec makes, so the impl does not re-litigate)

- **The ingest is the parser run FORWARD over the same data model — NOT a re-derived ingester.**
  K1 reuses `resolveKeyframes` whole over `rule.cssText`; the round-trip's faithfulness is that
  the engine's input and the CSSOM's output are both author `@keyframes` text (the moat —
  `../audit/frontier/live-stylesheet-ingestion.md §1`). A re-parse would be the lossy re-derivation
  the compiler lane (K.W10) names as the moat-forfeit.
- **K2 reconstructs from the CSSOM rule, NOT the computed keyframes.** `getAnimations()` provides
  the playhead; K1 provides the authored keyframes (preserving the axes). This is the named
  coupling that pushes K2 to L-effort and the reason it is STRICTLY downstream of K1
  (`../audit/frontier/live-stylesheet-ingestion.md §3 K2`).
- **The method is `adoptRunning`, resolving HARDENING-5 HAZARD-1.** The bare `adopt()` the lane
  proposed would collide with the shipped `adoptCompiled` (a reader conflates the compiled-state
  internal adopt with the live takeover). `adoptRunning` names the running-CSS-animation takeover
  distinctly; the spec REQUIRES the distinct name (not a guess for the impl).
- **VJ-9 is a tripwire, not a gate.** The ingest ships on the shipped partial-input contract; the
  full-totality robustness widening rides VJ-9's publish. The acyclic-spine here is RIPE
  (`cssText → resolveKeyframes` works today) with a recorded WIDENING — distinct from K.W9's OPEN
  gate (which born-RED-gates on the unpublished VJ.W1).
- **K1∘CC-1 is the ingest→recompile loop (composes with K.W10).** Ingest a page's `@keyframes`,
  scrub/spring-ify it in the IDE, recompile to CSS — the full round-trip. W8 ships the forward
  half; W10 ships the backward half; the loop closes when both land
  (`../audit/frontier/css-compiler.md §5`).
