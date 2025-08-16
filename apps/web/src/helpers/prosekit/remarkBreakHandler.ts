import { defaultHandlers } from "mdast-util-to-markdown";

const defaultBreakHandler = defaultHandlers.break;

export const customBreakHandler: typeof defaultBreakHandler = (...args) => {
  const output: string = defaultBreakHandler(...args);
  if (output === "\\\n") {
    return "\n";
  }
  return output;
};
