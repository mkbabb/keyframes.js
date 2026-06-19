# O.WZ — Close + the 5.0.0 cut (the tranche terminal · the live-byte deploy oracle)

**Band:** Z — Close + the 5.0.0 cut
**Phase:** NOW-author · USER-DOMAIN publish (the LAST wave — author the gates + the close docs NOW; the version cut + both npm publishes are USER-DOMAIN — Mike Babb fires the tag)
**Sequence:** O.W0…O.W16 all at terminal disposition → *(Band A+B+C+D.W8+D.W9 GREEN) + (Band F on the BC cut) + (Band G on value.js P)* → **O.WZ close** → USER-DOMAIN `v5.0.0` tag → `release.yml` publish → `deploy-pages.yml` round-trip observed
**Owning chronic/DM:** DM-7 keyframes-vue (3-tranche, USER-DOMAIN) · DM-16 5.0.0 cut (2-tranche, USER-DOMAIN) · DM-20 deploy round-trip (2-tranche, USER-DOMAIN + HANDOFF) · DM-6 Oscillator-on-npm (DO-6) · the M→O ledger re-point (the substrate transition); the VERIFY-ONLY/RE-AFFIRM roster (DM-8…DM-15) re-verifies here

---

## Context

O.WZ is the tranche terminal. By the time it runs, the M-as-built delta (O.md §1) has been closed: Bands A→C + D.W9 built the bulk of the value (lint tier, ledger hygiene, the NaN-frame cure, the multi-color refusal, the two 7-tranche chronics built-in, the no-legacy alias purge), D.W8 closed perf, Band F consumed the glass-ui BC cut, and Band G consumed value.js P. O.WZ does the close: it cuts **5.0.0** (the no-legacy renames are breaking — a MAJOR), ensures the Oscillator and the full L+M additive-export tail reach the **published** dist, re-points the chronic ledger M→O, fires both USER-DOMAIN publishes, and observes the deploy round-trip as **live-byte equality** — the bytes the site serves, not a gate exit code.

The audit grounds every one of these in live file:line evidence (lanes B7, D19, D20, G31):

### The npm freeze — everything since K is local-only

The registry is frozen at **4.3.0** (Tranche K close, tag `4737ab39`, ~40 commits ago; `npm view @mkbabb/keyframes.js dist-tags` → `{ latest: '4.3.0' }`, verified live 2026-06-19). Every feature since — the Oscillator (added at L.W9 `791b3bd`, NOT an ancestor of `v4.3.0`), the constellation consume (value.js 1.0.2 + parse-that 0.11.0), the new M/O gates, the keyframes-vue adapter — is **local-only** (audit G31). The published 4.3.0 tarball's export line has neither `Oscillator` nor `waveformValue` (audit D20: `grep Oscillator /tmp/package/dist/keyframes.js` on the extracted 4.3.0 tarball → zero hits; the LOCAL `dist/keyframes.d.ts` carries 17 hits). Eight additive LIGHT exports share this publish gap: `Oscillator`, `waveformValue`, `KeyframesScrollTimeline`, `drag2D`, `warmEngine`, `loadEngine`, `loadCompiler`, `loadIngest` (audit D20). The 5.0.0 cut ships all eight atomically.

### The FOUR breaking renames + the multi-color refusal — confirmed on the 4.3.0 tree

The no-legacy renames (O.W9) are `@deprecated`/`BREAKING (5.0.0)` annotated in source TODAY (verified this session):

| # | Symbol | Old → New | Source location (verified) | Surface |
|---|--------|-----------|----------------------------|---------|
| 1 | class | `Animation` → `KeyframesAnimation` | `engine.ts:1192` (`@deprecated Renamed to {@link KeyframesAnimation} in 5.0.0`) | HEAVY |
| 2 | class | `ScrollTimeline` → `KeyframesScrollTimeline` | `timeline.ts:209` (`@deprecated … in 5.0.0`) | LIGHT |
| 3 | interface | `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` | `timeline.ts:163` (`@deprecated … in 5.0.0`) | LIGHT type |
| 4 | preset | `presets.flip` → `presets.flipPreset` | `animations.ts:133` (`BREAKING (5.0.0): the access path is now…`) | HEAVY |

