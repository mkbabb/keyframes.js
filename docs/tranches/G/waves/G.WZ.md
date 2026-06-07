# G.WZ — The tranche close (the D FINAL · the G FINAL · the re-pin re-publish)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** BOOK (the close docs — `docs/tranches/D/FINAL.md` +
`docs/tranches/G/FINAL.md`) + **USER-DOMAIN** (the stacked changeset re-publish
`4.0.1`/`4.1.0` atop the clean `4.0.0` base — confirm-first, version owner **Mike
Babb**) · **Scope:** `docs/tranches/D/FINAL.md` (NEW — the ONE missing tranche record)
+ `docs/tranches/G/FINAL.md` (NEW) + the `.changeset/` re-publish entry (USER-DOMAIN,
confirm-first) — ZERO `src/**` / `test/**` / `.github/**` / `demo/**` behaviour edit ·
**DAG: LAST in G** — the close runs after every SHIP wave lands + green CI; the D FINAL
records D as LANDED (it is, in the `4.0.0` stack) with D.W5 now closed via `G.W12`; the
re-publish leg is gated on `G.W2` (the re-pin) + the user's explicit publish go-ahead.

**Title.** *The close. D shipped its content in the `4.0.0` stack but its FINAL.md was
never written (D.W6 authored it, the impl ran the content, the doc was the one residual
— `docs/tranches/D/FINAL.md` verified ABSENT). G.WZ writes the missing D record
(describing the LANDED D content + noting D.W5 now closed via `G.W12`), writes the G
FINAL, and books the stacked re-publish leg — the `4.0.1`/`4.1.0` that consumes the
re-pinned 0.11.0/0.9.0/3.3.0 stack, a USER-DOMAIN confirm-first publish atop the clean
`4.0.0` base, version owner Mike Babb.*

This is the §Mandate's **P-invariant close**: every carry exits with a terminal, no
perpetual punt survives, and the ONE missing tranche record (the D FINAL) is written so
the A→G history is complete. D's PROGRESS named `FINAL.md` as the D.W6 close report
(`D/PROGRESS.md:3` "the close report is `FINAL.md` (authored at W6)") — but the file is
ABSENT (`a-deferred-ledger DP-2`, verified live). The D content LANDED (the `4.0.0`
stack is `B+C+D+E+F`, `d264053 chore(release): @mkbabb/keyframes.js 4.0.0 — the B+C+D+E+F
stack`), so the FINAL is a faithful record of LANDED content, not a forward-looking plan.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the D FINAL records what LANDED with file:line +
gate evidence, NOT an aspirational summary; the re-publish is the GENUINE consume-the-
re-pinned-stack leg, not a version bump for its own sake. NO legacy / fail-EXPLICIT:
the D FINAL notes D.W5 (the dock-rename) was the ONE legitimately-blocked carry, now
CLOSED via `G.W12` (the blocker — glass-ui 3.3.0 publishing — is GONE), so no D carry
is named-forward perpetually. NO god modules · KISS · DRY: the close docs cite the
existing wave specs + audit lanes, they do not repeat raw findings. MEASURE-FIRST does
NOT bind (docs + a publish leg, not a perf claim). inv-16 RELAXED: the re-publish is the
USER-DOMAIN leg (the user cuts the version + drives the npm publish in dependency
order); the docs are kf-side. inv ε: every claim in the close docs cites a wave
spec / audit lane / live `file:line` / `git log`, source-verified on `tranche-g-dev`.

