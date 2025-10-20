import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountsOrderBy, useAccountsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  address: string;
  username: string;
  name: string;
  picture: string;
  subscribed: boolean;
};

const useMentionQuery = (query: string): MentionAccount[] => {
  const [results, setResults] = useState<MentionAccount[]>([]);
  const [searchAccounts] = useAccountsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchAccounts({
      variables: {
        request: {
          filter: { searchBy: { localNameQuery: query } },
          orderBy: AccountsOrderBy.BestMatch
        }
      }
    }).then(({ data }) => {
      const search = data?.accounts;
      const accountsSearchResult = search;
      const accounts = accountsSearchResult?.items;
      const accountsResults = (accounts ?? [])
        .filter(
          (account) =>
            !account.operations?.isBlockedByMe &&
            !account.operations?.hasBlockedMe
        )
        .map(
          (account): MentionAccount => ({
            address: account.address,
            name: getAccount(account).name,
            picture: getAvatar(account),
            subscribed: account.hasSubscribed,
            username: getAccount(account).username
          })
        );

      setResults(accountsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
  }, [query, searchAccounts]);

  return results;
};

export default useMentionQuery;
