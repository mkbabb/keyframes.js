/**
 * group/render-observers.ts — the group's per-frame paint observers
 * (KFA-31 · KFA-85, X.KF.W13X.r4lib).
 *
 * A consumer that derives a second paint from the group's composed pose (the
 * cube's re-lighting reads orbit · roll · bob · pose · spin) needs the group's
 * own frame: one writer, no second rAF, and a scrub that re-notifies for free.
 * `AnimationGroup.onRender` subscribes here; the group notifies after every
 * frame it paints (each draw-loop tick, each `render()`, each `reset()`). A
 * listener's throw propagates — a failing frame stays loud.
 */
type RenderListener = (t: number) => void;

export class RenderObservers {
    private readonly listeners: RenderListener[] = [];

    /** Add a listener; returns its (idempotent) unsubscribe. */
    subscribe(listener: RenderListener): () => void {
        this.listeners.push(listener);
        return () => {
            const i = this.listeners.indexOf(listener);
            if (i !== -1) this.listeners.splice(i, 1);
        };
    }

    /** Call every listener with the frame's clock, in subscription order. The
     *  steady path allocates nothing (an indexed loop, no iterator). */
    notify(t: number): void {
        const listeners = this.listeners;
        for (let i = 0; i < listeners.length; i++) listeners[i]!(t);
    }
}
