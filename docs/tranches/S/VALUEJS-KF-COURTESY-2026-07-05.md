# VALUEJS-KF-COURTESY — 2026-07-05

**From**: the value.js Tranche S orchestrator · **To**: @mkbabb/keyframes.js.
**Provenance**: value.js `docs/tranches/S/audit/SYNTHESIS.md §7.2`.
**Status**: a **courtesy record — NO ask.** Nothing here gates any keyframes wave.

**Written to STAND ALONE** — assume zero shared session memory. Dispatched as value.js publishes
**3.0.0** (S.W1; `dist-tags.latest=3.0.0` confirmed, annotated tag `v3.0.0`). This note sits beside its
sibling `VALUEJS-R-COORDINATION-2026-07-03.md` (the two value.js→kf coordination docs of the S era).
Placement note: keyframes has since advanced to tranche T; this file lands in `docs/tranches/S/`
alongside its R-era sibling because it records the S-cut state — re-home if your T inbox prefers otherwise.

---

1. **value.js now hosts the canonical `resolveEasing(string → TimingFunction)`** — landed at S.W1 item
   W1-6, published in **3.0.0** (exported on the `/easing` subpath; roundtrip-tested). It is the
   one-true string→easing resolver the constellation can converge on eventually. **No action requested
   now.** A convergence book is recorded on the value.js side (`S.md §7`: trigger = kf's next
   easing-surface touch). When that touch comes, consider **consuming** `resolveEasing` rather than
   re-authoring it.

2. **The glass-ui EasingPicker loop seam** (value.js letter `GLASSUI-S-ASKS.md` L7) **may consume the kf
   Oscillator** — that is glass-ui ↔ kf coordination; value.js only records it here so neither producer
   discovers the other's intent late.

3. **Standing state, for the record**: the parse-that `^1.0.0` re-pin your drive executed as value.js
   **2.0.1** (`a7eabcc`) is verified + booked DISCHARGED (value.js S.W0-4); `color2Into` currency held
   green through it (the kf fold row 46 gate closed without firing its named exit). The keyframes devDep
   KEEP policy (value.js `CLAUDE.md §3.4`, paired-authorship) stands unchanged.

---

**What shipped in value.js 3.0.0 that touches your surface** (context, not an ask): the cut is a major
because of two public-API breaks (`logerp(t,start,end)→logerp(start,end,t)`, `color-soa.ts` removed) plus
the near-black `srgbToLinear` decode cure (output-changing for encoded ≤10/255 only). None of these is on
the `extractFunctions`/`parseFunctionParameters` surface kf consumes — that surface is unchanged from
2.0.0. If you pin value.js, `^3.0.0` is safe for the kf consumption path; the by-name MIGRATION table is
in value.js `CHANGELOG.md [3.0.0]`.
