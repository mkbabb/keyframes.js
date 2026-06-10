# Tranche J audit — inv-ε re-check of Tranche I's FINAL.md vs the TREE

**Lane:** `final-vs-tree` · **Date:** 2026-06-09 · **Baseline:** `master` @ `4072af9` (clean tree; only untracked `docs/tranches/J/`).
**Method:** read `docs/tranches/I/FINAL.md` in full; extract every factual claim; verify each against the git history, `package.json`, `scripts/`, `src/`, `demo/`, `.changeset/`, `.github/workflows/`. Read-only. No build, no install, no re-run of gates.

**Verdict in one line:** FINAL.md is, on its own terms, **largely honest and unusually well-grounded** — every fix `file:line`, every gate script, every chronic-ledger gate, the version/changeset facts, the ARCH kills, and the consume-edge pins verify against the tree. **BUT** its load-bearing **deploy causal model is false** (§1 + §8 + recap DEP-1 assert an auto-deploy on green CI that physically could not happen — CI had been YAML-invalid since H, a fact the repo's own later commit `4072af9` admits), and its headline correctness claim (§9: "`proof:live-session` GREEN means a human sees it work") has **named, structural blind axes** (no mobile viewport, no touch, no reduced-motion, no dark-mode, no keyboard/focus, single-scene SWITCH) — the exact I-lesson shape. The WZ ledger also records that **8 latent gate issues surfaced ONLY under full `proof:all`, not under the headline** — so live-session is not the terminal authority FINAL §9 claims it is.

---

## A. CLAIM CLASSES THAT VERIFY (no overclaim) — the honest core

| FINAL claim | Probe | Result |
|---|---|---|
| §Ledger: 9 wave commits + re-pin exist | `git log --oneline -1 <hash>` for `107236d 8a40cf4 e2085c8 b8659fe 3afd49f bea5f27 4103c22 1a708cf e473447` | ALL exist; messages match the wave labels. ✓ |
| §1: `b934a08` is the H defect tree | `git log -1 b934a08` | `chore(tranche-H WZ): the close …` ✓ |
| §2 B1/B5 fix: serialize from DECLARED template, `format.ts:145-165` | `src/animation/format.ts:145-166` | `templateFrames.forEach(...)` reads `animation.parsedVars[i]` (the parsed-but-unresolved var map), never `at(progress)`. Comment I.W0 S2 present. ✓ EXACT |
| §2 B1: no-op transform at the FIELD, `group.ts:55`; inherit `:142-143` | `src/animation/group.ts:55`, `:142-143` | `transform: TransformFunction<V> = NOOP_TRANSFORM;` at :55; `if (this.transform === NOOP_TRANSFORM && animation.frames[0] != null) this.transform = animation.frames[0].transform;` at :142-143. ✓ EXACT |
| §3: `proof:correctness` = exactly 10 actuating gates | `package.json:147` | 10 gates, exactly the named set incl. `proof:live-session`. ✓ |
| §3: all 10 + 2 meta gate scripts exist & parse | `ls scripts/` + `node --check` ×12 | All 12 `.mjs` exist (118–973 L), all `node --check` OK. ✓ |
| §3: 5 H proxy gates RETIRED + `proof:specular-handoff` DELETED | grep package.json + `ls scripts/` | `demo-console-clean`, `dock-morph-settled`, `no-orphan-specular`, `scene-icons`, `dragscrub-single`, `specular-handoff` — ALL absent from package.json AND their `.mjs` files deleted. Remaining grep hits are comments only. ✓ |
| §3: `proof:gate-is-runtime` machine-enforces per-wave §Hard gate | `scripts/proof-gate-is-runtime.mjs:84-93,239-251` | `WAVE_HARD_GATES` enumerates I.W0–I.W7 → the 9 actuating gates; `EXPECTED_WAVES` coverage check reds a missing wave; records itself HYGIENE-tier. ✓ |
| §4-A: engine-no-throw has clause [a] (rainbow play) + [hygiene f] (value.js empty-input contract) + the `"......"` fingerprint regex | `scripts/proof-engine-no-throw-on-play.mjs:61-77,103-106,196-212` | `PARSE_LINE = /Parse error at offset\|"\.{4,}"\|…/`; clause (a) clicks rainbow play; [hygiene f] asserts `parseCSSValueUnit("")` does not throw. ✓ |
| §4-A: value.js pin `^0.11.2`; lock resolves `0.11.2` from registry | `package.json:170` + lockfile | `"@mkbabb/value.js": "^0.11.2"`; lock `0.11.2` from `registry.npmjs.org` (sha512-Xh8qNi2…). ✓ |
| §4-B: amiga sheds `content-visibility` over WebGL (cvAnc=null) | grep `demo/app/scenes/AmigaScene.vue` | Only references are comments at :214,:261,:265 documenting its ABSENCE ("the scene root carries NO content-visibility: auto"). ✓ |
| §4-B: amiga gate splits steady-state vs declared-readback | `scripts/proof-amiga-subject-is-pivot.mjs:41-43,113-171` | clause (c) greps for `GPU stall\|content-visibility`; canvasRegionMAD centre-vs-periphery split present. ✓ |
| §5 CH-1..CH-10 cite runtime gates; substrate exists | `docs/tranches/I/PROGRESS.md:149` "## Open deferrals" + `scripts/proof-chronic-closure.mjs:64,128-238` | The §"Open deferrals" table lists CH-1..CH-10 with EXACTLY the gates FINAL §5 names; the gate parses that table, requires a non-retired `proof:*` gate, requires a born-RED witness in prose, reds on source-shape/retired names. Self-declared HYGIENE-tier. ✓ |
| §5 CH-10 / icon-paint asserts exact `document.title === "keyframes.js"` | `scripts/proof-icon-paint-live.mjs:31,84,119-128` + `demo/app/index.html:14` | Gate clause (c) asserts title; source index.html carries `<title>keyframes.js</title>`. ✓ |
| §7: glass-ui pin `~3.9.0`; lock resolves `3.9.0` from registry | `package.json:173` + lockfile | `~3.9.0`; lock `3.9.0` from registry. ✓ |
| §7: font reclaim via `--font-stack-text` at `:root`; gate asserts NO Plus Jakarta | `demo/@/styles/style.css:113` + `scripts/proof-demo-fonts.mjs:14` | `:root { --font-stack-text: ui-sans-serif, system-ui, … }`; gate clause (a) asserts no "Plus Jakarta" on body/dock/chrome. ✓ |
| §7: specular gate reads RENDERED `::before` alpha ≤0.05 at rest | `scripts/proof-specular-absent-at-rest.mjs:3-18` | Inverts the old `proof:no-orphan-specular`; reads `getComputedStyle(el,'::before').opacity` at rest, ZERO kf CSS / no `!important`. ✓ |
| §8: changeset `tranche-h.md` PENDING; version still 4.1.0 | `.changeset/tranche-h.md` + `package.json:3` | Both present; version `4.1.0` (unconsumed). ✓ |
| §8: deploy-pages.yml is CF Pages on `workflow_run` success on master | `.github/workflows/deploy-pages.yml:22-46` | `on: workflow_run`; `if: conclusion=='success' && head_branch=='master' && event=='push'`; wrangler CF Pages. ✓ (existence — but see P0-1 for the causal-model lie) |
| §6: ARCH kills are ABSENT in the tree (`dev.sh`/`deploy.sh`) | `ls scripts/dev.sh deploy.sh …` | No such files. ✓ |
| §9 / recap: "no request dropped" | `docs/tranches/I/recap-prompts.md` grep | Every row ADDRESSED/GATED/HANDOFF/USER-DOMAIN/HELD; no DROPPED status. ✓ (but DEP-1 is materially wrong — P0-1) |

This is a genuinely strong inv-ε posture. The findings below are where it nonetheless overclaims or leaves an un-exercised axis.

---

## B. FINDINGS

### P0-1 — FINAL's deploy causal model is FALSE: "green-CI auto-deploys" never could fire (CI was YAML-invalid since H)
**FINAL §1:** *"keyframes.babb.dev … deploys on every green-CI master push, so H's `b934a08` close put the broken product live."*
**FINAL §8:** *"The honest close is to merge `tranche-i-dev → master → green CI → CF auto-deploys the FIX."*
**recap DEP-1 (recap-prompts.md:181):** ADDRESSED — *"deploy-pages.yml auto-deploys on every green-CI master push."*

The repo's OWN later commit falsifies this. `git show 4072af9` (the WZ commit, post-FINAL) + `docs/tranches/I/impl/I-WZ-verify.md:316-325`:
> *"`.github/workflows/ci.yml` had been **YAML-INVALID since H.W12** … GitHub Actions rejects at PARSE time … So **CI never executed — and `deploy-pages.yml` (gated on the `ci` workflow's SUCCESS) never fired — on any master push since 06-07.** … `keyframes.babb.dev` was frozen at the pre-H build for days."*

Consequences for FINAL's claims:
1. §1's "the mechanism that certified it green also auto-shipped it" is **not what happened** — `b934a08` was almost certainly NOT auto-deployed (CI couldn't run to green); the broken H product on the live site was a *frozen-pre-H* artifact, not an auto-shipped H tip. The "auto-ship the breakage" narrative is rhetorically central to §1 and is false.
2. §8's prescription ("merge → green CI → CF auto-deploys the FIX") **did not execute as described**: per WZ-verify.md:310-314 the deploy was a **MANUAL** `wrangler pages deploy dist/gh-pages` — not an auto-deploy. The auto-deploy path was still gated behind the *still-open* `proof:scene-control-dfa` Linux flake (WZ-verify.md:343-348).

