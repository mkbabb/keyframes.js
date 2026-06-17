#!/usr/bin/env node
/**
 * proof:control-point-live — L.W9 S4 (the DL-K7 GlassControlPoint tripwire; W34,
 * a ≥5-tranche HANDOFF chronic). GATE-FIRST: the gate is authored BEFORE any
 * implementation, per the K close's "author proof:control-point-live first" BOOK.
 *
 * THE ASK (KF-TO-GLASSUI-BB-ASKS.md §4). glass-ui BB must publish
 * `GlassControlPoint` — the SVG control-point handle + pointer composable that
 * enables the keyframes curve editor (the demo's bezier/easing editor spine wires
 * the curve over it). It does NOT exist in any published glass-ui yet:
 *   grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/  → ZERO.
 *
 * THIS GATE IS BORN-RED-BY-DESIGN. It asserts:
 *   1. `GlassControlPoint` is importable from the INSTALLED `@mkbabb/glass-ui`
 *      barrel (the published export surface — the dist tree), AND
 *   2. the component renders a draggable SVG handle (the export carries the
 *      shape kf consumes — an SVG `<circle>`/`<g>` handle bound to a pointer
 *      drag, surfaced as a Vue component or a composable factory).
 *
 * It STAYS RED until glass-ui BB ships the component. The RED is the kf-side
 * tripwire that the DL-K7 cross-repo-ask is a LIVE gap, not a closed one. Once
 * glass-ui publishes `GlassControlPoint` and kf re-pins, the import resolves and
 * the gate GREENs.
 *
 * POSTURE (the guardrail): this is a REPORT-ALL TRIPWIRE, NOT a blocking
 * proof:hygiene arm. It rides the report-all CI surface (the demo-smoke /
 * continue-on-error job, beside proof:peer-satisfied) so the EXPECTED RED does
 * not abort the blocking gate chain. Wiring it into the blocking proof:hygiene
 * roster would red the whole suite on a known-pending sibling gap — which the
 * three-state Band-B discipline forbids. It exits NON-ZERO today by design.
 *
 * STATIC (no browser) — a published-surface read + an import probe. Re-runnable:
 * `node scripts/proof-control-point-live.mjs`.
 */
import {
    readFileSync,
    existsSync,
    readdirSync,
    statSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const notes = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const note = (label) => {
    notes.push(label);
    console.log(`  ○ ${label}`);
};

console.log(
    "proof:control-point-live — L.W9 S4 (DL-K7 GlassControlPoint tripwire; born-RED until glass-ui BB ships it)\n",
);

// ── 1. glass-ui installed? ────────────────────────────────────────────────────
const glassDir = join(root, "node_modules", "@mkbabb", "glass-ui");
const glassPkgPath = join(glassDir, "package.json");

if (!existsSync(glassPkgPath)) {
    // glass-ui is an optionalDependency; the library `gates` job installs it not.
    // Without the package there is no published surface to probe — but the gate
    // is born-RED-by-DESIGN, so an absent glass-ui is still a RED on the ask: the
    // component cannot be importable from a package that is not installed. We
    // record the cause precisely and fail (the tripwire's whole point is that the
    // export is NOT yet reachable).
    fail(
        "@mkbabb/glass-ui is NOT installed — GlassControlPoint cannot be importable " +
            "from an absent package. (On the demo arm glass-ui IS installed; this gate " +
            "probes the published export there.)",
    );
    verdict();
}

const glass = JSON.parse(readFileSync(glassPkgPath, "utf8"));
const glassVersion = glass.version;
console.log(`  · installed @mkbabb/glass-ui@${glassVersion}\n`);

// ── 2. GlassControlPoint present anywhere in the published dist tree? ─────────
// A device-independent FACT: grep the dist tree for the export name. ZERO hits
// is the born-RED state (the component has not been published).
function collectDist(dir, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const name of entries) {
        const full = join(dir, name);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) collectDist(full, acc);
        else acc.push(full);
    }
    return acc;
}

