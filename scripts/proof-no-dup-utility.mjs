#!/usr/bin/env node
/**
 * proof:no-dup-utility — H.W2 S4 + S1 + S6 (the no-legacy static lock).
 *
 * The H.W2 gestalt move is a NET-DELETION: the radial catch-light dies because
 * the glass-ui surface map STOPS EMITTING the class (every kf-owned `<Card>`
 * flipped to `surface="cartoon"`), and the redundant manual plates are removed in
 * the SAME edit. Three deletions must STAY deleted — a replaced surface living
 * beside its replacement is the no-legacy violation the spine forbids. This is the
 * SOURCE-SHAPE belt that reds the instant any of the three is re-introduced.
 *
 * CLAUSES (each BITES on the exact negative case it forbids — verified, not
 * asserted; mirrors proof:idioms / proof:single-writer / proof:demo-shell-grid):
 *
 *   1. NO DEMO .scale-on-hover RULE (S4 — A3 no-legacy). The demo CSS contributes
 *      ZERO `.scale-on-hover` RULE; the 13 call-sites resolve glass-ui's
 *      first-class `@utility scale-on-hover` (`utilities.css:680-690`, the IDENTICAL
 *      recipe glass-ui extracted FROM the demo). Sweeps demo `.css` for an ANCHORED
 *      rule-open `/\.scale-on-hover\s*\{/` — the STRICT anchor, NOT proof:idioms'
 *      loose `/\.scale-on-hover\b/` (which a DELETION COMMENT satisfies — the
 *      vacuous pass §11 flagged: the two gates are in direct contradiction and THIS
 *      one is correct). BITE: re-author the deleted `.scale-on-hover { … }` block
 *      in design-idioms.css → an anchored rule-open re-appears → reds.
 *
 *   2. NO <Card> CARRIES THE MANUAL .glass-card PLATE (S1 — CS-3). After the
 *      surface flip, the Card's own `glass-${tier}` owns the background/blur/border
 *      plate; the manual `.glass-card` utility on a `<Card>` is the deleted
 *      double-plate. Asserts `grep glass-card demo/ | grep "<Card"` = 0 — every
 *      `glass-card` occurrence on a root `<Card …>` opening tag (NOT a `<CardContent>`
 *      / `<CardHeader>` / a bare `<div>`) is gone. BITE: re-add `class="… glass-card"`
 *      to any `<Card>` → reds.
 *
 *   3. glass-card RESOLVES ONLY TO THE ENUMERATED INTENTIONAL-STATIC STAGE SET
 *      (S6 — HD-4, the second-depth-idiom guard). The bare `<div class="glass-card">`
 *      scene stages were NOT `<Card>` (so clause 2 misses them); S6 adopted
 *      `glass-resting cartoon-surface` for ALL of them, so the survivor set is the
 *      EMPTY set (cleaner than a NAMED-exception list). Asserts every `glass-card`
 *      token in demo SOURCE (`.vue` + `.css`, excluding the gate's own home) is in
 *      the enumerated INTENTIONAL_STATIC set — today that set is EMPTY (zero
 *      survivors). BITE: a re-introduced bare `glass-card` stage div that is NOT in
 *      the enumerated set → reds (a second depth idiom standing beside cartoon).
 *
 * SCOPE NOTE — demo/ carries per-sub-demo BUILD outputs (the sub-demo dist dirs) that
 * inline glass-ui's compiled CSS (including `.scale-on-hover` + `.glass-card` from
 * the vendored cascade). Those are NOT demo SOURCE — the sweep skips every `dist/`
 * + `node_modules/` segment (mirrors proof:idioms' SKIP_DIR + the proof:demo-*
 * gates), so a built artifact never false-reds the source-shape clause.
 *
 * Static grep gate (no browser, no build). Re-runnable:
 * `node scripts/proof-no-dup-utility.mjs`.
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

// Skip vendored / built / dep trees: the per-sub-demo `dist/` outputs inline
// glass-ui's compiled CSS (.scale-on-hover, .glass-card) — those are NOT demo
// source and must never false-red a source-shape clause.
const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

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
// that NAMES the deleted apparatus (the S4 deletion note, an S6 history note) does
// NOT false-positive — only LIVE declarations/markup count. (Mirrors proof:idioms
// + proof:demo-shell-grid `blankComments`.) CSS has only /* … */; .vue templates
// carry both, so we strip both shapes.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

// The S6 enumerated INTENTIONAL-STATIC stage set. S6 adopted option (a)
// (`glass-resting cartoon-surface`) for ALL bare-div stages, so the survivor set
// is EMPTY (zero `.glass-card` in demo source). If a future lane elects option (b)
// (a NAMED static-plate stage), enumerate it HERE as `path:line` — the clause then
// asserts the survivor set EQUALS this allowlist exactly, never a silent survivor.
const INTENTIONAL_STATIC = new Set(
    [
        // (intentionally empty — S6 routed every stage to glass-resting cartoon-surface)
    ],
);

console.log("proof:no-dup-utility — H.W2 S4+S1+S6 (no legacy beside replacement)");

