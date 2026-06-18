// proof:report-all (M.W1) — the report-all meta-gate over the parallel runner.
// GATE TIER: hygiene (a node meta-gate over scripts/run-all.mjs — no browser).
//
// THE REAL OBSERVABLE (inv-M-observable-truth, NOT a proxy): the owner's 3-hour
// iterate-to-green wound is the serial-`&&` runner topology — a multi-red tree
// reports only the FIRST red and the developer re-iterates O(N²). This gate
// PLANTS a real multi-red tree and observes the REAL output of the REAL runner.
// It does NOT grep package.json for `&&` (a `; true` hack would pass that) nor
// check run-all.mjs exists (a file-presence check says nothing about behaviour).
// C1∧C2 ARE the wound, reproduced in miniature + falsifiable.
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RUNNER = join(REPO, "scripts", "run-all.mjs");

let fails = 0;
const ok = (m) => console.log("  ✓ " + m);
const bad = (m) => {
    console.log("  ✗ " + m);
    fails++;
};

// ── The sandbox: throwaway leaf "gates" exercised through BOTH topologies ─────
const dir = mkdtempSync(join(tmpdir(), "report-all-"));
// A leaf that writes a `.ran` marker then exits with `code`.
const leaf = (name, code) => {
    writeFileSync(
        join(dir, name + ".mjs"),
        `import{writeFileSync}from"node:fs";writeFileSync(new URL("./${name}.ran",import.meta.url),"1");process.exit(${code});`,
    );
    return `node ${name}.mjs`;
};
// A leaf that timestamps its spawn + exit (to detect concurrency overlap).
const sleeper = (name, ms) => {
    writeFileSync(
        join(dir, name + ".mjs"),
        `import{writeFileSync}from"node:fs";const f=new URL("./${name}.t",import.meta.url);const s=Date.now();writeFileSync(f,JSON.stringify({spawn:s}));setTimeout(()=>writeFileSync(f,JSON.stringify({spawn:s,exit:Date.now()})),${ms});`,
    );
    return `node ${name}.mjs`;
};

const g1 = leaf("g1", 0),
    g2 = leaf("g2", 1),
    g3 = leaf("g3", 0),
    g4 = leaf("g4", 1);
const c1 = leaf("c1", 0),
    c2 = leaf("c2", 0);
const s1 = sleeper("s1", 350),
    s2 = sleeper("s2", 350);

writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
        {
            scripts: {
                mixed: [g1, g2, g3, g4].join(" && "),
                clean: [g1, g3, c1, c2].join(" && "),
                oneRed: [g1, g2].join(" && "),
                sleepers: [s1, s2].join(" && "),
            },
        },
        null,
        2,
    ),
);

const runAll = (tier, extra = []) =>
    spawnSync(
        "node",
        [RUNNER, `--tier=${tier}`, `--pkg=${join(dir, "package.json")}`, ...extra],
        { encoding: "utf8" },
    );
const ran = (n) => existsSync(join(dir, n + ".ran"));
const ts = (n) => {
    try {
        return JSON.parse(readFileSync(join(dir, n + ".t"), "utf8"));
    } catch {
        return null; // the sleeper never ran (e.g. the runner is absent) — C5 reds cleanly
    }
};
const overlaps = (a, b) =>
    a != null &&
    b != null &&
    typeof a.spawn === "number" &&
    typeof a.exit === "number" &&
    typeof b.spawn === "number" &&
    typeof b.exit === "number" &&
    a.spawn < b.exit &&
    b.spawn < a.exit;

// ── C1 — report-all: ONE pass surfaces BOTH g2 AND g4 ─────────────────────────
const r1 = runAll("mixed");
if (
    r1.status === 1 &&
    /FAILED:\s*node g2\.mjs/.test(r1.stdout) &&
    /FAILED:\s*node g4\.mjs/.test(r1.stdout)
)
    ok("C1 report-all: BOTH g2 and g4 surfaced in ONE orchestrated pass; exit 1");
else
    bad(
        "C1 report-all — the runner did not surface both reds in one pass (run-all.mjs absent or non-report-all). stdout:\n" +
            (r1.stdout || r1.stderr || "(none)").slice(0, 400),
    );

// ── C2 — abort witness: the serial `&&` chain aborts after the first red ──────
// Clear the `.ran` markers C1's orchestrated pass left, so C2 measures ONLY what
// the serial chain ran (else C1's all-ran markers mask the abort).
for (const n of ["g1", "g2", "g3", "g4"]) rmSync(join(dir, n + ".ran"), { force: true });
spawnSync("sh", ["-c", [g1, g2, g3, g4].join(" && ")], { cwd: dir });
if (ran("g1") && ran("g2") && !ran("g3") && !ran("g4"))
    ok("C2 abort witness: the literal `&&` chain ran g1,g2 then ABORTED (g3,g4 never spawned) — the wound");
else
    bad(
        `C2 abort witness — expected g1,g2 ran & g3,g4 NOT; got g1=${ran("g1")} g2=${ran("g2")} g3=${ran("g3")} g4=${ran("g4")}`,
    );

// ── C3 — clean parity: a clean tier exits 0, all ran ─────────────────────────
const r3 = runAll("clean");
if (r3.status === 0 && /ALL GREEN/.test(r3.stdout))
    ok("C3 clean parity: a clean tier exits 0 (all leaves ran)");
else bad("C3 clean parity — expected exit 0/ALL GREEN; stdout:\n" + (r3.stdout || "").slice(0, 300));

// ── C4 — no-swallow: a single red exits 1 (the `; true` hack is caught) ───────
const r4 = runAll("oneRed");
if (r4.status === 1)
    ok("C4 no-swallow: a single red exits 1 (reds are NOT swallowed — the quick-hack floor)");
else bad("C4 no-swallow — a red did NOT exit 1 (status " + r4.status + ") — reds swallowed");

// ── C5 — concurrency: workers=2 OVERLAPS the sleepers; workers=1 does not ─────
runAll("sleepers", ["--workers=2"]);
const overlap2 = overlaps(ts("s1"), ts("s2"));
runAll("sleepers", ["--workers=1"]);
const overlap1 = overlaps(ts("s1"), ts("s2"));
if (overlap2 && !overlap1)
    ok("C5 concurrency: --workers=2 OVERLAPS the two sleepers; --workers=1 serialises them");
else bad(`C5 concurrency — expected overlap@2 & no-overlap@1; got overlap2=${overlap2} overlap1=${overlap1}`);

// ── C6 — membership: the real meta-gates still green (tier rosters survive) ───
const gir = spawnSync("npm", ["run", "proof:gate-is-runtime"], { cwd: REPO, encoding: "utf8" });
const cic = spawnSync("npm", ["run", "proof:ci-coverage"], { cwd: REPO, encoding: "utf8" });
if (gir.status === 0 && cic.status === 0)
    ok("C6 membership: proof:gate-is-runtime + proof:ci-coverage still GREEN (the parseable tier rosters survive the topology change)");
else
    bad(
        `C6 membership — a meta-gate red after the refactor: gate-is-runtime=${gir.status} ci-coverage=${cic.status}`,
    );

console.log(
    fails === 0
        ? "\nproof:report-all — PASS: the orchestrated proof:all reports EVERY red in ONE pass (C1∧C2 = the owner's 3-hour wound cured), no red swallowed (C4), concurrency actuated (C5), the tier-membership meta-gate contract intact (C6)."
        : `\nproof:report-all — FAIL: ${fails} clause(s) red (the report-all observable is not yet met).`,
);
process.exit(fails === 0 ? 0 : 1);
