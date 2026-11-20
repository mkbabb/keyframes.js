#!/usr/bin/env node
/**
 * last-ten — the site-owned rows of the keyframes last-ten audit
 * (owner-1112 LAST-TEN/keyframes/FINDINGS.md), each as a falsifiable clause
 * over the built demo (dist/gh-pages), headless Chromium:
 *
 *   KF-04  Keyboard into the Layer sub-pane (on the Amiga, where a layer can
 *          change) and back (Enter, Enter) and a
 *          scroll-into-view of its Back mid-drill (what Playwright's own click,
 *          a focus without preventScroll or an AT does) move no ancestor of the
 *          pane: every ancestor's scrollTop / scrollLeft stays 0.
 *   KF-05  The Keyboard-shortcuts dialog, opened from the @mbabb menu, hands
 *          focus back to the @mbabb trigger when it closes by Escape.
 *   KF-28  It opens only after the menu has gone: no frame holds both the
 *          menu and the dialog's content.
 *   KF-07  The Easing catalogue, scrolled, then away to Spring and browser
 *          Back: the drawer is where it was left.
 *   KF-16  A scene picked from the Scene list: the list fades out (its last
 *          visible frame is under half opacity), it is not removed whole.
 *   KF-27  Opening the Timeline surface raises no "Imported" toast.
 *   KF-09 / KF-15  A swap into the Cube scene carries the die as its own
 *          view-transition group (`kf-subject`): it travels between its two
 *          places, and the compositor stops re-drawing the 3D die inside the
 *          route window's snapshot (the long frame; reported, not bound).
 *
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/observe/demo/last-ten.mjs
 */
import { navToScene, withPage } from "../../lib/demo-driver.mjs";

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};
const check = (cond, label) => (cond ? ok(label) : fail(label));

console.log("last-ten observation — the audit's site-owned rows");

const scrolled = (page) =>
    page.evaluate(() => {
        const out = [];
        const card = document.querySelector("[data-slot=card]");
        for (let e = card; e; e = e.parentElement) {
            if (e.scrollTop || e.scrollLeft) out.push(`${String(e.className).slice(0, 40)} ${e.scrollLeft},${e.scrollTop}`);
        }
        const se = document.scrollingElement;
        if (se && (se.scrollTop || se.scrollLeft)) out.push(`document ${se.scrollLeft},${se.scrollTop}`);
        return out;
    });

