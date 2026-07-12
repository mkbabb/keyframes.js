#!/usr/bin/env node
/**
 * proof:no-dead-export — T.F23(a) (the AGGRESSIVE demo purge, export granularity).
 *
 * THE DEFECT CLASS. `proof:no-orphan-module` catches a whole FILE no entry root
 * imports (the `animate.ts` zombie); `proof:no-dead-dependency` catches a whole
 * PACKAGE nothing imports. Neither sees the finer grain: a single EXPORTED SYMBOL
 * with zero consumer — a `kfEngineReady` defined/exported/called-nowhere, a
 * reflexive `Use…Return`/`Use…Options`/`…Params` interface exported out of a
 * composable but consumed only inside its own file. The GRAND COLOCATION EDICT
 * names this exact residue ("deprecated, legacy, superfluous code, sub-optimal
 * encapsulation"). This gate makes the class STRUCTURAL at the export granularity
 * the two coarser gates miss.
 *
 * ── THE CENSUS ────────────────────────────────────────────────────────────────
 * EXPORT SIDE (scoped to `demo/` — the wave's charter is the DEMO purge; `src/`'s
 * export surface is patrolled by proof:boundary/published-surface/no-orphan-module,
 * `test`/`scripts` are leaf tiers). Every NAMED export of a `demo/**` `.ts`/`.vue`
 * file: `export const|let|var|function|class|type|interface|enum X`, and the
 * `export { A, B as C }` list form (the re-export binding name). A `.vue` file is
 * read only inside its `<script>` blocks. `export default` is EXCLUDED — a `.vue`
 * default component is consumed via a PATH import + template mount, not an
 * identifier reference, so an identifier scan cannot see its use (that reachability
 * is proof:no-orphan-module's file-grain job, not this gate's).
 *
 * CONSUMER SIDE (spans `demo` + `src` + `test` + `scripts`). A symbol is LIVE iff
 * its identifier (`\bNAME\b`) appears in ANY OTHER file across those four roots.
 * The scan is deliberately CONSERVATIVE — a comment mention, a string, a re-export
 * all count as "used" — so the gate never false-flags a live symbol; the only risk
 * is under-reporting, which the ratchet (below) tightens over time. A symbol used
 * ONLY within its own defining file is DEAD-as-an-export (the fix is to drop the
 * `export`, not the declaration) and is reported.
 *
 * ── THE RATCHET (known-violations shape, the engine cycle-count precedent) ──────
 * T.F23(a) EXCISED only the confirmed-dead TRIVIAL symbols it was cleared to touch
 * (`kfEngineReady` deleted; `StageMode`/`LoAFRecord`/`SequenceRow`/`STORE_TTL_MS`
 * un-exported). The remaining ~54 dead exports are ENTANGLED with the facility
 * lane's in-flight files (the animation-transport suite, the easing/spring scene
 * dirs, the controls composables) OR are reflexive composable interfaces whose
 * consume/inline/un-export decision rides the post-facility sweep. They are carried
 * in DEFERRED (below) — an explicit, dispositioned backlog, NOT a silent exemption.
 *
 * The ratchet enforces MONOTONE SHRINKAGE:
 *   · a dead export NOT in DEFERRED  → RED (a NEW dead export — un-export or wire it).
 *   · a DEFERRED entry that is no longer dead (now consumed) OR whose file/symbol is
 *     gone → RED ("stale — remove the DEFERRED row"). The backlog can only shrink;
 *     the sweep completes when DEFERRED is empty and this array is deleted.
 *
 * CI posture: HARD — a structural, device-independent export-census oracle.
 *
 * RUN: node scripts/proof-no-dead-export.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The CONSUMER-scan roots (a symbol is live if referenced in ANY of these).
const SCAN_ROOTS = ["demo", "src", "test", "scripts"];
// The EXPORT-census root (the wave charter: the DEMO purge).
const EXPORT_ROOT = "demo";
const EXTS = new Set([".ts", ".vue", ".mts", ".mjs"]);

// ── DEFERRED (the ratchet backlog) ────────────────────────────────────────────
// Each `[file, symbol]` is a dead demo export the T.F23(a) charter could NOT
// excise this batch (facility-lane in-flight file, or a reflexive interface whose
// disposition rides the post-facility sweep). The list may ONLY shrink. A dead
// export missing from here REDs; a stale row (no longer dead) REDs.
const DEFERRED = [
    // ── the animation-transport suite (facility-lane OFF-LIMITS this batch) ──
    ["demo/components/instrument/transport/composables/useScrollFade.ts", "UseScrollFadeOptions"],
    ["demo/components/instrument/transport/composables/useScrollFade.ts", "UseScrollFadeReturn"],
    // (useSheetState.ts UseSheetStateOptions/UseSheetStateReturn RETIRED at T.H3-ADOPT —
    //  the bespoke sheet composable was DELETED with the Drawer swap; the ratchet drops
    //  the two discharged rows, tightening dead-export by 2.)
    ["demo/components/instrument/transport/composables/useDragCapture.ts", "DragCaptureHandlers"],
    // ── keyframes-editor / keyframe-timeline / shared leaves (reflexive types) ──
    // (GestureLegend.vue / GestureLegendItem RETIRED at T.M batch ⑧ — the whole
    //  file was deleted with the on-stage gesture-legend layer, VERDICT #8; the
    //  ratchet drops the discharged row.)
    ["demo/components/instrument/timeline/utils/snapshotCapture.ts", "captureNonDefaultSnapshot"],
    ["demo/components/instrument/keyframes/composables/useToolbarKeyboard.ts", "ToolbarKeyboard"],
    // ── @/state/ (the app-level reset-hook registry seam) ──
    // `registerStoreReset` is retained as the general reset-composer CONTRACT
    // (@/state/index.ts documents it: the last consumer — compose's asset store —
    // was PRUNED under OD-1, the seam kept for the next feature store). Deliberate
    // retention, not confirmed-superfluous: it stays deferred until a consumer
    // returns or the contract is formally retired.
    ["demo/state/index.ts", "registerStoreReset"],
    // ── glass-ui gap ledger (T.H surface, not the T.F23 demo purge) ──
    ["demo/glass-ui-gaps.ts", "GlassCapKey"],
    ["demo/glass-ui-gaps.ts", "GlassUiGap"],
    ["demo/glass-ui-gaps.ts", "GlassUiGapId"],
    // ── easing scene dir (OD-7 redesign target — do NOT restructure) ──
    ["demo/utils/reference-data/easingGroups.ts", "CurveGroup"],
];

// ── source helpers ────────────────────────────────────────────────────────────

function collect(root) {
    const out = [];
    const abs = path.join(REPO, root);
    if (!fs.existsSync(abs)) return out;
    (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            if (e.name === "node_modules" || e.name.startsWith(".")) continue;
            if (e.name === "dist") continue;
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (EXTS.has(path.extname(e.name)) && !e.name.endsWith(".d.ts"))
                out.push(p);
        }
    })(abs);
    return out;
}

/** For a `.vue` file, the concatenated `<script>` block bodies; else the whole file. */
function scriptSource(src, file) {
    if (file.endsWith(".vue")) {
        const blocks = src.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
        return blocks ? blocks.join("\n") : "";
    }
    return src;
}

