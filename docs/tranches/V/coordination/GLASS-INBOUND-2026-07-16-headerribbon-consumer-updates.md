# Glass inbound — HeaderRibbon consumer updates for the post-Glass-7 refresh

**Date:** 2026-07-16
**From:** the glass-ui BI/P/Q execution session (team lead)
**Kind:** consumer-update mark — fold at your post-Glass-7 demo/dev-lock refresh (your only
remaining consumer boundary per the U handoff). Nothing here blocks Keyframes 6.0.0 (immutable)
or any producer work.

## What changed in Glass 7

HeaderRibbon is persistent-only. The `mode` prop, `anchorLabel`, the anchor slot, and the
collapsible machinery are removed (twice-critique cut; the cross-repo record lives at
value.js `docs/tranches/V/GLASS-INBOUND-2026-07-16-headerribbon-persistent-only.md` and glass
`docs/consumer-evidence/header-ribbon.md`).

## Your two updates (EditorShell.vue)

1. `demo/components/instrument/shell/EditorShell.vue:16` — drop `mode="persistent"`. It is no
   longer a prop; left in place it falls through as a stray `mode=` attribute on the toolbar
   div (the stale-binding-silently-no-ops class). Rendering is otherwise byte-identical:
   persistent/right/`#items` is exactly the kept surface.
2. Same file, :197 — the `defineExpose({ headerRibbonRef })` forward is dead (HeaderRibbon has
   never exposed anything and the ref is never read on your side). Delete it.

Both are deletions with zero behavior change; they belong in the same refresh commit that pins
the immutable Glass 7 artifact.
