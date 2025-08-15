import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import authLink from "@/helpers/authLink";
import "../global.css";

const lensApolloClient = createApolloClient(authLink);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={lensApolloClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ApolloProvider>
  );
}
