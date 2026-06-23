# Q.WG-S1S2-HYGIENE — retarget the `proof-workaround-deletion.mjs` S1/S2 arms to CONTENT-aware probes (close the false-RED that FAILS `proof:hygiene` today) + author the kf content-aware bilateral gate `proof:glassui-aria-ask`

**Band:** G — consume (the cross-repo dispatches + GATED consumes); this is the NOW gate-hygiene leg that precedes the GATED S1/S2 deletes.
**Phase:** **NOW** — a kf-internal gate retarget + a new kf gate, executable on authorization against TODAY's installed tree (zero sibling publish required). It is the precondition that turns the S1/S2 deletes from a false-RED CI failure into a correctly-PENDING-until-publish edge.
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile (NOW) ─► **Q.WG-S1S2-HYGIENE** (the gate retarget, NOW) ─► glass-ui BC publish (Q.WG3 / KF-TO-GLASSUI-Q.md, USER-DOMAIN) ─► Q.WG-GATED-CONSUMES (the S1/S2 deletes, GATED on the publish) ─► Q.WZ`. The retarget lands FIRST so the GATED deletes fire against a correct content-probe (not the broken version sentinel).
**Owning DM / idea:** the **DM-5 S1/S2 FALSE-RED chronic** (`B2-pw12-dock-aria`: "kf S1 GATE IS A CONFIRMED FALSE-RED, AND IT FAILS CI" — `proof:workaround-deletion` exits 1 today with S1=RED S2=RED) + the **deceptive-ledger finding** in the charter (§1: "the `proof:workaround-deletion` S1/S2 arms are false-RED — version-probe, no content-probe") + the **missing bilateral gate** (`proof:glassui-aria-ask`, referenced by glass-ui's `BD.W-CUT.md:14` but ABSENT from `scripts/`). Audit substrate: **B2-pw12-dock-aria** (the primary lane), **B1-deploy-ci** (the gate fails `proof:hygiene` in CI). The dispatch partner is **KF-TO-GLASSUI-Q.md** (Q.WG3).

---

## Context

The owner's no-deferral mandate makes a **false-RED gate** intolerable: a gate that reds for the WRONG reason either masks a real defect or (here) BLOCKS CI on a deletion that is NOT actually safe. `B2-pw12-dock-aria` found `proof:workaround-deletion` exits 1 today with **S1=RED and S2=RED**, printing "the deletion is now SAFE and OVERDUE — delete the workaround and re-pin." **This is WRONG**: deleting the S1 suppress now re-introduces the prohibited `aria-orientation` attribute, because the INSTALLED glass-ui dist (4.0.1) STILL emits it on `role=group`. The gate fires RED on the mere EXISTENCE of a published glass-ui 4.1.0, not on whether the fix is in the dist kf actually consumes.

**The root cause, grounded (verified 2026-06-23).** The gate's three-state classifier is sound — it ALREADY distinguishes "version published but API absent" (PENDING) from "version published AND replacement API consumable" (RED) via an `apiPresent` field. The S7/S8/S9 arms ALL carry it (`apiPresent: vjsCaps.linearSerialize`/`.flatLeaf`/`.parseCSSSubValue`, `proof-workaround-deletion.mjs:245,273,292`). But the **S1 and S2 arms carry NO `apiPresent` field** (`:203-217`, `:218-229`). The verdict logic (`:323`) reads `const apiLanded = arm.apiPresent === undefined || arm.apiPresent === true;` — so a missing `apiPresent` defaults `apiLanded` to `true`, and with the version published the arm fires RED (`:325-326`). The P.W12 retarget the FULL-LOOP-LEDGER mandated (add the content-probe) was NEVER applied — the false-RED is the exact gap.

**Why this is a CONTENT problem, not a version problem.** The glass-ui aria guard IS authored (`SegmentedTabs.vue:406`, branch `prototype/liquid-dock`) but NOT in the published dist — it is hard-gated behind the unexecuted USER-DOMAIN `BD.W-CUT`. kf installs `~4.0.0` (→ 4.0.1), whose `dist/tabs.js` emits the prohibited attribute unconditionally. So the deletion is **NOT safe** — the suppress lines are correct + necessary until the fix lands in the INSTALLED dist. The cure is a content-aware probe (grep the installed dist for the guard shape, or DOM-readback the mounted pill), NOT a registry version check.

**The S2 second false-RED (a deeper orphan).** The S2 (DOCK) arm's `sibling.name` is "BB W-DOCK-MORPH-FAMILY click-strand cure" but its witness keys only on glass-ui 4.1.0 being published — and the only dock fix present in published 4.0.1 is the UNRELATED `useDockClickIntegrity` (the ASK-2 cure, not the collapse-crossfade strand). So S2 reds on a version that does NOT contain its cure — orphaned in both repos. The retarget must point S2's `apiPresent` at the ACTUAL collapse-crossfade keepalive marker (named by GU-Q2 in `KF-TO-GLASSUI-Q.md`), not the wrong version sentinel.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|----------------------------|
| the S1 arm lacks `apiPresent` | `scripts/proof-workaround-deletion.mjs:203-217` | the S1 arm declares `witness` + `sibling: {pkg:"@mkbabb/glass-ui", version:"4.1.0", …}` but NO `apiPresent` field |
| the S2 arm lacks `apiPresent` | `scripts/proof-workaround-deletion.mjs:218-229` | same — `sibling.version:"4.1.0"`, `sibling.name:"BB W-DOCK-MORPH-FAMILY click-strand cure"`, NO `apiPresent` |
| the verdict default | `scripts/proof-workaround-deletion.mjs:323` | `const apiLanded = arm.apiPresent === undefined \|\| arm.apiPresent === true;` — a MISSING `apiPresent` defaults to `apiLanded=true` |
| the false-RED fire | `scripts/proof-workaround-deletion.mjs:325-337` | `pub === "PUBLISHED" && apiLanded` → RED with the "DELETE and re-pin" message — FIRES for S1/S2 because glass-ui 4.1.0 is published |
| the content-probe precedent | `scripts/proof-workaround-deletion.mjs:138-156` (`vjsCaps`) | the `vjsCaps` block probes the INSTALLED value.js surface (`'flatLeaf' in vjs`, the `linear()` round-trip) — the EXACT idiom a `glassCaps` block mirrors against the installed glass-ui dist |
| the suppress sites | `demo/spring/SpringSidebar.vue:43`; `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` | both `:aria-orientation="undefined"` (the S1 band-aid) |
| the dock twin | `demo/@/components/custom/animation-controls/TransportDock.vue` script `:348-375` (`pointerHandled` `:348`, `onPlayPointerDown` `:358`) + template handlers `:151`,`:196` (VERIFIED) | `pointerHandled`/`onPlayPointerDown` (the S2 band-aid; the witness `/pointerHandled|onPlayPointerDown/` greps all `.vue` lines, so it matches the script AND template sites) |
| the installed dist | `node_modules/@mkbabb/glass-ui` (pin `~4.0.0` → 4.0.1) | `dist/tabs.js` emits `aria-orientation` unconditionally on `role=group` (the guard NOT in the dist) |
| the missing bilateral gate | `ls scripts/proof-glassui-aria-ask.mjs` | ABSENT — referenced by glass-ui's `BD.W-CUT.md:14` as the kf content-aware lock, never authored |
| the gate fails CI | `package.json:200` (`proof:hygiene` chain) | `proof:workaround-deletion` is in the chain; it exits 1 today → `proof:hygiene` fails |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. The retarget makes the S1/S2 arms CONTENT-aware (matching S7/S8/S9's `apiPresent` discipline); the new gate is the DOM-readback half of the bilateral lock. NO suppress line is deleted here (that is the GATED Q.WG-GATED-CONSUMES wave) — this wave only corrects the gate so the deletes fire correctly later.

### S1 — add a `glassCaps` content-probe block (mirror `vjsCaps`)

**Breach.** No block probes the INSTALLED glass-ui dist for the actual fix content; the S1/S2 arms key on the registry version alone.

**Cure.** Author a `glassCaps` block at the top of `proof-workaround-deletion.mjs` (beside `vjsCaps`, `:138`), reading the INSTALLED `@mkbabb/glass-ui` dist:
- `ariaGuard` — the guard is present iff the installed `dist/tabs.js` does NOT emit `aria-orientation` UNCONDITIONALLY on `role=group`. **The probe is a DIST-CONTENT GREP (device-INDEPENDENT — this is what keeps the `s1-s2-not-false-red` gate-correctness clause portable, NOT a DOM mount).** VERIFIED 2026-06-23: the installed 4.0.1 `dist/tabs.js` emits `aria-orientation": L.value ? "vertical" : "horizontal"` — an UNCONDITIONAL emit (no role-guarded `else` arm), so the grep for the GUARDED shape (the `aria-orientation` bind carrying a `... : void 0`/`: undefined` else arm, i.e. the role-conditional `isUnderline ? … : undefined` compiled form) finds NOTHING → `ariaGuard=false` (PENDING). When the BC cut ships the guard, the dist carries the `: void 0` else arm → the grep matches → `ariaGuard=true`. The mounted-DOM readback is the SEPARATE, device-bearing `proof:glassui-aria-ask` (S3) — kept distinct so this content-probe stays portable; it does NOT call the DOM gate inline. Content-present ⇒ true.
- `dockStrandKeepalive` — the collapse-crossfade keepalive is present iff the installed dock dist carries the keepalive's STRUCTURAL signature (a device-INDEPENDENT dist-content probe, mirroring `ariaGuard`'s dist-grep — NOT a live DOM session inside `proof:workaround-deletion`, which would make the gate device-bearing). The probe greps the installed dock dist (`dist/dock.js` / the dock-layer styles+script) for the structural change the cure introduces — the `.dock-layer` retaining `pointer-events`/hit-test across the collapse-crossfade (e.g. the keepalive holds the active layer interactive rather than the current drop/recreate). This needs NO forward-named PUBLIC API string: it reads the structural dist signature the cure necessarily leaves, regardless of what glass-ui names the public mechanism. The BEHAVIORAL observable (a `pointerdown` lands mid-crossfade) is the SEPARATE, device-bearing consume-time gate `proof:live-session` S5 (S4 wires it as the consume gate, kept distinct so this content-probe stays portable). Structural-signature-present ⇒ true.

