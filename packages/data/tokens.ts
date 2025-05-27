import { IS_MAINNET } from "./constants";
import { MainnetContracts, TestnetContracts } from "./contracts";

const mainnetTokens = [
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
    name: "Wrapped Grass",
    symbol: "WGRASS",
    decimals: 18,
    contractAddress: TestnetContracts.DefaultToken
  }
];

export const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
