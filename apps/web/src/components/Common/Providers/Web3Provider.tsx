import getRpc from "@/helpers/getRpc";
import { CHAIN, IS_MAINNET } from "@hey/data/constants";
import { familyAccountsConnector } from "family";
import type { ReactNode } from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

const connectors = [familyAccountsConnector(), injected()];

const config = createConfig({
  chains: [CHAIN],
  transports: {
    [CHAIN.id]: getRpc({ mainnet: IS_MAINNET })
  },
  connectors
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default Web3Provider;