The `glassCaps` block mirrors `vjsCaps`'s installed-surface discipline exactly (`'X' in mod` / a round-trip / a dist-content grep), not a registry probe.

### S2 — wire `apiPresent` onto the S1 + S2 arms

**Breach.** The S1/S2 arms default `apiLanded=true` (missing `apiPresent`), firing RED on the version alone.

**Cure.**
- S1 arm: add `apiPresent: glassCaps.ariaGuard`. Now the verdict (`:323`) reads the content-probe — RED only when the guard is in the INSTALLED dist AND the suppress lines are still present (the OVERDUE-and-SAFE state). With the guard ABSENT (today's 4.0.1), the arm is **PENDING** (held until the fix ships), NOT RED.
- S2 arm: add `apiPresent: glassCaps.dockStrandKeepalive` (the BEHAVIORAL kept-alive-layer probe, NOT a string grep), AND retarget `sibling.version`/`sibling.name` off the wrong `useDockClickIntegrity`-4.1.0 sentinel to the BC cut version + the collapse-crossfade keepalive cure (GU-Q2; the `sibling.name` is a human label only — the `apiPresent` truth is the behavioral probe, so no forward-named API string is required). Now S2 is PENDING until the keepalive BEHAVIOR is observed in the installed dist, not RED on the unrelated 4.1.0 publish.

The result: `proof:workaround-deletion` transitions S1+S2 from **RED → PENDING** (the false-RED is closed; the gate exits 0 because PENDING is not a failure), so `proof:hygiene` GREENS on this axis. The deletes stay correctly held until the content-probe sees the fix.

### S3 — author `scripts/proof-glassui-aria-ask.mjs` (the kf content-aware bilateral gate, the DOM-readback half)

**Breach.** glass-ui's `BD.W-CUT.md:14` references `proof:glassui-aria-ask` as the kf content-aware lock ("mounts the published pill, asserts `role=group` carries `aria-orientation===null`") — but it is ABSENT from `scripts/`. Without it, the consume gate is a version sentinel, not a content check.

**Cure (the REAL observable — a mounted-DOM readback, NOT a grep).** Author `scripts/proof-glassui-aria-ask.mjs`: MOUNT the INSTALLED glass-ui `SegmentedTabs` with `variant="pill"` (jsdom or playwright-headless over the built demo), read the rendered `role=group` element's `aria-orientation` attribute, and assert it is `null`/absent. This is the appearance/interaction-axis gate the green-source-shape-gates-miss lesson demands — it reads what the BROWSER renders, not a source shape. CI posture: a device-bearing DOM-readback (it mounts a component), so it is wired observe-only-until-publish (PENDING when the guard is absent) to avoid a false-RED stall; it flips to HARD on the consume (Q.WG-GATED-CONSUMES). **It is kept DISTINCT from `glassCaps.ariaGuard` (S1):** `glassCaps.ariaGuard` is the cheap device-INDEPENDENT dist-content grep (the role-conditional `: void 0` else arm in the installed `dist/tabs.js`) that keeps `proof:workaround-deletion` portable; this `proof:glassui-aria-ask` is the STRONGER, device-bearing mounted-DOM readback. They probe the SAME truth (the consumed dist's `role=group` carries no `aria-orientation`) at two altitudes — the dist-grep for the portable gate-correctness clause, the DOM mount for the appearance-axis consume gate. The S1 probe does NOT call this gate inline (that would make `proof:workaround-deletion` device-bearing).

