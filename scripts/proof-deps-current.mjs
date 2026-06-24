// proof:deps-current — G.W2 S3 (the standing dep-currency lock the re-pin
// ships WITH). The falsifiable form of "the `@mkbabb/*` pins are current,
// protocol-clean, and realm-convergent" — the gate that the F→G pin-lag
// (`a-constellation-gaps G-CONST-1`: kf 4.0.0 shipped on STALE `value.js
// ^0.10.0` / `parse-that ^0.8.2` while `0.11.0`/`0.9.0` were PUBLISHED) can
// never recur silently. It is chained into `proof:all` (S3) so the invariant
// rides every CI run.
//
// RUN: node scripts/proof-deps-current.mjs
//
// CLAUSES (each BITES — a real check, not narration):
//
//   (1) FLOOR — every `@mkbabb/*` dependency (across `dependencies` +
//       `optionalDependencies`) is INSTALLED at ≥ the published floor:
//       `value.js≥0.11.2`, `parse-that≥0.9.0`, `glass-ui≥3.11.2`. The floor
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
//   (3) REALM-CONVERGENCE (fail-EXPLICIT advisory, value.js-handoff) — kf's
//       declared `parse-that` MINOR vs value.js's OWN declared `parse-that`
//       minor. kf consumes value.js through the single `lerpValue → iv._lerp`
//       seam; if kf pins `parse-that ^0.9.x` while the installed value.js still
//       declares `^0.8.x`, the npm tree carries TWO parse-that realms (kf's
//       top-level + value.js's nested) — the dual-realm split `utils.ts:248`
//       casts across with `parseAny as any`. G.md §Design-decision 1 makes the
//       convergence CONDITIONAL: value.js re-pins its OWN parse-that to match
//       "IF the cross-realm round-trip bites; NOT a kf-side shim." The wave's
//       §Hard-gate clause 1 gates ONLY on the FLOOR + PROTOCOL (clauses 1, 2) —
//       realm-convergence is NOT a §Hard-gate clause. So this clause is
//       fail-EXPLICIT but NON-GATING: it SURFACES a minor split LOUDLY (never
//       silent) as a recorded value.js-HANDOFF (G-HANDOFF-1), and ESCALATES to
//       a hard red ONLY if the cross-realm round-trip is shown to bite (the
//       `KF_REALM_STRICT=1` escalation, for the wave that proves the bite). A
//       convergent realm passes cleanly; a divergent-but-non-biting realm
//       (today: value.js@0.11.0 still declares `^0.8.2`) prints the handoff and
//       stays green per the authoritative spec.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The published floors this gate enforces — the CORRECTNESS MINIMUMS, advanced
// at J.W3 S6b (BP-5/BP-6): the floor tracks the contract the I bugfixes
// require, not the re-pin history. A future sibling release advances these
// explicitly — the floor is the standing minimum.
const FLOORS = {
    // BP-5: 0.11.2 is the floor that protects the B1/B5 empty-input regression —
    // a dev pinning 0.11.1 (valid in the old range) re-introduces the
    // `Parse error at offset 0: "......"` crash.
    // K.W1: ADVANCED to 0.12.0 — the value.js Tranche N currency re-pin
    // (^0.11.2 → ^0.12.0; the N2 witness-flip slate). 0.12.0 ships the
    // ParseDiagnostic/OnParseError producer (the K.W7 fidelity-floor diagnostics
    // channel consumes it), plus the RIPE edges (lerpArray, deltaEOK,
    // reverseAnimationShorthand) the Band-II compile/color-fidelity waves spend.
    // (value.js 0.13.0 — the K-dispatched scroll/ramp grammar fold — is the Band
    // II K.W9/K.W10 consume edge, not yet published.)
    "@mkbabb/value.js": "0.13.0",
    "@mkbabb/parse-that": "0.9.0",
    // BP-6: 3.9.0 was the floor that protects the B7 specular regression —
    // a resolver downgrading into 3.5.x–3.8.x (valid in the old range)
    // re-introduces the at-rest bloom; 3.9.0 carries `specular="off"`
    // (proof:specular-absent-at-rest is the runtime contract).
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
const handoff = []; // fail-EXPLICIT, non-gating surfacing (the value.js-handoff)

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

// ── Clause 3 — REALM-CONVERGENCE (kf parse-that minor === value.js's) ─────────
{
    const kfRange = declared["@mkbabb/parse-that"];
    const valuejsPkgPath = join(
        root,
        "node_modules",
        "@mkbabb",
        "value.js",
        "package.json",
    );

    if (!kfRange) {
        // S9 (shipped 4.4.0) REMOVED kf's direct @mkbabb/parse-that dependency —
        // kf consumes value.js's `parseCSSSubValue`, so the direct parse-that import
        // AND the cross-realm `parseAny as any` cast (utils.ts) are GONE. With kf
        // declaring no parse-that, there is exactly ONE parse-that realm (value.js's
        // transitive one) — a realm SPLIT is structurally impossible, so convergence
        // holds BY CONSTRUCTION. This is the acyclic-spine goal achieved, not a lost subject.
        pass.push(
            "(3) REALM: kf declares NO @mkbabb/parse-that dependency (the S9 acyclic " +
                "spine — value.js's parseCSSSubValue consumed, the direct import + the " +
                "cross-realm cast removed). ONE realm, convergent by construction.",
        );
    } else if (!existsSync(valuejsPkgPath)) {
        fail.push(
            "(3) REALM: @mkbabb/value.js is not installed — cannot read its own " +
                "parse-that declaration.",
        );
    } else {
        const valuejs = JSON.parse(readFileSync(valuejsPkgPath, "utf8"));
        const vjRange = valuejs.dependencies?.["@mkbabb/parse-that"];
        const kfParts = semverParts(kfRange);
        const vjParts = vjRange ? semverParts(vjRange) : null;
        if (!vjParts) {
            fail.push(
                `(3) REALM: installed @mkbabb/value.js@${valuejs.version} declares ` +
                    `no parse-that dependency (got ${JSON.stringify(vjRange)}) — ` +
                    `cannot verify realm convergence.`,
            );
        } else if (kfParts[1] !== vjParts[1] || kfParts[0] !== vjParts[0]) {
            const msg =
                `(3) REALM: parse-that realm SPLIT — kf declares "${kfRange}" ` +
                `(${kfParts[0]}.${kfParts[1]}.x) but installed ` +
                `value.js@${valuejs.version} declares "${vjRange}" ` +
                `(${vjParts[0]}.${vjParts[1]}.x). The npm tree carries TWO ` +
                `parse-that realms; the cross-realm cast is utils.ts:248 ` +
                `(parseAny as any). value.js must re-pin its OWN parse-that to ` +
                `match (G-HANDOFF-1 / G.md §Design-decision 1: NOT a kf-side ` +
                `shim).`;
            // The wave's §Hard-gate gates on FLOOR + PROTOCOL only; convergence
            // is conditional on the round-trip biting. Surface it explicitly;
            // escalate to a hard red only under KF_REALM_STRICT (the wave that
            // proves the bite).
            if (process.env.KF_REALM_STRICT === "1") fail.push(msg);
            else handoff.push(msg + " [non-gating: KF_REALM_STRICT unset]");
        } else {
            pass.push(
                `(3) REALM: parse-that realm CONVERGED — kf "${kfRange}" and ` +
                    `value.js@${valuejs.version} "${vjRange}" share minor ` +
                    `${kfParts[0]}.${kfParts[1]}.`,
            );
        }
    }
}

// ── verdict ────────────────────────────────────────────────────────────────────
if (fail.length > 0) {
    console.error(
        "\nproof:deps-current — FAIL: the @mkbabb/* pins are NOT current / " +
            "protocol-clean / realm-convergent.\n",
    );
    for (const f of fail) console.error("  ✗ " + f);
    for (const p of pass) console.error("  ✓ " + p);
    for (const h of handoff) console.error("  ⚠ " + h);
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
// Fail-EXPLICIT, non-gating: a divergent-but-non-biting realm is surfaced as a
// value.js-HANDOFF, never silently swallowed (the §Mandate's no-silent-degrade).
for (const h of handoff) console.log("  ⚠ " + h);
if (handoff.length > 0) {
    console.log(
        "\n  ⚠ value.js-HANDOFF (G-HANDOFF-1): the parse-that realm is not " +
            "converged. The cross-realm round-trip is currently NON-biting " +
            "(production parse→interp verified), so this is a recorded handoff, " +
            "not a gate red. Set KF_REALM_STRICT=1 to escalate it to a hard gate " +
            "once a wave proves the bite.",
    );
}
