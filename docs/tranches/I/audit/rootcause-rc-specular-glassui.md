# Root cause — B7: the specular sheen STILL reads as a defect · the glass-ui posture

**Agent:** ROOT-CAUSE `[rc-specular-glassui]`
**Tranche:** I (development) — forked off the broken master `b934a08`, branch `tranche-i-dev`
**Date:** 2026-06-08
**Inputs read:** `investigate/b7-specular-glassui.md`, `investigate/b15-glassui-cards-surfaces.md`,
`investigate/b16-perf-profile.md`, memory `project_glassui_specular_consume_edge`,
`feedback_glass_ui_root_changes`, `feedback_glass_ui_storage_colorpicker`, the kf↔glass-ui
coordination doc `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md`,
and the H-tranche `proof:no-orphan-specular` gate.
**Live-verified this session** against the published 3.5.1 (installed), the published-latest 3.7.0
(fresh `npm pack`), and the glass-ui working tree (now locally tagged `v3.8.0`). Every version claim
below is a direct artifact read, not a memory recall.

This document is the DESIGN INPUT for the I-tranche waves. It states the confirmed root cause
(file:line), WHY the gates missed it, and the idiomatic gestalt fix DIRECTION — the seam and the
architectural transposition. It is not a patch and it prescribes no workaround.

---

## TL;DR — the one-paragraph truth

B7 is **real, it ships in `dist/`, and the H-tranche never fixed it — it re-labelled it as a
"deferred handoff" on the strength of a claim the live probe disproves.** kf consumes glass-ui
**3.5.1**, in which `<Card surface="glass">` emits `.glass-specular-track` **unconditionally** and
**never wires the pointer**. Result: every glass STAGE card and every glass dock `<Button>` paints a
static, dead-centred warm-white catch-light (rest `--specular-intensity` 0.35 → hover ~0.6,
`rgba(255,255,255,0.55)` radial core, `--mouse-x` **never written** in any scene). The H decision to
"keep glass + handoff the sheen" rested on the assertion that *"at 3.5.0/3.5.1 glass-ui ALREADY
KILLED the visible bloom"* — the b7/b15 probes prove that assertion **FALSE**: the bloom paints at
rest in the installed 3.5.1. The fix (`specular` opt-in, **default `"off"`**, with a real
pointer-wired travelling lens) **does** now exist — but it lives ONLY in the glass-ui working tree's
locally-tagged `v3.8.0`, which is **NOT published** (npm `latest` = 3.7.0). So the handoff has no
landing date a passive `npm update` can reach. The gestalt fix is a TWO-SIDED consume-edge:
**(1) publish glass-ui v3.8.0** (the root-repo change — per `feedback_glass_ui_root_changes`, the fix
lives in glass-ui, not patched in kf), then **(2) bump kf's pin and leave `specular` at its new
default `"off"`** so the stage cards read FLAT — no kf-side CSS, no fork, no `!important`. The
gate-regime overhaul must assert the bloom is **ABSENT at rest** on a RUNNING stage (reproducing the
user's eye), not "recorded as accepted residue."

---

## 1. The confirmed root cause (file:line, version-by-version, live-verified)

### 1a. The defect in the SHIPPED dependency (installed `3.5.1`)

- **`node_modules/@mkbabb/glass-ui/dist/CardFooter-C390imy7.js:37`** — `<Card>` composes
  `surface === "glass" && "glass-specular-track"` **unconditionally**. The props block is
  `{tier, surface, shadow, grain, hover, class, asChild, as}` — **there is no `specular` prop** in
  3.5.1. Any `surface="glass"` card therefore carries the track class by construction.
- **`node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css`** — the
  `.glass-specular-track::before` masked radial. Intensity ladder **rest 0.35 / quiet 0.22 /
  hover 0.6 / active 0.85**; core `rgba(255,255,255,0.55)` (the warm-white bloom). Position is
  `var(--mouse-x, 50%)` — i.e. it falls to **dead centre** whenever `--mouse-x` is unset.
- **No pointer wiring.** A `grep clientX|getBoundingClientRect|mouse-x` over the installed Card =
  **0 hits**. Live probe (`b15-dock-specular.mjs`): after a real hover directly onto a dock icon,
  `--mouse-x`/`--mouse-y` are **`(unset)`** → the catch-light pins to its centred floor and the
  "iOS-26 travelling lens" intent degrades to a **static centred wash**. A sheen with no
  motivation — which is precisely why it reads as a rendering defect, not a feature.
- **Live measurement (b7 probe, all stage scenes):** rest `::before` opacity **0.35**, hover
  **~0.58–0.60**, `rgba(255,255,255,0.55)` radial **painted**, `--mouse-x` written **never**.
  Console errors **0**, page errors **0** — a pure appearance defect, the exact class the
  source-shape + load-time gates are blind to.
- **Surface multiplicity (b15 census):** the bloom is NOT only on the stage. The cube route paints
  **9** blooming glass `<Button>` dock/play tracks; amiga **11**; the stage scenes 2–4 each. Every
  one has `mouse-writes = 0` — the orphan signature, on every surface, in every scene.

> Screenshot ground truth: `shots/b7-easing-rest.png` shows the centred warm wash on the right
> stage card AND both left control cards **at rest, no hover**; `shots/b15-spring.png` shows the
> same inert pale panel. The bloom is present at first paint.

### 1b. The published-LATEST (`3.7.0`) does NOT fix it — verified this session

`npm pack @mkbabb/glass-ui@3.7.0` → `package/dist/CardAction-D8nSE62a.js`:
```
`glass-${t.tier}`, t.surface === "glass" && "glass-specular-track", t.surface === "ca…
```
- The track emission is **STILL unconditional** — `surface === "glass" && "glass-specular-track"`,
  with **no `specular` prop** gating it. There is **no `specular="off"` escape** in 3.7.0.
- 3.7.0's Card setup DOES add pointer reads (`clientX` / `getBoundingClientRect` / `--mouse-x` are
  present in `CardAction-*.js`), so on 3.7.0 the bloom would finally TRACK the cursor — but it is
  still **default-ON** and still blooming. That is a behavioral change, **not a fix for B7**: the
  user's complaint is the resting warm wash, not the absence of motion.
