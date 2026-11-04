/**
 * The Daraksha cube skin — her register on the die, and its engine-authored
 * motion (the library's `unfurl` on each face, `garlandSway` on the Hover
 * channel).
 *
 *  · Palette exactness and the ink floor red on one changed digit.
 *  · Engine only: the skin block authors no motion CSS.
 *  · One writer: the unfurl paints `.face-fill` only, never the placed face;
 *    the sway re-keys the Hover channel (still three channels).
 *  · Release: no stale inline frame survives the unfurl.
 *  · Reduced motion: no unfurl, no inline style.
 *  · The enum migration: `ppMode` is gone; `cubeSkin` has one writer.
 *
 * Source assertions strip comments first (the cube-scene.test.ts idiom).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { mat4 } from "gl-matrix";
import {
    contrastRatio,
    parseCssColor,
    serializeCssColor,
} from "@mkbabb/value.js/color";

import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { warmKfEngine } from "../../../demo/kf-engine";
import CubeTarget from "../../../demo/scenes/cube/CubeTarget.vue";
import { useCubeDemo } from "../../../demo/scenes/cube/useCubeDemo";
import { createMatrix } from "../../../demo/scenes/cube/matrix-editor/transformMath";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";
import type { CubeSkin } from "../../../demo/state";
import { withSetup } from "../../support/withSetup";

const DEMO = resolve(__dirname, "../../../demo");
const CUBE = resolve(DEMO, "scenes/cube");
const stripComments = (src: string) =>
    src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/^\s*\/\/.*$/gm, "");

/** Her register (`register-oklch.mjs`, the palette's source of truth). */
const REGISTER = {
    efflorescence: "oklch(73% 0.185 2)",
    gulabi: "oklch(90% 0.055 18)",
    haldi: "oklch(82% 0.145 76)",
    zari: "oklch(72% 0.12 88)",
    sheesham: "oklch(55% 0.085 56)",
    tulsi: "oklch(72% 0.055 145)",
    "curry-leaf": "oklch(43% 0.085 152)",
    jamun: "oklch(39% 0.1 356)",
} as const;
type Name = keyof typeof REGISTER;

/** Face N (front, right, back, left, top, bottom) → face colour + ink. */
const FACES: ReadonlyArray<readonly [face: Name, ink: Name]> = [
    ["efflorescence", "jamun"],
    ["haldi", "jamun"],
    ["tulsi", "curry-leaf"],
    ["zari", "jamun"],
    ["gulabi", "jamun"],
    ["sheesham", "gulabi"],
];

const parse = (css: string) => {
    const r = parseCssColor(css.trim());
    if (!r.ok) throw new Error(`unparseable colour "${css}"`);
    return r.value;
};
const canonical = (css: string): string => {
    const s = serializeCssColor(parse(css));
    if (!s.ok) throw new Error(`unserializable colour "${css}"`);
    return s.value;
};

/** The skin block's top-level declarations (its nested rules excluded). */
const skinBlock = (): { body: string; decls: Map<string, string> } => {
    const css = stripComments(readFileSync(resolve(CUBE, "CubeTarget.css"), "utf8"));
    const open = css.search(/[^{}]*\[data-cube-skin="daraksha"\]\s*\{/);
    expect(open).toBeGreaterThanOrEqual(0);
    const start = css.indexOf("{", open);
    let depth = 0;
    let end = start;
    for (; end < css.length; end++) {
        if (css[end] === "{") depth++;
        else if (css[end] === "}" && --depth === 0) break;
    }
    const body = css.slice(start + 1, end);
    const flat = body.replace(/[^;{}]*\{[^}]*\}/g, "");
    const decls = new Map<string, string>();
    for (const m of flat.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) decls.set(m[1]!, m[2]!.trim());
    return { body, decls };
};

