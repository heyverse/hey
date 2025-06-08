import { defaultHandlers } from "mdast-util-to-markdown";
import { describe, expect, it, vi } from "vitest";
import { customBreakHandler } from "./remarkBreakHandler";

vi.mock("mdast-util-to-markdown", () => ({
  defaultHandlers: { break: vi.fn() }
}));

describe("customBreakHandler", () => {
  it("replaces default break output", () => {
    (defaultHandlers.break as any).mockReturnValue("\\\n");
    expect(
      customBreakHandler({} as any, null as any, null as any, null as any)
    ).toBe("\n");
  });

  it("passes through other output", () => {
    (defaultHandlers.break as any).mockReturnValue("x");
    expect(
      customBreakHandler({} as any, null as any, null as any, null as any)
    ).toBe("x");
  });

  it("does not alter regular breaks", () => {
    (defaultHandlers.break as any).mockReturnValue("x\n");
    expect(
      customBreakHandler({} as any, null as any, null as any, null as any)
    ).toBe("x\n");
  });
});