- b15 additionally found 3.7.0 FOLDS the specular into a `.glass-material` mixin applied across all
  glass rungs — confirmed present (`package/dist/styles/glass.css`, `glass-refract.css`,
  `glass-specular-track.css` all reference `glass-material`). A naive bump to 3.7.0 would make the
  sheen **MORE** pervasive, not less.

**Conclusion: bumping kf's pin to the published latest does NOT resolve B7.** The deferral target
the H-tranche pointed at ("resolves at the version bump") is unreachable by `npm update`.

### 1c. The fix EXISTS — but only in glass-ui's UNPUBLISHED working tree (`v3.8.0`-local)

- **`/Users/mkbabb/Programming/glass-ui/src/components/ui/card/Card.vue`** (working tree) now has:
  - `export type CardSpecular = "off" | "subtle" | "full"`; prop `specular?: CardSpecular`;
  - `withDefaults(..., { specular: "off" })` — **default OFF**;
  - `specularArmed = computed(() => surface === "glass" && specular !== "off")`;
  - the track class is emitted **`specularArmed && 'glass-specular-track'`** — i.e. an `off`
    (default) glass card does **NOT** carry the track class and **reads clean over any backplate**;
  - the pointer is wired via a DRY composable **`src/composables/glass/useSpecularTracking.ts`**
    (`@pointermove="specularArmed && onPointerMove($event)"`), so when opted in, the lens actually
    travels.
  - the doc-comment states the default-off rationale verbatim: an `off` glass card "reads CLEAN
    over any backplate … the §24 three-consumer-confirmed default for the common content-card case."
- Authored by glass-ui commit **`6fac61a`** *"feat(card): specular?: off|subtle|full opt-in prop —
  clean resting panel by default (AX.W09 digest-consumer-ask)."*
