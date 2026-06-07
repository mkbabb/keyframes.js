# G — the COMPLETE post-F deferred ledger (A → B → C → D → E → F → **G-disposition**)

**Lane id:** `a-deferred-ledger`. **Job:** sweep the whole-history A→F deferred ledger
(chronic + one-shot) and assign EACH carried item a **G disposition**. The F ledger
(`F/audit/_SYNTHESIS-deferred-ledger.md`) was the binding spine; this lane **chains and
supersedes it** by re-verifying every row against the LIVE `tranche-g-dev` tree — where
D+E+F are now **IMPLEMENTED + RELEASED** (kf `4.0.0`, value.js `0.11.0`, parse-that
`0.9.0` on the registry; `keyframes.babb.dev` on Cloudflare Pages). Many F BOOKs/FOLDs
that were "open at F-open" are now LANDED, and a handful of NEW carry-items surfaced
*because* F shipped. **This is TRANCHE DEVELOPMENT — docs only; ZERO source edits.**

**Method (inv ε).** This ledger DEDUPLICATES + PRIORITIZES; it does not repeat F's raw
evidence. Every row traces to an F ledger row (cited) or a re-verified `file:line` on
`tranche-g-dev`. inv-16 is RELAXED for G impl (the user drives value.js/parse-that/glass-ui
too) — but each sibling is still AUDITED as its own surface and tagged HAND-OFF.

**The headline (re-verified live, the single most important shift since F-open):**
> **The F deferred ledger closed CLEAN (zero KFE) — but it was written against
> `tranche-e-impl` (version `3.0.0`, value.js `^0.10.0`). F then LANDED its waves AND
> drove the sibling hand-offs to PUBLICATION (value.js `0.11.0`, parse-that `0.9.0`).
> The kf consumer was NEVER re-pinned.** `package.json` still declares
> `@mkbabb/value.js: "^0.10.0"` + `@mkbabb/parse-that: "^0.8.2"`
> (`package.json:` deps block, re-verified live), and `node_modules/@mkbabb/value.js`
> is `0.10.0` / `node_modules/@mkbabb/parse-that` is `0.8.2` (re-verified live), **while
> the registry has `value.js@0.11.0` + `parse-that@0.9.0` PUBLISHED** (`npm view`,
> re-verified live). **kf 4.0.0 ships on the OLD siblings — it does not yet consume a
> single one of the F sibling wins it drove.** This is the new chronic-shaped debt the
> G ledger is built around (RP-1 below); it is also the *mechanism* by which a large
> band of the value.js charter (§3) becomes ACTUALLY-CONSUMABLE the instant kf re-pins.

---

## G tag taxonomy (the prompt's terminal set)

| Tag | Meaning |
|---|---|
| **KFG** | fold into G — a keyframes-local SHIP now ripe to land in a G wave (gated) |
| **MEASURE-FIRST** | land-on-a-demonstrated-bench-win, else recorded-withheld WITH the number |
| **BOOK** | net-new scope deferred to a named G wave (gate carried), not an audit's pen |
| **KILL** | assessed-and-rejected; do NOT re-litigate |
| **RECORD** | a non-action made honestly (already-SOTA / measured-non-win / correct-by-design) |
| **CHRONIC-by-design** | correctly perpetual (the inv-16 cross-repo charter); not a punt |
| **value.js-HANDOFF** / **parse-that-HANDOFF** / **glass-ui-HANDOFF** | a sibling owns it |
| **OUT** | another surface owns it; kf keeps the enabler + named allowance stable |
| **USER-DOMAIN** | the publish leg — confirm-first, by design |

