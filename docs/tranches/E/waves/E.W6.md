# E.W6 — Close (recap · ledger confirmed · release)

**Phase:** IMPL · **Class:** LAST · **Scope:** `docs/tranches/E/FINAL.md` +
`docs/tranches/E/audit/` (DELTA, recap) + `.changeset/` (the E changeset +
version owner) · **Gated on:** every prior E wave green (W1/W2/W3/W4/W5).

E's last wave closes the tranche the way D closed: the prompt-recap confirmed, the
deferred ledger re-confirmed CLEAN (zero KFE — E folded no chronic debt because
none remained), the AFTER capture + DELTA produced **via the checked-in harness**
(`scripts/capture.mjs` — not re-authored, not `/tmp`), and the E changeset given a
**named version owner**. The publish leg stays user-domain — E names the owner;
the user drives the publish in dependency order.

This wave writes **docs + a changeset only**. No engine, demo, or library source
changes here — W1–W5 did the work; W6 records it and proves no regression.

---

## FINAL.md — the recap confirmed, the ledger re-confirmed CLEAN

`docs/tranches/E/FINAL.md` is authored at W6, in D.FINAL's voice: terse,
gate-table-backed, **every recorded-MET gate resolving to a checked-in,
re-runnable instrument shown to PASS — not a narration** (inv ε). It carries:

### The deferred ledger — re-confirmed CLEAN (zero KFE, P-invariant-28 vacuous)

E's headline is honest and falsifiable: **E folded no chronic debt because none
remained.** D was the terminal home for every keyframes-owned deferral; the
consolidated ledger (`audit/deferred-ledger.md`, authored at E.W0) is CLEAN. W6
RE-CONFIRMS it — there is no new deferral to terminate, only the standing
obligations to verify still-held:

| Item | Tag | Terminal status (W6 re-confirms) | Proof |
|---|---|---|---|
| Every keyframes-owned chronic deferral | KFD-TERMINATED | D was the terminal home (D.W1–W4 landed) | the consolidated ledger — **ZERO KFE** (`grep -cE '\|[^\|]*\bKFE\b' deferred-ledger.md` = 0 — KFE never appears as a row tag; the prose "ZERO KFE" mentions are not the gate) |
| `proof:boundary` (value.js seam) | CLOSED standing | green throughout E | `npm run proof:boundary` PASS (E.W5 did not introduce a static value.js edge) |
| inv γ (demo paints) | CLOSED standing | green after E.W4's preload/font/content-vis | `demo-smoke.mjs` PASS |
| inv δ (no occlusion) | CLOSED standing | no E demo wave reintroduced a clip | `occlusion-gate.mjs` PASS (both axes) |
| inv ζ (rAF dogfood) | CLOSED standing | + E.W2 completed the *listener* analogue | `proof:dogfood` PASS + `proof:brittleness` (extended) PASS |
| ASK-3 `LabeledField` a11y | OUT | glass-ui owns; E kept the named allowance | `lighthouse-gate.mjs` `bucket-glassui` allowance intact, no demo band-aid |
| ASK-2 `--spring-*` codegen | OUT | glass-ui owns; E kept the enabler stable | `springLinearStops()` export byte-stable (E.W5 did not touch it) |
| AU.W8 rail / `<Role>Dock` base | OUT | glass-ui AU's arm | E took no dependency (E waves gate-free of glass-ui) |
| ScrollTimeline-native · Worker · dev.sh | ARCH | permanent KILL | recorded; do not re-litigate |
| D.W5 (dock + occlusion) · D.W6 (D FINAL) | D-PENDING-ON-E1 | D's close, gated on glass-ui 3.3.0 | D's heartbeat (`b5gt704vz`) auto-resumes; **NOT E's scope** |

**P-invariant-28 satisfied — vacuously for the fold class:** E terminated no
chronic debt because D had already terminated all of it. Every OUT has a named
owner + the keyframes-side enabler kept stable; every ARCH is recorded; every
CLOSED is regression-checked by a gate that bites; D-PENDING is explicitly D's
close, not E's. **No item is a perpetual punt, and no item folded INTO E.**

### The E-SCOPE findings — net-NEW, each landed + gated

E's actual content is net-NEW refinement, NOT carried debt. FINAL.md records each
E-SCOPE finding with its landing wave + its proving gate:

| E-SCOPE finding | Wave | Terminal disposition | Proof |
|---|---|---|---|
| App.vue (452L) + useOrbitalPointer (376L) — encapsulation r2 | E.W1 | extracted to composables / appliers moved | `proof:decomposition` (extended sweep, ceilings hold) |
| the ~10 manual `addEventListener`/`ResizeObserver` + 2 querySelector | E.W2 | → `useEventListener`/`useResizeObserver`/owned refs | `proof:brittleness` (extended, clause 4 = 0 outside allowlist) |
| `.gold-shimmer` rent + arbitrary-value tokens + `dvh` reconcile + `.progress-bar` dup | E.W3 | localized / tokenized / reconciled / dedup'd | `proof:idioms` (extended, gold-shimmer demo-local) |
| lighthouse every scene + modern-web alignment | E.W4 | per-scene target met + the checklist dispositioned | `proof:lighthouse-mobile` + `proof:modern-web` + `proof:loop-yield`/`demo-yield`/`content-vis` |
| the 2 engine BOOK items (managed-pause doc, `tryParseCache` eviction) | E.W5 | documented / measured (landed-with-win OR recorded-withheld) | `proof:engine-book` (+ `npm test` green) |

### The gate suite — each VERIFIED by a checked-in instrument

FINAL.md's gate table records every per-wave `proof:*` + the standing D/C/B gates,
each a PASS of a re-runnable instrument:

| Gate | Instrument | Wave |
|---|---|---|
| inv α — boundary | `proof:boundary` (the light/heavy edge intact) | standing |
| inv γ — demo paints | `demo-smoke.mjs` | standing + E.W4 |
| inv δ — occlusion | `occlusion-gate.mjs` (both axes) | standing |
| inv ζ — dogfood | `proof:dogfood` (no hand-rolled rAF the engine is) | standing |
| zero-alloc group composite | `proof:zero-alloc` (0 bytes/frame, untouched by E) | standing (D.W4) |
| engine no-legacy + transposition | `proof:engine` (untouched by E) | standing (D.W4) |
| encapsulation r2 | `proof:decomposition` (extended — App.vue/orbital under ceiling) | E.W1 |
| the listener/observer gestalt | `proof:brittleness` (extended — 0 manual listeners outside allowlist) | E.W2 |
| design-idiom owned + tokenized | `proof:idioms` (extended — `.gold-shimmer` demo-local, literals tokenized) | E.W3 |
| per-scene lighthouse target | `proof:lighthouse-mobile` + `proof:modern-web` checklist | E.W4 |
| engine housekeeping | `proof:engine-book` (managed-pause doc + measure-gated eviction) | E.W5 |

---

## The prompt-recap confirmed

`docs/tranches/E/audit/prompt-recap.md` (authored at E.W0) is **confirmed** at W6:
every request across A → B → C → D → the constellation drive → the E ask resolves
**ADDRESSED** (landed + verified in a prior tranche), **PENDING** (a D-owned close
— D.W5/W6 on glass-ui 3.3.0, NOT E's scope), **E-SCOPE** (a net-NEW E finding this
close discharged), or **HONORED** (a recurring precept). No drops. The two
historical drifts (B's falsely-closed LoAF; B's advisory inv δ) were *corrected* in
C — E verifies they stay corrected (the gates bite; E.W4's Long-Task/INP relief
gave the >50ms LoAF gate further headroom, never regressed it). The recurring
precepts (no-legacy, no-workaround, idiomatic+gestalt, isomorphic, KISS, inv-16)
are each re-confirmed HONORED in the landed E waves. The recap's only by-design
loose end — the stacked publish leg — is closed below by naming the E version owner.

---

## The AFTER capture + DELTA via the checked-in harness

The D discipline: the harness (`scripts/capture.mjs`, checked in at C.W0,
re-run at C.W5 + D.W6) is **re-run from the repo** at E-close — not re-authored,
not `/tmp`. W6 produces:

- **The AFTER capture** — `node scripts/capture.mjs after` against the W1–W5
  integration HEAD, writing `audit/screenshots/after/` (the screenshot matrix,
  zero console errors). The re-runs-identically-from-the-repo clause is discharged
  because the harness is in the repo (C closed the `/tmp` fiction; D + E inherit
  it).
- **`audit/DELTA.md`** — E-open → E-close, in D.DELTA's shape: a per-page
  intended-change table paired with the gate evidence (the regression authority is
  the gate suite, not the eye). The headline DELTA rows: the encapsulation r2
  (E.W1, behavior-identical — appliers moved, math unchanged), the vueuse-listener
  gestalt (E.W2, happy-path byte-identical, leaks closed), the styling r2 (E.W3,
  isomorphic pixels EXCEPT the ONE named `--panel-max-h` `vh→dvh` reconcile —
  desktop isomorphic, mobile slightly-shorter cap under an expanded URL bar, a
  correctness improvement), the perf + modern-web alignment (E.W4 — the per-scene
  lighthouse delta, the off-screen-loop gate, the font-swap path; happy paths
  byte-identical), the engine housekeeping (E.W5 — a comment + at most a
  measure-gated micro-edit, the public barrel untouched).

