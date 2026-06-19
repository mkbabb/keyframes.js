# Tranche M — the consume/deploy close (+ the constellation campaign close record)

> 2026-06-19. The actionable-NOW half of keyframes M (consume the published
> constellation + author the born-RED gates + deploy) is COMPLETE. The remaining
> M waves are glass-ui-BC-gated HANDOFF (see `KF-TO-GLASSUI-BC.md`). Since M is the
> terminal node of the Constellation Lib-Perf + Grammar Campaign, this doc also
> records the campaign-wide close.

## The campaign — three repos, executed in DAG order

| Repo | Tranche | Result | Branch |
|------|---------|--------|--------|
| **parse-that** | A | **0.11.0 published** — pure primitives (CSS parser removed, −32% bundle), manifest hygiene, WDM (id,offset)-sound packrat, subpath split | `tranche-a` (pushed) |
| **value.js** | O | **1.0.0 published** — P0 crashes fixed (0.13.1), subpath split (0.14.0, monolith 146→13.7kB entry), comprehensive 2026+ grammar + zero-alloc (0.15.0), semantic-idempotence + spring() (0.16.0), SOTA perf +23–30% (1.0.0) | `tranche-o` (pushed) |
| **keyframes.js** | M | **consume + gates + DEPLOYED** — re-pinned the constellation; born-RED gates green; **keyframes.babb.dev redeployed** (CF Pages) | `tranche-m` (pushed) |

Six npm publishes (0.9.1→0.11.0 parse-that; 0.13.1→1.0.0 value.js), one production
deploy. Every wave: born-RED proven, adversarially verified, gate-first.

## The observable-truth discipline paid off (the campaign's spine)

Five flawed premises were caught by running the REAL observable, not a proxy:
1. **A.W1 gate unsound-as-charted** — grepped `index.d.ts` (only `export *` lines);
   corrected to the bundled runtime export surface.
2. **D4 packrat "surgical swap" falsified** — the id-only MEMO is the load-bearing
   LR recursion-breaker; the agent landed the full Warth-Douglass-Millstein fix.
3. **D7 SpanParser perf hypothesis falsified** — measured ~10–14% SLOWER on V8/TS;
   honestly retired from the public surface; O.W6 perf came from `dispatch()` + byte
   scanners instead (+23–30%, real).
4. **g1 grammar compose-gate type error** — caught by the adversarial compose
   pre-flight (a TS2412 the runtime gates couldn't see).
5. **O.W6 perf gate non-portable** — absolute MB/s thresholds (device-dependence);
   rewritten as a portable ratio gate vs a JSON.parse normaliser.

## keyframes M — actionable scope (DONE)

- **Consume** — `@mkbabb/value.js ^1.0.0`, `@mkbabb/parse-that ^0.11.0`,
  `@mkbabb/glass-ui` → 4.0.1 (M.W8 Phase-1: the peer-widen FIRED).
- **The headline consume win** — `@keyframes` nested in `@layer`/`@media`/`@scope`
  now ingests via `CSSKeyframesAnimation.fromString` (was silently lost).
- **Born-RED gates authored + GREEN**: `proof:css-parity` (5/5 — P0/nesting/
  depth-walk cured), `proof:packrat-sound` (2/2 — consumed parse-that WDM sound +
  LR intact), `proof:consume-bundle` (2/2 — the atlas finding: a consumer of the
  LIGHT surface drags zero value.js/engine), `proof:peer-satisfied`, `proof:boundary`
  (inv α holds).
- **Base** — `tranche-l-dev` (the L close, M.W1 runner, N Stage shelved per owner).
- **Deploy** — `keyframes.babb.dev` redeployed via `scripts/pages-deploy.sh` (CF
  Pages `keyframes` project). Live: HTTP 200, serving the new build.
- **`.gitignore`** — `.wf-fix.js` workflow artifacts.

## HANDOFF / deferred (glass-ui BC — outside this campaign's library scope)

See `KF-TO-GLASSUI-BC.md` for the full INFORM + ASK. Summary:
- **M.W8 Phase-2** — aria (ASK-1) + RF-17 (ASK-2) workaround deletions.
- **M.W-DESIGN-PAINT**, **M.W15** — BC-consumed-demo visual-truth + demo-perf.
- **M.WZ** — the full M close (gated on the BC-consumed demo).
- **N Stage** (DM-24) — unshelf on glass-ui BC's dock redesign (ASK-3).
- **keyframes-vue-published** (DM-7) — a second USER-DOMAIN deploy tripwire.

## Remaining campaign hygiene (owner-deliberate)

- **master merges** — the three tranche branches (`tranche-a`, `tranche-o`,
  `tranche-m`) are pushed and ready to merge to each repo's `master`. Merging
  keyframes `tranche-m` → `master` will trigger the production CI (`ci.yml` →
  `deploy-pages.yml`); the heavy `proof:all` roster is device-sensitive on the slow
  Linux runner (see the CI device-dependence record), so this is left as a
  deliberate owner step rather than auto-triggered. The published npm artifacts +
  the live deploy are the canonical deliverables and do not depend on the merges.
