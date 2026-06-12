# Tranche K — PATH-FORWARD · the executive summary

**The one move, two halves:** extend the oracle discipline to the COLD axis (the product is TRUE
from the first gesture) and bound it honestly at the TASTE boundary (where gates cannot carry the
verdict, the protocol hands it to the user — named, packaged, BEFORE the close). The design
language is made total at its ROOTS, not by per-site patches. **The frontier defers WHOLESALE to
L.** This doc is the map; the binding charter is `K.md`, the per-wave specs are `waves/K.W0–K.WZ`,
the evidence is `audit/*.md` (33 docs). Every claim here is rooted in those; nothing new is
asserted. Phase: DEVELOPMENT on `tranche-k-dev` @ `4f1fc4c` — these docs are the deliverable;
implementation opens only on explicit user authorization (the D→J dev/impl boundary).

---

## 1 · What the J close certified — and the two axes it never named

J (the tenth tranche) extended the gate-ORACLE precept to every boundary the product crosses —
deploy, publish, docs, axes, design — and discharged each with an OBSERVED oracle: 4.2.0 published
via `release.yml`'s first-ever run (`27378331075`); the auto-deploy round-trip observed twice; the
axes battery born-RED witnessed (`docs/tranches/J/FINAL.md`). **The K audit finds the J close
HONEST at every boundary it certified** — the 10 plan-vs-delivery lanes spot-verify 10/10 TRUE; the
estate lib is real; the deploy/publish/docs boundaries stay discharged and are NOT re-litigated
(`K.md §DEV/IMPL — Honest already-done`). The K mandate is **not that J lied**; it is that J's
oracle family had **two unnamed blind axes**, and the design system's roots predate J.

- **The COLD axis (blind).** Every J gate enters scenes by hash-nav and choreographs
  `openControlsPanel → select → play`. NO gate drives the HERO CTA, a cold mount, or a default
  state (`live-session-gap-analysis.md §0`: `goto #/` ∧ clickPlay ∧ ¬seedControlsOpen → 0 gates).
  The cold entry is the FIRST boundary a human crosses; J never crossed it.
- **The TASTE boundary (blind).** The J.W7c verify rounds asked agents for a "designer-eye" verdict
  and got PASS; the user's same-day verdict on the same panes: "still sucks", "awful", "looks
  awful" (`live-spring-sequence-mp-verdict.md`, `wave-J.W7bc.md`). Gate-green and agent-taste do not
  bound design-good. The boundary needs a NAME and a protocol, not a stronger adjective in a prompt.

---

## 2 · The P0 chain — the cold front door does not animate (triple-rooted)

**Hours after the J close, the user drove the live product and found its PRIMARY FIRST-RUN GESTURE
broken:** the hero rainbow-play does not start the engine — the playhead advances while every
subject stands frozen. Rooted three independent ways (`live-cold-play-path.md`,
`live-session-gap-analysis.md`, `demo-scenes-k.md`):

1. The hero rainbow-play → `onPlayStateChange(true)` → `autoPlayNext=true` + `runSceneSwitch("cube")`
   → `NAVIGATE`. Home↔cube **share the Suspense key**, so no remount fires the `sceneRef`
   re-bind path; the shared-key `markSceneReady()` runs synchronously.
2. The machine `SCENE_READY` effect restores ONLY `if (snap.started || snap.playing)`; first cube
   entry's snapshot is `INITIAL_SNAPSHOT {playing:false, started:false}` → restore SKIPPED.
3. The `PLAY` effect calls `adapter?.resume()` → **`scenePlaybackAdapters.ts:76-79` —
   `if (group.started && group.paused) group.resume()`**. The group was never `play()`-ed →
   `started === false` → **`resume()` is a NO-OP. The engine never starts.** The FSM writes
   `playing:true started:true` over a hollow `animations:{}` group; the slider parks at 0; the
   rainbow never goes vivid. A SECOND click plays (the group is now bound) — the tell that the
   FIRST gesture was structurally lost. The defect is latent since H.W1; the J.W7c U4
   conditional-select suspect is DISPROVEN (`live-cold-play-path.md §VERDICT`, git-blame `256f6fe`).

**WORSE — the certifying oracle was VACUOUS against exactly this defect.** The
`proof:live-session` B1 leg greens on **101 distinct transforms produced by the `.idle-hover` CSS
bob at REST with the engine OFF** (`CubeTarget.vue:207-214`; `k-verify-gate-blindspot.mjs`: B1=101
PASS while the play button reads "Play animation"). A liveness oracle that **cannot tell an ENGINE
write from a decorative CSS animation** is the meta-chronic — the gate-blindspot witnessed a fourth
time (`deferred-ledger-k.md §0`, a ≥9-tranche rider). It is the mechanism by which every OTHER
chronic (CH-3 mobile, CH-8 amiga, CH-6 cold-play) falsely TERMINATED on paper while RED on the
product. **Under P-invariant-28 it is the FIRST thing K must terminate** — because terminating it
terminates the false-GREEN mechanism for the whole band.

