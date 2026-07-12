#!/usr/bin/env node
/**
 * proof:one-adapter — T.B8 / T-PA-6 (collapse the adapter dual-family).
 *
 * THE DEFECT (lane 30 F1). The shell binding chose the machine's `ScenePlayback`
 * adapter through a THREE-way per-scene fallback —
 *   `facility?.playback ?? sceneRef.value?.scenePlayback ?? createGroupAdapter(() => group)`
 * — a dual-family branch: PREFER the facility, else a scene's own raw-rAF
 * adapter, else wrap the live group. With the T.B1-β/T.B7 keystone complete
 * (EVERY non-home scene exposes a `SceneFacility` whose `playback` is built FROM
 * its channels), the two fallbacks are DEAD code that keep the "which adapter
 * family?" question alive at the shell.
 *
 * THE INVARIANT (T.B8). ONE adapter path: the shell registers `facility.playback`
 * — the ONE adapter the facility already built (createGroupAdapter for a group
 * scene via `facilityFromGroup`, createRafAdapter for a raw-rAF scene). The shell
 * binding NEVER builds an adapter itself and carries NO `?? scenePlayback ??
 * createGroupAdapter` fallback. `createGroupAdapter` has exactly ONE invocation
 * site (facilityFromGroup) — the single builder that turns a group into a
 * facility.
 *
 * THIS GATE (born-RED on the pre-T.B8 shell — the fallback chain; GREEN on the
 * collapse):
 *
 *   CLAUSE A — `useSceneMachineShellBinding.ts` invokes `createGroupAdapter(`
 *     ZERO times (the shell builds no adapter — it registers the facility's).
 *   CLAUSE B — the shell's `machine.register(...)` adapter argument is
 *     `facility.playback` (the ONE adapter), NOT a `??`-fallback expression.
 *   CLAUSE C — `createGroupAdapter` is INVOKED from exactly ONE demo site
 *     (sceneFacility.ts / facilityFromGroup) — the single builder.
 *
 * Static grep gate (no browser, no build). Comment-blanked so design prose that
 * NAMES the retired fallback never reds it. Re-runnable:
 *   node scripts/proof-one-adapter.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const SHELL = path.join(DEMO, "app/scene/useSceneMachineShellBinding.ts");

const SKIP_DIR = new Set(["node_modules", "dist", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const relPosix = (abs) => path.relative(REPO, abs).split(path.sep).join("/");

console.log("proof:one-adapter — T.B8 (one adapter path: the shell registers facility.playback)");

const blankComments = (s) => {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        if (s.startsWith("<!--", i)) {
            const end = s.indexOf("-->", i + 4);
            const stop = end === -1 ? n : end + 3;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
};

function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

if (!fs.existsSync(SHELL)) {
    console.error(`proof:one-adapter — ERROR: shell binding not found at ${relPosix(SHELL)}`);
    process.exit(3);
}

const shellSrc = blankComments(fs.readFileSync(SHELL, "utf8"));

// ── CLAUSE A — the shell invokes createGroupAdapter ZERO times ────────────────
{
    const calls = [...shellSrc.matchAll(/\bcreateGroupAdapter\s*\(/g)];
    if (calls.length === 0) {
        ok("clause A — useSceneMachineShellBinding.ts builds NO adapter (0 createGroupAdapter calls)");
    } else {
        for (const m of calls) {
            const line = shellSrc.slice(0, m.index).split("\n").length;
            fail(
                `clause A — useSceneMachineShellBinding.ts:${line} still invokes createGroupAdapter( — ` +
                    `the shell must register the facility's ONE adapter, not build a fallback (T.B8).`,
            );
        }
    }
}

// ── CLAUSE B — the register adapter argument is facility.playback (no ??) ──────
{
    const reg = shellSrc.match(/machine\.register\s*\(([^)]*)\)/);
    if (!reg) {
        fail("clause B — no `machine.register(...)` call found in the shell binding (expected exactly one)");
    } else {
        const args = reg[1];
        const usesFacilityPlayback = /facility\.playback/.test(args);
        const hasFallback = /\?\?/.test(args);
        if (usesFacilityPlayback && !hasFallback) {
            ok("clause B — the shell registers `facility.playback` (the ONE adapter; no ?? fallback chain)");
        } else {
            fail(
                `clause B — the shell's register adapter argument is \`${args.trim()}\` — expected exactly ` +
                    `\`facility.playback\` with NO \`??\` fallback (the dual-family branch must be 0).`,
            );
        }
    }
}

// ── CLAUSE C — createGroupAdapter invoked from exactly ONE demo site ──────────
{
    const sources = collectSources(DEMO).sort();
    const sites = [];
    for (const abs of sources) {
        const rel = relPosix(abs);
        // Skip the definition file (scenePlaybackAdapters.ts declares/exports it).
        if (rel === "demo/state/scenePlaybackAdapters.ts") continue;
        const src = blankComments(fs.readFileSync(abs, "utf8"));
        for (const m of src.matchAll(/\bcreateGroupAdapter\s*\(/g)) {
            const line = src.slice(0, m.index).split("\n").length;
            sites.push(`${rel}:${line}`);
        }
    }
    if (sites.length === 1 && sites[0].startsWith("demo/composables/scene-facility/index.ts")) {
        ok(`clause C — createGroupAdapter is invoked from exactly ONE site (${sites[0]} — facilityFromGroup, the single builder)`);
    } else {
        fail(
            `clause C — createGroupAdapter is invoked from ${sites.length} site(s) [${sites.join(", ")}] — ` +
                `expected exactly ONE (demo/composables/scene-facility/index.ts / facilityFromGroup). More than one ` +
                `builder site reopens the adapter dual-family (T.B8).`,
        );
    }
}

if (failures.length > 0) {
    console.error(`\nproof:one-adapter — FAIL (${failures.length}): the adapter dual-family survives.`);
    process.exit(1);
}
console.log(
    "\nproof:one-adapter — PASS: one adapter path — the shell registers facility.playback; " +
        "createGroupAdapter has a single builder site (T.B8).",
);
