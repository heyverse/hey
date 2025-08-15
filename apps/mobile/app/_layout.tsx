import "../global.css";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import authLink from "@/helpers/authLink";
import App from "./App";

const lensApolloClient = createApolloClient(authLink);

export default function RootLayout() {
  return (
    <ApolloProvider client={lensApolloClient}>
      <App />
    </ApolloProvider>
  );
}
