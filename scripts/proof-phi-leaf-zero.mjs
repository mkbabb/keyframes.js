#!/usr/bin/env node
/**
 * proof:phi-leaf-zero — the φ-hero chronic SYSTEM-property gate (H.W4, CH-2/M1).
 *
 * The single named gate the chronic-closure meta-gate (H.W8 S3) cites BY NAME for
 * the φ-hero chronic. It asserts BOTH halves of the M1 system property in ONE
 * citable gate, so the chronic cannot close while either half is unmet — the exact
 * re-paper the `proof:hero-rung`-alone close would have left open:
 *
 *   HALF 1 (the leaf-tail SWEEP) — zero raw Tailwind rungs
 *     `text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)` AND zero bare `font-size:\s*\d`
 *     across the demo SOURCE roots, so a raw rung can never re-grow the leaf-tail.
 *   HALF 2 (the hero on the TOP φ rung) — the start-screen hero <h1> carries a
 *     `text-display-*` rung at the AUDACIOUS top tier (`text-display-mega`, the
 *     poster-hero rung glass-ui ships at `≥ --type-display-mega`).
 *
 * BOTH are load-bearing: revert the hero rung OR re-introduce a raw rung → reds.
 *
 * ── THE RESIDUAL IS 2, NOT 37 (WV-W4-HIGH-1, the self-contradiction fix) ──
 * With the vendored `ui/` shadcn EXCLUDED (this gate's own exclusion), the live
 * pre-fix count is exactly TWO raw rungs: L1 `AnimationMenuBar.vue:102 text-xl`
 * (→ `icon-lg`) + L2 `MotionPathTarget.vue:119 font-size:1.25rem`
 * (→ `var(--type-subheading)`). "37 raw rungs" materializes ONLY by COUNTING the
 * vendored `ui/` shadcn the gate excludes — phantom with `ui/` excluded; and with
 * `ui/` counted the gate could NEVER green (W4 sweeps only L1+L2). The literal grep
 * over the demo roots WITHOUT the exclusion returns ~150 (WV-W4-LOW-2 — the built
 * `dist/` chunks + vendored shadcn). The asserted number is the ledger residual
 * after the narrowed exclusion = 2.
 *
 * ── SCOPE + EXCLUSIONS (the narrowed exclusion set the residual count rests on) ──
 *   • ROOTS: demo/{@,app,easing,spring,sequence,motion-path} — `.vue` + `.css`.
 *   • EXCLUDE `dist/` — the git-ignored BUILD output that inlines glass-ui's
 *     compiled `.text-*` rungs + every font-size literal (the ~150 noise). A
 *     source-shape gate must never read the build it is asserting the source omits.
 *   • EXCLUDE vendored `ui/` shadcn (`demo/@/components/ui/`) — not demo-authored
 *     surface; its `text-sm` rungs are the upstream shadcn shape, not the demo's
 *     φ-ladder (this is the exclusion the residual=2 rests on).
 *   • EXCLUDE `.svg` user-space font-size — the L4 NOT-A-DEFECT
 *     `EasingCurveCanvas.vue .axis-label { font-size: 0.055px }` lives INSIDE the
 *     `<svg viewBox="0 … 1 …">` coordinate system (a fraction of a USER-SPACE unit,
 *     not a typographic px rung). The contract explicitly classifies it as
 *     not-a-defect; the gate excludes any font-size on an SVG-internal selector
 *     (a class applied only to `<text>`/SVG content — detected structurally below).
 *
 * Static grep + source-shape gate (no browser, no build). Mirrors proof:idioms'
 * leaf-tail clause + proof:no-dup-utility's anchored-shape posture: each clause
 * BITES on the exact negative case it forbids — verified, not asserted; exits 1 on
 * any residual. Re-runnable: `node scripts/proof-phi-leaf-zero.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

// Skip built/dep/VCS trees. `dist/` is load-bearing: the built demo chunks inline
// glass-ui's compiled `.text-*` rungs + every literal font-size — the ~150 noise a
// naive grep over demo/ returns (WV-W4-LOW-2). A source-shape gate reads SOURCE.
const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

// The demo SOURCE roots the M1 system property is asserted over (the contract's
// `demo/{@,app,easing,spring,sequence,motion-path}` set).
const ROOTS = ["@", "app", "easing", "spring", "sequence", "motion-path"];

// The vendored shadcn-vue tree — not demo-authored surface. EXCLUDING it is the
// load-bearing exclusion the residual=2 (NOT 37) rests on (WV-W4-HIGH-1).
const UI_VENDORED = "/demo/@/components/ui/";

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

// Blank /* … */ and // … comments (preserving newlines + length) so a doc-comment
// that NAMES a swept literal (the L2 deletion note "the raw 1.25rem was eyeballing
// …") does NOT false-positive — only LIVE declarations/markup count. Mirrors
// proof:idioms + proof:no-dup-utility `blankComments`.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

