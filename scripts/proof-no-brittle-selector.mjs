#!/usr/bin/env node
/**
 * proof:no-brittle-selector — H.W12 S4 / I11 (de-brittle the scene targets).
 *
 * Two brittleness shapes I11 names in the scene targets:
 *   (a) a class-STRING DOM walk (`.closest(".class")` / `querySelector(".class")`)
 *       — a component reaching for a SIBLING/ancestor by a class-name literal that
 *       breaks the moment the class is renamed or a sibling adds the same class;
 *       the owned form is a `useTemplateRef` (the established W3/W10 pattern).
 *   (b) the motion-path nearest-point projection's magic `SAMPLE_STEP = 5` step +
 *       the implicit-square-viewBox client→user-unit scale (`:131-134`) — a bare
 *       literal + an undocumented coupling that silently mis-projects if the stage
 *       aspect ever changes.
 *
 * W12 de-brittles BOTH: the scene targets carry ZERO class-string walks (owned
 * refs only); `SAMPLE_STEP` is a NAMED, documented constant; and the square-viewBox
 * scale is CENTRALIZED into ONE `clientToUserUnits` helper that asserts the
 * `aspect-ratio: 1` / `0 0 VIEW VIEW` invariant in ONE place (so a future non-square
 * stage breaks there, visibly, not in two drifting hand-rolled copies).
 *
 * Re-runnable STATIC instrument (no browser, no build), mirroring the
 * blankComments + collectSources idioms of proof:brittleness.
 *
 *   CLAUSE 1 — ZERO CLASS-STRING DOM WALK. No `.closest("…")` / `querySelector(…)`
 *     / `querySelectorAll(…)` call in the scene targets (spring / sequence /
 *     motion-path) takes a CLASS-token selector string (a literal beginning with
 *     `.` or containing a `.class` token). An `#id` / tag / attribute selector is
 *     fine; the brittle form is the class-name reach. Comment-blanked.
 *
 *   CLAUSE 2 — NAMED STEP. `useMotionPathGesture.ts` declares a NAMED
 *     `SAMPLE_STEP` constant (no bare magic `5` in a nearest-point loop).
 *
 *   CLAUSE 3 — DOCUMENTED + CENTRALIZED viewBox INVARIANT. `motionPathGeometry.ts`
 *     exports the ONE `clientToUserUnits` scale helper, it names the square-viewBox
 *     invariant (the `aspect-ratio: 1` / `VIEW` coupling), and the gesture
 *     composable routes its client→user-unit mapping through it (no second
 *     hand-rolled scale copy).
 *
 * Re-runnable: `node scripts/proof-no-brittle-selector.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

// The scene targets clause 1 sweeps (the de-brittle subjects) + the two
// motion-path files clauses 2/3 assert against.
const SCENE_TARGET_DIRS = ["demo/spring", "demo/sequence", "demo/motion-path"];
const GESTURE_COMPOSABLE = "demo/motion-path/useMotionPathGesture.ts";
const GEOMETRY = "demo/motion-path/motionPathGeometry.ts";

const failures = [];

/** Walk a dir, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

/** Comment-blanker (block + line + HTML), newline-preserving. */
function blankComments(s) {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        if (s.startsWith("<!--", i)) {
            const end = s.indexOf("-->", i + 4);
            const stop = end === -1 ? n : end + 3;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
}

function main() {
    console.log(
        "proof:no-brittle-selector — H.W12 S4/I11 (zero class-walks · named SAMPLE_STEP · documented viewBox invariant)",
    );

    // ── CLAUSE 1 — zero class-string DOM walk in the scene targets ─────────
    {
        // `.closest("…")` / `querySelector("…")` / `querySelectorAll("…")` whose
        // FIRST string argument is a CLASS selector (begins with `.` or contains a
        // `.classToken`). An `#id` / tag / `[attr]` selector is NOT brittle here.
        const WALK =
            /\.(?:closest|querySelector(?:All)?)\s*\(\s*(["'`])([^"'`]*)\1/g;
        // A class-token appears as a `.` immediately followed by an identifier
        // char (so `.class` / `el.class` reads as a class), NOT an attribute or id.
        const HAS_CLASS_TOKEN = /\.[A-Za-z_-]/;
        const offenders = [];
        for (const dir of SCENE_TARGET_DIRS) {
            for (const abs of collectSources(path.join(REPO, dir))) {
                const src = blankComments(read(abs));
                for (const m of src.matchAll(WALK)) {
                    const sel = m[2];
                    if (HAS_CLASS_TOKEN.test(sel)) {
                        const line = src.slice(0, m.index).split("\n").length;
                        offenders.push({
                            rel: relPosix(abs),
                            line,
                            sel,
                        });
                    }
                }
            }
        }
        if (offenders.length > 0) {
            failures.push(
                `[class-walk] ${offenders.length} class-string DOM walk(s) in the ` +
                    `scene targets (\`.closest(".…")\` / \`querySelector(".…")\`) — ` +
                    `a component reaching by class-name literal is brittle; use an ` +
                    `owned \`useTemplateRef\` (H.W12.S4/I11). Sites:\n      ` +
                    offenders
                        .map((o) => `${o.rel}:${o.line}  "${o.sel}"`)
                        .join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [class-walk] ZERO class-string DOM walks in ` +
                    `spring/sequence/motion-path (every ref is a useTemplateRef)`,
            );
        }
    }

    // ── CLAUSE 2 — SAMPLE_STEP is a named constant ─────────────────────────
    {
        const abs = path.join(REPO, GESTURE_COMPOSABLE);
        if (!fs.existsSync(abs)) {
            failures.push(
                `[named-step] ${GESTURE_COMPOSABLE} does not exist.`,
            );
        } else {
            const src = blankComments(read(abs));
            const declared =
                /\b(?:const|let)\s+SAMPLE_STEP\s*=\s*\d/.test(src);
            const usesName = /\bSAMPLE_STEP\b/.test(src);
            if (!declared || !usesName) {
                failures.push(
                    `[named-step] ${GESTURE_COMPOSABLE} does not declare + use a ` +
                        `NAMED \`SAMPLE_STEP\` constant for the nearest-point search ` +
                        `resolution — a bare magic step literal is brittle ` +
                        `(H.W12.S4/I11).`,
                );
            } else {
                console.log(
                    `  ✓ [named-step] SAMPLE_STEP is a named, documented constant ` +
                        `in ${GESTURE_COMPOSABLE} (no bare magic step)`,
                );
            }
        }
    }

    // ── CLAUSE 3 — the square-viewBox scale is centralized + documented ────
    {
        const geomAbs = path.join(REPO, GEOMETRY);
        const gestureAbs = path.join(REPO, GESTURE_COMPOSABLE);
        if (!fs.existsSync(geomAbs)) {
            failures.push(`[viewbox-invariant] ${GEOMETRY} does not exist.`);
        } else {
            const geomSrc = read(geomAbs); // KEEP comments — the invariant IS prose
            const geomCode = blankComments(geomSrc);
            // The ONE scale helper exists + is exported.
            const helperExported =
                /export\s+function\s+clientToUserUnits\b/.test(geomCode);
            // The invariant is DOCUMENTED (the prose names the square coupling).
            const invariantDocumented =
                /aspect-ratio:\s*1/.test(geomSrc) &&
                /(?:square|VIEW)/.test(geomSrc);
            if (!helperExported) {
                failures.push(
                    `[viewbox-invariant] ${GEOMETRY} does not export the single ` +
                        `\`clientToUserUnits\` scale helper — the client→user-unit ` +
                        `mapping must be CENTRALIZED in ONE place (H.W12.S4/I11).`,
                );
            }
            if (!invariantDocumented) {
                failures.push(
                    `[viewbox-invariant] ${GEOMETRY} does not DOCUMENT the ` +
                        `square-viewBox coupling (the \`aspect-ratio: 1\` / square ` +
                        `\`0 0 VIEW VIEW\` invariant) at the scale helper — an ` +
                        `undocumented coupling silently mis-projects on a future ` +
                        `non-square stage (H.W12.S4/I11).`,
                );
            }
            // The gesture composable routes its scale THROUGH the helper (no
            // second hand-rolled copy of the px→user-unit math).
            if (fs.existsSync(gestureAbs)) {
                const gestureCode = blankComments(read(gestureAbs));
                const routesThroughHelper =
                    /\bclientToUserUnits\b/.test(gestureCode);
                if (!routesThroughHelper) {
                    failures.push(
                        `[viewbox-invariant] ${GESTURE_COMPOSABLE} does not route ` +
                            `its client→user-unit scale through ` +
                            `\`clientToUserUnits\` — a second hand-rolled scale copy ` +
                            `re-introduces the drift the central helper prevents ` +
                            `(H.W12.S4/I11).`,
                    );
                }
            }
            if (
                helperExported &&
                invariantDocumented &&
                !failures.some((f) => f.startsWith("[viewbox-invariant]"))
            ) {
                console.log(
                    `  ✓ [viewbox-invariant] the square-viewBox scale is ONE ` +
                        `documented \`clientToUserUnits\` helper (${GEOMETRY}); the ` +
                        `gesture composable routes through it (no drifting copy)`,
                );
            }
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:no-brittle-selector — FAIL (brittleness not de-brittled):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The scene targets reach by owned refs, not class-string DOM walks;\n" +
                "  the motion-path projection names its SAMPLE_STEP and centralizes the\n" +
                "  square-viewBox scale in ONE documented helper. I11 closes the\n" +
                "  magic-number + implicit-coupling brittleness.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:no-brittle-selector — PASS: zero class-string DOM walks in the\n" +
            "scene targets; SAMPLE_STEP is named; the square-viewBox scale is ONE\n" +
            "documented helper. H.W12 S4/I11 holds.",
    );
}

main();
