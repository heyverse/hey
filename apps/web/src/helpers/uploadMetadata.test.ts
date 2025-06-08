import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storageClient } from "./storageClient";
import uploadMetadata from "./uploadMetadata";

vi.mock("./storageClient", () => ({
  storageClient: { uploadAsJson: vi.fn() }
}));

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn();
  (storageClient.uploadAsJson as any).mockResolvedValue({
    uri: "lens://abcdef"
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.clearAllMocks();
});

describe("uploadMetadata", () => {
  it("returns mocked URI without network calls", async () => {
    const uri = await uploadMetadata({ hello: "world" });

    expect(uri).toBe("lens://abcdef");
    expect(storageClient.uploadAsJson).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
