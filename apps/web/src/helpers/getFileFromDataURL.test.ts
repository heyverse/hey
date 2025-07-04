import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getFileFromDataURL from "./getFileFromDataURL";

class TestImage {
  width = 1;
  height = 1;
  crossOrigin = "";
  onload?: () => void;
  onerror?: () => void;
  set src(_url: string) {
    queueMicrotask(() => this.onload?.());
  }
}

describe("getFileFromDataURL", () => {
  const originalImage = global.Image;

  beforeEach(() => {
    // @ts-ignore
    global.Image = TestImage;
  });

  afterEach(() => {
    global.Image = originalImage;
    vi.restoreAllMocks();
  });

  it("creates a file from a data URL", async () => {
    const canvas: any = {
      getContext: vi.fn(),
      toBlob: (cb: (blob: Blob) => void) => {
        cb(new Blob(["data"], { type: "image/png" }));
      }
    };

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue(canvas);

    const callback = vi.fn();

    getFileFromDataURL(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwMB/6evsdoAAAAASUVORK5CYII=",
      "photo.png",
      callback
    );

    await Promise.resolve();

    expect(callback).toHaveBeenCalledTimes(1);
    const file = callback.mock.calls[0][0] as File;
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("photo.png");
    expect(file.type).toBe("image/png");

    createElementSpy.mockRestore();
  });

  it("returns null when image fails to load", async () => {
    class ErrorImage extends TestImage {
      set src(_url: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }

    // @ts-ignore
    global.Image = ErrorImage;

    const callback = vi.fn();
    getFileFromDataURL("data:,", "bad.png", callback);

    await Promise.resolve();

    expect(callback).toHaveBeenCalledWith(null);
  });
});
