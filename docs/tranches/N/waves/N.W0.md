# N.W0 — Design synthesis + research fold + prototype + path forward

**Band: DEV · kf-internal · dev-only; implementation opens on explicit authorization.**
This wave is the ONLY dev-phase wave — it authors design artifacts, the runnable prototype,
and the full wave-spec set. No engine/demo source is written here. inv-16 holds: the demo
writes only this repo, consumes published glass-ui. The N.W1–N.WZ implementation waves are
GATED on the user's explicit authorization after this wave's gate passes.

---

## Context — what this wave synthesizes

Tranche N is the **theatrical downlight Stage scene-switcher**: a CSS spotlight cone descends
to a glowing floor pool on a ~15deg tilted plane; a 7-item carousel ring carries living idle
previews of every scene; two glassy intent-arrows sit below; the overlay is invoked from the
dock scene Select and commits through the existing `runSceneSwitch` / View-Transitions path.
The reference is the DK64 barrel selector (dark void, trapezoidal downlight cone narrower at
top, hot white floor-pool ellipse, center character fully lit, neighbours dim, glassy chevron
arrows at bottom-centre). Translated to the demo's idiom: **redolent, not replicated** — sleek,
subtle, liquid-glass theatre that reads in both light and dark.

The **three research briefs** produced the design evidence base:

- `audit/research-visual-motion.md` — DK64 decomposition, carousel geometry + falloff
  parameters, arrow beat choreography, hover-brighten quantification, idle-loop per-scene
  map, compositor budget.
- `audit/research-technical-feasibility.md` — engine dogfood primitives (SpringProgress
  vector mode, stagger, NumericAnimation, decay — all LIGHT), NO KeepAlive constraint,
  bespoke idle-loop strategy, content-visibility gating.
- `audit/research-glass-vt-modernweb.md` — glass-ui material ladder (`.glass-overlay` /
  `.glass-floating` / `.glass-refract`), `@property --stage-light`, specular catch-light
  wiring, `startViewTransition` VT moments, 15deg tilt CSS, downlight concrete recipe,
  PRM degrades, light/dark scrim treatment.

The **seven locked decisions** distilled from the research are binding on every downstream
wave (N.W1–N.WZ). They are non-negotiable:

1. **LIGHT-barrel discipline** — entire picker imports only light exports (SpringProgress,
   NumericAnimation, SmoothProgress, stagger, decay). NEVER `loadAnimationEngine` /
   `fromMotionPath` / `value.js`. `proof:boundary` stays green with the picker present.
2. **Overlay, never a wrapper** — stage mounts as Teleport-to-body Popover-API top-layer
   overlay. The keyed `<Suspense>` scene host stays BARE (no KeepAlive, no wrapping
   Transition — the B.W3 async-loader blank-viewport blocker).
3. **Motion split** — engine (SpringProgress on RAFPlayback) for continuous ring
   orbit/spin/falloff/arrow micro-motion; View Transitions ONLY for the two discrete
   morphs: (a) dropdown→stage liquid-glass entry/exit, (b) fade-into-scene commit.
   Commits route through the EXISTING `runSceneSwitch` / `startViewTransition`.
4. **Downlight — pure CSS** — `.stage-plane` with `perspective: 1200px` + `rotateX(15deg)`;
   cone = clip-path trapezoid + linear-gradient, `mix-blend-mode: screen`; floor pool =
   radial-gradient ellipse; ONE registered `@property --stage-light` (number, 0–1+).
5. **Living previews — content-visibility-gated bespoke idle loops** — NOT real scaled
   scenes; each dogfoods ONE light primitive; `content-visibility: auto` + the
   `contentvisibilityautostatechange` event pauses off-front loops; distant members render
   as a static poster; `@supports not` → IntersectionObserver fallback.
6. **Glass — the existing ladder, no new recipes** — stage shell = `.glass-overlay`;
   ring cards = `.glass-floating`/`.glass-card`; arrows + front plate = `.glass-floating`
   + `.glass-refract` + pointer-tracked specular `::before`; `.glass-refract` ONLY on
   arrows + front plate (`@supports`-gated); PLATE-on-PLATE banned.
7. **a11y + reduced-motion first-class** — keyboard carousel (←/→ spin, Home/End, Enter
   commits, Escape dismisses); focus routed on open/close/commit; `aria-live` announces
   centered scene; >=44px arrow hit-targets; PRM: snap the ring, freeze `--stage-light`
   at 1, `animation: none` + static specular; instant-under-PRM entry.

