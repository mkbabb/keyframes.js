#!/usr/bin/env node
/**
 * proof:no-single-option-select — RE-CHARTERED at T.C1 + T.B5-RENDER.
 *
 * THE RE-CHARTER (charter §0.1 "a gate enforces the rejected UI"; VERDICT #17). The
 * L.W4 doctrine was "a single-option select ⇒ a STATIC LABEL" — and the STATIC LABEL
 * was exactly the owner-rejected `∿ Spring │ ∿ Spring` duplication (#17: the sole
 * control surface's label demoted beside the scene identity it already reads). This
 * gate USED to ENFORCE that rejected state (it verified the count-guard while the
 * else-branch drew the dup). T.B5-RENDER + T.C1 flip the doctrine:
 *
 *     single/zero option ⇒ NOTHING — no node, no flanking separator (the ELISION).
 *
 * So the re-chartered teeth are TWO clauses per scene-driven select:
 *   (1) COUNT-GUARD PRESENT — the `<Select>` renders ONLY when its option count is
 *       `> 1` (via the zone kind bound to `> 1`, or a direct `.length > 1` v-if);
 *       AND
 *   (2) NO STATIC-LABEL FALLBACK — the demoted single-option static label is GONE
 *       (ChromeDock's `dock-static-label`/`soleControlTab`; TransportDock's
 *       single-animation `v-else` name span). A regression that RESURRECTS the
 *       static label (the rejected dup) reds.
 *
 * The count authority is T.B5's DFA projection (dockCardinality in controlSurfaceDFA.ts; when
 * T.B5's DFA projection lands, repoint this check at `@state`). Clause (3) asserts
 * that model binds `> 1` — a rewrite admitting a 1-option zone reds.
 *
 * STATIC (no browser). Re-runnable: `node scripts/proof-no-single-option-select.mjs`.
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

/** Strip HTML comments + // and block JS comments so a rule named only in prose
 *  never counts as live markup/code. */
function stripComments(src) {
    return src
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1);
}

console.log(
    "proof:no-single-option-select — RE-CHARTERED (single ⇒ NOTHING; the #17 static-label dup is DELETED)",
);

// ── (0) The zone model binds `> 1` (T.B5's DFA projection — dockCardinality) ─
{
    const file = path.join(DEMO, "@/state/controlSurfaceDFA.ts");
    if (!fs.existsSync(file)) {
        fail(
            `(0) the DFA cardinality model not found at ${path.relative(REPO, file)} — the ` +
                "cardinality model moved (T.B5 landed?); repoint the count-guard check.",
        );
    } else {
        const src = stripComments(read(file));
        const controlGuard = /tabs\.length\s*>\s*1/.test(src);
        const channelGuard = /channels\.length\s*>\s*1/.test(src);
        if (controlGuard && channelGuard) {
            ok(
                "(0) the dock-zone model binds BOTH zones to `> 1` (controlZone: tabCount > 1, " +
                    "channelZone: channels.length > 1) — a 1-option zone resolves ABSENT, never a select.",
            );
        } else {
            fail(
                "(0) the DFA cardinality model does NOT bind both zones to a `> 1` " +
                    `count (controlZone tabs.length>1: ${controlGuard}, channelZone channels.length>1: ` +
                    `${channelGuard}) — a rewrite admitting a 1-option zone would render a dead dropdown.`,
            );
        }
    }
}

