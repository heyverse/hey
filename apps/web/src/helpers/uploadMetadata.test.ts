import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { storageClient } from "./storageClient";
import uploadMetadata from "./uploadMetadata";

vi.mock("./storageClient", () => ({
  storageClient: {
    uploadAsJson: vi.fn().mockResolvedValue({ uri: "lens://abcdef" })
  }
}));

describe("uploadMetadata", () => {
  const fetchSpy = vi.spyOn(global, "fetch");

  afterEach(() => {
    fetchSpy.mockClear();
    vi.clearAllMocks();
  });

  afterAll(() => {
    fetchSpy.mockRestore();
  });
  it("returns mocked URI without network calls", async () => {
    const uri = await uploadMetadata({ hello: "world" });

    expect(uri).toBe("lens://abcdef");
    expect(storageClient.uploadAsJson).toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
