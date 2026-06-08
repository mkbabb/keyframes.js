#!/usr/bin/env node
/**
 * proof:icon-idiom — the 61-no-op icon-sizing lock (H.W4 S4, a-styling-idioms §1).
 *
 * The single largest idiom-ownership gap the demo carried: `icon-(xs|sm|md|lg)`
 * referenced at 61+ callsites across the demo `.vue` tree, resolving to LITERALLY
 * NOTHING — no rule with an `.icon-*` selector existed anywhere (not the demo, not
 * glass-ui), so all four sizes computed IDENTICALLY at Lucide's default 24px. A
 * 61-site idiom resolving to nothing is the strictly-worse instance of the exact
 * cross-repo rent `design-idioms.css` exists to retire. H.W4 owns the family as the
 * file's FIRST `@utility` family (the v4 idiom upgrade), DIFFERENTIATED
 * (xs<sm<md<lg — the uniform 24px was the ACCIDENT), cascading into nested SVGs.
 *
 * This is the SAME resolve-or-red shape proof:idioms clause-1 uses for the
 * `--rainbow-*` family (the references ARE the contract, derived live — no
 * hand-maintained "what to define" list). Each clause BITES on the exact negative
 * case it forbids; exits 1 on any residual. Re-runnable:
 * `node scripts/proof-icon-idiom.mjs`.
 *
 * CLAUSES (each BITES):
 *
 *   1. RESOLVE-OR-RED — every `\bicon-(xs|sm|md|lg)\b` reference in demo `.vue`
 *      (excluding vendored `ui/` shadcn + `dist/`) resolves to an `@utility
 *      icon-N { … }` definition in design-idioms.css. BITE: a referenced size with
 *      no definition reds (today, pre-fix: all 61 refs resolve to ZERO defs);
 *      stub/delete a definition → its referencing sites red.
 *
 *   2. DIFFERENTIATE (xs < sm < md < lg) — the four defined sizes are STRICTLY
 *      INCREASING by their `@apply size-N` spacing factor (the W4 family is
 *      size-3.5 < size-4 < size-5 < size-6 → 14px < 16px < 20px < 24px). BITE: make
 *      any two equal (the uniform-24px accident the gate forbids) → the
 *      strict-monotonicity assert reds. (A computed-size check that is flake-free +
 *      browser-free: the `size-N` Tailwind factor is the SVG/box edge in
 *      `0.25rem` units, so a strictly-increasing factor IS a strictly-increasing
 *      computed px — the W4 built-CSS verification confirmed each rule emits
 *      `width:calc(var(--spacing) * N)`.)
 *
 *   3. SVG CASCADE (WV-W4-MED-1) — each `@utility icon-N` carries a nested
 *      `& svg { @apply size-N }` (or `[&_svg]:size-N`) rule so a WRAPPER callsite
 *      (e.g. `<CopyButton class="icon-md">`, a `<button>`) actually shrinks its
 *      inner 24px Lucide `<svg>`, not just the button box. The gate samples a
 *      real WRAPPER callsite AND a direct-SVG callsite from the live references;
 *      both must resolve through the cascade. BITE: drop the `& svg` rule from any
 *      `@utility icon-N` → the wrapper-callsite clause reds (the glyph stays 24px).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DESIGN_IDIOMS = path.join(DEMO, "@/styles/design-idioms.css");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);
const UI_VENDORED = "/demo/@/components/ui/";

const SIZES = ["xs", "sm", "md", "lg"];

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

/** Walk a dir collecting files matching one of `exts` (skipping built/dep trees). */
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

// Blank /* … */ and // … comments so the family's own DOC-comment (which NAMES
// `icon-xs(14px) < icon-sm(16px) < …`) does NOT count as a reference OR a
// definition — only LIVE markup/rules count. Mirrors proof:idioms `blankComments`.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

console.log("proof:icon-idiom — H.W4 S4 (the 61-no-op icon-sizing lock)");

if (!fs.existsSync(DESIGN_IDIOMS)) {
    fail(
        `design-idioms.css does not exist (${relPosix(DESIGN_IDIOMS)}) — the demo ` +
            `has no owned icon-sizing family; every icon-* reference resolves to a ` +
            `no-op 24px (H.W4 S4).`,
    );
    report();
}

