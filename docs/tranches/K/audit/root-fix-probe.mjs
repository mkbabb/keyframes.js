// Verify the ROOT seam: a single `.dock-label { font-family: var(--font-display) }`
// rule flips EVERY dock-label site to display in ONE place (no per-site patch).
// Read-only experiment (injected at runtime, dist unchanged).
import { withPage, navToScene } from "../../../../scripts/lib/demo-driver.mjs";
import path from "node:path";
const SHOT = (n) => path.resolve(new URL(".", import.meta.url).pathname, "screenshots-k", n);

const VOICE = () => {
    const voiceOf = (ff) => {
        const f = (ff || "").split(",")[0].trim().replace(/^["']|["']$/g, "").toLowerCase();
        if (/instrument serif/.test(f)) return "DISPLAY";
        if (/ui-sans|system-ui|-apple-system|segoe|roboto|helvetica|arial|sans-serif/.test(f)) return "SANS";
        if (/fira|mono/.test(f)) return "MONO";
        return f;
    };
    const out = [];
    for (const el of document.querySelectorAll(".dock-label, .dock-scene-title")) {
        let t = "";
        for (const n of el.childNodes) if (n.nodeType === 3) t += n.textContent;
        t = t.replace(/\s+/g, " ").trim();
        const cs = getComputedStyle(el);
        out.push({ cls: el.className.slice(0, 24), text: t.slice(0, 24), voice: voiceOf(cs.fontFamily) });
    }
    return out;
};

await withPage(
    {
        distDir: new URL("../../../../dist/gh-pages", import.meta.url).pathname,
        context: { viewport: { width: 1440, height: 900 } },
        label: "root-fix-probe",
    },
    async (page, { url }) => {
        await page.goto(url + "/#/", { waitUntil: "networkidle" });
        await navToScene(page, "cube", "Controls");
        await page.waitForTimeout(800);
        console.log("=== BEFORE (cube dock) ===");
        for (const v of await page.evaluate(VOICE)) console.log(JSON.stringify(v));
        // inject the candidate ROOT rule
        await page.addStyleTag({
            content: `.dock-label{font-family:var(--font-display)!important;}`,
        });
        await page.waitForTimeout(300);
        console.log("=== AFTER .dock-label{font-family:var(--font-display)} ===");
        for (const v of await page.evaluate(VOICE)) console.log(JSON.stringify(v));
        await page.screenshot({ path: SHOT("cube-dock-AFTER-root-fix.png") });
        return true;
    },
);
