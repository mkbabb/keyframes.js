import { toast } from "vue-sonner";

export async function copyText(text: string, successMessage?: string): Promise<void> {
    await navigator.clipboard.writeText(text);
    if (successMessage) {
        toast.success(successMessage);
    }
}
