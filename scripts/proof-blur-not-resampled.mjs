#!/usr/bin/env node
/**
 * proof:blur-not-resampled — T.G1 (THE BLUR DE-LAYER; the perf keystone). BORN-RED.
 *
 * VERDICT #19 ("god awful" perf) root cause #1: a live `backdrop-filter` samples
 * its BACKDROP — everything painted behind it up to the nearest backdrop root — and
 * re-rasterizes whenever that backdrop changes within its footprint. The demo's
 * persistent glass chrome (the GlassDock, the controls pane, its cards/pills) sits
 * over the perpetually-animating stage, so every frame the stage subject moves the
 * chrome's blur re-samples it. Lane 11 measured this at up to 3.5× (morph
 * 33→116fps, motion-path 43→120fps — both since PRUNED at T.E) the instant the
 * chrome blur is neutralized — a FIXED, content-independent chrome cost. Over the
 * SURVIVING scene set the `easing` stage is heaviest-coupled (its ball loops the
 * curve every frame): 33→39.5fps (+76%) @1440×dpr2 / 26→65fps on this harness.
 *
 * TWO clause tiers (the wave's "green on the KF-SIDE de-layer now, tighten on the
 * glass-ui blur-source=static publish"):
 *
 *   (A) KF-SIDE de-layer — GREENS NOW. The kf side does what it CAN without a
 *       glass-ui change: (1) the falsified `contain: paint` on `.scene-host` is
 *       DELETED (measured neutral-to-worse — a sibling paint-wall cannot remove the
 *       moving subject from a sibling blur's backdrop); (2) the animating stage
 *       renders OUTSIDE any `backdrop-filter` ANCESTOR subtree (it never sits inside
 *       a filtered subtree). Clause (A) is a SOURCE + RUNTIME structural assertion.
 *
 *   (B) THE FROZEN-BACKDROP HANDOFF — BORN-RED until T.H. The remaining coupling —
 *       the glass chrome's LIVE blur re-sampling the moving stage as its backdrop —
 *       has NO pure-CSS kf-side cure (isolation / z-index / radius-cap / geometric
 *       separation were all measured neutral on the live easing scene). It is the
 *       glass-ui `blur-source="static"` frozen-backdrop capability, ABSENT today →
 *       the BG-5 `staticBackdrop` gap (demo/glass-ui-gaps.ts). Clause (B) is the
 *       RUNTIME toggle-delta: with the chrome `backdrop-filter` neutralized, the
 *       heaviest playing scene's composited-frame throughput must NOT rise by ≥15%
 *       (if it does, the blur was re-sampling the moving stage). It reds today
 *       (easing +147% here) and greens on the glass-ui publish + kf adoption — the
 *       version tripwire, T.H's gap-ledger discipline. Subsumed by T.G6's
 *       `proof:perf` blur-delta clause once lane 11's toggle-probe is promoted.
 *
 * METHODOLOGY (lane-11 CDP frame sampling): the headless rAF loop free-runs at
 * ~120Hz independent of real paint cost (the T.G7 blindspot), so this gate counts
 * REAL composited frames via CDP `Page.startScreencast` over a fixed window =
 * compositor throughput. It drives the heaviest available scene into PLAY (the
 * coupling only manifests while the subject animates), measures baseline vs a
 * `backdrop-filter: none` overlay, and reports the delta.
 *
 * BORN-RED BY DESIGN — rides the T born-RED BACKLOG (scripts/gate-bands.mjs
 * T_BORNRED_BACKLOG), EXCLUDED from every blocking aggregator (proof:ci-coverage),
 * a recorded CI tripwire. Discharged by T.H (glass-ui blur-source=static) + the
 * kf re-pin adopting it. Authority=INSTRUMENT (T.M6 / gate-authority.mjs).
 *
 * LOCKSTEP (lane 18): the falsified `contain: paint` deletion re-arms
 * proof:scene-perf-budget's G1 clause in the SAME motion — that clause is rewritten
 * from "the scene-host declares contain: paint" to this de-layer contract ("the
 * moving scene-host declares NO contain: paint AND has no backdrop-filter
 * ancestor"). Never leave a gate asserting the deleted mitigation is present.
 *
 * Overrides: KF_BLUR_SCENES (comma list; default the heaviest coupled set),
 * KF_BLUR_DELTA_PCT (the <15% ceiling).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
    withPage,
    navToScene,
    pressPlayToggle,
    REQUIRE_BROWSER,
} from "./lib/demo-driver.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_VUE = join(root, "demo/app/App.vue");
const LEDGER = join(root, "demo/glass-ui-gaps.ts");

// The chrome blur re-samples the moving stage only while the subject animates.
// Over the SURVIVING scene set (morph/motion-path/compose were PRUNED at T.E),
// `easing` is the heaviest-coupled continuously-animating stage (the ball loops
// the curve every frame → the blur re-samples it): measured 26→65fps here /
// the wave's 33→39.5fps (+76%) @1440×dpr2. Order = probe order; the first that
// mounts AND shows a live baseline anchors the runtime clause.
const CANDIDATE_SCENES = (process.env.KF_BLUR_SCENES || "easing,cube,spring")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const DELTA_CEILING_PCT = Number(process.env.KF_BLUR_DELTA_PCT || 15);
const WINDOW_MS = 2500;

const failures = [];
const passes = [];

// ── Clause (A1, SOURCE) — the falsified `contain: paint` is DELETED ────────────
// The de-layer contract: the perpetually-moving `.scene-host` no longer carries
// the measured-ineffective paint-wall. BITE: re-adding `contain: paint` (the
// falsified mitigation) reds.
const appSrc = readFileSync(APP_VUE, "utf8");
// Strip CSS comments before testing — the rationale comment names `contain: paint`
// in prose (the falsified mitigation it explains), which is not a declaration.
const sceneHostBlock = (appSrc.match(/\.scene-host\s*\{[\s\S]*?\n\}/)?.[0] ?? "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
if (/contain:\s*(paint|strict)/.test(sceneHostBlock)) {
    failures.push(
        "kf-side (A1) — `.scene-host` still declares `contain: paint` (the FALSIFIED " +
            "mitigation lane 11 measured neutral-to-worse). The de-layer deletes it; a " +
            "sibling paint-wall cannot remove the moving subject from a sibling blur's backdrop.",
    );
} else {
    passes.push(
        "kf-side (A1) — `.scene-host` carries no `contain: paint` (the falsified paint-wall is deleted).",
    );
}

// ── Clause (C, LEDGER) — the BG-5 staticBackdrop gap cites THIS gate ───────────
// The version tripwire's ledger row (demo/glass-ui-gaps.ts) must name this gate as
// its acceptanceGate, so the whole gap set stays visible in one place (T.H1). The
// ledger is TypeScript; parse it as text the way proof:glass-ui-gap-tripwire does.
const ledgerSrc = readFileSync(LEDGER, "utf8");
const gapBlock =
    ledgerSrc.match(/staticBackdrop:\s*\{[\s\S]*?\n {4}\},/)?.[0] ?? "";
if (!gapBlock) {
    failures.push(
        "ledger (C) — demo/glass-ui-gaps.ts has no `staticBackdrop` (BG-5) row; the frozen-backdrop " +
            "handoff is unrecorded.",
    );
} else if (!/acceptanceGate:\s*"proof:blur-not-resampled"/.test(gapBlock)) {
    failures.push(
        'ledger (C) — the BG-5 staticBackdrop row does not name acceptanceGate: "proof:blur-not-resampled". ' +
            "The gate and the ledger row must name each other.",
    );
} else if (!/blur-source=\\?"static\\?"/.test(gapBlock)) {
    failures.push(
        "ledger (C) — the BG-5 staticBackdrop row does not name the glass-ui `blur-source=\"static\"` " +
            "fix (the version dimension). It must, so the tripwire tightens on that publish.",
    );
} else {
    const ask = gapBlock.match(/ask:\s*"([^"]+)"/)?.[1] ?? "BG-5";
    passes.push(
        `ledger (C) — the BG-5 staticBackdrop gap (ask ${ask}) names this gate as its acceptance ` +
            '+ cites the glass-ui blur-source="static" fix (the version tripwire).',
    );
}

// ── Clauses (A2, RUNTIME) + (B, RUNTIME toggle-delta) — the browser half ───────
async function measureFps(page) {
    const cdp = await page.context().newCDPSession(page);
    let frames = 0;
    cdp.on("Page.screencastFrame", async (e) => {
        frames++;
        try {
            await cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId });
        } catch {
            /* teardown race */
        }
    });
    await cdp.send("Page.startScreencast", {
        format: "jpeg",
        quality: 5,
        everyNthFrame: 1,
    });
    const t0 = Date.now();
    await new Promise((r) => setTimeout(r, WINDOW_MS));
    const dt = Date.now() - t0;
    await cdp.send("Page.stopScreencast").catch(() => {});
    await cdp.detach().catch(() => {});
    return (frames * 1000) / dt;
}

