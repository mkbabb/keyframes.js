import { BLACKLISTED_COALESCE_UNITS, UNITS } from "./constants";

export class ValueUnit<T = any, U = (typeof UNITS)[number] | string> {
    constructor(
        public value: T,
        public unit?: U,
        public superType?: string[],
        public subProperty?: string,
        public property?: string,
        public targets?: HTMLElement[],
    ) {}

    setSubProperty(subProperty: any) {
        this.subProperty = subProperty;
    }

    setProperty(property: any) {
        this.property = property;
    }

    setTargets(targets: HTMLElement[]) {
        this.targets = targets;
    }

    valueOf() {
        return this.value;
    }

    toString() {
        if (this.value == null) {
            return "";
        }

        if (this.unit == null || this.unit === "string") {
            return `${this.value}`;
        }

        if (this.unit === "color") {
            const values = Object.values(this.value);
            const name = this.superType?.[1] ?? "rgb";

            return `${name}(${values.join(", ")})`;
        } else if (this.unit === "var") {
            return `var(${this.value})`;
        } else if (this.unit === "calc") {
            return `calc(${this.value})`;
        } else {
            return `${this.value}${this.unit}`;
        }
    }

    toJSON() {
        return this.valueOf();
    }

    clone(): ValueUnit<T> {
        return new ValueUnit(
            this.value,
            this.unit,
            this.superType,
            this.subProperty,
            this.property,
        );
    }

    coalesce(right?: ValueUnit): ValueUnit {
        if (right == null) {
            return this;
        }
        if (BLACKLISTED_COALESCE_UNITS.includes(this.unit as any)) {
            return this;
        }

        return new ValueUnit(
            this.value,
            this.unit ?? right.unit,
            this.superType ?? right.superType,
            this.subProperty ?? right.subProperty,
            this.property ?? right.property,
            this.targets ?? right.targets,
        ) as any;
    }
}

export class FunctionValue<T = any, N extends string = string> {
    constructor(
        public name: N,
        public args: Array<ValueUnit<T> | FunctionValue<T>>,
    ) {
        args.forEach((v) => {
            this.setSubProperty(name);
        });
    }

    setSubProperty(subProperty: any) {
        this.args.forEach((v) => v.setSubProperty(subProperty));
    }

    setProperty(property: any) {
        this.args.forEach((v) => v.setProperty(property));
    }

    setTargets(targets: HTMLElement[]) {
        this.args.forEach((v) => v.setTargets(targets));
    }

    valueOf(): any[] {
        return this.args.map((v) => v.valueOf());
    }

    toString(): string {
        return `${this.name}(${this.args.map((v) => v.toString()).join(", ")})`;
    }

    toJSON() {
        return {
            [this.name]: this.args.map((v) => v.toJSON()),
        };
    }

    clone(): FunctionValue<T> {
        return new FunctionValue(
            this.name,
            this.args.map((v) => v.clone()),
        );
    }
}

export class ValueArray<T = any> extends Array<ValueUnit<T> | FunctionValue<T>> {
    constructor(...args: Array<ValueUnit<T> | FunctionValue<T>>) {
        super(...args);
    }

    setSubProperty(subProperty: any) {
        this.forEach((v) => v.setSubProperty(subProperty));
    }

    setProperty(property: any) {
        this.forEach((v) => v.setProperty(property));
    }

    setTargets(targets: HTMLElement[]) {
        this.forEach((v) => v.setTargets(targets));
    }

    valueOf() {
        return this.map((v) => v.valueOf());
    }

    toString() {
        return this.map((v) => v.toString()).join(" ");
    }

    toJSON() {
        return this.map((v) => v.toJSON());
    }

    clone() {
        return new ValueArray(...this.map((v) => v.clone()));
    }
}
