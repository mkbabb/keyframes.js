# KF → glass-ui — Tranche U terminal handoff

**Status:** OWNER-RE-DEADLINED TO GLASS 6.0.0
**Queued:** 2026-07-15 to the active Glass BI/P root
**Consumer now:** `@mkbabb/glass-ui@5.0.0`

This is a release-boundary handoff, not permission to edit or link the active
Glass worktree. Keyframes 5.3.x remains on the immutable 5.0.0 artifact until
Glass publishes the next coherent major.

## Witnessed 5.0.0 state

Glass 5.0.0 is immutable at tag/git head `9a8761f0`, tarball
`https://registry.npmjs.org/@mkbabb/glass-ui/-/glass-ui-5.0.0.tgz`, integrity
`sha512-6O2AxOi7/UXJ4+vr6uAX55etzTdV2obMbZtX/SXWVYiW5m9VK+X2H5ItKDC/ntMEHoeTFe5nk5xzV0hUs1sItw==`.
Keyframes consumes that exact optional edge with one physical Glass core.

Three original asks already ship in 5.0.0:

- GU-1: resting dock chrome is crisp.
- GU-2: dock morph endpoints are measured and bounded.
- BG-7: `createSpecularWriter` is root-exported with declarations.

## Active Glass 6 disposition

Read-only audit of Glass `tranche/BI` at `afe62240` found:

| State | Rows |
|---|---|
| Committed after 5.0.0 | GU-3; BG-1, BG-3, BG-4, BG-6, BG-8, BG-9 at `535be914`; GU-4, BG-11, BG-12 at `afe62240` |
| Active implementation | BG-5 static/frozen backdrop; Dock-z live-behind propagation and layer order |
| Requires explicit disposition | BG-10, because `ToggleChip` was removed in 5.0.0; supersede/decline it or reformulate against `Chip` |

These commits are not a consumable artifact. Post-5.0 work also removes the
published root `Section` surface, so the safe boundary is Glass 6.0.0, not an
assumed patch.

## Required return packet

At the next safe release point, the Glass root returns:

1. annotated `v6.0.0` tag and peeled commit descending from `afe62240` plus
   the final BG-5/Dock-z commit;
2. npm version, tarball, integrity, shasum, `gitHead`, and provenance;
3. final export map and declarations;
4. browser evidence for static backdrop and dock layering/actuation; and
5. an explicit BG-10 shipped/superseded/declined disposition.

Only that immutable packet authorizes a future Keyframes major to update its
exact Glass edge and reassess the local tablist, dock actuation, popup mutex,
dropdown synthesis, and Drawer detent code. U carries no standing tripwire or
capability registry for those sites.

## U close disposition

The owner re-deadlined every unshipped row above to the named Glass 6.0.0
producer and release boundary. That satisfies U.Z2's no-silent-deferral rule:
the work is neither claimed as shipped nor inherited by another Keyframes U
row. A later Keyframes major consumes only a versioned artifact.
