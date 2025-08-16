import { ApolloLink, fromPromise, toPromise } from "@apollo/client";
import { hydrateAuthTokens, signOut } from "@/store/persisted/useAuthStore";
import { isTokenExpiringSoon, refreshTokens } from "./tokenManager";

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const isExpiringSoon = isTokenExpiringSoon(accessToken);

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
