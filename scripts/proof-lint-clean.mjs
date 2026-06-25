#!/usr/bin/env node
/**
 * proof:lint-clean — Q.WA1 (the SLIM source-graph lint tier · AXIS-3 STATIC).
 *
 * THE CARRY, TERMINATED. The eslint/dep-cruiser lint-tier was named in three
 * consecutive charters (M.W2 → O.W1 → P.W1) and built in NONE — a circular
 * import or a boundary-violating source edge passes `tsc --noEmit` silently and
 * reaches the bundle stage (proof:boundary) unguarded, or ships. Q.WA1 lands the
 * floor as a BUILD-IN: `dependency-cruiser` (the ONLY new toolchain — eslint is
 * KILLED, redundant with `tsc --strict` + `prettier-organize-imports`) +
 * `.dependency-cruiser.cjs` (the three source-graph rules) + this born-RED gate.
 *
 * THE REAL OBSERVABLE THIS GATE BITES (NOT a proxy). The genuine defect is *a
 * circular import or a boundary-violating source edge that `tsc --noEmit` greens
 * silently*. This gate does NOT grep for the string "no-cycle" in the config (a
 * stub could fake that). It RUNS `depcruise` over the real source graph and:
 *
 *   (a) asserts `.dependency-cruiser.cjs` exists + `npm run lint` exits 0 on the
 *       clean tree (the config is present + the floor lints green today);
 *   (b) PLANTS three real violations — a NEW module-pair cycle (no-cycle), an
 *       internal/ leaf → engine edge (leaf-no-engine-no-valuejs), and a LIGHT
 *       barrel-module → engine static edge (light-barrel-no-engine) — and asserts
 *       `depcruise` RUNS RED on each, proving the three rules genuinely LIVE
 *       (then reverts every plant). On today's pre-cure tree `tsc --noEmit` GREENS
 *       a planted cycle — that is the live demonstration the floor was absent.
 *
 * Clause (c) — the gate is aggregator-reachable from proof:hygiene (no dead
 * gate) — is enforced by proof:ci-coverage's converse-coverage clause, not
 * re-implemented here.
 *
 * THE BASELINE NUANCE (recorded, not hidden). The src/animation/ engine cluster
 * carries pre-existing co-recursive RUNTIME cycles (the module+extracted-submodule
 * pattern: engine↔easing↔frame-compiler↔group↔waapi, spring↔spring-duration↔
 * spring-reseat, group↔group-layer-springs, drag↔drag-2d). Q.WA1 ships ZERO
 * engine code, so it cannot refactor them away; they are recorded in
 * dependency-cruiser's known-violations BASELINE
 * (.dependency-cruiser-known-violations.json) and `lint` runs `--ignore-known`.
 * This is the tool's blessed ratchet: the floor greens on today's tree, no-cycle
 * still BITES any NEW cycle (clause (b) proves a planted new cycle reds THROUGH
 * the baseline), and the baseline holds ZERO boundary-rule (rule 2/3) entries —
 * the value.js/engine boundary guards run with no swallowed debt.
 *
 * GREEN on the cure: config present + `npm run lint` exits 0 + all three planted
 * violations red the relevant rule + (via ci-coverage) wired into proof:hygiene.
 * Re-runnable: `node scripts/proof-lint-clean.mjs`.
 */
import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(root, ".dependency-cruiser.cjs");
const BASELINE = join(root, ".dependency-cruiser-known-violations.json");
const ANIM = join(root, "src", "animation");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:lint-clean — Q.WA1 (the SLIM dependency-cruiser source-graph floor · RUN, not grep)",
);

/**
 * Run `depcruise src --ignore-known` (the same invocation the `lint` script
 * uses). Returns { code, out } — code 0 = clean, non-zero = a LIVE violation.
 * `execFileSync` throws on a non-zero exit; we capture the status from the error.
 */
