# Lane R1-03 — Working-Tree Transaction Classification

Finding-ID prefix: `WT-`
Date: 2026-07-16
Checkout HEAD: `a59d3a22da080a8ed224e8d675112bb3bb0135b0` (`v5.3.5`, stale K5 base)
Authority read: `docs/tranches/U/AGENTIC-HANDOFF-2026-07-16.md` (read in full)

## Verdict

The working-tree split described by the handoff is **substantively accurate and fully
reconcilable byte-for-byte**. Every one of the 254 pending paths classifies cleanly into
exactly one of the four buckets, with **zero STRAY paths** and **zero working-tree drift
from immutable Keyframes 6**. The 65-path consumer slice is provably the exact set the
handoff names (60 tracked-modified + 1 tracked-delete + 4 untracked-new), and it is cleanly
separable from the 185 K6-producer paths and 4 documentation-slice paths.

Two facts materially improve on the handoff's own stated preconditions:

1. The K6 commit object `5a9183a7…` **is now present in this checkout's object DB** (handoff
   §3 said it was absent). Its tree is `da7107600d237a49f6daa2064366c2b8ffe91cc0`, which
   matches handoff §2 exactly — so I verified the entire producer partition directly against
   the immutable K6 tree rather than by proxy.
2. `package.json` (`57b33882…`) and `package-lock.json` (`525ffcdf…`) SHA-256 match the
   handoff identities exactly, and all 20 untracked producer files + spot-checked producer-M
   files are **git-blob-identical** to K6.

The one real deliverable I could **not** complete is independent reproduction of the published
65-path manifest hash `a26e6a06…`: the handoff's recipe string ("sorted status + file SHA +
path, SHA-256") is not pinned to a concrete serialization, and 108 plausible encodings failed
to reproduce it. The *set* is verified; the *published digest* is not independently
confirmable from the document alone (WT-01).

Severity ceiling for this lane is **P2** — no live product or false-close defect; the findings
are reproducibility/staleness risks the reconstruct-on-K6 recipe (§5) must own.

---

## Classification summary (reconciles to `git status --porcelain` = 254)

| Bucket | M | D | untracked | total |
|---|---:|---:|---:|---:|
| (a) 65-path Glass-7 demo-consumer slice | 60 | 1 | 4 | **65** |
| (b) K6 producer content (dirty vs stale K5 base) | 159 | 6 | 20 | **185** |
| (c) documentation slices (`docs/tranches/**` additions) | 0 | 0 | 4 | **4** |
| (d) STRAY | 0 | 0 | 0 | **0** |
| **Total** | **219** | **7** | **28** | **254** |

Column totals match the raw status exactly: `219 M`, `7 D`, `28 ??` → 254.

### How the buckets were separated (method)

`git diff --name-status 5a9183a7` (working tree vs immutable K6) yields 81 tracked entries:
60 `M` + 21 `D`. The 60 `M` are exactly the consumer-tracked slice. Of the 21 `D`, **20 are
false-deletes**: files that exist in K6 and are physically present on disk but are untracked
in the K5 index, so `git diff` against K6 reports them absent. Each of those 20 was verified
`git hash-object`-identical to its K6 blob (bucket b). The remaining 1 `D`
(`demo/state/controlSurfaceDFA.ts`) exists in K6 and is genuinely deleted on disk → consumer
slice. Untracked-not-in-K6 files split into 4 genuine consumer additions and 4 doc slices.

---

## (a) The 65-path Glass-7 demo-consumer slice — CONFIRMED EXACT

Status shown is the **K6-relative** status (what a clean K6 clone would report). SHA is
`git hash-object` of the current working content.

### 55 `demo/**` paths (52 M + 1 D + 2 untracked)

