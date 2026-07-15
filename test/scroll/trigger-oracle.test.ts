/**
 * test/scroll/trigger-oracle.test.ts — the S.F4 BORN-RED browser-actuated
 * oracle (the wave's T8 hard gate skeleton). It bundles the REAL kf trigger
 * driver (`src/animation/scroll/trigger.ts`, value.js-free) into a real Chromium
 * page and drives the parsed `animation-trigger` grammar THROUGH the JS driver,
 * asserting the observed idle→active→done transitions VIA THE BROWSER.
 *
 * WHY BROWSER-HARNESS (load-bearing): the native/fallback split turns on
 * `CSS.supports("animation-trigger", …)`. jsdom's `CSS.supports` does NOT know
 * `animation-trigger`, so the feature-detect that chooses native-vs-kf is
 * structurally INVISIBLE in jsdom — a jsdom slot could only assert the kf state
 * machine (which the fast half in `scroll-scene.test.ts` already covers), never
 * that the driver's dispatch verdict MATCHES a real browser's platform support.
 * A jsdom slot would be a FALSE green (and would correctly RED under S.A4's
 * symmetric mis-tier clause). This gate ACTUATES a real Chromium: it runs the
 * driver in the page AND reconciles its `supportsNativeTrigger()` against the
 * browser's own `CSS.supports` — feature-detected, never UA-sniffed (r5 / CE-1.0).
 *
 * The grammar is PARSED in node (vitest carries value.js); the parsed typed
 * `AnimationTriggerValue` (a JSON object) is handed to the value.js-free driver
 * running IN the page — the honest grammar(value.js)→behavior(kf driver) round-
 * trip, with the browser as the actuator. SCRUB-BASED: the assertions are the
 * STATE SEQUENCE a scroll position crosses, never a frame/ms threshold (C-10).
 *
 * Skips (does not fail) when playwright-core is unresolvable or the driver bundle
 * cannot be produced, so the default `vitest run` stays green in a browserless
 * env; browser CI runs this file through `demo:correctness` under
 * KF_PLAYWRIGHT_DIR.
 */
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseScrollCSS } from "../../src/animation/scroll";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Resolve playwright-core's chromium via glass-ui's install (KF_PLAYWRIGHT_DIR). */
function resolveChromium(): any {
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

const chromium = resolveChromium();

/**
 * Bundle a value.js-free, self-contained ESM of the trigger driver off the
 * source (the SAME rolldown mechanism `proof:boundary` / the split-a11y oracle
 * use). `trigger.ts` references the value.js grammar TYPES only (erased), so the
 * bundle carries NO `@mkbabb/value.js` specifier and loads as a raw browser
 * module — the real driver source, run in-browser.
 */
async function bundleDriver(): Promise<string | null> {
    let rolldown: any;
    try {
        ({ rolldown } = await import("rolldown"));
    } catch {
        return null;
    }
    const entry = path.join(REPO, ".trigger-driver-entry.mjs");
    const { writeFileSync, rmSync } = await import("node:fs");
    writeFileSync(
        entry,
        `export { TriggerScene, createTriggerScene, supportsNativeTrigger } from ${JSON.stringify(
            path.join(REPO, "src/animation/scroll/trigger"),
        )};\n`,
    );
    try {
        const bundle = await rolldown({
            input: entry,
            treeshake: true,
            logLevel: "silent",
        });
        const { output } = await bundle.generate({ format: "es" });
        await bundle.close();
        return output[0].code as string;
    } finally {
        rmSync(entry, { force: true });
    }
}

let DRIVER_BUNDLE = "";

/** The harness page: imports the isolated driver bundle, exposes it on window. */
const harnessHTML = () => `<!doctype html><html><head><meta charset="utf-8">
</head><body>
    <script type="module">
        import { TriggerScene, createTriggerScene, supportsNativeTrigger } from "/trigger-driver.js";
        window.kfTrigger = { TriggerScene, createTriggerScene, supportsNativeTrigger };
        window.dispatchEvent(new Event("kf-ready"));
    </script>
</body></html>`;

/** A tiny same-origin static server: `/` → harness, `/trigger-driver.js` → bundle. */
function serve(): Promise<{ url: string; close: () => Promise<void> }> {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url ?? "/", "http://x").pathname;
            if (url === "/trigger-driver.js") {
                res.writeHead(200, {
                    "content-type": "text/javascript; charset=utf-8",
                });
                res.end(DRIVER_BUNDLE);
                return;
            }
            if (url === "/" || url === "/index.html") {
                res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
                res.end(harnessHTML());
                return;
            }
            res.writeHead(404).end();
        });
        server.listen(0, "127.0.0.1", () => {
            const { port } = server.address() as { port: number };
            resolve({
                url: `http://127.0.0.1:${port}`,
                close: () => new Promise((r) => server.close(() => r())),
            });
        });
    });
}

const bundle = await bundleDriver();

/**
 * Drive one parsed trigger through the IN-BROWSER driver across a scroll-position
 * script, returning the observed state sequence (+ direction/cycles per step).
 * The trigger is parsed in NODE (value.js) and passed as JSON — grammar→behavior.
 */
type Probe = { state: string; direction: string; cycles: number };

