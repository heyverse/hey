import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon
} from "react-native-heroicons/outline";

const Post = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock post data - in a real app, you'd fetch this from your API
  const postData = {
    author: {
      avatar: "https://via.placeholder.com/40",
      name: "John Doe",
      username: "@johndoe"
    },
    comments: 8,
    content:
      "This is a sample post content that demonstrates the post detail view in the mobile app.",
    id: id || "1",
    isLiked: false,
    likes: 42,
    shares: 3,
    timestamp: "2h ago"
  };

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Post Header */}
        <View className="border-gray-100 border-b p-4">
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">
                {postData.author.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {postData.author.username} • {postData.timestamp}
              </Text>
            </View>
          </View>

          {/* Post Content */}
          <Text className="mb-4 text-base text-gray-900 leading-6">
            {postData.content}
          </Text>

          {/* Post Actions */}
          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center">
              <ChatBubbleLeftIcon className="mr-1 size-5 text-gray-500" />
              <Text className="mr-6 text-gray-500 text-sm">
                {postData.comments}
              </Text>
            </View>

            <View className="flex-row items-center">
              <HeartIcon className="mr-1 size-5 text-gray-500" />
              <Text className="mr-6 text-gray-500 text-sm">
                {postData.likes}
              </Text>
            </View>

            <View className="flex-row items-center">
              <ShareIcon className="mr-1 size-5 text-gray-500" />
              <Text className="text-gray-500 text-sm">{postData.shares}</Text>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View className="p-4">
          <Text className="mb-4 font-semibold text-lg">Comments</Text>

          {/* Sample Comments */}
          {[1, 2, 3].map((comment) => (
            <View className="mb-4 flex-row" key={comment}>
              <View className="mr-3 h-8 w-8 rounded-full bg-gray-300" />
              <View className="flex-1">
                <View className="mb-1 flex-row items-center">
                  <Text className="mr-2 font-semibold text-sm">
                    User {comment}
                  </Text>
                  <Text className="text-gray-500 text-xs">1h ago</Text>
                </View>
                <Text className="text-gray-700 text-sm">
                  This is a sample comment on the post. It shows how comments
                  would appear in the post detail view.
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Post;
