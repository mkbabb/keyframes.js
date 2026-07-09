# Prototype p06 — Playground fold-as-scene: what breaks?

**Probe:** Q6 (SPEC-v1 §6) · **Ruling under test:** C-4 (FOLD playground as `demo/scenes/compose/`) · **Wave:** S.D3
**Worktree:** `.claude/worktrees/wf_f9faf42c-6b8-6` (branch base `master`; throwaway) · **Date:** 2026-07-02
**Verdict:** **adjusts-spec** — the FOLD ruling (C-4) is CONFIRMED viable and cheap; the S.D3 wave's gate-touch
accounting ("update the stores reset hook + the two gate clauses that read playground/App.vue") is a
material undercount and its gate/DAG need the adjustment in §4.

> NOTE: this report was authored in the isolated worktree (the harness blocks writes to the shared
> checkout). Its canonical home is `docs/tranches/S/audit/pass1/prototypes/p06-playground-fold.md` on
> `tranche-s-dev`; copy it there.

---

## 1. The question + the spec's assumption

**Q6 (§6):** "Playground fold-as-scene: what breaks? Register a skeletal `scenes/compose/` in scenes.ts;
route the Assets tab through extraControlTabs; delete the standalone mode in the worktree.
**SUCCESS:** scene mounts + navigates; stores reset hook survives; the two gate clauses re-point cleanly;
no other consumer of asset-manager surfaces. **FAILURE:** the scene machine assumes 8 scenes somewhere
hard-coded (enumerate the sites) or asset-manager drags playground-only deps → scope D3 up."

**C-4 ruling:** FOLD as `demo/scenes/compose/` (the ninth scene "Compose"); relocate `asset-manager/`;
delete standalone app + vite mode + dist debris.

**S.D3's stated cost:** "register the ninth scene (SceneExposedApi + playback adapter; Assets tab through
extraControlTabs); relocate asset-manager/ + EditableLabel; delete demo/playground/ …; **update the stores
reset hook + the two gate clauses that read playground/App.vue**; make Image/SVG kinds real or drop the
menu items."

**The load-bearing assumption tested:** that the gate blast radius of registering a 9th scene is
"**two gate clauses**." It is not. Adding a scene to `scenes.ts` auto-enrolls it into an 82-gate runtime
fleet through a scenes.ts-derived manifest with a fail-loud key-equality guard — a coupling the spec
never names, and the single highest-leverage touch of the whole wave.

---

## 2. What I actually did (commands + exit codes)

Built a faithful (not skeletal) fold in the worktree, then ran the affected gates cleanly against the
worktree tree (scripts resolve `REPO` from their own file location, so a worktree script targets the
worktree tree).

**Files created (`?? demo/scenes/compose/`):**
- `ComposeScene.vue` — the former `playground/App.vue`, EditorShell wrapper stripped (App.vue is the
  host); root template = the casting-floor foundry (former `#target`); the Assets panel projected via a
  `tabsContent` render fn (the same cross-sibling `h()` teleport `CubeScene` uses for matrix-controls);
  `defineExpose({ animationGroup, superKey, tabsContent })` — satisfies `SceneExposedApi`.
- `useComposeAnimations.ts` — `usePlaygroundAnimations.ts` relocated verbatim.
- `composeKeys.ts` — `COMPOSE_SUPER_KEY = "playground"` (superKey kept so stored control options migrate).

**Files edited (`git diff --stat`, deps/dist excluded):**
```
 demo/@/.../stores/controlSurfaceDFA.ts |   7 +   (assets surface + CONTROL_SURFACES.compose + SCENE_SURFACE_TABS.assets)
 demo/app/scenes.ts                     |  18 +   (import COMPOSE_SUPER_KEY + the 9th descriptor)
 scripts/lib/demo-driver.mjs            |   7 +   (SCENE_GATE_META.compose — the mandatory manifest entry)
 vite.config.ts                         |  20 -   (delete the `mode === "playground"` branch)
 package.json                           |   1 -   (delete dev:playground script)
 demo/playground/{App.vue,index.html,usePlaygroundAnimations.ts}  | 440 -  (standalone deleted)
```

