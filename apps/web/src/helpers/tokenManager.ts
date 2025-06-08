import { signIn, signOut } from "@/store/persisted/useAuthStore";
import { LENS_API_URL } from "@hey/data/constants";
import parseJwt from "@hey/helpers/parseJwt";
import type { RefreshResult } from "@hey/indexer";

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
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

    const { data } = await response.json();
    const refreshResult = data?.refresh as RefreshResult;

    if (!refreshResult) {
      throw new Error("No response from refresh");
    }

    const { __typename } = refreshResult;

    if (__typename === "AuthenticationTokens") {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        refreshResult;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Missing tokens in refresh response");
      }

      signIn({
        accessToken: newAccessToken,
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
  } finally {
    refreshPromise = null;
  }
};

export const refreshTokens = (refreshToken: string): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = executeTokenRefresh(refreshToken);
  }

  return refreshPromise;
};

export const isTokenExpiringSoon = (accessToken: string | null): boolean => {
  if (!accessToken) {
    return false;
  }

  const tokenData = parseJwt(accessToken);
  const bufferInMinutes = 5;
  return (
    !!tokenData.exp &&
    Date.now() >= tokenData.exp * 1000 - bufferInMinutes * 60 * 1000
  );
};
