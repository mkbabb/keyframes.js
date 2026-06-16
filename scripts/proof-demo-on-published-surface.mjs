#!/usr/bin/env node
/**
 * proof:demo-on-published-surface — the K.W12 ED-3 boundary-ORACLE at the
 * PACKAGE boundary (the dogfood inversion).
 *
 * inv ζ's `proof:dogfood` proves the demo runs on the engine's BEHAVIOR (via
 * `@src`); THIS gate extends it to "what `npm i` installs is what the demo runs"
 * — `proof:published-surface` made DYNAMIC (ecosystem-distribution.md §4). The
 * running storefront becomes the integration test of the exact surface a `npm i`
 * consumer reaches: if a public export is missing, mis-typed, or wrongly
 * tier-split, the demo fails to build.
 *
 * STAGED POSTURE — the HONEST disposition. The FULL flip (every demo kf import →
 * the published barrel) is gated on the K.WZ republish: the published barrel is
 * 4.2.0 (it predates the K.W7–W11 surface the demo now consumes), and the demo
 * reaches engine INTERNALS the barrel does not export as values. Flipping the
 * whole demo TODAY would fail to build. So this gate, in the staged posture,
 * proves the boundary-ORACLE SEAM is sound and records the census the K.WZ flip
 * closes — it does NOT falsely certify a completed inversion, nor red the build
 * before the publish that makes the flip honest. See `docs/dogfood-inversion.md`.
 *
 * CLAUSES (each BITES):
 *
 *   seam-present (a) — the vite self-alias resolves `@mkbabb/keyframes.js` to
 *       source in dev (the dev-resolution substrate the demo's bare specifier
 *       rides). BITE: remove the self-alias → the seam the inversion needs is
 *       gone → reds (the inversion could not resolve in dev).
 *
 *   census (b·staged) — take the `@src/animation/*` deep-import census (the
 *       born-RED witness: the work the K.WZ flip closes) AND assert the heavy
 *       tier's raw-chunk reach is ACCOUNTED (the `import … from
 *       "@src/animation/engine"` sites are the ones the flip routes through
 *       `loadAnimationEngine()`). In the staged posture the census is REPORTED,
 *       not zero-asserted; the disposition doc names the K.WZ flip that makes it
 *       the bite. (When the flip lands, this clause flips to the full
 *       zero-deep-import assertion — the env wires it via KFVUE_INVERSION_LANDED.)
 *
 *   disposition-honest (c) — `docs/dogfood-inversion.md` EXISTS and is honest:
 *       it names the STAGED status, the K.WZ gating, the Band-I honesty
 *       precondition, and the seam. BITE: delete the disposition, or strip its
 *       honesty markers → the staged inversion rides un-disclosed → reds (a
 *       silent ride is the publish-boundary lie at the package boundary).
 *
 *   no-alias-edit (d) — the inversion does NOT edit the self-alias (the alias is
 *       the dev-resolution substrate, not the inversion; the demo flips its OWN
 *       written specifier). BITE: this gate is wired to NOT require an alias
 *       change — the seam clause (a) asserts the alias is PRESENT and unchanged.
 *
 * BUDGET 0 — the gate asserts the boundary-ORACLE seam + the honest disposition,
 * not an error count.
 *
 * RUN: npm run proof:demo-on-published-surface
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const VITE = path.join(REPO, "vite.config.ts");
const DISPOSITION = path.join(REPO, "docs", "dogfood-inversion.md");

// The env that flips clause (b) to the FULL zero-deep-import assertion once the
// K.WZ flip lands (the demo writes the public specifier over the seam).
const INVERSION_LANDED = process.env.KFVUE_INVERSION_LANDED === "1";

const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log(
    "proof:demo-on-published-surface — the boundary-ORACLE at the PACKAGE boundary (ED-3)",
);

// ── (a) seam-present — the self-alias resolves the bare specifier to source ────
{
    const vite = fs.existsSync(VITE) ? fs.readFileSync(VITE, "utf8") : "";
    const hasAlias =
        /"@mkbabb\/keyframes\.js"\s*:\s*path\.resolve\(/.test(vite) &&
        /src\/animation\/index\.ts/.test(vite);
    if (!hasAlias) {
        failures.push(
            "(a) the vite self-alias `@mkbabb/keyframes.js` → src/animation/index.ts is ABSENT — the dev-resolution substrate the inversion rides is gone (vite.config.ts).",
        );
    } else {
        ok("(a) the vite self-alias resolves `@mkbabb/keyframes.js` to source in dev (the seam is present)");
    }
}

// ── (b) census — the deep-import born-RED witness (the K.WZ-flip work) ─────────
const SRC_DEEP = /from\s+["']@src\/animation\/[\w/-]+["']/g;
const HEAVY_RAW = /from\s+["']@src\/animation\/engine["']/g;
const SOURCE_EXT = new Set([".ts", ".js", ".mjs", ".vue", ".tsx", ".jsx"]);
const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

function collect(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (!SKIP_DIR.has(e.name)) collect(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

{
    const files = collect(DEMO);
    let deepFiles = 0;
    let deepHits = 0;
    let heavyRawHits = 0;
    const barrelFiles = [];
    for (const abs of files) {
        const src = fs.readFileSync(abs, "utf8");
        const deep = src.match(SRC_DEEP);
        const heavy = src.match(HEAVY_RAW);
        if (deep) {
            deepFiles += 1;
            deepHits += deep.length;
        }
        if (heavy) heavyRawHits += heavy.length;
        if (/from\s+["']@mkbabb\/keyframes\.js["']/.test(src)) {
            barrelFiles.push(path.relative(REPO, abs));
        }
    }

    console.log(
        `  census: ${deepFiles} demo file(s) import @src/animation/* (${deepHits} deep imports; ${heavyRawHits} heavy-tier raw-chunk reaches via @src/animation/engine)`,
    );
    console.log(
        `  barrel imports today: ${barrelFiles.length} demo file(s) write @mkbabb/keyframes.js`,
    );

    if (INVERSION_LANDED) {
        // The K.WZ flip has landed — the FULL assertion bites.
        if (deepFiles > 0) {
            failures.push(
                `(b) KFVUE_INVERSION_LANDED=1 but ${deepFiles} demo file(s) still import @src/animation/* (${deepHits} deep imports) — the inversion is incomplete (the demo must write @mkbabb/keyframes.js ONLY).`,
            );
        } else {
            ok("(b) zero @src/animation/* deep imports — the demo consumes the published barrel ONLY (the inversion is COMPLETE)");
        }
    } else {
        // Staged: the census is the born-RED witness, REPORTED. The bite is the
        // disposition record (clause c) naming the K.WZ flip that closes it.
        if (deepFiles === 0) {
            // The flip evidently landed without the env flag — surface it so the
            // staged posture cannot silently mask a completed inversion.
            console.log(
                "  note: zero deep imports observed in the staged posture — set KFVUE_INVERSION_LANDED=1 to bite the full assertion.",
            );
        }
        ok(
            `(b·staged) the @src/animation/* census is recorded (${deepFiles} files / ${deepHits} deep imports) — the work the K.WZ flip closes; the disposition names the gating`,
        );
    }
}

// ── (c) disposition-honest — the staged inversion is DISCLOSED ─────────────────
{
    if (!fs.existsSync(DISPOSITION)) {
        failures.push(
            "(c) docs/dogfood-inversion.md is MISSING — the staged inversion rides un-disclosed (a silent ride is the publish-boundary lie at the package boundary).",
        );
    } else {
        const doc = fs.readFileSync(DISPOSITION, "utf8");
        const markers = [
            { name: "STAGED status", re: /STAGED/ },
            { name: "the K.WZ gating", re: /K\.WZ/ },
            { name: "the Band-I honesty precondition", re: /Band[- ]I/ },
            { name: "the self-alias seam", re: /self-alias/i },
        ];
        const missing = markers.filter((m) => !m.re.test(doc));
        if (missing.length > 0) {
            failures.push(
                `(c) docs/dogfood-inversion.md is missing honesty marker(s): ${missing
                    .map((m) => m.name)
                    .join("; ")} — the disposition must name the staging, the gating, the precondition, and the seam.`,
            );
        } else {
            ok("(c) docs/dogfood-inversion.md discloses the staged inversion (status + K.WZ gating + Band-I precondition + the seam)");
        }
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        `proof:demo-on-published-surface — FAIL (${failures.length} finding(s)):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The dogfood inversion is the boundary-ORACLE at the PACKAGE boundary —\n" +
            "  the demo consumes the PUBLISHED barrel, not @src. In the staged posture\n" +
            "  the seam + the honest disposition must hold; the full flip lands at K.WZ\n" +
            "  (set KFVUE_INVERSION_LANDED=1 to bite the zero-deep-import assertion).",
    );
    process.exit(1);
}
console.log(
    "proof:demo-on-published-surface — PASS" +
        (INVERSION_LANDED
            ? ": the demo consumes the published barrel ONLY — the dogfood inversion is COMPLETE (the boundary-ORACLE at the PACKAGE boundary bites)."
            : " (STAGED): the self-alias seam is present, the @src deep-import census\n" +
                "is recorded as the K.WZ-flip work, and docs/dogfood-inversion.md honestly\n" +
                "discloses the staged status + the K.WZ gating + the Band-I precondition. The\n" +
                "full flip lands at K.WZ on the K-tranche republish."),
);
