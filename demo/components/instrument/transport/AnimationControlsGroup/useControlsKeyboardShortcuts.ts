import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import type { Ref } from "vue";

interface UseControlsKeyboardShortcutsDeps {
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
 * The controls whose NATIVE or ARIA contract activates on Space. A keydown
 * whose target sits inside one of these belongs to that control: the page-level
 * Space shortcut stands aside and leaves the activation default intact.
 */
const SPACE_ACTIVATION_TARGETS = [
    "button",
    "summary",
    '[role="button"]',
    '[role="checkbox"]',
    '[role="switch"]',
    '[role="radio"]',
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '[role="option"]',
    '[role="tab"]',
].join(", ");

export const isSpaceActivationTarget = (target: EventTarget | null): boolean =>
    target instanceof Element && target.closest(SPACE_ACTIVATION_TARGETS) !== null;

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

    // X.KF.W13.b · TD-40 (+ TD-2) — Space is scoped AWAY from activation targets.
    // The registry's dispatcher skips only editable targets and calls
    // `preventDefault` BEFORE the handler, so a `preventDefault: true`
    // registration cancelled the browser's own Space→click activation on every
    // focused button in the demo (Reset, Collapse-timeline, …) and ran playback
    // instead; on the focused Play it was the SECOND actuator beside the
    // button's native keyup arm (TD-2). One policy: a control that activates on
    // Space owns its Space; the page-level shortcut fires for every other
    // target, and the handler — not the registration — owns `preventDefault`
    // so the page-scroll suppression survives exactly where the shortcut fires.
    // `e.repeat` is guarded here as the local arm already guards it — a held
    // Space on the page is one toggle, not a rapid toggle at the OS repeat rate.
    // The producer half's BUTTON-target policy is relayed on the standing
    // registry row, never patched here. Its `defaultPrevented` half SHIPPED in
    // glass 10.0.1 (the dispatcher returns on an event a focused widget already
    // consumed): that is the one guard keeping the Arrow/Home/End scrub
    // shortcuts below from double-actuating beside a focused Slider thumb or
    // the Square box's own nudges (KFA-95; transport-nav-key-ownership.test.ts).
    registerShortcut("Space", (e) => {
        if (e.repeat || isSpaceActivationTarget(e.target)) return;
        e.preventDefault();
        toggleAnimationGroup();
    }, { label: "Play / Pause", group: "Playback" });
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
