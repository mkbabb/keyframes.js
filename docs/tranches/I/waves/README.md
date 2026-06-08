# Tranche I — THE WAVES (the recovery + the gate-regime overhaul)

**Branch:** `tranche-i-dev` (forked off the broken master `b934a08` = H's tip).
**Type:** TRANCHE DEVELOPMENT — these are the wave SPECS. No source is fixed here; no
commit is made. The deliverable is `docs/tranches/I/**`.
**Charter inputs (read first):** the root causes
(`audit/rootcause-rc-{parse-crash,dfa-gen,amiga,easing-editor,drag-perf,icons-build,specular-glassui,gate-blindspot}.md`),
the recaps (`audit/recap-{prompts,precepts,chronic,deferred}.md`), and the investigation
findings (`audit/investigate/**` — 16 surfaces, Playwright over the BUILT `dist/gh-pages/`
+ the `:5174` dev server, reproduced not theorized).

---

## §0 — WHY THIS TRANCHE EXISTS (the catastrophe, in one paragraph)

Tranche H shipped with **ALL 97 `proof:*` gates GREEN** (`tsc` 0, `proof:all`,
`proof:browser` 35/35, `proof:chronic-closure`) — and the LIVE demo is **deeply broken**
(B1–B9 + K). The gates certify **SOURCE-SHAPE + LOAD-TIME**, never **RUNTIME /
INTERACTION / STATE** — so they certified a broken product. This is the gate-blindspot the
user has warned about repeatedly (*"green source-shape gates miss appearance / interaction
/ state; audit the RUNNING demo"*). The gate-regime OVERHAUL is the headline of Tranche I:
close the blindspot for good by binding every gate's ORACLE to the running product,
exercised through the human's surface (PLAY + SWITCH + DRAG), with an error budget of zero.

`inv-16` for Tranche I: the engine `src/animation` is the PRODUCT — **NOT fenced this
tranche**. Runtime correctness MAY require an engine transposition (B1's empty-input seam,
the group's unseeded `transform`). Published siblings (value.js, parse-that, glass-ui) are
consumed, never patched in kf — but kf authors the consume-edge decision and may drive a
sibling release.

---

## §1 — THE BREAKAGE → WAVE MAP (every B-report folded, no drops)

| ID | Live breakage (user report 2026-06-08) | Root cause | Wave |
|---|---|---|---|
| **B1** | Rainbow group-play → `Parse error at offset 0: "......"` + `this.transform is not a function` | `parseCSSValueUnit("")` on an unset `var()` read-back + unseeded `AnimationGroup.transform` | **I.W0** |
| **B5** | CSS keyframes editor shows `/* timing-function: custom — no CSS twin */` | SAME empty-value seam, serialize face; mis-attributing placeholder | **I.W0** |
| **B2** | DFA suspend → `TypeError: undefined is not an object (evaluating 'this._gen')`; blank controls | UNBOUND `playback.stop` passed to `useSceneVisibilityPause` | **I.W1** |
| **B4** | `/easing` LOST the curve/timing editor (J1–J6 over-removal); editor blank on switch | reka `<Tabs>` `passive`-latch desync + a real parity gap (lost readout/copy) | **I.W2** |
| **B3** | `/amiga` "totally broken and floats around" | corner subject vs origin-orbit pivot + `content-visibility:auto` over a live WebGL loop | **I.W3** |
| **B6** | `/square` drag highlights chrome text + does not persist | no global select-suppression seam; `pointerup → reseat(0,0)` | **I.W4** |
| **B8** | ALL dock animations "supremely broken, slow, errored" | dock `transition: width` under `backdrop-filter`; per-rAF Vue render storm; B1 console bleed | **I.W4** (+ B1 via I.W0; specular via I.W6) |
| **B9** | dev `ENOENT easing-icon-sm.svg`; source-map ×47 | default-outDir landmine + SPA-fallback masking; no runtime icon-paint gate | **I.W5** |
| **K** | tab title should be just `keyframes.js` | source vs build title drift | **I.W5** |
| **B7** | specular sheen STILL present; "are we using the latest glass-ui?" | glass-ui `<Card surface="glass">` emits `.glass-specular-track` unconditionally, unwired; the fix is unpublished | **I.W6** |
| **keystone** | 97 green gates certified a broken product | every gate's oracle is a PROXY (source text / jsdom / localStorage / self-baseline / token / markdown) | **I.W7** |

---

## §2 — THE WAVES (the gestalt grouping)

Each wave fixes a coherent BODY of breakage and carries a **born-RED RUNTIME/INTERACTION
gate** (error-budget 0) — a gate that CLICKS play, SWITCHES scenes, or DRAGS, asserting the
product property a human would check. No wave's gate is a source-shape check.

| Wave | Title | Owns | The born-RED gate (what it actuates) |
|---|---|---|---|
| **I.W0** | engine empty-input + serialization correctness | B1, B5, the `this.transform` group crash | clicks the rainbow group-play on home + cube, switches scenes — asserts 0 `pageerror`/parse-line AND the cube transform actually paints |
| **I.W1** | the FSM suspend/resume bind-proof transposition | B2 | plays a raw-rAF scene, fires `visibilitychange` + a real dock-Select switch while playing — asserts 0 throw + destination controls mount non-blank + resume-iff-was-playing |
| **I.W2** | the easing-editor design-correction | B4 | dock-switches INTO easing — asserts the curve canvas + draggable handles present, a handle-drag mutates the path, the readout+copy present, the selector re-renders |
| **I.W3** | the amiga scene-runtime transposition | B3 | drives a centre-canvas drag on `/amiga` — asserts the sphere (subject) moved while the room (camera) did not + 0 GPU-stall/content-visibility warns |
| **I.W4** | the drag + perf transposition | B6, B8 | drives a real pointer drag over a chrome label (asserts no text-selection + transform persists); under CPU throttle, expands the dock + plays easing (asserts ≤N dropped frames) |
| **I.W5** | the icon single-source + shell chrome | B9, K | clicks through every scene + opens the editor — asserts every glyph paints a non-zero `<svg>`, 0 asset-404 during interaction, `document.title === "keyframes.js"` |
| **I.W6** | the specular re-decision + glass substrate | B7 | at REST on every stage + dock glass surface — asserts the bloom is ABSENT + the glass plate reads as perceptual depth (not a flat near-white rectangle) |
| **I.W7** | **THE GATE-REGIME OVERHAUL** (the headline) | the keystone blindspot | `proof:live-session` — ONE interaction-driven session probe (the human battery), error-budget 0; downgrades the 54 source-shape/jsdom gates to a labeled HYGIENE tier; rewires `proof:chronic-closure` to require runtime gates that BIT |

---

## §3 — THE DEPENDENCY DAG (order by dependency)

```
                       ┌─────────────────────────────────────────────┐
                       │ I.W0  engine empty-input crash (B1/B5)       │  ← LEADS
                       │  · "......" poisons EVERY other measurement  │     (poison
                       └───────────────┬─────────────────────────────┘      removal)
                                       │ (clean console is the precondition for
                                       │  every interaction gate to be readable)
        ┌──────────────────┬──────────┼───────────────┬──────────────────┐
        ▼                  ▼          ▼                ▼                  ▼
  ┌───────────┐     ┌───────────┐ ┌───────────┐  ┌───────────┐    ┌───────────┐
  │ I.W1 FSM  │     │ I.W2      │ │ I.W3      │  │ I.W4      │    │ I.W5      │
  │ suspend   │     │ easing    │ │ amiga     │  │ drag+perf │    │ icons+    │
  │ (B2)      │     │ editor    │ │ (B3)      │  │ (B6/B8)   │    │ shell     │
  │           │     │ (B4)      │ │           │  │           │    │ (B9/K)    │
  └─────┬─────┘     └─────┬─────┘ └───────────┘  └─────┬─────┘    └───────────┘
        │ (B2 blank         │ (the control-mount      │ (the dock-perf half
        │  controls share   │  single-authority       │  rides the glass-ui
        │  the control-mount│  is shared with B4)      │  pin → couples to I.W6)
        │  hardening)       │                          │
        └───────────────────┴──────────────┐    ┌──────┘
                                            ▼    ▼
                                      ┌───────────────────────┐
                                      │ I.W6  specular (B7)   │
                                      │  glass-ui pin bump    │
                                      │  (couples M3 dock     │
                                      │   transition retune)  │
                                      └───────────┬───────────┘
                                                  │
                                                  ▼
                              ┌─────────────────────────────────────────┐
                              │ I.W7  THE GATE-REGIME OVERHAUL           │  ← CLOSES
                              │  proof:live-session subsumes W0–W6 gates │     (every
                              │  into ONE driven battery; chronic-closure│      fix is
                              │  rewired to require runtime gates         │      a clause
                              └─────────────────────────────────────────┘      in it)
```

**Ordering rationale:**

0. **THE PRECEPT LEADS — as a CHARTER INVARIANT bound at t=0, NOT as a wave.** The gate-ORACLE
   precept (plus the error-budget allowlist and the two-tier taxonomy) is bound the moment I
   opens, mechanically prior to every wave's §Hard gate, and enforced by machine — the
   `proof:gate-is-runtime` meta-gate REDS any wave that registers a source-shape-only oracle as
   its correctness gate. This is the RED-1 correction: the precept is NOT deferred to the last
   wave and inherited backward by authorial fiat (that is exactly the "read the warning,
   re-commit the substance" failure H made). It is enforced from t=0 (`I.md § The precept is
   MECHANICALLY PRIOR`).

1. **I.W0 LEADS THE FIX WAVES (poison removal).** The `"......"` storm + the `this.transform`
   crash flood the shared console on home/cube load AND every scene-switch. Until it is dead, no
   other wave's console-oracle gate is readable (B8's "errored" is partly this bleed; B10 §1
   shows the crash storms on switch-away). H itself put the crash fix first for the identical
   reason (*"the live crashes poison every other measurement"*). It also removes the dock's
   "errored" half (D5 in `rc-drag-perf`) and B5 with B1 (one seam).

2. **I.W1–I.W5 are largely independent** and may proceed in parallel after I.W0, with two
   shared seams flagged:
   - **the order-independent CONTROL-PANEL mount** is shared by I.W1 (B2's blank-controls
     flush-abort) and I.W2 (B4's reka latch). The control-mount single-authority should be
     authored ONCE (I.W2 owns the surface single-authority; I.W1 consumes it for the
     resumed scene). They must not both re-invent it.
   - **the dock-perf half of B8** (I.W4) couples to the **glass-ui pin** (I.W6): the dock
     `transition: width`/`transition: all` retune is glass-ui-owned and rides the SAME
     v3.8.0 cut as the specular default-off. I.W4 owns the kf-side perf transposition
     (the per-rAF render storm, the composed driver); the glass-ui dock-spring/transition
     retune is consumed via the I.W6 bump.

3. **I.W6 (specular) depends on I.W4's measurement** (whether the dock perf needs the
   glass-ui retune) and is a consume-edge that may require driving a glass-ui release
   (v3.8.0). It is sequenced after the kf-side perf work so the pin bump is a single,
   measured motion.

4. **I.W7 CLOSES — its BATTERY assembles last; its PRECEPT was already bound at t=0.** The
   gate-regime overhaul ASSEMBLES `proof:live-session` — the ONE interaction-driven battery —
   from each prior wave's interaction leg (I.W0's play-click, I.W1's visibility-tick + switch,
   I.W2's handle-drag, I.W3's centre-drag, I.W4's drag + perf, I.W5's icon-paint, I.W6's
   bloom-at-rest). It can only be fully green once W0–W6 land (born-RED on `b934a08` with every
   breakage live), so the BATTERY assembles LAST. **It does NOT lead, and its precept is NOT
   "stated in I.W7 and inherited backward" — the precept is a CHARTER INVARIANT bound at t=0
   (rationale #0), mechanically prior, machine-enforced by `proof:gate-is-runtime`.** What I.W7
   adds at close is the machine INSTALLATION (`proof:gate-is-runtime`), the assembled battery,
   the structured error-budget allowlist (defined once, inherited), the HYGIENE relabel of the
   ~54 source-shape gates, and the chronic-closure rewire (cited gates must be runtime gates that
   bit) — the durability keystone that makes this the LAST re-paper. The precept leads (t=0); the
   battery closes (I.W7).

---

## §4 — THE GATE PRECEPT (I-born — a CHARTER INVARIANT bound at t=0; binds every wave's §Hard gate)

> **A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the
> SAME surface the human uses, with an ERROR BUDGET OF ZERO across the human's interaction
> battery (PLAY + SWITCH + DRAG). A gate whose oracle is source text, a jsdom unit, a
> serialized snapshot, a self-captured baseline, a design-token number, or a paperwork
> ledger is a HYGIENE gate, not a CORRECTNESS gate, and MUST be labeled as such — it may
> never count toward a correctness or chronic-closure tally.**

This precept is **BOUND AT I-OPEN (t=0) as a CHARTER INVARIANT**, not asserted by the last
wave. It is **MECHANICALLY PRIOR** — enforced from t=0 by the **`proof:gate-is-runtime`**
meta-gate: for every wave's §Hard gate registered as that wave's CORRECTNESS oracle, the
meta-gate asserts the gate DRIVES A REAL INTERACTION over the running product (CLICK / SWITCH /
DRAG / a real visibility tick) and reads a product-facing property; a wave that registers a
SOURCE-SHAPE-only gate as its correctness oracle **REDS**. So the precept's authority is enforced
by machine, not by each wave author having read I.W7 first. Two further CHARTER INVARIANTS, also
bound at t=0 and inherited by every wave, complete the regime:

- **the error-budget ALLOWLIST** (H-2) — ONE structured budget definition: HARD-zero on
  `pageerror` / `unhandledrejection` / `console.error` / the value.js `"......"` line;
  PROMOTED-zero on the ReadPixels / content-visibility `warning`/`verbose` GPU-stall lines; MINUS
  the named-benign dev source-map noise. Defined once in I.W7 S2; no per-wave drift.
- **the two-tier oracle taxonomy** (H-4) — every wave's GREEN depends on its RUNTIME clause; the
  config / lint / class-shape clauses are HYGIENE-tier, strictly CORROBORATING, and may NEVER
  substitute for a red runtime clause. The taxonomy holds the NEW I gates to its own standard.

Every wave below carries a §Hard gate that obeys this. The harness is the proven
`scripts/proof-no-orphan-specular.mjs` pattern — `serveDist` on port 0 + chromium via
`createRequire(KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js)` + `openSceneFresh`
navigating `${base}/#/${scene}` — the SAME harness every investigation probe used to
reproduce B1–B9, extended from PASSIVE to ACTUATING. I.W7 ASSEMBLES the per-wave legs into
one re-runnable session battery (the precept led at t=0; the battery closes at I.W7).

---

## §5 — WHAT IS NOT IN THESE WAVES (the honest fence)

- **CLOSED-for-real → do NOT re-litigate:** the φ-hero typography chronic (CH-2 — the one
  SYSTEM gate that genuinely discharged; the user did not re-flag it), the dock SPRING
  retune (D5 — 120fps clean, gated, honest), the value.js charter (C-1, chronic-by-design,
  the process working). (`recap-chronic §9`.)
- **value.js / parse-that / engine BOOKs → sibling-HANDOFF (ride the next re-pin, ZERO kf
  edit):** the next-slice charter (VJ-1..9), the parse-that `(id,offset)` re-key,
  FB-1/2/3/5 + SoA. The ONE place the I investigation moves the value.js ledger is the
  empty-input parse contract (B1) — folded as a value.js-HANDOFF defense-in-depth PAIRED
  with the I.W0 engine transposition (`recap-deferred §2/§3.A`).
- **DC-8 scene-swap dead-CSS → KFI-DECIDE (no fourth defer):** verify `grep` dead
  scene-swap CSS = 0; KILL or RESTORE via `startViewTransition`. Folded into I.W5 (shell
  chrome) as a small DECIDE. (`recap-deferred §7`.)
- **Permanent KILL (RECORD):** ScrollTimeline-native, Worker/OffscreenCanvas, WASM-parser,
  Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh.

---

## §6 — THE VERSION + CLOSE

The stacked changeset version owner is **Mike Babb** (`mike@babb.dev`). The publish leg is
user-domain, confirm-first. The I close (FINAL.md · recap · ledger · changeset · deploy) is
the WZ lane, authored after the waves land — NOT part of this dev-only authoring.

**The terminal reading:** Tranche I is the recovery of nine live breakages AND the
gate-regime overhaul that makes "green" mean "a human using the product would see it work."
The engine transposition (I.W0/I.W1), the design-correction (I.W2/I.W3), the perf/drag
transposition (I.W4), the single-source hygiene (I.W5), the consume-edge re-decision
(I.W6) — every one is gated by a probe that CLICKS, SWITCHES, or DRAGS. I.W7 binds them
into one battery and rewires the chronic-closure keystone so the blindspot closes for good.
