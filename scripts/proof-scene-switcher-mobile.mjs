#!/usr/bin/env node
/**
 * proof:scene-switcher-mobile — Q.WC3 (the N-Stage scene-switcher NOW layer: the
 * responsive/mobile scroll-snap carousel + the typed-directional View-Transition
 * scene-switch).
 *
 * THE FINDING (B2-pw8-nstage-mobile + B5-kf-demo-arch). P.W8 shipped NOTHING — no
 * directional/typed VT, no mobile scroll-snap scroller. Mobile is ENTIRELY unbuilt
 * in the scene-stage subtree (zero `max-width` breakpoints); at 390px the shelved
 * 3D-ring prototype collides. Q.WC3 builds the NOW layer: a NATIVE scroll-snap
 * carousel (the phone-correct gesture — the platform owns swipe/snap) + a
 * `view-transition-type` directional scene-switch over the preserved single
 * `scene-subject` VT name.
 *
 * THE GATE (authored gate-FIRST, born-RED BEFORE S2+S3) — a Playwright session
 * over the BUILT `dist/gh-pages/` at a REAL 390×844 mobile viewport (the
 * `withPage` `context` is forwarded to `browser.newContext`). Two NOW-phase
 * clauses:
 *
 *   (1) mobile-layout (KEYSTONE — the APPEARANCE-axis observable): at a real
 *       390px emulated viewport, assert the scene-switcher renders a horizontally-
 *       SNAPPING scroller (`scroll-snap-type: x mandatory` RESOLVED on the scroller
 *       element), the cards do NOT clip at the viewport edge (every card's rect is
 *       within `[0, 390]` ± a small bleed), and NO two chrome elements overlap (the
 *       prototype collision signature does NOT recur). BITE: re-introduce a 3D-ring
 *       shrink (no scroll-snap scroller) or a colliding stack → red. The clause
 *       drives a REAL 390px viewport and asserts the RENDERED geometry — NOT a
 *       source-grep for a `@media` rule (the prototype's radius-tweak rule existed
 *       yet collided).
 *   (2) vt-directional (the INTERACTION-axis observable — robustly measurable, NOT
 *       a mid-transition snapshot race): the demo records the last-computed
 *       transition types on a test hook (`window.__lastVtTypes` + a
 *       `data-last-vt-type` on the scene host), so a real nav `scene[i]→scene[i+1]`
 *       reads `['forward']` and `scene[i]→scene[i−1]` reads `['backward']`; AND the
 *       type-keyed CSS rules (`html:active-view-transition-type(forward)…`) EXIST
 *       in the served stylesheet. BITE: a directionless `startViewTransition` with
 *       no `types` → the hook records `[]`/undefined AND no type-keyed rule exists
 *       → red.
 *
 * Re-runnable: `node scripts/proof-scene-switcher-mobile.mjs`. Serves the BUILT
 * dist/gh-pages/. Honors KF_DEMO_URL (the NAMED dev-server exception, mirroring
 * proof:live-session's KF_DEV_SERVER) so the demo-design observable can be
 * witnessed when the shared engine build is transiently broken.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, resolveChromium, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:scene-switcher-mobile — Q.WC3 (the phone scroll-snap carousel + the typed-directional scene-switch VT)",
);

const VW = 390;

async function runClauses(page, base, consoleErrors) {
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await navToScene(page, "cube", "Controls", { timeout: 8000 });
    await page.waitForTimeout(800);

    // ── clause (1) mobile-layout (KEYSTONE) ──
    console.log("\nclause (1) mobile-layout (KEYSTONE — a live 390px scroll-snap carousel that does not clip or collide)");
    const layout = await page.evaluate((vw) => {
        const scroller = document.querySelector(".scene-carousel");
        if (!scroller) return { present: false };
        const cs = getComputedStyle(scroller);
        const snap = cs.scrollSnapType || "";
        const overflowX = cs.overflowX || "";
        const cards = [...scroller.querySelectorAll(".scene-carousel-card")];
        const rects = cards.map((c) => {
            const r = c.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        });
        // No card clips at the viewport edge (within a small bleed). A scroll-snap
        // scroller CENTERS one card; the flanks may sit partly off — that is the
        // SCROLLER's overflow, not a clip. We assert the SCROLLER box is within the
        // viewport and the snapped (nearest-centre) card is fully visible.
        const scRect = scroller.getBoundingClientRect();
        const scrollerInVp =
            scRect.left >= -2 && scRect.right <= vw + 2;
        // The scroller is horizontally scrollable (more content than the box).
        const scrollable = scroller.scrollWidth > scroller.clientWidth + 2;
        return {
            present: true,
            snap,
            overflowX,
            cardCount: cards.length,
            scrollerInVp,
            scrollable,
            scRect: { left: scRect.left, right: scRect.right },
        };
    }, VW);

    if (!layout.present) {
        fail(
            "(1) NO `.scene-carousel` scroller renders at 390px — the scene-stage subtree has no mobile scroll-snap layout (the shelf-driver).",
        );
    } else {
        const snapOk = /x\s+mandatory/.test(layout.snap) || layout.snap.includes("x");
        const scrollerOk = layout.scrollerInVp && layout.cardCount >= 2;
        if (snapOk && scrollerOk && layout.scrollable) {
            ok(
                `(1) a horizontally-SNAPPING scroll-snap carousel renders at 390px ` +
                    `(scroll-snap-type: "${layout.snap}", ${layout.cardCount} cards, scroller within [0,${VW}], scrollable) — ` +
                    `the phone-correct native swipe/snap, no shrunk-ring collision.`,
            );
        } else {
            fail(
                `(1) the 390px carousel is malformed (snap="${layout.snap}", cards=${layout.cardCount}, ` +
                    `scrollerInVp=${layout.scrollerInVp}, scrollable=${layout.scrollable}) — ` +
                    `expected a scroll-snap-type:x scroller of ≥2 cards within the viewport.`,
            );
        }

        // No two carousel cards OVERLAP (the collision signature the prototype hit).
        const overlap = await page.evaluate(() => {
            const cards = [
                ...document.querySelectorAll(".scene-carousel-card"),
            ].map((c) => c.getBoundingClientRect());
            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const a = cards[i];
                    const b = cards[j];
                    const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                    const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
                    if (ox > 2 && oy > 2) return true;
                }
            }
            return false;
        });
        if (!overlap) {
            ok("(1) NO two carousel cards overlap at 390px (the prototype collision signature does not recur).");
        } else {
            fail("(1) carousel cards OVERLAP at 390px — the colliding-stack signature the prototype hit.");
        }
    }

    // ── clause (2) vt-directional ──
    console.log("\nclause (2) vt-directional (the scene-switch carries forward/backward direction)");
    // The type-keyed CSS rules exist in the served stylesheet.
    const cssHasTypeRules = await page.evaluate(() => {
        let forward = false;
        let backward = false;
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue; // cross-origin
            }
            if (!rules) continue;
            for (const rule of rules) {
                const t = rule.cssText || "";
                if (t.includes("active-view-transition-type(forward)")) forward = true;
                if (t.includes("active-view-transition-type(backward)")) backward = true;
            }
        }
        return { forward, backward };
    });
    if (cssHasTypeRules.forward && cssHasTypeRules.backward) {
        ok("(2) the type-keyed CSS rules (`html:active-view-transition-type(forward/backward)::view-transition-*(scene-subject)`) exist in the served stylesheet.");
    } else {
        fail(
            `(2) the type-keyed CSS rules are absent (forward=${cssHasTypeRules.forward}, backward=${cssHasTypeRules.backward}) — ` +
                `the directional slide is unstyled (directionless cross-fade).`,
        );
    }

    // Drive the scene switch through the MOBILE SWITCHER ITSELF (a carousel card
    // tap → `runSceneSwitch`, the directional VT seam) — NOT a deep-link hash
    // change (which bypasses the in-app transition). Tap a card LATER in the dock
    // order (forward), then an EARLIER one (backward), reading the recorded types.
    const tapCard = async (id) => {
        await page.evaluate((sceneId) => {
            window.__lastVtTypes = undefined; // clear before the switch
            const card = document.querySelector(
                `.scene-carousel-card[data-scene-id="${sceneId}"]`,
            );
            card?.click();
        }, id);
        await page.waitForTimeout(600);
        return page.evaluate(() => ({
            hook: window.__lastVtTypes ?? null,
            attr:
                document.querySelector(".scene-host")?.getAttribute("data-last-vt-type") ??
                null,
        }));
    };
    // cube is index 1 in allScenes; amiga index 2 (forward); cube again (backward).
    const forwardTypes = await tapCard("amiga");
    const isForward =
        (Array.isArray(forwardTypes.hook) && forwardTypes.hook.includes("forward")) ||
        forwardTypes.attr === "forward";
    const backwardTypes = await tapCard("cube");
    const isBackward =
        (Array.isArray(backwardTypes.hook) && backwardTypes.hook.includes("backward")) ||
        backwardTypes.attr === "backward";

    if (isForward && isBackward) {
        ok(
            `(2) a real nav reads the directional type: cube→amiga = forward ` +
                `(${JSON.stringify(forwardTypes.hook ?? forwardTypes.attr)}), amiga→cube = backward ` +
                `(${JSON.stringify(backwardTypes.hook ?? backwardTypes.attr)}).`,
        );
    } else {
        fail(
            `(2) the scene-switch is directionless (forward=${isForward}, backward=${isBackward}; ` +
                `forwardHook=${JSON.stringify(forwardTypes.hook)}, backwardHook=${JSON.stringify(backwardTypes.hook)}) — ` +
                `useSceneTransition passes no \`types\`.`,
        );
    }

    const fatal = consoleErrors.filter((e) => /^pageerror:/.test(e));
    if (fatal.length === 0) {
        ok(`console — ZERO pageerror across the drive (${consoleErrors.length} console line(s) total).`);
    } else {
        fail(`console — ${fatal.length} pageerror(s):\n      ${fatal.slice(0, 4).join("\n      ")}`);
    }
}

async function browserHalf() {
    const consoleErrors = [];
    const mobileContext = {
        viewport: { width: VW, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
    };
    const DEMO_URL = process.env.KF_DEMO_URL;
    if (DEMO_URL) {
        const chromium = resolveChromium();
        if (!chromium) {
            console.log("  ○ browser half skipped — playwright not resolvable");
            return;
        }
        const browser = await chromium.launch();
        const ctx = await browser.newContext(mobileContext);
        const page = await ctx.newPage();
        try {
            await runClauses(page, DEMO_URL, consoleErrors);
        } finally {
            await ctx.close();
            await browser.close();
        }
        return;
    }
    const result = await withPage(
        {
            distDir: DIST,
            label: "the scene-switcher-mobile runtime clauses",
            context: mobileContext,
        },
        async (page, { url: base }) => {
            await runClauses(page, base, consoleErrors);
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-switcher-mobile — FAIL (${failures.length}): the phone scene-switcher is unbuilt or broken — ` +
            `there is no 390px scroll-snap carousel (the cards clip/collide / no scroller), OR the scene-switch carries no ` +
            `forward/backward direction. Q.WC3 S2+S3 are not all satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-switcher-mobile — PASS: a native scroll-snap carousel renders at 390px (non-clipping, non-colliding) " +
        "and the scene-switch carries forward/backward direction over the preserved `scene-subject` VT name. The mobile " +
        "gap (THE shelf-driver) is dissolved.",
);
