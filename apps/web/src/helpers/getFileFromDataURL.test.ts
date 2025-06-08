import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getFileFromDataURL from "./getFileFromDataURL";

class MockCanvas {
  width = 0;
  height = 0;
  ctx = { drawImage: vi.fn() };
  getContext() {
    return this.ctx;
  }
  toBlob(callback: (blob: Blob | null) => void) {
    callback(new Blob(["x"], { type: "image/png" }));
  }
}

class MockImage {
  width = 10;
  height = 10;
  crossOrigin = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(value: string) {
    setTimeout(() => {
      if (value.startsWith("data:")) {
        this.onload?.();
      } else {
        this.onerror?.();
      }
    }, 0);
  }
}

describe("getFileFromDataURL", () => {
  beforeEach(() => {
    (global as any).Image = MockImage;
    (global as any).document = {
      createElement: (tag: string) => {
        if (tag === "canvas") {
          return new MockCanvas();
        }
        return {};
      }
    };
  });

  afterEach(() => {
    (global as any).Image = undefined;
    (global as any).document = undefined;
  });

  it("converts data URL to File", async () => {
    const file = await new Promise<File | null>((resolve) => {
      getFileFromDataURL("data:image/png;base64,AA", "test.png", resolve);
    });
    expect(file).toBeInstanceOf(File);
    expect(file?.name).toBe("test.png");
  });

  it("returns null when image fails to load", async () => {
    const cb = vi.fn();
    await new Promise<void>((resolve) => {
      getFileFromDataURL("error", "test.png", (file) => {
        cb(file);
        resolve();
      });
    });
    expect(cb).toHaveBeenCalledWith(null);
  });

  it("returns null for empty data url", async () => {
    const cb = vi.fn();
    await new Promise<void>((resolve) => {
      getFileFromDataURL("", "test.png", (file) => {
        cb(file);
        resolve();
      });
    });
    expect(cb).toHaveBeenCalledWith(null);
  });
});
