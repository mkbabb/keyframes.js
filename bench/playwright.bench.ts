/**
 * The LoAF >50ms-trace gate — the LoAF observer's REAL second consumer.
 *
 * `demo/app/runtime/loaf-observer.ts` records every long-animation-frame over
 * 50ms to `window.__kfLoaf` "so the Playwright >50ms-trace gate and the bench
 * can read it" (its docstring). For two tranches that consumer was a stub
 * (`expect(true).toBe(true)`), leaving the observer a 1-consumer speculative
 * surface (an overfitting-precept violation) and the >50ms-trace chronic open.
 * This gate IS that consumer: it
 *
 *   1. launches Chromium against a served bench page,
 *   2. drives a large `AnimationGroup` composite (`bench/loaf-scene.html`),
 *   3. reads `window.__kfLoaf` — the ring the observer populates — and asserts
 *      NO long-animation-frame > 50ms occurred during the group's draw loop,
 *
 * making the producer (observer) / consumer (this gate) pair genuinely mutual
 * and closing both the LoAF and >50ms-trace chronics as ONE perf-evidence
 * subsystem.
 *
 * The observer is DEV-only in the demo (DCE'd from prod by `main.ts`'s
 * `import.meta.env.DEV` guard). The bench does NOT go through that path: the
 * served bench page mounts the observer EXPLICITLY (importing the same
 * `demo/app/runtime/loaf-observer.ts` source, transpiled on the fly), so the
 * prod demo build stays observer-free while the bench drives the real observer.
 *
 * Chromium resolves from `KF_PLAYWRIGHT_DIR` (the sibling that has playwright
 * installed) or this repo — the same convention `scripts/occlusion-gate.mjs`
 * uses. When Chromium is unresolvable the gate SKIPS locally and HARD-FAILS in
 * CI (`KF_REQUIRE_BROWSER=1`). It also self-skips under jsdom (the default
 * vitest env), since it needs a real browser — run it with
 * `KF_PLAYWRIGHT_DIR=… npm run bench`.
 *
 * Bite controls (the negative cases that MUST redden the gate):
 *   - `KF_LOAF_INJECT_BLOCK=1` — inject a synthetic 120ms main-thread block
 *     inside the group's per-frame tick; the observer records it and the gate
 *     FAILS.
 *   - `KF_LOAF_NO_OBSERVER=1`  — serve a no-op observer module so nothing
 *     populates `window.__kfLoaf`; the gate FAILS its "the observer ran"
 *     precondition (a silent green from a dead observer is itself a miss).
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";
import { bench, describe } from "vitest";
import { IN_CI } from "../scripts/lib/ci-env.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

// The real observer source the bench transpiles on the fly. It moved from
// `demo/app/loaf-observer.ts` → `demo/app/runtime/loaf-observer.ts` at the S.D1
// `demo/app/` partition (commit 440e5c3) WITHOUT this bench's path following it,
// which ENOENT'd the whole gate silently for 116 commits (lane 32 §2.7). The
// `assertBenchPathsResolve` clause in proof:bench-taxonomy now statically
// asserts every REPO-relative path this bench reads still resolves, so a future
// re-partition reds loudly instead of zeroing this gate's signal again.
const OBSERVER_SRC = path.join(REPO, "demo/app/runtime/loaf-observer.ts");

const LOAF_THRESHOLD_MS = 50;

// S.A2 S3 — the DE-MAGIC of `KF_LOAF_COUNT`. The 50ms threshold itself is NEVER
// relaxed (the runner-calibrated posture: ci-env.mjs §THE THREE POSTURES); only
// the yield-stress SIZE is sized to the runner, and that size is a NAMED profile
// here, no longer a bare magic `48` injected by ci.yml prose.
//
//   LOAF_COMPOSITE_FULL (200) — the real-hardware yield stress. 200 children =
//     6.25× AnimationGroup.YIELD_BATCH (32), so the group ticks in ~7 batches
//     with a `scheduler.yield()` between each — the batched path this bench
//     verifies. Large enough that an un-yielded tick would block >50ms; with the
//     engine's yield batching the clean composite blocks ~10-15ms locally.
//   LOAF_COMPOSITE_CI_SMOKE (48) — the runner-calibrated size. The shared GitHub
//     VM runs ~6× slower than real hardware, so the full 200-cell loop
//     legitimately blocks ~130ms there (local: ~20ms) with NO regression — a
//     single absolute threshold cannot separate that host cost from the
//     bite-test's 120ms inject. 48 still crosses the YIELD_BATCH=32 boundary
//     (exercises the yield path; loop worst-frame ~30ms, comfortably under the
//     UNCHANGED strict 50ms), and the 120ms inject still reddens. cf. tranche-B
//     5fa76b4 (CI perf SMOKE robust, real gate local).
export const LOAF_COMPOSITE_FULL = 200;
export const LOAF_COMPOSITE_CI_SMOKE = 48;

// The size is derived from the ONE IN_CI authority (scripts/lib/ci-env.mjs) — CI
// self-selects the runner-calibrated smoke, local uses the full stress — with an
// explicit numeric `KF_LOAF_COUNT` override kept for experimentation. ci.yml no
// longer carries the magic literal; the profile is named + single-sourced here.
const COMPOSITE_COUNT =
    process.env.KF_LOAF_COUNT != null
        ? Number(process.env.KF_LOAF_COUNT)
        : IN_CI
          ? LOAF_COMPOSITE_CI_SMOKE
          : LOAF_COMPOSITE_FULL;

/** Resolve Chromium the way the occlusion gate does. */
function resolveChromium() {
    const root = process.env.KF_PLAYWRIGHT_DIR ?? REPO;
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

/** The three externalised dist trees the bench importmap points at. */
function distRoots() {
    const valueRoot = path.dirname(
        createRequire(path.join(REPO, "package.json")).resolve(
            "@mkbabb/value.js",
        ),
    );
    const parseThatRoot = path.dirname(
        createRequire(path.join(REPO, "package.json")).resolve(
            "@mkbabb/parse-that",
        ),
    );
    return {
        kf: path.join(REPO, "dist"),
        value: valueRoot,
        parseThat: parseThatRoot,
    };
}

const MIME: Record<string, string> = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".map": "application/json",
};

