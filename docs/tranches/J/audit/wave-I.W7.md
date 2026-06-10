# Tranche J audit — LANE: wave I.W7 (THE GATE-REGIME OVERHAUL)

**Scope.** The headline wave of Tranche I: `proof:live-session` (the gate-of-gates), the two runtime
meta-gates (`proof:gate-is-runtime`, `proof:chronic-closure` rewired), the two-tier
`proof:correctness`/`proof:hygiene` taxonomy, and the retirement of the 5 H proxy gates. Delivered at
`1a708cf`; amended once post-close by `11c4c25` (dockSwitch trusted click). Read-only, verified against
`master` tip `4072af9`, clean tree.

**Headline verdict.** The wave LANDED its full spec at the right structural seam — one driven session,
two honest meta-gates, the proxy lattice retired with no dangling script files, the two-tier taxonomy
wired and CI-enforced. The retirements are clean (all 6 retired scripts gone; chronic-closure enforces
the dual ABSENT). The amendments folded in (`1a708cf`'s B3 split, `11c4c25`'s trusted click) are HONEST
hardenings (the gate now drives like a human), not weakenings. BUT the deepest layer carries five real
residues the wave's own precept condemns: **(W7-1, P0)** the keystone B2 deterministic dev-server leg
SILENTLY skips under `KF_REQUIRE_BROWSER=1` if vite fails to start — a vacuous-pass hole in the exact
clause that exists to close the H.W1 false-close; **(W7-2, P1)** the named-benign exclusion is applied
GLOBALLY (all legs) not leg-scoped per S2a, and `/source ?map/i` is broad enough to swallow a real dist
error — an attenuated re-introduction of the `demo-console-clean` narrowed-regex sin; **(W7-3, P1)**
`proof:demo-fonts` is a load-rest oracle (zero actuation) seated in the correctness tier yet EXEMPTED
from the meta-gate roster, so the regime contains a non-actuating correctness gate the meta-gate would
fail if it audited it; **(W7-4, P2)** the two meta-gates detect "actuation" by SOURCE-TEXT regex over
gate scripts (self-acknowledged hygiene-tier, but a dead/no-op actuation primitive passes them);
**(W7-5, P2)** `proof-browser.mjs` CANDIDATE_GATES still lists 3 retired gate names (silently filtered,
legacy residue).

---

## §1 — Plan-vs-delivery: full-spec coverage (no silent narrowing)

| Spec item | Delivered? | Evidence |
|---|---|---|
| **S1** two-tier taxonomy (correctness/hygiene), construction-rule on NEW gates | YES | `package.json:147-149` — `proof:correctness` (10) + `proof:hygiene` (~90) + `proof:all = correctness && hygiene` |
| **S2** `proof:live-session` — ONE driven session, PLAY+SWITCH+DRAG, error budget 0 + product DOM | YES | `scripts/proof-live-session.mjs` (974 L) — MODE-FRESH per-scene legs B1/B4/B6/B3/B7/B9/font + MODE-PERSIST B2 matrix |
| **S2a** error budget defined ONCE as structured allowlist, COMPLEMENT of named-benign | PARTIAL | `proof-live-session.mjs:78-209` — structured; but see W7-2 (exclusion not leg-scoped per spec) |
| **S2b** B2 synthetic-visibility born-RED-of-record + `:5174` deterministic dev exception | PARTIAL | `:377-401,784-822` dist leg; `:824-894` dev leg — but see W7-1 (dev leg silently skips) |
| **S3** four structural rules (drive/live-object/known-good-baseline/chronic-meta) | YES (rules embodied in the gates) | live-session drives; visual-lock re-tiered hygiene (`ci.yml:287`) |
| **S4** `proof:chronic-closure` rewired to runtime-gate-that-BIT + 2 HANDOFF rules | YES | `scripts/proof-chronic-closure.mjs` (324 L) — resolve+correctness-tier+RUNTIME+born-RED; vaporware/right-axis rules `:201-219` |
| **S5** retire 5 H proxies, re-tier 54 source-shape/jsdom to hygiene, DELETE `no-route-storm` | YES | 6 scripts gone (incl. `specular-handoff`); see §2 |
| **S6** install `proof:gate-is-runtime` meta-gate, machine-enforce the precept | YES | `scripts/proof-gate-is-runtime.mjs` (293 L) — audits 9 §Hard gates' harness+actuation+tier |
| WIRE into `package.json` + `ci.yml` under `KF_REQUIRE_BROWSER=1` | YES | `ci.yml:174-186` (meta-gates, library job), `:239-279` (correctness tier, demo-smoke) |

