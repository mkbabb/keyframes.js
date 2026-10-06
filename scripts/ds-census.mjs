#!/usr/bin/env node
/**
 * ds-census — the X-DS LIGHTING CENSUS (value.js docs/tranches/X/waves/X-DS.md,
 * COHESION §0ej). It counts the lighting the flat canon forbids, in two halves:
 *
 *   static   — the demo's own CSS (demo/**\/*.css) and Vue <style> blocks plus
 *              the Tailwind lighting utilities in Vue templates: box-shadow
 *              declarations and their layers, inset highlight layers,
 *              text-shadow, filter / backdrop-filter drop-shadow and blur,
 *              gradient fills, @keyframes and looping (`infinite`) animations.
 *   computed — the served pages (default http://localhost:5173, the dev
 *              server) in HEADLESS real Chrome (§0ei: channel "chrome",
 *              headless true; never a visible window), every route at light
 *              and dark: the same families read off getComputedStyle, split
 *              into a `chrome` bucket (UI) and a `subject` bucket (the demo's
 *              own animated object: the cube, a [data-subject] figure, canvas),
 *              plus every running infinite animation by bucket.
 *
 * The census reports; the `allowance` block applies the canon (at most one
 * quiet neutral shadow layer, only on a truly floating surface; zero
 * text-shadow, drop-shadow/blur, control gradients, inset highlights and
 * looping animations on chrome) and prints RED or GREEN. A glass-owned
 * excess still counts: glass lighting is never overridden locally (O-87).
 *
 * Usage:
 *   node scripts/ds-census.mjs                 static + computed, JSON on stdout
 *   node scripts/ds-census.mjs --static        static half only (no browser)
 *   node scripts/ds-census.mjs --out f.json    also write the JSON to a file
 *   node scripts/ds-census.mjs --base URL --widths 1440,390
 *   node scripts/ds-census.mjs --routes home   (a historical one-page build)
 *   node scripts/ds-census.mjs --frames DIR    also save one frame per page
 *                                              (<route>-<width>-<scheme>.png)
 *   node scripts/ds-census.mjs --settle 6000   per-page settle in ms (default
 *                                              2200; raise it on a loaded host)
 *   KF_PLAYWRIGHT_DIR=/path                    where to resolve playwright from
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, dflt) => {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};

const BASE = opt("--base", "http://localhost:5173/");
const WIDTHS = opt("--widths", "1440").split(",").map(Number);
const OUT = opt("--out", null);
const FRAMES = opt("--frames", null);
// The per-page settle before the read (ms). The default suits an idle machine;
// under load a route transition can still be cross-fading at 2.2 s, which
// double-counts two routes in one page.
const SETTLE = Number(opt("--settle", "2200"));
const ROUTES = opt("--routes", "home,cube,amiga,square,easing,spring,sequence")
    .split(",")
    .map((r) => (r === "home" ? "" : r));

// ── static half ──────────────────────────────────────────────────────────────

function walk(dir, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p, out);
        else if (/\.(css|vue)$/.test(ent.name)) out.push(p);
    }
    return out;
}

/** Split a CSS value on top-level commas (not inside parentheses). */
function layers(value) {
    const out = [];
    let depth = 0;
    let cur = "";
    for (const ch of value) {
        if (ch === "(") depth++;
        if (ch === ")") depth--;
        if (ch === "," && depth === 0) {
            out.push(cur.trim());
            cur = "";
        } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

/** Replace comments with spaces, keeping newlines so line numbers survive. */
const blankComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

const LIGHT_INK =
    /white|#fff\b|#ffffff\b|255\s*,\s*255\s*,\s*255|255 255 255|0% 100%|--specular|--glass-(rim|edge)|catch-light|--highlight/i;
const isInsetHighlight = (layer) => /\binset\b/.test(layer) && LIGHT_INK.test(layer);

const TW_LIGHTING =
    /^(?:[a-z0-9-]+:)*(?:shadow(?:-(?!none\b)[^\s]+)?|drop-shadow(?:-[^\s]+)?|blur(?:-[^\s]+)?|backdrop-blur(?:-[^\s]+)?|bg-gradient-[^\s]+|bg-linear-[^\s]+|bg-radial(?:-[^\s]+)?|bg-conic(?:-[^\s]+)?|text-shadow(?:-[^\s]+)?|animate-(?:spin|ping|pulse|bounce)[^\s]*)$/;

function staticCensus() {
    const files = walk(path.join(REPO, "demo"));
    const tally = {
        files: files.length,
        boxShadowDecls: 0,
        boxShadowLayers: 0,
        boxShadowTokenRefs: 0,
        insetHighlightLayers: 0,
        textShadowDecls: 0,
        filterDropShadow: 0,
        filterBlur: 0,
        backdropBlur: 0,
        gradientFills: 0,
        keyframes: 0,
        loopingAnimations: 0,
        shadowTokenDefs: 0,
        twLightingClasses: 0,
    };
    const hits = [];
    const hit = (kind, file, src, idx, text) =>
        hits.push({
            kind,
            at: `${path.relative(REPO, file)}:${lineOf(src, idx)}`,
            text: text.replace(/\s+/g, " ").slice(0, 140),
        });

    for (const file of files) {
        const raw = fs.readFileSync(file, "utf8");
        const src = blankComments(raw);
        // Vue: only <style> blocks are CSS; the template is scanned for classes.
        const cssRegions = [];
        if (file.endsWith(".vue")) {
            for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))
                cssRegions.push({ start: m.index + m[0].indexOf(m[1]), text: m[1] });
            const tpl = src.match(/<template>([\s\S]*)<\/template>/);
            if (tpl) {
                const off = tpl.index + tpl[0].indexOf(tpl[1]);
                const body = tpl[1].replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
                for (const m of body.matchAll(/class\s*=\s*"([^"]*)"|'([^'\n]*)'/g)) {
                    const cls = (m[1] ?? m[2] ?? "").split(/\s+/).filter((c) => TW_LIGHTING.test(c));
                    for (const c of cls) {
                        tally.twLightingClasses++;
                        hit("tw-class", file, src, off + m.index, c);
                    }
                }
            }
        } else cssRegions.push({ start: 0, text: src });

        for (const { start, text } of cssRegions) {
            for (const m of text.matchAll(/@keyframes\s+([\w-]+)/g)) {
                tally.keyframes++;
                hit("keyframes", file, src, start + m.index, m[0]);
            }
            const decl =
                /(?<![\w-])(--[\w-]*shadow[\w-]*|box-shadow|text-shadow|filter|backdrop-filter|-webkit-backdrop-filter|background-image|background|animation|animation-iteration-count)\s*:\s*([^;{}]+)/g;
            for (const m of text.matchAll(decl)) {
                const [, prop, value] = m;
                const at = start + m.index;
                const v = value.trim();
                if (prop.startsWith("--")) {
                    if (/\d+px/.test(v) || /\binset\b/.test(v)) {
                        tally.shadowTokenDefs++;
                        hit("shadow-token-def", file, src, at, `${prop}: ${v}`);
                    }
                    continue;
                }
                if (prop === "box-shadow") {
                    if (v === "none" || v === "inherit" || v === "unset") continue;
                    tally.boxShadowDecls++;
                    const ls = layers(v);
                    if (ls.length === 1 && /^var\(/.test(ls[0])) tally.boxShadowTokenRefs++;
                    else tally.boxShadowLayers += ls.length;
                    tally.insetHighlightLayers += ls.filter(isInsetHighlight).length;
                    hit("box-shadow", file, src, at, `${ls.length} layer(s): ${v}`);
                } else if (prop === "text-shadow") {
                    if (v === "none") continue;
                    tally.textShadowDecls++;
                    hit("text-shadow", file, src, at, v);
                } else if (prop.endsWith("filter")) {
                    if (/drop-shadow\(/.test(v)) {
                        tally.filterDropShadow++;
                        hit("drop-shadow", file, src, at, `${prop}: ${v}`);
                    }
                    if (/blur\(/.test(v) || /--glass-blur/.test(v)) {
                        if (prop === "filter") tally.filterBlur++;
                        else tally.backdropBlur++;
                        hit(prop === "filter" ? "filter-blur" : "backdrop-blur", file, src, at, `${prop}: ${v}`);
                    }
                } else if (prop.startsWith("background")) {
                    if (/(linear|radial|conic)-gradient\(/.test(v)) {
                        tally.gradientFills++;
                        hit("gradient", file, src, at, v);
                    }
                } else if (/\binfinite\b/.test(v)) {
                    tally.loopingAnimations++;
                    hit("looping-animation", file, src, at, `${prop}: ${v}`);
                }
            }
        }
    }
    return { tally, hits };
}

// ── computed half ────────────────────────────────────────────────────────────

function resolveChromium() {
    const roots = [
        process.env.KF_PLAYWRIGHT_DIR,
        REPO,
        path.resolve(REPO, "../value.js"),
    ].filter(Boolean);
    for (const root of roots) {
        const req = createRequire(path.join(root, "package.json"));
        for (const pkg of ["playwright", "playwright-core", "@playwright/test"]) {
            try {
                return req(pkg).chromium;
            } catch {
                /* next */
            }
        }
    }
    return null;
}

/** Runs in the page: the per-route computed census. */
function pageCensus() {
    // Third-party content painted inside chrome (Monaco's indent guides are
    // 1px box-shadow rules) is not the app's lighting: skipped, not counted.
    const FOREIGN = ".monaco-editor";
    // Identity the canon keeps (§0dm): the rainbow play CTA is the ORIGIN's one
    // gradient control (AnimationControlsGroup.vue:100 at 1acf25c6).
    const IDENTITY = ".rainbow-vivid, .rainbow-pastel";
    const SUBJECT = ".cube, .graph, [data-subject], canvas, .hero-aurora, [data-scene-subject]";
    const FLOATING =
        "[role=menu], [role=dialog], [role=alertdialog], [role=listbox], [role=tooltip], [data-reka-popper-content-wrapper] > *, [data-sonner-toast], [data-floating]";
    const CONTROL =
        "button, [role=button], [role=slider], [role=tab], [role=switch], [role=checkbox], [role=menuitem], [role=option], input, select, textarea, a[href]";
    const split = (v) => {
        const out = [];
        let d = 0;
        let c = "";
        for (const ch of v) {
            if (ch === "(") d++;
            if (ch === ")") d--;
            if (ch === "," && d === 0) {
                out.push(c.trim());
                c = "";
            } else c += ch;
        }
        if (c.trim()) out.push(c.trim());
        return out;
    };
    const visibleLayer = (l) => {
        // Drop zero-size and fully transparent layers (Tailwind's ring stack).
        const alpha = l.match(/rgba?\([^)]*?,\s*([\d.]+)\)/);
        if (alpha && Number(alpha[1]) === 0) return false;
        if (/rgba?\(0,\s*0,\s*0,\s*0\)/.test(l)) return false;
        const nums = (l.replace(/rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)/g, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat);
        return nums.some((n) => n !== 0);
    };
    const lightInk = (l) => {
        const m = l.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
        if (m) return Number(m[1]) > 200 && Number(m[2]) > 200 && Number(m[3]) > 200;
        const c = l.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
        if (c) return Number(c[1]) > 0.8 && Number(c[2]) > 0.8 && Number(c[3]) > 0.8;
        const k = l.match(/oklch\(([\d.]+)/);
        return k ? Number(k[1]) > 0.85 : false;
    };
    const label = (el) => {
        const id = el.id ? `#${el.id}` : "";
        const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
        return `${el.tagName.toLowerCase()}${id}${cls ? "." + cls : ""}`.slice(0, 90);
    };
    const r = {
        chrome: { shadowEls: 0, shadowLayers: 0, maxLayers: 0, nonFloatingShadowEls: 0, insetHighlights: 0, textShadow: 0, dropShadow: 0, filterBlur: 0, backdropBlur: 0, controlGradients: 0, loopingAnimations: 0 },
        subject: { shadowEls: 0, shadowLayers: 0, maxLayers: 0, nonFloatingShadowEls: 0, insetHighlights: 0, textShadow: 0, dropShadow: 0, filterBlur: 0, backdropBlur: 0, controlGradients: 0, loopingAnimations: 0, gradientFills: 0 },
        identityGradients: 0,
        offenders: [],
    };
    const offend = (bucket, kind, el, detail) => {
        if (r.offenders.length < 60) r.offenders.push({ bucket, kind, el: label(el), detail: String(detail).slice(0, 160) });
    };
    for (const el of document.querySelectorAll("body *")) {
        if (el.closest(FOREIGN)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
        const bucket = el.closest(SUBJECT) ? "subject" : "chrome";
        const b = r[bucket];
        if (cs.boxShadow !== "none") {
            const ls = split(cs.boxShadow).filter(visibleLayer);
            if (ls.length) {
                b.shadowEls++;
                b.shadowLayers += ls.length;
                b.maxLayers = Math.max(b.maxLayers, ls.length);
                const floating = el.matches(FLOATING) || !!el.closest(FLOATING);
                if (!floating) b.nonFloatingShadowEls++;
                const inset = ls.filter((l) => /\binset\b/.test(l) && lightInk(l)).length;
                b.insetHighlights += inset;
                if (ls.length > 1 || !floating || inset) offend(bucket, `box-shadow×${ls.length}${floating ? " (floating)" : ""}`, el, ls.join(" | "));
            }
        }
        if (cs.textShadow !== "none") {
            b.textShadow++;
            offend(bucket, "text-shadow", el, cs.textShadow);
        }
        if (cs.filter !== "none") {
            if (/drop-shadow/.test(cs.filter)) {
                b.dropShadow++;
                offend(bucket, "drop-shadow", el, cs.filter);
            }
            if (/blur\(/.test(cs.filter)) {
                b.filterBlur++;
                offend(bucket, "filter-blur", el, cs.filter);
            }
        }
        const bf = cs.backdropFilter || cs.webkitBackdropFilter;
        if (bf && bf !== "none" && /blur\(/.test(bf)) b.backdropBlur++;
        if (/gradient\(/.test(cs.backgroundImage)) {
            if (el.matches(IDENTITY)) r.identityGradients++;
            else if (el.matches(CONTROL) || el.closest(CONTROL)) {
                b.controlGradients++;
                offend(bucket, "control-gradient", el, cs.backgroundImage);
            } else if (bucket === "subject") b.gradientFills++;
        }
    }
    for (const a of document.getAnimations()) {
        const t = a.effect?.getComputedTiming?.();
        const target = a.effect?.target;
        if (!t || t.iterations !== Infinity || !target || a.playState !== "running") continue;
        const el = target.nodeType === 1 ? target : target.parentElement;
        if (!el || el.closest(FOREIGN)) continue;
        const bucket = el.closest(SUBJECT) ? "subject" : "chrome";
        r[bucket].loopingAnimations++;
        offend(bucket, "looping-animation", el, a.animationName ?? a.id ?? "waapi");
    }
    return r;
}

async function computedCensus() {
    const chromium = resolveChromium();
    if (!chromium) throw new Error("playwright not resolvable (set KF_PLAYWRIGHT_DIR)");
    // §0ei: the real Chrome binary, new-headless, never a visible window.
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const pages = [];
    try {
        for (const width of WIDTHS)
            for (const scheme of ["light", "dark"]) {
                const ctx = await browser.newContext({
                    viewport: { width, height: width < 600 ? 844 : 900 },
                    colorScheme: scheme,
                });
                const page = await ctx.newPage();
                for (const route of ROUTES) {
                    const url = new URL(`#/${route}`, BASE).toString();
                    await page.goto(url, { waitUntil: "load" });
                    await page.waitForTimeout(SETTLE);
                    const r = await page.evaluate(pageCensus);
                    if (FRAMES) {
                        fs.mkdirSync(FRAMES, { recursive: true });
                        await page.screenshot({
                            path: path.join(FRAMES, `${route || "home"}-${width}-${scheme}.png`),
                        });
                    }
                    pages.push({ route: route || "home", scheme, width, ...r });
                }
                await ctx.close();
            }
    } finally {
        await browser.close();
    }
    const sum = (bucket) => {
        const acc = {};
        for (const p of pages)
            for (const [k, v] of Object.entries(p[bucket]))
                acc[k] = k === "maxLayers" ? Math.max(acc[k] ?? 0, v) : (acc[k] ?? 0) + v;
        return acc;
    };
    return { base: BASE, widths: WIDTHS, totals: { chrome: sum("chrome"), subject: sum("subject") }, pages };
}

// ── the canon's allowance ────────────────────────────────────────────────────

function allowance(st, comp) {
    const checks = {
        "static: no inset highlight layers": st.tally.insetHighlightLayers === 0,
        "static: no text-shadow": st.tally.textShadowDecls === 0,
        "static: no drop-shadow filters": st.tally.filterDropShadow === 0,
        "static: no looping animations": st.tally.loopingAnimations === 0,
    };
    if (comp) {
        const c = comp.totals.chrome;
        Object.assign(checks, {
            "chrome: ≤1 shadow layer per element": c.maxLayers <= 1,
            "chrome: shadows only on floating surfaces": c.nonFloatingShadowEls === 0,
            "chrome: no inset highlights": c.insetHighlights === 0,
            "chrome: no text-shadow": c.textShadow === 0,
            "chrome: no drop-shadow / filter blur": c.dropShadow + c.filterBlur === 0,
            "chrome: no control gradients": c.controlGradients === 0,
            "chrome: no looping animations": c.loopingAnimations === 0,
            "subject: no shadow / text-shadow / drop-shadow": comp.totals.subject.shadowEls + comp.totals.subject.textShadow + comp.totals.subject.dropShadow === 0,
        });
    }
    const verdict = Object.values(checks).every(Boolean) ? "GREEN" : "RED";
    return { verdict, checks };
}

const st = staticCensus();
const comp = flag("--static") ? null : await computedCensus();
const result = {
    tool: "ds-census",
    app: "keyframes.js",
    at: new Date().toISOString(),
    static: st,
    computed: comp,
    allowance: allowance(st, comp),
};
const json = JSON.stringify(result, null, 2);
if (OUT) fs.writeFileSync(OUT, json + "\n");
process.stdout.write(json + "\n");
