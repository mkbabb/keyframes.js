# Tranche H — Deep Audit — Lane `a-g-session-audit`

**Charge.** Audit what THIS session (Tranche G impl + the re-pin + the fan-out +
the convergence + the glass-ui registry cleanup + the deploy + the 4.1.0 release)
actually landed, what REGRESSED, and — against the user's live demo defects D1–D14 —
whether G's demo waves (G.W7–G.W12) *introduced* the defects or *failed to catch*
them. Ground every claim in a `file:line` or a live observation on the running demo
(http://localhost:5174, kf 4.1.0 + Tranche G).

**Method.** `git diff d264053..HEAD` (the post-4.0.0 → G-tip range, 167 files /
+32 561 / −7 508), commit-by-commit; read of every G demo SFC/composable touched;
read of `docs/tranches/G/{FINAL,audit/*}`; live Playwright drive of the home/hero,
the dock, the controls grid, the dot-fade, the cartoon-shadow tokens.

**One-line verdict.** G was, by its own framing, "the narrowest tranche yet" — a
**re-pin spine + two additive engine surfaces + an idiom-drift sweep**. It did NOT
*introduce* the visible demo defects D1/D2/D6/D8/D12 (those predate G — E- and
F-era, some pre-tranche). It **DID introduce the regression vector for D5/D9** (the
dock breakage) by removing `:always-expanded` on an *unverified assumption* that
glass-ui's "rebuilt dock" owns the contract. And it **FAILED to catch** the rest —
despite running a dedicated Playwright demo lane that walked the very surfaces where
D1/D6/D12 live. The session's center of gravity was the (genuine, exemplary) dep
re-pin and engine work; the demo got a *cosmetic* sweep (token unification +
`useTemplateRef` migration + a rename) that never touched the layout/state/hover
substrate the user is reporting on.

---

## 1. What landed in G (the honest ledger)

The commit range, by class:

| Class | Commits | Substance | Assessment |
|---|---|---|---|
| **The spine** (headline) | `d308699` | `value.js ^0.10→^0.11.1`, `parse-that ^0.8.2→^0.9.0`, `glass-ui file:→registry`; ZERO `src/`/test/demo-SFC edit on the bump | **ALREADY-SOTA execution.** Genuinely the high-leverage motion. The one sibling defect it surfaced (`value.js 0.11.0` `"development"` export condition) was driven to a real upstream fix (`0.11.1`), not worked around. |
| **Engine additive** | `3d352a3` | `draw-svg.ts` (new, 214L), `.finished` getter, `adoptCompiled`, blend-leaf, `serializeEasing` fail-explicit | Cohesive, gated (`proof:drawsvg`/`proof:finished`/`proof:blend`). Net-new public API → 4.1.0 minor. No regression surface in the demo. |
| **Test corpora** | `7e86c40` | interpolate-anything / color-fidelity / computed-resolution / round-trip fixtures (12 `.css` + manifest) | Pure additive test value. |
| **Frontend sweep** | `1b9b05f` | `useTemplateRef` migration (8 sites), `useToastGuard→toastGuard`, `createGlobalState` for `useAssetManager`, the rAF-leak `onScopeDispose` fix, idiom tokens, `TopDock→ChromeDock`, OrbitalDrag quaternion-native rotate3d | Mixed — see §2. The rAF-leak fix and the OrbitalDrag rewrite are real; the dock + token changes are cosmetic and the layout/state defects were untouched. |
| **CI/release/deploy** | `5954d1c`, `98dab54`, `e31d75a`, `3ce23c7`, `d469e69`, `8fea80c` | gate-wiring, 4.1.0 changeset, retire the `file:` sibling, gitignore session artifacts, CF-Pages deploy | Infra; outside the demo-defect surface. |

**The genuinely exemplary G work (honest ALREADY-SOTA / SHIP-quality):**

- The re-pin (`d308699`) — single-seam consume, measure-first `proof:repin-safe`
  certifying 44/44 value.js names survive `0.11.x` before the bump. Textbook.
- The rAF-leak fix (G.W9) — four scene loop-owners had cleanup wired to a dead
  `onDeactivated` (`<KeepAlive>`-only; the host has none), so Easing/Spring leaked
  the preview loop on every play-then-swap. Re-homed onto `onScopeDispose`/
  `onBeforeUnmount`, gated `proof:scene-raf-leak`. A real, load-bearing fix.
- The OrbitalDrag quaternion-native rotate3d (G.W18) — `OrbitalDrag.vue` now renders
  ONE `rotate3d()` off the quaternion's native axis-angle (no Euler decompose, no
  gimbal), with the `quaternionEuler.ts` math extracted out of the SFC
  (`demo/@/components/custom/orbital-drag/quaternionEuler.ts:1`). This is the cube's
  drag — the *exact* interaction model D11 names as the gold standard.

