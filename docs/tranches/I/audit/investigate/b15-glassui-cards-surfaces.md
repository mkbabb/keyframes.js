# b15 — glass-ui Cards / Buttons / dock surfaces (live audit)

**Agent:** investigation `[b15-glassui-cards-surfaces]`
**Tranche:** I (development) · forked off broken master `b934a08`
**Method:** Playwright over the BUILT `dist/gh-pages` (the canonical investigation harness:
`serveDist` on port 0 + `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`
chromium + `openSceneFresh` navigating `${base}/#/${scene}`). Surfaces sampled,
hovered, frame-cost-measured, screenshotted.
**Probes:**
- `docs/tranches/I/audit/investigate/probes/b15-glassui-cards-surfaces.mjs` (per-scene surface census + hover-bloom + frame cost)
- `docs/tranches/I/audit/investigate/probes/b15-dock-specular.mjs` (dock catch-light liveness + page substrate + easing idle perf)
**Shots:** `docs/tranches/I/audit/investigate/shots/b15-{cube,easing,spring,sequence,motion-path,amiga,square}.png`
**Glass-ui pin:** `~3.5.1` → resolves **exactly 3.5.1** (installed confirmed). Latest published is **3.7.0**.

This file feeds the B7 (specular) and B8 (dock/glass slow) root-cause + the
W2/W9/W11 design-language-fidelity authoring phases. It is evidence-first: every
claim below is a measured runtime observation, not a source reading.

---

## TL;DR — the five findings (most → least load-bearing)

1. **B7 ROOT CAUSE — the specular is an UNWIRED ORPHAN, on the DOCK and the glass STAGES, in the SHIPPED build. The H-tranche "fix" never wired the consumer seam.** Hovering a dock icon directly leaves `--mouse-x` **`(unset)`** — the dock's `glass-specular-track::before` falls to its `var(--mouse-x, 50%)` centred floor and paints a static `radial-gradient(circle, rgba(255,255,255,0.55)…)` warm-white bloom at intensity 0.35 that merely brightens on hover. **This is the identical D2/D14 "dead centred catch-light" defect the H proofs claimed closed.** It is real, it ships in dist, and the user reads it as a defect ("the specular issue is STILL present").
2. **B7 SECONDARY — there is NO escape via the version pin. `specular="off"` does not exist in any published glass-ui — not 3.5.1, not the latest 3.7.0.** The proof comments cite "glass-ui 3.8.0's `specular='off'` opt-out" as the forward resolution edge — **that version does not exist** (npm tops out at 3.7.0). Worse: 3.7.0 FOLDS the specular into a `.glass-material` mixin applied to **all five glass rungs + `.glass-card` + `.dock-icon-button` + the alias**, so a naive bump would make the sheen MORE pervasive, still unwired, still no opt-out. The handoff this tranche has been deferring to is **vaporware**.
3. **B8 PARTIAL — the easing stage runs at ~24 fps WHILE IDLE (mean 22.4 ms/frame, p95 41.6 ms, 20/90 frames > 32 ms), and it is NOT the glass blur.** The cube scene carries 30 backdrop-filter layers and runs a clean 8.3 ms; easing carries only 7 and janks. The idle cost is a per-frame redraw loop on the easing stage (canvas/bezier), independent of the glass material — but it is a major contributor to the user's "glass-ui elements are slow / dock animations slow" felt experience. (Cross-ref: the engine/canvas agents own the redraw loop; recorded here because it co-locates with the glass stage.)
4. **DESIGN-LANGUAGE FIDELITY — the cartoon panels read CORRECTLY as cartoon; the glass STAGES do NOT read as glass.** The left-rail `surface="cartoon"` Cards land the W2 intent (2px border, offset-stamp shadow, hover-lift). But the W11-I5 `surface="glass"` STAGES are visually inert: a glass `blur(12px)` plate over a **uniform flat `#FBFAF9` page substrate** has nothing to refract, so it reads as a plain near-white rectangle — no rim, no depth, no glass register. The "standard glass card encapsulation" the user asked for in W11 is, in practice, indistinguishable from a flat panel.
5. **REGISTER PURITY — the "cartoon" panels are not actually cartoon paper; they are translucent glass-quiet with a cartoon border bolted on (`background alpha 0.5` + `backdrop-filter: blur(10px)`).** This is glass-on-glass by glass-ui's own `glass.css` discipline note. It works visually only because the page behind is empty; it is a latent fragility, not a clean cartoon-opaque tier.