const runtime = await withPage(
    {
        context: {
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 2,
        },
        label: "proof:blur-not-resampled",
    },
    async (page, { url }) => {
        await page.goto(url + "/#/", { waitUntil: "networkidle" });

        // (A2) the animating stage renders OUTSIDE any backdrop-filter ancestor.
        await navToScene(page, CANDIDATE_SCENES[0], null).catch(() => {});
        await new Promise((r) => setTimeout(r, 1200));
        const ancestor = await page.evaluate(() => {
            const host = document.querySelector(".scene-host");
            if (!host) return { host: false };
            let el = host.parentElement;
            const chain = [];
            while (el) {
                const bf = getComputedStyle(el).backdropFilter;
                if (bf && bf !== "none")
                    chain.push(
                        (el.className || el.tagName).toString().slice(0, 40),
                    );
                el = el.parentElement;
            }
            return { host: true, filteredAncestors: chain };
        });
        if (!ancestor.host) {
            failures.push(
                "kf-side (A2) — `.scene-host` is absent (the shell did not mount) — cannot verify the de-layer.",
            );
        } else if (ancestor.filteredAncestors.length > 0) {
            failures.push(
                `kf-side (A2) — the animating `+"`.scene-host`"+` sits INSIDE a backdrop-filter subtree ` +
                    `(filtered ancestor(s): ${ancestor.filteredAncestors.join(", ")}); the stage must render ` +
                    "outside every filtered subtree.",
            );
        } else {
            passes.push(
                "kf-side (A2) — the animating `.scene-host` renders outside every backdrop-filter ancestor subtree.",
            );
        }

        // (B) the toggle-delta on the heaviest PLAYING scene.
        let measured = null;
        for (const scene of CANDIDATE_SCENES) {
            await navToScene(page, scene, null).catch(() => {});
            await page.evaluate((s) => {
                location.hash = "#/" + s;
            }, scene);
            await new Promise((r) => setTimeout(r, 1400));
            await pressPlayToggle(page, { intent: "play" }).catch(() => {});
            await new Promise((r) => setTimeout(r, 800));

            const base = await measureFps(page);
            await page.addStyleTag({
                content:
                    "*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }",
            });
            await new Promise((r) => setTimeout(r, 400));
            const noBlur = await measureFps(page);
            // restore the chrome blur for the next probe
            await page.goto(url + "/#/" + scene, { waitUntil: "networkidle" });

            const deltaPct = ((noBlur - base) / base) * 100;
            const rec = {
                scene,
                base: +base.toFixed(1),
                noBlur: +noBlur.toFixed(1),
                deltaPct: +deltaPct.toFixed(1),
            };
            if (!measured || Math.abs(rec.deltaPct) > Math.abs(measured.deltaPct))
                measured = rec;
            // The FIRST scene that both mounts AND shows a real (non-degenerate)
            // baseline anchors the verdict; keep the worst delta seen.
            if (base > 5 && noBlur > 5) break;
        }
        return measured;
    },
);

