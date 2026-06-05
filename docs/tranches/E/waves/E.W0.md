# E.W0 — Audit-fold + the path forward (the post-D 6-lane assay)

**Phase**: DEVELOPMENT (RUN now). **Ships**: no engine, demo, or library source —
the 6-lane audit evidence on disk (the lighthouse baseline, the modern-web
comparison, the encapsulation / brittleness / styling / perf-modern-web / engine
lanes, the consolidated CLEAN deferred-ledger, the full A→E prompt-recap), and
this plan rendered into the tranche docs (`PROGRESS.md`, `waves/E.W0–W6.md`).
W0 is the dev/impl boundary: it closes E's development half; E.W1–W6 are
authored-now-run-later and open only on explicit user authorization — exactly the
boundary D.W0 used. inv-16 holds: only keyframes.js is written.

W0 is the forcing function that turns E from "more polish on D" into the
**demo-side performance + modern-web + frontend-refinement** tranche — *the layer
after D*. D refined the demo (decomposed the five oversized `animation-controls/**`
units, localized the design language, hardened the brittle querySelectors /
reactivity) and **transposed the engine to its gestalt** (the AnimationGroup
zero-alloc compositor, the `advanceTo` canon, honest `pause`/`resume`/`toggle`,
the `FrameCompiler` seam split, the deprecated re-exports deleted). D closed CLEAN
— it was the terminal home for *every* keyframes-owned deferral (P-invariant-28),
and the published engine is now EXEMPLARY. A 6-agent parallel assay audited the
post-D state against the user's E mandate and found two facts that shape E:

1. **The engine is EXEMPLARY post-D.** No hot-path allocations, modern APIs
   aligned (`scheduler.yield` live-probed, WAAPI maximally delegated,
   reduced-motion unified), ScrollTimeline correctly JS-driven (not a modern-web
   gap — ARCH-1). Only 2 trivial BOOK items remain (the managed-animation pause
   contract as a *comment*; `tryParseCache` eviction *only if measured*). **E
   barely touches the published library.**
2. **The deferred ledger is CLEAN.** D terminated EVERY keyframes-owned deferral.
   There is **ZERO KFE** — nothing folds into an E wave from chronic debt. E's
   content is **net-NEW** refinement findings, surfaced by the post-D assay, NOT
   inherited deferral. This wave states that honestly and proves it.

So E is where D made the demo *correct + localized* and E makes it *fast + modern
+ maximally idiomatic*, finishing the vueuse listener/observer gestalt D.W3 began
(the inv-ζ analogue) and aligning the demo with developer.chrome.com's
modern-web-guidance. W0 measures all of it with file:line evidence so every E
close-condition is concrete + falsifiable, not assumed.

## Items

### W0.1 — The encapsulation (frontend round 2) audit lane

**WHAT**: a frontend-design inventory of the demo's post-D structure, written to
`audit/encapsulation-findings.md`, file:line-grounded with a SHIP/BOOK/LEAVE
disposition and a re-runnable `wc`/`grep` instrument per finding. The spine — the
NET-NEW residual D.W1's `animation-controls/**` decomposition did not target:

- **`demo/app/App.vue` is 452L** (`wc -l` = 452) and conflates THREE separable
  concerns: (a) the scene **router/host** — its legitimate job (the `TopDock`
  wiring, the `EditorShell` slots, the keyed `<Suspense>` host, `switchScene`);
  (b) the **playback-snapshot machine** — `saveCurrentPlaybackState()` (`:286-304`)
  + `restoreGroupPlaybackState(group, savedState)` (`:311-346`), a self-contained
  group-state codec (pure engine choreography, no routing concern); (c) the
  **scene-swap spring** — `sceneSwapSpring = new SpringProgress({…})` (`:244-249`)
  driving the engine-dogfooded cross-dissolve. The codec + the spring are the two
  extractable concerns → `usePlaybackSnapshot.ts` + `useSceneSwap.ts`; the
  router/host shell that remains IS App.vue's job.
- **`useOrbitalPointer.ts` is 376L** (`orbital-drag/composables/useOrbitalPointer.ts`,
  `wc -l` = 376) and conflates **input plumbing** (its legitimate job —
  `startDrag`/`drag`/`handleWheel`/the pointer-capture lifecycle) with
  **transform business-logic** (the `updateLinearTransform`/`updateTranslation`/
  `updateScale`/`handleAxisSpecificInput` appliers that compute the matrix). The
  appliers move to `OrbitalDrag.vue`; the composable thins to pure input plumbing
  receiving them as callbacks.
