import { CSSContent, TypePlugin } from "@this-project/development-guc-core";
import { PaddingTypePluginTheme } from "../..";

export function cssContent(
  prefix: string,
  content: (value: string) => string
): TypePlugin<PaddingTypePluginTheme>["cssContent"] {
  return function (className, escapedFullClassName, config): CSSContent[] {
    const actualPrefix = config.prefix + prefix;
    const value = className.startsWith(actualPrefix + "[")
      ? className.slice(actualPrefix.length + 1, -1)
      : config.theme.padding[className.slice(actualPrefix.length)];
    return [
      {
        selector: `.${escapedFullClassName}`,
        content: content(typeof value === "number" ? `${value}px` : value),
        couldAffectedByVariants: true,
      },
    ];
  };
}
