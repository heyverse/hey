import { STATIC_IMAGES_URL } from "@hey/data/constants";

/**
 * Retrieves the token image URL for a given token symbol.
 *
 * @param symbol The token symbol.
 * @returns The token image URL.
 */
const getTokenImage = (symbol?: string): string => {
  if (!symbol) {
    return "";
  }

  const symbolLowerCase = symbol?.toLowerCase() || "";
  return `${STATIC_IMAGES_URL}/tokens/${symbolLowerCase}.svg`;
};

export default getTokenImage;
