import {
  type AccountFragment,
  type PostMentionFragment,
  useAccountsBulkQuery
} from "@hey/indexer";
import { useState } from "react";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import Skeleton from "@/components/Shared/Skeleton";
import { Card, ErrorMessage, Modal } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import MoreRelevantPeople from "./MoreRelevantPeople";

interface RelevantPeopleProps {
  mentions: PostMentionFragment[];
}

const RelevantPeople = ({ mentions }: RelevantPeopleProps) => {
  const { currentAccount } = useAccountStore();
  const [showMore, setShowMore] = useState(false);

  const accountAddresses = mentions.map((accountMention) =>
    accountMention.__typename === "AccountMention"
      ? accountMention.account
      : accountMention.replace.from
  );

  const { data, error, loading } = useAccountsBulkQuery({
    skip: accountAddresses.length <= 0,
    variables: { request: { addresses: accountAddresses } }
  });

  if (accountAddresses.length <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <div className="pt-2 pb-1">
          <Skeleton className="h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!data?.accountsBulk?.length) {
    return null;
  }

  const firstAccounts = data?.accountsBulk?.slice(0, 5);

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <ErrorMessage error={error} title="Failed to load relevant people" />
        {firstAccounts?.map((account) => (
          <div className="truncate" key={account?.address}>
            <SingleAccount
              account={account}
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
              showUserPreview={false}
            />
          </div>
        ))}
        {(data?.accountsBulk?.length || 0) > 5 && (
          <button
            className="font-bold text-gray-500 dark:text-gray-200"
            onClick={() => setShowMore(true)}
            type="button"
          >
            Show more
          </button>
        )}
      </Card>
      <Modal
        onClose={() => setShowMore(false)}
        show={showMore}
        title="Relevant people"
      >
        <MoreRelevantPeople
          accounts={data?.accountsBulk as AccountFragment[]}
        />
      </Modal>
    </>
  );
};

export default RelevantPeople;
