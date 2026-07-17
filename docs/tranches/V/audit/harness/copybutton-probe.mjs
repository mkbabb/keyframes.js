#!/usr/bin/env node
// =============================================================================
// V.W1.a — COPYBUTTON FEEDBACK PROBE  (sub-gate: the copy-feedback animation
// actually plays — group non-null, play() runs)
// =============================================================================
//
// EE-01 killed the copy-feedback AnimationGroup at construction (the Value-3
// name "bounceInEase" threw before `group.value` was assigned, so every
// CopyButton's `void group.value?.play()` no-op'd). After the rename to
// "easeInBounce" the group builds. This probe drives a real (trusted) click on
// a live CopyButton and samples the animated clipboard icons across the
// 200 ms feedback window: distinct transform/opacity frames prove `play()`
// executed on a NON-NULL group (a null group would leave the icons static).
//
// It reuses the render-truth harness's dev-server + playwright-core plumbing
// against THE AUDIT COPY; it installs nothing.
//
// Usage: node copybutton-probe.mjs
// =============================================================================

import { spawn } from "node:child_process";
import { connect } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url));
const CAP_DIR = path.join(HARNESS_DIR, "captures-green");

const AUDIT_COPY =
    process.env.KF_AUDIT_COPY ||
    "/private/tmp/claude-504/-Users-mkbabb-Programming-keyframes-js/58f34108-b347-4938-adcd-9e676fc3e1fa/scratchpad/kf-audit-copy";
const PORT = Number(process.env.KF_DEV_PORT || 5271);
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;
const SETTLE_MS = Number(process.env.KF_SETTLE_MS || 3000);
const CHROME_CHANNEL = process.env.KF_CHROME_CHANNEL || "chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Routes that mount a visible CopyButton (aria-label "Copy to clipboard"):
// easing = the code literal; spring = the compiled-CSS + per-card copies.
const CANDIDATE_ROUTES = ["/easing", "/spring"];

async function loadChromium() {
    const pwEntry = path.join(AUDIT_COPY, "node_modules/playwright-core/index.mjs");
    if (!existsSync(pwEntry)) throw new Error(`playwright-core missing at ${pwEntry}`);
    return (await import(pathToFileURL(pwEntry).href)).chromium;
}
function tcpAlive(port, host) {
    return new Promise((resolve) => {
        const sock = connect({ port, host });
        const done = (ok) => { sock.destroy(); resolve(ok); };
        sock.setTimeout(600);
        sock.once("connect", () => done(true));
        sock.once("timeout", () => done(false));
        sock.once("error", () => done(false));
    });
}
async function waitForHttp(url, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try { const r = await fetch(url, { redirect: "manual" }); if (r.status > 0) return true; }
        catch { /* not up */ }
        await sleep(300);
    }
    return false;
}
async function startDevServer() {
    if (await tcpAlive(PORT, HOST)) {
        console.log(`[dev] attaching to already-running server on ${BASE}`);
        if (!(await waitForHttp(BASE + "/", 5000))) throw new Error(`${BASE} open but no HTTP`);
        return { proc: null, owned: false };
    }
    const viteBin = path.join(AUDIT_COPY, "node_modules/.bin/vite");
    if (!existsSync(viteBin)) throw new Error(`vite binary missing at ${viteBin}`);
    console.log(`[dev] spawning vite on ${BASE}`);
    const proc = spawn(viteBin, ["--port", String(PORT), "--strictPort", "--host", HOST], {
        cwd: AUDIT_COPY, env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
        stdio: ["ignore", "pipe", "pipe"],
    });
    let devLog = "";
    proc.stdout.on("data", (d) => { devLog += d; });
    proc.stderr.on("data", (d) => { devLog += d; });
    if (!(await waitForHttp(BASE + "/", 60000))) {
        try { proc.kill("SIGKILL"); } catch {}
        throw new Error(`dev server did not come up\n${devLog.split("\n").slice(-20).join("\n")}`);
    }
    console.log(`[dev] up on ${BASE}`);
    return { proc, owned: true };
}
function stopDevServer(s) {
    if (!s?.owned || !s.proc) return;
    try { s.proc.kill("SIGTERM"); } catch {}
    setTimeout(() => { try { s.proc.kill("SIGKILL"); } catch {} }, 1500);
}

// The in-page driver: click the located CopyButton (Vue's `@click` fires on a
// programmatic `element.click()`; clipboard permission is granted so the
// unawaited `copyText` resolves and never blocks the synchronous
// `group.value?.play()`), then record BOTH clipboard icons' computed transform
// + opacity every animation frame for `windowMs`. Click + sampling live in ONE
// evaluate so frame ordering is deterministic. Returned to node for analysis.
const DRIVE = (windowMs) =>
    new Promise((resolve) => {
        const btn = window.__cbBtn;
        const icons = [...btn.querySelectorAll("svg.clipboard")];
        const read = () =>
            icons.map((el) => {
                const cs = getComputedStyle(el);
                return { transform: cs.transform, opacity: cs.opacity };
            });
        const samples = [];
        const t0 = performance.now();
        btn.click(); // → handleClick → group.value?.play()
        const tick = () => {
            const t = performance.now() - t0;
            samples.push({ t: Math.round(t), icons: read() });
            if (t < windowMs) requestAnimationFrame(tick);
            else {
                const status = btn.querySelector('[role="status"]');
                resolve({
                    samples,
                    ariaLabelAfter: btn.getAttribute("aria-label"),
                    liveStatus: status ? status.textContent.trim() : null,
                });
            }
        };
        requestAnimationFrame(tick);
    });

