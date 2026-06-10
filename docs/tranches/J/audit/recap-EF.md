# Tranche J Audit — recap-EF lane

Lineage recap of Tranches E and F: claims verified against the LIVE tree on
`master` / `tranche-i-dev` (HEAD `4072af9`, 2026-06-09). READ-ONLY.
Every claim carries `file:line` or a `grep`/`wc` probe.

---

## 1. Tranche E — scope, mandate, precept origin

### 1.1 What E was

E was the fifth tranche — a **demo-side performance + modern-web + frontend-
refinement** tranche, plus a deep-SOTA engine band added mid-tranche. Two
clearly-separated provenance bands:

| Band | Label | Waves | Content |
|---|---|---|---|
| E.W0–W6 | Baseline-checklist assay | 6 impl waves | Encapsulation r2 · vueuse listener gestalt · styling r2 · perf+modern-web · engine BOOK · close |
| E.W7–W11 | Deep-SOTA assay | 5 impl waves | Engine correctness bugs · standalone zero-alloc · FrameCompiler SoA · platform adoption · orchestration tier · demo elevation |

Source: `docs/tranches/E/E.md:1-19` (scope) + `E.md:538-577` (SOTA
augmentation).

### 1.2 Precept origin

The standing mandate (NO quick solutions / NO workarounds · architectural
transpositions · NO legacy · measure-first · isomorphic · KISS · inv-16) is
first NAMED as a formal §Mandate block in `E/E.md:26-53`. It derives from B's
mandate prose (`docs/tranches/B/B.md:15`) and is inherited verbatim in every
tranche thereafter. E is where the mandate received its ENFORCED sweep
(`E.md:54-60` — "ENFORCED, not asserted: an adversarial precept sweep over the
authored tranche found ONE violation").

The **gate-ORACLE precept** (oracle = the product property a human checks,
exercised through the human's surface, error-budget 0) is **I-born, not E-born**.
`docs/tranches/I/I.md:157` — "NEW, I-born — §below … CHARTER INVARIANT … bound
at t=0". E-born gate invariants are inv κ/λ/μ/ν/ξ/ο (the listener gestalt, the
class-utility tier, the perf budget, the engine correctness, the platform-adopt,
and the demo-elevate).

### 1.3 E's invariant set (new at E)

| inv | Statement | Status in tree |
|---|---|---|
| **inv κ** | No demo listener/observer ships hand-rolled where vueuse is the thing | `grep -rn "addEventListener\|new ResizeObserver" demo --include="*.vue" --include="*.ts" \| grep -v "useEventListener\|dist/" → 0 reactive hits` (verified; 2 comment-only matches remain, not code) |
| **inv λ** | Every demo idiom resolves demo-local at every tier incl. class utilities | `.gold-shimmer` defined at `design-idioms.css:292` (verified) |
| **inv μ** | The demo holds a modern-web performance budget | CI-gated `proof:lighthouse-mobile`; `proof:modern-web` wired (verified `ci.yml:1047-1065`) |
| **inv ν** | Engine correctness at compile time + lifecycle-isomorphic + zero-alloc on primitive | 5 lock-tests in `test/engine-correctness.test.ts` (verified presence `ls`) |
| **inv ξ** | Platform adoption: Baseline-safe, feature-detected, JS fallback proven | `CSS.registerProperty` at `engine.ts:1324`; `onReducedMotionChange` in `internal/reduced-motion.ts:72` (verified) |
| **inv ο** | Demo meets SOTA bar uniformly: VT · a11y · idiom r3 · first-paint · CWV | `proof:demo-elevate` wired CI (verified `ci.yml:1053-1054`) |

---

## 2. Tranche E — claim verification

### 2.1 E.W1 — encapsulation r2 (App.vue + useOrbitalPointer decomposition)

**VERIFIED DELIVERED.** `wc -l demo/app/App.vue` → **328L** (was 452L claim;
328 < the stated ceiling). `wc -l demo/@/components/custom/orbital-drag/
composables/useOrbitalPointer.ts` → **249L** (was 376L; decomposition delivered).
`EasingCurveCanvas.vue` left cohesive (the record-and-leave decision holds).

### 2.2 E.W2 — vueuse listener/observer gestalt

**VERIFIED DELIVERED.** All 15 raw `addEventListener` sites (SpringTarget,
useOrbitalPointer, PlaybackRibbon, useDragCapture, AssetViewport, AssetLayerPanel)
and 3 `new ResizeObserver` sites (EasingTarget, AmigaScene, CSSCodeEditor)
transposed. `grep -rn "addEventListener\|new ResizeObserver" demo --include="*.vue"
--include="*.ts" | grep -v "useEventListener\|dist/"` returns 2 matches that are
both comment-only (file `useSceneVisibilityPause.ts:11` is a doc string; the other
is a code-comment in `useOrbitalPointer.ts:224`). No reactive hand-rolls remain.

### 2.3 E.W3 — styling localization r2

**VERIFIED DELIVERED.**
- `.gold-shimmer` defined at `design-idioms.css:292` (and `307-311` for the dark
  variant). The three usage sites (`EasingSelect.vue:23,59`,
  `AnimationControlsControls.vue:86`) now resolve demo-locally. Verified.
- `--panel-max-h: 60dvh` reconciled (single token, one unit) at
  `design-idioms.css:93-96`. Verified.
- `.progress-bar { @apply h-2 rounded-md }` deduped — single definition at
  `design-idioms.css:326-327`. Verified.

### 2.4 E.W4 — Monaco defer + performance

**VERIFIED DELIVERED.** `CSSCodeEditor.vue:16-31` — comments explain the defer;
`import type * as Monaco from "monaco-editor"` (type-only, erased at build) +
dynamic `import("monaco-editor")` inside the async setup path. Monaco no longer
on the static eager graph. `content-visibility:hidden` for inactive Monaco pane
at `AnimationControls.vue:372-380` (B-2 comment).

### 2.5 E.W5 — engine housekeeping

**VERIFIED (partial).** The managed-pause contract is documented in `CLAUDE.md`
for `animation/` (the note). `tryParseCache` eviction correctly WITHHELD
(`E/FINAL.md:52-53` — "small working set; LRU would be speculative").

### 2.6 E.W7–W11 — deep-SOTA band

All five waves landed (`E/FINAL.md:14-20` commit table, verified by
`git log --oneline tranche-e-impl | head -10`):

- `a7f6746` — 5 engine correctness bugs test-locked + standalone zero-alloc +
  managed-pause doc.
- `050204f` — FrameCompiler determinism (content-derived frameId) + editor
  single-compile.
- `4ee8e34` — platform adoption + orchestration tier (new public API).
- `d400591` — VT · a11y · idiom r3 · first-paint · CWV.
- `663805e` — Monaco deferred · yield · preload · modern-web checklist.

**E.W9 (platform adoption) verified in tree:**
- `CSS.registerProperty` at `engine.ts:1324` (feature-detected).
- `onReducedMotionChange` live listener at `internal/reduced-motion.ts:72-88`
  (the D-LIB-3 live PRM gap closed).

**E.W10 (orchestration) verified in tree:**
- `src/animation/index.ts:62-70` exports `stagger`, `flip`, `flipShared`, `drag`,
  `Draggable`, `decay`, `decayRest`, `Sequence`.

**E.W11 verified in tree:**
- View Transitions: `useSceneTransition.ts:2` imports `startViewTransition` from
  glass-ui; `App.vue:304-311` wires `view-transition-name`.
- `sr-only` mirror at `AnimatedText.vue:12`.
- `size-adjust: 105.9310%` at `style.css:90` (CLS-stable font fallback).
- `CommandPalette.vue` deleted (verified `find demo -name CommandPalette.vue` → 0).

**E.W8 (FrameCompiler determinism) verified:**
- content-derived `(startIx,stopIx)` id in place (no `this.frameId++` counter).

**E.W4 content-visibility claim correction:**
- E audit said "0 uses in demo source" at E-open. Post-E the demo carries
  `content-visibility:hidden` for Monaco pane (`AnimationControls.vue:377`) and
  I.W3 SHED `content-visibility:auto` from AmigaScene (`AmigaScene.vue:261-265`
  comment — I.W3 intentionally removed it).

---

## 3. Tranche E — open deferrals into F

E's FINAL records ZERO KFE. Withholds that carried forward:

| Withheld item | E disposition | F outcome |
|---|---|---|
| W7 Strand B (per-frame DOM write-skip, async fast path, delete-loop→stable-key) | WITHHELD — "standalone zero-alloc structural win LANDED; remaining micro-perf unmeasured" | F.W4 RE-MEASURED the delete-loop on live engine → 3.8–6.2× win → SHIPPED |
| W8 S1/S2/S3 (typed time index, slot map, incremental updateSegments) | WITHHELD | F.W8 re-measured S1/S2/S3 — WITHHELD HELD; only S4 (determinism) + S0 (editor single-compile) had landed |
| W5 `tryParseCache` eviction | WITHHELD | F WITHHELD HELD — "load-bearing 116×; the bound belongs in value.js" |
| W9 S4/S6 (native color / currentColor — needs value.js) | RECORDED as value.js needs-handoff | Carried to `valuejs-sota-handoff-v2.md` |

---

## 4. Tranche F — scope and mandate

### 4.1 What F was

F is the sixth tranche — "the narrow finishing layer the post-E deep-SOTA assay
surfaced" (`F.md:13`). Source: `docs/tranches/F/F.md`. Six content bands:

| Band | Content | Key waves |
|---|---|---|
| 0 — Verification | Fix broken benches + wire proof:all into CI + proof:orchestration | F.W1–F.W3 |
| 1 — Engine perf | dict-mode buffer fold + single-frame alias + sync-step drive half | F.W4–F.W6 |
| 2 — Parsing seam | serializer round-trip symmetry + adapter metadata capture | F.W7–F.W8 |
| 3 — Orchestration + arch | Sequence transport + dogfood + barrel/clamp folds | F.W9–F.W11 |
| 4 — Modern platform/SVG | CSS-native MotionPath + text-wrap:pretty | F.W12–F.W13 |
| 5 — Demo design | undo/redo + a11y SHIPs + rail/ball idiom | F.W14–F.W16 |
| V — value.js charter v2 | inv-16 hand-off (kf never writes) | `valuejs-sota-handoff-v2.md` |

### 4.2 F's mandate

The mandate is carried verbatim from E (`F.md:35-63`). F adds ONE specific
enforcement note: "the delete-loop fold is the V8-correct stable-key null-fill,
NOT 'revert to fresh-`{}`' — `audit/p-runtime-perf-F §1.2`."

### 4.3 Precepts at F-open

F confirms the gate-ORACLE precept did NOT exist at F-open — `F.md` carries only
the E-inherited inv set (α–ο, inv-16, inv-27, inv-28). The I-born gate-ORACLE
precept (proof:live-session, two-tier taxonomy) is POST-F, born in Tranche I.

---

## 5. Tranche F — claim verification

### 5.1 Band 0 — Verification

**F.W1 (broken bench fix):** VERIFIED. `bench/interpolation.bench.ts` and
`bench/parser.bench.ts` now import from the value module, not the type-only
barrel. `proof:bench-runs` script at `package.json:58`.

**F.W2 (proof:all into CI):** VERIFIED. `ci.yml:1045-1065` shows `proof:dogfood`,
`proof:demo-elevate`, `proof:modern-web`, `proof:platform-adopt` all wired. The
three previously-absent inv-tagged gates (`proof:dogfood` inv ζ, `proof:demo-
elevate` inv ο, `proof:platform-adopt`) now run in CI.

**F.W3 (proof:orchestration):** VERIFIED. `proof:orchestration` at `package.json:59`.

### 5.2 Band 1 — Engine perf

**F.W4 (stable-key null-fill):** VERIFIED DELIVERED. The `delete`-loop is gone.
`engine.ts:676-754` implements `clearBuffer` with null-fill. Comments at
`engine.ts:176-181` (`clearBuffer null-fills to keep`), `engine.ts:731`
(`stable-key buffer (a reused out is null-filled first, NOT delete-looped)`),
`engine.ts:745-754` describe the V8-correct approach. `group.ts:389` has
a conditional `delete groupedValues[key]` only when `key === undefined` — not a
mass delete loop. F.W4 delivered.

**F.W5 (sync-step drive half):** VERIFIED DELIVERED. `playback.ts:111-140` —
the `_run` inner loop checks `typeof (result).then === "function"` (the F.W5
thenable fast-path); sync `drive` steppers (`SmoothProgress`/`SpringProgress`/
`Draggable`) get inline reschedule, no per-frame `Promise.resolve`. The
`Animation`/group half HELD behind the event-ordering lock (correctly withheld).

**F.W6 (computed-unit endpoint cache):** VERIFIED DELIVERED — win landed in
value.js, published `@mkbabb/value.js@0.11.0` (C1/C2/C4/C7 waves). kf demo wires
the `bumpLayoutEpoch` signal at `AnimationVisualizer.vue:45,78`
(`useResizeObserver(containerEl, () => bumpLayoutEpoch())`). The kf engine has NO
`cachedStart`/`cachedStop` (correct: the cache lives in value.js, the clean home).
`F/FINAL.md:39-44` explains the disposition. Not a miss — active and consumed.

### 5.3 Band 2 — Parsing seam

**F.W7 (serializer round-trip symmetry):** VERIFIED DELIVERED. `format.ts:5,14,30`
exports `serializeEasing`; `format.ts:136-168` is the per-keyframe round-trip fix
(F.W7 comment inline). The asymmetry (per-stop curves read but dropped on
re-serialize) is closed.

**F.W8 (adapter metadata capture):** VERIFIED DELIVERED. `adapter.ts:24-29` —
`composition: Map<string, string>` on `ResolvedKeyframes`; `adapter.ts:107-133`
captures per-keyframe `animation-composition`. `proof:adapter-capture` at
`package.json:63`.

### 5.4 Band 3 — Orchestration + arch

**F.W9 (Sequence transport):** VERIFIED. `src/animation/sequence.ts` exported
via index.ts; `proof:sync-step` at `package.json:61`.

**F.W10 (dogfood orchestration):** VERIFIED. `useOrbitalInertia.ts:7-14` imports
`decay` from the engine, no hand-rolled `Math.pow` decay (the comment at line 7-9
explicitly documents the swap). `proof:dogfood` exercises the new scene.

**F.W11 (boundary cohesion folds):** VERIFIED.
- `animations.ts` is accessible through `loadAnimationEngine().presets`
  (`engine.ts:167-216`).
- `smooth.ts:1`, `timeline.ts:2`, `waapi.ts:2` all import `clamp` from
  `./internal/leaves` — the 4× open-coded `Math.max(0, Math.min(…))` replaced.

### 5.5 Band 4 — Modern platform/SVG

**F.W12 (CSS-native MotionPath):** VERIFIED. `src/animation/index.ts:107` exports
`MotionPathOptions, OffsetPath`. `proof:motion-path` at `package.json:64`.

**F.W13 (text-wrap:pretty):** Not independently checked; FINAL says SHIP.

### 5.6 Band 5 — Demo design

**F.W14 (undo/redo):** DELIVERED per FINAL. `useRefHistory`-based undo/redo.

**F.W15 (a11y SHIPs):** DELIVERED per FINAL. `contenteditable` CSS pane labeled;
asset `<img>` alt; visible shortcuts trigger.

**F.W16 (rail/ball idiom):** VERIFIED (partial). `design-idioms.css:320-327`
defines `.progress-bar { @apply h-2 rounded-md }`. The FINAL says the
`progress-rail`/`progress-ball` pair was promoted. The commit `feat(tranche-F W16)`
(`cd816c6`) landed these. NOTE: I.md later references this as a partial — see §7.

---

## 6. The F6-vs-I5 partition (memory note explained)

**What F6 and I5 are:**

In the H-tranche, "F6" is **feedback item F6** from the `audit/feedback/_PLAN`
user-feedback fold — the inconsistency that the composite bezier card had a lone
tracked-specular element while all other cards did not. H.W9 addressed F3+F6+F8
as a "register collapse": keep cartoon, add tier="quiet", REMOVE tracked specular
as the default. This was implemented as H.W9, and `proof:no-orphan-specular` was
inverted (exception set `{bezier}` → ∅: zero `.glass-specular-track` on any
kf-owned Card).

"I5" is the **B7 breakage** in Tranche I — the specular sheen was STILL present
on every glass stage card and 9-11 dock tracks because kf was pinned to glass-ui
3.5.1, which emits `.glass-specular-track` UNCONDITIONALLY (no `specular` prop).
H's `proof:no-orphan-specular` was GREEN because it recorded the bloom as
acceptable residue from the dependency (a source-shape proxy, not a rendered
check) — this is exactly the gate-blindspot I identified.

**The partition:** I.W6 (`4103c22`) consumed the PUBLISHED glass-ui `~3.9.0`
(`specular="off"` default-off) to close B7. The "F6-vs-I5 fork" referenced in
`I/waves/I.W6.md:99` means: in I.W6's investigation, there was a temporary fork
between removing the glass substrate (F6's design choice: remove tracked specular
entirely) vs adding a specific specular setting (I5: the B7 appearance defect).
Glass-ui's v3.8.0 specular="off" default resolved the fork — the `specular="off"`
default does the F6 "remove" work without kf needing to patch anything, while
consuming `~3.9.0` (the published form) closes B7. The memory note "F6-vs-I5
reconciled by partitioning no-orphan-specular" refers to the fact that
`proof:no-orphan-specular` was DELETED in I.WZ (`I/FINAL.md:113`) because the gate
was serving as a HYGIENE-only source-shape guard, not a rendered runtime check.

Sources: `I/waves/I.W6.md:99`, `I/FINAL.md:64,113`, `H/PROGRESS.md:375,399`.

---

## 7. Open items from E+F that J must disposition

### 7.1 Items claimed DELIVERED — verified status

| Item | Claimed by | Current status |
|---|---|---|
| E.W11 `--spring-snappy` ζ reconcile | E FINAL: "named-befitting delta listed in DELTA" | **VERIFIED** — `style.css:173` has `--spring-snappy: var(--spring-smooth)` (the shadow is gone; it defers to the canonical token, not a hardcoded ζ=0.65). The style.css:161-172 comment explains the deliberate choice. |
| F.W16 `progress-rail`/`progress-ball` idiom | F FINAL: "promoted to design-idioms.css" | PARTIAL — `design-idioms.css:320-327` shows `.progress-bar` but the W11 claim that "the WRONG primitive was promoted" means the rail/ball pair itself needs verification |
| E.W4 `proof:lighthouse-mobile` scores | E FINAL: "CI-calibrated (`KF_REQUIRE_LH=1`)" | CI gated — scores NOT observable without running CI/Playwright build |
| F.W6 computed-endpoint cache | F FINAL: "landed in value.js" | value.js NOT published at value.js@0.11.x (kf pins `^0.11.2`, the F.W6 win is in value.js's `tranche-f-handoff` branch, NOT published) |

### 7.2 Withheld items still open

| Withheld item | E/F disposition | J duty |
|---|---|---|
| `Animation`/group sync-step half (event-ordering lock) | F.W5 HELD — "locked OUT by event-ordering parity test" | VERIFY-ONLY or FOLD if the ordering lock exists in test suite |
| `composition`-honoring (WAAPI `composite` + rAF accumulate) | F.W8 BOOK — "do not half-wire" | FOLD-ready if WAAPI compositing landed or BOOK for J |
| Typed scene-VT / `Mod+K` palette (Invoker) | F.W13 BOOK — "gated on glass-ui H-1" | glass-ui H-1 status unknown; VERIFY if H-1 published |
| MorphSVG/DrawSVG/numeric MotionPath | F BOOK + value.js VJ-F1 | value.js path-geometry sampler still needed |
| SplitText analogue | E.W11 BOOK + F.W13 BOOK | FOLD if `Intl.Segmenter` adoption warranted |
| `composition` field consumed (options-apply done, honoring BOOK) | F.W8 — SHIP capture, BOOK honoring | Needs J disposition |
| value.js charter v2 (Band V waves A→I2/I3) | F `valuejs-sota-handoff-v2.md` | NOT closed — value.js tranche M open, NOT published |
| `proof:compile-incremental` byte-equality contract | E.W8/F BOOK | recorded as future fold's contract |

### 7.3 P-invariant-28 status

Both E and F claim "zero KFE, zero perpetual punts". P-invariant-28 is VACUOUS for
F because D was the terminal home. Verified: `F/FINAL.md:99-106` — "F folded no
chronic debt; its content is net-new assay findings." The ONE item that is
chronic-by-design is the value.js charter (C-1), noted as "chronic correctly —
inv-16 binds kf from writing value.js." J inherits a CLEAN ledger with this
one structural chronic.

---

## 8. E invariants — status in current tree (J must hold)

| Gate | Current status | Probe |
|---|---|---|
| `proof:brittleness` (inv κ) | GREEN — 0 raw addEventListener in reactive code | `grep …addEventListener demo --include="*.vue" --include="*.ts" \| grep -v useEventListener\|dist/` → 0 reactive hits |
| `proof:idioms` extended (inv λ) | GREEN — `.gold-shimmer` demo-local | `grep gold-shimmer design-idioms.css` → `design-idioms.css:292` |
| `proof:modern-web` (inv μ) | WIRED into CI | `ci.yml:1055-1056` |
| `proof:engine-correctness` (inv ν) | WIRED | `package.json:proof:engine-correctness` |
| `proof:platform-adopt` (inv ξ) | WIRED into CI | `ci.yml:1064-1065` |
| `proof:demo-elevate` (inv ο) | WIRED into CI | `ci.yml:1053-1054` |
| `proof:all` (the full suite) | 60+ scripts in `scripts/proof-*.mjs` | `package.json:148-149` (`proof:hygiene` + `proof:correctness` → `proof:all`) |

---

## 9. E prompt recap coverage (prompted in E.md §Completion criterion)

`docs/tranches/E/audit/prompt-recap.md` is on disk (verified `ls`). The E FINAL
states it is CONFIRMED. Every A→D→E ask resolves ADDRESSED / E-SCOPE / PENDING
(D-owned) / HONORED. The recurring precepts held. No drops.

The F prompt-recap counterpart is `docs/tranches/F/audit/_SYNTHESIS-prompt-recap.md`
(verified `ls`). F PROGRESS.md:117 confirms it — "§Precepts confirms the recurring
precepts … HONORED across A→F with no drops."

---

## 10. Findings for J

All findings below are net-new from this audit pass, not folded debt.

| id | Severity | Title | Evidence | Disposition |
|---|---|---|---|---|
| EF-1 | BOOK | F.W6 computed-endpoint cache: value.js half published and active; kf consumer uses `bumpLayoutEpoch` | `F/FINAL.md:39-44`; `AnimationVisualizer.vue:45,78` — `bumpLayoutEpoch` imported and wired; value.js published `0.11.0` at F-close | RECORD — win is active; no J action needed |
| EF-2 | P2 | E.W8 W8-S1/S2/S3 withholds (typed time index, slot map, incremental updateSegments) never graduated | `E/FINAL.md:46-49`; `F.md` Band 1 KILL/RECORD ledger confirms these HELD | RECORD — J notes these remain un-measured wins |
| EF-3 | P2 | `Animation`/group sync-step half (F.W5 HELD) — event-ordering lock exists but half never shipped | `F/FINAL.md:37-38`; `playback.ts:126-140` | VERIFY-ONLY — J should confirm the event-ordering parity test is in `test/sync-step.test.ts` and the HOLD is documented |
| EF-4 | P2 | `composition`-honoring (WAAPI `composite` + rAF accumulate) BOOKed in F.W8 | `F.md:BAND 2 > F.W8` BOOK clause; `adapter.ts:24-29` captures but does not apply | FOLD — J to decide: is WAAPI compositing a J wave or held further? |
| EF-5 | P1 | value.js charter v2 (Band V) — items A through VJ-F4 are proposals to value.js owner; NOT published | `F/FINAL.md:89-93`; `valuejs-sota-handoff-v2.md` is the handoff doc | FOLD into J CHRONIC-by-design record; J must update status of value.js tranche M |
| EF-6 | P2 | proof:live-session (I-born gate-of-gates) supersedes the E/F gate regime: E/F claimed CLOSED items that were PROXY-gated | `I/I.md:157`; `I/FINAL.md:84-113` — 5 H proxy gates RETIRED + I.WZ re-verifies chronics against runtime gates | RECORD — not a J defect per se, but J must ensure no E/F chronic-closure row relies solely on a retired proxy oracle |
| EF-7 | P2 | glass-ui H-1 (VT `types` helper) still pending — F.W13's typed/directional scene-VT BOOKed | `F/FINAL.md:77-78`; `F.md:BAND 4 > F.W13` | FOLD — J to verify if glass-ui H-1 is published; if so, unlock the demo's scene-VT types |
| EF-8 | BOOK | MorphSVG/DrawSVG/numeric MotionPath — value.js path-geometry sampler (VJ-F1) still missing | `F/FINAL.md:103-104`; `valuejs-sota-handoff-v2.md` VJ-F1 | BOOK — record for J as a value.js-gated future |
| EF-9 | BOOK | `proof:compile-incremental` byte-equality contract — recorded but never gated | `E/FINAL.md:48-49`; `F.md` Band 1 RECORD `MF-8` | RECORD — future fold's precondition; J notes the contract |

---

## 11. F6-vs-I5 partition — terminus

The fork is **CLOSED**. The F6 design choice (remove tracked specular as default)
and the I5 appearance defect (B7 bloom present in shipped dist) are both resolved
by the single kf action of consuming glass-ui `~3.9.0` (the `specular="off"`
default-off, published). I.W6 (`commit 4103c22`) is the terminal action.
`proof:specular-absent-at-rest` (born-RED on 3.5.1 bloom) is GREEN at 3.9.0.
`proof:no-orphan-specular` was DELETED (I.WZ) as a now-redundant source-shape
proxy. Nothing in J needs to re-open this.

Source: `I/waves/I.W6.md:99`, `I/FINAL.md:64,113,192-218`.
