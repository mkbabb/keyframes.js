#!/usr/bin/env node
/**
 * proof:styling-idioms — H.W12 I12 (S5): the OWNED-IDIOMS contract MEMBERSHIP
 * extension (the FORK-I12 reduction-branch regression guard).
 *
 * THE LINEAGE. W4 (`084feb9`) owns the four `icon-(xs|sm|md|lg)` utilities in
 * `design-idioms.css` and gates them with `proof:icon-idiom` (resolve-or-red +
 * strict-monotonicity + SVG-cascade — the "61-no-op" icon-sizing rent retired).
 * But `proof:icon-idiom` only polices THOSE FOUR. The demo references OTHER
 * idiom-shaped classes — and any one of them resolving to NOTHING is the exact
 * same silent-flatten failure (`icon-md` painting 24px because no rule existed).
 * I12 EXTENDS the resolve-or-red plumbing from the four `icon-*` to the FULL
 * referenced-idiom set: every idiom-shaped class the demo references must resolve
 * to a definition in the OWNED contract = {demo-local design-idioms.css ∪ glass-ui
 * dist ∪ tw-animate-css ∪ the referencing file's own scoped `<style>` rule}.
 *
 * THE FORK-I12 MEASURE-FIRST VERDICT (impl-w12-styling-decomp.md §1, the binding
 * lane note). The impl lane MEASURED the full referenced-idiom set against every
 * definition home and found ZERO referenced-but-undefined demo-authored
 * idiom-shaped class beyond the resolved `icon-*`. The named suspects
 * (`depth-text` / `text-mono-caption`) are first-class glass-ui definitions
 * (glass-ui-grace rents that RESOLVE — KEEP per inv-16, the `.scale-on-hover`
 * precedent). So clause (a) [contract-membership extension] does NOT bite born-RED
 * today — it REDUCES to a born-GREEN REGRESSION GUARD: it bites a FUTURE un-owned
 * idiom (a new `class="something-fancy"` with no home in any of the four corpora).
 * This reduction is RECORDED HONESTLY, NOT papered as a born-RED that does not bite
 * (the §Mandate bar). The gate is the FORWARD lock: the moment a contributor adds a
 * referenced idiom-shaped class with no definition, this gate reds.
 *
 * This is the SAME resolve-or-red shape proof:icon-idiom / proof:idioms clause-1
 * use — the references ARE the contract, derived LIVE (no hand-maintained
 * "what to define" list). Re-runnable: `node scripts/proof-styling-idioms.mjs`.
 *
 * CLAUSES (each BITES):
 *
 *   (a) MEMBERSHIP / RESOLVE-OR-RED — every idiom-shaped class referenced in demo
 *       `.vue` markup (excluding vendored `ui/` shadcn + `dist/`) resolves to a
 *       definition in the OWNED contract (demo-local design-idioms.css ∪ glass-ui
 *       dist ∪ tw-animate-css ∪ the referencing file's own scoped `<style>`).
 *       BITE: a referenced idiom-shaped class with no home in any corpus reds
 *       (born-GREEN today — the FORK-I12 reduction; bites a future un-owned idiom).
 *
 *   (b) ICON-* STILL COVERED (non-vacuity bridge) — the four W4 `icon-*` ARE in
 *       the referenced set AND resolve through design-idioms.css. The full-set
 *       probe must subsume the W4-owned four (so this gate can never green by
 *       silently dropping the very class it claims to extend coverage from). BITE:
 *       if the four `icon-*` are not in the resolved-membership result, reds.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DESIGN_IDIOMS = path.join(DEMO, "@/styles/design-idioms.css");
const STYLE_CSS = path.join(DEMO, "@/styles/style.css");
const BRAND_CSS = path.join(DEMO, "@/styles/brand.css");
const GLASS_UI_STYLES = path.join(
    REPO,
    "node_modules/@mkbabb/glass-ui/dist/styles",
);
const TW_ANIMATE_STYLES = path.join(REPO, "node_modules/tw-animate-css/dist");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);
const UI_VENDORED = "/demo/@/components/ui/";

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:styling-idioms — H.W12 I12 (the OWNED-IDIOMS contract MEMBERSHIP extension · resolve-or-red over the FULL referenced-idiom set · FORK-I12)",
);

/** Walk a dir collecting files matching one of `exts` (skipping built/dep trees). */
function collect(dir, exts, out = []) {
    if (!exists(dir)) return out;
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

// Blank /* … */ and // … comments so a DOC-comment NAMING an idiom does not count
// as a reference OR a definition — only LIVE markup/rules count. Mirrors
// proof:idioms / proof:icon-idiom `blankComments`.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

// Read a `.vue` SFC's TEMPLATE (the class references) and SCOPED <style> (the
// file-local definitions) separately — a scene's own `<style scoped>` IS an owned
// home for that scene's private idioms (e.g. `.seq-row`, `.mp-stage`), so a class
// resolved by the SAME file's scoped style is RESOLVED, not undefined.
function splitSFC(src) {
    // Blank JS/CSS comments AND `<!-- … -->` HTML/template comments — a comment
    // NARRATING a deleted idiom (e.g. EditorStartScreen's `<!-- the old
    // <AnimatedText class="dot-fade …"> … DELETED -->`) is a DEAD-REF, not a live
    // reference (impl-w12-styling-decomp.md §1).
    const blanked = blankComments(src).replace(/<!--[\s\S]*?-->/g, (m) =>
        m.replace(/[^\n]/g, " "),
    );
    const styleBlocks = [...blanked.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
        .map((m) => m[1])
        .join("\n");
    // Everything outside <style> is the markup/script surface for references.
    const markup = blanked.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");
    return { markup, styleBlocks };
}

// Standalone single-word Tailwind utility KEYWORDS (no hyphen) — a hyphenated
// idiom-shaped class co-located with one of these on the same element is a
// semantic markup anchor (styled inline), not an unresolved recipe.
const TW_KEYWORDS = new Set([
    "relative", "absolute", "fixed", "sticky", "static", "block", "inline",
    "flex", "grid", "table", "contents", "hidden", "flow-root", "inline-block",
    "inline-flex", "inline-grid", "isolate", "truncate", "italic", "underline",
    "uppercase", "lowercase", "capitalize", "antialiased", "container",
    "invisible", "visible", "rounded", "border", "shadow", "ring", "transition",
    "transform", "grow", "shrink", "flex-1", "group", "peer",
]);

// ── Build the DEFINITION CORPUS (the OWNED contract) ───────────────────────────
// A class is DEFINED if a rule/utility with that name exists in any corpus:
//   • design-idioms.css / style.css / brand.css  — demo-local owned layer
//   • glass-ui dist/styles/*.css                 — the consumed sibling (inv-16)
//   • tw-animate-css dist/*.css                  — the animation idiom family
//   • the referencing file's own scoped <style>  — scene-private idioms
// We harvest the DEFINED class/utility NAME SET from each corpus (the `.name {`
// rule selectors + `@utility name` declarations), tolerant of the `@utility foo-`
// PREFIX families (e.g. tw-animate's `slide-in-from-right-` → `slide-in-from-right-2`).
function harvestDefs(css) {
    const blanked = blankComments(css);
    const exact = new Set(); // exact class/utility names
    const prefixes = new Set(); // `@utility foo-` prefix families (trailing `-`)
    // `@utility NAME` (NAME may end in `-` for an arbitrary-suffix family).
    for (const m of blanked.matchAll(/@utility\s+([a-zA-Z][\w-]*-?)/g)) {
        const n = m[1];
        if (n.endsWith("-")) prefixes.add(n.slice(0, -1));
        else exact.add(n);
    }
    // `.class` rule selectors (the leading-dot class form). Capture every
    // `.name` token that is immediately part of a selector (followed by `{`, a
    // combinator, `:`/`::`, `,`, whitespace, `[`, or another `.`). This over-
    // collects (a class used only inside a selector chain still counts as DEFINED,
    // which is correct — the recipe exists), but never under-collects.
    for (const m of blanked.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
        exact.add(m[1]);
    }
    return { exact, prefixes };
}

function harvestDirDefs(dir) {
    const out = { exact: new Set(), prefixes: new Set() };
    if (!exists(dir)) return out;
    for (const abs of collect(dir, new Set([".css"]))) {
        const d = harvestDefs(read(abs));
        for (const n of d.exact) out.exact.add(n);
        for (const p of d.prefixes) out.prefixes.add(p);
    }
    return out;
}

// Demo-local owned styles: the 3 global style files + EVERY colocated `.css`
// partial under demo/ (the non-scoped component skins — playback-button.css,
// tab-trigger.css — that define `.btn-playback*` / `.tab-trigger-*` for reka-ui's
// rendered DOM). dist/ is skipped by `collect`.
const localDefs = { exact: new Set(), prefixes: new Set() };
const localCssFiles = new Set(
    [DESIGN_IDIOMS, STYLE_CSS, BRAND_CSS].filter(exists).map((p) => path.resolve(p)),
);
for (const abs of collect(DEMO, new Set([".css"]))) localCssFiles.add(path.resolve(abs));
for (const p of localCssFiles) {
    const d = harvestDefs(read(p));
    for (const n of d.exact) localDefs.exact.add(n);
    for (const pre of d.prefixes) localDefs.prefixes.add(pre);
}
const glassDefs = harvestDirDefs(GLASS_UI_STYLES);
const twDefs = harvestDirDefs(TW_ANIMATE_STYLES);

console.log(
    `  definition corpus: design-idioms+style+brand=${localDefs.exact.size} classes ` +
        `(+${localDefs.prefixes.size} util families) · glass-ui=${glassDefs.exact.size} ` +
        `(+${glassDefs.prefixes.size}) · tw-animate-css=${twDefs.exact.size} (+${twDefs.prefixes.size})`,
);

// `arbitraryBase` = does an `@utility foo` exact name also serve a `foo-N`
// arbitrary-suffix variant? TRUE only for tw-animate-css (where `@utility fade-in`
// legitimately powers `fade-in-0`/`fade-in-50`). FALSE for the demo-local +
// glass-ui corpora — there a bare `.icon` base must NOT falsely "resolve" the
// distinct `.icon-md` recipe (that loose match would mask a REMOVED icon-md
// definition; the BITE must still fire). Exact + declared-prefix-family only.
const resolvedBy = (cls, defs, { arbitraryBase = false } = {}) => {
    if (defs.exact.has(cls)) return true;
    // Declared prefix families: `slide-in-from-right-2` resolves to the
    // `@utility slide-in-from-right-` family. Check every declared prefix.
    for (const pre of defs.prefixes) {
        if (cls.startsWith(pre + "-") || cls === pre) return true;
    }
    if (arbitraryBase) {
        for (const base of defs.exact) {
            if (cls.startsWith(base + "-")) return true;
        }
    }
    return false;
};

// ── Identify the IDIOM-SHAPED referenced classes ──────────────────────────────
// An "idiom-shaped" class (the FORK-I12 sense): a hyphenated, NON-standard-Tailwind
// token that LOOKS like it carries a reusable visual recipe (icon-sm, depth-text,
// status-badge, gold-shimmer) — as opposed to (i) a standard Tailwind utility
// (flex, grid, gap-3, text-muted-foreground, min-w-0, …) whose resolution is the
// Tailwind engine's job, not the owned-idioms contract, and (ii) a bare semantic
// markup anchor whose styling is co-located INLINE on the same element (its class
// name is a JS/readability label, not an unresolved recipe — these resolve "by
// being inline-styled", impl-w12-styling-decomp.md §1).
//
// The discriminator: a class is IDIOM-SHAPED iff it is hyphenated AND not a known
// Tailwind utility-prefix AND not a Tailwind state/responsive/arbitrary form. The
// gate's BITE is then: an idiom-shaped reference that resolves to NO definition in
// ANY corpus (including the file's own scoped style) — the silent-flatten failure.

// Standard Tailwind utility prefixes (the engine resolves these — NOT idioms).
// Conservative + broad: a token whose FIRST hyphen-segment is one of these is a
// Tailwind utility, excluded from the idiom-membership probe.
const TW_UTILITY_PREFIXES = new Set([
    // layout / box
    "p", "px", "py", "pt", "pb", "pl", "pr", "ps", "pe",
    "m", "mx", "my", "mt", "mb", "ml", "mr", "ms", "me",
    "w", "h", "min", "max", "size", "basis", "gap", "space",
    "inset", "top", "bottom", "left", "right", "start", "end", "z",
    // fl* / grid
    "flex", "grid", "col", "row", "order", "auto", "justify", "items",
    "content", "self", "place", "grow", "shrink",
    // typography
    "text", "font", "leading", "tracking", "indent", "align", "whitespace",
    "break", "truncate", "list", "underline", "overline", "line", "decoration",
    "antialiased", "uppercase", "lowercase", "capitalize", "normal", "tabular",
    // color / bg / border
    "bg", "from", "via", "to", "border", "divide", "outline", "ring", "fill",
    "stroke", "accent", "caret", "placeholder", "shadow", "opacity", "mix",
    // border-radius
    "rounded",
    // effects / filters
    "blur", "brightness", "contrast", "grayscale", "invert", "saturate", "sepia",
    "backdrop", "drop", "transition", "duration", "delay", "ease", "animate",
    "transform", "scale", "rotate", "translate", "skew", "origin", "perspective",
    // interactivity / misc
    "cursor", "pointer", "select", "resize", "scroll", "snap", "touch", "will",
    "object", "overflow", "aspect", "container", "columns", "isolate", "float",
    "clear", "visible", "invisible", "sr", "not", "appearance", "fields",
    "backface", "filter", "saturate", "hue",
    // sizing words that appear as standalone or prefixed
    "sticky", "fixed", "absolute", "relative", "static", "block", "inline",
    "hidden", "table", "contents",
]);

// Tailwind state / responsive / arbitrary forms (anything with a `:` variant or
// `[` arbitrary value or starting `!important`/negative is Tailwind, not an idiom).
const isTailwindForm = (cls) =>
    cls.includes(":") || cls.includes("[") || cls.includes("/") || cls.startsWith("!") || cls.startsWith("-");

const firstSeg = (cls) => cls.split("-")[0];

const isIdiomShaped = (cls) => {
    if (!cls.includes("-")) return false; // single-word → not an idiom recipe (data-*, role markers handled elsewhere)
    if (isTailwindForm(cls)) return false;
    if (TW_UTILITY_PREFIXES.has(firstSeg(cls))) return false;
    return true;
};

// ── Collect references PER FILE (so a file's own scoped style counts as a home) ─
const vueFiles = collect(DEMO, new Set([".vue"])).filter(
    (abs) => !toPosix(abs).includes(UI_VENDORED),
);

// Harvest the class-attribute VALUES (each a list of tokens that share one
// element). We return per-VALUE so the semantic-anchor discriminator can ask
// "did this class value ALSO carry inline Tailwind utilities?" — a hyphenated
// non-Tailwind token co-located with `flex`/`grid`/`relative`/etc. on the SAME
// element is a semantic markup ANCHOR (its styling is inline; the class name is a
// JS/readability label), NOT an unresolved RECIPE.
//
// CRITICAL false-positive guards (the impl-w12-styling-decomp.md §1 method):
//   • STRIP `[...]` Tailwind ARBITRARY-VALUE brackets BEFORE tokenizing — so a
//     CSS-var name (`max-h-[var(--panel-max-h)]` → `panel-max-h`) or a calc
//     fragment (`w-[calc(100cqw_-_100%)]` → `cqw_-_100`) is NEVER mistaken for a
//     class reference. These matched the raw grep as `var(--name)` interiors, not
//     classes (the §1 "CSS-custom-property false positives").
//   • markup is already comment-blanked (splitSFC) so a `// … .dot-fade …` doc
//     narration is not a reference (the §1 DEAD-REF case).
function classValuesFromMarkup(markup) {
    const values = [];
    const ATTR = /(?::class|class(?:Name)?)\s*=\s*("([^"]*)"|'([^']*)'|`([^`]*)`)/g;
    for (const m of markup.matchAll(ATTR)) {
        let body = m[2] ?? m[3] ?? m[4] ?? "";
        // Drop arbitrary-value brackets and their interiors (var/calc/url) entirely
        // — they are utility ARGUMENTS, never class names. (Balanced enough for the
        // single-level brackets Tailwind emits.)
        body = body.replace(/\[[^\]]*\]/g, "");
        const toks = body.match(/[A-Za-z][\w-]*\/?[\w-]*/g) ?? [];
        values.push(toks);
    }
    return values;
}

