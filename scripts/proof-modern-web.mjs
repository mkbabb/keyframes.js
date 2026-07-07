#!/usr/bin/env node
/**
 * proof:modern-web — the E.W4 falsifiable close (modern-web alignment).
 *
 * E.W4 aligned the demo to the installed `modern-web-guidance` corpus across a
 * small set of net-NEW levers (the cold paint was already good; the honest
 * opportunity was the editing surface + the modern-web items that REMOVE
 * hand-rolled work). This instrument is the re-runnable form of "those levers
 * are present and have not regressed": each clause is a real `grep` over demo
 * SOURCE or a bundle-graph probe over a fresh `npm run gh-pages` build, NOT an
 * assertion. A clause reds the moment its lever regresses.
 *
 * The clauses (the §S7 gate, reconciled with what E.W11 already landed):
 *
 *   1. proof:mwg-installed    — the guidance corpus is on disk
 *                               (`.agents/skills/modern-web-guidance/guides/`).
 *   2. proof:monaco-deferred  — Monaco is OFF the eager graph: the source carries
 *                               NO static `import * as monaco` (the namespace is a
 *                               dynamic `import("monaco-editor")`), AND a bundle
 *                               probe over dist/gh-pages asserts ZERO chunk
 *                               statically imports the `vendor-monaco` chunk —
 *                               so no non-editor scene's initial graph carries it.
 *   3. proof:font-preload     — index.html preloads the above-the-fold heading
 *                               face (`rel=preload as=font ... crossorigin`).
 *   4. proof:demo-yield       — the heavy demo parse/format edit path yields via
 *                               the engine's OWN `yieldToMain` (one yield ladder,
 *                               no second hand-rolled one).
 *   5. proof:loop-yield       — the scene render loop pauses off-tab/off-screen
 *                               (rides vueuse `useDocumentVisibility` via
 *                               `useSceneVisibilityPause` — landed E.W11 S6 B-3,
 *                               verified here, NOT re-implemented).
 *   6. proof:hover-warmup     — scene routes warm their dynamic-import chunk on
 *                               pointer-enter of the dock nav target (the SPA
 *                               Vite warmup, NOT Speculation Rules).
 *   7. proof:checklist        — the §S6 modern-web checklist is fully
 *                               dispositioned (every row ALIGNED / OUT /
 *                               N-A-with-reason), surfaced from a checked-in
 *                               manifest so a reviewer sees the score in CI log.
 *
 * The bundle probe (clause 2) needs a build; if dist/gh-pages is absent the gate
 * tells you to run `npm run gh-pages` and exits non-zero (it must not silently
 * skip the dominant lever's proof). The corpus check (clause 1) is a dev-env
 * artifact under `.agents/` (a gitignore candidate per E.W4 §0); CI that has not
 * run `npx modern-web-guidance@latest install` sets KF_MWG_OPTIONAL=1 to downgrade
 * it to a warning — every OTHER clause still BITES.
 *
 * Mutation tests (each clause must BITE, not merely log):
 *   • re-add `import * as monaco` at top level → clause 2 source-grep reds; and a
 *     rebuild re-introduces the static `vendor-monaco` edge → clause 2 probe reds.
 *   • drop the `<link rel=preload as=font>` → clause 3 reds.
 *   • remove `yieldToMain` from useKeyframeOps → clause 4 reds.
 *   • remove `useSceneVisibilityPause` from the amiga loop → clause 5 reds.
 *   • remove `@pointerenter="emit('warmScene'...)"` → clause 6 reds.
 *
 * Usage:
 *   node scripts/proof-modern-web.mjs
 *   KF_MWG_OPTIONAL=1   downgrade the corpus-on-disk clause to a warning (CI w/o install)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const read = (rel) => {
    const p = path.join(REPO, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
};

const failures = [];
const warnings = [];
const passes = [];
const pass = (id, msg) => passes.push(`${id}: ${msg}`);
const fail = (id, msg) => failures.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

// ── clause 1: proof:mwg-installed ────────────────────────────────────────────
// The guidance corpus on disk. Symlinked under .claude/skills for Claude Code,
// real tree under .agents/skills. Either path counting > 0 guide files passes.
{
    const id = "proof:mwg-installed";
    const candidates = [
        ".agents/skills/modern-web-guidance/guides",
        ".claude/skills/modern-web-guidance/guides",
    ];
    let found = null;
    for (const c of candidates) {
        const abs = path.join(REPO, c);
        if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
            const n = walkCount(abs);
            if (n > 0) {
                found = { c, n };
                break;
            }
        }
    }
    if (found) {
        pass(id, `${found.n} guide file(s) on disk (${found.c}).`);
    } else if (process.env.KF_MWG_OPTIONAL) {
        warn(
            id,
            "guidance corpus absent — run `npx --yes modern-web-guidance@latest install` " +
                "(downgraded to a warning by KF_MWG_OPTIONAL; it is a dev-env artifact under .agents/).",
        );
    } else {
        fail(
            id,
            "guidance corpus absent at .agents/skills/modern-web-guidance/guides — run " +
                "`npx --yes modern-web-guidance@latest install` (or set KF_MWG_OPTIONAL=1 in a CI " +
                "lane that does not install it).",
        );
    }
}

function walkCount(dir) {
    let n = 0;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) n += walkCount(p);
        else n += 1;
    }
    return n;
}

// ── clause 2: proof:monaco-deferred ──────────────────────────────────────────
// (a) SOURCE: CSSCodeEditor must NOT carry a static `import * as monaco` — the
//     namespace must be a dynamic `import("monaco-editor")`.
// (b) BUNDLE: over a fresh build, NO emitted chunk may statically import the
//     `vendor-monaco` chunk (`from"./vendor-monaco-*.js"`). A dynamic
//     `import("./vendor-monaco-*.js")` is exactly what we WANT and is allowed.
{
    const id = "proof:monaco-deferred";
    const editorRel =
        "demo/@/components/custom/instrument/keyframes/CSSCodeEditor.vue";
    const src = read(editorRel);
    if (src == null) {
        fail(id, `${editorRel} not found.`);
    } else {
        // The eager edge: a top-level `import * as monaco from "monaco-editor"`.
        // A type-only `import type * as Monaco` is erased and allowed.
        const staticNs =
            /^\s*import\s+\*\s+as\s+\w+\s+from\s+["']monaco-editor["']/m.test(
                src,
            );
        const dynamicNs = /import\(\s*["']monaco-editor["']\s*\)/.test(src);
        // The `?worker` entries must NOT be top-level static imports either — a
        // static `?worker` re-eagerizes the vendor-monaco chunk it should defer.
        const staticWorker =
            /^\s*import\s+\w+\s+from\s+["']monaco-editor\/[^"']*\?worker["']/m.test(
                src,
            );
        if (staticNs) {
            fail(
                id,
                `${editorRel} carries a top-level static \`import * as monaco\` — ` +
                    `it must be a dynamic \`import("monaco-editor")\` at mount.`,
            );
        } else if (!dynamicNs) {
            fail(
                id,
                `${editorRel} has neither a static namespace nor a dynamic ` +
                    `\`import("monaco-editor")\` — the deferred boot is missing.`,
            );
        } else if (staticWorker) {
            fail(
                id,
                `${editorRel} statically imports a \`?worker\` entry — a static ` +
                    `?worker re-introduces the vendor-monaco static edge; import ` +
                    `the workers dynamically inside the boot.`,
            );
        } else {
            pass(
                id,
                "CSSCodeEditor source: Monaco namespace + workers are dynamic-imported (no static edge).",
            );
        }

        // The bundle probe — the falsifiable form of "vendor-monaco is off every
        // initial graph". Requires a build.
        if (!fs.existsSync(path.join(DIST, "index.html"))) {
            fail(
                `${id} (bundle)`,
                "dist/gh-pages not built — run `npm run gh-pages` before this gate so the " +
                    "vendor-monaco static-edge probe can run (the dominant lever's proof).",
            );
        } else {
            const assets = path.join(DIST, "assets");
            const jsFiles = fs.existsSync(assets)
                ? fs.readdirSync(assets).filter((f) => f.endsWith(".js"))
                : [];
            const monacoChunk = jsFiles.find((f) =>
                /^vendor-monaco-[A-Za-z0-9_]+\.js$/.test(f),
            );
            if (!monacoChunk) {
                fail(
                    `${id} (bundle)`,
                    "no `vendor-monaco-*.js` chunk in the build — Monaco failed to split into its " +
                        "own chunk (the worker/namespace imports may have collapsed into an entry).",
                );
            } else {
                // A STATIC import edge is `from"./vendor-monaco-*.js"`. Match the
                // exact chunk name. Dynamic `import("./vendor-monaco-*.js")` is
                // NOT this pattern and is allowed (it IS the deferral).
                const staticRe = new RegExp(
                    `from\\s*["']\\./${monacoChunk.replace(/\./g, "\\.")}["']`,
                );
                const offenders = [];
                for (const f of jsFiles) {
                    if (f === monacoChunk) continue;
                    const body = fs.readFileSync(path.join(assets, f), "utf8");
                    if (staticRe.test(body)) offenders.push(f);
                }
                if (offenders.length > 0) {
                    fail(
                        `${id} (bundle)`,
                        `${offenders.length} chunk(s) STATICALLY import ${monacoChunk} ` +
                            `(${offenders.join(", ")}) — a non-editor scene's initial graph ` +
                            `still eagerly pulls Monaco. Break the static edge (the ?worker ` +
                            `imports must be dynamic too).`,
                    );
                } else {
                    pass(
                        `${id} (bundle)`,
                        `0 chunks statically import ${monacoChunk} — Monaco rides only the ` +
                            `dynamic editor-mount boundary.`,
                    );
                }
            }
        }
    }
}

// ── clause 3: proof:font-preload ─────────────────────────────────────────────
// The above-the-fold heading face is preloaded `as=font ... crossorigin`.
{
    const id = "proof:font-preload";
    const html = read("demo/app/index.html");
    if (html == null) {
        fail(id, "demo/app/index.html not found.");
    } else {
        // Isolate the <link> tag carrying `as="font"` (attributes may span
        // multiple lines — `[^>]` matches newlines), then check it is a preload
        // with crossorigin. Order-independent: each attribute is matched within
        // the SAME tag block, not across the whole document.
        const fontLink = html.match(/<link\b[^>]*\bas=["']font["'][^>]*>/i)?.[0];
        const isPreload =
            fontLink != null && /\brel=["']preload["']/i.test(fontLink);
        const hasCrossorigin =
            fontLink != null && /\bcrossorigin\b/i.test(fontLink);
        if (!isPreload) {
            fail(
                id,
                "no `<link rel=preload as=font ...>` in index.html — the above-the-fold " +
                    "heading face (Instrument Serif) is not preloaded (C4 font lever).",
            );
        } else if (!hasCrossorigin) {
            fail(
                id,
                "the font preload is missing `crossorigin` — a font fetch is CORS-anonymous; " +
                    "without it the preload double-fetches.",
            );
        } else {
            pass(id, "index.html preloads the heading face (as=font, crossorigin).");
        }
    }
}

// ── clause 4: proof:demo-yield ───────────────────────────────────────────────
// The heavy demo parse/format edit op yields via the engine's yieldToMain.
{
    const id = "proof:demo-yield";
    const opsRel =
        "demo/@/components/custom/instrument/keyframes/composables/useKeyframeOps.ts";
    const src = read(opsRel);
    if (src == null) {
        fail(id, `${opsRel} not found.`);
    } else {
        // The op MUST name the engine's OWN `yieldToMain`. Two equivalent
        // surfaces satisfy this: the static deep `@src/animation/internal/
        // scheduler` import (the original form) OR — post-L.W8 S1 dogfood
        // inversion — a destructure off the HEAVY `loadAnimationEngine()`
        // surface (`yieldToMain: typeof yieldToMainImpl` in load-engine.ts).
        // The inversion routes it through the lazy engine chunk on PURPOSE: a
        // static deep `@src/animation/engine`+`/internal/scheduler` import (the
        // pre-W8 form) would eagerly pull the HEAVY engine + value.js into the
        // demo's static graph — defeating the static/dynamic boundary the
        // architecture enforces. Either form is the ONE engine yield ladder;
        // the hand-rolled guard below still bites a second ladder.
        const imports =
            /import\s*\{[^}]*\byieldToMain\b[^}]*\}\s*from\s*["']@src\/animation\/internal\/scheduler["']/.test(
                src,
            ) ||
            /\{[^}]*\byieldToMain\b[^}]*\}\s*=\s*await\s+loadAnimationEngine\s*\(\s*\)/.test(
                src,
            );
        const calls = /\byieldToMain\s*\(\s*\)/.test(src);
        // Guard against a second hand-rolled yield ladder in demo code (the
        // gestalt mandate: ONE yield ladder, the engine's — no demo-local
        // scheduler.yield/postTask re-implementation).
        const handRolled =
            /\bscheduler\.yield\s*\(/.test(src) ||
            /\bnavigator\?\.scheduling\b/.test(src) ||
            /\bpostTask\s*\(/.test(src);
        if (!imports || !calls) {
            fail(
                id,
                `${opsRel} does not import + call the engine's \`yieldToMain\` — the heavy ` +
                    `parse→compile edit path must yield (reuse \`@src/animation/internal/scheduler\`).`,
            );
        } else if (handRolled) {
            fail(
                id,
                `${opsRel} hand-rolls a second yield ladder (scheduler.yield/postTask) — reuse ` +
                    `ONLY the engine's \`yieldToMain\` (one ladder in the codebase).`,
            );
        } else {
            pass(
                id,
                "the heavy parse→compile edit op yields via the engine's yieldToMain (one ladder).",
            );
        }
    }
}

// ── clause 5: proof:loop-yield ───────────────────────────────────────────────
// The scene render loop pauses off-tab/off-screen (landed E.W11 S6 B-3 — the
// vueuse useDocumentVisibility gate via useSceneVisibilityPause; verified here).
{
    const id = "proof:loop-yield";
    const composableRel = "demo/app/runtime/useSceneVisibilityPause.ts";
    const amigaRel = "demo/scenes/amiga/AmigaScene.vue";
    const composable = read(composableRel);
    const amiga = read(amigaRel);
    if (composable == null) {
        fail(id, `${composableRel} not found — the off-tab loop gate is missing.`);
    } else if (!/\buseDocumentVisibility\b/.test(composable)) {
        fail(
            id,
            `${composableRel} does not ride vueuse \`useDocumentVisibility\` — the loop gate must ` +
                `be a vueuse listener, not a raw addEventListener (proof:brittleness clause 4).`,
        );
    } else if (amiga == null || !/\buseSceneVisibilityPause\s*\(/.test(amiga)) {
        fail(
            id,
            `${amigaRel} does not wire \`useSceneVisibilityPause\` — the Three.js present loop is ` +
                `not gated off-tab.`,
        );
    } else {
        pass(
            id,
            "the scene render loop pauses off-tab via vueuse useDocumentVisibility (E.W11 S6 B-3).",
        );
    }
}

// ── clause 6: proof:hover-warmup ─────────────────────────────────────────────
// Scene routes warm their dynamic-import chunk on pointer-enter of the dock nav.
{
    const id = "proof:hover-warmup";
    const scenesRel = "demo/app/scene/scenes.ts";
    const dockRel = "demo/app/dock/ChromeDock.vue";
    const appRel = "demo/app/App.vue";
    const scenesSrc = read(scenesRel);
    const dockSrc = read(dockRel);
    const appSrc = read(appRel);
    const hasWarmFn =
        scenesSrc != null && /export\s+function\s+warmScene\b/.test(scenesSrc);
    // The handler value carries a nested quote (`emit('warmScene', …)`), so match
    // a `@pointerenter=` attribute whose value (up to the line end) names warmScene
    // rather than a quote-balanced capture.
    const dockEmits =
        dockSrc != null &&
        /@pointerenter\s*=\s*["'][^\n]*warmScene/.test(dockSrc);
    const appWired =
        appSrc != null &&
        /warmScene/.test(appSrc) &&
        /@warm-scene\s*=/.test(appSrc);
    if (!hasWarmFn) {
        fail(
            id,
            `${scenesRel} has no exported \`warmScene\` — the SPA route-chunk warmup is missing.`,
        );
    } else if (!dockEmits) {
        fail(
            id,
            `${dockRel} does not warm a scene on \`@pointerenter\` — the dock nav target must ` +
                `fire the warmup on hover.`,
        );
    } else if (!appWired) {
        fail(
            id,
            `${appRel} does not wire the dock's \`@warm-scene\` to \`warmScene\` — the warmup ` +
                `event is unhandled.`,
        );
    } else {
        pass(
            id,
            "scene routes warm their dynamic-import chunk on dock pointer-enter (SPA Vite warmup).",
        );
    }
}

// ── clause 7: proof:checklist — the §S6 modern-web re-score ───────────────────
// A checked-in manifest of EVERY checklist row's disposition. The gate asserts
// no row is left un-dispositioned, and surfaces the score in the CI log. Rows
// dispositioned ALIGNED carry a live source anchor the gate re-confirms; OUT /
// N-A rows carry the recorded reason. (The View-Transitions row is ALIGNED — it
// LANDED in E.W11 S2: `useSceneTransition` + `view-transition-name` in App.vue,
// correcting W4.md's stale "recorded-withheld" framing for that row.)
{
    const id = "proof:checklist";
    // Each row: { code, axis, disposition, anchor?, reason? }. ALIGNED rows with
    // an `anchor` (file + substring) are re-confirmed live; OUT/N-A carry reason.
    const CHECKLIST = [
        {
            code: "C1",
            axis: "INP / scheduler.yield (demo edit path)",
            disposition: "ALIGNED",
            anchor: {
                file: "demo/@/components/custom/instrument/keyframes/composables/useKeyframeOps.ts",
                needle: "yieldToMain",
            },
        },
        {
            code: "C2",
            axis: "LCP — font preload + metric-matched fallback",
            disposition: "ALIGNED",
            anchor: { file: "demo/app/index.html", needle: 'as="font"' },
        },
        {
            code: "C3",
            axis: "content-visibility off-screen scenes",
            disposition: "N-A-with-reason",
            reason:
                "MEASURE-FIRST WITHHELD: exactly ONE scene is mounted at a time (keyed <Suspense>, " +
                "no KeepAlive — inactive scenes are UNMOUNTED, not off-screen), and the single live " +
                "scene host is full-viewport ABOVE-the-fold. The guide forbids content-visibility:auto " +
                "on above-the-fold content (performance.md). The off-screen heavy-block precondition " +
                "the lever needs does not exist in this SPA; E.W11 S6 B-2 already uses " +
                "content-visibility:hidden to CACHE the inactive Monaco pane (a different, correct use). " +
                "No measured win is available, so the perf claim is not shipped (the mandate forbids it).",
        },
        {
            code: "C4",
            axis: "fonts — preload + non-blocking + preconnect",
            disposition: "ALIGNED",
            anchor: { file: "demo/app/index.html", needle: 'rel="preload"' },
        },
        {
            code: "C5",
            axis: "next-nav — SPA route-chunk warmup (NOT Speculation Rules)",
            disposition: "ALIGNED",
            anchor: { file: "demo/app/scene/scenes.ts", needle: "warmScene" },
        },
        {
            code: "C6",
            axis: "Interest Invokers (hover-preview)",
            disposition: "N-A-with-reason",
            reason:
                "Chrome/Edge 142 only, no Firefox/Safari, needs a polyfill not worth the weight for a " +
                "demo; reka-ui tooltips (glass-ui) already cover hover-preview. RECORDED.",
        },
        {
            code: "H1/H2",
            axis: "native <dialog>/Popover/Invoker",
            disposition: "OUT",
            reason:
                "glass-ui's reka-ui dialogs render a role-div + JS FocusScope (DialogContentImpl), NOT " +
                "native <dialog>/Popover. The 'verify reka-ui rides native' check resolves NEGATIVE; " +
                "migrating reka-ui→native is glass-ui/reka-ui's seam (inv-16) — the demo only consumes " +
                "the published component. OUT.",
        },
        {
            code: "H3",
            axis: "HTML semantics (lang/viewport/h1/landmarks/type=module)",
            disposition: "ALIGNED",
            anchor: { file: "demo/app/index.html", needle: 'lang="en"' },
        },
        {
            code: "CSS1",
            axis: ":has() parent-state styling",
            disposition: "N-A-with-reason",
            reason:
                "modern-web-findings D-10 scored this ALIGNED on tranche-d-impl, but the E.W1–W11 demo " +
                "refactors removed the CSS `:has()` sites (the patterns that used it were restructured); " +
                "a current grep finds only JS `Map.has()`. The guide presents `:has()` as an ALTERNATIVE " +
                "to JS class-toggling, not a requirement — the demo's current components do not need it. " +
                "NOT a regression E.W4 introduced; re-scored N-A (no live `:has()` site, none required).",
        },
        {
            code: "CSS2",
            axis: "container queries (cqw/@container)",
            disposition: "ALIGNED",
            anchor: { file: "demo/@/styles/style.css", needle: "container-type" },
        },
        {
            code: "CSS3",
            axis: "dvh over vh",
            disposition: "N-A-with-reason",
            reason:
                "OWNED BY E.W3 (the styling lane reconciles the --panel-max-h vh↔dvh call); modern-web " +
                "confirms the existing call. Recorded cross-wave so E.W3 and E.W4 do not fork it.",
        },
        {
            code: "CSS4",
            axis: "color-mix / oklab",
            disposition: "ALIGNED",
            anchor: { file: "demo/scenes/easing/EasingTarget.vue", needle: "color-mix" },
            note:
                "the engine also interpolates color in oklab by default (reference impl, modern-web D-11).",
        },
        {
            code: "CSS6",
            axis: "linear() physics easing",
            disposition: "ALIGNED",
            reason:
                "the engine exports springLinearStops()/springTimingFunction(); the spring scene + " +
                "glass-ui consume it (reference impl — modern-web E-4).",
        },
        {
            code: "CSS7",
            axis: "prefers-reduced-motion (per-case, not global 0.01ms)",
            disposition: "ALIGNED",
            reason:
                "the engine's ONE reduced-motion gate (internal/reduced-motion.ts) snaps per-case; the " +
                "View-Transition PRM degrade rides glass-ui's view-transition.css (reference impl — E-2).",
        },
        {
            code: "UX1",
            axis: "View Transitions for scene-swap",
            disposition: "ALIGNED",
            anchor: { file: "demo/app/App.vue", needle: "view-transition-name" },
            note:
                "LANDED in E.W11 S2 (useSceneTransition + view-transition-name on .scene-host, PRM-gated " +
                "via glass-ui view-transition.css, focus routed on finished). Corrects W4.md's stale " +
                "'recorded-withheld' framing for this row.",
        },
        {
            code: "C5b/Speculation",
            axis: "Speculation Rules",
            disposition: "N-A-with-reason",
            reason:
                "SPA-EXCLUDED: the guide states 'DO NOT use speculation rules on SPAs' (they fire on " +
                "document navigation, which an SPA never does). The SPA-appropriate primitive is the " +
                "Vite route-chunk warmup (C5, ALIGNED), which E.W4 landed.",
        },
        {
            code: "SEC1",
            axis: "CSP / security headers",
            disposition: "N-A-with-reason",
            reason:
                "static GitHub-Pages SPA — no server to set response headers; the only surface is an " +
                "OPTIONAL <meta>-CSP, LOW-value given Lighthouse Best-Practices = 100 on every report. " +
                "RECORDED; not a forced line item.",
        },
        {
            code: "SEC2",
            axis: "dangerous DOM sinks (demo)",
            disposition: "ALIGNED",
            reason:
                "Vue <script setup> templates auto-escape; the CSS-paste flow routes through the engine " +
                "parser, not a DOM sink. No v-html/innerHTML untrusted path (modern-web D-15).",
        },
        // G.W14 — three post-F catalog levers (the corpus grew since F authored
        // the checklist). Each re-scores N-A/OUT — none is a SHIP, ZERO demo
        // pixels move. The live Baseline strings (modern-web-guidance retrieve)
        // are quoted in each reason so a reviewer can re-confirm (r-modern-web
        // MW-NEW-1/2/3).
        {
            code: "NEW1/sibling-index",
            axis: "sibling-index()/sibling-count() (pure-CSS stagger)",
            disposition: "N-A-with-reason",
            reason:
                "NOT Baseline — 'sibling-count() and sibling-index() has limited availability. " +
                "Unsupported in: Firefox.' The demo's per-word animationDelay (AnimatedText.vue) is a " +
                "Vue v-for-index binding that works on ALL engines; swapping to sibling-index() would " +
                "BREAK the stagger on Firefox (instant fallback = all-words-at-once) for a " +
                "declarativeness gain only — a not-Baseline regression of a working surface the mandate " +
                "forbids. The engine's stagger is the strictly-more-general JS primitive over arbitrary " +
                "targets (no engine threat). Revisit when Firefox ships it (r-modern-web MW-NEW-1).",
        },
        {
            code: "NEW2/custom-highlight",
            axis: "Custom Highlight API (::highlight() arbitrary text ranges)",
            disposition: "N-A-with-reason",
            reason:
                "Baseline — 'Custom highlights: Newly available. Baseline since 2026-03-24' — BUT no " +
                "clean keyframes-demo fit. The one plausible surface (highlighting matched ranges in the " +
                "CSS-paste / Monaco editor) is OWNED by Monaco's own decorations API; there is no honest " +
                "demo seam where the API removes hand-rolled work, so adopting it would be gold-plating a " +
                "lever with no home (r-modern-web MW-NEW-2).",
        },
        {
            code: "NEW3/dialog-closedby",
            axis: "<dialog closedby> (declarative light-dismiss)",
            disposition: "OUT",
            reason:
                "NOT Baseline — '<dialog closedby> has limited availability. Unsupported in: Safari.' AND " +
                "double-disqualified: the demo's only modal (KeyboardShortcutsModal.vue) is a reka-ui " +
                "<Dialog> (a role-div + JS FocusScope, NOT a native <dialog>), so the closedby attribute " +
                "has no surface on the role-div; migrating reka-ui→native is a glass-ui/reka-ui seam (the " +
                "existing H1/H2 OUT logic, inv-16). OUT (r-modern-web MW-NEW-3).",
        },
    ];

    const DISPOSITIONS = new Set(["ALIGNED", "OUT", "N-A-with-reason"]);
    let rowFail = false;
    for (const row of CHECKLIST) {
        if (!DISPOSITIONS.has(row.disposition)) {
            fail(
                id,
                `row ${row.code} (${row.axis}) is un-dispositioned ("${row.disposition}").`,
            );
            rowFail = true;
            continue;
        }
        // ALIGNED rows with a live anchor must re-confirm the anchor exists, so a
        // future deletion of the lever reds the checklist (not just the dedicated
        // clause). Optional anchors only warn (the substring may live in a
        // co-located partial the gate does not pin).
        if (row.disposition === "ALIGNED" && row.anchor) {
            const body = read(row.anchor.file);
            const present = body != null && body.includes(row.anchor.needle);
            if (!present && !row.anchorOptional) {
                fail(
                    id,
                    `row ${row.code} is ALIGNED but its anchor "${row.anchor.needle}" is absent from ` +
                        `${row.anchor.file} — the lever regressed.`,
                );
                rowFail = true;
            } else if (!present && row.anchorOptional) {
                warn(
                    id,
                    `row ${row.code} optional anchor "${row.anchor.needle}" not found in ` +
                        `${row.anchor.file} (may live in a co-located partial).`,
                );
            }
        }
    }
    if (!rowFail) {
        pass(
            id,
            `all ${CHECKLIST.length} checklist rows dispositioned (ALIGNED / OUT / N-A-with-reason); ` +
                `View-Transitions row marked ALIGNED (E.W11 S2 landed it).`,
        );
    }
    // Always print the re-scored table so the disposition is visible in CI log.
    process.env.__MWG_CHECKLIST = JSON.stringify(CHECKLIST);
}

// ── report ───────────────────────────────────────────────────────────────────
console.log("proof:modern-web — E.W4 modern-web alignment (falsifiable, re-runnable)\n");
for (const p of passes) console.log(`  ✓ ${p}`);
for (const w of warnings) console.log(`  ! ${w}`);

// The re-scored §S6 checklist table.
if (process.env.__MWG_CHECKLIST) {
    const rows = JSON.parse(process.env.__MWG_CHECKLIST);
    console.log("\n  §S6 modern-web checklist (re-scored at E.W4 close):");
    for (const r of rows) {
        const tail = r.note ? `  — ${r.note}` : r.reason ? `  — ${r.reason}` : "";
        const shortTail = tail.length > 96 ? tail.slice(0, 93) + "…" : tail;
        console.log(
            `    ${String(r.code).padEnd(16)} ${r.disposition.padEnd(16)} ${r.axis}${shortTail}`,
        );
    }
}

if (failures.length > 0) {
    console.error(`\nproof:modern-web — FAIL (${failures.length}):`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    console.error(
        "\n  A modern-web lever regressed. Each clause is the falsifiable form of an aligned\n" +
            "  lever's presence — restore the lever or re-disposition the checklist row.",
    );
    process.exit(1);
}

console.log(
    "\nproof:modern-web — PASS: every adopted lever is present (Monaco deferred off the\n" +
        "eager graph, font preloaded, the heavy edit path yields the engine ladder, the\n" +
        "scene loop pauses off-tab, scene routes warm on hover) and every checklist row is\n" +
        "dispositioned (ALIGNED / OUT / N-A-with-reason). inv μ / inv ε hold.",
);
