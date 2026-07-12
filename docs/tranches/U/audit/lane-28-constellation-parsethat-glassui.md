# Lane 28 — constellation-parsethat-glassui (Tranche U audit)

**Fleet:** Tranche U development audit, lane 28/32.
**Charter:** (a) parse-that — verify kf's direct dep is gone, summarize driven state, hunt kf-side residue + transitive debt. (b) glass-ui — the gap ledger (`demo/glass-ui-gaps.ts`) + `KF-TO-GLASSUI-BG.md §FORWARDING`, the current pin, the BG/BH expectation set (BG-5/BG-11/GU-1/GU-2 + dock z-inversion), the tripwire gates' arming state; what U owes each edge.
**Discipline:** read-only; every finding carries file:line evidence read from the live tree.

---

## HEADLINE

kf's parse-that edge is clean (transitive-only via value.js 3.1.0 → parse-that ^1.0.0, both at registry-latest) and value.js's consume edge is current (^3.1.0, grep-zero 3.x-breaking surface) — but the glass-ui apparatus has a **structural blind spot**: glass-ui shipped **4.1.0 and 4.2.0** (registry latest = 4.2.0) while kf's `~4.0.0` tilde pin freezes the installed tree at **4.0.1**, and the entire "self-justifying-carry killer" (gap tripwire + workaround-deletion) content-probes ONLY the *installed* 4.0.1 dist — so a BG/BH cure landing in a minor the tilde cannot reach stays **vacuously green forever**, and no gate blocks the drift.

---

## Part A — parse-that

### A1. Direct dependency is GONE (verified three ways) — POSITIVE
- `package.json` declares exactly `dependencies: { "@mkbabb/value.js": "^3.1.0" }` (`package.json:293-295`) + `optionalDependencies: { "@mkbabb/glass-ui": "~4.0.0" }`. **No `@mkbabb/parse-that` in dependencies or devDependencies.**
- `package-lock.json:665-676`: parse-that `1.0.0` is present ONLY as a transitive node under value.js (value.js 3.1.0's own `dependencies` declares `@mkbabb/parse-that: ^1.0.0` — confirmed at `node_modules/@mkbabb/value.js/package.json`).
- **Zero `src/` runtime import of parse-that.** Every `src/` hit is a doc-comment recording the *removal*: `src/animation/compile/parse-flatten.ts:125-128` ("removes kf's direct `@mkbabb/parse-that` production… reaches it through value.js instead"), `src/animation/internal/leaves.ts:9-10` (the `@mkbabb/value.js/math` subpath is "parse-that-FREE").

### A2. Driven state — parse-that 1.0.0, at registry-latest — POSITIVE
- Registry `npm view @mkbabb/parse-that version` = **1.0.0** (the S-spine cut: PACKRAT_ARMED arming, *Span surface deleted, chainError retired). Installed transitive = 1.0.0. **Current; nothing owed.**
- No transitive debt: value.js 3.1.0 → parse-that ^1.0.0 resolves to 1.0.0 = latest, so exactly ONE parse-that realm exists in the tree. The cross-realm-cast concern that motivated the old realm-convergence gate is **structurally impossible** now (kf declares no parse-that; there is nothing to diverge from).

### A3. LEGACY RESIDUE — the dead realm-convergence machinery (NO-LEGACY violation)
`scripts/proof-deps-current.mjs` still carries a large **REALM-CONVERGENCE** apparatus that reasons about a world kf left at Q:
- Clause 3 (`proof-deps-current.mjs:237-329`) computes `kfRange = declared["@mkbabb/parse-that"]`, branches on "kf declares NO parse-that" (the ACTUAL path), and keeps a whole SPLIT-realm error path (`:278-294`) + a `G-HANDOFF-1` warning (`:329`) that can never fire because kf structurally declares no parse-that.
- `FLOORS` and the header comment (`:5, :15, :33-39, :73`) still enumerate a `parse-that ≥0.9.0` floor and the "TWO parse-that realms… cross-realm cast is utils.ts:248" narration — `utils.ts` does not exist (it became `compile/parse-flatten.ts`), and the realm split cannot occur.
- **PROPOSAL:** this is legacy narration of a resolved concern. The idiomatic cure is not to prune lines but to **collapse clause 3 to a single positive invariant** — "kf declares NO `@mkbabb/parse-that`; the constellation is single-realm by construction" — a one-assertion gate, and delete the split-realm branch, the `parse-that` FLOOR entry, and the `G-HANDOFF-1` warning wholesale. The realm question is closed; the gate should say so in one line, not carry the machinery of the open question.

### A4. Build-graph parse-that references are LEGITIMATE (not residue)
`vite.config.ts:530`, `bench/playwright.bench.ts:119/201`, `bench/computed-real-dom.bench.ts:69/112`, `scripts/proof-subject-animates.mjs:80-112`, `scripts/proof-consume-bundle.mjs:13-77` all name `@mkbabb/parse-that` — these are **externalize lists / vendor-importmap seams** that must be aware of the transitive so the built lib externalizes it and the bench harness can resolve it. `proof:consume-bundle` deliberately keeps value.js + parse-that NON-external to catch a re-introduced static grammar edge (`proof-consume-bundle.mjs:50, :71`). Correct by design — no charter debt.

---

## Part B — glass-ui

### B1. Current pin — `~4.0.0`, installed 4.0.1 — but the CHARTER ANCHOR (`~3.5.1`) is STALE
- `package.json:297` (via optionalDependencies) = `"@mkbabb/glass-ui": "~4.0.0"`; lock resolves **4.0.1** (`package-lock.json:614-616`).
- `demo/CLAUDE.md` "Key Dependencies" = `~4.0.0`. `PIN-LEDGER.json` `shipped` row = declared `~4.0.0`, installed `4.0.1`.
- The charter's `~3.5.1?` anchor (and MEMORY.md's "kf pins ~3.5.1") is a **T-era-superseded fact** — the currency floor was advanced 3.9.0 → 3.11.2 → 3.13.0 → 4.0.0 across J/K/BA, and T re-pinned to `~4.0.0`. MEMORY.md's `project_glassui_specular_consume_edge` note is stale and should be re-pinned in the constellation memory.

