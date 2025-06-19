import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";
import { HEY_API_URL } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import type { Live, Oembed, Preferences, STS } from "@hey/types/api";
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

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...{ "X-Access-Token": token || "" },
      ...config.headers
    }
  });

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
