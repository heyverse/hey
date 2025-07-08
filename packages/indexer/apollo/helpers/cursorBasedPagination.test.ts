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
  it("merges existing and incoming social media posts in feed", () => {
    const policy = cursorBasedPagination<TestPagination>([]);
    const existing = { items: ["post1"], pageInfo };
    const incoming = {
      items: ["post2"],
      pageInfo: { ...pageInfo, next: "post3" }
    };

    const merged = (
      policy.merge as FieldMergeFunction<TestPagination, TestPagination>
    )(existing, incoming, {} as any);

    expect(merged.items).toEqual(["post1", "post2"]);
    expect(merged.pageInfo).toEqual(incoming.pageInfo);
  });

  it("returns social media feed items and pagination info unchanged", () => {
    const policy = cursorBasedPagination<TestPagination>([]);
    const existing = {
      items: ["post1", "post2"],
      pageInfo: { ...pageInfo, next: "post4" }
    };

    const read = policy.read?.(existing, {} as any);

    expect(read?.items).toEqual(existing.items);
    expect(read?.pageInfo).toEqual(existing.pageInfo);
  });
});
