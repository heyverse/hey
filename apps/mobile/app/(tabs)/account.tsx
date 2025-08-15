import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Account = () => {
  const { username } = useLocalSearchParams<{ username: string }>();

  if (!username) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-600">
        <Text>Account not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-600">
      <Text>@{username}</Text>
    </View>
  );
};

export default Account;