**P-invariant (the prompt's binding clause):** *no perpetual punts.* Every row below
exits with a terminal G disposition. The ONE genuinely-perpetual item (C-1, the value.js
charter) is **CHRONIC-by-design** and *correct* — that is the inv-16 discipline, not a
punt.

---

## §0. The re-pin debt — the spine of G (NEW at F→G, the consumer leg F left open)

This is the band F's own FINAL named in its breath but did not execute: F.FINAL:11-12
asserts "kf consumes them unchanged through the `lerpValue → iv._lerp` seam **on re-pin**
— ZERO kf edit needed." **The re-pin never happened.** Until it does, every value.js
charter win (C1 −94%, B color hot path ~40×/frame, A `dispatch` 2.41×, the C5 24-no-op
length-unit *correctness* fix) and every parse-that win (the reentrant error state, the
isolated packrat, the completed span dist) is **PUBLISHED-BUT-UNCONSUMED**.

| # | Item | Live evidence (`tranche-g-dev`) | G disposition |
|---|---|---|---|
| **RP-1** | **kf pins value.js `^0.10.0` / parse-that `^0.8.2` while `0.11.0` / `0.9.0` are PUBLISHED** — kf 4.0.0 ships on the pre-F siblings; it consumes NONE of the F sibling wins | `package.json` deps `"@mkbabb/value.js": "^0.10.0"`, `"@mkbabb/parse-that": "^0.8.2"`; `node_modules/@mkbabb/value.js@0.10.0`, `…/parse-that@0.8.2`; registry has both `*.0.11.0` / `*.0.9.0` (all re-verified live) | **KFG (the G headline SHIP).** Re-pin `^0.11.0` / `^0.9.0`, rebuild, run the FULL suite + every `proof:*` (the consume-unchanged claim is the lock — F.FINAL:12 asserts ZERO kf edit; G PROVES it by green CI, or surfaces the edits the claim missed). **Falsifiable instrument:** the existing 261-test suite + `proof:all` must stay green on the bumped pins with NO kf source edit; ANY required edit is a finding against the "consume-unchanged" charter. This is the bigger-half discharge of C1/§3/§4-parse-that in ONE motion. |
| **RP-2** | **The C1/C2/C4/C7 computed-endpoint memo (the F.W6 win, −94%) landed in value.js, NOT kf — kf consumes it ONLY on re-pin** | F.FINAL:39-44 (W6 disposition: "landed in value.js … kf consumes it unchanged through `iv._lerp` on re-pin"); kf `src/` has no `cachedStart`/resize-epoch (the seam was never kf-side, `_SYNTHESIS-deferred-ledger §3.1 C1` confirmed "never landed in E"); blocked behind RP-1 | **KFG (rides RP-1).** No separate kf edit; the −94% becomes real the instant RP-1 lands. **Instrument:** a kf-realm computed-unit interp bench (the `bench/` substrate F.W1 authored) showing the resolve-count drop O(frames)→O(1) post-re-pin. If it does NOT drop, the value.js memo isn't on kf's path → a finding. |
| **RP-3** | **The C5 24-no-op-length-unit *correctness* fix (`50dvh`→`50px` silent-wrong, the cleanest falsifiable gate in the set) landed in value.js 0.11.0; kf still resolves wrong pixels until re-pin** | `valuejs-sota-handoff-v2.md` Wave C C5 (24-of-45 declared, fail-loud branch); kf's rAF resolver is the sole consumer (WAAPI excludes computed units); blocked behind RP-1 | **KFG (rides RP-1) + a kf-side gate.** Author a kf-realm test that animates `dvh`/`lvh`/`svh`/`cqw` endpoints and asserts non-identity resolution (the value.js suite can't — jsdom has no layout, `_SYNTHESIS §3.1 C5`). This is the one re-pin win that fixes *wrong pixels*, not just speed — highest correctness leverage. |

> **RP-1 is the discharge vehicle for most of §3.** The value.js charter's "kf consumes
> it unchanged" structural claim (`_SYNTHESIS §3 preamble`, `valuejs-v2 §6`) is FORCED by
> the single `lerpValue(eased, iv)` seam (`engine.ts`); re-pin is the act that turns the
> claim into shipped behaviour. **Do RP-1 FIRST in G** — it is the highest leverage,
> lowest-source-cost item in the whole ledger, and it gates the honest re-measure of
> every §3 row.

---

## §1. The F BOOKs — re-dispositioned for G (composition-honoring, the HELD sync half, the SVG/geometry suite, scene-VT, intrinsic-size, Mod+K)

These were BOOKed in F with their gates carried. Re-verified live: each is genuinely
un-built in `src/` — F shipped the *sliver* and left the *deep* half BOOKed, as recorded.