const DECL_RE =
    /export\s+(?:default\s+)?(?:async\s+)?(?:abstract\s+)?(?:const|let|var|function\*?|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g;
const LIST_RE = /export\s+(?:type\s+)?\{([^}]*)\}(?!\s*from)/g;

/** Every NAMED export identifier of a file (excludes `export default`). */
function namedExports(code) {
    const names = new Set();
    let m;
    DECL_RE.lastIndex = 0;
    while ((m = DECL_RE.exec(code))) {
        // `export default function X` names X but the binding is `default`; skip.
        const pre = code.slice(Math.max(0, m.index), m.index + m[0].length);
        if (/export\s+default\b/.test(pre)) continue;
        names.add(m[1]);
    }
    LIST_RE.lastIndex = 0;
    while ((m = LIST_RE.exec(code))) {
        for (let part of m[1].split(",")) {
            part = part.trim();
            if (!part || part === "default") continue;
            const asM = part.match(/\bas\s+([A-Za-z_$][\w$]*)/);
            const name = asM ? asM[1] : part.replace(/^type\s+/, "").trim();
            if (/^[A-Za-z_$][\w$]*$/.test(name) && name !== "default")
                names.add(name);
        }
    }
    return names;
}

// ── the census ────────────────────────────────────────────────────────────────

// EXCLUDE this gate's own file from the consumer scan — the DEFERRED backlog
// LISTS every symbol name, so scanning it would mark every deferred symbol
// "used" and collapse the census to zero (a self-referential blind spot).
const SELF = fileURLToPath(import.meta.url);
const allFiles = SCAN_ROOTS.flatMap(collect).filter((f) => f !== SELF);
const textCache = new Map();
for (const f of allFiles) textCache.set(f, fs.readFileSync(f, "utf8"));

const exportFiles = allFiles.filter((f) =>
    f.startsWith(path.join(REPO, EXPORT_ROOT) + path.sep),
);

const dead = []; // { rel, name }
for (const f of exportFiles) {
    const rel = path.relative(REPO, f);
    const code = scriptSource(textCache.get(f), f);
    for (const name of namedExports(code)) {
        const ident = new RegExp(
            "\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
        );
        let used = false;
        for (const other of allFiles) {
            if (other === f) continue;
            if (ident.test(textCache.get(other))) {
                used = true;
                break;
            }
        }
        if (!used) dead.push({ rel, name });
    }
}

// ── the ratchet ─────────────────────────────────────────────────────────────
const deferredSet = new Set(DEFERRED.map(([f, n]) => `${f}::${n}`));
const deadSet = new Set(dead.map((d) => `${d.rel}::${d.name}`));

const failures = [];

// (1) a NEW dead export not in the DEFERRED backlog.
const newDead = dead.filter((d) => !deferredSet.has(`${d.rel}::${d.name}`));
for (const d of newDead) {
    failures.push(
        `NEW dead export: \`${d.name}\` in ${d.rel} is exported but referenced ` +
            `in NO other file (demo/src/test/scripts). Drop the \`export\` (keep the ` +
            `declaration if used in-file), inline it, or wire a real consumer. If it is ` +
            `entangled with a facility-lane in-flight file, add a DEFERRED row with the reason.`,
    );
}

// (2) a STALE DEFERRED row — the ratchet can only shrink.
for (const [file, name] of DEFERRED) {
    if (!deadSet.has(`${file}::${name}`)) {
        failures.push(
            `STALE DEFERRED row: \`${name}\` in ${file} is no longer a dead export ` +
                `(now consumed, un-exported, or removed). Delete its DEFERRED row — the ` +
                `backlog ratchets DOWN, never carries a discharged entry.`,
        );
    }
}

// ── report ────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `proof:no-dead-export — FAIL (${failures.length} finding(s)):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}

console.log(
    `proof:no-dead-export — PASS: ${exportFiles.length} demo files censused; ` +
        `every dead export is a dispositioned DEFERRED backlog row ` +
        `(${DEFERRED.length} carried, ratcheting to zero post-facility). No NEW ` +
        `zero-consumer export; no stale backlog row. The dead-export class is structural ` +
        `at the granularity proof:no-orphan-module (file) + proof:no-dead-dependency ` +
        `(package) miss.`,
);
process.exit(0);
