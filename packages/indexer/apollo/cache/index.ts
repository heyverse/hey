import { InMemoryCache } from '@apollo/client';
import result from '../../possible-types';
import createCursorFieldPolicy from './createCursorFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    AccountManager: { keyFields: ["manager"] },
    Account: { keyFields: ["address"] },
    Query: {
      fields: {
        timeline: createCursorFieldPolicy(["request", ["account"]]),
        timelineHighlights: createCursorFieldPolicy(["request", ["account"]]),
        following: createCursorFieldPolicy(["request", ["account"]]),
        groupMembers: createCursorFieldPolicy(["request", ["group"]]),
        followers: createCursorFieldPolicy(["request", ["account"]]),
        posts: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        postReferences: createCursorFieldPolicy([
          "request",
          ["referencedPost", "referenceTypes", "relevancyFilter", "visibilityFilter"]
        ]),
        postReactions: createCursorFieldPolicy(["request", ["post"]]),
        whoReferencedPost: createCursorFieldPolicy(["request", ["post", "referenceTypes"]]),
        postBookmarks: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        groups: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        accounts: createCursorFieldPolicy(["request", ["filter", "orderBy"]]),
        accountsBlocked: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        accountManagers: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        authenticatedSessions: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        usernames: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        notifications: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        mlPostsExplore: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
        mlPostsForYou: createCursorFieldPolicy(["request", ["filter", "pageSize"]]),
      }
    }
  }
});

export default cache;
