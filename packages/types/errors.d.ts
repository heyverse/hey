import type { ApolloError } from "@apollo/client";
import type { ServerParseError } from "@apollo/client/link/http";
import type { ServerError } from "@apollo/client/link/utils";

export type ApolloClientError =
  | ApolloError
  | ServerError
  | ServerParseError
  | Error;
