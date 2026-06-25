#!/usr/bin/env node
/**
 * proof:crayon-preserved — Tranche L.W11 (the design-refinement SPINE · born-GREEN
 * regression-lock).
 *
 * ── THE USER'S BINDING VERDICT THIS GATE ENFORCES ────────────────────────────
 * The L.W11 design fleet first over-reached toward ABROGATION (kill the crayon
 * primaries, repaint the cube faces from the muted axis family, swap the HSL
 * square). The user's binding verdict (2026-06-17): **REFINE, do NOT abrogate.**
 * The saturated crayon primaries are KEPT, every hue intact — coherence comes by
 * REGISTER (the vivid crayons own the SIGNAL surfaces; the muted axis-HSLs own the
 * FRAME), never by COLLAPSE. The only sanctioned token work is a HUE-EXACT hygiene
 * lift of raw literals into named tokens (--face-1…6, --spring-lane-*, --amiga-red)
 * — one-for-one, NO recolor.
 *
 * This gate is the SPINE of that discipline: it pins every keeper token's hue to
 * the 4.3.0 BASELINE (scripts/baselines/crayon-preserved.json) and REDs the instant
 * a refinement mutes, removes, or recolors a keeper. It is GREEN today (the crayons
 * are intact) — a REGRESSION-LOCK, not a born-RED. NEVER weaken it.
 *
 * ── WHAT IT ASSERTS ──────────────────────────────────────────────────────────
 * For each keeper token in the baseline:
 *   (1) EXTANT keepers (the --rainbow-* six stops + cyan, --accent-red,
 *       --color-progress, the six cube facet rgbs) — MUST be present in the live
 *       source AND resolve to the SAME computed color as the baseline. A missing or
 *       recolored extant keeper is a HARD FAIL (the abrogation the user forbade).
 *   (2) HOIST-TARGET keepers (--face-1…6, --spring-lane-*, --amiga-red) — the
 *       to-be-hoisted named tokens. Hue-exact IF PRESENT; their ABSENCE today is a
 *       recorded PENDING-HOIST (not a fail — the gate is green pre-hoist, the
 *       crayons live as their raw literals). Once L.W11 hoists them, a drifted hue
 *       is a HARD FAIL — the hoist must be one-for-one. The cube facet rgbs are ALSO
 *       checked at their CURRENT literal site (CubeTarget.vue) so the colors are
 *       pinned whether they live as a literal (today) or a --face-N token (post-hoist).
 *
 * ── HOW IT READS THE COLORS (source-shape, device-independent) ───────────────
 * A pure source-text gate (no browser): it parses the authored value of each token
 * from the live CSS/Vue source, resolves `var(--…)` aliases THROUGH the keeper set,
 * and normalizes hsl()/rgb()/rgba()/#hex to a canonical r,g,b,a triple. A hue-exact
 * hoist (literal→token, or hsl→var alias) compares EQUAL; a recolor compares
 * UNEQUAL. The dark-mode --accent-red override (style.css `.dark`) is NOT the
 * baseline — the baseline is the default (light, :root) hue the demo serves at rest,
 * matching the 4.3.0 shipped appearance. Device-independent: no pixel read, so it
 * runs in CI without a browser (the spine must never be skippable).
 *
 * ── BITE ─────────────────────────────────────────────────────────────────────
 * Recolor a keeper (e.g. --accent-red: hsl(0 72% 63%) → a blue) and the gate REDs
 * with the recolored token named. Restore it and the gate greens. BITE-VERIFIED at
 * authoring (the report records the recolor → RED → revert → GREEN round-trip).
 *
 * Re-runnable: `node scripts/proof-crayon-preserved.mjs`. No build, no browser, no
 * network — the regression-lock runs everywhere the source is checked out.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_PATH = path.join(REPO, "scripts/baselines/crayon-preserved.json");

const failures = [];
const pending = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const note = (label) => {
    pending.push(label);
    console.log(`  ○ ${label}`);
};

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

console.log(
    "proof:crayon-preserved — L.W11 (the crayon keepers resolve to their 4.3.0 hue · REFINE not abrogate)",
);

// ── Color normalization — hsl()/rgb()/rgba()/#hex → canonical {r,g,b,a} ───────
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round = (v) => Math.round(v);

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
}

/**
 * parseColor — a CSS color string → canonical {r,g,b,a} or null. Handles hsl()
 * (space and comma syntaxes, optional alpha), rgb()/rgba(), and #hex (3/4/6/8).
 * The /3dp alpha is rounded so 0.8 and 0.800 compare equal.
 */
