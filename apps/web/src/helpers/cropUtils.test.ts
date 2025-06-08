import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getCroppedImg from "./cropUtils";

class MockImage {
  width = 100;
  height = 80;
  private listeners: Record<string, Array<() => void>> = {};
  addEventListener(event: string, cb: () => void) {
    (this.listeners[event] ||= []).push(cb);
  }
  private _src = "";
  set src(value: string) {
    this._src = value;
    const callbacks = this.listeners["load"];
    if (callbacks) {
      for (const cb of callbacks) {
        cb();
      }
    }
  }
  get src() {
    return this._src;
  }
}

const OriginalImage = (global as any).Image;
const originalDocument = (global as any).document;

beforeEach(() => {
  (global as any).Image = MockImage as unknown as typeof Image;
  (global as any).document = {
    createElement: vi.fn(() => ({ getContext: vi.fn(() => null) }))
  } as any;
});

afterEach(() => {
  (global as any).Image = OriginalImage;
  if (originalDocument) {
    (global as any).document = originalDocument;
  } else {
    (global as any).document = undefined as any;
  }
  vi.restoreAllMocks();
});

describe("getCroppedImg", () => {
  it("returns null when pixelCrop is null", async () => {
    const result = await getCroppedImg("img", null);
    expect(result).toBeNull();
  });

  it("returns null when context is missing", async () => {
    (global as any).document = {
      createElement: vi.fn(() => ({
        getContext: vi.fn(() => null)
      }))
    } as any;
    const result = await getCroppedImg("img", {
      x: 0,
      y: 0,
      width: 10,
      height: 10
    });
    expect(result).toBeNull();
  });

  it("crops image and returns canvas", async () => {
    const ctx = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({})),
      putImageData: vi.fn()
    } as unknown as CanvasRenderingContext2D;

    const canvasEl: any = { width: 0, height: 0, getContext: vi.fn(() => ctx) };
    (global as any).document = {
      createElement: vi.fn(() => canvasEl)
    } as any;

    const pixelCrop = { x: 5, y: 10, width: 20, height: 30 };
    const resultCanvas = await getCroppedImg("img", pixelCrop);
    expect(resultCanvas).not.toBeNull();
    expect(resultCanvas?.width).toBe(pixelCrop.width);
    expect(resultCanvas?.height).toBe(pixelCrop.height);
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.putImageData).toHaveBeenCalled();
  });
});
