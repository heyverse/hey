import { IS_MAINNET, NULL_ADDRESS } from "./constants";
import { MainnetContracts, TestnetContracts } from "./contracts";

const mainnetTokens = [
  {
    name: "GHO",
    symbol: "GHO",
    decimals: 18,
    contractAddress: NULL_ADDRESS
  },
  {
    name: "Wrapped GHO",
    symbol: "WGHO",
    decimals: 18,
    contractAddress: MainnetContracts.DefaultToken
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
    name: "Grass",
    symbol: "GRASS",
    decimals: 18,
    contractAddress: NULL_ADDRESS
  },
  {
    name: "Wrapped Grass",
    symbol: "WGRASS",
    decimals: 18,
    contractAddress: TestnetContracts.DefaultToken
  }
];

export const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
