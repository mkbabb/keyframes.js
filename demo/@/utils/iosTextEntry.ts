export const isIOSLikePlatform = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 &&
            CSS.supports("(-webkit-touch-callout: none)"))
    );
};

export const clampIOSNoZoomFontSize = (fontSize: number): number =>
    isIOSLikePlatform() ? Math.max(fontSize, 16) : fontSize;

/** Set `.ios` on `<html>` once at app startup so CSS can scope iOS-only rules. */
export const initIOSPlatformClass = (): void => {
    if (typeof document !== "undefined" && isIOSLikePlatform()) {
        document.documentElement.classList.add("ios");
    }
};