- **Publication status (the decisive fact).** This session, the glass-ui working tree has advanced:
  `git describe --tags` = **`v3.8.0`**, and `git tag --contains 6fac61a` = **`v3.8.0`** (the B7
  finding observed it earlier at `v3.6.0-116`, in no tag; it has since been tagged). **BUT:**
  - `npm view @mkbabb/glass-ui@3.8.0` → **E404, "No match found for version 3.8.0."**
  - `npm view @mkbabb/glass-ui dist-tags` → `{ "latest": "3.7.0" }`.
  - The local `v3.8.0` tag commit (`f5c244d`) differs from working-tree HEAD (`c075467`,
    "chore(release): glass-ui 3.8.0 — the AX dock+aurora+font+spring cut"); the AX session has an
    active dirty tree (the coordination doc + USER-DEFECTS ledger are modified).
  - **So v3.8.0 is a LOCAL release-in-progress, not on npm.** The fix is real and tagged, but a kf
    consumer cannot install it today.

**The state of the world in one line:** kf is on 3.5.1 (blooms); npm-latest 3.7.0 (still blooms,
no opt-out); the opt-out-default-off fix is cut to `v3.8.0` **locally only**, unpublished.

---

## 2. WHY the gates missed it (the blind-spot, named precisely)

This is the headline lesson and the design input for the gate-regime overhaul.

### 2a. `proof:no-orphan-specular` certified the EXACT pixels the user calls a defect

The H-tranche gate (`scripts/proof-no-orphan-specular.mjs`) is GREEN. Its browser half checks that
the **cartoon panels** do not bloom (exception set → ∅) — true — and then **records the stage + dock
glass tracks as "sanctioned HANDOFF residue"** that "rides `proof:specular-handoff` born-RED,
resolves at glass-ui 3.8.0's `specular='off'`." It asserts the bloom is **PRESENT** on the
sanctioned stages and calls that a pass. **A gate that certifies the orphan as known-deferred,
instead of asserting the catch-light is WIRED-or-ABSENT, is the blind-spot incarnate.** It is green
precisely because it *accepts* the defect.

### 2b. The decision rested on a claim the gate never re-grounded

The kf↔glass-ui coordination doc (the basis for the "keep glass + handoff" decision) asserts:
> *"At 3.5.0/3.5.1 glass-ui already KILLED that visible bloom (the pointer-radial is dead at rest):
> the glass stages are visually clean … the rendered `::before` paints nothing."*

**This is false in the installed artifact.** The b7/b15 LIVE probes read the rendered `::before` at
rest opacity **0.35** painting the `rgba(255,255,255,0.55)` radial — it does NOT paint nothing. The
decision to defer was built on an ungrounded "it's already clean" claim that no gate re-verified
against the actual rendered surface. **The gate checked source shape (`data-surface="glass"`
resolves; panels carry no override) and a NARRATIVE ("clean at 3.5.1"), never the live pixels.**
This is the appearance-axis blind-spot from `feedback_gate_blindspot_appearance_axis` verbatim:
*green source-shape gates miss appearance; audit the RUNNING demo.*

### 2c. The deferral target was vaporware at decision time

`proof:specular-handoff` was parked **born-RED against a glass-ui 3.8.0 that did not exist** (3.5.1…
3.7.0 all lack the opt-out; 3.7.0 makes it more pervasive). An IOU with no discharge path is not a
"handoff" — it is an un-closeable gate masquerading as deferred work. A gate that can only ever pass
by an external release nobody controls is, operationally, a permanent RED dressed as a plan.

### 2d. The compounding fidelity miss (b15, same blind-spot)

Even if the bloom were suppressed, b15 found the glass STAGES read **visually inert**: a
`blur(12px)` glass plate over the **uniform flat `#FBFAF9` page substrate** has nothing to refract,
so it reads as a plain near-white rectangle. `proof:stage-glass-card` asserts `data-surface="glass"`
resolves (true) while the running demo shows **no glass** (no rim, no depth, no refraction). Source
truth ≠ visual truth. This is the SAME class of blind-spot and must be folded into the same gate
discipline: a real gate samples the stage's perceptual contrast against its neighbourhood, not just
the attribute.

---

## 3. The idiomatic GESTALT fix DIRECTION (the seam, the transposition — NOT a patch)

