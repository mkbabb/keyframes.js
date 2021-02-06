export function getOffset(el: Element) {
    const rect = el.getBoundingClientRect();

    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        leftX: rect.left,
        topY: rect.top
    };
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function throttle(func: (...args: any) => void, wait = 1000) {
    let enableCall = true;

    return function (...args: any) {
        if (!enableCall) return;

        enableCall = false;
        func(...args);
        setTimeout(() => (enableCall = true), wait);
    };
}