async function main() {
    console.log("=".repeat(78));
    console.log("V.W1.a CopyButton feedback probe");
    console.log(`  audit copy : ${AUDIT_COPY}`);
    console.log(`  base       : ${BASE}`);
    console.log(`  started    : ${new Date().toISOString()}`);
    console.log("=".repeat(78));

    await mkdir(CAP_DIR, { recursive: true });
    const chromium = await loadChromium();
    const server = await startDevServer();
    const browser = await chromium.launch({ channel: CHROME_CHANNEL, headless: true });

    let ok = false;
    let report = null;
    try {
        const ctx = await browser.newContext({
            viewport: { width: 1280, height: 800 },
            deviceScaleFactor: 1,
        });
        await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });

        const pageerrors = [];
        for (const hash of CANDIDATE_ROUTES) {
            const page = await ctx.newPage();
            page.on("pageerror", (e) => pageerrors.push(String(e.message).split("\n")[0]));
            await page.goto(`${BASE}/#${hash}`, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
            await sleep(SETTLE_MS);

            // Locate a live CopyButton by its structural signature: a <button>
            // holding the two `svg.clipboard` icons (Clipboard + ClipboardCheck).
            const found = await page.evaluate(() => {
                const btn = [...document.querySelectorAll("button")].find(
                    (b) => b.querySelectorAll("svg.clipboard").length >= 2,
                );
                if (!btn) return null;
                window.__cbBtn = btn;
                btn.scrollIntoView({ block: "center" });
                const icons = [...btn.querySelectorAll("svg.clipboard")];
                return {
                    ariaLabel: btn.getAttribute("aria-label"),
                    iconCount: icons.length,
                    baseline: icons.map((el) => {
                        const cs = getComputedStyle(el);
                        return { transform: cs.transform, opacity: cs.opacity };
                    }),
                };
            });
            if (!found) { await page.close(); continue; }

            console.log(`\n[route] ${hash} — copy button found (aria="${found.ariaLabel}", icons=${found.iconCount})`);
            console.log(`[baseline] ${JSON.stringify(found.baseline)}`);

            // Click the exact button + sample the feedback window (one evaluate).
            const drive = await page.evaluate(DRIVE, 700);
            const samples = drive.samples;
            const post = { ariaLabelAfter: drive.ariaLabelAfter, liveStatus: drive.liveStatus };

            // distinct animation frames per icon (transform|opacity signature)
            const sig = (s) => s.icons.map((i) => `${i.transform}|${i.opacity}`).join("~");
            const distinct = [...new Set(samples.map(sig))];
            // pick up to 6 representative distinct frames for the log
            const seen = new Set();
            const shown = [];
            for (const s of samples) {
                const k = sig(s);
                if (!seen.has(k)) { seen.add(k); shown.push(s); }
                if (shown.length >= 6) break;
            }

            console.log(`[click]  aria-label after = "${post.ariaLabelAfter}"  liveStatus = "${post.liveStatus}"`);
            console.log(`[frames] total samples=${samples.length}  distinct animation frames=${distinct.length}`);
            for (const s of shown) {
                console.log(
                    `   t=${String(s.t).padStart(4)}ms  ` +
                        s.icons
                            .map((i, k) => `icon${k}{transform:${i.transform}, opacity:${i.opacity}}`)
                            .join("  "),
                );
            }

            await page.screenshot({ path: path.join(CAP_DIR, `copybutton-${hash.replace("/", "")}-after.png`) }).catch(() => {});

            const handleClickRan =
                (post.ariaLabelAfter || "").toLowerCase().includes("copied") ||
                (post.liveStatus || "").toLowerCase().includes("copied");
            const animated = distinct.length >= 3;
            report = {
                route: hash,
                ariaLabel: found.ariaLabel,
                handleClickRan,
                distinctFrames: distinct.length,
                totalSamples: samples.length,
                animated,
                pageerrors,
            };
            ok = handleClickRan && animated;
            await page.close();
            break; // first route with a button wins
        }
        await ctx.close();
    } finally {
        await browser.close().catch(() => {});
        stopDevServer(server);
    }

    console.log("\n" + "=".repeat(78));
    if (!report) {
        console.log("VERDICT  FAIL — no CopyButton located on any candidate route");
        console.log("=".repeat(78));
        process.exit(1);
    }
    console.log(`VERDICT  ${ok ? "PASS" : "FAIL"}`);
    console.log(
        `  handleClick ran (group.play reached) : ${report.handleClickRan}\n` +
            `  distinct feedback animation frames   : ${report.distinctFrames} (>=3 required)\n` +
            `  pageerrors during click              : ${report.pageerrors.length}` +
            (report.pageerrors.length ? " :: " + JSON.stringify([...new Set(report.pageerrors)]) : ""),
    );
    console.log(
        "  Interpretation: distinct animated transform/opacity frames after a\n" +
            "  trusted click prove group is NON-NULL and play() executed — EE-01\n" +
            "  would leave group null and the icons static (0 animated frames).",
    );
    console.log("=".repeat(78));
    process.exit(ok ? 0 : 1);
}

main().catch((e) => {
    console.error("PROBE FATAL:", e?.stack || e);
    process.exit(2);
});