The decision the user's re-flag forces: **re-open the F6-vs-I5 fork.** F6 = "remove the tracked
specular entirely"; I5 = "the stages must be a non-cartoon GLASS card." The H-tranche read these as
in conflict and split the difference (keep glass, keep the inert bloom, defer). **They are NOT in
conflict** — glass-ui itself has resolved them: the v3.8.0 `specular="off"` default IS "a glass card
with no resting bloom." A `surface="glass" specular="off"` card is a clean glass plate, not a
cartoon revert. The user reading the bloom as a defect is **aligned with glass-ui's own design
conclusion** (the §24 three-consumer-confirmed default-off), not a taste disagreement. So the fork
collapses: **keep the glass surface, drop the resting bloom — which is exactly the new default.**

### The architectural transposition — a TWO-SIDED consume-edge, root-owned, no kf fork

The governing precept (`feedback_glass_ui_root_changes`): *all glass-ui changes go in the glass-ui
repo, never patched in the kf demo.* The specular emission is glass-ui-OWNED. Therefore the fix is
**not** a kf-side CSS neutraliser. The b15 hand-off floated `.glass-specular-track::before {
content: none }` scoped to kf — **reject that.** It is a consumer-side suppression of an upstream
cosmetic (a workaround/fork by another name), it violates `feedback_glass_ui_root_changes` and
inv-16, and it would mask (not fix) the unwired seam. The seam is upstream; the fix is upstream.

**The two-sided edge (in dependency order):**

1. **GLASS-UI SIDE (root-owned) — publish v3.8.0.** The fix is authored, merged, and locally tagged
   `v3.8.0` (commit `6fac61a` for the Card; `useSpecularTracking` for the wire). The single
   blocking action is **cutting that tag to npm.** This is a glass-ui-repo action (a coordination
   ask to the AX session, which is mid-flight on exactly this release — the dirty tree confirms it),
   NOT a kf change. Per the root-changes precept, kf authors nothing here; it requests the publish.
   *The seam: glass-ui owns the specular default; the correct default (`off`) already lives at HEAD;
   it must be shipped.*

2. **KF SIDE (consume-edge, one line of intent) — bump the pin, ride the new default.** Once v3.8.0
   is on npm: bump `@mkbabb/glass-ui` from `~3.5.1` to the v3.8.0 line and **leave `specular` at its
   new default `"off"`** on the stage `<Card>`s. Because the default flipped to `off`, the stage
   cards stop emitting `.glass-specular-track` entirely — they read FLAT with **zero kf-side CSS,
   no `!important`, no override, no fork** (inv-16 satisfied: kf consumes the published default).
   The 9–11 dock/play glass `<Button>` tracks likewise go clean by the same default flip. *The seam:
   kf controls the `surface`/`specular` choice on its own cards; the elegant move is to choose the
   surface and let the upstream default do the work — not to fight the upstream `::before`.*

   If a specular accent is ever WANTED on a specific protagonist plate, the same prop opts it back in
   (`specular="subtle"`) WITH the pointer-wired travelling lens — the lens that actually travels,
   not the dead centred wash. The opt-in is the idiomatic escape hatch; default-off is the resting
   register.

### The substrate transposition (folds B7's sibling fidelity miss, b15 #4)

Suppressing the bloom makes the glass stage read FLAT (correct) but still INERT — glass over a
uniform field has nothing to refract. The gestalt completion of "the stages read as glass" is to
**give the substrate something to refract**: a subtle page-level depth behind the stages (a faint
gradient / texture / token-driven backplate in the kf demo's own page chrome — this IS a legitimate
kf-owned, demo-app-level styling change, distinct from a glass-ui patch). This is the difference
between "the source says glass" and "the eye sees glass." It is the same elegance move: don't bolt
fake rim-light onto the card (a fork) — give the real glass material a real thing to bend. Route
this to the design-language wave; it shares the gate with B7 (assert perceptual depth, not the
attribute).

### Performance posture (measure-first; b16 + b15)

