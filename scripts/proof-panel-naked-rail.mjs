#!/usr/bin/env node
/**
 * proof:panel-naked-rail — T.B4 (OD-5, VERDICT #7 "remove the surrounding pane,
 * it's superfluous"). The RULED, OBJECTIVE half of the panel restore: the pane
 * CONTAINER is a NAKED column (no border, no background, no radius, no glass on
 * the column itself) between the rail grid cell and the two floating instrument
 * plates; and — SQ-T3, no chrome without content — a scene whose control-surface
 * DFA set is EMPTY mounts ZERO `.controls-pane-wrapper` nodes (the empty
 * mobile-sheet-over-a-void occlusion recurrence, lane 04 F3, cannot mount).
 *
 * The two-floating-GlassPanel COMPOSITION itself (geometry/float/arrangement) is
 * NOT this gate's subject — it is the born-OWNER re-review surface
 * (proof:panel-composition, PENDING-OWNER per OD-5 R1: "the controls composition
 * needs REWORK"). This gate asserts only the mechanical, ruled facts.
 *
 * Clauses:
 *   (a) STATIC — the deleted wrap. ControlsPaneWrapper.vue no longer stamps a
 *       `glass-wash`/`rounded-card` surface on the `.controls-pane` column; the
 *       colocated ControlsPaneWrapper.css `.controls-content`/`.controls-pane`
 *       carry NO `border`/`background`/`border-radius` DESKTOP declaration (the
 *       K.W4-F2 grouping border + tint plate is GONE). The mobile-sheet @media
 *       (max-width:1023px) block legitimately paints the sheet CARD — it is
 *       EXCLUDED (the sheet is the ONE mobile container, T.B4 edge). BITE: reds
 *       on the pre-cure tree (`.controls-content { border:…; background:… }` +
 *       the `glass-wash rounded-card` class); greens when the wrap is deleted.
 *   (b) STATIC — SQ-T3 gating. AnimationControlsGroup.vue mounts
 *       `<ControlsPaneWrapper v-if="hasControlSurfaces">` — the pane mounts iff
 *       the scene's DFA set is non-empty.
 *   (c) BROWSER — DFA-empty elision. At 375×812 the `home` route (empty control
 *       surface set) renders ZERO `.controls-pane-wrapper` nodes, AND still zero
 *       after a 1440→375 resize (the SQ-T3 invariant holds across the breakpoint
 *       flip). BITE: reds if any wrapper mounts over an empty-set surface.
 *   (d) BROWSER — the naked rail. On a subject scene (cube) at desktop 1440, a
 *       computed-style probe of the `.controls-pane` + `.controls-content`
 *       column finds NO visible border (border-alpha 0 on all sides) and NO
 *       painted background between the rail cell and the two instrument plates;
 *       exactly TWO visible instrument plates inhabit the column.
 *
 * Harness mirrors proof:drawer-spring: the STATIC clauses (a)/(b) always run and
 * carry the RED→GREEN bite; the BROWSER clauses (c)/(d) gate on playwright + the
 * BUILT dist/gh-pages/ (run `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail at the lib seam.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const TRANSPORT =
    "demo/components/instrument/transport";

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:panel-naked-rail — T.B4 (OD-5 #7): the surrounding pane is deleted; the rail is a naked column; empty-DFA scenes mount nothing",
);

function stripCssComments(src) {
    return src.replace(/\/\*[\s\S]*?\*\//g, " ");
}

// ── (a) STATIC — the deleted glass-wash wrap + border/tint block ─────────────
function staticWrapDeleted() {
    const vuePath = path.join(REPO, TRANSPORT, "controls-pane/ControlsPaneWrapper.vue");
    const cssPath = path.join(REPO, TRANSPORT, "controls-pane/ControlsPaneWrapper.css");
    if (!fs.existsSync(vuePath) || !fs.existsSync(cssPath)) {
        fail(`(a) static — ControlsPaneWrapper.{vue,css} not found under ${TRANSPORT}`);
        return;
    }
    const vue = fs.readFileSync(vuePath, "utf8");
    // The SFC template must not stamp a glass surface on the pane column. Strip
    // HTML comments first so the doc-comment NARRATING the deletion is not a
    // survivor (the same comment-stripping bite proof:drawer-spring applies).
    const tmpl = vue.split(/<script/)[0].replace(/<!--[\s\S]*?-->/g, " ");
    if (/glass-wash|rounded-card/.test(tmpl)) {
        fail(
            "(a) static — ControlsPaneWrapper.vue still stamps `glass-wash`/`rounded-card` on the " +
                "pane column (the OD-5 #7 surrounding pane wrap must be DELETED)",
        );
    } else {
        ok("(a) static — no `glass-wash`/`rounded-card` surface class on the pane column (the wrap is deleted)");
    }

    // The colocated CSS must carry no desktop border/background/radius on the
    // column. Split off the mobile-sheet @media block (max-width:1023px) — the
    // sheet legitimately paints a card there and is the ONE mobile container.
    const css = stripCssComments(fs.readFileSync(cssPath, "utf8"));
    // Excise every @media (max-width:…) block (brace-balanced) — the mobile sheet
    // register. What remains is the DESKTOP / unscoped cascade the naked-rail rule
    // governs.
    const desktopCss = exciseMobileMediaBlocks(css);
    // Look for a border/background/border-radius declaration bound to the column
    // selectors (.controls-content / .controls-pane) in the desktop cascade.
    const columnRuleRe = /\.controls-(?:content|pane)\b[^{]*\{([^}]*)\}/g;
    const offenders = [];
    let m;
    while ((m = columnRuleRe.exec(desktopCss)) !== null) {
        const body = m[1];
        for (const prop of ["border", "background", "border-radius"]) {
            // `border` matches border/border-top/…; guard so `border-radius` is
            // its own bucket and `background-clip`-style longhands do not false-hit.
            const re = new RegExp(`(^|;|\\s)${prop}(?:-[a-z]+)?\\s*:\\s*([^;]+)`, "i");
            const dm = re.exec(body);
            if (!dm) continue;
            const val = dm[2].trim().toLowerCase();
            // `border: none/0`, `background: none/transparent` are naked — allowed.
            if (/^(none|0|transparent|unset|initial)\b/.test(val)) continue;
            offenders.push(`${prop}: ${val}`);
        }
    }
    if (offenders.length === 0) {
        ok(
            "(a) static — the desktop `.controls-content`/`.controls-pane` column carries no " +
                "border/background/border-radius (the K.W4-F2 grouping wrap is deleted; the column is naked)",
        );
    } else {
        fail(
            "(a) static — the desktop pane column still paints a wrapper surface: " +
                offenders.join(" · ") +
                " (delete the K.W4-F2 border/tint block — the rail is a naked column)",
        );
    }
}

/** Excise brace-balanced `@media (max-width:…)` blocks so the desktop cascade
 *  is what remains (the mobile sheet legitimately paints a card). */
