import { IS_MAINNET } from "./constants";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "./contracts";

const mainnetTokens = [
  {
    name: "Wrapped GHO",
    symbol: "WGHO",
    decimals: 18,
    contractAddress: MAINNET_CONTRACTS.defaultToken
  },
  {
    name: "Bonsai",
    symbol: "BONSAI",
    decimals: 18,
    contractAddress: "0xB0588f9A9cADe7CD5f194a5fe77AcD6A58250f82"
  }
];

const testnetTokens = [
  {
    name: "Wrapped Grass",
    symbol: "WGRASS",
    decimals: 18,
    contractAddress: TESTNET_CONTRACTS.defaultToken
  }
];

export const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
