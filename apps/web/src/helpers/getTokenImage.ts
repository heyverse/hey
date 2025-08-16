import { STATIC_IMAGES_URL } from "@hey/data/constants";

const getTokenImage = (symbol?: string): string => {
  if (!symbol) {
    return `${STATIC_IMAGES_URL}/tokens/gho.svg`;
  }

  const symbolLowerCase = symbol?.toLowerCase() || "";
  return `${STATIC_IMAGES_URL}/tokens/${symbolLowerCase}.svg`;
};

export default getTokenImage;
