import { HEY_TREASURY } from "@hey/data/constants";

interface DomainParamConfig {
  name: string;
  value: string;
}

const DOMAIN_PARAM_MAP: Record<string, DomainParamConfig> = {
  "zora.co": { name: "referrer", value: HEY_TREASURY },
  "highlight.xyz": { name: "referrer", value: HEY_TREASURY }
};

const injectReferrerToUrl = (url: string): string => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  const [, config] =
    Object.entries(DOMAIN_PARAM_MAP).find(([domain]) =>
      parsed.hostname.endsWith(domain)
    ) || [];

  if (!config) {
    return url;
  }

  parsed.searchParams.set(config.name, config.value);
  return parsed.toString();
};

export default injectReferrerToUrl;