---

## 3 · The three K-born invariants (binding — `K.md §invariant set`)

These carry into every wave alongside ALL J-born invariants (gate-ORACLE, boundary-ORACLE, P6,
net-deletion, two-tier taxonomy, inv ε/ζ/δ, P-invariant-28, born-RED, dev/impl boundary):

- **The COLD-axis invariant.** A certified surface is exercised from its COLD/DEFAULT entry — the
  hero CTA, a fresh mount, the default selection state — not only through choreographed setup
  paths. The cold entry gates FIRST.
- **The engine-write disambiguation rule.** A liveness oracle must distinguish ENGINE-DRIVEN writes
  from decorative CSS animation. The B1 vacuity class (greening on `.idle-hover` bob with the engine
  off) is FORBIDDEN: the oracle reads the engine's own write channel (inline-style mutation
  attributable to `interpFrames`/the group composite, or `anim.t`-correlated subject deltas), never
  bare `getComputedStyle` churn. **The cure is to DISAMBIGUATE, NOT to raise the distinct-count
  threshold** (`K.md §MANDATE`).
- **The TASTE boundary** (the J taste-tension resolved). Gates carry CORRECTNESS; they do not carry
  the design VERDICT. For every appearance wave the close motion produces a **review packet**
  (per-pane before/after screenshots, desktop+mobile, the named deltas); the wave's design band
  closes ONLY on the user's verdict on that packet — a named USER-DOMAIN step, scheduled BEFORE the
  tranche close, never after. An agent's "designer-eye PASS" is corroboration, never the verdict.

---

## 4 · Why the frontier defers WHOLESALE to L (not a punt — a reasoned deferral)

The K-SEED was divined 2026-06-10, BEFORE the user drove the J-closed product. Its charter
(*"makes kf's CSS-@keyframes round-trip TOTAL"* — CC-1 compiler, K1 ingestion, SO-1 scroll-as-CSS,
WL2-B, PHYS-C, ED-1, the value.js half) is a LIBRARY-FRONTIER charter; the user's 20-finding live
audit + the cold-path P0 is a PRODUCT-TRUTH / DESIGN-TOTALITY charter — a different axis entirely.
`k-seed-reconciliation.md` argues Shape A against both alternatives on the merits:

- **Shape B (split: repair ∥ frontier W0/W4) — REJECTED.** The playback-persistence seam (amiga
  K4-C cold-resume) is NOT file-disjoint from PHYS-C/the cold-path — both ride the same
  `scenePlaybackAdapters.ts`/`sceneMachine.ts` restore wiring; the split re-creates the
  divided-attention failure mode that let the P0 ship.
- **Shape C (integrated charter) — REJECTED.** Forcing the repair under *"round-trip TOTAL"* makes
  the FINAL's scope-claim a lie (the J catastrophe shape) AND mortgages the P0 behind value.js'
  un-dispatched VJ.W1/W2 grammar gate.

**Deferral UN-BLOCKS the frontier** (`k-seed-reconciliation.md §3.1`): K.W2/K.W3 of the seed gate on
value.js grammar that does not yet exist; deferring gives value.js the interval to ship VJ.W0→VJ.W2
in its own tranche process, so L starts un-blocked. None of the frontier decays by waiting (the 12
KILLs are non-re-litigable; the BOOKs carry tripwires); **the P0 decays daily** — every day the
live site serves a non-animating front door. All 7 product-truth lanes independently proposed ONLY
repair/design wave-classes — the fleet's evidence is unanimous. The entire K-SEED round-trip charter
re-seeds UNCHANGED as `L-SEED.md`, with one reconciling preface. (The ONLY frontier fold into K is
K3-internal — the 2 engine diagnostic rows, already J.W1-tagged: VERIFY landed, else a ~20-LoC K.W1
companion. Do NOT fold WL2-B/PHYS-C — M+-effort waves wearing fold hats.)

---

## 5 · The remediation sequence (the DAG)

