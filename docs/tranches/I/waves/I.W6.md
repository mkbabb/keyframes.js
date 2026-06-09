# I.W6 — THE SPECULAR RE-DECISION + GLASS SUBSTRATE (Band 4 · the two-sided consume-edge · the bloom GONE at rest)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (HIGH; B7 is a REAL
  appearance defect — it ships in `dist/`, the H "keep glass + handoff" decision rested on a
  claim the live probe DISPROVES, the user has flagged it TWICE, and glass-ui itself shipped the
  OPPOSITE default to its trunk. A pure appearance correction; no crash.) · **Scope (glass-ui
  consume-edge + kf demo-app substrate; NO kf-side glass-ui patch/fork):** the glass-ui pin
  (`package.json` `~3.5.1` → v3.8.0 line) + the stage `<Card>` `specular` choice
  (`demo/easing/EasingTarget.vue:14`, `demo/spring/SpringTarget.vue`, `StartingStyleTarget.vue`)
  + the kf demo-app page substrate (a legitimate kf-owned styling change) + the gate inversion
  (assert bloom ABSENT) + KILL `proof:specular-handoff`. · **DAG-deps:** after **I.W4** (whose
  D3 measures whether the dock perf needs the glass-ui retune — the SAME v3.8.0 cut carries BOTH
  the specular default-off AND the dock-spring/transition retune; one pin bump, two wins,
  sequenced here as a single measured motion). Independent of I.W0–I.W3 except the shared harness.

## §Provenance (the folded root cause + investigation)

- `rootcause-rc-specular-glassui.md` — the TL;DR: B7 is real, it ships in `dist/`, and the
  H-tranche never fixed it — it RE-LABELLED it as a "deferred handoff" on the strength of a claim
  the live probe disproves. kf consumes glass-ui 3.5.1, in which `<Card surface="glass">` emits
  `.glass-specular-track` UNCONDITIONALLY and NEVER wires the pointer. Result: every glass STAGE
  card and every glass dock `<Button>` paints a static, dead-centred warm-white catch-light (rest
  `--specular-intensity` 0.35 → hover ~0.6, `rgba(255,255,255,0.55)` radial core, `--mouse-x`
  NEVER written). The H decision rested on the assertion that *"at 3.5.0/3.5.1 glass-ui ALREADY
  KILLED the visible bloom"* — the b7/b15 probes prove that FALSE: the bloom paints at rest in the
  installed 3.5.1.
- `rootcause-rc-specular-glassui.md §1a` (the SHIPPED dependency, installed 3.5.1):
  `CardFooter-C390imy7.js:37` composes `surface === "glass" && "glass-specular-track"`
  UNCONDITIONALLY — there is NO `specular` prop in 3.5.1. `glass-specular-track.css` — intensity
  ladder rest 0.35 / quiet 0.22 / hover 0.6 / active 0.85; core `rgba(255,255,255,0.55)`; position
  `var(--mouse-x, 50%)` (dead centre when unset). NO pointer wiring (a `grep
  clientX|getBoundingClientRect|mouse-x` over the installed Card = 0 hits;
  `b15-dock-specular.mjs`: after a real hover, `--mouse-x`/`--mouse-y` are `(unset)`). Surface
  multiplicity (b15 census): cube 9 blooming glass dock/play tracks, amiga 11, the stage scenes
  2-4 each — every one with `mouse-writes = 0` (the orphan signature). Console errors 0, page
  errors 0 — a PURE appearance defect.
