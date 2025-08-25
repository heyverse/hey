import type { ReactElement } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  UserPlusIcon
} from "react-native-heroicons/outline";

interface NotificationItem {
  id: string;
  user: string;
  content: string;
  icon: ReactElement;
  read: boolean;
  timestamp: string;
}

const Notifications = () => {
  // Mock notification data
  const notifications: NotificationItem[] = [
    {
      content: "liked your post",
      icon: <HeartIcon className="size-5 text-red-500" />,
      id: "1",
      read: false,
      timestamp: "2m ago",
      user: "john_doe"
    },
    {
      content: "commented on your post: 'Great content!'",
      icon: <ChatBubbleLeftIcon className="size-5 text-blue-500" />,
      id: "2",
      read: false,
      timestamp: "15m ago",
      user: "jane_smith"
    },
    {
      content: "started following you",
      icon: <UserPlusIcon className="size-5 text-green-500" />,
      id: "3",
      read: true,
      timestamp: "1h ago",
      user: "alex_wilson"
    },
    {
      content: "mentioned you in a post",
      icon: <BellIcon className="size-5 text-purple-500" />,
      id: "4",
      read: true,
      timestamp: "2h ago",
      user: "sarah_jones"
    },
    {
      content: "liked your comment",
      icon: <HeartIcon className="size-5 text-red-500" />,
      id: "5",
      read: true,
      timestamp: "3h ago",
      user: "mike_brown"
    }
  ];

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      className={`border-gray-100 border-b p-4 ${
        item.read ? "bg-white" : "bg-blue-50"
      }`}
    >
      <View className="flex-row items-start">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-300">
          {item.icon}
        </View>
        <View className="flex-1">
          <View className="mb-1 flex-row items-center">
            <Text className="mr-1 font-semibold text-gray-900">
              {item.user}
            </Text>
            <Text className="flex-1 text-gray-700">{item.content}</Text>
          </View>
          <Text className="text-gray-500 text-sm">{item.timestamp}</Text>
        </View>
        {!item.read && (
          <View className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-gray-100 border-b px-5 py-4">
        <Text className="font-bold text-2xl">Notifications</Text>
        <TouchableOpacity>
          <Text className="font-medium text-blue-500">Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList<NotificationItem>
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Notifications;
