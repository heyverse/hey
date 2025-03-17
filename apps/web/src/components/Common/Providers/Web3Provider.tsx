import { heyFont } from "@helpers/fonts";
import {
  APP_NAME,
  APP_URL,
  BRAND_COLOR,
  DESCRIPTION,
  STATIC_IMAGES_URL,
  WALLETCONNECT_PROJECT_ID
} from "@hey/data/constants";
import getRpc from "@hey/helpers/getRpc";
import { chains } from "@lens-chain/sdk/viem";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { FC, ReactNode } from "react";
import { WagmiProvider, createConfig } from "wagmi";

const config = createConfig(
  getDefaultConfig({
    chains: [chains.testnet, chains.testnet],
    transports: {
      // TODO: Make this support mainnet also
      [chains.testnet.id]: getRpc({ mainnet: false }),
      [chains.testnet.id]: getRpc({ mainnet: false })
    },
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
    appName: APP_NAME,
    appDescription: DESCRIPTION,
    appUrl: APP_URL,
    appIcon: `${STATIC_IMAGES_URL}/app-icon/0.png`
  })
);

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider
        theme="soft"
        options={{
          hideNoWalletCTA: true,
          hideQuestionMarkCTA: true
        }}
        customTheme={{
          "--ck-font-family": heyFont.style.fontFamily,
          "--ck-border-radius": "12px",
          "--ck-body-background": "#ffffff",
          "--ck-focus-color": BRAND_COLOR
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