**No silent scope-drop at the spec level** — every S-item has a corresponding artifact. The narrowing is
at the IMPLEMENTATION layer (W7-1/W7-2), not the spec layer.

---

## §2 — The retirements (clean) + the residues (W7-5)

**Retired scripts — all GONE** (`ls scripts/`): `proof-demo-console-clean.mjs`,
`proof-dock-morph-settled.mjs`, `proof-no-orphan-specular.mjs`, `proof-scene-icons.mjs`,
`proof-dragscrub-single.mjs`, `proof-specular-handoff.mjs` — each `gone`. `proof:chronic-closure`
enforces the dual: a RETIRED-tagged name that still resolves in `package.json` or `proof:all` REDS
(`proof-chronic-closure.mjs:231-233`). `no-route-storm` is absent from `package.json` (the dangling H
reference is killed).

**W7-5 (P1) — `proof-browser.mjs` CANDIDATE_GATES carries 3 retired names.**
`scripts/proof-browser.mjs:32,44,55` still list `proof:demo-console-clean`, `proof:no-orphan-specular`,
`proof:scene-icons`. They are silently filtered by `g in pkgScripts` (`:70`), so no hard error — but
this is LEGACY residue the census-cleanup wave (S5) should have pruned. `proof:browser` is a dev-loop
META target (excluded from `proof:ci-coverage`), so it never runs in CI; the stale list is dead code,
not a functional bug. Per NO-legacy precept, J should prune. (Stale `no-route-storm` text also survives
as console-log labels in `proof-scene-machine-irrefragable.mjs:551,557` and docstring cross-refs in
~8 scripts — narrative only, not gate references; RECORD.)

---

## §3 — W7-1 (P0): the keystone B2 deterministic dev leg SILENTLY skips under KF_REQUIRE_BROWSER

The B2 clause is the keystone of the whole wave — B2 is the H.W1 false-close (the proxy-store
`scene-machine-irrefragable` round-trip that never fired visibilitychange). S2b makes the SYNTHETIC
`visibilitychange→hidden` the born-RED-of-record, and explicitly names the `:5174` dev server as the
DETERMINISTIC witness because **the `_gen` throw is INTERMITTENT on dist** (S2b.2, `I.W7.md:233-239`).

The dist B2 leg's verdict is `pass: genAfter === genBefore` (`proof-live-session.mjs:818`) — "no NEW
_gen throw across suspend+switch." Per the spec's own admission the dist throw is intermittent, so a
passing dist leg is consistent with BOTH "the bind-proof fix holds" AND "the intermittent throw simply
did not fire this run." Only the deterministic `:5174` leg discriminates.

That deterministic leg (`runDevServerB2`, `:850-894`) spawns `npx vite --port 5174 --strictPort` and
polls 60s. **On vite-startup failure it `note()`-skips and returns — it does NOT call `skipOrFail`/`fail`
even under `KF_REQUIRE_BROWSER=1`:**

```
proof-live-session.mjs:864-868
  if (!up) {
      note(`B2 dev-server leg: vite did not come up on :${PORT} within 60s — skipped.`);
      child.kill("SIGTERM");
      return;
  }
```

