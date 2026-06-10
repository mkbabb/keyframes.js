#!/usr/bin/env node
/**
 * probe:webkit-linear-accel — J.W6 S9 / CE-1.0 (measure-first instrument, NOT a CI gate).
 *
 * QUESTION (audit/frontier/compositor-eligibility.md CE-1.0 / §3.0): does WebKit
 * hardware-accelerate a transform animation whose easing is a custom `linear()`
 * function — the spring twin kf's WAAPI delegation emits (`waapi.ts` toWAAPIOptions:
 * `easing = uniformTiming.css ?? "linear"`)? Safari is reported to REFUSE HW-accel
 * for any `linear()`-eased animation, making a delegated spring run main-thread —
 * heavier than the rAF path it bypassed (a conservative-correctness leak).
 *
 * METHOD — a differential main-thread-occupancy probe (no public WebKit API exposes
 * compositor placement; this is the feasible feature-probe form the spec names):
 *   N concurrent WAAPI animations per arm, then a 2 s saturating MessageChannel
 *   task-throughput measurement (work units completed) + rAF cadence. The renderer
 *   interleaves rendering steps between posted tasks, so per-frame main-thread
 *   animation cost shows up DIRECTLY as lost task throughput.
 *
 *   arm "baseline"  — no animations (the host's throughput ceiling)
 *   arm "keyword"   — N × transform/translateX, easing: "linear"   (compositor-eligible)
 *   arm "linearfn"  — N × transform/translateX, easing: "linear(<61 spring stops>)"
 *                     (the hazard arm — kf's spring twin shape)
 *   arm "layout"    — N × left animations (NEVER accelerated; the main-thread anchor)
 *
 * READING THE NUMBERS:
 *   keyword ≈ baseline AND linearfn ≪ keyword (toward layout) ⇒ the exclusion BITES
 *     on this WebKit build (the born-RED witness for the GUARD leg).
 *   keyword ALSO ≪ baseline ⇒ the environment accelerates nothing (headless
 *     software compositing) — INCONCLUSIVE here; route to real-Safari Web Inspector.
 *   linearfn ≈ keyword ≈ baseline ⇒ no measurable main-thread cost ⇒ DOCUMENT.
 *
 * Chromium runs the SAME arms as the instrument control (Chromium composites
 * linear() easing; its keyword/linearfn arms should match — validating that a
 * linearfn-vs-keyword gap on WebKit is engine behaviour, not instrument noise).
 *
 * Usage:  KF_PLAYWRIGHT_DIR=/path node scripts/probe-webkit-linear-accel.mjs
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const N = 800;
const WINDOW_MS = 2000;
const SETTLE_MS = 300;

// A damped-spring linear() twin (61 stops) — the shape springTimingFunction emits.
const SPRING_LINEAR = (() => {
    const stops = [];
    for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const v = 1 - Math.exp(-6 * t) * Math.cos(10 * Math.PI * t * 0.6);
        stops.push(
            i === 0
                ? `${v.toFixed(4)}`
                : `${v.toFixed(4)} ${((t * 100 * 100) / 100).toFixed(2)}%`,
        );
    }
    return `linear(${stops.join(", ")})`;
})();

function resolveBrowsers() {
    const root =
        process.env.KF_PLAYWRIGHT_DIR ??
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            const m = requireFrom(pkg);
            if (m.webkit && m.chromium)
                return { webkit: m.webkit, chromium: m.chromium, pkg, root };
        } catch {
            /* try next */
        }
    }
    return null;
}

