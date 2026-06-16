import { markRaw } from "vue";

import { CSSKeyframesAnimation } from "@src/animation/engine";
import { springTimingFunction } from "@src/animation/springTimingFunction";

/**
 * K.W4 S1 — the spring scene's PROPER keyframes-EDITOR animation (the cube
 * grammar), colocated as its own concern seam (the same split shape as
 * `useSpringHotPath`: `useSpringDemo` owns the live physics + transport; this
 * unit owns the editable `@keyframes` authoring surface).
 *
 * The spring's authoring surface is now the engine-owned `KeyframesEditor`
 * (per-stop value, add/remove stop, two-way) over a REAL `CSSKeyframesAnimation`
 * — NOT the retired read-only `@keyframes`/`linear()` viewer that
 * `watch(generatedArtifact, css => artifactCss.value = css)` OVERWROTE on every
 * param change (live-spring-sequence-mp-verdict.md §3, the born-RED witness).
 *
 * The editor is the PRIMARY authoring path (design-decision RESOLVED): it is
 * SEEDED ONCE from the spring curve at the current params, then it is
 * AUTHORITATIVE — a typed per-stop edit PERSISTS and is never overwritten by a
 * later slider/preset interaction (the solver presets are a derived convenience
 * that drive the live physics tracker, a SEPARATE concern). `seedKeyframes()`
 * re-seeds ONLY on the explicit user "re-sample from spring" action, never
 * reactively.
 *
 * @param response         getter for the live spring response (s)
 * @param dampingFraction  getter for the live damping fraction ζ
 * @param duration         the editor animation's clock (the sampler duration)
 */
export function useSpringKeyframesEditor(
    response: () => number,
    dampingFraction: () => number,
    duration: number,
) {
    /** Build the spring's emitted `@keyframes` block sampled from the live params
     *  — the editor's seed feedstock (the SAME springTimingFunction → displacement
     *  the artifact viewer used, now an EDITABLE animation rather than a string). */
    const buildSpringKeyframesCSS = (): string => {
        const easing = springTimingFunction({
            response: response(),
            dampingFraction: dampingFraction(),
        });
        const stops = [0, 0.25, 0.5, 0.75, 1];
        const rows = stops.map((t) => {
            const v = easing.fn(t);
            const pct = Math.round(t * 100);
            return `    ${pct}% { transform: translateX(${(v * 100).toFixed(2)}%); }`;
        });
        return `@keyframes spring {\n${rows.join("\n")}\n}`;
    };

    const springEditAnim = markRaw(
        new CSSKeyframesAnimation({
            duration,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: "linear",
        }).fromString(buildSpringKeyframesCSS()),
    );
    springEditAnim.name = "Spring Keyframes";
    springEditAnim.superKey = "Spring";

    /** Explicit re-seed of the editor from the current spring params (the
     *  "re-sample from spring" user action — NOT a reactive overwrite). After
     *  this the editor is authoritative again until the next manual re-seed. */
    const seedKeyframes = (): void => {
        springEditAnim.fromString(buildSpringKeyframesCSS());
        springEditAnim.parse();
    };

    return { springEditAnim, seedKeyframes };
}
