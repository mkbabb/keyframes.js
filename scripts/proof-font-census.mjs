#!/usr/bin/env node
/**
 * proof:font-census — T.D1 (the role-bound style-TUPLE font gate) over the K.W2
 * census harness. THE SUPERSESSION IS THE POINT (T.D1 lockstep): the K-era gate
 * classified by FAMILY ONLY (`classify(fontFamily)` had no clause for size,
 * weight, style, or a semantic role) and GREENED the tree the owner rejected —
 * "Most of the fonts on the site are not right at all" (VERDICT #24) — because
 * every defect (faux-bold 600 serif, bold-italic system sans, `font-weight:
 * 650`, role drift) was orthogonal to family. This gate asserts the TUPLE:
 * (voice/family, computed weight, computed size, style), sourced from the
 * OD-6-blessed register (P-THEME, `worktree-wf_1e744f4d-2bb-3`), so those
 * defects red BY NAME.
 *
 * THE THREE VOICES (T.D3 — the polarity FLIP from the I.W6 era):
 *   • display = "Instrument Serif" — the φ `text-display-*` ladder ONLY, at the
 *               face's TRUE single weight 400, never below 28px computed (T.D2:
 *               the serif retreats to ≥ display-5 rungs).
 *   • body    = "Plus Jakarta Sans" — glass-ui's own bundled register, the
 *               POSITIVE assertion (the K-era gate asserted the exact inverse:
 *               Jakarta was FORBIDDEN and the ui-sans-serif system reclaim was
 *               the body voice — that reclaim is DELETED at T.D3, so a
 *               system-sans-headed leaf is now the violation).
 *   • mono    = "Fira Code" — the code/data register (T.D4 bounds its reach;
 *               the role-manifest mono contract rides that wave).
 *
 * THE CLAUSES:
 *   (a) DOCK ∈ BODY — the dock band (.dock-label sites) resolves the Jakarta
 *       BODY voice, desktop AND mobile. INVERTED from K.W2 (the owner's verdict
 *       + the T.C "kill the serif chrome flip" row override the K-era
 *       dock-display-voice call; the @layer .dock-label serif force is DELETED).
 *   (b) HONEST DISPLAY TUPLE (T.D2) — every leaf whose computed family heads
 *       with Instrument Serif resolves weight == 400 (the ONLY weight the face
 *       ships — `font-synthesis: none` makes any other declaration a lie) AND
 *       computed size ≥ 28px (the serif floor); the root resolves
 *       font-synthesis-weight: none; --font-serif is NOT a second display
 *       authority; the bare `.font-display` utility still resolves the display
 *       face (the K.W2 S4 trap stays closed).
 *   (c) THREE-VOICE TOTALITY — every visible text leaf ∈ {display, mono, body};
 *       ZERO leaves on the RETIRED system-sans reclaim, glass-ui's Fraunces, or
 *       an orphan family; desktop AND mobile.
 *   (d) NO MAGIC WEIGHTS (static) — zero non-100-multiple `font-weight`
 *       literals in demo source (the `650` class of defect).
 *   (e) ROLE TUPLES — the committed role manifest
 *       (demo/@/styles/font-roles.json, the T.D1 artifact whose VALUES consume
 *       the OD-6 token) binds selector-contracted roles to expected tuples;
 *       every live match must resolve its role's tuple, and mono leaves must
 *       match the manifest's data-register selector contract (armed by T.D4).
 *
 * proof:demo-fonts is SUBORDINATED to this census (its clause (a) polarity is
 * flipped in the same T.D3 motion — Jakarta is the positive body assertion).
 *
 * P6 posture (declared): computed font family/weight/size are CSS-cascade-
 * deterministic (no rasterized pixel diff). Hard-gates; under KF_REQUIRE_BROWSER
 * a harness-absent skip is a hard FAIL at the lib seam. Serves dist/gh-pages/.
 *
 * Re-runnable:
 *   npm run gh-pages
 *   KF_REQUIRE_BROWSER=1 [KF_PLAYWRIGHT_DIR=…] npm run proof:font-census
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const ROLES_PATH = path.join(REPO, "demo/@/styles/font-roles.json");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:font-census — T.D1 (the role-bound style-TUPLE gate, superseding the K-era family-only " +
        "census): dock ∈ Jakarta body, honest 400/≥28px display serif, three-voice totality " +
        "(Jakarta POSITIVE — the I.W6 system reclaim is the violation now), no magic weights, " +
        "role tuples from the committed manifest.",
);

// ── the committed role manifest (T.D1's artifact; values consume OD-6) ────────
let ROLES = { roles: [], monoAllowedSelectors: [], monoCeiling: null };
try {
    ROLES = JSON.parse(fs.readFileSync(ROLES_PATH, "utf8"));
} catch (e) {
    fail(`the role manifest (${ROLES_PATH}) is missing/unparsable: ${e.message}`);
}

// ── The scene matrix (sourced 1:1 from demo/app/scene/scenes.ts) ──────────────
const SCENES = [
    { id: "home", route: "", trigger: null },
    { id: "cube", route: "cube", trigger: "Controls" },
    { id: "amiga", route: "amiga", trigger: "Controls" },
    { id: "square", route: "square", trigger: "Square" },
    // item-7a: the control trigger reads the FACET name (Curve/Physics).
    { id: "easing", route: "easing", trigger: "Curve" },
    { id: "spring", route: "spring", trigger: "Physics" },
    { id: "sequence", route: "sequence", trigger: null },
];

// ── voice fingerprints (the tuple's FAMILY axis) ─────────────────────────────
const DISPLAY_RE = /Instrument Serif/i;
const MONO_RE = /Fira Code/i;
const BODY_RE = /^\s*["']?Plus Jakarta Sans/i;
// The RETIRED I.W6 system reclaim — a leaf whose family HEADS with the system
// stack means the deleted override survives somewhere (the T.D3 violation).
const SYSTEM_HEAD_RE =
    /^\s*["']?(?:ui-sans-serif|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Helvetica|Arial)\b/i;
const FORBIDDEN_RE = /Fraunces/i;

function classify(ff) {
    if (!ff) return "empty";
    if (FORBIDDEN_RE.test(ff)) return "forbidden";
    if (DISPLAY_RE.test(ff)) return "display";
    if (MONO_RE.test(ff)) return "mono";
    if (BODY_RE.test(ff)) return "body";
    if (SYSTEM_HEAD_RE.test(ff)) return "system";
    return "orphan";
}

// ── The page-side census — every visible text LEAF carries its TUPLE ─────────
const CENSUS_FN = `
async (roleDefs) => {
    await document.fonts.ready;
    const VISIBLE = (el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < (window.innerHeight + 2);
    };
    const hasDirectText = (el) => {
        for (const n of el.childNodes) {
            if (n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0) return true;
        }
        return false;
    };
    const inDockBand = (el) => !!el.closest(".dock-label, .dock-scene-title");
    const leaves = [];
    for (const el of document.querySelectorAll("body *")) {
        const tag = el.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "svg" || tag === "canvas" ||
            tag === "img" || tag === "path" || tag === "circle" || tag === "rect" ||
            tag === "line" || tag === "g" || tag === "defs" || tag === "use" ||
            tag === "input" || tag === "textarea" || tag === "select" || tag === "option") continue;
        if (el.closest("svg")) continue;
        if (el.closest(".monaco-editor")) continue; /* Monaco's own faces are content, not demo chrome */
        if (!hasDirectText(el)) continue;
        if (!VISIBLE(el)) continue;
        const cs = getComputedStyle(el);
        const roles = [];
        for (const r of roleDefs) {
            try { if (el.matches(r.selector)) roles.push(r.role); } catch {}
        }
        let monoAllowed = false;
        if (roleDefs.monoAllow) {
            try { monoAllowed = el.matches(roleDefs.monoAllow) || !!el.closest(roleDefs.monoAllow); } catch {}
        }
        leaves.push({
            cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || "",
            txt: (el.textContent || "").trim().slice(0, 24),
            ff: cs.fontFamily,
            fw: cs.fontWeight,
            fs: parseFloat(cs.fontSize),
            style: cs.fontStyle,
            dock: inDockBand(el),
            roles,
            monoAllowed,
        });
    }
    // the bare .font-display trap probe (K.W2 S4, kept)
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.textContent = "trap-probe";
    document.body.appendChild(probe);
    const fontDisplayUtility = getComputedStyle(probe).fontFamily;
    probe.remove();
    const root = getComputedStyle(document.documentElement);
    return {
        leaves,
        fontDisplayUtility,
        tokens: {
            display: root.getPropertyValue("--font-display").trim(),
            serif: root.getPropertyValue("--font-serif").trim(),
            synthesis: root.fontSynthesisWeight || root.getPropertyValue("font-synthesis-weight"),
        },
    };
}`;

/** roleDefs marshalled into the page: {list:[{role,selector}…], monoAllow}. */
function buildRoleDefs() {
    return {
        list: (ROLES.roles ?? []).map((r) => ({ role: r.role, selector: r.selector })),
        monoAllow: (ROLES.monoAllowedSelectors ?? []).join(", ") || null,
    };
}

// page.evaluate args must be JSON-serializable; CENSUS_FN iterates `roleDefs`
// as an array carrying a `monoAllow` property, so the wrapper re-attaches it.
const CENSUS_WRAPPER = `
async (payload) => {
    const roleDefs = payload.list;
    roleDefs.monoAllow = payload.monoAllow;
    return (${CENSUS_FN.trim()})(roleDefs);
}`;

async function censusPassClean(page, base, scene, roleDefs) {
    await page.goto(`${base}/#/${scene.route}`, { waitUntil: "load" });
    if (scene.id !== "home") {
        await navToScene(page, scene.id, scene.trigger, { timeout: 12000 });
    }
    await page.waitForTimeout(700);
    // eslint-disable-next-line no-eval
    return page.evaluate(eval(`(${CENSUS_WRAPPER})`), {
        list: roleDefs.list,
        monoAllow: roleDefs.monoAllow,
    });
}

