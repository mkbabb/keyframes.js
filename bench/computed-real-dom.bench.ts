/**
 * G.W16 S2 — the Playwright real-DOM computed-unit corpus (the genuine-path C5
 * proof).
 *
 * The re-pin's C5 fix (`a-valuejs-leverage F-VJ-1`) makes the 24 no-op viewport/
 * container units RESOLVE — `50dvh`/`svh`/`lvh`/`vi`/`vb`/… now resolve against
 * the live layout instead of dropping to a bare number. It is a DOM-resolution
 * correctness fix landing in a DOM-less test environment: the LEAST-protected
 * change in all of G (jsdom resolves NONE of `50dvh`/`calc(50%+10px)`/`100cqw` —
 * §State 1, Probe-1). This is the ONLY place that fix is provable on the genuine
 * path: launch Chromium against a served, laid-out page with a known viewport +
 * a `container-type: inline-size` ancestor, animate the computed-unit corpus,
 * sample the midpoint, and read the ACTUAL `getComputedStyle().width` against the
 * page's known geometry.
 *
 * It MIRRORS `bench/playwright.bench.ts` — the same chromium-resolution
 * convention (`KF_PLAYWRIGHT_DIR`, SKIP-locally / HARD-FAIL-in-CI under
 * `KF_REQUIRE_BROWSER`, self-skip under jsdom), the same three-dist-tree
 * importmap. It manufactures no new browser-launch machinery. It is the natural
 * sibling of G.W3's `proof:resize-tracks` — both need a real laid-out DOM; this
 * wave establishes the corpus + harness G.W3's container-resize check rides into.
 *
 * Bite controls (the negative cases that MUST redden the gate):
 *   - revert value.js to `^0.10.0` (the pre-C5 no-op classifier) → the live page
 *     resolves to the bare number / freezes at the un-resolved value → the gate
 *     FAILS (the resolved px no longer matches the page geometry).
 *   - `KF_COMPUTED_NO_BUILD=1` is NOT honoured — the gate always builds the lib
 *     if dist is stale, so it measures the CURRENT engine source.
 *
 * Run it with `KF_PLAYWRIGHT_DIR=… npm run bench` (or via
 * `scripts/proof-computed-real-dom.mjs`).
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bench, describe } from "vitest";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

// The known geometry the page lays out (must match computed-scene.html + the
// page viewport set below).
const VIEWPORT = { width: 1280, height: 768 };
// Tolerance in px: sub-pixel rounding across the layout engine.
const PX_TOLERANCE = 1.5;

/** Resolve Chromium the way playwright.bench.ts / the occlusion gate do. */
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
    const req = createRequire(path.join(REPO, "package.json"));
    return {
        kf: path.join(REPO, "dist"),
        value: path.dirname(req.resolve("@mkbabb/value.js")),
        parseThat: path.dirname(req.resolve("@mkbabb/parse-that")),
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

function send(
    res: http.ServerResponse,
    code: number,
    type: string,
    body: string | Buffer,
) {
    res.writeHead(code, { "content-type": type });
    res.end(body);
}

/** Serve the scene page + the three dist trees under prefix roots. */
async function serve() {
    const roots = distRoots();
    const sceneHtml = fs.readFileSync(
        path.join(HERE, "computed-scene.html"),
        "utf8",
    );

    const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        const p = decodeURIComponent(url.pathname);

        if (p === "/" || p === "/computed-scene.html") {
            send(res, 200, "text/html", sceneHtml);
            return;
        }

        const route: [string, string][] = [
            ["/kf/", roots.kf],
            ["/value/", roots.value],
            ["/parse-that/", roots.parseThat],
        ];
        for (const [prefix, dir] of route) {
            if (p.startsWith(prefix)) {
                let file = path.join(dir, p.slice(prefix.length));
                // S.A0(4) — extensionless-`.js` fallback: importmap prefix
                // substitution yields `/value/subpaths/math` (no extension) for
                // `@mkbabb/value.js/math`; serve `subpaths/math.js`.
                if (
                    file.startsWith(dir) &&
                    !fs.existsSync(file) &&
                    fs.existsSync(file + ".js")
                ) {
                    file += ".js";
                }
                if (
                    file.startsWith(dir) &&
                    fs.existsSync(file) &&
                    fs.statSync(file).isFile()
                ) {
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

interface ComputedRow {
    id: string;
    to: string;
    mode: "c5" | "witness";
    expected: number;
    resolved: number;
}

/**
 * Run the gate. Returns nothing on success; throws on any violation so the
 * `bench()` body (and the `proof:computed-real-dom` launcher) reddens.
 */
export async function runComputedGate() {
    const chromium = resolveChromium();
    if (!chromium) {
        const msg =
            "computed-real-dom — SKIP: playwright not resolvable " +
            "(set KF_PLAYWRIGHT_DIR or install @playwright/test).";
        if (process.env.KF_REQUIRE_BROWSER)
            throw new Error(msg.replace("SKIP", "FAIL"));
        console.warn(msg);
        return;
    }
    if (!fs.existsSync(path.join(REPO, "dist/keyframes.js"))) {
        throw new Error(
            "computed-real-dom — FAIL: dist/keyframes.js not built (the lead runs `npm run build:lib`).",
        );
    }

    const { server, port } = await serve();
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: VIEWPORT });
        await page.goto(`http://127.0.0.1:${port}/computed-scene.html`, {
            waitUntil: "load",
        });
        await page.waitForFunction(
            () => (window as any).__kfComputedDone === true,
            { timeout: 30_000 },
        );

        const err = await page.evaluate(() => (window as any).__kfComputedError);
        if (err) {
            throw new Error(`computed-real-dom — FAIL: scene errored:\n${err}`);
        }

        const rows = (await page.evaluate(
            () => (window as any).__kfComputed ?? null,
        )) as ComputedRow[] | null;
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error(
                "computed-real-dom — FAIL: window.__kfComputed was not populated — the scene did not resolve any computed unit.",
            );
        }

        const violations: string[] = [];
        let c5Count = 0;
        for (const r of rows) {
            const delta = Math.abs(r.resolved - r.expected);
            if (r.mode === "c5") {
                // The C5 surface: each viewport/container unit MUST resolve to
                // its expected px on the genuine layout path.
                c5Count += 1;
                const okRow = delta <= PX_TOLERANCE;
                console.log(
                    `  ${okRow ? "✓" : "✗"} [c5] ${r.id} (${r.to}) — resolved ${r.resolved.toFixed(
                        2,
                    )}px, expected ${r.expected.toFixed(2)}px (Δ ${delta.toFixed(2)}px)`,
                );
                if (!okRow) {
                    violations.push(
                        `${r.id} (${r.to}) resolved ${r.resolved.toFixed(2)}px, ` +
                            `expected ${r.expected.toFixed(2)}px (Δ ${delta.toFixed(2)}px > ${PX_TOLERANCE}px)`,
                    );
                }
            } else {
                // The `calc()` witness: the engine's `getComputedValue` resolves
                // a calc leaf to NaN→0 even on a real browser (a SEPARATE
                // value.js/engine computed-value FINDING, NOT the C5 surface).
                // The witness is GREEN while the gap stands (resolved ≈ 0, far
                // from `expected`) and BITES the moment calc starts resolving to
                // the geometry — the consume signal forcing this row's promotion
                // to a `c5` assert. (Symmetric to the W15 it.fails witness.)
                const calcResolves = delta <= PX_TOLERANCE;
                console.log(
                    `  ${calcResolves ? "✗" : "✓"} [witness] ${r.id} (${r.to}) — ` +
                        `resolved ${r.resolved.toFixed(2)}px (the calc gap stands; ` +
                        `would be ${r.expected.toFixed(2)}px if closed)`,
                );
                if (calcResolves) {
                    violations.push(
                        `${r.id} (${r.to}) NOW resolves to ${r.resolved.toFixed(2)}px ` +
                            `— the calc computed-value gap is CLOSED; promote this row ` +
                            `from a witness to a c5 assert (the consume signal).`,
                    );
                }
            }
        }

        if (c5Count === 0) {
            throw new Error(
                "computed-real-dom — FAIL: no c5 row was exercised — the C5 corpus is empty.",
            );
        }
        if (violations.length > 0) {
            throw new Error(
                "computed-real-dom — FAIL: the genuine-path computed-unit corpus did not " +
                    "hold:\n  " +
                    violations.join("\n  ") +
                    "\n\n  A c5 violation means the re-pin's C5 fix regressed (the unit " +
                    "froze at the un-resolved value / dropped to a bare number); a witness " +
                    "violation means the calc computed-value gap is now closed (promote it).",
            );
        }
        console.log(
            `computed-real-dom — PASS: ${c5Count} C5 viewport/container unit(s) ` +
                `(50dvh, 100cqw, var(--x)) resolved to the expected px on the genuine ` +
                `layout path (the C5 fix holds); the calc() computed-value gap is ` +
                `witnessed (a value.js/engine FINDING, not the C5 surface).`,
        );
    } finally {
        await browser.close();
        server.close();
    }
}

// vitest's `bench` runner is the run surface (`npm run bench`); the gate is an
// assertion, not a throughput measurement, so it runs ONCE and throws on a
// violation. Under the default jsdom env it self-skips via the chromium guard,
// so `npm test` stays green; the real run is `KF_PLAYWRIGHT_DIR=… npm run bench`.
describe("G.W16 S2 — the real-DOM computed-unit corpus (the C5 genuine-path proof)", () => {
    bench(
        "50dvh / calc(50%+10px) / 100cqw / var(--x) resolve on the real layout path",
        async () => {
            await runComputedGate();
        },
        { iterations: 1, warmupIterations: 0, time: 0, warmupTime: 0 },
    );
});
