# M.W8 — The glass-ui BB consume — THE deploy UNLOCK

- **Band:** C · **HIGHEST URGENCY (the live deploy blocker)** · **Class:** DEV
  (docs); IMPL opens on authorization AND on the HANDOFF firing. **Dep:**
  **glass-ui BB 4.1.0 publish** (the peer-widen §3 + the SegmentedTabs pill-branch
  aria guard §1 + RF-17 W-DOCK-MORPH-FAMILY §2). This is a HANDOFF-gated consume
  wave: the cure is ONE atomic kf-side commit that executes the instant glass-ui
  4.1.0 lands, NOT before. Born-RED kf-side TODAY on glass-ui 4.0.0 — the F-2
  peer-cycle reds live (`proof:peer-satisfied` exit 1, verified 2026-06-17).
- **Gate (born-RED, two gates):**
  - `proof:peer-satisfied` — exit 1 TODAY (verified live: `glass-ui@4.0.0 declares
    peer @mkbabb/value.js@"^0.10.0 || ^0.11.0" but installed is 0.13.0 (ELSPROBLEMS)`).
    The F-2 peer-cycle is the kf-side tripwire that the cross-repo ask is a LIVE
    consumer-facing defect. GREEN when glass-ui BB widens the peer range + kf re-pins.
  - `proof:workaround-deletion` S1 + S2 — PENDING TODAY (verified live: `0 GREEN /
    5 PENDING / 0 RED`; `S1=PENDING S2=PENDING`). S1 is the `:aria-orientation="undefined"`
    suppress (2 sites); S2 is the `pointerHandled`/`onPlayPointerDown` dock interim
    (9 hits). GREEN arm-by-arm on the glass-ui 4.1.0 consume + delete.
- **Folds (lane #):** lane-21 §1/§2/§5 (the five-ask ground-truth status, the F-2
  deploy-blocker verdict, M-Wave A the UNLOCK commit) · lane-23 §0/§1/§2/§3 (the
  full causal chain link-by-link, the exact unblocking condition, the M-wave-vs-HANDOFF
  classification) · lane-26 §1/§2/§6/§B (the S1+S2 deletion arms, the two-track
  sequencing, MW-CONSUME-DELETE) · lane-09 §1/§5/§9 (the acyclic-purity framing
  audit of S1/S2, the consume-edge M obligations).
- **Precept cure:** the two STAGED inv-16 / no-workaround violations (lane-21 §4.1,
  lane-23 §5.1, lane-26 §7) — S1 (the `aria-orientation` consume-seam suppress) and
  S2 (the RF-17 dock interim, chronicity 3, P-invariant-28 TERMINAL at M). Both are
  correctly STAGED (PENDING, not bare RED) by the three-state gate model; this wave
  is the FOLD that discharges them on the sibling publish.

---

## Context

The L close shipped, but `tranche-l-dev` **did not deploy** — and the root cause is a
SINGLE glass-ui-owned manifest defect that no kf-internal change can cure (lane-23 §0
verdict). This is the wave that unlocks the deploy. It is the highest-urgency item in
the entire M tranche because it is a LIVE consumer-facing breach (any
`npm install @mkbabb/keyframes.js @mkbabb/glass-ui` today produces `ELSPROBLEMS`,
lane-21 §1.2) AND it blocks the auto-deploy of every subsequent merge to master.

**The breach — the F-2 peer-cycle (lane-21 §1, lane-23 §1).** glass-ui 4.0.0 (the
published latest) declares `"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` in its
`peerDependencies`. kf depends on `@mkbabb/value.js ^0.13.0` and the installed
sibling is `0.13.0`. npm caret semantics on `0.x.y` pin the MINOR: `^0.10.0` admits
`>=0.10.0 <0.11.0`, `^0.11.0` admits `>=0.11.0 <0.12.0`. `0.13.0` falls in NEITHER —
the peer range REJECTS the installed sibling. Verified live this session:
`node scripts/proof-peer-satisfied.mjs` → **exit 1**, the gate's authoritative output:

