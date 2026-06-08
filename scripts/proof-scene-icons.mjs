#!/usr/bin/env node
/**
 * proof:scene-icons — H.W5 (the themable-coverage + shape + no-raster lock).
 *
 * The D8 root cause: the icon registry was a dock-keyed `Record<string,string>`
 * of imported image URLs mapping ONLY 4 of 9 scenes, rendered via `<img :src>` —
 * theme-blind BY CONSTRUCTION (an `<img>` paints SVG as a replaced element, a
 * separate document that cannot read the host `currentColor`/CSS custom props).
 * Even the one vector easing SVG baked an `hsl(248…)` hue that painted in BOTH
 * light and dark. The fix (H.W5 S1/S2): one themable inline-`<svg>` family on
 * `SceneDescriptor.icon` (`<component :is>`, NOT `<img :src>`), each
 * `fill="none" stroke="currentColor" viewBox="0 0 32 32"`, the 6 PNGs KILLed,
 * the favicon re-pointed to a checked-in vector (BLK-7).
 *
 * STATIC half (always runs) — the file-shape + coverage + no-raster contract:
 *
 *   G1 SHAPE — every `assets/icons/*.svg` (EXCLUDING the allow-listed favicon)
 *      is `fill="none"` + carries ≥1 `stroke="currentColor"` + `viewBox="0 0 32
 *      32"`, with ZERO baked `hsl(`/`rgb(`/`#hex` on ANY stroke OR fill (the
 *      `currentColor` family; endpoint/texture fills are pinned
 *      `fill="currentColor"`, and `opacity`/`stroke-dasharray` are NOT colors).
 *      BITE: re-bake `easing.svg`'s `hsl(248,88%,71%)` → the hue grep reds; drop
 *      the `viewBox` / flip `fill="none"` → the shape clause reds.
 *
 *   G2 COVERAGE — every non-`home` `SceneDescriptor` in `scenes.ts` has a
 *      defined `icon`. Structurally forbids the D8 regression: an icon-less scene
 *      cannot ship (the permanent cure for the regression class — adding a scene
 *      WITHOUT an icon reds). BITE: drop an `icon:` from any non-home descriptor
 *      → coverage reds (born-RED: only 4 of 9 descriptors carried an icon, and
 *      the registry lived in the dock, not the descriptor).
 *
 *   G3 NO-RASTER + FAVICON 404 GUARD (BLK-7) — `assets/icons/` contains ZERO
 *      `.png` modulo the SINGLE allow-listed favicon named in `index.html`'s
 *      `rel=icon`; the allow-list set is EXACTLY that one path; AND `index.html`'s
 *      `rel=icon` href RESOLVES to an existing checked-in file (the 404 guard).
 *      BITE: leave a dock/orphan PNG in `assets/icons/` → no-raster reds; delete
 *      the favicon WITHOUT re-pointing index.html → the resolve clause reds (a
 *      live 404 favicon, the BLK-7 self-contradiction).
 *
 * BROWSER half (KF_REQUIRE_BROWSER) — the THEMING clause, the load-bearing bite
 * the PNG→SVG file-swap alone does NOT make (G4 is the AUTHORITY over the
 * file-shape G1: a file that reads `currentColor` but COMPUTES a baked hue at
 * runtime — an `<img>` reference, an SVGO `convertColors` rewrite — FAILS):
 *
 *   G4 THEMING — a MOUNTED scene icon's computed stroke equals the host
 *      `currentColor` in BOTH `.dark` and light. The dock renders the active
 *      scene's icon as `<component :is="scene.icon" class="… text-muted-
 *      foreground">` → an inline `<svg>` whose `stroke="currentColor"` resolves
 *      to the host `color`. Assert (a) the mounted scene icon is a REAL inline
 *      `<svg>` with a `currentColor`-stroked geometry node — NOT an `<img>` (an
 *      `<img>` exposes no inner stroked node and FAILS by construction); (b) its
 *      computed stroke == the element's computed `color` (the `currentColor`
 *      resolution); (c) the resolved stroke DIFFERS between `.dark` and light
 *      (proving it tracks the theme, not a baked hue). PLUS the served
 *      `rel=icon` returns HTTP 200 (the live 404 guard on the built artifact).
 *      BITE: revert the dock to `<img :src>` → no inner stroked `<svg>` node →
 *      reds; bake a fixed hue → the dark==light equality reds.
 *
 * Mirrors scripts/proof-scene-machine-irrefragable.mjs + proof-easing-canvas-
 * bounded.mjs (the serveDist + Playwright + the H.W1 FSM settle plumbing + the
 * KF_REQUIRE_BROWSER skipOrFail). Scene switches are driven IN-PAGE via the hash
 * reconcile (the same fixed point as the in-app combobox; goto clears storage).
 * Settle-gated on the FSM resting. The browser half serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first). Re-runnable:
 * `node scripts/proof-scene-icons.mjs`.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");
const ICONS_DIR = path.join(REPO, "assets/icons");
const INDEX_HTML = path.join(DEMO, "app/index.html");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:scene-icons — H.W5 (the themable-coverage + shape + no-raster lock)");

// ── Resolve the allow-listed favicon (the SINGLE index.html rel=icon) FIRST ───
// G3 + G1 both key off it: the favicon is the ONE allow-listed file (it renders
// as a standalone document with no host currentColor, so it legitimately carries
// an explicit prefers-color-scheme hue) — it is EXCLUDED from the G1 no-baked-
// color family iteration AND is the lone allow-listed non-currentColor entry.
let faviconHref = null; // the raw href string in index.html
let faviconAbs = null; // the resolved absolute path on disk
let faviconBasename = null; // the basename within assets/icons (for the allow-list)
{
    const html = fs.existsSync(INDEX_HTML) ? read(INDEX_HTML) : "";
    // The first <link rel="icon" … href="…"> (rel/href in either order).
    const linkRe = /<link\b[^>]*\brel=["']icon["'][^>]*>/i;
    const linkM = html.match(linkRe);
    if (linkM) {
        const hrefM = linkM[0].match(/\bhref=["']([^"']+)["']/i);
        faviconHref = hrefM ? hrefM[1] : null;
    }
    if (faviconHref) {
        // index.html lives at demo/app/index.html; the href is source-relative.
        faviconAbs = path.resolve(path.dirname(INDEX_HTML), faviconHref);
        // The favicon is allow-listed within assets/icons ONLY if it lives there.
        if (path.dirname(faviconAbs) === ICONS_DIR) {
            faviconBasename = path.basename(faviconAbs);
        }
    }
}

// ── G2 COVERAGE — every non-home SceneDescriptor has a defined icon ───────────
// Parse scenes.ts: the `scenes` array descriptors (all non-home) MUST each carry
// an `icon:` key; the `homeScene` descriptor is the single exception (the dock
// falls back to <Home> for it alone). We parse each `{ … }` object literal in the
// `scenes: SceneDescriptor[] = [ … ]` array and assert `id:` ⇒ `icon:` present.
{
    const src = read(path.join(DEMO, "app/scenes.ts"));
    // Isolate the `scenes` array body (NOT homeScene, which is its own const).
    const arrM = src.match(/export const scenes:\s*SceneDescriptor\[\]\s*=\s*\[/);
    if (!arrM) {
        fail("coverage — could not locate the `scenes: SceneDescriptor[] = [` array in scenes.ts");
    } else {
        // Brace-match from the `[` to its matching `]`.
        let i = arrM.index + arrM[0].length - 1; // at the `[`
        let depth = 0;
        const start = i + 1;
        for (; i < src.length; i++) {
            if (src[i] === "[") depth++;
            else if (src[i] === "]") {
                depth--;
                if (depth === 0) break;
            }
        }
        const arrayBody = src.slice(start, i);
        // Blank /* … */ and // … comments so a commented-out descriptor / the
        // doc-prose mentioning a merged scene does not count as a descriptor.
        const blanked = arrayBody
            .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
            .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
        // Split into top-level `{ … }` object literals (each a descriptor).
        const descriptors = [];
        let d = 0;
        let objStart = -1;
        for (let k = 0; k < blanked.length; k++) {
            const ch = blanked[k];
            if (ch === "{") {
                if (d === 0) objStart = k;
                d++;
            } else if (ch === "}") {
                d--;
                if (d === 0 && objStart >= 0) {
                    descriptors.push(blanked.slice(objStart, k + 1));
                    objStart = -1;
                }
            }
        }
        const missingIcon = [];
        let counted = 0;
        for (const desc of descriptors) {
            const idM = desc.match(/\bid:\s*"([^"]+)"/);
            if (!idM) continue; // not a real descriptor literal
            counted++;
            const id = idM[1];
            if (id === "home") continue; // the single allow-listed icon-less scene
            if (!/\bicon:\s*[A-Za-z]/.test(desc)) missingIcon.push(id);
        }
        if (counted === 0) {
            fail("coverage — parsed ZERO descriptors from the scenes array (the parse drifted)");
        } else if (missingIcon.length > 0) {
            fail(
                `coverage — ${missingIcon.length} non-home SceneDescriptor(s) define NO ` +
                    `\`icon:\`: ${missingIcon.join(", ")}. An icon-less scene is structurally ` +
                    `unshippable (the D8 cure) — populate \`icon:\` on every non-home descriptor.`,
            );
        } else {
            ok(
                `coverage — all ${counted} non-home SceneDescriptor(s) define an \`icon:\` ` +
                    `(the D8 registry-drift is structurally forbidden; home alone falls back to <Home>)`,
            );
        }
    }
}

