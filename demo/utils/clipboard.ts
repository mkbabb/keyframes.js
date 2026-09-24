import { toast } from "@mkbabb/glass-ui/toast";

export async function copyText(text: string, successMessage?: string): Promise<void> {
    await navigator.clipboard.writeText(text);
    if (successMessage) {
        toast({ title: successMessage, tone: "success" });
    }
}
