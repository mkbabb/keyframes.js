# Lane 27 — user-domain finale
## Tranche M charter seed

**Status:** AUDIT ONLY. No gate changed, no code written. Every claim below is
verified against ground truth on `tranche-l-dev` tip (`529fcfd`). File:line anchors
re-verified 2026-06-17 by direct read or live command; probe outputs cited inline.
Inv ε holds: no claim is asserted that a re-run cannot reproduce.

---

## 1. GROUND-TRUTH VERIFICATION (the facts before the verdict)

```
package.json version          = 4.3.0   (the K close cut)
tranche-l-dev tip             = 529fcfd  (docs: the CLOSE)
npm show @mkbabb/keyframes.js = 4.3.0 (published 2 days ago; registry-probed)
npm show @mkbabb/keyframes-vue = E404   (ABSENT; registry-probed)
npm show @mkbabb/glass-ui      = 4.0.0 (published 2 days ago; registry-probed)
npm show @mkbabb/value.js      = 0.13.0 (registry-probed)

proof:peer-satisfied           = exit 1 (BORN-RED-BY-DESIGN)
  glass-ui@4.0.0 peer @mkbabb/value.js "^0.10.0||^0.11.0" rejects installed 0.13.0
  → ELSPROBLEMS live on every kf + glass-ui consumer (re-run, observed above)

proof:keyframes-vue-published  = exit 1 (BORN-RED-BY-DESIGN)
  clause (a) GREEN: packages/keyframes-vue/dist/keyframes-vue.js PRESENT
  clause (b) RED:   npm show @mkbabb/keyframes-vue@0.1.0 → E404
  clause (c) GREEN: peer floor ">=4.3.0" (packages/keyframes-vue/package.json)
  (re-run, observed above)

proof:workaround-deletion      = exit 0 (THREE-STATE PENDING)
  S1 PENDING: aria-orientation suppress — glass-ui@4.1.0 E404
  S2 PENDING: pointerHandled/onPlayPointerDown — glass-ui@4.1.0 E404
  S7 PENDING: linear() regex normalize — value.js@0.14.0 E404
  S8 PENDING: FN_NAME Symbol stamp — value.js@0.14.0 E404
  S9 PENDING: @mkbabb/parse-that direct dep — value.js@0.14.0 E404
  (re-run, observed above)

proof:control-point-live       = exit 1 (BORN-RED-BY-DESIGN)
  GlassControlPoint ABSENT from glass-ui@4.0.0 dist tree
  (re-run, observed above)

proof:chronic-closure          = exit 0 (GREEN — L ledger is TERMINAL)
  CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md (re-pointed at L close)
  20 rows parsed, all at terminal disposition
  (re-run, observed above)

release.yml                    = AUTHORED (v*.*.* tag → publish core + keyframes-vue)
  .github/workflows/release.yml lines 1–148 (read directly)

Breaking changes documented in src:
  engine.ts:1192  @deprecated Animation → KeyframesAnimation in 5.0.0 (PKG-3)
  timeline.ts:163 @deprecated ScrollTimelineOptions → KeyframesScrollTimelineOptions in 5.0.0
  timeline.ts:209 @deprecated ScrollTimeline → KeyframesScrollTimeline in 5.0.0
  animations.ts:133 BREAKING (5.0.0): presets.flip → presets.flipPreset

FINAL.md §S6 STATES "THREE breaking type changes" — but four are documented in
source. Lane-08 M audit recorded this discrepancy (under-count, inv ε gap in the
FINAL's §S3 summary at FINAL.md:141-142 + FINAL.md:274-275). Verified independently
on this audit pass.
```

---

## 2. THE HEADLINE VERDICT

**L.WZ closed with every kf-internal boundary met, all proof:all roster reds cured
(`d7c7f3d`), and the chronic-closure substrate re-pointed to the L ledger (`529fcfd`).
The deploy round-trip, the 5.0.0 version cut, and the two npm publishes are
USER-DOMAIN — Mike Babb fires them. The glass-ui BB peer-widen is the sole
external dependency that blocks the deploy from being a clean kf-only gate.**

The user-domain finale is a three-stage sequence:

1. **glass-ui BB** publishes with the widened value.js peer range → `proof:peer-satisfied` goes GREEN → the F-2 ELSPROBLEMS dies
2. **kf re-pin** (`~4.1.0`) and workaround sweeps (the aria/pointerHandled deletions) → `proof:workaround-deletion` S1/S2 GREEN → close-merge to master → CI green → auto-deploy → `keyframes.babb.dev` serves new dist
3. **Version cut** (`changeset version` → `5.0.0`) + **npm publish** (`v5.0.0` tag → `release.yml` fires both jobs) → `@mkbabb/keyframes.js@5.0.0` + `@mkbabb/keyframes-vue@0.1.0` live on npm

**M precedes the 5.0.0 cut** if M waves introduce additional breaking changes or
gate infrastructure needed for a clean publish. The gate-apparatus consolidation
(M.W1-M.W4) does NOT require a version bump — it is kf-internal infrastructure.
The Band-B consume waves (glass-ui BB, value.js O) are not M-owned; they are
sibling-tranche events that M reacts to by running the born-RED deletion gates.

---

## 3. THE FOUR BREAKING CHANGES (not three — the FINAL under-counts)

The L FINAL §S6 (`docs/tranches/L/FINAL.md:141`) and the commit message for
`339d78b` both record "THREE breaking type changes." Ground-truth verification
of the source finds **four**:

| # | Symbol | Old name | New name | Source location | Disposition |
|---|---|---|---|---|---|
| 1 | class | `Animation` | `KeyframesAnimation` | `engine.ts:101` + `engine.ts:1192` | `@deprecated` alias kept (`engine.ts:1205`) |
| 2 | class | `ScrollTimeline` | `KeyframesScrollTimeline` | `timeline.ts:189` + `timeline.ts:209` | `@deprecated` alias kept (`timeline.ts:218`) |
| 3 | interface | `ScrollTimelineOptions` | `KeyframesScrollTimelineOptions` | `timeline.ts:153` + `timeline.ts:163` | `@deprecated` type alias kept (`timeline.ts:171`) |
| 4 | preset accessor | `presets.flip` | `presets.flipPreset` | `animations.ts:133` + `animations.ts:137` | `attentionPresets.flip` preserved (`animations.ts:856-857`) |

Breaking change #4 (`presets.flipPreset`) is documented `BREAKING (5.0.0)` at
`animations.ts:133` and is correctly surfaced in `dist/keyframes.d.ts` (re-verified
by the existing `proof:pkg3-clean` GREEN). It is **absent from the FINAL's §S3
"THREE breaking type changes" summary** — an inv ε under-count in the FINAL that
M must correct in the CHANGELOG draft before the cut fires.

Additionally, the compile surface has a **fifth breaking behavioural change** (not a
type rename, but a semantic contract break): `compileToCSS` now **REFUSES** multi-color
tracks that previously emitted silently-lossy output with `eligible:true`
(`compile-color.ts:188-190`; `FINAL.md §S1`). This is correctly called out in FINAL
§S6 point 1 as a breaking behavioural change, distinct from the type renames.

**M action:** author `proof:changelog-5.0.0` (born-RED on missing CHANGELOG entries
for all FIVE changes — four type/symbol renames + the compile-surface refusal) before
the cut fires.

---

## 4. THE DEPENDENCY GRAPH (what blocks what)

```
[glass-ui BB] publishes widened value.js peer + RF-17 + SegmentedTabs aria fix
         │
         ▼
kf re-pins ~4.1.0 in ONE commit that:
  • deletes both :aria-orientation="undefined" suppresses (proof:workaround-deletion S1 → GREEN)
  • deletes pointerHandled/onPlayPointerDown interim (proof:workaround-deletion S2 → GREEN)
  • proof:peer-satisfied → GREEN
         │
         ▼
merge tranche-l-dev → master (all kf-internal gates GREEN; report-all tripwires stay RED)
         │
         ▼
CI run → green → deploy-pages.yml auto-fires → keyframes.babb.dev serves new dist
         │
         ▼
USER: changeset version → 5.0.0
USER: git push v5.0.0 tag
         │
         ▼
release.yml fires:
  job publish:     check:lib → build:lib → test → proof:boundary →
                   proof:published-surface → proof:deps-current →
                   [born-RED report-all] proof:peer-satisfied →
                   npm publish --provenance --access public
                   → @mkbabb/keyframes.js@5.0.0 live
         │ needs: publish
         ▼
  job publish-keyframes-vue:
                   npm install (registry peers) → check → build →
                   npm publish --provenance --access public
                   → @mkbabb/keyframes-vue@0.1.0 live
         │
         ▼
proof:keyframes-vue-published clause (b) → GREEN (tripwire fired)
```