```
✗ glass-ui@4.0.0 declares peer @mkbabb/value.js@"^0.10.0 || ^0.11.0" but installed
  is 0.13.0 (ELSPROBLEMS) — the peer range REJECTS the installed sibling; any
  consumer installing both gets a peer-conflict error.
```

**Why this blocks the deploy (the full causal chain, link by link — lane-23 §1).**

1. **Link 1 — the peer-range mismatch (the root cause).**
   `node_modules/@mkbabb/glass-ui/package.json` declares the rejecting range;
   `node_modules/@mkbabb/value.js/package.json` is `0.13.0`. `proof-peer-satisfied.mjs`
   reads the installed glass-ui peer map, iterates each `@mkbabb/*` peer, resolves the
   installed version, calls `semver.satisfies`, and exits 1 on the value.js miss. This
   is a pure manifest read — a static gate, not a timing measurement (lane-21 §8).
2. **Link 2 — CI demo-smoke job (how exit-1 propagates).** `ci.yml:355-358` runs
   `proof:peer-satisfied` with `continue-on-error: true` (the report-all posture — the
   step does not abort the job). But the terminal `check-failures` step
   (`ci.yml:1577-1581`) collects every step's `outcome` and includes
   `if [ "${{ steps.proof-peer-satisfied.outcome }}" = "failure" ]; then failed="$failed
   proof-peer-satisfied"; fi` — so a `failure` outcome adds the step to `$failed` and the
   job exits 1. The annotation (`ci.yml:352-353`) is explicit: the born-RED F-2 state is a
   live defect the job SHOULD surface. The `demo-smoke` job concludes `failure`.
3. **Link 3 — CI workflow conclusion.** A GitHub Actions workflow concludes `'failure'`
   if ANY job fails. The `gates` job passes; `demo-smoke` fails (link 2). The `ci`
   workflow concludes `'failure'`.
4. **Link 4 — the deploy `if` gate.** `deploy-pages.yml:44-46` fires the CF-Pages deploy
   ONLY on `github.event.workflow_run.conclusion == 'success' &&
   head_branch == 'master' && event == 'push'`. With `ci` concluding `'failure'`, the `if`
   is false → the deploy job does NOT run → `keyframes.babb.dev` does not re-ship.
   (There is also an OUTER precondition — `tranche-l-dev` is not merged into master,
   so no master push exists to trigger the deploy at all — but the FINAL intentionally
   sequences the close-merge AFTER `proof:peer-satisfied` greens, because the master CI
   would fail anyway: lane-23 §1.4.)

**Why kf cannot cure it locally (inv-16, no-workaround — lane-23 §5.3).** The correct
fix is a one-line manifest change in glass-ui's `peerDependencies`. kf MUST NOT paper it
with an npm `overrides` block or `peerDependenciesMeta: { "@mkbabb/value.js": { optional:
true } }` — both are explicitly forbidden (`KF-TO-GLASSUI-BB-ASKS.md §3`,
`completion-lanes-32-36.txt §Lane 36`): they silence kf's OWN install warning but leave
the consumer-facing defect live AND mask the tripwire, which is the exact workaround shape
the no-workaround precept exists to forbid. The cure is glass-ui's peer range. kf's side
is the consume-edge re-pin.

**The two STAGED workarounds this wave deletes (S1, S2).** While the sibling is unpublished,
the kf demo carries two consume-seam workarounds — both correctly held (PENDING, not bare
RED) by the three-state gate model (lane-09 §6, lane-26 §7):

- **S1 — the `aria-orientation` suppress (lane-21 §2.1, lane-26 §1).** glass-ui's
  `SegmentedTabs` emits `aria-orientation` unconditionally even when `variant="pill"`
  renders `role="group"` (`node_modules/@mkbabb/glass-ui/dist/tabs.js:203-204` — `role`
  conditional on the pill flag, `aria-orientation` unconditional in the same object
  literal). ARIA 1.2 forbids `aria-orientation` on `role=group` (valid only on
  `scrollbar`/`separator`/`slider`/`tablist`/`toolbar`/`treeitem`). kf suppresses it at
  TWO pill render sites with `:aria-orientation="undefined"`. Verified live this session:
  `grep -rn 'aria-orientation="undefined"' demo/` → exactly
  `demo/spring/SpringSidebar.vue:43` and
  `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`. The
  fleet-wide blast radius is exactly these two strips (`grep -rn 'variant="pill"' demo/`
  → 2 render sites + 3 non-render comment/composable hits, verified).