describe("the Daraksha skin's palette (CubeTarget.css)", () => {
    const { body, decls } = skinBlock();

    it("declares --face-1…6 and --face-1…6-ink hue-exact to her register", () => {
        FACES.forEach(([face, ink], i) => {
            const n = i + 1;
            expect(decls.get(`--face-${n}`), `--face-${n}`).toBeDefined();
            expect(canonical(decls.get(`--face-${n}`)!)).toBe(canonical(REGISTER[face]));
            expect(decls.get(`--face-${n}-ink`), `--face-${n}-ink`).toBeDefined();
            expect(canonical(decls.get(`--face-${n}-ink`)!)).toBe(canonical(REGISTER[ink]));
        });
    });

    it("carries all eight of her colours on the die", () => {
        const used = new Set([...decls.values()].map(canonical));
        for (const css of Object.values(REGISTER)) expect(used.has(canonical(css))).toBe(true);
    });

    it("every numeral clears the 3:1 large-text floor on its face", () => {
        for (let n = 1; n <= 6; n++) {
            const r = contrastRatio(parse(decls.get(`--face-${n}`)!), parse(decls.get(`--face-${n}-ink`)!));
            if (!r.ok) throw new Error(`contrast unreadable on face ${n}`);
            expect(r.value, `face ${n}`).toBeGreaterThanOrEqual(3.0);
        }
    });

    it("is engine-only: no @keyframes, animation, or transform/opacity transition", () => {
        expect(body).not.toMatch(/@keyframes/);
        expect(body).not.toMatch(/(^|[\s;{])animation(-[\w-]+)?\s*:/);
        expect(body).not.toMatch(/transition(-property)?\s*:[^;]*(transform|opacity|all)/);
        expect(body).not.toMatch(/!important/);
    });

    it("every face reads its ink through its own --face-N-ink token", () => {
        const vue = stripComments(readFileSync(resolve(CUBE, "CubeTarget.vue"), "utf8"));
        for (let n = 1; n <= 6; n++) {
            expect(vue).toMatch(new RegExp(`color: "var\\(--face-${n}\\)", ink: "var\\(--face-${n}-ink\\)"`));
        }
    });
});

// ── the mounted die ─────────────────────────────────────────────────────────

const restTransform = (): TransformState => ({
    rotate: { x: 0, y: 0, z: 0 },
    translate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    matrix: mat4.create(),
});

/** A stubbed rAF clock: each frame advances 32 ms, delivered on a macrotask. */
const stubRafClock = () => {
    let clock = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
        setTimeout(() => cb((clock += 32)), 0) as unknown as number,
    );
    vi.stubGlobal("cancelAnimationFrame", (h: number) => clearTimeout(h));
};
const frame = () => new Promise<void>((r) => setTimeout(r, 0));
const frames = async (n: number) => {
    for (let i = 0; i < n; i++) await frame();
};

const stubReducedMotion = (reduce: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: reduce && query.includes("prefers-reduced-motion: reduce"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
    }));

const mountDie = (skin: CubeSkin) =>
    mount(CubeTarget, {
        props: { isPlaying: false, skin, transform: restTransform() },
        attachTo: document.body,
    });

const fillsOf = (w: ReturnType<typeof mountDie>) =>
    w.findAll(".cube-side > .face-fill").map((f) => f.element as HTMLElement);

/** Every element in the die's 3D chain that is NOT a face fill. */
const nonFillChain = (w: ReturnType<typeof mountDie>) =>
    [".idle-hover", ".cube-bob", ".cube-pose", ".cube", ".cube-side"].flatMap((sel) =>
        w.findAll(sel).map((x) => x.element as HTMLElement),
    );

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

