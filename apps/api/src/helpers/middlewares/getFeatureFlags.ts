import { UNLEASH_API_TOKEN, UNLEASH_API_URL } from "@hey/data/constants";
import axios from "axios";
import { HEY_USER_AGENT } from "../constants";

const getFeatureFlags = async (userId: string) => {
  const { data } = await axios.get(UNLEASH_API_URL, {
    headers: {
      Authorization: UNLEASH_API_TOKEN,
      "User-Agent": HEY_USER_AGENT
    },
    params: {
      appName: "production",
      environment: "production",
      userId
    }
  });

  return data.toggles;
};

export default getFeatureFlags;
