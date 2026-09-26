import { onBeforeUnmount, onMounted, watch } from "vue";

/** A player a dock miniature drives: an Animation, AnimationGroup or Sequence. */
interface MiniPlayer {
    play(): unknown;
    stop(): unknown;
}

/**
 * useLiveMini — the ONE live lifecycle the six dock miniatures share
 * (X.KF.W13X.lib, A2-KE-L1-17). Each mini keeps its own art and motion; this
 * owns only the block every one of them had copied: seat the targets once the
 * mini's elements exist, play while the dock marks the mini `live` (its chosen
 * scene), rest otherwise, and stop on unmount so no ticker outlives the glyph.
 *
 * @param players the mini's players (one, or one per lane / row).
 * @param live    getter for the mini's `live` prop.
 * @param seat    runs once at mount, BEFORE the first play — the mini binds its
 *                players to its template elements here (`setTargets`, `seek`).
 */
export function useLiveMini(
    players: MiniPlayer | readonly MiniPlayer[],
    live: () => boolean,
    seat?: () => void,
): void {
    const all: readonly MiniPlayer[] = Array.isArray(players)
        ? players
        : [players as MiniPlayer];

    onMounted(() => {
        seat?.();
        watch(
            live,
            (on) => {
                for (const player of all) {
                    if (on) void player.play();
                    else player.stop();
                }
            },
            { immediate: true },
        );
    });
    onBeforeUnmount(() => {
        for (const player of all) player.stop();
    });
}
