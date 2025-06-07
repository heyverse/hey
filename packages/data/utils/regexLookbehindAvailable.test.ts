import { afterEach, describe, expect, it, vi } from "vitest";

const mockReplace = (supported: boolean) => {
  const original = String.prototype.replace;
  vi.spyOn(String.prototype, "replace").mockImplementation(function (
    this: string,
    search,
    value
  ) {
    if (search?.toString?.().includes("(?<=a)b")) {
      if (supported) {
        return "ac";
      }
      throw new Error("not supported");
    }
    return original.call(this, search as any, value as any);
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("regexLookbehindAvailable", () => {
  it("is boolean when lookbehind supported", async () => {
    mockReplace(true);
    const value = (await import("./regexLookbehindAvailable")).default;
    expect(typeof value).toBe("boolean");
    expect(value).toBe(true);
  });

  it("is boolean when lookbehind unsupported", async () => {
    mockReplace(false);
    const value = (await import("./regexLookbehindAvailable")).default;
    expect(typeof value).toBe("boolean");
    expect(value).toBe(false);
  });
});
