import "../global.css";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import authLink from "@/helpers/authLink";

const lensApolloClient = createApolloClient(authLink);

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={lensApolloClient}>
        <Slot />
      </ApolloProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
