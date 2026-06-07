# Tranche H — DEEP harden lane `hd-w5` (H.W5: scene icons + mode pertinence + interactivity + cube/amiga scene-quality)

**Charge:** the SUBSTANTIVE adversarial pass the consistency harden could not make.
Is each FIX correct + feasible? does each gate BITE? does any wave over-reach into
ALREADY-SOTA? does any wave assume an API/feature that does not exist? Red-team the
KILL/KEEP/MERGE verdicts, the inline-SVG migration, `proof:scene-parity`,
`proof:scene-icons`, `proof:scene-perf-budget`.

**Method:** read `waves/H.W5.md`, `H.md` §H.W5, `a-scene-icons`, `a-icon-pipeline`,
`a-modes-pertinence`, `a-mode-interactivity`, `a-scene-path-discrete`,
`a-scene-square-easing`, plus cross-repo + source reality checks on `tranche-h-dev`
(engine exports, `node_modules/vite-svg-loader@5.1.1`, `node_modules/@mkbabb/glass-ui`,
the actual demo source the wave proposes to edit, and a numeric proof of the A3
tessellate-fix isomorphism).

---

## VERDICT

H.W5 is **largely SOUND and feasible** — the KEEP-all-4 + MERGE-Discrete→Spring verdict
is correct, the inline-`<svg> currentColor` migration is the right (and the ONLY
theme-correct) reference fix, the engine primitives the interactivity floor dogfoods
(`ManualTimeline`, `SpringProgress`, `decay`, `NumericAnimation`) ALL exist and are
publicly exported, the A3 tessellate fix is provably pixel-identical (524288→128
`fillRect`), and `<Card surface="cartoon">` is real in glass-ui 3.4.0. The wave does NOT
over-reach into ALREADY-SOTA (it correctly fences the cube engine, the `fromMotionPath`
seam, and the easing bezier-drag core).

But it carries **one BLOCKER, two HIGH, and several MED/LOW defects** that will bite at
implementation time. The headline blocker is a **favicon/PNG-KILL collision** the wave's
own gate cannot survive as written. The two HIGH defects are a **factually-wrong
"TRIPLE-surface" premise** under the de-dup gate (it is a DOUBLE-surface, and the
collapsible artifact is `springLinearStops`, NOT `springTimingFunction` which is
correctly surfaced 6×), and an **EasingCurveCanvas emit-name + props-contract mismatch**
the `proof:easing-curve-onstage` gate will fail on a typo, not on the logic.

---

## FINDINGS

### BLOCKER-1 — S2 KILLs `cube-icon-sm.png`, which IS the live favicon; the wave's own allow-list does not cover it
**Loc:** `waves/H.W5.md` §S2 + §Hard gate `proof:scene-icons`; `H.md` §H.W5.S2.

**Defect (evidence).** `demo/app/index.html:14` is `<link rel="icon" href="../../assets/icons/cube-icon-sm.png" />` — the favicon source IS `cube-icon-sm.png`, one of the three `-sm` PNGs S2 says to "DELETE … in one motion". The gate text allow-lists "a single explicitly allow-listed favicon" but the favicon today points at a file on the KILL list, and `a-icon-pipeline §3` (P7) separately records this file DOUBLE-ships (favicon emit + dock base64). So as written: S2 deletes `cube-icon-sm.png`, `index.html:14` 404s the favicon, and `proof:scene-icons` (G3: "`assets/icons/` contains ZERO `.png` modulo a single allow-listed favicon") is INTERNALLY CONTRADICTORY — the favicon it allow-lists is the file the same step deletes. The wave never names WHICH file the surviving favicon is, nor edits `index.html:14`.

**Why BLOCKER:** the step cannot be implemented without an undefined decision (keep `cube-icon-sm.png` as the lone allow-listed raster? re-point `index.html:14` to a new `favicon.svg`? emit a fresh raster from the new cube SVG?). Each is a different motion with a different gate shape. An author hitting this mid-impl has no charter answer.