---

## Per-scene surface census (measured)

| scene | blur layers | idle frame (mean / p95 / >32ms) | cards (surfaces) | dock tracks / mouse-writes | rest bloom | hover bloom |
|---|---|---|---|---|---|---|
| cube | 30 | 8.3 / 9.3 / 0 | 4 (cartoon) | 9 / **0** | 0 | none |
| easing | 7 | **22.4 / 41.6 / 20** | 3 (cartoon + glass/stage) | 3 / **0** | 1 (stage) | stage glass @ 0.6 |
| spring | 6 | 10.3 / 24.9 / 1 | 3 (cartoon + glass/stage) | 3 / **0** | 1 (stage) | stage glass @ 0.6 |
| sequence | 4 | 8.5 / 9.1 / 0 | 2 (cartoon + glass/stage) | 2 / **0** | 1 (stage) | stage glass @ 0.6 |
| motion-path | 4 | 8.5 / 9.2 / 0 | 2 (cartoon + glass/stage) | 2 / **0** | 1 (stage) | stage glass @ 0.6 |
| amiga | 39 | 8.3 / 9.2 / 0 | 5 (cartoon) | 11 / **0** | 0 | none |
| square | 12 | 8.3 / 9.2 / 0 | 2 (cartoon) | 5 / **0** | 0 | none |

`mouse-writes = 0` on EVERY dock track in EVERY scene — the orphan signature.

---

## B7 — the specular: reproduction, behaviour, source trace, hypothesis

### Reproduction (verbatim, from `b15-dock-specular.mjs`)
Navigate `${base}/#/easing`, locate `.dock-icon-button`, move the mouse to the
icon at offset (0.7, 0.4) of its box, wait 250 ms, read the element + its
`::before`:

```json
"dockAfter": {
  "found": true,
  "mouseX": "(unset)",
  "mouseY": "(unset)",
  "beforeIntensity": "0.35",
  "beforeBg": "radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 2…"
}
```

`--mouse-x` / `--mouse-y` are **`(unset)` after a direct hover** → the pointer
seam never writes → the catch-light pins to its `var(--mouse-x, 50%)` floor and
paints a static, dead-centred warm-white bloom. Identical on every scene's dock.

### Behaviour vs intended
- **Intended (the AV.W15 M2 / glass-specular-track.css contract):** "the consumer writes the pointer location onto the element as `--mouse-x` / `--mouse-y` … DockIconButton wires it … the light travels under your fingertip."
- **Actual:** the dock writes NOTHING. The light never travels. It is a fixed warm-white radial that brightens 0.35→0.6 on hover (a dead bloom). The glass STAGES carry the same unwired `::before` (rest bloom present in the census; hover lifts it to 0.6).

### Source trace (file:line)
- `node_modules/@mkbabb/glass-ui/dist/dock.js` — the dock icon button template literal hardcodes the class: `"dock-icon-button glass-specular-track"` (track ALWAYS on). The file contains exactly **one** `--mouse-x` reference but it is not invoked on pointermove in the shipped 3.5.1 (runtime proof: `--mouse-x` stays unset through a real hover).
- `node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css:` `--specular-x: var(--mouse-x, 50%)` (the centred floor) + `radial-gradient(circle at …, hsl(40 30% 100% / 0.55) …)` + `.glass-specular-track:hover::before { --specular-intensity: 0.6 }` (the brighten-on-hover).
- `scripts/proof-no-orphan-specular.mjs` (the H-tranche gate) — its browser half checks panels do not bloom and records stage/dock tracks as **"sanctioned HANDOFF residue"** that "rides `proof:specular-handoff` born-RED, resolves at glass-ui 3.8.0's `specular='off'`." The gate is GREEN because it *accepts* the bloom as deferred — it never asserts the catch-light is WIRED. **This is the gate blind-spot incarnate:** the proof certifies the orphan as a known-deferred residue instead of a live defect.

