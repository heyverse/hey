import PageLayout from "@/components/Shared/PageLayout";
import { default as SearchInput } from "@/components/Shared/Search";
import Sidebar from "@/components/Shared/Sidebar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router";
import { EmptyState } from "../Shared/UI";
import Accounts from "./Accounts";
import FeedType, { SearchTabFocus } from "./FeedType";
import Posts from "./Posts";

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const type =
    searchParams.get("type") || SearchTabFocus.Accounts.toLowerCase();

  const lowerCaseFeedType = [
    SearchTabFocus.Accounts.toLowerCase(),
    SearchTabFocus.Posts.toLowerCase()
  ];

  const getFeedType = (type: string | undefined) => {
    return type && lowerCaseFeedType.includes(type.toLowerCase())
      ? type.toUpperCase()
      : SearchTabFocus.Accounts;
  };

  const feedType = getFeedType(Array.isArray(type) ? type[0] : type);

  return (
    <PageLayout title="Search" sidebar={<Sidebar />} hideSearch>
      <div className="px-5 md:px-0">
        <SearchInput />
      </div>
      <FeedType feedType={feedType as SearchTabFocus} />
      {!q && (
        <EmptyState
          icon={<MagnifyingGlassIcon className="size-8" />}
          message="Search for accounts or posts"
        />
      )}
      {q && feedType === SearchTabFocus.Accounts ? (
        <Accounts query={q as string} />
      ) : null}
      {q && feedType === SearchTabFocus.Posts ? (
        <Posts query={q as string} />
      ) : null}
    </PageLayout>
  );
};

export default Search;
