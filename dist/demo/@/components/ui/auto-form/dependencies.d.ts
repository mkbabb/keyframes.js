import { Ref } from 'vue';
import { Dependency, EnumValues } from './interface';

export declare const injectDependencies: <T extends Ref<Dependency<{
    [x: string]: any;
}>[]> = Ref<Dependency<{
    [x: string]: any;
}>[]>>(fallback?: T) => T extends null ? Ref<Dependency<{
    [x: string]: any;
}>[]> | null : Ref<Dependency<{
    [x: string]: any;
}>[]>, provideDependencies: (contextValue: Ref<Dependency<{
    [x: string]: any;
}>[]>) => Ref<Dependency<{
    [x: string]: any;
}>[]>;
export default function useDependencies(fieldName: string): {
    isDisabled: Ref<boolean>;
    isHidden: Ref<boolean>;
    isRequired: Ref<boolean>;
    overrideOptions: Ref<EnumValues>;
};