---

## Scope — the S-clauses

### S1 — Design synthesis on disk (this file + the design-synthesis.md, committed)

**Deliverable:** `docs/tranches/N/audit/design-synthesis.md` committed; this wave spec
`docs/tranches/N/waves/N.W0.md` committed. The synthesis names all seven locked decisions,
the motion choreography, the component architecture, the wave skeleton, and the top risks.

**Falsifiable:** `ls docs/tranches/N/audit/design-synthesis.md docs/tranches/N/waves/N.W0.md`
exits 0; `grep -c "locked" docs/tranches/N/audit/design-synthesis.md` ≥ 7 (the seven
decisions are named).

### S2 — Three research briefs on disk (the evidence base, committed)

**Deliverable:** all three briefs committed under `docs/tranches/N/audit/`:
`research-visual-motion.md`, `research-technical-feasibility.md`,
`research-glass-vt-modernweb.md`. Each is ≥100 lines (substantive, not stubs).

**Falsifiable:** `ls docs/tranches/N/audit/research-visual-motion.md
docs/tranches/N/audit/research-technical-feasibility.md
docs/tranches/N/audit/research-glass-vt-modernweb.md` exits 0; `wc -l` over each ≥ 100.

### S3 — Prototype on disk (runnable standalone, committed)

**Deliverable:** a standalone runnable prototype under `docs/tranches/N/prototype/`
demonstrating: (a) the downlight CSS cone+pool on a 15deg tilted plane, (b) a 7-slot ring
orbiting on one SpringProgress over a ring-angle scalar (trig-derived per-item transforms),
(c) click-to-spin with interruptible spring re-seat, (d) stagger reveal, (e) the two
placeholder glassy arrows, (f) content-visibility gating stubs, (g) full keyboard + PRM
accessibility. The prototype uses placeholder preview content (no real scenes). It is a
self-contained Vue/Vite SFC or plain HTML+JS; it does NOT import engine HEAVY exports.

**Falsifiable:** `ls docs/tranches/N/prototype/` shows at least one file; an import-edge
grep — `grep -rEn "import[^;]*(loadAnimationEngine|fromMotionPath)|from ['\"][^'\"]*value\.js"
docs/tranches/N/prototype/` — returns 0 matches (no HEAVY *import statement* in the
prototype; a bare-substring grep is NOT used because the prototype's own comments name the
forbidden symbols to document the discipline).

### S4 — Wave specs N.W1–N.WZ on disk (the full implementation plan, committed)

**Deliverable:** the full wave set `docs/tranches/N/waves/N.W0.md` through `N.WZ.md`
committed (N.W0 is this file; N.W1–N.WZ are the implementation waves). Each wave carries
real falsifiable S-clauses + a born-RED gate naming the `proof:*` gate it adds.

**Falsifiable:** `ls docs/tranches/N/waves/N.W{0,1,2,3,4,5,6,7,Z}.md` exits 0 (9 files).

### S5 — demo/src unwritten (inv-16 confirmed at W0 close)

**Deliverable:** the `demo/@/components/custom/scene-stage/` directory does NOT exist at
N.W0 close; no Stage-component source has been authored under `demo/` or `src/`. inv-16
holds: N.W0 is a dev-phase wave; implementation opens only on explicit authorization.

**Falsifiable:** `ls demo/@/components/custom/scene-stage/` exits non-zero at N.W0 close.

---

## Born-RED gate — `proof:n-w0-artifacts`

**Gate name:** `proof:n-w0-artifacts` (NEW — does not exist today; wired to
`npm run proof:n-w0-artifacts`, added to `proof:hygiene` roster in `package.json`).

**What it asserts (three clauses, each independently falsifiable):**

**(a) Design artifacts on disk.**
```
assert ls docs/tranches/N/audit/design-synthesis.md → exits 0
assert wc -l docs/tranches/N/audit/design-synthesis.md ≥ 100
assert ls docs/tranches/N/audit/research-visual-motion.md → exits 0
assert ls docs/tranches/N/audit/research-technical-feasibility.md → exits 0
assert ls docs/tranches/N/audit/research-glass-vt-modernweb.md → exits 0
assert ls docs/tranches/N/waves/N.W0.md → exits 0
assert ls docs/tranches/N/waves/N.W1.md → exits 0
assert ls docs/tranches/N/waves/N.W2.md → exits 0
assert ls docs/tranches/N/waves/N.W3.md → exits 0
```
BITE: reds if any artifact is absent — a future wave cannot open without the design basis.

