#!/usr/bin/env node
/**
 * proof:publish — surface-family barrel for the terminal publish bundle.
 *
 * Keep the three surviving structural oracles in one explicit, auditable
 * sequence: light/heavy boundary, packed published surface, and dependency
 * currency. Each child remains independently runnable for diagnostics.
 */
import { spawnSync } from "node:child_process";

const checks = ["proof:boundary", "proof:published-surface", "proof:deps-current"];
for (const check of checks) {
    const result = spawnSync("npm", ["run", check], { stdio: "inherit", shell: true });
    if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("proof:publish — PASS: boundary, published surface, and dependency currency are green.");
