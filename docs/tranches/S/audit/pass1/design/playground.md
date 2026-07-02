# Playground — design audit (Tranche S, pass 1)

> Scope: the standalone playground app — `demo/playground/App.vue`, `demo/playground/usePlaygroundAnimations.ts`, `demo/playground/index.html`, rendering through `demo/@/components/custom/editor-shell/EditorShell.vue` and the shared `demo/@/components/custom/asset-manager/*` suite. Evidence: the three capture screenshots (`playground-{mobile,laptop,desktop}.png`) + source. Prior treatment: `docs/frontend-design/demo/playground.md` (the L.W11 "Motion Foundry" proposal — partially implemented).
>
> KNOWN context this audit inherits: the production build is structurally broken (blank), the page is NOT deployed, NOT in the capture harness, and the structure lanes flagged fold-or-kill. This report renders the design/product verdict on that question.

---

## 1. Product truth — what this page IS and is FOR

The playground is the demo's only **authoring surface**. Every one of the eight SPA scenes demonstrates a fixed subject running a pre-composed animation; the playground inverts that: the user places raw material (rectangle/circle/text/image/SVG assets, `useAssetManager.ts:54-74`) on an open stage, manipulates it directly (drag/resize/rotate with pointer capture, `AssetViewport.vue:174-275`), and **binds motion to it by hand** — a per-asset preset `<Select>` (`AssetPropertiesPanel.vue:127-145`) that retargets one of five live `AnimationGroup` presets (`usePlaygroundAnimations.ts:15-61`) onto the asset's DOM element via `setTargets` (`App.vue:127-145`). The L.W11 treatment named this correctly: *the one page where motion is something you POUR, not something you watch*. That product truth is genuinely distinct — no other scene has a moment of authorship — and it is the strongest possible argument that the CAPABILITY deserves to live. It is not, however, an argument that the *standalone app* deserves to live: everything the page mounts (`EditorShell`, the asset-manager suite, the control tabs, the `extraTabs` seam built expressly for it in glass-ui 4.0.0) is shared infrastructure the main SPA already hosts. Today the page is a designed room nobody can enter: broken in prod, undeployed, unreachable from keyframes.babb.dev — the foundry key-light and the bind-ignition comet-tail (the page's best work) have literally zero audience.

**Verdict: FOLD, do not kill.** Promote it to a ninth SPA scene — `scenes/compose/` ("Compose", the capstone at the end of the scene roster: after eight scenes of watching the engine, you author with it). The fold is cheap by construction: `App.vue` already rides `EditorShell` exactly as scenes do, the Assets tab already flows through the same `extraTabs`/`tabs-content` seam the scene machine's `extraControlTabs` projection feeds (`App.vue:93-98`, `EditorShell.vue:138-144`), and the asset store is already a shared global (`useAssetManager.ts:38`). What the fold buys: deployment (the broken standalone build dies), the dock/scene-switcher chrome, capture-harness coverage, KeepAlive persistence, and — most importantly — an audience for the ignition signature. What it costs: a `SceneExposedApi` adapter and a scene-machine playback adapter, both established recipes (`app/sceneExposedApi.ts`, `stores/scenePlaybackAdapters.ts`).

---

## 2. Usability, affordance discoverability, interactability

### The first-run path (what a first-time user finds unaided)

The cold-boot funnel works on desktop, mostly by seeding: `App.vue:105-110` force-selects the first preset, routes the controls pane to the Assets tab, and opens the panel — so the user lands with the Assets panel open and a "Compose a scene" card on stage with an explicit "+ Add a shape" button (`AssetViewport.vue:8-32`). Add → rectangle appears selected at (100,100) → the properties grid (name/x/y/w/h/rotation/bg/radius/**animation**) appears inline in the panel (`AssetLayerPanel.vue:58-69`). The bind `<Select>` is the last row of a nine-row form — findable, but the page's HEADLINE act is visually the peer of "border radius." Once bound, the L.W11 ignition fires (key-light settles on the asset + the comet-tail draws the preset's real easing curve via the engine's own `fromDrawSVG`, `App.vue:202-236`) — this is excellent, discovered-by-doing feedback.

What a first-timer will NOT find unaided:

- **That binding is the point.** Nothing on the empty stage or in the panel says "bind" until an asset is selected; the properties panel only renders on single-selection (`AssetLayerPanel.vue:58`). Multi-select (shift) hides it entirely.
- **What the bottom transport means.** The dock ribbon shows a "bounce" select + reset + trash + rainbow play (all three screenshots). That select is the *controls-pane edit target*, not "the scene's animation" — but on a per-asset-binding page it reads as the latter. Pressing the rainbow play on an empty/unbound stage does **nothing visible** — a dead feedback loop at the most inviting control on the page.
- **Image and SVG assets are dead ends.** `+ add → Image` creates a gray rectangle (`DEFAULT_STYLES.image`, `useAssetManager.ts:34`) that can never show an image: `AssetViewport.vue:58` requires `asset.imageSrc`, and **no control anywhere sets it** — `AssetPropertiesPanel.vue` has no imageSrc field. Worse, `+ add → SVG` creates an **invisible** asset (transparent bg, no `svgContent`, no input path) — it exists only as a phantom layer row and an unfindable click target on stage. Two of the five advertised asset kinds are broken affordances.
- **Keyboard access to the stage.** Assets are pointer-only: no tabindex, no arrow-key nudge, no Delete-key removal on the canvas. The `?` shortcuts modal exists (`EditorShell.vue:165`), but authoring itself has no keyboard path.

### Feedback loops and state

- Bind ignition: strong (the one ceremony). Un-bind/re-bind correctly does not re-fire (`AssetPropertiesPanel.vue:179-185`).
- Layer liveness: the bound-preset crayon chip landed (`AssetLayer.vue:42-53`) — the panel now reads which layers are alive. But it is **static**: it does not distinguish running from paused (the L.W11 "live filament" never landed), so the one runtime datum is still invisible.
- Asset lifecycle: add/delete/duplicate all **teleport** — plain `v-for`, no entrance/exit (`AssetViewport.vue:35-46`). On the animation engine's own authoring page, object arrival uses no animation (treatment gap #3, unlanded).
- Persistence surprise: the asset store is `useStorage` localStorage (`useAssetManager.ts:39`) with no TTL — a returning user finds last week's scene with zero explanation, and "reset" affordance is the dock trash (whose scope — selected? all? — is not labeled).

### Empty/loading states

- The empty state is duplicated verbatim in two places (stage card `AssetViewport.vue:13-29` + panel placeholder `AssetLayerPanel.vue:49-54`) — the treatment flagged this (gap #1) and it remains.
- Loading: `index.html:32` mounts only after `warmKfEngine()` resolves — a blank page with no skeleton for the whole engine warm. Fine on localhost; unacceptable if this ever ships standalone (moot under the fold).

### Mobile (375px capture)

The mobile shot is the weakest frame of the three:

1. **The page's only starting CTA is buried.** The "Compose a scene" card sits center-stage and the bottom sheet rides up over it — "+ Add a shape" is clipped to a half-visible sliver at the sheet edge. First-run on mobile = read a card whose button you cannot see.
2. **Transform handles are untouchable.** Resize handles are 10px (`w-2.5`, `AssetViewport.vue:78`), the rotate knob 14px on a 32px stem (`:90`). Both are ~1/4 of the 44px touch minimum; precise resize/rotate on touch is effectively impossible.
3. **The visible stage is a letterbox.** Sheet + dock consume ~45% of the 667px height; assets land at fixed pixel coords and can be dragged under the sheet with no recovery affordance except collapsing the sheet.
4. **Row controls are sub-target.** The eye/lock ghost buttons are `p-0.5` + `icon-sm` (~20px, `AssetLayer.vue:56-89`), the drag grip similar, in tightly packed 32px rows inside the sheet.
5. **Redundant copy spends scarce sheet space** — the panel placeholder repeats the stage card's message while the dock's "bounce" select (a third message) means something else entirely.

---

## 3. Aesthetic critique against the glass-ui system

**What's genuinely good.** The chrome consumption is idiomatic and disciplined: cartoon `Card` panels, `SegmentedTabs` as data through the sanctioned seam, glass `Select`/`Switch`/`ContextMenu`, the mono-caption telemetry voice everywhere (`text-mono-caption normal-case`), the shared two-tier graph paper untouched as the deepest layer. And the L.W11 signature half-landed *well*: the pointer-tracked gold key-light with registered `@property` interpolation (`App.vue:248-287`), the vignette framing the floor, and above all the **comet-tail ignition** — the bound preset's actual timing function sampled into an SVG path and self-drawn by the library's own `fromDrawSVG` (`App.vue:184-236`). That is the mathematics pillar done exactly right: the engine's math drawn back onto the page by the engine, no second writer, PRM-collapsed. It is the single most on-brand moment in the whole demo and **currently unreachable by any user**.

**Where it stays generic.**

- **The manipulation chrome is still dev-tool blue.** Selection outline `2px solid var(--primary)` (`AssetViewport.vue:150`), resize handles `border-primary` (`:78`), rotate knob/stem `border-primary`/`bg-primary/50` (`:90,93`), selected layer rail `border-primary` (`AssetLayer.vue:8`). The demo collapsed every motion surface onto the red motion authority (`--color-progress`); the most motion-centric page ignores it. This was the treatment's **named P0 system-coherence fix and it never landed** — selecting an asset still reads "generic vector editor," not "arming it for motion."
- **The empty state is the textbook centered card** — Lucide `Shapes` glyph, two sentences, outline button (`AssetViewport.vue:12-31`). The treatment's display-voice recast ("Pour something in." in Instrument Serif, off-center under the key-light pool — note `--mouse-y` defaults to 38% precisely to pool light in the upper third, `App.vue:256`) never landed, so the key-light pools behind a card that stayed dead-center. In the light theme the 9%-alpha gold wash is nearly invisible in all three captures — the atmosphere reads as *absent* unless you're in dark mode or moving the pointer.
- **The stale-font ghost survived at the source.** The treatment's fix landed only in the panel's *display fallback* (`AssetPropertiesPanel.vue:104` now says 'Instrument Serif') — but `DEFAULT_STYLES.text` still stamps `fontFamily: "Fraunces"` onto every new text asset (`useAssetManager.ts:30`), a face the system deleted. So new text renders in the browser's fallback serif, never Instrument Serif, and the render path's `?? 'var(--font-display)'` (`AssetViewport.vue:52`) is dead code. The one creative input that invites typing ships a broken default.
- **Raw hexes off the token system.** Asset defaults are Tailwind literals — `#6366f1` indigo, `#f43f5e` rose, text `#1e293b` (`useAssetManager.ts:24-36`). The rose is a near-miss of `--rainbow-red`; the indigo is exactly the `--primary` blue the system spent two tranches retiring; and `#1e293b` text is unreadable on the dark theme's floor. The playground's own raw material contradicts the crayon vocabulary the layer chips (correctly) consume (`AssetLayer.vue:153-161`).
- **A stray empty pane haunts the panel.** The laptop/desktop captures show an empty stamped glass box below the Assets card — chrome with no content rendered for a host with nothing to put there. Dead weight that reads as a rendering bug.

**Is it memorable? Does it dogfood?** The ignition + key-light are memorable; everything around them is a competent-but-generic layers/properties editor. Dogfooding is half-true: binding uses the real `AnimationGroup`/presets and the ignition uses `fromDrawSVG`, but the page's own UI motion (asset arrival, selection, reorder) uses none of the engine. Grade against the system bar: the plumbing is A-, the unrealized design is B+, the *experienced* page — undeployed, half-treated, mobile-hostile — is a C.

---

## 4. Ranked tasteful refinements (wave-shaped)

All on-system, no redesigns; the page's treatment already exists — most of this is landing its unlanded P0/P1 with the fold as the carrier wave.

1. **FOLD-1 — Promote to `scenes/compose/` (the identity fix; everything else rides it).** *What:* new scene dir wrapping today's `App.vue` body as `ComposeScene.vue` + `SceneExposedApi` + a group-playback adapter; register in `app/scenes.ts`; route the Assets tab through the machine's `extraControlTabs` projection instead of the standalone `extra-tabs` prop; delete `demo/playground/` (index.html + broken dist). *Where:* `demo/scenes/compose/`, `app/scenes.ts`, `demo/playground/*`. *Why:* the page's product truth (authorship) earns existence, but only the SPA gives it deployment, capture coverage, dock chrome, and an audience for the already-built ignition. Kills the broken standalone build as a side effect.
2. **CHROME-RED — Land the unlanded P0 motion-authority chrome.** *What:* `var(--primary)` → `var(--color-progress)` family at the four cited sites: selection outline (`AssetViewport.vue:150`), resize handles (`:78`), rotate knob/stem (`:90,93`), selected-row rail (`AssetLayer.vue:8`). *Why:* the named system-coherence fix from the approved treatment; selecting an asset should read "armed for motion." Shared-safe — nothing depends on the blue.
3. **FONT-SOURCE — Kill Fraunces at the source, not the mask.** *What:* `DEFAULT_STYLES.text.fontFamily: "Fraunces"` → delete the key (let `AssetViewport.vue:52`'s `var(--font-display)` fallback work) or set `'Instrument Serif'`; also retire the raw `#6366f1`/`#f43f5e`/`#1e293b` defaults onto the sanctioned ramp (e.g. `--rainbow-blue`/`--rainbow-red` resolved values; text color → `var(--foreground)`-derived so dark mode survives). *Where:* `useAssetManager.ts:24-36`. *Why:* the landed panel fix (`AssetPropertiesPanel.vue:104`) only masks the display; every new text asset still renders in fallback serif, and the defaults contradict the crayon system.
4. **DEAD-KINDS — Make Image/SVG real or remove them.** *What:* add an `imageSrc` (URL/file-pick) field and an `svgContent` textarea to `AssetPropertiesPanel.vue` for those kinds (the sanitizer already exists, `AssetViewport.vue:155-158`); until then, drop the two `DropdownMenuItem`s (`AssetLayerPanel.vue:23-28`). *Why:* today "Image" yields a permanently gray rect and "SVG" an invisible phantom — broken promises in the add menu, the page's front door.
5. **EMPTY-STAGE — Land the P1 empty-state recast, mobile-first.** *What:* keep the Card shell; content becomes one Instrument-Serif display line ("Pour something in.") + one mono sub-line + the button; anchor it in the **upper third** (where `--mouse-y: 38%` already pools the key-light, `App.vue:256`) so the mobile sheet can never occlude the CTA; delete the duplicate placeholder copy at `AssetLayerPanel.vue:49-54`. *Why:* fixes the worst mobile failure (buried CTA) and the most generic frame in one move, using composition the atmosphere already anticipates.
6. **TOUCH-TARGETS — Touch-size the transform chrome.** *What:* give handles a ≥44px invisible hit area (padded pseudo-element or a `@media (pointer: coarse)` size bump) while keeping the 10px visual; same for the eye/lock ghost buttons' hit areas (`AssetLayer.vue:56-89`). *Where:* `AssetViewport.vue:74-94` + `AssetLayer.vue`. *Why:* resize/rotate is currently impossible on touch; visual weight stays identical.
7. **ARRIVAL — Assets arrive, dogfooded.** *What:* on add/duplicate, a one-shot scale-and-settle entrance (feature-detected `document.startViewTransition` with per-asset `view-transition-name`, or the engine's own spring via the existing group — either honors the PRM bracket); exit fade on delete. *Where:* `AssetViewport.vue:35-46` + `useAssetManager.ts:54-74` call sites. *Why:* the engine's authoring page currently teleports its objects; arrival-with-weight is the cheapest remaining pillar win (treatment P2, unlanded).
8. **LIVE-FILAMENT + honest transport.** *What:* the bound-layer chip gains the running/paused distinction (the `.progress-dot` conic filament idiom, static-lit under PRM and when paused); relabel the dock select to its true meaning ("editing: bounce") or hide it in favor of per-asset binding; on play-with-nothing-bound, surface a nudge (see easter egg). *Where:* `AssetLayer.vue:42-53`, dock ribbon wiring. *Why:* closes the running-vs-paused blind spot and the dead play-button loop — the two remaining feedback holes.

---

## 5. The easter egg — "the searchlight"

**Press play on an empty (or fully unbound) stage, and the key-light goes looking for work.** The rainbow play button currently does nothing visible in that state — the deadest loop on the page. Instead: the already-pointer-tracked key-light (`--mouse-x/--mouse-y` are registered, transitioned properties — `App.vue:248-287`) performs a single 1.5s searchlight arc across the casting floor — driven by the engine's own spring/eased progress, not a hand-rolled rAF — and settles on the "+ Add a shape" CTA, which gives one warm pulse. One shot per attempt, PRM collapses it to an instant settle-on-CTA. It is discoverable by the exact user who needs it (the one who pressed play too early), it teaches the page's grammar (light = where the action is; the same light that later spotlights your bound creation), it costs ~20 lines against existing plumbing, and it is precisely in the foundry's voice: *the lights are looking for something to bring to life — give them something.*

---

## 6. Accessibility notes (from source)

- **PRM: exemplary.** The key-light smoothing, comet-tail fade, and ignition draw are all guarded — CSS `@media (prefers-reduced-motion: reduce)` (`App.vue:321-328`) + the JS `prefersReduced()` early-return collapsing ignition to a state flip (`App.vue:162-164, 214`). Decorative layers are `aria-hidden` + `pointer-events: none` (`App.vue:51-61`).
- **ARIA present where it landed:** eye/lock toggles carry state-aware `aria-label`s (`AssetLayer.vue:60,78`); the Assets panel is a proper gated `[role=tabpanel]` with `tabindex="0"` riding the same single-authority tab state as the built-ins (`App.vue:21-26`); `EditorShell` provides the single `<main>` landmark (`EditorShell.vue:61`).
- **Keyboard: the stage is a hole.** Canvas assets have no focus path — no tabindex, no arrow-nudge, no Delete; selection, transform, and reorder are pointer-only (`AssetViewport.vue:199`, `AssetLayerPanel.vue:144-176`). The properties inputs are reachable, so binding is keyboard-possible, but *placing/arranging* is not. If the fold lands, wire the scene-standard `registerShortcut` set (arrows = nudge, Delete = remove) as the floor.
- **Contrast risks:** hard-coded `#1e293b` default text color fails on the dark floor (`useAssetManager.ts:31`); the 30%-alpha swatch ring (`AssetLayer.vue:179`) is decorative-only (name text carries the info — acceptable); `--rainbow-yellow` as a 1-em swatch on light glass is borderline but paired with the preset-name text, so not information-bearing alone.
- **Selection visibility:** the 2px `outline` + 2px offset (`AssetViewport.vue:150-151`) doubles as the only selected-state indicator and is *not* a focus ring (no focus exists to ring); post-CHROME-RED it should meet 3:1 against both themes — verify the red on the dark floor.
- **Touch targets:** see mobile §2 — handles 10-14px, row buttons ~20px; both below WCAG 2.5.8 minimums.

---

## Verdict

**Grade: C** — a genuinely distinct product truth with the demo's single best on-brand moment (the engine drawing its own easing curve as an ignition comet-tail) — trapped in an undeployed, prod-broken shell, with the treatment's P0 coherence fixes unlanded, two dead asset kinds in the front-door menu, and a mobile empty state that hides its only CTA. **Fold into the SPA as `scenes/compose/` ("Compose")** — the capstone authoring scene — and land refinements 2-5 as the fold's design payload; kill the standalone app.