// ── G1 SHAPE — the currentColor family file contract ──────────────────────────
{
    if (!fs.existsSync(ICONS_DIR)) {
        fail(`shape — assets/icons/ does not exist (${path.relative(REPO, ICONS_DIR)})`);
    } else {
        const svgs = fs
            .readdirSync(ICONS_DIR)
            .filter((f) => f.toLowerCase().endsWith(".svg"))
            .filter((f) => f !== faviconBasename) // the favicon is the allow-listed exception
            .sort();
        if (svgs.length === 0) {
            fail("shape — assets/icons/ holds ZERO scene SVGs (the family was not authored)");
        }
        // A baked color on a stroke/fill: hsl(/rgb( functions or a #hex literal.
        // `currentColor` and `none` are the only legal stroke/fill VALUES; opacity
        // and stroke-dasharray are NOT colors and are ignored.
        const HEX = /#[0-9a-fA-F]{3,8}\b/;
        const HSL = /\bhsla?\s*\(/i;
        const RGB = /\brgba?\s*\(/i;
        let cleanCount = 0;
        for (const f of svgs) {
            const src = read(path.join(ICONS_DIR, f));
            const probs = [];
            // (a) viewBox="0 0 32 32"
            const vbM = src.match(/\bviewBox=["']([^"']+)["']/);
            const vb = vbM ? vbM[1].replace(/\s+/g, " ").trim() : null;
            if (vb !== "0 0 32 32") {
                probs.push(`viewBox is ${vb === null ? "ABSENT" : `"${vb}"`} (expected "0 0 32 32")`);
            }
            // (b) the root carries fill="none"
            if (!/\bfill=["']none["']/.test(src)) {
                probs.push(`no fill="none" (the family is stroke-drawn)`);
            }
            // (c) ≥1 stroke="currentColor"
            if (!/\bstroke=["']currentColor["']/.test(src)) {
                probs.push(`no stroke="currentColor" (the themable reference)`);
            }
            // (d) ZERO baked color on any stroke/fill. Scan the explicit stroke=/
            // fill= attribute VALUES (the only place a baked color would defeat
            // theming), plus a global hex/hsl/rgb sweep as the belt.
            const colorAttrs = [...src.matchAll(/\b(?:stroke|fill)=["']([^"']*)["']/g)].map(
                (m) => m[1],
            );
            const bakedAttr = colorAttrs.filter((v) => HEX.test(v) || HSL.test(v) || RGB.test(v));
            const bakedGlobal = HEX.test(src) || HSL.test(src) || RGB.test(src);
            if (bakedAttr.length > 0) {
                probs.push(`baked color on a stroke/fill attr: ${bakedAttr.join(", ")}`);
            } else if (bakedGlobal) {
                probs.push(`a baked hsl(/rgb(/#hex literal appears in the file (theme-blind)`);
            }
            if (probs.length === 0) {
                cleanCount++;
            } else {
                fail(`shape — ${f}: ${probs.join("; ")}`);
            }
        }
        if (cleanCount === svgs.length && svgs.length > 0) {
            ok(
                `shape — all ${svgs.length} scene icon(s) are fill="none" + ≥1 ` +
                    `stroke="currentColor" + viewBox="0 0 32 32" with ZERO baked hsl/rgb/#hex ` +
                    `(${svgs.join(", ")})`,
            );
        }
    }
}

// ── G3 NO-RASTER + FAVICON 404 GUARD (BLK-7) ──────────────────────────────────
{
    if (fs.existsSync(ICONS_DIR)) {
        const pngs = fs.readdirSync(ICONS_DIR).filter((f) => f.toLowerCase().endsWith(".png"));
        // The allow-list: EXACTLY the favicon basename IFF the favicon is a PNG
        // living in assets/icons. (Here the favicon is an SVG, so the allow-list
        // for PNGs is empty — every .png is forbidden.)
        const allowedPng = faviconBasename && faviconBasename.toLowerCase().endsWith(".png")
            ? new Set([faviconBasename])
            : new Set();
        const orphanPng = pngs.filter((f) => !allowedPng.has(f));
        if (orphanPng.length === 0) {
            ok(
                `no-raster — assets/icons/ holds ZERO .png` +
                    (allowedPng.size > 0
                        ? ` modulo the allow-listed favicon ${[...allowedPng][0]}`
                        : ` (the 6 dock/orphan PNGs are KILLed; the favicon is the vector ${faviconBasename ?? "(none)"})`),
            );
        } else {
            fail(
                `no-raster — assets/icons/ still holds ${orphanPng.length} non-allow-listed ` +
                    `.png: ${orphanPng.join(", ")} (the PNG screenshot lineage must be KILLed; ` +
                    `only the single index.html-named favicon may be a raster)`,
            );
        }
    }

    // The 404 guard: index.html's rel=icon resolves to an existing checked-in file
    // (BLK-7 — deleting cube-icon-sm.png WITHOUT re-pointing would 404 the favicon).
    if (!faviconHref) {
        fail(
            `favicon-resolve (BLK-7) — index.html declares NO <link rel="icon" href> ` +
                `(${path.relative(REPO, INDEX_HTML)}); the favicon is undeclared`,
        );
    } else if (!faviconAbs || !fs.existsSync(faviconAbs)) {
        fail(
            `favicon-resolve (BLK-7) — index.html rel=icon href="${faviconHref}" resolves to ` +
                `${faviconAbs ? path.relative(REPO, faviconAbs) : "(unresolvable)"} which does ` +
                `NOT exist on disk (a live 404 favicon — the BLK-7 PNG-KILL self-contradiction)`,
        );
    } else {
        ok(
            `favicon-resolve (BLK-7) — index.html rel=icon href="${faviconHref}" resolves to an ` +
                `existing file (${path.relative(REPO, faviconAbs)}; the allow-listed exception)`,
        );
    }
}

// ── G4 THEMING — the load-bearing browser clause (authority over G1) ──────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the G4 ` +
                "theming clause (a mounted icon's stroke == host currentColor, dark≠light) " +
                "cannot pass vacuously (an <img> icon FAILS it by construction)",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};
const MACHINE_KEY = "keyframes-js-scene-machine"; // SCENE_MACHINE_PERSIST_KEY

function serveDist() {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    return server;
}

/** Settle on #/<scene> via an IN-PAGE hash assignment (the same reconcile fixed
 *  point as the in-app combobox; goto clears storage + the FSM trap). Poll the
 *  machine's activeScene to rest on the target, then a settle window. */
async function navByHash(page, sceneId, settleMs = 800) {
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, sceneId);
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, sceneId],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(settleMs);
}

/** Force the document theme (.dark on <html> for dark, removed for light) and let
 *  the cascade settle. The demo toggles theme via the `dark` class on the root. */
async function setTheme(page, mode) {
    await page.evaluate((m) => {
        const root = document.documentElement;
        if (m === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, mode);
    await page.waitForTimeout(250);
}

/** Probe the MOUNTED active-scene icon in the dock. The icon renders inside the
 *  Scene select trigger (aria-label "Scene") as `<component :is="scene.icon"
 *  class="icon-sm shrink-0 text-muted-foreground">` → the FIRST element child of
 *  the trigger (the glyph that precedes the <SelectValue> label + the chevron).
 *
 *  The theme-blind regression is an `<img :src>` in THAT slot (a replaced element
 *  that paints the SVG as a separate document, unable to read the host
 *  currentColor). We bite it directly: (a) if the scene-icon slot is an `<img>`,
 *  that IS the stage-4 defect → fail. The reka-ui <SelectValue> may itself
 *  render an inline <svg> (a chevron / a mirrored item glyph), so a naive
 *  "any svg in the trigger" probe would FALSE-PASS while the <img> regression is
 *  live — we therefore inspect the SCENE-ICON node specifically (the icon-sm /
 *  shrink-0 glyph, the first non-chevron child), not just any svg in scope. */
const probeSceneIcon = (page) =>
    page.evaluate(() => {
        const trigger = document.querySelector('[aria-label="Scene"]');
        if (!trigger) return { found: false, isImg: false, noTrigger: true };

        // The scene-icon slot: the rendered icon carries the `icon-sm shrink-0
        // text-muted-foreground` classes (the dock render seam). Find that node
        // FIRST — it is either the inline <svg> (themable) OR the <img> (the
        // regression). Match on the shrink-0 scene-icon class (NOT the chevron,
        // which has no shrink-0, and NOT <SelectValue>'s inner content).
        const iconNode =
            trigger.querySelector("img.shrink-0, svg.shrink-0") ||
            // fallback: the first <img>/<svg> that is a DIRECT child of the
            // trigger (the icon slot precedes <SelectValue>).
            [...trigger.children].find(
                (c) => c.tagName === "IMG" || c.tagName === "svg",
            ) ||
            trigger.querySelector("img[src], svg");
        if (!iconNode) return { found: false, isImg: false };

        // The <img> regression — record it (it FAILS by construction).
        if (iconNode.tagName === "IMG") {
            return {
                found: true,
                isImg: true,
                tag: "img",
                src: iconNode.getAttribute("src") || "",
            };
        }

        const svg = iconNode;
        // The stroked geometry node (path/circle/rect/ellipse/line) — its computed
        // stroke is the currentColor resolution we test.
        const geo =
            svg.querySelector('[stroke="currentColor"]') ||
            svg.querySelector("path, circle, rect, ellipse, line, polyline, polygon") ||
            svg;
        const cs = getComputedStyle(geo);
        const svgCs = getComputedStyle(svg);
        return {
            found: true,
            isImg: false,
            tag: svg.tagName.toLowerCase(),
            stroke: cs.stroke, // currentColor resolves to a concrete color here
            color: cs.color,
            svgColor: svgCs.color,
        };
    });

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom("@playwright/test"));
        } catch {
            skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
            return;
        }
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    try {
        // (i) the LIVE 404 guard on the BUILT artifact: the served rel=icon → 200.
        {
            const html = read(path.join(DIST, "index.html"));
            const linkM = html.match(/<link\b[^>]*\brel=["']icon["'][^>]*>/i);
            const hrefM = linkM && linkM[0].match(/\bhref=["']([^"']+)["']/i);
            const builtHref = hrefM ? hrefM[1] : null;
            if (!builtHref) {
                fail("favicon-served — the BUILT dist/gh-pages/index.html declares no rel=icon");
            } else {
                const url = new URL(builtHref, base + "/").toString();
                const status = await new Promise((resolve) => {
                    http.get(url, (res) => {
                        res.resume();
                        resolve(res.statusCode);
                    }).on("error", () => resolve(0));
                });
                if (status === 200) {
                    ok(`favicon-served — the BUILT rel=icon href="${builtHref}" serves HTTP 200 (no live 404)`);
                } else {
                    fail(
                        `favicon-served — the BUILT rel=icon href="${builtHref}" serves HTTP ` +
                            `${status} (expected 200; the favicon 404s in the shipped artifact, BLK-7)`,
                    );
                }
            }
        }

        // (ii) the G4 THEMING clause — a mounted scene icon themes via currentColor.
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        // Land on a NON-home scene so a scene icon is mounted in the dock trigger.
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await navByHash(page, "cube", 1500);

        // LIGHT
        await setTheme(page, "light");
        const light = await probeSceneIcon(page);
        // DARK
        await setTheme(page, "dark");
        const dark = await probeSceneIcon(page);

        if (light.isImg || dark.isImg) {
            // The theme-blind stage-4 regression: the scene-icon slot is an
            // `<img :src>`. A replaced element paints the SVG as a separate
            // document and cannot read the host currentColor — FAILS by
            // construction, regardless of the file's own `stroke="currentColor"`.
            // This is the load-bearing bite the PNG→SVG file-swap alone misses
            // (G4 is the AUTHORITY over the G1 file-shape check).
            fail(
                `theming (G4) — the mounted scene icon is an <img :src="${(light.isImg ? light.src : dark.src) || ""}"> ` +
                    `(a replaced element that paints the SVG as a separate document and CANNOT read ` +
                    `the host currentColor — theme-blind BY CONSTRUCTION). The icon MUST be an inline ` +
                    `<component :is> <svg> (the stage-4 fix); even a vector file fails the theming ` +
                    `clause through the <img> reference mechanism.`,
            );
        } else if (!light.found || !dark.found) {
            fail(
                `theming (G4) — no mounted scene icon found in the dock Scene trigger ` +
                    `(noTrigger=${light.noTrigger || dark.noTrigger}). The active scene's icon ` +
                    `must mount as an inline <component :is> <svg> with a currentColor stroke.`,
            );
        } else {
            // (a) it is a real inline <svg>, not an <img>
            if (light.tag === "svg" && !light.isImg) {
                ok(`theming (G4) — the mounted scene icon is a real inline <svg> (not <img :src> — the themable reference mechanism)`);
            } else {
                fail(`theming (G4) — the mounted scene icon is not an inline <svg> (tag=${light.tag}, isImg=${light.isImg})`);
            }
            // (b) the stroke resolves to the host color (currentColor) — in BOTH themes
            const strokeMatchesColor = (p) =>
                p.stroke && p.color && p.stroke !== "none" && p.stroke === p.color;
            if (strokeMatchesColor(light) && strokeMatchesColor(dark)) {
                ok(
                    `theming (G4) — the icon's computed stroke == host currentColor in BOTH ` +
                        `themes (light stroke=${light.stroke}, dark stroke=${dark.stroke})`,
                );
            } else {
                fail(
                    `theming (G4) — the icon's computed stroke does NOT track the host ` +
                        `currentColor: light {stroke:${light.stroke}, color:${light.color}}, ` +
                        `dark {stroke:${dark.stroke}, color:${dark.color}} (a baked hue or an ` +
                        `<img> reference would diverge from the host color — the G1 file-shape ` +
                        `would pass while G4, the authority, reds)`,
                );
            }
            // (c) the resolved stroke DIFFERS dark vs light — it tracks the theme
            if (light.stroke && dark.stroke && light.stroke !== dark.stroke) {
                ok(
                    `theming (G4) — the resolved stroke DIFFERS between light (${light.stroke}) ` +
                        `and dark (${dark.stroke}) — it tracks the theme, not a baked hue (an ` +
                        `<img> SVG or a baked color would paint the SAME hue in both)`,
                );
            } else {
                fail(
                    `theming (G4) — the resolved stroke is IDENTICAL in light and dark ` +
                        `(${light.stroke}) — the icon does NOT theme (a baked hue / an <img> ` +
                        `reference paints the same color regardless of theme)`,
                );
            }
        }
        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-icons — FAIL (${failures.length}): the icon family is not a ` +
            `themable inline-SVG currentColor set on the descriptor (coverage / shape / ` +
            `no-raster / favicon-resolve / theming) — H.W5 S1/S2 + BLK-7.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-icons — PASS: every non-home scene has a defined icon, every " +
        "assets/icons/*.svg is a fill=none currentColor 32×32 glyph with zero baked " +
        "color, assets/icons holds zero non-favicon PNG, the rel=icon resolves, and a " +
        "mounted scene icon's stroke tracks the host currentColor in both themes (H.W5).",
);