function parseColor(str) {
    if (!str) return null;
    const s = String(str).trim().toLowerCase();

    let m = s.match(/^hsla?\(([^)]+)\)$/);
    if (m) {
        const parts = m[1].split(/[\s,/]+/).filter(Boolean);
        if (parts.length < 3) return null;
        const h = parseFloat(parts[0]);
        const sat = parseFloat(parts[1]);
        const lit = parseFloat(parts[2]);
        const a = parts[3] != null ? parseFloat(parts[3]) : 1;
        if ([h, sat, lit].some((v) => !Number.isFinite(v))) return null;
        const { r, g, b } = hslToRgb(h, sat, lit);
        return { r, g, b, a: +clamp(a, 0, 1).toFixed(3) };
    }

    m = s.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
        const parts = m[1].split(/[\s,/]+/).filter(Boolean);
        if (parts.length < 3) return null;
        const ch = (p) =>
            p.endsWith("%") ? round((parseFloat(p) / 100) * 255) : round(parseFloat(p));
        const r = ch(parts[0]);
        const g = ch(parts[1]);
        const b = ch(parts[2]);
        const a = parts[3] != null ? parseFloat(parts[3]) : 1;
        if ([r, g, b].some((v) => !Number.isFinite(v))) return null;
        return { r, g, b, a: +clamp(a, 0, 1).toFixed(3) };
    }

    m = s.match(/^#([0-9a-f]{3,8})$/);
    if (m) {
        let hex = m[1];
        if (hex.length === 3 || hex.length === 4)
            hex = hex.split("").map((c) => c + c).join("");
        if (hex.length !== 6 && hex.length !== 8) return null;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8 ? +(parseInt(hex.slice(6, 8), 16) / 255).toFixed(3) : 1;
        return { r, g, b, a };
    }

    // The CSS named color `red` — the one literal the --amiga-red hoist retires.
    if (s === "red") return { r: 255, g: 0, b: 0, a: 1 };
    return null;
}

const sameHue = (a, b) =>
    a != null && b != null && a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