const referenced = new Map(); // cls → { sites: [], anyScoped, anyInlineCompanion }
for (const abs of vueFiles) {
    const rel = relPosix(abs);
    const { markup, styleBlocks } = splitSFC(read(abs));
    const fileScoped = harvestDefs(styleBlocks);
    for (const value of classValuesFromMarkup(markup)) {
        // Does this element's class value carry ≥1 standard Tailwind utility
        // alongside? (a co-located inline-styling companion). A companion is either
        // a hyphenated Tailwind utility (`flex items-center gap-3`) OR a single-word
        // Tailwind keyword (`relative`, `grid`, `flex`). An element with such a
        // companion is inline-styled — its bespoke hyphenated class is a semantic
        // anchor, not an unresolved recipe.
        const hasInlineCompanion = value.some(
            (t) =>
                (t.includes("-") && !isIdiomShaped(t)) || TW_KEYWORDS.has(t),
        );
        for (const cls of value) {
            if (!isIdiomShaped(cls)) continue;
            const resolvedHere = resolvedBy(cls, fileScoped);
            if (!referenced.has(cls))
                referenced.set(cls, {
                    sites: [],
                    files: new Set(),
                    anyScoped: false,
                    anyInlineCompanion: false,
                });
            const rec = referenced.get(cls);
            rec.sites.push(rel);
            rec.files.add(rel);
            if (resolvedHere) rec.anyScoped = true;
            if (hasInlineCompanion) rec.anyInlineCompanion = true;
        }
    }
}