const idiomSrc = read(DESIGN_IDIOMS);
const idiomBlanked = blankComments(idiomSrc);

// ── Parse the @utility icon-N definitions (the W4-chosen shape) ────────────────
// `@utility icon-N { @apply size-K; & svg { @apply size-K } }`. Capture per size:
//   (a) the OUTER `@apply size-K` factor (the box edge), and
//   (b) whether a nested `& svg { … size-K }` (or `[&_svg]:size-K`) rule exists.
// Tolerant of the `.class` alternate shape (WV-W4-MED-4 said the W4 lane may match
// the existing `.class` shape instead) — match either `@utility icon-N {` or a
// `.icon-N {` rule open.
function parseIconDef(size) {
    const reOpen = new RegExp(
        String.raw`(?:@utility\s+icon-${size}|\.icon-${size})\b[^{]*\{`,
    );
    const m = idiomBlanked.match(reOpen);
    if (!m) return null;
    // Brace-match from the rule open to its matching close (nested `& svg { … }`
    // included) so we read the WHOLE rule body.
    let i = m.index + m[0].length;
    let depth = 1;
    const bodyStart = i;
    for (; i < idiomBlanked.length && depth > 0; i++) {
        if (idiomBlanked[i] === "{") depth++;
        else if (idiomBlanked[i] === "}") depth--;
    }
    const body = idiomBlanked.slice(bodyStart, i - 1);
    // The OUTER box factor: the FIRST `@apply size-K` / `size-K` BEFORE any nested
    // `& svg` block. Split at the nested-svg marker so the outer factor is read
    // from the box rule, not the svg rule.
    const svgSplit = body.search(/&\s*svg|\[&_svg\]/);
    const outerBody = svgSplit === -1 ? body : body.slice(0, svgSplit);
    const sizeRe = /\bsize-(\d+(?:\.\d+)?)\b/;
    const outerM = outerBody.match(sizeRe);
    const boxFactor = outerM ? parseFloat(outerM[1]) : null;
    // The nested SVG cascade: a `& svg { … size-K }` OR `[&_svg]:size-K`.
    const svgRule =
        /&\s*svg\s*\{[^}]*\bsize-\d/.test(body) || /\[&_svg\]:size-\d/.test(body);
    return { boxFactor, svgRule, body };
}

const defs = {};
for (const s of SIZES) defs[s] = parseIconDef(s);

// ── 1. RESOLVE-OR-RED — every referenced icon size resolves to a definition ────
// Collect the demo-REFERENCED icon-* set live (the markup usages), then assert each
// referenced size has a definition. Mirrors proof:idioms clause-1 (the references
// ARE the contract). Also collect the callsites per size for clause-3 sampling.
const refSites = { xs: [], sm: [], md: [], lg: [] };
{
    const vueFiles = collect(DEMO, new Set([".vue"])).filter(
        (abs) => !toPosix(abs).includes(UI_VENDORED),
    );
    const REF = /\bicon-(xs|sm|md|lg)\b/g;
    let totalRefs = 0;
    for (const abs of vueFiles) {
        const rel = relPosix(abs);
        const blanked = blankComments(read(abs));
        const lines = blanked.split("\n");
        for (let i = 0; i < lines.length; i++) {
            for (const m of lines[i].matchAll(REF)) {
                refSites[m[1]].push({ rel, line: i + 1, raw: lines[i].trim() });
                totalRefs++;
            }
        }
    }
    const referencedSizes = SIZES.filter((s) => refSites[s].length > 0);
    const unresolved = referencedSizes.filter((s) => defs[s] === null);

    console.log(
        `  referenced icon sizes: ` +
            SIZES.map((s) => `icon-${s}×${refSites[s].length}`).join(" / ") +
            `  (${totalRefs} total refs, ui/ + dist/ excluded)`,
    );

    if (unresolved.length > 0) {
        const detail = unresolved
            .map(
                (s) =>
                    `icon-${s} (×${refSites[s].length} refs, first: ` +
                    `${refSites[s][0].rel}:${refSites[s][0].line})`,
            )
            .join("\n      ");
        fail(
            `resolve-or-red — ${unresolved.length} referenced icon size(s) resolve ` +
                `to NO @utility/.icon-* definition in design-idioms.css:\n      ` +
                detail +
                `\n    Own the icon-sizing family in ${relPosix(DESIGN_IDIOMS)} so ` +
                `every reference resolves (the 61-no-op rent the file exists to ` +
                `retire, H.W4 S4).`,
        );
    } else {
        ok(
            `resolve-or-red — all ${referencedSizes.length} referenced icon size(s) ` +
                `(${referencedSizes.map((s) => `icon-${s}`).join(", ")}) resolve to a ` +
                `design-idioms.css definition (${totalRefs} refs covered)`,
        );
    }
}

