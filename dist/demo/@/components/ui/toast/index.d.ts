import { ToastRootProps } from 'radix-vue';
import { HTMLAttributes } from 'vue';
import { VariantProps } from 'class-variance-authority';

export { default as Toaster } from './Toaster.vue';
export { default as Toast } from './Toast.vue';
export { default as ToastViewport } from './ToastViewport.vue';
export { default as ToastAction } from './ToastAction.vue';
export { default as ToastClose } from './ToastClose.vue';
export { default as ToastTitle } from './ToastTitle.vue';
export { default as ToastDescription } from './ToastDescription.vue';
export { default as ToastProvider } from './ToastProvider.vue';
export { toast, useToast } from './use-toast';
export declare const toastVariants: (props?: {
    variant?: "default" | "destructive";
} & import('class-variance-authority/dist/types').ClassProp) => string;
type ToastVariants = VariantProps<typeof toastVariants>;
export interface ToastProps extends ToastRootProps {
    class?: HTMLAttributes['class'];
    variant?: ToastVariants['variant'];
    onOpenChange?: ((value: boolean) => void) | undefined;
}
