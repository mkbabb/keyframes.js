// Dependency-currency check — G.W2 S3 (the standing lock the re-pin
// ships WITH). The falsifiable form of "the `@mkbabb/*` pins are current and
// protocol-clean" plus the positive no-direct-parse-that invariant. It is
// chained into `proof:publish`/CI so the consume edge rides every release run.
//
// RUN: npm run proof:publish
//
// CLAUSES (each BITES — a real check, not narration):
//
//   (1) FLOOR — every `@mkbabb/*` dependency (across `dependencies` +
//       `optionalDependencies`) is INSTALLED at ≥ the published floor:
//       `value.js≥3.1.0`, `glass-ui≥4.0.0`. The floor
//       tracks the CORRECTNESS MINIMUM the I bugfixes require, not the re-pin
//       history (J.W3 S6b / BP-5 / BP-6). Read from the installed
//       `node_modules/<pkg>/package.json` `version` — the artifact npm actually
//       resolved, not the manifest range. BITES: revert a pin to a pre-floor
//       version + re-lock → the installed version drops below the floor →
//       reds.
//
//   (2) PROTOCOL — every `@mkbabb/*` declaration (in `package.json`) AND every
//       resolved `@mkbabb/*` node (in the lockfile) uses a REGISTRY range — NO
//       `file:` / `link:` / `git:` / `git+` protocol anywhere. The glass-ui
//       `file:../glass-ui` LINK was a dirty dev artifact that cannot publish
//       (`a-glass-ui GG-1`); this clause is the lock that it can never re-creep
//       into a publishable manifest. BITES: re-introduce `"@mkbabb/glass-ui":
//       "file:../glass-ui"` (or a `link:`/`git:` spec) in the manifest, OR a
//       `link: true` resolved node in the lockfile → reds.
//
//   (3) SINGLE REALM — the manifest declares NO direct
//       `@mkbabb/parse-that` dependency. kf reaches the parser transitively
//       through value.js, so a second kf-owned realm cannot be introduced.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

// The published floors this gate enforces — the CORRECTNESS MINIMUMS, advanced
// at J.W3 S6b (BP-5/BP-6): the floor tracks the contract the I bugfixes
// require, not the re-pin history. A future sibling release advances these
// explicitly — the floor is the standing minimum.
const FLOORS = {
    // U.F7: the consume edge now relies on the published 3.1.0 subpath
    // taxonomy. parse-that is intentionally absent from kf's manifest: the
    // direct realm apparatus was dissolved and value.js owns its parser realm.
    "@mkbabb/value.js": "3.1.0",
    // The sci P one-core alignment pins the active published cut exactly at
    // 4.2.0. This is still only the correctness floor: OD-U4's forthcoming
    // 5.0.0 release remains separately held until its tag and registry packet
    // are witnessed.
    // a resolver downgrading into 3.5.x–3.8.x (valid in the old range)
    // re-introduces the at-rest bloom; 3.9.0 carries `specular="off"`
    // (the historical at-rest specular browser check owned the runtime contract).
    // J.W7b: ADVANCED to 3.11.2 — the currency re-pin (~3.9.0 → ~3.11.2). The
    // 3.11.x line re-implements the two-variant slider (cures the user's
    // "sliders render wrong" report — new data-v scope, explicit
    // --slider-{track-height,thumb-size,thumb-bg} tokens + data-held/-disabled/
    // -variant=spectrum states) and root-fixes the dropdown/popover/select OPTION
    // font-size so the content item inherits the trigger's register.
    // K.W1: ADVANCED to 3.13.0 — the AZ-tranche currency re-pin (~3.11.2 →
    // ~3.13.0; DL-K6 / U-K14 "upgrade to LATEST glass-ui"). The 3.12→3.13 hop
    // ships `useDockClickIntegrity` (the RF-17 collapse-crossfade click-strand
    // cure — the kf pointerdown twin is net-deleted), the fluid-typography clamp
    // rungs, the dock padding-block pin, and the SegmentedTabs liquid indicator.
    // The 3.13.0 breaking seams (variant-rail/instrument-strip removed,
    // PAPER_WASH_GROUND gone, ExpandableContainer gutted) are each verified
    // DISJOINT from kf's consume surface. NB: glass-ui 4.0.0 (the BA tranche
    // major) is now PUBLISHED — kf consumes ONE TRANCHE BEHIND per the
    // acyclic-spine (3.13.0 = AZ, the predecessor of BA/4.0.0); the 4.0.0 consume
    // (W-TABS/surface-axis/MetricBadge `value` breaks) is the NEXT kf tranche's
    // edge, recorded not consumed mid-K. A resolver dropping below 3.13.0
    // re-introduces the slider/option-font regressions AND the RF-17 twin need.
    "@mkbabb/glass-ui": "4.0.0",
};

