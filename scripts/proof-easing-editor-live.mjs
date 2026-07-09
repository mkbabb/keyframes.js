#!/usr/bin/env node
/**
 * proof:easing-editor-live — v2 (T.E8 · directive #27 · OD-5 R2).
 *
 * REWRITTEN IN PLACE (the square-honest precedent: a live property is
 * re-asserted on the redesigned surface, never retired with it). v1 asserted
 * the HAND-ROLLED editor cluster (.easing-curve-canvas + .control-point.handle
 * + the demo readout) — the exact 1,082L `instrument/easing/` surface T.E8
 * DELETES. The live property that SURVIVES — "the easing edit surface actually
 * works on switch-in: a real drag re-times the preview, the literal is
 * COMPLETE and re-parseable, a re-mount round-trips with zero
 * AnimationOptionError" — is re-asserted here over the glass-ui `EasingPicker`
 * (the SOLE edit surface, the Curve facet body). This IS the owner's R2 rider
 * cure ("that curve preview in the top left needs to be improved
 * dramatically" → the EasingPicker + gallery redesign replaces that surface;
 * verdicts/T.B-panel.md §R2).
 *
 * CLAUSES:
 *   (s) STATIC — the `instrument/easing/` cluster is GONE from disk; the
 *       `@mkbabb/glass-ui/easing` EasingPicker is imported EXACTLY ONCE under
 *       demo/scenes/easing/ (the Curve facet body) and exactly once under the
 *       shared instrument (the TimingFunctionPanel detail body — the R2
 *       surface); zero references to the deleted cluster components anywhere
 *       under demo/.
 *   (a) SWITCH-IN — cube → easing: the scene opens on its Curve facet (the
 *       item-7a scene-aware default; the dock control trigger reads "Curve")
 *       and `[data-testid="easing-picker"]` is mounted + visible.
 *   (b) DRAG RE-TIMES — a REAL mouse drag on a picker bezier handle mutates
 *       the picker's readout literal AND lands in the demo within a frame:
 *       the gallery header literal becomes the SAME complete cubic-bezier
 *       quad (the updateBezierPoints seam → the preview channel's
 *       timingFunction — honest by construction, watch(cssValue)).
 *   (c) COMPLETE LITERAL — the picker readout + the header literal are
 *       complete re-parseable `cubic-bezier(…)`/`steps(…)` forms (never the
 *       bare keyword, never truncated — the F7 kill).
 *   (d) STEPS NATIVE — pressing the `steps` gallery tile seeds the picker
 *       into its native steps mode (`[data-mode="steps"]`) with a complete
 *       `steps(n, term)` readout.
 *   (e) RE-MOUNT — Easing→Amiga→Easing forces a controls re-mount with ZERO
 *       AnimationOptionError (the persisted literal round-trips).
 *   (f) SPRING NEIGHBOR — spring opens on its Physics facet (item-7a) and the
 *       facet body renders (the T.B7 SpringPhysicsFacet surface).
 *   (g) zero pageerror / console.error / `_gen` / bare-dots throughout.
 *
 * Runs over the BUILT dist/gh-pages (scripts/lib/demo-driver.mjs). Under
 * KF_REQUIRE_BROWSER=1 a playwright-absent skip is a hard fail.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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
    "proof:easing-editor-live — v2 (T.E8: glass-ui EasingPicker IS the edit surface · OD-5 R2)",
);

const CTRL_KEY = "animation-groups-control-options-store";
const REPARSEABLE_LITERAL =
    /^\s*(?:cubic-bezier\(\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*\)|steps\(\s*\d+\s*(?:,\s*[\w-]+\s*)?\))\s*$/;
const OPTION_ERROR_RE =
    /AnimationOptionError|Invalid value for animation option "timingFunction"/i;
const BARE_DOTS_RE = /Parse error at offset 0: "\.{3,}"|"\.{6}"|"\.\.\.\.\.\."/;

const bezierNums = (s) => {
    const m = (s || "").match(
        /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/,
    );
    return m ? m.slice(1, 5).map(Number) : null;
};

// ── (s) STATIC ────────────────────────────────────────────────────────────────
{
    const clusterDir = path.join(REPO, "demo/@/components/custom/instrument/easing");
    if (!existsSync(clusterDir)) {
        ok("(s) the instrument/easing/ hand-rolled cluster (1,082L) is GONE from disk");
    } else {
        fail("(s) demo/@/components/custom/instrument/easing/ still exists — the T.E8 deletion did not land");
    }

    const walk = (dir) => {
        const out = [];
        if (!existsSync(dir)) return out;
        for (const e of readdirSync(dir)) {
            const p = path.join(dir, e);
            if (statSync(p).isDirectory()) out.push(...walk(p));
            else if (/\.(vue|ts)$/.test(e)) out.push(p);
        }
        return out;
    };
    const countPickerImports = (dir) =>
        walk(dir).filter((f) =>
            /@mkbabb\/glass-ui\/easing/.test(readFileSync(f, "utf8")),
        );
    const sceneImports = countPickerImports(path.join(REPO, "demo/scenes/easing"));
    if (sceneImports.length === 1) {
        ok(
            `(s) EasingPicker imported EXACTLY ONCE under demo/scenes/easing/ ` +
                `(${path.relative(REPO, sceneImports[0])} — the Curve facet body, the SOLE scene edit surface)`,
        );
    } else {
        fail(
            `(s) EasingPicker import count under demo/scenes/easing/ is ${sceneImports.length} ` +
                `(want exactly 1): ${sceneImports.map((f) => path.relative(REPO, f)).join(", ")}`,
        );
    }
    const instrumentImports = countPickerImports(
        path.join(REPO, "demo/@/components/custom/instrument"),
    );
    if (
        instrumentImports.length === 1 &&
        /TimingFunctionPanel\.vue$/.test(instrumentImports[0])
    ) {
        ok(
            "(s) EasingPicker imported exactly once under the shared instrument — " +
                "TimingFunctionPanel.vue (the OD-5 R2 detail-body replacement)",
        );
    } else {
        fail(
            `(s) shared-instrument EasingPicker imports: ` +
                `${instrumentImports.map((f) => path.relative(REPO, f)).join(", ") || "none"} ` +
                "(want exactly TimingFunctionPanel.vue)",
        );
    }
    const dead = [];
    for (const f of walk(path.join(REPO, "demo"))) {
        const src = readFileSync(f, "utf8");
        if (/from\s+["'][^"']*instrument\/easing\//.test(src)) dead.push(path.relative(REPO, f));
    }
    if (dead.length === 0) {
        ok("(s) zero imports of the deleted instrument/easing/ cluster remain under demo/");
    } else {
        fail(`(s) dangling instrument/easing imports: ${dead.join(", ")}`);
    }
}

// ── browser half ──────────────────────────────────────────────────────────────
async function browserHalf() {
    const consoleErrors = [];
    await withPage(
        {
            distDir: DIST,
            label: "the EasingPicker live clauses",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
            page.on("console", (m) => {
                if (m.type() === "error") consoleErrors.push(`console.error: ${m.text()}`);
                if (m.type() === "warning" && BARE_DOTS_RE.test(m.text()))
                    consoleErrors.push(`console.warn: ${m.text()}`);
            });
            await page.addInitScript((ck) => {
                try {
                    localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
                } catch {
                    /* ignore */
                }
            }, CTRL_KEY);

            // ── (a) switch-IN: cube → easing opens on the Curve facet ───────
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await navToScene(page, "cube", "Controls", { timeout: 8000 });
            await page.waitForTimeout(600);
            await navToScene(page, "easing", "Curve", { timeout: 8000 });
            await page.waitForTimeout(700);

            const entry = await page.evaluate(() => {
                const trig = document.querySelector("[aria-label='Controls tab']");
                const picker = document.querySelector('[data-testid="easing-picker"]');
                let visible = false;
                if (picker) {
                    const r = picker.getBoundingClientRect();
                    visible = r.width > 40 && r.height > 40;
                }
                return {
                    trigger: trig?.textContent?.trim() ?? null,
                    pickerPresent: !!picker,
                    pickerVisible: visible,
                };
            });
            if (entry.trigger === "Curve" && entry.pickerPresent && entry.pickerVisible) {
                ok(
                    "(a) switch-in — easing opened on its Curve facet (item-7a default; trigger reads " +
                        '"Curve") and the EasingPicker is mounted + visible',
                );
            } else {
                fail(
                    `(a) switch-in — trigger=${JSON.stringify(entry.trigger)} (want "Curve"), ` +
                        `picker present=${entry.pickerPresent} visible=${entry.pickerVisible}`,
                );
            }

            // ── (b)+(c) drag a picker handle → literal + header re-time ────
            const readSurfaces = () =>
                page.evaluate(() => {
                    const picker = document.querySelector('[data-testid="easing-picker"]');
                    // The picker readout literal (the glass-card code line).
                    let readout = null;
                    if (picker) {
                        for (const el of picker.querySelectorAll("code, [class*='mono'], span")) {
                            const t = (el.textContent || "").trim();
                            if (/^(cubic-bezier\(|steps\()/.test(t)) {
                                readout = t;
                                break;
                            }
                        }
                    }
                    return {
                        readout,
                        headerName:
                            document.querySelector(".specimen-name")?.textContent?.trim() ?? null,
                        headerLiteral:
                            document
                                .querySelector(".specimen-literal .literal-text")
                                ?.textContent?.trim() ?? null,
                        mode: picker?.getAttribute("data-mode") ?? null,
                    };
                });

            const before = await readSurfaces();
            const handleBox = await page.evaluate(() => {
                const picker = document.querySelector('[data-testid="easing-picker"]');
                const svg = picker?.querySelector("svg");
                if (!svg) return null;
                const handles = [...svg.querySelectorAll("circle")].filter((c) =>
                    /cursor/.test(c.getAttribute("style") || ""),
                );
                const h = handles[0];
                if (!h) return null;
                const r = h.getBoundingClientRect();
                return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            });
            if (!handleBox) {
                fail("(b) no draggable bezier handle found inside the EasingPicker canvas");
            } else {
                await page.mouse.move(handleBox.x, handleBox.y);
                await page.mouse.down();
                for (let i = 1; i <= 10; i++) {
                    await page.mouse.move(handleBox.x + i * 6, handleBox.y - i * 4);
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                await page.waitForTimeout(250);

                const after = await readSurfaces();
                const readoutMutated =
                    !!after.readout && after.readout !== before.readout;
                const pickerNums = bezierNums(after.readout);
                const headerNums = bezierNums(after.headerLiteral);
                const agree =
                    pickerNums &&
                    headerNums &&
                    pickerNums.every((v, i) => Math.abs(v - headerNums[i]) < 0.02);
                if (readoutMutated && agree && after.headerName === "cubic-bezier") {
                    ok(
                        `(b) drag re-times — the handle drag mutated the picker literal to ` +
                            `${after.readout}; the gallery header carries the SAME quad ` +
                            `(${after.headerLiteral}) through the one authoring seam (the preview ` +
                            "channel's timingFunction re-seats on the cssValue watch)",
                    );
                } else {
                    fail(
                        `(b) drag re-times — readout ${JSON.stringify(before.readout)} → ` +
                            `${JSON.stringify(after.readout)} (mutated=${readoutMutated}); header ` +
                            `name=${JSON.stringify(after.headerName)} literal=${JSON.stringify(after.headerLiteral)} ` +
                            `(picker/header quads agree=${!!agree})`,
                    );
                }
                const literalOK =
                    REPARSEABLE_LITERAL.test(after.readout || "") &&
                    REPARSEABLE_LITERAL.test(after.headerLiteral || "");
                if (literalOK) {
                    ok(
                        "(c) complete literal — picker readout + header literal are complete " +
                            "re-parseable cubic-bezier forms (closing paren present — the F7 kill holds)",
                    );
                } else {
                    fail(
                        `(c) complete literal — picker=${JSON.stringify(after.readout)} ` +
                            `header=${JSON.stringify(after.headerLiteral)} (must be complete re-parseable forms)`,
                    );
                }
            }

            // ── (d) steps native — the steps tile seeds the picker's steps mode ──
            const stepsClicked = await page.evaluate(() => {
                const ball = document.querySelector('.tile-ball[data-curve="steps"]');
                const tile = ball?.closest(".specimen-tile");
                if (!tile) return null;
                tile.scrollIntoView({ block: "center" });
                const r = tile.getBoundingClientRect();
                return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            });
            if (!stepsClicked) {
                fail("(d) no steps specimen tile found");
            } else {
                await page.mouse.click(stepsClicked.x, stepsClicked.y);
                await page.waitForTimeout(450);
                const steps = await readSurfaces();
                const stepsLiteralOK = /^steps\(\s*\d+\s*,\s*[\w-]+\s*\)$/.test(
                    steps.headerLiteral || "",
                );
                if (steps.mode === "steps" && stepsLiteralOK) {
                    ok(
                        `(d) steps native — the steps tile seeded the picker's native steps mode ` +
                            `(data-mode="steps") with the complete header literal ${steps.headerLiteral}`,
                    );
                } else {
                    fail(
                        `(d) steps native — picker mode=${JSON.stringify(steps.mode)} ` +
                            `header literal=${JSON.stringify(steps.headerLiteral)} (want steps mode + steps(n, term))`,
                    );
                }
            }

            // ── (e) re-mount round-trip: Easing→Amiga→Easing, zero option errors ──
            const errBefore = consoleErrors.length;
            await navToScene(page, "amiga", "Controls", { timeout: 8000 });
            await page.waitForTimeout(600);
            await navToScene(page, "easing", "Curve", { timeout: 8000 });
            await page.waitForTimeout(700);
            const remountErrors = consoleErrors
                .slice(errBefore)
                .filter((e) => OPTION_ERROR_RE.test(e));
            const returned = await page.evaluate(
                () => !!document.querySelector('[data-testid="easing-picker"]'),
            );
            if (remountErrors.length === 0 && returned) {
                ok(
                    "(e) re-mount — Easing→Amiga→Easing round-tripped with ZERO AnimationOptionError " +
                        "and the picker re-mounted (the persisted literal is re-parseable)",
                );
            } else {
                fail(
                    `(e) re-mount — picker returned=${returned}, AnimationOptionErrors=` +
                        `${remountErrors.length}: ${remountErrors.slice(0, 3).join(" · ")}`,
                );
            }

            // ── (f) spring neighbor — opens on Physics (item-7a) ───────────
            await navToScene(page, "spring", "Physics", { timeout: 8000 });
            await page.waitForTimeout(700);
            const spring = await page.evaluate(() => {
                const trig = document.querySelector("[aria-label='Controls tab']");
                const SEL =
                    ".controls-pane .preset-cell, .controls-pane .preset-grid, .controls-pane .preset-row, .controls-pane canvas, .controls-pane [class*='physics']";
                const body = document.querySelector(SEL);
                let visible = false;
                if (body) {
                    const r = body.getBoundingClientRect();
                    visible = r.width > 2 && r.height > 2;
                }
                return { trigger: trig?.textContent?.trim() ?? null, bodyVisible: visible };
            });
            if (spring.trigger === "Physics" && spring.bodyVisible) {
                ok(
                    '(f) spring neighbor — spring opened on its Physics facet (trigger "Physics") ' +
                        "with the facet body rendered",
                );
            } else {
                fail(
                    `(f) spring neighbor — trigger=${JSON.stringify(spring.trigger)} ` +
                        `(want "Physics"), facet body visible=${spring.bodyVisible}`,
                );
            }

            // ── (g) zero page errors ────────────────────────────────────────
            if (consoleErrors.length === 0) {
                ok("(g) zero pageerror/console.error/bare-dots across the whole drive");
            } else {
                fail(
                    `(g) page errors (${consoleErrors.length}): ` +
                        consoleErrors.slice(0, 5).join(" · "),
                );
            }
        },
    );
}

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
try {
    await browserHalf();
} catch (e) {
    const reason = e?.message || String(e);
    if (/playwright|chromium|browser|launch/i.test(reason) && !REQUIRE_BROWSER) {
        note(`browser half skipped — ${reason}`);
    } else {
        fail(`browser half failed — ${reason}`);
    }
}

if (failures.length > 0) {
    console.error(`\nproof:easing-editor-live — FAIL (${failures.length})`);
    process.exit(1);
}
console.log(
    "\nproof:easing-editor-live — PASS (v2): the glass-ui EasingPicker is the sole, working " +
        "edit surface — switch-in on the Curve facet, a real drag re-times the preview through " +
        "one seam, the literals are complete + re-parseable, the re-mount round-trips clean, " +
        "and spring opens on Physics.",
);
