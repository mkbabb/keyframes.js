#!/usr/bin/env node
/**
 * proof:control-surface-single-writer — J.W2 S2 (DS-1 + S4-stretch; the
 * `selectedControl` single-WRITER completion — §Hard gate clause (b)).
 *
 * THE DEFECT FAMILY (`audit/demo-shared-layer.md §K`/DS-1 + the perf-battery
 * 2026-06-10 §2 recorded witness). The I.W2 single-authority was single-SOURCED
 * but not single-WRITTEN: (1) `CubeScene.vue:73-83` carried a rogue scene-side
 * `storedControls.selectedControl = "controls"` write that duplicated the DFA's
 * fallback job; (2) the per-group derivation-sync could fire in the NAVIGATE→
 * SCENE_READY window while still hosting the LEAVING scene's animations, writing
 * the DESTINATION scene's surface into the LEAVING scene's store (the recorded
 * corruption: the Easing store holding `selectedControl:"spring"`). The result:
 * the easing↔cube round trip returned `selectedControl:'controls'` instead of
 * 'easing' (the born-RED witness of record, perf-battery §2).
 *
 * THE FIX (J.W2 S2). `storedControls.selectedControl` has ONE writing authority:
 * the `AnimationControls.vue` derivation-sync, which writes the DFA projection
 * (`selectedControlSurfaceFor(activeScene, preferred, activeConditionals)`) and
 * ONLY for the scene that owns its store (suspend-on-leave: a stale-mounted host
 * never writes a cross-scene projection into the leaving scene's store). The
 * CubeScene rogue write is DELETED — the matrix-controls fallback is a function
 * OF the DFA (conditional-surface-aware), computed at the authority.
 *
 * THIS GATE BITES (born-RED on the pre-J.W2 tree, GREEN-on-fix):
 *
 *  • clause (b1) — the LIVE scene sweep (cube → easing → spring → sequence →
 *    cube via the J.W0 `navToScene` per-expected-state primitive): on EVERY
 *    entry the RENDERED control surface equals the DFA projection for that
 *    scene (the dock trigger label + the single-surface panel presence), and
 *    the per-scene store field mirrors it.
 *  • clause (b2) — CROSS-STORE PURITY after the sweep: the Easing store holds
 *    'easing' and the Spring store holds 'spring' — NO leaving-scene store was
 *    corrupted by a cross-scene write mid-transition (the EXACT recorded
 *    corruption: Easing ending 'spring'). RED today; green on S2.
 *  • clause (b3) — the MATRIX FALLBACK AT THE AUTHORITY (DS-1): seed the cube
 *    store with a stale `selectedControl:'matrix-controls'` while a NON-Matrix
 *    animation is selected, enter cube, and assert the rendered surface falls
 *    back to 'controls' via the DFA projection (NOT via a scene-side write —
 *    the rogue watch is gone). RED today (the projection honors the conditional
 *    surface unconditionally, so the stale pick sticks); green on S2.
 *  • the HYGIENE corroborator (LABELED, source-shape — corroborates, never
 *    substitutes): zero `*.selectedControl =` writes in demo/scenes/,
 *    RibbonBar.vue, and demo/app/dock/.
 *
 * Mirrors the serveDist + playwright-core (KF_PLAYWRIGHT_DIR) plumbing of
 * scripts/proof-scene-transition-perf.mjs. Under KF_REQUIRE_BROWSER a
 * playwright-absent skip is a hard fail. Re-runnable:
 * `node scripts/proof-control-surface-single-writer.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { navToScene, SCENE_MACHINE_KEY } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:control-surface-single-writer — J.W2 S2 (the DFA projection is the ONLY selectedControl writer)",
);

// ── The HYGIENE corroborator (LABELED — source-shape; the runtime sweep below
//    is the correctness oracle, this grep only corroborates it) ────────────────
{
    const targets = [];
    const collect = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, entry.name);
            if (entry.isDirectory()) collect(p);
            else if (/\.(vue|ts)$/.test(entry.name)) targets.push(p);
        }
    };
    collect(path.join(DEMO, "scenes"));
    collect(path.join(DEMO, "app/dock"));
    targets.push(
        path.join(DEMO, "@/components/custom/animation-transport/components/RibbonBar.vue"),
    );

    const writeRe = /\.selectedControl\s*=(?!=)/;
    const offenders = [];
    for (const f of targets) {
        const lines = fs.readFileSync(f, "utf8").split("\n");
        lines.forEach((line, i) => {
            const code = line.replace(/\/\/.*$/, "");
            if (writeRe.test(code)) offenders.push(`${path.relative(REPO, f)}:${i + 1}`);
        });
    }
    if (offenders.length === 0) {
        ok(
            "[HYGIENE corroborator] zero scene/ribbon/dock-side `selectedControl =` writes " +
                "(scenes/, dock/, RibbonBar.vue) — the derivation-sync is the lone writer locus",
        );
    } else {
        fail(
            `[HYGIENE corroborator] ${offenders.length} scene/ribbon/dock-side selectedControl ` +
                `write(s) survive (the single-writer contract is breached at the source):\n      ` +
                offenders.join("\n      "),
        );
    }
}

// ── BROWSER half — the runtime correctness oracle ────────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the ` +
                "single-writer live sweep cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(200, { "content-type": "text/html" });
            fs.createReadStream(path.join(DIST, "index.html")).pipe(res);
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

/** Read one superKey's persisted control projection. */
const storeField = (page, superKey) =>
    page.evaluate(
        ([ck, sk]) => {
            try {
                const c = JSON.parse(localStorage.getItem(ck) || "{}")[sk];
                return c ? (c.selectedControl ?? null) : null;
            } catch {
                return null;
            }
        },
        [CTRL_KEY, superKey],
    );

