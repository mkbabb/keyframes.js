#!/usr/bin/env node
/**
 * proof:spring-slider-continuous — Tranche K.W4 (Lane A · the SPRING pane verdicts).
 *
 * THE TWO DEFECTS this oracle is born to bite (the live K.W4 born-RED witnesses,
 * `live-spring-sequence-mp-verdict.md §2/§3`):
 *
 *   (a) THE STEPPING SLIDER (U-K15). On the J.W7c tree the spring transport
 *       scrubber thumb was driven off `progress` — a `PROGRESS_READOUT_HZ` (6 Hz)
 *       reactive mirror — so the rendered position visibly STEPPED. BORN-RED
 *       WITNESS: over a 2 s play window the thumb traversed ~13 distinct positions
 *       with max-dwell ~21 frames (the ~6 Hz / 167 ms cadence the eye reads as a
 *       step). The cure (S2): a SEPARATE continuous 60 Hz position channel
 *       (`scrubberPhase`) drives the thumb born-continuous; the 6 Hz throttle
 *       stays on the TEXT numerals ONLY. GREEN: ≥ ~150 distinct positions /
 *       max-dwell ≤ 3 frames over the same window (one position per frame).
 *
 *   (b) THE READ-ONLY "EDITOR" (U-K11/U-K16). On the J.W7c tree the spring's
 *       `@keyframes` was READ-ONLY output: `watch(generatedArtifact, css =>
 *       artifactCss.value = css)` OVERWROTE a typed edit on the next param change.
 *       The cure (S1): the engine-owned `KeyframesEditor` (the cube card grammar)
 *       is mounted, two-way bound — a typed per-stop edit PERSISTS and is NOT
 *       overwritten by a later preset/slider interaction (the editor is the
 *       authoritative authoring surface; the solver presets are a derived path).
 *
 * THE ORACLE (the engine-write disambiguation rule — read the ENGINE's own write
 * channel, never the idle bob, the K.W0 inv):
 *   clause (a) samples the RENDERED scrubber-thumb `getBoundingClientRect().left`
 *     per-frame while the machine is `playing` — the position the engine paints,
 *     not the 6 Hz text mirror. The verdict is the DISTINCT-position count + the
 *     MAX-DWELL (consecutive identical positions), device-independent.
 *   clause (b) types an edit into the FIRST keyframe stop, then drives a DIFFERENT
 *     preset, and asserts the edited value PERSISTS in the editor's per-stop card
 *     (the two-way model survives the param interaction).
 *
 * P6 posture: both clauses are device-INDEPENDENT CORRECTNESS gates (a per-frame
 * source-write distinct-count + a DOM-text persistence fact) — they hard-gate.
 * The play-window sample is per-EXPECTED (the distinct-count threshold), NOT a
 * fixed settleMs. Serves the BUILT dist/gh-pages/. Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/proof-spring-slider-continuous.mjs
 *
 * NOTE (W5 boundary): this gate is authored by K.W4 Lane A as the born-RED-to-green
 * CORRECTNESS oracle for S1+S2; K.W5 owns wiring it into the `proof:*` roster + CI
 * (the gate-truth wave). It is standalone-runnable as-is.
 */
import { withPage, navToScene, pressPlayToggle, REQUIRE_BROWSER } from "./lib/demo-driver.mjs";

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";

// Thresholds (the GREEN band — generous against frame jitter, but far above the
// 6 Hz born-RED witness of ~13 distinct / dwell ~21):
//
// DEVICE-INDEPENDENCE (P6): the continuity signal is the distinct-position
// FRACTION (distinct / sampled-frames) and the MAX-DWELL — both frame-RATE
// invariant. An ABSOLUTE distinct count (the old MIN_DISTINCT=120) is NOT: it
// assumes a 60 Hz rAF over the 2 s window, but a loaded CI runner samples ~49 Hz
// (≈98 frames) and would under-count to ~88 distinct while STILL being perfectly
// continuous (dwell 1). The fraction cancels the frame rate: a 60 Hz continuous
// thumb runs ≈ 0.9 distinct/frame; the 6 Hz born-RED step runs ≈ 0.13.
const MIN_DISTINCT_FRACTION = 0.6; // continuous ≈ 0.9; 6 Hz born-RED ≈ 0.13 (0.6 cleanly between)
const MIN_FRAMES = 40; // the play window actually sampled a LIVE thumb (not a frozen capture)
const MAX_DWELL = 4; // a continuous thumb dwells ≤ a few frames; 6 Hz dwells ~21