**Concrete doc edit:** in §S2 replace "keep the single emitted PNG favicon explicitly IF a raster favicon is wanted" with a NAMED resolution: *"Re-point `index.html:14` to a checked-in `assets/icons/favicon.svg` (the new cube glyph, theme-irrelevant in the browser-chrome context) in the SAME motion as the `-sm` PNG KILL — OR, the named befitting raster delta: keep exactly `cube-icon-sm.png` as the lone allow-listed favicon raster and re-point `index.html:14` to it explicitly (it is no longer dock-referenced once S1 lands). The dock NEVER references it."* Then make `proof:scene-icons` G3 assert the allow-list set is exactly `{the one favicon path named in index.html}` and that `index.html`'s `rel=icon` resolves to an existing file (so the favicon 404 is itself gated).

---

### HIGH-1 — the de-dup premise is factually wrong: `springLinearStops` is DOUBLE-surfaced (not triple); the actually-6×-surfaced artifact is `springTimingFunction`, which the gate does NOT police
**Loc:** `waves/H.W5.md` §State ("`springLinearStops` is TRIPLE-surfaced … `SpringSidebar.vue:80-96,130`, `SpringTarget.vue`, AND `StartingStyleTarget.vue:91-104`"), §S3, §Hard gate `proof:scene-parity` ("`springLinearStops` is computed in EXACTLY ONE composable — grep ≤1 `springLinearStops(` call-site").

**Defect (evidence — grep over `demo/`).**
- `springLinearStops(` call-sites: exactly **TWO** — `demo/spring/SpringSidebar.vue:130` and `demo/spring/StartingStyleTarget.vue:95`. **`SpringTarget.vue` does NOT call `springLinearStops`** (it only has a `springTimingFunction sweep` label at `:53,56` — no call). So the "TRIPLE-surface" claim mis-counts: it is a DOUBLE-surface, and one of the named three sites is wrong. (`a-modes-pertinence §1` repeats the same triple claim with the same wrong `SpringTarget` member — the wave inherited the error.)
- `springTimingFunction(` call-sites: **SIX** — `StartingStyleScene.vue:29`, `useSpringDemo.ts:103,108,257`, `useSequenceDemo.ts:83,116`. The Discrete scene's contract anim (`StartingStyleScene.vue:29`) uses `springTimingFunction`, NOT `springLinearStops`. And Sequence legitimately consumes `springTimingFunction` for its children — that is NOT collapsible into a spring-only composable (Sequence is a distinct scene).