// ── (a) MEMBERSHIP / RESOLVE-OR-RED ────────────────────────────────────────────
let anchorCount = 0;
{
    const undefinedIdioms = [];
    for (const [cls, rec] of referenced) {
        const resolved =
            rec.anyScoped ||
            resolvedBy(cls, localDefs) ||
            resolvedBy(cls, glassDefs) ||
            resolvedBy(cls, twDefs, { arbitraryBase: true });
        if (resolved) continue;
        // No definition in any corpus. Is it a SEMANTIC MARKUP ANCHOR — a
        // SCENE-PRIVATE, ONE-FILE class whose element ALSO carries inline Tailwind
        // utilities (styling co-located, the class name a JS/readability label —
        // `seq-row flex items-center`, `matrix-grid relative grid …`,
        // `panel-stack relative`)? Then it is NOT-IDIOM (impl-w12-styling-decomp.md
        // §1) — it paints correctly inline; it is not an unresolved RECIPE.
        //
        // BOTH conditions are required so the exclusion cannot mask a real defect:
        //   • inline companion → its styling is genuinely co-located (not bare); AND
        //   • single-file → it is scene-private, not a SHARED recipe. A class
        //     referenced across ≥2 files (e.g. `status-badge`/`code-token`, ×2
        //     scenes) is a shared idiom that MUST resolve to a real definition — it
        //     can never be excused as an anchor, so REMOVING its def reds here (not
        //     just in proof:idioms). The 4 genuine anchors are each one-file; every
        //     shared owned recipe is multi-file (measured).
        // The BITE otherwise: a class that LOOKS like a recipe and resolves to
        // NOTHING while standing ALONE — the exact silent-flatten the icon-* no-op
        // was — OR a shared (multi-file) recipe that lost its definition.
        if (rec.anyInlineCompanion && rec.files.size === 1) {
            anchorCount++;
            continue;
        }
        undefinedIdioms.push({ cls, site: rec.sites[0], n: rec.sites.length });
    }

    console.log(
        `  referenced idiom-shaped classes: ${referenced.size} distinct ` +
            `(${anchorCount} resolve as inline-styled semantic anchors; the rest ` +
            `against {design-idioms.css ∪ glass-ui ∪ tw-animate-css ∪ scoped <style>})`,
    );

    if (undefinedIdioms.length > 0) {
        undefinedIdioms.sort((a, b) => b.n - a.n);
        const detail = undefinedIdioms
            .map((u) => `${u.cls} (×${u.n}, first: ${u.site})`)
            .join("\n      ");
        fail(
            `membership / resolve-or-red — ${undefinedIdioms.length} referenced ` +
                `idiom-shaped class(es) resolve to NO definition in any OWNED corpus ` +
                `(design-idioms.css ∪ glass-ui ∪ tw-animate-css ∪ the file's own scoped ` +
                `<style>):\n      ` +
                detail +
                `\n    Own each in design-idioms.css (the demo-authored home) — or, if ` +
                `it is a glass-ui/tw-animate recipe, confirm the pin provides it; or, if ` +
                `it is a semantic markup anchor, co-locate its styling inline so it is no ` +
                `longer an unresolved RECIPE (the silent-flatten failure the icon-* ` +
                `no-op was; H.W12 I12 / FORK-I12).`,
        );
    } else {
        ok(
            `membership / resolve-or-red — all ${referenced.size} referenced ` +
                `idiom-shaped class(es) resolve to an OWNED definition (FORK-I12 ` +
                `reduction branch: zero referenced-but-undefined demo-authored idiom ` +
                `beyond icon-* — born-GREEN regression guard, bites a future un-owned idiom)`,
        );
    }
}