### Root-cause hypothesis
The H-tranche never closed B7; it *re-labelled* it. Two compounding causes:
1. **The consumer seam was never wired in the SHIPPED dependency.** glass-ui 3.5.1's `dock.js` emits the `glass-specular-track` class but does not run a pointer-listener that writes `--mouse-x/--mouse-y`. kf consumes the published artifact (inv-16), so the dock catch-light is born dead. The proof's claim "DockIconButton wires it" describes glass-ui's *source intent*, not its *shipped behaviour at 3.5.1*.
2. **The deferral target is fictional.** `specular="off"` exists in NO published glass-ui (3.5.1…3.7.0 all lack it; 3.7.0 makes the specular MORE pervasive via `.glass-material`). `proof:specular-handoff` is parked born-RED against a 3.8.0 that does not exist — an un-dischargeable IOU.

**The gestalt fix direction (for the authoring phase, not done here):** stop treating the specular as a glass-ui handoff. The sheen reads as a defect to the user on EVERY surface (dock + stage). The idiomatic move is to *suppress it at the kf consume-edge* — kf already controls the `surface` choice; the kf-owned route is a one-line CSS neutraliser in the demo's own stylesheet (`.glass-specular-track::before, .glass-material::before { content: none }` scoped to kf surfaces), OR to drive a real pointer-wire if the sheen is to be kept. There is no version to wait for. (Decision — keep-and-wire vs suppress — is a root-cause/authoring call; the EVIDENCE is: it is unwired and dead everywhere, and the handoff is vaporware.)

---

## B8 (glass-related slice) — perf cost of the glass effects

- **The glass blur is NOT the bottleneck.** Backdrop-filter layer count does not correlate with frame cost: cube (30 layers) and amiga (39 layers) both run clean ~8.3 ms; the jank is on easing (7 layers) at 22.4 ms. The five-rung ladder + the `blur(1px)` input-pills are cheap on this hardware.
- **The dock specular `::before` does carry a `transition: --specular-x/--specular-y/opacity` (150–240 ms).** Because the pointer never writes, the transition never fires — so it is not a runtime cost, but it IS dead paint (a `mix-blend-mode: screen` `::before` on every dock icon, 9–11 per scene, painting a radial that does nothing). On weaker GPUs the screen-blended pseudo-layers are non-zero compositor cost for zero value.
- **The easing idle jank (mean 22.4 ms, 20/90 frames > 32 ms) is a per-frame redraw loop on the easing stage**, not the glass material — recorded here for the engine/canvas agents (cross-ref: `demo/@/components/custom/EasingCurveCanvas.vue`, `demo/easing/useEasingDemo.ts`). It nonetheless lands in the user's "glass-ui slow" bucket because it co-locates with the glass stage card.

---

## Design-language fidelity vs W2 / W9 / W11 intent

### Cartoon panels — FIDELITY HELD (with a caveat)
The `surface="cartoon"` left-rail Cards render the W2 intent correctly: `border-width: 2px`, an offset-stamp `--shadow-cartoon-md`, and a `translate` hover-lift on `--spring-bouncy`. Visually unmistakable as cartoon (see `b15-cube.png`, `b15-easing.png` left rail).

