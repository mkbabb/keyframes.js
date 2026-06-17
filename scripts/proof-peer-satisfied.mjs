#!/usr/bin/env node
/**
 * proof:peer-satisfied — L.W4 S8 (the live F-2 peer-cycle tripwire; Lane 36
 * CROSS-REPO-ASK ⚠8). The SOLE-AUTHORSHIP gate per DLL-24: L.W4 authors it,
 * L.W8/L.W9 only CONSUME it (L.W9 drives it GREEN by re-pinning kf to the
 * glass-ui BB version that widens the peer range to admit value.js 0.13.0).
 *
 * THE BREACH (F-2, docs/tranches/K/CONSTELLATION-DAG.md §5). glass-ui's
 * PUBLISHED peerDependencies declare `"@mkbabb/value.js": "^0.10.0 || ^0.11.0"`
 * (glass-ui 4.0.0). kf depends on `@mkbabb/value.js ^0.13.0`. Any consumer that
 * installs `@mkbabb/keyframes.js` ALONGSIDE `@mkbabb/glass-ui` resolves value.js
 * 0.13.0 — which does NOT satisfy glass-ui's declared peer range → `ELSPROBLEMS`
 * on every such install. `proof:deps-current` clause 3 checks kf's OWN parse-that
 * realm convergence; it does NOT read glass-ui's peer range against the installed
 * value.js. The peer-cycle is invisible to every other gate in the repo.
 *
 * THIS GATE IS BORN-RED-BY-DESIGN. It is the kf-side tripwire that the F-2
 * cross-repo-ask is a LIVE defect, not a future concern. It STAYS RED until
 * glass-ui BB ships the widened peer (a `>=0.13.0` / `^0.13.0` bump) AND kf
 * re-pins to that glass-ui version (Band-B, L.W9). DO NOT force it green — a
 * green here before the BB fix would hide the very defect the gate exists to
 * surface. It rides the report-all CI demo-smoke job (continue-on-error) so the
 * expected RED does not abort the blocking proof:hygiene chain.
 *
 * THE CHECK (a device-INDEPENDENT FACT — a version-number mismatch, not a timing
 * measurement; this is a `hard` gate in the taxonomy):
 *
 *   1. Read node_modules/@mkbabb/glass-ui/package.json. If ABSENT (the library
 *      `gates` job installs no glass-ui — it is an optionalDependency), record
 *      the skip with a note and exit 0 (no peer check is possible without the
 *      package present). This is the ONLY clean exit-0 path.
 *   2. For each glass-ui peerDependency that names an @mkbabb/* sibling (the
 *      constellation peers — the F-2 class), resolve the INSTALLED version from
 *      node_modules/<peer>/package.json and assert it SATISFIES the declared
 *      range. Non-@mkbabb peers (vue, reka-ui, …) are out of scope: they are not
 *      the constellation peer-cycle this gate guards.
 *   3. FAIL with a named message per violation:
 *      "glass-ui@X.Y.Z declares peer <peer>@"RANGE" but installed is V
 *       (ELSPROBLEMS)".
 *
 * Re-runnable: `node scripts/proof-peer-satisfied.mjs`. STATIC (no browser) — a
 * pure manifest read. The demo arm installs glass-ui (the gate bites); the
 * library gates arm skips clean (glass-ui absent).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));

/** semver.satisfies — resolve the installed `semver` (a transitive dep present
 *  in node_modules). If unresolvable, fall back to a conservative compound-range
 *  evaluator over `||`-joined `^MAJOR.MINOR.PATCH` clauses (the only range shape
 *  glass-ui peers use). The real semver is preferred — it is the authority. */
function loadSatisfies() {
    try {
        const semver = require("semver");
        return (version, range) => semver.satisfies(version, range, { includePrerelease: false });
    } catch {
        return fallbackSatisfies;
    }
}

/** Conservative fallback: evaluate a `||`-joined set of caret clauses. A caret
 *  on a 0.x.y version pins the MINOR (npm caret semantics: ^0.10.0 ≡ >=0.10.0
 *  <0.11.0). Only used if `semver` is unresolvable — the real semver above is
 *  the authority for the live tree. */
