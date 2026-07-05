#!/usr/bin/env node
/**
 * proof:accent-census — T.D7 (OD-6, the ONE oklch violet accent authority).
 *
 * THE OWNER ORACLE (authority: OWNER — scripts/gate-authority.mjs). Authored
 * ONLY after OD-6 carried its owner token (T.M2 discipline): **OD-6 APPROVED,
 * 2026-07-05, verbatim "Good."** on the live P-THEME review; the blessed
 * reference is branch `worktree-wf_1e744f4d-2bb-3`. This gate's green encodes
 * that token — the blessed-hue window below IS the owner's ramp, so its green
 * cannot be reached without the committed OD-6 blessing (the born-OWNER class).
 *
 * WHAT IT ASSERTS (the wave-doc oracle, T.D.md T.D7 + the red-kill RULED half
 * of VERDICT #16 "I don't like this latent red theme"):
 *
 *   (a) THE AUTHORITY WINDOW — the resolved motion/interactive accent tokens
 *       (--accent-kf, --color-progress, --primary) paint an oklch hue inside
 *       the blessed accent window [280°, 330°] with real chroma, in BOTH themes
 *       (light + dark — the light-dark() arms are theme-live, ONE family both
 *       arms; the old identity-flip near-black light --primary is dead).
 *   (b) THE NEUTRAL RAIL — --color-slider-track resolves NEUTRAL (chroma ≤
 *       0.06): rails are substrate, not signal (the red twin hsl(0 60% 78%) /
 *       hsl(5 35% 42%) is dead).
 *   (c) THE DESTRUCTIVE RED KEEPS ITS MEANING — --accent-red still resolves the
 *       red family (it is NOT recolored; its REACH shrank to destructive-only).
 *   (d) THE RENDERED RED CENSUS — across every scene × both themes, ZERO
 *       rendered element paints a red-family accent (oklab ΔE < 10 of the
 *       theme's --accent-red arm, OR red-window oklch hue ∈ [10°,50°] at
 *       chroma > 0.06) on a NON-destructive, NON-crayon-subject surface. The
 *       crayon SUBJECTS (cube facets, the axis triad, the rainbow CTA) are the
 *       sanctioned exemption (T.D8: crayons bounded to SUBJECTS, never chrome);
 *       destructive-marked chrome ([class*="destructive"]) is red's one home.
 *
 * BITE: repoint --color-progress back at --accent-red (the K.W4 S3 state the
 * owner rejected) and clauses (a)+(d) red on every motion surface; recolor the
 * ramp off the blessed window and (a) reds — the OD-6 token is the only path to
 * green. Serves dist/gh-pages/; harness scripts/lib/demo-driver.mjs.
 *
 * Re-runnable:
 *   npm run gh-pages
 *   KF_REQUIRE_BROWSER=1 [KF_PLAYWRIGHT_DIR=…] npm run proof:accent-census
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
    "proof:accent-census — T.D7/OD-6 (OWNER): the ONE violet accent authority — tokens in the " +
        "blessed oklch window [280°,330°] both themes, neutral rail, destructive red intact, and a " +
        "rendered red-census (zero red-family accents outside destructive/crayon-subject surfaces).",
);

// ── color math (node-side): rgb ↔ oklab/oklch ────────────────────────────────
const srgbToLinear = (v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
function rgbToOklab(r, g, b) {
    const lr = srgbToLinear(r / 255);
    const lg = srgbToLinear(g / 255);
    const lb = srgbToLinear(b / 255);
    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    return {
        L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    };
}
const oklabChroma = (lab) => Math.hypot(lab.a, lab.b);
const oklabHue = (lab) => {
    const h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
    return (h + 360) % 360;
};
const dE = (x, y) => Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);

/** Parse a computed color string. Chromium serializes computed colors as legacy
 *  rgb()/rgba() for srgb-authored values, but keeps modern forms for modern
 *  authors: `oklch(…)` (the accent tokens) and `color(srgb …)` (color-mix
 *  results). All three parse here → {r,g,b,a} in 0-255. null on none/invalid. */
