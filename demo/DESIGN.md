# Keyframes.js Demo Design Language

> Extends [glass-ui DESIGN.md](../../glass-ui/DESIGN.md)

## Token Overrides

Instrument Serif (display) + Fira Code (mono). 3D axis colors: `--axis-x`, `--axis-y`, `--axis-z`, `--axis-w` for transform visualization. Progress/slider accent colors. `--accent-red` for destructive actions. `--filter-brand-color` for the library identity accent.

## Local Utilities

Tab trigger variants (reference implementation for tab styling):

- `tab-trigger-base` — shared padding, font, transition
- `tab-trigger-pill` — rounded bg on active, ghost on idle
- `tab-trigger-underline` — bottom-border indicator on active

Playback controls:

- `btn-playback` — transport button with full 4-state cycle (idle/hover/active/disabled) + `aria-pressed` support
- `btn-playback-accent` — accent-colored variant for play/record

## Migration Tasks

Minimal—this demo is already well-aligned with glass-ui patterns.

- [ ] Consider upstreaming `tab-trigger-*` variants to glass-ui
- [ ] Evaluate card-based layouts for asset/layer lists (polish)
