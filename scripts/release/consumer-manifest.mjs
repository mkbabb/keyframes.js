#!/usr/bin/env node
/**
 * consumer-manifest — the PINNED serialization of a consumer slice (V.W2).
 *
 * Replaces the U-era unreproducible digest recipe (AV-8: the old `a26e6a06`
 * digest verified a SET whose serialization was never pinned). This recipe is
 * fixed, documented here, and committed beside the slice it measures:
 *
 *   1. `git status --porcelain=v2 --untracked-files=all` against the tree,
 *      filtered to the slice scope (every changed path).
 *   2. For each path, one line: `<XY-status> <sha256-of-worktree-bytes> <path>`
 *      (deleted paths hash as the literal string `DELETED`).
 *   3. Lines sorted bytewise (LC_ALL=C semantics), joined with `\n`, one
 *      trailing newline; the manifest digest is SHA-256 of that byte stream.
 *
 * Usage: node scripts/release/consumer-manifest.mjs [--base <rev>]
 *   Prints each line then `manifest-sha256: <digest>`. With --base, paths are
 *   `git diff --name-status <rev>` instead of worktree status (post-commit
 *   verification of a landed slice).
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const baseIx = args.indexOf("--base");
const base = baseIx >= 0 ? args[baseIx + 1] : null;

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

let entries = [];
if (base) {
    const out = execSync(`git diff --name-status ${base}`, { encoding: "utf8" });
    for (const line of out.split("\n").filter(Boolean)) {
        const [status, ...rest] = line.split("\t");
        const path = rest[rest.length - 1];
        const hash =
            status === "D" ? "DELETED" : sha256(readFileSync(path));
        entries.push(`${status} ${hash} ${path}`);
    }
} else {
    const out = execSync("git status --porcelain=v2 --untracked-files=all", {
        encoding: "utf8",
    });
    for (const line of out.split("\n").filter(Boolean)) {
        const fields = line.split(" ");
        if (line.startsWith("1 ") || line.startsWith("2 ")) {
            const status = fields[1];
            const path = line.split(" ").slice(8).join(" ");
            const hash = status.includes("D")
                ? "DELETED"
                : sha256(readFileSync(path));
            entries.push(`${status} ${hash} ${path}`);
        } else if (line.startsWith("? ")) {
            const path = line.slice(2);
            entries.push(`?? ${sha256(readFileSync(path))} ${path}`);
        }
    }
}

entries.sort();
const body = entries.join("\n") + "\n";
process.stdout.write(body);
console.log(`manifest-sha256: ${sha256(body)}`);