const fmt = (c) => (c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})` : "∅");

// ── Read the live source the keeper tokens live in ───────────────────────────
const SRC = {
    "demo/@/styles/design-idioms.css": read(path.join(REPO, "demo/@/styles/design-idioms.css")),
    "demo/@/styles/style.css": read(path.join(REPO, "demo/@/styles/style.css")),
    "demo/scenes/cube/CubeTarget.vue": read(path.join(REPO, "demo/scenes/cube/CubeTarget.vue")),
    // R.W6-decomp — the tesselateSphere() ball-color call moved out of
    // AmigaScene.vue into the colocated useAmigaThree.ts (the Three.js room
    // carve). The amiga ball-color witness reads the WHOLE amiga scene dir so the
    // grep finds the call wherever it is colocated (AmigaScene.vue OR
    // useAmigaThree.ts), keeping the witness at full strength across the carve.
    "demo/scenes/amiga": [
        read(path.join(REPO, "demo/scenes/amiga/AmigaScene.vue")),
        read(path.join(REPO, "demo/scenes/amiga/useAmigaThree.ts")),
    ].join("\n"),
};

/**
 * extractTokenValue — find the authored value of a `--token: <value>;` declaration
 * in a CSS source string. Reads the FIRST (`:root`/`:host`) declaration — the
 * light/default value the demo serves at rest (NOT the `.dark` override). Returns
 * the trimmed value string or null.
 */
function extractTokenValue(src, token) {
    // Match the token decl; the first match is the :root default (the .dark
    // override appears later in the cascade and is intentionally not the baseline).
    const re = new RegExp(`${token.replace(/[-]/g, "\\-")}\\s*:\\s*([^;]+);`);
    const m = src.match(re);
    return m ? m[1].trim() : null;
}

/**
 * resolveValue — resolve an authored value to a canonical color, following a SINGLE
 * level of `var(--keeper)` indirection through the keeper set (the alias depth the
 * hoist uses: --color-progress→--accent-red, --amiga-red→--rainbow-red,
 * --spring-lane-*→--rainbow-*). Returns {color, via} or {color:null}.
 */
function resolveValue(rawValue, keeperColors, seen = new Set()) {
    if (!rawValue) return { color: null };
    const v = rawValue.trim();
    const varM = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (varM) {
        const ref = varM[1];
        if (seen.has(ref)) return { color: null }; // cycle guard
        seen.add(ref);
        if (keeperColors[ref] !== undefined)
            return { color: keeperColors[ref], via: ref };
        return { color: null, via: ref };
    }
    return { color: parseColor(v) };
}

// ── Load the baseline ────────────────────────────────────────────────────────
if (!fs.existsSync(BASELINE_PATH)) {
    fail(
        `the baseline scripts/baselines/crayon-preserved.json is MISSING — the ` +
            `regression-lock has no oracle to compare against`,
    );
    finish();
}
let baseline;
try {
    baseline = JSON.parse(read(BASELINE_PATH));
} catch (e) {
    fail(`the baseline does not parse: ${e.message}`);
    finish();
}

// First pass: the baseline's OWN canonical hue per keeper (resolving its declared
// `resolvesTo` alias against the baseline). This is the oracle hue each live token
// must match. The baseline aliases (--color-progress→--accent-red, --amiga-red→
// --rainbow-red, --spring-lane-*→--rainbow-*) resolve here, deterministic.
const keepers = baseline.keepers ?? {};
const baselineColors = {};
// Follow a `resolvesTo` CHAIN (gentle → color-progress → accent-red) to a literal
// hue. Cycle-guarded; a chain that bottoms out at a non-keeper literal parses there.
function baselineHue(token, seen = new Set()) {
    const spec = keepers[token];
    if (!spec) return null;
    if (spec.resolvesTo && keepers[spec.resolvesTo] && !seen.has(spec.resolvesTo)) {
        seen.add(spec.resolvesTo);
        return baselineHue(spec.resolvesTo, seen);
    }
    return parseColor(spec.value);
}
for (const token of Object.keys(keepers)) {
    baselineColors[token] = baselineHue(token);
}

// ── EXTANT keepers — present + hue-exact (GREEN today; HARD FAIL on regression) ─
// These live as named tokens in the shipped source RIGHT NOW; they must be present
// and unchanged. The cube facets live as rgbs at the CubeTarget literal site (and
// are ALSO matched there even after the --face-N hoist — see the facet block below).
const EXTANT_CSS_TOKENS = [
    ["--rainbow-red", "demo/@/styles/design-idioms.css"],
    ["--rainbow-orange", "demo/@/styles/design-idioms.css"],
    ["--rainbow-yellow", "demo/@/styles/design-idioms.css"],
    ["--rainbow-green", "demo/@/styles/design-idioms.css"],
    ["--rainbow-blue", "demo/@/styles/design-idioms.css"],
    ["--rainbow-violet", "demo/@/styles/design-idioms.css"],
    ["--rainbow-cyan", "demo/@/styles/design-idioms.css"],
    ["--accent-red", "demo/@/styles/style.css"],
    ["--color-progress", "demo/@/styles/style.css"],
];

// The live keeper colors as we resolve them — feeds var() alias resolution.
const liveColors = {};

for (const [token, file] of EXTANT_CSS_TOKENS) {
    const want = baselineColors[token];
    const raw = extractTokenValue(SRC[file], token);
    if (raw == null) {
        fail(
            `[extant] ${token} is MISSING from ${file} — a keeper token was REMOVED ` +
                `(the abrogation the user forbade)`,
        );
        continue;
    }
    const { color, via } = resolveValue(raw, liveColors);
    if (color == null) {
        fail(
            `[extant] ${token} = "${raw}"${via ? ` (→ ${via})` : ""} did not resolve to a ` +
                `color — the keeper hue is unreadable (recolored to an unparseable value?)`,
        );
        continue;
    }
    liveColors[token] = color;
    if (sameHue(color, want)) {
        ok(
            `[extant] ${token} = ${fmt(color)} — hue-exact to the 4.3.0 baseline` +
                `${via ? ` (via ${via})` : ""}`,
        );
    } else {
        fail(
            `[extant] ${token} RECOLORED — live ${fmt(color)} ≠ baseline ${fmt(want)} ` +
                `(the user's binding verdict: REFINE, do NOT recolor a keeper)`,
        );
    }
}

