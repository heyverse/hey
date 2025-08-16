import {
  CHAIN,
  IS_MAINNET,
  WALLETCONNECT_PROJECT_ID
} from "@hey/data/constants";
import { familyAccountsConnector } from "family";
import type { ReactNode } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import getRpc from "@/helpers/getRpc";

const connectors = [
  familyAccountsConnector(),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  injected()
];

const config = createConfig({
  chains: [CHAIN],
  connectors,
  transports: {
    [CHAIN.id]: getRpc({ mainnet: IS_MAINNET })
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default Web3Provider;
