import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";
import { HEY_API_URL } from "@hey/data/constants";
import type {
  AiTranslate,
  Live,
  Oembed,
  Preferences,
  STS
} from "@hey/types/api";

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
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...{ "X-Access-Token": hydrateAuthTokens().accessToken || "" },
      ...config.headers
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();

  if (result.success) {
    return result.data;
  }

  throw new Error(result.error);
};

export const hono = {
  ai: {
    translate: (post: string): Promise<AiTranslate> => {
      return fetchApi<AiTranslate>("/ai/translate", {
        method: "POST",
        body: JSON.stringify({ post })
      });
    }
  },
  live: {
    create: ({ record }: { record: boolean }): Promise<Live> => {
      return fetchApi<Live>("/live/create", {
        method: "POST",
        body: JSON.stringify({ record })
      });
    }
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
  preferences: {
    get: (): Promise<Preferences> => {
      return fetchApi<Preferences>("/preferences/get", { method: "GET" });
    },
    update: (preferences: Partial<Preferences>): Promise<Preferences> => {
      return fetchApi<Preferences>("/preferences/update", {
        method: "POST",
        body: JSON.stringify(preferences)
      });
    }
  }
};
