# H.W8 Lane C — the glass-ui dock CONSUME-LEG bump (S4 · BLK-5 · D5 dock-lag)

The riskiest H.W8 lane: bump `@mkbabb/glass-ui` to consume the published dock-spring
retune (D5 dock LAG), pair it with the born-RED `proof:dock-morph-settled` token-peak
gate, and leave the demo GREEN through the 3.4→latest jump. inv-16: this is a CONSUME
of the published glass-ui token, NOT a kf fork — a one-line pin change + verify.

## Resolved version

| | declared range | resolved (installed) | `--spring-dock` peak | overshoot |
|---|---|---|---|---|
| before | `^3.4.0` | `3.4.0` | `1.16292` | **+16.3%** (D5 live) |
| after | `^3.5.1` | **`3.7.0`** | `1.04501` | **+4.5%** (≤ +6% budget) |

`npm install` resolved `^3.5.1` to the latest 3.x on npm — **`3.7.0`** (versions
3.5.0/3.5.1/3.6.0/3.7.0 are all published; 3.5.1/3.6.0/3.7.0 each carry the retune,
verified by `npm pack`-ing each and measuring the token peak — all `1.04501`). The
contract's pin is `^3.5.1`; the resolved artifact is 3.7.0 and it builds + gates
clean, so NO conservative pin-down was needed. Lockfile transition is clean (4 lines:
the range + the resolved node 3.4.0→3.7.0; no removed/added top-level deps; the 3
transitive packages npm dropped are glass-ui's own, the demo builds without them).

## Build result post-bump

- `npm run gh-pages` (the demo, which consumes glass-ui Card/dock/LabeledField
  heavily) — **builds clean** ("✓ built in ~1.2s"). The 3.4→3.7 jump shifted NO API
  the demo depends on; the only pre-existing warnings (vueuse `#__PURE__` annotation,
  chunk-size, ineffective-dynamic-import) are unrelated to glass-ui.
- `npm run check` (tsc --noEmit, full project) — **clean, no errors**.

## Gate sweep post-bump (KF_REQUIRE_BROWSER=1)

| gate | verdict | note |
|---|---|---|
| `proof:dock-popover-opens` | PASS | @mbabb popover opens on a trusted click — dock chrome intact through the bump (finalOpen:true) |
| `proof:stage-glass-card` | PASS | all 4 stage scenes resolve ONE glass `<Card>` (radius 16px / blur(12px) / NOT cartoon) — Card surface map unchanged |
| `proof:cartoon-is-panel-depth` | PASS | 6 cartoon Cards resolve `--shadow-cartoon-md` at rest, grow to `-lg` on hover — depth tokens intact |
| `proof:glass-and-cartoon` | **PASS (after consumption fix — see below)** | translucency α=0.5 + backdrop blur live |
| `proof:demo-console-clean` | PASS | no console throw at rest on /#/amiga, /#/easing |
| `proof:scene-machine-irrefragable` | PASS | the FSM round-trips byte-identical across the matrix |
| `proof:deps-current` | PASS | FLOOR bumped to glass-ui≥3.5.1, installed 3.7.0 ≥ floor; registry protocol clean |
| `proof:dock-morph-settled` | PASS | the NEW gate — +4.5% ≤ +6% |
| `proof:chronic-closure` (Lane A) | PASS | resolves `proof:dock-morph-settled` as the D5 HANDOFF-paired born-RED gate |

(Note: `proof:dock-dropdown-opens` named in the lane brief does NOT exist in the repo
— the canonical kf dock-popover gate is `proof:dock-popover-opens`. Swept that.)

## The ONE consumption shift the bump caused — diagnosed + fixed (NOT a workaround)

`proof:glass-and-cartoon` **red on first sweep** with a misleading message ("4 of 4
visible cartoon Cards resolve an OPAQUE background, α > 0.55"). Diagnosis via an
in-browser computed-style probe against the served dist:

```
bg:       oklab(0.985581 0.000689238 0.00159878 / 0.5)   ← α = 0.5 (translucent!)
backdrop: blur(10px) saturate(1.05) brightness(1.02)     ← glass blur LIVE
tier:     quiet                                          ← source correct
```

The glass is **fully intact** — α=0.5, blur live. The ONLY change: glass-ui ≥3.5
resolves the glass-plate background in **`oklab()`** CSS Color 4 syntax where 3.4
emitted `color(srgb … / 0.5)`. The gate's `parseAlpha` (`bgAlphaProbeSource`) handled
`rgba()` and `color(srgb … / α)` but NOT `oklab()`, so it hit the opaque fallthrough
and false-positived α=1.

**Fix (`scripts/proof-glass-and-cartoon.mjs`):** widened `parseAlpha` to read the
trailing slash-alpha of ANY CSS color function (`oklab`/`oklch`/`lab`/`lch`/`hwb`/
`color`/…) via `/\b[a-z]+\([^)]*\/\s*([0-9.]+%?)\s*\)/`. The gate now measures α
regardless of the color space glass-ui chooses — so a future color-syntax re-tune
within the same translucency cannot red the consume-leg. This is the correct
"diagnose + fix the consumption" per the lane brief, NOT a tolerance loosening: the
α=0.55 ceiling, the backdrop≠none requirement, and every BITE the gate forbids are
unchanged. Re-run: PASS (α=0.5 ≤ 0.55, 4 translucent witnesses).

## proof:dock-morph-settled (NEW — the born-RED HANDOFF gate, TOKEN-PEAK form)

`scripts/proof-dock-morph-settled.mjs` — a static gate reading the INSTALLED
`node_modules/@mkbabb/glass-ui/dist/styles/tokens.css`. It locates
`--spring-dock: linear(…)`, parses the leading numeric of every `value percent` stop,
takes the PEAK, and asserts `(peak − 1) ≤ 0.06` (+6% settle budget).

- **Born-RED verified:** feeding the parser the 3.4.0 token body yields peak `1.16292`
  → +16.3% → RED (the born-RED-today proof — D5 was live).
- **Green on the bump:** the installed 3.7.0 token yields peak `1.04501` → +4.5% → PASS.
- **inv-16 honored:** the gate reads node_modules, not a kf file — kf CANNOT satisfy
  it by forking the token; only the consumed glass-ui bump greens it.
- **BITE:** revert `@mkbabb/glass-ui` to `^3.4.0` + re-lock → installed peak re-rises
  to +16.3% > +6% → reds (the consume-leg regressed). Splits clean from D9 (the
  popover-opens half is `proof:dock-popover-opens`, kf SHIP, H.W1 — NOT folded here).

## Wiring

- `package.json`: `optionalDependencies.@mkbabb/glass-ui` `^3.4.0 → ^3.5.1`; new script
  key `proof:dock-morph-settled`; wired into `proof:all` after `proof:dock-popover-opens`.
- `scripts/proof-deps-current.mjs`: FLOOR `@mkbabb/glass-ui` `3.4.0 → 3.5.1` (+ header
  comment). PASS post-bump.
- `.github/workflows/ci.yml`: added the `proof:dock-morph-settled` step in the demo arm
  (static, after `proof:dock-popover-opens`; runs because that arm's `npm ci` installs
  glass-ui); updated the stale `^3.4.0` npm-ci comment to `^3.5.1` BLK-5 consume-leg.

`@playwright/test` was installed `--no-save` for the local browser sweep (mirroring CI
`ci.yml`); package.json + lockfile carry NO playwright entry — the 2-runtime-dep
library posture is preserved.

## Outcome

THE BUMP LEFT THE DEMO GREEN. The dock-lag chronic (D5) closes via the consumed
glass-ui retune, paired with a born-RED-then-green `proof:dock-morph-settled` token
gate. One consumption fix (the `oklab()` parser widening) was required and is a
strict improvement to the gate's color-space robustness.
