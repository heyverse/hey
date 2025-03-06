import { HEY_API_URL } from "@hey/data/constants";
import type { Preferences } from "@hey/types/hey";
import axios from "axios";

export const GET_PREFERENCES_QUERY_KEY = "getPreferences";

/**
 * Retrieves the account preferences.
 *
 * @param {any} headers - The authentication headers.
 * @returns {Promise<Preferences>} A promise that resolves to the account preferences.
 */
const getPreferences = async (headers: any): Promise<Preferences> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/preferences/get`, {
      headers
    });

    return data.result;
  } catch {
    return { appIcon: 0, includeLowScore: false, permissions: [] };
  }
};

export default getPreferences;