---

## 2. Defect-by-defect: did G introduce, fail-to-catch, or fix?

### D1 — controls sidebar is TWO columns → should be ONE  ·  **FAIL-TO-CATCH (pre-tranche)**

- **Root cause:** `AnimationControlsControls.vue:4` — the row container is
  `grid grid-cols-[auto_1fr]`. Each `LabeledInput`/`LabeledSelect` is a *label-cell +
  value-cell* pair occupying ONE column; six controls therefore flow two-per-row:
  duration|delay, iterations|direction, fill|easing — **exactly** the user's report.
  The subgrid at `:294` (`grid-template-columns: subgrid`) just inherits this 2-track
  shape into the panel rows.
- **G touched this file?** No. `git log d264053..HEAD -- …/AnimationControlsControls.vue`
  is empty. The `grid-cols-[auto_1fr]` shape dates to `7933057` (the pre-tranche
  controls reorg), untouched by D/E/F/G.
- **G's Playwright lane saw it and did not flag it:** `a-demo-playwright.md:33` lists
  "duration/delay/iterations/direction/fill/easing" as ordinary, no two-column note.
- **Gestalt fix (H):** the controls sidebar is a *form*, not a dense data grid — one
  control per row. Re-shape the container to a single value-track (`grid-cols-1` with
  each control its own row, or `grid-cols-[auto_1fr]` with each `LabeledInput`
  spanning `col-span-full` + an internal label/value split). KISS: drop the implicit
  2-per-row flow. **Disposition: SHIP-in-H.**
- **Instrument:** `proof:demo-usability` (already browser-gated) clause — assert the
  computed `grid-template-columns` of `.panel-content` resolves to a single value
  track, OR a visual lock: each control row's `getBoundingClientRect().width` ≈ the
  pane content width (no side-by-side pairing).

### D2 / D14 — radial-blur on hover everywhere → should be cartoon shadows + refined specular  ·  **FAIL-TO-CATCH (glass-ui-HANDOFF)**

- **Live root cause:** the demo's glass surfaces render a *soft centered blur*
  shadow. Live read of the dock card: `box-shadow: 0px 0px 12px …/0.12` (0,0 offset +
  12px blur = a radial halo), `backdrop-filter: blur(11px)`. That centered halo is
  what the user perceives as "circular/radial blur on hover."
- **The cartoon-shadows the user wants ALREADY EXIST in glass-ui 3.4.0** (live var
  read): `--shadow-cartoon-sm = -3px 2px 1px … / 0 3px 1px … / -3px 3px 1px …`,
  `--shadow-cartoon-md`, plus `--glass-specular = inset 0 1.5px 0 0 hsl(0 0% 100% /
  0.45)`. glass-ui's `utilities.css:617` defines the `.cartoon-shadow-*` family.
  cartoon-shadow was CLOSED in Tranche C; the demo's glass components are simply NOT
  consuming the cartoon tokens on hover — they surface the soft halo + specular
  instead.
