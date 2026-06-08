# B7 — the specular sheen is STILL present · "are we using the latest glass-ui?"

**Investigation agent:** `b7-specular-glassui`
**Date:** 2026-06-08
**Harness:** Playwright (chromium via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`),
serving the BUILT `dist/gh-pages/` on an ephemeral port — modeled on
`scripts/proof-no-orphan-specular.mjs`.
**Probe:** `docs/tranches/I/audit/investigate/probes/b7-specular.mjs` (RUN; output below).
**Screenshots:** `docs/tranches/I/audit/investigate/shots/b7-{easing,spring,sequence,motion-path,cube}-{rest,hover}.png`

---

## TL;DR — the two answers the user asked

1. **"Are we using the latest glass-ui?"** — **NO.** kf is pinned `~3.5.1` and the lockfile
   resolves **3.5.1**. npm latest is **3.7.0** (published 2026-06-08T05:15Z, *after* this
   install). Two newer published versions exist: **3.6.0** and **3.7.0**.

2. **Does the specular reproduce, and is the H-tranche "keep glass + handoff the sheen"
   decision still right?** — The sheen **reproduces live and exactly** (rest opacity 0.35,
   hover ~0.59, the `rgba(255,255,255,0.55)` warm-white radial). And the H-decision is now
   **STALE**: glass-ui has since **inverted the default** — `Card`'s `specular` now defaults
   to **`"off"`** (a clean flat resting panel, NO bloom). The user is right to flag it again;
   the "wait for 3.8.0, handoff born-RED" posture deferred a fix that glass-ui has **already
   designed and merged** to its working tree. The catch is the inverted default is **NOT yet
   published** — it is unreleased (`git describe` = `v3.6.0-116`), so bumping to the published
   3.7.0 alone does **not** fix it.

---

## Reproduction steps

1. `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js node \`
   `  docs/tranches/I/audit/investigate/probes/b7-specular.mjs`
   (serves `dist/gh-pages/`, visits `#/easing`, `#/spring`, `#/sequence`, `#/motion-path`,
   `#/cube`; reads the `::before` of every `[data-surface]` + `.glass-specular-track` at rest,
   then hovers the **stage glass card** and re-reads).
2. Observe each glass STAGE card (`<div data-surface="glass">` inside `.stage-cell`) paint a
   warm-white centred radial `::before`.

No interaction beyond hover is needed — the bloom is present **at first paint**.

---

## Behavior vs intended (the measured live evidence)

| Scene | glass surfaces | track elements | rest `::before` | hover opacity | paints `rgba(255,255,255,0.55)` radial | `--mouse-x` written |
|---|---|---|---|---|---|---|
| easing | 1 | **4** | `radial-gradient(circle, rgba(255,255,255,0.55) 0%, …)` @ **0.35** | **0.5836** | yes | **never** (empty rest+hover) |
| spring | 1 | **4** | same | **0.5802** | yes | never |
| sequence | 1 | **3** | same | **0.5959** | yes | never |
| motion-path | 1 | **3** | same | **0.5960** | yes | never |
| cube | 0 | **9** | same (all `<Button>` glass) | — | yes | never |

**Console errors: 0. Page errors: 0.** (This is purely a visual/appearance defect — exactly the
class the source-shape gates are blind to.)

What the user sees: every glass plate (the stage card AND the glass `<Button>` dock/play
controls) carries a soft warm-white bloom that **brightens on hover** (0.35 → ~0.59) but
**does not move** — `--mouse-x`/`--mouse-y` are never written in 3.5.1, so the catch-light
sits dead-centred. glass-ui's *intent* was the iOS-26 "Liquid Glass illuminate-under-your-
fingertip" travelling lens; in 3.5.1 the consumer-pointer seam is unwired on `Card`, so the
intended travelling lens degrades to a **static centred wash** — a sheen with no motivation,
which reads as a rendering defect, not a feature. The cube route (panels only, no stage)
still shows **9** blooming glass `<Button>` tracks — the "S5 handoff residue" the H-gate
records-but-does-not-fail.