**The deploy round-trip is separately sequenced from the npm publish.** The
close-merge to master + auto-deploy fires as soon as the glass-ui BB re-pin lands
(the `proof:peer-satisfied` blocker is on the close-merge path, not literally a
hard gate on `proof:all` — it rides `continue-on-error: true` in `ci.yml`). The
version-cut tag fires the separate `release.yml` publish jobs. These are two distinct
events:

1. Deploy: master merge → CI green → CF Pages auto-deploy → `keyframes.babb.dev` updated
2. Publish: `v5.0.0` tag → `release.yml` → npm registry updated

They can occur in either order; the J.W0/K.WZ precedent is deploy-first,
publish-second (the version bump is not needed to serve the demo).

---

## 5. WHAT IS M-OWNED vs USER-DOMAIN

### M-owned (gates + prep + charter)

| Item | M wave | Gate | Status |
|---|---|---|---|
| CHANGELOG draft for 5.0.0 (all 5 breaking changes) | M.WZ-prep | `proof:changelog-5.0.0` (NEW, born-RED) | Does not exist yet |
| keyframes-vue source compat check against 5.0.0 renames | M.WZ-prep | `npm run check` in packages/keyframes-vue/ | Un-verified; M audits before cut |
| keyframes-react scaffold (gate-first, BOOK from L.W8) | M.W-REACT | `proof:keyframes-react-published` (born-RED) | BOOK only; no scaffold yet |
| `proof:changelog-5.0.0` authoring | M.WZ-prep | born-RED on missing entries | Author before cut |
| CHRONIC_LEDGER re-point K→L in proof-chronic-closure.mjs | DONE | `proof:chronic-closure` GREEN (exit 0, re-run above) | LANDED at `529fcfd` |
| proof:all roster reconciliation (3 reds cured) | DONE | proof:all GREEN | LANDED at `d7c7f3d` |
| Lighthouse re-verification on L dist (DL-L12) | M.WZ observe | `proof:lighthouse-mobile KF_REQUIRE_LH=1` | Gated on clean L dist (deploy) |
| TASTE verdict on L.W11 design packet | USER-DOMAIN boundary | no gate (user's "meets the bar") | USER-DOMAIN |

### USER-DOMAIN (Mike Babb fires)

| Item | Tripwire / precondition |
|---|---|
| `changeset version` → `5.0.0` (or `4.4.0`) | M audit supplies criteria + CHANGELOG gate; user resolves the MAJOR/MINOR decision |
| `git push v5.0.0` (tag fires `release.yml`) | kf-internal gates GREEN; CHANGELOG gate GREEN |
| `@mkbabb/keyframes.js@5.0.0` npm publish | `release.yml` job fires on tag |
| `@mkbabb/keyframes-vue@0.1.0` npm publish | `release.yml` `publish-keyframes-vue` job, `needs: publish` |
| Close-merge tranche-l-dev → master | glass-ui BB re-pin + all kf-internal gates GREEN |
| deploy round-trip re-observation | CI green → deploy-pages.yml → observe live hash |
| TASTE verdict (L.W11 design) | user's explicit "meets the bar" on the taste-packet |

---

## 6. DOES M PRECEDE OR FOLLOW THE 5.0.0 CUT?

**The minimum M obligation for the 5.0.0 cut is M.WZ-prep — the CHANGELOG gate and the
keyframes-vue source compat check — not M's full apparatus consolidation waves
(M.W1–M.W4).**

The gate-apparatus consolidation (M.W1–M.W4) is kf-internal infrastructure. It does
not gate the 5.0.0 cut; it can land in M waves that follow the cut. The only
pre-cut M obligations are:

1. `proof:changelog-5.0.0` authored and GREEN (correct count of all 5 breaking changes; cited entries present in CHANGELOG)
2. `packages/keyframes-vue/src/` audited for 5.0.0 type renames (`Animation` → `KeyframesAnimation` etc.)
3. The glass-ui BB consume-wave lands (re-pin, workaround deletions) enabling `proof:peer-satisfied` GREEN → close-merge → CI green

The apparatus waves (M.W1–M.W4) represent a separate architectural axis that is
INDEPENDENT of the version-cut trigger. They should be chartered in M but can land
after the 5.0.0 cut without blocking it.

---

## 7. PRECEPT VIOLATIONS IN L-AS-BUILT (user-domain scope)

**PV-1 — inv ε under-count (FINAL.md:141-142 + FINAL.md:274-275).**
The FINAL §S6 summary records "THREE breaking type changes" but four symbol renames
are documented `BREAKING (5.0.0)` in source (`animations.ts:133` + `engine.ts:1192`
+ `timeline.ts:163,209`). This is a documentation gap, not a regression. The
`@deprecated` aliases preserve the value import paths; the type rename IS the
breaking change. Severity: LOW (inv ε correction needed in CHANGELOG and the
5.0.0 migration guide; no source correction required). **M must correct this before
the cut.**

**PV-2 — F-2 peer-cycle LIVE (proof:peer-satisfied RED, exit 1, re-run above).**
glass-ui@4.0.0 peer `@mkbabb/value.js "^0.10.0||^0.11.0"` rejects the installed
0.13.0. Any consumer today that installs `@mkbabb/keyframes.js` + `@mkbabb/glass-ui`
gets `ELSPROBLEMS`. This is a pre-existing violation tracked as DL-L3 and
correctly gated born-RED-by-design at `proof:peer-satisfied`. The fix is glass-ui BB
(not kf-internal); **M MUST NOT paper over it with `npm overrides` or
`peerDependenciesMeta.optional`** (the no-workaround precept is explicit on this:
`KF-TO-GLASSUI-BB-ASKS.md §3`). Until glass-ui BB publishes the widened range,
the workaround-deletion gates correctly stay PENDING.

**PV-3 — No `proof:changelog-5.0.0` gate exists.**
The release pipeline (`release.yml`) does not assert the CHANGELOG records all
breaking changes before publish. `release.yml` runs `check:lib → build:lib → test →
proof:boundary → proof:published-surface → proof:deps-current`. No CHANGELOG
completeness gate is present. A publish with an incorrect (or absent) CHANGELOG
is not blocked. This is a MISSING GATE for M to author.

**PV-4 — keyframes-vue 5.0.0 type compat un-verified.**
`packages/keyframes-vue/src/Keyframes.ts` has not been audited for residual
`Animation` / `ScrollTimeline` / `ScrollTimelineOptions` type references. The
peer floor is `>=4.3.0` (satisfied by 5.0.0), but if the adapter's source
references the OLD names directly, a `npm run check` in `packages/keyframes-vue/`
will fail on the version-cut tree. This is an un-verified pre-cut obligation.
M.WZ-prep must run `npm run check` in the adapter directory against the 5.0.0
named types before the tag fires. Evidence: `packages/keyframes-vue/src/` (not
read in this pass; the obligation is to read + verify, not to assume clean).

---

## 8. M-WAVE PROPOSALS

### M.WZ-prep — publish-path hardening (the pre-cut obligations)

**Class:** PREP-FOR-CUT · **Gate:** `proof:changelog-5.0.0` (born-RED on missing
CHANGELOG entries; must name all 5 breaking changes: 4 type renames + the
compile-surface multi-color refusal)

**Steps:**
1. Author `proof:changelog-5.0.0`: read `CHANGELOG.md` (or the changeset files);
   assert (a) `Animation → KeyframesAnimation` entry present, (b)
   `ScrollTimeline → KeyframesScrollTimeline` present, (c)
   `ScrollTimelineOptions → KeyframesScrollTimelineOptions` present, (d)
   `presets.flip → presets.flipPreset` present, (e) multi-color compile refusal
   present. Gate born-RED on any missing entry.
2. Audit `packages/keyframes-vue/src/` for residual OLD-name type references.
   Run `npm run check` in the adapter directory.
3. Optionally author `proof:keyframes-react-published` gate-first (born-RED:
   `packages/keyframes-react/` absent from tree; clause b E404) per the L.W8-react-book
   BOOK criteria. The gate scaffolds before any source.

**DAG:** M.WZ-prep precedes the 5.0.0 cut. The apparatus waves (M.W1–M.W4) can
follow the cut.

**Precept note:** `proof:changelog-5.0.0` must be wired as a pre-publish gate step
in `release.yml` — not just a local gate — so a publish without a correct CHANGELOG
is blocked by construction. The current `release.yml` has no CHANGELOG completeness
gate (`release.yml:1–148` verified — the roster is `check:lib → build:lib → test →
proof:boundary → proof:published-surface → proof:deps-current → [report-all]
proof:peer-satisfied → npm publish`).

### M.W-REACT-ADAPTER — `packages/keyframes-react/` scaffold

**Class:** SHIP-in-M · **Gate:** `proof:keyframes-react-published` (born-RED:
scaffold absent; clauses a+c GREEN on scaffold; clause b USER-DOMAIN)

**Dep:** 5.0.0 cut landed (peer floor `>=5.0.0` as the BOOK records). The
gate-first discipline (`L.W8-react-book.md §6`): author `proof:keyframes-react-published`
BEFORE any scaffold source.

### (Note: the apparatus consolidation waves M.W1–M.W4 are separately chartered in
lane-13. They do not gate the 5.0.0 cut and are independent of this lane.)