### S4 — wire the gates + confirm the green axis

**Cure.** Wire `proof:glassui-aria-ask` into the gate roster (`package.json`, beside `proof:workaround-deletion`); confirm `proof:workaround-deletion` exits 0 with S1+S2 PENDING (not RED) on today's installed tree — closing the CI failure. Record the retarget in the Q gate-coverage witness (Q.WA4 `proof:wave-charter`) so the false-RED cannot silently recur.

---

## Born-RED gate

**Gate:** `proof:workaround-deletion` (the EXISTING gate, retargeted — S1/S2 gain `apiPresent: glassCaps.*`) + `proof:glassui-aria-ask` (NEW — `scripts/proof-glassui-aria-ask.mjs`, authored this wave).

**The REAL observable (a gate-correctness defect + a DOM-render readback, not a source proxy):**

| Clause | Witness on today's (2026-06-23) tree | The REAL observable | GREEN/correct condition |
|---|---|---|---|
| `s1-s2-not-false-red` (S1/S2 — the gate-correctness fix) | `node scripts/proof-workaround-deletion.mjs` → exit 1, S1=RED S2=RED ("DELETE and re-pin") while the INSTALLED dist STILL emits the prohibited attribute | the gate reds for the WRONG reason (the version published, but the FIX is not in the consumed dist) — a false-RED that FAILS `proof:hygiene` AND would green a deletion that re-breaks ARIA | with `apiPresent: glassCaps.ariaGuard`/`.dockStrandKeepalive`, S1+S2 read the installed-dist CONTENT → **PENDING** (held until the fix ships), the gate exits 0, `proof:hygiene` greens on this axis; RED returns ONLY when the guard IS in the installed dist AND the suppress is still present (the genuinely-OVERDUE state) |
| `aria-ask-content` (S3 — the bilateral DOM-readback) | `ls scripts/proof-glassui-aria-ask.mjs` → ABSENT; the installed pill emits `aria-orientation` on `role=group` | a version-number probe cannot tell whether the SFC fix is in the consumed dist — only a mounted-DOM readback of `role=group`'s `aria-orientation` can | `proof:glassui-aria-ask` MOUNTS the published `SegmentedTabs variant="pill"`, reads `role=group`'s `aria-orientation`, asserts `null`/absent — PENDING on the prohibited-emit dist, GREEN only with the SFC fix in the installed dist |