- **S2 — the RF-17 dock interim (lane-21 §2.2, lane-26 §2).** glass-ui's dock
  collapse-crossfade can strand the `click` after a `pointerdown` on the play button in
  certain expand/collapse transition states, causing a double-toggle. kf routes the toggle
  through `pointerdown` (always fires before the crossfade interferes) and marks
  `pointerHandled` to suppress the subsequent `click`; `onPlayClick` then actuates only on
  a bare `click` (keyboard Enter/Space) so full keyboard operability is preserved
  (`TransportDock.vue:340-375`). Verified live this session: `grep -n
  'pointerHandled\|onPlayPointerDown' demo/@/components/custom/animation-controls/TransportDock.vue`
  → 9 hits (lines 15, 151, 196, 342, 348, 358, 361, 366, 373). **Chronicity 3 (I, J, K →
  L); P-invariant-28 bars a 4th carry** — M is the terminal tranche for this interim
  (lane-21 §4.1, lane-23 §5.1, lane-26 §2).

**The unlock — ONE atomic commit (lane-21 §5 M-Wave A, lane-23 §2, lane-26 §B).** When
glass-ui BB publishes 4.1.0 carrying all three fixes (peer-widen + aria guard + RF-17
dock cure), the kf-side work is a single short consume commit: re-pin `~4.0.0` →
`~4.1.x`, delete BOTH `:aria-orientation="undefined"` lines, delete the entire
`pointerHandled`/`onPlayPointerDown` interim. Then `proof:peer-satisfied` → GREEN,
`proof:workaround-deletion` S1 + S2 → GREEN, full `proof:all` green → close-merge to
master → green CI → `deploy-pages.yml` auto-fires → `keyframes.babb.dev` serves new bytes.

### Audit evidence

| Ref | Source location | Fact (verified this session unless noted) |
|-----|-----------------|-------------------------------------------|
| lane-21 §1.2 / lane-23 §1.1 | `node scripts/proof-peer-satisfied.mjs` | **exit 1** — `glass-ui@4.0.0` peer `@mkbabb/value.js@"^0.10.0 \|\| ^0.11.0"` REJECTS installed `0.13.0` (ELSPROBLEMS); BORN-RED-BY-DESIGN |
| lane-23 §1.1 | `node_modules/@mkbabb/glass-ui/package.json` | `peerDependencies["@mkbabb/value.js"]` = `"^0.10.0 \|\| ^0.11.0"`; `["@mkbabb/keyframes.js"]` = `"^2.2.0 \|\| ^3.0.0 \|\| ^4.0.0"` (admits 4.3.0 — the kf half is satisfied) |
| lane-21 §10 | `package.json:215` | `"@mkbabb/glass-ui": "~4.0.0"` — the pin to bump |
| lane-21 / lane-23 | `npm show @mkbabb/glass-ui version` / `@4.1.0` | latest `4.0.0`; `4.1.0` → **E404** (the HANDOFF tripwire — unfired) |
| lane-21 §2.1 / lane-26 §1 | `node_modules/@mkbabb/glass-ui/dist/tabs.js:203-204` | `role: V.value ? "tablist" : "group"` conditional, `"aria-orientation": …` UNCONDITIONAL — the root defect |
| lane-26 §1 (S1) | `grep -rn 'aria-orientation="undefined"' demo/` | exactly 2 sites: `demo/spring/SpringSidebar.vue:43` + `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` |
| lane-21 §10 | `grep -rn 'variant="pill"' demo/` | 2 render sites + 3 non-render hits — the fleet-wide blast radius IS exactly the two suppressed strips |
| lane-26 §2 (S2) | `grep -n 'pointerHandled\|onPlayPointerDown' …/TransportDock.vue` | 9 hits: lines 15, 151, 196, 342, 348, 358, 361, 366, 373 |
| lane-21 §2.2 | `…/TransportDock.vue:340-375` | the interim block: `pointerHandled` flag + `onPlayPointerDown` (drives toggle on `pointerdown`) + `onPlayClick` (the keyboard-only `if (pointerHandled) return` guard) + `actuatePlay` |
| lane-09 §6 / lane-26 §A | `node scripts/proof-workaround-deletion.mjs` | **exit 0**, `0 GREEN / 5 PENDING / 0 RED`; `S1=PENDING S2=PENDING` — STAGED, not failing |
| lane-23 §1.2 | `ci.yml:355-358` | `proof:peer-satisfied` runs `continue-on-error: true` in `demo-smoke` (report-all) |
| lane-23 §1.2 | `ci.yml:1577-1581` | `check-failures`: `if [ "${{ steps.proof-peer-satisfied.outcome }}" = "failure" ]; then failed="$failed proof-peer-satisfied"; fi` → job exits 1 |
| lane-23 §1.4 | `deploy-pages.yml:44-46` | deploy `if`: `conclusion == 'success' && head_branch == 'master' && event == 'push'` — a red CI ⇒ false ⇒ no deploy |
| lane-23 §1.4 | `deploy-pages.yml:64-68` | `scripts/pages-deploy.sh` builds the demo (`npm run gh-pages` → `dist/gh-pages`) + ships to the `keyframes` CF Pages project via wrangler |
| lane-21 §2.2 / lane-26 §2 | `PROGRESS.md` / `deferred-ledger-L.md §DLL-19` | S2 chronicity 3 (I,J,K→L); P-invariant-28 bars a 4th carry — M.WZ TERMINAL |
| precedent | commit `4f1fc4c` (J-close) | the deploy round-trip oracle SHAPE: `CI 27378354065 → deploy 27379501160 → live serves index-xIYGAIrv.js exact` — the exact-byte observable this wave's S5 re-observes |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they clear the F-2 deploy
blocker and discharge the two glass-ui-track STAGED workarounds in ONE atomic commit on
the glass-ui 4.1.0 consume — every move a consume-edge re-pin, NONE a kf-local cure (the
cures live in glass-ui; lane-09 §5 confirms no kf-local approach is more idiomatic).

