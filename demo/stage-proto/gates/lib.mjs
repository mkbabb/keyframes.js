import { createRequire } from "module";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
export const { chromium } = req("playwright-core");

export const URL = "http://localhost:5231/";
export const SHOTS =
    "/Users/mkbabb/Programming/keyframes.js/docs/tranches/S/audit/pass3/proto-shots-v2";

export async function launch() {
    return chromium.launch({ headless: true });
}

/**
 * Open a page with a given theme + optional reduced-motion, seeded storage, and
 * wait for the proto root. Returns { page, context, errors }.
 */
export async function openPage(
    browser,
    {
        theme = "dark",
        reducedMotion = "no-preference",
        width = 1440,
        height = 900,
        hash = "#cube",
        hintDismissed = true, // default: hide the hint so shots are clean
    } = {},
) {
    const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 2,
        reducedMotion,
    });
    const errors = [];
    const page = await context.newPage();
    page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    // seed storage BEFORE the app script runs
    await context.addInitScript(
        ([t, hd]) => {
            localStorage.setItem("vueuse-color-scheme", t);
            if (hd) localStorage.setItem("kf-stage-hint-dismissed", "true");
            else localStorage.removeItem("kf-stage-hint-dismissed");
        },
        [theme, hintDismissed],
    );
    await page.goto(URL + hash, { waitUntil: "networkidle" });
    await page.waitForSelector(".proto-root");
    await page.waitForTimeout(150);
    return { page, context, errors };
}

/** Open the stage and wait for the carousel phase. */
export async function openStage(page) {
    await page.click('[data-testid="scene-pill"]');
    await page.waitForFunction(
        () =>
            document.querySelector(".scene-stage")?.getAttribute(
                "data-stage-phase",
            ) === "carousel",
        { timeout: 4000 },
    );
}

export async function phase(page) {
    return page.$eval(".scene-stage", (el) =>
        el.getAttribute("data-stage-phase"),
    ).catch(() => "closed");
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
