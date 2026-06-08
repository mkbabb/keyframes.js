# impl-w5-foundation — the Foundation lane (scenes.ts + router.ts owner)

**Lane:** H.W5 FOUNDATION. Owns the STRUCTURAL files the Build lanes must NOT
touch: `demo/app/scenes.ts`, `demo/app/router.ts`. Delivers **S1-infra**
(the inline-SVG seam + `SceneDescriptor.icon`) and **S3-merge** (Discrete→Spring
fold + the `springLinearStops` 2→1 composable). The Build/icons + Build/scene
lanes BIND to this note. tsc-clean (`tsc --noEmit` AND `check:lib`); `npm run
gh-pages` builds green; NO git commit.

---

## S1-infra — the inline-SVG reference seam (DONE)

### (a) devDep
`package.json` devDependencies: added `"vite-svg-loader": "^5.1.0"`
(installed `5.1.1`; pulls `svgo`). kf-OWNED demo build tooling (inv-16) — NOT a
glass-ui handoff.

### (b) the `svgLoader()` plugin entry — `vite.config.ts`
`import svgLoader from "vite-svg-loader";` and a single configured instance
folded into `defaultPlugins` (so it lands in dev / gh-pages / playground —
every mode that serves the demo and resolves `.svg?component` imports; inert in
the library `production` build, which imports no SVG):

```ts
const svgLoaderPlugin = svgLoader({
    defaultImport: "component",
    svgoConfig: {
        plugins: [
            {
                name: "preset-default",
                params: { overrides: { convertColors: false, removeViewBox: false } },
            },
        ],
    },
});
const defaultPlugins = [Vue(), svgLoaderPlugin];
```

`convertColors:false` + `removeViewBox:false` (WV-W5-MED-2) keep SVGO from
rewriting `currentColor` / dropping the `viewBox` — the theming the whole wave
is for. Where the file-shape check (G1) and the computed-stroke check (G4)
disagree, G4 is the authority; these two flags keep the emitted SVG faithful to
what the browser computes.

### (c) the `*.svg?component` ambient type decl — `src/env.d.ts`
Authored alongside the existing `*.vue` ambient decl (`src/` is always in the
tsconfig `include`):

```ts
declare module "*.svg?component" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
```

(`vite-svg-loader` ALSO ships an identical-shape decl in its own
`index.d.ts`; the two are compatible and TS dedupes them — tsc is clean. The
contract explicitly required authoring ours, and `src/env.d.ts` is the
guaranteed-included home regardless of `node_modules` resolution.)

### (d) `SceneDescriptor.icon` — `demo/app/scenes.ts`
Added `icon?: Component` to the interface (the `Component` type was already
imported). Left the **per-scene icon population to the Build/icons lane** (it
authors the SVGs first). The exact import + assignment shape the Build lane uses
WITHOUT touching the interface:

```ts
// at the top of scenes.ts:
import CubeIcon from "@assets/icons/cube.svg?component";
import AmigaIcon from "@assets/icons/amiga.svg?component";
// … one per survivor …

// then in each descriptor literal (alongside id/label/superKey/component):
{ id: "cube",  label: "Cube",  superKey: "Cube",  icon: CubeIcon,  component: lazyScene(…) },
{ id: "amiga", label: "Amiga", superKey: "Amiga", icon: AmigaIcon, component: lazyScene(…) },
```

- The `@assets` alias already resolves to `/assets` (vite.config.ts +
  tsconfig `paths`), so `@assets/icons/<name>.svg?component` is the canonical
  specifier. The `?component` query routes through the svgLoader seam → an
  inline-`<svg>` SFC (themable), NOT an `<img :src>` URL (theme-blind by
  construction — the stage-4 truth).
- The **home** descriptor (`homeScene`, id `"home"`) carries NO `icon` — the
  dock falls back to `<Home>` for it ALONE (the explicit single fallback). Every
  OTHER (non-home) descriptor MUST define `icon` (`proof:scene-icons` coverage),
  so an icon-less scene is structurally unshippable.
