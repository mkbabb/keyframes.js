// proof:pin-ledger-current — Q.WA4 §S4 (the constellation pin-ledger witness;
// the caret-pin silent-consume becomes an OBSERVABLE, gated edge).
//
// RUN: node scripts/proof-pin-ledger-current.mjs
//
// WHY THIS GATE EXISTS (AUDIT-31 B6-crossrepo-versions + B7-shipped-regression Q.W0c).
// kf pins value.js `^1.1.0` — a CARET. A future value.js 1.2.0 is auto-consumed with
// NO re-pin and NO consume-edge observable: a future audit cannot tell whether the
// 1.2.0 features are actually wired. There was no single machine-readable record of the
// SHIPPED pin set (kf 4.4.0 → value.js ^1.1.0 → parse-that ^0.12.0 transitive; glass-ui
// ~4.0.0 installs 4.0.1) a gate could regenerate-and-compare to catch silent drift.
//
// THE REAL OBSERVABLE (inv-observable-truth, NOT a proxy): a pin that drifts off the
// SHIPPED set with no observable edge. The HARD clause reads the LOCAL package.json
// declared pins + the INSTALLED tree (node_modules/<pkg>/package.json + the lockfile)
// and COMPARES to docs/tranches/Q/PIN-LEDGER.json's `shipped` set — RED on drift. It is
// a PURE-FILESYSTEM read (device-independent BY CONSTRUCTION — no network, no Linux-runner
// flake, the device-dependence-greening law). The `npm view @mkbabb/keyframes` registry
// cross-check is a NETWORK leg — opt-in (KF_PIN_REGISTRY=1), REPORTED, never blocking (the
// SAME env-gated, never-touch-exit-code shape Q.WA3 gives the deploy-roundtrip live leg).
//
// BORN-RED on today's tree (pre-cure): docs/tranches/Q/PIN-LEDGER.json is genuinely
// absent (NOT DEV-pre-authored, unlike DAG.md) → the gate cannot run → RED. GREEN on the
// cure: the ledger authored + the LOCAL pins == the `shipped` set.

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const LEDGER_PATH = resolve(REPO, "docs/tranches/Q/PIN-LEDGER.json");
const PKG_PATH = resolve(REPO, "package.json");
const LOCK_PATH = resolve(REPO, "package-lock.json");

let failed = false;
const check = (id, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
    if (!ok) failed = true;
};

console.log(
    "proof:pin-ledger-current — the constellation pin-ledger witness (Q.WA4 §S4)\n",
);

// (c.0) the ledger is present (genuinely born-absent pre-cure — the cleanest born-RED).
if (!existsSync(LEDGER_PATH)) {
    check(
        "(c.0)/ledger-present",
        false,
        "docs/tranches/Q/PIN-LEDGER.json ABSENT — the caret-pin consume has no observable edge",
    );
    console.log(
        "\nproof:pin-ledger-current FAIL — the pin-ledger witness is absent.",
    );
    process.exit(1);
}
check("(c.0)/ledger-present", true, "docs/tranches/Q/PIN-LEDGER.json present");

let ledger;
try {
    ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf8"));
} catch (e) {
    check(
        "(c.0)/ledger-parses",
        false,
        `PIN-LEDGER.json malformed: ${e.message}`,
    );
    console.log("\nproof:pin-ledger-current FAIL — the ledger is malformed.");
    process.exit(1);
}

const pkg = JSON.parse(readFileSync(PKG_PATH, "utf8"));
const lock = existsSync(LOCK_PATH)
    ? JSON.parse(readFileSync(LOCK_PATH, "utf8"))
    : null;

/** Read an installed package's version directly from node_modules (the `exports`
 *  restriction forbids require('<pkg>/package.json'), so we read the file by path). */
function installedVersion(name) {
    const p = resolve(REPO, "node_modules", name, "package.json");
    if (!existsSync(p)) return null;
    try {
        return JSON.parse(readFileSync(p, "utf8")).version ?? null;
    } catch {
        return null;
    }
}

/** The lockfile's resolved version for a top-level node_modules entry. */
function lockVersion(name) {
    if (!lock?.packages) return null;
    return lock.packages[`node_modules/${name}`]?.version ?? null;
}

/** The declared spec from the LOCAL package.json (any dependency bucket). */
function declaredSpec(name) {
    for (const bucket of [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
    ]) {
        const v = pkg[bucket]?.[name];
        if (v != null) return { spec: v, bucket };
    }
    return null;
}

// ── (c.1) self-version: the ledger's `self` matches the LOCAL package.json version ──
const selfOk = ledger.shipped?.self?.version === pkg.version;
check(
    "(c.1)/self-version",
    selfOk,
    selfOk
        ? `ledger.shipped.self.version (${ledger.shipped.self.version}) == package.json version`
        : `DRIFT: ledger.shipped.self.version (${ledger.shipped?.self?.version}) != package.json version (${pkg.version})`,
);

// ── (c.2) HARD (device-independent): every `shipped` pin matches the LOCAL declared
//     spec (for direct edges) AND the installed-tree version (+ lockfile cross-check). ──
const pins = ledger.shipped?.pins ?? [];
check(
    "(c.2)/ledger-nonempty",
    pins.length > 0,
    `the ledger records ${pins.length} shipped pin(s)`,
);

