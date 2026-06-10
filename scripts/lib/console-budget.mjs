/**
 * console-budget — the SINGLE-SOURCE structured error-budget allowlist + the
 * budget classifier (J.W3 S1b / GC-7 / W7-2).
 *
 * Before J.W3 the `NAMED_BENIGN` array + `isNamedBenign` + `chargeBudget`
 * lived PRIVATE inside `proof-live-session.mjs` (the gate-of-gates) — the only
 * single-source budget definition in the estate (gate-census GC-7), but any
 * future console-budget gate would have re-derived it. This module is the ONE
 * authority.
 *
 * ── THE W7-2 LEG-SCOPING FIX (S1b — the guarantee, not the assumption) ────────
 * The named-benign exclusion used to be applied GLOBALLY (`isNamedBenign(text)`
 * at the TOP of `chargeBudget`, before any leg discrimination) — "inert on dist
 * because dist never emits it" was an ASSUMPTION, and the broad `/source ?map/i`
 * was wide enough to swallow a real dist error (an attenuated re-introduction of
 * the `demo-console-clean` narrowed-regex sin). The exported `chargeBudget` now
 * GATES the dev-environment exclusions on `leg`: the DevTools/vite/dep-optimizer
 * /source-map patterns apply ONLY when the leg is the dev-server leg (the
 * `:5174` leg where the noise appears — `DEV_SERVER_LEG`); on every dist leg
 * they are INERT BY CONSTRUCTION. `/source ?map/i` is tightened to the specific
 * DevTools dep-optimizer fingerprint. The Monaco content-visibility exclusion
 * stays leg-independent (already correctly scoped by `monaco` in the regex).
 *
 * THE BUDGET (proof-live-session S2a, the structured allowlist — H-2): the
 * budget is the COMPLEMENT of the named EXCLUDED set, NOT a positive match list.
 * Every captured pageerror / unhandledrejection / console.error / promoted
 * warning|verbose line that is NOT named-benign charges. No regex-narrowing
 * escape hatch.
 */

// The HARD bare-"......" empty-input parse fingerprint (rc-parse-crash) — matched
// EXPLICITLY. Also the serialize warn / route-storm / could-not-serialize tells.
export const PARSE_FINGERPRINT = /Parse error at offset 0: "\.+"|"\.{4,}"|could not serialize|no CSS twin|\bErr x\b/;
// The _gen crash class (B2) + the Vue flush-abort tell (the downstream symptom).
export const GEN_CRASH = /_gen|Cannot read propert.*undefined|undefined is not an object|Unhandled error during execution of (?:scheduler|component)/;
// The PROMOTED amiga WebGL GPU-stall signal (RC-2). The bare "hidden by content-
// visibility" line is SHARED with the benign Monaco keyframes-pane cache, so the
// promoted oracle is the ReadPixels/GPU-stall line; the content-visibility line is
// counted ONLY when it is NOT the named-benign Monaco cache (see the named set).
export const PROMOTED_GPU = /ReadPixels|GPU stall/i;
export const PROMOTED_CV = /content-visibility|hidden by content-visibility/i;

/** The dev-server leg fingerprint — the ONLY leg where the dev-environment
 *  exclusions apply (the vite `:5174` source-mapped leg). */
export const DEV_SERVER_LEG = /dev[- ]?server|:5174/i;

// NAMED-BENIGN EXCLUSIONS, DEV-SERVER-SCOPED (W7-2): the dev DevTools
// dep-optimizer / source-map noise (the :5174-only ×47) + the vite client chatter.
// `/source ?map/i` TIGHTENED to the DevTools dep-optimizer fingerprint (S1b).
export const NAMED_BENIGN_DEV_SERVER = [
    /Download the (React|Vue) DevTools/i,
    /\[vite\] (connecting|connected)/i,
    /DevTools failed to load source ?map/i,
    /dep-?optimiz/i,
    /node_modules\/\.vite\/deps/i,
    /Failed to load (?:resource).*\.map\b/i,
];

// NAMED-BENIGN EXCLUSIONS, ALL LEGS: the Monaco keyframes-pane INTENTIONAL
// content-visibility:hidden B-2 cache warn (I.W3 impl note) — a benign
// render-in-hidden-subtree line that is NOT a WebGL GPU stall. Chrome's verbose
// message text carries NO element info ("Rendering was performed in a subtree
// hidden by content-visibility."), so the Monaco signature is matched on the
// message SOURCE the caller appends (`… [source: <url>]` — the monaco /
// CSSCodeEditor chunk that owns the `.monaco-pane` content-visibility cache;
// VERIFIED on the dist: 152/152 such lines source from those two chunks while
// the amiga WebGL canvas has NO content-visibility ancestor). A REAL canvas CV
// regression sources from the scene/three chunk → still charges. Named
// signature, never a widened text regex.
export const NAMED_BENIGN_ALL_LEGS = [
    /\bhidden by content-visibility\b.*(monaco|CSSCodeEditor)/i,
];

