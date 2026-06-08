#!/usr/bin/env node
/**
 * proof:pp-logo-svg — H.W9 F4 (the ppmycota menu leads with the SVG mark, no emoji).
 *
 * The defect (F4): the @mbabb dock menu's ppmycota row garnished the brand mark
 * with an emoji `<p>` line (App.vue:58, the `🙂↔️🌱🍄` cluster:
 * `&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;`). The
 * fix DROPS that emoji line and leads with the ALREADY-rendering SVG brand mark
 * (`.ppmycota-logo-sm` → `@assets/ppmycota-logo-3.svg`, wired via brand.css). The
 * typed "ppmycota" wordmark + the ppmycota.com link stay; the `@click="togglePpMode"`
 * is preserved.
 *
 * Cheap STATIC parse — no browser needed (the contract: "no browser needed; mirrors
 * proof:idioms clause-1 resolve-or-red"). Three falsifiable clauses, each BITING on
 * the exact defect, SCOPED to the ppmycota `<DropdownMenuItem>` block (NOT the whole
 * menu — the @mbabb row legitimately carries a `&#x1F389;` 🎉 in its GitHub link, and
 * the EditorStartScreen hint carries the M. cubert face; neither is the ppmycota row,
 * so a menu-wide grep would false-RED):
 *
 *   1. SVG MARK PRESENT. The ppmycota item mounts a `.ppmycota-logo-sm` element (the
 *      SVG-backed brand glyph). BITE: drop the `.ppmycota-logo-sm` div → reds.
 *
 *   2. ZERO EMOJI IN THE ITEM. The ppmycota item's markup contains ZERO emoji
 *      codepoints — neither HTML entity references in the emoji planes
 *      (`&#x1F300`–`&#x1FAFF`, the variation selector `&#xFE0F`, the ZWJ `&#x200D`,
 *      the arrows `&#x2194`/`&#x2B00`+ block) NOR raw emoji codepoints. BITE:
 *      re-introduce the emoji `<p>` line (the F4 defect) → reds.
 *
 *   3. THE SVG ASSET RESOLVES. `.ppmycota-logo-sm`'s `background-image` (brand.css)
 *      references a real `assets/ppmycota-logo-*.svg` that EXISTS on disk (the
 *      `@assets` alias → repo-root `assets/`, per vite.config.ts:161 /
 *      tsconfig.json:22). BITE: the mark points at a missing/renamed asset → reds.
 *      Mirrors proof:idioms clause-1 (resolve-or-red, not a bare grep).
 *
 * RUN: node scripts/proof-pp-logo-svg.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const ASSETS = path.join(REPO, "assets"); // the @assets alias target (vite.config.ts:161)

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:pp-logo-svg — H.W9 F4 (the ppmycota menu leads with the SVG mark, no emoji)");

// ── isolate the ppmycota <DropdownMenuItem> block ─────────────────────────────
// Strip HTML comments first so the F4 rationale comment (which names the deleted
// emoji) cannot satisfy or trip the clauses. The ppmycota row is the
// <DropdownMenuItem> carrying `togglePpMode` (the brand-toggle affordance — the
// stable anchor; preserved by F4). We slice from the <DropdownMenuItem that owns
// the togglePpMode @click to its closing </DropdownMenuItem>.
const appRaw = read(path.join(DEMO, "app/App.vue"));
const app = appRaw.replace(/<!--[\s\S]*?-->/g, "");

// Find the item open-tag that contains the togglePpMode handler. Anchor on the
// @click="togglePpMode" attribute, then walk left to its enclosing
// <DropdownMenuItem and right to the matching </DropdownMenuItem>.
const ppAnchor = app.indexOf("togglePpMode");
let ppBlock = "";
if (ppAnchor !== -1) {
    const itemOpen = app.lastIndexOf("<DropdownMenuItem", ppAnchor);
    const itemClose = app.indexOf("</DropdownMenuItem>", ppAnchor);
    if (itemOpen !== -1 && itemClose !== -1) {
        ppBlock = app.slice(itemOpen, itemClose + "</DropdownMenuItem>".length);
    }
}

if (!ppBlock) {
    fail(
        "could not isolate the ppmycota <DropdownMenuItem> block in App.vue " +
            "(no @click=\"togglePpMode\" item found) — the brand-toggle row is the " +
            "F4 subject and must be present (togglePpMode is PRESERVED by F4)",
    );
} else {
    // ── 1. SVG MARK PRESENT ───────────────────────────────────────────────────
    if (/\bppmycota-logo-sm\b/.test(ppBlock)) {
        ok("the ppmycota item mounts a .ppmycota-logo-sm element (the SVG-backed brand mark leads the row)");
    } else {
        fail(
            "the ppmycota item does NOT mount a .ppmycota-logo-sm element — F4 leads " +
                "with the existing SVG brand mark; the glyph div must be present",
        );
    }

    // ── 2. ZERO EMOJI CODEPOINTS IN THE ITEM ──────────────────────────────────
    // (a) HTML numeric entity references in the emoji ranges. The deleted F4 line
    //     was `&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;`
    //     (🙂↔️🌱🍄): emoji plane (1F300–1FAFF), ZWJ (200D), variation selector
    //     (FE0F), the arrows/symbols block the ↔ lives in (2194–21AA / 2B00–2BFF /
    //     2600–27BF — dingbats + misc symbols). Match hex entities (case-insensitive).
    const entityMatches = [...ppBlock.matchAll(/&#x([0-9A-Fa-f]+);/g)]
        .map((m) => parseInt(m[1], 16))
        .filter((cp) =>
            (cp >= 0x1f000 && cp <= 0x1faff) || // emoji & supplemental-symbols planes
            cp === 0x200d || // ZWJ (emoji sequence joiner)
            cp === 0xfe0f || // emoji variation selector
            (cp >= 0x2600 && cp <= 0x27bf) || // misc symbols + dingbats
            (cp >= 0x2b00 && cp <= 0x2bff) || // misc symbols & arrows (↔ family ext)
            (cp >= 0x2190 && cp <= 0x21ff), // arrows block (↔ = 2194)
        );
    // (b) RAW (non-entity) emoji codepoints pasted directly into the markup.
    const rawEmoji = [...ppBlock].filter((ch) => {
        const cp = ch.codePointAt(0);
        return (
            (cp >= 0x1f000 && cp <= 0x1faff) ||
            cp === 0x200d ||
            cp === 0xfe0f ||
            (cp >= 0x2600 && cp <= 0x27bf) ||
            (cp >= 0x2b00 && cp <= 0x2bff)
        );
    });

    const emojiCount = entityMatches.length + rawEmoji.length;
    if (emojiCount === 0) {
        ok("ZERO emoji codepoints in the ppmycota item (the emoji <p> line — 🙂↔️🌱🍄 — is gone; F4)");
    } else {
        const ents = entityMatches.map((cp) => "U+" + cp.toString(16).toUpperCase()).join(", ");
        fail(
            `the ppmycota item carries ${emojiCount} emoji codepoint(s) ` +
                `(entities: [${ents}], raw: ${rawEmoji.length}) — F4 DROPS the emoji <p> ` +
                "line and leads with the SVG mark; remove the emoji garnish",
        );
    }
}

// ── 3. THE SVG ASSET RESOLVES (resolve-or-red, mirrors proof:idioms clause-1) ──
{
    const brandCssPath = path.join(DEMO, "@/styles/brand.css");
    if (!fs.existsSync(brandCssPath)) {
        fail("demo/@/styles/brand.css is missing — the .ppmycota-logo-sm background-image rule lives there");
    } else {
        const brand = read(brandCssPath);
        // Find the .ppmycota-logo-sm rule's background-image url(@assets/...svg).
        const ruleIdx = brand.indexOf(".ppmycota-logo-sm");
        const ruleBlock = ruleIdx !== -1 ? brand.slice(ruleIdx, brand.indexOf("}", ruleIdx) + 1) : "";
        const m = ruleBlock.match(/url\(\s*["']?@assets\/(ppmycota-logo-[^"')]+\.svg)["']?\s*\)/);
        if (!m) {
            fail(
                ".ppmycota-logo-sm in brand.css does NOT reference a url(@assets/ppmycota-logo-*.svg) " +
                    "background-image — the SVG-backed mark must be wired",
            );
        } else {
            const assetFile = m[1];
            const assetPath = path.join(ASSETS, assetFile);
            if (fs.existsSync(assetPath)) {
                ok(
                    `.ppmycota-logo-sm resolves to a real assets/${assetFile} ` +
                        `(${(fs.statSync(assetPath).size / 1024) | 0}KB on disk; @assets → repo-root assets/)`,
                );
            } else {
                fail(
                    `.ppmycota-logo-sm references @assets/${assetFile} but ${assetPath} does NOT exist ` +
                        "— a missing/renamed brand asset (resolve-or-red, mirrors proof:idioms clause-1)",
                );
            }
        }
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:pp-logo-svg — FAIL (${failures.length}): the ppmycota menu item does not ` +
            "lead cleanly with the SVG brand mark (the emoji garnish remains, or the mark is unwired — F4).",
    );
    process.exit(1);
}
console.log(
    "\nproof:pp-logo-svg — PASS: the ppmycota item leads with the .ppmycota-logo-sm SVG mark, " +
        "carries ZERO emoji, and the asset resolves on disk (F4).",
);