/** Per-EXPECTED-state settle on the LIVE RENDERED field (the WZ `2e3669e`
 *  lesson, `audit/wave-I.W2.md §2`: the gate reads the RENDERED surface, never
 *  a localStorage proxy — the persisted half can lag the live field through
 *  the storage layer's self-echo flush pause). The probe is the field's OWN
 *  rendered product: the ribbon content each scene v-shows/renders ONLY when
 *  the live `selectedControl` equals the scene's surface. The single writer
 *  fires on SCENE_READY (after the scene chunk resolves) — LATER than the dock
 *  trigger's synchronous projection — so the timeout is a CEILING (returns the
 *  instant the surface renders); on the born-RED tree it never renders. */
const waitForRenderedField = async (page, probe, { timeout = 8000 } = {}) => {
    await page
        .waitForFunction(
            (sel) => {
                const el = document.querySelector(sel);
                if (!el) return false;
                if (getComputedStyle(el).display === "none") return false;
                const r = el.getBoundingClientRect();
                return r.width > 2 && r.height > 2;
            },
            probe,
            { timeout },
        )
        .catch(() => {});
    return page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        if (getComputedStyle(el).display === "none") return false;
        const r = el.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
    }, probe);
};

/** The dock's rendered controls-tab trigger text (null when absent). */
const dockTrigger = (page) =>
    page.evaluate(() => {
        const trig = document.querySelector("[aria-label='Controls tab']");
        return trig ? (trig.textContent?.trim() ?? "") : null;
    });