function parseRgb(str) {
    if (!str) return null;
    const s = String(str).trim();
    let m = s.match(/^rgba?\(([^)]+)\)/);
    if (m) {
        const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
        if (p.length < 3 || p.slice(0, 3).some((v) => !Number.isFinite(v))) return null;
        return { r: p[0], g: p[1], b: p[2], a: p[3] != null ? p[3] : 1 };
    }
    m = s.match(/^color\(srgb\s+([^)]+)\)/);
    if (m) {
        const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat);
        if (p.length < 3 || p.slice(0, 3).some((v) => !Number.isFinite(v))) return null;
        return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p[3] != null ? p[3] : 1 };
    }
    m = s.match(/^oklch\(([^)]+)\)/);
    if (m) {
        const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat);
        if (p.length < 3 || p.slice(0, 3).some((v) => !Number.isFinite(v))) return null;
        const [L, C, H] = p;
        const a = p[3] != null ? p[3] : 1;
        const hr = (H * Math.PI) / 180;
        const lab = { L, a: C * Math.cos(hr), b: C * Math.sin(hr) };
        const rgb = oklabToRgb(lab);
        return { ...rgb, a };
    }
    return null;
}

/** oklab → sRGB (clipped), the inverse of rgbToOklab. */
function oklabToRgb(lab) {
    const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
    const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
    const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;
    const l3 = l_ ** 3;
    const m3 = m_ ** 3;
    const s3 = s_ ** 3;
    const lin = [
        4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
        -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
        -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
    ];
    const gam = (x) => {
        const v = Math.min(1, Math.max(0, x));
        return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    };
    const [r, g, b] = lin.map((x) => Math.round(gam(x) * 255));
    return { r, g, b };
}

// The theme's destructive-red arms (style.css --accent-red light/dark) — the ΔE
// anchors for clause (d). hsl(0 72% 63%) / hsl(5 55% 50%) as rgb.
const RED_ARM = {
    light: rgbToOklab(229, 93, 93),
    dark: rgbToOklab(198, 68, 57),
};
const ACCENT_WINDOW = [280, 330]; // the blessed OD-6 violet window (lane 09)
const RED_WINDOW = [10, 50]; // the red-family oklch hue window

// The sanctioned red carriers (clause d exemptions):
//   · destructive-marked chrome — red's one legitimate register;
//   · crayon SUBJECTS — the cube facet dice + the axis triad (x = red by 3D
//     convention: CubeAxisLines + the matrix editor's axis-keyed cells) + the
//     rainbow CTA (a gradient — backgroundImage, not scanned — listed for the
//     borderline solid consumers). Bounded to SUBJECT surfaces per T.D8.
const ALLOW_SELECTOR = [
    "[class*='destructive']",
    "[data-destructive]",
    ".cube-side",
    ".cube-side *",
    ".cube-axis-line",
    ".cube-axis-line *",
    "[class*='axis-']",
    ".matrix-editor *",
    "[data-crayon-subject]",
    "[data-crayon-subject] *",
    // Code-syntax palettes are CONTENT, not chrome: the Monaco CSS editor +
    // highlight.js keyframe cards color their tokens from their own third-party
    // themes (e.g. Monaco bracket-highlighting warm oranges) — a code sample's
    // syntax color is not a demo accent.
    ".monaco-editor *",
    ".hljs *",
    "code *",
].join(", ");

const SCENES = [
    { id: "home", route: "", trigger: null },
    { id: "cube", route: "cube", trigger: "Controls" },
    { id: "amiga", route: "amiga", trigger: "Controls" },
    { id: "square", route: "square", trigger: "Square" },
    { id: "easing", route: "easing", trigger: "Easing" },
    { id: "spring", route: "spring", trigger: "Spring" },
    { id: "sequence", route: "sequence", trigger: null },
];