**How it is born-RED via a planted failure.**
- **`s1-s2-not-false-red` is born-RED with NO plant needed** — `proof:workaround-deletion` exits 1 with S1/S2 RED on today's tree (the missing `apiPresent` + the published 4.1.0). The CURE makes it PENDING. **The discriminating bite (the proxy-trap guard):** a "fix" that merely SILENCES the S1/S2 arms (e.g. deleting the arms, or bumping `sibling.version` to an unpublished number so `pub==="UNPUBLISHED"`→PENDING) would ALSO stop the red — but it would NOT make the gate content-aware. The bite: the retarget must read the INSTALLED dist (the `glassCaps` block), proven by a planted-fix probe — temporarily inject the guard shape into a FIXTURE installed dist → the arm content-probe flips `ariaGuard` true → with the suppress still present the arm correctly goes RED (the genuinely-OVERDUE state); remove the fixture → PENDING. A version-only retarget cannot pass this planted-content probe.
- **`aria-ask-content` is born-RED** because the gate file is ABSENT and the installed pill emits the prohibited attribute. **The discriminating bite:** a gate that greps the glass-ui SOURCE branch (`prototype/liquid-dock`) for the guard would FALSELY green (the source has the fix; the CONSUMED dist does not). The gate must mount the INSTALLED dist and readback the RENDERED attribute — proven by pointing it at the 4.0.1 dist (RED) vs a fixture dist carrying the guard (GREEN). The observable is "what the consumed component RENDERS," not "what the source branch contains."

