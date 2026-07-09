# stage-design-v2 — THE SCENE STAGE, round-2 BINDING DELTA

**Lane:** Fable design (Tranche S · pass 3, round 2) · **Date:** 2026-07-03 · **Status:** BINDING DELTA over `stage-design-v1.md`
**This is NOT a rewrite.** v1 remains the design of record; this document amends it clause-by-clause. Where v2 and v1 conflict, **v2 wins**. Everything in v1 not touched here stands verbatim — in particular v1 §2 (guardrails), §3 (authority ruling), §6 (geometry numbers — DO NOT re-derive), §11 (DOM placement), §13 (a11y), §16 (dogfood map).
**Inputs absorbed IN FULL:** `stage-critique-design.md` (S1–S6 blocking, P1–P6 polish, §7 protected list, §9 exit bar) + `stage-critique-tech.md` (H1/H1b/H2/H3 + H5/H6 + §3 miniatures RULING + §4 perf + §5 VT + §6 integration + §7 gate mandate + §8 LOD) + `stage-proto-v1.md` (deviations 1–4, "not reached") + 6 grounding shots (`proto-shots/desk-dark-{02,03,04,05}`, `desk-light-03`, `mobile-03`).
**Prototype substrate:** `.claude/worktrees/wf_2fbb9dbc-c40-1` — round 2 edits IN PLACE; no re-scaffold.

---

## 0. The round-2 shape in one paragraph

Round 1 proved the theater and the commit spine; round 2 makes the light tell the truth and
the funnel commit the scene the user is looking at. Eleven binding rulings below (D1–D11),
one per contested surface. The tech critic's H1 (stale-arm) and H2 (VT double-capture) are
cured structurally, not patched; the design critic's S1–S6 are cured at the token/layer
level with the critic's own values adopted verbatim. The miniatures deviation is promoted
from apology to contract (D3). Nothing on the protected list (§P below) may move a pixel.

---

## D1. THE STALE-ARM CURE — RULED: **LOCK browse verbs during `committing`**
*(cures tech H1 + H1b + H5 + H6; amends v1 §5 + §10)*

Of the three candidate cures (lock · commit-live-front-at-fire · re-arm-to-front), the
**LOCK** is ruled, and it is ruled on interaction grounds, not just safety grounds:

> **Committing is *walking into the stage*.** In DK-64 grammar, once you jump into the
> barrel you do not steer it. The tap/Enter is the user's last verb; the ~300 ms that follow
> are the theater's answer (the D5 payoff beat), not an input window. Allowing browse during
> `committing` is what created the stale-arm hole — but it is ALSO bad theater: the payoff
> flare would play over a moving ring. The lock makes `armed === orbit.target === rested
> front` an **invariant**, turns the failsafe into a true belt, and gives the payoff beat a
> stable frame to play on. The weaker cures (fire-time live-front, re-arm-to-front) keep a
> steering window that has no interaction meaning and forces the payoff to chase the ring.

### D1.1 The moving-target arm (H1b)

`requestCommit` never latches a snapshot of a moving quantity. Binding rule:

- **Settled ring:** `requestCommit(centeredSceneId)` — unchanged.
- **Coasting ring** (`orbit.spinning === true`, e.g. Enter/Space mid-flick):
  `requestCommit(sceneAt(orbit.targetIndex))` — the arm latches the spring's **destination
  slot** (the decay-projected rest the flick is already headed to), never the slot the ring
  happens to be passing through. `armed === orbit.target` from the instant of arming.
- **Pointerdown during a coast** halts the coast (the spring re-seats to the nearest slot at
  grab — existing behavior); a ≤slop tap on the front card then commits the *halted* front.
  Deterministic; no arm-in-transit path exists for pointer input.

### D1.2 The full event × state matrix, post-cure (BINDING — supersedes v1 §5's diagram)

