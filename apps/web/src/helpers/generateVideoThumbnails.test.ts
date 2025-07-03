import { describe, expect, it, vi } from "vitest";
import generateVideoThumbnails from "./generateVideoThumbnails";

describe("generateVideoThumbnails", () => {
  it("returns empty array when file size is zero", async () => {
    const file = new File([], "empty.mp4", { type: "video/mp4" });
    const thumbnails = await generateVideoThumbnails(file, 2);
    expect(thumbnails).toEqual([]);
  });

  it("returns empty array when video fails to load", async () => {
    const file = new File([new Uint8Array([1])], "video.mp4", {
      type: "video/mp4"
    });
    const originalCreate = (URL as any).createObjectURL;
    const originalRevoke = (URL as any).revokeObjectURL;
    const urlSpy = vi.fn(() => "blob:video");
    const revokeSpy = vi.fn();
    (URL as any).createObjectURL = urlSpy;
    (URL as any).revokeObjectURL = revokeSpy;

    const video: any = {
      addEventListener: vi.fn(),
      muted: false,
      remove: vi.fn(),
      src: ""
    };

    const canvas: any = {
      remove: vi.fn()
    };

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tag) => (tag === "video" ? video : canvas));

    const promise = generateVideoThumbnails(file, 2);
    video.onerror?.();
    const thumbnails = await promise;

    expect(thumbnails).toEqual([]);
    expect(video.remove).toHaveBeenCalled();
    expect(canvas.remove).toHaveBeenCalled();
    createElementSpy.mockRestore();
    (URL as any).createObjectURL = originalCreate;
    (URL as any).revokeObjectURL = originalRevoke;
  });

  it("generates thumbnails when video loads", async () => {
    const file = new File([new Uint8Array([1])], "video.mp4", {
      type: "video/mp4"
    });

    const originalCreate = (URL as any).createObjectURL;
    const originalRevoke = (URL as any).revokeObjectURL;

    const urlSpy = vi.fn(() => "blob:video");
    const revokeSpy = vi.fn();
    (URL as any).createObjectURL = urlSpy;
    (URL as any).revokeObjectURL = revokeSpy;

    let seekHandler: (() => void) | undefined;

    const video: any = {
      addEventListener: vi.fn((event: string, cb: () => void) => {
        if (event === "seeked") {
          seekHandler = cb;
        }
      }),
      duration: 2,
      muted: false,
      remove: vi.fn(),
      src: "",
      videoHeight: 50,
      videoWidth: 100
    };

    Object.defineProperty(video, "currentTime", {
      set() {
        if (seekHandler) {
          Promise.resolve().then(() => seekHandler?.());
        }
      }
    });

    let drawCount = 0;
    const context = { drawImage: vi.fn(() => drawCount++) };
    let call = 0;
    const canvas: any = {
      getContext: vi.fn(() => context),
      height: 0,
      remove: vi.fn(),
      toDataURL: vi.fn(() => `data:image/png;base64,${call++}`),
      width: 0
    };

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tag) => (tag === "video" ? video : canvas));

    const promise = generateVideoThumbnails(file, 2);
    video.onloadeddata?.();
    const thumbnails = await promise;

    expect(thumbnails).toHaveLength(2);
    expect(
      thumbnails.every((t) => t.startsWith("data:image/png;base64,"))
    ).toBe(true);
    expect(drawCount).toBe(2);

    createElementSpy.mockRestore();
    (URL as any).createObjectURL = originalCreate;
    (URL as any).revokeObjectURL = originalRevoke;
  });
});