Plus a fifth, behavioural break: `compileToCSS` REFUSES multi-color (was silently-lossy `eligible:true`) — the O.W4 multi-color refusal semantic. `release.yml` runs `proof:boundary → proof:published-surface → proof:deps-current → proof:peer-satisfied → npm publish` (verified `release.yml:59–83`) — **NO CHANGELOG completeness gate**. A publish with an absent or under-counted CHANGELOG is currently un-blocked.

### `proof:changelog-5.0.0` is ABSENT

`ls scripts/proof-changelog*` → **no matches** (verified live: zsh "no matches found"). The gate that asserts the breaking set against `CHANGELOG.md` does not exist. (`CHANGELOG.md` itself IS present — so the gate has a real file to read; its 5.0.0 entries are what's absent.) This is the M.WZ-developed-but-unbuilt gate (audit D20: `proof:changelog-5.0.0 gate is unauthored`, BLOCKER·deferred).

### The TWO auto-deploy tripwires (the inv-eps overclaim corrected)

The AUTO round-trip (CI → `deploy-pages.yml`) is permanently blocked by **two** born-RED tripwires in the CI `check-failures` step — NOT one (audit D19 corrects the prior "sole deploy blocker" inv-eps overclaim; `proof:peer-satisfied` is now GREEN on glass-ui 4.0.1):

1. **`proof:control-point-live` (DM-2)** — exits NON-ZERO today by design (`scripts/proof-control-point-live.mjs:30` "exits NON-ZERO today by design"; ZERO `GlassControlPoint` in the installed glass-ui dist; BC decided NO). **Retired in O.W5** (the `DemoControlPoint` build-in re-points or retires this gate). Resolved BEFORE O.WZ — it is NOT an O.WZ obligation, but the close must record it cleared.
2. **`proof:keyframes-vue-published` (DM-7)** — clause (b) RED-by-design (E404; `scripts/proof-keyframes-vue-published.mjs:121` "STAYS RED until the user runs `npm publish` in packages/keyframes-vue/"; `PEER_FLOOR = "4.3.0"` at `:63`). **Resolved HERE** — the USER-DOMAIN keyframes-vue publish (the second deploy-blocker). `packages/keyframes-vue/package.json:3` is `0.1.0`; peer floor `>=4.3.0` (`:35,:40`).

`deploy-pages.yml` fires as a `workflow_run` consequence of CI `conclusion == 'success' && head_branch == 'master' && event == 'push'` (`deploy-pages.yml:44–46`). With BOTH tripwires cleared, CI concludes `success` and the auto round-trip fires.

### The chronic-closure substrate is still pointed at L

`scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md` (verified). M's `M/PROGRESS.md §"Open deferrals"` is the authoritative parse target through O's dev phase (the M.WZ re-point was DEVELOPED, never IMPLEMENTED — the M campaign shipped only its slice). O.WZ executes the **M→O** re-point: `CHRONIC_LEDGER` → `docs/tranches/O/PROGRESS.md §"Open deferrals"` (the O substrate is authored — §2 of `O/PROGRESS.md`, the DM/DO rows). The `LEDGER_LABEL` stale-text correction (DO-3) was an O.W2 obligation; the re-point is the O.WZ atomic final motion, proven non-vacuous by the planted-row RED discipline.

### Audit evidence

| Lane / ref | Source location | Fact (live-probed 2026-06-19) |
|---|---|---|
| D20, G31 | `npm view @mkbabb/keyframes.js dist-tags` | `{ latest: '4.3.0' }` — frozen at K close; 40 commits local-only |
| D20 | `/tmp/package/dist/keyframes.js` (extracted 4.3.0 tarball) | export line has NEITHER `Oscillator` NOR `waveformValue` |
| D20 | `src/animation/index.ts:74–75` | `export { Oscillator, waveformValue }` + `export type { OscillatorConfig, OscillatorWaveform }` — LIGHT barrel, present locally |
| D20 | `docs/published-surface.md:39–40` | `Oscillator` + `waveformValue` manifest-only rows — `proof:published-surface` clause (b) covers them |
| G31, M.WZ | `engine.ts:1192`, `timeline.ts:209`, `timeline.ts:163`, `animations.ts:133` | the FOUR `@deprecated`/`BREAKING (5.0.0)` annotations — verified this session |
| D20, G31 | `ls scripts/proof-changelog*` | **no matches** — the gate is ABSENT |
| — | `ls CHANGELOG.md` | present — the gate has a real file to read |
| D19 | `.github/workflows/release.yml:59–83` | publish roster has NO changelog gate |
| D19 | `.github/workflows/release.yml:103–129` | `publish-keyframes-vue` job (`needs: publish`) — AUTHORED, USER-DOMAIN, never fired |
| D19 | CI `check-failures` (ci.yml:1595–1596) | both `proof-keyframes-vue-published` (E404) + `proof-control-point-live` (exit 1) block the auto round-trip |
| D19 | `scripts/proof-keyframes-vue-published.mjs:63,:121` | `PEER_FLOOR = "4.3.0"`; clause (b) RED-by-design until USER-DOMAIN publish |
| D19 | `deploy-pages.yml:44–46` | `workflow_run` success on master push → auto round-trip |
| G31 | `scripts/proof-chronic-closure.mjs:114` | `CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md` — re-pointed M→O here |
| precedent | commit `4f1fc4c` (J-close) | the live-byte oracle SHAPE: `CI <run-id> → deploy <run-id> → live serves index-<hash>.js exact` |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they close O: the 5.0.0 changelog gate authored over the corrected breaking-change count + wired into the publish path; the Oscillator (+ the additive tail) gated into the PUBLISHED surface; the version cut + both publishes triggered; the chronic ledger terminated M→O non-vacuously; the VERIFY-ONLY roster re-verified on the O dist; and the deploy round-trip observed with EXACT live bytes.

### S1 — Author `proof:changelog-5.0.0` (born-RED, gate-first, TODAY)

**Breach.** `proof:changelog-5.0.0` does not exist; `release.yml` has no CHANGELOG completeness gate; a publish with an under-counted CHANGELOG is un-blocked (audit D20 BLOCKER).

**Cure.** Author `scripts/proof-changelog-5.0.0.mjs` (wired into `package.json` scripts + `release.yml` as a pre-`npm publish` step). It reads `CHANGELOG.md` (or the changeset files) and asserts an entry exists for EACH of the FIVE breaking changes — REDs on any missing entry:

| Clause | Asserts present | Source anchor the entry must name |
|---|---|---|
| (a) | `Animation → KeyframesAnimation` | `engine.ts:1192` |
| (b) | `ScrollTimeline → KeyframesScrollTimeline` | `timeline.ts:209` |
| (c) | `ScrollTimelineOptions → KeyframesScrollTimelineOptions` | `timeline.ts:163` |
| (d) | `presets.flip → presets.flipPreset` | `animations.ts:133` |
| (e) | multi-color compile refusal (`compileToCSS` REFUSES, was `eligible:true`) | `compile-color.ts` (O.W4) |

**Non-proxy discipline.** The gate reads the REAL CHANGELOG content and asserts the REAL breaking-change entries — there is NO source-grep stand-in. It must ALSO cross-check the source annotation still exists (each rename's `@deprecated`/`BREAKING` line is present) so a CHANGELOG entry for a rename that was never made REDs too — the gate cannot go stale in either direction.

**Wire it into `release.yml`.** Add the gate as a step in the `publish` job before `publish (with provenance)` (`release.yml:82`), so a 5.0.0 publish with an incomplete CHANGELOG is BLOCKED, not merely flagged locally.

### S2 — Oscillator (+ the additive tail) gated into the PUBLISHED surface

**Breach.** The Oscillator is in the LOCAL dist + manifest but absent from npm@4.3.0; no gate reads the registry to assert it landed (audit D20). BC is building a glass-ui-local `useOscillator` mirror as interim (`WAVE-IMPACTS.md:470`) — a no-workaround precept violation the moment kf ships to npm. The picker-loop seam (`useEasingPicker.ts`) BOOKED interim and BC.W-VIZ-CHOREOGRAPHY's four-beat clock book the kf republish.

**Cure.** `proof:published-surface` already gates the Oscillator on the LOCAL dist (clause (b): the manifest rows `docs/published-surface.md:39–40` + the barrel `index.ts:74–75`; the four-clause sanity floor + the manifest-vs-source cross-check). The 5.0.0 cut carries the Oscillator + the eight-export tail into the tarball atomically — **the cut IS the gate**: `npm pack --dry-run` (clause (a)) measures the built dist, and the version bump makes that dist the published tarball. NO separate `proof:npm-surface` registry-delta gate is required for the cut (a born-RED "local-ahead-of-npm" gate is optional hardening — audit D20 recommendation #3 — but the cut itself closes the gap). The deliverable: confirm `proof:published-surface` is GREEN on the 5.0.0-cut dist with the Oscillator clause present (the manifest row exists; the barrel export resolves; the d.ts roll-up carries `Oscillator`).

**Constraint (the manifest-vs-source cross-check, clause (b) at `proof-published-surface.mjs:391–397`).** A manifest row naming a non-existent export REDs; an export taught nowhere REDs. The Oscillator/waveformValue rows must stay aligned to the barrel through the cut — if O.W9's no-legacy purge or the 5.0.0 d.ts rename touches the export set, the manifest follows in the SAME commit.

### S3 — `proof:chronic-closure` re-pointed M→O (non-vacuous, ONE atomic motion)

**Breach.** `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md` — the M.WZ re-point was developed, never implemented; M's ledger is the authoritative parse target through O's dev phase (audit G31; `O/PROGRESS.md` §"SUBSTRATE-TRANSITION NOTE").

**Cure (the ORCHESTRATOR'S ATOMIC FINAL MOTION).** Re-point `CHRONIC_LEDGER` from `docs/tranches/L/PROGRESS.md` to `docs/tranches/O/PROGRESS.md §"Open deferrals"` (the O substrate — the DM/DO rows in `O/PROGRESS.md` §2) in ONE motion, simultaneously with the O ledger becoming authoritative + TERMINAL.

**Non-vacuity protocol (the K.WZ/L.WZ/M.WZ precedent; the gate's own rule set `proof-chronic-closure.mjs:110–111`).** The transition MUST be proven non-vacuous: the gate RED on three deliberately-malformed planted O-ledger rows — one of each failing clause shape — BEFORE the clean terminal O ledger greens it:

```
# Planted row 1 — FOLD citing a source-shape gate
| DO-PLANT-1 | O | 1 (O) | FOLD → O.W0 | O.W0 | `proof:boundary` (source-shape grep) |
```
→ must RED: `[runtime-band] FOLD row 'DO-PLANT-1' cites a source-shape gate 'proof:boundary' — not a RUNTIME gate`.

```
# Planted row 2 — HANDOFF targeting an unpublished future version
| DO-PLANT-2 | O | 1 (O) | HANDOFF → value.js 2.0.0 | O.W16 | value.js 2.0.0 not yet on npm |
```
→ must RED: `[tripwire] HANDOFF row 'DO-PLANT-2' targets an unpublished sibling version — tripwire is not a published-consume-edge`.

```
# Planted row 3 — bare BOOK, chronicity ≥4
| DO-PLANT-3 | E (E..O) | 9 (E..O) | BOOK (future decide) | — | — |
```
→ must RED: `[p-invariant-28] bare BOOK row 'DO-PLANT-3' has chronicity 9 ≥ 4 — must EXIT (FOLD/HANDOFF/KILL/OUT), not BOOK`.

**Procedure (ONE atomic commit).** (a) plant the three malformed rows in `O/PROGRESS.md §"Open deferrals"`; (b) `node scripts/proof-chronic-closure.mjs` — confirm RED on all three; (c) remove the planted rows + confirm GREEN on the clean terminal O ledger; (d) in the SAME commit, re-point `CHRONIC_LEDGER` M→O **and** correct `LEDGER_LABEL` to the O-tranche text (the DO-3 stale-text fix carried forward if O.W2 did not land it). Re-point + non-vacuity proof + O ledger terminal are ONE commit. Output: `✓ proof:chronic-closure — the O ledger is TERMINAL`.

**The P-invariant-28 belt at O close.** No ≥4-tranche row may enter O.WZ as a bare BOOK. The two 8-tranche ABSOLUTES (DM-2 DemoControlPoint, DM-3 fromMorphSVG) EXITED via BUILD-IN (O.W5/O.W6 commit hashes recorded). The 5-tranche DM-1 RF-17 EXITED via HANDOFF-consume on the BC cut (O.W12). The VERIFY-ONLY/RE-AFFIRM roster (DM-8…DM-15) is TERMINATED — GREEN gate + documented born-RED provenance IS the exit form. A row entering O.WZ without a named tripwire + a born-RED kf gate is a P-invariant-28 VIOLATION; the close does not proceed.

### S4 — keyframes-vue publish + peer floor (USER-DOMAIN, the second deploy-blocker DM-7)

**Breach.** `proof:keyframes-vue-published` clause (b) is RED-by-design (E404; `:121`); the adapter is `0.1.0` with peer floor `>=4.3.0` (`packages/keyframes-vue/package.json:3,:35,:40`). This is the SECOND auto-deploy tripwire (DM-7) — until it publishes, CI `check-failures` REDs and `deploy-pages.yml` cannot fire (audit D19).

**Cure (USER-DOMAIN — Mike Babb fires).** Before the cut: bump the keyframes-vue peer floor + `PEER_FLOOR` constant from `4.3.0` to `5.0.0` — `packages/keyframes-vue/package.json` `peerDependencies['@mkbabb/keyframes.js']` → `>=5.0.0` (and the `devDependencies` line `:40`), plus `scripts/proof-keyframes-vue-published.mjs:63` `PEER_FLOOR = "5.0.0"` (audit D19/D20 recommendation; inert doc/gate changes that must PRECEDE the publish to keep clause (c) correct post-cut). The `publish-keyframes-vue` job (`release.yml:103–129`, `needs: publish`) fires on the `v5.0.0` tag AFTER the core publish. Add the npm-install retry/delay step (audit D19 recommendation) to mitigate registry-propagation lag — the adapter installs the freshly-published `5.0.0` peer from the registry.

**The pre-cut compat check.** Run `npm run check` in `packages/keyframes-vue/` against the 5.0.0 named types before the cut — if the adapter source references the OLD names directly (not through `loadAnimationEngine()`'s return type), the check fails on the version-cut tree. An un-verified pre-cut obligation, not an assumption.

**Gate bite.** `proof:keyframes-vue-published` clause (b) flips E404 → GREEN once the `0.1.0`-or-higher tarball lands on the registry. The CI `check-failures` step then drops this tripwire — the second blocker cleared (the first, `proof:control-point-live`, was cleared in O.W5).

### S5 — the 5.0.0 version cut (USER-DOMAIN — the criteria proposed, the user fires)

**Breach.** `package.json:3` is `4.3.0`; the registry latest is `4.3.0`. The 8 additive LIGHT exports + the FOUR renames + the multi-color refusal are local-only (audit D20/G31).

**Cure (USER-DOMAIN).** The agent proposes the criteria; the user fires the cut. The case for MAJOR `5.0.0`: the four type renames change the d.ts canonical names (a `Animation` import from a 4.x consumer now resolves the deprecated alias, the canonical name is `KeyframesAnimation`); the multi-color refusal is a SEMANTIC CONTRACT BREAK (a consumer shipping multi-color with `eligible:true` now gets a refusal); keyframes-vue is a net-new published package. The chosen string is RECORDED in a one-paragraph version-decision note BEFORE `changeset version` cuts it. The cut carries all eight additive exports into the tarball atomically (S2). The FINAL cites the OBSERVED `package.json` version + the registry presence AFTER the user fires the tag — NEVER asserts `5.0.0` shipped before the cut is observed.

**The cut/deploy decoupling.** The deploy round-trip (S6) is SEPARATELY sequenced from the npm publish. The close-merge → auto-deploy fires on Band F's BC re-pin landing (the `proof:peer-satisfied` blocker is on the close-merge path); the `v5.0.0` tag fires the separate `release.yml` publish jobs. They occur in either order (the J/K precedent is deploy-first, publish-second — the version bump is not needed to serve the demo). The BC consume (Band F) MUST be done before the cut so the published surface is the converged tree (audit G31 recommendation: "do NOT bump the version prematurely before the BC consume is done").

### S6 — `proof:all` GREEN + the deploy round-trip as LIVE-BYTE equality

**Gate.** `npm run proof:all` GREEN on the O close tree (`package.json:195` `run-all.mjs --all` — the consolidated O runner). This is the deploy signal.

**Deploy round-trip re-observation (the live-byte oracle — observable-truth applied to the DEPLOY, not the gate exit code).** The round-trip is OBSERVABLE only AFTER BOTH auto-deploy tripwires clear: `proof:control-point-live` retired in O.W5, `proof:keyframes-vue-published` GREEN via S4. The oracle, each link OBSERVED:

1. `proof:all` GREEN on the consolidated O runner — observe the run.
2. Close-merge to `master` → CI run N GREEN (the `demo-smoke` `check-failures` step no longer adds the two tripwires to `$failed`) — observe the run ID.
3. `deploy-pages.yml` fires as a `workflow_run` consequence (`conclusion == 'success' && head_branch == 'master' && event == 'push'`, `deploy-pages.yml:44–46`) — observe the run ID.
4. The live `keyframes.babb.dev` `index-<hash>.js` filename equals the freshly-built `dist/gh-pages` hash for the merge SHA — observe the hash equality.

The FINAL cites all four with their run IDs / filenames — never an assertion, always an oracle.

**The keystone constraint (inv-O-observable-truth on the deploy).** The deploy is "observed" ONLY when the live-served `index-<hash>.js` is shown EQUAL to the freshly-built artifact for the merge SHA — the J-close shape (`4f1fc4c`: `CI <run-id> → deploy <run-id> → live serves index-<hash>.js exact`). **A green local `proof:all` is NOT the deploy claim:** local `proof:all` excludes `proof:peer-satisfied` (which runs only on the publish/CI path), so local green can coexist with CI red and a stale site. The REAL observable is the bytes the site serves, fetched from the live URL, not the exit code of any gate.

### S7 — the close docs (O/FINAL.md + the VERIFY-ONLY re-verify + the prompt-recap)

**Deliverable:** `docs/tranches/O/FINAL.md` — the O boundary close report, held to inv-O-observable-truth (every boundary claim CITES its observed oracle).

- **The VERIFY-ONLY / RE-AFFIRM roster re-verified on the O dist (DM-8…DM-15).** Each carried K-chronic is TERMINATED; the O obligation is RE-VERIFY the GREEN state on the 5.0.0-cut dist. Re-run `proof:lighthouse-mobile` (DM-8, `KF_REQUIRE_LH=1`), `proof:specular-absent-at-rest` (DM-9), `proof:font-census` (DM-10), `proof:spring-slider-continuous` + `proof:subject-animates` (DM-11), `proof:perf-frame-budget` (DM-12), `proof:engine-no-throw-on-play` (DM-13 — NOTE: the O.W4 vendor sub-chunk server fix must land first for this to pass on value.js 1.0.2+), `proof:fsm-suspend-resume-live` (DM-14), `proof:control-surface-single-writer` (DM-15). Any gate that reverts RED is a NEW O regression to wave-assign, NOT a close.
- **The prompt-recap TOTAL** (`docs/tranches/O/audit/prompt-recap-O.md`) — every distinct owner request across A→O at a terminal verdict (ADDRESSED-cited-by-gate / RECORD / HANDOFF / USER-DOMAIN / FOLD / OUT); zero drops.
- **The two USER-DOMAIN publishes RECORDED** — the observed `package.json` version + the registry presence of `@mkbabb/keyframes.js@5.0.0` and `@mkbabb/keyframes-vue@<v>`, cited AFTER the user fires the tag — never asserted before.
- **The deploy round-trip RECORDED** as the four-link live-byte oracle (S6).

---

## Born-RED gate

**Three gates: one new (S1) + two existing re-targeted/observed (S3, S6).** The keystone born-RED of the wave is `proof:changelog-5.0.0` — it bites the REAL inv-eps under-count + the missing publish gate, NOT a proxy.

`proof:changelog-5.0.0` (AUTHORED HERE — S1, born-RED on today's tree). The gate does NOT exist (`ls scripts/proof-changelog*` → no matches) AND there is no CHANGELOG 5.0.0 entry to satisfy it. Authoring the gate against the live `CHANGELOG.md` (which has no 5.0.0 breaking-change section) produces an immediate exit 1 naming the FIVE missing entries — born-RED by construction. **Author S1 as the FIRST impl action of this wave**, gate-first, before the cut.

`proof:chronic-closure` (EXISTING — re-pointed M→O in the atomic non-vacuity motion, S3). Born-pointing-at-L; the three planted O-rows RED on all three clause shapes before the clean O ledger greens it.

`proof:all` + the deploy round-trip (EXISTING — S6). Born-blocked: the two auto-deploy tripwires keep CI RED until O.W5 (control-point) + S4 (keyframes-vue) clear them; the live site serves the STALE `index-<hash>.js` until the round-trip fires.

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected at O close |
|---|---|---|---|
| S1 `proof:changelog-5.0.0` (AUTHORED) | `ls scripts/proof-changelog*` → **no matches**; `release.yml:59–83` has NO changelog gate | the gate does NOT exist; a 5.0.0 publish with an absent/under-counted CHANGELOG is UN-BLOCKED; the source carries FOUR `@deprecated`/`BREAKING` renames (`engine.ts:1192`, `timeline.ts:163`/`:209`, `animations.ts:133`) the CHANGELOG must name | the gate AUTHORED, born-RED on the missing CHANGELOG entries; GREEN only when ALL FIVE present (4 renames + multi-color refusal); wired into `release.yml` pre-`npm publish` |
| S2 `proof:published-surface` Oscillator clause | `npm view @mkbabb/keyframes.js dist-tags` → `latest: 4.3.0`; the 4.3.0 tarball export line has zero `Oscillator` | the Oscillator (+ 8 additive exports) is local-only; BC mirrors a glass-ui-local `useOscillator` interim (a no-workaround violation the moment kf ships) | the 5.0.0 cut carries the Oscillator into the tarball; `proof:published-surface` GREEN on the cut dist (manifest row + barrel + d.ts roll-up aligned) |
| S3 `proof:chronic-closure` (re-pointed) | `proof-chronic-closure.mjs:114` → `docs/tranches/L/PROGRESS.md` | the substrate still points at L; the O ledger has no terminal substrate; a chronic could silently drop across the M→O boundary | re-pointed M→O; the three planted O-rows RED on all three clause shapes; the clean terminal O ledger greens; output `✓ the O ledger is TERMINAL` |
| S4 `proof:keyframes-vue-published` | clause (b) E404 (`:121`); `PEER_FLOOR = "4.3.0"` (`:63`) | the adapter is unpublished — the SECOND auto-deploy tripwire; CI `check-failures` REDs | clause (b) GREEN on the USER-DOMAIN publish; `PEER_FLOOR` bumped to 5.0.0; CI tripwire cleared |
| S6 `proof:all` + deploy | the two tripwires keep CI RED; the live site serves the K-era `index-<hash>.js` | the `deploy-pages.yml` `if` is FALSE (CI concludes failure on the two reds) → `keyframes.babb.dev` does not re-ship; DM-20 round-trip never observed | both tripwires cleared → CI `success` → `deploy-pages.yml` fires → live `index-<hash>.js` hash EQUALS the merge-SHA `dist/gh-pages` artifact (the exact-byte oracle) |

**Born-RED on today's tree (the keystone).** `proof:changelog-5.0.0` is born-RED because it does not exist AND there is no CHANGELOG 5.0.0 entry to satisfy it — the missing-gate state IS the genuine inv-eps breach (the source documents FOUR renames + the multi-color refusal; nothing blocks a publish that names fewer). There is NO source-shape stand-in: the gate reads the real CHANGELOG content and asserts the real breaking-change entries (cross-checked against the live `@deprecated`/`BREAKING` source annotations). The chronic-closure substrate is born-pointing-at-L; the deploy is born-blocked on the two tripwires.

**Green condition.** `proof:changelog-5.0.0` authored + the CHANGELOG records all FIVE breaking changes (4 renames + the multi-color refusal) + wired into `release.yml`; `proof:published-surface` GREEN on the 5.0.0-cut dist with the Oscillator clause; `proof:chronic-closure` re-pointed M→O with the O ledger TERMINAL + non-vacuous; `proof:keyframes-vue-published` clause (b) GREEN on the USER-DOMAIN publish + `PEER_FLOOR` at 5.0.0; `proof:all` GREEN on the consolidated O runner; the deploy round-trip OBSERVED as the four-link live-byte equality; the VERIFY-ONLY roster (DM-8…DM-15) re-verified GREEN on the O dist; the prompt-recap total with zero drops. The version cut + both publishes are USER-DOMAIN — the FINAL cites the OBSERVED `package.json` version + the registry presence AFTER the user fires the `v5.0.0` tag.

---

## Dependencies

This is the tranche terminal — it depends on **every prior O wave at terminal disposition**. Enumerated:

| Dep | Required state | Phase / status |
|---|---|---|
| **Band A (O.W1/W2)** | lint tier GREEN; ledger hygiene done (DO-2 S1/S2 tripwire re-target, DO-3 `LEDGER_LABEL`, DO-4 missing rows) | NOW — executable on authorization |
| **Band B (O.W3/W4)** | NaN-frame cure GREEN; multi-color refusal GREEN; the vendor sub-chunk server fix (DO-1) — a precondition for DM-13's re-verify (S7) | NOW |
| **Band C (O.W5/W6)** — the ABSOLUTE terminals | `DemoControlPoint` built (O.W5) — **retires `proof:control-point-live`, clearing the FIRST auto-deploy tripwire**; `fromMorphSVG` built (O.W6) | NOW — kf-owned, no sibling gate |
| **Band D.W8/W9** | perf closure GREEN (O.W8); the no-legacy alias purge + the FOUR renames landed (O.W9) — the breaking set the changelog gate (S1) asserts | NOW |
| **Band F (O.W12–W15)** — the glass-ui BC consume | the BC cut consumed; S1/S2 deleted; design-paint locked; lighthouse posture flipped; N Stage unshelfed | GATED on the **glass-ui BC cut** (USER-DOMAIN ≥4.1.0; ~60% of BC tiers pending — audit A1/G31). The close-merge auto-deploy fires on the BC re-pin (`proof:peer-satisfied` is on the close-merge path) |
| **Band G (O.W16)** — the value.js P consume | S8/S9 deleted; `proof:boundary` W96 GREEN | GATED on the **value.js Tranche P** VJ-L1/L3 publish |
| **D.W7 engine-seam** | the god-object split | GATED on value.js P (VJ-L1 removes the FN_NAME stamp the split is blocked on) — must be GREEN before close if O.W16 fired |
| **The two USER-DOMAIN publishes** | `v5.0.0` tag fires `release.yml`; keyframes-vue publishes on `needs: publish` | USER-DOMAIN (Mike Babb, confirm-first). DM-7 (keyframes-vue, second deploy-blocker) clears HERE; DM-2 (control-point, first) cleared in O.W5 |
| **`proof:chronic-closure` non-vacuity** | three planted O-rows RED before the clean ledger greens | non-vacuous by construction (the gate's grammar enforces it) |
| **The acyclic spine (inv-16)** | parse-that 0.11.0 → value.js P → kf re-pin → glass-ui BC consume | kf writes only keyframes.js; both cross-repo needs (value.js P, glass-ui BC) are GATED consumes, neither a foreign-tree edit |

**The close criteria (the binding terminal conditions).** O closes when: all NOW gates GREEN (Bands A+B+C+D.W8+D.W9) + **Band F on the BC cut** consumed + **Band G on value.js P** consumed + the deploy round-trip observed as live-byte equality + **both auto-deploy tripwires resolved** (control-point-live retired in O.W5; keyframes-vue published HERE). If the BC cut or value.js P slip past the close window, the FINAL honestly NAMES the blocked bands with their tripwires (the L/M close discipline) — it does NOT assert them closed.

---

## dev→impl boundary

This wave is **NOW-author · USER-DOMAIN publish**. The gate authoring (S1 `proof:changelog-5.0.0`), the chronic re-point (S3), the peer-floor bumps (S4), and the close docs (S7) are kf-internal — they open for implementation when O's prior waves reach terminal disposition. **The version cut (S5), the two npm publishes (S4/S5), and the live-byte deploy observation (S6) are USER-DOMAIN** — Mike Babb fires the `changeset version` cut + the `v5.0.0` tag; the agent proposes the criteria and authors the gates, never actuates the publish. The FINAL cites the OBSERVED `package.json` version + the registry presence AFTER the tag, never an assertion before it.

The M.WZ substrate (`docs/tranches/M/waves/M.WZ.md`) remains the authoritative deep-context reference for the close mechanics (the inv-eps anti-overclaim discipline, the FOUR-vs-three breaking-change correction, the chronic-closure non-vacuity protocol, the live-byte deploy oracle shape). O.WZ deltas M.WZ on: the ledger re-point target (M→O, not L→M); the deploy tripwire count (TWO — control-point + keyframes-vue — the inv-eps "sole blocker" overclaim corrected per audit D19); the Oscillator-on-npm obligation (the L+M additive tail the M close never shipped); and the consume gates (the BC cut + value.js P, the Band F/G unblocks the M close left HANDOFF). No re-authoring of M.WZ's rationale is needed — this is the M.WZ close, finally executed, with the as-built corrections the 32-lane re-audit surfaced.
