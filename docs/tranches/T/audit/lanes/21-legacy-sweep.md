# Lane 21 — Legacy / Deprecated / Workaround / Fallback Sweep (VERDICT #28)

**Surface**: the standing "legacy code / temporary workarounds / fallback-or-fail /
effusive dynamism / nested imports / test-files-in-src / duplicated effort / dead exports /
KEEP:-labeled sites" litany re-issued verbatim by VERDICT #28, swept over **both** `src/`
and `demo/`. Read against `tranche-s-impl`, static + one heuristic dead-export scan, glass-ui
4.0.1 census — **no source changed**.

## Method + the governing meta-fact

The S waves swept `src/` HARD. The evidence: **zero** `TODO`/`FIXME`/`HACK`/`XXX` markers in
`src/` (`grep -rniE '\b(todo|fixme|hack|xxx)\b' src` → empty); **zero** test files in `src`;
**zero** empty/silent `catch {}` in either tree (every catch carries a `KEEP:` rationale or
rethrows); only **7** `: any`/`as any` in all of `src` (all legitimate generic erasure —
`CSSKeyframesAnimation<any>` in `validate.ts`, `NOOP_TRANSFORM: TransformFunction<any>`); the
two package-level `@deprecated` mentions (`index.ts:62,280`) describe aliases that were
**DROPPED** in 5.0.0, not live ones. `src` is clean.

So the residue is not "un-swept src." It is a **narrower, more stubborn class**: workarounds
that were *converted* rather than removed — three glass-ui-4.0.1 vendor-bug band-aids that each
independently re-declare "P-invariant-28 forbids the Nth carry" and survive anyway; one deferred
src cure that outlived its wave and became a permanent guard; one architectural coupling that
forces every light scene to *fabricate a fake `AnimationGroup`*; and the demo's un-swept
underbelly (113 `any`, ~37 dead exports, a throttle duplicated across four scenes) that never
received the discipline `src` did. This is the exact "green source-shape gates miss what
survived" pattern the tranche meta-fact names — `proof:workaround-deletion`,
`proof:no-orphan-module`, and `proof:no-dead-dependency` are all GREEN on this tree, and none of
them sees a single item below.

## Finding table — EXCISE / FAIL-EXPLICIT / KEEP