| # | F BOOK | Live status (`tranche-g-dev`) | G disposition |
|---|---|---|---|
| **FB-1** | **`animation-composition` HONORING → WAAPI `composite` + rAF accumulate** (F shipped the CAPTURE in F.W8; the engine honoring was BOOKed) | CAPTURED but explicitly un-wired: `adapter.ts:24-27` — "per-keyframe `animation-composition` (`replace`\|`add`\|`accumulate`) … (WAAPI `composite` / rAF accumulate) is **BOOKed, not half-wired**"; `adapter.ts:120` lifts it onto the resolved shape only | **KFG (the ripest F BOOK).** The capture is in-tree and inert; honoring is the natural next motion. **Two halves, both gated:** (a) WAAPI lane → pass `composite` through `adapter.ts`→`waapi.ts` for the eligible path; (b) rAF lane → `add`/`accumulate` blend in `group.ts`'s existing composite buffer (the `_grouped` null-fill machinery, `group.ts:84-174`, is ALREADY the accumulation substrate). **Instrument:** extend `proof:adapter-capture` → `proof:composition` (a 2-keyframe `composite:add` animation whose mid-frame value = sum, not replace; WAAPI + rAF parity). The semantic-mismatch blocker NEW-39 named (concat-vs-sum) is resolved here, not separately. |
| **FB-2** | **The HELD `Animation`/group sync-step half** (F.W5 landed the `drive` half; the `Animation`/group half HELD behind the event-ordering lock — the §Mandate's no-ship-on-assertion) | `playback.ts:111-112` `drive` reschedules INLINE (landed); `engine.ts:792` `async advanceTo`, `engine.ts:821` `private async _frame(): Promise<boolean>` — **still async** (the microtask hop F.W5 deliberately did NOT remove) | **MEASURE-FIRST (the ONE legitimately-gated remainder of MF-3).** The hold is correct: `animationstart`/`iteration`/`end` event ordering is observable; ripping the promise risks reordering events relative to the consumer's `.then`. **G's job is to BUILD THE LOCK, not to assume it:** author `proof:event-ordering` (record the exact event sequence + relative microtask timing for a multi-iteration animation across `play`/`advanceTo`/group-managed), THEN land the sync conversion behind a byte-identical-event-sequence assertion. If the sequence cannot be preserved synchronously, RECORD-withheld with the divergence. ~43 ns Animation interior + ~2.1 µs/frame 50-child group (`_SYNTHESIS MF-3`) is the upside the lock guards. |
| **FB-3** | **MorphSVG / DrawSVG / numeric MotionPath → value.js VJ-F1 path-geometry sampler** (F.W12 shipped the CSS-native `offset-distance`/`offset-path` MotionPath sliver, WAAPI-eligible) | `src/animation/motion-path.ts` present (the CSS-native sliver, F.W12); NO `getTotalLength`/`getPointAtLength` curve sampler anywhere in `src/` (re-verified — the geometry half is genuinely absent) | **BOOK + value.js-HANDOFF (VJ-F1, carried).** The geometry sampler is value-domain (`getPointAtLength`/`getTotalLength` curve sampling) → value.js's wave. kf's BOOK is the consumer primitive (`fromMorphSVG`/`drawSVG`) that calls it. **Under the relaxed inv-16 the user CAN drive both in G** — sequence VJ-F1 (value.js) FIRST, then the kf consumer wave. **Instrument (kf half):** a path-length parametrization test (sample a known cubic at t=0/0.5/1, assert arc-length-uniform spacing). The one real persisting competitor-feature gap (C-5 below). |
| **FB-4** | **Typed/directional scene-VT, gated on glass-ui H-1** (F.W13 shipped the `text-wrap: pretty` sliver; the directional VT `types` helper is a glass-ui-HANDOFF; typed scene-VT BOOKed behind it) | `r-scroll-vt-2026 H-1` / `r-demo-design-2026 §4` (the demo BOOK consumes the helper once it lands); directional VT Baseline 2026-01-13 (now PAST — the platform is ready) | **BOOK (demo-motion-polish wave) + glass-ui-HANDOFF (H-1).** The platform half is now Baseline-shipped (directional VT 2026-01-13, typed VT 2025-10-14); the blocker is purely the glass-ui `types` helper. **G can drive glass-ui H-1 directly** (relaxed inv-16) — then the demo scene-VT BOOK lands as the consumer. **Instrument:** a browser-driven VT-types assertion in the existing `demo-smoke` Chromium job (NOT a new gate — `_SYNTHESIS NEW-7`'s convention). Gate carried; un-actionable until H-1. |
| **FB-5** | **Intrinsic-size animation (`height:0→auto`)** — the most-requested animation kf can't do (NEW-37; GAP-NAMED engine wave + value.js E7 `calc-size()` parser) | NO `interpolate-size`/`calc-size`/intrinsic path in `src/` (re-verified — genuinely absent) | **BOOK (engine, its own guarded-enhancement wave) + value.js-HANDOFF (E7).** Native `interpolate-size`/`calc-size()` is now wider (Chrome 129+, but still NOT cross-engine-Baseline as of 2026-06 — VERIFY before any native-delegation drop; `r-waapi-platform-2026 §3` RECORDED don't-adopt-until-Baseline). **G shape:** a guarded-enhancement (feature-detect `interpolate-size: allow-keywords`, the genuine JS fallback = measure-to-px-then-animate — NO polyfill per the Mandate). **Instrument:** a `0→auto` height animation that lands on the measured content height, feature-detected. Highest user-demand BOOK; do AFTER the re-pin + FB-1. |
| **FB-6** | **The `Mod+K` command palette** (NEW-28; F.W13/F.W15 shipped a visible shortcuts-discovery trigger; the palette BOOKed via Invoker `command="show-modal"`) | `demo/@/components/custom/editor-shell/EditorShell.vue:20` — a CODE COMMENT naming "the Invoker `command="show-modal"`" idiom; NO palette component (`find demo -name '*Palette*' -o -name '*Command*'` → none, re-verified) | **BOOK (demo, low urgency) + glass-ui-HANDOFF (if the palette is a shared shell primitive).** Invoker Commands are Baseline 2025-12-12 (the forward idiom is now shippable). DECIDE in G whether the palette is a demo-local component or a glass-ui shell primitive (the editor-shell is shared) → route accordingly. Low urgency: the discovery trigger (F.W15) already covers the core "find a shortcut" flow. **Instrument:** a browser-driven `Mod+K`-opens-palette assertion in `demo-smoke`. |

---

## §2. The chronic band (A→F, 2+ tranches) — re-dispositioned for G

The six F-named chronics (`_SYNTHESIS §7`), each re-verified live and given a G terminal.

| # | Chronic | F-open status | Live re-verify (`tranche-g-dev`) | G disposition |
|---|---|---|---|---|
| **C-1** | **The value.js cross-repo charter** (Waves A–F: parse fast-tier, color hot path, computed-unit D-3, interp carrier, easing parsers, surface hygiene) | CHRONIC-by-design, value.js-HANDOFF; F augmented to v2, did NOT close | value.js `0.11.0` PUBLISHED with the F charter waves landed (`valuejs-sota-handoff-v2.md`; F.FINAL:90-93); kf un-re-pinned (RP-1) | **CHRONIC-by-design (correct) — but G CONSUMES the landed slice via RP-1.** The charter is correctly perpetual (value.js is dirty+active; new waves keep opening). **What G changes:** the *already-landed* 0.11.0 slice (A `dispatch` 2.41×, B color ~40×/frame, C1 −94%, C5 correctness, D2 SoA K-gated) stops being a charter promise and becomes SHIPPED kf behaviour the moment RP-1 lands. The charter ITSELF stays open for the next value.js wave. **No perpetual punt:** the chronic is the *process*, and the process is working (a slice ships every tranche). |
| **C-2** | **`AnimationOptions → CSSAnimationOptions` rename** (filed 5× by value.js) | CLOSED at F — discharged by the 0.10.0 pin; struck from the band | kf imports the type name nowhere (`constants.ts` defines its own local `AnimationOptions`); structurally consumed | **RECORD (stays closed).** Do NOT re-open. Re-verified transparent. No G action. |
| **C-3** | **`tryParseCache` / value.js memo eviction** (the unbounded-LRU hazard) | CHRONIC-WITHHELD; terminal home = value.js charter F3 | `tryParseCache` (`utils.ts`) still load-bearing (116×, non-negotiable); the eviction bound belongs ONCE in value.js's `memoize` (F3); no editor-per-keystroke footprint measured | **CHRONIC-WITHHELD → value.js-HANDOFF (F3), rides RP-1 partially.** If value.js 0.11.0 shipped the F3 bounded LRU, RP-1 inherits it — VERIFY in G whether 0.11.0 caps `maxCacheSize` (it defaulted `Infinity`, FIFO-on-cap, `valuejs-v2 Wave F F3`). If shipped, the kf mirror inherits the bound for free. If NOT, it stays a value.js-HANDOFF. Re-open trigger UNCHANGED: a measured editor memory footprint (none exists). **Do NOT grow a second kf eviction policy** (the Mandate's no-workaround-beside-the-fix). |
| **C-4** | **The `linear()` round-trip** (value.js `cssLinear` evaluator, the parser to feed it) | HALF-CLOSED, NARROWING; kf reader LANDED E.W7 S5; F closed the spring emit→parse half (NEW-17) + the per-keyframe `linear()` twin (F.W7) | F.FINAL:48-50 (W7: `cssTwinFor` recognizes `linear()`, spring round-trips, `proof:roundtrip-easing`); value.js E1/E2 (the `linear()`/`steps()` PARSER) — VERIFY if landed in 0.11.0 | **value.js-HANDOFF (E1/E2) + RECORDED kf F-PARSE-1 (the no-legacy collapse).** The kf side is DONE (reader + spring lock landed F.W7). The remaining half is value.js's `linear()` parser → `LinearStop[]`. **When E1 lands (rides RP-1), G must RETIRE kf's `parseLinearStops` shim** (`src/animation/springLinearStops.ts` / the `utils.ts` reader) in the SAME motion — no compat alias beside the value.js parser (the Mandate's no-legacy). VERIFY whether 0.11.0 shipped E1; if so this is a KFG no-legacy excision; if not, value.js-HANDOFF. `linear()` is Baseline-WA 2026-06-11 (now PAST). |
| **C-5** | **MotionPath / SVG suite (F-6)** | CHRONIC-BOOK, partly actionable; F.W12 shipped CSS-native MotionPath | `motion-path.ts` present (sliver landed); MorphSVG/DrawSVG geometry absent (= FB-3 above) | **BOOK + value.js-HANDOFF (VJ-F1) — see FB-3.** The CSS-native sliver discharged the F-actionable half. The geometry sampler (the value-domain chronic) carries to G. No longer a "can't do MotionPath at all" gap — narrowed to "no SVG path morphing." |
| **C-6** | **The library line-ceiling / `Animation` god-object** | CHRONIC-UNDECIDED → BOOK; F-NEW-3 found the 913L class at its cohesive gestalt; the gap = ABSENCE of a gated decision | `engine.ts` is now **1313L** (grew from ~1179L at F-open — F.W5/W7/W8/W9/W12 added surface); `proof:decomposition` sweeps the demo, NOT `src/animation/**` (re-verified: the library is still exempt from the ceiling gate) | **KFG (the DECISION, finally) — MEASURE-FIRST on any split.** The chronic is STILL the absence of a gated decision, and the file grew +130L since F-open *unconstrained*. **G must DECIDE, not re-defer (P-invariant):** either (a) extend `proof:decomposition` to `src/animation/**` with a per-file ceiling + a recorded gated EXCEPTION for `engine.ts` with the cohesion rationale (F-NEW-3/F.md:214 ruled the `Animation` class at gestalt — a split-for-line-count is the legacy-shape the Mandate forbids), OR (b) if 1313L now spans genuinely-separable concerns (playback loop vs frame-state vs WAAPI-delegation vs event-dispatch), a MEASURE-FIRST cohesive split (NOT reflexive). **Instrument:** the extended `proof:decomposition` gate itself is the lock — it forces the decision to be recorded. This is the one chronic that is purely kf-owned and purely a G call to make. |

> **The honest chronic verdict for G:** C-2 stays closed; C-1 is correctly perpetual and
> G ships its landed slice via re-pin; C-3 rides value.js F3; C-4's kf half is done and
> the value.js half rides re-pin (with a no-legacy shim excision queued); C-5 narrowed to
> the SVG-geometry BOOK; **C-6 is the one chronic G MUST resolve with a gated decision.**
> No perpetual keyframes-owned punt survives — every chronic is closed, value.js-gated
> (riding RP-1), or a single G decision (C-6).

---

## §3. The value.js charter (Waves A–F) — CHRONIC-by-design; G consumes the landed slice

The 405-line charter → v2 (`valuejs-sota-handoff-v2.md`). C-1 is chronic *correctly*. The
G shift is consumption, not re-litigation. **Every row is value.js-HANDOFF; the kf
disposition is "consumes via RP-1, no kf edit" unless a paired FOLD is named.**

| Wave (charter) | Landed in 0.11.0? (VERIFY in G) | kf G disposition |
|---|---|---|
| **A / A1 / A2** (`dispatch` LUT; maximal-munch unit regex — the latent non-anchored `istring` correctness bug) | F.FINAL:90 lists "A1 `any()`→`dispatch()` (2.41×)" + "A2 the latent unit-regex correctness bug" as DRIVEN on `tranche-f-handoff` → presumed in 0.11.0 | **value.js-HANDOFF; kf consumes via RP-1.** A2 is *correctness* (latent prefix-match) — kf's compile-time/editor path inherits the fix on re-pin. No kf edit. |
| **B / B1–B5** (color hot-path serializer ~40×/frame; channel-plan precompute; `formatColor` `/alpha` defect VJ-F3) | F.FINAL:90-92 "B1b `formatColor` `/alpha`", "B3+B5 the color-channel plan (3.96×)" → presumed in 0.11.0 | **value.js-HANDOFF; kf consumes via RP-1.** The ~40×/frame color lane becomes real kf per-frame behaviour on re-pin. **Instrument:** a kf-realm color-interp bench post-re-pin. |
| **C / C1·C2·C4·C7** (computed-endpoint memo, −94%) | F.FINAL:92-93 "C1/C2/C4/C7 the computed-endpoint memo (the F.W6 win, −94%)" → in 0.11.0 | **= RP-2.** Rides RP-1. |
| **C5** (24 no-op length units, correctness) | F.FINAL:90 "C5 the 24 no-op length units" → in 0.11.0 | **= RP-3.** Rides RP-1 + a kf-side non-identity gate. |
| **D / D2** (SoA `Float64Array` carrier, K-gated; D1 demoted to measured non-win) | F.FINAL:91 "D2 the SoA carrier (K-gated)" → in 0.11.0 | **value.js-HANDOFF; kf consumes via RP-1, MEASURE-FIRST.** The SoA win is K≥16 (`_SYNTHESIS §3.1 D1/D2`). kf's real K is dominated by K=1–2 → re-measure post-re-pin at real-K; if no kf-realm bite, RECORD it as a value.js-internal win kf inherits transparently. |
| **E1 / E2** (`linear()`/`steps()` parser) | UNCERTAIN — F drove the kf *reader*, not necessarily the value.js *parser*; VERIFY 0.11.0 | **= C-4 above.** value.js-HANDOFF; on land, KFG excises the kf `parseLinearStops` shim (no-legacy). |
| **F3** (bounded LRU memo — the chronic terminal home for MF-9/C-3) | UNCERTAIN — VERIFY 0.11.0 caps `maxCacheSize` | **= C-3 above.** If shipped, kf inherits the bound via RP-1. |
| **F7** (the `console.error` custom-name leak) | F.FINAL:91 "F7 the leak" → in 0.11.0 | **value.js-HANDOFF; kf consumes via RP-1.** Diagnostics-hygiene, inherited. |
| **F2/F2b** (`currentColor`/`light-dark()`/`contrast-color()`) | UNCERTAIN — NOT in F.FINAL's driven list; likely still open | **value.js-HANDOFF (HIGH for `currentColor`/`light-dark`; `contrast-color` BOOK).** Carried to value.js's next wave; G re-proposes. `light-dark()` Baseline 2024-05-13; `contrast-color()` Baseline Apr-2026 (black/white-only — must NOT alias to value.js's richer `safeAccentColor`). |
| **F6** (parser-free easing + leaf-math sub-path) | UNCERTAIN | **value.js-HANDOFF; paired kf FOLD (delete `internal/leaves.ts`, static-re-export canonical clamp/scale/lerp).** Carried — re-verify the leaves convergence post-re-pin (F.W11 already converged the 4× clamp onto `internal/leaves.clamp`). |
| **VJ-F1** (path-geometry sampler) | NOT landed (= FB-3 / C-5) | **value.js-HANDOFF (BOOK).** Sequence in G under the relaxed inv-16, then the kf consumer wave. |
| **VJ-F2** (structured parse-error sink) | Tied to parse-that PT-WAVE-1 (the error state must be local first) | **value.js-HANDOFF + kf BOOK (the `diagnostics` channel).** Rides parse-that PT-WAVE-1 → value.js `onParseError` shape → kf surfaces. Three-repo chain. |
| **VJ-F3 / VJ-F4** (color-alloc defects; buffer-reusing `unflattenObjectToString` — the real MF-4 per-frame garbage) | VJ-F3 partly in B (the `/alpha` defect); VJ-F4 UNCERTAIN | **value.js-HANDOFF.** VJ-F4 (the serialization alloc, the real per-frame garbage MF-4 named) is the remaining hot-path value.js win — re-propose into the next wave. |

---

## §4. The parse-that charter — parse-that-HANDOFF; the WITHHELD re-key carried

F drove parse-that to `0.9.0` (F.FINAL:95-97). Re-verified: the F handoff (`parse-that-sota-handoff.md`).

| # | Item | F status | G disposition |
|---|---|---|---|
| **PT-1** | **Non-reentrant error state → thread onto `ParserState`** (PT-WAVE-1, HIGH, soundness) | F.FINAL:96 "the non-reentrant error state threaded onto `ParserState`" → in 0.9.0 | **parse-that-HANDOFF (LANDED) → kf consumes via RP-1.** Soundness win; invisible to happy-path microbench, surfaces under re-entrant `.map`/`.chain`. RECORD as landed; re-verify on re-pin. Unblocks VJ-F2 (the structured diagnostics sink). |
| **PT-2** | **Dead+unsound id-keyed packrat → isolate; strip the per-parse `MEMO.clear()` tax** (PT-WAVE-2, MED) | F.FINAL:96 "the unsound id-only packrat isolated off the hot path (+~36ns/parse)" → in 0.9.0 | **parse-that-HANDOFF (LANDED, the ISOLATE half) → kf consumes via RP-1.** The +~36ns/parse hot-path relief is inherited on re-pin. |
| **PT-4 (re-key)** | **The risky `(id,offset)` packrat RE-KEY — WITHHELD** (the latently-wrong id-only `MEMO` key → the correct `getCijKey`; F isolated but did NOT re-key) | F.FINAL:96-97 "the risky `(id,offset)` re-key honestly **WITHHELD** (booked)"; `parse-that-sota-handoff.md` PT-WAVE-2:197 (the re-keyed `MEMO` must pass a same-parser-two-offsets position test) | **parse-that-HANDOFF (the carried WITHHELD) → PT-WAVE-2 completion.** This is the one parse-that item F deliberately left undone — the re-key from id-only to `(id,offset)` is the no-legacy unsoundness cut, but it changes memo behaviour and F withheld it for lack of the position-test lock. **G (relaxed inv-16) can complete it:** author `proof:packrat-position` (a same-parser-two-offsets test the id-only key FAILS and the `getCijKey` re-key PASSES), THEN re-key. Since the packrat is now ISOLATED + opt-in (PT-2 landed), the blast radius is contained to the BBNF-generator left-recursion path. **No perpetual punt:** named, gated, completable in G. |
| **PT-3** | **Expose `parseSingleValue`/`parseFunctionArgs`** (the producer half of value.js `cssParser`-adoption) | F.FINAL:97 "the `§1.5` expose" → in 0.9.0 | **parse-that-HANDOFF (LANDED) → value.js Wave B consumes it (the multi-week transposition, `valuejs-v2 §1.5`).** Three-repo chain: parse-that exposed → value.js adopts → kf inherits via re-pin. The value.js adoption is the BOOK (multi-week, parity-gated). |
| **PT-3b (span-first core)** | **The span-first core unification** (every leaf returns a `Span`, `.text()` a consumer map) | BOOK (multi-day, real blast radius), `parse-that-sota-handoff.md` PT-WAVE-3b | **parse-that-HANDOFF (BOOK).** Dedicated parse-that tranche; not G-ship. The 3a half (rebuild + bump the half-published span dist) is DONE (0.9.0 completed the span dist, F.FINAL:96). |
| **PT-5** | The per-combinator closure alloc (build-time, parsimmon model) | RECORD — ALREADY-SOTA | **RECORD (stays).** Build-alloc, not hot-path. Do NOT chase the un-portable Rust `SmallBox`. |

---

## §5. ARCH KILLs (A→F) — re-affirmed, do NOT re-litigate

All re-verified terminal; no consumer pull A→F; no live evidence reopens any.

| # | KILL | G re-affirm |
|---|---|---|
| **K-1** | ScrollTimeline-native-REPLACE (native NEVER replaces the JS sampler) | **KILL (re-affirm).** E.W9 added the native bridge ADDITIVELY, feature-detected; the dual surface demonstrates the kill. Re-open trigger: an off-thread-scroll consumer — none A→F. |
| **K-2** | Worker / OffscreenCanvas / Atomics / Animation Worklet | **KILL (re-affirm).** Houdini Animation Worklet still Chromium-only, not Baseline; engine is hot-path-alloc-free. |
| **K-3** | `dev.sh` / `deploy.sh` (the npm scripts are the contract; deploy is now CF-Pages `scripts/pages-deploy.sh`, F.FINAL:120) | **KILL (re-affirm).** The CF-Pages spine SUPERSEDED the gh-pages path entirely (F.FINAL:119-124 — the legacy `deploy.yml` RETIRED). No shell-script reopening. |
| **K-4** | WASM-parser-replace (Rust→WASM CSS bridge) | **KILL (strengthened).** lightningcss's documented marshalling tax is fatal to the per-token workload; the SOTA win is the pure-TS single-pass (parse-that's `parsers/css/`), now SHIPPED in 0.9.0. |
| **K-5** | CSS Typed OM as the interp CARRIER | **KILL (the carrier) + MEASURE-FIRST (the per-frame WRITE substrate, separate axis).** Carrier KILL stands; the Typed-OM *write* lane is a distinct measure-first only-if-a-bench-bites + zero-alloc-preserved item. |
| **K-6** | Per-property keyframe easing as a "gap" | **KILL (assessed).** kf's CSS `@keyframes` surface forces per-FRAME easing by spec — an ALREADY-CORRECT design, a lead not a gap. |
| **K-7** | `fromString` multi-animation | **KILL (re-affirm).** One `CSSKeyframesAnimation` IS one animation; multi → the AnimationGroup/`Sequence` tier (`parseCSSStylesheet` is the escape hatch). |
| **K-8** | Demo frontier non-adoptions (`content-visibility:auto` precondition absent; Speculation Rules MPA-only; Interest Invokers Chrome-only) | **KILL/RECORD (re-confirm).** Reasoned exemptions; re-verify Interest Invokers' Baseline status in G (was Chrome-142-only) — if now Baseline, RE-OPEN as a measure-first showcase, else stays N-A. |
| **K-9** | chevrotain-codegen rewrite of the parser | **KILL.** Companion to K-4: TRANSPOSE in pure TS, do not rewrite. The staged-combinator `compile()` FRONTIER is a parse-that research BOOK (PT-WAVE-4), subordinate to manual `dispatch`. |

---

## §6. D-PENDING / OUT / USER-DOMAIN — re-verified live (the gated-on-glass-ui band)

The §Mandate's D.W5/W6 gated on glass-ui 3.3.0. **Re-verified live — STILL UNCHANGED.**

| # | Item | Live re-verify (`tranche-g-dev`) | G disposition |
|---|---|---|---|
| **DP-1** | **D.W5** — dock rename (`TopDock→ChromeDock`, `AnimationMenuBar→TransportDock`) + `dock/index.ts` deletion + `always-expanded` mask removal + square/mobile occlusion | `demo/@/components/custom/dock/` still has `TopDock.vue` + `index.ts`; NO `ChromeDock.vue`/`TransportDock.vue` (re-verified — still PRE-rename) | **D-PENDING → glass-ui-HANDOFF (3.3.0) + KFG-on-unblock.** Gated on glass-ui PUBLISHING 3.3.0. **G's call:** under relaxed inv-16, G CAN drive glass-ui 3.3.0 (the dock rename is a glass-ui-root change per the user's MEMORY feedback — "all glass-ui/dock changes must go in glass-ui repo, never patched in demo"), THEN land the kf-demo consumer rename. **If glass-ui 3.3.0 is still un-published, this stays the ONE legitimately-blocked carry** — but P-invariant demands G either drives the unblock or RECORDS the explicit external blocker (not a silent re-defer). Verify glass-ui's published version in G. |
| **DP-2** | **D.W6** — the D FINAL + version owner naming | `docs/tranches/D/FINAL.md` still ABSENT (re-verified) | **BOOK (write D/FINAL.md) — trivially dischargeable in G.** D.W6 closes after D.W5 (the version owner WAS named in the F release, F.FINAL:113 "Mike Babb"). The D FINAL is the one missing tranche-record doc. **No external blocker on the doc itself** — only the dock-rename narrative it would describe waits on DP-1. G can write the D FINAL describing the LANDED D content + noting D.W5 as glass-ui-gated. **KFG (docs).** |
| **OUT-1..OUT-5** | glass-ui-owned (`LabeledField` a11y; `--spring-*` token codegen; AU reka-Tabs/`<Role>Dock`; display-type fluid-step) | unchanged; kf keeps the enablers stable + value.js-free | **OUT (glass-ui) — re-verify, no kf patch.** Re-confirm the enablers (`springLinearStops()` value.js-free) stay stable across the re-pin. |
| **OUT-6 / H-1** | The VT `types` helper (directional/group VT) | = FB-4 above | **glass-ui-HANDOFF (H-1).** The demo scene-VT BOOK consumes it. Platform is Baseline-ready (directional VT 2026-01-13). |
| **PUB-1** | The stacked changesets / publish tier | kf 4.0.0 PUBLISHED (F.FINAL:108-124 — the B+C+D+E+F major stack shipped, provenance-signed, CF-Pages deployed) | **USER-DOMAIN — DISCHARGED for the F stack.** The 4.0.0 publish is DONE. **The NEW USER-DOMAIN leg is the re-pin re-publish:** RP-1 (consuming 0.11.0/0.9.0) is itself a publishable kf change → a `4.0.1`/`4.1.0` confirm-first publish leg once G lands the re-pin + its verifications. Version owner: Mike Babb. |

