# E — the consolidated deferred ledger (A → B → C → D → E)

This is the **whole-history** deferred ledger, every item from tranche A
forward carried to its terminal status as of E-open. It chains and supersedes
the per-tranche ledgers:

- A: `docs/tranches/A/FINAL.md` §5 (Deferrals & named-forwards)
- B: `docs/tranches/B/FINAL.md` §Deferrals
- C: `docs/tranches/C/audit/lanes/deferred-ledger.md` + `C/FINAL.md` §Deferrals
- D: `docs/tranches/D/audit/deferred-ledger.md` (the terminal-home ledger)

**The headline, verified by the 6-lane E assay:** D was the terminal home for
**every keyframes-owned deferral**. The ledger D closed is CLEAN — there is
**ZERO KFE** (nothing folds into an E wave from chronic debt). E's content is
NET-NEW findings, not folded debt; this ledger states that honestly and proves
it item-by-item below.

**P-invariant-28 is satisfied:** E folds no chronic debt because none remains.
Every prior keyframes-owned item is either CLOSED, terminated in a D wave, or
correctly OUT/ARCH. There is no perpetual punt to inherit.

---

## Status taxonomy (terminal, as of E-open)

| Tag | Meaning |
|---|---|
| **CLOSED** | landed + gated in a prior tranche; later tranches verify no regression |
| **KFD-TERMINATED** | a keyframes-owned deferral whose terminal home was a D wave (authored on `tranche-d-impl`; D.W1–W4 landed, D.W5/W6 are D-PENDING-ON-E1 — see §D-PENDING) |
| **OUT** | a sibling repo (glass-ui) owns the fix; keyframes keeps the enabler + named allowance stable; **E keeps these stable, does not re-own** |
| **ARCH** | permanent KILL with recorded rationale; **do not re-litigate** |
| **D-PENDING-ON-E1** | a D-OWNED close (W5 dock+occlusion, W6 release) gated on glass-ui publishing 3.3.0; D's heartbeat (`b5gt704vz`) auto-resumes it — **D's close, NOT E's scope** |
| **USER-DOMAIN** | the stacked publish leg — confirm-first, by design |
| **E-SCOPE** | net-NEW findings the 6-lane E assay surfaced — **not in this ledger** (this is the *deferral* ledger; the net-new findings are the E waves themselves, tabled in `prompt-recap.md` §E-SCOPE) |

**Why there is no KFE row:** KFE would mean "a keyframes-owned chronic deferral
folding into an E wave." There is none. D terminated the chronic set; the E
waves (encapsulation r2, the vueuse-listener gestalt, styling r2, perf +
modern-web, engine housekeeping) are net-new refinement findings, authored from
the post-D assay, NOT carried debt. **E folds zero deferrals.**

---

## CLOSED — landed in A/B/C, D-verified, E inherits as a regression bar

### CL-1 — `proof:boundary` (the value.js light/heavy seam gated)

- **Closed in:** A (`scripts/proof-boundary.mjs`, inv α), HARDENED in C.W4
  (bare-import / subpath / `export const` false-negative classes closed).
- **Status at E-open:** STANDING GATE. Every light-barrel export bundles
  value.js-free; the heavy engine reaches value.js only via dynamic
  `loadAnimationEngine()`. E barely touches the library — but any E.W5 engine
  edit stays bound by it.
- **E duty:** keep green; do not introduce a static value.js edge in a light
  module.

### CL-2 — inv γ (the demo cannot ship blank)

- **Closed in:** B.W4 (`scripts/demo-smoke.mjs`).
- **Status at E-open:** STANDING. The built `dist/gh-pages/` mounts + paints,
  CSS emits, heavy chunks off the critical path.
- **E duty:** E.W4 (perf) must keep the demo painting after any
  content-visibility / preload / font-loading change — `demo-smoke` is the bar.

### CL-3 — inv δ (no page occludes on any viewport)

- **Closed in:** B.W3 (advisory), made HARD in C.W1 (`occlusion-gate.mjs`,
  both `controls:{closed,open}` axes, bite-proven `KF_OCCLUSION_INJECT=cube`).
- **Status at E-open:** HARD STANDING GATE, with ONE named self-cleaning
  allowance (square/mobile) — terminated in D.W5 (see KFD-TERMINATED-2; the
  allowance self-clears when D.W5 lands).
