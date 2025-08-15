import "../global.css";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import authLink from "@/helpers/authLink";
import App from "./App";

const lensApolloClient = createApolloClient(authLink);

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={lensApolloClient}>
        <App />
      </ApolloProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
