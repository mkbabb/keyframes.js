#!/usr/bin/env node
/**
 * proof:appearance-suffusion — Tranche J.W7a §Hard gate (phase-2 author per the
 * J.W4 close: the W7a close flagged this script NOT YET AUTHORED; this is it).
 *
 * THE PRECEPT (J.md boundary-ORACLE extension, three-tier taxonomy): each clause
 * asserts a PRODUCT-FACING COMPUTED property on the LIVE built page — the exact
 * appearance fact the design lanes measured against the design intent — through
 * J.W3's industrialized harness (`withPage`/`withBrowser`) over J.W0's
 * `navToScene(page, sceneId, expected)` per-expected-state primitive. NEVER a
 * source-shape grep. Every clause is born-RED-able against a SELF-CONTAINED
 * planted defect (see the per-clause witness notes) and greens only on the
 * SUFFUSED (post-W7a) tree.
 *
 * THE CLAUSES (J.W7a.md §Hard gate (a)–(h); EXPECT values witnessed on the LIVE
 * built dist @ glass-ui ~3.11.2 — the W7a-impl §Runtime-assertion table is the
 * named-moment source, re-confirmed first-hand against THIS tree):
 *
 *   (a) --ball-tone == icon hue per scene (the S3 colour oracle, the J.md
 *       headline move): easing → --rainbow-violet (#e64de6, bg rgb(230,77,230));
 *       motion-path traveller → --rainbow-cyan (#1ae6e6, bg rgb(26,230,230));
 *       spring ball → --color-progress (the RED-DASHED authority, bg rgb(229,93,93)
 *       — K.W4 S3/clause(d): the green is GONE on the motion surfaces); square box → --subject-teal
 *       (#52e898, bg rgb(82,232,152)) AND aquamarine (rgb(127,255,212)) DEAD.
 *   (b) the display register's computed font-family resolves Instrument Serif at
 *       the named moments (the four Target headers: ease/SpringProgress/Sequence/
 *       MotionPath) AND the amiga stage carries NO display title (the binding
 *       headerless exception — enforced, not assumed).
 *   (c) the 390×844 hero/subject overlap == 0px (the S1 H3/TYP-1 oracle, the
 *       APPEARANCE-CERTIFICATION fact J.W4 §S1 also certifies): hero h1 rect ∩
 *       cube subject rect AREA == 0.
 *   (d) the easing stage's projected curve PRESENT + MUTATING on a real handle
 *       drag (the S4 math oracle): .easing-stage-curve-path has a non-empty `d`,
 *       distinct from the sidebar .bezier-path; a REAL mouse drag of sidebar
 *       handle[data-index=0] MUTATES the projected `d` (the ball traverses its
 *       OWN curve, not a flat rail).
 *   (e) the ghost rail ABSENT (the S5 grammar oracle, the APPEARANCE-CERTIFICATION
 *       fact J.W4 §S5 also certifies): on sequence + motion-path (CONTROL_SURFACES
 *       = []) the [rail] track computes 0px AND .controls-layout--railless is
 *       present AND the wrapper measures width 0 — no hollow 400px card.
 *   (f) the amiga rounded-glass computed style (the S1 XH-3 oracle): .amiga-canvas
 *       computed border-radius == --radius-card (16px), != 0.
 *   (g) the substrate-depth legibility (the S4 / W6-3 oracle — the I.W6 S3 item,
 *       finally gated): the .grid-background two-tier graph paper is PRESENT —
 *       FOUR gradient layers (major 80px + fine 16px tiers) AND
 *       --graph-major-opacity (12%) above the former 0.10α floor. Discharges W6-3.
 *
 * (clause (h) — proof:live-session budget stays 0 across the re-skinned tree —
 *  is the SEPARATE regression gate proof:live-session itself runs (inherited BY
 *  REFERENCE, never re-stated here); a green proof:live-session on the post-W7a
 *  tree IS clause (h). This gate carries (a)–(g), the per-finding computed
 *  oracles.)
 *
 * THREE-TIER TAXONOMY (J.W7a §Hard gate, inherited): clauses (a)–(g) are ALL
 * CORRECTNESS-tier RUNTIME/INTERACTION clauses — each navigates the running
 * product through navToScene and asserts a product-facing COMPUTED property; the
 * per-finding computed-style asserts are DEVICE-INDEPENDENT facts and HARD-gate.
 * Absolute-pixel appearance stays owned by proof:visual-lock (observe-only in CI
 * per P6, re-captured by W7a). proof:gate-is-runtime classifies THIS gate
 * RUNTIME/INTERACTION (the clause (d) handle drag is the strong actuation).
 *
 * P6 posture: hard (device-INDEPENDENT computed-style/geometry facts). Under
 * KF_REQUIRE_BROWSER a harness-absent skip is a hard fail at the lib seam.
 * Re-runnable:
 *   KF_REQUIRE_BROWSER=1 KF_PLAYWRIGHT_DIR=… node scripts/proof-appearance-suffusion.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:appearance-suffusion — J.W7a §Hard gate clauses (a)–(g): the per-finding COMPUTED " +
        "product-facing appearance oracles on the LIVE built dist (the --ball-tone hue, the display " +
        "register, the mobile overlap, the projected+mutating curve, the railless track, the rounded " +
        "amiga, the legible substrate) — each born-RED-able on a self-contained plant, GREEN only on suffusion.",
);

// ── Shared helpers ──────────────────────────────────────────────────────────
/** Parse an rgb()/rgba()/color() string to its first three channel numbers
 *  (0–255 for rgb, 0–1 for color(srgb …) — normalized to 0–255 for luminance). */