/** The full named set (introspection / docs — matching is leg-scoped via
 *  `isNamedBenign`, never against this flat union). */
export const NAMED_BENIGN = [...NAMED_BENIGN_DEV_SERVER, ...NAMED_BENIGN_ALL_LEGS];

/** isNamedBenign(text, leg) — leg-SCOPED (W7-2): the dev-environment patterns
 *  exclude ONLY on the dev-server leg; the all-legs patterns everywhere. On a
 *  dist leg the dev exclusions are inert by construction. */
export const isNamedBenign = (text, leg = "") =>
    NAMED_BENIGN_ALL_LEGS.some((re) => re.test(text)) ||
    (DEV_SERVER_LEG.test(leg) && NAMED_BENIGN_DEV_SERVER.some((re) => re.test(text)));

// Classify a captured console/page event against the budget. Returns null if it
// does NOT charge the budget, else a { tier, text } charge. `leg` scopes BOTH the
// named-benign exclusions (W7-2, above) AND the PROMOTED tier: per S2a the
// ReadPixels/GPU-stall + content-visibility warns are promoted-zero ONLY in the
// amiga WebGL context (where they index the RC-2 GPU stall over the live present
// loop). Elsewhere the generic Chrome verbose "Rendering was performed in a
// subtree hidden by content-visibility" line is the NAMED-BENIGN Monaco
// keyframes-pane B-2 cache (an intentional content-visibility:hidden, I.W3 impl
// note) — NOT a WebGL stall, NOT counted.
export function chargeBudget(kind, type, text, leg = "") {
    if (isNamedBenign(text, leg)) return null;
    // HARD: any pageerror / unhandledrejection / weberror / crash.
    if (kind === "pageerror" || kind === "unhandledrejection" || kind === "weberror" || kind === "crash") {
        return { tier: "HARD", text: `${kind}: ${text}` };
    }
    if (kind === "console") {
        // HARD: console.error (any) + the explicit parse fingerprint on any level.
        if (type === "error") return { tier: "HARD", text: `console.error: ${text}` };
        if (PARSE_FINGERPRINT.test(text)) return { tier: "HARD", text: `parse-fingerprint(${type}): ${text}` };
        if (GEN_CRASH.test(text)) return { tier: "HARD", text: `_gen-crash(${type}): ${text}` };
        // PROMOTED — SCOPED to the amiga WebGL context (S2a). The ReadPixels/GPU-
        // stall line is the unmistakable amiga signal anywhere; the bare content-
        // visibility verbose line is promoted ONLY on the amiga leg (elsewhere it is
        // the benign Monaco cache, named-benign by SCOPE not by widening a regex).
        const isAmigaLeg = /amiga/i.test(leg);
        // DECLARED-READBACK legs (the harness's OWN page.screenshot of a WebGL
        // canvas, used to MEASURE the subject-vs-room MAD) synchronously read the
        // framebuffer back — Chromium's GL driver emits the SAME "GPU stall due to
        // ReadPixels" line for that INSTRUMENT readback as it would for a real
        // product present-loop stall. That line is the measurement instrument, NOT
        // the product (the amiga render loop never reads back; I.W3 removed it). A
        // leg explicitly marked `:readback` therefore does NOT charge the PROMOTED
        // GPU/CV tiers — the genuine RC-2 present-loop oracle rides the NO-screenshot
        // `B3:amiga-present-loop` leg (which DOES charge), mirroring the canonical
        // proof:amiga-subject-is-pivot clause (a)/(c) split. HARD tiers still charge
        // on readback legs — a real throw during a screenshot is still a real throw.
        const isDeclaredReadback = /readback/i.test(leg);
        if (!isDeclaredReadback && (type === "warning" || type === "verbose" || type === "warn") && PROMOTED_GPU.test(text)) {
            return { tier: "PROMOTED", text: `gpu-stall(${type}): ${text}` };
        }
        if (isAmigaLeg && !isDeclaredReadback && (type === "warning" || type === "verbose" || type === "warn") && PROMOTED_CV.test(text)) {
            return { tier: "PROMOTED", text: `amiga content-visibility(${type}): ${text}` };
        }
    }
    return null;
}