**Why HIGH:** (a) the de-dup gate `proof:scene-parity` ("≤1 `springLinearStops(` call-site") is *already nearly green* (2 sites, both inside `demo/spring/`, trivially folded to 1 composable consumed by the rail-view and the discrete sub-view) — so it BITES far less than the charter implies (it claims to red "TODAY" a triple-fork; it actually reds at a double-fork, and one fold satisfies it). That is survivable. (b) The REAL surfacing redundancy the charter gestures at — the `springTimingFunction` artifact — spans 6 sites across 3 scenes, and the gate does NOT touch it, AND it MUST NOT (Sequence's two are non-collapsible). So the gate as written is honest-but-mislabelled: it polices `springLinearStops` (fine) while the prose claims a broader triple-collapse that does not exist.

**Concrete doc edit:** in §State and §S3, correct "TRIPLE-surfaced (`SpringSidebar`/`SpringTarget`/`StartingStyleTarget`)" → "DOUBLE-surfaced in `demo/spring/` (`SpringSidebar.vue:130` + `StartingStyleTarget.vue:95`); `SpringTarget.vue` surfaces only the `springTimingFunction` *sweep label*, not a `springLinearStops` call". Add an explicit RECORD: "`springTimingFunction` is surfaced 6× across spring/sequence/starting-style; this is NOT a DRY defect — Sequence's two (`useSequenceDemo.ts:83,116`) ease distinct children and the Discrete contract anim (`StartingStyleScene.vue:29`) is a separate primitive surface — the gate polices ONLY the spring-local `springLinearStops` fold." Keep the `≤1` gate but label it "spring-local artifact fold" not "triple-fork collapse".

---

### HIGH-2 — `proof:easing-curve-onstage` references a non-existent emit/ref name; the gate will fail on a contract typo, not the logic
**Loc:** `waves/H.W5.md` §S4 + §Folds (cites `a-mode-interactivity` "already `@update:bezier-points`"), §Hard gate `proof:scene-parity` ("a handle drag updates `bezierControlPoints`").

**Defect (evidence — read `EasingCurveCanvas.vue` + `useEasingDemo.ts`).** The component emits **`update:bezierPoints`** (camelCase — `EasingCurveCanvas.vue:117,261`), takes a prop **`bezierPoints`** + **`editable`** (`:109-117`), and `useEasingDemo.ts` holds the state ref **`bezierControlPoints`** (`:50`) and the computed **`isBezierEditable`** (`:66`). The wave and `a-mode-interactivity` write the event as **`@update:bezier-points`** (kebab) and conflate the canvas prop (`bezierPoints`) with the demo ref (`bezierControlPoints`). In Vue templates kebab `@update:bezier-points` DOES bind to a `update:bezierPoints` emit (Vue normalizes), so the template form is harmless — BUT a gate that asserts "a handle drag updates `bezierControlPoints`" is asserting on the DEMO ref, which is only updated if the promoted stage wires `@update:bezierPoints="bezierControlPoints = $event"` (the prop and the ref are DIFFERENT names). The wave never states that wiring; an author reading "promote EasingCurveCanvas to stage" could pass `:bezier-points="bezierControlPoints"` (good) but forget the two-way write-back, and the gate would correctly red — but the SPEC gave no contract to hit.

**Why HIGH:** `proof:easing-curve-onstage` is one of the three parity locks `proof:scene-parity` ANDs together; if its referenced symbol contract is loose, the gate is ambiguous about what GREEN means (does it check the canvas prop `bezierPoints`, or the demo ref `bezierControlPoints`?). The two are wired but not identical.

**Concrete doc edit:** in §S4 pin the exact contract: *"promote `EasingCurveCanvas` to the stage bound `:bezier-points="bezierControlPoints" editable @update:bezierPoints="bezierControlPoints = $event"` (the canvas emits `update:bezierPoints` (camelCase, `EasingCurveCanvas.vue:117`); the demo state ref is `bezierControlPoints` (`useEasingDemo.ts:50`) — the stage MUST write the emit back to the ref)."* In `proof:scene-parity` change "a handle drag updates `bezierControlPoints`" → "a handle drag emits `update:bezierPoints` AND the bound `useEasingDemo` `bezierControlPoints` ref changes (the two-way write-back is wired)".

---

### MED-1 — `vite-svg-loader` is a real NEW devDep, not present today; the wave under-states it as "one devDep + one alias-query"
**Loc:** `waves/H.W5.md` §S1 + §Design decisions ("vite-svg-loader `?component` query — one devDep + one alias-query, idiomatic").

**Defect (evidence).** `node_modules/vite-svg-loader` is ABSENT; `package.json` carries no svg-loader (`grep` → 0). `vite-svg-loader@5.1.1` exists and peer-deps only `vue: >=3.2.13` (compatible with the installed Vite 8 — no Vite peer pin), and pulls `svgo@^3.3.3` transitively. So the move is FEASIBLE, but it is a genuine new dependency + a `vite.config.ts` plugin registration (not merely "an alias-query"). The wave's Scope line lists `vite.config.ts (the ?component / vite-svg-loader inline-SVG seam)` so the surface is acknowledged — but the §Design-decision phrasing "one devDep + one alias-query" understates that this needs `plugins: [..., svgLoader()]` wired into the demo build config (and a `*.svg?component` ambient type decl for `verbatimModuleSyntax`/`strict` — see MED-2).

**Note (alternative, not a finding):** `@iconify/vue@5.0.1` is ALREADY a devDep but is unused in the demo — it is NOT a substitute (it renders icon-set glyphs by name, not arbitrary local hand-authored `*.svg`). vite-svg-loader is the correct tool. Recording so a reviewer doesn't propose iconify as a "free" alternative.

**Concrete doc edit:** in §Design-decisions amend to "one new devDep (`vite-svg-loader@^5`, peer `vue>=3.2.13`, Vite-8-compatible; pulls `svgo`), a `svgLoader()` plugin entry in `vite.config.ts`, and an ambient `*.svg?component` module decl — idiomatic, not a workaround". Cross-link the inv-16 spine: this devDep is kf-owned demo tooling (NOT a glass-ui/value.js handoff), so it is in-scope.

---

### MED-2 — `proof:scene-icons` G1 (file-shape) and G4 (theming) can diverge under `?component`; the gate must read the SOURCE file, and `?component` + SVGO must not strip `currentColor`
**Loc:** `waves/H.W5.md` §Hard gate `proof:scene-icons` (the shape clause "every `assets/icons/*.svg` is `fill="none"` + ≥1 `stroke="currentColor"`" AND the theming clause "computed stroke equals host `currentColor`").

**Defect.** Two real seams the gate text glosses: (1) vite-svg-loader runs SVGO by default; SVGO's `convertColors`/`removeAttrs` plugins can rewrite or drop `stroke="currentColor"` (it sometimes folds `currentColor` to a literal or removes "redundant" attrs). If the build pipeline mutates the SVG, G1 (reads the on-disk file → green) and G4 (reads the MOUNTED computed stroke → could be red) DIVERGE. (2) The easing exemplar today bakes `hsl(248,88%,71%)` on BOTH the `<path stroke>` AND two `<circle fill>` (`easing-icon-sm.svg:2-4`) — the wave's shape clause checks "stroke=currentColor" but the endpoint DOTS use `fill`, not stroke; a literal-hue `fill` on the dots would pass a stroke-only assertion while still being theme-blind. G1 already says "ZERO baked `hsl(`/`rgb(`/`#hex` stroke OR fill" so the prose is right — but the dots are `fill` + `opacity:0.4`, and `fill="currentColor"` + opacity is the correct fix, which the §S2 concept list ("optional opacity:0.4 endpoint dots") does not pin to `currentColor`.

**Why MED:** the gate is mostly right; the risk is a silent SVGO mutation making G4 red while G1 is green (confusing the author), and an under-specified dot-fill leaving a theme-blind hole the stroke-only reading misses.

**Concrete doc edit:** in §S1 add "configure `vite-svg-loader` with `svgo: { plugins: [{ name: 'preset-default', params: { overrides: { convertColors: false, removeViewBox: false } } }] }` so `currentColor` survives the build". In §S2 pin "endpoint dots `fill="currentColor"` opacity:0.4 (NOT a baked hue — the easing exemplar's two `<circle fill="hsl(...)">` at `easing-icon-sm.svg:3-4` are the same wart as its `<path stroke>` and die in the same motion)". In `proof:scene-icons` make G4 the authority where they disagree ("if G1 green but G4 red, the build mutated the source — fail and disable the offending SVGO plugin").

---

### MED-3 — `proof:scene-perf-budget` / S6 conflates the amiga-pertinence KILL determinism with the icon survivor-set, but the SAME data shows amiga's `AnimationGroup` is genuinely never advanced — confirm the KILL gate measures the right thing
**Loc:** `waves/H.W5.md` §S6 (A5 sphere-drive-or-KILL), §Hard gate `proof:scene-perf-budget` (`proof:amiga-engine-drives-mesh` "the sphere position/rotation change WHILE the group plays").

**Defect (evidence — read `AmigaScene.vue` + `useAmigaAnimations.ts`).** Confirmed: `useAmigaAnimations` builds an `AnimationGroup` (`:117`), returns it, and AmigaScene consumes `{ animationGroup }` (`:31`) only to `.stop()` it on unmount (`:129`) and `computed`-expose it (`:149`). There is NO `.play()` anywhere; the render loop calls only `controls?.update()` (`:105`, OrbitControls) — so the sphere mesh is driven by camera orbit, NOT the engine group. The A5 claim is CORRECT. BUT: the gate `proof:amiga-engine-drives-mesh` asserts the sphere "position/rotation change while the group PLAYS" — if A5 lands the sphere-drag-via-`decay()` rebuild, the sphere moves on DRAG-impulse, not on `group.play()` autoplay. The gate's "while the group plays" framing presumes the autoplay path, but the proposed rebuild is a drag-impulse path (the cube's idiom). The gate could be GREEN under autoplay yet the proposed interaction is drag-driven — or RED because drag-impulse decay is not "the group playing".

