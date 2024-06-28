import { z } from 'zod';

export type ZodObjectOrWrapped = z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>;
/**
 * Beautify a camelCase string.
 * e.g. "myString" -> "My String"
 */
export declare function beautifyObjectName(string: string): string;
/**
 * Parse string and extract the index
 * @param string
 * @returns index or undefined
 */
export declare function getIndexIfArray(string: string): number;
/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
export declare function getBaseSchema<ChildType extends z.ZodAny | z.AnyZodObject = z.ZodAny>(schema: ChildType | z.ZodEffects<ChildType>): ChildType | null;
/**
 * Get the type name of the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
export declare function getBaseType(schema: z.ZodAny): "" | z.ZodFirstPartyTypeKind.ZodAny;
/**
 * Search for a "ZodDefault" in the Zod stack and return its value.
 */
export declare function getDefaultValueInZodStack(schema: z.ZodAny): any;
export declare function getObjectFormSchema(schema: ZodObjectOrWrapped): z.ZodObject<any, any>;
/**
 * Constructs a path with dot paths for arrays to use brackets to be compatible with vee-validate path syntax
 */
export declare function normalizeFormPath(path: string): string;
type NestedRecord = Record<string, unknown> | {
    [k: string]: NestedRecord;
};
/**
 * Checks if the path opted out of nested fields using `[fieldName]` syntax
 */
export declare function isNotNestedPath(path: string): boolean;
/**
 * Gets a nested property value from an object
 */
export declare function getFromPath<TValue = unknown>(object: NestedRecord | undefined, path: string): TValue | undefined;
export declare function getFromPath<TValue = unknown, TFallback = TValue>(object: NestedRecord | undefined, path: string, fallback?: TFallback): TValue | TFallback;
export {};
