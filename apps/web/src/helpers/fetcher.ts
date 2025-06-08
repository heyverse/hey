import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";
import { HEY_API_URL } from "@hey/data/constants";
import type {
  AiTranslate,
  CompleteUpload,
  InitUpload,
  Live,
  Oembed,
  Preferences,
  UploadPart
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
  const headers: HeadersInit = {
    "X-Access-Token": hydrateAuthTokens().accessToken || "",
    ...config.headers,
    ...(options.headers || {})
  };
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...options,
    credentials: "include",
    headers
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
  oembed: {
    get: (url: string): Promise<Oembed> => {
      return fetchApi<Oembed>(`/oembed/get?url=${url}`, { method: "GET" });
    }
  },
  upload: {
    init: (
      key: string,
      contentType: string | undefined
    ): Promise<InitUpload> => {
      return fetchApi<InitUpload>("/upload/init", {
        method: "POST",
        body: JSON.stringify({ key, contentType })
      });
    },
    part: (
      uploadId: string,
      key: string,
      partNumber: number,
      chunk: Blob
    ): Promise<UploadPart> => {
      return fetchApi<UploadPart>("/upload/part", {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "Upload-Id": uploadId,
          Key: key,
          "Part-Number": partNumber.toString()
        },
        body: chunk
      });
    },
    complete: (
      uploadId: string,
      key: string,
      parts: Array<{ partNumber: number; etag: string }>
    ): Promise<CompleteUpload> => {
      return fetchApi<CompleteUpload>("/upload/complete", {
        method: "POST",
        body: JSON.stringify({ uploadId, key, parts })
      });
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
