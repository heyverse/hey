import DismissRecommendedAccount from "@/components/Shared/Account/DismissRecommendedAccount";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import { EmptyState } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import { motion } from "motion/react";
import { Virtualizer } from "virtua";

interface SuggestedProps {
  accounts: AccountFragment[];
}

const Suggested = ({ accounts }: SuggestedProps) => {
  const { currentAccount } = useAccountStore();

  if (!accounts.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message="Nothing to suggest"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.slice(5).map((account, index) => (
          <motion.div
            key={account.address}
            className={cn(
              "divider flex items-start space-x-3 p-5",
              index === accounts.slice(5).length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full">
              <SingleAccount
                hideFollowButton={currentAccount?.address === account.address}
                hideUnfollowButton={currentAccount?.address === account.address}
                account={account}
                showBio
                showUserPreview={false}
              />
            </div>
            <div className="mt-3.5">
              <DismissRecommendedAccount account={account} />
            </div>
          </motion.div>
        ))}
      </Virtualizer>
    </div>
  );
};

export default Suggested;
