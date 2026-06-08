# H.WZ — the changeset + the SemVer rationale (Lane C)

**Owner:** Lane C (the changeset + version owner).
**Branch:** `tranche-h-impl` (19 commits ahead of `master`; W8 at `1f506b2`).
**Deliverable:** `.changeset/tranche-h.md` (`"@mkbabb/keyframes.js": patch`) +
this rationale.

---

## The decision

| | |
|---|---|
| **Bump** | **PATCH** — `4.1.0 → 4.1.1` |
| **Mechanism** | `.changeset/tranche-h.md` (the repo's `@changesets` convention) |
| **Library API delta vs master** | **NONE** (`src/animation/index.ts` byte-stable) |
| **Sole library change** | `src/animation/frame-compiler.ts` — the W0 blank-selector → typed `AnimationOptionError` (a BUGFIX) |
| **Demo** | unpublished (`files: ["dist"]`); deploys to **Cloudflare Pages** (`keyframes.babb.dev`), NOT an npm release |
| **Version owner** | **Mike Babb** (`mike@babb.dev`) — publish + deploy are **user-domain, confirm-first** |

---

## Proof 1 — the public API is byte-stable vs master

```
$ git diff master...HEAD -- src/animation/index.ts
   (empty — exit 0)
```

`src/animation/index.ts` is the published library entry point (builds to
`dist/keyframes.js` + `.cjs` + `.d.ts`). The diff vs `master` is **empty** — every
export (`Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `NumericAnimation`,
`SmoothProgress`, `ElementMorph`, `Timeline`, `ScrollTimeline`, `ManualTimeline`,
`getAnimationId`, `AnimationOptionError`, `UnknownEasingError`, …) is unchanged. No
add, no removal, no signature change. **No minor, no major triggered by the surface.**

## Proof 2 — the engine stayed FENCED (inv ζ); the only library delta is a bugfix

```
$ git diff master...HEAD --name-only -- src/
src/animation/frame-compiler.ts
src/env.d.ts
```

Exactly two `src/` files changed across all 19 commits.

**(a) `src/animation/frame-compiler.ts` — the W0 H-A2 bugfix (the one thing that
drives the patch).** A fail-explicit belt at the compile seam: a blank/whitespace
keyframe selector used to reach value.js's `parseCSSValueUnit("")` and throw the
cryptic, un-typed `Parse error at offset 0: "......"` — one of the two live console
crashes H opened on. The seam now throws `AnimationOptionError("start", start, …)`
naming the malformed selector:

```ts
if (typeof start === "string" && start.trim() === "") {
    throw new AnimationOptionError(
        "start",
        start,
        'a keyframe selector must be a percentage or keyword (e.g. "0%", "from", "50%") — got an empty/blank string',
    );
}
```

Why this is a **PATCH (bugfix)**, not a minor:
- `AnimationOptionError` is an **already-public** export — re-exported from
  `index.ts` (`export { AnimationOptionError, UnknownEasingError } from "./internal/errors"`)
  since Tranche A. No new public type is introduced.
- `frame-compiler.ts` is **not** re-exported from `index.ts` (the `FrameCompiler`
  class is an internal seam; `grep frame-compiler src/animation/index.ts` → empty),
  so the file change has no public-surface footprint of its own.
- The change is a **strictly-more-correct error path**: a previously-cryptic crash
  on malformed input becomes a clear typed error. Every well-formed input is
  byte-identical (no behavior change). The paired value.js typed-empty-input result
  is the standing HANDOFF.
- Locked by `test/w0-crashes.test.ts` (H-A2): typed error on `""` and `"   "`, plus a
  no-false-positive guard asserting a valid keyframe map still compiles + interpolates.

**(b) `src/env.d.ts` — demo-only, NOT in the published surface.** Adds an ambient
`declare module "*.svg?component"` for the vite-svg-loader icon seam (H.W5). It is a
TypeScript ambient module declaration consumed only by the demo build; it is not part
of the `dist` library surface (`files: ["dist"]`, and `dist/` is untracked / built
fresh in the release leg — `git ls-files dist/` → 0). It cannot affect the published
`.d.ts` API. Out of SemVer scope.

## Proof 3 — `check:lib` is tsc-clean

```
$ npm run check:lib       # tsc --noEmit -p tsconfig.lib.json
   (exit 0 — no errors)
```

The library-scoped type check passes. The same gate re-runs in `release.yml`
(`check:lib → build:lib → test → proof:boundary`) before `npm publish`.

## Proof 4 — clean published base, so a straight PATCH (no accumulated-stack tier)

```
$ git tag -l 'v4*'        → v4.0.0  v4.1.0
$ ls .changeset/*.md | grep -v README   → (none pending)
```

`v4.1.0` (Tranche G) is already published and tagged, and there are **no pending
changesets** accumulating in `.changeset/`. Unlike the B+C+D+E+F era — where unpublished
stacked changesets meant the combined tier was driven by the highest pending bump
(major) — H stacks on a **clean published 4.1.0 base**. So the bump is exactly what
H's own library delta warrants: a single **PATCH → 4.1.1**.

---

## The mechanism — why `.changeset/tranche-h.md`

The repo uses `@changesets` (`.changeset/config.json` present; `.changeset/README.md`
documents the flow; `.github/workflows/release.yml` consumes the accumulated changesets
on a `v*.*.*` tag). Every prior tranche cut a `.changeset/tranche-<x>.md`
(`tranche-a-3-0-0` … `tranche-g`). H follows the established convention exactly:
`.changeset/tranche-h.md` with `"@mkbabb/keyframes.js": patch`. No `RELEASE.md`
fallback is needed (that path was only for "no changeset tooling" — not this repo).

`package.json version` is **NOT** bumped here. `changeset version` (the user-driven
release flow) owns the `4.1.0 → 4.1.1` write + `CHANGELOG.md` update + the `v4.1.1` tag.

---

## The version owner + the two release legs (both user-domain, confirm-first)

**Version owner: Mike Babb (`mike@babb.dev`).**

1. **npm publish (the library, PATCH).** Mike finalizes the SemVer tier, runs
   `changeset version` (writes `4.1.1` + `CHANGELOG.md`), tags `v4.1.1` → fires
   `release.yml` (`check:lib → build:lib → test → proof:boundary → npm publish
   --provenance`). **CI must be green first.** The library build is glass-ui-free
   (inv β) — the publish leg never reaches the demo seam.

2. **Cloudflare Pages demo deploy (`keyframes.babb.dev`).** The bulk of H is the demo,
   which is unpublished and deploys to CF Pages separately — **not** an npm bump. This
   is the user's separate, user-domain trigger, CI-green-first.

Both legs are the LEAD's / user's to trigger. This lane does **not** commit, version,
publish, or deploy. Per the close charter: WRITE to `docs/tranches/H/`; the LEAD does
the commit + merge; deploy is user-domain.

---

## Cross-repo SemVer note (born-RED handoffs do NOT touch this bump)

The glass-ui Card-specular SHEEN handoff (`proof:specular-handoff` born-RED) resolves
at glass-ui **3.8.0** `specular="off"` — a **future** kf consumer-adoption bump (the
W34 leg, cosmetic), not part of 4.1.1. The value.js / parse-that slices are consumed on
re-pin through the existing `lerpValue → iv._lerp` seam with no library source edit, so
they carry no SemVer signal of their own here.
