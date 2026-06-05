# Tranche D — keyframes.js: the demo refined · the engine transposed to its gestalt · the dock leveraged · the deferrals terminated

D is keyframes.js' fourth tranche. C closed honestly — it audited its OWN
predecessor's *claims* (inv ε), unforked the φ-ladder *display* tier (inv ζ —
the demo dogfoods its own engine, π recorded at FULL), and shipped its arm of
the constellation dock+animation convergence. C ran zero perpetual punts. But C
closed honestly *about what it deferred*, too: a deep re-audit of C's own close
(inv ε turned on C) finds three bodies of genuinely-warranted, never-owned work,
and one gate that **just dissolved**. D refines the demo to the encapsulation +
KISS standard the engine already holds, transposes the engine's remaining
architectural tail to its gestalt (the zero-alloc discipline the AnimationGroup
class declares but violates; the `tick`-means-three-things driver seam; the
~1019-line `Animation` god-object in `src/animation/engine.ts`), leverages the
now-published glass-ui dock surface (the consumer dock-rename C gated on
glass-ui's landing — whose correctness base + touch-gate B′ fix landed in
3.3.0), and terminates *every* keyframes-owned deferral — the φ-ladder leaf-tail
(chronic
A→B→C), the square-scene mobile-composition occlusion, the engine residuals W0
booked. D is the terminal home or the KILL.

D is in DEVELOPMENT now. The audits (W0) are RUN — the evidence is on disk under
`audit/` (the frontend / styling / brittleness / engine-transposition lanes, the
deferred ledger, the full prompt-recap). W1–W6 are authored-now-run-later wave
specs; the implementation phase opens only on explicit user authorization, gated
on keyframes' own green CI. No engine or demo source is written in development.

## § Thesis

C's headline — "the close made honest, the design language whole, the
shop-window on its own engine" — is REAL: every gate C's FINAL records MET is a
checked-in, re-runnable instrument shown to PASS (inv ε), the seven B overclaims
are each reconciled, the φ-ladder *display* tier is unforked, the demo carries no
hand-rolled rAF a shipped light engine already is. The re-audit confirms all of
that as the model.

But the re-audit also catalogues, with file:line evidence, three bodies of work
no prior tranche owned, plus one newly-actionable edge:

1. **The demo is well-built but un-refined.** 100% `<script setup>`, idiomatic
   stores, good colocation — the structure C's dogfood pass left is sound. But
   five units are oversized against the engine's own encapsulation standard
   (`AnimationControlsGroup.vue` 552L, `KeyframesEditor.vue` 487L,
   `KeyframeTimeline.vue` 441L, `useKeyframesEditor.ts` 383L, `useTimeline.ts`
   251L); `parseCSSAnimationKeyframes` is duplicated; three pure utils are
   mis-filed under `timeline/composables/`; and the in-component rAF/timeout
   blobs are the exact hand-rolls vueuse's `useRafFn`/`useTimeoutFn` already are
   (the engine-side inv-ζ analogue, demo-internal). Net-deletion of duplication,
   zero behaviour change (`audit/frontend-findings.md`).

2. **The styling layer has an ungated cross-repo rent + a caged monolith.**
   Design idioms are *referenced demo-wide but owned demo-nowhere (rented from
   glass-ui)* — `--rainbow-*` (6 colours, two SVG gradients), `--color-gold` (a
   token reference inside an arbitrary value), `.scale-on-hover` (used **13×**,
   defined only in glass-ui), `@keyframes enter` (referenced `utils.css:129`;
   defined by tw-animate-css via the private `--tw-enter-*` contract). They
   resolve TODAY through the transitive `@mkbabb/glass-ui/styles` + tw-animate-css
   import — but with no local contract, no fallback, no gate. That is the exact
   "a green check that means less than it says" class turned on the design
   language — an idiom the source *names* and rents ungated from a sibling
   cascade (it flattens silently if a sibling renames/drops a token — NOT a blank
   render today). Plus component-specific rules trapped in the global `utils.css`
   monolith (`.tab-trigger-*`, `.btn-playback*`, `.demo-*`, `.ppmycota-*`),
   arbitrary-value tailwind + `!`-overrides, and the φ-ladder **leaf-tail F6**
   (89 body sites — the chronic A→B→C) (`audit/styling-findings.md`).