- **`EasingCurveCanvas.vue` is 351L** (`wc -l` = 351) and is **cohesive** — a
  single-concern canvas renderer (the bezier curve + the easing overlay + the
  hover readout) at the natural seam. It is 1L over the 350 ceiling, not a
  conflation. Disposition: LEAVE (trimmed to ≤350 or a rationale-bearing
  `CEILING_OVERRIDE` entry) — the wave does not split a cohesive unit to satisfy a
  round number.
- Naming, colocation, stores, `markRaw`, `provide`/`inject` are all **idiomatic**
  post-D — verified, not asserted: no finding routes from them.

**WHY**: D.W1 decomposed the `animation-controls/**` family at its natural seams
and brought every one under the ceiling. The post-D assay finds the demo's
*remaining* oversize is the app shell (App.vue) + the orbital seam — units D.W1's
lane did not own. The inventory is the artefact; the fixes route to E.W1. The
file:line grounding is what lets E.W1's `proof:decomposition` (extended) name a
concrete falsifiable ceiling over the EXTENDED sweep + a single-definition grep.

### W0.2 — The brittleness (the vueuse listener/observer gestalt) audit lane

**WHAT**: a robustness inventory written to `audit/brittleness` evidence — the
**big finding**: ~10 manual `addEventListener` / `new ResizeObserver` sites in the
demo's reactive code, NOT on vueuse. C.W3 closed inv ζ (the rAF dogfood) but the
*listener/observer* surface is the analogue inv ζ did NOT cover — net-NEW, the
completion of the dogfood discipline:

- **6 files carry manual `addEventListener`** (15 sites, `grep`-verified):
  `SpringTarget.vue`, `PlaybackRibbon.vue` (with the `once:true` crutch),
  `useDragCapture.ts`, `useOrbitalPointer.ts` (the doc-listener lifecycle),
  `AssetViewport.vue`, `AssetLayerPanel.vue`.
- **3 `new ResizeObserver`** sites: `EasingTarget.vue:231`, `AmigaScene.vue:84`,
  `CSSCodeEditor.vue:156`.
- **2 `querySelector` couplings**: `KeyframeCardList.vue:51`
  (`querySelectorAll("pre")`) and `AnimationControls.vue:190`
  (`[data-state=active]` DOM read). The first collects child `<pre>` nodes by DOM
  walk (→ declared child refs); the second reads the active tab from the DOM
  instead of Vue state (`selectedControl`) (→ owned trigger ref).

These route to E.W2 → `useEventListener` / `useResizeObserver` / owned refs. Each
manual site is hand-rolled bookkeeping a vueuse composable already is (the
`tryOnScopeDispose` leak-safety, the `stop()` handle); the `once:true` crutch is a
single `useEventListener` + `stop()`. The `LISTENER_ALLOWLIST` holds only
genuinely-imperative engine-loop sites, each justified.

**WHY**: manual listeners + observers are the demo's silent fragility — they pass
today but leak on mid-drag unmount and break under refactor. They are the
inv-ζ analogue D.W3's querySelector/reactivity hardening began but did not
complete (D.W3 owned the *fragile-selector* + *reactivity-flush* set; the
*listener gestalt* is the net-NEW E completion). The inventory routes to E.W2,
whose `proof:brittleness` (extended) clause 4 greps the owned-ref forms (zero
manual `addEventListener`/`new ResizeObserver` outside the documented allowlist).

### W0.3 — The styling (design-language round 2, isomorphic) audit lane

**WHAT**: a frontend-design inventory of the demo's post-D design language,
written to the styling lane evidence. D.W2 localized the demo's vocabulary into
ONE owned layer (`demo/@/styles/design-idioms.css` — the `--rainbow-*` family,
`--color-gold`, `.scale-on-hover`, `@keyframes enter`) and uncaged `utils.css`.
The post-D assay finds the NET-NEW residual:

- **`.gold-shimmer` ungated rent** (the inv-η class) — used ×3
  (`AnimationControlsControls.vue:69`, `EasingSelect.vue:23`, `:59`), with **ZERO
  demo-local CSS definition** (`grep '\.gold-shimmer' demo/**.css` over source =
  empty — verified, `dist/` excluded). It resolves TODAY only through the
  transitive `@mkbabb/glass-ui/styles` import — an ungated cross-repo rent that
  flattens silently if glass-ui renames/drops it. → own locally in
  `design-idioms.css`.
