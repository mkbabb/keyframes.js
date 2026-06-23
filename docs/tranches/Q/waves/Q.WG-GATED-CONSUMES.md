# Q.WG-GATED-CONSUMES — the kf GATED atomic consume edges (Q.WG4): re-pin value.js `^1.2.0` then fire @function-inline + leaves-externalize + the S8 VJ-L1 terminal + if-multibranch; re-pin glass-ui then delete S1/S2

**Band:** G — consume (the cross-repo dispatches + GATED consumes); this is the GATED consume-orchestrator that fires each kf consume atomically on its named sibling publish.
**Phase:** **GATED** — every clause fires atomically on a NAMED sibling publish (value.js 1.2.0 for the value.js edges; the glass-ui BC cut for the S1/S2 deletes). NO clause touches kf source before its sibling surface is published + observed (`apiPresent` content-probe). The re-pin is the atomic edge that opens each band wave's consume.
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile (NOW) ─► parse-that 0.13.0 (Q.WG1) ─► value.js 1.1.1/1.2.0 (Q.WG2) ─► **Q.WG-GATED-CONSUMES** (the kf `^1.2.0` re-pin + the atomic consumes) ─► Q.WB2 (@function inline) · Q.WE2 (leaves externalize) · Q.WB3-color (SoA) · Q.WD2 (if-N) · the S8 terminal`; in parallel: `glass-ui BC publish (Q.WG3, USER-DOMAIN) ─► **Q.WG-GATED-CONSUMES** (the glass-ui re-pin + the S1/S2 deletes) ─► Q.WZ`. This wave is the SINGLE atomic re-pin point all the consume band waves hang off — it pins the surface; the band waves do the consume work.
**Owning DM / idea:** the **charter §3 friction-chain 4** ("every GATED kf consume names the EXACT sibling publish that fires it; no kf wave consumes an unpublished surface; the dispatches carry a terminal-or-KILL") + the **caret-pin observability gap** (`B6-crossrepo-versions`: "the caret pin value.js `^1.1.0` auto-consumes 1.2.0 with NO consume-edge observable — a future audit can't tell whether the 1.2.0 features are actually wired") + the **GATED-edge atomicity** (`B1-kf-s8-weakmap`, `B1-kf-emerging`, `B1-kf-soa`, `B2-pw1-lint-pw10-leaves`, `B2-pw12-dock-aria` — each names a GATED consume). Audit substrate: **B6-crossrepo-versions** (the version chain + the re-pin), **B1-kf-s8-weakmap** (the S8 VJ-L1 terminal consume), **B1-kf-emerging** (the @function-inline consume), **B1-kf-soa** (the ColorChannelPlan consume), **B2-pw1-lint-pw10-leaves** (the leaves externalize), **B2-pw12-dock-aria** (the S1/S2 deletes).

---

## Context

The owner's no-deferral mandate requires every GATED consume to be a TERMINAL atomic edge — not a perpetual "wait for the sibling" punt. The charter §3 friction-chain 4 is the discipline: each kf consume NAMES the exact sibling publish that fires it, gates on the INSTALLED surface (an `apiPresent` content-probe, not a coordination flag), and carries a terminal-or-KILL so a declined sibling ask does not strand the kf wave. This wave is the **single atomic re-pin orchestrator**: it pins the published sibling surfaces and lists every consume edge that fires on each pin, so the consume is observable (a re-pin commit + a gate flip) and atomic (no half-consumed state).

**The caret-pin observability gap (the prime motivation, `B6-crossrepo-versions`).** kf 4.4.0 pins value.js `^1.1.0`, which auto-consumes 1.1.x AND 1.2.x. The 1.1.1 catch-up (`contrast-color()`) lands transparently — correct. But the 1.2.0 perf/grammar/provenance family (VJ-Q2 egress out-param, VJ-Q4 `flatLeaf .fnName`, VJ-Q6 dashed-call, VJ-Q7 if-multibranch, VJ-Q8 `ColorChannelPlan`, VJ-Q5 `/math`) would land SILENTLY under the caret — a future audit "can't tell whether the 1.2.0 features are actually wired." The cure is an EXPLICIT `^1.2.0` re-pin (this wave) so each consume edge has a queryable observable: the pin bump + the per-edge gate flip prove the feature is consumed, not merely available.

**The two atomic re-pins (the GATED edges).**
1. **value.js `^1.1.0` → `^1.2.0`** — fires the four+ value.js consume edges (the EXPLICIT re-pin, NOT the silent caret). GATED on the value.js 1.2.0 publish (Q.WG2).
2. **glass-ui `~4.0.0` → the BC cut version** — fires the S1/S2 deletes. GATED on the USER-DOMAIN glass-ui BC publish (Q.WG3).

Each re-pin is the atomic edge; the actual consume WORK lives in the band waves (Q.WB2/Q.WE2/Q.WB3/Q.WD2/the S8 terminal/the S1-S2 deletes). This wave is the orchestrator that pins the surface + asserts the consume-edge observability — it does NOT duplicate the band waves' implementation, it GATES them on the named publish.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|----------------------------|
| the value.js caret pin | `package.json:221` | `"@mkbabb/value.js": "^1.1.0"` — auto-consumes 1.2.x silently (no consume-edge observable) |
| the glass-ui pin | `package.json:224` | `"@mkbabb/glass-ui": "~4.0.0"` — installs 4.0.1 (the prohibited-aria dist) |
| the S8 consume oracle | `scripts/proof-workaround-deletion.mjs:273` | S8 `apiPresent: vjsCaps.flatLeaf` (`'flatLeaf' in vjs`, `:151`) — flips false→true on the VJ-Q4 publish |
| the S8 ceremony sites | `src/animation/utils.ts:52,55,59,287,341` | the `FN_NAME_MAP` WeakMap + the clone-restamp ceremony (the S8 PENDING workaround) |
| the @function seam | `src/animation/resolve-values.ts:402` | the `return node` no-op `--ident(...)` arm (the @function inline seam, inert until value.js parses the call — VJ-Q6) |
| the if-N seam | `src/animation/resolve-values.ts:334-367` | `resolveIf` hard-codes the 2-branch triple (`:340-342`) + the deferral comment (`:330-332`) — generalized on VJ-Q7 |
| the leaves duplicates | `src/animation/internal/leaves.ts` (the `clamp`/`scale`/`lerp`/`lerpArray` defs + the stale comment) | the byte-duplicates externalized onto `@mkbabb/value.js/math` on VJ-Q5 (Q.WE2 Arm A) |
| the color SoA tail | `src/animation/group.ts` `buildSoAPlans` | the permanently-boxed color leaves folded through the `ColorChannelPlan` on VJ-Q8 (Q.WB3-color) |
| the S1/S2 suppress | `demo/spring/SpringSidebar.vue:43`; `AnimationControls.vue:72`; `TransportDock.vue:348-375` | the aria suppress + the dock twin deleted on the glass-ui BC publish |
| the boundary gate | `scripts/proof-boundary.mjs` (assertions 1 + 4) | the W97 `/math` clearance (Q.WE2 S2) that makes the leaves externalize legal on BOTH assertions |

---

## Scope

Each S-clause is a GATED atomic consume edge: it names the EXACT sibling publish, the kf re-pin that fires it, the consume WORK it opens (in the named band wave), the `apiPresent` observable that proves the consume, and the terminal-or-KILL fallback. NO kf source is touched before the named publish is observed.

### S1 — the value.js `^1.2.0` re-pin (the atomic edge for the value.js consume family)

**Breach.** The caret `^1.1.0` would consume 1.2.0 silently — no observable that the perf/grammar/provenance features are wired.

**Cure (GATED on the value.js 1.2.0 publish, Q.WG2).** Bump `package.json` value.js `^1.1.0` → `^1.2.0` in ONE commit. This is the atomic edge that OPENS every value.js-1.2.0 consume band wave. The re-pin is observable (the pin bump + each per-edge gate flip); a future audit reads the explicit `^1.2.0` + the green gates and KNOWS the 1.2.0 features are consumed. The re-pin is absorbed by the 5.1.x additive cut (Q.WZ).

### S2 — the @function-inline consume (Q.WB2, GATED on VJ-Q6)

**Breach.** kf's `resolve-values.ts:402` `--ident(...)` arm is an inert `return node` no-op — it cannot even born-RED until value.js parses the dashed call.

**Cure (GATED on VJ-Q6 — the dashed-call parse arm + the `<syntax>` validator exposure).** On the `^1.2.0` re-pin, Q.WB2's seam activates: bind the @function descriptor params to the call args, coerce each through value.js's published `<syntax>` validator (NO re-authored checker — inv-16), substitute, evaluate. `proof:emerging-css-resolve-fn` (Q.WB2's gate, born-RED) greens on the live jsdom lowering. **Terminal-or-KILL:** if value.js declines the call-parse, Q.WB2 KILLs to a recorded inert-seam state; if it parses but declines the validator exposure, the coercion arm KILLs to "presence-validate only" — both recorded, never a perpetual block.

### S3 — the leaves externalize consume (Q.WE2 Arm A, GATED on VJ-Q5 + the W97 clearance)

**Breach.** `internal/leaves.ts` re-implements value.js's `clamp`/`scale`/`lerp`/`lerpArray` byte-for-byte (the no-legacy duplication) — externalizable onto `@mkbabb/value.js/math` only once the boundary gate clears the subpath.

**Cure (GATED on VJ-Q5 — the `/math` `parse-that`-free contract — + the W97 boundary clearance Q.WE2 authors).** On the re-pin + the W97 GREEN (the subpath's graph verified grammar-free across BOTH boundary assertions) + the H4 external smoke-test, Q.WE2 Arm A DELETES the four duplicates + re-exports from `@mkbabb/value.js/math` + widens `vite.config.ts` external. **Terminal-or-KILL:** if W97/H4 finds the externalize mechanically fragile, Q.WE2 Arm B fires (the gate-forced honest keep with the corrected comment + the parity test) — a terminal, not a punt.

### S4 — the S8 VJ-Q4 (VJ-L1) PRIMARY terminal consume (the S8 chronic exit, GATED on VJ-Q4; the in-realm parallel-array at Q.WB3 §S6 is the FALLBACK)

**Breach.** kf's S8 WeakMap `FN_NAME_MAP` + the clone-restamp ceremony (`utils.ts:52,55,59,287,341`) is the residual the P.W11 WeakMap left — `proof:workaround-deletion` S8 PENDING (the WeakMap does not survive `ValueUnit.clone()`).

**Cure (GATED on VJ-Q4 — the `clone()`-preserved `fnName` field — the PRIMARY S8 terminal).** This consume IS the **PRIMARY** S8 terminal (per the `KF-TO-VALUEJS-Q.md` VJ-Q4 dispatch, which declares it primary under Q's no-deferral precept). On the publish + the re-pin, RETIRE the WeakMap + the ceremony: `fnNameOf(u)` reads `u.fnName` (the public field `clone()` carries); the identity-pad reads `counterLeaf.fnName`; delete the restamp on every `clone()`. `proof:workaround-deletion` S8 flips PENDING→GREEN — the `/FN_NAME|Symbol\(\s*["']kf\./` witness goes ABSENT, gated by `apiPresent: vjsCaps.flatLeaf` (`:273`) seeing the field on the installed surface. The gate-reconcile (the durable S8 ABSENT-GREEN end-state + delete the stale arm prose) rides this consume. **Terminal-or-KILL — the EXPLICIT FALLBACK:** if value.js declines VJ-Q4, the in-realm OWNER-favored parallel-array design (the audit's Option B, homed at **Q.WB3**) is the FALLBACK terminal — the two are MUTUALLY EXCLUSIVE (no double-implement), recorded so neither orphans. Q.WZ §S1, Q.WB3, and this clause state the SAME primary (VJ-Q4) + fallback (Q.WB3 parallel-array).

### S5 — the if-multibranch consume (Q.WD2, GATED on VJ-Q7)

**Breach.** kf's `resolveIf` (`resolve-values.ts:334-367`) hard-codes the 2-branch triple; the >2-branch case is blocked on value.js's lossy collapse.

**Cure (GATED on VJ-Q7 — the FULL ordered clause list, the flat-pair layout specified in `KF-TO-VALUEJS-Q.md`).** On the re-pin, Q.WD2 generalizes `resolveIf` from the hard-coded triple to walk the N-branch clause list. The common 2-branch ships NOW (already parses); the >2-branch consume fires on the publish. `proof:emerging-css` (Q.WD2's clause) greens on a 3-branch `if()` resolving the correct middle. **Terminal-or-KILL:** the 2-branch path is unaffected if value.js declines (it already works); the N-branch arm KILLs to a recorded inert state.

### S6 — the ColorChannelPlan SoA consume (Q.WB3-color, GATED on VJ-Q8)

**Breach.** kf's compositor permanently boxes the color/computed leaf tail (a `Color` cannot live in a `Float64Array`).

**Cure (GATED on VJ-Q8 — the `ColorChannelPlan` + `lerpColorChannels`).** On the re-pin, Q.WB3-color folds the color leaves through the published plan instead of per-element `Color` boxing. `proof:color-soa` (Q.WB3's gate, born-RED) greens on the consume. **Terminal-or-KILL:** if value.js declines the plan, the color tail ships BOXED (recorded) — never a perpetual block (the numeric SoA arm is fully in-realm, NOW).

### S7 — the glass-ui re-pin + the S1/S2 deletes (GATED on the glass-ui BC publish, USER-DOMAIN)

**Breach.** kf carries the aria suppress (`SpringSidebar.vue:43` + `AnimationControls.vue:72`) + the dock twin (`TransportDock.vue:348-375`) — band-aids for glass-ui defects.

**Cure (GATED on the glass-ui BC publish — GU-Q1 aria guard + GU-Q2 dock keepalive, the content-observed cut).** On the BC publish (observed by Q.WG-S1S2-HYGIENE's content-aware `glassCaps` probe, NOT the version sentinel): re-pin `package.json` glass-ui `~4.0.0` → the cut version (consume-and-delete in ONE atomic wave — the no-orphan-pin discipline); DELETE the S1 suppress lines + the S2 dock twin. `proof:workaround-deletion` S1+S2 flip PENDING→GREEN (witness ABSENT, `apiPresent` true on the content-probe); `proof:glassui-aria-ask` flips GREEN (the mounted pill renders `aria-orientation === null`); `proof:live-session` S5 confirms a dock-PLAY produces motion. **Terminal-or-KILL:** the glass-ui CUT is USER-DOMAIN (confirm-first); if it does not ship during Q, the deletes stay GATED (the band-aids stay, recorded as a glass-ui-owned defect kf cannot self-cure), never a false-RED — the false-RED itself is already cured by Q.WG-S1S2-HYGIENE.

### S8 — the consume-edge observability witness

**Cure.** Author/extend a `proof:consume-edges-pinned` clause (or fold into Q.WA4's `proof:wave-charter` / the pin-ledger witness): assert kf pins value.js `^1.2.0` (not the silent caret on `^1.1.0`), the glass-ui BC cut version, and parse-that transitively `^0.13.0` (through value.js) — so each consume edge is a queryable observable, not a silent caret consume. This closes the `B6-crossrepo-versions` observability gap.

---

## Born-RED gate

**Gate:** the per-edge band-wave gates (each born-RED in its own wave — `proof:emerging-css-resolve-fn` [S2], the W97 `proof:boundary` clause + `proof:no-cross-realm-cast` [S3], `proof:workaround-deletion` S8 [S4], `proof:emerging-css` if-N [S5], `proof:color-soa` [S6], `proof:workaround-deletion` S1/S2 + `proof:glassui-aria-ask` [S7]) + the orchestrator's `proof:consume-edges-pinned` (S8, NEW).

**The REAL observable (a runtime consume + a pin observability, not a coordination flag):**

| Clause | Witness on today's (2026-06-23) tree | The REAL observable | GREEN condition |
|---|---|---|---|
| `value-pin-explicit` (S1/S8) | `package.json:221` value.js `^1.1.0` — the caret consumes 1.2.0 silently | a silent caret consume leaves NO observable that the 1.2.0 features are wired — a future audit cannot tell | `package.json` pins value.js `^1.2.0` explicitly + every value.js consume gate (S2/S4/S5/S6) green — the pin + the flips PROVE the consume |
| `function-inline-consumed` (S2) | `resolve-values.ts:402` is an inert `return node` no-op; `--double(2)` reaches the frame verbatim | the @function call does not parse → the inline arm cannot fire | on VJ-Q6 + the re-pin, `resolveKeyframes('@function --double(--x){…} … --double(2)')` resolves the doubled concrete value off the compiled frame (live jsdom, not a grep) |
| `leaves-externalized` (S3) | `internal/leaves.ts` carries the four byte-duplicates + the stale comment | the duplication is a no-legacy violation held by a comment that mis-states the reason | on VJ-Q5 + the W97 clearance + the re-pin, the four duplicates DELETED, re-exported from the verified-clean `/math` subpath, `proof:boundary` GREEN on BOTH assertions (Arm A) OR the gate-forced documented keep (Arm B) |
| `s8-terminal` (S4) | `proof:workaround-deletion` S8 PENDING — the `FN_NAME_MAP` WeakMap + the ceremony at `utils.ts:52,55,59,287,341` | the foreign-stamp is realm-clean but the clone-restamp ceremony persists (the WeakMap does not survive `clone()`) | on VJ-Q4 + the re-pin, the WeakMap + the ceremony DELETED; `fnNameOf` reads `u.fnName`; S8 flips PENDING→GREEN (witness ABSENT, `apiPresent: vjsCaps.flatLeaf` true) |
| `if-n-consumed` (S5) | `resolveIf` hard-codes the 2-branch triple (`:340-342`) | a 3-branch `if()` resolves the WRONG branch (the middle is dropped) | on VJ-Q7 + the re-pin, `resolveKeyframes` over a 3-branch `if()` resolves the correct middle branch |
| `color-soa-consumed` (S6) | `buildSoAPlans` boxes every color leaf | the color tail is permanently per-element `Color`-boxed | on VJ-Q8 + the re-pin, `proof:color-soa` greens — the color leaves fold through the `ColorChannelPlan`, bit-exact vs the boxed lerp |
| `aria-dock-deleted` (S7) | the S1/S2 suppress + the dock twin live; `proof:workaround-deletion` S1/S2 PENDING (post-hygiene-retarget) | the band-aids mask glass-ui defects the consumed dist still has | on the glass-ui BC publish + the re-pin, the suppress + twin DELETED; S1/S2 GREEN (`proof:glassui-aria-ask` mounts the pill → `aria-orientation === null`; `proof:live-session` S5 dock-PLAY produces motion) |

**How it is born-RED via a planted failure.** Each edge is born-RED in its own band wave (the per-edge gate fails on today's tree — the inert seam, the duplicate, the PENDING arm, the boxed tail, the band-aid). The orchestrator's `value-pin-explicit` clause is born-RED because `package.json` pins `^1.1.0` (the silent caret). **The discriminating bite (the proxy-trap guard):** a "consume" that bumps the pin to `^1.2.0` WITHOUT actually wiring a feature (the silent-caret trap, but explicit) still reds the per-edge gates (the inert seam / the duplicate / the PENDING arm persist) — the pin bump alone does not green the edge gates; only the runtime consume (the live lowering, the deleted duplicate, the absent ceremony, the folded color, the deleted band-aid) greens them. The observable is "the feature is RUNTIME-consumed," not "the pin is bumped."

**Portable / structural posture.** The consume gates are runtime/structural (live jsdom lowerings, source-grep absences, bundle-graph assertions, mounted-DOM readbacks) — device-independent by construction. The `proof:glassui-aria-ask` mounted-DOM readback (S7) is device-bearing; it is wired HARD only on the consume (before that, Q.WG-S1S2-HYGIENE holds it observe-only/PENDING) so it cannot flake-RED before the fix ships.

**Green condition.** value.js pins `^1.2.0` explicitly; every value.js consume edge green (S2 @function-inline, S3 leaves-externalize, S4 S8-terminal, S5 if-N, S6 color-SoA); glass-ui re-pinned to the BC cut + S1/S2 deleted (S7); `proof:consume-edges-pinned` confirms the observable pins (S8). Each consume is a runtime fact + an explicit pin, not a silent caret.

---

## Dependencies

- **Q.WG1 (parse-that 0.13.0) → Q.WG2 (value.js 1.1.1/1.2.0) — the cross-repo publish chain that precedes the value.js re-pin.** The `^1.2.0` re-pin (S1) consumes the value.js 1.2.0 publish; the dispatches (`KF-TO-PARSETHAT-Q.md`, `KF-TO-VALUEJS-Q.md`) carry a terminal-or-KILL so each GATED edge cannot become a perpetual punt (charter §3 friction-chain 4).
- **Q.WG3 (glass-ui BC, `KF-TO-GLASSUI-Q.md`) — the USER-DOMAIN publish that fires the S1/S2 deletes (S7).** GATED on the content-observed cut (GU-Q1 aria guard + GU-Q2 dock keepalive), not the version number.
- **Q.WG-S1S2-HYGIENE (NOW) — the precondition for S7.** It retargets the S1/S2 arms to content-aware `glassCaps` probes + authors `proof:glassui-aria-ask`, so S7's deletes fire RED→GREEN correctly (witness ABSENT, `apiPresent` true) instead of the broken version sentinel. The hygiene wave lands FIRST (NOW); the deletes are GATED here.
- **The band waves do the consume WORK (Q.WB2, Q.WE2, Q.WB3-color, Q.WD2, the S8 terminal, the S1/S2 deletes).** This wave is the atomic re-pin ORCHESTRATOR — it pins the surface + asserts the consume-edge observability; it does NOT duplicate the band waves' implementation. Each band wave's born-RED gate is the per-edge proof; this wave gates them on the named publish.
- **Q.WA3 (master-merge-reconcile) — SEQUENCE precondition.** The re-pins land on a reconciled master (the deploy-of-record), so the consume is live-correct.
- **Q.WZ (the 5.1.x additive cut) — the honest home for the consume re-pins.** The value.js `^1.2.0` + glass-ui BC re-pins are additive (no public-surface break); they are absorbed by the 5.1.x minor at Q.WZ (the 5.0.0 breaking cut is the alias-drop, a DISJOINT Band-E concern).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WG-GATED-CONSUMES (Q.WG4) — **DOCS ONLY** (inv-16: kf writes only keyframes.js; every consumed surface is a SIBLING's, dispatched via the three `KF-TO-*-Q.md` packets; this wave only pins the published surface + gates the kf consume band waves on it). The IMPLEMENTATION (the value.js `^1.2.0` re-pin + the glass-ui BC re-pin + the per-edge consume work in the named band waves + the `proof:consume-edges-pinned` witness) opens ONLY on the owner's explicit authorization, per-edge, on the NAMED sibling publish. It is phase GATED — no kf source is touched before each sibling surface is published + content-observed. When it opens it is:

- **gate-first** — every consume edge's gate is authored born-RED in its band wave BEFORE the consume; the pin bump alone does not green an edge (the runtime consume does).
- **observable-truth** — each consume is a RUNTIME fact (the live lowering, the deleted duplicate/ceremony/band-aid, the folded color, the mounted-DOM readback) + an EXPLICIT pin (the queryable consume-edge observable, NOT a silent caret); the `apiPresent` content-probe reads the INSTALLED sibling surface, not a coordination flag.
- **no-legacy** — each consume RETIRES a workaround (the inert seam → the live arm; the duplicate → the externalized edge; the WeakMap+ceremony → the public field; the boxed tail → the folded plan; the band-aids → the deleted suppress) — no dead parallel, no half-consumed state.
- **no-deferral** — every GATED edge names the EXACT publish that fires it + carries a terminal-or-KILL (the @function arm KILLs to inert; the leaves fall to Arm B; the S8 falls to the in-realm parallel-array; the color tail ships boxed; the S1/S2 band-aids stay recorded) — no perpetual GATED stall. The caret-pin observability gap is CLOSED (the explicit `^1.2.0` + the witness).
- **gestalt** — ONE atomic re-pin point per sibling (the value.js `^1.2.0`, the glass-ui BC cut) fires every consume band wave; the consume discipline is uniform (re-pin → content-probe → runtime consume → gate flip), not a per-feature scramble.

**Mid-tranche-friction pre-emption.** This wave could spawn TWO frictions, each pre-empted NOW:
1. **The double-re-pin** (`B6-crossrepo-versions`: "if 5.0.0 ships before value.js 1.2.0 is published, the 1.2.0 consume would force a SECOND re-pin"). **Pre-empted by sequencing:** the value.js `^1.2.0` re-pin (S1) is absorbed by the 5.1.x ADDITIVE cut (Q.WZ), DISJOINT from the 5.0.0 breaking alias-drop (Band E); the master-merge (Q.WA3) lands FIRST so both re-pins land on a reconciled master in one coherent sequence — no second re-pin.
2. **The unpublished-surface consume** (the inv-16 / DAG-ordered violation — a kf wave consuming a not-yet-published sibling API). **Pre-empted by the per-edge `apiPresent` gate + the terminal-or-KILL:** no clause touches kf source before the named publish is content-observed; each dispatch carries a terminal-or-KILL so a declined sibling ask falls to a recorded terminal (KILL/Arm-B/in-realm-fallback/boxed), never a perpetual block.

The born-RED witness (the silent caret pin; the inert @function seam; the leaves duplicates; the PENDING S8; the 2-branch `resolveIf`; the boxed color tail; the live S1/S2 band-aids) stands on today's tree; each consume opens atomically on its named sibling publish. Gate-first, observable-truth (the runtime consume + the explicit pin), no-legacy, no-deferral (every edge terminal-or-KILL), gestalt throughout.