// withPage/withBrowser wrap the fn result as { skipped:false, value } (or the
// W7-1 structured skip { skipped:true, reason }); unwrap it.
const measured = runtime && !runtime.skipped ? runtime.value : null;
if (runtime && runtime.skipped) {
    // KF_REQUIRE_BROWSER=0 — the browser half is deferred; clause (B) cannot pass
    // vacuously, and the gate is BORN-RED regardless (the frozen-backdrop capability
    // is absent). Record the honest deferral as a failure so the gate never greens
    // without the measurement.
    failures.push(
        `frozen-backdrop (B) — the runtime toggle-delta is unmeasured (${runtime.reason}), and the ` +
            "glass-ui `blur-source=\"static\"` capability is absent — BORN-RED handoff to T.H.",
    );
} else if (measured && Number.isFinite(measured.deltaPct)) {
    const { scene, base, noBlur, deltaPct } = measured;
    if (deltaPct >= DELTA_CEILING_PCT) {
        failures.push(
            `frozen-backdrop (B) — neutralizing the chrome backdrop-filter raised ${scene} from ` +
                `${base}fps to ${noBlur}fps (+${deltaPct}%, ≥ ${DELTA_CEILING_PCT}% ceiling): the glass ` +
                "chrome's LIVE blur is re-sampling the moving stage as its backdrop. No pure-CSS kf-side " +
                "cure exists — this greens when glass-ui ships `blur-source=\"static\"` (BG-5) and kf " +
                "adopts it. BORN-RED handoff to T.H.",
        );
    } else {
        passes.push(
            `frozen-backdrop (B) — neutralizing the chrome backdrop-filter moved ${scene} only ` +
                `${deltaPct >= 0 ? "+" : ""}${deltaPct}% (${base}→${noBlur}fps, < ${DELTA_CEILING_PCT}%): ` +
                "the blur no longer re-samples the moving stage (the frozen-backdrop cure landed).",
        );
    }
} else {
    failures.push(
        "frozen-backdrop (B) — no candidate scene mounted-and-played to measure the toggle-delta " +
            `(${CANDIDATE_SCENES.join(", ")}).`,
    );
}

console.log(
    "proof:blur-not-resampled — T.G1 (the blur de-layer; frozen-backdrop handoff) [BORN-RED]\n",
);
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:blur-not-resampled — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG; discharged by T.H]:`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    if (!REQUIRE_BROWSER)
        console.error(
            "\n  (browser half deferred: set KF_REQUIRE_BROWSER=1 with KF_PLAYWRIGHT_DIR to measure clause B live.)",
        );
    process.exit(1);
}
console.log(
    "\nproof:blur-not-resampled — PASS: the stage is de-layered AND the chrome blur no longer re-samples it.",
);