- **E duty:** verify no regression. The E demo waves (encapsulation r2, styling
  r2) must not reintroduce a clip or overflow.

### CL-4 — the LoAF observer / >50ms-trace 2nd consumer (the B drift, C-corrected)

- **History:** B FALSELY closed it (claimed a 2nd consumer that was a stub).
  C.W1 CORRECTED it — `bench/playwright.bench.ts` is the real 2nd consumer (a
  200-cell AnimationGroup composite reading `window.__kfLoaf`, failing on >50ms
  main-thread blocking). D verified no regression; D-1's zero-alloc group
  transposition gave it headroom.
- **Status at E-open:** CLOSED + corrected; the correction is PRESERVED across
  the chain (see `prompt-recap.md` §drift).
- **E duty:** E.W4's Long-Task/INP relief is *aligned* with this gate — the
  modern-web perf work should give the >50ms gate further headroom, never
  regress it.

### CL-5 — inv ζ (the demo dogfoods its own engine)

- **Closed in:** C.W3 (`scripts/proof-dogfood.mjs`) — 7 hand-rolled rAF loops
  transposed onto `SmoothProgress`/`SpringProgress`/`NumericAnimation`/
  `RAFPlayback`; reddens on a non-allowlisted rAF.
- **Status at E-open:** STANDING. Note: the surviving manual
  `addEventListener`/`ResizeObserver` sites the E assay found (E.W2 / E-SCOPE)
  are the *listener/observer* analogue inv ζ did NOT cover — they are NET-NEW
  (the rAF gestalt is closed; the listener gestalt is the E completion). This is
  the inv-ζ analogue, not a re-open of inv ζ.
- **E duty:** E.W2 extends `proof:brittleness` to the listener/observer surface;
  `proof:dogfood` stays green.

### CL-6 — inv ε (the close is honest — re-runnable instruments, not narration)

- **Closed in:** C (established) — every MET gate is a re-runnable instrument's
  passing run; C reconciled B's seven overclaims. D carried the discipline
  forward (each D wave a falsifiable hard gate).
- **Status at E-open:** STANDING DISCIPLINE. Every E wave spec carries a
  falsifiable, re-runnable hard gate (the same bar).
- **E duty:** author each E gate as an instrument (grep/wc/lighthouse), never an
  assertion.

### CL-7 — the C demo-polish set (EasingTarget leak · dead scene CSS · cartoon-shadow · halo · modal blur · demo dock a11y labels)

- **Closed in:** C (the demo-polish wave): the `.glass-card` global-scope
  `--track-ball-size-*` leak scoped; the orphaned `.scene-*` rules removed +
  scene-swap restored via `SpringProgress`; CSSCodeEditor `.cartoon-surface`;
  SquareScene `color-mix` halo; KeyboardShortcutsModal blur removed; demo-owned
  dock a11y labels added.
- **Status at E-open:** CLOSED.
- **E duty:** the E styling wave (E.W3) must not reintroduce a hand-roll; the
  lighthouse + occlusion gates stay green.

### CL-8 — the φ-ladder typography migration (display tier C, leaf-tail D)

- **History:** the CHRONIC A→B→C design item. C.W2 closed the DISPLAY tier (58
  instrument-serif sites → the semantic ladder; sweep = 0). D.W2 terminated the
  LEAF-TAIL (the body-tier `text-sm`/`text-xs`/`text-base` sites → the semantic
  ladder). `grep text-sm\|text-xs\|text-base demo/@/styles/style.css = 0`
  (verified at E-open).
- **Status at E-open:** CLOSED (display tier C, leaf-tail D). **The chronic
  ENDED in D** — this is the single most-deferred item across the project, and
  it has a terminal home. There is no leaf-tail residue for E.
- **E duty:** E.W3 (styling r2) must not reintroduce a raw body rung; the
  `proof:idioms` ladder sweep stays 0.

> Figure note: the leaf-tail body-site count drifted across the chain (C FINAL
> "~128", C deferred-ledger / D ledger "89"). The discrepancy is a counting-base
> artefact (which `text-*` rungs count as "body" vs "display" / which dist
> directories polluted the grep — see C prompt-recap finding 13, the 13MB stale
> dist). It does not affect terminal status: D.W2 swept the body tier to 0 in
> `style.css`. E does not re-litigate the figure.

---

