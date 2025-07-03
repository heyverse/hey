import type { Area } from "react-easy-crop";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getCroppedImg from "./cropUtils";

class TestImage {
  onload?: () => void;
  onerror?: (err: unknown) => void;
  width = 40;
  height = 30;
  private listeners: Record<string, Array<() => void>> = {};
  addEventListener(event: string, cb: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(cb);
  }
  set src(_url: string) {
    const loadHandlers = this.listeners["load"];
    if (loadHandlers) {
      for (const cb of loadHandlers) {
        cb();
      }
    }
  }
}

describe("getCroppedImg", () => {
  const originalImage = global.Image;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    // @ts-ignore
    global.Image = TestImage;
  });

  afterEach(() => {
    global.Image = originalImage;
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    vi.restoreAllMocks();
  });

  it("returns null when pixelCrop is null", async () => {
    const result = await getCroppedImg("test", null);
    expect(result).toBeNull();
  });

  it("returns null when context is unavailable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);
    const area: Area = { height: 10, width: 10, x: 0, y: 0 };
    const result = await getCroppedImg("test", area);
    expect(result).toBeNull();
  });

  it("crops and resizes canvas to the provided area", async () => {
    const drawImage = vi.fn();
    const getImageData = vi.fn(() => ({}));
    const putImageData = vi.fn();
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      drawImage,
      getImageData,
      putImageData
    } as unknown as CanvasRenderingContext2D);

    const area: Area = { height: 15, width: 20, x: 5, y: 5 };
    const canvas = await getCroppedImg("test", area);

    expect(canvas).not.toBeNull();
    expect(drawImage).toHaveBeenCalled();
    expect(getImageData).toHaveBeenCalledWith(
      area.x,
      area.y,
      area.width,
      area.height
    );
    expect(putImageData).toHaveBeenCalled();
    expect(canvas?.width).toBe(area.width);
    expect(canvas?.height).toBe(area.height);
  });
});
