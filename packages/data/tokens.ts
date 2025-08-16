import { IS_MAINNET } from "./constants";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "./contracts";

const mainnetTokens = [
  {
    contractAddress: MAINNET_CONTRACTS.defaultToken,
    decimals: 18,
    name: "Wrapped GHO",
    symbol: "WGHO"
  },
  {
    contractAddress: "0xB0588f9A9cADe7CD5f194a5fe77AcD6A58250f82",
    decimals: 18,
    name: "Bonsai",
    symbol: "BONSAI"
  }
];

const testnetTokens = [
  {
    contractAddress: TESTNET_CONTRACTS.defaultToken,
    decimals: 18,
    name: "Wrapped Grass",
    symbol: "WGRASS"
  }
];

export const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
