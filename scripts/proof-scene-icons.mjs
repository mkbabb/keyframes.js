#!/usr/bin/env node
/**
 * proof:scene-icons — H.W10 REVISE (the EXPRESSIVE-color + re-instantiation +
 * coverage + relaxed-no-raster lock; reverses W5.S2's monochrome enforcement).
 *
 * The D8 root cause (W5): the icon registry was a dock-keyed `Record<string,
 * string>` of imported image URLs mapping ONLY 4 of 9 scenes, rendered via
 * `<img :src>` — theme-blind BY CONSTRUCTION (an `<img>` paints SVG as a replaced
 * element, a separate document that cannot read the host `currentColor`/CSS
 * custom props). W5 cured it with one inline-`<svg>` family on
 * `SceneDescriptor.icon` (`<component :is>`, NOT `<img :src>`) — but over-
 * corrected to `fill="none" stroke="currentColor"` MONOCHROME, throwing the
 * COLOR out with the bathwater. The user rejected the monochrome flip: *"I don't
 * want the icons re-created. I want them re-instantiated. The only new icons
 * should be for those that lack them. If they are to be converted to SVG, they
 * should be done so 1-1."*
 *
 * H.W10.S1/G1 (this REVISE): RE-INSTANTIATE the 4 originals VERBATIM from
 * `084feb9` (cube/amiga/square `-icon-sm.png` as 1:1 base64-`<image>` embeds,
 * easing-icon-sm.svg restored byte-for-byte with its `hsl(248,88%,71%)` violet),
 * author 3 NEW colorful SVGs for the primitives that LACKED one (spring/sequence/
 * motion-path), and KEEP the W5 `SceneDescriptor.icon` + vite-svg-loader
 * `?component` substrate (the D8 structural cure). The gate INVERTS: monochrome
 * now FAILS, expressive color GREENS.
 *
 * STATIC half (always runs) — the file-shape + faithfulness + coverage + no-raster:
 *
 *   G1 SHAPE (INVERTED) — every `assets/icons/*.svg` (EXCLUDING the allow-listed
 *      favicon) is a 32×32 inline-`<svg>` (`viewBox="0 0 32 32"`) carrying its
 *      OWN expressive identity color via ONE of three legal forms: (1) a demo
 *      palette token `var(--rainbow-* / --accent-* / --color-*)` on a stroke or
 *      fill (the 3 NEW glyphs); (2) a baked vivid `hsl(`/`rgb(`/`#hex` (the re-instantiated
 *      easing violet); (3) a 1:1 raster→SVG `<image href="data:…base64">` embed
 *      (the re-instantiated cube/amiga/square). A `stroke="currentColor"`-ONLY
 *      icon (the W5 monochrome the user rejected) now FAILS. BITE: flip any icon
 *      to currentColor-only → the monochrome-inversion clause reds.
 *
 *   G1 RE-INSTANTIATION FAITHFULNESS — the 4 originals (cube/amiga/square/easing)
 *      byte-match (easing vector) / pixel-match (the raster `<image>` decode) their
 *      `084feb9` source. A hand-authored monochrome-derived stroke approximation
 *      FAILS — the asset must be the ORIGINAL, not redrawn. BITE: redraw the
 *      easing geometry / re-encode a raster embed → the faithfulness clause reds.
 *
 *   G2 COVERAGE — every non-`home` `SceneDescriptor` in `scenes.ts` has a defined
 *      `icon`. Structurally forbids the D8 regression: an icon-less scene cannot
 *      ship. BITE: drop an `icon:` from any non-home descriptor → coverage reds.
 *
 *   G3 NO-RASTER (RELAXED) + FAVICON 404 GUARD (BLK-7) — `assets/icons/` contains
 *      ZERO `.png` modulo the SINGLE allow-listed favicon AND the ENUMERATED
 *      re-instantiated original rasters `{cube,amiga,square}-icon-sm.png` (the
 *      contract-sanctioned keep-as-PNG 1:1 route; the impl chose the embed so this
 *      allow-list stays unexercised); the killed dock/screenshot PNG lineage stays
 *      forbidden. AND `index.html`'s `rel=icon` href RESOLVES to a checked-in file.
 *      BITE: leave a non-enumerated orphan PNG → no-raster reds; delete the
 *      favicon WITHOUT re-pointing index.html → the resolve clause reds.
 *
 * BROWSER half (KF_REQUIRE_BROWSER) — the THEMING clause (REPLACED, the load-
 * bearing bite the file-shape alone does NOT make; G4 is the AUTHORITY over G1):
 *
 *   G4 THEMING (REPLACED — carries-own-color) — a MOUNTED scene icon (a) is a REAL
 *      inline `<svg>`, NOT an `<img>` (the D8 theme-blind-raster structural
 *      defense; even a re-instantiated raster mounts as an `<svg><image>` embed,
 *      never a bare `<img :src>`); (b) carries its OWN expressive color — the
 *      resolved paint DIFFERS from the host `currentColor` (a raster embed is
 *      exempt — its color lives in its pixels), the INVERSE of the W5 clause that
 *      REQUIRED stroke==host-color; (c) clears a gentle ΔL floor vs the surface in
 *      BOTH themes (the legibility kernel). PLUS the served `rel=icon` returns
 *      HTTP 200. The cube probe exercises a raster embed; the easing probe
 *      exercises a real CSS-painted vector (the violet ≠ currentColor). BITE:
 *      revert the dock to `<img :src>` → no inner `<svg>` → reds; flip to a
 *      currentColor monochrome → the carries-own-color equality reds.
 *
 * Mirrors scripts/proof-scene-machine-irrefragable.mjs + proof-easing-canvas-
 * bounded.mjs (the serveDist + Playwright + the H.W1 FSM settle plumbing + the
 * KF_REQUIRE_BROWSER skipOrFail). Scene switches are driven IN-PAGE via the hash
 * reconcile (the same fixed point as the in-app combobox; goto clears storage).
 * Settle-gated on the FSM resting. The browser half serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first). Re-runnable:
 * `node scripts/proof-scene-icons.mjs`.
 */