**Why MED:** the gate must measure the SURVIVING interaction model (drag→impulse→`decay()` moves the mesh), not a phantom autoplay the rebuild doesn't ship. As written it risks testing the wrong drive path.

**Concrete doc edit:** reframe `proof:amiga-engine-drives-mesh` to "after a pointer-drag-release on the sphere, the mesh `rotation`/`position` continues to change for ≥N frames under the engine `decay()` glide (independent of OrbitControls camera) — the cube's impulse idiom dogfooded on a non-DOM target; ELSE the amiga route/descriptor/icon are absent". Drop "while the group plays" (the rebuild is impulse-driven, not autoplay).

---

### LOW-1 — S5/S6 KILL-candidates (square, amiga) gate S2's survivor icon set, but the wave does not order S6 BEFORE S2 the way it orders S3/S5 before S2
**Loc:** `waves/H.W5.md` §Design-decisions ("Icons designed ONLY for survivors, AFTER the pertinence verdict — S3/S5 … precede S2"), §S6 (A5 amiga KILL call).

**Defect.** The wave correctly states S3 (Discrete merge) and S5 (square KILL) precede S2 (icon authoring) so the family is deterministic. But amiga's survivor status is decided in **S6** (A5 sphere-drive-or-KILL), and S6 is NOT named in the "precedes S2" ordering. Amiga is an ORIGINAL stage scene whose icon S2 must author ("cube/amiga/square become vector glyphs"). If amiga is KILLed by A5, its icon is wasted motion — the exact thing the §Design-decision guards against for square/discrete, but the guard omits amiga.

