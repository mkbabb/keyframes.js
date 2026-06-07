# Tranche D — FINAL

D is keyframes.js' fourth tranche: **the demo refined to the engine's own
encapsulation + KISS standard, the engine transposed to its gestalt, every
keyframes-owned deferral given a terminal home.** Its content LANDED — D ships in
the published `@mkbabb/keyframes.js@4.0.0` (the B+C+D+E+F stack, `d264053`). Its
headline is the **engine transposition (D.W4) — the `[major]`** that bumped the
published library surface.

> **A retrospective close.** This FINAL is written from the G vantage. D.W6
> authored the close (`waves/D.W6.md`) and the impl ran the content, but the
> `FINAL.md` doc was the one residual the D close never committed — verified ABSENT
> at G-open (`a-deferred-ledger DP-2`), the one missing tranche record A→F where E
> and F each carry theirs. G.WZ writes it now, as a faithful record of LANDED
> content (not a forward plan), and reconciles the ONE legitimately-blocked D
> carry — D.W5 (the dock-rename, gated on glass-ui publishing 3.3.0) — to its
> terminal home in **G.W12**.

Six implementation waves' content landed on `tranche-d-impl` (5 D commits +
hardening + the G.W12 dock close):

| Commit | Waves | Headline |
|---|---|---|
| `9044ce9` | W0 | author + harden the fourth tranche (dev-only — the 5-lane audit, the ledger, the wave specs) |
| `a0303fe` | W4 | the engine transposed to its gestalt **[major]** |
| `905a8c3` | W1·W2·W3 | demo decomposed · design language localized · brittleness hardened |
| `8ff893f` | W6 | cut the Tranche D changeset [major], version owner named |
| `0063553` · `860a72d` · `6e29236` | W1–W4 review | harden the demo refactor (13 findings: 4 high + 9 med) · convergence-pass LOW residuals · lock the FrameCompiler live-options-reference |
| `1b9b05f` (G) | **D.W5 → G.W12** | the ONE blocked carry: `TopDock→ChromeDock` · `dock/index.ts` barrel DELETED · the `:always-expanded` occlusion mask REMOVED · the vitest VT stub realigned (rides glass-ui 3.3.0) |

---

## The waves — landed content, each gated

### D.W4 — the engine transposed to its gestalt (the headline `[major]`, `a0303fe`)

The deepest re-architecture, behind a deliberately-bumped major (no alias, no
shim — a removed name is removed). `src/animation/engine.ts` 346 deletions;
`src/animation/frame-compiler.ts` (+332) new.

- **D-1 [PERF] `AnimationGroup` compositor zero-alloc (inv θ).** The per-frame
  `groupedValues` object literal + the per-layer `Object.fromEntries` whitelist
  allocation excised — a hoisted `_grouped` instance buffer (cleared in place) +
  an inlined property-whitelist key-skip. The headline group path now honors the
  zero-alloc discipline the class's reuse buffers were built for.
  Gate: **`proof:zero-alloc`** (`bench`/`test/zero-alloc.test.ts`, 0 bytes/frame
  steady-state, bite-proven by buffer identity / `KF_ALLOC_INJECT=group`).
- **D-2 [SIMPLICITY] `tick(t)` → `advanceTo(t)` at the driver layer.** The
  absolute-rAF-clock advance on `Animation` / `AnimationGroup` (and the WAAPI
  shadow loop) renamed to `advanceTo(t)`, so `tick` means exactly one thing
  across the engine (the `tickDt(dt)` stepper surface C canonicalized).
  Gate: **`proof:engine`** tick-canon (`0` driver `tick(` in `engine.ts`/`group.ts`).