// ── 2. DIFFERENTIATE (xs < sm < md < lg) ───────────────────────────────────────
// The four box factors are strictly increasing (the named delta; the uniform-24px
// was the accident). Only assert over sizes that HAVE a definition (clause-1 owns
// the missing-def red); a present def with a missing/equal factor reds here.
{
    const factors = SIZES.map((s) => ({ size: s, f: defs[s]?.boxFactor ?? null }));
    const present = factors.filter((x) => x.f !== null);
    const missingFactor = SIZES.filter(
        (s) => defs[s] !== null && defs[s].boxFactor === null,
    );
    if (missingFactor.length > 0) {
        fail(
            `differentiate — icon size(s) ${missingFactor
                .map((s) => `icon-${s}`)
                .join(", ")} define a rule but carry no resolvable @apply size-N box ` +
                `factor — the computed size cannot be ordered.`,
        );
    } else if (present.length === SIZES.length) {
        // Strict monotonicity across xs<sm<md<lg.
        let strictlyIncreasing = true;
        for (let i = 1; i < present.length; i++) {
            if (!(present[i].f > present[i - 1].f)) strictlyIncreasing = false;
        }
        const ladder = present
            .map((x) => `icon-${x.size}=size-${x.f}`)
            .join(" < ");
        if (strictlyIncreasing) {
            ok(
                `differentiate — the four sizes are strictly increasing ` +
                    `(${ladder}; size-N is N×0.25rem, so the computed px is strictly ` +
                    `increasing — xs<sm<md<lg, the named delta, not the uniform-24px ` +
                    `accident)`,
            );
        } else {
            fail(
                `differentiate — the icon sizes are NOT strictly increasing ` +
                    `(xs<sm<md<lg): ${ladder}. The uniform/equal size is the accident ` +
                    `the family exists to retire — each rung must differentiate (H.W4 S4).`,
            );
        }
    }
    // (If a size is wholly undefined, clause-1 already red; skip ordering for it.)
}