Screenshot evidence: `shots/b7-easing-hover.png` shows the centred warm bloom on the right
stage card and both left control cards; `shots/b7-spring-rest.png` shows it present at rest.

---

## Source trace (file:line)

**The unconditional emission (consumer side, installed 3.5.1):**
- `node_modules/@mkbabb/glass-ui/dist/CardFooter-C390imy7.js:37` — Card composes
  `surface === "glass" && "glass-specular-track"` UNCONDITIONALLY (no `specular` prop exists in
  3.5.1; the props block is `{tier, surface, shadow, grain, hover, class, asChild, as}`).
- `node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css` — the `.glass-specular-
  track::before` masked radial; intensity ladder **rest 0.35 / quiet 0.22 / hover 0.6 / active
  0.85** (verbatim from the installed file). The `rgba(255,255,255,0.55)` core is the bloom.
- **No pointer wiring** in the installed Card: `grep clientX|getBoundingClientRect|mouse-x`
  over `CardFooter-C390imy7.js` = **0 hits**. Confirms the static-centred floor.

**The published-latest (3.7.0) — STILL UNCONDITIONAL:**
- `npm pack @mkbabb/glass-ui@3.7.0` → `package/dist/CardAction-D8nSE62a.js:54` still composes
  `surface === "glass" && "glass-specular-track"` with **no `specular` prop** (props block =
  `{tier, surface, shadow, grain, hover, class, asChild, as}`). Probe-verified:
  `3.7.0 dist Card has specular prop/default-off: false` · `still emits unconditional track: true`.
- NOTE: 3.7.0's Card `setup` DOES add a `p(e)` pointer handler (reads `clientX`/
  `getBoundingClientRect`) — so on 3.7.0 the bloom would finally TRACK the cursor. But it would
  still be **default-on**, still blooming — a behavioral change, not a fix for B7.

**The actual fix (glass-ui working tree — UNRELEASED):**
- `/Users/mkbabb/Programming/glass-ui/src/components/ui/card/Card.vue:44,65,74,84-86` —
  `export type CardSpecular = "off" | "subtle" | "full"`; `specular?: CardSpecular`;
  `withDefaults(..., { specular: "off" })`; `specularArmed = surface==="glass" && specular!=="off"`.
  The doc-comment (lines 36-39) states the **default-off rationale verbatim**: *"off — NO
  catch-light (default). The clean resting panel: a data/content `surface="glass"` card over
  any backplate reads flat — no centred white bloom, no pointer wiring. The §24 three-consumer-
  confirmed default for the common content-card case."*
- Authored by glass-ui commit `6fac61a` *"feat(card): specular?: off|subtle|full opt-in prop —
  clean resting panel by default (AX.W09 digest-consumer-ask)"*.
- **`git tag --contains 6fac61a` = EMPTY** → this commit is in **no published tag**. `git
  describe --tags` on the glass-ui working tree = **`v3.6.0-116-ge2c9995`** (116 commits past
  the last tag). The local `package.json` says `3.7.0` but the published 3.7.0 tarball does NOT
  contain it (verified above) — the working tree is ahead of what was cut to npm.

---

## Root-cause HYPOTHESIS

**Primary root cause:** kf consumes glass-ui **3.5.1**, in which `<Card surface="glass">`
emits `.glass-specular-track` **unconditionally** and **never wires the pointer**, so every
glass STAGE card and glass `<Button>` paints a static, dead-centred warm-white catch-light
(rest 0.35 → hover ~0.6). This is a glass-ui-OWNED default, not a kf authoring bug — the
H-tranche correctly identified it as "glass-ui residue" and correctly chose NOT to fork/
suppress it in kf.

