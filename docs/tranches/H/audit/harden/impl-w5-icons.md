# impl-w5-icons — the Build/icons lane (S1-consumer + S2 + BLK-7)

**Lane:** H.W5 ICONS. Consumes the Foundation seam (`SceneDescriptor.icon` +
the `?component` svgLoader plugin + the `*.svg?component` ambient decl, all DONE
in `impl-w5-foundation.md`). Delivers **S2** (the survivor inline-SVG
`currentColor` family + the PNG KILL), **S1-consumer** (populate
`SceneDescriptor.icon`; rewire `ChromeDock.vue` off `<img :src>`/`sceneIcons`
onto `<component :is="scene.icon">`), and **BLK-7** (the favicon re-point in the
SAME motion as the PNG KILL). tsc-clean; `npm run gh-pages` green; NO git commit.

---

## S2 — the authored survivor icon family (`assets/icons/*.svg`)

One hand-authored glyph per non-home survivor (the resolved survivor set:
`cube, amiga, square, easing, spring, sequence, motion-path` — 7). Each is
`viewBox="0 0 32 32"`, `fill="none"`, `stroke="currentColor"`, stroke-width
2.5–3, `stroke-linecap="round"` `stroke-linejoin="round"`, ZERO baked
`hsl(`/`rgb(`/`#hex` on any stroke/fill (the `currentColor` family; endpoint /
texture fills are pinned `fill="currentColor"`):

| icon | concept | shape |
|---|---|---|
| `cube.svg` | iso outline | isometric cube hexagon outline + the three back-edge lines to the center vertex |
| `amiga.svg` | checker-sphere | wireframe globe (circle + meridian ellipse + equator) with TWO opposing quadrant cells filled `currentColor` → the Amiga boing-ball checker texture (the photographed PNG, now a vector glyph) |
| `square.svg` | tilted card | a 16×16 `rounded-rect` `rotate(15 16 16)` |
| `easing.svg` | the curve | the EXEMPLAR shape preserved verbatim, the only edit is the baked `hsl(248,88%,71%)` → `currentColor` on the path AND both endpoint dots (the wart the wave names dies); dots `fill="currentColor" stroke="none" opacity="0.4"` |
| `spring.svg` | damped sine settling to a baseline | a decaying oscillation curve converging onto a low-opacity dashed baseline at y=16, anchored by an origin dot |
| `sequence.svg` | staggered ascending bars | four progressively-taller bars on a faint baseline (the `stagger` distribution) |
| `motion-path.svg` | scaled PATH_D loop + traveller | the SAME `PATH_D` the scene authors (`motionPathGeometry.ts:17`), scaled from its `0 0 400 400` author space into the 32 glyph via a `<g transform>` (the most DRY icon — ONE geometry source), dashed track + a filled traveller dot. `vector-effect="non-scaling-stroke"` keeps the stroke at glyph width despite the 0.083 scale |

**The easing-icon rename:** `easing-icon-sm.svg` → `easing.svg` (the canonical
bare-id specifier the Foundation import shape uses: `@assets/icons/easing.svg
?component`). The old file is DELETED in the same motion (no legacy beside the
replacement).

**MEASURE-FIRST visual verify (browser, light + dark):** rendered all 7 at dock
size (16px) and large (72px) on both `#f7f7f8` and `#15151b` panes. Every glyph
inverts correctly with the host text color — confirming the inline-SVG
`currentColor` reference mechanism themes (the G4 theming clause the `<img>`
swap alone fails). The amiga checker + the motion-path dash were tuned from the
first render so both read at 16px.

### The PNG KILL (S2 + idiom A — the file IS the source)
DELETED in one motion (no surviving raster screenshot lineage, no `-lg`
scalability need under a vector family):
- `assets/icons/cube-icon-sm.png`, `amiga-icon-sm.png`, `square-icon-sm.png`
  (the 3 dock `-sm` rasters)
- `assets/icons/cube-icon-lg.png`, `amiga-icon-lg.png`, `square-icon-lg.png`
  (the 3 orphan `-lg`, imported by nothing — 60.6 KB of dead binaries)
- `assets/icons/easing-icon-sm.svg` (renamed → `easing.svg`)

`assets/icons/` now holds EXACTLY: the 7 scene `*.svg` + `favicon.svg`. ZERO
`.png` (modulo the single allow-listed favicon, which is itself an SVG here).

---

## BLK-7 — the favicon resolution (re-point, option (a))

`demo/app/index.html:14` was `<link rel="icon" href=".../cube-icon-sm.png">` —
i.e. the live favicon WAS one of the three `-sm` PNGs S2 deletes (the BLK-7
contradiction). RESOLVED via **option (a)**: re-pointed in the SAME motion to a
checked-in `assets/icons/favicon.svg`:

```html
<link rel="icon" type="image/svg+xml" href="../../assets/icons/favicon.svg" />
```

- `favicon.svg` is the cube glyph (continuity with the prior cube favicon).
- A favicon renders as a STANDALONE document (NO host-page `currentColor`), so
  it is the ONE place in the family that carries an EXPLICIT color — themed to
  the browser chrome via an embedded `<style>` `prefers-color-scheme` block
  (`#4c3ee8` light / `#a99cff` dark). This is the deliberate allow-listed
  exception; it does NOT belong to the `currentColor` scene-icon family the
  G1/G4 gate iterates.
