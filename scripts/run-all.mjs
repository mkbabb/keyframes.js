// scripts/run-all.mjs (M.W1) — the parallel REPORT-ALL gate orchestrator.
//
// The cure for the O(N²) iterate-to-green wound: `proof:all` was a serial `&&`
// chain (142 leaf gates, aborts on the FIRST red → re-pay the prefix per red →
// ~3 hours). This runs every leaf gate concurrently (a concurrency-limited
// worker pool), COLLECTS ALL exit codes, prints a summary naming EVERY failed
// gate, and exits 1 iff ANY gate red'd (the accumulator — equivalent to CI's
// `continue-on-error` + terminal `check-failures`, now local).
//
// It reads the tier membership from `package.json`. S.A4 made the roster a
// THREE-tier taxonomy — `proof:library-correctness` (node/jsdom value-proofs) +
// `proof:demo-correctness` (browser actuators, the renamed proof:correctness) keep
// their parseable direct `&&`-chain VALUE (so `proof:gate-is-runtime` +
// `proof:ci-coverage` still derive their rosters by regex, no delegation
// indirection); `proof:hygiene` delegates to `proof:hygiene-chain`. The SCHEDULE
// moves here, the MEMBERSHIP stays in package.json: one source of truth. A leaf is
// one `&&`-separated command (`npm run proof:X` or `vitest run …`), run verbatim.
//
// Usage:
//   node scripts/run-all.mjs --all                 # library-correctness ∪ demo-correctness ∪ hygiene
//   node scripts/run-all.mjs --tier=proof:hygiene  # one tier (repeatable)
//   node scripts/run-all.mjs --all --workers=8     # concurrency (default: cpus-2, capped 8)
//   node scripts/run-all.mjs --all --workers=1     # serial (debug parity)
//   node scripts/run-all.mjs --tier=X --pkg=PATH   # read a different package.json (the gate sandbox)
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cpus } from "node:os";

const argv = process.argv.slice(2);
const flag = (name, def) => {
    const a = argv.find((x) => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : def;
};

const workers = Math.max(
    1,
    Number(flag("workers", Math.max(1, Math.min(8, cpus().length - 2)))) || 1,
);
const pkgPath = resolve(flag("pkg", "package.json"));
const cwd = dirname(pkgPath);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const tiers = argv.includes("--all")
    ? ["proof:library-correctness", "proof:demo-correctness", "proof:hygiene"]
    : argv.filter((a) => a.startsWith("--tier=")).map((a) => a.slice("--tier=".length));

if (tiers.length === 0) {
    console.error("run-all: nothing to run — pass --all or --tier=<script-key>");
    process.exit(2);
}

// The leaf commands = each tier script's `&&` chain, split into single commands.
const leaves = [];
for (const t of tiers) {
    const str = pkg.scripts?.[t];
    if (typeof str !== "string") {
        console.error(`run-all: no script "${t}" in ${pkgPath}`);
        process.exit(2);
    }
    for (const piece of str.split("&&").map((s) => s.trim()).filter(Boolean)) {
        leaves.push(piece);
    }
}

const t0 = Date.now();
const results = [];
let cursor = 0;

function runOne(leaf) {
    return new Promise((res) => {
        // `sh -c` runs `npm run proof:X` and `vitest run …` uniformly + verbatim.
        const child = spawn("sh", ["-c", leaf], {
            cwd,
            stdio: ["ignore", "inherit", "inherit"],
            env: process.env,
        });
        child.on("exit", (code) => res(code ?? 1));
        child.on("error", () => res(1));
    });
}

async function worker() {
    while (cursor < leaves.length) {
        const leaf = leaves[cursor++];
        const code = await runOne(leaf);
        results.push({ leaf, code });
        console.log(`run-all: ${code === 0 ? "✓" : "✗"} ${leaf}`);
    }
}

await Promise.all(
    Array.from({ length: Math.min(workers, leaves.length || 1) }, () => worker()),
);

const failed = results.filter((r) => r.code !== 0);
const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log(
    `\n=== RUN-ALL SUMMARY === ${results.length} ran · ${failed.length} failed · workers=${workers} · ${secs}s`,
);
if (failed.length > 0) {
    for (const f of failed) console.log(`RUN-ALL FAILED: ${f.leaf}`);
    process.exit(1);
}
console.log("RUN-ALL ALL GREEN");
process.exit(0);