- **D-4 [ELEGANCE] the `Animation` god-object split at the `FrameCompiler` seam.**
  The ~1019-line class (`src/animation/engine.ts:126-1145`) decomposed: a
  standalone, run-state-free `FrameCompiler` owns the template→sampled-frames
  pipeline (`addFrame`/`parse`/reconcile/compile), unit-testable without a clock;
  `Animation` (1019→847L) retains the playback state-machine and composes one.
  The public barrel is **byte-stable** (`Animation`/`CSSKeyframesAnimation`/
  `AnimationGroup`/`getAnimationId` + every property the group reads, delegated
  where the data now lives). Gate: **`proof:engine`** FrameCompiler-seam +
  `test/frame-compiler.test.ts`; later locked for the live-options reference
  (`6e29236`, engine review #32).
- **D-5 `AnimationGroup.pause` made honest.** The method that secretly toggled
  splits into idempotent `pause()`/`resume()` + an explicit `toggle()`;
  `Animation` gains the same `toggle()`, its `pause(draw)` toggle-branch + `draw`
  param retired. The demo follows (`toggleAnimationGroup→toggle`, `scrub→resume`).
- **D-6 the W0-slipped residuals.** `_snapSettled` symmetric across both steppers
  (smooth now stops its loop, as spring did — `smooth.ts`, `test/snap-symmetry.test.ts`);
  `internal/leaves.ts`'s `| any` tightened to the precise opaque-handle union;
  the deprecated value.js path-compat re-exports (`lerp*` from `animation/utils`,
  `formatCSS` from `animation/format`) **deleted** — import from `@mkbabb/value.js`
  directly. Gate: **`proof:engine`** no-legacy (the re-export grep = 0).
- **D-3 [PERF] computed-unit changed-keys write — MEASURED + WITHHELD (inv ε).**
  The keyframes-local benefit is ~0 on the interpolation hot path (every animating
  key changes every frame; only held constants are cache-skippable — measured 33%
  unchanged = held constants only), and the real re-serialization cost lives in
  value.js, outside inv-16 scope. The measurement is recorded
  (`test/d3-changed-keys.measure.test.ts`) rather than a speculative optimization
  shipped. (F.W6 later landed the real win in value.js — `iv._lerp`, −94%.)

### D.W1 — the demo decomposed (encapsulation · KISS, `905a8c3`)

The five oversized units split at their seams; the duplication net-deleted; zero
behaviour change.

- The five units decomposed to their ceiling — **AnimationControlsGroup 552→335**
  (`ControlsPaneWrapper` + `RibbonBar` + `useControlsLayout`), **KeyframesEditor
  487→263** (`KeyframeCardList` + `KeyframesAddDialog`), **useKeyframesEditor 383→56**
  (`useKeyframesParsing`/`State`/`Ops`), **KeyframeTimeline 441→254**, **useTimeline
  251→74**.
- `parseCSSAnimationKeyframes` deduped to ONE pure
  `keyframes/utils/parseAnimationCSS.ts` (both inline copies —
  `KeyframesStringControls.vue` + `useKeyframesEditor.ts` — deleted).
- The three mis-filed pure timeline utils re-homed `composables/` → `utils/`.
- The in-component rAF/timeout blobs swapped to vueuse `useRafFn`/`useTimeoutFn`
  (the demo-internal inv ζ analogue — carry no hand-roll the engine already is).

Gate: **`proof:decomposition`** (ceilings hold · single adapter body ·
pure-utils-rehomed · no hand-rolled async).

### D.W2 — the design language localized + un-caged (`905a8c3`)

- **The rented idioms OWNED (inv η).** `demo/@/styles/design-idioms.css` DEFINES
  the idioms the demo referenced demo-wide but rented ungated from glass-ui /
  tw-animate-css — `--rainbow-*` (incl. `--rainbow-cyan`), `--color-gold`,
  `.scale-on-hover` (reduced-motion aware), `@keyframes enter`. The ungated
  cross-repo rent (a green build one sibling rename from flattening) closed by
  ownership, not by deletion (`.scale-on-hover` is used 13×, `--rainbow-*` feeds
  two live SVG gradients).
- **The monolith uncaged.** `utils.css` **DELETED** — its six component-rule
  families uncaged to `<style scoped>` / partials (`tab-trigger.css`,
  `playback-button.css`, `brand.css`, `.demo-*` → `style.css`/`SquareScene`).
- **The φ-ladder leaf-tail F6 terminated (the chronic A→B→C).** The
  `text-sm`/`xs`/`base` body sites migrated to the semantic golden-ratio ladder
  (the display tier closed in C.W2; D closes the leaf-tail — the chronic ends).
  `!`-overrides → scoped CSS; recurring arbitrary values → tokens.

Gate: **`proof:idioms`** (every referenced idiom resolves from the demo's OWN
built CSS — `design-idioms.css` — not only the transitive cascade; bites on a
removed demo-local def, verified) + the leaf-tail consumption sweep (raw body
rungs = 0, excl. vendored `ui/`).

### D.W3 — brittleness hardened (selectors · reactivity · fragile rules, `905a8c3`)

- The brittle DOM-walk selectors → owned refs: the global
  `document.querySelectorAll("pre")` → `useTemplateRef`; `.closest(".easing-target")`
  → owned refs; the `[data-sonner-toaster]` coupling → ONE documented
  `isInsideToaster()` helper.
- The glass-ui `--z-*` scale documented + gated (`--z-behind` for the lone raw
  `z-index:-10`); `@supports` guards for `dvh` / `env()` / `-webkit-mask-image`.
- Reactivity gated: the `useAnimationSync` rAF bridge gated, the array-watch flush
  fixed, the `useScrollFade` re-attach hardened. + the engine `_snapSettled`
  symmetry (D-6) verified.

Gate: **`proof:brittleness`** (the selector / z-index-scale / `@supports` checks).

### D.W5 — the dock leveraged + the mobile composition (the ONE blocked carry → closed via **G.W12**)

D.W5 was authored (`waves/D.W5.md`) and was the **one legitimately-blocked carry**
in the D plan: its actionable-now scope was **GATED on glass-ui PUBLISHING
3.3.0** (the dock correctness base + the touch-gate B′ fix landed in glass-ui
`f0b0ffb` but were unpublished; D pins the *published* package, never the sibling
branch). At D-close glass-ui was still pinned `file:../glass-ui`
(`package.json`), so D.W5 **did not close in D** — it was the one carry D.W6
recorded as awaiting glass-ui 3.3.0 (`8ff893f`: "W5 dock+occlusion close + the W6
FINAL await glass-ui 3.3.0").

**Terminal home: `G.W12`** (`1b9b05f`, "dock D.W5 close, rides glass-ui 3.3.0").
Once glass-ui 3.3.0 was consumed off the `file:` link (the **G.W2 re-pin**), the
kf-demo dock half landed:

- `TopDock` → `ChromeDock` (the AU.W8 role-vocabulary local rename, still
  composing the published glass-ui dock primitives — `GlassDock` +
  `DockLayer`/`DockLayerGroup`/`DockIconButton`/`DockSelectTrigger`).
- the local `dock/index.ts` pass-through barrel **DELETED** (the published
  primitives imported directly — verified gone).
- the `:always-expanded="isMobile"` occlusion-dodge **mask REMOVED** (not tuned —
  glass-ui's rebuilt dock owns no-occlusion). `occlusion-gate.mjs` stays green
  **mask-free** — the crutch is gone, the gate holds without it.
- the dead single-layer `DockLayerGroup` collapsed; the vitest VT stub realigned
  to `satisfies typeof import("@mkbabb/glass-ui/motion-core")`.

The **square-scene mobile-composition occlusion** (KFD-2) was the residual D.W5
intended to co-land. Its honest terminal disposition in G is **glass-ui-HANDOFF**:
the mobile dock occlusion ROOT lives in the rebuilt dock, fixed in the dock root —
**never re-masked in the demo** (the §Mandate's no-workaround). `occlusion-gate.mjs`
is the standing HARD instrument (mask-free, both axes).

### D.W6 — the close (recap · deferred terminal · release, `8ff893f`)

The CONTENT ran: the changeset cut, the version owner named, the prompt-recap
confirmed, the deferred ledger terminated (below). The `FINAL.md` doc was the one
residual — written here.

---

## The deferred ledger — terminated (P-invariant-28: no perpetual punts)

D is the terminal home for every keyframes-owned deferral. Every item carries a
real disposition, a named owner, and a proving instrument (`audit/deferred-ledger.md`,
`PROGRESS.md` "Open deferrals"). At the G vantage every KFD is discharged with the
D.W5 carry now closed via G.W12:

| Item | Tag | Terminal disposition | Proof |
|---|---|---|---|
| φ-ladder leaf-tail F6 (89 body sites) — CHRONIC A→B→C | KFD | migrated in **D.W2** | the consumption sweep (raw body rungs = 0) |
| Engine `_snapSettled` asymmetry | KFD | symmetrized in **D.W3** | `proof:engine` snap-symmetry + `test/snap-symmetry.test.ts` |
| `leaves.ts \| any` + deprecated path-compat re-exports | KFD | tightened/deleted in **D.W4** | `proof:engine` no-legacy grep = 0 |
| Consumer dock-rename + `dock/index.ts` deletion — the ONE blocked carry | KFD | **closed via G.W12** (glass-ui 3.3.0 consumed at the G.W2 re-pin) | `grep TopDock\|AnimationMenuBar` = 0 (`ChromeDock`); `dock/index.ts` gone |
| `always-expanded="isMobile"` double-tap mask | KFD | **removed via G.W12** (B′ fix published) | `occlusion-gate.mjs` HARD, green mask-free |
| Square-scene mobile-composition occlusion | KFD → glass-ui-HANDOFF | the ROOT is the rebuilt dock — fixed in the dock root, never re-masked (G.WV hand-off) | `occlusion-gate.mjs` HARD, both axes |
| ASK-3 `LabeledField` a11y · ASK-2 `--spring-*` codegen | OUT | glass-ui owns; D kept the enabler (`springLinearStops()`) stable, no vendor band-aid | named lighthouse allowance; byte-stable export |
| Dock double-tap (ASK-1) | OUT — RESOLVED | fixed by glass-ui B′ (`f0b0ffb`); the mask removed (G.W12) | `occlusion-gate.mjs` green |
| glass-ui foundational slices (reka-Tabs rail, strict-templates, `<Role>Dock` base) | OUT | AU's own un-landed arm; D depended only on the landed base + published primitives | — |
| ScrollTimeline-native-REPLACE · Worker/OffscreenCanvas · dev.sh/deploy.sh | ARCH | permanent KILL (recorded; do not re-litigate) | — |
| LoAF/>50ms-trace · EasingTarget leak · dead scene CSS · cartoon-shadow | CLOSED | done in C; D verifies no regression | the C gates (bite) |

**P-invariant-28 satisfied.** No item is a perpetual punt: every KFD has a wave +
a proving gate (D.W5's kf-demo half closing in G.W12, not named-forward
perpetually); every OUT names a sibling owner + the kept-stable enabler; every
ARCH carries its KILL rationale; every CLOSED is regression-checked by a biting
gate. (D's terminal-home record is why E and F each opened with a **CLEAN ledger,
zero KFE** — D had already terminated all chronic debt.)

---

## The gate suite — each VERIFIED by a checked-in instrument (inv ε)

Every recorded-MET gate resolves to a re-runnable instrument shown to PASS, not a
narration. At D-close (335 tests / 28 files green; `tsc` 0; the demo builds):

| Gate | Instrument | Wave |
|---|---|---|
| inv α — boundary | `proof:boundary` (the light/heavy edge intact post-`FrameCompiler` split) | standing + D.W4 |
| inv ζ — dogfood | `proof:dogfood` (no hand-rolled rAF the engine already is) | standing + D.W1/W3 |
| inv δ — occlusion | `occlusion-gate.mjs` (HARD, allowance EMPTIED mask-free at G.W12) | standing + D.W5→G.W12 |
| inv θ — zero-alloc group composite | `proof:zero-alloc` (0 bytes/frame steady-state, bite-proven) | D.W4 |
| no-legacy | `proof:engine` no-deprecated-reexport grep | D.W4 |
| engine tests | `npm test` (the `advanceTo` / `FrameCompiler` / `pause-resume-toggle` suite) | D.W4 |
| inv η — design-idiom owned | `proof:idioms` (every idiom resolves from the demo's OWN built CSS) | D.W2 |
| inv ι — φ-ladder leaf-tail / monolith | the consumption sweep (raw body rungs = 0) | D.W2 |
| decomposition | `proof:decomposition` (ceilings · single adapter · pure-utils-rehomed) | D.W1 |
| brittleness | `proof:brittleness` (selector / z-index / `@supports` checks) | D.W3 |

The W1–W3 content was further hardened post-landing under review — `0063553` (13
findings: 4 high + 9 med), `860a72d` (the convergence-pass LOW residuals) — and
the FrameCompiler live-options reference test-locked at `6e29236` (engine review
#32).

---

## The prompt-recap confirmed

`audit/prompt-recap.md` (authored at D.W0) is CONFIRMED: every request across
A → B → C → the constellation drive → the D ask resolves ADDRESSED or has a named
D-SCOPE fold this close discharges. The two historical drifts (B's falsely-closed
LoAF; B's advisory inv δ) were *corrected* in C, not dropped — D verifies they
stay corrected (the gates bite). The recurring precepts — no-legacy, no-workaround,
isomorphic, measure-first (the honest D-3 withhold), KISS, inv-16 — hold in the
landed waves. The one by-design loose end (the stacked publish leg's version
owner) is named below. No drops.

---

## Release + version owner

D is a **`major`** (`.changeset/tranche-d.md`). D's published-library surface is
the **engine transposition (W4)** — the `tick`→`advanceTo` driver rename, the
`AnimationGroup.pause`→`pause/resume/toggle` honest API, the `Animation`
god-object split at the `FrameCompiler` seam, the zero-alloc compositor, the
retired path-compat re-exports — intentional, unaliased renames (no-legacy). The
demo refinement (W1 decomposition · W2 design-language localization · W3
brittleness) lands in the demo + CI gates and does not change the published API.

D's changeset shipped stacked atop the cut-but-unpublished **B `3.1.0` + C
`major`** changesets, folded so one provenance-signed publish ships the whole B+C+D
engine transposition. The **version owner is Mike Babb** (`mike@babb.dev`), who
finalizes the SemVer tier and drives `changeset version` → tag → `release.yml`.
The publish leg is **user-domain, confirm-first** — identical to A/B/C.

The D content was published in **`@mkbabb/keyframes.js@4.0.0`** — the combined
**B+C+D+E+F** stack (`d264053 chore(release): @mkbabb/keyframes.js 4.0.0 — the
B+C+D+E+F stack`; combined tier `major`, driven by C/D). keyframes.babb.dev (the
Cloudflare Pages deploy-of-record) serves the stack.

**D closed honestly: the demo refined to the engine's standard, the engine
transposed to its gestalt behind a deliberately-bumped major, every
keyframes-owned deferral given a terminal home — the one legitimately-blocked
carry (D.W5, gated on glass-ui 3.3.0) recorded as the carry, now closed via
G.W12. D was the terminal home for the debt; E and F manufactured none.**
