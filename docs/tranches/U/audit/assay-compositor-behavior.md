# Assay — AnimationGroup Compositor / Stacking / Layering (BEHAVIORAL PROBE)

**Tranche U · OD-U14 assay · behavioral lane · 2026-07-10**
**Owner mandate (verbatim): "The primary issue with our animations was that the
compositing and stacking and layering. Ensure that's assayed."**
**READ-ONLY investigation. Live, harness-driven against the BUILT engine
(`dist/engine/index.js`). Throwaway probes in session scratchpad, not committed.**

---

## Executive summary

The C14 dossier (`defect-amiga-suspend-resume.md`) root-caused ONE stale-leaf bug
in ONE cache (`_plainProj`, the `unflatten` custom-transform path) and charted a
fix for it. **This behavioral assay drove the full stacking matrix and found the
staleness is a DISEASE across THREE caches, not one — and the two the dossier did
NOT name are the direct answer to the owner's "layering broken."**

The single root pathology: `interpFrames` **re-points a child's leaf objects to a
DIFFERENT `AnimationFrame`'s `flatVars` array every time the child crosses a
keyframe segment boundary** (the single-active-frame alias, `interpolate.ts:187-194`;
the ≥2-frame merge, `:205-207`). Three compositor structures **capture those leaf
references once** and are rebuilt ONLY on a *structural* change
(`_groupedKeysDirty`) — a segment crossing is not structural, so all three serve
**orphaned, frozen leaves** after the first boundary:

| # | Cache | Path | Symptom after 1st segment crossing | Demo-reachable? | In C14 charter? |
|---|---|---|---|---|---|
| **D1** | `_plainProj` (`plain-vars.ts`) | `singleTarget`+`unflatten` (custom transform) | pose FREEZES at the boundary pose (the amiga freeze) | YES (amiga) | **YES** |
| **D2** | `_soaPlans` (`soa.ts`) | `singleTarget`, **any** target, `add`/`weighted` | the blended layer's contribution **VANISHES** — composite collapses to the base layer alone | **YES** (`LayerConfigPanel` blend selector) | **NO** |
| **D3** | `_groupedKeys` (`entries.ts`) | layer **removed** mid-play | removed layer's props stay **frozen-applied** in the composite | only via direct `group.animations` mutation | NO |

**D2 is the headline.** It is the general form of the owner's complaint: pick
`add` or `weighted` in the demo's Layer panel on ANY multi-segment animation and
the layer silently stops contributing the instant a child crosses a keyframe — the
"stacking and layering" collapses to a single layer. It is NOT gated by
`unflatten`; it hits the ordinary flat/DOM path that the dossier declared safe
("cube uses the flat path … dodges the bug" — true only because cube uses
`replace`).

Fixing C14 (D1) alone leaves D2 **live and green**. The correct cure invalidates
BOTH `_plainProj` AND `_soaPlans` on active-frame (segment) change, and the
born-RED gate must exercise **add/weighted multi-segment**, not only `unflatten`.

---

## Method / harness

- Imported the BUILT `dist/engine/index.js` (`AnimationGroup`,
  `CSSKeyframesAnimation`) in Node ESM (dist fresh; value.js present in
  `node_modules`). `AnimationGroup` animates any object, so no DOM/jsdom needed.
- Drove each group synchronously frame-by-frame: `group.advanceTo(t)` (establishes
  child `startTime`, advances child clocks) → `group.render(t)` (runs
  `compositeFrame`). Observed the composite via **two honest channels**: the
  custom transform's plain `pose` (D1/`unflatten` path) and **`group._grouped`
  leaf `.value`s directly** (the flat composite buffer, D2/D3 path).
- Compared measured composite against the closed-form expected value at each `t`,
  including samples **past the first segment boundary** — the exact window all
  three shipped gates omit.
- Probes: `scratchpad/u14matrix.mjs` (the 8-cell matrix a–h) +
  `scratchpad/u14soa.mjs` (SoA carrier/incoming staleness + remove/disable).

