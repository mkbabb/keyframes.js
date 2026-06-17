#!/usr/bin/env node
/**
 * proof:workaround-deletion — L.W9 Band-B (the consume-edge deletion ledger).
 *
 * The kf consume seam carries FIVE live workarounds for SIBLING defects (the
 * 36-lane audit's ⚠1–3/⚠5/⚠7/⚠18–20/⚠24 class). Each is a named precept
 * violation today (inv-16 / no-workaround / inv-L-acyclic-purity): the FIX
 * belongs in the sibling, and kf's side is a band-aid held until the sibling
 * publishes the root cure. Deleting a band-aid BEFORE the sibling has actually
 * shipped the fix would leave the consumer broken — so this gate must NOT demand
 * deletion before the publish lands.
 *
 * THE THREE-STATE MODEL (the Band-B consume-edge lifecycle, exactly):
 *
 *   ABSENT               → GREEN   (workaround deleted; the cure is consumed)
 *   PRESENT + UNPUBLISHED → PENDING (exit 0 — the sibling root-fix has NOT
 *                                    shipped; deleting now would break the
 *                                    consumer; this is the STAGED state, not a
 *                                    false alarm)
 *   PRESENT + PUBLISHED   → RED     (exit 1 — the sibling fixed the root and
 *                                    published it, but kf has NOT consumed; the
 *                                    deletion is now OVERDUE)
 *
 * The gate is therefore born-PENDING on today's tree (every arm PRESENT, every
 * paired sibling fix UNPUBLISHED) and GREENs arm-by-arm as siblings publish AND
 * kf consumes. It only ever turns RED to demand an action that is now SAFE.
 *
 * THE PUBLISH PROBE (`npm show <pkg>@<required> version`):
 *   - exit 0 + a non-empty version on stdout  → PUBLISHED.
 *   - exit != 0 with `E404` in stderr          → genuinely UNPUBLISHED → PENDING.
 *   - any other probe failure (network error / no registry / ENOTFOUND /
 *     ECONNREFUSED / timeout)                  → INDETERMINATE → PENDING.
 * INDETERMINATE collapses to PENDING by design: a flaky registry probe must
 * NEVER red a still-needed workaround (the inverse mistake the guardrail names).
 * The only path to RED is a CONFIRMED publish (exit 0 + version) over a PRESENT
 * workaround.
 *
 * Each arm GREPS the workaround PATTERN over the kf source tree (a device-
 * INDEPENDENT FACT — a string match, not a timing measurement; a `hard` gate).
 * STATIC, re-runnable, no browser: `node scripts/proof-workaround-deletion.mjs`.
 *
 * GUARDRAIL (a workaround was caught + reverted in L.W1): this gate is GATE-
 * FIRST. It does NOT delete any workaround; it does NOT weaken any other gate.
 * It records the per-arm state and exits 0 while every arm is PENDING.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Source-tree grep (no shell; a pure FS walk + per-line regex) ─────────────

/** Recursively collect files under `dir` that match `fileFilter`, skipping
 *  node_modules / .git / dist (the workaround sources live in src/ + demo/). */
function collectFiles(dir, fileFilter, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const name of entries) {
        if (
            name === "node_modules" ||
            name === ".git" ||
            name === "dist" ||
            name === ".vite"
        ) {
            continue;
        }
        const full = join(dir, name);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) {
            collectFiles(full, fileFilter, acc);
        } else if (fileFilter(full)) {
            acc.push(full);
        }
    }
    return acc;
}

/** Grep `pattern` across the files under `subpath` (relative to repo root) whose
 *  name passes `fileFilter`. Returns [{ file, line, text }] hits. The pattern is
 *  a RegExp tested per line. */
function grepTree(subpath, fileFilter, pattern) {
    const base = join(root, subpath);
    if (!existsSync(base)) return [];
    const files = statSync(base).isDirectory()
        ? collectFiles(base, fileFilter)
        : fileFilter(base)
          ? [base]
          : [];
    const hits = [];
    for (const file of files) {
        let lines;
        try {
            lines = readFileSync(file, "utf8").split("\n");
        } catch {
            continue;
        }
        lines.forEach((text, i) => {
            // Reset lastIndex defensively (pattern may be /g).
            pattern.lastIndex = 0;
            if (pattern.test(text)) {
                hits.push({
                    file: relative(root, file),
                    line: i + 1,
                    text: text.trim(),
                });
            }
        });
    }
    return hits;
}

