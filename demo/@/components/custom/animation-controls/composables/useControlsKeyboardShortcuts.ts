import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import type { Ref } from "vue";

export interface UseControlsKeyboardShortcutsDeps {
    /** Toggle play/pause on the active animation group. */
    toggleAnimationGroup: () => void;
    /** Stop + resync the group (Escape / R). */
    reset: () => void;
    /** Spin the transport dock's reset icon (R). */
    resetIconSpin: () => void;
    /** Read the active animation's current t. */
    getActiveT: () => number;
    /** Scrub the active animation to t. */
    scrubActive: (t: number) => void;
    /** Cycle the selected animation by ±1. */
    cycleAnimation: (dir: number) => void;
    /** Switch the active animation's control tab (controls/keyframes/timeline). */
    switchTab: (tab: string) => void;
    /** The active animation's keyframes-controls ref (Copy CSS). */
    activeKeyframesRef: Ref<any>;
    /** The active animation's timeline ref (delete / undo / redo). */
    activeTimelineRef: Ref<any>;
}

/**
 * The playback / navigation / action KEYBOARD SHORTCUTS for the controls group,
 * lifted out of AnimationControlsGroup.vue as a colocated composable (the K.WZ
 * proof:demo-no-oversize seam; zero behavior change).
 *
 * Every binding routes through the ONE existing glass-ui `registerShortcut`
 * registry (not a second window listener), so they inherit the editable-target
 * skip + surface in the KeyboardShortcutsModal. The action closures are passed in
 * from the component, which still owns the playback/ref state they mutate.
 */
export function useControlsKeyboardShortcuts(
    deps: UseControlsKeyboardShortcutsDeps,
): void {
    const {
        toggleAnimationGroup,
        reset,
        resetIconSpin,
        getActiveT,
        scrubActive,
        cycleAnimation,
        switchTab,
        activeKeyframesRef,
        activeTimelineRef,
    } = deps;

    registerShortcut("Space", () => toggleAnimationGroup(), { preventDefault: true, label: "Play / Pause", group: "Playback" });
    registerShortcut("Escape", () => reset(), { label: "Stop animation", group: "Playback" });
    registerShortcut("R", () => { resetIconSpin(); reset(); }, { label: "Reset animation", group: "Playback" });
    registerShortcut("ArrowLeft", () => scrubActive(getActiveT() - 0.01), { preventDefault: true, label: "Scrub back", group: "Playback" });
    registerShortcut("ArrowRight", () => scrubActive(getActiveT() + 0.01), { preventDefault: true, label: "Scrub forward", group: "Playback" });
    registerShortcut("Shift+ArrowLeft", () => scrubActive(getActiveT() - 0.1), { preventDefault: true, label: "Scrub back (large)", group: "Playback" });
    registerShortcut("Shift+ArrowRight", () => scrubActive(getActiveT() + 0.1), { preventDefault: true, label: "Scrub forward (large)", group: "Playback" });
    registerShortcut("Home", () => scrubActive(0), { preventDefault: true, label: "Jump to start", group: "Playback" });
    registerShortcut("End", () => scrubActive(1), { preventDefault: true, label: "Jump to end", group: "Playback" });
    registerShortcut("[", () => cycleAnimation(-1), { label: "Previous animation", group: "Navigation" });
    registerShortcut("]", () => cycleAnimation(1), { label: "Next animation", group: "Navigation" });
    registerShortcut("1", () => switchTab("controls"), { label: "Controls tab", group: "Navigation" });
    registerShortcut("2", () => switchTab("keyframes"), { label: "Keyframes tab", group: "Navigation" });
    registerShortcut("3", () => switchTab("timeline"), { label: "Timeline tab", group: "Navigation" });
    registerShortcut("Mod+S", () => activeKeyframesRef.value?.copyCSS?.(), { preventDefault: true, label: "Copy CSS", group: "Actions" });
    registerShortcut("Delete", () => activeTimelineRef.value?.removeSelectedKeyframe?.(), { label: "Delete keyframe", group: "Actions" });
    // Undo / redo over the timeline keyframe state (F.W14.S1) — bound through the
    // ONE existing registry (not a second window listener), so they inherit the
    // editable-target skip + surface in the KeyboardShortcutsModal. The destructive
    // timeline ops (clear / removeKeyframe / inline CSS edits) become reversible.
    registerShortcut("Mod+Z", () => activeTimelineRef.value?.undo?.(), { preventDefault: true, label: "Undo", group: "Actions" });
    registerShortcut("Mod+Shift+Z", () => activeTimelineRef.value?.redo?.(), { preventDefault: true, label: "Redo", group: "Actions" });
}
