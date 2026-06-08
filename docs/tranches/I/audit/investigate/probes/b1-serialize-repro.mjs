#!/usr/bin/env node
/**
 * INV PROBE — B1 root-cause: WHICH animation/value serializes to "......".
 * Navigates the DEV server to /#/cube (the real cube group), waits for the
 * KeyframesStringControls editor to mount, and reads the editor text + reaches
 * into the engine to serialize each cube animation directly, capturing the raw
 * string handed to formatCSS and any throw.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });
const DEV = process.env.KF_DEV_BASE ?? "http://localhost:5174";

const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? path.resolve(HERE, "../../../../../.."), "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const log = [];
const record = (kind, text) => { log.push({ kind, text }); console.log(`[${kind}] ${String(text).slice(0, 900)}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("console", (msg) => record(`console.${msg.type()}`, msg.text()));
page.on("pageerror", (err) => record("pageerror", `${err.message}\n${err.stack ?? ""}`));

// Build the cube animations in-page using the SAME engine modules the demo uses,
// then serialize each — capturing the exact string formatCSS sees + any throw.
await page.goto(`${DEV}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(SHOTS, "b1-serialize-cube.png") });

const result = await page.evaluate(async () => {
    const out = { steps: [] };
    try {
        const engine = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/engine.ts");
        const fmt = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/format.ts");
        const vjs = await import("/@fs/Users/mkbabb/Programming/keyframes.js/node_modules/@mkbabb/value.js/dist/value.js");
        const { CSSKeyframesAnimation } = engine;
        const { ValueUnit } = vjs;

        // Reconstruct the ROTATIONS animation (the one with var(--rotationX)).
        const rot = new CSSKeyframesAnimation({ duration: 1000, timingFunction: "easeInOutCubic" }).fromKeyframes({
            from: { transform: { rotateX: "0deg", rotateY: "0turn", rotateZ: "0deg" } },
            "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), rotateY: "1turn", rotateZ: "360deg" } },
        });
        out.steps.push({ name: "rotations.templateFrames", count: rot.templateFrames.length });
        // Sample at() at each stop — this is what CSSKeyframesToString does (format.ts).
        for (const tf of rot.templateFrames) {
            const prog = tf.start.value / 100;
            try {
                const vars = rot.at(prog, false);
                const ufs = vjs.unflattenObjectToString(vars);
                out.steps.push({ name: `rotations.at(${prog})`, vars: JSON.stringify(ufs).slice(0, 400) });
            } catch (e) { out.steps.push({ name: `rotations.at(${prog}) THREW`, err: e.message }); }
        }
        try {
            const css = await fmt.CSSKeyframesToString(rot, "rot");
            out.rotationsCSS = css.slice(0, 600);
        } catch (e) { out.rotationsErr = e.message; }

        // Reconstruct the MATRIX animation (matrix3d fromVars). Need a FunctionValue
        // matrix3d — build a minimal one via the parser.
        try {
            const m = vjs.parseCSSValueUnit
                ? null
                : null;
            // Build matrix3d via a CSS string the engine accepts.
            const mat = new CSSKeyframesAnimation({ duration: 1000 }).fromVars([
                { transform: { matrix3d: "1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1" } },
                { transform: { matrix3d: "1,0,0,0,0,1,0,0,0,0,1,0,40,0,0,1" } },
            ]);
            for (const tf of mat.templateFrames) {
                const prog = tf.start.value / 100;
                const vars = mat.at(prog, false);
                const ufs = vjs.unflattenObjectToString(vars);
                out.steps.push({ name: `matrix.at(${prog})`, vars: JSON.stringify(ufs).slice(0, 400) });
            }
            const css = await fmt.CSSKeyframesToString(mat, "mat");
            out.matrixCSS = css.slice(0, 600);
        } catch (e) { out.matrixErr = `${e.message}`; }
    } catch (e) {
        out.fatal = `${e.message}\n${e.stack}`;
    }
    return out;
});

record("result", JSON.stringify(result, null, 2));

await browser.close();
const outPath = path.resolve(HERE, "../b1-serialize-repro.console.json");
fs.writeFileSync(outPath, JSON.stringify({ log, result }, null, 2));
console.log(`\nwrote → ${outPath}`);