**Concrete doc edit:** in §Design-decisions "Icons designed ONLY for survivors", add S6/A5 to the precedence: "S3 (Discrete merge), S5 (square KILL), AND S6/A5 (amiga sphere-drive-or-KILL) all precede S2 — the survivor set is `{cube, easing, spring, sequence, path}` + `{square iff S5-survives}` + `{amiga iff A5-survives}`."

---

### LOW-2 — `proof:scene-parity` asserts "exactly 3 surviving new-mode entries (Spring | Sequence | Path)" but the descriptor count is data the gate should read, not a literal 3
**Loc:** `waves/H.W5.md` §Hard gate `proof:scene-parity` ("the nav/`scenes.ts`/`router.ts` carry exactly 3 surviving new-mode entries").

**Defect.** Hardcoding "exactly 3" is brittle against the very survivor-set determinism the wave prizes: if A5 KILLs amiga, the ORIGINAL count also drops, and a future reviewer reading "exactly 3 new-mode entries" may conflate new-mode count with total scene count. `scenes.ts` today has 8 non-home descriptors (`grep -c "id:"` → 12 total incl. nested, 8 scenes + home). The gate is really "no `starting-style` descriptor/route survives AND the 4 new-mode group folded to 3". State it structurally.

**Concrete doc edit:** rephrase to "`router.ts` has no `starting-style` route AND `scenes.ts` has no `starting-style` descriptor (the merge landed) AND the surviving NEW-mode set is exactly `{spring, sequence, motion-path}` (Discrete folded into spring)" — assert the absence of `starting-style` + the membership set, not a magic integer.

---

## RED-TEAM OF THE CORE VERDICTS (asked directly)

