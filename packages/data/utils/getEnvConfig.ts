import { LENS_NETWORK } from "../constants";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "../contracts";
import { LENS_ENDPOINT } from "../lens-endpoints";

const getEnvConfig = (): {
  lensApiEndpoint: string;
  defaultCollectToken: `0x${string}`;
  appAddress: `0x${string}`;
} => {
  const testnetContracts = {
    defaultCollectToken: TESTNET_CONTRACTS.defaultToken,
    appAddress: TESTNET_CONTRACTS.app
  };

  switch (LENS_NETWORK) {
    case "testnet":
      return {
        lensApiEndpoint: LENS_ENDPOINT.Testnet,
        ...testnetContracts
      };
    case "staging":
      return {
        lensApiEndpoint: LENS_ENDPOINT.Staging,
        ...testnetContracts
      };
    default:
      return {
        lensApiEndpoint: LENS_ENDPOINT.Mainnet,
        defaultCollectToken: MAINNET_CONTRACTS.defaultToken,
        appAddress: MAINNET_CONTRACTS.app
      };
  }
};

export default getEnvConfig;
