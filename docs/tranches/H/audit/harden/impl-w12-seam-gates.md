# impl-w12-seam-gates — the SEAM/AUDIT GATES lane: author + wire the 4 I8/I9/I10/I11 gates

**Lane:** H.W12 SEAM/AUDIT GATES — author the four NEW gates that LOCK the seam +
audit lanes (`proof:dragscrub-single` [I8], `proof:composable-encapsulation` [I9],
`proof:demo-no-oversize` [I10], `proof:no-brittle-selector` [I11]), each BITING per
`H.W12.md §Hard gate`, wired into `package.json` + `proof:all` + `ci.yml`. The seam
lane (`impl-w12-seam.md`) and Lane A (`impl-w12-scenes.md`) LANDED their source; this
lane authors the falsifiable instruments that prove + guard that landed state. The
gate-authoring substrate is the existing harness idiom (the `collectSources` +
`blankComments` + per-clause-`failures` static-grep family — `proof:single-writer`,
`proof:brittleness`, `proof:decomposition`).

**Status:** LANDED, tsc-clean (`npm run check` — PASS, exit 0). All four gates GREEN
on the landed seam+scenes; each VERIFIED to BITE (born-RED reconstructed for every
clause, see §6). Wired into `package.json` (4 scripts + `proof:all`) + `ci.yml` (the
demo-smoke static-gate cluster). `proof:ci-coverage` confirms all four are invoked in
CI (they are ABSENT from its missing list). No engine touched (`src/animation` FENCED,
inv ζ). No source `.vue`/`.ts` edited (gates are pure static instruments). No git
commit (per directive).

**Files authored (all absolute):**
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-dragscrub-single.mjs` (I8)
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-composable-encapsulation.mjs` (I9)
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-demo-no-oversize.mjs` (I10)
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-no-brittle-selector.mjs` (I11)
- M `/Users/mkbabb/Programming/keyframes.js/package.json` — 4 `proof:*` scripts + all 4 into `proof:all`
- M `/Users/mkbabb/Programming/keyframes.js/.github/workflows/ci.yml` — 4 `- name:`/`run:` steps in the demo-smoke static cluster (beside `proof:single-writer`/`proof:no-dup-utility`), each with a BITE-citing comment

