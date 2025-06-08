import { describe, expect, it, vi } from "vitest";
import { storageClient } from "./storageClient";
import uploadMetadata from "./uploadMetadata";

// This test mocks the Grove storage client to avoid network calls
// and verifies that a valid lens:// URI is returned.

describe("uploadMetadata", () => {
  it("uploads metadata and returns a lens URI", async () => {
    const mockedUri = `lens://${"a".repeat(64)}`;
    vi.spyOn(storageClient, "uploadAsJson").mockResolvedValue({
      uri: mockedUri
    } as any);
    const uri = await uploadMetadata({ hello: "world" });
    expect(uri).toBe(mockedUri);
  });
});