- The specular `::before` is a single masked radial-gradient per glass surface — paint+composite,
  **no JS at rest** in 3.5.1 (pointer unwired), so per-frame cost at rest is ~zero. **Removing the
  resting bloom can only REDUCE paint work, never increase it** (cube alone drops 9 `mix-blend-mode:
  screen` pseudo-layers that paint a radial doing nothing).
- The specular is **NOT** the cause of B8's "dock slow." b16 localizes B8 to (a) a Vue
  reactive-per-rAF render storm on `/easing` and (b) the glass-ui dock-spring dropping 12/114 frames
  on expand. Those are SEPARATE root causes (PERF-1, PERF-3) — do not conflate them with B7. The
  specular fix neither fixes nor worsens dock perf; it is a pure appearance correction. (The
  dock-spring is glass-ui-owned and rides the SAME v3.8.0 cut — "the AX dock+...+spring cut" — so the
  publish that fixes B7's default-off ALSO carries the dock-spring retune; one publish, two wins.)
- The "are we using the latest glass-ui?" answer for the user, plainly: **No (pinned 3.5.1); and the
  latest PUBLISHED (3.7.0) would NOT fix this — it still blooms and adds no opt-out. The version that
  fixes it (v3.8.0) is cut locally but not yet on npm.** The pin is correct to hold until v3.8.0
  publishes; then bump straight to it (skip 3.6/3.7, which b15/memory flag as a specular regression).

---

## 4. The gate the I-tranche MUST author (the design input for the gate-regime overhaul)

Replace the "record-the-residue" gate with a **REAL runtime appearance gate** that reproduces the
user's eye. The b7 probe is the working template; the assertion inverts:

- **Drive a real browser** over the BUILT `dist/gh-pages` (the proven harness:
  `proof-no-orphan-specular.mjs` pattern — `serveDist` on port 0 + chromium via
  `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js` + `openSceneFresh`).
- For **every stage glass `::before` AND every dock/play glass `<Button>` track**, sample at REST
  (no hover): **assert the catch-light is ABSENT** — `getComputedStyle(::before).opacity ≈ 0` OR the
  track class is not emitted at all. This is the inversion of the old gate: it asserts ABSENCE of the
  bloom the user calls a defect, not PRESENCE-as-accepted-residue.
- **Kill `proof:specular-handoff`** (the born-RED IOU against a phantom release). A gate that can
  only pass via an external publish nobody-in-this-repo controls is not a gate. Its concern folds
  into the runtime-absence gate above, which passes the instant kf consumes the default-off build —
  a state THIS repo can reach and verify.
- **Companion fidelity gate (folds b15 #4):** sample the stage glass plate's perceptual contrast vs
  its neighbourhood — assert it reads as a distinct depth register, not a flat near-white rectangle.
  Source-shape `data-surface="glass"` is necessary but NOT sufficient; the gate must see glass.
- **The precept the overhaul enshrines:** no appearance gate may pass by *recording* a known defect
  as deferred. It must assert the user-visible end-state (bloom absent, glass legible) on the RUNNING
  demo, clicking/hovering as the user does. This closes the appearance-axis blind-spot for B7
  specifically and stands as the template for the whole gate-regime overhaul.

---

## 5. Disposition summary (for the wave author)

| Item | Verdict |
|---|---|
| Is B7 a real defect? | **YES** — live-reproduced in `dist/`, rest bloom 0.35, `--mouse-x` never written, on stages AND 9–11 dock tracks per scene. Screenshots `b7-easing-rest.png`, `b15-spring.png`. |
| Does the H "keep glass + handoff" decision hold? | **NO.** It rested on a false "clean at 3.5.1" claim the probe disproves; the deferral target was unreleased; the user has now flagged it twice; glass-ui itself shipped the opposite default to trunk. **Re-open and resolve.** |
| Does the sheen need to GO? | **YES, at rest** — collapse the F6/I5 fork: keep the glass SURFACE, drop the resting BLOOM. That is precisely glass-ui's new `specular="off"` default. Not a cartoon revert. |
| Does a newer glass-ui fix it? | **3.6/3.7 — NO** (still blooms, no opt-out, 3.7 more pervasive; 3.6/3.7 are a flagged regression). **v3.8.0 — YES**, but it is **cut locally, NOT published** to npm. |
| The idiomatic path (glass look without the bloom)? | **Two-sided consume-edge:** (1) glass-ui publishes v3.8.0 [root-repo, coordination ask to AX]; (2) kf bumps the pin and rides the new `specular="off"` default — zero kf CSS, no fork. Plus: give the page substrate real depth so the flat glass plate has something to refract (kf demo-app styling, legitimate). |
| Any CSS-suppression workaround? | **REJECTED.** `.glass-specular-track::before { content: none }` in kf violates `feedback_glass_ui_root_changes` + inv-16 and masks (not fixes) the upstream seam. The fix is upstream-publish + consume-default. |
| The gate to author | A RUNTIME absence gate (bloom ABSENT at rest on stages + dock tracks) + a glass-legibility gate (perceptual depth, not just `data-surface`). **Delete `proof:specular-handoff`.** No gate may pass by recording a defect as deferred. |

### The seam, in one sentence

The specular default lives in glass-ui (it owns the `::before` emission); the correct default
(`off`, pointer-wired opt-in) already exists at glass-ui HEAD and is tagged `v3.8.0` but unpublished
— so the idiomatic, no-fork, no-workaround fix is **publish v3.8.0 upstream, then bump kf's pin and
consume the new flat-by-default glass card**, gated by a runtime probe that asserts the bloom is
ABSENT and the glass is LEGIBLE on the running demo.

---

## Artifacts cited / verified this session

- Installed: `node_modules/@mkbabb/glass-ui/package.json` = **3.5.1**;
  `dist/CardFooter-C390imy7.js:37` (unconditional track, no `specular` prop);
  `dist/styles/glass-specular-track.css` (rest 0.35, `rgba(255,255,255,0.55)`, `var(--mouse-x,50%)`).
- kf pin: `package.json:166` = `"@mkbabb/glass-ui": "~3.5.1"`.
- Published 3.7.0 (fresh `npm pack` → `/tmp/gui-verify`): `package/dist/CardAction-D8nSE62a.js`
  (`surface === "glass" && "glass-specular-track"` — STILL unconditional, no `specular` prop;
  pointer reads present but default-ON); `.glass-material` confirmed in `glass.css`/`glass-refract.css`.
- npm state: `latest` = **3.7.0**; `@3.8.0` → **E404 (unpublished)**.
- glass-ui working tree `/Users/mkbabb/Programming/glass-ui`: `git describe` = **`v3.8.0`**;
  `git tag --contains 6fac61a` = **`v3.8.0`**; `src/components/ui/card/Card.vue`
  (`specular?: CardSpecular`, `withDefaults(..., { specular: "off" })`, `specularArmed`,
  `@pointermove="specularArmed && onPointerMove"`); `src/composables/glass/useSpecularTracking.ts`
  (the DRY pointer wire). HEAD `c075467` = "chore(release): glass-ui 3.8.0 — the AX dock+...+spring
  cut"; tree dirty (AX release in progress).
- kf stage cards: `demo/easing/EasingTarget.vue:14` (`<Card tier="resting" surface="glass">`),
  `demo/spring/SpringTarget.vue`, `demo/spring/StartingStyleTarget.vue`;
  `demo/@/styles/design-idioms.css:255-265` (the H.W9.F3+F6 "tracked-specular subsystem REMOVED"
  note — removed the kf-side `cartoon-specular` projection, but did NOT and CANNOT remove the
  upstream `surface="glass"`→`.glass-specular-track` emission).
- Gate: `scripts/proof-no-orphan-specular.mjs` (records stage/dock tracks as accepted residue);
  the born-RED `proof:specular-handoff` against the phantom release.
- Coordination doc: `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md`
  (the "clean at 3.5.1" claim the live probe disproves).
- Memory: `project_glassui_specular_consume_edge`, `feedback_glass_ui_root_changes`,
  `feedback_gate_blindspot_appearance_axis`.
- Screenshots: `investigate/shots/b7-easing-rest.png` (rest bloom on stage + both control cards),
  `b7-{spring,sequence,motion-path,cube}-{rest,hover}.png`, `b15-spring.png` (inert pale plate).