The full stacking matrix from the task was driven: (a) replace z-order over full
timelines+crossings, (b) add accumulation, (c) weighted + weight sweep, (d)
enabled toggles, (e) singleTarget×unflatten cells, (f) multi-segment under every
blend, (g) pause/resume/seek, (h) layer add/remove.

---

## Measured results (the matrix)

### (e)/(f) `unflatten=true` multi-segment — the amiga shape → **D1 FREEZE (confirms C14)**

Two children (spin triangle 0→π→0→−π→0, X sweep 0→5→0→−5→0), 8000 ms, boundaries
at 2000 ms. `group.unflatten=true`, `singleTarget=true`.

```
t=2000  spin=3.1416 exp=3.1416 ok    px=5 exp=5 ok       ← last honest frame
t=2500  spin=3.1416 exp=2.3562 FREEZE❌  px=5 exp=3.75 FREEZE❌
t=4000  spin=3.1416 exp=0      FREEZE❌  px=5 exp=0    FREEZE❌
t=6000  spin=3.1416 exp=-3.1416 FREEZE❌  px=5 exp=-5   FREEZE❌
```

Both channels pin at the **25%-keyframe pose** (π, +5) from t=2000 onward — matches
the dossier's live-demo table exactly. Root: `_plainProj` writers deref the cached
segment-0 leaf (`plain-vars.ts:124`), orphaned when `interpFrames` re-points
`_grouped` at t=2000.

### (e) `unflatten=FALSE` same multi-segment child (flat `_grouped`) → **PASS**

```
t=2000 ry=3.1416 ok   t=3000 ry=1.5708 ok   t=4000 ry=0 ok   t=6000 ry=-3.1416 ok
```

The flat `replace` path is correct across every crossing — isolating D1 to the
`_plainProj` cache (the flat replace path re-reads `_grouped[key]` live each
frame; it captures no leaf).

### (a) replace-mode z-order, two layers, full timeline + crossings → **PASS**

High-zIndex layer wins at every sampled t (0/1000/2000/3000) including across the
50%-boundary. `replace` is a bare live reference-assign — no capture, no stale.

### (b) add-mode accumulation, multi-segment → **D2 FAIL (new)**

`base` (1→3→1) + `add` (10→30→10), both 3-keyframe/4000 ms, boundary at 2000 ms:

```
t=1000  v=22 exp=22 ok
t=2000  v=3  exp=33 ❌   ← add contribution GONE; v == base value alone
t=3000  v=2  exp=22 ❌   ← persists through the whole next segment
```

The instant `base` crosses its boundary, `_grouped["v"]` re-points to `base`'s new
frame leaf, but the SoA fold's captured `carriers[]` still hold `base`'s **orphaned
segment-0 leaf**; the fold writes the sum back to the orphan, and the composite
reads the new (un-summed) base leaf. The additive contribution vanishes.

Second cut (`u14soa.mjs`) — base single-seg, **add layer** multi-seg:

```
t=2000 v=31 ok   t=3000 v=31 exp=21 ❌   ← add FROZEN at its 50% value (incoming leaf stale)
```

→ **BOTH `carriers` AND `incomings` go stale** (`soa.ts:198-253` captures both;
the fold seeds/reads them at `soa.ts:131`/`:137`/`:142`). Whichever side is
multi-segment freezes.

### (c) weighted, static weight + mid-play weight change → **PASS (only because single-seg base)**

```
t=4000 w=0.25 v=80 ok   t=6000 w=0.75 v=165 ok   (weight changed mid-play)
```

Passes ONLY because the base child here is 2-keyframe (never crosses a boundary in
window). The mid-play `setLayerConfig` weight change works because it triggers
`invalidateEntries()` → structural rebuild → fresh capture.

### (c′) weighted with MULTI-SEGMENT base → **D2 FAIL (new)**

```
t=2000 v=100 exp=150 STALE❌   t=2500 v=75 exp=137.5 STALE❌   t=3000 v=50 exp=125 STALE❌
```