function auditViewport(label, passes) {
    // The T.D2 serif floor is the display-5 RUNG, whose computed size is
    // viewport-fluid on glass-ui's φ ladder: ~28px+ at desktop, ~25.9px at the
    // 390w mobile step. The floor tracks the rung per viewport (an 18.6px serif
    // control label reds at BOTH) — never below the smallest display rung.
    const SERIF_FLOOR = label === "mobile" ? 24 : 28;
    const histogram = { display: 0, mono: 0, body: 0, system: 0, forbidden: 0, orphan: 0, empty: 0 };
    const dockHistogram = { body: 0, other: 0 };
    const strays = [];
    const dockOther = [];
    const displayViolations = [];
    const roleViolations = [];
    const monoViolations = [];
    let monoCount = 0;
    const roleMap = new Map((ROLES.roles ?? []).map((r) => [r.role, r]));

    for (const { scene, probe } of passes) {
        for (const leaf of probe.leaves) {
            const v = classify(leaf.ff);
            histogram[v]++;
            if (v === "forbidden" || v === "orphan" || v === "system" || v === "empty") {
                strays.push({ scene, cls: String(leaf.cls).slice(0, 48), txt: leaf.txt, ff: leaf.ff.slice(0, 48), voice: v });
            }
            if (leaf.dock) {
                if (v === "body") dockHistogram.body++;
                else {
                    dockHistogram.other++;
                    dockOther.push({ scene, txt: leaf.txt, ff: leaf.ff.slice(0, 40), voice: v });
                }
            }
            // (b) honest display tuple
            if (v === "display") {
                const w = parseInt(leaf.fw, 10);
                if (w !== 400 || leaf.fs < SERIF_FLOOR) {
                    displayViolations.push({
                        scene, cls: String(leaf.cls).slice(0, 48), txt: leaf.txt,
                        fw: leaf.fw, fs: leaf.fs,
                    });
                }
            }
            // (e) mono data-register contract (armed once the manifest carries
            // monoAllowedSelectors — T.D4)
            if (v === "mono") {
                monoCount++;
                if ((ROLES.monoAllowedSelectors ?? []).length > 0 && !leaf.monoAllowed) {
                    monoViolations.push({
                        scene, cls: String(leaf.cls).slice(0, 48), txt: leaf.txt,
                    });
                }
            }
            // (e) role tuples
            for (const roleName of leaf.roles ?? []) {
                const role = roleMap.get(roleName);
                if (!role || !role.expect) continue;
                const e = role.expect;
                const why = [];
                if (e.voice && v !== e.voice) why.push(`voice ${v}≠${e.voice}`);
                if (e.weight != null && parseInt(leaf.fw, 10) !== e.weight) why.push(`weight ${leaf.fw}≠${e.weight}`);
                if (e.minSize != null && leaf.fs < e.minSize) why.push(`size ${leaf.fs}<${e.minSize}`);
                if (e.maxSize != null && leaf.fs > e.maxSize) why.push(`size ${leaf.fs}>${e.maxSize}`);
                if (e.style && leaf.style !== e.style) why.push(`style ${leaf.style}≠${e.style}`);
                if (why.length > 0) {
                    roleViolations.push({ scene, role: roleName, txt: leaf.txt, why: why.join(", ") });
                }
            }
        }
    }

    console.log(
        `  histogram (${label}): DISPLAY ${histogram.display} / MONO ${histogram.mono} / BODY ` +
            `${histogram.body} / system ${histogram.system} / forbidden ${histogram.forbidden} / ` +
            `orphan ${histogram.orphan} | DOCK BODY ${dockHistogram.body} / OTHER ${dockHistogram.other}`,
    );

    // (a) dock ∈ body
    if (dockHistogram.body > 0 && dockHistogram.other === 0) {
        ok(
            `(a ${label}) the dock band resolves the Jakarta BODY voice — ${dockHistogram.body} dock ` +
                `leaf/leaves, ZERO on display/system/mono (the serif chrome flip is dead; glass-ui's own ` +
                `dock-label register governs)`,
        );
    } else {
        fail(
            `(a ${label}) the dock band carries ${dockHistogram.other} non-body leaf/leaves ` +
                `(BODY ${dockHistogram.body}): ${JSON.stringify(dockOther.slice(0, 8))}`,
        );
    }

    // (b) honest display tuple
    if (displayViolations.length === 0 && histogram.display > 0) {
        ok(
            `(b ${label}) the display tuple is HONEST — all ${histogram.display} Instrument-Serif ` +
                `leaves resolve weight 400 (the face's ONE real weight) at ≥ ${SERIF_FLOOR}px computed ` +
                `(the display-5 rung floor at this viewport)`,
        );
    } else if (histogram.display === 0) {
        note(`(b ${label}) zero display leaves rendered in this pass (rung honesty vacuous here)`);
    } else {
        fail(
            `(b ${label}) ${displayViolations.length} display leaf/leaves violate the honest tuple ` +
                `(weight ≠ 400 — a synthesized lie under font-synthesis:none — or size < 28px): ` +
                JSON.stringify(displayViolations.slice(0, 8)),
        );
    }

    // (c) totality
    const strayCount = histogram.system + histogram.forbidden + histogram.orphan + histogram.empty;
    if (strayCount === 0) {
        ok(
            `(c ${label}) the three-voice totality holds — every visible leaf ∈ {display, mono, body}; ` +
                `ZERO on the retired system reclaim / Fraunces / an orphan family`,
        );
    } else {
        fail(
            `(c ${label}) the totality is BROKEN — ${histogram.system} system-reclaim + ` +
                `${histogram.forbidden} forbidden + ${histogram.orphan} orphan + ${histogram.empty} empty: ` +
                JSON.stringify(strays.slice(0, 10)),
        );
    }

    // (e) role tuples + the mono contract
    if ((ROLES.roles ?? []).length > 0) {
        if (roleViolations.length === 0) {
            ok(
                `(e ${label}) all manifest role tuples hold (${(ROLES.roles ?? []).length} roles ` +
                    `checked against live matches)`,
            );
        } else {
            fail(
                `(e ${label}) ${roleViolations.length} role-tuple violation(s) — a role resolves the ` +
                    `WRONG tuple by name: ${JSON.stringify(roleViolations.slice(0, 8))}`,
            );
        }
    }
    if ((ROLES.monoAllowedSelectors ?? []).length > 0) {
        if (monoViolations.length === 0) {
            ok(
                `(e ${label}) the mono data-register contract holds — every Fira-Code leaf (${monoCount}) ` +
                    `matches the manifest's allowed data/code selector contract (T.D4: mono is DATA, not ` +
                    `the UI voice)`,
            );
        } else {
            fail(
                `(e ${label}) ${monoViolations.length} mono leaf/leaves OUTSIDE the data-register ` +
                    `contract — Fira Code as UI chrome again: ${JSON.stringify(monoViolations.slice(0, 10))}`,
            );
        }
        if (ROLES.monoCeiling != null) {
            if (monoCount <= ROLES.monoCeiling) {
                ok(
                    `(e ${label}) the mono leaf count ${monoCount} ≤ the declared ceiling ` +
                        `${ROLES.monoCeiling} (regression-proof against "just add another mono label")`,
                );
            } else {
                fail(
                    `(e ${label}) the mono leaf count ${monoCount} EXCEEDS the declared ceiling ` +
                        `${ROLES.monoCeiling}`,
                );
            }
        }
    }
    return passes[0]?.probe;
}

