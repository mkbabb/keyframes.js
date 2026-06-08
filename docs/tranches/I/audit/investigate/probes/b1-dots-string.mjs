#!/usr/bin/env node
/** INV PROBE — B1: capture the EXACT dot-string at() returns when --rotationX is
 *  unset, and the exact CSS string handed to formatCSS (the parseState input). */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEV = process.env.KF_DEV_BASE ?? "http://localhost:5174";
const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? path.resolve(HERE, "../../../../../.."), "package.json"));
const { chromium } = requireFrom("playwright-core");
const log = [];
const record = (k, t) => { log.push({ k, t }); console.log(`[${k}] ${String(t).slice(0, 1400)}`); };
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on("console", (m) => record(`c.${m.type()}`, m.text()));
page.on("pageerror", (e) => record("pageerror", e.message));
await page.goto(`${DEV}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(3000);
const result = await page.evaluate(async () => {
    const out = {};
    const engine = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/engine.ts");
    const vjs = await import("/@fs/Users/mkbabb/Programming/keyframes.js/node_modules/@mkbabb/value.js/dist/value.js");
    const { CSSKeyframesAnimation } = engine;
    const { ValueUnit, unflattenObjectToString } = vjs;
    const el = document.createElement("div"); document.body.appendChild(el);
    out.computedVarEmpty = JSON.stringify(getComputedStyle(el).getPropertyValue("--rotationX"));
    const rot = new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
        from: { transform: { rotateX: "0deg", rotateY: "0turn", rotateZ: "0deg" } },
        "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), rotateY: "1turn", rotateZ: "360deg" } },
    });
    rot.setTargets(el);
    for (const tf of rot.templateFrames) {
        const prog = tf.start.value / 100;
        try {
            const vars = rot.at(prog, false);
            out[`at_${prog}_raw`] = JSON.stringify(vars).slice(0, 300);
            out[`at_${prog}_ufs`] = JSON.stringify(unflattenObjectToString(vars));
        } catch (e) { out[`at_${prog}_err`] = e.message; }
    }
    el.remove();
    return out;
});
record("RESULT", JSON.stringify(result, null, 2));
await browser.close();
fs.writeFileSync(path.resolve(HERE, "../b1-dots-string.console.json"), JSON.stringify({ log, result }, null, 2));