**(b) Prototype present and HEAVY-import-free.**
```
assert ls docs/tranches/N/prototype/ → exits 0 (directory exists, at least one file)
# match ACTUAL import/specifier statements, NOT bare substrings: the prototype's own
# prose/comments name the forbidden symbols (e.g. "NEVER imports loadAnimationEngine /
# fromMotionPath / value.js") to DOCUMENT the discipline. A bare-substring grep reds on
# that prose — the L.W11 proxy-gate antipattern. The gate must bite an IMPORT EDGE only:
grep -rEn "import[^;]*(loadAnimationEngine|fromMotionPath)|from ['\"][^'\"]*value\.js" \
  docs/tranches/N/prototype/ → 0 matches
```
BITE: reds if the prototype pulls HEAVY imports — the boundary discipline is not just a
runtime property; it is demonstrable in the prototype's own source. The gate matches the
import-statement shape, not the symbol name in a comment (a bare substring grep would RED
on the prototype's own self-documenting prose — the proxy-gate trap).

**(c) demo/src Stage component NOT yet authored (inv-16).**
```
assert ls demo/@/components/custom/scene-stage/ → exits NON-ZERO
```
BITE: reds if Stage component source is authored before explicit authorization — the
dev→impl boundary is enforced at the gate level, not just by convention.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree (`tranche-j-dev`, `4f1fc4c`): `docs/tranches/N/waves/` is an empty directory
(confirmed: `ls docs/tranches/N/waves/` produces no output). Therefore:
- Clause (a): `ls docs/tranches/N/waves/N.W0.md` → non-zero exit → **RED** (this file does
  not exist yet at authoring time; writing it is the cure).
- Clause (b): `ls docs/tranches/N/prototype/` → non-zero exit → **RED** (prototype not yet
  authored).
- Clause (c): `ls demo/@/components/custom/scene-stage/` → non-zero exit → technically
  GREEN before impl; the gate here is an ASSERT-STAYS-NON-ZERO that reds if impl is
  accidentally started before authorization.

**Greens on the cure:** committing this file + the three briefs + the design-synthesis +
the prototype + N.W1–N.W3 wave specs closes all three clauses → gate exits 0.

**Implementation locus:** `scripts/proof-n-w0-artifacts.mjs` (NEW, ~30 LOC) — pure node
`fs.existsSync` + an import-edge `execSync('grep -rEn "import[^;]*(loadAnimationEngine|fromMotionPath)|from ...value\.js" ...')`
assertion (matches the import SHAPE, never a bare substring — see clause (b)). No browser,
no playwright. Add to `package.json` under `proof:n-w0-artifacts` and prepend to the
`proof:hygiene` chain.

---

## Deps

**No sibling publish gate.** N.W0 is purely kf-repo-internal (docs + prototype). It
consumes published glass-ui `~4.0.0` in the prototype (the `.glass-overlay` /
`.glass-floating` / `.glass-refract` classes + the specular token set). No new publish is
required before N.W0 closes.

**Prerequisite (already met):** master at the N tranche open carries `proof:all` GREEN
(K closed `4.3.0` deployed; M wave-developed as of 2026-06-17). N.W0 does not re-certify
M's gates; it inherits them as the floor.

**Consumed by N.W1+:** every implementation wave reads the design-synthesis + this wave
spec as its architecture authority. The seven locked decisions are binding; no N.WX may
override them without an explicit N.W0 amendment (recorded in the PROGRESS board).

---

## Bite — what each clause catches

| Clause | Regression it catches |
|---|---|
| (a) design artifacts | A future wave opens without the synthesis on disk — the seven locked decisions have no stable reference, and the wave specs have no authority document. |
| (b) prototype HEAVY-free | The prototype accidentally imports `loadAnimationEngine` or `fromMotionPath`, demonstrating that the LIGHT-barrel discipline is achievable without the proof. |
| (c) Stage unwritten | An implementation wave is opened before the user's explicit authorization — the dev→impl boundary is silently violated. |

The three clauses jointly enforce the N.W0 gate-first discipline: no implementation wave
opens until the design synthesis + research briefs + prototype + wave specs are on disk and
`proof:n-w0-artifacts` passes. This is the N equivalent of L.W0's `proof:audit-artifacts`
lead-gate function — it is what makes the born-RED discipline checkable at the tranche level.
