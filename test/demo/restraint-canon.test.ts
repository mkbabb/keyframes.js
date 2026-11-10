/**
 * The restraint precept's keyframes falsifiers (value.js docs/precepts/restraint.md;
 * the owner order of 2026-11-09, §0hz.canon.keyframes). Each case names the plan
 * unit it holds: K1 (no easing-name title), K6 (default tabs), K7 (no standing
 * captions, no status badge, one Import), K8 (the timeline opens holding the
 * scene's keyframes), K9 (no needless bold; values never smaller than labels),
 * K10 (one number formatter), K16 (equal dock gaps on a short viewport).
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { formatMs, formatNumber, formatSeconds } from "@utils/formatNumber";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");
const files = (dir: string, ext: RegExp): string[] =>
    readdirSync(join(ROOT, dir)).flatMap((name) => {
        const rel = `${dir}/${name}`;
        return statSync(join(ROOT, rel)).isDirectory() ? files(rel, ext) : ext.test(name) ? [rel] : [];
    });
const noComments = (src: string) =>
    src.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const demoSources = files("demo", /\.(vue|ts)$/).map((rel) => [rel, noComments(read(rel))] as const);
const allText = demoSources.map(([, src]) => src).join("\n");

describe("K7 — no standing captions", () => {
    it.each([
        "Sampled curve",
        "stops</span>",
        "spring-chased",
        "&isin; [-1, 1]",
        "single-target only",
        "Layer compositing applies to",
        "from the dock above, then press Play below.",
        "items &middot;",
    ])("%s is gone", (text) => {
        expect(allText).not.toContain(text);
    });
    it("the square box carries no 'drag me'", () => {
        expect(noComments(read("demo/scenes/square/SquareScene.vue"))).not.toMatch(/^\s*drag me\s*$/m);
    });
    it("the spring rail hint is not drawn (screen readers keep it)", () => {
        expect(read("demo/scenes/spring/SpringTarget.vue")).toMatch(/<p id="spring-rail-hint" class="sr-only">/);
    });
    it("no stage paints a status badge", () => {
        expect(allText).not.toMatch(/class="status-badge/);
        expect(read("demo/styles/design-idioms.css")).not.toMatch(/^\.status-badge\s*\{/m);
    });
    it("the owner's 'drag M. cubert' line stays", () => {
        expect(read("demo/app/hero/EditorStartScreen.vue")).toMatch(/hero-hint/);
    });
});

describe("K7 + K8 — the timeline opens holding the scene's keyframes", () => {
    const timeline = noComments(read("demo/components/instrument/timeline/KeyframeTimeline.vue"));
    it("no second Import beside the ribbon's", () => {
        expect(timeline).not.toMatch(/Import \{\{\s*sceneSummary/);
        expect(timeline.match(/>\s*Import\s*</g) ?? []).toHaveLength(1);
    });
    it("the empty notice shows only when the scene has no keyframes", () => {
        expect(timeline).toMatch(/v-if="state\.keyframes\.length === 0 && !scene\?\.count"/);
    });
    it("a fresh Timeline visit emits the scene's CSS itself", () => {
        expect(read("demo/components/instrument/pane/channel-controls/ChannelControls.vue")).toMatch(
            /channelState\.keyframesText \|\| emittedCss\.value/,
        );
    });
});

describe("K1 — the easing stage has no curve-name title", () => {
    it("EasingTarget renders no specimen-name heading", () => {
        expect(noComments(read("demo/scenes/easing/EasingTarget.vue"))).not.toMatch(/specimen-name|<h2/);
    });
});

describe("K6 — the catalogue filter wears glass's default tabs", () => {
    it("no underline variant", () => {
        expect(noComments(read("demo/components/EasingCatalogue/EasingCatalogue.vue"))).not.toMatch(
            /variant="underline"/,
        );
    });
});

describe("K9 — no needless bold", () => {
    it("no demo-authored semibold or bold text outside the cube's face numerals", () => {
        const owners = demoSources
            .filter(([rel]) => rel !== "demo/scenes/cube/CubeTarget.vue")
            .filter(([, src]) => /\bfont-(semibold|bold)\b|font-weight:\s*[67]00/.test(src))
            .map(([rel]) => rel);
        expect(owners).toEqual([]);
    });
    it("a param value is set at its label's size", () => {
        expect(read("demo/styles/design-idioms.css")).toMatch(
            /\.param-row > \.param-value \{[\s\S]*?font-size: var\(--control-label\)/,
        );
    });
});

describe("K10 — one number formatter", () => {
    it("drops trailing zeros, never signs zero, uses the true minus", () => {
        expect(formatNumber(0.5)).toBe("0.5");
        expect(formatNumber(-0.001)).toBe("0");
        expect(formatNumber(-0.35)).toBe("−0.35");
        expect(formatNumber(0, 2, { fixed: true, pad: true })).toBe(" 0.00");
        expect(formatSeconds(0.5)).toBe("0.5 s");
        expect(formatMs(260.4)).toBe("260 ms");
    });
    it("no '+' signed readout and no '@…ms' lane label", () => {
        expect(allText).not.toMatch(/"\+"\}\$\{Math\.abs/);
        expect(allText).not.toMatch(/@\{\{\s*Math\.round/);
    });
    it("no readout template formats with toFixed", () => {
        const owners = demoSources
            .filter(([rel]) => rel.endsWith(".vue"))
            .filter(([, src]) => /\{\{[^}]*toFixed/.test(src))
            .map(([rel]) => rel);
        expect(owners).toEqual([]);
    });
});

describe("K16 — equal dock gaps on a short viewport", () => {
    it("the short-viewport top anchor takes the bottom's margin term", () => {
        const css = read("demo/styles/layout.css");
        const block = css.slice(css.lastIndexOf("@media (max-width: 1023px) and (max-height: 500px)"));
        expect(block).toMatch(/--dock-top-anchor:\s*calc\([\s\S]*?var\(--dock-margin\) \/ var\(--phi\)/);
    });
});
