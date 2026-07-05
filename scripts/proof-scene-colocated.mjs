#!/usr/bin/env node
/**
 * proof:scene-colocated — R.W5 (demo scene fusion + dead-code excision).
 *
 * R.W5 fuses each scene's three scattered halves — the shell entry
 * (`demo/app/scenes/<Name>Scene.vue`) + the domain folder (`demo/<name>/*`) +
 * the shared control surface — into ONE colocated directory
 * `demo/scenes/<name>/`, so every cross-directory import within a scene becomes
 * a local `./` (no more `../../<name>/` climb), and it excises the dead phone
 * scene-switcher carousel + its dead composable + two zero-consumer components.
 *
 * This is a re-runnable STATIC instrument (greps + fs existence checks — no
 * browser, no build), mirroring the collectSources idiom of
 * proof:demo-no-oversize. It BITES on every regression of the fusion:
 *
 *   ASSERTION 1 — COLOCATION. For each fused scene `<name>`, the entry
 *     `demo/scenes/<name>/<Name>Scene.vue` exists AND at least one peer file
 *     (`*Target.vue` or `use<Name>Demo.ts`) lives in the SAME directory; the old
 *     scatter paths (`demo/app/scenes/<Name>Scene.vue`, `demo/<name>/*`) do NOT
 *     exist. Reds if a scene is left scattered or only half-moved.
 *
 *   ASSERTION 2 — NO RELATIVE CLIMBS. Zero `.ts`/`.vue` files under
 *     `demo/scenes/` contain a `../../` parent-climb in an `import`/`export …
 *     from` statement — every cross-directory edge within a scene must be a
 *     local `./` or an `@`-alias. Reds on the exact `../../<name>/` climb the
 *     fusion retires (the plant test re-introduces one and watches this bite).
 *
 *   ASSERTION 3 — DEAD CODE DELETED. Neither `SceneSwitcherCarousel` nor
 *     `useScrollSnapScene` appears as an identifier / import path in any source
 *     file under `demo/`; `Animated.vue` and `ResponsiveSelect.vue` do NOT exist
 *     on disk under `demo/`. Reds while the carousel file is still present + its
 *     App.vue import line survives.
 *
 * Re-runnable: `node scripts/proof-scene-colocated.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const SCENES = path.join(DEMO, "scenes");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

// The colocated scenes (the verified roster, ascending-complexity order). Each is
// ONE colocated directory `demo/scenes/<name>/` carrying `<Name>Scene.vue` + a
// `use<Name>Demo` peer (C-17, the fleet-wide naming convention — S.D4 landed the
// last three `use<Name>Animations` stragglers: square/amiga/cube). The
// compose/morph/motion-path scenes were PRUNED at T.E1/T.E3 (OD-1 = PRUNE).
const SCENE_DIRS = [
    { name: "easing", scene: "EasingScene.vue", demo: "useEasingDemo.ts" },
    { name: "sequence", scene: "SequenceScene.vue", demo: "useSequenceDemo.ts" },
    { name: "square", scene: "SquareScene.vue", demo: "useSquareDemo.ts" },
    { name: "spring", scene: "SpringScene.vue", demo: "useSpringDemo.ts" },
    { name: "amiga", scene: "AmigaScene.vue", demo: "useAmigaDemo.ts" },
    { name: "cube", scene: "CubeScene.vue", demo: "useCubeDemo.ts" },
];

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

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

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:scene-colocated — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log(
        "proof:scene-colocated — R.W5 (scene fusion · no ../../ climb · dead-code excised)",
    );

    // ── ASSERTION 1 — colocation ───────────────────────────────────────────
    {
        const issues = [];
        for (const { name, scene, demo } of SCENE_DIRS) {
            const dir = path.join(SCENES, name);
            const entry = path.join(dir, scene);
            if (!fs.existsSync(entry)) {
                issues.push(
                    `demo/scenes/${name}/${scene} is missing (the scene entry is ` +
                        `not colocated)`,
                );
                continue;
            }
            const files = fs.readdirSync(dir);
            const hasPeer =
                files.some((f) => /Target\.vue$/.test(f)) ||
                files.includes(demo) ||
                files.some((f) => /^use[A-Za-z]+Demo\.ts$/.test(f));
            if (!hasPeer) {
                issues.push(
                    `demo/scenes/${name}/ has the Scene entry but NO peer ` +
                        `(*Target.vue or use*Demo.ts) — half-moved`,
                );
            }
            // The old scatter paths must be gone.
            const oldShell = path.join(DEMO, "app", "scenes", scene);
            if (fs.existsSync(oldShell)) {
                issues.push(
                    `demo/app/scenes/${scene} still exists (the old shell scatter ` +
                        `path was not removed)`,
                );
            }
            const oldDomain = path.join(DEMO, name);
            if (fs.existsSync(oldDomain)) {
                issues.push(
                    `demo/${name}/ still exists (the old domain scatter path was ` +
                        `not removed)`,
                );
            }
        }
        // The shell scenes/ dir under app/ must be fully gone.
        const appScenes = path.join(DEMO, "app", "scenes");
        if (fs.existsSync(appScenes)) {
            issues.push(
                `demo/app/scenes/ still exists — it must be empty-deleted after ` +
                    `all 9 scenes fuse into demo/scenes/<name>/`,
            );
        }
        if (issues.length > 0) {
            failures.push(
                `[colocation] ${issues.length} scene(s) not fully colocated into ` +
                    `demo/scenes/<name>/:\n      ` +
                    issues.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [colocation] all ${SCENE_DIRS.length} scenes fused into ` +
                    `demo/scenes/<name>/ (Scene + peer present; old scatter gone)`,
            );
        }
    }

    // ── ASSERTION 2 — no relative climbs ───────────────────────────────────
    {
        const climbers = [];
        // Match `../../` only inside an import / re-export statement (an actual
        // module edge), not inside a comment or a string literal elsewhere.
        const IMPORT_CLIMB =
            /^\s*(?:import|export)\b[^\n]*\bfrom\s*["'][^"']*\.\.\/\.\.\/[^"']*["']/;
        const BARE_IMPORT_CLIMB = /^\s*import\s*["'][^"']*\.\.\/\.\.\/[^"']*["']/;
        for (const abs of collectSources(SCENES).sort()) {
            const lines = fs.readFileSync(abs, "utf8").split("\n");
            const hits = [];
            lines.forEach((line, i) => {
                if (IMPORT_CLIMB.test(line) || BARE_IMPORT_CLIMB.test(line)) {
                    hits.push(`${i + 1}: ${line.trim()}`);
                }
            });
            if (hits.length > 0) {
                climbers.push(
                    `${relPosix(abs)}\n        ` + hits.join("\n        "),
                );
            }
        }
        if (climbers.length > 0) {
            failures.push(
                `[no-climb] ${climbers.length} file(s) under demo/scenes/ keep a ` +
                    `../../ parent-climb import — every cross-dir edge within a ` +
                    `fused scene must be local ./ or an @-alias:\n      ` +
                    climbers.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [no-climb] zero ../../ parent-climb imports under demo/scenes/`,
            );
        }
    }

    // ── ASSERTION 3 — dead code deleted ────────────────────────────────────
    {
        const issues = [];
        const allDemo = collectSources(DEMO).sort();
        const DEAD_IDENTS = ["SceneSwitcherCarousel", "useScrollSnapScene"];
        for (const ident of DEAD_IDENTS) {
            const refs = [];
            for (const abs of allDemo) {
                const lines = fs.readFileSync(abs, "utf8").split("\n");
                lines.forEach((line, i) => {
                    if (line.includes(ident)) {
                        refs.push(`${relPosix(abs)}:${i + 1}`);
                    }
                });
            }
            if (refs.length > 0) {
                issues.push(
                    `\`${ident}\` still referenced (${refs.length} site(s)): ` +
                        refs.join(", "),
                );
            }
        }
        const DEAD_FILES = [
            "demo/@/components/custom/Animated.vue",
            "demo/@/components/custom/ResponsiveSelect.vue",
            "demo/@/components/custom/SceneSwitcherCarousel.vue",
            "demo/@/composables/useScrollSnapScene.ts",
        ];
        for (const rel of DEAD_FILES) {
            if (fs.existsSync(path.join(REPO, rel))) {
                issues.push(`${rel} still exists on disk (must be deleted)`);
            }
        }
        if (issues.length > 0) {
            failures.push(
                `[dead-code] the R.W5 dead-code excision is incomplete:\n      ` +
                    issues.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [dead-code] SceneSwitcherCarousel + useScrollSnapScene ` +
                    `excised everywhere; Animated.vue + ResponsiveSelect.vue gone`,
            );
        }
    }

    // ── ASSERTION 4 — S.D2 scene-private colocation reference-count ─────────
    // The canonical A4 → D2 → D3 edit order (SPEC §3 DAG); this is edit #2. S.D2
    // evicted the single-area-private modules OUT of demo/@ INTO their sole-
    // consuming scene (a24 F3/F4): orbital-drag/ + matrix-editor/ → scenes/cube/,
    // useTypedTrigger → scenes/sequence/. This reference-count clause LOCKS that
    // privacy: each colocated module must have ZERO importer OUTSIDE its host
    // scene — an external reference means it was never scene-private (it belongs
    // back in @/), so it REDs. Falsifiable: import orbital-drag from another scene
    // → the external ref reds this clause.
    {
        const COLOCATED = [
            ["scenes/cube/orbital-drag", "scenes/cube"],
            ["scenes/cube/matrix-editor", "scenes/cube"],
            ["scenes/sequence/useTypedTrigger.ts", "scenes/sequence"],
        ];
        const SPEC_RE =
            /\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|^\s*import\s*["']([^"']+)["']/gm;
        const allDemo = collectSources(DEMO).sort();
        const issues = [];
        for (const [modRel, host] of COLOCATED) {
            const modAbs = path.join(DEMO, modRel);
            const modExists =
                fs.existsSync(modAbs) ||
                fs.existsSync(modAbs + ".ts") ||
                fs.existsSync(modAbs + ".vue");
            if (!modExists) {
                issues.push(
                    `${modRel} — the S.D2 colocation target does not exist (regressed)`,
                );
                continue;
            }
            const hostPrefix = toPosix(path.join(DEMO, host)) + "/";
            const modPrefix = toPosix(modAbs);
            const external = [];
            for (const abs of allDemo) {
                if (toPosix(abs).startsWith(hostPrefix)) continue; // inside host scene — allowed
                const dir = path.dirname(abs);
                const src = fs.readFileSync(abs, "utf8");
                let m;
                SPEC_RE.lastIndex = 0;
                while ((m = SPEC_RE.exec(src)) !== null) {
                    const spec = m[1] ?? m[2] ?? m[3];
                    if (!spec || !(spec.startsWith("./") || spec.startsWith("../")))
                        continue;
                    const resolved = toPosix(path.resolve(dir, spec));
                    if (
                        resolved === modPrefix ||
                        resolved.startsWith(modPrefix + "/") ||
                        resolved === modPrefix.replace(/\.ts$/, "")
                    ) {
                        external.push(relPosix(abs));
                        break;
                    }
                }
            }
            if (external.length > 0) {
                issues.push(
                    `${modRel} is imported from OUTSIDE ${host}/ (${external.length} site(s): ` +
                        external.join(", ") +
                        `) — it is not scene-private; it belongs in @/, not colocated`,
                );
            }
        }
        if (issues.length > 0) {
            failures.push(
                `[d2-ref-count] ${issues.length} S.D2 scene-private colocation(s) ` +
                    `referenced externally:\n      ` +
                    issues.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [d2-ref-count] the S.D2 scene-private colocations ` +
                    `(orbital-drag/matrix-editor→cube, useTypedTrigger→sequence) ` +
                    `have zero external importer`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:scene-colocated — FAIL (the R.W5 scene fusion / dead-code excision regressed):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }

    console.log(
        "\nproof:scene-colocated — PASS: every scene fused into demo/scenes/<name>/\n" +
            "(local imports, no ../../ climb); the dead phone carousel + its composable\n" +
            "+ Animated.vue + ResponsiveSelect.vue are excised. R.W5 holds.",
    );
}

main();