// ── 1. NO DEMO .scale-on-hover RULE (S4) ─────────────────────────────────────
{
    // The STRICT anchor: a rule selector immediately followed by `{` (optionally
    // through a comma group, e.g. `.scale-on-hover, .x {`). proof:idioms' loose
    // `/\.scale-on-hover\b/` matches the deletion COMMENT text — the vacuous pass
    // §11 flagged. This clause anchors on the rule's opening brace so a renamed/
    // commented mention does NOT satisfy it: only a LIVE re-authored rule reds.
    const RULE_OPEN = /\.scale-on-hover\b[^{}]*\{/;
    const cssFiles = collect(DEMO, new Set([".css"]));
    const hits = [];
    for (const abs of cssFiles) {
        const src = blankComments(read(abs));
        const lines = src.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (RULE_OPEN.test(lines[i])) hits.push(`${relPosix(abs)}:${i + 1}`);
        }
    }
    if (hits.length > 0) {
        fail(
            `no demo .scale-on-hover RULE (S4) — the demo re-authors glass-ui's ` +
                `@utility scale-on-hover (a no-legacy violation). Delete the rule; ` +
                `the call-sites resolve glass-ui's @utility with zero churn. Live ` +
                `rule-open(s):\n      ` +
                hits.join("\n      "),
        );
    } else {
        ok(
            `no demo .scale-on-hover rule — the demo CSS contributes ZERO ` +
                `.scale-on-hover rule-open (strict /\\.scale-on-hover…{/, not the ` +
                `comment-matching loose regex); the 13 sites resolve glass-ui's @utility`,
        );
    }
}

// ── 2. NO <Card> CARRIES THE MANUAL .glass-card PLATE (S1) ───────────────────
{
    // `grep glass-card demo/ | grep "<Card"` = 0. A root `<Card …>` opening tag
    // carrying `glass-card` is the deleted double-plate. Match a `<Card` opening
    // tag (the root, NOT `<CardContent`/`<CardHeader`/`<CardTitle`/`<CardFooter`/
    // `<CardDescription>`) whose attribute span (up to the closing `>`) contains
    // `glass-card`. Templates can wrap, so test on the comment-blanked WHOLE file
    // by walking each `<Card` open through its terminating `>`.
    const vueFiles = collect(DEMO, new Set([".vue"]));
    const hits = [];
    const CARD_OPEN = /<Card(?![A-Za-z])/g; // <Card but not <CardContent etc.
    for (const abs of vueFiles) {
        const src = blankComments(read(abs));
        for (const m of src.matchAll(CARD_OPEN)) {
            const start = m.index;
            const close = src.indexOf(">", start);
            const tag = src.slice(start, close === -1 ? start + 400 : close + 1);
            if (/\bglass-card\b/.test(tag)) {
                const line = src.slice(0, start).split("\n").length;
                hits.push(`${relPosix(abs)}:${line}`);
            }
        }
    }
    if (hits.length > 0) {
        fail(
            `no <Card> carries the manual .glass-card plate (S1, CS-3) — the Card's ` +
                `own glass-\${tier} owns the plate after the surface flip; a manual ` +
                `.glass-card is the deleted double-plate. Offending <Card> tag(s):\n      ` +
                hits.join("\n      "),
        );
    } else {
        ok(
            `no <Card> carries glass-card — grep "glass-card" demo | grep "<Card" = 0 ` +
                `(the manual double-plate is deleted; the Card surface owns the plate)`,
        );
    }
}

// ── 3. glass-card RESOLVES ONLY TO THE ENUMERATED INTENTIONAL-STATIC SET (S6) ─
{
    // Every `glass-card` TOKEN in demo SOURCE (.vue + .css, comment-blanked,
    // excluding the gate's own home + the design-idioms layer) must be in the
    // enumerated INTENTIONAL_STATIC set. Today that set is EMPTY → the survivor set
    // must be EMPTY. A bare `<div class="glass-card">` stage div re-introduced
    // outside the allowlist is a second depth idiom standing beside cartoon → reds.
    // Match `glass-card` as a class TOKEN (word-bounded), so `glass-card-foo` or a
    // `.glass-cardish` does not false-match; this also catches the bare-div stages
    // clause 2 (Card-scoped) misses.
    const GLASS_CARD_TOK = /\bglass-card\b/;
    const srcFiles = collect(DEMO, new Set([".vue", ".css"]));
    const survivors = [];
    for (const abs of srcFiles) {
        const rel = relPosix(abs);
        const src = blankComments(read(abs));
        const lines = src.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (!GLASS_CARD_TOK.test(lines[i])) continue;
            const site = `${rel}:${i + 1}`;
            if (!INTENTIONAL_STATIC.has(site)) survivors.push(site);
        }
    }
    if (survivors.length > 0) {
        fail(
            `glass-card resolves only to the enumerated intentional-static set (S6, ` +
                `HD-4) — the survivor set must equal INTENTIONAL_STATIC (today EMPTY: ` +
                `every stage routed to glass-resting cartoon-surface). Un-enumerated ` +
                `glass-card survivor(s) — a second depth idiom beside cartoon:\n      ` +
                survivors.join("\n      ") +
                `\n    Adopt glass-resting cartoon-surface (the one demo-wide depth ` +
                `idiom), OR add the site to INTENTIONAL_STATIC as a NAMED static-plate ` +
                `delta (never a silent survivor).`,
        );
    } else {
        ok(
            `glass-card resolves only to the enumerated intentional-static set ` +
                `(${INTENTIONAL_STATIC.size} enumerated; ${survivors.length} survivor) — ` +
                `the bare-div stages adopted glass-resting cartoon-surface (one depth ` +
                `idiom demo-wide, S6)`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-dup-utility — FAIL (${failures.length}): a replaced surface ` +
            `lives beside its replacement (a re-authored .scale-on-hover rule / a manual ` +
            `.glass-card double-plate on a <Card> / an un-enumerated glass-card stage). ` +
            `H.W2 is a net-deletion — the legacy must stay deleted (no-legacy, A3/CS-3/HD-4).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-dup-utility — PASS: zero demo .scale-on-hover rule, zero <Card> " +
        "glass-card double-plate, glass-card resolves only to the enumerated " +
        "intentional-static set (empty). The legacy stays deleted (H.W2 S4/S1/S6).",
);