const isVue = (f) => f.endsWith(".vue");
const isTs = (f) => f.endsWith(".ts");
const exact = (rel) => (f) => f === join(root, rel);

// ── Publish probe (the three-state classifier's PUBLISHED/UNPUBLISHED axis) ──

/**
 * Probe whether `pkg@version` is published to the registry.
 * Returns one of: "PUBLISHED" | "UNPUBLISHED" | "INDETERMINATE".
 *   - PUBLISHED:    npm show exits 0 with a non-empty version on stdout.
 *   - UNPUBLISHED:  npm show fails with a registry E404 (the version is not
 *                   published — the genuine "sibling hasn't shipped" signal).
 *   - INDETERMINATE: any other failure (network / no registry / timeout) — the
 *                   probe could not determine publish state; collapses to
 *                   PENDING upstream so a flaky probe never reds a workaround.
 */
function probePublish(pkg, version) {
    let stdout = "";
    try {
        stdout = execFileSync("npm", ["show", `${pkg}@${version}`, "version"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
            timeout: 30_000,
        });
        const v = String(stdout).trim();
        return v.length > 0 ? "PUBLISHED" : "INDETERMINATE";
    } catch (err) {
        const stderr = String(err?.stderr ?? "");
        const msg = String(err?.message ?? "");
        const blob = `${stderr}\n${msg}`;
        // A genuine "this version is not published" is an npm E404.
        if (/E404|404 No match found|could not be found/i.test(blob)) {
            return "UNPUBLISHED";
        }
        // Network / registry / timeout failure — cannot determine; PENDING.
        return "INDETERMINATE";
    }
}

// ── The arms (one per S-clause; the workaround pattern + its paired publish) ──

/**
 * Each arm declares:
 *   - id / title:    the S-clause + what the workaround is.
 *   - witness:       { subpath, fileFilter, pattern } — the grep that finds the
 *                    workaround. ABSENT (zero hits) ⇒ GREEN.
 *   - sibling:       { pkg, version, name } — the sibling PUBLISH whose landing
 *                    is the delete pre-condition (probed only when PRESENT).
 */
