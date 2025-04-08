import NewPost from "@/components/Composer/NewPost";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import Cover from "@/components/Shared/Cover";
import { EmptyState } from "@/components/Shared/UI";
import hasAccess from "@/helpers/hasAccess";
import { trpc } from "@/helpers/trpc";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { AccountFeedType } from "@hey/data/enums";
import { Features } from "@hey/data/features";
import getAccount from "@hey/helpers/getAccount";
import isAccountDeleted from "@hey/helpers/isAccountDeleted";
import { useAccountQuery } from "@hey/indexer";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { PageLayout } from "../Shared/PageLayout";
import Sidebar from "../Shared/Sidebar";
import AccountFeed from "./AccountFeed";
import DeletedDetails from "./DeletedDetails";
import Details from "./Details";
import FeedType from "./FeedType";
import AccountPageShimmer from "./Shimmer";
import SuspendedDetails from "./SuspendedDetails";

const ViewProfile = () => {
  const { address, username } = useParams<{
    address: string;
    username: string;
  }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || AccountFeedType.Feed;

  const { currentAccount } = useAccountStore();
  const isStaff = hasAccess(Features.Staff);

  const lowerCaseAccountFeedType = [
    AccountFeedType.Feed.toLowerCase(),
    AccountFeedType.Replies.toLowerCase(),
    AccountFeedType.Media.toLowerCase(),
    AccountFeedType.Collects.toLowerCase()
  ];

  const getFeedType = (type: string | undefined) => {
    return type && lowerCaseAccountFeedType.includes(type.toLowerCase())
      ? type.toUpperCase()
      : AccountFeedType.Feed;
  };

  const feedType = getFeedType(Array.isArray(type) ? type[0] : type);

  const { data, error, loading } = useAccountQuery({
    skip: address ? !address : !username,
    variables: {
      request: {
        ...(address
          ? { address }
          : { username: { localName: username as string } })
      }
    }
  });

  const account = data?.account;

  const { data: accountDetails, isLoading: accountDetailsLoading } = useQuery(
    trpc.account.get.queryOptions(
      { address: account?.address },
      { enabled: Boolean(account?.address) }
    )
  );

  if ((!username && !address) || loading) {
    return <AccountPageShimmer />;
  }

  if (!account) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const isSuspended = isStaff ? false : accountDetails?.isSuspended;
  const isDeleted = isAccountDeleted(account);

  const renderAccountDetails = () => {
    if (isDeleted) return <DeletedDetails account={account} />;
    if (isSuspended) return <SuspendedDetails account={account} />;
    return (
      <Details
        isSuspended={accountDetails?.isSuspended || false}
        account={account}
      />
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<NoSymbolIcon className="size-8" />}
      message={isDeleted ? "Account Deleted" : "Account Suspended"}
    />
  );

  return (
    <PageLayout
      title={`${getAccount(account).name} (${getAccount(account).usernameWithPrefix}) • ${APP_NAME}`}
      sidebar={<Sidebar />}
      sidebarPosition="right"
      showSearch
    >
      <Cover
        cover={
          isSuspended
            ? `${STATIC_IMAGES_URL}/patterns/2.svg`
            : account?.metadata?.coverPicture ||
              `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      {renderAccountDetails()}
      {isDeleted || isSuspended ? (
        renderEmptyState()
      ) : (
        <>
          <FeedType feedType={feedType as AccountFeedType} />
          {currentAccount?.address === account?.address && <NewPost />}
          {(feedType === AccountFeedType.Feed ||
            feedType === AccountFeedType.Replies ||
            feedType === AccountFeedType.Media ||
            feedType === AccountFeedType.Collects) && (
            <AccountFeed
              username={getAccount(account).usernameWithPrefix}
              accountDetailsLoading={accountDetailsLoading}
              address={account.address}
              type={feedType}
            />
          )}
        </>
      )}
    </PageLayout>
  );
};

export default ViewProfile;
