// SERVED MODEL: claude-opus-5[1m]
/**
 * test/engine/fromstring-idempotence.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-FROMSTRING** (row B-9 ≡ KF-KE-10 ≡ SPF-20).
 *
 * THE RULING CAME FIRST (RULE-BEFORE-FIX, §Sequencing S-2 — B-9 heads the
 * queue). COHESION §0j.C **KF-W5R4(1)**: *"`fromString` REPLACES — a second
 * `fromString` on a populated instance yields the parsed set alone
 * (idempotent); the B-9 append is a MAJOR defect, not a documented behaviour"*.
 *
 * THE DEFECT: `fromString` loops `this.addFrame(...)` over the parse result and
 * nothing resets the template set first — `addFrame` only ever pushes, and
 * there is no reset anywhere under `src/animation/**`. So a re-ingest of the
 * SAME text doubles the keyframes, with duplicated selectors and degenerate
 * zero-length segments; the editor seat that seeds an instance twice gets an
 * animation that is not the one it parsed. (The diagnostics field DOES get a
 * fresh array per call — the author considered re-parse staleness and missed
 * the frames.)
 *
 * **BORN-RED, AND IT STAYS RED AT THIS SEAT — BY BOUNDS, NOT BY CHOICE.** The
 * sole `fromString` declaration is `src/animation/engine/css/animation.ts:166`,
 * which is NOT in unit `.c`'s writable set (it is arm C `.d`'s), and there is no
 * other seam: the loop calls `this.addFrame` directly, `addFrame` only pushes,
 * and nothing `.c` owns sits between the two. The cure is ONE act at that file —
 * clear the template set (and the compiled frames with it) before the ingest
 * loop — and it is escalated in the wave record with this measurement.
 *
 * The two ruled assertions therefore ride the repo's documented born-RED idiom
 * (`it.fails`, as `test/group/group-snapshot-identity.test.ts` uses it): the
 * assertion is EXECUTED, its failure is the recorded RED, and the day the cure
 * lands each one FLIPS RED as an `it.fails` and must be unwrapped to a plain
 * `it`. It is not a skip, not an allowlist, and it does not pin the defect as
 * correct — it pins the RULING and reports that the tree has not reached it yet.
 *
 * MEASURED AT THIS SEAT (keyframes.js master, this wave's HEAD): 3 template
 * frames → a second `fromString` + `parse` → **6**, selectors duplicated; a
 * second ingest of DIFFERENT text (2 stops) → **5**, the union of both texts.
 *
 * CURED (K-D5, value.js X realization 2026-11-04): `CSSKeyframesAnimation`'s
 * one ingest head (`beginIngest`) resets the template set for `fromString`,
 * `fromKeyframes` and `fromVars` alike; the two `it.fails` are plain `it`.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

const CSS = `@keyframes probe {
    0% { opacity: 0; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}`;

function seeded() {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const anim = new CSSKeyframesAnimation({ duration: 100, useWAAPI: false });
    anim.setTargets(el);
    anim.fromString(CSS).parse();
    return anim;
}

const selectorsOf = (anim: CSSKeyframesAnimation<Record<string, unknown>>) =>
    anim.templateFrames.map((f) => JSON.stringify(f.start));

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("`fromString` REPLACES (G-FROMSTRING · KF-W5R4(1))", () => {
    it("the FIRST ingest is the baseline this gate measures against", () => {
        const anim = seeded();
        expect(anim.templateFrames.length).toBe(3);
        expect(selectorsOf(anim).length).toBe(new Set(selectorsOf(anim)).size);
    });

    // K-D5 (value.js X realization, 2026-11-04): the ingest head resets the
    // template set, so these two are plain `it` — RED (6 / 5) before the reset
    // line in `engine/css/animation.ts`, GREEN (3 / 2) after.
    it(
        "re-ingesting the SAME text yields the parsed set alone",
        () => {
            const anim = seeded();
            anim.fromString(CSS).parse();

            expect(anim.templateFrames.length).toBe(3);
            // No duplicated selectors, hence no degenerate zero-length segments.
            const selectors = selectorsOf(anim);
            expect(new Set(selectors).size).toBe(selectors.length);
        },
    );

    it(
        "re-ingesting DIFFERENT text yields THAT text's frames, not a union",
        () => {
            const anim = seeded();
            anim.fromString(
                `@keyframes probe { from { opacity: 1; } to { opacity: 0; } }`,
            ).parse();

            expect(anim.templateFrames.length).toBe(2);
        },
    );

    // The G-RENDERER floor: a re-ingest that names the same custom renderer
    // keeps it on every frame, and the set is still the parsed set alone.
    it("a re-ingest keeps a custom `transform` on the parsed set alone", () => {
        const custom = (v: Record<string, unknown>) => v;
        const anim = seeded();
        anim.fromString(CSS, custom).parse();
        anim.fromString(CSS, custom).parse();

        expect(anim.templateFrames.length).toBe(3);
        expect(anim.templateFrames.every((f) => f.transform === custom)).toBe(true);
        expect(anim.frames.every((f) => !anim.usesDefaultRenderer(f.transform))).toBe(true);
    });

    it("`fromKeyframes` replaces under the same rule", () => {
        const anim = seeded();
        anim.fromKeyframes({ "0%": { opacity: 1 }, "100%": { opacity: 0 } });

        expect(anim.templateFrames.length).toBe(2);
    });
});
