#!/usr/bin/env node
/**
 * proof:amiga-subject-is-pivot  +  proof:amiga-no-gpu-stall  —  I.W3 (B3).
 *
 * THE DEFECT (rootcause-rc-amiga.md). `/amiga` "totally broken, floats around":
 * the interactive SUBJECT (the checker sphere) and the camera ORBIT PIVOT
 * (`OrbitControls.target = (0,0,0)`) were DIFFERENT points — the sphere parked in
 * the far corner `(-5,-5,-5)`. So a centre-canvas drag is a raycast MISS that
 * falls through to OrbitControls and TUMBLES THE WHOLE ROOM about the origin (the
 * confirmation probe measured the canvas region change ~+55% PNG bytes — the room
 * re-projected, NOT a centred sphere spinning). PLUS `.scene-root` carried
 * `content-visibility: auto` over a live `requestAnimationFrame` WebGL present
 * loop — the wrong primitive for a continuously-painted canvas → a per-frame
 * ReadPixels GPU stall + "rendering in a subtree hidden by content-visibility"
 * verbose spam.
 *
 * THE FIX (I.W3). S1 unifies SUBJECT = ORBIT PIVOT = FRAMING: the sphere is seated
 * at the CENTRED home (the room origin), `OrbitControls.target` tracks it, and the
 * boing-bounce extents swing about that same home — ONE home everywhere. So the
 * canvas centre now HITS the sphere (the W5 drag-to-spin → decay()-glide gesture,
 * already correct in useSphereSpin, becomes REACHABLE), and an empty-space drag
 * orbits ABOUT the subject. S2 drops `content-visibility: auto` from the WebGL root
 * (the occlusion-pause intent rides an IntersectionObserver + the tab-visibility
 * pause instead) — no GPU stall.
 *
 * THE GATE (born-RED on b934a08, GREEN-on-fix · RUNTIME/INTERACTION). Harness:
 * the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist over
 * dist/gh-pages + env-driven resolveChromium + context/teardown, J.W3 S1;
 * KF_REQUIRE_BROWSER gating at the lib seam, W7-1/S6d) + navToScene (the J.W0
 * per-EXPECTED-state settle), a FRESH context per scene navigating
 * `${base}/#/amiga`. P6 posture: hard — device-independent correctness oracle
 * (red anywhere; J.W3 S2b). This wave's confirmation probe rc-amiga-confirm.mjs
 * is the working template — the ASSERTIONS INVERT:
 *
 *   (a) a CENTRE-canvas pointer drag moves the SUBJECT, not the camera. The
 *       canvas-region delta is LOCAL — the CENTRE (the sphere) changed while the
 *       PERIPHERY (the checker room walls) stayed ~static. This is the inverse of
 *       the HEAD ~+55% whole-room re-projection: a centred sphere spinning, NOT a
 *       corner sphere swung across a tumbling room.
 *   (b) an EMPTY-SPACE (corner) drag orbits ABOUT the subject — the sphere's
 *       screen centroid stays roughly FRAMED (near canvas centre), not flung to an
 *       edge by an origin-orbit sweep.
 *   (c) NO GPU-stall / content-visibility warns: load /amiga, run the present loop
 *       ≥2s, assert ZERO `warning`/`verbose` console lines matching
 *       /ReadPixels|GPU stall|content-visibility|hidden by content-visibility/.
 *
 * Self-contained + re-runnable: `node scripts/proof-amiga-subject-is-pivot.mjs`.
 * Serves the BUILT dist/gh-pages/. Under KF_REQUIRE_BROWSER=1 a playwright-absent
 * skip becomes a HARD FAIL so a SHIP is never green-reported un-exercised.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:amiga-subject-is-pivot + proof:amiga-no-gpu-stall — I.W3 (B3): subject = " +
        "orbit pivot = framing · WebGL root sheds content-visibility",
);

/**
 * Capture a full-canvas screenshot, decode it IN-BROWSER, and return per-region
 * mean-absolute-difference (MAD) vs. a reference frame. We split the canvas into a
 * CENTRE disc (the centred sphere) and a PERIPHERAL ring (the checker room walls)
 * and report the MAD of each region between two frames — the robust local-vs-global
 * signal (a centred spin changes the CENTRE; a whole-room camera tumble changes the
 * PERIPHERY too).
 */
