import { VariantProps } from 'class-variance-authority';

export { default as Button } from './Button.vue';
export declare const buttonVariants: (props?: {
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost";
    size?: "default" | "icon" | "sm" | "lg" | "xs";
} & import('class-variance-authority/dist/types').ClassProp) => string;
export type ButtonVariants = VariantProps<typeof buttonVariants>;