describe("the unfurl — six petals on the face fills", () => {
    // The die loads the engine on demand; resolve the chunk once up front so
    // each case's frames count the motion, not the module load.
    beforeAll(async () => {
        await loadAnimationEngine();
    });

    it("paints .face-fill only, never the placed face or the die's channel nodes", async () => {
        stubReducedMotion(false);
        stubRafClock();
        const w = mountDie("daraksha");
        const chain = nonFillChain(w);
        const before = chain.map((el) => el.style.transform);

        // Mid-unfurl: the stagger has started every petal (6 × 70 ms < 20 × 32 ms).
        let fills: HTMLElement[] = [];
        for (let i = 0; i < 80; i++) {
            await frame();
            fills = fillsOf(w);
            if (fills.every((f) => f.style.transform !== "")) break;
        }
        expect(fills).toHaveLength(6);
        for (const f of fills) {
            expect(f.style.transform).toMatch(/scale\(/);
            expect(f.style.opacity).not.toBe("");
        }
        expect(chain.map((el) => el.style.transform)).toEqual(before);
        w.unmount();
    });

    it("releases every fill's inline transform and opacity when it finishes", async () => {
        stubReducedMotion(false);
        stubRafClock();
        const w = mountDie("daraksha");
        let started = false;
        // 900 ms + 5 × 70 ms of stagger ≈ 40 frames at 32 ms; allow headroom.
        for (let i = 0; i < 200; i++) {
            await frame();
            const fills = fillsOf(w);
            if (fills.some((f) => f.style.transform !== "")) started = true;
            if (started && fills.every((f) => f.style.transform === "" && f.style.opacity === "")) break;
        }
        expect(started).toBe(true);
        for (const f of fillsOf(w)) {
            expect(f.style.transform).toBe("");
            expect(f.style.opacity).toBe("");
        }
        w.unmount();
    });

    it("plays when the viewer chooses Daraksha after mount", async () => {
        stubReducedMotion(false);
        stubRafClock();
        const w = mountDie("crayon");
        await frames(10);
        expect(fillsOf(w).every((f) => f.style.transform === "")).toBe(true);
        await w.setProps({ skin: "daraksha" });
        let started = false;
        for (let i = 0; i < 80 && !started; i++) {
            await frame();
            started = fillsOf(w).some((f) => f.style.transform !== "");
        }
        expect(started).toBe(true);
        w.unmount();
    });

    it("under reduced motion it does not play and writes no inline style", async () => {
        stubReducedMotion(true);
        stubRafClock();
        const w = mountDie("daraksha");
        await nextTick();
        for (let i = 0; i < 40; i++) {
            await frame();
            for (const f of fillsOf(w)) {
                expect(f.style.transform).toBe("");
                expect(f.style.opacity).toBe("");
            }
        }
        expect(fillsOf(w)).toHaveLength(6);
        w.unmount();
    });

    it("the skin rides the die as data-cube-skin; crayon and Daraksha share the face template", async () => {
        stubReducedMotion(true);
        for (const skin of ["crayon", "daraksha"] as const) {
            const w = mountDie(skin);
            expect(w.find(".cube-bob").attributes("data-cube-skin")).toBe(skin);
            expect(fillsOf(w)).toHaveLength(6);
            expect(w.find(".ppmycota-cube").exists()).toBe(false);
            w.unmount();
        }
        const pp = mountDie("ppmycota");
        expect(pp.findAll(".ppmycota-cube")).toHaveLength(6);
        expect(pp.find(".face-fill").exists()).toBe(false);
        pp.unmount();
    });
});

describe("the sway — the Hover channel re-keyed, not a fourth channel", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("under Daraksha the Hover channel is the garland; leaving restores the bob", async () => {
        const skin = ref<CubeSkin>("crayon");
        const [demo] = withSetup(() =>
            useCubeDemo(ref(createMatrix()), ref(createMatrix()), skin),
        );
        const group = demo.animationGroup.value;
        const hover = demo.hoverAnim.value;
        const childCount = () => group.getEntries().length;
        expect(childCount()).toBe(3);
        const sampled = () => String({ ...hover.at(0.25) }.transform);
        expect(sampled()).toMatch(/^translateY\(/);

        skin.value = "daraksha";
        await nextTick();
        expect(demo.hoverAnim.value).toBe(hover);
        expect(childCount()).toBe(3);
        expect(sampled()).toMatch(/rotateZ\(/);

        skin.value = "ppmycota";
        await nextTick();
        expect(demo.hoverAnim.value).toBe(hover);
        expect(childCount()).toBe(3);
        expect(sampled()).toMatch(/^translateY\(/);
    });
});

describe("the enum migration — one skin, one writer", () => {
    const sources = (dir: string): string[] =>
        readdirSync(dir).flatMap((name) => {
            const path = join(dir, name);
            if (statSync(path).isDirectory()) return sources(path);
            return /\.(ts|vue)$/.test(name) ? [path] : [];
        });
    const files = sources(DEMO).map((path) => ({
        path: path.slice(DEMO.length + 1),
        src: stripComments(readFileSync(path, "utf8")),
    }));

    it("no ppMode identifier remains in demo/", () => {
        expect(files.filter((f) => /\bppMode\b|pp-mode/.test(f.src)).map((f) => f.path)).toEqual([]);
    });

    it("cubeSkin is read by CubeScene and written only by MbabbMenu", () => {
        const mentions = files.filter((f) => /\bcubeSkin\b/.test(f.src)).map((f) => f.path).sort();
        expect(mentions).toEqual([
            "app/dock/menu/MbabbMenu.vue",
            "scenes/cube/CubeScene.vue",
            "state/controlOptionsStore.ts",
        ]);
        const writers = files
            .filter((f) => /\.cubeSkin\s*(=(?!=)|\?\?=)/.test(f.src))
            .map((f) => f.path);
        expect(writers).toEqual(["app/dock/menu/MbabbMenu.vue"]);
    });
});
