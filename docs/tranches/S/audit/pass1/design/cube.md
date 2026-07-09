# Cube — design audit (Tranche S, pass 1)

> Inputs: `cube-mobile.png` (375px), `cube-laptop.png` (1280px), `cube-desktop.png` (1440px);
> source under `demo/scenes/cube/` + `demo/@/components/custom/orbital-drag/`;
> prior treatment `docs/frontend-design/demo/cube.md`; tokens `demo/@/styles/design-idioms.css`.
> Analysis only — no source modified.

---

## 1. Product truth

The cube page is the demo's only true 3D subject: a six-faced crayon die (CSS 3D
transforms, no WebGL) suspended over the engineering graph-paper field, impaled by
three axis lines, driven by THREE synchronized engine animations (`Rotations`,
`Matrix`, `Hover` — `useCubeAnimations.ts:10-14`) composed in one `AnimationGroup`,
and orbitable by hand through a quaternion-source-of-truth drag layer with analytic
inertia (`OrbitalDrag.vue:80`, `useOrbitalInertia`). It exists to prove keyframes.js
can animate arbitrary transform structure — `matrix3d` interpolation cell-by-cell via
the 4×4 matrix editor, `var()`-driven rotation keyframes (`useCubeAnimations.ts:62`),
and preset composition — while the orientation-coupled re-lit material
(`useCubeRelit.ts`) makes the physics *visible*. It doubles as the HOME hero's
backdrop subject (`CubeScene.vue:2-8`), so its rest state is the first pixels most
visitors ever see of the library.

## 2. Usability, affordances, interactability

### What a first-time user finds unaided
- The controls card (duration/delay/iterations/direction/fill/easing) and the
  Play/Reverse transport — conventional, labeled, discoverable.
- The animation-picker dock pill ("Rotations ▾") + reset/trash/rainbow-play — icon
  affordances, but recognizable transport grammar.
- Probably drag-to-orbit — the cube is the obvious center of mass and `cursor: move`
  (`OrbitalDrag.vue:348`) gives a weak hint on hover. On touch there is no hint at all.

### What is hidden (and this page hides its best material)
The scene's most impressive interactions are ALL invisible until stumbled upon:

| Affordance | Trigger | Any visible cue? |
|---|---|---|
| Orbit (quaternion drag + inertia glide) | pointer drag | `cursor: move` only |
| Axis-lock rotation | hold `X`/`Y`/`Z` while dragging (`OrbitalDrag.vue:193-212`) | none until already held (the P.W5.S3 axis-line bloom is a *confirmation*, not an *invitation*) |
| Axis translate | `Shift` + `X/Y/Z` + drag (`:198`) | none |
| Axis scale | `Ctrl/⌘` + `X/Y/Z` + drag (`:199`) | none |
| Roll the die | double-click the cube (`CubeTarget.vue:28`, `onRoll` `:231`) | none |
| ppmycota mode | click the blurred logo blob top-center (`CubeScene.vue:117-143`) | an unlabeled 32px blob |
| Matrix editor tab | select the "Matrix" animation first (DFA-gated conditional tab, `CubeScene.vue:145-155`) | none — the tab simply *appears* when the right animation is picked; the causal link is never taught |

The source itself concedes this: the axis-lock comment reads "a powerful affordance
that was, until now, completely invisible" (`CubeTarget.vue:183-188`) — the egg made
the lock legible *while held*, but nothing invites the hold. Pinch-zoom and Safari
gesture handling exist (`OrbitalDrag.vue:283-290`) and are likewise unadvertised.

### The rest state undersells the page
All three screenshots show the die at `rx 0° ry 0° rz 0°`: a single flat red rounded
square with a serif "1". The mount-time perspective tilt
(`changeGraphPerspectiveAnim`, `useCubeAnimations.ts:94-100`, 30° about (−1,1,0))
skews the plane but never reveals a second face — so the page named **cube** first
reads as **square**, and the entire lacquer/re-lit material system
(`CubeTarget.vue:381-466`) has nothing to model until the user drags. The one page
with real 3D hides its dimensionality at rest. (The prior treatment's step 5 — the
idle attitude drift replacing the spinner — was the unshipped remedy;
`docs/frontend-design/demo/cube.md:324-327`. The `Loader2` spinner also still exists
for the no-selection state, `CubeTarget.vue:30-37`.)

### Feedback loops that work
- Attitude readout `rx/ry/rz` ticks live with the drag (`CubeTarget.vue:126-133`) —
  excellent "the engine runs" proof.
- `--spin-energy` bloom + drop-shadow grow with angular speed and bleed off with the
  analytic decay (`useCubeRelit.ts:86-101`) — the physics made visible; genuinely good.
- Axis-line solid-stroke + bloom while an axis is locked (`CubeAxisLines.vue:43-87`).
- Roll suppresses re-entry and pointer input mid-tumble (`CubeTarget.vue:298-300`) — a
  correct gesture handoff.

### What's missing in the loop
- No grab acknowledgment: the prior treatment's `.cube--grabbed` press-beat +
  `cursor: grabbing` (plan step 4) never shipped; `cursor: move` never changes during
  drag.
