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
});