function fallbackSatisfies(version, range) {
    const v = parse(version);
    if (!v) return false;
    return String(range)
        .split("||")
        .some((clause) => caretMatch(v, clause.trim()));
}
function parse(s) {
    const m = /^[~^>=<\s]*?(\d+)\.(\d+)\.(\d+)/.exec(String(s).trim());
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function caretMatch(v, clause) {
    const c = parse(clause);
    if (!c) return false;
    const caret = clause.trim().startsWith("^");
    if (!caret) return v[0] === c[0] && v[1] === c[1] && v[2] === c[2];
    if (c[0] > 0) return v[0] === c[0] && cmp(v, c) >= 0; // ^1.2.3 ≡ >=1.2.3 <2.0.0
    if (c[1] > 0) return v[0] === 0 && v[1] === c[1] && cmp(v, c) >= 0; // ^0.10.0 ≡ >=0.10.0 <0.11.0
    return v[0] === 0 && v[1] === 0 && v[2] === c[2]; // ^0.0.3 ≡ =0.0.3
}
function cmp(a, b) {
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
}

const satisfies = loadSatisfies();

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:peer-satisfied — L.W4 S8 (the F-2 peer-cycle tripwire: glass-ui's peer range vs the installed @mkbabb/* siblings)",
);

// ── 1. glass-ui present? (absent ⇒ library gates job ⇒ clean skip) ───────────
const glassPkgPath = join(
    root,
    "node_modules",
    "@mkbabb",
    "glass-ui",
    "package.json",
);
if (!existsSync(glassPkgPath)) {
    console.log(
        "  ○ @mkbabb/glass-ui is NOT installed (the library gates job is glass-ui-free) — " +
            "no peer check possible without the package present. SKIP (exit 0).",
    );
    console.log(
        "\nproof:peer-satisfied — SKIP: glass-ui absent (library gates arm). " +
            "The peer-cycle check runs on the demo arm, where glass-ui is installed.",
    );
    process.exit(0);
}

const glass = JSON.parse(readFileSync(glassPkgPath, "utf8"));
const glassVersion = glass.version;
const peers = glass.peerDependencies ?? {};

// ── 2. each @mkbabb/* peer — installed version satisfies the declared range ──
const mkbabbPeers = Object.entries(peers).filter(([name]) =>
    name.startsWith("@mkbabb/"),
);

if (mkbabbPeers.length === 0) {
    fail(
        `glass-ui@${glassVersion} declares NO @mkbabb/* peerDependencies — the gate ` +
            "lost its subject (the F-2 peer-cycle is over @mkbabb/* siblings). Re-ground it.",
    );
}

for (const [peer, range] of mkbabbPeers) {
    // glass-ui declares a peer on @mkbabb/keyframes.js itself — that peer is
    // satisfied by THIS repo's own version (it is the consumer). Check it the
    // same way: read the installed (node_modules) copy if present, else this
    // repo's package.json version.
    let installed = null;
    const peerPkgPath = join(root, "node_modules", peer, "package.json");
    if (existsSync(peerPkgPath)) {
        installed = JSON.parse(readFileSync(peerPkgPath, "utf8")).version;
    } else if (peer === "@mkbabb/keyframes.js") {
        installed = JSON.parse(
            readFileSync(join(root, "package.json"), "utf8"),
        ).version;
    }

    if (!installed) {
        // The peer is declared but not installed anywhere — not an ELSPROBLEMS
        // (a missing optional/dev peer), but we cannot verify it; surface as a
        // distinct note, not a satisfaction pass.
        console.log(
            `  ○ glass-ui@${glassVersion} declares peer ${peer}@"${range}" but ` +
                `${peer} is not installed — cannot verify (not counted as a violation).`,
        );
        continue;
    }

    if (satisfies(installed, range)) {
        ok(
            `glass-ui@${glassVersion} peer ${peer}@"${range}" — installed ${installed} SATISFIES.`,
        );
    } else {
        fail(
            `glass-ui@${glassVersion} declares peer ${peer}@"${range}" but installed is ` +
                `${installed} (ELSPROBLEMS) — the peer range REJECTS the installed sibling; ` +
                "any consumer installing both gets a peer-conflict error.",
        );
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:peer-satisfied — FAIL (${failures.length}): a glass-ui peer range REJECTS ` +
            "the installed @mkbabb/* sibling (the live F-2 peer-cycle). This gate is " +
            "BORN-RED-BY-DESIGN — it STAYS RED until glass-ui BB widens the peer range to " +
            "admit value.js 0.13.0 and kf re-pins to that glass-ui (Band-B, L.W9). The RED " +
            "is the kf-side tripwire that the F-2 cross-repo-ask is a live defect.",
    );
    process.exit(1);
}
console.log(
    "\nproof:peer-satisfied — PASS: every glass-ui @mkbabb/* peer range admits the installed " +
        "sibling version (no ELSPROBLEMS). The F-2 peer-cycle is closed.",
);
