# Lane 22 — perf-demo-runtime

**Fleet:** Tranche U development audit (32 lanes) · **Charter:** THE PERFORMANCE
EDICT, demo half — built-demo chunk economy, Monaco discipline, three.js, the
shared-clock runtime, LCP path, style-recalc surfaces. Static analysis + build
artifacts only (no browser gates).

**Method:** analyzed the live `dist/gh-pages/` build (built `Jul 9 21:55`, kf
5.2.0) against source under `demo/` and `vite.config.ts`. Every finding carries
`file:line` evidence read from the tree or byte-measured off the shipped chunks.

---

## Headline

**~48% of the shipped demo JS is dead code the browser never fetches** — three
Monaco language workers (`ts.worker` 6.9 MB, `html.worker` 719 KB, `json.worker`
409 KB ≈ **8.0 MB**) emitted by a full `import("monaco-editor")` barrel whose
`getWorker` only ever spawns editor+css — while **value.js (124 KB) and the
LCP hero both ride the eager critical path** because `app.mount()` is gated on
the entire heavy engine graph the hero does not touch.

---

## The shipped-chunk ledger (measured, `dist/gh-pages/assets/`)

| Chunk | Bytes | Fetched? | Verdict |
|---|---:|---|---|
| `ts.worker-*.js` | 6,895,040 | **never** (only css lang registered) | DEAD |
| `vendor-monaco-*.js` | 4,183,695 | on editor mount (lazy) | bloated by all langs |
| `css.worker-*.js` | 1,054,628 | on editor mount | legit |
| `vendor-highlight-*.js` | 928,471 | on editor mount | 96% dead (full pkg) |
| `html.worker-*.js` | 719,577 | **never** | DEAD |
| `index-*.css` | 582,311 | eager (deferred) | large; investigate |
| `vendor-three-*.js` | 538,069 | amiga only (lazy) | full namespace |
| `index-*.js` (entry) | 457,786 | **eager** | LCP path |
| `json.worker-*.js` | 409,211 | **never** | DEAD |
| `vendor-reka-ui-*.js` | 305,147 | **eager** | chrome (mostly legit) |
| `value-*.js` | 124,175 | **eager** (should be dynamic) | BOUNDARY LEAK |

Total shipped JS ≈ 16.57 MB. The three never-fetched workers alone are
**8.02 MB (48.4%)** of it.

---

## Findings

### F1 — CRITICAL — Full `import("monaco-editor")` barrel ships 8 MB of dead language workers

`demo/@/components/custom/instrument/keyframes/CSSCodeEditor.vue:52` dynamically
imports the **full** `monaco-editor` barrel (`esm/vs/editor/editor.main`), which
transitively registers the TypeScript, HTML, and JSON language contributions.
Each contribution declares a `new Worker(new URL('…/{ts,html,json}.worker', …))`
that Vite statically discovers and emits — so the build ships `ts.worker`
(6.9 MB), `html.worker` (719 KB), `json.worker` (409 KB). But
`CSSCodeEditor.vue:60-66`'s `MonacoEnvironment.getWorker` only ever returns a
`CSSWorker` (label css/scss/less) or the base `EditorWorker`; and only the `css`
language is registered (`CSSCodeEditor.vue:70` `m.languages.register({ id: "css" })`).
The ts/html/json workers can NEVER be spawned. They are 8 MB of pure deploy
weight + a latent landmine, and the full barrel also inflates `vendor-monaco`
itself (4.18 MB) with the TypeScript/HTML/JSON language *services* the editor
never uses. This is precisely the "NO legacy / NO dead code" the U edict forbids.

- **Evidence:** `CSSCodeEditor.vue:52` (`import("monaco-editor")`), `:60-66`
  (getWorker editor+css only), `:70` (css-only register);
  `dist/gh-pages/assets/{ts,html,json}.worker-*.js` on disk (8.02 MB); no
  `editor.api`/`monaco.contribution` import exists anywhere in `demo/`.
