#!/usr/bin/env node
/**
 * proof:font-census — Tranche K.W2 §Hard gate (THE TYPOGRAPHIC ROOT).
 *
 * THE PRECEPT (the gate-ORACLE extension): a computed-font CENSUS over the BUILT
 * dist — `getComputedStyle(el).fontFamily` for every visible text leaf, through the
 * same surface the human reads, across all 9 scenes + docks + panes, desktop AND
 * mobile — asserting the design's font PROPERTY by construction, not a proxy.
 *
 * The pre-existing `proof:demo-fonts` is a NEGATIVE-only oracle (no "Plus Jakarta")
 * that GREENS on today's SPLIT-VOICE dock — it never asserts the dock `.dock-label`
 * carries the DISPLAY voice (`gate-estate-k.md §6`). This gate adds the POSITIVE
 * clauses that make the dock voice and the global three-voice totality FALSIFIABLE.
 *
 * THE THREE VOICES (the design's font property — exactly three, by construction):
 *   • display = "Instrument Serif" (the φ-ladder text-display-*, the dock band,
 *               scene-name identity, the hero)
 *   • mono    = "Fira Code" (the data/code register)
 *   • body    = the reclaimed native UI sans (ui-sans-serif/system-ui/…) — NOT
 *               glass-ui's brand "Plus Jakarta Sans"
 *
 * THE CLAUSES (K.W2.md §Hard gate (a)–(e)):
 *   (a) CORRECTNESS — the dock band resolves the DISPLAY voice. Every dock-label
 *       site (the ChromeDock controls-tab + scene-select triggers/groups + the
 *       TransportDock transport labels) and `.dock-scene-title` resolve a
 *       fontFamily.includes("Instrument Serif"), desktop AND mobile. BORN-RED on
 *       today's tree: the bottom dock labels census native SANS (the histogram
 *       DOCK DISPLAY 31 / SANS 21). Greens on S2 (the @layer .dock-label rule).
 *   (b) CORRECTNESS — ONE display authority. getComputedStyle(documentElement)
 *       resolves --font-display; the 2 former --font-serif consumer sites
 *       (.btn-playback, .tab-trigger-base) census the SAME display family the dock
 *       does (Instrument Serif). BORN-RED: today they reach display via the OTHER
 *       alias (--font-serif) — a --font-display-only dock edit would split them
 *       silently. Greens on S1 (the single display token).
 *   (c) CORRECTNESS — the THREE-voice totality. Every visible text leaf across all
 *       9 scenes + docks + panes (desktop 1440×900 + mobile 390×844) resolves
 *       exactly ONE of {display, mono, body}; ZERO leaves on "Plus Jakarta",
 *       glass-ui's Fraunces default, or any orphan family; AND the dock band ∈
 *       display. BORN-RED: the dock band carries SANS today (a body voice where the
 *       design intends display). Greens when S1–S4 make every leaf resolve one of
 *       the three and the dock resolves display.
 *   (d) HYGIENE — the `.font-display` trap is closed. A bare `.font-display`
 *       element resolves the display face (--font-stack-display now aliases
 *       --font-display per S4), NOT native sans. BORN-RED on the pre-S4 tree (the
 *       utility resolves --font-stack-display = native sans, opposite its name).
 *   (e) HYGIENE — the comment matches the build. The style.css @theme font comment,
 *       after S4, states the TRUE build (only text-display-* + the dock-label rule
 *       resolve display; the rest bind --font-text; no "Fraunces"). A comment is
 *       not runtime-falsifiable; verified by reading the repaired comment (NOT here).
 *       Recorded so a future reader is not re-masked (`gate-estate-k.md §6`).
 *
 * TWO-TIER TAXONOMY: clauses (a)–(c) are the CORRECTNESS oracle; clause (d) is a
 * HYGIENE corroborator that may NEVER substitute for a red correctness clause.
 * Clause (e) is doc-hygiene (no runtime) — verified by reading the repaired comment.
 *
 * P6 posture (declared): the computed font FAMILY of a DOM element is
 * DEVICE-INDEPENDENT (CSS-cascade-deterministic, not a rasterized pixel diff — the
 * same `.dock-label{font-family:var(--font-display)}` resolves identically on macOS
 * and the Linux runner; the metric-matched "Instrument Serif Fallback" is a CLS
 * device-dependence handled by the font-LOAD wait, NOT this clause). Clauses (a)–(d)
 * HARD-gate. Under KF_REQUIRE_BROWSER a harness-absent skip is a hard FAIL at the
 * lib seam. Serves dist/gh-pages/. Harness: scripts/lib/demo-driver.mjs (withPage =
 * serveDist + resolveChromium + context/teardown; navToScene per-expected-state).
 *
 * Re-runnable:
 *   npm run gh-pages
 *   KF_REQUIRE_BROWSER=1 [KF_PLAYWRIGHT_DIR=…] npm run proof:font-census
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, openControlsPanel, withPage } from "./lib/demo-driver.mjs";

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
    "proof:font-census — K.W2 §Hard gate: the computed-font CENSUS over the BUILT dist " +
        "(every visible text leaf, all 9 scenes + docks + panes, desktop+mobile) — the dock band ∈ display, " +
        "ONE display authority, the three-voice totality. Born-RED on today's split-voice dock.",
);

// ── The 8-scene matrix (id → control-tab trigger for navToScene's per-EXPECTED-
//    state settle; null when the scene has no control panel). The home landing is
//    route "". Sourced 1:1 from demo/app/scene/scenes.ts + the live-gate navToScene set. ──
const SCENES = [
    { id: "home", route: "", trigger: null },
    { id: "cube", route: "cube", trigger: "Controls" },
    { id: "amiga", route: "amiga", trigger: "Controls" },
    { id: "square", route: "square", trigger: "Square" },
    { id: "easing", route: "easing", trigger: "Easing" },
    { id: "spring", route: "spring", trigger: "Spring" },
    { id: "sequence", route: "sequence", trigger: null },
    { id: "motion-path", route: "motion-path", trigger: null },
];

// ── The three voice fingerprints (the design's font PROPERTY) ────────────────────
// A computed fontFamily is classified by which face heads its resolution. The body
// voice is the reclaimed native UI sans; the canonical heads are exhaustive for the
// demo's surface. "Plus Jakarta" / "Fraunces" are the FORBIDDEN glass-ui-default /
// orphan families (NOT in any voice) — a leaf resolving them reds clause (c).
const DISPLAY_RE = /Instrument Serif/i;
const MONO_RE = /Fira Code/i;
// The native sans heads the demo reclaims --font-stack-text to (style.css :root).
// A leaf is "body" when its computed family heads with one of these system sans
// faces (the browser drops the unresolved web-font names and reports the first
// AVAILABLE family; on the Linux runner the head is typically a system sans).
const BODY_RE =
    /^\s*["']?(?:ui-sans-serif|system-ui|-apple-system|BlinkMacSystemFont|"?Segoe UI"?|Segoe UI|Roboto|Helvetica|Arial|sans-serif|"?Liberation Sans"?|DejaVu Sans|"?Noto Sans"?|Cantarell|Ubuntu|Tahoma|Verdana)\b/i;
// The FORBIDDEN families — glass-ui's brand default + its math/serif fallback names.
// A visible leaf resolving any of these is a stray voice (clause (c) reds). Fira
// Code's own mono fallbacks and Instrument Serif's "… Fallback" are NOT forbidden.
const FORBIDDEN_RE = /Plus Jakarta|Fraunces/i;

/** Classify a computed fontFamily string into one of the three voices, "forbidden",
 *  or "orphan" (none of the above — a 4th family). */