const FORBIDDEN_PROTOCOLS = ["file:", "link:", "git:", "git+"];

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse "MAJOR.MINOR.PATCH" → [major, minor, patch] integers. */
function semverParts(v) {
    const m = /^[~^]?(\d+)\.(\d+)\.(\d+)/.exec(String(v).trim());
    if (!m) return null;
    return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** a >= b on [major, minor, patch] tuples. */
function gte(a, b) {
    for (let i = 0; i < 3; i++) {
        if (a[i] > b[i]) return true;
        if (a[i] < b[i]) return false;
    }
    return true;
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// The full set of `@mkbabb/*` declarations across the dependency buckets that
// ship in the manifest (dependencies + optionalDependencies). devDependencies
// are not part of the published surface, so they are out of scope.
const declared = {};
for (const bucket of ["dependencies", "optionalDependencies"]) {
    for (const [name, range] of Object.entries(pkg[bucket] ?? {})) {
        if (name.startsWith("@mkbabb/")) declared[name] = range;
    }
}

const fail = [];
const pass = [];
// ── Clause 1 — FLOOR (installed ≥ published floor) ───────────────────────────
{
    const offenders = [];
    for (const [name, floor] of Object.entries(FLOORS)) {
        const installedPkg = join(root, "node_modules", name, "package.json");
        if (!existsSync(installedPkg)) {
            // glass-ui is optional; an absent optional sibling on a clean
            // runner is not a floor violation (the library gate is glass-ui
            // -free). A REQUIRED dep absent IS a violation.
            const optional = Boolean(pkg.optionalDependencies?.[name]);
            if (optional) continue;
            offenders.push(`${name} — NOT INSTALLED (required dependency)`);
            continue;
        }
        const installed = JSON.parse(readFileSync(installedPkg, "utf8")).version;
        const ip = semverParts(installed);
        const fp = semverParts(floor);
        if (!ip || !gte(ip, fp)) {
            offenders.push(`${name} — installed ${installed} < floor ${floor}`);
        }
    }
    if (offenders.length > 0) {
        fail.push(
            `(1) FLOOR: ${offenders.length} @mkbabb/* dep(s) below the published ` +
                `floor — the re-pin re-drifted:\n      ` +
                offenders.join("\n      "),
        );
    } else {
        pass.push(
            `(1) FLOOR: every @mkbabb/* dep installed ≥ its published floor ` +
                `(${Object.entries(FLOORS)
                    .map(([n, f]) => `${n.replace("@mkbabb/", "")}≥${f}`)
                    .join(", ")}).`,
        );
    }
}

// ── Clause 2 — PROTOCOL (no file:/link:/git: in manifest OR lockfile) ─────────
{
    const offenders = [];

    // 2a — the manifest declarations.
    for (const [name, range] of Object.entries(declared)) {
        const bad = FORBIDDEN_PROTOCOLS.find((p) => String(range).startsWith(p));
        if (bad) {
            offenders.push(
                `package.json: "${name}": "${range}" — ${bad} protocol (must be ` +
                    `a registry range)`,
            );
        }
    }

    // 2b — the resolved lockfile nodes. A `link: true` node (a `file:`/`link:`
    // sibling) is the exact dirty artifact GG-1 names — caught even when the
    // manifest range is clean but the tree still resolves a local link.
    const lockPath = join(root, "package-lock.json");
    if (existsSync(lockPath)) {
        const lock = JSON.parse(readFileSync(lockPath, "utf8"));
        for (const [path, node] of Object.entries(lock.packages ?? {})) {
            // Key on the node NAME, not just the path — a stale `file:` sibling
            // is keyed by its on-disk path (e.g. `../glass-ui`), which carries no
            // `@mkbabb/` segment yet IS an `@mkbabb/*` package; the path-only
            // filter let it escape the protocol sweep.
            const isMkbabb =
                path.includes("@mkbabb/") ||
                String(node.name ?? "").startsWith("@mkbabb/");
            if (!isMkbabb) continue;
            const resolved = String(node.resolved ?? "");
            if (node.link === true) {
                offenders.push(
                    `package-lock.json: ${path} — resolved as a LINK ` +
                        `(${resolved || "local sibling"}); the registry pin must ` +
                        `REPLACE the file: link, not resolve beside it`,
                );
            } else if (
                FORBIDDEN_PROTOCOLS.some((p) => resolved.startsWith(p))
            ) {
                offenders.push(
                    `package-lock.json: ${path} — resolved "${resolved}" uses a ` +
                        `forbidden protocol`,
                );
            }
        }
    } else {
        offenders.push("package-lock.json: ABSENT — the lock cannot be checked");
    }

    if (offenders.length > 0) {
        fail.push(
            `(2) PROTOCOL: ${offenders.length} @mkbabb/* declaration(s)/node(s) ` +
                `use a forbidden file:/link:/git: protocol:\n      ` +
                offenders.join("\n      "),
        );
    } else {
        pass.push(
            `(2) PROTOCOL: every @mkbabb/* declaration + resolved node uses a ` +
                `registry range (no file:/link:/git: anywhere).`,
        );
    }
}

// ── Clause 3 — SINGLE REALM (no direct parse-that declaration) ───────────────
{
    const directDeclarations = [];
    for (const bucket of [
        "dependencies",
        "optionalDependencies",
        "devDependencies",
        "peerDependencies",
    ]) {
        const range = pkg[bucket]?.["@mkbabb/parse-that"];
        if (range !== undefined) directDeclarations.push(`${bucket}: ${range}`);
    }

    if (directDeclarations.length > 0) {
        fail.push(
            `(3) SINGLE REALM: package.json declares a direct ` +
                `@mkbabb/parse-that dependency (${directDeclarations.join(", ")}); ` +
                `consume it transitively through @mkbabb/value.js instead.`,
        );
    } else {
        pass.push(
            "(3) SINGLE REALM: package.json declares NO direct @mkbabb/parse-that " +
                "dependency; the parser realm is transitive through value.js by construction.",
        );
    }
}

// ── verdict ────────────────────────────────────────────────────────────────────
if (fail.length > 0) {
    console.error(
        "\nproof:deps-current — FAIL: the @mkbabb/* pins are NOT current / " +
            "protocol-clean / direct-parse-that-free.\n",
    );
    for (const f of fail) console.error("  ✗ " + f);
    for (const p of pass) console.error("  ✓ " + p);
    console.error(
        "\n  The dep-currency invariant is the standing lock against the F→G " +
            "pin-lag (a-constellation-gaps G-CONST-1). Resolve every clause.",
    );
    process.exit(1);
}

console.log(
    "proof:deps-current — PASS: every @mkbabb/* pin is installed ≥ its published " +
        "floor and declared with a registry range (no file:/link:/git:). The " +
        "re-pin stays pinned.",
);
for (const p of pass) console.log("  ✓ " + p);
