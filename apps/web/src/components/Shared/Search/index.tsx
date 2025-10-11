import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import {
  type AccountFragment,
  AccountsOrderBy,
  type AccountsRequest,
  PageSize,
  useAccountsLazyQuery
} from "@hey/indexer";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Card, Form, Input, useZodForm } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import logEvent from "@/helpers/logEvent";
import { useAccountLinkStore } from "@/store/non-persisted/navigation/useAccountLinkStore";
import { useSearchStore } from "@/store/persisted/useSearchStore";
import RecentAccounts from "./RecentAccounts";

interface SearchProps {
  placeholder?: string;
}

const ValidationSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, { message: "Enter something to search" })
    .max(100, { message: "Query should not exceed 100 characters" })
});

const Search = ({ placeholder = "Search…" }: SearchProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const { setCachedAccount } = useAccountLinkStore();
  const { addAccount } = useSearchStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [accounts, setAccounts] = useState<AccountFragment[]>([]);

  const form = useZodForm({
    defaultValues: { query: "" },
    schema: ValidationSchema
  });

  const query = form.watch("query");
  const debouncedSearchText = useDebounce<string>(query, 500);

  const handleReset = useCallback(() => {
    setShowDropdown(false);
    setAccounts([]);
    form.reset();
  }, [form]);

  const dropdownRef = useClickAway(() => {
    handleReset();
  }) as MutableRefObject<HTMLDivElement>;

  const [searchAccounts, { loading }] = useAccountsLazyQuery();

  const handleSubmit = useCallback(
    ({ query }: z.infer<typeof ValidationSchema>) => {
      const search = query.trim();
      if (pathname === "/search") {
        navigate(`/search?q=${encodeURIComponent(search)}&type=${type}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(search)}&type=accounts`);
      }
      void logEvent("Search");
      handleReset();
    },
    [pathname, navigate, type, handleReset]
  );

  const handleShowDropdown = useCallback(() => {
    setShowDropdown(true);
  }, []);

  useEffect(() => {
    if (pathname !== "/search" && showDropdown && debouncedSearchText) {
      const request: AccountsRequest = {
        filter: { searchBy: { localNameQuery: debouncedSearchText } },
        orderBy: AccountsOrderBy.BestMatch,
        pageSize: PageSize.Fifty
      };

      searchAccounts({ variables: { request } }).then((res) => {
        if (res.data?.accounts?.items) {
          setAccounts(res.data.accounts.items);
        }
      });
    }
  }, [debouncedSearchText]);

  return (
    <div className="w-full">
      <Form form={form} onSubmit={handleSubmit}>
        <Input
          className="px-3 py-3 text-sm"
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={
            <XMarkIcon
              className={cn("cursor-pointer", query ? "visible" : "invisible")}
              onClick={handleReset}
            />
          }
          onClick={handleShowDropdown}
          placeholder={placeholder}
          type="text"
          {...form.register("query")}
        />
      </Form>
      {pathname !== "/search" && showDropdown ? (
        <div className="fixed z-10 mt-2 w-[360px]" ref={dropdownRef}>
          <Card className="max-h-[80vh] overflow-y-auto py-2">
            {!debouncedSearchText && (
              <RecentAccounts onAccountClick={handleReset} />
            )}
            {loading ? (
              <Loader className="my-3" message="Searching users" small />
            ) : (
              <>
                {accounts.map((account) => (
                  <div
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={account.address}
                    onClick={() => {
                      setCachedAccount(account);
                      addAccount(account.address);
                      navigate(getAccount(account).link);
                      handleReset();
                    }}
                  >
                    <SingleAccount
                      account={account}
                      hideFollowButton
                      hideUnfollowButton
                      linkToAccount={false}
                      showUserPreview={false}
                    />
                  </div>
                ))}
                {accounts.length ? null : (
                  <div className="px-4 py-2">
                    Try searching for people or keywords
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
