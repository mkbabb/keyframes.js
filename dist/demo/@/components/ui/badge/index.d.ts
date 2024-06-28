import { VariantProps } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';
export declare const badgeVariants: (props?: {
    variant?: "default" | "destructive" | "outline" | "secondary";
} & import('class-variance-authority/dist/types').ClassProp) => string;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