function send(res: http.ServerResponse, code: number, type: string, body: string | Buffer) {
    res.writeHead(code, { "content-type": type });
    res.end(body);
}

/**
 * Serve the bench page + the three dist trees under prefix roots, and the
 * observer as an on-the-fly-transpiled ESM module. `noObserver` swaps in a
 * no-op observer (the bite that proves a dead observer reddens the gate).
 */
async function serve(noObserver: boolean) {
    const roots = distRoots();
    const sceneHtml = fs.readFileSync(
        path.join(HERE, "loaf-scene.html"),
        "utf8",
    );

    // The observer module the bench imports as `@kf/loaf-observer`.
    // Pre-flight the source path with a DISTINCT, human-legible error rather
    // than a raw ENOENT deep in `readFileSync` — the ENOENT was
    // indistinguishable in the CI log from a genuine bench failure and the
    // `|| true`-wrapped `grep -q 'loaf-gate.*PASS'` step could not tell "the
    // observer moved" from "the observer regressed" (lane 32 §2.7 / T-PERF-A).
    if (!noObserver && !fs.existsSync(OBSERVER_SRC)) {
        throw new Error(
            `loaf-gate — FAIL: the LoAF observer source is missing at ` +
                `${path.relative(REPO, OBSERVER_SRC)} — it MOVED. Update ` +
                `bench/playwright.bench.ts's OBSERVER_SRC path (and the ` +
                `proof:bench-taxonomy path-resolves anchor will have already ` +
                `flagged this statically).`,
        );
    }
    const observerJs = noObserver
        ? // True no-op: never touches `window.__kfLoaf`, so the ring stays
          // ABSENT — the gate must redden on its "the observer ran"
          // precondition (a green from a dead observer is the exact
          // 1-consumer fiction this gate exists to kill).
          `export function observeLongAnimationFrames(){ return undefined; }`
        : (
              await transformWithOxc(
                  fs.readFileSync(OBSERVER_SRC, "utf8"),
                  "loaf-observer.ts",
                  { lang: "ts", target: "es2022" },
              )
          ).code;

    const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        const p = decodeURIComponent(url.pathname);

        if (p === "/" || p === "/loaf-scene.html") {
            send(res, 200, "text/html", sceneHtml);
            return;
        }
        if (p === "/observer/loaf-observer.js") {
            send(res, 200, "text/javascript", observerJs);
            return;
        }

        // Prefix-routed static roots → the three dist trees.
        const route: [string, string][] = [
            ["/kf/", roots.kf],
            ["/value/", roots.value],
            ["/parse-that/", roots.parseThat],
        ];
        for (const [prefix, dir] of route) {
            if (p.startsWith(prefix)) {
                let file = path.join(dir, p.slice(prefix.length));
                // S.A0(4) — extensionless-`.js` fallback: importmap prefix
                // substitution yields `/value/subpaths/math` (no extension) for the
                // `@mkbabb/value.js/math` subpath specifier; serve `subpaths/math.js`.
                if (
                    file.startsWith(dir) &&
                    !fs.existsSync(file) &&
                    fs.existsSync(file + ".js")
                ) {
                    file += ".js";
                }
                if (file.startsWith(dir) && fs.existsSync(file) && fs.statSync(file).isFile()) {
                    send(
                        res,
                        200,
                        MIME[path.extname(file)] ?? "application/octet-stream",
                        fs.readFileSync(file),
                    );
                    return;
                }
            }
        }
        send(res, 404, "text/plain", `not found: ${p}`);
    });

    await new Promise<void>((r) => server.listen(0, r));
    const port = (server.address() as { port: number }).port;
    return { server, port };
}

interface LoAFRecord {
    ts: number;
    duration: number;
    blocking: number;
    source: string;
}

/**
 * Run the gate. Returns nothing on success; throws on any violation so the
 * `bench()` body (and a future CI `node`-runner) reddens.
 */
