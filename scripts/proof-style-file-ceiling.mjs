#!/usr/bin/env node
/**
 * proof:style-file-ceiling — T.F (THE GRAND COLOCATION EDICT, styles half).
 *
 * The demo's shared styles tier is Tailwind-v4 CSS whose @import / @custom-variant
 * / @layer order is LOAD-BEARING. Before this gate it held two monoliths — a
 * ~727L entry and an ~893L idiom sheet — most of whose bulk was tranche-archaeology
 * comment prose, not cascade. The styles split de-archaeologized both and carved the
 * layout/dock geometry into its own concern file so no single sheet exceeds a
 * readable ceiling.
 *
 * This is the standing REGRESSION GUARD for that split: every `.css` file in the
 * demo's shared styles dir stays ≤300L. It bites a future re-accretion (a sheet
 * that grows past the ceiling by re-absorbing a concern or re-growing archaeology)
 * and a future gate-dodge (a monolith laundered back in). The ceiling counts the
 * WHOLE file (comment prose included) — de-archaeology is the intended lever, so
 * comment bulk is exactly what the ceiling is meant to discourage.
 *
 * Re-runnable STATIC instrument (no browser, no build): `node scripts/proof-style-file-ceiling.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The shared styles tier. The dir is `demo/@/styles/` today; if the `@`→`shared`
// rename lands (the sibling structure lane), the same tier lives at
// `demo/shared/styles/`. Resolve whichever exists so the gate survives the rename
// without a path edit (the arming-audit lesson: a gate keyed to one spelling breaks
// on the move).
const STYLE_DIR_CANDIDATES = ["demo/@/styles", "demo/shared/styles"];
const STYLE_DIR = STYLE_DIR_CANDIDATES.map((r) => path.join(REPO, r)).find((p) =>
    fs.existsSync(p),
);

const CEILING = 300;

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

function main() {
    console.log(
        "proof:style-file-ceiling — T.F styles split (every shared .css ≤ 300L)",
    );

    if (!STYLE_DIR) {
        console.error(
            "proof:style-file-ceiling — ERROR: no shared styles dir found (tried " +
                STYLE_DIR_CANDIDATES.join(", ") +
                ").",
        );
        process.exit(3);
    }

    const cssFiles = fs
        .readdirSync(STYLE_DIR)
        .filter((f) => f.endsWith(".css"))
        .map((f) => path.join(STYLE_DIR, f))
        .sort();

    if (cssFiles.length === 0) {
        console.error(
            `proof:style-file-ceiling — ERROR: no .css files under ${relPosix(STYLE_DIR)}.`,
        );
        process.exit(3);
    }

    const over = [];
    let max = { rel: "", lines: 0 };
    for (const abs of cssFiles) {
        const lines = fs.readFileSync(abs, "utf8").split("\n").length;
        if (lines > max.lines) max = { rel: relPosix(abs), lines };
        if (lines > CEILING) over.push({ rel: relPosix(abs), lines });
    }

    if (over.length > 0) {
        console.error(
            "\nproof:style-file-ceiling — FAIL (a shared styles sheet re-crossed the ceiling):",
        );
        for (const o of over) {
            console.error(
                `  ✗ ${o.rel}: ${o.lines}L exceeds the ${CEILING}L ceiling — split at ` +
                    `its natural concern seam (tokens / layout / idioms), preserving the ` +
                    `@layer graph + @import order so the computed cascade is byte-faithful; ` +
                    `de-archaeologize the comment prose rather than re-launder it into a ` +
                    `sibling extension.`,
            );
        }
        process.exit(1);
    }

    console.log(
        `  ✓ all ${cssFiles.length} shared .css files ≤ ${CEILING}L ` +
            `(max ${max.rel} @ ${max.lines}L) under ${relPosix(STYLE_DIR)}/`,
    );
    console.log(
        "\nproof:style-file-ceiling — PASS: the styles split holds (T.F).",
    );
}

main();
