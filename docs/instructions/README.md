# Instructions

Read `docs/precepts/instructions/` first. Local keyframes.js rules:

- `src/animation/index.ts` is the library entry point. Production package
  output is `dist/keyframes.js` and `dist/keyframes.d.ts`.
- Preserve animation engine invariants: `AnimationGroup` owns managed
  playback, child animations do not own rAF while managed, layer blending
  supports `replace`, `add`, and `weighted`, and WAAPI silently falls back to
  rAF when ineligible.
- Verify code changes with `npm run check` and focused `npm test -- <file>`
  or `npm test`; use `npm run bench` for performance-sensitive changes.
- Verify demo/UI changes through `npm run dev` with browser interaction or
  screenshots for playback, scrubbing, matrix editor, dock, and scene
  navigation behavior.
- Do not run `npm run build` or `npm run gh-pages` casually in unrelated
  waves. Both affect `dist/`; `gh-pages` empties repo-root `dist/` for the
  demo build.
- Tracked `dist/keyframes.js` and `dist/keyframes.d.ts` change only when the
  wave intentionally refreshes package output.
- Root screenshots and `.playwright-mcp/` are verification artefacts; do not
  delete or stage them unless the wave explicitly owns them.
