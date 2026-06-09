# Tranche I — TOTALITY ASSAY (the consolidated honest ledger)

**Branch:** `tranche-i-dev` (forked off the broken master `b934a08` = Tranche H's tip).
**Type:** IMPL-phase consolidated status. **Date:** 2026-06-09. **Version in tree:** `4.1.0`
(I owns its own bump at I.WZ). **Pins (live `package.json`):** `@mkbabb/value.js ^0.11.1` ·
`@mkbabb/parse-that ^0.9.0` · `@mkbabb/glass-ui ~3.9.0`.

This is the single ledger the close (I.WZ) and the glass-ui coordination both lean on. It is
the **inv-ε honest ledger**: every B1–B9 + K + the four chronics + the two prime deferred
items carries its CONFIRMED disposition THIS tranche, the seam fix, the gate that proves it
(with GREEN / born-RED status where known), and any residual handoff. No deficit is
manufactured where the state holds; no claim is made past the gate that earns it.

The headline this tranche exists for is the gate-blindspot — H shipped ALL ~97 `proof:*`
GREEN over a product that crashes on the first gesture. The durability keystone is therefore
NOT any single B-fix; it is **I.W7's gate-regime overhaul** + the `proof:live-session`
battery assembled from each wave's interaction leg. That keystone is **still PENDING** — so
this assay reports LANDED legs honestly while naming the battery that will bind them.

---

## §1 — THE TOTALITY TABLE (B1–B9 + K + CH-1..CH-4 + the two prime deferred folds)

Disposition vocabulary: **LANDED+gate** (committed this tranche, its runtime gate GREEN live)
· **in-flight** (work begun, uncommitted or partial) · **pending** (wave spec authored,
no IMPL). Gate status: **GREEN** (witnessed live, born-RED→green) · **born-RED→pending** ·
**deleted** (a vaporware IOU removed).

| # / item | Disposition this tranche | The seam fix (file:line) | The gate (oracle) | Gate status | Residual handoff |
|---|---|---|---|---|---|
| **B1** rainbow play `"......"` + `this.transform is not a function` | **LANDED+gate** (I.W0, `107236d`) | (a) value.js `parsing/units.ts` `parseCSSValueUnit("")` → typed-empty `ValueUnit(0)`, never the bare throw (heals the `getComputedValue` var read-back); (b) `group.ts` `transform = NOOP_TRANSFORM` total-by-construction + REAL lazy composite from first parsed child; (c) `useAnimationGroupPlayback.toggleAnimationGroup` short-circuits a childless group so home's navigate-intercept owns the click | `proof:engine-no-throw-on-play` — Playwright/BUILT `dist/gh-pages/`: rainbow-play on HOME (empty group, E1 witness) AND cube → 0 `pageerror`/`unhandledrejection`; the cube transform PAINTS LIVE (123 distinct non-`none` matrices — the no-silent-no-op guard) | **GREEN** | value.js publish + re-pin (the consume-edge, §3.A) — now AUTHORIZED + actionable |
| **B5** keyframes pane `/* timing-function: custom — no CSS twin */` | **LANDED+gate** (I.W0 + I.W2) | I.W0 `format.ts` `CSSKeyframesToString` serializes from the DECLARED `parsedVars[i]` template via `unflattenObjectToString` (a `var()`/`matrix3d()` round-trips verbatim — the serializer no longer touches the empty-read-back seam); `KeyframesStringControls.vue` catch names the ACTUAL error, kills the lying placeholder. I.W2 S3 persists a COMPLETE re-parseable `cubic-bezier(…)`/`steps(…)` LITERAL (closes I.W0 clause (e), the bare-token option seam) | `proof:engine-no-throw-on-play` clause (d): pane shows real round-trippable `@keyframes` (359 chars), NOT the placeholder | **GREEN** | — (same value.js consume-edge as B1) |
| **B2** DFA suspend `this._gen`; controls blank on switch | **LANDED+gate** (I.W1, `8a40cf4`) | `playback.ts` — `RAFPlayback`'s 4 public methods (`play`/`drive`/`loop`/`stop`) are arrow class-fields, BIND-PROOF by construction (closes the whole unbound-method class, not just B2's 2 sites); NEW `useRafScene.ts` consolidates the duplicated raw-rAF recipe with BOUND callbacks + bound `useSceneVisibilityPause`; the unbound `useEasingDemo.ts:227`/`useSpringDemo.ts:365` refs DELETED; the pure resume-iff-was-playing reducer PRESERVED | `proof:fsm-suspend-resume-live` — synthetic `visibilitychange→hidden` on a PLAYING easing scene → 0 `_gen`/throw/flush-abort; live easing(PLAYING)→amiga switch → destination controls NON-BLANK (pane opacity 1.00) | **GREEN** | dock-Select integration leg (clause b2) is aspirational-post-B8 (dock hit-testable after I.W4/W6) — de-coupled from the synthetic born-RED witness |
| **B4** `/easing` lost the curve/timing editor | **LANDED+gate** (I.W2, `e2085c8`) | `stores/controlSurfaceDFA.ts` pure `selectedControlSurfaceFor(scene, preferred)` → `<Tabs> :model-value` born CORRECT on the mounting tick (reka `useVModel` `passive`-latch taken correct, B4 desync dies at source); single-surface scenes `forceMount`; ONE `EasingEditor.vue` (dropdown + editable `EasingCurveCanvas` + read-only readout/copy) mounted by BOTH rail + panel; per-scene `storedControls` pokes DELETED | `proof:easing-editor-live` — switch INTO easing → `.easing-curve-canvas` present + `display:block` + `[role=tabpanel]` active; handle-drag MUTATES the bezier `d` AND re-animates the subject; readout is a complete re-parseable literal | **GREEN** | mobile M2 (sheet-body reachability) folds here — the M2 scroll leg rides the same single-authority mount |
| **B3** `/amiga` "floats around" | **LANDED+gate** (I.W3, `b8659fe`) | `useAmigaAnimations.ts` `SPHERE_HOME = 0` (room origin = box centre = camera look-at), bounces swing symmetric about it; `AmigaScene.vue` sphere seated at `(0,0,0)` + `controls.target.copy(sphereMesh.position)` makes the orbit pivot TRACK the subject (was disjoint origin vs corner `(-5,-5,-5)`); `content-visibility:auto` REMOVED from the WebGL root, occlusion driven off `IntersectionObserver` | `proof:amiga-subject-is-pivot` — centre-canvas drag is a LOCAL subject change (`centreMAD 8.7 >> peripheryMAD 0.0` — sphere spins, room does NOT tumble); 0 WebGL ReadPixels/GPU-stall lines over a ≥2s loop | **GREEN** | RC-2 perf shares I.W4's "right occlusion primitive" principle (I.W3 owns the amiga locus; the drop already landed here) |
| **B6** `/square` drag highlights chrome + does not persist | **in-flight** (I.W4 — uncommitted working tree) | PLANNED: lift a GLOBAL select-suppression token + a `releasePolicy: persist` into `useDragScrub.ts` + `useDragCapture.ts`; migrate square's hand-rolled `window`-drag onto the seam; `settle()` in place, not `reseat(0,0)` on `pointerup`. Working-tree edits present on `SquareScene.vue`, `useSquareAnimations.ts`, `useDragScrub.ts`, `useDragCapture.ts` | `proof:drag-gesture` — no text-selection over swept chrome + transform PERSISTS, EVERY drag surface | **born-RED→pending** (IMPL in flight, not yet committed/verified) | — |
| **B7** specular sheen STILL present | **LANDED (consume) + gate pending** (I.W6 — see §3.B) | RESOLVED at the consume-edge: kf bumped `@mkbabb/glass-ui ~3.5.1 → ~3.9.0`. The AX W54 specular cohesion folded the moving `::before` into the `.glass-material` mixin with rest `--specular-intensity` defaulting to 0 (`glass.css:110-114`). ZERO kf-side CSS; the `.glass-specular-track::before{content:none}` workaround REJECTED. Stage cards `specular="off"` default + the 9–11 dock/play tracks rest-intensity-0 | `proof:specular-absent-at-rest` — Playwright/BUILT: bloom ABSENT at rest on EVERY stage glass `::before` AND every dock/play glass `<Button>`; PRIMARY oracle = perceptual luminance delta (class-absence is HYGIENE corroborator). Verified LIVE via chrome-devtools-mcp (rest opacity 0). `proof:specular-handoff` DELETED (the born-RED vaporware IOU) | **GREEN live-confirmed (chrome-devtools-mcp); gate-as-`proof:*` script lands with I.W6 commit** | AX commit `89edffc` already acknowledged folding kf's I.W6 dock/Button specular (19 tracks) into W54 — RE-AFFIRMED done upstream |
| **B8** ALL dock animations "broken, slow, errored" | **part LANDED + part in-flight** (composite) | (a) "errored" half = B1 console bleed → DIED with I.W0 (no dock change, GREEN); (b) dock `transition: width`/`transition:all`-under-`backdrop-filter` retune RODE glass-ui 3.9.0 (AX W06/W61 dock-unify-root, consumed); (c) `/easing` per-rAF reactive `ref` storm + 4–6 stacked rAF loops → ONE composed driver (I.W4 in flight; `useEasingDemo.ts`/`EasingTarget.vue` working-tree edits present) | `proof:perf-frame-budget` — 4× CPU throttle, BOUND ceilings: dock-expand `dropped ≤ 2` (HEAD 12/114), easing-play `dropped ≤ 3` (HEAD 36/~46fps); born-RED REQUIRES HEAD to fail the number | **born-RED→pending** (the frame-budget is being MEASURED in I.W4) | the dock spring/transition retune is glass-ui-owned, consumed via 3.9.0 (RE-AFFIRMED done upstream); kf measures the budget |
| **B9** dev `ENOENT easing-icon-sm.svg` + 47 source-map errors | **LANDED+gate** (I.W5, `bea5f27`) | `vite.config.ts` — ONE canonical `DEMO_DEFAULT_OUTDIR = ./dist/demo-app/` + `emptyOutDir` (no Vite invocation can spawn `demo/app/dist/` again); Mar-25 orphan deleted; `assetExtension404Plugin()` declines to rewrite `*.svg`/`*.png`/`*.map` misses to index.html (404s honestly, was 200-HTML hiding the orphan); source-map noise ACCEPTED + documented (built `dist/` clean) | `proof:icon-paint-live` — every `SceneDescriptor.icon` (7/7) + favicon PAINTS a non-zero inline `<svg>`; across 7 navigations + Select + editor mount the asset-404 set is EMPTY; one-build-root config invariant | **GREEN** | `proof:scene-icons` retirement folds into I.W7's census cleanup (the lattice retirements are W7-owned) |
| **K** tab title = exactly `keyframes.js` | **LANDED+gate** (I.W5, `bea5f27`) | `demo/app/index.html` `<title>keyframes.js</title>` (single-sourced, no build-time rewrite; gh-pages ships verbatim) | `proof:icon-paint-live` clause (c): `document.title === "keyframes.js"` | **GREEN** | — |
| **DC-8** scene-swap dead-CSS (twice-deferred A→C) | **LANDED+gate** (I.W5 — RESTORE, no fourth defer) | Verified first-hand: a LIVE `startViewTransition` consumer EXISTS (`useSceneTransition.ts:32`, `App.vue` `.scene-host` `view-transition-name: scene-subject`); `::view-transition-*` CSS is glass-ui-owned (consumed-published); the comment-blanked grep finds ZERO orphan demo-side scene-swap CSS → DC-8 = RESTORE (KILL target ∅) | `proof:icon-paint-live` clause (e): a real dock-Select scene switch FIRES the live VT + zero orphan demo-side VT CSS | **GREEN** | — (the P-invariant's fourth-defer prohibition honored) |
| **CH-1** cartoon-shadow / specular (D2/D14) | **RE-OPEN → resolved at consume (I.W6 gate pending)** | The cartoon PANELS already read correctly (H.W2 `surface="cartoon"`, RE-AFFIRMED). The SHEEN was the live residual → resolved by the 3.9.0 consume (see B7) | `proof:specular-absent-at-rest` (B7) | **GREEN live-confirmed; gate-as-script lands with I.W6** | none upstream (AX W54 folded it) |
| **CH-2** φ-hero typography (D7) | **RE-AFFIRM (do NOT re-litigate)** | Genuinely closed at the asserted scope (`proof:phi-leaf-zero` enforced-0 leaves + the hero rung); the user did not re-flag it. B4 was a SEPARATE easing-editor defect, not this chronic | — (re-affirmed, no I gate owed) | n/a | — |
| **CH-3** mobile (D10/D13) | **PARTIALLY-PAPERED → folding** | Bones REAL (full-bleed stage + underdamped `SpringProgress` drawer, settle 169–175ms, RE-AFFIRMED). Three seams: M1 menubar-occludes-sheet → I.W5 (anchor from MEASURED menubar height, `sheet.bottom ≤ menubar.top`); M2 sheet-body clips controls → I.W2 (rides single-authority mount, LANDED); M3 `transition:all` dock jank → I.W4/I.W6 (folds B8) | M1: the W5 sheet-anchor leg; M2: `proof:easing-editor-live` reachability (LANDED); M3: `proof:perf-frame-budget` | **M2 GREEN (via I.W2); M1/M3 pending in W4/W5/W6 legs** | — |
| **CH-4** dock (D5 lag + D9 popover) | **D5/D9 RE-AFFIRM; the felt "broken dock" = B1 + M3 + RC-2** | D5 spring GENUINELY settled (dock-morph stress 120fps, `widthWrites:0`); D9 un-double-wrapped. The user's "broken dock" decomposed: B1 console flood (LANDED I.W0) + M3 `transition:all` (I.W4/W6) + RC-2 ReadPixels stalls (I.W3 amiga / I.W4 perf) | D5: `proof:dock-morph-settled` (RE-AFFIRMED honest); the felt defect → B1/M3/RC-2 gates above | **B1 half GREEN; M3/RC-2 legs per their waves** | the dock-spring memory rule ("dock fixes in glass-ui, never patched in demo") is CORRECT — do NOT relax it |

---

## §2 — THE WAVE BOARD (LANDED / in-flight / pending) with the gate per wave

| Wave | Charge (B's) | Commit | Headline runtime gate | Status |
|---|---|---|---|---|
| **I.W0** | B1/B5 empty-input crash + serialize-from-template + group transform total | `107236d` | `proof:engine-no-throw-on-play` | **LANDED · GREEN** |
| **I.W1** | B2 bind-proof `RAFPlayback` + `useRafScene` | `8a40cf4` | `proof:fsm-suspend-resume-live` | **LANDED · GREEN** |
| **I.W2** | B4 control-surface single authority + unified `EasingEditor` | `e2085c8` | `proof:easing-editor-live` | **LANDED · GREEN** |
| **I.W3** | B3 amiga subject=pivot=framing + shed content-visibility | `b8659fe` | `proof:amiga-subject-is-pivot` | **LANDED · GREEN** |
| **I.W5** | B9/K icon single-source + one build root + honest 404 + title + DC-8 | `bea5f27` | `proof:icon-paint-live` | **LANDED · GREEN** |
| **I.W4** | B6/B8 drag seam + persist + composed frame driver + dock perf | (uncommitted) | `proof:drag-gesture` + `proof:perf-frame-budget` | **IN-FLIGHT** (working-tree edits on 6 demo files; frame budget being measured under 4× throttle) |
| **I.W6** | B7 specular consume-edge (+ M3 dock-transition retune via same pin) | (spec authored; consume LANDED via 3.9.0 bump) | `proof:specular-absent-at-rest`; DELETE `proof:specular-handoff` | **PENDING commit** (3.9.0 consume + live chrome-devtools-mcp verification done; the `proof:*` script + package.json wiring land with the W6 commit) |
| **I.W7** | THE GATE-REGIME OVERHAUL (the headline; CLOSES) | (spec authored) | `proof:gate-is-runtime` + `proof:live-session` (union of every wave's leg) | **PENDING** — the durability keystone |
| **I.WZ** | the close — FINAL · changeset (owner Mike Babb) · revert-tracking · publish + deploy | — | full I suite GREEN on a tree a human sees work | **PENDING** |

---

## §3 — THE TWO PRIME DEFERRED ITEMS (the consume-edges)

### §3.A — value.js empty-input parse contract (B1/B5) — HANDOFF authored + committed, consume-edge now ACTIONABLE

- **Authored + committed in value.js** (`fbea3e2`: *"fix(parsing): parseCSSValueUnit
  empty-input contract — typed-empty, never '......' throw"*). `parseCSSValueUnit("")` /
  whitespace now returns a typed-empty identity `ValueUnit(0)` instead of throwing the bare
  `Parse error at offset 0: "......"`. This heals B1's interp path AND B5's serialize path at
  ONE source.
- **Consumed LOCALLY** into kf's `node_modules` for I.W0 gate verification (the
  `proof:engine-no-throw-on-play` clause (f) HYGIENE check resolves typed-empty against the
  consumed build). The kf-side belt (I.W0 S2, serialize-from-template) makes B5 robust
  **regardless of** the publish — defense-in-depth, so kf is not blocked on the publish for
  correctness, only for the durable CI-green re-pin.
- **The consume-edge is now ACTIONABLE (user AUTHORIZED publish/push/deploy).** Three steps,
  no longer user-domain-deferred:
  1. **Publish value.js** carrying `fbea3e2` (a version bump on the 0.11.x line).
  2. **The kf changeset** re-pins `@mkbabb/value.js ^0.11.1` → the published version so the
     cube interp clauses + the durable kf re-pin go CI-green on the published contract (not a
     locally-linked `node_modules`).
  3. **The CF-Pages deploy** (keyframes.babb.dev) re-ships from the I close.
- **Cross-refs:** VJ-5 (the structured diagnostics sink) is the cleanest channel to surface
  an empty-parse instead of a silent throw — the LD-DIAG / `ResolvedKeyframes.diagnostics`
  BOOK; not an I wave, rides the next re-pin.
- **Residual:** the rest of the value.js next-slice (VJ-1..VJ-9 — linear parser, path
  sampler, color sentinels, identity pad, buffer-reusing `unflattenObjectToString`, LRU,
  realm convergence) stays **value.js-HANDOFF (CHRONIC-by-design C-1)** — ZERO kf edit on
  consume; NOT an I fold.

### §3.B — glass-ui 3.9.0 consume-edge (specular RESOLVED · dock perf consumed · the Plus-Jakarta font leak worked-around)

inv-16: kf consumes glass-ui PUBLISHED, never patches it. kf bumped `~3.5.1 → ~3.9.0`.

- **SPECULAR (B7) — RESOLVED at 3.9.0.** The AX W54 specular cohesion folded the moving
  `::before` into the `.glass-material` mixin with rest `--specular-intensity` defaulting to
  0 (`glass.css:110-114`). kf verified LIVE (chrome-devtools-mcp): the dock-icon-button +
  stage glass-card `::before` render opacity 0 at rest — the warm-white catch-light bloom the
  kf user flagged TWICE is ABSENT at rest on BOTH stage cards (Card `specular="off"` default)
  AND the 9–11 dock/play glass tracks (rest-intensity-0). **ZERO kf-side CSS.** AX commit
  `89edffc` already acknowledged folding "keyframes I.W6 dock/Button specular bloom (19
  tracks)" into W54. The old `proof:specular-handoff` born-RED IOU is DELETED;
  `proof:specular-absent-at-rest` confirms the resolution. The
  `.glass-specular-track::before{content:none}` consumer-suppression workaround is REJECTED
  (the cosmetic dies at SOURCE, upstream).
- **DOCK PERF (B8/M3) — consumed.** The dock-spring/`transition` retune (AX W06/W61
  dock-unify-root) rode 3.9.0; kf consumes it. The dock-expand frame-budget is being measured
  in I.W4 against the BOUND `proof:perf-frame-budget` ceiling (dock-expand `dropped ≤ 2`).
- **THE PLUS-JAKARTA DEFAULT-FONT LEAK (a NEW consume-edge finding) — worked-around kf-side,
  GESTALT fix is glass-ui.** glass-ui ~3.9.0 `typography.css` force-applies "Plus Jakarta
  Sans" (its brand text register) to the bare body/text register of EVERY consumer.
  keyframes.js does NOT use Plus Jakarta — its identity is Instrument Serif (display) + Fira
  Code (mono) over a clean native UI sans. The kf user flagged it explicitly ("the fonts
  dont seem correct on the dock", "we dont use plus jakarta, thats a glass-ui default").
  kf WORKED AROUND it by defining its own `--font-sans` (`style.css:63`,
  `ui-sans-serif, system-ui, -apple-system, …`) + reclaiming the body register
  (`style.css:240-244`). Compounding: the demo build does not serve glass-ui's bundled woff2,
  so the forced Plus Jakarta half-loads (only the metric Fallback, in error state) → visibly
  broken fallback rendering. **The kf workaround is documented in source; the GESTALT fix is
  glass-ui-side** (glass-ui should not force its brand font onto a consumer's body register) —
  a new glass-ui-HANDOFF, decoupled from kf's critical path.

---

## §4 — THE GATE-BLINDSPOT HEADLINE (the durability keystone — still PENDING)

This is why Tranche I exists, and the only axis on which "the tranche is done" is decided.

- **The disease (H):** every H gate's ORACLE was a PROXY one or more steps removed from the
  running product — source text, a jsdom unit, a localStorage round-trip, a subject-masked
  self-baseline, a design-token number, a markdown table. ~54 of ~98 nominal correctness
  gates cannot by construction see a runtime defect; the ~34 that open a browser rest on load,
  round-trip a proxy store, diff a masked baseline, or assert the wrong DOM projection — and
  NOT ONE drove PLAY-then-SWITCH and asserted a clean console. The keystone
  `proof:chronic-closure` is ITSELF a source-shape gate parsing a markdown table.
- **The cure (BOUND at I-open, t=0):** the gate-ORACLE precept — a gate's oracle must be the
  PRODUCT PROPERTY a human checks, exercised through the human's surface, error budget 0
  across PLAY + SWITCH + DRAG. Source-shape / jsdom / snapshot / baseline / token / paperwork
  oracles are HYGIENE-tier, never correctness, never chronic-closure.
- **The per-wave legs ARE assembling (LANDED, GREEN):** `proof:engine-no-throw-on-play` (play
  leg, W0), `proof:fsm-suspend-resume-live` (switch + visibility leg, W1),
  `proof:easing-editor-live` (switch + handle-drag leg, W2), `proof:amiga-subject-is-pivot`
  (centre-drag leg, W3), `proof:icon-paint-live` (icon-paint + 404 + VT-fires leg, W5). Each
  is a real runtime gate, born-RED→green, witnessed live against the BUILT `dist/gh-pages/`.
- **The keystone is STILL PENDING (I.W7):** `proof:live-session` (the union of all per-wave
  interaction legs into ONE zero-error-budget session probe) + `proof:gate-is-runtime` (the
  machine enforcer of the t=0 precept) + the `proof:chronic-closure` rewire (cited gates must
  be runtime gates that BIT) + DELETE `proof:specular-handoff` + author the never-written
  `proof:no-route-storm`'s intent into the harness + the two-tier HYGIENE/CORRECTNESS
  taxonomy. This wave is born-RED on `b934a08` and goes fully green only once I.W0–I.W6 land.
  **Until I.W7 closes, the durability mechanism that lets "green" mean "a human sees it work"
  is not yet installed — the LANDED legs are honest but not yet bound.**

---

## §5 — WHAT REMAINS (the close path)

1. **I.W4 finalize** — commit the in-flight drag seam (B6: global select-suppression +
   `releasePolicy: persist`, `settle()` not `reseat(0,0)`) + the composed frame driver (B8:
   non-reactive `style.transform` write, ONE driver per scene); green `proof:drag-gesture` +
   `proof:perf-frame-budget` (4× throttle, dock-expand `dropped ≤ 2`, easing-play `≤ 3`).
2. **I.W6 commit** — land the `proof:specular-absent-at-rest` script + the package.json wiring
   (the 3.9.0 specular consume is already LIVE-verified); DELETE `proof:specular-handoff`;
   carry the Plus-Jakarta workaround forward + file the glass-ui-HANDOFF for the gestalt fix.
3. **I.W7 overhaul** — the durability keystone: assemble `proof:live-session` from the legs,
   install `proof:gate-is-runtime`, rewire `proof:chronic-closure`, retire the source-shape
   lattice to HYGIENE-tier, author `proof:no-route-storm`'s intent.
4. **I.WZ close + publish + deploy** — FINAL.md + prompt-recap + the I changeset (version
   owner Mike Babb, bump off 4.1.0) + the value.js publish + the kf re-pin (§3.A) + the
   CF-Pages deploy (keyframes.babb.dev). **Now actionable — user has AUTHORIZED
   publish/push/deploy.**

---

## §6 — inv-ε COMPLIANCE NOTE

Every LANDED row is grounded in a committed wave (`107236d`/`8a40cf4`/`e2085c8`/`b8659fe`/
`bea5f27`) + its IMPL record + a runtime gate witnessed born-RED→green live. Every in-flight
row names its uncommitted working-tree files honestly and does NOT claim its gate green.
Every pending row cites its authored wave spec and the born-RED-on-`b934a08` posture without
overclaiming. The specular B7 row distinguishes "live-confirmed via chrome-devtools-mcp"
(true now) from "the `proof:*` script lands with the I.W6 commit" (pending) — the gate, not
the eyeball, is the close arbiter. No deficit is manufactured where the state holds (CH-2,
D5/D9, the cartoon panels, the mobile bones are RE-AFFIRMED, not re-litigated); no claim runs
past the gate that earns it.
