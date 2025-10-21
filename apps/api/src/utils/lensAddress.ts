import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Hex } from "viem";

const getLensAddress = async (handle: string): Promise<Hex> => {
  try {
    const { data } = await apolloClient.query<{
      acount: AccountFragment;
    }>({
      fetchPolicy: "no-cache",
      query: AccountDocument,
      variables: { request: { username: { localName: handle } } }
    });

    const address = data.acount.address;
    if (!address) return "0x0000000000000000000000000000000000000000";
    return address.toLowerCase() as Hex;
  } catch {
    return "0x0000000000000000000000000000000000000000";
  }
};

export default getLensAddress;