| st | blob (git SHA-1) | path |
|---|---|---|
|  M | ae855722 | demo/app/dock/ChromeDock.vue |
|  M | aa76221e | demo/app/dock/MbabbMenu.vue |
|  M | 7c1a71e9 | demo/components/instrument/keyframes/CSSCodeEditor.vue |
|  M | 4a2ba5e5 | demo/components/instrument/keyframes/KeyframesEditor.vue |
|  M | a35b07ce | demo/components/instrument/keyframes/KeyframesStringControls.vue |
|  M | 7344cce5 | demo/components/instrument/keyframes/composables/useKeyframeOps.ts |
|  M | fc1c7f4d | demo/components/instrument/keyframes/composables/useKeyframesParsing.ts |
|  M | f4f66ae2 | demo/components/instrument/keyframes/composables/useKeyframesState.ts |
|  M | e1be13ad | demo/components/instrument/keyframes/utils/parseAnimationCSS.ts |
|  M | ffd5386e | demo/components/instrument/shell/EditorHeader.vue |
|  M | 0bae43fd | demo/components/instrument/shell/EditorShell.vue |
|  M | 42177f44 | demo/components/instrument/shell/SharePopover.vue |
|  M | 2eb250f1 | demo/components/instrument/shell/TypingDots.vue |
|  M | 981bc232 | demo/components/instrument/timeline/KeyframeTimeline.vue |
|  M | 015c28f3 | demo/components/instrument/timeline/composables/useTimelineBuild.ts |
|  M | cb3bfc8b | demo/components/instrument/timeline/composables/useTimelineOps.ts |
|  M | 18bcc52a | demo/components/instrument/timeline/timelineTypes.ts |
|  M | 87af7259 | demo/components/instrument/timeline/utils/flattenVars.ts |
|  M | c82aecf9 | demo/components/instrument/timeline/utils/snapshotCapture.ts |
|  M | 4f41adc5 | demo/components/instrument/timeline/utils/timelineEngine.ts |
|  M | f15ded0b | demo/components/instrument/transport/TransportDock.vue |
|  M | cd306e24 | demo/components/instrument/transport/channel-controls/ChannelControls.vue |
|  M | 2c1e23e3 | demo/components/instrument/transport/channel-controls/ChannelOptions.vue |
|  M | 0db9510f | demo/components/instrument/transport/channel-controls/LayerConfigPanel.vue |
|  M | db3f6439 | demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue |
|  M | d80c947f | demo/components/instrument/transport/channel-controls/composables/useTimingFunctionEditor.ts |
|  M | 559c4edb | demo/components/instrument/transport/controls-pane/RibbonBar.vue |
|  M | aad98ce4 | demo/components/playback/AnimationVisualizer.vue |
|  M | 8b9924b9 | demo/components/playback/PlaybackRibbon.vue |
|  M | 380ec410 | demo/composables/scene-runtime/useSweepScene.ts |
|  M | bebb6293 | demo/scenes/amiga/AmigaScene.vue |
|  M | 47082b84 | demo/scenes/amiga/useAmigaDemo.ts |
|  M | 9e11a67e | demo/scenes/cube/matrix-editor/MatrixEditor.vue |
|  M | 9ecd7ae6 | demo/scenes/cube/matrix-editor/transformMath.ts |
|  M | 0c976548 | demo/scenes/cube/matrix-editor/useTransformState.ts |
|  M | b95aa3e5 | demo/scenes/cube/useCubeDemo.ts |
|  M | f80cd1a1 | demo/scenes/easing/EasingSidebar.vue |
|  M | 316b22d2 | demo/scenes/easing/EasingTarget.vue |
|  M | 4a12d6c0 | demo/scenes/easing/useEasingDemo.ts |
|  M | 6a2c124c | demo/scenes/sequence/SequenceTarget.vue |
|  M | e0622497 | demo/scenes/sequence/useSequenceDemo.ts |
|  M | 8729295f | demo/scenes/spring/SpringPhysicsFacet.vue |
|  M | a8716346 | demo/scenes/spring/StartingStyleTarget.vue |
|  M | 2bdb1eb6 | demo/scenes/square/SquareScene.vue |
|  M | cf648c2c | demo/scenes/square/useSquareDemo.ts |
|  M | 166da445 | demo/scenes/square/useSquareTumble.ts |
|  M | df3bea27 | demo/state/animationOptionsStore.ts |
|  D | (in K6; deleted on disk) | demo/state/controlSurfaceDFA.ts |
|  M | 5e16f393 | demo/state/index.ts |
|  M | b845409f | demo/state/useSceneMachine.ts |
| ?? | 7df43f49 | demo/utils/formatEditorCSS.ts |
| ?? | 9110ec96 | demo/utils/keyframeSelector.ts |
|  M | df0910d8 | demo/utils/reference-data/animationDescriptions.ts |
|  M | a4f21900 | demo/utils/reference-data/easingGroups.ts |
|  M | d726a57c | demo/utils/reference-data/timingCurveUtils.ts |

