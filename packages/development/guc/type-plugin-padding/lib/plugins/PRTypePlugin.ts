import { TypePlugin } from "@this-project/development-guc-core";
import { PaddingTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "pr-";

export const PRTypePlugin: TypePlugin<PaddingTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(PREFIX, (value) => `padding-right:${value};`),
};
