# keyframes.js — the constellation-lockstep reorientation (demo + library perf · design · glass-ui-BC / value.js / fourier locksteps)

> **Tranche-development direction**, 2026-06-18. The owner shelved the Stage selector
> (`docs/tranches/N/STAGE-SPEC.md` retained) and reoriented the LATEST tranche (M) toward
> **demo + library performance AND design**, in **lockstep with value.js, fourier-analysis, and the
> forthcoming glass-ui BC tranche**. This doc analyzes the BC waves, maps the bidirectional
> lockstep, and folds the focus into M (extending its Band C constellation + Band D perf). DEV ONLY.

## The constellation state (scouted 2026-06-18)

| repo | branch | head / version | tranche posture |
|---|---|---|---|
| **glass-ui** | `tranche/BB` | `9543fcc` · published **4.0.1** | **BC chartered** (70 waves, DEVELOPED, not impl) — the gestalt-first glass+dock rebuild |
| **value.js** | `tranche-f-handoff` | `9fce504` · **0.13.0** | tranches J–N; the kf-K grammar fold shipped |
| **fourier-analysis** | `m/w1-bump-migration` | `04584a3` · M tranche | the hub, in its own M (32-agent critique-hardening) |
| **parse-that** | `tranche-f-handoff` | `6fb9de2` · 0.9.x | half-published reconcile |
| **keyframes.js** | `tranche-l-dev` | M chartered · **4.3.0** | the consolidation tranche (apparatus/correctness/constellation/perf/chronic) |

Peers are **fully aligned**: glass-ui `^4.0.1`, value.js `^0.13.0(||^1.0.0)`, keyframes.js `^4.3.0`.

## The glass-ui BC tranche — analysis (the waves the owner asked to read)

BC is *"the gestalt-first reckoning: rebuild the glass + dock, re-verify the paint, fold every
chronic, close honestly."* 70 waves. Its diagnosis is one architectural disease in three faces:
the **single-terminal-reflect deferral** (≈38–47 BB waves deferred their paint verdict to one wave
that never ran → "complete" meant source-green-only; 0/33 visual waves had paint verified), the
**paint-blind gates** (`proof:adaptive-glass`/`no-gray`/`ba-gestalt` pass on BOTH the grey-broken
and the fixed state — they read the source mechanism, never the rendered gestalt), and the
**chronic-patch death-spiral** (178 dock commits, the adaptive-darken "recalibrated" 7× — still
grey). The cure: **GESTALT-FIRST · NO LEGACY · MEASURED PAINT** — rip-and-rebuild, every visual wave
closes on its own live pixel-readback verdict.

The bands that touch keyframes.js:
- **Band 1 — Glass identity**: warm-cream partial-transparency restored at root, the grey-slab
  killed; the catch-light rim (`BC.W-BLACK-BAR`); glass pruned to two registers (CARDS + MATERIALS);
  iOS-27 dialog/button glass. → **kf's demo consumes this glass.**
- **Band 2 — The dock engine**: ONE buttery springy **compositor-only** dock morph (`transition:all`
  killed); arbitrary sizes/shapes via clip-path/scale; vertical dock fixed. → **kf is BC's named 2nd
  consumer of `W-DOCK-MORPH-FAMILY`** (ChromeDock/TransportDock).
- **Band 11 — Perf**: `BC.W-CSS-CRITICAL` / `BC.W-LIGHTHOUSE` / `BC.W-PERF-PRODUCER`. → **kf demo perf
  coordinates** (lighthouse, critical CSS, content-visibility).
- **Motion**: `BC.W-VIZ-CHOREOGRAPHY` + `BC.W-MOTION-ONE-CLOCK` use **keyframes.js as the ONE motion
  source + clock**; `BC.W-GRID-SIMPLE` makes glass-ui's grid "like keyframes.js". → **kf's engine is
  load-bearing for BC.**

## The bidirectional lockstep (the binding edges)

