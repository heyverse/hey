import type { SmartMedia } from "@/types/smart-media";

interface SmartMediaDetailsProps {
  smartMedia: SmartMedia;
}

const SmartMediaDetails = ({ smartMedia }: SmartMediaDetailsProps) => {
  if (!smartMedia) {
    return null;
  }

  const { template, category, description } = smartMedia;

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <span className="font-bold text-base">
          {typeof template === "string" ? template : template.formatted}
        </span>
        {category && (
          <span className="text-gray-500 text-sm">
            {typeof category === "string" ? category : category.formatted}
          </span>
        )}
      </div>
      {description && <div className="text-sm">{description}</div>}
    </div>
  );
};

export default SmartMediaDetails;
