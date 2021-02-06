export function getOffset(el) {
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
export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function throttle(func, wait = 1000) {
    let enableCall = true;
    return function (...args) {
        if (!enableCall)
            return;
        enableCall = false;
        func(...args);
        setTimeout(() => (enableCall = true), wait);
    };
}
