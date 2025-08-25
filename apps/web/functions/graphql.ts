import { LENS_API_URL } from "@hey/data/constants";

export interface Context {
  request: Request;
}

const CACHE_TTL_SECONDS = 600;
const CACHE_CONTROL_HEADER = `public, max-age=${CACHE_TTL_SECONDS}`;

interface CfOptions {
  cacheTtl?: number;
  cacheEverything?: boolean;
}

const fetchUpstream = (url: URL, request: Request, cf?: CfOptions) =>
  fetch(`${LENS_API_URL}${url.search}`, {
    body: request.body,
    headers: request.headers,
    method: request.method,
    ...(cf ? { cf } : {})
  } as RequestInit);

export const onRequest = async ({ request }: Context): Promise<Response> => {
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return fetchUpstream(url, request);
  }

  const extensions = url.searchParams.get("extensions");
  if (!extensions) {
    return fetchUpstream(url, request);
  }

  let hash: string | undefined;
  try {
    hash = JSON.parse(extensions).persistedQuery?.sha256Hash;
  } catch {
    return fetchUpstream(url, request);
  }

  if (!hash) {
    return fetchUpstream(url, request);
  }

  const upstreamResponse = await fetchUpstream(url, request, {
    cacheEverything: true,
    cacheTtl: CACHE_TTL_SECONDS
  });

  if (!upstreamResponse.ok) {
    return upstreamResponse;
  }

  const headers = new Headers(upstreamResponse.headers);
  headers.set("Cache-Control", CACHE_CONTROL_HEADER);

  return new Response(upstreamResponse.body, {
    headers,
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText
  });
};
