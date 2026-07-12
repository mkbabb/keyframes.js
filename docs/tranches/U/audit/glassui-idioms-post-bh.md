# glass-ui post-BH idiom audit — the OD-U2 homogeneity evidence

> Extracted verbatim from the 2026-07-10 read-only audit agent's report (owner ruling batch, OWNER-ASKS row 3: "Ensure homogenaity with our ther repos"). Feeds U.B (component-module redesign), U.F (the 5.0.0 edge), U.G (the codex skeleton).

I have a complete, well-evidenced picture. Here is the audit report.

---

# glass-ui audit → keyframes.js Tranche U redesign

Repo: `/Users/mkbabb/Programming/glass-ui` · `@mkbabb/glass-ui@4.2.0` · current branch `tranche/BG` (with `docs/tranches/BH/` planning the 5.0.0 cut). Vue 3.5 + reka-ui + Tailwind v4 + Vite 8 + Vitest 4.

---

## 1. THE POST-BH COMPONENT-SET IDIOMS

The governing doctrine is **FEATURE-DIR COLOCATION (AY.W-COLOCATE)**, stated verbatim in `CLAUDE.md:100`:

> "a complex component is a sub-component dir — components at root, composables under `composables/`, constants in `constants.ts`, shaders in `shaders/`, skeletons in `skeleton/` (each 'if needed'), + a `README.md`. Enforced by `proof:colocation`."

**Every component is a directory** (never a flat file). Two families: `src/components/ui/` (43 dirs — reka-primitive wrappers) and `src/components/custom/` (49 dirs — house components). Directories are **kebab-case**; files inside are **PascalCase.vue**; the barrel is always `index.ts`.

### Leaf — `ui/button/` (flat, 2 files)
```
src/components/ui/button/
├── Button.vue        (13.9 KB — CVA-consumed via index)
└── index.ts          (17.1 KB — the buttonVariants cva() lives HERE, not in the SFC)
```
Idiom: even a "leaf" keeps a dir. The CVA variant table lives in `index.ts` (`export const buttonVariants = cva(...)`, `button/index.ts:5`), NOT in the SFC — the SFC imports it. `Button.vue` has **zero `<style>` blocks**; all styling is Tailwind utility classes composing shared glass recipes (`.btn-pill`, `.glass-capsule`, `.tap-squish`) defined centrally.

### Mid — `ui/tabs/` and `ui/select/` (flat multi-SFC + barrel)
```
src/components/ui/tabs/          src/components/ui/select/
├── Tabs.vue                     ├── Select.vue          (409 B — thin reka re-wrap)
├── TabsList.vue                 ├── SelectTrigger.vue   (7.8 KB — the heavy one)
├── TabsTrigger.vue              ├── SelectContent.vue
├── TabsContent.vue              ├── SelectItem.vue  ... (10 SFCs total)
├── TabsIndicator.vue            └── index.ts
└── index.ts
```
`tabs/index.ts` is a pure re-export barrel (5 `export { default as X } from './X.vue'` lines). `TabsIndicator.vue` carries **no scoped style** — the elastic-indicator spring reads central `src/styles/segmented-tabs.css`. Note the custom **`SegmentedTabs`** at `custom/tabs/` is the public tabs surface; `ui/tabs` is described as "off the public surface" (`CLAUDE.md:158`).

