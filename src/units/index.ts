import { clone } from "@src/utils";
import { BLACKLISTED_COALESCE_UNITS, UNITS } from "./constants";
import { isColorUnit } from "./utils";

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

    setValue(value: T) {
        this.value = value;
    }

    toString() {
        if (this.value == null) {
            return "";
        }

        if (this.unit == null || this.unit === "string") {
            return `${this.value}`;
        }

        if (isColorUnit(this as any)) {
            return this.value.toString();
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

    toFixed(fractionDigits: number = 2) {
        const value = Number(this.value).toFixed(fractionDigits).replace(/\.0+$/, "");
        return new ValueUnit(value).coalesce(this, true).toString();
    }

    clone(): ValueUnit<T> {
        const value = new ValueUnit(
            clone(this.value),
            this.unit,
            clone(this.superType),
            this.subProperty,
            this.property,
        );

        return value;
    }

    coalesce(right?: ValueUnit, inplace: boolean = false): ValueUnit {
        if (right == null) {
            return this;
        }
        if (BLACKLISTED_COALESCE_UNITS.includes(this.unit as any)) {
            return this;
        }

        if (inplace) {
            this.unit ??= right.unit;
            this.superType ??= right.superType;
            this.subProperty ??= right.subProperty;
            this.property ??= right.property;
            this.targets ??= right.targets;

            return this;
        } else {
            const value = new ValueUnit(
                clone(this.value),
                this.unit ?? right.unit,
                clone(this.superType ?? right.superType),
                this.subProperty ?? right.subProperty,
                this.property ?? right.property,
                this.targets ?? right.targets,
            ) as any;

            return value;
        }
    }
}

export class FunctionValue<T = any, N extends string = string> {
    constructor(
        public name: N,
        public values: Array<ValueUnit<T> | FunctionValue<T>>,
    ) {
        values.forEach((v) => {
            this.setSubProperty(name);
        });
    }

    setSubProperty(subProperty: any) {
        this.values.forEach((v) => v.setSubProperty(subProperty));
    }

    setProperty(property: any) {
        this.values.forEach((v) => v.setProperty(property));
    }

    setTargets(targets: HTMLElement[]) {
        this.values.forEach((v) => v.setTargets(targets));
    }

    setValue(value: T, index?: number) {
        if (index != null) {
            this.values[index].setValue(value);
        } else {
            this.values.forEach((v) => v.setValue(value));
        }
    }

    valueOf(): any[] {
        return this.values.map((v) => v.valueOf());
    }

    toString(): string {
        return `${this.name}(${this.values.map((v) => v.toString()).join(", ")})`;
    }

    toJSON() {
        return {
            [this.name]: this.values.map((v) => v.toJSON()),
        };
    }

    clone(): FunctionValue<T> {
        return new FunctionValue(
            this.name,
            this.values.map((v) => v.clone()),
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

    setValue(value: T, index?: number) {
        if (index != null) {
            this[index].setValue(value);
        } else {
            this.forEach((v) => v.setValue(value));
        }
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
