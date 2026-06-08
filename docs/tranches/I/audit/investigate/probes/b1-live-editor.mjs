#!/usr/bin/env node
/**
 * INV PROBE — B1: capture the LIVE editor's "......" — open /#/cube, open the
 * controls + Keyframes tab, read the actual editor text + find which animation
 * produced the placeholder. Also patches value.js formatCSS via a console hook:
 * we cannot patch the bundled module, so instead we read the DOM editor content
 * and the toast/placeholder, and serialize the live selected animation by
 * reaching the engine through a re-import + reading the App's exposed group is
 * not possible — so we instrument the placeholder text directly.
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

// Pre-set localStorage so controls open + an animation is selected.
await page.addInitScript(() => {
    try {
        localStorage.setItem("animation-groups-control-options-store", JSON.stringify({ isControlsPanelOpen: true }));
    } catch {}
});

await page.goto(`${DEV}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(3500);
await page.screenshot({ path: path.join(SHOTS, "b1-live-01-cube.png"), fullPage: false });

// Reconstruct the rotations animation WITH a target element so at() resolves the
// var() computed value — this mirrors the live editor exactly and should produce
// the "......".
const result = await page.evaluate(async () => {
    const out = { steps: [] };
    try {
        const engine = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/engine.ts");
        const fmt = await import("/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/format.ts");
        const vjs = await import("/@fs/Users/mkbabb/Programming/keyframes.js/node_modules/@mkbabb/value.js/dist/value.js");
        const { CSSKeyframesAnimation } = engine;
        const { ValueUnit } = vjs;

        const el = document.createElement("div");
        el.style.setProperty("--rotationX", "45deg");
        document.body.appendChild(el);

        const rot = new CSSKeyframesAnimation({ duration: 1000, timingFunction: "easeInOutCubic" }).fromKeyframes({
            from: { transform: { rotateX: "0deg", rotateY: "0turn", rotateZ: "0deg" } },
            "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), rotateY: "1turn", rotateZ: "360deg" } },
        });
        rot.setTargets(el);
        rot.parse?.();

        for (const tf of rot.templateFrames) {
            const prog = tf.start.value / 100;
            try {
                const vars = rot.at(prog, false);
                const ufs = vjs.unflattenObjectToString(vars);
                out.steps.push({ name: `rot.at(${prog})`, ufs: JSON.stringify(ufs) });
            } catch (e) { out.steps.push({ name: `rot.at(${prog}) THREW`, err: e.message }); }
        }
        try {
            out.rotCSS = await fmt.CSSKeyframesToString(rot, "rot");
        } catch (e) { out.rotErr = `${e.message}`; }
        el.remove();
    } catch (e) { out.fatal = `${e.message}\n${e.stack}`; }
    return out;
});

record("result", JSON.stringify(result, null, 2));

// Also dump the actual editor DOM text + placeholder if present.
const editorText = await page.evaluate(() => {
    const mon = document.querySelector(".monaco-editor .view-lines, .cm-content, textarea");
    const t = mon ? (mon.innerText || mon.value || "") : null;
    const placeholder = document.body.innerText.match(/\/\* timing-function: custom[^]*?\*\//);
    return { editorText: t ? t.slice(0, 500) : null, placeholder: placeholder ? placeholder[0] : null };
});
record("editorDOM", JSON.stringify(editorText));

await browser.close();
const outPath = path.resolve(HERE, "../b1-live-editor.console.json");
fs.writeFileSync(outPath, JSON.stringify({ log, result, editorText }, null, 2));
console.log(`\nwrote → ${outPath}`);
