import { CONTRACTS } from "../contracts";

const config = {
  appAddress: CONTRACTS.app,
  defaultCollectToken: CONTRACTS.defaultToken,
  lensApiEndpoint: "https://api.lens.xyz/graphql"
};

const getEnvConfig = () => {
  return config;
};

export default getEnvConfig;
