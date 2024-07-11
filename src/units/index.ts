export class ValueUnit<T = any> {
    constructor(
        public value: T,
        public unit?: string,
        public superType?: string[],
        public subProperty?: any,
        public property?: any,
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
        if (!this.unit) {
            return this.value;
        }
        return this.toString();
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

    clone() {
        return new ValueUnit(
            this.value,
            this.unit,
            this.superType,
            this.subProperty,
            this.property,
        );
    }
}

export class FunctionValue<T = any> {
    constructor(
        public name: string,
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

    valueOf() {
        return this.args.map((v) => v.valueOf());
    }

    toString() {
        return `${this.name}(${this.args.map((v) => v.toString()).join(", ")})`;
    }

    toJSON() {
        return {
            [this.name]: this.args.map((v) => v.toJSON()),
        };
    }

    clone() {
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

// export function flattenReverseTransformedObject(
//     value: any,
//     parentKey: string = undefined,
//     acc: string = undefined,
// ): string {
//     const flatValue = (() => {
//         if (isObject(value)) {
//             return Object.entries(value)
//                 .map(([key, value]) => {
//                     return flattenReverseTransformedObject(value, key, acc);
//                 })
//                 .join(" ");
//         } else if (Array.isArray(value)) {
//             const v = value
//                 .map((v) => flattenReverseTransformedObject(v, parentKey))
//                 .join(", ");

//             return parentKey ? `${parentKey}(${v})` : v;
//         } else {
//             return value.toString();
//         }
//     })();

//     return acc ? `${acc} ${flatValue}` : flatValue;
// }

// export function transformTargetsStyle(t: number, vars: any, targets: HTMLElement[]) {
//     const transformedVars = Object.entries(vars).reduce((acc, [key, value]) => {
//         const flatValue = flattenReverseTransformedObject(value, key);
//         acc[key] = flatValue;
//         return acc;
//     }, {});

//     targets.forEach((target) => {
//         Object.entries(transformedVars).forEach(([key, value]) => {
//             target.style.setProperty(key, value as any);
//         });
//     });
// }
