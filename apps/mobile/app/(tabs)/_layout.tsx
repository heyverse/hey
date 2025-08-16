import { TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import {
  BellIcon as BellIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  HomeIcon as HomeIconOutline
} from "react-native-heroicons/outline";
import {
  BellIcon as BellIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  HomeIcon as HomeIconSolid
} from "react-native-heroicons/solid";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const TabLayout = () => {
  const { currentAccount } = useAccountStore();
  const avatar = (
    <Image
      className="size-6 rounded-full"
      source={{ uri: getAvatar(currentAccount, TRANSFORMS.AVATAR_BIG) }}
    />
  );

  const TABS = [
    {
      active: <HomeIconSolid className="size-6" />,
      default: <HomeIconOutline className="size-6" />,
      name: "index"
    },
    {
      active: <GlobeAltIconSolid className="size-6" />,
      default: <GlobeAltIconOutline className="size-6" />,
      name: "explore"
    },
    {
      active: <BellIconSolid className="size-6" />,
      default: <BellIconOutline className="size-6" />,
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
    <Tabs screenOptions={{ headerShown: false }}>
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
  );
};

export default TabLayout;
