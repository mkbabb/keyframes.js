#!/usr/bin/env node
/**
 * proof:specular-handoff — H.W2 S5 · the glass-ui-owned specular HANDOFFs
 * (BORN-RED, chronic-closure-paired). inv-16: NO glass-ui patch is authored in kf
 * here — this gate WITNESSES the two absent glass-ui asks; it does not fill them.
 *
 * THE TWO HANDOFF ASKS (each glass-ui-owned — the Card surface map + the dock are
 * glass-ui's, the dock is in glass-ui's active AW tranche):
 *
 *   (i) the Card specular SEAM — glass-ui's `<Card surface="glass">` bolts
 *       `glass-specular-track` (`CardFooter:37` — `t.surface === "glass" &&
 *       "glass-specular-track"`) with NO pointer wire. It should either WIRE
 *       `--mouse-*` itself (as `dock.js` does) OR OMIT the track until a consumer
 *       opts in. PLUS a CALMER DEFAULT: the live `::before` rests at
 *       `--specular-intensity: 0.35`, hits 0.6 on hover, and the radial reaches
 *       `transparent 55%` (a wide, hot, screen-blended white core) — too hot for a
 *       resting default. The ask: rest ≤ 0.25, hover ≤ 0.4, radius ≤ 40%. kf PROVES
 *       the calm tune is consumer-achievable TODAY (the demo's `.cartoon-specular`
 *       recipe projects 0.22 rest / 0.4 hover onto the pseudo), but the DEFAULT is
 *       glass-ui's to ship.
 *
 *   (ii) the dock-icon specular — `dock-icon-button` hard-codes
 *        `glass-specular-track` (`dock.js`); the dock DOES wire `--mouse-*`, so this
 *        is a TUNING/intensity ask (ties to D5 dock lag). It RIDES the dock-spring
 *        HANDOFF gate `proof:dock-morph-settled` (BLK-3: canonical name; NOT
 *        `proof:dock-live`) authored in H.W8 — this gate records the cross-link so a
 *        column migration cannot silently close it.
 *
 * THE BORN-RED PATTERN (mirrors proof:group-snapshot-identity's `it.fails`
 * witness): the consume-leg readiness condition — "glass-ui ships the calmer
 * default + wire-or-omit seam" — is FALSE against the INSTALLED glass-ui (the gate
 * reads the actual installed `glass-specular-track.css` + the Card surface map as
 * the source of truth for what glass-ui ships). While the HANDOFF is PENDING the
 * witness FAILS — which is the EXPECTED born-RED state — so the gate GREEN-REPORTS
 * (exit 0, the suite stays green, inv-27: NOT a perpetually-red gate). The instant
 * glass-ui publishes the calm default + the wire-or-omit seam, the readiness
 * condition flips TRUE and the gate HARD-FAILS (exit 1) — the consume-leg signal to
 * (a) bump `@mkbabb/glass-ui`, (b) delete the kf demo's intensity-projection
 * override (`.cartoon-specular::before` in design-idioms.css, now redundant), and
 * (c) retire this witness wrapper. The HANDOFF cannot be "closed" by a doc/column
 * migration — only by glass-ui publishing (the chronic-closure discipline, H.W8).
 *
 * Static gate — reads the installed glass-ui package + (sanity) the kf demo's own
 * calm-recipe witness. No browser, no build. Re-runnable:
 * `node scripts/proof-specular-handoff.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NODE_MODULES = path.join(REPO, "node_modules");
const GLASS_UI = path.join(NODE_MODULES, "@mkbabb/glass-ui");
const DEMO = path.join(REPO, "demo");
const DESIGN_IDIOMS = path.join(DEMO, "@/styles/design-idioms.css");

const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

// The calmer-default thresholds the HANDOFF asks glass-ui to ship (S5 / F4).
const REST_MAX = 0.25; // resting `--specular-intensity` floor on the Card default
const HOVER_MAX = 0.4; // hover lift floor
const RADIUS_MAX = 40; // the radial-gradient `transparent <r>%` reach (and mask)

// Resolve glass-ui's specular CSS (source preferred; dist is the published shape).
// glass-ui's package.json subpath is not exported, so resolve by node_modules path.
function glassUiSpecularCss() {
    const candidates = [
        path.join(GLASS_UI, "src/styles/glass-specular-track.css"),
        path.join(GLASS_UI, "dist/styles/glass-specular-track.css"),
    ];
    for (const p of candidates) if (exists(p)) return { path: p, src: read(p) };
    return null;
}

// Resolve the Card surface map (the CardFooter chunk that adds the track) from the
// built bundle — the `surface === "glass" && "glass-specular-track"` clause.
function cardSurfaceMap() {
    const distDir = path.join(GLASS_UI, "dist");
    if (!exists(distDir)) return null;
    for (const name of fs.readdirSync(distDir)) {
        if (!/^CardFooter.*\.js$/.test(name)) continue;
        const src = read(path.join(distDir, name));
        if (src.includes("glass-specular-track"))
            return { path: path.join("dist", name), src };
    }
    return null;
}

const notes = [];
const note = (s) => {
    notes.push(s);
    console.log(`  · ${s}`);
};

console.log(
    "proof:specular-handoff — H.W2 S5 (the glass-ui Card-default + dock-icon " +
        "specular HANDOFFs · BORN-RED, inv-16)",
);

const css = glassUiSpecularCss();
if (!css) {
    // Cannot read the installed glass-ui — a HANDOFF witness cannot certify the
    // consume-leg readiness either way. Treat as a hard environment fault so the
    // gate is never silently vacuous.
    console.error(
        "  ✗ glass-specular-track.css not found in node_modules/@mkbabb/glass-ui " +
            "(src/ or dist/) — cannot witness the HANDOFF; run `npm ci`.",
    );
    process.exit(2);
}

const map = cardSurfaceMap();

// ── (i) the Card specular SEAM readiness ─────────────────────────────────────
// Two halves: (a) wire-or-omit — the Card stops emitting the track UNWIRED (either
// omits it on the default surface, or the glass-specular-track CSS itself writes
// `--mouse-*` so it is never unwired); (b) a CALMER DEFAULT in the CSS.

// (a) wire-or-omit. The track is UNWIRED today: CardFooter adds it on
// `surface === "glass"` and the CSS only READS `--mouse-x/--mouse-y` (it never
// WRITES them). "Wired-or-omitted" is satisfied when EITHER the Card surface map no
// longer emits `glass-specular-track` on the bare glass default, OR the specular
// CSS self-wires the pointer (a `--mouse-x:` WRITE, not just a `var(--mouse-x)`
// read). Today: emitted AND unwired → NOT satisfied.
const cardEmitsTrackOnGlass =
    !map ||
    /surface\s*===?\s*["']glass["']\s*&&\s*["']glass-specular-track["']/.test(
        map.src,
    ) ||
    // tolerate minified/alt shapes: the literal pairing of the glass surface token
    // and the track class in the same chunk.
    (map.src.includes("glass-specular-track") && /surface/.test(map.src));
// A WRITE of --mouse-x (`--mouse-x:` as a declaration LHS), not a `var(--mouse-x)`
// read, inside the specular CSS would mean glass-ui self-wires the seam.
const specularSelfWires = /--mouse-x\s*:/.test(css.src);
const seamWiredOrOmitted = !cardEmitsTrackOnGlass || specularSelfWires;

// (b) the calmer default. Parse the resting `--specular-intensity` (the base
// `::before` rule, NOT the `.dark` softer value or the :hover/:active lift), the
// hover lift, and the radial reach (`transparent <r>%`).
const restMatch = css.src.match(
    /\.glass-specular-track::before\s*\{[\s\S]*?--specular-intensity:\s*([\d.]+)/,
);
const hoverMatch = css.src.match(
    /:hover::before\s*\{\s*--specular-intensity:\s*([\d.]+)/,
);
// The background radial's `transparent <r>%` reach (the catch-light spread).
const radiusMatch = css.src.match(
    /background:\s*radial-gradient\([\s\S]*?transparent\s+([\d.]+)%/,
);

const rest = restMatch ? parseFloat(restMatch[1]) : NaN;
const hover = hoverMatch ? parseFloat(hoverMatch[1]) : NaN;
const radius = radiusMatch ? parseFloat(radiusMatch[1]) : NaN;

const restCalm = Number.isFinite(rest) && rest <= REST_MAX;
const hoverCalm = Number.isFinite(hover) && hover <= HOVER_MAX;
const radiusCalm = Number.isFinite(radius) && radius <= RADIUS_MAX;
const defaultCalmed = restCalm && hoverCalm && radiusCalm;

note(
    `glass-ui ${(() => {
        try {
            return JSON.parse(read(path.join(GLASS_UI, "package.json"))).version;
        } catch {
            return "?";
        }
    })()} specular default — rest=${rest}, hover=${hover}, radius=${radius}% ` +
        `(ask: rest≤${REST_MAX}, hover≤${HOVER_MAX}, radius≤${RADIUS_MAX}%)`,
);
note(
    `Card seam — emits glass-specular-track on the glass default: ` +
        `${cardEmitsTrackOnGlass}; specular CSS self-wires --mouse-x: ${specularSelfWires} ` +
        `→ wired-or-omitted: ${seamWiredOrOmitted}`,
);

// (ii) the dock-icon specular RIDES proof:dock-morph-settled (BLK-3 canonical
// name). Record the cross-link is the canonical name, not the dangling
// proof:dock-live, so a static resolve-or-red parser (the H.W8 meta-gate) sees the
// pairing. This is a WITNESS note, not a pass/fail axis of THIS gate.
const DOCK_GATE = "proof:dock-morph-settled";
note(
    `dock-icon specular (ii) rides ${DOCK_GATE} (H.W8 — BLK-3 canonical; NOT ` +
        `proof:dock-live); the dock wires --mouse-* so this is a tuning/intensity ask`,
);

// ── the consume-leg readiness condition ──────────────────────────────────────
const consumeLegReady = seamWiredOrOmitted && defaultCalmed;

// ── kf-side witness SANITY: the demo PROVES the calm tune is achievable TODAY ─
// Not part of the readiness flip — a belt that the kf consume-side is correctly
// staged (the `.cartoon-specular` recipe projects the calmed rest/hover onto the
// pseudo). If THIS regresses it is a kf defect (proof:specular-calm owns the live
// assertion), recorded here so the HANDOFF witness is not read in isolation.
let kfRecipeStaged = false;
if (exists(DESIGN_IDIOMS)) {
    const idiom = read(DESIGN_IDIOMS);
    kfRecipeStaged =
        /\.cartoon-specular::before\s*\{[\s\S]*?--specular-intensity:\s*var\(--specular-rest,\s*0?\.22\)/.test(
            idiom,
        ) &&
        /\.cartoon-specular:hover::before\s*\{[\s\S]*?--specular-intensity:\s*var\(--specular-hover,\s*0?\.4\)/.test(
            idiom,
        );
}
note(
    `kf consume-side staged — the demo .cartoon-specular recipe projects the calm ` +
        `0.22 rest / 0.4 hover onto the pseudo: ${kfRecipeStaged} ` +
        `(proof:specular-calm owns the LIVE assertion)`,
);

if (!consumeLegReady) {
    // EXPECTED born-RED state: the HANDOFF is PENDING — glass-ui has not yet shipped
    // the calmer default + wire-or-omit seam. The witness FAILS, which is correct,
    // so the gate GREEN-REPORTS (the suite stays green; inv-27).
    const why = [];
    if (cardEmitsTrackOnGlass && !specularSelfWires)
        why.push("the Card still emits glass-specular-track UNWIRED on the glass default");
    if (!restCalm) why.push(`rest intensity ${rest} > ${REST_MAX}`);
    if (!hoverCalm) why.push(`hover intensity ${hover} > ${HOVER_MAX}`);
    if (!radiusCalm) why.push(`radial reach ${radius}% > ${RADIUS_MAX}%`);
    console.log(
        `\n  ◐ HANDOFF PENDING (born-RED witness — EXPECTED) — glass-ui has NOT ` +
            `shipped the calmer Card default + wire-or-omit seam:\n      ` +
            why.join("\n      ") +
            `\n    kf cannot fix this (inv-16 — glass-ui owns the Card surface map + ` +
            `the dock). The gate green-reports while the HANDOFF is pending and FLIPS ` +
            `RED the instant glass-ui publishes (the consume-leg signal).`,
    );
    console.log(
        "\nproof:specular-handoff — PASS (born-RED witness held): the glass-ui Card-" +
            "default + dock-icon specular HANDOFFs are correctly PENDING; the consume-" +
            "leg is not yet due.",
    );
    process.exit(0);
}

// CONSUME-LEG DUE: glass-ui shipped the calm default + the wire-or-omit seam. The
// witness FLIPS RED — hard-fail so the demo's now-redundant override is retired and
// the package bumped. This is the chronic actually closing.
console.error(
    `\nproof:specular-handoff — FAIL (consume-leg DUE): glass-ui NOW ships the ` +
        `calmer Card specular default (rest=${rest}≤${REST_MAX}, hover=${hover}≤${HOVER_MAX}, ` +
        `radius=${radius}%≤${RADIUS_MAX}%) AND the wire-or-omit seam ` +
        `(wired-or-omitted: ${seamWiredOrOmitted}). The HANDOFF is satisfied upstream — ` +
        `the kf consume-leg is DUE:\n` +
        `  1. bump @mkbabb/glass-ui to the publishing version,\n` +
        `  2. delete the now-redundant .cartoon-specular::before intensity override ` +
        `in design-idioms.css (glass-ui's calm default supersedes it),\n` +
        `  3. retire this born-RED witness wrapper (the HANDOFF is closed).`,
);
process.exit(1);