---

## 9. CROSS-REPO ASKS

### glass-ui BB (the deployment unblocker — HIGHEST URGENCY)

All three of the following must land in glass-ui BB for the deploy round-trip to
unblock:

| Ask | What | kf-side gate | Status |
|---|---|---|---|
| Widen `@mkbabb/value.js` peer range to admit 0.13.0+ | `KF-TO-GLASSUI-BB-ASKS.md §3` | `proof:peer-satisfied` (born-RED exit 1, re-run above) | LIVE defect — ELSPROBLEMS on every kf+glass-ui consumer |
| SegmentedTabs pill-variant: omit aria-orientation on role=group | `KF-TO-GLASSUI-BB-ASKS.md §1` | `proof:workaround-deletion` S1 PENDING | demo carries both suppress-lines; fleet-wide blast radius = 2 strip sites |
| W-DOCK-MORPH-FAMILY / RF-17 dock-flicker | `KF-TO-GLASSUI-BB-ASKS.md §2` | `proof:workaround-deletion` S2 PENDING | demo carries pointerHandled/onPlayPointerDown interim; chronicity 3 (I,J,K→L); no 4th carry |

The peer range widen is the minimum for `proof:peer-satisfied` to go GREEN. The
S1/S2 workaround deletions are the minimum for `proof:workaround-deletion` to go
GREEN on those arms. All three are gated on the SAME glass-ui BB release
(nominally 4.1.0); they should land together.

