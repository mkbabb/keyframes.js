# V.A — THE RAIL (W1–W3)

The externally gated band. Authority for the mechanics: `../U/AGENTIC-HANDOFF-2026-07-16.md`
§5, as amended by the audit (`../audit/AUDIT-REGISTRY.md` FAM-01/FAM-02/FAM-14;
verification `../audit/R2-04-adversarial-verify.md`).

The π three-viewport floor is discharged tranche-wide by W11's DELTA
instrument; W1/W3's 1280/390 matrices are the rail's contract-fidelity probes
per handoff §5.11, not the π close instrument.

---

# V.W1 - Render Truth

**Name**: W1 - Render Truth
**Opens after**: tranche open (rehearsable immediately in the audit copy; LANDS with W2)
**Agents**: 2 parallel (fix unit, gate unit)
**Hard gate**: pageerror==0 and zero `[object Object]` text nodes on all 7 routes × {1280×800, 390×844}, dev server and built tree
**Status**: planned (born RED — every gate condition fails live today)

### Goal criterion

The prepared demo renders and runs error-free on Glass 7: no blank routes, no
masked easing pageerrors, no coerced-object labels. Succeeds if the gate
matrix is green on the reconstructed slice.

### Scope

1. Root `<TooltipProvider>` (from `@mkbabb/glass-ui/tooltip`) wrapping the app
   in `demo/app/App.vue`; remove any scattered deep providers. The documented
   Glass-7/reka pattern (CC-03); demo-owned — file no Glass ask.
2. EE-01: `demo/components/CopyButton.vue:42` `bounceInEase` → `easeInBounce`
   (the Value-4 registry name; curve exists — no value.js letter).
3. EE-02: attach `{fn, css}` twins at both css-less assignment sites —
   `useTimingFunctionEditor.ts:101-102` and `TimingFunctionPanel.vue:144-145`
   — using the panel's own literal (`timingFunctionLiteralFor` /
   `cubicBezierToString`). The library serialize throw is a gated contract
   (roundtrip-easing.test.ts G.W4) and MUST NOT be changed or fallback-masked.
4. EE-03: `useKeyframesParsing.ts:95-102` watch source becomes a getter
   (`() => animation.templateFrames.length`), killing the Invalid-watch-source
   warn flock.
5. FE-3: `KeyframeCardList.vue:11` (and the editable twin `KeyframeCard.vue:5`)
   coerce Spring `frame.start` to its scalar before display — 10 shipped
   `[object Object]` labels on /#/spring.

### Triumvirate Dispatch

Triggers: the gate matrix stays red after the five scoped fixes (unknown
second crash class); any fix demands a library-side change (fence 4 breach);
a third diagnostic loop on one route.

### File Bounds

| File | Access |
|---|---|
| `demo/app/App.vue` | modify |
| `demo/components/CopyButton.vue` | modify |
| `demo/components/instrument/transport/channel-controls/composables/useTimingFunctionEditor.ts` | modify |
| `demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue` | modify |
| `demo/components/instrument/keyframes/composables/useKeyframesParsing.ts` | modify |
| `demo/components/instrument/keyframes/components/KeyframeCardList.vue`, `KeyframeCard.vue` | modify |

`smoke.mjs` is W9-MR1's single-owner path; W1's gate harness lives exclusively
under `docs/tranches/V/audit/harness/`.

Do NOT touch: `src/**` (the serialize contract), glass-ui anywhere,
`package.json`/lock (W2-only).

### Disjointness

Fix unit owns the six demo files; gate unit owns the probe harness (audit-copy
scripts + capture set). No shared writes.

### Worktree Plan

Parallel units either commit-before-parallelize on the shared line or take
sibling worktrees `/Users/mkbabb/Programming/keyframes-v-w1<unit>` per
WAVE_SPEC §4b; the orchestrator runs `git worktree list` before dispatch.

### Agent Units

#### V.W1.a Demo render fixes
- Goal: the five scoped defects repaired demo-side.
- Mechanism: exact edits per Scope 1–5; rehearse in the audit copy first
  (replacing the AUDIT-PROBE patch with the real shape), then stage for W2's
  slice.
- Files: the six demo files above.
- Sub-gate: audit-copy dev server shows pageerror==0 per route; CopyButton
  feedback animation actually plays (group non-null, play() runs).

#### V.W1.b The route × viewport gate harness
- Goal: the born-RED matrix probe that closes this wave and feeds W9's MR1.
- Mechanism: playwright-core harness (pageerror-keyed, text-node scan for
  `[object Object]`), archived under `audit/` per π discipline.
