# R1-14 — Design Proportionality + Glass Suffusion (visual)

**Lane:** R1-14 · **Prefix:** DP- · **Date:** 2026-07-16 · **Tree:** uncommitted 5.3.5→6.0.0 transaction

## Verdict

The visual proportionality audit is **BLOCKED by a systemic P0**: the running demo (dev server on the
current working tree, glass-ui 7.0.0 in `node_modules`) renders **totally blank on every one of the 7
routes** — no scene subject, no glass cards, no controls, no hero text, no dividers. The only thing that
mounts is the collapsed floating dock pill at top-center. There are, quite literally, **no cards,
components, margins, paddings, or dividing lines to audit** because the entire content subtree fails to
mount. I captured all 7 routes × 2 viewports (14 nonzero PNGs on disk, verified) and probed the live DOM:
every route reports `canvas=0`, `glass-card=0`, body `textLen=0`, and a Vue `pageerror`
`Injection \`Symbol(TooltipProviderContext)\` not found. Component must be used within \`TooltipProvider\``.

I traced the runtime root cause to `EditorShell.vue:30` (a `<Tooltip>` with no ancestor
`<TooltipProvider>`), which mounts on every route including home and takes down the whole stage subtree
under glass-ui 7's reka-ui contract. This is a **runtime** crash mechanism distinct from — and downstream
of — the install-time dependency-graph breakage that lane R1-09 (CT-01/CT-02) already owns. The
source-level design pass I ran as fallback found the demo's spacing system **sound** (well-tokenized, no
ad-hoc px scale), which is the one positive here.

The controls-open state (required by the lane brief) was **unreachable**: the demo never renders any
controls to open. That coverage gap is a direct consequence of the P0, not a lane omission.

---

## DP-01 — Running demo renders blank on all 7 routes; zero cards/content to proportion (P0)

**Severity:** P0 · **Family:** render-crash (gestalt-broken)

**Evidence.** Dev server started exactly per brief
(`npm run dev -- --port 5198 --strictPort`, ready in ~1.5s, `curl` → 200). Captures written to
`docs/tranches/V/audit/design-captures/` (14 PNGs, all nonzero, verified with `ls -la`):
- `home-desktop-default.png` (23253 B) — a single circular glass "home" pill, top-center; rest of the 1280×800 viewport is empty off-white.
- `cube-desktop-default.png` (26741 B) — a lone pill with the tiny cube nav glyph; **no full-viewport cube subject**.
- `easing-mobile-default.png` (17750 B) — at 390×844, only the collapsed easing-glyph pill; the entire stage below is blank.
- same shape for amiga/square/spring/sequence, desktop and mobile.

Live DOM probe (`scratchpad/diag2.mjs`, 3.5 s settle per route) — every route:
```
/#/          appKids=1 canvas=0 cards=0 docks=1 textLen=0 err=[Injection `Symbol(TooltipProviderContext)` not found...]
/#/cube      appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[Injection `Symbol(TooltipProviderContext)` not found...]
/#/easing    appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[...]
/#/spring    appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[...]
/#/sequence  appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[...]
/#/square    appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[...]
/#/amiga     appKids=2 canvas=0 cards=0 docks=2 textLen=0 err=[...]
```
The `#app` element's only children are two 56×56 `.glass-dock` pills (Scene dock + @mbabb menu). The
`EditorShell` stage, every scene component, and every controls surface are absent. Reproduced 3× across
separate runs with 2.5–4 s settle; not a settle-timing artifact.

**Design consequence.** The lane's entire subject matter — card proportion, hierarchy, margins,
paddings, dividers, small-control legibility at 390px, duplicate vs missing affordances — cannot be
assessed because none of it renders. The demo as it stands is a blank page with one floating pill: the
single most severe possible violation of "grand glass-ui suffusion / Aristotelian proportion." If this
transaction ships, keyframes.babb.dev serves a blank demo.

**Disposition — BUILD (transaction-blocking).** This must be red-gated and fixed before any V close
claims the 6.0.0 demo renders. See DP-02 for the concrete fix. A runtime render-assert (the demo-smoke
step-5 "#app gains non-trivial children + hero text renders" check) should be run against this tree, not
only the built dist — see DP-03.

---

## DP-02 — Root cause: `EditorShell.vue:30` `<Tooltip>` has no root `<TooltipProvider>` under glass-ui 7 (P0)

**Severity:** P0 · **Family:** provider-context-missing (demo-owned, NOT glass-root)

**Evidence.** The throwing surface is a glass-ui 7 `Tooltip` (a reka-ui `TooltipRoot`) rendered with no
`TooltipProvider` ancestor:
- `demo/components/instrument/shell/EditorShell.vue:30-43` renders `<Tooltip><TooltipTrigger as-child><Button .../></TooltipTrigger><TooltipContent>Keyboard shortcuts (?)</TooltipContent></Tooltip>`, importing `import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip"` (`EditorShell.vue:125`).
- `EditorShell` is mounted at the App root **for every route** (`demo/app/App.vue:26`, `:show-start-screen="isHome"`), so its tooltip mounts on home too — matching the crash appearing on `/#/`.
- There is **no root-level `TooltipProvider`**: `grep -n "Tooltip\|Provider" demo/app/App.vue` → no matches; `demo/app/main.ts` only does `createApp(App)` + `app.use(router)` (`main.ts:32-33`). The demo scatters `TooltipProvider` into two *deep* components only — `AnimationControlsGroup.vue:2` and `channel-controls/ChannelControls.vue:2` — neither of which is an ancestor of EditorShell's own tooltip.
- Under glass-ui 7.0.0 (`node_modules/@mkbabb/glass-ui/package.json` → `7.0.0`), a `Tooltip`/`TooltipRoot` injects `TooltipProviderContext` and throws when unprovided. The Vue render error unmounts the whole EditorShell subtree → the blank stage in DP-01.

