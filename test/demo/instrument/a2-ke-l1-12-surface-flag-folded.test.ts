// KF.W13X.r4pane · A2-KE-L1-12 — the constant-true `TABS_EXTERNALLY_MANAGED_KEY`
// is folded away.
//
// The key's ONLY provider (`App.vue`) passed the constant `true`, and the App is
// the only mount path to the controls host, so every `!tabsExternallyManaged`
// arm was dead and `isSingleSurfaceScene`'s flat mount unreachable. The flag
// also made the surface authority silently fall back to "standalone" (no DFA
// projection, no derivation-sync writer) wherever the provide was missing. The
// cure deletes the key and folds the host onto the machine-driven branch: the
// selected surface is ALWAYS the machine's projection of the stored pick.

import { beforeAll, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { warmKfEngine } from "../../../demo/kf-engine";
import * as transportKeys from "../../../demo/components/instrument/transport/injectionKeys";
import { useSelectedControlSurface } from "../../../demo/components/instrument/transport/channel-controls/composables/useSelectedControlSurface";
import { useSceneMachine, type StoredAnimationGroupControlOptions } from "@state";

beforeAll(async () => {
    await warmKfEngine();
});

const stored = (selectedControl: string): StoredAnimationGroupControlOptions => ({
    selectedControl,
    selectedAnimation: "fade",
    keyframeControls: {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    },
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
});

describe("A2-KE-L1-12 — the surface flag is folded onto the machine branch", () => {
    it("the constant-true injection key no longer exists", () => {
        expect(Object.keys(transportKeys)).not.toContain("TABS_EXTERNALLY_MANAGED_KEY");
    });

    it("with NO provider, a stale pick is projected by the machine and written back", async () => {
        const machine = useSceneMachine();
        machine.setActiveSurfaces(["controls", "keyframes", "timeline", "easing"]);
        const animation = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 1; }",
        );
        const storedControls = stored("matrix-controls");
        let projected = "";
        let picked = "";
        mount(
            defineComponent({
                setup() {
                    const seat = useSelectedControlSurface({ animation, storedControls });
                    projected = seat.selectedControlSurface.value;
                    picked = seat.projectPick("matrix-controls");
                    return () => h("div");
                },
            }),
        );
        await nextTick();
        expect(projected).toBe("controls");
        expect(picked).toBe("controls");
        expect(storedControls.selectedControl).toBe("controls");
        machine.setActiveSurfaces([]);
    });
});
