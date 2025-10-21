import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import { type Hex, zeroAddress } from "viem";

const getLensAccount = async (
  handle: string
): Promise<{
  address: Hex;
  name: string;
  avatar: string;
  bio: string;
}> => {
  try {
    const { data } = await apolloClient.query<{
      account: AccountFragment;
    }>({
      fetchPolicy: "no-cache",
      query: AccountDocument,
      variables: { request: { username: { localName: handle } } }
    });

    const address = data.account.owner;
    if (!address)
      return { address: zeroAddress, avatar: "", bio: "", name: "" };
    return {
      address: address.toLowerCase() as Hex,
      avatar: getAvatar(data.account),
      bio: data.account.metadata?.bio ?? "",
      name: getAccount(data.account).name
    };
  } catch {
    return { address: zeroAddress, avatar: "", bio: "", name: "" };
  }
};

export default getLensAccount;
