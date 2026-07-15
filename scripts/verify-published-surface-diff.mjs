#!/usr/bin/env node
/**
 * One-shot OD-U8 close witness for the published API surface.
 *
 * This is deliberately not a new standing gate.  `proof:published-surface
 * --diff --base=v5.2.0` invokes it at the 5.3.0 cut and compares the built
 * tree with the last published package.  A minor release may add symbols and
 * entry points, but it may not silently remove or rename either.  Dynamic
 * chunk filenames are implementation details and are therefore not treated
 * as published entry points; the stable dist files are checked explicitly.
 *
 * The base is fetched from the registry, rather than reconstructed from a git
 * checkout: U.Z3 is a consumer-facing compatibility claim and the registry
 * tarball is the authoritative 5.2.0 artifact.  `--base=/path/to/pkg.tgz` is
 * available for an offline release rehearsal.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const option = (name, fallback = undefined) => {
    const exact = `--${name}`;
    const prefixed = argv.find((arg) => arg.startsWith(`${exact}=`));
    if (prefixed) return prefixed.slice(exact.length + 1);
    const at = argv.indexOf(exact);
    return at >= 0 ? argv[at + 1] : fallback;
};

const baseArg = option("base", option("base-version", "v5.2.0"));
const jsonOutput = argv.includes("--json");
const baseVersion = String(baseArg).replace(/^v/, "");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kf-surface-diff-"));

function fail(message) {
    if (jsonOutput) {
        console.log(JSON.stringify({ status: "FAIL", message }));
    } else {
        console.error(`proof:published-surface --diff — FAIL: ${message}`);
    }
    process.exit(1);
}

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        fail(`cannot read ${file}: ${error.message}`);
    }
}

function packageFilesFromDryRun() {
    const raw = execFileSync(
        "npm",
        ["pack", "--dry-run", "--json", "--ignore-scripts"],
        { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const parsed = JSON.parse(raw);
    return new Set(parsed[0].files.map(({ path: file }) => file.replaceAll("\\", "/")));
}

function publicSymbols(root) {
    const files = ["dist/keyframes.d.ts", "dist/engine/index.d.ts"]
        .map((relative) => path.join(root, relative))
        .filter((file) => fs.existsSync(file));
    const symbols = new Set();
    for (const file of files) {
        const text = fs.readFileSync(file, "utf8");
        for (const match of text.matchAll(
            /export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|interface|type|const|function|let|var|enum|namespace)\s+([A-Za-z_$][\w$]*)/g,
        )) {
            symbols.add(match[1]);
        }
        for (const match of text.matchAll(/export\s*\{([^}]+)\}/g)) {
            for (const item of match[1].split(",")) {
                const name = item.trim().split(/\s+as\s+/).at(-1);
                if (name && /^[A-Za-z_$][\w$]*$/.test(name)) symbols.add(name);
            }
        }
    }
    return symbols;
}

function exportKeys(pkg) {
    const exports = pkg.exports;
    if (!exports || typeof exports !== "object") return new Set();
    return new Set(Object.keys(exports));
}

function stableFiles(files) {
    return new Set(
        [...files].filter((file) =>
            /^(?:package\.json|README(?:\.[^/]*)?|LICEN[CS]E(?:\.[^/]*)?|dist\/(?:keyframes\.(?:js|d\.ts)|engine\/index\.(?:js|d\.ts)))$/i.test(file),
        ),
    );
}

function sortedDifference(left, right) {
    return [...left].filter((value) => !right.has(value)).sort();
}

let baseRoot;
const basePath = baseArg && (baseArg.endsWith(".tgz") || baseArg.includes(path.sep))
    ? path.resolve(REPO, baseArg)
    : null;
if (basePath) {
    if (!fs.existsSync(basePath)) fail(`base tarball does not exist: ${basePath}`);
} else {
    const packed = execFileSync(
        "npm",
        ["pack", `@mkbabb/keyframes.js@${baseVersion}`, "--json", "--ignore-scripts", "--pack-destination", tmp],
        { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const tarball = JSON.parse(packed)[0]?.filename;
    if (!tarball) fail(`npm pack returned no tarball for @mkbabb/keyframes.js@${baseVersion}`);
    baseRoot = path.join(tmp, "base");
    fs.mkdirSync(baseRoot);
    execFileSync("tar", ["-xzf", path.join(tmp, tarball), "-C", baseRoot]);
}

// npm tarballs unpack under package/; an offline path may already point at an
// unpacked package, so normalize both forms.
if (!baseRoot) {
    baseRoot = path.join(tmp, "base");
    fs.mkdirSync(baseRoot);
    execFileSync("tar", ["-xzf", basePath, "-C", baseRoot]);
}
baseRoot = path.join(baseRoot, "package");
if (!fs.existsSync(path.join(baseRoot, "package.json"))) {
    fail(`base artifact did not contain package/package.json (${baseArg})`);
}

const currentPkg = readJson(path.join(REPO, "package.json"));
const basePkg = readJson(path.join(baseRoot, "package.json"));
const currentSymbols = publicSymbols(REPO);
const baseSymbols = publicSymbols(baseRoot);
const removedSymbols = sortedDifference(baseSymbols, currentSymbols);
const currentEntries = exportKeys(currentPkg);
const baseEntries = exportKeys(basePkg);
const removedEntries = sortedDifference(baseEntries, currentEntries);
const currentFiles = packageFilesFromDryRun();
const baseFiles = new Set(
    [...stableFiles(new Set(fs.readdirSync(baseRoot, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => path.relative(baseRoot, path.join(entry.parentPath, entry.name)).replaceAll("\\", "/"))))],
);
const missingStableFiles = sortedDifference(baseFiles, stableFiles(currentFiles));
const additions = sortedDifference(currentSymbols, baseSymbols);
const addedEntries = sortedDifference(currentEntries, baseEntries);

const report = {
    status: removedSymbols.length || removedEntries.length || missingStableFiles.length ? "FAIL" : "PASS",
    base: basePkg.version,
    current: currentPkg.version,
    removedSymbols,
    addedSymbols: additions,
    removedEntryPoints: removedEntries,
    addedEntryPoints: addedEntries,
    missingStableFiles,
};
if (jsonOutput) console.log(JSON.stringify(report, null, 2));
else {
    console.log(`proof:published-surface --diff — ${report.status}: ${report.base} → ${report.current}`);
    console.log(`  symbols: ${baseSymbols.size} baseline, ${currentSymbols.size} current, +${additions.length}, -${removedSymbols.length}`);
    console.log(`  entry points: ${baseEntries.size} baseline, ${currentEntries.size} current, +${addedEntries.length}, -${removedEntries.length}`);
    console.log(`  stable package files missing: ${missingStableFiles.length}`);
    if (additions.length) console.log(`  additive symbols: ${additions.join(", ")}`);
    if (addedEntries.length) console.log(`  additive entry points: ${addedEntries.join(", ")}`);
    if (removedSymbols.length) console.error(`  removed/renamed symbols: ${removedSymbols.join(", ")}`);
    if (removedEntries.length) console.error(`  dropped entry points: ${removedEntries.join(", ")}`);
    if (missingStableFiles.length) console.error(`  missing stable files: ${missingStableFiles.join(", ")}`);
}
if (report.status !== "PASS") process.exit(1);