- Files: harness under `docs/tranches/V/audit/harness/` + captures.
- Sub-gate: harness demonstrably RED against the unfixed tree (witness run
  recorded), GREEN after V.W1.a.

### Hard Gate

1. Harness run: 7 routes × 2 viewports, pageerror count 0, zero
   `[object Object]` text nodes (witness: harness output + captures).
2. CopyButton feedback: one scripted copy click shows the animation frames
   (≥3 distinct samples).
3. Library untouched: `git diff --stat src/` empty for this wave.

### Format And Lint Cadence

`npm run check` + `npx vitest run --project demo` after the fix batch and at
close; `git diff --check`.

### Verification Artefacts

Harness + red-witness log + green run log + captures under
`docs/tranches/V/audit/harness/` and `design-captures/`.

### Commit Plan

Lands inside W2's consumer-slice commit as a documented slice extension
(scope: `fix(demo/render)`); no independent commit against the stale base.

### Dependencies

- **Depends on**: none (rehearsal); W2 (landing). (Rehearsal carries no
  dependency; the LANDING is a W2 scope item — the W1↔W2 edge pair is
  rehearse-then-land, not a cycle.)
- **Blocks**: W2 close, W11, MR1's green flip.

---

# V.W2 - Glass-7 Consume

**Name**: W2 - Glass-7 Consume
**Opens after**: the immutable Glass 7 packet (version, annotated tag object,
peeled commit/gitHead, tarball, integrity, shasum, provenance run, export +
declaration maps, peer map, strict packed-consumer evidence, native close)
**Agents**: 2 serial (reconstruct unit, verify unit)
**Hard gate**: clean K6 successor tree with exact registry Glass 7, one
physical core, registry-only lock; the CC-05 watchlist green against the real
tarball
**Status**: blocked (external producer; born RED)

### Goal criterion

