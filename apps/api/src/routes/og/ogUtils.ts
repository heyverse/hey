import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import type { HtmlEscapedString } from "hono/utils/html";
import defaultMetadata from "@/utils/defaultMetadata";

interface OgHelperOptions<T> {
  ctx: Context;
  query: any;
  variables: Record<string, any>;
  extractData: (data: any) => T | null;
  buildHtml: (data: T) => HtmlEscapedString | Promise<HtmlEscapedString>;
}

const generateOg = async <T>({
  ctx,
  query,
  variables,
  extractData,
  buildHtml
}: OgHelperOptions<T>) => {
  try {
    const { data } = await apolloClient.query({
      fetchPolicy: "no-cache",
      query,
      variables
    });

    const parsed = extractData(data);
    if (!parsed) {
      return ctx.html(defaultMetadata, 404);
    }

    const ogHtml = await buildHtml(parsed);
    const cleanHtml = ogHtml.toString().replace(/\n\s+/g, "").trim();

    return ctx.html(cleanHtml, 200);
  } catch {
    return ctx.html(defaultMetadata, 500);
  }
};

export default generateOg;
