import { isAddress } from "viem";

/**
 * Retrieves the formatted address string, returning a lowercase string with the first
 * and last slice characters visible and the rest replaced with an ellipsis.
 *
 * @param address The address string to format.
 * @param slice The number of characters at the start and end of the string
 * @returns A formatted string.
 */
const formatAddress = (address: string | null, sliceSize = 4): string => {
  if (!address) {
    return "";
  }

  const formattedAddress = address.toLowerCase();

  if (isAddress(formattedAddress)) {
    const start = formattedAddress.slice(0, sliceSize);
    const end = formattedAddress.slice(formattedAddress.length - sliceSize);
    return `${start}…${end}`;
  }

  return formattedAddress;
};

export default formatAddress;