- `rootcause-rc-specular-glassui.md §1b` (published-LATEST 3.7.0 does NOT fix it):
  `package/dist/CardAction-D8nSE62a.js` — the track emission is STILL unconditional, NO `specular`
  prop, NO `specular="off"` escape. 3.7.0 DOES add pointer reads (the bloom would finally TRACK),
  but it is STILL default-ON and still blooming — a behavioral change, NOT a fix for B7 (the
  user's complaint is the RESTING warm wash). 3.7.0 FOLDS the specular into a `.glass-material`
  mixin applied across all glass rungs — a naive bump makes it MORE pervasive.
- `rootcause-rc-specular-glassui.md §1c` (the fix EXISTS, unpublished): the glass-ui working tree
  `Card.vue` now has `export type CardSpecular = "off" | "subtle" | "full"`; `withDefaults(...,
  { specular: "off" })` (default OFF); `specularArmed = computed(() => surface === "glass" &&
  specular !== "off")`; the track class emitted `specularArmed && 'glass-specular-track'` (an `off`
  glass card does NOT carry the track class, reads CLEAN over any backplate); the pointer wired
  via `src/composables/glass/useSpecularTracking.ts`. Authored by `6fac61a`. **Publication status
  (the decisive fact):** `git describe` = `v3.8.0`, `git tag --contains 6fac61a` = `v3.8.0` — BUT
  `npm view @mkbabb/glass-ui@3.8.0` → E404; `dist-tags` → `{ latest: "3.7.0" }`. v3.8.0 is a LOCAL
  release-in-progress, NOT on npm. The AX session has an active dirty tree (the release in flight).
- `recap-chronic CH-1` + `recap-deferred §3.B` + `recap-precepts §chronic-closure` — the gate
  blind-spot: `proof:no-orphan-specular` is GREEN because it RECORDS the stage/dock glass tracks
  as "sanctioned HANDOFF residue" — it asserts the bloom is PRESENT and calls that a pass; a gate
  that certifies the orphan as known-deferred is the blind-spot incarnate. `proof:specular-handoff`
  is parked born-RED against a glass-ui 3.8.0 that did not exist — an un-dischargeable IOU.

## §The state, verified (file:line / live anchors)

- **The world in one line:** kf is on 3.5.1 (blooms); npm-latest 3.7.0 (still blooms, no opt-out,
  MORE pervasive); the opt-out-default-off fix is cut to `v3.8.0` LOCALLY ONLY, unpublished.
- **kf pin:** `package.json:166` = `"@mkbabb/glass-ui": "~3.5.1"`.
- **kf stage cards:** `EasingTarget.vue:14` (`<Card tier="resting" surface="glass">`),
  `SpringTarget.vue`, `StartingStyleTarget.vue`. `design-idioms.css:255-265` (the H.W9.F3+F6
  "tracked-specular subsystem REMOVED" note — removed the KF-side `cartoon-specular` projection,
  but did NOT and CANNOT remove the UPSTREAM `surface="glass"` → `.glass-specular-track` emission).
- **Live measurement (b7 probe, all stage scenes):** rest `::before` opacity 0.35, hover
  ~0.58-0.60, `rgba(255,255,255,0.55)` radial PAINTED, `--mouse-x` written NEVER. Screenshots:
  `b7-easing-rest.png` (the centred warm wash on the right stage card AND both left control cards
  AT REST, no hover); `b15-spring.png` (the inert pale plate).
- **The SECONDARY fidelity miss (b15 #4) — the gestalt-completion, NON-BLOCKING:** even where
  `surface="glass"` resolves, the stage glass reads VISUALLY INERT — a `blur(12px)` plate over the
  UNIFORM flat `#FBFAF9` page substrate has nothing to refract, so it reads as a plain near-white
  rectangle. `proof:stage-glass-card` asserts `data-surface="glass"` resolves (true) while the
  running demo shows NO glass. This is the SUBSTRATE-DEPTH (S3) concern — the gestalt-completion of
  the bloom-removal, NOT the B7 deliverable; it is gated as a non-blocking corroborator (M-2) and
  must not hold the bloom-removal hostage.

## §Goal

**The DELIVERABLE (the B7 correctness end-state):** the glass stage cards + the 9-11 dock/play
glass `<Button>` tracks read FLAT at rest — the warm-white catch-light bloom the user calls a
defect is ABSENT IN THE RENDERED PIXELS — with ZERO kf-side CSS suppression, no fork, no
`!important`. **The GESTALT-COMPLETION (non-blocking):** the glass plate then reads as a real depth
register (a substrate it can refract) — the difference between "the source says glass" and "the eye
sees glass." The completion does NOT gate the deliverable: the bloom GOES regardless of whether the
substrate-depth pass lands.

**The design question the user's RE-FLAG forces — re-stated honestly.** The user flagged the
specular AGAIN (B7) despite the H-tranche's "keep glass + handoff the sheen" decision. So the
honest question is: *does the sheen GO now, or is the substrate-depth the gestalt-completion that
makes the glass legible?* Per `rootcause-rc-specular-glassui`, the answer is BOTH, in priority
order: **the sheen GOES at rest (this is the correctness fix the user is re-flagging — non-
negotiable, gated by clause (a)); the substrate-depth is the gestalt-completion that makes the
now-flat glass read as glass rather than a near-white rectangle (the aesthetic finish, gated only
as a non-blocking corroborator).** The CORRECTNESS gate is bloom-absent REGARDLESS of the substrate
work — the user's complaint is the resting bloom, and that is what wave-green proves.

The F6-vs-I5 fork the H-tranche split is collapsed: glass-ui itself resolved it — the v3.8.0
`specular="off"` default IS "a glass card with no resting bloom" (a clean glass plate, not a
cartoon revert). The user reading the bloom as a defect is ALIGNED with glass-ui's own §24
three-consumer-confirmed default-off, not a taste disagreement. The fix is a TWO-SIDED consume-
edge, root-owned, no kf fork.

## §Scope

- **S1 — GLASS-UI SIDE (root-owned): publish v3.8.0 (the upstream half, a coordination ask).**
  The fix is authored, merged, and locally tagged `v3.8.0` (`6fac61a` for the Card;
  `useSpecularTracking` for the wire). The single blocking action is CUTTING THAT TAG TO NPM —
  a glass-ui-repo action (a coordination ask to the AX session, which is mid-flight on exactly
  this release — the dirty tree confirms it), NOT a kf change. Per `feedback_glass_ui_root_changes`
  (all glass-ui changes go in the glass-ui repo, never patched in the kf demo), kf authors nothing
  here; it REQUESTS the publish. The same v3.8.0 cut ALSO carries the dock-spring/transition
  retune ("the AX dock+...+spring cut") — so this publish fixes B7's default-off AND I.W4's M3
  dock-perf in one. **WHY:** the specular emission is glass-ui-OWNED; the correct default (`off`)
  already lives at glass-ui HEAD; it must be SHIPPED.

- **S2 — KF SIDE (consume-edge, one line of intent): bump the pin, ride the new default.** Once
  v3.8.0 is on npm: bump `@mkbabb/glass-ui` from `~3.5.1` to the v3.8.0 line and LEAVE `specular`
  at its new default `"off"` on the stage `<Card>`s. Because the default flipped to `off`, the
  stage cards STOP emitting `.glass-specular-track` entirely — they read FLAT with ZERO kf-side
  CSS, no `!important`, no override, no fork (inv-16 satisfied: kf consumes the published default).
  The 9-11 dock/play glass `<Button>` tracks likewise go clean by the same default flip. If a
  specular accent is ever WANTED on a specific protagonist plate, the same prop opts it back in
  (`specular="subtle"`) WITH the pointer-wired travelling lens — the opt-in is the idiomatic escape
  hatch; default-off is the resting register. **WHY:** kf controls the `surface`/`specular` choice
  on its own cards; the elegant move is to choose the surface and let the UPSTREAM default do the
  work — not to fight the upstream `::before`. **Skip 3.6/3.7** (flagged as a specular regression —
  more pervasive, no opt-out); bump straight to the v3.8.0 line.

- **S3 — the substrate transposition: give the glass something to refract (folds b15 #4, kf-owned
  demo-app styling — NON-BLOCKING, the gestalt-completion, M-2).** Locus: the kf demo's own page
  chrome (a legitimate kf-owned, demo-app-level styling change, distinct from a glass-ui patch).
  Suppressing the bloom makes the glass stage read FLAT (correct) but still INERT — glass over a
  uniform field has nothing to refract. The gestalt completion of "the stages read as glass" is to
  give the SUBSTRATE something to refract: a subtle page-level depth behind the stages (a faint
  gradient / texture / token-driven backplate). **SCOPE GUARD (M-2):** S3 is the gestalt-completion,
  NOT the B7 deliverable. The B7 correctness gate is clause (a) (bloom absent) ONLY; S3's legibility
  is gated as clause (b), a non-blocking hygiene/aesthetic corroborator that may NEVER hold the
  bloom-removal hostage. Keep S3 a SINGLE measured page-level token — no per-card rim-light, no
  tuning rabbit-hole; if it flags RED while clause (a) is GREEN, the wave is GREEN and S3 carries
  as a follow-up. **WHY:** this is the difference between "the source says glass" and "the eye sees
  glass" — but the user's complaint is the BLOOM, not the flatness. Don't bolt fake rim-light onto
  the card (a fork) — give the real glass material a real thing to bend. Same elegance move as the
  specular: the substrate is kf-owned, so this IS a legitimate kf change.

- **S4 — invert the gate + KILL `proof:specular-handoff` (the gate-regime instance for B7).**
  Locus: replace `scripts/proof-no-orphan-specular.mjs`'s "record-the-residue" half; delete
  `proof:specular-handoff`. For EVERY stage glass `::before` AND every dock/play glass `<Button>`
  track, sample at REST (no hover) and assert the catch-light is ABSENT **by the rendered pixels,
  not by the source shape**: the PRIMARY oracle is a sampled luminance delta over the glass plate
  at rest ≤ a fixed threshold (no warm-white catch-light bloom in the painted pixels — the b7
  probe's `b7-easing-rest.png` reads the bloom; the gate reads its absence). The track-class
  absence (`.glass-specular-track` not emitted) and `getComputedStyle(::before).opacity ≈ 0` are
  HYGIENE-tier CORROBORATORS that explain WHY the pixels are clean — they are NOT an OR-branch the
  gate can pass on while the pixels still bloom. (Per H-1: a future glass-ui that emits a track
  with a renamed class, or paints transparent-yet-nonzero, must STILL red on the perceptual
  primary — the source-shape disjunct is exactly the LOAD-REST/WRONG-PROJECTION back-door the
  overhaul condemns.) This INVERTS the old gate (which asserted PRESENCE-as-accepted-residue). KILL
  `proof:specular-handoff` (the born-RED IOU against a phantom release — a gate that can only pass
  via an external publish nobody-in-this-repo controls is not a gate; its concern folds into the
  runtime-absence gate, which passes the instant kf consumes the default-off build — a state THIS
  repo can reach and verify). **WHY:** no appearance gate may pass by RECORDING a known defect as
  deferred, NOR by reading a source-shape proxy; it must assert the user-visible end-state (bloom
  absent in the pixels) on the RUNNING demo.

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/APPEARANCE)

**`proof:specular-absent-at-rest`** — Playwright over the BUILT `dist/gh-pages/` (the
`proof-no-orphan-specular.mjs` harness — the working template; the assertion INVERTS). **The
CORRECTNESS oracle is clause (a) ALONE; clauses (b)/(c) are corroborators that do NOT gate the
wave's green (M-2 + the two-tier taxonomy).**

- **clause (a) — CORRECTNESS — the bloom is ABSENT at rest, BY THE PIXELS, on stages + dock
  tracks.** For every stage glass `::before` AND every dock/play glass `<Button>` track, sample at
  REST (no hover) and assert NO warm-white catch-light bloom is PAINTED: the PRIMARY oracle is a
  sampled luminance delta over the glass plate at rest ≤ a fixed threshold (the same pixels the b7
  probe reads as 0.35-opacity `rgba(255,255,255,0.55)`). `getComputedStyle(::before).opacity ≈ 0`
  and the `.glass-specular-track` class-absence are HYGIENE-tier CORROBORATORS that explain the
  clean pixels — **NOT an OR-escape** (per H-1: a glass-ui that renames the class or paints
  transparent-yet-nonzero must STILL red on the perceptual primary; the source-shape disjunct is
  the WRONG-PROJECTION back-door the overhaul exists to close). **BITE:** reds TODAY — the rest
  `::before` luminance delta is the 0.35-opacity `rgba(255,255,255,0.55)` radial PAINTED on every
  glass surface (`b7` probe, `b7-easing-rest.png`); greens the instant kf consumes the v3.8.0
  default-off build (S2). **This is the INVERSION of the old gate** — it asserts ABSENCE of the
  bloom the user calls a defect, in the rendered pixels, not PRESENCE-as-accepted-residue.
- **clause (b) — HYGIENE/AESTHETIC (NON-BLOCKING) — the glass plate reads as perceptual depth
  (folds b15 #4).** Sample the stage glass plate's perceptual contrast vs its neighbourhood — flag
  whether it reads as a DISTINCT depth register, not a flat near-white rectangle. **This is the
  gestalt-completion, NOT the B7 deliverable** (M-2): it may NOT block the wave's green, and it may
  NOT hold the bloom-removal (clause a) hostage to a substrate-tuning rabbit-hole. **BITE
  (corroborating only):** reds TODAY (the `blur(12px)` plate over uniform `#FBFAF9` reads flat —
  `proof:stage-glass-card` is a source-shape truth that is not a visual truth); greens on S3 (the
  substrate depth). Source-shape `data-surface="glass"` is necessary but NOT sufficient; where this
  flags RED but clause (a) is GREEN, the wave is GREEN and the legibility is a follow-up, never a
  blocker.
- **clause (c) — HYGIENE — `proof:specular-handoff` is DELETED, not parked.** Assert the
  package.json no longer carries `proof:specular-handoff` (the born-RED IOU against a phantom
  release). **BITE:** the old gate could ONLY pass via an external publish nobody controls; its
  concern folds into clause (a), which THIS repo can reach. *(A meta-clause enforced by the I.W7
  chronic-closure rewire — a HANDOFF gate may only target a PUBLISHED version, never a future
  version number.)*

**The §spine bar — MUST bite.** Clause (a) — the CORRECTNESS oracle — samples the RUNNING stage +
dock surfaces at rest and asserts the catch-light bloom is ABSENT IN THE PIXELS (a luminance delta
≤ threshold), reproducing the user's eye, the inversion of `proof:no-orphan-specular` (which
asserted the bloom PRESENT and called it a pass — `rc-specular-glassui §2a`). RED on `b934a08` (the
rest bloom 0.35 on every glass surface), GREEN the instant kf consumes the v3.8.0 `specular="off"`
default — a state THIS repo reaches via S2, with NO dependence on the substrate work. Clause (b)
(glass legibility) is a NON-BLOCKING hygiene corroborator (M-2): the bloom-removal is the
deliverable; the substrate depth is the gestalt-completion and may NOT gate the wave. The
wave is GREEN on clause (a) alone. This gate is a CLAUSE of the I.W7 `proof:live-session` battery
(the rest-appearance leg). The chronic-closure rewire (I.W7) enforces clause (c): no born-RED gate
against an unpublished/vaporware target.

## §Folds

- **B7 / CH-1** (the specular sheen) — the DELIVERABLE is S1 (publish v3.8.0, glass-ui-owned) + S2
  (bump + ride the default-off) + S4 (invert the gate, kill the IOU): the resting bloom GOES. S3
  (substrate depth) is the NON-BLOCKING gestalt-completion (M-2) — it makes the now-flat glass
  legible but does NOT gate the bloom-removal. The F6-vs-I5 fork collapses: keep the glass SURFACE,
  drop the resting BLOOM — exactly glass-ui's new default.
- **M3 / B8 dock `transition` retune (COUPLED, one publish)** — the v3.8.0 cut carries the
  dock-spring/transition retune. I.W4's D3-b consumes it via the SAME bump; sequence the pin bump
  here as one measured motion. The publish that fixes B7's default-off ALSO carries the dock-spring
  retune — one publish, two wins.
- **glass-ui-HANDOFF (S1, born-RED-paired):** the upstream default softening + the dock retune ride
  v3.8.0. The handoff is for EVERY other glass-ui consumer; kf resolves its own edge via the bump.
  The handoff is DECOUPLED from kf's critical path — but per the I.W7 chronic-closure rewire it may
  only target a PUBLISHED version (so it cannot re-park against a phantom release).
- **REJECTED (the workaround):** `.glass-specular-track::before { content: none }` scoped to kf —
  a consumer-side suppression of an upstream cosmetic (a workaround/fork by another name). It
  violates `feedback_glass_ui_root_changes` + inv-16 and MASKS (not fixes) the unwired seam. The
  seam is upstream; the fix is upstream-publish + consume-default. (The b15 hand-off floated it;
  `recap-chronic CH-1` option B floated it; both REJECTED here per the root-changes precept.)
- **The specular is NOT B8's "dock slow" cause — RECORD.** b16 localizes B8 to the Vue
  reactive-per-rAF render storm + the dock width-morph layout hitch (I.W4). The specular fix
  neither fixes nor worsens dock perf; it is a pure appearance correction. (Removing the resting
  bloom can only REDUCE paint work — cube drops 9 `mix-blend-mode: screen` pseudo-layers painting a
  radial doing nothing.) Do not conflate.

## §Design decisions (trade-offs RESOLVED)

- **Two-sided consume-edge, root-owned, no kf fork — RESOLVED.** The specular emission is
  glass-ui-OWNED; the fix is NOT a kf-side CSS neutraliser (rejected above). The two sides: glass-ui
  publishes v3.8.0 (S1, a coordination ask), then kf bumps the pin and rides the new `specular="off"`
  default (S2) — zero kf CSS, no `!important`. The opt-in (`specular="subtle"`) is the escape hatch
  if an accent is ever wanted, WITH the pointer-wired travelling lens.
- **Re-open the H "keep glass + handoff" decision — RESOLVED.** It rested on a false "clean at
  3.5.1" claim the live probe disproves; the deferral target was unreleased; the user flagged it
  twice; glass-ui itself shipped the opposite default to trunk. The H posture is no longer
  defensible. The fork collapses: keep the glass surface, drop the resting bloom (the new default).
- **Hold the pin until v3.8.0, then skip 3.6/3.7 — RESOLVED.** The published latest (3.7.0) would
  NOT fix this — it still blooms and adds no opt-out (it makes it MORE pervasive via
  `.glass-material`). The pin is correct to HOLD at 3.5.1 until v3.8.0 publishes, then bump
  STRAIGHT to v3.8.0 (3.6/3.7 are a flagged specular regression). The pin currency answer for the
  user: NO, deliberately — and even the latest published would not fix it.
- **Give the substrate depth (S3 is kf-owned) — RESOLVED, but NON-BLOCKING (M-2).** Suppressing the
  bloom makes the glass read FLAT (correct) but INERT (glass over a uniform field has nothing to
  refract). The substrate depth is a legitimate kf demo-app styling change (distinct from a glass-ui
  patch) — give the real glass material a real thing to bend, rather than bolt fake rim-light (a
  fork). **But it is the gestalt-completion, NOT the B7 deliverable.** Per H's M-2: the B7
  CORRECTNESS gate is clause (a) (bloom absent) ONLY; the legibility clause (b) is a hygiene/
  aesthetic corroborator that must NOT BLOCK the wave's green and must NOT become a substrate-tuning
  rabbit-hole. The user's complaint is the BLOOM; the substrate is the finish. Don't let "make the
  glass legible" hold the bloom-removal hostage — if clause (b) flags RED while clause (a) is GREEN,
  the wave is GREEN and S3 carries as a follow-up.
- **The correctness oracle is PERCEPTUAL, not source-shape — RESOLVED (H-1).** Clause (a) asserts
  the bloom is absent IN THE RENDERED PIXELS (a sampled luminance delta over the plate at rest ≤
  threshold) — the PRIMARY oracle. The `.glass-specular-track` class-absence and `::before` opacity
  are HYGIENE-tier corroborators that explain WHY the pixels are clean, NOT an `OR`-branch the gate
  can pass on while the pixels still bloom. A future glass-ui that renames the track class or paints
  it transparent-yet-nonzero must STILL red on the perceptual primary. The source-shape disjunct
  was exactly the LOAD-REST/WRONG-PROJECTION back-door the overhaul exists to close — removed here.
- **Kill the IOU gate, invert the residue gate — RESOLVED.** `proof:specular-handoff` parked
  born-RED against a phantom release is un-dischargeable (it passes by accepting the defect).
  `proof:no-orphan-specular` records the bloom as residue and calls PRESENCE a pass — the blind-spot
  incarnate. Both are replaced by a runtime gate asserting the bloom is ABSENT IN THE PIXELS — a
  state THIS repo can reach and verify. No gate may pass by recording a defect as deferred, NOR by
  reading a source-shape proxy (the I.W7 precept, B7 instance).