All four are STATIC (grep/structural) — no browser, no build. They run in the
`demo-smoke` job's static-gate cluster (the same home as `proof:decomposition`/
`proof:single-writer`/`proof:brittleness`), NOT the `KF_REQUIRE_BROWSER` settle-gated
cluster (these four assert source-shape facts, not live FSM behaviour — so no
`proof:scene-machine-irrefragable` settle-gate is owed; the I3 BROWSER gates that DO
settle on the W1 FSM are the other lanes' instruments).

---

## 1. proof:dragscrub-single (I8) — the ONE pointer-drag scrub seam

**BITE (per `H.W12.md §Hard gate`):** ≤1 hand-rolled `getBoundingClientRect()`-ratio +
`setPointerCapture` + `window pointermove` drag block across spring/sequence/
motion-path; the shared `useDragScrub` is the single home.

**Two clauses:**
- **`[one-home]`** — the full drag DANCE (`setPointerCapture(` AND a window
  `pointermove`/`pointerup` registration — raw `window.addEventListener` OR the vueuse
  `useEventListener(window, "pointer…")` idiom) lives in EXACTLY ONE file:
  `demo/@/composables/useDragScrub.ts`. The signature is the CO-OCCURRENCE of both
  halves in one file (the irreducible hand-roll).
- **`[scene-clean]`** — spring/sequence/motion-path carry ZERO of either half. Their
  scrub rides `useDragScrub`; the `getBoundingClientRect` reads that remain are pure
  `project` geometry closures (verified live: `SpringTarget.vue:103`,
  `SequenceTarget.vue:235,271` — all inside a `project:` arrow), NOT the dance.

**The MEASURE-FIRST carve-out (`DANCE_ALLOWLIST`, recorded honestly).** A whole-demo
"exactly one dance file" sweep over-reaches: `demo/app/scenes/SquareScene.vue` inlines
the full dance for the square box drag. That is a genuinely-DIFFERENT gesture — a 2-D
`{x,y}` positional spring chase that subtracts the live deflection on re-grab, NOT the
1-D progress scrub `useDragScrub` unifies. The contract's BITE is explicitly scoped
"across spring/sequence/motion-path" (the square scene is OUT of that named set), and
the precept is "keep the scene-specific structure that EARNS its difference." So
`SquareScene.vue` is a recorded `DANCE_ALLOWLIST` carve-out with its rationale, guarded
by a stale-entry check (it reds if the entry ever stops carrying the dance — mirrors
the `proof:decomposition` `ASYNC_ALLOWLIST` / `proof:brittleness` `LISTENER_ALLOWLIST`
idiom). The OTHER demo drag seams (OrbitalDrag, EasingCurveCanvas, `useDragCapture`,
PlaybackRibbon) do NOT trip `[one-home]`: each lives in its own composable carrying at
most HALF the signature in any one file, so the co-occurrence test passes them by
construction (no allowlist entry owed — measured).

`dist/` is excluded (the `SKIP_DIR` idiom): a stale `demo/app/dist/` dev build is
present and would otherwise pollute the grep.

---

## 2. proof:composable-encapsulation (I9) — the gesture engine lives in the composable

**BITE:** `useMotionPathDemo` (here: the colocated `useMotionPathGesture`) owns the
project/scrub/`ManualTimeline` logic; the Target's `<script>` holds NO
`getBoundingClientRect`/`getTotalLength` projection math; AND no store getter outside
the FSM core has a write side-effect (pure reads).

**Three clauses:**
- **`[engine-home]` + `[target-clean]`** — the projection-math signature
  (`getBoundingClientRect|getTotalLength|getPointAtLength|ManualTimeline|fromMotionPath|
  setChildTime`) lives in `demo/motion-path/useMotionPathGesture.ts` (11 sites) and is
  ABSENT from `MotionPathTarget.vue`'s `<script>` (the 2 grep hits at `:84`/`:148` are
  comment TEXT, blanked by the comment-blanker — the Target holds refs + markup + the
  tethers view-derivation + the handle keyboard-nudge only).
- **`[store-write]`** (the pure-getter belt) — every `store.value = …` reactive-store
  write lives INSIDE the store-module dir
  (`demo/@/components/custom/animation-controls/stores/`); zero consumer outside it
  reaches past a getter. The lazy-localStorage `getStored*` seed-on-miss
  (`controlOptionsStore.ts`/`animationOptionsStore.ts`) is the ONE recorded write-on-read
  idiom (`SEED_ON_READ`, with rationale + a stale guard) — the seam note §5 disposition
  (accepted-as-is: idempotent lazy-init, NOT a reactive read-side-effect). The FSM
  single-writer axes are `proof:single-writer`'s territory; this gate locks the
  complement.
- **`[pure-getter]`** — zero writable `computed({ get, set })` whose GET half carries an
  assignment (a read with a hidden reactive write). MEASURE-FIRST found the one
  `computed({…})` site (`ChromeDock.vue`) writes only in its `set` half — the idiomatic
  two-way binding, clean; the clause born-GREEN, bites a future read-side-effect getter.

**Why the gate names `useMotionPathGesture`, not `useMotionPathDemo`** (the contract's
literal symbol): the seam note §3 documents the faithful shape — `useMotionPathDemo` is
the PROVIDE-side composable (group + register + the editable geometry STATE), called
once in the Scene wrapper with NO access to the Target's live refs; the gesture engine
NEEDS those refs, so it lives in a SECOND colocated composable the Target calls WITH its
refs. The W-MP-5 "engine-in-the-Target" defect is closed because the engine is in a
composable, not the Target — which is exactly what the gate asserts.

---

## 3. proof:demo-no-oversize (I10) — ≤500L + colocation (born-GREEN regression guard)

**BITE:** every DEMO `.vue`/`.ts` (excluding `src/`/`node_modules/`/`dist/`) is ≤500L;
each scene dir colocates its Target + composable + keys coherently. Born-GREEN on the
500L clause TODAY — the bite is the REGRESSION guard (a future over-split).