- The dock render seam (Build lane, in `ChromeDock.vue`):
  `<component :is="scene.icon" class="size-5 text-muted-foreground" />` for any
  scene with an `icon`; `<Home>` only when `scene.id === HOME_SCENE_ID` (or
  `!scene.icon`). DELETE the old `sceneIcons` `Record`, the 4 PNG/SVG `<img>`
  imports, the `<img :src>` sites (`:171-172,194,210-211`), and the now-dead
  `<Home>` no-icon fallback. The dock already iterates `props.scenes`
  (`v-for="scene in scenes"`), so the icon is single-sourced off the descriptor.

---

## The final SURVIVOR SET (S2 authors icons for these only)

The pertinence verdict landed in scenes.ts/router.ts (S3 + the lead REBUILD
calls). After the merge:

- **scenes** array (`scenes.ts`), in order:
  `cube, amiga, square, easing, spring, sequence, motion-path` (7).
- **allScenes** = `[home, …scenes]` → home + the 7 = **8 descriptors**.
- **routes** (`router.ts`): `/, /cube, /amiga, /square, /easing, /spring,
  /sequence, /motion-path` + the catch-all redirect. NO `/starting-style`.
- `starting-style` is GONE as a scene id / route / descriptor (merged into
  spring). The surviving NEW-mode set = `{ spring, sequence, motion-path }`
  (`proof:scene-parity` structural membership, WV-W5-LOW-2 — NOT a magic
  integer).

**Icon authoring set (S2, Build/icons lane):** one `*.svg?component` per
NON-home descriptor →
`cube, amiga, square, easing, spring, sequence, motion-path` (7 icons).
`home` keeps `<Home>` (no SVG). Discrete needs NO icon (merged).
[The square + amiga survivor calls are RESOLVED REBUILD by the lead verdict, so
both KEEP their route/descriptor — they remain in the survivor set above and
EACH need an icon. The Build/scene lanes own those rebuilds (square =
SpringProgress-per-axis drag; amiga = sphere drag + decay()); this Foundation
lane left their scenes.ts descriptors + routes intact.]

---

## S3-merge — Discrete→Spring fold (DONE)

### The spring sub-view structure (Build/scene lanes bind here)
The Spring scene now hosts **two views of one spring curve** under its EXISTING
single `ScenePlayback` registration (NO new scene, NO second adapter):

- `demo/app/scenes/SpringScene.vue` — the host. A segmented view switcher
  (`role="tablist"`, "Live solver" | "Discrete transition") toggles
  `demo.view` (`"solver" | "discrete"`); the stage renders
  `<SpringTarget v-if="solver">` else `<StartingStyleTarget>`. The scene
  `provide(SPRING_DEMO_KEY, demo)` unchanged; the `defineExpose`
  (`animationGroup`/`scenePlayback`/`autoPlays`/`tabsTrigger`/`tabsContent`/
  `ribbonContent`/`extraControlTabs`) unchanged EXCEPT `ribbonContent` is now
  **view-aware**: solver → Play/Re-seat/Reset transport; discrete →
  Reveal/Dismiss (`demo.toggleDiscrete`).
- `demo/spring/StartingStyleTarget.vue` — SURVIVES, now a presentational
  discrete-transition card. It injects **`SPRING_DEMO_KEY`** (from
  `./springKeys`, NOT the deleted `STARTING_STYLE_DEMO_KEY`).
  Reads `demo.visible` / `demo.toggleDiscrete`; its preset buttons drive the
  SHARED `demo.response` / `demo.dampingFraction` (one solver, two views — the
  rail sliders and the discrete preset stay in lockstep). The `@starting-style`
  / `allow-discrete` CSS, the `--spring-ease`, the copy artifact, and the PRM
  guard all survive in its `<style scoped>`.
- `demo/spring/useSpringDemo.ts` — gained the merged sub-view state:
  `view: Ref<"solver"|"discrete">`, `visible: Ref<boolean>`, `toggleDiscrete()`
  (folded from the deleted `useStartingStyleDemo`). They round-trip within the
  spring scene's existing registration.

