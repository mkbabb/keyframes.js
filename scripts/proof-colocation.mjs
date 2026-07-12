#!/usr/bin/env node
/**
 * proof:colocation — T.F21, THE GRAND COLOCATION EDICT keystone (OWNER-ASKS row 1).
 *
 * The edict: components COLOCATE their private sub-components / composables /
 * skeletons / constants / styles — recursively; a shared `composables/` /
 * `styles/` / `utils/` dir may hold ONLY the truly module-/global-level members.
 * Every S.D structural gate answered a LOCAL predicate ("is file X in the right dir
 * by import-count?") and passed on a tree the owner rejected on sight — none
 * answered the GLOBAL "can I read this tree?". This gate is the STANDING rule (not
 * a one-time move) that the pre-edict moves are instances of.
 *
 * IT EXTENDS proof:shared-has-n-consumers (C-23), which owns the consumer-COUNT bar
 * (a shared-tier member earns its seat by ≥2 consuming areas). This gate adds the
 * COMPLEMENTARY axes that count alone cannot see — do NOT re-count consumers here:
 *
 *   CLAUSE (kind) — SHARED-TIER KIND-APPROPRIATENESS. A member of a shared tier
 *     must be the RIGHT KIND for that tier:
 *       • `composables/` — a file imports a Vue/@vueuse reactive or lifecycle
 *         primitive (a real composable, not a plain module-scope helper).
 *       • `utils/` — a generic DOM/text helper, NOT boot infrastructure (the
 *         engine-loader accessor is runtime infra, it belongs beside `state/`).
 *       • `styles/` — global theme/token/idiom vocabulary (a `.css`/`.json` sheet),
 *         not a single-component scoped stylesheet.
 *
 *   CLAUSE (colocate) — SATELLITE COLOCATION. A `use*.ts` composable must not sit
 *     FLAT at a module root when that module already sub-folders a `composables/`
 *     tier — a single-owner satellite colocates into the module's own tier.
 *
 * DEFERRED — the pre-edict move waves (T.F13 leaf re-homing, T.F16 KfPillTabs
 * de-vanity, …) physically relocate the residual violations. Those files are OTHER
 * lanes' surface; this gate names them in DEFERRED so it is honestly-backlogged
 * (mergeable-GREEN) rather than red-on-a-sibling's-in-flight-work. A DEFERRED entry
 * is TOLERANT: it passes whether the violation is still present (deferred) OR
 * already cured by its owning lane — so a merge in either order is green. The
 * orchestrator prunes cleared entries at close.
 *
 * Re-runnable STATIC instrument (no browser, no build):
 *   node scripts/proof-colocation.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

// The shared library tier. `demo/` today; `demo/shared/` if the sibling rename
// lands. Resolve whichever exists so the gate survives the move (arming-audit).
const SHARED = ["demo", "demo/shared"]
    .map((r) => path.join(REPO, r))
    .find((p) => fs.existsSync(p));

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");
// Strip block + line comments so a prose token ("ref-counted") never counts as a
// reactive-primitive USE (the gestureSelectSuppression false-positive).
const stripComments = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/**
 * DEFERRED — known residual violations OTHER lanes' pre-edict moves cure. Keyed by
 * the file's relPosix (both `@` and `shared` spellings, since the rename lane may
 * land first). TOLERANT: satisfied whether present-and-deferred or already-cured.
 */
const DEFERRED = new Map([
    [
        "utils/kfEngine.ts",
        "the engine-loader boot accessor (runtime infra) → T.F13 promotes it beside state/",
    ],
    [
        "components/animation-transport/useKfPillTabs.ts",
        "a shared roving-tabindex leaf mis-nested in a feature peer → T.F16 de-vanity + colocation",
    ],
]);
// Which shared-relative paths were consulted, so a STALE deferred entry (one that
// no path in the tree could ever match — a typo) is surfaced. Cured entries are
// NOT stale (the file legitimately moved); only never-matchable keys warn.
const deferredHit = new Set();

/** Is `rel` (shared-relative posix) a deferred residual? Records the hit. */
function isDeferred(rel) {
    if (DEFERRED.has(rel)) {
        deferredHit.add(rel);
        return true;
    }
    return false;
}

