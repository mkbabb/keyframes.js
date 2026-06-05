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
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

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
