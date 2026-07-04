import { computed, type ComputedRef } from "vue";
import type { useSceneMachine } from "@state";

/**
 * The scene transport intent — `isPlaying` + `play`/`pause`/`togglePlay` —
 * derived from the scene machine (R.W5 B.2 — kills the byte-for-byte
 * triplication across useEasingDemo / useSpringDemo / useSequenceDemo).
 *
 * The machine is the SINGLE playback authority: `isPlaying` is a read-only
 * projection of `status === "playing"`, and the transport methods only DISPATCH
 * intent (they never poke a private flag — the adapter's resume/suspend re-arms
 * or stops the loop). `togglePlay` flips the play/pause axis; the
 * `resume = () => play()` alias some scenes carried folds into `play` here.
 */
export function useSceneTransport(
    machine: ReturnType<typeof useSceneMachine>,
): {
    isPlaying: ComputedRef<boolean>;
    play(): void;
    pause(): void;
    togglePlay(): void;
} {
    const isPlaying = computed(() => machine.status.value === "playing");

    const play = (): void => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };
    const pause = (): void => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };
    const togglePlay = (): void => {
        if (isPlaying.value) pause();
        else play();
    };

    return { isPlaying, play, pause, togglePlay };
}
