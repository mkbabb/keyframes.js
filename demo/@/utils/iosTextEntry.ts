export interface NavigatorLike {
    userAgent?: string;
    platform?: string;
    maxTouchPoints?: number;
}

const getNavigatorLike = (): NavigatorLike => {
    if (typeof navigator === "undefined") {
        return {};
    }

    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints,
    };
};

export const isIOSLikePlatform = (
    navigatorLike: NavigatorLike = getNavigatorLike(),
): boolean => {
    const userAgent = navigatorLike.userAgent ?? "";
    const platform = navigatorLike.platform ?? "";
    const maxTouchPoints = navigatorLike.maxTouchPoints ?? 0;

    if (/(iPad|iPhone|iPod)/i.test(userAgent) || /(iPad|iPhone|iPod)/i.test(platform)) {
        return true;
    }

    return platform === "MacIntel" && maxTouchPoints > 1;
};

export const clampIOSNoZoomFontSize = (
    fontSize: number,
    navigatorLike: NavigatorLike = getNavigatorLike(),
): number => (isIOSLikePlatform(navigatorLike) ? Math.max(fontSize, 16) : fontSize);

/** Set `.ios` on `<html>` once at app startup so CSS can scope iOS-only rules. */
export const initIOSPlatformClass = (): void => {
    if (typeof document !== "undefined" && isIOSLikePlatform()) {
        document.documentElement.classList.add("ios");
    }
};
