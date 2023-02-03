export const formatNumber = (num: number) => {
    let s = num.toFixed(2);
    return num < 0 ? s : ` ${s}`;
};