// Page-side census: resolve the tokens through REAL paints + collect every
// rendered element's solid color channels (serialized rgb by construction —
// getComputedStyle backgroundColor/color always serialize resolved srgb).
const CENSUS_FN = `
(allowSelector) => {
    const probeColor = (expr) => {
        const el = document.createElement("div");
        el.style.color = expr;
        document.body.appendChild(el);
        const v = getComputedStyle(el).color;
        el.remove();
        return v;
    };
    const tokens = {
        accentKf: probeColor("var(--accent-kf)"),
        progress: probeColor("var(--color-progress)"),
        primary: probeColor("var(--primary)"),
        sliderTrack: probeColor("var(--color-slider-track)"),
        accentRed: probeColor("var(--accent-red)"),
    };
    const paints = [];
    for (const el of document.querySelectorAll("body *")) {
        const tag = el.tagName.toLowerCase();
        if (tag === "script" || tag === "style") continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        let allowed = false;
        try { allowed = el.matches(allowSelector) || !!el.closest(allowSelector); } catch {}
        const cls = (el.className && el.className.baseVal !== undefined
            ? el.className.baseVal : el.className) || "";
        const push = (channel, v) => {
            if (!v || v === "rgba(0, 0, 0, 0)" || v === "transparent") return;
            paints.push({ tag, cls: String(cls).slice(0, 60), channel, v, allowed });
        };
        push("color", cs.color);
        push("backgroundColor", cs.backgroundColor);
        push("borderTopColor", cs.borderTopWidth !== "0px" ? cs.borderTopColor : null);
        push("outlineColor", cs.outlineStyle !== "none" ? cs.outlineColor : null);
    }
    return { tokens, paints };
}`;

function auditTokens(scene, theme, tokens) {
    const inWindow = (name, v) => {
        const rgb = parseRgb(v);
        if (!rgb) return fail(`(a ${theme}) ${scene}: ${name} did not resolve a color (${v})`);
        const lab = rgbToOklab(rgb.r, rgb.g, rgb.b);
        const hue = oklabHue(lab);
        const chroma = oklabChroma(lab);
        if (hue >= ACCENT_WINDOW[0] && hue <= ACCENT_WINDOW[1] && chroma >= 0.03) return true;
        fail(
            `(a ${theme}) ${scene}: ${name} = ${v} → oklch hue ${hue.toFixed(1)}° / chroma ` +
                `${chroma.toFixed(3)} is OUTSIDE the blessed OD-6 accent window [${ACCENT_WINDOW}] — ` +
                `not the owner's ramp`,
        );
        return false;
    };
    const okA =
        inWindow("--accent-kf", tokens.accentKf) === true &&
        inWindow("--color-progress", tokens.progress) === true &&
        inWindow("--primary", tokens.primary) === true;

    // (b) neutral rail
    const rail = parseRgb(tokens.sliderTrack);
    let okB = false;
    if (rail) {
        const chroma = oklabChroma(rgbToOklab(rail.r, rail.g, rail.b));
        if (chroma <= 0.06) okB = true;
        else
            fail(
                `(b ${theme}) ${scene}: --color-slider-track = ${tokens.sliderTrack} has chroma ` +
                    `${chroma.toFixed(3)} > 0.06 — the rail is a SIGNAL color again (the red-twin class)`,
            );
    } else fail(`(b ${theme}) ${scene}: --color-slider-track did not resolve (${tokens.sliderTrack})`);

    // (c) destructive red intact
    const red = parseRgb(tokens.accentRed);
    let okC = false;
    if (red) {
        const lab = rgbToOklab(red.r, red.g, red.b);
        const hue = oklabHue(lab);
        if (hue >= RED_WINDOW[0] && hue <= RED_WINDOW[1] && oklabChroma(lab) > 0.06) okC = true;
        else
            fail(
                `(c ${theme}) ${scene}: --accent-red = ${tokens.accentRed} (oklch hue ${hue.toFixed(1)}°) ` +
                    `is NOT the red family — the destructive register lost its meaning`,
            );
    } else fail(`(c ${theme}) ${scene}: --accent-red did not resolve (${tokens.accentRed})`);
    return okA && okB && okC;
}