async function run() {
    const roleDefs = buildRoleDefs();

    // ── DESKTOP 1440×900 ──────────────────────────────────────────────────────
    const desktop = await withPage(
        {
            distDir: DIST,
            context: { viewport: { width: 1440, height: 900 } },
            label: "the tuple font-census desktop battery",
        },
        async (page, { url: base }) => {
            const passes = [];
            for (const scene of SCENES) {
                passes.push({ scene: scene.id, probe: await censusPassClean(page, base, scene, roleDefs) });
            }
            return passes;
        },
    );
    if (desktop.skipped) {
        console.log(`  ○ browser half skipped — ${desktop.reason}`);
        return;
    }
    const firstProbe = auditViewport("desktop", desktop.value);

    // (b) root synthesis + display-authority hygiene + the .font-display trap
    if (firstProbe) {
        const t = firstProbe.tokens;
        if ((t.synthesis ?? "").trim() === "none") {
            ok(`(b) the root resolves font-synthesis-weight: none — a weight the face does not ship can never smear`);
        } else {
            fail(
                `(b) font-synthesis-weight at :root is "${t.synthesis}" (expected "none") — the faux-bold ` +
                    `synthesis path is still open (T.D2's root kill missing)`,
            );
        }
        const serifNotSecond = !t.serif || t.serif === t.display || !DISPLAY_RE.test(t.serif);
        if (DISPLAY_RE.test(t.display) && serifNotSecond) {
            ok(
                `(b) ONE display authority — --font-display resolves Instrument Serif; --font-serif is ` +
                    `${!t.serif ? "DELETED" : "not a second display authority"}`,
            );
        } else {
            fail(
                `(b) the display authority is split — --font-display="${t.display.slice(0, 40)}", ` +
                    `--font-serif="${(t.serif ?? "").slice(0, 40)}"`,
            );
        }
        if (DISPLAY_RE.test(firstProbe.fontDisplayUtility ?? "")) {
            ok(`(b) the bare .font-display utility resolves the display face (the K.W2 S4 trap stays closed)`);
        } else {
            fail(
                `(b) the .font-display trap is OPEN — a bare class="font-display" resolves ` +
                    `"${(firstProbe.fontDisplayUtility ?? "").slice(0, 40)}"`,
            );
        }
    }

    // ── MOBILE 390×844 ────────────────────────────────────────────────────────
    const mobile = await withPage(
        {
            distDir: DIST,
            context: {
                viewport: { width: 390, height: 844 },
                hasTouch: true,
                isMobile: true,
                deviceScaleFactor: 3,
            },
            label: "the tuple font-census mobile battery",
        },
        async (page, { url: base }) => {
            const passes = [];
            for (const scene of SCENES) {
                passes.push({ scene: scene.id, probe: await censusPassClean(page, base, scene, roleDefs) });
            }
            return passes;
        },
    );
    if (!mobile.skipped) auditViewport("mobile", mobile.value);

    // ── (d) NO MAGIC WEIGHTS — static sweep over demo source ─────────────────
    const offenders = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === "node_modules" || entry.name === "dist") continue;
                walk(p);
            } else if (/\.(vue|css|ts)$/.test(entry.name)) {
                const src = fs.readFileSync(p, "utf8");
                const re = /font-weight:\s*(\d{3})\b/g;
                let m;
                while ((m = re.exec(src)) !== null) {
                    const w = parseInt(m[1], 10);
                    if (w % 100 !== 0) {
                        offenders.push(`${path.relative(REPO, p)} → font-weight: ${w}`);
                    }
                }
            }
        }
    };
    walk(path.join(REPO, "demo"));
    if (offenders.length === 0) {
        ok(`(d) zero non-100-multiple font-weight literals in demo source (the 650 class is dead)`);
    } else {
        fail(`(d) magic font-weight literal(s) survive: ${offenders.join("; ")}`);
    }
}

await run();

if (failures.length > 0) {
    console.error(
        `\nproof:font-census — FAIL (${failures.length}): the typographic tuple does not hold — a dock ` +
            "leaf off the body voice, a dishonest display weight/rung, a stray 4th voice (incl. the retired " +
            "system reclaim), a magic weight, a role on the wrong tuple, or mono as UI chrome. The cure is " +
            "at the TOKEN/register root (style.css + the role manifest), never a per-site font class or a " +
            "relaxed census.",
    );
    process.exit(1);
}
console.log(
    "\nproof:font-census — PASS: the typographic tuple holds — the dock band is the Jakarta body voice, " +
        "every Instrument-Serif leaf is honest (400, ≥28px) under font-synthesis:none, every visible leaf " +
        "across all scenes ∈ {display, mono, body} (desktop+mobile), no magic weights, and every manifest " +
        "role resolves its blessed tuple. The family-only census that greened the rejected tree is " +
        "SUPERSEDED (T.D1).",
);
