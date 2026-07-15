import { computed, onScopeDispose, ref, watch, type Ref } from "vue";
import { useDocumentVisibility } from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";

type Tick = (time: DOMHighResTimeStamp) => void;
type Subscriber = { tick: Tick; enabled: () => boolean };

const playback = new RAFPlayback();
const subscribers = new Set<Subscriber>();

function reconcile(visible: boolean) {
    const shouldRun = visible && [...subscribers].some((entry) => entry.enabled());
    if (!shouldRun) {
        playback.stop();
        return;
    }
    if (playback.running) return;
    playback.loop((time) => {
        for (const entry of subscribers) {
            if (entry.enabled()) entry.tick(time);
        }
        return [...subscribers].some((entry) => entry.enabled());
    });
}

/** One document-visible RAF driver shared by every demo control subscriber. */
export function useDemoTicker(tick: Tick, guard?: Ref<boolean>) {
    const locallyActive = ref(guard == null);
    const visibility = useDocumentVisibility();
    const enabled = computed(() => (guard?.value ?? locallyActive.value));
    const entry: Subscriber = { tick, enabled: () => enabled.value };
    subscribers.add(entry);

    const refresh = () => reconcile(visibility.value === "visible");
    watch([enabled, visibility], refresh, { immediate: true });

    const start = () => {
        locallyActive.value = true;
        refresh();
    };
    const stop = () => {
        locallyActive.value = false;
        refresh();
    };
    onScopeDispose(() => {
        subscribers.delete(entry);
        refresh();
    });
    return { start, stop, isActive: enabled };
}