**Two clauses:**
- **`[ceiling]`** — all 162 demo `.vue`/`.ts` (sweep root `demo/`, dist/ excluded) are
  ≤500L; max is `demo/sequence/useSequenceDemo.ts` @ 486L (the I3 enrichment's growth,
  still under the line). The engine (`src/animation`) is FENCED + out of the sweep by
  construction (the root is `demo/`, never `src/`) — inv ζ honored.
- **`[colocate]`** — every `use*Demo.ts` sits in a dir with a sibling `*Target.vue` (no
  orphan); each of the four stage-scene dirs (sequence/motion-path/spring/easing)
  colocates `*Target.vue` + `use*Demo.ts` + `*Keys.ts`; the shared `useDragScrub` lives
  at the cross-scene `demo/@/composables/` home.

The 500L gate is honestly the W12 ceiling, DISTINCT from the older 350L D-tranche
`proof:decomposition` ceiling (which reds on 3 pre-existing `.vue` — `EasingCurveCanvas`
374, `AnimationControlsGroup` 418, `AnimationControls`/`AnimationControlsControls`
~365; byte-identical at the W12 spec HEAD, out of every W12 scene's lane per
`impl-w12-styling-decomp.md §3.3`). This lane does NOT touch those (NO manufactured
split); the W12 I10 gate is the 500L one, which they pass.

---

## 4. proof:no-brittle-selector (I11) — zero class-walks + named step + documented invariant

**BITE:** ZERO `.closest("…class…")`/`querySelector(".…")` class-string DOM walks in
the scene targets (owned refs instead); AND the motion-path projection has a NAMED
constant + a documented viewBox invariant (no bare magic `5` step + implicit square
coupling).

**Three clauses:**
- **`[class-walk]`** — no `.closest(…)`/`querySelector(All)?(…)` in spring/sequence/
  motion-path takes a CLASS-token selector (a literal beginning with `.` or carrying a
  `.classToken`); an `#id`/tag/`[attr]` selector is fine. Verified ZERO (every ref is a
  `useTemplateRef`).
- **`[named-step]`** — `useMotionPathGesture.ts` declares + uses a NAMED `SAMPLE_STEP`
  constant (`:77`, with the documenting comment) — no bare magic step literal.
- **`[viewbox-invariant]`** — `motionPathGeometry.ts` exports the ONE
  `clientToUserUnits` scale helper (`:126`), DOCUMENTS the square-viewBox coupling (the
  `aspect-ratio: 1` / square `0 0 VIEW VIEW` invariant — the prose at `:111-124`), and
  the gesture composable routes its client→user-unit mapping through it (no second
  hand-rolled scale copy). So a future non-square stage breaks at ONE visible site, not
  in two drifting copies.

This is the gate-side lock for the seam+scene lanes' S4 de-brittle work
(`impl-w12-scenes.md §1`). The `[viewbox-invariant]` clause reads the GEOMETRY file WITH
comments (the invariant IS prose) for the documentation sub-check, and comment-blanked
for the code sub-checks.

---

## 5. Wiring (package.json + proof:all + ci.yml)

- **`package.json` scripts** — the four `proof:*` entries added after `proof:single-writer`
  (the sibling static FSM-boundary gate), matching the demo static-gate cluster ordering.
- **`proof:all`** — all four chained after `proof:single-writer` (the local convenience
  chain mirrors the package ordering).
- **`ci.yml`** — four `- name:`/`run:` steps inserted after the `proof:single-writer`
  step in the `demo-smoke` job's static cluster (no `KF_REQUIRE_BROWSER` — they need no
  browser), each carrying a BITE-citing comment in the established ci.yml prose style.
- **`proof:ci-coverage`** — GREEN for these four (they are invoked in ci.yml; ABSENT
  from its missing list). The coverage gate's remaining `✗` lists ONLY the I3 lane's
  four gates (`proof:sequence-rows-draggable`/`proof:motion-path-editable`/
  `proof:motion-path-copy`/`proof:easter-egg`) — that lane's wiring responsibility, NOT
  this one; `proof:ci-coverage` greens fully once they wire theirs.

The other concurrent gate lanes (I3, I12 `proof:styling-idioms`, J
`proof:easing-sidebar-minimal`) authored their own scripts + package.json entries in the
same window; this lane's edits are file-disjoint (the four scripts above + my four lines
in each of package.json/proof:all/ci.yml).

