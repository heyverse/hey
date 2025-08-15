import type { ReactNode } from "react";
import { memo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import useLoadMore from "@/hooks/useLoadMoreOnIntersect";

interface PostFeedProps<T extends { id: string }> {
  items: T[];
  loading?: boolean;
  error?: { message?: string };
  hasMore?: boolean;
  handleEndReached: () => Promise<void>;
  emptyIcon: ReactNode;
  emptyMessage: ReactNode;
  errorTitle: string;
  renderItem: (item: T) => ReactNode;
}

const PostFeed = <T extends { id: string }>({
  items,
  loading = false,
  error,
  hasMore,
  handleEndReached,
  emptyIcon,
  emptyMessage,
  errorTitle,
  renderItem
}: PostFeedProps<T>) => {
  const { isFetchingMore, onEndReached } = useLoadMore({
    hasMore: Boolean(hasMore),
    onLoadMore: handleEndReached
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return (
      <View className="items-center">
        <Text className="font-bold text-lg">{errorTitle}</Text>
        <Text>{error?.message || "Something went wrong"}</Text>
      </View>
    );
  }

  if (!items?.length) {
    return (
      <View className="items-center">
        {emptyIcon}
        <Text>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={items}
      keyExtractor={(item) => item.id}
      ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      renderItem={({ item }) => renderItem(item) as any}
    />
  );
};

export default memo(PostFeed) as typeof PostFeed;