### 6 `test/demo/**` paths (4 M + 2 untracked)

| st | blob | path |
|---|---|---|
|  M | 23bfa150 | test/demo/instrument/resize-tracks.test.ts |
|  M | eb0be95e | test/demo/instrument/timeline-undo.test.ts |
|  M | 0361d38a | test/demo/scenes/cube-scene.test.ts |
|  M | 706ea706 | test/demo/state/control-surface-dfa.test.ts |
| ?? | add7a823 | test/demo/instrument/value4-editor-boundary.test.ts |
| ?? | 4b535245 | test/demo/reference-data/easing-catalog.test.ts |

### 4 remaining slice paths

| st | blob | path |
|---|---|---|
|  M | c158c6fa | docs/tranches/U/FINAL-U.md |
|  M | f582c068 | docs/tranches/U/KF-TO-GLASSUI-U.md |
|  M | 2a4c8ce1 | .github/workflows/deploy-pages.yml |
|  M | b89ea419 | scripts/observe/demo/subject-animates.mjs |

**Slice total: 55 + 6 + 4 = 65.** The four handoff-named untracked consumer files
(`demo/utils/formatEditorCSS.ts`, `demo/utils/keyframeSelector.ts`,
`test/demo/instrument/value4-editor-boundary.test.ts`,
`test/demo/reference-data/easing-catalog.test.ts`) are all present and all absent from K6
(verified `git cat-file` NOT-K6), i.e. genuine additions. `test/demo/reference-data/`
contains exactly `easing-catalog.test.ts` (no siblings).

---

## (b) K6 producer content — 185 paths, VERIFIED IDENTICAL TO IMMUTABLE K6

These are dirty **only** because the local index is at K5. Every one was verified against the
K6 commit tree `da71076…`.

- **159 tracked `M`** (219 total M − 60 consumer M). None appear in `git diff 5a9183a7`, which
  proves each is byte-identical to K6. Spot-verified `git hash-object == K6 blob` for
  `package.json`, `package-lock.json`, `README.md`, `src/animation/index.ts`,
  `src/animation/waapi/densify.ts`, `vite.config.ts` (all MATCH). `package.json`
  SHA-256 = `57b33882…` and `package-lock.json` SHA-256 = `525ffcdf…` match handoff §3/§2.
- **6 tracked `D`**: `bench/group-soa-validate.mjs`, `scripts/gates/surface/deps-current.mjs`,
  `src/animation/compile/parse-flatten.ts`, `src/animation/compile/plain-vars.ts`,
  `test/characterization/scene-entries.test.ts`, `test/compile/plain-vars.test.ts`. All
  verified **absent** from the K6 tree → deletions already committed in the producer
  transaction, not consumer edits.
