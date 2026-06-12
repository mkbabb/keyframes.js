// K typography-SYSTEM probe — voice authority + grid opacity (styling-typography-k lane)
// DOCS ONLY. Reads the BUILT dist via demo-driver withPage. No source mutated.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage, navToScene } from "../../../../scripts/lib/demo-driver.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../../../../dist/gh-pages");
const SHOTS = path.resolve(__dirname, "screenshots-k");

const INSTRUMENT = /Instrument Serif/i;
const FIRA = /Fira Code/i;

function voiceOf(ff) {
    if (INSTRUMENT.test(ff)) return "DISPLAY";
    if (FIRA.test(ff)) return "MONO";
    return "SANS";
}

await withPage({ distDir: DIST, context: { viewport: { width: 1440, height: 900 } } }, async (page, { url }) => {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // ── 1. Resolved token authority at :root ──
    const tokens = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const get = (n) => cs.getPropertyValue(n).trim();
        return {
            fontDisplay: get("--font-display"),
            fontSerif: get("--font-serif"),
            fontText: get("--font-text"),
            fontStackText: get("--font-stack-text"),
            fontStackDisplay: get("--font-stack-display"),
            fontMono: get("--font-mono"),
            graphOpacity: get("--graph-opacity"),
            graphMajorOpacity: get("--graph-major-opacity"),
        };
    });
    console.log("=== TOKENS (resolved at :root) ===");
    console.log(JSON.stringify(tokens, null, 2));

    // ── 2. Are --font-serif and --font-display the SAME computed value? ──
    console.log("\n=== DISPLAY-VOICE AUTHORITY ===");
    console.log("font-serif === font-display ?", tokens.fontSerif === tokens.fontDisplay);
    console.log("font-stack-display (the .font-display utility target):", tokens.fontStackDisplay);

    // ── 3. Hero screen voice census ──
    const hero = await page.evaluate(() => {
        const vOf = (ff) => /Instrument Serif/i.test(ff) ? "DISPLAY" : /Fira Code/i.test(ff) ? "MONO" : "SANS";
        const out = [];
        const walk = (el) => {
            const ff = getComputedStyle(el).fontFamily;
            const txt = (el.textContent || "").trim().slice(0, 28);
            const direct = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
            if (direct && txt) {
                out.push({ voice: vOf(ff), tag: el.tagName.toLowerCase(), cls: el.className?.toString?.().slice(0, 40), txt });
            }
            for (const c of el.children) walk(c);
        };
        walk(document.body);
        return out;
    });
    console.log("\n=== HERO voice census (visible text leaves) ===");
    for (const h of hero) console.log(`${h.voice.padEnd(8)} ${h.tag.padEnd(6)} "${h.txt}"  .${h.cls}`);

    await page.screenshot({ path: path.join(SHOTS, "k-typo-hero-desktop.png") });
});

console.log("\n--- done ---");