// The SOURCE files under the M1 roots, .vue + .css, with the vendored ui/ tree
// excluded (the residual=2 exclusion).
function sourceFiles() {
    const out = [];
    for (const root of ROOTS) {
        for (const abs of collect(path.join(DEMO, root), new Set([".vue", ".css"]))) {
            if (toPosix(abs).includes(UI_VENDORED)) continue;
            out.push(abs);
        }
    }
    return out;
}

console.log(
    "proof:phi-leaf-zero — H.W4 (the φ-hero chronic SYSTEM-property gate, CH-2/M1)",
);

// ── HALF 1 (the leaf-tail SWEEP) — zero raw rung, zero bare font-size ──────────
// Two sub-sweeps over the same SOURCE set. BITE: L1 `text-xl` / L2
// `font-size:1.25rem` are the live pre-fix residual (2); re-introduce a raw rung
// (the leaf-tail re-grows) → reds.
{
    const files = sourceFiles();

    // 1a — raw Tailwind body/display rungs (the C.W2 φ-sweep set). Word-bounded so
    // `.text-display-4` (a SEMANTIC φ rung) and `text-title`/`text-subheading` do
    // NOT match — only the raw `text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)` Tailwind
    // sizing utilities the φ-ladder retired.
    const RAW_RUNG = /\btext-(?:xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)\b/g;
    const rungHits = [];
    for (const abs of files) {
        const src = blankComments(read(abs));
        const lines = src.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const m = lines[i].match(RAW_RUNG);
            if (m) rungHits.push({ rel: relPosix(abs), line: i + 1, hits: m });
        }
    }
    const rungTotal = rungHits.reduce((n, h) => n + h.hits.length, 0);
    if (rungTotal > 0) {
        fail(
            `leaf-tail sweep (raw rungs) — ${rungTotal} raw ` +
                `text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl) rung(s) survive across ` +
                `${rungHits.length} site(s) in the demo SOURCE roots (ui/ + dist/ + ` +
                `SVG excluded). The φ-ladder leaf-tail must be ZERO — route each to ` +
                `a semantic φ class (text-title / text-subheading / …) or an icon-* ` +
                `idiom for a control glyph. Sites:\n      ` +
                rungHits
                    .map((h) => `${h.rel}:${h.line}  [${h.hits.join(", ")}]`)
                    .join("\n      "),
        );
    } else {
        ok(
            `leaf-tail sweep (raw rungs) — ZERO raw ` +
                `text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl) rung across the demo SOURCE ` +
                `roots (the residual L1 text-xl was routed to icon-lg; ui/ + dist/ + ` +
                `SVG excluded)`,
        );
    }

    // 1b — bare numeric font-size literals (the off-ladder px/rem the φ tokens
    // retire), EXCLUDING SVG user-space. The lone L4 not-a-defect is
    // `.axis-label { font-size: 0.055px }` inside the EasingCurveCanvas `<svg
    // viewBox>` — a fraction of a USER-SPACE unit, not a typographic rung. Detect
    // an SVG-internal selector structurally: a font-size rule whose selector block
    // is `.axis-label` (the SVG `<text>` class), confirmed below to be applied only
    // to `<text>` inside `<svg viewBox>`. Any OTHER bare font-size reds.
    const FONT_SIZE = /font-size:\s*[0-9.]/;
    const fsHits = [];
    for (const abs of files) {
        const rel = relPosix(abs);
        const blanked = blankComments(read(abs));
        const lines = blanked.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (!FONT_SIZE.test(lines[i])) continue;
            // Exclude SVG user-space: walk UP for the nearest selector open and
            // skip if it is an SVG-internal selector (.axis-label — the
            // EasingCurveCanvas `<text>` class inside the viewBox coordinate
            // system, the documented L4 not-a-defect). Verified structurally: the
            // file must carry both the `.axis-label` selector AND an `<svg
            // …viewBox=` host, AND the `.axis-label` must be applied only to
            // `<text>` (never a typographic HTML element).
            const selBlock = nearestSelector(lines, i);
            if (isSvgUserSpaceSelector(selBlock, blanked, read(abs))) continue;
            fsHits.push({ rel, line: i + 1, text: lines[i].trim() });
        }
    }
    if (fsHits.length > 0) {
        fail(
            `leaf-tail sweep (bare font-size) — ${fsHits.length} bare numeric ` +
                `font-size literal(s) survive in the demo SOURCE roots (SVG ` +
                `user-space + ui/ + dist/ excluded). Route each to a φ token ` +
                `(var(--type-*)); a raw font-size is off the φ ladder. Sites:\n      ` +
                fsHits.map((h) => `${h.rel}:${h.line}  ${h.text}`).join("\n      "),
        );
    } else {
        ok(
            `leaf-tail sweep (bare font-size) — ZERO bare numeric font-size in the ` +
                `demo SOURCE roots (the residual L2 1.25rem was routed to ` +
                `var(--type-subheading); the SVG user-space .axis-label is the ` +
                `documented L4 not-a-defect, excluded)`,
        );
    }
}