for (const pin of pins) {
    const name = pin.name;
    const installed = installedVersion(name);
    const locked = lockVersion(name);

    // (a) the installed-tree version matches the ledger's `installed` (pure-filesystem).
    const installedOk = installed != null && installed === pin.installed;
    check(
        `(c.2)/${name}/installed`,
        installedOk,
        installedOk
            ? `node_modules/${name} == ${pin.installed} (the witnessed shipped install)`
            : `DRIFT: node_modules/${name} is ${installed ?? "NOT-INSTALLED"}, ledger says ${pin.installed}`,
    );

    // (b) the lockfile resolved version agrees with the installed tree (no torn tree).
    if (locked != null) {
        const lockOk = locked === pin.installed;
        check(
            `(c.2)/${name}/lockfile`,
            lockOk,
            lockOk
                ? `package-lock.json resolves ${name} to ${locked} (agrees with the ledger)`
                : `DRIFT: package-lock.json resolves ${name} to ${locked}, ledger says ${pin.installed}`,
        );
    }

    // (c) for a DIRECT edge, the LOCAL declared spec matches the ledger's `declared`.
    //     A transitive edge (parse-that via value.js) carries NO local spec to drift —
    //     the installed-version assertion above is its sole HARD check.
    if (pin.edge === "direct" || pin.edge === "direct-dev") {
        const decl = declaredSpec(name);
        const declOk = decl != null && decl.spec === pin.declared;
        check(
            `(c.2)/${name}/declared`,
            declOk,
            declOk
                ? `package.json [${decl.bucket}] pins ${name} ${decl.spec} (matches the ledger)`
                : `DRIFT: package.json declares ${name} as ${decl?.spec ?? "ABSENT"} (${decl?.bucket ?? "no bucket"}), ledger says ${pin.declared}`,
        );
    } else if (pin.edge === "transitive") {
        const decl = declaredSpec(name);
        // A transitive pin MUST NOT have drifted into a direct kf dependency (the S9
        // dep-removal invariant: kf declares no direct parse-that spec).
        const stillTransitive =
            decl == null || decl.bucket === "peerDependencies";
        check(
            `(c.2)/${name}/transitive`,
            stillTransitive,
            stillTransitive
                ? `${name} stays transitive (kf declares no direct spec — the S9 dep-removal holds)`
                : `DRIFT: ${name} acquired a DIRECT ${decl.bucket} spec (${decl.spec}) — it was a transitive edge`,
        );
    }
}

// ── (c.3) the TARGET rows are present (the consume-edge frontier — recorded, not
//     asserted; the publish has not fired, so the no-unpublished-consume invariant
//     forbids the HARD compare. Their PRESENCE makes the caret-pin consume observable). ──
const targets = ledger.target?.pins ?? [];
check(
    "(c.3)/target-frontier",
    targets.length > 0,
    targets.length > 0
        ? `${targets.length} TARGET re-pin row(s) recorded (the Q.WG4 consume frontier — value.js ^1.2.0 + parse-that ^0.13.0 + glass-ui BC)`
        : `no TARGET rows — the caret-pin consume frontier is un-witnessed`,
);

// ── (c.4) OBSERVE-ONLY: the `npm view @mkbabb/keyframes` registry cross-check. A NETWORK
//     leg — observe-only BY CONSTRUCTION (the SAME shape Q.WA3 gives the deploy-roundtrip
//     live leg): opt-in via KF_PIN_REGISTRY=1 (never runs in CI by default → no flake on
//     the slow Linux runner / offline), and it NEVER touches the exit code. Network-
//     dependence is a DISTINCT axis from the device-timing taxonomy, so it carries no
//     device-posture row — it is opt-in + non-blocking by construction. ──
if (process.env.KF_PIN_REGISTRY === "1") {
    try {
        const { execSync } = await import("node:child_process");
        const out = execSync(
            "npm view @mkbabb/keyframes dependencies.@mkbabb/value.js --silent",
            { encoding: "utf8", timeout: 8000, stdio: ["ignore", "pipe", "ignore"] },
        ).trim();
        const valuePin = pins.find((p) => p.name === "@mkbabb/value.js");
        if (out === valuePin?.declared) {
            console.log(
                `  · [registry observe-only] npm registry pins value.js ${out} (agrees with the ledger's shipped declared)`,
            );
        } else {
            // REPORTED only — a network-leg drift NEVER poisons the verdict.
            console.log(
                `  · [registry observe-only] npm registry pins value.js ${out || "<unreachable>"}, ledger shipped declared ${valuePin?.declared} — REPORTED, never blocking (network)`,
            );
        }
    } catch (e) {
        console.log(
            `  · [registry observe-only] npm view unreachable (${(e.message || "network").split("\n")[0].slice(0, 60)}) — skipped, never blocking (network)`,
        );
    }
}

console.log(
    `\nproof:pin-ledger-current ${failed ? "FAIL" : "GREEN"} — ${failed ? "a LOCAL pin drifted off the witnessed shipped set" : "the LOCAL pins == the ledger's shipped set (the caret-pin consume is an observable edge)"}.`,
);
process.exit(failed ? 1 : 0);