- **The kf-side `--glow` block at `design-idioms.css:263-269` is a RED HERRING for D2:**
  it is `.progress-dot` — the *active-playing progress ring's* conic-gradient glow
  (introduced `d400591`, Tranche **E**, NOT G), driven by `--dot-p`. It is not a hover
  treatment and not "everywhere." Don't fix D2 there. The real radial-blur lives in
  glass-ui's component hover styles.
- **G touched this?** No. `design-idioms.css` G diff only ADDED status-badge /
  code-token / `--controls-pane-width` / `--mask-fade` tokens — the `--glow-spread`
  block is untouched. G's styling lane (`a-styling.md`) audited the rail/ball glow
  drift (35% vs 40%) but never the hover radial-blur or cartoon-shadow.
- **Gestalt fix (H):** glass-ui owns the hover treatment — **glass-ui-HANDOFF**:
  reconcile the specular-radial hover (the glass is good — keep it) with the
  cartoon-shadow depth, so hover = a refined specular highlight + a cartoon-shadow
  lift, NOT a radial blur halo. The kf-side lever is the demo opt-in (which glass
  variant / `--shadow-cartoon-*` the panels/dock request). **Disposition: D2/D14 =
  glass-ui-HANDOFF; the kf demo opt-in = SHIP-in-H.**
- **Instrument:** a visual lock — on hover of a `.glass-card`/dock item, assert the
  computed `box-shadow` matches the `--shadow-cartoon-md` token (offset shadows, not
  a `0px 0px Npx` centered halo). Falsifiable: grep the resolved `box-shadow` for a
  non-zero x/y offset.

### D3 — easing editor too massive · inner border touches header · header too small  ·  **FAIL-TO-CATCH**

- **Anchor:** `controls/TimingFunctionPanel.vue` (the cubic-bézier/steps detail
  pane); `CubicBezierControls.vue` (the SVG editor). G's only touch to
  `TimingFunctionPanel.vue` was a 2-line `useTemplateRef`/comment change (G diff),
  not the sizing or the header type-scale.
- **G touched the sizing?** No. The panel dimensions / inner border / header
  type-scale are untouched across D/E/F/G.
- **Gestalt fix (H):** size the bézier editor to its content (it is over-tall); the
  header should ride the φ-ladder (`text-title`/`text-heading`, see D7) and the inner
  border should inset off the header (spacing token, not flush). **Disposition:
  SHIP-in-H.**
- **Instrument:** visual lock on the editor's rendered height ≤ a budget; assert the
  header font-size resolves to a φ-ladder token, not a raw size.

### D4 — PlaybackRibbon full-width → should match the controls sidebar width  ·  **FAIL-TO-CATCH**

- **Anchor:** `controls/PlaybackRibbon.vue` (Teleported to the active animation).
  G left it un-touched (not in the G diff). The `--controls-pane-width` token G *did*
  introduce (`design-idioms.css` + `AnimationControlsGroup.vue` grid track) is the
  EXACT lever D4 needs — but G applied it only to the controls column, not the ribbon.
- **Gestalt fix (H):** constrain the ribbon to `max-width: var(--controls-pane-width)`
  (the token already exists — DRY, single-source). **Disposition: SHIP-in-H.**
- **Instrument:** assert `PlaybackRibbon` rendered width ≈ the controls pane width.

### D5 — dock animations broken / slow / laggy · DockDropdownTrigger popover no longer opens  ·  **REGRESSION VECTOR INTRODUCED BY G (glass-ui-HANDOFF for the lag)**

- **G's change (G.W12, `1b9b05f`):** `dock/ChromeDock.vue` (renamed from
  `TopDock.vue`) **removed `:always-expanded="isMobile"`** and **removed the
  `DockLayerGroup`/`DockLayer` wrappers** — the items now mount directly in
  `GlassDock`'s default slot. The G glass-ui lane (`a-glass-ui.md:172,192-217`)
  explicitly framed this as removing the "occlusion-dodge mask" on the *condition*
  "confirm glass-ui's rebuilt dock handles the mobile no-occlusion natively
  (browser-test on square/mobile)" (`a-glass-ui.md:216`).