This is the deepest inv-ε violation in the close: FINAL asserts a re-runnable causal chain (green-CI ⇒ deploy) that the tree shows was inert, and it is the one claim that would have been caught by actually trying the deploy — which is exactly what happened AFTER the FINAL was written. The FINAL was overclaiming a deploy mechanism it never validated.
**Severity: P0. Disposition: BOOK** (historical — FINAL is frozen; J must NOT re-assert the auto-deploy model until `proof:scene-control-dfa` is fixed and a green CI run + auto-deploy is observed end-to-end). The terminal home is the J CI/deploy lane.
**Evidence:** `git show 4072af9`; `docs/tranches/I/impl/I-WZ-verify.md:316-325,343-348`; FINAL.md:42-44,240-242; recap-prompts.md:181.

---

### P0-2 — §9 "live-session GREEN means a human sees it work" has UN-EXERCISED AXES (the I-lesson recurs)
FINAL §9: *"The terminal authority for this tranche's correctness is `proof:live-session` GREEN … a human using the product sees it work."* §3: *"`proof:live-session` GREEN means a human using the product sees it work."*

`scripts/proof-live-session.mjs` is hardcoded to a SINGLE desktop register and exercises ZERO of the following axes. Each is an un-exercised axis — the I-doctrine's "where the next lie lives":