## KFD-TERMINATED — the keyframes-owned deferrals D owned (terminal home named)

These were the D-fold (`KFD`) set. **D was their terminal home.** D.W1–W4
LANDED (`905a8c3`, `a0303fe`, `6e29236` on `tranche-d-impl`); D.W5/W6 are
authored + D-PENDING-ON-E1 (see §D-PENDING). **None folds into E.**

### KFD-TERMINATED-1 — the engine W0-slipped residuals (`_snapSettled` · `leaves.ts | any` · deprecated re-exports)

- **D home:** D.W3 (`_snapSettled` snap symmetry) + D.W4 (`leaves.ts | any`
  tighten; the deprecated path-compat re-exports deleted — no legacy).
- **Status at E-open:** TERMINATED in D.W4 (landed `a0303fe`/`6e29236`). The
  three items BOOKED at C.W0 + SLIPPED C.W4 found their terminal home in D.
- **E duty:** none. The engine is EXEMPLARY post-D (the E engine assay found no
  re-introduced legacy re-export; only 2 trivial BOOK items remain — see E.W5,
  which are NET-NEW, not these).

### KFD-TERMINATED-2 — the square-scene mobile-composition occlusion

- **D home:** D.W5 — the terminal fix (the optical-split under-reserve +
  controls-grid row-starve); `occlusion-gate.mjs`'s self-cleaning stale-check
  fires when closed.
- **Status at E-open:** D-PENDING-ON-E1 (D.W5, gated on glass-ui 3.3.0). This is
  D's close. **E does NOT own it** — E's demo waves are independent of D.W5 and
  must not regress inv δ on the square scene.
- **E duty:** none beyond keeping inv δ green; the allowance is D's to empty.

### KFD-TERMINATED-3 — the consumer dock-rename + `dock/index.ts` deletion

- **D home:** D.W5 — `TopDock` → `ChromeDock`, `AnimationMenuBar` →
  `TransportDock` (LOCAL renames adopting the AU.W8 role-vocabulary, each
  composing the published glass-ui primitives); DELETE the local re-export
  `demo/@/components/custom/dock/index.ts`.
- **Status at E-open:** D-PENDING-ON-E1. Verified the source is still PRE-rename
  (`dock/index.ts`, `TopDock.vue`, `AnimationMenuBar.vue` all present at
  E-open) — D.W5 has not yet run because it gates on glass-ui publishing 3.3.0.
  **This is D's close, NOT E's.** The `<Role>Dock` BASE-COMPONENT leverage stays
  gated on glass-ui AU.W8 (BOOK until a 2nd consumer) — OUT, see OUT-4.
- **E duty:** none. E does not touch the dock; E's waves are gate-free of
  glass-ui (the E DAG is independent of the dock close).

### KFD-TERMINATED-4 — the `always-expanded="isMobile"` double-tap mask

- **D home:** D.W5 — removed at both sites
  (`dock/TopDock.vue`, `animation-controls/AnimationMenuBar.vue`) on the 3.3.0
  pin (the touch-gate B′ fix `f0b0ffb` published).
- **Status at E-open:** D-PENDING-ON-E1 (rides D.W5 / the 3.3.0 pin). Per
  project memory, the dock double-tap is a glass-ui-ROOT fix never patched in
  the demo — so the mask stayed until the published fix; D removes it on the
  pin bump.
- **E duty:** none.

---

## OUT — glass-ui owns it; E keeps the enablers stable + the named allowances

E inherits these as STANDING obligations: **keep the enabler stable, keep the
named allowance, apply NO vendor band-aid (inv-16).** E does NOT re-own or
re-litigate them.

### OUT-1 — ASK-3 `LabeledField` a11y label-association (bucket-glassui)

- **Owner:** glass-ui (filed `docs/tranches/B/asks/glass-ui-adoption-asks.md`).
- **E obligation:** keep the named lighthouse allowance `bucket-glassui` in
  `lighthouse-gate.mjs`; apply no demo-side patch. The full A11y=100 SCORE binds
  when glass-ui ships the `LabeledField` fix → the demo bumps the pin → the
  bucket empties.
- **E interaction:** E.W4 runs lighthouse on every scene; the `bucket-glassui`
  allowance is the ONE remaining a11y allowance and stays named (not a demo
  hack). E's perf target is on Performance, not a re-open of the a11y allowance.