// ── HALF 2 (the hero on the TOP φ rung) — text-display-mega on the hero <h1> ───
// A static SOURCE-SHAPE check (flake-free; the CP-HIGH-3 / WV-W4-HIGH-1 pinning:
// "≥ --type-display-mega" compares two fluid clamp() tokens at runtime — unstable
// at narrow widths — so the static half asserts the resolved class is the TOP rung
// `text-display-mega`, the px-floor half being proof:hero-rung's browser clause).
// The audacious top tier is `text-display-mega` (glass-ui ships the ladder
// 1<2<3<4<5<audacious<hero<mega; mega is the peak, `≥ --type-display-mega`).
// BITE: revert the hero to `text-display-4` (the middle rung) → reds.
{
    const HERO = path.join(
        DEMO,
        "@/components/custom/editor-shell/EditorStartScreen.vue",
    );
    if (!fs.existsSync(HERO)) {
        fail(
            `hero on top φ rung — the start-screen hero file is missing ` +
                `(${relPosix(HERO)}); the M1 positive half cannot verify.`,
        );
    } else {
        const heroSrc = blankComments(read(HERO));
        // The hero <h1> opening tag (the LCP poster block). Capture its class span.
        const h1 = heroSrc.match(/<h1\b[^>]*>/);
        if (!h1) {
            fail(
                `hero on top φ rung — no <h1> found in ${relPosix(HERO)}; the hero ` +
                    `poster block is absent.`,
            );
        } else {
            const h1Tag = h1[0];
            const onMega = /\btext-display-mega\b/.test(h1Tag);
            // Guard against a regression to a LOWER rung (text-display-{1..5}/
            // audacious/hero) — only `mega` is `≥ --type-display-mega`.
            const lowerRung = h1Tag.match(
                /\btext-display-(?:[1-5]|audacious|hero)\b/,
            );
            if (onMega && !lowerRung) {
                ok(
                    `hero on top φ rung — the start-screen <h1> carries ` +
                        `text-display-mega (φ^(9/2), the audacious poster-hero tier ` +
                        `≥ --type-display-mega; peak 177px @1440)`,
                );
            } else {
                fail(
                    `hero on top φ rung — the start-screen <h1> must carry ` +
                        `text-display-mega (the audacious top tier ≥ --type-display-mega), ` +
                        `found: ${JSON.stringify(h1Tag)}` +
                        (lowerRung
                            ? ` — it is on the LOWER rung "${lowerRung[0]}" (a φ-rung ` +
                              `regression below the top tier)`
                            : ` — no text-display-mega rung present`) +
                        `. The hero is the textbook poster-hero consumer; it must reach ` +
                        `the audacious tier glass-ui built for it (H.W4 S3).`,
                );
            }
        }
    }
}