**Commands (worktree cwd):**
| # | command | exit / result |
|---|---------|---------------|
| 1 | `npm run gh-pages` (fold registered, before playground delete) | **0** — emitted `ComposeScene-DU6ibw_Z.js` (21.85 kB) + `.css` as a **lazy code-split chunk** |
| 2 | `rm -rf demo/playground` + delete vite mode + script | ok |
| 3 | `npm run gh-pages` (after delete) | **0** — SPA builds clean; compose chunk still emitted |
| 4 | `node .../lib/demo-driver.mjs` import (before SCENE_GATE_META edit) | **THREW** at module load (see §3.A) |
| 5 | add `SCENE_GATE_META.compose` (2 data lines) → re-import | **OK** — `SCENES` = 10 keys incl. compose |
| 6 | `node scripts/proof-manifest-sourced.mjs` | **PASS** — "10 scenes, bidirectional set-equality" |
| 7 | `node scripts/proof-scene-control-dfa.mjs` | **PASS** — every scene renders exactly its DFA set (assets surface accepted) |
| 8 | `node scripts/proof-published-surface.mjs` | **FAIL** — `demo/playground/ … does not exist` (the expected re-point red) |
| 9 | `node scripts/proof-scene-colocated.mjs` | **PASS (blind)** — 8 scenes; compose is invisible to it (see §3.C) |
| 10 | playwright-core smoke (serve dist → `#/compose`) | **route navigates; foundry mounts; dock shows compose; 0 console errors** |

The live screenshot shows the full scene: the Assets tabsContent panel (left), the "Compose a scene"
CTA foundry (center), the transport dock (bottom), pointer key-light bloom — all rendering, no errors.

---

## 3. Findings (file:line evidence)

### A. THE central finding — the fold auto-enrolls compose into an 82-gate runtime fleet via a fail-loud manifest (the spec's undercount)

`scripts/lib/demo-driver.mjs` re-sources its scene manifest FROM `demo/app/scenes.ts` and binds a
per-scene `SCENE_GATE_META` map to the parsed id set with a **bidirectional key-equality guard that
throws at module load** (`demo-driver.mjs:294-311`):

```
THREW: demo-driver: SCENES manifest ≠ scenes.ts ids — scenes.ts id(s) with NO SCENE_GATE_META entry:
compose (add a { subjectSelector, dockFloatAllowed } entry so the scene is gate-visited)
```

**82 gates import this driver** (`grep -rln demo-driver scripts | wc -l` → 82: occlusion-gate,
lighthouse-gate, font-census, mobile-single-page, easter-egg, scene-control-dfa, design-refinement, …).
Registering compose in `scenes.ts` therefore **throws every one of them at import** until a
`SCENE_GATE_META.compose = { subjectSelector, dockFloatAllowed }` entry is added (`demo-driver.mjs:93`).
Adding the 2-line entry unblocks all 82 and `proof:manifest-sourced` goes green at 10 scenes.

This is *good* design (fail-loud, no silent drift — it is exactly the H.W8 anti-drift cure), but it means
S.D3's "the two gate clauses" is wrong by construction: the fold's **primary** gate touch is this one
manifest entry, and once added, **compose is a first-class citizen of the entire runtime fleet** — it
must then PASS occlusion, a11y, font-census, mobile-single-page, stage-visible, etc. That fleet
membership is the real cost, and it is a hard dependency on the S.G design band (§5).

### B. The two named "hardcoded-path" clauses — one clean re-point, one is an UPGRADE

- `proof:published-surface.mjs:496` — `for (const real of ["@","app","scenes","playground"])` REDs on the
  deleted dir (confirmed: `✗ (e) demo dir demo/playground/ … does not exist`). Also root `CLAUDE.md`'s demo
  tree names `playground/`. **Clean re-point:** drop `"playground"` from the array + regen the CLAUDE.md tree.