**kf → glass-ui (kf must SHIP, BC consumes):**
1. **KF-OSCILLATOR** — a LIGHT, value.js-free `Oscillator`/shared phase-clock (the speedtest idle-breath
   + the `W-EASING-PRIMITIVE` picker `loop` seam). BOOKED kf-owned; glass-ui's BC viz/dock ride it as
   the ONE clock. **Ship it** (it already exists as the L.W9 Oscillator — confirm the published LIGHT
   surface + the `loop` consume).
2. `springTimingFunction` (`{fn, css:linear()}`) — ✅ already a LIGHT published export BC consumes (`--spring-deck`).
3. The **boundary law** affirmed + code: curve-MATH = value.js · playback/spring = kf · editor = glass-ui.

**glass-ui → kf (kf CONSUMES at the BC cut):**
4. The rebuilt **glass identity** (warm-cream partial-transparency) — re-pin glass-ui at the BC cut;
   the demo's glass surfaces (dock, cards, dialogs) inherit the new register; **re-verify the demo
   paint** (the L.W11 instrument scenes) on the new glass — the kf-side mirror of BC's measured-paint law.
5. The rebuilt **dock engine** — adopt the springy compositor morph; retire any kf-side dock patches
   that BC's rebuild obsoletes; confirm `ChromeDock`/`TransportDock` ride the new engine cleanly.
6. The peer-cycle unblock — BC cuts a glass-ui that peers `value.js ^0.13.0||^1.0.0` + `keyframes.js
   ^4.0.0` cleanly (the M Band-C deploy blocker: today's glass-ui 4.0.0 peer rejects value.js 0.13.0).

## The shared lesson (the constellation converged)

BC's **measured-paint law** ≡ kf's **`inv-M-observable-truth`** (the L.W11 dead-eggs: green gates
missed the silently-dead hero-lift + trace-smear). Both repos independently reached: *the gate must
read the rendered observable, not the source mechanism.* kf's M apparatus consolidation (the
report-all runner, the two-axis taxonomy) is the kf instance of the same cure BC names for its gates.
**This is the spine of the reorientation: kf adopts the measured-paint discipline for its DEMO DESIGN
verification, in lockstep with BC.**

## The reoriented M — the demo/library perf + design focus folds in

M already carries the relevant bands; the reorientation SHARPENS them and adds the design axis:

| M band | reorientation |
|---|---|
| **A — apparatus** | keep (the report-all runner kills the 3-hr wound); ADD a **measured-paint demo gate** (the BC-aligned pixel-readback over the kf demo scenes — the inv-M-observable-truth made visual) |
| **B — correctness** | keep (the round-trip breaches) |
| **C — constellation** | SHARPEN to the BC lockstep: ship KF-OSCILLATOR's published LIGHT surface; re-pin glass-ui at the BC cut + consume the new glass+dock; the peer-cycle deploy unblock |
| **D — perf** | SPLIT into **library perf** (the engine-seam transposition + the value.js color-math co-bench, honest bench numbers) AND **demo perf** (lighthouse per scene, critical CSS, content-visibility — coordinated with BC.W-LIGHTHOUSE) |
| **NEW — design** | **demo design** re-verified on BC's new glass (measured paint, both modes × mobile/desktop); the instrument-language scenes (L.W11) re-grounded; **library design** = the boundary-law surface (the Oscillator/spring/easing publishing seam glass-ui consumes) |

## Proposed next step

This is a tranche-development reorientation grounded in the real constellation. The full development —
authoring the reoriented M wave specs (the measured-paint demo gate, the KF-OSCILLATOR publish
confirm, the glass-ui-BC consume sequencing, the demo+library perf benches, the design re-verify) +
an adversarial harden — is the deep-audit/fleet work the prior tranches used. Recommend a 3-lane
deep-audit fleet (glass-ui-BC consume-edges + kf demo perf/design baseline + kf library perf/design
baseline) → synthesis → wave authoring. Awaiting the go-ahead to deploy it.
