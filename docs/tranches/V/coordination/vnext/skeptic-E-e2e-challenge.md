# SKEPTIC E (Fable seat) — the e2e-fleet challenge

**Repo**: `/Users/mkbabb/Programming/value.js` @ HEAD `db77dbd8` (read-only). Fleet root: `e2e/smoke/`.

**Charter**: challenge the owner's "contrived mess → entirely abrogate" presumption in BOTH
directions. Verdict up front: the presumption is **largely VINDICATED for value.js-the-library**
and **partly REFUTED as blanket erasure** — a thin demo-smoke core has named catches a unit suite
structurally cannot make. Crucially, **the CI abrogation has ALREADY HAPPENED**: at HEAD the entire
fleet blocks nothing.

---

## §0 The fleet as it actually sits (the decisive facts)

| Fact | Value | Cite |
|---|---|---|
| Spec files | **71 `*.spec.ts`** + 12 fixtures = 83 files | `find e2e/smoke` |
| LOC | **13,405** | `wc -l e2e/**` |
| `test()` blocks | **191** | grep |
| Blocks importing the value.js LIBRARY (`@mkbabb/value.js` or `src/`) | **0 / 191** | grep = empty |
| Wired into any CI workflow at HEAD | **NONE** (ci.yml=71 L: `producer`+`api` jobs only; no playwright, no `--project`, no `test:e2e`) | `.github/workflows/ci.yml`, grep |
| Invoked only by | **`npm run test:e2e` → `playwright test`** (local, terminal) | `package.json:68` |
| `test.fail()` tripwires (CANNOT pass by design) | **7** across o26/o16/o5 | grep |
| `test.skip(isSoftwareGL(…))` (meaningless under headless SwiftShader) | **8 specs** incl. o1/o3/o12/o26 + all perf | grep |
| Assertion mechanism | **100% browser-driven demo**: 27 specs `getComputedStyle`, 7 canvas pixel-sample (`sampleRegion`/`meanRgb`), 7 screenshot | grep |

**The load-bearing finding**: `0 / 191` blocks touch the published library. Every spec boots the
**demo SPA** (color.babb.dev — palettes, admin CRUD, WebGL goo-blob, aurora, gradient/mix views)
in a real browser and asserts pixels / computed DOM / a11y tree. For a **headless value/CSS/color
library**, this fleet asserts **apparatus, never product**. The library's correctness lives in
`test/` (22 files, 3,823 LOC, vitest) against external goldens (culori, Sharma CIEDE2000,
Ottosson OKLab).

---

## §1 The CI-abrogation is already executed (archaeology of the wiring)

The fleet was CI-wired for four tranches, then **stripped in the V-tranche v4 reset** — before this
panel ever convened.

| SHA | Tranche | Effect on the e2e CI surface |
|---|---|---|
| `b339e376` | S.W0 | "the oracle floor" — smoke-safari, hard Lighthouse, shader-compile guard, WebGL appearance asserts wired into CI |
| `75cbd3ae` | T.W0 | ci-diet: sharded Playwright into parallel jobs; **abrogated 13 tautological specs** (`docs/tranches/T/audit/w0-ci-diet-ledger.md`) |
| `755a089b` | U.W-ORACLE | ci.yml = **720 lines**; `oracle-slate-teeth.mjs` gate (CHECK A: "every playwright project must be invoked by a workflow") wired HARD at `ci.yml:167`; page-load hard-gate at :338, full smoke :354, webkit :423 |
| `164343c1` | **V (v4 producer)** | **stripped 730 lines from ci.yml** — the ENTIRE e2e slate removed; ci.yml → 71 lines |
| `6d6d3521` | **V (v-w42)** | **DELETED** `scripts/ci/oracle-slate-teeth.mjs` (187 L, commit calls it "**fully dead**") + `test/oracle-feasibility-leg.test.ts` (197 L); commit verbatim: "**`test:e2e` is now the terminal scripts key**" |

So the meta-gate that *enforced* the fleet's CI-wiring (`oracle-slate-teeth.mjs`) was itself deleted
as dead once the v4 reset unwired the fleet. **At HEAD the fleet is de-facto abrogated from every
gate.** The owner's presumption is not a proposal against a live apparatus — it is a request to
finish a demolition already 90% done.

**Owner precedent (T.W0, verbatim, `w0-ci-diet-ledger.md:5`)**:
> "Our CI should be quick, elegant, clean. A profusion of useless CI tests and items should be
> abrogated, **in particular, tautological e2e validation tests.**"

