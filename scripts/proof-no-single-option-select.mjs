#!/usr/bin/env node
/**
 * proof:no-single-option-select — L.W4 S5 (the audit's W2: U4's "a lone-option
 * dropdown does NOT render" rule is a SHIPPED product behaviour with no gate).
 *
 * THE PRODUCT RULE (J.W7c U4, FINAL.md:325). A `<Select>` whose option set can
 * collapse to a SINGLE item must NOT render a dead 1-item dropdown — a chevron
 * that opens onto the value the trigger already shows. The shipped behaviour is
 * the COUNT GUARD: the select renders ONLY when there is MORE THAN ONE thing to
 * choose between (`length > 1`); the single-item case renders a STATIC label
 * instead. Two scene-driven dropdowns carry option arrays that genuinely
 * collapse to length-1 on real scenes:
 *
 *   (A) the ANIMATION select (TransportDock.vue) — single-animation scenes
 *       (spring/sequence/motion-path: one contractAnim each) collapse
 *       `animationNames` to length 1; the guard is `v-if="animationNames.length
 *       > 1"`, the else-branch is the lone animation's NAME as a static label.
 *
 *   (B) the CONTROL-TAB select (ChromeDock.vue) — single-surface scenes
 *       (easing → ['easing'], spring → ['spring']) collapse the control-tab list
 *       to length 1; the guard is `v-if="multipleControlTabs"` where
 *       `multipleControlTabs = allControlTabs.value.length > 1`, the else-branch
 *       is the lone tab's STATIC label.
 *
 * THE GATE (STATIC — no browser; runs in the glass-ui-free library `gates` job).
 * It reads the demo Vue SFC source tree and asserts, for each U4-class select,
 * that its rendering is guarded by a `length > 1` count-guard (or a computed
 * that IS such a guard). A future regression — a component re-rendering one of
 * these dropdowns UNCONDITIONALLY (the count-guard deleted) — reds.
 *
 * WHY NOT "every <Select> in demo/ must be guarded": that over-broad rule is
 * WRONG. Most demo selects iterate STATIC catalogs that never collapse to one:
 * the easing catalog (EasingSelect — dozens of EASING_GROUPS items), the scene
 * switcher (ChromeDock — home + 8 scenes, never 1), the CSS jump-term picker
 * (TimingFunctionPanel — 4 fixed terms), the view-mode picker (EasingTarget —
 * "singular" + every family). Forcing a count-guard onto a never-single select
 * would be dead code the U4 rule does not call for. The U4 rule targets exactly
 * the dropdowns whose option array is SCENE-DRIVEN and can be length 1 — this
 * gate gates those by name + verifies the guard is present + structurally bound
 * to the option array's length.
 *
 * BITE: delete the `v-if="animationNames.length > 1"` guard on the animation
 * select (rendering it unconditionally), or rewrite `multipleControlTabs` to a
 * non-count predicate that admits a 1-tab scene → reds. Re-runnable:
 * `node scripts/proof-no-single-option-select.mjs`. No build, no browser.
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

/** Strip HTML comments + // and /* *​/ JS comments so a rule named only in prose
 *  never counts as live markup/code. */
function stripComments(src) {
    return src
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1);
}

/** The opening tag of the FIRST root `<Select` whose attribute span mentions
 *  `anchor` — returns the raw open-tag text, or null. The open tag runs from
 *  `<Select` to the `>` that closes the START tag, SKIPPING any `>` inside a
 *  quoted attribute value (a `(key) => {...}` arrow handler carries a literal
 *  `>` that is NOT the tag close). */
function selectOpenTagMentioning(src, anchor) {
    let i = 0;
    while ((i = src.indexOf("<Select", i)) !== -1) {
        // Skip <SelectContent>, <SelectItem>, <SelectTrigger>, etc. — only the
        // bare <Select (followed by whitespace or >) is the root component.
        const after = src[i + "<Select".length];
        if (after && /[A-Za-z]/.test(after)) {
            i += "<Select".length;
            continue;
        }
        // Walk to the start-tag close, respecting quoted attribute values.
        let quote = null;
        let end = -1;
        for (let k = i; k < src.length; k++) {
            const ch = src[k];
            if (quote) {
                if (ch === quote) quote = null;
            } else if (ch === '"' || ch === "'") {
                quote = ch;
            } else if (ch === ">") {
                end = k;
                break;
            }
        }
        if (end === -1) break;
        const openTag = src.slice(i, end + 1);
        if (openTag.includes(anchor)) return openTag;
        i = end + 1;
    }
    return null;
}

console.log(
    "proof:no-single-option-select — L.W4 S5 (the U4 lone-option count-guard is live in every scene-driven select)",
);

