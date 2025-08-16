import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text>This screen does not exist.</Text>
        <Link className="mt-4 py-4" href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