// ── 3. SVG CASCADE (WV-W4-MED-1) — wrapper callsite + direct-SVG resolve ───────
// Each defined `@utility icon-N` must cascade into nested SVGs (`& svg { size-N }`)
// so a WRAPPER callsite shrinks its inner 24px glyph, not just the box. Sample a
// real WRAPPER callsite (the class on a non-`<svg>`/component element) AND a
// direct-SVG/icon-component callsite from the live refs; both must resolve through
// a definition that carries the SVG-cascade rule.
{
    // Which defined sizes carry the `& svg` cascade.
    const missingCascade = SIZES.filter(
        (s) => defs[s] !== null && !defs[s].svgRule,
    );
    if (missingCascade.length > 0) {
        fail(
            `svg-cascade — icon size(s) ${missingCascade
                .map((s) => `icon-${s}`)
                .join(", ")} define the box (@apply size-N) but carry NO nested ` +
                `\`& svg { @apply size-N }\` (or [&_svg]:size-N) rule — a WRAPPER ` +
                `callsite (e.g. <CopyButton class="icon-md">) sizes the button box ` +
                `but leaves the inner 24px Lucide <svg> untouched (WV-W4-MED-1).`,
        );
    }

    // Sample callsites: a WRAPPER (class on a component/element that is NOT a bare
    // <svg>) and a DIRECT-SVG/icon-component (a Lucide glyph component or <svg>).
    // The reference shape is `class="… icon-N …"` on an element open tag; classify
    // the tag name. A wrapper is e.g. <CopyButton …>/<button …>/<Button …>; a
    // direct glyph is a Lucide component (<ArrowLeft …>) or <svg …>. We confirm at
    // least one of each EXISTS across the references (the cascade serves both), and
    // that the size each uses carries the cascade rule (so both resolve).
    const allRefs = SIZES.flatMap((s) =>
        refSites[s].map((r) => ({ ...r, size: s })),
    );
    const tagOf = (raw) => {
        // The element open tag the class string sits on — walk back to the nearest
        // `<Tag`. The ref line is a single template line; the tag may be on a prior
        // line for multi-attr elements, but the common shape `<Tag class="… icon-N">`
        // is single-line. Match the LAST `<Tag` before the icon-N on the line.
        const before = raw.slice(0, raw.search(/\bicon-(xs|sm|md|lg)\b/));
        const tags = [...before.matchAll(/<([A-Za-z][\w-]*)/g)];
        return tags.length ? tags[tags.length - 1][1] : null;
    };
    // A direct glyph: <svg> or a Lucide/icon component (PascalCase ending in a
    // glyph name is hard to enumerate, so treat "not an obvious wrapper" as the
    // glyph case). Obvious WRAPPERS the cascade is FOR: button-like / CopyButton.
    const WRAPPER_TAGS = /^(button|Button|CopyButton|a|DockButton)$/;
    let wrapperSample = null;
    let directSample = null;
    for (const r of allRefs) {
        const tag = tagOf(r.raw);
        if (!tag) continue;
        if (WRAPPER_TAGS.test(tag) && !wrapperSample) wrapperSample = { ...r, tag };
        else if (!WRAPPER_TAGS.test(tag) && !directSample)
            directSample = { ...r, tag };
        if (wrapperSample && directSample) break;
    }

    const cascadeResolves = (sample) =>
        sample && defs[sample.size] !== null && defs[sample.size].svgRule;

    if (missingCascade.length === 0) {
        if (wrapperSample && cascadeResolves(wrapperSample)) {
            ok(
                `svg-cascade (wrapper callsite) — ${wrapperSample.rel}:` +
                    `${wrapperSample.line} <${wrapperSample.tag} class="… ` +
                    `icon-${wrapperSample.size}"> resolves through the nested ` +
                    `\`& svg { size-${defs[wrapperSample.size].boxFactor} }\` cascade ` +
                    `(the inner glyph shrinks, not just the box)`,
            );
        } else if (wrapperSample) {
            fail(
                `svg-cascade (wrapper callsite) — ${wrapperSample.rel}:` +
                    `${wrapperSample.line} <${wrapperSample.tag} icon-${wrapperSample.size}> ` +
                    `does not resolve a nested SVG-cascade rule (the inner glyph stays 24px).`,
            );
        } else {
            // No obvious wrapper callsite present — the cascade rule existing on
            // every def (asserted above) is sufficient; note it.
            ok(
                `svg-cascade (wrapper callsite) — no button-wrapper icon callsite in ` +
                    `the live refs to sample; every defined @utility carries the ` +
                    `\`& svg\` cascade regardless (WV-W4-MED-1 satisfied by construction)`,
            );
        }

        if (directSample && cascadeResolves(directSample)) {
            ok(
                `svg-cascade (direct glyph callsite) — ${directSample.rel}:` +
                    `${directSample.line} <${directSample.tag} class="… ` +
                    `icon-${directSample.size}"> resolves the sized box + the SVG rule`,
            );
        } else if (directSample) {
            fail(
                `svg-cascade (direct glyph callsite) — ${directSample.rel}:` +
                    `${directSample.line} <${directSample.tag} icon-${directSample.size}> ` +
                    `does not resolve through a definition with the SVG-cascade rule.`,
            );
        }
    }
}

report();

function report() {
    if (failures.length > 0) {
        console.error(
            `\nproof:icon-idiom — FAIL (${failures.length}): the icon-sizing family ` +
                `is not owned/differentiated/cascading. A 61-site idiom resolving to a ` +
                `no-op 24px (or undifferentiated, or not cascading into nested SVGs) is ` +
                `the strictly-worse rent design-idioms.css exists to retire (H.W4 S4).`,
        );
        process.exit(1);
    }
    console.log(
        "\nproof:icon-idiom — PASS: every icon-* reference resolves to an owned " +
            "design-idioms.css definition, the four sizes differentiate (xs<sm<md<lg), " +
            "and the family cascades into nested SVGs (a wrapper callsite shrinks its " +
            "glyph). The 61-no-op rent is retired (H.W4 S4).",
    );
}
