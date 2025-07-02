import { describe, expect, it } from "vitest";
import parseJwt from "./parseJwt";

const createToken = (payload: object) => {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  return `header.${base64Payload}.signature`;
};

describe("parseJwt", () => {
  it("parses valid jwt payload", () => {
    const payload = { act: { sub: "456" }, exp: 10, sid: "abc", sub: "123" };
    const token = createToken(payload);

    const result = parseJwt(token);

    expect(result).toEqual(payload);
  });

  it("returns default payload for invalid token", () => {
    const invalidToken = "invalid.token";

    const result = parseJwt(invalidToken);

    expect(result).toEqual({ act: { sub: "" }, exp: 0, sid: "", sub: "" });
  });
});