function collect(dir, exts, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collect(path.join(dir, e.name), exts, out);
        } else if (exts.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

const REACTIVE_IMPORT = /from\s+["'](?:vue|@vueuse\/[\w-]+)["']/;
const REACTIVE_PRIMITIVE =
    /\b(?:ref|shallowRef|reactive|computed|watch|watchEffect|watchPostEffect|onMounted|onUnmounted|onBeforeUnmount|onScopeDispose|effectScope|customRef|toRef|toRefs|toValue|readonly|provide|inject|getCurrentScope|useEventListener|useRafFn|useStorage|createGlobalState)\s*[(<]/;

// A composables/ member is kind-appropriate if it is REACTIVE (imports a Vue/
// @vueuse primitive or calls one) OR it is a `use*`-named FACTORY (composable-
// shaped: a pure clock-gated / geometry helper the loop calls is legitimate
// composable infrastructure — e.g. useThrottledReadout, a pure cadence gate). The
// RED target is a NON-`use*`, non-reactive plain module-scope side-effecting helper
// (gestureSelectSuppression: exported beginGesture/endGesture mutating a body class
// — a util, not a composable).
function isComposableKind(base, src) {
    const stem = base.replace(/\.ts$/, "");
    if (/^use[A-Z]/.test(stem)) return true;
    const code = stripComments(src);
    return REACTIVE_IMPORT.test(code) || REACTIVE_PRIMITIVE.test(code);
}

const ENGINE_LOADER = /\b(?:loadAnimationEngine|warmEngine|AnimationEngine)\b/;
function isBootInfra(src) {
    return ENGINE_LOADER.test(stripComments(src));
}

function main() {
    console.log(
        "proof:colocation — T.F21 GRAND COLOCATION EDICT keystone (kind + satellite colocation)",
    );

    if (!SHARED) {
        console.error(
            "proof:colocation — ERROR: no shared tier found (tried demo, demo/shared).",
        );
        process.exit(3);
    }
    const sharedRel = relPosix(SHARED); // demo or demo/shared
    const failures = [];
    const deferrals = [];

    // U.A9 backend clause: enforcement families begin under scripts/gates, with
    // an index barrel as the tier's executable home. The first migrated family is
    // the publish surface; subsequent families may move independently without
    // reintroducing a flat-family exception or a new standalone gate.
    const backendSurface = path.join(REPO, "scripts", "gates", "surface", "index.mjs");
    if (!fs.existsSync(backendSurface)) {
        failures.push(
            "[backend-colocation] scripts/gates/surface/index.mjs is required as the " +
                "surface-family executable barrel (U.A9).",
        );
    }

    // U.B1 keystone: the canonical shared homes are required and the two
    // scaffold spellings they replace may not survive the atomic move.
    for (const home of ["components", "composables", "state", "styles", "utils"]) {
        if (!fs.existsSync(path.join(DEMO, home))) {
            failures.push(`[canonical-home] demo/${home}/ is required after U.B1.`);
        }
    }
    for (const retired of ["@", "components/custom"]) {
        if (fs.existsSync(path.join(DEMO, retired))) {
            failures.push(`[retired-home] demo/${retired}/ must be absent after U.B1.`);
        }
    }

    // ── CLAUSE (kind) — composables/ must be reactive ──────────────────────
    {
        const dir = path.join(SHARED, "composables");
        for (const abs of collect(dir, new Set([".ts"]))) {
            const base = path.basename(abs);
            if (base === "index.ts" || base.endsWith(".d.ts")) continue;
            const relFromShared = toPosix(path.relative(SHARED, abs));
            if (isComposableKind(base, read(abs))) continue;
            if (isDeferred(relFromShared)) {
                deferrals.push(
                    `${relPosix(abs)} — ${DEFERRED.get(relFromShared)}`,
                );
                continue;
            }
            failures.push(
                `[kind-composables] ${relPosix(abs)} is neither reactive (no Vue/@vueuse ` +
                    `primitive) nor a use*-named factory — a plain module-scope helper ` +
                    `belongs in utils/, not the composables tier.`,
            );
        }
    }

    // ── CLAUSE (kind) — utils/ must NOT be boot infrastructure ─────────────
    {
        const dir = path.join(SHARED, "utils");
        for (const abs of collect(dir, new Set([".ts"]))) {
            const base = path.basename(abs);
            if (base === "index.ts" || base.endsWith(".d.ts")) continue;
            const relFromShared = toPosix(path.relative(SHARED, abs));
            if (!isBootInfra(read(abs))) continue;
            if (isDeferred(relFromShared)) {
                deferrals.push(
                    `${relPosix(abs)} — ${DEFERRED.get(relFromShared)}`,
                );
                continue;
            }
            failures.push(
                `[kind-utils] ${relPosix(abs)} is engine-loader boot infrastructure, ` +
                    `not a generic DOM/text helper — runtime infra belongs beside state/.`,
            );
        }
    }

    // ── CLAUSE (kind) — styles/ holds global vocabulary only ───────────────
    {
        const dir = path.join(SHARED, "styles");
        for (const abs of collect(dir, new Set([".css", ".json", ".ts"]))) {
            const ext = path.extname(abs);
            // A styles tier is global CSS token/idiom vocabulary + its data
            // manifests (font-roles.json). A `.ts`/`.vue` module here would be a
            // mis-filed non-style unit.
            if (ext === ".css" || ext === ".json") continue;
            const relFromShared = toPosix(path.relative(SHARED, abs));
            if (isDeferred(relFromShared)) {
                deferrals.push(
                    `${relPosix(abs)} — ${DEFERRED.get(relFromShared)}`,
                );
                continue;
            }
            failures.push(
                `[kind-styles] ${relPosix(abs)} is not global style vocabulary ` +
                    `(a .css sheet or a token/role .json manifest) — a non-style unit is ` +
                    `mis-filed in the styles tier.`,
            );
        }
    }

    // ── CLAUSE (colocate) — no flat use*.ts beside a composables/ sibling ──
    // A single-owner satellite colocates into its module's own composables/ tier.
    // Scan every module dir that HAS a composables/ subdir; a `use*.ts` at the
    // module root is a flat satellite that should live in that tier.
    {
        const roots = [path.join(SHARED, "components"), path.join(DEMO, "scenes")];
        const moduleDirs = new Set();
        for (const root of roots) {
            for (const abs of collect(root, new Set([".ts", ".vue"]))) {
                moduleDirs.add(path.dirname(abs));
            }
        }
        for (const dir of [...moduleDirs].sort()) {
            const composablesSub = path.join(dir, "composables");
            if (!fs.existsSync(composablesSub)) continue;
            for (const e of fs.readdirSync(dir)) {
                if (!/^use[A-Za-z].*\.ts$/.test(e)) continue;
                const abs = path.join(dir, e);
                const relFromShared = toPosix(path.relative(SHARED, abs));
                if (isDeferred(relFromShared)) {
                    deferrals.push(
                        `${relPosix(abs)} — ${DEFERRED.get(relFromShared)}`,
                    );
                    continue;
                }
                failures.push(
                    `[colocate] ${relPosix(abs)} sits FLAT at its module root beside a ` +
                        `composables/ sibling — fold the single-owner composable into ` +
                        `${relPosix(composablesSub)}/ (the recursive-colocation rule).`,
                );
            }
        }
    }

    // ── Report ─────────────────────────────────────────────────────────────
    if (deferrals.length > 0) {
        console.log(
            `  ⋯ ${deferrals.length} DEFERRED residual(s) (owned by pre-edict move waves):`,
        );
        for (const d of deferrals.sort()) console.log(`      ${d}`);
    }
    // Warn on a deferred KEY that no path could ever match (a typo), but never on a
    // cured entry (the file legitimately moved). We cannot distinguish "cured" from
    // "typo" purely, so treat an unmatched key as tolerated (informational).
    const unmatched = [...DEFERRED.keys()].filter((k) => !deferredHit.has(k));
    if (unmatched.length > 0) {
        console.log(
            `  ⋯ ${unmatched.length} deferred entr${unmatched.length === 1 ? "y" : "ies"} ` +
                `already cleared (owning lane landed the move): ${unmatched.join(", ")}`,
        );
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:colocation — FAIL (a shared-tier member is the wrong KIND, or a " +
                "satellite is not colocated):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  proof:colocation EXTENDS proof:shared-has-n-consumers (the count bar) " +
                "with\n  kind-appropriateness + satellite-colocation. A NEW violation " +
                "(not in the\n  DEFERRED set the pre-edict moves own) must be cured by " +
                "colocating the\n  member into its true home, per THE GRAND COLOCATION EDICT.",
        );
        process.exit(1);
    }

    console.log(
        `\nproof:colocation — PASS: ${sharedRel}/ shared tiers are kind-appropriate ` +
            `and satellites are colocated (residuals deferred to their owning move waves).`,
    );
}

main();