async function ensurePlaying(page) {
    // T.G3 — the spring scene RESTS on entry now (autoPlays:false), so this gate
    // must actuate Play before it can sample a LIVE 60 Hz thumb (the former
    // auto-play made the scene arrive already `playing`). A bare `button.click()`
    // is EXACTLY the ghost-actuation the transport's F3 press-origin guard rejects
    // (S.B7): the press must originate on the control as an honest primary pointer
    // down→up. `pressPlayToggle(intent:"play")` dispatches that full press; it is a
    // no-op when the transport already reads "Pause".
    const label = await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => {
            const al = (x.getAttribute("aria-label") || "").toLowerCase();
            return al.includes("play") || al.includes("pause");
        });
        return b?.getAttribute("aria-label") || null;
    });
    if ((label || "").toLowerCase().includes("play")) {
        await pressPlayToggle(page, { intent: "play" });
        await page.waitForTimeout(900);
    }
}

async function sampleScrubberContinuity(page) {
    return page.evaluate(async () => {
        const thumbs = [...document.querySelectorAll(".slider-thumb")];
        const scrubber = thumbs.find((t) => {
            let anc = t,
                s = "";
            for (let k = 0; k < 6 && anc; k++) {
                anc = anc.parentElement;
                if (anc) s += anc.className?.toString?.() || "";
            }
            return s.includes("timeline-green");
        });
        if (!scrubber) return { error: "no scrubber thumb found" };
        const samples = [];
        const start = performance.now();
        return await new Promise((resolve) => {
            function tick() {
                samples.push(
                    Math.round(scrubber.getBoundingClientRect().left * 100) / 100,
                );
                if (performance.now() - start < 2000) requestAnimationFrame(tick);
                else {
                    let maxDwell = 1,
                        cur = 1;
                    for (let i = 1; i < samples.length; i++) {
                        if (samples[i] === samples[i - 1]) {
                            cur++;
                            maxDwell = Math.max(maxDwell, cur);
                        } else cur = 1;
                    }
                    resolve({
                        frames: samples.length,
                        distinct: [...new Set(samples)].length,
                        maxDwell,
                        changeCount: samples.filter(
                            (v, i) => i > 0 && v !== samples[i - 1],
                        ).length,
                    });
                }
            }
            requestAnimationFrame(tick);
        });
    });
}

async function probeEditorTwoWay(page) {
    // 1. Type a sentinel value into the first keyframe stop's editable code.
    const edited = await page.evaluate(async () => {
        const pre = document.querySelector(".keyframes-editor-scroll pre");
        if (!pre) return { error: "no editable keyframe stop" };
        pre.focus();
        pre.textContent = "transform: translateX(42%);";
        pre.dispatchEvent(new InputEvent("input", { bubbles: true }));
        pre.dispatchEvent(new Event("blur", { bubbles: true }));
        await new Promise((r) => setTimeout(r, 400));
        return {
            accepted: (
                document.querySelector(".keyframes-editor-scroll pre")
                    ?.textContent || ""
            ).includes("42"),
        };
    });
    if (edited.error || !edited.accepted)
        return { persisted: false, reason: edited.error || "edit not accepted" };

    // 2. Drive a DIFFERENT preset (a solver/param interaction).
    await page.evaluate(async () => {
        const cells = [...document.querySelectorAll(".preset-cell")];
        const inactive = cells.find(
            (c) => c.getAttribute("data-state") !== "on",
        );
        inactive?.click();
        await new Promise((r) => setTimeout(r, 500));
    });

    // 3. Assert the edit PERSISTS (the editor is authoritative).
    return page.evaluate(() => {
        const txt =
            document.querySelector(".keyframes-editor-scroll pre")?.textContent ||
            "";
        return { persisted: txt.includes("42") };
    });
}