- **Why this is the regression vector:** G consumed glass-ui from the registry
  (`3.3.0` per FINAL; **now `3.4.0`** in node_modules — the registry moved forward
  *after* G's pin), removed the demo-side dock scaffolding, and **transferred the
  dock-behavior contract to glass-ui on an assumption** that may never have been
  live-verified. The dock lag + the DockDropdownTrigger popover not opening are
  consistent with a glass-ui dock that is *mid-rework* (the H mandate states the dock
  is being actively worked on in glass-ui's AW tranche NOW).
- **G's audits did NOT cover the lag or the popover:** no "lag/laggy/slow/popover/
  DockDropdown" hit in `a-glass-ui.md` or the hand-off doc. G shipped the dock
  re-wiring blind to D5/D9.
- **D9 (the @mbabb logo popover):** still wired — `App.vue:154` imports
  `DockDropdownTrigger` from `@mkbabb/glass-ui/dock`; the `DropdownMenu` block
  survives (`App.vue:17-66` per the defect; the G diff is only the `TopDock→ChromeDock`
  rename, comments). So D9 is NOT a kf-source deletion — it is the same dock breakage
  as D5 (the trigger renders but the popover does not open).
- **Gestalt fix:** the LAG + the non-opening popover are **glass-ui-HANDOFF** (audit +
  suggest, do NOT patch glass-ui inside kf). Suggest to glass-ui: profile the dock
  collapse/expand transition (the `transition: width … var(--ease-dock)` chain on
  `.glass-dock` is a width-animation — width animations are non-compositable and a
  classic lag source; suggest transform/clip-path instead), and fix the
  DockDropdownTrigger popover open-state. **Kf-side:** keep `ChromeDock` minimal;
  re-verify the no-occlusion contract live before trusting it.
  **Disposition: D5/D9 = glass-ui-HANDOFF; kf re-verification = SHIP-in-H.**
- **Instrument:** a Playwright gate that (a) clicks the @mbabb logo and asserts the
  popover opens (D9), and (b) measures dock collapse→expand frame time / asserts the
  transition uses transform not width (D5).

### D6 — typing dots ("...", dot-fade) totally broken  ·  **FAIL-TO-CATCH (G touched the very file)**

- **Root cause (live + source):** `EditorStartScreen.vue:17` passes the ellipsis as
  `<AnimatedText class="dot-fade depth-text" :text="ellipsis" />` with
  `ellipsis = "..."`. In `AnimatedText.vue:62`, `props.text.split(/\s+/)` splits
  "..." into a SINGLE word (no whitespace) → ONE span. That span carries hard
  `class="lift-down"` (`:24`) AND the spread `v-bind="$attrs"` (`:25`) injecting
  `dot-fade depth-text`. **Live confirmation:** the rendered span's
  `classList = "lift-down dot-fade depth-text"` — BOTH animation classes on one
  element. Both `.lift-down` (`:74`) and `.dot-fade` (`:95`) set the `animation`
  *shorthand*, so only one wins (live: `animationName = dotFade-…`, `opacity` cycling
  ~0). The three dots are ONE element fading as a block — there is **no per-dot
  stagger**, so it reads as broken (not a sequential typing indicator; the lift is
  also clobbered).
- **G's role:** G.W12 (`1b9b05f`) edited *this exact component* — replacing the
  inter-word whitespace text node with `marginInlineEnd: 0.25em` to fix the hero
  "Selectananimation" word-gap (`AnimatedText.vue:15-31`). It worked on the title but
  left the dot-fade single-element conflict untouched. G's Playwright lane even
  *saw the ellipsis cause an engine parse error* — `a-demo-playwright.md:122` "X-2 —
  Caught value.js parse error … the literal ellipsis text ('......', almost certainly
  the start-screen '…' hero string)" — and only BOOKed it, never connecting it to a
  broken dots animation.
- **Gestalt fix (H):** a typing indicator is THREE dots with staggered fade — model
  it as three discrete elements (or one element with three staggered pseudo/child
  dots) and dogfood the engine (`NumericAnimation`/a staggered keyframe), not a single
  span wearing two conflicting `animation` shorthands. Decouple `dot-fade` from
  `lift-down` (an element should never carry both). **Disposition: SHIP-in-H.**
- **Instrument:** assert no element carries both `lift-down` and `dot-fade`; assert
  the dots render as ≥3 staggered animated nodes with distinct `animation-delay`.

### D7 — hero "Select an animation" must be larger, φ-ladder typography  ·  **PARTIAL (G fixed the word-gap, not the scale)**

- **Live:** the hero `<h1 class="text-display-4">` computes `font-size: 86.112px`
  (the φ-ladder `text-display-4`, glass-ui phi-ladder). So the hero IS on the φ-ladder
  — G's F.W16 substrate (`AnimatedText.vue:1-11`) is the word-granular balance fix.
- **G fixed:** the "Selectananimation" word-gap (`a-demo-playwright.md:22` SHIP →
  `AnimatedText.vue:15-31` marginInlineEnd). Real and shipped.
- **Remaining (H):** the user wants it LARGER and the φ-usage audited across the demo.
  `text-display-4` may want to be `text-display-3/2`; audit all `.text-*` call sites
  for ad-hoc raw sizes vs the φ-ladder (`style.css:41`). **Disposition: SHIP-in-H**
  (size bump) + a φ-audit sweep.
- **Instrument:** `proof:idioms`/grep clause — no raw `font-size`/`text-[…px]` in demo
  SFCs; all display/title text resolves to a φ-ladder token.

### D8 — Spring/Sequence/Path/Discrete have no nav icons  ·  **FAIL-TO-CATCH (G added the route, not the icon)**

- **Root cause:** `ChromeDock.vue:25-30` — `sceneIcons` maps ONLY `cube/amiga/square/
  easing`. Asset files exist only for those four (`/assets/icons/{cube,amiga,square}-
  icon-{sm,lg}.png` + `easing-icon-sm.svg`). spring/sequence/motion-path/starting-style
  fall back to the generic `<Home>` icon (`ChromeDock.vue:172`).
- **G's role:** G.W12 *added the missing `starting-style` route* (`router.ts` G diff:
  "a whole registered scene was DEAD (X-6)") — so it KNEW the new scenes were
  under-wired — but it did NOT add their icons. spring/sequence/motion-path are
  F-era scenes; G's icon-gap is a fail-to-catch.
- **Gestalt fix (H):** AUDIT pertinence first (per the charter); for the survivors,
  author screenshotted SVG thumbnails matching the existing four. **Disposition:
  SHIP-in-H** (icons) gated behind the D8/D11 survival decision.
- **Instrument:** assert `Object.keys(sceneIcons)` covers every non-home scene id in
  `scenes.ts`.

### D9 — @mbabb logo popover no longer opens → see D5. **glass-ui-HANDOFF** (same dock breakage).

### D10 / D11 — mobile single-page + more-interactive new modes  ·  **NOT ADDRESSED BY G**

- G's only mobile-adjacent move was *removing* `:always-expanded="isMobile"` (D5
  vector). The "single page, affixed top+bottom docks, background = current animation
  area" (D10) and the "make the new modes draggable like the cube" (D11) were never in
  G's scope. The cube's interactivity (G.W18 quaternion drag) is the gold standard
  D11 wants extended — G perfected the cube but didn't propagate the model.
  **Disposition: SHIP-in-H** (new design work, not a G regression).

