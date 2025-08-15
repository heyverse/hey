import {
  BellIcon,
  HomeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const TabLayout = () => {
  const { currentAccount } = useAccountStore();
  const avatar = getAvatar(currentAccount, TRANSFORMS.AVATAR_BIG);

  const TABS = [
    {
      icon: <HomeIcon className="size-6" />,
      name: "home"
    },
    {
      icon: <MagnifyingGlassIcon className="size-6" />,
      name: "explore"
    },
    {
      icon: <BellIcon className="size-6" />,
      name: "notifications"
    },
    {
      icon: <Image className="size-6 rounded-full" source={{ uri: avatar }} />,
      name: "account"
    }
  ];

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: () => tab.icon,
            tabBarLabel: () => null
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
