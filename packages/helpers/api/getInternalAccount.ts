import { HEY_API_URL } from "@hey/data/constants";
import type { Preferences } from "@hey/types/hey";
import axios from "axios";

export const GET_INTERNAL_ACCOUNT_QUERY_KEY = "getInternalAccount";

const getInternalAccount = async (
  address: string,
  headers: any
): Promise<Preferences> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/internal/account/get`, {
      headers,
      params: { address }
    });

    return data.result;
  } catch {
    return { appIcon: 0, includeLowScore: false, permissions: [] };
  }
};

export default getInternalAccount;
