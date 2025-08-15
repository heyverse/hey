import "../global.css";
import { BANNER_IDS } from "@hey/data/constants";
import { useMeQuery } from "@hey/indexer";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Text, View } from "react-native";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut, useAuthStore } from "@/store/persisted/useAuthStore";
import LoginScreen from "./login";

const App = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  const { setCurrentAccount } = useAccountStore();
  const { accessToken, hasHydrated } = useAuthStore();

  const onError = useCallback(() => {
    signOut();
  }, []);

  const { data, loading } = useMeQuery({
    onCompleted: ({ me }) => {
      setCurrentAccount(me.loggedInAs.account);
    },
    onError,
    skip: !accessToken,
    variables: { proBannerId: BANNER_IDS.PRO }
  });

  if (!loaded || !hasHydrated || (accessToken && loading)) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data?.me) {
    return <LoginScreen />;
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
