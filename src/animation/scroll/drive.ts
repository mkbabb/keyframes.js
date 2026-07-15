/**
 * The composition face of the scroll zone: parse once, then drive the
 * continuous range, optional discrete trigger, and native-vs-JS backend from
 * that same typed result.  The lower-level constructors remain public for
 * consumers that need one lane in isolation; this helper is the symmetric
 * `parseScrollCSS` counterpart for the common composed case.
 */
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";
import type {
    NativeTimelineSpec,
    ScrollTimelineAxis,
} from "../orchestration/timeline/native";
import { createScrollScene, type ScrollScene, type ScrollSceneOptions } from "./scene";
import { createTriggerScene, type TriggerScene } from "./trigger";
import { dispatchScrollBackend, type ScrollBackend } from "./dispatch";
import type { AnimationTimelineValue, CSSTimelineOptions } from "@mkbabb/value.js/parsing";

/** Options for the composed `driveScrollCSS` entry. */
export interface ScrollDriveOptions<V extends Vars = Vars>
    extends Omit<ScrollSceneOptions, "range"> {
    /** Explicit native timeline mapping; otherwise it is derived from CSS. */
    nativeSpec?: NativeTimelineSpec;
    /** Animation to offer to the native eligibility/attachment lane. */
    animation?: KeyframesAnimation<V>;
    /** Force the JS backend for a velocity/non-DOM driver. */
    velocity?: boolean;
    /** Native scroll source when the parsed timeline is `scroll()`. */
    source?: Element | null;
    /** Native view subject when the parsed timeline is `view()`. */
    subject?: Element;
    /** Native timeline axis override (CSS's parsed axis remains the default). */
    axis?: ScrollTimelineAxis;
    /** Native view inset override. */
    inset?: string;
}

/** A positional target may be an animation (for WAAPI) or a view subject. */
export type ScrollDriveTarget<V extends Vars = Vars> =
    | KeyframesAnimation<V>
    | Element
    | null
    | undefined;

/** The single handle returned by `driveScrollCSS`. */
export interface ScrollCSSDrive<V extends Vars = Vars> {
    readonly scene: ScrollScene;
    readonly trigger?: TriggerScene;
    readonly backend: ScrollBackend;
    readonly reason?: string;
}

function isAnimation<V extends Vars>(value: ScrollDriveTarget<V>): value is KeyframesAnimation<V> {
    return value != null && typeof value === "object" && "targets" in value && "play" in value;
}

function isElement(value: unknown): value is Element {
    return (
        typeof Element !== "undefined" && value instanceof Element
    );
}

function nativeSpecFromCSS<V extends Vars>(
    options: CSSTimelineOptions,
    target: ScrollDriveTarget<V>,
    driver: ScrollDriveOptions<V>,
): NativeTimelineSpec | undefined {
    if (driver.nativeSpec != null) return driver.nativeSpec;
    const timeline: AnimationTimelineValue | undefined = options.timeline;
    if (timeline?.kind === "scroll") {
        return {
            kind: "scroll",
            ...(driver.source === undefined ? {} : { source: driver.source }),
            ...(driver.axis ?? timeline.axis
                ? { axis: driver.axis ?? timeline.axis }
                : {}),
        };
    }
    if (timeline?.kind === "view") {
        const subject =
            driver.subject ??
            (isElement(target)
                ? target
                : isAnimation(target) && isElement(target.targets[0])
                  ? target.targets[0]
                  : undefined);
        if (subject == null) return undefined;
        return {
            kind: "view",
            subject,
            ...(driver.axis ?? timeline.axis
                ? { axis: driver.axis ?? timeline.axis }
                : {}),
            ...(driver.inset != null || timeline.inset != null
                ? {
                      inset:
                          driver.inset ??
                          `${timeline.inset!.start}${timeline.inset!.end ? ` ${timeline.inset!.end}` : ""}`,
                  }
                : {}),
        };
    }
    return undefined;
}

/**
 * Compose the parsed scroll CSS into its range scene, optional trigger scene,
 * and conservative native/JS backend decision.  No declaration is reparsed:
 * the exact `CSSTimelineOptions` returned by `parseScrollCSS` is fanned out to
 * every lane, preserving parse→drive symmetry.
 */
export function driveScrollCSS<V extends Vars = Vars>(
    options: CSSTimelineOptions,
    target?: ScrollDriveTarget<V>,
    driverOptions: ScrollDriveOptions<V> = {},
): ScrollCSSDrive<V> {
    const animation = isAnimation(target)
        ? target
        : driverOptions.animation;
    const {
        nativeSpec: _nativeSpec,
        animation: _animation,
        velocity: _velocity,
        source: _source,
        subject: _subject,
        axis: _axis,
        inset: _inset,
        ...sceneOptions
    } = driverOptions;
    const scene = createScrollScene({ ...sceneOptions, range: options.range });
    const trigger = options.trigger == null ? undefined : createTriggerScene(options);
    const nativeSpec = nativeSpecFromCSS(options, target, driverOptions);
    const dispatch = dispatchScrollBackend({
        animation,
        nativeSpec,
        scrub: driverOptions.scrub != null && driverOptions.scrub > 0,
        snap: driverOptions.snap != null && driverOptions.snap.length > 0,
        velocity: driverOptions.velocity,
    });
    return {
        scene,
        ...(trigger == null ? {} : { trigger }),
        backend: dispatch.backend,
        ...(dispatch.backend === "js" ? { reason: dispatch.reason } : {}),
    };
}
