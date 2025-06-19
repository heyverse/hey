import { LENS_NETWORK } from "../constants";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "../contracts";
import { LENS_ENDPOINT } from "../lens-endpoints";

const config = {
  mainnet: {
    lensApiEndpoint: LENS_ENDPOINT.Mainnet,
    defaultCollectToken: MAINNET_CONTRACTS.defaultToken,
    appAddress: MAINNET_CONTRACTS.app
  },
  testnet: {
    lensApiEndpoint: LENS_ENDPOINT.Testnet,
    defaultCollectToken: TESTNET_CONTRACTS.defaultToken,
    appAddress: TESTNET_CONTRACTS.app
  },
  staging: {
    lensApiEndpoint: LENS_ENDPOINT.Staging,
    defaultCollectToken: TESTNET_CONTRACTS.defaultToken,
    appAddress: TESTNET_CONTRACTS.app
  }
} as const;

type Config = (typeof config)[keyof typeof config];

const getEnvConfig = (): Config => {
  return config[LENS_NETWORK as keyof typeof config] ?? config.mainnet;
};

export default getEnvConfig;