---

## 6. Each gate BITES (the §Mandate bar — no vacuity). VERIFIED born-RED per clause.

Every clause was proven to red on the exact negative case it forbids, then reverted to
GREEN (transient injections, all reverted; the tree is unchanged):

| Gate · clause | Injected born-RED case | Result |
|---|---|---|
| `dragscrub-single` `[one-home]`/`[scene-clean]` | a hand-rolled `setPointerCapture` + `window.addEventListener("pointermove")` block in `SpringTarget.vue` | BOTH clauses RED → revert GREEN |
| `composable-encapsulation` `[target-clean]` | a `getTotalLength()` call leaked into `MotionPathTarget.vue`'s `<script>` | RED (named the leak line) → revert GREEN |
| `composable-encapsulation` `[store-write]` | a `store.value = …` write in `SpringTarget.vue` (outside the store dir) | RED → revert GREEN |
| `composable-encapsulation` `[pure-getter]` | a `computed({ get: () => { foo.value=1; … } })` write-in-GET | RED → revert GREEN |
| `demo-no-oversize` `[ceiling]` | 350 filler lines pushing `SpringTarget.vue` to 520L | RED (521L > 500) → revert GREEN |
| `demo-no-oversize` `[colocate]` | a `useOrphanDemo.ts` filed in a Target-less dir | RED (named the orphan) → revert GREEN |
| `no-brittle-selector` `[class-walk]` | `querySelector(".mp-stage").closest(".ancestor")` in `MotionPathTarget.vue` | RED → revert GREEN |
| `no-brittle-selector` `[named-step]` | renamed `SAMPLE_STEP` → `FOO` (bare literal) | RED → revert GREEN |
| `no-brittle-selector` `[viewbox-invariant]` | stripped `aspect-ratio: 1` from the geometry doc | RED → revert GREEN |

No gate is satisfiable by a `display:none`/`!important` suppression: each asserts an
EXACT source-shape fact the seam+scene lanes landed (the dance collapsed to one home,
the gesture engine lifted out of the Target, the demo ≤500L + colocated, the projection
named + the scale centralized-and-documented). The `demo-no-oversize` 500L clause is the
honestly-labelled born-GREEN regression guard (it bites a future over-split — proven by
the 520L injection); the other clauses red on the reconstructed pre-W12 shapes.

---

## 7. tsc / gate status at lane close

- `npm run check` (tsc --noEmit) — **PASS** (exit 0; no source edited, gates are pure
  `.mjs` instruments).
- `proof:dragscrub-single` — **PASS** (one home + scene-clean).
- `proof:composable-encapsulation` — **PASS** (engine-home + target-clean + store-write
  + pure-getter).
- `proof:demo-no-oversize` — **PASS** (≤500L + colocation; born-GREEN regression guard).
- `proof:no-brittle-selector` — **PASS** (class-walk + named-step + viewbox-invariant).
- `proof:single-writer` — **PASS** (unaffected; the sibling FSM boundary still holds).

**Out-of-lane pre-existing reds (NOT introduced by this lane, recorded honestly):**
`proof:brittleness` reds on its standing chronics (the orphan `z-index` literals, the 5
demo `addEventListener`/`ResizeObserver` sites, and the lone `useSquareAnimations.ts`
raw-`RAFPlayback` leak the seam note §6 + styling-decomp §5 already flagged as
pre-existing); `proof:decomposition` reds on the 3 `.vue` over the older 350L D-tranche
ceiling (byte-identical at the W12 spec HEAD per styling-decomp §3.3). Both pre-date
W12, are unmodified by this lane (which edits only gate scripts + package.json + ci.yml),
and are out of the four SEAM/AUDIT gates' scope. They are the I11/S4 (square leak) and
H.W8 gate-regime (350L ceiling) lanes' to fold, not this gate-authoring lane's.

The W1 FSM + W11 DFA/card + W10 normalization + W9 register all hold (this lane edits no
runtime source). The four gates are ready; they LOCK the seam (`impl-w12-seam.md`) + the
scene-enrichment de-brittle (`impl-w12-scenes.md`) so a regression reds on its exact
forbidden shape.
