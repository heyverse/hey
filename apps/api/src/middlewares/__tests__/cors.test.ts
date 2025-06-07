import { beforeAll, describe, expect, it, vi } from "vitest";

const corsMock = vi.fn((opts) => opts);
vi.mock("hono/cors", () => ({ cors: corsMock }));

let cors: any;

beforeAll(async () => {
  ({ default: cors } = await import("../cors"));
});

describe("cors middleware", () => {
  it("sets allowed origins", () => {
    expect(cors.origin).toEqual([
      "https://hey.xyz",
      "https://testnet.hey.xyz",
      "https://staging.hey.xyz",
      "http://localhost:4783",
      "https://developer.lens.xyz"
    ]);
  });
});
