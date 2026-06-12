// K audit — COLD-PATH probe. Drives the BUILT dist/gh-pages hero exactly as a
// first-time human: land on #/, find the rainbow play CTA, click it ONCE, and
// observe whether the cube subject SMOOTHLY animates while the playhead advances.
// This is the axis the J gate battery never exercised (every play-driving leg
// seeds controls open and/or navigates direct to #/cube first).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.join(REPO, "docs/tranches/K/audit/screenshots-k");

const log = (...a) => console.log(...a);

async function sampleSubject(page, ms = 1500) {
    return page.evaluate(async (dur) => {
        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        const seen = new Set();
        const samples = [];
        const t0 = performance.now();
        while (performance.now() - t0 < dur) {
            for (const sel of [".cube", ".cube-target", ".graph", ".cube-face"]) {
                for (const el of document.querySelectorAll(sel)) {
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") {
                        seen.add(sel + "|" + t);
                        if (samples.length < 6) samples.push(sel + "=" + t.slice(0, 40));
                    }
                }
            }
            await sleep(30);
        }
        return { distinct: seen.size, samples };
    }, ms);
}

async function readPlayheadAndSubject(page, ms = 1800) {
    // Sample BOTH the playhead/slider position AND the subject transform over the
    // same window. The bug signature: playhead advances (many distinct slider
    // values) while subject is FROZEN (≤1 distinct transform).
    return page.evaluate(async (dur) => {
        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        const subj = new Set();
        const playhead = new Set();
        const t0 = performance.now();
        while (performance.now() - t0 < dur) {
            for (const sel of [".cube", ".cube-target", ".graph"]) {
                for (const el of document.querySelectorAll(sel)) {
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") subj.add(sel + "|" + t);
                }
            }
            // Playhead surfaces: a range input, a progress fill, a slider thumb.
            for (const el of document.querySelectorAll(
                'input[type=range], [role=slider], .progress-bar, [class*="progress"][style*="width"], [class*="playhead"]',
            )) {
                const v =
                    el.value ??
                    el.getAttribute("aria-valuenow") ??
                    el.style.width ??
                    getComputedStyle(el).width;
                if (v != null) playhead.add(String(v));
            }
            await sleep(30);
        }
        return { subjectDistinct: subj.size, playheadDistinct: playhead.size };
    }, ms);
}

await withPage(
    { distDir: DIST, label: "K cold-path hero probe" },
    async (_p, { url: base, browser }) => {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push("pageerror: " + String(e?.message ?? e).slice(0, 120)));
        page.on("console", (m) => {
            if (m.type() === "error") errors.push("console.error: " + m.text().slice(0, 120));
        });

        // ── COLD ENTRY — land on the hero, NO seeding, NO direct cube nav. ──
        await page.goto(`${base}/#/`, { waitUntil: "load" });
        await page.waitForTimeout(1200);

        // What scene does the machine rest on at cold mount?
        const mountState = await page.evaluate(() => {
            let scene = null;
            try {
                const mk = Object.keys(localStorage).find((k) => /scene-machine|scene_machine|sceneMachine/i.test(k));
                scene = mk ? JSON.parse(localStorage.getItem(mk) || "{}").activeScene : "(no key)";
            } catch {}
            // Find the rainbow play CTA the human would click.
            const btns = [...document.querySelectorAll("button")].filter((b) => {
                const al = (b.getAttribute("aria-label") || "").toLowerCase();
                const cls = (b.className || "").toString();
                return al.includes("play") || /rainbow/.test(cls);
            });
            return {
                scene,
                hasStartScreen: !!document.querySelector(".editor-start-screen, [class*='start-screen'], .hero-display"),
                playButtons: btns.map((b) => ({
                    aria: b.getAttribute("aria-label"),
                    cls: (b.className || "").toString().slice(0, 60),
                    visible: b.getBoundingClientRect().width > 0,
                })),
            };
        });
        log("COLD MOUNT STATE:", JSON.stringify(mountState, null, 2));
        await page.screenshot({ path: path.join(SHOTS, "k-cold-01-hero.png") });

        // ── THE FIRST GESTURE — click the rainbow play CTA. ──
        // Try the same selectors the live-session gate's clickRainbowPlay uses,
        // PLUS the collapsed-dock mirror (the dock starts collapsed per U-K1).
        const playSelectors = [
            'button[aria-label*="Play animation"]',
            'button[aria-label*="play" i]',
            ".btn-playback-play",
            '[data-testid="group-play"]',
        ];
        let clicked = null;
        for (const sel of playSelectors) {
            const el = page.locator(sel).first();
            if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
                await el.click({ force: true, timeout: 2500 }).catch((e) => log("click err", String(e).slice(0, 80)));
                clicked = sel;
                break;
            }
        }
        // If the dock is collapsed, hover it first then re-find.
        if (!clicked) {
            const dock = page.locator(".glass-dock, [class*='dock']").first();
            if ((await dock.count()) > 0) {
                const box = await dock.boundingBox().catch(() => null);
                if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await page.waitForTimeout(400);
                for (const sel of playSelectors) {
                    const el = page.locator(sel).first();
                    if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
                        await el.click({ force: true, timeout: 2500 }).catch(() => {});
                        clicked = sel + " (after dock hover)";
                        break;
                    }
                }
            }
        }
        log("CLICKED:", clicked);

        // ── OBSERVE — does the cube smoothly animate now, cold? ──
        await page.waitForTimeout(600);
        const afterScene = await page.evaluate(() => {
            try {
                const mk = Object.keys(localStorage).find((k) => /scene-machine|sceneMachine/i.test(k));
                return mk ? JSON.parse(localStorage.getItem(mk) || "{}").activeScene : "(no key)";
            } catch {
                return "(err)";
            }
        });
        log("SCENE AFTER PLAY CLICK:", afterScene);

        const both = await readPlayheadAndSubject(page, 2000);
        log("COLD-PLAY OBSERVE (playhead vs subject):", JSON.stringify(both));
        await page.screenshot({ path: path.join(SHOTS, "k-cold-02-after-play.png") });

        // ── CONTRAST — the CHOREOGRAPHED path the gate exercises (direct cube
        //    nav + seed controls open), to show it WORKS where cold fails. ──
        const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page2 = await ctx2.newPage();
        await page2.addInitScript(() => {
            try {
                localStorage.setItem(
                    "animation-groups-control-options-store",
                    JSON.stringify({ isControlsPanelOpen: true }),
                );
            } catch {}
        });
        await page2.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page2.waitForTimeout(1500);
        for (const sel of playSelectors) {
            const el = page2.locator(sel).first();
            if ((await el.count()) > 0) {
                await el.click({ force: true, timeout: 2500 }).catch(() => {});
                break;
            }
        }
        await page2.waitForTimeout(600);
        const choreographed = await readPlayheadAndSubject(page2, 2000);
        log("CHOREOGRAPHED OBSERVE (direct cube + seeded):", JSON.stringify(choreographed));

        log("\nERRORS:", errors.length ? JSON.stringify(errors.slice(0, 6), null, 2) : "(none)");

        await ctx.close();
        await ctx2.close();
    },
);