**Provenance.** `_SYNTHESIS-gap-scorecard §2 Band Z G.WZ` (the close wave: the D FINAL
+ the G FINAL + the stacked changeset) + `§3 USER-DOMAIN` · `_SYNTHESIS-deferred-ledger
§5 DP-2` (the absent D FINAL, "trivially dischargeable — G writes the D FINAL describing
the LANDED D content + notes D.W5 as the now-open glass-ui-gated narrative") + `§9
USER-DOMAIN PUB-1` (the re-pin re-publish, version owner Mike Babb) · `a-glass-ui §3
GG-5` (D.W5 closed via the kf-demo dock half = `G.W12`) · `D/PROGRESS.md:3,47` (the D.W6
FINAL was the close report; the version-owner-named clause) · `F/FINAL.md:108-124`
(the `4.0.0` stack + the version owner + the deploy-of-record — the base the re-publish
sits atop).

---

## § State, verified (not asserted)

The live facts, `ls`/`git log`/read-confirmed on `tranche-g-dev`:

1. **`docs/tranches/D/FINAL.md` is ABSENT — the ONE missing tranche record.** Verified
   live (`ls docs/tranches/D/FINAL.md` → No such file; `a-deferred-ledger DP-2`). The D
   tranche dir carries `D.md` + `PROGRESS.md` + `audit/` + `waves/D.W0..D.W6.md` but NO
   `FINAL.md`. By contrast `F/FINAL.md` EXISTS (the F close report). D.W6 was AUTHORED
   to write it (`D/waves/D.W6.md`; `D/PROGRESS.md:47` "FINAL.md reconciles the deferred
   ledger fully terminated … the version owner is NAMED") but the doc was never
   committed — the one residual of the D close.

2. **The D content LANDED — it is in the published `4.0.0` stack.** Verified live
   (`git log`: `d264053 chore(release): @mkbabb/keyframes.js 4.0.0 — the B+C+D+E+F
   stack`). `4.0.0` IS `B+C+D+E+F` (`F/FINAL.md:111-117` "the combined B + C + D + E +
   F publish tier is major … published — `@mkbabb/keyframes.js@4.0.0`"). So the D FINAL
   records LANDED content, not a plan.

3. **D's six waves (the LANDED content the FINAL records):** verified via
   `D/PROGRESS.md` + `D/waves/`:
   - **D.W1** — the demo decomposed (the five oversized units re-encapsulated to their
     line ceiling; the `parseCSSAnimationKeyframes` duplication collapsed to ONE adapter
     body; the three mis-filed timeline utils re-homed; the in-component rAF/timeout
     blobs swapped to vueuse `useRafFn`/`useTimeoutFn`). Gate: `proof:decomposition`.
   - **D.W2** — the design language localized + un-caged (the rented idioms —
     `--rainbow-*`, `--color-gold`, `.scale-on-hover`, `@keyframes enter` — given a
     demo-LOCAL `design-idioms.css` definition, not only the transitive glass-ui /
     tw-animate-css cascade; `utils.css` scrubbed of component-specific rules; the
     φ-ladder leaf-tail F6 swept). Gate: `proof:idioms`.
   - **D.W3** — brittleness hardened (the fragile DOM-walk selectors replaced with
     owned-ref forms; the z-index scale unified to ONE ordered token set; the `@supports`
     guards made to bite; the engine `_snapSettled` symmetry restored). Gate:
     `proof:brittleness`.
   - **D.W4** — the engine transposed to its gestalt (the AnimationGroup per-frame
     allocation excised to the zero-alloc discipline; `tick` canonicalized to ONE
     meaning at the driver layer — `advanceTo(t)` the absolute-clock advance; the
     computed-unit round-trip writes changed-keys-only; the ~1019-line `Animation`
     god-object split at the `FrameCompiler`/playback seam; the deprecated path-compat
     re-exports excised). Gate: `proof:transposition` (umbrella over `proof:zero-alloc`
     + `proof:no-legacy`).
   - **D.W5** — the dock leveraged + the mobile composition closed. **The ONE
     legitimately-blocked carry** (gated on glass-ui PUBLISHING 3.3.0). The dock
     correctness base + the touch-gate B′ fix landed (glass-ui `f0b0ffb`, ships 3.3.0).
     **Now CLOSED via `G.W12`** — the kf-demo dock half (rename `TopDock→ChromeDock`,
     delete the `dock/index.ts` barrel, remove the `:always-expanded` mask, collapse the
     dead single-layer group) lands in G once glass-ui 3.3.0 is consumed off the `file:`
     link (the `G.W2` re-pin).
   - **D.W6** — the close (the deferred ledger terminated; the AFTER capture; the
     version owner named). The CONTENT ran; the FINAL.md is the residual this wave
     writes.

4. **D.W5 was the carry that `G.W12` closes — the D FINAL must note it.** Verified
   (`a-glass-ui §3`, `_SYNTHESIS-gap-scorecard §2 G.W12`): D.W5's kf-demo dock half was
   gated on glass-ui 3.3.0; 3.3.0 is published; `G.W12` is the G wave that lands the
   kf-demo close (rename/barrel/mask/dead-group + the drifted-stub realign), with the
   mobile occlusion as glass-ui-HANDOFF. The D FINAL records D.W5 as "the one carry,
   now closed via G.W12" — no perpetual punt.

5. **`docs/tranches/G/FINAL.md` is ABSENT — written here.** Verified live (`ls
   docs/tranches/G/FINAL.md` → No such file). G's FINAL is the standard tranche close
   report (the wave-by-wave landed record + the deferred ledger CLEAN + the release
   tier).

6. **The `4.0.0` base is CLEAN — the re-publish is a STACKED leg atop it.** Verified
   (`git log` `d264053`; `F/FINAL.md:116-124`): `@mkbabb/keyframes.js@4.0.0` is published
   (provenance, via `release.yml` on the v4.0.0 tag), value.js `0.11.0` / parse-that
   `0.9.0` published, glass-ui `3.3.0` published, keyframes.babb.dev on Cloudflare Pages.
   BUT kf `4.0.0` SHIPPED consuming the STALE siblings (`package.json:84-85,88`
   `^0.8.2`/`^0.10.0`/`file:../glass-ui`). The re-pin (`G.W2`) consumes the published
   0.11.0/0.9.0/3.3.0; the re-publish is the version that ships that consumption — a
   USER-DOMAIN confirm-first leg.

7. **The version owner is Mike Babb.** Verified (`F/FINAL.md:113` "The version owner is
   Mike Babb (`mike@babb.dev`)"; `D/PROGRESS.md:47,180` "the version owner is NAMED").
   The re-publish version owner is unchanged.

The wave's job: write the missing D FINAL (LANDED content + D.W5-closed-via-G.W12),
write the G FINAL (the G wave-by-wave + the CLEAN ledger), and book the USER-DOMAIN
re-publish leg (`4.0.1`/`4.1.0` atop the clean `4.0.0`, confirm-first, version owner
Mike Babb).

---

## § Goal

**What lands (kf-side docs — BOOK):**

- **`docs/tranches/D/FINAL.md`** (NEW) — the one missing tranche record. The faithful
  close report for the LANDED D tranche: the wave-by-wave landed content (D.W1
  decomposition · D.W2 design-language-localized · D.W3 brittleness-hardened · D.W4
  engine-transposed · D.W5 dock — the ONE blocked carry, **now closed via `G.W12`** ·
  D.W6 close), each with its gate; the deferred ledger terminated (every `KFD` folded,
  every `OUT` booked, every `ARCH` recorded — `D/PROGRESS.md` "Open deferrals" table);
  the version owner (Mike Babb); the note that the D content shipped in the published
  `4.0.0` stack and the D.W5 dock-rename narrative completes in G.

- **`docs/tranches/G/FINAL.md`** (NEW) — the G close report. The wave-by-wave landed
  record (the re-pin spine `G.W2` + `G.W3`; the backend close `G.W4`/`G.W5`; the CI
  hygiene `G.W6`; the frontend `G.W7`/`G.W8`/`G.W9`; the styling + demo `G.W10`/`G.W11`/
  `G.W12`; the engine SHIPs + modern-web `G.W13`/`G.W14`; the cross-repo HAND-OFFs
  `G.WV`); the deferred ledger CLEAN (P-invariant — no perpetual keyframes-owned punt);
  the §ALREADY-SOTA binding refusal record; the release tier + the USER-DOMAIN
  re-publish leg.

**What books (USER-DOMAIN — the user drives, confirm-first):**

- **The stacked changeset re-publish `4.0.1`/`4.1.0` atop the clean `4.0.0` base.** A
  `.changeset/` entry for the re-pin consumption (the version that ships kf consuming
  the published 0.11.0/0.9.0/3.3.0 — the F.W6 −94% memo + the 3.96× color + the 2.41×
  dispatch + the C5 correctness, all now LIVE in the shipped engine). **Tier:** the
  re-pin folds value.js's A2/C5 boundary deltas (correctness — WRONG pixels turned
  right) + the perf wins (isomorphic) + glass-ui off the `file:` link → a `4.0.1`
  (patch — pure consumption, byte-stable for the common case) OR `4.1.0` (minor — if a
  G SHIP wave adds a public API: DrawSVG `fromDrawSVG` + `.finished` from `G.W13`). The
  version owner (Mike Babb) cuts the tier; the npm publish is driven in dependency order
  (value.js/parse-that/glass-ui already published; kf re-publishes consuming them).
  **Confirm-first** — everything up to "ready-to-publish, CI green" is autonomous; the
  npm-publish legs the user drives.

**Why:** the A→G history must be complete (the D FINAL is the one missing record), G
must close with its own FINAL + a CLEAN ledger, and the shipped product must consume the
re-pinned stack (the re-publish) — the §Mandate's P-invariant close, with the publish
leg in the user's domain.

**What does NOT land (recorded so no future lane re-raises):**
- **A re-write of the D content** — D shipped in `4.0.0`; the FINAL is a RECORD of
  LANDED content, NOT a re-run. No D source/test edit.
- **An autonomous npm publish** — the re-publish is USER-DOMAIN, confirm-first
  (`_SYNTHESIS-deferred-ledger §9 PUB-1`). G authors the changeset + gets CI green; the
  user cuts the version + publishes.
- **A new perpetual carry** — the close ledger is CLEAN (P-invariant); every G carry has
  a terminal (SHIP/MEASURE-FIRST/BOOK/HAND-OFF/RECORD/KILL), recorded in the G FINAL.

---

## § Scope

### S1 — write `docs/tranches/D/FINAL.md` (the ONE missing tranche record) (`a-deferred-ledger DP-2`, `D/PROGRESS.md:3,47`) — BOOK (kf docs, trivially dischargeable)

**WHAT:** author the D close report describing the LANDED D content. The structure
mirrors `F/FINAL.md`: an opening (D is keyframes.js' fourth tranche — the demo refined,
the engine transposed to its gestalt, the dock leveraged, the deferrals terminated);
the wave-by-wave landed record (D.W1..D.W6, each with its gate); the deferred ledger
terminated (the `D/PROGRESS.md` "Open deferrals" table — every `KFD`/`OUT`/`ARCH`/
`CLOSED` with its terminal); the **D.W5 note** (the ONE legitimately-blocked carry,
gated on glass-ui 3.3.0; the blocker is GONE — 3.3.0 published — so **D.W5's kf-demo
dock half is CLOSED via `G.W12`**: rename `TopDock→ChromeDock`, delete the
`dock/index.ts` barrel, remove the `:always-expanded` mask, collapse the dead
single-layer group; the mobile occlusion is glass-ui-HANDOFF); the release tier (D's
own tier is major, folded into the combined `B+C+D+E+F` → `4.0.0`, version owner Mike
Babb); the note that the D content shipped in the published `4.0.0` stack.

**WHY:** §State 1/2/3/4 — the FINAL.md is the one residual of the D close (the content
LANDED in `4.0.0`; D.W6 authored the FINAL but it was never committed). Writing it
completes the A→G history and records D.W5 as closed-via-G.W12 (no perpetual carry).

### S2 — write `docs/tranches/G/FINAL.md` (the G close report) (`_SYNTHESIS-gap-scorecard §3`) — BOOK (kf docs)

**WHAT:** author the G close report. The structure mirrors `F/FINAL.md`: the opening
(G is the narrow re-pin-spined finisher with a large, honest ALREADY-SOTA refusal); the
wave-by-wave landed record:
- **Band 0/1 (the spine):** `G.W1` re-pin SAFETY verification + `G.W2` THE RE-PIN (the
  headline — value.js `^0.11.0`, parse-that `^0.9.0`, glass-ui `^3.3.0`; the −94% memo +
  3.96× color + 2.41× dispatch + C5 correctness, ZERO kf source edit through `iv._lerp`)
  + `G.W3` the container-resize staleness fold.
- **Band 2 (backend):** `G.W4` the `serializeEasing` fail-explicit close + `G.W5` the
  library line-ceiling GATED DECISION (the recorded cohesion ruling, NOT a reflexive
  split).
- **Band 3 (CI):** `G.W6` the CI workflow-hygiene gate (four findings, one gate).
- **Band 4 (frontend):** `G.W7` Vue idiom convergence + `G.W8` the store singleton +
  `G.W9` the rAF-leak lifecycle fix (the HIGH NEW defect).
- **Band 5 (styling + demo):** `G.W10` the W10/W12-scene idiom sweep + `G.W11` the demo
  usability SHIPs (route, hero, aria) + `G.W12` the dock affordance (the kf-demo D.W5
  close + VT-stub realign + glass-ui-HANDOFF).
- **Band 6 (SOTA):** `G.W13` DrawSVG + `.finished` + `G.W14` the modern-web checklist.
- **Band V/Z:** `G.WV` the cross-repo HAND-OFFs + `G.WZ` this close.

Plus: the deferred ledger CLEAN (P-invariant — no perpetual keyframes-owned punt, every
carry has a terminal); the §ALREADY-SOTA binding refusal (the engine kernel + steppers
+ WAAPI eligibility + the value.js boundary + the FrameCompiler split + color science +
single-grammar parse + parse-that leaf tier + both largest source files at gestalt —
G touched NONE); the release tier + the USER-DOMAIN re-publish leg.

**WHY:** §State 5 — G must close with its own FINAL + a CLEAN ledger + the
§ALREADY-SOTA record (the binding refusal that G manufactured no work where D+E+F lead).

### S3 — book the stacked re-publish `4.0.1`/`4.1.0` (USER-DOMAIN, confirm-first) (`_SYNTHESIS-deferred-ledger §9 PUB-1`, `F/FINAL.md:108-124`) — USER-DOMAIN

**WHAT:** a `.changeset/` entry for the re-pin consumption (kf consuming the published
0.11.0/0.9.0/3.3.0 — the F sibling win-set now LIVE in the shipped engine). The tier:
**`4.0.1`** (patch) if the re-pin is pure consumption (the perf wins isomorphic; the
A2/C5 boundary deltas correct WRONG pixels right, byte-stable for the common case); or
**`4.1.0`** (minor) if a G SHIP wave adds public API (the DrawSVG `fromDrawSVG` +
`.finished` getter from `G.W13` are additive — a minor). The version owner (**Mike
Babb**, `mike@babb.dev`) cuts the tier; the npm publish is driven in dependency order
(the siblings already published; kf re-publishes consuming them). **Confirm-first:** G
authors the changeset + gets CI green (the `G.W2` `proof:deps-current` + the full suite);
the npm-publish leg the user drives.

**WHY:** §State 6/7 — kf `4.0.0` shipped consuming the STALE siblings; the re-pin
(`G.W2`) consumes the published stack; the re-publish is the version that ships that
consumption. The publish leg is USER-DOMAIN (the user cuts the version + publishes) —
the autonomy boundary the D/E/F tranches held.

> **RECORDED in this band — so no future lane re-raises:**
> - **The D content re-run** — REJECTED (D shipped in `4.0.0`; the FINAL is a RECORD,
>   not a re-implementation). Zero D source/test edit.
> - **An autonomous npm publish** — REJECTED (USER-DOMAIN, confirm-first). G stops at
>   "ready-to-publish, CI green."
> - **A new perpetual carry** — none (the ledger is CLEAN; every G carry has a terminal).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable instrument):

1. **THE D FINAL EXISTS + RECORDS THE LANDED CONTENT + NOTES D.W5-CLOSED-VIA-G.W12.**
   `test -f docs/tranches/D/FINAL.md` passes; a doc-grep asserts it names all six D
   waves (D.W1..D.W6) with their gates AND carries the explicit clause "D.W5 … closed
   via G.W12" (the dock-rename narrative completion) AND names the version owner (Mike
   Babb). **BITE:** reds TODAY (the file is ABSENT — §State 1); green after S1.
   Re-deleting the file or dropping the D.W5-via-G.W12 note reds.

2. **THE G FINAL EXISTS + RECORDS THE WAVE-BY-WAVE + THE CLEAN LEDGER + §ALREADY-SOTA.**
   `test -f docs/tranches/G/FINAL.md` passes; a doc-grep asserts it names the re-pin
   spine (`G.W2`), every band's waves, the deferred ledger CLEAN (the P-invariant
   clause), and the §ALREADY-SOTA binding refusal. **BITE:** reds TODAY (the file is
   ABSENT — §State 5); green after S2. Dropping the CLEAN-ledger or §ALREADY-SOTA clause
   reds.

3. **THE DEFERRED LEDGER IS CLEAN — NO PERPETUAL keyframes-OWNED PUNT.** A
   `proof:ledger-clean` doc-grep (over the close docs + the ledger synthesis): every
   carry exits with a terminal (SHIP/MEASURE-FIRST/BOOK/HAND-OFF/RECORD/KILL) + a named
   owner; ZERO item named-forward to a future tranche WITHOUT a terminal. **BITE:** an
   un-dispositioned carry OR a perpetual punt reds (the P-invariant detector;
   `_SYNTHESIS-deferred-ledger §9`). The one CHRONIC-by-design item (the value.js
   charter C-1) is tagged CHRONIC-by-design (correct, not a punt) — its presence does
   NOT red the gate.

4. **THE RE-PUBLISH IS A CHANGESET, NOT AN AUTONOMOUS PUBLISH — USER-DOMAIN.** A `git`
   scope check: this wave's diff adds ONLY the two FINAL docs + a `.changeset/` entry —
   NO `npm publish` run, NO version bump committed without the user's go-ahead, NO
   `src/**`/`test/**` behaviour edit. **BITE:** an autonomous publish OR a committed
   version bump without confirm-first reds (the USER-DOMAIN boundary — the user cuts the
   version + publishes; `_SYNTHESIS-deferred-ledger §9 PUB-1`). The changeset is gated on
   `G.W2`'s `proof:deps-current` green (the re-pin consumed) + the full suite green.

5. **ZERO behaviour edit attributed to this wave — docs + a changeset ONLY.** `npm test`
   + `proof:all` stay green (the close runs after every SHIP wave + green CI); this
   wave's diff is `docs/tranches/D/FINAL.md` + `docs/tranches/G/FINAL.md` + the
   `.changeset/` entry. **BITE:** any `src/**`/`test/**`/`.github/**`/`demo/**`
   behaviour edit attributed to `G.WZ` reds (the close is docs + the USER-DOMAIN publish
   leg, not a SHIP wave).

---

## § Folds

Retires (by finding id):
- **`a-deferred-ledger DP-2`** (the absent `docs/tranches/D/FINAL.md` — the one missing
  tranche record; describes the LANDED D content + notes D.W5 closed via `G.W12`) —
  S1 + gate clause 1.
- **`_SYNTHESIS-deferred-ledger §5 DP-2`** (G writes the D FINAL describing the LANDED D
  content + the now-closed D.W5 narrative) — S1.
- **`a-glass-ui §3 GG-5` (the D.W5 close attribution)** — recorded in the D FINAL: D.W5
  closed via the kf-demo dock half (`G.W12`); the mobile occlusion is glass-ui-HANDOFF
  (`G.WV` S9) — S1.
- **`_SYNTHESIS-gap-scorecard §2 Band Z` (the G FINAL)** — S2 + gate clause 2.
- **`_SYNTHESIS-deferred-ledger §9 PUB-1` / `_SYNTHESIS-gap-scorecard §3 USER-DOMAIN`**
  (the stacked re-publish `4.0.1`/`4.1.0` atop the clean `4.0.0`, version owner Mike
  Babb, confirm-first) — S3 + gate clause 4.

**RECORDED / REJECTED in this band (see §Scope callout):**
- **A re-run of the D content** — REJECTED (D shipped in `4.0.0`; the FINAL is a RECORD).
- **An autonomous npm publish** — REJECTED (USER-DOMAIN, confirm-first).
- **A new perpetual carry** — none (the ledger is CLEAN; P-invariant holds).

---

## § Design decisions (the trade-offs RESOLVED)

1. **The D FINAL records LANDED content, not a plan — D shipped in `4.0.0`.** RESOLVED:
   the D content LANDED (the `4.0.0` stack is `B+C+D+E+F`, `git log` `d264053`); the
   FINAL.md is the one residual of the D close (D.W6 authored it; it was never
   committed). So the FINAL is a faithful RECORD with file:line + gate evidence — NOT a
   re-implementation. Writing it completes the A→G history (the P-invariant: every
   tranche has its record).

2. **The D FINAL notes D.W5 CLOSED via `G.W12` — no perpetual carry.** RESOLVED: D.W5
   (the dock-rename) was the ONE legitimately-blocked carry, gated on glass-ui 3.3.0.
   The blocker is GONE (3.3.0 published); `G.W12` lands the kf-demo dock half. The D
   FINAL records D.W5 as "the one carry, now closed via G.W12" — the §Mandate's "either
   drive the unblock OR record the explicit blocker" closed: the blocker is gone, the
   carry is closed, no perpetual punt survives.

3. **The G FINAL carries the §ALREADY-SOTA binding refusal.** RESOLVED: G is a NARROW
   finisher with a large ALREADY-SOTA refusal (`_SYNTHESIS-gap-scorecard §THESIS`). The
   G FINAL must RECORD the refusal (the engine kernel + steppers + WAAPI eligibility +
   the value.js boundary + the FrameCompiler split + color science + single-grammar
   parse + parse-that leaf tier + both largest source files at gestalt — G touched
   NONE) so a future tranche does not re-manufacture work where D+E+F lead — the binding
   §ALREADY-SOTA record.

4. **The re-publish is USER-DOMAIN, confirm-first — the autonomy boundary holds.**
   RESOLVED: the D/E/F tranches held the line that the npm-publish leg is USER-DOMAIN
   (`F/FINAL.md:108-124`, `D/PROGRESS.md:152-157`). G authors the changeset + gets CI
   green (the `G.W2` `proof:deps-current` + the full suite); the user cuts the version
   tier + drives the publish in dependency order. The autonomy stops at
   "ready-to-publish, CI green" — the publish is the user's.

5. **The re-publish tier is `4.0.1` (patch) or `4.1.0` (minor), atop the clean `4.0.0`.**
   RESOLVED: kf `4.0.0` is CLEAN (`git log` `d264053`); the re-pin consumes the published
   stack. The tier depends on whether a G SHIP adds public API: pure re-pin consumption
   (perf isomorphic; the A2/C5 deltas correct WRONG pixels right, byte-stable for the
   common case) → `4.0.1` patch; the DrawSVG `fromDrawSVG` + `.finished` additive API
   (`G.W13`) → `4.1.0` minor. The version owner (Mike Babb) cuts the tier. The base is
   clean — the re-publish is a stacked leg, not a re-cut of `4.0.0`.

6. **This wave is docs + a changeset ONLY — ZERO behaviour edit.** RESOLVED: the close
   is the D FINAL + the G FINAL (docs) + the `.changeset/` entry (the USER-DOMAIN publish
   leg). No `src/**`/`test/**`/`.github/**`/`demo/**` behaviour edit — the close runs
   AFTER every SHIP wave lands + green CI. The gate is the file-existence + doc-grep
   checks + the USER-DOMAIN scope check (no autonomous publish).
