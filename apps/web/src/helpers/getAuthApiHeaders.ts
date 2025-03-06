import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

export const getAuthApiHeaders = () => {
  return { "X-Id-Token": hydrateAuthTokens()?.idToken };
};
