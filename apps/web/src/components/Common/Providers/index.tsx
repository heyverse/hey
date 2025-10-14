import { ApolloLink, ApolloProvider, from } from "@apollo/client";
import { createApolloClient } from "@hey/indexer/apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import authLink from "@/helpers/authLink";
import logEvent from "@/helpers/logEvent";
import { ThemeProvider } from "@/hooks/useTheme";
import Web3Provider from "./Web3Provider";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const logLink = new ApolloLink((operation, forward) => {
  try {
    const defs = operation.query.definitions as Array<{
      kind?: string;
      operation?: string;
    }>;
    const opType =
      defs?.find((d) => d.kind === "OperationDefinition")?.operation || "query";
    const name = operation.operationName || "anonymous";
    const variables = operation.variables || {};

    void logEvent(`GraphQL ${opType}: ${name} - ${JSON.stringify(variables)}`);
  } catch {}

  return forward(operation);
});

const lensApolloClient = createApolloClient(from([logLink, authLink]));

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ApolloProvider client={lensApolloClient}>
            <HelmetProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </HelmetProvider>
          </ApolloProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
