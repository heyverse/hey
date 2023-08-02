import {
  APP_NAME,
  IS_MAINNET,
  WALLETCONNECT_PROJECT_ID
} from '@lenster/data/constants';
import { ApolloProvider, webClient } from '@lenster/lens/apollo';
import getRpc from '@lenster/lib/getRpc';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import LanguageProvider from './LanguageProvider';
import UserSigNoncesProvider from './UserSigNoncesProvider';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: getRpc(chain.id) }) })]
);
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains, projectId: WALLETCONNECT_PROJECT_ID }),
      argentWallet({ chains, projectId: WALLETCONNECT_PROJECT_ID }),
      trustWallet({ chains, projectId: WALLETCONNECT_PROJECT_ID }),
      ledgerWallet({ chains, projectId: WALLETCONNECT_PROJECT_ID }),
      coinbaseWallet({ chains, appName: APP_NAME }),
      walletConnectWallet({
        chains,
        projectId: WALLETCONNECT_PROJECT_ID,
        options: {
          qrModalOptions: {
            explorerExcludedWalletIds: 'ALL'
          },
          projectId: WALLETCONNECT_PROJECT_ID
        }
      })
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: '' })
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const apolloClient = webClient;

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <WagmiConfig config={wagmiConfig}>
          <ApolloProvider client={apolloClient}>
            <UserSigNoncesProvider />
            <QueryClientProvider client={queryClient}>
              <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </LivepeerConfig>
            </QueryClientProvider>
          </ApolloProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </LanguageProvider>
  );
};

export default Providers;