### B2. CRITICAL — glass-ui 4.1.0 + 4.2.0 are LIVE; the tilde pin freezes kf below them; the tripwire is BLIND
- `npm view @mkbabb/glass-ui versions` = `[…, 4.0.0, 4.0.1, 4.1.0, 4.2.0]`; **latest = 4.2.0**. kf's `~4.0.0` admits 4.0.x **patch only** (`PIN-LEDGER.json` note: "the tilde pin admits 4.0.x patch only; ~4.0.0 installs 4.0.1"). So kf is **two minors behind** and cannot see 4.1.0/4.2.0 without a re-pin.
- The whole gap apparatus reads the **INSTALLED** dist: `scripts/lib/glass-caps.mjs:26-35` (`distFile` reads `node_modules/@mkbabb/glass-ui/dist/*`) and `installedGlassUiVersion()` (`:40-56`). Running `proof:glass-ui-gap-tripwire` today: "installed @mkbabb/glass-ui 4.0.1 — caps: ariaGuard=false … drawerDetentInset=false … vacuously green". **If any of the five caps' cures shipped in 4.1.0 or 4.2.0, the tripwire cannot detect it** — it only ever greps 4.0.1.
- `proof:workaround-deletion` hard-codes the publish sentinel at `sibling.version:"4.1.0"` (`proof-workaround-deletion.mjs:263, :282, :303, :324`) and does an npm-E404 *existence* probe — which now returns "4.1.0 is published" — but then falls back to content-probing the installed 4.0.1 dist, emitting the self-contradicting line *"4.1.0 is published but its … has NOT landed"*. The version sentinel (registry existence) and the content probe (installed dist) are **decoupled**: the sentinel says "published," the content grep says "absent," and the arm holds PENDING on a version that the tilde pin can never install anyway.
- **No gate BLOCKS the drift.** `proof:deps-current` is a FLOOR check only (`proof-deps-current.mjs:136-165`; installed ≥ 4.0.0 — 4.0.1 passes trivially) and skips optional siblings entirely (`:145-146`). `proof:pin-ledger-current`'s registry cross-check is `declarePosture` OBSERVE-ONLY (`PIN-LEDGER.json` $schema-note: "The `npm view` registry cross-check is OBSERVE-ONLY"). So glass-ui can advance arbitrarily far ahead of the pin and CI stays green.
- **PROPOSAL (gestalt):** the "self-justifying-carry killer" must probe the **latest published** dist, not the frozen installed one. Two coupled cures: (1) re-architect `glass-caps.mjs` so the cap probe runs against a fetched-latest glass-ui dist (a `pack`/registry-tarball read of `dist-tags.latest`), making a cure landing in ANY reachable minor arm the tripwire; (2) replace the tilde `~4.0.0` with a caret within the BG/BH major line (`^4.0.0`, or the explicit BG/BH cut once identified) so consumed minors actually flow in and the content probe sees them. The deliberate "hold ~4.0.x, tilde never caret" posture (`PIN-LEDGER.json` note) predates 4.1.0/4.2.0 existing and now silently defeats the entire T.H tripwire design.

