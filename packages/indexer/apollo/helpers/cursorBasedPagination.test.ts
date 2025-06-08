import { describe, expect, it } from "vitest";
import cursorBasedPagination from "./cursorBasedPagination";

describe("cursorBasedPagination", () => {
  const fieldPolicy = cursorBasedPagination<any>([]);

  it("merges existing and incoming items", () => {
    const existing = {
      items: [{ id: 1 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    };
    const incoming = {
      items: [{ id: 2 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: "b", next: "c" }
    };

    const result = (fieldPolicy.merge as any)?.(existing, incoming, {} as any);

    expect(result.items).toEqual([...existing.items, ...incoming.items]);
    expect(result.pageInfo).toBe(incoming.pageInfo);
  });

  it("merges when existing items are undefined", () => {
    const existing = {
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    } as any;
    const incoming = {
      items: [{ id: 2 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: "b", next: "c" }
    };

    const result = (fieldPolicy.merge as any)?.(existing, incoming, {} as any);

    expect(result.items).toEqual(incoming.items);
    expect(result.pageInfo).toBe(incoming.pageInfo);
  });

  it("merges when incoming items are undefined", () => {
    const existing = {
      items: [{ id: 1 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    };
    const incoming = {
      pageInfo: { __typename: "PaginatedResultInfo", prev: "b", next: "c" }
    } as any;

    const result = (fieldPolicy.merge as any)?.(existing, incoming, {} as any);

    expect(result.items).toEqual(existing.items);
    expect(result.pageInfo).toBe(incoming.pageInfo);
  });

  it("merges when incoming pageInfo is missing", () => {
    const existing = {
      items: [{ id: 1 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    };
    const incoming = {
      items: [{ id: 2 }]
    } as any;

    const result = (fieldPolicy.merge as any)?.(existing, incoming, {} as any);

    expect(result.items).toEqual([...existing.items, ...incoming.items]);
    expect(result.pageInfo).toBeUndefined();
  });

  it("reads items and clones pageInfo", () => {
    const existing = {
      items: [{ id: 1 }],
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    };

    const result = (fieldPolicy.read as any)?.(existing, {} as any);

    expect(result).toEqual({
      ...existing,
      pageInfo: { ...existing.pageInfo }
    });
    expect(result).not.toBe(existing);
    expect(result.pageInfo).not.toBe(existing.pageInfo);
  });

  it("reads when items are undefined", () => {
    const existing = {
      pageInfo: { __typename: "PaginatedResultInfo", prev: null, next: "a" }
    } as any;

    const result = (fieldPolicy.read as any)?.(existing, {} as any);

    expect(result).toEqual({
      ...existing,
      pageInfo: { ...existing.pageInfo }
    });
    expect(result.items).toBeUndefined();
    expect(result.pageInfo).not.toBe(existing.pageInfo);
  });
});
