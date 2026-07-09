#!/usr/bin/env node
/**
 * proof:scene-superkey-single-source — BORN-RED (T.B9). The ONE keyspace.
 *
 * Before T.B9 a scene carried TWO independently-declared per-scene keyspaces with
 * no mechanical link: the scene machine keyed `perScene` by the registry `SceneId`
 * ("cube"); the sibling option stores keyed by a SECOND constant per scene — a
 * divergent PascalCase super-key ("Cube"), diverging in CASE for every scene and
 * TOTALLY for one (compose → "playground"). Only one keyspace self-healed, so a
 * retired/renamed scene's super-key bucket orphaned in localStorage until the blunt
 * whole-store TTL.
 *
 * T.B9 collapses the two: the `*_SUPER_KEY` constants DIE; the stores key on the
 * registry `SceneId` directly; one gc/migrate sweep prunes+migrates ALL THREE
 * per-scene tables. This gate is the standing enforcement:
 *
 *   (1) NO `*_SUPER_KEY` (or bare `SUPER_KEY`) identifier survives in demo source
 *       (comments stripped) — the retired keyspace is gone, not merely unused.
 *   (2) each scene's keys module single-sources a lowercase `*_SCENE_ID` whose
 *       value is a live registry id (the machine + both stores key by it).
 *   (3) the option-store getters accept a `SceneId` (the type says the store keys
 *       by the registry id, not a free string super-key).
 *   (4) the three-table gc/migrate sweep exists (`gcAndMigrateSceneKeyspace`) and
 *       is called at boot beside the machine — no table can drift its keyspace.
 *
 * STATIC (no browser). Re-runnable: `node scripts/proof-scene-superkey-single-source.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

/** Strip HTML + block + line comments so a token named only in prose never counts
 *  as a live declaration/usage. */
function stripComments(src) {
    return src
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1);
}

/** Recursively collect .ts/.vue files under a dir (skip node_modules/dist). */
function walk(dir, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === "node_modules" || ent.name === "dist") continue;
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p, out);
        else if (/\.(ts|vue)$/.test(ent.name)) out.push(p);
    }
    return out;
}

console.log(
    "proof:scene-superkey-single-source — the ONE keyspace (T.B9): stores key by the registry SceneId",
);

// ── (1) NO *_SUPER_KEY / SUPER_KEY identifier survives (comments stripped) ────
{
    const offenders = [];
    for (const file of walk(DEMO)) {
        const src = stripComments(read(file));
        // A screaming-snake SUPER_KEY identifier (declaration OR usage): the
        // retired keyspace. The camelCase `superKey` (the library animation field
        // + prop) is INTENTIONALLY untouched — it now carries the SceneId.
        const m = src.match(/\b[A-Z][A-Z0-9]*_SUPER_KEY\b|\bSUPER_KEY\b/);
        if (m) offenders.push(`${path.relative(REPO, file)} (${m[0]})`);
    }
    if (offenders.length === 0) {
        ok(
            "(1) NO screaming-snake `*_SUPER_KEY`/`SUPER_KEY` identifier in demo source — " +
                "the divergent PascalCase keyspace is retired (the camelCase `superKey` field survives).",
        );
    } else {
        fail(
            `(1) a retired super-key identifier survives in ${offenders.length} file(s): ` +
                offenders.slice(0, 8).join(", ") +
                " — collapse it onto the registry SceneId (`*_SCENE_ID`).",
        );
    }
}

