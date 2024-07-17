import { clone } from "@src/utils";
import { ColorSpace, WhitePoint } from "./constants";

const formatNumber = <T>(value: number | T, digits: number = 2) => {
    return ((value as any)?.toFixed(digits) ?? value.toString())
        .trim()
        .replace(/\.0+$/, "");
};

const formatColor = <T>(colorSpace: ColorSpace, values: T[], alpha: T) => {
    return `${colorSpace}(${values.join(" ")} / ${alpha})`;
};

export abstract class Color<T = number> {
    protected components: Map<string, T>;

    constructor(
        public readonly colorSpace: ColorSpace,
        public alpha: T = 1 as T,
    ) {
        this.components = new Map<string, T>();
    }

    toString(): string {
        return formatColor(
            this.colorSpace,
            Array.from(this.components.values()),
            this.alpha,
        );
    }

    toFormattedString(digits: number = 2): string {
        const values = Array.from(this.components.values()).map(formatNumber, digits);
        const alpha = formatNumber(this.alpha, digits);
        return formatColor(this.colorSpace, values, alpha);
    }

    valueOf(): T[] {
        return [...this.values(), this.alpha];
    }

    toJSON(): any {
        const obj = this.entries().reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        obj["alpha"] = this.alpha;

        return obj;
    }

    clone(): this {
        const Constructor = this.constructor as new (...args: any[]) => this;
        const cloned = new Constructor();

        cloned.alpha = clone(this.alpha);

        this.components.forEach((value, key) => {
            cloned.components.set(key, clone(value));
        });

        return cloned;
    }

    keys(): string[] {
        return [...this.components.keys(), "alpha"];
    }

    values(): T[] {
        return [...this.components.values(), this.alpha];
    }

    entries(): [string, T][] {
        return [...this.components.entries(), ["alpha", this.alpha]];
    }

    protected getComponent(key: string): T | undefined {
        return this.components.get(key);
    }

    protected setComponent(key: string, value: T): void {
        this.components.set(key, value);
    }
}

class WhitePointColor<T = number> extends Color<T> {
    constructor(
        colorSpace: ColorSpace,
        alpha: T,
        public whitePoint: WhitePoint,
    ) {
        super(colorSpace, alpha);
    }
}

export class RGBColor<T = number> extends Color<T> {
    constructor(r: T, g: T, b: T, alpha?: T) {
        super("rgb", alpha);
        this.components.set("r", r);
        this.components.set("g", g);
        this.components.set("b", b);
    }

    get r(): T {
        return this.getComponent("r")!;
    }
    set r(value: T) {
        this.setComponent("r", value);
    }

    get g(): T {
        return this.getComponent("g")!;
    }
    set g(value: T) {
        this.setComponent("g", value);
    }

    get b(): T {
        return this.getComponent("b")!;
    }
    set b(value: T) {
        this.setComponent("b", value);
    }
}

export class HSLColor<T = number> extends Color<T> {
    constructor(h: T, s: T, l: T, alpha?: T) {
        super("hsl", alpha);
        this.components.set("h", h);
        this.components.set("s", s);
        this.components.set("l", l);
    }

    get h(): T {
        return this.getComponent("h")!;
    }
    set h(value: T) {
        this.setComponent("h", value);
    }

    get s(): T {
        return this.getComponent("s")!;
    }
    set s(value: T) {
        this.setComponent("s", value);
    }

    get l(): T {
        return this.getComponent("l")!;
    }
    set l(value: T) {
        this.setComponent("l", value);
    }
}

export class HSVColor<T = number> extends Color<T> {
    constructor(h: T, s: T, v: T, alpha?: T) {
        super("hsv", alpha);
        this.components.set("h", h);
        this.components.set("s", s);
        this.components.set("v", v);
    }

    get h(): T {
        return this.getComponent("h")!;
    }
    set h(value: T) {
        this.setComponent("h", value);
    }

    get s(): T {
        return this.getComponent("s")!;
    }
    set s(value: T) {
        this.setComponent("s", value);
    }

    get v(): T {
        return this.getComponent("v")!;
    }
    set v(value: T) {
        this.setComponent("v", value);
    }
}

export class HWBColor<T = number> extends Color<T> {
    constructor(h: T, w: T, b: T, alpha?: T) {
        super("hwb", alpha);
        this.components.set("h", h);
        this.components.set("w", w);
        this.components.set("b", b);
    }

