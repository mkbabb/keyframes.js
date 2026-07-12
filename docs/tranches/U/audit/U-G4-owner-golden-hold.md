# U.G4 — owner-golden hold record

**Recorded:** 2026-07-12 on `tranche-u-impl`  
**State:** PENDING-OWNER (honest external hold)

The current owner-golden witness is intentionally the inherited 12-cell matrix:
six scenes (`home`, `cube`, `amiga`, `square`, `easing`, `spring`) × two themes.
`npm run proof:owner-golden` verifies all 12 committed cells and exits 0, but
reports that its render leg is skipped because no new blessing token and built
`dist/gh-pages/` are present.

U.G4 is not satisfied by that inherited matrix. Its ratified completion target
is the sequence-light/sequence-dark pair added to the matrix (12 → 14), plus
the idle-state (`PANE=LIT`) pin in the capture protocol. No sequence entries,
idle pin, or owner blessing has been fabricated here. The owner-golden
mechanism therefore remains a real close gate, and U.Z must continue to report
the hold rather than promote the 12-cell witness to completion.

**Re-run evidence**

```text
proof:owner-golden — 12 checks / 12 cells PASS
owner-golden render leg SKIPPED — no blessing token + built dist to diff against
```

The next action is an owner review through the existing candidates flow. This
record does not create a new gate and does not alter `docs/tranches/T/goldens`.