### OUT-2 — ASK-2 / VAL-9 `--spring-*` token codegen

- **Owner:** glass-ui (codegen lives in glass-ui's build).
- **E obligation:** keep the enabler — the `springLinearStops()` export — stable
  and value.js-free (`proof:boundary`). E barely touches the library; the
  export's signature/output stays untouched so glass-ui can codegen its spring
  tokens from keyframes' proven solver.
- **E interaction:** none in E's demo waves; E.W5 (engine housekeeping) is
  BOOK-only and does not touch `springLinearStops()`.

### OUT-3 — ASK-1 dock double-tap (RESOLVED, mask removal rides D.W5)

- **Owner:** glass-ui (RESOLVED by instrument — the touch-gate B′ fix
  `f0b0ffb`, ships in 3.3.0). The consequent demo-side mask removal is
  KFD-TERMINATED-4 (D.W5, D-PENDING-ON-E1).
- **E obligation:** none. The cross-arm edge that became actionable in D is D's
  to land on the pin bump; E does not touch it.

### OUT-4 — glass-ui foundational slices + the `<Role>Dock` base-component (AU.W8)

- **Owner:** glass-ui's AU arm (AU.W8) — the reka-Tabs rail, strict-templates,
  the `<Role>Dock` role-vocabulary + base-rename machinery + a role-typed BASE
  COMPONENT (BOOK in glass-ui until a 2nd consumer appears).
- **E obligation:** none. D adopted the AU.W8 role-vocabulary as LOCAL rename
  NAMES (KFD-TERMINATED-3), taking no dependency on a role-typed base. If AU.W8
  ships a role-typed dock base and keyframes graduates as its 2nd consumer, that
  is a future circle-back — NOT E's scope. E's waves are gate-free of glass-ui.

---

## ARCH — permanent KILL (recorded; do NOT re-litigate)

These were KILLed-with-rationale across A→C and re-affirmed in D. **E records
them as permanent and does not re-open them.** No consumer pull exists; the
plan's E.W0 explicitly enumerates them as recorded KILLs.

### ARCH-1 — ScrollTimeline-native

- **Rationale:** the native `ScrollTimeline` drives an animation off the
  compositor thread; keyframes' `Timeline` is a caller-polled sampling pipeline
  (`sample() → clamp → easing → boundary snap → smoothing → progress`). The
  native API does not fit the contract; feature-detecting it would not replace
  the JS sampler. The E perf/modern-web assay re-affirmed this — ScrollTimeline
  is correctly JS-driven, not a modern-web gap.
- **Re-open trigger:** a real consumer requiring off-thread scroll binding —
  none across A→B→C→D→E.

### ARCH-2 — Worker / OffscreenCanvas / Atomics

- **Rationale:** no consumer. PERMANENT-ARCHIVE since A, re-affirmed B/C/D, and
  re-affirmed by the E perf assay (the engine is hot-path-allocation-free; no
  off-thread substrate is pulled).
- **Re-open trigger:** a worker-thread animation consumer appears.

### ARCH-3 — `dev.sh` / `deploy.sh`

- **Rationale:** the npm scripts (`npm run dev` / `build` / `gh-pages`) are the
  canonical surface; a shell-script duplicate is a legacy parallel path. KILLed
  with rationale at C.W4 S7 (the terminal call).
- **Re-open trigger:** none — the npm scripts are the contract.

---

## D-PENDING-ON-E1 — D's own close (NOT E's scope)

> This bucket exists to be EXPLICIT that two items look "open" but are **D's to
> close, not E's**. E is independent of them (the E DAG is gate-free of
> glass-ui 3.3.0).

### D-PENDING-1 — D.W5 (dock-rename + mask removal + square/mobile occlusion)

- **Status:** authored, D-PENDING-ON-E1 — gated on glass-ui PUBLISHING 3.3.0
  (the dock primitives + the touch-gate B′ fix). D's heartbeat (`b5gt704vz`)
  auto-resumes it when 3.3.0 lands on npm.
- **Owner:** D (keyframes demo). **NOT E.** E's waves do not touch the dock.

### D-PENDING-2 — D.W6 (close · recap · deferred terminal · release)

- **Status:** authored, D-PENDING. `docs/tranches/D/FINAL.md` is NOT yet written
  (verified at E-open) — D.W6 closes AFTER D.W5. D names the version owner for
  the stacked B/C/D changesets there.
