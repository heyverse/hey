import {
  hydrateAuthTokens,
  signIn,
  signOut
} from "@/store/persisted/useAuthStore";
import { ApolloLink, fromPromise, toPromise } from "@apollo/client";
import { LENS_API_URL } from "@hey/data/constants";
import parseJwt from "@hey/helpers/parseJwt";
import type { RefreshResult } from "@hey/indexer";

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
        idToken
      }
      __typename
    }
  }
`;

let refreshPromise: Promise<string> | null = null;

const MAX_RETRIES = 5;

const executeTokenRefresh = async (
  refreshToken: string,
  attempt = 0
): Promise<string> => {
  try {
    const response = await fetch(LENS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "Refresh",
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: { request: { refreshToken } }
      })
    });

    if (!response.ok) {
      return await executeTokenRefresh(refreshToken, attempt + 1);
    }

    const data = await response.json();
    const refreshResult = data?.data?.refresh as RefreshResult;

    if (!refreshResult) {
      throw new Error("No response from refresh");
    }

    const { __typename } = refreshResult;

    if (__typename === "AuthenticationTokens") {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        idToken: newIdToken
      } = refreshResult;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Missing tokens in refresh response");
      }

      signIn({
        accessToken: newAccessToken,
        idToken: newIdToken,
        refreshToken: newRefreshToken
      });

      return newAccessToken;
    }

    if (__typename === "ForbiddenError") {
      signOut();
      throw new Error("Refresh token is invalid or expired");
    }

    if (attempt < MAX_RETRIES) {
      return await executeTokenRefresh(refreshToken, attempt + 1);
    }

    throw new Error("Unknown error during token refresh");
  } catch (error) {
    signOut();
    throw error;
  } finally {
    refreshPromise = null;
  }
};

const refreshTokens = (refreshToken: string): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = executeTokenRefresh(refreshToken);
  }

  return refreshPromise;
};

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const tokenData = parseJwt(accessToken);
  const isExpiringSoon =
    tokenData?.exp && Date.now() >= tokenData.exp * 1000 - 2 * 60 * 1000;

  if (!isExpiringSoon) {
    operation.setContext({
      headers: { "X-Access-Token": accessToken }
    });

    return forward(operation);
  }

  return fromPromise(
    refreshTokens(refreshToken)
      .then((newAccessToken) => {
        operation.setContext({
          headers: { "X-Access-Token": newAccessToken }
        });
        return toPromise(forward(operation));
      })
      .catch(() => toPromise(forward(operation)))
  );
});

export default authLink;
