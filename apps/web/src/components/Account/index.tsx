import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { AccountFeedType } from "@hey/data/enums";
import getAccount from "@hey/helpers/getAccount";
import isAccountDeleted from "@hey/helpers/isAccountDeleted";
import { useAccountQuery } from "@hey/indexer";
import { useState } from "react";
import { useParams } from "react-router";
import NewPost from "@/components/Composer/NewPost";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import Cover from "@/components/Shared/Cover";
import PageLayout from "@/components/Shared/PageLayout";
import { EmptyState } from "@/components/Shared/UI";
import {
  getBlockedByMeMessage,
  getBlockedMeMessage
} from "@/helpers/getBlockedMessage";
import { useAccountLinkStore } from "@/store/non-persisted/navigation/useAccountLinkStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import AccountFeed from "./AccountFeed";
import DeletedDetails from "./DeletedDetails";
import Details from "./Details";
import FeedType from "./FeedType";
import AccountPageShimmer from "./Shimmer";

const ViewAccount = () => {
  const { address, username } = useParams<{
    address: string;
    username: string;
  }>();
  const [feedType, setFeedType] = useState<AccountFeedType>(
    AccountFeedType.Feed
  );

  const { currentAccount } = useAccountStore();
  const { cachedAccount, setCachedAccount } = useAccountLinkStore();

  const { data, error, loading } = useAccountQuery({
    onCompleted: (data) => {
      if (data?.account) {
        setCachedAccount(null);
      }
    },
    skip: address ? !address : !username,
    variables: {
      request: {
        ...(address
          ? { address }
          : { username: { localName: username as string } })
      }
    }
  });

  const account = data?.account ?? cachedAccount;

  if ((!username && !address) || (loading && !cachedAccount)) {
    return <AccountPageShimmer />;
  }

  if (!account) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const isDeleted = isAccountDeleted(account);
  const isBlockedByMe = account?.operations?.isBlockedByMe;
  const hasBlockedMe = account?.operations?.hasBlockedMe;

  const accountInfo = getAccount(account);

  const renderAccountDetails = () => {
    if (isDeleted) return <DeletedDetails account={account} />;

    return (
      <Details
        account={account}
        hasBlockedMe={account?.operations?.hasBlockedMe || false}
        isBlockedByMe={account?.operations?.isBlockedByMe || false}
      />
    );
  };

  const renderEmptyState = () => {
    const message = isDeleted
      ? "Account Deleted"
      : isBlockedByMe
        ? getBlockedByMeMessage(account)
        : hasBlockedMe
          ? getBlockedMeMessage(account)
          : null;

    return (
      <EmptyState
        icon={<NoSymbolIcon className="size-8" />}
        message={message}
      />
    );
  };

  return (
    <PageLayout
      title={`${accountInfo.name} (${accountInfo.usernameWithPrefix}) • Hey`}
      zeroTopMargin
    >
      <Cover
        cover={
          account?.metadata?.coverPicture ||
          `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      {renderAccountDetails()}
      {isDeleted || isBlockedByMe || hasBlockedMe ? (
        renderEmptyState()
      ) : (
        <>
          <FeedType feedType={feedType} setFeedType={setFeedType} />
          {currentAccount?.address === account?.address && <NewPost />}
          {(feedType === AccountFeedType.Feed ||
            feedType === AccountFeedType.Replies ||
            feedType === AccountFeedType.Media ||
            feedType === AccountFeedType.Collects) && (
            <AccountFeed
              address={account.address}
              type={feedType}
              username={accountInfo.usernameWithPrefix}
            />
          )}
        </>
      )}
    </PageLayout>
  );
};

export default ViewAccount;
