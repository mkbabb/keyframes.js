import { VariantProps } from 'class-variance-authority';

export { default as Avatar } from './Avatar.vue';
export { default as AvatarImage } from './AvatarImage.vue';
export { default as AvatarFallback } from './AvatarFallback.vue';
export declare const avatarVariant: (props?: {
    size?: "base" | "sm" | "lg";
    shape?: "circle" | "square";
} & import('class-variance-authority/dist/types').ClassProp) => string;
export type AvatarVariants = VariantProps<typeof avatarVariant>;
