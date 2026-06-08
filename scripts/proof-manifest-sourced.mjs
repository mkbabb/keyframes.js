#!/usr/bin/env node
/**
 * proof:manifest-sourced — H.W8 S1 (I-1) — the SCENES-manifest standing invariant.
 *
 * ROOT-B (a-gate-blindspots): the runtime `SCENES` manifest in
 * `scripts/lib/demo-driver.mjs` was a HAND-MAINTAINED array that DRIFTED — it
 * knew 6 scenes while the demo shipped more (the sequence/motion-path primitives
 * were NEVER occlusion-checked, lighthouse-scored, or captured by any runtime
 * gate). "The gate that lists them never looks at them; the gates that look never
 * list them."
 *
 * H.W8 S1 re-sourced `SCENES` FROM `demo/app/scenes.ts` (the single source the
 * router already trusts). This gate is the STANDING INVARIANT that keeps it
 * honest: it asserts SET-EQUALITY between the runtime `SCENES` keys and the
 * `scenes.ts` id UNION `[homeScene.id, ...scenes.map(s => s.id)]` — bidirectional,
 * key-by-key, NOT a hard-coded count (so it AUTO-TRACKS every future scene
 * add/remove — e.g. H.W5's Discrete→Spring merge follows for free; WV-W8-MED-1).
 *
 * This is the SAME resolve-or-red / stale-guard mechanism as `proof:idioms`
 * clause-1 + the `proof:brittleness` LISTENER_ALLOWLIST stale guard: a static
 * parse of two committed sources, reds on the exact negative case it forbids.
 *
 * CLAUSES (each BITES):
 *
 *   1. UNMANIFESTED — every `scenes.ts` id (home + each `scenes[]` descriptor)
 *      appears as a `SCENES` key. BITE: add a scene to `scenes.ts` without a
 *      manifest entry → the new id is unmanifested → reds. (This is the bite that
 *      reds TODAY against the pre-H drifted array, and the load-bearing fix that
 *      makes a new scene auto-enroll in every runtime gate.)
 *
 *   2. STALE-KEY — every `SCENES` key resolves to a `scenes.ts` id. BITE: a
 *      manifest key for a removed/renamed scene → reds (the stale-key guard,
 *      mirroring proof:brittleness's LISTENER_ALLOWLIST stale guard).
 *
 *   3. DERIVED-NOT-HAND-LISTED — `demo-driver.mjs` must DERIVE the scene set from
 *      `scenes.ts` at module load (parse `scenes.ts`), not re-declare a hand
 *      array of id literals. BITE: re-introduce a literal `SCENES = [{ key: "…" }]`
 *      hand-list (the drift mechanism) → reds. (Source-shape guard so the fix
 *      can't silently regress to a hand array that happens to match today.)
 *
 * Exits 1 on any residual (mirrors proof:idioms / proof:brittleness). Re-runnable:
 *   npm run proof:manifest-sourced
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCENES_TS = path.join(REPO, "demo/app/scenes.ts");
const DEMO_DRIVER = path.join(REPO, "scripts/lib/demo-driver.mjs");

const failures = [];
const fail = (msg) => failures.push(msg);

// Import the re-sourced SCENES manifest. The demo-driver's OWN stale-key guard
// throws at module load when scenes.ts drifts from the gate metadata — catch it
// and surface it as a clean gate failure (the driver throw IS the bite, but a
// stack trace is not a gate report). If it throws, SCENES is unavailable, so we
// red on the parsed scenes.ts ids alone.
let SCENES = null;
try {
    ({ SCENES } = await import("./lib/demo-driver.mjs"));
} catch (e) {
    fail(
        "[driver-guard] scripts/lib/demo-driver.mjs threw while deriving SCENES " +
            `from scenes.ts — the manifest has drifted: ${e.message}`,
    );
}

// ── Parse scenes.ts for the id UNION (home + each scenes[] descriptor) ─────────
// Comment-blank + brace-match, the SAME shape proof:scene-icons + demo-driver
// itself use — so the gate, the gate's subject, and the manifest can never drift
// onto different scene sets.
function scenesTsIds() {
    const src = fs.readFileSync(SCENES_TS, "utf8");
    const blanked = src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

    const ids = [];

    // homeScene — `id: HOME_SCENE_ID` (the only symbol-valued id; HOME_SCENE_ID
    // is declared `= "home"` just above it).
    const homeIdM = blanked.match(/export const HOME_SCENE_ID\s*=\s*["'`]([^"'`]+)["'`]/);
    const homeId = homeIdM ? homeIdM[1] : "home";
    if (/export const homeScene:\s*SceneDescriptor\s*=\s*\{/.test(blanked)) {
        ids.push(homeId);
    } else {
        fail("scenes.ts — could not locate the `homeScene` descriptor");
    }

    // The `scenes: SceneDescriptor[] = [ … ]` array.
    const arrM = blanked.match(/export const scenes:\s*SceneDescriptor\[\]\s*=\s*\[/);
    if (!arrM) {
        fail("scenes.ts — could not locate the `scenes: SceneDescriptor[] = [` array");
        return ids;
    }
    // Brace-match the array body.
    let i = arrM.index + arrM[0].length - 1; // at the `[`
    let depth = 0;
    const start = i + 1;
    for (; i < blanked.length; i++) {
        if (blanked[i] === "[") depth++;
        else if (blanked[i] === "]") {
            depth--;
            if (depth === 0) break;
        }
    }
    const body = blanked.slice(start, i);
    // Each top-level `{ … }` is a descriptor; pull its `id:` string literal.
    let d = 0;
    let objStart = -1;
    for (let k = 0; k < body.length; k++) {
        const ch = body[k];
        if (ch === "{") {
            if (d === 0) objStart = k;
            d++;
        } else if (ch === "}") {
            d--;
            if (d === 0 && objStart >= 0) {
                const obj = body.slice(objStart, k + 1);
                const idM = obj.match(/\bid:\s*["'`]([^"'`]+)["'`]/);
                if (idM) ids.push(idM[1]);
                else fail(`scenes.ts — a descriptor has no string id: ${obj.slice(0, 60)}`);
                objStart = -1;
            }
        }
    }
    return ids;
}

const tsIds = scenesTsIds();
// SCENES is null only if the driver guard already threw (recorded above) — treat
// it as an empty manifest so the unmanifested clause reds with the scene names.
const manifestKeys = SCENES ? SCENES.map((s) => s.key) : [];

const tsSet = new Set(tsIds);
const manifestSet = new Set(manifestKeys);

// ── 1. UNMANIFESTED — every scenes.ts id ∈ SCENES ─────────────────────────────
for (const id of tsIds) {
    if (!manifestSet.has(id)) {
        fail(
            `[unmanifested] scenes.ts ships scene "${id}" but the runtime SCENES ` +
                `manifest has no entry for it — it is NEVER gate-visited (occlusion/` +
                `lighthouse/capture). Add a SCENE_GATE_META["${id}"] entry in ` +
                `scripts/lib/demo-driver.mjs.`,
        );
    }
}

// ── 2. STALE-KEY — every SCENES key ∈ scenes.ts ids ───────────────────────────
for (const key of manifestKeys) {
    if (!tsSet.has(key)) {
        fail(
            `[stale-key] the SCENES manifest has key "${key}" with no matching ` +
                `scenes.ts id — it is STALE (the scene was removed/renamed in ` +
                `scenes.ts). Prune SCENE_GATE_META["${key}"] in demo-driver.mjs.`,
        );
    }
}

// Non-vacuity: the manifest must actually carry scenes (a parse that yields an
// empty set must not pass green).
if (tsIds.length === 0) {
    fail("[non-vacuity] parsed ZERO scenes.ts ids — the parse failed; refusing to pass green");
}
if (SCENES && manifestKeys.length === 0) {
    fail("[non-vacuity] the runtime SCENES manifest is EMPTY");
}

// ── 3. DERIVED-NOT-HAND-LISTED — demo-driver derives from scenes.ts ───────────
// The fix must DERIVE the scene set (parse scenes.ts) rather than re-declare a
// hand array of `{ key: "literal" }` objects that happens to match today and
// re-drifts tomorrow. We assert (a) demo-driver references scenes.ts, and (b) it
// does NOT contain a literal hand-list of `key:` string literals in an array.
{
    const driver = fs.readFileSync(DEMO_DRIVER, "utf8");
    if (!/scenes\.ts/.test(driver) || !/parseScenesManifest|SCENE_GATE_META/.test(driver)) {
        fail(
            "[derived] demo-driver.mjs no longer parses demo/app/scenes.ts — the " +
                "manifest must be DERIVED from the single source, not hand-maintained.",
        );
    }
    // A hand-list regression: `export const SCENES = [ { key: "home", … }, … ]`
    // with ≥2 inline `key: "literal"` object entries directly in the SCENES array
    // literal. The derived form is `export const SCENES = sceneRecords.map(...)`.
    const exportM = driver.match(/export const SCENES\s*=\s*([^\n;]*)/);
    if (exportM && /\[/.test(exportM[1])) {
        // SCENES is assigned an array literal directly — count inline key: "x".
        const tail = driver.slice(exportM.index);
        const literalKeys = (tail.match(/\bkey:\s*["'`][^"'`]+["'`]/g) || []).length;
        if (literalKeys >= 2) {
            fail(
                "[derived] `export const SCENES` is a HAND-LISTED array of " +
                    `${literalKeys} \`key: "literal"\` entries — this is the drift ` +
                    "mechanism H.W8 S1 removed. Derive SCENES from scenes.ts instead.",
            );
        }
    }
}

// ── Report ────────────────────────────────────────────────────────────────────
if (failures.length) {
    console.error("✗ proof:manifest-sourced — the SCENES manifest is not scenes.ts-sourced:\n");
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        `\n  scenes.ts ids (${tsIds.length}): ${tsIds.join(", ")}` +
            `\n  SCENES keys  (${manifestKeys.length}): ${manifestKeys.join(", ")}`,
    );
    process.exit(1);
}

console.log(
    `✓ proof:manifest-sourced — SCENES keys ≡ scenes.ts ids ` +
        `(${tsIds.length} scenes, bidirectional set-equality, derived from scenes.ts):\n` +
        `    ${tsIds.join(", ")}`,
);