3. **The engine's transposition has a gestalt tail.** C.W4 unified the steppers
   + the loop core, but inv ε on C's own close finds real architectural
   transpositions left: the `AnimationGroup` compositor **allocates per-frame**
   (the lone hot loop violating the class's own declared zero-alloc discipline),
   `tick` still means three things at the *driver* layer, the computed-unit DOM
   round-trip re-serializes every frame, `Animation` is a ~1019-line god-object
   (`src/animation/engine.ts:126-1145`, in a 1277-line file) at the wrong seam,
   and deprecated path-compat re-exports linger. Two W0-booked
   residuals (`_snapSettled` asymmetry, `leaves.ts | any`) slipped C.W4
   (`audit/engine-transposition.md`, `audit/brittleness-findings.md`).

On top of refinement + transposition, D terminates every keyframes-owned
deferral — and one of them **just became partly unblockable**. The consumer
dock-rename (`TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock` as LOCAL
component renames adopting the glass-ui AU.W8 docs role-vocabulary, each still
composing the published glass-ui dock primitives — `GlassDock` +
`DockLayer`/`DockLayerGroup`/`DockIconButton`/`DockSelectTrigger`; delete the
local `dock/index.ts` re-export) was gated on glass-ui's dock work. The dock
**correctness base + the touch-gate B′ fix landed** (glass-ui `f0b0ffb`, ships
in 3.3.0), unblocking the local renames + the mask removal. A glass-ui-side
`<Role>Dock` BASE COMPONENT to slot-fill over is BOOK in glass-ui until a 2nd
consumer appears, and is scheduled in glass-ui AU.W8 (the role-vocabulary +
base-rename arm) — a named cross-session edge keyframes circles back to if AU.W8
lands a role-typed base. D is the keyframes-side terminal home for the
actionable-now scope.

## § Goal criterion

D succeeds when the demo is refined, the styling language is whole + localized,
the engine is at its gestalt, and every keyframes-owned deferral is terminated:

- **The demo is decomposed to the engine's standard.** The five oversized units
  split into colocated sub-components/sub-composables; `parseCSSAnimationKeyframes`
  dedups to one pure `utils/` module; the mis-filed pure utils
  (`timeline/composables/{timelineEngine,snapshotCapture,flattenVars}.ts`) move
  to `timeline/utils/`; the in-component rAF/timeout blobs ride
  `useRafFn`/`useTimeoutFn`. Net-deletion of duplication, zero behaviour change.
- **The design language is owned, localized, and uncaged.** The four
  demo-referenced-but-demo-unowned idioms (`--rainbow-*`, `--color-gold`,
  `.scale-on-hover`, `@keyframes enter`) are DEFINED in one localized
  design-idiom layer (closes the ungated cross-repo rent — inv η — they resolve
  today via glass-ui/tw-animate-css; D makes the demo own + gate them); the
  component-specific rules leave the `utils.css` monolith for their components'
  `<style scoped>`; arbitrary values + `!`-overrides become
  tokens/`@apply`/scoped CSS; the φ-ladder leaf-tail (89 body sites) migrates
  to the semantic ladder (the chronic, terminated). Isomorphic — pixels
  unchanged unless highly befitting.
- **The brittleness is hardened.** The brittle DOM selectors (the global
  `document.querySelectorAll("pre")`, `.closest(".easing-target")`, the
  `[data-sonner-toaster]` coupling) become owned refs / provide-inject / a
  documented contract; a documented z-index scale tokenizes the layer set; the
  `calc()` chains gain `@supports` guards for `env()`/`-webkit-mask-image`/`dvh`;
  the reactivity bridges (`useAnimationSync` rAF, the `useKeyframesEditor`
  array-watch flush, the `useScrollFade` listener re-attach) are gated.
- **The engine is at its gestalt.** The `AnimationGroup` compositor steady-state
  group path allocates ZERO bytes/frame (inv θ); `tick` means ONE thing at the
  driver layer (`advanceTo(t)`); the computed-unit DOM round-trip writes changed
  keys only; the ~1019-line `Animation` (`src/animation/engine.ts:126-1145`)
  splits at the right seam (`FrameCompiler` vs the playback state-machine); the
  deprecated path-compat re-exports are
  retired; `leaves.ts | any` tightens; `_snapSettled` is symmetric. Net-deletion;
  a major (already declared) absorbs the renames.
- **Every deferral is terminated.** The local dock-rename
  (`TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock`, each composing the
  published glass-ui dock primitives) lands on the glass-ui 3.3.0 pin; the
  `always-expanded="isMobile"` double-tap mask is removed (the B′ fix
  published); the square-scene mobile-composition occlusion is fixed (the
  allowance's stale-check fires when closed); the engine residuals land. Zero
  un-dispositioned punts — D is the terminal home or the recorded KILL.

## § Completion criterion

The development half (D.W0) completes when the audit evidence is on disk (the
frontend / styling / brittleness / engine-transposition lanes, the deferred
ledger, the full prompt-recap under `audit/`), the deferred ledger is complete
with a real disposition per item (zero un-dispositioned punts), the prompt-recap
confirms full coverage, and each wave spec carries a falsifiable hard gate.

The implementation half (D.W1–W6) completes when every wave's hard gate
verifies: the demo is decomposed (the size-budget gate); the design idioms are
defined + localized + the leaf-tail migrated (the no-undefined-idiom sweep +
the monolith-emptied sweep); the brittleness is hardened (the selector +
z-index-scale gates); the engine is at its gestalt (the zero-alloc group-path
gate, the one-`tick` gate, the god-object split); the dock-rename + the
mobile-composition land (the `<Role>Dock` sweep + the occlusion allowance
emptied); FINAL.md terminates the ledger + the changeset cuts.

## § Inherited invariants

D inherits A's + B's + C's invariants and the constellation precepts. They
**continue** — D does not re-litigate them; it carries them forward and adds the
gates its own work needs.

- **inv α — the boundary is gated.** The library imports nothing of value.js'
  DOM surface into its hot path; `proof:boundary` (C-hardened) stays green. D's
  engine transposition (W4) touches only `src/animation/` internals — the
  boundary gate is the standing proof it does not regress.
- **inv β — the library build is glass-ui-free.** Honest disposition (b), prose
  == artefact. D's dock-rename (W5) is DEMO-only; the library graph never
  references glass-ui. The W5 glass-ui pin moves the *demo* dependency to a
  published `^3.3.0`; the library boundary is untouched.
- **inv γ — the demo cannot ship blank.** Holds. D's decomposition (W1) +
  styling localization (W2) are isomorphic — `demo-smoke` is the standing proof
  the paints survive the refactor.
- **inv δ — no page occludes on any viewport.** HARD, both axes, bite-proven
  (C). D *empties its last named allowance*: the square-scene mobile-composition
  occlusion (the one real occlusion C surfaced) is fixed in W5; the
  `occlusion-gate.mjs` allowance's self-cleaning stale-check fires when the fix
  lands, and the gate goes fully HARD with no allowance.
- **inv ε — the close cannot overclaim.** Established + applied in C; D inherits
  it as the standing discipline. Every gate D's FINAL records MET resolves to a
  checked-in, re-runnable instrument shown to PASS — not a narration. D's audit
  IS inv ε turned on C's own close (the three bodies of work + the gestalt tail).
- **inv ζ — the shop-window runs on its own engine.** Established in C; holds.
  D's W1 vueuse adoption (`useRafFn`/`useTimeoutFn`) is the *demo-internal*
  analogue — the same "carry no hand-roll a shipped engine already is" discipline,
  applied to the demo's own rAF/timeout blobs against vueuse. `proof:dogfood`
  stays green (the Three.js renderer remains the justified exception).
- **inv-16 — D writes only keyframes.js.** D is keyframes-internal: it consumes
  the in-flight siblings' *published* surface (value.js-M, glass-ui-AT 3.3.0,
  slides-E/F), plans around their motion, and writes none of them. The glass-ui
  `LabeledField` a11y defect (ASK-3) stays OUTWARD; the dock base is glass-ui's
  arm; D depends only on the *landed* base.

## § D-specific invariants

D continues the Greek series from ζ. Each is named, defined, and carries a
falsifiable hard gate — a re-runnable instrument, not a narration.

- **inv η — no demo idiom ships rented-ungated.** Every CSS custom property,
  utility class, and `@keyframes` the demo *references* MUST resolve to a
  *definition the demo OWNS* — present in the demo's own built CSS, not only via
  a sibling dependency. (This is inv ε applied to the design language: an idiom
  the source uses but rents ungated from a sibling cascade is the same overclaim
  class — a green build whose visual identity is one sibling rename from
  flattening.)
  - **Gate (`proof:idioms`):** a sweep parses every `var(--…)`, every `class=`/
    `:class` utility token in the matched idiom-set (`scale-on-hover`,
    `rainbow-*`, …), and every `animation`/`@keyframes` reference in `demo/`, and
    asserts each resolves to a definition in the DEMO'S OWN built CSS
    (`design-idioms.css`'s contribution), not merely somewhere in the merged
    cascade. FALSIFIABLE: it reds today on `--rainbow-*` / `--color-gold` /
    `.scale-on-hover` / `@keyframes enter` (the four W2 closes) because each has
    NO demo-local definition (they resolve only via glass-ui/tw-animate-css), and
    reds again — falsifiable by stubbing `design-idioms.css` — if any future
    reference has no demo-owned definition. Aligns verbatim with D.W2 S5 clause 1.
    Bite-proven by injecting one `var(--kf-nonexistent)` reference → the sweep
    reddens.

- **inv θ — the AnimationGroup steady-state group path allocates zero
  bytes/frame.** The class declares a zero-alloc discipline (the
  `NumericAnimation`/buffer-reuse pattern). The compositor group path is the lone
  hot loop that violates it (per-frame `groupedValues` object + the
  `properties.has()` whitelist allocation). After D.W4, the steady-state advance
  of a running group MUST allocate zero bytes per frame.
  - **Gate (`proof:zero-alloc`):** a NEW checked-in bench
    (`bench/zero-alloc.bench.ts`) drives a ≥3-child mixed-blend `AnimationGroup`
    (incl. a `layer.properties` whitelist) through ≥120 steady-state frames and
    asserts zero bytes/frame via an allocation-count counting proxy around
    `transformFramesGrouped` OR a `--expose-gc` heap-delta sample (within the
    GC-noise floor the bench calibrates). This is a NEW heap/allocation probe,
    NOT the LoAF timing bench (which measures long-animation-frame *timing* via
    `PerformanceObserver`, not heap). FALSIFIABLE: it reds today (the per-frame
    `groupedValues` allocation shows a non-zero linear heap slope); it goes green
    only when the buffer is hoisted to an instance field + the whitelist inlined.
    Bite-proven by `KF_ALLOC_INJECT=group` re-introducing a per-frame `{}` literal
    in the group loop (mirrors `KF_OCCLUSION_INJECT`) → the slope returns.

- **inv ι — the monolith does not re-fill; the leaf-tail does not regrow.** The
  global `utils.css` monolith holds ONLY genuinely-global rules after W2; the
  component-specific rules live in their components' `<style scoped>`. The
  φ-ladder body tier holds zero raw `text-sm`/`text-xs`/`text-base` rungs after
  the leaf-tail migration. (The localization analogue of inv ζ's consumption
  sweep — debt does not silently return to the monolith.)
  - **Gate (`proof:localized`):** a sweep asserts (a) `utils.css` contains no
    selector matching the component-specific families (`.tab-trigger-*`,
    `.btn-playback*`, `.demo-*`, `.ppmycota-*`, the `[data-state=active]
    [role=tabpanel]` rule); (b) `grep` of the φ-ladder leaf-tail rungs in `demo/`
    body sites == 0 (the chronic, terminated — the same sweep shape as C's
    `grep instrument-serif demo/` = 0). FALSIFIABLE: reds today on both counts;
    reds again on any re-homed-back rule or new raw rung.

These three join inv α–ζ + inv-16; they retire when D closes (the idioms defined,
the group path zero-alloc, the monolith uncaged + leaf-tail migrated) — but the
gates STAY in CI as the standing proof the debt does not silently return.

## § Resolved design decisions

1. **The rented idioms are DEFINED locally, not deleted-because-unused.**
   RESOLVED: `.scale-on-hover` is used 13× and `--rainbow-*` feeds two live SVG
   gradients — they are referenced-and-rented (resolved via glass-ui today,
   ungated), not dead. The fix is a single localized
   `demo/@/styles/design-idioms.css` that DEFINES them (colocation-friendly, one
   home), closing the ungated cross-repo rent by ownership (inv η). Deleting the
   references would change the rendered surface; defining the idioms locally
   makes the demo own the contract the source already intends.

2. **The dock vocabulary CONVERGES with slides — it does not fork.** RESOLVED:
   the rename adopts the canonical `<Role>Dock` role-vocabulary
   (`ChromeDock`/`TransportDock`/`CanvasDock`/`ToolDock`) the constellation
   dock-convergence prescribed and glass-ui AU.W8 ships as a docs-convention +
   base-rename — NOT a keyframes-private naming. `TopDock`→`ChromeDock`,
   `AnimationMenuBar`→`TransportDock` are LOCAL component renames adopting that
   role-vocabulary, each still composing the SAME published glass-ui dock
   primitives it composes today (`GlassDock` +
   `DockLayer`/`DockLayerGroup`/`DockIconButton`/`DockSelectTrigger` — these ship
   in 3.3.0). The local `dock/index.ts` re-export is DELETED (the published
   primitives are the source). There is NO glass-ui `<Role>Dock` base component
   to slot-fill over — a role-typed base is BOOK in glass-ui until a 2nd consumer
   appears; keyframes' role-component-leverage sub-goal is gated on glass-ui
   AU.W8 (a named cross-session edge, circle-back).

3. **The engine god-object splits at the FrameCompiler seam.** RESOLVED: the
   ~1019-line `Animation` (`src/animation/engine.ts:126-1145`, in a 1277-line
   file) carries two separable responsibilities — the
   frame-compilation pipeline (`addFrame` → `parse` → reconcile vars → compute
   times → `AnimationFrame[]` with `interpVars`) and the playback state-machine
   (the run/drive/loop core, the clock, the WAAPI delegation). D splits it into a
   `FrameCompiler` (+ an `AnimationOptions` carrier) vs the playback state-machine
   — the deepest re-architecture, scoped carefully, behind the same public API. A
   major (already declared) absorbs the seam.

4. **`tick` canonicalizes to `advanceTo(t)` at the driver layer.** RESOLVED:
   C.W4 collapsed the *stepper* `tick`/`tickDt` to one canonical `tickDt(ms)`.
   `tick` still means three things at the *driver* layer (the absolute-clock
   advance on `Animation`/`AnimationGroup`). D finishes the canonicalization:
   the absolute-clock advance becomes `advanceTo(t)`; `tick` means ONE thing.
   The major absorbs the rename — no alias, no legacy shim (KISS, no-legacy).

5. **The mobile-composition occlusion is FIXED, not re-allowed.** RESOLVED: C's
   named square/mobile allowance was the honest disposition for a residual; D is
   its terminal home. The optical-split under-reserve (closed-state) + the
   controls-grid row-starve (open-state) are fixed; the `occlusion-gate.mjs`
   allowance's self-cleaning stale-check fires, the allowance empties, the gate
   goes fully HARD. The smallest demo scene gets the same no-occlusion guarantee
   as every other.

6. **Glass-ui-owned defects route outward (unchanged, inv-16).** The glass-ui
   `LabeledField` a11y defect (ASK-3) is glass-ui-owned — D keeps the named
   lighthouse allowance, no vendor band-aid. VAL-9 `--spring-*` codegen (ASK-2)
   is glass-ui-owned — D keeps `springLinearStops()` export stable (the enabler).
   The `<Role>Dock` role-vocabulary + base-rename machinery + the reka-Tabs rail
   + strict-templates are glass-ui-AU's own un-landed AU.W8 arm — D depends only
   on the *landed* dock correctness base + the published primitives, never the
   in-flight rail or a role-typed base component (BOOK until a 2nd consumer).

## § Wave table

| Wave | Title | Phase | Folds / scope |
|---|---|---|---|
| **D.W0** | Audit-fold + the path forward | DEV (now) | This D.md + the W1–W6 specs + PROGRESS; the frontend / styling / brittleness / engine-transposition lanes on disk; the deferred ledger complete (real disposition per item); the full prompt-recap. The D.W0 close = these artifacts. No engine or demo source is written. |
| **D.W1** | The demo decomposed (encapsulation · KISS) | IMPL | Split the 5 oversized units into colocated sub-components/sub-composables (sub-dirs `components/composables/constants/skeletons` where befitting); dedup `parseCSSAnimationKeyframes` → a pure `utils/` module; re-home the mis-filed pure utils (`timeline/composables/{timelineEngine,snapshotCapture,flattenVars}.ts` → `timeline/utils/`); extract the in-component rAF/timeout blobs onto vueuse (`useRafFn`/`useTimeoutFn`). Net-deletion of duplication; zero behaviour change. |
| **D.W2** | The design language localized + uncaged (styling gestalt) | IMPL | **Own the rented idioms** (`--rainbow-*`, `--color-gold`, `.scale-on-hover`, `@keyframes enter` — referenced demo-wide, defined demo-nowhere; resolve today via glass-ui/tw-animate-css) by DEFINING them in ONE localized `demo/@/styles/design-idioms.css` — closes the ungated cross-repo rent (inv η). **Uncage the global monolith**: the component-specific rules in `utils.css` (`.tab-trigger-*`, `.btn-playback*`, `.demo-*`, `.ppmycota-*`, the `[data-state=active][role=tabpanel]` rule) move to `<style scoped>`. **Tailwind idiom**: arbitrary values (`text-[0.65rem]`, `h-[30vh]`, `text-[var(--color-gold)]`) → tokens/`@apply`; the `!`-overrides → scoped CSS. **Terminate the φ-ladder leaf-tail F6** (89 body sites → the semantic ladder — the chronic). Isomorphic: pixels unchanged unless highly befitting. |
| **D.W3** | Brittleness hardened (selectors · reactivity · fragile rules) | IMPL | The brittle DOM selectors → `useTemplateRef`/provide-inject (the global `document.querySelectorAll("pre")` → a scoped ref; `.closest(".easing-target")`/`.querySelector(".track-container")` → owned refs; the `[data-sonner-toaster]` coupling → a documented contract). **A documented z-index scale** (tokenize `z-popover/dock/controls/content/modal/bar` into one ordered layer set). Harden the work-area `calc()` chain + add `@supports` guards (`env()`/`-webkit-mask-image`/`dvh`); the viewport-trap audit. Reactivity: gate the `useAnimationSync` rAF bridge, fix the `useKeyframesEditor` array-watch flush, the `useScrollFade` listener re-attach. + the engine `_snapSettled` symmetry (D-6) lands here. |
| **D.W4** | The engine transposed to its gestalt (elegance · perf) | IMPL (major) | **D-1 [PERF]** `AnimationGroup` compositor zero-alloc (hoist `groupedValues` to an instance buffer; inline the `properties.has()` whitelist) — the headline group path goes allocation-free (inv θ). **D-2 [SIMPLICITY]** finish the `tick` canonicalization at the driver layer — the absolute-clock advance (`Animation`/`AnimationGroup.tick(t)`) → `advanceTo(t)`; one meaning for `tick`. **D-3 [PERF]** the computed-unit DOM round-trip — cache the unflattened key-set, write changed keys only (measure-first). **D-4 [ELEGANCE]** split the ~1019-line `Animation` god-object (`src/animation/engine.ts:126-1145`) at the right seam (`FrameCompiler` + `AnimationOptions` carrier vs the playback state-machine). **D-5** `AnimationGroup.pause` toggle → honest `pause/resume` + `toggle`. Retire the deprecated path-compat re-exports (`utils.ts:37-42`, `format.ts:16`); tighten `leaves.ts \| any`; sweep the stale post-W4 docstrings. Net-deletion; a major absorbs the renames. |
| **D.W5** | The dock leveraged + the mobile composition closed (PARTLY UNBLOCKED) | IMPL | **The dock-rename** (correctness base + touch-gate B′ landed in 3.3.0): `TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock` as LOCAL component renames adopting the AU.W8 docs role-vocabulary, each still composing the published glass-ui dock primitives (`GlassDock` + `DockLayer`/`DockLayerGroup`/`DockIconButton`/`DockSelectTrigger`); DELETE the local `dock/index.ts` re-export; remove the `always-expanded="isMobile"` double-tap mask. There is NO glass-ui `<Role>Dock` base component to slot-fill over — a role-typed base is BOOK in glass-ui (gated on AU.W8, a named cross-session edge). **The square-scene mobile-composition** occlusion terminal (the optical-split under-reserve + the controls-grid row-starve) — inv δ's last allowance empties. The actionable-now scope GATED on glass-ui PUBLISHING 3.3.0 (the correctness base + the touch-gate B′ fix) — D pins the *published* package, not the sibling branch. |
| **D.W6** | Close (recap · deferred terminal · release) | IMPL (LAST) | FINAL.md (the deferred ledger fully terminated — every KFD folded, every OUT booked, every ARCH recorded); the prompt-recap confirmed; the AFTER capture + DELTA via the checked-in harness; the **version owner named** for the stacked changesets (B `3.1.0` + C `major` + D `major`) — the publish leg stays user-domain. |

**Wave count: 7 (D.W0–D.W6)** — 1 DEVELOPMENT (W0, run now) + 6 IMPLEMENTATION.

## § The DAG

```
D.W0 (DEV, now)
  │
  ├─→ D.W1  (demo decomposed — components/composables)   ┐
  ├─→ D.W2  (styling localized + uncaged)                ├─ parallel: file-disjoint
  ├─→ D.W3  (brittleness hardened)                       ┘  (component-vs-style-vs-selector)
  │
  └─→ D.W4  (engine transposed — src/animation/)            parallel to ALL demo waves
         │                                                   (engine src/ ∦ demo @/)
         ▼
       D.W5  (dock leveraged + mobile composition)           GATED: glass-ui 3.3.0 publish
         │
         ▼
       D.W6  (close — recap · deferred terminal · release)   LAST
```

- **W0 → (W1 ∥ W2 ∥ W3):** the three demo waves are largely file-disjoint —
  W1 touches component/composable *structure*, W2 touches *styling*, W3 touches
  *selectors/reactivity*. They parallelize. Where they overlap a shell file, the
  later wave rebases (the same sequencing-allowance discipline C used,
  inv ε-recorded).
- **W4 ∥ all demo waves:** W4 is engine `src/animation/` only — disjoint from the
  demo `@/` tree entirely. It runs parallel to W1/W2/W3.
- **W5 gated on glass-ui 3.3.0 publish:** the local dock-rename + the
  mask-removal + the touch-gate B′ fix all pin the *published* glass-ui ^3.3.0
  correctness surface, never the `at-dock-convergence` branch (consume
  published-not-branches). Until 3.3.0 ships, W5 either circles back to gate-free
  work or heartbeat-polls the constellation RUN-BOARD. Any leverage of a
  glass-ui-side `<Role>Dock` BASE COMPONENT gates separately on glass-ui AU.W8
  (BOOK until a 2nd consumer — a named cross-session edge, circle-back). W5 also
  sequences after W4 (the renamed local docks consume the engine's now-canonical
  `advanceTo`/`pause` surface).
- **W5 → W6:** the close is last — it cannot record the ledger terminated until
  the dock + the mobile-composition land.

## § Constellation-cognizance (inv-16 — D writes only keyframes.js)

D consumes the siblings' *published* surface, plans around their motion, and
writes none of them. The edges, in publish order:

- **glass-ui-AT/AU** — the dock CORRECTNESS base + the touch-gate B′ fix LANDED
  (glass-ui `f0b0ffb`, ships in 3.3.0; unblocks the local renames + mask
  removal); glass-ui is at **3.2.0 (unpublished delta on `at-dock-convergence`)**,
  3.3.0 the AU publish target. D moves the local `file:../glass-ui` pin to a
  published `^3.3.0` once it is on npm, to consume the published dock primitives
  (`GlassDock` + `DockLayer`/`DockLayerGroup`/`DockIconButton`/`DockSelectTrigger`)
  + the touch-gate B′ fix cleanly. D pins the *published* package, NOT the
  sibling branch. The `<Role>Dock` role-vocabulary + base-rename machinery + the
  reka-Tabs rail + strict-templates are AU's OWN un-landed AU.W8 arm — D
  anticipates but does not depend on a role-typed base component (BOOK until a
  2nd consumer; keyframes circles back if AU.W8 lands one). The `LabeledField`
  a11y defect (ASK-3) is glass-ui-owned, outward.
- **value.js-M** — DIRTY/active (v1.0.0, color-API-adjacent). keyframes' *demo*
  consumes value.js (the easing demo: `timingFunctions`/`parseCSSTime`); the
  *library* stays value.js-DOM-free in its hot path (`proof:boundary`). D pins
  the *published* value.js, never M's branch.
- **slides-E/F** — active, double-driven; the spring-dogfood `29a781a` was
  contributed (booked). Shared idioms: the `<Role>Dock` role-vocabulary (the
  AU.W8 docs convention both arms adopt as local rename names) + the `--spring-*`
  token contract. D converges, does not fork — keep `springLinearStops()` stable,
  adopt the same dock role-vocabulary as slides-F.
- **Edges:** consume published-not-branches; gate on keyframes' own green CI
  (inv-27). The only newly-actionable cross-arm edge is the local dock-rename
  (W5), unblocked by glass-ui's landed correctness base + (on publish) 3.3.0; the
  role-typed dock base component leverage is a named cross-session edge gated on
  glass-ui AU.W8 (circle-back).

## § Release

D is a **major**. The changeset (`.changeset/tranche-d.md`, major) renders D's
published surface — the engine transposition (W4: the `tick`→`advanceTo` driver
rename, the `Animation` god-object split, the `pause`→`pause/resume`+`toggle`
honest API, the retired path-compat re-exports). These are intentional renames
behind a deliberately-bumped major; no-legacy, no alias, no shim.

D's major ships alongside the **stacked B `3.1.0` + C `major` changesets** —
both CUT, both unpublished (the publish leg has been user-domain since A). D.W6
names the **version owner** for the stack and renders the combined published
surface; the publish leg (`changeset version` → tag → `release.yml`) stays
**user-domain, confirm-first** — identical to A, B, C. The npm-publish is the
explicit cross-session unblock point the user drives; everything up to
ready-to-publish (CI green, the demo deployed where no fresh publish is needed)
is autonomous.

## § Audit evidence (D.W0 — on disk, sibling-authored)

The development deliverable is the tranche docs + the audit evidence, each lane
authored by a sibling agent into `audit/`:

```
docs/tranches/D/
  D.md                          (this plan)
  PROGRESS.md                   (status board)
  waves/D.W{0..6}.md            (wave specs)
  audit/
    frontend-findings.md        (the 5-oversized-units + dedup + mis-filed-utils + rAF/timeout lane)
    styling-findings.md         (the undefined-idioms + caged-monolith + arbitrary-value + leaf-tail lane)
    brittleness-findings.md     (the brittle-selectors + z-index-scale + calc/@supports + reactivity lane)
    engine-transposition.md     (the zero-alloc + tick-canon + DOM-round-trip + god-object-split lane)
    deferred-ledger.md          (every item — tagged KFD/OUT/ARCH/CLOSED, terminated)
    prompt-recap.md             (every request A→B→C→constellation→D, ADDRESSED or D-SCOPE)
```

The evidence is verified by: (1) the five-lane audit on disk + re-runnable (frontend / styling / brittleness / engine-transposition / deferred-ledger+prompt-recap); (2)
the deferred ledger complete with a real disposition per item (zero
un-dispositioned punts); (3) the prompt-recap confirming full coverage; (4) the
wave specs each carrying a falsifiable hard gate. The IMPLEMENTATION (D.W1–W6) +
its CI gates (`proof:idioms`, `proof:zero-alloc`, `proof:localized`, plus the
size-budget + selector gates each wave adds) open in a later,
explicitly-authorized phase — exactly C's dev→impl boundary, gated on keyframes'
own green CI, isomorphic + no-legacy throughout.

## § Style discipline

Greenfield voice — keyframes.js is the product. D's distinguishing discipline is
*termination*: inv ε turned on C's own close finds the three never-owned bodies
of work + the gestalt tail, and D is the terminal home or the recorded KILL for
every keyframes-owned deferral (P-invariant-28: no perpetual punts). Em dashes
unspaced. Every wave item carries WHAT + WHY; goal + completion paired. D
transposes (architectural transpositions necessary + desirable — no workaround,
no legacy, no alias), defines what the source references (inv η — verified, not
asserted), and keeps every styling change isomorphic (pixels unchanged unless
highly befitting). D is keyframes refining its demo, transposing its engine to
its gestalt, leveraging the dock it can finally lean on, and terminating every
deferral it owns.
