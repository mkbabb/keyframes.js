import { VariantProps } from 'class-variance-authority';

export { default as Alert } from './Alert.vue';
export { default as AlertTitle } from './AlertTitle.vue';
export { default as AlertDescription } from './AlertDescription.vue';
export declare const alertVariants: (props?: {
    variant?: "default" | "destructive";
} & import('class-variance-authority/dist/types').ClassProp) => string;
export type AlertVariants = VariantProps<typeof alertVariants>;