- The attitude readout is anchored wrong: `.cube-attitude` is `position: absolute`
  (`CubeTarget.vue:470-482`) but its template ancestor (`CubeTarget.vue:2-6`) has no
  `position: relative`, so `left/bottom` resolve against a distant positioned
  ancestor. In both desktop shots the chip lands mid-screen, butted against the
  transport dock's left edge — it reads as a stray debug print, not a stage
  instrument; on mobile it's half-swallowed by the sheet.

### Mobile (375px shot) specifically
1. **The attitude readout is occluded** — "rx 0° ry 0° rz 0°" is clipped behind the
   open controls sheet's left corner (visible sliver at the sheet seam). Information
   the page treats as its signature readout is unreadable.
2. **The cube's lower half sits under the open sheet.** The hero-recede band exists
   only for the HOME landing (`CubeScene.vue:245-266`); on the cube route proper the
   subject centers in the full cell and the sheet covers roughly its bottom third —
   the axis origin and face-1's numeral baseline are cut.
3. **No touch path to the axis-lock family** — hold-X/Y/Z is keyboard-only, so the
   scene's richest control grammar simply does not exist on phones.
4. **The ppmycota trigger is a 32px unlabeled blob** (`h-8 w-8`,
   `CubeScene.vue:123`) — below the 44px touch floor, no `aria-label`, no visual
   identity beyond a blur.
5. **Double-click roll is unreliable on touch** — `@dblclick` on a
   `touch-action: none` surface whose pointerdown starts a drag; a double-tap will
   usually be eaten by the orbit gesture.

## 3. Aesthetic critique (against glass-ui + DESIGN.md)

**Typography** — strong and on-voice. Instrument Serif display numerals paired with
Fira Code drafting stamps (`face-axis-tag`, `CubeTarget.vue:421-434`) is exactly the
serif/mono instrument register the demo's language prescribes; `tnum` on both the tag
and the readout. The mono `duration/delay` labels in the controls card match.

**Color** — the six crayon primaries are tokenized (`--face-1…6`,
`CubeTarget.vue:162-173`) and worn in their proper register: vivid facets, muted
`--axis-x/y/z` frame. Two palettes, two jobs — the L.W11 verdict correctly executed.
The rainbow play button and the pink progress track tie back to the brand family.

**Motion quality** — the best in the demo *when touched*: quaternion orbit, EMA
velocity, closed-form decay glide, `ease-out-back` roll with the landing thunk
(`flashRoll`, `useCubeRelit.ts:104-113`), 160ms `--lit` interpolation via registered
`@property` (`CubeTarget.vue:277-285, 353`). At rest, motion is a 5px `idle-bob` —
timid for a physics instrument, and the generic `Loader2` throbber still fronts the
unselected state.

**Composition** — dead-center cube, generous paper field, controls column left: calm
and legible on desktop, but the misanchored attitude chip breaks the frame, and the
rest pose (one face, head-on) wastes the page's dimensional monopoly. The axis lines
at 0.75 opacity are confident enough; the origin sits behind the cube so the
coordinate-frame read survives.

**Distinctiveness / dogfooding** — the re-lit lacquered die under a pinned room light
is a genuine signature no other scene can copy, and the page dogfoods hard: three
grouped engine animations, a `var()` keyframe, `matrix3d` interpolation, the roll as
an ad-hoc `CSSKeyframesAnimation` (`CubeTarget.vue:246-259`), decay physics from the
LIGHT surface. Verdict: **memorable once engaged, generic at first glance** — the
static first frame (red square + form card) could be any tutorial; everything that
makes it unforgettable requires an uninvited gesture.

**Structure note (UX lens only):** `cubeTransformStore.ts` living in `app/` is the
mechanism behind a *good* UX behavior — orientation persists across home ↔ cube
(`CubeScene.vue:213-225`), so the die never snaps back when you navigate. The UX is
right; only the file's address is off (already logged elsewhere).

## 4. Ranked refinements (tasteful, on-system, wave-shaped)

1. **Showroom rest attitude** — WHAT: seed the initial transform with a classic
   three-quarter die pose (≈ rx −22°, ry 32°) so faces 1/2/5 and the lacquer gradient
   are visible at rest. WHERE: `cubeTransformStore.ts:13-20` initial `rotate` (the
   quaternion re-seeds from Euler on mount, `OrbitalDrag.vue:263-265`). WHY: the page
   reads CUBE in frame one; the re-lit material finally shows before the first drag;
   zero new machinery.
2. **Anchor the attitude readout to the stage** — WHAT: add `relative` to the
   CubeTarget root (`CubeTarget.vue:2-6`) so `.cube-attitude`'s `left:1rem/bottom:1rem`
   mean the stage's corner; on <lg, raise `bottom` above the sheet band using the
   existing `--dock-*` reserve tokens. WHERE: `CubeTarget.vue:470-493`. WHY: fixes the
   desktop dock collision AND the mobile occlusion with two lines, all on-token.
