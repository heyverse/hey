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
import type { ChangeEvent, MutableRefObject } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Card, Input } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountLinkStore } from "@/store/non-persisted/navigation/useAccountLinkStore";
import { useSearchStore } from "@/store/persisted/useSearchStore";
import RecentAccounts from "./RecentAccounts";

interface SearchProps {
  placeholder?: string;
}

const Search = ({ placeholder = "Search…" }: SearchProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const { setCachedAccount } = useAccountLinkStore();
  const { addAccount } = useSearchStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [accounts, setAccounts] = useState<AccountFragment[]>([]);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const handleReset = () => {
    setShowDropdown(false);
    setAccounts([]);
  };

  const dropdownRef = useClickAway(() => {
    handleReset();
  }) as MutableRefObject<HTMLDivElement>;

  const [searchAccounts, { loading }] = useAccountsLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === "/search") {
      navigate(`/search?q=${encodeURIComponent(searchText)}&type=${type}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchText)}&type=accounts`);
    }
    handleReset();
  };

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
      <form onSubmit={handleKeyDown}>
        <Input
          className="px-3 py-3 text-sm"
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={
            <XMarkIcon
              className={cn(
                "cursor-pointer",
                searchText ? "visible" : "invisible"
              )}
              onClick={handleReset}
            />
          }
          onChange={handleSearch}
          onClick={() => setShowDropdown(true)}
          placeholder={placeholder}
          type="text"
          value={searchText}
        />
      </form>
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