---

### S1 — Re-pin `optionalDependencies["@mkbabb/glass-ui"]` `~4.0.0` → `~4.1.x` (the peer-widen consume — F-2 clears)

**Breach.** glass-ui 4.0.0's peer range REJECTS the installed value.js 0.13.0 →
`proof:peer-satisfied` exit 1 (verified). The pin sits at `~4.0.0` (`package.json:215`).
A tilde on a minor (`~4.0.0`) admits all `4.0.*` patches but NOT `4.1.0`.

**Cure.** On glass-ui BB publishing 4.1.0 with the widened peer range (`KF-TO-GLASSUI-BB-ASKS.md
§3` asks for `"@mkbabb/value.js": "^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0"` or wider),
bump the pin to `~4.1.x` (`package.json:215`) and re-install so the lockfile resolves the
4.1.0 cut. The peer range now admits the installed `0.13.0` → `proof:peer-satisfied` reads
the satisfied range and exits 0. NO override, NO `peerDependenciesMeta` escape (forbidden —
lane-23 §5.3).

**Constraint (the timing split — lane-21 §5 / lane-23 §2).** If glass-ui BB ships the
peer-widen in a 4.0.x PATCH (manifest-only) BEFORE the 4.1.0 feature cut, `~4.0.0` already
admits any `4.0.*`, so `proof:peer-satisfied` greens on a bare `npm install` with NO
manifest change — and S2/S3 (the workaround deletions) then wait for 4.1.0. In that case
this wave SPLITS: the peer-widen consume lands first (F-2 clears, the deploy unblocks),
and S2/S3 land on the 4.1.0 cut. The atomic-single-commit form is correct ONLY when BB
ships all three fixes in 4.1.0 together.

**Gate bite.** `node scripts/proof-peer-satisfied.mjs` → exit 0 (the deploy blocker clears).
Today: exit 1 (verified, the born-RED witness). After the re-pin onto a cut whose peer range
admits 0.13.0: exit 0.

---

### S2 — Delete BOTH `:aria-orientation="undefined"` suppressions (S1 arm — the aria root fix consumed)

