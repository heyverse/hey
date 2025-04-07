import { Card, H6 } from "@/components/Shared/UI";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const CommentWarning = () => {
  return (
    <Card className="!bg-blue-100 flex items-center space-x-1.5 border-blue-300 p-5 text-gray-500">
      <ChatBubbleLeftIcon className="size-4 text-blue-500" />
      <H6>You can't reply to this post</H6>
    </Card>
  );
};

export default CommentWarning;