// ── helpers (SVG user-space detection) ────────────────────────────────────────
// Find the nearest preceding selector open (a `… {` line) for line index `i` in a
// CSS/<style> block — the rule whose body holds the font-size. Returns the selector
// text (everything before the `{`), trimmed; "" if none on the same brace-depth.
function nearestSelector(lines, i) {
    for (let j = i; j >= 0; j--) {
        const open = lines[j].indexOf("{");
        if (open !== -1) {
            // The selector is the text on this line up to the `{` (plus any
            // continuation on the prior line for multi-line selectors — the SVG
            // case is single-line `.axis-label {`, so the same-line form suffices).
            return lines[j].slice(0, open).trim();
        }
        // A closing brace before an open means we left the enclosing rule.
        if (lines[j].includes("}") && j < i) break;
    }
    return "";
}

// True iff `selector` is an SVG-internal selector whose font-size is a USER-SPACE
// unit (the documented L4 not-a-defect). The structural proof: (1) the selector is
// `.axis-label` (the EasingCurveCanvas SVG `<text>` class), (2) the file hosts an
// `<svg …viewBox=` with a unit-fraction viewBox (the `0 … 1 …` coordinate system),
// and (3) `.axis-label` is applied ONLY to `<text>` elements (never a typographic
// HTML tag). All three must hold — a `.axis-label` re-used on an HTML element, or a
// font-size on any OTHER selector, does NOT qualify (the gate still bites there).
function isSvgUserSpaceSelector(selector, blankedSrc, rawSrc) {
    if (!/\.axis-label\b/.test(selector)) return false;
    // The viewBox host: an <svg …viewBox="0 …"> whose coordinate system ORIGIN is
    // a bare `0` unit (the EasingCurveCanvas `viewBox="`0 ${viewBox.minY} 1 …`"`,
    // 1 user-space unit wide). The viewBox attr may be a Vue binding (`:viewBox` /
    // a template literal), so match a `viewBox` whose value begins with `0 ` /
    // `` `0 `` after the `=`/`="`/`` =` ``. A pixel-scaled viewBox would make
    // font-size a pixel rung again — this requires the unit-fraction origin.
    // The value may be a plain string (`viewBox="0 …"`), a Vue binding to a
    // template literal (`:viewBox="`0 …`"` — a `"` then a `` ` `` before the 0), or
    // a single-quoted form. Allow any run of quote/backtick wrappers before the
    // bare `0 ` origin.
    const hasUnitViewBox = /viewBox\s*=\s*[`"']*\s*0\s/.test(rawSrc);
    // `.axis-label` is applied only to <text> (the SVG glyph), never an HTML tag —
    // so the font-size resolves in SVG user space, never a typographic context.
    const appliedTags = [
        ...rawSrc.matchAll(/<(\w+)[^>]*class\s*=\s*"[^"]*\baxis-label\b[^"]*"/g),
    ].map((m) => m[1].toLowerCase());
    const svgTextOnly =
        appliedTags.length > 0 && appliedTags.every((t) => t === "text");
    return hasUnitViewBox && svgTextOnly;
}

// ── report ────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:phi-leaf-zero — FAIL (${failures.length}): the φ-hero chronic ` +
            `SYSTEM property (CH-2/M1) is unmet — either a raw rung survives (the ` +
            `leaf-tail re-grew) OR the hero is below the audacious top φ rung. BOTH ` +
            `halves are load-bearing: the M1 escape (the chronic closes while raw ` +
            `rungs linger, OR the hero stays middle-rung) is structurally locked, ` +
            `not papered.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:phi-leaf-zero — PASS: zero raw rungs across the demo SOURCE roots AND " +
        "the hero on the audacious top φ rung (text-display-mega). Both halves of " +
        "the M1 system property hold; the φ-hero chronic is closeable (H.W4, CH-2/M1).",
);