- **Is merging Discrete→Spring sound — or is `@starting-style` a distinct teaching point?** SOUND, with a caveat the wave already handles. `@starting-style`/`allow-discrete` IS a distinct CSS primitive (it teaches a real, hard-to-author pattern — `a-scene-path-discrete F7` is right). But the wave does NOT kill that teaching point — it folds the CONTENT into a Spring SUB-VIEW (tab), preserving the `@starting-style` demo + the copy-paste `linear()` artifact while collapsing the nav entry and the duplicated solver SURFACING. `StartingStyleTarget.vue` already physically lives in `demo/spring/` (confirmed) and its own comment admits it surfaces "the same `springLinearStops()` path the Spring scene surfaces" (`:91`). The primitive-coverage stays distinct (same solver, different primitive — the wave's §Design-decision RECORDS exactly this). The merge is a FOLD not a deletion. **No finding** beyond HIGH-1's count correction.

- **Is square a true KILL-candidate, or does it demo something unique?** KILL-candidate is HONEST. Square's unique feature is the custom `transformFunc` over nested `a.b.c.d` object keyframes (`useSquareAnimations.ts:14-32`) — but that capability is already proven by the cube's matrix path and the motion-path scalar sweep (`a-mode-interactivity H-MI-1`). Live, the box doesn't even auto-start (`a-scene-square-easing §1.1`: static `rgb(127,255,212)`, empty `inlineTransform`) and ships placeholder `"heyyyy"` copy. The wave's "RECOMMEND KILL else drag+SpringProgress, no third option" is the correct Mandate-aligned framing. **No finding** — the named decision-at-impl-open is the right disposition for a DEV tranche.

- **Is the inline-`<svg currentColor>` + `<component :is>` migration feasible for ALL scenes?** YES, mechanically (vite-svg-loader@5 is Vite-8-compatible; `SceneDescriptor` already imports `type Component` from vue at `scenes.ts:1`, so `icon?: Component` is a one-line type add; the dock already renders Lucide inline-`<svg>` components so `<component :is>` is established). The AUTHORING question — "who authors the survivor icons, is that in-scope for a DEV tranche or does it need design assets?" — is the real concern. The wave answers it: hand-authored 32×32 `currentColor` vectors in the easing mould (which is ALREADY-SOTA as a shape exemplar). This is **in-scope for impl** (it is code-as-source, the file IS the source — no external design-asset dependency, no Figma round-trip). The cube/amiga "vector glyph" concepts (isometric cube outline, checker-sphere) are simple line glyphs, not photographs — authorable by the impl engineer. **No BLOCKER here** — but see MED-1/MED-2 (the build seam) and BLOCKER-1 (the favicon) which are the real feasibility frictions.

- **Does `proof:scene-parity` (an `<img>` FAILS by construction) over-constrain?** NO — it is correctly constructed and does NOT over-constrain. The theming clause (G4 in `proof:scene-icons`, restated in the §Mandate-bar) asserts the mounted icon's computed stroke == host `currentColor` in dark+light. An `<img :src="…svg">` renders SVG as a replaced element (separate document) that cannot read host `currentColor` — `a-icon-pipeline §4` proves this is a CONSTRUCTION fact, not a style choice. So the gate bites a length the PNG→SVG swap alone does not (the wave's central insight: theming is a property of the REFERENCE mechanism, not the file format). It does NOT forbid a legitimately-raster favicon (allow-listed) — it forbids `<img>` as the ICON reference mechanism, which is exactly the defect. The only risk is the SVGO-mutation divergence (MED-2), not over-constraint.

---

## ALREADY-SOTA — correctly fenced (no over-reach)

The wave does NOT manufacture deficits in exemplary work — verified:
- The cube OrbitalDrag quaternion core + `AnimationGroup` dogfood (the §ALREADY-SOTA fence is correct).
- `fromMotionPath` engine seam (offset-path scalar sweep, WAAPI-eligible, zero JS geometry) — confirmed live in `a-scene-path-discrete §LIVE` (0%→(550,390), 50%→(801,447), 100%→back); the wave only ADDS the inverse (pointer→offset-distance via `getPointAtLength`+`ManualTimeline`), it does not touch the seam.
- `EasingCurveCanvas` bezier-drag core (`getScreenCTM().inverse()` SVG mapping, rubber-band, pointer-capture) — the wave PROMOTES it to stage (pure reuse), does not rewrite it.
- `easing-icon-sm.svg` shape idiom — the wave converges the family on it and fixes only the baked hue. Correct.
- The A3 fix is isomorphism-preserving (proved numerically: the buggy pixel-loop and the proposed 16×16 tile-loop produce byte-identical boards; `proof:amiga-tessellate-tilecount ≤256` is well-calibrated against the 128-call fix with headroom).