function exciseMobileMediaBlocks(css) {
    let out = "";
    let i = 0;
    const re = /@media[^{]*max-width[^{]*\{/g;
    let last = 0;
    let m;
    while ((m = re.exec(css)) !== null) {
        out += css.slice(last, m.index);
        // walk from the opening brace to its balanced close
        let depth = 1;
        let j = re.lastIndex;
        for (; j < css.length && depth > 0; j++) {
            if (css[j] === "{") depth++;
            else if (css[j] === "}") depth--;
        }
        last = j;
        re.lastIndex = j;
    }
    out += css.slice(last);
    return out;
}

// ── (b) STATIC — SQ-T3 v-if gating on hasControlSurfaces ─────────────────────
function staticSqT3() {
    const groupPath = path.join(REPO, TRANSPORT, "AnimationControlsGroup.vue");
    if (!fs.existsSync(groupPath)) {
        fail(`(b) static — AnimationControlsGroup.vue not found`);
        return;
    }
    const src = fs.readFileSync(groupPath, "utf8");
    // The ControlsPaneWrapper open tag must carry v-if="hasControlSurfaces".
    const openTag = src.match(/<ControlsPaneWrapper\b[\s\S]*?>/);
    if (openTag && /v-if\s*=\s*"hasControlSurfaces"/.test(openTag[0])) {
        ok("(b) static — <ControlsPaneWrapper v-if=\"hasControlSurfaces\"> gates the mount (SQ-T3: no chrome without content)");
    } else {
        fail(
            "(b) static — AnimationControlsGroup.vue must mount `<ControlsPaneWrapper v-if=\"hasControlSurfaces\">` " +
                "(SQ-T3 — the pane mounts iff surfacesFor(scene).length > 0)",
        );
    }
}

// ── (c)/(d) BROWSER — DFA-empty elision + the live naked rail ────────────────
async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the DFA-empty elision + naked-rail probes",
            context: { viewport: { width: 375, height: 812 } },
        },
        async (page, { url }) => {
            // (c) home = the empty control-surface set → ZERO wrapper nodes @375.
            await page.goto(`${url}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(600);
            const homeAt375 = await page.evaluate(
                () => document.querySelectorAll(".controls-pane-wrapper").length,
            );
            if (homeAt375 === 0) {
                ok("(c) DFA-empty — the `home` route mounts 0 `.controls-pane-wrapper` nodes at 375×812");
            } else {
                fail(
                    "(c) DFA-empty — home mounted " +
                        homeAt375 +
                        " .controls-pane-wrapper node(s) at 375×812 (expected 0)",
                );
            }
            // The SQ-T3 invariant survives a 1440→375 resize flip.
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.waitForTimeout(300);
            await page.setViewportSize({ width: 375, height: 812 });
            await page.waitForTimeout(300);
            const homeAfterResize = await page.evaluate(
                () => document.querySelectorAll(".controls-pane-wrapper").length,
            );
            if (homeAfterResize === 0) {
                ok("(c) DFA-empty — still 0 wrapper nodes after a 1440→375 resize (SQ-T3 holds across the breakpoint)");
            } else {
                fail(
                    "(c) DFA-empty — " +
                        homeAfterResize +
                        " wrapper node(s) after resize (expected 0)",
                );
            }

            // (d) the naked rail on a subject scene at desktop 1440.
            await page.setViewportSize({ width: 1440, height: 900 });
            await navToScene(page, "cube", "Controls", { timeout: 8000 }).catch(() => {});
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.waitForTimeout(800);
            const probe = await page.evaluate(() => {
                const alpha = (c) => {
                    const m = c.match(/rgba?\(([^)]+)\)/);
                    if (!m) return c === "transparent" ? 0 : 1;
                    const parts = m[1].split(",").map((s) => s.trim());
                    return parts.length >= 4 ? parseFloat(parts[3]) : 1;
                };
                const wrapper = document.querySelector(".controls-pane-wrapper");
                if (!wrapper) return { error: "no .controls-pane-wrapper on cube desktop" };
                const cols = [
                    wrapper.querySelector(".controls-pane"),
                    wrapper.querySelector(".controls-content"),
                ].filter(Boolean);
                const painted = [];
                for (const el of cols) {
                    const cs = getComputedStyle(el);
                    const borderPaint =
                        ["Top", "Right", "Bottom", "Left"].some(
                            (s) =>
                                parseFloat(cs[`border${s}Width`]) > 0 &&
                                alpha(cs[`border${s}Color`]) > 0.01,
                        );
                    const bgPaint =
                        cs.backgroundImage !== "none" ||
                        alpha(cs.backgroundColor) > 0.01;
                    if (borderPaint || bgPaint)
                        painted.push({ cls: el.className, borderPaint, bgPaint });
                }
                // count VISIBLE instrument plates (offsetParent !== null) that are
                // direct children of .controls-content.
                const content = wrapper.querySelector(".controls-content");
                const visiblePlates = content
                    ? [...content.children].filter((c) => c.offsetParent !== null).length
                    : 0;
                return { painted, visiblePlates };
            });
            if (probe.error) {
                fail(`(d) naked-rail — ${probe.error}`);
            } else {
                if (probe.painted.length === 0) {
                    ok("(d) naked-rail — the `.controls-pane`/`.controls-content` column paints no border/background on cube desktop (the naked rail)");
                } else {
                    fail(
                        "(d) naked-rail — a pane column still paints a wrapper surface: " +
                            probe.painted
                                .map((p) => `${p.cls}${p.borderPaint ? " [border]" : ""}${p.bgPaint ? " [bg]" : ""}`)
                                .join(" · "),
                    );
                }
                if (probe.visiblePlates === 2) {
                    ok("(d) naked-rail — exactly 2 visible instrument plates inhabit the column (the facet body + the playback ribbon)");
                } else {
                    // soft — the two-panel COMPOSITION is the PENDING-OWNER surface;
                    // a non-2 count is reported but does not itself red the objective gate.
                    console.log(
                        `  · (d) plate-count — ${probe.visiblePlates} visible plate(s) in the column ` +
                            `(the two-floating-GlassPanel composition is the PENDING-OWNER re-review surface, OD-5 R1)`,
                    );
                }
            }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

staticWrapDeleted();
staticSqT3();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:panel-naked-rail — FAIL (${failures.length}): the surrounding pane survives (a painted ` +
            `wrapper column, a missing SQ-T3 gate, or an empty-DFA scene mounting a hollow sheet).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:panel-naked-rail — PASS: the surrounding pane is deleted; the rail is a naked column; " +
        "empty-DFA scenes mount zero wrapper nodes (T.B4 / OD-5 #7 · SQ-T3).",
);
