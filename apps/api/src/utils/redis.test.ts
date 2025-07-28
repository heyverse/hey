import { afterEach, describe, expect, it, vi } from "vitest";

const setMock = vi.fn();
const getMock = vi.fn();
const delMock = vi.fn();
const connectMock = vi.fn();
const onMock = vi.fn();

const createClientMock = vi.fn(() => ({
  connect: connectMock,
  del: delMock,
  get: getMock,
  on: onMock,
  set: setMock
}));

vi.mock("redis", () => ({
  createClient: createClientMock
}));

const infoMock = vi.fn();
const errorMock = vi.fn();
const warnMock = vi.fn();
const debugMock = vi.fn();

vi.mock("@hey/helpers/logger", () => ({
  default: {
    debug: debugMock,
    error: errorMock,
    info: infoMock,
    warn: warnMock
  }
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.resetModules();
  delete process.env.REDIS_URL;
});

describe("hoursToSeconds", () => {
  it("converts hours to seconds", async () => {
    const { hoursToSeconds } = await import("./redis");
    expect(hoursToSeconds(2)).toBe(7200);
  });
});

describe("generateSmallExpiry", () => {
  it("returns value between 1 and 2 days", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const { generateSmallExpiry } = await import("./redis");
    expect(generateSmallExpiry()).toBe(129600);
  });
});

describe("generateExtraLongExpiry", () => {
  it("returns value between 8 and 10 days", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const { generateExtraLongExpiry } = await import("./redis");
    expect(generateExtraLongExpiry()).toBe(777600);
  });
});

describe("Redis functions without client", () => {
  it("logs fallback when no client is available", async () => {
    const { setRedis, getRedis, delRedis } = await import("./redis");

    await setRedis("k", "v");
    await getRedis("k");
    await delRedis("k");

    const calls = infoMock.mock.calls.filter(
      (call) => call[0] === "[Redis] No Redis client, using fallback"
    );
    expect(calls).toHaveLength(3);
    expect(setMock).not.toHaveBeenCalled();
    expect(getMock).not.toHaveBeenCalled();
    expect(delMock).not.toHaveBeenCalled();
  });
});

describe("Redis functions with client", () => {
  it("passes parameters to redis client", async () => {
    process.env.REDIS_URL = "redis://localhost";
    const module = await import("./redis");
    const { setRedis, getRedis, delRedis } = module;

    setMock.mockResolvedValue("OK");
    const value = { a: 1 };
    const resultSet = await setRedis("key", value, 60);
    expect(resultSet).toBe("OK");
    expect(setMock).toHaveBeenCalledWith("key", JSON.stringify(value), {
      EX: 60
    });

    getMock.mockResolvedValue("VAL");
    const resultGet = await getRedis("key");
    expect(resultGet).toBe("VAL");
    expect(getMock).toHaveBeenCalledWith("key");

    delMock.mockResolvedValue(1);
    const resultDel = await delRedis("key");
    expect(resultDel).toBe(1);
    expect(delMock).toHaveBeenCalledWith("key");

    const calls = infoMock.mock.calls.filter(
      (call) => call[0] === "[Redis] No Redis client, using fallback"
    );
    expect(calls).toHaveLength(0);
  });
});