---

## CROSS-REPO / API REALITY CHECKS (all PASS unless noted)

| claim | check | result |
|---|---|---|
| `ManualTimeline` public | `index.ts:46` exports it; `timeline.ts:181 class ManualTimeline` | EXISTS |
| `SpringProgress` public | `index.ts:34` | EXISTS |
| `decay`/`decayRest` public | `index.ts:68-69`; `decay.ts:59` | EXISTS (kf-local, value.js handoff VJ-1 noted in source — not a blocker for H.W5 consumption) |
| `NumericAnimation` public | `index.ts:30` | EXISTS |
| `getPointAtLength`/`getTotalLength` | browser SVGGeometryElement API (kf already uses `getTotalLength` in `draw-svg.ts`) | EXISTS (platform) |
| `<Card surface="cartoon">` | `node_modules/@mkbabb/glass-ui/dist/CardFooter-*.js:37` gates `cartoon-surface` on `surface==="cartoon"`; `cards.css:33 @utility cartoon-surface` | EXISTS (relevant to H.W2; confirms amiga/cube survivor context is unaffected) |
| `vite-svg-loader` `?component` | NOT installed; `vite-svg-loader@5.1.1` peer `vue>=3.2.13`, Vite-8-compat, pulls svgo | FEASIBLE new devDep (MED-1) |
| amiga `AnimationGroup` never `.play()`s | `AmigaScene.vue` — only `.stop()` `:129`, render loop is `controls.update()` `:105` | CONFIRMED (A5 correct) |
| `PATH_D` single-sourced exported | `motionPathGeometry.ts:17` | EXISTS (path-icon DRY claim feasible) |
| motion-path `<path>` in DOM | `MotionPathTarget.vue:22` `<path :d="PATH_D">`, stage/traveller refs at `:16,26` | EXISTS (drag feasible; a path ref is net-new but the element exists) |

---

## SUMMARY (for the orchestrator)

- **BLOCKER-1:** S2 deletes `cube-icon-sm.png` which is the live favicon (`index.html:14`); the gate's favicon allow-list contradicts the KILL. Name the favicon resolution.
- **HIGH-1:** "TRIPLE-surface `springLinearStops`" is wrong — it is DOUBLE (`SpringSidebar.vue:130` + `StartingStyleTarget.vue:95`; `SpringTarget` does NOT call it); the 6×-surfaced `springTimingFunction` is correctly NOT collapsible. Correct the count + label the gate.
- **HIGH-2:** `proof:easing-curve-onstage` references loose symbol names — emit is `update:bezierPoints` (camelCase), prop is `bezierPoints`, demo ref is `bezierControlPoints`; pin the two-way wiring contract.
- **MED-1:** `vite-svg-loader` is a real new devDep + plugin wiring, not "one alias-query".
- **MED-2:** SVGO under `?component` can strip `currentColor` → G1/G4 divergence; pin SVGO config + dot `fill="currentColor"`.
- **MED-3:** `proof:amiga-engine-drives-mesh` says "while the group plays" but the A5 rebuild is drag-impulse `decay()`, not autoplay — reframe.
- **LOW-1:** add S6/A5 (amiga) to the "precedes S2" survivor-determinism ordering.
- **LOW-2:** `proof:scene-parity` "exactly 3" should be a structural membership assertion, not a magic integer.

The KEEP-4/MERGE-Discrete/square-KILL-candidate verdicts, the inline-SVG theme fix, the interactivity-as-dogfood floor, and the A3 tessellate fix are all SOUND. No wave assumes a non-existent kf/glass-ui API. The defects above are doc-precision + one collision, not an architecture failure.
