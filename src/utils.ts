async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getOffset(el: Element) {
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

function emToPixels(em: string): number {
    em = em.toLowerCase();
    let emNumber = 1;

    if (em.indexOf("px") !== -1) {
        emNumber = parseFloat(em.split("px")[0]);
        return emNumber;
    } else if (em.indexOf("em") !== -1) {
        emNumber = parseFloat(em.split("em")[0]);
    }

    const fontSize = parseFloat(
        window
            .getComputedStyle(document.body)
            .getPropertyValue("font-size")
            .toLowerCase()
            .replace(/[a-z]/g, "")
    );

    return emNumber * fontSize;
}

function getComputedVariable(v: string, el = document.documentElement) {
    return window.getComputedStyle(el).getPropertyValue(v);
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

export { getOffset, getComputedVariable, emToPixels, sleep };
