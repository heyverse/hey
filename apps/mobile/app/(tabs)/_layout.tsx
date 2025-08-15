import {
  BellIcon,
  HomeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import { Tabs } from "expo-router";
import { Image, Platform } from "react-native";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const TabLayout = () => {
  const { currentAccount } = useAccountStore();
  const avatar = getAvatar(currentAccount, TRANSFORMS.AVATAR_BIG);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          default: {},
          ios: { position: "absolute" }
        })
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: () => <HomeIcon className="size-6" />,
          tabBarLabel: () => null
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: () => <MagnifyingGlassIcon className="size-6" />,
          tabBarLabel: () => null
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: () => <BellIcon className="size-6" />,
          tabBarLabel: () => null
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: () => (
            <Image className="h-6 w-6 rounded-full" source={{ uri: avatar }} />
          ),
          tabBarLabel: () => null
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
