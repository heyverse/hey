import { HEY_ENS_NAMESPACE } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type {
  Maybe,
  MetadataAttributeFragment,
  UsernameFragment
} from "@hey/indexer";
import {
  AccountDocument,
  type AccountFragment,
  UsernameDocument
} from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import { type Hex, zeroAddress } from "viem";

const getAccountAttribute = (
  key: string,
  attributes: Maybe<MetadataAttributeFragment[]> = []
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

interface LensAccount {
  address: Hex;
  texts: {
    avatar: string;
    description: string;
    name?: string;
    url: string;
    location?: string;
    "com.twitter"?: string;
  };
}

const defaultAccount: LensAccount = {
  address: zeroAddress,
  texts: {
    avatar: "",
    "com.twitter": "",
    description: "",
    location: "",
    name: "",
    url: ""
  }
};

const getLensAccount = async (handle: string): Promise<LensAccount> => {
  try {
    const { data: usernameData } = await apolloClient.query<{
      username: UsernameFragment;
    }>({
      fetchPolicy: "no-cache",
      query: UsernameDocument,
      variables: {
        request: {
          username: { localName: handle, namespace: HEY_ENS_NAMESPACE }
        }
      }
    });

    if (!usernameData.username) {
      return defaultAccount;
    }

    const { data } = await apolloClient.query<{
      account: AccountFragment;
    }>({
      fetchPolicy: "no-cache",
      query: AccountDocument,
      variables: { request: { address: usernameData.username.ownedBy } }
    });

    if (!data.account.isBeta) {
      return defaultAccount;
    }

    const address = data.account.owner;
    if (!address) return defaultAccount;
    return {
      address: address.toLowerCase() as Hex,
      texts: {
        avatar: getAvatar(data.account),
        "com.twitter": getAccountAttribute(
          "x",
          data.account?.metadata?.attributes
        ),
        description: data.account.metadata?.bio ?? "",
        location: getAccountAttribute(
          "location",
          data.account?.metadata?.attributes
        ),
        name: getAccount(data.account).name,
        url: `https://hey.xyz${getAccount(data.account).link}`
      }
    };
  } catch {
    return defaultAccount;
  }
};

export default getLensAccount;
