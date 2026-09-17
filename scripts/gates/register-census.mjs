#!/usr/bin/env node
/**
 * SERVED MODEL: claude-opus-5[1m]
 *
 * register-census — the RENDERED register/font census (G-KFW4-10, X.KF.W4
 * unit `.d`), re-authored so the gate can see what the old selector contract
 * could not.
 *
 * R-3's FOLD (KF-AT-24's binary, DECIDED): `demo/styles/font-roles.json` is
 * the gate's INPUT, not a second parallel runner, and it is the ONE home of
 * the private AnimatedText class strings. This module is the shared selector
 * module: it parses the manifest and EXPORTS the selector contract
 * (`loadRegister`, `SELECTORS`), and `scripts/observe/demo/usability.mjs`
 * imports those selectors instead of spelling them again. A rename to
 * `kf-split` therefore REDs BOTH instruments instead of silently voiding both.
 *
 * Four falsifiable clauses, each BITING on a named defect:
 *
 *   S · STATIC (always runs) — manifest integrity. Every role carries a
 *       selector and an `expect` tuple; every mono allowlist entry is a
 *       parseable selector; the hero row carries BOTH class strings the fold
 *       homes here. BITE: the fold is undone by deletion, not only by rename.
 *
 *   1 · NON-VACUITY — every manifest row matches at least ONE element across
 *       the rendered roster. BITE: `a green registry gate over an empty set`
 *       (the `.tab-trigger-base[data-state=…]` rows died to this clause).
 *
 *   2 · REGISTER SEMANTICS, NOT JUST THE SELECTOR (C-S+1) — for every matched
 *       leaf the census reads `font-family`, `font-weight`, `font-style` AND
 *       `text-transform`. A row whose selector contract is satisfied while an
 *       INHERITED `text-transform` rewrites the register reds here. BITE: the
 *       old census `cannot see text-transform`; this one fails if it cannot
 *       read the property at all (a blind census is a failing census, never a
 *       passing one).
 *
 *   3 · NO LAUNDERING BY DESCENT (REGISTER-LAUNDER) — a mono leaf must match
 *       an allowlist entry ITSELF. Satisfaction that exists only because some
 *       ancestor carries `[data-register='code']` (or `code` / `pre`) is
 *       REFUSED: `_monoContract` forbids exactly the content that descent
 *       admits. Every descent-only satisfaction is reported with the ancestor
 *       that laundered it.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium), serving the BUILT `dist/gh-pages/` (run `npm run gh-pages`
 * first). The browser half is gated on playwright resolution exactly as the
 * observe lane's gates are: unavailable ⇒ an HONEST structured skip, and under
 * `KF_REQUIRE_BROWSER=1` a hard failure — a browser clause never passes
 * vacuously. Static/headless only: a claim needing a real rendered frame in a
 * real browser MATRIX is KF.W9's, not this gate's.
 *
 * Usage:
 *   node scripts/gates/register-census.mjs
 *   KF_REQUIRE_BROWSER=1 node scripts/gates/register-census.mjs
 *   node scripts/gates/register-census.mjs --static   # clause S alone
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
);
const MANIFEST = path.join(REPO, "demo/styles/font-roles.json");
const DIST = path.join(REPO, "dist/gh-pages");

/**
 * The manifest, RE-READ at every use (never cached to a checked-in list, never
 * allowlisted — rule (b)/(c) and B10-27's closing clause).
 */
export function loadRegister() {
    const raw = readFileSync(MANIFEST, "utf8");
    const manifest = JSON.parse(raw);
    return { raw, manifest, path: path.relative(REPO, MANIFEST) };
}

/**
 * The SELECTOR CONTRACT, derived from the manifest — the single home R-3's
 * fold creates. `usability.mjs` imports `SELECTORS` from here; nothing spells
 * `.wave-char` or `.wave-word` twice.
 */
export function selectorContract(manifest = loadRegister().manifest) {
    const hero = manifest.roles.find((r) => r.role === "hero-display");
    if (!hero)
        throw new Error(
            "register-census — the manifest has no `hero-display` row; the fold has no home",
        );
    if (!hero.wordWrapperSelector) {
        throw new Error(
            "register-census — the `hero-display` row carries no `wordWrapperSelector`; " +
                "the KF-AT-24 fold is undone and usability.mjs has no shared home for `.wave-word`",
        );
    }
    /** The leaf class AnimatedText puts on every CHAR span. */
    const heroChar = leafClass(hero.selector);
    /** The wrapper class AnimatedText puts on every WORD. */
    const heroWord = leafClass(hero.wordWrapperSelector);
    return {
        heroDisplay: hero.selector,
        heroWordWrapper: hero.wordWrapperSelector,
        heroChar: `.${heroChar}`,
        heroWord: `.${heroWord}`,
        monoAllowed: [...manifest.monoAllowedSelectors],
        monoCeiling: manifest.monoCeiling,
    };
}

