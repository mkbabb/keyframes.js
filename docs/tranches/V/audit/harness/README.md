# V.W1 render-truth harness

The deterministic, re-runnable **route × viewport render-truth gate** for Tranche
V, wave W1. One instrument closes W1, feeds W9's MR1, and re-runs at W11.

## What it asserts

The W1 **hard gate**, live against the prepared Glass-7 demo:

> `pageerror == 0` **AND** zero literal `[object Object]` text nodes,
> on all **7 routes** × **{1280×800, 390×844}**.

Per route × viewport the harness:

- collects `page.on('pageerror')` and console errors,
- waits for render to settle (the lazy scene chunk + the scene's animation setup
  fire — that is where the masked `timingFunction` pageerrors throw),
- walks **every** text node and counts the literal `[object Object]`,
- screenshots to `captures/<route>-<w>.png`,
- records a render-shape probe (`appKids/canvas/mains/textLen`) so a blank route
  is legible in the JSON.

It writes `captures/summary.json` and **exits 0 iff** `pageerror==0` and
`objectObject==0` across every combo (console errors are recorded, not gated —
exactly the hard-gate condition). RED → exit 1; harness fault → exit 2.

The 7 routes are single-sourced from the demo scene registry
(`demo/app/scene/scenes.ts`): `home` (`/`), `cube`, `amiga`, `square`, `easing`,
`spring`, `sequence`.

## Running it

```sh
node render-truth.mjs
```

It resolves `playwright-core` and starts the vite dev server **from the audit
copy** (the live probe target with fresh `@mkbabb/glass-ui` swapped in). It
launches system Chrome via playwright's `channel:"chrome"` (the pinned bundled
chromium revision is absent from the local cache — the audit's working pattern).
It **never installs anything**: an install-class npm op silently deletes the
glass linkage in the copy (documented incident, `../GLASS-AUDIT-LINKAGE.md`).

If a dev server already answers on the port it **attaches** (and leaves it
running); otherwise it spawns vite and tears it down on exit.

### Env overrides

| var | default | meaning |
|---|---|---|
| `KF_AUDIT_COPY` | the session scratchpad copy | absolute path to the audit copy |
| `KF_DEV_PORT` | `5271` | **dedicated** dev-server port (a foreign app on it would be probed by mistake) |
| `KF_SETTLE_MS` | `3000` | per-route settle wait |
| `KF_CHROME_CHANNEL` | `chrome` | playwright launch channel |

## The born-RED witness

`W1-red-witness.log` + the `captures/` set record the harness run against the
**unfixed** transaction (the AUDIT-PROBE `TooltipProvider` reverted out of
`demo/app/App.vue`, restoring the shipping demo shape). The result:

- **14/14 combos RED**, every route **blank** (`canvas=0, main=0, text=0`,
  `appKids` collapsed to 1 on home / 2 on scenes),
- the **sole** pageerror on every combo:
  `` Injection `Symbol(TooltipProviderContext)` not found. Component must be used within `TooltipProvider` `` —
  the missing root provider (DP-02 / FAM-02),
- `objectObject == 0` (nothing renders, so the FE-3 spring labels and the masked
  easing throws cannot surface — they hide behind the blank),
- one out-of-scope `404` console error on home.

Totals: `pageerror=38, objectObject=0` → **RED (exit 1)**.

> For reference, the harness run against the **patched** copy (TooltipProvider
> present, routes rendering) is RED for a different reason — it surfaces the
> masked defects the blank hid: the `bounceInEase` / anonymous-fn
> `timingFunction` pageerrors on cube/amiga/square/easing/spring (EE-01/EE-02)
> **and** the 10 `[object Object]` spring labels per viewport (FE-3). Both defect
> classes are caught by this one instrument.

V.W1.a applies the five scoped demo fixes and re-runs this harness **green**.
