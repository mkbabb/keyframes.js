// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shared · A2-KE-L1-15 — the demo tree is named by responsibility.
 *
 * One `describe` per limb of the row. Each reads the tree and the import graph
 * at the bytes: where a file lives, and who reaches it.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const has = (rel: string): boolean => existsSync(resolve(root, rel));
const read = (rel: string): string => readFileSync(resolve(root, rel), "utf8");
/** Every source file under `rel` (repo-relative paths). */
const walk = (rel: string): string[] =>
    readdirSync(resolve(root, rel)).flatMap((name) => {
        const child = join(rel, name);
        if (statSync(resolve(root, child)).isDirectory()) return walk(child);
        return /\.(vue|ts|css)$/.test(name) ? [child] : [];
    });
/** The module specifiers a file imports (static, dynamic and `src=`). */
const specifiers = (rel: string): string[] =>
    [...read(rel).matchAll(/(?:from|import\()\s*["']([^"']+)["']/g)].map((m) => m[1]!);

describe("limb (h) — a key lives with the keys, and a file is named for its component", () => {
    it("SCENE_ANNOUNCER_KEY is declared in injectionKeys.ts, not in a component", () => {
        expect(read("demo/components/instrument/transport/injectionKeys.ts")).toMatch(
            /^export const SCENE_ANNOUNCER_KEY\b/m,
        );
        const declared = walk("demo").filter((f) => /^export const SCENE_ANNOUNCER_KEY\b/m.test(read(f)));
        expect(declared).toEqual(["demo/components/instrument/transport/injectionKeys.ts"]);
        // no reader reaches a `.vue` file for a key
        for (const f of walk("demo")) {
            if (!/\bSCENE_ANNOUNCER_KEY\b/.test(read(f))) continue;
            for (const s of specifiers(f)) expect(`${f} <- ${s}`).not.toMatch(/EditorShell\.vue$/);
        }
    });

    it("the Suspense fallback is SceneSkeleton.vue", () => {
        expect(has("demo/app/SceneSkeleton.vue")).toBe(true);
        expect(has("demo/app/App.skeleton.vue")).toBe(false);
        expect(read("demo/app/App.vue")).toMatch(/import SceneSkeleton from "\.\/SceneSkeleton\.vue";/);
        // the name is the file's, so nothing has to declare it
        expect(read("demo/app/SceneSkeleton.vue")).not.toMatch(/defineOptions/);
    });
});

describe("limb (c) — the document-level chrome is the app's, mounted once", () => {
    it("DemoGlobalChrome lives in demo/app and App.vue is its one mount", () => {
        expect(has("demo/app/DemoGlobalChrome.vue")).toBe(true);
        expect(has("demo/components/instrument/transport/components")).toBe(false);
        const mounts = walk("demo").filter((f) => /<DemoGlobalChrome\b/.test(read(f).replace(/<!--[\s\S]*?-->/g, "")));
        expect(mounts).toEqual(["demo/app/App.vue"]);
        // above every scene key: a sibling of the Toaster, outside EditorShell's slots
        const app = read("demo/app/App.vue").replace(/<!--[\s\S]*?-->/g, "");
        expect(app.indexOf("<DemoGlobalChrome")).toBeGreaterThan(app.indexOf("</EditorShell>"));
    });
});

describe("limb (d) — shell/ is the instrument's host; the app's own chrome lives in demo/app", () => {
    const names = (rel: string): string[] => (has(rel) ? readdirSync(resolve(root, rel)).sort() : []);

    it("shell/ holds the host alone", () => {
        expect(names("demo/components/instrument/shell")).toEqual(["EditorShell.vue", "index.ts"]);
    });

    it("the hero and the brand menu's surfaces are app directories", () => {
        expect(names("demo/app/hero")).toEqual([
            "AnimatedText.vue",
            "EditorStartScreen.vue",
            "HeroAurora.vue",
            "HomeMini.vue",
            "TypingDots.vue",
        ]);
        expect(names("demo/app/dock/menu")).toEqual([
            "KeyboardShortcutsModal.vue",
            "MbabbMenu.vue",
            "SharePopover.vue",
            "groupShortcuts.ts",
            "useShareState.ts",
        ]);
    });

    it("no component reaches up into either", () => {
        const up = walk("demo/components").flatMap((f) =>
            specifiers(f)
                .filter((s) => /^@app\/(hero|dock\/menu)\//.test(s) || /\/app\/(hero|dock\/menu)\//.test(s))
                .map((s) => `${f} <- ${s}`),
        );
        expect(up).toEqual([]);
    });
});

describe("limb (b) — one composables convention: a sibling composables/ directory", () => {
    it("transport/ keeps its composables in transport/composables, not in directories named after a component", () => {
        const transport = "demo/components/instrument/transport";
        expect(has(`${transport}/AnimationControlsGroup`)).toBe(false);
        expect(has(`${transport}/TransportDock`)).toBe(false);
        expect(readdirSync(resolve(root, `${transport}/composables`)).sort()).toEqual([
            "useAnimationGroupActions.ts",
            "useAnimationGroupPlayback.ts",
            "useControlsKeyboardShortcuts.ts",
            "useIconSpin.ts",
            "useMenubarMeasure.ts",
            "usePlayActuation.ts",
        ]);
    });
});

describe("limb (a) — the pane is instrument/pane; transport/ keeps the dock and playback", () => {
    const names = (rel: string): string[] => (has(rel) ? readdirSync(resolve(root, rel)).sort() : []);

    it("transport/ holds the controls group, the dock, their keys and their composables", () => {
        expect(names("demo/components/instrument/transport")).toEqual([
            "AnimationControlsGroup.css",
            "AnimationControlsGroup.vue",
            "TransportDock.vue",
            "composables",
            "injectionKeys.ts",
            "transportSource.ts",
        ]);
    });

    it("pane/ holds the pane, its ribbon, its channel controls and (limb b) its composables/", () => {
        expect(names("demo/components/instrument/pane")).toEqual([
            "ControlsPaneWrapper.css",
            "ControlsPaneWrapper.vue",
            "RibbonBar.vue",
            "channel-controls",
            "composables",
        ]);
        expect(names("demo/components/instrument/pane/composables")).toEqual([
            "useControlsLayout.ts",
            "useFoldLanding.ts",
            "usePaneHover.ts",
        ]);
    });

    it("the pane reaches transport/ for keys and the channel type only, and transport/ mounts the pane once", () => {
        const intoTransport = walk("demo/components/instrument/pane").flatMap((f) =>
            specifiers(f).filter((s) => /(^|\/)transport\//.test(s)).map((s) => s.replace(/^.*transport\//, "")),
        );
        expect([...new Set(intoTransport)].sort()).toEqual(["injectionKeys", "transportSource"]);
        const intoPane = walk("demo/components/instrument/transport").flatMap((f) =>
            specifiers(f).filter((s) => /(^|\/)pane\//.test(s)).map((s) => `${f.replace(/^.*transport\//, "")} <- ${s}`),
        );
        expect(intoPane).toEqual(["AnimationControlsGroup.vue <- ../pane/ControlsPaneWrapper.vue"]);
    });
});

describe("limb (f) — one utils root: demo/utils", () => {
    it("iosTextEntry and toastGuard live in demo/utils; instrument/ keeps no utils directory", () => {
        expect(has("demo/utils/iosTextEntry.ts")).toBe(true);
        expect(has("demo/utils/toastGuard.ts")).toBe(true);
        expect(has("demo/components/instrument/utils")).toBe(false);
    });

    it("no importer reaches the old root", () => {
        const stale = [...walk("demo"), ...walk("test")].flatMap((f) =>
            specifiers(f)
                .filter((s) => /components\/instrument\/utils\//.test(s))
                .map((s) => `${f} <- ${s}`),
        );
        expect(stale).toEqual([]);
    });
});

describe("limb (g1) — the Sequence descriptor is the facility's type, not a component's", () => {
    const facility = "demo/composables/scene-facility/sequenceTimeline.ts";

    it("SequenceTimelineLane and SequenceTimelineSource are declared beside the facility, once", () => {
        expect(has(facility)).toBe(true);
        for (const name of ["SequenceTimelineLane", "SequenceTimelineSource"]) {
            const pattern = new RegExp(`^export interface ${name}\\b`, "m");
            expect(walk("demo").filter((f) => pattern.test(read(f)))).toEqual([facility]);
        }
    });

    it("no composable reaches up into demo/components", () => {
        const up = walk("demo/composables").flatMap((f) =>
            specifiers(f)
                .filter((s) => /^@components\//.test(s) || /(^|\/)components\//.test(s))
                .map((s) => `${f} <- ${s}`),
        );
        expect(up).toEqual([]);
    });
});

describe("limb (g2) — a composable with hosts in two layers lives in demo/composables", () => {
    it("useEasingPickerSeat lives in demo/composables, not under the pane", () => {
        expect(has("demo/composables/useEasingPickerSeat.ts")).toBe(true);
        expect(has("demo/components/instrument/pane/channel-controls/composables/useEasingPickerSeat.ts")).toBe(false);
    });

    it("both hosts import it from @composables, and no scene reaches into the pane's composables", () => {
        for (const host of [
            "demo/components/instrument/pane/channel-controls/TimingFunctionPanel.vue",
            "demo/scenes/easing/EasingSidebar.vue",
        ]) {
            expect(specifiers(host)).toContain("@composables/useEasingPickerSeat");
        }
        const deep = walk("demo/scenes").flatMap((f) =>
            specifiers(f)
                .filter((s) => /pane\/channel-controls\/composables\//.test(s))
                .map((s) => `${f} <- ${s}`),
        );
        expect(deep).toEqual([]);
    });
});