| # | Class | Site(s) | Disposition | Severity |
|---|---|---|---|---|
| 1 | Vendor-bug band-aid COMPONENT (glass-ui `SegmentedTabs` aria bug) | `@/components/custom/KfPillTabs.vue` + `useKfPillTabs.ts`; consumers `SpringSidebar.vue:45`, `AnimationControls.vue:74` | **EXCISE** → glass-ui `Tabs` | High (VERDICT #18 by name) |
| 2 | Vendor-bug band-aid HANDLER, workaround-on-workaround (glass-ui dock crossfade strand) | `TransportDock.vue:315-351` + `usePlayActuation.ts` (DM-1 KILL) | **EXCISE on upstream fix / delineate gap** | Medium |
| 3 | Vendor-affordance band-aid (glass-ui dock press-scale strands the reka click) | `MbabbMenu.vue:10-24,90-138` (D9 pointerdown-synthesis) | **EXCISE on upstream fix / delineate gap** | Medium |
| 4 | Placeholder `AnimationGroup` fabricated for a hard type-coupling | `app/runtime/useContractAnimGroup.ts`; 3 consumers (spring/easing/sequence) | **EXCISE via transport-source abstraction** | Medium (ties VERDICT #25) |
| 5 | DEFERRED src cure that became a permanent guard; latent NaN at sample-time | `compile/frame-compiler.ts:341` (P.W9 / DM-22) | **FAIL-EXPLICIT (already is) — retire deferral framing or build resolution** | Low |
| 6 | Duplicated "few-Hz cold-path reactive readout" throttle across ≥4 scenes | `useEasingDemo.ts:218`, `useSpringDemo.ts:229`/`useSpringHotPath.ts:114`, `AmigaScene.vue:151`, `useSequenceDemo.ts:194` | **DRY into one composable** | Low–Medium |
| 7 | Effusive dynamism — demo never got src's strictness sweep | 113 `any` in `demo/` vs 7 in `src/` | **Tighten + gate** | Low–Medium |
| 8 | Dead exports (no `proof:no-dead-export` gate exists) | `kfEngine.ts:59 kfEngineReady` (fully dead) + ~6 dead types + ~30 reflexive composable `*Params`/`*Return`/`*Deps` interfaces | **EXCISE the dead fn/types; gate the rest** | Low |
| 9 | Legacy-NAMED but LIVE witness (isomorphism bridge, defensible) | `cube/orbital-drag/composables/inertiaDecay.ts` (`TARGET_DT`, "legacy per-frame friction") | **KEEP (rename only)** | Info |

---

## 1. `KfPillTabs` — a kf-internal ARIA component that exists ONLY to route around a glass-ui bug

`demo/@/components/custom/KfPillTabs.vue:2-4` states its own reason for being:

> `<!-- R.W6 / DM-5 CONTINGENCY KILL — a kf-internal, ARIA-compliant pill tab … forcing an
> undefined-suppress at the two band-aid sites (SpringSidebar + AnimationControls) that
> P-invariant-28 forbids re-carrying) -->`

The component and its `useKfPillTabs.ts` roving-tabindex core (Lane 18 finding #4 covers the
roving-arithmetic duplication) exist **solely** because glass-ui 4.0.1's `SegmentedTabs`
emits `aria-orientation` unconditionally on its `role=group` pill variant — a vendor
accessibility bug. It is used at exactly two sites: `SpringSidebar.vue:45` and
`AnimationControls.vue:74`.

**glass-ui census confirms the replacement exists NOW.** `node_modules/@mkbabb/glass-ui@4.0.1`
ships `dist/components/ui/tabs/` **and** `dist/styles/segmented-tabs.css` +
`dist/composables/motion/useLiquidFlex.d.ts` — i.e. the SegmentedTabs surface is present; only
the aria-orientation emission is wrong. This is squarely VERDICT #18: *"wtf are most of these
items? KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?"*

**Root cause / design gap**: an upstream a11y defect was worked around by *forking the whole
component into the demo* rather than (a) filing it against glass-ui BG/BH and (b) carrying a
one-line local override until the fix lands. The band-aid then acquired its own maintenance
surface (a second roving-tabindex engine, Lane 18 #4). Note the compounding self-justification:
each consumer site's comment re-asserts "P-invariant-28 forbids re-carrying" — the mandate
against carrying the band-aid was invoked *to keep the band-aid*.

**Disposition — EXCISE.** VERDICT #12/#18 redesign the spring/easing preset surfaces
wholesale to the cube/amiga/square controls-model, so both `KfPillTabs` call sites are being
rebuilt anyway; the pill component dies with that redesign. Where a tab strip genuinely remains,
it is glass-ui `Tabs`/`SegmentedTabs` + (until BG/BH) a single-selector aria-orientation
override, not a forked component.

## 2. The DM-1 crossfade-strand band-aid — a workaround that reintroduced two defects

`TransportDock.vue:315-343` narrates a workaround-on-workaround chain around a glass-ui dock
defect (`glassCaps.dockStrandKeepalive = false`, GU-Q2): the dock's collapse-crossfade sets the
active `.dock-layer` to `pointer-events:none` before the browser synthesizes the trailing
`click`, stranding a `@click`-only play toggle. The "DM-1 CONTINGENCY KILL" excised the native
`click` path in favor of a crossfade-independent `pointerup`/`keyup` handler — but
`usePlayActuation.ts:7-22` records that the KILL itself **reintroduced two defects** it then had
to re-fix:

> `TWO DEFECTS THE DM-1 CONTINGENCY KILL reintroduced when it excised the native click path …
> · F2 (auto-repeat): actuating on RAW keydown … holding the key rapid-TOGGLES play …
> · F3 (press-origin): actuating on ANY pointerup over the button …`

So the demo now hand-reimplements native `<button>` click semantics (press-origin dedupe,
Space-on-keyup, Enter-repeat-guard) from disjoint pointer/keyboard sources — a full
re-derivation of the platform affordance — because the durable cure (a glass-ui dock-layer
keepalive) *"the consumed dist does NOT carry"*.

**Root cause / design gap**: a glass-ui gap (crossfade strands synthesized clicks) is patched in
the *consumer* rather than delineated as an upstream ask. The patch's cost is a bespoke
event-semantics engine that has to be tested (`usePlayActuation` was extracted for exactly that)
and can drift from the two mirrored controls.

**Disposition — delineate as a glass-ui gap (VERDICT #27), EXCISE on upstream fix.** The
crossfade-independent handler is the correct *interim*, but it must be tagged to the specific
glass-ui capability (`dockStrandKeepalive`) so a version tripwire forces its removal when BG/BH
ships the keepalive — not carried forward as permanent demo-owned platform-reimplementation.

## 3. `MbabbMenu` — a THIRD instance of the same glass-ui-gap band-aid

`MbabbMenu.vue:10-24` is the same shape a third time, against a *different* glass-ui 4.0.1
defect: the dock press-scale affordance (`:active { scale: var(--scale-press-dock) /* .96 */ }`)
shrinks the trigger pill mid-press, so `pointerup` lands off the trigger and reka never
synthesizes the `click` that would open the `DropdownMenu`:

> `FIX (product seam, no reka/glass-ui patch): on the trigger's POINTERDOWN we SYNTHESISE the
> click reka needs … and kill the trailing native click`

**Root cause / design gap**: identical to #2 — a glass-ui affordance (press-scale) breaks a
glass-ui/reka interaction (click synthesis), worked around demo-side with hand-synthesized
pointer events. Three separate files (`KfPillTabs`, `TransportDock`/`usePlayActuation`,
`MbabbMenu`) now each carry a bespoke glass-ui-4.0.1 band-aid, each with its own "no glass-ui
patch" prose, **none pointing at a shared ledger** — so there is no single place a reviewer can
see "these three die when glass-ui BG/BH lands," and no gate fails when it does.

**Disposition — consolidate into ONE glass-ui-gap ledger + a version tripwire.** See T-rec 1.

## 4. `useContractAnimGroup` — every light scene fabricates a fake `AnimationGroup`

`app/runtime/useContractAnimGroup.ts:12-25` documents an "escape hatch": the bottom-bar
transport (`AnimationControlsGroup` → `ControlsPaneWrapper`/`TransportDock`/readout) requires an
`AnimationGroup` handle, but the light-tracker scenes (spring/easing/sequence — driven off
`SpringProgress`/`NumericAnimation`/the easing sweep) have **no** group. So each constructs a
minimal opacity-only `AnimationGroup` retained *"ONLY as the transport host — it drives no scene
motion and is NOT a playback authority"* (consumers: `useSpringDemo.ts:372`,
`useEasingDemo.ts:336`, `useSequenceDemo.ts:164`).

**Root cause / design gap**: the transport UI is hard-typed to the concrete `AnimationGroup`
class instead of a transport-source *interface* (`{ paused, started, t, duration, … }`). Three
scenes pay for that coupling by constructing a dummy engine object, marking it `markRaw`,
pre-starting it, and running a one-way `watch(isPlaying)` projection into its `paused` — pure
ceremony to satisfy a type. This is the same "we forgot about that facility entirely" gap
VERDICT #25 names from the other side: the transport facility was built around one concrete
authority, so anything that isn't that authority has to impersonate it.

**Disposition — EXCISE via a `TransportSource` abstraction** the light scenes implement
directly (their real `SpringProgress`/sweep IS the progress authority), deleting the placeholder
group. This is an architectural transposition, exactly the kind VERDICT #28/#51 invites.

## 5. `frame-compiler.ts:341` — the DM-22 deferral that outlived every S wave

`src/animation/compile/frame-compiler.ts:341`:

> `// P.W9 (DM-22 named-selector NaN-frame) — DEFERRED to a follow-up wave. … The correct cure
> is NOT a throw at parse() … it is a deferred-resolution step that maps the named phase to a
> numeric % … carried to its own wave; here we keep the shipped (tranche-L) behavior: named
> frames round-trip; the NaN is latent at sample-time only`

The "correct cure" (resolve a named scroll selector — `entry`/`exit`/`cover`/`contain` — to a
numeric `%` at attach time) was **DEFERRED to a follow-up wave** back at tranche P and never
built; it survived Q, R, and all of S still marked DEFERRED. The interim is a play-time guard
(`play-lifecycle.ts:371 assertNoUnresolvedNamedSelector()`) that **does** throw fail-explicit —
verified — so a bare `play()` without a timeline refuses rather than running NaN frames. Good.

**Root cause / design gap**: this is *not* a silent fallback (the guard is honest), so severity
is LOW — but it is the one live "DEFERRED to a follow-up wave" marker still in `src`, and the
"latent NaN at sample-time" it describes is real for any code path that samples frames without
going through `play()` (a raw `interpFrames()` on an unresolved named selector). Either build the
deferred-resolution step (the named phase → `%` map at `bindTimeline`), or — if the play-time
guard IS the accepted terminal contract — retire the "DEFERRED to a follow-up wave" framing so
the comment stops advertising an unbuilt cure.

**Disposition — FAIL-EXPLICIT (already is at play); decide: build or de-defer.**

## 6. The "few-Hz cold-path readout" throttle, hand-rolled in four scenes

The identical pattern — *sample the 60 Hz rAF hot value into a reactive ref at
`PROGRESS_READOUT_HZ` so the numeric readouts don't thrash Vue reactivity* — is re-implemented
independently in at least four scenes:

- `useEasingDemo.ts:218` — `// Cold path — write the reactive readout at a few Hz only`
- `useSpringDemo.ts:229` + `useSpringHotPath.ts:114-115` — `// Cold path — the reactive readout
  mirrors at a few Hz only`
- `AmigaScene.vue:151` — `// readout at a few Hz (NOT 60 Hz — the cold path)`
- `useSequenceDemo.ts:194` — `this loop only mirrors the playhead into the reactive readout`

**Root cause / design gap**: no shared `useThrottledReadout(hz)` seam, so the hot/cold split
(the correct performance idiom — VERDICT #19 explicitly indicts perf) is re-derived per scene,
each with its own `PROGRESS_READOUT_HZ` constant and accumulator. DRY violation; also a place
where a *single* fix to the throttle cadence would today require four edits.

**Disposition — DRY into one composable.** See T-rec 4.

## 7. Effusive dynamism — the demo never received src's strictness sweep

`src/` carries **7** `any` (all justified generic erasure). `demo/` carries **113**
(`grep -rnE ':\s*any\b|as any\b|<any>|any\[\]|Record<string,\s*any>' demo`). Of those, only 4
are the semi-idiomatic Vue template-ref callback (`:ref="(el: any) =>"`) and 8 are `as any`
casts; the remaining ~100 are `: any` annotations, concentrated in the keyframes-editor
(`KeyframeCardList.vue`, `useKeyframeOps.ts`, `KeyframesStringControls.vue`), the option stores
(`animationOptionsStore.ts`), and the scene demos. `src` is `strict` +
`noUncheckedIndexedAccess` disciplined; `demo` shares the same `tsconfig` posture but never had
the `any` swept out.

**Root cause / design gap**: the S refactor invested in `src` type-honesty and left the demo's
dynamism where it was. VERDICT #26 ("demo/@ is totally half baked and inconsistent") is partly
this: `any` at store/composable boundaries erases the very contracts a "properly composed"
demo would type.

**Disposition — tighten during the demo restructure + add a ceiling gate.** See T-rec 5.

## 8. Dead exports — no gate patrols them

A dead-export scan (definitions in `demo`+`src` `.ts`, usage corpus = all `.ts`+`.vue`+`.mjs`
across `demo`/`src`/`test`/`scripts`, whole-word match) surfaces ~37 exports with **zero**
external consumer. One is fully dead code: `demo/@/utils/kfEngine.ts:59 export const
kfEngineReady = () => resolved !== null` — defined, exported, referenced nowhere. ~6 are dead
types (`easingGroups.ts CurveGroup`, `scenes.ts StageMode`, `loaf-observer.ts LoAFRecord`,
`useSequenceDemo.ts SequenceRow`, `useSpringDerby.ts DerbyLane`, `useSpringHotPath.ts
SpringPainter`). The remaining ~30 are reflexively-exported composable `*Params`/`*Return`/
`*Deps`/`*Options`/`*Handlers` interfaces — a systemic ceremony where every composable exports
its own parameter/return type even when nothing outside the file names it
(`usePaneRegister.ts`, `useSheetState.ts`, `useScrollFade.ts`, `useAnimationGroupActions.ts`,
`usePlayActuation.ts PlayActuationHandlers`, …). `STORE_TTL_MS` is a near-miss (used internally
at `storeUtils.ts:16` — needn't be exported, but not dead).

**Root cause / design gap**: `proof:no-orphan-module` and `proof:no-dead-dependency` gate the
*module* and *dependency* levels; nothing gates a dead *export*. Vue-composable convention
("export the shape") normalizes exporting types nobody imports.

**Disposition — EXCISE `kfEngineReady` + the 6 dead types; gate the rest** so the reflexive
interfaces are either consumed, inlined, or un-exported. See T-rec 6.

## 9. Legacy-NAMED but live — audited, KEEP

`cube/orbital-drag/composables/inertiaDecay.ts` names a "legacy per-frame friction" form and a
`TARGET_DT` constant, LIVE-imported by `useOrbitalInertia.ts:16`. It is **not** dead code: it is
a documented isomorphism *bridge* (the legacy discrete `Math.pow(inertiaFactor, dt/TARGET_DT)`
form ↔ the engine's analytic `decay()`, `k = −ln(inertiaFactor)·60`) that lets the felt
decay-rate match the pre-refactor tuning. Cube is not VERDICT-condemned. **KEEP** — the only
residue is the "legacy" *naming*; rename `TARGET_DT` → `REFERENCE_FRAME_DT` and drop "legacy"
from the prose so it reads as a parity anchor, not dead history. (`motionPathGeometry.ts:76
LEGACY_PATH_D` is the same shape but motion-path is VERDICT #23-condemned — it dies with the
scene; prune-triage owns it.)

**KEEP-site audit (the 15 `KEEP:` markers)**: all defensible. The catch-swallows
(`useOrbitalPointer.ts:191` iOS release throw, `AmigaScene.vue:220` private-mode sessionStorage,
`play-lifecycle.ts:305`/`adopt.ts:277` already-cancelled WAAPI, `useDragScrub.ts:122` capture
unavailable) each swallow a *specific, expected, recoverable* platform throw with a stated
reason — befitting, not silent-generic. The two `easing-registry.ts:86,114` fall-throughs are
fail-explicit by construction (a malformed `steps()`/`linear()` degrades to the registry lookup,
*"never a silent wrong curve"*) — correct. No KEEP: site needs excision on its own merits.

---

## T recommendations

1. **Consolidate the three glass-ui-4.0.1 band-aids into ONE gap ledger with a version
   tripwire.** Scope sketch: a single `demo/glass-ui-gaps.ts` registry naming each consumed-dist
   defect (`segmentedTabsAriaOrientation`, `dockStrandKeepalive`, `dockPressScaleClickStrand`)
   with the workaround site and the glass-ui version expected to fix it; every band-aid
   (`KfPillTabs`, `usePlayActuation`, `MbabbMenu`) imports and cites its entry. Falsifiable gate:
   `proof:glass-ui-gap-tripwire` reads the installed `@mkbabb/glass-ui` version + a
   capabilities probe (the `glassCaps` shape `proof:workaround-deletion` already uses) and
   **fails** when a ledger entry's fix-version is satisfied while its workaround site still
   exists — forcing excision at the moment the gap closes, instead of N independent
   "P-invariant-28 forbids the Nth carry" comments that never fire. Size: **M**.

2. **Retire `KfPillTabs` onto glass-ui `Tabs`/`SegmentedTabs`.** Scope sketch: in the same wave
   that rebuilds the spring/easing surfaces to the cube/amiga/square controls-model (VERDICT
   #12/#18), delete `KfPillTabs.vue` + `useKfPillTabs.ts` and route both call sites through
   glass-ui's tab component + (until BG/BH) a single scoped `aria-orientation` override behind a
   ledger entry (T-rec 1). Falsifiable gate: `grep -r KfPillTabs demo/` → 0, and the two
   surfaces render a `role=tablist` with correct aria (extend `proof:brittleness`/the a11y
   probe). Size: **M** (rides the surface redesign).

3. **Replace the placeholder `AnimationGroup` with a `TransportSource` interface.** Scope
   sketch: define the minimal transport contract the bottom bar actually reads
   (`{ paused, started, t, duration, play/pause }`); have the light scenes'
   `SpringProgress`/sweep authority satisfy it directly, and delete `useContractAnimGroup.ts` +
   its three dummy-group constructions. Falsifiable gate: `proof:no-placeholder-group` —
   `grep -r "opacity-only placeholder\|useContractAnimGroup" demo/` → 0, and the transport shell
   type-checks against `TransportSource`, not `AnimationGroup`. Size: **M**.

4. **DRY the hot/cold readout throttle into one composable.** Scope sketch: one
   `useThrottledReadout(source, hz)` (or `useHotColdReadout`) owning the `PROGRESS_READOUT_HZ`
   accumulator + reconcile-on-settle; the four scenes consume it. Falsifiable gate: a census —
   the "few Hz cold-path readout" throttle exists in exactly 1 file, and each scene's readout ref
   is written only through it. Size: **S**.

5. **Sweep `demo` `any` to a bounded ceiling under a gate.** Scope sketch: type the store/
   composable/keyframes-editor boundaries that carry the ~100 bare `: any` annotations; keep the
   handful of genuinely-dynamic seams behind an explicit allowlist. Falsifiable gate: extend the
   existing demo hygiene gate with an `any`-count ceiling (start at the swept number, ratchet
   down) that reds on a fresh un-allowlisted `any` — the same ratchet shape `known-violations`
   used for the engine cycle count. Size: **M**.

6. **Add `proof:no-dead-export` and excise the confirmed-dead symbols.** Scope sketch: delete
   `kfEngineReady` + the 6 dead types; un-export `STORE_TTL_MS`; decide the ~30 reflexive
   composable interfaces (consume, inline, or un-export). Falsifiable gate: `proof:no-dead-export`
   (a `knip`-shaped scan, or the ~40-line node script this lane used, wired into
   `proof:hygiene-chain`) reports zero exported symbols with no consumer across
   `demo`+`src`+`test`+`scripts` — sitting beside the existing `proof:no-orphan-module` /
   `proof:no-dead-dependency` at the export granularity they miss. Size: **S**.

7. **De-defer or build the DM-22 named-selector resolution.** Scope sketch: either implement the
   deferred-resolution step (`frame-compiler.ts:341`) that maps a named scroll phase to a numeric
   `%` at `bindTimeline`, eliminating the sample-time NaN; or, if the `play()`-time
   `assertNoUnresolvedNamedSelector()` guard is the accepted terminal contract, delete the
   "DEFERRED to a follow-up wave" language so no live `src` comment advertises an unbuilt cure.
   Falsifiable gate: `grep -rn "DEFERRED to a follow-up wave" src/` → 0, and (if built) a test
   that a named-selector frame sampled after `bindTimeline` yields a finite value, not NaN.
   Size: **S** (de-defer) / **M** (build).