| state \ event | `open` | `close` (Esc / × / pill re-click) | `requestCommit` | browse verbs (`step` / `centerIndex` / drag / wheel / type-ahead) | advancers |
|---|---|---|---|---|---|
| **closed** | → zooming-out | — | — | — | — |
| **zooming-out** | — (no-op) | → zooming-in (cancel) | **BUFFERED** (latch `pendingCommit`) | dropped | zoom settle → fanning-in |
| **fanning-in** | — | → zooming-in (cancel; **`fanTimer` CLEARED** — tech H4) | **BUFFERED** (latch `pendingCommit`) | dropped | fan done → carousel; **drain `pendingCommit` → committing immediately** |
| **carousel** | — | → zooming-in (cancel) | → committing (arm per D1.1; if `frontId !== armed`, spin-to-front) | spin (interruptible, unchanged) | — |
| **committing** | — | → zooming-in — **cancel ABORTS the armed commit** (documented; Esc means abort, always — tech H2-adjacent ruled) | same id → no-op; different id → **impossible** (browse is locked, front cannot change; the call is ignored + dev-logged) | **LOCKED — silent no-op** (return early; ring does not move) | fire when `!spinning ∧ front === armed ∧ dwell ≥ 280 ms`; **failsafe 2000 ms** → fire |
| **zooming-in** *(cancel-close ONLY — see D2)* | — (blocked) | — | — | — | cancel spring settle → closed |

- **`fanning-in × requestCommit` = BUFFER, not drop** (tech H3-fan). A user pressing Enter
  during the fan-in means "enter the centered scene, fast" — silently eating the input is
  the Q.WC3 smell in miniature. `pendingCommit` is a single latch (last write wins),
  cleared on any cancel.
- **`committing × Esc` = cancel, ruled and documented.** The armed commit aborts; no
  `runSceneSwitch`, no observable write. The gate asserts this distinctness (D11-clause D).

### D1.3 The failsafe belt, re-specified (tech H5)

- **Window: 2000 ms** (was 1200 — a 3–4-slot decay-projected re-seat can take ≳1 s; the old
  window could fire mid-motion). **The timer RESETS on each (re-)arm** and on the
  spin-to-front initiation. Under the D1 lock the failsafe should never be the committing
  path — it exists for a pathological stuck spring only. `fire()` via failsafe commits
  `armedId` (which the lock guarantees equals the spring target); if at failsafe-fire
  `front !== armed`, dev-log a loud invariant breach (this is gate-visible telemetry, never
  a user-facing branch).
- **Minimum dwell: 280 ms** before `fire()` even when the armed card is already
  front-and-settled. This is the D5 payoff breath — and it structurally cures tech **H6**:
  `data-stage-phase="committing"` now PAINTS on every path (no more microtask
  write-and-overwrite), so the phase is honestly observable. Under PRM the dwell is **0**
  (snap — v1 §14 unchanged); the gate therefore never relies on the attribute as its *sole*
  witness (D11-clause C).

### D1.4 Observables (amends v1 §10 step 3)

`window.__stageLastCommit = { id, t }` (kept) **plus** `window.__stageArmedLog` — an
append-only array of `{ id, t, cause: "tap" | "key" | "buffered" | "failsafe" }` written at
each arm and at fire. The armed-log is the gate's primary interleaving witness (tech §7.3).

---

## D2. VT-FRAME EXIT — the stage leaves INSIDE the captured frame
*(cures tech H2 + VT-2 + VT-3 + the §6 Suspense ordering; amends v1 §10 step 3 + §11)*

### D2.1 The capture sequencing, spelled

`startViewTransition` snapshots OLD before the update callback runs and NEW after the
callback's promise resolves. The choreography exploits exactly that:

1. **OLD frame** = the dimmed carousel with the armed card flared (the D5 payoff frame).
   The overlay is *supposed* to be in this snapshot — it is the visual the scene grows out
   of. (It rides `::view-transition-old(root)`; the overlay still carries **no**
   `view-transition-name` — guardrail 3 untouched.)
2. **Inside the `update` callback, ONE synchronous mutation batch:**
   `switchScene(armedId)` (the machine — THE one commit edge) **and** `stage.phase =
   "closed"` (the overlay unmounts/hides in the same flush) **and** dock/controls `inert`
   release (bound to `phase === "closed"`, so it lands in the same frame). Then the callback
   **awaits scene-readiness** before returning (D2.2).
3. **NEW frame** = the entered scene, no overlay, dock restored. The live tree contains no
   stage during the VT animation — the double-render and the openSpring-vs-VT race are
   structurally gone.

**Consequence, binding:** the commit path never enters `zooming-in`. That phase is the
**cancel-close path ONLY** (Esc/×/pill re-click), where the reverse `openSpring` runs with
no VT. Commit: `committing → closed` inside the update callback. Cancel: `committing |
carousel | … → zooming-in → closed` on the spring. The v1 §5 diagram is superseded by D1.2.

### D2.2 The async-Suspense gate (tech §6-HIGH)