// ── (A) The ANIMATION select (TransportDock.vue) ─────────────────────────────
{
    const file = path.join(
        DEMO,
        "@/components/custom/animation-transport/TransportDock.vue",
    );
    if (!fs.existsSync(file)) {
        fail(
            `(A) TransportDock.vue not found at ${path.relative(REPO, file)} — ` +
                "the animation-select host moved; re-ground the gate.",
        );
    } else {
        const src = stripComments(read(file));
        // The animation select is the <Select whose trigger is the "Select
        // animation" dock control (aria-label inside its content). The root
        // <Select open tag must carry a v-if count-guard over animationNames.
        const openTag = selectOpenTagMentioning(src, "selectAnimation");
        if (!openTag) {
            fail(
                "(A) could not locate the animation <Select> in TransportDock.vue " +
                    "(no <Select> whose open tag emits 'selectAnimation') — the host shape changed.",
            );
        } else {
            // The count guard: v-if on animationNames.length > 1 (the U4 form).
            // Accept any `> 1` length comparison over the animation-name array so
            // a refactor of the array's identifier (e.g. a computed alias) still
            // greens as long as it is a strict-greater-than-one count guard.
            const guard = /v-if\s*=\s*"\s*[A-Za-z0-9_.]*[Nn]ames?\.length\s*>\s*1\s*"/;
            if (guard.test(openTag)) {
                ok(
                    "(A) the animation <Select> renders ONLY when animationNames.length > 1 " +
                        "(single-animation scenes show a static label, not a dead 1-item dropdown — U4).",
                );
            } else {
                fail(
                    "(A) the animation <Select> in TransportDock.vue is NOT guarded by a " +
                        '`v-if="...Names.length > 1"` count-guard — U4 forbids a lone-option ' +
                        `dropdown rendering unconditionally. Open tag: ${openTag.replace(/\s+/g, " ").trim()}`,
                );
            }
        }
    }
}

// ── (B) The CONTROL-TAB select (ChromeDock.vue) ──────────────────────────────
{
    const file = path.join(DEMO, "app/chrome/ChromeDock.vue");
    if (!fs.existsSync(file)) {
        fail(
            `(B) ChromeDock.vue not found at ${path.relative(REPO, file)} — ` +
                "the control-tab select host moved; re-ground the gate.",
        );
    } else {
        const src = stripComments(read(file));
        // The control-tab select is the <Select whose open tag emits the
        // 'updateSelectedControl' event. It must be v-if-guarded on the
        // `multipleControlTabs` count predicate.
        const openTag = selectOpenTagMentioning(src, "updateSelectedControl");
        if (!openTag) {
            fail(
                "(B) could not locate the control-tab <Select> in ChromeDock.vue " +
                    "(no <Select> whose open tag emits 'updateSelectedControl') — the host shape changed.",
            );
        } else {
            const guardName = /v-if\s*=\s*"\s*multipleControlTabs\s*"/;
            if (!guardName.test(openTag)) {
                fail(
                    "(B) the control-tab <Select> in ChromeDock.vue is NOT guarded by " +
                        '`v-if="multipleControlTabs"` — U4 forbids a 1-tab scene rendering a ' +
                        `dead dropdown. Open tag: ${openTag.replace(/\s+/g, " ").trim()}`,
                );
            } else {
                // The guard NAME is present — now bind it to a `> 1` count so a
                // future rewrite of `multipleControlTabs` to a non-count predicate
                // (admitting a 1-tab scene) reds. The computed must be a strict
                // `.length > 1`.
                const countDef =
                    /const\s+multipleControlTabs\s*=\s*computed\(\s*\(\)\s*=>\s*[A-Za-z0-9_.]*\.length\s*>\s*1\s*\)/;
                if (countDef.test(src)) {
                    ok(
                        "(B) the control-tab <Select> renders ONLY when multipleControlTabs " +
                            "(= allControlTabs.length > 1); single-surface scenes show a static label (U4).",
                    );
                } else {
                    fail(
                        "(B) `multipleControlTabs` is the v-if guard but is NOT defined as a " +
                            "`computed(() => ...length > 1)` count predicate — a non-count rewrite " +
                            "could admit a 1-tab scene's dead dropdown. Bind the guard to the option count.",
                    );
                }
            }
        }
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:no-single-option-select — FAIL (${failures.length}): a scene-driven ` +
            "<Select> can render a lone-option dropdown unconditionally (the U4 count-guard " +
            "is missing or unbound from the option count — J.W7c U4 regressed).",
    );
    process.exit(1);
}
console.log(
    "\nproof:no-single-option-select — PASS: every scene-driven <Select> (animation, " +
        "control-tab) renders ONLY when its option count > 1; the lone-option case is a " +
        "static label, not a dead 1-item dropdown (U4 totality, by construction).",
);