// ── The six cube facet rgbs — pinned at the CubeTarget literal site ───────────
// These are crayon SIGNAL surfaces. They live TODAY as rgba() literals in the
// cubeSides array (CubeTarget.vue) and L.W11 hoists them into --face-1…6 (hue
// EXACT). We pin the COLORS at the literal site so they are locked whether they
// read as a literal (today) or a var(--face-N) (post-hoist). The match is by the
// facet's declared `class` so a reorder can't smuggle a recolor past.
const FACET_CLASS_BY_TOKEN = {
    "--face-1": "front",
    "--face-2": "right",
    "--face-3": "back",
    "--face-4": "left",
    "--face-5": "top",
    "--face-6": "bottom",
};
const cubeSrc = SRC["demo/scenes/cube/CubeTarget.vue"];
for (const [token, facetClass] of Object.entries(FACET_CLASS_BY_TOKEN)) {
    const want = baselineColors[token];
    // Find the cubeSides entry for this facet class and read its `color:` value.
    const entryRe = new RegExp(
        `class:\\s*["']${facetClass}["'][^}]*?color:\\s*["']([^"']+)["']`,
    );
    const m = cubeSrc.match(entryRe);
    if (!m) {
        fail(
            `[facet] the cube facet "${facetClass}" (${token}) was NOT found at its ` +
                `CubeTarget.vue site — a crayon facet was removed/renamed`,
        );
        continue;
    }
    const raw = m[1].trim();
    // The facet may read as a literal (rgba/hex/named) OR a var(--face-N) post-hoist.
    const { color, via } = resolveValue(raw, liveColors);
    if (color == null) {
        // var(--face-N) with the token not yet declared anywhere we resolved — record
        // it as a pending hoist (the literal still carries the hue today).
        note(
            `[facet] ${token} (${facetClass}) reads "${raw}" — pending hoist resolution ` +
                `(the --face-N token is referenced but not yet declared)`,
        );
        continue;
    }
    if (sameHue(color, want)) {
        ok(
            `[facet] ${token} (${facetClass}) = ${fmt(color)} — hue-exact to the 4.3.0 ` +
                `crayon facet${via ? ` (via ${via})` : ""}`,
        );
    } else {
        fail(
            `[facet] ${token} (${facetClass}) RECOLORED — live ${fmt(color)} ≠ baseline ` +
                `${fmt(want)} (the cube's six crayon facets are KEPT, every hue intact)`,
        );
    }
}

// ── HOIST-TARGET tokens — hue-exact IF PRESENT; absence is a PENDING-HOIST ─────
// The named tokens L.W11 will introduce (--face-1…6 in style.css, --amiga-red +
// --spring-lane-* in design-idioms.css). They do NOT exist today (born-RED for the
// refinement to satisfy) — so their ABSENCE is recorded as a pending hoist, NOT a
// fail (the gate stays GREEN pre-hoist; the crayons live as their literals, which
// the extant/facet blocks already pinned). Once a token is DECLARED, its hue MUST
// match the baseline (a recolor on hoist is a HARD FAIL — the hoist is one-for-one).
const HOIST_TARGETS = [
    ["--face-1", "demo/@/styles/style.css"],
    ["--face-2", "demo/@/styles/style.css"],
    ["--face-3", "demo/@/styles/style.css"],
    ["--face-4", "demo/@/styles/style.css"],
    ["--face-5", "demo/@/styles/style.css"],
    ["--face-6", "demo/@/styles/style.css"],
    ["--amiga-red", "demo/@/styles/design-idioms.css"],
    ["--spring-lane-smooth", "demo/@/styles/design-idioms.css"],
    ["--spring-lane-snappy", "demo/@/styles/design-idioms.css"],
    ["--spring-lane-bouncy", "demo/@/styles/design-idioms.css"],
    ["--spring-lane-gentle", "demo/@/styles/design-idioms.css"],
];

for (const [token, file] of HOIST_TARGETS) {
    const want = baselineColors[token];
    const raw = extractTokenValue(SRC[file], token);
    if (raw == null) {
        note(
            `[hoist] ${token} not yet declared in ${file} — PENDING HOIST (the crayon ` +
                `lives as its literal today; once L.W11 hoists it, the hue must equal ` +
                `${fmt(want)})`,
        );
        continue;
    }
    const { color, via } = resolveValue(raw, liveColors);
    if (color == null) {
        fail(
            `[hoist] ${token} = "${raw}"${via ? ` (→ ${via})` : ""} did not resolve to a ` +
                `color — the hoisted token must alias a keeper (e.g. var(--rainbow-*)) or ` +
                `carry the exact literal hue`,
        );
        continue;
    }
    if (sameHue(color, want)) {
        ok(
            `[hoist] ${token} = ${fmt(color)} — HOISTED hue-exact to the 4.3.0 baseline` +
                `${via ? ` (via ${via})` : ""}`,
        );
    } else {
        fail(
            `[hoist] ${token} RECOLORED ON HOIST — live ${fmt(color)} ≠ baseline ${fmt(want)} ` +
                `(the hygiene lift is ONE-FOR-ONE, hue-preserving — NO recolor)`,
        );
    }
}

