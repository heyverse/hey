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

class HonoClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor({
    baseUrl = HEY_API_URL,
    headers = { "Content-Type": "application/json" }
  }: ApiConfig = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  private buildHeaders(): HeadersInit {
    const { accessToken } = hydrateAuthTokens();
    return {
      ...this.headers,
      ...(accessToken ? { "X-Access-Token": accessToken } : {})
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      credentials: "include",
      headers: this.buildHeaders(),
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.error);
  }

  ai = {
    translate: (post: string): Promise<AiTranslate> =>
      this.request<AiTranslate>("/ai/translate", {
        method: "POST",
        body: JSON.stringify({ post })
      })
  };

  live = {
    create: ({ record }: { record: boolean }): Promise<Live> =>
      this.request<Live>("/live/create", {
        method: "POST",
        body: JSON.stringify({ record })
      })
  };

  metadata = {
    sts: (): Promise<STS> =>
      this.request<STS>("/metadata/sts", { method: "GET" })
  };

  oembed = {
    get: (url: string): Promise<Oembed> =>
      this.request<Oembed>(`/oembed/get?url=${url}`, { method: "GET" })
  };

  preferences = {
    get: (): Promise<Preferences> =>
      this.request<Preferences>("/preferences/get", { method: "GET" }),
    update: (preferences: Partial<Preferences>): Promise<Preferences> =>
      this.request<Preferences>("/preferences/update", {
        method: "POST",
        body: JSON.stringify(preferences)
      })
  };
}

export const hono = new HonoClient();
export type { HonoClient };