// ── (2) each keys module single-sources a lowercase *_SCENE_ID (a live id) ────
{
    const keysModules = [
        "scenes/cube/cubeKeys.ts",
        "scenes/amiga/amigaKeys.ts",
        "scenes/square/squareKeys.ts",
        "scenes/easing/easingKeys.ts",
        "scenes/spring/springKeys.ts",
        "scenes/sequence/sequenceKeys.ts",
    ];
    for (const rel of keysModules) {
        const file = path.join(DEMO, rel);
        if (!fs.existsSync(file)) {
            fail(`(2) keys module not found: ${rel}`);
            continue;
        }
        const src = stripComments(read(file));
        const m = src.match(
            /export\s+const\s+[A-Z][A-Z0-9]*_SCENE_ID\s*=\s*["'`]([a-z][a-z0-9-]*)["'`]/,
        );
        if (m) {
            ok(`(2) ${rel} single-sources SCENE_ID "${m[1]}" (lowercase registry id).`);
        } else {
            fail(
                `(2) ${rel} does NOT export a lowercase \`*_SCENE_ID\` constant — ` +
                    "the scene's ONE identity must live here (the registry + stores key by it).",
            );
        }
    }
}

// ── (3) the option-store getters accept a SceneId (not a free string) ─────────
{
    const stores = [
        {
            rel: "@/state/controlOptionsStore.ts",
            getter: "getStoredAnimationGroupControlOptions",
        },
        {
            rel: "@/state/animationOptionsStore.ts",
            getter: "getStoredAnimationOptions",
        },
    ];
    for (const { rel, getter } of stores) {
        const file = path.join(DEMO, rel);
        if (!fs.existsSync(file)) {
            fail(`(3) store not found: ${rel}`);
            continue;
        }
        const src = read(file);
        // The store getter's super-key param must be typed with `SceneId` (the ONE
        // keyspace: the store accepts only a registry id, never a free super-key).
        const typedSceneId = /\|\s*SceneId\b/.test(src) && src.includes(getter);
        if (typedSceneId) {
            ok(`(3) ${rel}: ${getter} keys by a \`SceneId\` (the registry keyspace).`);
        } else {
            fail(
                `(3) ${rel}: ${getter} does NOT type its store key as \`SceneId\` — ` +
                    "the store must accept only a registry id, not a free super-key string.",
            );
        }
    }
}

// ── (4) the three-table gc/migrate sweep exists + is called at boot ───────────
{
    const barrel = path.join(DEMO, "@/state/index.ts");
    const routerBind = path.join(DEMO, "app/scene/useSceneMachineRouterBinding.ts");
    const barrelSrc = fs.existsSync(barrel) ? stripComments(read(barrel)) : "";
    const routerSrc = fs.existsSync(routerBind)
        ? stripComments(read(routerBind))
        : "";
    const defined = /export const gcAndMigrateSceneKeyspace\s*=/.test(barrelSrc);
    // The sweep must touch all THREE tables (the machine perScene + both stores).
    const touchesAll =
        /gcOrphans\(/.test(barrelSrc) &&
        /_gcAndMigrateAnimationGroupsOptionsStore\(/.test(barrelSrc) &&
        /_gcAndMigrateAnimationGroupsControlOptionsStore\(/.test(barrelSrc);
    const calledAtBoot = /gcAndMigrateSceneKeyspace\(/.test(routerSrc);
    if (defined && touchesAll && calledAtBoot) {
        ok(
            "(4) `gcAndMigrateSceneKeyspace` sweeps ALL THREE per-scene tables (machine perScene " +
                "+ both option stores) and is called at boot from the router binding.",
        );
    } else {
        fail(
            `(4) the three-table gc/migrate sweep is incomplete (defined: ${defined}, ` +
                `touches all three tables: ${touchesAll}, called at boot: ${calledAtBoot}).`,
        );
    }
}

// ── Verdict ───────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:scene-superkey-single-source — FAIL (${failures.length}): the two-keyspace ` +
            "drift is not fully collapsed (a `*_SUPER_KEY` survives, a keys module omits its " +
            "`*_SCENE_ID`, a store keys by a free string, or the three-table sweep is incomplete).",
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-superkey-single-source — PASS: one keyspace. The `*_SUPER_KEY` constants are " +
        "retired; each scene single-sources its lowercase `*_SCENE_ID`; both option stores key by " +
        "a `SceneId`; and one gc/migrate sweep keeps all three per-scene tables on the registry id.",
);
