import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  BellIcon,
  CogIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon
} from "react-native-heroicons/outline";

const Settings = () => {
  const settingsOptions = [
    {
      description: "Manage your profile information",
      icon: <UserIcon className="size-6 text-gray-600" />,
      onPress: () => {
        // Navigate to profile settings
      },
      title: "Profile Settings"
    },
    {
      description: "Configure notification preferences",
      icon: <BellIcon className="size-6 text-gray-600" />,
      onPress: () => {
        // Navigate to notification settings
      },
      title: "Notifications"
    },
    {
      description: "Manage privacy and security settings",
      icon: <ShieldCheckIcon className="size-6 text-gray-600" />,
      onPress: () => {
        // Navigate to privacy settings
      },
      title: "Privacy & Security"
    },
    {
      description: "Account settings and preferences",
      icon: <KeyIcon className="size-6 text-gray-600" />,
      onPress: () => {
        // Navigate to account settings
      },
      title: "Account"
    },
    {
      description: "App preferences and configurations",
      icon: <CogIcon className="size-6 text-gray-600" />,
      onPress: () => {
        // Navigate to general settings
      },
      title: "General"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <Text className="px-5 py-4 font-bold text-2xl">Settings</Text>

      <ScrollView className="flex-1">
        <View className="px-5">
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              className="flex-row items-center border-gray-100 border-b py-4"
              key={index}
              onPress={option.onPress}
            >
              <View className="mr-4">{option.icon}</View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 text-lg">
                  {option.title}
                </Text>
                <Text className="mt-1 text-gray-500 text-sm">
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
