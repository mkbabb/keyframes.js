# J audit — wave I.W6 plan-vs-delivery

**Lane:** wave-I.W6  
**Commit audited:** `4103c22` (feat(tranche-I W6): specular consume-edge + Plus-Jakarta font reclaim)  
**Tree state:** `master` @ `4072af9` (post-WZ, clean)  
**Date:** 2026-06-09  
**Auditor:** wave-I.W6 lane (32-agent parallel deep audit)

---

## 1. Delivery vs spec summary

| Scope item | Spec requirement | Tree status | Verdict |
|---|---|---|---|
| **S1** glass-ui publishes v3.8.0/3.9.0 (coordination ask) | AX session to publish `specular="off"` default + W54 rest-intensity-0 | Published: lockfile resolves `@mkbabb/glass-ui 3.9.0` from registry | DONE |
| **S2** kf pin bump `~3.5.1 → v3.8.0 line` | `package.json` `~3.5.1 → ~3.9.0` (skip 3.6/3.7); ZERO kf CSS, no fork | `package.json:173` `"@mkbabb/glass-ui": "~3.9.0"`; lockfile `3.9.0`; diff adds 0 kf-side specular CSS | DONE |
| **S3** substrate depth (non-blocking, M-2) | Give page glass a real thing to refract; explicitly NON-BLOCKING, may not gate the wave | Deferred as follow-up per `impl/I.W6.md:36`; not delivered | DEFERRED (per-spec; correct) |
| **S4a** invert gate: `proof:specular-absent-at-rest` | New RUNTIME gate; born-RED on 3.5.1 alpha 0.22–0.35; GREEN on 3.9.0 | `scripts/proof-specular-absent-at-rest.mjs` exists (159 L); in `proof:correctness` aggregator; CI step with `KF_REQUIRE_BROWSER: "1"` | DONE |
| **S4b** DELETE `proof:specular-handoff` | Script file and package.json entry both gone | `ls scripts/proof-specular-handoff.mjs` → NOT FOUND; no package.json key | DONE |
| **Font reclaim (I.W6-font)** | Override `--font-stack-text` at `:root` (documented consumer lever) so Plus Jakarta never lands on kf surfaces | `demo/@/styles/style.css:113-117`; `@theme` block also overrides `--font-sans:61` | DONE |
| **`proof:demo-fonts`** | New gate: clause (a) no Plus Jakarta on body/dock/chrome; (b) Instrument Serif display survives; (c) no primary face in error | `scripts/proof-demo-fonts.mjs` exists (109 L); in `proof:correctness`; CI step `KF_REQUIRE_BROWSER: "1"` | DONE |

**Coverage:** 6/6 spec items delivered or correctly deferred per the wave's own M-2 guard. The bonus Plus-Jakarta font reclaim (a 3.9.0 consume-edge side effect) is also gated and present. No spec item was silently narrowed.

---

## 2. Quick-solution / workaround residue

No workaround residue found.

- The spec explicitly named and REJECTED the `::before{content:none}` consumer-side neutralizer; the diff adds no such rule. Zero `!important` in the font or specular paths.
- No `setTimeout`/`sleep`/`waitForTimeout` settle-sleeps in the new proof scripts except `waitForTimeout(900–1200)` for rAF stabilization after `goto` — identical pattern to every other proof script in the repo; principled.
- No `try/catch` error floors in the new gate scripts that swallow failures silently.
- No TODO/FIXME/HACK markers in any delivered file.

---

## 3. Legacy residue

### 3a. `design-idioms.css:265` — stale gate name in a comment

`demo/@/styles/design-idioms.css:265` reads:

```
   the inverted `proof:no-orphan-specular`, exception set → ∅.) */
```

The script `proof-no-orphan-specular` is DELETED; the current gate name is `proof:specular-absent-at-rest`. The comment is historically accurate (it describes the H closure path) but the gate name is stale. This is a comment in a CSS file — it does not affect runtime, the gate regime, or any CI step — but it refers to a deleted script by name, which is misleading to a future reader.

**Severity:** P2 (comment-only stale reference; does not affect execution).