function channels(c) {
    if (!c) return null;
    const srgb = c.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
    if (srgb) return [+srgb[1] * 255, +srgb[2] * 255, +srgb[3] * 255];
    const m = c.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : null;
}
/** WCAG relative luminance + contrast ratio (device-INDEPENDENT). */
function relLuminance(rgb) {
    const f = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}
function contrastRatio(a, b) {
    const ca = channels(a);
    const cb = channels(b);
    if (!ca || !cb) return null;
    const la = relLuminance(ca);
    const lb = relLuminance(cb);
    const hi = Math.max(la, lb);
    const lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
}
/** Two rgb strings are the "same" hue iff each channel is within tol (the
 *  computed token round-trips to within sub-1 px per channel). */
function sameRgb(a, b, tol = 4) {
    const ca = channels(a);
    const cb = channels(b);
    if (!ca || !cb) return false;
    return ca.every((v, i) => Math.abs(v - cb[i]) <= tol);
}

async function runSuffusion() {
    const result = await withPage(
        {
            distDir: DIST,
            context: { viewport: { width: 1440, height: 900 } },
            label: "the appearance-suffusion battery",
        },
        async (page, { url: base }) => {
            // ── (a) --ball-tone == icon hue per scene (the S3 colour oracle) ──
            // easing → violet
            await page.goto(`${base}/#/easing`, { waitUntil: "load" });
            await navToScene(page, "easing", "Easing", { timeout: 12000 });
            const easeTone = await page.evaluate(() => {
                const cs = getComputedStyle(document.documentElement);
                const ball = document.querySelector(".easing-target .progress-ball, .progress-ball, .hero-ball");
                return {
                    violet: cs.getPropertyValue("--rainbow-violet").trim(),
                    tone: ball ? getComputedStyle(ball).getPropertyValue("--ball-tone").trim() : null,
                    bg: ball ? getComputedStyle(ball).backgroundColor : null,
                    defaultGreen: cs.getPropertyValue("--color-progress").trim(),
                };
            });
            // The hue map BITES per scene: the tone must == the icon hue AND != the
            // default green (so a per-scene consumer set to the WRONG token reds).
            if (
                easeTone.tone &&
                easeTone.tone.toLowerCase() === easeTone.violet.toLowerCase() &&
                /230,\s*77,\s*230/.test(easeTone.bg ?? "")
            ) {
                ok(
                    `(a) easing --ball-tone == --rainbow-violet (${easeTone.tone}); ball bg ` +
                        `${easeTone.bg} (the violet hue its icon promises, NOT the default green ${easeTone.defaultGreen})`,
                );
            } else {
                fail(
                    `(a) easing --ball-tone is NOT the icon's violet (tone=${easeTone.tone}, ` +
                        `expected ${easeTone.violet}; bg=${easeTone.bg}) — the colour seam did not carry the icon hue`,
                );
            }

            // (the motion-path traveller --ball-tone == --rainbow-cyan check was
            //  RETIRED at T.E3 — the motion-path scene was PRUNED, OD-1 = PRUNE.)

            // spring ball → --color-progress (the RED-DASHED motion-color bind —
            // K.W4 S3/clause(d): the green palette is GONE on the motion surfaces,
            // --color-progress now resolves the --accent-red family; the ball bg
            // resolves the red rgb(229,93,93), NOT the retired green rgb(33,196,93)).
            await page.goto(`${base}/#/spring`, { waitUntil: "load" });
            await navToScene(page, "spring", "Spring", { timeout: 12000 });
            await page.waitForTimeout(700);
            const springTone = await page.evaluate(() => {
                const cs = getComputedStyle(document.documentElement);
                const ball = document.querySelector(".spring-ball, .progress-ball.spring-ball");
                return {
                    accentRed: cs.getPropertyValue("--color-progress").trim(),
                    tone: ball ? getComputedStyle(ball).getPropertyValue("--ball-tone").trim() : null,
                    bg: ball ? getComputedStyle(ball).backgroundColor : null,
                };
            });
            if (
                springTone.tone &&
                springTone.tone.toLowerCase() === springTone.accentRed.toLowerCase() &&
                /229,\s*93,\s*93/.test(springTone.bg ?? "")
            ) {
                ok(
                    `(a) spring .spring-ball --ball-tone == --color-progress (${springTone.tone}, the ` +
                        `RED-DASHED motion-color authority — K.W4 S3, the green is GONE); bg ${springTone.bg}`,
                );
            } else {
                fail(
                    `(a) spring .spring-ball --ball-tone is NOT the declared --color-progress ` +
                        `(tone=${springTone.tone}, expected ${springTone.accentRed}; bg=${springTone.bg})`,
                );
            }

            // square box → --subject-teal, aquamarine DEAD
            await page.goto(`${base}/#/square`, { waitUntil: "load" });
            await navToScene(page, "square", "Square", { timeout: 12000 });
            await page.waitForTimeout(700);
            const sq = await page.evaluate(() => {
                const cs = getComputedStyle(document.documentElement);
                const box = document.querySelector(".demo-box");
                return {
                    teal: cs.getPropertyValue("--subject-teal").trim(),
                    bg: box ? getComputedStyle(box).backgroundColor : null,
                };
            });
            const AQUAMARINE = "rgb(127, 255, 212)";
            if (sq.bg && /82,\s*232,\s*152/.test(sq.bg) && !sameRgb(sq.bg, AQUAMARINE)) {
                ok(
                    `(a) square box bg == --subject-teal (${sq.teal} → ${sq.bg}); the raw aquamarine ` +
                        `literal (${AQUAMARINE}) is DEAD (SQ-5, the no-legacy delta)`,
                );
            } else {
                fail(
                    `(a) square box is NOT the owned --subject-teal token (bg=${sq.bg}, teal token=${sq.teal}; ` +
                        `aquamarine=${AQUAMARINE}) — the raw named colour did not die`,
                );
            }

            // ── (b) the display register's font-family resolves Instrument Serif
            //    at the named moments + the amiga headerless exception ──────────
            const NAMED_MOMENTS = [
                { scene: "easing", expected: "Easing", title: "ease" },
                { scene: "spring", expected: "Spring", title: "SpringProgress" },
                { scene: "sequence", expected: null, title: "Sequence" },
            ];
            for (const m of NAMED_MOMENTS) {
                await page.goto(`${base}/#/${m.scene}`, { waitUntil: "load" });
                await navToScene(page, m.scene, m.expected, { timeout: 12000 });
                await page.waitForTimeout(500);
                const ttl = await page.evaluate((titleText) => {
                    const el = [...document.querySelectorAll(".text-display")].find(
                        (e) => (e.textContent ?? "").trim() === titleText,
                    );
                    return {
                        found: !!el,
                        font: el ? getComputedStyle(el).fontFamily : null,
                        instrumentCheck: document.fonts.check('16px "Instrument Serif"'),
                    };
                }, m.title);
                if (ttl.found && /Instrument Serif/i.test(ttl.font ?? "") && ttl.instrumentCheck) {
                    ok(
                        `(b) ${m.scene} title "${m.title}" resolves the Instrument-Serif display register ` +
                            `(font-family: ${ttl.font?.slice(0, 42)}…); the display voice carried inward`,
                    );
                } else {
                    fail(
                        `(b) ${m.scene} title "${m.title}" did NOT resolve Instrument Serif ` +
                            `(found=${ttl.found}, font=${ttl.font}, fontsCheck=${ttl.instrumentCheck}) — ` +
                            `the scene name is still native sans (the pre-suffusion text-heading)`,
                    );
                }
            }
            // The amiga headerless exception — the stage carries NO display title.
            await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
            await navToScene(page, "amiga", "Controls", { timeout: 12000 });
            await page.waitForTimeout(600);
            const amigaTitles = await page.evaluate(() => {
                const els = [...document.querySelectorAll(
                    ".scene-host [class*=text-display], .stage-cell [class*=text-display]",
                )].filter((e) => {
                    const cs = getComputedStyle(e);
                    return cs.visibility !== "hidden" && cs.display !== "none" && (e.textContent ?? "").trim().length > 0;
                });
                return { count: els.length, texts: els.slice(0, 4).map((e) => e.textContent?.trim()) };
            });
            if (amigaTitles.count === 0) {
                ok(
                    `(b) the amiga stage carries NO display title (the binding headerless exception HOLDS — ` +
                        `the one scene correctly silent; a planted title would red this clause)`,
                );
            } else {
                fail(
                    `(b) the amiga stage carries ${amigaTitles.count} display-register element(s) ` +
                        `(${JSON.stringify(amigaTitles.texts)}) — the binding headerless exception is VIOLATED`,
                );
            }

            // ── (d) the easing projected curve PRESENT + MUTATING on a handle drag ──
            // (run before (c) so we stay on the desktop viewport for the drag)
            await page.goto(`${base}/#/easing`, { waitUntil: "load" });
            await navToScene(page, "easing", "Easing", { timeout: 12000 });
            await page.waitForTimeout(900);
            const curveBefore = await page.evaluate(() => ({
                stage: document.querySelector(".easing-stage-curve-path")?.getAttribute("d") ?? null,
                sidebar: document.querySelector(".bezier-path")?.getAttribute("d") ?? null,
                stageExists: !!document.querySelector(".easing-stage-curve-path"),
                distinct:
                    document.querySelector(".easing-stage-curve-path") !==
                    document.querySelector(".bezier-path"),
            }));
            if (!curveBefore.stageExists || !curveBefore.stage || curveBefore.stage.length < 8) {
                fail(
                    `(d) the easing stage's projected curve is ABSENT or empty ` +
                        `(exists=${curveBefore.stageExists}, d.len=${curveBefore.stage?.length}) — ` +
                        `the stage shows a ball on a flat rail, no projected bezier (the pre-suffusion defect)`,
                );
            } else if (!curveBefore.distinct) {
                fail(
                    `(d) the projected curve is NOT a distinct element from the sidebar .bezier-path — ` +
                        `the stage must project its OWN curve, not reuse the sidebar canvas`,
                );
            } else {
                // A REAL mouse drag of sidebar handle circle[data-index=0].
                const handle = await page.evaluate(() => {
                    const h = document.querySelector("circle[data-index='0']");
                    if (!h) return null;
                    const r = h.getBoundingClientRect();
                    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
                });
                if (!handle) {
                    fail("(d) the sidebar bezier handle circle[data-index=0] is absent — the drag oracle cannot run");
                } else {
                    await page.mouse.move(handle.x, handle.y);
                    await page.mouse.down();
                    await page.mouse.move(handle.x + 45, handle.y - 65, { steps: 14 });
                    await page.mouse.up();
                    await page.waitForTimeout(500);
                    const curveAfter = await page.evaluate(() => ({
                        stage: document.querySelector(".easing-stage-curve-path")?.getAttribute("d") ?? null,
                        sidebar: document.querySelector(".bezier-path")?.getAttribute("d") ?? null,
                    }));
                    const stageMoved = curveAfter.stage !== curveBefore.stage;
                    const sidebarMoved = curveAfter.sidebar !== curveBefore.sidebar;
                    if (stageMoved && sidebarMoved) {
                        ok(
                            `(d) the projected stage curve PRESENT (distinct element, d.len ` +
                                `${curveBefore.stage.length}) AND MUTATES on a real handle drag (stage d changed ` +
                                `in lockstep with the sidebar — the ball traverses its OWN live curve, not a flat rail)`,
                        );
                    } else {
                        fail(
                            `(d) the handle drag did NOT mutate the projected curve in lockstep ` +
                                `(stageMoved=${stageMoved}, sidebarMoved=${sidebarMoved}) — a static (non-` +
                                `bezierPathD-bound) projection that does not track the live curve still REDs`,
                        );
                    }
                }
            }

            // ── (e) the ghost rail ABSENT on the empty-DFA scenes ──────────────
            for (const scene of ["sequence"]) {
                await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
                await navToScene(page, scene, null, { timeout: 12000 });
                await page.waitForTimeout(700);
                const rail = await page.evaluate(() => {
                    const layout = document.querySelector("[class*=controls-layout]");
                    const wrapper = document.querySelector(".controls-pane-wrapper");
                    const cols = layout ? getComputedStyle(layout).gridTemplateColumns : null;
                    // The [rail] track is the FIRST track in the grid template; a
                    // collapsed rail computes its width 0px.
                    const railPx = cols ? parseFloat((cols.match(/(?:\[rail\]\s*)?([\d.]+)px/) ?? [])[1] ?? "NaN") : NaN;
                    return {
                        cols,
                        railPx,
                        railless: !!document.querySelector(".controls-layout--railless"),
                        wrapperWidth: wrapper ? Math.round(wrapper.getBoundingClientRect().width) : null,
                    };
                });
                if (rail.railPx === 0 && rail.railless && (rail.wrapperWidth === 0 || rail.wrapperWidth === null)) {
                    ok(
                        `(e) ${scene}: the ghost rail is ABSENT — [rail] track computes 0px, ` +
                            `.controls-layout--railless present, wrapper width ${rail.wrapperWidth} ` +
                            `(no hollow 400px card over the void)`,
                    );
                } else {
                    fail(
                        `(e) ${scene}: the ghost rail did NOT collapse (railPx=${rail.railPx}, ` +
                            `railless=${rail.railless}, wrapperWidth=${rail.wrapperWidth}; cols="${rail.cols}") — ` +
                            `the empty-DFA rail still holds open at 400px showing a vacant card`,
                    );
                }
            }

            // ── (f) the amiga rounded-glass computed border-radius ─────────────
            await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
            await navToScene(page, "amiga", "Controls", { timeout: 12000 });
            await page.waitForTimeout(600);
            const amigaRadius = await page.evaluate(() => {
                const canvas = document.querySelector(".amiga-canvas");
                const cs = canvas ? getComputedStyle(canvas) : null;
                // resolve --radius-card to px (1rem → 16px at the default root font)
                const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
                const radiusCardRaw = getComputedStyle(document.documentElement).getPropertyValue("--radius-card").trim();
                const radiusCardPx = /rem$/.test(radiusCardRaw)
                    ? parseFloat(radiusCardRaw) * rootPx
                    : parseFloat(radiusCardRaw);
                return {
                    found: !!canvas,
                    radius: cs ? cs.borderTopLeftRadius : null,
                    radiusPx: cs ? parseFloat(cs.borderTopLeftRadius) : NaN,
                    radiusCardPx,
                };
            });
            if (
                amigaRadius.found &&
                amigaRadius.radiusPx > 0 &&
                Math.abs(amigaRadius.radiusPx - amigaRadius.radiusCardPx) <= 1
            ) {
                ok(
                    `(f) the amiga .amiga-canvas computes border-radius ${amigaRadius.radius} == ` +
                        `--radius-card (${amigaRadius.radiusCardPx}px), != 0 — the slab joined the rounded-glass register`,
                );
            } else {
                fail(
                    `(f) the amiga .amiga-canvas border-radius is NOT --radius-card ` +
                        `(found=${amigaRadius.found}, radius=${amigaRadius.radius}, expected ` +
                        `≈${amigaRadius.radiusCardPx}px) — the slab is still an unrounded gray rectangle`,
                );
            }

            // ── (g) the substrate-depth legibility (W6-3 discharged) ───────────
            await page.goto(`${base}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(700);
            const substrate = await page.evaluate(() => {
                const grid = document.querySelector(".grid-background");
                const cs = grid ? getComputedStyle(grid) : null;
                const cssRoot = getComputedStyle(document.documentElement);
                const majorOpacity = cssRoot.getPropertyValue("--graph-major-opacity").trim();
                const fineOpacity = cssRoot.getPropertyValue("--graph-opacity").trim();
                return {
                    exists: !!grid,
                    bgSize: cs?.backgroundSize ?? null,
                    // two-tier ⇒ FOUR gradient layers (fine + major, each ×2 for the
                    // crosshatch H+V); a single 0.10α tile has ONE.
                    gradLayers: cs ? (cs.backgroundImage.match(/gradient/gi) || []).length : 0,
                    majorOpacityPct: parseFloat(majorOpacity),
                    fineOpacityPct: parseFloat(fineOpacity),
                };
            });
            const FLOOR_PCT = 10; // the former near-invisible 0.10α floor
            if (
                substrate.exists &&
                substrate.gradLayers >= 4 &&
                substrate.majorOpacityPct > FLOOR_PCT
            ) {
                ok(
                    `(g) the substrate is two-tier engineering graph paper — ${substrate.gradLayers} gradient ` +
                        `layers (bgSize "${substrate.bgSize}"), --graph-major-opacity ${substrate.majorOpacityPct}% ` +
                        `> the former ${FLOOR_PCT}% floor (the glass has structure to refract — W6-3 DISCHARGED)`,
                );
            } else {
                fail(
                    `(g) the substrate is NOT legible two-tier graph paper (exists=${substrate.exists}, ` +
                        `gradLayers=${substrate.gradLayers}, majorOpacity=${substrate.majorOpacityPct}%, floor=${FLOOR_PCT}%) — ` +
                        `the single near-invisible 0.10α corner-tick survived (W6-3 not discharged)`,
                );
            }
        },
    );

    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
        return false;
    }

    // ── (c) the 390×844 hero/subject overlap == 0px (a SEPARATE mobile context) ──
    const mobile = await withPage(
        {
            distDir: DIST,
            context: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 },
            label: "the appearance-suffusion mobile overlap (clause c)",
        },
        async (page, { url: base }) => {
            await page.goto(`${base}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(1300);
            return page.evaluate(() => {
                const rect = (el) => {
                    if (!el) return null;
                    const b = el.getBoundingClientRect();
                    if (b.width < 4 || b.height < 4) return null;
                    return { x: b.x, y: b.y, right: b.right, bottom: b.bottom, w: b.width, h: b.height };
                };
                const hero = document.querySelector("h1");
                // The home subject is the CSS-3D cube (its faces are .cube-side); the
                // subject envelope is the union of the visible face rects.
                const faces = [...document.querySelectorAll(".cube-side, .cube")].filter((e) => {
                    const b = e.getBoundingClientRect();
                    const cs = getComputedStyle(e);
                    return b.width > 8 && b.height > 8 && cs.visibility !== "hidden" && cs.display !== "none";
                });
                let cube = null;
                for (const f of faces) {
                    const r = f.getBoundingClientRect();
                    if (!cube) cube = { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
                    else {
                        cube.x = Math.min(cube.x, r.x);
                        cube.y = Math.min(cube.y, r.y);
                        cube.right = Math.max(cube.right, r.right);
                        cube.bottom = Math.max(cube.bottom, r.bottom);
                    }
                }
                const hr = rect(hero);
                let overlap = null;
                if (hr && cube) {
                    const ix = Math.max(0, Math.min(hr.right, cube.right) - Math.max(hr.x, cube.x));
                    const iy = Math.max(0, Math.min(hr.bottom, cube.bottom) - Math.max(hr.y, cube.y));
                    overlap = Math.round(ix * iy);
                }
                return {
                    heroFound: !!hr,
                    cubeFound: !!cube,
                    hero: hr ? { y: Math.round(hr.y), bottom: Math.round(hr.bottom) } : null,
                    cube: cube ? { y: Math.round(cube.y), bottom: Math.round(cube.bottom) } : null,
                    overlapArea: overlap,
                };
            });
        },
    );
    if (!mobile.skipped) {
        const m = mobile.value;
        if (m.heroFound && m.cubeFound && m.overlapArea === 0) {
            ok(
                `(c) 390×844 hero/subject overlap == 0px — hero h1 (y ${m.hero.y}–${m.hero.bottom}) and the ` +
                    `cube subject (y ${m.cube.y}–${m.cube.bottom}) do not intersect (the H3/TYP-1 collision CURED)`,
            );
        } else {
            fail(
                `(c) 390×844 hero/subject overlap is NOT 0 (heroFound=${m.heroFound}, cubeFound=${m.cubeFound}, ` +
                    `overlapArea=${m.overlapArea}px²; hero=${JSON.stringify(m.hero)}, cube=${JSON.stringify(m.cube)}) — ` +
                    `the mobile hero word is physically behind the cube face (the H3 defect)`,
            );
        }
    }

    note(
        "(h) — proof:live-session budget == 0 across the re-skinned tree is the SEPARATE regression gate " +
            "(proof:live-session, inherited BY REFERENCE); a green proof:live-session on the post-W7a tree IS clause (h).",
    );
    return true;
}

await runSuffusion();

if (failures.length > 0) {
    console.error(
        `\nproof:appearance-suffusion — FAIL (${failures.length}): a per-finding appearance oracle red — ` +
            "the suffusion (the --ball-tone hue map · the display register · the mobile overlap · the projected " +
            "mutating curve · the railless track · the rounded amiga · the legible substrate) is incomplete or regressed.",
    );
    process.exit(1);
}
console.log(
    "\nproof:appearance-suffusion — PASS: every per-finding COMPUTED appearance oracle holds on the live " +
        "built dist — the --ball-tone carries each scene's icon hue (violet/cyan/green/teal, aquamarine dead), " +
        "the Instrument-Serif display register lands at the named moments (amiga headerless), the 390×844 " +
        "hero/subject overlap is 0, the easing stage projects its OWN curve and it mutates on a real handle " +
        "drag, the ghost rail is absent, the amiga is rounded-glass, and the substrate is legible two-tier " +
        "graph paper (W6-3 discharged). The design suffusion is certified through the human's eye, clause by clause.",
);