    get h(): T {
        return this.getComponent("h")!;
    }
    set h(value: T) {
        this.setComponent("h", value);
    }

    get w(): T {
        return this.getComponent("w")!;
    }
    set w(value: T) {
        this.setComponent("w", value);
    }

    get b(): T {
        return this.getComponent("b")!;
    }
    set b(value: T) {
        this.setComponent("b", value);
    }
}

export class LABColor<T = number> extends WhitePointColor<T> {
    constructor(l: T, a: T, b: T, alpha?: T) {
        super("lab", alpha, "D50");
        this.components.set("l", l);
        this.components.set("a", a);
        this.components.set("b", b);
    }

    get l(): T {
        return this.getComponent("l")!;
    }
    set l(value: T) {
        this.setComponent("l", value);
    }

    get a(): T {
        return this.getComponent("a")!;
    }
    set a(value: T) {
        this.setComponent("a", value);
    }

    get b(): T {
        return this.getComponent("b")!;
    }
    set b(value: T) {
        this.setComponent("b", value);
    }
}

export class LCHColor<T = number> extends Color<T> {
    constructor(l: T, c: T, h: T, alpha?: T) {
        super("lch", alpha);
        this.components.set("l", l);
        this.components.set("c", c);
        this.components.set("h", h);
    }

    get l(): T {
        return this.getComponent("l")!;
    }
    set l(value: T) {
        this.setComponent("l", value);
    }

    get c(): T {
        return this.getComponent("c")!;
    }
    set c(value: T) {
        this.setComponent("c", value);
    }

    get h(): T {
        return this.getComponent("h")!;
    }
    set h(value: T) {
        this.setComponent("h", value);
    }
}

export class OKLABColor<T = number> extends WhitePointColor<T> {
    constructor(l: T, a: T, b: T, alpha?: T) {
        super("oklab", alpha, "D50");
        this.components.set("l", l);
        this.components.set("a", a);
        this.components.set("b", b);
    }

    get l(): T {
        return this.getComponent("l")!;
    }
    set l(value: T) {
        this.setComponent("l", value);
    }

    get a(): T {
        return this.getComponent("a")!;
    }
    set a(value: T) {
        this.setComponent("a", value);
    }

    get b(): T {
        return this.getComponent("b")!;
    }
    set b(value: T) {
        this.setComponent("b", value);
    }
}

export class OKLCHColor<T = number> extends Color<T> {
    constructor(l: T, c: T, h: T, alpha?: T) {
        super("oklch", alpha);
        this.components.set("l", l);
        this.components.set("c", c);
        this.components.set("h", h);
    }

    get l(): T {
        return this.getComponent("l")!;
    }
    set l(value: T) {
        this.setComponent("l", value);
    }

    get c(): T {
        return this.getComponent("c")!;
    }
    set c(value: T) {
        this.setComponent("c", value);
    }

    get h(): T {
        return this.getComponent("h")!;
    }
    set h(value: T) {
        this.setComponent("h", value);
    }
}

export class XYZColor<T = number> extends WhitePointColor<T> {
    constructor(x: T, y: T, z: T, alpha?: T) {
        super("xyz", alpha, "D65");
        this.components.set("x", x);
        this.components.set("y", y);
        this.components.set("z", z);
    }

    get x(): T {
        return this.getComponent("x")!;
    }
    set x(value: T) {
        this.setComponent("x", value);
    }

    get y(): T {
        return this.getComponent("y")!;
    }
    set y(value: T) {
        this.setComponent("y", value);
    }

    get z(): T {
        return this.getComponent("z")!;
    }
    set z(value: T) {
        this.setComponent("z", value);
    }
}

export class KelvinColor<T = number> extends Color<T> {
    constructor(kelvin: T, alpha?: T) {
        super("kelvin", alpha);
        this.components.set("kelvin", kelvin);
    }

    get kelvin(): T {
        return this.getComponent("kelvin")!;
    }
    set kelvin(value: T) {
        this.setComponent("kelvin", value);
    }
}

export type ColorSpaceMap<T> = {
    rgb: RGBColor<T>;

    hsl: HSLColor<T>;
    hsv: HSVColor<T>;
    hwb: HWBColor<T>;

    lab: LABColor<T>;
    lch: LCHColor<T>;

    oklab: OKLABColor<T>;
    oklch: OKLCHColor<T>;

    kelvin: KelvinColor<T>;

    xyz: XYZColor<T>;
};