const expandDock = async (page) => {
    const b = await page.locator(".glass-dock").first().boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page
        .waitForFunction(() => !document.querySelector(".glass-dock")?.classList.contains("collapsed"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(400);
};
const visible = async (page, selector) => {
    const all = page.locator(selector);
    for (let i = (await all.count()) - 1; i >= 0; i--) if (await all.nth(i).isVisible()) return all.nth(i);
    return all.first();
};

await withPage(
    { label: "last-ten", context: { viewport: { width: 1440, height: 900 }, colorScheme: "dark" } },
    async (page, { url: base }) => {
        // ── KF-04 ────────────────────────────────────────────────────────
        // The Layer row is offered only where a layer can change: a
        // single-target channel (the Amiga's Spin). Its row names the layer's
        // op after the word.
        await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
        await navToScene(page, "amiga", "controls");
        await page.waitForTimeout(1500);
        const layer = page.locator("[data-slot=card] button", { hasText: /^\s*layer/ }).first();
        // In by keyboard (focus lands on Back), out by keyboard mid-arrival.
        await layer.focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(150);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(1000);
        let s = await scrolled(page);
        check(s.length === 0, `KF-04 keyboard Layer drill in/out moves nothing (${s.join(" | ") || "no ancestor scrolled"})`);
        const back = page.locator('[aria-label="Back from Layer to controls"]').first();
        if ((await layer.getAttribute("aria-expanded")) === "true") await back.click();
        await page.waitForTimeout(500);
        await layer.click();
        await page.waitForTimeout(150);
        await page.locator('[aria-label="Back from Layer to controls"]').first().evaluate((e) => e.scrollIntoView());
        await page.waitForTimeout(300);
        s = await scrolled(page);
        check(s.length === 0, `KF-04 scroll-into-view of Back mid-drill moves nothing (${s.join(" | ") || "no ancestor scrolled"})`);
        await page.locator('[aria-label="Back from Layer to controls"]').first().click();
        await page.waitForTimeout(600);
        // The rows below run on the Cube.
        await navToScene(page, "cube", "controls");
        await page.waitForTimeout(1500);

        // ── KF-05 / KF-28 ────────────────────────────────────────────────
        await page.keyboard.press("Escape");
        await expandDock(page);
        await (await visible(page, '[aria-label="@mbabb menu"]')).click();
        await page.waitForTimeout(450);
        await page.evaluate(() => {
            const R = (window.__lt = { both: 0, frames: 0, on: true });
            const tick = () => {
                if (!R.on) return;
                R.frames++;
                const menu = document.querySelector("[role=menu]");
                const dialog = document.querySelector("[data-slot=dialog-content]");
                const op = (el) => {
                    let o = 1;
                    for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity) || 0;
                    return o;
                };
                if (menu && dialog && op(menu) > 0.05 && op(dialog) > 0.05) R.both++;
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
        await page.locator("[role=menuitem]", { hasText: "Keyboard shortcuts" }).first().click();
        await page.waitForTimeout(900);
        const overlap = await page.evaluate(() => {
            window.__lt.on = false;
            return window.__lt;
        });
        check(
            overlap.both === 0 && (await page.locator("[data-slot=dialog-content]").count()) > 0,
            `KF-28 the dialog opens after the menu has gone (${overlap.both} of ${overlap.frames} frames held both)`,
        );
        await page.keyboard.press("Escape");
        await page.waitForTimeout(900);
        const focusAfter = await page.evaluate(
            () => document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName,
        );
        check(focusAfter === "@mbabb menu", `KF-05 shortcuts dialog close returns focus to the @mbabb trigger (focus: ${focusAfter})`);

        // ── KF-27 ────────────────────────────────────────────────────────
        await page.mouse.move(5, 895);
        await expandDock(page);
        await (await visible(page, '[aria-label="Editor surfaces"]')).click();
        await page.waitForTimeout(450);
        await page.locator('[data-dock-surface-item][data-surface="timeline"]').first().click();
        await page.waitForTimeout(1500);
        const toasts = await page.evaluate(() =>
            [...document.querySelectorAll("[data-slot=toast]")].map((t) => t.textContent.trim().slice(0, 40)),
        );
        check(!toasts.some((t) => /Imported/.test(t)), `KF-27 opening the Timeline raises no import toast (${JSON.stringify(toasts)})`);

        // ── KF-07 ────────────────────────────────────────────────────────
        await navToScene(page, "easing", "controls");
        await page.waitForTimeout(2000);
        const before = await page.evaluate(() => {
            const d = document.querySelector(".specimen-drawer");
            if (!d) return null;
            d.scrollTop = 600;
            return d.scrollTop;
        });
        await page.waitForTimeout(400);
        await navToScene(page, "spring", "controls");
        await page.waitForTimeout(1200);
        await page.goBack();
        await page.waitForTimeout(2500);
        const after = await page.evaluate(() => document.querySelector(".specimen-drawer")?.scrollTop ?? null);
        check(
            before !== null && after !== null && Math.abs(after - before) <= 2,
            `KF-07 Back to Easing restores the catalogue scroll (left at ${before}, back at ${after})`,
        );

        // ── KF-09 / KF-15 ────────────────────────────────────────────────
        // Into the Cube scene the die travels as the swap's own group (the
        // compositor no longer re-draws the 3D die inside the route window's
        // snapshot, the 0.5–1.2 s frame), on the route's lateral clock.
        await navToScene(page, "spring", "controls");
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const R = (window.__vt = { groups: [], longest: 0, on: true, last: performance.now() });
            const tick = (t) => {
                if (!R.on) return;
                R.longest = Math.max(R.longest, t - R.last);
                R.last = t;
                for (const a of document.getAnimations()) {
                    const pe = a.effect?.pseudoElement;
                    if (pe && pe.includes("kf-subject")) R.groups.push([pe, a.effect.getTiming().duration]);
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            location.hash = "#/cube";
        });
        await page.waitForTimeout(2500);
        const vt = await page.evaluate(() => {
            window.__vt.on = false;
            const clock = getComputedStyle(document.documentElement).getPropertyValue("--route-lateral-clock").trim();
            return { groups: [...new Set(window.__vt.groups.map((g) => g.join(" ")))], longest: Math.round(window.__vt.longest), clock };
        });
        check(
            vt.groups.length > 0,
            `KF-09/15 the die is the swap's own view-transition group (${vt.groups.join(", ") || "none"}; longest frame ${vt.longest} ms, reported)`,
        );

        // ── KF-16 ────────────────────────────────────────────────────────
        await page.mouse.move(5, 895);
        await expandDock(page);
        await page.locator('[aria-label="Scene"][role=combobox]').first().click();
        await page.waitForTimeout(450);
        await page.evaluate(() => {
            const R = (window.__lb = { last: null, on: true });
            const tick = () => {
                if (!R.on) return;
                const lb = document.querySelector("[role=listbox]");
                if (lb) {
                    let o = 1;
                    for (let e = lb; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity) || 0;
                    R.last = o;
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
        await page.locator("[role=option]", { hasText: /^\s*Square\s*$/ }).first().click();
        await page.waitForTimeout(1500);
        const lastOpacity = await page.evaluate(() => {
            window.__lb.on = false;
            return window.__lb.last;
        });
        check(
            lastOpacity !== null && lastOpacity < 0.5,
            `KF-16 the Scene list fades on a pick (last visible opacity ${lastOpacity?.toFixed?.(2)})`,
        );
    },
);

if (failures.length) {
    console.error(`last-ten: ${failures.length} RED`);
    process.exit(1);
}
console.log("last-ten: GREEN");
