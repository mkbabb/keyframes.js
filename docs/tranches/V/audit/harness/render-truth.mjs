#!/usr/bin/env node
// =============================================================================
// V.W1.b — THE ROUTE × VIEWPORT RENDER-TRUTH HARNESS  (born-RED gate)
// =============================================================================
//
// The deterministic, re-runnable render-truth instrument for keyframes.js
// Tranche V, wave W1. It probes the prepared Glass-7 demo on all 7 routes ×
// {1280×800, 390×844} and asserts the wave's HARD GATE:
//
//     pageerror == 0  AND  zero literal '[object Object]' text nodes  everywhere.
//
// Behaviour per route × viewport:
//   • collect page.on('pageerror') and console errors,
//   • wait for render to settle (scene chunk + animation setup fire),
//   • scan ALL text nodes for the literal '[object Object]',
//   • screenshot to captures/<route>-<w>.png,
//   • record a render-shape probe (appKids / canvas / mains / textLen) so a
//     blank route is legible in the JSON.
//
// It writes captures/summary.json and exits 0 IFF pageerror==0 AND
// objectObject==0 across every combo (console errors are recorded, not gated —
// exactly the W1 hard-gate condition).
//
// The harness lives in the worktree under docs/tranches/V/audit/harness/ but
// runs against THE AUDIT COPY (the live probe target with fresh @mkbabb/glass-ui
// swapped in + playwright-core installed). It resolves playwright-core and starts
// the vite dev server FROM the audit copy; it never installs anything (an
// install-class npm op silently deletes the glass linkage — documented incident).
//
// This same instrument closes W1, feeds W9's MR1, and re-runs at W11. It is RED
// against the unfixed tree (the born-RED witness) and GREEN after V.W1.a's fixes.
//
// Usage:
//   node render-truth.mjs
// Env overrides:
//   KF_AUDIT_COPY   absolute path to the audit copy   (default: the scratchpad copy)
//   KF_DEV_PORT     dedicated dev-server port          (default: 5271)
//   KF_SETTLE_MS    per-route settle wait in ms        (default: 3000)
//   KF_CHROME_CHANNEL  playwright launch channel       (default: chrome)
// =============================================================================

import { spawn } from "node:child_process";
import { connect } from "node:net";
import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url));
const CAPTURES_DIR = path.join(HARNESS_DIR, "captures");
const SUMMARY_PATH = path.join(CAPTURES_DIR, "summary.json");

// THE AUDIT COPY — the live probe target. This is the session scratchpad copy
// with fresh glass-ui swapped in; override with KF_AUDIT_COPY for another build.
const AUDIT_COPY =
    process.env.KF_AUDIT_COPY ||
    "/private/tmp/claude-504/-Users-mkbabb-Programming-keyframes-js/58f34108-b347-4938-adcd-9e676fc3e1fa/scratchpad/kf-audit-copy";

// A DEDICATED port for the audit-copy dev server. The attach path assumes any
// server already answering here IS the audit copy — keep this port reserved for
// the harness (a foreign app on it would be probed by mistake).
const PORT = Number(process.env.KF_DEV_PORT || 5271);
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;
const SETTLE_MS = Number(process.env.KF_SETTLE_MS || 3000);
const CHROME_CHANNEL = process.env.KF_CHROME_CHANNEL || "chrome";

// The 7 demo routes (hash-mode; home = "/"), single-sourced from the demo scene
// registry (demo/app/scene/scenes.ts): home + cube/amiga/square/easing/spring/
// sequence.
const ROUTES = [
    { id: "home", hash: "/" },
    { id: "cube", hash: "/cube" },
    { id: "amiga", hash: "/amiga" },
    { id: "square", hash: "/square" },
    { id: "easing", hash: "/easing" },
    { id: "spring", hash: "/spring" },
    { id: "sequence", hash: "/sequence" },
];

const VIEWPORTS = [
    { w: 1280, h: 800 },
    { w: 390, h: 844 },
];

const OBJECT_LITERAL = "[object Object]";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── playwright-core, resolved from the audit copy (never from the worktree) ──
async function loadChromium() {
    const pwEntry = path.join(
        AUDIT_COPY,
        "node_modules/playwright-core/index.mjs",
    );
    if (!existsSync(pwEntry)) {
        throw new Error(
            `playwright-core not found in the audit copy at ${pwEntry}. ` +
                `Set KF_AUDIT_COPY to a copy that has playwright-core installed.`,
        );
    }
    const mod = await import(pathToFileURL(pwEntry).href);
    return mod.chromium;
}

// ── dev-server lifecycle: attach if a server already answers on PORT, else
//    spawn vite (from the audit copy) and own its teardown ────────────────────
function tcpAlive(port, host) {
    return new Promise((resolve) => {
        const sock = connect({ port, host });
        const done = (ok) => {
            sock.destroy();
            resolve(ok);
        };
        sock.setTimeout(600);
        sock.once("connect", () => done(true));
        sock.once("timeout", () => done(false));
        sock.once("error", () => done(false));
    });
}

