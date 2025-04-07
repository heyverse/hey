import { Card } from "@/components/Shared/UI";

interface HiddenPostProps {
  type?: string;
}

const HiddenPost = ({ type = "Post" }: HiddenPostProps) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800 mt-2" forceRounded>
      <div className="px-4 py-3 text-sm">{type} was hidden by the author</div>
    </Card>
  );
};

export default HiddenPost;
