/** A non-reactive registry for direct-DOM scene painters on the shared hot path. */
export function usePainterRegistry<Args extends readonly unknown[]>(
    currentArgs: () => Args,
) {
    type Painter = (...args: Args) => void;
    const painters = new Set<Painter>();

    const registerPainter = (paint: Painter): (() => void) => {
        painters.add(paint);
        paint(...currentArgs());
        return () => painters.delete(paint);
    };

    const repaint = (): void => {
        const args = currentArgs();
        for (const paint of painters) paint(...args);
    };

    return { registerPainter, repaint };
}
