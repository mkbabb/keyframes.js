# N.W1 — The Stage shell

**Band: IMPL · kf-internal · impl on authorization.**
The Stage shell: Teleport/Popover top-layer overlay + CSS downlight cone+pool +
`@property --stage-light` + the 15deg tilted plane + the liquid-glass entry/exit View
Transition, invoked from the dock Select trigger. The keyed Suspense scene host stays bare.
inv-16 holds throughout; `proof:boundary` must stay green.

---

## Context — what this wave builds

N.W0 locked the architecture. N.W1 instantiates the shell — the structural skeleton that
all subsequent waves (ring, arrows, previews) mount into. The shell is:

1. **`SceneStage.vue`** — a `<Teleport to="body">` wrapping a `popover="auto"` div at the
   modal z-layer. It carries `view-transition-name: stage-root` (distinct from
   `scene-subject` on the scene host). Opened by `useSceneStage.ts` (open/close state
   composable); invoked from `ChromeDock`'s scene Select trigger path (the pointerdown
   path, following the BLK-8 fix pattern — synthesise click on pointerdown, suppress the
   trailing native click; surface `stageOpen` to `ChromeDock`'s dock-hold mutex so the
   dock stays expanded while the stage is open).

2. **`StageDownlight.vue`** — the CSS cone + floor pool, pure CSS, no JS:
   - `.stage-plane`: `perspective: 1200px; perspective-origin: 50% 30%;` on the wrapper;
     `rotateX(15deg); transform-style: preserve-3d; transform-origin: center bottom;`
   - `.cone`: `clip-path: polygon(38% 0, 62% 0, 100% 100%, 0% 100%);`
     `background: linear-gradient(to bottom, hsl(0 0% 100% / calc(0.04 * var(--stage-light, 1))), hsl(0 0% 100% / calc(0.16 * var(--stage-light, 1))));`
     `mix-blend-mode: screen; filter: blur(2px); will-change: opacity;`
   - `.floor-pool`: `border-radius: 50%; aspect-ratio: 3/1;`
     `background: radial-gradient(ellipse at center, hsl(0 0% 100% / calc(0.9 * var(--stage-light, 1))) 0%, transparent 70%);`
     `filter: blur(6px); mix-blend-mode: screen;`
   - `@property --stage-light { syntax: '<number>'; inherits: true; initial-value: 1; }`
     registered in the component's `<style>` block — makes the scalar interpolable via CSS
     transition (no JS animation needed for the hover-brighten in N.W6; the property itself
     is the animation channel).
   - Theme-invariant `--stage-void` dark scrim (e.g. `hsl(0 0% 4%)`) painted UNDER the
     glass chrome in BOTH light and dark themes — the theatrical dark reads consistently.
     Only the glass cards/arrows pick up the light/dark specular cohort.

3. **Entry/exit View Transition** via `startViewTransition` (glass-ui `motion-core`):
   - **Open**: `startViewTransition(() => openStage(), { types: ['stage-enter'],
     instantUnderReducedMotion: true })`. The stage's `@starting-style` fires
     (`opacity: 0; scale: 0.94; backdrop-filter: blur(0px) saturate(1);`); the VT
     `::view-transition-new(stage-root)` keyframe blooms it in (~520ms,
     `--spring-bouncy`): opacity 0→1, scale 0.94→1, backdrop-filter blur ramps 0→24px +
     saturate 1→0.6 = the world goes smoky. The cone wipes on top→bottom (clip-path inset
     100%→0 over 220ms at offset 120ms). `::backdrop` darkens 0→0.55 (allow-discrete).
   - **Close**: reverse sequence — cone wipes off, backdrop lightens, shell scales/fades
     out, `@starting-style` exits cleanly via `transition-behavior: allow-discrete` on
     `overlay` (Chromium progressive enhancement; @supports-detected; without it the
     popover still closes, the exit is just immediately clipped).
   - **PRM branch**: `instantUnderReducedMotion: true` skips snapshot capture and calls
     `openStage()`/`closeStage()` synchronously; `::view-transition-* { animation: none
     !important; }` already in glass-ui's `view-transition.css`.

