import type { SmartMedia, SmartMediaLight } from "@/types/smart-media";
import type { Post } from "@hey/indexer";
import type { MetadataAttribute, PostMetadata } from "@lens-protocol/metadata";

const getSmartMediaUrl = (
  attributes: MetadataAttribute[]
): string | undefined => {
  const isBonsaiPlugin = attributes.some((attr) => attr.key === "template");

  if (!isBonsaiPlugin) return;

  return attributes.find((attr) => attr.key === "apiUrl")?.value;
};

/**
 * Resolves complete smart media data from a post's metadata attributes
 *
 * This function attempts to fetch the full smart media data from the API using the post's attributes.
 * It includes timeout handling and graceful error handling for various network conditions.
 *
 * @param attributes - Lens post.metadata.attributes
 * @param postSlug - Lens post.slug
 * @param withVersions - If true, includes version history in the response
 * @param _url - Optional override URL for the API endpoint. If not provided, extracts from attributes.
 * @returns A Promise that resolves to:
 *   - SmartMedia object if successfully resolved
 *   - null if:
 *     - No valid URL found in attributes
 *     - Post not found (404)
 *     - Network timeout/error
 *     - Invalid response format
 */
const resolveSmartMedia = async (
  attributes: MetadataAttribute[],
  postSlug: string,
  withVersions?: boolean,
  _url?: string
): Promise<any | null> => {
  try {
    const url = _url || getSmartMediaUrl(attributes);
    if (!url) return null;

    // Validate URL format
    try {
      new URL(url);
    } catch {
      // Invalid URL format, fail fast
      return null;
    }

    const controller = new AbortController();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error("Request timeout"));
      }, 5000);
    });

    const fetchPromise = fetch(
      `${url}/post/${postSlug}?withVersions=${withVersions}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json"
        }
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) {
          throw new Error("No data received");
        }
        return data;
      })
      .catch((error) => {
        // Handle network errors (DNS failure, connection refused, etc)
        if (
          error instanceof TypeError &&
          error.message.includes("fetch failed")
        ) {
          // Server is unreachable, fail fast
          return null;
        }
        throw error;
      });

    return (await Promise.race([
      fetchPromise,
      timeoutPromise
    ])) as SmartMedia | null;
  } catch (error) {
    if (error instanceof Error) {
      // Only log if it's not a timeout, abort, or network error
      if (
        !error.message.includes("abort") &&
        !error.message.includes("timeout") &&
        !(error instanceof TypeError && error.message.includes("fetch failed"))
      ) {
        console.error(
          `Failed to resolve smart media for post ${postSlug}:`,
          error.message
        );
      }
    }
    return null;
  }
};

/**
 * Retrieves smart media information from a Lens Protocol post (if any)
 *
 * This function checks if a post is a smart media post created through the Bonsai app
 * and extracts relevant metadata. It can either return basic metadata (template, category, mediaUrl)
 * or resolve the full smart media data from the API.
 *
 * @param post - The Lens Protocol post to process
 * @param resolve - If true, fetches complete smart media data from the API. If false, returns basic metadata only.
 * @returns A Promise that resolves to:
 *   - SmartMediaLight: Basic metadata if resolve is false
 *   - SmartMedia: Complete smart media data if resolve is true
 *   - null: If the post is not a smart media post
 */
export const fetchSmartMedia = async (
  _post: Post,
  resolve?: boolean
): Promise<SmartMediaLight | SmartMedia | null> => {
  const post = _post.root || _post;
  const attributes = (post.metadata as unknown as PostMetadata)
    .attributes as MetadataAttribute[];
  if (!attributes?.length) return null;
  const slug = post.slug;
  const appName = post.app?.metadata?.name;
  const isSmartMedia =
    appName === "Bonsai" &&
    attributes?.some((attr: MetadataAttribute) => attr.key === "template");
  if (!isSmartMedia) return null;
  if (resolve) {
    const data = await resolveSmartMedia(attributes, slug, true);
    return {
      ...data,
      template: {
        id: data?.template as string,
        formatted: (data?.template as string)
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      },
      category: {
        id: data?.category as string,
        formatted: (data?.category as string)
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      }
    } as SmartMedia;
  }

  const template = attributes.find(({ key }) => key === "template");
  const category = attributes.find(({ key }) => key === "templateCategory");
  const mediaUrl = attributes.find(({ key }) => key === "apiUrl");
  const isCanvas = attributes.find(({ key }) => key === "isCanvas");

  return {
    ...(template && {
      template: {
        id: template.value,
        formatted: template.value
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      }
    }),
    ...(category && {
      category: {
        id: category.value,
        formatted: category.value
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      }
    }),
    mediaUrl: mediaUrl?.value,
    isCanvas: !!isCanvas?.value
  } as SmartMediaLight;
};