function classify(ff) {
    if (!ff) return "empty";
    if (FORBIDDEN_RE.test(ff)) return "forbidden";
    if (DISPLAY_RE.test(ff)) return "display";
    if (MONO_RE.test(ff)) return "mono";
    if (BODY_RE.test(ff)) return "body";
    return "orphan";
}

// ── The page-side census: classify every visible text LEAF + tag the dock band ───
// Injected into page.evaluate. A "text leaf" is an element with a non-empty,
// non-whitespace direct text node and NO element children that themselves carry
// visible text (so a wrapping <div> is not double-counted with its <span>). The
// dock band is `.dock-label` ∪ `.dock-scene-title` (the family-bind sites S2 flips).
const CENSUS_FN = `
async () => {
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
        // skip non-rendering / replaced / svg-internal containers
        const tag = el.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "svg" || tag === "canvas" ||
            tag === "img" || tag === "path" || tag === "circle" || tag === "rect" ||
            tag === "line" || tag === "g" || tag === "defs" || tag === "use" ||
            tag === "input" || tag === "textarea" || tag === "select" || tag === "option") continue;
        if (el.closest("svg")) continue; // SVG <text> renders in user space, not a typographic rung
        if (!hasDirectText(el)) continue;
        if (!VISIBLE(el)) continue;
        const ff = getComputedStyle(el).fontFamily;
        leaves.push({
            cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || "",
            txt: (el.textContent || "").trim().slice(0, 24),
            ff,
            dock: inDockBand(el),
        });
    }
    // The bare .font-display trap probe (clause d): inject a span carrying ONLY the
    // utility class, read its resolved family, remove it. native sans = trap OPEN.
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.textContent = "trap-probe";
    document.body.appendChild(probe);
    const fontDisplayUtility = getComputedStyle(probe).fontFamily;
    probe.remove();
    const root = getComputedStyle(document.documentElement);
    return {
        leaves,
        tokens: {
            display: root.getPropertyValue("--font-display").trim(),
            serif: root.getPropertyValue("--font-serif").trim(),
            stackDisplay: root.getPropertyValue("--font-stack-display").trim(),
            text: root.getPropertyValue("--font-text").trim(),
            mono: root.getPropertyValue("--font-mono").trim(),
        },
        fontDisplayUtility,
    };
}`;

