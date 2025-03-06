import type { AnyPostFragment } from "@hey/indexer";

type Typename<T = string> = { [key in "__typename"]?: T };

type PickByTypename<
  T extends Typename,
  P extends T["__typename"] | undefined
> = T extends {
  __typename?: P;
}
  ? T
  : never;

/**
 * Retrieves whether a post is a repost.
 *
 * @param {null | AnyPostFragment} post - The post to check.
 * @returns {boolean} A boolean indicating whether the post is a repost.
 */
export function isRepost<T extends AnyPostFragment>(
  post: null | T
): post is PickByTypename<T, "Repost"> {
  return post?.__typename === "Repost";
}