- **20 untracked, present-on-disk, git-blob-identical to K6** (the "false-D" set):
  `docs/MIGRATION-6.0.0.md`; `src/animation/compile/{compiled-frame,interp-slot,value-ast}.ts`,
  `src/animation/compile/emit/css-text.ts`, `src/animation/engine/compiler-state.ts`,
  `src/animation/group/composite-storage.ts`, `src/animation/internal/helpers.ts`,
  `src/animation/resolve/browser.ts`; `test/compile/{authored-values,frame-compiler-value4,
  interp-slot,selector-value4,structural-emit,value4-color-emit,value4-easing-contract}.test.ts`;
  `test/group/structural-composition.test.ts`, `test/resolve/value4-immutable-resolve.test.ts`,
  `test/waapi/value4-layout-eligibility.test.ts`; **and `test/demo/scene-entries.test.ts`**
  (handoff §3: "belongs to the K6 producer base … never copy or count it as a 66th consumer
  path" — confirmed IN-K6, so it is correctly excluded from the 65).

---

## (c) Documentation slices — 4 untracked, not in K6, not in the 65

| path | disposition per handoff |
|---|---|
| docs/tranches/U/AGENTIC-HANDOFF-2026-07-16.md | §3/§5.12: keep as separate doc slice; explicitly NOT in the 65-manifest |
| docs/tranches/U/ATLAS-INBOUND-2026-07-16-consumer-crossing-report.md | **unaddressed** by §5 recon recipe (see WT-03) |
| docs/tranches/U/GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md | **unaddressed** by §5 recon recipe (see WT-03) |
| docs/tranches/V/ | this audit's own directory (post-handoff) |

---

## (d) STRAY — none

No path failed classification. No working-tree file drifted from immutable K6. The producer
partition is byte-clean against the published commit; the consumer partition is exactly the
handoff's 65.

---

## Findings

### WT-01 — Published 65-path manifest hash `a26e6a06…` is not independently reproducible from the handoff recipe (P2, reproducibility)

`mechanism-family: unpinned-serialization`

Handoff §3 states the 65-path manifest is "measured as sorted `status + file SHA + path`,
SHA-256 = `a26e6a06bf89a07841d9f099ea205f29f6f5d11257a27a31999eab87c320c8a9`", and §5 step 4
instructs the reconstructing agent to "Recompute the complete 65-path manifest and compare it
with `a26e6a06…`". The recipe does not pin: (1) status token form (` M` vs `M` vs porcelain
XY vs porcelain-v2), (2) whether "file SHA" is the git blob SHA-1 or a SHA-256 of content,
(3) how a deleted entry contributes a SHA, (4) field/line separators, (5) trailing newline.

I built the exact 65-entry set (verified above) and swept **108 encoding combinations**
(3 status forms × 2 SHA kinds × 3 delete-SHA policies × 3 separators × 2 trailing-newline
options). **None reproduced `a26e6a06…`.**

Evidence: script at classification step; output `no combo matched target among 108 tried`.

Impact: the future §5-step-4 comparison is only meaningful if the reconstructing agent uses
the *same unspecified script*. As written, the digest is a bare assertion — a green check that
cannot fail for the right reason. Because the 65-*set* is fully verified here by direct K6
diffing (a stronger guarantee than a digest match), the risk is bounded, but the handoff's
own verification gate is effectively vacuous.

Disposition — **build**: in the K6-successor reconstruct wave, replace the bare digest with a
committed `scripts/…/manifest.mjs` (or inline the exact `git status --porcelain=v2` +
`sha256sum` pipeline) so the recompare is reproducible; regenerate `a26e6a06…` from that
pinned script and record the command alongside it.

### WT-02 — §5 numeric guards are stale (254 pending / 28 untracked vs stated 226–250 / 24) (P3, stale-count)

`mechanism-family: stale-status-prose`

Handoff §3 records "219 modified, 7 deleted, and 24 untracked paths"; §5 step 4 warns "Do not
copy the 226/250-path mixed owner-tree transaction wholesale." Observed now:
`git status --porcelain | wc -l` = **254** (219 M + 7 D + **28** untracked). The 4 extra
untracked are all post-handoff additions: `AGENTIC-HANDOFF-2026-07-16.md` (self),
`ATLAS-INBOUND-…md`, `GLASS-INBOUND-…md`, and `docs/tranches/V/` (this audit). M/D counts are
unchanged, so the producer/consumer partition is intact.

Impact: an agent literally checking "226/250" or "24 untracked" as a tripwire will see a
mismatch that is benign. Not a defect, but the guard numbers no longer match reality.

Disposition — **fold**: when the handoff is next touched, restate the count as "65 consumer +
185 producer + N doc slices" (partition-relative, base-stable) rather than an absolute
worktree count that drifts every time a doc lands.

