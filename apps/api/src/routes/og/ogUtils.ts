import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import type { HtmlEscapedString } from "hono/utils/html";
import defaultMetadata from "../../utils/defaultMetadata";
import { getRedis, setRedis } from "../../utils/redis";

interface OgHelperOptions<T> {
  ctx: Context;
  cacheKey: string;
  query: any;
  variables: Record<string, any>;
  extractData: (data: any) => T | null;
  buildJsonLd: (data: T) => Record<string, any>;
  buildHtml: (
    data: T,
    escapedJsonLd: string
  ) => HtmlEscapedString | Promise<HtmlEscapedString>;
}

const generateOg = async <T>({
  ctx,
  cacheKey,
  query,
  variables,
  extractData,
  buildJsonLd,
  buildHtml
}: OgHelperOptions<T>) => {
  try {
    const cached = await getRedis(cacheKey);
    if (cached) {
      return ctx.html(cached, 200);
    }

    const { data } = await apolloClient.query({
      fetchPolicy: "no-cache",
      query,
      variables
    });

    const parsed = extractData(data);
    if (!parsed) {
      return ctx.html(defaultMetadata, 404);
    }

    const jsonLd = buildJsonLd(parsed);
    const escapedJsonLd = JSON.stringify(jsonLd)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");

    const ogHtml = await buildHtml(parsed, escapedJsonLd);
    const cleanHtml = ogHtml.toString().replace(/\n\s+/g, "").trim();

    await setRedis(cacheKey, cleanHtml);

    return ctx.html(cleanHtml, 200);
  } catch {
    return ctx.html(defaultMetadata, 500);
  }
};

export default generateOg;
