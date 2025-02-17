import { HEY_API_URL } from "@hey/data/constants";
import type { InternalAccount } from "@hey/types/hey";
import axios from "axios";

export const GET_INTERNAL_ACCOUNT_QUERY_KEY = "getInternalAccount";

/**
 * Get internal account
 * @param id account id
 * @param headers auth headers
 * @returns internal account
 */
const getInternalAccount = async (
  address: string,
  headers: any
): Promise<InternalAccount> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/internal/account/get`, {
      headers,
      params: { address }
    });

    return data.result;
  } catch {
    return {
      appIcon: 0,
      hasDismissedOrMintedMembershipNft: true,
      includeLowScore: false,
      permissions: []
    };
  }
};

export default getInternalAccount;