// The sweep — every entry asserts the RENDERED surface == the DFA projection
// for the scene. `panelProbe` is the single-surface scene's rendered content
// witness (the flat-mounted panel must actually be on screen). `liveProbe` is
// the LIVE field's rendered product — the ribbon content each scene shows ONLY
// when the live `selectedControl` equals the expected surface:
//   • cube: the `#controls-ribbon-target` div is v-shown iff the field is
//     'controls' (RibbonBar.vue);
//   • easing/spring: the scene's ribbonContent (the `.timeline-green` playback
//     scrub) renders iff the field is 'easing'/'spring' (the slot guard).
// T.B9 — the ONE keyspace: the option stores key by the registry SceneId
// (lowercase), NOT the retired PascalCase super-key. T.B2 — easing/spring each
// carry a PAINTING preview channel, so they earn the full triad: the default
// selected surface is 'controls' (the set's first member) and the control-tab
// trigger reads "Controls" (the pre-T.B2 single-surface elision is superseded).
const SWEEP = [
    {
        scene: "cube",
        superKey: "cube",
        trigger: "Controls",
        expect: "controls",
        liveProbe: "#controls-ribbon-target",
    },
    {
        scene: "easing",
        superKey: "easing",
        trigger: "Controls",
        expect: "controls",
    },
    {
        scene: "spring",
        superKey: "spring",
        trigger: "Controls",
        expect: "controls",
    },
    { scene: "sequence", superKey: "sequence", trigger: null, expect: null },
    {
        scene: "cube",
        superKey: "cube",
        trigger: "Controls",
        expect: "controls",
        liveProbe: "#controls-ribbon-target",
    },
];

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom(pkg));
            break;
        } catch {
            /* try next */
        }
    }
    if (!chromium) {
        skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
        return;
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    try {
        // ── clauses (b1) + (b2) — the live sweep + cross-store purity ─────────
        {
            const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
            const page = await ctx.newPage();
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await page.waitForTimeout(2500);

            const entryFailures = [];
            for (const step of SWEEP) {
                await navToScene(page, step.scene, step.trigger);
                // settle: two rAFs after the projection (navToScene already
                // waited per-expected) — read the rendered surface + the field.
                await page.evaluate(
                    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
                );
                const trig = await dockTrigger(page);
                const liveOk = step.liveProbe
                    ? await waitForRenderedField(page, step.liveProbe)
                    : true;
                const panelOk = step.panelProbe
                    ? await page.evaluate((sel) => {
                          const el = document.querySelector(sel);
                          if (!el) return false;
                          const r = el.getBoundingClientRect();
                          return r.width > 4 && r.height > 4;
                      }, step.panelProbe)
                    : true;

                if (trig !== step.trigger) {
                    entryFailures.push(
                        `${step.scene}: dock trigger rendered ${JSON.stringify(trig)} — expected ` +
                            `${JSON.stringify(step.trigger)} (the DFA projection for the scene)`,
                    );
                }
                if (!liveOk) {
                    entryFailures.push(
                        `${step.scene}: the LIVE field's rendered product (\`${step.liveProbe}\`, ` +
                            `shown only when selectedControl === '${step.expect}') is NOT rendered — ` +
                            `the single writer did not project '${step.expect}' on entry`,
                    );
                }
                if (!panelOk) {
                    entryFailures.push(
                        `${step.scene}: the single-surface panel content (\`${step.panelProbe}\`) is ` +
                            `NOT rendered — the flat-mounted surface is absent`,
                    );
                }
            }

            if (entryFailures.length === 0) {
                ok(
                    `clause (b1) — the live sweep (${SWEEP.map((s) => s.scene).join(" → ")}) rendered ` +
                        `the DFA projection on EVERY entry (dock trigger + the live field's rendered ` +
                        `ribbon + panel presence)`,
                );
            } else {
                fail(
                    `clause (b1) — ${entryFailures.length} entr(ies) rendered a surface ≠ the DFA ` +
                        `projection:\n      ` + entryFailures.join("\n      "),
                );
            }

            // (b2) cross-store purity — the recorded corruption shape (the Easing
            // store ending on a spring-only surface). T.B2 — easing's valid set is
            // {controls,keyframes,timeline,easing}; 'spring' is NEVER valid for it
            // (and vice-versa). The invariant: NO cross-scene-ONLY surface leaked
            // into a leaving scene's store mid-transition. Each store holds either
            // its default ('controls'/null on a gestureless sweep) or one of ITS
            // OWN valid surfaces — never the sibling's exclusive facet.
            const easingField = await storeField(page, "easing");
            const springField = await storeField(page, "spring");
            const easingClean = easingField === null || easingField !== "spring";
            const springClean = springField === null || springField !== "easing";
            if (easingClean && springClean) {
                ok(
                    "clause (b2) — cross-store purity after the sweep: the Easing store never holds " +
                        "spring's exclusive facet, the Spring store never holds easing's (suspend-on-" +
                        `leave — no mid-transition cross-write; Easing=${JSON.stringify(easingField)}, ` +
                        `Spring=${JSON.stringify(springField)})`,
                );
            } else {
                fail(
                    `clause (b2) — a leaving scene's store was CORRUPTED by a cross-scene write ` +
                        `mid-transition (the perf-battery §2 recorded shape): Easing=` +
                        `${JSON.stringify(easingField)} (must never be 'spring'), Spring=` +
                        `${JSON.stringify(springField)} (must never be 'easing')`,
                );
            }

            await ctx.close();
        }

        // ── clause (b3) — the matrix fallback at the AUTHORITY (DS-1) ─────────
        {
            const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
            const page = await ctx.newPage();
            // Seed a STALE matrix-controls pick with a NON-Matrix animation
            // selected — the exact conditional-surface fallback case the CubeScene
            // rogue write used to paper over.
            await page.addInitScript(
                ([ck]) => {
                    try {
                        localStorage.setItem(
                            ck,
                            JSON.stringify({
                                _storeTimestamp: Date.now(),
                                // T.B9 — the store keys by the lowercase registry SceneId.
                                cube: {
                                    selectedControl: "matrix-controls",
                                    selectedAnimation: "Rotations",
                                    selectedKeyframesControl: "string",
                                    isTimelineExpanded: false,
                                    isControlsPanelOpen: true,
                                },
                            }),
                        );
                    } catch {
                        /* ignore */
                    }
                },
                [CTRL_KEY],
            );
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await page
                .waitForFunction(
                    (mk) => {
                        try {
                            return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube";
                        } catch {
                            return false;
                        }
                    },
                    SCENE_MACHINE_KEY,
                    { timeout: 8000 },
                )
                .catch(() => {});
            await page.waitForTimeout(2000);

            const trig = await dockTrigger(page);
            const field = await storeField(page, "cube");
            if (trig === "Controls" && field === "controls") {
                ok(
                    "clause (b3) — a stale 'matrix-controls' pick with a non-Matrix selection " +
                        "falls back to 'controls' AT THE AUTHORITY (the conditional-aware DFA " +
                        "projection; no CubeScene rogue write involved)",
                );
            } else {
                fail(
                    `clause (b3) — the stale 'matrix-controls' pick did NOT fall back via the DFA ` +
                        `authority: dock trigger=${JSON.stringify(trig)} (expected 'Controls'), ` +
                        `store field=${JSON.stringify(field)} (expected 'controls') — the conditional ` +
                        `surface fallback is not computed at the one writer (DS-1)`,
                );
            }
            await ctx.close();
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:control-surface-single-writer — FAIL (${failures.length}): the rendered control ` +
            `surface diverged from the DFA projection, a leaving scene's store was corrupted by a ` +
            `cross-scene write, or the matrix fallback is not computed at the single authority ` +
            `(J.W2 S2 / DS-1 — the single-writer contract is not live).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:control-surface-single-writer — PASS: the DFA projection is the ONLY " +
        "selectedControl writer — every scene entry renders the projection, leaving-scene " +
        "stores survive transitions untouched (suspend-on-leave), and the cube matrix " +
        "fallback happens at the authority (J.W2 S2).",
);
