import { withReducedMotion } from "../internal/reduced-motion";
import type { ReducedMotionPolicy } from "../internal/reduced-motion";
import type { RAFPlayback, Tickable } from "./playback";

export interface ManagedStepper<Callback> extends Tickable {
    readonly _playback: RAFPlayback;
    _onFrame: Callback | undefined;
    readonly respectReducedMotion: ReducedMotionPolicy;
    readonly disposed?: boolean;
    snap(): void;
    _emitManagedFrame(): void;
}

export function managedStart(stepper: ManagedStepper<unknown>): void {
    stepper._playback.drive(stepper, () => stepper._emitManagedFrame());
}

export function managedPlay<Callback>(stepper: ManagedStepper<Callback>, callback?: Callback): void {
    if (stepper.disposed) return;
    stepper._onFrame = callback;
    withReducedMotion(stepper.respectReducedMotion, () => {
        stepper.snap();
        stepper._emitManagedFrame();
    }, () => {
        if (stepper.settled) stepper._emitManagedFrame();
        else managedStart(stepper);
    });
}

export function managedStop(stepper: ManagedStepper<unknown>): void {
    stepper._onFrame = undefined;
    stepper._playback.stop();
}