**Portable / structural posture.** The `s1-s2-not-false-red` clause is a gate-logic correctness assertion (device-independent — BOTH `glassCaps.ariaGuard` and `glassCaps.dockStrandKeepalive` are dist-CONTENT greps over the installed dock/tabs dist + the source-tree witness; NEITHER mounts a component). The `aria-ask-content` clause (`proof:glassui-aria-ask`) is a device-bearing DOM-readback (it mounts the pill); it is wired observe-only-until-publish (PENDING when the guard is absent) so it cannot flake-RED on the slow Linux CI runner before the fix ships — the device-dependence-greening discipline. The behavioral dock-PLAY observable (`proof:live-session` S5) is likewise device-bearing and lives in the live session, SEPARATE from `proof:workaround-deletion` (which stays portable). On the consume (Q.WG-GATED-CONSUMES) the DOM/behavioral gates flip HARD.

**Green/correct condition.** `proof:workaround-deletion` exits 0 with S1+S2 PENDING (the false-RED closed, `proof:hygiene` green on this axis); `proof:glassui-aria-ask` authored + wired (PENDING on the prohibited-emit dist, ready to flip GREEN on the content-observed publish). NO suppress line is deleted here — the deletes are the GATED Q.WG-GATED-CONSUMES wave.

---

## Dependencies