### D12 — scene-state corruption + no play/pause suspend-restore (CRITICAL)  ·  **FAIL-TO-CATCH (E-era machinery, brittle)**

- **The machinery EXISTS (Tranche E, NOT G):** `usePlaybackSnapshot.ts` (a
  save/restore codec, introduced `391533e`), `useSceneGroupSync.ts` (`d400591`),
  `useSceneVisibilityPause.ts` (`d400591`), the `scenePlayback` store. It IS wired:
  `App.vue:262 saveCurrentPlaybackState()` on switch; `App.vue:314 useSceneGroupSync`
  restores.
- **Why it corrupts (the brittle seam):** `useSceneGroupSync.ts:54` detects the
  "stable" remount via a *heuristic* — `isStableFire = currentSuperKey.value ===
  superKey` — and only restores on the second of a "double fire." `App.vue:268`
  confirms the host has **NO `<KeepAlive>` — every swap is a full unmount/remount**
  through a keyed `<Suspense>`. So state restoration rides a double-fire watcher race +
  a string-equality guess. The easing→cube→back path the user reports landing "stuck
  in an impossible ROUTED state" is exactly this fragile reconcile mis-firing.
- **G's role:** G did NOT touch ANY of these files (`git log d264053..HEAD` empty for
  all four). G's Playwright lane even FLAGged a related symptom —
  `a-demo-playwright.md:86` "clock does not advance under synthetic playback"
  (Sequence) — but only flagged, never root-caused to the scene-state machine.
