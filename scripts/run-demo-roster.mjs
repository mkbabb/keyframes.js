#!/usr/bin/env node
/** Run the retained browser observations against one browser and one dist snapshot. */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveChromium, serveDist } from "./lib/demo-driver.mjs";
import { DEMO_ROSTER } from "./demo-roster.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GHPAGES = path.join(REPO, "dist", "gh-pages");
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
    const argument = argv.find((value) => value.startsWith(`--${name}=`));
    return argument ? argument.slice(name.length + 3) : fallback;
};
const workers = Math.max(1, Number(flag("workers", 1)) || 1);
const timeoutMs = Math.max(30, Number(flag("timeout", 300)) || 300) * 1000;
const only = flag("only", "").split(",").map((value) => value.trim()).filter(Boolean);
const roster = only.length
    ? DEMO_ROSTER.filter(({ name }) => only.includes(name))
    : DEMO_ROSTER;

console.log(
    `run-demo-roster — ${roster.length} observation(s) · one shared chromium + one served dist snapshot`,
);

if (!fs.existsSync(path.join(GHPAGES, "index.html"))) {
    console.log("  · dist/gh-pages absent — building (npm run gh-pages)…");
    execSync("npm run gh-pages", { cwd: REPO, stdio: "inherit" });
}

const snapshot = fs.mkdtempSync(path.join(os.tmpdir(), "kf-demo-roster-"));
fs.cpSync(GHPAGES, snapshot, { recursive: true });

function healGhPages() {
    if (fs.existsSync(path.join(GHPAGES, "index.html"))) return;
    fs.mkdirSync(GHPAGES, { recursive: true });
    fs.cpSync(snapshot, GHPAGES, { recursive: true });
}

const chromium = resolveChromium();
if (!chromium) {
    fs.rmSync(snapshot, { recursive: true, force: true });
    console.error(
        "run-demo-roster: playwright not resolvable; set KF_PLAYWRIGHT_DIR or install @playwright/test.",
    );
    process.exit(1);
}

const browserServer = await chromium.launchServer();
const distServer = await serveDist(snapshot);
const childEnv = {
    ...process.env,
    KF_REQUIRE_BROWSER: "1",
    KF_SHARED_BROWSER_WS: browserServer.wsEndpoint(),
    KF_SHARED_DIST_URL: distServer.url,
    KF_SHARED_DIST_DIR: snapshot,
};

function runObservation(entry) {
    return new Promise((resolve) => {
        const startedAt = Date.now();
        let timedOut = false;
        console.log(`\n──── ${entry.name} ────`);
        const child = spawn(process.execPath, [path.join(REPO, entry.script)], {
            cwd: REPO,
            env: childEnv,
            stdio: "inherit",
        });
        const timer = setTimeout(() => {
            timedOut = true;
            console.error(`  ✗ ${entry.name} exceeded ${timeoutMs / 1000}s; terminating.`);
            child.kill("SIGTERM");
            setTimeout(() => child.kill("SIGKILL"), 5000).unref();
        }, timeoutMs);
        const finish = (code) => {
            clearTimeout(timer);
            healGhPages();
            resolve({
                ...entry,
                code: timedOut ? 1 : code ?? 1,
                ms: Date.now() - startedAt,
                timedOut,
            });
        };
        child.once("close", finish);
        child.once("error", () => finish(1));
    });
}

const results = [];
async function drain() {
    const queue = [...roster];
    async function worker() {
        for (;;) {
            const entry = queue.shift();
            if (!entry) return;
            results.push(await runObservation(entry));
        }
    }
    await Promise.all(Array.from({ length: Math.min(workers, roster.length) }, worker));
}

try {
    await drain();
} finally {
    await distServer.close().catch(() => {});
    await browserServer.close().catch(() => {});
    fs.rmSync(snapshot, { recursive: true, force: true });
}

const failed = results.filter(({ code }) => code !== 0);
console.log("\n════ run-demo-roster — REPORT ════");
console.log(`  passed: ${results.length - failed.length}/${results.length}`);
if (failed.length === 0) {
    console.log("run-demo-roster — PASS");
    process.exit(0);
}
console.error(`  ✗ failed: ${failed.map(({ name }) => name).join(", ")}`);
process.exit(1);