**DELTA shows no unintended regression.** Every gate that bites
(`demo-smoke`/inv γ, `occlusion-gate`/inv δ both axes, `lighthouse-gate`/a11y-SEO,
`proof:dogfood`/inv ζ, `proof:boundary`/inv α, `proof:brittleness` extended,
`proof:idioms` extended, `proof:decomposition` extended, `proof:lighthouse-mobile`,
`npm test`) PASSES — so "no unintended regression" is **proven by the gates, not
asserted**. The ONE intended pixel delta (the `vh→dvh` reconcile) is NAMED in
`styling-findings §Isomorphism` and is the only non-isomorphic surface.

---

## The version owner NAMED — the E changeset

E's published surface is **demo-side + perf** — non-breaking. The post-D assay
found the engine EXEMPLARY; E.W5 is BOOK-only (a comment + at most a measure-gated
`tryParseCache` micro-edit that changes no public API and no parse correctness).
The library's public barrel is **byte-stable** across E (E writes only `demo/` plus
the BOOK-only engine touch). It ships as a **changeset** (`.changeset/tranche-e.md`,
**minor or patch** — demo + perf refinement, non-breaking lib housekeeping; the
tier the version owner finalizes) atop the stack:

- **B `3.1.0`** (cut, unpublished — folded forward through C/D)
- **C `major`** (cut, unpublished — the W4 engine residuals)
- **D `major`** (cut — the engine transposition + dock-rename surface)
- **E `minor`/`patch`** (this tranche — demo perf + frontend refinement, non-breaking)

W6 **names the E version owner** — the single person who runs `changeset version`
→ tag → `release.yml` and finalizes the SemVer tier for the combined B+C+D+E
release. Per the D.W6 precedent, the named owner is **Mike Babb**
(`mike@babb.dev`). This is the only by-design loose end (the plan: E names its own
version owner; D named the B/C/D owner at D.W6). **The publish leg stays
user-domain, confirm-first** — identical to A/B/C/D; W6 names the owner and the
order (B → C → D → E folded into one provenance-signed publish, the library legs
gate-free, only the demo/dock legs gate on glass-ui 3.3.0 for D.W5), the owner
drives it.

---

## Hard gate (falsifiable · re-runnable · MUST bite)

The close is done only when:

### 1. The full proof suite green — every per-wave `proof:*` passes

A single checked-in close-runner (`npm run proof:all`, or the CI demo+lib jobs)
runs the entire suite and exits non-zero on any failure: `proof:boundary` ·
`proof:dogfood` · `proof:zero-alloc` · `proof:engine` · `proof:decomposition`
(extended) · `proof:brittleness` (extended) · `proof:idioms` (extended) ·
`proof:lighthouse-mobile` + `proof:modern-web` · `proof:engine-book` ·
`occlusion-gate.mjs` (zero new allowances) · `demo-smoke.mjs` · `npm test`. All
green, or W6 is not done. Each is bite-proven in its wave (the inject/stub tests);
the close-runner is the aggregate.

### 2. Zero un-dispositioned deferrals (the ledger CLEAN — zero KFE)

A checked assertion that the deferred ledger has a terminal disposition for
**every** item AND that **no row folds chronic debt into an E wave** (zero KFE).
Falsifiable: a KFE row (a keyframes-owned chronic deferral folding into an E wave)
would FAIL the check — there is none, so E's content is provably net-NEW
(P-invariant-28 holds vacuously for the fold class). An item left as "BOOKED" /
"follow-on" / "TODO" without a wave + a gate also fails.

### 3. DELTA shows no unintended regression

`audit/DELTA.md` pairs every changed surface with a passing gate; the AFTER
capture re-runs from the repo with **zero console errors**. The regression
authority is the gate suite — if any non-intended surface moved, a biting gate
reds. The ONE intended pixel delta (the `--panel-max-h` `vh→dvh` reconcile) is
NAMED; every other surface is isomorphic. "No unintended regression" is the gates'
verdict, recorded, not asserted.

---

## Close ledger

| Duty | Discharged by | Proof |
|---|---|---|
| FINAL.md (ledger re-confirmed CLEAN) | this wave | zero un-dispositioned deferrals + zero KFE (gate 2) |
| prompt-recap confirmed | `audit/prompt-recap.md` | every ask ADDRESSED / PENDING(D's) / E-SCOPE / HONORED |
| AFTER capture + DELTA | the checked-in harness | `audit/screenshots/after/` + `audit/DELTA.md`, 0 console errors |
| E version owner named | `.changeset/tranche-e.md` | the B+C+D+E stack + Mike Babb + the publish order |
| full proof suite | `proof:all` | every `proof:*` green (gate 1) |

E closes keyframes' fifth tranche: the demo's encapsulation completed (the app
shell + the orbital seam), the vueuse listener/observer gestalt finished (the
inv-ζ analogue), the design language localized round 2 (the `.gold-shimmer` rent
closed), the demo aligned with modern-web-guidance + lighthouse-targeted, the
exemplary engine housekept. **E folded no chronic debt — D was its terminal home;
E's content was net-NEW, stated honestly.** The publish leg is the user's — named,
ordered, confirm-first.
