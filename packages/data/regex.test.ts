import { describe, expect, it } from "vitest";
import { EditorRegex, Regex } from "./regex";

const newRegex = (reg: RegExp) => new RegExp(reg);

describe("Regex", () => {
  it("matches EVM addresses", () => {
    expect(
      Regex.evmAddress.test("0x1234567890abcdef1234567890abcdef12345678")
    ).toBe(true);
    expect(
      Regex.evmAddress.test("1234567890abcdef1234567890abcdef12345678")
    ).toBe(true);
    expect(Regex.evmAddress.test("0x1234")).toBe(false);
  });

  it("validates usernames", () => {
    expect(newRegex(Regex.username).test("user_1")).toBe(true);
    expect(newRegex(Regex.username).test("ab")).toBe(false);
    expect(newRegex(Regex.username).test("_abcde")).toBe(false);
  });

  it("matches hashtags", () => {
    expect(newRegex(Regex.hashtag).test("#hello")).toBe(true);
    expect(newRegex(Regex.hashtag).test("#123")).toBe(false);
  });

  it("detects mentions", () => {
    expect(newRegex(Regex.mention).test("@lens/user")).toBe(true);
    expect(newRegex(Regex.mention).test("say @lens/user")).toBe(true);
    expect(newRegex(Regex.mention).test("a@lens/user")).toBe(false);
  });

  it("filters restricted symbols", () => {
    expect(Regex.accountNameFilter.test("foo✔bar")).toBe(true);
  });

  it("validates account names", () => {
    expect(Regex.accountNameValidator.test("foobar")).toBe(true);
    expect(Regex.accountNameValidator.test("foo✓bar")).toBe(false);
  });

  it("matches urls", () => {
    expect(newRegex(Regex.url).test("https://example.com/path?x=1")).toBe(true);
  });
});

describe("EditorRegex", () => {
  it("matches emoji search", () => {
    expect(newRegex(EditorRegex.emoji).test(":smile")).toBe(true);
    expect(newRegex(EditorRegex.emoji).test("text :smile")).toBe(true);
    expect(newRegex(EditorRegex.emoji).test("text:smile")).toBe(false);
  });

  it("matches editor mentions", () => {
    expect(newRegex(EditorRegex.mention).test("@someone")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("hello @someone")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("hello@someone")).toBe(false);
  });
});
