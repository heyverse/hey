import { BANNER_IDS, TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import { useMeQuery } from "@hey/indexer";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { ActivityIndicator, Image, SafeAreaView, View } from "react-native";
import {
  BellIcon as BellIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  HomeIcon as HomeIconOutline,
  PlusIcon as PlusIconOutline
} from "react-native-heroicons/outline";
import {
  BellIcon as BellIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  HomeIcon as HomeIconSolid,
  PlusIcon as PlusIconSolid
} from "react-native-heroicons/solid";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut, useAuthStore } from "@/store/persisted/useAuthStore";
import LoginScreen from "../../components/Logins";
import applyFonts from "../../helpers/applyFonts";

const TabLayout = () => {
  const { currentAccount } = useAccountStore();
  const [loaded] = useFonts({
    SofiaProSoftBold: require("../../assets/fonts/SofiaProSoftBold.ttf"),
    SofiaProSoftMedium: require("../../assets/fonts/SofiaProSoftMed.ttf"),
    SofiaProSoftRegular: require("../../assets/fonts/SofiaProSoftReg.ttf")
  });

  applyFonts();

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
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (!data?.me) {
    return (
      <SafeAreaView className="flex-1">
        <LoginScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  const avatar = (
    <Image
      className="size-7 rounded-full"
      source={{ uri: getAvatar(currentAccount, TRANSFORMS.AVATAR_BIG) }}
    />
  );

  const TABS = [
    {
      active: <HomeIconSolid className="size-7" />,
      default: <HomeIconOutline className="size-7" />,
      name: "index"
    },
    {
      active: <GlobeAltIconSolid className="size-7" />,
      default: <GlobeAltIconOutline className="size-7" />,
      name: "explore"
    },
    {
      active: <PlusIconSolid className="size-7" />,
      default: <PlusIconOutline className="size-7" />,
      name: "new"
    },
    {
      active: <BellIconSolid className="size-7" />,
      default: <BellIconOutline className="size-7" />,
      name: "notifications"
    },
    {
      active: avatar,
      default: avatar,
      name: "account",
      params: { username: "yoginth" }
    }
  ];

  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{ headerShown: false, tabBarStyle: { paddingTop: 8 } }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            initialParams={tab.params}
            key={tab.name}
            name={tab.name}
            options={{
              tabBarIcon: ({ focused }) => (focused ? tab.active : tab.default),
              tabBarLabel: () => null
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
