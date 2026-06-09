#!/usr/bin/env node
/**
 * INV PROBE — B1: pin the EXACT producer of "......". Hypotheses:
 *  H-A: var(--rotationX) resolved against a target with the var UNSET → empty.
 *  H-B: a matrix3d / rotate3d whose computed components resolve empty.
 *  H-C: the hover animation (animations.hover) serializes to dots.
 * We reconstruct each cube child WITH/WITHOUT the css var + WITHOUT a target,
 * serialize, and report which yields the 6-dot / empty body.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEV = process.env.KF_DEV_BASE ?? "http://localhost:5174";
const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? path.resolve(HERE, "../../../../../.."), "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const log = [];
const record = (k, t) => { log.push({ k, t }); console.log(`[${k}] ${String(t).slice(0, 1200)}`); };

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on("console", (m) => record(`c.${m.type()}`, m.text()));
page.on("pageerror", (e) => record("pageerror", `${e.message}`));

await page.goto(`${DEV}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(3000);

const result = await page.evaluate(async () => {
    const out = {};
    const engine = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/engine.ts");
    const fmt = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/format.ts");
    const anims = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/animations.ts");
    const vjs = await import("/@fs/Users/mkbabb/Programming/keyframes.js/node_modules/@mkbabb/value.js/dist/value.js");
    const { CSSKeyframesAnimation } = engine;
    const { ValueUnit } = vjs;

    const tryCSS = async (label, anim, target) => {
        try {
            if (target !== undefined) anim.setTargets(target);
            const css = await fmt.CSSKeyframesToString(anim, "x");
            const m = css.match(/@keyframes[^]*$/);
            out[label] = { ok: true, body: (m ? m[0] : css).slice(0, 280) };
        } catch (e) { out[label] = { ok: false, err: e.message }; }
    };

    // 1) rotations WITHOUT a target at all (the onMounted-before-setTargets window).
    const rotNoTarget = new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
        from: { transform: { rotateX: "0deg", rotateY: "0turn", rotateZ: "0deg" } },
        "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), rotateY: "1turn", rotateZ: "360deg" } },
    });
    await tryCSS("rot_no_target", rotNoTarget /* no setTargets */);

    // 2) rotations WITH a target that has NO --rotationX defined.
    const elNoVar = document.createElement("div");
    document.body.appendChild(elNoVar);
    const rotEmptyVar = new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
        from: { transform: { rotateX: "0deg", rotateY: "0turn", rotateZ: "0deg" } },
        "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), rotateY: "1turn", rotateZ: "360deg" } },
    });
    await tryCSS("rot_target_no_var", rotEmptyVar, elNoVar);
    elNoVar.remove();

    // 3) the HOVER preset (animations.hover) — the third cube child.
    try {
        const hover = anims.hover ? anims.hover({ duration: 1000 }) : null;
        if (hover) {
            const el = document.createElement("div"); document.body.appendChild(el);
            await tryCSS("hover_preset", hover, el);
            el.remove();
        } else out.hover_preset = { ok: false, err: "anims.hover missing" };
    } catch (e) { out.hover_preset = { ok: false, err: e.message }; }

    // 4) matrix3d fromVars WITHOUT a target.
    const mat = new CSSKeyframesAnimation({ duration: 1000 }).fromVars([
        { transform: { matrix3d: "1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1" } },
        { transform: { matrix3d: "1,0,0,0,0,1,0,0,0,0,1,0,40,0,0,1" } },
    ]);
    await tryCSS("matrix_no_target", mat /* no target */);

    return out;
});

record("RESULT", JSON.stringify(result, null, 2));
await browser.close();
fs.writeFileSync(path.resolve(HERE, "../b1-dots-source.console.json"), JSON.stringify({ log, result }, null, 2));
