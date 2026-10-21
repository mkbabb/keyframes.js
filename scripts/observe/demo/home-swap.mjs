#!/usr/bin/env node
/**
 * home-swap — OD19-ALL "route transitions smooth and subtle", read on the one
 * move into Home (critic-3 C3-KF-02 / C3-KF-03). A deep link boots a scene
 * (#/sequence), the page idles, then the dock Scene select picks Home, N times,
 * each in a fresh context (a fresh module cache: the first move into Home).
 *
 * Per pick:
 *   - no request for Home's backdrop (the HeroAurora chunk, or the glass aurora
 *     module it imports) starts AFTER the pick: the backdrop is warmed with the
 *     scenes, so the swap never pays its chunk (C3-KF-02);
 *   - on a GPU compositor, no rAF frame inside the swap exceeds MAX_FRAME_MS
 *     (under SwiftShader the bar is reported, not bound: see below);
 *   - every PRESENTED frame of the swap (the compositor's screencast, from the
 *     pick on) has a luma stddev >= MIN_STDDEV: no frame of the bare background
 *     with no dock, grid or content (C3-KF-03 blank flash).
 * Each frame also records which layers the document holds at that rAF (the
 * active View Transition, the scene host's child, the aurora root, the dock),
 * so a blank frame names its empty layer.
 *
 * Over the production demo build (`npm run gh-pages`, or KF_DIST=<dir>),
 * headless shell, 1440x900 light. KF_OUT=<dir> keeps the strip PNGs + JSON;
 * KF_GPU=1 runs the shell on ANGLE-Metal; KF_URL=<origin> reads a running server.
 * Exit 1 on any breach, 2 when the build or the browser is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { serveDist, withBrowser } from "../../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const { PNG } = createRequire(import.meta.url)("pngjs");
const DIST = path.resolve(process.env.KF_DIST ?? path.join(REPO, "dist/gh-pages"));
const OUT = process.env.KF_OUT ? path.resolve(process.env.KF_OUT) : null;
const N = Number(process.env.KF_N ?? 5);
const FROM = process.env.KF_FROM ?? "sequence";
const STRIP = 8;
const MIN_STDDEV = 1;
const MAX_FRAME_MS = 120;
const BACKDROP = /HeroAurora|glass-ui_aurora|\/aurora[-.]/;

// KF_URL=<origin> — read a running server instead (the critic's dev server).
const URL_OVERRIDE = process.env.KF_URL ?? null;
if (!URL_OVERRIDE && !fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(`home-swap — ${DIST}/index.html missing (run \`npm run gh-pages\`).`);
    process.exit(2);
}
if (OUT) fs.mkdirSync(OUT, { recursive: true });

function lumaStd(buf) {
    const png = PNG.sync.read(buf);
    let s = 0;
    let s2 = 0;
    const n = png.width * png.height;
    for (let i = 0; i < png.data.length; i += 4) {
        const y = 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
        s += y;
        s2 += y * y;
    }
    const mean = s / n;
    return { mean: Math.round(mean), std: Math.round(Math.sqrt(Math.max(0, s2 / n - mean * mean)) * 10) / 10 };
}

const rows = [];
const server = URL_OVERRIDE ? { url: URL_OVERRIDE, close: async () => {} } : await serveDist(DIST);
try {
    const ran = await withBrowser(
        async (browser) => {
            // One pick into Home from a fresh context (a fresh module cache).
            // `shoot` captures the strip; a timed pick takes no screenshot,
            // since a capture inside the swap stretches the frames it times.
            const pickHome = async (run, shoot) => {
                const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light", deviceScaleFactor: 1 });
                try {
                    const page = await ctx.newPage();
                    page.setDefaultTimeout(15000);
                    const requests = [];
                    page.on("request", (r) => requests.push({ url: r.url(), t: Date.now() }));
                    await page.goto(`${server.url}/#/${FROM}`, { waitUntil: "load" });
                    await page.waitForSelector('[data-dock-tether="top"] .glass-dock');
                    await page.waitForTimeout(3500);
                    const dock = await page.locator('[data-dock-tether="top"] .glass-dock').first().boundingBox();
                    await page.mouse.move(dock.x + dock.width / 2, dock.y + 28);
                    await page.waitForTimeout(700);
                    await page.locator('[data-dock-tether="top"] .glass-dock [aria-label="Scene"]').first().click();
                    await page.waitForTimeout(600);
                    await page.evaluate(() => {
                        const loaf = (window.__loaf = []);
                        try {
                            new PerformanceObserver((l) => {
                                for (const e of l.getEntries())
                                    if (e.duration > 80)
                                        loaf.push({
                                            d: Math.round(e.duration),
                                            blocking: Math.round(e.blockingDuration),
                                            render: Math.round(e.startTime + e.duration - e.renderStart),
                                            scripts: e.scripts.slice(0, 3).map((x) => `${(x.sourceURL || "").split("/").pop()}:${Math.round(x.duration)}:${(x.invoker || "").slice(0, 50)}`),
                                        });
                            }).observe({ type: "long-animation-frame" });
                        } catch {}
                        const f = (window.__frames = []);
                        const t0 = performance.now();
                        const tick = (t) => {
                            const host = document.querySelector(".scene-host");
                            f.push({
                                t,
                                vt: document.documentElement.matches(":active-view-transition"),
                                host: host?.childElementCount ?? -1,
                                aurora: !!document.querySelector(".aurora-root"),
                                dock: !!document.querySelector('[data-dock-tether="top"] .glass-dock'),
                            });
                            if (t - t0 < 1500) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    });
                    // The strip is the compositor's PRESENTED frames (CDP
                    // screencast). A forced capture (page.screenshot) taken
                    // inside a View Transition's update window reads the bare
                    // background even for a null transition with no DOM change
                    // (repair 3 control `vt-hold-control.mjs`), so it is no
                    // witness of what the viewer sees.
                    let cdp = null;
                    const strip = [];
                    let i = 0;
                    if (shoot) {
                        cdp = await ctx.newCDPSession(page);
                        cdp.on("Page.screencastFrame", async (f) => {
                            const buf = Buffer.from(f.data, "base64");
                            strip.push(lumaStd(buf));
                            if (OUT && i < STRIP) fs.writeFileSync(path.join(OUT, `home-swap-${FROM}-${run}-${i}.png`), buf);
                            i++;
                            try {
                                await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId });
                            } catch {}
                        });
                        await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
                        await page.waitForTimeout(300);
                        strip.length = 0;
                        i = 0;
                    }
                    const tPick = Date.now();
                    await page.getByRole("option", { name: "Home" }).first().click();
                    await page.waitForTimeout(1700);
                    if (cdp) await cdp.send("Page.stopScreencast");
                    const frames = await page.evaluate(() => window.__frames);
                    const deltas = frames.slice(1).map((f, i) => Math.round(f.t - frames[i].t));
                    const measures = await page.evaluate(() =>
                        Object.fromEntries(
                            performance
                                .getEntriesByType("measure")
                                .filter((e) => e.name.startsWith("scene-swap:"))
                                .map((e) => [e.name.slice(11), Math.round(e.duration)]),
                        ),
                    );
                    return {
                        loaf: await page.evaluate(() => window.__loaf),
                        renderer: await page.evaluate(() => {
                            const gl = document.createElement("canvas").getContext("webgl2");
                            const x = gl?.getExtension("WEBGL_debug_renderer_info");
                            return x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : null;
                        }),
                        hash: await page.evaluate(() => location.hash),
                        worst: Math.max(...deltas),
                        frames: deltas.length,
                        measures,
                        afterPick: requests.filter((r) => r.t >= tPick && BACKDROP.test(r.url)).map((r) => r.url.split("/").pop()),
                        strip,
                        layers: frames.map((f, i) => ({ dt: i ? deltas[i - 1] : 0, vt: f.vt, host: f.host, aurora: f.aurora, dock: f.dock })),
                    };
                } finally {
                    await ctx.close();
                }
            };
            for (let run = 0; run < N; run++) {
                const timed = await pickHome(run, false);
                const shot = await pickHome(run, true);
                rows.push({ run, ...timed, strip: shot.strip, stripAfterPick: shot.afterPick, stripHash: shot.hash, stripLayers: shot.layers });
            }
        },
        // KF_GPU=1 — the GPU witness (swap-3d.mjs's): the same headless shell
        // on ANGLE-Metal, to part software-raster cost from the consumer's.
        { label: "home-swap", launch: process.env.KF_GPU === "1" ? { args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] } : {} },
    );
    if (ran?.skipped) process.exit(2);
} finally {
    await server.close();
}

if (OUT) fs.writeFileSync(path.join(OUT, `home-swap-${FROM}.json`), JSON.stringify(rows, null, 1));
console.log(`home-swap — ${URL_OVERRIDE ?? DIST} · ${rows[0]?.renderer ?? "no WebGL"} · #/${FROM} -> Home · N=${N} · 1440x900 light`);
let fail = 0;
for (const r of rows) {
    const minStd = Math.min(...r.strip.map((s) => s.std));
    const bad = [];
    for (const h of [r.hash, r.stripHash]) if (h !== "#/" && h !== "") bad.push(`hash ${h}`);
    if (!r.strip.length) bad.push("no presented frames");
    const late = [...new Set([...r.afterPick, ...r.stripAfterPick])];
    if (late.length) bad.push(`backdrop fetched after the pick: ${late.join(", ")}`);
    // The frame bar binds on a GPU compositor only: under SwiftShader the
    // aurora's first frames are software raster with an idle main thread (LoAF
    // carries no script), the environment cost repair 2 parted on Amiga.
    if (r.worst > MAX_FRAME_MS && !/SwiftShader/i.test(r.renderer ?? "SwiftShader")) bad.push(`worst frame ${r.worst} ms > ${MAX_FRAME_MS}`);
    if (minStd < MIN_STDDEV) bad.push(`blank frame (stddev ${minStd} < ${MIN_STDDEV})`);
    if (bad.length) fail++;
    console.log(
        `${bad.length ? "FAIL" : "ok  "} run ${r.run}: worst ${r.worst} ms / ${r.frames} frames · ${JSON.stringify(r.measures)} · strip std min ${minStd}${bad.length ? " · " + bad.join("; ") : ""}`,
    );
}
process.exit(fail ? 1 : 0);