// ── The --amiga-red literal-retire witness ────────────────────────────────────
// The hoist's other half: AmigaScene.vue's tesselateSphere('white','red',…) raw
// literal becomes tesselateSphere('#ffffff','var(--amiga-red)',…) — and crucially,
// --amiga-red: var(--rainbow-red). So the hoist is a deliberate RE-SOURCE: the
// pre-hoist raw `'red'` (pure rgb(255,0,0)) becomes the canonical crayon
// --rainbow-red (rgb(240,66,66)) — the treatment's "right color, raw plumbing"
// (the red was never the defect; the literal was). This is a SANCTIONED re-source
// WITHIN the red family, NOT a recolor away from it, so a still-raw `'red'` today
// is a PENDING note (the --amiga-red token pin, once hoisted, is the real
// authority). What this witness BITES: a recolor of the ball to a NON-red family
// (the abrogation — e.g. the magenta-ball swap the user reversed). We test the
// HUE: the raw literal must stay a red (R dominant, low G/B) until hoisted.
{
    const amigaSrc = SRC["demo/scenes/amiga"];
    const tessM = amigaSrc.match(
        /tesselateSphere\(\s*["'][^"']+["']\s*,\s*["']([^"']+)["']/,
    );
    if (!tessM) {
        note(
            `[amiga] the tesselateSphere ball-color arg was not found in the amiga scene dir ` +
                `(the boot may have been restructured) — the --amiga-red token pin governs`,
        );
    } else {
        const arg = tessM[1].trim();
        const varM = arg.match(/^var\(\s*(--[\w-]+)\s*\)$/);
        if (varM) {
            ok(
                `[amiga] the Boing ball reads ${arg} — the raw 'red' literal was RETIRED to ` +
                    `the token (the --amiga-red pin governs its hue)`,
            );
        } else {
            const color = parseColor(arg);
            if (color == null) {
                note(
                    `[amiga] the ball color "${arg}" is not a literal hue we parse — the ` +
                        `--amiga-red token pin governs`,
                );
            } else {
                // Is it still in the RED family? (R clearly dominant over G and B.)
                const isRedFamily =
                    color.r >= 200 && color.g <= 120 && color.b <= 120;
                if (isRedFamily) {
                    note(
                        `[amiga] the Boing ball is still the raw '${arg}' = ${fmt(color)} (the ` +
                            `red family) — PENDING the literal→--amiga-red (var(--rainbow-red)) ` +
                            `hoist that re-sources it to the canonical crayon red`,
                    );
                } else {
                    fail(
                        `[amiga] the Boing ball '${arg}' = ${fmt(color)} is NOT a red — the ` +
                            `crayon-red ball was RECOLORED out of its family (the magenta-ball ` +
                            `swap the user reversed; the red is the keeper)`,
                    );
                }
            }
        }
    }
}

finish();

function finish() {
    if (pending.length) {
        console.log(
            `\nproof:crayon-preserved — ${pending.length} pending hoist note(s) (the named ` +
                `tokens L.W11 introduces; the crayons live as their literals until then — ` +
                `green pre-hoist, hue-exact on hoist).`,
        );
    }
    if (failures.length) {
        console.error(
            `\nproof:crayon-preserved — FAIL (${failures.length}): a keeper crayon was muted, ` +
                `removed, or recolored. The user's binding verdict is REFINE, do NOT abrogate — ` +
                `every keeper hue must resolve to its 4.3.0 baseline.`,
        );
        process.exit(1);
    }
    console.log(
        "\nproof:crayon-preserved — PASS: every crayon keeper resolves to its 4.3.0 hue " +
            "(--rainbow-* six stops + cyan, --accent-red/--color-progress, the six cube facets); " +
            "the hoist targets are hue-exact where present. The crayons are KEPT, every hue intact.",
    );
    process.exit(0);
}