### WT-03 — Two inbound crossing docs have no disposition in the §5 staging recipe (P3, unaccounted-doc-slice)

`mechanism-family: unrouted-artifact`

`docs/tranches/U/ATLAS-INBOUND-2026-07-16-consumer-crossing-report.md` and
`docs/tranches/U/GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md` are untracked,
absent from K6, and absent from the 65-path slice. §5 step 12 tells the reconstructing agent
to stage "the reconstructed 65-path consumer slice, the necessary exact Glass/package-lock
update, and only those directly named documentation corrections," and to "Keep this handoff
as a separate documentation slice." It names the handoff but **not** these two inbound reports.

Impact: on reconstruct, these two files have no explicit route — they will either be silently
dropped (lost coordination record) or swept in without a decision. Low severity, but a named
clause is cheaper than a lost artifact.

Disposition — **fold**: add both inbound reports to the handoff's "separate documentation
slice" clause (or explicitly mark them local-only/not-committed) so their fate is decided, not
incidental.

---

## Negatives (checked and found sound)

- **65-path set is exact.** 60 M + 1 D + 4 untracked-new, derived independently via
  `git diff 5a9183a7` (working tree vs K6) minus the 20 verified false-D producer files. Every
  handoff-named member is present; no 66th path leaks in.
- **Full 254-path reconciliation.** (a) 65 + (b) 185 + (c) 4 + (d) 0 = 254 = raw
  `git status --porcelain` count; per-status totals 219 M / 7 D / 28 ?? all match.
- **K6 commit object present and genuine.** `git cat-file -t 5a9183a7` = commit; its tree
  `da7107600d237a49f6daa2064366c2b8ffe91cc0` equals handoff §2's "Source tree". (Handoff §3's
  "the local object database did not contain 5a9183a7…" is now outdated — it has since been
  fetched.)
- **Producer partition is byte-clean vs immutable K6.** 20 untracked producer files all
  `git hash-object`-identical to K6; 6 producer deletions confirmed absent from K6; 6
  spot-checked producer-M files identical; the 159 producer-M set as a whole is absent from
  `git diff 5a9183a7` (⇒ identical to K6). No masked drift.
- **Producer-file identities match handoff.** `package.json` SHA-256 `57b33882…`,
  `package-lock.json` SHA-256 `525ffcdf…` — exact.
- **Consumer-vs-producer boundary is disjoint.** `demo/state/controlSurfaceDFA.ts` exists in
  K6 (genuine consumer delete); `test/demo/scene-entries.test.ts` exists in K6 (correctly a
  producer path, not a 66th consumer path); `demo/utils/formatEditorCSS.ts` and
  `demo/utils/keyframeSelector.ts` are genuinely absent from K6 (real consumer additions).
- **`test/demo/reference-data/`** holds exactly one file, `easing-catalog.test.ts`, matching
  the handoff's named untracked consumer file — no hidden extra entries in the untracked dir.
- **STRAY bucket is empty.** Nothing fails to classify; no unexplained working-tree content.

## Coverage gaps

- **Manifest digest not confirmed.** I verified the 65-path *set and content* directly against
  K6 (stronger than a digest), but could not confirm the *published digit string* `a26e6a06…`
  corresponds to this set — the recipe is unpinned (WT-01). If a stronger guarantee is
  required, the original manifest script must be recovered.
- **npm tarball bytes not re-hashed.** I verified producer content against the K6 *git commit
  tree* (whose sha matches the handoff), not the packed `keyframes.js-6.0.0.tgz` (SHA-256
  `77d8860…`). Packed-file-level identity (dist/declaration bytes) is out of this lane; see the
  producer-validation / packed-consumer lanes.
- **No build/test execution.** Whether the reconstructed slice compiles/passes on K6 + a real
  Glass 7 is out of lane (§5 steps 8–11 and the check/test/build lanes own it).
- **Glass 7 edge unverified.** The consumer slice's Glass-7 API migration correctness (18
  named components) is a source-review lane, not a worktree-classification concern.
