import { LENS_NETWORK } from "../constants";
import { MainnetContracts, TestnetContracts } from "../contracts";
import { LENS_ENDPOINT } from "../lens-endpoints";

const getEnvConfig = (): {
  lensApiEndpoint: string;
  defaultCollectToken: `0x${string}`;
  appAddress: `0x${string}`;
} => {
  const testnetContracts = {
    defaultCollectToken: TestnetContracts.DefaultToken,
    appAddress: TestnetContracts.App
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
        defaultCollectToken: MainnetContracts.DefaultToken,
        appAddress: MainnetContracts.App
      };
  }
};

export default getEnvConfig;
