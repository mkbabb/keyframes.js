/**
 * owner-1112 (item 6, "page transitions ... are not smooth") — the Amiga room
 * ARRIVES: its skeleton leaves through a fade over the room's first frames,
 * where the silhouette vanished in one frame after the swap landed
 * (the motion law: nothing appears or vanishes in a frame).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sfc = readFileSync(resolve(process.cwd(), "demo/scenes/amiga/AmigaTarget.vue"), "utf8");
const template = sfc.slice(0, sfc.indexOf("<script")).replace(/<!--[\s\S]*?-->/g, "");
const style = sfc.slice(sfc.indexOf("<style"));

describe("the Amiga room fades in over its skeleton (owner-1112 item 6)", () => {
    it("the skeleton leaves through a Transition", () => {
        expect(template).toMatch(/<Transition name="amiga-boot">\s*<Skeleton\b[^>]*v-if="roomBooting"/);
        expect(style).toMatch(/\.amiga-boot-leave-active\s*\{[^}]*transition:\s*opacity/);
    });
});
