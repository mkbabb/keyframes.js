export const meta = {
  name: 'tranche-d-engine-review',
  description: 'Adversarial read-only review of the W4 engine transposition (FrameCompiler split · runtime transpositions · barrel/boundary/no-legacy)',
  phases: [{ title: 'Review', detail: '3 parallel read-only reviewers audit the W4 engine commit' }],
}

const REPO = '/Users/mkbabb/Programming/keyframes.js'
const RANGE = '9044ce9 a0303fe' // W0-docs → W4 engine commit
const COMMON = `You are an ADVERSARIAL reviewer of the keyframes.js ENGINE transposition (Tranche D W4, commit range \`${RANGE}\`), in ${REPO}. It was HAND-AUTHORED (not by agents) and is gate-green (335 tests · proof:engine · proof:zero-alloc · proof:boundary) — your job is to find the subtle BEHAVIOR or CORRECTNESS difference the tests DON'T cover, not to praise it. The public barrel must be byte-stable; behavior must be preserved (a declared MAJOR absorbs only the named renames advanceTo / pause-resume-toggle / removed re-exports).
READ-ONLY: edit nothing. Inspect with \`cd ${REPO} && git diff ${RANGE} -- <path>\`, \`git show 9044ce9:<path>\` (the pre-W4 original), Read, grep; you may re-run \`npx tsc --noEmit\` / \`npx vitest run\` (change nothing).
Spec: ${REPO}/docs/tranches/D/waves/D.W4.md + audit/engine-transposition.md.
For each issue: severity (high = behavior/correctness/barrel regression; med = latent edge / unproven claim; low = polish), file:line, OLD vs NEW, evidence, suggested fix. Default to skepticism: if you cannot PROVE a change is behavior-identical, flag it med. Terse.`

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['scope', 'issues', 'verdict'],
  properties: {
    scope: { type: 'string' },
    issues: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['severity', 'file', 'description', 'evidence'],
      properties: {
        severity: { type: 'string', enum: ['high', 'med', 'low'] },
        file: { type: 'string' }, line: { type: 'string' },
        description: { type: 'string' }, evidence: { type: 'string' }, suggestedFix: { type: 'string' },
      },
    } },
    verdict: { type: 'string', description: 'CONVERGED (nothing high) or NOT-CONVERGED with the blocker' },
  },
}

phase('Review')
const reviews = await parallel([
  () => agent(`${COMMON}
SCOPE — D-4 the FrameCompiler split (the deepest, riskiest change). Audit src/animation/frame-compiler.ts + engine.ts:
- The seam: compare \`git show 9044ce9:src/animation/engine.ts\` (the original inline Animation) against the new FrameCompiler + Animation delegators. Does EVERY moved method (convertFrameStart/addFrame/createFrame/buildVarIndex/reconcileVars/parse) behave byte-identically? Any subtle difference in the moved logic?
- The options REFERENCE: FrameCompiler holds \`this.options\` by reference (set in the constructor BEFORE setOptions). Is there ANY path where the compiler's options ref could go stale or differ from Animation.options? (Animation never reassigns this.options? grep \`this.options =\`.)
- The delegating accessors: \`get/set templateFrames\`, \`get frames/parsedVars/frameId\`. The demo REASSIGNS animation.templateFrames (3 sites) — does the setter delegate correctly? Anything that reads frameId externally and breaks with a getter (no setter)?
- createFrame's transform-inheritance (seekPreviousValue over this.frames) — preserved? CSSKeyframesAnimation's fromString/fromKeyframes/fromVars + resolveTransform/unflatten interplay with the compiler — intact?
- The constructor field-init ORDER (compiler created before setOptions, after this.options={}) — any other ordering hazard?
Verdict on whether the split is provably behavior-preserving.`,
    { label: 'review:framecompiler', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — D-1/D-2/D-5/D-6a runtime transpositions. Audit src/animation/group.ts + engine.ts + smooth.ts + the demo call-sites:
- D-1 zero-alloc (group.ts transformFramesGrouped): the rewrite from Object.entries/fromEntries to \`for (const key in values)\` + inline whitelist \`continue\`. Is it byte-identical for ALL THREE blend modes (replace/add/weighted)? Does the reused \`_grouped\` buffer (cleared in place) ever leak state across frames OR across its callers (render(), _playReducedMotion() also call transformFramesGrouped)? Is \`for..in\` safe vs the old Object.entries (own vs inherited enumerable — values is a plain {} buffer)?
- D-2 advanceTo: grep proves 0 driver \`tick(\` in engine/group — but is EVERY call-site renamed (waapi.ts shadow loop, group _advanceSlice/_frame, engine _frame)? Any external/demo caller of .tick(absoluteClock) left? Timeline.tick() + tickDt correctly UNtouched?
- D-5 pause/resume/toggle: idempotence (two pause() = paused; two resume() = playing; toggle flips). The demo callers behave IDENTICALLY to before: App.vue restoreGroupPlaybackState (group.pause()→group.resume() — is started true there so resume isn't a no-op?), useAnimationGroupPlayback (toggle/pause/resume), AnimationControlsControls (Animation.toggle). Animation.pause's \`draw\` param REMOVED — any caller passed an arg? group.ts internal anim.pause(false)→anim.pause()?
- D-6a smooth _snapSettled adds _playback.stop() — symmetric with spring, no new regression on the non-reduced path.
Verdict.`,
    { label: 'review:runtime', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — barrel byte-stability · no-legacy · boundary · D-3 withhold. Audit:
- PUBLIC BARREL byte-stability: the dts ships 15 public symbols (the CI dts gate lists them). Did the split/renames change ANY public type signature a consumer sees? Build (\`npm run build:lib\`) and inspect dist/keyframes.d.ts for the Animation/AnimationGroup/CSSKeyframesAnimation surface — is the public method set unchanged except the DECLARED renames (advanceTo, pause/resume/toggle)? Is FrameCompiler correctly NOT on the public barrel (it's internal, reached only via engine.ts)?
- BOUNDARY (proof:boundary green, but verify the reasoning): frame-compiler.ts statically imports value.js (cssTwinFor, ValueUnit, etc.) — is it reached ONLY through engine.ts (the heavy dynamic edge), never from a light barrel entry? grep light source for any static edge to frame-compiler.
- NO-LEGACY retirements: the lerp* re-export gone from utils.ts (engine.ts now imports lerpValue from value.js directly — correct?); formatCSS re-export gone from format.ts (format.ts still uses formatCSS internally — its own import intact?); leaves.ts |any → the precise union (does the narrowing handle the window.cancelAnimationFrame vs clearTimeout paths correctly at runtime, not just types?).
- D-3 WITHHELD: is the withhold honest (the measurement test + the rationale)? Or is there a keyframes-local win that was wrongly left on the table?
Verdict.`,
    { label: 'review:barrel-boundary', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),
])

const all = reviews.filter(Boolean)
const issues = all.flatMap((r) => (r.issues || []).map((i) => ({ ...i, scope: r.scope })))
return {
  reviewers: all.length,
  verdicts: all.map((r) => ({ scope: r.scope, verdict: r.verdict })),
  high: issues.filter((i) => i.severity === 'high'),
  med: issues.filter((i) => i.severity === 'med'),
  low: issues.filter((i) => i.severity === 'low'),
}