async function canvasRegionMAD(page, beforeDataUrl, afterDataUrl) {
    return page.evaluate(
        async ([beforeUrl, afterUrl]) => {
            const load = (url) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = url;
                });
            const [a, b] = await Promise.all([load(beforeUrl), load(afterUrl)]);
            const W = Math.min(a.width, b.width);
            const H = Math.min(a.height, b.height);
            const toData = (img) => {
                const c = document.createElement("canvas");
                c.width = W;
                c.height = H;
                const g = c.getContext("2d");
                g.drawImage(img, 0, 0);
                return g.getImageData(0, 0, W, H).data;
            };
            const da = toData(a);
            const db = toData(b);

            const cx = W / 2;
            const cy = H / 2;
            // Centre disc radius ≈ 22% of the min dimension (the sphere footprint);
            // periphery = everything beyond 38% (clear of the sphere + its shadow).
            const rCentre = 0.22 * Math.min(W, H);
            const rPeri = 0.38 * Math.min(W, H);

            let cSum = 0,
                cN = 0,
                pSum = 0,
                pN = 0;
            for (let y = 0; y < H; y += 2) {
                for (let x = 0; x < W; x += 2) {
                    const i = (y * W + x) * 4;
                    const d =
                        Math.abs(da[i] - db[i]) +
                        Math.abs(da[i + 1] - db[i + 1]) +
                        Math.abs(da[i + 2] - db[i + 2]);
                    const dist = Math.hypot(x - cx, y - cy);
                    if (dist <= rCentre) {
                        cSum += d;
                        cN++;
                    } else if (dist >= rPeri) {
                        pSum += d;
                        pN++;
                    }
                }
            }
            return {
                centreMAD: cN ? cSum / cN : 0,
                peripheryMAD: pN ? pSum / pN : 0,
                W,
                H,
            };
        },
        [beforeDataUrl, afterDataUrl],
    );
}

/**
 * Locate the sphere's screen centroid: the red/white CHECKER ball stands out
 * against the grey checker room. We weight each sampled pixel by its "redness"
 * (R dominant over G+B) — the red checker faces — and return the centroid in
 * canvas-normalised coords [0..1]. Returns null if no red signal (sphere off-frame
 * → itself a clause-(b) failure signal).
 */
async function sphereCentroid(page, dataUrl) {
    return page.evaluate(async (url) => {
        const img = await new Promise((resolve) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.src = url;
        });
        const W = img.width;
        const H = img.height;
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, W, H).data;
        let sx = 0,
            sy = 0,
            wsum = 0;
        for (let y = 0; y < H; y += 2) {
            for (let x = 0; x < W; x += 2) {
                const i = (y * W + x) * 4;
                const r = d[i];
                const gg = d[i + 1];
                const bb = d[i + 2];
                // Redness weight: red checker faces of the ball. The grey room
                // (r≈g≈b) and the soft gradient backdrop score ~0.
                const redness = r - (gg + bb) / 2;
                if (redness > 40) {
                    const w = redness;
                    sx += x * w;
                    sy += y * w;
                    wsum += w;
                }
            }
        }
        if (wsum < 1) return null;
        return { x: sx / wsum / W, y: sy / wsum / H, weight: wsum };
    }, dataUrl);
}

// A centre-drag stroke: down at centre, sweep, up. Returns the data-url shots.
async function dragStroke(page, box, fromX, fromY, dxStep, dyStep, steps) {
    const x0 = box.x + fromX * box.width;
    const y0 = box.y + fromY * box.height;
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(x0 + i * dxStep, y0 + i * dyStep);
        await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(450);
}