### 3b. `proof-browser.mjs:44` — `proof:no-orphan-specular` in CANDIDATE_GATES

`scripts/proof-browser.mjs:44` still lists `"proof:no-orphan-specular"` in its `CANDIDATE_GATES` array. The script filters this list against `package.json` scripts (`:69-70`), so the retired gate is silently excluded at runtime and does NOT run. The list is a legacy roster of "browser-class" gates that predate the two-tier taxonomy. Not harmful, but the stale entry violates the no-legacy precept — a reader could mistake it for a surviving gate.

**Severity:** P2 (filtered at runtime; no execution impact).

### 3c. `proof-chronic-closure.mjs:48` — comment references retired gate names

`scripts/proof-chronic-closure.mjs:48` comments that the RETIRED-tag exclusion set includes `proof:no-orphan-specular` and `proof:specular-handoff`. This is a purposeful RETIRED-tag audit trail (the script uses these names to verify they are ABSENT from package.json, which is the correct behavior). Not a bug — it is the dual enforcement that a retired gate must be gone. No action needed; recording for completeness.

**Severity:** RECORD (intentional; the script uses it for absence verification).

---

## 4. Gate oracle quality (gate-ORACLE precept)

### 4a. `proof:specular-absent-at-rest`

**Oracle:** `getComputedStyle(el, "::before").opacity` at rest on every glass surface — the rendered pseudo-element alpha. PRIMARY oracle is perceptual (the painted bloom contribution), not a source-shape grep. Threshold `REST_OPACITY_MAX = 0.05`. Actuated by `page.mouse.move(2, 2)` to a neutral corner (rest, no hover). Covers 5 scenes × every `[data-surface='glass']`, `.glass-specular-track`, `.dock-icon-button`, `.glass-card`.

**Born-RED requirement:** script comment states "born-RED on the 3.5.1 tree (rest `::before` opacity 0.22 on dock tracks / 0.35 on stage cards)". Plausible and consistent with the I.W6 rootcause investigation — not re-verified here (requires a build against 3.5.1).

**Gate-ORACLE precept compliance:**
- PRIMARY oracle: YES — rendered `::before` alpha is the pixel/perceptual property the user perceives. Not a source-shape proxy.
- Actuates through the human surface: YES — serves built `dist/gh-pages/`, opens real browser contexts, moves pointer to rest.
- `KF_REQUIRE_BROWSER: "1"` in CI: YES — a playwright-absent skip is a hard fail in CI.
- Clause (b) substrate legibility: ABSENT from the script (spec says it is NON-BLOCKING, M-2; the wave is GREEN on clause (a) alone). Correct omission per the wave design.
- Clause (c) IOU deleted: verified statically (reads `package.json`, fails if `proof:specular-handoff` still present). Correct.

**Verdict:** Gate oracle is HONEST and aligns with the gate-ORACLE precept. The source-shape back-door (class-absence as an OR-escape) is explicitly closed in the script comment (`:25`). A future glass-ui that renames the track class or re-arms a nonzero rest intensity will RED on the alpha check.

**One residual concern (BOOK):** the gate's `[data-surface='glass']` selector catches stage cards, but the spec's claim of "23 glass surfaces" across 5 scenes is reported by the impl note — the gate does not assert a MINIMUM count of glass surfaces sampled. If glass-ui removes all glass tracks from the DOM (e.g., a future version uses a completely different surface mechanism), the gate would sample ZERO surfaces and emit `ZERO of 0 … OK`. A min-count guard (e.g., `totalGlass >= 5`) would make the gate non-vacuous against a future "glass surface disappears entirely" regression. Not a P0 (the current glass-ui emits glass tracks), but a known future soft spot.

### 4b. `proof:demo-fonts`

**Oracle:** `getComputedStyle(el).fontFamily` on body + dock/chrome selectors, filtered for `/Jakarta/i`. Born-RED on a tree inheriting Plus Jakarta default; GREEN once `--font-stack-text` is overridden. `document.fonts.ready` is awaited before sampling. Clause (c) filters out "Fallback" faces.

