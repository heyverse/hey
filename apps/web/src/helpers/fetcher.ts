import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";
import { HEY_API_URL } from "@hey/data/constants";
import type { PermissionId } from "@hey/data/permissions";
import type { Account, Live, Oembed, Preferences, STS } from "@hey/types/api";

type ApiResponse<T> = Promise<T>;

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
): ApiResponse<T> => {
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...{ "x-id-token": hydrateAuthTokens().accessToken || "" },
      ...config.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const result = await response.json();

  if (result.success) {
    return result.data;
  }

  throw new Error(result.error);
};

export const hono = {
  account: {
    get: async (address: string): ApiResponse<Account> => {
      return fetchApi<Account>(`/account/get/${address}`, { method: "GET" });
    }
  },
  live: {
    create: async ({ record }: { record: boolean }): ApiResponse<Live> => {
      return fetchApi<Live>("/live/create", {
        method: "POST",
        body: JSON.stringify({ record })
      });
    }
  },
  metadata: {
    sts: async (): ApiResponse<STS> => {
      return fetchApi<STS>("/metadata/sts", { method: "GET" });
    }
  },
  oembed: {
    get: async (url: string): ApiResponse<Oembed> => {
      return fetchApi<Oembed>(`/oembed/get?url=${url}`, { method: "GET" });
    }
  },
  preferences: {
    get: async (): ApiResponse<Preferences> => {
      return fetchApi<Preferences>("/preferences/get", { method: "GET" });
    },
    update: async (
      preferences: Partial<Preferences>
    ): ApiResponse<Preferences> => {
      return fetchApi<Preferences>("/preferences/update", {
        method: "POST",
        body: JSON.stringify(preferences)
      });
    }
  },
  internal: {
    permission: {
      assign: async ({
        account,
        enabled,
        permission
      }: {
        account: string;
        enabled: boolean;
        permission: PermissionId;
      }): ApiResponse<Preferences> => {
        return fetchApi<Preferences>("/internal/permission/assign", {
          method: "POST",
          body: JSON.stringify({ account, enabled, permission })
        });
      }
    }
  }
};
