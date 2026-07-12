# U.Z3 — release surface-diff witness

This is the close-time witness for OD-U8's additive-only 5.3.0 cut. It is a
one-shot invocation of the existing published-surface oracle, not a new
standing proof key:

```sh
npm run build:lib
npm run proof:published-surface -- --diff --base=v5.2.0
```

The diff mode compares the built declaration surface (root and `./engine`),
the package `exports` entry-point set, and the stable files in the published
tarball. It fetches `@mkbabb/keyframes.js@5.2.0` from the registry so the
baseline is the artifact consumers actually installed. Dynamic chunk names are
implementation details and are reported outside the compatibility set. Any
removed or renamed declaration, dropped entry point, or missing stable file is
red; additions are printed as the 5.3.0 delta.

The release workflow runs this check immediately before the existing publish
path. The current 5.2.0 rehearsal is green: 227 baseline declarations, 231
current declarations (+`ScrollCSSDrive`, `ScrollDriveOptions`,
`ScrollDriveTarget`, `driveScrollCSS`), two entry points on both sides, and no
missing stable files. No version bump or registry publish is performed by the
rehearsal.

U.Z4 remains separately sequenced behind the U.A7 nightly `last-demo-green`
ref and owner-golden blessing. The active deploy workflow still carries the
legacy demo-correctness preflight until that prerequisite lands; this record
does not weaken or bypass it.
