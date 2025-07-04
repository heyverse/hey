import { describe, expect, it } from "vitest";
import getMentions from "./getMentions";

describe("getMentions", () => {
  it("returns empty array when text is empty", () => {
    expect(getMentions("")).toEqual([]);
  });

  it("extracts a single mention", () => {
    const result = getMentions("Hello @lens/John!");
    expect(result).toEqual([
      { account: "", namespace: "", replace: { from: "john", to: "john" } }
    ]);
  });

  it("extracts multiple mentions", () => {
    const result = getMentions("@lens/alice and @lens/Bob are here");
    expect(result).toEqual([
      { account: "", namespace: "", replace: { from: "alice", to: "alice" } },
      { account: "", namespace: "", replace: { from: "bob", to: "bob" } }
    ]);
  });

  it("ignores @ within words", () => {
    expect(getMentions("email@lens/bob")).toEqual([]);
  });
});
