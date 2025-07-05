import type { FieldMergeFunction } from "@apollo/client/core";
import { describe, expect, it } from "vitest";
import type { PaginatedResultInfoFragment } from "../../generated";
import cursorBasedPagination from "./cursorBasedPagination";

const pageInfo: PaginatedResultInfoFragment = {
  __typename: "PaginatedResultInfo",
  next: null,
  prev: null
};

interface TestPagination {
  items: string[];
  pageInfo: PaginatedResultInfoFragment;
}

describe("cursorBasedPagination", () => {
  it("merges existing and incoming items", () => {
    const policy = cursorBasedPagination<TestPagination>([]);
    const existing = { items: ["a"], pageInfo };
    const incoming = { items: ["b"], pageInfo: { ...pageInfo, next: "c" } };

    const merged = (
      policy.merge as FieldMergeFunction<TestPagination, TestPagination>
    )(existing, incoming, {} as any);

    expect(merged.items).toEqual(["a", "b"]);
    expect(merged.pageInfo).toEqual(incoming.pageInfo);
  });

  it("returns items and page info unchanged", () => {
    const policy = cursorBasedPagination<TestPagination>([]);
    const existing = {
      items: ["a", "b"],
      pageInfo: { ...pageInfo, next: "d" }
    };

    const read = policy.read?.(existing, {} as any);

    expect(read?.items).toEqual(existing.items);
    expect(read?.pageInfo).toEqual(existing.pageInfo);
  });
});
