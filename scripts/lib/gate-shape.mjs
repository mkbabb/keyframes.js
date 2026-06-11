/**
 * gate-shape — the ONE lib-aware harness/actuation DETECTION authority for the
 * meta-gates (J.W3 fix-round 1; the S1 migration's missed twin).
 *
 * WHY THIS FILE EXISTS. Two meta-gates detect "is this gate a RUNTIME gate?"
 * by grepping a cited gate's SOURCE for the browser-harness trio
 * (serveDist + KF_PLAYWRIGHT_DIR chromium resolve + .newContext) and the
 * actuation primitives:
 *
 *   - proof:gate-is-runtime   — polices the GATES' shape (the correctness roster)
 *   - proof:chronic-closure   — polices the chronic ROWS' cited gates' shape
 *
 * Each carried its OWN inline copy of the detector. When J.W3 S1 migrated the
 * estate onto the lib lifecycle (withPage/withBrowser single-sources the trio in
 * scripts/lib/demo-driver.mjs), proof:gate-is-runtime was taught the lib path
 * (its LIB_LIFECYCLE_IMPORT escape) but proof:chronic-closure was NOT — so every
 * chronic's cited, correctly-migrated gate "failed" the stale inline signature:
 * a harness-shape DETECTOR break, not a product finding. The drift between the
 * two detectors is exactly the duplication class the wave existed to kill; this
 * module is the single authority both meta-gates now consume.
 *
 * DETECTION RULE (lib-aware, identical for both consumers): a gate satisfies the
 * browser-harness signature iff it IMPORTS the lib lifecycle
 * (`import { withPage | withBrowser … } from "./lib/demo-driver.mjs"` — the lib
 * IS the trio, single-sourced per gate-census GC-1) OR it carries all three
 * inline anchors (the not-yet-migrated form, kept valid).
 *
 * NO behavior here — pure regex tables + predicates over gate SOURCE text. This
 * is hygiene-tier instrumentation (source shape), exactly like its consumers.
 */

/** The lib-lifecycle import — a migrated gate's harness signature (J.W3 S1). */
export const LIB_LIFECYCLE_IMPORT =
    /import\s*\{[^}]*\bwith(?:Page|Browser)\b[^}]*\}\s*from\s*["']\.\/lib\/demo-driver\.mjs["']/;

/** The inline browser-harness trio (the pre-migration form, still valid). */
export const HARNESS_SIGNATURE = [
    { re: /\bserveDist\b/, name: "serveDist (serves the BUILT dist over http)" },
    { re: /KF_PLAYWRIGHT_DIR/, name: "KF_PLAYWRIGHT_DIR chromium resolve" },
    { re: /\.newContext\(/, name: "browser.newContext (a real browsing context)" },
];

/**
 * The ACTUATION primitives — the gate must DRIVE the product, not rest on it.
 * A `goto`+`waitForTimeout`+read is NOT actuation; these are. navToScene is the
 * J.W0 per-EXPECTED-state scene-SWITCH drive (J.W3 S5): a real route actuation
 * through the same hash-nav surface a human's dock switch commits.
 */
export const ACTUATION_PRIMITIVES = [
    { re: /\bnavToScene\(/, name: "navToScene (scene-SWITCH drive)" },
    { re: /\bpage\.click\(|\.click\(\s*\{|\.click\(\)/, name: "page.click / locator.click" },
    { re: /\bpage\.dispatchEvent\(|document\.dispatchEvent\(|\.dispatchEvent\(/, name: "dispatchEvent (synthetic event)" },
    { re: /\bpage\.mouse\.(down|up)\b/, name: "page.mouse.down/up (a real drag)" },
    { re: /\bpage\.mouse\.move\b/, name: "page.mouse.move (pointer drive)" },
    { re: /\bpage\.keyboard\b|\.press\(/, name: "page.keyboard / .press (key drive)" },
    { re: /\bpage\.dragAndDrop\(/, name: "page.dragAndDrop" },
    { re: /\bnew PointerEvent\(/, name: "trusted PointerEvent dispatch (handle drag)" },
    // J.W4 — the TOUCH modality (the input-modality band): a real touch tap /
    // CDP-dispatched touch sequence is a first-class actuation, same strength
    // as a click/drag (page.tap routes Playwright's touchscreen; the CDP
    // Input.dispatchTouchEvent trio is the touch-DRAG drive).
    { re: /\.tap\(|\btouchscreen\.tap\b/, name: "touch tap (page/locator.tap — real touch actuation)" },
    { re: /Input\.dispatchTouchEvent/, name: "CDP touch sequence (touchStart/Move/End — a real touch drag)" },
    { re: /\.hover\(/, name: ".hover (pointer hover-drive)" },
];

/**
 * A STRONG (interaction-driving) actuation — clicks/drags/keys/dispatch — vs the
 * at-rest pointer move/hover. A gate whose ONLY actuation is a pointer move is
 * the rest-appearance class (B7) and is NAMED by its consumer, not hidden.
 */
export const STRONG_ACTUATION = ACTUATION_PRIMITIVES.filter(
    (p) => !/mouse\.move|\.hover/.test(p.name),
);

/**
 * The harness anchors a gate's source is MISSING (empty array = the signature is
 * satisfied). Lib-aware: a lib-lifecycle import satisfies the signature outright.
 */
export function missingHarnessAnchors(src) {
    if (LIB_LIFECYCLE_IMPORT.test(src)) return [];
    return HARNESS_SIGNATURE.filter((s) => !s.re.test(src)).map((s) => s.name);
}

/** True iff the source carries the browser-harness signature (lib or inline). */
export const hasBrowserHarness = (src) => missingHarnessAnchors(src).length === 0;

/** The names of the actuation primitives present in the source. */
export function actuationNamesOf(src, primitives = ACTUATION_PRIMITIVES) {
    return primitives.filter((p) => p.re.test(src)).map((p) => p.name);
}