**K.W0 LEADS** (the P0 — the cold-entry truth; its `proof:cold-entry` oracle and the de-vacuoused
B1 are CONSUMED by every later wave's verification). **K.W1 (the glass-ui consume edge) runs
IMMEDIATELY AFTER W0 lands locally** — the re-pin must precede the design waves so W2/W3/W4 build on
3.13.0, not against it. **K.W2 (fonts) ∥ K.W3 (layout)** follow W1 (file-adjacent in
`demo/@/styles` but separable: W2 owns the voice tokens, W3 owns the grid/anchoring tier — the spec
boundary is BINDING). **K.W4 (the panes) follows W2+W3** (the redesigns consume the new voice +
grid). **K.W5's legs partition:** the cold-entry oracle is W0's own hard gate (lands WITH W0); the
remaining gate-truth legs land as the surfaces they certify land; the TASTE packets generate at
W4's close. **K.W6 is parallel** (ledger terminations, measurements). **K.WZ closes** — and the
design band closes ONLY on the user's review-packet verdict.

```
K.W0 ──> K.W1 ──> ( K.W2  ∥  K.W3 ) ──> K.W4 ──> K.WZ
 │                                                  ▲
 └─ proof:cold-entry + de-vacuoused B1 ─ consumed by every later wave ─┘
  K.W5 legs ride their owning waves · K.W6 parallel throughout
```

The longest serial path: **W0 → W1 → (W2 ∥ W3) → W4 → WZ**.

| Wave | Cluster | The decisive move | Source lanes (audit §) |
|---|---|---|---|
| **K.W0** | The cold-entry truth (P0) | Kill the P0 at the ADAPTER seam (resume-made-total: autoplay-intent + freshly-bound group ⇒ `group.play()`), **NOT** a demo-side `play()` sprinkle; de-vacuous B1 by engine-write disambiguation; hero→scene handoff; U-K1 dock default detent; U-K4 amiga; per-scene cold-mount defects | `live-cold-play-path.md`, `live-session-gap-analysis.md`, `demo-scenes-k.md`, `live-amiga-breakage.md` |
| **K.W1** | The consume edge | glass-ui `~3.11.2 → 3.13.0` (tilde blocks 3.12/3.13); the W7b parity-clause exits re-examined on 3.13; the landed handoff-ledger rows; press-scale/RF-16/RF-17 hazards; release.yml F-1 `timeout-minutes` | `live-glassui-currency.md`, `glassui-handoff-k.md`, `ci-cd-k.md §F-1` |
| **K.W2** | The typographic root | ONE voice-token authority (display/mono/body) — kill the `--font-serif`≡`--font-display` redundancy — consumed everywhere; the dock joins the display voice at the ROOT (`.dock-label`), **NOT** per-component font classes | `styling-typography-k.md`, `live-typography-truth.md` |
| **K.W3** | The layout transposition | NO hardcoded dock offsets (anchor tokens derived, not retuned); pathological-screen clustering (width AND height ceilings, clamp()/container-query driven); desktop+mobile both refined — at the GRID/anchoring system, **NOT** retuned magic offsets | `layout-grid-k.md`, `live-session-gap-analysis.md §2` |
| **K.W4** | The pane verdicts, round 2 | U-K11 spring keyframes-editor variant + STEPPING slider cured at its root (the few-Hz readout mirror must not drive the slider) + red-dashed final state; U-K12 tabs→pills; U-K13/K18 readout hierarchy; U-K16 single-option selects NEVER render; U-K17 clip+drag; U-K20 FourierField removed from hero | `live-dock-tabs-selects.md`, `design-synthesis-k.md`, `live-fourier-grid.md` |
| **K.W5** | The gate-truth wave | `proof:cold-entry` (born-RED today); B1 de-vacuoused; `proof:subject-animates` extended from synthetic to REAL scenes; single-option-select gate; the TASTE review-packet protocol instrumented; release.yml F-1; demo-smoke wall-clock dispositioned | `live-session-gap-analysis.md`, `gate-estate-k.md`, `ci-cd-k.md` |
| **K.W6** | Terminations (P-invariant-28) | The DL-K 32-row ledger's exit-only rows; the ≥4-tranche riders exit probe-or-KILL; the mobile-lighthouse floor re-assertion on a calibrated host; the W2-noted drag-seam gaps; the dev-mode parity chronicle | `deferred-ledger-k.md` |
| **K.WZ** | CLOSE | FINAL.md to inv ε; the prompt-recap extended; the chronic substrate J→K transition; the TASTE packets presented + user verdict recorded; version cut (≥patch for the P0; design band may justify minor) + publish + close-merge round-trip RE-observed; `L-SEED.md` committed | `prompt-recap-k.md`, `precepts-k.md`, `packaging-k.md` |

---

## 6 · The headline gates per wave (each born-RED on today's tree)

The K oracle family closes the two axes at once. Each headline gate carries a BORN-RED witness plan
— the defect tree TODAY reds it; the cure greens it. The P6 posture is declared per clause
(device-independent correctness hard-gates; device-dependent measurements observe-only).

- **K.W0 — `proof:cold-entry` (the LEAD, born-RED on the live P0 TODAY).** Fresh context
  (`localStorage.clear()`), NO seed, `goto #/`, find + click the hero rainbow play as the FIRST
  gesture; assert the LOAD-BEARING engine-attributable pair — the dock play aria flips **Play →
  Pause** AND the playback slider/`--ball-p` advances from 0 — PLUS the aria-GATED corroborator: the
  **engine-write subject** (the OrbitalDrag wrapper for cube/amiga) traverses ≥3 distinct transforms
  WHILE aria="Pause", `.idle-hover` excluded. The disambiguation is the EXCLUSION of the idle bob +
  the aria-GATE + the `--ball-p` advance — NOT a bare single-element count (unfit BOTH ways: `.cube`=0
  on the cold path AND 0/1 even WARM, `gate-estate-k.md §4`; `.graph`=13 engine-OFF on the broken cold
  path, `k-isolate.mjs` — `K.W0.md §Provenance` reconciles the two source lanes). Born-RED witness:
  `k-verify-gate-blindspot.mjs` greens B1=101 while the play button reads "Play animation" — the gate
  exists to red on exactly that, every scene cold-entered from the hero CTA and from direct hash.
  No-workaround: NOT a longer settle, NOT a raised distinct-count, NOT a bare single-element count.
- **K.W1 — the re-pin witness.** `proof:all` green on `~3.13.0`; the `proof:deps-current` floor
  `3.11.2 → 3.13.0`; the hand-rolled twins each DELETED in the same motion they consume the
  published primitive (net-deletion). Born-RED: the gate floor reds against the published 3.13.0
  while the pin is tilde-stuck at `~3.11.2` (`live-glassui-currency.md`).
- **K.W2 — the positive font-voice assert.** The dock-label/chrome RESOLVES the display voice (not
  just the Jakarta negative); ONE token authority — `--font-serif`≡`--font-display` redundancy
  killed. Born-RED: a dock in the wrong (text/mono) voice passes today; the positive assert reds on
  the split voice (`live-typography-truth.md §2-4`).
- **K.W3 — the cluster + no-hardcoded-offset assert.** Pathological widths/heights (3440×1440,
  5120×2880, 390px) CLUSTER into a bounded container; no hardcoded dock offset survives the anchor
  census. Born-RED: at 2560px the dock pills strand as tiny islands and nothing clusters
  (`design-synthesis-k.md §1.5`, `layout-grid-k.md`).
- **K.W4 — the single-option + continuous-slider + red-dashed asserts.** No single-option `<Select>`
  renders anywhere (the count IS the gate, `>0 → >1` made total); the spring slider value is
  continuous (not stepped by the few-Hz readout mirror); the "settled" motion register is the
  red-dashed everywhere (ONE motion-color authority). Born-RED: the ChromeDock 1-item dropdown
  still renders for easing/spring; the green-progress palette still drives sliders/rings
  (`live-dock-tabs-selects.md §2`, `design-synthesis-k.md §3`).
- **K.W5 — the axis-coverage map executed.** `proof:subject-animates` extended from the synthetic
  `<div>` over `dist/keyframes.js` to the REAL scenes; B1 de-vacuoused; the single-option gate; the
  TASTE review-packet generator rides the W3-lib capture harness. Born-RED: the synthetic gate
  never exercises the demo's matrix/CSS-var transform path (`live-session-gap-analysis.md §F4`).
- **K.W6 — the termination artifacts.** Each ≥4-tranche rider exits via a born-RED gate, a
  measurement, a published consume-edge, or a reasoned KILL — never a bare BOOK (`deferred-ledger-k.md
  §2`); the mobile-lighthouse floors re-asserted on a calibrated quiet host.
- **K.WZ — the close round-trip RE-observed + the TASTE verdict recorded.** The auto-deploy
  round-trip RE-observed on the close merge (the J.W0 oracle re-witnessed); the design band closes
  ONLY on the user's review-packet verdict — a named USER-DOMAIN step BEFORE the version cut.

---

## 7 · The terminal reading

J made every boundary between the certified product and a human tell the truth — and the user,
hours later, crossed the one boundary no gate had ever crossed: the first click. **K's correction
is to make the product TRUE FROM THE FIRST GESTURE and BEAUTIFUL AT ITS ROOTS:** the cold path
plays because the adapter resume is total; the liveness oracle reads the engine's own hand, never
the idle bob that fooled it; one font authority gives every surface — dock included — its voice;
the dock anchoring becomes a derived grid that clusters gracefully on a cinema display and a phone
alike; the panes the user indicted are re-cut on the current glass-ui with the taste anchors the
user actually loves (the rainbow play, the icon pops, the red-dashed final state); and where taste
is the oracle, the protocol says so out loud and hands the user the packet. The frontier waits,
un-blocked, in `L-SEED.md`. When K closes, "green" means: **the first thing a human does — click
the rainbow button — works, smoothly, beautifully, on the first try, and every claim of beauty was
signed by the only oracle that can judge it.**