| Axis | Evidence it is NOT exercised | Why it matters |
|---|---|---|
| **Mobile viewport** | `const VW = 1440` (`:420`); every `newContext` uses `{ width: VW, height: 900 }` (`:438,473,542,642,648,656,722,785,871`). No 390/430-wide pass. | The demo has a whole mobile overlay (`StageMode`, mobile sheet, `proof:mobile-single-page`) that the headline never opens. CH-3 (mobile) "closed" via `perf-frame-budget`+`drag-gesture` — but those run at 1440 too. The felt mobile layout is uncovered by the gate-of-gates. |
| **Touch events** | grep `isMobile\|hasTouch` in live-session = **0**. All gestures are `page.mouse` / trusted pointer. | The dock + drag + bezier are pointer-only in the gate. A touch-only regression (e.g. `touch-action`, pointer-cancel) is invisible. |
| **Reduced motion** | grep `reducedMotion\|emulateMedia` = **0**. | The engine has a whole `respectReducedMotion` snap path (`group.ts:64-68`, `withReducedMotion`). The headline never sets `prefers-reduced-motion: reduce`, so the reduced-motion product surface is ungated at the live tier. |
| **Dark mode** | grep `colorScheme\|\.dark\|prefers-color` in live-session = **0**. Dark is tested only by HYGIENE-tier `proof:darkmode-row-toggle`. | A dark-mode-only visual/contrast break (the demo ships `.dark` theme vars) never reaches the human-oracle tier. |
| **Keyboard / focus nav** | The only `keyboard.press` calls are `ArrowDown`/`Enter` as a *fallback* for the dock Select commit (`:352-353`); zero `:focus`/Tab-traversal/`focus-visible` assertions in ANY correctness gate (`grep ':focus\|tabindex'` = 0). | a11y/keyboard operability is entirely outside the correctness tier. |
| **Scene SWITCH breadth** | `dockSwitch` switches to ONE "first non-Home, non-active option" (`:333-340`). The icon-paint leg sweeps a hardcoded `SCENES = ["cube","easing","spring","sequence","motion-path"]` (`:711`). | Of the 8 scenes in `demo/app/scenes.ts` (home, cube, amiga, square, easing, spring, sequence, motion-path), `amiga` + `square` are covered by dedicated B3/B6 legs, but the SWITCH-into / play-in of `sequence`/`motion-path`/`spring` is icon-paint-only (glyph paints), not a play+interact session. No full N×N switch matrix. |