async function waitForHttp(url, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const res = await fetch(url, { redirect: "manual" });
            // vite dev serves index.html (200) at the base; any HTTP answer is up.
            if (res.status > 0) return true;
        } catch {
            /* not up yet */
        }
        await sleep(300);
    }
    return false;
}

async function startDevServer() {
    if (await tcpAlive(PORT, HOST)) {
        console.log(`[dev] attaching to already-running server on ${BASE}`);
        const up = await waitForHttp(BASE + "/", 5000);
        if (!up) {
            throw new Error(
                `port ${PORT} is open but ${BASE} did not answer HTTP`,
            );
        }
        return { proc: null, owned: false };
    }

    const viteBin = path.join(AUDIT_COPY, "node_modules/.bin/vite");
    if (!existsSync(viteBin)) {
        throw new Error(`vite binary not found at ${viteBin}`);
    }
    console.log(`[dev] spawning vite on ${BASE} (cwd=${AUDIT_COPY})`);
    const proc = spawn(
        viteBin,
        ["--port", String(PORT), "--strictPort", "--host", HOST],
        {
            cwd: AUDIT_COPY,
            env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
            stdio: ["ignore", "pipe", "pipe"],
        },
    );
    let devLog = "";
    proc.stdout.on("data", (d) => {
        devLog += d;
    });
    proc.stderr.on("data", (d) => {
        devLog += d;
    });
    proc.on("exit", (code, sig) => {
        if (code && code !== 0) {
            console.error(`[dev] vite exited early code=${code} sig=${sig}`);
            console.error(devLog.split("\n").slice(-25).join("\n"));
        }
    });

    const up = await waitForHttp(BASE + "/", 60000);
    if (!up) {
        try {
            proc.kill("SIGKILL");
        } catch {}
        throw new Error(
            `dev server did not come up on ${BASE} within 60s\n` +
                devLog.split("\n").slice(-25).join("\n"),
        );
    }
    console.log(`[dev] up on ${BASE}`);
    return { proc, owned: true };
}

function stopDevServer(server) {
    if (!server?.owned || !server.proc) return;
    try {
        server.proc.kill("SIGTERM");
    } catch {}
    // hard stop shortly after in case SIGTERM is swallowed
    setTimeout(() => {
        try {
            server.proc.kill("SIGKILL");
        } catch {}
    }, 1500);
}

