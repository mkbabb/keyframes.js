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
 * layer (`demo/@/styles/design-idioms.css`), uncages the `utils.css` monolith,
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
 *      over `demo/` `.vue`, EXCLUDING `demo/@/components/ui/` (vendored shadcn)
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
const STYLES = path.join(DEMO, "@/styles");
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
        let enterReferenced = false;
        const RAINBOW_REF = /var\(\s*--rainbow-([a-z]+)\s*\)/g;
        const COLOR_GOLD_REF = /var\(\s*--color-gold\s*\)/;
        const SCALE_HOVER_REF = /\bscale-on-hover\b/;
        // The tab-panel slide consumes the keyframe via `animation: enter …`.
        const ENTER_REF = /\banimation:\s*enter\b/;

        for (const abs of srcFiles) {
            const rel = toPosix(abs);
            // The idiom layer itself is a DEFINITION home, not a reference site.
            if (rel.endsWith("@/styles/design-idioms.css")) continue;
            const src = read(abs);
            for (const m of src.matchAll(RAINBOW_REF)) rainbowRefs.add(m[1]);
            if (COLOR_GOLD_REF.test(src)) colorGoldReferenced.hit = true;
            if (SCALE_HOVER_REF.test(src)) scaleHoverReferenced = true;
            if (ENTER_REF.test(src)) enterReferenced = true;
        }

        console.log(
            `  referenced idioms: --rainbow-{${[...rainbowRefs].sort().join(",")}}` +
                `  --color-gold:${colorGoldReferenced.hit}` +
                `  .scale-on-hover:${scaleHoverReferenced}` +
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
            // EXCLUDE the vendored shadcn-vue components (demo/@/components/ui/)
            // — they are not demo-authored surface — and dist/ (already skipped).
            if (toPosix(abs).includes("/demo/@/components/ui/")) continue;
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
                    `demo/@/components/ui/ + dist/). Migrate to the semantic ` +
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
