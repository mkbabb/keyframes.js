# H — the WHOLE-HISTORY deferred ledger, reconciled (A → B → C → D → E → F → G → **H**)

**Lane:** `a-deferred-ledger`. **Branch:** `tranche-h-dev`. **Job:** sweep EVERY
BOOK / RECORD / HANDOFF / MEASURE-FIRST / KILL item from the D/E/F/G `FINAL.md` +
the F/G synthesis ledgers, re-verify each against the **live post-G tree**, and assign
EACH a terminal H disposition: **KFH** (fold into H) / **done** (shipped in D..G,
struck) / **sibling-HANDOFF** (value.js / parse-that / glass-ui / deploy) / **KILL**
(re-affirmed, do-not-re-litigate) / **MEASURE-FIRST** (gated, land-on-a-number) /
**BOOK** (net-new, named wave) / **RECORD** (honest non-action) / **USER-DOMAIN**.

**P-invariant (binding, carried A→G):** no perpetual punt — every row exits with a
terminal. The one genuinely-perpetual row (the value.js charter, C-1) is
**CHRONIC-by-design** and *correct* (the inv-16 process ships a slice every tranche),
NOT a punt.

**Method (inv ε).** This ledger does NOT re-derive the F/G evidence; it CHAINS the two
binding prior synthesis ledgers (`F/audit/_SYNTHESIS-deferred-ledger.md`,
`G/audit/_SYNTHESIS-deferred-ledger.md`) and RE-DISPOSITIONS every carry against a fresh
**live verification on `tranche-h-dev`** (`file:line` / `node -e require` /
`npm view`). It is the WHOLE-history ledger, reconciled. **This is TRANCHE DEVELOPMENT
— docs only; this lane wrote ONLY this file. ZERO source/test/CI/demo edits.**
Sibling items (value.js 0.11.1 / parse-that 0.9.0 / glass-ui 3.4.0) are HAND-OFFs.

---

## §0. THE HEADLINE — G consumed the F spine; the ledger is now SMALL

**The whole pre-G open ledger collapsed in G.** The single largest carry across the
whole history — *"kf drove the F sibling-wins to publication but consumed NONE of them"*
(the entire G-synthesis §0 re-pin spine) — **LANDED in G.W1+G.W2** and is verified live:

> `package.json` (live): `@mkbabb/value.js: "^0.11.1"`, `@mkbabb/parse-that: "^0.9.0"`,
> `@mkbabb/glass-ui: "^3.4.0"` — NO `file:`/`link:`/`git:` protocol. The re-pin SHIPPED
> (RP-1/RP-4/RP-5 all **done**). Registry floor cleared (`npm view`: value.js `0.11.1`,
> parse-that `0.9.0`, glass-ui `3.4.0`).

So the −94% computed-endpoint memo (RP-2), the C5 length-unit *correctness* fix (RP-3),
the color-channel plan, the 2.41× dispatch LUT, the parse-that soundness hardening — all
**became real kf behaviour in G** through the single `lerpValue → iv._lerp` seam
(`engine.ts:731`), zero kf source edit. **The G FINAL deferred ledger is CLEAN (zero
KFG-debt carried)**: G inherited a clean ledger (D was the terminal home of all
keyframes-owned chronic debt; E/F/G folded none) and its content was net-new findings,
all dispositioned terminally.

**Therefore H inherits a SMALL, well-homed residual ledger**, of exactly four shapes:
1. **Sibling-OPEN charter slices** that G could not consume because the sibling has not
   yet published them (value.js E1/E2 parser, VJ-F1 path sampler, F2/F2b color
   sentinels, the MCI-5 identity pad; parse-that PT-4 packrat re-key). Each is
   **sibling-HANDOFF**, the kf consumer-half **BOOK** riding the next re-pin.
2. **MEASURE-FIRST items G left gated** (FB-2 sync-step Animation half; the SoA
   `lerpArray` consumption). Carried with their numbers and gates.
3. **BOOKed net-new scope** (FB-3 SVG morph, FB-5 intrinsic-size, FB-6 palette,
   diagnostics channel) — named waves, not yet built.
4. **The KILL / RECORD / ALREADY-SOTA wall** — re-affirmed; do NOT re-litigate.

