#!/usr/bin/env node
/**
 * proof:dock-popover-opens — H.W1 S8 / BLK-8 (the @mbabb dock popover OPENS).
 *
 * The D9 owner in BLK-3's split (the popover-OPENS half, kf-patched HERE; the
 * dock-spring LAG half is H.W8's `proof:dock-morph-settled`). The defect: the
 * @mbabb DropdownMenu trigger was DOUBLE-WRAPPED — an outer
 * `<DropdownMenuTrigger as-child>` around the inner `<DockDropdownTrigger>` (itself
 * a reka trigger). The outer trigger swallowed the click that should open the menu
 * (live: `aria-expanded:false`, `finalOpen:false`). S8's fix mounts
 * `<DockDropdownTrigger>` DIRECTLY inside `<DropdownMenu>` (mirroring
 * `DockSelectTrigger`).
 *
 * Two falsifiable clauses, each BITING on the exact defect:
 *
 *   1. SOURCE-SHAPE (STATIC — always runs). `App.vue`'s @mbabb menu mounts a
 *      `<DockDropdownTrigger>` DIRECTLY inside `<DropdownMenu>` with NO outer
 *      `<DropdownMenuTrigger>` wrapper, and the `DropdownMenuTrigger` import is
 *      absent. BITE: re-introduce the outer `<DropdownMenuTrigger as-child>` wrap
 *      (or its import) → the double-wrap returns → reds.
 *
 *   2. FINAL-OPEN (BROWSER — runs when playwright resolves + dist is built).
 *      Expand the dock (hover), find the @mbabb trigger by its accessible name,
 *      assert it rests CLOSED (`aria-expanded:false`), TRUSTED-click it, and assert
 *      it opens (`finalOpen:true` — `aria-expanded:true` AND a `role="menu"` content
 *      node renders). BITE: the double-wrapped trigger swallows the click → the menu
 *      never opens → `finalOpen:false` → reds (the exact born-RED-today live state).
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). The S-Harness note (H.W1.md §Hard
 * gate): the @mbabb trigger lives in the dock CHROME (present on every route — no
 * scene nav needed), so this gate does not goto-clear storage mid-test; it serves
 * the BUILT dist and drives the dock with a real hover+click. Under
 * KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE LIB SEAM.
 * Re-runnable: `node scripts/proof-dock-popover-opens.mjs`. The browser half
 * serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:dock-popover-opens — H.W1 S8/BLK-8 (the @mbabb dock popover opens on click)");

// ── 1. SOURCE-SHAPE (static, always runs) ────────────────────────────────────
{
    // Strip HTML comments first — the S8 fix is DOCUMENTED in a comment that names
    // `<DropdownMenuTrigger` (the wrapper it dropped); the tag regex must not match
    // the explanatory prose, only a real markup tag.
    const app = read(path.join(DEMO, "app/App.vue")).replace(/<!--[\s\S]*?-->/g, "");

    // Isolate the @mbabb <DropdownMenu> block — the trigger lives between the
    // opening <DropdownMenu and the first <DropdownMenuContent.
    const menuOpen = app.indexOf("<DropdownMenu");
    const contentIdx = app.indexOf("<DropdownMenuContent", menuOpen);
    const triggerBlock = menuOpen !== -1 && contentIdx !== -1 ? app.slice(menuOpen, contentIdx) : "";

    // (a) the inner DockDropdownTrigger IS mounted (the reka trigger that opens it).
    const hasDockTrigger = /<DockDropdownTrigger\b/.test(triggerBlock);
    // (b) NO outer DropdownMenuTrigger wraps it (the double-wrap that swallowed the
    //     click). Forbid both the tag in the trigger block AND the import.
    const hasOuterWrapTag = /<DropdownMenuTrigger\b/.test(triggerBlock);
    const importsOuterTrigger = /import[^;]*\bDropdownMenuTrigger\b[^;]*from/.test(app);

    if (hasDockTrigger && !hasOuterWrapTag) {
        ok("App.vue @mbabb menu mounts <DockDropdownTrigger> directly inside <DropdownMenu> (no outer wrap)");
    } else if (!hasDockTrigger) {
        fail("App.vue @mbabb menu must mount a <DockDropdownTrigger> (the reka trigger) inside <DropdownMenu>");
    } else {
        fail(
            "App.vue @mbabb menu still wraps the trigger in an outer <DropdownMenuTrigger> — " +
                "the double-wrap swallows the click (BLK-8); use <DockDropdownTrigger> directly",
        );
    }

    if (!importsOuterTrigger) {
        ok("App.vue does not import DropdownMenuTrigger (the now-unused outer-wrap symbol)");
    } else {
        fail(
            "App.vue still imports DropdownMenuTrigger — drop the now-unused import (App.vue:152, BLK-8 step b)",
        );
    }
}

// ── 2. FINAL-OPEN (browser, gated) ───────────────────────────────────────────
async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the finalOpen:true click assertion",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
        // The @mbabb trigger is dock chrome — present on every route. Land on a
        // non-home editor scene (the dock is fully populated there).
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });

        // The dock starts collapsed (ChromeDock :start-collapsed="true"); hover it
        // to expand so the @mbabb trigger paints + becomes hit-testable. Hover
        // dispatches the mouseenter/pointermove the dock listens for.
        const TRIGGER = '[aria-label="@mbabb menu"]';
        let expanded = false;
        for (let i = 0; i < 30 && !expanded; i++) {
            try {
                // Hover the dock region (the collapsed pill sits bottom-center).
                const dock = page.locator(".z-dock, [class*='z-dock']").first();
                if (await dock.count()) await dock.hover({ force: true }).catch(() => {});
                // Belt-and-braces: hover the viewport bottom-center too.
                await page.mouse.move(640, 870);
                await page.waitForTimeout(150);
                expanded = await page
                    .locator(TRIGGER)
                    .first()
                    .isVisible()
                    .catch(() => false);
            } catch {
                /* re-poll */
            }
            if (!expanded) await page.waitForTimeout(150);
        }

        if (!expanded) {
            fail(
                "dock-popover-opens — the @mbabb trigger never became visible after expanding the dock " +
                    "(the dock did not expand on hover, or the trigger did not render)",
            );
        } else {
            const trigger = page.locator(TRIGGER).first();

            // Rest state: the menu is CLOSED.
            const restOpen = await trigger.getAttribute("aria-expanded");
            if (restOpen === "false" || restOpen === null) {
                ok(`@mbabb trigger rests CLOSED (aria-expanded:${restOpen ?? "<none>"})`);
            } else {
                fail(
                    `@mbabb trigger should rest closed before the click — aria-expanded:${restOpen} ` +
                        "(it is already open, so the click cannot witness the OPEN transition)",
                );
            }

            // TRUSTED click (Playwright issues a real, trusted pointer event — the
            // exact gesture the double-wrap swallowed).
            await trigger.click();
            await page.waitForTimeout(250);

            const probe = await page.evaluate((sel) => {
                const btn = document.querySelector(sel);
                const ariaExpanded = btn ? btn.getAttribute("aria-expanded") : null;
                // The reka DropdownMenu content portals a role="menu" node when open.
                const menu = document.querySelector('[role="menu"]');
                const menuVisible = !!menu && menu.getBoundingClientRect().height > 0;
                return { ariaExpanded, menuVisible };
            }, TRIGGER);

            const finalOpen = probe.ariaExpanded === "true" && probe.menuVisible;
            if (finalOpen) {
                ok(
                    "finalOpen:true — a trusted click on the @mbabb trigger opens the menu " +
                        `(aria-expanded:true, role=menu content visible)`,
                );
            } else {
                fail(
                    `finalOpen:true — a trusted click did NOT open the @mbabb menu ` +
                        `(aria-expanded:${probe.ariaExpanded}, menuVisible:${probe.menuVisible}). ` +
                        "The double-wrapped trigger swallows the click (BLK-8 — born-RED today).",
                );
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:dock-popover-opens — FAIL (${failures.length}): the @mbabb dock popover ` +
            `does not open on click (the double-wrapped trigger swallows it — D9/BLK-8).`,
    );
    process.exit(1);
}
console.log("\nproof:dock-popover-opens — PASS: the @mbabb dock popover opens on a trusted click (S8).");