describe.skipIf(!chromium || !bundle)(
    "S.F4 animation-trigger — grammar→behavior browser oracle",
    () => {
        let browser: any;
        let base: string;
        let stop: () => Promise<void>;

        beforeAll(async () => {
            DRIVER_BUNDLE = bundle ?? "";
            browser = await chromium.launch();
            const s = await serve();
            base = s.url;
            stop = s.close;
        }, 30000);
        afterAll(async () => {
            await browser?.close();
            await stop?.();
        });

        /** Parse a trigger stylesheet in node, drive it in-browser over `positions`. */
        async function driveInBrowser(
            css: string,
            positions: number[],
        ): Promise<{ trigger: unknown; probes: Probe[]; nativeParity: boolean }> {
            const opts = parseScrollCSS(css);
            const page = await browser.newPage();
            try {
                await page.goto(`${base}/`, { waitUntil: "load" });
                await page.waitForFunction("!!window.kfTrigger");
                return await page.evaluate(
                    ({ trigger, positions }: any) => {
                        const kf = (window as any).kfTrigger;
                        const scene = kf.createTriggerScene(trigger);
                        const probes = positions.map((p: number) => {
                            scene.triggerProgress(p);
                            return {
                                state: scene.state,
                                direction: scene.direction,
                                cycles: scene.cycles,
                            };
                        });
                        // Feature-detect parity: the driver's verdict MUST equal
                        // the browser's own CSS.supports probe (never a UA sniff).
                        const browserNative =
                            (window as any).CSS?.supports?.(
                                "animation-trigger-behavior",
                                "once",
                            ) ||
                            (window as any).CSS?.supports?.(
                                "animation-trigger",
                                "once",
                            ) ||
                            false;
                        const nativeParity =
                            kf.supportsNativeTrigger() === !!browserNative;
                        return { trigger, probes, nativeParity };
                    },
                    { trigger: opts.trigger, positions },
                );
            } finally {
                await page.close();
            }
        }

        it("`once`: the parsed grammar drives idle→active→done IN THE BROWSER (+ latch)", async () => {
            // contain 0% contain 100% → the trigger range resolves to [0.375,0.625]
            // (interior), so idle/active/done are all observable via scrub.
            const { trigger, probes, nativeParity } = await driveInBrowser(
                `.card { animation-timeline: view();
                         animation-trigger: once view() contain 0% contain 100%; }`,
                [0.1, 0.5, 0.9, 0.5], // before, inside, past, re-enter
            );
            expect((trigger as any).type).toBe("once");
            // THE HARD ASSERTION — the observed lifecycle IN THE BROWSER.
            expect(probes.map((p) => p.state)).toEqual([
                "idle",
                "active",
                "done",
                "done", // one-shot LATCH — a re-entry does not re-fire
            ]);
            expect(probes[1]!.cycles).toBe(1);
            expect(probes[3]!.cycles).toBe(1);
            // The native/fallback split is feature-detected, not UA-sniffed.
            expect(nativeParity).toBe(true);
        }, 30000);

        it("`repeat`: RE-FIRES in the browser — idle→active→idle→active (never latches)", async () => {
            const { trigger, probes, nativeParity } = await driveInBrowser(
                `.card { animation-timeline: view();
                         animation-trigger: repeat view() contain 0% contain 100%; }`,
                [0.1, 0.5, 0.9, 0.5, 0.9], // in/out/in/out
            );
            expect((trigger as any).type).toBe("repeat");
            expect(probes.map((p) => p.state)).toEqual([
                "idle",
                "active",
                "idle", // RESET on exit (not `done`)
                "active", // re-enter → re-fires
                "idle",
            ]);
            expect(probes[3]!.cycles).toBe(2); // the second firing
            expect(nativeParity).toBe(true);
        }, 30000);

        it("`alternate`: the backward semantics — direction FLIPS each entry in the browser", async () => {
            const { trigger, probes } = await driveInBrowser(
                `.card { animation-timeline: view();
                         animation-trigger: alternate view() contain 0% contain 100%; }`,
                [0.5, 0.9, 0.5, 0.9, 0.5], // enter/exit ×2 + a third enter
            );
            expect((trigger as any).type).toBe("alternate");
            expect(probes[0]!.direction).toBe("forward"); // cycle 1
            expect(probes[2]!.direction).toBe("backward"); // cycle 2 FLIPPED
            expect(probes[4]!.direction).toBe("forward"); // cycle 3 flipped back
            expect(probes.map((p) => p.state)).toEqual([
                "active",
                "done",
                "active",
                "done",
                "active",
            ]);
        }, 30000);

        it("the native `animation-trigger` declaration is browser-parsed honestly (fallback proven required)", async () => {
            // Feature-detect the platform's real support AND confirm the driver
            // is the REALIZED behavior when native is absent (current Chromium).
            // Where native ships (Chrome 145+), the parity holds AND the driver
            // stays a valid universal fallback — the split is honest either way.
            const page = await browser.newPage();
            try {
                await page.goto(`${base}/`, { waitUntil: "load" });
                await page.waitForFunction("!!window.kfTrigger");
                const verdict = await page.evaluate(() => {
                    const kf = (window as any).kfTrigger;
                    const css = (window as any).CSS;
                    const browserNative =
                        css?.supports?.("animation-trigger-behavior", "once") ||
                        css?.supports?.("animation-trigger", "once") ||
                        false;
                    // The driver's dispatch verdict == the platform's real support.
                    const driverNative = kf.supportsNativeTrigger();
                    // With native ABSENT, the kf driver MUST still produce the
                    // lifecycle (the fallback is not a no-op).
                    const scene = kf.createTriggerScene({
                        type: "once",
                        range: { start: { offset: "20%" }, end: { offset: "80%" } },
                    });
                    const seq = [0.1, 0.5, 0.9].map((p) => {
                        scene.triggerProgress(p);
                        return scene.state;
                    });
                    return { browserNative: !!browserNative, driverNative, seq };
                });
                expect(verdict.driverNative).toBe(verdict.browserNative); // parity
                // The kf driver realizes the lifecycle regardless of native support.
                expect(verdict.seq).toEqual(["idle", "active", "done"]);
            } finally {
                await page.close();
            }
        }, 30000);
    },
);