**CI Fallback-face exclusion (commit `166aa42`):** the `166aa42` fix excludes `"… Fallback"` metric-override faces from clause (c)'s error check. Rationale in commit message: the CLS-reduction fallbacks whose `src: local(<system font>)` aliases a host font absent on the font-less Linux CI VM report `error` — a host artifact, not a demo defect. The PRIMARY webfonts (Instrument Serif, Fira Code) load clean. Clauses (a) and (b) remain HARD. This exclusion is **principled**: it distinguishes host-environment font resolution (the `local()` alias fails on a CI VM without the system font) from a real webfont load failure. The primary-face check (`/Instrument|Fira/i && !/Fallback/i`) is still HARD. The Fallback exclusion is documented in the script at `:95-103`.

**Open concern (BOOK):** if a future build DROPS the Instrument Serif Fallback face definition entirely, clause (c) would still pass (the pattern would not match). Not critical since clauses (a)+(b) cover the functional identity; recording for completeness.

**Gate-ORACLE precept compliance:**
- PRIMARY oracle: YES — rendered computed `fontFamily` is a product-visible property.
- Clause (a) hard in CI: YES (`KF_REQUIRE_BROWSER: "1"`).
- Fallback exclusion: principled; documented.

---

## 5. Font override seam: consumer lever vs glass-ui patch

`demo/@/styles/style.css:113-117` sets four CSS variables at `:root`:
```css
--font-stack-text: …native sans…;
--font-stack-sans: var(--font-stack-text);
--font-text: var(--font-stack-text);
--font-sans: var(--font-stack-text);
```

The impl note (`I.W6.md:25-35`) and the inline comment (`style.css:105`) both cite `tokens.css:6` as the "documented glass-ui consumer lever." Setting `--font-stack-text` at `:root` is the documented opt-out path; the bridge overrides (`--font-text`, `--font-sans`) are added because glass-ui's `@theme inline` re-derives the bridges, and a `@theme`-level override of the bridge alone loses to glass-ui's inline theme. This is NOT a fork or a CSS neutralizer — it uses the upstream-documented entry point.

