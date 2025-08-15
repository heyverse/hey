import "../global.css";
import { BANNER_IDS } from "@hey/data/constants";
import { useMeQuery } from "@hey/indexer";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { View } from "react-native";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { hydrateAuthTokens, signOut } from "@/store/persisted/useAuthStore";

const App = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  const { setCurrentAccount } = useAccountStore();
  const { accessToken } = hydrateAuthTokens();

  const onError = useCallback(() => {
    signOut();
  }, []);

  const { loading } = useMeQuery({
    onCompleted: ({ me }) => {
      setCurrentAccount(me.loggedInAs.account);
    },
    onError,
    skip: !accessToken || !loaded,
    variables: { proBannerId: BANNER_IDS.PRO }
  });

  if (!loaded || loading) {
    return (
      <View className="flex-1 items-center justify-center">Loading...</View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