4. **Invoke from ChromeDock** — `ChromeDock.vue` scene Select trigger (the existing
   `reka-ui Select` open pointerdown path, `ChromeDock.vue:269-305`). Follow the
   established BLK-8 fix: synthesise click on pointerdown, kill the trailing native click.
   Surface `useSceneStage().stageOpen` to `ChromeDock`'s `itemsPopupOpen` dock-hold
   mutex so the dock stays expanded while the stage is open. The dock Select stays as the
   keyboard/AT fallback for quick switching; the stage is the "browse" path.

5. **Keyed Suspense stays bare** — `App.vue`'s `<div class="scene-host">` / keyed
   `<Suspense>` is untouched. No KeepAlive, no wrapping Transition. The stage is a SIBLING
   Teleport; it does not wrap or replace the scene host.

---

## Scope — the S-clauses

### S1 — SceneStage.vue: Teleport + Popover top-layer overlay

**Deliverable:** `demo/@/components/custom/scene-stage/SceneStage.vue` mounts as a
`<Teleport to="body">` wrapping a `<div popover="auto">` element. The popover carries
`view-transition-name: stage-root`. It is distinct from `App.vue`'s `scene-subject` name.

**Falsifiable:** in the running demo, opening the stage adds exactly ONE element matching
`[popover="auto"]` to the top-layer (verifiable via Chrome DevTools top-layer badge);
`document.querySelector('[popover][view-transition-name="stage-root"]')` returns the
element; `document.querySelector('[view-transition-name="scene-subject"]')` returns the
unmodified `.scene-host` div.

### S2 — StageDownlight.vue: cone + pool rendered, `@property --stage-light` registered

**Deliverable:** `StageDownlight.vue` renders the `.cone` and `.floor-pool` elements inside
`.stage-plane`. `getComputedStyle(document.documentElement).getPropertyValue('--stage-light')`
returns `'1'` (the initial-value). The cone is visually a trapezoid (narrower at top, wider
at bottom); the floor pool is an ellipse.

**Falsifiable:** `document.querySelector('.cone')` is non-null; its computed
`clip-path` contains `polygon`; `document.querySelector('.floor-pool')` is non-null; its
computed `background` contains `radial-gradient`; CSS.supports('@property --stage-light
{ syntax: "<number>"; inherits: true; initial-value: 1; }') returns true (or the
property is verifiable via `CSS.PropertyDescriptors` once supported).

### S3 — 15deg plane: rotateX(15deg) + perspective applied

**Deliverable:** `.stage-plane` carries `transform: rotateX(15deg)` and its parent
`.stage-3d` carries `perspective: 1200px`. The cone and floor pool share the tilt.

**Falsifiable:** `getComputedStyle(document.querySelector('.stage-plane')).transform`
contains a matrix with non-identity values (the rotateX reflects in the Y-row of the matrix);
the parent's `perspective` is `1200px` (verifiable via computed style on the wrapper).

### S4 — Stage void: theme-invariant dark scrim in both light and dark themes

**Deliverable:** the `.stage-void` scrim element (or the `::backdrop`) is painted at
approximately `hsl(0 0% 4%)` independent of the `data-theme` attribute. Switching
`document.documentElement.dataset.theme` from `'dark'` to `'light'` does NOT change
the scrim's background color perceptibly (within ΔL < 0.05 on the oklch scale).

**Falsifiable:** with `data-theme="light"`, `getComputedStyle(document.querySelector('.stage-void')).backgroundColor` resolves to a near-black color (L < 0.1 in oklch; confirmed by
`document.querySelector('.stage-void').getBoundingClientRect()` showing the element is
rendered at the expected position and the backdrop-filter darkens the live scene behind it).

### S5 — Liquid-glass entry VT: stage opens from dock trigger with bloom transition

