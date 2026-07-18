/** Demo/editor presentation only; library serializers return deterministic CSS. */
export async function formatEditorCSS(
    css: string,
    printWidth = 80,
): Promise<string> {
    const [prettier, postcss] = await Promise.all([
        import("prettier"),
        import("prettier/plugins/postcss"),
    ]);
    return prettier.format(css, {
        parser: "scss",
        plugins: [postcss],
        printWidth,
    });
}
