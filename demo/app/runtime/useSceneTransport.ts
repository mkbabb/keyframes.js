import { computed, type ComputedRef } from "vue";
import type { useSceneMachine } from "@state";

/**
 * The ORDERED transport-action model (T.B10, VERDICT #6's second clause — "the
 * play button should be the first element"). Before this, "play first" had NO
 * data-layer lever: `TransportDock.vue` rendered persistent controls in fixed
 * markup order (name/select, Reset, Clear-all, then Play LAST), so reordering
 * Play was a per-dock markup edit every redesign paid again. This model expresses
 * "primary action" (play, ALWAYS first) + the ordered "secondary" rail (reset,
 * clear, …) as DATA, so "play first" — and any future reorder — is a data change,
 * consumed uniformly by whatever dock-grammar component T.C lands on.
 *
 * MODEL ONLY (additive; T.B10). The dock RENDER that draws `primary` first is
 * T.C1's rail-core rebuild (the consumer) — this composable does NOT touch the
 * dock. `primary.kind === "play"` is the one source of order truth
 * `proof:transport-action-order` (model clause) and `proof:dock-grammar`'s "play
 * first" render clause (T.C1) must agree on.
 */
export type TransportActionKind = "play" | "reset" | "clear";

export interface TransportAction {
    /** The action's stable semantic kind — the ordering + render key. */
    readonly kind: TransportActionKind;
    /** The transport-visible label (the play face flips with `isPlaying`). */
    readonly label: string;
    /** Present iff THIS composable owns the actuation (the play/pause toggle).
     *  `reset`/`clear` are host-owned (the dock/scene emits them) — descriptor
     *  only, `run` absent, until T.C wires their handlers through this model. */
    readonly run?: () => void;
}

export interface TransportActionModel {
    /** The PRIMARY action — always `kind: "play"`, always rendered first. */
    readonly primary: TransportAction;
    /** The ordered secondary rail (reset, clear, …), drawn after `primary`. */
    readonly secondary: readonly TransportAction[];
}

/**
 * The scene transport intent — `isPlaying` + `play`/`pause`/`togglePlay` +
 * the ordered `actions` model (T.B10) — derived from the scene machine
 * (R.W5 B.2 — kills the byte-for-byte triplication across useEasingDemo /
 * useSpringDemo / useSequenceDemo).
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
    actions: ComputedRef<TransportActionModel>;
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

    // The ordered action model (T.B10). `primary` is ALWAYS `kind: "play"` — the
    // data-layer expression of "play first" (VERDICT #6). `secondary` is the
    // ordered reset→clear rail the dock draws AFTER primary. Additive: existing
    // consumers destructure `{ isPlaying, play, pause, togglePlay }` untouched.
    const actions = computed<TransportActionModel>(() => ({
        primary: {
            kind: "play",
            label: isPlaying.value ? "Pause" : "Play",
            run: togglePlay,
        },
        secondary: [
            { kind: "reset", label: "Reset animation" },
            { kind: "clear", label: "Clear all & reload" },
        ],
    }));

    return { isPlaying, play, pause, togglePlay, actions };
}
