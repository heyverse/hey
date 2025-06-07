import { beforeAll, describe, expect, it } from "vitest";

let openRouter: typeof import("./openRouter").default;

beforeAll(async () => {
  process.env.OPENROUTER_API_KEY = "test";
  openRouter = (await import("./openRouter")).default;
});

describe("openRouter", () => {
  it("uses OpenRouter base URL", () => {
    expect(openRouter.baseURL).toBe("https://openrouter.ai/api/v1");
  });
});
