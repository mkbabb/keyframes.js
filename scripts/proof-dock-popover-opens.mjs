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
    // the explanatory prose, only a real markup tag. The @mbabb menu markup moved
    // out of App.vue into app/dock/MbabbMenu.vue at S.D1 (a23 F2).
    const menu = read(path.join(DEMO, "app/dock/MbabbMenu.vue")).replace(/<!--[\s\S]*?-->/g, "");

    // Isolate the @mbabb <DropdownMenu> block — the trigger lives between the
    // opening <DropdownMenu and the first <DropdownMenuContent.
    const menuOpen = menu.indexOf("<DropdownMenu");
    const contentIdx = menu.indexOf("<DropdownMenuContent", menuOpen);
    const triggerBlock = menuOpen !== -1 && contentIdx !== -1 ? menu.slice(menuOpen, contentIdx) : "";

    // (a) the inner DockDropdownTrigger IS mounted (the reka trigger that opens it).
    const hasDockTrigger = /<DockDropdownTrigger\b/.test(triggerBlock);
    // (b) NO outer DropdownMenuTrigger wraps it (the double-wrap that swallowed the
    //     click). Forbid both the tag in the trigger block AND the import.
    const hasOuterWrapTag = /<DropdownMenuTrigger\b/.test(triggerBlock);
    const importsOuterTrigger = /import[^;]*\bDropdownMenuTrigger\b[^;]*from/.test(menu);

    if (hasDockTrigger && !hasOuterWrapTag) {
        ok("MbabbMenu.vue mounts <DockDropdownTrigger> directly inside <DropdownMenu> (no outer wrap)");
    } else if (!hasDockTrigger) {
        fail("MbabbMenu.vue @mbabb menu must mount a <DockDropdownTrigger> (the reka trigger) inside <DropdownMenu>");
    } else {
        fail(
            "MbabbMenu.vue @mbabb menu still wraps the trigger in an outer <DropdownMenuTrigger> — " +
                "the double-wrap swallows the click (BLK-8); use <DockDropdownTrigger> directly",
        );
    }

    if (!importsOuterTrigger) {
        ok("MbabbMenu.vue does not import DropdownMenuTrigger (the now-unused outer-wrap symbol)");
    } else {
        fail(
            "MbabbMenu.vue still imports DropdownMenuTrigger — drop the now-unused import (BLK-8 step b)",
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
        //
        // K.W1 — track the glass-ui 3.13.0 consumed reality (AZ.W-DOCK-FLICKER, the
        // HOVER_INTENT_MS = 60 hover-hysteresis): a collapsed→hover expand only commits
        // after the pointer DWELLS on the dock for ≥60ms — "a sweeping-edge enter is
        // canceled by the chasing leave inside this window" (dock constants.d.ts). The
        // @mbabb trigger lives in the TOP dock (ChromeDock, top-center), so the prior
        // hover-then-`mouse.move(640, 870)` (bottom-center) sequence was exactly that
        // canceled sweep: the bottom move fired onMouseLeave on the top dock and cleared
        // the pending 60ms expand before it could commit, so @mbabb never painted. The
        // gesture a real user makes — and the one the 3.13.0 intent-dwell rewards — is to
        // hover the dock that OWNS the trigger and DWELL. So hover the .glass-dock that
        // contains the trigger and hold past the intent window (NO pointer-leave move).
        // This is an actuation fix to match the consumed dock behavior, NOT a threshold
        // relaxation: the gate's assertion (a trusted click OPENS the @mbabb popover) is
        // unchanged below; only HOW the collapsed dock is coaxed open is corrected.
        const TRIGGER = '[aria-label="@mbabb menu"]';
        let expanded = false;
        for (let i = 0; i < 30 && !expanded; i++) {
            try {
                // Hover the .glass-dock that OWNS the @mbabb trigger (the top dock) and
                // DWELL — Playwright's .hover() centers the pointer on the dock; holding
                // there (no leave) lets the 60ms hover-intent commit the expand.
                const ownerDock = page.locator(".glass-dock").filter({ has: page.locator(TRIGGER) }).first();
                const dock = (await ownerDock.count()) ? ownerDock : page.locator(".glass-dock").first();
                if (await dock.count()) await dock.hover({ force: true }).catch(() => {});
                // DWELL past HOVER_INTENT_MS (60) + the morph settle — do NOT move the
                // pointer off the dock (that would re-arm the AZ.W-DOCK-FLICKER cancel).
                await page.waitForTimeout(250);
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
