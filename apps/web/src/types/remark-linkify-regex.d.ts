declare module "remark-linkify-regex" {
  import type { Plugin } from "unified";

  interface LinkifyRegexOptions {
    [key: string]: unknown;
  }

  export default function linkifyRegex(
    regex: RegExp,
    options?: LinkifyRegexOptions
  ): Plugin;
}
