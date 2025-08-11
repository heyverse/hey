import type { Oembed } from "@hey/types/api";
import { memo } from "react";
import { Link } from "react-router";
import { Card } from "@/components/Shared/UI";
import getFavicon from "@/helpers/getFavicon";
import injectReferrerToUrl from "@/helpers/injectReferrerToUrl";
import stopEventPropagation from "@/helpers/stopEventPropagation";

interface EmbedProps {
  og: Oembed;
}

const Embed = ({ og }: EmbedProps) => {
  if (!og) {
    return null;
  }

  const url = injectReferrerToUrl(og.url);
  const favicon = getFavicon(url);

  return (
    <div className="mt-4 w-full text-sm md:w-4/6">
      <Link
        onClick={stopEventPropagation}
        rel="noreferrer noopener"
        target={url.includes(location.host) ? "_self" : "_blank"}
        to={url}
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
                    title={url}
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

export default memo(Embed);
