import { HEY_API_URL } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import type { Oembed, STS } from "@hey/types/api";
import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";
import { isTokenExpiringSoon, refreshTokens } from "./tokenManager";

interface ApiConfig {
  baseUrl?: string;
  headers?: HeadersInit;
}

const config: ApiConfig = {
  baseUrl: HEY_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
};

const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const { accessToken, refreshToken } = hydrateAuthTokens();
  let token = accessToken;

  if (token && refreshToken && isTokenExpiringSoon(token)) {
    try {
      token = await refreshTokens(refreshToken);
    } catch {}
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);

  let response: Response;

  try {
    response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...{ "X-Access-Token": token || "" },
        ...config.headers
      },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();

  if (result.status === Status.Success) {
    return result.data;
  }

  throw new Error(result.error);
};

export const hono = {
  likes: {
    create: async (payload: { slug: string }) =>
      fetchApi<{ ok: boolean; skipped?: boolean }>("/likes", {
        body: JSON.stringify(payload),
        method: "POST"
      })
  },
  metadata: {
    sts: (): Promise<STS> => {
      return fetchApi<STS>("/metadata/sts", { method: "GET" });
    }
  },
  oembed: {
    get: (url: string): Promise<Oembed> => {
      return fetchApi<Oembed>(`/oembed/get?url=${url}`, { method: "GET" });
    }
  },
  pageview: {
    create: async (path: string) =>
      fetchApi<{ ok: boolean; skipped?: boolean }>("/pageview", {
        body: JSON.stringify({ path }),
        method: "POST"
      })
  },
  posts: {
    create: async (payload: { slug: string; type?: string }) =>
      fetchApi<{ ok: boolean; skipped?: boolean }>("/posts", {
        body: JSON.stringify(payload),
        method: "POST"
      })
  }
};
