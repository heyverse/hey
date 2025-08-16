import { LENS_NETWORK } from "../constants";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "../contracts";
import { LENS_ENDPOINT } from "../lens-endpoints";

const config = {
  mainnet: {
    appAddress: MAINNET_CONTRACTS.app,
    defaultCollectToken: MAINNET_CONTRACTS.defaultToken,
    lensApiEndpoint: LENS_ENDPOINT.Mainnet
  },
  staging: {
    appAddress: TESTNET_CONTRACTS.app,
    defaultCollectToken: TESTNET_CONTRACTS.defaultToken,
    lensApiEndpoint: LENS_ENDPOINT.Staging
  },
  testnet: {
    appAddress: TESTNET_CONTRACTS.app,
    defaultCollectToken: TESTNET_CONTRACTS.defaultToken,
    lensApiEndpoint: LENS_ENDPOINT.Testnet
  }
} as const;

type Config = (typeof config)[keyof typeof config];

const getEnvConfig = (): Config => {
  return config[LENS_NETWORK as keyof typeof config] ?? config.mainnet;
};

export default getEnvConfig;