The 65-path consumer slice (plus W1's bounded extension) lives on immutable
K6 `5a9183a7` with `@mkbabb/glass-ui: "7.0.0"` as an exact demo-only
devDependency, provably one-core and registry-only.

### Scope

1. Execute handoff §5 steps 1–8 verbatim: isolated clone at `5a9183a7`,
   export the tracked consumer patch, copy the four untracked consumer files,
   never copy `test/demo/scene-entries.test.ts`, add exact Glass 7 devDep,
   regenerate the lock registry-only, clean `npm ci`, one-physical-core proof.
2. Replace the unreproducible digest recipe: commit
   `scripts/release/consumer-manifest.mjs` (pinned serialization:
   `git status --porcelain=v2` + per-file `sha256sum`, documented in-file) and
   record the regenerated digest (AV-8: the old `a26e6a06` digest is
   unpinned-final; the SET is verified, the recipe was not).
3. Apply the W1 slice extension (documented, bounded — the six files).
4. XR-4: drop `mode="persistent"` (EditorShell.vue:16) and delete
   `defineExpose({headerRibbonRef})` (:197) per the Glass mark.
5. Re-verify the CC-05 watchlist against the PUBLISHED tarball: the 19
   demo-consumed subpaths exist; HeaderRibbon persistent-only semantics;
   strict declarations (`skipLibCheck:false` packed consumer); DarkModeToggle
   survival; removed-subpath set.
6. CH2-02: the four de-tripwired dock-crispness obligations (BG-5, GU-1,
   GU-2, subject-legible) re-verified on the running consume — one live check
   each, recorded; then RETIRED with evidence (no gate resurrection).
7. RG-1/RG-2 re-verified against real Glass 7 (the batch letter's kf-side
   follow-through).

### Triumvirate Dispatch

Triggers: watchlist red (Glass surface moved — coordination packet, not a
local patch); packed-consumer typecheck red; any second physical core or
non-registry resolution; manifest recompute mismatch beyond the W1 extension;
a third diagnostic loop on one unit of work halts into triumvirate.

### File Bounds

| File | Access |
|---|---|
| the 65-path slice (55 `demo/**`, 6 `test/demo/**`, 2 U docs, `deploy-pages.yml`, `scripts/observe/demo/subject-animates.mjs`) | apply |
| `package.json`, `package-lock.json` | modify (glass devDep + lock regen only) |
| `scripts/release/consumer-manifest.mjs` | create |
| W1's six files | apply (extension) |

Do NOT touch: `src/**` (K6 producer bytes are immutable), any sibling repo.

### Disjointness / Worktree Plan

Single isolated successor clone (uniquely named network-capable dir);
reconstruct unit writes, verify unit only runs checks. The live owner tree is
read-only source material.

### Agent Units

#### V.W2.a Successor reconstruction
- Goal: the clean K6 + slice + Glass-7 tree.
- Mechanism: Scope 1–4.
- Sub-gate: manifest script output matches the slice inventory exactly; diff
  vs K6 contains only the slice + extension.

#### V.W2.b Package-boundary verification
- Goal: the consume proven sound.
- Mechanism: Scope 5–7 + `npm run check && npm test -- --run && npm run lint
  && npm run build:lib && npm run proof:publish && npm run gh-pages` + strict
  packed consumer.
- Sub-gate: all green; one-physical-core realpath proof; watchlist table
  green row-for-row.

### Hard Gate

1. `npm ls @mkbabb/glass-ui @mkbabb/value.js` — one physical, nonsymlinked
   Glass 7; root K6; one deduped Value 4; lock has zero `file:`/link/git/
   tarball/aliased/non-integrity resolutions (witness: lock grep + realpaths).
2. The command battery green (witness: logs).
3. Watchlist + CH2-02 + RG re-verify rows each carry a recorded observation.
4. Manifest digest recorded from the committed script.

### Format And Lint Cadence

The full battery at close (above); lint after the slice application.

### Verification Artefacts

Successor-tree path + HEAD; lock SHA-256; realpath proof; watchlist table;
battery logs — recorded in `PROGRESS.md` + the W3 packet.

### Commit Plan

One bounded consumer commit on the successor (scope
`feat(demo): consume Glass 7 on immutable K6`), body citing the manifest
digest and the W1 extension; the handoff + inbound docs as a separate
documentation-slice commit.

### Dependencies

- **Depends on**: the Glass 7 packet; W1 (rehearsed).
- **Blocks**: W3, W7, W8, W11 (full), the V.C band.

### Archaeology

Prior attempt: the 2026-07-16 clean clone was lost to the environment reset
(handoff §3). Guardrail: the isolated dir is recreated per §5.1 and nothing
is staged from the mixed owner tree wholesale (AV/WT partition evidence).

---

# V.W3 - Native Close & Deploy of Record

**Name**: W3 - Native Close & Deploy of Record
**Opens after**: W2
**Agents**: 1
**Hard gate**: the frozen gh-pages tree passes the native 1280/390 matrix; the
deploy round-trip is recorded; the evidence tuple reaches the atlas inbox
**Status**: blocked (W2)

### Goal criterion

The rendered, real-Glass demo is deployed with recorded coordinates and the
constellation is notified with verifiable facts.

### Scope

1. Handoff §5 steps 10–13: freeze gh-pages outside `dist/` (path, count,
   bytes, entry hash, whole-tree identity); native in-app Browser matrix at
   1280 and 390 per the §5.11 checklist, augmented by W1's gate (pageerror==0,
   no `[object Object]`); stop at the first material defect.
2. Commit discipline; push; deploy through the Pages workflow; record CI run,
   `last-demo-green` ancestry, Cloudflare run, rollback ID, preview + custom
   domain, served entry, round-trip hash.
3. Ship the evidence tuple (version if cut, gitHead, integrity) to
   `sci-report/atlas/docs/tranches/P/coordination/` and boundary notices to
   glass + value inboxes (W12 owns the packet content; W3 supplies facts).
4. If any packed LIBRARY byte changed, STOP: smallest honest successor
   version from the measured break — never overwrite 6.0.0.

### Triumvirate Dispatch

Triggers: any native-matrix material defect (no CSS/timing cover-ups); CI red
on the runner (device-dependence archaeology applies); byte drift in packed
library output; a third diagnostic loop on one unit of work halts into
triumvirate.

### File Bounds

| File | Access |
|---|---|
| deploy artifacts + the deploy-of-record table (FINAL-V §deploy) | create/record |
| the native-matrix capture set + frozen gh-pages identity log | create |

Do NOT touch: source; any packed library byte (a changed byte halts per Scope 4).

### Hard Gate

1. π matrix (native, both widths, light+dark, the §5.11 checklist + W1 gate)
   recorded with captures.
2. Round-trip: preview + custom domain HTTP 200 serving the recorded entry
   hash.
3. The atlas tuple file exists in their inbox.

### Format And Lint Cadence

None beyond W2's battery (docs-only motions + recorded runs).

### Verification Artefacts

The deploy-of-record table (FINAL-V §deploy), frozen-tree identity, capture
set.

### Commit Plan

Documentation commit recording the packet (scope `docs(V·W3)`).

### Dependencies

- **Depends on**: W2.
- **Blocks**: W13; V.F full-fidelity π.
