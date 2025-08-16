import { AccountFeedType } from "@hey/data/enums";
import getAccount from "@hey/helpers/getAccount";
import { useAccountQuery } from "@hey/indexer";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import AccountFeed from "@/components/Account/AccountFeed";

const Account = () => {
  const { username } = useLocalSearchParams<{ username: string }>();

  const { data, loading } = useAccountQuery({
    variables: { request: { username: { localName: username } } }
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
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

  const account = data?.account;
  const accountInfo = getAccount(account);

  return (
    <View className="flex-1">
      <Text className="px-5 py-3 font-bold text-lg">
        {accountInfo.usernameWithPrefix}
      </Text>
      <AccountFeed
        address={account.address}
        type={AccountFeedType.Feed}
        username={accountInfo.usernameWithPrefix}
      />
    </View>
  );
};

export default Account;
