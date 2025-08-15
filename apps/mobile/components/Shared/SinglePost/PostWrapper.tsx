import type { AnyPostFragment } from "@hey/indexer";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { memo } from "react";
import { Text } from "react-native";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  post: AnyPostFragment;
}

const PostWrapper = ({ children, className = "", post }: PostWrapperProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.setParams({ post: post.slug });
  };

  return (
    <Text className={className} onPress={handleClick}>
      {children}
    </Text>
  );
};

export default memo(PostWrapper);