**Why the H-decision is now WRONG (the re-open the user's re-flag demands):** the H-narrative
asserted the opt-out is "the glass-ui 3.8.0 forward edge, unpublished — kf adds no override/
fork; ride `proof:specular-handoff` born-RED." Two of those premises are now FALSE:
1. The opt-out is **no longer hypothetical** — it is authored, merged, and *defaults to OFF*
   in the glass-ui working tree (`6fac61a`). glass-ui itself decided the clean flat panel is
   the correct default. The user reading the bloom as a defect is **aligned with glass-ui's
   own design conclusion**, not a taste disagreement to be handed off.
2. The handoff was framed as "passive — wait for the version bump." But the fix is **unreleased**
   (no tag contains it), so a passive `npm update` / bump-to-3.7.0 does **not** deliver it. The
   handoff therefore has no automatic landing date; it requires either (a) glass-ui cutting a
   release that includes `6fac61a`, or (b) kf taking a concrete action against the published
   surface area it controls.

**Performance note (measure-first):** the catch-light is a single `::before` masked radial-
gradient per glass surface. Cost is modest per-element but **multiplies** — cube alone paints
**9** of them, the stage scenes 3-4 each. It is paint+composite (no JS in 3.5.1 since the
pointer is unwired), so the per-frame cost at rest is ~zero; the visible cost is the *static
wash* itself, plus a `mask-image` composite layer per surface. It is not the cause of B8's
"dock animations slow/broken" (that is a separate motion-pipeline issue), but the masked-
radial layers do add to the glass-surface compositing budget. Removing the rest-state bloom
would *reduce* paint work, never increase it.

**Disposition this feeds to root-cause/authoring (NOT decided here):** the elegant, no-fork,
no-legacy options, in rough preference order —
- **(A)** Wait/drive glass-ui to **cut a release containing `6fac61a`**, then bump kf's pin and
  set the stage cards to `specular="off"` (now the default — so a bump alone flips them flat).
  This is the gestalt fix: kf consumes the published default-off, the stages read clean, zero
  kf-side CSS. Blocked only on a glass-ui release.
- **(B)** If a glass-ui release is not on this tranche's clock, the *idiomatic consumer escape
  that exists TODAY in 3.5.1* is the published **`prefers-reduced-transparency` a11y bracket**
  — `glass-specular-track.css` already `display:none`s the `::before` under that query. That is
  a glass-ui-sanctioned suppression, not a kf fork, but it is a11y-conditional (not a general
  fix) — record, do not over-reach.
- **(C)** The H-posture (keep the bloom, ride born-RED) is **no longer defensible** given the
  user has now flagged it **twice** and glass-ui has shipped the opposite default to its trunk.
  Whatever the chosen mechanism, the I-tranche disposition should be **"the stage glass cards
  read FLAT — no resting bloom"**, gated by a REAL runtime probe (this probe is the template:
  assert `paintsRadial === false` on every stage glass `::before` at rest), NOT a source-shape
  check and NOT a born-RED deferral.

The gate-blindspot lesson lands squarely here: `proof:no-orphan-specular` went GREEN by
**recording the stage bloom as "accepted residue"** — it asserted the bloom is PRESENT on the
sanctioned stages and called that a pass. A gate that certifies the exact pixels the user calls
a defect is the blindspot incarnate. The I-tranche gate must assert the bloom is **ABSENT** at
rest on the stages, reproducing the user's eye.

---

## Artifacts

- Probe: `docs/tranches/I/audit/investigate/probes/b7-specular.mjs`
- Screenshots: `docs/tranches/I/audit/investigate/shots/b7-easing-rest.png`,
  `b7-easing-hover.png`, `b7-spring-rest.png`, `b7-spring-hover.png`,
  `b7-sequence-{rest,hover}.png`, `b7-motion-path-{rest,hover}.png`, `b7-cube-rest.png`.
- Version evidence: installed `node_modules/@mkbabb/glass-ui/package.json` = **3.5.1**;
  `package.json` pin = `~3.5.1`; `npm view @mkbabb/glass-ui version` = **3.7.0**;
  glass-ui working tree `git describe` = `v3.6.0-116-ge2c9995`, fix commit `6fac61a` in **no tag**.
