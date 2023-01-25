export declare function clamp(x: number, lowerLimit: number, upperLimit: number): number;
export declare function easeInQuad(t: number, from: number, distance: number, duration: number): number;
export declare function easeOutQuad(t: number, from: number, distance: number, duration: number): number;
export declare function easeInOutQuad(t: number, from: number, distance: number, duration: number): number;
export declare function easeInCubic(t: number, from: number, distance: number, duration: number): number;
export declare function easeOutCubic(t: number, from: number, distance: number, duration: number): number;
export declare function easeInOutCubic(t: number, from: number, distance: number, duration: number): number;
export declare function smoothStep3(t: number, from: number, distance: number, duration: number): number;
export declare function lerpIn(t: number, from: number, distance: number, duration: number): number;
export declare function lerp(t: number, from: number, to: number): number;
export declare function logerp(t: number, from: number, to: number): number;
export declare function deCasteljau(t: number, points: number[]): number;
export declare function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number[];
export declare function interpBezier(t: number, points: number[][]): number[];
export declare function easeInBounce(t: number, from: number, distance: number, duration: number): number;
export declare function bounceInEase(t: number, from: number, distance: number, duration: number): number;
export declare function bounceInEaseHalf(t: number, from: number, distance: number, duration: number): number;
