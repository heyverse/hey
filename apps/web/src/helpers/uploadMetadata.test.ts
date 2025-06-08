import { describe, expect, it } from "vitest";
import uploadMetadata from "./uploadMetadata";

// This test uses the real Grove storage service to upload metadata
// and verifies that a valid lens:// URI is returned.

describe("uploadMetadata", () => {
  it("uploads metadata and returns a lens URI", async () => {
    const uri = await uploadMetadata({ hello: "world" });
    expect(uri).toMatch(/^lens:\/\/[0-9a-f]{64}$/);
  });
});
