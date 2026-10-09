// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4transport · A2-KE-L1-24 (the three-mount variance) · the inert
 * `onTogglePlay` binds. UIA-KF-051 left one transport: the ribbon declares no
 * `togglePlay`, yet its three mounts still bound one (the easing and spring h()
 * props, ChannelOptions' `@toggle-play`), and ChannelOptions' bind fed a relay
 * up through ChannelControls and ControlsPaneWrapper to AnimationControlsGroup
 * that nothing could fire. Each bind is deleted, and the dead relay with it.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

describe("X.KF.W13X.r4transport — the ribbon mounts", () => {
    it("(4) A2-KE-L1-24 — no ribbon mount binds the togglePlay the ribbon never emits; the dead relay is gone", () => {
        const ribbon = read("demo/components/playback/PlaybackRibbon.vue");
        expect(ribbon).not.toMatch(/\(e: "togglePlay"\)/);
        for (const rel of ["demo/scenes/easing/EasingScene.vue", "demo/scenes/spring/SpringScene.vue"]) {
            expect(read(rel)).not.toMatch(/onTogglePlay/);
        }
        const options = read("demo/components/instrument/transport/channel-controls/ChannelOptions.vue");
        expect(options).not.toMatch(/@toggle-play/);
        expect(options).not.toMatch(/"togglePlay"/);
        for (const rel of [
            "demo/components/instrument/transport/channel-controls/ChannelControls.vue",
            "demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue",
            "demo/components/instrument/transport/channel-controls/composables/usePlaybackToggle.ts",
        ]) {
            expect(read(rel)).not.toMatch(/togglePlay|toggle-play|toggleAnimation\b/);
        }
        const host = read("demo/components/instrument/transport/AnimationControlsGroup.vue");
        expect(host.match(/@toggle-play=/g) ?? []).toHaveLength(1);
    });
});