// ── (A) The ANIMATION select (TransportDock.vue) ─────────────────────────────
{
    const file = path.join(
        DEMO,
        "@/components/custom/instrument/transport/TransportDock.vue",
    );
    if (!fs.existsSync(file)) {
        fail(`(A) TransportDock.vue not found at ${path.relative(REPO, file)}.`);
    } else {
        const src = stripComments(read(file));
        // Count-guard: the select is governed by the channel zone kind, derived
        // from T.B5's DFA projection (dockCardinality over the channel names).
        const zoneDerive =
            /dockCardinality\(\{[^}]*channels:\s*animationNames/.test(src);
        const zoneGuard = /channelZoneKind\s*===\s*['"]select['"]/.test(src);
        // Legacy direct guard (accepted too, for forward parity).
        const legacyGuard = /v-if\s*=\s*"\s*animationNames\.length\s*>\s*1\s*"/.test(
            src,
        );
        if ((zoneDerive && zoneGuard) || legacyGuard) {
            ok(
                "(A) the animation <Select> renders ONLY under the channel count-guard " +
                    "(channelZoneKind === 'select', derived from dockCardinality(channels).channelZone).",
            );
        } else {
            fail(
                "(A) the animation <Select> in TransportDock.vue is NOT count-guarded — " +
                    "no `channelZoneKind === 'select'` (from dockCardinality over the channel names) " +
                    "and no legacy `v-if=\"animationNames.length > 1\"`. A lone-option dropdown could render.",
            );
        }
        // No static-label fallback: the single-animation `v-else` name span is gone.
        // Exclude the #collapsed template (its pill legitimately shows the name).
        const collapsedAt = src.indexOf("#collapsed");
        const expanded = collapsedAt === -1 ? src : src.slice(0, collapsedAt);
        const staticSpan =
            /v-else[\s\S]{0,80}?{{\s*storedControls\.selectedAnimation\s*}}/.test(
                expanded,
            );
        if (!staticSpan) {
            ok(
                "(A) NO single-animation static-label fallback in the expanded transport " +
                    "(the #17 demoted name span is DELETED — single/zero channel ⇒ NOTHING).",
            );
        } else {
            fail(
                "(A) a single-animation STATIC name span (v-else → storedControls.selectedAnimation) " +
                    "survives in the expanded transport — the rejected #17 dup. The re-charter forbids it: " +
                    "single ⇒ NOTHING.",
            );
        }
    }
}

// ── (B) The CONTROL-TAB select (ChromeDock.vue) ──────────────────────────────
{
    const file = path.join(DEMO, "app/dock/ChromeDock.vue");
    if (!fs.existsSync(file)) {
        fail(`(B) ChromeDock.vue not found at ${path.relative(REPO, file)}.`);
    } else {
        const src = stripComments(read(file));
        // Count-guard: v-if="multipleControlTabs" + multipleControlTabs = computed(...length > 1).
        const guardName = /v-if\s*=\s*"\s*multipleControlTabs\s*"/.test(src);
        const countDef =
            /const\s+multipleControlTabs\s*=\s*computed\(\s*\(\)\s*=>\s*[A-Za-z0-9_.]*\.length\s*>\s*1\s*\)/.test(
                src,
            );
        if (guardName && countDef) {
            ok(
                "(B) the control-tab <Select> renders ONLY when multipleControlTabs " +
                    "(= allControlTabs.length > 1) — a single-surface scene shows NOTHING.",
            );
        } else {
            fail(
                "(B) the control-tab <Select> in ChromeDock.vue is not count-guarded by " +
                    `\`v-if="multipleControlTabs"\` (present: ${guardName}) bound to a ` +
                    `\`computed(() => ...length > 1)\` (present: ${countDef}).`,
            );
        }
        // No static-label fallback: the K.W4 single-surface static label is DELETED.
        const staticLabel =
            /dock-static-label/.test(src) || /soleControlTab/.test(src);
        if (!staticLabel) {
            ok(
                "(B) NO single-surface static-label fallback in ChromeDock (the K.W4 " +
                    "`dock-static-label`/`soleControlTab` branch is DELETED — single surface ⇒ NOTHING).",
            );
        } else {
            fail(
                "(B) a single-surface STATIC label (dock-static-label / soleControlTab) survives " +
                    "in ChromeDock — the rejected #17 dup. The re-charter forbids it: single ⇒ NOTHING.",
            );
        }
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:no-single-option-select — FAIL (${failures.length}): a scene-driven ` +
            "<Select> is either not count-guarded, or a demoted single-option STATIC label " +
            "(the owner-rejected #17 dup) survives. Re-charter: single/zero option ⇒ NOTHING.",
    );
    process.exit(1);
}
console.log(
    "\nproof:no-single-option-select — PASS: every scene-driven <Select> (animation, " +
        "control-tab) renders ONLY when its option count > 1; the single/zero-option case " +
        "renders NOTHING — no node, no separator, no demoted static label (the elision).",
);
