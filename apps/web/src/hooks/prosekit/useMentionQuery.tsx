import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountsOrderBy, useAccountsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  address: string;
  displayUsername: string;
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
          orderBy: AccountsOrderBy.BestMatch,
          filter: { searchBy: { localNameQuery: query } }
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
            displayUsername: getAccount(account).usernameWithPrefix,
            username: getAccount(account).username,
            name: getAccount(account).name,
            picture: getAvatar(account),
            subscribed: account.hasSubscribed
          })
        );

      setResults(accountsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
  }, [query, searchAccounts]);

  return results;
};

export default useMentionQuery;