### B3. The gap ledger — `demo/glass-ui-gaps.ts` — 10 entries, 6 arms + 4 no-band-aid, well-formed
- Five tripwire-arm entries (each `glassCap` non-null + `workaroundSites` present): `segmentedTabsAriaOrientation` (BG-1+BG-3, `ariaGuard`, `:58-70`), `dockStrandKeepalive` (GU-4, `:71-83`), `dockDropdownPointerdown` (BG-4, `:84-93`), `dockDismissHold` (GU-3, `:94-103`), `drawerDetentInset` (BG-11, `:104-143`).
- Four recorded no-band-aid gaps (`glassCap: null`, empty `workaroundSites` — version dimension only): **GU-1** dockRestBlur (`:149-158`), **GU-2** dockMorphMeasure (`:159-168`), **BG-5** staticBackdrop (`:169-178`), BG-6 fontDisplayWeight (`:179-188`), BG-7 specularWriterPublic (`:189-199`). (That is 5 no-band-aid rows; the tripwire reports "10 gap entries" = 5 arms + 5 recorded.)
- The tripwire passes today with all 12 citation clauses satisfied (each workaround site carries its `GLASSUI-GAP:` marker) — verified by running `proof:glass-ui-gap-tripwire` (12 ✓, PASS, "armed for the BG/BH publish").
- **The `fixVersion` fields are all abstract** ("@mkbabb/glass-ui BG/BH …") — they name a cut, not a version. Combined with B2, the ledger has **no way to notice** that BG/BH may have partially shipped as 4.1.0/4.2.0. **PROPOSAL:** give each entry a concrete `fixVersion` the probe compares against `installedGlassUiVersion()` AND `dist-tags.latest`, so "cure expected by 4.x but latest is 4.2.0 and still absent" is a *distinguishable* state from "unpublished."

### B4. The BG/BH expectation set — 13 asks + 5 live-adoption findings (BG-5 / BG-11 / GU-1 / GU-2 + z-inversion)
`docs/tranches/T/KF-TO-GLASSUI-BG.md` is the consolidated letter (482 lines, §0 roster + §FORWARDING).
- **BG-5** (static-backdrop blur mode, `KF-TO-GLASSUI-BG.md:41, :239-260`, §FORWARDING item 2 `:455-459`): the dominant systemic perf killer (morph 33→116fps neutralized). No-band-aid; kf acceptance gate `proof:blur-not-resampled`. Owner-visible via VERDICT #19.
- **BG-11** (detented Drawer bottom-reserve token `--drawer-inset-block-end` + max-detent cap, `:47, :307-365`, §FORWARDING 6a `:473`): **now URGENT** — the T.H3 owner override ADOPTED `<Drawer mode="live-behind">` NOW (not behind BG-11), so the live sheet rides OVER the bottom menubar at any detent (`drawer.css` `[data-glass-drawer-snap-points=true]{height:100%}`). The `drawerDetentInset` arm is the ADOPT-posture tripwire (`glass-ui-gaps.ts:104-143`).
- **GU-1** (dock rest-crisp, `:34, :162-179`) + **GU-2** (width-morph continuity, `:35, :189-206`, §FORWARDING 3 `:460-463`): render defects, no kf band-aid; gates `proof:dock-rest-crisp` / `proof:dock-morph-continuity` born-RED on the consumer side.
- **Dock z-inversion:** the charter's "dock z-inversion" is a T.H3 Drawer-adoption finding, **measured and FORWARDED** (`FINAL.md:52` row 27: "the z-inversion + inset gaps measured-and-forwarded"). It is captured as a *live browser gate* (`proof:dock-zorder.mjs:14-40`: "The ONLY risks the `fixed` stage introduces are a z-inversion… stage < sheet < dock") plus §FORWARDING row 6c (the orphaned keep-open dock mutex, `:475`). This is a forward, not a kf-side residue — U owes only to keep it in the re-issued letter.
- §FORWARDING rows 6a–6e (`:473-478`) were captured against the live 4.0.1 dist during T.H3-ADOPT: 6a ≡ BG-11 URGENT; 6b (forceMount/peek), 6c (dock mutex orphan), 6d (live-behind focus/scroll doc), 6e (fling-velocity tunability) are forward consumption notes with the owner's research/plan/fold exhortation.
- BG-8/BG-9/BG-10/BG-12 + 6b–6e are **delineated GAPs** (docs / additive / catalogue asks) — no workaround, no tripwire arm, ride the letter.

### B5. Tripwire gates — arming state (all vacuously-green / observe-only until publish)
| Gate | State today | Mechanism | Note |
|---|---|---|---|
| `proof:glass-ui-gap-tripwire` | PASS (vacuous) | `glass-caps.mjs` reads installed 4.0.1 dist; all 5 caps false | armed but **blind above 4.0.x** (B2) |
| `proof:workaround-deletion` | 4 GREEN / 3 PENDING / 0 RED | S2/S3/S4 PENDING on hard-coded 4.1.0 sentinel; S1/S7/S8/S9 GREEN | S9 = parse-that direct-import arm, permanently GREEN (`proof-workaround-deletion.mjs` output) |
| `proof:glassui-aria-ask` | PENDING, observe-only | device-bearing mounted-DOM readback of installed pill; wired OBSERVE-ONLY until the guard is in dist (`proof-glassui-aria-ask.mjs:28-30`) | the STRONGER content half vs `glassCaps.ariaGuard` |
| `proof:dock-zorder` | live browser gate | z-order strictly ascending stage<sheet<dock | not in the not-run set; verifies the z-inversion forward |

