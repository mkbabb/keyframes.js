#!/usr/bin/env node
/**
 * proof:idioms — the D.W2 design-language localization gate (the latent rent,
 * the leaf-tail, the uncaged monolith).
 *
 * The demo references a core visual vocabulary — `--rainbow-*`, `--color-gold`,
 * `.scale-on-hover`, `@keyframes enter` — EVERYWHERE but OWNS it NOWHERE in its
 * own tree: today those idioms resolve only through the transitive
 * `@mkbabb/glass-ui/styles` + `tw-animate-css` cascade, by accident of the
 * current pin. That is an ungated, undocumented cross-repo RENT: a sibling
 * tranche renames `scale-on-hover` or drops a `--rainbow-*` token and the demo
 * silently flattens. D.W2 localizes the demo-authored idioms into ONE owned
 * layer (`demo/styles/design-idioms.css`), uncages the `utils.css` monolith,
 * and terminates the φ-ladder leaf-tail.
 *
 * This is a re-runnable SOURCE instrument that BITES on every regression. Each
 * clause reds on the exact negative case it forbids — verified, not asserted.
 * Mirrors `proof:dogfood` / `proof:boundary`: exits 1 on any residual.
 *
 * CLAUSES (each BITES):
 *
 *   1. OWNED IDIOMS — every demo-referenced `--rainbow-*` / `--color-gold` /
 *      `.scale-on-hover` / `@keyframes enter` resolves to a DEMO-LOCAL
 *      definition in `design-idioms.css`. The gate greps `design-idioms.css`
 *      for each definition. BITE: stub the file (empty it) → the referenced
 *      idioms have no demo-local home → reds. This proves the demo OWNS the
 *      contract, not the rent.
 *
 *   2. LEAF-TAIL SWEPT — `grep -rnoE "\btext-sm\b|\btext-xs\b|\btext-base\b"`
 *      over `demo/` `.vue`, EXCLUDING `demo/components/ui/` (vendored shadcn)
 *      AND `dist/`, returns 0. The φ-ladder leaf-tail (the chronic A→B→C
 *      deferral) is terminated; a raw rung re-appearing reds it.
 *
 *   3. MONOLITH UNCAGED — `utils.css` carries ZERO component-specific selectors
 *      (`.tab-trigger` / `.btn-playback` / `.demo-` / `.ppmycota` / `tabpanel`)
 *      — OR the file is deleted entirely. Each component rule lives in its
 *      owner's `<style scoped>`; a trapped global rule reds it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const STYLES = path.join(DEMO, "styles");
const DESIGN_IDIOMS = path.join(STYLES, "design-idioms.css");
const UTILS_CSS = path.join(STYLES, "utils.css");

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

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:idioms — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log("proof:idioms — D.W2 (the design language localized + uncaged)");

    // ── 1. OWNED IDIOMS — design-idioms.css is the demo's authoritative home ─
    {
        if (!fs.existsSync(DESIGN_IDIOMS)) {
            failures.push(
                `[owned-idioms] ${relPosix(DESIGN_IDIOMS)} does not exist — the ` +
                    `demo has no localized idiom layer; the --rainbow-* / ` +
                    `--color-gold / .scale-on-hover / @keyframes enter vocabulary ` +
                    `is rented from glass-ui ungated (D.W2 §S1).`,
            );
        }
        const idiomSrc = fs.existsSync(DESIGN_IDIOMS) ? read(DESIGN_IDIOMS) : "";

        // Collect the demo-REFERENCED idiom set from source (the vue/css usages),
        // then assert each resolves to a definition IN design-idioms.css. No
        // hand-maintained list of "what to define" — the references ARE the
        // contract, derived live.
        const srcFiles = collect(DEMO, new Set([".vue", ".css", ".ts"]));

        // 1a — the --rainbow-* family actually referenced (var(--rainbow-NAME)).
        const rainbowRefs = new Set();
        const colorGoldReferenced = { hit: false };
        let scaleHoverReferenced = false;
        let goldShimmerReferenced = false;
        let enterReferenced = false;
        const RAINBOW_REF = /var\(\s*--rainbow-([a-z]+)\s*\)/g;
        const COLOR_GOLD_REF = /var\(\s*--color-gold\s*\)/;
        const SCALE_HOVER_REF = /\bscale-on-hover\b/;
        // .gold-shimmer is a CLASS utility (like .scale-on-hover) — the
        // detail-curve hover shimmer applied as a class string, NOT a var()
        // (the shape the D.W2 clause derived references from, which is why it
        // missed this rent; E.W3.S5 extends the class-shape branch to it).
        const GOLD_SHIMMER_REF = /\bgold-shimmer\b/;
        // The tab-panel slide consumes the keyframe via `animation: enter …`.
        const ENTER_REF = /\banimation:\s*enter\b/;

        for (const abs of srcFiles) {
            const rel = toPosix(abs);
            // The idiom layer itself is a DEFINITION home, not a reference site.
            if (rel.endsWith("styles/design-idioms.css")) continue;
            const src = read(abs);
            for (const m of src.matchAll(RAINBOW_REF)) rainbowRefs.add(m[1]);
            if (COLOR_GOLD_REF.test(src)) colorGoldReferenced.hit = true;
            if (SCALE_HOVER_REF.test(src)) scaleHoverReferenced = true;
            if (GOLD_SHIMMER_REF.test(src)) goldShimmerReferenced = true;
            if (ENTER_REF.test(src)) enterReferenced = true;
        }

        console.log(
            `  referenced idioms: --rainbow-{${[...rainbowRefs].sort().join(",")}}` +
                `  --color-gold:${colorGoldReferenced.hit}` +
                `  .scale-on-hover:${scaleHoverReferenced}` +
                `  .gold-shimmer:${goldShimmerReferenced}` +
                `  @keyframes-enter:${enterReferenced}`,
        );

        // 1b — assert each referenced idiom has a DEMO-LOCAL definition in
        // design-idioms.css. Definition shapes:
        //   --rainbow-NAME:  →  /--rainbow-NAME\s*:/
        //   --color-gold:    →  /--color-gold\s*:/
        //   .scale-on-hover  →  a rule selector  /\.scale-on-hover\b/  + a `{`
        //   @keyframes enter →  /@keyframes\s+enter\b/
        const missing = [];
        const hasDef = (re) => re.test(idiomSrc);

        for (const name of rainbowRefs) {
            const def = new RegExp(String.raw`--rainbow-${name}\s*:`);
            if (!hasDef(def)) {
                missing.push(`--rainbow-${name} (custom property)`);
            }
        }
        if (colorGoldReferenced.hit && !hasDef(/--color-gold\s*:/)) {
            missing.push("--color-gold (custom property)");
        }
        if (scaleHoverReferenced && !hasDef(/\.scale-on-hover\b/)) {
            missing.push(".scale-on-hover (utility rule)");
        }
        // Anchor on the rule's OPENING brace so a renamed/stubbed selector
        // (e.g. `.gold-shimmer-STUBBED {`) does NOT satisfy the definition — the
        // gate must red when the rule is removed (E.W3.S5 falsifiable).
        //
        // J.W7b S1g (STY-1) — `.gold-shimmer`'s DEFINITION HOME moved: the
        // demo-local recipe in design-idioms.css was a documented DUPLICATION
        // of the glass-ui `@utility` (styling-design-system.md STY-1,
        // glassui-adopt.md B1) and is DELETED at the consume-edge; the owner is
        // now the PUBLISHED glass-ui utilities (dist/styles/utilities.css,
        // loaded via the demo's `@import "@mkbabb/glass-ui/styles"`), consuming
        // the demo-owned `--color-gold*` ramp (still asserted demo-local
        // above). The clause resolves the definition in EITHER home and stays
        // falsifiable: it reds when the utility vanishes from BOTH (a demo
        // re-author would also red J.W7b's clause-(b) gone-grep).
        // glass-ui 4.0.0 restructured utilities.css into a thin @import root
        // that delegates to utilities/*.css partials (base.css, animate.css,
        // components.css, btn.css, a11y-overrides.css). The gate must track
        // the consumed reality: read the root PLUS every partial so the rule
        // is found wherever the current pin stores it. The assertion is
        // unchanged — gold-shimmer is published by glass-ui, not re-authored
        // in the demo.
        const GLASS_UI_UTILITIES = path.join(
            REPO,
            "node_modules/@mkbabb/glass-ui/dist/styles/utilities.css",
        );
        const GLASS_UI_UTILITIES_DIR = path.join(
            REPO,
            "node_modules/@mkbabb/glass-ui/dist/styles/utilities",
        );
        const glassUtilSrc = [
            fs.existsSync(GLASS_UI_UTILITIES) ? read(GLASS_UI_UTILITIES) : "",
            ...(fs.existsSync(GLASS_UI_UTILITIES_DIR)
                ? fs
                      .readdirSync(GLASS_UI_UTILITIES_DIR)
                      .filter((f) => f.endsWith(".css"))
                      .map((f) => read(path.join(GLASS_UI_UTILITIES_DIR, f)))
                : []),
        ].join("\n");
        if (
            goldShimmerReferenced &&
            !hasDef(/\.gold-shimmer\s*\{/) &&
            !/\.gold-shimmer\s*\{/.test(glassUtilSrc)
        ) {
            missing.push(
                ".gold-shimmer (utility rule — defined in NEITHER design-idioms.css " +
                    "NOR the published glass-ui utilities.css)",
            );
        }
        if (enterReferenced && !hasDef(/@keyframes\s+enter\b/)) {
            missing.push("@keyframes enter");
        }

        if (missing.length > 0) {
            failures.push(
                `[owned-idioms] design-idioms.css is missing demo-local ` +
                    `definition(s) for referenced idiom(s):\n      ` +
                    missing.join("\n      ") +
                    `\n    The demo references these everywhere but owns them ` +
                    `nowhere — define them in ${relPosix(DESIGN_IDIOMS)} so the ` +
                    `rent becomes an owned contract (D.W2 §S1).`,
            );
        } else if (fs.existsSync(DESIGN_IDIOMS)) {
            console.log(
                `  ✓ [owned-idioms] every referenced idiom resolves to a ` +
                    `demo-local definition in design-idioms.css`,
            );
        }
    }

    // ── 2. LEAF-TAIL SWEPT — zero raw body rung in the swept set ────────
    {
        const RUNG = /\btext-sm\b|\btext-xs\b|\btext-base\b/g;
        const vueFiles = collect(DEMO, new Set([".vue"]));
        const hits = [];
        for (const abs of vueFiles) {
            // EXCLUDE the vendored shadcn-vue components (demo/components/ui/)
            // — they are not demo-authored surface — and dist/ (already skipped).
            if (toPosix(abs).includes("/demo/components/ui/")) continue;
            const src = read(abs);
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const m = lines[i].match(RUNG);
                if (m) hits.push({ rel: relPosix(abs), line: i + 1, count: m.length });
            }
        }
        const total = hits.reduce((n, h) => n + h.count, 0);
        if (total > 0) {
            // Surface the first handful by site so the failure is actionable.
            const head = hits.slice(0, 12);
            failures.push(
                `[leaf-tail] ${total} raw text-sm/text-xs/text-base rung(s) ` +
                    `survive across ${hits.length} site(s) (demo .vue, excluding ` +
                    `demo/components/ui/ + dist/). Migrate to the semantic ` +
                    `ladder (.text-body / .text-small / .text-admin-label / ` +
                    `.text-caption). First sites:\n      ` +
                    head.map((h) => `${h.rel}:${h.line}`).join("\n      ") +
                    (hits.length > head.length
                        ? `\n      … and ${hits.length - head.length} more`
                        : ""),
            );
        } else {
            console.log(
                `  ✓ [leaf-tail] zero raw text-sm/text-xs/text-base rung in the ` +
                    `swept set (demo .vue, ui/ + dist/ excluded)`,
            );
        }
    }

    // ── 3. MONOLITH UNCAGED — utils.css holds no component selector ─────
    {
        if (!fs.existsSync(UTILS_CSS)) {
            console.log(
                `  ✓ [monolith] utils.css is deleted — the monolith is dissolved`,
            );
        } else {
            const src = read(UTILS_CSS);
            const COMPONENT_SELECTOR =
                /\.tab-trigger|\.btn-playback|\.demo-|\.ppmycota|tabpanel/g;
            const lines = src.split("\n");
            const trapped = [];
            for (let i = 0; i < lines.length; i++) {
                if (COMPONENT_SELECTOR.test(lines[i])) {
                    // reset lastIndex (global regex) and record the line
                    COMPONENT_SELECTOR.lastIndex = 0;
                    trapped.push({ line: i + 1, text: lines[i].trim() });
                }
            }
            if (trapped.length > 0) {
                failures.push(
                    `[monolith] utils.css still carries ${trapped.length} ` +
                        `component-specific selector line(s) ` +
                        `(.tab-trigger/.btn-playback/.demo-/.ppmycota/tabpanel) — ` +
                        `move each to its component's <style scoped>, or delete ` +
                        `utils.css if the residue is trivial (D.W2 §S2). Lines:\n` +
                        `      ` +
                        trapped
                            .slice(0, 12)
                            .map((t) => `${t.line}: ${t.text}`)
                            .join("\n      ") +
                        (trapped.length > 12
                            ? `\n      … and ${trapped.length - 12} more`
                            : ""),
                );
            } else {
                console.log(
                    `  ✓ [monolith] utils.css carries zero component-specific ` +
                        `selectors`,
                );
            }
        }
    }

    // ── 4. LITERALS TOKENIZED — the named recurring brackets are gone (E.W3.S2) ─
    // Each literal RECURS or encodes a coupling, so it earns a token; the call
    // site must read var(--token), not the raw bracket. BITES: each literal is a
    // verified live site pre-E.W3.
    {
        const LITERALS = [
            ["min-w-[12rem]", /min-w-\[12rem\]/, "--dropdown-min-width"],
            ["w-[30vw]", /\bw-\[30vw\]/, "--target-viewport-w"],
            [
                "w-[calc(100%-3rem)]",
                /w-\[calc\(100%-3rem\)\]/,
                "--visualizer-track-gutter",
            ],
            [
                "max-h-[min(24rem,60dvh)]",
                /max-h-\[min\(24rem,\s*60dvh\)\]/,
                "--easing-dropdown-max-h",
            ],
        ];
        const vueFiles = collect(DEMO, new Set([".vue"]));
        const hits = [];
        for (const abs of vueFiles) {
            const src = read(abs);
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                for (const [name, re, token] of LITERALS) {
                    if (re.test(lines[i])) {
                        hits.push({ rel: relPosix(abs), line: i + 1, name, token });
                    }
                }
            }
        }
        if (hits.length > 0) {
            failures.push(
                `[tokenized] ${hits.length} un-tokenized literal(s) survive in ` +
                    `demo .vue — route each to its design-idioms.css token:\n      ` +
                    hits
                        .map(
                            (h) =>
                                `${h.rel}:${h.line}  ${h.name} → var(${h.token})`,
                        )
                        .join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [tokenized] zero min-w-[12rem] / w-[30vw] / ` +
                    `w-[calc(100%-3rem)] / max-h-[min(24rem,60dvh)] in demo .vue ` +
                    `(each routed to its token)`,
            );
        }
    }

    // ── 5. PROGRESS-BAR SINGLE-SOURCED — exactly ONE definition (E.W3.S4) ──
    // The `.progress-bar` rainbow brush-sweep rule was duplicated verbatim in two
    // `<style scoped>` blocks; the canonical home is design-idioms.css (beside the
    // --rainbow-* family it reads). Assert exactly one definition across demo
    // source. BITE: a re-introduced scoped copy reds it.
    {
        const PB_DEF = /\.progress-bar\s*\{/g;
        const srcFiles = collect(DEMO, new Set([".vue", ".css"]));
        const defs = [];
        for (const abs of srcFiles) {
            const src = read(abs);
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (PB_DEF.test(lines[i])) {
                    PB_DEF.lastIndex = 0;
                    defs.push({ rel: relPosix(abs), line: i + 1 });
                }
            }
        }
        if (defs.length !== 1) {
            failures.push(
                `[progress-bar] expected exactly ONE .progress-bar definition ` +
                    `(the shared design-idioms.css rule), found ${defs.length}:\n      ` +
                    defs.map((d) => `${d.rel}:${d.line}`).join("\n      ") +
                    `\n    Dedup to the demo-owned idiom layer; the class stays ` +
                    `applied in the consuming templates (E.W3.S4).`,
            );
        } else {
            console.log(
                `  ✓ [progress-bar] exactly one .progress-bar definition ` +
                    `(${defs[0].rel}:${defs[0].line}) — single-sourced`,
            );
        }
    }

    // ── 6. PANEL-MAX-H IS DVH — the vh/dvh reconcile is gate-locked (E.W3.S3) ─
    // --panel-max-h must be defined as 60dvh (the mobile-correct unit), not 60vh.
    // BITE: the former 60vh reds it.
    {
        const idiomSrc = fs.existsSync(DESIGN_IDIOMS) ? read(DESIGN_IDIOMS) : "";
        const isDvh = /--panel-max-h\s*:\s*60dvh\b/.test(idiomSrc);
        const isVh = /--panel-max-h\s*:\s*60vh\b/.test(idiomSrc);
        if (!isDvh || isVh) {
            failures.push(
                `[panel-max-h] --panel-max-h must be defined as 60dvh in ` +
                    `design-idioms.css (the mobile-correct, single-sourced unit; ` +
                    `E.W3.S3)${isVh ? " — found the un-reconciled 60vh" : " — no 60dvh definition found"}.`,
            );
        } else {
            console.log(
                `  ✓ [panel-max-h] --panel-max-h reconciled to 60dvh ` +
                    `(one token, one mobile-correct unit)`,
            );
        }
    }

    // ── 7. RAIL/BALL PAIR DE-DUPLICATED — the F.W16.S1 honest correction ──────
    // W11 promoted the WRONG primitive (the conic-gradient .progress-dot PLAYING
    // RING) under the rail/ball name; the rail-line + scrubber-ball was STILL
    // authored four ways with drift (3 rail tints, 2 glows, 4 ball sizes). F.W16
    // promotes the CORRECT primitive: a parameterized .progress-rail/.progress-ball
    // pair in design-idioms.css, consumed by the scene tracks, with the scoped
    // rail/ball RE-DEFINITIONS removed.
    //   BITE: re-author a scoped .spring-rail-line / .track-line / .preset-line
    //         block (the rail geometry) in a scene → the de-dup clause reds.
    //   BITE: promote the conic playing-ring (.progress-dot) again instead of the
    //         rail/ball → the "is it the rail/ball, not the playing-ring" reds.
    {
        const idiomSrc = fs.existsSync(DESIGN_IDIOMS) ? read(DESIGN_IDIOMS) : "";
        // The pair must exist as REAL rules (opening brace anchored — a stubbed
        // selector does not satisfy it) and be DISTINCT from the playing-ring.
        const hasRail = /\.progress-rail\s*\{/.test(idiomSrc);
        const hasBall = /\.progress-ball\s*\{/.test(idiomSrc);
        // The rail/ball is the rail-LINE + scrubber-ball, NOT the conic playing
        // ring — the .progress-ball rule must read the progress tone as a solid
        // fill, not a conic-gradient (the .progress-dot signature). J.W7a D10
        // (the BINDING J.md §MANDATE colour seam) parameterized the fill through
        // --ball-tone with the canonical green as its default —
        // `background: var(--ball-tone, var(--color-progress))` — so the
        // predicate reads the SEAM form: still a solid single-var fill anchored
        // on --color-progress (dropping the canonical default, or re-promoting
        // the conic ring, still reds).
        const ballBlock = (idiomSrc.match(/\.progress-ball\s*\{[^}]*\}/) || [""])[0];
        const isRailBallNotRing =
            /background:\s*var\(--ball-tone,\s*var\(--color-progress\)\)/.test(ballBlock) &&
            !/conic-gradient/.test(ballBlock);

        // The scene consumers route through the pair (class applied in template).
        const consumers = [
            "demo/scenes/spring/SpringTarget.vue",
            "demo/scenes/easing/EasingTarget.vue",
            "demo/scenes/spring/SpringPhysicsFacet.vue",
        ];
        const allConsume = consumers.every((p) => {
            const src = fs.existsSync(path.join(REPO, p)) ? read(path.join(REPO, p)) : "";
            return /progress-rail/.test(src) && /progress-ball/.test(src);
        });

        // ZERO scoped rail/ball RE-DEFINITIONS survive: the former full-geometry
        // rail-line blocks (.spring-rail-line / .track-line / .preset-line) must
        // be GONE (no-legacy — replaced in one motion). A re-authored scoped rail
        // block reds this.
        const RAIL_REDEFS = /\.spring-rail-line\s*\{|\.track-line\s*\{|\.preset-line\s*\{/;
        const scopedRail = [];
        for (const p of consumers) {
            const abs = path.join(REPO, p);
            if (!fs.existsSync(abs)) continue;
            const lines = read(abs).split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (RAIL_REDEFS.test(lines[i])) scopedRail.push(`${p}:${i + 1}`);
            }
        }

        if (hasRail && hasBall && isRailBallNotRing && allConsume && scopedRail.length === 0) {
            console.log(
                `  ✓ [rail-ball] the progress-rail/progress-ball pair is ` +
                    `single-sourced in design-idioms.css (rail-line + scrubber-ball, ` +
                    `NOT the playing-ring); the 3 scene tracks consume it; zero ` +
                    `scoped rail/ball re-definitions (F.W16.S1)`,
            );
        } else {
            const why = [];
            if (!hasRail) why.push("no .progress-rail rule in design-idioms.css");
            if (!hasBall) why.push("no .progress-ball rule in design-idioms.css");
            if (hasBall && !isRailBallNotRing)
                why.push(".progress-ball is not the rail-line+ball (solid --color-progress fill, no conic-gradient) — the WRONG primitive promoted again");
            if (!allConsume) why.push("a scene track does not consume progress-rail/progress-ball");
            if (scopedRail.length > 0)
                why.push(`scoped rail re-definition(s) survive: ${scopedRail.join(", ")}`);
            failures.push(
                `[rail-ball] the rail/ball idiom is not de-duplicated through ` +
                    `design-idioms.css (F.W16.S1):\n      ` +
                    why.join("\n      "),
            );
        }
    }

    // ── 8. POST-F SCENE RE-FORK SWEPT — the G.W10 idiom finishing sweep ───────
    // The post-F W10/W12 scenes (sequence/, spring/) were authored
    // AFTER the D.W2 idiom-ownership sweep + the F §1 rail/ball consolidation, so
    // they re-forked idioms those passes already retired:
    //   • .settled-badge/.tracking-badge byte-dup across two scenes (a SILENT fork
    //     of the a11y-load-bearing 14%/50% AA-contrast lineage),
    //   • .code-token byte-dup across two scenes,
    //   • .mp-traveller hand-rolling .progress-ball with drifted glow/blur,
    //   • a 400px coupled magic number across two files,
    //   • a two-named mask-fade token shadow (--tabs-mask-fade / --mask-fade-width),
    //   • an h-[fit-content] arbitrary where h-fit exists.
    // This clause extends clause 1's OWNED-IDIOMS shape to the promotions:
    //   (8a) OWNED — .status-badge, .code-token, --rail-width, --mask-fade
    //        are defined in design-idioms.css (BITE shares clause 1's empty-file).
    //        (H.W3.S3 renamed the former pane-width token → --rail-width — the
    //        SINGLE width authority; the old token is dead tree-wide.)
    //   (8b) ZERO SCENE RE-FORK — no scene <style scoped> re-authors a promoted
    //        idiom: no .settled-badge/.tracking-badge/.code-token definition outside
    //        design-idioms.css, and no scene re-declares a `box-shadow: 0 2px …
    //        color-mix(… --color-progress …)` on a ball-shaped element.
    //   (8c) TOKENIZED — the coupled magic numbers reference the token, not the
    //        literal: the controls grid [rail] track + the pane width read
    //        var(--rail-width) (no raw 400px), both fade-mask sites read
    //        var(--mask-fade) (no divergent --tabs-mask-fade/--mask-fade-width), and
    //        no h-[fit-content] bracket-arbitrary survives.
    // BITE: reds TODAY on SpringTarget/SequenceTarget/MotionPathTarget scoped
    //       blocks + the coupled 400px / two-named fade / h-[fit-content] sites;
    //       green after the sweep. A scene re-forking a badge/.code-token/ball
    //       recipe, or a re-introduced raw 400px / divergent fade name / arbitrary,
    //       reds.
    {
        const idiomSrc = fs.existsSync(DESIGN_IDIOMS) ? read(DESIGN_IDIOMS) : "";

        // 8a — the promoted idioms are OWNED in design-idioms.css.
        const ownedDefs = [
            [".status-badge (status-tint idiom)", /\.status-badge\s*\{/],
            [".code-token (inline-code idiom)", /\.code-token\s*\{/],
            [
                "--rail-width (layout token)",
                /--rail-width\s*:/,
            ],
            ["--mask-fade (edge-fade token)", /--mask-fade\s*:/],
        ];
        const missingOwned = ownedDefs
            .filter(([, re]) => !re.test(idiomSrc))
            .map(([label]) => label);
        if (missingOwned.length > 0) {
            failures.push(
                `[scene-refork:owned] design-idioms.css is missing the G.W10 ` +
                    `promotion(s):\n      ` +
                    missingOwned.join("\n      ") +
                    `\n    Promote each to ${relPosix(DESIGN_IDIOMS)} so the ` +
                    `post-F scenes consume it rather than re-fork (G.W10.S1/S2/S4/S5).`,
            );
        }

        // 8b — ZERO scene re-forks a promoted idiom. Sweep demo .vue scoped
        // <style> blocks, comment-blanked (so a doc-comment naming an idiom does
        // not false-positive), excluding the idiom layer itself + ui/ + dist/.
        const sceneFiles = collect(DEMO, new Set([".vue"])).filter((abs) => {
            const rel = toPosix(abs);
            return (
                !rel.includes("/demo/components/ui/") &&
                !rel.endsWith("styles/design-idioms.css")
            );
        });
        const blankComments = (s) =>
            s
                .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
                .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
        const BADGE_TOKEN_REFORK =
            /\.settled-badge\s*\{|\.tracking-badge\s*\{|\.code-token\s*\{/;
        // A ball-shaped re-fork: the .progress-ball box-shadow SIGNATURE — a
        // `0 2px <blur> color-mix(… --color-progress …)` glow re-declared in a
        // scene scope. Anchored on the `0 2px` ball signature so it does NOT
        // false-positive on a card drop-shadow (e.g. StartingStyleTarget's
        // `.discrete-card` `0 8px 32px …`), which is a distinct primitive.
        const BALL_BOX_SHADOW =
            /box-shadow:\s*0\s+2px\s+[\d.]+px\s+color-mix\([^)]*--color-progress[^;]*;/;
        const reforks = [];
        for (const abs of sceneFiles) {
            const src = blankComments(read(abs));
            const lines = src.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (BADGE_TOKEN_REFORK.test(lines[i]))
                    reforks.push(`${relPosix(abs)}:${i + 1} (badge/code-token re-fork)`);
            }
            // box-shadow can span lines — test the comment-blanked whole file.
            if (BALL_BOX_SHADOW.test(src))
                reforks.push(`${relPosix(abs)} (ball box-shadow re-fork)`);
        }
        if (reforks.length > 0) {
            failures.push(
                `[scene-refork:zero] ${reforks.length} scene re-fork(s) of a ` +
                    `promoted idiom survive (the byte-dup the G.W10 sweep retired) — ` +
                    `consume the design-idioms.css idiom, do not re-author it:\n      ` +
                    reforks.join("\n      "),
            );
        }

        // 8c — TOKENIZED: the coupled literals reference the token, not the raw value.
        const tokenizedFails = [];
        // S.A0-fallout co-edit: a component's style tier may be carved into a
        // colocated sourced stylesheet (`<style scoped src="./X.css">` — the D2
        // ControlsPaneWrapper precedent, applied to AnimationControlsGroup at the
        // 500L tripwire). The component SURFACE for token-coupling assertions is
        // the SFC + that sibling stylesheet, concatenated.
        const fileSrc = (p) => {
            const abs = path.join(REPO, p);
            const sfc = fs.existsSync(abs) ? read(abs) : "";
            const cssSibling = abs.replace(/\.vue$/, ".css");
            const css =
                p.endsWith(".vue") && fs.existsSync(cssSibling) ? read(cssSibling) : "";
            return css ? `${sfc}\n${css}` : sfc;
        };
        const GROUP = "demo/components/instrument/transport/AnimationControlsGroup.vue";
        const PANE = "demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue";
        const TABS = "demo/components/instrument/transport/channel-controls/ChannelControls.vue";
        const MATRIX = "demo/scenes/cube/matrix-editor/MatrixEditor.vue";

        // Comment-blank each file so a doc-comment NAMING the retired literal/token
        // (e.g. "the former --tabs-mask-fade shadow is collapsed") does not
        // false-positive — only LIVE declarations/references count.
        // H.W3.S4: the lg grid track moved from a `lg:grid-cols-[…]` Tailwind class
        // to scoped CSS `grid-template-columns: [rail] var(--rail-width) [stage] 1fr`
        // (via the --rail-track collapse var). The token coupling is unchanged in
        // spirit — the [rail] track reads var(--rail-width), never a raw 400px.
        const groupSrc = blankComments(fileSrc(GROUP));
        if (/grid-template-columns:[^;]*\b400px\b/.test(groupSrc) || !/var\(--rail-width\)/.test(groupSrc))
            tokenizedFails.push(`${GROUP}: the lg [rail] grid track must read var(--rail-width), not the raw 400px`);
        // H.W3.S3: the pane went from a `min-width` floor to an exact `width` — the
        // pane IS the rail width (the single width authority), reading var(--rail-width).
        const paneSrc = blankComments(fileSrc(PANE));
        if (/width:\s*400px/.test(paneSrc) || !/width:\s*var\(--rail-width\)/.test(paneSrc))
            tokenizedFails.push(`${PANE}: the pane width must read var(--rail-width), not the raw 400px`);
        // Both fade-mask sites read var(--mask-fade); neither divergent local name survives.
        const tabsSrc = blankComments(fileSrc(TABS));
        if (/--tabs-mask-fade\b/.test(tabsSrc) || !/var\(--mask-fade\)/.test(tabsSrc))
            tokenizedFails.push(`${TABS}: the tab-overflow fade must read var(--mask-fade), not the local --tabs-mask-fade name`);
        if (/--mask-fade-width\b/.test(paneSrc) || !/var\(--mask-fade\)/.test(paneSrc))
            tokenizedFails.push(`${PANE}: the scroll fade must read var(--mask-fade), not the local --mask-fade-width name`);
        if (/h-\[fit-content\]/.test(fileSrc(MATRIX)))
            tokenizedFails.push(`${MATRIX}: h-[fit-content] must be the first-class h-fit utility`);

        if (tokenizedFails.length > 0) {
            failures.push(
                `[scene-refork:tokenized] ${tokenizedFails.length} coupled ` +
                    `magic-number/arbitrary site(s) not routed to the token (G.W10.S4/S5/S6):\n      ` +
                    tokenizedFails.join("\n      "),
            );
        }

        if (missingOwned.length === 0 && reforks.length === 0 && tokenizedFails.length === 0) {
            console.log(
                `  ✓ [scene-refork] the post-F scenes consume the promoted idioms ` +
                    `(.status-badge / .code-token / --rail-width / --mask-fade): ` +
                    `zero scene re-fork, the coupled 400px + the two-named fade tokenized, ` +
                    `h-fit (G.W10)`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:idioms — FAIL (D.W2 — the design language is not yet localized):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The demo must OWN its design idioms (design-idioms.css), speak ONE\n" +
                "  type language (the semantic ladder, no raw rungs), and uncage the\n" +
                "  utils.css monolith (component rules → <style scoped>). Each clause\n" +
                "  above reds on the exact regression it forbids.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:idioms — PASS: the demo owns its idioms, the leaf-tail is swept,\n" +
            "and the utils.css monolith is uncaged. D.W2 holds.",
    );
}

main();