**Breach.** glass-ui's `SegmentedTabs` emits `aria-orientation` on `role=group`
(`tabs.js:203-204`); kf suppresses it at the two pill render sites with
`:aria-orientation="undefined"` — a consume-seam band-aid for a sibling defect (the cure is
ONE conditional guard in glass-ui's source that makes ALL constellation consumers correct
at once; kf cannot write it — inv-16; lane-26 §1).

**Cure.** On the 4.1.0 consume (BB's SegmentedTabs now emits `aria-orientation` only when
the rendered role permits it), delete BOTH lines in the same commit:
- `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"`,
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`
  `:aria-orientation="undefined"`.

A `git grep` + line delete — no architecture change, no kf source change (lane-26 §1
M-wave ownership). After deletion the live rendered pill strip emits NO `aria-orientation`
(because glass-ui's 4.1.0 guard now omits it at the root).

**Constraint (both, not one — lane-09 §1 / lane-21 §2.1).** The L.W9 finalize COMPLETED the
interim by adding the second suppress so the demo emits NO invalid attribute fleet-wide.
Deleting only one would re-open a partial-application leak. Both delete together; the blast
radius is exactly these two strips (verified: 2 render sites).

**Gate bite (S5 coverage).** `proof:workaround-deletion` S1 arm asserts zero
`/aria-orientation\s*=\s*["']?\s*undefined/` pattern in `demo/**` (the arm's pattern,
`proof-workaround-deletion.mjs:184`). Today: PENDING (PRESENT + glass-ui 4.1.0 E404). After
the 4.1.0 publish + delete: GREEN.

---

### S3 — Delete the `pointerHandled`/`onPlayPointerDown` RF-17 dock interim (S2 arm — the dock cure consumed)

**Breach.** glass-ui's dock collapse-crossfade strands the `click` after a `pointerdown` on
the play button in certain transition states (double-toggle); kf routes the toggle through
`pointerdown` + `pointerHandled` as the interim (`TransportDock.vue:340-375`). The cure is
glass-ui's compositor-isolated expand/collapse morph (`W-DOCK-MORPH-FAMILY`) + the RF-17
collapse-crossfade strand fix; kf cannot implement that (inv-16; lane-26 §2). **Chronicity 3
— P-invariant-28 bars a 4th carry; M is the terminal tranche** (lane-21 §4.1, lane-23 §5.1).

