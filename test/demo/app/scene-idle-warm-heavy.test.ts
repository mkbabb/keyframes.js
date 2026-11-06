/**
 * The idle scene warm skips a scene whose chunk carries a heavy vendor.
 *
 * MEASURED (kf-load L0, docs/evidence/o1105-kf-load): a cold Home at 390
 * evaluated `vendor-three` (~530 KB) within 8 s on every visit: the idle warm
 * (`warmScenesAtIdle`) imported every scene chunk, the Amiga's with it. The
 * Amiga is now fetched on intent (the Scene menu opening, the switch's
 * `loadScene`) and never at idle; the other scenes still warm.
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

afterEach(() => vi.unstubAllGlobals());

describe("the idle scene warm", () => {
    it("warms every light scene and skips the Amiga; intent still loads it", async () => {
        vi.stubGlobal("requestIdleCallback", (cb: () => void) => (cb(), 1));
        const { warmScenesAtIdle, loadScene } = await import("../../../demo/app/scene/scenes");
        warmScenesAtIdle();
        await vi.waitFor(() => expect(loaded.size).toBe(5));
        expect([...loaded].sort()).toEqual(["easing", "home", "sequence", "spring", "square"]);
        await loadScene("amiga");
        expect(loaded.has("amiga")).toBe(true);
    });
});
