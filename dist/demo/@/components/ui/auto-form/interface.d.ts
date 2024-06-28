import { Component, InputHTMLAttributes } from 'vue';
import { ZodAny, z } from 'zod';
import { INPUT_COMPONENTS } from './constant';

export interface FieldProps {
    fieldName: string;
    label?: string;
    required?: boolean;
    config?: ConfigItem;
    disabled?: boolean;
}
export interface Shape {
    type: string;
    default?: any;
    required?: boolean;
    options?: string[];
    schema?: ZodAny;
}
export interface ConfigItem {
    /** Value for the `FormLabel` */
    label?: string;
    /** Value for the `FormDescription` */
    description?: string;
    /** Pick which component to be rendered. */
    component?: keyof typeof INPUT_COMPONENTS | Component;
    /** Hide `FormLabel`. */
    hideLabel?: boolean;
    inputProps?: InputHTMLAttributes;
}
type UnwrapArray<T> = T extends (infer U)[] ? U : never;
export type Config<SchemaType extends object> = {
    [Key in keyof SchemaType]?: SchemaType[Key] extends any[] ? UnwrapArray<Config<SchemaType[Key]>> : SchemaType[Key] extends object ? Config<SchemaType[Key]> : ConfigItem;
};
export declare enum DependencyType {
    DISABLES = 0,
    REQUIRES = 1,
    HIDES = 2,
    SETS_OPTIONS = 3
}
interface BaseDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> {
    sourceField: keyof SchemaType;
    type: DependencyType;
    targetField: keyof SchemaType;
    when: (sourceFieldValue: any, targetFieldValue: any) => boolean;
}
export type ValueDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> = BaseDependency<SchemaType> & {
    type: DependencyType.DISABLES | DependencyType.REQUIRES | DependencyType.HIDES;
};
export type EnumValues = readonly [string, ...string[]];
export type OptionsDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> = BaseDependency<SchemaType> & {
    type: DependencyType.SETS_OPTIONS;
    options: EnumValues;
};
export type Dependency<SchemaType extends z.infer<z.ZodObject<any, any>>> = ValueDependency<SchemaType> | OptionsDependency<SchemaType>;
export {};
