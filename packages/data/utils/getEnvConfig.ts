import { LENS_NETWORK } from "../constants";
import { MainnetContracts, TestnetContracts } from "../contracts";
import LensEndpoint from "../lens-endpoints";

const getEnvConfig = (): {
  lensApiEndpoint: string;
  defaultCollectToken: `0x${string}`;
  appAddress: `0x${string}`;
  sponsorAddress: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case "testnet":
      return {
        lensApiEndpoint: LensEndpoint.Testnet,
        defaultCollectToken: TestnetContracts.DefaultToken,
        appAddress: TestnetContracts.App,
        sponsorAddress: TestnetContracts.Sponsor
      };
    default:
      return {
        lensApiEndpoint: LensEndpoint.Mainnet,
        defaultCollectToken: MainnetContracts.DefaultToken,
        appAddress: MainnetContracts.App,
        sponsorAddress: MainnetContracts.Sponsor
      };
  }
};

export default getEnvConfig;
