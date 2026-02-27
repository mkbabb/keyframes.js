/**
 * Browser benchmark runner — compares keyframes.js (rAF), CSS @keyframes, WAAPI, and optionally GSAP.
 *
 * Metrics: FPS (avg, P1, P5), dropped frames, frame budget %, setup time, time to first frame.
 */

import { CSSKeyframesAnimation } from "../../src/animation";

// ========== Types ==========

interface BenchmarkResult {
    engine: string;
    scenario: string;
    fps: { avg: number; p1: number; p5: number };
    droppedFrames: number;
    frameBudgetPct: number;
    setupTimeMs: number;
    timeToFirstFrameMs: number;
    totalFrames: number;
}

interface Scenario {
    name: string;
    elementCount: number;
    cssKeyframes: string;
    duration: number;
}

// ========== Scenarios ==========

const SCENARIOS: Scenario[] = [
    {
        name: "Opacity fade",
        elementCount: 1,
        duration: 2000,
        cssKeyframes: `from { opacity: 0; } to { opacity: 1; }`,
    },
    {
        name: "Transform translate",
        elementCount: 1,
        duration: 2000,
        cssKeyframes: `from { transform: translateX(0px); } to { transform: translateX(300px); }`,
    },
    {
        name: "Multi-property",
        elementCount: 1,
        duration: 2000,
        cssKeyframes: `from { opacity: 0; transform: translateX(0px); } to { opacity: 1; transform: translateX(300px); }`,
    },
    {
        name: "Complex keyframes (11 stops)",
        elementCount: 1,
        duration: 2000,
        cssKeyframes: Array.from({ length: 11 }, (_, i) => {
            const pct = Math.round((i / 10) * 100);
            return `${pct}% { opacity: ${i / 10}; transform: translateX(${i * 30}px); }`;
        }).join("\n"),
    },
    {
        name: "Staggered 100",
        elementCount: 100,
        duration: 3000,
        cssKeyframes: `from { opacity: 0; transform: translateX(0px); } to { opacity: 1; transform: translateX(200px); }`,
    },
    {
        name: "Staggered 500",
        elementCount: 500,
        duration: 3000,
        cssKeyframes: `from { opacity: 0; transform: translateX(0px); } to { opacity: 1; transform: translateX(200px); }`,
    },
    {
        name: "Staggered 1000",
        elementCount: 1000,
        duration: 3000,
        cssKeyframes: `from { opacity: 0; transform: translateX(0px); } to { opacity: 1; transform: translateX(200px); }`,
    },
];

// ========== Helpers ==========

function createElements(count: number, container: HTMLElement): HTMLElement[] {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "bench-element";
        el.style.cssText =
            "width:10px;height:10px;background:#3b82f6;position:absolute;top:0;left:0;will-change:transform,opacity;";
        container.appendChild(el);
        elements.push(el);
    }
    return elements;
}

function clearContainer(container: HTMLElement) {
    container.innerHTML = "";
}

function percentile(sorted: number[], p: number): number {
    const idx = Math.floor((p / 100) * sorted.length);
    return sorted[Math.min(idx, sorted.length - 1)];
}

function measureFrames(durationMs: number): Promise<{ deltas: number[]; jsTimePerFrame: number[] }> {
    return new Promise((resolve) => {
        const deltas: number[] = [];
        const jsTimePerFrame: number[] = [];
        let prevTime = 0;
        let startTime = 0;

        const tick = (t: number) => {
            if (startTime === 0) {
                startTime = t;
                prevTime = t;
                requestAnimationFrame(tick);
                return;
            }

            const dt = t - prevTime;
            const jsBefore = performance.now();

            deltas.push(dt);

            const jsAfter = performance.now();
            jsTimePerFrame.push(jsAfter - jsBefore);

            prevTime = t;

            if (t - startTime < durationMs) {
                requestAnimationFrame(tick);
            } else {
                resolve({ deltas, jsTimePerFrame });
            }
        };

        requestAnimationFrame(tick);
    });
}

function analyzeFrames(
    deltas: number[],
    setupTimeMs: number,
    ttffMs: number,
): Omit<BenchmarkResult, "engine" | "scenario"> {
    const fpsValues = deltas.map((d) => (d > 0 ? 1000 / d : 0)).sort((a, b) => a - b);

    const avg = fpsValues.reduce((s, v) => s + v, 0) / fpsValues.length;
    const p1 = percentile(fpsValues, 1);
    const p5 = percentile(fpsValues, 5);

    const dropped = deltas.filter((d) => d > 33.34).length;

    const avgJsTime = deltas.reduce((s, v) => s + v, 0) / deltas.length;
    const budgetPct = (avgJsTime / 16.67) * 100;

    return {
        fps: { avg: Math.round(avg * 10) / 10, p1: Math.round(p1 * 10) / 10, p5: Math.round(p5 * 10) / 10 },
        droppedFrames: dropped,
        frameBudgetPct: Math.round(budgetPct * 10) / 10,
        setupTimeMs: Math.round(setupTimeMs * 100) / 100,
        timeToFirstFrameMs: Math.round(ttffMs * 100) / 100,
        totalFrames: deltas.length,
    };
}

// ========== Engines ==========