The update callback must not return while the target scene is a suspended fallback — else
the VT "grows a spinner out of the stage." Binding order:

- `fire()` **pre-warms before the VT**: `await warmScene(armedId)` (the dynamic-import
  resolve — usually instant; the stage-open already warmed all 8 chunks per v1 §3) BEFORE
  calling `runSceneSwitch`. The 280 ms dwell absorbs this latency invisibly.
- Inside the update callback: after the mutation batch, `await nextTick()` + the scene
  host's Suspense `onResolve` (a promise the host exposes), **bounded at 350 ms** — on
  timeout, resolve anyway (the VT then crossfades to the fallback; degraded, never hung).

### D2.3 VT type merge + old-frame treatment (tech VT-2 / VT-3)

- `types` **MERGES**: `["stage", forward|backward]` — never replaces. The integration wire
  is `useSceneTransition` composing its existing directional type with `stage`.
- `::view-transition-old(scene-subject)` under `stage`: replace v1's `animation: none`
  (which holds the old frame full-opacity 420 ms then pops) with a **300 ms ease-out opacity
  fade to 0** — the old genuinely "cross-fades beneath" as v1's prose promised.

### D2.4 Router single-write clause (tech §6-hash)

One commit = ONE machine write = ONE VT. The `runSceneSwitch` path writes the machine; the
hash follows from the machine (router reconcile must observe `machine.activeScene` already
equal and no-op). The commits gate asserts exactly one VT and one machine transition per
commit (D11-clause F).

---

## D3. MINIATURES ARE THE LOD TIER-2 CONTRACT — ADOPTED AS MANDATE
*(absorbs the tech §3 RULING + design-critic §7.6; amends v1 §8 + §15 + the proto deviation 1)*

The real-target path is **retired for round 2** — the scenes are `createGlobalState`
module-singletons; mounting a real target in a card aliases the live scene's store (the
origin scene stays mounted behind the dim). That is a per-scene DI refactor, not p05's
23-line re-path; v1's promise was mis-costed and is withdrawn.

**The contract:**

1. **Purpose-built per-scene miniatures are the tier-2 preview surface** — engine-clock
   driven (shared LOD `tick`, zero owned rAF, zero global-store reads; the proto already
   complies).
2. **`square` stays REAL** (genuinely instance-local; proven).
3. **`amiga` = poster-at-flank + live-GL-only-at-front-settled** — specified in full:
   - Flank/rear: a **static poster** (the checkerboard-derived asset the N/IMPL-BLUEPRINT
     allows — the ONLY poster in the system).
   - The Three renderer + context are created **only when amiga is front AND the orbit has
     settled** (`!spinning` — never mid-transit; context creation is 10–50 ms and must not
     land inside a flick).
   - On leaving front: swap to poster immediately; `renderer.dispose()` on a **2 s
     debounce** (a one-step overshoot re-front cancels the dispose).
   - `webglcontextlost` (listen once): poster-permanent for the session. **≤1 GL context
     ever** — asserted in the LOD acceptance.
4. **Drift ownership** — the miniatures are a parallel artifact and the spec owns the risk:
   - **Screenshot-diff acceptance:** each miniature is captured in-card and paired
     side-by-side against its scene's **hero shot** (the design-fleet baselines,
     `pass1/design/*`); the pairing is recorded in the wave doc and judged "evokes the
     scene: palette + signature motion + silhouette" — a taste acceptance, not a pixel
     threshold.
   - **Maintenance rule (binding):** any change to a scene's visual identity
     (`demo/scenes/<name>/`) updates `scene-stage/previews/<name>` **in the same change**,
     or states in the change description why no update is needed.
5. **The honest claim** — v1 §0/§1 prose is amended: the stage shows *"living dioramas that
   evoke each scene"*, not "the real scene, running". Only `square` (and front-settled
   `amiga`) are literal.
6. **The unlit silhouette face is PROMOTED to the poster-card face** (design-critic §7.6):
   glyph + serif name + mono breadcrumb + tone-tinted shell — the entered-poster treatment
   the round-1 build already nailed becomes the unlit tier's face (this also carries half of
   D6's legibility cure for free).

---

