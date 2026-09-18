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

    // RED at this seat: yields 6 (the append), not 3. Unwrap to a plain `it`
    // when `engine/css/animation.ts` clears the template set before the ingest.
    it.fails(
        "re-ingesting the SAME text yields the parsed set alone — RULED, cure outside .c's bounds",
        () => {
            const anim = seeded();
            anim.fromString(CSS).parse();

            expect(anim.templateFrames.length).toBe(3);
            // No duplicated selectors, hence no degenerate zero-length segments.
            const selectors = selectorsOf(anim);
            expect(new Set(selectors).size).toBe(selectors.length);
        },
    );

    // RED at this seat: yields 5 — the UNION of both texts, which is neither
    // text's animation.
    it.fails(
        "re-ingesting DIFFERENT text yields THAT text's frames, not a union — RULED, cure outside .c's bounds",
        () => {
            const anim = seeded();
            anim.fromString(
                `@keyframes probe { from { opacity: 1; } to { opacity: 0; } }`,
            ).parse();

            expect(anim.templateFrames.length).toBe(2);
        },
    );
});