async function runArm(browser, mode) {
    const page = await browser.newPage();
    await page.setContent(
        `<!doctype html><html><body style="margin:0"><div id="stage" style="position:relative;width:400px;height:400px;overflow:hidden"></div></body></html>`,
    );
    const result = await page.evaluate(
        async ({ mode, N, windowMs, settleMs, springLinear }) => {
            const stage = document.getElementById("stage");
            const anims = [];
            let easingApplied = null;
            if (mode !== "baseline") {
                for (let i = 0; i < N; i++) {
                    const d = document.createElement("div");
                    d.style.cssText = `position:absolute;left:0;top:${(i % 50) * 8}px;width:8px;height:8px;background:#09f`;
                    stage.appendChild(d);
                    const opts = {
                        duration: 4000,
                        iterations: Infinity,
                        easing: mode === "linearfn" ? springLinear : "linear",
                    };
                    const keyframes =
                        mode === "layout"
                            ? [{ left: "0px" }, { left: "300px" }]
                            : [
                                  { transform: "translateX(0px)" },
                                  { transform: "translateX(300px)" },
                              ];
                    anims.push(d.animate(keyframes, opts));
                }
                await Promise.all(anims.map((a) => a.ready));
                // Prove the custom easing string was ACCEPTED (not coerced/thrown).
                easingApplied = anims[0].effect.getTiming().easing;
            }
            await new Promise((r) => setTimeout(r, settleMs));

            // rAF cadence over the window (concurrent with the task saturation —
            // identical load shape in every arm, so arms stay comparable).
            const intervals = [];
            let last;
            let stopRaf = false;
            const rafDone = new Promise((res) => {
                const tick = (t) => {
                    if (last !== undefined) intervals.push(t - last);
                    last = t;
                    if (!stopRaf) requestAnimationFrame(tick);
                    else res();
                };
                requestAnimationFrame(tick);
                setTimeout(() => (stopRaf = true), windowMs);
            });

            // Saturating task throughput (MessageChannel — rendering steps preempt
            // between tasks; main-thread animation cost = lost units).
            let units = 0;
            const deadline = performance.now() + windowMs;
            await new Promise((res) => {
                const ch = new MessageChannel();
                ch.port1.onmessage = () => {
                    if (performance.now() >= deadline) return res();
                    let s = 0;
                    for (let i = 0; i < 5000; i++) s += Math.sqrt(i);
                    if (s < 0) console.log(s); // keep the work alive
                    units++;
                    ch.port2.postMessage(0);
                };
                ch.port2.postMessage(0);
            });
            await rafDone;

            intervals.sort((a, b) => a - b);
            const mean =
                intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1);
            const p95 = intervals[Math.floor(intervals.length * 0.95)] ?? NaN;
            return {
                units,
                rafFrames: intervals.length + 1,
                rafMeanMs: +mean.toFixed(2),
                rafP95Ms: +p95.toFixed(2),
                easingApplied:
                    easingApplied && easingApplied.length > 48
                        ? easingApplied.slice(0, 45) + "..."
                        : easingApplied,
            };
        },
        { mode, N, windowMs: WINDOW_MS, settleMs: SETTLE_MS, springLinear: SPRING_LINEAR },
    );
    await page.close();
    return result;
}

const resolved = resolveBrowsers();
if (!resolved) {
    console.error(
        "probe:webkit-linear-accel — playwright webkit+chromium not resolvable (set KF_PLAYWRIGHT_DIR).",
    );
    process.exit(1);
}
console.log(
    `probe:webkit-linear-accel — J.W6 S9 / CE-1.0 (N=${N}, window=${WINDOW_MS}ms, ` +
        `spring twin: 61-stop linear(); resolver: ${resolved.pkg} from ${resolved.root})`,
);

for (const name of ["webkit", "chromium"]) {
    const type = resolved[name];
    let browser;
    try {
        browser = await type.launch();
    } catch (e) {
        console.log(`  ${name}: LAUNCH FAILED — ${e.message.split("\n")[0]}`);
        continue;
    }
    const version = browser.version();
    const out = {};
    for (const mode of ["baseline", "keyword", "linearfn", "layout"]) {
        out[mode] = await runArm(browser, mode);
    }
    await browser.close();
    const b = out.baseline.units;
    const pct = (x) => `${((100 * x.units) / b).toFixed(1)}% of baseline`;
    console.log(`\n  ${name} ${version} — task-throughput units (2 s window):`);
    for (const mode of ["baseline", "keyword", "linearfn", "layout"]) {
        const r = out[mode];
        console.log(
            `    ${mode.padEnd(9)} units=${String(r.units).padStart(6)} (${mode === "baseline" ? "ceiling" : pct(r)})` +
                ` rafFrames=${r.rafFrames} meanMs=${r.rafMeanMs} p95Ms=${r.rafP95Ms}` +
                (r.easingApplied ? ` easing="${r.easingApplied}"` : ""),
        );
    }
    const kw = out.keyword.units / b;
    const lf = out.linearfn.units / b;
    const ly = out.layout.units / b;
    console.log(
        `    → keyword=${(kw * 100).toFixed(1)}% · linearfn=${(lf * 100).toFixed(1)}% · layout=${(ly * 100).toFixed(1)}%` +
            ` · linearfn-vs-keyword gap=${((kw - lf) * 100).toFixed(1)}pp`,
    );
}
console.log(
    "\nReading: keyword≈baseline AND linearfn≪keyword ⇒ exclusion BITES;" +
        " all arms ≪ baseline ⇒ environment accelerates nothing (inconclusive here);" +
        " linearfn≈keyword ⇒ no measurable main-thread penalty in this build.",
);
