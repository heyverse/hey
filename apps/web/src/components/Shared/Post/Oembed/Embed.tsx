import { Card } from "@/components/Shared/UI";
import getFavicon from "@hey/helpers/getFavicon";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Oembed } from "@hey/types/api";
import { Link } from "react-router";

interface EmbedProps {
  og: Oembed;
}

const Embed = ({ og }: EmbedProps) => {
  if (!og) {
    return null;
  }

  const favicon = getFavicon(og.url);

  return (
    <div className="mt-4 w-full text-sm md:w-4/6">
      <Link
        to={og.url}
        onClick={stopEventPropagation}
        rel="noreferrer noopener"
        target={og.url.includes(location.host) ? "_self" : "_blank"}
      >
        <Card className="truncate p-5" forceRounded>
          <div className="flex flex-col gap-y-1">
            {og.title ? (
              <div className="flex items-center space-x-1.5">
                {favicon ? (
                  <img
                    alt="Favicon"
                    className="size-4 rounded-full"
                    height={16}
                    src={favicon}
                    title={og.url}
                    width={16}
                  />
                ) : null}
                <b className="truncate">{og.title}</b>
              </div>
            ) : null}
            {og.description ? (
              <div className="line-clamp-1 whitespace-break-spaces text-gray-500 dark:text-gray-200">
                {og.description.replace(/ +/g, " ")}
              </div>
            ) : null}
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Embed;