- **Verified the 404-guard (G3):** the built `dist/gh-pages/index.html` resolves
  `rel="icon" type="image/svg+xml" href="./assets/favicon-<hash>.svg"` and the
  hashed file emits (`favicon-lzj0QcBq.svg`, 0.87 kB). `rel=icon` resolves to an
  existing file — no 404.

---

## S1-consumer — `SceneDescriptor.icon` populated + `ChromeDock.vue` rewired

### `demo/app/scenes.ts`
Imported the 7 inline-SVG components via the `?component` seam and assigned
`icon:` on each non-home descriptor (alongside `id/label/superKey/component`):

```ts
import CubeIcon from "@assets/icons/cube.svg?component";
// … AmigaIcon, SquareIcon, EasingIcon, SpringIcon, SequenceIcon, MotionPathIcon …
{ id: "cube", label: "Cube", superKey: "Cube", icon: CubeIcon, component: lazyScene(…) }
```

`homeScene` carries NO `icon` (the single `<Home>` fallback). Every other
descriptor defines `icon` → an icon-less scene is structurally unshippable
(`proof:scene-icons` coverage clause, the permanent D8 cure).

### `demo/@/components/custom/dock/ChromeDock.vue`
- DELETED the 4 image imports (`cubeIcon`/`amigaIcon`/`squareIcon`/`easingIcon`)
  + the dock-keyed `const sceneIcons: Record<string, string>` map (the D8 drift
  root cause — the parallel string-keyed registry that the four new scene
  authors forgot to update).
- Widened the `scenes` prop type from `{ id; label }[]` to
  `{ id; label; icon?: Component }[]` so the descriptor `icon` flows through
  (`App.vue:4` already binds `:scenes="scenes"` — the full `SceneDescriptor[]`).
- Added a `currentIcon` computed (`props.scenes.find(s => s.id ===
  currentSceneId)?.icon`) for the trigger + collapsed-pill sites (which key off
  `currentSceneId`, not a scene object).
- Replaced the THREE `<img :src="sceneIcons[…]">` render sites with
  `<component :is="…" class="icon-sm shrink-0 text-muted-foreground" />`:
  - trigger (`DockSelectTrigger`): `<component v-if="currentIcon" :is>` else
    `<Home v-else>` (the single home fallback).
  - dropdown item (`v-for="scene in scenes"`): `<component v-if="scene.icon"
    :is>` — no `<Home>` here (the `scenes` loop excludes home, and every
    surviving scene now HAS an icon, so the former no-fallback gap that left an
    unknown scene icon-less is structurally closed).
  - collapsed `#collapsed`: `<component v-if="currentIcon" :is>` else
    `<Home v-else>`.
- `<Home>` is RETAINED for: the explicit home `SelectItem` (its real icon) + the
  two `v-else` fallbacks (which now only fire on the home id). The import stays.

The `icon-sm` idiom (design-idioms.css `@utility icon-sm` = `size-4` +
`& svg { size-4 }`) sizes the inline `<svg>` root to 16px matching the dock's
`<Home>` glyph; `text-muted-foreground` provides the `currentColor` the icons
stroke against.

---

## Verification

- `tsc --noEmit` → clean (exit 0), BOTH before and after the post-render
  amiga/motion-path tuning.
- `npm run gh-pages` → built green (`✓ built in ~1.4s`); the 7 `?component`
  imports resolve through the svgLoader seam; `favicon.svg` emits hashed; the
  built `index.html` `rel=icon` resolves (no 404).
- **`currentColor` survives the SVGO pass** — `grep currentColor
  dist/gh-pages/assets/*.js` HITS, confirming the Foundation's
  `convertColors:false` config kept the theming faithful into the build (G4 the
  authority over G1).
- **Shape contract (G1):** each of the 7 scene icons asserts
  `viewBox="0 0 32 32"` + `fill="none"` + ≥1 `stroke="currentColor"` and ZERO
  baked `hsl(`/`rgb(`/`#hex` (verified by grep). The favicon's explicit hue is
  the allow-listed exception (standalone-document render).
- **No dead refs:** repo-wide grep for the killed file names over
  `*.vue/*.ts/*.mjs/*.html/*.css/*.json` (excl. `node_modules`, `dist`, `docs`)
  → only the two NEW prose comments. (The `docs/tranches/E/audit/lighthouse/
  *.json` hits are FROZEN tranche-E audit artifacts capturing a past run's
  asset URL — inert historical JSON, not live code/build refs, out of lane.)

## Authored icons (final)
`assets/icons/{cube,amiga,square,easing,spring,sequence,motion-path}.svg` (the
7-icon survivor family) + `assets/icons/favicon.svg` (the BLK-7 re-point).
DELETED: 6 PNGs (`{cube,amiga,square}-icon-{sm,lg}.png`) + `easing-icon-sm.svg`.

## Notes for the gate lane (H.W8)
- `proof:scene-icons` G3 should allow-list EXACTLY the favicon path named in
  `index.html` (`assets/icons/favicon.svg`) and assert `rel=icon` resolves.
- The G1 `currentColor`/no-baked-color family check should iterate the 7 SCENE
  icons and EXCLUDE `favicon.svg` (the standalone-document allow-listed
  exception that legitimately carries an explicit `prefers-color-scheme` hue).
- G4 (computed stroke == host `currentColor` in `.dark` + light) is the
  authority and is satisfiable: the inline `<component :is>` render + the
  `convertColors:false` SVGO config keep the runtime stroke == `currentColor`.