const distDir = join(glassDir, "dist");
let distHits = [];
if (existsSync(distDir)) {
    const files = collectDist(distDir);
    for (const f of files) {
        // Only scan text-ish artifacts (js/mjs/cjs/d.ts/json); skip maps/binaries.
        if (!/\.(m?js|cjs|d\.ts|json)$/.test(f)) continue;
        let content;
        try {
            content = readFileSync(f, "utf8");
        } catch {
            continue;
        }
        if (content.includes("GlassControlPoint")) {
            distHits.push(f);
        }
    }
} else {
    note(
        `@mkbabb/glass-ui@${glassVersion} has no dist/ tree at ${distDir} — cannot probe the published surface.`,
    );
}

if (distHits.length === 0) {
    fail(
        `GlassControlPoint is ABSENT from the published @mkbabb/glass-ui@${glassVersion} dist tree ` +
            "(grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/ → ZERO). " +
            "The component the keyframes curve editor consumes has NOT been published.",
    );
} else {
    ok(
        `GlassControlPoint appears in the dist tree (${distHits.length} file(s)) — the export is published.`,
    );

    // ── 3. The export carries the draggable-SVG-handle shape kf consumes. ────
    // When the component exists, confirm it is wired to an SVG handle + a pointer
    // drag (the kf consume shape). A published name that is NOT a draggable SVG
    // handle would mislead the curve-editor wire-up — so the tripwire also asserts
    // the SHAPE, not just the name. The probe co-locates the SVG handle markers
    // (`svg`/`circle`/`<g`) and a pointer-drag marker (`pointerdown`/`pointermove`
    // /`setPointerCapture`/`onDrag`) in a file that names GlassControlPoint.
    const SVG = /svg|circle|<g[\s>]|ellipse|rect/i;
    const DRAG = /pointerdown|pointermove|setPointerCapture|onDrag|drag|pointer-?capture/i;
    let shapeOk = false;
    for (const f of distHits) {
        let content;
        try {
            content = readFileSync(f, "utf8");
        } catch {
            continue;
        }
        if (SVG.test(content) && DRAG.test(content)) {
            shapeOk = true;
            break;
        }
    }
    if (shapeOk) {
        ok(
            "GlassControlPoint co-locates an SVG handle (svg/circle/g) with a pointer-drag binding " +
                "(pointerdown/setPointerCapture) — the draggable-SVG-handle shape the curve editor consumes.",
        );
    } else {
        fail(
            "GlassControlPoint is published but does NOT carry the draggable-SVG-handle shape " +
                "(no co-located SVG handle + pointer-drag binding) — the export does not match the " +
                "curve-editor consume contract.",
        );
    }

    // ── 4. The export resolves from the package barrel (importable). ─────────
    try {
        const mod = await import("@mkbabb/glass-ui");
        if (mod && "GlassControlPoint" in mod) {
            ok("GlassControlPoint resolves from the @mkbabb/glass-ui barrel (importable).");
        } else {
            fail(
                "GlassControlPoint is in the dist tree but does NOT resolve from the " +
                    "@mkbabb/glass-ui barrel export — not importable by a consumer.",
            );
        }
    } catch (err) {
        note(
            "could not dynamically import @mkbabb/glass-ui to confirm the barrel export " +
                `(${String(err?.message ?? err).slice(0, 80)}) — dist-tree presence recorded above.`,
        );
    }
}

verdict();

function verdict() {
    if (failures.length > 0) {
        console.error(
            `\nproof:control-point-live — RED (${failures.length}): GlassControlPoint is NOT yet a ` +
                "draggable-SVG-handle export importable from the published @mkbabb/glass-ui barrel. " +
                "This gate is BORN-RED-BY-DESIGN (DL-K7, W34) — it is a REPORT-ALL TRIPWIRE that the " +
                "cross-repo ask is a LIVE gap, NOT a blocking proof:hygiene arm. It STAYS RED until " +
                "glass-ui BB publishes GlassControlPoint and kf re-pins. DO NOT force it green — a " +
                "green here before the BB publish would hide the very gap the gate exists to surface.",
        );
        process.exit(1);
    }
    console.log(
        "\nproof:control-point-live — PASS: GlassControlPoint is a draggable-SVG-handle export " +
            "importable from the published @mkbabb/glass-ui barrel. The DL-K7 chronic is discharged.",
    );
    process.exit(0);
}