/** Drive one (scene × viewport) census pass; returns the page probe result. */
async function censusPass(page, base, scene) {
    await page.goto(`${base}/#/${scene.route}`, { waitUntil: "load" });
    if (scene.id !== "home") {
        await navToScene(page, scene.id, scene.trigger, { timeout: 12000 });
    }
    await page.waitForTimeout(700);
    // eslint-disable-next-line no-eval
    return page.evaluate(eval(`(${CENSUS_FN})`));
}

async function runCensus() {
    // ── DESKTOP 1440×900 ──────────────────────────────────────────────────────
    const desktop = await withPage(
        {
            distDir: DIST,
            context: { viewport: { width: 1440, height: 900 } },
            label: "the font-census desktop battery (clauses a/b/c/d)",
        },
        async (page, { url: base }) => {
            const histogram = { display: 0, mono: 0, body: 0, forbidden: 0, orphan: 0, empty: 0 };
            const dockHistogram = { display: 0, sans: 0 };
            const strays = [];
            const dockSans = [];
            let tokens = null;
            let fontDisplayUtility = null;
            // Also gather the two former --font-serif consumer sites' computed family
            // (clause b) — censused on the cube scene with controls open.
            for (const scene of SCENES) {
                const probe = await censusPass(page, base, scene);
                if (!tokens) tokens = probe.tokens;
                fontDisplayUtility = probe.fontDisplayUtility;
                for (const leaf of probe.leaves) {
                    const v = classify(leaf.ff);
                    histogram[v]++;
                    if (v === "forbidden" || v === "orphan") {
                        strays.push({ scene: scene.id, ...leaf, voice: v });
                    }
                    if (leaf.dock) {
                        if (v === "display") dockHistogram.display++;
                        else {
                            dockHistogram.sans++;
                            dockSans.push({ scene: scene.id, txt: leaf.txt, ff: leaf.ff.slice(0, 40), voice: v });
                        }
                    }
                }
            }

            // (b) — the 2 former --font-serif consumer sites resolve the SAME display
            //       authority the dock does. Drive cube → OPEN the controls pane so
            //       BOTH the PlaybackRibbon .btn-playback AND the AnimationControls
            //       .tab-trigger-base materialise (they live INSIDE the pane), then
            //       read their computed family.
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await navToScene(page, "cube", "Controls", { timeout: 12000 });
            await openControlsPanel(page);
            await page.waitForTimeout(600);
            const consumers = await page.evaluate(async () => {
                await document.fonts.ready;
                const ff = (sel) => {
                    const el = document.querySelector(sel);
                    return el ? getComputedStyle(el).fontFamily : null;
                };
                const root = getComputedStyle(document.documentElement);
                return {
                    playback: ff(".btn-playback"),
                    tab: ff(".tab-trigger-base"),
                    display: root.getPropertyValue("--font-display").trim(),
                    serif: root.getPropertyValue("--font-serif").trim(),
                };
            });

            return { histogram, dockHistogram, strays, dockSans, tokens, fontDisplayUtility, consumers };
        },
    );

    if (desktop.skipped) {
        console.log(`  ○ browser half skipped — ${desktop.reason}`);
        return false;
    }
    const d = desktop.value;

    console.log(
        `  histogram (desktop, 9 scenes): DISPLAY ${d.histogram.display} / MONO ${d.histogram.mono} / ` +
            `BODY ${d.histogram.body} / forbidden ${d.histogram.forbidden} / orphan ${d.histogram.orphan} ` +
            `| DOCK DISPLAY ${d.dockHistogram.display} / SANS ${d.dockHistogram.sans}`,
    );

    // ── (a) — the dock band resolves the DISPLAY voice (desktop) ────────────────
    if (d.dockHistogram.display > 0 && d.dockHistogram.sans === 0) {
        ok(
            `(a desktop) the dock band resolves the DISPLAY voice — ${d.dockHistogram.display} dock-label ∪ ` +
                `.dock-scene-title leaf(s) all .includes("Instrument Serif"), ZERO on native sans ` +
                `(the U-K6/U-K8 split→display cured at the .dock-label family bind)`,
        );
    } else {
        fail(
            `(a desktop) the dock band carries ${d.dockHistogram.sans} SANS leaf/leaves (DOCK DISPLAY ` +
                `${d.dockHistogram.display} / SANS ${d.dockHistogram.sans}) — the bottom dock labels census native sans ` +
                `where the design intends display (the split-voice dock). SANS leaves: ` +
                JSON.stringify(d.dockSans.slice(0, 8)),
        );
    }

    // ── (b) — ONE display authority; the consumer sites resolve the SAME family
    //          the DOCK does. The born-RED signal is NOT "are they serif?" (today
    //          both reach display via the OTHER alias --font-serif, so both ARE
    //          serif) — it is "do they resolve the SAME authority the DOCK band
    //          resolves?" Today the dock band is native SANS (clause a reds), so the
    //          serif consumer sites resolve a DIFFERENT family than the dock → the
    //          split. After S1+S2 the dock resolves display AND the consumer sites
    //          resolve that SAME display family, single-sourced from --font-display.
    const displayTokenResolves = DISPLAY_RE.test(d.consumers.display);
    // .btn-playback is the LIVE consumer site (it renders in the open controls
    // pane). .tab-trigger-base has NO live instance in the multi-scene app shell —
    // its tabs are dock-MANAGED (the U-K12 tabs→dock-dropdown shape), so the in-pane
    // TabsList is `v-if="!tabsExternallyManaged"` and never mounts here. It is
    // censused ONLY IF present (absence cannot split a non-rendered site; its SOURCE
    // var(--font-serif)→var(--font-display) repoint is the S1 net-deletion edit). So
    // the live oracle is: .btn-playback resolves the SAME display family the DOCK
    // does, AND (if .tab-trigger-base renders) it does too.
    const playbackDisplay = DISPLAY_RE.test(d.consumers.playback ?? "");
    const tabPresent = d.consumers.tab != null && d.consumers.tab !== "";
    const tabDisplay = !tabPresent || DISPLAY_RE.test(d.consumers.tab ?? "");
    // The dock band's resolved family — it must be display (clause a) for the
    // consumer sites to be "the SAME authority the dock does". When clause (a)
    // reds (today: dock = sans), the serif .btn-playback differs from the sans
    // dock, so this AND-term is FALSE → (b) reds (the silent split exposed).
    const dockIsDisplay = d.dockHistogram.display > 0 && d.dockHistogram.sans === 0;
    // The single-display-authority property: there is NO second token that carries
    // the DISPLAY face a consumer could silently split onto. Two satisfying shapes:
    //   • DELETION route (taken here): --font-serif reverts to glass-ui's OWN default
    //     (--font-serif: var(--font-stack-text) = the body register, native sans) —
    //     it is NO LONGER a display authority, and ZERO demo consumers read it. So
    //     --font-serif resolving to a NON-display family is the proof the redundant
    //     SECOND DISPLAY token is gone.
    //   • ALIAS route: --font-serif: var(--font-display) — it resolves the SAME
    //     display face, a provable alias of the ONE authority (not a parallel one).
    // Either way --font-serif is NOT an independent display authority. The split
    // hazard is dead iff --font-serif is empty OR resolves the same display face OR
    // resolves a non-display family.
    const serifNotASecondDisplay =
        !d.consumers.serif ||
        d.consumers.serif === d.consumers.display ||
        !DISPLAY_RE.test(d.consumers.serif);
    const serifAliasedOrGone = serifNotASecondDisplay;
    if (
        displayTokenResolves &&
        playbackDisplay &&
        tabDisplay &&
        dockIsDisplay &&
        serifAliasedOrGone
    ) {
        const serifState = !d.consumers.serif
            ? "DELETED"
            : d.consumers.serif === d.consumers.display
              ? "a pure alias of --font-display"
              : "reverted to glass-ui's NON-display body default (no demo consumer reads it)";
        ok(
            `(b desktop) ONE display authority — documentElement resolves --font-display ` +
                `(${d.consumers.display.slice(0, 32)}…); the dock band AND the live .btn-playback consumer ` +
                `ALL census the SAME Instrument-Serif display family${tabPresent ? " (.tab-trigger-base too)" : " (.tab-trigger-base has no live instance — dock-managed)"}; ` +
                `the former second display token --font-serif is ${serifState} — no parallel display authority`,
        );
    } else {
        fail(
            `(b desktop) the display authority is NOT single-sourced — ` +
                `--font-display resolves=${displayTokenResolves}, .btn-playback display=${playbackDisplay} ` +
                `(${(d.consumers.playback ?? "").slice(0, 32)}), .tab-trigger-base present=${tabPresent}/display=${tabDisplay} ` +
                `(${(d.consumers.tab ?? "").slice(0, 32)}), dockIsDisplay=${dockIsDisplay}, ` +
                `--font-serif aliased-or-gone=${serifAliasedOrGone} (serif="${d.consumers.serif}") — ` +
                `the live consumer site resolves a DIFFERENT family than the dock (the silent-split the audit names)`,
        );
    }

    // ── (c desktop) — the three-voice totality (no stray, dock ∈ display) ───────
    const strayCount = d.histogram.forbidden + d.histogram.orphan + d.histogram.empty;
    if (strayCount === 0 && d.dockHistogram.sans === 0) {
        ok(
            `(c desktop) the three-voice totality holds — every visible text leaf ∈ {display, mono, body} ` +
                `(DISPLAY ${d.histogram.display} / MONO ${d.histogram.mono} / BODY ${d.histogram.body}); ZERO leaves ` +
                `on Plus Jakarta / Fraunces / an orphan family; the dock band ∈ display`,
        );
    } else {
        fail(
            `(c desktop) the three-voice totality is BROKEN — ${d.histogram.forbidden} forbidden ` +
                `(Plus Jakarta/Fraunces) + ${d.histogram.orphan} orphan + ${d.histogram.empty} empty stray leaf/leaves, ` +
                `and ${d.dockHistogram.sans} dock leaf/leaves on a body voice. Strays: ` +
                JSON.stringify(d.strays.slice(0, 8)),
        );
    }

    // ── (d) — the .font-display trap is closed (HYGIENE) ────────────────────────
    if (DISPLAY_RE.test(d.fontDisplayUtility ?? "")) {
        ok(
            `(d) the .font-display trap is CLOSED — a bare class="font-display" resolves the display face ` +
                `(${(d.fontDisplayUtility ?? "").slice(0, 32)}…), NOT native sans (--font-stack-display now aliases ` +
                `--font-display per S4; the latent name-vs-resolution inversion is foreclosed)`,
        );
    } else {
        fail(
            `(d) the .font-display trap is OPEN — a bare class="font-display" resolves ` +
                `"${(d.fontDisplayUtility ?? "").slice(0, 40)}" (native sans, the OPPOSITE of its name) — ` +
                `--font-stack-display still bridges to --font-stack-text. Set --font-stack-display: var(--font-display) (S4).`,
        );
    }

    // ── (a/c MOBILE 390×844) — a SEPARATE mobile context ────────────────────────
    const mobile = await withPage(
        {
            distDir: DIST,
            context: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 },
            label: "the font-census mobile battery (clauses a/c)",
        },
        async (page, { url: base }) => {
            const histogram = { display: 0, mono: 0, body: 0, forbidden: 0, orphan: 0, empty: 0 };
            const dockHistogram = { display: 0, sans: 0 };
            const strays = [];
            const dockSans = [];
            for (const scene of SCENES) {
                const probe = await censusPass(page, base, scene);
                for (const leaf of probe.leaves) {
                    const v = classify(leaf.ff);
                    histogram[v]++;
                    if (v === "forbidden" || v === "orphan") strays.push({ scene: scene.id, ...leaf, voice: v });
                    if (leaf.dock) {
                        if (v === "display") dockHistogram.display++;
                        else {
                            dockHistogram.sans++;
                            dockSans.push({ scene: scene.id, txt: leaf.txt, ff: leaf.ff.slice(0, 40), voice: v });
                        }
                    }
                }
            }
            return { histogram, dockHistogram, strays, dockSans };
        },
    );
    if (!mobile.skipped) {
        const m = mobile.value;
        console.log(
            `  histogram (mobile, 9 scenes): DISPLAY ${m.histogram.display} / MONO ${m.histogram.mono} / ` +
                `BODY ${m.histogram.body} / forbidden ${m.histogram.forbidden} / orphan ${m.histogram.orphan} ` +
                `| DOCK DISPLAY ${m.dockHistogram.display} / SANS ${m.dockHistogram.sans}`,
        );
        if (m.dockHistogram.display > 0 && m.dockHistogram.sans === 0) {
            ok(
                `(a mobile) the dock band resolves the DISPLAY voice at 390×844 — ${m.dockHistogram.display} ` +
                    `dock leaf/leaves all Instrument Serif, ZERO sans`,
            );
        } else {
            fail(
                `(a mobile) the dock band carries ${m.dockHistogram.sans} SANS leaf/leaves at 390×844 ` +
                    `(DOCK DISPLAY ${m.dockHistogram.display} / SANS ${m.dockHistogram.sans}). SANS: ` +
                    JSON.stringify(m.dockSans.slice(0, 8)),
            );
        }
        const mStray = m.histogram.forbidden + m.histogram.orphan + m.histogram.empty;
        if (mStray === 0 && m.dockHistogram.sans === 0) {
            ok(
                `(c mobile) the three-voice totality holds at 390×844 — DISPLAY ${m.histogram.display} / ` +
                    `MONO ${m.histogram.mono} / BODY ${m.histogram.body}; ZERO stray; dock ∈ display`,
            );
        } else {
            fail(
                `(c mobile) the totality is BROKEN at 390×844 — ${m.histogram.forbidden} forbidden + ` +
                    `${m.histogram.orphan} orphan + ${m.histogram.empty} empty, ${m.dockHistogram.sans} sans dock. Strays: ` +
                    JSON.stringify(m.strays.slice(0, 8)),
            );
        }
    }

    note(
        "(e) — the style.css @theme font comment matches the build (only text-display-* + the dock-label " +
            "rule resolve display; the rest bind --font-text; no \"Fraunces\") is a DOC-hygiene corroborator, " +
            "verified by reading the repaired comment against the §State facts (not runtime-falsifiable).",
    );
    return true;
}

await runCensus();

if (failures.length > 0) {
    console.error(
        `\nproof:font-census — FAIL (${failures.length}): the typographic root is not TRUE — ` +
            "the dock band carries a body voice where the design intends display, OR the display authority is " +
            "split, OR a stray (4th) voice survives. The cure is at the TOKEN root (the single --font-display + the " +
            "ONE @layer .dock-label rule), NEVER a per-site font class or a relaxed census.",
    );
    process.exit(1);
}
console.log(
    "\nproof:font-census — PASS: the typographic root is TRUE — the dock band resolves the Instrument-Serif " +
        "DISPLAY voice (desktop+mobile), the display voice is single-sourced (--font-display; the .btn-playback / " +
        ".tab-trigger consumer sites resolve the SAME authority the dock does), every visible text leaf across all " +
        "9 scenes + docks + panes ∈ {display, mono, body} with ZERO Plus-Jakarta/Fraunces/orphan stray, and the " +
        ".font-display trap is closed. The U-K6/U-K8/U-K10 typography chronic exits via the born-RED census (P-inv-28).",
);
