import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import { type Hex, zeroAddress } from "viem";

interface LensAccount {
  address: Hex;
  texts: {
    avatar: string;
    description: string;
    name: string;
    url: string;
  };
}

const defaultAccount: LensAccount = {
  address: zeroAddress,
  texts: {
    avatar: "",
    description: "",
    name: "",
    url: ""
  }
};

const getLensAccount = async (handle: string): Promise<LensAccount> => {
  try {
    const { data } = await apolloClient.query<{
      account: AccountFragment;
    }>({
      fetchPolicy: "no-cache",
      query: AccountDocument,
      variables: { request: { username: { localName: handle } } }
    });

    if (!data.account.hasSubscribed) {
      return defaultAccount;
    }

    const address = data.account.owner;
    if (!address) return defaultAccount;
    return {
      address: address.toLowerCase() as Hex,
      texts: {
        avatar: getAvatar(data.account),
        description: data.account.metadata?.bio ?? "",
        name: getAccount(data.account).name,
        url: `https://hey.xyz${getAccount(data.account).link}`
      }
    };
  } catch {
    return defaultAccount;
  }
};

export default getLensAccount;