## D4. LIGHTING v2 — the critic's ramp, adopted as tokens
*(cures S1 + S2; amends v1 §7 tokens + L1/L2/L3 recipes; deviation 3 ACCEPTED with the critic's two conditions)*

### D4.1 Tokens (design-idioms.css; replaces v1's single `--stage-key`)

```css
:root {
    /* Two-stop tungsten ramp, derived beside --color-gold-light/dark (the §7 promise, kept for real):
       the filament is amber, the spill is cream. */
    --stage-key-apex: hsl(38 85% 72%);   /* filament — the beam's top stop + the pool */
    --stage-key:      hsl(46 60% 86%);   /* cream spill — the beam's mid stop + washes */
}
.dark {
    --stage-key-apex: hsl(38 85% 68%);
    --stage-key:      hsl(45 65% 84%);
}

@property --stage-light  { syntax: "<number>"; inherits: true; initial-value: 1; } /* ∈ [0.78, 1.12] — 1.12 is the D5 flare */
@property --stage-pool-x { syntax: "<number>"; inherits: true; initial-value: 0; }
```

### D4.2 The beam (L2) — two-stop chroma, per theme

- **Dark:** `linear-gradient(to bottom, color-mix(in srgb, var(--stage-key-apex)
  calc(var(--stage-light) * 44%), transparent) 0%, color-mix(in srgb, var(--stage-key)
  calc(var(--stage-light) * 22%), transparent) 50%, transparent 92%)` under
  `mix-blend-mode: screen`. (Apex mix raised 34 → 44%; the khaki dishwater in
  `desk-dark-02/03` was the single-stop cream desaturating under screen-over-black.)
- **Light:** same two stops at **half mix** (22% / 11%) with **`mix-blend-mode:
  plus-lighter`**, and the beam layer sits **above the dusk scrim** in paint order so the
  shaft *adds warmth* instead of laying gray film on the white shells (the `desk-light-03/04`
  dingy-upper-half defect).
- **P1 polish absorbed:** the feather mask gains a bottom ramp (`black 82% → transparent
  100%` becomes a longer `70% → 100%` fade) + `blur` ramping 3 → 6 px toward the base, so
  the clip edges stop reading synthetic at the floor.

### D4.3 The pool (L3) gets the WARM stop

The pool's gradient re-keys `--stage-key` → `--stage-key-apex` (the pool is the surface
nearest the filament's target — the warmest thing on the floor). Blend split per theme as
the beam.

### D4.4 The front card catches the light (the S1 hierarchy cure, half 1)

Front card **content layer** (not the shell — glass-resting stays intact):

```css
background-image: linear-gradient(178deg,
    color-mix(in srgb, var(--stage-key) calc(var(--stage-light) * 22%), transparent),
    transparent 60%);
```

Both themes. The lit stage floor visibly catches the beam; in dark, the front interior
stops being the blackest object under the key light.

### D4.5 The flanks step into the penumbra (the S1 cure, half 2)

The v1 §6 shell `brightness(1 − 0.22d²)` is imperceptible against full-saturation preview
fills (Sequence's bars out-glowed the lit stage in every dark shot). Binding addition, on
the flank **preview-host content** (not the shell):

```
filter: saturate(lerp(1, 0.65, k)) brightness(lerp(1, 0.72, k))
```

where `k` ramps 0 → 1 over `|a| ∈ [step/2, 1.5·step]`, driven continuously by the orbit
angle (springing with `|a|` — no threshold pop). The bars read *green-gray in shadow* until
they swing into the beam — that transition IS the theater. Front = `saturate(1)
brightness(1)` exactly.

### D4.6 The paper comes back (S2 — the identity condition)

The proto's warm-dusk base in both themes is **ACCEPTED** (the critic's 2b ruling; literal
vellum fog is dead — white-on-white was real). The two binding conditions:

1. **A stage-owned grid ghost layer** `.stage-grid` (new, between base and dim): repeating
   linear-gradients built from the SAME `--graph-pitch`/`--graph-major` tokens as
   `.grid-background`, line color `color-mix(in srgb, var(--stage-key) 6%, transparent)`
   (warm graphite under tungsten) in dark, **8%** in light; masked by a radial ellipse
   matched to the pool so the grid is *brighter inside the pool* — light falling on ruled
   paper, the MATINEE image. (A stage-owned layer is ruled over "let the real grid show
   through a thinner scrim" because it is deterministic against arbitrary page content —
   but see condition 2.)
2. **Proven over the real `.grid-background`** — the round-2 acceptance shots MUST come
   from the stage mounted over the real app page (or a harness that includes the real
   `.grid-background`), both themes. Unverifiable = unshipped (the critic's exact bar).

Dusk floor unchanged: never pure black (the 96% mix cap stays the floor).

### D4.7 What must not regress (critic 2c)

L3 pool + L4 per-card contact shadows + the footlight tint are pixel-protected (§P). The
only permitted L4 change is D5's committing-time bloom.

---

## D5. THE COMMIT PAYOFF — the theater takes a breath
*(cures S3; new choreography on `committing`; kills the gold wedge)*

On entering `committing` (all springs, existing primitives, ~300 ms of payoff before the VT):

1. **Beam flare:** `--stage-light` springs → **1.12** (the `@property` range widened per
   D4.1). The shaft and pool visibly surge.
2. **Footlight bloom:** the armed card's contact-shadow tint **alpha × 1.5, scale 1.15**
   (springing — the crayon halo blooms).
3. **The press:** the armed card gets **`translateZ(+40px)`** via the orbit derive (a
   committing-only additive term on the front card's transform) — the stage steps toward
   the viewer.
4. **The marquee swaps to the armed scene's name immediately** — already true; kept.
5. The **280 ms minimum dwell** (D1.3) guarantees this beat paints before `fire()`; the VT
   then grows the scene out of the flared frame (D2.1 — the payoff frame IS the VT's old
   snapshot). Under PRM: no flare motion; the payoff renders at its rest values in the
   single snap (v1 §14's "the LOOK survives" clause).
6. **The gold wedge is KILLED.** The `desk-dark-04/05` top-left artifact is the unlit
   glyph ghost leaking into the lit tier. Binding: the glyph ghost renders **only** in the
   unlit branch (`v-else` of the lit switch) — a lit card never renders its silhouette
   layer. No "intentionalize" option is taken.

Cancel (Esc during committing) reverses 1–3 on the same springs — the theater exhales; no VT.

---

## D6. UNLIT-TIER LEGIBILITY REMIX
*(cures S4 both halves + P3; amends v1 §8 REAR row + §13 contrast)*

1. **The unlit face = the poster-card face** (D3.6): tone-tinted shell + glyph + serif name
   + mono breadcrumb. Within it:
   - **Label:** re-mixes toward `--foreground` per the `.status-badge` AA lineage
     (design-idioms.css:636-641 — v1 §13 already said this; now it is implemented), **min
     12 px**, measured **≥ 4.5:1** in both themes (gate-checked, D11).
   - **Glyph ghost:** `opacity: .5; filter: saturate(.4)` — and **NO `brightness(.5)`
     crush on the glyph** (the falloff already darkens the card; the double-darkening is
     what emptied Cube's slab).
2. **The double-exposure** (rear labels reading through flank glass — "Square" floating on
   Easing's curve):
   - Flank-tier shells get a stepped-up backdrop: **12–16 px backdrop-blur on the flank
     tier only** (front keeps glass-resting; rear stays cheap static glass — see D9.3 for
     the perf budget this must fit).
   - **Rear label opacity fades to 0 over `d ∈ [0.5, 0.65]`** — the silhouette's name
     matters when the card is peripherally visible, not when it is occluded behind glass.
3. **Arrows (P3):** the `‹ ›` buttons adopt the **× close button's glass register**
   (which reads correctly in every dark shot) — non-text affordance contrast ≥ 3:1.

---

## D7. THE AFFORDANCE LAYER
*(cures S5; new — v1 had none)*

1. **Cursors:** `cursor: grab` on the disk; `grabbing` while dragging; `cursor: pointer` on
   the **front card only**.
2. **Hover press:** the front card gets the demo's existing press-scale idiom on hover
   (subtle scale ≈ 1.02 spring) — the "this is a button" read.
3. **The one-time hint line:** Fira Code `mono-caption`, sitting **at the pool line** under
   the front card, lit by the beam (diegetic, not a tooltip):
   `drag to spin · tap to enter`
   Shown until the first successful spin **committed by the user** (any of: a completed
   drag ≥ 1 slot, a wheel step, an arrow press), then fades and never returns —
   `localStorage` flag `kf-stage-hint-dismissed` (vueuse `useStorage`, per MEMORY's storage
   idiom). It re-arms only if storage is cleared.
4. **Optional (non-load-bearing, may ship or slip):** a small `↵ enter` chip after the
   marquee counter. The hint line is the load-bearing fix; the chip must not gate the round.

---

## D8. MOBILE v2 — reduce, don't crowd
*(cures S6; amends v1 §12 parameters only — same component/authority/funnel, still no fork)*

1. **Cull beyond ±2 slots** at <640 px: cards with `|slot distance| > 2` are `v-if`'d out
   (they are unlit anyway — the LOD already unmounts their previews; this removes the
   corner-clipped dark rectangles of `mobile-03/04`). The cull boundary uses the SAME
   hysteresis discipline as D9.1 (cull at > 2.5·step, restore at ≤ 2.25·step) so a flick
   doesn't flicker cards at the edge. The two flanks remain as **lit slivers** peeking
   ~12–14% — that read was right.
2. **Front card width 72vw → 80vw** — the front diorama dominates instead of floating.
3. **`perspective-origin` y drops:** `50% 45%` → **`50% 52%`** — the ring settles toward
   the pool; the top-half dead zone shrinks under the marquee-below-ring composition.
4. Everything else in v1 §12 stands (R clamp, narrowed beam, safe-area close, marquee below
   the ring at display scale, front-only live, the 375 commit gate).

---

## D9. LOD v2 — hysteresis, the 1+2 ruling, content-visibility drop
*(cures tech §8 thrash + concurrency deviation + CV honesty; amends v1 §8)*

### D9.1 Hysteresis band (BINDING values)

The lit boundary is a **band, not a threshold**:

- **Mount (become lit):** `|a| ≤ 1.5 · step`
- **Unmount (go unlit):** `|a| > 2.5 · step`

Once lit, a card stays lit through the whole band — a multi-slot decay flick sweeps cards
through `[1.5, 2.5]·step` without a single mount/unmount cycle; churn happens only when a
card genuinely leaves the neighborhood. (Cheap for miniatures; existential for the amiga GL
context — which additionally never *creates* except front-settled, D3.3.) The mobile cull
(D8.1) rides the same discipline one ring further out.

### D9.2 Concurrency — RULED: **1 full + 2 flank@18** (the v1 design number; the proto's 2+1 is reverted)

`maxConcurrentFull = 1` desktop, `1` mobile (flanks unlit there). The light-is-life
narrative is literal: **only the stage under the beam runs at full rate**; the penumbra
idles at 18 fps. The proto's `2 full + 1 flank` gave a flank a bigger frame budget than the
story allows — and D4.5 now *desaturates* that flank, so spending 60 fps on gray-green bars
is doubly wrong. The amiga-at-front `cost = 2` policy stands (amiga full + both flanks at
18 — the WebGL scene eats the discretionary budget; reasonable and kept).

### D9.3 Perf budget actions (tech §4 — measure-then-cut, the trace is a HARD blocker)

Round 2 MUST land the deferred chrome-devtools fps trace (≥55 fps carousel-open, <8 ms
scripting/frame, no LOD-churn long task mid-spin — LOCAL per C-10, recorded in the wave
doc, never a CI threshold). Against that trace, these cuts are pre-authorized and expected:

1. `.stage-dim` **drops its full-viewport `backdrop-filter`** → plain gradient scrim (the
   D4.6 `.stage-grid` ghost replaces the only thing the blur was softening; the blur of
   paper-behind-dim was barely legible anyway — the critic's own suggestion).
2. Card `backdrop-filter` only where D6.2 demands it: **front (glass-resting) + 2 flanks
   (the 12–16 px anti-double-exposure blur)**; rear/unlit shells are static-gradient glass,
   zero backdrop reads. Dogfood **glass-ui `glass-resting` tokens** for the shells (tech
   §6-LOW) instead of the hand-rolled recipe.
3. `will-change` **only on the lit ≤ 3 cards**, not all 8.
4. The ring becomes a **rAF direct-write** (tech P3): per-frame transforms written straight
   from the orbit spring emit (the repo's `useAnimationSync`/markRaw pattern), not through
   a reactive `computed cards` that round-trips the Vue scheduler 8× per frame.
5. **The origin scene pauses behind the dim** on `open` (`useSceneVisibilityPause` or the
   machine's pause) — no rAF competing behind an opaque scrim (tech §6-MEDIUM).

### D9.4 content-visibility — RULED: **DROP**

All cards sit centered in the viewport; `content-visibility: auto` never skips them, the
`contentvisibilityautostatechange` pause never fires, and the IO fallback watches nothing.
The machinery is inert scaffolding. **Delete the CV/IO pause path from
`useLivePreviewLOD`;** state plainly in the code: **`v-if` (the lit band, D9.1) is the
pause authority; tab-hidden parking is `RAFPlayback`'s own rAF-clock park.** (If a future
layout ever puts cards off-viewport, CV can return with an actual trigger — not before.)
v1 §8's CV bullet and the §14 degrade row are struck.

---

## D10. Remaining choreography + polish absorptions

- **P2 (opening ghost):** the scene-host's opacity ramp front-loads — host fully gone by
  `p ≈ 0.6` of the zoom-out spring (the dimmed "Spring" title inside the beam mid-open was
  reading as a double-exposure bug).
- **P4 (marquee dead zone, desktop):** the marquee block drops ~48 px toward the ring
  (`top` adjustment only; type scale untouched — §P protects the marquee itself).
- **P5 (motion evidence):** round 2 SHIPS motion captures — GIF (or trace-derived film
  strip) for **fan-in**, **flick-decay**, and **commit payoff → VT growth**. Stills can no
  longer carry the choreography claims; the fan-in rhythm and flick feel get judged round 3.
- **P6 (PRM):** an emulated-PRM context run with the shot pair (carousel + committing) —
  "the LOOK survives, the motion doesn't" verified in pixels, not prose.
- **Drag feel (proto deviation 4):** slot-follow + decay projection is ACCEPTED pending the
  P5 flick capture; if the capture reads notchy rather than turntable, the round-3 fix is
  the small orbit API addition (`setAngle` continuous follow) — pre-authorized, not
  required.
- **Pill re-click** (tech §6-LOW): while open, the dock pill (if reachable) toggles —
  `stage.close()` (cancel). Matches D1.2's close column.
- **Dock-pill rewire scoping** (tech §6-MEDIUM): "a Select trigger that opens the stage
  instead of its popover" may need a glass-ui affordance; per MEMORY
  (`glass_ui_root_changes`) that lands in glass-ui, never a demo patch. **Scope it BEFORE
  the W4-integration wave; if glass-ui needs a change, it is a handoff item, and the
  interim wire is a plain button styled as the pill** (same pixel identity — v1 §3's ruling
  is about identity + single authority, not about which primitive renders it).

---

## D11. THE GATES, UPGRADED — `proof:scene-stage-commits` goes adversarial
*(absorbs tech §7 in full; amends v1 §17)*

### `proof:scene-stage-commits` (born-RED; playwright-core on the shared chromium, served dist)

Happy-path clauses (v1, kept): arrow-commit AND drag-flick-commit both land
`machine.activeScene` + `__stageLastCommit.id` + the hash + focus on `.scene-host`.

**NEW adversarial clauses (the gate must be able to FAIL the pre-cure code):**

- **A — gesture-during-committing (the H1 killer):** settle on A → tap front (arm A) →
  within 100 ms dispatch a `step`/drag toward B → assert the ring **rested on A** (the D1
  lock held: browse was a no-op), `__stageLastCommit.id === A`, and
  `machine.activeScene === A === rested front`. Against the round-1 code this FAILS
  (commits A while resting B) — which is the point; it forces and then guards the cure.
- **B — Enter-during-flick (the H1b killer):** start a multi-slot decay flick → press Enter
  mid-coast → assert `__stageArmedLog.at(-1).id` equals the orbit's **target slot at
  press-time** AND equals the rested front AND the committed id. The arm may never be a
  passing slot.
- **C — observable honesty (H6):** primary witnesses are `__stageLastCommit` +
  `__stageArmedLog`. The `data-stage-phase="committing"` attribute MAY additionally be
  asserted (the D1.3 dwell makes it paint) but NEVER as the sole witness, and never under
  PRM (dwell = 0).
- **D — cancel distinctness:** arm → Esc before dwell elapses → assert NO
  `__stageLastCommit` write, no machine mutation, no hash move; stage closes on the cancel
  spring.
- **E — buffered fan-in commit:** open → press Enter during fan-in → assert the buffered
  commit fires after `carousel` and lands normally (D1.2's BUFFER row is load-bearing, so
  it is gated).
- **F — single-write:** one commit produces exactly ONE machine transition and ONE VT
  (instrument `startViewTransition` call count + a machine-transition counter) — the D2.4
  router re-entrancy clause.

### `proof:stage-geometry` — one NEW clause

The at-rest clauses stand (v1 §17). **NEW during-commit clause (encodes D2 as a gate):**
instrument the VT wrapper to record `window.__stageVT = { overlayInDomAtUpdate }` inside
the update callback — assert the overlay is **absent from the live DOM** by the end of the
update callback, and (as before) that no element in the stage tree EVER carries a
`view-transition-name`. The at-rest gate could not see H2; this clause can.

### Unchanged

fps/scripting budget stays a LOCAL chrome-devtools acceptance (C-10 — never a CI fps
threshold), now HARD-blocking for the round (D9.3). The lighting look remains screenshot
acceptance — dark AND light, desktop AND 375, **over the real `.grid-background`** (D4.6),
plus the P6 PRM pair and the P5 motion captures. Both named gates get wired for real this
round: `scripts/proof-stage-*.mjs` + `package.json` entries on S.A2's shared chromium (they
were proven-live-but-unwired in round 1).

---

## §P. THE PROTECTED LIST — pixel-stable, regression = round failure
*(the design critic's §7, adopted as binding)*

1. The dark-carousel composition — beam + tilted ring + dusk (the event).
2. **The footlight system** — per-scene crayon halo (ember Spring, gold Path). D5's bloom
   is the only permitted change, and only during `committing`.
3. Real 3-D — v1 §6's numbers stay pinned; occlusion/recede/tilt verified in-pixel.
4. Light = life legibility — live lit previews, dark rear slabs (now with D4.5's penumbra
   ramp *strengthening* the read, never flattening it).
5. Marquee typography + mobile marquee-below-ring at display scale (P4 moves the block,
   never the type).
6. The closed/entered poster cards — now ALSO the unlit face (D3.6/D6.1).
7. The commit spine — observable, failsafed, both input paths — now hardened by D1 and
   guarded by D11.

---

## Round-2 exit bar (supersedes the critic's §9 with the tech items folded in)

Round 2 converges when ALL hold:

- **(a)** a dark carousel shot where the front stage is unambiguously the brightest object
  and the beam reads warm tungsten (D4.2/D4.4/D4.5);
- **(b)** both themes show graph paper ghosting through the dusk, brighter in the pool,
  **over the real `.grid-background`** (D4.6);
- **(c)** a committing shot that is visibly the payoff frame (flare + bloom + press; no
  gold wedge) (D5);
- **(d)** rear silhouettes name-legible at arm's length, ≥4.5:1, no double-exposure (D6);
- **(e)** a mobile carousel with no corner clutter, 80vw front (D8);
- **(f)** the hint line present on first open, gone after the first spin (D7);
- **(g)** `proof:scene-stage-commits` GREEN **including clauses A–F** and
  `proof:stage-geometry` GREEN including the during-commit clause — both wired as real
  `proof:*` entries (D11);
- **(h)** the fps/scripting trace recorded and within budget, with the D9.3 cuts applied as
  needed (≥55 fps / <8 ms / no LOD-churn long task);
- **(i)** the P5 motion captures + P6 PRM pair shipped;
- **(j)** everything in §P pixel-stable.

---

### Delta ↔ critique cross-index

| Critique item | Ruling here |
|---|---|
| tech H1 / H1b (stale arm; moving-target Enter) | D1 (LOCK) + D1.1 |
| tech H5 (failsafe window) / H6 (committing never paints) | D1.3 (2000 ms re-armable; 280 ms dwell) |
| tech H4-timer / H3-fan / H2-adjacent (Esc) | D1.2 matrix (cleared; BUFFER; documented cancel) |
| tech H2 (VT double-capture) + VT-2 + VT-3 + §6 Suspense/hash | D2 |
| tech §3 miniatures RULING + H3 feasibility | D3 |
| design S1 (hierarchy inversion, khaki beam) | D4.1–D4.5 |
| design S2 (paper gone; gray film over white) | D4.6 + D4.2-light |
| design S3 (commit sag; gold wedge) | D5 |
| design S4 (unlit illegible; double-exposure) + P3 | D6 |
| design S5 (discoverability) | D7 |
| design S6 (mobile clutter) | D8 |
| tech §8 thrash / concurrency / CV / GL lifecycle | D9.1 / D9.2 / D9.4 / D3.3 |
| tech §4 P-perf + P3-reactivity + origin-scene rAF | D9.3 |
| design P1/P2/P4/P5/P6 + proto deviation 4 + pill scoping | D4.2 / D10 |
| tech §7 gate mandate | D11 |
| design critic §7 protected list | §P |