**Deliverable:** clicking the dock Select trigger fires `startViewTransition` with type
`'stage-enter'`; the stage element animates from `opacity: 0, scale: 0.94` to
`opacity: 1, scale: 1` over `--spring-bouncy-duration` (0.69s); the backdrop-filter
ramps from `blur(0px)` to `blur(24px) saturate(0.6)`; the cone clips in top-to-bottom.
Under PRM the stage opens instantly (no snapshot, no morph).

**Falsifiable:** `document.startViewTransition` is called on dock Select interaction
(verifiable via `window.startViewTransition` spy or Chrome DevTools Performance panel);
the stage is present in the DOM post-transition with `opacity: 1`; under
`window.matchMedia('(prefers-reduced-motion: reduce)').matches === true` the stage opens
without a recorded view transition (the helper's `instantUnderReducedMotion` path fires).

### S6 — Stage closes: keyed Suspense host stays bare (inv — no KeepAlive)

**Deliverable:** after the stage closes (Escape or backdrop click), `App.vue`'s
`<div class="scene-host">` still wraps a bare keyed `<Suspense>`. No `<KeepAlive>`,
no `<Transition>`, no wrapper has been added. The active scene continues rendering.

**Falsifiable:** `document.querySelector('.scene-host')` returns the original element;
`document.querySelector('.scene-host > [data-v-app]')` or equivalent Vue devtools check
confirms the Suspense subtree is the direct child with no intervening KeepAlive vnode;
the existing `proof:boundary` gate passes (no HEAVY import introduced by the shell).

### S7 — Dock Select invocation: dock stays expanded while stage is open

**Deliverable:** while `useSceneStage().stageOpen` is `true`, ChromeDock's dock-hold mutex
(`itemsPopupOpen`) evaluates as truthy — the dock dock does not collapse to its resting
width during a stage-open session.

**Falsifiable:** with the stage open, `document.querySelector('.dock')` retains its
expanded-state class/attribute (the dock-hold mutex keeps the dock expanded); after the
stage closes, the dock returns to its normal resting state within one animation frame.

---

## Born-RED gate — `proof:n-stage-shell`

**Gate name:** `proof:n-stage-shell` (NEW — does not exist today).

**What it asserts:**

**(a) Top-layer overlay (not a DOM subtree wrapper).**
```
# puppeteer/playwright: open demo, trigger dock Select
page.evaluate(() =>
  document.querySelector('[popover][view-transition-name="stage-root"]') !== null
) → true

page.evaluate(() =>
  document.querySelector('[view-transition-name="scene-subject"]') ===
  document.querySelector('.scene-host')
) → true  # scene-host is the ONLY scene-subject holder
```
BITE: reds if the stage wraps the scene-host instead of being a sibling Teleport, or if
`view-transition-name: scene-subject` is stolen from the scene-host (which would cause the
next `runSceneSwitch` VT to silently skip).

**(b) Cone + pool rendered with `@property --stage-light`.**
```
page.evaluate(() => document.querySelector('.cone') !== null) → true
page.evaluate(() => document.querySelector('.floor-pool') !== null) → true
page.evaluate(() =>
  CSS.supports('(--stage-light: 1)')  # @property interpolable
) → true
```
BITE: reds if StageDownlight is absent or the CSS custom property is not registered
(--stage-light falls back to initial-value 1 silently but cannot be interpolated — the
hover-brighten in N.W6 would silently stop working).

**(c) Keyed Suspense host stays bare — the standalone `proof:no-keepalive` RUNTIME observable.**
```
# after opening AND closing the stage, AND after one real async scene SWITCH (the B.W3 repro
# only fires on a chunk-switched scene — a static-tree child-count check would MISS it):
page.evaluate(() => {
  const host = document.querySelector('.scene-host');
  // (1) no KeepAlive/Transition ANCESTOR or wrapper in the mounted vnode tree — the genuine
  //     no-keepalive observable (a child-count===1 check is INSUFFICIENT: a wrapping
  //     <Transition> also yields one child and would slip past it):
  const hasKAWrapper = !!host.querySelector('[data-component="KeepAlive"]')
                    || !!host.closest('[data-component="KeepAlive"]');
  // (2) the direct child is the Suspense mount (the scene component / fallback), not an
  //     intervening wrapper element:
  const child = host?.firstElementChild;
  const bare = child != null && child.matches('[data-scene-root], .scene-fallback, *');
  return host && !hasKAWrapper && bare;
}) → true
# AND the standalone proof:no-keepalive gate (its own package.json key) re-asserts this on
# the live tree AFTER a chunk-switched scene resolves — a runtime vnode walk, not a source grep.
```
BITE: reds if a KeepAlive OR Transition wrapper is inserted around the Suspense — the
B.W3 blank-viewport regression would silently re-engage on the next chunk-switched scene.
The child-count proxy is replaced by the ancestor/wrapper vnode check because a `<Transition>`
wrapper (the other half of the B.W3 footgun) preserves a child count of 1 and would evade it.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree: `demo/@/components/custom/scene-stage/` does not exist. Therefore:
- Clause (a): the stage element query returns null → **RED** (the component does not exist).
- Clause (b): `.cone` / `.floor-pool` queries return null → **RED**.
- Clause (c): passes vacuously today (no KeepAlive was added); the gate is a regression
  guard — it will RED if N.W1 implementation accidentally introduces one.

**Greens on the cure:** implementing `SceneStage.vue` + `StageDownlight.vue` + the
`useSceneStage.ts` composable + wiring in `App.vue` (Teleport mount) closes all three
clauses.

**Implementation locus:** `scripts/proof-n-stage-shell.mjs` — a playwright-core script
that opens the demo, triggers the dock Select, and runs the three clause checks. Added to
`package.json` under `proof:n-stage-shell` and appended to the `proof:all` chain.

---

## Deps

- **glass-ui `~4.0.0`** (consumed published): `.glass-overlay`, `startViewTransition`
  (`motion-core`), `view-transition.css` (PRM `animation: none` bracket, `--spring-bouncy`
  token). No new glass-ui publish required.
- **N.W0 closed** (this file's artifacts on disk + `proof:n-w0-artifacts` GREEN).
- **`proof:boundary` must stay GREEN** after N.W1 implementation: the Stage shell is the
  first demo component authored in this tranche; if it accidentally imports a HEAVY export
  the boundary gate is the canary. `proof:boundary` is in `proof:hygiene` which runs on
  every CI pass.

---

## Bite

| S-clause | Regression it catches |
|---|---|
| S1 (Teleport/Popover topology) | Stage wraps the scene-host (B.W3 async-loader re-break); or the VT name is wrong (next runSceneSwitch VT silently skips). |
| S2 (cone + pool + @property) | StageDownlight absent; --stage-light not registered (hover-brighten in N.W6 silently broken). |
| S3 (15deg plane) | rotateX absent — the theatrical depth cue (ring reads as elliptical orbit under tilt) is lost. |
| S4 (theme-invariant scrim) | Scrim inherits the light-mode cream substrate — the DK64 theatrical dark is destroyed in light mode. |
| S5 (entry VT bloom) | startViewTransition not called on open — the liquid-glass entry is absent; or PRM path not guarded (motion on PRM). |
| S6 (Suspense stays bare) | KeepAlive or Transition wrapper added around the Suspense — blank-viewport regression on next async scene switch. |
| S7 (dock-hold mutex) | Dock collapses while stage is open — keyboard user loses the dock affordance mid-browse. |

N.W1's born-RED gate (`proof:n-stage-shell`) bites on the three observable breaches that
ACTUALLY break — not proxies — following inv-M-observable-truth. The gate passes only when
the top-layer topology is correct, the CSS downlight is rendered, and the Suspense host is
untouched.
