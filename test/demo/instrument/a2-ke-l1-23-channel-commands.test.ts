// KF.W13X.r4pane · A2-KE-L1-23 — the ribbon's and the shortcuts' verbs reach the
// selected channel through ONE typed command object, not an `any` ref relay.
//
// RibbonBar ran its Keyframes verbs through an `any`-typed component ref that
// ChannelControls exposed, the pane emitted to AnimationControlsGroup, the
// group re-read off its registry, and handed back down as a prop; the shortcut
// composable read the same `any` refs. The cure: the channel host publishes a
// typed `ChannelCommands` into the one seat AnimationControlsGroup provides
// (`CHANNEL_COMMANDS_KEY`), RibbonBar injects it, and the shortcuts read it.

import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";
import * as transportKeys from "../../../demo/components/instrument/transport/injectionKeys";
import RibbonBar from "../../../demo/components/instrument/transport/controls-pane/RibbonBar.vue";
import type { StoredAnimationGroupControlOptions } from "@state";

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
});

const stored = (selectedControl: string): StoredAnimationGroupControlOptions =>
    reactive({
        selectedControl,
        selectedAnimation: "a",
        keyframeControls: {
            selectedKeyframesControl: "keyframes",
            dialogOpen: false,
            keyframes: "",
            addKeyframes: "",
        },
        isTimelineExpanded: false,
        isControlsPanelOpen: true,
    });

function spyCommands() {
    const state = reactive({ cssApplied: false });
    const keyframes = {
        get cssApplied() {
            return state.cssApplied;
        },
        applyCSS: vi.fn(() => {
            state.cssApplied = !state.cssApplied;
        }),
        clearAppliedCSS: vi.fn(),
        copyKeyframes: vi.fn(),
        format: vi.fn(),
        copyCompiledCSS: vi.fn(),
    };
    const timeline = { removeSelectedKeyframe: vi.fn(), undo: vi.fn(), redo: vi.fn() };
    return { selectSurface: vi.fn(), keyframes, timeline };
}

describe("A2-KE-L1-23 — one typed command seat for the selected channel", () => {
    it("the seat key and its factory exist", () => {
        expect(Object.keys(transportKeys)).toContain("CHANNEL_COMMANDS_KEY");
        expect(typeof transportKeys.createChannelCommandSeat).toBe("function");
    });

    it("RibbonBar declares no `any` ref prop and drives the published commands", async () => {
        expect(Object.keys(RibbonBar.props ?? {})).not.toContain("activeKeyframesRef");
        const seat = transportKeys.createChannelCommandSeat();
        const commands = spyCommands();
        const release = seat.publish(commands);
        const storedControls = stored("keyframes");
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp(
            defineComponent({ render: () => h(RibbonBar, { storedControls }) }),
        );
        app.provide(transportKeys.CHANNEL_COMMANDS_KEY, seat);
        app.mount(el);
        mounted.push({ unmount: () => app.unmount(), el });
        const byName = (n: string) =>
            [...el.querySelectorAll("button")].find(
                (b) => b.getAttribute("aria-label") === n || b.textContent?.trim() === n,
            )!;
        byName("Copy keyframes").click();
        byName("Format").click();
        byName("Copy compiled CSS").click();
        byName("Apply CSS").click();
        await nextTick();
        expect(commands.keyframes.copyKeyframes).toHaveBeenCalledOnce();
        expect(commands.keyframes.format).toHaveBeenCalledOnce();
        expect(commands.keyframes.copyCompiledCSS).toHaveBeenCalledOnce();
        expect(byName("Apply CSS").getAttribute("aria-pressed")).toBe("true");
        // leaving the Keyframes surface takes the applied identity down with it (RB-6)
        storedControls.selectedControl = "controls";
        await nextTick();
        expect(commands.keyframes.clearAppliedCSS).toHaveBeenCalledOnce();
        // a released seat reads empty
        release();
        expect(seat.current.value).toBeNull();
    });
});