async function runKeyframesJS(
    scenario: Scenario,
    container: HTMLElement,
): Promise<BenchmarkResult> {
    clearContainer(container);
    const elements = createElements(scenario.elementCount, container);

    const setupStart = performance.now();
    const anims = elements.map((el) => {
        const anim = new CSSKeyframesAnimation({
            duration: scenario.duration,
            useWAAPI: false,
        }).fromString(scenario.cssKeyframes);
        anim.setTargets(el);
        return anim;
    });
    const setupTime = performance.now() - setupStart;

    const ttffStart = performance.now();
    const promises = anims.map((a) => a.play());
    const { deltas } = await measureFrames(scenario.duration);
    const ttff = performance.now() - ttffStart;

    await Promise.allSettled(promises);

    const result = analyzeFrames(deltas, setupTime, ttff);
    return { engine: "keyframes.js (rAF)", scenario: scenario.name, ...result };
}

async function runWAAPI(
    scenario: Scenario,
    container: HTMLElement,
): Promise<BenchmarkResult> {
    clearContainer(container);
    const elements = createElements(scenario.elementCount, container);

    // Parse the CSS string to extract keyframe data
    const tempAnim = new CSSKeyframesAnimation({ duration: scenario.duration }).fromString(scenario.cssKeyframes);

    const setupStart = performance.now();

    // Build WAAPI keyframes from template frames
    const waKeyframes: Keyframe[] = [];
    for (const tf of tempAnim.templateFrames) {
        const offset = tf.start.value / 100;
        const kf: Keyframe = { offset };

        // Simple property extraction: iterate flat vars
        const vars = tempAnim.interpFrames(offset * scenario.duration, false);
        for (const [key, val] of Object.entries(vars)) {
            const v = val as any;
            (kf as any)[key] = v?.toString?.() ?? String(v);
        }

        waKeyframes.push(kf);
    }

    const waAnims = elements.map((el) =>
        el.animate(waKeyframes, {
            duration: scenario.duration,
            fill: "forwards",
            easing: "ease-in-out",
        }),
    );
    const setupTime = performance.now() - setupStart;

    const ttffStart = performance.now();
    const { deltas } = await measureFrames(scenario.duration);
    const ttff = performance.now() - ttffStart;

    await Promise.allSettled(waAnims.map((a) => a.finished));

    const result = analyzeFrames(deltas, setupTime, ttff);
    return { engine: "WAAPI", scenario: scenario.name, ...result };
}

async function runCSSAnimations(
    scenario: Scenario,
    container: HTMLElement,
): Promise<BenchmarkResult> {
    clearContainer(container);

    // Create a unique animation name and inject CSS
    const animName = `bench_${Date.now()}`;
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        @keyframes ${animName} { ${scenario.cssKeyframes} }
        .bench-css-animate { animation: ${animName} ${scenario.duration}ms ease-in-out forwards; }
    `;
    document.head.appendChild(styleEl);

    const setupStart = performance.now();
    const elements = createElements(scenario.elementCount, container);
    const setupTime = performance.now() - setupStart;

    const ttffStart = performance.now();
    elements.forEach((el) => el.classList.add("bench-css-animate"));
    const { deltas } = await measureFrames(scenario.duration);
    const ttff = performance.now() - ttffStart;

    // Cleanup
    styleEl.remove();

    const result = analyzeFrames(deltas, setupTime, ttff);
    return { engine: "CSS @keyframes", scenario: scenario.name, ...result };
}

// ========== UI ==========

function renderResults(results: BenchmarkResult[], tableEl: HTMLElement) {
    const headers = [
        "Scenario",
        "Engine",
        "FPS Avg",
        "FPS P1",
        "FPS P5",
        "Dropped",
        "Budget %",
        "Setup (ms)",
        "TTFF (ms)",
        "Frames",
    ];

    let html = `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;

    for (const r of results) {
        html += `<tr>
            <td>${r.scenario}</td>
            <td>${r.engine}</td>
            <td>${r.fps.avg}</td>
            <td>${r.fps.p1}</td>
            <td>${r.fps.p5}</td>
            <td>${r.droppedFrames}</td>
            <td>${r.frameBudgetPct}%</td>
            <td>${r.setupTimeMs}</td>
            <td>${r.timeToFirstFrameMs}</td>
            <td>${r.totalFrames}</td>
        </tr>`;
    }

    html += "</tbody></table>";
    tableEl.innerHTML = html;
}

// ========== Main ==========

export async function runBenchmarks() {
    const container = document.getElementById("bench-container")!;
    const tableEl = document.getElementById("bench-results")!;
    const statusEl = document.getElementById("bench-status")!;

    const results: BenchmarkResult[] = [];
    const engines = [
        { name: "CSS @keyframes", fn: runCSSAnimations },
        { name: "WAAPI", fn: runWAAPI },
        { name: "keyframes.js (rAF)", fn: runKeyframesJS },
    ];

    for (const scenario of SCENARIOS) {
        for (const engine of engines) {
            statusEl.textContent = `Running: ${scenario.name} — ${engine.name}...`;

            // Small delay between tests for GC
            await new Promise((r) => setTimeout(r, 500));

            try {
                const result = await engine.fn(scenario, container);
                results.push(result);
                renderResults(results, tableEl);
            } catch (err) {
                console.error(`Failed: ${scenario.name} / ${engine.name}`, err);
                results.push({
                    engine: engine.name,
                    scenario: scenario.name,
                    fps: { avg: 0, p1: 0, p5: 0 },
                    droppedFrames: -1,
                    frameBudgetPct: -1,
                    setupTimeMs: -1,
                    timeToFirstFrameMs: -1,
                    totalFrames: 0,
                });
            }
        }
    }

    statusEl.textContent = "Done!";
    clearContainer(container);
}