Weighted collapses identically — the composite reads the base leaf alone (100/75/50),
the incoming `b=200` contribution dropped. Same `_soaPlans` staleness. **This is
the same fold the demo's `crossfade`/`transitionLayer` spring-weight path
(K.W11 PHYS-C) rides** — a crossfade over a multi-segment child collapses.

### (d) enabled toggle mid-play → **PASS**

```
t=2000 add enabled  v=1020    t=4000 add DISABLED v=40 (base only)    t=6000 RE-ENABLED v=1060
```

Disable/enable each call `setLayerConfig` → `invalidateEntries` → rebuild, so the
stale capture is refreshed (the same accidental "rebuild heals it" that masks D2
between config edits). A disabled layer's key correctly clears
(`computeGroupedKeys` keeps it in the union → null-filled → compacted away).

### (g) pause / resume / seek mid-composite → **PASS**

Pause holds the child (`v=20` held, `child.paused=true`); jump-free resume (no
elapsed-while-paused counted, `child.t` stays 2000); `setChildTime(5000)` + render
→ `v=50`. Transport machinery is sound (consistent with the dossier's Defect-B
finding that suspend/resume machinery is sound).

### (h) layer add/remove mid-play → **add PASS / remove D3 FAIL (new)**

Adding a child + `invalidateEntries` composites correctly (`v=40 w=500`). **Removing
child `a`** leaves `v` frozen at 40 in `_grouped` (expected gone):

```
t=6000 after remove a  _grouped keys: ['opacity','x','y']   opacity=0.5 (a removed → should be gone)
                        groupedKeys=['y']   ← union correctly dropped opacity/x…
```

`computeGroupedKeys` (`entries.ts:65-77`) folds only the CURRENT entries, so the
removed child's keys leave the union; the per-frame null-fill + post-blend
compaction (`compositor.ts:62-64`, `:143-146`) both walk **only `_groupedKeys`**,
so the orphaned keys are never cleared → they stay frozen in the composite and are
re-applied by the transform. (Disable is clean; only remove leaks — the asymmetry
is the union membership.)

---

## Adjacent semantic gaps found while driving the matrix

