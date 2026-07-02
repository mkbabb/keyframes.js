# Lane a11-w6-core — R.W6-core audit (brittleness · state · styling)

## Executive summary

R.W6-core is one of the most honestly-shipped waves in Tranche R: every Band A/B/C spec item I
checked landed in the code, `proof:brittleness` (clauses 4/5/6 extended exactly as spec'd) is
GREEN in the current tree, and the state-drift/styling excisions (C.1–C.5) are clean, complete,
and grep-verified zero-hit. The `iosTextEntry.ts` rewrite the task flagged is real but is a
**different wave's item** (R.W3 §2F) opportunistically folded into the same commit
(`0a33f5a`) — it shipped exactly as R.W3 spec'd it, so it is not a R.W6 fabrication, but the
spec's own design trades away constructor-injection testability for a global-reading idiom, and
the `CSS.supports` feature-detect — while a real, defensible WebKit-only trick — has one
un-guarded edge (`CSS` itself is never existence-checked, unlike `navigator`).

Two things are genuinely soft:

1. **Band B's own numeric target quietly missed and never re-reported.** R.W6.md's Band B
   "Expected outcome" is explicit: `ControlsPaneWrapper.vue` and `AnimationControlsGroup.vue`
   (both ~499L pre-fix) "drop under 400L." Post-fix they are 497L and 477L — barely moved, both
   still over 400L, both still over even the repo-wide 500L `proof:demo-no-oversize` ceiling's
   *safety margin*. PROGRESS.md/FINAL.md never restate or reconcile this miss; the wave is
   declared GREEN against the general 500L gate, silently substituting the weaker repo-wide bar
   for the wave's own tighter local target.
2. **The DM-1/DM-5 "no 9th/7th carry HARD STOP" item — R.W6.md §1 and §C.6's own words: "land
   here [R.W6] ... no 9th carry on DM-1"** — is declared satisfied under a wave label
   (`R.W6-decomp`) that did not exist in the R.W6.md spec and was created *after*
   `R.W6-core ✅ GREEN` was already committed to PROGRESS.md. The work is real, sound, and
   verified (`proof:workaround-deletion` S1/S2 GREEN), but the sequencing means "R.W6-core GREEN"
   was declared with its own spec's chronic-ledger HARD STOP item still outstanding.

Neither issue is a functional regression — the demo works, the gates are honest about what they
check — but both are exactly the kind of self-graded milestone-slippage Tranche S should stop
normalizing.

## Findings

### 1. [MEDIUM] Band B's explicit "<400L" outcome silently missed, never re-verified in closing docs

**Evidence:** R.W6.md §2 Band B, "Expected outcome: both ~499L files drop under 400L." Pre-fix
sizes (verified via `git show a15cd48:...`):
`demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` = 499L,
`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` = 498L. Current tree
(`wc -l`, `18e8617`): `ControlsPaneWrapper.vue` = 497L, `AnimationControlsGroup.vue` = 477L.
R.W6.md §5 step 8 lists this exact `wc -l ... under 400L` check as a post-Band-B verification
gate. `grep -rn "ControlsPaneWrapper\|AnimationControlsGroup\|400L\|499L" docs/tranches/R/PROGRESS.md docs/tranches/R/FINAL.md`
returns zero hits on either filename — the closing docs never restate this specific check's
outcome, pass or fail. `proof:demo-no-oversize`'s `CEILING` (`scripts/proof-demo-no-oversize.mjs:39`)
is 500, a repo-wide bar unrelated to the wave's own 400L target — both files pass the weaker gate
(497 ≤ 500, 477 ≤ 500) while failing the wave's own stated target.

**Failure scenario:** anyone reading PROGRESS.md's "R.W6-core ✅ GREEN ... `proof:brittleness`
9/9 green" line reasonably infers the wave's own numeric commitments were also met. Both files
are still large, tangled hand-off surfaces (497L/477L) for the next agent doing further Band-B
style work on the animation-controls suite in Tranche S — the "frees ~80 lines from both files"
promise landed a `useControlsLayout` move (real, verified above) but the compounding effect the
spec predicted (structural drop under 400) never happened, most likely because other code grew
into the freed space in the same commits (B.2/B.3 typing additions, comments) without anyone
re-checking against the stated target.

**Proposal:** Tranche S should either (a) re-verify and either finish the decomposition to
actually clear 400L, or (b) explicitly retire the 400L target in favor of the 500L repo gate with
a one-line note in the tranche doc — but not leave a stated, checkable target un-mentioned in the
close-out.

### 2. [MEDIUM] DM-1/DM-5 HARD STOP declared satisfied under a wave the R.W6.md spec never named, sequenced after "R.W6-core GREEN"

**Evidence:** R.W6.md §1: "The chronic-ledger items DM-1 ... and DM-5 ... land here [in R.W6] —
no 9th carry on DM-1." §C.6 restates the same HARD STOP. Commit order (`git log --reverse
a15cd48..18e8617`):
`c2907b9` "R.W2+R.W6-core in flight" → Band A/B/C land (`0a33f5a`, `56d68e1`, `598b4ff`,
`5f3f04e`) → `3f0075a` **"R.W6-core green"** → *then* `20dbe7e`/`f77322b`/`cc3a86f` (new,
un-spec'd "R.W6-decomp" carve work) → `e4d8d03`/`25b3a13` "impl(R.W6 C.6): DM-5/DM-1 chronic
exit — CONTINGENCY KILL" → `a452349` "test(R.W6-decomp)" → `4fda243` "docs(R): Track D (demo)
COMPLETE — R.W6-decomp green (DM-1/DM-5 contingency KILL)". PROGRESS.md line 42 ("R.W6-core ✅
GREEN") and line 44 ("R.W6-decomp ✅ GREEN ... DM-1 + DM-5 chronic exits = CONTINGENCY KILL")
confirm the attribution: the wave's own charter item is filed under a sibling wave that post-dates
the GREEN declaration. `docs/tranches/R/waves/` has no `R.W6-decomp.md` — it is an
ad-hoc PROGRESS.md/FINAL.md label, not a spec'd wave.

**Failure scenario:** this is a process-integrity gap, not a functional one — both KILLs did
land (verified: `TransportDock.vue` no longer has `pointerHandled`/`onPlayPointerDown`;
`SpringSidebar.vue` uses `KfPillTabs.vue` per `e4d8d03`), and `proof:workaround-deletion` is
GREEN. But a wave that ships its GREEN checkpoint before its own spec's explicitly-worded HARD
STOP requirement is satisfied sets a precedent Tranche S should not inherit: a future lane could
read "R.W6-core GREEN" at `3f0075a` and reasonably treat the wave as closed, missing that its own
§1/§C.6 obligations were still open for two more commits under an unplanned label.

**Proposal:** Tranche S wave docs should require the chronic-ledger exit commits to land (or the
wave to explicitly stay IN-FLIGHT) before a `<wave> GREEN` line is written to PROGRESS.md, and
any un-spec'd decomposition work that absorbs a spec'd wave's own HARD STOP item should get its
own wave doc (however short) rather than a PROGRESS.md-only label invented after the fact.

### 3. [LOW] `iosTextEntry.ts` global-reading rewrite trades away DI-based testability for no material readability gain — belongs to R.W3 §2F, folded into an R.W6 commit

**Evidence:** `git show 0a33f5a -- demo/@/utils/iosTextEntry.ts` — the injectable
`NavigatorLike` parameter + default-from-global pattern is deleted; `isIOSLikePlatform()` and
`clampIOSNoZoomFontSize()` become zero-param, reading `navigator`/`CSS` directly. This exactly
matches R.W3.md §2F's authored code block (`docs/tranches/R/waves/R.W3.md:256-267`) — it is not
an R.W6 fabrication, it is R.W3 work landed opportunistically in an R.W6 commit (commit subject
says so: "R.W3 §2F/2I/2J/2K"). R.W3 §2F's stated justification is narrowly about
`navigator.platform` being deprecated — true and a legitimate excision — but the shipped diff
goes further and removes the entire injectable-parameter shape, not just the deprecated
`platform` field. The test fallout (`git show c81b9fc -- test/ios-text-entry.test.ts`) confirms
the cost: every test now calls `vi.stubGlobal("navigator", {...})` + `vi.stubGlobal("CSS", {...})`
+ `afterEach(() => vi.unstubAllGlobals())`, replacing what was previously a plain object literal
passed as an argument. This directly cuts against the project's own stated preference
(CLAUDE.md "Architecture Notes": `ScrollTimeline` "injectable `getScrollY`/`getViewportHeight`
callbacks for testing without DOM") — global-stubbing is strictly more brittle than constructor/
parameter injection (a stray un-stubbed global in a sibling test, or a forgotten
`vi.unstubAllGlobals()`, leaks across tests; a parameter default cannot).

**Failure scenario:** low real risk today (`vi.stubGlobal`/`afterEach` are used correctly in the
current test file), but the pattern is now the demo's canonical "how do we test global-reading
platform code" precedent — future agents copying `iosTextEntry.ts`'s shape into new
platform-detection helpers will propagate the global-stub-in-tests idiom instead of the
cheaper-to-test injectable-default idiom the rest of the codebase favors.

**Proposal:** Tranche S should not re-open this file (it is correct and green), but should not
treat "read the global directly, no param" as the house style for testable platform-detection
utilities — the pre-R.W3 injectable-default shape (`fn(navLike: NavigatorLike = getNavigatorLike())`)
achieves the same "callers don't have to pass anything" ergonomics without forcing
`vi.stubGlobal` on every test.

### 4. [LOW] `CSS.supports` feature-detect is sound in principle but asymmetrically guarded

**Evidence:** `demo/@/utils/iosTextEntry.ts` (current, `18e8617`):
```ts
export const isIOSLikePlatform = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 &&
            CSS.supports("(-webkit-touch-callout: none)"))
    );
};
```
The `-webkit-touch-callout` trick itself is sound: it is a WebKit-proprietary CSS property that
Chrome/Firefox's `CSS.supports` does not recognize, so combined with `maxTouchPoints > 1` it
correctly isolates "WebKit engine + touch" (the modern iPadOS-desktop-mode signature) without UA
sniffing. But the function guards `typeof navigator === "undefined"` and never guards `typeof CSS
=== "undefined"` — an inconsistency (one platform global is defensively checked, the sibling
global used two lines later is not). In every real browser `CSS.supports` is Baseline-available,
so this is not exploitable today, but any non-browser environment that polyfills a `navigator`
with `maxTouchPoints > 1` (a partial Node/SSR shim, a test file that stubs only `navigator`) will
throw a `ReferenceError` on `CSS.supports` rather than degrading to `false`.

**Failure scenario:** a future test or SSR harness that stubs `navigator.maxTouchPoints = 2` for
unrelated pointer-event testing purposes and forgets to also stub `CSS`, then calls
`initIOSPlatformClass()`/`clampIOSNoZoomFontSize()` transitively (both are called at real mount
time in `EditorShell.vue:118` / `CSSCodeEditor.vue:135`), gets an uncaught `ReferenceError`
instead of the intended `false`.

**Proposal:** cheap, low-priority fix for Tranche S: `typeof CSS === "undefined" ? false :
CSS.supports(...)`, matching the existing `navigator` guard's defensive symmetry.

### 5. [INFO] Band A/A.1–A.3, B.2/B.3, C.1–C.5 verified fully shipped, no silent drops

**Evidence:** exhaustive grep sweep, all zero-hit as spec'd:
`grep -rn "window\.addEventListener\|new ResizeObserver\|new MutationObserver" demo/` → 0 hits;
`grep -n "dataset\.curve" demo/scenes/easing/EasingTarget.vue` → 0 hits (owned `ballSnapshot`
confirmed at `EasingTarget.vue:295-296,324`); `grep -n "shallowRef<any>" demo/app/App.vue
demo/app/useSceneMachineApp.ts` → 0 hits; `storedControls: StoredAnimationGroupControlOptions`
confirmed typed at `useAnimationGroupPlayback.ts:16`; `var(--z-content,\|var(--z-behind,` → 0
hits anywhere under `demo/`; `--spring-snappy` alias excised from `style.css` (comment-only
survivors, verified at `style.css:327-333`); `animationState` excised from
`animationOptionsStore.ts` (comment-only survivor at line 9); `sharedCubeTransform` → 0 hits,
`useCubeTransform` present (`cubeTransformStore.ts:13`); `_timingFunctionsAnd`/
`getTimingFunctionsAnd` → 0 hits, replaced by module-level `const timingFunctionsAnd:
Record<string, unknown>` (`useEasingDemo.ts:38`) — note this is a *stricter* type than the
spec's proposed `Record<string, TimingFunction | string>` (the actual data includes factory
functions the narrower union would not have captured; `unknown` forces call-site guards, a sound
improvement over the literal spec text). Live-ran `node scripts/proof-brittleness.mjs` — GREEN,
all 9 clauses including the two new ones (`cb-props`, `z-comma`) added exactly per §3.

This is not a finding requiring action — recorded so Tranche S does not re-litigate Bands A/C,
which are clean.

## Tranche-S implications

- **Do not re-open Bands A/C of R.W6-core** — verified clean, gate-backed, zero residue.
- **Finish or explicitly retire the ControlsPaneWrapper/AnimationControlsGroup <400L target**
  (Finding 1). If Tranche S's deeper sub-zoning pass (compile/backward/, engine/css/, etc.) is
  extending the same discipline to the demo's animation-controls suite, fold this in as a
  concrete carve target — both files are ripe (497L/477L, only two bands away from spec's own
  stated bar) rather than a fresh audit.
- **Adopt a "no `<wave> GREEN` before that wave's own HARD STOP items land" rule for the wave
  ledger** (Finding 2) — a lightweight process fix: PROGRESS.md should not mark a wave GREEN
  while a chronic-ledger item scoped to that wave by its own spec text is still open under an
  unplanned sibling label. Cheap to enforce, prevents exactly this kind of order to
  order-of-operations ambiguity recurring across the 8-band S design.
- **When folding a cross-wave item (like R.W3 §2F) into another wave's implementation commit**,
  Tranche S should keep the wave attribution in the commit *subject*, not just the body — R did
  this correctly here (`0a33f5a`'s subject names both R.W6 and R.W3 §2F/2I/2J/2K) and it is worth
  keeping as house style since it made this audit traceable.
- **Prefer injectable-default over global-read-only for platform-detection utilities** going
  forward (Finding 3) — a one-line style note for the Tranche S conventions doc, not a rework
  of the current file. Symmetrically guard `CSS.supports` against `typeof CSS === "undefined"`
  (Finding 4) as a trivial fold-in if anyone touches this file again for other reasons — not
  worth a dedicated wave.
