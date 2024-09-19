import { HEY_API_URL } from "@hey/data/constants";
import { ALLOWED_HTML_HOSTS } from "@hey/data/og";
import getFavicon from "@hey/helpers/getFavicon";
import type { AnyPublication } from "@hey/lens";
import type { OG } from "@hey/types/misc";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import Embed from "./Embed";
import EmptyOembed from "./EmptyOembed";
import Frame from "./Frames";
import Player from "./Player";

interface OembedProps {
  onLoad?: (og: OG) => void;
  publication?: AnyPublication;
  url: string;
}

const Oembed: FC<OembedProps> = ({ onLoad, publication, url }) => {
  const { resolvedTheme } = useTheme();
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ["getOembed", url],
    refetchOnMount: false
  });

  const [currentPublication, setCurrentPublication] =
    useState<AnyPublication>();

  useEffect(() => {
    if (publication) {
      setCurrentPublication(publication);
    }
  }, [publication]);

  useEffect(() => {
    if (onLoad) {
      onLoad(data as OG);
    }
  }, [data]);

  if (isLoading || error || !data) {
    if (error) {
      return null;
    }

    const hostname = new URL(url).hostname.replace("www.", "");

    if (ALLOWED_HTML_HOSTS.includes(hostname)) {
      return <div className="shimmer mt-4 h-[415px] w-full rounded-xl" />;
    }

    return <EmptyOembed url={url} />;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    frame: data?.frame,
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    tweet: data?.tweet,
    url: url as string
  };

  if (!og.title && !og.html && !og.frame && !og.tweet) {
    return null;
  }

  if (og.tweet) {
    return (
      <div data-theme={resolvedTheme} className="w-full text-sm md:w-4/6">
        <Tweet id={og.tweet} />
      </div>
    );
  }

  if (og.html) {
    return <Player og={og} />;
  }

  if (og.frame) {
    return <Frame frame={og.frame} publicationId={currentPublication?.id} />;
  }

  return <Embed og={og} publicationId={currentPublication?.id} />;
};

export default Oembed;
