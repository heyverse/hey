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
    expect(
      Regex.evmAddress.test("0x1234567890abcdef1234567890abcdef1234567g")
    ).toBe(false);
    expect(
      Regex.evmAddress.test("0x1234567890abcdef1234567890abcdef123456789")
    ).toBe(false);
  });

  it("validates usernames", () => {
    expect(newRegex(Regex.username).test("user_1")).toBe(true);
    expect(newRegex(Regex.username).test("1user")).toBe(true);
    expect(newRegex(Regex.username).test("ab")).toBe(false);
    expect(newRegex(Regex.username).test("_abcde")).toBe(false);
    expect(newRegex(Regex.username).test("a".repeat(27))).toBe(false);
  });

  it("matches hashtags", () => {
    expect(newRegex(Regex.hashtag).test("#hello")).toBe(true);
    expect(newRegex(Regex.hashtag).test("#hello_world")).toBe(true);
    expect(newRegex(Regex.hashtag).test("#123")).toBe(false);
  });

  it("detects mentions", () => {
    expect(newRegex(Regex.mention).test("@lens/user")).toBe(true);
    expect(newRegex(Regex.mention).test("say @lens/user")).toBe(true);
    expect(newRegex(Regex.mention).test("\n@lens/user")).toBe(true);
    expect(newRegex(Regex.mention).test("a@lens/user")).toBe(false);
    expect(newRegex(Regex.mention).test("@lens/user-name")).toBe(true);
    expect(newRegex(Regex.mention).test("@lens/user_name")).toBe(true);
  });

  it("filters restricted symbols", () => {
    expect(Regex.accountNameFilter.test("foo✔bar")).toBe(true);
    expect(Regex.accountNameFilter.test("foobar")).toBe(false);
  });

  it("validates account names", () => {
    expect(Regex.accountNameValidator.test("foobar")).toBe(true);
    expect(Regex.accountNameValidator.test("foo✓bar")).toBe(false);
    expect(Regex.accountNameValidator.test("")).toBe(false);
  });

  it("matches urls", () => {
    expect(newRegex(Regex.url).test("https://example.com/path?x=1")).toBe(true);
    expect(newRegex(Regex.url).test("https://例子.测试")).toBe(true);
    expect(newRegex(Regex.url).test("ftp://example.com")).toBe(false);
    expect(newRegex(Regex.url).test("example.com")).toBe(false);
  });
});

describe("EditorRegex", () => {
  it("matches emoji search", () => {
    expect(newRegex(EditorRegex.emoji).test(":smile")).toBe(true);
    expect(newRegex(EditorRegex.emoji).test("text :smile")).toBe(true);
    expect(newRegex(EditorRegex.emoji).test("text:smile")).toBe(false);
    expect(newRegex(EditorRegex.emoji).test("more:\u{1F600}")).toBe(false);
    expect(newRegex(EditorRegex.emoji).test("line\n:smile")).toBe(true);
    expect(newRegex(EditorRegex.emoji).test(":smile:")).toBe(false);
  });

  it("matches editor mentions", () => {
    expect(newRegex(EditorRegex.mention).test("@someone")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("hello @someone")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("hello@someone")).toBe(false);
    expect(newRegex(EditorRegex.mention).test("line\n@user")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("@user_name123")).toBe(true);
    expect(newRegex(EditorRegex.mention).test("@user-name")).toBe(false);
  });
});