- **Recurring arbitrary values → tokens**: `min-w-[12rem]` ×3, `w-[30vw]`,
  `w-[calc(100%-3rem)]` (the magic visualizer-track gutter), `EasingSelect`
  `max-h-[min(24rem,60dvh)]` → named tokens (`--dropdown-min-width`,
  `--target-viewport-w`, `--visualizer-track-gutter`, `--easing-dropdown-max-h`).
- **The `--panel-max-h` unit inconsistency** — defined `60vh` at
  `design-idioms.css:79`, but the dropdown panels use `60dvh`
  (`ResponsiveSelect.vue:58` `max-h-[60dvh]`, `EasingSelect.vue:29`
  `max-h-[min(24rem,60dvh)]`). → reconcile the panel-cap intent to `dvh` (the ONE
  named befitting delta — mobile-correct under an expanded URL bar).
- **`.progress-bar { @apply h-2 rounded-md }` duplicated** in two components →
  dedup to ONE definition in the shared layer.

**WHY**: the `.gold-shimmer` rent is the exact failure-mode D.W2's `proof:idioms`
gate was built to catch — an idiom referenced demo-wide but owned demo-nowhere,
painting correctly today but flattening silently on a sibling rename. The recurring
literals are the post-D tokenization residual; the `vh`/`dvh` split is a real
inconsistency. The inventory routes to E.W3, whose `proof:idioms` (extended) gate
is a rent-closer (the `.gold-shimmer` reference resolves from the demo's OWN built
CSS, falsifiable by stubbing the rule) + a tokenization sweep. Isomorphic — pixels
unchanged except the ONE named `vh→dvh` delta.

### W0.4 — The perf + modern-web alignment audit lane (the executable lane)

**WHAT**: the performance + modern-web inventory written to
`audit/lighthouse-findings.md` + `audit/modern-web-findings.md`, backed by the
**lighthouse baseline** captured to `audit/lighthouse/` (every scene × viewport)
and the `modern-web-guidance` skill installed + digested into a comparison
checklist. This is the only lane needing heavy execution (lighthouse runs +
`npx modern-web-guidance@latest install`) — the audits plan-mode deferred. The
spine:

- **Lighthouse every scene × viewport** — the B baseline (`B/audit/lighthouse/
  after-prod/`, 14 reports, Perf 89–96) re-measured; the honest opportunity is
  the **MOBILE** Performance (desktop is already near-target). Target ≥95 per
  scene, calibrated to the real per-scene mobile delta (`modern-web-findings.md`
  §3.1) — NOT the already-near-target desktop figure.
- **Long-Task / INP relief** on the heavy editing UI (the parse/format path);
  LCP / font-loading; render-blocking; preconnect/preload.
- **`content-visibility:auto` + `contain-intrinsic-size`** for off-screen scenes
  (measure-first — landed only on a positive measurement).
- **Verify reka-ui dialogs/popovers ride native `<dialog>` / Popover API**;
  link-preload-on-hover; container-query / anchor-positioning where it REMOVES
  hand-rolled JS.
- **`npx modern-web-guidance@latest install`** — the guidance corpus on disk
  (`.agents/skills/modern-web-guidance/guides/`), digested into a `proof:modern-web`
  checklist (every row ALIGNED / GAP-closed / N-A-with-recorded-reason).

**WHY**: the engine is modern-API-aligned (W0.5 confirms); the DEMO is where the
modern-web opportunity lives. The inventory routes to E.W4 (the perf wave, which
runs AFTER the demo waves settle so lighthouse measures the final surface). Its
gate is a per-scene lighthouse TARGET (mobile-calibrated, bite-proven against the
recorded baseline) + the `proof:modern-web` checklist instrument. This lane is the
audit EVIDENCE the user's "lighthouse every page + compare vs modern-web-guidance"
mandate requires — captured, not asserted.

### W0.5 — The engine (housekeeping, BOOK-only) audit lane

**WHAT**: an architecture inventory written to `audit/engine-findings.md`,
confirming the headline: **the engine is EXEMPLARY post-D.** The D.W4
transposition (zero-alloc compositor, `advanceTo` canon, honest pause, the
`FrameCompiler` seam, the deleted re-exports, the tightened `leaves.ts` union)
holds; the assay found NO re-introduced legacy, NO hot-path allocation, the modern
APIs aligned. Only TWO trivial BOOK items remain — both NET-NEW, neither folded
debt:

- **E-BOOK-1**: document the managed-animation pause contract — a *comment*, not
  code (the cross-class contract is IMPLEMENTED but undocumented in one place:
  the managed flag set at `group.ts:126`, the pause-propagation at
  `group.ts:523`, the managed-child `play()` throw at `engine.ts:779-782`; the
  consolidated note + cross-link land in `src/animation/CLAUDE.md`).
- **E-BOOK-2**: consider `tryParseCache` eviction (`utils.ts:145`) — ONLY if
  measured to matter (measure-first; else recorded-withheld with the bench, the
  unbounded memo documented as deliberate-on-measurement). No speculative cache
  machinery.

**WHY**: the engine is at gestalt — E records, barely edits (KISS; inv-16's "E
barely touches the published library"). The inventory routes to E.W5 (BOOK-only),
whose gate is `npm test` green + the two BOOK items dispositioned (the contract
documented; the eviction landed-with-a-win or recorded-withheld — P-invariant-28
holds on the measurement, not a speculative ship).

### W0.6 — The deferred ledger (CLEAN) + the prompt-recap (zero drops)

**WHAT**: the consolidated whole-history deferred ledger
(`audit/deferred-ledger.md`) and the full prompt-recap (`audit/prompt-recap.md`).
The ledger chains every item A→E to its terminal status and proves the headline
**item-by-item: there is ZERO KFE.** D was the terminal home for every
keyframes-owned deferral; nothing folds into an E wave from chronic debt. The tags:
**CLOSED** (landed + gated in a prior tranche, E verifies no regression) ·
**KFD-TERMINATED** (a keyframes-owned deferral whose terminal home was a D wave) ·
**OUT** (glass-ui-owned, E keeps the enabler + named allowance stable) · **ARCH**
(permanent KILL, do not re-litigate) · **D-PENDING-ON-E1** (D's own close —
D.W5/W6 gated on glass-ui 3.3.0, NOT E's scope) · **USER-DOMAIN** (the publish
leg). The recap maps every A→B→C→D→constellation→E request to ADDRESSED /
PENDING(D's) / E-SCOPE(net-new) / HONORED(precept), with zero drops; the two
historical drifts (B's falsely-closed LoAF; B's advisory inv δ) are recorded as
*corrected-in-C, preserved*, not dropped.

**WHY**: the user's directive across every tranche is P-invariant-28 — no
perpetual punts — AND, for E, an HONEST accounting: E's content is net-NEW, not
folded debt. The ledger is that honesty made falsifiable: the **zero-KFE** claim
is grep-checkable (no row folds chronic debt into an E wave), and the net-new
E-SCOPE findings live in the prompt-recap's §E-SCOPE table (they are *findings*,
the E waves themselves — not deferrals). The recap is the provable-coverage
artefact the "recap all our prompts" mandate requires.

## The consolidated deferred ledger (CLEAN — zero KFE)

The whole-history ledger (`audit/deferred-ledger.md`) carries every item A→E. The
terminal-status summary, item-by-item:

| Item | Origin | Terminal status | Owner / E duty |
|---|---|---|---|
| `proof:boundary` (value.js light/heavy seam) | A (inv α), hardened C | **CLOSED** standing gate | E keeps green |
| inv γ (the demo paints) | B.W4 | **CLOSED** standing | E.W4 keeps painting after preload/font/content-vis |
| inv δ (no occlusion) | B→C HARD | **CLOSED** standing (1 allowance → D.W5) | E no-regression |
| LoAF / >50ms 2nd consumer | A→B-drift→C-fix | **CLOSED** (corrected) | E.W4 aligned (headroom, never regress) |
| inv ζ (the rAF dogfood) | C.W3 | **CLOSED** standing | E.W2 = the *listener* analogue (net-NEW) |
| inv ε (the honest close) | C | **CLOSED** discipline | E gates are instruments, never narration |
| the C demo-polish set | C | **CLOSED** | E.W3 no-regression |
| φ-ladder (display C, leaf-tail D) | CHRONIC A→B→C→D | **CLOSED** — the chronic ENDED in D | E.W3 introduces no raw body rung |
| engine W0-slips (`_snapSettled`/`\|any`/re-exports) | C.W0-booked | **KFD-TERMINATED** D.W3/W4 (landed) | none |
| square/mobile occlusion | C-named | **KFD-TERMINATED** D.W5 (D-PENDING) | D's close, NOT E's |
| dock-rename + `dock/index.ts` deletion | constellation | **KFD-TERMINATED** D.W5 (D-PENDING) | D's close, NOT E's |
| `always-expanded="isMobile"` mask | C-residue | **KFD-TERMINATED** D.W5 (D-PENDING) | D's close, NOT E's |
| ASK-3 `LabeledField` a11y | B ask | **OUT** (glass-ui) | E keeps the named lighthouse allowance |
| ASK-2 / VAL-9 `--spring-*` codegen | A ask | **OUT** (glass-ui) | E keeps `springLinearStops()` stable |
| ASK-1 dock double-tap | B ask | **OUT — RESOLVED** (→ D.W5 mask) | none |
| AU.W8 rail / strict-templates / `<Role>Dock` base | constellation | **OUT** (glass-ui AU) | E takes no dependency |
| ScrollTimeline-native · Worker/OffscreenCanvas · dev.sh | A | **ARCH** | recorded; do NOT re-litigate |
| D.W5 (dock + occlusion close) | D | **D-PENDING-ON-E1** | D's close, NOT E's |
| D.W6 (D FINAL + version owner) | D | **D-PENDING-ON-E1** | D's close, NOT E's |
| the stacked publish leg | A→E | **USER-DOMAIN** | confirm-first |

**Zero KFE.** No row folds chronic debt into an E wave. Every keyframes-owned
deferral is CLOSED or terminated in a D wave; the only "open" items are OUT
(glass-ui-owned, E keeps stable), ARCH (recorded KILL), D-PENDING (D's close), or
USER-DOMAIN (publish, by design). **P-invariant-28 holds for E: E folds no chronic
debt because none remains.** E's content (encapsulation r2 · the vueuse-listener
gestalt · styling r2 · perf + modern-web · engine housekeeping) is NET-NEW —
surfaced by the post-D 6-lane assay, NOT inherited deferral. The net-new findings
are the E waves themselves, tabled in `prompt-recap.md` §E-SCOPE.

## The prompt recap (all addressed — net-new stated honestly)

Every request across A → B → C → D → the constellation drive → this E ask resolves
**ADDRESSED** (landed + verified in a prior tranche), **PENDING** (a D-owned close
gated on glass-ui 3.3.0 — D.W5/W6, NOT E's scope), **E-SCOPE** (a net-NEW E
finding with a named E wave + file:line evidence), or **HONORED** (a recurring
precept threaded through). No drops. The full table is authored into
`audit/prompt-recap.md`; the two historical drifts (B's falsely-closed LoAF; B's
advisory inv δ) are recorded as *corrected-in-C, preserved*. The recurring precepts
(no-legacy, no-workaround, idiomatic+gestalt, isomorphic, KISS, inv-16) are each
verified HONORED across A→E — file:line- or plan-grounded, never asserted. The only
un-orphaned-by-design loose end is the stacked publish leg (USER-DOMAIN — D names
the B/C/D version owner at D.W6; E names its own at E.W6).

## Hard gate

W0 closes when the development half of E is complete on disk **and re-runnable**:

1. the **6-lane audit** is on disk (`audit/encapsulation-findings.md`,
   `audit/brittleness` evidence, `audit/styling` evidence,
   `audit/lighthouse-findings.md` + `audit/lighthouse/` (the captured baseline),
   `audit/modern-web-findings.md`, `audit/engine-findings.md`,
   `audit/deferred-ledger.md` + `audit/prompt-recap.md`), each finding carrying a
   file:line citation and a `wc`/`grep`/lighthouse instrument that re-executes
   from the repo;
2. the **deferred ledger is CLEAN** — every item tagged terminal
   (`CLOSED`/`KFD-TERMINATED`/`OUT`/`ARCH`/`D-PENDING-ON-E1`/`USER-DOMAIN`) with
   a real disposition; **ZERO KFE** (no row folds chronic debt into an E wave —
   P-invariant-28 holds because none remains);
3. the **prompt-recap** confirms every A→E request ADDRESSED / PENDING(D's) /
   E-SCOPE(net-new) / HONORED, with zero drops;
4. every **E.W1–W6 spec** carries its own falsifiable hard gate (a re-runnable
   `proof:*` instrument, not a narration).

**The falsifiable instrument** — the audit evidence is on disk + re-runnable: each
lane's headline figure is a re-executable command, not a claim. Re-running them
reproduces the audit (or reddens it if the tree drifts):

```sh
# encapsulation (W0.1): the post-D residual oversize
wc -l demo/app/App.vue \
      demo/@/components/custom/orbital-drag/composables/useOrbitalPointer.ts \
      demo/@/components/custom/EasingCurveCanvas.vue
#   452 / 376 / 351 — App.vue + useOrbitalPointer over the E.W1 ceiling

# brittleness (W0.2): the manual listener/observer sites (dist excluded)
grep -rln 'addEventListener\|new ResizeObserver' demo --include='*.ts' --include='*.vue' \
  | grep -v node_modules | grep -v '/dist/'
#   9 files (SpringTarget, PlaybackRibbon, useDragCapture, useOrbitalPointer,
#   AssetViewport, AssetLayerPanel, EasingTarget, AmigaScene, CSSCodeEditor)

# the gold-shimmer rent (W0.3): used ×3, defined demo-nowhere
grep -rn 'gold-shimmer' demo --include='*.vue' | grep -v '/dist/'   # 3 USE sites
grep -rn '\.gold-shimmer' demo --include='*.css' | grep -v '/dist/' # 0 DEMO-LOCAL defs (resolves via glass-ui)

# the clean ledger (W0.6): ZERO KFE — no row folds chronic debt into an E wave
# (grep the disposition tag in a TABLE CELL, not the prose: KFE never appears as
#  a row tag, so the count is 0; a `grep -c 'KFE'` would count the prose
#  "ZERO KFE" mentions and is NOT the gate.)
grep -cE '\|[^|]*\bKFE\b' docs/tranches/E/audit/deferred-ledger.md   # 0 — KFE is never a row tag (it would be, if any chronic debt folded into an E wave)
```

Every deferral carries a terminal disposition — **P-invariant-28** holds, and for
E it holds VACUOUSLY: there is no chronic debt to fold (zero KFE). **Status: MET**
when the 6-lane audit + the captured lighthouse baseline + the two ledgers are on
disk and the four instruments above re-execute from the repo. W0 is the dev/impl
boundary — E.W1 through E.W6 are authored and gated, and open only on explicit user
authorization, on keyframes' own green CI.

## Folds

W0 retires (by id, into the items above): the encapsulation inventory (W0.1 →
E.W1); the brittleness / vueuse-listener inventory (W0.2 → E.W2); the styling
design-language r2 inventory incl. the `.gold-shimmer` rent (W0.3 → E.W3); the
perf + modern-web inventory incl. the lighthouse baseline (W0.4 → E.W4); the engine
housekeeping inventory (W0.5 → E.W5); the consolidated CLEAN deferred-ledger
(zero KFE) + the prompt-recap (W0.6 → the per-wave folds + E.W6's confirmation).

## Design decisions

1. **W0 is RUN, not authored-now-run-later.** Like D.W0, E.W0's work happens NOW
   — the 6-lane audit, the captured lighthouse baseline, the installed +
   digested modern-web-guidance, the CLEAN ledger, the recap, this plan → the
   tranche docs. It produces no engine, demo, or library source, so it honors
   "tranche development only"; it IS the development half.
2. **The audit is file:line-grounded + re-runnable, not narrated.** Each lane's
   headline figure is a re-executable `wc`/`grep`/lighthouse, so the audit is an
   instrument (the W0 hard gate above), not an assertion — matching D's
   verified-not-asserted discipline (inv ε).
3. **E's content is NET-NEW, stated honestly.** The deferred ledger is CLEAN
   (zero KFE — D was the terminal home for every keyframes-owned deferral). E
   folds no chronic debt because none remains; the E waves are findings from the
   post-D assay, NOT inherited deferral. This is the honesty the plan demands —
   E is the layer *after* D, not a re-litigation of it.
4. **E barely touches the published library (inv-16).** The engine is EXEMPLARY
   post-D; E.W5 is BOOK-only (a comment + a measure-gated micro-edit). E writes
   ONLY under `keyframes.js/docs/tranches/E/` in this DEV phase, and only `demo/`
   (+ the BOOK-only engine touch) in the IMPL phase. The glass-ui asks (OUT-1..4)
   stay OUTWARD; D's close (D.W5/W6) is D's, gate-free of E.
