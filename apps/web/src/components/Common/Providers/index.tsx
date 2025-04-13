import authLink from "@/helpers/authLink";
import { ThemeProvider } from "@/hooks/useTheme";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@hey/indexer/apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import ErrorBoundary from "../ErrorBoundary";
import PreferencesProvider from "./PreferencesProvider";
import Web3Provider from "./Web3Provider";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const lensApolloClient = apolloClient(authLink);

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ApolloProvider client={lensApolloClient}>
            <PreferencesProvider />
            <ThemeProvider>{children}</ThemeProvider>
          </ApolloProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
