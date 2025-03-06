import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

/**
 * Retrieves common auth API headers.
 *
 * @returns {Object} - The auth API headers.
 */
export const getAuthApiHeaders = () => {
  return { "X-Id-Token": hydrateAuthTokens()?.idToken };
};