- **Gestalt fix (H):** replace the double-fire heuristic with a FORMAL state machine +
  a store (the charter's ask). The user is right: this needs an irrefragable
  play/pause SUSPEND-on-leave / RESTORE-on-enter, per-scene delineation. Evaluate
  Pinia vs `createGlobalState` (the demo already uses `createGlobalState` for its
  stores — `stores/index.ts`, `useAssetManager` post-G.W8) vs an explicit XState-style
  machine. Recommend: a `createGlobalState` scene-machine with explicit
  `idle→entering→active→suspended→leaving` states, replacing the `isStableFire`
  guess. **Disposition: SHIP-in-H** (the critical one).
- **Instrument:** a Playwright sequence — play on easing → switch to cube → switch
  back → assert the controls/options are valid AND the playback state restored
  (playing↔paused preserved). Falsifiable on the exact corruption path.

### D13 — mobile drawer collapse/expand not springy + too slow  ·  **NOT ADDRESSED BY G**

- The drawer animation isn't in the G diff. The charter wants it to dogfood
  `SpringProgress` (an engine primitive kf already ships) + be fast. **Disposition:
  SHIP-in-H** (dogfood the engine — idiomatic).
- **Instrument:** assert the drawer transition is driven by `SpringProgress` (not a
  raw CSS `transition: … var(--duration-slow)`); assert the settle time < a budget.

---

## 3. Did G's demo waves introduce or fail to catch? (the synthesis)

| Defect | G introduced? | G fixed? | G failed to catch? | G touched the file? |
|---|---|---|---|---|
| D1 two-column sidebar | No (pre-tranche `7933057`) | No | **Yes** | No |
| D2/D14 radial-blur hover | No (glass-ui) | No | **Yes** | No (the kf `--glow` is E-era, unrelated) |
| D3 easing editor sizing | No | No | **Yes** | Cosmetic-only (2 lines) |
| D4 ribbon full-width | No | No | **Yes** (made the token it needed, didn't apply) | No |
| D5 dock lag/popover | **Regression vector** (removed `:always-expanded`, transferred contract on assumption) | No | **Yes** (no lag/popover audit) | **Yes** (ChromeDock) |
| D6 typing dots | No (pre-existing conflict) | No | **Yes** (saw the X-2 parse error, didn't connect) | **Yes** (marginInlineEnd) |
| D7 hero size/φ | — | **Partial** (word-gap) | size bump pending | **Yes** |
| D8 missing scene icons | No (F-era scenes) | No (added the *route* not the icon) | **Yes** | Yes (added route, not icons) |
| D9 logo popover | No (still wired) | No | **Yes** (= D5) | Cosmetic-only (rename) |
| D10 mobile single-page | No | No | out-of-scope | No |
| D11 interactive new modes | No | (perfected the cube) | not propagated | OrbitalDrag (cube only) |
| D12 scene-state corruption | No (E-era machinery) | No | **Yes** (flagged the symptom, not the cause) | No |
| D13 drawer spring | No | No | out-of-scope | No |

**The pattern.** G's demo waves were a **cosmetic + idiom sweep**, not a
behavior/layout audit: token unification (`--mask-fade`, `--controls-pane-width`,
`.status-badge`, `.code-token`), `useTemplateRef` migration, a `TopDock→ChromeDock`
rename, and a `createGlobalState` store fold. The ONE behavioral demo change — the
dock de-scaffolding (G.W12) — is the only G-introduced regression vector (D5/D9), and
it shipped on an *unverified assumption* about glass-ui's rebuilt dock. The LAYOUT
(D1/D3/D4), the HOVER treatment (D2/D14), the STATE machine (D12), and the
typing-dots conflict (D6) were all reachable by G's own Playwright lane — three of
them were literally *observed* in `a-demo-playwright.md` (the hero, the occlusion, the
ellipsis parse error, the Sequence clock) but none were root-caused to the defects
the user now reports.

---

## 4. Net assessment of the session (honest)

- **The spine + engine work is genuinely SOTA.** The re-pin discipline (measure-first
  `proof:repin-safe`, driving the `value.js 0.11.1` upstream fix rather than working
  around it), the additive `draw-svg`/`.finished`/`adoptCompiled` surfaces, the
  rAF-leak fix, and the OrbitalDrag quaternion rewrite are exemplary and gate-locked.
  G earned its 4.1.0.
- **The demo "convergence" was shallow.** G's FINAL claims "~90–95% ALREADY-SOTA,
  re-touched by NO wave." That is *true of the engine*; it is **NOT true of the demo
  UX** — the user's D1–D14 are a direct rebuttal. The demo waves verified idioms and
  tokens but never the rendered *experience*. The Playwright lane existed but its
  findings were under-actioned (BOOK/FLAG where SHIP was warranted).
- **The handoff doc has a dock-shaped hole.** `valuejs-parsethat-glassui-handoff.md`
  carries no dock-lag / popover / specular-radial item — so the glass-ui regressions
  D2/D5/D9/D14 enter H with NO upstream charter. H must open those glass-ui-HANDOFFs.

## 5. H entry recommendations (dispositions rolled up)

- **SHIP-in-H (kf demo):** D1 (one-column), D3 (editor sizing/header), D4 (ribbon
  width via existing token), D6 (decouple dot-fade, stagger the dots), D7 (size bump +
  φ-audit), D8 (icons, post-survival), D10/D11 (mobile + interactivity), D12 (the
  formal scene+playback state machine — CRITICAL), D13 (dogfood `SpringProgress`).
- **glass-ui-HANDOFF:** D2/D14 (reconcile specular-radial hover with cartoon-shadow
  depth — the tokens already exist in 3.4.0), D5 (dock collapse/expand lag — suspect
  width-animation; profile + move to transform), D9 (DockDropdownTrigger popover open
  state). Tag, suggest, do NOT patch glass-ui inside kf.
- **Re-verify (kf):** the no-occlusion contract G transferred to glass-ui's dock
  (`a-glass-ui.md:216` made it conditional) — live-test before trusting.

**Live anchors captured this lane:** dock `box-shadow: 0px 0px 12px` halo; glass-ui
3.4.0 `--shadow-cartoon-sm/md` + `--glass-specular` present; hero `font-size 86.112px`
(`text-display-4`); dot span `classList="lift-down dot-fade depth-text"` (both
animation classes, opacity cycling); `sceneIcons` = {cube,amiga,square,easing} only.