**Caveat (register impurity):** `surface="cartoon"` is NOT an opaque paper tier — the measured surface is `background: color(srgb … / 0.5)` (50 % alpha) + `backdrop-filter: blur(10px) saturate(1.05)` — i.e. it resolves the `glass-quiet` tier underneath and bolts the cartoon border/shadow on top (confirmed in glass-ui `cards.css`: `cartoon-surface` is "decoration-only … background/backdrop-filter/border-color come from the `glass-${tier}` class the host already applies"). So a "cartoon" panel is glass-quiet-plus-border. It reads as cartoon ONLY because the page substrate behind it is a uniform flat field; it is glass-on-glass by glass-ui's own discipline note. Latent, not currently broken.

### Glass stages — FIDELITY LOST
The W11-I5 user ask was "the easing/spring/sequence/motion-path scenes should have a standard, non-cartoon GLASS card encapsulation." At runtime the stage Cards DO resolve `surface="glass"` (the `glass-resting` rung, `blur(12px)`, alpha ~0.65) — the source gate `proof:stage-glass-card` is satisfied. **But the glass register is visually inert:** over the uniform `#FBFAF9` page (no gradient, no texture, no content behind), a backdrop-filter has nothing to refract, so the stage reads as a flat near-white rectangle (see `b15-easing.png` / `b15-amiga.png` — the stage is an undifferentiated pale panel; the amiga stage shows ONLY the WebGL render with no perceptible glass frame). The "glass card encapsulation" is a source-shape truth that is not a visual truth. **Glass needs something to refract; the substrate gives it nothing.**

This is the design-language form of the gate blind-spot: `proof:stage-glass-card` asserts `data-surface="glass"` resolves — which it does — while the RUNNING demo shows no glass.

---

## Concrete artifacts (paths)

- Probe A: `docs/tranches/I/audit/investigate/probes/b15-glassui-cards-surfaces.mjs`
- Probe B: `docs/tranches/I/audit/investigate/probes/b15-dock-specular.mjs`
- Shots: `docs/tranches/I/audit/investigate/shots/b15-cube.png`, `…b15-easing.png`, `…b15-spring.png`, `…b15-sequence.png`, `…b15-motion-path.png`, `…b15-amiga.png`, `…b15-square.png`
- Installed glass-ui: `node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css` (the orphan recipe), `…/dist/dock.js` (the hardcoded track class + the unfired `--mouse-x`)
- 3.7.0 comparison (pulled fresh to `/tmp/gui37`): `package/dist/CardAction-*.js` (`surface==="glass" && "glass-specular-track"` — still unconditional), `package/dist/styles/glass-specular-track.css` (the specular FOLDED into `.glass-material`, applied to all rungs)

---

## Hand-off notes for root-cause + authoring

1. **B7 is a LIVE defect mislabelled as a deferred handoff.** The headline gate-regime overhaul must add a REAL runtime gate that asserts the specular catch-light is either (a) wired (pointer write moves `--mouse-x`) or (b) suppressed — NOT merely "recorded as residue." `proof:no-orphan-specular` currently passes by *accepting* the orphan.
2. **The handoff target is vaporware.** Any wave that plans to "resolve at glass-ui 3.8.0 `specular='off'`" is blocked on a non-existent release. Decouple kf from this fiction: suppress at the kf consume-edge (a scoped `::before { content: none }`) or wire a pointer listener in the kf dock wrapper. inv-16 says kf consumes published siblings — but kf CSS may legitimately neutralise an unwired cosmetic at its own edge.
3. **The glass stages need a substrate to refract** (a subtle page gradient / texture / depth behind them) OR a different visual treatment, or the W11-I5 glass intent stays a source-shape-only truth. A real gate would sample the stage's perceptual contrast against its neighbourhood, not just `data-surface`.
4. **The "cartoon" tier is glass-quiet+border**, not opaque paper — flag for the register-purity decision (does cartoon want a real opaque fill so it cannot collapse into glass-on-glass?).
5. **Easing idle ~24 fps** is an engine/canvas redraw cost (not glass) — route to the engine/canvas surface agent.
