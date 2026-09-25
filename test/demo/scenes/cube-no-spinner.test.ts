// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { mat4 } from "gl-matrix";

import CubeTarget from "../../../demo/scenes/cube/CubeTarget.vue";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag/transform";

/** X.KF.W13X `.cube` · KFA-89 · KFA-144 — the dead cube loader is deleted. */
describe("KFA-89 · KFA-144 — the die hosts no spinner in its 3D chain", () => {
    it("a caller's showLoader never mounts a spinner inside .cube", async () => {
        const transform: TransformState = {
            rotate: { x: 0, y: 0, z: 0 },
            translate: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            matrix: mat4.create(),
        };
        const w = mount(CubeTarget, {
            props: { isPlaying: false, ppMode: false, transform },
            attrs: { showLoader: true },
        });
        await nextTick();
        expect(w.find(".cube .animate-spin").exists()).toBe(false);
        w.unmount();
    });
});