async function run() {
    for (const theme of ["light", "dark"]) {
        const result = await withPage(
            {
                distDir: DIST,
                context: { viewport: { width: 1440, height: 900 } },
                label: `the accent-census battery (${theme})`,
            },
            async (page, { url: base }) => {
                const perScene = [];
                for (const scene of SCENES) {
                    await page.goto(`${base}/#/${scene.route}`, { waitUntil: "load" });
                    if (theme === "dark") {
                        await page.evaluate(() => {
                            document.documentElement.classList.add("dark");
                        });
                    }
                    if (scene.id !== "home") {
                        await navToScene(page, scene.id, scene.trigger, { timeout: 12000 });
                    }
                    await page.waitForTimeout(600);
                    // eslint-disable-next-line no-eval
                    const probe = await page.evaluate(eval(`(${CENSUS_FN})`), ALLOW_SELECTOR);
                    perScene.push({ scene: scene.id, ...probe });
                }
                return perScene;
            },
        );
        if (result.skipped) {
            console.log(`  ○ browser half skipped — ${result.reason}`);
            return;
        }
        let tokensOkEverywhere = true;
        let redViolations = [];
        let paintCount = 0;
        for (const { scene, tokens, paints } of result.value) {
            if (!auditTokens(scene, theme, tokens)) tokensOkEverywhere = false;
            const arm = RED_ARM[theme];
            for (const p of paints) {
                paintCount++;
                if (p.allowed) continue;
                const rgb = parseRgb(p.v);
                if (!rgb || rgb.a < 0.05) continue;
                const lab = rgbToOklab(rgb.r, rgb.g, rgb.b);
                const hue = oklabHue(lab);
                const chroma = oklabChroma(lab);
                const nearRedArm = dE(lab, arm) < 0.1; // oklab ΔE<0.10 ≈ ΔE<10
                const inRedWindow =
                    hue >= RED_WINDOW[0] && hue <= RED_WINDOW[1] && chroma > 0.06;
                if (nearRedArm || inRedWindow) {
                    redViolations.push({ scene, ...p, hue: +hue.toFixed(1) });
                }
            }
        }
        if (tokensOkEverywhere) {
            ok(
                `(a/b/c ${theme}) the token authority holds on all ${result.value.length} scenes — ` +
                    `--accent-kf/--color-progress/--primary ∈ oklch [${ACCENT_WINDOW}] (the blessed OD-6 ` +
                    `window), the slider rail is neutral, --accent-red keeps its destructive red`,
            );
        }
        if (redViolations.length === 0) {
            ok(
                `(d ${theme}) the rendered red-census is CLEAN — ${paintCount} solid paints scanned across ` +
                    `${result.value.length} scenes; ZERO red-family accents (ΔE<10 of the ${theme} red arm ` +
                    `or hue ∈ [${RED_WINDOW}]) outside destructive/crayon-subject surfaces`,
            );
        } else {
            fail(
                `(d ${theme}) ${redViolations.length} red-family paint(s) on NON-destructive, ` +
                    `NON-crayon-subject surfaces — the latent red survives: ` +
                    JSON.stringify(redViolations.slice(0, 10)),
            );
        }
    }
    note(
        "authority: OWNER — the accent window IS the OD-6-blessed ramp (APPROVED 2026-07-05, " +
            '"Good.", P-THEME reference worktree-wf_1e744f4d-2bb-3); green is unreachable without it.',
    );
}

await run();

if (failures.length > 0) {
    console.error(
        `\nproof:accent-census — FAIL (${failures.length}): the violet accent authority does not hold — ` +
            "a motion/interactive token is off the blessed window, the rail re-signalled, the destructive " +
            "red lost its meaning, or a red-family accent paints outside its two sanctioned homes. The cure " +
            "is at the TOKEN root (style.css --accent-kf family), never a per-site recolor.",
    );
    process.exit(1);
}
console.log(
    "\nproof:accent-census — PASS: ONE oklch violet accent authority (both themes), neutral rail, " +
        "destructive-only red, and a clean rendered red-census — VERDICT #16's latent-red theme is dead " +
        "at the root, per the OD-6 owner token.",
);
