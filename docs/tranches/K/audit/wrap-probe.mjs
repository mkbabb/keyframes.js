// Probe dock-adjacent labels for multi-line wrapping (U-K9) + screenshot the
// expanded dock. Read-only.
import { withPage, navToScene } from "../../../../scripts/lib/demo-driver.mjs";
import path from "node:path";

const SHOT = (n) =>
    path.resolve(
        new URL(".", import.meta.url).pathname,
        "screenshots-k",
        n,
    );

const WRAP_FN = () => {
    // a wrapped element: its rendered height ≈ N line-boxes where N>1, for
    // single-line-intent labels (dock labels, scene titles, badges, prose)
    const out = [];
    const cands = document.querySelectorAll(
        "[class*=dock],[class*=label],[class*=title],[class*=badge],[class*=prose],[class*=readout],[class*=metric]",
    );
    const seen = new Set();
    for (const el of cands) {
        let direct = "";
        for (const n of el.childNodes) if (n.nodeType === 3) direct += n.textContent;
        direct = direct.replace(/\s+/g, " ").trim();
        if (!direct) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
        const lines = Math.round(r.height / lh);
        const k = (el.className || "") + "|" + direct.slice(0, 30);
        if (seen.has(k)) continue;
        seen.add(k);
        if (lines >= 2) {
            out.push({
                lines,
                h: Math.round(r.height),
                lh: Math.round(lh),
                w: Math.round(r.width),
                cls: (el.getAttribute("class") || "").slice(0, 70),
                ws: cs.whiteSpace,
                text: direct.slice(0, 50),
            });
        }
    }
    return out;
};

await withPage(
    {
        distDir: new URL("../../../../dist/gh-pages", import.meta.url).pathname,
        context: { viewport: { width: 1440, height: 900 } },
        label: "wrap-probe",
    },
    async (page, { url }) => {
        await page.goto(url + "/#/", { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        console.log("=== HOME wrapped (≥2 lines) ===");
        for (const w of await page.evaluate(WRAP_FN)) console.log(JSON.stringify(w));
        await page.screenshot({ path: SHOT("home-desktop.png") });

        // open the top dock dropdown so the expanded label band is visible
        await navToScene(page, "cube", "Controls");
        await page.waitForTimeout(700);
        await page.screenshot({ path: SHOT("cube-dock-closed.png") });
        // click the scene select to expand the dropdown
        try {
            await page.click('[aria-label="Scene"]', { timeout: 3000 });
            await page.waitForTimeout(500);
            await page.screenshot({ path: SHOT("cube-dock-scene-expanded.png") });
        } catch (e) {
            console.log("scene-expand click failed:", e.message);
        }
        console.log("\n=== CUBE wrapped (≥2 lines) ===");
        for (const w of await page.evaluate(WRAP_FN)) console.log(JSON.stringify(w));

        // mobile pass for dock label wrap
        return true;
    },
);

// mobile
await withPage(
    {
        distDir: new URL("../../../../dist/gh-pages", import.meta.url).pathname,
        context: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
        label: "wrap-probe-mobile",
    },
    async (page, { url }) => {
        await page.goto(url + "/#/", { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        console.log("\n=== HOME@mobile wrapped (≥2 lines) ===");
        for (const w of await page.evaluate(WRAP_FN)) console.log(JSON.stringify(w));
        await page.screenshot({ path: SHOT("home-mobile.png") });
        await navToScene(page, "spring", "Spring");
        await page.waitForTimeout(700);
        await page.screenshot({ path: SHOT("spring-mobile.png") });
        console.log("\n=== SPRING@mobile wrapped (≥2 lines) ===");
        for (const w of await page.evaluate(WRAP_FN)) console.log(JSON.stringify(w));
        return true;
    },
);