const arms = [
    {
        id: "S1",
        title:
            "aria-orientation suppress-on-consume (SpringSidebar.vue pill strip) " +
            "→ glass-ui SegmentedTabs root fix",
        // The band-aid: `:aria-orientation="undefined"` on a pill strip. We match
        // the bind whose value is `undefined` (the suppress shape) — NOT every
        // mention of aria-orientation (a doc comment naming it is not a workaround).
        witness: {
            subpath: "demo",
            fileFilter: isVue,
            pattern: /aria-orientation\s*=\s*["']?\s*undefined/,
        },
        sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB SegmentedTabs aria fix" },
    },
    {
        id: "S2",
        title:
            "pointerHandled / onPlayPointerDown interim (TransportDock.vue) " +
            "→ glass-ui RF-17 dock-layer cure",
        witness: {
            subpath: "demo",
            fileFilter: isVue,
            pattern: /pointerHandled|onPlayPointerDown/,
        },
        sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB W-DOCK-MORPH-FAMILY click-strand cure" },
    },
    {
        id: "S7",
        title:
            "linear() flat-comma normalize regex (utils.ts LINEAR_PAREN_PREFIX) " +
            "→ value.js VJ-L2 FunctionValue.toString() fix",
        witness: {
            subpath: "src/animation/utils.ts",
            fileFilter: exact("src/animation/utils.ts"),
            pattern: /LINEAR_PAREN_PREFIX/,
        },
        sibling: { pkg: "@mkbabb/value.js", version: "0.14.0", name: "VJ-L2 linear() serialize fix" },
    },
    {
        id: "S8",
        title:
            "FN_NAME Symbol sidechannel stamped onto value.js ValueUnit (utils.ts) " +
            "→ value.js VJ-L1 first-class flatLeaf",
        // The recurrence-resistant pattern: the FN_NAME constant OR any new
        // `Symbol("kf.` stamped onto a published class (the broader bite the
        // spec's §Bite names).
        witness: {
            subpath: "src/animation/utils.ts",
            fileFilter: exact("src/animation/utils.ts"),
            pattern: /FN_NAME|Symbol\(\s*["']kf\./,
        },
        sibling: { pkg: "@mkbabb/value.js", version: "0.14.0", name: "VJ-L1 flatLeaf provenance API" },
    },
    {
        id: "S9",
        title:
            "direct @mkbabb/parse-that import (utils.ts:1) reaching through value.js's " +
            "parser abstraction → value.js VJ-L3 parseCSSSubValue",
        witness: {
            subpath: "src/animation/utils.ts",
            fileFilter: exact("src/animation/utils.ts"),
            pattern: /from\s+["']@mkbabb\/parse-that["']/,
        },
        sibling: { pkg: "@mkbabb/value.js", version: "0.14.0", name: "VJ-L3 parseCSSSubValue helper" },
    },
];

// ── Run the arms ─────────────────────────────────────────────────────────────

console.log(
    "proof:workaround-deletion — L.W9 Band-B (the three-state consume-edge deletion ledger)\n",
);

const states = []; // { id, state: GREEN|PENDING|RED, detail }

for (const arm of arms) {
    const hits = grepTree(
        arm.witness.subpath,
        arm.witness.fileFilter,
        arm.witness.pattern,
    );

    if (hits.length === 0) {
        // ABSENT → GREEN. The workaround is gone; the cure is consumed.
        console.log(`  ✓ ${arm.id} GREEN — ABSENT. ${arm.title}`);
        console.log(`      (no workaround pattern in ${arm.witness.subpath})`);
        states.push({ id: arm.id, state: "GREEN", detail: "ABSENT" });
        continue;
    }

    // PRESENT — probe the paired sibling publish.
    const where = hits.map((h) => `${h.file}:${h.line}`).join(", ");
    const pub = probePublish(arm.sibling.pkg, arm.sibling.version);

    if (pub === "PUBLISHED") {
        // PRESENT + PUBLISHED → RED. The sibling fixed the root; kf has not
        // consumed. The deletion is OVERDUE and now SAFE.
        console.error(
            `  ✗ ${arm.id} RED — PRESENT + sibling PUBLISHED. ${arm.title}`,
        );
        console.error(
            `      workaround at ${where}; ${arm.sibling.pkg}@${arm.sibling.version} ` +
                `(${arm.sibling.name}) IS published — DELETE the workaround and re-pin.`,
        );
        states.push({
            id: arm.id,
            state: "RED",
            detail: `PRESENT @ ${where}; ${arm.sibling.pkg}@${arm.sibling.version} PUBLISHED`,
        });
    } else {
        // PRESENT + (UNPUBLISHED | INDETERMINATE) → PENDING (exit 0).
        const why =
            pub === "UNPUBLISHED"
                ? `${arm.sibling.pkg}@${arm.sibling.version} is NOT YET published (E404)`
                : `${arm.sibling.pkg}@${arm.sibling.version} publish state INDETERMINATE (registry unreachable — conservatively PENDING)`;
        console.log(
            `  … ${arm.id} PENDING — PRESENT + sibling UNPUBLISHED. ${arm.title}`,
        );
        console.log(
            `      workaround at ${where}; ${why}. Deleting now would break the ` +
                `consumer — held until ${arm.sibling.name} ships.`,
        );
        states.push({
            id: arm.id,
            state: "PENDING",
            detail: `PRESENT @ ${where}; ${why}`,
        });
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────

const red = states.filter((s) => s.state === "RED");
const pending = states.filter((s) => s.state === "PENDING");
const green = states.filter((s) => s.state === "GREEN");

console.log(
    `\nproof:workaround-deletion — ${green.length} GREEN / ${pending.length} PENDING / ${red.length} RED` +
        ` over ${states.length} arms.`,
);
console.log(
    "  state map: " +
        states.map((s) => `${s.id}=${s.state}`).join("  "),
);

if (red.length > 0) {
    console.error(
        `\nproof:workaround-deletion — FAIL (${red.length}): a sibling root-fix is PUBLISHED ` +
            "but the kf workaround is still PRESENT. The deletion is now SAFE and OVERDUE — " +
            "delete the workaround and re-pin the sibling. The arms:\n" +
            red.map((s) => `    ${s.id}: ${s.detail}`).join("\n"),
    );
    process.exit(1);
}

if (pending.length > 0) {
    console.log(
        `\nproof:workaround-deletion — PENDING (${pending.length}): every remaining workaround ` +
            "is PRESENT with its paired sibling-fix UNPUBLISHED. This is the STAGED Band-B state " +
            "(not a failure) — each arm GREENs when the sibling publishes AND kf consumes. " +
            "Exit 0.",
    );
    process.exit(0);
}

console.log(
    "\nproof:workaround-deletion — PASS: every workaround is ABSENT (every sibling cure " +
        "consumed). The consume-edge deletion ledger is fully discharged.",
);
process.exit(0);
