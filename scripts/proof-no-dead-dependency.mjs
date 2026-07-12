#!/usr/bin/env node
/**
 * proof:no-dead-dependency — S.C3a (dead deps + stale narration; the
 * gated/discretionary split, T9 census-before-fiat; sc-§2.2/§3.2; SC-1/SC-6;
 * x1-#4).
 *
 * THE DEFECT CLASS. Eight shadcn-vue devDependencies (`v-calendar`,
 * `vaul-vue`, `embla-carousel-vue`, `@unovis/ts`, `@unovis/vue`,
 * `vee-validate`, `@vee-validate/zod`, `zod`) rode `package.json` since the
 * repo's "initial testing" commit with ZERO importers anywhere in `src/` or
 * `demo/` — dead weight in the install graph, never proven live (a20 F4, a30,
 * DIGEST.json). Alongside them, a dead LOCAL constant (`SPRING_SMOOTH`) was
 * kept alive only by a `void` suppression dodging `noUnusedLocals`, and a
 * handful of narration sites (CLAUDE.md doc listings, a proof-script comment)
 * asserted things that no longer exist. T9 (census before fiat): totality is
 * proven by a census-shaped gate, not by naming one island.
 *
 * ── CLAUSE 1 — the dead-dependency denylist (S2/S3; sc-§2.2; SC-1) ──────────
 * The BOUNDED, explicit-denylist form (the honest, falsifiability-immune
 * shape SC-1 prefers over a generalized matcher): keyed off the 8 NAMED
 * packages, not a heuristic. A substring-matching generalized scanner would
 * false-RED on `zod`/`@unovis` COMMENT mentions (e.g. the narration this wave
 * also fixes at `proof-visual-lock.mjs:172`) and false-RED on live tooling
 * devDeps (vite/tailwind/prettier/etc.) it doesn't recognize — the bounded
 * form is immune to both traps by construction. Two directions, both real
 * checks:
 *   (a) MANIFEST — none of the 8 names appear as a key in package.json's
 *       `dependencies`/`devDependencies`/`optionalDependencies`/
 *       `peerDependencies`.
 *   (b) REGROWTH GUARD — no real `import …from`/`import(...)`/`require(...)`
 *       specifier (comments stripped first — never a prose substring) under
 *       `src/`, `demo/`, `scripts/`, or the root config files resolves to a
 *       bare or subpath specifier of any of the 8 names. A future
 *       re-introduction (source first, manifest second, or vice versa) REDs
 *       either way.
 *   (c) SPRING_SMOOTH — the dead constant (+ its `void` suppression hack)
 *       does not exist anywhere under `src/` (a20 F4; fold row 57). Belt-and-
 *       braces against the same "kept alive by a compiler-dodge" defect class
 *       regrowing under a different name.
 *
 * ── CLAUSE 2 — the dead-identifier grep, scoped (S4; sc-§3.2; SC-6) ────────
 * Bans FIVE SPECIFIC dead component identifiers — `SceneSwitcherCarousel`,
 * `SegmentedTabs`, `Animated.vue`, `ResponsiveSelect`, `AnimationMenuBar` —
 * NEVER the phrase "scene-switcher" (banning the phrase would false-RED the
 * historical tranche docs + the S.E shelf record, which legitimately carry
 * it). Scoped to the repo's LIVE NARRATION SURFACES — the CLAUDE.md family
 * (root, `src/animation/`, `demo/`) + `README.md` + `demo/DESIGN.md` — the
 * doc sites a reader actually trusts as "what exists today". This is
 * DELIBERATELY narrower than "every comment in every file": `scripts/*.mjs`
 * legitimately references these identifiers inside ITS OWN dead-code
 * assertions (e.g. `proof-scene-colocated.mjs` greps for them to prove
 * they're gone — that's the discriminator, not the defect), and the
 * extensive `<SegmentedTabs>` design-history comments scattered through
 * `demo/components/instrument/transport/**` explain a real, true
 * architecture decision (the DM-5 contingency-kill of glass-ui's
 * `SegmentedTabs` for `KfPillTabs`) — accurate technical history, not a false
 * claim that something exists. That corpus is explicitly DISCRETIONARY
 * (S.C3a S6, stated ungated below), not this clause's scope. `docs/tranches/`
 * (the historical tranche record) is never scanned — T9's "historical docs
 * legitimately carry the phrase" applies to the identifiers too.
 *
 * ── CLAUSE 3 — the shadcn census, GATING post-S.C3b (S5; T9; x1-#4) ─────────
 * A repo-wide (`src/` + `demo/`) grep for `cn(` / `class-variance-authority` /
 * `@radix-*` that must return EMPTY — NO-legacy proven by census, not by naming
 * one island. S.C3a AUTHORED this clause born-RED-and-NON-GATING: while the
 * `demo/components/ui/menubar/` (16 files) + `demo/utils/utils.ts`'s `cn()`
 * shadcn island still existed, a GATING census would have wrongly RED'd S.C3a's
 * own green, so S.C3a surfaced the finding loudly WITHOUT contributing to the
 * exit code, deferring the discharge to S.C3b ("C3a authors the census; C3b's
 * green is that census going empty after ui/menubar is deleted").
 *
 * S.C3b (C-19) HAS NOW DISCHARGED IT: the ui/menubar island + the `cn()` helper
 * were migrated off (the a24-F6 relocate-in-place toolbar) and DELETED, so the
 * census is empty — and this clause is FLIPPED TO GATING (its finding now joins
 * `failures` and gates the exit code). This is the TIER flip the discharge
 * requires (S.C3b consumes the SAME detection C3a authored — same patterns,
 * roots and comment-strip; it does not re-author the detection), and it is what
 * makes S.C3a's OWN stated falsifiability true: "re-adding … a `cn(` /
 * `@radix-*` footprint REDs" is only true if this clause gates. A `cn(`,
 * `class-variance-authority`, or `@radix-*` REGROWTH in src/+demo/ now REDs.
 *
 * BORN-RED PROOF. Before S.C3a: all 8 packages in `package.json`,
 * `SPRING_SMOOTH` + its `void` hack live, `demo/CLAUDE.md` claims
 * `AnimationMenuBar.vue`/`ResponsiveSelect` exist (they don't),
 * `proof-visual-lock.mjs:172` narrates a dead "unovis" attribution → clauses 1
 * + 2 RED; the census carries 12 hits (RED, non-gating). S.C3a discharges
 * clauses 1 + 2 (exits 0, census still RED non-gating). S.C3b deletes the island
 * AND flips clause 3 to gating: with the island present + gating → RED (exit 1);
 * island deleted → the census is empty → GREEN (exit 0). Recorded both exits.
 *
 * CI posture: HARD — clauses 1 + 2 + 3 all gate this script's exit code.
 *
 * RUN: node scripts/proof-no-dead-dependency.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const failures = []; // clauses 1 + 2 + 3 (post-S.C3b) — gate the exit code

// ── shared source helpers ─────────────────────────────────────────────────────

/** Strip block, line, and HTML comments so prose never forges a match. */
function stripComments(s) {
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    s = s.replace(/<!--[\s\S]*?-->/g, "");
    s = s.replace(/(^|[^:"'`])\/\/.*$/gm, (_m, p1) => p1);
    return s;
}

function collectFiles(root, { exts, skipDirs = new Set(["node_modules", ".git", "dist", "coverage"]) }) {
    const out = [];
    if (!fs.existsSync(root)) return out;
    (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            if (skipDirs.has(e.name)) continue;
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (exts.has(path.extname(e.name))) out.push(p);
        }
    })(root);
    return out;
}

// ═════════════════════════════════════════════════════════════════════════════
// CLAUSE 1 — the dead-dependency denylist (S2/S3)
// ═════════════════════════════════════════════════════════════════════════════

console.log("clause 1 — dead-dependency denylist (the 8 named shadcn packages + SPRING_SMOOTH)");

const DEAD_PACKAGES = [
    "v-calendar",
    "vaul-vue",
    "embla-carousel-vue",
    "@unovis/ts",
    "@unovis/vue",
    "vee-validate",
    "@vee-validate/zod",
    "zod",
];

// (a) MANIFEST — none of the 8 survive as a package.json dependency key.
const pkg = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8"));
const manifestSections = [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
];
const manifestHits = [];
for (const section of manifestSections) {
    const keys = Object.keys(pkg[section] ?? {});
    for (const name of DEAD_PACKAGES) {
        if (keys.includes(name)) manifestHits.push(`${section}.${name}`);
    }
}
if (manifestHits.length > 0) {
    failures.push(
        "clause 1a (manifest) — dead shadcn package(s) survive in package.json: " +
            manifestHits.join(", ") +
            ". All 8 are zero-importer (verified by clause 1b's regrowth guard); remove them.",
    );
} else {
    console.log(`  ✓ zero of the 8 named packages survive in package.json's dependency sections.`);
}

// (b) REGROWTH GUARD — no real import/require specifier resolves to a bare
// or subpath specifier of any of the 8 names. Comments stripped first (never
// a prose substring — the false-RED trap a bare substring matcher falls into:
// `zod`/`@unovis` appear in the tree today ONLY inside comments).
function specifierHits(code) {
    const clean = stripComments(code);
    const specs = [];
    for (const m of clean.matchAll(/\bfrom\s*["']([^"']+)["']/g)) specs.push(m[1]);
    for (const m of clean.matchAll(/\bimport\s*\(\s*["']([^"']+)["']/g)) specs.push(m[1]);
    for (const m of clean.matchAll(/(?:^|[\s;(])import\s+["']([^"']+)["']/g)) specs.push(m[1]);
    for (const m of clean.matchAll(/\brequire\s*\(\s*["']([^"']+)["']/g)) specs.push(m[1]);
    return specs;
}
function isDeadSpecifier(spec) {
    return DEAD_PACKAGES.some((name) => spec === name || spec.startsWith(name + "/"));
}

const regrowthRoots = ["src", "demo", "scripts"];
const regrowthExts = new Set([".ts", ".vue", ".mjs", ".js", ".cjs"]);
const regrowthFiles = regrowthRoots.flatMap((r) =>
    collectFiles(path.join(REPO, r), { exts: regrowthExts }),
);
// Root-level config files — plugin-reference sites a generalized scanner must
// cover too (vite/tailwind/postcss/prettier configs), included here for the
// same regrowth guard even though the bounded denylist form doesn't strictly
// require it (belt-and-braces; costs nothing since none of the 8 are build
// tooling).
for (const f of fs.readdirSync(REPO, { withFileTypes: true })) {
    if (f.isFile() && /\.config\.(ts|js|mjs|cjs)$/.test(f.name)) {
        regrowthFiles.push(path.join(REPO, f.name));
    }
}

const regrowthHits = [];
for (const file of regrowthFiles) {
    const rel = path.relative(REPO, file);
    for (const spec of specifierHits(fs.readFileSync(file, "utf8"))) {
        if (isDeadSpecifier(spec)) regrowthHits.push(`${rel} — imports "${spec}"`);
    }
}
if (regrowthHits.length > 0) {
    failures.push(
        "clause 1b (regrowth guard) — a real import/require specifier resolves to a " +
            "dead shadcn package: " +
            regrowthHits.join(", "),
    );
} else {
    console.log(
        `  ✓ zero real import/require specifiers (across ${regrowthFiles.length} src/demo/scripts/config ` +
            `files) resolve to any of the 8 dead packages.`,
    );
}

// (c) SPRING_SMOOTH — the dead constant + void hack (a20 F4; fold row 57).
const springSmoothHits = [];
for (const file of collectFiles(path.join(REPO, "src"), { exts: new Set([".ts"]) })) {
    const code = stripComments(fs.readFileSync(file, "utf8"));
    if (/\bSPRING_SMOOTH\b/.test(code)) {
        springSmoothHits.push(path.relative(REPO, file));
    }
}
if (springSmoothHits.length > 0) {
    failures.push(
        "clause 1c (SPRING_SMOOTH) — the dead constant survives in: " +
            springSmoothHits.join(", ") +
            ". Delete it (and any void-suppression hack) — no factory in presets/spring.ts consumes it.",
    );
} else {
    console.log("  ✓ SPRING_SMOOTH is gone from src/ (no dead constant, no void-suppression hack).");
}

// ═════════════════════════════════════════════════════════════════════════════
// CLAUSE 2 — the dead-identifier grep, scoped to live narration surfaces (S4)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause 2 — dead-identifier grep (5 specific identifiers, NOT the phrase \"scene-switcher\"), " +
        "scoped to live narration surfaces",
);

const DEAD_IDENTIFIERS = [
    "SceneSwitcherCarousel",
    "SegmentedTabs",
    "Animated.vue",
    "ResponsiveSelect",
    "AnimationMenuBar",
];

// The live narration surfaces — the doc sites a reader trusts as "what exists
// today". NOT docs/tranches/ (the historical record legitimately carries
// these names) and NOT every source comment (the SegmentedTabs design-history
// narration in demo/components/instrument/transport/** is accurate
// technical history, carved out as S.C3a S6 discretionary, not this clause's
// scope).
const NARRATION_SURFACES = [
    "CLAUDE.md",
    "README.md",
    "src/animation/CLAUDE.md",
    "demo/CLAUDE.md",
    "demo/DESIGN.md",
].map((p) => path.join(REPO, p));

const identifierHits = [];
for (const file of NARRATION_SURFACES) {
    if (!fs.existsSync(file)) continue;
    const rel = path.relative(REPO, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
        for (const id of DEAD_IDENTIFIERS) {
            if (line.includes(id)) {
                identifierHits.push(`${rel}:${i + 1} — "${id}"`);
            }
        }
    });
}
if (identifierHits.length > 0) {
    failures.push(
        "clause 2 (dead-identifier) — a dead component identifier survives in a live " +
            "narration surface:\n    " +
            identifierHits.join("\n    ") +
            "\n  These components are gone (R.W5); a doc site claiming otherwise is stale " +
            "narration, not the phrase \"scene-switcher\" (which historical docs may keep).",
    );
} else {
    console.log(
        `  ✓ zero of the 5 dead identifiers survive across the ${NARRATION_SURFACES.length} live ` +
            "narration surfaces (CLAUDE.md family + README.md + DESIGN.md).",
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// CLAUSE 3 — the shadcn census, NON-GATING (S5; discharged at S.C3b)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause 3 — shadcn census: cn( / class-variance-authority / @radix-* across src/+demo/ " +
        "(GATING — S.C3b discharged the ui/menubar island; the census now GUARDS against regrowth)",
);

const CENSUS_PATTERNS = [
    { name: "cn(", re: /\bcn\s*\(/ },
    { name: "class-variance-authority", re: /class-variance-authority/ },
    { name: "@radix-*", re: /@radix-[a-z-]+/ },
];
const censusRoots = ["src", "demo"];
const censusExts = new Set([".ts", ".vue"]);
const censusFiles = censusRoots.flatMap((r) => collectFiles(path.join(REPO, r), { exts: censusExts }));

const censusHits = [];
for (const file of censusFiles) {
    const rel = path.relative(REPO, file);
    const code = stripComments(fs.readFileSync(file, "utf8"));
    for (const { name, re } of CENSUS_PATTERNS) {
        if (re.test(code)) censusHits.push(`${rel} — matches "${name}"`);
    }
}
if (censusHits.length > 0) {
    failures.push(
        "clause 3 (shadcn census) — the repo-wide cn( / class-variance-authority / @radix-* " +
            `grep is NOT empty (${censusHits.length} hit(s) across ` +
            `${new Set(censusHits.map((h) => h.split(" — ")[0])).size} file(s)). The last shadcn ` +
            "island (demo/components/ui/menubar/ + the menubar-private cn() helper) was retired at " +
            "S.C3b (C-19); any surviving cn()/class-variance-authority/@radix-* footprint is shadcn " +
            "REGROWTH — remove it. Sample: " +
            censusHits.slice(0, 5).join("; ") +
            (censusHits.length > 5 ? `; …(+${censusHits.length - 5} more)` : ""),
    );
} else {
    console.log("  ✓ census EMPTY — zero cn()/class-variance-authority/@radix-* footprint across src/+demo/.");
}

// ── report ────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(`\nproof:no-dead-dependency — FAIL (${failures.length} finding(s)):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:no-dead-dependency — PASS: zero dead shadcn packages, zero SPRING_SMOOTH regrowth, " +
        "zero dead-identifier hits in live narration surfaces, and the shadcn census is empty " +
        "(the last ui/menubar island was retired at S.C3b — the census now guards against regrowth).",
);
process.exit(0);