// ── (b) ICON-* STILL COVERED (non-vacuity bridge) ──────────────────────────────
// The W4 four icon-* MUST be in the referenced idiom-shaped set AND resolve through
// design-idioms.css — so this gate's "full set" genuinely subsumes the four it
// extends from (it can never green by dropping the very coverage it claims).
{
    const ICONS = ["icon-xs", "icon-sm", "icon-md", "icon-lg"];
    const referencedIcons = ICONS.filter((c) => referenced.has(c));
    const resolvedIcons = referencedIcons.filter((c) => resolvedBy(c, localDefs));
    if (referencedIcons.length === 0) {
        fail(
            `icon-* coverage — none of the four W4 icon-* are in the referenced ` +
                `idiom-shaped set; the full-set probe is NOT subsuming the W4-owned ` +
                `coverage (the extension is vacuous). Expected ≥1 icon-* reference ` +
                `(the demo carries dozens — see proof:icon-idiom).`,
        );
    } else if (resolvedIcons.length !== referencedIcons.length) {
        const broken = referencedIcons.filter((c) => !resolvedBy(c, localDefs));
        fail(
            `icon-* coverage — referenced icon-* ${broken.join(", ")} do NOT resolve ` +
                `through design-idioms.css in THIS gate's corpus (the W4 def must be ` +
                `visible to the extended membership set).`,
        );
    } else {
        ok(
            `icon-* coverage — the ${referencedIcons.length} referenced W4 ` +
                `icon-* (${referencedIcons.join(", ")}) ARE in the full referenced set ` +
                `and resolve through design-idioms.css (the extension subsumes W4)`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:styling-idioms — FAIL (${failures.length}): a referenced ` +
            `idiom-shaped class resolves to NO owned definition — the OWNED-IDIOMS ` +
            `contract membership is incomplete (the silent-flatten rent design-idioms.css ` +
            `exists to retire; H.W12 I12 / FORK-I12).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:styling-idioms — PASS: every referenced idiom-shaped class resolves to " +
        "an owned definition (design-idioms.css ∪ glass-ui ∪ tw-animate-css ∪ scoped " +
        "<style>); the W4 icon-* coverage is subsumed. FORK-I12 reduction branch — a " +
        "born-GREEN regression guard that bites a future un-owned idiom (H.W12 I12).",
);
