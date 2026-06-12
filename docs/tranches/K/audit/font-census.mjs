// K-audit: computed-font census over the BUILT dist across all 8 scenes,
// desktop + mobile, docks + panes. Pure read-only probe.
import {
    withPage,
    navToScene,
    openControlsPanel,
    SCENES,
} from "../../../../scripts/lib/demo-driver.mjs";

// expected control-tab trigger label per scene (for navToScene late-fact)
const TRIGGER = {
    cube: "Controls",
    amiga: "Controls",
    square: "Controls",
    easing: "Easing",
    spring: "Spring",
    sequence: null,
    "motion-path": null,
};

const CENSUS_FN = () => {
    // classify a resolved font-family string's FIRST real token into a voice
    const voiceOf = (ff) => {
        const first = (ff || "")
            .split(",")[0]
            .trim()
            .replace(/^["']|["']$/g, "")
            .toLowerCase();
        if (/instrument serif/.test(first)) return "DISPLAY(Instrument Serif)";
        if (/fraunces/.test(first)) return "DISPLAY-WRONG(Fraunces)";
        if (/plus jakarta/.test(first)) return "SANS-WRONG(Plus Jakarta)";
        if (/fira code|fira mono|sf mono|menlo|consolas|monospace|roboto mono/.test(first))
            return "MONO(Fira/mono)";
        if (/georgia/.test(first)) return "DISPLAY-FALLBACK(Georgia)";
        if (/ui-sans|system-ui|-apple-system|segoe|roboto|helvetica|arial|sans-serif/.test(first))
            return "SANS(native)";
        return "OTHER:" + first;
    };
    const isVisible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0)
            return false;
        const r = el.getBoundingClientRect();
        return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight + 40;
    };
    // a "text leaf" = element with non-whitespace direct text and no element child
    // carrying text (so we attribute the font to the actual rendered glyphs)
    const leaves = [];
    const all = document.querySelectorAll("body *");
    for (const el of all) {
        if (el.closest("script,style,svg")) continue;
        // direct text content only
        let direct = "";
        for (const n of el.childNodes)
            if (n.nodeType === 3) direct += n.textContent;
        direct = direct.replace(/\s+/g, " ").trim();
        if (!direct) continue;
        if (!isVisible(el)) continue;
        const cs = getComputedStyle(el);
        // identify a stable "site" key: tag + class list (trimmed) + nearest landmark
        const cls = (el.getAttribute("class") || "").trim();
        const land =
            el.closest("[class*=dock]")
                ? "DOCK"
                : el.closest("[class*=controls-pane],[class*=ControlsPane],[id*=controls]")
                  ? "CONTROLS-PANE"
                  : el.closest("[class*=menubar],[class*=MenuBar],[class*=ribbon],[class*=Ribbon]")
                    ? "BAR"
                    : el.closest("[class*=spring],[class*=Spring]")
                      ? "SPRING"
                      : el.closest("[class*=start-screen],[class*=StartScreen],[class*=hero]")
                        ? "HERO"
                        : "STAGE";
        leaves.push({
            land,
            tag: el.tagName.toLowerCase(),
            cls: cls.slice(0, 80),
            text: direct.slice(0, 36),
            ff: cs.fontFamily,
            voice: voiceOf(cs.fontFamily),
            size: cs.fontSize,
            weight: cs.fontWeight,
        });
    }
    return leaves;
};

const ALL = {};
const res = await withPage(
    {
        distDir: new URL("../../../../dist/gh-pages", import.meta.url).pathname,
        context: { viewport: { width: 1440, height: 900 } },
        label: "font-census-desktop",
    },
    async (page, { url }) => {
        // ── DESKTOP pass ───────────────────────────────────────────────
        await page.goto(url + "/#/", { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        ALL["home@desktop"] = await page.evaluate(CENSUS_FN);
        for (const s of SCENES.filter((s) => s.key !== "home")) {
            await navToScene(page, s.key, TRIGGER[s.key]);
            await page.waitForTimeout(700);
            ALL[`${s.key}@desktop-closed`] = await page.evaluate(CENSUS_FN);
            await openControlsPanel(page);
            await page.waitForTimeout(900);
            ALL[`${s.key}@desktop-open`] = await page.evaluate(CENSUS_FN);
        }
        return true;
    },
);
console.log("DESKTOP skipped:", res.skipped, res.reason || "");

// ── MOBILE pass (separate context for 390x844 + touch) ───────────────
const resM = await withPage(
    {
        distDir: new URL("../../../../dist/gh-pages", import.meta.url).pathname,
        context: {
            viewport: { width: 390, height: 844 },
            hasTouch: true,
            isMobile: true,
        },
        label: "font-census-mobile",
    },
    async (page, { url }) => {
        await page.goto(url + "/#/", { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        ALL["home@mobile"] = await page.evaluate(CENSUS_FN);
        for (const k of ["cube", "spring", "easing"]) {
            await navToScene(page, k, TRIGGER[k]);
            await page.waitForTimeout(700);
            ALL[`${k}@mobile-closed`] = await page.evaluate(CENSUS_FN);
        }
        return true;
    },
);
console.log("MOBILE skipped:", resM.skipped, resM.reason || "");

// ── REDUCE: voice histogram per land, + every DISPLAY-eligible site that is
// NOT in the display voice (the inconsistency set) ──────────────────────────
const voiceByLand = {};
const wrongDisplay = [];
const allSites = new Set();
for (const [scene, leaves] of Object.entries(ALL)) {
    for (const l of leaves || []) {
        const key = `${l.land}|${l.voice}`;
        voiceByLand[key] = (voiceByLand[key] || 0) + 1;
        // a dock site rendered in any non-display voice is the U-K6/U-K8 defect
        if (l.land === "DOCK" && !/DISPLAY/.test(l.voice)) {
            wrongDisplay.push({ scene, ...l });
        }
        allSites.add(`${l.land}|${l.voice}|${l.cls}|${l.text}`);
    }
}

console.log("\n=== VOICE HISTOGRAM (land | voice : count) ===");
for (const [k, v] of Object.entries(voiceByLand).sort())
    console.log(`${k.padEnd(48)} ${v}`);

console.log("\n=== DOCK SITES NOT IN DISPLAY VOICE (U-K6/U-K8) — unique ===");
const seen = new Set();
for (const w of wrongDisplay) {
    const k = `${w.cls}|${w.text}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.log(
        `[${w.scene}] <${w.tag} class="${w.cls}"> "${w.text}" → ${w.voice} (${w.size}/${w.weight})`,
    );
}

// dump raw to a json for the doc
import fs from "node:fs";
fs.writeFileSync(
    new URL("./font-census-raw.json", import.meta.url).pathname,
    JSON.stringify(ALL, null, 1),
);
console.log("\nRAW → font-census-raw.json  (scenes:", Object.keys(ALL).length, ")");