- `proof:design-refinement.mjs:308-335` — the `[playground]` S9 bind-ignition egg reads `playground/App.vue`
  textually AND its own comment records a born-RED limitation: *"the playground egg lives in the STANDALONE
  playground app, not the SPA scene machine — the SPA route has no playground host, so it cannot be
  exercised in THIS SPA dist."* **The fold RESOLVES this:** compose is now a real SPA route, so the egg
  becomes live-drivable — the re-point is an *upgrade*, not a lateral move.

### C. `proof:scene-colocated` passes BLIND — compose is silently unchecked

`proof-scene-colocated.mjs:49-58` hardcodes `SCENE_DIRS` (8 entries, each `{name, scene, demo}`). The gate
iterates only those 8, so `scenes/compose/` is **not validated** (it PASSES at "8 scenes" with compose
present but unexamined). To actually gate the fold, compose must be **added to `SCENE_DIRS`** with a
`demo:` peer filename the gate can assert exists (ASSERTION 1 requires a named peer file — my
`useComposeAnimations.ts` would be the `demo` entry). This is a third mandatory manual touch the spec omits.

### D. The DFA triple (the "Assets tab through extraControlTabs" mechanism)

Routing the Assets tab through the machine (not the standalone `extra-tabs` prop) requires three edits in
`controlSurfaceDFA.ts`: add `"assets"` to `ControlSurface` (`:32`), `CONTROL_SURFACES.compose = ["assets"]`
(`:76`), and `SCENE_SURFACE_TABS.assets = { value, label, icon }` (`:164`). With these,
`proof:scene-control-dfa` PASSES and the scene's `tabsContent` render fn (gated on
`selectedControl === "assets"`) projects exactly as CubeScene's matrix panel does. Clean, but a named cost.

### E. Count-prose "8 scenes" (cosmetic — the scans are already correct)

Literal "8 scenes" prose in `proof-font-census.mjs` (5 sites), `proof-no-single-option-select.mjs:34`,
`demo-driver.mjs:57` comment, `proof-scene-colocated.mjs:134`. All are **prose/comments**; the underlying
scans are manifest-sourced and already visit the real count. A trivial sweep, but it is drift if skipped.

### F. SUCCESS criteria — all met

- **Scene mounts + navigates** ✅ — live smoke: `#/compose` route, `[data-foundry]` mounted, dock shows
  compose, **0 console errors**; build emits a lazy compose chunk.
- **Stores reset hook survives** ✅ — `resetAllStores` (`stores/index.ts:78-81`) already calls
  `_resetAssetManagerStore()` imported from the asset-manager barrel — the reset is **not**
  playground-private; keeping `superKey = "playground"` migrates stored control options with no reset.
- **The two named clauses re-point** ✅ (B) — but see A/C/D for the un-named ones.
- **No other consumer of asset-manager surfaces / no playground-only deps** ✅ — asset-manager imports
  only demo-standard deps (`@mkbabb/glass-ui`, `@mkbabb/glass-ui/forms`, `@vueuse/core`, `@lucide/vue`,
  `EditableLabel`, `useDragCapture`); no `vue-sonner`/reka-only chain; nothing playground-private.

### G. FAILURE criteria — NEITHER triggers

- **Scene machine assumes 8 hardcoded?** NO. `SceneId = string` (`sceneMachine.ts:21`);
  `controlSurfacesFor` is total (unknown → built-in triad); the manifest is *derived and fail-loud*, not a
  silent literal. The only "8" hardcodes are prose (E) + the one `SCENE_DIRS` list (C) — both trivial,
  neither a machine assumption.
- **asset-manager drags playground-only deps?** NO (F).

The failure branch ("scope D3 up") is not forced by a *coupling* discovery; it is forced by the
**gate-accounting** discovery in A/C/D — a different, milder axis.

---

## 4. Verdict: adjusts-spec

C-4 (FOLD) is CONFIRMED — the fold compiles, code-splits, mounts, navigates, and renders live with zero
console errors; the plumbing is exemplary exactly as design:playground claimed. **Adjust S.D3 as follows:**