async function runGate() {
    const chromium = resolveChromium();
    if (!chromium) {
        const msg =
            "loaf-gate — SKIP: playwright not resolvable " +
            "(set KF_PLAYWRIGHT_DIR or install @playwright/test).";
        if (process.env.KF_REQUIRE_BROWSER) throw new Error(msg.replace("SKIP", "FAIL"));
        console.warn(msg);
        return;
    }
    if (!fs.existsSync(path.join(REPO, "dist/keyframes.js"))) {
        throw new Error(
            "loaf-gate — FAIL: dist/keyframes.js not built (the lead runs `npm run build:lib`).",
        );
    }

    const noObserver = process.env.KF_LOAF_NO_OBSERVER === "1";
    const injectBlock = process.env.KF_LOAF_INJECT_BLOCK === "1";

    const { server, port } = await serve(noObserver);
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({
            viewport: { width: 1280, height: 800 },
        });
        const qs = new URLSearchParams({
            count: String(COMPOSITE_COUNT),
            block: injectBlock ? "1" : "0",
        });
        await page.goto(`http://127.0.0.1:${port}/loaf-scene.html?${qs}`, {
            waitUntil: "load",
        });

        // Wait for the composite to finish its play() loop.
        await page.waitForFunction(() => (window as any).__kfBenchDone === true, {
            timeout: 30_000,
        });

        const benchError = await page.evaluate(() => (window as any).__kfBenchError);
        if (benchError) {
            throw new Error(`loaf-gate — FAIL: bench scene errored:\n${benchError}`);
        }

        const loaf = (await page.evaluate(
            () => (window as any).__kfLoaf ?? null,
        )) as LoAFRecord[] | null;

        // Precondition: the observer must be live (a green from a dead observer
        // is the exact 1-consumer fiction this gate exists to kill). With the
        // real observer mounted, `window.__kfLoaf` is an array (possibly
        // empty); the no-observer bite leaves it absent/undefined.
        if (!Array.isArray(loaf)) {
            throw new Error(
                "loaf-gate — FAIL: window.__kfLoaf was not populated — the LoAF " +
                    "observer did not run (observer unreachable or no-op).",
            );
        }

        // The assertion is on BLOCKING duration, not total frame duration.
        // A LoAF entry's `duration` includes rendering/paint/composite of the
        // composite's cells; a 54ms-duration / 0ms-blocking frame is the GPU
        // painting, not the engine monopolising the main thread.
        // `blockingDuration` is
        // the INP-relevant "long task" measure — the exact quantity
        // `scheduler.yield()` exists to keep small, and the exact quantity the
        // named bite injects (a >50ms BLOCKING task). Total durations are
        // surfaced for diagnostics; only blocking reddens the gate.
        const blockingFrames = loaf.filter((r) => r.blocking > LOAF_THRESHOLD_MS);
        const worstDuration = loaf.reduce((m, r) => Math.max(m, r.duration), 0);
        const worstBlocking = loaf.reduce((m, r) => Math.max(m, r.blocking), 0);
        console.log(
            `loaf-gate — composite=${COMPOSITE_COUNT} cells, ` +
                `__kfLoaf entries=${loaf.length} (≥${LOAF_THRESHOLD_MS}ms frames), ` +
                `worst duration=${worstDuration.toFixed(1)}ms, ` +
                `worst blocking=${worstBlocking.toFixed(1)}ms, ` +
                `>${LOAF_THRESHOLD_MS}ms-blocking=${blockingFrames.length}`,
        );
        for (const f of blockingFrames) {
            console.error(
                `  ✗ blocking frame ${f.duration.toFixed(1)}ms total ` +
                    `(blocking ${f.blocking.toFixed(1)}ms) — ${f.source}`,
            );
        }

        if (blockingFrames.length > 0) {
            throw new Error(
                `loaf-gate — FAIL: ${blockingFrames.length} long-animation-frame ` +
                    `task(s) blocked the main thread > ${LOAF_THRESHOLD_MS}ms during ` +
                    `the AnimationGroup composite.`,
            );
        }
        console.log(
            `loaf-gate — PASS: no >${LOAF_THRESHOLD_MS}ms main-thread block during ` +
                `the ${COMPOSITE_COUNT}-animation composite (observer live, ` +
                `${loaf.length} ≥${LOAF_THRESHOLD_MS}ms-duration frame(s) observed, ` +
                `all sub-${LOAF_THRESHOLD_MS}ms blocking).`,
        );
    } finally {
        await browser.close();
        server.close();
    }
}

// vitest's `bench` runner is the run surface (`npm run bench`); the gate is an
// assertion, not a throughput measurement, so it runs ONCE and throws on a
// violation. Under the default jsdom env (no browser) it self-skips via the
// chromium-resolution guard, so `npm test` stays green; the real run is
// `KF_PLAYWRIGHT_DIR=… npm run bench`.
describe("LoAF >50ms-trace gate (the observer's 2nd consumer)", () => {
    bench(
        "no >50ms frame during the large AnimationGroup composite",
        async () => {
            await runGate();
        },
        { iterations: 1, warmupIterations: 0, time: 0, warmupTime: 0 },
    );
});