`note()` does NOT push to `failures` (contrast `:214-216` `skipOrFail`, which fails hard under
`KF_REQUIRE_BROWSER`). CI sets `KF_DEV_SERVER: "1"` (`ci.yml:279`) so the leg IS invoked — but a `npx
vite` spawn failure (port conflict, slow runner, dep hiccup — the EXACT conditions that killed
`scene-control-dfa` per the WZ-postclose lane) silently drops the only deterministic B2 witness, and
the gate still passes on the intermittent dist leg. This is a vacuous-pass path in the keystone clause:
the very blindspot class the wave was built to close, turned inward. **Disposition: FOLD** — under
`KF_REQUIRE_BROWSER=1` the dev leg must `fail` (not `note`) on vite-failure, OR the IMPL must make the
dist repro deterministic (the spec already licenses this: `I.W7.md:259` "the IMPL may fold B2 onto the
dist harness IF it makes the dist repro deterministic"). The honest born-RED witness must not be droppable.

---

## §4 — W7-2 (P1): the named-benign exclusion is GLOBAL, not leg-scoped per S2a

S2a (`I.W7.md:210`) is explicit: the dev DevTools dep-optimizer source-map noise is excluded **"by the
one dev-server leg (S2b's B2 suspend, which runs on `:5174` where this noise DOES appear)… the dist legs
never emit it, so the exclusion is inert there."** The exclusion is supposed to be LEG-SCOPED to the dev
server.

The impl applies `isNamedBenign(text)` UNCONDITIONALLY at the TOP of `chargeBudget`, before any leg
discrimination (`proof-live-session.mjs:142`), and again on `requestfailed` (`:199`). So the named-benign
set suppresses matching lines on EVERY leg, including all dist legs. The set includes broad patterns:
`/source ?map/i`, `/dep-?optimiz/i`, `/Failed to load (?:resource).*\.map\b/i`, `/\[vite\]
(connecting|connected)/i`, `/Download the (React|Vue) DevTools/i` (`:121-129`).

`/source ?map/i` is broad enough that ANY console line containing "source map"/"sourcemap" — including a
genuine product error whose message mentions it, or a real `.map` asset 404 on the dist — is silently
dropped from the budget on the dist legs. This is an attenuated re-introduction of the
`demo-console-clean` narrowed-regex sin (the wave's stated antithesis: "the COMPLEMENT of the named
EXCLUDED set, NO regex-narrowing escape hatch," `:80-86`). The spec's defense ("inert on dist because
dist never emits it") holds only if dist genuinely never emits any `source map`-containing line — an
assumption that the global application does not enforce and a future dist regression could violate
unobserved. **Disposition: FOLD** — leg-scope the dep-optimizer/source-map exclusions to the
`KF_DEV_SERVER` leg only (pass the leg label into the benign check, or gate by `USE_DEV_SERVER`), and
tighten `/source ?map/i` to the specific dep-optimizer fingerprint. Keep the Monaco content-visibility
exclusion (it is already correctly scoped by `monaco` in the regex, `:128`).

---

## §5 — W7-3 (P1): a non-actuating gate sits in the correctness tier, EXEMPTED from the meta-gate

`proof:correctness` has exactly 10 members (`node` parse); member #9 is `proof:demo-fonts`
(`package.json:147`). `proof-demo-fonts.mjs` is a LOAD-REST oracle: `goto(#/cube)` → `waitForTimeout`
→ `document.fonts.ready` → `getComputedStyle().fontFamily` read. It has the harness signature
(serveDist + KF_PLAYWRIGHT_DIR + newContext) but **ZERO actuation primitives** (grep: click=0 disp=0
mouse=0 kbd=0 ptr=0 hover=0). It never clicks/switches/drags/fires — it rests on load and reads.

The meta-gate `proof:gate-is-runtime` audits `WAVE_HARD_GATES` (`proof-gate-is-runtime.mjs:84-94`) =
the 9 §Hard gates; `proof:demo-fonts` is EXPLICITLY excluded ("`proof:demo-fonts` is NOT in this set:
the font reclaim is a FOLD into the proof:live-session battery," `:79-83`). So a correctness-TIER gate
that the meta-gate's own actuation rule (`actsPresent.length === 0` → fail, `:207-214`) would RED is
exempted from that rule by authorial roster decision. The taxonomy claim "the 10 correctness gates are
all genuinely actuating" (commit message) is FALSE — 9 actuate, 1 is load-rest. The font property IS
genuinely also covered by live-session's `dom.font` leg (`:763-776`), so the gate is redundant with an
actuating clause — which is precisely why it should be DEMOTED to hygiene (or removed), not kept in the
correctness tier as a load-rest oracle. **Disposition: FOLD** — move `proof:demo-fonts` to
`proof:hygiene` (its correctness is already in live-session's body-font leg), so the correctness tier is
exactly the actuating set and the meta-gate's roster equals the correctness tier (no exemption).

---

## §6 — W7-4 (P2): the meta-gates verify actuation by SOURCE-TEXT regex (self-acknowledged proxy)

Both `proof:gate-is-runtime` and `proof:chronic-closure` detect "the gate actuates" by `fs.readFileSync`
+ regex over the gate script's TEXT for `page.click`/`dispatchEvent`/`page.mouse`/etc.
(`proof-gate-is-runtime.mjs:188-194`, `proof-chronic-closure.mjs:118-126`). They do NOT run the gate or
observe an actuation. A gate that CONTAINS the string `page.click(` in a comment, a dead branch, or a
no-op `.catch(()=>{})` path passes the meta-gate's actuation check. Both gates HONESTLY self-record
HYGIENE-tier (they read source shape — `proof-gate-is-runtime.mjs:257-273`, `proof-chronic-closure.mjs:53`)
and the spec acknowledges this (`I.W7.md:365-369`: "it is itself a HYGIENE-tier gate… exactly as eslint
is hygiene-tier"). So this is NOT a hidden lie — it is a declared limitation. But it means the
"machine-enforced precept" (the RED-1 answer) is enforced at SOURCE-SHAPE altitude, the same altitude
the wave indicts for the original sin; the genuine correctness floor is `proof:live-session` actually
running green. The meta-gate is structurally analogous to H's `proof:chronic-closure` (source-shape
auditing other gates) — the difference is it audits for the RIGHT shape and disclaims correctness
authority. **Disposition: BOOK** — record that the precept's machine-enforcement is source-shape-tier;
the true enforcer is live-session's green. A stronger J move (measure-first) would have the meta-gate
assert each §Hard gate is INVOKED by a green `proof:correctness` run, not merely that its text contains
an actuation token — but that couples a static gate to a browser run; keep BOOK unless a dead-actuation
regression actually appears.

---

## §7 — The amendments folded in (HONEST, not weakenings)

| Amendment | Origin | Honest? | Evidence |
|---|---|---|---|
| B3 amiga split: warm-then-observe present-loop + declared-READBACK `:readback` exclusion | `1a708cf` (original, not WZ) | YES | `:614-705`. The `:readback` exclusion only suppresses PROMOTED GPU/CV tiers; **HARD tiers still charge on readback legs** (`:167` "a real throw during a screenshot is still a real throw"). The warm-load is UNBUDGETED but a per-frame-readback regression stalls every frame regardless of warmup, so the steady-state oracle still bites RC-2. Mirrors the canonical `proof:amiga-subject-is-pivot` (a)/(c) split. Defensible. |
| B1 `pass` field set (verdict read `d.pass`; leg only set `live`) | `1a708cf` | YES — a verdict BUG fix | `:465` `dom.B1 = {…, live: distinct>=3, pass: distinct>=3}`. Without `pass`, the B1 leg would have been a no-op verdict (always `undefined`→fail path). Genuine fix. |
| dockSwitch: TRUSTED `getByRole("option").click()` replaces synthetic `opt.click()` | `11c4c25` (post-close) | YES — gate drives like a human | reka-ui SelectItem commits on REAL pointer events; synthetic in-page click left the FSM on the source scene. The fix makes the gate actuate the product the way the user does — the gate-regime principle applied to itself. NOT a weakening; the keyboard fallback (also trusted) is preserved. |

The WZ tail commits `ebcc79f 9be8a03 a775f6b 11c4c25 2e3669e 2e45941 b17c65a 74b1609` touched OTHER
gates (group ceiling, easter-egg split, perf-frame-budget best-of-3, scene-machine, scene-perf-budget,
visual-lock baseline, convergence docs); only `11c4c25` touched the three W7 meta-scripts, and only
`proof-live-session.mjs`'s `dockSwitch` (reviewed above — honest). The 8 amendments are gates-brought-
current, not gates-quietly-weakened, EXCEPT `a775f6b`'s perf-frame-budget "best-of-3 windows + CI
observe-only" (owned by the WZ-postclose lane §C; a correctness-tier gate that self-downgrades in CI —
not a W7 script).

---

## §8 — Settle-sleeps (P2, BOOK): 30 magic `waitForTimeout` calls

`proof-live-session.mjs` carries 30 `waitForTimeout`/`setTimeout` settle-sleeps with hand-tuned magic
values (`waitForTimeout(1600)`×2, `(2600)`, `(900)`×3, `(800)`×3, down to `(16)`×2). For a browser
interaction harness SOME settling is unavoidable (the harness already prefers `waitForFunction` for the
load+activeScene gates, `:277-301,316`), but the drag/visibility/replay legs lean on fixed sleeps rather
than waiting on a product-observable condition. This is the "settle-sleep / magic timeout" class the
audit precept flags, and it is a flake-risk on slow CI runners (the same class that froze
`scene-control-dfa`). **Disposition: BOOK** — measure-first; replace the load-bearing sleeps with
`waitForFunction` on a product condition where one exists (e.g. the B2 leg could wait for `isPlaying`
rather than `waitForTimeout(1000)`). Not a P0/P1 — the gate currently passes — but a durability debt.

---

## §9 — What is HONEST and SOLID (do not re-open)

- **The seam is right.** ONE driven session replacing ~34 rest-probes is the KISS inversion the census
  demanded. The battery genuinely drives PLAY (`clickRainbowPlay`), SWITCH (`dockSwitch` trusted),
  visibility (`fireVisibilityHidden`), DRAG (`page.mouse` on square + amiga centre, PointerEvent on
  easing handles). The error budget accumulates across the WHOLE battery into one `charges[]` and the
  verdict reads `charges.length === 0` (`:900`). This is the right architecture.
- **Retirements clean** (§2): 6 scripts gone, dual-ABSENT enforced.
- **Two-tier taxonomy wired + CI-enforced**: `proof:correctness`/`proof:hygiene`/`proof:all` partition;
  CI demo-smoke runs all 10 correctness gates individually under `KF_REQUIRE_BROWSER=1` (`ci.yml:239-279`);
  the meta-gates run static in the library job (`:174-184`). `ci.yml` is now YAML-valid
  (`yaml.safe_load` OK; the H-since invalidity is closed by the WZ tail — owned by the WZ-postclose lane).
- **Chronic-closure rewire substantive** (§S4): parses the canonical `I/PROGRESS.md §"Open deferrals"`
  table (CH-1..CH-10), per row demands resolve + correctness-tier + RUNTIME-actuation + born-RED prose,
  enforces the vaporware-HANDOFF and right-axis rules, and the retired-dual. It is no longer the
  markdown-name-resolver H shipped. (Caveat W7-4: actuation detection is source-text; and CH-2's
  RE-AFFIRM cites `proof:live-session`'s body-font leg as runtime corroboration, which is the
  non-actuating font read — a soft spot but disclosed as RE-AFFIRM, not a fresh close.)
- **B3 `:readback` exclusion does not mask HARD throws** (§7): only PROMOTED GPU/CV tiers; a real throw
  during a screenshot still charges.

---

## §10 — Cross-lane dedup (do not double-count)

The following are owned by sibling J-audit lanes — referenced, not re-found here:
- `proof:perf-frame-budget`/`proof:demo-fonts` CI observe-only + the "correctness-tier-but-CI-observe-only"
  THIRD band → **wave-I.WZ-postclose.md §C** (Finding c, BOOK).
- the deploy-gating `scene-control-dfa`/`scene-transition-perf` orphaned from `proof:all` + the
  deploy-block chain → **wave-I.WZ-postclose.md §D** (P0/P1).
- live-session is DESKTOP-1440-ONLY (≥6 un-exercised human axes: mobile/touch/reduced-motion/dark/focus/
  playground); CH-3 "mobile" closes via desktop oracles; easing reached via hash not dock →
  **final-vs-tree-inv-epsilon.md INVE-2/INVE-3** (P1, FOLD). My W7-3 (demo-fonts non-actuating) and
  W7-1/W7-2 (B2 vacuous-skip, global exclusion) are NEW and complement INVE-2's breadth gap with depth
  gaps in the SAME gate.

---

## Evidence appendix (re-runnable)

```sh
git show 1a708cf --stat                                   # W7 delivery: +1809/-2375, 5 scripts gone
git show 11c4c25 -- scripts/proof-live-session.mjs        # the only post-W7 live-session amend (trusted click)
node --check scripts/proof-live-session.mjs               # OK
node --check scripts/proof-gate-is-runtime.mjs            # OK
node --check scripts/proof-chronic-closure.mjs            # OK
# W7-1 — dev leg note-skips under KF_REQUIRE_BROWSER:
sed -n '864,868p' scripts/proof-live-session.mjs          # note(...) + return, no fail
# W7-2 — global named-benign:
sed -n '141,142p' scripts/proof-live-session.mjs          # isNamedBenign at top of chargeBudget, no leg arg
# W7-3 — demo-fonts in correctness, not actuating, exempt from meta roster:
node -e "const p=require('./package.json');console.log((p.scripts['proof:correctness'].match(/proof:[a-z-]+/g)).length)"  # 10
grep -cE "page\.click|\.dispatchEvent|page\.mouse|page\.keyboard|PointerEvent|\.hover" scripts/proof-demo-fonts.mjs       # 0
grep -c "demo-fonts" scripts/proof-gate-is-runtime.mjs    # only in comment, 0 in WAVE_HARD_GATES array
# W7-5 — proof-browser stale candidates:
grep -nE "demo-console-clean|no-orphan-specular|scene-icons" scripts/proof-browser.mjs   # :32 :44 :55
# retirements clean:
for g in demo-console-clean dock-morph-settled no-orphan-specular scene-icons dragscrub-single specular-handoff; do test -f scripts/proof-$g.mjs && echo PRESENT $g || echo gone $g; done
```