async function main() {
    const out = await withPage(
        { label: "proof:spring-slider-continuous" },
        async (page, { url }) => {
            const results = [];

            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(url + "#/spring", { waitUntil: "networkidle" });
            await navToScene(page, "spring", "spring");
            await page.waitForTimeout(2500);

            // ── clause (a) — the scrubber thumb is born-CONTINUOUS ──
            await ensurePlaying(page);
            const cont = await sampleScrubberContinuity(page);
            if (cont.error) {
                results.push({ ok: false, msg: `clause (a): ${cont.error}` });
            } else {
                const distinctFraction =
                    cont.frames > 0 ? cont.distinct / cont.frames : 0;
                const ok =
                    cont.frames >= MIN_FRAMES &&
                    distinctFraction >= MIN_DISTINCT_FRACTION &&
                    cont.maxDwell <= MAX_DWELL;
                results.push({
                    ok,
                    msg:
                        `clause (a) — the spring scrubber thumb is CONTINUOUS ` +
                        `(60 Hz painter, NOT the 6 Hz step): ${cont.distinct} distinct ` +
                        `positions / ${(distinctFraction * 100).toFixed(0)}% distinct-fraction / ` +
                        `max-dwell ${cont.maxDwell} frames over ${cont.frames} sampled ` +
                        `(need ≥${(MIN_DISTINCT_FRACTION * 100).toFixed(0)}% distinct-fraction over ` +
                        `≥${MIN_FRAMES} frames, ≤${MAX_DWELL} dwell — frame-rate-independent; the ` +
                        `born-RED 6 Hz witness was ~13% / dwell ~21)`,
                });
            }

            // ── clause (b) — the keyframes editor is TWO-WAY (edit persists) ──
            const tw = await probeEditorTwoWay(page);
            results.push({
                ok: tw.persisted,
                msg:
                    `clause (b) — the spring keyframes editor is TWO-WAY: a typed ` +
                    `per-stop edit PERSISTS across a preset interaction ` +
                    (tw.persisted
                        ? `(translateX(42%) survived the preset switch)`
                        : `(FAILED: ${tw.reason || "edit was overwritten"})`),
            });

            return results;
        },
    );

    if (out?.skipped) {
        if (REQUIRE_BROWSER) {
            console.error(
                `proof:spring-slider-continuous — HARD FAIL: ${out.reason}`,
            );
            process.exit(1);
        }
        console.log(
            `proof:spring-slider-continuous — SKIP (${out.reason}); set KF_REQUIRE_BROWSER=1 to require it.`,
        );
        process.exit(0);
    }

    const results = out.value;
    let allOk = true;
    console.log(
        "proof:spring-slider-continuous — K.W4 Lane A (S1 two-way editor · S2 60 Hz scrubber)",
    );
    for (const r of results) {
        console.log(`  ${r.ok ? PASS : FAIL} ${r.msg}`);
        if (!r.ok) allOk = false;
    }
    if (allOk) {
        console.log(
            "\nproof:spring-slider-continuous — PASS: the scrubber rides the 60 Hz " +
                "painter (born-continuous, the 6 Hz step cured at root) and the keyframes " +
                "editor is two-way (a typed edit persists — the read-only viewer retired).",
        );
        process.exit(0);
    } else {
        console.error(
            "\nproof:spring-slider-continuous — FAIL: a spring pane CORRECTNESS clause regressed " +
                "(the 6 Hz mirror is driving the slider again, or the editor overwrites a typed edit).",
        );
        process.exit(1);
    }
}

main().catch((e) => {
    console.error("proof:spring-slider-continuous — ERROR:", e);
    process.exit(1);
});
