export declare function clamp(x: number, lowerLimit: number, upperLimit: number): number;
export declare function scale(t: number, x1: number, x2: number, y1?: number, y2?: number): number;
export declare function lerp(t: number, from: number, to: number): number;
export declare function logerp(t: number, from: number, to: number): number;
export declare function deCasteljau(t: number, points: number[]): number;
export declare function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number[];
export declare function interpBezier(t: number, points: number[][]): number[];