- **KF-TO-GLASSUI-Q.md (Q.WG3) — the dispatch partner that defines the OBSERVABLES (not API-name strings).** The `glassCaps.dockStrandKeepalive` probe keys on the kept-alive-layer BEHAVIOR (a `pointerdown` lands on the play-control `.dock-layer` mid-crossfade), DELEGATING to `proof:live-session` S5 — so it needs NO forward-named API string from GU-Q2 (the prior "GU-Q2 names the marker" framing was an un-pre-emptable forward dependency; the behavioral observable resolves it). The `glassCaps.ariaGuard` probe delegates to GU-Q1's `proof:glassui-aria-ask` content-truth (the mounted-pill DOM readback). Both probes read installed-dist BEHAVIOR, never a sibling-chosen string.
- **Q.WA3 (master-merge-reconcile) — SEQUENCE precondition.** The gate retarget lands on a reconciled master (the deploy-of-record), so the corrected gate runs in the CI of record.
- **Q.WG-GATED-CONSUMES (the GATED deletes) — the DOWNSTREAM consumer of this retarget.** That wave deletes the S1/S2 suppress lines on the glass-ui BC publish; it RELIES on this wave's content-aware probe to fire RED→GREEN correctly (witness ABSENT, `apiPresent` true) instead of the broken version sentinel. This wave is the precondition; the deletes are GATED on the USER-DOMAIN publish.
- **B1-deploy-ci (the CI-green band) — the co-beneficiary.** `proof:workaround-deletion`'s false-RED is one of the reds blocking `proof:hygiene`/CI green; this wave closes that specific axis (the broader CI-green is Q.WA3/the deploy band).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WG-S1S2-HYGIENE — **DOCS ONLY** (inv-16: kf writes only keyframes.js; the glass-ui FIX is the sibling's, dispatched via `KF-TO-GLASSUI-Q.md`; this wave only corrects kf's OWN gate to read the installed glass-ui dist content). The IMPLEMENTATION (the `glassCaps` block, the S1/S2 `apiPresent` wiring + the S2 sibling retarget, the new `proof:glassui-aria-ask` DOM-readback gate, the roster wiring) opens ONLY on the owner's explicit authorization. It is phase NOW (executable against today's installed tree, zero sibling publish). When it opens it is:

- **gate-first** — the retarget makes the EXISTING gate content-correct BEFORE any delete; `proof:glassui-aria-ask` is authored born-RED/PENDING BEFORE the GATED deletes consume it.
- **observable-truth** — the cure reads the INSTALLED glass-ui dist CONTENT (the `glassCaps` probe) + the mounted-DOM RENDERED `aria-orientation` (the `proof:glassui-aria-ask` readback), NOT the registry version number; the appearance/interaction-axis gate the green-source-shape-gates-miss lesson demands.
- **no-legacy** — the false-RED is a gate-correctness DEFECT (a missing `apiPresent` the impl drive's P.W12 retarget never applied); closing it is restoring the gate's OWN three-state discipline (S7/S8/S9 already carry `apiPresent`), not adding a workaround.
- **no-deferral** — the gate is corrected NOW (the false-RED cannot persist as a CI-blocking chronic); the missing bilateral gate is AUTHORED NOW; the deletes are SPECIFIED (GATED, terminal-on-publish in Q.WG-GATED-CONSUMES), never punted.
- **gestalt** — the `glassCaps` block mirrors the proven `vjsCaps` installed-surface idiom; the gate speaks ONE content-aware discipline across all five arms (S1/S2 join S7/S8/S9), not a per-arm hack.

**Mid-tranche-friction pre-emption.** This wave could spawn ONE friction, RESOLVED NOW: the naive S2 design ("the `dockStrandKeepalive` marker name is unknown until GU-Q2 authors the dispatch") was an UN-pre-emptable forward dependency — the content-probe pattern cannot be written ahead of an API name that does not yet exist, and a promise to "name it later" does not unblock the probe today. **The resolution (not a pre-empt — a redesign): S2's `apiPresent` keys on the BEHAVIORAL observable, NOT an API-name string.** `glassCaps.dockStrandKeepalive` DELEGATES to `proof:live-session` S5's kept-alive-layer readback (a `pointerdown` lands on the play-control `.dock-layer` mid-crossfade), which is testable against the installed dist regardless of what glass-ui names the mechanism. So there is NO forward-named-string dependency. If glass-ui ultimately declines GU-Q2, the S2 twin stays (recorded — a glass-ui-owned defect kf cannot self-cure) and S2 holds PENDING via the behavioral probe seeing the swallow persist, never a false-RED.

The born-RED witness (the S1/S2 arms firing RED on the version alone while the consumed dist emits the prohibited attribute; the absent `proof:glassui-aria-ask`) stands on today's tree; the cure opens on authorization. Gate-first, observable-truth (the installed-dist content + the mounted-DOM readback), no-legacy, no-deferral, gestalt throughout.