### B6. Doc/version staleness (NO-LEGACY sweep candidates)
- `KF-TO-GLASSUI-BG.md:372` §5 pin table says value.js `^2.0.1 (:271)` — **stale**; actual `package.json:294` = `^3.1.0` (T.S3 re-pin). The letter's pin snapshot never advanced past T-open.
- `PIN-LEDGER.json` `shipped.$comment` still narrates "value.js 2.0.1's own dependencies declare parse-that ^1.0.0 (transitive)" — **stale**; installed value.js is 3.1.0 (its own row a few lines down correctly says `declared ^3.1.0, installed 3.1.0`). The $comment contradicts the data it annotates.
- **PROPOSAL:** the owner's no-legacy edict extends to stale version narration. U should charter a one-pass currency refresh of the letter §5 table and the ledger $comment, and — better — make these DERIVED from `package.json` at gate time rather than hand-copied prose that drifts every re-pin.

### B7. value.js consume edge — CLEAN, nothing owed (POSITIVE)
- `package.json:294` = `^3.1.0`; registry latest = 3.1.0; installed 3.1.0. Current.
- Grep-zero for the 3.x breaking surface (`logerp`/`color2Into`/`colorSoa`/`normalizeParam`/`VJS_PARAM`) in `src/` — the 3.x breaking changes do not touch kf's surface (`PIN-LEDGER.json` value.js note confirms). value.js's own tranche is active elsewhere; **U charters only the coordination letter — no kf-side value.js work owed.** (KF-7 PropertyDescriptor un-rename is still a born-RED backlog tripwire on `proof:no-collision-rename`, discharged by a future value.js publish — a standing forward, not U debt.)

---

## What U must charter

1. **Fetch glass-ui 4.1.0 AND 4.2.0 dist and re-probe the five `glassCaps` caps** against them (not the frozen installed 4.0.1) — determine whether any BG/BH cure (BG-1/BG-4/GU-3/GU-4/BG-11) already shipped; re-pin to the cut carrying any cure and delete the stranded workaround, OR record the negative with fetched-dist evidence. Do NOT let the tilde freeze kf below live minors.
2. **Re-architect the gap tripwire to probe the LATEST-published glass-ui dist, not only the installed one** (`glass-caps.mjs` reads a `dist-tags.latest` tarball), so a cure landing in an unreachable minor CANNOT stay vacuously green — close the tilde blind spot that defeats T.H's "self-justifying-carry killer."
3. **Replace the deliberate `~4.0.0` tilde hold with a caret within the BG/BH major** (`^4.0.0` or the explicit cut) so consumed minors flow in and the content probe sees them; supersede the "hold ~4.0.x, tilde never caret" posture note in `PIN-LEDGER.json` that predates 4.1.0/4.2.0.
4. **Add a BLOCKING glass-ui currency assertion** (or fold it into the CI-trim band) so glass-ui drifting a minor ahead of the pin is CAUGHT — today `deps-current` is a floor-only check that skips optional siblings and `pin-ledger`'s registry cross-check is observe-only, so nothing fails on drift.
5. **Excise the dead parse-that REALM-CONVERGENCE machinery** in `proof-deps-current.mjs` (clause 3 split-realm branch + the `parse-that` FLOOR + the `G-HANDOFF-1` warning + the `utils.ts:248` narration) — collapse it to a one-line single-realm-by-construction invariant; no-legacy.
6. **Refresh the stale version narration** (`KF-TO-GLASSUI-BG.md §5` value.js `^2.0.1`→`^3.1.0`; `PIN-LEDGER.json` $comment "value.js 2.0.1"→3.1.0) and derive these from `package.json` at gate time rather than hand-copied prose that drifts every re-pin.
7. **Re-pin the constellation MEMORY note** `project_glassui_specular_consume_edge` (and MEMORY.md's "kf pins ~3.5.1") to the current `~4.0.x`-installs-4.0.1 reality with the 4.2.0 registry frontier.
8. **Keep the BG/BH letter forwards live** (BG-5/BG-11/GU-1/GU-2 + the z-inversion 6a/6c + BG-8..10/6b/6d/6e) — re-issue on any glass-ui publish; parse-that owes nothing (1.0.0 latest, transitive-only) and value.js's edge is current (^3.1.0) — no work owed either sibling beyond the coordination letter.
