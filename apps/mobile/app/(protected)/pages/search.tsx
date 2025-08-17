import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  DocumentTextIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  UserIcon
} from "react-native-heroicons/outline";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock search results
  const searchResults = {
    hashtags: [
      { id: "1", posts: "1.2M posts", tag: "#reactnative" },
      { id: "2", posts: "856K posts", tag: "#mobile" },
      { id: "3", posts: "2.1M posts", tag: "#development" }
    ],
    people: [
      { followers: "1.2K", id: "1", name: "John Doe", username: "@johndoe" },
      { followers: "856", id: "2", name: "Jane Smith", username: "@janesmith" },
      {
        followers: "2.1K",
        id: "3",
        name: "Alex Wilson",
        username: "@alexwilson"
      }
    ],
    posts: [
      {
        author: "John Doe",
        content: "This is a sample post that matches your search...",
        id: "1",
        timestamp: "2h ago"
      },
      {
        author: "Jane Smith",
        content: "Another post with relevant content...",
        id: "2",
        timestamp: "4h ago"
      },
      {
        author: "Alex Wilson",
        content: "More search results content here...",
        id: "3",
        timestamp: "6h ago"
      }
    ]
  };

  const tabs = [
    { id: "all", title: "All" },
    { id: "people", title: "People" },
    { id: "posts", title: "Posts" },
    { id: "hashtags", title: "Hashtags" }
  ];

  const renderPerson = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center border-gray-100 border-b p-4">
      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-300">
        <UserIcon className="size-6 text-gray-600" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.username}</Text>
        <Text className="text-gray-400 text-xs">
          {item.followers} followers
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity className="border-gray-100 border-b p-4">
      <View className="mb-2 flex-row items-center">
        <View className="mr-2 h-8 w-8 rounded-full bg-gray-300" />
        <Text className="mr-2 font-semibold text-gray-900">{item.author}</Text>
        <Text className="text-gray-500 text-sm">{item.timestamp}</Text>
      </View>
      <Text className="text-gray-700">{item.content}</Text>
    </TouchableOpacity>
  );

  const renderHashtag = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center border-gray-100 border-b p-4">
      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <HashtagIcon className="size-6 text-blue-600" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.tag}</Text>
        <Text className="text-gray-500 text-sm">{item.posts}</Text>
      </View>
    </TouchableOpacity>
  );

  const getFilteredResults = () => {
    if (!searchQuery) return [];

    switch (activeTab) {
      case "people":
        return searchResults.people;
      case "posts":
        return searchResults.posts;
      case "hashtags":
        return searchResults.hashtags;
      default:
        return [
          ...searchResults.people.slice(0, 2),
          ...searchResults.posts.slice(0, 2),
          ...searchResults.hashtags.slice(0, 2)
        ];
    }
  };

  const renderResult = ({ item }: { item: any }) => {
    if (item.username) return renderPerson({ item });
    if (item.content) return renderPost({ item });
    if (item.tag) return renderHashtag({ item });
    return null;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-gray-100 border-b px-5 py-4">
        <Text className="mb-4 font-bold text-2xl">Search</Text>

        {/* Search Input */}
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-3">
          <MagnifyingGlassIcon className="mr-3 size-5 text-gray-400" />
          <TextInput
            className="flex-1 text-gray-900"
            onChangeText={setSearchQuery}
            placeholder="Search for people, posts, or hashtags..."
            returnKeyType="search"
            value={searchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-gray-100 border-b">
        {tabs.map((tab) => (
          <TouchableOpacity
            className={`flex-1 items-center border-b-2 py-3 ${
              activeTab === tab.id ? "border-blue-500" : "border-transparent"
            }`}
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              className={`font-medium ${
                activeTab === tab.id ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      {searchQuery ? (
        <FlatList
          data={getFilteredResults()}
          keyExtractor={(item) => item.id}
          renderItem={renderResult}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <DocumentTextIcon className="mb-4 size-16 text-gray-300" />
          <Text className="mb-2 text-gray-500 text-lg">Start searching</Text>
          <Text className="px-8 text-center text-gray-400">
            Search for people, posts, hashtags, and more
          </Text>
        </View>
      )}
    </View>
  );
};

export default Search;
