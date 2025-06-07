import { describe, expect, it } from "vitest";
import getMentions from "./getMentions";

describe("getMentions", () => {
  it("returns empty array for empty text", () => {
    expect(getMentions("")).toEqual([]);
  });

  it("extracts mentions", () => {
    const mentions = getMentions("hi @lens/alice and @lens/bob");
    expect(mentions.map((m) => m.replace.from)).toEqual(["alice", "bob"]);
  });
});
