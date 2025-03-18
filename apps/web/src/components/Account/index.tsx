import MetaTags from "@components/Common/MetaTags";
import NewPost from "@components/Composer/NewPost";
import Cover from "@components/Shared/Cover";
import hasAccess from "@helpers/hasAccess";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { AccountFeedType } from "@hey/data/enums";
import { Features } from "@hey/data/features";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import getAccount from "@hey/helpers/getAccount";
import isAccountDeleted from "@hey/helpers/isAccountDeleted";
import { useAccountQuery } from "@hey/indexer";
import { EmptyState, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import AccountFeed from "./AccountFeed";
import DeletedDetails from "./DeletedDetails";
import Details from "./Details";
import FeedType from "./FeedType";
import AccountPageShimmer from "./Shimmer";
import SuspendedDetails from "./SuspendedDetails";

const ViewProfile: NextPage = () => {
  const {
    isReady,
    query: { username, address, type }
  } = useRouter();
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

  const { data: accountDetails, isLoading: accountDetailsLoading } = useQuery({
    enabled: Boolean(account?.address),
    queryFn: () => getAccountDetails(account?.address),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, account?.address]
  });

  if (!isReady || loading) {
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
    <>
      <MetaTags
        creator={getAccount(account).name}
        description={account.metadata?.bio || ""}
        title={`${getAccount(account).name} (${getAccount(account).usernameWithPrefix}) • ${APP_NAME}`}
      />
      <Cover
        cover={
          isSuspended
            ? `${STATIC_IMAGES_URL}/patterns/2.svg`
            : account?.metadata?.coverPicture ||
              `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout>
        <GridItemFour>{renderAccountDetails()}</GridItemFour>
        <GridItemEight className="space-y-5">
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
                  handle={getAccount(account).usernameWithPrefix}
                  accountDetailsLoading={accountDetailsLoading}
                  address={account.address}
                  type={feedType}
                />
              )}
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