3. **A ghost gesture legend** — WHAT: one mono `--type-micro` muted line beside the
   readout: `drag orbit · hold x/y/z lock · 2×click roll`, fading out permanently
   after the first completed orbit (persist in the existing scene control store).
   WHERE: `CubeTarget.vue` template beside `.cube-attitude`; same
   `.readout-accent`/muted register. WHY: surfaces the page's entire hidden grammar
   at drafting-stamp proportion — an instrument's engraved legend, not a tutorial
   overlay.
4. **Grab beat + cursor grammar** — WHAT: `cursor: grab`/`grabbing` swap plus the
   already-designed `.cube--grabbed` micro-scale (0.98) on pointerdown, spring-back on
   release. WHERE: `OrbitalDrag.vue:346-352` (cursor) + a class toggle read from
   `pointer.isDragging` in `CubeTarget.vue`. WHY: the prior treatment's step 4, still
   unshipped; the cheapest "heavy object in hand" cue there is.
5. **Touch axis-lock chips** — WHAT: on coarse pointers only, render three tap-latch
   chips `X·Y·Z` (axis-colored, `.readout-accent` register) that set the same
   `pressedKeys` latch; the existing axis-line bloom confirms. WHERE:
   `CubeTarget.vue` near the readout; latch plumbing already exists
   (`onPressedKeys`, `CubeTarget.vue:189-194` → OrbitalDrag latch). WHY: restores the
   scene's richest control family to half its audience.
6. **Retire the throbber for an attitude drift** — WHAT: replace `Loader2`
   (`CubeTarget.vue:30-37`) with the ~12s two-axis engine-driven idle orbit (design
   doc step 5), PRM-gated like `idle-bob`. WHY: a precision instrument should breathe,
   not buffer; and the idle state becomes dogfood instead of a spinner.
7. **Label the ppmycota trigger** — WHAT: `role="button"`, `aria-label="ppmycota
   mode"`, `:focus-visible` ring, and 40px minimum hit area on touch. WHERE:
   `CubeScene.vue:120-125`. WHY: an interactive element currently invisible to
   keyboard and screen readers, sub-floor on touch.
8. **Teach the Matrix tab's existence** — WHAT: when the Matrix animation is selected
   and the conditional tab first materializes, pulse the new tab's underline once
   (existing `tab-trigger` transition tokens). WHERE: the `extraControlTabs`
   projection surface (`CubeScene.vue:145-155` seam). WHY: the DFA gating is correct
   but silent; one pulse converts an invisible state machine into a discoverable one.

## 5. Easter egg — "the calibration detent"

In the page's own drafting-instrument voice: when the user *hand-orbits* the die to
within ±2° of any exact face-on attitude (every Euler component near a multiple of
90°), the engine takes the last two degrees — a tiny `CSSKeyframesAnimation` nudge
settles it to the exact face (a magnetic detent "click"), the landed face's `--lit`
flashes to 1, and the attitude readout stamps that face's axis tag in its axis color
for a beat: `+Z ⌖`. Cheap: a threshold on the existing `euler` computed
(`useCubeRelit.ts:76-80`), the existing `flashRoll` channel, one short engine tween
(more dogfood); discoverable by anyone who tries to line the die back up — which
everyone does; delightful because the instrument *rewards precision*, which is the
whole page's thesis. PRM: skip the nudge, keep the stamp.

## 6. Accessibility notes (from source)

- **Reduced motion: good coverage** — `idle-bob` and the bloom/drop-shadow atmosphere
  are `prefers-reduced-motion` gated (`CubeTarget.vue:304-311, 443-466`); the roll
  rides the engine, which carries the library's reduced-motion snap.
- **Keyboard: the cube is unreachable.** OrbitalDrag's container has no `tabindex`;
  X/Y/Z only *constrain* an in-flight pointer drag (`OrbitalDrag.vue:276-277,
  193-212`), so a keyboard-only user cannot orbit at all. Arrow-key rotation on a
  focusable stage would close this.
- **The ppmycota trigger** is a click-handled `div` — no role, no label, no focus
  ring (`CubeScene.vue:120-125`).
- **The attitude readout is `aria-hidden`** (`CubeTarget.vue:128`) — defensible as
  decorative, but it is the page's only orientation report; an `aria-live="off"`
  visually-hidden mirror (or dropping `aria-hidden`) would let AT users know the die
  moved.
- **Contrast:** the readout value was deliberately deepened toward `--foreground` for
  AA (`CubeTarget.vue:468-482`); the face axis tags at `opacity: 0.62` muted-on-crayon
  (`:421-434`) are decorative-scale. The serif numerals are dark-on-vivid — fine on
  yellow/cyan/red, likely sub-AA on the blue face (dark glyph on saturated blue);
  worth a per-face numeral `color-mix` check if the numerals are treated as content.
- **Global key listeners** for X/Y/Z live on `window` (`OrbitalDrag.vue:276-277`) —
  verify the editable-target skip (the demo's `registerShortcut` convention) applies,
  or typing "x" in the duration field latches an axis lock.
