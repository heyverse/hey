import { isAddress } from "viem";

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