**Memory-rule check (glass-ui fixes go in glass-ui repo, never patched in demo):** the kf tree adds NO glass-ui-internal CSS, no forked component, no `!important` on a glass-ui-owned selector. The `:root` token override is the documented consumer pattern. The gestalt fix (scoping glass-ui's brand typography as opt-in) is filed as a coordination ASK to the AX session (`impl/I.W6.md:43-47`; `recap-prompts.md:151`). Memory rule held.

**Concern for J (P2/BOOK):** the `--font-stack-sans: var(--font-stack-text)` and `--font-text: var(--font-stack-text)` overrides at `:root` SUPPLEMENT the `--font-stack-text` root override. If glass-ui's `@theme inline` ever changes to derive the body register from a DIFFERENT token, the bridges at `:root` would need updating. More importantly, the `:root` override of the bridge tokens is NOT marked as transitional — there is no comment saying "remove this when glass-ui ships the typography opt-in flag." The coordination ASK is filed with AX, but it has no terminal J carry in the kf tree (no PROGRESS.md row, no J wave, no explicit KILL-if-AX-ships). This is a P-invariant-28 gap for the typography opt-in: the workaround lives in the tree with no terminal verdict.

---

## 6. S3 substrate depth — P-invariant-28 status

S3 was explicitly classified NON-BLOCKING (M-2 in the wave spec) and deferred in `impl/I.W6.md:36`. The spec states: "if clause (b) flags RED while clause (a) is GREEN, the wave is GREEN and S3 carries as a follow-up." The wave's green is correctly clause (a) only.

However, per P-invariant-28, every deferral needs a **terminal home** or a **KILL**. Checking I docs: `PROGRESS.md` mentions "give the page substrate real depth to refract" in the I.W6 row scope description (`:72`) but no dedicated chronic or J-row was authored for the substrate legibility item. `FINAL.md` does not explicitly assign it to J or KILL it. The `I-TOTALITY-ASSAY` and `recap-prompts` do not carry a row for it either.

This means S3 is a **perpetual punt without a terminal home**: deferred as non-blocking, never KILLed, and not assigned to a J wave. The precept ("NO perpetual punts — every deferral gets a terminal home or a KILL") requires J to either fold this into a wave or KILL it.

**Verdict:** P1 finding — J must assign S3 a terminal verdict (FOLD into a J wave with a legibility gate, or KILL with stated reason). The bloom-removal correctness is closed; this is about the glass reading as glass vs. reading as a near-white plate.

---

## 7. Booked items — typography opt-in ASK tracking

The coordination ask to the AX session ("scope glass-ui's brand typography as opt-in") is recorded in `impl/I.W6.md:43-47` and `recap-prompts.md:151` as "filed as a NEW glass-ui-HANDOFF." However:

- There is NO `proof:*` gate that detects when glass-ui ships the opt-in flag and prompts removal of the kf workaround.
- There is NO entry in `PROGRESS.md` or any J planning doc for this follow-up.
- The workaround in `style.css:113-117` is not marked `/* TRANSITIONAL: remove when glass-ui ships typography opt-in */`.

If glass-ui 3.10+ ships the opt-in flag (decoupling `--font-stack-sans` from `--font-stack-text`), the kf tree's four-token override may become partially redundant or need updating. Per P-invariant-28, this coordination ask needs a terminal home in J (FOLD, BOOK with gate-first, or OUT to AX as a glass-ui milestone). Currently it is an untracked perpetual punt.

**Verdict:** P2 — J should BOOK this with a MEASURE-FIRST disposition and either author a canary gate or accept the workaround as permanent (RECORD).

---

## 8. Gestalt seam assessment

The specular fix lands at the RIGHT seam: the root cause is a glass-ui emission default, and the fix is a published-default consume-edge with zero kf fork. The wave spec's explicit rejection of the `::before{content:none}` workaround and the two-sided approach are correct architectural choices.

The font fix also lands at the documented consumer lever. It is a BIGGER surface (4 CSS variables overriding token/bridge layers) than the single-token approach might suggest, but this is justified by the `@theme inline` complication documented in the comment. No simpler clean option exists unless glass-ui ships the opt-in flag.

The S3 substrate depth deferral is CORRECT — do not let aesthetic completeness gate a correctness fix.

---

## 9. Findings table

| ID | Severity | Title | Evidence | Disposition |
|---|---|---|---|---|
| W6-1 | P2 | `design-idioms.css:265` references deleted gate name `proof:no-orphan-specular` | `demo/@/styles/design-idioms.css:265` | FOLD — update comment to reference `proof:specular-absent-at-rest` |
| W6-2 | P2 | `proof-browser.mjs:44` lists `proof:no-orphan-specular` in CANDIDATE_GATES (filtered at runtime but stale) | `scripts/proof-browser.mjs:44` | FOLD — prune the retired gate from the candidate list |
| W6-3 | P1 | S3 substrate depth has no terminal verdict (deferred non-blocking, not KILLed, not assigned to J) | `impl/I.W6.md:36` deferred; no PROGRESS.md row; no J wave | FOLD — assign a terminal verdict: FOLD into a J wave (legibility gate) or KILL |
| W6-4 | P2 | Typography opt-in ASK (glass-ui brand font scoping) has no kf-side tracking or terminal home | `recap-prompts.md:151`; no PROGRESS.md row; no J gate | BOOK — MEASURE-FIRST; accept the workaround as RECORD-permanent or author a canary gate |
| W6-5 | BOOK | `proof:specular-absent-at-rest` samples but does not assert a minimum glass-surface count; vacuous-pass risk if glass tracks disappear from DOM | `scripts/proof-specular-absent-at-rest.mjs:124-134` | BOOK — add `totalGlass >= 5` floor guard when the gate is next touched |
| W6-6 | RECORD | `proof-chronic-closure.mjs:48` references `proof:no-orphan-specular` in RETIRED-tag comment | `scripts/proof-chronic-closure.mjs:48` | RECORD — intentional; the comment lists the retired gates the RETIRED-dual enforcement excludes; no action needed |