**Cure.** On the 4.1.0 consume (BB's dock no longer strands the `click`), delete the entire
interim in the same commit — all 9 hits in `TransportDock.vue`: the `pointerHandled` flag
(line 348), `onPlayPointerDown` (the declaration line 358 + the bindings at lines 151, 196),
the `pointerHandled = true/false` assignments (361, 366), the `if (pointerHandled) return`
guard in `onPlayClick` (373), and the documentation comment block (lines 15, 342). The
play-button toggle reverts to a plain `@click="onPlayClick"` actuating
`emit("togglePlay")` directly — because the glass-ui 4.1.0 dock no longer swallows the
`click` mid-crossfade, the `pointerdown` re-route is unnecessary and keyboard activation
(Enter/Space → bare `click`) actuates through the same `click` path with no guard needed.

**Constraint (keyboard operability is preserved by the glass-ui fix, not the interim —
lane-26 §2).** Today the `if (pointerHandled) return` guard exists so keyboard `click`
(with no preceding `pointerdown`) still actuates while the pointer `click` is suppressed.
After the dock cure, the `click` is never stranded, so a single `@click` path serves BOTH
pointer and keyboard activation — `proof:live-session` S4 (keyboard operability) must stay
GREEN through the deletion (regression-lock; the interim's keyboard correctness was a
SYMPTOM cure, the glass-ui dock fix is the root, lane-26 §2 / lane-09 §1).

**Gate bite (S5 coverage).** `proof:workaround-deletion` S2 arm asserts zero
`/pointerHandled|onPlayPointerDown/` pattern in `TransportDock.vue` (the arm's pattern,
`proof-workaround-deletion.mjs:196`). Today: PENDING (PRESENT + glass-ui 4.1.0 E404). After
the 4.1.0 publish + delete: GREEN.

---

### S4 — One atomic commit; trace the full deploy chain to live bytes (the round-trip RE-observed)

**Deliverable.** S1+S2+S3 land in ONE atomic commit (the timing-split exception in S1
applies only if BB ships the peer-widen ahead of 4.1.0). The commit then drives the FULL
deploy chain, each link OBSERVED, not assumed (lane-23 §1, §2):

1. `node scripts/proof-peer-satisfied.mjs` → **exit 0** (F-2 clears).
2. `node scripts/proof-workaround-deletion.mjs` → S1 + S2 arms GREEN (`5 GREEN / 0 PENDING
   / 0 RED` on the glass-ui track if the value.js-track arms S7/S8/S9 have also landed via
   M.W9; otherwise `2 GREEN (S1,S2) / 3 PENDING (S7,S8,S9) / 0 RED`).
3. `npm run proof:all` → full local roster GREEN.
4. Close-merge to master → the `ci` workflow runs → `gates` job PASS + `demo-smoke` job
   PASS (the `check-failures` step no longer adds `proof-peer-satisfied` to `$failed`,
   `ci.yml:1581`).
5. `ci` workflow conclusion = `'success'`.
6. `deploy-pages.yml` `if` evaluates TRUE → the deploy job runs → `scripts/pages-deploy.sh`
   builds (`npm run gh-pages` → `dist/gh-pages`) + ships to the `keyframes` CF Pages project.
7. `keyframes.babb.dev` serves the NEW bytes — verified by the exact-hash oracle: the
   live `index-*.js` filename served by the site MATCHES the `dist/gh-pages` build hash of
   the close-merge SHA (the same observable form the J-close cited: `CI <run-id> → deploy
   <run-id> → live serves index-<hash>.js exact`, commit `4f1fc4c`).

**Constraint (the inv-ε round-trip oracle — no overclaim).** The deploy is "observed" ONLY
when the live-served `index-*.js` hash is captured and shown EQUAL to the freshly-built
artifact hash for the merge SHA, with the CI run id and the deploy run id both recorded
(the J-close precedent shape). A green local `proof:all` is NOT the deploy claim — local
`proof:all` = `proof:correctness && proof:hygiene`, NEITHER of which contains
`proof:peer-satisfied` (lane-23 §5.2), so local green can coexist with CI red. The wave's
DONE condition is the live-byte equality, cited as an oracle (inv-M-observable-truth applied
to the deploy: the REAL observable is the bytes the site serves, not the gate exit code).

**Gate bite.** This clause is the integration of S1+S2+S3 — its "RED today" is the WHOLE
chain being broken: `proof:peer-satisfied` exit 1 (link 1), `demo-smoke` would red (link 2),
`ci` would conclude failure (link 3), the deploy `if` is false (link 4), so the site does
not re-ship. After the consume commit on the 4.1.0 publish, every link flips and the live
bytes change.

---

## Born-RED gate

**Gates:** `proof:peer-satisfied` (EXISTING — `scripts/proof-peer-satisfied.mjs`, owned +
authored by L.W4 S8; this wave is the consume that GREENs it) AND `proof:workaround-deletion`
S1 + S2 arms (EXISTING — `scripts/proof-workaround-deletion.mjs`; this wave is the delete
that flips both arms GREEN). NO new gate script is authored — the born-RED apparatus already
exists and is verified biting TODAY; this is a consume wave, and its proof is the two
existing gates flipping state on the publish + consume.

**The REAL observable (inv-M-observable-truth).** Each gate bites the GENUINE defect,
verified live this session — NOT a proxy:

| Gate / clause | Witness on today's tree (glass-ui 4.0.0) | Failure mode today (the REAL observable) | Expected after the 4.1.0 consume |
|---------------|------------------------------------------|------------------------------------------|----------------------------------|
| S1 `proof:peer-satisfied` | `node scripts/proof-peer-satisfied.mjs` | **exit 1** — `glass-ui@4.0.0` peer `@mkbabb/value.js@"^0.10.0 \|\| ^0.11.0"` REJECTS installed `0.13.0` (ELSPROBLEMS); a real `npm install` of both packages errors today (lane-21 §1.2 — consumer-facing, not a CI artifact) | exit 0 — the widened peer range admits 0.13.0 |
| S2 `proof:workaround-deletion` S1 arm | `grep -rn 'aria-orientation="undefined"' demo/` | 2 PRESENT sites (`SpringSidebar.vue:43`, `AnimationControls.vue:72`); gate arm PENDING (PRESENT + glass-ui 4.1.0 E404) — the invalid ARIA attr is suppressed by a band-aid the glass-ui root fix should retire | S1 arm GREEN — zero `:aria-orientation="undefined"` in `demo/**`; the live pill emits no `aria-orientation` |
| S3 `proof:workaround-deletion` S2 arm | `grep -n 'pointerHandled\|onPlayPointerDown' …/TransportDock.vue` | 9 PRESENT hits; gate arm PENDING (PRESENT + glass-ui 4.1.0 E404) — the dock double-toggle is papered by a consumer-side pointer interim at the wrong layer | S2 arm GREEN — zero `pointerHandled`/`onPlayPointerDown` in `TransportDock.vue`; the dock cure lives in glass-ui |
| S4 the deploy chain | the full chain (links 1-4) | `proof:peer-satisfied` exit 1 → `demo-smoke` reds (`check-failures`) → `ci` conclusion `failure` → `deploy-pages.yml` `if` FALSE → site does not re-ship (lane-23 §1) | every link flips: CI conclusion `success` → deploy fires → `keyframes.babb.dev` serves the new `index-*.js` (exact-hash oracle) |

**Born-RED kf-side TODAY (the keystone).** This wave's gates are BORN-RED on today's tree
against glass-ui 4.0.0 — verified this session: `proof:peer-satisfied` exits 1 (the F-2
ELSPROBLEMS), `proof:workaround-deletion` S1+S2 are PENDING (PRESENT, awaiting the publish).
The RED/PENDING is the GENUINE defect (the live peer-cycle, the two consume-seam
workarounds), not a proxy for it. There is NO source-shape stand-in: the peer gate reads the
real installed manifest, the deletion gate greps the real demo sources.

**Green condition.** glass-ui BB publishes 4.1.0 with the peer-widen + the SegmentedTabs
pill-branch aria guard + the RF-17 W-DOCK-MORPH-FAMILY dock cure; kf re-pins `~4.1.x` (S1),
deletes both `:aria-orientation="undefined"` lines (S2), deletes the dock interim (S3), all
in one atomic commit; `proof:peer-satisfied` → exit 0, `proof:workaround-deletion` S1+S2 →
GREEN; the close-merge to master carries a green CI → `deploy-pages.yml` auto-fires → the
live-served `index-*.js` hash equals the freshly-built artifact for the merge SHA (S4 — the
round-trip oracle, no overclaim).

---

## Dependencies

- **glass-ui BB 4.1.0 publish — THE blocking HANDOFF.** This wave is a PURE-WAIT HANDOFF
  on the kf side (lane-23 §3): kf cannot write glass-ui source (inv-16), so kf cannot
  publish the cure. The triggering event is EXTERNAL (glass-ui BB). The 4.1.0 cut must
  carry all three: §3 the value.js peer-widen (admit 0.13.0+), §1 the SegmentedTabs
  pill-branch aria guard, §2 the RF-17 W-DOCK-MORPH-FAMILY dock cure
  (`KF-TO-GLASSUI-BB-ASKS.md §1/§2/§3`). Registry state verified this session:
  `npm show @mkbabb/glass-ui version` → `4.0.0`; `@mkbabb/glass-ui@4.1.0` → **E404**
  (unfired). The M wave is short (one atomic commit + gate runs) and executes the instant
  the HANDOFF fires (lane-23 §3 classification: **M WAVE gated on HANDOFF**).
- **value.js 0.13.0 (already pinned) — sufficient for the peer half.** The peer-widen admits
  the installed `0.13.0`; no value.js publish is required for THIS wave (the value.js-track
  workarounds S7/S8/S9 are M.W9 on value.js 0.14.0 — orthogonal track, lane-26 §6).
- **Independent of every Band-A/Band-B wave.** No file collision: M.W8 touches
  `package.json` (the pin) + two `.vue` demo files (the suppress lines) +
  `TransportDock.vue` (the dock interim). It does NOT touch the engine/format/compile
  surfaces (M.W5–W7) or the gate apparatus (M.W1–W4). It composes with M.W1's report-all
  runner (the F-2 RED is reported alongside other reds in one pass) but does not require it.
- **Couples to M.WZ (the close).** M.WZ's "deploy round-trip RE-observed" is GATED on this
  wave (M.md M.WZ row: "the deploy round-trip RE-observed (gated on M.W8)"). The 5.0.0
  version cut + npm publish are USER-DOMAIN and INDEPENDENT of the site deploy
  (`proof:peer-satisfied` is `continue-on-error` in `release.yml` — a RED does NOT block
  `npm publish`; lane-23 §4), but the FINAL sequences them coordinated with this consume.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 peer re-pin | The F-2 peer-cycle re-opens — a real consumer running `npm install @mkbabb/keyframes.js @mkbabb/glass-ui` gets `ELSPROBLEMS`; the master CI `demo-smoke` job reds on `proof:peer-satisfied`; `deploy-pages.yml` never fires; the live site stays stale on every subsequent master merge (the deploy stays blocked) |
| S2 aria delete | The demo ships an invalid `aria-orientation` on `role=group` pill strips (an a11y defect on every scene mounting a pill `SegmentedTabs`) OR the band-aid suppress survives past the glass-ui root fix (a no-workaround / inv-16 violation carried forward needlessly) |
| S3 dock delete | The `pointerHandled`/`onPlayPointerDown` interim survives past the glass-ui dock cure — a chronicity-4 carry of an RF-17 workaround that P-invariant-28 forbids (M is the terminal tranche); the wrong-layer pointer re-route accretes maintenance burden a glass-ui-side cure obviates |
| S4 deploy chain | A "green local proof:all" is mistaken for a shipped deploy — the inv-ε overclaim (local `proof:all` excludes `proof:peer-satisfied`, so it can be green while CI is red and the site is stale); the deploy is claimed without the live-byte oracle the J-close established |

---

## Excluded from this wave

- **The value.js-track workarounds S7/S8/S9** (the `linear()` regex, the `FN_NAME` Symbol,
  the direct parse-that dep) — gated on value.js 0.14.0, NOT glass-ui 4.1.0; that is M.W9
  (lane-26 §6 Track B). M.W8 is the glass-ui track ONLY (S1/S2 arms). The two tracks are
  independent and fire on separate sibling publishes (lane-26 §6).
- **GlassControlPoint terminal disposition** (DL-L7, chronicity 6, P-invariant-28 ABSOLUTE
  terminal at M) — `proof:control-point-live` is RED-by-design; its consume-or-KILL verdict
  is M.W14 + M.WZ (lane-21 §2.4 / §5 M-Wave B), NOT this wave. It is independent of the
  re-pin commit (lane-21 §6 cascade note).
- **The Oscillator consume-signal reconciliation** (the L.W9 ship-before-signal gap — if
  glass-ui BB's `W-EASING-PRIMITIVE` requires a different API shape) — M.W14 / a dispatch
  doc update, NOT this wave (lane-21 §2.5 / §5 M-Wave C, lane-09 §2). It depends on BB's
  signal, not on the re-pin.
- **The 5.0.0 version cut + npm publish** — USER-DOMAIN, INDEPENDENT of the site deploy
  (lane-23 §4). This wave clears the SITE deploy blocker; the registry publish (release.yml
  on a `v*.*.*` tag) is a separate, owner-driven action.
- **The `proof:keyframes-vue-published` arm of demo-smoke** — a separate
  `continue-on-error` tripwire in `check-failures` (`ci.yml:1582`); publishing
  `@mkbabb/keyframes-vue` is USER-DOMAIN (lane-23 §4). If absent, it independently reds
  `demo-smoke` even after F-2 clears — but it is NOT a glass-ui workaround and NOT this
  wave's surface (this wave clears the F-2 link; the keyframes-vue publish is a separate
  USER-DOMAIN gate the close coordinates).
