/**
 * The idle scene warm fetches the light scenes' chunks and evaluates none.
 *
 * MEASURED (kf-load L0, docs/evidence/o1105-kf-load): a cold Home at 390
 * evaluated `vendor-three` (~530 KB) within 8 s on every visit: the idle warm
 * (`warmScenesAtIdle`) imported every scene chunk, the Amiga's with it. The
 * Amiga is now fetched on intent (the Scene menu opening, the switch's
 * `loadScene`) and never at idle.
 *
 * FORTY-SIXTH E1 (J11): the other scenes' chunks were still imported at idle,
 * and an import evaluates its module; at 4x the hero's spin hitched 62 to
 * 92 ms while they evaluated. The warm now reads each chunk's files from the
 * page (`#kf-scene-chunks`, written by the build) and links them as
 * `modulepreload` (scripts) and `preload` (stylesheets): fetched, never run.
 *
 * The scene modules are stubbed so the witness reads which loaders ran.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

const { loaded, stub } = vi.hoisted(() => {
    const loaded = new Set<string>();
    const stub = (id: string) => () => {
        loaded.add(id);
        return { default: { name: id, render: () => null } };
    };
    return { loaded, stub };
});
vi.mock("../../../demo/scenes/amiga/AmigaScene.vue", stub("amiga"));
vi.mock("../../../demo/scenes/square/SquareScene.vue", stub("square"));
vi.mock("../../../demo/scenes/easing/EasingScene.vue", stub("easing"));
vi.mock("../../../demo/scenes/spring/SpringScene.vue", stub("spring"));
vi.mock("../../../demo/scenes/sequence/SequenceScene.vue", stub("sequence"));
vi.mock("../../../demo/app/hero/HeroAurora.vue", stub("home"));
const { prepared } = vi.hoisted(() => ({ prepared: [] as string[] }));
vi.mock("../../../demo/scenes/amiga/useAmigaThree", () => ({
    prepareAmigaRoom: () => {
        prepared.push("amiga");
        return Promise.resolve();
    },
}));

afterEach(() => vi.unstubAllGlobals());

/** The build's list of each scene chunk's files, as the page carries it. */
const CHUNKS = {
    HeroAurora: ["assets/HeroAurora-a.js", "assets/HeroAurora-a.css"],
    SquareScene: ["assets/SquareScene-b.js", "assets/shared-c.js"],
    EasingScene: ["assets/EasingScene-d.js", "assets/shared-c.js", "assets/EasingScene-d.css"],
    SpringScene: ["assets/SpringScene-e.js"],
    SequenceScene: ["assets/SequenceScene-f.js"],
    AmigaScene: ["assets/AmigaScene-g.js", "assets/vendor-three-h.js"],
};

describe("the idle scene warm", () => {
    it("fetches every light scene's files and evaluates none; skips the Amiga; intent still loads it", async () => {
        vi.stubGlobal("requestIdleCallback", (cb: () => void) => (cb(), 1));
        document.head.innerHTML = `<script type="application/json" id="kf-scene-chunks">${JSON.stringify(CHUNKS)}</script>`;
        const { warmScenesAtIdle, loadScene } = await import("../../../demo/app/scene/scenes");
        warmScenesAtIdle();
        await new Promise((r) => setTimeout(r, 0));
        // Nothing evaluated.
        expect(loaded.size).toBe(0);
        // Every light scene's files linked once: scripts as modulepreload,
        // stylesheets as a style preload; no Amiga, no three.js.
        const links = [...document.head.querySelectorAll("link")].map((l) => [l.rel, l.getAttribute("as") ?? "", new URL(l.href).pathname].join(" "));
        expect(links.sort()).toEqual(
            [
                "modulepreload  /assets/HeroAurora-a.js",
                "preload style /assets/HeroAurora-a.css",
                "modulepreload  /assets/SquareScene-b.js",
                "modulepreload  /assets/shared-c.js",
                "modulepreload  /assets/EasingScene-d.js",
                "preload style /assets/EasingScene-d.css",
                "modulepreload  /assets/SpringScene-e.js",
                "modulepreload  /assets/SequenceScene-f.js",
            ].sort(),
        );
        await loadScene("amiga");
        expect(loaded.has("amiga")).toBe(true);
        document.head.innerHTML = "";
    });
});

describe("the Scene list's warm (intent)", () => {
    it("opening the list prepares the Amiga's room, not only its chunk; page idle still does not", async () => {
        vi.stubGlobal("requestIdleCallback", (cb: () => void) => (cb(), 1));
        const { warmScenesAtIdle, warmScene } = await import("../../../demo/app/scene/scenes");
        prepared.splice(0);
        warmScenesAtIdle();
        await new Promise((r) => setTimeout(r, 0));
        expect(prepared).toEqual([]);
        warmScene("amiga");
        await vi.waitFor(() => expect(prepared).toEqual(["amiga"]));
    });
});