/** The trailing `.class` of a descendant selector, as a bare class name. */
function leafClass(selector) {
    const last = selector.trim().split(/\s+/).pop();
    const m = last.match(/\.([A-Za-z0-9_-]+)$/);
    if (!m)
        throw new Error(
            `register-census — ${JSON.stringify(selector)} has no trailing class to share`,
        );
    return m[1];
}

export const SELECTORS = (() => {
    try {
        return selectorContract();
    } catch {
        // A broken manifest is clause S's FAILURE, reported there with its
        // reason; importing this module must not throw at load.
        return null;
    }
})();

// ── the gate ────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
    const results = [];
    const ok = (m) => {
        results.push({ pass: true, m });
        console.log(`  PASS  ${m}`);
    };
    const fail = (m) => {
        results.push({ pass: false, m });
        console.error(`  FAIL  ${m}`);
    };
    const note = (m) => console.log(`  note  ${m}`);

    // ── clause S — manifest integrity (STATIC, always runs) ─────────────────
    const { manifest, path: manifestPath } = loadRegister();
    console.log(
        `register-census — manifest ${manifestPath}: ${manifest.roles.length} role(s), ` +
            `${manifest.monoAllowedSelectors.length} mono allowlist entr(ies), monoCeiling ${manifest.monoCeiling}.`,
    );
    let contract = null;
    try {
        contract = selectorContract(manifest);
        ok(
            `(S) the KF-AT-24 fold holds — the hero row homes BOTH class strings ` +
                `(${contract.heroChar} chars inside ${contract.heroWord} words); usability.mjs reads them from here`,
        );
    } catch (e) {
        fail(`(S) ${e.message}`);
    }
    for (const role of manifest.roles) {
        if (!role.selector || typeof role.selector !== "string")
            fail(`(S) role ${role.role} declares no selector`);
        if (!role.expect || !role.expect.voice)
            fail(`(S) role ${role.role} declares no expected voice`);
    }
    if (manifest.roles.every((r) => r.selector && r.expect?.voice)) {
        ok(`(S) every role binds a selector to an expected register tuple`);
    }

    const staticOnly = process.argv.includes("--static");
    if (!staticOnly) {
        const { navToScene, SCENES, withPage } =
            await import("../lib/demo-driver.mjs");
        const roster = SCENES.map((s) => s.id);
        const outcome = await withPage(
            {
                distDir: DIST,
                label: "the rendered register census (clauses 1–3)",
                context: { viewport: { width: 1280, height: 900 } },
            },
            async (page, { url: base }) => {
                const seen = new Map(manifest.roles.map((r) => [r.role, 0]));
                const violations = [];
                const visit = async (label) => {
                    const probe = await page.evaluate(
                        ({ roles, monoAllowed }) => {
                            const out = { rows: [], mono: [], blind: false };
                            const familyOf = (cs) => {
                                const f = cs.fontFamily.toLowerCase();
                                if (f.includes("fira")) return "mono";
                                if (f.includes("instrument")) return "display";
                                return "body";
                            };
                            // Clause 2's own precondition: the census must be
                            // able to READ text-transform. A runtime that hides
                            // it makes this gate blind, and a blind gate FAILS.
                            const probeStyle = getComputedStyle(document.body);
                            out.blind =
                                typeof probeStyle.textTransform !== "string";
                            for (const role of roles) {
                                const els = [
                                    ...document.querySelectorAll(role.selector),
                                ];
                                const rows = els.slice(0, 40).map((el) => {
                                    const cs = getComputedStyle(el);
                                    // The register semantics, not just the
                                    // selector: an INHERITED text-transform
                                    // rewrites the register the tuple encodes.
                                    let transformSource = "none";
                                    if (cs.textTransform !== "none") {
                                        transformSource = "self";
                                        for (
                                            let a = el.parentElement;
                                            a;
                                            a = a.parentElement
                                        ) {
                                            if (
                                                getComputedStyle(a)
                                                    .textTransform ===
                                                cs.textTransform
                                            ) {
                                                transformSource = "inherited";
                                            } else break;
                                        }
                                    }
                                    return {
                                        voice: familyOf(cs),
                                        weight: Number(cs.fontWeight),
                                        style: cs.fontStyle,
                                        textTransform: cs.textTransform,
                                        transformSource,
                                        text: (el.textContent ?? "")
                                            .trim()
                                            .slice(0, 40),
                                    };
                                });
                                out.rows.push({
                                    role: role.role,
                                    expect: role.expect,
                                    matched: els.length,
                                    rows,
                                });
                            }
                            // Clause 3 — every MONO leaf, and HOW it is allowed.
                            const leaves = [
                                ...document.querySelectorAll("body *"),
                            ].filter(
                                (el) =>
                                    el.childElementCount === 0 &&
                                    (el.textContent ?? "").trim().length > 0 &&
                                    familyOf(getComputedStyle(el)) === "mono",
                            );
                            for (const el of leaves.slice(0, 200)) {
                                const self = monoAllowed.filter((s) => {
                                    try {
                                        return (
                                            !s.endsWith(" *") && el.matches(s)
                                        );
                                    } catch {
                                        return false;
                                    }
                                });
                                const descent = monoAllowed.filter((s) => {
                                    try {
                                        return (
                                            s.endsWith(" *") && el.matches(s)
                                        );
                                    } catch {
                                        return false;
                                    }
                                });
                                if (self.length > 0) continue;
                                out.mono.push({
                                    text: (el.textContent ?? "")
                                        .trim()
                                        .slice(0, 40),
                                    tag: el.tagName.toLowerCase(),
                                    cls:
                                        el.className
                                            ?.toString?.()
                                            .slice(0, 60) ?? "",
                                    descent,
                                });
                            }
                            return out;
                        },
                        {
                            roles: manifest.roles,
                            monoAllowed: manifest.monoAllowedSelectors,
                        },
                    );
                    if (probe.blind) {
                        violations.push({
                            clause: 2,
                            why: "the census cannot read `text-transform` — a blind census FAILS",
                        });
                    }
                    for (const r of probe.rows) {
                        seen.set(r.role, (seen.get(r.role) ?? 0) + r.matched);
                        for (const row of r.rows) {
                            if (
                                r.expect.voice &&
                                row.voice !== r.expect.voice
                            ) {
                                violations.push({
                                    clause: 2,
                                    why: `${label}: role ${r.role} resolves voice ${row.voice}, contract says ${r.expect.voice} ("${row.text}")`,
                                });
                            }
                            if (
                                r.expect.weight &&
                                row.weight !== r.expect.weight
                            ) {
                                violations.push({
                                    clause: 2,
                                    why: `${label}: role ${r.role} resolves weight ${row.weight}, contract says ${r.expect.weight} ("${row.text}")`,
                                });
                            }
                            if (
                                r.expect.style &&
                                row.style !== r.expect.style
                            ) {
                                violations.push({
                                    clause: 2,
                                    why: `${label}: role ${r.role} resolves style ${row.style}, contract says ${r.expect.style} ("${row.text}")`,
                                });
                            }
                            if (row.textTransform !== "none") {
                                violations.push({
                                    clause: 2,
                                    why:
                                        `${label}: role ${r.role} carries text-transform ${row.textTransform} ` +
                                        `(${row.transformSource}) — the SELECTOR contract is satisfied while the ` +
                                        `REGISTER SEMANTICS it encodes is violated ("${row.text}")`,
                                });
                            }
                        }
                    }
                    for (const m of probe.mono) {
                        violations.push({
                            clause: 3,
                            why:
                                `${label}: mono leaf <${m.tag} class="${m.cls}"> "${m.text}" is ` +
                                (m.descent.length
                                    ? `allowed ONLY BY DESCENT (${m.descent.join(", ")}) — laundering, refused`
                                    : `reached by NO allowlist selector — a demo-authored mono UI label`),
                        });
                    }
                };
                await page.goto(`${base}/`, { waitUntil: "load" });
                await page.waitForTimeout(400);
                await visit("home");
                for (const id of roster) {
                    try {
                        await navToScene(page, id);
                        await page.waitForTimeout(250);
                        await visit(id);
                    } catch (e) {
                        violations.push({
                            clause: 1,
                            why: `scene ${id} did not open: ${e.message}`,
                        });
                    }
                }
                return { seen: [...seen], violations };
            },
        );
        if (outcome.skipped) {
            note(
                `browser half SKIPPED — ${outcome.reason}. Clauses 1–3 are UNMEASURED at this run ` +
                    `(they did not pass; set KF_REQUIRE_BROWSER=1 to make this a hard failure).`,
            );
        } else {
            const { seen, violations } = outcome.value;
            for (const [role, count] of seen) {
                if (count === 0) {
                    fail(
                        `(1) manifest row \`${role}\` matched ZERO elements across the rendered roster — ` +
                            `a green registry gate over an empty set`,
                    );
                } else {
                    ok(
                        `(1) manifest row \`${role}\` matched ${count} element(s) across the roster`,
                    );
                }
            }
            const byClause = new Map();
            for (const v of violations)
                byClause.set(v.clause, [
                    ...(byClause.get(v.clause) ?? []),
                    v.why,
                ]);
            for (const clause of [1, 2, 3]) {
                const rows = byClause.get(clause) ?? [];
                if (rows.length === 0) {
                    if (clause !== 1)
                        ok(
                            `(${clause}) no violation across the rendered roster`,
                        );
                    continue;
                }
                for (const why of rows.slice(0, 40)) fail(`(${clause}) ${why}`);
                if (rows.length > 40)
                    fail(`(${clause}) … and ${rows.length - 40} more`);
            }
        }
    }

    const failures = results.filter((r) => !r.pass);
    console.log(
        failures.length === 0
            ? `register-census — PASS: ${results.length} clause assertion(s) green.`
            : `register-census — FAIL: ${failures.length} of ${results.length} clause assertion(s) red.`,
    );
    process.exit(failures.length === 0 ? 0 : 1);
}