**Runtime cost when it WAS recorded** (`w0-ci-diet-ledger.md §1`, CI run `28842102862`): the e2e
fleet was the **dominant critical-path cost** of a 32.4-min pipeline — `smoke-safari` **733 s
(12.2 m)** single biggest step + `full smoke` **251 s (4.2 m)** + frame budgets. ~16 min of wall
clock for a headless library's browser demo. That cost is now 0 (unwired), which is precisely why
the harness has rotted quietly.

---

## §2 Catalog — the eight families

| Family | Files / LOC | What it asserts (mechanism) | Subject |
|---|---|---|---|
| **oracles/** (o1–o27, t31, readout, gradient-pixels) | 31 / ~6.9k | color-truth (canvas OKLCh bands), contrast census (WCAG over demo DOM), computed-cascade (transition tokens), type-locks, dock-register, blob-seat backing-store, easing-composition | DEMO appearance / glass-ui tokens |
| **admin/** (views+flows+fixtures) | 16 / ~1.4k | admin CRUD walks: color approve/reject, tag create/delete, user-status, palette-feature; authed via `addInitScript` | DEMO ↔ **api backend** |
| **flows/** | 8 / ~0.4k | user journeys: login/register, palette save/edit/delete/fork/flag, vote, color-propose | DEMO ↔ **api backend** |
| **perf/** (o5, o24, 3 frame-budgets) | 6 / ~0.7k | rAF inter-frame deltas, LCP, boot-pacing vs built bundle; all `isSoftwareGL`-branched | DEMO runtime timing |
| **a11y-*** + admin a11y | 6 / ~0.9k | modality support, slider operation, focus, contrast battery | DEMO a11y (axe-class) |
| **safari/** | 3 / ~0.6k | WebKit-engine sustained-30s, dual-webgl, mix-flow | DEMO on WebKit |
| **mobile/** | 3 / ~0.4k | Pixel-7 boot, blob-presence, walk | DEMO on mobile viewport |
| **views/ + top-level smoke** (page-load, walk, webgl-*, reactivity, url-precedence, color-space) | ~14 / ~2.1k | shell-mounts, view walks, WebGL presence, wall-clock reactivity, URL color precedence | DEMO |

Not one family targets a library export.

---

## §3 Catch archaeology — what ever caught a real defect

Honesty demands crediting the real catches. All three found real bugs a unit test **could not**
reach — because all three are **live-browser integration/interaction defects in the DEMO**, not
library math:

| Oracle / spec | Named catch | Fix commit | Class |
|---|---|---|---|
| `color-space-switching.spec.ts` | color-space selector was a **dead control** (a stray `document`-pointerdown handler swallowed the change) | **`b4d179fa`** "remove the dead-control document-pointerdown handler" | DEMO interaction-liveness — invisible to any headless unit test |
| `o12-blob-seat.spec.ts` | **R2 backing-store race** — emerge-pose blur presized the goo-blob canvas 0.35× | **`af18e072`** "R2 emerge-pose backing-store race … demo-root cure" | DEMO appearance/timing; leg minted born-GREEN post-cure (U-close §G-ORACLE-2 companion) |
| `o16-computed-cascade.spec.ts` | glass-ui dist ships Tailwind `:root{--default-transition-duration:150ms}` clobbering ~46 interactive demo sites off the house liquid curve | **still `test.fail()` (producer-gated on glass-ui)** — real, uncured | DEMO↔glass-ui integration; the ONE class token-diff can't see |
| `o1-color-truth-boot.spec.ts` | (self-documented) replaced a **draw-call-count proxy** that "cannot tell a vivid derived field from an achromatic slab" | harness self-repair, not a product catch | proxy-improvement |

Everything else: **no recorded catch**. The U-close artefact (`docs/tranches/U/audit/
w-oracle-close-artefacts.md`) — the fleet's most recent full accounting — records the color-hardening
gates (G-ORACLE-6/7) as **born-GREEN because "the core is PROVEN SOUND"** (a gate that passes on
write by admission), and O-26/O-3 as **"can NEVER flip GREEN headless"** (SwiftShader forces the CSS
placeholder forever). Those are, by their own docstrings, **gates that cannot fail on the runner**.

**Verdict on the archaeology**: 2 cured real DEMO defects + 1 uncured real DEMO integration defect.
Non-zero — the blanket-vacuity charge is FALSE. But every catch is a demo-apparatus defect, and the
correct owner already flagged the **demo restructure as separate tranche work** (Addendum §2). These
catches belong to the demo's own gate surface, not the library's.

---

## §4 Duplication census

| Fleet assertion | Already covered by | Verdict |
|---|---|---|
| color-truth / derivation OKLCh bands (o1, o1b, o19, o18 identity leg) | `test/v4-color-behavior.test.ts`, `mix-v4.test.ts`, `test/units/color/**` numeric goldens (culori/Ottosson/Sharma) — deterministic, no browser | **DUPLICATE** (pixel-sampling a value the math already proves) |
| admin/ + flows/ (14 specs, CRUD journeys) | **`api/` now has its own vitest suite gated HARD in CI** (`ci.yml` `api` job: mongodb-memory-server integration) | **DUPLICATE** of the api suite; the e2e leg adds only browser-transport, untested at HEAD |
| a11y-* (6 specs) | a single axe-core pass over the demo would subsume most | **CONSOLIDATE** (a battery, not 6 bespoke specs) |
| perf/ frame budgets, reactivity (timing) | `bench/` measurement lane + they're `isSoftwareGL`-skipped anyway | **DUPLICATE / vacuous headless** |
| easing-composition (o17), status-lamp, preview-chips, view-accents | `test/status-lamp.test.ts`, `test/preview-chips.test.ts`, `test/view-accents.test.ts`, `test/easing.test.ts` — **unit twins already exist** | **DUPLICATE** (someone already folded these into unit tests) |
| contrast census (o18, 1214 L) | glass-ui/design-token territory ("where pixels matter" = glass, per owner) | **WRONG-REPO** — belongs to glass-ui or the demo tranche, not value.js |

The o18 monster (1,214 LOC — 9% of the fleet) is a WCAG contrast census over demo selectors: it is a
**design-system gate misfiled in a value library**.

---

## §5 Contrivance read (process-theatre markers)

1. **Snapshot-of-a-snapshot / can't-fail gates**: G-ORACLE-6/7 authored born-GREEN "because the core
   is PROVEN SOUND"; O-26/O-3 "can NEVER flip GREEN headless." Gates whose passing is guaranteed at
   authoring time assert the harness, not the subject.
2. **Orphaned tripwires**: 7 `test.fail()` blocks ship at HEAD waiting on producers (glass-ui/perf)
   that may never land — permanent red-that-reads-green.
3. **Harness-serving complexity**: the SwiftShader channel saga (playwright.config.ts, ~60 lines of
   comment on renderer-death + teardown-hang), `workers:1` serialization, tree-local port seams,
   built-bundle perf server — **elaborate scaffolding whose sole purpose is to make the harness
   itself stable headless**, on assertions that then get `isSoftwareGL`-skipped anyway. The H2 prior
   (apparatus dwarfs library) holds: **13.4k e2e LOC around a 4.6k-LOC library, 2.9× the thing it
   guards, guarding zero of it.**
4. **The deleted teeth**: `oracle-slate-teeth.mjs` existed *only* to force the fleet into CI; when the
   v4 reset unwired the fleet, the gate became "fully dead" and was deleted. The apparatus's own
   integrity check was collateral of the apparatus being switched off.
5. **Owner-named prior**: T.W0 already abrogated 13 specs as "tautological e2e." This is a repeat
   offender class, not a first offense.

---

## §6 Verdict candidates (per family, for adjudication)

| Family | Verdict candidate | Rationale / tombstone |
|---|---|---|
| **oracles/** (bulk: o7/o9/o10/o11/o14/o15/o17/o18/o19/o20/o21/o22/o26/o27/readout/t31) | **ABROGATE** | demo-appearance/token census; 0 library subject; o18 is a glass-ui design gate misfiled; no unique catch |
| **oracles o1/o1b/o12/o16** (the named-catch set) | **FOLD-INTO-DEMO-SMOKE** (not the library) | real DEMO catches (b4d179fa, af18e072, uncured clobber) — survive as a small demo-tranche gate, NOT a value.js gate |
| **admin/ + flows/** | **ABROGATE** | duplicated by the CI-gated `api/` vitest suite; browser-transport leg is the only delta and it's unwired |
| **perf/** | **ABROGATE** | `isSoftwareGL`-skipped (vacuous headless); real perf lives in `bench/` |
| **a11y-*** | **CONSOLIDATE → 1 axe-core smoke** | 6 bespoke specs → one battery, in the demo tranche |
| **safari/ + mobile/** | **ABROGATE** | engine/viewport matrix for a demo; no library subject; safari was the 12-min CI hog |
| **views/ + reactivity/url/color-space** | **ABROGATE**, salvage `color-space-switching` catch into demo-smoke | walks duplicate page-load; color-space earned one catch (b4d179fa) |
| **`page-load.spec.ts`** | **KEEP as the single demo-smoke** (relocate to demo tranche) | the one former HARD gate: shell mounts + zero console errors — cheap, real, non-duplicative demo boot check |

---

## §7 FLEET-LEVEL verdict candidate

**Does ANY e2e harness deserve to exist for value.js-the-library? NO.** A headless
value/CSS/color library's truth is numeric and belongs in `test/` (vitest, external goldens) — where
it already is. Pixels matter for kf/glass/the-demo, not for value.js. The 13.4k-LOC fleet asserts
**zero** library behavior (0/191), is **already CI-abrogated** (blocks nothing at HEAD), and the
owner already ruled its class out once (T.W0, 13 specs).

**Minimal shape if anything survives** (and it survives to the **DEMO restructure tranche**, per
Addendum §2, NOT to value.js's gate surface): **~1 demo-smoke spec** (`page-load` — shell mounts,
console-clean) **+ ≤3 earned demo-appearance oracles** carrying named catches (o16 cascade-clobber
class, color-space control-liveness, o12 backing-store) **+ 1 axe-core a11y battery**. Call it
**~500 LOC replacing 13,405** — a 96% cut, with every survivor tied to a named catch or a live shell
guard. The abrogation stands on demonstrated vacuity, duplication, and an already-executed unwiring;
the ~4% that survives, survives on b4d179fa / af18e072 / the uncured o16 clobber — not inertia.

---

## 10-line summary

1. **FLEET-LEVEL VERDICT: ABROGATE for value.js.** 0 of 191 test blocks import the library; every
   spec drives the DEMO SPA in a browser. A headless value library's truth is numeric and already
   lives in `test/` (3,823 LOC vitest, external goldens).
2. **The CI abrogation is ALREADY DONE.** At HEAD (`db77dbd8`) the fleet is wired into NO workflow —
   the v4 reset `164343c1` stripped 730 lines from ci.yml; `6d6d3521` deleted the fleet's own
   CI-wiring gate as "fully dead," verbatim: "test:e2e is now the terminal scripts key." It blocks
   nothing.
3. **Owner precedent exists**: T.W0 already abrogated 13 "tautological e2e" specs by owner ruling
   (`w0-ci-diet-ledger.md`). This is a repeat class, not a first cut.
4. **Recorded runtime cost when wired**: ~16 min of a 32.4-min pipeline (`smoke-safari` alone 733 s),
   for a headless library's demo — which is why it rotted once unwired.
5. **STRONGEST KEEP CASE (honest, refutes blanket-vacuity)**: 3 real DEMO defects caught that unit
   tests structurally cannot — the color-space **dead control** (`b4d179fa`), the o12 **backing-store
   race** (`af18e072`), and the uncured o16 **glass-ui transition-clobber** (`test.fail()`). Real, but
   all DEMO integration/interaction/appearance — they belong to the demo tranche's gate, not value.js.
6. **STRONGEST CONTRIVANCE EVIDENCE**: gates authored to pass — G-ORACLE-6/7 born-GREEN "because the
   core is PROVEN SOUND"; O-26/O-3 "can NEVER flip GREEN headless." Plus 7 orphaned `test.fail()`
   tripwires and 8 `isSoftwareGL` skips = a large slice that cannot fail on the runner.
7. **DUPLICATION is pervasive**: admin/+flows/ duplicate the now-CI-gated `api/` vitest suite;
   o1/o18/o19 duplicate the color goldens; o17/status-lamp/preview-chips/view-accents have unit twins
   already in `test/`.
8. **MISFILED design gate**: o18-contrast-census (1,214 LOC, 9% of the fleet) is a WCAG/glass-ui token
   census sitting in a value library — wrong repo.
9. **APPARATUS ≫ SUBJECT** (H2 prior confirmed): 13,405 e2e LOC guarding a 4,654-LOC library it never
   imports — 2.9× the thing, guarding none of it; plus ~60 lines of SwiftShader scaffolding whose only
   job is keeping the harness itself alive headless.
10. **MINIMAL SURVIVOR**: ~500 LOC in the DEMO tranche — `page-load` smoke + ≤3 named-catch oracles
    (o16/color-space/o12) + 1 axe battery — a 96% cut, each survivor tied to a named catch or a live
    shell guard, none on the value.js gate surface.
