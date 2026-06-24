import { onMounted, watch, type Ref } from "vue";

/**
 * Q.WC3 S2 — the phone scroll-snap carousel's snapped-card tracking + scroll-to
 * seam. The PLATFORM owns the swipe + the snap (native `scroll-snap-type: x
 * mandatory`); this composable owns ONLY the bookkeeping the demo needs around it:
 *
 *  • `scrollToScene(id)` — centre a card in the scroller (used on a programmatic
 *    pick + to keep the carousel in sync when the scene changes from the dock).
 *  • `onScroll` — a passive scroll handler the carousel binds; reserved for the
 *    snapped-card read (the nearest-centre card) without a per-frame Vue write
 *    (the falloff itself is the compositor's `view-timeline`, never JS).
 *
 * KISS: no bespoke physics, no rAF — the scroll + the snap are the browser's; this
 * is the thin glue that keeps the active scene and the centred card coherent.
 */
export interface ScrollSnapSceneOptions {
    /** The scroller element (the `scroll-snap` container). */
    scroller: Ref<HTMLElement | null>;
    /** The per-scene card elements, in scene order. */
    cards: Ref<HTMLElement[]>;
    /** The currently-active scene id (so the carousel can centre it on mount). */
    getActiveId: () => string;
}

export function useScrollSnapScene(options: ScrollSnapSceneOptions) {
    const { scroller, cards, getActiveId } = options;

    /** Centre the card for `id` in the scroller (no-op if absent). Uses the
     *  native `scrollIntoView` inline-centre — the platform owns the snap. */
    const scrollToScene = (id: string): void => {
        const el = cards.value.find((c) => c.dataset.sceneId === id);
        if (!el) return;
        el.scrollIntoView({ block: "nearest", inline: "center" });
    };

    /** The nearest-centre card id (the "snapped" scene). Read off the scroll
     *  position — the geometry the gate also reads to assert no clip/overlap. */
    const nearestCenterId = (): string | null => {
        const sc = scroller.value;
        if (!sc) return null;
        const mid = sc.scrollLeft + sc.clientWidth / 2;
        let best: { id: string; dist: number } | null = null;
        for (const card of cards.value) {
            const c = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(c - mid);
            const id = card.dataset.sceneId ?? "";
            if (!best || dist < best.dist) best = { id, dist };
        }
        return best?.id ?? null;
    };

    // A passive scroll hook the carousel binds. Reserved for snapped-card sync —
    // intentionally light (the visual falloff is the compositor's view-timeline,
    // not a JS write), so this stays a no-op fast-return on the hot scroll path.
    const onScroll = (): void => {
        // The nearest-centre read is available to consumers via nearestCenterId;
        // we do not write Vue state per scroll frame (the compositor owns the
        // falloff). A consumer that needs the snapped id reads it on settle.
        void nearestCenterId;
    };

    // Centre the active scene's card on mount (so the phone opens on the current
    // scene) + keep it centred if the scene changes from the dock.
    onMounted(() => scrollToScene(getActiveId()));
    watch(
        () => getActiveId(),
        (id) => scrollToScene(id),
    );

    return { onScroll, scrollToScene, nearestCenterId };
}