- **Proposal (gestalt):** stop importing the language-complete `editor.main`
  barrel. Import the language-free editor core `monaco-editor/esm/vs/editor/editor.api`
  and *explicitly* add only the CSS contribution
  (`monaco-editor/esm/vs/language/css/monaco.contribution`). The ts/html/json
  worker `new Worker(new URL(...))` edges then never enter the graph, so Vite
  emits zero language workers, and `vendor-monaco` sheds every non-CSS language
  service. This is the canonical Monaco slimming pattern — a structural import
  correction, not a filter/exclusion workaround. **Target:** ts/html/json workers
  = 0 bytes shipped; `vendor-monaco` ≤ ~2.2 MB.

### F2 — CRITICAL — value.js (124 KB) leaks onto the eager entry via `@state`

The app entry `index-*.js` **statically** imports `value-*.js`
(`import{…}from"./value-ceCAE4r9.js"`, modulepreloaded in `index.html:98`). The
whole boundary architecture (CLAUDE.md) is that the LIGHT surface is
value.js-free and value.js enters ONLY through the dynamic `loadAnimationEngine()`.
The leak's root: `main.ts` → `App.vue:150` imports the eager `@state` barrel →
`demo/@/state/animationOptionsStore.ts:1` `import { jumpTerms } from "@mkbabb/value.js"`.
A single value.js helper on an eager store drags all 124 KB of value.js onto the
LCP critical path — parsed before the app mounts — even though that same store
already reaches the heavy surface via `kfEngine()` (`animationOptionsStore.ts:2`),
which loads value.js anyway inside the dynamic engine chunk.

- **Evidence:** `animationOptionsStore.ts:1` (eager `jumpTerms` import),
  `App.vue:150` (`from "@state"`), `index.html:98` (`value-*.js` modulepreload),
  entry static-import grep confirms `from"./value-ceCAE4r9.js"`.
- **Proposal (gestalt):** the eager demo shell must be value.js-free by the same
  contract the library obeys. Route `jumpTerms` (and any other value.js helper
  reached from an eager store) through the already-warmed `kfEngine()` surface —
  i.e. re-export the needed value.js helpers off the HEAVY engine barrel so the
  store consumes them dynamically, never statically. If value.js must expose a
  genuinely LIGHT helper subpath, charter that as the kf consume-edge ask to the
  active value.js tranche. **Target:** value.js = 0 bytes on the entry's static
  graph; it rides the dynamic engine chunk exclusively.

### F3 — MAJOR — LCP hero is gated on the entire heavy engine graph it never uses

`demo/app/main.ts:50` mounts the app only after `warmKfEngine()` resolves:
`void Promise.all([warmKfEngine()…, fontsDecoded]).finally(() => app.mount("#app"))`.
`warmKfEngine()` (`@utils/kfEngine.ts`) awaits `loadAnimationEngine()` — the full
heavy graph (engine, group, ingest, scroll, compile, motion-path, draw-svg,
morph-svg + value.js). But the LCP element — the hero `<h1>` in
`instrument/shell/EditorStartScreen.vue` — imports only `@lucide/vue` `List`,
`AnimatedText`, `TypingDots` (`EditorStartScreen.vue:61-63`): **zero engine
dependency.** The comment at `main.ts:26-29` claims first paint is JS-independent
because criticalCSS inlines the *skeleton*, but the actual hero *content* does not
render until `app.mount()` fires — which waits on ~250 KB+ of engine JS the hero
does not touch. The mount-gate exists only to satisfy the scene-machine's
synchronous non-null `AnimationGroup` prop contract (`kfEngine.ts` comment,
`sceneFacility.ts:21`).

- **Evidence:** `main.ts:50` (mount inside `.finally` after warm),
  `kfEngine.ts:27,38-43` (warm = full `loadAnimationEngine`),
  `EditorStartScreen.vue:61-63` (hero has no engine import).