---

## §7. ALREADY-SOTA — the honest non-deficit (do NOT manufacture work here)

The F charter's binding record (`F.md § ALREADY-SOTA`, ~90% of the post-E stack) HOLDS,
re-verified live. G manufactures NO work in these surfaces:

- **The kernel / steppers / WAAPI eligibility / boundary / FrameCompiler split / color
  science / single-grammar parse / parse-that leaf tier** — all ALREADY-SOTA, untouched
  by F, untouched by G.
- **The cross-repo discipline (propose-never-write, the charter cadence)** is the
  constellation's most SOTA-grade process invariant (`a-tranche-retro-F §5,§7`). G's
  relaxed inv-16 does not weaken it — it lets the user DRIVE the hand-offs, but each
  sibling is still audited as its own surface.
- **The deferred ledger itself is CLEAN of perpetual keyframes-owned punts** — re-verified.
  Every carry has a named G terminal. The F.W6 wrapper was correctly-withheld (the win is
  value.js's, consumed via RP-1). The benches/gates substrate F.W1 authored is in-tree
  (23 `proof:*` gates verified live) — G's MEASURE-FIRST items have their harnesses.
- **The MF re-measures (MF-4 diff-skip KILL, MF-5 preset-memo non-finding, MF-6 typed
  time index, MF-10 lighthouse-off-CI)** are all RECORD — settled, do NOT re-open.

---

## §8. The G actionable roll-up (P-invariant: every carry has a terminal)

**KFG (keyframes-local SHIPs, each gated):**
- **RP-1** (re-pin `^0.11.0`/`^0.9.0` — the headline; gate = green suite + `proof:all`, NO kf edit) → drags in RP-2 (−94% C1), RP-3 (C5 correctness), and the §3 landed slice (A/B/D2/F7, parse-that PT-1/2/3).
- **FB-1** (`animation-composition` honoring → `proof:composition`; the ripest F BOOK).
- **C-6** (the library line-ceiling DECISION → extend `proof:decomposition` to `src/animation/**` with a recorded exception OR a measured cohesive split; the +130L-since-F-open chronic).
- **C-4 collapse** (retire `parseLinearStops` shim IF value.js E1 landed in 0.11.0 — no-legacy excision).
- **DP-2** (write `docs/tranches/D/FINAL.md` — the missing tranche record).

**MEASURE-FIRST (land-on-a-bench-win, else recorded-withheld WITH the number):**
- **FB-2** (the HELD `Animation`/group sync half → build `proof:event-ordering` FIRST, then convert behind a byte-identical-event-sequence assertion).
- **D2 re-measure** (post-re-pin, at real-K; RECORD if no kf-realm bite).
- **K-5 write-substrate** (Typed-OM per-frame write, only-if-a-bench-bites + zero-alloc-preserved).

**BOOK (net-new scope, named G wave, gate carried):**
- **FB-3 / C-5** (MorphSVG/DrawSVG consumer, after value.js VJ-F1).
- **FB-4** (typed/directional scene-VT, after glass-ui H-1).
- **FB-5** (intrinsic-size `0→auto`, guarded-enhancement — VERIFY Baseline first).
- **FB-6** (the `Mod+K` palette, low urgency).
- **PT-3b** (parse-that span-first core, dedicated parse-that tranche).

**value.js-HANDOFF (the charter, CHRONIC-by-design C-1; G drives under relaxed inv-16):**
- **VJ-F1** (path-geometry sampler) · **VJ-F2** (structured parse-error sink, after parse-that PT-1) · **VJ-F4** (buffer-reusing `unflattenObjectToString` — the real MF-4 garbage) · **F2/F2b** (`currentColor`/`light-dark`/`contrast-color`) · **F6** (easing+leaf-math sub-path).

**parse-that-HANDOFF (G drives under relaxed inv-16):**
- **PT-4 re-key** (the WITHHELD `(id,offset)` packrat re-key → build `proof:packrat-position`, then re-key; the one parse-that item F deliberately left undone).

**glass-ui-HANDOFF:**
- **DP-1** (dock rename / 3.3.0) · **H-1** (VT `types` helper) · **OUT-1..5**.

**CHRONIC-by-design (correct, not a punt):** **C-1** (the value.js charter — G ships its landed slice via RP-1; the charter stays open for value.js's next wave).

**RECORD / KILL (do NOT re-litigate):** **C-2** (rename, closed) · **C-3** (eviction, value.js F3-gated, no second kf policy) · **MF-4/5/6/10** (settled re-measures) · **PT-5** (build-alloc SOTA) · **K-1..K-9** (§5) · **§7 ALREADY-SOTA**.

**USER-DOMAIN:** **PUB-1** (the 4.0.0 stack DISCHARGED; the re-pin re-publish is the new confirm-first leg).

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/G/audit/a-deferred-ledger.md`. ZERO source edits to
keyframes.js, value.js, parse-that, or glass-ui. Every row traces to a named F ledger row
(cited) or a `file:line` / `npm view` / `node_modules` re-verification against the LIVE
`tranche-g-dev` tree. The re-pin gap (RP-1/2/3), the dock pre-rename (DP-1), the absent
`D/FINAL.md` (DP-2), the still-`async` `Animation._frame` (FB-2), the +130L `engine.ts`
(C-6), and the inert `animation-composition` capture (FB-1) were each re-verified live.
**P-invariant holds: no perpetual keyframes-owned punt survives — every carry exits with
a terminal G disposition.** The one true chronic (C-1, the value.js charter) is
CHRONIC-by-design and correct; G ships its already-landed 0.11.0 slice via the re-pin.
