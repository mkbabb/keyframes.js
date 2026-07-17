# The fresh-Glass audit linkage (owner-ordered, evidence-only)

> Owner directive (2026-07-16, mid-formation): "pull in the most recent glass
> UI with a temp file linkage to audit for the most up to date configuration of
> our app against that actively changing library." This document is the
> linkage's provenance. **Nothing here is a consume, a release byte, or
> permission to link worktrees in the real checkout.** The real
> `/Users/mkbabb/Programming/keyframes.js` tree — including its
> `node_modules` — was not touched.

## Construction

1. **Snapshot**: `rsync -a --exclude .git /Users/mkbabb/Programming/glass-ui/`
   → scratchpad `glass-audit-e7da7b5c/`. Provenance: glass HEAD
   `e7da7b5c7da342304f0023a2b3c4338ed2b644a7`; working tree dirty only at
   `docs/precepts` (submodule pointer) — an effectively clean-commit snapshot.
2. **Build in the snapshot**: `npm run build` exit 0; dist 5.2 MB; declaration
   emit projected 69 public entries.
3. **Audit copy**: full keyframes rsync (excl. `.git`) → scratchpad
   `kf-audit-copy/`; the built Glass package (package.json + dist/ + src/)
   swapped over `node_modules/@mkbabb/glass-ui` (7.0.0, registry-absent).
4. **Probe patch** (evidence-only, never lands): `demo/app/App.vue` in the COPY
   wraps its template in `<TooltipProvider>` from `@mkbabb/glass-ui/tooltip`,
   marked `AUDIT-PROBE DP-02`.
5. **Driver**: `playwright-core@1.53.1` installed `--no-save` in the copy only.

## The npm-prune incident (live confirmation of CT-01)

The `npm i --no-save playwright-core` step **silently deleted the swapped
`@mkbabb/glass-ui`** from the copy's `node_modules`: glass-ui has no entry in
`package-lock.json`, so npm reconciles it as extraneous and prunes it on ANY
install. This is finding CT-01/DD-6's mechanism observed live — the demo's
Glass edge survives only until the next `npm` operation. The copy is now
FROZEN: no further npm operations; the swap was re-applied afterward.

## Probe result (2026-07-17)

Dev server from the copy, port 5198; headless Chromium at 1280×800 on `#/`:

```json
{"shape":{"kids":2,"text":118,"mains":1},"errs":[]}
```

Versus the unpatched/stale state (R1-14): all routes blank, `mains: 0`,
`text: 0`, TooltipProvider injection pageerror. The patched copy against fresh
Glass renders with zero pageerrors. Exports-map diff: all 19 demo-imported
Glass subpaths exist in the fresh build (the mid-probe `./dark` resolution
failure was the prune incident above, not a surface change).

## Standing rules for lanes using the copy

- The copy may be mutated EXCEPT via npm install/ci (prunes the linkage).
- The real keyframes tree and all sibling checkouts stay read-only.
- Everything observed against this linkage is evidence about the ACTIVE Glass
  surface, cited as `glass@e7da7b5c`; it earns no release credit and the
  linkage never lands. The published consume decision waits for the immutable
  Glass 7 packet per the rail.
