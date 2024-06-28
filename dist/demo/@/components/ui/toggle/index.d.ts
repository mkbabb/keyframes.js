import { VariantProps } from 'class-variance-authority';

export { default as Toggle } from './Toggle.vue';
export declare const toggleVariants: (props?: {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
} & import('class-variance-authority/dist/types').ClassProp) => string;
export type ToggleVariants = VariantProps<typeof toggleVariants>;