### Mid-complex — `custom/easing/` (colocation with composables/ + constants + README)
```
src/components/custom/easing/
├── EasingPicker.vue           (14.7 KB, 0 <style> blocks)
├── EasingConfigurator.vue
├── composables/
│   └── useEasingPicker.ts     (12 KB — the hook lives in composables/, one file)
├── constants.ts               (curve catalogue / mode constants)
├── README.md                  (per-component doc — colocation "if needed")
└── index.ts                   (re-exports SFCs + the composable + 6 types)
```
`easing/index.ts:5-14` re-exports the composable AND its types from the barrel (`useEasingPicker`, `EasingPickerMode`, `EasingPickerValue`, …). This is the "types-through-the-barrel" idiom (SFCs can't re-export types, so `constants.ts`/composables own them). Doc-canon at `CLAUDE.md:621` records the boundary law: the picker COMPOSES value.js math, owns only the chassis.

### Complex — `ui/drawer/` (composables/ + context module + constants)
```
src/components/ui/drawer/
├── Drawer.vue  DrawerContent.vue  DrawerOverlay.vue
├── DrawerHeader.vue  DrawerFooter.vue  DrawerTitle.vue  DrawerDescription.vue
├── composables/
│   ├── useDrawerSnap.ts          (16.3 KB — the snap engine)
│   └── drawerSnapContext.ts      (2 KB — provide/inject DI module)
├── constants.ts                  (3.4 KB)
└── index.ts                      (2.6 KB — re-exports SFCs + 3 union types + reka pass-throughs)
```
`drawer/constants.ts` is the model example of the **colocated constants home**: module-scope magic numbers (`DRAWER_SNAP`, `BOTTOM_SHEET_LADDER`, `DRAWER_FLING_VELOCITY`, `DRAWER_SNAP_LABEL`) + a pure helper `resolveDefaultSnapPoints()` live there rather than at the top of the composable (`constants.ts:1-8` states the convention "mirroring dock/constants.ts"). The DI context module imports its `Symbol()` label from `constants.ts` so it's typed once. `drawer/index.ts` exports the union types (`DrawerDirection`, `DrawerMode`, `DrawerStage`) plus re-exports reka primitives renamed (`DialogPortal as DrawerPortal`).

### Most complex — `custom/dock/` (sub-component dir + composables/)
```
src/components/custom/dock/
├── GlassDock.vue  DockSection.vue  DockLayerGroup.vue  DockLayer.vue
├── DockIconButton.vue  DockTabButton.vue  DockSelectTrigger.vue ...
├── composables/     # useDockState, useLayerTransition
└── index.ts
```
Descriptor **types live in `constants.ts`** (the "SFC-cannot-re-export-a-type colocated home" — `CLAUDE.md:691`, `:705`). Renderers >~450 lines get carved OUT of the SFC into a colocated `composables/useX.ts` (`CLAUDE.md:132`: fourier-field → `composables/useFourierField.ts`; aurora → `useAurora.ts`; goo-blob → `useMetaballRenderer.ts`), enforced by `proof:no-god-module` (<500-line ceiling, with a shader-literal exemption).

### Shared cross-component home — `ui/_shared/`
```
src/components/ui/_shared/
├── axes.ts               # BH.W-AXIS-GRAMMAR — Size/Orientation/Motion/Surface grammar types
├── useControlSize.ts     ├── useMotionAxis.ts     ├── useSurfaceAxis.ts
├── menuItemVariants.ts   ├── useStalePropWarning.ts
├── ModalOverlay.vue      └── index.ts
```
So there are **two composable homes**: (a) per-component `composables/` dir for hooks bound to one component; (b) `_shared/` for cross-component control-axis grammar + hooks. Truly generic composables (motion, glass, color, sidebar, virtual…) live in the top-level `src/composables/` tree (11 sub-dirs), NOT under components.

**Naming summary:** kebab-case dirs · PascalCase `.vue` files, component prefix repeated (`DrawerHeader`, `SelectTrigger`) · `index.ts` barrel per dir · `constants.ts` for typed constants/enums/pure helpers · `composables/useXxx.ts` for hooks · optional `README.md`, `shaders/`, `skeleton/`. **CSS is not colocated** — see §4.

---

## 2. IS `@` A DIRECTORY? — No. It is an alias only.

`find . -type d -name '@'` returns **nothing** (checked repo-wide and under `demo/`). glass-ui has no on-disk `@` directory. Unlike keyframes.js's `demo/@/`, glass-ui uses a **3-plane alias `@glass`** (introduced BH.B2.0 to decouple ~700 deep-relative `../../src/...` imports from src depth). The alias must be declared in all three planes because none reads the others:

| Plane | File | Mapping |
|---|---|---|
| Type | `tsconfig.json` `compilerOptions.paths` | `"@glass/*": ["./src/*"]` |
| Runtime (dev/build) | `vite.config.ts` `resolve.alias` | `"@glass": resolve(__dirname, "src")` |
| Test runner | `vitest.config.ts` `resolve.alias` | `"@glass": fileURLToPath(new URL("./src", …))` |

`vitest.config.ts:26-35` explicitly documents "vitest does NOT read vite.config.ts's alias" — hence the twin. `components.json` carries the shadcn aliases separately (`"components": "src/components"`, `"utils": "src/utils"`).

**src/ top-level layout** (`src/`):
```
src/
├── index.ts            # vueuse-FREE root barrel (14.8 KB)
├── api/                # 854L discovery aggregator (/api subpath) — SLATED FOR DELETION in 5.0.0
├── components/{ui,custom}/   # + components/ui/_shared
├── composables/        # 11 sub-trees (color, context, dark, dom, glass, keyboard,
│                       #   motion, reactive, sidebar, sortable, virtual)
├── subpaths/           # ~79 one-line mirror barrels — SLATED FOR DELETION in 5.0.0
├── styles/             # central CSS system (see §4)
├── types/  utils/  fonts/
└── axes.ts carousel.ts dark.ts forms.ts keyboard.ts motion.ts motion-core.ts
    sidebar.ts tokens.ts infinite-scroll.ts   # 12 curated flat top-level barrels
```

---

## 3. THE 5.0.0 STATE

**Current version:** `package.json` `"version": "4.2.0"`. A `release/4.3.0` branch exists (its `package.json` reads `4.3.0`). Newest git tag is `v4.2.0`. Branches present: `master`, `release/4.3.0`, `tranche/BA…BG` (current `tranche/BG`), `prototype/liquid-dock`, plus ~hundreds of `worktree-*` agent branches. There is **no `5.0.0` tag or branch yet** — 5.0.0 is a *planned joint cut* (BG + BH land together as 5.0.0).

**Where 5.0.0 lives:** `docs/tranches/BH/PLAN.md` (48 KB) is the migration/planning doc. Key claims:
- `PLAN.md:14`, `:31`: the 5.0.0 clean break collapses the **three redundant export layers** — `src/subpaths/` (79 mirror barrels) + `src/api/` (854L aggregator) + 7 flat `src/*.ts` barrels — into **ONE generated entry-set** sourced from the real colocated barrels.
- `PLAN.md:175`: the entire consumer-facing break is **exactly**: drop the `./api` key + re-home its 203 symbols onto owning subpaths (200 pure path-swaps; 3 orphans add an export — `Surface→/card`, `MenuItemVariants→/command`, `ControlSize→/forms`) **+ one component rename `goo-blob → blob`** (`src/components/custom/goo-blob/` + `src/subpaths/goo-blob.ts` → `blob`, emitting `dist/blob.js`). "5.0.0 is the free break, no alias."
- `PLAN.md:101` (B2.1-swap): delete `src/subpaths/`, regen `package.json` exports, and **bump peers**: `@mkbabb/keyframes.js ^5.0.0 → ^5.1.0` and `@mkbabb/value.js ^1.0.0 → ^1.1.1`.
- New/grammar work in the wave set: `BH.W-AXIS-GRAMMAR` (mint `_shared/axes.ts` with `Size`/`Orientation`/`Motion`/`Surface`; publish a types-only `/axes` subpath), `W-SIZE-UNIFY`, `W-MOTION-AXIS` (`PLAN.md:68`, `:98`).
- `W-styles-colocation (B2.6)`: 9 component CSS sheets (border-progress, completion-seal, configurator, instrument-chassis, hover-popover, **drawer**, segmented-tabs, select, icon-chip) move toward colocation via a GATHER + @import-rewrite mechanism; tokens/theme/typography/glass roots stay global (`PLAN.md:108`).
- `B4f`: **delete CLAUDE.md** entirely (its contracts redistribute into `docs/canon/` + `docs/design/`), gated by `proof:claude-deletable` — the absolute last act of the tranche.

**The BG/BH wave set you named is confirmed:**
- **Drawer inset/stage tokens** — `drawer/constants.ts` carries `DRAWER_SNAP`, the `--stage-t` scalar coupling (`DrawerStage` enum in `drawer/index.ts`, "BD.W-OVERLAY-STAGE-COUPLE"), re-tuned spring `{0.50, 0.74}` (BD.W-ANIM-IOS27-TUNE).
- **Dock fixes** — CHANGELOG 4.2.0 headline: the "year-old dock width-seizure" fix (bounded `--dock-live` blend); `useMorphField` WELD + ONE `GooFilter` retiring ~12 forked morph mechanisms; the dock-fission double-mount kill.
- **EasingPicker write-through** — `custom/easing/` is the boundary-law curve editor; the re-parseable readout + value.js twin write-through is doc-canon at `CLAUDE.md:621`.

**CHANGELOG.md** newest entry is `## 4.2.0` — "The BD greenfield hardening wave — warm/weighty/liquid redesign" (`CHANGELOG.md:1-40`). Its peer note (`CHANGELOG.md:36`): **"`@mkbabb/keyframes.js` is now `^5.0.0`… verified against 5.1.0. Consumers on keyframes 4.x must upgrade."** `MIGRATION.md:7` frames items as "DEFINITION-ABSENT at the 5.0.0 cut." Changesets flow via `.changeset/` (changesets CLI → Version Packages PR → `v*.*.*` tag → npm publish).

---

## 4. TOOLCHAIN NOTES (stay homogeneous with these)

**Build:** Vite `^8` with **Rolldown** (`rolldownOptions`, not `rollupOptions`) in `vite.config.ts`. Library build via `vite.library.ts`:
- `libraryEntries()` has **two tiers**: (1) ~12 hand-curated multi-line barrels that stay at `src/` top level; (2) every `src/subpaths/*.ts` batch-resolved by globbing the dir — "a new subpath barrel never has to be hand-added." Output format ES-only; `fileName`: `index → glass-ui.js`, else `<entry>.js`.
- Every runtime peer is `external` (`libraryExternal`: vue, reka-ui, @vueuse/core, @mkbabb/keyframes.js, @mkbabb/value.js, @mkbabb/pencil-boil, class-variance-authority, clsx, embla-carousel-vue, @lucide/vue). Machine-locked by `proof:external-payload`.
- `build` script = `vite build && npm run emit-types`. Types are emitted **out-of-band by `vue-tsc`** (no in-Vite dts plugin): `emit-types` = `vue-tsc --project tsconfig.build.json && node scripts/flatten-subpath-types.mjs` (`emitDeclarationOnly`, flat per-entry `.d.ts` into `dist/`).
- There is a **fleet of Vite configs** by concern: `vite.config.ts` (dev+lib), `vite.library.ts`, `vite.style-assets.ts`, `vite.style-fold.ts`, `vite.utility-emit.ts`, `vite.iter.config.ts`. Style assets are folded into the dist CSS by the `publishStyleAssets()` plugin.

**Export surface:** **per-component subpath exports** — ~90 keys in `package.json` `exports` (`.`, `./button`, `./drawer`, `./easing`, `./tokens`, `./styles`, `./styles/fonts`, `./fonts/*`, …), each mapping to a built `dist/<name>.js`. `typesVersions` mirrors them. This is a **many-subpath** model, not a single barrel — the root `.` barrel is deliberately vueuse-FREE, and vueuse/keyframes/value.js-bearing leaves are pushed OFF the root barrel onto their own subpaths (SCC-closure discipline).

**Test:** Vitest `^4` (`vitest.config.ts`), env `happy-dom`, `globals: true`. **Tests are NOT colocated** — since AV.W14, all tests live under top-level `tests/` mirroring `src/` (`tests/components/{ui,custom}/`, `tests/composables/...`, `tests/scripts/`); `proof:no-test-in-src` enforces zero test files in `src/`. Include globs: `tests/**/*.{test,spec}.{ts,tsx,vue}` + `scripts/**/*.{test,spec}.ts`. Setup: `tests/setup.ts`. `resolve.conditions: ["development","module","browser","default"]`. There is also a separate `tests-visual/` workspace (Playwright π-capture) and a `tests/*.smoke.spec.ts` public-surface suite (`public-surface.spec.ts`, 24 KB).

**Lint/format:** **None in the conventional sense** — no `.prettierrc`, no `.eslintrc`/`eslint.config.*`, no prettier/eslint in devDependencies, no `prettier` key in `package.json`, no `lint`/`format` scripts. Code style is enforced instead by a **bespoke gate battery**: ~200+ `proof:*` npm scripts (e.g. `proof:colocation`, `proof:no-god-module`, `proof:external-payload`, `proof:subpath-classify`, `proof:phantom-classes`, `proof:no-layout-animation`, `proof:claude-structure-sync`) driven by `scripts/*.mjs`, plus `.githooks/commit-msg`. `typecheck` = `vue-tsc --noEmit && vue-tsc --noEmit -p tsconfig.test.json`. TS config: strict, `verbatimModuleSyntax`, `isolatedModules`, `moduleResolution: bundler`, ES2022 target — named exports + `import type` only (canon `docs/canon/conventions.md`).

**CSS conventions:** **Central `src/styles/` tree, not colocated** (colocation is planned but only 9 sheets in 5.0.0's B2.6). `src/styles/index.css` is a documented **@import cascade** where "load order is load-bearing," organized as thin `@import` ROOTS over cohesion-domain partials each <500 lines:
- `tokens.css` → `tokens/{color-radius, glass, shadow, scheme-motion, scheme-spring, sizing, light-dark, dark-arm, property-regs, …}.css` (CSS custom properties are the source-of-record for every visual axis; `@property`-registered motion tokens).
- `glass.css` → `glass/{surfaces, material, glass-capsule, glass-chip, rim, squircle, ladder, accent-tone, surface-axis, …}.css`.
- Component recipes are **central `.css` files** (`drawer.css`, `select.css`, `segmented-tabs.css`, `cards.css`, `dock/`, `icon-chip.css`, …) using `@layer components` (`index.css:84`, `:91`, `:140`). SFC `<style scoped>` is used in only **47 of 253 `.vue` files** — and the representative components (Button, Drawer, DrawerContent, TabsIndicator, EasingPicker) carry **zero `<style>` blocks**, styling entirely via Tailwind utilities that compose the shared glass recipes. Font payload is split into `styles/fonts` (base64 woff2) off the critical `./styles` path. Idiom home documented at `docs/precepts/design-idioms.md` (`@theme` aliases → theme.css, `@utility` recipes → cohesion-domain file).

---

### Bottom line for Tranche U
- Adopt **feature-dir colocation**: every component is a kebab dir with PascalCase SFCs, an `index.ts` barrel, `constants.ts` for typed constants/enums/pure helpers, and a `composables/useXxx.ts` for any per-component hook; carve renderers >~500 lines out of the SFC.
- Types flow **through the barrel** (SFCs can't re-export types) — put unions/enums in `constants.ts` or the composable and re-export from `index.ts`.
- Use a **`@`-style alias to `src/`** (glass-ui's is `@glass`) declared in **all three planes** (tsconfig paths, vite alias, vitest alias) — do NOT create an on-disk `@/` directory.
- **Tests in a top-level `tests/` mirror**, not colocated.
- **Per-component subpath exports** with a generated entry-set; keep the root barrel dependency-light and push heavy/peer-bearing leaves onto their own subpaths.
- CSS: **central `styles/` cascade** with token partials + `@layer components`, SFC scoped-style only where layering demands it.
- glass-ui's 5.0.0 direction is *fewer indirection layers* (kill mirror-barrel/aggregator sprawl, one generated export set, free renames like `goo-blob→blob`) — mirror that instinct in the U redesign.