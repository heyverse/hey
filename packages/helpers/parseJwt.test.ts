import { describe, expect, it } from "vitest";
import parseJwt from "./parseJwt";

describe("parseJwt", () => {
  it("parses valid token", () => {
    const payload = { sub: "1", exp: 2, sid: "abc", act: { sub: "1" } };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
    const token = `a.${encoded}.b`;
    expect(parseJwt(token)).toEqual(payload);
  });

  it("returns defaults on invalid token", () => {
    expect(parseJwt("invalid")).toEqual({
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "" }
    });
  });

  it("handles token with missing sections", () => {
    expect(parseJwt("onlytwo.sections")).toEqual({
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "" }
    });
  });

  it("handles malformed base64", () => {
    expect(parseJwt("a.!!!.b")).toEqual({
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "" }
    });
  });
});