**kf's obligation:** Do NOT paper over the F-2 peer cycle with `npm overrides` or
`peerDependenciesMeta.optional`. The no-workaround precept and `inv-L-acyclic-purity`
jointly forbid it (`KF-TO-GLASSUI-BB-ASKS.md §3`; `PROGRESS.md §"Open deferrals"
DL-L10`).

### value.js O (the workaround-deletion unlock)

`proof:workaround-deletion` S7/S8/S9 go GREEN only when value.js O (0.14.0) ships
the VJ-L2 `linear()` fix + VJ-L1 `flatLeaf` API + VJ-L3 `parseCSSSubValue`. This
is NOT on the deploy-round-trip critical path (the deploy unblocks on glass-ui BB
alone); it is on the workaround-cleanliness path. The PENDING-state exit-0 is the
correct posture.

### parse-that (indirect — through value.js)

The direct `@mkbabb/parse-that` production dep at `utils.ts:1` (workaround S9)
deletes when value.js VJ-L3 `parseCSSSubValue` ships. parse-that's own waves (PT-WAVE-4
typesVersions surgery, PT-WAVE-6 packrat soundness) are value.js-mediated; kf does not
re-pin parse-that independently after the S9 deletion.

---

## 10. DEFERRED FOLDS FOR M

| Item | Source | Tripwire / owner | M action |
|---|---|---|---|
| DL-L3 F-2 peer-cycle cure | `PROGRESS.md DL-L3` | glass-ui BB peer-widen; `proof:peer-satisfied` → GREEN | HANDOFF — glass-ui-owned; M consumes the re-pin |
| DL-L6 RF-17 dock-flicker | `PROGRESS.md DL-L6` | glass-ui 4.1.0 W-DOCK-MORPH-FAMILY; `proof:workaround-deletion` S2 → GREEN | HANDOFF — glass-ui-owned; chronicity 3, no 4th carry |
| DL-L10 workaround sweep (S7/S8/S9) | `PROGRESS.md DL-L10` | value.js O (0.14.0) VJ-L1/L2/L3; `proof:workaround-deletion` S7/S8/S9 → GREEN | HANDOFF — value.js-owned |
| CHANGELOG under-count (3→4 type renames) | `FINAL.md:141-142`; `animations.ts:133` | M.WZ-prep | Author `proof:changelog-5.0.0`, correct CHANGELOG |
| keyframes-vue compat check | `packages/keyframes-vue/src/` | pre-cut M.WZ-prep | Run `npm run check` in adapter dir against 5.0.0 types |
| `proof:changelog-5.0.0` gate | gap | M.WZ-prep | Author born-RED; wire into `release.yml` pre-publish step |
| `proof:keyframes-react-published` gate | `L.W8-react-book.md §6` | M.W-REACT-ADAPTER | Author gate-first before scaffold |
| DL-L12 Lighthouse re-verify | `PROGRESS.md DL-L12` | deploy-round-trip (built L dist) | Re-run `proof:lighthouse-mobile KF_REQUIRE_LH=1` on L dist |
| TASTE verdict (L.W11) | `FINAL.md §S4` | user's "meets the bar" | USER-DOMAIN — no gate; agent pass is corroboration |

