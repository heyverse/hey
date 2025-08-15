import { useAccountQuery } from "@hey/indexer";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Account = () => {
  const { username } = useLocalSearchParams<{ username: string }>();

  const { data, loading } = useAccountQuery({
    variables: { request: { username: { localName: username } } }
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data?.account) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Account not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>@{data.account.username?.localName}</Text>
    </View>
  );
};

export default Account;
