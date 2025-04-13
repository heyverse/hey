import { hono } from "@/helpers/fetcher";
import { useQuery } from "@tanstack/react-query";
import Embed from "./Embed";
import EmptyOembed from "./EmptyOembed";

interface OembedProps {
  url: string;
}

const Oembed = ({ url }: OembedProps) => {
  const { data, error, isLoading } = useQuery({
    queryFn: () => hono.oembed.get(url),
    queryKey: ["oembed", url],
    enabled: Boolean(url)
  });

  if (isLoading || error || !data) {
    if (error) {
      return null;
    }

    return <EmptyOembed url={url} />;
  }

  const og = {
    description: data?.description,
    title: data?.title,
    url: url as string
  };

  if (!og.title) {
    return null;
  }

  return <Embed og={og} />;
};

export default Oembed;
