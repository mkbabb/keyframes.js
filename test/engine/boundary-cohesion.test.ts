/**
 * boundary-cohesion.test.ts — F.W11 (the boundary cohesion folds). proof:cohesion.
 *
 * Three isomorphic, byte-identical folds:
 *  - the 4× open-coded clamp converged onto internal/leaves.clamp;
 *  - group.ts's lerp retargeted off the light leaf onto value.js (the leaf's
 *    consumer set is purely light again — the inverted-tier import removed);
 *  - the presets + MotionPath reachable through the heavy loadAnimationEngine
 *    surface (the README's documented preset access is real, not a dead import).
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadAnimationEngine } from "../../src/animation/index";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "animation");
const read = (f: string): string => readFileSync(join(root, f), "utf8");
// The whole waapi/ zone surface (R.W2b carved the flat waapi.ts into the four
// concerns + densify) — the clamp-cohesion assertion sweeps every file so the
// open-coded clamp is forbidden wherever the carve landed the emission code.
const readWaapiSurface = (): string =>
    readdirSync(join(root, "waapi"))
        .filter((f) => f.endsWith(".ts"))
        .map((f) => readFileSync(join(root, "waapi", f), "utf8"))
        .join("\n");

describe("F.W11 — the 4× clamp converged onto leaves.clamp", () => {
    // The light steppers/timeline/waapi must not re-open-code the [0,1] clamp;
    // the spring must not re-open-code the [-1,1] clamp. A future edit to the
    // clamp contract (NaN handling, say) must find ONE site, not five.
    // R.W1 directory partition: the steppers/timeline/waapi/spring/group moved
    // into their zone directories; the cohesion assertions read the new paths.
    for (const f of [
        "physics/smooth.ts",
        "orchestration/timeline/index.ts",
    ]) {
        it(`${f} has no open-coded Math.max(0, Math.min(1, …))`, () => {
            expect(read(f)).not.toMatch(/Math\.max\(\s*0\s*,\s*Math\.min\(\s*1/);
        });
    }
    it("the waapi/ surface has no open-coded Math.max(0, Math.min(1, …))", () => {
        expect(readWaapiSurface()).not.toMatch(
            /Math\.max\(\s*0\s*,\s*Math\.min\(\s*1/,
        );
    });
    it("spring progress.ts has no open-coded Math.min(1, Math.max(-1, …))", () => {
        expect(read("physics/spring/progress.ts")).not.toMatch(
            /Math\.min\(\s*1\s*,\s*Math\.max\(\s*-1/,
        );
    });
    it("timeline index.ts deleted the local clamp01", () => {
        expect(read("orchestration/timeline/index.ts")).not.toMatch(
            /const clamp01\s*=/,
        );
    });
});

describe("F.W11 — the group blend's lerp is value.js, not the light leaf (inverted-tier removed)", () => {
    // R.W2 — the residual blend leaf (the `lerp` user) was carved out of `group.ts`
    // into `./group/composite/compositor.ts` (V.W5 LT-08 module carve); the F.W11
    // posture (lerp from value.js, NOT a light-leaf re-export) follows it to its home.
    it("the group compositor does not import lerp from the light leaf", () => {
        const c = read("group/composite/compositor.ts");
        expect(c).not.toMatch(
            /import\s*\{[^}]*lerp[^}]*\}\s*from\s*["']\.\.\/internal\/leaves["']/,
        );
        // …it takes the canonical copy from value.js (the heavy posture).
        expect(c).toMatch(
            /import\s*\{[^}]*lerp[^}]*\}\s*from\s*["']@mkbabb\/value\.js\/math["']/,
        );
    });
});

describe("F.W11 — presets + MotionPath reachable through the heavy surface", () => {
    it("loadAnimationEngine resolves the preset namespace + MotionPath", async () => {
        const engine = await loadAnimationEngine();
        expect(typeof engine.presets.fadeIn).toBe("function");
        expect(typeof engine.presets.bounce).toBe("function");
        expect(typeof engine.MotionPath).toBe("function");
        expect(typeof engine.fromMotionPath).toBe("function");
        // the preset actually constructs a runnable animation
        const anim = engine.presets.fadeIn({ duration: 500 });
        expect(anim.options.duration).toBe(500);
    });
});
