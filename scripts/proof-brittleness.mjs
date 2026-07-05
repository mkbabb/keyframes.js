#!/usr/bin/env node
/**
 * proof:brittleness — the D.W3 brittleness-hardening gate (selectors · z-order ·
 * feature-guards).
 *
 * A thin seam of BRITTLENESS runs through the demo: DOM queries that reach
 * OUTSIDE their component by string selector (a global
 * `document.querySelectorAll("pre")`), a z-order that consumes the
 * single-sourced glass-ui `--z-*` scale cleanly but leaves one orphan raw
 * `z-index: -10` un-named, and CSS that depends on `dvh` / `env(safe-area-inset-*)`
 * / `-webkit-mask-image` with ZERO `@supports` fallback. D.W3 makes the brittle
 * owned, the fragile robust — each closed by this re-runnable instrument.
 *
 * Each clause BITES on the exact regression it forbids — verified, not asserted.
 * Mirrors `proof:dogfood` / `proof:boundary`: exits 1 on any residual.
 *
 * CLAUSES (each BITES):
 *
 *   1. NO GLOBAL DOM REACH — zero global `document.querySelector*` in demo
 *      reactive code (`.vue` / `.ts`), EXCLUDING `dist/` + the allowlisted
 *      `document.head.querySelector("#id")` style-element idiom (the documented
 *      dynamic-stylesheet pattern, not a DOM reach). BITE:
 *      `KeyframesEditor.vue:439`'s `document.querySelectorAll("pre")` reds it.
 *
 *   2. Z-SCALE SINGLE-SOURCED — zero raw `z-[N]` bracket-arbitrary value in demo
 *      source, AND every raw `z-index: <value>` resolves to a named `--z-*`
 *      token (the orphan `z-index: -10` → `--z-behind`). BITE: a raw `z-[N]`
 *      drift, or a raw `z-index:` literal not reading off the `--z-*` scale,
 *      reds it.
 *
 *   3. @SUPPORTS GUARDS — built (preferred) or source CSS carries `@supports`
 *      rules covering `dvh`, `env(safe-area-inset-*)`, and `-webkit-mask-image`.
 *      BITE: the demo has zero `@supports` today, so this reds until the guards
 *      land.
 *
 *   4. NO HAND-ROLLED LISTENER/OBSERVER — zero manual `.addEventListener(` /
 *      `new ResizeObserver` / `new MutationObserver` in demo reactive code (`.vue` / `.ts`, comment-
 *      blanked, `dist/` excluded) OUTSIDE the documented `LISTENER_ALLOWLIST`
 *      (the genuinely-imperative engine-loop sites). This is the second half of
 *      the inv-ζ dogfood discipline `proof:dogfood` began for rAF: a hand-rolled
 *      listener re-implements lifecycle `@vueuse/core`'s `useEventListener` /
 *      `useResizeObserver` already own (auto-cleanup via `tryOnScopeDispose`,
 *      a `stop()` handle for the dynamic-drag case). The allowlist mirrors the
 *      `proof:decomposition` `ASYNC_ALLOWLIST` (explicit Set, per-entry
 *      rationale, stale-entry guard so it cannot rot). BITE: the 6
 *      `addEventListener` files + the 3 `ResizeObserver` files red it before
 *      E.W2; after S1–S3 the surface rides vueuse and the allowlist is empty.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

// The listener/observer allowlist (clause 4): repo-relative POSIX paths whose
// manual `.addEventListener(` / `new ResizeObserver` is a genuinely-imperative
// engine-loop site, NOT a hand-roll a vueuse primitive replaces 1:1. Mirrors the
// `proof:decomposition` ASYNC_ALLOWLIST: an explicit Set, each entry carrying a
// rationale, with a stale-entry guard below (an allowlisted path matching no hit
// reds the gate) so the list cannot rot. A future justified exception is a
// deliberate diff to THIS Set with its rationale.
//
// EMPTY today: E.W2 transposed every demo listener/observer onto vueuse —
// SpringTarget/PlaybackRibbon window listeners → useEventListener, the drag
// sites → useDragCapture/useEventListener stop(), EasingTarget/CSSCodeEditor/
// AmigaScene observers → useResizeObserver. AmigaScene's canvas-resize observer
// CONVERTED (useResizeObserver), so it is not allowlisted; its sibling Three.js
// present loop stays a proof:decomposition concern (rAF), out of clause 4's scope.
const LISTENER_ALLOWLIST = new Set([
    // (none — the demo listener/observer surface rides @vueuse/core entirely)
]);

const failures = [];

/** Walk a dir collecting files matching one of `exts` (skipping dist/ + deps). */
function collect(dir, exts, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collect(path.join(dir, e.name), exts, out);
        } else if (exts.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}