- **Owner:** D. **NOT E.** E has its own close (E.W6) for E's changeset.

---

## USER-DOMAIN — the stacked publish leg

### PUB-1 — the stacked changesets (B `3.1.0` + C `major` + D `major` + E)

- **Status:** USER-DOMAIN by design — confirm-first, identical to A/B/C/D. At
  E-open: `package.json` version `3.0.0`; `.changeset/` holds
  `tranche-b-3-1-0.md` + `tranche-c.md` + `tranche-d.md` (verified). E adds its
  own changeset (E.W6 — minor/patch: demo + perf, non-breaking lib
  housekeeping).
- **Owner:** the user (the publish owner finalizes the SemVer tier + drives the
  publish in dependency order). The library legs are gate-free (`proof:boundary`);
  only the demo/dock legs gate (D.W5 on glass-ui 3.3.0).

---

## Ledger summary (terminal status, every item A→E)

| Item | Origin | Terminal status | Owner / E duty |
|---|---|---|---|
| `proof:boundary` (value.js seam) | A (inv α), hardened C | **CLOSED** standing gate | E keeps green |
| inv γ (demo paints) | B.W4 | **CLOSED** standing | E.W4 keeps painting |
| inv δ (occlusion) | B→C HARD | **CLOSED** standing (1 allowance → D.W5) | E no-regress |
| LoAF / >50ms 2nd consumer | A→B-drift→C-fix | **CLOSED** (corrected) | E.W4 aligned (headroom) |
| inv ζ (rAF dogfood) | C.W3 | **CLOSED** standing | E.W2 = the listener analogue (net-new) |
| inv ε (honest close) | C | **CLOSED** discipline | E gates are instruments |
| C demo-polish set | C | **CLOSED** | E.W3 no-regress |
| φ-ladder (display C, leaf-tail D) | CHRONIC A→B→C→D | **CLOSED** — chronic ENDED in D | E.W3 no raw rung |
| engine W0-slips (snap/`\|any`/re-exports) | C.W0-booked | **KFD-TERMINATED** D.W3/W4 (landed) | none |
| square/mobile occlusion | C-named | **KFD-TERMINATED** D.W5 (D-PENDING) | D's, not E's |
| dock-rename + `index.ts` delete | constellation | **KFD-TERMINATED** D.W5 (D-PENDING) | D's, not E's |
| `always-expanded` mask | C-residue | **KFD-TERMINATED** D.W5 (D-PENDING) | D's, not E's |
| ASK-3 `LabeledField` a11y | B ask | **OUT** (glass-ui) | E keeps allowance stable |
| ASK-2 / VAL-9 `--spring-*` codegen | A ask | **OUT** (glass-ui) | E keeps `springLinearStops()` stable |
| ASK-1 dock double-tap | B ask | **OUT-RESOLVED** (→ D.W5 mask) | none |
| AU.W8 rail / strict-templates / `<Role>Dock` base | constellation | **OUT** (glass-ui AU) | E takes no dependency |
| ScrollTimeline-native | A | **ARCH** | recorded; do not re-litigate |
| Worker/OffscreenCanvas/Atomics | A | **ARCH** | recorded; do not re-litigate |
| dev.sh/deploy.sh | A→C-KILL | **ARCH** | recorded; do not re-litigate |
| D.W5 (dock+occlusion close) | D | **D-PENDING-ON-E1** | D's close, NOT E |
| D.W6 (D FINAL + version owner) | D | **D-PENDING-ON-E1** | D's close, NOT E |
| stacked publish leg | A→E | **USER-DOMAIN** | confirm-first |

**Zero KFE.** No row folds chronic debt into an E wave. Every keyframes-owned
deferral is CLOSED or terminated in a D wave; the only "open" items are OUT
(glass-ui-owned, E keeps stable), ARCH (recorded KILL), D-PENDING (D's close,
not E's), or USER-DOMAIN (publish, by design).

**P-invariant-28 holds for E: E folds no chronic debt because none remains.**
E's content (encapsulation r2 · the vueuse-listener gestalt · styling r2 · perf
+ modern-web · engine housekeeping) is NET-NEW — surfaced by the post-D 6-lane
assay, NOT inherited deferral. The E waves are tabled in `prompt-recap.md`
§E-SCOPE; they are findings, not folds.