- **Proposal (gestalt):** invert the dependency — mount immediately (paint the
  hero on entry+shell bytes alone), warm the engine during idle, and transpose
  the sync non-null `AnimationGroup` contract into an async-tolerant one: the
  control suite receives a nullable/Suspense-gated group that hydrates when the
  engine resolves. The hero and dock chrome then paint independent of the engine
  download. This is the "architectural transposition for performance" the U edict
  demands, not a warm-earlier tweak. **Target:** LCP paints on entry + light
  shell only; engine warm is fully off the mount-blocking path.

### F4 — MAJOR — highlight.js ships the full 928 KB package to register one language

`demo/@/components/custom/instrument/keyframes/composables/useHighlightCSS.ts:3`
does `import hljs from "highlight.js"` — the **full** distribution bundling every
common language grammar (928 KB `vendor-highlight`) — then registers only CSS
(`:4` imports the css grammar separately, `:8` `hljs.registerLanguage("css", css)`).
~96% of that chunk is grammars that are never used.

- **Evidence:** `useHighlightCSS.ts:3` (full-package default import), `:4,:8`
  (css is the only registered language); `vendor-highlight-*.js` = 928,471 bytes.
- **Proposal (gestalt):** import the grammar-free core:
  `import hljs from "highlight.js/lib/core"` (~8 KB) + the already-present css
  grammar. Drops `vendor-highlight` from 928 KB to ~40 KB. Deeper: Monaco and
  highlight.js are BOTH CSS highlighters in this demo (Monaco for the editable
  pane, hljs for the read-only `KeyframeCard`/`KeyframesAddDialog` `hljs css`
  surfaces) — U should evaluate collapsing to a single highlighting authority
  (Monaco's colorizer can render static read-only HTML), retiring highlight.js
  entirely. **Target:** ≤ 40 KB, or 0 if consolidated onto Monaco.

### F5 — MEDIUM — Eager `index.css` is 582 KB (Tailwind v4 + glass-ui token surface)

`index-*.css` = 582,311 bytes — the second-largest eager asset (deferred via
`media="print"` swap, `vite.config.ts:296-297`, so non-render-blocking, but still
downloaded+parsed on every load). It carries 102 `@property` declarations, 57
`@keyframes`, 134 `.dark` variants, and a large Tailwind utility surface
(`--tw-shadow` ×78, `--tw-translate-*` ×100+). Deferred, so lower urgency than
JS, but a 582 KB stylesheet on a 6-scene demo suggests the Tailwind content-scan
is retaining utilities that aren't emitted, or glass-ui's full static token block
is inlined rather than tree-shaken against actual class usage.

- **Evidence:** `index-Cd9Rurv7.css` = 582,311 bytes; at-rule census (102
  `@property`, 57 `@keyframes`, 134 `.dark`); Tailwind v4 via
  `@tailwindcss/postcss` (`vite.config.ts:309`).
- **Proposal:** audit the Tailwind v4 content globs + glass-ui `@theme`/token
  import against the demo's actual class census; ensure the utility layer is
  purged to used classes and the glass-ui token block is scoped, not wholesale
  inlined. Charter a measured CSS-weight target as part of the demo-perf band.
  **Target:** eager CSS ≤ ~250 KB.

### F6 — MEDIUM — three.js shipped as full `import * as THREE` namespace (538 KB)

`demo/scenes/amiga/{AmigaScene.vue,utils.ts,useSphereSpin.ts,useAmigaThree.ts}`
all `import * as THREE from "three"` (538 KB `vendor-three`). Amiga uses only a
sphere geometry, a basic material, a renderer, a camera, and `OrbitControls`. The
namespace import defeats named tree-shaking. Lazy (amiga scene only, off the LCP
path), so lower priority — but on the U performance edict it is retained dead
weight in the one scene that loads it.

- **Evidence:** `amiga/utils.ts:1`, `amiga/useAmigaThree.ts:4` (`import * as THREE`),
  `useAmigaThree.ts:5` (OrbitControls from examples/jsm); `vendor-three-*.js` =
  538,069 bytes.
- **Proposal:** convert to named imports of the exact three classes used
  (`Scene`, `PerspectiveCamera`, `WebGLRenderer`, `SphereGeometry`,
  `Mesh`, `Mesh*Material`, `TextureLoader`, math types) so rolldown drops unused
  three modules. **Target:** `vendor-three` materially below 538 KB (measure the
  used surface).

### F7 — MINOR / STRENGTH — the shared-clock runtime is disciplined (confirm, don't disturb)

The runtime hot path is *good* and should be preserved as the model the rest of
the demo aligns to. `demo/app/runtime/useRafScene.ts` folds every scene onto ONE
`markRaw(new RAFPlayback())` with idempotent `startLoop`, genuine `stopLoop`,
`onScopeDispose(stopLoop)` teardown (no `<KeepAlive>` leak), and
`useSceneVisibilityPause` (idle the loop while the tab is hidden). The easing
gallery's 33 tiles share ONE clock through `registerDotPainter`
(`scenes/easing/useEasingDemo.ts:192,411`, `EasingTarget.vue:200-201,284`) with
direct `style.transform` writes off the Vue reactivity path — no per-tile rAF, no
per-tile watcher. This is the correct architecture; U's perf band should NOT
touch it, only cite it as the standard.

- **Evidence:** `useRafScene.ts:77-121`, `useEasingDemo.ts:192`,
  `EasingTarget.vue:200-201`.
- **Proposal:** none — ratify as the shared-clock idiom; hold the rest of the
  demo to it.

---

## Cross-cut: the eager critical path (what blocks the hero today)

On cold load the browser must fetch+parse, before the hero paints:
`index` (457 KB) + `value` (124 KB, F2) + `vendor-reka-ui` (305 KB) + `vendor-lucide`
+ `playback` + `errors` + runtime/preload ≈ **~900 KB eager JS**, THEN `main.ts`
awaits the entire heavy engine graph (F3) before `app.mount()`. F2 and F3 together
put value.js + the heavy engine on the LCP path for a hero that needs neither.
Fixing F2+F3 removes value.js and ~250 KB+ of engine from the first-paint budget;
`vendor-reka-ui` (glass-ui dock chrome) then becomes the largest legitimate eager
vendor — U should verify the dock chrome doesn't over-pull reka primitives.

---

## What U must charter

1. **Slim Monaco to the CSS-only surface** — import `editor.api` +
   `language/css/monaco.contribution`, never the full `monaco-editor` barrel;
   emit ZERO ts/html/json workers (8 MB dead → 0); gate with a
   `proof:*` that fails if any non-css language worker is emitted to `dist/gh-pages`.
2. **Make the eager demo shell value.js-free** — remove the
   `@state`→value.js static edge (`jumpTerms`); route value.js helpers through the
   dynamic engine surface; extend the boundary discipline to the demo entry
   (a gate that asserts `value-*.js` is not a static import of the app entry).
3. **Decouple LCP from the engine warm** — mount immediately; warm the engine at
   idle; transpose the scene-machine's sync non-null `AnimationGroup` contract into
   an async-tolerant one so the hero + dock paint on light bytes.
4. **Retire the highlight.js full package** — `highlight.js/lib/core` (or
   consolidate all CSS highlighting onto Monaco and delete highlight.js entirely).
5. **Set + gate a demo weight budget** — per-chunk and eager-total byte ceilings
   for the built `dist/gh-pages/` (entry, eager CSS, largest lazy vendor), so the
   perf edict is a standing gate, not a one-time cleanup.
6. **Tree-shake the vendor namespaces** — convert `import * as THREE` (and audit
   Tailwind/glass-ui CSS scan) to named/used-only surfaces.
7. **Ratify the shared-clock runtime** (`useRafScene` / `registerDotPainter`) as
   the demo's runtime idiom and hold every scene to it.