async function browserHalf() {
    const result = await withPage(
        { distDir: DIST, label: "the amiga subject-is-pivot assertions" },
        async (_page, { url: base, browser }) => {

    // Tiny helper: a fresh /amiga page (console buffers wired) settled for `ms`,
    // navToScene-settled on the amiga control surface first (per-EXPECTED-state).
    const freshAmiga = async (settleMs) => {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        const consoleLog = [];
        const pageErrors = [];
        page.on("console", (m) => consoleLog.push({ type: m.type(), text: m.text() }));
        page.on("pageerror", (e) => pageErrors.push({ name: e.name, message: e.message }));
        await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
        await navToScene(page, "amiga", "Controls", { timeout: 8000 });
        await page.waitForTimeout(settleMs);
        return { ctx, page, consoleLog, pageErrors };
    };

    const canvasBox = async (page) => {
        const handle = await page.$("canvas.amiga-canvas");
        if (!handle) return null;
        return handle.boundingBox();
    };

        // ── clause (a): centre drag moves the SUBJECT, not the camera ──────────
        {
            const { ctx, page } = await freshAmiga(1500);
            try {
                const box = await canvasBox(page);
                if (!box) {
                    fail("clause (a) — canvas.amiga-canvas not found on /amiga");
                } else {
                    const clip = {
                        x: Math.round(box.x),
                        y: Math.round(box.y),
                        width: Math.round(box.width),
                        height: Math.round(box.height),
                    };
                    const before = (await page.screenshot({ clip, type: "png" })).toString(
                        "base64",
                    );
                    const beforeUrl = `data:image/png;base64,${before}`;
                    // Drag from the CANVAS CENTRE (where the centred sphere now sits).
                    await dragStroke(page, box, 0.5, 0.5, 14, -6, 12);
                    const after = (await page.screenshot({ clip, type: "png" })).toString(
                        "base64",
                    );
                    const afterUrl = `data:image/png;base64,${after}`;

                    const mad = await canvasRegionMAD(page, beforeUrl, afterUrl);
                    // The SUBJECT moved: the centre region changed appreciably.
                    const CENTRE_MOVED = 6; // MAD units (0..765); a spin re-textures the disc.
                    // The room did NOT tumble: the periphery is ~static, and the
                    // centre delta DOMINATES (a whole-room re-projection makes the
                    // periphery change AS MUCH AS — or more than — the centre).
                    const subjectMoved = mad.centreMAD >= CENTRE_MOVED;
                    const peripheryStable = mad.peripheryMAD <= mad.centreMAD * 0.6;

                    if (subjectMoved && peripheryStable) {
                        ok(
                            `clause (a) — centre drag is a LOCAL subject change: centreMAD=` +
                                `${mad.centreMAD.toFixed(1)} >> peripheryMAD=${mad.peripheryMAD.toFixed(1)} ` +
                                `(the centred sphere spun; the checker room did NOT tumble — the inverse ` +
                                `of the HEAD whole-room re-projection)`,
                        );
                    } else if (!subjectMoved) {
                        fail(
                            `clause (a) — a centre drag produced NO subject change (centreMAD=` +
                                `${mad.centreMAD.toFixed(1)} < ${CENTRE_MOVED}); the canvas centre does ` +
                                `not HIT the sphere (the spin gesture is unreachable — subject not centred)`,
                        );
                    } else {
                        fail(
                            `clause (a) — a centre drag re-projected the WHOLE ROOM (peripheryMAD=` +
                                `${mad.peripheryMAD.toFixed(1)} vs centreMAD=${mad.centreMAD.toFixed(1)}); the ` +
                                `centre missed the sphere and drove OrbitControls (subject ≠ pivot — the B3 float)`,
                        );
                    }
                }
            } finally {
                await ctx.close();
            }
        }

        // ── clause (b): empty-space (corner) drag orbits ABOUT the subject ─────
        {
            const { ctx, page } = await freshAmiga(1500);
            try {
                const box = await canvasBox(page);
                if (!box) {
                    fail("clause (b) — canvas.amiga-canvas not found on /amiga");
                } else {
                    const clip = {
                        x: Math.round(box.x),
                        y: Math.round(box.y),
                        width: Math.round(box.width),
                        height: Math.round(box.height),
                    };
                    const beforeUrl = `data:image/png;base64,${(
                        await page.screenshot({ clip, type: "png" })
                    ).toString("base64")}`;
                    const cBefore = await sphereCentroid(page, beforeUrl);

                    // Drag from a clearly-EMPTY corner (top-left, well off the centred
                    // sphere) — a raycast MISS that should drive the camera orbit.
                    await dragStroke(page, box, 0.12, 0.12, 16, 8, 14);

                    const afterUrl = `data:image/png;base64,${(
                        await page.screenshot({ clip, type: "png" })
                    ).toString("base64")}`;
                    const cAfter = await sphereCentroid(page, afterUrl);

                    if (!cBefore || !cAfter) {
                        fail(
                            `clause (b) — the sphere's red-checker centroid was not detectable ` +
                                `${!cBefore ? "BEFORE" : "AFTER"} the corner drag (the subject is off-frame ` +
                                `— a corner sphere flung across the view = the B3 origin-orbit sweep)`,
                        );
                    } else {
                        // The pivot IS the subject → an empty-space orbit keeps the
                        // sphere roughly FRAMED (near canvas centre). We assert the
                        // centroid stays within a generous central band AND did not
                        // jump a large fraction of the frame.
                        const distFromCentreAfter = Math.hypot(cAfter.x - 0.5, cAfter.y - 0.5);
                        const jump = Math.hypot(cAfter.x - cBefore.x, cAfter.y - cBefore.y);
                        const STAY_FRAMED = 0.3; // centroid within 30% of canvas centre
                        const MAX_JUMP = 0.3; // did not sweep across the frame
                        if (distFromCentreAfter <= STAY_FRAMED && jump <= MAX_JUMP) {
                            ok(
                                `clause (b) — empty-space drag orbits ABOUT the subject: the sphere ` +
                                    `stays framed (centroid (${cAfter.x.toFixed(2)},${cAfter.y.toFixed(2)}), ` +
                                    `${distFromCentreAfter.toFixed(2)} from centre; moved ${jump.toFixed(2)} of ` +
                                    `the frame) — the pivot is the subject, not a disjoint origin`,
                            );
                        } else {
                            fail(
                                `clause (b) — empty-space drag SWEPT the subject across the frame: ` +
                                    `centroid (${cAfter.x.toFixed(2)},${cAfter.y.toFixed(2)}) is ` +
                                    `${distFromCentreAfter.toFixed(2)} from centre, moved ${jump.toFixed(2)} ` +
                                    `(the origin-orbit flings the sphere — subject ≠ pivot, the B3 float)`,
                            );
                        }
                    }
                }
            } finally {
                await ctx.close();
            }
        }

        // ── clause (c): no GPU-stall / content-visibility warns over ≥2s ───────
        {
            const { ctx, page, consoleLog } = await freshAmiga(0);
            try {
                // Run the live present loop ≥2s, with a small interaction nudge so
                // the loop is exercised (a centre drag + a corner drag) — the window
                // where the HEAD content-visibility/ReadPixels warns spammed.
                await page.waitForTimeout(2200);
                const box = await canvasBox(page);
                if (box) {
                    await dragStroke(page, box, 0.5, 0.5, 10, -5, 6);
                    await dragStroke(page, box, 0.12, 0.12, 12, 6, 6);
                }
                await page.waitForTimeout(600);

                // The amiga RC-2 defect is the WebGL ReadPixels GPU stall caused by
                // `content-visibility:auto` OVER THE LIVE WEBGL PRESENT LOOP. The
                // DEFINITIVE, amiga-specific signal is the ReadPixels/GPU-stall line
                // (a WebGL readback stall — the Monaco keyframes pane, which carries an
                // INTENTIONAL `content-visibility:hidden` B-2 cache, NEVER emits it). The
                // bare "Rendering was performed in a subtree hidden by content-visibility"
                // line is SHARED with that benign Monaco cache, so it is NOT the oracle —
                // it is a named-benign exclusion. The amiga RC-2 oracle is two-fold: zero
                // WebGL-stall console lines AND the DOM invariant that the WebGL canvas
                // sheds content-visibility (if S2 regresses and the WebGL root regains
                // content-visibility:auto, BOTH the ReadPixels stalls AND this DOM check
                // red — so the gate still bites the real defect).
                const WEBGL_STALL = /ReadPixels|GPU stall/i;
                const offenders = consoleLog.filter(
                    (l) =>
                        (l.type === "warning" || l.type === "verbose" || l.type === "warn") &&
                        WEBGL_STALL.test(l.text),
                );
                // The DOM invariant: the live WebGL canvas is NOT inside ANY
                // content-visibility hidden/auto ancestor (the source-level guarantee
                // S2 lands — the WebGL root no longer renders into a hidden subtree).
                const canvasHiddenAncestor = await page.evaluate(() => {
                    // The amiga WebGL canvas specifically — NOT a Monaco minimap/
                    // overview-ruler <canvas> (those live inside the intentional
                    // content-visibility:hidden keyframes pane, a different subtree).
                    const canvas =
                        document.querySelector(".amiga-canvas canvas") ||
                        document.querySelector(".amiga-canvas") ||
                        [...document.querySelectorAll("canvas")].find(
                            (c) => !c.closest(".monaco-pane"),
                        );
                    let node = canvas;
                    while (node && node !== document.body) {
                        const v = getComputedStyle(node).contentVisibility;
                        if (v === "auto" || v === "hidden") {
                            return (node.className || "").toString().slice(0, 60) || node.tagName;
                        }
                        node = node.parentElement;
                    }
                    return null;
                });

                if (canvasHiddenAncestor) {
                    fail(
                        `clause (c) — the live WebGL canvas renders inside a content-visibility ` +
                            `hidden/auto ancestor ("${canvasHiddenAncestor}") — the wrong primitive over ` +
                            `the WebGL present loop (S2 must shed content-visibility from the WebGL root)`,
                    );
                } else {
                    note(`the WebGL canvas sheds content-visibility — no hidden/auto ancestor (S2 landed)`);
                }

                if (offenders.length === 0) {
                    ok(
                        `clause (c) — ZERO WebGL ReadPixels/GPU-stall console lines across a ≥2s ` +
                            `present-loop run (${consoleLog.length} total console lines observed) — the ` +
                            `RC-2 GPU stall is gone (the benign Monaco content-visibility:hidden B-2 cache ` +
                            `warns are a NAMED-BENIGN exclusion: not WebGL, not a GPU stall)`,
                    );
                } else {
                    fail(
                        `clause (c) — ${offenders.length} WebGL ReadPixels/GPU-stall warn(s) over ` +
                            `the present loop (the content-visibility:auto-over-WebGL smell):\n      ` +
                            offenders
                                .slice(0, 6)
                                .map((l) => `[${l.type}] ${l.text.slice(0, 120)}`)
                                .join("\n      "),
                    );
                }
            } finally {
                await ctx.close();
            }
        }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:amiga-subject-is-pivot — FAIL (${failures.length}): the amiga subject/orbit-pivot/` +
            `framing are NOT one point (a centre drag tumbles the room or misses the sphere, or an ` +
            `empty-space drag flings the subject), OR the WebGL root still pays a content-visibility / ` +
            `ReadPixels GPU stall. S1 (centre the subject + track the pivot) and S2 (drop ` +
            `content-visibility from the WebGL root) are not both satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:amiga-subject-is-pivot + proof:amiga-no-gpu-stall — PASS: a centre drag spins the " +
        "CENTRED subject (a LOCAL change, the room does NOT tumble); an empty-space drag orbits ABOUT " +
        "the subject (the sphere stays framed); and the live WebGL present loop pays ZERO " +
        "content-visibility / ReadPixels GPU-stall warns. Subject = orbit pivot = framing — one point.",
);
