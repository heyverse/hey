import type { ApolloLink } from "@apollo/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import httpLink from "./httpLink";
import retryLink from "./retryLink";

// biome-ignore lint/style/noVar: hoisted mocks require var declarations
var fromMock: ReturnType<typeof vi.fn>;
// biome-ignore lint/style/noVar: hoisted mocks require var declarations
var ApolloClientMock: ReturnType<typeof vi.fn>;

vi.mock("@apollo/client", async () => {
  const actual: any = await vi.importActual("@apollo/client");
  fromMock = vi.fn((links: ApolloLink[]) => links);
  ApolloClientMock = vi.fn().mockImplementation((config: any) => ({ config }));
  return {
    ...actual,
    ApolloClient: ApolloClientMock,
    from: fromMock
  };
});

import apolloClient from "./client";

describe("apolloClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates client without auth link", () => {
    const client = apolloClient() as any;

    expect(fromMock).toHaveBeenCalledWith([retryLink, httpLink]);
    expect(ApolloClientMock).toHaveBeenCalled();
    expect(ApolloClientMock.mock.calls[0][0].link).toEqual([
      retryLink,
      httpLink
    ]);
    expect(client.config.link).toEqual([retryLink, httpLink]);
  });

  it("creates client with auth link", () => {
    const authLink = {} as ApolloLink;
    const client = apolloClient(authLink) as any;

    expect(fromMock).toHaveBeenCalledWith([authLink, retryLink, httpLink]);
    expect(ApolloClientMock).toHaveBeenCalled();
    expect(ApolloClientMock.mock.calls[0][0].link).toEqual([
      authLink,
      retryLink,
      httpLink
    ]);
    expect(client.config.link).toEqual([authLink, retryLink, httpLink]);
  });
});
