import type { Context, Next } from "hono";
import { describe, expect, it, vi } from "vitest";
import infoLogger from "./infoLogger";

describe("infoLogger", () => {
  it("logs formatted message", async () => {
    const now = vi.spyOn(performance, "now");
    now.mockReturnValueOnce(0).mockReturnValueOnce(50);
    const mem = vi.spyOn(process, "memoryUsage");
    mem
      .mockReturnValueOnce({ heapUsed: 1000 } as any)
      .mockReturnValueOnce({ heapUsed: 2000 } as any);
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const next: Next = vi.fn();
    const ctx = {
      req: { method: "GET", path: "/a", header: vi.fn(() => "GPTBot") }
    } as unknown as Context;

    await infoLogger(ctx, next);

    expect(info).toHaveBeenCalledWith("[GET /a] \u279c 50.00ms, 0.00mb");
    expect(next).toHaveBeenCalled();

    now.mockRestore();
    mem.mockRestore();
    info.mockRestore();
  });
});