§9's sentence is an OVERCLAIM as written: live-session GREEN means *a desktop human at 1440px with a mouse, no reduced-motion, light theme, switching to one scene* sees it work. The standing I-precept ("error budget 0 across PLAY+SWITCH+DRAG") is honored — but the precept itself is silent on viewport/input/media axes, so the gate inherits the blind spot.
**Severity: P0** (the precept's own anti-blindspot logic demands these axes be named; FINAL asserts the strong form). **Disposition: FOLD** — J should add a mobile/touch leg and a reduced-motion + dark-mode pass to `proof:live-session` (or a sibling `proof:live-session-mobile`), and a focus/keyboard a11y correctness gate. This is the natural J runtime-coverage wave.
**Evidence:** `scripts/proof-live-session.mjs:420,438,711,333-353`; `grep -c 'isMobile|reducedMotion|colorScheme'` = 0; `demo/app/scenes.ts:92-163`; FINAL.md:98,263.

---

### P1-1 — §9 names `proof:live-session` "terminal authority", but the WZ ledger shows 8 latent issues surfaced only under FULL `proof:all`, not under the headline
FINAL §9: *"The terminal authority for this tranche's correctness is `proof:live-session` GREEN."* §3: the headline "assembles from each wave's interaction leg."

`docs/tranches/I/impl/I-WZ-verify.md:276-300` records that running the FULL `proof:all` (correctness + hygiene) before deploy *"surfaced **8 latent issues** the per-wave verification had missed."* These included a REAL regression (`proof:bezier-no-scroll` 3px scrollbar, #8) and a gate that read a deprecated store field (#5). If `proof:live-session` were truly the terminal authority, these would have been caught by it — they were not; they needed the hygiene tier + the other 9 correctness gates. So §9's "terminal authority = live-session GREEN" overstates: the operative terminal authority is **`proof:all` GREEN**, of which live-session is the *headline*, not the *sole* arbiter. This is a soft overclaim (the close did not ship broken — `proof:all` caught them), but the FINAL's framing inflates one gate into the whole.
**Severity: P1. Disposition: RECORD** (J should treat `proof:all` GREEN — not live-session alone — as the deploy gate, and keep WZ-verify.md:285's named process gap "run the whole suite each wave" as a live discipline).
**Evidence:** `docs/tranches/I/impl/I-WZ-verify.md:276-300`; FINAL.md:263.

---

### P1-2 — §8 is silent on the `tranche-i.md` changeset that exists in the tree (only `tranche-h.md` is mentioned)
FINAL §8: *"A tranche-h patch changeset is still PENDING/unconsumed in `.changeset/tranche-h.md`."* — that is true and verified. But `.changeset/` ALSO contains `tranche-i.md` (`patch`, dated Jun 9), which FINAL never mentions. The I changeset itself flags an unresolved SemVer question FINAL elides: *"The dependency floor move is the reason a maintainer may elect to ship this as a `minor` instead of a `patch`."* FINAL §8 frames the version question only around the H changeset, leaving the I changeset (and the patch-vs-minor decision the value.js floor move raises) undocumented in the FINAL. Not a falsehood, but an incomplete §8 ledger — the version state is two changesets, not one.
**Severity: P1. Disposition: FOLD** — J's close must reconcile BOTH pending changesets and resolve the patch-vs-minor tier (a real open USER-DOMAIN decision, not a punt). P-invariant-28: this deferral needs a terminal home in J.
**Evidence:** `.changeset/tranche-h.md`, `.changeset/tranche-i.md`; FINAL.md:234.

---

### P1-3 — `proof:chronic-closure` is STILL a markdown-table parser (by design, self-declared HYGIENE) — verify it has not regressed into the original sin
FINAL §5 frames chronic-closure as "REWIRED" so closure cites a runtime gate that bit. Verified: `scripts/proof-chronic-closure.mjs:14,51,64` parses `docs/tranches/I/PROGRESS.md` "## Open deferrals" and asserts each row's closure cell names a non-retired, runtime `proof:*` gate + a born-RED witness, and reds source-shape/retired names. This is **honest** — the script self-declares HYGIENE-tier (":51 NO browser, no build … it is itself HYGIENE-tier") and FINAL §3 says hygiene "may never count toward a chronic-closure tally." So it does NOT overclaim. BUT: the durability keystone is still a *paperwork auditor of paperwork* — its oracle is that the markdown cites the right gate NAME, not that the gate currently BITES. A J risk: if a chronic's cited gate is later weakened (e.g. CH-3/CH-4 ride `proof:perf-frame-budget`, which WZ-verify.md:333-335 demoted to CI-observe-only on Linux), the chronic-closure gate would still pass green on the stale citation. The closure is only as live as the cited gate's current actuation.
**Severity: P1. Disposition: BOOK** (measure-first) — J should add a clause that the cited gate is in the *correctness* tier AND not CI-demoted, so a chronic cannot rest on an observe-only gate.
**Evidence:** `scripts/proof-chronic-closure.mjs:14,51,64,238`; `docs/tranches/I/impl/I-WZ-verify.md:333-335`.

---

### P1-4 — CH-3 / CH-4 close on `proof:perf-frame-budget`, which the WZ ledger DEMOTED to CI-observe-only (the gate that "bit" no longer hard-gates in CI)
FINAL §5: CH-3 (mobile) and CH-4 (dock) both close via `proof:perf-frame-budget` (+ `proof:drag-gesture` for CH-3). FINAL §5 asserts these are RUNTIME gates witnessed born-RED HEAD 12/114. But `I-WZ-verify.md:333-335` (post-FINAL) records: *"`proof:perf-frame-budget` … the THROTTLED/felt-timing budget is a HOST artifact on a slow VM → CI observe-only, local/on-device hard-gate."* So the gate that closes two chronics is, in CI, **observe-only** — it does not red CI. The chronic is closed by a gate that hard-gates only on the dev machine. FINAL §5 does not disclose this (it was decided in WZ, after FINAL). The chronics are not *falsely* closed (the local gate is real and bit), but their CI durability is weaker than FINAL implies. This compounds P1-3.
**Severity: P1. Disposition: FOLD** — J must give the felt-perf budget a robust on-device + CI posture so CH-3/CH-4 durability is not "green locally, blind in CI."
**Evidence:** FINAL.md:166-167; `docs/tranches/I/impl/I-WZ-verify.md:333-335`.

---

### P2-1 — §8 staleness facts are now historically stale (true at DEV, not at audit baseline)
FINAL §8: *"`master` is **10 commits BEHIND** `tranche-i-dev` … the LIVE demo is still the BROKEN H tip (`b934a08`)."* At the audit baseline, `git rev-list --count master..tranche-i-dev` = **0** (merged at `a4b1472`), and `keyframes.babb.dev` is on the fixed build (`4072af9`, WZ). FINAL §8 is an explicitly-DEV-phase artifact ("`PROGRESS.md` is the frozen DEV-phase board") and §8 itself flags the supersession, so this is not a lie — but a J reader taking §8 at face value would draw a false current picture. The FINAL correctly labels itself but does not carry a "superseded by WZ" pointer (WZ-verify.md was committed after FINAL.md and FINAL never back-references it).
**Severity: P2. Disposition: RECORD** — the authoritative current deploy state is `I-WZ-verify.md`, not FINAL §8. J docs should cross-link them.
**Evidence:** `git rev-list --count master..tranche-i-dev` = 0; `a4b1472`, `4072af9`; FINAL.md:240,246-252.

---

### P2-2 — value.js sibling commits `0cb5dd2`/`fbea3e2` are unverifiable from this repo (correctly, but worth a J probe)
FINAL §4-A + ledger cite value.js commits `0cb5dd2` (release 0.11.2) and `fbea3e2` (the empty-input fix). These are NOT in the kf repo (`git log -1 <hash>` = not found — they live at `/Users/mkbabb/Programming/value.js`). The kf-side proxy IS verifiable: lockfile resolves `0.11.2` from `registry.npmjs.org` with a concrete sha512, and `I-WZ-verify.md:85-98` records the falsification experiment (pristine 0.11.1 throws `"......"`; 0.11.2 returns `0`). So the LOAD-BEARING claim is grounded by the registry + the falsification, not by the sibling hashes. The sibling hashes are unverifiable-by-construction (a different repo) — acceptable, but a J close that asserts them should re-confirm against the value.js repo or `npm view`.
**Severity: P2. Disposition: VERIFY-ONLY** — J re-runs `npm view @mkbabb/value.js@0.11.2` / checks the value.js repo if it needs the hashes; the kf-side floor is already grounded.
**Evidence:** `git log -1 0cb5dd2` = not in repo; lockfile sha512-Xh8qNi2…; `I-WZ-verify.md:22,85-98`.

---

## C. NET INV-ε JUDGEMENT

The I FINAL holds itself to inv-ε **well within the document's own scope**: fixes, gates, chronic citations, ARCH kills, consume-edge pins, and the changeset/version facts all verify against the tree with `file:line` precision, and §9 is honest that the arbiter is the live demo. Its two real failures are (1) a **false deploy causal model** (P0-1) that the repo's own later commit (`4072af9`/WZ) contradicts — the one mechanism FINAL did NOT validate before asserting — and (2) the **un-exercised axes** behind the strong §9 sentence (P0-2), which is precisely the failure shape Tranche I was founded to kill, now recurring one level up (the gate-of-gates is desktop-light-mouse-only). The P1 band is mostly "FINAL frames one gate / one changeset as the whole" plus the post-FINAL CI-demotion that weakens two chronics' durability. None of the verified-CLOSED items are *false-closed in the source* — the product fixes are real and the gates exist and parse. The lie risk for J is entirely in the **deploy + coverage-breadth** seams, not the engine seams.

**For J:** treat `proof:all` GREEN over a CI that actually parses + runs as the deploy gate (P0-1, P1-1); broaden the headline to mobile/touch/reduced-motion/dark/keyboard (P0-2); reconcile both changesets + the patch-vs-minor tier (P1-2); harden the felt-perf chronics' CI posture (P1-3, P1-4).