**Why demo-owned, not glass-root.** Requiring a `TooltipProvider` ancestor is the standard reka-ui/
glass-ui contract; glass-ui exposes `TooltipProvider` from its barrel for exactly this. The regression is
that the demo upgraded its consumed glass-ui (to 7) without adding the one root provider the new contract
requires. The fix belongs in the demo, per the "no local patches to glass-ui" edict.

**Disposition — BUILD (transaction-blocking).** Add a single `<TooltipProvider>` at the App root
wrapping both `<ChromeDock>` and `<EditorShell>` in `demo/app/App.vue` (delay/skip-delay to taste), and
remove the two scattered deep providers as redundant. This restores every scene's render in one edit.
Pair with R1-09/CT-01's manifest fix (re-pin glass-ui) so a clean `npm ci` even installs the package.

---

## DP-03 — Render crash emits ZERO `console.error`; console-error-keyed capture/gates pass over the blank demo (P2)

**Severity:** P2 · **Family:** gate-blindspot (masked-fallback)

**Evidence.** My first capture pass tracked `page.on("console", m => m.type()==="error")` and reported
**0 console errors for all 14 captures** — while the demo was fully blank. The failure only surfaced once
I added `page.on("pageerror", ...)`: it is a Vue *render/pageerror*, not a `console.error`. Any demo
smoke/observe gate that asserts only "zero console errors during mount" (e.g. the console-budget lane
and `scripts/observe/demo/smoke.mjs` step 7) would report green over this blank build. The demo-smoke
step-5 assert ("`#app` gains non-trivial children AND hero text renders") *would* catch it — but it runs
against the built `dist/gh-pages` under `KF_REQUIRE_BROWSER`, not against the working-tree dev server,
and is browser-gated (skips when playwright is unresolved). This is the exact "green source-shape gate
misses appearance/interaction/state" blind-spot in memory's Gate blind-spots feedback.

**Disposition — FOLD into the V gate-soundness wave (cross-ref R1-02).** Make at least one runtime
demo-render assert track Vue `pageerror` in addition to `console.error`, and ensure a render-shape assert
(`appKids`/hero-text/`glass-card` count) runs on the deploy tree, not only on a pre-built dist.

---

## Negatives (checked and found sound)

- **Spacing rhythm / ad-hoc px scale — SOUND.** `grep -rn --include="*.vue" -E "(padding|margin|gap):[[:space:]]*[0-9]+px" demo/` → **1** hit only (`channel-controls/ChannelOptions.vue:572` `padding: 2px`). Arbitrary Tailwind px brackets (`p-[13px]`, `gap-[..px]`, etc.) → **0**. The demo is genuinely tokenized/utility-class-driven; there is no sprawling ad-hoc pixel spacing scale to challenge. (This is the one design dimension auditable at source level while the render is down.)
- **Icon/glyph system — SOUND (structurally).** Scene glyphs are inline `<svg>` SFCs via `?component` with a coverage gate forcing every non-home descriptor to carry an `icon` (`scenes.ts:73-93`); the collapsed-dock glyphs render correctly in every capture (cube/amiga/easing glyphs visible), so the icon pipeline itself is intact even though the stage is not.
- **Capture integrity — SOUND.** All 14 declared PNGs exist on disk and are nonzero (23–29 KB desktop, 15–21 KB mobile); no declared-but-missing captures.

## Coverage gaps

- **Controls-open state: UNREACHABLE.** The lane brief asks for one opened-controls capture per scene. No controls surface renders (DP-01), so no controls-open state exists to capture. This is a consequence of the P0, not a lane omission; re-run this lane after DP-02 is fixed to obtain the controls-open captures and do the actual card/hierarchy/divider proportionality pass.
- **Runtime card/hierarchy/divider/legibility audit: BLOCKED.** Card proportion, dividing-line proliferation, small-control legibility at 390px, and duplicate-vs-missing affordances cannot be judged from a blank render. Only the source-level tokenization negative above is available. The visual half of this lane must be re-flown post-fix.
- **Production-build parity NOT run.** I did not `npm run build` to check whether the built `dist` reproduces the crash (time + the undeclared-glass-ui install risk). The dev-tree crash is fully confirmed; build parity is deferred to the gate-soundness lane which owns the dist path.
- **Cross-lane overlap.** The install-time dependency mechanism (glass-ui dropped from manifest+lock; installed 7.0.0 is a registry-absent phantom) is owned by **R1-09 CT-01/CT-02** — I do not re-claim it. DP-02 contributes the *runtime* crash mechanism (missing root TooltipProvider) that R1-09 does not cover: even with 7.0.0 present, the demo cannot render.