function runDepcruise() {
    try {
        const out = execFileSync(
            "npx",
            ["depcruise", "src", "--ignore-known"],
            { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        );
        return { code: 0, out };
    } catch (e) {
        return {
            code: typeof e.status === "number" ? e.status : 1,
            out: `${e.stdout ?? ""}${e.stderr ?? ""}`,
        };
    }
}

// ── clause (a): the config exists + the clean tree lints clean ───────────────
if (!existsSync(CONFIG)) {
    fail(
        ".dependency-cruiser.cjs is ABSENT — the 3-tranche O-Band-A lint carry " +
            "(M.W2→O.W1→P.W1) is still unbuilt. Author the config with the three " +
            "source-graph rules (no-cycle, leaf-no-engine-no-valuejs, light-barrel-no-engine).",
    );
} else {
    ok(".dependency-cruiser.cjs is present");
}
if (!existsSync(BASELINE)) {
    fail(
        ".dependency-cruiser-known-violations.json (the no-cycle baseline) is " +
            "ABSENT — `lint --ignore-known` would red on the pre-existing engine-cluster " +
            "cycles. Generate it with `depcruise src --output-type baseline`.",
    );
} else {
    // The baseline must hold ZERO boundary-rule entries — only the pre-existing
    // no-cycle debt is ratcheted; the value.js/engine boundary guards (rules 2/3)
    // run with no swallowed debt. A baselined boundary violation would be a
    // silent boundary breach.
    let baseline = [];
    try {
        baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
    } catch {
        baseline = [];
    }
    const boundaryBaselined = baseline.filter(
        (e) =>
            e?.rule?.name === "leaf-no-engine-no-valuejs" ||
            e?.rule?.name === "light-barrel-no-engine",
    );
    if (boundaryBaselined.length > 0) {
        fail(
            `the known-violations baseline ratchets ${boundaryBaselined.length} ` +
                "BOUNDARY-rule violation(s) (leaf-no-engine-no-valuejs / " +
                "light-barrel-no-engine) — the value.js/engine boundary guard must " +
                "carry ZERO baselined debt (only the pre-existing no-cycle cycles may " +
                "be ratcheted).",
        );
    } else {
        ok(
            `the baseline ratchets ${baseline.length} pre-existing cycle(s); ZERO ` +
                "boundary-rule debt is swallowed (rules 2/3 run live)",
        );
    }
}

// Only RUN depcruise if the config + baseline are present (else npx would error
// for the absence, not a real lint verdict).
if (failures.length === 0) {
    const clean = runDepcruise();
    if (clean.code === 0) {
        ok("`depcruise src --ignore-known` exits 0 on the clean tree (lint green)");
    } else {
        fail(
            "`depcruise src --ignore-known` exited non-zero on the CLEAN tree — a " +
                "LIVE (non-baselined) source-graph violation is present:\n" +
                clean.out
                    .split("\n")
                    .filter((l) => /error|violation/i.test(l))
                    .join("\n"),
        );
    }
}

// ── clause (b): PLANT-A-FAILURE — each rule must RUN RED on a real violation ──
// We mutate the real tree, run depcruise, assert it reds the named rule, then
// revert. A finally-guarded revert restores every file even if an assertion
// throws. This is the born-RED proof the rules are genuinely live — never a
// grep of the config text a stub could green.
if (failures.length === 0) {
    const FIXTURE = join(ANIM, "__lint_fixture__");
    const LEAF = join(ANIM, "internal", "leaves.ts");
    // R.W1: the LIGHT barrel modules moved into zone directories; the plant 3
    // fixture targets the spring progress module (physics/spring/progress.ts).
    const LIGHT = join(ANIM, "physics", "spring", "progress.ts");
    const LEAF_BAK = `${LEAF}.proof-lint-bak`;
    const LIGHT_BAK = `${LIGHT}.proof-lint-bak`;

    const plant = (label, ruleName, setup, teardown) => {
        let result;
        try {
            setup();
            result = runDepcruise();
        } finally {
            teardown();
        }
        const bit =
            result.code !== 0 &&
            new RegExp(`error ${ruleName}\\b`).test(result.out);
        if (bit) {
            ok(`PLANT bites — ${label} reds rule \`${ruleName}\``);
        } else {
            fail(
                `PLANT did NOT bite — ${label} should have red rule \`${ruleName}\`, ` +
                    `but depcruise exited ${result.code} without firing it. The rule is ` +
                    `MISSING or mis-scoped (the floor is a no-op).`,
            );
        }
    };

    // Plant 1 — a NEW module-pair cycle (a↔b, runtime value imports). It MUST
    // red no-cycle THROUGH the --ignore-known baseline (the baseline ratchets the
    // pre-existing cycles only; a new one bites). This is the regression the
    // floor exists to catch: on the pre-cure tree `tsc --noEmit` greens it.
    plant(
        "a new module-pair cycle (src/animation/__lint_fixture__/{a,b}.ts)",
        "no-cycle",
        () => {
            mkdirSync(FIXTURE, { recursive: true });
            writeFileSync(
                join(FIXTURE, "a.ts"),
                'import { b } from "./b";\nexport const a = () => b();\n',
            );
            writeFileSync(
                join(FIXTURE, "b.ts"),
                'import { a } from "./a";\nexport const b = () => a();\n',
            );
        },
        () => rmSync(FIXTURE, { recursive: true, force: true }),
    );

    // Plant 2 — an internal/ leaf statically imports ../engine. MUST red
    // leaf-no-engine-no-valuejs (the value.js-free-leaf law).
    plant(
        "an internal/ leaf importing ../engine (leaves.ts)",
        "leaf-no-engine-no-valuejs",
        () => {
            cpSync(LEAF, LEAF_BAK);
            writeFileSync(
                LEAF,
                readFileSync(LEAF, "utf8") +
                    '\nimport { getTimingFunction as _probe } from "../engine";\nexport const _lintProbe = _probe;\n',
            );
        },
        () => {
            if (existsSync(LEAF_BAK)) {
                cpSync(LEAF_BAK, LEAF);
                rmSync(LEAF_BAK, { force: true });
            }
        },
    );

    // Plant 3 — a LIGHT barrel module (physics/spring/progress.ts) statically
    // imports ../../engine. MUST red light-barrel-no-engine (the STATIC pre-flight
    // of proof:boundary). The zone-relative path is `../../engine` (R.W1).
    plant(
        "a LIGHT barrel module importing ../../engine (physics/spring/progress.ts)",
        "light-barrel-no-engine",
        () => {
            cpSync(LIGHT, LIGHT_BAK);
            writeFileSync(
                LIGHT,
                readFileSync(LIGHT, "utf8") +
                    '\nimport { getTimingFunction as _probe } from "../../engine";\nexport const _lintProbe = _probe;\n',
            );
        },
        () => {
            if (existsSync(LIGHT_BAK)) {
                cpSync(LIGHT_BAK, LIGHT);
                rmSync(LIGHT_BAK, { force: true });
            }
        },
    );

    // Post-plant sanity: the tree is restored + lints clean again (no plant leaked).
    const restored = runDepcruise();
    if (restored.code === 0) {
        ok("the tree is restored after the plants (lint green again — no leak)");
    } else {
        fail(
            "after reverting the plants the tree does NOT lint clean — a plant " +
                "leaked (a fixture/backup file was left behind). Manual cleanup needed.",
        );
    }
}

// ── report ───────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:lint-clean — FAIL (${failures.length}): the source-graph lint floor ` +
            "is absent, lints dirty, or a rule is a no-op.",
    );
    process.exit(1);
}
console.log(
    "\nproof:lint-clean — PASS: the dependency-cruiser source-graph floor exists, the " +
        "clean tree lints green, and all three rules (no-cycle, leaf-no-engine-no-valuejs, " +
        "light-barrel-no-engine) RUN RED on a planted violation. The 3-tranche O-Band-A " +
        "lint carry is terminated as a BUILD-IN.",
);
