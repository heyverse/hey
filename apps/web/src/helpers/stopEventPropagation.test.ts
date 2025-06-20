import type { MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import stopEventPropagation from "./stopEventPropagation";

describe("stopEventPropagation", () => {
  it("calls stopPropagation", () => {
    const event = {
      stopPropagation: vi.fn()
    } as unknown as MouseEvent<HTMLElement>;

    stopEventPropagation(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