const read = (p) => fs.readFileSync(p, "utf8");

/**
 * Blank out comments (block `/* … *\/`, line `// …`, and HTML `<!-- … -->`)
 * while PRESERVING newlines + total length, so line numbers stay correct and a
 * gate scanning the result never trips on prose. A comment that merely MENTIONS
 * `z-index: -10` or `document.querySelector` (the docs in style.css /
 * design-idioms.css that NAME the orphan they reconcile, or a clarifying code
 * comment) must not red the gate — only a real declaration/call does.
 *
 * This is a deliberately simple lexical blanker (not a full CSS/JS parser): it
 * does not track string literals, so a `/*` inside a string would over-blank —
 * acceptable here because the demo's CSS/Vue style blocks and TS do not embed
 * comment-opener sequences inside strings on the lines this gate inspects, and
 * over-blanking only ever makes the gate MORE lenient on a comment, never on a
 * real declaration.
 */
function blankComments(src) {
    let out = "";
    let i = 0;
    const n = src.length;
    while (i < n) {
        // block comment /* … */
        if (src[i] === "/" && src[i + 1] === "*") {
            const end = src.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += src[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        // line comment // … (to end of line)
        if (src[i] === "/" && src[i + 1] === "/") {
            let j = i;
            while (j < n && src[j] !== "\n") {
                out += " ";
                j++;
            }
            i = j;
            continue;
        }
        // HTML comment <!-- … -->
        if (src.startsWith("<!--", i)) {
            const end = src.indexOf("-->", i + 4);
            const stop = end === -1 ? n : end + 3;
            for (let j = i; j < stop; j++) out += src[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        out += src[i];
        i++;
    }
    return out;
}

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:brittleness — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log("proof:brittleness — D.W3 (brittleness hardened)");

    const reactiveFiles = collect(DEMO, new Set([".vue", ".ts"]));

    // ── 1. NO GLOBAL DOM REACH ─────────────────────────────────────────
    {
        // Any `document.querySelector` / `document.querySelectorAll` call.
        const QUERY = /\bdocument\.querySelector(?:All)?\s*\(/g;
        // The allowlisted dynamic-stylesheet idiom: a query rooted at
        // `document.head` selecting a `#id` style element. This is the
        // documented inject-once stylesheet pattern, NOT a cross-component DOM
        // reach. Form: `document.head.querySelector("#…")` / `('#…')`.
        const HEAD_STYLE_IDIOM =
            /\bdocument\.head\.querySelector\s*\(\s*["'`]#[^"'`]+["'`]\s*\)/;

        const offenders = [];
        for (const abs of reactiveFiles) {
            // Blank comments first: a code comment that NAMES the global query
            // it removed (or documents the brittleness) must not red the gate.
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!QUERY.test(line)) {
                    QUERY.lastIndex = 0;
                    continue;
                }
                QUERY.lastIndex = 0;
                // Allowlist the head-style idiom (the whole line must BE it).
                if (HEAD_STYLE_IDIOM.test(line)) continue;
                offenders.push({
                    rel: relPosix(abs),
                    line: i + 1,
                    text: line.trim(),
                });
            }
        }
        if (offenders.length > 0) {
            failures.push(
                `[dom-reach] ${offenders.length} global document.querySelector* ` +
                    `call(s) in demo reactive code (allowlist: ` +
                    `document.head.querySelector("#id") style-element idiom). A ` +
                    `component must not reach outside its own markup — scope to an ` +
                    `owned useTemplateRef (D.W3 §S1). Sites:\n      ` +
                    offenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.text}`)
                        .join("\n      ") +
                    (offenders.length > 12
                        ? `\n      … and ${offenders.length - 12} more`
                        : ""),
            );
        } else {
            console.log(
                `  ✓ [dom-reach] zero global document.querySelector* in demo ` +
                    `reactive code (head-style idiom allowlisted)`,
            );
        }
    }

    // ── 2. Z-SCALE SINGLE-SOURCED ──────────────────────────────────────
    {
        const allDemoSrc = collect(
            DEMO,
            new Set([".vue", ".ts", ".css"]),
        );

        // 2a — zero raw `z-[N]` bracket-arbitrary tailwind value.
        const RAW_BRACKET = /\bz-\[[^\]]*\d[^\]]*\]/g;
        const bracketHits = [];
        // 2b — every raw `z-index: <value>` must resolve to a `--z-*` token.
        // A compliant declaration reads `z-index: var(--z-…)`. A raw numeric
        // literal (`z-index: -10`, `z-index: 40`) is the orphan the gate bites.
        const Z_INDEX_DECL = /z-index\s*:\s*([^;}\n]+)/g;
        const rawZIndex = [];

        for (const abs of allDemoSrc) {
            // Blank comments first: the style.css / design-idioms.css docs that
            // NAME the orphan `z-index: -10` they reconcile (prose, not a
            // declaration) must not red the gate — only a real declaration does.
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                const bm = line.match(RAW_BRACKET);
                if (bm) {
                    bracketHits.push({
                        rel: relPosix(abs),
                        line: i + 1,
                        text: line.trim(),
                    });
                }

                Z_INDEX_DECL.lastIndex = 0;
                let zm;
                while ((zm = Z_INDEX_DECL.exec(line)) !== null) {
                    const value = zm[1].trim();
                    // Resolves to a named token iff it reads `var(--z-…)`.
                    if (!/var\(\s*--z-[a-z-]+/.test(value)) {
                        rawZIndex.push({
                            rel: relPosix(abs),
                            line: i + 1,
                            value,
                            text: line.trim(),
                        });
                    }
                }
            }
        }

        if (bracketHits.length > 0) {
            failures.push(
                `[z-scale] ${bracketHits.length} raw z-[N] bracket-arbitrary ` +
                    `value(s) in demo source — every z must read off the named ` +
                    `--z-* scale via a z-* utility, not a bracket literal ` +
                    `(D.W3 §S2). Sites:\n      ` +
                    bracketHits
                        .map((b) => `${b.rel}:${b.line}  ${b.text}`)
                        .join("\n      "),
            );
        }
        if (rawZIndex.length > 0) {
            failures.push(
                `[z-scale] ${rawZIndex.length} raw z-index: literal(s) not ` +
                    `resolving to a named --z-* token (the orphan z-index must be ` +
                    `named, e.g. z-index: var(--z-behind), D.W3 §S2). Sites:\n      ` +
                    rawZIndex
                        .map((z) => `${z.rel}:${z.line}  z-index: ${z.value}`)
                        .join("\n      "),
            );
        }
        if (bracketHits.length === 0 && rawZIndex.length === 0) {
            console.log(
                `  ✓ [z-scale] zero raw z-[N]; every z-index: reads off a ` +
                    `named --z-* token`,
            );
        }
    }

    // ── 3. @SUPPORTS GUARDS for the named properties ───────────────────
    {
        let cssSources = [];
        let where = "";
        // Check the demo's OWN source guards (CSS + <style> blocks), NOT the
        // built bundle: the built CSS merges ~200 VENDOR `@supports` blocks
        // (color-mix, etc.) that would satisfy these property checks even if the
        // demo dropped its own guard — a vendor-polluted proxy. The demo
        // authors all three guards in source (EditorShell `dvh`, AnimationMenuBar
        // `env()`, AnimationControls/ControlsPaneWrapper `mask-image`), so the
        // vendor-free, deterministic check is the source itself.
        cssSources = collect(DEMO, new Set([".css"]));
        cssSources.push(...collect(DEMO, new Set([".vue"]))); // <style> blocks
        where = "demo source CSS + <style> blocks (vendor-free)";

        // Concatenate the searched CSS once.
        let css = "";
        for (const abs of cssSources) css += "\n" + read(abs);

        // Each named property must appear INSIDE an `@supports (…)` guard. We
        // extract every @supports condition + a window of its body and check the
        // property is covered by SOME guard. A guard for a property is either:
        //   @supports (height: 100dvh) { … }            → dvh
        //   @supports not (height: 100dvh) { … }        → dvh (fallback branch)
        //   @supports (padding: env(safe-area-inset-*)) → env(safe-area-inset-*)
        //   @supports (mask-image: …) / (-webkit-mask-image: …) → mask
        // The check is presence-of-guard-mentioning-the-property: a robust,
        // build-agnostic proxy for "the rule degrades gracefully."
        const supportsBlocks = [...css.matchAll(/@supports\b([^{]*)\{/g)].map(
            (m) => m[1],
        );
        const supportsText = supportsBlocks.join("\n").toLowerCase();

        const checks = [
            {
                name: "dvh",
                // `dvh` is a CSS length unit, so it is always preceded by a
                // DIGIT (`100dvh`, `88dvh`) — there is NO word boundary between
                // the digit and `d`, so a leading `\b` would never match. Anchor
                // on a trailing boundary only.
                covered: /dvh\b/.test(supportsText),
                hint: "@supports (not) (height: 100dvh) { … vh fallback }",
            },
            {
                name: "env(safe-area-inset-*)",
                covered: /env\(\s*safe-area-inset-/.test(supportsText),
                hint: "@supports (padding: env(safe-area-inset-bottom)) { … }",
            },
            {
                name: "-webkit-mask-image",
                covered: /-webkit-mask-image|mask-image/.test(supportsText),
                hint: "@supports (-webkit-mask-image: linear-gradient(#000,#000)) { … }",
            },
        ];

        console.log(
            `  @supports coverage scanned in: ${where} ` +
                `(${supportsBlocks.length} @supports block(s) found)`,
        );

        const uncovered = checks.filter((c) => !c.covered);
        if (uncovered.length > 0) {
            for (const c of uncovered) {
                failures.push(
                    `[supports] no @supports guard covers \`${c.name}\` — the ` +
                        `rule degrades silently on a browser lacking it. Add ` +
                        `${c.hint} (D.W3 §S3).`,
                );
            }
        } else {
            console.log(
                `  ✓ [supports] @supports guards cover dvh, ` +
                    `env(safe-area-inset-*), and -webkit-mask-image`,
            );
        }
    }

    // ── 4. NO HAND-ROLLED LISTENER/OBSERVER ────────────────────────────
    {
        // A manual `.addEventListener(` or `new ResizeObserver` / `new MutationObserver` — the listener/
        // observer hand-roll the inv-ζ dogfood discipline removes for rAF.
        const LISTENER = /\.addEventListener\s*\(|new\s+ResizeObserver\b|new\s+MutationObserver\b/;
        // Hit-bearing allowlist paths, so the stale guard can prune dead entries.
        const allowlistedHitPaths = new Set();
        const offenders = [];

        for (const abs of reactiveFiles) {
            const rel = relPosix(abs);
            // Blank comments first: a code comment that NAMES the listener it
            // transposed (or documents the pattern) must not red the gate —
            // only a real `.addEventListener(` / `new ResizeObserver` does.
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (!LISTENER.test(lines[i])) continue;
                if (LISTENER_ALLOWLIST.has(rel)) {
                    allowlistedHitPaths.add(rel);
                    continue;
                }
                offenders.push({ rel, line: i + 1, text: lines[i].trim() });
            }
        }

        if (offenders.length > 0) {
            failures.push(
                `[listener] ${offenders.length} manual .addEventListener( / ` +
                    `new ResizeObserver call(s) in demo reactive code outside the ` +
                    `LISTENER_ALLOWLIST — the listener/observer surface must ride ` +
                    `@vueuse/core (useEventListener / useResizeObserver: ` +
                    `tryOnScopeDispose cleanup, a stop() handle for the dynamic ` +
                    `case), the inv-ζ dogfood discipline (E.W2 §S1–S3). Convert ` +
                    `the site, or add a justified LISTENER_ALLOWLIST entry. ` +
                    `Sites:\n      ` +
                    offenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.text}`)
                        .join("\n      ") +
                    (offenders.length > 12
                        ? `\n      … and ${offenders.length - 12} more`
                        : ""),
            );
        }

        // Stale-allowlist guard: an allowlist entry pointing at a file with no
        // matching hit is dead and must be pruned (mirrors the
        // proof:decomposition ASYNC_ALLOWLIST stale guard).
        for (const a of LISTENER_ALLOWLIST) {
            if (!allowlistedHitPaths.has(a)) {
                failures.push(
                    `[listener] LISTENER_ALLOWLIST entry "${a}" matches no manual ` +
                        `.addEventListener( / new ResizeObserver site — it is ` +
                        `STALE; remove it.`,
                );
            }
        }

        if (offenders.length === 0) {
            console.log(
                `  ✓ [listener] zero manual .addEventListener( / new ` +
                    `ResizeObserver in demo reactive code outside the ` +
                    `LISTENER_ALLOWLIST (${LISTENER_ALLOWLIST.size} allowlisted)`,
            );
        }
    }

    // ── 4b. NO DEAD ACTIVATION HOOK (G.W9 — the inv-κ lifecycle extension) ──
    // The same shape clause 4 already forbids (a lifecycle wiring the auto-
    // dispose seam supersedes): a `<KeepAlive>`-only hook (`onActivated`/
    // `onDeactivated`) where the scene host has NO `<KeepAlive>`, so it NEVER
    // fires — dead code that, for a loop-owner, leaks the rAF on swap. The grep
    // is PAIRED with a real-KeepAlive grep: while zero genuine `<KeepAlive>`/
    // `keep-alive` exists in the demo render tree, the hooks are forbidden; if a
    // genuine `<KeepAlive>` is ever added, the pair flips and the hooks are
    // re-permitted in ONE motion (the stale-guard — no silent rot).
    {
        const ACTIVATION_HOOK = /\bon(?:Activated|Deactivated)\s*\(/;
        // A REAL <KeepAlive> in the render tree: a `<KeepAlive`/`<keep-alive`
        // ELEMENT (an opening tag), NOT a comment (already blanked) and NOT a
        // bare identifier mention. We require the `<` opener so a string/import
        // of the name does not count as a render-tree host.
        const REAL_KEEPALIVE = /<(?:KeepAlive|keep-alive)\b/;

        let hasRealKeepAlive = false;
        const hookOffenders = [];
        for (const abs of reactiveFiles) {
            const src = blankComments(read(abs));
            if (REAL_KEEPALIVE.test(src)) hasRealKeepAlive = true;
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (ACTIVATION_HOOK.test(lines[i])) {
                    hookOffenders.push({
                        rel: relPosix(abs),
                        line: i + 1,
                        text: lines[i].trim(),
                    });
                }
            }
        }

        if (hasRealKeepAlive) {
            // The paired stale-guard flipped — a genuine <KeepAlive> exists, so
            // the activation hooks are legitimate; the sub-clause self-relaxes.
            console.log(
                `  ✓ [lifecycle] a genuine <KeepAlive> exists in the demo tree ` +
                    `— onActivated/onDeactivated re-permitted (paired stale-guard)`,
            );
        } else if (hookOffenders.length > 0) {
            failures.push(
                `[lifecycle] ${hookOffenders.length} onActivated/onDeactivated ` +
                    `hook(s) while NO <KeepAlive> exists in the demo render tree ` +
                    `— a <KeepAlive>-only hook that NEVER fires (dead code that, ` +
                    `for a loop-owner, leaks the rAF on swap). Re-home cleanup on ` +
                    `onScopeDispose/onBeforeUnmount (mirror useRafLoop.ts ` +
                    `onUnmounted(stop)), or add a genuine <KeepAlive> host (G.W9 ` +
                    `§S1–S2). Sites:\n      ` +
                    hookOffenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.text}`)
                        .join("\n      ") +
                    (hookOffenders.length > 12
                        ? `\n      … and ${hookOffenders.length - 12} more`
                        : ""),
            );
        } else {
            console.log(
                `  ✓ [lifecycle] zero onActivated/onDeactivated while no ` +
                    `<KeepAlive> in the demo render tree`,
            );
        }
    }

    // ── 4c. EVERY RAW RAFPlayback OWNER STOPS ON DISPOSE (G.W9 widened inv) ──
    // The widened invariant: a file that owns a raw `new RAFPlayback()` must
    // also carry a dispose-time stop — either a `.stop()` on an unmount seam
    // (`onScopeDispose`/`onBeforeUnmount`/`onUnmounted`) OR it rides
    // `useRafLoop` (whose own `onUnmounted(stop)` auto-cleans). A raw playback
    // with no dispose stop leaks until it self-settles (bounded) or forever
    // (perpetual). BITE: today on `coastPlayback` before S3; green after.
    {
        const OWNS_RAFPLAYBACK = /\bnew\s+RAFPlayback\b/;
        const DISPOSE_SEAM =
            /\bon(?:ScopeDispose|BeforeUnmount|Unmounted)\s*\(/;
        const STOP_CALL = /\.stop\s*\(\s*\)/;

        const leakers = [];
        for (const abs of reactiveFiles) {
            const src = blankComments(read(abs));
            if (!OWNS_RAFPLAYBACK.test(src)) continue;
            const rel = relPosix(abs);
            // A raw playback owner must stop on a dispose seam. (useRafLoop.ts —
            // the auto-cleanup primitive — passes on its own onUnmounted(stop),
            // not by exemption: a useRafLoop CALL in a file does NOT cover a
            // SEPARATE raw playback that file also owns, e.g. coastPlayback.)
            const hasDisposeStop =
                DISPOSE_SEAM.test(src) && STOP_CALL.test(src);
            if (!hasDisposeStop) {
                leakers.push(rel);
            }
        }
        if (leakers.length > 0) {
            failures.push(
                `[rafplayback] ${leakers.length} raw \`new RAFPlayback()\` ` +
                    `owner(s) with no dispose-time stop() — every raw playback ` +
                    `must stop on dispose (onScopeDispose/onBeforeUnmount/` +
                    `onUnmounted, or ride useRafLoop's auto-cleanup), else the ` +
                    `loop leaks past unmount (G.W9 §S3). Sites:\n      ` +
                    leakers.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [rafplayback] every raw RAFPlayback owner stops on dispose`,
            );
        }
    }

    // ── 5. NO CALLBACKS-AS-PROPS ────────────────────────────────────────────
    {
        // A function-typed prop that is a callback pattern (onXxx or setXxx)
        // typed as `(…) => void`. These create prop-drilling chains for events
        // that Vue's emit already handles; the inv-ζ discipline replaces them with
        // defineEmits (D.W3 §S5). Scan all defineProps blocks.
        const CB_PROP =
            /(onPanelTransitionEnd|onSheetSettled|onPaneMouseEnter|onPaneMouseLeave|setPaneEl)\s*:\s*\([^)]*\)\s*=>\s*void/;
        const CB_ALLOWLIST = new Set([
            // (none — all callback props must use defineEmits)
        ]);
        const cbOffenders = [];
        for (const abs of reactiveFiles) {
            const rel = relPosix(abs);
            if (CB_ALLOWLIST.has(rel)) continue;
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (CB_PROP.test(lines[i])) {
                    cbOffenders.push({ rel, line: i + 1, text: lines[i].trim() });
                }
            }
        }
        if (cbOffenders.length > 0) {
            failures.push(
                `[cb-props] ${cbOffenders.length} callback-as-prop pattern(s) ` +
                    `in defineProps — use defineEmits instead (D.W3 §S5). Sites:\n      ` +
                    cbOffenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.text}`)
                        .join("\n      ") +
                    (cbOffenders.length > 12
                        ? `\n      … and ${cbOffenders.length - 12} more`
                        : ""),
            );
        } else {
            console.log(
                `  ✓ [cb-props] zero callback-as-prop patterns in defineProps ` +
                    `(all events use defineEmits)`,
            );
        }
    }

    // ── 6. NO var(--z-content, / var(--z-behind, COMMA-DEFAULTS ────────
    {
        // A `var(--z-content, <fallback>)` or `var(--z-behind, <fallback>)` comma-
        // default in demo source bypasses the single-sourced --z-* scale: the fallback
        // can drift from the token value silently (e.g. `var(--z-content, 3)` uses 3
        // if the token is absent — a stale hardcode). The guaranteed form is bare
        // `var(--z-content)` / `var(--z-behind)` (no comma), so the token is required
        // to resolve and a missing token surfaces as `invalid` rather than silently
        // falling back to a stale literal (D.W3 §S6).
        const Z_GUARANTEED_COMMA = /var\(\s*--(z-content|z-behind)\s*,/;
        const allDemoSrcZ = collect(DEMO, new Set([".vue", ".ts", ".css"]));
        const zCommaOffenders = [];
        for (const abs of allDemoSrcZ) {
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (Z_GUARANTEED_COMMA.test(lines[i])) {
                    zCommaOffenders.push({
                        rel: relPosix(abs),
                        line: i + 1,
                        text: lines[i].trim(),
                    });
                }
            }
        }
        if (zCommaOffenders.length > 0) {
            failures.push(
                `[z-comma] ${zCommaOffenders.length} var(--z-content,/var(--z-behind, ` +
                    `comma-default(s) in demo source — use bare var(--z-content) / ` +
                    `var(--z-behind) (no fallback) so a missing token surfaces rather ` +
                    `than silently falling back to a stale literal (D.W3 §S6). Sites:\n      ` +
                    zCommaOffenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.text}`)
                        .join("\n      ") +
                    (zCommaOffenders.length > 12
                        ? `\n      … and ${zCommaOffenders.length - 12} more`
                        : ""),
            );
        } else {
            console.log(
                `  ✓ [z-comma] zero var(--z-content,/var(--z-behind, comma-defaults ` +
                    `in demo source (bare var(--z-*) guaranteed)`,
            );
        }
    }

    // ── 7. NO UTILITY-KEYED LAYOUT (T.E4) ──────────────────────────────────
    {
        // A layout/position declaration keyed onto a GENERIC z-index /
        // pointer-events utility class (optionally via a `:has()` structural
        // test) is fragile: it fires on ANY element carrying that utility, not
        // just the one intended. The compose-killer `.z-dock:has(> .pointer-
        // events-auto)` re-tethered the AssetViewport (a `.z-dock` with a
        // `pointer-events-auto` child) off `inset-0`, collapsing its layer to
        // height 0. The dock tether now keys on the explicit `[data-dock-tether]`
        // opt-in. This clause forbids the whole CLASS: (a) any `:has(` selector
        // carrying a position/top/bottom/inset/position-anchor declaration whose
        // ROOT is a utility class (`.z-*` / `.pointer-events-*`), and (b) any
        // position/top/bottom/inset/position-anchor declaration ROOTED on a
        // `.z-*` / `.pointer-events-*` class selector.
        const layoutCss = collect(DEMO, new Set([".css"]));
        layoutCss.push(...collect(DEMO, new Set([".vue"]))); // <style> blocks
        const POS_PROP =
            /\b(?:position-anchor|position|top|bottom|left|right|inset)\s*:/;
        // A rule head → its declaration block. Match `<selector> { <body> }` at
        // one nesting level (the demo's anchor rules live one level inside a
        // media/@supports block; the body regex stops at the next `}`).
        const RULE = /([^{}]+)\{([^{}]*)\}/g;
        const utilRootSel =
            /(?:^|[\s,>~+])\.(?:z-[a-z0-9-]+|pointer-events-[a-z0-9-]+)\b/;
        const offenders = [];
        for (const abs of layoutCss) {
            const src = blankComments(read(abs));
            let m;
            RULE.lastIndex = 0;
            while ((m = RULE.exec(src)) !== null) {
                const sel = m[1];
                const body = m[2];
                if (!POS_PROP.test(body)) continue;
                const hasHasUtility =
                    /:has\(/.test(sel) && utilRootSel.test(sel);
                const rootedOnUtility = utilRootSel.test(sel);
                if (hasHasUtility || rootedOnUtility) {
                    const line = src.slice(0, m.index).split("\n").length;
                    offenders.push({
                        rel: relPosix(abs),
                        line,
                        sel: sel.replace(/\s+/g, " ").trim().slice(0, 80),
                    });
                }
            }
        }
        if (offenders.length > 0) {
            failures.push(
                `[utility-keyed-layout] ${offenders.length} position/layout ` +
                    `declaration(s) keyed on a generic z-*/pointer-events-* utility ` +
                    `class (or a :has() test rooted on one) in demo CSS — a layout ` +
                    `rule that fires on ANY element carrying the utility (the T.E4 ` +
                    `compose-killer class). Key the reposition on an explicit opt-in ` +
                    `attribute (e.g. [data-dock-tether]) on the intended element. Sites:\n      ` +
                    offenders
                        .slice(0, 12)
                        .map((o) => `${o.rel}:${o.line}  ${o.sel}`)
                        .join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [utility-keyed-layout] zero position/layout rules keyed on a ` +
                    `z-*/pointer-events-* utility class (or a :has() test rooted on one); ` +
                    `the dock tether keys on the explicit [data-dock-tether] attribute (T.E4)`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:brittleness — FAIL (D.W3 — brittleness not yet hardened):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  Brittleness is the gap between 'works today' and 'works under churn':\n" +
                "  a global selector breaks when a sibling adds a <pre>, a raw z-index\n" +
                "  drifts off the scale, an unguarded dvh/env()/mask-image breaks on a\n" +
                "  browser without it. Own the reach, name the z-value, guard the feature.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:brittleness — PASS: no global DOM reach, the z-scale is\n" +
            "single-sourced, and the named features are @supports-guarded. D.W3 holds.",
    );
}

main();