### REMOVED in one motion (no legacy alias)
- `demo/app/scenes/StartingStyleScene.vue` (deleted)
- `demo/spring/useStartingStyleDemo.ts` (deleted)
- `demo/spring/startingStyleKeys.ts` (deleted — `STARTING_STYLE_DEMO_KEY`)
- the `id:"starting-style"` descriptor in `scenes.ts`
- the `/starting-style` route in `router.ts`
- the nav entry — automatic (the dock iterates `props.scenes`; removing the
  descriptor removes the nav entry single-source)

### The `springLinearStops` 2→1 fold — the composable PATH
**Composable:** `demo/spring/useSpringLinearStops.ts`
```ts
export function useSpringLinearStops(
    response: MaybeRefOrGetter<number>,
    dampingFraction: MaybeRefOrGetter<number>,
): ComputedRef<string>
```
The ONLY actual `springLinearStops(` CALL-site is now this composable
(`useSpringLinearStops.ts`). Consumed by BOTH the rail view
(`SpringSidebar.vue` — `useSpringLinearStops(() => demo.response.value, () =>
demo.dampingFraction.value)`) AND the discrete view (`StartingStyleTarget.vue`
— same shared params). The former 2 call-sites (`SpringSidebar.vue:130` +
`StartingStyleTarget.vue:95`, WV-W5-HIGH-1) are folded to ONE.
`grep "springLinearStops(" demo/` → 1 call + doc/template/CSS prose only; the
`≤1` "spring-local fold" gate reads ONE.

**NOT touched (WV-W5-HIGH-1):** `springTimingFunction` (6×-surfaced, intentional,
NOT a DRY defect). The Spring + Discrete contract-anim transport hosts still use
`springTimingFunction({...})` directly — it returns a typed `Easing { fn, css }`
whose `.css` IS the `linear()` literal that serializes verbatim (the H.W0-aligned
belt: a registry-free faithful CSS twin, no `serializeEasing` throw). This is the
already-emitted `linear()` artifact the contract names — no second emission.

---

## Gate / cross-lane notes for the Build + gate lanes

- **`proof:scene-icons`** — coverage clause now structurally satisfiable: every
  non-home descriptor gets `icon` (Build/icons lane). The seam (inline-SVG via
  `?component`) is the theming reference mechanism G4 demands.
- **`proof:scene-parity`** — `router.ts` has NO `starting-style` route;
  `scenes.ts` has NO `starting-style` descriptor; surviving new-mode set =
  `{spring, sequence, motion-path}`; `springLinearStops(` call-site count = 1.
  All GREEN structurally after this lane.
- **BLK-7 (favicon)** — OUT of this Foundation lane. `index.html:14`'s
  `cube-icon-sm.png` re-point + the `-sm`/`-lg` PNG KILL belong to the
  Build/icons lane (S2). Foundation did not touch `index.html` or `assets/`.
- **Two gate scripts carry stale-but-INERT `starting-style` references** (NOT
  edited — out of Foundation scope; H.W8 / gate-lane territory; neither breaks):
  - `scripts/proof-demo-elevate.mjs:168` reads `StartingStyleScene.vue` (now
    deleted) — `read()` returns `""` for a missing file (graceful), and the
    assertion's real checks (`exists("demo/spring/StartingStyleTarget.vue")` +
    `@starting-style` / `springLinearStops` / `CopyButton` / `prefers-reduced-
    motion` patterns) ALL still pass against the surviving Target. Gate stays
    GREEN. The gate lane may drop the dead `StartingStyleScene.vue` read.
  - `scripts/proof-scene-machine-irrefragable.mjs:152,171` lists
    `"starting-style": "StartingStyle"` in its superKey map + the AUTOPLAY set —
    inert (its `MATRIX_SCENES = ["cube","easing","amiga"]` never drives
    starting-style). The gate lane should drop the dangling map/set entry when
    it touches that script.
- A harmless descriptive comment remains at `useSpringDemo.ts:77` /
  `useSequenceDemo.ts:124` / `scenePlaybackAdapters.ts:16` (prose mentioning the
  former StartingStyle scene) — documentation, not code dependency.

## Verification run
- `tsc --noEmit` → clean (exit 0)
- `npm run check:lib` → clean (exit 0)
- `npm run gh-pages` → built green (exit 0; svgLoader plugin wired, inert until
  the Build lane adds `.svg?component` imports)
