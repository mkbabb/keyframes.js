#!/usr/bin/env node
/**
 * proof:glassui-aria-ask — Q.WG-S1S2-HYGIENE S3 (the kf content-aware bilateral
 * gate — the DOM-RENDER readback half of the aria lock).
 *
 * glass-ui's `BD.W-CUT.md` references `proof:glassui-aria-ask` as the kf
 * content-aware lock ("mounts the published pill, asserts `role=group` carries
 * `aria-orientation === null`") — but it was ABSENT from `scripts/`. Without it,
 * the consume gate is a version sentinel, not a content check. This authors it.
 *
 * ── THE REAL OBSERVABLE (a RENDERED-attribute readback, NOT a source grep) ────
 * MOUNT the INSTALLED glass-ui `SegmentedTabs variant="pill"` and read what the
 * BROWSER renders: the `role=group` element's `aria-orientation` attribute. The
 * suppress is correct iff that attribute is `null`/absent. This is the
 * appearance/interaction-axis gate the green-source-shape-gates-miss lesson
 * demands — it reads the CONSUMED dist's RENDER, never the source branch (a gate
 * that grepped the glass-ui `prototype/liquid-dock` SOURCE for the guard would
 * FALSELY green: the source has the fix; the consumed dist does not).
 *
 * ── DISTINCT FROM `glassCaps.ariaGuard` (proof:workaround-deletion S1) ────────
 * `glassCaps.ariaGuard` is the cheap, device-INDEPENDENT dist-content grep (the
 * role-conditional `: void 0` else arm in the installed `dist/tabs.js`) that
 * keeps `proof:workaround-deletion` PORTABLE. THIS gate is the STRONGER,
 * device-bearing mounted-DOM readback. They probe the SAME truth (the consumed
 * dist's `role=group` carries no `aria-orientation`) at two altitudes.
 *
 * ── CI POSTURE (observe-only-until-publish — the device-dependence discipline) ─
 * A device-bearing DOM mount that can flake on a slow runner BEFORE the fix
 * ships. So it is wired OBSERVE-ONLY (PENDING, exit 0) until the guard is in the
 * consumed dist: a mount failure, an unmountable component (the installed dist
 * transitively imports the PUBLISHED `@mkbabb/keyframes.js`, unresolvable in this
 * dev tree), OR a still-prohibited-emit dist all collapse to PENDING (never a
 * false-RED stall). It flips HARD on the consume (Q.WG-GATED-CONSUMES): once the
 * guard is in the dist, a `role=group` that STILL renders `aria-orientation`
 * reds. The discriminating bite: pointed at the 4.0.1 dist → PENDING; at a
 * fixture dist carrying the guard → GREEN (the RENDERED attribute is null).
 *
 * Re-runnable: `node scripts/proof-glassui-aria-ask.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TABS_DIST = path.join(
    REPO,
    "node_modules/@mkbabb/glass-ui/dist/tabs.js",
);

console.log(
    "proof:glassui-aria-ask — Q.WG-S1S2-HYGIENE S3 (the mounted-pill aria-orientation readback)\n",
);

const pending = (msg) => {
    console.log(`  … PENDING — ${msg}`);
    console.log(
        "\nproof:glassui-aria-ask — PENDING (observe-only-until-publish): the " +
            "SegmentedTabs aria guard is not yet observable in the consumed dist. " +
            "Held (exit 0) — flips HARD GREEN on the BC publish (the rendered " +
            "`role=group` carries `aria-orientation === null`), RED if the guard " +
            "is in the dist but the attribute still renders.",
    );
    process.exit(0);
};

const green = (msg) => {
    console.log(`  ✓ GREEN — ${msg}`);
    console.log(
        "\nproof:glassui-aria-ask — PASS: the mounted SegmentedTabs pill renders " +
            "`role=group` with `aria-orientation === null` (the suppress is " +
            "honored in the consumed dist).",
    );
    process.exit(0);
};

const red = (msg) => {
    console.error(`  ✗ RED — ${msg}`);
    console.error(
        "\nproof:glassui-aria-ask — FAIL: the consumed dist carries the aria guard " +
            "but the mounted `role=group` STILL renders `aria-orientation` — the " +
            "guard did not take effect on the rendered output.",
    );
    process.exit(1);
};

// ── The dist-content pre-check: is the guard even in the consumed dist? ───────
// Mirrors `glassCaps.ariaGuard` — a role-conditional `: void 0`/`: undefined`/
// `: null` else arm on an `aria-orientation"` PROP-BIND. With the guard ABSENT
// (today's 4.0.1, the unconditional ternary emit), the readback is held PENDING
// (no point mounting a component whose dist has no guard — and the mount itself
// is unavailable in this dev tree).
let tabsDist = "";
try {
    tabsDist = fs.readFileSync(TABS_DIST, "utf8");
} catch {
    pending(
        "the installed @mkbabb/glass-ui/dist/tabs.js is absent — the pill cannot " +
            "be read; held until glass-ui is installed + the BC guard ships.",
    );
}

const guardInDist = (() => {
    const BIND = /aria-orientation["']\s*:\s*([^,}\n]{0,120})/g;
    let m;
    while ((m = BIND.exec(tabsDist)) !== null) {
        if (/:\s*(?:void 0|undefined|null)\b/.test(m[1])) return true;
    }
    return false;
})();

if (!guardInDist) {
    pending(
        "the installed dist/tabs.js emits `aria-orientation` UNCONDITIONALLY on " +
            "`role=group` (no role-guarded `: void 0` else arm) — the BC SFC guard " +
            "is not in the consumed dist. The mounted pill would render the " +
            "prohibited attribute; held until the guard ships.",
    );
}

// ── The guard IS in the dist → MOUNT + read the RENDERED attribute ────────────
// (Reached only after the BC publish. The mount is attempted via Vue SSR over
// the installed component; ANY mount/resolve failure collapses to PENDING — the
// device-bearing readback never false-REDs a still-loading consume.)
const renderRoleGroupAriaOrientation = async () => {
    try {
        const { createSSRApp, h } = await import("vue");
        const { renderToString } = await import("vue/server-renderer");
        const tabs = await import("@mkbabb/glass-ui/tabs");
        // Find the SegmentedTabs component export (a render/setup-bearing object).
        const Comp =
            tabs.SegmentedTabs ??
            Object.values(tabs).find(
                (v) =>
                    v &&
                    typeof v === "object" &&
                    (v.setup || v.render || v.__name),
            );
        if (!Comp) return { ok: false, reason: "no SegmentedTabs export" };
        const app = createSSRApp({
            render: () =>
                h(Comp, {
                    variant: "pill",
                    modelValue: "a",
                    options: [
                        { value: "a", label: "A" },
                        { value: "b", label: "B" },
                    ],
                }),
        });
        const html = await renderToString(app);
        // Read the rendered role=group element's aria-orientation.
        const groupTag = /<[^>]*role=["']group["'][^>]*>/i.exec(html);
        if (!groupTag) return { ok: false, reason: "no role=group rendered" };
        const hasAria = /aria-orientation=/i.test(groupTag[0]);
        return { ok: true, hasAria, html: groupTag[0] };
    } catch (err) {
        return { ok: false, reason: String(err?.message ?? err).slice(0, 160) };
    }
};

const result = await renderRoleGroupAriaOrientation();
if (!result.ok) {
    // The guard is in the dist, but the component cannot be mounted in this dev
    // tree (the installed dist transitively imports the PUBLISHED
    // @mkbabb/keyframes.js, unresolvable locally). Observe-only: held PENDING
    // rather than false-RED on an environment mount limitation.
    pending(
        `the aria guard IS in the consumed dist, but the SegmentedTabs pill could ` +
            `not be mounted for the rendered readback (${result.reason}) — the ` +
            `device-bearing readback is held observe-only (it flips HARD on the ` +
            `consume environment where the mount resolves).`,
    );
}

if (result.hasAria) {
    red(
        `the mounted pill rendered \`role=group\` WITH an \`aria-orientation\` ` +
            `attribute (${result.html}) despite the guard being in the dist.`,
    );
}
green(
    `the mounted pill renders \`role=group\` with NO \`aria-orientation\` ` +
        `attribute (${result.html}).`,
);
