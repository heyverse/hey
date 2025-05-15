import { HEY_TREASURY } from "@hey/data/constants";

const DOMAIN_PARAM_MAP: Record<string, { name: string; value: string }> = {
  "zora.co": { name: "referrer", value: HEY_TREASURY },
  "highlight.xyz": { name: "referrer", value: HEY_TREASURY }
};

const injectReferrerToUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const config = DOMAIN_PARAM_MAP[parsed.hostname];
    if (config) {
      parsed.searchParams.set(config.name, config.value);
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
};

export default injectReferrerToUrl;