**The H-NEW band (the user's observed defects D1–D14) is NOT in the historical ledger** —
it is a fresh post-G demo-regression assay owned by the H VISUAL/runtime lanes
(`a-cartoon-shadow`, `a-controls-sidebar`, `a-easing-editor`, `a-timeline-width`,
`a-typing-dots`, `a-hero-typography`, `a-mobile-architecture`, `a-mode-interactivity`,
`a-historical-dock`, etc., all present under `H/audit/`). This ledger records the
ONE structural cross-reference: **D12 (scene-state corruption / play-pause restore)
re-opens a band G *believed* closed in G.W7-W9** — see §4 row **LD-DEMO-1**.

---

## §1. THE RE-PIN SPINE (the whole-history headline) — **DONE in G**

| # | Item (origin) | Live re-verify (`tranche-h-dev`) | H disposition |
|---|---|---|---|
| **RP-1** | value.js `^0.10.0 → ^0.11.x` (the G headline) | `package.json` `^0.11.1`; the value.js `0.11.0` `development`-export break was driven-to-fix in value.js `0.11.1` (G FINAL:54-59) | **done.** Struck. The consume-unchanged lock held (zero src/test/demo edit on the bump). |
| **RP-2** | the −94% computed-endpoint memo rides RP-1 | landed via the seam (`proof:repin-witness`: 1 fresh write over 600 steady frames, G FINAL:51-52) | **done.** Struck. |
| **RP-3** | the C5 length-unit *correctness* fix rides RP-1 | `proof:computed-real-dom` (Playwright) is the genuine-path proof (G.W16, FINAL:125-127) | **done.** Struck. |
| **RP-4** | parse-that `^0.8.2 → ^0.9.0` | `package.json` `^0.9.0` | **done.** Struck. The realm-divergence (value.js still pins parse-that `^0.8.2`) surfaced **fail-explicit non-gating** by `proof:deps-current` → carried as **value.js-HANDOFF** (= LD-PT-2 §3). |
| **RP-5** | glass-ui `file: → ^3.3.0` | `package.json` `^3.4.0` (G shipped `^3.3.0`; bumped to 3.4.0 since) | **done.** Struck. The demo's `@mkbabb/keyframes.js → src` dedup-alias STAYS (AW-endorsed, G FINAL:200-203). |

> **Verdict:** the spine that dominated the A→G ledger is **fully discharged**. No KFH.
> The re-publish (consuming 0.11.1/0.9.0/3.4.0 → a `4.1.0`) is the USER-DOMAIN leg (PUB-1).

---

## §2. The value.js charter (C-1) — CHRONIC-by-design; H consumes the next landed slice

C-1 is correctly perpetual (value.js dirty+active; a slice ships every tranche). The
**already-landed 0.11.1 slice** (A1/A2 · B1b/B3+B5 · C1 · C5 · D2 · F7) became shipped kf
behaviour in G via RP-1 — **done**. What remains OPEN is the value.js NEXT-wave slice;
each row re-verified live as still un-published in `0.11.1`, so each is
**value.js-HANDOFF (OPEN)** with the kf consumer-half **BOOK**, riding the next re-pin
with ZERO kf edit (the seam is the structural guarantee).

| Charter item | Live `0.11.1` status (verified) | H disposition |
|---|---|---|
| **E1/E2** `linear()`/`steps()` PARSER → `LinearStop[]` | **OPEN** — `node -e`: `v.parseLinearStops === undefined`, `v.parseLinear === undefined` (value.js exports `cssLinear` the EVALUATOR only). kf's local reader shim still present (`utils.ts:106 parseLinearStops`, `:192` call-site). | **value.js-HANDOFF (OPEN, MED-HIGH — `linear()` Baseline-WA 2026-06-11, PAST) + kf-RETIRE-on-land (= C-4 / F-PARSE-1).** When E1 lands, H **excises** kf's `parseLinearStops` shim in the SAME no-legacy motion (no compat alias beside the value.js parser). Gate already in tree: `proof:roundtrip-easing` (G.W4). |
| **VJ-F1** path-geometry sampler (`getPointAtLength`/`getTotalLength`/curve sampling) | **OPEN** — `node -e`: `v.getPointAtLength === undefined`, `v.samplePath === undefined`. kf shipped the CSS-native sliver (`motion-path.ts`) + `fromDrawSVG` (one `getTotalLength()`, G.W13) but NO arc-length curve sampler. | **value.js-HANDOFF (OPEN) + kf BOOK (= FB-3 §5).** Sequence VJ-F1 in value.js FIRST, then the kf `fromMorphSVG` consumer wave. The one real persisting competitor-feature gap. |
| **F2/F2b** `currentColor`/`light-dark()`/`contrast-color()` sentinels | **OPEN** — `node -e`: `parseCSSColor('light-dark(red,blue)')` **THROWS** `Parse error at offset 0`. kf has 0 policy because they don't parse. | **value.js-HANDOFF (OPEN; HIGH for `currentColor`/`light-dark` — Baseline 2024-05-13; `contrast-color` BOOK — Baseline Apr-2026, black/white-only, must NOT alias to `safeAccentColor`).** |
| **MCI-5** identity-aware fn-arity pad (`brightness` holds `1` at t=0, not `0`) | **OPEN** — kf's witness `it.fails("filter brightness pad holds identity 1 at t=0 — value.js MCI-5 not yet consumed")` is GREEN today (`test/interpolate-anything.test.ts:256-262`), i.e. the pad has NOT landed. | **value.js-HANDOFF (OPEN). The `it.fails` witness IS the consume-leg signal — it FLIPS RED the instant value.js MCI-5 lands; H then deletes the wrapper.** A born-RED gate already in tree; no new H gate. |
| **VJ-F2** structured parse-error sink (`onParseError` shape) | **OPEN** (producer half landed: parse-that PT-1 0.9.0 threads `state.furthest`) | **value.js-HANDOFF (OPEN, HIGH) + kf BOOK (= the `ResolvedKeyframes.diagnostics` channel, §5 FB-DIAG).** Three-repo chain, producer half done. |
| **VJ-F4** buffer-reusing `unflattenObjectToString(flat, out?)` overload | **OPEN** — `node -e`/grep: only the byte-identical allocating form. Live call-sites still allocate per-frame: `utils.ts:370`, `waapi.ts:267`, `format.ts:113,150`. The real per-frame DOM-write garbage. | **value.js-HANDOFF (OPEN) + kf-consume-on-re-pin (= G-3, ZERO kf edit when the overload lands).** |
| **F3** bounded LRU on the value.js result cache (the C-3 terminal home) | **OPEN** (no `maxCacheSize` cap; `tryParseCache` wholesale-clear) | **value.js-HANDOFF (OPEN) = C-3 below.** The bound lives ONCE in value.js. Do NOT grow a second kf eviction policy (DRY). Re-open trigger UNCHANGED: a measured editor footprint (none exists). |
| **F6** parser-free easing + leaf-math sub-path | **OPEN** | **value.js-HANDOFF (OPEN); paired kf FOLD** (delete `internal/leaves.ts` shadow, static-re-export canonical clamp/scale/lerp). Re-verify post next re-pin. |
| **A1/A2 · B1b/B3+B5 · C1 · C5 · D2 · F7** (the landed 0.11.1 slice) | SHIPPED in `0.11.1`, consumed via RP-1 | **done** (consumed in G). Struck from the OPEN charter; the charter itself stays open for the next value.js wave. |

> **Honest charter verdict for H:** the already-landed slice is **done**; the next slice
> (E1/E2 · VJ-F1 · F2/F2b · MCI-5 · VJ-F2 · VJ-F4 · F3 · F6) stays **value.js-HANDOFF
> (OPEN)** — **CHRONIC-by-design, correct, working.** No perpetual kf punt: the chronic
> is the *process*, and the process shipped a slice (the 0.11.1 consume) this very cycle.

---

## §3. The parse-that charter — sibling-HANDOFF; the WITHHELD `(id,offset)` re-key carried

F drove parse-that to `0.9.0` (PT-1/PT-2/PT-3 landed); G consumed them via RP-4 (**done**).
One item remains the carried WITHHELD.

| # | Item | Status | H disposition |
|---|---|---|---|
| **PT-1 / PT-2 / PT-3** | reentrant error state · isolated packrat · `parseSingleValue` expose | LANDED 0.9.0, consumed via RP-4 | **done.** Struck. |
| **LD-PT-1 (= PT-4 re-key)** | the risky `(id,offset)` packrat RE-KEY — **WITHHELD** by F (the id-only `MEMO.get(p.id)` is latently wrong; isolated but not re-keyed for lack of a position-test lock); G did not complete it | WITHHELD (`packrat.ts:61,82` in the parse-that repo) | **parse-that-HANDOFF (OPEN, carried).** Author `proof:packrat-position` (a same-parser-two-offsets test the id-only key FAILS, the `getCijKey` re-key PASSES), THEN re-key. Blast radius contained to the now-isolated, opt-in BBNF left-recursion path (zero production consumers). Named, gated, completable — NOT a perpetual punt. |
| **LD-PT-2 (realm convergence, = G-HANDOFF-1)** | value.js re-pins its OWN parse-that `^0.8.2 → ^0.9.0` to collapse the dual realm (kf 0.9.0 vs value.js 0.8.2). Surfaced **fail-explicit non-gating** by `proof:deps-current` (G.W2). | OPEN (value.js still declares parse-that `^0.8.2`) | **value.js-HANDOFF (OPEN). The hard PREDECESSOR of a clean future parse-that bump.** The `as any` cross-realm cast (`utils.ts`) compiles + the round-trip is green today; sequence value.js-first only when the realm actually bites. NOT a kf-side shim. |
| **PT-3b** | span-first core unification | BOOK | **parse-that-HANDOFF (BOOK).** Dedicated parse-that tranche; not an H ship. |
| **PT-5** | per-combinator closure alloc (build-time) | RECORD — ALREADY-SOTA | **RECORD (stays).** Build-alloc, not hot-path. Do NOT chase the un-portable Rust `SmallBox`. |

---

## §4. The F BOOKs + G new-waves — re-dispositioned against the live tree

| # | Item (origin) | Live status (`tranche-h-dev`) | H disposition |
|---|---|---|---|
| **LD-FB1 (= FB-1 / NEW-13)** | `animation-composition` HONORING (WAAPI `composite` + rAF accumulate) | **CAPTURE done** (`adapter.ts:29 composition: Map<string,string>`, `:107-125` lift from `rule.composition`); **HONORING still BOOKed** (`adapter.ts:27` *"the deeper behaviour change … is BOOKed, not half-wired"*). The dead-blend prerequisite **G.W17 is FIXED** (`group.ts:309,337 Math.min(existing.length, incoming.length)` + per-element `isNumericUnit` guard `:312-313,340-341`). | **BOOK (engine, the rAF + WAAPI honoring halves) — now UN-blocked** (its FALSIFIED "substrate ready" premise was repaired by G.W17). Gate `proof:composition` (a 2-keyframe `composite:add` mid-frame = sum not replace; WAAPI + rAF parity) PRESUPPOSES `proof:blend` green (now is). The concat-vs-sum semantic (NEW-39) is FB-1's question, decided on top of the working leaf. **H may SHIP** if elected; otherwise carried BOOK. |
| **LD-FB2 (= FB-2 / MF-3-Animation-half)** | the HELD `Animation`/group async sync-step half (`drive` half landed F.W5) | `engine.ts` still carries the async `advanceTo`/`_frame` microtask hop (the awaits carry `yieldToMain` INP relief + event-ordering: `animationstart`/`iteration`/`end`). G did NOT convert it. | **MEASURE-FIRST (the ONE legitimately-gated remainder).** Build `proof:event-ordering` (record the exact event sequence + relative microtask timing) FIRST, THEN convert behind a byte-identical-event-sequence assertion. ~43 ns Animation interior + ~2.1 µs/frame 50-child group is the guarded upside. If the sequence can't be preserved synchronously → RECORD-withheld WITH the divergence. |
| **LD-FB3 (= FB-3 / C-5)** | MorphSVG / numeric MotionPath via VJ-F1 | CSS-native sliver + `fromDrawSVG` shipped (G.W13); NO `getPointAtLength` curve sampler (VJ-F1 OPEN in value.js, §2) | **BOOK + value.js-HANDOFF (gated on VJ-F1).** Sequence VJ-F1 (value.js) first, then the kf `fromMorphSVG` consumer wave. Instrument: an arc-length-uniform-spacing parametrization test. |
| **LD-FB5 (= FB-5)** | intrinsic-size animation (`height:0→auto`; value.js E7 `calc-size()`) | NO `interpolate-size`/`calc-size` path in `src/`; `interpolate-size: allow-keywords` NOT cross-engine-Baseline as of 2026-06 | **BOOK (engine, guarded-enhancement) + value.js-HANDOFF (E7).** Highest user-demand BOOK. VERIFY Baseline before any native-delegation drop; the genuine JS fallback = measure-to-px-then-animate (NO polyfill). |
| **LD-FB6 (= FB-6)** | the `Mod+K` command palette (Invoker Commands Baseline 2025-12-12) | discovery trigger shipped; NO palette component | **BOOK (demo, low urgency) + DECIDE (demo-local vs a glass-ui shell primitive).** Low urgency: the discovery trigger covers the core flow. |
| **LD-DIAG (= VJ-F2 kf half / NEW-18)** | the `ResolvedKeyframes.diagnostics` channel (kf is diagnostics-blind on a malformed parse) | no diagnostics field; producer half landed (parse-that PT-1) | **BOOK (kf seam) + value.js-HANDOFF (the structured sink, §2 VJ-F2).** Gated on the value.js sink. |
| **G.W17 blend leaf** | the dead `add`/`weighted` collapse-to-`replace` bug | **FIXED** (`group.ts:309-341`, `proof:blend`) | **done.** Struck. |
| **G.W18 orbital rotate3d / G.W19 adoptCompiled / G.W13 DrawSVG+`.finished`** | the G additive engine surfaces | shipped + gated (`proof:orbital-rotate3d`, `proof:adopt-compiled`, `proof:drawsvg`, `proof:finished`, G FINAL:112-152) | **done.** Struck. |

---

## §4b. The DEMO band — the G-W7..W12 close vs the H observed-defect RE-OPEN (CRITICAL)

G believed the demo state + idiom + dock bands closed (G.W7-W12, FINAL:90-110). The
user's H audit of the *running* demo reports a band of REGRESSIONS / incompletions. These
are H-NEW (a fresh post-G assay), owned by the H visual/runtime lanes — but two carry a
direct cross-reference into the historical ledger and must be recorded so the P-invariant
is honest (the demo band is NOT silently "all closed"):

| # | Item | Historical anchor | Live / observed | H disposition |
|---|---|---|---|---|
| **LD-DEMO-1** | **scene-state corruption + play/pause restore-suspend (D12, CRITICAL)** | G.W7-W9 claimed the scene/state band closed (`usePlaybackSnapshot.ts`, `useSceneVisibilityPause.ts`, `useSceneRouter.ts`, `useSceneSwap.ts`, `createGlobalState` singleton all present in `demo/app/`); the rAF-leak HIGH was fixed (G.W9 `onScopeDispose`). | **USER-OBSERVED REGRESSION (D12):** switching easing→cube→back leaves controls in an impossible routed state; play/pause not restored/suspended across scenes. The infrastructure EXISTS but the state machine is not irrefragable. | **KFH (CRITICAL) — owned by `a-mobile-architecture` / the scene-state H lane; recorded here as a ledger CROSS-REF, NOT a re-litigation of G.W7-W9.** The historical ledger had NO formal scene-state-machine row; D12 is genuinely net-new H scope. The user's ask (a formal state machine + store — vueuse / Pinia / createGlobalState, evaluate + recommend) is the gestalt fix. The G `usePlaybackSnapshot`/`useSceneVisibilityPause` are the partial substrate to BUILD ON, not to discard. Gate: `proof:scene-state` (round-trip easing↔cube↔back asserts controls-validity + play/pause restore/suspend). |
| **LD-DEMO-2** | **the dock LAG + DockDropdownTrigger popover not opening (D5/D9)** | DP-1 (D.W5) closed the kf-half in G.W12 (`ChromeDock.vue` present, barrel deleted, mask removed); the mobile-occlusion residual was tagged glass-ui-HANDOFF. | **USER-OBSERVED (D5/D9):** dock animations slow/laggy; `@mbabb` DockDropdownTrigger popover (dark-mode + about) no longer opens. glass-ui `^3.4.0` consumed PUBLISHED; glass-ui's AW dock tranche is active NOW. | **glass-ui-HANDOFF (the lag + the popover-open regression) — AUDIT + SUGGEST in the H glass-ui lane (`a-historical-dock`), TAG glass-ui-HANDOFF; do NOT patch glass-ui inside kf** (per MEMORY: dock changes live in glass-ui root, never re-masked in the demo). The kf-side D.W5 close stands **done**; the residual is glass-ui's. |
| **LD-DEMO-3** | the post-F idiom-drift sweep (rail/ball, status-badge, code-token, hero word-spacing) | G.W10/W11 (`proof:idioms` clause 8, hero LCP word-spacing) | the D2 cartoon-shadow / D7 hero φ-typography / D3 easing-editor / D1 controls-sidebar / D6 typing-dots regressions are **H-NEW styling defects** beyond the G sweep. | **KFH — owned by the H styling/visual lanes (`a-cartoon-shadow`, `a-hero-typography`, `a-easing-editor`, `a-controls-sidebar`, `a-typing-dots`, `a-design-language`).** Not in the historical deferred ledger; recorded here only to mark the demo band is NOT fully closed. |

> **Honest demo-band note:** G's demo-close was real for what it gated, but the user's
> H assay surfaces a fresh regression band (D1-D14) the G gates did not cover (no
> cartoon-shadow lock, no scene-state round-trip lock, no φ-typography lock). These are
> H VISUAL/runtime-lane scope — this ledger marks them present and dispositions the two
> with a historical anchor; it does not root-cause them (that is the visual lanes' job).

---

## §5. The chronic band (A→G, re-dispositioned for H)

| # | Chronic | Live re-verify | H disposition |
|---|---|---|---|
| **C-1** | the value.js cross-repo charter | value.js `0.11.1`; the 0.11.1 slice consumed in G; the next slice OPEN (§2) | **CHRONIC-by-design (correct).** H consumes the next landed slice on the next re-pin. Not a punt. |
| **C-2** | `AnimationOptions → CSSAnimationOptions` rename | kf imports the type name nowhere; defines its own local `AnimationOptions` | **RECORD (closed, struck).** Do NOT re-open. |
| **C-3** | `tryParseCache` / value.js memo eviction (unbounded-LRU) | F3 OPEN in `0.11.1` (no cap); no measured editor footprint | **value.js-HANDOFF (= §2 F3).** The bound belongs ONCE in value.js. No second kf policy. Re-open trigger: a measured footprint (none). |
| **C-4** | the `linear()` round-trip | kf reader landed (F.W7); value.js E1/E2 OPEN (`parseLinearStops === undefined`, §2) | **value.js-HANDOFF (E1/E2) + kf-RETIRE-on-land.** When E1 lands, H retires the `parseLinearStops` shim in the SAME no-legacy motion. |
| **C-5** | MotionPath / SVG suite | CSS-native sliver + `fromDrawSVG` shipped (G.W13); MorphSVG geometry OPEN (VJ-F1, §2) | **BOOK + value.js-HANDOFF (= LD-FB3).** |
| **C-6** | the library line-ceiling / `Animation` god-object | **DECIDED in G.W5** — `proof:decomposition` extended to `src/animation/**` with per-file ceilings + RECORDED gated exceptions (`engine.ts` 1400 file / `animations.ts` 900 god-LIST); `proof:engine` Animation-class guard re-baselined 1050→1100. Live: `engine.ts` = **1375L** (under the 1400 ceiling; grew +62L since G's 1313 via cohesive additive W13/W19). | **done (the DECISION was the deliverable) + RECORD (watch the ceiling).** The chronic was the ABSENCE of a gated decision; G made it (not a reflexive split — the class is at its cohesive gestalt). H does NOT re-open. **One watch-note:** at 1375/1400 the headroom is 25L — H should not grow `engine.ts` further without a measured cohesive split or a ceiling re-baseline; record the trip-wire. |

---

## §6. The glass-ui band — kf-half DONE; the AW-tranche residuals are HAND-OFFs

glass-ui is consumed PUBLISHED (`^3.4.0`). Its AW dock tranche is active NOW.

| # | Item | Live re-verify | H disposition |
|---|---|---|---|
| **DP-1 (= GG-5)** | D.W5 dock rename + barrel deletion + mask removal | **DONE in G.W12** — `ChromeDock.vue` present (`demo/@/components/custom/dock/`); barrel deleted; `:always-expanded` mask removed (`occlusion-gate.mjs` green mask-free). | **done (kf-half).** The mobile-occlusion + the D5 LAG + the D9 popover-open residuals are **glass-ui-HANDOFF** (= LD-DEMO-2 §4b). |
| **DP-2** | D.W6 — write `docs/tranches/D/FINAL.md` + version owner | **DONE** — `docs/tranches/D/FINAL.md` present (17 KB, dated Jun 7), version owner Mike Babb. | **done.** Struck. |
| **GG-2** | the vitest motion-core stub realign | DONE (G.W12 realigned the VT stub) | **done.** Struck. |
| **GG-3 (= H-1 = FB-4 enabler)** | glass-ui `startViewTransition({types})` overload + directional CSS | glass-ui-owned; demo scene-VT consumer (`useSceneTransition.ts`) waits on it | **glass-ui-HANDOFF (OPEN, AW tranche). H can drive directly under relaxed cross-repo policy** — but per the H mandate, glass-ui is consumed PUBLISHED; AUDIT + SUGGEST + TAG glass-ui-HANDOFF, do NOT patch in kf. The demo VT consumer (GG-4/FB-4) lands once the helper publishes. |
| **GG-6** | one direct `reka-ui` `SelectIcon` import past the glass-ui surface | (was `AnimationMenuBar.vue`) | **glass-ui-HANDOFF (low, re-export) OR demo-local KILL (use `DockSelectTrigger`).** Re-verify live in the H styling lane; lean demo-local. Instrument: a `grep` clause asserting zero `from "reka-ui"` in `demo/`. |
| **OUT-1..6** | glass-ui-owned (`LabeledField` a11y; `--spring-*` codegen LANDED; reka-Tabs; display-type fluid-step; the VT types helper) | glass-ui domain | **OUT (glass-ui AW). Re-verify the enablers stay stable across the `3.4.0` consume; no kf patch.** |

---

## §7. The constellation / deploy band — kf is AHEAD; the gaps are HANDOFFs

| # | Item | H disposition |
|---|---|---|
| **G-HANDOFF-1 (= LD-PT-2)** | value.js re-pin its OWN parse-that (converge the realms) | **value.js-HANDOFF (OPEN).** §3. |
| **G-HANDOFF-2** | distil kf's green-CI-gated `deploy-pages.yml` → `deploy/templates/deploy-pages.yml` | **deploy-HANDOFF (kf AUTHORS, deploy WRITES).** Carried from G; not a kf write. |
| **G-HANDOFF-3** | deploy fix `dns-cf-sync.sh` `keyframes.pages.dev → keyframes-8uq.pages.dev` (DNS drift, P0) | **deploy-HANDOFF (P0, OPEN).** The authoritative target is kf's `deploy-pages.yml:4-5`. A blind sync REGRESSES the live CNAME. |
| **G-HANDOFF-4 / G-CONST-4/5/6** | constellation docs-lag · phantom submodule gap · action/node version skew · precepts-sync | **RECORD (fourier-hub / kf-ahead; not a kf write).** G-CONST-4 phantom submodule = KILL (asymmetry-is-intent). G-CONST-5 kf-AHEAD (spine should bump to match). |

---

## §8. ARCH KILLs (A→G) — re-affirmed, do NOT re-litigate

All re-verified terminal; no consumer pull A→G; no live evidence reopens any.

- **K-1** ScrollTimeline-native-REPLACE — native NEVER replaces the JS sampler (the bridge is ADDITIVE, demonstrated by E.W9's dual surface).
- **K-2** Worker / OffscreenCanvas / Atomics / Animation Worklet — Houdini still Chromium-only, not Baseline.
- **K-3** `dev.sh`/`deploy.sh` — the npm scripts are the contract; CF-Pages `pages-deploy.sh` SUPERSEDED gh-pages.
- **K-4** WASM-parser-replace — lightningcss marshalling tax fatal; the pure-TS single-pass SHIPPED in 0.9.0.
- **K-5** CSS Typed OM as the interp CARRIER — KILL the carrier; the per-frame WRITE substrate stays a distinct **MEASURE-FIRST** (only-if-a-bench-bites + zero-alloc-preserved).
- **K-6** per-property keyframe easing as a "gap" — kf's CSS `@keyframes` forces per-FRAME easing by spec; ALREADY-CORRECT.
- **K-7** `fromString` multi-animation — one `CSSKeyframesAnimation` IS one animation; multi → the AnimationGroup tier.
- **K-8** Demo frontier non-adoptions (`content-visibility:auto` precondition absent; Speculation Rules MPA-only; Interest Invokers — RE-VERIFY Baseline in H; if now Baseline RE-OPEN as a measure-first showcase, else stays N-A).
- **K-9** chevrotain-codegen rewrite — TRANSPOSE in pure TS, do not rewrite (the `compile()` frontier is a parse-that research BOOK PT-WAVE-4).
- **D1** frozen-shape `ValueUnit` monomorphization — a measured non-win (mono≈mega), NOT shipped in 0.11.1; do NOT re-litigate.
- **SUP-7** bit-packing the frame id / time index / dispatch — KILL three ways (no headroom at compile OR runtime); do NOT re-litigate.

---

## §9. ALREADY-SOTA — the honest non-deficit (manufacture NO work)

Re-verified live across G; H manufactures NO work here.

- **The interpolation kernel / steppers / WAAPI eligibility / boundary / FrameCompiler split / color science / single-grammar parse / parse-that leaf tier** — ALREADY-SOTA.
- **The single-dispatch `lerpValue → iv._lerp` seam** (`engine.ts:731`) — the IDEAL cross-repo contract; the structural reason the re-pin was zero-kf-edit. Proven by G.
- **The light/heavy value.js boundary** (`NumericAnimation`/`SmoothProgress`/`SpringProgress`/`Timeline`/`ElementMorph` carry ZERO static value.js edge; `proof:boundary` self-enforces).
- **glass-ui consumption** — the spring-token cascade, `springLinearStops()` value.js-free enabler, motion-core SCC-boundary, VT a11y focus-route, Dialog/Popover/Select surface — idiomatic apart from the AW-tranche dock residuals (§6) + the one `SelectIcon` reach (GG-6).
- **release.yml / CF-Pages deploy** — tag-gated + `--provenance` (SLSA via OIDC), green-CI-gated `workflow_run` with the `head_branch=='master'` anti-drift guard — kf IS the constellation reference.
- **The V8 object-model · cross-engine carrier · O(N) compiler · DI/pipeline/hygiene · the modern-CSS kernel matrix · the scroll arch + gimbal-free orbital accumulation · the group BUFFER machinery** (the G supplemental ALREADY-SOTA wall) — manufacture nothing.
- **The MF re-measures** (MF-4 diff-skip KILL, MF-5 preset-memo non-finding, MF-6 typed time index, MF-10 lighthouse-off-CI; W8 S1/S3) — all RECORD, settled.
- **The deferred ledger is CLEAN of perpetual keyframes-owned punts** — the 35-gate `proof:*` substrate is in-tree (`proof:all` GREEN at G-close, 35 gates · 637 tests).

---

## §10. THE H ROLL-UP (P-invariant: every carry has a terminal)

**done (shipped D..G — struck from the open ledger):** the RE-PIN spine (RP-1/2/3/4/5,
the whole-history headline) · the 0.11.1 charter slice (A1/A2 · B1b/B3+B5 · C1 · C5 · D2
· F7) · parse-that PT-1/PT-2/PT-3 · G.W17 dead-blend · G.W13/W18/W19 additive engine
surfaces · C-6 line-ceiling DECISION (G.W5) · C-2 rename · DP-1 dock kf-half · DP-2 D
FINAL · GG-2 stub · FB-1 CAPTURE half.

**KFH (fold into H — keyframes/demo-local, each gated):**
- **LD-DEMO-1 / D12** — the scene-state machine + play/pause restore-suspend (CRITICAL; owned by the scene-state H lane; gate `proof:scene-state`; build ON the G `usePlaybackSnapshot`/`useSceneVisibilityPause` substrate).
- **LD-DEMO-3** — the H-NEW styling regression band (D1 controls-sidebar · D2/D14 cartoon-shadow/specular-radial · D3 easing-editor · D6 typing-dots · D7 hero φ-typography), owned by the H styling/visual lanes.
- **LD-FB1** — `animation-composition` HONORING (now un-blocked by G.W17; SHIP if elected, else BOOK), gate `proof:composition` (presupposes `proof:blend`).

**MEASURE-FIRST (land-on-a-number, else recorded-withheld WITH the number):**
- **LD-FB2 / MF-3-Animation-half** — the HELD async sync-step (build `proof:event-ordering` FIRST).
- **SoA `lerpArray` consumption (G-2 / SUP-2)** — the kf numeric-segment SoA at the real bimodal K (K=6-10 bites 2.5-4×, crossover K=2); gate `proof:interp-soa` (real-K corpus + byte-lock + K=1-alias counter + the X-1 cross-engine witness); requires `proof:interpolate-anything` green on the same corpus.
- **K-5 write-substrate** (CSS Typed-OM per-frame write — only-if-a-bench-bites + zero-alloc-preserved).

**BOOK (net-new scope, named wave):**
- **LD-FB3 / C-5** (MorphSVG consumer, gated on value.js VJ-F1) · **LD-FB5** (intrinsic-size `0→auto`, guarded-enhancement, VERIFY Baseline) · **LD-FB6** (the `Mod+K` palette, low urgency) · **LD-DIAG / VJ-F2-kf-half** (the `ResolvedKeyframes.diagnostics` channel, gated on the value.js sink) · **PT-3b** (parse-that span-first core, dedicated tranche).

**value.js-HANDOFF (CHRONIC-by-design C-1; OPEN next-slice):**
- **E1/E2** `linear()`/`steps()` parser (= C-4; kf retires `parseLinearStops` on land) · **VJ-F1** path-geometry sampler · **F2/F2b** color sentinels · **MCI-5** identity-pad (the `it.fails` witness IS the consume signal) · **VJ-F2** structured error sink · **VJ-F4** buffer-reusing `unflattenObjectToString` (= G-3, ZERO kf edit on consume) · **F3** bounded LRU (= C-3) · **F6** easing+leaf-math · **LD-PT-2 / G-HANDOFF-1** (value.js re-pins its own parse-that). *(All ride the next re-pin, ZERO kf edit.)*

**parse-that-HANDOFF (OPEN):**
- **LD-PT-1 / PT-4** — the WITHHELD `(id,offset)` packrat re-key (build `proof:packrat-position`, then re-key).

**glass-ui-HANDOFF (AW tranche active; AUDIT + SUGGEST + TAG, do NOT patch in kf):**
- **LD-DEMO-2 / D5 / D9** (the dock LAG + the DockDropdownTrigger popover-open regression + mobile occlusion) · **GG-3 / H-1** (the `{types}` helper + directional CSS) · **GG-6** (reka re-export, OR demo-local KILL) · **OUT-1..6**.

**deploy-HANDOFF:**
- **G-HANDOFF-2** (kf's `deploy-pages.yml` → spine CF-Pages template) · **G-HANDOFF-3** (P0: `dns-cf-sync.sh` CNAME fix).

**CHRONIC-by-design (correct, not a punt):** **C-1** (the value.js charter — the 0.11.1 slice consumed in G; the charter stays open for the next value.js wave).

**RECORD / KILL (do NOT re-litigate):** **C-2** (rename, closed) · **C-3** (eviction, value.js F3-gated) · **MF-4/5/6/10 · W8 S1/S3** (settled re-measures) · **PT-5** (build-alloc SOTA) · **K-1..K-9 + D1 + SUP-7** (§8) · **G-CONST-4/5/6 + G-HANDOFF-4** (phantom gap / kf-ahead / docs-lag) · **§9 ALREADY-SOTA** · the C-6 ceiling watch-note (25L headroom on `engine.ts`).

**USER-DOMAIN:** **PUB-1** — the re-pin re-publish (consuming 0.11.1/0.9.0/3.4.0; a `4.1.0`, version owner Mike Babb).

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/H/audit/a-deferred-ledger.md`. ZERO source / test /
CI / demo edits to keyframes.js, value.js, parse-that, or glass-ui. Every row traces to a
named prior synthesis ledger (`F/audit/_SYNTHESIS-deferred-ledger.md`,
`G/audit/_SYNTHESIS-deferred-ledger.md`, the D/E/F/G `FINAL.md`) and/or a fresh live
`file:line` / `node -e require` / `npm view` re-verification on `tranche-h-dev` — re-
confirmed this pass: the re-pin LANDED (`package.json` `@mkbabb/value.js ^0.11.1` /
`parse-that ^0.9.0` / `glass-ui ^3.4.0`, NO `file:` protocol), value.js `0.11.1` still
exports `cssLinear` but NOT `parseLinearStops`/`getPointAtLength`/a parsing `light-dark`
(E1/E2 · VJ-F1 · F2 OPEN), the MCI-5 `it.fails` witness GREEN (the pad un-landed),
`engine.ts` = 1375L (under the G.W5 1400 ceiling), `docs/tranches/D/FINAL.md` present,
`ChromeDock.vue` present + barrel deleted, the G.W17 element-wise blend leaf fixed
(`group.ts:309-341`), FB-1 composition CAPTURED-but-HONORING-BOOKed (`adapter.ts:27,29`).
**P-invariant holds: no perpetual keyframes-owned punt survives — every carry exits with a
terminal H disposition.** The one true chronic (C-1, the value.js charter) is
CHRONIC-by-design and correct; H consumes the next landed slice on the next re-pin.
