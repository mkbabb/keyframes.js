import { ref } from "vue";

export function useExclusiveSelect() {
    const openSelect = ref<string | null>(null);
    const isOpen = (name: string) => openSelect.value === name;
    const setOpen = (name: string, open: boolean) => {
        openSelect.value = open ? name : null;
    };
    return { isOpen, setOpen };
}