import { execFileSync } from "node:child_process";
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

console.log(
    "proof:scene-icons — H.W10 REVISE (expressive-color + re-instantiation + coverage + relaxed-no-raster lock)",
);

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

// ── G1 SHAPE — the EXPRESSIVE-COLOR family file contract (H.W10 INVERT) ────────
// REVISED by H.W10.S1/G1 (reverses W5.S2). The W5 clause asserted ZERO baked
// color + `stroke="currentColor"` (monochrome) — the very thing the user
// rejected. INVERTED: every scene icon must now carry EXPRESSIVE color, and a
// `stroke="currentColor"`-ONLY (no colorful value) icon FAILS. The icon is still
// a 32×32 inline `<svg>` (viewBox preserved), but it carries its OWN identity
// color via ONE of three legal forms:
//   (1) a demo palette token  — `var(--rainbow-*/--accent-*/--color-progress)`
//       on a stroke/fill (the 3 NEW colorful glyphs: spring/sequence/motion-path)
//   (2) a baked vivid hue     — an `hsl(`/`rgb(`/`#hex` on a stroke/fill (the
//       re-instantiated original easing vector, `hsl(248,88%,71%)`)
//   (3) a raster→SVG embed    — a 1:1 `<image href="data:image/png;base64,…">`
//       of the exact original pixels (the re-instantiated cube/amiga/square)
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
        // A baked vivid hue on a stroke/fill: hsl(/rgb( functions or a #hex.
        const HEX = /#[0-9a-fA-F]{3,8}\b/;
        const HSL = /\bhsla?\s*\(/i;
        const RGB = /\brgba?\s*\(/i;
        // A demo palette token reference: var(--rainbow-* / --accent-* / --color-*).
        const TOKEN = /var\(\s*--(?:rainbow|accent|color)-[\w-]+/i;
        // A 1:1 raster→SVG embed: a base64 <image> of the original pixels.
        const RASTER_EMBED = /<image\b[^>]*\bhref=["']data:image\/(?:png|jpe?g|webp);base64,/i;
        let cleanCount = 0;
        for (const f of svgs) {
            const src = read(path.join(ICONS_DIR, f));
            const probs = [];
            // (a) viewBox="0 0 32 32" — the glyph still scales.
            const vbM = src.match(/\bviewBox=["']([^"']+)["']/);
            const vb = vbM ? vbM[1].replace(/\s+/g, " ").trim() : null;
            if (vb !== "0 0 32 32") {
                probs.push(`viewBox is ${vb === null ? "ABSENT" : `"${vb}"`} (expected "0 0 32 32")`);
            }
            // (b) the icon carries EXPRESSIVE color via ONE of the three forms.
            const isRaster = RASTER_EMBED.test(src);
            const colorAttrs = [...src.matchAll(/\b(?:stroke|fill)=["']([^"']*)["']/g)].map(
                (m) => m[1],
            );
            const hasToken = colorAttrs.some((v) => TOKEN.test(v)) || TOKEN.test(src);
            const hasBakedHue = colorAttrs.some(
                (v) => HEX.test(v) || HSL.test(v) || RGB.test(v),
            );
            if (!isRaster && !hasToken && !hasBakedHue) {
                // The MONOCHROME-INVERSION bite: a currentColor-only icon (no
                // palette token, no baked hue, no raster) is the W5 form the user
                // rejected — it now FAILS.
                const monochrome = /\bstroke=["']currentColor["']/.test(src);
                probs.push(
                    monochrome
                        ? `MONOCHROME (stroke="currentColor"-only, no expressive color) — ` +
                              `must carry a var(--rainbow*/accent*/color*) token, a baked vivid ` +
                              `hue, or be a 1:1 raster→SVG <image> embed (H.W10 G1)`
                        : `no expressive color found (no palette token, no baked hue, no raster ` +
                              `embed) — the icon must carry its OWN identity color (H.W10 G1)`,
                );
            }
            if (probs.length === 0) {
                cleanCount++;
            } else {
                fail(`shape — ${f}: ${probs.join("; ")}`);
            }
        }
        if (cleanCount === svgs.length && svgs.length > 0) {
            ok(
                `shape — all ${svgs.length} scene icon(s) are 32×32 inline-<svg> carrying ` +
                    `EXPRESSIVE color (a var(--rainbow*/accent*/color*) token, a baked vivid hue, ` +
                    `or a 1:1 raster→SVG <image> embed — NO currentColor-only monochrome) ` +
                    `(${svgs.join(", ")})`,
            );
        }
    }
}

// ── G1 RE-INSTANTIATION FAITHFULNESS — the 4 originals are 084feb9 1:1 ─────────
// H.W10.S1/G1: the four icons the user called "correct" (cube/amiga/square/
// easing) are RE-INSTANTIATED VERBATIM from 084feb9 (W5's parent), NOT redrawn.
// The bite: a hand-authored monochrome-derived stroke approximation FAILS — the
// asset must MATCH the original source pixel-for-pixel (raster embeds) or
// byte-for-byte (the easing vector).
//   • easing.svg — BYTE-identical to 084feb9:assets/icons/easing-icon-sm.svg.
//   • cube/amiga/square.svg — a 1:1 <image href="data:…base64"> whose DECODED
//     pixels are byte-equal to 084feb9:assets/icons/{…}-icon-sm.png (the
//     gate-allowed raster→SVG embed; the raw PNG file need not be on disk).
{
    // 084feb9 is W5's parent — the last commit carrying the original icons.
    const ORIGIN = "084feb9";
    const gitBlob = (relPath) => {
        try {
            return execFileSync("git", ["show", `${ORIGIN}:${relPath}`], {
                cwd: REPO,
                maxBuffer: 1 << 24,
            });
        } catch {
            return null;
        }
    };
    // The re-instantiation map: live icon ⇒ its 084feb9 source.
    const reinstated = [
        { live: "easing.svg", src: "assets/icons/easing-icon-sm.svg", kind: "vector" },
        { live: "cube.svg", src: "assets/icons/cube-icon-sm.png", kind: "raster" },
        { live: "amiga.svg", src: "assets/icons/amiga-icon-sm.png", kind: "raster" },
        { live: "square.svg", src: "assets/icons/square-icon-sm.png", kind: "raster" },
    ];
    const B64 = /<image\b[^>]*\bhref=["']data:image\/(?:png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)["']/i;
    let faithful = 0;
    let originReachable = true;
    for (const { live, src, kind } of reinstated) {
        const livePath = path.join(ICONS_DIR, live);
        if (!fs.existsSync(livePath)) {
            fail(`re-instantiation — ${live} is MISSING (must re-instantiate the 084feb9 original)`);
            continue;
        }
        const origin = gitBlob(src);
        if (origin === null) {
            // The origin blob is unreachable (shallow clone / detached) — record
            // once and skip the byte-compare (do NOT vacuously pass).
            if (originReachable) {
                console.log(
                    `  · re-instantiation — ${ORIGIN}:${src} unreachable (shallow clone?); ` +
                        `skipping the byte/pixel compare for the re-instantiated originals`,
                );
            }
            originReachable = false;
            continue;
        }
        if (kind === "vector") {
            const liveBuf = fs.readFileSync(livePath);
            if (liveBuf.equals(origin)) {
                faithful++;
                ok(`re-instantiation — ${live} is BYTE-identical to ${ORIGIN}:${src} (verbatim)`);
            } else {
                fail(
                    `re-instantiation — ${live} is NOT byte-identical to ${ORIGIN}:${src} ` +
                        `(it must be re-instantiated VERBATIM, not redrawn — the original ` +
                        `colorful violet easing vector, NOT a hand-authored approximation)`,
                );
            }
        } else {
            // raster: decode the SVG's base64 <image> and compare to the source PNG.
            const liveSrc = read(livePath);
            const m = liveSrc.match(B64);
            if (!m) {
                fail(
                    `re-instantiation — ${live} carries NO base64 <image> embed (the 1:1 ` +
                        `raster→SVG faithful mechanism); cannot verify pixel-equivalence to ${src}`,
                );
                continue;
            }
            const decoded = Buffer.from(m[1], "base64");
            if (decoded.equals(origin)) {
                faithful++;
                ok(
                    `re-instantiation — ${live} embeds the EXACT pixels of ${ORIGIN}:${src} ` +
                        `(decoded base64 byte-equal — pixel-identical 1:1 embed)`,
                );
            } else {
                fail(
                    `re-instantiation — ${live}'s embedded pixels do NOT match ${ORIGIN}:${src} ` +
                        `(${decoded.length}B vs ${origin.length}B) — the raster→SVG embed must be ` +
                        `the EXACT original pixels, never a re-encode/redraw`,
                );
            }
        }
    }
    if (originReachable && faithful === reinstated.length) {
        ok(`re-instantiation — all 4 originals (cube/amiga/square/easing) are ${ORIGIN} 1:1 (verbatim)`);
    }
}

// ── G3 NO-RASTER (H.W10 RELAXED) + FAVICON 404 GUARD (BLK-7) ───────────────────
// H.W10.S1/G1 RELAX: the no-raster lock now permits the ENUMERATED re-instantiated
// original rasters BY NAME — the contract sanctions keeping `{cube,amiga,square}-
// icon-sm.png` as their literal original PNG files (the most literal 1:1
// re-instantiation) as an ALTERNATIVE to the 1:1 base64-<image> SVG embed. Either
// mechanism is gate-faithful; the impl chose the embed (so no raw PNG sits on
// disk and this allow-list stays unexercised), but the gate must PERMIT the
// keep-as-PNG route the contract names. Every OTHER PNG (the killed dock/
// screenshot lineage) stays forbidden — the no-raster spine holds.
const REINSTATED_ORIGINAL_PNGS = new Set([
    "cube-icon-sm.png",
    "amiga-icon-sm.png",
    "square-icon-sm.png",
]);
{
    if (fs.existsSync(ICONS_DIR)) {
        const pngs = fs.readdirSync(ICONS_DIR).filter((f) => f.toLowerCase().endsWith(".png"));
        // The allow-list: the favicon basename IFF the favicon is a PNG living in
        // assets/icons (here it is an SVG, so empty on that count) UNION the three
        // enumerated re-instantiated original rasters (H.W10 RELAX). Every other
        // .png is forbidden (the killed screenshot lineage).
        const allowedPng = new Set(REINSTATED_ORIGINAL_PNGS);
        if (faviconBasename && faviconBasename.toLowerCase().endsWith(".png")) {
            allowedPng.add(faviconBasename);
        }
        const orphanPng = pngs.filter((f) => !allowedPng.has(f));
        const keptOriginals = pngs.filter((f) => REINSTATED_ORIGINAL_PNGS.has(f));
        if (orphanPng.length === 0) {
            ok(
                `no-raster — assets/icons/ holds ZERO non-allow-listed .png` +
                    (keptOriginals.length > 0
                        ? ` (the re-instantiated originals ${keptOriginals.join(", ")} are ` +
                              `allow-listed by name — the keep-as-PNG 1:1 route; the favicon is ` +
                              `the vector ${faviconBasename ?? "(none)"})`
                        : ` (the 6 dock/orphan PNGs are KILLed; the originals live as 1:1 ` +
                              `<image> embeds in their SVGs; the favicon is the vector ` +
                              `${faviconBasename ?? "(none)"})`),
            );
        } else {
            fail(
                `no-raster — assets/icons/ still holds ${orphanPng.length} non-allow-listed ` +
                    `.png: ${orphanPng.join(", ")} (the PNG screenshot lineage must be KILLed; ` +
                    `only the index.html-named favicon + the enumerated re-instantiated ` +
                    `originals {cube,amiga,square}-icon-sm.png may be a raster)`,
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
        // A re-instantiated raster original embeds its pixels as <image href=data:>;
        // it has no CSS paint to probe — its expressive color lives in the pixels.
        const isRasterEmbed = !!svg.querySelector("image");
        // The painted geometry node (path/circle/rect/…) — its computed stroke is
        // the resolved paint we test (a var(--rainbow*) token or a baked hue here).
        const geo =
            svg.querySelector("[stroke]:not([stroke='none'])") ||
            svg.querySelector("path, circle, rect, ellipse, line, polyline, polygon") ||
            svg;
        const cs = getComputedStyle(geo);
        const svgCs = getComputedStyle(svg);
        // Relative luminance (sRGB → linear → Y) of an `rgb(...)`/`rgba(...)` string.
        const lum = (rgb) => {
            const m = /rgba?\(([^)]+)\)/.exec(rgb || "");
            if (!m) return null;
            const [r, g, b] = m[1].split(",").slice(0, 3).map((v) => {
                const c = parseFloat(v) / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        // The host surface lightness (the dock background behind the icon).
        const surfaceBg = getComputedStyle(document.body).backgroundColor;
        return {
            found: true,
            isImg: false,
            isRasterEmbed,
            tag: svg.tagName.toLowerCase(),
            stroke: cs.stroke, // a var(--rainbow*) token / baked hue resolves here
            color: cs.color,
            svgColor: svgCs.color,
            strokeL: lum(cs.stroke),
            surfaceL: lum(surfaceBg),
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
            // (a) it is a real inline <svg>, not an <img> — KEPT (the D8 theme-
            // blind-raster structural defense; even a re-instantiated raster is an
            // <svg><image> embed, never a bare <img :src>).
            if (light.tag === "svg" && !light.isImg) {
                ok(`theming (G4) — the mounted scene icon is a real inline <svg> (not <img :src> — the D8 theme-blind-raster defense; raster originals are <svg><image> embeds)`);
            } else {
                fail(`theming (G4) — the mounted scene icon is not an inline <svg> (tag=${light.tag}, isImg=${light.isImg})`);
            }
            // (b) H.W10 INVERT — the icon carries its OWN expressive identity color,
            // NOT the host currentColor. The W5 clause REQUIRED stroke == host color
            // (monochrome) — the very thing the user rejected. Now: the resolved
            // paint must DIFFER from the host `color` (it carries baked/tokened
            // color), proving it is expressive, not a currentColor monochrome.
            // We probe the icon's resolved paint (stroke for the vector glyphs;
            // a raster <image> has no stroke, so it passes (a) and is exempt here —
            // its expressive color lives in the embedded pixels, not a CSS paint).
            const carriesOwnColor = (p) =>
                p.isRasterEmbed || (p.stroke && p.stroke !== "none" && p.stroke !== p.color);
            if (carriesOwnColor(light) && carriesOwnColor(dark)) {
                ok(
                    `theming (G4/H.W10) — the icon carries its OWN expressive color, NOT the host ` +
                        `currentColor (light stroke=${light.stroke} vs color=${light.color}; ` +
                        `dark stroke=${dark.stroke} vs color=${dark.color}; rasterEmbed=${light.isRasterEmbed})`,
                );
            } else {
                fail(
                    `theming (G4/H.W10) — the icon's resolved paint EQUALS the host currentColor ` +
                        `(monochrome — the W5 form the user rejected): light {stroke:${light.stroke}, ` +
                        `color:${light.color}}, dark {stroke:${dark.stroke}, color:${dark.color}}. The ` +
                        `icon must carry its OWN expressive color (a var(--rainbow*) token, a baked ` +
                        `vivid hue, or a raster embed).`,
                );
            }
            // (c) OPTIONAL legibility — the resolved paint clears a minimum ΔL
            // against the host surface in BOTH themes (the "reads on both" kernel of
            // the old theming concern). Skipped for raster embeds (own pixels) and
            // when the probe lacks the surface lightness.
            if (
                !light.isRasterEmbed &&
                light.strokeL != null &&
                light.surfaceL != null &&
                dark.strokeL != null &&
                dark.surfaceL != null
            ) {
                const dlLight = Math.abs(light.strokeL - light.surfaceL);
                const dlDark = Math.abs(dark.strokeL - dark.surfaceL);
                const MIN_DL = 0.12; // a gentle floor — the icon must not vanish
                if (dlLight >= MIN_DL && dlDark >= MIN_DL) {
                    ok(
                        `theming (G4/H.W10) — the expressive color clears ΔL≥${MIN_DL} vs the ` +
                            `surface in BOTH themes (light ΔL=${dlLight.toFixed(2)}, dark ΔL=${dlDark.toFixed(2)})`,
                    );
                } else {
                    fail(
                        `theming (G4/H.W10) — the expressive color is low-contrast vs the surface ` +
                            `(light ΔL=${dlLight.toFixed(2)}, dark ΔL=${dlDark.toFixed(2)}; floor ${MIN_DL}) — ` +
                            `it must read on BOTH the light and dark canvas`,
                    );
                }
            }
        }

        // (iii) the VECTOR carries-own-color probe — cube above is a raster embed
        // (exempt from the stroke clause); also land on a VECTOR scene (easing —
        // the re-instantiated violet hsl) so the stroke≠currentColor inversion is
        // exercised on a real CSS-painted glyph (the W5 monochrome would red here).
        await navByHash(page, "easing", 1500);
        await setTheme(page, "light");
        const easeLight = await probeSceneIcon(page);
        await setTheme(page, "dark");
        const easeDark = await probeSceneIcon(page);
        if (
            easeLight.found &&
            easeDark.found &&
            !easeLight.isImg &&
            !easeDark.isImg &&
            !easeLight.isRasterEmbed
        ) {
            const ownColor = (p) => p.stroke && p.stroke !== "none" && p.stroke !== p.color;
            if (ownColor(easeLight) && ownColor(easeDark)) {
                ok(
                    `theming (G4/H.W10) — the VECTOR easing icon carries its OWN expressive ` +
                        `color (light stroke=${easeLight.stroke} ≠ color=${easeLight.color}; ` +
                        `dark stroke=${easeDark.stroke} ≠ color=${easeDark.color}) — the ` +
                        `re-instantiated violet, NOT a currentColor monochrome`,
                );
            } else {
                fail(
                    `theming (G4/H.W10) — the VECTOR easing icon's stroke EQUALS the host ` +
                        `currentColor (monochrome): light {stroke:${easeLight.stroke}, color:` +
                        `${easeLight.color}}, dark {stroke:${easeDark.stroke}, color:${easeDark.color}} ` +
                        `— it must carry its own baked/tokened color (H.W10 G1)`,
                );
            }
        } else if (easeLight.found && easeLight.isRasterEmbed) {
            // easing should be a vector, not a raster — flag the unexpected shape.
            fail(`theming (G4/H.W10) — the easing icon mounted as a raster embed (expected the re-instantiated vector)`);
        }

        // (iv) the NEW-glyph carries-own-color probe — exercise ONE of the 3 NEW
        // inline-SVG icons (spring, a `var(--color-progress)` token glyph). This
        // KEEPS the <img>-vs-inline structural bite for the NEW family (a real
        // <svg>, not an <img>) AND proves the TOKEN resolution path in the browser:
        // spring's stroke resolves to the demo palette token (NOT a baked hue, NOT
        // the host currentColor). The easing probe covers the baked-hue case; this
        // covers the var(--*-) token case — a stale/absent token would fall back to
        // currentColor and RED here (the carries-own-color inversion bites the NEW
        // glyphs too, not only the re-instantiated originals).
        await navByHash(page, "spring", 1500);
        await setTheme(page, "light");
        const springLight = await probeSceneIcon(page);
        await setTheme(page, "dark");
        const springDark = await probeSceneIcon(page);
        if (springLight.found && springDark.found) {
            // (a) the D8 structural defense holds for the NEW family — a real
            // inline <svg>, never the <img :src> regression.
            if (springLight.isImg || springDark.isImg) {
                fail(
                    `theming (G4/H.W10) — the NEW spring icon mounted as an <img :src> ` +
                        `(the D8 theme-blind-raster regression); a NEW colorful glyph MUST be an ` +
                        `inline <component :is> <svg>`,
                );
            } else if (springLight.isRasterEmbed || springDark.isRasterEmbed) {
                // spring is an inline vector glyph, not a raster — flag the surprise.
                fail(`theming (G4/H.W10) — the NEW spring icon mounted as a raster embed (expected an inline token-painted <svg>)`);
            } else {
                const ownColor = (p) => p.stroke && p.stroke !== "none" && p.stroke !== p.color;
                if (ownColor(springLight) && ownColor(springDark)) {
                    ok(
                        `theming (G4/H.W10) — the NEW spring icon (a var(--color-progress) token ` +
                            `glyph) is an inline <svg> carrying its OWN resolved color (light ` +
                            `stroke=${springLight.stroke} ≠ color=${springLight.color}; dark ` +
                            `stroke=${springDark.stroke} ≠ color=${springDark.color}) — the token ` +
                            `resolves, NOT a currentColor monochrome`,
                    );
                } else {
                    fail(
                        `theming (G4/H.W10) — the NEW spring icon's stroke EQUALS the host ` +
                            `currentColor (the token fell back to currentColor / the glyph is ` +
                            `monochrome): light {stroke:${springLight.stroke}, color:${springLight.color}}, ` +
                            `dark {stroke:${springDark.stroke}, color:${springDark.color}} — a NEW glyph ` +
                            `must resolve its var(--rainbow*/accent*/color*) token to a real color (H.W10 G1)`,
                    );
                }
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
        `\nproof:scene-icons — FAIL (${failures.length}): the icon family is not the ` +
            `EXPRESSIVE-COLOR inline-SVG set on the descriptor (coverage / shape-color / ` +
            `re-instantiation / no-raster / favicon-resolve / theming) — H.W10 S1/G1 ` +
            `(reverses W5.S2) + BLK-7.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-icons — PASS: every non-home scene has a defined icon, every " +
        "assets/icons/*.svg is a 32×32 inline-<svg> carrying EXPRESSIVE color (a " +
        "var(--rainbow*/accent*/color*) token, a baked vivid hue, or a 1:1 raster→SVG " +
        "<image> embed — no currentColor-only monochrome), the 4 originals " +
        "(cube/amiga/square/easing) are 084feb9 1:1, assets/icons holds zero non-favicon " +
        "PNG, the rel=icon resolves, and a mounted scene icon is an inline <svg> carrying " +
        "its own expressive color (H.W10 G1).",
);