---

## 11. PERF NUMBERS

No new perf measurements are specific to the user-domain finale. The relevant
published numbers from L:

- `proof:spring-vector` — 3.8× win measured at K=8 (commit `d858044`; `FINAL.md §S4`)
- `proof:zero-alloc` — 7/7 passed on the LIGHT tier NumericAnimation/SpringProgress
  zero-alloc paths (commit `d858044`)
- `proof:lighthouse-mobile` K floors (pending L dist re-verify): home 68 / cube 66 /
  amiga 52 / square 65 / easing 63 / spring 55
- The gate-apparatus perf numbers (lane-13): ~15–31 min `proof:all`, ~2.5–3h
  iterate-to-green — those are M.W1–M.W4's domain, not this lane's

---

## 12. EVIDENCE INDEX

| Claim | Verified at |
|---|---|
| Current version = 4.3.0 | `package.json` `version` field |
| kf@4.3.0 published | `npm show @mkbabb/keyframes.js` (run, seen above) |
| keyframes-vue E404 | `npm show @mkbabb/keyframes-vue` (run, seen above) |
| glass-ui@4.0.0 published | `npm show @mkbabb/glass-ui` (run, seen above) |
| proof:peer-satisfied exit 1 | run above; output reproduced |
| proof:keyframes-vue-published exit 1 | run above; output reproduced |
| proof:workaround-deletion exit 0 PENDING | run above; output reproduced |
| proof:control-point-live exit 1 | run above; output reproduced |
| proof:chronic-closure exit 0 GREEN | run above; 20 rows; L ledger |
| CHRONIC_LEDGER points at L/PROGRESS.md | `scripts/proof-chronic-closure.mjs:114` |
| Four breaking changes in source | `animations.ts:133`; `engine.ts:1192`; `timeline.ts:163,209` |
| FINAL §S6 says "THREE" | `docs/tranches/L/FINAL.md:141-142` + `FINAL.md:274-275` |
| release.yml both publish jobs | `.github/workflows/release.yml:1–148` (read directly) |
| keyframes-vue peer floor >=4.3.0 | `packages/keyframes-vue/package.json` |
| keyframes-vue dist artifacts present | `packages/keyframes-vue/dist/` (ls) |
| validate() HEAVY path via loadAnimationEngine | `src/animation/load-engine.ts:74-76,440-494` |
| validate/explain types barrel-exported | `src/animation/index.ts:202` |
| proof:changelog-5.0.0 does NOT exist | `ls scripts/proof-changelog* → no matches`; package.json grep |
| release.yml has no changelog gate | `.github/workflows/release.yml:1–148` roster inspection |
| ELSPROBLEMS is LIVE today | `proof:peer-satisfied` output: `glass-ui@4.0.0 declares peer @mkbabb/value.js "^0.10.0||^0.11.0" but installed is 0.13.0` |
| S2 aria-orientation blast radius = 2 strips | `KF-TO-GLASSUI-BB-ASKS.md §1` + `grep variant="pill" demo/` evidence cited therein |
| DL-L6 chronicity 3 = no 4th carry | `PROGRESS.md DL-L6` Chronicity `3 (I,J,K→L)` |
| proof:all three reds cured | `FINAL.md §S6` + commit `d7c7f3d` + `FINAL.md:35-45` |
| close-merge to master = tranche-l-dev pending | `git log tranche-l-dev` (tip `529fcfd`) — on dev branch, not yet on master |