// ── the per-page render-truth probe ─────────────────────────────────────────
async function probePage(page) {
    // Walk every text node; count the ones that contain the literal
    // '[object Object]' and return a few samples for the log. Also return a
    // render-shape probe so a blank route is legible in the JSON.
    return page.evaluate((LITERAL) => {
        const hits = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
        );
        let n;
        let objectObject = 0;
        while ((n = walker.nextNode())) {
            const t = n.nodeValue || "";
            if (t.includes(LITERAL)) {
                objectObject += 1;
                if (hits.length < 12) {
                    const owner = n.parentElement;
                    hits.push({
                        text: t.trim().slice(0, 80),
                        owner: owner
                            ? owner.tagName.toLowerCase() +
                              (owner.className
                                  ? "." + String(owner.className).slice(0, 40)
                                  : "")
                            : "(detached)",
                    });
                }
            }
        }
        const app = document.querySelector("#app");
        return {
            objectObject,
            objectObjectSamples: hits,
            shape: {
                appKids: app ? app.children.length : -1,
                canvas: document.querySelectorAll("canvas").length,
                mains: document.querySelectorAll("main").length,
                textLen: (document.body.innerText || "").trim().length,
            },
        };
    }, OBJECT_LITERAL);
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log("=".repeat(78));
    console.log("V.W1.b render-truth harness");
    console.log(`  audit copy : ${AUDIT_COPY}`);
    console.log(`  base       : ${BASE}`);
    console.log(`  routes     : ${ROUTES.map((r) => r.id).join(", ")}`);
    console.log(
        `  viewports  : ${VIEWPORTS.map((v) => `${v.w}x${v.h}`).join(", ")}`,
    );
    console.log(`  settle     : ${SETTLE_MS}ms`);
    console.log(`  started    : ${new Date().toISOString()}`);
    console.log("=".repeat(78));

    // fresh captures dir each run (deterministic, re-runnable)
    await mkdir(CAPTURES_DIR, { recursive: true });
    for (const f of await readdir(CAPTURES_DIR).catch(() => [])) {
        if (f.endsWith(".png")) {
            await rm(path.join(CAPTURES_DIR, f)).catch(() => {});
        }
    }

    const chromium = await loadChromium();
    const server = await startDevServer();
    const browser = await chromium.launch({
        channel: CHROME_CHANNEL,
        headless: true,
    });

    const results = [];
    try {
        for (const vp of VIEWPORTS) {
            const ctx = await browser.newContext({
                viewport: { width: vp.w, height: vp.h },
                deviceScaleFactor: 1,
            });
            for (const route of ROUTES) {
                const page = await ctx.newPage();
                const pageerrors = [];
                const consoleErrors = [];
                page.on("pageerror", (e) =>
                    pageerrors.push(String(e.message).split("\n")[0].trim()),
                );
                page.on("console", (m) => {
                    if (m.type() === "error")
                        consoleErrors.push(m.text().split("\n")[0].trim());
                });

                const url = `${BASE}/#${route.hash}`;
                await page
                    .goto(url, { waitUntil: "networkidle", timeout: 30000 })
                    .catch(() => {});
                // settle: let the lazy scene chunk resolve + the scene's
                // animation setup run (that is where the masked easing/
                // timingFunction pageerrors fire).
                await sleep(SETTLE_MS);

                const probe = await probePage(page).catch((e) => ({
                    objectObject: -1,
                    objectObjectSamples: [{ text: `PROBE-FAILED: ${e.message}` }],
                    shape: {},
                }));

                const capName = `${route.id}-${vp.w}.png`;
                await page
                    .screenshot({
                        path: path.join(CAPTURES_DIR, capName),
                        fullPage: false,
                    })
                    .catch((e) => console.error(`screenshot ${capName}: ${e.message}`));

                const dedup = (arr) => [...new Set(arr)];
                const row = {
                    route: route.id,
                    viewport: `${vp.w}x${vp.h}`,
                    width: vp.w,
                    pageerror: pageerrors.length,
                    objectObject: probe.objectObject,
                    consoleError: consoleErrors.length,
                    shape: probe.shape,
                    pageerrorSamples: dedup(pageerrors).slice(0, 5),
                    consoleErrorSamples: dedup(consoleErrors).slice(0, 5),
                    objectObjectSamples: probe.objectObjectSamples,
                    capture: `captures/${capName}`,
                };
                results.push(row);

                const flag =
                    row.pageerror === 0 && row.objectObject === 0
                        ? "ok  "
                        : "RED ";
                console.log(
                    `[${flag}] ${route.id.padEnd(9)} ${row.viewport.padEnd(8)} ` +
                        `pageerror=${row.pageerror} objectObject=${row.objectObject} ` +
                        `consoleError=${row.consoleError} ` +
                        `shape{kids:${row.shape.appKids},canvas:${row.shape.canvas},main:${row.shape.mains},text:${row.shape.textLen}}`,
                );
                if (row.pageerror > 0) {
                    for (const s of row.pageerrorSamples)
                        console.log(`        pageerror: ${s}`);
                }
                if (row.objectObject > 0) {
                    for (const s of row.objectObjectSamples)
                        console.log(
                            `        [object Object] in <${s.owner}>: "${s.text}"`,
                        );
                }
                await page.close();
            }
            await ctx.close();
        }
    } finally {
        await browser.close().catch(() => {});
        stopDevServer(server);
    }

    const totals = results.reduce(
        (acc, r) => {
            acc.pageerror += Math.max(0, r.pageerror);
            acc.objectObject += Math.max(0, r.objectObject);
            acc.consoleError += Math.max(0, r.consoleError);
            return acc;
        },
        { pageerror: 0, objectObject: 0, consoleError: 0 },
    );
    const green = totals.pageerror === 0 && totals.objectObject === 0;

    const summary = {
        instrument: "V.W1.b render-truth harness",
        generatedAt: new Date().toISOString(),
        auditCopy: AUDIT_COPY,
        glass: "glass@e7da7b5c (@mkbabb/glass-ui 7.0.0, registry-absent swap)",
        base: BASE,
        settleMs: SETTLE_MS,
        chromeChannel: CHROME_CHANNEL,
        routes: ROUTES.map((r) => r.id),
        viewports: VIEWPORTS.map((v) => `${v.w}x${v.h}`),
        gate: "pageerror==0 AND objectObject==0 on all routes x viewports",
        green,
        totals,
        results,
    };
    await writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2) + "\n");

    console.log("=".repeat(78));
    console.log(
        `TOTALS  pageerror=${totals.pageerror}  objectObject=${totals.objectObject}  consoleError=${totals.consoleError}`,
    );
    console.log(`GATE    ${green ? "GREEN (exit 0)" : "RED (exit 1)"}`);
    console.log(`summary ${SUMMARY_PATH}`);
    console.log(`captures ${CAPTURES_DIR}`);
    console.log("=".repeat(78));

    process.exit(green ? 0 : 1);
}

main().catch((e) => {
    console.error("HARNESS FATAL:", e?.stack || e);
    process.exit(2);
});