1. **Replace "the two gate clauses that read playground/App.vue"** with the true touch set:
   (a) **MANDATORY** `SCENE_GATE_META.compose` in `scripts/lib/demo-driver.mjs` — *without it all 82
   demo-driving gates throw at module load* (highest-leverage line in the wave; name it first);
   (b) the DFA triple in `controlSurfaceDFA.ts` (`assets` surface + `CONTROL_SURFACES.compose` +
   `SCENE_SURFACE_TABS.assets`);
   (c) `proof:scene-colocated` `SCENE_DIRS` += compose (with a `demo:` peer-filename convention decision —
   e.g. `useComposeDemo.ts` to match the sibling naming, resolving the S.D4 `use<Name>Demo` question for
   this scene);
   (d) `proof:published-surface` dir-list minus `"playground"` + root CLAUDE.md tree regen;
   (e) `proof:design-refinement` S9 egg re-pointed to the compose source (an upgrade — now live-drivable);
   (f) the "8 scenes" prose sweep (E).

2. **Sequence `proof:compose-scene` AFTER S.G1/G-band, not standalone at D3.** The moment compose is
   registered it auto-joins the occlusion/a11y/font/stage-visible fleet; `proof:compose-scene` cannot be
   GREEN in isolation because compose must first pass those runtime gates (the "compose's CTA above the
   fold" / "compose chrome-red" work S.G1/S.G2 already scope). Add a DAG edge: **S.D3 registers + the
   manifest/DFA/colocated/published re-points; S.G1 + the compose G-band land the runtime-fleet
   discharge; `proof:compose-scene` closes after G.** (Today's DAG has `A4,D1 → D3`; add `G1 → compose
   runtime-fleet green`.)

3. **Confirm the `SceneExposedApi` fit is total (no new contract field needed).** The Assets panel rides
   the existing `tabsContent` render-fn slot verbatim — the standalone `extra-tabs` prop is dropped, the
   DFA `extraControlTabs` projection replaces it. No `sceneExposedApi.ts` change required.

4. **The Image/SVG asset-kind decision (S.D3's "make real or drop") is orthogonal** to the fold — it did
   not surface as a fold blocker; keep it as a D3 sub-item but note it is independent of the mount path.

---

## 5. Implementation-cost estimate for the real wave

**Files touched (~11):** 3 new (`scenes/compose/{ComposeScene.vue, useComposeDemo.ts, composeKeys.ts}`) +
relocate `asset-manager/` + `EditableLabel` under the scene (per C-4) + edits to `scenes.ts`,
`controlSurfaceDFA.ts`, `demo-driver.mjs` (SCENE_GATE_META), `proof-scene-colocated.mjs` (SCENE_DIRS),
`proof-published-surface.mjs` + root/demo `CLAUDE.md`, `proof-design-refinement.mjs`, `vite.config.ts`,
`package.json`, + the "8 scenes" prose sweep (~4 files).

**Gates affected:** 1 mandatory (`demo-driver` SCENE_GATE_META — gates all 82 by proxy) · 1 born-RED to
author (`proof:compose-scene`) · 3 re-points (published-surface, design-refinement→upgrade,
scene-colocated) · 1 DFA (scene-control-dfa passes with the triple) · `proof:manifest-sourced` flips green
at 10 · the runtime fleet (occlusion/font/mobile-single-page/stage-visible) newly VISITS compose and must
pass (discharged in S.G).

**Risk: LOW-MODERATE.** Structurally low — the mount path is proven (build + code-split + live smoke, 0
errors); no library surface, no boundary, no LIGHT/HEAVY seam. The only real risk is **omitting the
SCENE_GATE_META entry** (throws the whole runtime fleet — but fail-loud, so it is caught on the first gate
run, never silent) and **under-sequencing** `proof:compose-scene` before compose passes the occlusion/font
fleet (would born-GREEN-then-red mid-band). Effort: **≈1 day** for the register + re-points, **plus the
S.G foundry/stage-visibility work** already budgeted in G1/G2 — the fold itself is ≤1 day; its gate-green
close is gated on G, not D.

**Throwaway artifacts (worktree only, not merged):** `demo/scenes/compose/*`, the 8-file diff above,
`dist/gh-pages/assets/ComposeScene-*`, `scratchpad/compose-smoke.png`.
