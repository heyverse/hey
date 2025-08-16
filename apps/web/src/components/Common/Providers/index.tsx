import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import authLink from "@/helpers/authLink";
import { ThemeProvider } from "@/hooks/useTheme";
import PreferencesProvider from "./PreferencesProvider";
import Web3Provider from "./Web3Provider";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const lensApolloClient = createApolloClient(authLink);

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ApolloProvider client={lensApolloClient}>
            <PreferencesProvider>
              <HelmetProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </HelmetProvider>
            </PreferencesProvider>
          </ApolloProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