- **Blend modes are a no-op on `singleTarget=false` groups.** `renderMultiTarget`
  (`entries.ts:87-96`) applies each child DIRECTLY to its own target — there is no
  cross-child composite, so `add`/`weighted`/z-order do **nothing** on a
  multi-target group. Yet `LayerConfigPanel.vue` exposes the blend selector for
  every group (the demo's `square` scene is `singleTarget=false`). The control is
  live but inert there — an appearance-axis blind spot (a user sets "add", sees no
  change, not because it's identity but because the path ignores it).
- **Group children never use WAAPI.** A managed child is driven by
  `group.advanceTo`/`interpFrames` (rAF, main-thread) and throws on its own
  `play()`, so `useWAAPI` is bypassed for ALL group animation regardless of the
  option. This is by-design (group owns the loop) but undocumented at the WAAPI
  eligibility surface — the compositor and the WAAPI compositor-thread path are
  mutually exclusive, never interacting, so there is no WAAPI-vs-compositor race
  (the one honest reassurance in this assay).

---

## Why the green gates missed D2/D3 (same vacuous-green class as C14)

The dossier explains the three amiga gates sample before t=2000. D2/D3 have **no
gate at all**: `proof:blend` / `proof:spring-blend-weight` / `proof:soa-composite`
assert the blend arm's *element contract* (the `Array.isArray` guard, the
`Math.min` loop, `maxErr=0` bit-identity of the SoA fold vs the boxed arm) — all
measured on the **plan-build frame or within a single segment**, where capture is
still fresh. None plays a blended group **past a child's first keyframe boundary**
and asserts the blended contribution persists. The SoA decision fixture
(`scripts/soa-composite-decision.json`, `maxErr=0`) proves SoA≡boxed *for one
frame*; it never re-checks after a crossing re-points the leaves the SoA plan
captured.

---

## The cure (idiomatic gestalt — no patches)

**One disease, one cure, three caches.** The compositor holds three snapshot
structures over leaf references that `interpFrames` re-points at segment
boundaries. Each is invalidated only on the *structural* seam (`_groupedKeysDirty`,
`invalidateEntries`). The missing invalidation is **active-frame (segment) change**.

1. **Add a segment-crossing invalidation seam.** Give the group a per-child
   "active-frame set changed since last composite" signal (the child already knows
   its active-frame span in `interpFrames`), and on any child's active-frame change
   drop **both `_plainProj` and `_soaPlans`** (the same lazy-rebuild the
   `_groupedKeysDirty` arm already does at `compositor.ts:51-55`). This is the
   dossier's Fix-A option 2 **extended to `_soaPlans`** — the extension is
   load-bearing: without it D2 stays live. Cost is a plan rebuild per boundary
   (rare vs per-frame), preserving the zero-alloc steady-state within a segment.

2. **Or make the caches views over live identity, not snapshots** (the dossier's
   option 1, generalized). `refreshPlainProjection` re-resolves `_grouped[flatKey]`
   each frame; the SoA fold re-resolves `carrierOf[key]`/`entry.values[key]` each
   frame — so a re-point is followed, not orphaned. Heavier per-frame but no
   invalidation bookkeeping. Option 1 is the truer "refresh means refresh"; option
   2's SoA extension is the smaller diff.

3. **D3:** the composite must clear keys the LAST entry set contributed, not only
   the current union. Either null-fill over the **previous** `_groupedKeys` before
   recomputing, or track a removed-key delta and delete it on the structural
   rebuild — so a removed layer's props do not stay frozen-applied.

**Born-RED gates the fix must add (the assertions all current gates omit):**
- Library: play a `singleTarget` group with an `add` (and separately a `weighted`)
  layer over a child with ≥3 keyframes for **> its first segment duration**; assert
  the composited value continues to reflect the blended contribution **after the
  first boundary** (`Set(sampled).size` grows across ≥2 segments; the blend delta
  ≠ 0 in `[boundary, 2×boundary]`). This is the D2 gate — flat path, no `unflatten`.
- Library: the same for the `unflatten` custom-transform path (the D1 gate the
  dossier already specifies).
- Library: remove a layer mid-play; assert its keys leave the composite
  (`_grouped[key] === undefined`), the D3 gate.

---

## Files / seams (evidence index)

- `src/animation/engine/interpolate.ts:187-194` (single-active-frame alias
  re-point), `:205-207` (≥2-frame merge re-point) — the root leaf re-pointing.
- `src/animation/compile/plain-vars.ts:109` (writer captures `units` leaf ref),
  `:124` (derefs the cached ref) — **D1**.
- `src/animation/group/compositor.ts:51-55` (caches dropped only on
  `_groupedKeysDirty`), `:75`/`:117-119` (SoA fold taken), `:143-146` (compaction
  walks only `_groupedKeys`), `:172-182` (plainProj refresh-not-rebuild).
- `src/animation/group/soa.ts:198-253` (`buildSoAPlans` captures `carriers` +
  `incomings` leaf refs), `:131`/`:137`/`:142` (fold seeds/reads/writes the
  captured refs) — **D2**.
- `src/animation/group/entries.ts:65-77` (`computeGroupedKeys` folds current
  entries only) — **D3**; `:87-96` (`renderMultiTarget` — no blend on multi-target).
- Demo reach: `demo/@/components/custom/instrument/transport/controls/LayerConfigPanel.vue:9,39,69`
  (`["replace","add","weighted"]` selector + weight) →
  `AnimationControlsGroup.vue:300` `updateLayerConfig` → live group.

## Probes (scratchpad, not committed)

- `u14matrix.mjs` — the 8-cell stacking matrix (a–h), pose + `_grouped` channels.
- `u14soa.mjs` — SoA carrier/incoming staleness (weighted multi-seg, add-layer
  multi-seg) + remove-leak + disable-clean confirmation.
